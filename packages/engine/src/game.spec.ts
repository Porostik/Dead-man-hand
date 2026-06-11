import { test, expect } from 'vitest';
import { createRound, rollCrashPoint } from './game';
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

test('rollCrashPoint is deterministic and respects the cap + instant-bust floor', () => {
  const econ = { houseEdge: 0.05, maxWinCap: 10 };
  const run = () =>
    Array.from({ length: 50 }, (_, s) => rollCrashPoint(econ, mulberry32(s)));
  expect(run()).toEqual(run()); // same seed ⇒ same crash
  for (const m of run()) {
    expect(m).toBeGreaterThanOrEqual(1);
    expect(m).toBeLessThanOrEqual(10);
  }
});

test('crash distribution gives a flat RTP ≈ (1 − houseEdge) at every target', () => {
  const econ = { houseEdge: 0.05, maxWinCap: 1000 }; // high cap → the pure curve
  const rng = mulberry32(123);
  const N = 200_000;
  const crashes = Array.from({ length: N }, () => rollCrashPoint(econ, rng));
  // cashing out at any target returns ~95% — no exploitable sweet spot
  for (const target of [1.2, 2, 5]) {
    const rtp = (crashes.filter((m) => m >= target).length / N) * target;
    expect(rtp).toBeGreaterThan(0.93);
    expect(rtp).toBeLessThan(0.97);
  }
});

test('crash mode: combos decorate the climb but never push RTP over 100%', () => {
  // full card theatre (suit bonus + combos) on top of an edge-controlled crash
  const config = { ...DEFAULT_CONFIG, economics: { houseEdge: 0.05, maxWinCap: 25 } };
  const rng = mulberry32(2026);
  const N = 80_000;
  const targets = [1.3, 2, 3];
  const staked = targets.map(() => 0);
  const returned = targets.map(() => 0);

  for (let n = 0; n < N; n++) {
    const round = createRound(config, rng);
    targets.forEach((t, ti) => {
      staked[ti] += 1;
      // player cashes at the first displayed multiplier ≥ target (else busts)
      const hit = round.sequence.find((c) => c.multiplier >= t);
      if (hit) returned[ti] += hit.multiplier;
    });
  }

  targets.forEach((t, ti) => {
    const rtp = returned[ti] / staked[ti];
    console.log(`  crash+combos RTP @${t}x = ${(rtp * 100).toFixed(1)}%`);
    expect(rtp).toBeGreaterThan(0.85); // sane (~95%)
    expect(rtp).toBeLessThan(1.0); // crucial: combos do NOT open an exploit
  });
});
