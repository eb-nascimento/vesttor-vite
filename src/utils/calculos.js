import { centavosDoItem } from "./dinheiro";

export function calcularSaldo(transacoes) {
  return transacoes.reduce((total, item) => total + (item.tipo === "receita" ? 1 : -1) * centavosDoItem(item), 0) / 100;
}
export function calcularReceitas(transacoes) {
  return transacoes.filter((item) => item.tipo === "receita").reduce((total, item) => total + centavosDoItem(item), 0) / 100;
}
export function calcularDespesas(transacoes) {
  return transacoes.filter((item) => item.tipo === "despesa").reduce((total, item) => total + centavosDoItem(item), 0) / 100;
}
