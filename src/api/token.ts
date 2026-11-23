import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE_TOKEN = 'diario-treino.token';
const NA_WEB = Platform.OS === 'web';

/**
 * Token de acesso. No celular fica no SecureStore (nunca no AsyncStorage).
 * Na versão web (navegador), fica no localStorage do site.
 */
export async function obterToken(): Promise<string | null> {
  if (NA_WEB) return lerNaWeb();
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function salvarToken(token: string): Promise<void> {
  if (NA_WEB) return gravarNaWeb(token);
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function apagarToken(): Promise<void> {
  if (NA_WEB) return gravarNaWeb(null);
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
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
