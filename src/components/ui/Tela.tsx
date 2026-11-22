import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espaco, fonte } from '../../tema';

type Props = {
  titulo?: string;
  subtitulo?: string;
  children?: ReactNode;
  rolar?: boolean;
};

/** Contêiner padrão de tela: fundo escuro, área segura e cabeçalho opcional. */
export function Tela({ titulo, subtitulo, children, rolar = true }: Props) {
  const conteudo = (
    <View style={estilos.conteudo}>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
      {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
      {children}
    </View>
  );
  return (
    <SafeAreaView style={estilos.raiz} edges={['top']}>
      {rolar ? <ScrollView contentContainerStyle={estilos.rolagem}>{conteudo}</ScrollView> : conteudo}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  rolagem: { flexGrow: 1 },
  conteudo: { flex: 1, padding: espaco.xl, gap: espaco.xl },
  titulo: { ...fonte.titulo, color: cores.texto },
  subtitulo: { ...fonte.legenda, color: cores.textoSecundario, marginBottom: -espaco.md },
});
