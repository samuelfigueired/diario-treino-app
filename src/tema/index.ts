/** Tokens visuais do protótipo (Figma "Diário de Treino — Protótipo"). Não use cor solta nas telas. */
export const cores = {
  fundo: '#0E1013',
  cartao: '#181B20',
  cartaoElevado: '#23272E',
  borda: '#2E333B',
  texto: '#F2F4F7',
  textoSecundario: '#9AA3AE',
  destaque: '#C8F25A',
  textoSobreDestaque: '#14180A',
  erro: '#FF8A80',
} as const;

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 32 } as const;

export const raio = { sm: 8, md: 12, lg: 16, xl: 18 } as const;

export const fonte = {
  titulo: { fontSize: 28, fontWeight: '700' },
  subtitulo: { fontSize: 17, fontWeight: '600' },
  corpo: { fontSize: 15, fontWeight: '400' },
  legenda: { fontSize: 13, fontWeight: '400' },
} as const;

/** Altura mínima de alvos de toque (acessibilidade). */
export const ALVO_TOQUE = 44;
