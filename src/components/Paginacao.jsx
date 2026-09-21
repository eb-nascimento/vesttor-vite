import "./Paginacao.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Paginacao({
  totalPaginas,
  paginaAtual,
  temAnterior,
  temProxima,
  de,
  ate,
  totalItens,
  onMudarPagina,
}) {
  if (totalItens === 0) return null;

  return (
    <div className="paginacao-container">
      <span className="paginacao-info">
        {de} a {ate} de {totalItens} registros
      </span>

      <div className="paginacao-controles">
        <button
          className="btn-paginacao"
          onClick={() => onMudarPagina(paginaAtual - 1)}
          disabled={!temAnterior}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="sr-only">Anterior</span>
        </button>

        <span className="paginacao-texto">
          Página {paginaAtual} de {totalPaginas}
        </span>

        <button
          className="btn-paginacao"
          onClick={() => onMudarPagina(paginaAtual + 1)}
          disabled={!temProxima}
          aria-label="Próxima página"
        >
          <ChevronRight size={16} aria-hidden="true" />
          <span className="sr-only">Próxima</span>
        </button>
      </div>
    </div>
  );
}

export default Paginacao;
