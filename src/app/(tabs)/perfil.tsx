import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useUsuario } from '../../api';
import { Botao, Cartao, EstadoLista, Segmentado, Tela } from '../../components/ui';
import { useAutenticacao, usePreferencias, useTreinoEmAndamento } from '../../contextos';
import { OPCOES_DESCANSO_SEGUNDOS, rotuloDescanso } from '../../regras';
import { cores, espaco } from '../../tema';

const OPCOES_DESCANSO = OPCOES_DESCANSO_SEGUNDOS.map((s) => ({ valor: String(s), rotulo: `${s} s` }));

/** RF01 · Perfil do usuário, preferências do aparelho e saída da conta. */
export default function Perfil() {
  const usuario = useUsuario();
  const { sair } = useAutenticacao();
  const { preferencias, alterar } = usePreferencias();
  const { descartar } = useTreinoEmAndamento();

  async function sairDaConta() {
    descartar(); // o rascunho de treino é do usuário que está saindo
    await sair();
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

      <View style={{ gap: espaco.md }}>
        <Text accessibilityRole="header" style={estilos.secao}>Descanso entre séries</Text>
        <Segmentado
          opcoes={OPCOES_DESCANSO}
          valor={String(preferencias.descansoSegundos)}
          onChange={(v) => alterar({ descansoSegundos: Number(v) })}
        />
        <Text style={estilos.ajuda}>{rotuloDescanso(preferencias.descansoSegundos)}, salvo neste aparelho. O cronômetro começa ao concluir uma série.</Text>
      </View>

      <Botao titulo="Sair" variante="secundario" onPress={sairDaConta} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  nome: { fontSize: 18, fontWeight: '600', color: cores.texto },
  email: { fontSize: 14, color: cores.textoSecundario },
  secao: { fontSize: 17, fontWeight: '600', color: cores.texto },
  ajuda: { fontSize: 13, color: cores.textoSecundario },
});
