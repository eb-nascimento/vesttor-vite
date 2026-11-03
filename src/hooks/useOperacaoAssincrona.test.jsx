// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useOperacaoAssincrona } from "./useOperacaoAssincrona";
afterEach(cleanup);
describe("operação assíncrona", () => {
  it("bloqueia envio repetido antes do próximo render e libera após conclusão", async () => {
    let resolver;
    const pendente = new Promise(resolve => { resolver = resolve; });
    const { result } = renderHook(() => useOperacaoAssincrona("Falha ao salvar."));
    let primeira; let segunda; let chamadas = 0;
    act(() => {
      primeira = result.current.executar(() => { chamadas++; return pendente; });
      segunda = result.current.executar(() => { chamadas++; });
    });
    expect(result.current.processando).toBe(true);
    expect(await segunda).toBe(false); expect(chamadas).toBe(1);
    await act(async () => { resolver(); await primeira; });
    expect(result.current.processando).toBe(false);
    await act(async () => { expect(await result.current.executar(() => { chamadas++; })).toBe(true); });
    expect(chamadas).toBe(2);
  });
  it("exibe erro seguro e permite tentar novamente após rejeição", async () => {
    const { result } = renderHook(() => useOperacaoAssincrona("Falha ao salvar."));
    await act(async () => { expect(await result.current.executar(() => Promise.reject({ code: "unavailable", message: "segredo" }))).toBe(false); });
    expect(result.current.erro).toBeTruthy(); expect(result.current.erro).not.toContain("segredo");
    expect(result.current.processando).toBe(false);
    await act(async () => { await result.current.executar(() => Promise.resolve()); });
    expect(result.current.erro).toBe("");
  });
});
