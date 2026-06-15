export function criarTransacao(data, descricao, valor, tipo) {
  // Normaliza o valor antes de enviar a transacao para a camada de dados.
  return {
    data,
    descricao,
    valor: Number(valor),
    tipo,
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
      // Timestamp.toMillis transforma a data em numero para comparacao.
      return a.data.toMillis() - b.data.toMillis();
    }
    if (ordenacao === "data-decrescente") {
      return b.data.toMillis() - a.data.toMillis();
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

export function validarTransacao({ data, descricao, valor, tipo }) {
  // Retorna o primeiro erro; string vazia significa dados validos.
  if (!descricao.trim()) {
    return "A descrição é obrigatória.";
  }

  if (!valor || Number.isNaN(Number(valor)) || Number(valor) <= 0) {
    return "O valor deve ser um número positivo.";
  }

  if (!data) {
    return "A data é obrigatória.";
  }

  if (tipo !== "receita" && tipo !== "despesa") {
    return "Tipo de transação inválido.";
  }

  return "";
}
