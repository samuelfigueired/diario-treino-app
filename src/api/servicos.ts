import type { Exercicio, NovaSessao, Sessao, SessaoTreino, Treino } from '../types';
import { api } from './cliente-padrao';
import { criarDadosExemplo } from './exemplo/dados';

/**
 * Chamadas à API usadas pelas telas. Enquanto os módulos do backend não existem,
 * EXPO_PUBLIC_DADOS_EXEMPLO (padrão: ligado) faz as funções responderem com dados fictícios.
 */
export const USANDO_DADOS_EXEMPLO = process.env.EXPO_PUBLIC_DADOS_EXEMPLO !== 'false';

const MENSAGEM_TREINO_NAO_ENCONTRADO = 'Treino não encontrado.';
const ATRASO_SIMULADO_MS = 250;

const exemplo = criarDadosExemplo();
/** Devolve uma cópia após um pequeno atraso, como faria a rede (a cópia evita que o cache aponte para o mesmo objeto). */
const esperar = <T>(valor: T) =>
  new Promise<T>((r) => setTimeout(() => r(JSON.parse(JSON.stringify(valor)) as T), ATRASO_SIMULADO_MS));

export async function entrar(email: string, senha: string): Promise<Sessao> {
  if (USANDO_DADOS_EXEMPLO) {
    return esperar({ token: 'token-de-exemplo', usuario: { id: 1, nome: 'Mariana Alves Rocha', email } });
  }
  return api.post<Sessao>('/api/auth/login', { email, senha });
}

export async function criarConta(nome: string, email: string, senha: string): Promise<Sessao> {
  if (USANDO_DADOS_EXEMPLO) return esperar({ token: 'token-de-exemplo', usuario: { id: 1, nome, email } });
  return api.post<Sessao>('/api/auth/cadastro', { nome, email, senha });
}

export async function listarTreinos(): Promise<Treino[]> {
  if (USANDO_DADOS_EXEMPLO) return esperar(exemplo.treinos);
  return api.get<Treino[]>('/api/treinos');
}

export async function obterTreino(id: number): Promise<Treino> {
  if (USANDO_DADOS_EXEMPLO) {
    const treino = exemplo.treinos.find((t) => t.id === id);
    if (!treino) throw new Error(MENSAGEM_TREINO_NAO_ENCONTRADO);
    return esperar(treino);
  }
  return api.get<Treino>(`/api/treinos/${id}`);
}

export async function listarExercicios(): Promise<Exercicio[]> {
  if (USANDO_DADOS_EXEMPLO) return esperar(exemplo.exercicios);
  return api.get<Exercicio[]>('/api/exercicios');
}

export async function listarSessoes(): Promise<SessaoTreino[]> {
  if (USANDO_DADOS_EXEMPLO) return esperar(exemplo.sessoes);
  return api.get<SessaoTreino[]>('/api/sessoes');
}

export async function registrarSessao(sessao: NovaSessao): Promise<SessaoTreino> {
  if (USANDO_DADOS_EXEMPLO) {
    const salva = { ...sessao, id: exemplo.sessoes.length + 1000 };
    exemplo.sessoes.push(salva);
    for (const treino of exemplo.treinos.filter((t) => t.id === sessao.treinoId)) {
      for (const item of treino.exercicios) {
        const ultima = sessao.series.filter((s) => s.exercicioId === item.exercicio.id).pop();
        if (ultima?.cargaKg != null) item.ultimaCargaKg = ultima.cargaKg;
      }
    }
    return esperar(salva);
  }
  return api.post<SessaoTreino>('/api/sessoes', sessao);
}
