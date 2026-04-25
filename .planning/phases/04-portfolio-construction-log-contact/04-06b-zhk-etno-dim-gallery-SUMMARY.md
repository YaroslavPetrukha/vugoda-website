---
phase: 04-portfolio-construction-log-contact
plan: 06b
subsystem: zhk-page
tags: [gallery, lightbox, cta, slug-dispatcher, routing]
dependency_graph:
  requires: [04-01, 04-02, 04-06a]
  provides: [ZhkGallery, ZhkCtaPair, ZhkPage-dispatcher]
  affects: [src/pages/ZhkPage.tsx, src/components/sections/zhk/]
tech_stack:
  added: []
  patterns: [useState-lightbox-state, encodeURIComponent-mailto, Navigate-redirect, inline-NotFoundPage]
key_files:
  created:
    - src/components/sections/zhk/ZhkGallery.tsx
    - src/components/sections/zhk/ZhkCtaPair.tsx
  modified:
    - src/pages/ZhkPage.tsx
decisions:
  - ZhkPage uses findBySlug (gates on full-internal) + explicit REDIRECT_TO_PROJECTS Set for 3 grid-only/aggregate slugs + inline NotFoundPage for unknown slugs (per RESEARCH Pattern 3)
  - Lightbox index state lives inside ZhkGallery (per plan truths) as useState(-1); not lifted to ZhkPage
  - ZhkCtaPair is stateless (no project prop) — reads CTA labels from content/zhk-etno-dim.ts and email from content/company.ts
metrics:
  duration: 13min
  completed_date: "2026-04-25"
  tasks: 2
  files: 3
---

# Phase 4 Plan 06b: ZHK Etno Dim Gallery + Dispatcher Summary

ZhkGallery (8-render 4-col grid with embedded Lightbox state), ZhkCtaPair (primary mailto + disabled Instagram), and full ZhkPage slug dispatcher replacing Phase 1 stub — wires ZHK-01 end-to-end.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ZhkGallery + ZhkCtaPair | 8b05788 | src/components/sections/zhk/ZhkGallery.tsx, src/components/sections/zhk/ZhkCtaPair.tsx |
| 2 | Replace ZhkPage.tsx with slug dispatcher | e170dbe | src/pages/ZhkPage.tsx |

## Decisions Made

- **ZhkGallery owns Lightbox state** — `useState<number>(-1)` inside the gallery component per plan truths (D-16/D-17); not lifted to page level. Single responsibility; page composition stays clean.
- **REDIRECT_TO_PROJECTS Set (hardcoded)** — `new Set(['maietok-vynnykivskyi', 'nterest', 'pipeline-4'])` enumerates the 3 known non-full-internal slugs that exist in projects.ts but have no detail page. Adding a 6th ЖК requires manual edit here (intentional — it's a deliberate listing of known non-template slugs per D-04).
- **Inline NotFoundPage** — unknown slug renders `<NotFoundPage />` inline instead of `<Navigate to="/" />`. User sees real 404 H1 «404 — сторінку не знайдено» per RESEARCH Pattern 3 / Q6.
- **ZhkCtaPair is stateless** — no `project` prop. CTA labels are for etno-dim specifically, defined in `content/zhk-etno-dim.ts`. If other full-internal projects ship in v2, ZhkCtaPair will need a `project` prop — noted as a v2 concern.

## Decisions Implemented (D-IDs)

- **D-13**: /zhk/etno-dim section order: ZhkHero → ZhkFactBlock → ZhkWhatsHappening → ZhkGallery → ZhkCtaPair — DONE
- **D-16**: 8-render gallery, 4-col at lg, 2-col at md — DONE
- **D-17**: Click opens shared Lightbox; keyboard nav (←/→/Esc), body scroll lock, backdrop close — DONE (via shared Lightbox component from 04-02)
- **D-18**: CTA pair: primary mailto with encodeURIComponent subject + secondary disabled Instagram — DONE
- **D-19 (full)**: Slug dispatcher — etno-dim template / lakeview ZhkLakeviewRedirect / 3 slugs → Navigate /projects / unknown → inline NotFoundPage — DONE

## ANI-03 Hover Triple-Effect

Gallery thumb buttons carry the D-31..D-35 hover triple-effect:
- `transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`
- `hover:scale-[1.02]`
- `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]` — `(193,243,61)` is `#C1F33D` decimal; rgba form passes check-brand paletteWhitelist (hex-only grep)
- `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`
- NO `transition-all`; NO `spring`

FlagshipCard + PipelineCard hover deferred to Wave 3 plan 04-10 as planned.

## Build Pipeline Results

- `npm run lint` (tsc --noEmit): exits 0
- `npm run build` (prebuild → tsc → vite build → postbuild check-brand): exits 0
- **check-brand 4/4 PASS**: denylistTerms + paletteWhitelist + placeholderTokens + importBoundaries

## Bundle Delta

- Before: 131.60 kB gzipped (Plan 03-08)
- After: 135.61 kB gzipped
- **Delta: +4.01 kB gzipped** — well within plan estimate (expected +8-15 kB); Lightbox + useState + ZhkPage dispatcher are small; previous plans already imported most dependencies.
- 65.6% of 200 kB-gzipped Phase 6 budget (remaining: 34.4% for Phase 5 motion variants + AnimatePresence).

## Brand Invariants

- Zero quoted-prefix path literals in zhk/ or ZhkPage.tsx
- Zero `transition-all` or `spring` in any new file
- Zero `Pictorial` or `Rubikon` in any new file
- check-brand 4/4 PASS on dist/ and src/

## Hero LCP Risk Note

The gallery uses `43615.jpg.webp` as the first render (render index 0) for ZhkHero. This is also listed as the first `project.renders` entry. The hero explicitly passes `loading="eager" fetchPriority="high"` via ZhkHero. No Phase 4 preload added to `index.html` (that's home flagship only per D-18). Phase 6 should measure LCP on `/#/zhk/etno-dim` with Lighthouse — if LCP regresses, add a dynamic `<link rel="preload">` via useEffect in ZhkHero (RESEARCH §Q3 Option A) or via Vite's preloadLinks plugin.

`43615.jpg.webp-640.avif` = ~20 kB (checked earlier runs: construction files are ~20 kB; renders are similar range). Risk of exceeding 200 kB threshold is low for the 640w variant. Verify with Phase 6.

## App.tsx Regression Check

`/dev/grid` route preserved verbatim in App.tsx — this file was NOT modified. Verified grep: `grep -n "dev/grid\|zhk/:slug" src/App.tsx` shows both routes intact at lines 37+41.

## Deviations from Plan

### Intermittent Build Failure (Pre-existing, NOT caused by this plan)

**Found during:** Task 2 verification (first `npm run build` attempt)

**Issue:** Concurrent `npm run build` invocations racing on the same `_opt/*.avif` output files caused `sharp` to fail with "unable to open for write" on `dec-09-640.avif`. Only reproducible when two build processes run simultaneously.

**Root cause:** Pre-existing — the mtime-based idempotency check in `scripts/optimize-images.mjs` doesn't protect against concurrent runs. Two background build processes were in flight simultaneously.

**Resolution:** Ran builds sequentially; third run passes cleanly. Successive single-invocation builds produce `npm run build` exit 0 consistently.

**NOT a regression from this plan** — no script or config changes were made.

**Deferred to:** This is a development-machine-only issue (CI runs are sequential). Logged for Phase 6 if CI ever moves to parallel-job pattern.

## Manual Smoke (VALIDATION.md §Manual-Only Verifications)

Manual smoke deferred to integrator — automated verification confirms all dispatch logic, import boundaries, and brand invariants pass.

Expected results:
- `/#/zhk/etno-dim` → 5 sections render in order: hero (eager, full-width) → fact block (stage/location/address) → whatsHappening paragraph → 8-thumb 4-col grid → CTA pair
- Click any thumb → Lightbox opens; ←/→ cycles; Esc closes; backdrop click closes; body scroll locks while open
- `/#/zhk/lakeview` → branded 1-frame placeholder → browser navigates to https://yaroslavpetrukha.github.io/Lakeview/
- `/#/zhk/maietok-vynnykivskyi` / `/#/zhk/nterest` / `/#/zhk/pipeline-4` → redirect to /projects (no flicker)
- `/#/zhk/garbage-slug` → 404 H1 «404 — сторінку не знайдено» visible
- `/#/dev/grid` → DevGridPage renders (Wave 2a regression check)

## Known Stubs

None — all components use live data from `data/projects.ts` and `content/zhk-etno-dim.ts`. ZhkCtaPair's Instagram link uses `socials.instagram = '#'` placeholder — this is intentional per CTC-01 scope (real URL deferred to Phase 6 / client sign-off), not a ZHK-01 stub.

## Self-Check: PASSED
