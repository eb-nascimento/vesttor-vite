import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase-admin/firestore";
import { converterDocumento, migrarUsuario, reverterMigracao } from "./migracaoFinanceira";

function bancoFake() {
  const dados = new Map([["transacoes/t1", { userId: "u1", data: Timestamp.fromDate(new Date("2026-10-01")), tipo: "receita", descricao: "Teste", valor: 0.29 }]]);
  const snapshot = (path) => ({ ref: ref(path), id: path.split("/").at(-1), exists: dados.has(path), data: () => dados.get(path) });
  const ref = (path) => ({ path, get: async () => snapshot(path) });
  const db = {
    doc: ref,
    collection: (nome) => ({ where: (_, __, uid) => ({ get: async () => ({ docs: [...dados.keys()].filter((path) => path.startsWith(`${nome}/`) && dados.get(path).userId === uid).map(snapshot) }) }) }),
    runTransaction: async (fn) => fn({ get: async (referencia) => snapshot(referencia.path), create: (referencia, valor) => dados.set(referencia.path, valor), delete: (referencia) => dados.delete(referencia.path) }),
  };
  return { db, dados };
}
describe("migração financeira", () => {
  it("simula sem escrever, copia com IDs estáveis e não duplica ao repetir", async () => {
    const { db, dados } = bancoFake();
    expect((await migrarUsuario(db, "u1")).criados).toBe(1);
    expect(dados.size).toBe(1);
    const relatorio = await migrarUsuario(db, "u1", { aplicar: true });
    expect(relatorio.criados).toBe(1);
    expect(relatorio.totais.transacoes).toMatchObject({ somaOrigemCentavos: 29, somaDestinoCentavos: 29 });
    expect(dados.get("usuarios/u1/transacoes/t1").valorCentavos).toBe(29);
    expect(dados.has("transacoes/t1")).toBe(true);
    expect((await migrarUsuario(db, "u1", { aplicar: true })).existentes).toBe(1);
    expect(dados.size).toBe(2);
  });
  it("não sobrescreve destino divergente nem lê outro proprietário", async () => {
    const { db, dados } = bancoFake();
    dados.set("usuarios/u1/transacoes/t1", { valorCentavos: 99 });
    expect((await migrarUsuario(db, "u1", { aplicar: true })).rejeitados).toHaveLength(1);
    expect(dados.get("usuarios/u1/transacoes/t1").valorCentavos).toBe(99);
    expect((await migrarUsuario(db, "outro", { aplicar: true })).criados).toBe(0);
  });
  it("rejeita documentos sem contrato válido", () => {
    expect(() => converterDocumento("transacoes", { userId: "u1", valor: 1 })).toThrow();
    expect(() => converterDocumento("planejamentos", { userId: "u1", mesAno: "2026-99" })).toThrow();
  });
  it("rollback simula, preserva alterações posteriores e remove só cópias intactas", async () => {
    const { db, dados } = bancoFake();
    const relatorio = await migrarUsuario(db, "u1", { aplicar: true });
    expect((await reverterMigracao(db, relatorio)).revertidos).toBe(1);
    expect(dados.size).toBe(2);
    const alvo = dados.get("usuarios/u1/transacoes/t1");
    dados.set("usuarios/u1/transacoes/t1", { ...alvo, descricao: "Alterada" });
    expect((await reverterMigracao(db, relatorio, { aplicar: true })).rejeitados).toHaveLength(1);
    dados.set("usuarios/u1/transacoes/t1", alvo);
    expect((await reverterMigracao(db, relatorio, { aplicar: true })).revertidos).toBe(1);
    expect(dados.size).toBe(1);
  });
});
