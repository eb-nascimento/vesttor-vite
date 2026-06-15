import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Referencia reutilizada em todas as operacoes da colecao.
const transacaoCollection = collection(db, "transacoes");

export async function buscarTransacoes(userId) {
  // Busca somente documentos que pertencem ao usuario autenticado.
  const consulta = query(transacaoCollection, where("userId", "==", userId));

  const snapshot = await getDocs(consulta);

  // O ID fica fora dos dados do documento e precisa ser adicionado ao objeto.
  return snapshot.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id,
  }));
}

export async function criarTransacaoNaApi(transacao, userId) {
  // O input date envia texto; o Firestore armazena a data como Timestamp.
  const dados = {
    ...transacao,
    userId,
    data: Timestamp.fromDate(new Date(`${transacao.data}T12:00:00`)),
  };

  const documento = await addDoc(transacaoCollection, dados);

  // Retorna o formato usado pelo estado React, incluindo o ID gerado.
  return {
    ...dados,
    id: documento.id,
  };
}

export async function excluirTransacaoNaApi(id) {
  // Cria a referencia exata do documento antes de exclui-lo.
  const referencia = doc(db, "transacoes", id);
  await deleteDoc(referencia);
}

export async function editarTransacaoNaApi(id, novosDados) {
  const referencia = doc(db, "transacoes", id);

  // A data volta do formulario como texto e precisa ser convertida novamente.
  const dados = {
    ...novosDados,
    data: Timestamp.fromDate(new Date(`${novosDados.data}T12:00:00`)),
  };
  await updateDoc(referencia, dados);

  // O hook usa este retorno para substituir o item editado no estado.
  return {
    ...dados,
    id,
  };
}
