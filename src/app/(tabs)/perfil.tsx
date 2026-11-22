import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { apagarToken, useUsuario } from '../../api';
import { Botao, Cartao, EstadoLista, Tela } from '../../components/ui';
import { cores, espaco } from '../../tema';

/** RF01 · Perfil do usuário e saída da conta. */
export default function Perfil() {
  const usuario = useUsuario();
  const clienteQuery = useQueryClient();

  async function sair() {
    await apagarToken();
    clienteQuery.clear();
    router.replace('/login');
  }

  return (
    <Tela titulo="Perfil">
      <EstadoLista carregando={usuario.isLoading} erro={usuario.error} vazio={false} mensagemVazio="" aoTentarDeNovo={() => usuario.refetch()}>
        {usuario.data ? (
          <Cartao>
            <View style={{ gap: espaco.xs }}>
              <Text style={estilos.nome}>{usuario.data.nome}</Text>
              <Text style={estilos.email}>{usuario.data.email}</Text>
            </View>
          </Cartao>
        ) : null}
      </EstadoLista>
      <Botao titulo="Sair" variante="secundario" onPress={sair} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  nome: { fontSize: 18, fontWeight: '600', color: cores.texto },
  email: { fontSize: 14, color: cores.textoSecundario },
});
