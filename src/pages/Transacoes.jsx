import { useState } from "react";
import { useTransacoes } from "../hooks/useTransacoes";
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";

import ResumoPeriodo from "../features/transactions/components/ResumoPeriodo";
import FiltrosTransacoes from "../features/transactions/components/FiltrosTransacoes";
import TabelaTransacoes from "../features/transactions/components/TabelaTransacoes";
import ItemTransacao from "../features/transactions/components/ItemTransacao";
import Paginacao from "../components/ui/Paginacao";
import PaginadorMes from "../components/ui/PaginadorMes";
import ModalFormTransacao from "../features/transactions/components/ModalFormTransacao";
import ModalExclusaoParcelamento from "../features/transactions/components/ModalExclusaoParcelamento";
import {
  ITENS_POR_PAGINA,
  useFiltrosTransacoes,
} from "../hooks/useFiltrosTransacoes";
import "./Transacoes.css";

import PageHeader from "../components/ui/PageHeader";

function Transacoes({ usuario }) {
  const {
    carregando,
    erroOperacao,
    erroLeitura,
    tentarNovamente,
    transacoes,
    adicionarTransacao,
    adicionarCompraParcelada,
    editarTransacao,
    atualizarCompraParcelada,
    converterParaParcelada,
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
    return excluirTransacao(id);
  };

  const handleSolicitarExclusaoParcelamento = (item) => {
    setTransacaoParaExcluir(item);
  };

  return (
    <section className="transacoes-page">
      <PageHeader
        title="Transações"
        subtitle="Consulte e gerencie suas movimentações."
      >
        <PaginadorMes
          mesAtual={
            mesesDisponiveis.find((m) => m.valor === filtros.mesAno)?.label
          }
          onMudarMes={handleMudarMes}
        />

        <Button
          icon={Plus}
          onClick={() => {
            setTransacaoEditando(null);
            setModalFormAberto(true);
          }}
        >
          Nova Transação
        </Button>
      </PageHeader>

      {(erroOperacao || erroLeitura) && (
        <div className="erro-msg" role="alert">
          {erroOperacao || erroLeitura}
          {erroLeitura && <Button onClick={tentarNovamente} disabled={carregando}>Tentar novamente</Button>}
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
        onAddParcelado={adicionarCompraParcelada}
        onEdit={editarTransacao}
        onEditParcelado={atualizarCompraParcelada}
        onConverterParaParcelado={converterParaParcelada}
      />

      {transacaoParaExcluir && (
        <ModalExclusaoParcelamento
          transacao={transacaoParaExcluir}
          onExcluirApenasEsta={() => excluirTransacao(transacaoParaExcluir.id)}
          onExcluirSerie={() => {
            return excluirParcelasFuturas(
              transacaoParaExcluir.parcelamentoId,
              transacaoParaExcluir.numeroParcela,
            );
          }}
          onFechar={() => setTransacaoParaExcluir(null)}
        />
      )}
    </section>
  );
}

export default Transacoes;
