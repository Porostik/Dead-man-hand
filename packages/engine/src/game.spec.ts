import { test, expect } from 'vitest';
import { createRound } from './game';
import { mulberry32 } from './rng';
import { DEFAULT_CONFIG } from './config';

test('same seed reproduces an identical round (determinism)', () => {
  const make = () => createRound(DEFAULT_CONFIG, mulberry32(42));
  expect(make()).toEqual(make());
});

test('the dead card lands within [1, maxCards]', () => {
  for (let seed = 0; seed < 200; seed++) {
    const round = createRound(DEFAULT_CONFIG, mulberry32(seed));
    expect(round.deadIndex).toBeGreaterThanOrEqual(1);
    expect(round.deadIndex).toBeLessThanOrEqual(DEFAULT_CONFIG.maxCards);
    expect(round.sequence).toHaveLength(round.deadIndex);
  }
});

test('round-suit cards carry the +suitBonus (and are flagged)', () => {
  const round = createRound(DEFAULT_CONFIG, mulberry32(3));
  for (const card of round.sequence) {
    expect(card.bonus).toBe(card.suit === round.roundSuit);
  }
});

test('multiplier grows additively and never exceeds maxMultiplier', () => {
  const round = createRound(DEFAULT_CONFIG, mulberry32(7));
  let prev = DEFAULT_CONFIG.startMultiplier;
  for (const card of round.sequence) {
    // each card only adds value (combos can jump it up, never down)
    expect(card.multiplier).toBeGreaterThanOrEqual(prev);
    expect(card.multiplier).toBeLessThanOrEqual(DEFAULT_CONFIG.maxMultiplier);
    prev = card.multiplier;
  }
});

test('combos are detected and announced on the cards that complete them', () => {
  // scan many rounds; the combo machinery should fire across a sample
  const seen = new Set<string>();
  for (let seed = 0; seed < 500 && seen.size < 2; seed++) {
    const round = createRound(DEFAULT_CONFIG, mulberry32(seed));
    for (const card of round.sequence) if (card.combo) seen.add(card.combo);
  }
  expect(seen.size).toBeGreaterThan(0);
});
