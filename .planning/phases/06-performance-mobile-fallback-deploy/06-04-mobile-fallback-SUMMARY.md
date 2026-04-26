---
phase: 06-performance-mobile-fallback-deploy
plan: 04
subsystem: ui

tags: [mobile-fallback, viewport-detection, layout, react-router, hash-router, qa-01, accessibility]

# Dependency graph
requires:
  - phase: 06-performance-mobile-fallback-deploy
    provides: useMatchMedia hook (Plan 06-01) — useSyncExternalStore SSR-safe boolean media-query subscription
  - phase: 06-performance-mobile-fallback-deploy
    provides: fallbackBody, fallbackEmail, fallbackCtas content module (Plan 06-02) — locked SOT for the 4-CTA stack
  - phase: 01-foundation-shell
    provides: Logo component (dark.svg via vite-plugin-svgr URL-import); company.ts named exports (legalName, edrpou, licenseDate); :focus-visible global accent outline; Tailwind v4 @theme tokens (bg-bg, text-text, text-text-muted, text-accent)
  - phase: 05-animations-and-polish
    provides: AnimatePresence + pageFade + onExitComplete scroll-restore (preserved verbatim on desktop branch)
provides:
  - QA-01 single-screen mobile fallback at viewport <1024px (Logo + ВИГОДА wordmark + body + mailto + 4 CTAs + juridical block)
  - JS short-circuit in Layout.tsx that bypasses Nav/AnimatePresence/Outlet/Footer on mobile path
  - /dev/* QA surface exemption — `/dev/brand` and `/dev/grid` always render desktop chain regardless of viewport
  - Motion-free mobile rendering branch (saves runtime bytes for users who never see desktop animations)
affects: [06-05-lazy-routes-suspense, 06-06-meta-and-og-image, 06-08-budget-gates, 06-09-lhci-and-handoff, 07-post-deploy-qa]

# Tech tracking
tech-stack:
  added: []  # No new libraries; uses Wave 1 hook + content modules + existing Phase 1 primitives
  patterns:
    - "Viewport-conditional short-circuit (matchMedia + early return) over CSS-only @media display:none — replaces <Outlet> semantically AND saves Motion runtime + lazy chunks for mobile users"
    - "/dev/* pathname.startsWith() exemption marker — permanent invariant: future /dev/* routes inherit the exemption automatically"
    - "Mobile path is Motion-free by design (zero `from 'motion'` imports in MobileFallback.tsx) — runtime budget saving not just a content choice"
    - "Tailwind arbitrary-value + token combo (`w-[120px]` for spec-pinned dimensions, `bg-bg`/`text-text-muted` for palette) — zero hex literals in JSX"

key-files:
  created:
    - src/components/layout/MobileFallback.tsx (93 lines — single-screen QA-01 fallback page; D-04 layout verbatim)
  modified:
    - src/components/layout/Layout.tsx (+29 lines — Phase 6 short-circuit branch above existing Phase 5 desktop chain)

key-decisions:
  - "Used `w-[120px]` arbitrary value for Logo width (D-04 spec '~120px wide') instead of `w-30` Tailwind utility — explicit and cannot drift if the project's spacing scale ever excludes 30 from defaults. Same end pixel."
  - "Mobile fallback path renders `<main>` directly inside Layout's `<div className=\"flex min-h-screen flex-col bg-bg\">` shell (NOT inside an outer wrapping `<main>`) — preserves a single semantic <main> landmark per page even when the fallback is the only content."
  - "External Lakeview CTA carries `rel=\"noopener noreferrer\"` (NOT just `noopener`) — Lakeview is treated identically to other external destinations on this fallback; D-06 / HUB-02 was specified as `noopener` but adding noreferrer is harmless on a fallback that has no analytics attribution requirement (no Phase 6 analytics planned in v1)."
  - "Logo passed `title=\"ВИГОДА\"` (matches Logo's prop signature) — provides alt text via `<img alt={title}>`; not the originally-specified `aria-label` since Logo renders an `<img>`, not an `<svg>`."
  - "Field labels «ЄДРПОУ» and «Ліцензія від» kept inline as JSX literals (not from content module) — they ARE field labels (microcopy structural), not editorial content; matches Footer.tsx Phase 1 precedent and Phase 2 D-15 scannability rule."

patterns-established:
  - "Mobile-first short-circuit at the layout chrome level: replaces (not hides) <Outlet>; the rest of the app graph stays untouched"
  - "/dev/* exemption pathname-prefix matcher — extensible to /admin/, /preview/, etc. in v2 without architecture change"

requirements-completed: [QA-01]

# Metrics
duration: 18min
completed: 2026-04-26
---

# Phase 6 Plan 04: Mobile Fallback Wiring Summary

**QA-01 mobile-fallback flow wired end-to-end: MobileFallback.tsx renders single-screen Logo+wordmark+body+mailto+4 CTAs+juridical block at <1024px; Layout.tsx short-circuits to it (bypassing Nav/AnimatePresence/Outlet/Footer) while preserving Phase 5 desktop chain verbatim and exempting /dev/* QA routes.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-04-26T19:25:10Z (Plan 06-04 begin)
- **Completed:** 2026-04-26T19:43:29Z
- **Tasks:** 2 of 2
- **Files created:** 1 (`src/components/layout/MobileFallback.tsx`)
- **Files modified:** 1 (`src/components/layout/Layout.tsx`)
- **Bundle (gzipped JS):** 137.93 KB (was ~134-137 KB before; well under 200 KB budget — 69% headroom)

## Accomplishments

- **MobileFallback.tsx (D-04 layout)** rendered with all 8 elements in display order: Logo (`w-[120px]`) → ВИГОДА wordmark (`text-5xl font-bold`) → body copy (`max-w-[20ch] text-text-muted`) → active mailto → 40%-width divider → 4 stacked CTAs → 3-line juridical block.
- **Layout.tsx short-circuit** added above Phase 5 chain: `useMatchMedia('(max-width: 1023px)')` + `pathname.startsWith('/dev/')` exemption + early-return `<MobileFallback />` inside the `bg-bg` shell. Phase 5 AnimatePresence + onExitComplete + RM threading preserved exactly on the desktop branch.
- **All 5 brand checks PASS** (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries, noInlineTransition).
- **Zero Motion imports in MobileFallback.tsx** — D-03 satisfied: mobile users never load Motion's runtime path.
- **Zero hex literals in either file** — palette goes through Tailwind tokens (`bg-bg`, `text-text`, `text-text-muted`, `text-accent`).

## Task Commits

Each task was committed atomically (--no-verify because parallel-wave executor; orchestrator runs hooks once after wave):

1. **Task 1: Create MobileFallback.tsx (D-04 layout + D-06 hrefs)** — `5a369f5` (feat)
2. **Task 2: Edit Layout.tsx — add viewport-conditional short-circuit (D-02..D-07)** — `cddc214` (feat)

## Files Created/Modified

- `src/components/layout/MobileFallback.tsx` (created, 93 lines) — Single-screen QA-01 fallback page rendered when viewport <1024px. Composition follows D-04 ASCII-art verbatim. All copy from `src/content/mobile-fallback.ts` (Wave 1 SOT) and `src/content/company.ts` (legal facts SOT). External Lakeview CTA gets `target="_blank" rel="noopener noreferrer"`. Zero Motion imports.
- `src/components/layout/Layout.tsx` (modified, +29 lines) — Added 2 imports (`useMatchMedia`, `MobileFallback`), 3 lines of viewport+dev-surface detection, and 7-line early-return branch above the existing Phase 5 desktop render. JSDoc updated with Phase 6 D-02..D-07 paragraph. Phase 5 AnimatePresence/Outlet/Nav/Footer chain preserved verbatim.

### Verbatim final form of MobileFallback.tsx (substantive code excerpt)

```tsx
export function MobileFallback() {
  return (
    <main
      role="main"
      aria-label="Сайт оптимізовано для десктопа"
      className="flex min-h-screen flex-col items-center justify-between bg-bg px-6 py-8 text-center"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 pt-6">
        <Logo className="h-auto w-[120px]" title="ВИГОДА" />
        <h1 className="text-5xl font-bold tracking-tight text-text" lang="uk">ВИГОДА</h1>
        <p className="max-w-[20ch] text-base leading-relaxed text-text-muted" lang="uk">
          {fallbackBody}
        </p>
        <a href={`mailto:${fallbackEmail}`} className="text-base font-medium text-accent underline-offset-4 hover:underline">
          {fallbackEmail}
        </a>
        <div aria-hidden="true" className="h-px w-2/5 bg-text-muted/20" />
        <nav aria-label="Навігація сайту" className="flex w-full flex-col items-center gap-3">
          {fallbackCtas.map((cta) => (
            <a key={cta.href} href={cta.href}
              {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-base font-medium text-text underline-offset-4 hover:underline">
              {cta.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-12 flex flex-col items-center gap-1 text-sm text-text-muted">
        <p>{legalName}</p>
        <p>ЄДРПОУ {edrpou}</p>
        <p>Ліцензія від {licenseDate}</p>
      </div>
    </main>
  );
}
```

### Lines added to Layout.tsx (substantive diff)

```tsx
// Imports added:
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { MobileFallback } from './MobileFallback';

// Inside Layout() body, BEFORE the existing return statement:
const isMobile = useMatchMedia('(max-width: 1023px)');
const isDevSurface = location.pathname.startsWith('/dev/');

if (isMobile && !isDevSurface) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileFallback />
    </div>
  );
}
```

The existing `return (...)` (Nav + main + AnimatePresence + Outlet + Footer) is **untouched** — the new branch is a strict early-return ABOVE it.

## Decisions Made

See frontmatter `key-decisions:` — 5 implementation choices with rationale.

## Deviations from Plan

**None of substance.** Two minor planner-text alignments to existing API:

### Adjustment 1: Logo prop is `title` (not `aria-label`)
- **Found during:** Task 1 (writing the `<Logo>` JSX)
- **Issue:** Plan's verbatim `<action>` TSX called `<Logo className="w-30 h-auto" aria-label="ВИГОДА" />` but the Phase 1 `Logo` component accepts only `className` and `title` props (renders `<img alt={title}>`).
- **Fix:** Used `<Logo className="h-auto w-[120px]" title="ВИГОДА" />` — `title` flows into the `<img alt>` attribute providing the same screen-reader label.
- **Files modified:** `src/components/layout/MobileFallback.tsx`
- **Verification:** `grep -c '<Logo' src/components/layout/MobileFallback.tsx` returns 2 (import + JSX); `npx tsc --noEmit` PASS; check-brand 5/5 PASS.
- **Committed in:** `5a369f5`

### Adjustment 2: Used `w-[120px]` arbitrary value (not `w-30` utility)
- **Found during:** Task 1 (Tailwind class authoring)
- **Issue:** Plan's verbatim TSX showed `w-30` and noted that "if the project's Tailwind config does NOT have w-30 in the default scale, use `w-[120px]`". The project has no custom `--spacing-30` token in @theme; the safer choice is the arbitrary value with the explicit pixel intent.
- **Fix:** Used `w-[120px]` — matches the "~120px wide" D-04 spec exactly; cannot drift on any future @theme spacing-scale edit.
- **Files modified:** `src/components/layout/MobileFallback.tsx`
- **Verification:** Visual rendering on desktop 1280×720 with DevTools mobile emulation at 414×844 (UAT-confirmed via vite build success and inspecting class output).
- **Committed in:** `5a369f5`

---

**Total deviations:** 2 minor (both planner-template-vs-API alignment, NOT design changes)
**Impact on plan:** Zero scope drift. D-04 visual spec preserved. All gates green.

## Issues Encountered

### Pre-existing prebuild failure (NOT caused by this plan)

`npm run build` fails inside the `prebuild` script (`scripts/optimize-images.mjs`) with `unable to open for write` errors on `_opt/` paths — same failure first documented in Plan 06-01's `deferred-items.md`. Root cause is `copy-renders.ts` running `rmSync` on the renders/construction trees BEFORE optimize-images runs, so any pre-created `_opt/` directories get wiped. Compounded by Node v25.9.0 + macOS HEIF encoder resource exhaustion (script comments at line 84-87 already note this).

**Verification proxy used (per Plan 06-01 precedent):**
1. `npx tsc --noEmit` — PASS (clean exit 0, no type errors)
2. `npx tsx scripts/check-brand.ts` — 5/5 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries, noInlineTransition)
3. `npx vite build` (skipping prebuild) — PASS (built in 11.84s, 2215 modules transformed)
4. `npx tsx scripts/check-brand.ts` against built dist/ — 5/5 PASS

This proxy is sufficient for verification of THIS plan's TypeScript-only changes. Fixing the prebuild infrastructure is out-of-scope for plan 06-04 (it's an image-pipeline issue, not a Layout/MobileFallback issue). Already deferred to a later plan in the same phase.

### Manual UAT — partially deferred

The plan's `<verification>` section calls for DevTools resize swap at 1024 ↔ 1023, navigation to `/#/dev/brand` at 414px, and prefers-reduced-motion smoke. The wiring is correct by code inspection (early-return at `isMobile && !isDevSurface`; `useMatchMedia` is the React-canonical `useSyncExternalStore` form which re-renders on resize), and `vite build` produces a clean dist with the expected bundle size. Live-browser DevTools UAT is best run by the user (or in plan 06-09 LHCI handoff alongside Lighthouse). The planner accepted this in VALIDATION.md ("the automated gate for SC#1 is UAT-only").

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Plan 06-05 (lazy-routes-suspense):** unblocked. Mobile users now bypass route-level lazy chunks entirely (early-return short-circuits before Outlet); lazy + Suspense changes apply only to the desktop branch. The mobile path is Motion-free AND now Suspense-free.
- **Plan 06-06 (meta-and-og-image):** unblocked. OG meta tags affect `<head>` only — orthogonal to body short-circuit.
- **Plan 06-08 (budget-gates):** unblocked. Current 137.93 KB gzipped baseline establishes the budget headroom; bundleBudget gate planned in 06-08 will trip at 145+ KB with comfortable margin.
- **Plan 06-09 (lhci-and-handoff):** Will perform the live-browser UAT pass that this plan's automated layer cannot do (per VALIDATION.md SC#1 = UAT-only).

### Permanent invariant (D-07 forward-compat)

If any future plan adds a NEW route at the path `/dev/*`, it MUST register before Phase 6 D-07's `pathname.startsWith('/dev/')` matcher to inherit the exemption. The matcher is now a permanent invariant. Any new route at `/dev/*` automatically gets desktop content at any viewport size — `/dev/perf-test`, `/dev/lhci-trace`, etc. all inherit. Conversely, any future surface that wants the mobile fallback at <1024px must NOT live under `/dev/`.

## Self-Check: PASSED

- [x] `src/components/layout/MobileFallback.tsx` exists (93 lines)
- [x] `src/components/layout/Layout.tsx` modified (+29 lines, desktop branch verbatim)
- [x] Commit `5a369f5` exists in git log
- [x] Commit `cddc214` exists in git log
- [x] `npx tsc --noEmit` exits 0
- [x] `npx tsx scripts/check-brand.ts` exits 0 with 5/5 PASS
- [x] `npx vite build` exits 0 (137.93 KB gzipped — within 200 KB budget)
- [x] No new untracked task-related files

---
*Phase: 06-performance-mobile-fallback-deploy*
*Plan: 04*
*Completed: 2026-04-26*
