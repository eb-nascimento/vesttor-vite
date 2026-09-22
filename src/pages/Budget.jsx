import PaginadorMes from "../components/PaginadorMes";
import { useState } from "react";
import "./Budget.css";

import { useTransacoes } from "../hooks/useTransacoes";
import { useFiltrosTransacoes } from "../hooks/useFiltrosTransacoes";
import BtnAdd from "../components/BtnAdd";
import EquacaoMes from "../components/EquacaoMes";
import PageHeader from "../components/PageHeader";
import TabelaPlanejamentos from "../components/TabelaPlanejamentos";
import PainelLateralPlanejamento from "../components/PainelLateralPlanejamento";

function Budget({ usuario }) {
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);

  const { transacoes } = useTransacoes(usuario?.uid);

  const { filtros, mesesDisponiveis, handleMudarMes } =
    useFiltrosTransacoes(transacoes);

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
        <TabelaPlanejamentos />
        <PainelLateralPlanejamento />
      </div>
    </section>
  );
}

export default Budget;
