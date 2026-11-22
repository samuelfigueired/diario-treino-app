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
  children?: ReactNode;
};

/** Contêiner padrão de tela: fundo escuro, área segura, cabeçalho opcional e rodapé fixo. */
export function Tela({ titulo, subtitulo, acao, rodape, children }: Props) {
  const temCabecalho = Boolean(titulo || subtitulo || acao);
  return (
    <SafeAreaView style={estilos.raiz} edges={rodape ? ['top', 'bottom'] : ['top']}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        {temCabecalho ? (
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
        ) : null}
        {children}
      </ScrollView>
      {rodape ? <View style={estilos.rodape}>{rodape}</View> : null}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, padding: espaco.xl, paddingTop: espaco.xxl, gap: espaco.xl },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  titulo: { ...fonte.titulo, color: cores.texto },
  subtitulo: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  rodape: { paddingHorizontal: espaco.xl, paddingTop: espaco.md, paddingBottom: espaco.lg, backgroundColor: cores.fundo },
});
