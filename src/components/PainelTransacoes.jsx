import { useState } from "react";
// import "./painelTransacoes.css";

function PainelTransacoes({ transacoes, onEditar, onExcluir }) {
  const [filtro, setFiltro] = useState("todas");

  const transacoesFiltradas = transacoes.filter((item) => {
    if (filtro === "todas") return true;
    return item.tipo === filtro;
  });

  return (
    <section className="painel-transacoes">
      <h2>Transações</h2>
      <div className="filtros">
        <button
          className={filtro === "todas" ? "ativo" : ""}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          className={filtro === "receita" ? "ativo" : ""}
          onClick={() => setFiltro("receita")}
        >
          Receitas
        </button>
        <button
          className={filtro === "despesa" ? "ativo" : ""}
          onClick={() => setFiltro("despesa")}
        >
          Despesas
        </button>
      </div>
    </section>
  );
}

export default PainelTransacoes;
