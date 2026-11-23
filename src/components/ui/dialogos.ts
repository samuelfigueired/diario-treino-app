import { Alert, Platform } from 'react-native';

/**
 * Avisos e confirmações que funcionam no celular (Alert nativo) e na versão web
 * (no navegador o Alert do React Native não faz nada, então usamos window.alert/confirm).
 */
const NA_WEB = Platform.OS === 'web';

export function avisar(titulo: string, mensagem: string): void {
  if (NA_WEB) {
    globalThis.alert?.(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
}

type Confirmacao = {
  titulo: string;
  mensagem: string;
  confirmar: string;
  cancelar?: string;
  destrutivo?: boolean;
  aoConfirmar: () => void;
};

export function confirmar({ titulo, mensagem, confirmar: textoConfirmar, cancelar = 'Cancelar', destrutivo, aoConfirmar }: Confirmacao): void {
  if (NA_WEB) {
    if (globalThis.confirm?.(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: cancelar, style: 'cancel' },
    { text: textoConfirmar, style: destrutivo ? 'destructive' : 'default', onPress: aoConfirmar },
  ]);
}
