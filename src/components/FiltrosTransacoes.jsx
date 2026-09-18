import "./FiltrosTransacoes.css";
import { Search, Filter, X } from "lucide-react";
import CustomSelect from "./CustomSelect";

function FiltrosTransacoes({
  filtros,
  onFiltroChange,
  limparFiltros,
  mesesDisponiveis,
  categoriasDisponiveis,
  metodosDisponiveis,
  isOpen,
  onToggle,
}) {
  const handleChange = (campo, valor) => {
    onFiltroChange({ ...filtros, [campo]: valor });
  };

  return (
    <div className={`filtros-transacoes-container ${isOpen ? "open" : ""}`}>
      <div className="filtros-header">
        <button
          className="btn-toggle-filtros"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="filtros-panel"
        >
          <Filter size={16} />
          {isOpen ? "Ocultar filtros" : "Abrir filtros"}
        </button>
      </div>

      {isOpen && (
        <div id="filtros-panel" className="filtros-panel">
          {/* Tipo (Pills) */}
          <div
            className="filtro-grupo tipo-pills"
            role="radiogroup"
            aria-label="Filtrar por tipo"
          >
            <button
              className={`pill ${filtros.tipo === "todas" ? "ativo" : ""}`}
              onClick={() => handleChange("tipo", "todas")}
              role="radio"
              aria-checked={filtros.tipo === "todas"}
            >
              Todas
            </button>
            <button
              className={`pill ${filtros.tipo === "receita" ? "ativo" : ""}`}
              onClick={() => handleChange("tipo", "receita")}
              role="radio"
              aria-checked={filtros.tipo === "receita"}
            >
              Receitas
            </button>
            <button
              className={`pill ${filtros.tipo === "despesa" ? "ativo" : ""}`}
              onClick={() => handleChange("tipo", "despesa")}
              role="radio"
              aria-checked={filtros.tipo === "despesa"}
            >
              Despesas
            </button>
          </div>

          {/* Busca */}
          <div className="filtro-grupo">
            <div className="busca-wrapper">
              <Search size={14} className="busca-icon" aria-hidden="true" />
              <input
                id="filtro-busca"
                type="text"
                placeholder="Buscar por descrição..."
                aria-label="Buscar por descrição das transações"
                value={filtros.busca}
                onChange={(e) => handleChange("busca", e.target.value)}
              />
            </div>
          </div>

          {/* Filtros em Grid */}
          <div className="filtros-grid">
            <div className="filtro-item">
              <label htmlFor="filtro-competencia">Competência</label>
              <select
                id="filtro-competencia"
                value={filtros.mesAno}
                onChange={(e) => handleChange("mesAno", e.target.value)}
              >
                <option value="todas">Todos os períodos</option>
                {mesesDisponiveis.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-item">
              <label htmlFor="filtro-categoria">Categoria</label>
              <CustomSelect
                id="filtro-categoria"
                value={filtros.categoria}
                onChange={(val) => handleChange("categoria", val)}
                options={[
                  { valor: "todas", label: "Todas" },
                  ...categoriasDisponiveis.map((cat) => ({
                    valor: cat,
                    label: cat,
                  })),
                ]}
              />
            </div>

            <div className="filtro-item">
              <label htmlFor="filtro-metodo">Método</label>
              <CustomSelect
                id="filtro-metodo"
                value={filtros.metodoPagamento}
                onChange={(val) => handleChange("metodoPagamento", val)}
                options={[
                  { valor: "todas", label: "Todos" },
                  ...metodosDisponiveis,
                ]}
              />
            </div>

            <div className="filtro-item">
              <label htmlFor="filtro-ordenacao">Ordenação</label>
              <CustomSelect
                id="filtro-ordenacao"
                value={filtros.ordenacao}
                onChange={(val) => handleChange("ordenacao", val)}
                options={[
                  { valor: "data-decrescente", label: "Mais recentes" },
                  { valor: "data-crescente", label: "Mais antigas" },
                  { valor: "valor-decrescente", label: "Maior valor" },
                  { valor: "valor-crescente", label: "Menor valor" },
                ]}
              />
            </div>
          </div>

          <div className="filtros-actions">
            <button className="btn-limpar" onClick={limparFiltros}>
              <X size={14} />
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltrosTransacoes;
