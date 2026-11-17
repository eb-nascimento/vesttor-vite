import { METODOS_PAGAMENTO } from "../../../data/metodosPagamento";
import { Pencil, Trash2 } from "lucide-react";
import "./ItemTransacao.css";
import { useOperacaoAssincrona } from "../../../hooks/useOperacaoAssincrona";
import { classificacaoTransacao } from "../../../utils/planejamento";
import { useState } from "react";
import ConfirmModal from "../../../components/ui/ConfirmModal";

function ItemTransacao({
  item,
  onEditar,
  onExcluir,
  onSolicitarExclusaoParcelamento,
}) {
  const [confirmando, setConfirmando] = useState(false);
  const { processando, erro, executar } = useOperacaoAssincrona(
    "Não foi possível excluir a transação. Tente novamente.",
  );
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
    return mapa[metodo] || METODOS_PAGAMENTO.find(item => item.valor === metodo)?.label || metodo;
  };

  const infoParcela = item.parcelamentoId
    ? `Parcela ${item.numeroParcela}/${item.totalParcelas}`
    : item.parcelado && item.parcelas
      ? `${item.parcelas}x`
      : null;

  const metaPartes = [
    dataFormatada,
    `${item.categoria || (isReceita ? "Receita" : "Despesa")}${!isReceita ? ` (${classificacaoTransacao(item).toLocaleLowerCase("pt-BR")})` : ""}`,
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
      setConfirmando(true);
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
        <span className="transacao-natureza-mobile">{isReceita ? "Receita" : "Despesa"}</span>
        <span
          className={`transacao-valor ${isReceita ? "receita" : "despesa"}`}
        >
          {isReceita ? `＋ ${valorFormatado}` : `− ${valorFormatado}`}
        </span>

        <div className="transacao-acoes">
          <button
            type="button"
            className="btn-acao btn-editar"
            disabled={processando}
            onClick={() => onEditar(item)}
            aria-label={`Editar transação ${item.descricao}`}
          >
            <Pencil size={15} aria-hidden="true" /><span className="acao-mobile-label">Editar</span>
          </button>
          <button
            type="button"
            className="btn-acao btn-excluir"
            disabled={processando}
            onClick={handleExcluir}
            aria-label={`Excluir transação ${item.descricao}`}
          >
            <Trash2 size={15} aria-hidden="true" /><span className="acao-mobile-label">Excluir</span>
          </button>
        </div>
      </div>
      {processando && <span role="status">Excluindo...</span>}
      {erro && <p className="erro-msg" role="alert">{erro}</p>}
      <ConfirmModal
        isOpen={confirmando}
        onClose={() => setConfirmando(false)}
        title="Excluir transação?"
        subtitle={`A transação ${item.descricao} será excluída.`}
        confirmText="Excluir"
        processando={processando}
        onConfirm={async () => {
          if (await executar(() => onExcluir(item.id))) setConfirmando(false);
        }}
      >
        {erro && <p className="erro-msg" role="alert">{erro}</p>}
      </ConfirmModal>
    </div>
  );
}

export default ItemTransacao;

