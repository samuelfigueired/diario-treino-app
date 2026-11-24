import { RascunhoTreino, rascunhoServePara, validarRascunho } from '../rascunho';

const agora = new Date(2026, 10, 3, 8, 0).getTime();

function rascunho(sobrescrever: Partial<RascunhoTreino> = {}): RascunhoTreino {
  return {
    treinoId: 1,
    nomeTreino: 'Peito e Tríceps',
    letraTreino: 'A',
    inicio: new Date(2026, 10, 3, 7, 30).toISOString(),
    indiceExercicio: 1,
    series: [
      [{ numero: 1, carga: '60', repeticoes: '10', concluida: true, anterior: null }],
      [{ numero: 1, carga: '20', repeticoes: '12', concluida: false, anterior: null }],
    ],
    descansoAte: null,
    ...sobrescrever,
  };
}

describe('validarRascunho', () => {
  it('aceita um rascunho recente e bem formado', () => {
    // given
    const salvo = JSON.parse(JSON.stringify(rascunho()));

    // when
    const lido = validarRascunho(salvo, agora);

    // then
    expect(lido).toEqual(rascunho());
  });

  it('descarta rascunho com mais de 12 horas', () => {
    const antigo = rascunho({ inicio: new Date(2026, 10, 2, 18, 0).toISOString() });
    expect(validarRascunho(antigo, agora)).toBeNull();
  });

  it('descarta dados corrompidos', () => {
    expect(validarRascunho(null, agora)).toBeNull();
    expect(validarRascunho('texto', agora)).toBeNull();
    expect(validarRascunho({ ...rascunho(), series: [[{ numero: 1 }]] }, agora)).toBeNull();
    expect(validarRascunho({ ...rascunho(), inicio: 'ontem' }, agora)).toBeNull();
  });
});

describe('rascunhoServePara', () => {
  it('retoma só o mesmo treino com a mesma quantidade de exercícios', () => {
    expect(rascunhoServePara(rascunho(), 1, 2)).toBe(true);
    expect(rascunhoServePara(rascunho(), 2, 2)).toBe(false);
    expect(rascunhoServePara(rascunho(), 1, 3)).toBe(false);
    expect(rascunhoServePara(null, 1, 2)).toBe(false);
  });
});
