import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { METODOS_PAGAMENTO } from "../data/metodosPagamento";
import "./Categories.css";
import "./Payments.css";

const normalizar = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const tipos = [...new Set(METODOS_PAGAMENTO.map(metodo => metodo.tipo))];
export default function Payments() {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [filtros, setFiltros] = useState(false);
  const visiveis = METODOS_PAGAMENTO.filter(metodo => normalizar(metodo.label).includes(normalizar(busca.trim())) && (tipo === "Todos" || metodo.tipo === tipo));
  return <section className="categories-page payments-page">
    <PageHeader title="Métodos de pagamento" subtitle="Conheça as formas disponíveis para suas transações."><Button disabled title="Disponível em uma implementação futura">+ Novo método</Button></PageHeader>
    <div className="categories-summary" aria-label="Resumo dos métodos">
      <div><span>Total</span><strong>{METODOS_PAGAMENTO.length} métodos</strong></div>
      <div><span>Ativos</span><strong>{METODOS_PAGAMENTO.length}</strong></div>
      <div><span>Tipos</span><strong>{tipos.length}</strong></div>
      <div><span>Cartões</span><strong>{METODOS_PAGAMENTO.filter(metodo => metodo.label.startsWith("Cartão")).length} opções</strong></div>
    </div>
    <div className="categories-search"><Input aria-label="Buscar método" placeholder="Buscar método" value={busca} onChange={event => setBusca(event.target.value)} /><button type="button" aria-label="Abrir filtros" aria-expanded={filtros} aria-controls="payments-filters" onClick={() => setFiltros(!filtros)}><img src="/images/categories/filter.svg" width="20" height="20" alt="" /></button></div>
    {filtros && <div id="payments-filters" className="categories-select"><label htmlFor="payment-type">Tipo</label><Select id="payment-type" value={tipo} onChange={event => setTipo(event.target.value)}>{["Todos", ...tipos].map(item => <option key={item}>{item}</option>)}</Select></div>}
    <h3>Todos os métodos</h3><p className="categories-subtitle">Métodos padrão disponíveis nas transações.</p>
    <div className="categories-list"><div className="category-columns"><span>Método</span><span>Tipo</span><span>Status</span></div>
      {visiveis.map(metodo => <article className="category-row" key={metodo.valor}><div className="category-name"><span className="payment-initial">{metodo.label[0]}</span><div><h4>{metodo.label}</h4><small>Universal</small></div></div><span className="category-type">{metodo.tipo}</span><span className="category-status active">Ativo</span></article>)}
      {!visiveis.length && <p className="categories-empty" role="status">Nenhum método encontrado. Ajuste a busca ou os filtros.</p>}
    </div>
    <p className="categories-preview">Neste MVP, utilize os métodos pré-cadastrados. Criação e gerenciamento estarão disponíveis futuramente.</p>
  </section>;
}
