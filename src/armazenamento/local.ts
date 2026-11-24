import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazenamento local do aparelho (AsyncStorage) para dados que não vão para o banco:
 * preferências do app e o rascunho do treino em andamento.
 * O token de acesso NÃO fica aqui: ele vai para o SecureStore (ver api/token.ts).
 */
export const CHAVES_LOCAIS = {
  preferencias: 'diario-treino.preferencias',
  treinoEmAndamento: 'diario-treino.treino-em-andamento',
} as const;

/** Lê e converte um JSON salvo. Devolve null se não existir ou estiver corrompido. */
export async function lerLocal(chave: string): Promise<unknown> {
  try {
    const texto = await AsyncStorage.getItem(chave);
    return texto == null ? null : JSON.parse(texto);
  } catch {
    return null;
  }
}

/** Salva um valor como JSON. Falhas são ignoradas: o app segue funcionando sem o dado local. */
export async function gravarLocal(chave: string, valor: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Sem espaço ou armazenamento indisponível: o dado vale só enquanto o app estiver aberto.
  }
}

export async function apagarLocal(chave: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(chave);
  } catch {
    // Nada a fazer: na próxima leitura o dado inválido é descartado.
  }
}
