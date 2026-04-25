---
phase: 03-brand-primitives-home-page
plan: 1
subsystem: ui
tags: [react, svg, vite-plugin-svgr, brand-primitives, isometric-cube, typescript-discriminated-union]

requires:
  - phase: 01-foundation-shell
    provides: vite-plugin-svgr config (frozen), MinimalCube stub geometry, Logo URL-import pattern
  - phase: 02-data-layer-content
    provides: scripts/check-brand.ts palette/denylist guard

provides:
  - IsometricGridBG.tsx (svgr ?react wrapper for hero overlay grid)
  - IsometricCube.tsx (3-variant typed primitive: single | group | grid)
  - Mark.tsx (URL-import wrapper for cube-with-petals brand mark)
  - vite-plugin-svgr/client TS reference in src/vite-env.d.ts (?react module type)

affects:
  - 03-04-hero-section (Hero imports IsometricGridBG)
  - 03-05-essence-portfolio (PortfolioOverview imports IsometricCube variant=single for Pipeline-4 marker)
  - 03-08-compose-and-dev-route (DevBrandPage imports Mark + all 3 IsometricCube variants)
  - Phase 04 (pipeline-cards consume IsometricCube variant=group; empty-states consume Mark + variant=grid)

tech-stack:
  added: []
  patterns:
    - "svgr ?react wrapper component (single-instance-per-page contract to avoid duplicate <defs><style>)"
    - "Discriminated-union prop typing for variant + literal-union typing for stroke (compile-time brand-color guard)"
    - "Delegate-with-clamp pattern: variant='grid' delegates to IsometricGridBG with D-03 hero opacity ceiling (Math.min(opacity, 0.2))"
    - "URL-import for binary-asset SVGs (Mark mirrors Logo.tsx D-27 pattern)"

key-files:
  created:
    - src/components/brand/IsometricGridBG.tsx
    - src/components/brand/IsometricCube.tsx
    - src/components/brand/Mark.tsx
  modified:
    - src/vite-env.d.ts (added vite-plugin-svgr/client triple-slash reference)
  deleted:
    - src/components/brand/MinimalCube.tsx (geometry preserved verbatim in IsometricCube variant=single)

key-decisions:
  - "AllowedStroke type alias used for 3-hex stroke literal union (AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D') instead of inlining the union on the prop. Per plan <action> verbatim. TypeScript constraint identical to inline form; alias improves readability and is reused if more components need the same constraint."
  - "D-03 hero opacity ceiling enforced AT the IsometricCube boundary (when variant='grid'): undefined → 0.15, explicit → Math.min(opacity, 0.2). Prevents accidental <IsometricCube variant='grid' /> from washing the hero in 30% accent-overlay (caller passing the global default opacity=0.3)."
  - "Grid variant DELEGATES to IsometricGridBG (D-09 wrapper option) — single source of truth for grid geometry, no duplicate <defs><style> blocks if multiple variant=grid instances ever land on the same page."
  - "Mark uses URL-import (not ?react) per D-28, mirroring Logo.tsx D-27. Quick-task 260424-whr verified URL-import bundles SVG as static dist/assets/*.svg asset; svgr ?react would inline the markup which is wrong for binary brand assets."
  - "MinimalCube deleted in same commit as IsometricCube introduction (D-12). Pre-deletion grep confirmed zero call sites in src/ — clean delete with no consumer touch."

patterns-established:
  - "svgr ?react wrapper: import as default React component, render with width/height='100%' + preserveAspectRatio, expose only opacity + className via props"
  - "Brand primitive aria-hidden='true' + focusable='false' on every decorative SVG (WCAG floor)"
  - "Phase 3 brand primitives ship NO inline transition={{}} props — Phase 5 owns motion config; primitives are purely structural"

requirements-completed: [VIS-03, VIS-04]

duration: 3m 9s
completed: 2026-04-25
---

# Phase 3 Plan 1: Brand Primitives Summary

**Three brand-locked atoms shipped — IsometricGridBG (svgr-wrapped hero grid), IsometricCube (3-variant typed primitive with D-03 opacity clamp), Mark (URL-imported cube-with-petals). MinimalCube retired; geometry preserved verbatim in IsometricCube variant=single. svgr ?react TypeScript module type now resolves project-wide.**

## Performance

- **Duration:** 3m 9s
- **Started:** 2026-04-25T02:13:33Z
- **Completed:** 2026-04-25T02:16:42Z
- **Tasks:** 4 (all `type="auto"`, no checkpoints)
- **Files created:** 3 TSX components + 1 SUMMARY
- **Files modified:** 1 (src/vite-env.d.ts)
- **Files deleted:** 1 (src/components/brand/MinimalCube.tsx)

## Accomplishments

- **IsometricGridBG** ships with default opacity 0.15 (mid of brandbook §5 0.05–0.60 range, D-03 0.10–0.20 hero band) — imports `brand-assets/patterns/isometric-grid.svg?react` via the frozen vite-plugin-svgr config; aria-hidden wrapper, no inline transition (Phase 5 owns motion).
- **IsometricCube** exposes typed `variant: 'single' | 'group' | 'grid'` discriminated union and typed `stroke?: AllowedStroke` (literal union of 3 brand hexes). Compile-time TypeScript guard catches `<IsometricCube stroke="#FF0000" />` BEFORE the runtime `check-brand` palette grep would have a chance to fail the build. Grid variant delegates to IsometricGridBG with D-03 ceiling: `undefined → 0.15`, `explicit → Math.min(opacity, 0.2)`.
- **`single` variant geometry preserved verbatim** from Phase 1 MinimalCube (3 polygons, viewBox `0 0 100 100`) — no visual shift between phases when consumers swap component name.
- **`group` variant** adds 6-polygon side-by-side cubes (viewBox `0 0 220 100`, shared vertical edge at x=85 per brandbook page-20 «Структурна група»).
- **Mark** URL-imports `brand-assets/mark/mark.svg` (no `?react`), mirroring Logo.tsx D-27 pattern verified by quick-task 260424-whr. Decorative `<img alt="" aria-hidden="true">`.
- **vite-plugin-svgr/client TS reference** added to `src/vite-env.d.ts` (svgr first, vite/client second per svgr README) — `?react` module type now resolves project-wide.
- **MinimalCube.tsx deleted** in the same commit as IsometricCube introduction (D-12); pre-deletion grep confirmed zero call sites in `src/`.

## Task Commits

Each task committed atomically:

1. **Task 1: Add svgr ?react type reference to vite-env.d.ts** — `cc01e3f` (chore)
2. **Task 2: Create IsometricGridBG.tsx (svgr ?react wrapper)** — `9cc8ce3` (feat)
3. **Task 3: Create IsometricCube.tsx (3-variant typed primitive) and DELETE MinimalCube.tsx** — `3d6673d` (feat)
4. **Task 4: Create Mark.tsx (URL-import wrapper for mark.svg)** — `8288985` (feat)

**Plan metadata commit:** pending (will include this SUMMARY + STATE/ROADMAP updates)

## Files Created/Modified

- `src/vite-env.d.ts` — added `/// <reference types="vite-plugin-svgr/client" />` (line 1, before vite/client per svgr README)
- `src/components/brand/IsometricGridBG.tsx` — 37 lines, svgr `?react` wrapper, default opacity 0.15
- `src/components/brand/IsometricCube.tsx` — 100 lines, 3-variant typed primitive with D-03 clamp on grid variant
- `src/components/brand/Mark.tsx` — 21 lines, URL-import wrapper for `mark.svg`
- `src/components/brand/MinimalCube.tsx` — DELETED (53 lines retired; geometry preserved in IsometricCube variant=single)

## Decisions Made

See frontmatter `key-decisions` for the 5 substantive decisions. Headline: D-03 hero opacity ceiling is enforced **inside** IsometricCube's grid branch (`Math.min(opacity, 0.2)`), not just by convention at call sites. This makes the contract local to the component — a reviewer reading IsometricCube.tsx alone can see why grid never washes brighter than 20%.

## Deviations from Plan

### Verify-Script Nits (no functional deviation, no auto-fix needed)

**1. Task 3 verify grep mismatch — type alias vs inline literal union (no behavior change)**

- **Found during:** Task 3 verification
- **Issue:** Plan's `<verify>` block searches for `stroke\?: '#A7AFBC' \| '#F5F7FA' \| '#C1F33D'` as an inline literal union on the prop. Plan's own `<action>` block (verbatim TSX) uses a named alias: `type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';` then `stroke?: AllowedStroke`. The grep checks the inline form, but the verbatim code uses the alias form.
- **Resolution:** Followed the plan's verbatim `<action>` (alias form) — TypeScript constraint is identical to the inline form (compile-time literal-union guard); alias is more readable and matches the research §H pattern. The `must_haves.truths` requirement "typed stroke restricted to 3 brand hexes" is satisfied. The literal triple-union appears on line 27 (the alias declaration), grep-able with `grep -nE "'#A7AFBC' \| '#F5F7FA' \| '#C1F33D'" src/components/brand/IsometricCube.tsx`.
- **No code change needed.**

**2. Task 4 verify grep `! grep -nE "\?react"` false-positive on docstring (no behavior change)**

- **Found during:** Task 4 verification
- **Issue:** Plan's `<verify>` block uses `! grep -nE "\?react"` to ensure Mark.tsx contains no `?react` query. The Mark.tsx docstring (line 8) intentionally contrasts URL-import with svgr `?react` for documentation: `"...rather than inlining via svgr's ?react query."` This trips the negated grep.
- **Resolution:** The behavioral contract — *Test 4: NO `?react` query, NO svgr import* — is satisfied. The actual `import` statement on line 13 (`import markUrl from '../../../brand-assets/mark/mark.svg';`) has no `?react`. The `?react` mention in the docstring is doc-only and does not affect bundling. Tighter grep `! grep -nE "^import.*\?react" src/components/brand/Mark.tsx` confirms.
- **No code change needed.**

---

**Total deviations:** 0 functional deviations. 2 verify-script nits (false-positive grep patterns; documented for future plan-author awareness). No Rule 1/2/3 auto-fixes triggered, no Rule 4 architectural pauses.

**Impact on plan:** Plan executed exactly as written per the `<action>` blocks. The two verify-script-vs-action mismatches are documentation-only artifacts of the plan-author's grep patterns lagging the verbatim TSX content.

## Issues Encountered

None during planned work. Build pipeline (lint → check-brand 4/4 → vite build → postbuild check-brand 4/4) green on first run with no retries.

## Verification Results

- ✅ `npm run lint` (tsc --noEmit) exits 0 — svgr `?react` import resolves via Task 1's TS reference
- ✅ `tsx scripts/check-brand.ts` 4/4 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries) — the 3 new stroke hex literals (`#A7AFBC`, `#F5F7FA`, `#C1F33D`) are subset of the 6 canonical brand hexes; no palette violations
- ✅ `npm run build` exits 0 (postbuild check-brand 4/4 PASS) — bundle: 242.85 kB JS / 76.85 kB gzipped, well under the 200KB-gzipped budget
- ✅ `grep -rnE "from '.*MinimalCube'|import.*MinimalCube" src/` returns empty (file deleted, zero call sites)
- ✅ No `transition={{` literal in any of the 3 new TSX files (`grep -nE "transition=\{\{" src/components/brand/{IsometricGridBG,IsometricCube,Mark}.tsx` empty)

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Wave 1 of Phase 3 complete. Wave 2 (03-02 home-microcopy, 03-03 image-pipeline) and Wave 3 home-section consumers can now import:

- `IsometricGridBG` from `@/components/brand/IsometricGridBG` → 03-04 Hero overlay
- `IsometricCube` from `@/components/brand/IsometricCube` → 03-05 PortfolioOverview Pipeline-4 row marker (variant=single)
- `Mark` from `@/components/brand/Mark` → 03-08 DevBrandPage + Phase 4 empty-states

VIS-03 and VIS-04 partially closed (cube primitive geometry + Mark; Logo from Phase 1 inherits VIS-04 navbar surface).

No blockers for next plan (03-02 home-microcopy).

## Self-Check: PASSED

All 3 created files exist on disk:
- ✅ `src/components/brand/IsometricGridBG.tsx`
- ✅ `src/components/brand/IsometricCube.tsx`
- ✅ `src/components/brand/Mark.tsx`

Modified file confirmed:
- ✅ `src/vite-env.d.ts` (2 lines, svgr ref first)

Deleted file confirmed absent:
- ✅ `src/components/brand/MinimalCube.tsx` (deleted)

All 4 task commits exist in git log:
- ✅ `cc01e3f` chore(03-01): add vite-plugin-svgr/client type reference
- ✅ `9cc8ce3` feat(03-01): add IsometricGridBG svgr-wrapped hero overlay
- ✅ `3d6673d` feat(03-01): add IsometricCube 3-variant primitive, delete MinimalCube
- ✅ `8288985` feat(03-01): add Mark URL-import wrapper for mark.svg

---
*Phase: 03-brand-primitives-home-page*
*Plan: 01*
*Completed: 2026-04-25*
