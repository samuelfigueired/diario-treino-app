import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Botao, Tela } from '../../../components/ui';
import { cores } from '../../../tema';

/** RF03 · Detalhe do treino e exercícios associados. Protótipo: tela 03. */
export default function DetalheTreino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Tela titulo="Detalhe do treino" subtitulo={`Treino ${id}`}>
      <Text style={{ color: cores.textoSecundario }}>Exercícios virão de GET /api/treinos/{id}.</Text>
      <Botao titulo="Iniciar treino" onPress={() => router.push(`/treino/${id}/executar`)} />
      <Botao titulo="Voltar" variante="secundario" onPress={() => router.back()} />
    </Tela>
  );
}
