const mensagens = {
  "parcelamento-alteracao-indisponivel": "Não foi possível atualizar a compra preservando as parcelas existentes. Confira os dados e tente novamente.",
  "planejamento-duplicado": "Já existe um orçamento para essa categoria e classificação neste mês. Edite o orçamento existente.",
  "permission-denied": "Você não tem permissão para acessar ou alterar esses dados. Confira a conta conectada.",
  unauthenticated: "Sua sessão expirou. Entre novamente para continuar.",
  unavailable: "O serviço está indisponível. Confira sua conexão e tente novamente em instantes.",
  "deadline-exceeded": "A confirmação demorou mais que o esperado. Confira se a alteração foi aplicada antes de tentar novamente.",
  aborted: "Os dados foram alterados durante a operação. Confira os dados atualizados e tente novamente.",
  "already-exists": "Esse registro já existe. Confira os dados antes de continuar.",
  "invalid-argument": "Alguns dados são inválidos. Revise os campos e tente novamente.",
  "out-of-range": "Um valor está fora do intervalo permitido. Revise os campos.",
  "failed-precondition": "Não foi possível concluir com o estado atual dos dados. Atualize a página e confira os dados antes de tentar novamente.",
  "not-found": "Esse registro não está mais disponível. Atualize a página para conferir os dados.",
  "resource-exhausted": "O serviço atingiu um limite temporário. Aguarde alguns instantes e tente novamente.",
  cancelled: "A operação foi interrompida. Confira os dados antes de tentar novamente.",
};

// Somente códigos conhecidos são exibidos; mensagens do SDK podem conter dados internos.
export function obterMensagemErroFirestore(erro, alternativa = "Não foi possível concluir a operação. Tente novamente.") {
  const codigo = typeof erro?.code === "string" ? erro.code.replace(/^firestore\//, "") : "";
  return Object.hasOwn(mensagens, codigo) ? mensagens[codigo] : alternativa;
}
