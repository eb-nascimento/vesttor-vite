import "./App.css";
import { useTransacoes } from "./hooks/useTransacoes";
import Header from "./components/Header";
import ContainerResumo from "./components/ContainerResumo";
import Form from "./components/Form";
import ListaTransacoes from "./components/ListaTransacoes";
import { useAuth } from "./hooks/useAuth";
import FormAuth from "./components/FormAuth";
import { logout } from "./services/authService";

function App() {
  const { usuario, carregandoAuth } = useAuth();
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

  if (carregandoAuth) {
    return <p>Verificando sessão...</p>;
  }
  if (!usuario) {
    return <FormAuth />;
  }

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

        <p>{usuario.email}</p>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </main>
    </>
  );
}

export default App;
