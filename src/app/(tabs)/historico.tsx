import { Text } from 'react-native';
import { Tela } from '../../components/ui';
import { cores } from '../../tema';

/** RF05 · Histórico de treinos realizados. Protótipo: tela 05. */
export default function Historico() {
  return (
    <Tela titulo="Histórico" subtitulo="Últimos 30 dias">
      <Text style={{ color: cores.textoSecundario }}>Nenhum treino registrado ainda.</Text>
    </Tela>
  );
}
