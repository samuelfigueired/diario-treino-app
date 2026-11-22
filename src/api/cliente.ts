import type { Problema } from '../types';

const MENSAGEM_SEM_CONEXAO = 'Sem conexão com o servidor. Verifique sua internet e tente de novo.';
const MENSAGEM_ERRO_PADRAO = 'Não foi possível concluir agora. Tente novamente em instantes.';

export class ErroApi extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
    readonly campos: Record<string, string> = {},
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

type ObterToken = () => Promise<string | null>;
type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Cliente HTTP da API. Envia o token de acesso e converte ProblemDetail em ErroApi. */
export function criarApi(baseUrl: string, obterToken: ObterToken) {
  async function requisitar<T>(metodo: Metodo, caminho: string, corpo?: unknown): Promise<T> {
    const token = await obterToken();
    let resposta: Response;
    try {
      resposta = await fetch(`${baseUrl}${caminho}`, {
        method: metodo,
        headers: {
          Accept: 'application/json',
          ...(corpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      });
    } catch {
      throw new ErroApi(MENSAGEM_SEM_CONEXAO, 0);
    }
    if (!resposta.ok) {
      const problema = (await resposta.json().catch(() => null)) as Problema | null;
      throw new ErroApi(problema?.detail ?? MENSAGEM_ERRO_PADRAO, resposta.status, problema?.campos);
    }
    if (resposta.status === 204) return undefined as T;
    return (await resposta.json()) as T;
  }

  return {
    get: <T>(caminho: string) => requisitar<T>('GET', caminho),
    post: <T>(caminho: string, corpo?: unknown) => requisitar<T>('POST', caminho, corpo),
    put: <T>(caminho: string, corpo?: unknown) => requisitar<T>('PUT', caminho, corpo),
    patch: <T>(caminho: string, corpo?: unknown) => requisitar<T>('PATCH', caminho, corpo),
    del: <T = void>(caminho: string) => requisitar<T>('DELETE', caminho),
  };
}

export type Api = ReturnType<typeof criarApi>;
