# Roadmap

Gated phases. **Do not pull later-phase work forward** — each gate must pass first.

## Phase 0 — F2P MVP (CURRENT)

**Goal:** validate the core loop is fun ("one more round?").

In scope:

- `@dmh/engine` core: `createRound`, `revealNext`, `cashOut`, `GameConfig` ✅ done.
- `frontend`: playable game screen (from the user's own design), fake-coin balance,
  card reveals, cash-out, combos, juice. Engine runs client-side.
- Deploy as a **free static site on Vercel** to show friends.
- Live-tunable balance for playtests.

Out of scope: real money, crypto, provably-fair, RTP math, simulation, bankroll,
backend, sockets, licensing.

**Immediate next steps:**

1. Build the game screen from the user's design (Figma) — the current screen is a
   neutral placeholder.
2. `pnpm nx build frontend` green → deploy to Vercel.
3. Give to friends; watch replay behavior.

**Gate → Phase 1:** testers voluntarily replay; the 10-second feel reads as distinct.
If it's not fun, stop/redesign — no math saves a boring loop.

## Phase 1 — Economy & math

**Goal:** prove unit economics are safe and exploit-free, on paper.

- Monte-Carlo over `GameConfig`: RTP (overall + per-cash-out-target curve),
  variance, **risk of ruin** vs (max-win-cap / bankroll).
- Tune to a flat RTP curve at target (~96%), no >100% sweet spots (watch combos).
  Decide max-win-cap and bankroll sizing.

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
