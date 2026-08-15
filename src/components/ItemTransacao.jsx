import { Pencil, Trash2 } from "lucide-react";

function ItemTransacao({ item, onEditar, onExcluir }) {
  return (
    <div className={`transacao ${item.tipo}`}>
      <hr />
      <div>
        <p className="data">{item.data.toDate().toLocaleDateString("pt-BR")}</p>
        <p>{item.descricao}</p>
        <span style={{ color: item.tipo === "receita" ? "green" : "red" }}>
          {item.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
      <span className="buttons">
        <button onClick={() => onEditar(item)} aria-label="Editar transação">
          <Pencil size={20} aria-hidden="true" />
        </button>
        <button onClick={() => onExcluir(item.id)} aria-label="Excluir transação">
          <Trash2 size={20} aria-hidden="true" />
        </button>
      </span>
    </div>
  );
}

export default ItemTransacao;
