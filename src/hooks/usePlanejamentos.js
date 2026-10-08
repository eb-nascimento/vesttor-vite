import { useEffect, useState } from "react";
import { obterMensagemErroFirestore } from "../utils/errosFirestore";
import {
  onPlanejamentoChange,
  criarPlanejamentoNaApi,
  atualizarPlanejamentoNaApi,
} from "../services/planejamentoService";

export function usePlanejamentos(userId) {
  const [planejamentos, setPlanejamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLeitura, setErroLeitura] = useState("");
  const [tentativaLeitura, setTentativaLeitura] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Chama a função onPlanejamentoChange para ouvir mudanças nos planejamentos do usuário
    const unsubscribe = onPlanejamentoChange(userId, (dados) => {
      setPlanejamentos(dados);
      setErroLeitura("");
      setCarregando(false);
    }, (erro) => {
      setErroLeitura(obterMensagemErroFirestore(erro));
      setCarregando(false);
    });

    // Limpa o listener quando o componente for desmontado ou quando o userId mudar
    return () => unsubscribe();
  }, [userId, tentativaLeitura]);

  async function criarPlanejamento(novoPlanejamento) {
    await criarPlanejamentoNaApi(novoPlanejamento, userId);
  }

  async function atualizarPlanejamento(id, dados) {
    await atualizarPlanejamentoNaApi(id, dados);
  }
  function tentarNovamente() {
    setCarregando(true);
    setErroLeitura("");
    setTentativaLeitura((tentativa) => tentativa + 1);
  }
  return { planejamentos, criarPlanejamento, atualizarPlanejamento, carregando, erroLeitura, tentarNovamente };
}
