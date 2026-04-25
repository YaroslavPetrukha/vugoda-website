# Phase 3: Brand Primitives & Home Page — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `03-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 03-brand-primitives-home-page
**Areas discussed:** Hero composition & parallax, IsometricCube primitive API & geometry, PortfolioOverview hierarchy & honesty, Hero image & image pipeline split
**Auto mode:** Off
**Text mode:** Off

---

## Gray-Area Selection

| Gray area | Description | Selected |
|-----------|-------------|----------|
| Hero composition & parallax | HOME-01 + ANI-01 + VIS-03. Wordmark source, IsometricGridBG source, parallax direction/intensity, CTA button style, viewport height. | ✓ |
| IsometricCube primitive API & geometry | VIS-03 — 3 variants `single`/`group`/`grid`; hand-author vs svgr-import for grid; typed stroke restriction. | ✓ |
| PortfolioOverview hierarchy & honesty | HOME-03 — flagship scale, pipeline grid symmetry, aggregate row placement; expresses 0/1/4 narrative. | ✓ |
| Hero image & image pipeline split | ROADMAP SC#3 `<picture>` + ≤200KB; whether Phase 3 ships optimizer script; ResponsivePicture component placement. | ✓ |

**User selected all four areas** — no implicit "you decide" deferrals at the gray-area layer.

---

## Area 1: Hero composition & parallax

### Q1.1 — IsometricGridBG source

| Option | Description | Selected |
|--------|-------------|----------|
| svgr-import brand SVG (recommended) | Import `brand-assets/patterns/isometric-grid.svg` as React component via `vite-plugin-svgr?react`. Geometry matches brandbook page-20 exactly. Limitation: fill+mix-blend, not strokes — but at 0.1–0.2 opacity on dark reads as lines. | ✓ |
| Hand-author inline React SVG | Stroke-based, 3 allowed colors enforced by typed prop. ~60–80 lines geometry. | |
| CSS background + tiled SVG | `background-image: url(...)` + repeat. Zero React overhead. Cannot animate individual paths. | |
| Photo background + svgr grid overlay | Raster hero photo + IsometricGridBG overlay. Changes hero from "pure type on pattern" to "photo + graphic overlay". | |

**User's choice:** svgr-import brand SVG (recommended).
**Notes:** svgr already installed from Phase 1's `vite-plugin-svgr@^4.3.0` in devDependencies but hadn't been used; Phase 3 activates it for this purpose.

### Q1.2 — Wordmark rendering

| Option | Description | Selected |
|--------|-------------|----------|
| Large `<h1>` in Montserrat 700 (recommended) | Plain HTML, 180–220px at desktop, SEO + a11y perfect, no extra asset. | ✓ |
| Extract wordmark SVG from logo asset | Pixel-perfect brand fidelity but lowercase (brand-system.md §2 reserves lowercase for the composite logo). Contradicts CONCEPT §7.1 uppercase spec. | |
| Hand-author SVG in Montserrat geometry | Allows per-letter motion. ~80 lines SVG + harder maintenance. | |
| H1 + accent underscore | H1 uppercase + 4px `#C1F33D` bar below, draw-in on reveal. Echoes Phase 1 D-03 Nav active-underline. | |

**User's choice:** Large `<h1>` in Montserrat 700 (recommended).
**Notes:** CONCEPT §7.1 explicitly calls hero wordmark «ВИГОДА» uppercase (display moment, not the composite logo lowercase); H1 semantic wins on a11y/SEO.

### Q1.3 — Parallax direction & feel

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical drift, grid moves up (recommended) | `useScroll` + `useTransform` translates grid 0 → −120px as scroll progresses. Wordmark fixed, grid drifts behind. Ease-out, no bounce. Cinematic but restrained. | ✓ |
| Vertical drift + wordmark slower counter-drift | 2-layer depth parallax. More cinematic; can look buggy if mis-tuned. | |
| Horizontal drift only | Grid translates sideways 60px. Less conventional; matches isometric axis. | |
| Fade+scale only, no translation | Grid fades 0.2 → 0.05 + scales 1.0 → 0.96. Safest, subtlest. | |

**User's choice:** Vertical drift, grid moves up (recommended).
**Notes:** Max translation ≤120px matches ROADMAP SC#1 ceiling.

### Q1.4 — Hero shape (viewport + CTA style)

| Option | Description | Selected |
|--------|-------------|----------|
| 100vh + accent-filled CTA (recommended) | Hero fills viewport. CTA is `bg-accent text-bg-black`. Signature accent use. | ✓ |
| 80vh + outline CTA | Hero 80%, peek of next section. CTA outlined. More restrained. | |
| 100vh + outline CTA | Maximum real estate + minimum accent. Very premium, risks underpowered. | |
| Dynamic aspect 16:9 + accent-filled CTA | Hero fixed aspect. Consistent composition across screens. | |

**User's choice:** 100vh + accent-filled CTA (recommended).

### Checkpoint

| Option | Description | Selected |
|--------|-------------|----------|
| Next area | Hero decisions enough; proceed to IsometricCube. | ✓ |
| More hero questions | Slogan typography, accent-bar treatment, scroll indicator. | |

---

## Area 2: IsometricCube primitive API & geometry

### Q2.1 — Geometry authoring approach

| Option | Description | Selected |
|--------|-------------|----------|
| Hand-author all 3 stroke-based (recommended) | All 3 variants inline React SVG, stroke-only, typed stroke prop restricted to 3 hexes. ~150 lines total. Full motion control per path. | ✓ |
| Hand single/group, svgr-import grid | Author single/group as stroke SVG; grid variant wraps `<IsometricGridBG>` svgr import. Mixed fill/stroke paradigm. | |
| svgr-import everything | All 3 from SVG files. Requires authoring standalone source SVGs in brand-assets (doesn't exist today). | |

**User's choice:** Hand-author all 3 stroke-based (recommended).

### Q2.2 — Cube-ladder role mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Lock per spec (recommended) | `single` → aggregate-row marker + empty-state. `group` → pipeline card corners. `grid` → hero overlay + full-bleed empty-state. Matches CONCEPT §5.2 verbatim. | ✓ |
| Lock but rename roles | Same variants, different semantic assignments. | |
| Defer until rendered | Ship primitives; slot-mapping happens phase-by-phase when surfaces exist. Risk: missing props. | |

**User's choice:** Lock per spec (recommended).

### Q2.3 — MinimalCube.tsx treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Delete file, ship IsometricCube only (recommended) | No call sites (grep verified); Phase 1 commented "Phase 3 replaces this". Clean delete. | ✓ |
| Extract geometry into IsometricCube `variant='single'` | Preserves the exact 3-polygon geometry Phase 1 committed. | |
| Keep as deprecated alias for one milestone | `export { IsometricCube as MinimalCube }`. Zero benefit. | |

**User's choice:** Delete file, ship IsometricCube only (recommended).
**Notes:** CONTEXT D-12 preserves the `single` variant's visual geometry (same polygon shape) so delete-plus-extend doesn't shift pixels.

### Q2.4 — Home-page cube use beyond hero + aggregate

| Option | Description | Selected |
|--------|-------------|----------|
| Hero + aggregate only (recommended) | Cube appears ONLY where semantically required. Restrained use matches brand. | ✓ |
| + subtle section dividers | Cube divider between sections with thin line. Adds rhythm, risks filler. | |
| + corner accents in BrandEssence cards | Each value card has a corner `single` cube. | |
| + signature moment under wordmark | `group` variant below hero H1. Risks competing with IsometricGridBG. | |

**User's choice:** Hero + aggregate only (recommended).

### Checkpoint

| Option | Description | Selected |
|--------|-------------|----------|
| Next area | Cube decisions enough; proceed to PortfolioOverview. | ✓ |
| More cube questions | Size presets, default opacity per context, self-animate on reveal. | |

---

## Area 3: PortfolioOverview hierarchy & honesty

### Q3.1 — Flagship scale

| Option | Description | Selected |
|--------|-------------|----------|
| Full-width hero card (recommended) | `max-w-7xl` wide, large aerial render, external CTA. Dominant because it's the only active build. | ✓ |
| Half-width featured + pull quote | 60% image + 40% editorial quote. Less cinematic. | |
| Hero-within-section (full-bleed render) | Escapes container; overlay text on image. Flirts with marketing-hero tone. | |
| Equal card with pipeline | 2×2 or 4-in-row grid treating Lakeview as peer. Actively fights honesty narrative. | |

**User's choice:** Full-width hero card (recommended).

### Q3.2 — Pipeline grid layout

| Option | Description | Selected |
|--------|-------------|----------|
| 3-in-row, equal cards (recommended) | Symmetric grid. Matches `/projects` hub design (consistency). | ✓ |
| 3-in-row, weighted by render count | Etno Dim visually larger; Маєток + NTEREST smaller. | |
| Horizontal scroll on home, 3-in-row on /projects | Scroll-snap preview; teaser feel. Risks confusion. | |
| Vertical stack side-by-side | 3 editorial rows (image left, text right). Very long page. | |

**User's choice:** 3-in-row, equal cards (recommended).

### Q3.3 — Aggregate row placement

| Option | Description | Selected |
|--------|-------------|----------|
| Text strip + single-cube marker (recommended) | Below grid, `single` cube left + aggregate text right. `«Без назви»` title NOT shown. | ✓ |
| Ghost 4th card in grid with center cube | 4-in-row grid with 4th slot as aggregate. Dilutes hierarchy. | |
| Skip on home, show only on /projects | Violates HOME-03 explicit scope. | |
| Full-width bar with `«Без назви»` visible | Foregrounds placeholder. Risks reading as broken to DD readers. | |

**User's choice:** Text strip + single-cube marker (recommended).

### Q3.4 — Section header

| Option | Description | Selected |
|--------|-------------|----------|
| «Проєкти» + subtitle (recommended) | H2 matches nav label + «1 в активній фазі · 4 у pipeline · 0 здано» subtitle. Honest count. | ✓ |
| «Портфель» + stage filter badge row | H2 + Model-Б bucket counts as badges. Repeats card info. | |
| «1 активно, 4 в погодженні, 0 здано» (declarative H2) | Heading IS the statement. Unconventional for SEO. | |
| No heading, grid speaks | Risks feeling ungrounded. | |

**User's choice:** «Проєкти» + subtitle (recommended).

### Checkpoint

| Option | Description | Selected |
|--------|-------------|----------|
| Next area | Portfolio decisions enough; proceed to hero image & pipeline. | ✓ |
| More portfolio questions | Pipeline card content, stage-label style, card hover, aggregate typography. | |

---

## Area 4: Hero image & image pipeline split

### Q4.1 — What IS the hero image

| Option | Description | Selected |
|--------|-------------|----------|
| Lakeview aerial.jpg in PortfolioOverview flagship (recommended) | `aerial.jpg` is LCP target; preloaded `<picture>` AVIF→WebP→JPG. | ✓ |
| No hero image — SVG-only hero | Remove SC#3 hero-image requirement; PortfolioOverview flagship is just first below-fold image. | |
| Dedicated hero photo (new asset) | Add raster facade photo as hero background at opacity 0.4. Expands scope. | |
| aerial.jpg as background with gradient mask | aerial.jpg at 20% opacity as hero texture + flagship card. Double-LCP. | |

**User's choice:** Lakeview aerial.jpg in PortfolioOverview flagship (recommended).
**Notes:** The hero SECTION is pure SVG+type per Area 1; the aerial.jpg below is the first large raster above/at the fold — the Lighthouse LCP.

### Q4.2 — Image optimization pipeline location

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 3 ships sharp-based script (recommended) | `scripts/optimize-images.mjs` produces AVIF/WebP/JPG × 3 widths. Phase 6 does verification only. | ✓ |
| Phase 3 one-shot manual optimization | Manually produce variants via Squoosh. Phase 6 builds script at scale. Duplicated effort. | |
| Defer all to Phase 6 | Ship raw JPG now, take Lighthouse hit. Risks failed demo before Phase 6. | |

**User's choice:** Phase 3 ships sharp-based script (recommended).

### Q4.3 — ResponsivePicture component placement

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 3 (recommended) | Ship `<ResponsivePicture>` in `src/components/ui/` alongside optimizer; reused by Phase 4 gallery + log + Phase 6 lazy-load smarts. | ✓ |
| Phase 3 for hero only, Phase 4 for everything else | Thin one-off in Phase 3; generalize in Phase 4. Risks re-design + tech debt. | |
| Phase 4 (defer component design) | Plain `<img>` in Phase 3; Phase 4 retrofits. Pushes Lighthouse risk later. | |

**User's choice:** Phase 3 (recommended).

### Q4.4 — Construction teaser image handling

| Option | Description | Selected |
|--------|-------------|----------|
| Same pipeline, lazy-loaded (recommended) | Optimizer processes construction/ too. Teaser uses `loading="lazy"` + smaller widths [640, 960]. | ✓ |
| Dedicated JPG-only pass | Hand-tuned mozjpeg, single width 960px. Inconsistent with renders pipeline. | |
| Unoptimized originals for MVP | Raw ~300KB photos; Phase 6 handles. Pushes 15MB `/construction-log` problem to Phase 6. | |

**User's choice:** Same pipeline, lazy-loaded (recommended).

### Checkpoint

| Option | Description | Selected |
|--------|-------------|----------|
| Ready for context | All four areas covered; remaining sections become Claude's Discretion within brand + content modules. | ✓ |
| More gray areas | ContactForm shape, Methodology block selection, BrandEssence layout, TrustBlock, layout width. | |

**User's choice:** Ready for context.

---

## Claude's Discretion (captured in CONTEXT.md)

Areas the user explicitly delegated to the planner within brand rules + Phase 2 content modules:

- BrandEssence card layout (4-in-row vs 2×2; numbered vs pure typography)
- ConstructionTeaser interaction detail (native scroll-snap + arrow button placement)
- MethodologyTeaser block selection (2–3 of 7; recommendation: blocks 1+3+4 — all verified)
- TrustBlock layout (table vs stacked facts vs horizontal strip)
- ContactForm shape — CONTEXT locks single CTA button (no fake form fields) per PROJECT.md Out of Scope
- Layout container width — CONTEXT locks `max-w-7xl` uniform 1280 (Claude's call within that)
- Hero wordmark exact pixel size (180 vs 220px)
- Accent CTA hover style (brightness / underline-grow / tracking-shift)
- Section rhythm spacing precision (py-16/20/24)
- Sharp encoding quality parameters (within reasonable defaults)
- `/dev/brand` showcase composition depth (primitives-only vs including sample cards)
- Whether to add a subtle "scroll down" hint at hero bottom (brand tone leans no)

---

## Deferred Ideas

Captured in CONTEXT.md `<deferred>` section — not actioned in Phase 3:

- Scroll-reveal wrapping of home sections — Phase 5 (ANI-02)
- Route transitions via `<AnimatePresence>` — Phase 5 (ANI-04)
- Reduced-motion hook integration — Phase 5 (Phase 3 adds minimal guard on hero parallax)
- Session-skip fast hero on re-visit — Phase 5
- Card hover states — Phase 4 (ANI-03)
- `/dev/grid` fixtures route — Phase 4
- OG image for social unfurls — Phase 6 (QA-03)
- Multi-language (EN) — v2
- Real contact form with backend — v2 INFR2-04
- BrandEssence micro-animations — Phase 5
- Lighthouse score verification — Phase 6
- Image optimizer content-hash caching — v2
- PortfolioOverview flagship hover — Phase 5
- MethodologyTeaser expand-to-all-7 UI — v2 `/how-we-build`
- Wordmark as standalone SVG component — v2

---

*Phase: 03-brand-primitives-home-page*
*Discussion log written: 2026-04-25*
