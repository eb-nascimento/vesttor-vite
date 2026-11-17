// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomSelect from "./CustomSelect";
import ConfirmModal from "./ConfirmModal";

afterEach(cleanup);
const options = [{ valor: "salario", label: "Salário" }, { valor: "saude", label: "Saúde" }, { valor: "alimentacao", label: "Alimentação" }];
function montar(props = {}) {
  const onChange = vi.fn();
  render(<CustomSelect ariaLabel="Categoria" options={options} value="saude" onChange={onChange} {...props} />);
  return { user: userEvent.setup(), input: screen.getByRole("combobox", { name: "Categoria" }), onChange };
}
describe("select pesquisável", () => {
  it("busca sem acentos e entrega o valor da opção, não o texto digitado", async () => {
    const { user, input, onChange } = montar();
    await user.click(input);
    await user.type(input, "SALARIO");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: "Salário" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("salario");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("seleciona com setas e Enter sem enviar o formulário", async () => {
    const submit = vi.fn(e => e.preventDefault());
    const change = vi.fn();
    render(<form onSubmit={submit}><CustomSelect ariaLabel="Tipo" options={options} value="" onChange={change} /></form>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(change).toHaveBeenCalledExactlyOnceWith("salario");
    expect(submit).not.toHaveBeenCalled();
  });
  it("informa busca sem resultado e restaura a seleção ao cancelar", async () => {
    const { user, input, onChange } = montar();
    await user.click(input);
    await user.type(input, "inexistente");
    expect(screen.getByText("Nenhuma opção encontrada.")).toBeTruthy();
    await user.keyboard("{Enter}{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe("Saúde");
    await user.click(input);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });
  it("fecha ao sair por Tab e não altera o valor", async () => {
    const { user, input, onChange } = montar();
    await user.click(input);
    await user.type(input, "Alim");
    await user.tab();
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input.value).toBe("Saúde");
    expect(onChange).not.toHaveBeenCalled();
  });
  it("não abre nem seleciona quando desativado", async () => {
    const { user, input, onChange } = montar({ disabled: true });
    await user.click(input);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
describe("confirmação de exclusão", () => {
  it("cancelar fecha sem executar a exclusão", async () => {
    const onClose = vi.fn(); const onConfirm = vi.fn();
    render(<ConfirmModal isOpen title="Excluir transação" onClose={onClose} onConfirm={onConfirm} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });
  it("bloqueia confirmação, cancelamento e Escape durante a operação", async () => {
    const onClose = vi.fn(); const onConfirm = vi.fn();
    render(<ConfirmModal isOpen processando title="Excluir transação" onClose={onClose} onConfirm={onConfirm} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Confirmar" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled(); expect(onConfirm).not.toHaveBeenCalled();
  });
});
