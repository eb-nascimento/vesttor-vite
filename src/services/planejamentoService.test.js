import { beforeEach, describe, expect, it, vi } from "vitest";
import { onSnapshot } from "firebase/firestore";
const state = vi.hoisted(() => ({ docs: new Map(), queue: Promise.resolve() }));
vi.mock("../config/firebase", () => ({ db: {} }));
vi.mock("./repositorioFinanceiro", () => ({ colecaoUsuario: (uid) => `usuarios/${uid}/planejamentos`, consultaPeriodo: vi.fn() }));
vi.mock("firebase/firestore", () => ({
  doc: (...args) => args.filter((item) => typeof item === "string").join("/"),
  onSnapshot: vi.fn(), serverTimestamp: () => "timestamp",
  runTransaction: (_, callback) => {
    const task = state.queue.then(() => callback({
      get: async (ref) => ({ exists: () => state.docs.has(ref), data: () => state.docs.get(ref) }),
      set: (ref, data) => state.docs.set(ref, data), delete: (ref) => state.docs.delete(ref),
    }));
    state.queue = task.catch(() => {});
    return task;
  },
}));
import { criarPlanejamentoNaApi, atualizarPlanejamentoNaApi, idPlanejamento, onPlanejamentoChange } from "./planejamentoService";
const dados = { mesAno: "2026-11", tipo: "Fixo", categoria: "Transporte", planejado: 100 };
const path = (item) => `usuarios/u1/planejamentos/${idPlanejamento(item)}`;
beforeEach(() => { state.docs.clear(); state.queue = Promise.resolve(); });
describe("unicidade de orçamentos", () => {
  it("apresenta apenas os registros no novo formato, sem apagar os antigos", () => {
    const atual = { ...dados, planejadoCentavos: 10000 };
    const receber = vi.fn();
    onPlanejamentoChange("u1", receber, vi.fn(), dados.mesAno);
    const callback = vi.mocked(onSnapshot).mock.calls.at(-1)[1];
    callback({ docs: [{ id: "antigo", data: () => atual }, { id: idPlanejamento(atual), data: () => atual }] });
    expect(receber).toHaveBeenCalledWith([expect.objectContaining({ id: idPlanejamento(atual), planejado: 100 })]);
  });
  it("aceita fixo e variável na mesma categoria", async () => {
    await criarPlanejamentoNaApi(dados, "u1");
    await criarPlanejamentoNaApi({ ...dados, tipo: "Variável" }, "u1");
    expect(state.docs.size).toBe(2);
  });
  it("rejeita criações concorrentes da mesma identidade", async () => {
    const resultados = await Promise.allSettled([criarPlanejamentoNaApi(dados, "u1"), criarPlanejamentoNaApi(dados, "u1")]);
    expect(resultados.map((item) => item.status).sort()).toEqual(["fulfilled", "rejected"]);
    expect(state.docs.size).toBe(1);
  });
  it("rejeita edição para uma identidade já existente", async () => {
    await criarPlanejamentoNaApi(dados, "u1");
    await criarPlanejamentoNaApi({ ...dados, tipo: "Variável" }, "u1");
    await expect(atualizarPlanejamentoNaApi(idPlanejamento(dados), { tipo: "Variável" }, "u1")).rejects.toMatchObject({ code: "planejamento-duplicado" });
    expect(state.docs.size).toBe(2);
  });
  it("move a edição de categoria sem perder a data de criação", async () => {
    await criarPlanejamentoNaApi(dados, "u1");
    await atualizarPlanejamentoNaApi(idPlanejamento(dados), { categoria: "Moradia", planejado: 200 }, "u1");
    expect(state.docs.has(path(dados))).toBe(false);
    expect(state.docs.get(path({ ...dados, categoria: "Moradia" }))).toMatchObject({ planejadoCentavos: 20000, dataCriacao: "timestamp" });
  });
});
