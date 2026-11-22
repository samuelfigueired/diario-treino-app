import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  adicionarItem,
  alternarDia,
  ErrosFormulario,
  FormularioTreino as Formulario,
  ItemFormulario,
  moverItem,
  validarFormularioTreino,
} from '../../regras';
import { cores, espaco, raio } from '../../tema';
import type { DiaSemana, TreinoEntrada } from '../../types';
import { Botao, Campo, CampoCompacto, Chip, Icone } from '../ui';
import { SeletorExercicio } from './SeletorExercicio';

const DIAS: { valor: DiaSemana; rotulo: string }[] = [
  { valor: 'SEG', rotulo: 'Seg' },
  { valor: 'TER', rotulo: 'Ter' },
  { valor: 'QUA', rotulo: 'Qua' },
  { valor: 'QUI', rotulo: 'Qui' },
  { valor: 'SEX', rotulo: 'Sex' },
  { valor: 'SAB', rotulo: 'Sáb' },
  { valor: 'DOM', rotulo: 'Dom' },
];

type Props = {
  inicial: Formulario;
  tituloBotao: string;
  salvando: boolean;
  erroServidor: string | null;
  aoSalvar: (entrada: TreinoEntrada) => void;
  aoExcluir?: () => void;
};

/** Formulário de criação e edição de treino (RF02 e RF03): dados, dias e exercícios com séries, reps e carga. */
export function FormularioTreino({ inicial, tituloBotao, salvando, erroServidor, aoSalvar, aoExcluir }: Props) {
  const [form, setForm] = useState<Formulario>(inicial);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [seletorAberto, setSeletorAberto] = useState(false);

  const mudar = (parcial: Partial<Formulario>) => setForm((f) => ({ ...f, ...parcial }));
  const mudarItem = (indice: number, parcial: Partial<ItemFormulario>) =>
    setForm((f) => ({ ...f, itens: f.itens.map((item, i) => (i === indice ? { ...item, ...parcial } : item)) }));

  function salvar() {
    const resultado = validarFormularioTreino(form);
    if (!resultado.ok) {
      setErros(resultado.erros);
      return;
    }
    setErros({});
    aoSalvar(resultado.entrada);
  }

  return (
    <View style={{ gap: espaco.xl }}>
      <View style={estilos.linha}>
        <View style={{ width: 88 }}>
          <Campo rotulo="Letra" value={form.letra} onChangeText={(letra) => mudar({ letra })} erro={erros.letra} autoCapitalize="characters" maxLength={3} />
        </View>
        <View style={{ flex: 1 }}>
          <Campo rotulo="Nome" value={form.nome} onChangeText={(nome) => mudar({ nome })} erro={erros.nome} placeholder="Ex.: Peito e Tríceps" maxLength={80} />
        </View>
      </View>

      <View style={{ gap: espaco.sm }}>
        <Text style={estilos.rotulo}>Dias da semana</Text>
        <View style={estilos.chips}>
          {DIAS.map((d) => (
            <Chip key={d.valor} texto={d.rotulo} selecionado={form.dias.includes(d.valor)} onPress={() => mudar({ dias: alternarDia(form.dias, d.valor) })} />
          ))}
        </View>
      </View>

      <View style={{ width: 180 }}>
        <Campo rotulo="Duração estimada (min)" value={form.duracao} onChangeText={(duracao) => mudar({ duracao })} erro={erros.duracao} keyboardType="number-pad" placeholder="Opcional" />
      </View>

      <View style={{ gap: espaco.sm }}>
        <Text style={estilos.tituloSecao}>Exercícios</Text>
        {form.itens.length === 0 ? <Text style={estilos.vazio}>Adicione os exercícios deste treino.</Text> : null}
        {form.itens.map((item, i) => (
          <View key={item.chave} style={estilos.item}>
            <View style={estilos.linhaTitulo}>
              <Text style={estilos.numero}>{i + 1}</Text>
              <Text style={estilos.nome} numberOfLines={2}>
                {item.exercicio.nome}
              </Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`Subir ${item.exercicio.nome}`} hitSlop={6} onPress={() => mudar({ itens: moverItem(form.itens, i, -1) })} style={estilos.acao}>
                <Icone nome="cima" tamanho={18} cor={i === 0 ? cores.borda : cores.textoSecundario} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Descer ${item.exercicio.nome}`} hitSlop={6} onPress={() => mudar({ itens: moverItem(form.itens, i, 1) })} style={estilos.acao}>
                <Icone nome="baixo" tamanho={18} cor={i === form.itens.length - 1 ? cores.borda : cores.textoSecundario} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Remover ${item.exercicio.nome}`} hitSlop={6} onPress={() => mudar({ itens: form.itens.filter((_, j) => j !== i) })} style={estilos.acao}>
                <Icone nome="lixeira" tamanho={18} cor={cores.erro} />
              </Pressable>
            </View>
            <View style={estilos.campos}>
              <CampoCompacto rotulo="SÉRIES" value={item.series} onChangeText={(series) => mudarItem(i, { series })} keyboardType="number-pad" erro={!!erros[`itens.${i}.series`]} />
              <CampoCompacto rotulo="REPS" value={item.repeticoes} onChangeText={(repeticoes) => mudarItem(i, { repeticoes })} keyboardType="number-pad" erro={!!erros[`itens.${i}.repeticoes`]} />
              <CampoCompacto rotulo="CARGA (KG)" largura={96} value={item.carga} onChangeText={(carga) => mudarItem(i, { carga })} keyboardType="decimal-pad" placeholder="—" erro={!!erros[`itens.${i}.carga`]} />
            </View>
            {[erros[`itens.${i}.series`], erros[`itens.${i}.repeticoes`], erros[`itens.${i}.carga`]].filter(Boolean).map((m) => (
              <Text key={m} style={estilos.erro}>
                {m}
              </Text>
            ))}
          </View>
        ))}
        <Pressable accessibilityRole="button" onPress={() => setSeletorAberto(true)} style={estilos.adicionar}>
          <Icone nome="mais" tamanho={18} cor={cores.destaque} />
          <Text style={estilos.adicionarTexto}>Adicionar exercício</Text>
        </Pressable>
      </View>

      {erroServidor ? <Text style={[estilos.erro, { textAlign: 'center' }]}>{erroServidor}</Text> : null}
      <Botao titulo={tituloBotao} onPress={salvar} carregando={salvando} />
      {aoExcluir ? <Botao titulo="Excluir treino" variante="secundario" onPress={aoExcluir} /> : null}

      <SeletorExercicio
        visivel={seletorAberto}
        aoFechar={() => setSeletorAberto(false)}
        aoEscolher={(exercicio) => {
          mudar({ itens: adicionarItem(form.itens, exercicio) });
          setSeletorAberto(false);
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', gap: espaco.md },
  rotulo: { fontSize: 13, fontWeight: '500', color: cores.textoSecundario },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  tituloSecao: { fontSize: 17, fontWeight: '600', color: cores.texto },
  vazio: { fontSize: 14, color: cores.textoSecundario },
  item: { backgroundColor: cores.cartao, borderRadius: raio.md + 2, padding: 14, gap: espaco.md },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  numero: { width: 22, fontSize: 13, fontWeight: '700', color: cores.textoSecundario },
  nome: { flex: 1, fontSize: 15, fontWeight: '600', color: cores.texto },
  acao: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  campos: { flexDirection: 'row', gap: espaco.md, paddingLeft: 30 },
  erro: { fontSize: 13, color: cores.erro },
  adicionar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: espaco.sm,
    minHeight: 52,
    borderRadius: raio.md + 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: cores.borda,
  },
  adicionarTexto: { fontSize: 14, fontWeight: '600', color: cores.destaque },
});
