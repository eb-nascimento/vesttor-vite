import "./ModalFormTransacao.css";
import Form from "./Form";
import { X } from "lucide-react";
import ModalBase from "./ModalBase";
import ModalBase from "./ui/ModalBase";

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

        <Form
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
