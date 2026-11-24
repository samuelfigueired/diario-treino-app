import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CHAVES_LOCAIS, gravarLocal, lerLocal } from '../armazenamento/local';
import { lerPreferencias, Preferencias, PREFERENCIAS_PADRAO } from '../regras';

type ValorPreferencias = {
  preferencias: Preferencias;
  alterar: (mudancas: Partial<Preferencias>) => void;
};

const PreferenciasContext = createContext<ValorPreferencias | null>(null);

/**
 * Preferências do app (Context API + AsyncStorage).
 * Ficam só no aparelho: não precisam ir para o banco.
 */
export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(PREFERENCIAS_PADRAO);

  useEffect(() => {
    lerLocal(CHAVES_LOCAIS.preferencias).then((salvo) => setPreferencias(lerPreferencias(salvo)));
  }, []);

  const alterar = useCallback((mudancas: Partial<Preferencias>) => {
    setPreferencias((atuais) => {
      const novas = lerPreferencias({ ...atuais, ...mudancas });
      gravarLocal(CHAVES_LOCAIS.preferencias, novas);
      return novas;
    });
  }, []);

  const valor = useMemo(() => ({ preferencias, alterar }), [preferencias, alterar]);
  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}

export function usePreferencias(): ValorPreferencias {
  const valor = useContext(PreferenciasContext);
  if (!valor) throw new Error('usePreferencias precisa estar dentro de PreferenciasProvider.');
  return valor;
}
