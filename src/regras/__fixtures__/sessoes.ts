import type { SessaoTreino, SerieRegistrada } from '../../types';

export const SUPINO_RETO = 1;
export const TRICEPS_CORDA = 4;

/** Série concluída do exercício informado. */
export function serie(exercicioId: number, numero: number, cargaKg: number | null, repeticoes: number): SerieRegistrada {
  return { exercicioId, numero, cargaKg, repeticoes, concluida: true };
}

/** Sessão que começa na data local informada (mês de 1 a 12) e dura `minutos`. */
export function sessao(
  id: number,
  [ano, mes, dia]: [number, number, number],
  series: SerieRegistrada[],
  minutos = 58,
): SessaoTreino {
  const inicio = new Date(ano, mes - 1, dia, 7, 0);
  const fim = new Date(inicio.getTime() + minutos * 60000);
  return {
    id,
    treinoId: 1,
    nomeTreino: 'Peito e Tríceps',
    letraTreino: 'A',
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    series,
  };
}
