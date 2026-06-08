function ItemTransacao({ item, onEditar, onExcluir }) {
  return (
    <div className={`transacao ${item.tipo}`}>
      <hr />
      <div>
        <p className="data">{item.data.split("-").reverse().join("/")}</p>
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
  );
}

export default ItemTransacao;
