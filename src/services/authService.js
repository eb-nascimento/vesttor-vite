import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

export function cadastroUsuario(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function logout() {
  return signOut(auth);
}
