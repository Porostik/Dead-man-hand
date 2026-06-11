# Art prompts — Dead Men's Hand

Copy-paste these into a free image generator, then drop the PNGs into
`docs/design/generated/` with the **exact file names** below — I composite
(black bg → `mix-blend-mode: screen`) and wire them into the game.

## Recommended free tools
- **Google Gemini** (gemini.google.com) — free, best at specific composition
  (the A-A-8-8 mascot). First choice.
- **Bing Image Creator** (bing.com/create) — free, DALL·E 3, basically unlimited.
- **Leonardo.ai** — free daily credits, game-art tuned.

## Rules for every image (keeps the set consistent + easy to composite)
- **Pure black background**, single subject, centered, isolated — no scene, no table.
- Palette: warm rust + ember-orange + antique gold. Dramatic low rim light, glowing embers.
- Style: premium Wild-West mobile-game asset, highly detailed digital illustration.
- **No text, no border, no watermark.** Square 1:1 for items, portrait 3:4 for the mascot.

Shared style suffix (append to each): *"warm rust, ember-orange and antique-gold
palette, glowing embers, dramatic low rim light, centered isolated subject on a pure
black background, premium Wild-West mobile game art, highly detailed digital
illustration, no text, no border."*

---

## 1. `mascot.png` — the hero (portrait 3:4)
> A mascot for a Wild-West card-crash game: a skeletal bony hand of death rising up
> from below, bare weathered bone fingers, fanning out a spread of old worn playing
> cards, tattered dark leather sleeve cuff at the wrist. + shared style suffix.

Two alt directions worth trying (pick whichever reads best):
- **Two hands** — *two skeletal bony hands of death dealing and fanning a deck of old
  worn playing cards, bare weathered bone fingers, tattered dark sleeve cuffs.*
- **No cards (most iconic)** — *a single skeletal bony hand of death reaching upward,
  bare weathered bone fingers spread, tattered dark leather sleeve cuff at the wrist.*

Tip: generate each a few times and keep the best — this is the one worth iterating on.
No specific card faces needed — generic worn cards are fine.

## 2. `gold-ring.png` (square 1:1)
> A single ornate gold ring standing upright, Wild-West poker prize, polished antique
> gold with subtle engraving. + shared style suffix.

## 3. `gold-coins.png` (square 1:1)
> A neat pile of shiny gold coins, Wild-West saloon style, bright golden highlights,
> 3D render. + shared style suffix.

## 4. `bullets.png` (square 1:1)
> A small group of three brass bullet cartridges standing and lying together, gold and
> rust tones, 3D render. + shared style suffix.

## Optional extras ("что-то ещё")
- `sheriff-badge.png` — A six-point sheriff star badge in polished antique gold with
  subtle engraving, Wild-West style, 3D render. + suffix.
- `revolver.png` — A single ornate Wild-West revolver, engraved antique-gold and
  gunmetal finish, 3D render. + suffix.
- `poker-chips.png` — A small stack of poker chips in black, gold and deep red,
  Wild-West saloon style, 3D render. + suffix.

---

*These same prompts live in `tools/gen-images.mjs` (the `JOBS` array) for the paid
`fal` path: `PROVIDER=fal node --env-file=.env tools/gen-images.mjs`. The free
Pollinations provider is currently paywalled (x402) — use a web tool instead.*
