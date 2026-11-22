import { Text } from 'react-native';
import { Tela } from '../../components/ui';
import { cores } from '../../tema';

/** RF06 · Evolução das cargas e indicadores. Protótipo: tela 06. */
export default function Evolucao() {
  return (
    <Tela titulo="Evolução" subtitulo="Acompanhe suas cargas">
      <Text style={{ color: cores.textoSecundario }}>Registre treinos para ver sua evolução.</Text>
    </Tela>
  );
}
