import "./ListaTransacoes.css";

import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  filtrarTransacoes,
  filtrarTransacoesRecentes,
  ordenarTransacoes,
} from "../utils/transacao";
import ItemTransacao from "./ItemTransacao";
import ControlesTransacoes from "./ControlesTransacoes";
import ModalExclusaoParcelamento from "./ModalExclusaoParcelamento";

function ListaTransacoes({
  transacoes = [],
  onExcluir,
  onExcluirSerie,
  onEditar,
  maxItens,
  apenasRecentes = false,
}) {
  // Filtro e ordenação alteram somente a exibição, não os dados no Firestore.
  const [searchParams, setsearchParams] = useSearchParams();
  const filtro = searchParams.get("filtro") || "todas";
  const ordenacao = searchParams.get("ordenacao") || "data-decrescente";

  // Estado para confirmação de exclusão de compras parceladas
  const [transacaoParceladaParaExcluir, setTransacaoParceladaParaExcluir] =
    useState(null);

  function setFiltro(novoFiltro) {
    setsearchParams({
      filtro: novoFiltro,
      ordenacao: ordenacao,
    });
  }

  function setOrdenacao(novaOrdenacao) {
    setsearchParams({
      filtro: filtro,
      ordenacao: novaOrdenacao,
    });
  }

  // Se for a visão de recentes (ex: na Home), limita até o mês atual e deduplica parcelamentos
  const transacoesBase = apenasRecentes
    ? filtrarTransacoesRecentes(transacoes)
    : transacoes;

  // Fluxo de exibição: lista base -> filtro -> ordenação -> slice (se maxItens).
  const transacoesFiltradas = filtrarTransacoes(transacoesBase, filtro);
  const transacoesOrdenadas = ordenarTransacoes(transacoesFiltradas, ordenacao);
  const transacoesExibidas = maxItens
    ? transacoesOrdenadas.slice(0, maxItens)
    : transacoesOrdenadas;
  const listaVazia = transacoesExibidas.length === 0;

  // Subtítulo descritivo de quantidade
  function obterSubtitulo() {
    if (transacoesBase.length === 0) return "Nenhuma movimentação registrada";
    if (maxItens && transacoesOrdenadas.length > maxItens) {
      return `Exibindo as ${transacoesExibidas.length} mais recentes de ${transacoesOrdenadas.length} movimentações`;
    }
    return `${transacoesOrdenadas.length} de ${transacoesBase.length} movimentações`;
  }

  return (
    <section className="lista-transacoes">
      <div className="lista-header">
        <div>
          <h2>Transações recentes</h2>
          <p className="lista-subtitulo">{obterSubtitulo()}</p>
        </div>
      </div>

      <ControlesTransacoes
        filtro={filtro}
        onFiltroChange={setFiltro}
        ordenacao={ordenacao}
        onOrdenacaoChange={setOrdenacao}
      />

      <div className="lista-itens-container">
        {listaVazia && (
          <p className="lista-vazia">{obterMensagemVazia(filtro)}</p>
        )}
        {transacoesExibidas.map((item) => (
          <ItemTransacao
            key={item.id}
            item={item}
            onEditar={onEditar}
            onExcluir={onExcluir}
            onSolicitarExclusaoParcelamento={
              onExcluirSerie
                ? (t) => setTransacaoParceladaParaExcluir(t)
                : undefined
            }
          />
        ))}
      </div>

      <div className="lista-footer-box">
        <div className="lista-footer-info">
          <h4>Tudo atualizado</h4>
          <p>
            Cadastre uma nova movimentação no formulário ao lado ou consulte o
            histórico completo.
          </p>
        </div>
        <Link to="/transacoes" className="lista-footer-link">
          Abrir todas as transações ({transacoes.length}) &rarr;
        </Link>
      </div>

      {transacaoParceladaParaExcluir && (
        <ModalExclusaoParcelamento
          transacao={transacaoParceladaParaExcluir}
          onExcluirApenasEsta={() => {
            onExcluir(transacaoParceladaParaExcluir.id);
            setTransacaoParceladaParaExcluir(null);
          }}
          onExcluirSerie={() => {
            if (onExcluirSerie) {
              onExcluirSerie(
                transacaoParceladaParaExcluir.parcelamentoId,
                transacaoParceladaParaExcluir.numeroParcela,
              );
            }
            setTransacaoParceladaParaExcluir(null);
          }}
          onFechar={() => setTransacaoParceladaParaExcluir(null)}
        />
      )}
    </section>
  );
}

// A mensagem pertence à interface e varia conforme o filtro selecionado.
function obterMensagemVazia(filtro) {
  if (filtro === "receita") {
    return "Nenhuma receita encontrada.";
  }
  if (filtro === "despesa") {
    return "Nenhuma despesa encontrada.";
  }
  return "Nenhuma transação cadastrada.";
}

export default ListaTransacoes;
