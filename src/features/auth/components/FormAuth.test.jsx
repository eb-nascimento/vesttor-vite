// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
const { login } = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock("../../../config/firebase", () => ({ auth: {} }));
vi.mock("../../../services/authService", async (original) => ({ ...(await original()), login }));
import FormAuth from "./FormAuth";
import Login from "../../../pages/Login";
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it("não envia campos vazios e apresenta mensagem segura para senha incorreta", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><FormAuth /></MemoryRouter>);
  await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
  expect(login).not.toHaveBeenCalled();
  await user.type(screen.getByLabelText("E-mail"), "teste@example.com");
  await user.type(screen.getByLabelText("Senha"), "errada");
  login.mockRejectedValueOnce({ code: "auth/invalid-credential", message: "Firebase: Error" });
  await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
  expect((await screen.findByRole("alert")).textContent).toBe("E-mail ou senha inválidos.");
});
it("limpa erros e senhas ao navegar entre login e recuperação", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/login"]}><Login /></MemoryRouter>);
  await user.type(screen.getByLabelText("E-mail"), "teste@example.com");
  await user.type(screen.getByLabelText("Senha"), "errada");
  login.mockRejectedValueOnce({ code: "auth/invalid-credential" });
  await user.click(screen.getByRole("button", { name: "Entrar", exact: true }));
  await screen.findByRole("alert");
  await user.click(screen.getByRole("link", { name: "Esqueci minha senha" }));
  expect(screen.queryByRole("alert")).toBeNull();
  await user.click(screen.getByRole("link", { name: "Voltar ao login" }));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByLabelText("Senha").value).toBe("");
});

it("alterna a visibilidade da senha no login e das senhas no cadastro", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<MemoryRouter><FormAuth /></MemoryRouter>);
  const senha = screen.getByLabelText("Senha");
  await user.type(senha, "senha123");
  await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
  expect(senha.type).toBe("text");
  expect(senha.value).toBe("senha123");
  await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
  expect(senha.type).toBe("password");
  rerender(<MemoryRouter><FormAuth key="cadastro" modo="cadastro" /></MemoryRouter>);
  const confirmacao = screen.getByLabelText("Confirmar senha");
  await user.type(confirmacao, "senha123");
  await user.click(screen.getByRole("button", { name: "Mostrar confirmação de senha" }));
  expect(confirmacao.type).toBe("text");
  expect(confirmacao.value).toBe("senha123");
  expect(screen.getByLabelText("Senha").type).toBe("password");
  await user.click(screen.getByRole("button", { name: "Ocultar confirmação de senha" }));
  expect(confirmacao.type).toBe("password");
});
