import { readFileSync } from "node:fs";
import process from "node:process";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { initializeApp as initializeAdminApp, deleteApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { migrarUsuario, reverterMigracao } from "./scripts/migracaoFinanceira";

const PROJECT_ID = "demo-vesttor-rules";
const [host = "127.0.0.1", portText = "8080"] = (
  process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080"
).split(":");

let testEnv;

function planejamentoValido(overrides = {}) {
  return {
    userId: "usuario-1",
    categoria: "Alimentação",
    tipo: "Variável",
    planejado: 500,
    mesAno: "2026-09",
    dataCriacao: Timestamp.fromDate(new Date("2026-09-25T12:00:00Z")),
    ...overrides,
  };
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host,
      port: Number(portText),
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

function transacaoCentavos(overrides = {}) {
  return { userId: "usuario-1", data: Timestamp.fromDate(new Date("2026-10-08T12:00:00Z")), descricao: "Teste", valorCentavos: 1234, tipo: "despesa", ...overrides };
}

describe("hierarquia privada e centavos", () => {
  it("permite consulta mensal, CRUD do proprietário e mover legado atomicamente", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const ref = doc(db, "usuarios/usuario-1/transacoes/t1");
    await assertSucceeds(setDoc(ref, transacaoCentavos()));
    await assertSucceeds(getDocs(query(collection(db, "usuarios/usuario-1/transacoes"), where("data", ">=", Timestamp.fromDate(new Date("2026-10-01"))), where("data", "<", Timestamp.fromDate(new Date("2026-11-01"))), orderBy("data", "desc"))));
    const batch = writeBatch(db);
    batch.set(ref, transacaoCentavos({ valorCentavos: 1500 }));
    batch.delete(doc(db, "transacoes/t1"));
    await assertSucceeds(batch.commit());
    await assertSucceeds(deleteDoc(ref));
  });
  it("nega leitura, criação, alteração e exclusão cruzadas e acesso anônimo", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    await assertSucceeds(setDoc(doc(db, "usuarios/usuario-1/transacoes/t1"), transacaoCentavos()));
    for (const context of [testEnv.authenticatedContext("usuario-2"), testEnv.unauthenticatedContext()]) {
      const ref = doc(context.firestore(), "usuarios/usuario-1/transacoes/t1");
      await assertFails(getDoc(ref));
      await assertFails(updateDoc(ref, { valorCentavos: 1 }));
      await assertFails(deleteDoc(ref));
      await assertFails(setDoc(ref, transacaoCentavos()));
    }
    await assertFails(setDoc(doc(db, "usuarios/usuario-2/transacoes/t2"), transacaoCentavos()));
  });
  it.each([{ valorCentavos: 1.5 }, { valorCentavos: 0 }, { valorCentavos: -1 }, { valor: 2 }, { admin: true }, { userId: "usuario-2" }, { numeroParcela: 3, totalParcelas: 2, parcelamentoId: "s1" }])("rejeita contrato inválido no destino %j", async (alteracoes) => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    await assertFails(setDoc(doc(db, "usuarios/usuario-1/transacoes/invalida"), transacaoCentavos(alteracoes)));
  });
  it("planejamentos exigem inteiro, propriedade e criação imutável", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const campos = planejamentoValido();
    delete campos.planejado;
    const dados = { ...campos, planejadoCentavos: 50000 };
    const ref = doc(db, "usuarios/usuario-1/planejamentos/p1");
    await assertSucceeds(setDoc(ref, dados));
    await assertSucceeds(updateDoc(ref, { planejadoCentavos: 0 }));
    await assertFails(updateDoc(ref, { planejadoCentavos: 1.1 }));
    await assertFails(updateDoc(ref, { dataCriacao: serverTimestamp() }));
    await assertFails(getDoc(doc(testEnv.authenticatedContext("usuario-2").firestore(), ref.path)));
  });
});

describe("catálogos e preferências", () => {
  it.each(["categoriasUniversais", "meiosFinanceirosUniversais"])("%s é leitura autenticada e nenhuma escrita do cliente", async (nome) => {
    await testEnv.withSecurityRulesDisabled(async (context) => setDoc(doc(context.firestore(), nome, "global"), { nome: "Teste" }));
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const ref = doc(db, nome, "global");
    await assertSucceeds(getDoc(ref));
    await assertFails(setDoc(ref, { nome: "Alterado" }));
    await assertFails(deleteDoc(ref));
    await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), nome, "global")));
  });
  it.each(["categoriasPersonalizadas", "meiosFinanceirosPersonalizados"])("%s tem isolamento, validação e desativação", async (nome) => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const ref = doc(db, "usuarios", "usuario-1", nome, "c1");
    const dados = { userId: "usuario-1", nome: "Teste", naturezasPermitidas: ["despesa"], ativo: true, criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp(), revisao: 1 };
    await assertSucceeds(setDoc(ref, dados));
    await assertFails(updateDoc(ref, { userId: "usuario-2" }));
    await assertFails(updateDoc(ref, { naturezasPermitidas: ["admin"], revisao: 2, atualizadoEm: serverTimestamp() }));
    await assertFails(getDoc(doc(testEnv.authenticatedContext("usuario-2").firestore(), ref.path)));
    await assertFails(deleteDoc(ref));
    await assertSucceeds(updateDoc(ref, { ativo: false, atualizadoEm: serverTimestamp(), revisao: 2 }));
  });
  it("oculta itens apenas nas preferências do próprio usuário", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const ref = doc(db, "usuarios/usuario-1/preferenciasMeios/pix");
    await assertSucceeds(setDoc(ref, { oculto: true, atualizadoEm: serverTimestamp() }));
    await assertSucceeds(updateDoc(ref, { oculto: false, atualizadoEm: serverTimestamp() }));
    await assertFails(setDoc(ref, { oculto: "sim", atualizadoEm: serverTimestamp() }));
    await assertFails(getDoc(doc(testEnv.authenticatedContext("usuario-2").firestore(), ref.path)));
    expect((await getDoc(ref)).data().oculto).toBe(false);
  });
});

describe("migração e services no Firestore real emulado", () => {
  let servicos;
  let servicosPlanejamento;
  let appAdmin;
  let dbAdmin;
  beforeAll(async () => {
    vi.doMock("./src/config/firebase", () => ({ db: testEnv.authenticatedContext("usuario-1").firestore() }));
    servicos = await import("./src/services/transacoesService");
    servicosPlanejamento = await import("./src/services/planejamentoService");
    appAdmin = initializeAdminApp({ projectId: PROJECT_ID }, "migracao-testes");
    dbAdmin = getAdminFirestore(appAdmin);
  });
  afterAll(async () => { await dbAdmin.terminate(); await deleteApp(appAdmin); });
  it("simula, migra, repete e reverte mantendo a origem e totais", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "transacoes/legado"), { userId: "usuario-1", tipo: "receita", descricao: "Legado", valor: 0.29, data: Timestamp.fromDate(new Date("2026-10-08")) });
    });
    const simulacao = await migrarUsuario(dbAdmin, "usuario-1");
    expect(simulacao.criados).toBe(1);
    expect((await dbAdmin.doc("usuarios/usuario-1/transacoes/legado").get()).exists).toBe(false);
    const executada = await migrarUsuario(dbAdmin, "usuario-1", { aplicar: true });
    expect(executada.rejeitados).toEqual([]);
    expect(executada.totais.transacoes.somaDestinoCentavos).toBe(29);
    expect((await migrarUsuario(dbAdmin, "usuario-1", { aplicar: true })).existentes).toBe(1);
    expect((await reverterMigracao(dbAdmin, executada, { aplicar: true })).revertidos).toBe(1);
    expect((await dbAdmin.doc("transacoes/legado").get()).exists).toBe(true);
  });
  it("service grava centavos no destino e edição move o legado com ID estável", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "transacoes/legado"), { userId: "usuario-1", tipo: "receita", descricao: "Legado", valor: 0.1, data: Timestamp.fromDate(new Date("2026-10-08")) });
    });
    const novo = await servicos.criarTransacaoNaApi({ tipo: "receita", descricao: "Nova", valor: 0.2, data: "2026-10-08" }, "usuario-1");
    expect((await dbAdmin.doc(`usuarios/usuario-1/transacoes/${novo.id}`).get()).data().valorCentavos).toBe(20);
    await servicos.editarTransacaoNaApi("legado", { descricao: "Editada", data: "2026-11-08", valor: 0.3 }, "usuario-1");
    expect((await dbAdmin.doc("transacoes/legado").get()).exists).toBe(false);
    expect((await dbAdmin.doc("usuarios/usuario-1/transacoes/legado").get()).data().valorCentavos).toBe(30);
    await servicos.editarTransacaoNaApi("legado", { descricao: "Reeditada", valor: 0.4 }, "usuario-1");
    expect((await dbAdmin.doc("usuarios/usuario-1/transacoes/legado").get()).data().valorCentavos).toBe(40);
    await servicos.excluirTransacaoNaApi(novo.id, "usuario-1");
    expect((await dbAdmin.doc(`usuarios/usuario-1/transacoes/${novo.id}`).get()).exists).toBe(false);
  });
  it("planejamento novo e legado usam limites em centavos com atualização transacional", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => setDoc(doc(context.firestore(), "planejamentos/p1"), planejamentoValido()));
    await servicosPlanejamento.atualizarPlanejamentoNaApi("p1", { planejado: 123.45 }, "usuario-1");
    expect((await dbAdmin.doc("usuarios/usuario-1/planejamentos/p1").get()).data().planejadoCentavos).toBe(12345);
    expect((await dbAdmin.doc("planejamentos/p1").get()).exists).toBe(false);
    await servicosPlanejamento.atualizarPlanejamentoNaApi("p1", { planejado: 0 }, "usuario-1");
    await servicosPlanejamento.criarPlanejamentoNaApi({ categoria: "Transporte", tipo: "Variável", planejado: 1.01, mesAno: "2026-10" }, "usuario-1");
    const planos = await dbAdmin.collection("usuarios/usuario-1/planejamentos").get();
    expect(planos.docs.map((item) => item.data().planejadoCentavos).sort((a, b) => a - b)).toEqual([0, 101]);
  });
  it("leitura mensal junta as fontes sem duplicar IDs nem carregar outros meses", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "transacoes/t1"), { userId: "usuario-1", tipo: "receita", descricao: "Legado", valor: 0.1, data: Timestamp.fromDate(new Date("2026-10-08")) });
      await setDoc(doc(context.firestore(), "usuarios/usuario-1/transacoes/t1"), transacaoCentavos({ valorCentavos: 20 }));
      await setDoc(doc(context.firestore(), "usuarios/usuario-1/transacoes/outro-mes"), transacaoCentavos({ data: Timestamp.fromDate(new Date("2026-11-08")) }));
    });
    let cancelar;
    const itens = await new Promise((resolve, reject) => {
      cancelar = servicos.observarTransacoes("usuario-1", resolve, reject, "2026-10");
    });
    cancelar();
    expect(itens).toHaveLength(1);
    expect(itens[0]).toMatchObject({ id: "t1", valor: 0.2, valorCentavos: 20 });
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Security Rules de planejamentos", () => {
  it("permite ao proprietário criar, ler, atualizar e excluir", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();
    const ref = doc(db, "planejamentos", "plano-1");

    await assertSucceeds(setDoc(ref, planejamentoValido()));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(updateDoc(ref, { planejado: 650 }));
    await assertSucceeds(deleteDoc(ref));
  });

  it("impede leitura e alteração por outro usuário", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), "planejamentos", "plano-1"),
        planejamentoValido(),
      );
    });

    const db = testEnv.authenticatedContext("usuario-2").firestore();
    const ref = doc(db, "planejamentos", "plano-1");

    await assertFails(getDoc(ref));
    await assertFails(updateDoc(ref, { planejado: 1 }));
    await assertFails(deleteDoc(ref));
  });

  it("impede acesso de usuário não autenticado", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), "planejamentos", "plano-1"),
        planejamentoValido(),
      );
    });

    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "planejamentos", "plano-1")));
    await assertFails(
      setDoc(
        doc(db, "planejamentos", "novo-plano"),
        planejamentoValido(),
      ),
    );
  });

  it("rejeita campos desconhecidos, tipos inválidos e troca de proprietário", async () => {
    const db = testEnv.authenticatedContext("usuario-1").firestore();

    await assertFails(
      setDoc(
        doc(db, "planejamentos", "campo-extra"),
        planejamentoValido({ admin: true }),
      ),
    );
    await assertFails(
      setDoc(
        doc(db, "planejamentos", "tipo-invalido"),
        planejamentoValido({ tipo: "Outro" }),
      ),
    );
    await assertFails(
      setDoc(
        doc(db, "planejamentos", "mes-invalido"),
        planejamentoValido({ mesAno: "09/2026" }),
      ),
    );

    const ref = doc(db, "planejamentos", "proprietario");
    await assertSucceeds(setDoc(ref, planejamentoValido()));
    await assertFails(updateDoc(ref, { userId: "usuario-2" }));
  });

  it("mantém documentos legados com data ISO editáveis pelo proprietário", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), "planejamentos", "legado"),
        planejamentoValido({ dataCriacao: "2026-09-25T12:00:00.000Z" }),
      );
    });

    const db = testEnv.authenticatedContext("usuario-1").firestore();
    await assertSucceeds(
      updateDoc(doc(db, "planejamentos", "legado"), { planejado: 700 }),
    );
  });
});
