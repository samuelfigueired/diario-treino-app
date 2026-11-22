import { router } from 'expo-router';
import { Text } from 'react-native';
import { Botao, Cartao, Tela } from '../../components/ui';
import { cores } from '../../tema';

/** RF02 · Meus treinos. Protótipo: tela 02. */
export default function MeusTreinos() {
  return (
    <Tela titulo="Meus treinos">
      <Cartao onPress={() => router.push('/treino/1')} rotuloAcessivel="Abrir Treino A">
        <Text style={{ color: cores.texto, fontSize: 16, fontWeight: '600' }}>Treino A · exemplo</Text>
        <Text style={{ color: cores.textoSecundario }}>A lista virá da API (GET /api/treinos).</Text>
      </Cartao>
      <Botao titulo="+  Novo treino" variante="secundario" />
    </Tela>
  );
}
