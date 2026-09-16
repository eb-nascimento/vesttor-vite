import { useTransacoes } from "../hooks/useTransacoes";

import ListaTransacoes from "../components/ListaTransacoes";

function Transacoes({ usuario }) {
  const {
    carregando,
    erroOperacao,
    erroLeitura,
    transacoes,
    excluirTransacao,
    iniciarEdicao,
  } = useTransacoes(usuario?.uid);

  return (
    <div>
      <h2>Transações</h2>
      {carregando && <p>Carregando transações...</p>}

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
          onExcluir={excluirTransacao}
          onEditar={iniciarEdicao}
        />
      )}
    </div>
  );
}

export default Transacoes;
