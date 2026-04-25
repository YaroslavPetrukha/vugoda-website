---
phase: 04-portfolio-construction-log-contact
plan: 09
subsystem: dev-tooling
tags: [dev-surface, fixtures, stress-test, routing]
dependency_graph:
  requires: [04-01, 04-03, 04-04, 04-05]
  provides: [dev/grid-route, fixtures-stress-test-surface]
  affects: [App.tsx-route-table]
tech_stack:
  added: []
  patterns: [fixtures-import-boundary-exception, dev-surface-page, eager-import]
key_files:
  created:
    - src/pages/DevGridPage.tsx
  modified:
    - src/App.tsx
decisions:
  - D-39: dev/grid not linked from Nav; direct URL only
  - D-40: chip counts from full fixtures array (honest-counts model)
  - D-41: syntheticFlagship = fixture-06 (flagship-external)
  - D-42: isStage() guards URL state; invalid values fall to null (Усі)
metrics:
  duration: 10min
  completed: 2026-04-25T19:34:39Z
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 4 Plan 09: Dev Grid — Fixtures Stress-Test Surface Summary

**One-liner:** Hidden `/#/dev/grid` route feeding 10 synthetic fixtures into the full /projects component stack (FlagshipCard + StageFilter + PipelineGrid + AggregateRow), with check-brand rule-4 exemption confirmed.

## What Was Built

**Task 1 — `src/pages/DevGridPage.tsx` (NEW)**

Fixtures-driven mirror of `/projects`. Composition:
1. `<FlagshipCard project={syntheticFlagship} />` — fixture-06 (flagship-external, buduetsya)
2. `<StageFilter counts={fixtureCounts} />` — counts from full 10-fixture array
3. `<PipelineGrid projects={fixturesForGrid} active={active} />` — all 10 fixtures passed; PipelineGrid filters internally to full-internal + grid-only variants = 8 grid candidates
4. `{showAggregate && <AggregateRow project={syntheticAggregate} />}` — fixture-01 (aggregate, u-rozrakhunku), conditionally visible

Fixture distribution (D-40 honest counts): u-rozrakhunku=3, u-pogodzhenni=2, buduetsya=2, zdano=3.

URL `?stage=` state driven by `isStage()` from `src/lib/stages.ts` — same validation as ProjectsPage.

**Task 2 — `src/App.tsx` (EDITED)**

Added:
- `import DevGridPage from './pages/DevGridPage'` (eager, after DevBrandPage import)
- `<Route path="dev/grid" element={<DevGridPage />} />` between dev/brand and catch-all
- URL comment block entry `/#/dev/grid`

Route ordering preserved: catch-all `*` stays last. HashRouter, Layout wrapper, all existing routes unchanged.

## Verification Results

| Check | Status |
|-------|--------|
| `npm run lint` (tsc --noEmit) | PASS |
| `npx vite build` (standalone) | PASS — 134.83 kB gzipped |
| `npm run postbuild` check-brand 4/4 | PASS |
| check-brand rule-4 importBoundaries | PASS — fixtures import in DevGridPage NOT flagged (grep -v 'DevGridPage' exclusion fires correctly) |
| File named exactly `DevGridPage.tsx` | PASS |
| syntheticFlagship = fixture-06 (flagship-external) | PASS |
| syntheticAggregate = fixture-01 (aggregate) | PASS |
| counts from full fixtures array | PASS |

Note: `npm run build` (full prebuild chain) fails with sharp image-write contention when parallel agents run simultaneously — pre-existing infra issue unrelated to this plan's changes. Vite build + postbuild both pass independently.

## Deviations from Plan

None. Plan executed exactly as specified.

Wave 1 plan 04-04 DevGridPage exemption confirmed working in production build — check-brand rule 4 passes despite `import { fixtures }` in DevGridPage.tsx.

## Bundle Delta

- Phase 3 baseline: 131.60 kB gzipped
- After this plan: 134.83 kB gzipped
- Delta: +3.23 kB gzipped (fixtures array + DevGridPage component now in reachable graph)

## Known Stubs

None — DevGridPage is intentionally a dev-only QA surface, not a production page. All referenced components (FlagshipCard, StageFilter, PipelineGrid, AggregateRow) are real implementations.

## Manual Smoke Notes (for Phase 7 audit)

Expected behavior at `/#/dev/grid`:
- H1 «Dev · Grid Stress Test» + subtitle visible
- Flagship card for fixture-06 (no render image visible — FlagshipCard guards `renders.length > 0`)
- StageFilter chips: «У розрахунку (3) · У погодженні (2) · Будується (2) · Здано (3)»
- Default state: 8 grid cards (10 fixtures - 1 flagship - 1 aggregate) + aggregate row
- `?stage=zdano` → 3 cards (fixtures-08/09/10), NO EmptyStateZdano (this is intentional stress-test divergence from /projects)
- `?stage=buduetsya` → 1 card (fixture-07), NO BuduetsyaPointer (D-39 explicit)
- `?stage=garbage` → defaults to Усі

Phase 7 D-42 test: cast any fixture's `stage` to `'unknown' as Stage`, visit `/#/dev/grid` — chip would render «—» badge (from stageLabel() fallback).

## Commits

- `85622e4` — feat(04-09): create DevGridPage — fixtures-driven /projects stress-test surface
- `ca4b149` — feat(04-09): register dev/grid route in App.tsx

## Self-Check: PASSED

Files exist:
- `src/pages/DevGridPage.tsx` — FOUND
- `src/App.tsx` (modified) — FOUND

Commits exist:
- `85622e4` — FOUND
- `ca4b149` — FOUND
