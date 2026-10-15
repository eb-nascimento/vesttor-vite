import { useRef, useState } from "react";
import { obterMensagemErroFirestore } from "../utils/errosFirestore";

// O ref bloqueia também cliques ocorridos antes do próximo render.
export function useOperacaoAssincrona(mensagemErro) {
  const emCurso = useRef(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  async function executar(operacao) {
    if (emCurso.current) return false;
    emCurso.current = true;
    setProcessando(true);
    setErro("");
    try {
      await operacao();
      return true;
    } catch (falha) {
      setErro(obterMensagemErroFirestore(falha, mensagemErro));
      return false;
    } finally {
      emCurso.current = false;
      setProcessando(false);
    }
  }

  return { processando, erro, executar, emCurso };
}
