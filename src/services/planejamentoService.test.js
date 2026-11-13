import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ privados: [], legado: [], documents: new Map(), writes: [], queue: Promise.resolve() }));
vi.mock("../config/firebase", () => ({ db: {} }));
vi.mock("./repositorioFinanceiro", () => ({
  colecaoUsuario: (uid) => `usuarios/${uid}/planejamentos`, observarPeriodo: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  collection: (_, nome) => nome,
  doc: (...args) => args.filter((item) => typeof item === "string").join("/"),
  where: vi.fn(), query: (ref) => ref,
  getDocs: async (ref) => ({ docs: ref.startsWith("usuarios/") ? state.privados : state.legado }),
  serverTimestamp: () => "timestamp",
  runTransaction: (_, callback) => {
    const operation = state.queue.then(() => callback({
      get: async (ref) => ({ exists: () => state.documents.has(ref), data: () => state.documents.get(ref) }),
      set: (ref, dados) => { state.documents.set(ref, dados); state.writes.push(ref); },
      delete: (ref) => state.documents.delete(ref),
    }));
    state.queue = operation.catch(() => {});
    return operation;
  },
}));
import { criarPlanejamentoNaApi, atualizarPlanejamentoNaApi } from "./planejamentoService";
const novo = { categoria: "Outros", tipo: "Entrada", planejado: 100, mesAno: "2026-11" };
beforeEach(() => {
  state.privados = []; state.legado = []; state.documents.clear(); state.writes = []; state.queue = Promise.resolve();
});
const item = (id, dados) => ({ id, data: () => dados });

describe("unicidade de orçamento", () => {
  it("rejeita duplicata legada sem gravar", async () => {
    state.legado = [item("antigo", novo)];
    await expect(criarPlanejamentoNaApi(novo, "u1")).rejects.toMatchObject({ code: "planejamento-duplicado" });
    expect(state.writes).toHaveLength(0);
  });
  it("permite Outros em naturezas e meses diferentes", async () => {
    state.privados = [item("existente", novo)];
    await criarPlanejamentoNaApi({ ...novo, tipo: "Variável" }, "u1");
    await criarPlanejamentoNaApi({ ...novo, mesAno: "2026-12" }, "u1");
    expect(state.writes).toHaveLength(2);
  });
  it("permite fixo e variável na mesma categoria, inclusive com o ID antigo", async () => {
    state.privados = [item("existente", { ...novo, tipo: "Fixo" })];
    await criarPlanejamentoNaApi({ ...novo, tipo: "Variável" }, "u1");
    expect(state.writes).toHaveLength(1);
    expect(state.writes[0]).toContain("-variavel-");
  });
  it.each(["Fixo", "Variável"])("rejeita duplicata da mesma classificação %s", async (tipo) => {
    state.privados = [item("existente", { ...novo, tipo })];
    await expect(criarPlanejamentoNaApi({ ...novo, tipo }, "u1")).rejects.toMatchObject({ code: "planejamento-duplicado" });
    expect(state.writes).toHaveLength(0);
  });
  it("cria um fixo e um variável simultaneamente em documentos separados", async () => {
    await Promise.all(["Fixo", "Variável"].map((tipo) => criarPlanejamentoNaApi({ ...novo, tipo }, "u1")));
    expect(new Set(state.writes).size).toBe(2);
  });
  it("criações concorrentes disputam o mesmo documento", async () => {
    const results = await Promise.allSettled([criarPlanejamentoNaApi(novo, "u1"), criarPlanejamentoNaApi(novo, "u1")]);
    expect(results.map((r) => r.status).sort()).toEqual(["fulfilled", "rejected"]);
    expect(state.writes).toHaveLength(1);
  });
  it("bloqueia edição para uma categoria já planejada", async () => {
    state.privados = [item("p1", { ...novo, categoria: "Salário" }), item("p2", novo)];
    await expect(atualizarPlanejamentoNaApi("p1", { categoria: "Outros" }, "u1")).rejects.toMatchObject({ code: "planejamento-duplicado" });
  });
  it("edita registro antigo preservando criação e convertendo reais para centavos", async () => {
    const dados = { ...novo, userId: "u1", dataCriacao: "original" };
    state.privados = [item("p1", dados)];
    state.documents.set("usuarios/u1/planejamentos/p1", dados);
    await atualizarPlanejamentoNaApi("p1", { planejado: 200 }, "u1");
    expect(state.documents.has("usuarios/u1/planejamentos/p1")).toBe(false);
    expect(state.documents.get(state.writes[0])).toMatchObject({ planejadoCentavos: 20000, dataCriacao: "original" });
    expect(state.documents.get(state.writes[0])).not.toHaveProperty("planejado");
  });
});
