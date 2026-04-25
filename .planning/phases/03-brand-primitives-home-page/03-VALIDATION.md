---
phase: 3
slug: brand-primitives-home-page
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-25
approved: 2026-04-25
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Sourced from `03-RESEARCH.md` § Validation Architecture (lines 1141–1202).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — `tsc --noEmit` + grep + manual visual QA at `/dev/brand` (per CLAUDE.md "SKIP Vitest/Playwright for MVP" + Phase 2 STATE pattern) |
| **Config file** | `tsconfig.json` (root, type-only check); `scripts/check-brand.ts` (CI invariants from Phase 2) |
| **Quick run command** | `npm run lint` (≡ `tsc --noEmit`) |
| **Full suite command** | `npm run build` (chains `prebuild` → `tsc --noEmit && vite build` → `postbuild` runs `tsx scripts/check-brand.ts`) |
| **Estimated runtime** | ~2–5s for `lint`; ~30–60s first-run `build` (image optimizer cold), ~5–10s incremental |

**Rationale:** STACK.md (verified 2026-04-24) says SKIP Vitest/Playwright for MVP — a 5-page marketing site with zero business logic has nothing worth unit-testing. Phase 2 PASSED its TDD gate via `npm run lint` + acceptance-criteria grep + a one-shot `npx tsx -e` runtime invariant check (11 invariants). Phase 3 follows the same pattern.

---

## Sampling Rate

- **After every task commit:** `npm run lint` (≈2–5s)
- **After every plan wave:** `npm run build` (full prebuild → tsc → vite build → check-brand) — includes the image optimizer (~30–60s cold, <5s incremental)
- **Before `/gsd:verify-work`:** `npm run build` must be green AND manual visual QA at `/#/dev/brand` shows all primitives AND `/` renders cleanly on 1920×1080 desktop with real data (no `undefined`, no broken images, no console errors)
- **Max feedback latency:** ~5s for type errors; ~60s for full-suite invariants

---

## Per-Task Verification Map

| Req ID | Plan | Wave | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|------|------|----------|-----------|-------------------|-------------|--------|
| HOME-01 | TBD | 4 | Hero renders wordmark + CTA + parallax + gasло | grep + manual visual at `/` | `grep -E "ВИГОДА.*<.*h1\|heroSlogan\|useScroll" src/components/sections/home/Hero.tsx` | ❌ W0 | ⬜ pending |
| HOME-01 (parallax bound) | TBD | 4 | `useTransform` output range bounded `[0, -120]` | grep | `grep -nE "useTransform.*\[0,?\s*-120\]" src/components/sections/home/Hero.tsx` | ❌ W0 | ⬜ pending |
| HOME-01 (no inline transitions) | TBD | 4 | No new `transition={{}}` introduced | grep | `grep -rn "transition={{" src/components/sections/home/ \|\| echo PASS` | ❌ W0 | ⬜ pending |
| HOME-02 | TBD | 4 | BrandEssence imports `brandValues` (no inline copy) | grep | `grep -nE "from.*content/values" src/components/sections/home/BrandEssence.tsx` (POSITIVE) ; `grep -nE "Системність\|Доцільність\|Надійність\|Довгострокова" src/components/sections/home/BrandEssence.tsx` (NEGATIVE — no inline) | ❌ W0 | ⬜ pending |
| HOME-03 | TBD | 4 | PortfolioOverview imports flagship/pipeline/aggregate, uses `<ResponsivePicture>` | grep | `grep -nE "from.*data/projects" src/components/sections/home/PortfolioOverview.tsx ; grep -nE "<ResponsivePicture" src/components/sections/home/PortfolioOverview.tsx` | ❌ W0 | ⬜ pending |
| HOME-03 (no hardcoded /renders/) | TBD | 4 | `check-brand.ts importBoundaries()` passes after Phase 3 lands | invariant | `tsx scripts/check-brand.ts` exit 0 with `[check-brand] PASS importBoundaries` | ✅ Phase 2 | ⬜ pending |
| HOME-04 | TBD | 4 | ConstructionTeaser renders 3–5 photos from `latestMonth().teaserPhotos` + CTA → `/construction-log` | grep | `grep -nE "latestMonth\(\)\.teaserPhotos\|teaserPhotos" src/components/sections/home/ConstructionTeaser.tsx ; grep -nE 'to="/construction-log"' src/components/sections/home/ConstructionTeaser.tsx` | ❌ W0 | ⬜ pending |
| HOME-05 | TBD | 4 | MethodologyTeaser renders 2–3 blocks; ⚠ marker if `needsVerification: true` | grep + visual | `grep -nE "methodologyBlocks\|needsVerification" src/components/sections/home/MethodologyTeaser.tsx` + manual visual | ❌ W0 | ⬜ pending |
| HOME-06 | TBD | 4 | TrustBlock renders ЄДРПОУ + ліцензія + email from `company.ts`; NO team photos | grep | `grep -nE "edrpou\|licenseDate\|email" src/components/sections/home/TrustBlock.tsx ; grep -nE "<img.*team\|керівник\|команда" src/components/sections/home/TrustBlock.tsx \|\| echo PASS` | ❌ W0 | ⬜ pending |
| HOME-07 | TBD | 4 | ContactForm renders single `mailto:` button (NO `<input>`/`<form>`/`<textarea>`) | grep | `grep -nE "mailto:vygoda.sales@gmail.com" src/components/sections/home/ContactForm.tsx ; grep -nE "<input\|<form\|<textarea" src/components/sections/home/ContactForm.tsx \|\| echo PASS` | ❌ W0 | ⬜ pending |
| VIS-03 | TBD | 1 | IsometricCube exposes typed `variant` + `stroke` restricted to 3 hexes | grep + lint | `grep -nE "variant: 'single' \\\| 'group' \\\| 'grid'" src/components/brand/IsometricCube.tsx ; grep -nE "stroke\?: '#A7AFBC' \\\| '#F5F7FA' \\\| '#C1F33D'" src/components/brand/IsometricCube.tsx ; npm run lint` | ❌ W0 | ⬜ pending |
| VIS-03 (IsometricGridBG ships) | TBD | 1 | Component file exists and exports IsometricGridBG | file-exists | `test -f src/components/brand/IsometricGridBG.tsx && grep -E "export function IsometricGridBG\|export default" src/components/brand/IsometricGridBG.tsx` | ❌ W0 | ⬜ pending |
| VIS-03 (MinimalCube deleted) | TBD | 1 | The throwaway stub is removed | file-not-exists | `test ! -f src/components/brand/MinimalCube.tsx` | ✅ (currently EXISTS, deleted in Phase 3 commit) | ⬜ pending |
| VIS-04 | TBD | 1 | Logo (Phase 1 inherit) + Mark (new Phase 3) + favicon | grep | `test -f src/components/brand/Logo.tsx && test -f src/components/brand/Mark.tsx ; grep -nE "favicon" index.html` | Logo: ✅ P1; Mark: ❌ W0; favicon: ✅ P1 | ⬜ pending |
| ANI-01 | TBD | 4 | Hero parallax uses Motion `useScroll`+`useTransform`, ease-out, no spring/bounce, max 120px | grep | `grep -nE "useScroll\(.*target.*offset" src/components/sections/home/Hero.tsx ; grep -nE "useTransform.*\[0,?\s*-120\]" src/components/sections/home/Hero.tsx ; grep -nE "type: ?'spring'\|bounce:" src/components/sections/home/Hero.tsx \|\| echo PASS` | ❌ W0 | ⬜ pending |
| ANI-01 (reduced-motion) | TBD | 4 | Hero respects `prefers-reduced-motion` | grep | `grep -nE "useReducedMotion" src/components/sections/home/Hero.tsx` | ❌ W0 | ⬜ pending |
| D-19 image pipeline | TBD | 2 | `scripts/optimize-images.mjs` exists; emits AVIF/WebP/JPG triples | file-exists + spot-check | `test -f scripts/optimize-images.mjs ; ls public/renders/lakeview/_opt/aerial-1920.avif public/renders/lakeview/_opt/aerial-1920.webp public/renders/lakeview/_opt/aerial-1920.jpg` (after `npm run prebuild`) | ❌ W0 | ⬜ pending |
| D-21 ResponsivePicture | TBD | 2 | `<ResponsivePicture>` emits `<picture><source avif><source webp><img>` | grep | `grep -nE 'type="image/avif"\|type="image/webp"' src/components/ui/ResponsivePicture.tsx` | ❌ W0 | ⬜ pending |
| D-18 hero preload | TBD | 4 | `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` in `index.html` | grep | `grep -nE 'rel="preload".*as="image".*aerial-1920\|fetchpriority="high"' index.html` | ❌ W0 | ⬜ pending |
| D-25 /dev/brand | TBD | 5 | Hidden route registered in `src/App.tsx`; DevBrandPage exists | grep + file-exists | `grep -nE 'path="dev/brand"' src/App.tsx ; test -f src/pages/DevBrandPage.tsx` | ❌ W0 | ⬜ pending |
| Phase 2 D-30/D-33 boundaries | TBD | 5 | `check-brand.ts importBoundaries()` PASS after Phase 3 lands | invariant | `tsx scripts/check-brand.ts` exit 0; `[check-brand] PASS importBoundaries` | ✅ P2 | ⬜ pending |
| Phase 2 D-25 silent-displacement | TBD | 5 | No Pictorial/Rubikon leaks in `dist/` after Phase 3 build | invariant | `tsx scripts/check-brand.ts` `[check-brand] PASS denylistTerms` | ✅ P2 | ⬜ pending |
| Phase 2 D-26 palette | TBD | 5 | No non-canonical hex in `src/`; the 6 in IsometricCube literals are whitelisted | invariant | `tsx scripts/check-brand.ts` `[check-brand] PASS paletteWhitelist` | ✅ P2 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Plan column populated by gsd-planner during PLAN.md creation; Wave column matches `## Recommended Order of Operations` in RESEARCH.md.*

---

## Wave 0 Requirements

Files that must be created BEFORE the wave that consumes them. Tracked from RESEARCH.md § Wave 0 Gaps:

- [ ] `scripts/optimize-images.mjs` — sharp encoder (D-19 / D-20). Install `sharp@^0.34.5` first.
- [ ] `src/components/brand/IsometricCube.tsx` — 3-variant primitive (VIS-03 / D-07/08/09).
- [ ] `src/components/brand/IsometricGridBG.tsx` — svgr `?react` wrapper (D-03).
- [ ] `src/components/brand/Mark.tsx` — URL-import wrapper (D-28).
- [ ] **Delete** `src/components/brand/MinimalCube.tsx` (D-12).
- [ ] `src/components/ui/ResponsivePicture.tsx` — picture/source/img helper (D-21).
- [ ] `src/components/sections/home/{Hero,BrandEssence,PortfolioOverview,ConstructionTeaser,MethodologyTeaser,TrustBlock,ContactForm}.tsx` — 7 home-page sections.
- [ ] `src/pages/HomePage.tsx` — REPLACE Phase 1 placeholder, compose 7 sections in order: Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm.
- [ ] `src/pages/DevBrandPage.tsx` — `/dev/brand` QA surface (D-25).
- [ ] `src/App.tsx` — add `<Route path="dev/brand">`.
- [ ] `src/content/home.ts` — home-specific microcopy module (recommended per RESEARCH.md J).
- [ ] `src/vite-env.d.ts` — add `/// <reference types="vite-plugin-svgr/client" />` line.
- [ ] `package.json` — modify `predev` and `prebuild` to chain `optimize-images.mjs`; add `sharp` to devDependencies.
- [ ] `index.html` — add `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` for `aerial-1920.avif` (D-18).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero parallax visually drifts upward as user scrolls, smoothly, ≤120px | HOME-01 / ANI-01 | Animation feel cannot be grep-asserted; cinematic-ness is subjective on 1920×1080 | `npm run dev` → open `http://localhost:5173/#/` → scroll slowly with mouse wheel → confirm grid drifts upward, no bounce, ≤120px max translation, stops cleanly when scroll stops |
| Hero LCP image loads visibly fast (no white flash) | HOME-01 / D-18 | Lighthouse Phase 6 owns metric-based verification; Phase 3 ships only the foundations | DevTools Network → throttle to "Fast 4G" → reload `/` → confirm `aerial-1920.avif` (or webp/jpg) appears in waterfall as `Highest` priority and is requested before any sub-resource of PortfolioOverview |
| `/dev/brand` shows all primitives correctly without palette drift | VIS-03 / VIS-04 / D-25 | Pixel-level visual QA — no automated palette diff tool wired in MVP | `npm run dev` → open `http://localhost:5173/#/dev/brand` → confirm: Logo at nav + hero size; Mark; Wordmark large + small; IsometricCube `single`/`group`/`grid` × 3 strokes (`#A7AFBC`/`#F5F7FA`/`#C1F33D`) × 2 opacity levels; IsometricGridBG @ opacity 0.1 and 0.2; 6-swatch palette table with hex values; Montserrat 400/500/700 ladder at 14/16/20/24/40/56/80/180px |
| Lakeview flagship card looks dominant and aerial.jpg renders crisp | HOME-03 / D-14 | Visual hierarchy + image quality | `npm run dev` → `/` → scroll to PortfolioOverview → confirm flagship card is full-width or near-full-width within `max-w-7xl`, dominant over the 3 pipeline cards below it, aerial.jpg renders without compression artifacts |
| ConstructionTeaser horizontal scroll feels right (snap, momentum, no jank) | HOME-04 | UX feel of native CSS scroll-snap | `/` → scroll to ConstructionTeaser → drag-scroll horizontally → confirm photos snap into place, arrow buttons scroll one slide per click, last slide doesn't allow further-right scroll |
| ContactForm `mailto:` button opens default mail client | HOME-07 / D-29 | Cannot automate without forging a `mailto:` handler | `/` → scroll to ContactForm → click «Ініціювати діалог» → confirm system mail composer opens with `vygoda.sales@gmail.com` as recipient |
| TrustBlock contains NO team photos / faces / portrait imagery | HOME-06 / PROJECT.md hard rule | Ensures silent-displacement spirit; visual scan | `/` → scroll to TrustBlock → confirm only ЄДРПОУ + ліцензія + email facts; no `<img>` of people, no avatar circles, no "наша команда" prose |
| Hero gasло matches verbatim copy from CONCEPT/PROJECT | HOME-01 / D-06 | Cyrillic typo risk | `/` → confirm gasло text reads exactly «Системний девелопмент, у якому цінність є результатом точних рішень.» (no missing punctuation, no swapped letters) |

---

## Validation Sign-Off

- [ ] All tasks have `<acceptance_criteria>` referencing automated `grep`/`test -f` commands or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (the Wave-0/check-brand invariants + per-component grep ensure continuity)
- [ ] Wave 0 covers all MISSING references in the per-task table
- [ ] No watch-mode flags (no `vite --watch` blocks; lint and build complete and exit)
- [ ] Feedback latency < 60s (lint ≈ 5s; build ≈ 60s cold)
- [ ] `nyquist_compliant: true` set in frontmatter once gsd-planner has populated the `Plan` column for every requirement and gsd-plan-checker confirms

**Approval:** approved 2026-04-25 — gsd-plan-checker iteration 2/3 PASSED all 10 dimensions (5 prior blockers + 7 warnings cleanly fixed)
