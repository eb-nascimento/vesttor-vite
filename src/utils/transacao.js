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
 * Função utilitária global para obter meses únicos das transações
 */
export function extrairMesesDisponiveis(transacoes) {
  const mesesSet = new Set();

  transacoes.forEach((t) => {
    if (!t.data) return;
    const { ano, mes } = obterAnoEMes(t.data);
    if (ano > 0) {
      // mes vem de 0 a 11, mas para string vamos formatar como AAAA-MM
      const mesFormatado = String(mes + 1).padStart(2, "0");
      mesesSet.add(`${ano}-${mesFormatado}`);
    }
  });

  // Garantir que o mês atual SEMPRE exista na lista, mesmo se não houver transações
  const hoje = new Date();
  const mesAtualStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  mesesSet.add(mesAtualStr);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return Array.from(mesesSet)
    .sort()
    .reverse() // Mais recentes primeiro
    .map((val) => {
      const [ano, mes] = val.split("-");
      // Criar data no meio do dia para evitar problemas de fuso
      const date = new Date(ano, Number(mes) - 1, 15);
      const label = formatter.format(date);
      return {
        valor: val, // '2026-09'
        label: label.charAt(0).toUpperCase() + label.slice(1), // 'Setembro de 2026'
      };
    });
}

/**
 * Aplica os filtros avançados V2
 */
export function aplicarFiltrosAvancados(transacoes, filtros) {
  let resultado = [...transacoes];

  // 1. Filtro de Tipo (receita, despesa, todas)
  if (filtros.tipo && filtros.tipo !== "todas") {
    resultado = resultado.filter((t) => t.tipo === filtros.tipo);
  }

  // 2. Filtro de Busca (descrição)
  if (filtros.busca && filtros.busca.trim() !== "") {
    const termo = filtros.busca.toLowerCase().trim();
    resultado = resultado.filter(
      (t) => t.descricao && t.descricao.toLowerCase().includes(termo),
    );
  }

  // 3. Filtro de Mês/Ano (Competência)
  if (filtros.mesAno && filtros.mesAno !== "todas") {
    const [anoAlvo, mesAlvo] = filtros.mesAno.split("-").map(Number);
    resultado = resultado.filter((t) => {
      const { ano, mes } = obterAnoEMes(t.data);
      // 'mes' do obterAnoEMes é 0-11. 'mesAlvo' do form é 1-12.
      return ano === anoAlvo && mes + 1 === mesAlvo;
    });
  }

  // 4. Filtro de Categoria
  if (filtros.categoria && filtros.categoria !== "todas") {
    resultado = resultado.filter((t) => t.categoria === filtros.categoria);
  }

  // 5. Filtro de Método
  if (filtros.metodoPagamento && filtros.metodoPagamento !== "todas") {
    resultado = resultado.filter(
      (t) => t.metodoPagamento === filtros.metodoPagamento,
    );
  }

  // 6. Ordenação
  const ord = filtros.ordenacao || "data-decrescente";
  resultado.sort((a, b) => {
    if (ord === "data-decrescente") {
      return obterMillis(b.data) - obterMillis(a.data);
    }
    if (ord === "data-crescente") {
      return obterMillis(a.data) - obterMillis(b.data);
    }
    if (ord === "valor-decrescente") {
      return (b.valor || 0) - (a.valor || 0);
    }
    if (ord === "valor-crescente") {
      return (a.valor || 0) - (b.valor || 0);
    }
    return 0;
  });

  return resultado;
}

/**
 * Pagina as transações
 */
export function paginarTransacoes(
  transacoes,
  paginaAtual,
  itensPorPagina = 10,
) {
  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const endIndex = startIndex + itensPorPagina;
  return transacoes.slice(startIndex, endIndex);
}

/**
 * Calcula totais baseados num array arbitrário de transações
 */
export function calcularTotais(transacoes) {
  return transacoes.reduce(
    (acc, t) => {
      if (t.tipo === "receita") acc.receitas += t.valor || 0;
      else if (t.tipo === "despesa") acc.despesas += t.valor || 0;
      acc.saldo = acc.receitas - acc.despesas;
      return acc;
    },
    { saldo: 0, receitas: 0, despesas: 0 },
  );
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
