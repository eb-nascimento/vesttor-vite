import { Pencil, Trash2 } from "lucide-react";
import "./ItemTransacao.css";

function ItemTransacao({
  item,
  onEditar,
  onExcluir,
  onSolicitarExclusaoParcelamento,
}) {
  const isReceita = item.tipo === "receita";
  const dataFormatada = item.data?.toDate
    ? item.data.toDate().toLocaleDateString("pt-BR")
    : String(item.data || "");

  // Inicial do badge
  const inicial = item.descricao
    ? item.descricao.charAt(0).toUpperCase()
    : isReceita
      ? "+"
      : "-";

  const formatarMetodo = (metodo) => {
    if (!metodo) return null;
    const mapa = {
      pix: "Pix",
      cartao_credito: "Cartão",
      cartao_debito: "Débito",
      dinheiro: "Dinheiro",
      boleto: "Boleto",
      transferencia: "Transferência",
    };
    return mapa[metodo] || metodo;
  };

  const infoParcela = item.parcelamentoId
    ? `Parcela ${item.numeroParcela}/${item.totalParcelas}`
    : item.parcelado && item.parcelas
      ? `${item.parcelas}x`
      : null;

  const metaPartes = [
    dataFormatada,
    item.categoria || (isReceita ? "Receita" : "Despesa"),
    formatarMetodo(item.metodoPagamento),
    infoParcela,
  ].filter(Boolean);

  const valorFormatado = item.valor?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  function handleExcluir() {
    if (item.parcelamentoId && onSolicitarExclusaoParcelamento) {
      onSolicitarExclusaoParcelamento(item);
    } else {
      onExcluir(item.id);
    }
  }

  return (
    <div className={`transacao-item ${item.tipo}`}>
      <div className="transacao-esquerda">
        <div className={`transacao-badge ${item.tipo}`} aria-hidden="true">
          <span>{inicial}</span>
        </div>
        <div className="transacao-info">
          <p className="transacao-descricao">{item.descricao}</p>
          <span className="transacao-meta">{metaPartes.join(" · ")}</span>
        </div>
      </div>

      <div className="transacao-direita">
        <span
          className={`transacao-valor ${isReceita ? "receita" : "despesa"}`}
        >
          {isReceita ? `＋ ${valorFormatado}` : `− ${valorFormatado}`}
        </span>

        <div className="transacao-acoes">
          <button
            type="button"
            className="btn-acao btn-editar"
            onClick={() => onEditar(item)}
            aria-label={`Editar transação ${item.descricao}`}
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn-acao btn-excluir"
            onClick={handleExcluir}
            aria-label={`Excluir transação ${item.descricao}`}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemTransacao;
