const API_URL = "http://localhost:3000/transacoes";

export async function buscarTransacoes() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar as transações.");
  }

  return resposta.json();
}

export async function criarTransacaoNaApi(transacao) {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transacao),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível adicionar a transação");
  }
  return resposta.json();
}

export async function excluirTransacaoNaApi(id) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!resposta.ok) {
    throw new Error("Não foi possível excluir a transação");
  }
}

export async function editarTransacaoNaApi(id, novosDados) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novosDados),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível editar a transação.");
  }
  return resposta.json();
}
