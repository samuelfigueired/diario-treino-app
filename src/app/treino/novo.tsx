import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSalvarTreino, useTreinos } from '../../api';
import { FormularioTreino } from '../../components/treinos/FormularioTreino';
import { BotaoIcone, EstadoLista, Tela } from '../../components/ui';
import { formularioVazio } from '../../regras';
import { espaco } from '../../tema';

/** RF02 · Criação de treino. */
export default function NovoTreino() {
  const treinos = useTreinos();
  const salvar = useSalvarTreino();
  const inicial = useMemo(() => formularioVazio((treinos.data ?? []).map((t) => t.letra)), [treinos.data]);

  return (
    <Tela titulo="Novo treino" acao={<BotaoIcone icone="fechar" rotulo="Cancelar" onPress={() => router.back()} />}>
      <EstadoLista carregando={treinos.isLoading} erro={null} vazio={false} mensagemVazio="">
        <View style={estilos.corpo}>
          <FormularioTreino
            key={inicial.letra}
            inicial={inicial}
            tituloBotao="Criar treino"
            salvando={salvar.isPending}
            erroServidor={salvar.error?.message ?? null}
            aoSalvar={(entrada) => salvar.mutate(entrada, { onSuccess: (treino) => router.replace(`/treino/${treino.id}`) })}
          />
        </View>
      </EstadoLista>
    </Tela>
  );
}

const estilos = StyleSheet.create({ corpo: { gap: espaco.xl } });
