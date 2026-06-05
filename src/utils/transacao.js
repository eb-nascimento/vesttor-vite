export function criarTransacao(data, descricao, valor, tipo) {
  return {
    id: Date.now(),
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
