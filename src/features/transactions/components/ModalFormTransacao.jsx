import { useRef, useState } from "react";
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
  const [processando, setProcessando] = useState(false);
  const envioEmCurso = useRef(false);

  function atualizarProcessamento(valor) {
    envioEmCurso.current = valor;
    setProcessando(valor);
  }

  function fechar() {
    if (!envioEmCurso.current) onClose();
  }

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={fechar}
      ariaLabelledby="modal-form-title"
    >
      <div className="modal-content">
        <button
          className="btn-fechar-modal"
          onClick={fechar}
          disabled={processando}
          aria-label="Fechar formulário"
        >
          <X size={20} />
        </button>

        <FormTransacao
          key={transacaoEditando?.id ?? "nova-transacao"}
          onProcessandoChange={atualizarProcessamento}
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
