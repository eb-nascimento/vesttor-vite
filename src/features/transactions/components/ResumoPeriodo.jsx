import "./ResumoPeriodo.css";
import StatCard from "../../../components/ui/StatCard";

function ResumoPeriodo({ saldo, receitas, despesas, quantidade, temReceitas = receitas > 0, temDespesas = despesas > 0 }) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);

  return (
    <section className="resumo-periodo-container">
      {temReceitas && temDespesas && <StatCard
        title="Resultado filtrado"
        balance={formatCurrency(saldo)}
        type="saldo"
        subtitle="Balanço do recorte atual"
      />}
      {temReceitas && <StatCard
        title="Receitas filtradas"
        balance={formatCurrency(receitas)}
        type="receita"
        subtitle="Total de entradas"
      />}
      {temDespesas && <StatCard
        title="Despesas filtradas"
        balance={formatCurrency(despesas)}
        type="despesa"
        subtitle="Total de saídas"
      />}
      <StatCard
        title="Movimentações"
        balance={`${quantidade} registro${quantidade !== 1 ? "s" : ""}`}
        type="default"
        subtitle="Quantidade filtrada"
      />
    </section>
  );
}

export default ResumoPeriodo;
