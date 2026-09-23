import { useEffect, useState } from "react";
import {
  onPlanejamentoChange,
  criarPlanejamentoNaApi,
  atualizarPlanejamentoNaApi,
} from "../services/planejamentoService";

export function usePlanejamentos(userId) {
  const [planejamentos, setPlanejamentos] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Chama a função onPlanejamentoChange para ouvir mudanças nos planejamentos do usuário
    const unsubscribe = onPlanejamentoChange(userId, (dados) => {
      setPlanejamentos(dados);
    });

    // Limpa o listener quando o componente for desmontado ou quando o userId mudar
    return () => unsubscribe();
  }, [userId]);

  async function criarPlanejamento(novoPlanejamento) {
    await criarPlanejamentoNaApi(novoPlanejamento, userId);
  }

  async function atualizarPlanejamento(id, dados) {
    await atualizarPlanejamentoNaApi(id, dados);
  }
  return { planejamentos, criarPlanejamento, atualizarPlanejamento };
}
