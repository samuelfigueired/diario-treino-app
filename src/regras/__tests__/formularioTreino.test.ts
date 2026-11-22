import type { Exercicio, Treino } from '../../types';
import {
  adicionarItem,
  alternarDia,
  formularioDeTreino,
  formularioVazio,
  moverItem,
  proximaLetra,
  validarFormularioTreino,
} from '../formularioTreino';

const supino: Exercicio = { id: 1, nome: 'Supino reto com barra', grupoMuscular: 'Peito', personalizado: false };
const triceps: Exercicio = { id: 4, nome: 'Tríceps na polia com corda', grupoMuscular: 'Tríceps', personalizado: false };

describe('formulário de treino', () => {
  it('sugere a primeira letra ainda não usada', () => {
    // given
    const usadas = ['A', 'b', 'D'];

    // when
    const letra = proximaLetra(usadas);

    // then
    expect(letra).toBe('C');
  });

  it('começa vazio com a próxima letra livre', () => {
    // given
    const usadas = ['A'];

    // when
    const form = formularioVazio(usadas);

    // then
    expect(form).toEqual({ letra: 'B', nome: '', dias: [], duracao: '', itens: [] });
  });

  it('preenche a edição com a carga alvo no formato brasileiro', () => {
    // given
    const treino: Treino = {
      id: 7, letra: 'A', nome: 'Peito e Tríceps', diasDaSemana: ['SEG', 'QUI'], duracaoEstimadaMin: 55,
      exercicios: [{ id: 70, ordem: 1, exercicio: supino, seriesPlanejadas: 4, repeticoesPlanejadas: 10, cargaPlanejadaKg: 47.5, ultimaCargaKg: 50 }],
    };

    // when
    const form = formularioDeTreino(treino);

    // then
    expect(form.duracao).toBe('55');
    expect(form.itens[0]).toMatchObject({ exercicio: supino, series: '4', repeticoes: '10', carga: '47,5' });
  });

  it('marca e desmarca dias da semana', () => {
    // given
    const dias = ['SEG' as const];

    // when
    const marcado = alternarDia(dias, 'QUI');
    const desmarcado = alternarDia(marcado, 'SEG');

    // then
    expect(marcado).toEqual(['SEG', 'QUI']);
    expect(desmarcado).toEqual(['QUI']);
  });

  it('move o exercício para cima e não passa do topo', () => {
    // given
    const itens = adicionarItem(adicionarItem([], supino), triceps);

    // when
    const subiu = moverItem(itens, 1, -1);
    const noTopo = moverItem(subiu, 0, -1);

    // then
    expect(subiu.map((i) => i.exercicio.id)).toEqual([4, 1]);
    expect(noTopo).toBe(subiu);
  });
});

describe('validarFormularioTreino', () => {
  it('monta o corpo da API com letra em maiúscula e carga convertida', () => {
    // given
    const form = { letra: ' a ', nome: ' Peito e Tríceps ', dias: ['SEG' as const], duracao: '55', itens: adicionarItem([], supino) };
    form.itens[0].carga = '47,5';

    // when
    const resultado = validarFormularioTreino(form);

    // then
    expect(resultado).toEqual({
      ok: true,
      entrada: {
        letra: 'A', nome: 'Peito e Tríceps', diasDaSemana: ['SEG'], duracaoEstimadaMin: 55,
        exercicios: [{ exercicioId: 1, seriesPlanejadas: 3, repeticoesPlanejadas: 12, cargaPlanejadaKg: 47.5 }],
      },
    });
  });

  it('aceita carga vazia como sem carga alvo', () => {
    // given
    const form = { letra: 'B', nome: 'Costas', dias: [], duracao: '', itens: adicionarItem([], triceps) };

    // when
    const resultado = validarFormularioTreino(form);

    // then
    expect(resultado.ok && resultado.entrada.exercicios[0].cargaPlanejadaKg).toBeNull();
    expect(resultado.ok && resultado.entrada.duracaoEstimadaMin).toBeNull();
  });

  it('aponta os campos inválidos de cada exercício', () => {
    // given
    const itens = adicionarItem([], supino);
    itens[0] = { ...itens[0], series: '0', repeticoes: '12,5', carga: '-10' };
    const form = { letra: '', nome: '  ', dias: [], duracao: 'uma hora', itens };

    // when
    const resultado = validarFormularioTreino(form);

    // then
    expect(resultado.ok).toBe(false);
    expect(!resultado.ok && Object.keys(resultado.erros).sort()).toEqual(
      ['duracao', 'itens.0.carga', 'itens.0.repeticoes', 'itens.0.series', 'letra', 'nome'],
    );
  });
});
