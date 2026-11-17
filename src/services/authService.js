import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

import { auth } from "../config/firebase";

// Cria a conta e autentica o novo usuario automaticamente.
export function cadastroUsuario(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

// Inicia uma sessao usando email e senha.
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

// Encerra a sessao atual; useAuth recebera usuario null em seguida.
export function logout() {
  return signOut(auth);
}

// Inicia uma sessao usando o provedor do Google.
export function loginGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Traduz os c�digos de erro padr�o do Firebase para mensagens amig�veis em portugu�s.
 * @param {string} codigo - O c�digo de erro retornado pelo Firebase (ex: 'auth/invalid-credential').
 * @returns {string} Mensagem de erro traduzida para exibir ao usu�rio.
 */
export function obterMensagemErroAuth(codigo) {
  if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(codigo)) {
    return "E-mail ou senha inv�lidos.";
  }

  if (codigo === "auth/invalid-email") {
    return "Informe um e-mail v�lido.";
  }
  if (codigo === "auth/missing-password") {
    return "Informe sua senha.";
  }
  if (codigo === "auth/weak-password") {
    return "Use uma senha com pelo menos seis caracteres.";
  }
  if (codigo === "auth/too-many-requests") {
    return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  }
  if (codigo === "auth/network-request-failed") {
    return "N�o foi poss�vel conectar. Verifique sua conex�o e tente novamente.";
  }

  if (codigo === "auth/email-already-in-use") {
    return "Este e-mail j� est� cadastrado.";
  }

  if (codigo === "auth/popup-closed-by-user") {
    return "Login com Google cancelado.";
  }

  return "N�o foi poss�vel concluir a autentica��o. Tente novamente.";
}

/**
 * Envia um e-mail para o usu�rio contendo um link para redefini��o de senha.
 * @param {string} email - O endere�o de e-mail da conta do usu�rio.
 */
export function enviarEmailRedefinicaoSenha(email) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Verifica se o c�digo de redefini��o de senha (oobCode) presente no link � v�lido e n�o expirou.
 * @param {string} codigo - O c�digo criptografado extra�do da URL (oobCode).
 */
export function verificarCodigoRedefinicaoSenha(codigo) {
  return verifyPasswordResetCode(auth, codigo);
}

/**
 * Conclui o processo de recupera��o atualizando a senha do usu�rio no banco de dados.
 * @param {string} codigo - O c�digo criptografado extra�do da URL (oobCode).
 * @param {string} novaSenha - A nova senha escolhida pelo usu�rio.
 */
export function redefinirSenha(codigo, novaSenha) {
  return confirmPasswordReset(auth, codigo, novaSenha);
}
