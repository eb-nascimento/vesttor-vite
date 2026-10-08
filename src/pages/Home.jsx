import "./Home.css";
import { useTransacoes } from "../hooks/useTransacoes";
import ContainerResumo from "../features/dashboard/components/ContainerResumo";
import FormTransacao from "../features/transactions/components/FormTransacao";
import ListaTransacoes from "../features/transactions/components/ListaTransacoes";

function Home({ usuario }) {
  // O home só é renderizado para usuários autenticados.
  // O UID alimenta o hook para assinar somente as transações desse usuário.
  const {
    transacoes,
    carregando,
    erroLeitura,
    erroOperacao,
    adicionarTransacao,
    adicionarCompraParcelada,
    excluirTransacao,
    excluirParcelasFuturas,
    editarTransacao,
    atualizarCompraParcelada,
    converterParaParcelada,
    iniciarEdicao,
    transacaoEditando,
    cancelarEdicao,
    saldoMesAtual,
    receitasMesAtual,
    despesasMesAtual,
  } = useTransacoes(usuario?.uid);

  return (
    <section className="home-page">
      <div className="home-grid">
        <aside className="home-coluna-form">
          <FormTransacao
            key={transacaoEditando?.id ?? "nova-transacao"}
            onAdd={adicionarTransacao}
            onAddParcelado={adicionarCompraParcelada}
            onEdit={editarTransacao}
            onEditParcelado={atualizarCompraParcelada}
            onConverterParaParcelado={converterParaParcelada}
            transacaoEditando={transacaoEditando}
            cancelarEdicao={cancelarEdicao}
          />
        </aside>

        <div className="home-coluna-painel">
          <ContainerResumo
            saldo={saldoMesAtual}
            receitas={receitasMesAtual}
            despesas={despesasMesAtual}
          />

          {carregando && (
            <p className="status-feedback">Carregando transações...</p>
          )}

          {erroOperacao && (
            <p className="erro-msg" role="alert">
              {erroOperacao}
            </p>
          )}

          {erroLeitura && (
            <p className="erro-msg" role="alert">
              {erroLeitura}
            </p>
          )}

          {!carregando && !erroLeitura && (
            <ListaTransacoes
              transacoes={transacoes}
              maxItens={5}
              apenasRecentes={true}
              onExcluir={excluirTransacao}
              onExcluirSerie={excluirParcelasFuturas}
              onEditar={iniciarEdicao}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
