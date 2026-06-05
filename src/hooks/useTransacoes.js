import { useState } from "react";
import {
  calcularSaldo,
  calcularReceitas,
  calcularDespesas,
} from "../utils/calculos";

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [transacaoEditando, setTransacaoEditando] = useState(null);

  const saldo = calcularSaldo(transacoes);
  const receitas = calcularReceitas(transacoes);
  const despesas = calcularDespesas(transacoes);

  function adicionarTransacao(nova) {
    setTransacoes((prev) => [...prev, nova]);
  }

  function excluirTransacao(id) {
    setTransacoes((prev) => prev.filter((item) => item.id !== id));
  }

  function iniciarEdicao(transacao) {
    setTransacaoEditando(transacao);
  }

  function editarTransacao(id, novosDados) {
    setTransacoes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...novosDados } : item)),
    );
  }

  function cancelarEdicao() {
    setTransacaoEditando(null);
  }

  return {
    transacoes,
    saldo,
    receitas,
    despesas,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao,
    transacaoEditando,
    iniciarEdicao,
  };
}
