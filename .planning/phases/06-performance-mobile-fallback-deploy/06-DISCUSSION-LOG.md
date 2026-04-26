# Phase 6: Performance, Mobile Fallback, Deploy — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 06-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 06-performance-mobile-fallback-deploy
**Areas discussed:** Mobile fallback, Code-splitting, OG content, OG image source, Lighthouse verification
**Discussion mode:** audit-informed — real measurements driven before decisions (Playwright + sharp output sizing + dist/index.html inspection)

---

## Browser audit (informed every decision below)

Tools: Playwright MCP, npm run build, gzip -c, ls -la on `_opt/` artifacts.

**Confirmed live problems:**
1. `dist/index.html` has zero `og:*` / `twitter:*` / `<link rel="canonical">` / `<meta name="description">` (only `theme-color`, `favicon.svg`)
2. `<title>` does NOT update across routes (verified at /, /projects, /zhk/etno-dim, /construction-log — all show same `«ВИГОДА — Системний девелопмент»`)
3. `aerial-1920.avif` = 388,547 bytes (380 KB; budget says ≤200KB)
4. `aerial-1280.avif` = 200,706 bytes (706 over budget — silently failing since Phase 3 ship)
5. On DPR=1 desktop, BOTH `aerial-1920.avif` (preload) AND `aerial-1280.avif` (actual `<img>`) get fetched — double-load waste
6. JS bundle gzipped = 137,126 bytes / 200KB cap = 67% (within budget; SC#3 letter wants `React.lazy()` though)
7. iPhone 375×667 viewport: wordmark «ВИГОДА» clipped on both sides; nav «Хід будівництва» wraps to 2 lines; layout broken
8. `/zhk/etno-dim` viewport-screenshot looked blank (false alarm — content rendered, but AVIF in-flight, `bg-bg` painted between Nav and content fold)
9. `<RevealOnScroll>` and `<AnimatePresence>` work cleanly; zero console errors any route
10. `/construction-log` shows 3-column grid at ≥1280px instead of Phase 4 D-22's «4-column at ≥1280px» — visual regression, NOT Phase 6 scope (Deferred)

**Existing infrastructure verified intact:**
- `deploy.yml` already shipped (Phase 1 D-15) with `actions/deploy-pages@v4`
- `theme-color`, `favicon.svg`, hero AVIF preload — already in `index.html`
- `<MobileFallback>` does NOT exist (must create)
- `App.tsx` 8 eager imports (no `React.lazy()` anywhere)
- `scripts/check-brand.ts` has 5 active checks (Phase 6 adds 6th and 7th)
- `scripts/optimize-images.mjs` produces `_opt/{name}-{w}.{fmt}` triples at 3 widths

---

## Mobile Fallback (M1)

| Option | Description | Selected |
|--------|-------------|----------|
| Threshold `<1024px` | Matches SC#1 verbatim; clean integer breakpoint | ✓ |
| Threshold `<1280px` | All "non-perfect" desktop viewports get fallback | |
| Threshold `<768px` | Tolerance zone 768-1280 | |

**User's choice:** «всі рекомендовані» → `<1024px`

| Option | Description | Selected |
|--------|-------------|----------|
| JS viewport-check in Layout.tsx | `useMatchMedia` reactive replace `<Outlet>` with `<MobileFallback>`; mobile users never download Outlet's section components | ✓ |
| CSS-only `@media` swap | Whole DOM ships even on mobile; only style-hides | |
| Route-level redirect to `/mobile` | Adds new route; URL pollution | |

**User's choice:** «всі рекомендовані» → JS viewport-check

| Option | Description | Selected |
|--------|-------------|----------|
| No "view desktop anyway" override | Stripped, single-purpose | ✓ |
| Sessionstorage override | Adds escape hatch; demo-pitch user could break their experience | |

**User's choice:** «всі рекомендовані» → No override.

**Notes:** Decision M1 is collectively D-01 through D-07 in 06-CONTEXT.md.
- `/dev/brand` and `/dev/grid` exempt from fallback (QA tooling) — added without prompting; obvious from prior `/dev/*` pattern (Phase 3 D-25).
- Mobile fallback hides Nav + Footer too (single-screen self-contained page) — added without prompting; matches «replace, not augment» semantics.

---

## Code-splitting / `React.lazy()` (M2)

| Option | Description | Selected |
|--------|-------------|----------|
| Blanket route-lazy (all 8 routes) | Strict letter of SC#3; +Suspense boilerplate × 8 | |
| Selective lazy (/construction-log + /dev/brand + /dev/grid) | Splits the heaviest non-flagship + the QA tooling; production hot-path stays eager | ✓ |
| No lazy, document budget rationale | Bundle already 67% of cap | |

**User's choice:** «всі рекомендовані» → Selective lazy (3 routes).

| Option | Description | Selected |
|--------|-------------|----------|
| `<MarkSpinner>` (cube + opacity pulse) | Brand-aligned; reuses `<Mark>` component | ✓ |
| Skeleton cards | More work; not needed for sub-second chunk loads | |
| Blank screen | Fast but looks like bug | |

**User's choice:** «всі рекомендовані» → `<MarkSpinner>`.

**Notes:** D-08 through D-12 in 06-CONTEXT.md. Implementation includes:
- `<MarkSpinner>` is CSS-only `@keyframes` pulse, NOT Motion-library — keeps Suspense fallback chunk thin (genuinely lazy: doesn't drag Motion forward)
- Bundle-budget CI gate added (`bundleBudget()`) as 6th `check-brand.ts` check — auto-fails deploy on overshoot
- Hero-budget CI gate added (`heroBudget()`) as 7th — catches future hero re-shoots over 200KB

---

## OG / Twitter / canonical content (M5)

| Option | Description | Selected |
|--------|-------------|----------|
| `og:title` = «ВИГОДА — Системний девелопмент» (mirrors `<title>`) | One-text, no duplication; root impression | ✓ |
| `og:title` = «ВИГОДА — Львівський забудовник…» (informational) | Weakens brand «системний» tone | |

**User's choice:** «всі рекомендовані» → mirror `<title>`.

| Option | Description | Selected |
|--------|-------------|----------|
| `og:description` = full gasло + «1 у будівництві + 4 pipeline» (~143 ch) | Honest portfolio counts in unfurl; fits OG ~155 limit | ✓ |
| `og:description` = gasло-only (~95 ch) | Too short for unfurl preview value | |

**User's choice:** «всі рекомендовані» → full + counts.

| Pre-locked | Reason |
|------------|--------|
| `twitter:card="summary_large_image"` | QA-03 verbatim |
| `<link rel="canonical">` to root URL | HashRouter forces single canonical |
| `og:url` = `https://yaroslavpetrukha.github.io/vugoda-website/` | Production root; user must confirm GitHub account before deploy (CLIENT-HANDOFF item) |

**Notes:** D-20 through D-26 in 06-CONTEXT.md. Adds full OG protocol set + Twitter Card + apple-touch-icon + favicon-32 PNG.

---

## OG image source (M6)

| Option | Description | Selected |
|--------|-------------|----------|
| Crop `aerial.jpg` to 1200×630 + overlay wordmark | Photo-first; LCP image reused | |
| Hand-author SVG composition (bg + grid + wordmark + cube) | Brand-consistent; not photo-dependent; `scripts/build-og-image.mjs` exports PNG via sharp | ✓ |
| Designer-prepared static PNG commit | No build automation; static binary in git | |

**User's choice:** «всі рекомендовані» → Hand-author SVG.

**Notes:** D-27 through D-30 in 06-CONTEXT.md. Composition: `#2F3640` bg + `<IsometricGridBG>` overlay 0.15 + Montserrat 700 wordmark + Montserrat 500 sub-line + single `<IsometricCube>` accent top-right at `#C1F33D` opacity 0.4. SVG → PNG export at 1200×630 via sharp; idempotent same-mtime skip.

**Font caveat:** sharp's SVG-to-raster does not load custom fonts. Wordmark must be pre-pathed (Inkscape Object→Path) OR the sub-line falls back to system sans-serif. Planner picks at impl based on visual fidelity.

---

## Lighthouse verification (M7)

| Option | Description | Selected |
|--------|-------------|----------|
| Manual + screenshots in `.planning/.../lighthouse/{route}.png` | Simple; risk of regression after fixes | |
| `@lhci/cli` step in deploy.yml | CI-gated; fails build on regression; `.lighthouserc.cjs` config | |
| Both (manual first, then lhci as guard) | Pragmatic; manual finds problems before CI rejects you | ✓ |

**User's choice:** «всі рекомендовані» → Both tiers.

**Notes:** D-31 through D-34 in 06-CONTEXT.md. Tier 1 = developer dev-loop. Tier 2 = post-deploy CI gate using `@lhci/cli@latest` against 5 production URLs in `--incognito` mode (clears Phase 5's hero-skip sessionStorage caveat). Lighthouse audit excludes `/dev/brand` and `/dev/grid`. `@lhci/cli` is a devDependency, no runtime/bundle impact.

---

## Pre-locked decisions (no user choice required)

| Decision | Reason |
|----------|--------|
| HashRouter unchanged | DEP-03 hard-locks; OG meta is necessarily global (one set) |
| `deploy.yml` extended (not rebuilt) | Phase 1 D-15 already verbatim correct |
| Per-route `<title>` via `usePageTitle` hook | One-line `useEffect` pattern; no `react-helmet` library |
| Hero AVIF budget fix: limit preload to `[640w, 1280w]` + tune `aerial-1280` to q=45 | Eliminates DPR=1 double-fetch + lands ≤200KB strict |
| Hero `aerial-1920.avif` retina-only (~380KB unbudgeted carve-out) | Lighthouse Desktop (DPR=1) measures 1280w; 1920w is fallback for retina-2x users |
| Lighthouse caveat: `--incognito` between runs | Phase 5 D-17 hero-skip would mask second-run measurements otherwise |
| `/construction-log` 3-в-ряд instead of 4-в-ряд | Phase 4 D-22 visual regression → Deferred (NOT Phase 6 scope) |

---

## Claude's Discretion (planner picks within brand)

- `<MarkSpinner>` opacity-pulse magnitude tuning (0.4→0.8 vs 0.5→1.0; 1.0s vs 1.2s vs 1.5s)
- OG SVG wordmark pre-path technique (Inkscape Object→Path vs inline `@font-face` with embedded woff2)
- Apple touch icon padding (matches favicon.svg vs tighter crop for iOS rounded mask)
- Mobile fallback typography tuning at 320px / 375px / 414px / 768px
- `useMatchMedia` return shape (boolean vs `[boolean, query]`)
- Lighthouse-CI failure mode (hard-fail vs warn) if flaky on CI Chromium
- Bundle-budget impl (in-process `gzipSync` vs subprocess `gzip -c | wc -c`)
- Order of new `<meta>` tags in `index.html` (semantic groups)
- `usePageTitle` named-export vs default (Phase 1+ pattern is named)
- `<MarkSpinner>` motion: CSS-only `@keyframes` (recommended) vs Motion lib

---

## Deferred Ideas

(Full list in 06-CONTEXT.md `<deferred>` section. Highlights:)

**Pulled from audit (NOT Phase 6 scope):**
- `/construction-log` 3-в-ряд visual regression (Phase 4 D-22 violation; trigger `/gsd:debug` or surface in Phase 7)
- Race condition in parallel local `npm run build` (CI single-run; document as anti-pattern)
- `<title>` flicker during Phase 5 350ms `pageFade` exit (acceptable; document)

**v2 / never:**
- Per-route OG meta (impossible with HashRouter; v2 INFR2-03 BrowserRouter unlocks)
- Custom domain (v2 INFR2-02)
- Service worker / PWA / offline
- Bundle-size visualization tools (rollup-plugin-visualizer)
- OG image variants per locale (UA-only v1)
- Twitter `@handle` (no handle exists)
- `hreflang` alternates (UA-only)
- `manifest.json` / web app manifest
- Web Vitals analytics

---

*Phase: 06-performance-mobile-fallback-deploy*
*Discussion log: 2026-04-26*
