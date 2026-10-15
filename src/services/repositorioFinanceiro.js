import { collection, doc, onSnapshot, query, where, orderBy, Timestamp, runTransaction } from "firebase/firestore";
import { db } from "../config/firebase";
import { limitesMes } from "../utils/periodo";
import { normalizarDinheiro } from "../utils/dinheiro";

export function colecaoUsuario(uid, nome) {
  if (!uid) throw new Error("Usuário obrigatório");
  return collection(db, "usuarios", uid, nome);
}

export function referenciaUsuario(uid, nome, id) {
  return doc(colecaoUsuario(uid, nome), id);
}

export function consultaPeriodo(colecao, nome, mes, uidLegado) {
  const filtros = uidLegado ? [where("userId", "==", uidLegado)] : [];
  if (nome === "transacoes") {
    const { inicio, fim } = limitesMes(mes);
    filtros.push(where("data", ">=", Timestamp.fromDate(inicio)), where("data", "<", Timestamp.fromDate(fim)), orderBy("data", "desc"));
  } else filtros.push(where("mesAno", "==", mes));
  return query(colecao, ...filtros);
}

// Aguarda ambas as fontes. O mesmo ID no destino prevalece sobre o legado.
export function observarPeriodo(uid, nome, mes, onDados, onErro) {
  const fontes = [null, null];
  let ativo = true;
  const assinaturas = [colecaoUsuario(uid, nome), collection(db, nome)].map((colecao, indice) =>
    onSnapshot(consultaPeriodo(colecao, nome, mes, indice === 1 ? uid : undefined), (snapshot) => {
      if (!ativo) return;
      fontes[indice] = snapshot.docs.map((item) => ({ ...normalizarDinheiro(item.data(), nome === "planejamentos"), id: item.id }));
      if (fontes.every(Boolean)) {
        const unicos = new Map(fontes[1].map((item) => [item.id, item]));
        fontes[0].forEach((item) => unicos.set(item.id, item));
        onDados([...unicos.values()]);
      }
    }, (erro) => { if (ativo) onErro?.(erro); }),
  );
  return () => { ativo = false; assinaturas.forEach((cancelar) => cancelar()); };
}

// A edição move o documento legado no mesmo batch, sem reintroduzi-lo em outro mês.
export async function gravarExistente(uid, nome, id, construirDados) {
  return runTransaction(db, async (transacao) => {
    const destino = referenciaUsuario(uid, nome, id);
    const legado = doc(db, nome, id);
    const atual = await transacao.get(destino);
    const original = atual.exists() ? atual : await transacao.get(legado);
    if (!original.exists()) throw Object.assign(new Error("Registro ausente"), { code: "not-found" });
    const dados = construirDados(original.data());
    transacao.set(destino, dados);
    transacao.delete(legado);
    return dados;
  });
}

export function excluirNoBatch(batch, uid, nome, id) {
  batch.delete(referenciaUsuario(uid, nome, id));
  batch.delete(doc(db, nome, id));
}
