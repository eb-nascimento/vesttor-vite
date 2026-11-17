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
 * Traduz os códigos de erro padrão do Firebase para mensagens amigáveis em português.
 * @param {string} codigo - O código de erro retornado pelo Firebase (ex: 'auth/invalid-credential').
 * @returns {string} Mensagem de erro traduzida para exibir ao usuário.
 */
export function obterMensagemErroAuth(codigo) {
  if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(codigo)) {
    return "E-mail ou senha inválidos.";
  }

  if (codigo === "auth/invalid-email") {
    return "Informe um e-mail válido.";
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
    return "Não foi possível conectar. Verifique sua conexão e tente novamente.";
  }

  if (codigo === "auth/email-already-in-use") {
    return "Este e-mail já está cadastrado.";
  }

  if (codigo === "auth/popup-closed-by-user") {
    return "Login com Google cancelado.";
  }

  return "Não foi possível concluir a autenticação. Tente novamente.";
}

/**
 * Envia um e-mail para o usuário contendo um link para redefinição de senha.
 * @param {string} email - O endereço de e-mail da conta do usuário.
 */
export function enviarEmailRedefinicaoSenha(email) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Verifica se o código de redefinição de senha (oobCode) presente no link é válido e não expirou.
 * @param {string} codigo - O código criptografado extraído da URL (oobCode).
 */
export function verificarCodigoRedefinicaoSenha(codigo) {
  return verifyPasswordResetCode(auth, codigo);
}

/**
 * Conclui o processo de recuperação atualizando a senha do usuário no banco de dados.
 * @param {string} codigo - O código criptografado extraído da URL (oobCode).
 * @param {string} novaSenha - A nova senha escolhida pelo usuário.
 */
export function redefinirSenha(codigo, novaSenha) {
  return confirmPasswordReset(auth, codigo, novaSenha);
}
