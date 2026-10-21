import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const estado = vi.hoisted(() => ({ valores: [], indice: 0, refs: [], refIndice: 0 }));
vi.mock("react", async (original) => ({
  ...(await original()),
  useState(inicial) {
    const indice = estado.indice++;
    if (!(indice in estado.valores)) estado.valores[indice] = inicial;
    return [estado.valores[indice], (valor) => { estado.valores[indice] = typeof valor === "function" ? valor(estado.valores[indice]) : valor; }];
  },
  useRef(inicial) { return estado.refs[estado.refIndice++] ??= { current: inicial }; },
}));
import TabelaPlanejamentos from "./TabelaPlanejamentos";
import EquacaoMes from "./EquacaoMes";

beforeEach(() => { estado.valores = []; estado.refs = []; estado.indice = 0; estado.refIndice = 0; });
function render(props) { estado.indice = 0; estado.refIndice = 0; return TabelaPlanejamentos(props); }
function localizar(no, criterio) {
  if (!no || typeof no !== "object") return;
  if (criterio(no)) return no;
  for (const filho of [no.props?.children].flat(Infinity)) {
    const encontrado = localizar(filho, criterio);
    if (encontrado) return encontrado;
  }
}
const item = { id: "p1", categoria: "Alimentação", tipo: "Variável", planejado: 500, valorRealizado: 600 };
const acaoItem = (arvore) => localizar(arvore, (no) => no.props?.className === "planejamento-item-acao");

describe("planejamento responsivo compartilhado", () => {
  it("mantém a equação em reais e o saldo recebido", () => {
    const html = renderToStaticMarkup(<EquacaoMes entradasPlanejadas={2000} fixosPlanejados={100} variaveisPlanejados={500} saldoProjetado={1400} />).replace(/\u00a0/g, " ");
    expect(html).toContain("R$ 1.400,00");
    expect(html).toContain("R$ 2.000,00");
    expect(html).toContain("R$ 600,00");
  });
  it("comunica excesso de limite no mesmo conjunto de itens", () => {
    const html = renderToStaticMarkup(<TabelaPlanejamentos itens={[item]} />).replace(/\u00a0/g, " ");
    expect(html).toContain("Limite excedido em R$ 100,00");
    expect(html).toContain("Editar planejamento de Alimentação");
    expect(html).toContain("Gastos fixos");
  });
  it("edita itens planejados e não os envia para aprovação", () => {
    const props = { itens: [item], onEdit: vi.fn(), onApprove: vi.fn() };
    acaoItem(render(props)).props.onClick();
    expect(props.onEdit).toHaveBeenCalledExactlyOnceWith(item);
    expect(props.onApprove).not.toHaveBeenCalled();
  });
  it("informa falha de aprovação, bloqueia duplicidade e permite tentar novamente", async () => {
    let rejeitar;
    const props = { itens: [{ ...item, isUnplanned: true }], onEdit: vi.fn(), onApprove: vi.fn(() => new Promise((_, reject) => { rejeitar = reject; })) };
    const acao = acaoItem(render(props));
    const tentativa = acao.props.onClick();
    await acao.props.onClick();
    expect(props.onApprove).toHaveBeenCalledTimes(1);
    expect(acaoItem(render(props)).props.disabled).toBe(true);
    rejeitar({ code: "permission-denied", message: "detalhe privado" });
    await tentativa;
    const alerta = localizar(render(props), (no) => no.props?.role === "alert");
    expect(alerta.props.children).toContain("permissão");
    expect(alerta.props.children).not.toContain("detalhe privado");
    props.onApprove.mockResolvedValue();
    await acaoItem(render(props)).props.onClick();
    expect(props.onApprove).toHaveBeenCalledTimes(2);
    expect(localizar(render(props), (no) => no.props?.role === "alert")).toBeUndefined();
    expect(props.onEdit).not.toHaveBeenCalled();
  });
  it("aplica filtros e mantém a aba de próximos vencimentos na apresentação compartilhada", () => {
    const props = { itens: [item], proximosVencimentos: [{ id: "t", descricao: "Conta futura", data: "2026-10-30", valor: 120 }] };
    localizar(render(props), (no) => no.props?.['aria-label'] === "Buscar planejamento por categoria").props.onChange({ target: { value: "inexistente" } });
    expect(acaoItem(render(props))).toBeUndefined();
    localizar(render(props), (no) => no.props?.id === "planejamento-tab-proximos").props.onClick();
    expect(localizar(render(props), (no) => no.props?.id === "planejamento-painel-visao").props.hidden).toBe(true);
    expect(localizar(render(props), (no) => no.props?.id === "planejamento-painel-proximos").props.hidden).toBe(false);
  });
});
