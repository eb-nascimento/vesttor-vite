import { describe, expect, it } from "vitest";
import { calcularReceitas } from "./calculos";

describe("calcularReceitas", () => {
  it("soma apenas transacoes de receita", () => {
    const transacoes = [
      { tipo: "receita", valor: 100 },
      { tipo: "despesa", valor: 40 },
      { tipo: "receita", valor: 50 },
    ];

    expect(calcularReceitas(transacoes)).toBe(150);
  });
});
