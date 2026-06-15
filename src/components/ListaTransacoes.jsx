import { useState } from "react";
import { filtrarTransacoes, ordenarTransacoes } from "../utils/transacao";
import ItemTransacao from "./ItemTransacao";
import ControlesTransacoes from "./ControlesTransacoes";

function ListaTransacoes({ transacoes, onExcluir, onEditar }) {
  // Filtro e ordenacao alteram somente a exibicao, nao os dados no Firestore.
  const [ordenacao, setOrdenacao] = useState("data-decrescente");
  const [filtro, setFiltro] = useState("todas");

  // Fluxo de exibicao: lista original -> filtro -> ordenacao -> renderizacao.
  const transacoesFiltradas = filtrarTransacoes(transacoes, filtro);
  const transacoesOrdenadas = ordenarTransacoes(transacoesFiltradas, ordenacao);
  const listaVazia = transacoesOrdenadas.length === 0;

  return (
    <section className="lista-transacoes">
      <h2>Transações</h2>
      <ControlesTransacoes
        filtro={filtro}
        onFiltroChange={setFiltro}
        ordenacao={ordenacao}
        onOrdenacaoChange={setOrdenacao}
      />
      {listaVazia && (
        <p className="lista-vazia">{obterMensagemVazia(filtro)}</p>
      )}
      {transacoesOrdenadas.map((item) => (
        <ItemTransacao
          key={item.id}
          item={item}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </section>
  );
}

// A mensagem pertence a interface e varia conforme o filtro selecionado.
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
