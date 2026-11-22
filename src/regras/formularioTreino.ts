import type { DiaSemana, Exercicio, Treino, TreinoEntrada } from '../types';
import { cargaParaCampo, converterCarga, converterRepeticoes } from './carga';

/** Exercício no formulário de treino (valores ainda como texto digitado). */
export type ItemFormulario = {
  chave: string;
  exercicio: Exercicio;
  series: string;
  repeticoes: string;
  carga: string;
};

export type FormularioTreino = {
  letra: string;
  nome: string;
  dias: DiaSemana[];
  duracao: string;
  itens: ItemFormulario[];
};

export type ErrosFormulario = Record<string, string>;

export const SERIES_PADRAO = '3';
export const REPETICOES_PADRAO = '12';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAXIMO_SERIES = 20;
const MAXIMO_REPETICOES = 200;

let contador = 0;
const novaChave = () => `item-${Date.now()}-${contador++}`;

/** Primeira letra ainda não usada pelos treinos do usuário (A, B, C...). */
export function proximaLetra(usadas: string[]): string {
  const ocupadas = new Set(usadas.map((l) => l.trim().toUpperCase()));
  return [...LETRAS].find((l) => !ocupadas.has(l)) ?? '';
}

export function formularioVazio(letrasUsadas: string[]): FormularioTreino {
  return { letra: proximaLetra(letrasUsadas), nome: '', dias: [], duracao: '', itens: [] };
}

/** Preenche o formulário com um treino existente (edição). */
export function formularioDeTreino(treino: Treino): FormularioTreino {
  return {
    letra: treino.letra,
    nome: treino.nome,
    dias: [...treino.diasDaSemana],
    duracao: treino.duracaoEstimadaMin == null ? '' : String(treino.duracaoEstimadaMin),
    itens: treino.exercicios.map((item) => ({
      chave: novaChave(),
      exercicio: item.exercicio,
      series: String(item.seriesPlanejadas),
      repeticoes: String(item.repeticoesPlanejadas),
      carga: cargaParaCampo(item.cargaPlanejadaKg),
    })),
  };
}

/** Acrescenta um exercício ao fim da lista, com séries e repetições padrão. */
export function adicionarItem(itens: ItemFormulario[], exercicio: Exercicio): ItemFormulario[] {
  return [...itens, { chave: novaChave(), exercicio, series: SERIES_PADRAO, repeticoes: REPETICOES_PADRAO, carga: '' }];
}

/** Move o item uma posição para cima (-1) ou para baixo (+1). Fora dos limites, não muda nada. */
export function moverItem<T>(itens: T[], indice: number, direcao: -1 | 1): T[] {
  const destino = indice + direcao;
  if (destino < 0 || destino >= itens.length) return itens;
  const copia = [...itens];
  [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
  return copia;
}

/** Marca ou desmarca um dia da semana. */
export function alternarDia(dias: DiaSemana[], dia: DiaSemana): DiaSemana[] {
  return dias.includes(dia) ? dias.filter((d) => d !== dia) : [...dias, dia];
}

function inteiroAte(texto: string, maximo: number): number | null {
  const valor = converterRepeticoes(texto);
  return valor != null && valor <= maximo ? valor : null;
}

/**
 * Valida o formulário e monta o corpo da API. Erros por campo: "letra", "nome", "duracao",
 * "itens.<n>.series", "itens.<n>.repeticoes", "itens.<n>.carga".
 */
export function validarFormularioTreino(
  form: FormularioTreino,
): { ok: true; entrada: TreinoEntrada } | { ok: false; erros: ErrosFormulario } {
  const erros: ErrosFormulario = {};
  const letra = form.letra.trim().toUpperCase();
  if (!letra) erros.letra = 'Informe a letra.';
  else if (letra.length > 3) erros.letra = 'Use até 3 caracteres.';
  if (!form.nome.trim()) erros.nome = 'Informe o nome do treino.';
  const duracao = form.duracao.trim() === '' ? null : converterRepeticoes(form.duracao);
  if (form.duracao.trim() !== '' && duracao == null) erros.duracao = 'Informe os minutos em número inteiro.';

  const exercicios = form.itens.map((item, i) => {
    const series = inteiroAte(item.series, MAXIMO_SERIES);
    const repeticoes = inteiroAte(item.repeticoes, MAXIMO_REPETICOES);
    const carga = item.carga.trim() === '' ? null : converterCarga(item.carga);
    if (series == null) erros[`itens.${i}.series`] = `Séries de 1 a ${MAXIMO_SERIES}.`;
    if (repeticoes == null) erros[`itens.${i}.repeticoes`] = `Repetições de 1 a ${MAXIMO_REPETICOES}.`;
    if (item.carga.trim() !== '' && carga == null) erros[`itens.${i}.carga`] = 'Carga inválida.';
    return { exercicioId: item.exercicio.id, seriesPlanejadas: series ?? 0, repeticoesPlanejadas: repeticoes ?? 0, cargaPlanejadaKg: carga };
  });

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return {
    ok: true,
    entrada: { letra, nome: form.nome.trim(), diasDaSemana: form.dias, duracaoEstimadaMin: duracao, exercicios },
  };
}
