import Select from "../components/ui/Select";
import PaginadorMes from "../components/ui/PaginadorMes";
import { useState } from "react";
import "./Budget.css";

import { useTransacoes } from "../hooks/useTransacoes";
import { useFiltrosTransacoes } from "../hooks/useFiltrosTransacoes";
import { usePlanejamentos } from "../hooks/usePlanejamentos";
import { cruzarPlanejamentos } from "../utils/planejamento";

import Button from "../components/ui/Button";
import EquacaoMes from "../features/budget/components/EquacaoMes";
import StatePanel from "../components/ui/StatePanel";
import { centavosDoItem, paraCentavos } from "../utils/dinheiro";
import TabelaPlanejamentos from "../features/budget/components/TabelaPlanejamentos";
import PainelLateralPlanejamento from "../features/budget/components/PainelLateralPlanejamento";
import ModalFormPlanejamento from "../features/budget/components/ModalFormPlanejamento";

function Budget({ usuario }) {
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [planejamentoEditando, setPlanejamentoEditando] = useState(null);

  const { transacoes, mesAno, mudarPeriodo, carregando: carregandoTransacoes, erroLeitura: erroTransacoes, tentarNovamente: tentarTransacoes } = useTransacoes(usuario?.uid);
  const { planejamentos, criarPlanejamento, atualizarPlanejamento, carregando, erroLeitura, tentarNovamente } =
    usePlanejamentos(usuario?.uid, mesAno);
  const { filtros, setFiltros, mesesDisponiveis, handleMudarMes } =
    useFiltrosTransacoes(transacoes, mudarPeriodo);

  // 1. Filtra as transações do mês selecionado
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

  const todosPlanejamentos = cruzarPlanejamentos(planejamentos, transacoesDoMes);

  // 5. Matemática da Equação do Mês
  let entradasPlanejadas = 0,
    entradasRealizadas = 0;
  let fixosPlanejados = 0,
    fixosRealizados = 0;
  let variaveisPlanejados = 0,
    variaveisRealizados = 0;

  todosPlanejamentos.forEach((plan) => {
    if (plan.tipo === "Entrada") {
      entradasPlanejadas += centavosDoItem(plan, "planejado");
      entradasRealizadas += paraCentavos(plan.valorRealizado || 0);
    } else if (plan.tipo === "Fixo") {
      fixosPlanejados += centavosDoItem(plan, "planejado");
      fixosRealizados += paraCentavos(plan.valorRealizado || 0);
    } else {
      variaveisPlanejados += centavosDoItem(plan, "planejado");
      variaveisRealizados += paraCentavos(plan.valorRealizado || 0);
    }
  });

  const saldoProjetado =
    (entradasPlanejadas - fixosPlanejados - variaveisPlanejados) / 100;
  const porcentagemSaldo =
    entradasPlanejadas > 0
      ? Math.round((saldoProjetado * 100 / entradasPlanejadas) * 100)
      : 0;
  // Quanto do orçamento já foi engolido por despesas?
  const despesasPlanejadas = fixosPlanejados + variaveisPlanejados;
  let porcentagemComprometida = 0;

  if (entradasPlanejadas > 0) {
    porcentagemComprometida = Math.round(
      (despesasPlanejadas / entradasPlanejadas) * 100,
    );
  } else if (despesasPlanejadas > 0) {
    // Se não tem receita planejada, mas tem despesa, já estourou o limite lógico
    porcentagemComprometida = 101;
  }

  entradasPlanejadas /= 100; entradasRealizadas /= 100;
  fixosPlanejados /= 100; fixosRealizados /= 100;
  variaveisPlanejados /= 100; variaveisRealizados /= 100;
  // 6. Função para aprovar o gasto não planejado no banco de dados
  const handleApproveUnplanned = async (item) => {
    await criarPlanejamento({
      categoria: item.categoria,
      tipo: item.tipo,
      planejado: 0,
      mesAno: filtros.mesAno,
    });
  };

  function abrirNovoPlanejamento() {
    setPlanejamentoEditando(null);
    setModalFormAberto(true);
  }

  const handleEditPlanejamento = (item) => {
    setPlanejamentoEditando(item);
    setModalFormAberto(true);
  };

  // 7. Próximos Vencimentos (Contas que vão vencer de hoje em diante)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximosVencimentos = transacoesDoMes
    .filter((t) => {
      if (t.tipo !== "despesa") return false;
      if (!t.data) return false;
      const dataObj = t.data.toDate
        ? t.data.toDate()
        : new Date(`${t.data}T12:00:00`);
      // Zera a hora para comparar só o dia
      dataObj.setHours(0, 0, 0, 0);
      return dataObj >= hoje;
    })
    .sort((a, b) => {
      const dataA = a.data.toDate
        ? a.data.toDate()
        : new Date(`${a.data}T12:00:00`);
      const dataB = b.data.toDate
        ? b.data.toDate()
        : new Date(`${b.data}T12:00:00`);
      return dataA - dataB;
    });

  if (carregando || carregandoTransacoes) {
    return <StatePanel state="loading" message="Carregando planejamento financeiro..." />;
  }
  if (erroLeitura || erroTransacoes) {
    return <StatePanel state="error" message={erroLeitura || erroTransacoes}>
      <Button onClick={() => { tentarNovamente(); tentarTransacoes(); }}>Tentar novamente</Button>
    </StatePanel>;
  }

  return (
    <section className="budget-page">
      <header className="budget-header">
        <div className="budget-header-textos">
          <h2>Planejamento<span className="budget-desktop-label"> Financeiro</span></h2>
          <p className="budget-desktop-label">Visão operacional do mês e dos próximos compromissos.</p>
          <Select className="budget-periodo-compacto" aria-label="Competência do planejamento" value={filtros.mesAno} onChange={(event) => setFiltros({ ...filtros, mesAno: event.target.value })}>
            {mesesDisponiveis.map((mes) => <option key={mes.valor} value={mes.valor}>{mes.label}</option>)}
          </Select>
        </div>
        <div className="budget-header-acoes">
          <div className="budget-periodo-detalhado"><PaginadorMes mesAtual={mesesDisponiveis.find((mes) => mes.valor === filtros.mesAno)?.label} onMudarMes={handleMudarMes} /></div>
          <Button onClick={abrirNovoPlanejamento}><span className="budget-desktop-label">Novo Orçamento</span><span className="budget-compacto-label">+ Novo</span></Button>
        </div>
      </header>
      <EquacaoMes
        entradasPlanejadas={entradasPlanejadas}
        entradasRealizadas={entradasRealizadas}
        fixosPlanejados={fixosPlanejados}
        fixosRealizados={fixosRealizados}
        variaveisPlanejados={variaveisPlanejados}
        variaveisRealizados={variaveisRealizados}
        saldoProjetado={saldoProjetado}
        porcentagemSaldo={porcentagemSaldo}
      />
      <div className="area-operacional">
        <TabelaPlanejamentos
          itens={todosPlanejamentos}
          proximosVencimentos={proximosVencimentos}
          onApprove={handleApproveUnplanned}
          onEdit={handleEditPlanejamento}
          onAdd={abrirNovoPlanejamento}
        />
        <PainelLateralPlanejamento
          saldoProjetado={saldoProjetado}
          porcentagemComprometida={porcentagemComprometida}
          proximosVencimentos={proximosVencimentos}
        />
      </div>
      <ModalFormPlanejamento
        key={`${modalFormAberto}-${planejamentoEditando?.id || "novo"}`}
        isOpen={modalFormAberto}
        onClose={() => {
          setModalFormAberto(false);
          setPlanejamentoEditando(null);
        }}
        onSave={criarPlanejamento}
        onUpdate={atualizarPlanejamento}
        mesAno={filtros.mesAno}
        itemEditando={planejamentoEditando}
      />
    </section>
  );
}

export default Budget;

