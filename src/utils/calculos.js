export function calcularSaldo(transacoes) {
  return transacoes.reduce((acc, item) => {
    return item.tipo === "receita" ? acc + item.valor : acc - item.valor;
  }, 0);
}

export function calcularReceitas(transacoes) {
  return transacoes
    .filter((item) => item.tipo === "receita")
    .reduce((acc, item) => acc + item.valor, 0);
}

export function calcularDespesas(transacoes) {
  return transacoes
    .filter((item) => item.tipo === "despesa")
    .reduce((acc, item) => acc + item.valor, 0);
}
