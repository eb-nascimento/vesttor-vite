import { addDoc, serverTimestamp } from "firebase/firestore";
import { colecaoUsuario, observarPeriodo, gravarExistente } from "./repositorioFinanceiro";
import { serializarDinheiro } from "../utils/dinheiro";
import { mesAtual } from "../utils/periodo";

export function onPlanejamentoChange(uid, onDados, onErro, mes = mesAtual()) {
  return observarPeriodo(uid, "planejamentos", mes, onDados, onErro);
}

export async function criarPlanejamentoNaApi(planejamento, uid) {
  await addDoc(colecaoUsuario(uid, "planejamentos"), {
    ...serializarDinheiro(planejamento, true), userId: uid, dataCriacao: serverTimestamp(),
  });
}

export async function atualizarPlanejamentoNaApi(id, alteracoes, uid) {
  await gravarExistente(uid, "planejamentos", id, (original) => serializarDinheiro({ ...original, ...alteracoes }, true));
}
