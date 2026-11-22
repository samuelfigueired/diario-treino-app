const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Data no fuso local do aparelho, no formato da API (AAAA-MM-DD), sem passar por UTC. */
export function isoData(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

/** Segunda-feira da semana da data informada (semana de segunda a domingo). */
export function inicioDaSemana(data: Date): Date {
  const resultado = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diasDesdeSegunda = (resultado.getDay() + 6) % 7;
  resultado.setDate(resultado.getDate() - diasDesdeSegunda);
  return resultado;
}
