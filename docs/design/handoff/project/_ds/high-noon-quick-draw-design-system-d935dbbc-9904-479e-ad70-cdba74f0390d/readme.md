# High Noon — Quick Draw Design System

Design system for **Quick Draw**, a 1v1 bluff-duel iGaming game delivered as a **Telegram mini app**, staked in **TON**. Two players, hidden 3-card hands, one short round of raise / call / fold — the tension of a high-noon standoff. The visual world is **High Noon**: warm leather, sun-bleached parchment, rust and gold, a low desert sun.

This system codifies that world into **tokens, a western icon set, reusable components and paraphernalia (coins, pots, bullets, the revolver cylinder)** so every surface is built from the same parts. Mobile-first throughout (390px TG mini-app frame). It is a pure design system — components and specimens, no assembled product screens.

> **Bundle namespace** (for React components in `@dsCard` HTML): `window.HighNoonQuickDrawDesignSystem_d935db`.

---

## Sources & context

The system was grown from an earlier concept project (`IGaming-concepts/`, mounted read-only). The reference pages there — the 8 game concepts, the Quick Draw mechanic, the four explored visual themes (High Noon was chosen), and the production plan — are the design rationale. They are not required to use the DS.

---

## CONTENT FUNDAMENTALS

**Language.** Primary UI copy is **Russian**; brand/game proper nouns stay English (_Quick Draw, High Noon, Bo3, ELO, TON, cash out, fold, raise_). The mix is intentional — poker/western terms read as jargon.

**Voice.** Terse, confident, a little swaggering — a card sharp, not a casino host. Short lines, active verbs. We dare the player without hyping odds.

- Tagline: _"first to flinch loses"_ / _"кто дрогнул — проиграл"_.
- CTA: **НАЙТИ СОПЕРНИКА**, **РЕВАНШ ↺**, **CASH OUT**, **FOLD**, **RAISE 1.0**.
- States: _"обычно 5–15 секунд · реальный игрок"_, _"соперник думает… 0:06"_, _"2 из 3 · дожми"_.

**Casing.** Primary buttons and the wordmark sit in display caps. Labels/meta are **UPPERCASE mono** with wide tracking (`--ls-label`). Body is sentence case.

**Address.** Speak to the player as **ты** (informal). The opponent is _соперник_ / _rival_ (e.g. _@calamity_, your _немезида_).

**Numbers.** Always monospace (`Space Mono`): balances `◎ 12.40 TON`, `ELO 1820`, timers `0:06`, multipliers `×2`, pot. The `◎` glyph stands in for the TON mark.

**Emoji.** Not used in chrome or copy. The **only** sanctioned emoji are the in-round **taunts** — a closed set (😎 🥶 🔥 😏) on a cooldown. Treat them as game content, never decoration. Everywhere else use the western **Icon** set.

**Vibe.** Heat, dust, nerve. Confidence over luck. We celebrate _the read_ (winning a bluff) more than the cards.

---

## VISUAL FOUNDATIONS

**Mood.** Dark, warm, theatrical. The product lives on near-black leather with a low sun glowing from below the horizon; UI elements are sun-bleached parchment and rust. Never cool, never neutral-gray.

**Color** (`tokens/colors.css`). Three base ramps — **clay/leather** (backgrounds), **sand/parchment** (text + card faces), and accents **rust** (primary/heat), **gold** (trim/win/premium), **turquoise** (secondary/cash-out/positive). Status: turquoise = positive, `--danger #b23a2a` = danger/fold, amber = warning, gold = jackpot/win. Reference **semantic** tokens (`--accent`, `--surface-1`, `--text-body`) in product code, not raw ramp steps.

**Type** (`tokens/typography.css`).

- **Rye** — display only: wordmark, hero, win banner, card numerals. Always large, sparing. _(Latin only — do not set Cyrillic in Rye; it falls back. Cyrillic headings use Zilla Slab.)_
- **Zilla Slab** — all UI + body. 15px default; the slab serif keeps the warm/period feel while staying readable.
- **Space Mono** — every number and every uppercase micro-label.

**Spacing** (`tokens/spacing.css`). 4px base grid (`--space-1…10`). Screen edge padding `--pad-screen` (20). Min tap target 44px. App frame 390×800.

**Backgrounds.** Solid warm darks + **radial sun glows** (pure CSS, no images). Subtle textures via repeating-linear-gradients (card backs, the felt vignette `--inset-felt`). No photographic backgrounds; no bluish gradients.

**Borders.** Hairline gold at low alpha (`--border-hairline`) for separation; full **gold** (`--border-strong`) for emphasis (modals, win, premium cards). Card faces and chips carry gold edges. Widths `1.5 / 2 / 3`.

**Radii.** Soft, not pill-everything: cards `--radius-lg` (18), inputs `sm`/`md`, sheets/modals `--radius-xl` (24), playing card `--radius-card` (9); pills for chips/segments/badges.

**Shadows.** Always **warm-tinted** (`rgba(15,7,4,…)`), never gray. Elevation `sm/md/lg`; cards & chips use `--shadow-card`; **glows** (`--glow-gold`, `--glow-rust`) only for win / heat moments. Buttons use a **hard bottom edge** (press shadow) that collapses on `:active` — a pressed, physical feel, not a blur.

**Cards (surfaces).** `--surface-1` panel, hairline gold border, `--radius-lg`, warm `--shadow-md`. Raised variant lifts elevation; gold variant strengthens the border.

**Animation.** Easing `--ease-out` (general), `--ease-back` (deals & flips — slight overshoot), `--ease-in-out`. Durations `140 / 240 / 420`. Signature CSS motions: card deal, 3D flip, chip→pot, raise shove + glow, win lift+gild, and the **burning-fuse timer**. Respect `prefers-reduced-motion` (handled in `tokens/effects.css`). No infinite decorative loops on content.

**Hover / press.** Hover: lighten the fill (`--accent-hover`) or warm-tint wash for ghost/icon buttons. Press: buttons translate down onto their bottom edge; icon/segment shrink slightly. Focus: 2px gold ring, offset 2px.

**Transparency / blur.** Sparingly — only modal/drawer scrims (`--overlay-scrim`) get a light backdrop blur. UI surfaces are opaque.

---

## ICONOGRAPHY

The system now ships a **bespoke western icon set** (`components/brand/Icon.jsx`, mirrored as standalone SVGs in `assets/icons/`). One cohesive **solid-fill** style on a 24×24 grid, drawn with `currentColor` so every glyph tints to a token. Two families:

- **Paraphernalia / brand** — `spade · heart · club · diamond · star · sheriffStar · coin · chip · bullet · hat · horseshoe · revolver · dynamite · skull · cactus · flame · bolt · trophy · target`.
- **UI essentials** — `plus · close · back · chevron · menu · check · user · wallet · gear · clock · share · copy · info`.

Use `<Icon name="revolver" />` (React) or copy a file from `assets/icons/`. Tint with CSS `color`; never hard-code fills. **Prefer these over the legacy unicode glyphs** (★ ◆ ≡ ☻) used in the earliest screens. The **★** on card backs remains the brand motif.

> Richer game objects are their own components, not icons: **Coin**, **PotPile** (the staked bank), **AmmoMeter** / revolver **cylinder** (Bo3 rounds). Illustrated cosmetics (skin card-backs, frames) live in the shop kit.

**Substitution flag:** the icon set is hand-authored for this brand (the Iconify/Game-Icons CDN was unavailable in the build sandbox). It is intentionally simple and geometric; if you want a denser library later, Phosphor or Lucide are the closest stroke-weight matches — flag before swapping.

---

## FONTS — please confirm

Fonts load from **Google Fonts** via `@import` in `tokens/fonts.css` (Rye, Zilla Slab, Space Mono — the intended families, not substitutes). Because they are `@import`ed rather than self-hosted `@font-face`, the compiler reports **0 bundled fonts**. If you need an offline/self-hosted build, send the `.woff2` files (or say the word) and I'll add `@font-face` rules and drop them in `assets/fonts/`.

---

## Index / manifest

**Entry:** `styles.css` (consumers link this one file). It `@import`s: `tokens/fonts.css`, `tokens/{colors,typography,spacing,effects}.css`, `components.css`, `components-extra.css`.

**Components** — `components/`

- `brand/` — **Icon** (western set + `HN_ICONS`), **Wordmark**
- `buttons/` — **Button**, **IconButton**
- `forms/` — **Input**, **AmountField**, **SegmentedControl**, **Switch**, **Checkbox**
- `surfaces/` — **Card**, **Modal**, **Drawer**
- `feedback/` — **Badge**, **Toast**, **Banner**, **ProgressBar**, **Spinner**, **Tooltip**
- `game/` — **PlayingCard**, **Chip**, **Coin**, **PotPile**, **AmmoMeter**, **FuseTimer**, **Avatar**
- `navigation/` — **Tabs**, **BottomNav**

**UI kit** — _removed._ This project is a pure design system: tokens, components and specimens only. Each component ships an individual, interactive demo card in the Design System tab (grouped by Buttons / Forms / Surfaces / Feedback / Game / Navigation / Brand). Assemble product screens in a consuming project, not here.

**Foundations / specimens** — `guidelines/` (color, type, spacing, radius, shadow, brand) shown in the Design System tab, alongside the component & paraphernalia cards.

**Assets** — `assets/icons/` (19 western SVGs).

---

## How to use

Link `styles.css`, then either use the React components from `components/` (they apply the `hn-*` classes) or the classes directly in HTML. Build product screens by composition in a consuming project. All color/space/type values come from tokens; don't hard-code hexes.

> **Sharing:** set the file type to **Design System** in the Share menu so others in the org can use it.
