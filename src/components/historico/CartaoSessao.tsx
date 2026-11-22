import { StyleSheet, Text, View } from 'react-native';
import { formatarDuracao, formatarNumero, resumoDaSessao, siglaDia } from '../../regras';
import { cores, espaco, raio } from '../../tema';
import type { SessaoTreino } from '../../types';

type Props = { sessao: SessaoTreino };

/** Sessão realizada: data, treino, duração, séries e volume. */
export function CartaoSessao({ sessao }: Props) {
  const inicio = new Date(sessao.inicio);
  const resumo = resumoDaSessao(sessao);
  const titulo = `Treino ${sessao.letraTreino} · ${sessao.nomeTreino}`;
  const detalhe = `${formatarDuracao(resumo.minutos)} · ${resumo.series} séries · ${formatarNumero(resumo.volumeKg, 0)} kg`;
  return (
    <View style={estilos.raiz} accessible accessibilityLabel={`${siglaDia(inicio)} ${inicio.getDate()}, ${titulo}, ${detalhe}`}>
      <View style={estilos.data}>
        <Text style={estilos.diaSemana}>{siglaDia(inicio)}</Text>
        <Text style={estilos.dia}>{String(inicio.getDate()).padStart(2, '0')}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={estilos.titulo} numberOfLines={1}>
          {titulo}
        </Text>
        <Text style={estilos.detalhe}>{detalhe}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: cores.cartao, borderRadius: raio.md + 2, padding: espaco.md },
  data: { width: 48, height: 48, borderRadius: raio.md, backgroundColor: cores.cartaoElevado, alignItems: 'center', justifyContent: 'center' },
  diaSemana: { fontSize: 10, fontWeight: '600', color: cores.textoSecundario },
  dia: { fontSize: 18, fontWeight: '700', color: cores.texto },
  titulo: { fontSize: 15, fontWeight: '600', color: cores.texto },
  detalhe: { fontSize: 13, color: cores.textoSecundario },
});
