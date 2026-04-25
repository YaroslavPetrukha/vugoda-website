---
phase: 04-portfolio-construction-log-contact
plan: 05
type: execute
wave: 2
depends_on: ["04-01", "04-03"]
files_modified:
  - src/components/sections/projects/StageFilter.tsx
  - src/components/sections/projects/PipelineCard.tsx
  - src/components/sections/projects/PipelineGrid.tsx
  - src/components/sections/projects/EmptyStateZdano.tsx
  - src/components/sections/projects/BuduetsyaPointer.tsx
  - src/pages/ProjectsPage.tsx
autonomous: true
requirements: [HUB-01, HUB-02, HUB-03, HUB-04]
must_haves:
  truths:
    - "/projects renders <h1>Проєкти</h1> + subtitle + FlagshipCard always above the chip filter (D-01, D-02)"
    - "StageFilter chip row shows «Усі» + 4 chips with counts spanning ALL projects: «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)» (D-03)"
    - "URL ?stage=... drives the filter; setSearchParams replace mode (D-10); unknown values default to «Усі» (D-11)"
    - "Selected «У розрахунку» → Маєток only + AggregateRow visible (D-06)"
    - "Selected «У погодженні» → Етно Дім + NTEREST + AggregateRow hidden (D-07)"
    - "Selected «Будується» → grid hidden + «Див. ЖК Lakeview вище ↑» pointer + AggregateRow hidden (D-08)"
    - "Selected «Здано» → single-cube empty state + «Наразі жоден ЖК не здано» + AggregateRow hidden (D-09)"
  artifacts:
    - path: "src/components/sections/projects/StageFilter.tsx"
      provides: "Chip-row filter with useSearchParams URL state"
      exports: ["StageFilter"]
    - path: "src/components/sections/projects/PipelineCard.tsx"
      provides: "Reusable single grid card consuming Project prop"
      exports: ["PipelineCard"]
    - path: "src/components/sections/projects/PipelineGrid.tsx"
      provides: "Pure grid renderer accepting projects array"
      exports: ["PipelineGrid"]
    - path: "src/components/sections/projects/EmptyStateZdano.tsx"
      provides: "Single big cube + line for «Здано (0)»"
      exports: ["EmptyStateZdano"]
    - path: "src/components/sections/projects/BuduetsyaPointer.tsx"
      provides: "One-line pointer to flagship above"
      exports: ["BuduetsyaPointer"]
    - path: "src/pages/ProjectsPage.tsx"
      provides: "Composed /projects page (REPLACES Phase 1 stub)"
      contains: "FlagshipCard project={flagship}"
  key_links:
    - from: "src/pages/ProjectsPage.tsx"
      to: "src/components/sections/projects/FlagshipCard.tsx"
      via: "import { FlagshipCard }"
      pattern: "import \\{ FlagshipCard \\}"
    - from: "src/components/sections/projects/StageFilter.tsx"
      to: "react-router-dom useSearchParams"
      via: "import { useSearchParams }"
      pattern: "useSearchParams"
    - from: "src/pages/ProjectsPage.tsx"
      to: "src/lib/stages.ts"
      via: "import { STAGES, isStage }"
      pattern: "import \\{ STAGES"
---

<objective>
Compose `/projects` — the Portfolio Hub. Ships HUB-01, HUB-02, HUB-03, HUB-04 end-to-end. Replaces the Phase 1 stub `src/pages/ProjectsPage.tsx`.

Page anatomy (D-01..D-12):
- `<h1>Проєкти</h1>` + muted subtitle (D-01)
- `<FlagshipCard project={flagship} />` ABOVE the filter (D-02, always visible)
- `<StageFilter counts={...} />` chip row, URL-state via useSearchParams (D-10, D-11)
- Body dispatched on active stage:
  - default («Усі») / u-rozrakhunku / u-pogodzhenni → `<PipelineGrid> + <AggregateRow>` (with AggregateRow hidden when filter excludes Pipeline-4)
  - buduetsya → `<BuduetsyaPointer />` only
  - zdano → `<EmptyStateZdano />` only

Output: 6 files (5 new section components + 1 page replacement).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/data/projects.ts
@src/data/types.ts
@src/lib/stages.ts
@src/components/sections/projects/FlagshipCard.tsx
@src/components/sections/projects/AggregateRow.tsx
@src/components/sections/home/PortfolioOverview.tsx
@src/components/ui/ResponsivePicture.tsx
@src/components/brand/IsometricCube.tsx
@src/content/projects.ts
@src/content/home.ts
@src/pages/ProjectsPage.tsx

<interfaces>
From src/lib/stages.ts (Wave 1 plan 04-01):
```typescript
export const STAGES: readonly Stage[];  // ['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano']
export function stageLabel(stage: Stage | string | undefined): string;  // unknown → '—'
export function isStage(s: string | null | undefined): s is Stage;
```

From src/content/projects.ts (Wave 1 plan 04-01):
```typescript
export const projectsHeading: string;        // 'Проєкти'
export const projectsSubtitle: string;       // '1 в активній фазі будівництва · 4 у pipeline · 0 здано'
export const zdanoEmptyMessage: string;      // 'Наразі жоден ЖК не здано'
export const buduetsyaPointerMessage: string; // 'Див. ЖК Lakeview вище ↑'
```

From src/components/sections/projects/FlagshipCard.tsx (Wave 1 plan 04-03):
```typescript
export function FlagshipCard({ project }: { project: Project }): JSX.Element;
```

From src/components/sections/projects/AggregateRow.tsx (Wave 1 plan 04-03):
```typescript
export function AggregateRow({ project }: { project: Project | undefined }): JSX.Element | null;
```

From src/data/projects.ts:
```typescript
export const projects: Project[];                  // raw 5-record source
export const flagship: Project;                    // Lakeview
export const pipelineGridProjects: Project[];      // 3 records (full-internal + grid-only, sorted by order)
export const aggregateProjects: Project[];         // 1 record (Pipeline-4)
```

From react-router-dom v7 (already installed):
```typescript
export function useSearchParams(): [URLSearchParams, (next: URLSearchParams, opts?: { replace?: boolean }) => void];
```

Phase 4 ANI-03 hover (D-30..D-35) is NOT applied in this plan — Wave 3 plan 04-10 does the retroactive sweep across PipelineCard + the home pipeline grid.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create PipelineCard, EmptyStateZdano, BuduetsyaPointer (3 leaf components)</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (lines 90-112 — pipeline card .map body to extract verbatim)
    - src/components/ui/ResponsivePicture.tsx (prop signature)
    - src/components/brand/IsometricCube.tsx (variant='single' + stroke='#A7AFBC' + opacity=0.4)
    - src/content/projects.ts (zdanoEmptyMessage + buduetsyaPointerMessage)
    - src/data/types.ts (Project interface)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-08, D-09)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §C (Pipeline card pattern) + §E (EmptyStateZdano pattern) + §Q5 (Будується pointer styling)
  </read_first>
  <files>src/components/sections/projects/PipelineCard.tsx, src/components/sections/projects/EmptyStateZdano.tsx, src/components/sections/projects/BuduetsyaPointer.tsx</files>
  <action>
    **File 1 — `src/components/sections/projects/PipelineCard.tsx`:**

    ```tsx
    /**
     * @module components/sections/projects/PipelineCard
     *
     * HUB-03 — Single pipeline grid card. Extracted from home PortfolioOverview
     * pipeline-grid .map body (lines 90-112). Consumed by PipelineGrid (in
     * /projects + /dev/grid) and indirectly by home (Wave 3 plan 04-10
     * decides whether home keeps inline-mapped JSX or also imports this).
     *
     * Reads project.stageLabel directly (descriptive narrative-style string
     * like «меморандум»/«кошторисна документація»/«дозвільна документація»),
     * NOT stages.stageLabel(stage) (which is the chip-friendly short form).
     * Per HUB-03 the card surfaces the system-narrative weight, chips show
     * Model-Б buckets — different fields by design.
     *
     * D-34: Maietok / NTEREST grid-only cards get cursor-default (NOT pointer)
     * because they're not clickable in v1. Etno Dim (full-internal) WILL link
     * to /zhk/etno-dim — that variation is decided per-card here.
     *
     * Phase 4 plan 04-10 (Wave 3, ANI-03) adds hover triple-effect classes.
     * This plan ships static-only.
     *
     * IMPORT BOUNDARY: forwards `renders/{slug}/{file}` template into
     * ResponsivePicture; never embeds quoted slash-prefixed tree paths.
     */

    import { Link } from 'react-router-dom';
    import type { Project } from '../../../data/types';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';

    interface Props {
      project: Project;
    }

    export function PipelineCard({ project }: Props) {
      // D-34: only full-internal cards are clickable (link to /zhk/{slug}).
      // grid-only cards stay cursor-default; Wave 3 ANI-03 still applies hover glow.
      const isClickable = project.presentation === 'full-internal';

      const inner = (
        <article className="flex flex-col gap-4 bg-bg-surface">
          {project.renders.length > 0 && (
            <ResponsivePicture
              src={`renders/${project.slug}/${project.renders[0]}`}
              alt={project.title}
              widths={[640, 1280]}
              sizes="(min-width: 1280px) 400px, 100vw"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          )}
          <div className="flex flex-col gap-2 p-6">
            <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
              {project.stageLabel}
            </span>
            <h3 className="font-bold text-xl text-text">{project.title}</h3>
            {project.location && (
              <span className="text-sm text-text-muted">{project.location}</span>
            )}
          </div>
        </article>
      );

      if (isClickable) {
        // react-router-dom <Link> — HashRouter prefixes the path with `#/` automatically;
        // `to="/zhk/etno-dim"` resolves to `/#/zhk/etno-dim` in the browser.
        // Wave 3 ANI-03 hover applies to the inner <article>, not this wrapper.
        return (
          <Link to={`/zhk/${project.slug}`} className="block">
            {inner}
          </Link>
        );
      }

      // Non-clickable card — wrapper preserves cursor-default per D-34.
      return <div className="cursor-default">{inner}</div>;
    }
    ```

    NOTES on PipelineCard:
    - Clickable case uses react-router-dom `<Link to={`/zhk/${slug}`}>` (m-3): HashRouter handles the `#/` prefix automatically; paths are router-relative. Identical UX to a raw anchor, plus integrates cleanly with router state.
    - Renders length guard: fixtures have `renders: []` (no images) — without the guard the ResponsivePicture would emit broken srcset URLs. /dev/grid stress test depends on this defensive check.
    - Wave 3 plan 04-10 will add ANI-03 hover classes to the article element.

    **File 2 — `src/components/sections/projects/EmptyStateZdano.tsx`:**

    ```tsx
    /**
     * @module components/sections/projects/EmptyStateZdano
     *
     * HUB-01 — «Здано (0)» empty-state cube + line (D-09). Rendered by
     * ProjectsPage when active stage filter === 'zdano'. Cube-ladder
     * semantics (CONCEPT §5.2): single = empty-state focal marker,
     * larger than the aggregate-row decorative cube to claim the bucket.
     *
     * Stroke '#A7AFBC' + opacity 0.4 — palette-whitelisted, brandbook
     * 5-60% opacity range, on the muted side (this is a non-foreground
     * signal saying «зрозуміло, що тут пусто»).
     */

    import { IsometricCube } from '../../brand/IsometricCube';
    import { zdanoEmptyMessage } from '../../../content/projects';

    export function EmptyStateZdano() {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <IsometricCube
            variant="single"
            stroke="#A7AFBC"
            opacity={0.4}
            className="h-24 w-24"
          />
          <p className="text-base text-text-muted">{zdanoEmptyMessage}</p>
        </div>
      );
    }
    ```

    NOTES on EmptyStateZdano:
    - Cube `h-24 w-24` = ~96px — within D-09's 96-120px range (focal point of empty bucket).
    - `<IsometricCube variant="single"` opening tag must be single-line on the JSX line containing `<IsometricCube` for verify grep — done above.
    - `text-text-muted` = `#A7AFBC` per brand tokens, requires text size ≥14pt; `text-base` = 16px (above floor).

    **File 3 — `src/components/sections/projects/BuduetsyaPointer.tsx`:**

    ```tsx
    /**
     * @module components/sections/projects/BuduetsyaPointer
     *
     * HUB-01 — «Будується» pointer (D-08). Rendered by ProjectsPage when
     * active stage filter === 'buduetsya'. The only buduetsya project IS
     * Lakeview, but Lakeview renders as the flagship ABOVE the filter, so
     * this component tells the user honestly: «look up».
     *
     * aria-live="polite" so screen readers announce the dispatch when user
     * clicks the «Будується» chip.
     *
     * The U+2191 «↑» glyph already signals direction; no arrow icon needed
     * (CLAUDE.md no-decorative-flourishes constraint).
     */

    import { buduetsyaPointerMessage } from '../../../content/projects';

    export function BuduetsyaPointer() {
      return (
        <div
          className="flex items-center justify-center py-16 lg:py-24"
          aria-live="polite"
          role="status"
        >
          <p className="text-base text-text-muted">{buduetsyaPointerMessage}</p>
        </div>
      );
    }
    ```

    NOTES on BuduetsyaPointer:
    - `aria-live="polite"` + `role="status"` matches D-08's «aria-live polite» mandate.
    - Vertical breathing 64-96px py per D-08 — `py-16 lg:py-24` (64-96px range).
  </action>
  <verify>
    <automated>grep -nE "export function PipelineCard" src/components/sections/projects/PipelineCard.tsx && grep -nE 'project\.stageLabel' src/components/sections/projects/PipelineCard.tsx && grep -nE "export function EmptyStateZdano" src/components/sections/projects/EmptyStateZdano.tsx && grep -nE 'IsometricCube variant="single"' src/components/sections/projects/EmptyStateZdano.tsx && grep -nE "export function BuduetsyaPointer" src/components/sections/projects/BuduetsyaPointer.tsx && grep -nE 'aria-live="polite"' src/components/sections/projects/BuduetsyaPointer.tsx && ! grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/projects/ && npm run lint</automated>
  </verify>
  <done>
    - 3 files created at correct paths.
    - PipelineCard exports the function with `{ project: Project }` prop, contains the renders-length guard `{project.renders.length > 0 && (`, and uses `cursor-default` on the non-clickable wrapper.
    - EmptyStateZdano exports the function with cube + message, contains `<IsometricCube variant="single"`.
    - BuduetsyaPointer exports the function with `aria-live="polite"` and `role="status"`.
    - Zero quoted-prefix path literals in any of the 3 files.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create StageFilter and PipelineGrid components</name>
  <read_first>
    - src/lib/stages.ts (just created — STAGES, stageLabel, isStage)
    - src/data/types.ts (Stage type)
    - src/data/projects.ts (raw `projects` array — used to compute counts)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 1 (StageFilter useSearchParams) + §Pattern 4 (PipelineGrid prop-driven) + §Pattern 5 (counts derivation) + §Q2 (HashRouter compat) + §Q5 (chip styling) + §Pitfall 8 (?stage=garbage)
  </read_first>
  <files>src/components/sections/projects/StageFilter.tsx, src/components/sections/projects/PipelineGrid.tsx</files>
  <action>
    **File 1 — `src/components/sections/projects/StageFilter.tsx`:**

    ```tsx
    /**
     * @module components/sections/projects/StageFilter
     *
     * HUB-01 — Chip-row filter (D-03 chip counts span ALL projects;
     * D-10 URL state via ?stage=...; D-11 unknown values fallback;
     * D-12 outline-pill at rest, accent-fill at active).
     *
     * URL state: ?stage=u-rozrakhunku|u-pogodzhenni|buduetsya|zdano
     * Absence of param = «Усі» (default). setSearchParams(..., { replace: true })
     * to avoid history bloat (D-10 + Pitfall 3 — chip clicks aren't navigation).
     *
     * HashRouter compat verified: useSearchParams parses query string AFTER
     * the hash, so /#/projects?stage=zdano works correctly (RESEARCH §Q2).
     *
     * No springs (D-32). 200ms ease-out color transition only on chip state
     * change. Phase 5 absorbs the inline cubic-bezier into motionVariants.ts.
     */

    import { useSearchParams } from 'react-router-dom';
    import type { Stage } from '../../../data/types';
    import { STAGES, stageLabel, isStage } from '../../../lib/stages';

    interface Props {
      counts: Record<Stage, number>;
    }

    /** Chip class string. Active = accent-fill, rest = outline-pill (D-12). */
    function chipClass(active: boolean): string {
      const base =
        'inline-flex items-center px-4 py-2 text-sm font-medium border rounded-full ' +
        'transition-[background-color,color,border-color] duration-200 ' +
        'ease-[cubic-bezier(0.22,1,0.36,1)] ' +
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
      if (active) {
        return `${base} bg-accent text-bg-black border-accent`;
      }
      return `${base} bg-transparent text-text border-text-muted hover:border-text`;
    }

    export function StageFilter({ counts }: Props) {
      const [params, setParams] = useSearchParams();
      const raw = params.get('stage');
      const active: Stage | null = isStage(raw) ? raw : null;

      const setActive = (s: Stage | null) => {
        const next = new URLSearchParams(params);
        if (s == null) next.delete('stage');
        else next.set('stage', s);
        setParams(next, { replace: true });
      };

      return (
        <div role="group" aria-label="Фільтр за стадіями" className="my-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={chipClass(active === null)}
          >
            Усі
          </button>
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              aria-pressed={active === s}
              className={chipClass(active === s)}
            >
              {stageLabel(s)} ({counts[s]})
            </button>
          ))}
        </div>
      );
    }
    ```

    NOTES on StageFilter:
    - The chip class string uses `transition-[background-color,color,border-color]` — explicit property list per D-32 (NO `transition-all`).
    - `cubic-bezier(0.22,1,0.36,1)` is the brand ease-out; Phase 5 absorbs into motionVariants.ts.
    - `aria-pressed` on each button announces toggle state to screen readers.
    - `focus-visible:outline-accent` keeps the global focus-ring (Phase 1 D-21) compliant on dark bg.
    - The «Усі» chip is the implicit default — no Stage type for it; just `null` in the URL state.
    - Cyrillic «Усі» (3 chars) inline — well below the 40-char content-boundary threshold; structural microcopy carve-out (Phase 3 D-29 + Phase 2 D-20).

    **File 2 — `src/components/sections/projects/PipelineGrid.tsx`:**

    ```tsx
    /**
     * @module components/sections/projects/PipelineGrid
     *
     * HUB-03 — Pure data-source-agnostic grid renderer (RESEARCH Pattern 4).
     * Accepts `projects: Project[]` prop and current `active: Stage | null`.
     * ProjectsPage feeds pipelineGridProjects (3 records); DevGridPage feeds
     * fixtures filter (10 records minus flagship + aggregate variants).
     *
     * Filter logic: when active === null, render all input projects.
     * When active is a Stage, filter by stage AND keep only full-internal
     * or grid-only presentations (flagship and aggregate variants are
     * structurally outside the grid scope — they live above/below).
     *
     * D-06 1-card layout: single column-of-3 alignment, leftmost cell.
     * D-07 2-card layout: 2 cells of 3-col grid. Tailwind grid-cols-3 auto-handles
     * fewer-than-3-children correctly without stretching cards (each cell
     * width is 1/3 of the grid track).
     *
     * Empty handling: returns null when filtered list is empty. Caller dispatches
     * EmptyStateZdano / BuduetsyaPointer at the page composition level.
     */

    import type { Project, Stage } from '../../../data/types';
    import { PipelineCard } from './PipelineCard';

    interface Props {
      projects: Project[];
      active: Stage | null;
    }

    export function PipelineGrid({ projects, active }: Props) {
      const filtered =
        active === null
          ? projects.filter(
              (p) => p.presentation === 'full-internal' || p.presentation === 'grid-only',
            )
          : projects.filter(
              (p) =>
                p.stage === active &&
                (p.presentation === 'full-internal' || p.presentation === 'grid-only'),
            );

      if (filtered.length === 0) return null;

      return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {filtered.map((p) => (
            <PipelineCard key={p.slug} project={p} />
          ))}
        </div>
      );
    }
    ```

    NOTES on PipelineGrid:
    - Pure component — no useState, no useEffect, no hooks. Pure render based on props.
    - Sorted order is the input array's order (caller pre-sorts via `pipelineGridProjects`).
    - D-08 «Будується» edge case: when active='buduetsya' and projects=pipelineGridProjects, `filtered` is empty (Lakeview is `flagship-external`, not in pipelineGridProjects). PipelineGrid returns null; ProjectsPage substitutes `<BuduetsyaPointer />`.
    - On /dev/grid (Wave 2 plan 04-09), fixture-07 (buduetsya + grid-only) WILL match → PipelineGrid renders 1 card. /dev/grid composition does NOT use BuduetsyaPointer (RESEARCH Pattern 4 «pointer is /projects-specific behavior»).
  </action>
  <verify>
    <automated>grep -nE "export function StageFilter" src/components/sections/projects/StageFilter.tsx && grep -nE "useSearchParams" src/components/sections/projects/StageFilter.tsx && grep -nE 'setParams.*replace: true' src/components/sections/projects/StageFilter.tsx && grep -nE "isStage" src/components/sections/projects/StageFilter.tsx && grep -nE "export function PipelineGrid" src/components/sections/projects/PipelineGrid.tsx && grep -nE "PipelineCard" src/components/sections/projects/PipelineGrid.tsx && ! grep -nE "transition-all" src/components/sections/projects/StageFilter.tsx && ! grep -nE "spring" src/components/sections/projects/StageFilter.tsx && npm run lint</automated>
  </verify>
  <done>
    - Both files created.
    - StageFilter imports `useSearchParams` from react-router-dom.
    - StageFilter contains `setParams(next, { replace: true })`.
    - StageFilter validates via `isStage(raw)` from `src/lib/stages.ts`.
    - StageFilter contains `aria-pressed` on chip buttons and `aria-label="Фільтр за стадіями"` on the group container.
    - StageFilter chip class string uses explicit property list `transition-[background-color,color,border-color]` (NO `transition-all`).
    - PipelineGrid is a pure renderer accepting `projects: Project[]` and `active: Stage | null`.
    - PipelineGrid filters by `presentation === 'full-internal' || 'grid-only'`.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Replace src/pages/ProjectsPage.tsx body with full /projects composition</name>
  <read_first>
    - src/pages/ProjectsPage.tsx (current Phase 1 stub — to be REPLACED)
    - src/data/projects.ts (`projects`, `flagship`, `pipelineGridProjects`, `aggregateProjects`)
    - src/data/types.ts (Stage type)
    - src/lib/stages.ts (STAGES, isStage)
    - src/content/projects.ts (projectsHeading, projectsSubtitle)
    - src/components/sections/projects/FlagshipCard.tsx (Wave 1 plan 04-03)
    - src/components/sections/projects/AggregateRow.tsx (Wave 1 plan 04-03)
    - src/components/sections/projects/StageFilter.tsx (just created)
    - src/components/sections/projects/PipelineGrid.tsx (just created)
    - src/components/sections/projects/EmptyStateZdano.tsx (just created)
    - src/components/sections/projects/BuduetsyaPointer.tsx (just created)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-01..D-12)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 5 (counts derivation) + §Recommended File Structure
  </read_first>
  <files>src/pages/ProjectsPage.tsx</files>
  <action>
    Fully REPLACE `src/pages/ProjectsPage.tsx` with the composed page body:

    ```tsx
    /**
     * @module pages/ProjectsPage
     *
     * HUB-01 + HUB-02 + HUB-03 + HUB-04 — /projects Portfolio Hub.
     *
     * Composition order (D-01..D-09):
     *   1. <h1>Проєкти</h1> + muted subtitle
     *   2. <FlagshipCard project={flagship} />  ← always visible (D-02)
     *   3. <StageFilter counts={counts} />       ← URL-state ?stage=... (D-10)
     *   4. Body dispatched on active stage:
     *        - null / u-rozrakhunku / u-pogodzhenni  → <PipelineGrid> + <AggregateRow>
     *          (AggregateRow renders only when Pipeline-4 is in the filtered scope)
     *        - buduetsya  → <BuduetsyaPointer /> (D-08)
     *        - zdano      → <EmptyStateZdano /> (D-09)
     *
     * URL state: useSearchParams reads ?stage=...; isStage() validation
     * coerces unknown values to null (= «Усі», D-11).
     *
     * Counts span ALL projects per D-03 (incl. Lakeview and Pipeline-4):
     *   { 'u-rozrakhunku': 2, 'u-pogodzhenni': 2, 'buduetsya': 1, 'zdano': 0 }
     *
     * Default export is preserved (App.tsx import unchanged).
     */

    import { useSearchParams } from 'react-router-dom';
    import { projects, flagship, pipelineGridProjects, aggregateProjects } from '../data/projects';
    import type { Stage } from '../data/types';
    import { STAGES, isStage } from '../lib/stages';
    import { projectsHeading, projectsSubtitle } from '../content/projects';
    import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
    import { StageFilter } from '../components/sections/projects/StageFilter';
    import { PipelineGrid } from '../components/sections/projects/PipelineGrid';
    import { AggregateRow } from '../components/sections/projects/AggregateRow';
    import { EmptyStateZdano } from '../components/sections/projects/EmptyStateZdano';
    import { BuduetsyaPointer } from '../components/sections/projects/BuduetsyaPointer';

    /** Counts span the FULL projects array (D-03). Computed once at module load. */
    const counts: Record<Stage, number> = STAGES.reduce(
      (acc, s) => {
        acc[s] = projects.filter((p) => p.stage === s).length;
        return acc;
      },
      {} as Record<Stage, number>,
    );

    export default function ProjectsPage() {
      const [params] = useSearchParams();
      const raw = params.get('stage');
      const active: Stage | null = isStage(raw) ? raw : null;

      const aggregate = aggregateProjects[0];

      // Body dispatch on active stage (D-05..D-09).
      let body: React.ReactNode;
      if (active === 'buduetsya') {
        body = <BuduetsyaPointer />;
      } else if (active === 'zdano') {
        body = <EmptyStateZdano />;
      } else {
        // null / u-rozrakhunku / u-pogodzhenni — show grid + maybe aggregate.
        // AggregateRow is hidden when filter excludes Pipeline-4 (its stage = u-rozrakhunku).
        const showAggregate =
          active === null || (aggregate !== undefined && aggregate.stage === active);
        body = (
          <>
            <PipelineGrid projects={pipelineGridProjects} active={active} />
            {showAggregate && <AggregateRow project={aggregate} />}
          </>
        );
      }

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mb-8 flex flex-col gap-2">
              <h1 className="font-bold text-6xl text-text">{projectsHeading}</h1>
              <p className="text-base text-text-muted">{projectsSubtitle}</p>
            </header>
            <FlagshipCard project={flagship} />
            <StageFilter counts={counts} />
            {body}
          </div>
        </section>
      );
    }
    ```

    NOTES on ProjectsPage:
    - DELETE the existing Phase 1 stub body entirely (the centered H1 + Mark img). Replace with the composed page above.
    - Default export retained (named `ProjectsPage`) — App.tsx route registration unchanged.
    - Counts computed module-level (memoization-equivalent for 5-element array; no React optimization needed).
    - The `showAggregate` logic implements D-04 + D-06 + D-07: aggregate visible when active is null OR matches Pipeline-4's stage (`u-rozrakhunku`).
      - active=null → showAggregate=true (aggregate visible) — matches D-05.
      - active='u-rozrakhunku' → aggregate.stage === 'u-rozrakhunku' === active → showAggregate=true → matches D-06 («Pipeline-4 also is u-rozrakhunku»).
      - active='u-pogodzhenni' → aggregate.stage !== active → showAggregate=false → matches D-07.
      - active='buduetsya' / 'zdano' → handled by separate branches above; aggregate logic skipped.
    - The H1 «Проєкти» (6 chars Cyrillic) inline is a content-boundary carve-out: it IS a structural label, mirrors Nav active state, and is below the 40-char threshold (Phase 3 D-29). Same exception as home «ВИГОДА» wordmark.
    - `text-6xl` ≈ 60px ≈ matches D-01's «~56px» recommendation.
  </action>
  <verify>
    <automated>grep -nE "export default function ProjectsPage" src/pages/ProjectsPage.tsx && grep -nE "<FlagshipCard project=\{flagship\}" src/pages/ProjectsPage.tsx && grep -nE "<StageFilter counts=\{counts\}" src/pages/ProjectsPage.tsx && grep -nE "<BuduetsyaPointer" src/pages/ProjectsPage.tsx && grep -nE "<EmptyStateZdano" src/pages/ProjectsPage.tsx && grep -nE "useSearchParams" src/pages/ProjectsPage.tsx && grep -nE "isStage" src/pages/ProjectsPage.tsx && ! grep -nE "import markUrl" src/pages/ProjectsPage.tsx && npm run build</automated>
  </verify>
  <done>
    - `src/pages/ProjectsPage.tsx` body fully replaced — Phase 1 stub gone (no `import markUrl`, no centered placeholder).
    - Page imports FlagshipCard, StageFilter, PipelineGrid, AggregateRow, EmptyStateZdano, BuduetsyaPointer.
    - Counts derived from raw `projects` array via `STAGES.reduce`.
    - Body dispatch covers all 4 stage cases + the «Усі» default.
    - Default export name is `ProjectsPage` (App.tsx import compatibility).
    - `npm run build` exits 0 (full chain green).
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (recommended in dev server):
      - `/#/projects` → flagship + chips «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)» + 3 pipeline cards + aggregate row visible.
      - `/#/projects?stage=u-rozrakhunku` → only Маєток grid card + aggregate visible.
      - `/#/projects?stage=u-pogodzhenni` → Етно Дім + NTEREST + aggregate hidden.
      - `/#/projects?stage=buduetsya` → grid hidden + «Див. ЖК Lakeview вище ↑».
      - `/#/projects?stage=zdano` → cube + «Наразі жоден ЖК не здано».
      - `/#/projects?stage=garbage` → defaults to «Усі» state (no chip active).
  </done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. **Files exist**: `ls src/components/sections/projects/{StageFilter,PipelineCard,PipelineGrid,EmptyStateZdano,BuduetsyaPointer}.tsx src/pages/ProjectsPage.tsx` shows all 6.

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).

4. **Brand invariants**:
   - `! grep -rnE "'/renders/|'/construction/" src/components/sections/projects/` returns clean.
   - `! grep -rnE "transition-all|spring" src/components/sections/projects/` returns clean.

5. **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Manual smoke checklist (`npm run dev` → open `/#/projects`):
   - Flagship card visible above filter chips
   - Chip counts: «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)»
   - Default state shows 3 pipeline cards + aggregate row
   - Click each chip — URL updates with `?stage=...`, browser back does NOT undo chip selection (replace mode)
   - `?stage=zdano` → cube + line; AggregateRow hidden
   - `?stage=buduetsya` → pointer line; AggregateRow hidden
   - `?stage=garbage` (manually edit URL) → defaults to «Усі»

6. **Bundle delta**: `vite build` reports new bundle size; expect +5-10 KB gzipped (StageFilter + PipelineGrid + 3 leaf components — small surface).
</verification>

<success_criteria>
- HUB-01 closed: StageFilter with 4 buckets + chip counts + URL state + «Здано (0)» empty-state with cube-marker.
- HUB-02 closed: Lakeview FlagshipCard above filter, aerial render LCP target, external CTA new-tab.
- HUB-03 closed: 3-in-row pipeline grid with stage labels (descriptive `project.stageLabel` field).
- HUB-04 closed: AggregateRow with cube marker (Pipeline-4 «+1 об'єкт у роботі...»).
- All ROADMAP §Phase 4 Success Criteria #1 (StageFilter + flagship + grid + aggregate + buduetsya pointer + zdano empty) end-to-end functional.
- ANI-03 hover NOT applied yet — Wave 3 plan 04-10 retroactive sweep.
- Reduced-motion suppression NOT applied yet — Wave 3 plan 04-10 ships D-35.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-05-SUMMARY.md` documenting:
- 6 file paths (5 new components + 1 page replacement)
- Decision IDs implemented (D-01..D-12)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta from Phase 3 baseline
- Manual smoke results: chip counts, URL state behavior, dispatch correctness for all 5 stage cases (null + 4 stages) + the unknown-value fallback
- Note for Wave 3 plan 04-10: PipelineCard.tsx `<article>` is the hover target; FlagshipCard.tsx `<article>` is also a hover target (cross-surface); home PortfolioOverview pipeline-grid `<article>` (lines 91-111 of that file, kept inline per plan 04-03) is the third hover target — D-30 explicitly says «Phase 4 wires both surfaces, retroactively touching the home component»
</output>
