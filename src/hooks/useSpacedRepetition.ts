// hooks/useSpacedRepetition.ts
export interface SRCardState {
  interval: number;
  repetition: number;
  efactor: number;
  due: Date;
}

export const createInitialCardState = (): SRCardState => ({
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  due: new Date(),
});

export const updateSpacedRepetition = (
  card: SRCardState,
  quality: number
): SRCardState => {
  let { efactor, repetition, interval } = card;

  if (quality < 3) {
    return {
      ...card,
      repetition: 0,
      interval: 1,
      due: new Date(Date.now() + 86400000),
    };
  }

  efactor = Math.max(
    1.3,
    efactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  repetition += 1;
  if (repetition === 1) interval = 1;
  else if (repetition === 2) interval = 6;
  else interval = Math.round(interval * efactor);

  return {
    efactor,
    repetition,
    interval,
    due: new Date(Date.now() + interval * 86400000),
  };
};
