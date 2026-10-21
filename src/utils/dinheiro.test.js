import { describe, expect, it } from "vitest";
import { paraCentavos, serializarDinheiro, normalizarDinheiro } from "./dinheiro";
import { calcularSaldo, calcularReceitas } from "./calculos";
import { gerarSerieTransacoes } from "./parcelamento";

describe("dinheiro inteiro e transição do legado", () => {
  it.each([["0,01", 1], ["1.005", 101], ["0.29", 29], ["100.10", 10010]])("converte %s", (valor, esperado) => expect(paraCentavos(valor)).toBe(esperado));
  it.each([NaN, Infinity, -1, "inválido", Number.MAX_SAFE_INTEGER])("rejeita valores inválidos", (valor) => expect(() => paraCentavos(valor)).toThrow());
  it("grava somente centavos e mantém reais apenas no adaptador de leitura", () => {
    const alvo = serializarDinheiro({ valor: 1.23, valorTotalCompra: 3.69 });
    expect(alvo).toEqual({ valorCentavos: 123, valorTotalCentavos: 369 });
    expect(normalizarDinheiro(alvo)).toMatchObject({ valor: 1.23, valorTotalCompra: 3.69 });
    expect(normalizarDinheiro({ valor: 2.34 }).valor).toBe(2.34);
    expect(serializarDinheiro({ planejado: 0 }, true)).toEqual({ planejadoCentavos: 0 });
  });
  it("soma legado e alvo com precisão inteira", () => {
    const itens = [{ tipo: "receita", valor: 0.1 }, { tipo: "receita", valorCentavos: 20 }, { tipo: "despesa", valorCentavos: 30 }];
    expect(calcularReceitas(itens)).toBe(0.3);
    expect(calcularSaldo(itens)).toBe(0);
  });
  it("parcelamento preserva o total exato em centavos", () => {
    const serie = gerarSerieTransacoes({ data: "2026-10-31", descricao: "Compra", valor: 100, numParcelas: 7 });
    expect(serie.reduce((soma, item) => soma + serializarDinheiro(item).valorCentavos, 0)).toBe(10000);
  });
});
