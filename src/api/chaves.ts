/** Chaves do TanStack Query. Centralizadas para invalidar o cache sem erro de digitação. */
export const chaves = {
  usuario: ['usuario'] as const,
  treinos: ['treinos'] as const,
  treino: (id: number) => ['treinos', id] as const,
  exercicios: ['exercicios'] as const,
  sessoes: ['sessoes'] as const,
  sessao: (id: number) => ['sessoes', id] as const,
};
