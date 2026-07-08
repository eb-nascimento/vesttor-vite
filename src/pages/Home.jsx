import "./Home.css";
import { useTransacoes } from "../hooks/useTransacoes";
import ContainerResumo from "../components/ContainerResumo";
import Form from "../components/Form";
import ListaTransacoes from "../components/ListaTransacoes";

function Home({ usuario }) {
  // O home so e renderizado para usuarios autenticados.
  // O UID alimenta o hook para assinar somente as transacoes desse usuario.
  const {
    transacoes,
    carregando,
    erro,
    adicionarTransacao,
    excluirTransacao,
    editarTransacao,
    iniciarEdicao,
    transacaoEditando,
    cancelarEdicao,
    saldo,
    receitas,
    despesas,
  } = useTransacoes(usuario?.uid);

  return (
    <>
      <section className="home-page">
        <ContainerResumo
          saldo={saldo}
          receitas={receitas}
          despesas={despesas}
        />

        <section className="transacoes-section">
          <Form
            key={transacaoEditando?.id ?? "nova-transacao"}
            onAdd={adicionarTransacao}
            onEdit={editarTransacao}
            transacaoEditando={transacaoEditando}
            cancelarEdicao={cancelarEdicao}
          />

          {carregando && <p>Carregando transaÃ§Ãµes...</p>}

          {erro && <p className="erro-msg">{erro}</p>}

          {!carregando && (
            <ListaTransacoes
              transacoes={transacoes}
              onExcluir={excluirTransacao}
              onEditar={iniciarEdicao}
            />
          )}
        </section>
      </section>
    </>
  );
}

export default Home;
