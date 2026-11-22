import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCriarExercicio, useExercicios } from '../../api';
import { cores, espaco, raio } from '../../tema';
import type { Exercicio } from '../../types';
import { Botao, BotaoIcone, Campo, Chip, EstadoLista, Icone } from '../ui';

const GRUPOS = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Glúteos', 'Abdômen', 'Outro'];

type Props = { visivel: boolean; aoFechar: () => void; aoEscolher: (exercicio: Exercicio) => void };

/** Modal para escolher um exercício do catálogo ou criar um personalizado (RF03). */
export function SeletorExercicio({ visivel, aoFechar, aoEscolher }: Props) {
  const exercicios = useExercicios();
  const criar = useCriarExercicio();
  const [busca, setBusca] = useState('');
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState('');
  const [grupo, setGrupo] = useState(GRUPOS[0]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (exercicios.data ?? []).filter(
      (e) => !termo || e.nome.toLowerCase().includes(termo) || e.grupoMuscular.toLowerCase().includes(termo),
    );
  }, [exercicios.data, busca]);

  function escolher(exercicio: Exercicio) {
    aoEscolher(exercicio);
    setBusca('');
    setCriando(false);
  }

  function salvarNovo() {
    if (!nome.trim()) return;
    criar.mutate(
      { nome: nome.trim(), grupoMuscular: grupo },
      {
        onSuccess: (novo) => {
          setNome('');
          escolher(novo);
        },
      },
    );
  }

  return (
    <Modal visible={visivel} animationType="slide" presentationStyle="pageSheet" onRequestClose={aoFechar}>
      <SafeAreaView style={estilos.raiz} edges={['top', 'bottom']}>
        <View style={estilos.cabecalho}>
          <Text accessibilityRole="header" style={estilos.titulo}>
            {criando ? 'Novo exercício' : 'Escolher exercício'}
          </Text>
          <BotaoIcone icone="fechar" rotulo="Fechar" onPress={aoFechar} />
        </View>

        {criando ? (
          <View style={{ gap: espaco.lg, padding: espaco.xl }}>
            <Campo rotulo="Nome do exercício" value={nome} onChangeText={setNome} placeholder="Ex.: Supino declinado" autoFocus />
            <View style={{ gap: espaco.sm }}>
              <Text style={estilos.rotulo}>Grupo muscular</Text>
              <View style={estilos.chips}>
                {GRUPOS.map((g) => (
                  <Chip key={g} texto={g} selecionado={g === grupo} onPress={() => setGrupo(g)} />
                ))}
              </View>
            </View>
            {criar.error ? <Text style={estilos.erro}>{criar.error.message}</Text> : null}
            <Botao titulo="Criar e adicionar" onPress={salvarNovo} carregando={criar.isPending} desabilitado={!nome.trim()} />
            <Botao titulo="Voltar para a lista" variante="secundario" onPress={() => setCriando(false)} />
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: espaco.xl, gap: espaco.md }}>
              <Campo rotulo="Buscar" value={busca} onChangeText={setBusca} placeholder="Nome ou grupo muscular" autoCorrect={false} />
              <Pressable accessibilityRole="button" onPress={() => setCriando(true)} style={estilos.criar}>
                <Icone nome="mais" tamanho={18} cor={cores.destaque} />
                <Text style={estilos.criarTexto}>Criar exercício personalizado</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: espaco.xl, paddingTop: espaco.md, gap: espaco.sm }} keyboardShouldPersistTaps="handled">
              <EstadoLista
                carregando={exercicios.isLoading}
                erro={exercicios.error}
                vazio={filtrados.length === 0}
                mensagemVazio="Nenhum exercício encontrado. Crie um personalizado."
                aoTentarDeNovo={() => exercicios.refetch()}
              >
                {filtrados.map((e) => (
                  <Pressable
                    key={e.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Adicionar ${e.nome}`}
                    onPress={() => escolher(e)}
                    style={({ pressed }) => [estilos.item, pressed && { opacity: 0.7 }]}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={estilos.nome}>{e.nome}</Text>
                      <Text style={estilos.grupo}>
                        {e.grupoMuscular}
                        {e.personalizado ? ' · personalizado' : ''}
                      </Text>
                    </View>
                    <Icone nome="mais" cor={cores.textoSecundario} />
                  </Pressable>
                ))}
              </EstadoLista>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: espaco.xl },
  titulo: { fontSize: 22, fontWeight: '700', color: cores.texto },
  rotulo: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  criar: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, minHeight: 44 },
  criarTexto: { fontSize: 14, fontWeight: '600', color: cores.destaque },
  item: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, backgroundColor: cores.cartao, borderRadius: raio.md, padding: 14, minHeight: 56 },
  nome: { fontSize: 15, fontWeight: '600', color: cores.texto },
  grupo: { fontSize: 12, color: cores.textoSecundario },
  erro: { fontSize: 14, color: cores.erro },
});
