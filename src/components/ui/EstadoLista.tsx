import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../../tema';
import { Botao } from './Botao';

type Props = {
  carregando: boolean;
  erro: Error | null;
  vazio: boolean;
  mensagemVazio: string;
  aoTentarDeNovo?: () => void;
  children: ReactNode;
};

/** Mostra carregando, erro ou vazio antes do conteúdo de uma lista. */
export function EstadoLista({ carregando, erro, vazio, mensagemVazio, aoTentarDeNovo, children }: Props) {
  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={cores.destaque} accessibilityLabel="Carregando" />
      </View>
    );
  }
  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.texto}>{erro.message}</Text>
        {aoTentarDeNovo ? <Botao titulo="Tentar de novo" variante="secundario" onPress={aoTentarDeNovo} /> : null}
      </View>
    );
  }
  if (vazio) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.texto}>{mensagemVazio}</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const estilos = StyleSheet.create({
  centro: { paddingVertical: espaco.xxl, alignItems: 'center', gap: espaco.lg },
  texto: { color: cores.textoSecundario, fontSize: 15, textAlign: 'center' },
});
