import { useState } from "react";
import { useTransacoes } from "../hooks/useTransacoes";
import ResumoPeriodo from "../components/ResumoPeriodo";
import FiltrosTransacoes from "../components/FiltrosTransacoes";
import TabelaTransacoes from "../components/TabelaTransacoes";
import ItemTransacao from "../components/ItemTransacao";
import Paginacao from "../components/Paginacao";
import PaginadorMes from "../components/PaginadorMes";
import ModalFormTransacao from "../components/ModalFormTransacao";
import ModalExclusaoParcelamento from "../components/ModalExclusaoParcelamento";
import { Plus } from "lucide-react";
import { ITENS_POR_PAGINA, useFiltrosTransacoes } from "../hooks/useFiltrosTransacoes";
import "./Transacoes.css";

function Transacoes({ usuario }) {
  const {
    carregando,
    erroOperacao,
    erroLeitura,
    transacoes,
    adicionarTransacao,
    adicionarTransacaoParcelada,
    editarTransacao,
    editarTransacaoParcelada,
    converterParaParcelado,
    excluirTransacao,
    excluirParcelasFuturas,
  } = useTransacoes(usuario?.uid);

  const {
    filtros,
    setFiltros,
    filtrosAbertos,
    setFiltrosAbertos,
    paginaAtual,
    setPaginaAtual,
    mesesDisponiveis,
    categoriasDisponiveis,
    metodosDisponiveis,
    transacoesPaginadas,
    totais,
    totalItens,
    totalPaginas,
    limparFiltros,
    handleMudarMes,
  } = useFiltrosTransacoes(transacoes);

  // Estados de Modais
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState(null);

  const handleEditar = (item) => {
    setTransacaoEditando(item);
    setModalFormAberto(true);
  };

  const handleExcluirNormal = (id) => {
    excluirTransacao(id);
  };

  const handleSolicitarExclusaoParcelamento = (item) => {
    setTransacaoParaExcluir(item);
  };

  return (
    <div className="transacoes-page">
      <div className="transacoes-title-container">
        <div>
          <h2>Transações</h2>
          <p className="transacoes-subtitle">
            Consulte e gerencie suas movimentações.
          </p>
        </div>
        <div
          className="transacoes-title-actions"
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
          <PaginadorMes
            mesAtual={
              mesesDisponiveis.find((m) => m.valor === filtros.mesAno)?.label ||
              "Setembro de 2026"
            }
            onMudarMes={handleMudarMes}
          />
          <button
            className="btn-nova-transacao"
            onClick={() => {
              setTransacaoEditando(null);
              setModalFormAberto(true);
            }}
          >
            <Plus size={16} aria-hidden="true" />
            Nova transação
          </button>
        </div>
      </div>

      {(erroOperacao || erroLeitura) && (
        <div className="erro-msg" role="alert">
          {erroOperacao || erroLeitura}
        </div>
      )}

      {carregando ? (
        <p>Carregando transações...</p>
      ) : (
        <>
          <ResumoPeriodo
            saldo={totais.saldo}
            receitas={totais.receitas}
            despesas={totais.despesas}
            quantidade={totalItens}
          />

          <FiltrosTransacoes
            filtros={filtros}
            onFiltroChange={setFiltros}
            limparFiltros={limparFiltros}
            mesesDisponiveis={mesesDisponiveis}
            categoriasDisponiveis={categoriasDisponiveis}
            metodosDisponiveis={metodosDisponiveis}
            isOpen={filtrosAbertos}
            onToggle={() => setFiltrosAbertos(!filtrosAbertos)}
          />

          <TabelaTransacoes
            transacoes={transacoesPaginadas}
            onEditar={handleEditar}
            onExcluir={handleExcluirNormal}
            onSolicitarExclusaoParcelamento={
              handleSolicitarExclusaoParcelamento
            }
          />

          {/* Visão Mobile com os Itens Originais */}
          <div className="lista-mobile-only">
            {transacoesPaginadas.length === 0 ? (
              <div className="tabela-vazia">
                Nenhuma transação encontrada no período.
              </div>
            ) : (
              transacoesPaginadas.map((item) => (
                <ItemTransacao
                  key={item.id}
                  item={item}
                  onEditar={() => handleEditar(item)}
                  onExcluir={handleExcluirNormal}
                  onSolicitarExclusaoParcelamento={
                    handleSolicitarExclusaoParcelamento
                  }
                />
              ))
            )}
          </div>

          <Paginacao
            totalPaginas={totalPaginas}
            paginaAtual={paginaAtual}
            temAnterior={paginaAtual > 1}
            temProxima={paginaAtual < totalPaginas}
            de={(paginaAtual - 1) * ITENS_POR_PAGINA + 1}
            ate={Math.min(paginaAtual * ITENS_POR_PAGINA, totalItens)}
            totalItens={totalItens}
            onMudarPagina={setPaginaAtual}
          />
        </>
      )}

      <ModalFormTransacao
        isOpen={modalFormAberto}
        onClose={() => {
          setModalFormAberto(false);
          setTransacaoEditando(null);
        }}
        transacaoEditando={transacaoEditando}
        onAdd={adicionarTransacao}
        onAddParcelado={adicionarTransacaoParcelada}
        onEdit={editarTransacao}
        onEditParcelado={editarTransacaoParcelada}
        onConverterParaParcelado={converterParaParcelado}
      />

      {transacaoParaExcluir && (
        <ModalExclusaoParcelamento
          transacao={transacaoParaExcluir}
          onExcluirApenasEsta={() => {
            excluirTransacao(transacaoParaExcluir.id);
            setTransacaoParaExcluir(null);
          }}
          onExcluirSerie={() => {
            excluirParcelasFuturas(
              transacaoParaExcluir.parcelamentoId,
              transacaoParaExcluir.numeroParcela,
            );
            setTransacaoParaExcluir(null);
          }}
          onFechar={() => setTransacaoParaExcluir(null)}
        />
      )}
    </div>
  );
}

export default Transacoes;
