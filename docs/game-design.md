# Game Design — Dead Men's Hand

## Theme

Wild West poker stand-off. The "dead card" is the bullet. The name nods to the
_Dead Man's Hand_ — aces and eights — held by Wild Bill Hickok when he was shot.

## Core loop (the 10-second test)

1. Player places a bet (fake coins in the MVP) during the shuffle.
2. Cards **auto-deal** one by one (timer-paced, ~1.5s each). Each card adds to the
   multiplier **X**: `X += weight(rank)` — courts/aces add more than low cards —
   plus **+0.3** when the card matches the **round suit**.
3. At any moment the player can **cash out** at the current X → wins `bet * X`.
4. A **dead card** is hidden in the deck (position predetermined per round). If it
   reveals before the player cashes out → **bust**, stake lost.

The tension is _when do I get out?_ — X keeps climbing while the dead card gets
likelier the longer the round runs (escalating hazard). Cards deal themselves
(Aviator-style), so the only decision is cash-out timing; the discrete card reveals
+ poker combos are the suspense, not an abstract rising line. Success metric:
testers voluntarily replay ("one more round?"), measured by behavior.

## Round suit

Each round has a **round suit**. Cards of that suit add **+0.3** on top of their
rank weight (shown as a quiet gold edge on the card, not a combo glow), and they
feed the flush combo below.

## Combos (dopamine layer) — poker-lite, self-announcing

Combos jump the multiplier and pop a badge — no chart to memorize, each announces
itself:

- **Пара** — two of the same rank in a row.
- **Сет** — three of the same rank in a row.
- **Стрит** — three consecutive ranks in a row.
- **Флеш масти** — three round-suit cards in the round.
- **☠ Dead Man's Hand** — aces & eights (rare jackpot).

These drive **near-misses** ("two kings… chasing the third"), which retain harder
than wins. Near-misses must be **honest** — they arise from the real draw, never
faked.

## Cards = theme over a weighted RNG

No real 52-card deck. Each round is **predetermined from a per-round seed**: the
round suit, the dead-card position (via escalating hazard), and every dealt card
(rank + suit, with its bonus/combo) are rolled up-front by the engine. Independent
rounds ⇒ no card counting ⇒ no exploit. Being seed-predetermined is also what makes
**provably-fair** possible in Phase 2 with no rewrite.

## "Felt strategy, not real strategy"

Players should _feel_ they found a pattern, but it must stay an illusion: **no cash-
out target may return >100% RTP**; the RTP curve across targets must be flat.
**Combos are the usual culprit** for an exploitable >100% sweet spot — verify with
simulation (Phase 1) before real money.

## Balance config

All tunables live in `packages/engine/src/config.ts` (`GameConfig`):
`startMultiplier`, `rankWeights` (per-rank additive growth), `suitBonus` (round-suit
+0.3), `combo` (`setLen` / `straightLen` / `flushCount` + per-type `bonus`
multipliers for pair/set/straight/flush/deadmans), `hazard` (`base` / `step` / `max`
— the escalating dead-card chance), `maxCards`, `maxMultiplier`.

**MVP tuning rule:** tune for _fun_, **not** for validated odds. The current
`DEFAULT_CONFIG` values are placeholders — real RTP / variance / risk-of-ruin
tuning is Phase 1 (Monte-Carlo) and feeds back into this same config. See
`.claude/skills/game-balance`.
