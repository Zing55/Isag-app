import { Flashcard } from '../types';

export interface SM2Result {
  repetition: number;
  interval: number;
  easeFactor: number;
  dueDate: string;
}

/**
 * SuperMemo 2 (SM-2) Spaced Repetition Algorithm
 * Quality rating scale:
 * 0 - Errei completamente (Blackout)
 * 3 - Difícil (Relembrado com grande esforço)
 * 4 - Bom (Relembrado com sucesso após breve reflexão)
 * 5 - Fácil (Relembrado perfeitamente de imediato)
 */
export function calculateSM2(
  card: Pick<Flashcard, 'repetition' | 'interval' | 'easeFactor'>,
  quality: number
): SM2Result {
  let { repetition, interval, easeFactor } = card;

  if (quality < 3) {
    // Answer was wrong
    repetition = 0;
    interval = 1;
  } else {
    // Answer was correct
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  }

  // Update Ease Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate Due Date
  const due = new Date();
  due.setDate(due.getDate() + interval);
  const dueDateStr = due.toISOString().split('T')[0];

  return {
    repetition,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate: dueDateStr,
  };
}

export function isCardDueToday(dueDate: string): boolean {
  const todayStr = new Date().toISOString().split('T')[0];
  return dueDate <= todayStr;
}

export function formatDaysLabel(intervalDays: number): string {
  if (intervalDays <= 1) return 'Amanhã';
  if (intervalDays === 2) return 'Em 2 dias';
  if (intervalDays === 7) return 'Em 1 semana';
  return `Em ${intervalDays} dias`;
}
