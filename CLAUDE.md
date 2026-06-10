# DMH — Dead Men's Hand

Western-themed **crash game** as a **Telegram Mini App**. During a round, cards are
revealed one by one; each card grows the multiplier **X** by its weight. The round
ends when a **dead card** is drawn — cash out before it shows or lose the stake.
Poker-style **combos** (e.g. three of a kind in a row) grant bonus multipliers.

> 🧠 **New session: read `docs/` for full context** — `docs/decisions.md` (why we
> built it this way), `docs/game-design.md`, `docs/architecture.md`,
> `docs/roadmap.md`. This file is the always-loaded summary; docs hold the detail.

## ⚠️ Current phase: F2P MVP (Phase 0 — fun validation)

We are building a **free-to-play MVP with fake currency**, deployed as a **free
static site on Vercel** to show friends. It validates ONE thing:

> Is the core loop fun? Does it make players want **"one more round"**?

**Out of scope right now** (Phase 2 — do NOT build yet): real money · crypto ·
wallets · withdrawals · provably-fair proofs · RTP math · Monte-Carlo simulation ·
risk-of-ruin · bankroll · backend · sockets · licensing.

The MVP runs the engine **client-side** in the frontend. No backend needed.

## Current status (update me as things change)

- ✅ Nx monorepo (pnpm), TS everywhere, `moduleResolution: bundler` (no `.js` in imports).
- ✅ `@dmh/engine` — game core implemented + tested (`createRound`/`revealNext`/`cashOut`).
- ✅ `frontend` — React+Vite app, engine wired via Zustand store. TanStack Router/Query set up.
- ✅ Backend removed (was a stub). Re-add in Phase 2: `pnpm nx g @nx/nest:app ...`.
- ✅ **Design handoff received** (HTML/CSS from Claude Design, NOT Figma) — saved to
  `docs/design/handoff/`: the **High Noon** design system + the "Dead Men — Card
  Crash" prototype + screenshots + chat transcripts (design intent).
- ✅ `@dmh/ui` — full port of the High Noon DS (tokens, `hn-*` components, western
  icon set). Showcase at the `/kit` route. `import '@dmh/ui/styles.css'` once.
- 🚧 **Game screen is still a NEUTRAL PLACEHOLDER.** Next: build it from the handoff
  design, composing `@dmh/ui`. The game-specific "dead-men" skin (`dm-*`) lives in
  the frontend, not the DS.
- ⚠️ **Design ↔ engine gap to reconcile before the game screen:** the prototype is
  auto-deal (timer-paced), additive multiplier, **round-suit +0.3** bonus, suited
  cards, escalating-hazard death, TON currency. Our engine is manual-reveal,
  multiplicative, combo-based (no suits), flat `deadChance`, fake coins. Decide what
  to adopt (likely: add suits + round-suit to the engine) — see `docs/design/handoff/chats/`.
- ⬜ Then: verify `pnpm nx build frontend`; deploy to Vercel.

## Stack & layout

Nx monorepo, **pnpm**, layout `packages/*`:

| Project             | Tech                                                      | Role                                                          |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| `packages/engine`   | Pure TS, zero runtime deps (`@dmh/engine`)                | **RGS core** — all game rules. Reusable for B2C + future B2B. |
| `packages/ui`       | React · Vite lib (`@dmh/ui`)                              | **High Noon design system** — tokens, `hn-*` components, icons. |
| `packages/frontend` | React · Vite · TanStack Router · TanStack Query · Zustand | The MVP. Imports the engine + UI kit, runs client-side.       |

## Architecture rules

- **Game rules live ONLY in `packages/engine`.** Frontend consumes it; never
  reimplement game logic in components or stores.
- The engine is **deterministic and seedable** — randomness is injected (pass an
  `Rng`; never call `Math.random()` inside engine logic). This makes provably-fair
  possible in Phase 2 without a rewrite. (The store's per-round seed lives in the
  frontend, not the engine.)
- All tunable balance lives in one `GameConfig` (`packages/engine/src/config.ts`) —
  no magic numbers in code.

## Frontend state rules

- **Server state → TanStack Query** (nothing to fetch yet; ready for Phase 2).
- **Client state → Zustand** — current round, balance, UI. Keep stores small.
- **Game logic → `@dmh/engine`**, never duplicated.
- Routing → TanStack Router.

## Key product decisions (settled — don't re-litigate; see docs/decisions.md)

- **Provably-fair model, NOT pool-based crash** — dead card predetermined by a
  per-round seed, independent of the pool. (Phase 2; keep the engine seedable.)
- **"Felt strategy, not real strategy"** — players should _feel_ they spot patterns,
  but no cash-out strategy may return >100% RTP. Cards are a theme over a weighted
  RNG; no real 52-card deck, no card counting (independent draws per round).
- **Exposure control = max-win cap per round, NOT withdrawal caps.** Caps at the
  source keep payouts honest. (Phase 2.)
- **Sequence:** F2P fun-validation → RTP math & simulation → real-money.

## Conventions

- Code, identifiers, comments: **English**. Imports are **extensionless** (bundler resolution).
- The human developer communicates in **Russian** — respond in Russian.
- Run tasks via Nx: `pnpm nx build|test|typecheck <project>`. Engine is `@dmh/engine`.
- Minimal diffs; reuse patterns; avoid overengineering. Don't build Phase 2 infra in Phase 0.

## Project skills (`.claude/skills/`)

- `engine-dev` — rules for changing `packages/engine` (purity, determinism, seedability).
- `game-balance` — tuning `GameConfig` (weights, dead chance, combos) safely.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
