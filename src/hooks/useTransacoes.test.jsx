import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
const services = vi.hoisted(() => ({
  observarTransacoes: vi.fn(),
  criarTransacaoNaApi: vi.fn(),
  excluirTransacaoNaApi: vi.fn(),
  editarTransacaoNaApi: vi.fn(),
  criarCompraParceladaNaApi: vi.fn(),
  excluirParcelasFuturasNaApi: vi.fn(),
  atualizarCompraParceladaNaApi: vi.fn(),
  converterParaParceladaNaApi: vi.fn(),
}));
vi.mock("../services/transacoesService", () => services);
import { useTransacoes } from "./useTransacoes";
function obterApi() {
  let api;
  function Consumer() { api = useTransacoes("usuario-1"); return null; }
  renderToStaticMarkup(<Consumer />);
  return api;
}
beforeEach(() => vi.resetAllMocks());
describe("falhas das gravações de transações", () => {
  it.each([
    ["adicionarTransacao", "criarTransacaoNaApi", [{}]],
    ["adicionarCompraParcelada", "criarCompraParceladaNaApi", [[]]],
    ["editarTransacao", "editarTransacaoNaApi", ["id-1", {}]],
    ["atualizarCompraParcelada", "atualizarCompraParceladaNaApi", [{}]],
    ["converterParaParcelada", "converterParaParceladaNaApi", ["id-1", []]],
  ])("%s informa a falha ao formulário", async (method, service, args) => {
    const erro = new Error("Gravação recusada");
    services[service].mockRejectedValue(erro);
    await expect(obterApi()[method](...args)).rejects.toBe(erro);
    expect(services[service]).toHaveBeenCalledTimes(1);
  });
});
