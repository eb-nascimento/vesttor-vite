import { describe, expect, it } from "vitest";
import { obterMensagemErroFirestore } from "./errosFirestore";

describe("mensagens seguras do Firestore", () => {
  it.each([
    ["permission-denied", "permissão"],
    ["unauthenticated", "sessão expirou"],
    ["unavailable", "conexão"],
    ["aborted", "alterados"],
    ["invalid-argument", "Revise"],
    ["out-of-range", "intervalo permitido"],
    ["cancelled", "interrompida"],
    ["already-exists", "já existe"],
    ["failed-precondition", "estado atual"],
    ["not-found", "não está mais disponível"],
    ["resource-exhausted", "limite temporário"],
    ["deadline-exceeded", "antes de tentar novamente"],
  ])("traduz %s sem divulgar detalhes", (code, trecho) => {
    const mensagem = obterMensagemErroFirestore({ code, message: "segredo /users/id/registro" });
    expect(mensagem).toContain(trecho);
    expect(mensagem).not.toContain("segredo");
    expect(mensagem).not.toContain("/users/");
    expect(obterMensagemErroFirestore({ code: `firestore/${code}` })).toBe(mensagem);
  });
  it.each([undefined, null, new Error("segredo"), { code: "internal", message: "segredo" }, { code: "toString" }])(
    "usa a mensagem segura para erro desconhecido", (erro) => {
      expect(obterMensagemErroFirestore(erro, "Não foi possível salvar.")).toBe("Não foi possível salvar.");
    },
  );
});
