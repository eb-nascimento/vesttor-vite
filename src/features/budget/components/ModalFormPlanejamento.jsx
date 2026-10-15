/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, DollarSign, Tag } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import CustomSelect from "../../../components/ui/CustomSelect";

import { normalizarInputValor } from "../../../utils/transacao";
import "../../../features/transactions/components/ModalFormTransacao.css";
import "./ModalFormPlanejamento.css";
import "../../../features/transactions/components/FormTransacao.css";
import { useOperacaoAssincrona } from "../../../hooks/useOperacaoAssincrona";

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
  const { processando, erro, executar, emCurso } = useOperacaoAssincrona(
    "Não foi possível salvar o orçamento. Seus dados foram preservados. Tente novamente.",
  );
  const fechar = () => { if (!emCurso.current) onClose(); };
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
    if (emCurso.current) return;
    if (campo === "planejado") {
      setForm({ ...form, [campo]: normalizarInputValor(valor) });
    } else {
      setForm({ ...form, [campo]: valor });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valorNumerico = Number(String(form.planejado).replace(",", "."));

    const sucesso = await executar(async () => {
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
    });
    if (!sucesso) return;

    setForm({ categoria: "Alimentação", tipo: "Variável", planejado: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={fechar}
      ariaLabelledby="modal-form-planejamento"
    >
      <div className="modal-planejamento-content">
        <button
          className="btn-fechar-modal"
          onClick={fechar}
          disabled={processando}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>
        <section className="form-container">
          <div className="form-header">
            <h2 id="modal-form-planejamento">{itemEditando ? "Editar Orçamento" : "Novo Orçamento"}</h2>
            <p className="form-subtitulo">
              Defina um limite de gastos ou meta de receita.
            </p>
          </div>

          <form onSubmit={handleSubmit} aria-busy={processando}>
            <fieldset disabled={processando} className="form-campos">
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
              <button type="submit" className="btn-submit" disabled={processando}>
                {processando ? "Salvando..." : "Salvar Orçamento"}
              </button>
            </div>
            </fieldset>
            {erro && <p className="erro-msg" role="alert">{erro}</p>}
          </form>
        </section>
      </div>
    </ModalBase>
  );
}

export default ModalFormPlanejamento;
