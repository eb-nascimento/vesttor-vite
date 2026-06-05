import { useEffect, useState } from "react";
// import "./form.css";
import { criarTransacao } from "../utils/transacao";

function Form({ onAdd, onEdit, transacaoEditando, cancelarEdicao }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  useEffect(() => {
    if (transacaoEditando) {
      setDescricao(transacaoEditando.descricao);
      setValor(transacaoEditando.valor);
      setTipo(transacaoEditando.tipo);
    } else {
      setDescricao("");
      setValor("");
      setTipo("receita");
    }
  }, [transacaoEditando]);

  function salvar() {
    if (transacaoEditando) {
      onEdit(transacaoEditando.id, {
        descricao,
        valor: Number(valor),
        tipo,
      });
      onEdit(cancelarEdicao);
    } else {
      const nova = criarTransacao(descricao, valor, tipo);
      onAdd(nova);
    }
    setDescricao("");
    setValor("");
    setTipo("receita");
  }

  return (
    <section className="form-container">
      <h2>{transacaoEditando ? "Editar Transação" : "Nova Transação"}</h2>
      <form onSubmit={salvar}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button
          style={{ display: transacaoEditando ? "block" : "none" }}
          onClick={cancelarEdicao}
        >
          Cancelar
        </button>

        <button type="submit">
          {transacaoEditando ? "Salvar Alterações" : "Adicionar"}
        </button>
      </form>
    </section>
  );
}

export default Form;
