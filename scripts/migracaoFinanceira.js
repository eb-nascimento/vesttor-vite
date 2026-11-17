import { serializarDinheiro, centavosDoItem } from "../src/utils/dinheiro.js";

export function converterDocumento(nome, dados) {
  if (!dados.userId || typeof dados.userId !== "string")
    throw new Error("Proprietário ausente");
  if (nome === "transacoes") {
    if (
      !dados.data?.toDate ||
      !["receita", "despesa"].includes(dados.tipo) ||
      !dados.descricao
    )
      throw new Error("Transação inválida");
    if (
      Object.keys(dados).some(
        (campo) =>
          ![
            "userId",
            "data",
            "descricao",
            "valor",
            "valorCentavos",
            "tipo",
            "categoria",
            "metodoPagamento",
            "parcelado",
            "parcelas",
            "parcelamentoId",
            "numeroParcela",
            "totalParcelas",
            "valorTotalCompra",
            "valorTotalCentavos",
          ].includes(campo),
      )
    )
      throw new Error("Campo desconhecido na transação");
    if (
      typeof dados.descricao !== "string" ||
      dados.descricao.length > (dados.numeroParcela ? 208 : 200) ||
      !Number.isFinite(dados.data.toDate().getTime())
    )
      throw new Error("Descrição ou data inválida");
    if (centavosDoItem(dados) <= 0) throw new Error("Valor deve ser positivo");
  } else if (nome === "planejamentos") {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(dados.mesAno) ||
      !dados.categoria ||
      !["Entrada", "Fixo", "Variável"].includes(dados.tipo)
    )
      throw new Error("Planejamento inválido");
    if (
      Object.keys(dados).some(
        (campo) =>
          ![
            "userId",
            "categoria",
            "tipo",
            "planejado",
            "planejadoCentavos",
            "mesAno",
            "dataCriacao",
          ].includes(campo),
      )
    )
      throw new Error("Campo desconhecido no planejamento");
    if (
      !dados.dataCriacao ||
      typeof dados.categoria !== "string" ||
      dados.categoria.length > 50
    )
      throw new Error("Categoria ou data inválida");
  } else throw new Error("Coleção não permitida");
  return serializarDinheiro(dados, nome === "planejamentos");
}

export function assinatura(dados) {
  if (dados?.toMillis) return dados.toMillis();
  if (Array.isArray(dados)) return dados.map(assinatura);
  if (dados && typeof dados === "object")
    return Object.fromEntries(
      Object.keys(dados)
        .sort()
        .map((chave) => [chave, assinatura(dados[chave])]),
    );
  return dados;
}
export function iguais(a, b) {
  return JSON.stringify(assinatura(a)) === JSON.stringify(assinatura(b));
}

// Cópia administrativa por UID, sem remoção da origem ou sobrescrita de destino.
export async function migrarUsuario(db, uid, { aplicar = false } = {}) {
  if (!uid || uid.includes("/")) throw new Error("UID inválido");
  const relatorio = {
    uid,
    aplicar,
    criados: 0,
    existentes: 0,
    rejeitados: [],
    documentos: [],
    totais: {},
  };
  for (const nome of ["transacoes", "planejamentos"]) {
    const origem = await db.collection(nome).where("userId", "==", uid).get();
    let somaOrigem = 0;
    let somaDestino = 0;
    for (const item of origem.docs) {
      try {
        const original = item.data();
        const dados = converterDocumento(nome, original);
        const destino = db.doc(`usuarios/${uid}/${nome}/${item.id}`);
        const verificar = async (transacao) => {
          const atualOrigem = await transacao.get(item.ref);
          const atualDestino = await transacao.get(destino);
          if (!atualOrigem.exists || !iguais(atualOrigem.data(), original))
            throw new Error("Origem mudou durante a migração");
          if (atualDestino.exists && !iguais(atualDestino.data(), dados))
            throw new Error("Destino divergente; revisão necessária");
          if (!atualDestino.exists && aplicar) transacao.create(destino, dados);
          return atualDestino.exists;
        };
        const existe = aplicar
          ? await db.runTransaction(verificar)
          : await verificar({ get: (ref) => ref.get() });
        relatorio[existe ? "existentes" : "criados"]++;
        const campo = nome === "planejamentos" ? "planejado" : "valor";
        somaOrigem += centavosDoItem(original, campo);
        somaDestino += centavosDoItem(dados, campo);
        relatorio.documentos.push({
          origem: item.ref.path,
          destino: destino.path,
          criado: !existe,
          original,
          convertido: dados,
        });
      } catch (erro) {
        relatorio.rejeitados.push({
          caminho: item.ref.path,
          motivo: erro.message,
        });
      }
    }
    relatorio.totais[nome] = {
      documentosOrigem: origem.docs.length,
      somaOrigemCentavos: somaOrigem,
      somaDestinoCentavos: somaDestino,
    };
  }
  return relatorio;
}

export async function reverterMigracao(
  db,
  relatorio,
  { aplicar = false } = {},
) {
  if (!relatorio.aplicar)
    throw new Error("Somente relatórios de execução podem ser revertidos");
  const resultado = { revertidos: 0, rejeitados: [] };
  for (const item of relatorio.documentos.filter(
    (documento) => documento.criado,
  )) {
    try {
      if (
        item.destino !== `usuarios/${relatorio.uid}/${item.origem}` ||
        item.original.userId !== relatorio.uid ||
        !["transacoes", "planejamentos"].includes(item.origem.split("/")[0])
      )
        throw new Error("Caminho inválido no relatório");
      const executar = async (transacao) => {
        const origem = await transacao.get(db.doc(item.origem));
        const destino = await transacao.get(db.doc(item.destino));
        if (!destino.exists) return false;
        if (
          !origem.exists ||
          !iguais(origem.data(), item.original) ||
          !iguais(destino.data(), item.convertido)
        )
          throw new Error("Documento mudou; rollback automático recusado");
        if (aplicar) transacao.delete(db.doc(item.destino));
        return true;
      };
      const reverte = aplicar
        ? await db.runTransaction(executar)
        : await executar({ get: (ref) => ref.get() });
      if (reverte) resultado.revertidos++;
    } catch (erro) {
      resultado.rejeitados.push({
        caminho: item.destino,
        motivo: erro.message,
      });
    }
  }
  return resultado;
}
