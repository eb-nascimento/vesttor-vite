import "./ResumoPeriodo.css";
import StatCard from "../../../components/ui/StatCard";

function ResumoPeriodo({ saldo, receitas, despesas, quantidade }) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);

  return (
    <section className="resumo-periodo-container">
      <StatCard
        title="Saldo no período"
        balance={formatCurrency(saldo)}
        type="saldo"
        subtitle="Balanço do recorte atual"
      />
      <StatCard
        title="Receitas"
        balance={formatCurrency(receitas)}
        type="receita"
        subtitle="Total de entradas"
      />
      <StatCard
        title="Despesas"
        balance={formatCurrency(despesas)}
        type="despesa"
        subtitle="Total de saídas"
      />
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
