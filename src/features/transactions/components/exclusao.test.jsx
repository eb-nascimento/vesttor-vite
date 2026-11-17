// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemTransacao from "./ItemTransacao";
import TabelaTransacoes from "./TabelaTransacoes";

afterEach(cleanup);
const item = { id: "t1", descricao: "Mercado", valor: 100, tipo: "despesa", categoria: "Alimenta��o", data: "2026-11-16" };
describe.each(["mobile", "desktop"])("exclus�o %s", (layout) => {
  function montar(onExcluir) {
    return render(layout === "mobile"
      ? <ItemTransacao item={item} onExcluir={onExcluir} />
      : <TabelaTransacoes transacoes={[item]} onExcluir={onExcluir} />);
  }
  it("s� exclui depois de confirmar e permite cancelar", async () => {
    const user = userEvent.setup();
    const excluir = vi.fn().mockResolvedValue();
    montar(excluir);
    await user.click(screen.getByRole("button", { name: /excluir/i }));
    expect(excluir).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(excluir).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /excluir/i }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Excluir" }));
    expect(excluir).toHaveBeenCalledExactlyOnceWith("t1");
  });
});
