import { describe, expect, it } from "vitest";
import {
  filtrarTransacoes,
  filtrarTransacoesRecentes,
  ordenarTransacoes,
  normalizarInputValor,
  validarTransacao,
} from "./transacao";

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

describe("filtrarTransacoesRecentes", () => {
  // Data de referência fixada em 17 de setembro de 2026
  const referencia = new Date(2026, 8, 17); // Mês 8 = Setembro (0-indexed)

  it("ignora parcelas e transações com vencimento em meses futuros", () => {
    const lista = [
      { id: "1", descricao: "Mercado", data: "2026-09-10", valor: 100 },
      { id: "2", descricao: "Parcela Outubro", data: "2026-10-10", valor: 50 },
      { id: "3", descricao: "Parcela 2027", data: "2027-01-10", valor: 50 },
    ];

    const resultado = filtrarTransacoesRecentes(lista, { referencia });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe("1");
  });

  it("garante no máximo 1 ocorrência por parcelamentoId, escolhendo a mais recente do período", () => {
    const lista = [
      {
        id: "p1_jul",
        descricao: "Celular (1/3)",
        data: "2026-07-17",
        valor: 200,
        parcelamentoId: "compra_celular",
        numeroParcela: 1,
      },
      {
        id: "p1_ago",
        descricao: "Celular (2/3)",
        data: "2026-08-17",
        valor: 200,
        parcelamentoId: "compra_celular",
        numeroParcela: 2,
      },
      {
        id: "p1_set",
        descricao: "Celular (3/3)",
        data: "2026-09-17",
        valor: 200,
        parcelamentoId: "compra_celular",
        numeroParcela: 3,
      },
      {
        id: "mercado",
        descricao: "Mercado",
        data: "2026-09-15",
        valor: 150,
      },
    ];

    const resultado = filtrarTransacoesRecentes(lista, { referencia });

    // Deve conter apenas o celular 3/3 (o mais recente do período) e o mercado
    expect(resultado).toHaveLength(2);
    expect(resultado.map((r) => r.id)).toEqual(["p1_set", "mercado"]);
  });

  it("não deduplica movimentações avulsas sem parcelamentoId", () => {
    const lista = [
      { id: "1", descricao: "Café", data: "2026-09-01", valor: 10 },
      { id: "2", descricao: "Café", data: "2026-09-02", valor: 10 },
      { id: "3", descricao: "Café", data: "2026-09-03", valor: 10 },
    ];

    const resultado = filtrarTransacoesRecentes(lista, { referencia });
    expect(resultado).toHaveLength(3);
  });
});

describe("ordenarTransacoes", () => {
  it("ordena corretamente por data decrescente com strings de data", () => {
    const lista = [
      { id: "1", data: "2026-09-01", valor: 10 },
      { id: "2", data: "2026-09-15", valor: 20 },
      { id: "3", data: "2026-09-05", valor: 15 },
    ];

    const ordenada = ordenarTransacoes(lista, "data-decrescente");
    expect(ordenada.map((t) => t.id)).toEqual(["2", "3", "1"]);
  });
});

describe("normalizarInputValor", () => {
  it("permite números inteiros sem alteração", () => {
    expect(normalizarInputValor("150")).toBe("150");
  });

  it("permite até duas casas decimais após a vírgula", () => {
    expect(normalizarInputValor("150,5")).toBe("150,5");
    expect(normalizarInputValor("150,50")).toBe("150,50");
  });

  it("permite até duas casas decimais após o ponto", () => {
    expect(normalizarInputValor("150.5")).toBe("150.5");
    expect(normalizarInputValor("150.50")).toBe("150.50");
  });

  it("não permite colocar mais de dois números após a vírgula (corta o 3º dígito)", () => {
    expect(normalizarInputValor("150,555")).toBe("150,55");
    expect(normalizarInputValor("10,9999")).toBe("10,99");
  });

  it("não permite colocar mais de dois números após o ponto (corta o 3º dígito)", () => {
    expect(normalizarInputValor("150.555")).toBe("150.55");
    expect(normalizarInputValor("10.9999")).toBe("10.99");
  });

  it("remove caracteres não numéricos e preserva apenas o primeiro separador", () => {
    expect(normalizarInputValor("R$ 1.250,50")).toBe("1250,50");
    expect(normalizarInputValor("10,,50")).toBe("10,50");
  });

  it("lida com valores vazios ou nulos sem erro", () => {
    expect(normalizarInputValor("")).toBe("");
    expect(normalizarInputValor(null)).toBe("");
    expect(normalizarInputValor(undefined)).toBe("");
  });
});

describe("validarTransacao", () => {
  it("aceita valor com vírgula e até 2 casas decimais", () => {
    const erro = validarTransacao({
      data: "2026-09-17",
      descricao: "Almoço",
      valor: "25,50",
      tipo: "despesa",
    });
    expect(erro).toBe("");
  });

  it("rejeita valor com mais de 2 casas decimais", () => {
    const erro = validarTransacao({
      data: "2026-09-17",
      descricao: "Almoço",
      valor: "25,555",
      tipo: "despesa",
    });
    expect(erro).toBe("O valor não pode ter mais de 2 casas decimais.");
  });

  it("rejeita valor menor ou igual a zero", () => {
    const erro = validarTransacao({
      data: "2026-09-17",
      descricao: "Almoço",
      valor: "0",
      tipo: "despesa",
    });
    expect(erro).toBe("O valor deve ser um número positivo.");
  });
});
