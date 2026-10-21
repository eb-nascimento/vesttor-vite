import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ values: [], index: 0, refs: [], refIndex: 0 }));
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal()),
  useState(initial) {
    const index = state.index++;
    if (!(index in state.values)) state.values[index] = typeof initial === "function" ? initial() : initial;
    return [state.values[index], (value) => {
      state.values[index] = typeof value === "function" ? value(state.values[index]) : value;
    }];
  },
  useRef(initial) {
    const index = state.refIndex++;
    return state.refs[index] ??= { current: initial };
  },
  useMemo: (fn) => fn(),
}));
import Form from "./FormTransacao";

function render(props) {
  state.index = 0;
  state.refIndex = 0;
  return Form(props);
}
function find(node, predicate) {
  if (!node || typeof node !== "object") return;
  if (predicate(node)) return node;
  const children = node.props?.children;
  for (const child of [children].flat(Infinity)) {
    const result = find(child, predicate);
    if (result) return result;
  }
}
const field = (tree, id) => find(tree, (node) => node.props?.id === id);
const submit = (tree) => find(tree, (node) => node.type === "form").props.onSubmit({ preventDefault() {} });
function fill(props) {
  let tree = render(props);
  field(tree, "descricao").props.onChange({ target: { value: "Compra de teste" } });
  tree = render(props);
  field(tree, "valor").props.onChange({ target: { value: "120" } });
  return render(props);
}
beforeEach(() => { state.values = []; state.refs = []; });

describe("envio de transações", () => {
  it("associa o título Tipo ao grupo de opções sem um label para campo inexistente", () => {
    const tree = render({ onAdd: vi.fn() });
    expect(find(tree, (node) => node.type === "label" && node.props.htmlFor === "tipo")).toBeUndefined();
    const titulo = field(tree, "tipo-label");
    expect(titulo.props.children).toBe("Tipo");
    expect(find(tree, (node) => node.props?.["aria-labelledby"] === "tipo-label")).toBeDefined();
  });

  it("aguarda a gravação e bloqueia um segundo envio antes de limpar os campos", async () => {
    let concluir;
    const onAdd = vi.fn(() => new Promise((resolve) => { concluir = resolve; }));
    const props = { onAdd };
    const tree = fill(props);
    const pending = submit(tree);
    await submit(tree);
    expect(onAdd).toHaveBeenCalledTimes(1);
    const busy = render(props);
    expect(find(busy, (node) => node.type === "fieldset").props.disabled).toBe(true);
    expect(field(busy, "descricao").props.value).toBe("Compra de teste");
    concluir();
    await pending;
    expect(field(render(props), "descricao").props.value).toBe("");
  });

  it("preserva os dados após falha e permite tentar novamente", async () => {
    const onAdd = vi.fn().mockRejectedValueOnce(new Error("Falha na gravação")).mockResolvedValueOnce();
    const props = { onAdd };
    await submit(fill(props));
    const tree = render(props);
    expect(field(tree, "descricao").props.value).toBe("Compra de teste");
    expect(field(tree, "valor").props.value).toBe("120");
    expect(find(tree, (node) => node.props?.role === "alert").props.children).toBe("Não foi possível salvar. Tente novamente.");
    expect(find(tree, (node) => node.type === "fieldset").props.disabled).toBe(false);
    await submit(tree);
    expect(onAdd).toHaveBeenCalledTimes(2);
    expect(field(render(props), "descricao").props.value).toBe("");
  });

  it("não cancela a edição quando a gravação falha", async () => {
    const cancelarEdicao = vi.fn();
    const props = {
      transacaoEditando: { id: "1", data: "2026-10-07", descricao: "Original", valor: 20, tipo: "despesa" },
      onEdit: vi.fn().mockRejectedValue(new Error("Sem permissão")),
      cancelarEdicao,
    };
    await submit(render(props));
    expect(cancelarEdicao).not.toHaveBeenCalled();
    expect(field(render(props), "descricao").props.value).toBe("Original");
  });
  it("aguarda a criação parcelada antes de limpar o formulário", async () => {
    let concluir;
    const onAddParcelado = vi.fn(() => new Promise((resolve) => { concluir = resolve; }));
    const props = { onAddParcelado };
    let tree = fill(props);
    find(tree, (node) => node.props?.role === "checkbox").props.onClick({ stopPropagation() {} });
    tree = render(props);
    const pending = submit(tree);
    expect(onAddParcelado).toHaveBeenCalledTimes(1);
    expect(onAddParcelado.mock.calls[0][0]).toHaveLength(2);
    expect(field(render(props), "descricao").props.value).toBe("Compra de teste");
    concluir();
    await pending;
    expect(field(render(props), "descricao").props.value).toBe("");
  });

});
