import { useEffect, useState } from "react";
import {
  onPlanejamentoChange,
  criarPlanejamento,
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
    await criarPlanejamento(novoPlanejamento, userId);
  }
  return { planejamentos, criarPlanejamento };
}
