import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const transacaoCollection = collection(db, "transacoes");

export async function buscarTransacoes() {
  const snapshot = await getDocs(transacaoCollection);
  return snapshot.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id,
  }));
}

export async function criarTransacaoNaApi(transacao) {
  const dados = {
    ...transacao,
    data: Timestamp.fromDate(new Date(`${transacao.data}T12:00:00`)),
  };

  const documento = await addDoc(transacaoCollection, dados);

  return {
    ...dados,
    id: documento.id,
  };
}

export async function excluirTransacaoNaApi(id) {
  const referencia = doc(db, "transacoes", id);
  await deleteDoc(referencia);
}

export async function editarTransacaoNaApi(id, novosDados) {
  const referencia = doc(db, "transacoes", id);

  const dados = {
    ...novosDados,
    data: Timestamp.fromDate(new Date(`${novosDados.data}T12:00:00`)),
  };
  await updateDoc(referencia, dados);
  return {
    ...dados,
    id,
  };
}
