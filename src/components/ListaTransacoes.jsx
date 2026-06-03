function ListaTransacoes({ transacoes }) {
  return (
    <section className="lista-transacoes">
      <h2>Transações</h2>
      {transacoes.map((item) => (
        <div key={item.id} className={`transacao ${item.tipo}`}>
          <p>{item.descricao}</p>
          <span style={{ color: item.tipo === "receita" ? "green" : "red" }}>
            {item.valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <hr />
        </div>
      ))}
    </section>
  );
}

export default ListaTransacoes;
