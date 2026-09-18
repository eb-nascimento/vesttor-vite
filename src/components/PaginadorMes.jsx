import "./PaginadorMes.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginadorMes({ mesAtual, onMudarMes }) {
  return (
    <div className="paginador-mes">
      <button
        className="btn-paginador"
        onClick={() => onMudarMes("anterior")}
        aria-label="Mês anterior"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <span className="mes-texto">{mesAtual || "Todos os meses"}</span>
      <button
        className="btn-paginador"
        onClick={() => onMudarMes("proximo")}
        aria-label="Mês seguinte"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default PaginadorMes;
