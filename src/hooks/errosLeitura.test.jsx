import { beforeEach, describe, expect, it, vi } from "vitest";
const estado = vi.hoisted(() => ({ valores: [], indice: 0, efeito: null }));
const servicos = vi.hoisted(() => ({ observarTransacoes: vi.fn(), onPlanejamentoChange: vi.fn() }));
vi.mock("react", async (original) => ({
  ...(await original()),
  useState(inicial) {
    const i = estado.indice++;
    if (!(i in estado.valores)) estado.valores[i] = typeof inicial === "function" ? inicial() : inicial;
    return [estado.valores[i], (valor) => { estado.valores[i] = typeof valor === "function" ? valor(estado.valores[i]) : valor; }];
  },
  useEffect(efeito) { estado.efeito = efeito; },
}));
vi.mock("../services/transacoesService", () => ({
  observarTransacoes: servicos.observarTransacoes,
  criarTransacaoNaApi: vi.fn(), excluirTransacaoNaApi: vi.fn(), editarTransacaoNaApi: vi.fn(),
  criarCompraParceladaNaApi: vi.fn(), excluirParcelasFuturasNaApi: vi.fn(),
  atualizarCompraParceladaNaApi: vi.fn(), converterParaParceladaNaApi: vi.fn(),
}));
vi.mock("../services/planejamentoService", () => ({
  onPlanejamentoChange: servicos.onPlanejamentoChange, criarPlanejamentoNaApi: vi.fn(), atualizarPlanejamentoNaApi: vi.fn(),
}));
import { useTransacoes } from "./useTransacoes";
import { usePlanejamentos } from "./usePlanejamentos";

beforeEach(() => { vi.clearAllMocks(); estado.valores = []; });
describe.each([
  ["transações", useTransacoes, servicos.observarTransacoes],
  ["planejamentos", usePlanejamentos, servicos.onPlanejamentoChange],
])("leitura de %s", (_, hook, observar) => {
  it("permite reconectar após falha, limpa o erro e volta a carregar dados", () => {
    const cancelar = vi.fn();
    observar.mockReturnValue(cancelar);
    const render = () => { estado.indice = 0; return hook("usuario-1"); };
    render();
    const cleanup = estado.efeito();
    observar.mock.calls[0][2]({ code: "unavailable", message: "segredo" });
    let api = render();
    expect(api.carregando).toBe(false);
    expect(api.erroLeitura).toContain("conexão");
    expect(api.erroLeitura).not.toContain("segredo");
    api.tentarNovamente();
    api = render();
    expect(api.carregando).toBe(true);
    expect(api.erroLeitura).toBe("");
    cleanup();
    estado.efeito();
    expect(cancelar).toHaveBeenCalledOnce();
    observar.mock.calls[1][1]([]);
    api = render();
    expect(api.carregando).toBe(false);
    expect(api.erroLeitura).toBe("");
  });
});
