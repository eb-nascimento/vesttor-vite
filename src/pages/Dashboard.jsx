import Header from "../components/Header";
import ContainerResumo from "../components/ContainerResumo";
import Form from "../components/Form";
import ListaTransacoes from "../components/ListaTransacoes";
import { logout } from "../services/authService";
import { useTransacoes } from "../hooks/useTransacoes";

function Dashboard({ usuario }) {
  // O dashboard so e renderizado para usuarios autenticados.
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
      <Header usuario={usuario} onLogout={logout} />
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

        {/* Controle simples de sessao enquanto nao existe layout/nav dedicado. */}
        <p>{usuario.email}</p>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </main>
    </>
  );
}

export default Dashboard;

