import { useState } from "react";
import { Search } from "lucide-react";
import { formatarMoeda } from "../../../utils/formatarMoeda";
import { centavosDoItem, paraCentavos } from "../../../utils/dinheiro";
import { useOperacaoAssincrona } from "../../../hooks/useOperacaoAssincrona";
import "./TabelaPlanejamentos.css";

const grupos = [["Entrada", "Entradas"], ["Fixo", "Gastos fixos"], ["Vari�vel", "Vari�veis"]];

export default function TabelaPlanejamentos({ itens = [], proximosVencimentos = [], onApprove, onEdit, onAdd }) {
  const [aba, setAba] = useState("visao");
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [textoBusca, setTextoBusca] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [gruposFechados, setGruposFechados] = useState([]);
  const { processando, erro, executar } = useOperacaoAssincrona("N�o foi poss�vel adicionar ao planejamento. Tente novamente.");

  const itensFiltrados = itens.filter((item) =>
    (filtroAtivo === "Todos" || item.tipo === ({ Entradas: "Entrada", Fixos: "Fixo", Vari�veis: "Vari�vel" })[filtroAtivo]) &&
    item.categoria.toLocaleLowerCase("pt-BR").includes(textoBusca.toLocaleLowerCase("pt-BR")),
  );

  function navegarAbas(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const proxima = event.key === "Home" ? "visao" : event.key === "End" ? "proximos" : aba === "visao" ? "proximos" : "visao";
    setAba(proxima);
    event.currentTarget.parentElement.querySelector(`#planejamento-tab-${proxima}`).focus();
  }

  function alternarGrupo(tipo) {
    setGruposFechados((fechados) => fechados.includes(tipo) ? fechados.filter((atual) => atual !== tipo) : [...fechados, tipo]);
  }

  function statusDoItem(item) {
    if (item.isUnplanned) return "N�o planejado";
    if (item.tipo === "Entrada") {
      return item.planejado > 0
        ? `${Math.round((item.valorRealizado / item.planejado) * 100)}% da meta`
        : "Sem meta definida";
    }
    if (item.planejado > 0) return `${Math.round((item.valorRealizado / item.planejado) * 100)}% utilizado`;
    return item.valorRealizado > 0 ? "Acima do limite" : "0% utilizado";
  }

  return (
    <section className="tabela-planejamentos-container">
      <div className="planejamento-abas" role="tablist" aria-label="Vis�es do planejamento">
        {[["visao", "Vis�o geral"], ["proximos", "Pr�ximos vencimentos"]].map(([valor, label]) => (
          <button key={valor} id={`planejamento-tab-${valor}`} role="tab"
            tabIndex={aba === valor ? 0 : -1} aria-selected={aba === valor}
            aria-controls={`planejamento-painel-${valor}`} onKeyDown={navegarAbas} onClick={() => setAba(valor)}>{label}</button>
        ))}
      </div>
      <div id="planejamento-painel-visao" role="tabpanel" aria-labelledby="planejamento-tab-visao" hidden={aba !== "visao"}>
        {processando && <p role="status">Adicionando ao planejamento...</p>}
        {erro && <p className="erro-msg" role="alert">{erro}</p>}
        <div className={`tabela-planejamentos-header ${filtrosAbertos ? "filtros-abertos" : "filtros-fechados"}`}>
          <h2>Planejamentos</h2>
          <button className="planejamento-filtros-toggle" aria-expanded={filtrosAbertos} aria-controls="planejamento-filtros" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>Filtrar planejamentos</button>
          <div id="planejamento-filtros" className="planejamento-filtros">
            <div className="tabela-planejamentos-filtros" role="group" aria-label="Filtrar planejamentos por tipo">
              {["Todos", "Entradas", "Fixos", "Vari�veis"].map((tipo) => (
                <button key={tipo} className={`filtro-btn ${filtroAtivo === tipo ? "ativo" : ""}`} aria-pressed={filtroAtivo === tipo} onClick={() => setFiltroAtivo(tipo)}>{tipo}</button>
              ))}
            </div>
            <label className="busca-container-ativo"><Search size={14} aria-hidden="true" />
              <input aria-label="Buscar planejamento por categoria" placeholder="Buscar..." value={textoBusca} onChange={(event) => setTextoBusca(event.target.value)} className="busca-input" />
            </label>
          </div>
        </div>
        <table className="tabela-planejamentos">
          <thead><tr><th scope="col">Item</th><th scope="col" className="align-right">Planejado</th><th scope="col" className="align-right">Realizado</th><th scope="col">Status</th></tr></thead>
          {grupos.map(([tipo, titulo]) => {
            const linhas = itensFiltrados.filter((item) => item.tipo === tipo);
            const realizado = linhas.reduce((total, item) => total + paraCentavos(item.valorRealizado || 0), 0) / 100;
            const limite = linhas.reduce((total, item) => total + centavosDoItem(item, "planejado"), 0) / 100;
            const excedido = tipo !== "Entrada" && realizado > limite;
            const fechado = gruposFechados.includes(tipo);
            return <tbody id={`planejamento-grupo-${tipo}`} key={tipo} className={`planejamento-grupo ${tipo === "Entrada" ? "entrada" : tipo === "Fixo" ? "fixo" : "variavel"} ${fechado ? "grupo-fechado" : ""}`}>
              <tr className="planejamento-grupo-cabecalho"><th colSpan="4" scope="rowgroup">
                <button aria-expanded={!fechado} aria-controls={`planejamento-grupo-${tipo}`} onClick={() => alternarGrupo(tipo)}>
                  <span>{fechado ? "?" : "?"} {titulo}</span><strong>{formatarMoeda(realizado)}</strong>
                </button>
              </th></tr>
              {linhas.map((item) => <tr className={`planejamento-linha ${item.isUnplanned ? "linha-alerta" : ""}`} key={item.id}>
                <td><button className="planejamento-item-acao" disabled={processando} onClick={() => item.isUnplanned ? executar(() => onApprove?.(item)) : onEdit?.(item)}
                  aria-label={`${item.isUnplanned ? "Adicionar ao" : "Editar"} planejamento de ${item.categoria}${tipo !== "Entrada" ? ` (${tipo.toLocaleLowerCase("pt-BR")})` : ""}`}>
                  <span className="item-title">{item.categoria}{tipo !== "Entrada" ? ` (${tipo.toLocaleLowerCase("pt-BR")})` : ""}</span><small>{item.isUnplanned ? "N�o planejado � Adicionar" : "Editar planejamento"}</small>
                </button></td>
                <td className="align-right">{formatarMoeda(item.planejado)}</td>
                <td className={`align-right ${tipo !== "Entrada" && item.valorRealizado > item.planejado ? "text-red" : tipo === "Entrada" ? "text-green" : ""}`}>{formatarMoeda(item.valorRealizado)}</td>
                <td className="planejamento-item-status"><span className={`badge ${item.isUnplanned || (tipo !== "Entrada" && item.valorRealizado > item.planejado) ? "red" : "green"}`}>{statusDoItem(item)}</span></td>
              </tr>)}
              {!linhas.length && <tr className="planejamento-grupo-vazio"><td colSpan="4">Nenhum item neste grupo.</td></tr>}
              {excedido && <tr className="planejamento-grupo-alerta"><td colSpan="4">Limite excedido em {formatarMoeda(realizado - limite)}</td></tr>}
            </tbody>;
          })}
          <tfoot><tr><td colSpan="4"><button className="planejamento-adicionar" onClick={onAdd}>+ Adicionar planejamento</button></td></tr></tfoot>
        </table>
      </div>
      <section id="planejamento-painel-proximos" role="tabpanel" aria-labelledby="planejamento-tab-proximos" hidden={aba !== "proximos"}>
        {proximosVencimentos.length ? proximosVencimentos.map((item) => <article className="planejamento-vencimento" key={item.id}>
          <div><strong>{item.descricao}</strong><small>{(item.data?.toDate ? item.data.toDate() : new Date(`${item.data}T12:00:00`)).toLocaleDateString("pt-BR")}</small></div>
          <strong>{formatarMoeda(item.valor)}</strong>
        </article>) : <p className="planejamento-vazio">Nenhuma despesa futura neste m�s.</p>}
      </section>
    </section>
  );
}
