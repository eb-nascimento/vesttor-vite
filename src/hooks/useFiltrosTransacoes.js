import { METODOS_PAGAMENTO } from "../data/metodosPagamento";
import { useState, useMemo } from "react";
import { deslocarMes } from "../utils/periodo";
import {
  extrairMesesDisponiveis,
  aplicarFiltrosAvancados,
  paginarTransacoes,
  calcularTotais,
} from "../utils/transacao";

export const ITENS_POR_PAGINA = 10;

export function useFiltrosTransacoes(transacoes, onMudarPeriodo) {
  const [filtros, definirFiltros] = useState(() => {
    const hoje = new Date();
    const mesAtualStr = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1,
    ).padStart(2, "0")}`;
    return {
      tipo: "todas",
      busca: "",
      mesAno: mesAtualStr,
      categoria: "todas",
      metodoPagamento: "todas",
      ordenacao: "data-decrescente",
    };
  });
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  function setFiltros(valor) {
    const novos = typeof valor === "function" ? valor(filtros) : valor;
    definirFiltros(novos);
    setPaginaAtual(1);
    if (novos.mesAno !== filtros.mesAno) onMudarPeriodo?.(novos.mesAno);
  }

  const mesesDisponiveis = useMemo(
    () => extrairMesesDisponiveis([
      ...transacoes,
      ...[-1, 0, 1].map((deslocamento) => ({ data: `${deslocarMes(filtros.mesAno, deslocamento)}-15` })),
    ]),
    [transacoes, filtros.mesAno],
  );

  const categoriasDisponiveis = useMemo(() => {
    const cats = new Set(transacoes.map((t) => t.categoria).filter(Boolean));
    return Array.from(cats).sort();
  }, [transacoes]);

  const metodosDisponiveis = METODOS_PAGAMENTO;

  const transacoesFiltradas = useMemo(() => {
    return aplicarFiltrosAvancados(transacoes, filtros);
  }, [transacoes, filtros]);

  const totais = useMemo(
    () => ({ ...calcularTotais(transacoesFiltradas),
      temReceitas: transacoesFiltradas.some((item) => item.tipo === "receita"),
      temDespesas: transacoesFiltradas.some((item) => item.tipo === "despesa"),
    }),
    [transacoesFiltradas],
  );

  const totalItens = transacoesFiltradas.length;
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA) || 1;

  const paginaSegura = Math.max(1, Math.min(paginaAtual, totalPaginas));

  const transacoesPaginadas = useMemo(() => {
    return paginarTransacoes(
      transacoesFiltradas,
      paginaSegura,
      ITENS_POR_PAGINA,
    );
  }, [transacoesFiltradas, paginaSegura]);

  const limparFiltros = () => {
    const hoje = new Date();
    const mesAtualStr = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1,
    ).padStart(2, "0")}`;

    setFiltros({
      tipo: "todas",
      busca: "",
      mesAno: mesAtualStr,
      categoria: "todas",
      metodoPagamento: "todas",
      ordenacao: "data-decrescente",
    });
    setPaginaAtual(1);
  };

  const handleMudarMes = (direcao) => {
    setFiltros({ ...filtros, mesAno: deslocarMes(filtros.mesAno, direcao === "anterior" ? -1 : 1) });
  };

  return {
    filtros,
    setFiltros,
    filtrosAbertos,
    setFiltrosAbertos,
    paginaAtual: paginaSegura,
    setPaginaAtual,
    mesesDisponiveis,
    categoriasDisponiveis,
    metodosDisponiveis,
    transacoesPaginadas,
    totais,
    totalItens,
    totalPaginas,
    limparFiltros,
    handleMudarMes,
  };
}

