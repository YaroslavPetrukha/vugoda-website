---
phase: 04-portfolio-construction-log-contact
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/projects/FlagshipCard.tsx
  - src/components/sections/projects/AggregateRow.tsx
  - src/components/sections/home/PortfolioOverview.tsx
autonomous: true
requirements: [HUB-02, HUB-04]
must_haves:
  truths:
    - "<FlagshipCard project={...}> renders the same JSX shape as the home flagship block, accepting a Project prop so home AND /projects can both consume it"
    - "<AggregateRow project={...}> extracted; same JSX as home aggregate row block"
    - "Home PortfolioOverview imports both extracted components with no visual regression"
    - "FlagshipCard renders ResponsivePicture with loading=eager and fetchPriority=high (LCP target on both home and /projects)"
    - "FlagshipCard renders nothing visual when `renders.length === 0` (no broken-image icons; defensive guard for /dev/grid HUB-04 SC#6 fixtures)"
  artifacts:
    - path: "src/components/sections/projects/FlagshipCard.tsx"
      provides: "Reusable flagship card consuming a Project prop"
      exports: ["FlagshipCard"]
      contains: "loading=\"eager\""
    - path: "src/components/sections/projects/AggregateRow.tsx"
      provides: "Reusable aggregate row with IsometricCube marker"
      exports: ["AggregateRow"]
      contains: "IsometricCube variant=\"single\""
  key_links:
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/components/sections/projects/FlagshipCard.tsx"
      via: "import { FlagshipCard }"
      pattern: "import \\{ FlagshipCard \\}"
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/components/sections/projects/AggregateRow.tsx"
      via: "import { AggregateRow }"
      pattern: "import \\{ AggregateRow \\}"
---

<objective>
Extract two near-duplicate JSX blocks from `src/components/sections/home/PortfolioOverview.tsx` into reusable section components under `src/components/sections/projects/`:

1. `<FlagshipCard project={Project}>` — extracted from PortfolioOverview lines 58-87 (D-02). Consumed by home AND `/projects` (HUB-02 LCP target on both).
2. `<AggregateRow project={Project | undefined}>` — extracted from PortfolioOverview lines 115-124 (HUB-04 cube + text). Consumed by home AND `/projects`.

Then refactor PortfolioOverview to import both. No visual regression on the home page.

Purpose: DRY-win for two surfaces (home + /projects) consuming the same flagship card; sets up Wave 2 plan 04-05 (ProjectsPage) and Wave 2 plan 04-09 (DevGridPage) to consume the same components without re-implementing.

Output: 2 new files + 1 file refactored. Bundle size unchanged (same JSX, redistributed).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/components/sections/home/PortfolioOverview.tsx
@src/data/projects.ts
@src/data/types.ts
@src/components/ui/ResponsivePicture.tsx
@src/components/brand/IsometricCube.tsx
@src/content/home.ts

<interfaces>
From src/data/types.ts — Project interface (the prop type).
From src/components/ui/ResponsivePicture.tsx — ResponsivePictureProps signature.
From src/components/brand/IsometricCube.tsx — variant/stroke/opacity props (variant='single' + stroke='#A7AFBC' + opacity=0.4 are the locked aggregate-marker values).
From src/content/home.ts — `flagshipExternalCta` is the existing external-CTA label.

Phase 4 ANI-03 hover (D-30..D-35) is NOT applied in this plan — that's Wave 3 plan 04-10's responsibility.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/sections/projects/FlagshipCard.tsx</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (lines 58-87 — flagship JSX block to extract verbatim)
    - src/data/types.ts (Project interface — confirm prop type)
    - src/content/home.ts (flagshipExternalCta export — consumed via import)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-02)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q9 (extraction recommendation, Pattern B LCP signature)
  </read_first>
  <files>src/components/sections/projects/FlagshipCard.tsx</files>
  <action>
    Create new file `src/components/sections/projects/FlagshipCard.tsx`:

    ```tsx
    /**
     * @module components/sections/projects/FlagshipCard
     *
     * HUB-02 — Flagship card extracted from home PortfolioOverview (D-02).
     * Consumed by home (PortfolioOverview), /projects (ProjectsPage), and
     * /dev/grid (DevGridPage). All three surfaces use the same JSX shape;
     * the only difference is surrounding chrome.
     *
     * LCP target on BOTH home and /projects (D-02). Caller MUST NOT change
     * loading/fetchPriority — they are baked in here for the cross-surface
     * LCP guarantee. The single 1920-AVIF preload link in index.html
     * (Phase 3 03-04) covers home; /projects gets the same cache hit.
     *
     * Phase 4 plan 04-10 (Wave 3, ANI-03) adds hover triple-effect classes
     * to this article. This plan ships extraction-only.
     *
     * IMPORT BOUNDARY: forwards path templates into ResponsivePicture which
     * composes URLs via lib/assetUrl. Never embeds the quoted, slash-
     * delimited tree-prefix patterns that scripts/check-brand.ts greps for.
     */

    import type { Project } from '../../../data/types';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';
    import { flagshipExternalCta } from '../../../content/home';

    interface Props {
      project: Project;
    }

    export function FlagshipCard({ project }: Props) {
      return (
        <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">
          {project.renders.length > 0 && (
            <ResponsivePicture
              src={`renders/${project.slug}/${project.renders[0]}`}
              alt={project.title}
              widths={[640, 1280, 1920]}
              sizes="(min-width: 1280px) 768px, 100vw"
              width={1280}
              height={720}
              loading="eager"
              fetchPriority="high"
              className="w-full h-auto rounded-lg"
            />
          )}
          <div className="flex flex-col justify-center gap-4 p-8">
            <span className="font-medium text-sm uppercase tracking-wider text-text-muted">
              {project.stageLabel}
            </span>
            <h3 className="font-bold text-3xl text-text">{project.title}</h3>
            {project.facts?.note && (
              <p className="text-base text-text-muted">{project.facts.note}</p>
            )}
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-flex w-fit items-center bg-accent px-6 py-3 text-base font-medium text-bg-black hover:brightness-110"
              >
                {flagshipExternalCta}
              </a>
            )}
          </div>
        </article>
      );
    }
    ```

    NOTES:
    - Replace `flagship.X` references with `project.X` (Project prop).
    - **Renders-length guard `{project.renders.length > 0 && <ResponsivePicture .../>}`** — production projects always have ≥1 render (Phase 2 invariant), so this is a no-op for HUB-02; it is a defensive shield for HUB-04 SC#6 fixtures (fixture-06 has `renders: []` → without the guard, ResponsivePicture emits broken srcset URLs and the browser shows broken-image icons on /dev/grid).
    - Wrap external CTA in `{project.externalUrl && (...)}` because /dev/grid synthetic flagship may have externalUrl set or unset.
    - Keep `target="_blank" rel="noopener"` (NOT `noreferrer`) per Phase 3 D-14.
    - Reuse `flagshipExternalCta` from existing `src/content/home.ts` — do NOT duplicate.
    - Doc-block describes IMPORT BOUNDARY policy WITHOUT containing the literal `'/renders/'` regex-bait substring.
    - Do NOT add ANI-03 hover classes here. Wave 3 plan 04-10 owns that.

    Per D-02 (locked).
  </action>
  <verify>
    <automated>grep -nE "export function FlagshipCard" src/components/sections/projects/FlagshipCard.tsx && grep -nE 'loading="eager"' src/components/sections/projects/FlagshipCard.tsx && grep -nE 'fetchPriority="high"' src/components/sections/projects/FlagshipCard.tsx && grep -nE "project: Project" src/components/sections/projects/FlagshipCard.tsx && grep -nE "project\.renders\.length > 0" src/components/sections/projects/FlagshipCard.tsx && ! grep -nE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/projects/FlagshipCard.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at `src/components/sections/projects/FlagshipCard.tsx`.
    - Exports `FlagshipCard` function with `{ project: Project }` prop.
    - Contains `loading="eager"` AND `fetchPriority="high"` on the ResponsivePicture.
    - Contains template literal `` `renders/${project.slug}/${project.renders[0]}` `` (no leading slash, no quoted-prefix).
    - Contains the renders-length guard: `{project.renders.length > 0 && (` wrapping the ResponsivePicture.
    - Contains conditional render of external CTA: `{project.externalUrl && (`.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create src/components/sections/projects/AggregateRow.tsx</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (lines 114-125 — aggregate JSX to extract verbatim)
    - src/components/brand/IsometricCube.tsx (props confirmation — variant='single' + stroke='#A7AFBC' + opacity=0.4 inviolable per Phase 3 D-04)
    - src/data/types.ts (Project — `aggregateText?: string` field consumed)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (HUB-04 + Phase 3 D-16 cube-ladder)
  </read_first>
  <files>src/components/sections/projects/AggregateRow.tsx</files>
  <action>
    Create new file `src/components/sections/projects/AggregateRow.tsx`:

    ```tsx
    /**
     * @module components/sections/projects/AggregateRow
     *
     * HUB-04 — Pipeline-4 aggregate row with single-cube state marker.
     * Extracted from home PortfolioOverview (lines 114-125). Consumed by
     * home, /projects, and /dev/grid.
     *
     * Renders only when project prop is defined (aggregateProjects[0] in
     * production, or fixtures.find(p => p.presentation === 'aggregate')
     * on /dev/grid). Filter logic lives in the consumer.
     *
     * IsometricCube variant='single' + stroke='#A7AFBC' + opacity=0.4 are
     * the locked aggregate-marker values per Phase 3 D-04 brand-primitive
     * immutability. Cube-ladder semantics (CONCEPT §5.2): single = aggregate.
     */

    import type { Project } from '../../../data/types';
    import { IsometricCube } from '../../brand/IsometricCube';

    interface Props {
      project: Project | undefined;
    }

    export function AggregateRow({ project }: Props) {
      if (!project) return null;
      return (
        <div className="mt-12 flex items-center gap-6 border-t border-bg-surface pt-12">
          <IsometricCube
            variant="single"
            stroke="#A7AFBC"
            opacity={0.4}
            className="h-12 w-12 flex-shrink-0"
          />
          <p className="text-base text-text">{project.aggregateText}</p>
        </div>
      );
    }
    ```

    NOTES:
    - `<IsometricCube variant="single"` opening tag must keep `variant="single"` on the line containing `<IsometricCube` (Phase 3 lesson — verify grep is single-line). Phase 3's PortfolioOverview line 117 splits across lines — when you extract here, keep it on one line OR ensure the regex `IsometricCube variant="single"` matches via your formatter. Recommended: write as multiple lines with `variant="single"` on the opening tag line.
    - Wait — re-read Phase 3 lesson: the verify grep was `<IsometricCube variant="single"` single-line. Phase 3 PortfolioOverview line 117 has `<IsometricCube variant="single"` on the SAME line — verified. Mirror that pattern.
    - Stroke literal `#A7AFBC` is in PALETTE_WHITELIST.
    - `aggregateText` is a plain string render — no Ukrainian JSX literal in this file. Content lives in `src/data/projects.ts`.

    Per HUB-04 + Phase 3 D-16.
  </action>
  <verify>
    <automated>grep -nE "export function AggregateRow" src/components/sections/projects/AggregateRow.tsx && grep -nE 'IsometricCube variant="single"' src/components/sections/projects/AggregateRow.tsx && grep -nE 'stroke="#A7AFBC"' src/components/sections/projects/AggregateRow.tsx && grep -nE 'opacity=\{0.4\}' src/components/sections/projects/AggregateRow.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at `src/components/sections/projects/AggregateRow.tsx`.
    - Exports `AggregateRow` function with `{ project: Project | undefined }` prop.
    - Contains `<IsometricCube variant="single"` (single-line opening tag, exact substring matches grep).
    - Contains `stroke="#A7AFBC"` and `opacity={0.4}`.
    - Contains the early-return `if (!project) return null;` guard.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Refactor src/components/sections/home/PortfolioOverview.tsx to consume extracted components</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (full file — current state, the file you're editing)
    - src/components/sections/projects/FlagshipCard.tsx (just created — verify export name + prop signature)
    - src/components/sections/projects/AggregateRow.tsx (just created — verify export name + prop signature)
  </read_first>
  <files>src/components/sections/home/PortfolioOverview.tsx</files>
  <action>
    Edit `src/components/sections/home/PortfolioOverview.tsx`:

    1. **Add imports** at the top (after the existing imports, before the function):
       ```tsx
       import { FlagshipCard } from '../projects/FlagshipCard';
       import { AggregateRow } from '../projects/AggregateRow';
       ```

    2. **Remove now-unused imports** (after extraction, the home file no longer needs them):
       - Remove `import { ResponsivePicture } from '../../ui/ResponsivePicture';` IF and ONLY IF the pipeline grid loop also stops using it. **Pipeline grid still uses it (lines 91-111 — the .map over pipelineGridProjects).** So KEEP the ResponsivePicture import.
       - Remove `import { IsometricCube } from '../../brand/IsometricCube';` — no other consumer in this file after extraction.
       - Remove `flagshipExternalCta` from the named imports of `'../../../content/home'` — only the FlagshipCard uses it now. KEEP `portfolioHeading` and `portfolioSubtitle` (used by section header).

    3. **Replace the flagship JSX block (lines 57-87)** with:
       ```tsx
       {/* Flagship card — extracted to <FlagshipCard> for cross-surface reuse (D-02) */}
       <FlagshipCard project={flagship} />
       ```

    4. **Replace the aggregate row JSX block (lines 114-124)** with:
       ```tsx
       {/* Aggregate row — extracted to <AggregateRow> for cross-surface reuse (HUB-04) */}
       <AggregateRow project={aggregate} />
       ```

    5. **Update the module-level doc-block** (lines 1-34) to reflect the extraction. Replace the existing IMPORT BOUNDARY paragraph with one that no longer claims to embed the render-tree path (since FlagshipCard now owns that). Recommended replacement for the bottom paragraph (lines 30-33):
       ```
       * Extracted (D-02 + HUB-04 — Phase 4 plan 04-03): the flagship card and
       * aggregate-row shapes were lifted out to
       * src/components/sections/projects/{FlagshipCard,AggregateRow}.tsx so
       * /projects (Phase 4) and /dev/grid (Phase 4) reuse them verbatim.
       ```

    6. **DO NOT touch the pipeline-grid block (lines 90-112)** — it stays inline. (Wave 3 plan 04-10 will add ANI-03 hover classes there.)

    Final shape of the function body (after edits):
    ```tsx
    export function PortfolioOverview() {
      const aggregate = aggregateProjects[0];
      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mb-12 flex flex-col gap-2">
              <h2 className="font-bold text-4xl text-text">{portfolioHeading}</h2>
              <p className="text-base text-text-muted">{portfolioSubtitle}</p>
            </header>

            <FlagshipCard project={flagship} />

            {/* Pipeline grid — stays inline; Wave 3 plan 04-10 adds ANI-03 hover here. */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {pipelineGridProjects.map((project) => (
                <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface">
                  <ResponsivePicture
                    src={`renders/${project.slug}/${project.renders[0]}`}
                    alt={project.title}
                    widths={[640, 1280]}
                    sizes="(min-width: 1280px) 400px, 100vw"
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
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
              ))}
            </div>

            <AggregateRow project={aggregate} />
          </div>
        </section>
      );
    }
    ```

    NOTES:
    - The `flagship` and `pipelineGridProjects` and `aggregateProjects` named imports from `'../../../data/projects'` stay — `flagship` is now passed as a prop to FlagshipCard.
    - Visual contract MUST be byte-equivalent to current state. Test by comparing rendered HomePage in dev server before/after.
    - Doc-block must NOT contain literal `'/renders/'` substring (importBoundaries grep — Phase 3 lesson, 8 prior occurrences).
  </action>
  <verify>
    <automated>grep -nE "import \{ FlagshipCard \}" src/components/sections/home/PortfolioOverview.tsx && grep -nE "import \{ AggregateRow \}" src/components/sections/home/PortfolioOverview.tsx && grep -nE "<FlagshipCard project=\{flagship\}" src/components/sections/home/PortfolioOverview.tsx && grep -nE "<AggregateRow project=\{aggregate\}" src/components/sections/home/PortfolioOverview.tsx && ! grep -nE "import \{ IsometricCube \}" src/components/sections/home/PortfolioOverview.tsx && ! grep -nE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/home/PortfolioOverview.tsx && npm run build</automated>
  </verify>
  <done>
    - PortfolioOverview imports FlagshipCard and AggregateRow.
    - PortfolioOverview body contains `<FlagshipCard project={flagship} />` and `<AggregateRow project={aggregate} />` (no inline JSX block for either).
    - PortfolioOverview no longer imports `IsometricCube` (now only consumed via AggregateRow).
    - PortfolioOverview no longer imports `flagshipExternalCta` from content/home (now only consumed via FlagshipCard).
    - Pipeline grid (lines for the .map) is unchanged — still inline.
    - `npm run build` exits 0 (full chain — prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).
    - Bundle size: home gzipped JS within ±2 KB of pre-edit baseline (131.60 kB) — no behavioral change, just file split. Acceptable drift.
  </done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. **Files exist**:
   - `src/components/sections/projects/FlagshipCard.tsx` (new)
   - `src/components/sections/projects/AggregateRow.tsx` (new)
   - `src/components/sections/home/PortfolioOverview.tsx` (refactored)

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0.

4. **Brand invariants**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.

5. **Manual visual verify (recommended)**: `npm run dev` → open `/` → confirm home flagship + pipeline grid + aggregate row render identically to pre-edit state. No layout shift, no missing CTA, no broken image src.

6. **Bundle size sanity**: `npm run build` reports gzipped JS within ±2 KB of Phase 3 baseline 131.60 kB. (Tree-shaking + identical JSX = stable bundle.)
</verification>

<success_criteria>
- HUB-02 partial: `<FlagshipCard>` ready for /projects consumption (Wave 2 plan 04-05) and /dev/grid (plan 04-09). LCP wiring (eager + fetchPriority) preserved.
- HUB-04 partial: `<AggregateRow>` ready for /projects + /dev/grid consumption.
- Home page visual regression: zero. Same JSX, redistributed across files.
- ANI-03 hover application deferred to Wave 3 plan 04-10 (which retroactively touches FlagshipCard + the pipeline grid kept inline here).
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-03-SUMMARY.md` documenting:
- 3 file paths (2 created, 1 refactored)
- Decision IDs implemented (D-02, HUB-02 + HUB-04 partial)
- Any rule-3 doc-block self-consistency fixes (pre-screen `<action>` doc-blocks against `<verify>` regexes)
- `npm run lint` and `npm run build` exit codes
- Bundle delta (expected ±0 — same JSX redistributed)
- Note for Wave 2 plan 04-05 (ProjectsPage): import these as `import { FlagshipCard } from '../components/sections/projects/FlagshipCard'`
- Note for Wave 3 plan 04-10 (ANI-03 sweep): the `<article>` in FlagshipCard.tsx + the inline pipeline grid `<article>` in PortfolioOverview.tsx are the two consumers of the home/projects hover triple-effect class string
</output>
