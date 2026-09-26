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
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

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
