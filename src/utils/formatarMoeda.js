const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export function formatarMoeda(valor = 0) {
  return moeda.format(valor);
}
