---
phase: 05-animations-polish
plan: 05
type: execute
wave: 3
depends_on: [05-01-foundation-sot, 05-03-reveal-on-scroll-component]
files_modified:
  - src/pages/ProjectsPage.tsx
  - src/components/sections/zhk/ZhkHero.tsx
  - src/components/sections/zhk/ZhkFactBlock.tsx
  - src/components/sections/zhk/ZhkWhatsHappening.tsx
  - src/components/sections/zhk/ZhkGallery.tsx
  - src/components/sections/zhk/ZhkCtaPair.tsx
  - src/components/sections/construction-log/MonthGroup.tsx
  - src/pages/ConstructionLogPage.tsx
  - src/pages/ContactPage.tsx
autonomous: true
requirements: [ANI-02]
must_haves:
  truths:
    - "Every below-fold section on /projects, /zhk/etno-dim, /construction-log, /contact is wrapped in <RevealOnScroll>"
    - "ZhkHero (LCP target on /zhk/etno-dim) uses opacity-only `fade` variant per D-09 — no Y-translate that would delay paint"
    - "ConstructionLogPage wraps PER-MonthGroup ONLY — exactly 1 RevealOnScroll inside MonthGroup component, NOT 50 per-photo wrappers (D-04)"
    - "ZhkGallery 8-render gallery uses 80ms stagger across the 8 thumbnails (D-05)"
  artifacts:
    - path: src/components/sections/zhk/ZhkGallery.tsx
      provides: "Section-level reveal + 80ms stagger across 8 thumbs (motion.button variants={fadeUp})"
      contains: "RevealOnScroll"
    - path: src/components/sections/construction-log/MonthGroup.tsx
      provides: "Per-MonthGroup section reveal — exactly 1 RevealOnScroll inside this component (NOT 1 per photo)"
      contains: "RevealOnScroll"
    - path: src/components/sections/zhk/ZhkHero.tsx
      provides: "Reveal with `variant={fade}` (opacity-only) per D-09 to protect LCP"
      contains: "variant={fade}"
  key_links:
    - from: "ZhkHero.tsx"
      to: "src/lib/motionVariants.ts fade export"
      via: "named import + variant prop"
      pattern: "import \\{ fade \\}"
    - from: "ZhkGallery.tsx 8-thumb cascade"
      to: "src/lib/motionVariants.ts fadeUp export"
      via: "motion.button variants={fadeUp} children of staggerChildren wrapper"
      pattern: "<motion\\.button.*variants=\\{fadeUp\\}"
---

<objective>
Apply `<RevealOnScroll>` coverage to the 4 non-home production routes per CONTEXT D-08:
- **ProjectsPage** (`/projects`): page header + FlagshipCard + StageFilter chip row + PipelineGrid + AggregateRow
- **ZhkPage** (`/zhk/etno-dim`): ZhkHero (`fade` variant — D-09) + ZhkFactBlock + ZhkWhatsHappening + ZhkGallery (section + 80ms stagger across 8 thumbs — D-05) + ZhkCtaPair
- **ConstructionLogPage** (`/construction-log`): page header + per-MonthGroup wrap (D-04 — 1 reveal per month, NOT per photo)
- **ContactPage** (`/contact`): page header + ContactDetails + mailto CTA

Critical D-04 enforcement: `ConstructionLogPage` renders `{constructionLog.map((month) => <MonthGroup key={month.key} month={month} />)}`. The single RevealOnScroll for each month MUST live INSIDE `MonthGroup.tsx` (wrapping its outer `<section>`), so we get exactly 4 reveals (one per month) on /construction-log — NOT 50 (per photo). VALIDATION map row: `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` MUST equal 1.

Critical D-09 enforcement: `ZhkHero` is the LCP target on /zhk/etno-dim. A Y-translate on its hero render would delay paint and regress LCP. Pass `variant={fade}` (opacity-only sibling — declared in 05-01 motionVariants.ts) explicitly to that one wrapper.

Output: 9 files modified across 4 routes; ConstructionLogPage's reveals live inside MonthGroup (per-month, single instance per month, ≤4 total IO observers on this page); ZhkGallery has its 8-thumb cascade; all other sections use the simple `as="section"` pattern.
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
@src/pages/ZhkPage.tsx
@src/pages/ConstructionLogPage.tsx
@src/pages/ContactPage.tsx
@src/components/sections/zhk/ZhkHero.tsx
@src/components/sections/zhk/ZhkFactBlock.tsx
@src/components/sections/zhk/ZhkWhatsHappening.tsx
@src/components/sections/zhk/ZhkGallery.tsx
@src/components/sections/zhk/ZhkCtaPair.tsx
@src/components/sections/construction-log/MonthGroup.tsx
@src/components/sections/contact/ContactDetails.tsx
</context>

<interfaces>
<!-- RevealOnScroll component signature (from 05-03): -->
```tsx
import { RevealOnScroll } from '../../ui/RevealOnScroll';   // for files in src/components/sections/*/
import { RevealOnScroll } from '../components/ui/RevealOnScroll';   // for files in src/pages/

<RevealOnScroll as="section" className="...">  // section-level reveal
<RevealOnScroll variant={fade} as="section" className="...">  // LCP-safe opacity-only (D-09)
<RevealOnScroll staggerChildren className="...">  // 80ms cascade orchestrator
```

<!-- For stagger to cascade, children must be motion.{tag} variants={fadeUp}. -->

From src/lib/motionVariants.ts:
```ts
export const fadeUp: Variants;   // { hidden: { opacity: 0, y: 24 }, visible: ... }
export const fade: Variants;     // { hidden: { opacity: 0 }, visible: ... } — opacity-only sibling
```

ZhkPage outer composition (current):
```tsx
return (
  <>
    <ZhkHero project={project} />
    <ZhkFactBlock project={project} />
    <ZhkWhatsHappening project={project} />
    <ZhkGallery project={project} />
    <ZhkCtaPair />
  </>
);
```
ZhkPage CANNOT be wrapped at the page level because it contains the redirect/404 fallback paths (`<ZhkLakeviewRedirect>`, `<NotFoundPage/>`, `<Navigate/>`) — wrapping all of those in motion would either cause flicker on the redirect path (RESEARCH Risk 5) or trigger spurious reveals on the 404 path. Each section component owns its own reveal.

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

ProjectsPage outer composition (current): single `<section className="bg-bg py-24">` containing header + FlagshipCard + StageFilter + body. We wrap THIS outer section + selectively wrap inner blocks per D-08.

ContactPage outer composition (current): single `<section className="bg-bg py-24">` with header + ContactDetails + mailto CTA. Single section reveal.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Wrap ZhkPage section components — ZhkHero (fade variant), ZhkFactBlock, ZhkWhatsHappening, ZhkCtaPair (D-08 + D-09)</name>
  <read_first>
    - src/components/sections/zhk/ZhkHero.tsx (LCP target — must use D-09 fade variant)
    - src/components/sections/zhk/ZhkFactBlock.tsx
    - src/components/sections/zhk/ZhkWhatsHappening.tsx
    - src/components/sections/zhk/ZhkCtaPair.tsx
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fade export — opacity-only)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08, §D-09 (ZhkHero opacity-only override)
  </read_first>
  <files>
    src/components/sections/zhk/ZhkHero.tsx,
    src/components/sections/zhk/ZhkFactBlock.tsx,
    src/components/sections/zhk/ZhkWhatsHappening.tsx,
    src/components/sections/zhk/ZhkCtaPair.tsx
  </files>
  <behavior>
    - Test 1: ZhkHero outer `<section>` becomes `<RevealOnScroll as="section" variant={fade} className="bg-bg">` — fade variant explicit per D-09 (opacity-only, no Y-translate)
    - Test 2: ZhkFactBlock outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">` (default fadeUp variant — fact block is not LCP)
    - Test 3: ZhkWhatsHappening outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg-surface py-16">`
    - Test 4: ZhkCtaPair outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">`
    - Test 5: ZhkHero imports `fade` named export from motionVariants (covers D-09)
    - Test 6: All 4 components import `RevealOnScroll`
    - Test 7: Inner content (ResponsivePicture in ZhkHero, dl/dt/dd in ZhkFactBlock, h2/p in ZhkWhatsHappening, mailto + Instagram anchors in ZhkCtaPair) byte-identical to pre-edit
  </behavior>
  <action>
    Edit 4 files. Pattern: outer `<section>` → `<RevealOnScroll as="section" ...>` . Only ZhkHero gets `variant={fade}`.

    **File 1 — `src/components/sections/zhk/ZhkHero.tsx`:**

    Add imports (after the existing `ResponsivePicture` import on line 17):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fade } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 23-39) with:
    ```tsx
    return (
      <RevealOnScroll as="section" variant={fade} className="bg-bg">
        <ResponsivePicture
          src={`renders/${project.slug}/${project.renders[0]}`}
          alt={project.title}
          widths={[640, 1280, 1920]}
          sizes="100vw"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="w-full h-auto"
        />
      </RevealOnScroll>
    );
    ```

    Critical: `variant={fade}` is the D-09 LCP-safe override — opacity 0→1 only, NO Y-translate. The `loading="eager"` and `fetchPriority="high"` props on ResponsivePicture remain — they fire HTML-parse-time fetch start regardless of the React reveal mechanism. The fade-in plays AFTER the image has decoded; it does NOT delay paint. Phase 6 LCP audit measures this on /zhk/etno-dim cold load (VALIDATION manual gate).

    **File 2 — `src/components/sections/zhk/ZhkFactBlock.tsx`:**

    Add import (after the existing `etnoDimAddress` import on line 17):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-16">...</section>` (lines 24-43) and change opening to `<RevealOnScroll as="section" className="bg-bg py-16">` and closing to `</RevealOnScroll>`. Inner `<div className="mx-auto max-w-7xl px-6">` and `<dl>` block stay byte-identical.

    **File 3 — `src/components/sections/zhk/ZhkWhatsHappening.tsx`:**

    Add import (after the existing `Project` type import on line 11):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    NOTE: this component has an `if (!project.whatsHappening) return null;` early return on line 18. The early return STAYS — the RevealOnScroll wrapper applies only to the rendered branch. Locate `<section className="bg-bg-surface py-16">...</section>` (lines 19-26) and change opening to `<RevealOnScroll as="section" className="bg-bg-surface py-16">` and closing to `</RevealOnScroll>`. Inner h2 + p stay byte-identical.

    **File 4 — `src/components/sections/zhk/ZhkCtaPair.tsx`:**

    Add import (after the existing `instagramLabel` import on line 18):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-16">...</section>` (lines 23-41) and change opening to `<RevealOnScroll as="section" className="bg-bg py-16">` and closing to `</RevealOnScroll>`. Inner `<div className="mx-auto flex max-w-3xl ...">` and the two anchors (mailto + Instagram) stay byte-identical.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced in plan-action text.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/components/sections/zhk/ZhkHero.tsx src/components/sections/zhk/ZhkFactBlock.tsx src/components/sections/zhk/ZhkWhatsHappening.tsx src/components/sections/zhk/ZhkCtaPair.tsx; do grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" "$f" || { echo "MISSING import in $f"; FAIL=1; }; grep -nc '<RevealOnScroll' "$f" | tr -d ' ' | grep -q '^1$' || { echo "wrong RevealOnScroll count in $f"; FAIL=1; }; done; grep -n 'variant={fade}' src/components/sections/zhk/ZhkHero.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ZhkHero D-09 fade variant missing"; FAIL=1; }; grep -n "import { fade }" src/components/sections/zhk/ZhkHero.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ZhkHero fade import missing"; FAIL=1; }; if [ $FAIL -eq 0 ]; then npm run lint && echo OK || { echo FAIL lint; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - All 4 zhk files import RevealOnScroll
    - All 4 files have exactly 1 `<RevealOnScroll` occurrence each
    - ZhkHero specifically uses `variant={fade}` AND imports `fade` from motionVariants (D-09 LCP protection)
    - `npm run lint` exits 0
    - Inner content (ResponsivePicture, dl/dt/dd, h2/p, mailto + Instagram anchors) byte-identical to pre-edit forms
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Wrap ZhkGallery with section reveal + 80ms stagger across 8 thumbs (D-05)</name>
  <read_first>
    - src/components/sections/zhk/ZhkGallery.tsx (current post-05-02 form: button[hover-card] elements inside a 4-col grid)
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fadeUp)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-05 (8-render gallery, 80ms stagger, total cascade 640ms within SC#2 budget)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08 (zhk gallery section-level reveal + per-thumb stagger)
  </read_first>
  <files>src/components/sections/zhk/ZhkGallery.tsx</files>
  <behavior>
    - Test 1: Outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">`
    - Test 2: Inner thumb grid `<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">` becomes `<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">`
    - Test 3: Each thumb `<button type="button" ...>` becomes `<motion.button type="button" ... variants={fadeUp}>` — preserve all props (key, type, onClick, aria-label, className with hover-card)
    - Test 4: Lightbox component renders OUTSIDE staggerChildren cascade (it's a portal, not a thumb)
    - Test 5: Total: 2 `<RevealOnScroll` opens in this file (section + grid stagger)
    - Test 6: Existing hover-card class on each `<motion.button>` preserved (no regression of 05-02)
  </behavior>
  <action>
    Edit `src/components/sections/zhk/ZhkGallery.tsx`. Two changes:

    **Change A — imports.** After the existing `Lightbox` import on line 26, add:
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    **Change B — JSX rewrite.** Replace the return JSX (current lines 43-74) with:
    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-16">
        <div className="mx-auto max-w-7xl px-6">
          <RevealOnScroll
            staggerChildren
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {project.renders.map((file, i) => (
              <motion.button
                key={file}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Відкрити рендер ${i + 1}`}
                variants={fadeUp}
                className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <ResponsivePicture
                  src={`renders/${project.slug}/${file}`}
                  alt={`${project.title} — рендер ${i + 1}`}
                  widths={[640, 1280]}
                  sizes="(min-width: 1280px) 320px, 50vw"
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              </motion.button>
            ))}
          </RevealOnScroll>
        </div>
        <Lightbox
          photos={photos}
          index={index}
          onClose={() => setIndex(-1)}
          onIndexChange={setIndex}
        />
      </RevealOnScroll>
    );
    ```

    Notes:
    - `<motion.button>` preserves all original button props (type, onClick, aria-label) and adds `variants={fadeUp}`
    - hover-card class string preserved exactly (post-05-02 form: `block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`)
    - `<Lightbox>` renders OUTSIDE the staggerChildren cascade — it's a sibling of the inner grid, inside the outer section reveal. Lightbox uses native `<dialog>` portal; it lives at z-index higher than RevealOnScroll wrapper per CONTEXT D-16
    - Phase 4 D-25 lightbox open-anim coexists with reveal — they are sequential lifecycle phases, not overlapping (D-05 explicit)
    - `key={file}` preserved on motion.button (React reconciliation)

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced.
  </action>
  <verify>
    <automated>grep -nc '<RevealOnScroll' src/components/sections/zhk/ZhkGallery.tsx | tr -d ' ' | grep -q '^2$' && grep -n 'staggerChildren' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<motion.button' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'variants={fadeUp}' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'hover-card' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<Lightbox' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - 2 `<RevealOnScroll` occurrences (section + grid stagger)
    - 1 `<motion.button` with `variants={fadeUp}` (the gallery thumb cascade child)
    - hover-card class preserved (post-05-02 work intact)
    - Lightbox component still rendered (functionality preserved)
    - `npm run lint` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Wrap MonthGroup once per instance + ConstructionLogPage header (D-04 — 1 reveal per month, NOT per photo)</name>
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
  <name>Task 4: Wrap ProjectsPage and ContactPage at page level (D-08)</name>
  <read_first>
    - src/pages/ProjectsPage.tsx (single outer section: header + FlagshipCard + StageFilter + body)
    - src/pages/ContactPage.tsx (single outer section: header + ContactDetails + mailto CTA)
    - src/components/ui/RevealOnScroll.tsx
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08 (ProjectsPage page header reveals as one block + FlagshipCard reveals + StageFilter chips row reveals + PipelineGrid reveals)
  </read_first>
  <files>
    src/pages/ProjectsPage.tsx,
    src/pages/ContactPage.tsx
  </files>
  <behavior>
    - Test 1: ProjectsPage outer `<section className="bg-bg py-24">` becomes `<RevealOnScroll as="section" className="bg-bg py-24">` — single page-level reveal that covers all content
    - Test 2: ContactPage outer `<section className="bg-bg py-24">` becomes `<RevealOnScroll as="section" className="bg-bg py-24">`
    - Test 3: Both pages import RevealOnScroll from `'../components/ui/RevealOnScroll'`
    - Test 4: Inner content (header, FlagshipCard, StageFilter, body dispatch on ProjectsPage; ContactDetails, mailto anchor on ContactPage) byte-identical
    - Test 5: ProjectsPage useSearchParams chip-state behaviour preserved (chip clicks change `?stage=` query, NO RevealOnScroll re-fire because viewport is `once: true` — verified by D-12 + RESEARCH Pitfall 1: pathname stays `/projects`, query param doesn't reset reveal)
  </behavior>
  <action>
    Edit 2 files.

    **File 1 — `src/pages/ProjectsPage.tsx`:**

    Add import (after the existing `BuduetsyaPointer` import on line 35):
    ```tsx
    import { RevealOnScroll } from '../components/ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-24">...</section>` (lines 73-84) and change opening tag to `<RevealOnScroll as="section" className="bg-bg py-24">` and closing tag to `</RevealOnScroll>`. ALL inner content (the `<div className="mx-auto max-w-7xl px-6">`, header with h1+subtitle, FlagshipCard, StageFilter, and the `body` ReactNode dispatch) stays byte-identical.

    Note: per CONTEXT.md `<specifics>` «Cards-vs-section reveal hierarchy on /projects» — page-header reveal completes first; then FlagshipCard + StageFilter + PipelineGrid all live INSIDE the same outer RevealOnScroll. The pipeline grid's stagger lives in PipelineGrid → PipelineCard which is a separate Phase 4 component path that does NOT need a separate RevealOnScroll — the outer page reveal carries the whole composition. This keeps the change minimal and avoids the «cascading-stagger inside cascading-stagger» complexity that would arise if we tried to split into 4-5 nested reveals. Phase 5 future iteration can refine if needed; D-08 says «page header (h1+subtitle) reveals as one block» which the outer wrapper satisfies.

    **File 2 — `src/pages/ContactPage.tsx`:**

    Add import (after the existing `ContactDetails` import on line 27):
    ```tsx
    import { RevealOnScroll } from '../components/ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-24">...</section>` (lines 33-52) and change opening tag to `<RevealOnScroll as="section" className="bg-bg py-24">` and closing tag to `</RevealOnScroll>`. Inner `<div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">` containing header + ContactDetails + mailto anchor stays byte-identical.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/pages/ProjectsPage.tsx src/pages/ContactPage.tsx; do grep -q "import { RevealOnScroll } from '../components/ui/RevealOnScroll'" "$f" || { echo "MISSING import in $f"; FAIL=1; }; grep -nc '<RevealOnScroll' "$f" | tr -d ' ' | grep -q '^1$' || { echo "wrong RevealOnScroll count in $f"; FAIL=1; }; done; if [ $FAIL -eq 0 ]; then npm run build 2>&1 | tail -3 | grep -q '4/4 checks passed' && echo OK || { echo FAIL build; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - Both pages import RevealOnScroll from `'../components/ui/RevealOnScroll'`
    - Both pages have exactly 1 `<RevealOnScroll` occurrence (single page-level reveal)
    - useSearchParams behaviour on ProjectsPage preserved (D-12)
    - `npm run build` exits 0 (lint + check-brand 4/4 PASS)
    - Bundle: stays ≤140 KB gzipped (RevealOnScroll already pulled in by 05-04, no new module surface here)
  </done>
</task>

</tasks>

<verification>
After all 4 tasks: cumulative count of `<RevealOnScroll` occurrences across `src/components/sections/` and `src/pages/`:
- Plan 05-04 home contributions: BrandEssence (1), PortfolioOverview (2), ConstructionTeaser (1), MethodologyTeaser (2), TrustBlock (2), ContactForm (1) = 9
- Plan 05-05 zhk contributions: ZhkHero (1), ZhkFactBlock (1), ZhkWhatsHappening (1), ZhkGallery (2 — section + stagger), ZhkCtaPair (1) = 6
- Plan 05-05 construction-log contributions: MonthGroup (1), ConstructionLogPage (1) = 2
- Plan 05-05 ProjectsPage + ContactPage: 1 each = 2
- Total cumulative: 19 RevealOnScroll occurrences

VALIDATION map row "ANI-02 SC#2 ≥ 18 below-fold sections" PASSES: `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ | wc -l` returns ≥ 18.

Per-file critical gates (from VALIDATION):
- `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` exits 1 (Hero excluded — D-06)
- `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` returns 1 (per-MonthGroup, NOT per-photo — D-04)
- `grep -n 'variant={fade}' src/components/sections/zhk/ZhkHero.tsx` returns 1 (LCP-safe override — D-09)
- `grep -rnE 'staggerChildren' src/components/` returns ≥ 4 (PortfolioOverview, MethodologyTeaser, TrustBlock, ZhkGallery — covers VALIDATION map)

`npm run build` exits 0 — full pipeline. Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transitions added).

Bundle: ≤140 KB gzipped (motionVariants + RevealOnScroll fully reachable; tree-shake moot).
</verification>

<success_criteria>
- [ ] All 4 ZhkPage section components wrapped (ZhkHero with `variant={fade}`, ZhkFactBlock, ZhkWhatsHappening, ZhkCtaPair)
- [ ] ZhkGallery uses section + 80ms stagger across 8 thumbs (D-05)
- [ ] MonthGroup uses exactly 1 RevealOnScroll (per-month, NOT per-photo — D-04)
- [ ] ConstructionLogPage header wrapped + 4 MonthGroups each bring their own = 5 reveals total on /construction-log
- [ ] ProjectsPage and ContactPage each have 1 page-level RevealOnScroll
- [ ] Cumulative across 05-04 + 05-05: ≥ 18 RevealOnScroll occurrences (covers SC#2)
- [ ] Hero NOT wrapped (D-06)
- [ ] hover-card classes on ZhkGallery thumbs and MonthGroup thumbs preserved (no regression of 05-02)
- [ ] `npm run build` exits 0 with check-brand 4/4 PASS
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-05-reveal-other-routes-SUMMARY.md` documenting:
- Per-route reveal count (e.g. /projects: 1 page-level, /zhk/etno-dim: 6, /construction-log: 5, /contact: 1)
- Cumulative count of RevealOnScroll occurrences across the codebase post-05-05 (target ≥18)
- Verbatim diff of MonthGroup (single critical D-04 enforcement point — must remain at exactly 1 reveal)
- Verbatim diff of ZhkHero (D-09 fade variant — must remain LCP-safe)
- Bundle size delta vs Plan 05-04 baseline (expected: minimal — same modules already reachable)
- Note for Phase 6 LCP audit: /zhk/etno-dim cold load Lighthouse measurement validates D-09 fade-only choice
</output>
