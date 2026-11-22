import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = 'diario-treino.token';

export const obterToken = () => SecureStore.getItemAsync(CHAVE_TOKEN);
export const salvarToken = (token: string) => SecureStore.setItemAsync(CHAVE_TOKEN, token);
export const apagarToken = () => SecureStore.deleteItemAsync(CHAVE_TOKEN);
