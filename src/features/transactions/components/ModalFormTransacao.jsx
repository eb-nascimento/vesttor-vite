import "../../../features/transactions/components/ModalFormTransacao.css";
import FormTransacao from "./FormTransacao";
import { X } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";

function ModalFormTransacao({
  isOpen,
  onClose,
  transacaoEditando,
  onAdd,
  onAddParcelado,
  onEdit,
  onEditParcelado,
  onConverterParaParcelado,
}) {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledby="modal-form-title"
    >
      <div className="modal-content">
        <button
          className="btn-fechar-modal"
          onClick={onClose}
          aria-label="Fechar formulário"
        >
          <X size={20} />
        </button>

        <FormTransacao
          transacaoEditando={transacaoEditando}
          onAdd={onAdd}
          onAddParcelado={onAddParcelado}
          onEdit={onEdit}
          onEditParcelado={onEditParcelado}
          onConverterParaParcelado={onConverterParaParcelado}
          cancelarEdicao={onClose}
        />
      </div>
    </ModalBase>
  );
}

export default ModalFormTransacao;
