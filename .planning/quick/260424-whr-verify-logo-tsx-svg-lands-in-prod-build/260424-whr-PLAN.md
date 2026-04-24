---
quick_id: 260424-whr
description: verify Logo.tsx SVG lands in prod build
date: 2026-04-24
mode: quick (diagnostic)
must_haves:
  truths:
    - Phase 1 Logo.tsx uses URL-import `import darkLogoUrl from '../../../brand-assets/logo/dark.svg'` (line 6)
    - brand-assets/ lives outside src/ and public/ — Vite/Rollup behavior with such paths is non-obvious
    - PLAN-AUDIT.md flagged this as R17 blocker-level (MED/HIGH) — verify before Phase 3 planning
  artifacts:
    - dist/assets/*.svg (expected if Rollup bundles the SVG correctly)
    - dist/favicon.svg (from public/favicon.svg — control case)
  key_links:
    - src/components/brand/Logo.tsx:6
    - brand-assets/logo/dark.svg
    - .planning/PLAN-AUDIT.md §A1
    - .planning/PLAN.md §R17
---

# Quick Task 260424-whr: Verify Logo.tsx SVG lands in prod build

**Purpose:** confirm or deny risk R17 (`.planning/PLAN.md`) before Phase 3 begins. If Rollup fails to bundle `brand-assets/logo/dark.svg` via Logo.tsx's URL-import, the deployed site would have a broken logo on every page — blocker-level on a demo URL handoff.

## Task 1 — Diagnostic build-and-inspect

- **files:** none modified
- **action:**
  1. Run `npm run build` (triggers `prebuild` translit + `tsc --noEmit` + `vite build` + `postbuild` check-brand)
  2. `find dist -type f -name "*.svg"` — list all SVG files in prod output
  3. Inspect size + hash pattern — Rollup emits `{name}-{8-char-hash}.{ext}` when URL-import is honored
  4. Cross-check with check-brand invariants (4/4 must pass)
- **verify:**
  - `dist/assets/dark-*.svg` exists (hashed filename pattern) ↦ URL-import WORKS
  - Bundle summary shows `dist/assets/dark-*.svg` line with size > 0 ↦ WORKS
  - File size matches source `brand-assets/logo/dark.svg` within ±5%
  - check-brand PASS 4/4 (no regression from this verification)
- **done:** Decision recorded in SUMMARY.md — «WORKS, no Phase 3 action required» OR «FAIL, Phase 3 first task = move brand-assets/logo/ → public/brand/logo/ + patch Logo.tsx via assetUrl()»

## Expected outcome branches

| Branch | What it means | Next action |
|--------|---------------|-------------|
| **A — WORKS** | Rollup URL-imported SVG into `dist/assets/dark-{hash}.svg`; `<img src={darkLogoUrl}>` in deployed bundle points to correct asset path | R17 downgrade to LOW/MED in PLAN.md; Phase 3 Plan 01 skips first task; proceed to Wordmark decision gate (A3) |
| **B — FAIL** | No SVG in `dist/assets/`, OR SVG orphaned, OR path broken after `base: '/vugoda-website/'` prefix | Phase 3 Plan 01 first task = physically move `brand-assets/logo/*.svg` → `public/brand/logo/*.svg` + update Logo.tsx to `<img src={assetUrl('/brand/logo/dark.svg')}>` + verify re-build |

## Scope boundary

- This task is **read-only** on `src/` — no code changes planned regardless of outcome.
- If FAIL branch: new `/gsd:quick` task invoked (user-triggered) with code changes.
- This task does not rebuild dist/ to a committed state — dist/ is gitignored (Phase 2 `.gitignore`).
