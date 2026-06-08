import { useState } from "react";
import { filtrarTransacoes, ordenarTransacoes } from "../utils/transacao";
import ItemTransacao from "./itemTransacao";
import ControlesTransacoes from "./ControlesTransacoes";

function ListaTransacoes({ transacoes, onExcluir, onEditar }) {
  // Estados que controlam como a lista sera exibida na tela.
  const [ordenacao, setOrdenacao] = useState("data-decrescente");
  // Estado para controlar o filtro ativo. O valor "todas" mostra todas as transacoes, sem filtrar por tipo.
  const [filtro, setFiltro] = useState("todas");
  // Primeiro aplicamos o filtro sobre a lista original de transacoes.
  const transacoesFiltradas = filtrarTransacoes(transacoes, filtro);
  // Depois ordenamos uma copia da lista filtrada, sem alterar o estado original.
  const transacoesOrdenadas = ordenarTransacoes(transacoesFiltradas, ordenacao);
  // Variavel booleana para controlar a exibicao da mensagem de lista vazia.
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
      {/* O map usa a lista final, ja filtrada e ordenada. */}
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
// Funcao auxiliar para obter a mensagem de lista vazia, dependendo do filtro ativo.
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
