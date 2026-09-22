import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

const planejamentoCollection = collection(db, "planejamento");

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

export async function criarPlanejamento(planejamento, userId) {
  await addDoc(planejamentoCollection, { ...planejamento, userId });
  dataCriacao: new Date().toISOString();
}
