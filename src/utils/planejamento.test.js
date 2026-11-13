import { describe, expect, it } from "vitest";
import { cruzarPlanejamentos } from "./planejamento";

describe("realizado por categoria e natureza", () => {
  it("classifica novas categorias de receita como entradas", () => {
    const itens = cruzarPlanejamentos([], [{ categoria: "Dividendos", tipo: "receita", valorCentavos: 10000 }]);
    expect(itens).toEqual([expect.objectContaining({ tipo: "Entrada", valorRealizado: 100 })]);
  });
  it("separa receitas e despesas em Outros, mesmo com apenas uma natureza planejada", () => {
    const itens = cruzarPlanejamentos([{ categoria: "Outros", tipo: "Entrada", planejado: 100 }], [
      { categoria: "Outros", tipo: "receita", valorCentavos: 10000 },
      { categoria: "Outros", tipo: "despesa", valorCentavos: 3000 },
    ]);
    expect(itens).toHaveLength(2);
    expect(itens[0].valorRealizado).toBe(100);
    expect(itens[1]).toMatchObject({ tipo: "Variável", valorRealizado: 30, isUnplanned: true });
  });
  it("não multiplica realizado se houver duplicatas antigas", () => {
    const itens = cruzarPlanejamentos([
      { categoria: "Alimentação", tipo: "Fixo" },
      { categoria: "Alimentação", tipo: "Variável" },
    ], [{ categoria: "Alimentação", tipo: "despesa", valorCentavos: 5000 }]);
    expect(itens.reduce((soma, item) => soma + item.valorRealizado, 0)).toBe(50);
  });
  it("mantém receitas de Investimentos fora dos gastos fixos", () => {
    expect(cruzarPlanejamentos([], [{ categoria: "Investimentos", tipo: "receita", valor: 1.01 }])[0])
      .toMatchObject({ tipo: "Entrada", valorRealizado: 1.01 });
  });
});
