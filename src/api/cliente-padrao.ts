import { criarApi } from './cliente';
import { apagarToken, obterToken } from './token';

/** URL da API. No celular, use o IP do computador no .env (EXPO_PUBLIC_API_URL), não localhost. */
const URL_API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

/** Token expirado ou inválido: apaga o token salvo (o layout raiz manda para o login). */
export const api = criarApi(URL_API, obterToken, apagarToken);
