/**
 * Utilitários matemáticos e de calendário para compras parceladas no Vesttor.
 */

/**
 * Calcula a divisão de parcelas com precisão de centavos e atribui o resto à 1ª parcela.
 * Suporta o cálculo a partir do valor total ou a partir do valor unitário da parcela.
 *
 * @param {number} valor Valor inserido pelo usuário
 * @param {number} numParcelas Quantidade de parcelas (mínimo 2)
 * @param {"total" | "parcela"} modo Modo de cálculo
 */
export function calcularParcelas(valor, numParcelas, modo = "total") {
  const parcelasValidas = Math.max(2, Math.floor(Number(numParcelas) || 2));
  const valorNumerico = Math.max(0, Number(valor) || 0);

  if (modo === "parcela") {
    const centavosParcela = Math.round(valorNumerico * 100);
    const totalCentavos = centavosParcela * parcelasValidas;

    return {
      valorTotal: totalCentavos / 100,
      valorParcelaBase: centavosParcela / 100,
      valorPrimeiraParcela: centavosParcela / 100,
      numParcelas: parcelasValidas,
      modo: "parcela",
    };
  }

  // Modo padrão: "total"
  const totalCentavos = Math.round(valorNumerico * 100);
  const centavosBase = Math.floor(totalCentavos / parcelasValidas);
  const sobraCentavos = totalCentavos % parcelasValidas;

  return {
    valorTotal: totalCentavos / 100,
    valorParcelaBase: centavosBase / 100,
    valorPrimeiraParcela: (centavosBase + sobraCentavos) / 100,
    numParcelas: parcelasValidas,
    modo: "total",
  };
}

/**
 * Gera os vencimentos mensais mantendo o dia base da compra sempre que possível.
 * Se o mês subsequente tiver menos dias que o dia da compra (ex: 31 de janeiro em fevereiro),
 * ajusta automaticamente para o último dia válido daquele mês.
 *
 * @param {string} dataInicialStr Data no formato YYYY-MM-DD
 * @param {number} numParcelas Quantidade de parcelas
 * @returns {string[]} Lista de datas no formato YYYY-MM-DD
 */
export function calcularVencimentos(dataInicialStr, numParcelas) {
  const [anoStr, mesStr, diaStr] = (dataInicialStr || "").split("-");
  const anoBase = Number(anoStr) || new Date().getFullYear();
  const mesBase = Number(mesStr) || new Date().getMonth() + 1; // 1 a 12
  const diaBase = Number(diaStr) || new Date().getDate();

  const vencimentos = [];

  for (let i = 0; i < numParcelas; i++) {
    const mesesTotais = mesBase - 1 + i;
    const anoCalculado = anoBase + Math.floor(mesesTotais / 12);
    const mesCalculado = (mesesTotais % 12) + 1; // 1 a 12

    // new Date(ano, mes, 0).getDate() retorna a quantidade exata de dias no mês
    const maxDiasNoMes = new Date(anoCalculado, mesCalculado, 0).getDate();
    const diaEfetivo = Math.min(diaBase, maxDiasNoMes);

    const mesFormatado = String(mesCalculado).padStart(2, "0");
    const diaFormatado = String(diaEfetivo).padStart(2, "0");

    vencimentos.push(`${anoCalculado}-${mesFormatado}-${diaFormatado}`);
  }

  return vencimentos;
}

/**
 * Monta o conjunto completo de N transações prontas para gravação na camada de dados.
 *
 * @param {Object} params
 * @param {string} params.data Data inicial da compra (YYYY-MM-DD)
 * @param {string} params.descricao Nome da despesa
 * @param {number} params.valor Valor (total ou por parcela conforme o modo)
 * @param {number} params.numParcelas Quantidade de parcelas
 * @param {"total" | "parcela"} [params.modo="total"] Modo de entrada
 * @param {string} [params.categoria="Outros"] Categoria da compra
 * @param {string} [params.metodoPagamento="cartao_credito"] Método de pagamento
 * @param {string} [params.userId] UID do usuário autenticado
 * @returns {Array} Lista de transações da série
 */
export function gerarSerieTransacoes({
  data,
  descricao,
  valor,
  numParcelas,
  modo = "total",
  categoria = "Outros",
  metodoPagamento = "cartao_credito",
  userId = "",
}) {
  const calculo = calcularParcelas(valor, numParcelas, modo);
  const vencimentos = calcularVencimentos(data, calculo.numParcelas);

  // Gera identificador único para vincular todas as parcelas desta compra
  const parcelamentoId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `parc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const descricaoBase = (descricao || "").trim() || "Compra parcelada";

  return vencimentos.map((dataVencimento, index) => {
    const numeroParcela = index + 1;
    const valorParcela =
      numeroParcela === 1
        ? calculo.valorPrimeiraParcela
        : calculo.valorParcelaBase;

    return {
      data: dataVencimento,
      descricao: `${descricaoBase} (${numeroParcela}/${calculo.numParcelas})`,
      valor: valorParcela,
      tipo: "despesa",
      categoria: categoria || "Outros",
      metodoPagamento: metodoPagamento || "cartao_credito",
      parcelamentoId,
      numeroParcela,
      totalParcelas: calculo.numParcelas,
      valorTotalCompra: calculo.valorTotal,
      ...(userId ? { userId } : {}),
    };
  });
}
