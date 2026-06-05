import { useEffect, useState } from "react";
// import "./form.css";
import { criarTransacao } from "../utils/transacao";

function Form({ onAdd, onEdit, transacaoEditando, cancelarEdicao }) {
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  useEffect(() => {
    if (transacaoEditando) {
      setData(transacaoEditando.data);
      setDescricao(transacaoEditando.descricao);
      setValor(transacaoEditando.valor);
      setTipo(transacaoEditando.tipo);
    } else {
      setData(new Date().toISOString().split("T")[0]);
      setDescricao("");
      setValor("");
      setTipo("receita");
    }
  }, [transacaoEditando]);

  function salvar(e) {
    e.preventDefault();
    if (transacaoEditando) {
      onEdit(transacaoEditando.id, {
        data,
        descricao,
        valor: Number(valor),
        tipo,
      });
      cancelarEdicao();
    } else {
      const nova = criarTransacao(data, descricao, valor, tipo);
      onAdd(nova);
    }
    setData(new Date().toISOString().split("T")[0]);
    setDescricao("");
    setValor("");
    setTipo("receita");
  }

  return (
    <section className="form-container">
      <h2>{transacaoEditando ? "Editar Transação" : "Nova Transação"}</h2>
      <form onSubmit={salvar}>
        <input
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
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
