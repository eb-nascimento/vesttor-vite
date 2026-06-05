function ListaTransacoes({ transacoes, onExcluir, onEditar }) {
  return (
    <section className="lista-transacoes">
      <h2>Transações</h2>
      {transacoes.map((item) => (
        <div key={item.id} className={`transacao ${item.tipo}`}>
          <div>
            <p>{item.descricao}</p>
            <span style={{ color: item.tipo === "receita" ? "green" : "red" }}>
              {item.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <span className="buttons">
            <button onClick={() => onEditar(item)}>
              <img src="/src/assets/edit.svg" alt="Editar" width={20} />
            </button>
            <button onClick={() => onExcluir(item.id)}>
              <img src="/src/assets/trash.svg" alt="Excluir" width={20} />
            </button>
          </span>
        </div>
      ))}
      <hr />
    </section>
  );
}

export default ListaTransacoes;
