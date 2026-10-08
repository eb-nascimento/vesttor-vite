import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import PageHeader from "./PageHeader";
import "./EmConstrucao.css";
import "./Button.css";

export default function EmConstrucao({ titulo, descricao }) {
  return (
    <section className="construcao-page">
      <PageHeader title={titulo} />
      <div className="construcao-card">
        <div className="construcao-icone"><Construction size={40} aria-hidden="true" /></div>
        <span className="construcao-etiqueta">Em construção</span>
        <h2>Estamos preparando esta área</h2>
        <p>{descricao} Esta funcionalidade ainda não está disponível.</p>
        <Link to="/home" className="btn-ui btn-ui-primary construcao-retorno">
          <ArrowLeft size={18} aria-hidden="true" /> Voltar para o início
        </Link>
      </div>
    </section>
  );
}
