import type { DiaSemana } from '../types';

const doisDigitos = (n: number) => String(n).padStart(2, '0');

const DIAS_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;
const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;
const DIAS_SIGLA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
] as const;
const CODIGOS_DIA: DiaSemana[] = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Data no fuso local do aparelho, no formato da API (AAAA-MM-DD), sem passar por UTC. */
export function isoData(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

/** Converte AAAA-MM-DD em Date local (meia-noite), sem o deslocamento de UTC do `new Date(texto)`. */
export function dataDeIso(texto: string): Date {
  const [ano, mes, dia] = texto.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

/** Segunda-feira da semana da data informada (semana de segunda a domingo). */
export function inicioDaSemana(data: Date): Date {
  const resultado = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diasDesdeSegunda = (resultado.getDay() + 6) % 7;
  resultado.setDate(resultado.getDate() - diasDesdeSegunda);
  return resultado;
}

/** Os 7 dias (segunda a domingo) da semana da data informada. */
export function diasDaSemanaDe(data: Date): Date[] {
  const segunda = inicioDaSemana(data);
  return Array.from({ length: 7 }, (_, i) => new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + i));
}

/** Rótulo curto do dia ("Seg"), na ordem segunda a domingo. */
export function rotuloDiaCurto(data: Date): string {
  return DIAS_CURTOS[(data.getDay() + 6) % 7];
}

/** Sigla do dia em maiúsculas para cartões ("TER"). */
export function siglaDia(data: Date): string {
  return DIAS_SIGLA[data.getDay()];
}

/** Código do dia da semana usado pela API ("SEG"). */
export function codigoDia(data: Date): DiaSemana {
  return CODIGOS_DIA[data.getDay()];
}

/** "Terça, 3 de novembro". */
export function formatarDataLonga(data: Date): string {
  return `${DIAS_LONGOS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

/** "29/10". */
export function formatarDiaMes(data: Date): string {
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;
}

/** "qui, 29 out". */
export function formatarDataCurta(data: Date): string {
  return `${DIAS_CURTOS[(data.getDay() + 6) % 7].toLowerCase()}, ${data.getDate()} ${MESES[data.getMonth()].slice(0, 3)}`;
}

/** Diferença em dias de calendário entre duas datas locais (b − a). */
export function diasEntre(a: Date, b: Date): number {
  const inicioA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const inicioB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((inicioB - inicioA) / MS_POR_DIA);
}

/** "Esta semana", "Semana passada" ou "Semana de 20/10". */
export function rotuloSemana(data: Date, hoje: Date): string {
  const semanas = Math.round(diasEntre(inicioDaSemana(data), inicioDaSemana(hoje)) / 7);
  if (semanas === 0) return 'Esta semana';
  if (semanas === 1) return 'Semana passada';
  return `Semana de ${formatarDiaMes(inicioDaSemana(data))}`;
}

/** Cronômetro "mm:ss" (ou "h:mm:ss" a partir de uma hora). Valores negativos viram zero. */
export function formatarCronometro(segundosTotais: number): string {
  const s = Math.max(0, Math.floor(segundosTotais));
  const horas = Math.floor(s / 3600);
  const minutos = Math.floor((s % 3600) / 60);
  const segundos = s % 60;
  const mmss = `${doisDigitos(minutos)}:${doisDigitos(segundos)}`;
  return horas > 0 ? `${horas}:${mmss}` : mmss;
}

/** Duração de treino: "58 min" ou "1h 04". */
export function formatarDuracao(minutosTotais: number): string {
  const m = Math.max(0, Math.round(minutosTotais));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${doisDigitos(m % 60)}`;
}

/** Minutos entre dois instantes ISO. Sessão sem fim conta zero. */
export function minutosEntre(inicioIso: string, fimIso: string | null): number {
  if (!fimIso) return 0;
  return Math.max(0, Math.round((new Date(fimIso).getTime() - new Date(inicioIso).getTime()) / 60000));
}
