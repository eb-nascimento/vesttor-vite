import PaginadorMes from "../components/ui/PaginadorMes";
import { useState } from "react";
import "./Budget.css";

import { useTransacoes } from "../hooks/useTransacoes";
import { useFiltrosTransacoes } from "../hooks/useFiltrosTransacoes";
import { usePlanejamentos } from "../hooks/usePlanejamentos";

import Button from "../components/ui/Button";
import { Plus } from "lucide-react";
import EquacaoMes from "../features/budget/components/EquacaoMes";
import PageHeader from "../components/ui/PageHeader";
import TabelaPlanejamentos from "../features/budget/components/TabelaPlanejamentos";
import PainelLateralPlanejamento from "../features/budget/components/PainelLateralPlanejamento";
import ModalFormPlanejamento from "../features/budget/components/ModalFormPlanejamento";

function Budget({ usuario }) {
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [planejamentoEditando, setPlanejamentoEditando] = useState(null);

  const { transacoes } = useTransacoes(usuario?.uid);
  const { planejamentos, criarPlanejamento, atualizarPlanejamento } =
    usePlanejamentos(usuario?.uid);
  const { filtros, mesesDisponiveis, handleMudarMes } =
    useFiltrosTransacoes(transacoes);

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

  // 2. Cruza os planejamentos que você já criou com as transações realizadas
  const planejamentosCruzados = planejamentos.map((plan) => {
    const transacoesDaCategoria = transacoesDoMes.filter(
      (t) => t.categoria === plan.categoria,
    );
    const valorRealizado = transacoesDaCategoria.reduce(
      (soma, t) => soma + t.valor,
      0,
    );
    return { ...plan, valorRealizado };
  });

  // 3. Caça os gastos Não Planejados (Unplanned)
  const plannedCats = planejamentos.map((p) => p.categoria);
  const unplannedMap = {};

  // Mapeamento provisório das categorias até termos a tela de Categorias
  const TIPO_POR_CATEGORIA = {
    Salário: "Entrada",
    Freelance: "Entrada",
    Reembolso: "Entrada",
    Moradia: "Fixo",
    "Contas & Serviços": "Fixo",
    Educação: "Fixo",
    Investimentos: "Fixo",
  };

  transacoesDoMes.forEach((t) => {
    if (!plannedCats.includes(t.categoria)) {
      if (!unplannedMap[t.categoria]) {
        unplannedMap[t.categoria] = {
          id: `unplanned-${t.categoria}`,
          categoria: t.categoria,
          tipo: TIPO_POR_CATEGORIA[t.categoria] || "Variável",
          planejado: 0,
          valorRealizado: 0,
          isUnplanned: true, // Aqui marcamos que é órfão
        };
      }
      unplannedMap[t.categoria].valorRealizado += Number(t.valor);
    }
  });

  const unplannedItems = Object.values(unplannedMap);

  // 4. Junta os planejamentos normais com os não planejados
  const todosPlanejamentos = [...planejamentosCruzados, ...unplannedItems];

  // 5. Matemática da Equação do Mês
  let entradasPlanejadas = 0,
    entradasRealizadas = 0;
  let fixosPlanejados = 0,
    fixosRealizados = 0;
  let variaveisPlanejados = 0,
    variaveisRealizados = 0;

  todosPlanejamentos.forEach((plan) => {
    if (plan.categoria === "Entrada" || plan.tipo === "Entrada") {
      entradasPlanejadas += Number(plan.planejado || 0);
      entradasRealizadas += Number(plan.valorRealizado || 0);
    } else if (plan.tipo === "Fixo") {
      fixosPlanejados += Number(plan.planejado || 0);
      fixosRealizados += Number(plan.valorRealizado || 0);
    } else {
      variaveisPlanejados += Number(plan.planejado || 0);
      variaveisRealizados += Number(plan.valorRealizado || 0);
    }
  });

  const saldoProjetado =
    entradasPlanejadas - fixosPlanejados - variaveisPlanejados;
  const porcentagemSaldo =
    entradasPlanejadas > 0
      ? Math.round((saldoProjetado / entradasPlanejadas) * 100)
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

  // 6. Função para aprovar o gasto não planejado no banco de dados
  const handleApproveUnplanned = async (item) => {
    await criarPlanejamento({
      categoria: item.categoria,
      tipo: item.tipo,
      planejado: 0,
      mesAno: filtros.mesAno,
    });
  };

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

        <Button
          icon={Plus}
          onClick={() => {
            setPlanejamentoEditando(null);
            setModalFormAberto(true);
          }}
        >
          Novo Orçamento
        </Button>
      </PageHeader>
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
          onApprove={handleApproveUnplanned}
          onEdit={handleEditPlanejamento}
        />
        <PainelLateralPlanejamento
          saldoProjetado={saldoProjetado}
          porcentagemComprometida={porcentagemComprometida}
          proximosVencimentos={proximosVencimentos}
        />
      </div>
      <ModalFormPlanejamento
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
