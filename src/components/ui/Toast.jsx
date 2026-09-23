import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

export default function Toast({ message, status = "info", onClose }) {
  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className={`toast-icon toast-icon-${status}`} />;
      case "error":
        return <AlertCircle className={`toast-icon toast-icon-${status}`} />;
      case "warning":
        return <AlertTriangle className={`toast-icon toast-icon-${status}`} />;
      case "info":
      default:
        return <Info className={`toast-icon toast-icon-${status}`} />;
    }
  };

  return (
    <div className={`toast-ui toast-${status}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar notificação">
        <X size={16} />
      </button>
    </div>
  );
}
