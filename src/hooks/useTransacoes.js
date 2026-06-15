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
    async function carregarTransacoes() {
      // Durante a verificacao da sessao ainda pode nao existir um userId.
      if (!userId) {
        setTransacoes([]);
        setCarregando(false);
        return;
      }
      try {
        setCarregando(true);
        setErro("");

        const dados = await buscarTransacoes(userId);
        setTransacoes(dados);
      } catch (erro) {
        setErro(erro.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarTransacoes();
    // Uma troca de usuario exige uma nova consulta ao Firestore.
  }, [userId]);

  async function adicionarTransacao(nova) {
    try {
      setErro("");

      const transacaoCriada = await criarTransacaoNaApi(nova, userId);

      // Atualiza a tela sem buscar novamente toda a colecao.
      setTransacoes((prev) => [...prev, transacaoCriada]);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  async function excluirTransacao(id) {
    try {
      setErro("");

      await excluirTransacaoNaApi(id);

      // Remove do estado somente depois que o Firestore confirmar a exclusao.
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

      // Substitui somente a transacao que possui o ID atualizado.
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
