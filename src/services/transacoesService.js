import { addDoc, Timestamp, doc, writeBatch, getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { colecaoUsuario, observarPeriodo, gravarExistente, excluirNoBatch } from "./repositorioFinanceiro";
import { serializarDinheiro, normalizarDinheiro } from "../utils/dinheiro";
import { mesAtual } from "../utils/periodo";
import { classificacaoPadraoDespesa } from "../data/categorias";
import { prepararAtualizacaoParcelas } from "../utils/parcelamento";

function dadosTransacao(dados, uid) {
  const campos = { ...dados };
  delete campos.id;
  if (campos.tipo === "receita") delete campos.classificacao;
  else if (campos.classificacao === undefined) campos.classificacao = classificacaoPadraoDespesa(campos.categoria);
  const resultado = serializarDinheiro(campos);
  resultado.userId = uid;
  resultado.data = typeof dados.data === "string" ? Timestamp.fromDate(new Date(`${dados.data}T12:00:00`)) : dados.data;
  return resultado;
}

export function observarTransacoes(uid, onDados, onErro, mes = mesAtual()) {
  return observarPeriodo(uid, "transacoes", mes, onDados, onErro);
}

export async function criarTransacaoNaApi(transacao, uid) {
  const dados = dadosTransacao(transacao, uid);
  const ref = await addDoc(colecaoUsuario(uid, "transacoes"), dados);
  return { ...normalizarDinheiro(dados), id: ref.id };
}

export async function excluirTransacaoNaApi(id, uid) {
  const batch = writeBatch(db);
  excluirNoBatch(batch, uid, "transacoes", id);
  await batch.commit();
}

export async function editarTransacaoNaApi(id, novosDados, uid) {
  const dados = await gravarExistente(uid, "transacoes", id, (original) => dadosTransacao({ ...original, ...novosDados }, uid));
  return { ...normalizarDinheiro(dados), id };
}

export async function criarCompraParceladaNaApi(parcelas, uid) {
  const batch = writeBatch(db);
  const criadas = parcelas.map((parcela) => {
    const ref = doc(colecaoUsuario(uid, "transacoes"));
    const dados = dadosTransacao(parcela, uid);
    batch.set(ref, dados);
    return { ...normalizarDinheiro(dados), id: ref.id };
  });
  await batch.commit();
  return criadas;
}

async function documentosSerie(uid, parcelamentoId) {
  const consultas = [
    query(colecaoUsuario(uid, "transacoes"), where("parcelamentoId", "==", parcelamentoId)),
    query(collection(db, "transacoes"), where("userId", "==", uid), where("parcelamentoId", "==", parcelamentoId)),
  ];
  const snapshots = await Promise.all(consultas.map(getDocs));
  return snapshots.flatMap((snapshot) => snapshot.docs);
}

export async function excluirParcelasFuturasNaApi(parcelamentoId, numeroParcelaMinimo, uid) {
  const documentos = await documentosSerie(uid, parcelamentoId);
  const batch = writeBatch(db);
  documentos.filter((item) => item.data().numeroParcela >= numeroParcelaMinimo).forEach((item) => batch.delete(item.ref));
  if (documentos.length) await batch.commit();
}

export async function atualizarCompraParceladaNaApi({ parcelamentoId, novasParcelas, transacaoUnica, userId }) {
  const documentos = await documentosSerie(userId, parcelamentoId);
  if (transacaoUnica || !novasParcelas?.length) throw Object.assign(new Error("Alteração de parcelamento indisponível"), { code: "parcelamento-alteracao-indisponivel" });
  const atualizacoes = prepararAtualizacaoParcelas(documentos, novasParcelas, parcelamentoId);
  const batch = writeBatch(db);
  for (const { documento, parcela } of atualizacoes) {
    batch.set(documento.ref, dadosTransacao(parcela, userId));
  }
  await batch.commit();
}

export async function converterParaParceladaNaApi(transacaoId, novasParcelas, uid) {
  const batch = writeBatch(db);
  excluirNoBatch(batch, uid, "transacoes", transacaoId);
  novasParcelas.forEach((parcela) => batch.set(doc(colecaoUsuario(uid, "transacoes")), dadosTransacao(parcela, uid)));
  await batch.commit();
}
