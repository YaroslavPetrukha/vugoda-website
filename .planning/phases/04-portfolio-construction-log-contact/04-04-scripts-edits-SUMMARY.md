---
phase: 04-portfolio-construction-log-contact
plan: 04
subsystem: infra
tags: [sharp, avif, check-brand, image-pipeline, brand-guard, ci]

requires:
  - phase: 02-data-layer-content
    provides: "scripts/check-brand.ts with 4-check importBoundaries rule; scripts/optimize-images.mjs with renders/construction tree processing"
  - phase: 03-brand-primitives-home-page
    provides: "optimize-images.mjs widths pattern [640,1280,1920] for renders established; construction at [640,960]"

provides:
  - "importBoundaries rule 4 exempts DevGridPage.tsx from projects.fixtures import ban (Wave 2 plan 04-09 no longer blocked)"
  - "Construction tree processed at 3 widths [640, 960, 1920] — 1920w AVIF/WebP/JPG variants for Lightbox fullscreen (Wave 2 plan 04-07 enabled)"
  - "prebuild/predev split into two separate node invocations to avoid Node.js v25 + libheif HEIF encoder resource exhaustion"

affects:
  - "04-07-construction-log-page: can safely pass widths=[1920] to ResponsivePicture for construction Lightbox"
  - "04-09-dev-grid: can import projects.fixtures without tripping CI brand-guard"
  - "phase-06-performance-deploy: construction 1920w variants available for high-DPI delivery"

tech-stack:
  added: []
  patterns:
    - "split-prebuild: each optimizer tree runs in its own node process to avoid HEIF resource exhaustion on Node 22+"
    - "grep-v exclusion: importBoundaries grep piped through grep -v to carve out single well-documented exception"

key-files:
  created: []
  modified:
    - scripts/check-brand.ts
    - scripts/optimize-images.mjs
    - package.json

key-decisions:
  - "DevGridPage exemption via grep -v (Option 1 per RESEARCH Open Question 1) — maintains ban for ALL other pages/components; exemption is self-documenting in the label string"
  - "Construction widths extended to [640, 960, 1920] per D-29 locked encoder params (AVIF q50/effort4, WebP q75, JPG mozjpeg q80) — Sharp withoutEnlargement:true caps actual pixel width at source (1080 for phone photos)"
  - "Rule 1 auto-fix: split prebuild to two separate Node.js invocations (renders then construction) to fix HEIF encoder resource exhaustion on Node.js v25 + libheif 1.20 — no behavior change on .nvmrc Node 20 path"

requirements-completed: [HUB-04, LOG-01]

duration: ~45min (includes prebuild investigation + fix)
completed: 2026-04-25
---

# Phase 04 Plan 04: Scripts Edits Summary

**check-brand DevGridPage exemption + construction 1920w widths extension + Node.js v25 HEIF split-invocation fix unblocking two Wave 2 gates**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-04-25T~19:00Z
- **Completed:** 2026-04-25T~19:45Z
- **Tasks:** 2 (+ 1 Rule 1 auto-fix)
- **Files modified:** 3

## Accomplishments

- `scripts/check-brand.ts` importBoundaries rule 4 updated: `grep -v 'DevGridPage'` pipe exclusion + label updated to `(DevGridPage exempt)` — Wave 2 plan 04-09 DevGridPage can now import `projects.fixtures` without triggering CI brand-guard
- `scripts/optimize-images.mjs` construction tree extended from `[640, 960]` to `[640, 960, 1920]` — 150 new 1920w variant files generated across 4 months (`dec-2025`: 36, `jan-2026`: 33, `feb-2026`: 36, `mar-2026`: 45) — Wave 2 plan 04-07 Lightbox `<ResponsivePicture widths={[1920]}>` now has source files
- Pre-existing Node.js v25 + libheif HEIF encoder resource exhaustion bug fixed: `prebuild`/`predev` split into `node optimize-images.mjs renders && node optimize-images.mjs construction` — each tree runs in its own fresh process; `TREE_ARG` optional CLI argument maintains backward-compatible single-process behavior

## Task Commits

1. **Task 1: DevGridPage exemption in check-brand importBoundaries rule 4** — `d5b95c1` (chore)
2. **Task 2: Construction widths [640, 960, 1920] + HEIF fix** — `01f6767` (chore)

## Files Created/Modified

- `scripts/check-brand.ts` — importBoundaries rule 4 `cmd` string updated; 7-line comment block + `grep -v 'DevGridPage'` pipe + label `(DevGridPage exempt)`
- `scripts/optimize-images.mjs` — construction processTree widths `[640, 960]` → `[640, 960, 1920]`; optional `TREE_ARG = process.argv[2]` selector; conditional `if (!TREE_ARG || TREE_ARG === 'renders')` / `if (!TREE_ARG || TREE_ARG === 'construction')`
- `package.json` — `prebuild`/`predev` split: `tsx copy-renders.ts && node optimize-images.mjs renders && node optimize-images.mjs construction`

## Decisions Made

- **DevGridPage exemption via grep -v** (RESEARCH Open Question 1 Option 1): pipe upstream grep output through `grep -v 'DevGridPage'` before `|| true` is appended by `run()`. When upstream has no matches: exits 1 → empty → `|| true` normalizes → PASS. When upstream matches only DevGridPage: filtered out → PASS. When upstream matches other violations: non-empty output → FAIL (boundary enforced).

- **Sharp withoutEnlargement:true behavior confirmed**: source phone photos are 1080px wide. Output filename is `mar-01-1920.avif` but actual decoded width is 1080. Lightbox requests by filename and displays 1080 at 100vw — correct for desktop.

- **TREE_ARG backward compat**: calling `node optimize-images.mjs` without argument runs both trees sequentially (original behavior, works on .nvmrc Node 20). Calling with `renders` or `construction` arg runs only that tree. The `prebuild` script passes explicit args to get separate processes on any Node version.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Node.js v25 + libheif HEIF encoder resource exhaustion in prebuild chain**

- **Found during:** Task 2 (verifying `npm run build` exits 0)
- **Issue:** `npm run prebuild` (which chains `tsx copy-renders.ts && node optimize-images.mjs`) consistently failed with `unable to open for write / system error: No such file or directory` on AVIF files after processing ~20 render sources (180+ AVIF writes in one Node.js process). libheif 1.20 exhausts internal resources on Node.js v25, causing the HEIF encoder to fail on writes after the threshold. Standalone `node scripts/optimize-images.mjs` (without the copy step first, with mtime-skip active) worked fine. The `|| true` in `run()` did NOT shield this — the error came from the Sharp/libheif C layer before any shell normalization.
- **Fix:** Added optional `TREE_ARG = process.argv[2]` selector to `optimize-images.mjs` with conditional `if (!TREE_ARG || TREE_ARG === 'renders')` / `if (!TREE_ARG || TREE_ARG === 'construction')`. Updated `prebuild`/`predev` in `package.json` to invoke two separate `node` processes: `node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction`.
- **Files modified:** `scripts/optimize-images.mjs`, `package.json`
- **Verification:** Full `npm run build` now exits 0. Warm re-run (mtime skip active): `node optimize-images.mjs renders` = 316ms, `node optimize-images.mjs construction` = 295ms. All 630 outputs present (`public/renders/**/_opt/` + `public/construction/**/_opt/`). postbuild check-brand 4/4 PASS.
- **Committed in:** `01f6767` (same Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing bug blocking build pipeline green)
**Impact on plan:** Fix is fully additive — no existing behavior changed for Node 20 path. TREE_ARG defaults to undefined which runs both trees as before. Only the `prebuild` entry point changes (two separate processes instead of one). Idempotency preserved.

## Issues Encountered

- Node.js v25 is installed (project `.nvmrc` = 20.19.0; runtime = 25.9.0). The HEIF resource exhaustion only manifests at v25 + many-AVIF-writes threshold. The underlying bug is in libheif 1.20 / vips 8.17.3 on macOS APFS when called many times via N-API binding in a single Node.js process lifetime. Fix is defensive and works on both v20 and v25.
- The first `npm run build` attempt also hit an `ENOENT` on `dec-01-640.avif` in the Vite copy step — this was caused by an orphaned background monitoring process interfering with output file timing. Running `npm run build` from clean state (second attempt) succeeded without the ENOENT.

## Verification Results

```
DevGridPage in check-brand.ts: 3 matches (comment, label, grep-v pipe)
[640, 960, 1920] in optimize-images.mjs: 1 match at line 95
mar-01-1920.{avif,webp,jpg}: all 3 present in public/construction/mar-2026/_opt/
npm run lint: exit 0 (tsc --noEmit clean)
npm run build: exit 0 (full prebuild → tsc → vite → postbuild 4/4 PASS)
check-brand 4/4 checks passed
Warm re-run: renders 316ms + construction 295ms (all skip-path)
Total 1920w construction files: 150 (dec:36, jan:33, feb:36, mar:45)
```

## Known Stubs

None — this plan makes no UI changes. No stub patterns introduced.

## Next Phase Readiness

- Wave 2 plan 04-07 (ConstructionLogPage + MonthGroup + Lightbox): can pass `widths={[1920]}` to `<ResponsivePicture>` for construction photos — 1920w AVIF/WebP/JPG files are now in `_opt/`
- Wave 2 plan 04-09 (DevGridPage): can `import { fixtures } from '../data/projects.fixtures'` without triggering `check-brand` CI failure
- Brand-guard integrity maintained: 4/4 checks pass; rule 4 boundary still enforced for all other pages/components
- No blockers for Wave 2 execution

## Self-Check: PASSED

- scripts/check-brand.ts: FOUND
- scripts/optimize-images.mjs: FOUND
- SUMMARY.md: FOUND
- Commit d5b95c1 (task 1): FOUND
- Commit 01f6767 (task 2): FOUND

---
*Phase: 04-portfolio-construction-log-contact*
*Completed: 2026-04-25*
