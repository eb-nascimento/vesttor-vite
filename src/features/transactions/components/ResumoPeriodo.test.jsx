import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ResumoPeriodo from "./ResumoPeriodo";

describe("cards do resultado filtrado", () => {
  it.each([
    [true, false, ["Receitas filtradas"], ["Despesas filtradas", "Resultado filtrado"]],
    [false, true, ["Despesas filtradas"], ["Receitas filtradas", "Resultado filtrado"]],
    [true, true, ["Receitas filtradas", "Despesas filtradas", "Resultado filtrado"], []],
    [false, false, [], ["Receitas filtradas", "Despesas filtradas", "Resultado filtrado"]],
  ])("natureza %s/%s determina os cards", (temReceitas, temDespesas, presentes, ausentes) => {
    const html = renderToStaticMarkup(<ResumoPeriodo quantidade={0} temReceitas={temReceitas} temDespesas={temDespesas} />);
    presentes.forEach((texto) => expect(html).toContain(texto));
    ausentes.forEach((texto) => expect(html).not.toContain(texto));
    expect(html).toContain("Movimentações");
  });
});
