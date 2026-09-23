import "./StatePanel.css";
import { Loader2, AlertCircle, FileSearch } from "lucide-react";

export default function StatePanel({
  state = "empty", // 'empty', 'loading', 'error'
  title,
  message,
  className = "",
  children,
}) {
  const getIcon = () => {
    switch (state) {
      case "loading":
        return <Loader2 className="state-icon spin" />;
      case "error":
        return <AlertCircle className="state-icon error" />;
      case "empty":
      default:
        return <FileSearch className="state-icon" />;
    }
  };

  const defaultTitles = {
    empty: "Nenhum resultado",
    loading: "Carregando...",
    error: "Ocorreu um erro",
  };

  return (
    <div className={`state-panel ${className}`}>
      {getIcon()}
      <h3 className="state-title">{title || defaultTitles[state]}</h3>
      {message && <p className="state-message">{message}</p>}
      {children && <div className="state-actions">{children}</div>}
    </div>
  );
}
