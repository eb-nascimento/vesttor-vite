import { describe, expect, it } from "vitest";
import { validarAmbienteFirebase, VARIAVEIS_FIREBASE_OBRIGATORIAS } from "./validarAmbienteFirebase";

const completo = Object.fromEntries(VARIAVEIS_FIREBASE_OBRIGATORIAS.map((nome) => [nome, "valor-teste"]));

describe("configuração Firebase antes do build", () => {
  it("aceita configuração completa sem Analytics opcional", () => {
    expect(() => validarAmbienteFirebase(completo)).not.toThrow();
  });
  it.each([undefined, "", "   ", "-"])("recusa valor ausente ou placeholder %s", (valor) => {
    expect(() => validarAmbienteFirebase({ ...completo, VITE_FIREBASE_APPID: valor })).toThrow("VITE_FIREBASE_APPID");
  });
  it("lista todas as ausências sem revelar valores presentes", () => {
    const ambiente = { VITE_FIREBASE_API_KEY: "valor-que-nao-deve-aparecer" };
    try {
      validarAmbienteFirebase(ambiente);
      throw new Error("A validação deveria falhar");
    } catch (erro) {
      expect(erro.message).toContain("VITE_FIREBASE_PROJECTID");
      expect(erro.message).toContain("VITE_FIREBASE_APPID");
      expect(erro.message).not.toContain(ambiente.VITE_FIREBASE_API_KEY);
    }
  });
});
