import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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

export function obterMensagemErroAuth(codigo) {
  if (codigo === "auth/invalid-credential") {
    return "E-mail ou senha inválidos.";
  }

  if (codigo === "auth/email-already-in-use") {
    return "Este e-mail já está cadastrado.";
  }

  if (codigo === "auth/popup-closed-by-user") {
    return "Login com Google cancelado.";
  }

  return "Não foi possível concluir a autenticação. Tente novamente.";
}
