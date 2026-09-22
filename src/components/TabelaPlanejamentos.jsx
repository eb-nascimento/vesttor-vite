import "./TabelaPlanejamentos.css";
import { Search, Plus } from "lucide-react";

function TabelaPlanejamentos({ itens = [] }) {
  return (
    <section className="tabela-planejamentos-container">
      <div className="tabela-planejamentos-header">
        <h2>Planejamentos</h2>
        <div className="tabela-planejamentos-filtros">
          <button className="filtro-btn ativo">Todos</button>
          <button className="filtro-btn">Entradas</button>
          <button className="filtro-btn">Fixos</button>
          <button className="filtro-btn">Variáveis</button>
        </div>
        <button className="btn-acao search">
          <Search size={12} />
          Buscar
        </button>
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
          {itens.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="item-info">
                  <span className="item-title">{item.categoria}</span>
                  <span className="item-subtitle">{item.tipo}</span>
                </div>
              </td>
              <td className="align-right">R$ {item.planejado.toFixed(2)}</td>
              <td className="align-right `text-`${item.categoria === 'Entrada' ? 'green' : 'red'}`">
                R$ {item.valorRealizado.toFixed(2)}
              </td>
              <td>
                <span
                  className={`badge ${item.valorRealizado > item.planejado ? "red" : "green"}`}
                >
                  X% utilizado
                </span>
              </td>
              <td className="acoes">•••</td>
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
