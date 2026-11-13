// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Payments from "./Payments";
afterEach(cleanup);
it("exibe catálogo do MVP com cadastro desativado e busca sem acentos", async () => {
  render(<Payments />);
  expect(screen.getByRole("button", { name: "+ Novo método" }).disabled).toBe(true);
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Buscar método" }), "debito");
  expect(screen.getByRole("heading", { name: "Cartão de Débito" })).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Pix" })).toBeNull();
});
it("filtra por tipo e informa quando não há resultados", async () => {
  render(<Payments />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Abrir filtros" }));
  await user.click(screen.getByRole("combobox", { name: "Tipo" }));
  await user.click(screen.getByRole("option", { name: "Benefício" }));
  expect(screen.getByRole("heading", { name: "Vale-alimentação" })).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Pix" })).toBeNull();
  await user.type(screen.getByRole("textbox", { name: "Buscar método" }), "inexistente");
  expect(screen.getByRole("status").textContent).toContain("Nenhum método encontrado");
});
