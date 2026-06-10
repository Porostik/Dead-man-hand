/** Injected randomness: a function returning a float in [0, 1). */
export type Rng = () => number;

/** Card suit. */
export type Suit = 'spade' | 'heart' | 'club' | 'diamond';

/** Card rank. */
export type Rank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

/**
 * Poker-lite combos. They announce themselves as cards land — players never
 * build or memorize a hand chart.
 * - `pair`     — two of the same rank in a row.
 * - `set`      — three+ of the same rank in a row.
 * - `straight` — N consecutive ranks in a row.
 * - `flush`    — N round-suit cards collected this round.
 * - `deadmans` — aces & eights (the namesake): a rare jackpot.
 */
export type ComboType = 'pair' | 'set' | 'straight' | 'flush' | 'deadmans';

/** One card dealt onto the table, with its effect already resolved. */
export interface DealtCard {
  rank: Rank;
  suit: Suit;
  /** True when this card's suit matches the round suit (it carries `suitBonus`). */
  bonus: boolean;
  /** Combo completed by this card, if any — the UI announces it. */
  combo: ComboType | null;
  /** Running multiplier X after this card (additive base + bonuses + combo jumps). */
  multiplier: number;
}

/**
 * A fully predetermined round. `createRound` resolves everything from the seed up
 * front (suit, the whole safe sequence, where the dead card lands) — the frontend
 * just reveals `sequence` on a timer and busts at `deadIndex`. Predetermining the
 * round from the seed is the foundation for provably-fair in Phase 2.
 */
export interface Round {
  /** The round's suit; matching cards carry `suitBonus`. */
  roundSuit: Suit;
  /** Safe cards, in deal order. Length === `deadIndex`. */
  sequence: DealtCard[];
  /** Number of safe cards; the dead card lands at this position. */
  deadIndex: number;
  /** Starting multiplier (usually 1.0). */
  startMultiplier: number;
}

/** Bonus multiplier applied to the running X when a combo lands. */
export type ComboBonus = Record<ComboType, number>;

/** All tunable balance. The single source of truth for game feel. */
export interface GameConfig {
  /** Starting multiplier, usually 1.0. */
  startMultiplier: number;
  /** Additive multiplier contribution per rank (the "weight"). */
  rankWeights: Record<Rank, number>;
  /** Flat bonus added when a card's suit matches the round suit. */
  suitBonus: number;
  /** Combo thresholds + bonuses. */
  combo: {
    /** Same-rank run length that triggers a `set`. */
    setLen: number;
    /** Consecutive-rank run length that triggers a `straight`. */
    straightLen: number;
    /** Round-suit cards collected this round that trigger a `flush`. */
    flushCount: number;
    /** Multiplier applied to the running X per combo type. */
    bonus: ComboBonus;
  };
  /** Escalating dead-card hazard: p(pos) = min(base + pos*step, max). */
  hazard: { base: number; step: number; max: number };
  /** Hard cap on the number of safe cards per round. */
  maxCards: number;
  /** Hard cap on X per round (exposure control; matters in Phase 2). */
  maxMultiplier: number;
}
