# DESIGN.md — Vugoda Brand Design System

> Design context file for the Impeccable design skill. Source of truth: `Вигода_брендбук.pdf` (21 pp.) + `brand-system.md`.
> **This file overrides Impeccable's defaults.** See "Impeccable Default Overrides" section at the bottom.

## Color Strategy

**Strategy: Restrained.** Tinted-dark base + acid-lime accent ≤10%. The brand DNA is *deep dark surface + bright single accent*. Never collapse to "drenched" or "full palette" — those exceed brandbook.

### Closed Palette (6 fixed HEX values — NEVER substitute, NEVER add)

| Role | HEX | Usage |
|---|---|---|
| `--bg` | `#2F3640` | Primary dark background. App default. |
| `--bg-black` | `#020A0A` | Deep black for emphasis sections, ink on light. |
| `--surface` | `#3D3B43` | Anthracite for cards, panels, elevated surfaces. |
| `--accent` | `#C1F33D` | Acid-lime. CTAs, active states, key highlights, isometric cube fill. **Point-use only — never as a wide-section background.** |
| `--text` | `#F5F7FA` | Primary text on dark. |
| `--text-muted` | `#A7AFBC` | Secondary text, descriptors, placeholders. **Min 14pt — fails AA at smaller sizes.** |

### Color Bans (project-specific, override Impeccable defaults)

- **No OKLCH transformations.** The 6 HEX values are fixed by brandbook. Do NOT propose OKLCH equivalents, "tinted neutrals", chroma-reduced edges, or anything outside the closed palette.
- **No gradients on lines or strokes.** Brandbook §5 explicit ban.
- **No glow / neon / shadow effects on the logo or the accent cube.**
- **`#C1F33D` never on light backgrounds.** Contrast ratio ≈1.2:1 — FAIL. Never use as text/icon color on `#F5F7FA` or white.
- **No "category-reflex" palettes.** No "real-estate gold", no "luxury navy", no "premium emerald". The brand IS lime-on-anthracite — that's the differentiation.

### Verified Contrast (WCAG 2.1)

| Combination | Ratio | Verdict |
|---|---|---|
| `#F5F7FA` on `#2F3640` | 10.5:1 | AAA — body text |
| `#C1F33D` on `#2F3640` | 8.85:1 | AAA — CTAs, numbers |
| `#C1F33D` on `#020A0A` | 13.5:1 | AAA — accent on black |
| `#A7AFBC` on `#2F3640` | 5.3:1 | AA only ≥14pt |
| `#020A0A` on `#F5F7FA` | 20:1 | AAA — ink on light |

## Typography

**One family. Three weights. No exceptions.**

- **Family:** **Montserrat** (geometric grotesque). Self-hosted via `@fontsource/montserrat` static — full Cyrillic coverage (`ґ є і ї`).
- **Weights allowed:** `400` (Regular, body) · `500` (Medium, subheads, leads, accents) · `700` (Bold, H1, H2).
- **Weights forbidden:** Light (300), Semi-Bold (600), ExtraBold (800), Black (900). Brandbook does not authorize them.
- **Decorative fonts forbidden:** no Playfair, no Cormorant, no Inter, no Outfit, no script/handwritten faces, no italic styles.

### Type Scale (desktop, 1920×1080 first)

| Role | Weight | Size | Notes |
|---|---|---|---|
| H1 / hero | 700 | 56–80 px | line-height ~1.1 |
| H2 / section | 700 | 40–48 px | |
| H3 / card title | 500 | 24–28 px | |
| Lead | 500 | 20 px | |
| Body | 400 | 16 px | line-height 1.55 |
| Caption / descriptor | 400 | 13–14 px | `--text-muted`, often uppercase + letter-spacing 0.04em |

### Typography Notes

- Logo wordmark «вигода» — lowercase. Some H1 may follow this discipline. Don't break it for "polish".
- Body line length: 65–75ch (per Impeccable shared laws — aligns with brandbook restraint).
- Hierarchy through **scale + weight contrast** (≥1.25 ratio between steps). Avoid flat scales.
- Letter-spacing — restrained. No "decorative" tracking on body.

## Graphic Language

**Linear isometry + wireframe cube structures.** This is the brand's signature visual primitive.

### Three complexity tiers (brandbook §5)

1. **Base module** — single isometric wireframe cube.
2. **Structural group** — 2–3 cubes joined by faces.
3. **Isometric grid (pattern)** — repeating tile for backgrounds, hero, section dividers.

### Stroke parameters (hard limits)

- **Width:** 0.5–1 pt (≈ 1–1.5 px on screen). **Maximum 1.5 pt.** Never thicker.
- **Color:** `#A7AFBC`, `#F5F7FA`, or `#C1F33D` only.
- **Opacity:** 5–60% (faint by default — visible without dominating).
- **Style:** Butt Cap, Miter Join. **Straight lines only — no curves on the wireframe primitive.**

### Allowed uses

- Background pattern at 10–20% opacity over hero / section dividers.
- Overlay on architectural photography (Overlay or Screen blend mode).
- Schematic illustrations: floors, zoning, stage diagrams.
- UX state for "pipeline without renders" (Pipeline-4 Безіменний) — single base-module cube as placeholder.

### Forbidden

- Overlapping logo elements.
- Color gradients on lines.
- Lines thicker than 1.5 pt.
- Curved/organic versions of the cube primitive.
- 3D rendered (non-wireframe) cubes.

## Layout

- **Grid:** 12-col desktop · 4-col mobile. Gutter 24/16 px.
- **Spacing scale:** `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96` px.
- **Breakpoints:** `640 / 768 / 1024 / 1280 / 1536`. Desktop-first — design at 1920, fall back gracefully.
- **Air:** large negative space around headings — brandbook shows lots of white room. Don't crowd.
- **Card discipline:** cards exist for portfolio items and document blocks only. **No nested cards.** No "lazy card grids" of identical 3-column tiles with icon+title+text.

## Motion

- **Curve:** ease-out exponential family (`ease-out-quart`, `quint`, `expo`). **No bounce, no elastic, no spring overshoot for UI affordances.**
- **Duration:** 150–250ms for micro-interactions; <300ms for UI transitions; route transitions can extend to 400–600ms for cinematic moments (hero curtain, count-up).
- **Don't animate layout properties** (`width`, `height`, `top`, `left`, `margin`). Use `transform` and `opacity`.
- **Purposeful motion only.** Animate state change, not decoration. If the animation doesn't communicate a transition, it shouldn't exist.
- **prefers-reduced-motion** — honor it. Cinematic reveals fall back to instant or short fade.

## Components & Anti-patterns

### Components in scope

- Navbar (logo on dark variant, full guard zone respected).
- Footer (legal facts: ЄДРПОУ, license date, address).
- Project card (5 ЖК objects, must support all stages: pipeline / construction / completed).
- Construction-log timeline (50 raw photos in `/construction/{month}/` with isometric overlay).
- Contact form (mailto: only — no backend, no validation library).
- Lightbox (existing).

### Project-specific bans

- **No team photos / no team names anywhere.** Per client decision (`CONTEXT.md` §1).
- **No Pictorial / Рубікон mentions** in copy, SEO, or schema. Silent displacement applies to Lakeview only.
- **No stock illustrations.** Photos only from `/renders/` (5 source folders) and `/construction/` (50 raw photos).
- **No AI-generated architectural visuals.**
- **No team / leadership avatars in any blog/news block.**

## Impeccable Default Overrides

The Impeccable shared design laws apply with these explicit project overrides:

| Impeccable default | Vugoda override |
|---|---|
| "Use OKLCH. Reduce chroma at extremes." | **NO.** Use the 6 fixed HEX values from brandbook. No OKLCH transformations, no chroma adjustments, no tinted neutrals. The palette is closed by client mandate. |
| "Tint every neutral toward brand hue (chroma 0.005–0.01)." | **NO.** Neutrals are `#A7AFBC` and `#F5F7FA`, fixed. Don't propose hue-shifted variants. |
| "Pick a color strategy" → may suggest Committed/Drenched | **Locked to Restrained.** Brandbook does not authorize broader strategies. |
| "Cap body line length at 65–75ch" | **Keep.** Aligns with brandbook restraint. |
| "Cards are the lazy answer; nested cards always wrong" | **Keep.** Already aligned. |
| "Side-stripe borders banned" | **Keep.** Use full borders or background tints when separation is needed. |
| "Gradient text banned" | **Keep, strictly.** No `background-clip: text` with gradients. |
| "Glassmorphism rare" | **Keep.** Brandbook bans glow/blur on logo and cube. |
| "Hero-metric template SaaS cliché banned" | **Keep, but with nuance.** We DO show legal facts (ЄДРПОУ, ліцензія, СС3) as factual proof — not as decorative big-number stats. The visual treatment must read "document", not "dashboard hero". |
| "No em dashes — use commas/colons/parentheses" | **Override allowed.** Ukrainian copy uses em-dash `—` per Ukrainian typography norms. Keep it. |
| "Dark vs light is never default" | **Default IS dark** (`#2F3640`). The brandbook is fully dark. Light sections (`#F5F7FA`) are point-use for inversion / proof blocks only. The "physical scene" sentence is satisfied: "Львівський інвестор переглядає об'єкт з телефону / 27" монітора в офісі, оцінює доказовість бренда". |
| "Theme via OKLCH + chroma" | **Theme via fixed CSS custom properties** named in brandbook (`--bg`, `--accent`, `--text`, `--text-muted`, `--surface`, `--ink`, `--bg-black`). |
