// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const { criar, atualizar } = vi.hoisted(() => ({ criar: vi.fn(), atualizar: vi.fn() }));
vi.mock("../hooks/useTransacoes", () => ({ useTransacoes: () => ({
  transacoes: [{ id: "t", tipo: "receita", categoria: "Salário", valor: 2500, data: { toDate: () => new Date(2026, 10, 16) } }], mesAno: "2026-11",
}) }));
vi.mock("../hooks/usePlanejamentos", () => ({ usePlanejamentos: () => ({ planejamentos: [], criarPlanejamento: criar, atualizarPlanejamento: atualizar }) }));
vi.mock("../hooks/useFiltrosTransacoes", () => ({ useFiltrosTransacoes: () => ({ filtros: { mesAno: "2026-11" }, mesesDisponiveis: [{ valor: "2026-11", label: "Novembro de 2026" }] }) }));
import Budget from "./Budget";
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it("abre orçamento da receita sem gravar e salva apenas o valor informado", async () => {
  const user = userEvent.setup();
  criar.mockResolvedValue();
  render(<Budget usuario={{ uid: "teste" }} />);
  await user.click(screen.getByRole("button", { name: "Adicionar ao planejamento de Salário" }));
  expect(criar).not.toHaveBeenCalled();
  expect(screen.getByLabelText(/Valor Planejado/).value).toBe("");
  await user.type(screen.getByLabelText(/Valor Planejado/), "3000");
  await user.click(screen.getByRole("button", { name: "Salvar Orçamento" }));
  expect(criar).toHaveBeenCalledExactlyOnceWith({ categoria: "Salário", tipo: "Entrada", planejado: 3000, mesAno: "2026-11" });
  expect(atualizar).not.toHaveBeenCalled();
});
