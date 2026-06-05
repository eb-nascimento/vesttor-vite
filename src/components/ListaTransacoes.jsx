import { useState } from "react";

function ListaTransacoes({ transacoes, onExcluir, onEditar }) {
  const [ordenacao, setOrdenacao] = useState("data");
  const [filtro, setFiltro] = useState("todas");

  const transacoesFiltradas = transacoes.filter((item) => {
    if (filtro === "todas") return true;
    return item.tipo === filtro;
  });

  const transacoesOrdenadas = [...transacoesFiltradas].sort((a, b) => {
    if (ordenacao === "data-crescente") {
      return new Date(a.data) - new Date(b.data);
    }
    if (ordenacao === "data-decrescente") {
      return new Date(b.data) - new Date(a.data);
    }
    if (ordenacao === "valor-crescente") {
      return a.valor - b.valor;
    }
    if (ordenacao === "valor-decrescente") {
      return b.valor - a.valor;
    }
    return b.valor - a.valor;
  });

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

      {transacoesOrdenadas.map((item) => (
        <div key={item.id} className={`transacao ${item.tipo}`}>
          <div>
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

export default ListaTransacoes;
