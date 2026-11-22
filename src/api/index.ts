import { criarApi } from './cliente';
import { obterToken } from './token';

/** URL da API. No celular, use o IP do computador no .env (EXPO_PUBLIC_API_URL), não localhost. */
const URL_API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const api = criarApi(URL_API, obterToken);
export { ErroApi } from './cliente';
export { chaves } from './chaves';
