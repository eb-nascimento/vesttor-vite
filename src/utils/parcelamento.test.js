import { describe, expect, it } from "vitest";
import {
  calcularParcelas,
  calcularVencimentos,
  gerarSerieTransacoes,
} from "./parcelamento";

describe("calcularParcelas", () => {
  it("divide com precisão de centavos e atribui o resto à 1ª parcela no modo total", () => {
    // 5000 / 24 = 208,333... Resto = 8 centavos
    const res = calcularParcelas(5000, 24, "total");
    expect(res.valorTotal).toBe(5000);
    expect(res.valorParcelaBase).toBe(208.33);
    expect(res.valorPrimeiraParcela).toBe(208.41);
    expect(res.numParcelas).toBe(24);

    // Conferir soma exata
    const soma = res.valorPrimeiraParcela + res.valorParcelaBase * 23;
    expect(Math.round(soma * 100) / 100).toBe(5000);
  });

  it("divide sem sobra quando o valor for exato", () => {
    const res = calcularParcelas(600, 3, "total");
    expect(res.valorTotal).toBe(600);
    expect(res.valorParcelaBase).toBe(200);
    expect(res.valorPrimeiraParcela).toBe(200);
  });

  it("calcula o total da compra a partir do valor da parcela", () => {
    const res = calcularParcelas(150.5, 10, "parcela");
    expect(res.valorTotal).toBe(1505);
    expect(res.valorParcelaBase).toBe(150.5);
    expect(res.valorPrimeiraParcela).toBe(150.5);
  });

  it("garante quantidade mínima de 2 parcelas", () => {
    const res = calcularParcelas(100, 1, "total");
    expect(res.numParcelas).toBe(2);
    expect(res.valorParcelaBase).toBe(50);
  });
});

describe("calcularVencimentos", () => {
  it("projeta datas mantendo o dia nos meses regulares", () => {
    const datas = calcularVencimentos("2026-05-15", 3);
    expect(datas).toEqual(["2026-05-15", "2026-06-15", "2026-07-15"]);
  });

  it("ajusta automaticamente para o último dia de fevereiro quando iniciado no dia 31", () => {
    // 2026 não é bissexto: fevereiro tem 28 dias
    const datas = calcularVencimentos("2026-01-31", 3);
    expect(datas).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"]);
  });

  it("ajusta corretamente em meses de 30 dias", () => {
    const datas = calcularVencimentos("2026-03-31", 3);
    expect(datas).toEqual(["2026-03-31", "2026-04-30", "2026-05-31"]);
  });

  it("atravessa a virada de ano corretamente", () => {
    const datas = calcularVencimentos("2026-11-10", 4);
    expect(datas).toEqual([
      "2026-11-10",
      "2026-12-10",
      "2027-01-10",
      "2027-02-10",
    ]);
  });
});

describe("gerarSerieTransacoes", () => {
  it("gera a série completa com metadados e IDs consistentes", () => {
    const serie = gerarSerieTransacoes({
      data: "2026-10-15",
      descricao: "Celular",
      valor: 300,
      numParcelas: 3,
      modo: "total",
      categoria: "Tecnologia",
      metodoPagamento: "cartao_credito",
      userId: "user_123",
    });

    expect(serie).toHaveLength(3);
    const parcelamentoId = serie[0].parcelamentoId;
    expect(parcelamentoId).toBeTruthy();

    // Todas devem ter o mesmo parcelamentoId
    serie.forEach((item, index) => {
      expect(item.parcelamentoId).toBe(parcelamentoId);
      expect(item.numeroParcela).toBe(index + 1);
      expect(item.totalParcelas).toBe(3);
      expect(item.tipo).toBe("despesa");
      expect(item.categoria).toBe("Tecnologia");
      expect(item.metodoPagamento).toBe("cartao_credito");
      expect(item.userId).toBe("user_123");
    });

    expect(serie[0].descricao).toBe("Celular (1/3)");
    expect(serie[1].descricao).toBe("Celular (2/3)");
    expect(serie[2].descricao).toBe("Celular (3/3)");
    expect(serie[0].valor).toBe(100);
    expect(serie[1].valor).toBe(100);
    expect(serie[2].valor).toBe(100);
  });

  it("calcula perfeitamente a divisão de R$ 1.550 em 10 parcelas", () => {
    const calc = calcularParcelas(1550, 10, "total");
    expect(calc.valorTotal).toBe(1550);
    expect(calc.valorParcelaBase).toBe(155);
    expect(calc.valorPrimeiraParcela).toBe(155);
    expect(calc.numParcelas).toBe(10);
  });

  it("calcula perfeitamente a divisão de R$ 100 em 2 parcelas", () => {
    const calc = calcularParcelas(100, 2, "total");
    expect(calc.valorTotal).toBe(100);
    expect(calc.valorParcelaBase).toBe(50);
    expect(calc.valorPrimeiraParcela).toBe(50);
    expect(calc.numParcelas).toBe(2);
  });
});
