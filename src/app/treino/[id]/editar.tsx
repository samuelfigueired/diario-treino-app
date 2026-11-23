import { router, useLocalSearchParams } from 'expo-router';
import { useExcluirTreino, useSalvarTreino, useTreino } from '../../../api';
import { FormularioTreino } from '../../../components/treinos/FormularioTreino';
import { BotaoIcone, confirmar, EstadoLista, Tela } from '../../../components/ui';
import { formularioDeTreino } from '../../../regras';

/** RF02 e RF03 · Edição do treino: dados, dias, exercícios, séries, repetições e carga alvo. */
export default function EditarTreino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const treinoId = Number(id);
  const treino = useTreino(treinoId);
  const salvar = useSalvarTreino(treinoId);
  const excluir = useExcluirTreino();

  function confirmarExclusao() {
    confirmar({
      titulo: 'Excluir treino?',
      mensagem: 'Os treinos já registrados continuam no histórico.',
      confirmar: 'Excluir',
      destrutivo: true,
      aoConfirmar: () =>
        excluir.mutate(treinoId, {
          onSuccess: () => {
            if (router.canDismiss()) router.dismissAll();
            router.replace('/');
          },
        }),
    });
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
