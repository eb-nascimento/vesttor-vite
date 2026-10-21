import { useEffect, useState } from "react";
import { obterMensagemErroFirestore } from "../utils/errosFirestore";
import {
  onPlanejamentoChange,
  criarPlanejamentoNaApi,
  atualizarPlanejamentoNaApi,
} from "../services/planejamentoService";

export function usePlanejamentos(userId, mesAno) {
  const [planejamentos, setPlanejamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLeitura, setErroLeitura] = useState("");
  const [tentativaLeitura, setTentativaLeitura] = useState(0);
  const [mesCarregado, setMesCarregado] = useState(mesAno);

  useEffect(() => {
    if (!userId) return;

    // Chama a função onPlanejamentoChange para ouvir mudanças nos planejamentos do usuário
    const unsubscribe = onPlanejamentoChange(userId, (dados) => {
      setPlanejamentos(dados);
      setMesCarregado(mesAno);
      setErroLeitura("");
      setCarregando(false);
    }, (erro) => {
      setErroLeitura(obterMensagemErroFirestore(erro));
      setMesCarregado(mesAno);
      setCarregando(false);
    }, mesAno);

    // Limpa o listener quando o componente for desmontado ou quando o userId mudar
    return () => unsubscribe();
  }, [userId, tentativaLeitura, mesAno]);

  async function criarPlanejamento(novoPlanejamento) {
    await criarPlanejamentoNaApi(novoPlanejamento, userId);
  }

  async function atualizarPlanejamento(id, dados) {
    await atualizarPlanejamentoNaApi(id, dados, userId);
  }
  function tentarNovamente() {
    setCarregando(true);
    setErroLeitura("");
    setTentativaLeitura((tentativa) => tentativa + 1);
  }
  return { planejamentos, criarPlanejamento, atualizarPlanejamento, carregando: carregando || mesCarregado !== mesAno, erroLeitura, tentarNovamente };
}
