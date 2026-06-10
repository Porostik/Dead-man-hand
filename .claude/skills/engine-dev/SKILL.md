---
name: engine-dev
description: Use when adding or changing logic in packages/engine (the Dead Men's Hand RGS core). Enforces purity (no I/O or framework), determinism (inject Rng, never call Math.random inside), config-driven balance, and provably-fair readiness. Trigger whenever a task touches game rules, round flow, card draws, combos, or cash-out logic.
---

# Engine development rules

`packages/engine` (`@dmh/engine`) is the **RGS core** — the reusable asset that
powers both our app (B2C) and future B2B integrations. Treat it as a pure library.

## Hard rules

1. **Purity.** No I/O, network, framework imports, DOM, or `console` in logic paths.
   Input → output only. Nothing but TypeScript and standard built-ins.
2. **Determinism.** Never call `Math.random()` or `Date.now()` inside engine logic.
   All randomness comes from an injected `Rng` (`() => number` in `[0,1)`). Same
   seed + inputs ⇒ identical round — the foundation for provably-fair. Don't break it.
3. **Config-driven.** No magic numbers. Every tunable lives in `GameConfig`
   (`src/config.ts`). New mechanic ⇒ new config field, not an inline constant.
4. **Zero runtime dependencies.** Don't add npm deps to this package (devDeps ok).
5. **Extensionless imports** (`from './types'`), per the workspace bundler resolution.

## Conventions

- Public API is exported from `src/index.ts`. Keep it small and explicit.
- Pure functions over classes; state objects are plain serializable data.
- Add a vitest test for any new rule (a fixed seed makes this trivial).
- Verify: `pnpm nx test @dmh/engine`, `pnpm nx typecheck @dmh/engine`.
