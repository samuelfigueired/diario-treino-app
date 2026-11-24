import { useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apagarToken, observarToken, obterToken, salvarToken } from '../api';

type ValorAutenticacao = {
  /** Token de acesso atual, ou null se ninguém entrou. */
  token: string | null;
  /** true enquanto o token salvo ainda está sendo lido do aparelho. */
  carregando: boolean;
  entrar: (token: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AutenticacaoContext = createContext<ValorAutenticacao | null>(null);

/**
 * Estado de login compartilhado pelo app (Context API).
 * Usado pela tela de login, pelo perfil e pela proteção das abas.
 * O token em si continua guardado no SecureStore (api/token.ts).
 */
export function AutenticacaoProvider({ children }: { children: ReactNode }) {
  const clienteQuery = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterToken()
      .then(setToken)
      .catch(() => setToken(null))
      .finally(() => setCarregando(false));
    // Mantém o contexto em dia quando o token muda fora daqui (ex.: sessão expirada).
    return observarToken(setToken);
  }, []);

  const entrar = useCallback(
    async (novoToken: string) => {
      await salvarToken(novoToken);
      clienteQuery.clear();
    },
    [clienteQuery],
  );

  const sair = useCallback(async () => {
    await apagarToken();
    clienteQuery.clear();
  }, [clienteQuery]);

  const valor = useMemo(() => ({ token, carregando, entrar, sair }), [token, carregando, entrar, sair]);
  return <AutenticacaoContext.Provider value={valor}>{children}</AutenticacaoContext.Provider>;
}

export function useAutenticacao(): ValorAutenticacao {
  const valor = useContext(AutenticacaoContext);
  if (!valor) throw new Error('useAutenticacao precisa estar dentro de AutenticacaoProvider.');
  return valor;
}
