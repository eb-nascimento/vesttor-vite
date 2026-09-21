import { useState, useMemo } from "react";
import {
  extrairMesesDisponiveis,
  aplicarFiltrosAvancados,
  paginarTransacoes,
  calcularTotais,
} from "../utils/transacao";

export const ITENS_POR_PAGINA = 10;

export function useFiltrosTransacoes(transacoes) {
  const [filtros, setFiltros] = useState(() => {
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

  const mesesDisponiveis = useMemo(
    () => extrairMesesDisponiveis(transacoes),
    [transacoes],
  );

  const categoriasDisponiveis = useMemo(() => {
    const cats = new Set(transacoes.map((t) => t.categoria).filter(Boolean));
    return Array.from(cats).sort();
  }, [transacoes]);

  const metodosDisponiveis = [
    { valor: "pix", label: "Pix" },
    { valor: "cartao_credito", label: "Cartão de Crédito" },
    { valor: "cartao_debito", label: "Cartão de Débito" },
    { valor: "dinheiro", label: "Dinheiro" },
    { valor: "boleto", label: "Boleto" },
    { valor: "transferencia", label: "Transferência" },
  ];

  const transacoesFiltradas = useMemo(() => {
    return aplicarFiltrosAvancados(transacoes, filtros);
  }, [transacoes, filtros]);

  const totais = useMemo(
    () => calcularTotais(transacoesFiltradas),
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
    const indexAtual = mesesDisponiveis.findIndex(
      (m) => m.valor === filtros.mesAno,
    );
    if (indexAtual === -1) return;

    let novoIndex = indexAtual;
    if (direcao === "anterior") {
      novoIndex = indexAtual + 1; // Passado
    } else if (direcao === "proximo") {
      novoIndex = indexAtual - 1; // Futuro
    }

    if (novoIndex >= 0 && novoIndex < mesesDisponiveis.length) {
      setFiltros({
        ...filtros,
        mesAno: mesesDisponiveis[novoIndex].valor,
      });
      setPaginaAtual(1);
    }
  };

  return {
    filtros,
    setFiltros,
    filtrosAbertos,
    setFiltrosAbertos,
    paginaAtual,
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
