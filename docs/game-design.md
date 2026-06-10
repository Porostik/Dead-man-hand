# Game Design — Dead Men's Hand

## Theme

Wild West poker stand-off. The "dead card" is the bullet. The name nods to the
_Dead Man's Hand_ — aces and eights — held by Wild Bill Hickok when he was shot.

## Core loop (the 10-second test)

1. Player places a bet (fake coins in the MVP).
2. Cards reveal one by one. Each card grows the multiplier **X**: `X *= (1 + weight)`.
3. At any moment the player can **cash out** at the current X → wins `bet * X`.
4. If a **dead card** reveals before they cash out → **bust**, stake lost.

The tension is _push-your-luck per card_: each reveal is a "stay or fold" micro-
decision. That discrete, suspenseful reveal — not an abstract rising line — is the
differentiator from a generic crash. Success metric: testers voluntarily replay
("one more round?"), measured by behavior, not polite feedback.

## Combos (dopamine layer)

`comboLength` identical ranks in a row → `X *= comboBonus`. This drives **near-
misses** ("two kings… chasing the third"), which retain harder than wins. Near-
misses must be **honest** — arise from real draw probability, never faked.

## Cards = theme over a weighted RNG

No real 52-card deck. Each reveal is an independent weighted draw: `deadChance` for
the dead card, otherwise a card sampled from `cards[]` by `probability`. Independent
draws ⇒ no card counting ⇒ no exploit.

## "Felt strategy, not real strategy"

Players should _feel_ they found a pattern, but it must stay an illusion: **no cash-
out target may return >100% RTP**; the RTP curve across targets must be flat.
**Combos are the usual culprit** for an exploitable >100% sweet spot — verify with
simulation (Phase 1) before real money.

## Balance config

All tunables live in `packages/engine/src/config.ts` (`GameConfig`):
`startMultiplier`, `deadChance`, `cards[] {rank, weight, probability}`,
`comboLength`, `comboBonus`, `maxMultiplier`.

**MVP tuning rule:** tune for _fun at roughly realistic odds_ (~96% feel), **not
generous**. The current `DEFAULT_CONFIG` values are placeholders, not validated —
real RTP / variance / risk-of-ruin tuning is Phase 1 (Monte-Carlo), and feeds back
into this same config. See `.claude/skills/game-balance`.
