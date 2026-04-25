---
phase: 04
plan: 03
subsystem: portfolio-components
tags: [extraction, flagship-card, aggregate-row, DRY, HUB-02, HUB-04]
dependency_graph:
  requires: []
  provides:
    - src/components/sections/projects/FlagshipCard.tsx
    - src/components/sections/projects/AggregateRow.tsx
  affects:
    - src/components/sections/home/PortfolioOverview.tsx
    - src/pages/ProjectsPage.tsx (Wave 2 plan 04-05 — will import FlagshipCard)
    - src/pages/DevGridPage.tsx (plan 04-09 — will import both components)
tech_stack:
  added: []
  patterns:
    - Component extraction with preserved JSX shape
    - Renders-length guard for /dev/grid empty-renders fixture safety
    - Conditional externalUrl CTA (avoids broken href on aggregate/fixture variants)
key_files:
  created:
    - src/components/sections/projects/FlagshipCard.tsx
    - src/components/sections/projects/AggregateRow.tsx
  modified:
    - src/components/sections/home/PortfolioOverview.tsx
decisions:
  - D-02 implemented: FlagshipCard reusable across home + /projects + /dev/grid surfaces
  - HUB-02 partial: FlagshipCard ready for /projects (Wave 2 plan 04-05) and /dev/grid (plan 04-09)
  - HUB-04 partial: AggregateRow ready for same surfaces
  - LCP wiring (loading=eager, fetchPriority=high) baked into FlagshipCard — caller cannot accidentally break it
  - renders.length guard prevents broken-image icons on /dev/grid fixture-06 (renders: [])
  - Pipeline grid kept inline in PortfolioOverview — Wave 3 plan 04-10 owns ANI-03 hover there
metrics:
  duration: "~17 minutes"
  completed: "2026-04-25T19:07:03Z"
  tasks: 3
  files: 3
---

# Phase 4 Plan 03: Flagship Extract Summary

**One-liner:** Extracted FlagshipCard + AggregateRow from PortfolioOverview for cross-surface reuse (home + /projects + /dev/grid) with LCP wiring baked in and renders-length guard for empty-renders fixtures.

## What Was Done

3 tasks executed:

1. **Task 1 — Create FlagshipCard.tsx** (`src/components/sections/projects/FlagshipCard.tsx`)
   - Extracts the flagship card JSX from PortfolioOverview lines 58-87
   - Accepts `project: Project` prop
   - Contains `loading="eager"` and `fetchPriority="high"` for LCP on both home and /projects
   - Renders-length guard (`project.renders.length > 0 && <ResponsivePicture .../>`) prevents broken-image icons on /dev/grid fixture-06 (`renders: []`)
   - Conditional external CTA (`project.externalUrl && (...)`) prevents broken href for non-flagship consumers
   - `flagshipExternalCta` imported from `src/content/home` (not duplicated)
   - `target="_blank" rel="noopener"` per D-14 (preserves Referer for cross-property analytics)

2. **Task 2 — Create AggregateRow.tsx** (`src/components/sections/projects/AggregateRow.tsx`)
   - Extracts the aggregate row JSX from PortfolioOverview lines 114-124
   - Accepts `project: Project | undefined` prop; returns null when undefined
   - `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4}>` — locked aggregate-marker values per Phase 3 D-04 brand-primitive immutability
   - Single-line opening tag `<IsometricCube variant="single"` per Phase 3 lesson (grep-verifiable)

3. **Task 3 — Refactor PortfolioOverview.tsx**
   - Adds `import { FlagshipCard }` and `import { AggregateRow }` from `../projects/`
   - Removes `import { IsometricCube }` (now owned by AggregateRow)
   - Removes `flagshipExternalCta` from home imports (now owned by FlagshipCard)
   - Replaces inline flagship JSX with `<FlagshipCard project={flagship} />`
   - Replaces inline aggregate JSX with `<AggregateRow project={aggregate} />`
   - Pipeline grid (the .map over pipelineGridProjects) kept inline — Wave 3 plan 04-10 adds ANI-03 hover there
   - Doc-block updated to reflect the extraction

## Build Verification

- `npm run lint` (`tsc --noEmit`): exit 0 after each task
- `npm run build` (prebuild → tsc → vite build → postbuild check-brand): exit 0
- `[check-brand] 4/4 checks passed`
- Bundle: 421.50 kB JS / **131.61 kB gzipped** (Phase 3 baseline 131.60 kB — delta +0.01 kB, well within ±2 KB tolerance)

## Deviations from Plan

### Parallel Execution Race Condition (environment, not code)

- **Found during:** Task 3 commit
- **Issue:** 4 sibling agents shared the same repo. A sibling agent overwrote `PortfolioOverview.tsx` with its own version after my first write, and other agents' `copy-renders.ts` + `optimize-images.mjs` runs contended on the `public/` directory. The `npm run build` failed multiple times with "unable to open for write" sharp errors during the parallel wave.
- **Resolution:** Re-wrote `PortfolioOverview.tsx` after detecting the overwrite; retried `npm run build` until sibling agents finished their prebuilds. Final build succeeded cleanly.
- **Impact:** None on shipped code — all 3 files are correct. The race condition was an execution-environment artifact, not a code correctness issue.
- **Fix classification:** Not a code deviation — parallelization environment issue.

### No other deviations — plan executed exactly as written.

## Notes for Wave 2 Plan 04-05 (ProjectsPage)

Import both components as:
```tsx
import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
import { AggregateRow } from '../components/sections/projects/AggregateRow';
```

Pass `flagship` from `src/data/projects` as the `project` prop to `FlagshipCard`.
Pass `aggregateProjects[0]` to `AggregateRow` (or `undefined` to hide it on /projects if preferred).

## Notes for Wave 3 Plan 04-10 (ANI-03 Hover Sweep)

Two ANI-03 consumers after this plan:
1. `<article>` in `src/components/sections/projects/FlagshipCard.tsx` (line 31) — the flagship card article element
2. Inline `<article>` inside the `.map` in `src/components/sections/home/PortfolioOverview.tsx` (line 59) — the pipeline grid cards

Plan 04-10 adds the hover triple-effect class string to both.

## Self-Check

- [ ] FlagshipCard.tsx exists: YES
- [ ] AggregateRow.tsx exists: YES
- [ ] PortfolioOverview.tsx modified: YES
- [ ] Commits: 7a798f0 (FlagshipCard), 39c040b (AggregateRow), b80b8a1 (PortfolioOverview refactor)
