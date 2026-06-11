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

/**
 * Roll a round's CRASH multiplier from the house-edge distribution. With
 * `M = (1 − e) / (1 − U)` (U ∈ [0,1)), the probability of surviving to ANY
 * multiplier x is exactly `(1 − e) / x` — so cashing out at any target has the
 * same expected value `(1 − e)`. That flat curve is what makes the edge
 * un-exploitable (no "felt-strategy" sweet spot). `M < 1` is an instant bust
 * (the edge slice); the result is capped at `maxWinCap` to bound payouts (the cap
 * lowers variance without changing the per-target edge). Pure + seedable.
 *
 * Phase-1 primitive. Not yet wired into `createRound` — that needs the card path
 * re-tuned to rise to the crash. `tools/simulate.mjs` uses this to size
 * edge / cap / bankroll before any real-money launch.
 */
export function rollCrashPoint(
  economics: { houseEdge: number; maxWinCap: number; minCrash?: number },
  rng: Rng,
): number {
  const minCrash = economics.minCrash ?? 1;
  const m = Math.max(minCrash, (1 - economics.houseEdge) / (1 - rng()));
  if (m <= 1) return 1; // instant bust — only possible when minCrash ≤ 1
  return Math.min(r2(m), economics.maxWinCap);
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
 * identical round. Predetermining the round from the seed is the foundation for
 * provably-fair in Phase 2.
 *
 * Two modes:
 * - **feel** (Phase 0, default): roll where the dead card lands (escalating
 *   hazard), then deal that many safe cards. The cards drive the multiplier.
 * - **crash** (`config.economics` set, Phase 1): roll the CRASH multiplier from
 *   the house-edge distribution first, then deal cards (same suit/combo theatre)
 *   until the running multiplier reaches it — the crossing card is the dead card.
 *   The cards are a skin over an edge-controlled crash, so combos decorate the
 *   climb without changing the RTP.
 */
export function createRound(config: GameConfig, rng: Rng): Round {
  const roundSuit = pick(SUITS, rng);
  return config.economics
    ? buildCrashRound(config, config.economics, roundSuit, rng)
    : buildFeelRound(config, roundSuit, rng);
}

/** Resolve one safe card's effect (suit bonus + combo) onto the running X. */
function dealCard(
  config: GameConfig,
  roundSuit: Suit,
  draws: { rank: Rank; suit: Suit }[],
  i: number,
  multiplier: number,
  cap: number,
  rng: Rng,
): DealtCard {
  const rank = pick(RANKS, rng);
  const suit = pick(SUITS, rng);
  const bonus = suit === roundSuit;
  let next = multiplier + config.rankWeights[rank] + (bonus ? config.suitBonus : 0);
  const combo = detectCombo([...draws, { rank, suit }], i, roundSuit, config);
  if (combo) next *= config.combo.bonus[combo];
  return { rank, suit, bonus, combo, multiplier: Math.min(r2(next), cap) };
}

/** Phase-0 feel model: deal exactly `deadIndex` safe cards. */
function buildFeelRound(config: GameConfig, roundSuit: Suit, rng: Rng): Round {
  const deadIndex = rollDeadIndex(config, rng);
  const draws: { rank: Rank; suit: Suit }[] = [];
  const sequence: DealtCard[] = [];
  let multiplier = config.startMultiplier;

  for (let i = 0; i < deadIndex; i++) {
    const card = dealCard(config, roundSuit, draws, i, multiplier, config.maxMultiplier, rng);
    draws.push({ rank: card.rank, suit: card.suit });
    multiplier = card.multiplier;
    sequence.push(card);
  }

  return { roundSuit, sequence, deadIndex, startMultiplier: config.startMultiplier };
}

/** Phase-1 crash model: deal cards until X reaches the rolled crash multiplier. */
function buildCrashRound(
  config: GameConfig,
  economics: NonNullable<GameConfig['economics']>,
  roundSuit: Suit,
  rng: Rng,
): Round {
  const crashPoint = rollCrashPoint(economics, rng);
  const draws: { rank: Rank; suit: Suit }[] = [];
  const sequence: DealtCard[] = [];
  let multiplier = config.startMultiplier;
  // crash mode may need more cards than the feel cap to reach a high crash point
  const limit = Math.max(config.maxCards, 150);

  for (let i = 0; i < limit; i++) {
    const card = dealCard(config, roundSuit, draws, i, multiplier, economics.maxWinCap, rng);
    // the first card that would reach the crash multiplier IS the dead card
    if (card.multiplier >= crashPoint) break;
    draws.push({ rank: card.rank, suit: card.suit });
    multiplier = card.multiplier;
    sequence.push(card);
  }

  return {
    roundSuit,
    sequence,
    deadIndex: sequence.length,
    startMultiplier: config.startMultiplier,
  };
}
