---
phase: 03-brand-primitives-home-page
plan: 5
type: execute
wave: 2
depends_on: ["03-01", "03-02", "03-03"]
files_modified:
  - src/components/sections/home/BrandEssence.tsx
  - src/components/sections/home/PortfolioOverview.tsx
autonomous: true
requirements: [HOME-02, HOME-03, VIS-03]
requirements_addressed: [HOME-02, HOME-03]

must_haves:
  truths:
    - "BrandEssence renders 4 cards from `brandValues` (системність / доцільність / надійність / довгострокова цінність) — NO inline copy literals; numbered 01-04 (HOME-02, D-29)"
    - "PortfolioOverview renders Lakeview flagship card (full-width, aerial.jpg via ResponsivePicture eager + fetchPriority='high', explicit width=1280 height=720) + 3 pipeline cards in 3-in-row grid + Pipeline-4 aggregate row with `<IsometricCube variant='single'>` marker (HOME-03, D-13..D-16)"
    - "PortfolioOverview reads from `data/projects.ts` derived views (`flagship`, `pipelineGridProjects`, `aggregateProjects`) — NEVER filters `projects[]` directly"
    - "Flagship card external CTA opens Lakeview site in new tab via `target='_blank' rel='noopener'` to `flagship.externalUrl` (D-14)"
    - "PortfolioOverview heading «Проєкти» + subtitle «1 в активній фазі будівництва · 4 у pipeline · 0 здано» from `home.ts` content imports (D-13)"
    - "No raw `/renders/` literals in either component (Phase 2 D-30/D-33 invariant — `<ResponsivePicture src=...>` consumes a path string that the component itself transforms via `assetUrl`)"
  artifacts:
    - path: "src/components/sections/home/BrandEssence.tsx"
      provides: "HOME-02 — 4 brand-value cards"
      exports: ["BrandEssence"]
      min_lines: 35
    - path: "src/components/sections/home/PortfolioOverview.tsx"
      provides: "HOME-03 — flagship + pipeline grid + aggregate row"
      exports: ["PortfolioOverview"]
      min_lines: 80
  key_links:
    - from: "src/components/sections/home/BrandEssence.tsx"
      to: "src/content/values.ts"
      via: "import { brandValues } from '../../../content/values'"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/values'"
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/data/projects.ts"
      via: "import { flagship, pipelineGridProjects, aggregateProjects }"
      pattern: "from '\\.\\./\\.\\./\\.\\./data/projects'"
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/components/ui/ResponsivePicture.tsx"
      via: "<ResponsivePicture src={...} loading='eager'/'lazy'>"
      pattern: "<ResponsivePicture"
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/components/brand/IsometricCube.tsx"
      via: "<IsometricCube variant='single'> in aggregate row (D-16)"
      pattern: "<IsometricCube variant=\"single\""
    - from: "src/components/sections/home/PortfolioOverview.tsx"
      to: "src/content/home.ts"
      via: "portfolioHeading + portfolioSubtitle + flagshipExternalCta imports"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/home'"
---

<objective>
Ship the two above-fold home sections that follow Hero — `BrandEssence` (4 cards from `brandValues`) and `PortfolioOverview` (Lakeview flagship + 3 pipeline cards + Pipeline-4 aggregate row). Both consume Phase 2 data/content modules verbatim and use Wave-2 `<ResponsivePicture>` for all images.

Purpose: HOME-02 and HOME-03 close the brand-essence + portfolio-honesty story Phase 3 must tell. PortfolioOverview is also where the LCP image (`aerial.jpg`) lives — its `<ResponsivePicture loading='eager' fetchPriority='high'>` is what the index.html preload from Plan 03-04 races to deliver.

Output:
1. `src/components/sections/home/BrandEssence.tsx` (~50 lines) — 2×2 grid of numbered value cards
2. `src/components/sections/home/PortfolioOverview.tsx` (~110 lines) — flagship + 3-card grid + aggregate row with IsometricCube marker
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@brand-system.md

<interfaces>
Phase 2 data exports (`src/data/projects.ts`) — Phase 3 consumes verbatim:

```ts
export const flagship: Project;            // Lakeview record (presentation: 'flagship-external'). Has: title, stageLabel, location, externalUrl, renders[0]='aerial.jpg', facts.note='Здача у 2027'
export const pipelineGridProjects: Project[]; // [etno-dim, maietok-vynnykivskyi, nterest], length 3, sorted by order ascending
export const aggregateProjects: Project[];  // [pipeline-4], length 1. aggregateText is the verbatim Pipeline-4 line
```

`Project` interface (`src/data/types.ts:27-58`):
```ts
export interface Project {
  slug: string; title: string; stageLabel: string; stage: Stage;
  presentation: Presentation;
  location?: string; externalUrl?: string; renders: string[];
  facts?: { sections?: number; floors?: string; area?: string; deadline?: string; note?: string };
  whatsHappening?: string; aggregateText?: string;
  order: number;
}
```

Source filenames (Phase 2 verified):
- flagship.renders[0] = 'aerial.jpg'
- etno-dim.renders[0] = '43615.jpg.webp' (already WebP source — optimizer re-encodes for consistency)
- maietok-vynnykivskyi.renders[0] = '44463.jpg.webp'
- nterest.renders[0] = '2213.jpg.webp'
- pipeline-4.renders = [] (empty — no visual)

Phase 2 content (`src/content/values.ts:15-32`):
```ts
export const brandValues: BrandValue[] = [
  { title: 'Системність',         body: '…150-200 chars…' },
  { title: 'Доцільність',          body: '…' },
  { title: 'Надійність',           body: '…' },
  { title: 'Довгострокова цінність', body: '…' },
];
```
`BrandValue` shape: `{ title: string; body: string }` — no id/index/icon fields.

Wave 1 dep — `src/content/home.ts` (Plan 03-02):
```ts
export const portfolioHeading = 'Проєкти';
export const portfolioSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';
export const flagshipExternalCta = 'Перейти на сайт проекту ↗';
```

Wave 2 dep — `src/components/ui/ResponsivePicture.tsx` (Plan 03-03):
```tsx
export interface ResponsivePictureProps {
  src: string;                    // e.g. 'renders/lakeview/aerial.jpg'
  alt: string;
  widths?: number[];              // default [640, 1280, 1920]
  sizes?: string;                 // default '100vw'
  loading?: 'eager' | 'lazy';     // default 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;                 // explicit intrinsic width (CLS guard)
  height?: number;                // explicit intrinsic height (CLS guard)
  className?: string;
}
```

Wave 1 dep — `src/components/brand/IsometricCube.tsx` (Plan 03-01):
```tsx
export interface IsometricCubeProps {
  variant: 'single' | 'group' | 'grid';
  stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D';
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}
```

Tailwind v4 utilities (from @theme block):
- `bg-bg`, `bg-bg-surface`, `bg-bg-black`, `bg-accent`
- `text-text`, `text-text-muted`
- `font-sans` (Montserrat)

Phase 5 boundary: NO inline `transition={{}}` — these sections are static in Phase 3 (scroll reveal + card hover are Phases 4/5).
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/components/sections/home/BrandEssence.tsx</name>
  <files>src/components/sections/home/BrandEssence.tsx</files>
  <read_first>
    - src/content/values.ts (brandValues data shape — verify 4 entries with title + body strings)
    - src/data/types.ts (BrandValue type — `{ title: string; body: string }`)
    - 03-CONTEXT.md "Remaining home-page sections" → BrandEssence subsection (D-11 says no cube decoration, no lucide icons, layout 4-in-row OR 2×2)
    - 03-RESEARCH.md lines 1340 (Open Question 1 — recommendation: 2×2 with numbered «01–04»)
    - brand-system.md §3 (text-text-muted #A7AFBC only ≥14pt — section labels use it)
  </read_first>
  <behavior>
    - Test 1: file exports `BrandEssence` named function with no props
    - Test 2: imports `brandValues` from `'../../../content/values'`
    - Test 3: file does NOT contain string literals «Системність» / «Доцільність» / «Надійність» / «Довгострокова» (data comes from import, per HOME-02 verification map)
    - Test 4: renders `<section>` with classes `bg-bg py-24` (or `--spacing-rhythm-xl` equivalent)
    - Test 5: section uses `<div className="mx-auto max-w-7xl px-6">` container (D-24)
    - Test 6: maps over `brandValues` rendering one card per item with `key={value.title}`
    - Test 7: each card includes a numbered prefix («01» / «02» / «03» / «04») derived from `index + 1` (zero-padded with `String(i+1).padStart(2,'0')`)
    - Test 8: card title uses `text-text` (primary color), body uses `text-text-muted` (≥14pt — body size matches that requirement)
    - Test 9: layout class uses Tailwind grid `grid grid-cols-2 gap-12` (or similar 2×2 layout per recommendation)
    - Test 10: NO `<lucide-react>` icons (D-11), NO `<IsometricCube>` (D-11)
    - Test 11: NO `transition={{}}` literals
  </behavior>
  <action>
    Step A — Verify directory exists. (`src/components/sections/home/` was created in Plan 03-04 Task 1; this plan adds files inside it.)

    Step B — CREATE file `src/components/sections/home/BrandEssence.tsx`:

    ```
    /**
     * @module components/sections/home/BrandEssence
     *
     * HOME-02 — 4 brand-value cards (системність, доцільність, надійність,
     * довгострокова цінність). Reads from src/content/values.ts; never inlines
     * the Ukrainian copy (Phase 2 D-20 / Phase 3 D-29).
     *
     * Layout per Phase 3 RESEARCH Open Question 1: 2×2 numbered (01–04).
     * NO lucide-react icons (brand-system.md §7), NO <IsometricCube> per D-11.
     * Body uses text-text-muted — 16-18px body size keeps it within ≥14pt
     * AA-readable threshold (brand-system.md §3).
     */

    import { brandValues } from '../../../content/values';

    export function BrandEssence() {
      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-16">
              {brandValues.map((value, i) => {
                const num = String(i + 1).padStart(2, '0');
                return (
                  <article key={value.title} className="flex flex-col gap-4">
                    <span className="font-medium text-sm text-text-muted">
                      {num}
                    </span>
                    <h3 className="font-bold text-2xl text-text">
                      {value.title}
                    </h3>
                    <p className="text-base leading-relaxed text-text-muted">
                      {value.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - The `text-base` (16px default) on the body keeps `text-text-muted` (#A7AFBC) above the 14pt threshold for AA contrast (brand-system §3). DO NOT use `text-sm` (14px ≈ 10.5pt) on muted body — would fail AA.
    - The numbered span uses `font-medium text-sm text-text-muted` — `text-sm` here is acceptable on the prefix because it's a label, not body; visually subordinate.
    - The `gap-x-12 gap-y-16` produces 48px horizontal × 64px vertical between cards (matches `--spacing-rhythm-lg` and `--spacing-rhythm-xl`).
    - Container `max-w-7xl px-6` matches Hero/Nav/Footer (D-24).
  </action>
  <verify>
    <automated>test -f src/components/sections/home/BrandEssence.tsx &amp;&amp; grep -cE "from '../../../content/values'" src/components/sections/home/BrandEssence.tsx &amp;&amp; grep -cE "brandValues\.map" src/components/sections/home/BrandEssence.tsx &amp;&amp; ! grep -nE "Системність|Доцільність|Надійність|Довгострокова" src/components/sections/home/BrandEssence.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/BrandEssence.tsx &amp;&amp; ! grep -nE "lucide-react|IsometricCube" src/components/sections/home/BrandEssence.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    BrandEssence.tsx exists, imports `brandValues`, renders 4 numbered cards from data (zero inline Ukrainian literals from values.ts). No lucide icons. No IsometricCube. No inline transition. `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/components/sections/home/PortfolioOverview.tsx</name>
  <files>src/components/sections/home/PortfolioOverview.tsx</files>
  <read_first>
    - src/data/projects.ts (flagship, pipelineGridProjects, aggregateProjects derived views)
    - src/data/types.ts (Project interface)
    - src/components/ui/ResponsivePicture.tsx (Wave 2 dep — props signature, including `width`/`height` props)
    - src/components/brand/IsometricCube.tsx (Wave 1 dep — `<IsometricCube variant='single'>`)
    - src/content/home.ts (portfolioHeading, portfolioSubtitle, flagshipExternalCta)
    - 03-CONTEXT.md D-13 (heading + subtitle), D-14 (flagship card layout), D-15 (pipeline grid 3-in-row), D-16 (aggregate row IsometricCube), D-24 (max-w-7xl)
    - 03-RESEARCH.md lines 519-553 (three call-site recipes for ResponsivePicture: flagship eager, pipeline lazy, aggregate text-only)
    - 03-RESEARCH.md lines 1255-1258 (Pitfall 11: forgotten loading="eager" on flagship → LCP regression — explicitly pass eager + fetchPriority="high")
    - 03-RESEARCH.md lines 1339 (Open Question 8 — recommendation: side-by-side flagship layout, image left 60%, text right 40%)
    - 03-VALIDATION.md per-task verification map row "HOME-03" (positive grep on data/projects + ResponsivePicture imports)
  </read_first>
  <behavior>
    - Test 1: file exports `PortfolioOverview` named function
    - Test 2: imports `flagship`, `pipelineGridProjects`, `aggregateProjects` from `'../../../data/projects'`
    - Test 3: imports `ResponsivePicture` from `'../../ui/ResponsivePicture'`
    - Test 4: imports `IsometricCube` from `'../../brand/IsometricCube'`
    - Test 5: imports `portfolioHeading`, `portfolioSubtitle`, `flagshipExternalCta` from `'../../../content/home'`
    - Test 6: section heading is `<h2>{portfolioHeading}</h2>` (variable, not literal)
    - Test 7: subtitle uses `{portfolioSubtitle}` and Tailwind class `text-text-muted` (≥14pt body, brand-system §3)
    - Test 8: flagship card renders `<ResponsivePicture src={`renders/${flagship.slug}/${flagship.renders[0]}`} alt={flagship.title} widths={[640, 1280, 1920]} sizes="(min-width: 1280px) 768px, 100vw" width={1280} height={720} loading="eager" fetchPriority="high" className="w-full h-auto rounded-lg">` — eager + fetchPriority='high' for LCP (D-18 + Pitfall 11) AND explicit `width={1280} height={720}` (16:9, matches the picked srcset width and the 60% × 1280 cell calculation — closes checker Blocker 4)
    - Test 9: flagship card external CTA renders `<a href={flagship.externalUrl} target="_blank" rel="noopener">{flagshipExternalCta}</a>` (D-14)
    - Test 10: pipeline grid is `<div className="grid grid-cols-3 gap-6">` mapping over `pipelineGridProjects` rendering `<ResponsivePicture loading="lazy" widths={[640, 1280]} sizes="(min-width: 1280px) 400px, 100vw">` for each card cover
    - Test 11: each pipeline card key is `project.slug`, displays `project.title`, `project.stageLabel`, `project.location`
    - Test 12: aggregate row renders `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4} className="..." />` + `<p>{aggregateProjects[0].aggregateText}</p>` (D-16)
    - Test 13: file does NOT contain raw `/renders/` string literals (passes check-brand importBoundaries)
    - Test 14: file does NOT contain `transition={{`
    - Test 15: file does NOT contain string literals «Lakeview», «Етно Дім», «Маєток», «NTEREST» — all titles come from `project.title`
  </behavior>
  <action>
    CREATE file `src/components/sections/home/PortfolioOverview.tsx`:

    ```
    /**
     * @module components/sections/home/PortfolioOverview
     *
     * HOME-03 — Lakeview flagship card (full-width hero, aerial.jpg as LCP)
     * + 3-in-row pipeline grid (Etno Dim / Maietok / NTEREST)
     * + Pipeline-4 aggregate row with <IsometricCube variant='single'> marker.
     *
     * Reads from data/projects derived views (flagship/pipelineGridProjects/
     * aggregateProjects) — never filters projects[] directly (Phase 2 D-04).
     * Uses <ResponsivePicture> for all images so the optimizer pipeline + AVIF
     * fallback chain is consistent with Hero.
     *
     * LCP: flagship.aerial.jpg renders eager + fetchPriority="high"
     * (Phase 3 D-18 + Pitfall 11 — default lazy is wrong for the LCP image).
     *
     * Flagship intrinsic dimensions: 1280×720 (16:9). The flagship cell at
     * lg breakpoint resolves to 60% × 1200px container ≈ 720px wide; the
     * picked 1280w srcset entry covers it with retina headroom. Explicit
     * width/height attrs prevent CLS and document the 16:9 contract for
     * the AVIF/WebP/JPG triple (per checker Blocker 4 fix).
     *
     * Layout (D-14 + RESEARCH Open Question 8): flagship side-by-side
     * (image left 60%, text right 40% at ≥1280px). Pipeline cards: 3 columns,
     * equal width. Aggregate row: cube left + text right, full-width strip.
     *
     * NO inline transition={{}} — Phase 3 ships static; hover comes in Phase 4.
     */

    import { flagship, pipelineGridProjects, aggregateProjects } from '../../../data/projects';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';
    import { IsometricCube } from '../../brand/IsometricCube';
    import {
      portfolioHeading,
      portfolioSubtitle,
      flagshipExternalCta,
    } from '../../../content/home';

    export function PortfolioOverview() {
      const aggregate = aggregateProjects[0];

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section heading + honest 0/1/4 subtitle (D-13) */}
            <header className="mb-12 flex flex-col gap-2">
              <h2 className="font-bold text-4xl text-text">{portfolioHeading}</h2>
              <p className="text-base text-text-muted">{portfolioSubtitle}</p>
            </header>

            {/* Flagship card — Lakeview, full-width, side-by-side at ≥1280px (D-14) */}
            <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">
              <ResponsivePicture
                src={`renders/${flagship.slug}/${flagship.renders[0]}`}
                alt={flagship.title}
                widths={[640, 1280, 1920]}
                sizes="(min-width: 1280px) 768px, 100vw"
                width={1280}
                height={720}
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto rounded-lg"
              />
              <div className="flex flex-col justify-center gap-4 p-8">
                <span className="font-medium text-sm uppercase tracking-wider text-text-muted">
                  {flagship.stageLabel}
                </span>
                <h3 className="font-bold text-3xl text-text">{flagship.title}</h3>
                {flagship.facts?.note && (
                  <p className="text-base text-text-muted">{flagship.facts.note}</p>
                )}
                <a
                  href={flagship.externalUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-flex w-fit items-center bg-accent px-6 py-3 text-base font-medium text-bg-black hover:brightness-110"
                >
                  {flagshipExternalCta}
                </a>
              </div>
            </article>

            {/* Pipeline grid — 3 cards in row at ≥1280px (D-15). Static in Phase 3; hover in Phase 4. */}
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

            {/* Aggregate row — Pipeline-4 (D-16): IsometricCube marker + aggregateText, full-width strip */}
            {aggregate && (
              <div className="mt-12 flex items-center gap-6 border-t border-bg-surface pt-12">
                <IsometricCube
                  variant="single"
                  stroke="#A7AFBC"
                  opacity={0.4}
                  className="h-12 w-12 flex-shrink-0"
                />
                <p className="text-base text-text">{aggregate.aggregateText}</p>
              </div>
            )}
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - **LCP-critical:** the flagship `<ResponsivePicture>` MUST pass `loading="eager"` and `fetchPriority="high"` (Pitfall 11). The index.html preload starts the fetch at HTML-parse time; this `<picture>` consumes it at React-render time.
    - **Explicit width/height (Blocker 4 fix):** `width={1280}` and `height={720}` MUST be passed. The 16:9 ratio matches the AVIF/WebP/JPG aerial source; the 1280 width matches the srcset entry the browser picks for the 60%-of-1200px cell. Explicit intrinsic dims prevent CLS at hydration and document the contract on-screen.
    - The flagship `sizes` is `(min-width: 1280px) 768px, 100vw` because at 1280-container width, 3fr/(3fr+2fr) ≈ 60% × 1280 ≈ 768px.
    - Pipeline-card aspect-ratio `aspect-[4/3]` keeps mixed-resolution renders (some `.jpg`, some `.jpg.webp`, some `.png.webp`) visually consistent.
    - The aggregate row uses `border-t border-bg-surface` to visually separate from the grid without adding card-like visual weight (D-16: «reads as summary row, not as another project card»).
    - No `transition={{}}` — Phase 4 owns card hover (ANI-03), Phase 5 owns scroll reveal (ANI-02).
    - The `<ResponsivePicture src={`renders/${project.slug}/${...}`}>` syntax is template-literal interpolation — the literal substring `renders/` here is a relative path under `public/`, NOT an absolute hardcoded path. ResponsivePicture's internal `assetUrl()` prepends BASE_URL. Phase 2 D-30 / D-33 importBoundaries check uses regex `'/renders/|'/construction/|"/renders/|"/construction/` — note the LEADING SLASH inside the quotes — which does NOT match `renders/` without a slash. This component therefore passes the boundary check.
  </action>
  <verify>
    <automated>test -f src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE "from '../../../data/projects'" src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE "<ResponsivePicture" src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE 'loading="eager"' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE 'fetchPriority="high"' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -nE 'width=\{1280\}.*height=\{720\}' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE '<IsometricCube variant="single"' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE 'target="_blank"' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; grep -cE 'rel="noopener"' src/components/sections/home/PortfolioOverview.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/PortfolioOverview.tsx &amp;&amp; ! grep -nE "'/renders/|\"/renders/" src/components/sections/home/PortfolioOverview.tsx &amp;&amp; npm run lint &amp;&amp; tsx scripts/check-brand.ts</automated>
  </verify>
  <done>
    PortfolioOverview.tsx exists, imports flagship + pipelineGridProjects + aggregateProjects + ResponsivePicture + IsometricCube + content. Flagship `<ResponsivePicture>` passes `loading="eager"`, `fetchPriority="high"`, AND explicit `width={1280} height={720}` (16:9 — closes checker Blocker 4; CLS-safe; ratio-correct against the AVIF/WebP/JPG triple). External CTA opens in new tab with `noopener`. Aggregate row uses `<IsometricCube variant="single">`. No raw `/renders/` literals. Hex literal `#A7AFBC` in the IsometricCube `stroke` JSX attribute is canonical brand hex — `scripts/check-brand.ts paletteWhitelist` regex `#[0-9A-Fa-f]{6}` catches it; the whitelist accepts since it's a canonical-6 entry. Verify post-edit: `tsx scripts/check-brand.ts` exits 0. `npm run lint` exits 0. `tsx scripts/check-brand.ts` 4/4 PASS.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0
2. `npm run build` exits 0 — full pipeline including check-brand 4/4 PASS
3. `tsx scripts/check-brand.ts` PASS specifically:
   - `denylistTerms` — no Pictorial/Rubikon mentions in either file
   - `paletteWhitelist` — only `#A7AFBC` literal in PortfolioOverview (passing on the IsometricCube stroke prop), all other colors via Tailwind classes
   - `importBoundaries` — components do not contain raw `/renders/` literal paths
4. Manual visual QA at `npm run dev`:
   - `/` shows Hero → BrandEssence (4 numbered value cards in 2×2) → PortfolioOverview (flagship side-by-side, 3 pipeline cards, aggregate row with cube)
   - DevTools Network → flagship aerial-1920.{avif|webp|jpg} loads at Highest priority — preload from index.html consumed
   - DevTools Performance → no CLS shift on flagship image hydration (explicit width/height)
</verification>

<success_criteria>
- [ ] `BrandEssence.tsx` exists, imports `brandValues`, maps to 4 numbered cards (01-04)
- [ ] No inline Ukrainian value literals in BrandEssence.tsx (data comes from values.ts)
- [ ] No lucide-react icons, no IsometricCube in BrandEssence.tsx (D-11)
- [ ] `PortfolioOverview.tsx` exists, imports flagship + pipelineGridProjects + aggregateProjects from data/projects
- [ ] Flagship `<ResponsivePicture>` has `loading="eager"`, `fetchPriority="high"`, AND `width={1280} height={720}` (LCP + CLS-safe; closes checker Blocker 4)
- [ ] Flagship external CTA `<a href={flagship.externalUrl} target="_blank" rel="noopener">`
- [ ] Pipeline grid 3-cols at ≥lg (Tailwind `lg:grid-cols-3`)
- [ ] Aggregate row uses `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4}>`
- [ ] No raw `/renders/` string literals in either file
- [ ] No `transition={{` literal in either file
- [ ] `npm run build` exits 0; check-brand 4/4 PASS
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-05-SUMMARY.md` documenting:
- 2 sections shipped (BrandEssence + PortfolioOverview)
- HOME-02 closed (BrandEssence renders 4 cards from values.ts)
- HOME-03 closed (flagship + pipeline + aggregate row all wired)
- LCP wiring confirmed: flagship `<ResponsivePicture>` consumes the AVIF preload from index.html
- VIS-03 partially exercised in production: `<IsometricCube variant="single">` first home consumer
- Flagship intrinsic dims documented (1280×720) — 16:9 lock for the AVIF/WebP/JPG triple
- check-brand result + any palette/boundary deviations noted
</output>
</output>
