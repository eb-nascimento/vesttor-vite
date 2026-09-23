import { useState, useEffect } from "react";
import { X, DollarSign, Tag } from "lucide-react";
import ModalBase from "./ui/ModalBase";
import CustomSelect from "./ui/CustomSelect";
import TipoSwitcher from "./ui/TipoSwitcher";
import { normalizarInputValor } from "../utils/transacao";
import "./ModalFormTransacao.css";
import "./ModalFormPlanejamento.css";
import "./Form.css";

const CATEGORIAS = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Contas & Serviços",
  "Salário",
  "Investimentos",
  "Freelance",
  "Reembolso",
  "Outros",
];

function ModalFormPlanejamento({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  mesAno,
  itemEditando,
}) {
  const [form, setForm] = useState({
    categoria: "Alimentação",
    tipo: "Variável",
    planejado: "",
  });

  useEffect(() => {
    if (itemEditando) {
      setForm({
        categoria: itemEditando.categoria,
        tipo: itemEditando.tipo,
        planejado: itemEditando.planejado.toString(),
      });
    } else {
      setForm({ categoria: "Alimentação", tipo: "Variável", planejado: "" });
    }
  }, [itemEditando, isOpen]);

  const atualizarCampo = (campo, valor) => {
    if (campo === "planejado") {
      setForm({ ...form, [campo]: normalizarInputValor(valor) });
    } else {
      setForm({ ...form, [campo]: valor });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valorNumerico = Number(String(form.planejado).replace(",", "."));

    if (itemEditando && !itemEditando.isUnplanned) {
      await onUpdate(itemEditando.id, {
        categoria: form.categoria,
        tipo: form.tipo,
        planejado: valorNumerico,
      });
    } else {
      await onSave({
        categoria: form.categoria,
        tipo: form.tipo,
        planejado: valorNumerico,
        mesAno,
      });
    }

    setForm({ categoria: "Alimentação", tipo: "Variável", planejado: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledby="modal-form-planejamento"
    >
      <div className="modal-planejamento-content">
        <button
          className="btn-fechar-modal"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>
        <section className="form-container">
          <div className="form-header">
            <h2>Novo Orçamento</h2>
            <p className="form-subtitulo">
              Defina um limite de gastos ou meta de receita.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="categoria">
                <Tag size={13} aria-hidden="true" />
                Categoria
              </label>
              <CustomSelect
                id="categoria"
                value={form.categoria}
                onChange={(val) => atualizarCampo("categoria", val)}
                options={CATEGORIAS.map((cat) => ({
                  valor: cat,
                  label: cat,
                }))}
              />
            </div>

            <div className="form-item">
              <label htmlFor="planejado">
                <DollarSign size={13} aria-hidden="true" />
                Valor Planejado
              </label>
              <div className="input-valor-wrapper">
                <span className="input-moeda-prefix">R$</span>
                <input
                  id="planejado"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.planejado}
                  onChange={(e) => atualizarCampo("planejado", e.target.value)}
                  className="input-valor-field"
                  required
                />
              </div>
            </div>

            <div className="form-acoes">
              <button type="submit" className="btn-submit">
                Salvar Orçamento
              </button>
            </div>
          </form>
        </section>
      </div>
    </ModalBase>
  );
}

export default ModalFormPlanejamento;
