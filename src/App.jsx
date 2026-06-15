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

  // O UID segue para o hook e limita as transacoes ao usuario atual.
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

  // Evita mostrar o login antes de o Firebase restaurar uma sessao existente.
  if (carregandoAuth) {
    return <p>Verificando sessão...</p>;
  }

  // Sem sessao autenticada, somente o formulario de acesso e exibido.
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
