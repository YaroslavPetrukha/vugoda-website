---
phase: 05-animations-polish
plan: 05b
type: execute
wave: 3
depends_on: [05-01-foundation-sot, 05-02-hover-card-utility, 05-03-reveal-on-scroll-component]
files_modified:
  - src/components/sections/construction-log/MonthGroup.tsx
  - src/pages/ConstructionLogPage.tsx
  - src/pages/ProjectsPage.tsx
  - src/pages/ContactPage.tsx
  - src/components/sections/projects/StageFilter.tsx
  - src/components/sections/projects/PipelineGrid.tsx
autonomous: true
requirements: [ANI-02]
must_haves:
  truths:
    - "Every below-fold section on /projects, /construction-log, /contact is wrapped in <RevealOnScroll>"
    - "ConstructionLogPage wraps PER-MonthGroup ONLY — exactly 1 RevealOnScroll inside MonthGroup component, NOT 50 per-photo wrappers (D-04)"
    - "ProjectsPage StageFilter chip row uses 80ms stagger across 4 chips (D-08 Specifics)"
    - "ProjectsPage PipelineGrid uses 80ms stagger across 1-3 filtered cards (D-08)"
    - "ContactPage renders 3 separate <RevealOnScroll> instances per D-08 — page header, ContactDetails block, mailto CTA"
    - "Cumulative `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ | wc -l` ≥ 18 across all reveal-application plans (05-04 + 05-05a + 05-05b) per VALIDATION.md SC#2 bound"
  artifacts:
    - path: src/components/sections/construction-log/MonthGroup.tsx
      provides: "Per-MonthGroup section reveal — exactly 1 RevealOnScroll inside this component (NOT 1 per photo)"
      contains: "RevealOnScroll"
    - path: src/components/sections/projects/StageFilter.tsx
      provides: "Chips become <motion.button variants={fadeUp}> for parent stagger cascade (D-02 + D-08 Specifics)"
      contains: "motion.button"
    - path: src/components/sections/projects/PipelineGrid.tsx
      provides: "Grid wraps in <RevealOnScroll staggerChildren> with each PipelineCard wrapped in <motion.div variants={fadeUp}> for cascade"
      contains: "RevealOnScroll"
    - path: src/pages/ContactPage.tsx
      provides: "Three separate <RevealOnScroll> instances per D-08 — header, ContactDetails, mailto CTA"
      contains: "RevealOnScroll"
  key_links:
    - from: "ProjectsPage.tsx"
      to: "src/components/ui/RevealOnScroll.tsx"
      via: "named import + outer page section reveal"
      pattern: "import \\{ RevealOnScroll \\}"
    - from: "ContactPage.tsx"
      to: "src/components/ui/RevealOnScroll.tsx"
      via: "named import + 3 reveal instances per D-08"
      pattern: "import \\{ RevealOnScroll \\}"
---

<objective>
Apply `<RevealOnScroll>` coverage to /projects, /construction-log, /contact per CONTEXT D-08:
- **ConstructionLogPage** (`/construction-log`): page header + per-MonthGroup wrap (D-04 — 1 reveal per month, NOT per photo)
- **ProjectsPage** (`/projects`): page header + FlagshipCard reveal as one block; StageFilter chips row staggered 80ms × 4 (D-08 Specifics); PipelineGrid + AggregateRow staggered 80ms across 1-3 filtered cards (D-08)
- **ContactPage** (`/contact`): 3 separate `<RevealOnScroll>` instances per D-08 — page header, ContactDetails block, mailto CTA

Critical D-04 enforcement: `ConstructionLogPage` renders `{constructionLog.map((month) => <MonthGroup key={month.key} month={month} />)}`. The single RevealOnScroll for each month MUST live INSIDE `MonthGroup.tsx` (wrapping its outer `<section>`), so we get exactly 4 reveals (one per month) on /construction-log — NOT 50 (per photo). VALIDATION map row: `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` MUST equal 1.

Critical D-08 enforcement (B5 fixes from review):
- ProjectsPage page-header reveal completes first; then StageFilter chip row reveals as a separate `<RevealOnScroll staggerChildren>` cascade (4 chips become `<motion.button variants={fadeUp}>`); then PipelineGrid reveals as another `<RevealOnScroll staggerChildren>` cascade (1-3 PipelineCards become `<motion.div variants={fadeUp}>` siblings each containing one PipelineCard). The chip row and grid are visually distinct sections per CONTEXT Specifics — they ARE separate `<RevealOnScroll>` instances, not one flat wrapper.
- ContactPage uses 3 separate `<RevealOnScroll>` instances per D-08: page header, ContactDetails block, mailto CTA. No stagger required (single elements per reveal).

Output: 6 files modified across 3 routes. ConstructionLogPage's reveals live inside MonthGroup (per-month, single instance per month, ≤5 total IO observers on this page including page header). ProjectsPage gets per-block reveals + 2 inner staggers. ContactPage gets 3 reveals.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/05-animations-polish/05-CONTEXT.md
@.planning/phases/05-animations-polish/05-RESEARCH.md
@.planning/phases/05-animations-polish/05-VALIDATION.md
@.planning/phases/05-animations-polish/05-01-foundation-sot-SUMMARY.md
@.planning/phases/05-animations-polish/05-03-reveal-on-scroll-component-SUMMARY.md
@src/pages/ProjectsPage.tsx
@src/pages/ConstructionLogPage.tsx
@src/pages/ContactPage.tsx
@src/components/sections/construction-log/MonthGroup.tsx
@src/components/sections/projects/StageFilter.tsx
@src/components/sections/projects/PipelineGrid.tsx
@src/components/sections/projects/PipelineCard.tsx
@src/components/sections/contact/ContactDetails.tsx
</context>

<interfaces>
<!-- RevealOnScroll component signature (from 05-03): -->
```tsx
import { RevealOnScroll } from '../../ui/RevealOnScroll';   // for files in src/components/sections/*/
import { RevealOnScroll } from '../components/ui/RevealOnScroll';   // for files in src/pages/

<RevealOnScroll as="section" className="...">           // section-level reveal
<RevealOnScroll staggerChildren className="...">        // 80ms cascade orchestrator
```

From src/lib/motionVariants.ts:
```ts
export const fadeUp: Variants;   // { hidden: { opacity: 0, y: 24 }, visible: ... }
```

ConstructionLogPage outer composition (current):
```tsx
return (
  <>
    <section className="bg-bg pt-24 pb-8"> <h1>Хід будівництва Lakeview</h1> </section>
    {constructionLog.map((month) => (
      <MonthGroup key={month.key} month={month} />
    ))}
  </>
);
```
The page-level header `<section>` will be wrapped here in `ConstructionLogPage.tsx` (1 reveal); each `<MonthGroup>` instance in the map adds 1 reveal each (4 reveals total — one per month). Total on this page: 5.

ProjectsPage outer composition (current — read from src/pages/ProjectsPage.tsx):
```tsx
return (
  <section className="bg-bg py-24">
    <div className="mx-auto max-w-7xl px-6">
      <header className="mb-8 flex flex-col gap-2"> <h1>{projectsHeading}</h1> <p>{projectsSubtitle}</p> </header>
      <FlagshipCard project={flagship} />
      <StageFilter counts={counts} />
      {body}   {/* PipelineGrid + AggregateRow OR BuduetsyaPointer OR EmptyStateZdano */}
    </div>
  </section>
);
```

StageFilter renders (current):
```tsx
<div role="group" aria-label="Фільтр за стадіями" className="my-12 flex flex-wrap gap-3">
  <button onClick={() => setActive(null)} ...>Усі</button>
  {STAGES.map((s) => (
    <button key={s} ...>{stageLabel(s)} ({counts[s]})</button>
  ))}
</div>
```
StageFilter renders 5 buttons total (1 «Усі» + 4 stage chips). For B5 stagger we treat the whole button list as the cascade — D-08 Specifics says «4 chips» but the reasonable read is "stages" (4) plus the «Усі» reset = 5 button children of one staggered row.

PipelineGrid renders (current):
```tsx
return (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    {filtered.map((p) => (
      <PipelineCard key={p.slug} project={p} />
    ))}
  </div>
);
```
PipelineCard internally returns `<Link><article hover-card>...</article></Link>` or `<div><article hover-card>...</article></div>`. PipelineCard is NOT modified in this plan — instead, PipelineGrid wraps each PipelineCard in `<motion.div variants={fadeUp}>` to opt into the parent's stagger cascade.

ContactPage outer composition (current):
```tsx
return (
  <section className="bg-bg py-24">
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
      <header className="flex flex-col gap-4"> <h1>...</h1> <p>...</p> </header>
      <ContactDetails />
      <div className="pt-4"> <a href={href} ...>{contactPageCta}</a> </div>
    </div>
  </section>
);
```
Per D-08: «page header · реквізити-block · mailto CTA» — 3 separate reveals. The outer `<section>` is dissolved (it would become a redundant landmark if wrapped); the 3 reveals collectively replace it. The `<div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">` width-container stays (just unwrapped from `<section>`).

NOTE on outer page wrappers: per D-08 each route's reveals coexist with the page's outer DOM. ProjectsPage retains its outer `<section className="bg-bg py-24">` because it carries the page background and padding; the inner per-block reveals (header, StageFilter cascade, PipelineGrid cascade) live INSIDE that section. The outer `<section>` is NOT itself a `<RevealOnScroll>` — that would make 4 nested reveal layers and is overkill. ContactPage IS dissolved because its outer section is just a width/padding container; the 3 inner reveals carry their own structure.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Wrap MonthGroup once per instance + ConstructionLogPage header (D-04 — 1 reveal per month, NOT per photo)</name>
  <read_first>
    - src/components/sections/construction-log/MonthGroup.tsx (current post-05-02 form: button[hover-card] elements inside a 3-col grid; per-month Lightbox state)
    - src/pages/ConstructionLogPage.tsx (renders constructionLog.map((month) => <MonthGroup key={month.key} month={month} />))
    - src/components/ui/RevealOnScroll.tsx
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-04 (per-MonthGroup reveal only — opacity-only photos via parent variant; explicitly NOT per-photo to keep IO observer count ≤4 on /construction-log)
    - .planning/phases/05-animations-polish/05-VALIDATION.md row "grep -nc '<RevealOnScroll' MonthGroup.tsx = 1"
  </read_first>
  <files>
    src/components/sections/construction-log/MonthGroup.tsx,
    src/pages/ConstructionLogPage.tsx
  </files>
  <behavior>
    - Test 1: MonthGroup outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">` — exactly 1 RevealOnScroll wrapping the entire MonthGroup body
    - Test 2: MonthGroup inner `<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">` STAYS as plain `<div>` — NO inner RevealOnScroll, NO per-photo motion components, NO staggerChildren cascade
    - Test 3: `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` returns EXACTLY 1 (D-04 enforcement — VALIDATION map row)
    - Test 4: Each `<button>` thumb stays as plain `<button>` (NOT motion.button) — D-04 «opacity only via parent variant — no per-photo translate»
    - Test 5: ConstructionLogPage page-header `<section className="bg-bg pt-24 pb-8">` becomes `<RevealOnScroll as="section" className="bg-bg pt-24 pb-8">` — single header reveal
    - Test 6: ConstructionLogPage `{constructionLog.map((month) => <MonthGroup ... />)}` body unchanged — each MonthGroup brings its own internal reveal, totalling 4 month reveals + 1 header reveal = 5 RevealOnScroll instances on /construction-log
    - Test 7: hover-card on each plain `<button>` preserved (post-05-02 work)
  </behavior>
  <action>
    Edit 2 files.

    **File 1 — `src/components/sections/construction-log/MonthGroup.tsx`:**

    Add import (after the existing `Lightbox` import on line 30):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-16">...</section>` (lines 47-82) and change ONLY the opening tag to `<RevealOnScroll as="section" className="bg-bg py-16">` and the closing tag to `</RevealOnScroll>`. ALL inner content stays byte-identical:
    - The inner `<div className="mx-auto max-w-7xl px-6">`
    - The H2 `<h2 className="mb-8 font-bold text-3xl text-text">{month.label} · {month.photos.length} фото</h2>`
    - The grid `<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">` — STAYS as plain `<div>`, NOT RevealOnScroll, NOT staggerChildren
    - The `month.photos.map(...)` body containing `<button>` thumbs — STAY as plain `<button>` (NOT motion.button)
    - The `<Lightbox>` portal at the end

    Why no per-photo wrapping: D-04 explicit — «50 IntersectionObserver callbacks would exceed SC#2's no-30+-observers rule and risk jank on a long-scroll page». Result: 4 reveals total on /construction-log (one per month from each MonthGroup instance) + 1 header reveal = 5 IO observers total.

    Why no staggerChildren on MonthGroup's grid: D-04 explicit — «Photos animate with opacity only via the parent variant — no per-photo translate». The MonthGroup section reveal fades in the entire month's content (header + grid as one block); individual photos do NOT cascade.

    **File 2 — `src/pages/ConstructionLogPage.tsx`:**

    Add import (after the existing `MonthGroup` import on line 16):
    ```tsx
    import { RevealOnScroll } from '../components/ui/RevealOnScroll';
    ```

    Replace the return JSX (current lines 19-30) with:
    ```tsx
    return (
      <>
        <RevealOnScroll as="section" className="bg-bg pt-24 pb-8">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="font-bold text-6xl text-text">Хід будівництва Lakeview</h1>
          </div>
        </RevealOnScroll>
        {constructionLog.map((month) => (
          <MonthGroup key={month.key} month={month} />
        ))}
      </>
    );
    ```

    The H1 «Хід будівництва Lakeview» (24 chars) stays inline per Phase 3 D-29 short-structural-label inline carve-out (Plan 03-06 precedent — used the same h2 there).

    Doc-block self-screen: no forbidden literals.
  </action>
  <verify>
    <automated>grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx | tr -d ' ' | grep -q '^1$' || { echo "MonthGroup MUST have exactly 1 RevealOnScroll (D-04)"; exit 1; }; grep -n '<motion\.' src/components/sections/construction-log/MonthGroup.tsx | wc -l | tr -d ' ' | grep -q '^0$' || { echo "MonthGroup MUST NOT have per-photo motion components (D-04)"; exit 1; }; grep -n 'staggerChildren' src/components/sections/construction-log/MonthGroup.tsx | wc -l | tr -d ' ' | grep -q '^0$' || { echo "MonthGroup MUST NOT use staggerChildren (D-04)"; exit 1; }; grep -nc '<RevealOnScroll' src/pages/ConstructionLogPage.tsx | tr -d ' ' | grep -q '^1$' || { echo "ConstructionLogPage MUST have 1 header RevealOnScroll"; exit 1; }; grep -n 'hover-card' src/components/sections/construction-log/MonthGroup.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "MonthGroup hover-card preserved"; exit 1; }; npm run lint && echo OK</automated>
  </verify>
  <done>
    - `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` returns exactly 1 (covers VALIDATION map "per-MonthGroup, NOT per-photo" gate)
    - `grep -n '<motion\.' src/components/sections/construction-log/MonthGroup.tsx` returns 0 matches (no motion components — D-04 explicit)
    - `grep -n 'staggerChildren' src/components/sections/construction-log/MonthGroup.tsx` returns 0 (no per-photo cascade)
    - `grep -nc '<RevealOnScroll' src/pages/ConstructionLogPage.tsx` returns exactly 1 (page header reveal)
    - hover-card on `<button>` thumbs preserved (post-05-02)
    - `npm run lint` exits 0
    - At runtime: /construction-log page has exactly 5 IntersectionObservers active (1 header + 4 MonthGroups, each their own RevealOnScroll instance) — well within SC#2's «no 30+ observers» bound
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: ProjectsPage — page header reveal + StageFilter 80ms chip stagger + PipelineGrid 80ms card stagger (D-08 + B5)</name>
  <read_first>
    - src/pages/ProjectsPage.tsx (single outer section: header + FlagshipCard + StageFilter + body)
    - src/components/sections/projects/StageFilter.tsx (5-button row: «Усі» + 4 stages from STAGES.map)
    - src/components/sections/projects/PipelineGrid.tsx (renders filtered PipelineCard list inside `<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">`)
    - src/components/sections/projects/PipelineCard.tsx (NOT modified — PipelineGrid wraps each in motion.div externally to inject stagger child)
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fadeUp)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-02, §D-08 (ProjectsPage page header + FlagshipCard + StageFilter chips row stagger 80ms × 4 + PipelineGrid stagger 80ms × 1-3)
    - .planning/phases/05-animations-polish/05-CONTEXT.md `<specifics>` "Cards-vs-section reveal hierarchy on /projects" (page-header completes first, then chip row + grid as separate reveals)
  </read_first>
  <files>
    src/pages/ProjectsPage.tsx,
    src/components/sections/projects/StageFilter.tsx,
    src/components/sections/projects/PipelineGrid.tsx
  </files>
  <behavior>
    - Test 1 (StageFilter): outer `<div role="group">` becomes `<RevealOnScroll as="div" staggerChildren role="group" aria-label="Фільтр за стадіями" className="my-12 flex flex-wrap gap-3">` — staggers 80ms across the chip-button children
    - Test 2 (StageFilter): «Усі» button becomes `<motion.button type="button" variants={fadeUp} ...>` (motion-fied to opt into cascade)
    - Test 3 (StageFilter): each `STAGES.map((s) => (<button>...))` button becomes `<motion.button key={s} variants={fadeUp} ...>` — preserve all original props (key, type, onClick, aria-pressed, className)
    - Test 4 (StageFilter): file imports `motion` from 'motion/react', `fadeUp` from '../../../lib/motionVariants', `RevealOnScroll` from '../../ui/RevealOnScroll'
    - Test 5 (PipelineGrid): outer `<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">` becomes `<RevealOnScroll as="div" staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">` — staggers 80ms across 1-3 PipelineCards
    - Test 6 (PipelineGrid): each `<PipelineCard key={p.slug} project={p} />` is wrapped in `<motion.div key={p.slug} variants={fadeUp}>` (PipelineCard itself NOT modified — wrapping externally avoids touching the shared component)
    - Test 7 (PipelineGrid): file imports `motion` from 'motion/react', `fadeUp` from '../../../lib/motionVariants', `RevealOnScroll` from '../../ui/RevealOnScroll'
    - Test 8 (ProjectsPage): outer `<section className="bg-bg py-24">` STAYS as plain `<section>` (carries page background — NOT a reveal); INSIDE it, the header `<header>` is wrapped in `<RevealOnScroll>` so the h1+subtitle reveals as one block; FlagshipCard + StageFilter + body render as siblings (each handles its own reveal — FlagshipCard wraps from 04-09 hover work? — actually FlagshipCard wraps unrevealed for now, single instance; StageFilter and PipelineGrid carry their own reveals from this task)
    - Test 9 (ProjectsPage): adds 1 RevealOnScroll wrapping the page header (h1+subtitle as one block per D-08); chip row + grid reveals come from inside StageFilter/PipelineGrid edits (no extra wrapper at page level)
    - Test 10: ProjectsPage useSearchParams chip-state behaviour preserved (chip clicks change `?stage=` query, NO RevealOnScroll re-fire because viewport is `once: true` per D-12 + RESEARCH Pitfall 1)
    - Test 11: NO inline `transition={{...}}` introduced anywhere (SC#1 grep gate stays clean)
  </behavior>
  <action>
    Edit 3 files.

    **File 1 — `src/components/sections/projects/StageFilter.tsx` (B5 — chip row stagger):**

    Add imports (after the existing `STAGES, stageLabel, isStage` import on line 22):
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 53-75) with:
    ```tsx
    return (
      <RevealOnScroll
        as="div"
        staggerChildren
        role="group"
        aria-label="Фільтр за стадіями"
        className="my-12 flex flex-wrap gap-3"
      >
        <motion.button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          variants={fadeUp}
          className={chipClass(active === null)}
        >
          Усі
        </motion.button>
        {STAGES.map((s) => (
          <motion.button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            aria-pressed={active === s}
            variants={fadeUp}
            className={chipClass(active === s)}
          >
            {stageLabel(s)} ({counts[s]})
          </motion.button>
        ))}
      </RevealOnScroll>
    );
    ```

    Notes:
    - `<RevealOnScroll as="div" staggerChildren role="group" aria-label=...>` — RevealOnScroll forwards `role`/`aria-label`/`className` props to the underlying motion.div (ElementType-based component renders as the requested tag). The role="group" semantic stays exactly where it was on the previous outer div.
    - 5 motion.buttons total (1 «Усі» + 4 STAGES) — total cascade duration 5 × 80ms = 400ms, well within reveal budget.
    - All button props (type, onClick, aria-pressed, className) preserved exactly. The `chipClass(active)` helper is unchanged.
    - `key={s}` on motion.button (React reconciliation).

    **File 2 — `src/components/sections/projects/PipelineGrid.tsx` (B5 — card stagger):**

    Add imports (after the existing `PipelineCard` import on line 24):
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 45-51) with:
    ```tsx
    return (
      <RevealOnScroll
        as="div"
        staggerChildren
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {filtered.map((p) => (
          <motion.div key={p.slug} variants={fadeUp}>
            <PipelineCard project={p} />
          </motion.div>
        ))}
      </RevealOnScroll>
    );
    ```

    Notes:
    - PipelineCard is NOT modified — wrapping externally in `<motion.div variants={fadeUp}>` is the conventional Motion pattern for opting an existing component into a parent stagger cascade. Avoids touching the shared PipelineCard internals.
    - The `<motion.div>` is the cascade child carrying `variants={fadeUp}`. Its single child `<PipelineCard project={p} />` renders inside.
    - `key={p.slug}` moves to the motion.div (React reconciliation requires key on the outermost mapped element).
    - Empty filtered list: `if (filtered.length === 0) return null;` (line 43) STAYS untouched. RevealOnScroll only renders when there is a non-empty filtered set.
    - When filtered.length is 1 (e.g., active="u-pogodzhenni" → 1 card), cascade is trivially 1 × 80ms = 80ms — visually a single fadeUp.

    **File 3 — `src/pages/ProjectsPage.tsx`:**

    Add import (after the existing `BuduetsyaPointer` import on line 35):
    ```tsx
    import { RevealOnScroll } from '../components/ui/RevealOnScroll';
    ```

    Replace the return JSX (current lines 72-85) with:
    ```tsx
    return (
      <section className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealOnScroll className="mb-8 flex flex-col gap-2">
            <h1 className="font-bold text-6xl text-text">{projectsHeading}</h1>
            <p className="text-base text-text-muted">{projectsSubtitle}</p>
          </RevealOnScroll>
          <FlagshipCard project={flagship} />
          <StageFilter counts={counts} />
          {body}
        </div>
      </section>
    );
    ```

    Notes:
    - Outer `<section className="bg-bg py-24">` STAYS plain — it carries the page background and padding. Wrapping it in RevealOnScroll would create a nested-reveal layering issue (parent reveal + 3 inner reveals = unnecessary).
    - Page header (h1+subtitle) wraps in a RevealOnScroll using the previous `<header>` element's className `mb-8 flex flex-col gap-2`. RevealOnScroll renders as `<div>` by default — semantically equivalent to the previous `<header>` (a `<div>` with descriptive children). If a `<header>` landmark is critical for a11y, RevealOnScroll accepts `as="header"`; per Risk 4 we stay with default `<div>` to keep the wrapper neutral and avoid landmark-stacking with the outer `<section>`.
    - FlagshipCard renders unwrapped — it's a single visually-significant element rendered as part of the page header zone; wrapping in its own reveal would over-fragment the cascade. (If user feedback wants flagship reveal, single-line edit later.)
    - StageFilter renders unwrapped at this level — its OWN internal RevealOnScroll (from File 1 above) handles the chip row stagger.
    - `body` renders unwrapped at this level — when body is `PipelineGrid + AggregateRow`, PipelineGrid carries its own reveal; AggregateRow renders inline (single element). When body is `BuduetsyaPointer` or `EmptyStateZdano`, those are single elements — no reveal needed (they render as part of the page composition, visible after the cascade above completes).
    - Total ProjectsPage RevealOnScroll instances: 1 (page header) + 1 (StageFilter inner from File 1) + 1 (PipelineGrid inner from File 2, only when filtered non-empty) = 2-3 depending on filter state.
    - useSearchParams behaviour preserved — chip clicks update `?stage=` without unmounting the page or re-firing reveals (D-12 + viewport `once: true`).

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced.
  </action>
  <verify>
    <automated>FAIL=0; grep -q "import { RevealOnScroll } from '../components/ui/RevealOnScroll'" src/pages/ProjectsPage.tsx || { echo "ProjectsPage MISSING RevealOnScroll import"; FAIL=1; }; grep -nc '<RevealOnScroll' src/pages/ProjectsPage.tsx | tr -d ' ' | grep -q '^1$' || { echo "ProjectsPage MUST have exactly 1 RevealOnScroll (page header)"; FAIL=1; }; grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" src/components/sections/projects/StageFilter.tsx || { echo "StageFilter MISSING RevealOnScroll import"; FAIL=1; }; grep -q "import { motion } from 'motion/react'" src/components/sections/projects/StageFilter.tsx || { echo "StageFilter MISSING motion import"; FAIL=1; }; grep -q "import { fadeUp } from '../../../lib/motionVariants'" src/components/sections/projects/StageFilter.tsx || { echo "StageFilter MISSING fadeUp import"; FAIL=1; }; grep -nc '<RevealOnScroll' src/components/sections/projects/StageFilter.tsx | tr -d ' ' | grep -q '^1$' || { echo "StageFilter MUST have 1 RevealOnScroll (chip-row stagger)"; FAIL=1; }; grep -n 'staggerChildren' src/components/sections/projects/StageFilter.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "StageFilter MUST have staggerChildren"; FAIL=1; }; grep -n '<motion.button' src/components/sections/projects/StageFilter.tsx | wc -l | tr -d ' ' | grep -q '^2$' || { echo "StageFilter MUST have 2 motion.button occurrences (Усі button + STAGES.map child)"; FAIL=1; }; grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" src/components/sections/projects/PipelineGrid.tsx || { echo "PipelineGrid MISSING RevealOnScroll import"; FAIL=1; }; grep -q "import { motion } from 'motion/react'" src/components/sections/projects/PipelineGrid.tsx || { echo "PipelineGrid MISSING motion import"; FAIL=1; }; grep -nc '<RevealOnScroll' src/components/sections/projects/PipelineGrid.tsx | tr -d ' ' | grep -q '^1$' || { echo "PipelineGrid MUST have 1 RevealOnScroll (card-grid stagger)"; FAIL=1; }; grep -n 'staggerChildren' src/components/sections/projects/PipelineGrid.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "PipelineGrid MUST have staggerChildren"; FAIL=1; }; grep -n '<motion.div' src/components/sections/projects/PipelineGrid.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "PipelineGrid MUST wrap each PipelineCard in motion.div"; FAIL=1; }; grep -nE 'staggerChildren' src/pages/ProjectsPage.tsx src/components/sections/projects/StageFilter.tsx src/components/sections/projects/PipelineGrid.tsx | wc -l | tr -d ' ' | grep -q '^2$' || { echo "Cumulative staggerChildren count across these 3 files MUST be 2 (StageFilter + PipelineGrid)"; FAIL=1; }; if [ $FAIL -eq 0 ]; then npm run lint && echo OK || { echo FAIL lint; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - StageFilter: imports motion + RevealOnScroll + fadeUp; outer `<div role="group">` → `<RevealOnScroll as="div" staggerChildren role="group" ...>`; 5 motion.button children (Усі + 4 stages) with `variants={fadeUp}`
    - PipelineGrid: imports motion + RevealOnScroll + fadeUp; outer grid `<div>` → `<RevealOnScroll as="div" staggerChildren className="grid ...">`; each PipelineCard wrapped in `<motion.div variants={fadeUp}>`
    - ProjectsPage: imports RevealOnScroll; 1 RevealOnScroll wrapping the page header (h1+subtitle); outer `<section>` stays plain
    - Cumulative `staggerChildren` count across ProjectsPage + StageFilter + PipelineGrid: 2 (StageFilter chip row + PipelineGrid cards)
    - useSearchParams chip-state behaviour preserved (D-12)
    - Phase 5 SC#1 grep gate clean (no inline transition objects added)
    - `npm run lint` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: ContactPage — 3 separate RevealOnScroll instances per D-08 (page header, ContactDetails, mailto CTA)</name>
  <read_first>
    - src/pages/ContactPage.tsx (single outer section: header + ContactDetails + mailto CTA)
    - src/components/ui/RevealOnScroll.tsx
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08 («ContactPage: page header · реквізити-block · mailto CTA» — 3 separate reveals)
  </read_first>
  <files>
    src/pages/ContactPage.tsx
  </files>
  <behavior>
    - Test 1: Outer `<section className="bg-bg py-24">` is dissolved (would create a redundant landmark stacked with 3 inner reveals); the inner width-container `<div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">` STAYS as the page width container with the page background applied via the new outer wrapper
    - Test 2: 3 separate `<RevealOnScroll>` instances, each wrapping one of: (a) page header `<header>` block, (b) `<ContactDetails />` element, (c) the mailto-CTA wrapper `<div className="pt-4"><a ...>{contactPageCta}</a></div>`
    - Test 3: ContactPage imports RevealOnScroll from `'../components/ui/RevealOnScroll'`
    - Test 4: Mailto href construction (encodeURIComponent + contactMailSubject) preserved exactly
    - Test 5: `grep -nc '<RevealOnScroll' src/pages/ContactPage.tsx` returns 3 (D-08 verbatim — 3 separate reveals)
  </behavior>
  <action>
    Edit `src/pages/ContactPage.tsx`.

    Add import (after the existing `ContactDetails` import on line 27):
    ```tsx
    import { RevealOnScroll } from '../components/ui/RevealOnScroll';
    ```

    Replace the return JSX (current lines 32-52) with:
    ```tsx
    return (
      <section className="bg-bg py-24">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
          <RevealOnScroll as="header" className="flex flex-col gap-4">
            <h1 className="font-bold text-6xl text-text">{contactPageHeading}</h1>
            <p className="text-base text-text-muted">{contactPageSubtitle}</p>
          </RevealOnScroll>

          <RevealOnScroll>
            <ContactDetails />
          </RevealOnScroll>

          <RevealOnScroll className="pt-4">
            <a
              href={href}
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {contactPageCta}
            </a>
          </RevealOnScroll>
        </div>
      </section>
    );
    ```

    Notes:
    - The outer `<section className="bg-bg py-24">` STAYS plain (carries the page background and vertical padding). It is NOT itself a RevealOnScroll — D-08 explicitly maps 3 reveals (header, details, CTA), not 4.
    - The width-container `<div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">` is unchanged — the 3 reveals render as its children, separated by `gap-12`.
    - First reveal uses `as="header"` to preserve the original `<header>` semantic landmark. Default would be `<div>` which loses the landmark.
    - Second reveal wraps `<ContactDetails />` in a default `<div>` — the dl/dt/dd inside ContactDetails carries its own semantics; the wrapper is purely a reveal trigger.
    - Third reveal preserves the original `pt-4` padding by passing it to the RevealOnScroll wrapper (which forwards `className` to the motion.div).
    - Each reveal is a single element — no staggerChildren needed (D-08 doesn't list ContactPage in stagger surfaces). Default `fadeUp` variant on each.
    - `href` const at the top of the component (`mailto:${email}?subject=${encodeURIComponent(contactMailSubject)}`) is unchanged.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced.
  </action>
  <verify>
    <automated>grep -q "import { RevealOnScroll } from '../components/ui/RevealOnScroll'" src/pages/ContactPage.tsx || { echo "ContactPage MISSING RevealOnScroll import"; exit 1; }; grep -nc '<RevealOnScroll' src/pages/ContactPage.tsx | tr -d ' ' | grep -q '^3$' || { echo "ContactPage MUST have 3 RevealOnScroll instances per D-08 (header + details + CTA)"; exit 1; }; grep -nE 'as="header"' src/pages/ContactPage.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ContactPage header reveal MUST use as=\"header\" landmark"; exit 1; }; grep -n '<ContactDetails' src/pages/ContactPage.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ContactDetails component must still render"; exit 1; }; grep -n 'mailto:' src/pages/ContactPage.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "mailto href construction must remain"; exit 1; }; npm run build 2>&1 | tail -3 | grep -qE '[0-9]+/[0-9]+ checks passed' && echo OK || (echo FAIL build; exit 1)</automated>
  </verify>
  <done>
    - ContactPage imports RevealOnScroll
    - Exactly 3 `<RevealOnScroll` occurrences in ContactPage (D-08 verbatim count)
    - First reveal uses `as="header"` to preserve the landmark
    - ContactDetails still renders (functionality preserved)
    - mailto href construction preserved exactly (encodeURIComponent + contactMailSubject)
    - `npm run build` exits 0 (lint + check-brand 5/5 PASS — count-agnostic)
    - Bundle: stays ≤140 KB gzipped (RevealOnScroll already pulled in by 05-04, no new module surface here)
  </done>
</task>

</tasks>

<verification>
After all 3 tasks, this plan contributes RevealOnScroll occurrences across 3 routes:
- /construction-log: ConstructionLogPage header (1) + 4 × MonthGroup (1 each) = 5
- /projects: ProjectsPage header (1) + StageFilter inner stagger (1) + PipelineGrid inner stagger (1) = 3 (when filter shows grid)
- /contact: ContactPage 3 reveals = 3

Plan total: 11 RevealOnScroll occurrences (5 + 3 + 3).

Combined with 05-05a (6 zhk reveals) and 05-04 (10 home reveals — Hero excluded, BrandEssence has inner stagger so counts as 2):
- 05-04: 10
- 05-05a: 6
- 05-05b: 11
- Cumulative: 24 RevealOnScroll occurrences

VALIDATION map row "ANI-02 SC#2 ≥ 18 below-fold sections" PASSES handily: `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ | wc -l` returns ≥ 18.

Per-file critical gates (from VALIDATION):
- `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` exits 1 (Hero excluded — D-06)
- `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` returns 1 (per-MonthGroup, NOT per-photo — D-04)
- `grep -rnE 'staggerChildren' src/components/` returns ≥ 6 (BrandEssence + PortfolioOverview + MethodologyTeaser + TrustBlock + ZhkGallery + StageFilter + PipelineGrid — covers VALIDATION map)

`npm run build` exits 0 — full pipeline. Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transitions added).

Bundle: ≤140 KB gzipped (motionVariants + RevealOnScroll fully reachable; tree-shake moot).
</verification>

<success_criteria>
- [ ] MonthGroup uses exactly 1 RevealOnScroll (per-month, NOT per-photo — D-04)
- [ ] ConstructionLogPage header wrapped + 4 MonthGroups each bring their own = 5 reveals total on /construction-log
- [ ] StageFilter chip row uses 80ms stagger across 5 motion.button children (B5 — D-08 Specifics)
- [ ] PipelineGrid card grid uses 80ms stagger across 1-3 motion.div-wrapped PipelineCards (B5 — D-08)
- [ ] ProjectsPage page header wrapped in 1 RevealOnScroll (h1+subtitle as one block per D-08)
- [ ] ContactPage uses 3 separate RevealOnScroll instances per D-08 verbatim (B5 — header + details + CTA)
- [ ] hover-card classes on MonthGroup thumbs preserved (no regression of 05-02)
- [ ] PipelineCard NOT modified (wrapping done externally in PipelineGrid)
- [ ] Cumulative across 05-04 + 05-05a + 05-05b: ≥ 18 RevealOnScroll occurrences (covers SC#2)
- [ ] `npm run build` exits 0 with check-brand 5/5 PASS (count-agnostic regex tolerates either count)
- [ ] Phase 5 SC#1 grep gate clean (zero inline transition objects)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-05b-reveal-other-routes-SUMMARY.md` documenting:
- Per-route reveal count: /construction-log: 5, /projects: 2-3 (depending on filter — page header + StageFilter inner + PipelineGrid inner when grid renders), /contact: 3
- Cumulative count of RevealOnScroll occurrences across the codebase post-05-05b (target ≥18 — actual ≈24)
- Verbatim diff of MonthGroup (single critical D-04 enforcement point — must remain at exactly 1 reveal)
- Verbatim diff of StageFilter (B5 chip stagger — 5 motion.button children of one staggerChildren wrapper)
- Verbatim diff of PipelineGrid (B5 card stagger — externally wrapped PipelineCards in motion.div)
- Verbatim diff of ContactPage (B5 — 3 separate reveals per D-08)
- Bundle size delta vs Plan 05-05a baseline (expected: minimal — same modules already reachable)
- Note that PipelineCard.tsx was NOT touched (external wrapping in PipelineGrid keeps shared component clean)
</output>
</content>
</invoke>