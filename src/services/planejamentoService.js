import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { colecaoUsuario, consultaPeriodo } from "./repositorioFinanceiro";
import { normalizarDinheiro, serializarDinheiro } from "../utils/dinheiro";
import { mesAtual } from "../utils/periodo";

export function idPlanejamento({ mesAno, tipo, categoria }) {
  if (!mesAno || !["Entrada", "Fixo", "Variável"].includes(tipo) || !categoria || categoria.includes("/")) {
    throw Object.assign(new Error("Planejamento inválido"), { code: "invalid-argument" });
  }
  return `orcamento-${mesAno}-${tipo}-${categoria}`;
}

export function onPlanejamentoChange(uid, onDados, onErro, mes = mesAtual()) {
  return onSnapshot(consultaPeriodo(colecaoUsuario(uid, "planejamentos"), "planejamentos", mes), (snapshot) => {
    const atuais = snapshot.docs.filter((item) => {
      try { return item.id === idPlanejamento(item.data()); } catch { return false; }
    });
    onDados(atuais.map((item) => ({ ...normalizarDinheiro(item.data(), true), id: item.id })));
  }, onErro);
}

export async function criarPlanejamentoNaApi(planejamento, uid) {
  const ref = doc(colecaoUsuario(uid, "planejamentos"), idPlanejamento(planejamento));
  await runTransaction(db, async (transaction) => {
    if ((await transaction.get(ref)).exists()) throw Object.assign(new Error("Orçamento já existe"), { code: "planejamento-duplicado" });
    transaction.set(ref, { ...serializarDinheiro(planejamento, true), userId: uid, dataCriacao: serverTimestamp() });
  });
}

export async function atualizarPlanejamentoNaApi(id, alteracoes, uid) {
  const colecao = colecaoUsuario(uid, "planejamentos");
  const origem = doc(colecao, id);
  await runTransaction(db, async (transaction) => {
    const atual = await transaction.get(origem);
    if (!atual.exists()) throw Object.assign(new Error("Orçamento não encontrado"), { code: "not-found" });
    const anterior = atual.data();
    if (id !== idPlanejamento(anterior)) throw Object.assign(new Error("Orçamento antigo"), { code: "failed-precondition" });
    const dados = { ...anterior, ...alteracoes };
    const novoId = idPlanejamento(dados);
    const destino = doc(colecao, novoId);
    if (novoId !== id && (await transaction.get(destino)).exists()) {
      throw Object.assign(new Error("Orçamento já existe"), { code: "planejamento-duplicado" });
    }
    transaction.set(destino, serializarDinheiro(dados, true));
    if (novoId !== id) transaction.delete(origem);
  });
}
