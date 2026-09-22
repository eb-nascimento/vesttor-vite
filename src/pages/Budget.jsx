import PaginadorMes from "../components/PaginadorMes";
import { useState } from "react";
import "./Budget.css";

import { useTransacoes } from "../hooks/useTransacoes";
import { useFiltrosTransacoes } from "../hooks/useFiltrosTransacoes";
import { usePlanejamentos } from "../hooks/usePlanejamentos";

import BtnAdd from "../components/BtnAdd";
import EquacaoMes from "../components/EquacaoMes";
import PageHeader from "../components/PageHeader";
import TabelaPlanejamentos from "../components/TabelaPlanejamentos";
import PainelLateralPlanejamento from "../components/PainelLateralPlanejamento";

function Budget({ usuario }) {
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);

  const { transacoes } = useTransacoes(usuario?.uid);
  const { planejamentos } = usePlanejamentos(usuario?.uid);

  const { filtros, mesesDisponiveis, handleMudarMes } =
    useFiltrosTransacoes(transacoes);

  // 1. Pega só as transações do mês que você está visualizando no filtro
  const transacoesDoMes = transacoes.filter((t) => {
    if (!t.data) return false;
    const dataObj = t.data.toDate()
      ? t.data.toDate()
      : new Date(`${t.data}T12:00:00`);
    return (
      dataObj.getMonth() + 1 === parseInt(filtros.mesAno.split("-")[1]) &&
      dataObj.getFullYear() === parseInt(filtros.mesAno.split("-")[0])
    );
  });
  // 2. Transforma cada "planejamento" adicionando a coluna "valorRealizado"
  const planejamentosCruzados = planejamentos.map((plan) => {
    // Pega todas as transações do mês que tenham a MESMA CATEGORIA (ex: "Alimentação")
    const transacoesDaCategoria = transacoesDoMes.filter(
      (t) => t.categoria === plan.categoria,
    );
    // Soma o valor de todas essas transações
    const valorRealizado = transacoesDaCategoria.reduce(
      (soma, t) => soma + t.valor,
      0,
    );
    // Retorna o planejamento original + o valor que acabamos de calcular
    return { ...plan, valorRealizado: valorRealizado };
  });

  return (
    <section className="budget-page">
      <PageHeader
        title="Planejamento Financeiro"
        subtitle="Visão operacional do mês e dos próximos compromissos."
      >
        <PaginadorMes
          mesAtual={
            mesesDisponiveis.find((m) => m.valor === filtros.mesAno)?.label
          }
          onMudarMes={handleMudarMes}
        />

        <BtnAdd
          texto="Novo Orçamento"
          onClick={() => {
            setTransacaoEditando(null);
            setModalFormAberto(true);
          }}
        />
      </PageHeader>
      <EquacaoMes
        entradasPlanejadas={8500}
        entradasRealizadas={8200}
        fixosPlanejados={4200}
        fixosRealizados={4010}
        variaveisPlanejados={2500}
        variaveisRealizados={1980}
        saldoProjetado={1800}
        porcentagemSaldo={21}
      />
      <div className="area-operacional">
        <TabelaPlanejamentos planejamentos={planejamentosCruzados} />
        <PainelLateralPlanejamento />
      </div>
    </section>
  );
}

export default Budget;
