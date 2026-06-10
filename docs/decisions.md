# Decisions & Rationale

The "why" behind DMH — the reasoning that isn't obvious from the code. Captured so
any session (or future-you) has the full context. Read this first.

## Product strategy

- **Genre: crash, as a Telegram Mini App.** Instant games (crash/mines) are the
  cheapest segment to enter: simple math, almost no content, proven demand
  (Aviator, Turbo Games). TG Mini App = cheap distribution + viral loops.
- **Concept: "Dead Men's Hand" — a card-reveal crash.** Cards reveal one by one,
  each grows X; a **dead card** ends the round. This is differentiation, not a
  reskin: discrete, suspenseful card reveals + a theme (Wild Bill's aces & eights)
  that reinforces the mechanic. The bar: it must _feel_ distinct in 10 seconds.
- **Two revenue sides on one codebase.** Self-launch in TG (B2C, house edge / GGR)
  AND later license the engine to operators (B2B, revenue share). That's why the
  engine is an isolated, reusable RGS from day one.

## House-banked vs PvP-rake (chosen: house-banked, provably-fair)

- **House-banked** (we are the house): needs a bankroll + variance management, but
  delivers big multipliers at any player count and supports provably-fair. The big-X
  dream is funded by the bankroll.
- **PvP / pool-based (parimutuel) crash**: zero bankroll, zero variance, but big
  multipliers are impossible at low volume (max win = pool − rake), it's not
  provably-fair, and it feels thin/rigged with few players.
- **"Who funds the tail" tradeoff:** big multipliers + few players + zero risk are
  mutually exclusive — the tail is paid by EITHER the pool (needs volume) OR the
  bankroll (needs capital). We chose **house-banked + provably-fair** so it feels
  like real crash from player #1 and keeps trust (the crypto audience verifies seeds).

## Risk & "caps" (Phase 2, but decided now)

- House edge is a guarantee only at **volume**; at 2 players, variance dominates.
- The fix is **max-win cap per round sized as ~1–2% of bankroll** (controls
  risk-of-ruin), **NOT withdrawal caps**. Capping payouts at the _source_ means an
  unpayable win never occurs; capping _withdrawals_ (blocking winners) is the #1
  crypto-casino scam signal and kills trust + licensing.
- Limits scale with the bankroll: start tiny, raise as bankroll/volume grow.

## "Felt strategy, not real strategy"

- The feeling "I found a pattern, now it pops" is the engagement engine (intended),
  but it must stay an illusion: **no cash-out strategy may return >100% RTP** (the
  RTP curve across cash-out targets must be flat). Best model: blackjack — real
  decisions, but optimal play still loses to the edge.
- Cards are a **theme over a weighted RNG**, not a real 52-card deck. Independent
  draws each round ⇒ no card counting ⇒ no exploit. Near-misses (combo chasing) are
  great dopamine but must be **honest** (from real probability; faked near-misses
  are illegal in regulated markets).

## Sequencing (de-risk fun before math before money)

1. **F2P MVP (now)** — fake coins, validate "one more round?". Tune by _feel_, at
   roughly realistic odds (~96% feel), NOT generous (or you validate a fantasy).
2. **Math** — Monte-Carlo over `GameConfig`: RTP curve, variance, risk-of-ruin.
3. **Real money** — server-authoritative engine, provably-fair, crypto (TON/USDT),
   exposure caps. Then licensing (Curacao) + RNG cert only when scaling / B2B.

## Cost reality (why F2P-first)

- Dev is the cheap part (we build it). The real costs are **bankroll** (working
  capital, not spent) and **player acquisition (CAC)**. Licensing (~€30–60k yr1) is
  a "tax on legality/scale" — skip until unit economics are proven.
- A scrappy crypto-TG launch can start ~$5–10k (mostly small bankroll + first
  traffic); ~$20–30k buys a _meaningful_ economic test. None of that is needed for
  the F2P fun-test, which costs only dev time + a free Vercel deploy.

## Tech decisions

- **Nx monorepo + pnpm**, TypeScript everywhere. Small project, but one graph /
  one install is convenient and the engine-as-lib split is clean.
- **Imports are extensionless** — `tsconfig.base.json` uses `moduleResolution:
bundler` + `module: esnext` (Nx default was `nodenext`, which forces `.js`).
- **`@dmh/engine`** is a pure, dependency-free, deterministic/seedable library.
- **Frontend**: React + Vite + TanStack Router + TanStack Query + Zustand. Query is
  set up as the Phase-2 server-state foundation; nothing to fetch yet.
- **Backend (NestJS) removed for the MVP** — the engine runs client-side, so the app
  deploys to **Vercel free** with no VPS. Re-add the backend in Phase 2.
- **AI configs: Claude only** (other tools' configs are not kept).
