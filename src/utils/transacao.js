function obterMillis(data) {
  if (!data) return 0;
  if (typeof data.toMillis === "function") return data.toMillis();
  if (data instanceof Date) return data.getTime();
  return new Date(`${data}T12:00:00`).getTime();
}

function obterAnoEMes(data) {
  if (!data) return { ano: 0, mes: 0 };
  if (typeof data.toDate === "function") {
    const d = data.toDate();
    return { ano: d.getFullYear(), mes: d.getMonth() };
  }
  if (data instanceof Date) {
    return { ano: data.getFullYear(), mes: data.getMonth() };
  }
  const str = String(data);
  const [ano, mes] = str.split("-");
  return { ano: Number(ano), mes: Number(mes) - 1 };
}

/**
 * Normaliza o valor monetário digitado no formulário:
 * - Permite dígitos e um único separador decimal (, ou .).
 * - Não permite mais de 2 dígitos após o separador decimal.
 * - Remove quaisquer caracteres indesejados.
 *
 * @param {string|number} valorDigitado
 * @returns {string}
 */
export function normalizarInputValor(valorDigitado) {
  if (valorDigitado === undefined || valorDigitado === null) return "";
  const str = String(valorDigitado);
  if (!str) return "";

  // Remove caracteres que não sejam dígitos, vírgula ou ponto
  const limpo = str.replace(/[^0-9.,]/g, "");
  if (!limpo) return "";

  // Se tiver ambos (, e .), o último é o separador decimal e os anteriores são separadores de milhar
  const temVirgula = limpo.includes(",");
  const temPonto = limpo.includes(".");

  let textoSemMilhar = limpo;
  if (temVirgula && temPonto) {
    const ultimoIndiceVirgula = limpo.lastIndexOf(",");
    const ultimoIndicePonto = limpo.lastIndexOf(".");

    if (ultimoIndiceVirgula > ultimoIndicePonto) {
      // Vírgula é decimal, ponto é milhar
      textoSemMilhar = limpo.replace(/\./g, "");
    } else {
      // Ponto é decimal, vírgula é milhar
      textoSemMilhar = limpo.replace(/,/g, "");
    }
  }

  // Localiza o primeiro separador decimal restante
  const matchSeparador = textoSemMilhar.match(/[.,]/);
  if (!matchSeparador) {
    return textoSemMilhar;
  }

  const separador = matchSeparador[0];
  const partes = textoSemMilhar.split(/[.,]/);
  const inteiros = partes[0];
  // Pega os dígitos decimais subsequentes e limita estritamente a 2 casas
  const decimais = partes.slice(1).join("").slice(0, 2);

  return `${inteiros}${separador}${decimais}`;
}

export function criarTransacao(
  data,
  descricao,
  valor,
  tipo,
  categoria = "",
  metodoPagamento = "",
  parcelado = false,
  parcelas = 1,
) {
  // Normaliza o valor (suportando vírgula ou ponto) antes de enviar para a camada de dados
  const valorNumerico = Number(String(valor).replace(",", "."));

  return {
    data,
    descricao,
    valor: valorNumerico,
    tipo,
    ...(categoria ? { categoria } : {}),
    ...(metodoPagamento ? { metodoPagamento } : {}),
    ...(parcelado ? { parcelado: true, parcelas: Number(parcelas) } : {}),
  };
}

export function filtrarTransacoes(transacoes, filtro) {
  // "todas" preserva a lista; os demais valores filtram pelo tipo.
  return transacoes.filter((item) => {
    if (filtro === "todas") return true;
    return item.tipo === filtro;
  });
}

export function ordenarTransacoes(transacoes, ordenacao) {
  // sort altera o array recebido, por isso ordenamos uma copia.
  return [...transacoes].sort((a, b) => {
    if (ordenacao === "data-crescente") {
      return obterMillis(a.data) - obterMillis(b.data);
    }
    if (ordenacao === "data-decrescente") {
      return obterMillis(b.data) - obterMillis(a.data);
    }
    if (ordenacao === "valor-crescente") {
      return a.valor - b.valor;
    }
    if (ordenacao === "valor-decrescente") {
      return b.valor - a.valor;
    }
    return 0;
  });
}

/**
 * Filtra as transações para a visualização de "Recentes" na Home:
 * 1. Oculta lançamentos de meses futuros (> mês atual).
 * 2. Deduplica compras parceladas: garante no máximo 1 parcela por parcelamentoId,
 *    priorizando a parcela mais recente do período de competência.
 *
 * @param {Array} transacoes Lista de transações
 * @param {Object} [opcoes]
 * @param {Date} [opcoes.referencia=new Date()] Data de referência para o mês corrente
 * @returns {Array} Lista filtrada e deduplicada para recentes
 */
export function filtrarTransacoesRecentes(
  transacoes,
  { referencia = new Date() } = {},
) {
  const mesLimite = referencia.getMonth();
  const anoLimite = referencia.getFullYear();

  // 1. Considera apenas transações com competência até o fim do mês de referência
  const ateMesAtual = transacoes.filter((t) => {
    if (!t.data) return false;
    const { ano, mes } = obterAnoEMes(t.data);
    if (ano < anoLimite) return true;
    if (ano === anoLimite && mes <= mesLimite) return true;
    return false;
  });

  // 2. Ordena por data decrescente para que a parcela mais recente do período venha primeiro
  const ordenadasPorData = [...ateMesAtual].sort(
    (a, b) => obterMillis(b.data) - obterMillis(a.data),
  );

  // 3. Deduplica compras parceladas (máximo 1 ocorrência por parcelamentoId)
  const parcelamentosVistos = new Set();
  const resultado = [];

  for (const item of ordenadasPorData) {
    if (item.parcelamentoId) {
      if (!parcelamentosVistos.has(item.parcelamentoId)) {
        parcelamentosVistos.add(item.parcelamentoId);
        resultado.push(item);
      }
    } else {
      resultado.push(item);
    }
  }

  return resultado;
}

export function validarTransacao({ data, descricao, valor, tipo }) {
  // Retorna o primeiro erro; string vazia significa dados validos.
  if (!descricao || !descricao.trim()) {
    return "A descrição é obrigatória.";
  }

  const valorNumerico = Number(String(valor).replace(",", "."));
  if (!valor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
    return "O valor deve ser um número positivo.";
  }

  const partesDecimais = String(valor).split(/[.,]/)[1];
  if (partesDecimais && partesDecimais.length > 2) {
    return "O valor não pode ter mais de 2 casas decimais.";
  }

  if (!data) {
    return "A data é obrigatória.";
  }

  if (tipo !== "receita" && tipo !== "despesa") {
    return "Tipo de transação inválido.";
  }

  return "";
}
