import type { ComboType, Suit } from '@dmh/engine';

export const SUIT_GLYPH: Record<Suit, string> = {
  spade: '♠',
  heart: '♥',
  club: '♣',
  diamond: '♦',
};

export const SUIT_RU: Record<Suit, string> = {
  spade: 'ПИКИ',
  heart: 'ЧЕРВИ',
  club: 'ТРЕФЫ',
  diamond: 'БУБНЫ',
};

export const SUIT_RED: Partial<Record<Suit, boolean>> = {
  heart: true,
  diamond: true,
};

export const COMBO_LABEL: Record<ComboType, string> = {
  pair: 'ПАРА',
  set: 'СЕТ',
  straight: 'СТРИТ',
  flush: 'ФЛЕШ МАСТИ',
  deadmans: "DEAD MAN'S HAND",
};

export const fmtX = (n: number) => '×' + n.toFixed(2);
export const fmtCoin = (n: number) => n.toFixed(2);
