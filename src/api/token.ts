import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE_TOKEN = 'diario-treino.token';
const NA_WEB = Platform.OS === 'web';

/**
 * Token de acesso. No celular fica no SecureStore (nunca no AsyncStorage).
 * Na versão web (navegador), fica no localStorage do site.
 */
type Ouvinte = (token: string | null) => void;
const ouvintes = new Set<Ouvinte>();

/** Avisa quem precisa saber (o AutenticacaoContext) quando o token muda, inclusive ao expirar. */
export function observarToken(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

function avisarOuvintes(token: string | null) {
  ouvintes.forEach((ouvinte) => ouvinte(token));
}

export async function obterToken(): Promise<string | null> {
  if (NA_WEB) return lerNaWeb();
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function salvarToken(token: string): Promise<void> {
  if (NA_WEB) gravarNaWeb(token);
  else await SecureStore.setItemAsync(CHAVE_TOKEN, token);
  avisarOuvintes(token);
}

export async function apagarToken(): Promise<void> {
  if (NA_WEB) gravarNaWeb(null);
  else await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  avisarOuvintes(null);
}

function lerNaWeb(): string | null {
  try {
    return globalThis.localStorage?.getItem(CHAVE_TOKEN) ?? null;
  } catch {
    return null;
  }
}

function gravarNaWeb(token: string | null): void {
  try {
    if (token) globalThis.localStorage?.setItem(CHAVE_TOKEN, token);
    else globalThis.localStorage?.removeItem(CHAVE_TOKEN);
  } catch {
    // Navegador sem armazenamento (ex.: aba anônima bloqueada): o login vale só até recarregar.
  }
}
