---
name: game-balance
description: Use when tuning Dead Men's Hand balance — card weights, dead-card chance, combo length/bonus, multiplier caps — i.e. anything in the engine GameConfig. Covers where balance lives, the felt-strategy rule, and the MVP "don't be too generous" rule. Trigger when a task is about how the game feels, payouts, RTP, difficulty, or combo frequency.
---

# Game balance

All balance lives in **`packages/engine/src/config.ts`** (`GameConfig`). Never
scatter game numbers into components, stores, or the backend.

## Knobs

- `startMultiplier` — usually 1.0.
- `deadChance` — P(dead card) per reveal. Higher ⇒ shorter rounds, more busts.
- `cards[] { rank, weight, probability }` — `weight` is X growth `X *= 1+weight`;
  `probability` is relative draw chance among non-dead cards.
- `comboLength`, `comboBonus` — N same ranks in a row ⇒ `X *= comboBonus`.
- `maxMultiplier` — cap on X (exposure control; matters in Phase 2).

## Rules

1. **Felt strategy, not real strategy.** Tuning may make patterns _feel_ findable,
   but no cash-out target may return >100% RTP; the RTP curve should be flat.
   **Combos most often create an exploitable >100% sweet spot** — be suspicious of
   generous combo bonuses.
2. **MVP: tune for fun at roughly realistic odds (~96% feel), NOT generous.** An
   over-generous F2P build validates a fantasy the real-money version can't keep.
3. **No faked near-misses.** Combo "almost" moments must arise from real draw
   probability — faked near-misses are illegal under several regulators and block
   Phase 2 licensing.

## Verifying a change

- Phase 0 (now): judge by **feel** in playtests — "one more round?".
- Phase 1: judge by **simulation** — Monte-Carlo for RTP curve, variance, risk of
  ruin. The numbers that pass become the shipped config.

When a knob's meaning changes, also update `docs/game-design.md`.
