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
      { categoria: "Alimentação", tipo: "Variável" },
      { categoria: "Alimentação", tipo: "Variável" },
    ], [{ categoria: "Alimentação", tipo: "despesa", valorCentavos: 5000 }]);
    expect(itens.reduce((soma, item) => soma + item.valorRealizado, 0)).toBe(50);
  });
  it("divide o realizado entre os orçamentos fixo e variável da mesma categoria", () => {
    const planos = [{ id: "f", categoria: "Transporte", tipo: "Fixo" }, { id: "v", categoria: "Transporte", tipo: "Variável" }];
    const itens = cruzarPlanejamentos(planos, [
      { categoria: "Transporte", tipo: "despesa", classificacao: "Fixo", valorCentavos: 30000 },
      { categoria: "Transporte", tipo: "despesa", classificacao: "Variável", valorCentavos: 1575 },
      { categoria: "Transporte", tipo: "despesa", classificacao: "Variável", valorCentavos: 1525 },
    ]);
    expect(itens.map((item) => item.valorRealizado)).toEqual([300, 31]);
  });
  it("mantém um gasto variável não planejado quando só há orçamento fixo", () => {
    const itens = cruzarPlanejamentos([{ categoria: "Moradia", tipo: "Fixo" }], [
      { categoria: "Moradia", tipo: "despesa", classificacao: "Variável", valorCentavos: 1500 },
    ]);
    expect(itens).toHaveLength(2);
    expect(itens[0].valorRealizado).toBe(0);
    expect(itens[1]).toMatchObject({ tipo: "Variável", isUnplanned: true, valorRealizado: 15 });
  });
  it("usa o padrão da categoria para despesas antigas sem alterar os documentos", () => {
    const antigas = [
      { categoria: "Moradia", tipo: "despesa", valor: 50 },
      { categoria: "Transporte", tipo: "despesa", valor: 20 },
    ];
    const itens = cruzarPlanejamentos([], antigas);
    expect(itens.map((item) => item.tipo)).toEqual(["Fixo", "Variável"]);
    expect(antigas.every((item) => !("classificacao" in item))).toBe(true);
  });
  it("mantém receitas e as duas classificações de Outros independentes", () => {
    const itens = cruzarPlanejamentos(["Entrada", "Fixo", "Variável"].map((tipo) => ({ categoria: "Outros", tipo })), [
      { categoria: "Outros", tipo: "receita", valor: 100 },
      { categoria: "Outros", tipo: "despesa", classificacao: "Fixo", valor: 30 },
      { categoria: "Outros", tipo: "despesa", classificacao: "Variável", valor: 10 },
    ]);
    expect(itens.map((item) => item.valorRealizado)).toEqual([100, 30, 10]);
  });
  it("mantém receitas de Investimentos fora dos gastos fixos", () => {
    expect(cruzarPlanejamentos([], [{ categoria: "Investimentos", tipo: "receita", valor: 1.01 }])[0])
      .toMatchObject({ tipo: "Entrada", valorRealizado: 1.01 });
  });
});
