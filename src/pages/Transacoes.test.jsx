import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const hookApi = {
    carregando: false,
    erroOperacao: null,
    erroLeitura: null,
    transacoes: [],
    adicionarTransacao: vi.fn(),
    adicionarCompraParcelada: vi.fn(),
    editarTransacao: vi.fn(),
    atualizarCompraParcelada: vi.fn(),
    converterParaParcelada: vi.fn(),
    excluirTransacao: vi.fn(),
    excluirParcelasFuturas: vi.fn(),
  };

  return {
    hookApi,
    modalFormProps: vi.fn(),
  };
});

vi.mock("../hooks/useTransacoes", () => ({
  useTransacoes: () => mocks.hookApi,
}));

vi.mock("../hooks/useFiltrosTransacoes", () => ({
  ITENS_POR_PAGINA: 10,
  useFiltrosTransacoes: () => ({
    filtros: { mesAno: "2026-09" },
    setFiltros: vi.fn(),
    filtrosAbertos: false,
    setFiltrosAbertos: vi.fn(),
    paginaAtual: 1,
    setPaginaAtual: vi.fn(),
    mesesDisponiveis: [],
    categoriasDisponiveis: [],
    metodosDisponiveis: [],
    transacoesPaginadas: [],
    totais: { saldo: 0, receitas: 0, despesas: 0 },
    totalItens: 0,
    totalPaginas: 0,
    limparFiltros: vi.fn(),
    handleMudarMes: vi.fn(),
  }),
}));

vi.mock("../components/ui/Button", () => ({
  default: ({ children }) => <button>{children}</button>,
}));
vi.mock("../components/ui/PageHeader", () => ({
  default: ({ children }) => <header>{children}</header>,
}));
vi.mock("../components/ui/Paginacao", () => ({ default: () => null }));
vi.mock("../components/ui/PaginadorMes", () => ({ default: () => null }));
vi.mock("../features/transactions/components/ResumoPeriodo", () => ({
  default: () => null,
}));
vi.mock("../features/transactions/components/FiltrosTransacoes", () => ({
  default: () => null,
}));
vi.mock("../features/transactions/components/TabelaTransacoes", () => ({
  default: () => null,
}));
vi.mock("../features/transactions/components/ItemTransacao", () => ({
  default: () => null,
}));
vi.mock("../features/transactions/components/ModalExclusaoParcelamento", () => ({
  default: () => null,
}));
vi.mock("../features/transactions/components/ModalFormTransacao", () => ({
  default: (props) => {
    mocks.modalFormProps(props);
    return null;
  },
}));

import Transacoes from "./Transacoes";

describe("Transacoes", () => {
  it("encaminha o contrato parcelado exportado por useTransacoes", () => {
    renderToStaticMarkup(<Transacoes usuario={{ uid: "usuario-1" }} />);

    const props = mocks.modalFormProps.mock.calls.at(-1)[0];

    expect(props.onAddParcelado).toBe(mocks.hookApi.adicionarCompraParcelada);
    expect(props.onEditParcelado).toBe(mocks.hookApi.atualizarCompraParcelada);
    expect(props.onConverterParaParcelado).toBe(
      mocks.hookApi.converterParaParcelada,
    );
  });
});
