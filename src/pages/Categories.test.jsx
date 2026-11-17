// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Categories from "./Categories";
afterEach(cleanup);
it("busca categorias com ou sem acentos e informa resultado vazio", async () => {
  const user = userEvent.setup();
  render(<Categories />);
  const busca = screen.getByRole("textbox", { name: "Buscar categoria" });
  await user.type(busca, "SAUDE");
  expect(screen.getByRole("heading", { name: "Sa�de", exact: true })).toBeTruthy();
  expect(screen.queryByText(/Nenhuma categoria encontrada/)).toBeNull();
  await user.clear(busca);
  await user.type(busca, "inexistente");
  expect(screen.getByText(/Nenhuma categoria encontrada/)).toBeTruthy();
});
