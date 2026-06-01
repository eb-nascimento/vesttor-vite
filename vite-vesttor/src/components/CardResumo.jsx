import "./CardResumo.css";

function CardResumo({ title, balance = "R$ 0,00", type = "default" }) {
  return (
    <section className={`card ${type}`}>
      <h2>{title}</h2>
      <p>Valor: {balance ?? "R$ 0,00"}</p>
    </section>
  );
}

export default CardResumo;
