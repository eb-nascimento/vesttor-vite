import "./ContainerResumo.css";
import CardResumo from "../../../features/dashboard/components/CardResumo";

function ContainerResumo({
  saldo,
  receitas,
  despesas,
  titulo,
  subtituloSaldo,
}) {
  const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    new Date(),
  );
  const mesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  return (
    <section className="secao-saldos">
      <h3 className="saldos-titulo">
        {titulo || `Saldos do mês atual (${mesCapitalizado})`}
      </h3>
      <div className="resumo-container">
        <CardResumo
          title="Receitas"
          balance={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(receitas)}
          type="receita"
          subtitle={`Entradas em ${mesCapitalizado}`}
        />

        <CardResumo
          title="Despesas"
          balance={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(despesas)}
          type="despesa"
          subtitle={`Saídas em ${mesCapitalizado}`}
        />

        <CardResumo
          title="Saldo do mês"
          balance={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(saldo)}
          type="saldo"
          subtitle={subtituloSaldo || "Balanço do mês atual"}
        />
      </div>
    </section>
  );
}

export default ContainerResumo;
