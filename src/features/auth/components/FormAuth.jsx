import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  enviarEmailRedefinicaoSenha,
  redefinirSenha,
} from "../../../services/authService";

import {
  cadastroUsuario,
  login,
  loginGoogle,
  obterMensagemErroAuth,
} from "../../../services/authService";
import "./FormAuth.css";

const estadosAuth = {
  "email-enviado": {
    titulo: "Confira seu e-mail",
    descricao: "Enviamos um link para você redefinir sua senha.",
    acao: "Voltar ao login",
  },
  "senha-redefinida": {
    titulo: "Senha redefinida",
    descricao: "Sua nova senha foi salva. Entre novamente para continuar.",
    acao: "Voltar ao login",
  },
  "link-expirado": {
    titulo: "Este link expirou",
    descricao:
      "O link é inválido ou já foi usado. Solicite outro para continuar.",
    acao: "Solicitar novo link",
    acaoSecundaria: "Voltar ao login",
  },
  "email-confirmado": {
    titulo: "E-mail confirmado",
    descricao: "Sua conta está pronta. Entre para continuar.",
    acao: "Voltar ao login",
  },
  "email-nao-confirmado": {
    titulo: "E-mail ainda não confirmado",
    descricao: "Confirme seu endereço de e-mail antes de entrar.",
    acao: "Reenviar e-mail",
    acaoSecundaria: "Voltar ao login",
  },
  "email-reenviado": {
    titulo: "E-mail reenviado",
    descricao: "Confira sua caixa de entrada e a pasta de spam.",
    acao: "Voltar ao login",
  },
};

function FormAuth({ modo = "login" }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const [confirmarSenha, setConfirmarSenha] = useState("");

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

  /**
   * Dispara o fluxo de envio do e-mail de recuperação de senha pelo Firebase.
   * Se houver sucesso, navega para a tela de aviso de e-mail enviado.
   */
  async function enviarLinkRedefinicaoSenha() {
    try {
      setErro("");
      await enviarEmailRedefinicaoSenha(email);
      // Redireciona para a tela de sucesso.
      navigate("/login?modo=email-enviado");
    } catch (erro) {
      setErro(obterMensagemErroAuth(erro.code));
    }
  }

  /**
   * Valida se as senhas coincidem, extrai o código (oobCode) da URL
   * e chama a função de comunicação com o Firebase para salvar a nova senha.
   */
  function salvarNovaSenha() {
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // Extrai os parâmetros de busca (?mode=...&oobCode=...) da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get("oobCode");

    if (!codigo) {
      setErro("Código de redefinição de senha ausente.");
      return;
    }

    redefinirSenhaUsuario(codigo, senha);
  }

  /**
   * Conclui a redefinição de senha utilizando o código fornecido.
   * Se houver sucesso, redireciona o usuário para a tela de sucesso.
   * @param {string} codigo - Código de segurança (oobCode) fornecido pelo Firebase via URL.
   * @param {string} novaSenha - A senha final escolhida pelo usuário.
   */
  async function redefinirSenhaUsuario(codigo, novaSenha) {
    try {
      setErro("");
      await redefinirSenha(codigo, novaSenha);
      // Redireciona para a tela de sucesso.
      navigate("/login?modo=senha-redefinida");
    } catch (erro) {
      setErro(obterMensagemErroAuth(erro.code));
    }
  }

  if (modo === "recuperar") {
    return (
      <section className="form-auth" aria-labelledby="titulo-recuperar-senha">
        <div className="auth-form-content">
          <h2 id="titulo-recuperar-senha">Recuperar senha</h2>
          {erro && (
            <p className="erro-msg" role="alert">
              {erro}
            </p>
          )}
          <p className="form-auth-description">
            Informe o e-mail da sua conta para receber o link de redefinição.
          </p>
          <form>
            <div className="form-item">
              <label htmlFor="email-recuperacao">E-mail</label>
              <input
                id="email-recuperacao"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="form-auth-primary"
              type="button"
              onClick={enviarLinkRedefinicaoSenha}
            >
              Enviar link
            </button>
            <Link className="form-auth-link" to="/login">
              Voltar ao login
            </Link>
          </form>
        </div>
      </section>
    );
  }

  if (modo === "redefinir") {
    return (
      <section className="form-auth" aria-labelledby="titulo-redefinir-senha">
        <div className="auth-form-content">
          <h2 id="titulo-redefinir-senha">Redefinir senha</h2>
          {erro && (
            <p className="erro-msg" role="alert">
              {erro}
            </p>
          )}
          <p className="form-auth-description">
            Crie uma nova senha segura para acessar sua conta.
          </p>
          <form>
            <div className="form-item">
              <label htmlFor="nova-senha">Nova senha</label>
              <input
                id="nova-senha"
                type="password"
                autoComplete="new-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="confirmar-senha">Confirmar nova senha</label>
              <input
                id="confirmar-senha"
                type="password"
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
            <button
              className="form-auth-primary"
              type="button"
              onClick={salvarNovaSenha}
            >
              Salvar nova senha
            </button>
            <Link className="form-auth-link" to="/login">
              Voltar ao login
            </Link>
          </form>
        </div>
      </section>
    );
  }

  const estado = estadosAuth[modo];

  if (estado) {
    const destinoPrincipal =
      modo === "link-expirado" || modo === "email-nao-confirmado"
        ? "/login?modo=recuperar"
        : "/login";

    return (
      <section className="form-auth" aria-labelledby="titulo-estado-auth">
        <div className="auth-form-content">
          <h2 id="titulo-estado-auth">{estado.titulo}</h2>
          <p className="form-auth-description">{estado.descricao}</p>
          <div className="auth-status-actions">
            <Link
              className="form-auth-link form-auth-primary"
              to={destinoPrincipal}
            >
              {estado.acao}
            </Link>
            {estado.acaoSecundaria && (
              <Link className="form-auth-link" to="/login">
                {estado.acaoSecundaria}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="form-auth">
      <div className="auth-form-content">
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
              placeholder="Senha"
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
          <Link className="form-auth-link" to="/login?modo=recuperar">
            Esqueci minha senha
          </Link>
        </form>
      </div>
    </section>
  );
}

export default FormAuth;
