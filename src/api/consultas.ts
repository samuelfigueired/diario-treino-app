import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NovaSessao } from '../types';
import { chaves } from './chaves';
import * as servicos from './servicos';

export const useTreinos = () => useQuery({ queryKey: chaves.treinos, queryFn: servicos.listarTreinos });

export const useTreino = (id: number) =>
  useQuery({ queryKey: chaves.treino(id), queryFn: () => servicos.obterTreino(id), enabled: Number.isFinite(id) });

export const useExercicios = () => useQuery({ queryKey: chaves.exercicios, queryFn: servicos.listarExercicios });

export const useSessoes = () => useQuery({ queryKey: chaves.sessoes, queryFn: servicos.listarSessoes });

/** Salva a sessão concluída e atualiza histórico, evolução e últimas cargas dos treinos. */
export function useRegistrarSessao() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (sessao: NovaSessao) => servicos.registrarSessao(sessao),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chaves.sessoes });
      cliente.invalidateQueries({ queryKey: chaves.treinos });
    },
  });
}
