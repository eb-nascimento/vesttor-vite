import "./ResumoPeriodo.css";
import CardResumo from "./CardResumo";

function ResumoPeriodo({ saldo, receitas, despesas, quantidade }) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);

  return (
    <section className="resumo-periodo-container">
      <CardResumo
        title="Saldo no período"
        balance={formatCurrency(saldo)}
        type="saldo"
        subtitle="Balanço do recorte atual"
      />
      <CardResumo
        title="Receitas"
        balance={formatCurrency(receitas)}
        type="receita"
        subtitle="Total de entradas"
      />
      <CardResumo
        title="Despesas"
        balance={formatCurrency(despesas)}
        type="despesa"
        subtitle="Total de saídas"
      />
      <CardResumo
        title="Movimentações"
        balance={`${quantidade} registro${quantidade !== 1 ? "s" : ""}`}
        type="default"
        subtitle="Quantidade filtrada"
      />
    </section>
  );
}

export default ResumoPeriodo;
