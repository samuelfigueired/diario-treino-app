import { Redirect } from 'expo-router';

/** Entrada do app. Enquanto a autenticação (RF01) não existe, abre direto o login. */
export default function Inicio() {
  return <Redirect href="/login" />;
}
