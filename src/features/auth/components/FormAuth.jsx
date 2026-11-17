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
import LogoHorizontal from "../../../components/ui/logos/LogoHorizontal";
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  async function entrar(e) {
    // Impede o recarregamento nativo do formulario.
    e.preventDefault();

    try {
      setErro("");
      // Ao entrar, o Firebase atualiza automaticamente o observador em useAuth.
      await login(email, senha);
    } catch (erro) {
      setErro(obterMensagemErroAuth(erro.code));
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

  async function cadastrar(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    try {
      setErro("");
      // O Firebase autentica o usuario logo depois de criar a conta.
      await cadastroUsuario(email, senha);
    } catch (erro) {
      setErro(obterMensagemErroAuth(erro.code));
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

  const cadastro = modo === "cadastro";

  return (
    <main className={`auth-page ${cadastro ? "auth-page--cadastro" : "auth-page--login"}`}>
      <div className="auth-glow" aria-hidden="true" />
      <header className="auth-header">
        <div className="auth-brand" role="img" aria-label="Vesttor"><LogoHorizontal /></div>
        {!cadastro && <span className="auth-badge auth-mobile-badge">SEGURO</span>}
      </header>
      <aside className="auth-intro">
        <span className="auth-badge">ACESSO VESTTOR</span>
        <h1>Comece com uma<br />visão mais clara.</h1>
        <p>Crie sua conta para organizar transações, metas e decisões em um só lugar.</p>
        <div className="auth-privacy"><span aria-hidden="true">✓</span><div><strong>Privacidade por padrão</strong><p>Seus dados ficam protegidos e só você controla o acesso.</p></div></div>
        <p className="auth-intro-footer">Uma experiência segura, simples e direta.</p>
      </aside>
      <section className="form-auth auth-card" aria-labelledby="auth-title">
        <div className="auth-form-content">
          <h2 id="auth-title">{cadastro ? "Criar conta" : "Entrar"}</h2>
          <p className="form-auth-description">{cadastro ? "Leva menos de um minuto." : "Controle financeiro com menos ruído."}</p>
          <form onSubmit={cadastro ? cadastrar : entrar}>
            {cadastro && <div className="form-item"><label htmlFor="nome">Nome</label><input id="nome" autoComplete="name" placeholder="Seu nome" /></div>}
            <div className="form-item">
              <label htmlFor="email">E-mail</label>
              <input id="email" required type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-item">
              <label htmlFor="senha">Senha</label>
              <div className="auth-password"><input id="senha" required type={mostrarSenha ? "text" : "password"} autoComplete={cadastro ? "new-password" : "current-password"} placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} /><button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button></div>
            </div>
            {cadastro ? <>
              <div className="form-item"><label htmlFor="confirmar-cadastro">Confirmar senha</label><div className="auth-password"><input id="confirmar-cadastro" required type={mostrarConfirmacao ? "text" : "password"} autoComplete="new-password" placeholder="Confirme sua senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} /><button type="button" onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)} aria-label={mostrarConfirmacao ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}>{mostrarConfirmacao ? "Ocultar" : "Mostrar"}</button></div></div>
              <label className="auth-terms"><input type="checkbox" required /> <span>Li e aceito os termos e a política de privacidade.</span></label>
            </> : <Link className="auth-forgot" to="/login?modo=recuperar">Esqueci minha senha</Link>}
            {erro && <p className="erro-msg" role="alert">{erro}</p>}
            <button className="auth-submit" type="submit">{cadastro ? "Criar minha conta" : "Entrar"}</button>
            {!cadastro && <><div className="auth-divider"><span>ou</span></div><button className="auth-google" type="button" onClick={loginComGoogle}><span aria-hidden="true">G</span>Continuar com Google</button></>}
            <p className="auth-switch">{cadastro ? "Já possui conta?" : "Não tem conta?"} <Link to={cadastro ? "/login" : "/login?modo=cadastro"}>{cadastro ? "Entrar" : "Criar conta"}</Link></p>
            {!cadastro && <p className="auth-disclaimer">Ao entrar, você concorda com os termos e a política de privacidade.</p>}
          </form>
        </div>
      </section>
      {!cadastro && <footer className="auth-footer">© 2026 Vesttor</footer>}
    </main>
  );
}

export default FormAuth;
