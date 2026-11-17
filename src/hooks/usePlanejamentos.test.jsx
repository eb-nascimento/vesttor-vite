// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
const api = vi.hoisted(() => ({ onPlanejamentoChange: vi.fn(), criarPlanejamentoNaApi: vi.fn(), atualizarPlanejamentoNaApi: vi.fn() }));
vi.mock("../services/planejamentoService", () => api);
import { usePlanejamentos } from "./usePlanejamentos";
afterEach(cleanup);
beforeEach(() => { vi.clearAllMocks(); api.onPlanejamentoChange.mockReturnValue(vi.fn()); });
describe("planejamento com serviços", () => {
  it("distingue carregamento de mês vazio e recebe dados da assinatura", () => {
    const { result } = renderHook(() => usePlanejamentos("uid-1", "2026-11"));
    expect(result.current.carregando).toBe(true);
    act(() => api.onPlanejamentoChange.mock.calls[0][1]([]));
    expect(result.current.carregando).toBe(false); expect(result.current.planejamentos).toEqual([]);
    act(() => api.onPlanejamentoChange.mock.calls[0][1]([{ id: "p1", categoria: "Moradia" }]));
    expect(result.current.planejamentos).toEqual([{ id: "p1", categoria: "Moradia" }]);
  });
  it("cancela assinatura ao trocar competência e aguarda o novo mês", () => {
    const cancelar = vi.fn(); api.onPlanejamentoChange.mockReturnValue(cancelar);
    const { result, rerender, unmount } = renderHook(({ mes }) => usePlanejamentos("uid-1", mes), { initialProps: { mes: "2026-11" } });
    act(() => api.onPlanejamentoChange.mock.calls[0][1]([]));
    rerender({ mes: "2026-12" });
    expect(cancelar).toHaveBeenCalledOnce(); expect(result.current.carregando).toBe(true);
    expect(api.onPlanejamentoChange.mock.calls[1][3]).toBe("2026-12");
    act(() => api.onPlanejamentoChange.mock.calls[1][1]([]));
    expect(result.current.carregando).toBe(false);
    unmount(); expect(cancelar).toHaveBeenCalledTimes(2);
  });
  it("reconecta após erro sem expor detalhes técnicos", () => {
    const { result } = renderHook(() => usePlanejamentos("uid-1", "2026-11"));
    act(() => api.onPlanejamentoChange.mock.calls[0][2]({ code: "unavailable", message: "segredo" }));
    expect(result.current.carregando).toBe(false); expect(result.current.erroLeitura).not.toContain("segredo");
    act(() => result.current.tentarNovamente());
    expect(result.current.carregando).toBe(true); expect(result.current.erroLeitura).toBe("");
    expect(api.onPlanejamentoChange).toHaveBeenCalledTimes(2);
  });
  it("encaminha criação e edição com UID e propaga falhas para o formulário", async () => {
    const { result } = renderHook(() => usePlanejamentos("uid-1", "2026-11"));
    const dados = { categoria: "Moradia", planejado: 1500, mesAno: "2026-11" };
    await result.current.criarPlanejamento(dados);
    await result.current.atualizarPlanejamento("p1", dados);
    expect(api.criarPlanejamentoNaApi).toHaveBeenCalledExactlyOnceWith(dados, "uid-1");
    expect(api.atualizarPlanejamentoNaApi).toHaveBeenCalledExactlyOnceWith("p1", dados, "uid-1");
    const falha = new Error("falha de gravação"); api.criarPlanejamentoNaApi.mockRejectedValueOnce(falha);
    await expect(result.current.criarPlanejamento(dados)).rejects.toBe(falha);
  });
});
