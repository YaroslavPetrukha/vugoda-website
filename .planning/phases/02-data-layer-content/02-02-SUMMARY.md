---
phase: 02-data-layer-content
plan: 02
subsystem: data

tags: [typescript, data, projects, fixtures, discriminated-union]

# Dependency graph
requires:
  - phase: 02-data-layer-content
    provides: [Project, Stage, Presentation types from 02-01]
provides:
  - projects (5-record canonical portfolio array)
  - flagship (Lakeview Project, non-null derived view)
  - pipelineGridProjects (sorted Project[] for hub 3-in-row grid)
  - aggregateProjects (Project[] for AggregateRow)
  - detailPageProjects (Project[] with /zhk/{slug} pages)
  - findBySlug (slug → Project | undefined, presentation-gated)
  - fixtures (10 synthetic Project[] for /dev/grid scale-to-N proof)
affects: [03-brand-home, 04-portfolio-zhk-log-contact, 06-performance-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "discriminated-presentation-union (D-01): four-variant union drives routing and rendering"
    - "derived-views-from-single-array: consumers never filter projects[] directly"
    - "filesystem-authoritative-over-spec: lakeview renders use verified .jpg list, not ARCHITECTURE .webp"
    - "catch-all-route-gate (D-04): findBySlug returns only full-internal records"
    - "Fixture ЖК #N naming convention: obvious synthetic-vs-real distinction"
    - "fixture-NN ASCII slug convention: cannot shadow real Cyrillic-translit slugs"

key-files:
  created:
    - src/data/projects.ts
    - src/data/projects.fixtures.ts
  modified: []

key-decisions:
  - "Kept EXACT content block from plan <action> despite plan's own grep acceptance criterion (line 296) expecting 2 occurrences of `presentation === 'full-internal'` when the code has 3 (pipelineGridProjects filter line + detailPageProjects filter + findBySlug). The acceptance grep was an off-by-one in the plan spec; functional code is correct — verified via runtime check (findBySlug gates properly, detailPageProjects.length === 1, pipelineGridProjects includes etno-dim)."
  - "Grep criterion `grep -c 'Fixture ЖК #'` returns 11, not 10, because doc-block self-references the «Fixture ЖК #N» naming convention. All 10 fixture records carry the prefix; the +1 is the convention documentation. No behavioral issue."
  - "Pipeline-4 title hardcoded as «Без назви» with inline `placeholder per placeholders.ts#pipeline4Title` comment per RESEARCH §Open Questions Q1 — avoids cross-module import in the data layer while keeping the audit surface discoverable."
  - "Fixtures live in a stand-alone module (no import from projects.ts) — they are QA-only and must remain decoupled so production data bugs cannot leak into the /dev/grid stress surface."

patterns-established:
  - "IMPORT BOUNDARY doc-blocks (D-34): both files declare forbidden consumers + scale-to-N intent upfront; enforcement grep is a Plan 02-05 responsibility"
  - "Single-array-plus-derived-views: `projects` is the raw source; `flagship`/`pipelineGridProjects`/`aggregateProjects`/`detailPageProjects`/`findBySlug` are the public read surface"

requirements-completed:
  - CON-02
  - ZHK-02

# Metrics
duration: 3min
completed: 2026-04-24
---

# Phase 02 Plan 02: Projects + Fixtures Summary

**5 canonical ЖК records (lakeview / etno-dim / maietok / nterest / pipeline-4) with 5 discriminated-union-driven derived views, plus 10 synthetic `Fixture ЖК #N` records proving the portfolio layer scales to N without code changes.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-24T19:10:43Z
- **Completed:** 2026-04-24T19:13:07Z
- **Tasks:** 2
- **Files modified:** 0 (2 created)

## Accomplishments

- `src/data/projects.ts`: 5-record canonical array (order 1..5) + 5 derived views covering every UI consumption pattern; `findBySlug` gates on `presentation === 'full-internal'` per D-04 catch-all anti-pattern protection.
- Lakeview renders now use the 7 verified `.jpg` filenames from `/renders/likeview/` (filesystem truth), NOT the `.webp` list in ARCHITECTURE Q2 — the RESEARCH skeptic-pass caught this before it shipped.
- Pipeline-4 `aggregateText` is verbatim from CONTEXT D-06: «+1 об'єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.»
- `src/data/projects.fixtures.ts`: 10 synthetic records covering all 4 Stage buckets (u-rozrakhunku × 3, u-pogodzhenni × 2, buduetsya × 2, zdano × 3) and all 4 Presentation variants (flagship-external × 1, full-internal × 2, grid-only × 6, aggregate × 1) — ZHK-02 scale-to-N signal per D-08.
- Both modules type-check as `Project[]` (`npm run lint` exits 0); zero React / motion / component / hook imports; IMPORT BOUNDARY doc-block on each file (D-34).

## Task Commits

Each task was committed atomically:

1. **Task 1: projects.ts (5 canonical records + derived views)** — `1571290` (feat)
2. **Task 2: projects.fixtures.ts (10 synthetic records)** — `f527073` (feat)

_TDD note: plan marked tasks as `tdd="true"`, but STACK.md explicitly skips Vitest for MVP. The TDD gate here is the `npm run lint` (`tsc --noEmit`) type-check plus the acceptance-criteria grep battery plus a one-shot runtime invariant check via `npx tsx -e`. All 11 runtime invariants passed (projects.length, flagship.slug, derived-view cardinalities, findBySlug gate behavior, sort order). This matches the plan's `<verify><automated>npm run lint</automated></verify>` stanza._

## Files Created/Modified

- `src/data/projects.ts` — 5 canonical ЖК records + flagship / pipelineGridProjects / aggregateProjects / detailPageProjects / findBySlug derived views
- `src/data/projects.fixtures.ts` — 10 synthetic ЖК records for the Phase 4 `/dev/grid` layout stress test

## Decisions Made

- **Verbatim plan content, correct runtime semantics:** Two of the plan's acceptance-criteria greps had benign off-by-one mismatches vs the EXACT code block the plan specified. I used the specified code (it's functionally correct and verified via runtime check) rather than rewriting it to fit a wrong grep. Documented below as advisory finds, not deviations.
- **Pipeline-4 title stays hardcoded** in projects.ts with a pointer comment to `placeholders.ts#pipeline4Title`. Avoids a cross-module import in the data layer while keeping the «Без назви» audit surface discoverable when Plan 02-04 creates `placeholders.ts`.
- **Fixtures are stand-alone** (no import from `./projects`). Fixtures are QA-only; decoupling guarantees production data bugs cannot leak into `/dev/grid`, and vice versa.

## Deviations from Plan

None - plan executed exactly as written.

**Advisory notes** (acceptance-criteria grep false positives — NOT deviations):

1. Plan line 296: `grep -c "presentation === 'full-internal'"` expected `2`; actual is `3`. The third occurrence is `pipelineGridProjects` filter (`p.presentation === 'full-internal' || p.presentation === 'grid-only'`) — present in the plan's EXACT `<action>` code block. Runtime invariants confirm correct behavior (detailPageProjects.length === 1, findBySlug gates properly).
2. Plan line 490: `grep -c "Fixture ЖК #"` expected `10`; actual is `11`. The extra match is the doc-block self-reference «Fixture ЖК #N» describing the naming convention (plan's `<action>` code block includes it). All 10 fixture titles carry the prefix.

Both acceptance greps were written slightly too strict for their own specified code. The code is correct; no fix needed.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/data/projects.ts` ready to be imported by Phase 3 (HomePage hub overview section: HOME-03) and Phase 4 (`/projects` hub: HUB-01/02/03/04; `/zhk/etno-dim` detail: ZHK-01).
- `src/data/projects.fixtures.ts` ready for Phase 4's hidden `/dev/grid` route to render the scale-to-N stress layout (D-08 signal).
- Enforcement of the IMPORT BOUNDARY doc-blocks (pages/+components/ MUST NOT import fixtures) is Plan 02-05's responsibility (`scripts/check-brand.ts` importBoundaries grep).
- No new blockers.

## Self-Check

Verifying claims before proceeding:

**Files:**
- `src/data/projects.ts` — FOUND
- `src/data/projects.fixtures.ts` — FOUND

**Commits:**
- `1571290` (Task 1 projects.ts) — FOUND
- `f527073` (Task 2 projects.fixtures.ts) — FOUND

**Runtime invariants (all PASS via `npx tsx -e` check):**
- projects.length === 5
- flagship.slug === 'lakeview'
- pipelineGridProjects.length === 3 (etno-dim, maietok, nterest sorted by order)
- aggregateProjects.length === 1
- detailPageProjects.length === 1
- findBySlug('lakeview') === undefined (D-04 gate: flagship-external NOT routable)
- findBySlug('etno-dim') !== undefined (full-internal IS routable)
- findBySlug('maietok-vynnykivskyi') === undefined
- findBySlug('pipeline-4') === undefined
- findBySlug('nonexistent') === undefined
- pipelineGridProjects sorted by order ascending

**Lint:** `npm run lint` exits 0.

## Self-Check: PASSED

---
*Phase: 02-data-layer-content*
*Completed: 2026-04-24*
