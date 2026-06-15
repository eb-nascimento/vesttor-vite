import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
