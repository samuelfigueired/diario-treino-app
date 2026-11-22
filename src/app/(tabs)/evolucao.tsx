import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSessoes, useTreinos } from '../../api';
import { EstadoLista, GraficoLinha, Icone, Indicador, Segmentado, Tela } from '../../components/ui';
import {
  cargaMaximaPorDia,
  dataDeIso,
  emToneladas,
  filtrarPeriodo,
  formatarCarga,
  formatarDiaMes,
  formatarNumero,
  isoData,
  Periodo,
  recordesDesde,
  resumoDaEvolucao,
  sessoesDosUltimosDias,
  totaisDasSessoes,
} from '../../regras';
import { cores, espaco, raio } from '../../tema';
import type { Exercicio } from '../../types';

const PERIODOS = [
  { valor: '1M', rotulo: '1M' },
  { valor: '3M', rotulo: '3M' },
  { valor: '6M', rotulo: '6M' },
  { valor: '1A', rotulo: '1A' },
] as const;
const DIAS_DO_MES = 30;
const SEMANAS_DA_FREQUENCIA = 4;

/** RF06 · Evolução das cargas e indicadores de desempenho. Protótipo: tela 06. */
export default function Evolucao() {
  const sessoes = useSessoes();
  const treinos = useTreinos();
  const hoje = useMemo(() => new Date(), []);
  const [periodo, setPeriodo] = useState<Periodo>('3M');
  const [escolhido, setEscolhido] = useState<number | null>(null);
  const [listaAberta, setListaAberta] = useState(false);

  const exercicios = useMemo(() => {
    const vistos = new Map<number, Exercicio>();
    treinos.data?.forEach((t) => t.exercicios.forEach((e) => e.ultimaCargaKg != null && vistos.set(e.exercicio.id, e.exercicio)));
    return [...vistos.values()];
  }, [treinos.data]);
  const exercicio = exercicios.find((e) => e.id === escolhido) ?? exercicios[0];

  const todasSessoes = sessoes.data ?? [];
  const pontos = useMemo(
    () => (exercicio ? filtrarPeriodo(cargaMaximaPorDia(todasSessoes, exercicio.id), periodo, hoje) : []),
    [todasSessoes, exercicio, periodo, hoje],
  );
  const resumo = resumoDaEvolucao(pontos);

  const doMes = sessoesDosUltimosDias(todasSessoes, DIAS_DO_MES, hoje);
  const totaisMes = totaisDasSessoes(doMes);
  const frequencia = sessoesDosUltimosDias(todasSessoes, SEMANAS_DA_FREQUENCIA * 7, hoje).length / SEMANAS_DA_FREQUENCIA;
  const inicioDoMes = isoData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (DIAS_DO_MES - 1)));
  const recordes = exercicios.reduce((total, e) => total + recordesDesde(cargaMaximaPorDia(todasSessoes, e.id), inicioDoMes), 0);

  return (
    <Tela subtitulo="Acompanhe suas cargas" titulo="Evolução">
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Exercício: ${exercicio?.nome ?? 'nenhum'}. Trocar exercício`}
          accessibilityState={{ expanded: listaAberta }}
          onPress={() => setListaAberta((a) => !a)}
          style={estilos.seletor}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={estilos.rotuloSeletor}>Exercício</Text>
            <Text style={estilos.valorSeletor}>{exercicio?.nome ?? 'Nenhum exercício com carga registrada'}</Text>
          </View>
          <Icone nome="baixo" />
        </Pressable>
        {listaAberta ? (
          <View style={estilos.lista}>
            {exercicios.map((e) => (
              <Pressable
                key={e.id}
                accessibilityRole="button"
                accessibilityState={{ selected: e.id === exercicio?.id }}
                onPress={() => {
                  setEscolhido(e.id);
                  setListaAberta(false);
                }}
                style={estilos.itemLista}
              >
                <Text style={[estilos.textoItem, e.id === exercicio?.id && { color: cores.destaque }]}>{e.nome}</Text>
                <Text style={estilos.grupoItem}>{e.grupoMuscular}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <EstadoLista
        carregando={sessoes.isLoading || treinos.isLoading}
        erro={sessoes.error ?? treinos.error}
        vazio={false}
        mensagemVazio=""
        aoTentarDeNovo={() => sessoes.refetch()}
      >
        <View style={estilos.cartao}>
          <View style={{ gap: espaco.xs }}>
            <Text style={estilos.rotuloSeletor}>Carga máxima</Text>
            <View style={estilos.linhaValor}>
              <Text style={estilos.valor}>{resumo ? formatarCarga(resumo.cargaMaximaKg) : '—'}</Text>
              {resumo && resumo.variacaoKg !== 0 ? (
                <View style={estilos.variacao}>
                  <Text style={estilos.textoVariacao}>
                    {resumo.variacaoKg > 0 ? '+' : ''}
                    {formatarNumero(resumo.variacaoKg)} kg
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={estilos.rotuloSeletor}>
              {resumo ? `em ${resumo.semanas} ${resumo.semanas === 1 ? 'semana' : 'semanas'}` : 'Sem registros no período'}
            </Text>
          </View>
          <Segmentado opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
          {pontos.length > 1 ? (
            <GraficoLinha
              pontos={pontos.map((p) => ({ valor: p.cargaMaximaKg, rotulo: formatarDiaMes(dataDeIso(p.data)) }))}
              descricao={`Carga máxima de ${formatarCarga(pontos[0].cargaMaximaKg)} para ${formatarCarga(pontos[pontos.length - 1].cargaMaximaKg)} no período`}
            />
          ) : (
            <Text style={estilos.semDados}>Registre este exercício em pelo menos dois dias para ver o gráfico.</Text>
          )}
        </View>

        <View style={estilos.grade}>
          <Indicador rotulo="Treinos no mês" valor={String(totaisMes.treinos)} />
          <Indicador rotulo="Frequência" valor={formatarNumero(frequencia, 1)} unidade="por semana" />
        </View>
        <View style={estilos.grade}>
          <Indicador rotulo="Volume total" valor={emToneladas(totaisMes.volumeKg)} unidade="t" />
          <Indicador rotulo="Recordes pessoais" valor={String(recordes)} unidade="no mês" />
        </View>
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    minHeight: 60,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
  },
  rotuloSeletor: { fontSize: 12, fontWeight: '500', color: cores.textoSecundario },
  valorSeletor: { fontSize: 15, fontWeight: '600', color: cores.texto },
  lista: { marginTop: espaco.sm, backgroundColor: cores.cartao, borderRadius: raio.md, paddingVertical: espaco.xs },
  itemLista: { minHeight: 48, paddingHorizontal: espaco.lg, justifyContent: 'center' },
  textoItem: { fontSize: 15, color: cores.texto },
  grupoItem: { fontSize: 12, color: cores.textoSecundario },
  cartao: { backgroundColor: cores.cartao, borderRadius: raio.xl, padding: 18, gap: 14 },
  linhaValor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  valor: { fontSize: 30, fontWeight: '700', color: cores.texto },
  variacao: { backgroundColor: cores.destaque, borderRadius: 6, paddingHorizontal: espaco.sm, paddingVertical: espaco.xs },
  textoVariacao: { fontSize: 12, fontWeight: '600', color: cores.textoSobreDestaque },
  semDados: { fontSize: 13, color: cores.textoSecundario, paddingVertical: espaco.xl, textAlign: 'center' },
  grade: { flexDirection: 'row', gap: 10 },
});
