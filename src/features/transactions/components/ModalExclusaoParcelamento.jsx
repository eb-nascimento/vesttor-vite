import "./ModalExclusaoParcelamento.css";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Button from "../../../components/ui/Button";

function ModalExclusaoParcelamento({
  transacao,
  onExcluirApenasEsta,
  onExcluirSerie,
  onFechar,
}) {
  if (!transacao) return null;

  const valorFormatado = transacao.valor?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const numParcela = transacao.numeroParcela || 1;
  const totalParcelas = transacao.totalParcelas || transacao.parcelas || 2;
  const parcelasRestantes = totalParcelas - numParcela + 1;

  return (
    <ConfirmModal
      isOpen={true}
      onClose={onFechar}
      title="Excluir compra parcelada"
      subtitle={`Esta movimentação faz parte de um parcelamento em ${totalParcelas}x.`}
      variant="danger"
      hideFooter={true}
    >
      <div className="modal-parcelamento-detalhe">
        <div className="modal-item-linha">
          <span className="modal-item-label">Transação</span>
          <span className="modal-item-valor-destaque">
            {transacao.descricao}
          </span>
        </div>
        <div className="modal-item-linha">
          <span className="modal-item-label">Parcela atual</span>
          <span className="modal-item-badge">
            {numParcela} de {totalParcelas} ({valorFormatado})
          </span>
        </div>
      </div>

      <div className="modal-parcelamento-opcoes">
        <button
          type="button"
          className="btn-modal-opcao btn-opcao-avulsa"
          onClick={onExcluirApenasEsta}
        >
          <Trash2 size={16} aria-hidden="true" />
          <div className="btn-opcao-textos">
            <strong>Excluir apenas esta parcela</strong>
            <span>
              Remove somente a parcela {numParcela}/{totalParcelas}. As outras
              continuam ativas.
            </span>
          </div>
        </button>

        <button
          type="button"
          className="btn-modal-opcao btn-opcao-serie"
          onClick={onExcluirSerie}
        >
          <Trash2 size={16} aria-hidden="true" />
          <div className="btn-opcao-textos">
            <strong>
              Excluir esta e todas as parcelas futuras ({parcelasRestantes}{" "}
              {parcelasRestantes === 1 ? "parcela" : "parcelas"})
            </strong>
            <span>
              Remove a parcela atual e cancela todos os meses subsequentes desta
              série.
            </span>
          </div>
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "4px",
        }}
      >
        <Button variant="secondary" onClick={onFechar}>
          Cancelar
        </Button>
      </div>
    </ConfirmModal>
  );
}

export default ModalExclusaoParcelamento;
