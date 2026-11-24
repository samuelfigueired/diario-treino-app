import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apagarLocal, CHAVES_LOCAIS, gravarLocal, lerLocal } from '../armazenamento/local';
import { RascunhoTreino, validarRascunho } from '../regras';

type ValorTreinoEmAndamento = {
  /** Treino começado e ainda não salvo, ou null. */
  rascunho: RascunhoTreino | null;
  /** true depois de ler o rascunho salvo no aparelho. */
  carregado: boolean;
  guardar: (rascunho: RascunhoTreino) => void;
  descartar: () => void;
};

const TreinoEmAndamentoContext = createContext<ValorTreinoEmAndamento | null>(null);

/**
 * Treino em andamento compartilhado entre telas (Context API) e salvo no aparelho (AsyncStorage).
 * A tela de execução grava cada série preenchida; "Meus treinos" mostra o atalho para continuar.
 * Se o app fechar no meio do treino, as séries voltam ao reabrir.
 */
export function TreinoEmAndamentoProvider({ children }: { children: ReactNode }) {
  const [rascunho, setRascunho] = useState<RascunhoTreino | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    lerLocal(CHAVES_LOCAIS.treinoEmAndamento).then((salvo) => {
      const valido = validarRascunho(salvo, Date.now());
      if (!valido && salvo != null) apagarLocal(CHAVES_LOCAIS.treinoEmAndamento);
      setRascunho(valido);
      setCarregado(true);
    });
  }, []);

  const guardar = useCallback((novo: RascunhoTreino) => {
    setRascunho(novo);
    gravarLocal(CHAVES_LOCAIS.treinoEmAndamento, novo);
  }, []);

  const descartar = useCallback(() => {
    setRascunho(null);
    apagarLocal(CHAVES_LOCAIS.treinoEmAndamento);
  }, []);

  const valor = useMemo(() => ({ rascunho, carregado, guardar, descartar }), [rascunho, carregado, guardar, descartar]);
  return <TreinoEmAndamentoContext.Provider value={valor}>{children}</TreinoEmAndamentoContext.Provider>;
}

export function useTreinoEmAndamento(): ValorTreinoEmAndamento {
  const valor = useContext(TreinoEmAndamentoContext);
  if (!valor) throw new Error('useTreinoEmAndamento precisa estar dentro de TreinoEmAndamentoProvider.');
  return valor;
}
