import type { GameConfig } from './types';

/**
 * DEFAULT_CONFIG — placeholder balance for the F2P MVP.
 *
 * ⚠️ These numbers are NOT validated — this is a free MVP, tuned by FEEL, NOT by
 * math. Real RTP / variance / risk-of-ruin validation is Phase 1 (Monte-Carlo);
 * the config that survives simulation becomes the shipped config. Until then, tune
 * for fun, not for correctness.
 *
 * Model: additive growth (X += weight per card), +0.3 when a card matches the
 * round suit, and poker-lite combos that multiply X when they land. See
 * docs/game-design.md and .claude/skills/game-balance.
 */
export const DEFAULT_CONFIG: GameConfig = {
  startMultiplier: 1.0,
  // Number ranks add n/100; courts climb faster — a slow steady ascent.
  rankWeights: {
    '2': 0.02, '3': 0.03, '4': 0.04, '5': 0.05, '6': 0.06,
    '7': 0.07, '8': 0.08, '9': 0.09, '10': 0.1,
    J: 0.13, Q: 0.16, K: 0.2, A: 0.28,
  },
  suitBonus: 0.3,
  combo: {
    setLen: 3, // three of a kind in a row = set; two in a row = pair
    straightLen: 3, // three consecutive ranks
    flushCount: 3, // three round-suit cards this round
    bonus: { pair: 1.25, set: 1.7, straight: 1.8, flush: 1.6, deadmans: 5.0 },
  },
  // The longer a round runs, the likelier the dead card — a tension ramp.
  hazard: { base: 0.07, step: 0.02, max: 0.33 },
  maxCards: 26,
  maxMultiplier: 50,
};
