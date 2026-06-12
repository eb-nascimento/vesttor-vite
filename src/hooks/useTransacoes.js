import { useEffect, useState } from "react";

import {
  buscarTransacoes,
  criarTransacaoNaApi,
  excluirTransacaoNaApi,
  editarTransacaoNaApi,
} from "../services/transacoesService";

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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTransacoes() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await buscarTransacoes();
        setTransacoes(dados);
      } catch (erro) {
        setErro(erro.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarTransacoes();
  }, []);

  async function adicionarTransacao(nova) {
    try {
      setErro("");

      const transacaoCriada = await criarTransacaoNaApi(nova);

      setTransacoes((prev) => [...prev, transacaoCriada]);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  async function excluirTransacao(id) {
    try {
      setErro("");

      await excluirTransacaoNaApi(id);

      setTransacoes((prev) => prev.filter((item) => item.id !== id));
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

      const transacaoAtualizada = await editarTransacaoNaApi(id, novosDados);

      setTransacoes((prev) =>
        prev.map((item) => (item.id === id ? transacaoAtualizada : item)),
      );
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
