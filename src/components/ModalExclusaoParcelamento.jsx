import "./ModalExclusaoParcelamento.css";
import { AlertCircle, Trash2, X } from "lucide-react";
import ModalBase from "./ui/ModalBase";

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
    <ModalBase
      isOpen={true}
      onClose={onFechar}
      ariaLabelledby="modal-parcela-titulo"
    >
      <div
        className="modal-parcelamento-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-btn-fechar"
          onClick={onFechar}
          aria-label="Fechar janela"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="modal-parcelamento-header">
          <div className="modal-icon-aviso">
            <AlertCircle size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 id="modal-parcela-titulo">Excluir compra parcelada</h3>
            <p className="modal-parcelamento-sub">
              Esta movimentação faz parte de um parcelamento em {totalParcelas}
              x.
            </p>
          </div>
        </div>

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
                Remove a parcela atual e cancela todos os meses subsequentes
                desta série.
              </span>
            </div>
          </button>
        </div>

        <div className="modal-parcelamento-rodape">
          <button
            type="button"
            className="btn-modal-cancelar"
            onClick={onFechar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalExclusaoParcelamento;
