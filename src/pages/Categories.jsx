import Select from "../components/ui/Select";
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModalBase from "../components/ui/ModalBase";
import "./Categories.css";
const dados = ["Alimentação", "Moradia", "Transporte", "Salário"].map(
  (nome, i) => ({
    id: nome,
    nome,
    tipo: i === 3 ? "Receitas" : "Despesas",
    ativa: true,
    registros: [24, 8, 16, 6][i],
    cor: [
      "var(--color-error)",
      "var(--color-accent)",
      "var(--color-warning)",
      "var(--color-growth)",
    ][i],
    universal: true,
  }),
);
export default function Categories() {
  const [categorias, setCategorias] = useState(dados);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("Todas");
  const [filtros, setFiltros] = useState(false);
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState("");
  const fechar = () => {
    setForm(null);
    setErro("");
  };
  function salvar(e) {
    e.preventDefault();
    const nome = form.nome.trim();
    if (
      !nome ||
      categorias.some(
        (c) =>
          c.id !== form.id &&
          c.nome.localeCompare(nome, "pt-BR", { sensitivity: "base" }) === 0,
      )
    ) {
      setErro("Informe um nome único.");
      return;
    }
    setCategorias((atual) =>
      form.id
        ? atual.map((c) => (c.id === form.id ? { ...form, nome } : c))
        : [...atual, { ...form, nome, id: crypto.randomUUID() }],
    );
    fechar();
  }
  return (
    <section className="categories-page">
      <PageHeader
        title="Categorias"
        subtitle="Organize receitas e despesas para entender melhor seus gastos."
      >
        <Button disabled title="Disponível em uma implementação futura" onClick={() =>
            setForm({
              nome: "",
              tipo: "Despesas",
              ativa: true,
              cor: "var(--color-growth)",
              registros: 0,
              universal: false,
            })
          }
        >
          + Nova categoria
        </Button>
      </PageHeader>
      <div className="categories-summary">
        {[
          ["Total", `${categorias.length} categorias`],
          ["Ativas", categorias.filter((c) => c.ativa).length],
          [
            "De despesa",
            categorias.filter((c) => c.tipo !== "Receitas").length,
          ],
          [
            "De receita",
            categorias.filter((c) => c.tipo !== "Despesas").length,
          ],
        ].map(([label, valor]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{valor}</strong>
          </div>
        ))}
      </div>
      <div className="categories-search">
        <Input
          aria-label="Buscar categoria"
          placeholder="Buscar categoria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          aria-label="Abrir filtros"
          aria-expanded={filtros}
          onClick={() => setFiltros(!filtros)}
        >
          <img
            src="/images/categories/filter.svg"
            width="20"
            height="20"
            alt=""
          />
        </button>
      </div>
      {filtros && (
        <label className="categories-select">
          Tipo
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {["Todas", "Despesas", "Receitas", "Ambas"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </label>
      )}
      <h3>Todas as categorias</h3>
      <p className="categories-subtitle">
        Categorias ativas e inativas da sua conta.
      </p>
      <div className="categories-list">
        <div className="category-columns">
          <span>Categoria</span>
          <span>Tipo</span>
          <span>Status</span>
          <span>Transações</span>
          <span hidden>Ações</span>
        </div>
        {categorias
          .filter(
            (c) =>
              c.nome.toLocaleLowerCase().includes(busca.toLocaleLowerCase()) &&
              (tipo === "Todas" || c.tipo === tipo || c.tipo === "Ambas"),
          )
          .map((c) => (
            <article className="category-row" key={c.id}>
              <div className="category-name">
                <span style={{ color: c.cor }}>{c.nome[0]}</span>
                <div>
                  <h4>{c.nome}</h4>
                  <small>{c.universal ? "Universal" : "Personalizada"}</small>
                </div>
              </div>
              <span className="category-type">{c.tipo}</span>
              <span className={`category-status ${c.ativa ? "active" : ""}`}>
                {c.ativa ? "Ativa" : c.universal ? "Oculta" : "Inativa"}
              </span>
              <span className="category-count">{c.registros} registros</span>
              <div className="category-actions" hidden>
                {!c.universal && (
                  <button onClick={() => setForm({ ...c })}>Editar</button>
                )}
                <button onClick={() =>
                    setCategorias((atual) =>
                      atual.map((item) =>
                        item.id === c.id
                          ? { ...item, ativa: !item.ativa }
                          : item,
                      ),
                    )
                  }
                >
                  {c.ativa
                    ? c.universal
                      ? "Ocultar"
                      : "Desativar"
                    : "Reativar"}
                </button>
              </div>
            </article>
          ))}
        {!categorias.some(
          (c) =>
            c.nome.toLocaleLowerCase().includes(busca.toLocaleLowerCase()) &&
            (tipo === "Todas" || c.tipo === tipo || c.tipo === "Ambas"),
        ) && (
          <p className="categories-empty">
            Nenhuma categoria encontrada. Ajuste a busca ou os filtros.
          </p>
        )}
      </div>
      <p className="categories-preview">
        Prévia com dados de exemplo. Criação e gerenciamento de categorias estarão disponíveis futuramente.
      </p>
      <ModalBase
        isOpen={!!form}
        onClose={fechar}
        ariaLabelledby="category-title"
      >
        {form && (
          <form className="category-form" onSubmit={salvar}>
            <h3 id="category-title">
              {form.id ? "Editar categoria" : "Nova categoria"}
            </h3>
            <Input
              label="Nome"
              placeholder="Informe o nome"
              required
              maxLength={60}
              value={form.nome}
              error={erro}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <label>
              Tipo
              <Select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                {["Despesas", "Receitas", "Ambas"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
            </label>
            <label>
              Cor
              <Select
                value={form.cor}
                onChange={(e) => setForm({ ...form, cor: e.target.value })}
              >
                {[
                  ["Verde", "growth"],
                  ["Azul", "accent"],
                  ["Vermelho", "error"],
                  ["Amarelo", "warning"],
                ].map(([nome, token]) => (
                  <option key={token} value={`var(--color-${token})`}>
                    {nome}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Status
              <Select
                value={form.ativa ? "Ativa" : "Inativa"}
                onChange={(e) =>
                  setForm({ ...form, ativa: e.target.value === "Ativa" })
                }
              >
                <option>Ativa</option>
                <option>Inativa</option>
              </Select>
            </label>
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="secondary" onClick={fechar}>
              Cancelar
            </Button>
          </form>
        )}
      </ModalBase>
    </section>
  );
}




