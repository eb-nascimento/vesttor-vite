import process from "node:process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { migrarUsuario, reverterMigracao } from "./migracaoFinanceira.js";

const argumentos = process.argv.slice(2);
const obter = (nome) => argumentos[argumentos.indexOf(nome) + 1];
const projeto = argumentos.includes("--project")
  ? obter("--project")
  : undefined;
const uid = argumentos.includes("--uid") ? obter("--uid") : undefined;
if (!projeto || !uid)
  throw new Error(
    "Informe --project e --uid. A simulação é o padrão; --apply executa a cópia.",
  );
if (process.env.FIRESTORE_EMULATOR_HOST && !projeto.startsWith("demo-"))
  throw new Error("Use um projeto demo- no emulador.");
const app = initializeApp({
  projectId: projeto,
  ...(process.env.FIRESTORE_EMULATOR_HOST
    ? {}
    : { credential: applicationDefault() }),
});
const db = getFirestore(app);
const aplicar = argumentos.includes("--apply");
let relatorio;
if (argumentos.includes("--rollback")) {
  const original = JSON.parse(
    await readFile(obter("--rollback"), "utf8"),
    (_, valor) => {
      if (
        valor &&
        typeof valor === "object" &&
        "_seconds" in valor &&
        "_nanoseconds" in valor
      )
        return new Timestamp(valor._seconds, valor._nanoseconds);
      return valor;
    },
  );
  if (original.uid !== uid || original.projeto !== projeto)
    throw new Error("Projeto ou usuário diferentes do relatório");
  relatorio = await reverterMigracao(db, original, { aplicar });
} else relatorio = await migrarUsuario(db, uid, { aplicar });
relatorio.projeto = projeto;
await mkdir("migration-reports", { recursive: true });
const arquivo = `migration-reports/${Date.now()}.json`;
await writeFile(arquivo, JSON.stringify(relatorio, null, 2));
console.log(
  JSON.stringify(
    {
      arquivo,
      criados: relatorio.criados,
      existentes: relatorio.existentes,
      revertidos: relatorio.revertidos,
      rejeitados: relatorio.rejeitados.length,
      totais: relatorio.totais,
    },
    null,
    2,
  ),
);
await db.terminate();
if (relatorio.rejeitados.length) process.exitCode = 1;
