import "./StatCard.css";

function StatCard({
  title,
  balance = "R$ 0,00",
  type = "default",
  subtitle,
}) {
  return (
    <section className={`card ${type}`}>
      <h2>{title}</h2>
      <p className="card-valor">{balance ?? "R$ 0,00"}</p>
      {subtitle && <span className="card-sub">{subtitle}</span>}
    </section>
  );
}

export default StatCard;
