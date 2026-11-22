import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ErroApi } from '../api';
import { cores } from '../tema';

/** Token expirado em qualquer chamada: volta para o login. */
function aoErro(erro: Error) {
  if (erro instanceof ErroApi && erro.status === 401) router.replace('/login');
}

/** Não repete erros do usuário (4xx); repete uma vez falhas de rede ou do servidor. */
function repetir(tentativas: number, erro: Error) {
  if (erro instanceof ErroApi && erro.status >= 400 && erro.status < 500) return false;
  return tentativas < 1;
}

export default function LayoutRaiz() {
  const [clienteQuery] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: aoErro }),
        mutationCache: new MutationCache({ onError: aoErro }),
        defaultOptions: { queries: { retry: repetir } },
      }),
  );
  return (
    <QueryClientProvider client={clienteQuery}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="treino/[id]/index" />
        <Stack.Screen name="treino/[id]/executar" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="treino/novo" options={{ presentation: 'modal' }} />
        <Stack.Screen name="treino/[id]/editar" options={{ presentation: 'modal' }} />
        <Stack.Screen name="sessao/[id]" />
      </Stack>
    </QueryClientProvider>
  );
}
