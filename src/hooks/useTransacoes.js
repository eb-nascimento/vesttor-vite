import { useEffect, useState } from "react";

import {
  observarTransacoes,
  criarTransacaoNaApi,
  excluirTransacaoNaApi,
  editarTransacaoNaApi,
  criarCompraParceladaNaApi,
  excluirParcelasFuturasNaApi,
  atualizarCompraParceladaNaApi,
  converterParaParceladaNaApi,
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
  const [erroLeitura, setErroLeitura] = useState("");
  const [erroOperacao, setErroOperacao] = useState("");

  // Saldo geral acumulado histórico
  const saldo = calcularSaldo(transacoes);
  const receitas = calcularReceitas(transacoes);
  const despesas = calcularDespesas(transacoes);

  // Saldo do mês corrente (regime de competência para a Home)
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const transacoesMesAtual = transacoes.filter((t) => {
    if (!t.data) return false;
    const dataObj = t.data.toDate
      ? t.data.toDate()
      : new Date(`${t.data}T12:00:00`);
    return (
      dataObj.getMonth() === mesAtual && dataObj.getFullYear() === anoAtual
    );
  });

  const saldoMesAtual = calcularSaldo(transacoesMesAtual);
  const receitasMesAtual = calcularReceitas(transacoesMesAtual);
  const despesasMesAtual = calcularDespesas(transacoesMesAtual);

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
        setErroLeitura(erro.message);
        setCarregando(false);
      },
    );

    return cancelarObservacao;
  }, [userId]);

  async function adicionarTransacao(nova) {
    try {
      setErroOperacao("");
      await criarTransacaoNaApi(nova, userId);
    } catch (erro) {
      setErroOperacao(erro.message);
      throw erro;
    }
  }

  async function excluirTransacao(id) {
    try {
      setErroOperacao("");
      await excluirTransacaoNaApi(id);
    } catch (erro) {
      setErroOperacao(erro.message);
    }
  }

  async function adicionarCompraParcelada(parcelas) {
    try {
      setErroOperacao("");
      await criarCompraParceladaNaApi(parcelas, userId);
    } catch (erro) {
      setErroOperacao(erro.message);
      throw erro;
    }
  }

  async function excluirParcelasFuturas(parcelamentoId, numeroParcelaMinimo) {
    try {
      setErroOperacao("");
      await excluirParcelasFuturasNaApi(
        parcelamentoId,
        numeroParcelaMinimo,
        userId,
      );
    } catch (erro) {
      setErroOperacao(erro.message);
    }
  }

  function iniciarEdicao(transacao) {
    setTransacaoEditando(transacao);
  }

  async function editarTransacao(id, novosDados) {
    try {
      setErroOperacao("");
      await editarTransacaoNaApi(id, novosDados);
    } catch (erro) {
      setErroOperacao(erro.message);
      throw erro;
    }
  }

  async function atualizarCompraParcelada(dados) {
    try {
      setErroOperacao("");
      await atualizarCompraParceladaNaApi({ ...dados, userId });
    } catch (erro) {
      setErroOperacao(erro.message);
      throw erro;
    }
  }

  async function converterParaParcelada(transacaoId, novasParcelas) {
    try {
      setErroOperacao("");
      await converterParaParceladaNaApi(transacaoId, novasParcelas, userId);
    } catch (erro) {
      setErroOperacao(erro.message);
      throw erro;
    }
  }

  function cancelarEdicao() {
    setTransacaoEditando(null);
  }

  return {
    transacoes,
    carregando,
    erroLeitura,
    erroOperacao,
    saldo,
    receitas,
    despesas,
    saldoMesAtual,
    receitasMesAtual,
    despesasMesAtual,
    adicionarTransacao,
    adicionarCompraParcelada,
    excluirTransacao,
    excluirParcelasFuturas,
    editarTransacao,
    atualizarCompraParcelada,
    converterParaParcelada,
    transacaoEditando,
    iniciarEdicao,
    cancelarEdicao,
  };
}
