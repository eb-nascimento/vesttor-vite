import "./ContainerResumo.css";
import CardResumo from "./CardResumo";

function ContainerResumo({ saldo, receitas, despesas }) {
  return (
    <section className="resumo-container">
      <CardResumo
        title="Receitas"
        balance={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(receitas)}
        type="receita"
      />

      <CardResumo
        title="Despesas"
        balance={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(despesas)}
        type="despesa"
      />

      <CardResumo
        title="Saldo Total"
        balance={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(saldo)}
        type="saldo"
      />
    </section>
  );
}

export default ContainerResumo;
