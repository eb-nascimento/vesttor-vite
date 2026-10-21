import "./ModalExclusaoParcelamento.css";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Button from "../../../components/ui/Button";
import { useOperacaoAssincrona } from "../../../hooks/useOperacaoAssincrona";

function ModalExclusaoParcelamento({
  transacao,
  onExcluirApenasEsta,
  onExcluirSerie,
  onFechar,
}) {
  const { processando, erro, executar, emCurso } = useOperacaoAssincrona(
    "Não foi possível concluir a exclusão. Confira as parcelas e tente novamente.",
  );
  const fechar = () => { if (!emCurso.current) onFechar(); };
  const excluir = async (operacao) => {
    if (await executar(operacao)) onFechar();
  };
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
      onClose={fechar}
      processando={processando}
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
          onClick={() => excluir(onExcluirApenasEsta)}
          disabled={processando}
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
          onClick={() => excluir(onExcluirSerie)}
          disabled={processando}
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

      {processando && <p role="status">Excluindo...</p>}
      {erro && <p className="erro-msg" role="alert">{erro}</p>}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "4px",
        }}
      >
        <Button variant="secondary" onClick={fechar} disabled={processando}>
          Cancelar
        </Button>
      </div>
    </ConfirmModal>
  );
}

export default ModalExclusaoParcelamento;
