// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./FormTransacao";

afterEach(cleanup);
async function escolher(user, campo, opcao) {
  await user.click(screen.getByRole("combobox", { name: campo }));
  await user.click(screen.getByRole("option", { name: opcao, exact: true }));
  // O select mantém o foco aberto; clicar em outro campo fecha a busca.
  await user.click(screen.getByRole("textbox", { name: "Descrição" }));
}
async function preencher(user) {
  await user.type(screen.getByRole("textbox", { name: "Descrição" }), "Passe de ônibus");
  await user.type(screen.getByRole("textbox", { name: "Valor", exact: true }), "150");
}

it("sugere classificação pela categoria, aceita troca e envia o valor selecionado", async () => {
  const onAdd = vi.fn().mockResolvedValue();
  render(<Form onAdd={onAdd} />);
  const user = userEvent.setup();
  await escolher(user, "Categoria", "Moradia");
  expect(screen.getByRole("combobox", { name: "Classificação" }).value).toBe("Fixo");
  await escolher(user, "Classificação", "Variável");
  await preencher(user);
  await user.click(screen.getByRole("button", { name: /Adicionar Despesa/ }));
  expect(onAdd).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ categoria: "Moradia", classificacao: "Variável", valor: 150 }));
});

it("ao editar preserva classificação explícita diferente do padrão da categoria", async () => {
  const onEdit = vi.fn().mockResolvedValue();
  const cancelarEdicao = vi.fn();
  render(<Form transacaoEditando={{ id: "t1", data: "2026-11-13", descricao: "Passe", tipo: "despesa", categoria: "Transporte", classificacao: "Fixo", valor: 150 }} onEdit={onEdit} cancelarEdicao={cancelarEdicao} />);
  expect(screen.getByRole("combobox", { name: "Classificação" }).value).toBe("Fixo");
  await userEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
  expect(onEdit).toHaveBeenCalledWith("t1", expect.objectContaining({ classificacao: "Fixo" }));
});

it("receita esconde classificação e não envia campo de despesa", async () => {
  const onAdd = vi.fn().mockResolvedValue();
  render(<Form onAdd={onAdd} />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Receita", exact: true }));
  expect(screen.queryByRole("combobox", { name: "Classificação" })).toBeNull();
  await preencher(user);
  await user.click(screen.getByRole("button", { name: /Adicionar Receita/ }));
  expect(onAdd).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ tipo: "receita" }));
  expect(onAdd.mock.calls[0][0]).not.toHaveProperty("classificacao");
});

it("ao editar uma parcela mantém data, quantidade e tipo bloqueados e informa o alcance", async () => {
  const onEditParcelado = vi.fn().mockResolvedValue();
  render(<Form transacaoEditando={{ id: "p2", data: "2026-02-28", descricao: "Compra (2/3)", tipo: "despesa", categoria: "Transporte", valor: 100, valorTotalCompra: 300, parcelamentoId: "serie", numeroParcela: 2, totalParcelas: 3 }} onEditParcelado={onEditParcelado} cancelarEdicao={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Data" }).disabled).toBe(true);
  expect(screen.getByRole("textbox", { name: "Quantidade de parcelas" }).disabled).toBe(true);
  expect(screen.getByRole("button", { name: "Receita" }).disabled).toBe(true);
  expect(screen.getByText(/As alterações serão aplicadas às parcelas existentes/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
  expect(onEditParcelado).toHaveBeenCalledWith(expect.objectContaining({ parcelamentoId: "serie" }));
});

it("impede salvar descrição longa sem perder o texto e explica o limite", async () => {
  const onAddParcelado = vi.fn();
  render(<Form onAddParcelado={onAddParcelado} />);
  const user = userEvent.setup();
  await user.click(screen.getByRole("checkbox"));
  await user.type(screen.getByRole("textbox", { name: "Valor total da compra" }), "100");
  expect(screen.queryByText(/máximo 200 caracteres/i)).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "Descrição" }), { target: { value: "a".repeat(200) } });
  expect(screen.queryByText(/máximo 200 caracteres/i)).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "Descrição" }), { target: { value: "a".repeat(201) } });
  await user.click(screen.getByRole("button", { name: /Adicionar compra parcelada/ }));
  expect(screen.getByRole("alert").textContent).toContain("máximo 200 caracteres");
  expect(screen.getByRole("textbox", { name: "Descrição" }).value).toHaveLength(201);
  expect(onAddParcelado).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole("textbox", { name: "Descrição" }), { target: { value: "a".repeat(200) } });
  expect(screen.queryByText(/máximo 200 caracteres/i)).toBeNull();
});
