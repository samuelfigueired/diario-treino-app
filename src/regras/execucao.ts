import type { SerieRegistrada } from '../types';
import { cargaParaCampo } from './carga';
import { converterCarga, converterRepeticoes, volumeDaSerie } from './carga';

/** Série sendo preenchida na tela de execução (valores ainda como texto digitado). */
export type SerieEmEdicao = {
  numero: number;
  carga: string;
  repeticoes: string;
  concluida: boolean;
  /** Referência da última vez ("57,5 kg × 10"). */
  anterior: string | null;
};

export const DESCANSO_PADRAO_SEGUNDOS = 90;
export const AJUSTE_DESCANSO_SEGUNDOS = 15;

/** Cria as séries planejadas, já preenchidas com a carga e as repetições da última vez. */
export function seriesIniciais(
  quantidade: number,
  repeticoesPlanejadas: number,
  cargaAnterior: string,
  anterior: string | null,
): SerieEmEdicao[] {
  return Array.from({ length: Math.max(1, quantidade) }, (_, i) => ({
    numero: i + 1,
    carga: cargaAnterior,
    repeticoes: String(repeticoesPlanejadas),
    concluida: false,
    anterior,
  }));
}

/** Uma série só pode ser concluída com repetições válidas; carga vazia vale como peso corporal. */
export function podeConcluir(serie: SerieEmEdicao): boolean {
  const cargaValida = serie.carga.trim() === '' || converterCarga(serie.carga) != null;
  return cargaValida && converterRepeticoes(serie.repeticoes) != null;
}

/** Índice da primeira série ainda não concluída, ou -1 se todas foram feitas. */
export function indiceSerieAtual(series: SerieEmEdicao[]): number {
  return series.findIndex((s) => !s.concluida);
}

/** Acrescenta uma série copiando carga e repetições da última. */
export function adicionarSerie(series: SerieEmEdicao[]): SerieEmEdicao[] {
  const ultima = series[series.length - 1];
  return [
    ...series,
    {
      numero: series.length + 1,
      carga: ultima?.carga ?? '',
      repeticoes: ultima?.repeticoes ?? '',
      concluida: false,
      anterior: null,
    },
  ];
}

/** Progresso da sessão inteira: séries concluídas e total. */
export function progressoDaSessao(seriesPorExercicio: SerieEmEdicao[][]) {
  const todas = seriesPorExercicio.flat();
  return { concluidas: todas.filter((s) => s.concluida).length, total: todas.length };
}

/** Converte as séries concluídas para o formato da API. Séries não concluídas são descartadas. */
export function paraSeriesRegistradas(exercicioId: number, series: SerieEmEdicao[]): SerieRegistrada[] {
  return series
    .filter((s) => s.concluida)
    .map((s) => ({
      exercicioId,
      numero: s.numero,
      cargaKg: converterCarga(s.carga),
      repeticoes: converterRepeticoes(s.repeticoes),
      concluida: true,
    }));
}

/** Volume total (kg) das séries concluídas. */
export function volumeDasSeries(series: SerieRegistrada[]): number {
  const total = series.filter((s) => s.concluida).reduce((soma, s) => soma + volumeDaSerie(s.cargaKg, s.repeticoes), 0);
  return Math.round(total * 100) / 100;
}

/** Séries de uma sessão salva, agrupadas por exercício na ordem em que aparecem, prontas para edição. */
export function seriesParaEdicao(series: SerieRegistrada[]): { exercicioId: number; series: SerieEmEdicao[] }[] {
  const grupos: { exercicioId: number; series: SerieEmEdicao[] }[] = [];
  for (const serie of series) {
    let grupo = grupos.find((g) => g.exercicioId === serie.exercicioId);
    if (!grupo) {
      grupo = { exercicioId: serie.exercicioId, series: [] };
      grupos.push(grupo);
    }
    grupo.series.push({
      numero: serie.numero,
      carga: cargaParaCampo(serie.cargaKg),
      repeticoes: serie.repeticoes == null ? '' : String(serie.repeticoes),
      concluida: serie.concluida,
      anterior: null,
    });
  }
  return grupos;
}

/** Remove a série e renumera as seguintes (1, 2, 3...). */
export function removerSerie(series: SerieEmEdicao[], indice: number): SerieEmEdicao[] {
  return series.filter((_, i) => i !== indice).map((s, i) => ({ ...s, numero: i + 1 }));
}
