import { useState } from "react";

import { filtrarTransacoes, ordenarTransacoes } from "../utils/transacao";

function ListaTransacoes({ transacoes, onExcluir, onEditar }) {
  // Estados que controlam como a lista sera exibida na tela.
  const [ordenacao, setOrdenacao] = useState("data-decrescente");
  const [filtro, setFiltro] = useState("todas");
  // Primeiro aplicamos o filtro sobre a lista original de transacoes.
  const transacoesFiltradas = filtrarTransacoes(transacoes, filtro);
  // Depois ordenamos uma copia da lista filtrada, sem alterar o estado original.
  const transacoesOrdenadas = ordenarTransacoes(transacoesFiltradas, ordenacao);

  const listaVazia = transacoesOrdenadas.length === 0;

  return (
    <section className="lista-transacoes">
      <h2>Transações</h2>
      <section className="painel-transacoes">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtros"
        >
          <option value="todas">Todas</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          className="ordenacao"
        >
          <option value="data-crescente">Data Crescente</option>
          <option value="data-decrescente">Data Decrescente</option>
          <option value="valor-crescente">Valor Crescente</option>
          <option value="valor-decrescente">Valor Decrescente</option>
        </select>
      </section>

      {listaVazia && (
        <p className="lista-vazia">{obterMensagemVazia(filtro)}</p>
      )}

      {/* O map usa a lista final, ja filtrada e ordenada. */}
      {transacoesOrdenadas.map((item) => (
        <div key={item.id} className={`transacao ${item.tipo}`}>
          <div>
            <p className="data">{item.data.split("-").reverse().join("/")}</p>
            <p>{item.descricao}</p>
            <span style={{ color: item.tipo === "receita" ? "green" : "red" }}>
              {item.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <span className="buttons">
            <button onClick={() => onEditar(item)}>
              <img src="/src/assets/edit.svg" alt="Editar" width={20} />
            </button>
            <button onClick={() => onExcluir(item.id)}>
              <img src="/src/assets/trash.svg" alt="Excluir" width={20} />
            </button>
          </span>
        </div>
      ))}
      <hr />
    </section>
  );
}

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
