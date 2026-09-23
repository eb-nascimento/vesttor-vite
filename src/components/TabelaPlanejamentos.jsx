import { useState } from "react";
import "./TabelaPlanejamentos.css";
import { Search, Plus, AlertTriangle, Check, EditIcon } from "lucide-react";

function TabelaPlanejamentos({ itens = [], onApprove, onEdit }) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [textoBusca, setTextoBusca] = useState("");

  // Função que abstrai a regra de negócios da porcentagem
  const calcularStatus = (realizado, planejado) => {
    if (planejado > 0) {
      return `${((realizado / planejado) * 100).toFixed(0)}% utilizado`;
    }
    if (realizado > 0) {
      return "Acima do limite";
    }
    return "0% utilizado";
  };

  // Aplica os filtros
  const itensFiltrados = itens.filter((item) => {
    // 1. Filtro por Aba
    if (filtroAtivo === "Entradas" && item.tipo !== "Entrada") return false;
    if (filtroAtivo === "Fixos" && item.tipo !== "Fixo") return false;
    if (filtroAtivo === "Variáveis" && item.tipo !== "Variável") return false;

    // 2. Filtro por Texto (Busca)
    if (textoBusca) {
      const termo = textoBusca.toLowerCase();
      return item.categoria.toLowerCase().includes(termo);
    }
    return true;
  });

  return (
    <section className="tabela-planejamentos-container">
      <div className="tabela-planejamentos-header">
        <h2>Planejamentos</h2>
        <div className="tabela-planejamentos-filtros">
          {["Todos", "Entradas", "Fixos", "Variáveis"].map((aba) => (
            <button
              key={aba}
              className={`filtro-btn ${filtroAtivo === aba ? "ativo" : ""}`}
              onClick={() => setFiltroAtivo(aba)}
            >
              {aba}
            </button>
          ))}
        </div>

        {buscaAtiva || textoBusca ? (
          <div className="busca-container-ativo">
            <Search size={12} color="#9fb0c3" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={textoBusca}
              onChange={(e) => setTextoBusca(e.target.value)}
              onBlur={() => {
                if (!textoBusca) setBuscaAtiva(false);
              }}
              className="busca-input"
            />
          </div>
        ) : (
          <button
            className="btn-acao search"
            onClick={() => setBuscaAtiva(true)}
          >
            <Search size={12} />
            Buscar
          </button>
        )}
      </div>
      <table className="tabela-planejamentos">
        <thead>
          <tr>
            <th>Item</th>
            <th className="align-right">Planejado</th>
            <th className="align-right">Realizado</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itensFiltrados.map((item) => (
            <tr
              key={item.id}
              className={item.isUnplanned ? "linha-alerta" : ""}
            >
              <td>
                <div className="item-info">
                  <span className="item-title">{item.categoria}</span>
                  <span className="item-subtitle">{item.tipo}</span>
                </div>
              </td>
              <td className="align-right">R$ {item.planejado.toFixed(2)}</td>
              <td
                className={`align-right text-${item.categoria === "Entrada" ? "green" : "red"}`}
              >
                R$ {item.valorRealizado.toFixed(2)}
              </td>
              <td>
                {item.isUnplanned ? (
                  <span className="badge red alert-badge">
                    <AlertTriangle size={12} />
                    Não planejado
                  </span>
                ) : (
                  <span
                    className={`badge ${item.valorRealizado > item.planejado ? "red" : "green"}`}
                  >
                    {calcularStatus(item.valorRealizado, item.planejado)}
                  </span>
                )}
              </td>
              <td className="acoes">
                {item.isUnplanned ? (
                  <button
                    className="btn-acao-ok"
                    onClick={() => onApprove && onApprove(item)}
                    title="Adicionar ao planejamento"
                  >
                    <Check size={14} /> OK
                  </button>
                ) : (
                  <button
                    className="btn-acao-dots"
                    onClick={() => onEdit && onEdit(item)}
                    title="Editar planejamento"
                  >
                    <EditIcon size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className="add-row">
              + Adicionar planejamento
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

export default TabelaPlanejamentos;
