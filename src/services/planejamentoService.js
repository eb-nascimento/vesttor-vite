import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const planejamentoCollection = collection(db, "planejamentos");

// Fica "ouvindo" o Firebase e avisa sempre que um planejamento for criado/alterado
export function onPlanejamentoChange(userId, onDados) {
  const consulta = query(planejamentoCollection, where("userId", "==", userId));

  return onSnapshot(consulta, (snapshot) => {
    const planejamentos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    onDados(planejamentos);
  });
}

export async function criarPlanejamentoNaApi(planejamento, userId) {
  await addDoc(planejamentoCollection, {
    ...planejamento,
    userId,
    dataCriacao: serverTimestamp(),
  });
}

export async function atualizarPlanejamentoNaApi(id, dadosAtualizados) {
  const docRef = doc(db, "planejamentos", id);
  await updateDoc(docRef, dadosAtualizados);
}
