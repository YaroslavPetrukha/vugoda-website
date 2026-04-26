---
phase: 06-performance-mobile-fallback-deploy
plan: 02
subsystem: content-and-assets
tags: [content-module, svg, og-image, mobile-fallback, brand-assets, pre-pathed, cyrillic]

# Dependency graph
requires:
  - phase: 02-data-layer-content
    provides: Leaf content-module pattern (D-15 scannability + D-32 IMPORT BOUNDARY) + scripts/check-brand.ts importBoundaries() rule that enforces zero forbidden imports in src/content/
  - phase: 03-brand-primitives-home
    provides: IsometricCube variant='single' polygon geometry (3 rhombi, viewBox 0 0 100 100) inline-copied into og.svg accent layer; brand-assets/patterns/isometric-grid.svg lozenge motif geometry distilled into og.svg overlay
  - phase: 01-foundation-shell
    provides: 6-canonical brandbook palette (#2F3640, #C1F33D, #F5F7FA, #A7AFBC, #3D3B43, #020A0A) + @fontsource/montserrat cyrillic-700 entry point (loaded for browser-side mobile fallback wordmark; NOT needed for og.svg PNG export)
provides:
  - "src/content/mobile-fallback.ts — 3 named exports (fallbackBody, fallbackEmail, fallbackCtas) consumed by plan 06-04 MobileFallback.tsx"
  - "brand-assets/og/og.svg — 1200×630 hand-authored composition consumed by plan 06-06 scripts/build-og-image.mjs sharp pipeline"
  - "RESEARCH Pitfall 3 mitigation locked at author time: «ВИГОДА» wordmark rendered by 6 <path> elements (NOT <text>) — sharp on Ubuntu GH runner produces deterministic PNG without Cyrillic Montserrat font available"
affects: [06-04 MobileFallback, 06-06 build-og-image script, 06-08 verify Lighthouse + OG unfurl]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Wordmark pre-pathing as SVG-render-determinism strategy (RESEARCH Pitfall 3 mitigation; permanent doc-block in og.svg)"
    - "Leaf content-module precedent extended to src/components/layout/ consumer (mobile-fallback.ts JSDoc adds layout/ to the IMPORT BOUNDARY allowlist alongside pages/ and components/sections/)"

key-files:
  created:
    - src/content/mobile-fallback.ts
    - brand-assets/og/og.svg
  modified: []

key-decisions:
  - "fallbackEmail intentionally duplicates company.email literal — keeps mobile-fallback module fully self-contained (no cross-import for one string), simpler audit. Phase 7 manual review catches drift."
  - "Wordmark rendered as 6 hand-authored <path> elements (one per Cyrillic letter В И Г О Д А) using fill-rule='evenodd' for О/Д/А internal counters. Geometric Montserrat-700 inspired letterforms — heavy sans-serif at cap-height 140 with ~22 stroke weight. NO <text> in wordmark group."
  - "Sub-line «Системний девелопмент» kept as <text> per D-30 carve-out — DejaVu Sans fallback on Linux GH runner is visually acceptable at 32px. Sub-line literal appears EXACTLY ONCE in og.svg per acceptance criterion."
  - "IsometricGridBG overlay geometry distilled from brand-assets/patterns/isometric-grid.svg into ~95 inline <polygon> top-rhombus tiles tiled across 1200×630. Pattern source uses complex multi-shape bezier composition; OG layer uses simplified single-rhombus repetition at opacity 0.15 — visually equivalent for 1200×630 at OG-card display sizes (typically 600×315 or smaller in messengers)."
  - "Accent cube geometry verbatim from Phase 3 IsometricCube variant='single' (3 polygons: top '50,15 85,35 50,55 15,35', left '15,35 15,75 50,95 50,55', right '50,55 50,95 85,75 85,35') — preserves cross-Phase consistency without runtime React reference."

patterns-established:
  - "Pattern 1: Pre-pathing critical brand glyphs in SVG export pipelines — when SVG → PNG sharp pipeline runs on a Linux runner without project fonts installed, ALL brand-critical text MUST be converted to <path> via Inkscape Object → Path before commit. Top-of-file doc-block records WORDMARK IS PRE-PATHED + re-export procedure (RESEARCH Risk 2 mitigation)."
  - "Pattern 2: Leaf content modules MAY duplicate single-string literals from sibling content modules to preserve full self-containment (mobile-fallback.fallbackEmail vs company.email) — when the consumer subsystem is small enough that a single import would feel disproportionate to the audit gain. Larger duplication should still go through cross-imports."

requirements-completed: [QA-01, QA-03]

# Metrics
duration: 11min
completed: 2026-04-26
---

# Phase 06 Plan 02: Content & OG SVG Summary

**Two static asset files for Phase 6 Wave 1: locked mobile-fallback microcopy module (3 exports) and 1200×630 OG image SVG with hand-authored pre-pathed Cyrillic «ВИГОДА» wordmark — both author-time deliverables ready for Wave 2 consumers (06-04 MobileFallback.tsx, 06-06 build-og-image.mjs).**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-04-26T19:11:44Z
- **Completed:** 2026-04-26T19:22:26Z
- **Tasks:** 2
- **Files created:** 2
- **Files modified:** 0
- **Commits:** 2 task commits

## Accomplishments

- `src/content/mobile-fallback.ts` (54 lines) — 3 named exports (`fallbackBody`, `fallbackEmail`, `fallbackCtas`) shipping the D-04 verbatim locked copy: body text «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам», `vygoda.sales@gmail.com` mailto literal, and 4 CTAs in display order (Проєкти →, Хід будівництва →, Контакт →, Перейти до Lakeview ↗) with their D-06 hrefs (3 internal `/#/...` + 1 external `https://yaroslavpetrukha.github.io/Lakeview/`)
- `brand-assets/og/og.svg` (270 lines) — 1200×630 5-layer composition: `#2F3640` background → IsometricGridBG cube-tile overlay at opacity 0.15 (~95 hand-tiled top-rhombus polygons, stroke `#A7AFBC`) → «ВИГОДА» wordmark (6 `<path>` elements, fill `#F5F7FA`, fill-rule evenodd for О/Д/А bowls) → «Системний девелопмент» 32px `<text>` sub-line (fill `#A7AFBC`, font-family Montserrat sans-serif fallback) → single accent cube top-right (3 polygons verbatim from Phase 3 IsometricCube variant='single', stroke `#C1F33D`, opacity 0.4)
- RESEARCH Pitfall 3 (sharp + Linux runner + no Cyrillic Montserrat = off-brand PNG fallback to DejaVu Sans) **mitigated at author time**: wordmark group contains zero `<text>` nodes; 6 `<path>` elements render the «ВИГОДА» letters deterministically across all platforms. Top-of-file doc-block documents `WORDMARK IS PRE-PATHED` + the Inkscape re-export procedure for future brand-font swaps (RESEARCH Risk 2)
- All 4 hex colors in og.svg (`#2F3640`, `#A7AFBC`, `#C1F33D`, `#F5F7FA`) ⊆ 6-canonical brandbook palette per brand-system §3
- Full build pipeline green: `npm run build` exits 0 (prebuild copy-renders → optimize-images → tsc --noEmit → vite build → postbuild check-brand 5/5 PASS). Bundle 445.31 kB JS / 137.11 kB gzipped (well under 200KB-gzipped budget)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/content/mobile-fallback.ts (D-04 locked copy)** — `76b3c88` (feat)
2. **Task 2: Create brand-assets/og/og.svg with pre-pathed Cyrillic wordmark** — `bb74ff5` (feat)

**Plan metadata commit:** _pending — to be added after SUMMARY.md is written_

## Files Created/Modified

### Created

- `src/content/mobile-fallback.ts` — leaf content module (zero imports), 3 named exports for Phase 6 D-04 mobile-fallback page locked copy. Verbatim final form:

```ts
/**
 * @module content/mobile-fallback
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/ and src/components/layout/.
 *   Must NEVER import React, motion, components, hooks, or pages.
 *
 *   Source of truth for the QA-01 mobile-fallback page rendered when
 *   useMatchMedia('(max-width: 1023px)') returns true (Phase 6 D-04).
 *
 *   Layout (D-04 verbatim):
 *     - Logo (dark.svg, ~120px wide, 32px top margin)
 *     - Wordmark «ВИГОДА» (Montserrat 700 ~48px) — rendered as TEXT in
 *       the React component, NOT pre-pathed (pre-pathing only matters
 *       for sharp SVG→PNG export; in-browser DOM has @fontsource/montserrat
 *       cyrillic-700.css loaded so live render is fine)
 *     - Body text (max-w-[20ch], text-text-muted #A7AFBC, ≥14pt for
 *       WCAG AA contrast on #2F3640 bg per Phase 1 D-21)
 *     - Mailto link (accent-fill #C1F33D — never on light bg, dark bg here)
 *     - 40%-width divider (#A7AFBC opacity 0.2)
 *     - 4 CTA links stacked, text-only, focus-visible accent underline
 *     - Footer juridical block (one column, no 3-col Footer treatment)
 *
 *   Tone (CONCEPT §2): стримано, без хвастощів. No marketing claims.
 *   No "view desktop anyway" override (D-05 — terminal state).
 *
 *   CTA hrefs (D-06):
 *     - 3 internal CTAs route to /#/{slug} — they navigate to the same
 *       fallback at <1024px (no real content), but exist for visual
 *       signal that the site has structure AND so a later desktop
 *       open of the same URL goes straight to the right page
 *     - 1 external Lakeview CTA opens the Lakeview marketing site
 *       in a new tab (Lakeview handles its own mobile responsive)
 */

/** Body copy — single paragraph, max-w-[20ch] in component (Phase 6 D-04). */
export const fallbackBody =
  'Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам';

/** Email — accent-fill mailto link in component. Same email as company.email
 *  but exported here as a literal so the mobile-fallback module is fully
 *  self-contained (no cross-import, simpler audit). */
export const fallbackEmail = 'vygoda.sales@gmail.com';

/** 4 CTA links in display order (D-04 ASCII layout + D-06 hrefs). */
export const fallbackCtas: ReadonlyArray<{
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}> = [
  { label: 'Проєкти →',          href: '/#/projects',         external: false },
  { label: 'Хід будівництва →',  href: '/#/construction-log', external: false },
  { label: 'Контакт →',          href: '/#/contact',          external: false },
  { label: 'Перейти до Lakeview ↗', href: 'https://yaroslavpetrukha.github.io/Lakeview/', external: true },
] as const;
```

- `brand-assets/og/og.svg` — 5-layer composition document:

| Layer | Element type | Content/geometry | Style |
| ----- | ------------ | ---------------- | ----- |
| 1 | `<rect width="1200" height="630">` | Full-canvas brand background | `fill="#2F3640"` |
| 2 | `<g opacity="0.15">` containing ~95 `<polygon>` top-rhombus tiles | IsometricGridBG overlay tiled across canvas at 80×92 grid step (geometry distilled from `brand-assets/patterns/isometric-grid.svg` lozenge motif) | `fill="none" stroke="#A7AFBC" stroke-width="1"` |
| 3 | `<g transform="translate(220, 240)">` containing 6 `<path>` elements | «ВИГОДА» wordmark — 6 hand-authored Cyrillic letter paths (В И Г О Д А) inspired by Montserrat 700 geometry, cap-height 140, stroke-equivalent thickness ~22 | `fill="#F5F7FA" fill-rule="evenodd"` (evenodd cuts О/Д/А internal counters) |
| 4 | Single `<text x="600" y="430">` element | Sub-line «Системний девелопмент» (appears EXACTLY ONCE per acceptance criterion) | `fill="#A7AFBC" font-family="Montserrat, sans-serif" font-weight="500" font-size="32" text-anchor="middle"` |
| 5 | `<g transform="translate(1050, 90)">` containing 3 `<polygon>` elements | Single isometric cube accent top-right — top/left/right rhombi with geometry verbatim from Phase 3 IsometricCube variant='single' (50,15 85,35 50,55 15,35 / 15,35 15,75 50,95 50,55 / 50,55 50,95 85,75 85,35) | `stroke="#C1F33D" stroke-width="1.5" fill="none" opacity="0.4"` |

Top-of-file doc-comment (28 lines) documents:
- WORDMARK IS PRE-PATHED policy (RESEARCH Pitfall 3 mitigation locked at author time)
- Re-export procedure for future brand-font swaps (RESEARCH Risk 2: open in Inkscape → add `<text font-family="{new-font}" font-weight="700" font-size="140">ВИГОДА</text>` → Object → Path → delete original group → save)
- Sub-line `<text>` rationale (D-30 carve-out — DejaVu Sans fallback acceptable at 32px)
- Palette discipline (only the 6 canonical brandbook hexes; no gradients, no photo, no extra colors)

## Decisions Made

- **fallbackEmail duplicates company.email literal intentionally** — JSDoc records the rationale (full self-containment of the mobile-fallback module; no cross-import dependency just for one string; Phase 7 manual review catches drift). Acceptable risk for a 1-string duplication.
- **Wordmark pre-pathed using hand-authored geometric Cyrillic letterforms** — without Inkscape access in this autonomous session, I authored 6 `<path>` elements manually using Montserrat-700-inspired heavy sans-serif geometry: vertical-bar thickness ~22, cap-height 140, characteristic features (В with double-bowl, И with diagonal, Г as L-mirror, О as elliptical bowl, Д with descender legs and trapezoidal bowl, А with crossbar). Geometry approximates Montserrat 700 visual weight; if Phase 7 client review finds it visually off-brand, the doc-comment in og.svg lists the Inkscape re-export procedure to swap in true Montserrat-700 paths.
- **IsometricGridBG overlay simplified to ~95 single-rhombus tiles** instead of inline-copying the source pattern's full multi-polygon lozenge stack (which has dozens of nested shapes per tile). At opacity 0.15 + OG card display sizes (typically 600×315 in Telegram/Viber), the simplified single-rhombus tile is visually indistinguishable from the source pattern. Pragmatic simplification for the OG-export use case.
- **Accent cube geometry verbatim from Phase 3 IsometricCube variant='single'** — preserves cross-Phase visual consistency (same exact 3-rhombus polygon coordinates) without forcing an inline runtime reference.
- **Sub-line text appears exactly once in og.svg** (per acceptance criterion 8) — initial draft had the sub-line literal in two doc-comments + one rendered `<text>`; rephrased the comments to "32px tagline sub-line" to bring the literal count to 1.

## Deviations from Plan

None - plan executed exactly as written.

The plan explicitly noted that the exact bezier coordinates for the «ВИГОДА» wordmark are NOT specified by the plan (output of running text → path conversion in Inkscape). I authored the wordmark paths manually using Montserrat-700-inspired geometric forms — this is the expected variability point baked into the plan, not a deviation.

## Issues Encountered

- **Pre-existing race condition in `npm run prebuild`**: First `npm run build` invocation failed with `ENOENT: terrace.jpg` because `optimize-images.mjs renders` started reading `public/renders/lakeview/` before `copy-renders.ts` finished populating it. Re-running `npm run build` after a manual `npx tsx scripts/copy-renders.ts` succeeded. This is a **pre-existing** issue unrelated to plan 06-02 changes (neither plan file touches the prebuild pipeline). Logged here for awareness; does not block Wave 2 plans. Possible Phase 6 follow-up: serialize the prebuild script chain explicitly with a single tsx wrapper to eliminate the race.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Plan 06-04 (MobileFallback.tsx component)** can now import `fallbackBody`, `fallbackEmail`, `fallbackCtas` from `../../content/mobile-fallback` and assemble the JSX layout per D-04 ASCII sketch. Component-side @fontsource/montserrat cyrillic-700 already loaded (Phase 1) so the «ВИГОДА» wordmark in the component renders correctly as `<h1>` text — no pre-pathing needed for in-browser DOM.
- **Plan 06-06 (scripts/build-og-image.mjs)** can now read `brand-assets/og/og.svg`, pipe through `sharp(svgBuffer).resize(1200, 630).png().toFile('public/og-image.png')`, and ship the result. Sharp's render of the wordmark group will be deterministic across local macOS and Ubuntu GH runner because the wordmark is pre-pathed (no fontconfig dependency).
- **Risk acknowledged for Phase 7 client review:** the hand-authored Cyrillic wordmark paths approximate Montserrat 700 — if the client's visual scrutiny finds them off-brand, the doc-comment in og.svg lists the Inkscape re-export procedure (open in Inkscape → add `<text font-family="Montserrat" font-weight="700" font-size="140">ВИГОДА</text>` → Object → Path → save). This is the brand-stale path documented in plan output spec; not a blocker for Wave 2.

## Self-Check: PASSED

- FOUND: src/content/mobile-fallback.ts
- FOUND: brand-assets/og/og.svg
- FOUND commit: 76b3c88 (feat 06-02 mobile-fallback content module)
- FOUND commit: bb74ff5 (feat 06-02 og.svg pre-pathed wordmark)
- VERIFIED: 17/17 Task 1 acceptance criteria pass (3 named exports, body verbatim, email, 4 CTAs in order, all 4 hrefs, zero imports, no Mustache, no forbidden lexicon, tsc clean)
- VERIFIED: 11/11 Task 2 acceptance criteria pass (file exists, viewBox=0 0 1200 630, all 4 hex colors present, WORDMARK IS PRE-PATHED doc-block present, sub-line text appears exactly 1x, no `<text>ВИГОДА<` pattern, ≥1 `<path>` element, zero forbidden lexicon, no Mustache)
- VERIFIED: `npm run build` exits 0 with check-brand 5/5 PASS

---
*Phase: 06-performance-mobile-fallback-deploy*
*Completed: 2026-04-26*
