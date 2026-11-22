import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ExercicioEntrada, NovaSessao, TreinoEntrada } from '../types';
import { chaves } from './chaves';
import * as servicos from './servicos';

export const useUsuario = () => useQuery({ queryKey: chaves.usuario, queryFn: servicos.obterUsuario });

export const useTreinos = () => useQuery({ queryKey: chaves.treinos, queryFn: servicos.listarTreinos });

export const useTreino = (id: number) =>
  useQuery({ queryKey: chaves.treino(id), queryFn: () => servicos.obterTreino(id), enabled: Number.isFinite(id) });

export const useExercicios = () => useQuery({ queryKey: chaves.exercicios, queryFn: servicos.listarExercicios });

export const useSessoes = () => useQuery({ queryKey: chaves.sessoes, queryFn: servicos.listarSessoes });

export const useSessao = (id: number) =>
  useQuery({ queryKey: chaves.sessao(id), queryFn: () => servicos.obterSessao(id), enabled: Number.isFinite(id) });

/** Invalida tudo que depende de treinos e sessões (lista, detalhe, última carga, histórico). */
function useInvalidarTreinosESessoes() {
  const cliente = useQueryClient();
  return () => {
    cliente.invalidateQueries({ queryKey: chaves.treinos });
    cliente.invalidateQueries({ queryKey: chaves.sessoes });
  };
}

export function useSalvarTreino(id?: number) {
  const invalidar = useInvalidarTreinosESessoes();
  return useMutation({
    mutationFn: (treino: TreinoEntrada) => (id == null ? servicos.criarTreino(treino) : servicos.atualizarTreino(id, treino)),
    onSuccess: invalidar,
  });
}

export function useExcluirTreino() {
  const invalidar = useInvalidarTreinosESessoes();
  return useMutation({ mutationFn: (id: number) => servicos.excluirTreino(id), onSuccess: invalidar });
}

export function useCriarExercicio() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (exercicio: ExercicioEntrada) => servicos.criarExercicio(exercicio),
    onSuccess: () => cliente.invalidateQueries({ queryKey: chaves.exercicios }),
  });
}

/** Salva a sessão concluída e atualiza histórico, evolução e últimas cargas dos treinos. */
export function useRegistrarSessao() {
  const invalidar = useInvalidarTreinosESessoes();
  return useMutation({ mutationFn: (sessao: NovaSessao) => servicos.registrarSessao(sessao), onSuccess: invalidar });
}

export function useAtualizarSessao(id: number) {
  const invalidar = useInvalidarTreinosESessoes();
  return useMutation({ mutationFn: (sessao: NovaSessao) => servicos.atualizarSessao(id, sessao), onSuccess: invalidar });
}

export function useExcluirSessao() {
  const invalidar = useInvalidarTreinosESessoes();
  return useMutation({ mutationFn: (id: number) => servicos.excluirSessao(id), onSuccess: invalidar });
}
