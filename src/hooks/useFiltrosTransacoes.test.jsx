import { beforeEach, describe, expect, it, vi } from "vitest";
const estado = vi.hoisted(() => ({ valores: [], indice: 0 }));
vi.mock("react", async (original) => ({
  ...(await original()),
  useState(inicial) {
    const i = estado.indice++;
    if (!(i in estado.valores)) estado.valores[i] = typeof inicial === "function" ? inicial() : inicial;
    return [estado.valores[i], (valor) => { estado.valores[i] = typeof valor === "function" ? valor(estado.valores[i]) : valor; }];
  },
  useMemo: (calcular) => calcular(),
}));
import { useFiltrosTransacoes } from "./useFiltrosTransacoes";
import { mesAtual } from "../utils/periodo";

beforeEach(() => { estado.valores = []; estado.indice = 0; });
describe("filtros, indicadores e período delimitado", () => {
  const itens = Array.from({ length: 25 }, (_, indice) => ({ id: String(indice), data: `${mesAtual()}-08`, tipo: indice < 12 ? "receita" : "despesa", valor: 1, categoria: indice < 12 ? "Salário" : "Alimentação" }));
  const useRender = (mudarPeriodo) => { estado.indice = 0; return useFiltrosTransacoes(itens, mudarPeriodo); };
  it.each(["tipo", "busca", "categoria", "metodoPagamento", "ordenacao", "mesAno"])("alterar %s volta à primeira página", (campo) => {
    let api = useRender(); api.setPaginaAtual(3); api = useRender();
    api.setFiltros({ ...api.filtros, [campo]: campo === "mesAno" ? "2026-01" : "teste" });
    expect(useRender().paginaAtual).toBe(1);
  });
  it("deduz natureza pelas categorias e esvazia cards sem resultados", () => {
    let api = useRender(); api.setFiltros({ ...api.filtros, categoria: "Salário" }); api = useRender();
    expect(api.totais).toMatchObject({ temReceitas: true, temDespesas: false, receitas: 12 });
    api.setFiltros({ ...api.filtros, categoria: "Inexistente" }); api = useRender();
    expect(api.totalItens).toBe(0);
    expect(api.totais).toMatchObject({ temReceitas: false, temDespesas: false });
  });
  it("navega meses vazios e comunica o novo período à consulta", () => {
    const mudar = vi.fn();
    let api = useRender(mudar);
    api.handleMudarMes("anterior"); api = useRender(mudar);
    expect(mudar).toHaveBeenCalledWith(api.filtros.mesAno);
    expect(api.totalItens).toBe(0);
    expect(api.mesesDisponiveis.some((mes) => mes.valor === api.filtros.mesAno)).toBe(true);
  });
});
