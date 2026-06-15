import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../config/firebase";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    // Executa ao iniciar e sempre que o estado da sessao mudar.
    const cancelarObservacao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregandoAuth(false);
    });

    // Remove o observador quando o componente for desmontado.
    return cancelarObservacao;
  }, []);
  return {
    usuario,
    carregandoAuth,
  };
}
