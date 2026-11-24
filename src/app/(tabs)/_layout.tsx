import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { Icone, NomeIcone } from '../../components/ui';
import { useAutenticacao } from '../../contextos';
import { cores } from '../../tema';

const ABAS: { nome: string; titulo: string; icone: NomeIcone }[] = [
  { nome: 'index', titulo: 'Treinos', icone: 'inicio' },
  { nome: 'historico', titulo: 'Histórico', icone: 'relogio' },
  { nome: 'evolucao', titulo: 'Evolução', icone: 'grafico' },
  { nome: 'perfil', titulo: 'Perfil', icone: 'usuario' },
];

/** Abas principais. Sem login salvo, manda para a tela de login. */
export default function LayoutAbas() {
  const { token, carregando } = useAutenticacao();

  if (carregando) return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;
  if (!token) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: cores.cartao, borderTopColor: cores.borda },
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      {ABAS.map((aba) => (
        <Tabs.Screen
          key={aba.nome}
          name={aba.nome}
          options={{ title: aba.titulo, tabBarIcon: ({ color }) => <Icone nome={aba.icone} tamanho={22} cor={String(color)} /> }}
        />
      ))}
    </Tabs>
  );
}
