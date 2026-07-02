import "./ControlesTransacoes.css";

function ControlesTransacoes({
  filtro,
  onFiltroChange,
  ordenacao,
  onOrdenacaoChange,
}) {
  return (
    <section className="painel-transacoes">
      <select
        value={filtro}
        onChange={(e) => onFiltroChange(e.target.value)}
        className="filtros"
      >
        <option value="todas">Todas</option>
        <option value="receita">Receitas</option>
        <option value="despesa">Despesas</option>
      </select>

      <select
        value={ordenacao}
        onChange={(e) => onOrdenacaoChange(e.target.value)}
        className="ordenacao"
      >
        <option value="data-crescente">Data Crescente</option>
        <option value="data-decrescente">Data Decrescente</option>
        <option value="valor-crescente">Valor Crescente</option>
        <option value="valor-decrescente">Valor Decrescente</option>
      </select>
    </section>
  );
}

export default ControlesTransacoes;
