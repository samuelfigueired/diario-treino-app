import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espaco, fonte } from '../../tema';

type Props = {
  titulo?: string;
  subtitulo?: string;
  /** Elemento à direita do título (avatar, ação). */
  acao?: ReactNode;
  /** Conteúdo fixo no rodapé, fora da rolagem (botão principal da tela). */
  rodape?: ReactNode;
  /**
   * false quando o conteúdo já rola sozinho (FlatList): evita lista dentro de ScrollView.
   * O cabeçalho fica fixo e o filho ocupa o resto da tela.
   */
  rolagem?: boolean;
  children?: ReactNode;
};

/** Contêiner padrão de tela: fundo escuro, área segura, cabeçalho opcional e rodapé fixo. */
export function Tela({ titulo, subtitulo, acao, rodape, rolagem = true, children }: Props) {
  const cabecalho =
    titulo || subtitulo || acao ? (
      <View style={estilos.cabecalho}>
        <View style={{ flex: 1, gap: espaco.xs }}>
          {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
          {titulo ? (
            <Text accessibilityRole="header" style={estilos.titulo}>
              {titulo}
            </Text>
          ) : null}
        </View>
        {acao}
      </View>
    ) : null;

  return (
    <SafeAreaView style={estilos.raiz} edges={rodape ? ['top', 'bottom'] : ['top']}>
      {rolagem ? (
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {cabecalho}
          {children}
        </ScrollView>
      ) : (
        <View style={estilos.fixo}>
          <View style={estilos.cabecalhoFixo}>{cabecalho}</View>
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      )}
      {rodape ? <View style={estilos.rodape}>{rodape}</View> : null}
    </SafeAreaView>
  );
}

/** Estilo do conteúdo de uma FlatList dentro de <Tela rolagem={false}>, com o mesmo respiro das outras telas. */
export const estiloConteudoLista = {
  paddingHorizontal: espaco.xl,
  paddingTop: espaco.xl,
  paddingBottom: espaco.xxl,
} as const;

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, padding: espaco.xl, paddingTop: espaco.xxl, gap: espaco.xl },
  fixo: { flex: 1 },
  cabecalhoFixo: { paddingHorizontal: espaco.xl, paddingTop: espaco.xxl },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  titulo: { ...fonte.titulo, color: cores.texto },
  subtitulo: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  rodape: { paddingHorizontal: espaco.xl, paddingTop: espaco.md, paddingBottom: espaco.lg, backgroundColor: cores.fundo },
});
