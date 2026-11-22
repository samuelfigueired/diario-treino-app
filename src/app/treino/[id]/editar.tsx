import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useExcluirTreino, useSalvarTreino, useTreino } from '../../../api';
import { FormularioTreino } from '../../../components/treinos/FormularioTreino';
import { BotaoIcone, EstadoLista, Tela } from '../../../components/ui';
import { formularioDeTreino } from '../../../regras';

/** RF02 e RF03 · Edição do treino: dados, dias, exercícios, séries, repetições e carga alvo. */
export default function EditarTreino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const treinoId = Number(id);
  const treino = useTreino(treinoId);
  const salvar = useSalvarTreino(treinoId);
  const excluir = useExcluirTreino();

  function confirmarExclusao() {
    Alert.alert('Excluir treino?', 'Os treinos já registrados continuam no histórico.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          excluir.mutate(treinoId, {
            onSuccess: () => {
              router.dismissAll();
              router.replace('/');
            },
          }),
      },
    ]);
  }

  return (
    <Tela titulo="Editar treino" acao={<BotaoIcone icone="fechar" rotulo="Cancelar" onPress={() => router.back()} />}>
      <EstadoLista carregando={treino.isLoading} erro={treino.error} vazio={false} mensagemVazio="" aoTentarDeNovo={() => treino.refetch()}>
        {treino.data ? (
          <FormularioTreino
            inicial={formularioDeTreino(treino.data)}
            tituloBotao="Salvar alterações"
            salvando={salvar.isPending}
            erroServidor={salvar.error?.message ?? excluir.error?.message ?? null}
            aoSalvar={(entrada) => salvar.mutate(entrada, { onSuccess: () => router.back() })}
            aoExcluir={confirmarExclusao}
          />
        ) : null}
      </EstadoLista>
    </Tela>
  );
}
