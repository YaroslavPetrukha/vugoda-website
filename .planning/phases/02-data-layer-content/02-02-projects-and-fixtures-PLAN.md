---
phase: 02-data-layer-content
plan: 02
type: execute
wave: 2
depends_on: [02-01]
files_modified:
  - src/data/projects.ts
  - src/data/projects.fixtures.ts
autonomous: true
requirements_addressed:
  - CON-02
  - ZHK-02
must_haves:
  truths:
    - "src/data/projects.ts exports `projects: Project[]` with exactly 5 canonical records: lakeview (order:1), etno-dim (order:2), maietok-vynnykivskyi (order:3), nterest (order:4), pipeline-4 (order:5)"
    - "Exactly one record has `presentation: 'flagship-external'` (lakeview) — derived view `flagship` is non-null"
    - "Exactly one record has `presentation: 'full-internal'` (etno-dim) — satisfies ZHK-02 scalability signal"
    - "Exactly one record has `presentation: 'aggregate'` (pipeline-4) — AggregateRow source"
    - "Two records have `presentation: 'grid-only'` (maietok-vynnykivskyi, nterest) — hub-card-only in v1 per PROJECT.md"
    - "Lakeview renders array lists the 7 actual .jpg files (per RESEARCH filesystem inventory, NOT the .webp filenames ARCHITECTURE Q2 claimed)"
    - "findBySlug() returns only `presentation === 'full-internal'` records; lakeview/maietok-vynnykivskyi/nterest/pipeline-4 slugs return undefined (enforces D-04 / Anti-Pattern 7)"
    - "src/data/projects.fixtures.ts exports `fixtures: Project[]` with 10 synthetic records, at least 2 per Stage bucket, at least one of each Presentation variant — type-checks as Project[] (ZHK-02 scale-to-N signal per D-08)"
  artifacts:
    - path: "src/data/projects.ts"
      provides: "projects array + flagship/pipelineGridProjects/aggregateProjects/detailPageProjects/findBySlug derived views"
      contains: "export const projects"
    - path: "src/data/projects.fixtures.ts"
      provides: "10 synthetic Project[] records for /dev/grid rendering proof in Phase 4"
      contains: "Fixture ЖК #"
  key_links:
    - from: "src/data/projects.ts"
      to: "src/data/types.ts"
      via: "type imports"
      pattern: "from ['\"]\\./types['\"]"
    - from: "src/data/projects.fixtures.ts"
      to: "src/data/types.ts"
      via: "type imports"
      pattern: "from ['\"]\\./types['\"]"
---

<objective>
Author the canonical portfolio data (5 ЖК) and synthetic fixtures (10 ЖК) for scale-to-N verification. After this plan, any Phase 3/4 page component can import from `src/data/projects.ts` and render the full portfolio — FlagshipCard, PipelineGrid, AggregateRow, ZhkPage all have their data surface.

Purpose: Single source of truth for CON-02 (typed projects + fixtures) and ZHK-02 (discriminated presentation union + findBySlug gate). The scale-to-N signal is that `projects.fixtures.ts` type-checks as `Project[]` — Phase 4 renders them in `/dev/grid` for visual proof.
Output: Two TS modules, both with doc-block per D-34; `npm run lint` passes.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-data-layer-content/02-CONTEXT.md
@.planning/phases/02-data-layer-content/02-RESEARCH.md
@.planning/phases/02-data-layer-content/02-01-SUMMARY.md
@.planning/research/ARCHITECTURE.md
@.planning/research/PITFALLS.md
@src/data/types.ts
</context>

<interfaces>
<!-- Types consumed from Plan 02-01 (src/data/types.ts). Use them directly; do not redeclare. -->

```typescript
import type { Project, Stage, Presentation } from './types';
```

- `Project.slug` must match public/renders/{slug}/ folder name after Plan 03's copy-renders runs
- `Project.presentation` drives all routing and rendering — discriminated union
- `Project.order` is numeric 1..N ascending; derived views sort by it
- `Project.renders[]` are filenames relative to public/renders/{slug}/; first is hero/cover

<!-- Verified filesystem truths (from RESEARCH §Filesystem Inventory) -->

Lakeview source folder `/renders/likeview/` contains (7 files, all .jpg):
- aerial.jpg, closeup.jpg, entrance.jpg, hero.jpg, lake-bridge.jpg, semi-aerial.jpg, terrace.jpg

Etno Dim `/renders/ЖК Етно Дім/` (8 files):
- 43615.jpg.webp, 43616.jpg.webp, 43617.jpg.webp, 43618.jpg.webp, 43619.jpg.webp, 43620.jpg.webp, 43621.jpg.webp, 61996.png.webp

Maietok Vynnykivskyi `/renders/ЖК Маєток Винниківський/` (2 files):
- 44463.jpg.webp, 62343.png.webp

NTEREST `/renders/Дохідний дім NTEREST/` (3 files):
- 2213.jpg.webp, 2214.jpg.webp, 60217.png.webp

<!-- ARCHITECTURE.md Q2 listed lakeview as ['aerial.webp', '02.webp', '03.webp'] — WRONG. Use the .jpg filenames above (RESEARCH §Pitfall A). -->
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/data/projects.ts (5 canonical records + derived views)</name>
  <files>src/data/projects.ts</files>
  <read_first>
    - src/data/types.ts (verify Project / Stage / Presentation exports — Plan 02-01 output)
    - .planning/research/ARCHITECTURE.md §3 Q2 (canonical shape + derived views pattern — note lakeview filenames are WRONG there)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Correct projects.ts Data" (correct lakeview .jpg list)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-01 through D-06 (schema, ordering, findBySlug gate, slugs, Pipeline-4 copy)
    - .planning/research/PITFALLS.md §Pitfall 7 (catch-all route anti-pattern — findBySlug must gate on 'full-internal')
    - .planning/PROJECT.md §Портфель table (stage labels in Ukrainian)
  </read_first>
  <behavior>
    - Exported `projects: Project[]` contains exactly 5 elements (array.length === 5)
    - Each record's `order` field is unique and ∈ {1, 2, 3, 4, 5}
    - Lakeview record: slug='lakeview', presentation='flagship-external', externalUrl='https://yaroslavpetrukha.github.io/Lakeview/', renders starts with 'aerial.jpg', order=1
    - Etno Dim record: slug='etno-dim', presentation='full-internal', stage='u-pogodzhenni', stageLabel starts with 'меморандум', order=2, renders has 8 entries, whatsHappening is a non-empty string
    - Maietok record: slug='maietok-vynnykivskyi', presentation='grid-only', stage='u-rozrakhunku', order=3
    - NTEREST record: slug='nterest', presentation='grid-only', stage='u-pogodzhenni', order=4
    - Pipeline-4 record: slug='pipeline-4', presentation='aggregate', stage='u-rozrakhunku', renders=[], aggregateText matches verbatim copy from D-06, order=5
    - Exported derived views: `flagship` (single Project, not array), `pipelineGridProjects` (Project[]), `aggregateProjects` (Project[]), `detailPageProjects` (Project[]), `findBySlug` (function)
    - `findBySlug('lakeview')` returns undefined (lakeview is flagship-external, NOT full-internal — D-04 gate)
    - `findBySlug('etno-dim')` returns the Etno Dim record
    - `findBySlug('maietok-vynnykivskyi')` returns undefined (grid-only)
    - `findBySlug('pipeline-4')` returns undefined (aggregate)
    - `findBySlug('nonexistent')` returns undefined
    - `pipelineGridProjects` sorted by order ascending, includes etno-dim + maietok + nterest (3 items, excludes flagship + aggregate)
    - `aggregateProjects` has exactly 1 element (pipeline-4)
    - `detailPageProjects` has exactly 1 element (etno-dim)
    - File contains `@rule IMPORT BOUNDARY` doc-block per D-34
    - File contains no React/motion/component imports (pure TS data)
    - `npm run lint` passes
  </behavior>
  <action>
Create file `src/data/projects.ts` with this EXACT content. The lakeview `renders` array MUST use the 7 `.jpg` filenames verified in RESEARCH §Filesystem Inventory (NOT the .webp list in ARCHITECTURE §3 Q2 which is wrong — see RESEARCH §Pitfall A).

```typescript
/**
 * @module data/projects
 * @rule IMPORT BOUNDARY: This module may only be imported from src/pages/ and
 *   src/components/sections/. It must NEVER import React, motion, components,
 *   or hooks. Data modules are pure TypeScript. Consumers read from the
 *   derived views (flagship / pipelineGridProjects / aggregateProjects /
 *   detailPageProjects / findBySlug) rather than filtering the raw array.
 *
 *   Adding ЖК #6 = append one record with order: 6 and the right
 *   presentation variant. No other code changes. Per ZHK-02 and CONCEPT §10.6.
 */

import type { Project } from './types';

export const projects: Project[] = [
  {
    // Lakeview — active construction, external redirect flagship (no internal page).
    // Silent displacement hard-rule applies ONLY here (never name Pictorial/Rubikon).
    slug: 'lakeview',
    title: 'ЖК Lakeview',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'flagship-external',
    location: 'Львів',
    externalUrl: 'https://yaroslavpetrukha.github.io/Lakeview/',
    // Verified from filesystem 2026-04-24: /renders/likeview/ has 7 .jpg files.
    // ARCHITECTURE Q2 listed these as .webp — that was wrong. Use the .jpg list.
    renders: [
      'aerial.jpg',
      'closeup.jpg',
      'entrance.jpg',
      'hero.jpg',
      'lake-bridge.jpg',
      'semi-aerial.jpg',
      'terrace.jpg',
    ],
    facts: { deadline: '2027', note: 'Здача у 2027' },
    order: 1,
  },
  {
    // Etno Dim — template-demo ЖК; has the most renders (8) of any pipeline project.
    // «меморандум» stage = useful «system» narrative for Phase 4 /zhk/etno-dim.
    // CONCEPT §11.8 flags вул. Судова as unconfirmed — location stays 'Львів' here;
    // etnoDimAddress em-dash lives in content/placeholders.ts for audit visibility.
    slug: 'etno-dim',
    title: 'ЖК Етно Дім',
    stageLabel: 'меморандум про відновлення будівництва',
    stage: 'u-pogodzhenni',
    presentation: 'full-internal',
    location: 'Львів',
    renders: [
      '43615.jpg.webp',
      '43616.jpg.webp',
      '43617.jpg.webp',
      '43618.jpg.webp',
      '43619.jpg.webp',
      '43620.jpg.webp',
      '43621.jpg.webp',
      '61996.png.webp',
    ],
    whatsHappening:
      'Підписано меморандум про відновлення будівництва. Проводимо аудит наявних конструкцій та юридичне переоформлення прав забудовника.',
    order: 2,
  },
  {
    // Маєток Винниківський — grid-only in v1 (card on hub, no internal page).
    slug: 'maietok-vynnykivskyi',
    title: 'ЖК Маєток Винниківський',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Винники',
    renders: ['44463.jpg.webp', '62343.png.webp'],
    order: 3,
  },
  {
    // Дохідний дім NTEREST — grid-only in v1. Client §11.7: «NTEREST» без «I»
    // confirmed by default; audit surface lives in content/placeholders.ts.
    slug: 'nterest',
    title: 'Дохідний дім NTEREST',
    stageLabel: 'дозвільна документація',
    stage: 'u-pogodzhenni',
    presentation: 'grid-only',
    location: 'Львів',
    renders: ['2213.jpg.webp', '2214.jpg.webp', '60217.png.webp'],
    order: 4,
  },
  {
    // Pipeline-4 — no visuals, aggregate row only. Title defaults to «Без назви»
    // per CONCEPT §11.3 pending client name. aggregateText is verbatim from
    // ARCHITECTURE Q2 / CONCEPT §6.2 — do not paraphrase.
    // placeholder per placeholders.ts#pipeline4Title — update both when client confirms
    slug: 'pipeline-4',
    title: 'Без назви',
    stageLabel: 'прорахунок кошторисної вартості',
    stage: 'u-rozrakhunku',
    presentation: 'aggregate',
    renders: [],
    aggregateText:
      '+1 об’єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.',
    order: 5,
  },
];

// Derived views — every consumer reads from these, not the raw array.
// Adding a sixth ЖК with the right `presentation` automatically flows into
// the correct view via the filter predicate.

/** Single flagship project (Lakeview). Non-null assertion safe because the
 *  invariant «exactly one flagship-external record» is guaranteed by the
 *  discriminated union — lint would break before runtime if violated. */
export const flagship: Project = projects.find(
  (p) => p.presentation === 'flagship-external',
)!;

/** Projects shown in the hub 3-in-a-row grid (pipeline cards). Sorted by order.
 *  Includes both grid-only (hub-card-only) and full-internal (linked to /zhk/{slug}). */
export const pipelineGridProjects: Project[] = projects
  .filter(
    (p) => p.presentation === 'full-internal' || p.presentation === 'grid-only',
  )
  .sort((a, b) => a.order - b.order);

/** Projects surfaced in the AggregateRow (text-only under the grid). */
export const aggregateProjects: Project[] = projects.filter(
  (p) => p.presentation === 'aggregate',
);

/** Projects that get a /zhk/{slug} detail page. */
export const detailPageProjects: Project[] = projects.filter(
  (p) => p.presentation === 'full-internal',
);

/**
 * Find the project for /zhk/{slug} rendering. Only returns records with
 * presentation='full-internal' per D-04 / PITFALLS Anti-Pattern 7. Other
 * slugs (lakeview / maietok / nterest / pipeline-4) return undefined —
 * ZhkPage (Phase 4) handles redirect via <Navigate>.
 */
export const findBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug && p.presentation === 'full-internal');
```

Do NOT import from `../content/placeholders.ts` here. Per RESEARCH §Open Questions Q1, `pipeline4Title` is hardcoded in projects.ts with a comment pointing to the placeholders.ts audit surface; this avoids a cross-module import in the data layer.

Do NOT embed raw file paths like `/renders/ЖК Етно Дім/...` — only filenames; Phase 3/4 uses `renderUrl(slug, file)` from lib/assetUrl.ts.
  </action>
  <acceptance_criteria>
    - `test -f src/data/projects.ts` passes
    - `grep -c "export const projects: Project\\[\\]" src/data/projects.ts` returns `1`
    - `grep -cE "slug: '(lakeview|etno-dim|maietok-vynnykivskyi|nterest|pipeline-4)'" src/data/projects.ts` returns `5`
    - `grep -c "presentation: 'flagship-external'" src/data/projects.ts` returns `1`
    - `grep -c "presentation: 'full-internal'" src/data/projects.ts` returns `1`
    - `grep -c "presentation: 'grid-only'" src/data/projects.ts` returns `2`
    - `grep -c "presentation: 'aggregate'" src/data/projects.ts` returns `1`
    - `grep -c "'aerial.jpg'" src/data/projects.ts` returns `1` (lakeview's first render is .jpg per RESEARCH)
    - `grep -c "'aerial.webp'" src/data/projects.ts` returns `0` (ARCHITECTURE's wrong .webp list must NOT be used)
    - `grep -c "https://yaroslavpetrukha.github.io/Lakeview/" src/data/projects.ts` returns `1`
    - `grep -c "export const flagship" src/data/projects.ts` returns `1`
    - `grep -c "export const pipelineGridProjects" src/data/projects.ts` returns `1`
    - `grep -c "export const aggregateProjects" src/data/projects.ts` returns `1`
    - `grep -c "export const detailPageProjects" src/data/projects.ts` returns `1`
    - `grep -c "export const findBySlug" src/data/projects.ts` returns `1`
    - `grep -c "presentation === 'full-internal'" src/data/projects.ts` returns `2` (detailPageProjects filter + findBySlug gate)
    - `grep -c "@rule IMPORT BOUNDARY" src/data/projects.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion" src/data/projects.ts` returns `0` (boundary)
    - `grep -cE "from ['\"][^'\"]*components[/'\"]|from ['\"][^'\"]*hooks[/'\"]|from ['\"][^'\"]*pages[/'\"]" src/data/projects.ts` returns `0`
    - `grep -c "+1 об.єкт у роботі — стадія прорахунку кошторисної вартості" src/data/projects.ts` returns `1` (verbatim D-06 aggregate copy)
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>projects.ts compiles, exports 5 records + 5 derived views, lakeview uses correct .jpg filenames, Pipeline-4 aggregate copy verbatim, findBySlug gates on 'full-internal'.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/data/projects.fixtures.ts (10 synthetic records for scale-to-N proof)</name>
  <files>src/data/projects.fixtures.ts</files>
  <read_first>
    - src/data/types.ts (Project / Stage / Presentation)
    - src/data/projects.ts (reference for record shape — do not re-import from here though)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-07, D-08, D-09 (fixtures shape + enforcement)
    - .planning/research/PITFALLS.md §Pitfall 11 (ЖК grid breaks at N — fixtures stress this)
  </read_first>
  <behavior>
    - Exported `fixtures: Project[]` has exactly 10 elements
    - Every Stage bucket appears at least twice: u-rozrakhunku (≥2), u-pogodzhenni (≥2), buduetsya (≥2), zdano (≥2 — intentionally includes fixtures in the normally-empty Zdano bucket)
    - At least one of each Presentation variant appears: flagship-external, full-internal, grid-only, aggregate
    - All titles start with 'Fixture ЖК #' for obvious synthetic-vs-real distinction (per <specifics>)
    - Slugs are 'fixture-01' through 'fixture-10' (kebab-case, no Cyrillic)
    - All `renders: []` (empty — fixtures never consume real images)
    - orders are 101..110 (offset from real projects.ts to avoid collision if ever merged)
    - File has @rule doc-block per D-34 stating it's NEVER imported by pages/ or components/sections/ in production
    - `npm run lint` passes
    - File contains no React/motion/component imports
  </behavior>
  <action>
Create file `src/data/projects.fixtures.ts` with this EXACT content:

```typescript
/**
 * @module data/projects.fixtures
 * @rule IMPORT BOUNDARY: This module is the scale-to-N stress surface for the
 *   PipelineGrid / StageFilter layout (CON-02, ZHK-02, PITFALLS §Pitfall 11).
 *   It MUST NEVER be imported from src/pages/ or src/components/sections/ in
 *   production. Only the hidden /dev/grid route (Phase 4) and any future
 *   Vitest suites may import it. Enforcement: scripts/check-brand.ts
 *   importBoundaries() greps for `projects.fixtures` imports in pages/+components/.
 *
 *   Design intent: every Stage bucket has ≥2 records (including Zdano which is
 *   normally 0 in real data) so filter + empty-state UI is forced into
 *   non-trivial reflow. Every Presentation variant appears at least once.
 *   Titles are OBVIOUSLY synthetic (prefix «Fixture ЖК #N»), slugs are
 *   ASCII-only with `fixture-NN` convention so real-data slugs are never
 *   shadowed. renders: [] for every record — no real images referenced.
 */

import type { Project } from './types';

export const fixtures: Project[] = [
  // === Stage: u-rozrakhunku (3 records, exercises min-2 + orphan-row behavior) ===
  {
    slug: 'fixture-01',
    title: 'Fixture ЖК #1 · У розрахунку',
    stageLabel: 'кошторисна вартість',
    stage: 'u-rozrakhunku',
    presentation: 'aggregate',
    renders: [],
    aggregateText: 'Fixture aggregate — пункт агрегативного рядка для QA.',
    order: 101,
  },
  {
    slug: 'fixture-02',
    title: 'Fixture ЖК #2 · У розрахунку',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 102,
  },
  {
    slug: 'fixture-03',
    title: 'Fixture ЖК #3 · У розрахунку',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 103,
  },

  // === Stage: u-pogodzhenni (2 records) ===
  {
    slug: 'fixture-04',
    title: 'Fixture ЖК #4 · У погодженні',
    stageLabel: 'меморандум',
    stage: 'u-pogodzhenni',
    presentation: 'full-internal',
    location: 'Fixture-City',
    renders: [],
    whatsHappening: 'Fixture whatsHappening — QA-only text for ZhkPage template.',
    order: 104,
  },
  {
    slug: 'fixture-05',
    title: 'Fixture ЖК #5 · У погодженні',
    stageLabel: 'дозвільна документація',
    stage: 'u-pogodzhenni',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 105,
  },

  // === Stage: buduetsya (2 records — including a synthetic flagship for variant coverage) ===
  {
    slug: 'fixture-06',
    title: 'Fixture ЖК #6 · Будується',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'flagship-external',
    location: 'Fixture-City',
    externalUrl: 'https://example.com/fixture-flagship',
    renders: [],
    facts: { deadline: '2099' },
    order: 106,
  },
  {
    slug: 'fixture-07',
    title: 'Fixture ЖК #7 · Будується',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 107,
  },

  // === Stage: zdano (3 records — stress-tests the 0-in-real-data «Здано» bucket) ===
  {
    slug: 'fixture-08',
    title: 'Fixture ЖК #8 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 108,
  },
  {
    slug: 'fixture-09',
    title: 'Fixture ЖК #9 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 109,
  },
  {
    slug: 'fixture-10',
    title: 'Fixture ЖК #10 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'full-internal',
    location: 'Fixture-City',
    renders: [],
    whatsHappening: 'Fixture whatsHappening for a «Здано» variant.',
    order: 110,
  },
];
```

Bucket / presentation coverage self-check (do NOT ship this as code — verify in the acceptance criteria step):
- u-rozrakhunku: 3 (fixture-01, 02, 03)
- u-pogodzhenni: 2 (fixture-04, 05)
- buduetsya: 2 (fixture-06, 07)
- zdano: 3 (fixture-08, 09, 10)
- Presentations: flagship-external×1, full-internal×2, grid-only×6, aggregate×1 — all four variants covered.

Do NOT import from projects.ts (fixtures are independent stand-alone).
Do NOT export a `findBySlug` or any derived views — fixtures are raw data; Phase 4 may filter in-place at /dev/grid.
  </action>
  <acceptance_criteria>
    - `test -f src/data/projects.fixtures.ts` passes
    - `grep -c "export const fixtures: Project\\[\\]" src/data/projects.fixtures.ts` returns `1`
    - `grep -cE "slug: 'fixture-(0[1-9]|10)'" src/data/projects.fixtures.ts` returns `10` (exactly 10 fixture-NN slugs)
    - `grep -c "stage: 'u-rozrakhunku'" src/data/projects.fixtures.ts` returns `3` (≥2 requirement met)
    - `grep -c "stage: 'u-pogodzhenni'" src/data/projects.fixtures.ts` returns `2`
    - `grep -c "stage: 'buduetsya'" src/data/projects.fixtures.ts` returns `2`
    - `grep -c "stage: 'zdano'" src/data/projects.fixtures.ts` returns `3` (stresses normally-empty Zdano)
    - `grep -c "presentation: 'flagship-external'" src/data/projects.fixtures.ts` returns `1`
    - `grep -c "presentation: 'full-internal'" src/data/projects.fixtures.ts` returns `2`
    - `grep -c "presentation: 'grid-only'" src/data/projects.fixtures.ts` returns `6`
    - `grep -c "presentation: 'aggregate'" src/data/projects.fixtures.ts` returns `1`
    - `grep -c "Fixture ЖК #" src/data/projects.fixtures.ts` returns `10`
    - `grep -c "@rule IMPORT BOUNDARY" src/data/projects.fixtures.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion|from ['\"][^'\"]*components[/'\"]|from ['\"][^'\"]*hooks[/'\"]|from ['\"][^'\"]*pages[/'\"]" src/data/projects.fixtures.ts` returns `0`
    - `grep -cE "from ['\"]\\./projects['\"]" src/data/projects.fixtures.ts` returns `0` (independent from projects.ts)
    - `npm run lint` exits 0 (CON-02 scale-to-N signal per D-08 — fixtures type-check as Project[])
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>fixtures.ts type-checks as Project[]; 10 synthetic records span all 4 Stage buckets (min 2 each) and all 4 Presentation variants; file has boundary doc-block; `npm run lint` passes.</done>
</task>

</tasks>

<verification>
After both tasks complete:

1. `npm run lint` — exits 0 (covers both projects.ts and projects.fixtures.ts)
2. Derived-view spot-check via node:
   ```bash
   node --input-type=module -e "
   import('./src/data/projects.ts').then(m => {
     if (m.projects.length !== 5) process.exit(1);
     if (!m.flagship || m.flagship.slug !== 'lakeview') process.exit(2);
     if (m.detailPageProjects.length !== 1) process.exit(3);
     if (m.findBySlug('lakeview')) process.exit(4);      // flagship-external gated OUT
     if (!m.findBySlug('etno-dim')) process.exit(5);     // full-internal gated IN
     console.log('projects.ts derived-views OK');
   })
   "
   ```
   Exit 0 = pass. Non-zero = specific invariant violation.

3. `grep -cE "(projects|fixtures)\\.ts" src/data/` — exits with `src/data/projects.ts` + `src/data/projects.fixtures.ts` existing.

Commit boundary (per CONTEXT.md <specifics>):

```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(02): add canonical projects + synthetic fixtures" --files src/data/projects.ts src/data/projects.fixtures.ts
```
</verification>

<success_criteria>
- [ ] src/data/projects.ts exports 5-element `projects` array + 5 derived views (flagship, pipelineGridProjects, aggregateProjects, detailPageProjects, findBySlug)
- [ ] Lakeview renders list uses the 7 actual .jpg filenames (not the wrong .webp list from ARCHITECTURE)
- [ ] Pipeline-4 aggregateText verbatim from D-06 («+1 об'єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.»)
- [ ] findBySlug returns only full-internal records (D-04 gate)
- [ ] src/data/projects.fixtures.ts exports 10 synthetic records covering all 4 Stage + all 4 Presentation variants
- [ ] Both files have @rule IMPORT BOUNDARY doc-block (D-34)
- [ ] Both files have zero React/motion/component/hook imports
- [ ] `npm run lint` exits 0 (ZHK-02 scale-to-N signal — per D-08)
- [ ] Files committed with single atomic commit
</success_criteria>

<output>
After completion, create `.planning/phases/02-data-layer-content/02-02-SUMMARY.md`. Key fields:
- `affects`: [data]
- `provides`: [projects, flagship, pipelineGridProjects, aggregateProjects, detailPageProjects, findBySlug, fixtures]
- `patterns`: [discriminated-presentation-union (D-01), derived-views-from-single-array, filesystem-authoritative-over-spec (lakeview .jpg), `Fixture ЖК #N` naming convention]
</output>
