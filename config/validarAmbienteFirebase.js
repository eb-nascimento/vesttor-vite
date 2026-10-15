export const VARIAVEIS_FIREBASE_OBRIGATORIAS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTHDOMAIN",
  "VITE_FIREBASE_PROJECTID",
  "VITE_FIREBASE_STORAGEBUCKET",
  "VITE_FIREBASE_MESSAGINGSENDERID",
  "VITE_FIREBASE_APPID",
];

export function validarAmbienteFirebase(ambiente) {
  const ausentes = VARIAVEIS_FIREBASE_OBRIGATORIAS.filter((nome) => {
    const valor = ambiente[nome]?.trim();
    return !valor || valor === "-";
  });
  if (ausentes.length) {
    throw new Error(
      `Configuração Firebase incompleta. Preencha ${ausentes.join(", ")} em .env/.env.production ou nas variáveis do CI antes do build. Consulte .env.example.`,
    );
  }
}
