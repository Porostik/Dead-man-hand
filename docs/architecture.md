# Architecture

## Nx monorepo (pnpm)

```
dmh/
├─ packages/
│  ├─ engine/     @dmh/engine — pure TS game core (RGS). Zero runtime deps.
│  ├─ ui/         @dmh/ui — High Noon design system (React + Vite lib).
│  └─ frontend/   React + Vite TG Mini App. Engine client-side, composes @dmh/ui.
│                 Routes: / (game), /kit (DS showcase), /lab (economics inspector).
├─ tools/         gen-images.mjs (art) · simulate.mjs (Monte-Carlo economics).
├─ docs/          design · decisions · roadmap
└─ .claude/skills/  engine-dev · game-balance
```

Backend (NestJS) was generated then **removed** for the MVP — re-add in Phase 2 with
`pnpm nx g @nx/nest:app backend --directory=packages/backend`.

## Layers

```
frontend (React/Vite, TG Mini App)          presentation + input
  state: TanStack Query (server, Phase 2) · Zustand (client)
        │ imports @dmh/engine
        ▼
packages/engine  (pure TS, zero deps)        ALL game rules (RGS core)
  createRound (predetermines the whole round) · GameConfig · mulberry32 (seedable)
```

## Why the engine is its own library

It is the reusable **RGS core** (powers B2C now, B2B later), so it stays:

- **Pure** — no I/O, framework, network, DOM, or `Date.now()` in logic.
- **Dependency-free** — TypeScript only.
- **Deterministic & seedable** — randomness is injected via an `Rng`. Same seed +
  inputs ⇒ identical round. This is the foundation for **provably-fair** in Phase 2
  (server seed + client seed → verifiable round) with no rewrite.

The per-round seed currently lives in the **frontend store** (`Math.random()` is fine
there — it's app code, not engine). In Phase 2 the server owns the seed.

## TypeScript / module setup

- `tsconfig.base.json`: `module: esnext`, `moduleResolution: bundler` → **imports are
  extensionless** (no `.js`). Nx's default was `nodenext` (which forces `.js`); we
  switched it deliberately.
- Nx auto-syncs TS project references on `build`/`typecheck` (`pnpm nx sync`).

## MVP data flow (client-side)

```
GameScreen ──bet──▶ gameStore (Zustand)          ← TMA adapter: lib/telegram.ts
   ▲                   │ createRound(config, rng)   ← @dmh/engine rolls the WHOLE
   │ deal tick / X     │   round up-front (suit, dead index, every card)
   │ (useGameLoop)     │ store steps `dealtCount` through round.sequence
   └───────────────────┤ cash-out = bet * multiplier (computed in the store)
                       ▼ balance updated (fake coins)
```

`useGameLoop` paces the auto-deal (shuffle → deal each card → bust → next round);
the store never reimplements rules — it just advances `dealtCount` into the
engine-predetermined `round.sequence` and reads `multiplier` off the dealt cards.

## Phase 2 shift (real money)

The **server becomes authoritative**: backend runs `@dmh/engine` with a seeded RNG,
streams reveals over WebSocket, accepts cash-out intents; the client renders. Engine
code is unchanged — only _where it runs_ moves. Then: crypto wallet (TON/USDT),
provably-fair verification, exposure caps (max bet, **max-win cap per round**).
