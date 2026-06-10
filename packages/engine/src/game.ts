import type {
  ComboType,
  DealtCard,
  GameConfig,
  Rank,
  Round,
  Rng,
  Suit,
} from './types';

const RANKS: Rank[] = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',
];
const SUITS: Suit[] = ['spade', 'heart', 'club', 'diamond'];

/** Numeric value of a rank for straight detection (Ace high). */
const RANK_VALUE: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  J: 11, Q: 12, K: 13, A: 14,
};

const r2 = (n: number) => Math.round(n * 100) / 100;

function pick<T>(arr: T[], rng: Rng): T {
  return arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))]!;
}

/**
 * Detect the combo (if any) completed by the card at `i`, given the cards dealt so
 * far. One badge per card — checked in descending payout priority. Pure: depends
 * only on the revealed sequence, not on randomness (no card counting: every round
 * is independently drawn).
 */
function detectCombo(
  cards: Pick<DealtCard, 'rank' | 'suit'>[],
  i: number,
  roundSuit: Suit,
  config: GameConfig,
): ComboType | null {
  const { setLen, straightLen, flushCount } = config.combo;

  // deadmans — aces & eights; fires on the card that first reaches 2 + 2.
  const aces = (upTo: number) =>
    cards.slice(0, upTo + 1).filter((c) => c.rank === 'A').length;
  const eights = (upTo: number) =>
    cards.slice(0, upTo + 1).filter((c) => c.rank === '8').length;
  const deadNow = aces(i) >= 2 && eights(i) >= 2;
  const deadBefore = i > 0 && aces(i - 1) >= 2 && eights(i - 1) >= 2;
  if (deadNow && !deadBefore) return 'deadmans';

  // flush — pops once, on the card that reaches flushCount round-suit cards.
  if (cards[i].suit === roundSuit) {
    const suitCount = cards
      .slice(0, i + 1)
      .filter((c) => c.suit === roundSuit).length;
    if (suitCount === flushCount) return 'flush';
  }

  // straight — the last `straightLen` ranks are consecutive (distinct).
  if (i + 1 >= straightLen) {
    const tail = cards
      .slice(i + 1 - straightLen, i + 1)
      .map((c) => RANK_VALUE[c.rank])
      .sort((a, b) => a - b);
    const consecutive = tail.every((v, k) => k === 0 || v === tail[k - 1] + 1);
    if (consecutive) return 'straight';
  }

  // set / pair — the trailing run of identical ranks.
  let run = 1;
  for (let k = i - 1; k >= 0 && cards[k].rank === cards[i].rank; k--) run++;
  if (run >= setLen) return 'set';
  if (run >= 2) return 'pair';

  return null;
}

/** How many safe cards land before the dead card (escalating hazard). */
function rollDeadIndex(config: GameConfig, rng: Rng): number {
  const { base, step, max } = config.hazard;
  let pos = 1;
  while (pos < config.maxCards) {
    const hazard = Math.min(base + pos * step, max);
    if (rng() < hazard) break;
    pos += 1;
  }
  return pos;
}

/**
 * Build a whole round from the injected `rng`. Deterministic: same seed + config ⇒
 * identical round. Picks the round suit, rolls where the dead card lands, then
 * resolves every safe card (suit bonus + combos) and its running additive
 * multiplier up front. The frontend reveals `sequence` on a timer and busts at
 * `deadIndex`. Predetermining the round from the seed is the foundation for
 * provably-fair in Phase 2.
 */
export function createRound(config: GameConfig, rng: Rng): Round {
  const roundSuit = pick(SUITS, rng);
  const deadIndex = rollDeadIndex(config, rng);

  const draws: { rank: Rank; suit: Suit }[] = [];
  const sequence: DealtCard[] = [];
  let multiplier = config.startMultiplier;

  for (let i = 0; i < deadIndex; i++) {
    const rank = pick(RANKS, rng);
    const suit = pick(SUITS, rng);
    draws.push({ rank, suit });

    const bonus = suit === roundSuit;
    multiplier += config.rankWeights[rank] + (bonus ? config.suitBonus : 0);

    const combo = detectCombo(draws, i, roundSuit, config);
    if (combo) multiplier *= config.combo.bonus[combo];

    multiplier = Math.min(r2(multiplier), config.maxMultiplier);
    sequence.push({ rank, suit, bonus, combo, multiplier });
  }

  return {
    roundSuit,
    sequence,
    deadIndex,
    startMultiplier: config.startMultiplier,
  };
}
