import { useState } from "react";

import {
  cadastroUsuario,
  login,
  loginGoogle,
  obterMensagemErroAuth,
} from "../services/authService";
import "./FormAuth.css";

function FormAuth() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e) {
    // Impede o recarregamento nativo do formulario.
    e.preventDefault();

    try {
      setErro("");
      // Ao entrar, o Firebase atualiza automaticamente o observador em useAuth.
      await login(email, senha);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  async function loginComGoogle() {
    try {
      setErro("");
      await loginGoogle();
    } catch (erro) {
      setErro(obterMensagemErroAuth(erro.code));
    }
  }

  async function cadastrar() {
    try {
      setErro("");
      // O Firebase autentica o usuario logo depois de criar a conta.
      await cadastroUsuario(email, senha);
    } catch (erro) {
      setErro(erro.message);
    }
  }

  return (
    <section className="form-auth">
      <h2>Acessar conta</h2>
      <form onSubmit={entrar}>
        <div className="form-item">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && (
          <p className="erro-msg" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Entrar</button>
        <button type="button" onClick={loginComGoogle}>
          Entrar com Google
        </button>
        <button type="button" onClick={cadastrar}>
          Criar Conta
        </button>
      </form>
    </section>
  );
}

export default FormAuth;
