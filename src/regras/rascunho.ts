import type { SerieEmEdicao } from './execucao';

/**
 * Treino em andamento ainda não salvo. Fica só no aparelho (AsyncStorage) para que
 * as séries preenchidas não se percam se o app fechar no meio do treino.
 * Só vira sessão no banco quando o usuário toca em "Finalizar e salvar".
 */
export type RascunhoTreino = {
  treinoId: number;
  nomeTreino: string;
  letraTreino: string;
  /** Início do treino (ISO). */
  inicio: string;
  indiceExercicio: number;
  series: SerieEmEdicao[][];
  /** Fim do descanso em andamento (ms desde 1970), ou null. */
  descansoAte: number | null;
};

/** Depois disso o rascunho é considerado abandonado e descartado. */
export const VALIDADE_RASCUNHO_HORAS = 12;

function ehSerie(valor: unknown): valor is SerieEmEdicao {
  const s = valor as SerieEmEdicao;
  return (
    typeof s === 'object' && s != null &&
    typeof s.numero === 'number' && typeof s.carga === 'string' &&
    typeof s.repeticoes === 'string' && typeof s.concluida === 'boolean'
  );
}

/** Valida o rascunho lido do armazenamento. Devolve null se estiver corrompido ou vencido. */
export function validarRascunho(valor: unknown, agora: number): RascunhoTreino | null {
  const r = valor as RascunhoTreino;
  if (typeof r !== 'object' || r == null) return null;
  if (typeof r.treinoId !== 'number' || typeof r.inicio !== 'string' || typeof r.indiceExercicio !== 'number') return null;
  if (!Array.isArray(r.series) || !r.series.every((lista) => Array.isArray(lista) && lista.every(ehSerie))) return null;
  const inicio = new Date(r.inicio).getTime();
  if (Number.isNaN(inicio) || agora - inicio > VALIDADE_RASCUNHO_HORAS * 3600_000) return null;
  return {
    ...r,
    nomeTreino: String(r.nomeTreino ?? ''),
    letraTreino: String(r.letraTreino ?? ''),
    descansoAte: typeof r.descansoAte === 'number' ? r.descansoAte : null,
  };
}

/** O rascunho só é retomado se for do mesmo treino e o treino não mudou de exercícios. */
export function rascunhoServePara(rascunho: RascunhoTreino | null, treinoId: number, quantidadeExercicios: number): rascunho is RascunhoTreino {
  return (
    rascunho != null &&
    rascunho.treinoId === treinoId &&
    rascunho.series.length === quantidadeExercicios &&
    rascunho.indiceExercicio >= 0 &&
    rascunho.indiceExercicio < quantidadeExercicios
  );
}
