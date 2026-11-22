import type {
  Exercicio,
  ExercicioEntrada,
  NovaSessao,
  Sessao,
  SessaoTreino,
  Treino,
  TreinoEntrada,
  Usuario,
} from '../types';
import { api } from './cliente-padrao';

/** Uma função por rota da API (diario-treino-api). As telas usam os hooks de consultas.ts, não estas funções. */

export const entrar = (email: string, senha: string) => api.post<Sessao>('/api/auth/login', { email, senha });

export const criarConta = (nome: string, email: string, senha: string) =>
  api.post<Sessao>('/api/auth/cadastro', { nome, email, senha });

export const obterUsuario = () => api.get<Usuario>('/api/auth/me');

export const listarTreinos = () => api.get<Treino[]>('/api/treinos');

export const obterTreino = (id: number) => api.get<Treino>(`/api/treinos/${id}`);

export const criarTreino = (treino: TreinoEntrada) => api.post<Treino>('/api/treinos', treino);

export const atualizarTreino = (id: number, treino: TreinoEntrada) => api.put<Treino>(`/api/treinos/${id}`, treino);

export const excluirTreino = (id: number) => api.del(`/api/treinos/${id}`);

export const listarExercicios = () => api.get<Exercicio[]>('/api/exercicios');

export const criarExercicio = (exercicio: ExercicioEntrada) => api.post<Exercicio>('/api/exercicios', exercicio);

export const listarSessoes = () => api.get<SessaoTreino[]>('/api/sessoes');

export const obterSessao = (id: number) => api.get<SessaoTreino>(`/api/sessoes/${id}`);

export const registrarSessao = (sessao: NovaSessao) => api.post<SessaoTreino>('/api/sessoes', sessao);

export const atualizarSessao = (id: number, sessao: NovaSessao) => api.put<SessaoTreino>(`/api/sessoes/${id}`, sessao);

export const excluirSessao = (id: number) => api.del(`/api/sessoes/${id}`);
