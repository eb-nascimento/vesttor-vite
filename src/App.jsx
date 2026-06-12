import "./App.css";
import { useTransacoes } from "./hooks/useTransacoes";
import Header from "./components/Header";
import ContainerResumo from "./components/ContainerResumo";
import Form from "./components/Form";
import ListaTransacoes from "./components/ListaTransacoes";

function App() {
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
  } = useTransacoes();

  return (
    <>
      <Header />
      <main>
        <ContainerResumo
          saldo={saldo}
          receitas={receitas}
          despesas={despesas}
        />
        <Form
          onAdd={adicionarTransacao}
          onEdit={editarTransacao}
          transacaoEditando={transacaoEditando}
          cancelarEdicao={cancelarEdicao}
        />

        {carregando && <p>Carregando transações...</p>}

        {erro && <p className="erro-msg">{erro}</p>}

        {!carregando && (
          <ListaTransacoes
            transacoes={transacoes}
            onExcluir={excluirTransacao}
            onEditar={iniciarEdicao}
          />
        )}
      </main>
    </>
  );
}

export default App;
