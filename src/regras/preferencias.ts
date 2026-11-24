/** Preferências do app guardadas só no aparelho (não precisam ir para o banco). */
export type Preferencias = {
  /** Tempo de descanso iniciado ao concluir uma série. */
  descansoSegundos: number;
};

export const OPCOES_DESCANSO_SEGUNDOS = [60, 90, 120, 180] as const;

export const PREFERENCIAS_PADRAO: Preferencias = { descansoSegundos: 90 };

/** Valida o que veio do armazenamento local; campos ausentes ou inválidos voltam ao padrão. */
export function lerPreferencias(valor: unknown): Preferencias {
  const salvo = (valor ?? {}) as Partial<Preferencias>;
  const descanso = OPCOES_DESCANSO_SEGUNDOS.find((s) => s === salvo.descansoSegundos);
  return { descansoSegundos: descanso ?? PREFERENCIAS_PADRAO.descansoSegundos };
}

/** "60 s", "1 min 30 s", "2 min". */
export function rotuloDescanso(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  if (minutos === 0) return `${resto} s`;
  return resto === 0 ? `${minutos} min` : `${minutos} min ${resto} s`;
}
