import { obterMensagemErroFirestore } from "../utils/errosFirestore";
import { useEffect, useState } from "react";
import { mesAtual as obterMesAtual } from "../utils/periodo";

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
  const [tentativaLeitura, setTentativaLeitura] = useState(0);
  const [mesAno, setMesAno] = useState(() => obterMesAtual());

  // Totais somente do período carregado; nenhuma consulta depende do histórico inteiro.
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
        setErroLeitura("");
        setCarregando(false);
      },
      (erro) => {
        setErroLeitura(obterMensagemErroFirestore(erro));
        setCarregando(false);
      },
      mesAno,
    );

    return cancelarObservacao;
  }, [userId, tentativaLeitura, mesAno]);

  function mudarPeriodo(mes) {
    setCarregando(true);
    setErroLeitura("");
    setMesAno(mes);
  }

  function tentarNovamente() {
    setCarregando(true);
    setErroLeitura("");
    setTentativaLeitura((tentativa) => tentativa + 1);
  }

  async function adicionarTransacao(nova) {
    try {
      setErroOperacao("");
      await criarTransacaoNaApi(nova, userId);
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro));
      throw erro;
    }
  }

  async function excluirTransacao(id) {
    try {
      setErroOperacao("");
      await excluirTransacaoNaApi(id, userId);
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro, "Não foi possível excluir a transação. Tente novamente."));
      throw erro;
    }
  }

  async function adicionarCompraParcelada(parcelas) {
    try {
      setErroOperacao("");
      await criarCompraParceladaNaApi(parcelas, userId);
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro));
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
      setErroOperacao(obterMensagemErroFirestore(erro, "Não foi possível excluir as parcelas. Confira os dados e tente novamente."));
      throw erro;
    }
  }

  function iniciarEdicao(transacao) {
    setTransacaoEditando(transacao);
  }

  async function editarTransacao(id, novosDados) {
    try {
      setErroOperacao("");
      await editarTransacaoNaApi(id, novosDados, userId);
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro));
      throw erro;
    }
  }

  async function atualizarCompraParcelada(dados) {
    try {
      setErroOperacao("");
      await atualizarCompraParceladaNaApi({ ...dados, userId });
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro));
      throw erro;
    }
  }

  async function converterParaParcelada(transacaoId, novasParcelas) {
    try {
      setErroOperacao("");
      await converterParaParceladaNaApi(transacaoId, novasParcelas, userId);
    } catch (erro) {
      setErroOperacao(obterMensagemErroFirestore(erro));
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
    tentarNovamente,
    mesAno,
    mudarPeriodo,
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
