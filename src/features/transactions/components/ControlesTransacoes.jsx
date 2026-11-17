import Select from "../../../components/ui/Select";
import "./ControlesTransacoes.css";

function ControlesTransacoes({
  filtro,
  onFiltroChange,
  ordenacao,
  onOrdenacaoChange,
}) {
  return (
    <section className="painel-transacoes">
      <div
        className="filtro-pills"
        role="group"
        aria-label="Filtro de transações"
      >
        <button
          type="button"
          className={`pill-btn ${filtro === "todas" ? "ativo" : ""}`}
          onClick={() => onFiltroChange("todas")}
        >
          Todas
        </button>
        <button
          type="button"
          className={`pill-btn ${filtro === "receita" ? "ativo" : ""}`}
          onClick={() => onFiltroChange("receita")}
        >
          Receitas
        </button>
        <button
          type="button"
          className={`pill-btn ${filtro === "despesa" ? "ativo" : ""}`}
          onClick={() => onFiltroChange("despesa")}
        >
          Despesas
        </button>
      </div>

      <div className="ordenacao-wrapper">
        <Select
          value={ordenacao}
          onChange={(e) => onOrdenacaoChange(e.target.value)}
          className="ordenacao-select"
          aria-label="Ordenar transações"
        >
          <option value="data-decrescente">Mais recentes</option>
          <option value="data-crescente">Mais antigas</option>
          <option value="valor-decrescente">Maior valor</option>
          <option value="valor-crescente">Menor valor</option>
        </Select>
      </div>
    </section>
  );
}

export default ControlesTransacoes;

