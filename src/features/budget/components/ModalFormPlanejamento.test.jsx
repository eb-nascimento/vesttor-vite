import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ values: [], index: 0, refs: [], refIndex: 0 }));
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal()),
  useEffect() {},
  useState(initial) {
    const index = state.index++;
    if (!(index in state.values)) state.values[index] = initial;
    return [state.values[index], (value) => {
      state.values[index] = typeof value === "function" ? value(state.values[index]) : value;
    }];
  },
  useRef(initial) {
    const index = state.refIndex++;
    return state.refs[index] ??= { current: initial };
  },
}));
import Form from "./ModalFormPlanejamento";
import Exclusao from "../../transactions/components/ModalExclusaoParcelamento";
import Item from "../../transactions/components/ItemTransacao";
import Tabela from "../../transactions/components/TabelaTransacoes";

function render(Component, props) {
  state.index = 0;
  state.refIndex = 0;
  return Component(props);
}
function find(node, predicate) {
  if (!node || typeof node !== "object") return;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const result = find(child, predicate);
    if (result) return result;
  }
}
const field = (tree) => find(tree, (node) => node.props?.id === "planejado");
const submit = (tree) => find(tree, (node) => node.type === "form").props.onSubmit({ preventDefault() {} });
beforeEach(() => { state.values = []; state.refs = []; });

describe("salvamento do orçamento", () => {
  it("preenche o default da categoria e permite trocar Fixo por Variável", async () => {
    const props = { isOpen: true, mesAno: "2026-11", onSave: vi.fn(), onClose: vi.fn() };
    const select = (id) => find(render(Form, props), (node) => node.props?.id === id);
    select("categoria").props.onChange("Moradia");
    expect(select("classificacao-orcamento").props.value).toBe("Fixo");
    select("classificacao-orcamento").props.onChange("Variável");
    field(render(Form, props)).props.onChange({ target: { value: "100" } });
    await submit(render(Form, props));
    expect(props.onSave).toHaveBeenCalledWith(expect.objectContaining({ categoria: "Moradia", tipo: "Variável" }));
  });
  it("preenche Entrada para receita e mantém as três opções em categoria híbrida", () => {
    const props = { isOpen: true };
    const select = (id) => find(render(Form, props), (node) => node.props?.id === id);
    select("categoria").props.onChange("Salário");
    expect(select("classificacao-orcamento").props.value).toBe("Entrada");
    expect(select("classificacao-orcamento").props.options.map((item) => item.valor)).toEqual(["Entrada"]);
    select("categoria").props.onChange("Outros");
    expect(select("classificacao-orcamento").props.value).toBe("Entrada");
    expect(select("classificacao-orcamento").props.options.map((item) => item.valor)).toEqual(["Entrada", "Fixo", "Variável"]);
    select("categoria").props.onChange("Alimentação");
    expect(select("classificacao-orcamento").props.value).toBe("Variável");
  });
  it("propaga a edição e preserva o valor quando atualizar falha", async () => {
    const props = { isOpen: true, itemEditando: { id: "plan-1" }, onClose: vi.fn(), onUpdate: vi.fn().mockRejectedValue(new Error("Falha")) };
    field(render(Form, props)).props.onChange({ target: { value: "240" } });
    await submit(render(Form, props));
    expect(props.onUpdate).toHaveBeenCalledWith("plan-1", expect.objectContaining({ planejado: 240 }));
    expect(field(render(Form, props)).props.value).toBe("240");
    expect(props.onClose).not.toHaveBeenCalled();
  });
  it("bloqueia duplicidade e fechamento enquanto salva", async () => {
    let concluir;
    const props = { isOpen: true, mesAno: "2026-10", onClose: vi.fn(), onSave: vi.fn(() => new Promise((resolve) => { concluir = resolve; })) };
    let tree = render(Form, props);
    field(tree).props.onChange({ target: { value: "120" } });
    tree = render(Form, props);
    const pending = submit(tree);
    await submit(tree);
    tree.props.onClose();
    expect(props.onSave).toHaveBeenCalledTimes(1);
    expect(props.onClose).not.toHaveBeenCalled();
    expect(find(render(Form, props), (node) => node.type === "fieldset").props.disabled).toBe(true);
    concluir();
    await pending;
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(field(render(Form, props)).props.value).toBe("");
  });

  it("preserva os campos na falha e permite nova tentativa", async () => {
    const props = { isOpen: true, onClose: vi.fn(), onSave: vi.fn().mockRejectedValueOnce(new Error("permission-denied")).mockResolvedValueOnce() };
    let tree = render(Form, props);
    field(tree).props.onChange({ target: { value: "120" } });
    await submit(render(Form, props));
    tree = render(Form, props);
    expect(field(tree).props.value).toBe("120");
    expect(props.onClose).not.toHaveBeenCalled();
    expect(find(tree, (node) => node.props?.role === "alert").props.children).toContain("dados foram preservados");
    await submit(tree);
    expect(props.onSave).toHaveBeenCalledTimes(2);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});

describe("exclusão avulsa", () => {
  it.each([Item, Tabela])("bloqueia duplicidade e permite tentar novamente após falha", async (Component) => {
    let falhar;
    const item = { id: "t-1", descricao: "Mercado", tipo: "despesa", valor: 120 };
    const props = { item, transacoes: [item], onExcluir: vi.fn(() => new Promise((_, reject) => { falhar = reject; })) };
    const tree = render(Component, props);
    const button = find(tree, (node) => node.props?.className?.includes("excluir"));
    button.props.onClick();
    button.props.onClick();
    expect(props.onExcluir).not.toHaveBeenCalled();
    const modal = find(render(Component, props), (node) => node.props?.confirmText === "Excluir");
    modal.props.onConfirm();
    modal.props.onConfirm();
    expect(props.onExcluir).toHaveBeenCalledTimes(1);
    expect(find(render(Component, props), (node) => node.props?.className?.includes("excluir")).props.disabled).toBe(true);
    falhar(new Error("Falha"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(find(render(Component, props), (node) => node.props?.role === "alert")).toBeDefined();
    expect(find(render(Component, props), (node) => node.props?.className?.includes("excluir")).props.disabled).toBe(false);
    props.onExcluir.mockResolvedValue();
    await find(render(Component, props), (node) => node.props?.confirmText === "Excluir").props.onConfirm();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(props.onExcluir).toHaveBeenCalledTimes(2);
    expect(find(render(Component, props), (node) => node.props?.role === "alert")).toBeUndefined();
  });
});

describe("exclusão parcelada", () => {
  const propsBase = () => ({ transacao: { descricao: "Compra", valor: 120, numeroParcela: 1, totalParcelas: 2 }, onFechar: vi.fn() });
  const excluir = (tree) => find(tree, (node) => node.props?.className === "btn-modal-opcao btn-opcao-avulsa").props.onClick();
  it("mantém a confirmação aberta na falha e fecha somente após sucesso", async () => {
    const props = { ...propsBase(), onExcluirApenasEsta: vi.fn().mockRejectedValueOnce(new Error("Falha")).mockResolvedValueOnce() };
    await excluir(render(Exclusao, props));
    expect(props.onFechar).not.toHaveBeenCalled();
    expect(find(render(Exclusao, props), (node) => node.props?.role === "alert")).toBeDefined();
    await excluir(render(Exclusao, props));
    expect(props.onFechar).toHaveBeenCalledTimes(1);
  });
  it("bloqueia exclusão simultânea e cancelamento", async () => {
    let concluir;
    const props = { ...propsBase(), onExcluirApenasEsta: vi.fn(() => new Promise((resolve) => { concluir = resolve; })) };
    const tree = render(Exclusao, props);
    const pending = excluir(tree);
    await excluir(tree);
    tree.props.onClose();
    expect(props.onExcluirApenasEsta).toHaveBeenCalledTimes(1);
    expect(props.onFechar).not.toHaveBeenCalled();
    expect(find(render(Exclusao, props), (node) => node.props?.className === "btn-modal-opcao btn-opcao-serie").props.disabled).toBe(true);
    concluir();
    await pending;
    expect(props.onFechar).toHaveBeenCalledTimes(1);
  });
});
