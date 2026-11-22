/** Tipos que espelham a API (diario-treino-api). Datas em ISO 8601. */

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type Exercicio = {
  id: number;
  nome: string;
  grupoMuscular: string;
  personalizado: boolean;
};

export type ExercicioDoTreino = {
  id: number;
  ordem: number;
  exercicio: Exercicio;
  seriesPlanejadas: number;
  repeticoesPlanejadas: number;
  ultimaCargaKg: number | null;
};

export type Treino = {
  id: number;
  nome: string;
  descricao: string | null;
  diasDaSemana: string[];
  exercicios: ExercicioDoTreino[];
};

export type SerieRegistrada = {
  id: number;
  exercicioId: number;
  numero: number;
  cargaKg: number | null;
  repeticoes: number | null;
  concluida: boolean;
};

export type SessaoTreino = {
  id: number;
  treinoId: number | null;
  nomeTreino: string;
  inicio: string;
  fim: string | null;
  series: SerieRegistrada[];
};

export type PontoEvolucao = {
  data: string;
  cargaMaximaKg: number;
};

/** Corpo de erro da API (ProblemDetail). */
export type Problema = {
  status: number;
  detail?: string;
  campos?: Record<string, string>;
};
