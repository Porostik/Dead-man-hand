/**
 * @dmh/engine — Dead Men's Hand game core (RGS).
 *
 * Pure, deterministic, framework-free. All randomness is injected so a whole round
 * is reproducible from a seed (foundation for provably-fair in Phase 2).
 *
 * See CLAUDE.md + .claude/skills/engine-dev before changing game rules.
 */
export type {
  Rng,
  Suit,
  Rank,
  ComboType,
  ComboBonus,
  DealtCard,
  Round,
  GameConfig,
} from './types';

export { DEFAULT_CONFIG } from './config';
export { mulberry32, seedFromString } from './rng';
export { createRound, rollCrashPoint } from './game';
