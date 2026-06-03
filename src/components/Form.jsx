import { useState } from "react";
// import "./form.css";
import { criarTransacao } from "../utils/transacao";

function Form({ onAdd }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  function adicionarTransacao() {
    const nova = criarTransacao(descricao, valor, tipo);
    onAdd(nova);

    // Limpar os campos após adicionar
    setDescricao("");
    setValor("");
    setTipo("receita");
  }

  return (
    <section className="form-container">
      <h2>Nova Transação</h2>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <button onClick={adicionarTransacao}>Adicionar</button>
    </section>
  );
}

export default Form;
