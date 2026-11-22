/** Tipos que espelham a API (diario-treino-api). Datas em ISO 8601. */

export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type Sessao = {
  token: string;
  usuario: Usuario;
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
  /** Carga usada na última vez em que o exercício foi feito (kg). */
  ultimaCargaKg: number | null;
};

export type Treino = {
  id: number;
  /** Letra do treino na divisão (A, B, C...). */
  letra: string;
  nome: string;
  diasDaSemana: DiaSemana[];
  duracaoEstimadaMin: number | null;
  exercicios: ExercicioDoTreino[];
};

export type SerieRegistrada = {
  exercicioId: number;
  numero: number;
  cargaKg: number | null;
  repeticoes: number | null;
  concluida: boolean;
};

export type SessaoTreino = {
  id: number;
  treinoId: number | null;
  /** Nome do treino no momento da execução (o treino pode ser renomeado ou apagado depois). */
  nomeTreino: string;
  letraTreino: string;
  inicio: string;
  fim: string | null;
  series: SerieRegistrada[];
};

export type NovaSessao = Omit<SessaoTreino, 'id'>;

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
