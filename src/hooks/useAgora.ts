import { useEffect, useState } from 'react';

/** Hora atual (ms) atualizada a cada `intervaloMs`, para cronômetros. */
export function useAgora(intervaloMs = 1000): number {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);
  return agora;
}
