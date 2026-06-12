export function criarTransacao(data, descricao, valor, tipo) {
  return {
    data,
    descricao,
    valor: Number(valor),
    tipo,
  };
}

export function filtrarTransacoes(transacoes, filtro) {
  return transacoes.filter((item) => {
    if (filtro === "todas") return true;
    return item.tipo === filtro;
  });
}

export function ordenarTransacoes(transacoes, ordenacao) {
  return [...transacoes].sort((a, b) => {
    if (ordenacao === "data-crescente") {
      return new Date(a.data) - new Date(b.data);
    }
    if (ordenacao === "data-decrescente") {
      return new Date(b.data) - new Date(a.data);
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
