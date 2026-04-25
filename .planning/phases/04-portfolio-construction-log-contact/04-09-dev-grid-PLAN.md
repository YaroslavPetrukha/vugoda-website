---
phase: 04-portfolio-construction-log-contact
plan: 09
type: execute
wave: 2
depends_on: ["04-01", "04-03", "04-04", "04-05"]
files_modified:
  - src/pages/DevGridPage.tsx
  - src/App.tsx
autonomous: true
requirements: [HUB-04]
must_haves:
  truths:
    - "/#/dev/grid renders a fixtures-driven version of /projects layout (FlagshipCard + StageFilter + PipelineGrid + AggregateRow)"
    - "Synthetic flagship is fixtures.find(p => p.presentation === 'flagship-external') (= fixture-06)"
    - "Synthetic aggregate is fixtures.find(p => p.presentation === 'aggregate') (= fixture-01)"
    - "Pipeline grid receives fixtures filtered to non-flagship+non-aggregate variants (=8 records)"
    - "Stage chip counts are derived from full fixtures array (D-03 honest-counts model applies here too)"
    - "App.tsx adds <Route path=\"dev/grid\" element={<DevGridPage />} /> sibling of dev/brand"
    - "Build pipeline green: scripts/check-brand.ts rule 4 with DevGridPage exemption (Wave 1 plan 04-04) does NOT block this fixtures import"
    - "/#/projects regression-free: production page renders identically before/after this plan; no fixtures leak into the production graph (StageFilter chip counts on /projects still show «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)», not the fixture counts)"
  artifacts:
    - path: "src/pages/DevGridPage.tsx"
      provides: "Hidden fixtures stress-test page reusing /projects components"
      contains: "fixtures"
    - path: "src/App.tsx"
      provides: "Updated route table with dev/grid registration"
      contains: "dev/grid"
  key_links:
    - from: "src/pages/DevGridPage.tsx"
      to: "src/data/projects.fixtures.ts"
      via: "import { fixtures }"
      pattern: "import \\{ fixtures \\}"
    - from: "src/App.tsx"
      to: "src/pages/DevGridPage.tsx"
      via: "import DevGridPage"
      pattern: "DevGridPage"
---

<objective>
Hidden `/dev/grid` route — fixtures stress-test surface (HUB-04 Success Criterion #6). Demonstrates the `/projects` layout reflows correctly at N=4..10 cards across all 4 stage buckets and all 4 presentation variants.

Composition (D-39..D-42):
- Same `<FlagshipCard>` + `<StageFilter>` + `<PipelineGrid>` + `<AggregateRow>` as `/projects` (plan 04-05)
- Fed `fixtures` (10 synthetic records from `src/data/projects.fixtures.ts` per Phase 2 D-09)
- Synthetic flagship = `fixture-06` (the only `presentation: 'flagship-external'` fixture, per Phase 2 D-07)
- Synthetic aggregate = `fixture-01` (the only `presentation: 'aggregate'` fixture)
- Stage filter URL state shared with `/projects` mechanism (separate route, same `?stage=` reading)

Plus: register `<Route path="dev/grid">` in `App.tsx`.

This plan depends on Wave 1 plan 04-04's check-brand exclusion (without it, the `import { fixtures }` here breaks the postbuild hook → build fails).

Output: 1 new page + 1 file edit (App.tsx).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/data/projects.fixtures.ts
@src/data/types.ts
@src/lib/stages.ts
@src/components/sections/projects/FlagshipCard.tsx
@src/components/sections/projects/AggregateRow.tsx
@src/components/sections/projects/StageFilter.tsx
@src/components/sections/projects/PipelineGrid.tsx
@src/pages/ProjectsPage.tsx
@src/pages/DevBrandPage.tsx
@src/App.tsx
@scripts/check-brand.ts

<interfaces>
From src/data/projects.fixtures.ts (Phase 2):
```typescript
export const fixtures: Project[];  // 10 records
// fixture-01: aggregate (u-rozrakhunku)
// fixture-02, fixture-03: grid-only (u-rozrakhunku)
// fixture-04: full-internal (u-pogodzhenni)
// fixture-05: grid-only (u-pogodzhenni)
// fixture-06: flagship-external (buduetsya)  ← synthetic flagship slot per D-41
// fixture-07: grid-only (buduetsya)
// fixture-08: grid-only (zdano)
// fixture-09: grid-only (zdano)
// fixture-10: full-internal (zdano)
```

From src/lib/stages.ts (Wave 1 plan 04-01):
```typescript
export const STAGES;   // ['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano']
export function isStage(s: string | null | undefined): s is Stage;
```

From src/components/sections/projects/* (Waves 1+2):
```typescript
// FlagshipCard accepts { project: Project }
// AggregateRow accepts { project: Project | undefined }
// StageFilter accepts { counts: Record<Stage, number> }
// PipelineGrid accepts { projects: Project[]; active: Stage | null }
```

From src/App.tsx (current state):
- Route table inside `<Route element={<Layout />}>` — index, projects, zhk/:slug, construction-log, contact, dev/brand, *.
- `dev/brand` is the precedent — D-39 says place `dev/grid` adjacent.

From scripts/check-brand.ts (after Wave 1 plan 04-04 lands):
- Rule 4 importBoundaries excludes `DevGridPage` from the fixtures-import grep.
- `DevGridPage.tsx` MUST literally have `DevGridPage` in its filename for the `grep -v 'DevGridPage'` exclusion to fire.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/pages/DevGridPage.tsx (fixtures-driven /projects mirror)</name>
  <read_first>
    - src/data/projects.fixtures.ts (10 records — confirm fixture-06 is flagship-external + fixture-01 is aggregate)
    - src/pages/ProjectsPage.tsx (just created Wave 2 plan 04-05 — model for composition shape)
    - src/pages/DevBrandPage.tsx (precedent for hidden QA route file structure + module-level doc-block)
    - src/lib/stages.ts (STAGES, isStage)
    - src/components/sections/projects/{FlagshipCard,StageFilter,PipelineGrid,AggregateRow}.tsx (the 4 components imported)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-39, D-40, D-41, D-42)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q13 (DevGridPage composition) + §Open Question 5 (fixture-06 externalUrl)
  </read_first>
  <files>src/pages/DevGridPage.tsx</files>
  <action>
    Create new file `src/pages/DevGridPage.tsx`:

    ```tsx
    /**
     * @module pages/DevGridPage
     *
     * HUB-04 Success Criterion #6 — hidden fixtures stress-test surface.
     * Direct URL only (/#/dev/grid); not linked from Nav (D-39).
     *
     * Mirrors /projects (plan 04-05) composition but feeds `fixtures` (10
     * synthetic records from src/data/projects.fixtures.ts) instead of
     * production projects:
     *   1. <FlagshipCard project={syntheticFlagship} />
     *   2. <StageFilter counts={fixtureCounts} />
     *   3. <PipelineGrid projects={fixturesGridScope} active={...} /> + <AggregateRow project={syntheticAggregate} />
     *
     * Synthetic flagship = fixtures.find(p => p.presentation === 'flagship-external') = fixture-06.
     * Synthetic aggregate = fixtures.find(p => p.presentation === 'aggregate') = fixture-01.
     *
     * Stage-fallback unknown returns '—' from src/lib/stages.ts (D-42) — this
     * page exercises that path indirectly: any future fixture with a
     * runtime-cast stage value would render the chip badge as «—».
     *
     * IMPORT BOUNDARY: this file is THE explicit exception to the fixtures-
     * import boundary (Phase 2 D-09 + Wave 1 plan 04-04 check-brand exclusion).
     * The file MUST be named exactly `DevGridPage.tsx` for `grep -v 'DevGridPage'`
     * in scripts/check-brand.ts rule 4 to fire — do NOT rename.
     *
     * Default export.
     */

    import { useSearchParams } from 'react-router-dom';
    import { fixtures } from '../data/projects.fixtures';
    import type { Stage } from '../data/types';
    import { STAGES, isStage } from '../lib/stages';
    import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
    import { StageFilter } from '../components/sections/projects/StageFilter';
    import { PipelineGrid } from '../components/sections/projects/PipelineGrid';
    import { AggregateRow } from '../components/sections/projects/AggregateRow';

    /** Counts span the FULL fixtures array (D-03 + D-40 — honest counts apply here too). */
    const fixtureCounts: Record<Stage, number> = STAGES.reduce(
      (acc, s) => {
        acc[s] = fixtures.filter((p) => p.stage === s).length;
        return acc;
      },
      {} as Record<Stage, number>,
    );

    /** Synthetic flagship slot (D-41). fixture-06 is the only flagship-external variant. */
    const syntheticFlagship = fixtures.find((p) => p.presentation === 'flagship-external');

    /** Synthetic aggregate slot. fixture-01 is the only aggregate variant. */
    const syntheticAggregate = fixtures.find((p) => p.presentation === 'aggregate');

    /** Grid-scope: PipelineGrid filters by `full-internal` + `grid-only` already, but
     *  passing the full fixtures array is fine — non-grid variants are filtered out
     *  inside the component. Pre-filtering here would be redundant. */
    const fixturesForGrid = fixtures;

    export default function DevGridPage() {
      const [params] = useSearchParams();
      const raw = params.get('stage');
      const active: Stage | null = isStage(raw) ? raw : null;

      const showAggregate =
        syntheticAggregate &&
        (active === null || syntheticAggregate.stage === active);

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mb-8 flex flex-col gap-2">
              <h1 className="font-bold text-6xl text-text">Dev · Grid Stress Test</h1>
              <p className="text-base text-text-muted">
                Hidden fixtures surface — /dev/grid · {fixtures.length} synthetic ЖК · QA only
              </p>
            </header>

            {syntheticFlagship && <FlagshipCard project={syntheticFlagship} />}

            <StageFilter counts={fixtureCounts} />

            <PipelineGrid projects={fixturesForGrid} active={active} />
            {showAggregate && <AggregateRow project={syntheticAggregate} />}
          </div>
        </section>
      );
    }
    ```

    NOTES:
    - The H1 «Dev · Grid Stress Test» is intentionally English — this is a developer-only QA surface, NOT a production page; mixing English here clearly signals «not for clients». Same convention as `/dev/brand`'s DevBrandPage which uses ASCII-only section headers.
    - Inline structural label «Dev · Grid Stress Test» (24 chars) — fine inline (English microcopy on dev surface; Phase 3 D-29 carve-out applies even more clearly here).
    - The page filename MUST be `DevGridPage.tsx` (not `DevGrid.tsx` or `dev-grid-page.tsx`) for the check-brand exclusion grep `grep -v 'DevGridPage'` to filter this file's fixtures import.
    - No explicit BuduetsyaPointer / EmptyStateZdano dispatches — `/dev/grid` shows the actual filtered fixtures even when active='buduetsya' (fixture-07 is buduetsya+grid-only, so PipelineGrid will render 1 card). On `/dev/grid?stage=zdano`, fixtures-08/09/10 are zdano, so 3 cards render — this is the «scale-to-N» stress test working correctly. Per Pattern 4 note: «pointer is /projects-specific behavior».
    - The `if (syntheticFlagship)` guard handles the (impossible-by-data-shape) case where the fixture array doesn't include a flagship-external variant. Defensive null-check.
  </action>
  <verify>
    <automated>grep -nE "export default function DevGridPage" src/pages/DevGridPage.tsx && grep -nE "import \{ fixtures \}" src/pages/DevGridPage.tsx && grep -nE "syntheticFlagship|syntheticAggregate" src/pages/DevGridPage.tsx && grep -nE "<FlagshipCard project=\{syntheticFlagship\}" src/pages/DevGridPage.tsx && grep -nE "<StageFilter counts=\{fixtureCounts\}" src/pages/DevGridPage.tsx && grep -nE "<PipelineGrid projects=\{fixturesForGrid\}" src/pages/DevGridPage.tsx && grep -nE "<AggregateRow project=\{syntheticAggregate\}" src/pages/DevGridPage.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at exactly `src/pages/DevGridPage.tsx` (filename critical for check-brand exclusion).
    - Imports `fixtures` from `../data/projects.fixtures`.
    - Default export named `DevGridPage`.
    - Composes FlagshipCard + StageFilter + PipelineGrid + AggregateRow with fixture-driven data.
    - Synthetic flagship found via `fixtures.find(p => p.presentation === 'flagship-external')`.
    - Synthetic aggregate found via `fixtures.find(p => p.presentation === 'aggregate')`.
    - Counts derived from full fixtures array.
    - URL `?stage=...` state honored (same isStage validation).
    - `npm run lint` exits 0.
    - `npm run postbuild` reports `[check-brand] 4/4 checks passed` — confirming the rule-4 exclusion works (fixtures import not flagged because filename matches `DevGridPage`).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Register dev/grid route in src/App.tsx</name>
  <read_first>
    - src/App.tsx (current state — confirm route table structure and dev/brand precedent)
    - src/pages/DevGridPage.tsx (just created)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-39)
  </read_first>
  <files>src/App.tsx</files>
  <action>
    Edit `src/App.tsx` to register the `dev/grid` route as a sibling of `dev/brand`:

    1. **Add the import** at the top, after the existing `DevBrandPage` import:
       ```tsx
       import DevGridPage from './pages/DevGridPage';
       ```

    2. **Add the route** inside the `<Route element={<Layout />}>` block, between `dev/brand` and the catch-all `*`:
       ```tsx
       <Route path="dev/grid" element={<DevGridPage />} />
       ```

    Final route table shape (after edit):
    ```tsx
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="zhk/:slug" element={<ZhkPage />} />
          <Route path="construction-log" element={<ConstructionLogPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="dev/brand" element={<DevBrandPage />} />
          <Route path="dev/grid" element={<DevGridPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
    ```

    3. **Update the URL comment block** (lines 16-23 of App.tsx) to add the new route line:
       ```
       *   /#/dev/grid             → DevGridPage (Phase 4 D-39, hidden — fixtures stress test)
       ```
       Position this line between `dev/brand` and `*` for consistency.

    NOTES:
    - DO NOT touch the rest of App.tsx — HashRouter, Layout wrapper, route ordering all unchanged.
    - DO NOT add a Nav link to dev/grid — D-39 explicit «not linked from Nav».
    - Eager (non-lazy) import per Phase 3 D-26 precedent for DevBrandPage. ~5KB overhead acceptable for hidden QA surface.
  </action>
  <verify>
    <automated>grep -nE "import DevGridPage from './pages/DevGridPage'" src/App.tsx && grep -nE 'path="dev/grid"' src/App.tsx && grep -nE "&lt;DevGridPage" src/App.tsx && npm run build</automated>
  </verify>
  <done>
    - App.tsx imports DevGridPage.
    - App.tsx contains `<Route path="dev/grid" element={<DevGridPage />} />` between `dev/brand` and the catch-all.
    - Route ordering preserved (catch-all `*` stays last).
    - `npm run build` exits 0 (full chain green — including postbuild check-brand 4/4 PASS).
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (`npm run dev` → `/#/dev/grid`):
      - Page renders «Dev · Grid Stress Test» H1.
      - Synthetic flagship card visible: 10 cards render and **fixture-06 shows zero broken-image icons** because FlagshipCard guards on `renders.length > 0` (added to plan 04-03; production projects always have ≥1 render so the guard is a no-op for HUB-02).
      - Stage chip counts: «У розрахунку (3) · У погодженні (2) · Будується (2) · Здано (3)» — fixture distribution.
      - 8 grid cards visible (10 fixtures - 1 flagship - 1 aggregate = 8 grid candidates; PipelineGrid filters by full-internal+grid-only → all 8 match).
      - Aggregate row visible at default state (fixture-01 «Fixture aggregate — пункт агрегативного рядка для QA»).
      - Click chips: filter dispatch matches /projects logic.
      - `?stage=garbage` → defaults to «Усі» (no chip active).
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **Files**: `src/pages/DevGridPage.tsx` (new) + `src/App.tsx` (edited).

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (full chain — most importantly the **postbuild check-brand 4/4 PASS**, which confirms Wave 1 plan 04-04's DevGridPage exclusion is working as intended).

4. **Brand invariants**:
   - `npm run postbuild` shows `[check-brand] 4/4 checks passed`.
   - Specifically rule 4 (importBoundaries) passes despite the `import { fixtures }` in DevGridPage.

5. **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (`npm run dev` → `/#/dev/grid`):
   - Page H1 + subtitle visible.
   - Synthetic flagship card visible — fixture-06's empty `renders: []` is silently shielded by FlagshipCard's `{project.renders.length > 0 && (...)}` guard (shipped in plan 04-03); zero broken-image icons.
   - StageFilter chips show fixture counts: 3/2/2/3.
   - 8 pipeline grid cards visible at default; reflows at 4/6/8 cards as filter changes.
   - AggregateRow shows fixture-01's aggregateText at default + on `?stage=u-rozrakhunku`.
   - `?stage=zdano` → 3 cards (fixtures-08/09/10) render — NOT the EmptyStateZdano (this is the stress test divergence from /projects per Pattern 4).
   - `?stage=buduetsya` → 1 card (fixture-07) renders — NOT BuduetsyaPointer.

6. **Bundle delta**: expect +5-10 KB gzipped (fixtures import is reachable from entry now; was tree-shaken before).

7. **Regression check**: `/#/projects` still works exactly as before (plan 04-09 doesn't touch ProjectsPage).
</verification>

<success_criteria>
- HUB-04 Success Criterion #6 closed: /dev/grid renders fixtures-driven layout, demonstrating scale-to-N reflows across all 4 stage buckets and all 4 presentation variants.
- /projects regression-free (plan 04-05 unchanged).
- check-brand rule 4 exclusion working in production build (Wave 1 plan 04-04 validated).
- Build pipeline 4/4 brand checks PASS.
- Stage-fallback `'—'` (D-42) ready to be exercised by manual cast-to-`'unknown'` test (deferred to Phase 7 client-handoff if needed).
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-09-SUMMARY.md` documenting:
- 2 file paths (1 new page + 1 file edit)
- Decision IDs implemented (D-39, D-40, D-41, D-42)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta
- Manual smoke results: chip counts (3/2/2/3 for u-rozrakhunku/u-pogodzhenni/buduetsya/zdano), card distribution per filter
- Verification of Wave 1 plan 04-04: check-brand 4/4 still PASS with DevGridPage in the import graph
- Note for Phase 7 audit: D-42 stage-fallback unknown-cast test can be exercised via a one-shot fixture-record edit (cast `stage` to `'unknown' as Stage`) and visit `/#/dev/grid` — chip would render «—» badge instead of crashing
</output>
