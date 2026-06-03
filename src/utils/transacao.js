export function criarTransacao(descricao, valor, tipo) {
  return {
    id: Date.now(),
    descricao,
    valor: Number(valor),
    tipo,
  };
}
