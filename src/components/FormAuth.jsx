import { useState } from "react";

import { cadastroUsuario, login } from "../services/authService";

function FormAuth() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e) {
    e.preventDefault();

    try {
      setErro("");
      await login(email, senha);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  async function cadastrar() {
    try {
      setErro("");
      await cadastroUsuario(email, senha);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  return (
    <section className="form-auth">
      <h2>Acessar conta</h2>
      <form onSubmit={entrar}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="erro-msg">{erro}</p>}

        <button type="submit">Entrar</button>
        <button type="button" onClick={cadastrar}>
          Criar Conta
        </button>
      </form>
    </section>
  );
}

export default FormAuth;
