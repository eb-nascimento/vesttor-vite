import {
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Referencia reutilizada em todas as operacoes da colecao.
const transacaoCollection = collection(db, "transacoes");

export function observarTransacoes(userId, onDados, onErro) {
  const consulta = query(transacaoCollection, where("userId", "==", userId));

  return onSnapshot(
    consulta,
    (snapshot) => {
      const transacoes = snapshot.docs.map((documento) => ({
        ...documento.data(),
        id: documento.id,
      }));
      onDados(transacoes);
    },
    onErro,
  );
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

export async function criarCompraParceladaNaApi(parcelas, userId) {
  const batch = writeBatch(db);
  const transacoesCriadas = [];

  for (const parcela of parcelas) {
    const docRef = doc(transacaoCollection);
    const dados = {
      ...parcela,
      userId,
      data: Timestamp.fromDate(new Date(`${parcela.data}T12:00:00`)),
    };
    batch.set(docRef, dados);
    transacoesCriadas.push({ ...dados, id: docRef.id });
  }

  await batch.commit();
  return transacoesCriadas;
}

export async function excluirParcelasFuturasNaApi(
  parcelamentoId,
  numeroParcelaMinimo,
  userId,
) {
  const consulta = query(
    transacaoCollection,
    where("userId", "==", userId),
    where("parcelamentoId", "==", parcelamentoId),
  );

  const snapshot = await getDocs(consulta);
  const batch = writeBatch(db);
  let totalExcluidos = 0;

  snapshot.docs.forEach((documento) => {
    const dados = documento.data();
    if (Number(dados.numeroParcela) >= Number(numeroParcelaMinimo)) {
      batch.delete(documento.ref);
      totalExcluidos++;
    }
  });

  if (totalExcluidos > 0) {
    await batch.commit();
  }
}

export async function atualizarCompraParceladaNaApi({
  parcelamentoId,
  novasParcelas,
  transacaoUnica,
  userId,
}) {
  const consulta = query(
    transacaoCollection,
    where("userId", "==", userId),
    where("parcelamentoId", "==", parcelamentoId),
  );

  const snapshot = await getDocs(consulta);
  const batch = writeBatch(db);

  // Exclui todas as parcelas anteriores da série
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  // Se continua parcelada, insere a nova série recalculada
  if (novasParcelas && novasParcelas.length > 0) {
    for (const parcela of novasParcelas) {
      const docRef = doc(transacaoCollection);
      batch.set(docRef, {
        ...parcela,
        userId,
        data: Timestamp.fromDate(new Date(`${parcela.data}T12:00:00`)),
      });
    }
  } else if (transacaoUnica) {
    // Se o usuário desmarcou parcelamento, grava como transação única
    const docRef = doc(transacaoCollection);
    batch.set(docRef, {
      ...transacaoUnica,
      userId,
      data: Timestamp.fromDate(new Date(`${transacaoUnica.data}T12:00:00`)),
    });
  }

  await batch.commit();
}

export async function converterParaParceladaNaApi(
  transacaoId,
  novasParcelas,
  userId,
) {
  const batch = writeBatch(db);
  const refOriginal = doc(db, "transacoes", transacaoId);
  batch.delete(refOriginal);

  for (const parcela of novasParcelas) {
    const docRef = doc(transacaoCollection);
    batch.set(docRef, {
      ...parcela,
      userId,
      data: Timestamp.fromDate(new Date(`${parcela.data}T12:00:00`)),
    });
  }

  await batch.commit();
}
