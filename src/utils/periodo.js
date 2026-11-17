export function dataLocal(referencia = new Date()) {
  return `${mesAtual(referencia)}-${String(referencia.getDate()).padStart(2, "0")}`;
}

export function mesAtual(referencia = new Date()) {
  return `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, "0")}`;
}

export function limitesMes(mes) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) throw new Error("Per�odo mensal inv�lido");
  const [ano, numeroMes] = mes.split("-").map(Number);
  return { inicio: new Date(ano, numeroMes - 1, 1), fim: new Date(ano, numeroMes, 1) };
}

export function deslocarMes(mes, deslocamento) {
  const { inicio } = limitesMes(mes);
  inicio.setMonth(inicio.getMonth() + deslocamento);
  return mesAtual(inicio);
}
