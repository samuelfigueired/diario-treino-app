import { router } from 'expo-router';
import { Text } from 'react-native';
import { Botao, Tela } from '../../../components/ui';
import { cores } from '../../../tema';

/** RF04 · Registro de séries, repetições e cargas durante o treino. Protótipo: tela 04. */
export default function ExecutarTreino() {
  return (
    <Tela titulo="Treino em andamento">
      <Text style={{ color: cores.textoSecundario }}>Tabela de séries com carga e repetições.</Text>
      <Botao titulo="Finalizar" onPress={() => router.back()} />
    </Tela>
  );
}
