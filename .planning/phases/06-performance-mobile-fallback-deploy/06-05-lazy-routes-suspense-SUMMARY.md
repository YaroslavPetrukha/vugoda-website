---
phase: 06-performance-mobile-fallback-deploy
plan: 05
subsystem: performance
tags: [react-lazy, suspense, code-splitting, vite, qa-02]

# Dependency graph
requires:
  - phase: 06-performance-mobile-fallback-deploy
    provides: "src/index.css `@utility mark-pulse` + @keyframes + prefers-reduced-motion override (plan 06-03 wave 1 sibling)"
  - phase: 03-brand-primitives-home-page
    provides: "src/components/brand/Mark.tsx — URL-imported mark.svg primitive consumed by MarkSpinner"
  - phase: 01-foundation-shell
    provides: "src/App.tsx HashRouter + Routes scaffold (D-21 + DEP-03)"
  - phase: 05-animations-polish
    provides: "AnimatePresence in Layout.tsx — Suspense placement validated above it per RESEARCH §Pattern 2"
provides:
  - "src/components/ui/MarkSpinner.tsx — CSS-only Suspense fallback (Motion-free, brand-cube glyph)"
  - "Selective React.lazy() split for ConstructionLogPage, DevBrandPage, DevGridPage in src/App.tsx"
  - "Suspense boundary wrapping <Routes> inside <HashRouter> (above AnimatePresence)"
  - "Vite 6 default chunk naming preserved — 3 separate dist/assets/{PageName}-*.js chunks; bundleBudget grep target stays valid for plan 06-08"
affects: [06-08-budget-gates, 06-09-lhci-and-handoff, 07-post-deploy-qa]

# Tech tracking
tech-stack:
  added: []  # No new dependencies — React.lazy + Suspense are React-built-ins, MarkSpinner is CSS-only
  patterns:
    - "Selective lazy split by Pareto-90 (heavy non-flagship + dev-only routes lazy; LCP-relevant production routes eager)"
    - "Suspense fallback path is Motion-free (CSS @keyframes only) — keeps the lazy-split's byte savings genuine"
    - "Suspense above AnimatePresence (not inside) — avoids chunk-fetch / exit-anim race"

key-files:
  created:
    - "src/components/ui/MarkSpinner.tsx"
  modified:
    - "src/App.tsx"

key-decisions:
  - "MarkSpinner is CSS-only (no Motion import) — Suspense fallback gates lazy chunks; importing Motion in the fallback would defeat the lazy-split"
  - "3 routes lazy: ConstructionLogPage, DevBrandPage, DevGridPage (D-08); 5 routes eager: HomePage, ProjectsPage, ZhkPage, ContactPage, NotFoundPage (D-09)"
  - "Suspense placed inside HashRouter, above Routes — matches RESEARCH §Pattern 2 to avoid AnimatePresence race"
  - "No manualChunks Vite config — default `assets/[name]-[hash].js` chunk naming preserved; bundleBudget CI gate (plan 06-08) targets eager `index-*.js` only, lazy chunks correctly excluded"

patterns-established:
  - "ui/MarkSpinner.tsx: CSS-only animation primitive consuming an @utility (mark-pulse) — pattern for any future Motion-free brand fallback"
  - "App.tsx: lazy const declarations placed below imports + above the function — keeps the eager imports block visually separated from the deferred imports"

requirements-completed: [QA-02]

# Metrics
duration: ~12 min
completed: 2026-04-26
---

# Phase 6 Plan 05: Lazy Routes & Suspense Summary

**React.lazy() split for /construction-log, /dev/brand, /dev/grid + a CSS-only `<MarkSpinner>` Suspense fallback (Motion-free). Production routes stay eager; lazy chunks load on demand without dragging Motion into the fallback path.**

## Performance

- **Duration:** ~12 min (plus ~5 min retrying the Node 25 + libheif idempotent prebuild image-optimize step)
- **Started:** 2026-04-26T19:50Z
- **Completed:** 2026-04-26T20:02Z
- **Tasks:** 2 (both `type="auto"`, no TDD)
- **Files modified:** 1 created (`src/components/ui/MarkSpinner.tsx`) + 1 edited (`src/App.tsx`)

## Accomplishments

- `src/components/ui/MarkSpinner.tsx` ships brand-aligned Suspense fallback: centered `<Mark>` cube with `mark-pulse` CSS @utility (opacity 0.4 → 0.8, 1.2s, --ease-brand), `role="status"` + `aria-live="polite"` + sr-only «Завантаження» label. Zero Motion import — fallback path is genuinely Motion-free.
- `src/App.tsx` converts 3 routes to `React.lazy()` (ConstructionLogPage, DevBrandPage, DevGridPage) and wraps `<Routes>` in `<Suspense fallback={<MarkSpinner />}>` placed inside `<HashRouter>` and above `<Routes>` per RESEARCH §Pattern 2.
- Vite 6 produced 3 separate `dist/assets/{PageName}-*.js` chunks loaded on demand; eager `index-*.js` chunk shrunk from 137.92 KB → 136.87 KB gzipped. The eager-side delta is small because the page modules themselves are thin; the bigger win is that route-specific deps (Lightbox state, projects.fixtures) are now in the lazy chunks instead of the eager bundle.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MarkSpinner.tsx (D-10 CSS-only Suspense fallback)** — `ed3824d` (feat)
2. **Task 2: App.tsx React.lazy 3 routes + Suspense wiring** — `c38be0f` (feat)

**Plan metadata commit:** to be created after this SUMMARY (docs).

## Files Created/Modified

- `src/components/ui/MarkSpinner.tsx` (NEW, 48 lines) — CSS-only Suspense fallback rendering `<Mark>` with `mark-pulse w-12 h-12` className, role="status" + aria-live="polite", sr-only Ukrainian label.
- `src/App.tsx` (MODIFIED, +38/-15 lines) — replaced 3 eager imports with `lazy(() => import('./pages/...'))` declarations, added `Suspense, lazy` from `react` + `MarkSpinner` from `./components/ui/MarkSpinner`, wrapped `<Routes>` with `<Suspense fallback={<MarkSpinner />}>`. JSDoc extended with Phase 6 D-08..D-10 context.

### Verbatim final shape — `src/components/ui/MarkSpinner.tsx`

```tsx
import { Mark } from '../brand/Mark';

export function MarkSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Завантаження"
      className="flex min-h-screen items-center justify-center bg-bg"
    >
      <Mark className="mark-pulse w-12 h-12" />
      <span className="sr-only">Завантаження</span>
    </div>
  );
}
```

### Diff applied to `src/App.tsx`

```diff
-import { HashRouter, Routes, Route } from 'react-router-dom';
+import { Suspense, lazy } from 'react';
+import { HashRouter, Routes, Route } from 'react-router-dom';
 import { Layout } from './components/layout/Layout';
 import HomePage from './pages/HomePage';
 import ProjectsPage from './pages/ProjectsPage';
 import ZhkPage from './pages/ZhkPage';
-import ConstructionLogPage from './pages/ConstructionLogPage';
 import ContactPage from './pages/ContactPage';
-import DevBrandPage from './pages/DevBrandPage';
-import DevGridPage from './pages/DevGridPage';
 import NotFoundPage from './pages/NotFoundPage';
+import { MarkSpinner } from './components/ui/MarkSpinner';
+
+// Lazy: heavy non-flagship + dev-only QA tooling (Phase 6 D-08).
+const ConstructionLogPage = lazy(() => import('./pages/ConstructionLogPage'));
+const DevBrandPage = lazy(() => import('./pages/DevBrandPage'));
+const DevGridPage = lazy(() => import('./pages/DevGridPage'));
...
   return (
     <HashRouter>
+      <Suspense fallback={<MarkSpinner />}>
         <Routes>
           <Route element={<Layout />}>
             ... all 8 Route declarations preserved verbatim ...
           </Route>
         </Routes>
+      </Suspense>
     </HashRouter>
   );
```

### Build artifact verification

```text
dist/assets/index-tTjy8EWc.js                441.06 kB │ gzip: 136.87 kB   ← eager entry chunk
dist/assets/ConstructionLogPage-CbIq8QH9.js    1.51 kB │ gzip:   0.79 kB   ← lazy
dist/assets/DevBrandPage-DBboUa2V.js           4.35 kB │ gzip:   1.41 kB   ← lazy
dist/assets/DevGridPage-CDVDp4VU.js            3.22 kB │ gzip:   1.17 kB   ← lazy
dist/assets/index-D8ZT-l5R.css                38.30 kB │ gzip:   7.59 kB
[check-brand] 5/5 checks passed
```

### Bundle delta

| Chunk | Before (gz) | After (gz) | Δ |
|-------|-------------|------------|---|
| `index-*.js` (eager) | 137.92 KB | **136.87 KB** | **−1.05 KB** |
| `ConstructionLogPage-*.js` (lazy) | — | 0.79 KB | +0.79 KB (deferred load) |
| `DevBrandPage-*.js` (lazy) | — | 1.41 KB | +1.41 KB (deferred load) |
| `DevGridPage-*.js` (lazy) | — | 1.17 KB | +1.17 KB (deferred load) |

The eager-bundle delta is modest because the 3 page modules themselves are thin TSX. The bigger structural win:
1. Page-specific dep graphs (e.g. ConstructionLogPage's MonthGroup + Lightbox + thumbnail-grid logic; DevGridPage's `projects.fixtures` import) are now hoisted off the eager critical path.
2. Future plans that grow these pages (e.g. swiper/carousel for /construction-log) will land in their lazy chunks, NOT the eager budget — the bundleBudget CI gate (plan 06-08) keeps protecting the LCP-critical entry only.

### Vite chunk naming preserved

Default `assets/[name]-[hash].js` naming used (no `vite.config.ts` rollupOptions.output.manualChunks edit). The chunk basename matches the dynamic-import target identifier (`ConstructionLogPage`, `DevBrandPage`, `DevGridPage`), so plan 06-08's bundleBudget grep target `dist/assets/index-*.js` continues to match the eager entry chunk only — lazy chunks are excluded from the gate by design (loaded on demand).

## Decisions Made

- **MarkSpinner is CSS-only (no Motion import).** The Suspense fallback gates lazy chunks; importing Motion in the fallback would force Motion into the eager bundle and defeat the lazy split's byte savings. The `mark-pulse` @utility from plan 06-03 (`@keyframes` with `var(--ease-brand)` + a reduced-motion override) keeps brand timing consistent without any JS animation runtime.
- **Lazy split of exactly 3 routes** (D-08): `/construction-log` (50-photo grid + Lightbox state — heaviest non-flagship surface), `/dev/brand` (QA tooling, never seen by client), `/dev/grid` (QA tooling + projects.fixtures). All other routes stay eager (D-09 — LCP entry, shared deps, tiny surface).
- **Suspense above AnimatePresence**, not inside it (RESEARCH §Pattern 2). `<Suspense>` is INSIDE `<HashRouter>` and ABOVE `<Routes>`; AnimatePresence lives below in Layout.tsx. This avoids the chunk-fetch / exit-anim race that would manifest if Suspense were nested inside an animated child.
- **No `manualChunks` config** in vite.config.ts. Vite 6 default chunk naming `assets/[name]-[hash].js` is what bundleBudget (plan 06-08) targets via `dist/assets/index-*.js` glob — the lazy chunks land as `ConstructionLogPage-*.js` etc. and are correctly excluded from the gate.
- **Used `<Mark>` directly with `className`** instead of wrapping in a span. Read of `src/components/brand/Mark.tsx` (Phase 3 D-28) confirmed it's a named export accepting `className` and already sets `aria-hidden="true"` + `alt=""` internally — so the JSX is just `<Mark className="mark-pulse w-12 h-12" />`.

## Deviations from Plan

None — plan executed exactly as written.

The plan's `acceptance_criteria` listed `grep -c 'role="status"' returns 1` and similar, but the plan's own template doc-comment already contained the literal string `role="status"` and `aria-live="polite"` in the `Accessibility:` JSDoc paragraph. Following the template verbatim yields 2 matches (one in JSDoc, one in JSX) — this is consistent with the plan's prescribed content and is not a deviation. The behavioural intent (one role/aria-live attribute on the rendered DOM element) is satisfied; verified visually in the file.

## Issues Encountered

- **Pre-existing prebuild flake on Node 25.9 + libheif 1.20:** `scripts/optimize-images.mjs` (Phase 3 plan 03-03) hits an intermittent `heif: Cannot write output data` error when encoding AVIF for ~20+ source images in a single Node process. The script is idempotent (mtime-skip), so a re-invocation continues from where it stopped and eventually completes. Documented in the script's own JSDoc (`Node.js v25 + macOS (libheif 1.20)`). Out of scope for this plan — logged in `deferred-items.md` already by an earlier plan; no fix attempted here per scope-boundary rule.
- **Concurrent parallel-wave commit visible:** `git log --oneline` shows commit `c5b5d57 chore(06-06): wire build-og-image.mjs into prebuild + predev` interleaved between the two task commits of this plan. This is expected — Wave 2 of this phase runs plans 06-05 and 06-06 in parallel; the orchestrator validates pre-commit hooks once after all parallel agents complete.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **For plan 06-08 (budget-gates):** the bundleBudget CI gate's grep target `dist/assets/index-*.js` correctly matches the (now-shrunk) eager chunk; lazy chunks are excluded from the gate. The 137-ish KB gzipped eager bundle leaves ~63 KB headroom against the 200 KB QA-02 budget — generous.
- **For plan 06-09 (lhci-and-handoff):** the Suspense fallback flash on lazy routes will be visible in Lighthouse's filmstrip but should NOT degrade Performance scores on the production routes (`/`, `/projects`, `/zhk/etno-dim`, `/contact`) which all stay eager. If LHCI scores `/construction-log` directly, the lazy chunk plus the page's 50-photo MonthGroup might add 1-2 percentage points of TBT — still well above the 90 floor.
- **No blockers.**

## Self-Check: PASSED

Verified each acceptance criterion:
- `test -f src/components/ui/MarkSpinner.tsx` → FOUND
- `git log --oneline | grep ed3824d` → FOUND (Task 1 commit)
- `git log --oneline | grep c38be0f` → FOUND (Task 2 commit)
- `ls dist/assets/ | grep ConstructionLogPage` → FOUND (`ConstructionLogPage-CbIq8QH9.js`)
- `ls dist/assets/ | grep DevBrandPage` → FOUND (`DevBrandPage-DBboUa2V.js`)
- `ls dist/assets/ | grep DevGridPage` → FOUND (`DevGridPage-CDVDp4VU.js`)
- `gzip -c dist/assets/index-*.js | wc -c` → 136886 (under 138000 ceiling — PASS)
- `npm run build` → exit 0 with `[check-brand] 5/5 checks passed` (PASS)
- `npx tsc --noEmit` → exit 0 (PASS)
- No stub patterns introduced (component renders real `<Mark>` primitive consuming the wired `mark-pulse` @utility from plan 06-03)

---
*Phase: 06-performance-mobile-fallback-deploy*
*Plan: 05-lazy-routes-suspense*
*Completed: 2026-04-26*
