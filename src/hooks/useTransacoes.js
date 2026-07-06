import { useEffect, useState } from "react";

import {
  observarTransacoes,
  criarTransacaoNaApi,
  excluirTransacaoNaApi,
  editarTransacaoNaApi,
} from "../services/transacoesService";

import {
  calcularSaldo,
  calcularReceitas,
  calcularDespesas,
} from "../utils/calculos";

export function useTransacoes(userId) {
  const [transacoes, setTransacoes] = useState([]);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Estes valores sao calculados a partir da lista e nao precisam de estado proprio.
  const saldo = calcularSaldo(transacoes);
  const receitas = calcularReceitas(transacoes);
  const despesas = calcularDespesas(transacoes);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const cancelarObservacao = observarTransacoes(
      userId,
      (dados) => {
        setTransacoes(dados);
        setCarregando(false);
      },
      (erro) => {
        setErro(erro.message);
        setCarregando(false);
      },
    );

    return cancelarObservacao;
  }, [userId]);

  async function adicionarTransacao(nova) {
    try {
      setErro("");
      await criarTransacaoNaApi(nova, userId);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  async function excluirTransacao(id) {
    try {
      setErro("");
      await excluirTransacaoNaApi(id);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  function iniciarEdicao(transacao) {
    setTransacaoEditando(transacao);
  }

  async function editarTransacao(id, novosDados) {
    try {
      setErro("");
      await editarTransacaoNaApi(id, novosDados);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  function cancelarEdicao() {
    setTransacaoEditando(null);
  }

  return {
    transacoes,
    carregando,
    erro,
    saldo,
    receitas,
    despesas,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao,
    transacaoEditando,
    iniciarEdicao,
    cancelarEdicao,
  };
}
