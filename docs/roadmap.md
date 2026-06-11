# Roadmap

Gated phases. **Do not pull later-phase work forward** — each gate must pass first.

## Phase 0 — F2P MVP (CURRENT)

**Goal:** validate the core loop is fun ("one more round?").

In scope:

- `@dmh/engine` core: `createRound` (predetermines the round) + `GameConfig` ✅ done.
- `frontend`: playable game screen (from the user's own design), fake-coin balance,
  card reveals, cash-out, combos, juice. Engine runs client-side.
- Deploy as a **free static site on Vercel** to show friends.
- Live-tunable balance for playtests.

Out of scope: real money, crypto, provably-fair, RTP math, simulation, bankroll,
backend, sockets, licensing.

**Done so far:** engine reworked to the agreed mechanics (combos = runs of adjacent
cards, flush = 3 same-suit-in-a-row); game + onboarding built (composing `@dmh/ui`)
with **two bet slots + partial cash-out** and combo FX; **settings** drawer
(sound/vibration + rules); TMA (`@telegram-apps/sdk` + local mock, fullscreen +
safe-area); deployed free on Vercel — https://dmh-two.vercel.app. Plus a **head
start on Phase 1**: the crash-point economics primitive (`rollCrashPoint`, behind
`GameConfig.economics`) + a `/lab` inspector + a Monte-Carlo `tools/simulate.mjs`
are built and tested (not yet switched on in the game).

**Immediate next steps:**

1. Art assets (mascot + paraphernalia) via `tools/gen-images.mjs` — blocked on an
   image-gen provider (fal credits / free token).
2. Give to friends; watch replay behavior.

**Gate → Phase 1:** testers voluntarily replay; the 10-second feel reads as distinct.
If it's not fun, stop/redesign — no math saves a boring loop.

## Phase 1 — Economy & math

**Goal:** prove unit economics are safe and exploit-free, on paper.

The model + tooling already exist (see Phase 0 head start): `rollCrashPoint` gives
a flat RTP `(1−e)` by construction. Phase 1 is to **wire it into the game**
(set `GameConfig.economics`), **re-tune the card weights** so the multiplier path
rises to the crash cleanly (no empty rounds), then validate:

- Monte-Carlo (`tools/simulate.mjs`): RTP curve per cash-out target, variance,
  **risk of ruin** vs (max-win-cap / bankroll). Confirm flat ≤ target, no sweet spot.
- Decide `houseEdge` (market norm 1–3%), `maxWinCap`, and bankroll sizing.

**Gate → Phase 2:** flat RTP ≤ target, no exploitable strategy, acceptable ruin risk.

## Phase 2 — Real money

- Move engine **server-authoritative** (backend runs seeded rounds, streams reveals
  over WebSocket). Re-add the NestJS backend.
- **Provably-fair**: server seed + client seed → verifiable rounds.
- Crypto wallet/balance (TON / USDT), deposits & withdrawals.
- Exposure controls: max bet, **max-win cap per round** (not withdrawal caps).
- Then licensing (Curacao) + RNG certification — only when scaling / going B2B.

## Phase 3 — Distribution (optional)

- B2B: expose the engine/RGS via API, revenue-share / white-label to operators.
- A second mode reusing the audience + wallet (e.g. a western PvP mini-poker) to
  solve PvP cold-start with existing players.
