import { router } from 'expo-router';
import { Botao, Tela } from '../../components/ui';

/** RF01 · Perfil do usuário e saída da conta. */
export default function Perfil() {
  return (
    <Tela titulo="Perfil">
      <Botao titulo="Sair" variante="secundario" onPress={() => router.replace('/login')} />
    </Tela>
  );
}
