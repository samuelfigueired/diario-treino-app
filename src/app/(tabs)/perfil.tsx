import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { apagarToken, USANDO_DADOS_EXEMPLO } from '../../api';
import { Botao, Cartao, Tela } from '../../components/ui';
import { cores } from '../../tema';

/** RF01 · Perfil do usuário e saída da conta. Não faz parte do protótipo; tela mínima. */
export default function Perfil() {
  async function sair() {
    await apagarToken();
    router.replace('/login');
  }

  return (
    <Tela titulo="Perfil">
      {USANDO_DADOS_EXEMPLO ? (
        <Cartao>
          <Text style={estilos.titulo}>Dados de exemplo</Text>
          <Text style={estilos.texto}>
            Treinos, histórico e evolução estão vindo de dados fictícios. Para usar a API, defina
            EXPO_PUBLIC_DADOS_EXEMPLO=false no arquivo .env.
          </Text>
        </Cartao>
      ) : null}
      <Botao titulo="Sair" variante="secundario" onPress={sair} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '600', color: cores.texto },
  texto: { fontSize: 13, lineHeight: 19, color: cores.textoSecundario },
});
