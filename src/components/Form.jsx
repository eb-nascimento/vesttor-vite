import "./Form.css";
import { useState } from "react";
import { criarTransacao, validarTransacao } from "../utils/transacao";

function obterDataAtual() {
  return new Date().toISOString().split("T")[0];
}

function criarEstadoInicial(transacaoEditando) {
  if (transacaoEditando) {
    return {
      data: transacaoEditando.data.toDate().toISOString().split("T")[0],
      descricao: transacaoEditando.descricao,
      valor: transacaoEditando.valor,
      tipo: transacaoEditando.tipo,
      erro: "",
    };
  }

  return {
    data: obterDataAtual(),
    descricao: "",
    valor: "",
    tipo: "receita",
    erro: "",
  };
}

function Form({ onAdd, onEdit, transacaoEditando, cancelarEdicao }) {
  const [form, setForm] = useState(() => criarEstadoInicial(transacaoEditando));

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function salvar(e) {
    e.preventDefault();

    // A util retorna uma mensagem ou string vazia quando os dados sao validos.
    const mensagemErro = validarTransacao({
      data: form.data,
      descricao: form.descricao,
      valor: form.valor,
      tipo: form.tipo,
    });

    if (mensagemErro) {
      atualizarCampo("erro", mensagemErro);
      return;
    }

    atualizarCampo("erro", "");

    if (transacaoEditando) {
      // A existencia de transacaoEditando define o modo de edicao.
      onEdit(transacaoEditando.id, {
        data: form.data,
        descricao: form.descricao,
        valor: Number(form.valor),
        tipo: form.tipo,
      });
      cancelarEdicao();
    } else {
      // No modo de criacao, o util monta o objeto antes de envia-lo ao hook.
      const nova = criarTransacao(
        form.data,
        form.descricao,
        form.valor,
        form.tipo,
      );
      onAdd(nova);
    }

    // Limpa o formulario depois de uma operacao valida.
    setForm({
      data: obterDataAtual(),
      descricao: "",
      valor: "",
      tipo: "receita",
      erro: "",
    });
  }

  return (
    <section className="form-container">
      <h2>{transacaoEditando ? "Editar Transação" : "Nova Transação"}</h2>
      <form onSubmit={salvar}>
        <input
          type="date"
          placeholder="Data"
          value={form.data}
          onChange={(e) => atualizarCampo("data", e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => atualizarCampo("descricao", e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => atualizarCampo("valor", e.target.value)}
        />

        <select
          value={form.tipo}
          onChange={(e) => atualizarCampo("tipo", e.target.value)}
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button
          type="button"
          style={{ display: transacaoEditando ? "block" : "none" }}
          onClick={cancelarEdicao}
        >
          Cancelar
        </button>

        {form.erro && <p className="erro-msg">{form.erro}</p>}

        <button type="submit">
          {transacaoEditando ? "Salvar Alterações" : "Adicionar"}
        </button>
      </form>
    </section>
  );
}

export default Form;
