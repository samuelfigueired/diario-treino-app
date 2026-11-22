/**
 * Converte o texto digitado em carga (kg). Aceita vírgula ou ponto decimal ("62,5", "62.5").
 * Retorna null para texto vazio, inválido ou negativo.
 */
export function converterCarga(texto: string | null | undefined): number | null {
  if (texto == null) return null;
  const limpo = texto.trim().replace(',', '.');
  if (limpo === '' || !/^\d+(\.\d+)?$/.test(limpo)) return null;
  const valor = Number(limpo);
  return Number.isFinite(valor) ? valor : null;
}

/** Formata a carga para exibição: "62,5 kg", "60 kg". Sem carga: "Peso corporal". */
export function formatarCarga(kg: number | null | undefined): string {
  if (kg == null) return 'Peso corporal';
  const arredondado = Math.round(kg * 100) / 100;
  return `${String(arredondado).replace('.', ',')} kg`;
}

/** Volume da série (carga × repetições), em kg. Sem carga ou sem repetições, volume zero. */
export function volumeDaSerie(kg: number | null | undefined, repeticoes: number | null | undefined): number {
  if (kg == null || repeticoes == null || repeticoes <= 0) return 0;
  return Math.round(kg * repeticoes * 100) / 100;
}
