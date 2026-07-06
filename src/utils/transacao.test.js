import { describe, expect, it } from "vitest";
import { filtrarTransacoes } from "./transacao";

describe("filtrarTransacoes", () => {
  const transacoes = [
    { id: 1, tipo: "receita", valor: 100 },
    { id: 2, tipo: "despesa", valor: 50 },
  ];

  it("retorna todas as transacoes quando o filtro for todas", () => {
    expect(filtrarTransacoes(transacoes, "todas")).toEqual(transacoes);
  });

  it("retorna apenas receitas", () => {
    expect(filtrarTransacoes(transacoes, "receita")).toEqual([
      { id: 1, tipo: "receita", valor: 100 },
    ]);
  });

  it("retorna apenas despesas", () => {
    expect(filtrarTransacoes(transacoes, "despesa")).toEqual([
      { id: 2, tipo: "despesa", valor: 50 },
    ]);
  });
});
