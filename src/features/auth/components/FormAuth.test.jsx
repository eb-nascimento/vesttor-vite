// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
const { login } = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock("../../../config/firebase", () => ({ auth: {} }));
vi.mock("../../../services/authService", async (original) => ({ ...(await original()), login }));
import FormAuth from "./FormAuth";
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it("n�o envia campos vazios e apresenta mensagem segura para senha incorreta", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><FormAuth /></MemoryRouter>);
  await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
  expect(login).not.toHaveBeenCalled();
  await user.type(screen.getByLabelText("E-mail:"), "teste@example.com");
  await user.type(screen.getByLabelText("Senha:"), "errada");
  login.mockRejectedValueOnce({ code: "auth/invalid-credential", message: "Firebase: Error" });
  await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
  expect((await screen.findByRole("alert")).textContent).toBe("E-mail ou senha inv�lidos.");
});
