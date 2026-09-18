import "./DatePicker.css";
import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatarDataDisplay(dataStr) {
  if (!dataStr) return "Selecione uma data";
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  if (!ano || !mes || !dia) return dataStr;
  const mesNome = MESES[mes - 1]?.slice(0, 3).toLowerCase();
  return `${String(dia).padStart(2, "0")} de ${mesNome}. de ${ano}`;
}

function parseValorData(dataStr) {
  if (dataStr && dataStr.includes("-")) {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    return {
      ano: ano || new Date().getFullYear(),
      mes: mes ? mes - 1 : new Date().getMonth(),
      dia: dia || new Date().getDate(),
    };
  }
  const hoje = new Date();
  return {
    ano: hoje.getFullYear(),
    mes: hoje.getMonth(),
    dia: hoje.getDate(),
  };
}

function DatePicker({ id, value, onChange }) {
  const [aberto, setAberto] = useState(false);
  // Guarda navegação manual via setas { ano, mes }. Se null, deriva diretamente de value
  const [navegacao, setNavegacao] = useState(null);
  const containerRef = useRef(null);

  const valorAtual = parseValorData(value);
  const anoVisualizacao = navegacao ? navegacao.ano : valorAtual.ano;
  const mesVisualizacao = navegacao ? navegacao.mes : valorAtual.mes;

  function fechar() {
    setAberto(false);
    setNavegacao(null);
  }

  // Fecha ao clicar fora do componente
  useEffect(() => {
    function handleClickFora(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        fechar();
      }
    }
    if (aberto) {
      document.addEventListener("mousedown", handleClickFora);
      return () => document.removeEventListener("mousedown", handleClickFora);
    }
  }, [aberto]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        fechar();
      }
    }
    if (aberto) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [aberto]);

  function navegarMes(delta) {
    let novoMes = mesVisualizacao + delta;
    let novoAno = anoVisualizacao;

    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }

    setNavegacao({ ano: novoAno, mes: novoMes });
  }

  function selecionarDia(dia) {
    const mesFormatado = String(mesVisualizacao + 1).padStart(2, "0");
    const diaFormatado = String(dia).padStart(2, "0");
    const dataStr = `${anoVisualizacao}-${mesFormatado}-${diaFormatado}`;
    onChange(dataStr);
    fechar();
  }

  function selecionarHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mesFormatado = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaFormatado = String(hoje.getDate()).padStart(2, "0");
    const dataStr = `${ano}-${mesFormatado}-${diaFormatado}`;
    onChange(dataStr);
    fechar();
  }

  // Cálculos de preenchimento do grid do mês
  const primeiroDiaSemana = new Date(
    anoVisualizacao,
    mesVisualizacao,
    1,
  ).getDay();
  const totalDiasNoMes = new Date(
    anoVisualizacao,
    mesVisualizacao + 1,
    0,
  ).getDate();
  const totalDiasMesAnterior = new Date(
    anoVisualizacao,
    mesVisualizacao,
    0,
  ).getDate();

  const hoje = new Date();
  const ehHoje = (dia) =>
    dia === hoje.getDate() &&
    mesVisualizacao === hoje.getMonth() &&
    anoVisualizacao === hoje.getFullYear();

  const ehSelecionado = (dia) => {
    if (!value) return false;
    const [ano, mes, d] = value.split("-").map(Number);
    return d === dia && mes - 1 === mesVisualizacao && ano === anoVisualizacao;
  };
  const handleBlur = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget)
    ) {
      fechar();
    }
  };

  return (
    <div
      className="datepicker-container"
      ref={containerRef}
      onBlur={handleBlur}
    >
      <button
        id={id}
        type="button"
        className={`datepicker-gatilho ${aberto ? "ativo" : ""}`}
        onClick={() => setAberto((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={aberto}
      >
        <span className="datepicker-texto-data">
          {formatarDataDisplay(value)}
        </span>
        <CalendarIcon
          size={14}
          className="datepicker-icone-gatilho"
          aria-hidden="true"
        />
      </button>

      {aberto && (
        <div
          className="datepicker-popover"
          role="dialog"
          aria-label="Seletor de data"
        >
          <div className="datepicker-cabecalho">
            <button
              type="button"
              className="datepicker-btn-nav"
              onClick={() => navegarMes(-1)}
              aria-label="Mês anterior"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span className="datepicker-titulo-mes">
              {MESES[mesVisualizacao]} <strong>{anoVisualizacao}</strong>
            </span>
            <button
              type="button"
              className="datepicker-btn-nav"
              onClick={() => navegarMes(1)}
              aria-label="Próximo mês"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="datepicker-dias-semana">
            {DIAS_SEMANA.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>

          <div className="datepicker-grid-dias">
            {/* Dias do mês anterior para completar a primeira semana */}
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => {
              const dia = totalDiasMesAnterior - primeiroDiaSemana + 1 + i;
              return (
                <span key={`ant-${i}`} className="datepicker-dia outro-mes">
                  {dia}
                </span>
              );
            })}

            {/* Dias do mês corrente */}
            {Array.from({ length: totalDiasNoMes }).map((_, i) => {
              const dia = i + 1;
              const selecionado = ehSelecionado(dia);
              const dataHoje = ehHoje(dia);

              return (
                <button
                  key={dia}
                  type="button"
                  className={`datepicker-dia dia-atual ${selecionado ? "selecionado" : ""} ${dataHoje ? "hoje" : ""}`}
                  onClick={() => selecionarDia(dia)}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          <div className="datepicker-rodape">
            <button
              type="button"
              className="datepicker-btn-hoje"
              onClick={selecionarHoje}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
