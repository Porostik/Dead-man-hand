/**
 * Monte-Carlo economics for the crash model — sizing edge / cap / bankroll for a
 * low-volume real-money launch. No deps, no build:  node tools/simulate.mjs
 *
 * It answers two questions in plain numbers:
 *   1) Is the house edge un-exploitable? (RTP is flat at every cash-out target.)
 *   2) At 5–10 players, how much do we earn, and how big a bankroll do we need so
 *      the house effectively never busts?
 *
 * Tweak the KNOBS below and re-run. The crash math mirrors @dmh/engine
 * `rollCrashPoint`.
 */

// ─────────────────────────── KNOBS (edit me) ───────────────────────────
const BET = 1; // average bet, in your currency unit ($ / coin)
const PLAYERS_PER_DAY = 8; // active players per day
const ROUNDS_PER_PLAYER = 25; // rounds each player plays per day
const DAYS = 30; // length of one simulated period
const BANKROLL = 300; // starting house bankroll (for the ruin check)
const TRIALS = 8000; // Monte-Carlo trials of that whole period

// Scenarios to compare: [houseEdge, maxWinCap]
const SCENARIOS = [
  [0.05, 10],
  [0.05, 25],
  [0.08, 10],
  [0.08, 25],
];

// How players cash out — a realistic mix of targets [weight, minX, maxX].
// (RTP is flat, so the mix barely moves PROFIT; it drives the swings/bankroll.)
const TARGET_MIX = [
  [0.45, 1.2, 1.8], // cautious — bail early
  [0.35, 1.8, 3.0], // medium
  [0.15, 3.0, 6.0], // greedy
  [0.05, 6.0, 999], // cap-chasers (clamped to the scenario cap)
];
// ────────────────────────────────────────────────────────────────────────

/** mulberry32 PRNG — mirrors @dmh/engine/rng. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Crash multiplier — mirrors @dmh/engine `rollCrashPoint`. */
function rollCrash(edge, cap, rng) {
  const raw = (1 - edge) / (1 - rng());
  if (raw < 1) return 1; // instant bust
  return Math.min(raw, cap);
}

function pickTarget(cap, rng) {
  let r = rng();
  for (const [w, lo, hi] of TARGET_MIX) {
    if ((r -= w) <= 0) return Math.min(lo + rng() * (hi - lo), cap);
  }
  return 1.2;
}

const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
const money = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toFixed(0);
const pad = (s, n) => String(s).padEnd(n);

// ── 1) RTP curve: cashing out at any target returns the same ~(1−edge) ──
function rtpCurve(edge, cap) {
  const rng = mulberry32(20260611);
  const N = 1_000_000;
  const crashes = new Float64Array(N);
  for (let i = 0; i < N; i++) crashes[i] = rollCrash(edge, cap, rng);
  const targets = [1.1, 1.3, 1.5, 2, 3, 5, 8, 10].filter((t) => t <= cap);
  console.log(`\n  RTP per cash-out target  (edge ${(edge * 100).toFixed(0)}%, cap ${cap}x):`);
  for (const t of targets) {
    let wins = 0;
    for (let i = 0; i < N; i++) if (crashes[i] >= t) wins++;
    const rtp = (wins / N) * t;
    console.log(`    cash at ${pad(t + 'x', 5)} → RTP ${(rtp * 100).toFixed(1)}%  (wins ${((wins / N) * 100).toFixed(0)}% of the time)`);
  }
  console.log('    → flat everywhere = no target where the player beats the house ✓');
}

// ── 2) profit / bankroll / ruin over many simulated periods ──
function periodStats(edge, cap) {
  const rng = mulberry32(424242 + Math.round(edge * 1000) + cap);
  const roundsPerPeriod = PLAYERS_PER_DAY * ROUNDS_PER_PLAYER * DAYS;
  const profits = new Array(TRIALS);
  const dips = new Array(TRIALS);
  let ruined = 0;

  for (let trial = 0; trial < TRIALS; trial++) {
    let bank = 0; // house cumulative net (separate from the bankroll buffer)
    let minBank = 0;
    for (let r = 0; r < roundsPerPeriod; r++) {
      const target = pickTarget(cap, rng);
      const M = rollCrash(edge, cap, rng);
      if (M >= target) bank -= BET * (target - 1); // player wins → house pays
      else bank += BET; // player busts → house keeps the stake
      if (bank < minBank) minBank = bank;
    }
    profits[trial] = bank;
    dips[trial] = -minBank; // how far below zero it dipped = bankroll needed
    if (-minBank > BANKROLL) ruined++;
  }

  profits.sort((a, b) => a - b);
  dips.sort((a, b) => a - b);
  const avg = profits.reduce((s, x) => s + x, 0) / TRIALS;
  return {
    avgPerDay: avg / DAYS,
    p5: pct(profits, 5),
    p50: pct(profits, 50),
    p95: pct(profits, 95),
    bankrollNeeded: pct(dips, 99), // covers 99% of bad runs
    ruin: (ruined / TRIALS) * 100,
  };
}

// ─────────────────────────── run ───────────────────────────
console.log('Dead Men — economics simulator');
console.log(`Volume: ${PLAYERS_PER_DAY} players × ${ROUNDS_PER_PLAYER} rounds × ${DAYS} days = ${(PLAYERS_PER_DAY * ROUNDS_PER_PLAYER * DAYS).toLocaleString()} rounds/period · bet ${money(BET)} · ${TRIALS.toLocaleString()} trials`);

// flat-RTP proof for the first scenario
rtpCurve(SCENARIOS[0][0], SCENARIOS[0][1]);

console.log(`\n  Profit & risk over ${DAYS} days  (bankroll ${money(BANKROLL)}):\n`);
console.log(
  '    ' +
    pad('edge', 6) + pad('cap', 6) + pad('profit/day', 13) +
    pad(`${DAYS}d profit (P5…P95)`, 24) + pad('bankroll needed', 17) + 'ruin',
);
console.log('    ' + '-'.repeat(72));
for (const [edge, cap] of SCENARIOS) {
  const s = periodStats(edge, cap);
  console.log(
    '    ' +
      pad((edge * 100).toFixed(0) + '%', 6) +
      pad(cap + 'x', 6) +
      pad(money(s.avgPerDay), 13) +
      pad(`${money(s.p5)} … ${money(s.p95)}`, 24) +
      pad(money(s.bankrollNeeded), 17) +
      `${s.ruin.toFixed(1)}%`,
  );
}
console.log(`\n  Read: "profit/day" = expected house take. "P5…P95" = the spread over ${DAYS} days`);
console.log(`  (P5 can be negative = an unlucky month). "bankroll needed" = buffer to survive`);
console.log(`  99% of bad runs. "ruin" = chance the ${money(BANKROLL)} bankroll is wiped. Tighter cap`);
console.log('  → smaller bankroll + lower ruin, at the cost of smaller max wins for players.\n');
