/** Chaves do TanStack Query. Centralizadas para invalidar o cache sem erro de digitação. */
export const chaves = {
  treinos: ['treinos'] as const,
  treino: (id: number) => ['treinos', id] as const,
  sessoes: ['sessoes'] as const,
  evolucao: (exercicioId: number) => ['evolucao', exercicioId] as const,
};
