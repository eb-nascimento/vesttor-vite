import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../config/firebase";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    const cancelarObservacao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregandoAuth(false);
    });
    return cancelarObservacao;
  }, []);
  return {
    usuario,
    carregandoAuth,
  };
}
