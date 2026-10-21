export function paraCentavos(valor) {
  const numero = Number(String(valor).replace(",", "."));
  if (!Number.isFinite(numero) || numero < 0) throw new Error("Valor monetário inválido");
  const centavos = Math.round((numero + Number.EPSILON) * 100);
  if (!Number.isSafeInteger(centavos)) throw new Error("Valor monetário fora do limite");
  return centavos;
}

export function centavosDoItem(item, campo = "valor") {
  const nome = campo === "planejado" ? "planejadoCentavos" : campo === "valorTotalCompra" ? "valorTotalCentavos" : "valorCentavos";
  const valor = item[nome];
  if (valor !== undefined) {
    if (!Number.isSafeInteger(valor) || valor < 0) throw new Error("Centavos inválidos");
    return valor;
  }
  return paraCentavos(item[campo] ?? 0);
}

export function serializarDinheiro(dados, planejamento = false) {
  const resultado = { ...dados };
  const campos = planejamento ? ["planejado"] : ["valor", "valorTotalCompra"];
  for (const campo of campos) {
    if (campo in resultado || (campo === "valor" ? "valorCentavos" : campo === "planejado" ? "planejadoCentavos" : "valorTotalCentavos") in resultado) {
      const nome = campo === "planejado" ? "planejadoCentavos" : campo === "valorTotalCompra" ? "valorTotalCentavos" : "valorCentavos";
      // O formulário envia reais; ao editar, o valor digitado tem prioridade.
      resultado[nome] = campo in resultado ? paraCentavos(resultado[campo]) : centavosDoItem(resultado, campo);
      delete resultado[campo];
    }
  }
  return resultado;
}

export function normalizarDinheiro(dados, planejamento = false) {
  const resultado = { ...dados };
  resultado[planejamento ? "planejado" : "valor"] = centavosDoItem(dados, planejamento ? "planejado" : "valor") / 100;
  if ("valorTotalCentavos" in dados) resultado.valorTotalCompra = dados.valorTotalCentavos / 100;
  return resultado;
}
