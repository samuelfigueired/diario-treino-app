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

/** Converte o texto de repetições em inteiro positivo; vazio ou inválido vira null. */
export function converterRepeticoes(texto: string | null | undefined): number | null {
  if (texto == null) return null;
  const limpo = texto.trim();
  if (!/^\d+$/.test(limpo)) return null;
  const valor = Number(limpo);
  return valor > 0 ? valor : null;
}

/** Número no padrão brasileiro, com até `casas` decimais: 7840 → "7.840", 57.5 → "57,5". */
export function formatarNumero(valor: number, casas = 2): string {
  const fator = 10 ** casas;
  const arredondado = Math.round(valor * fator) / fator;
  const [inteiro, decimal] = String(Math.abs(arredondado)).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sinal = arredondado < 0 ? '-' : '';
  return decimal ? `${sinal}${comMilhar},${decimal}` : `${sinal}${comMilhar}`;
}

/** Texto da carga para campos editáveis: 57.5 → "57,5"; sem carga → "". */
export function cargaParaCampo(kg: number | null | undefined): string {
  return kg == null ? '' : formatarNumero(kg).replace(/\./g, '');
}

/** Formata a carga para exibição: "62,5 kg", "60 kg". Sem carga: "Peso corporal". */
export function formatarCarga(kg: number | null | undefined): string {
  if (kg == null) return 'Peso corporal';
  return `${formatarNumero(kg)} kg`;
}

/** Volume da série (carga × repetições), em kg. Sem carga ou sem repetições, volume zero. */
export function volumeDaSerie(kg: number | null | undefined, repeticoes: number | null | undefined): number {
  if (kg == null || repeticoes == null || repeticoes <= 0) return 0;
  return Math.round(kg * repeticoes * 100) / 100;
}

/** Volume em toneladas com uma casa ("86,4"), para indicadores de período. */
export function emToneladas(kg: number): string {
  return formatarNumero(kg / 1000, 1);
}
