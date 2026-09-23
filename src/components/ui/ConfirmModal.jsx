import "./ConfirmModal.css";
import { X, AlertCircle } from "lucide-react";
import ModalBase from "./ModalBase";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon = AlertCircle,
  variant = "danger", // 'danger', 'warning', 'info'
  children,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  hideFooter = false,
}) {
  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledby="modal-confirm-titulo"
    >
      <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="confirm-modal-btn-fechar"
          onClick={onClose}
          aria-label="Fechar janela"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="confirm-modal-header">
          <div className={`confirm-modal-icon variant-${variant}`}>
            <Icon size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 id="modal-confirm-titulo">{title}</h3>
            {subtitle && <p className="confirm-modal-sub">{subtitle}</p>}
          </div>
        </div>

        {children && <div className="confirm-modal-body">{children}</div>}

        {!hideFooter && (
          <div className="confirm-modal-footer">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant={variant} onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </ModalBase>
  );
}
