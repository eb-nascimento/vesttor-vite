import { centavosDoItem } from "./dinheiro";
import { classificacaoPadraoDespesa } from "../data/categorias";

export const naturezaPlanejamento = (item) => item.tipo === "Entrada" ? "receita" : "despesa";
export const chavePlanejamento = (item) => JSON.stringify([item.categoria, item.tipo]);

export function classificacaoTransacao(item) {
  if (item.tipo === "receita") return "Entrada";
  return item.classificacao === "Fixo" || item.classificacao === "Variável"
    ? item.classificacao : classificacaoPadraoDespesa(item.categoria);
}

export function cruzarPlanejamentos(planejamentos, transacoes) {
  const totais = new Map();
  for (const transacao of transacoes) {
    const chave = JSON.stringify([transacao.categoria, classificacaoTransacao(transacao)]);
    totais.set(chave, (totais.get(chave) || 0) + centavosDoItem(transacao));
  }
  const planejados = new Set();
  const itens = planejamentos.map((item) => {
    const chave = chavePlanejamento(item);
    // Dados duplicados antigos não devem multiplicar o realizado.
    const valorRealizado = planejados.has(chave) ? 0 : (totais.get(chave) || 0) / 100;
    planejados.add(chave);
    return { ...item, valorRealizado };
  });
  for (const [chave, centavos] of totais) {
    if (planejados.has(chave)) continue;
    const [categoria, tipo] = JSON.parse(chave);
    itens.push({
      id: `unplanned-${chave}`, categoria,
      tipo,
      planejado: 0, valorRealizado: centavos / 100, isUnplanned: true,
    });
  }
  return itens;
}
