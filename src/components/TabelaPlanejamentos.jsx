import "./TabelaPlanejamentos.css";
import { Search, Plus } from "lucide-react";

function TabelaPlanejamentos({}) {
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
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Salário</span>
                <span className="item-subtitle">Entrada · mensal</span>
              </div>
            </td>
            <td className="align-right">R$ 7.000</td>
            <td className="align-right text-green">R$ 7.000</td>
            <td>
              <span className="badge badge-green">Confirmado</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Freelance</span>
                <span className="item-subtitle">Entrada · pontual</span>
              </div>
            </td>
            <td className="align-right">R$ 1.500</td>
            <td className="align-right text-yellow">R$ 1.200</td>
            <td>
              <span className="badge badge-yellow">Pendente</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Aluguel</span>
                <span className="item-subtitle">Fixo · vence dia 08</span>
              </div>
            </td>
            <td className="align-right">R$ 2.200</td>
            <td className="align-right text-green">R$ 2.200</td>
            <td>
              <span className="badge badge-dark">Pago</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Condomínio</span>
                <span className="item-subtitle">Fixo · vence dia 10</span>
              </div>
            </td>
            <td className="align-right">R$ 900</td>
            <td className="align-right text-green">R$ 870</td>
            <td>
              <span className="badge badge-dark">Pago</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Alimentação</span>
                <span className="item-subtitle">Variável · limite mensal</span>
              </div>
            </td>
            <td className="align-right">R$ 1.000</td>
            <td className="align-right text-yellow">R$ 860</td>
            <td>
              <span className="badge badge-yellow">86% usado</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Transporte</span>
                <span className="item-subtitle">Variável · limite mensal</span>
              </div>
            </td>
            <td className="align-right">R$ 700</td>
            <td className="align-right text-green">R$ 520</td>
            <td>
              <span className="badge badge-green">74% usado</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
          <tr>
            <td>
              <div className="item-info">
                <span className="item-title">Lazer</span>
                <span className="item-subtitle">Variável · limite mensal</span>
              </div>
            </td>
            <td className="align-right">R$ 500</td>
            <td className="align-right text-red">R$ 600</td>
            <td>
              <span className="badge badge-red">Excedido</span>
            </td>
            <td className="acoes">•••</td>
          </tr>
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
