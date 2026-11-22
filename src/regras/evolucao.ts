import type { PontoEvolucao, SessaoTreino } from '../types';
import { isoData } from './datas';

export type Periodo = '1M' | '3M' | '6M' | '1A';

const DIAS_DO_PERIODO: Record<Periodo, number> = { '1M': 30, '3M': 91, '6M': 182, '1A': 365 };

/** Maior carga do exercício em cada dia em que ele foi feito, em ordem cronológica. */
export function cargaMaximaPorDia(sessoes: SessaoTreino[], exercicioId: number): PontoEvolucao[] {
  const porDia = new Map<string, number>();
  for (const sessao of sessoes) {
    const dia = isoData(new Date(sessao.inicio));
    for (const serie of sessao.series) {
      if (serie.exercicioId !== exercicioId || !serie.concluida || serie.cargaKg == null) continue;
      porDia.set(dia, Math.max(porDia.get(dia) ?? 0, serie.cargaKg));
    }
  }
  return [...porDia.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, cargaMaximaKg]) => ({ data, cargaMaximaKg }));
}

/** Pontos dentro do período escolhido, contado para trás a partir de hoje. */
export function filtrarPeriodo(pontos: PontoEvolucao[], periodo: Periodo, hoje: Date): PontoEvolucao[] {
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - DIAS_DO_PERIODO[periodo]);
  const limite = isoData(inicio);
  return pontos.filter((p) => p.data >= limite);
}

/** Resumo da evolução: carga máxima atual, variação no período e quantas semanas ele cobre. */
export function resumoDaEvolucao(pontos: PontoEvolucao[]) {
  if (pontos.length === 0) return null;
  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];
  const dias = (new Date(ultimo.data).getTime() - new Date(primeiro.data).getTime()) / 86400000;
  return {
    cargaMaximaKg: Math.max(...pontos.map((p) => p.cargaMaximaKg)),
    variacaoKg: Math.round((ultimo.cargaMaximaKg - primeiro.cargaMaximaKg) * 100) / 100,
    semanas: Math.max(1, Math.round(dias / 7)),
  };
}

/** Quantos recordes pessoais foram batidos (carga maior que todas as anteriores) a partir de `desde`. */
export function recordesDesde(pontos: PontoEvolucao[], desde: string): number {
  let maior = -Infinity;
  let recordes = 0;
  for (const ponto of pontos) {
    if (ponto.cargaMaximaKg > maior) {
      if (ponto.data >= desde && maior !== -Infinity) recordes++;
      maior = ponto.cargaMaximaKg;
    }
  }
  return recordes;
}
