import { collection, doc, getDocs, query, where, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { colecaoUsuario, observarPeriodo } from "./repositorioFinanceiro";
import { chavePlanejamento } from "../utils/planejamento";
import { serializarDinheiro } from "../utils/dinheiro";
import { mesAtual } from "../utils/periodo";

export function onPlanejamentoChange(uid, onDados, onErro, mes = mesAtual()) {
  return observarPeriodo(uid, "planejamentos", mes, onDados, onErro);
}

export async function criarPlanejamentoNaApi(planejamento, uid) {
  await salvarPlanejamento(planejamento, uid);
}

export async function atualizarPlanejamentoNaApi(id, alteracoes, uid) {
  await salvarPlanejamento(alteracoes, uid, id);
}

function falhar(code) {
  throw Object.assign(new Error(code), { code });
}

async function salvarPlanejamento(alteracoes, uid, id) {
  const privados = colecaoUsuario(uid, "planejamentos");
  // Inclui o legado para impedir duplicatas mesmo antes da migração.
  const snapshots = await Promise.all([
    getDocs(privados),
    getDocs(query(collection(db, "planejamentos"), where("userId", "==", uid))),
  ]);
  const existentes = new Map();
  for (const snapshot of [...snapshots].reverse()) {
    for (const item of snapshot.docs) existentes.set(item.id, { ...item.data(), id: item.id });
  }
  const original = id ? existentes.get(id) : null;
  if (id && !original) falhar("not-found");
  const dados = { ...original, ...alteracoes };
  delete dados.id;
  if ([...existentes.values()].some((item) => item.id !== id && item.mesAno === dados.mesAno && chavePlanejamento(item) === chavePlanejamento(dados))) {
    falhar("planejamento-duplicado");
  }
  // Mesmo destino para criações simultâneas: só uma transação pode criá-lo.
  const classificacoes = { Entrada: "receita", Fixo: "fixo", Variável: "variavel" };
  if (!Object.hasOwn(classificacoes, dados.tipo)) falhar("invalid-argument");
  const chave = `orcamento-${dados.mesAno}-${classificacoes[dados.tipo]}-${encodeURIComponent(dados.categoria)}`;
  const destino = doc(privados, chave);
  await runTransaction(db, async (transacao) => {
    const atual = await transacao.get(destino);
    const origemPrivada = id ? doc(privados, id) : null;
    const origemLegada = id ? doc(db, "planejamentos", id) : null;
    const privada = id ? await transacao.get(origemPrivada) : null;
    const legada = id && !privada.exists() ? await transacao.get(origemLegada) : null;
    if (atual.exists() && chave !== id) falhar("planejamento-duplicado");
    const origem = privada?.exists() ? privada : legada;
    if (id && !origem?.exists()) falhar("not-found");
    if (origem && (chavePlanejamento(origem.data()) !== chavePlanejamento(original) || origem.data().mesAno !== original.mesAno)) falhar("aborted");
    const registro = serializarDinheiro({
      ...(origem?.data() || {}), ...alteracoes,
      userId: uid, dataCriacao: origem?.data().dataCriacao ?? serverTimestamp(),
    }, true);
    transacao.set(destino, registro);
    if (id && id !== chave && privada.exists()) transacao.delete(origemPrivada);
    if (id) transacao.delete(origemLegada);
  });
}
