---
phase: 05-animations-polish
plan: 04
type: execute
wave: 3
depends_on: [05-01-foundation-sot, 05-02-hover-card-utility, 05-03-reveal-on-scroll-component]
files_modified:
  - src/components/sections/home/BrandEssence.tsx
  - src/components/sections/home/PortfolioOverview.tsx
  - src/components/sections/home/ConstructionTeaser.tsx
  - src/components/sections/home/MethodologyTeaser.tsx
  - src/components/sections/home/TrustBlock.tsx
  - src/components/sections/home/ContactForm.tsx
autonomous: true
requirements: [ANI-02]
must_haves:
  truths:
    - "Every below-fold section on `/` (HomePage) is wrapped in <RevealOnScroll> exactly once — Hero is excluded (LCP target)"
    - "BrandEssence 4-card grid uses 80ms parent stagger across the 4 value cards (D-02 + D-08)"
    - "PortfolioOverview pipeline grid uses 80ms parent stagger across the 3 cards (D-02 + D-08)"
    - "TrustBlock 3-column legal table uses 80ms stagger across the 3 columns (D-03)"
    - "MethodologyTeaser 3-card grid uses 80ms stagger across the 3 blocks (D-08)"
    - "Cumulative `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ | wc -l` ≥ 18 across all reveal-application plans (05-04 + 05-05a + 05-05b) per VALIDATION.md SC#2 bound"
  artifacts:
    - path: src/components/sections/home/BrandEssence.tsx
      provides: "Section wrapped in RevealOnScroll + inner staggerChildren on the 4-card grid (D-02)"
      contains: "RevealOnScroll"
    - path: src/components/sections/home/PortfolioOverview.tsx
      provides: "Section wrapped in RevealOnScroll; pipeline grid items inside use motion.article + variants={fadeUp} for stagger to land"
      contains: "RevealOnScroll"
    - path: src/components/sections/home/ConstructionTeaser.tsx
      provides: "Section wrapped in RevealOnScroll"
      contains: "RevealOnScroll"
    - path: src/components/sections/home/MethodologyTeaser.tsx
      provides: "Section wrapped in RevealOnScroll with staggerChildren on the 3-card grid"
      contains: "RevealOnScroll"
    - path: src/components/sections/home/TrustBlock.tsx
      provides: "Section wrapped in RevealOnScroll; 3-column grid uses staggerChildren"
      contains: "RevealOnScroll"
    - path: src/components/sections/home/ContactForm.tsx
      provides: "Section wrapped in RevealOnScroll"
      contains: "RevealOnScroll"
  key_links:
    - from: "6 home section files"
      to: src/components/ui/RevealOnScroll.tsx
      via: "named import + JSX usage"
      pattern: "import \\{ RevealOnScroll \\} from"
---

<objective>
Wrap every below-fold section on the home page in `<RevealOnScroll>` per CONTEXT D-08 coverage map. Hero is INTENTIONALLY EXCLUDED (LCP target — wrapping `<h1>ВИГОДА</h1>` in fade-in delays painting it; D-06).

Sections to wrap (6 total — verbatim D-08 home subset):
1. BrandEssence — section reveal (h2 + 4 cards reveal as one wave; D-08 line "BrandEssence")
2. PortfolioOverview — section reveal + 80ms parent stagger across 3 pipeline cards (D-08)
3. ConstructionTeaser — section reveal (D-08)
4. MethodologyTeaser — section reveal + 80ms stagger across 3 cards (D-08)
5. TrustBlock — section reveal + 80ms stagger across 3 columns (D-03 + D-08)
6. ContactForm — section reveal (D-08)

For each section: the existing component currently renders `<section>...</section>` as outer element. Per RESEARCH Risk 4, to avoid `<section><motion.section>...</motion.section></section>` double-landmark, this plan uses pattern: REPLACE outer `<section>` with `<RevealOnScroll as="section">`. This keeps semantic alignment (one landmark per section) AND lands the motion wrapper at the same DOM depth.

Stagger consumers (PortfolioOverview pipeline grid, MethodologyTeaser 3-card grid, TrustBlock 3-column grid) require their child elements to be `<motion.div variants={fadeUp}>` (or equivalent motion element) so the parent's `staggerChildren: 0.08` cascade can target them. For these surfaces, the inner grid container will be the staggerChildren wrapper (`<RevealOnScroll staggerChildren>` on the grid div) and each card becomes a `<motion.{tag} variants={fadeUp}>`.

Output: 6 home section files modified with RevealOnScroll wrappers in place. Plan 05-05 covers the other 4 routes (ProjectsPage, ZhkPage, ConstructionLogPage, ContactPage).
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
@src/components/sections/home/BrandEssence.tsx
@src/components/sections/home/PortfolioOverview.tsx
@src/components/sections/home/ConstructionTeaser.tsx
@src/components/sections/home/MethodologyTeaser.tsx
@src/components/sections/home/TrustBlock.tsx
@src/components/sections/home/ContactForm.tsx
@src/components/sections/home/Hero.tsx
@src/pages/HomePage.tsx
</context>

<interfaces>
<!-- RevealOnScroll component signature (from Plan 05-03): -->
```tsx
import { RevealOnScroll } from '../../ui/RevealOnScroll';

// Section-level reveal:
<RevealOnScroll as="section" className="bg-bg py-24">
  ...content...
</RevealOnScroll>

// Stagger orchestrator:
<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  {items.map((it) => (
    <motion.article key={it.id} variants={fadeUp} className="...">
      ...
    </motion.article>
  ))}
</RevealOnScroll>
```

<!-- For stagger to cascade, children MUST opt-in by being motion components with variants={fadeUp}. Bare <article> children won't animate. -->

From src/lib/motionVariants.ts:
```ts
export const fadeUp: Variants;  // { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: ... } }
```

Existing pre-edit BrandEssence.tsx renders:
```tsx
<section className="bg-bg py-24">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid grid-cols-2 gap-x-12 gap-y-16">
      {brandValues.map((value, i) => { ...renders <article>... })}
    </div>
  </div>
</section>
```

Existing pre-edit PortfolioOverview.tsx (post-05-02 form) renders:
```tsx
<section className="bg-bg py-24">
  <div className="mx-auto max-w-7xl px-6">
    <header className="mb-12 flex flex-col gap-2"> <h2>{portfolioHeading}</h2> <p>{portfolioSubtitle}</p> </header>
    <FlagshipCard project={flagship} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {pipelineGridProjects.map((project) => (
        <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface hover-card">
          ...ResponsivePicture + <div> with stage label, title, location...
        </article>
      ))}
    </div>
    <AggregateRow project={aggregate} />
  </div>
</section>
```

Existing pre-edit ConstructionTeaser.tsx renders `<section className="bg-bg py-24">`.
Existing pre-edit MethodologyTeaser.tsx renders `<section className="bg-bg py-24">` containing a `<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">` with 3 `<article>` blocks.
Existing pre-edit TrustBlock.tsx renders `<section className="bg-bg py-24">` containing a `<div className="... lg:grid-cols-3">` with 3 column divs.
Existing pre-edit ContactForm.tsx renders `<section className="bg-bg-black py-24">`.

Hero.tsx (do NOT touch in this plan): is a `<section>` element holding the LCP target. Plan 05-07 makes the only Hero edits.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Wrap simple sections (BrandEssence, ConstructionTeaser, ContactForm) in RevealOnScroll as section</name>
  <read_first>
    - src/components/ui/RevealOnScroll.tsx (verify Plan 05-03 component signature)
    - src/components/sections/home/BrandEssence.tsx
    - src/components/sections/home/ConstructionTeaser.tsx
    - src/components/sections/home/ContactForm.tsx
    - src/lib/motionVariants.ts (verify `fadeUp` named export from 05-01 — needed for BrandEssence cascade children)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-02 (80ms cadence — BrandEssence 4 cards 2×2), §D-06 (Hero excluded), §D-08 (HomePage section coverage map)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Risk 4 (Risk 4 — replace `<section>` with `<RevealOnScroll as="section">`, do NOT nest)
  </read_first>
  <files>
    src/components/sections/home/BrandEssence.tsx,
    src/components/sections/home/ConstructionTeaser.tsx,
    src/components/sections/home/ContactForm.tsx
  </files>
  <behavior>
    - Test 1: BrandEssence outer JSX element is `<RevealOnScroll as="section" className="bg-bg py-24">` (NOT `<section>` wrapped INSIDE another `<section>`)
    - Test 2: BrandEssence inner 4-card grid `<div className="grid grid-cols-2 ...">` is replaced with `<RevealOnScroll staggerChildren className="grid grid-cols-2 ...">` (D-02 — 80ms cascade across the 4 value cards)
    - Test 3: BrandEssence each `<article>` becomes `<motion.article key={value.title} variants={fadeUp}>` (cascade child opt-in)
    - Test 4: ConstructionTeaser outer JSX element is `<RevealOnScroll as="section" className="bg-bg py-24">` (no inner stagger — single section reveal per D-08)
    - Test 5: ContactForm outer JSX element is `<RevealOnScroll as="section" className="bg-bg-black py-24">` (preserve bg-bg-black; no inner stagger)
    - Test 6: All 3 files import `RevealOnScroll`; BrandEssence ALSO imports `motion` and `fadeUp`
    - Test 7: Inner content of ConstructionTeaser and ContactForm (children of the original section) preserved byte-identical
  </behavior>
  <action>
    Edit 3 files. Each follows the SAME pattern: locate the outer `<section>...</section>` element and replace its opening/closing tags with `<RevealOnScroll as="section" ...>` / `</RevealOnScroll>`. Add the named import at the top of the file.

    **File 1 — `src/components/sections/home/BrandEssence.tsx`:**

    Add imports (after the existing `brandValues` import on line 16):
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    Locate this JSX (lines 19-42 of current file):
    ```tsx
    return (
      <section className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-16">
            {brandValues.map((value, i) => {
              const num = String(i + 1).padStart(2, '0');
              return (
                <article key={value.title} className="flex flex-col gap-4">
                  ...
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
    ```

    Replace with (per D-02 — 80ms stagger across 4 cards 2×2):
    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealOnScroll staggerChildren className="grid grid-cols-2 gap-x-12 gap-y-16">
            {brandValues.map((value, i) => {
              const num = String(i + 1).padStart(2, '0');
              return (
                <motion.article
                  key={value.title}
                  variants={fadeUp}
                  className="flex flex-col gap-4"
                >
                  <span className="font-medium text-sm text-text-muted">
                    {num}
                  </span>
                  <h3 className="font-bold text-2xl text-text">
                    {value.title}
                  </h3>
                  <p className="text-base leading-relaxed text-text-muted">
                    {value.body}
                  </p>
                </motion.article>
              );
            })}
          </RevealOnScroll>
        </div>
      </RevealOnScroll>
    );
    ```

    Notes:
    - Outer `<RevealOnScroll as="section">` covers the section as one reveal wave (h2 if present + grid as a block).
    - Inner nested `<RevealOnScroll staggerChildren>` is the cascade orchestrator for the 4 value cards (D-02 lists BrandEssence: «4 cards 2×2» as a stagger surface). Same pattern as PortfolioOverview pipeline grid in Task 2.
    - Each `<motion.article variants={fadeUp}>` opts into the cascade. Without `variants={fadeUp}`, the cards would render at their final state immediately and the cascade would have nothing to animate.
    - `key={value.title}` preserved on the motion.article (React reconciliation).
    - All inner spans / h3 / p children byte-identical to pre-edit.

    **File 2 — `src/components/sections/home/ConstructionTeaser.tsx`:**

    Add import (after the existing `constructionTeaserCta` import on line 24):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-24">...</section>` (lines 38-95) and change the opening tag to `<RevealOnScroll as="section" className="bg-bg py-24">` and the closing tag to `</RevealOnScroll>`. ALL inner content (the `<div className="mx-auto max-w-7xl px-6">`, scroll-snap strip, arrow buttons, ChevronLeft/Right buttons, photos.map, Link to /construction-log) stays byte-identical.

    **File 3 — `src/components/sections/home/ContactForm.tsx`:**

    Add import (after the existing `contactBody` import on line 25):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate `<section className="bg-bg-black py-24">...</section>` (lines 33-46) and change the opening tag to `<RevealOnScroll as="section" className="bg-bg-black py-24">` and the closing tag to `</RevealOnScroll>`. Inner content (the centered div, h2, p, mailto anchor) stays byte-identical.

    Do NOT modify the `MAIL_SUBJECT` constant, the `href` template literal, or any imports beyond adding the RevealOnScroll one. Do NOT change the existing JSDoc doc-blocks at the top of any file (they reference Phase 4 lineage and are historical record).

    Doc-block self-screen: no plan-action text contains `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, or `/construction/` — confirmed.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/components/sections/home/BrandEssence.tsx src/components/sections/home/ConstructionTeaser.tsx src/components/sections/home/ContactForm.tsx; do grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" "$f" || { echo "MISSING import in $f"; FAIL=1; }; grep -nE '<RevealOnScroll as="section"' "$f" | wc -l | tr -d ' ' | grep -q '^1$' || { echo "wrong RevealOnScroll usage in $f"; FAIL=1; }; done; grep -nc '<RevealOnScroll' src/components/sections/home/BrandEssence.tsx | tr -d ' ' | grep -q '^2$' || { echo "BrandEssence MUST have 2 RevealOnScroll (section + inner staggerChildren)"; FAIL=1; }; grep -n 'staggerChildren' src/components/sections/home/BrandEssence.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "BrandEssence MUST have inner staggerChildren (D-02)"; FAIL=1; }; grep -n '<motion.article' src/components/sections/home/BrandEssence.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "BrandEssence MUST have <motion.article> in cascade"; FAIL=1; }; grep -n 'variants={fadeUp}' src/components/sections/home/BrandEssence.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "BrandEssence motion.article MUST use variants={fadeUp}"; FAIL=1; }; for f in src/components/sections/home/ConstructionTeaser.tsx src/components/sections/home/ContactForm.tsx; do grep -nc '<RevealOnScroll' "$f" | tr -d ' ' | grep -q '^1$' || { echo "wrong RevealOnScroll count in $f (expect 1, no inner stagger)"; FAIL=1; }; done; if [ $FAIL -eq 0 ]; then npm run lint && echo OK || { echo FAIL lint; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - All 3 files have `import { RevealOnScroll } from '../../ui/RevealOnScroll'`
    - All 3 files have exactly 1 `<RevealOnScroll as="section"` opening tag (the outer section)
    - BrandEssence ALSO has 1 inner `<RevealOnScroll staggerChildren>` wrapping the 4-card grid (`grep -nc '<RevealOnScroll' BrandEssence.tsx` returns 2)
    - BrandEssence imports `motion` from 'motion/react' and `fadeUp` from '../../../lib/motionVariants'
    - BrandEssence has 1 `<motion.article>` with `variants={fadeUp}` (the cascade child)
    - ConstructionTeaser and ContactForm each have exactly 1 `<RevealOnScroll>` (no inner stagger — single reveal per D-08)
    - `grep -rnc '<RevealOnScroll' src/components/sections/home/Hero.tsx` returns 0 (Hero NOT wrapped — D-06)
    - `npm run lint` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Wrap PortfolioOverview with section reveal + 80ms stagger across pipeline grid (D-02 + D-08)</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (current post-05-02 form: 5 surfaces use hover-card, the 3-card pipeline grid uses `<article>` per item)
    - src/components/ui/RevealOnScroll.tsx (component signature)
    - src/lib/motionVariants.ts (fadeUp variant for child opt-in)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-02 (80ms cadence), §D-08 (PortfolioOverview includes flagship + grid + aggregate as one section reveal with stagger on the 3 grid cards)
  </read_first>
  <files>src/components/sections/home/PortfolioOverview.tsx</files>
  <behavior>
    - Test 1: Outer `<section>` replaced with `<RevealOnScroll as="section" className="bg-bg py-24">`
    - Test 2: Inside, the pipeline grid `<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">` is wrapped in OR replaced with `<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">` to cascade 80ms across the 3 cards
    - Test 3: Each `<article>` inside that grid becomes `<motion.article key={project.slug} variants={fadeUp} className="flex flex-col gap-4 bg-bg-surface hover-card">` (motion-fied to opt into the cascade; preserve hover-card class from 05-02)
    - Test 4: FlagshipCard, header, AggregateRow rendered OUTSIDE of staggerChildren wrapper (these are not part of the 3-card cascade)
    - Test 5: NO inline `transition={{...}}` introduced (variants carry transition; SC#1 still clean)
    - Test 6: hover-card class on each motion.article preserved exactly (no regression of 05-02 work)
  </behavior>
  <action>
    Edit `src/components/sections/home/PortfolioOverview.tsx`. Two changes:

    **Change A — imports.** After the existing `AggregateRow` import on line 39, add:
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    **Change B — JSX rewrite.** Replace the entire return JSX (current lines 44-85, post-05-02 form) with:

    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section heading + honest 0/1/4 subtitle (D-13) */}
          <header className="mb-12 flex flex-col gap-2">
            <h2 className="font-bold text-4xl text-text">{portfolioHeading}</h2>
            <p className="text-base text-text-muted">{portfolioSubtitle}</p>
          </header>

          {/* Flagship card — extracted to <FlagshipCard> for cross-surface reuse (D-02) */}
          <FlagshipCard project={flagship} />

          {/* Pipeline grid — 3 cards in row at ≥lg (D-15). Phase 5: 80ms staggerChildren cascade per D-02 + D-08. */}
          <RevealOnScroll staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pipelineGridProjects.map((project) => (
              <motion.article
                key={project.slug}
                variants={fadeUp}
                className="flex flex-col gap-4 bg-bg-surface hover-card"
              >
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
              </motion.article>
            ))}
          </RevealOnScroll>

          {/* Aggregate row — extracted to <AggregateRow> for cross-surface reuse (HUB-04) */}
          <AggregateRow project={aggregate} />
        </div>
      </RevealOnScroll>
    );
    ```

    Notes:
    - Outer `<RevealOnScroll as="section">` covers the section heading + flagship + grid + aggregate as one reveal wave per D-08 «PortfolioOverview (flagship + grid + aggregate as one section reveal with stagger on the 3 grid cards)».
    - Inner nested `<RevealOnScroll staggerChildren>` is the cascade orchestrator for the 3 pipeline cards. The two reveals coexist — outer fires on viewport entry, inner cascade fires when the child grid is visible. With `viewport: { once: true, margin: '-50px' }` both fire when the section first crosses into view; the inner cascade then animates each child via the parent's `staggerChildren: 0.08` cadence.
    - `<motion.article variants={fadeUp}>` opts each card into the cascade. Without `variants={fadeUp}`, the cards would render at their final state immediately and the cascade would have nothing to animate.
    - `key={project.slug}` preserved on the motion.article (React reconciliation requires it).
    - `hover-card` class preserved exactly — no regression of 05-02 hover-card consolidation.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals (the existing `renders/${project.slug}/${project.renders[0]}` template-literal goes through ResponsivePicture which composes via lib/assetUrl — no string-literal `'/renders/...'` pattern).
  </action>
  <verify>
    <automated>grep -n "import { RevealOnScroll } from '../../ui/RevealOnScroll'" src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n "import { fadeUp } from '../../../lib/motionVariants'" src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nc '<RevealOnScroll' src/components/sections/home/PortfolioOverview.tsx | tr -d ' ' | grep -q '^2$' && grep -n 'staggerChildren' src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<motion.article' src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'variants={fadeUp}' src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'hover-card' src/components/sections/home/PortfolioOverview.tsx | wc -l | tr -d ' ' | grep -q '^1$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `import { RevealOnScroll } from '../../ui/RevealOnScroll'` present
    - `import { motion } from 'motion/react'` present
    - `import { fadeUp } from '../../../lib/motionVariants'` present
    - `grep -nc '<RevealOnScroll' src/components/sections/home/PortfolioOverview.tsx` returns 2 (one outer section, one inner staggerChildren wrapping the grid)
    - `grep -n 'staggerChildren' src/components/sections/home/PortfolioOverview.tsx` returns 1 (the inner pipeline grid)
    - `grep -n '<motion.article' src/components/sections/home/PortfolioOverview.tsx` returns 1 (the map's child element)
    - `grep -n 'variants={fadeUp}' src/components/sections/home/PortfolioOverview.tsx` returns 1
    - `hover-card` class still present on the motion.article (05-02 work preserved)
    - `npm run lint` exits 0
    - Visual: PortfolioOverview renders with section fade + 3-card cascade on first scroll-into-view; Phase 4 hover behaviour unchanged
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Wrap MethodologyTeaser + TrustBlock with section reveal + staggerChildren cascade (D-02 + D-03 + D-08)</name>
  <read_first>
    - src/components/sections/home/MethodologyTeaser.tsx (3-card grid: `<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">` with 3 `<article>` blocks from FEATURED_INDEXES)
    - src/components/sections/home/TrustBlock.tsx (3-column legal table: `<div className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3">` with 3 column `<div>` blocks)
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fadeUp)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-02 (80ms canonical), §D-03 (TrustBlock cards stagger), §D-08 (MethodologyTeaser 3 blocks stagger)
  </read_first>
  <files>
    src/components/sections/home/MethodologyTeaser.tsx,
    src/components/sections/home/TrustBlock.tsx
  </files>
  <behavior>
    - Test 1: MethodologyTeaser outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-24">`
    - Test 2: MethodologyTeaser inner 3-card grid `<div>` becomes `<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-8 lg:grid-cols-3">`
    - Test 3: Each MethodologyTeaser `<article>` becomes `<motion.article key={block.index} variants={fadeUp} className="flex flex-col gap-4">`
    - Test 4: TrustBlock outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-24">`
    - Test 5: TrustBlock inner 3-column grid `<div>` becomes `<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3">`
    - Test 6: Each TrustBlock column `<div className="flex flex-col gap-3">` becomes `<motion.div variants={fadeUp} className="flex flex-col gap-3">`
    - Test 7: TrustBlock H2 «Юридично та операційно» stays inside the outer RevealOnScroll, BEFORE the staggerChildren grid (so heading reveals with section, columns cascade after)
    - Test 8: All children of `<motion.div>` columns (uppercase label spans, value spans, mailto anchor) remain byte-identical
    - Test 9: Defensive grep guards on TrustBlock: NO `<img>`, NO `команда`, NO `керівник`, NO `обличчя`, NO `портрет` (Phase 3 plan 03-07 D-precedent — HOME-06 hard-rule preserved)
  </behavior>
  <action>
    Edit 2 files. Pattern is identical: outer section → `<RevealOnScroll as="section">`; inner grid → `<RevealOnScroll staggerChildren>`; each grid child → `<motion.{tag} variants={fadeUp}>`.

    **File 1 — `src/components/sections/home/MethodologyTeaser.tsx`:**

    Add imports (after the existing `methodologyVerificationWarning` import on line 20):
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 30-60) with:
    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-bold text-3xl text-text">Як ми будуємо</h2>

          <RevealOnScroll staggerChildren className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {featured.map((block) => (
              <motion.article
                key={block.index}
                variants={fadeUp}
                className="flex flex-col gap-4"
              >
                <span className="font-medium text-sm text-text-muted">
                  {String(block.index).padStart(2, '0')}
                </span>
                <h3 className="font-bold text-xl text-text">
                  {block.needsVerification && (
                    <span
                      aria-label={methodologyVerificationWarning}
                      className="mr-2 text-accent"
                    >
                      ⚠
                    </span>
                  )}
                  {block.title}
                </h3>
                <p className="text-base leading-relaxed text-text-muted">
                  {block.body}
                </p>
              </motion.article>
            ))}
          </RevealOnScroll>
        </div>
      </RevealOnScroll>
    );
    ```

    The H2 «Як ми будуємо» (13 chars) stays inline per the Phase 3 D-29 short-structural-label inline carve-out (Plan 03-06 precedent).

    **File 2 — `src/components/sections/home/TrustBlock.tsx`:**

    Add imports (after the existing `licenseScopeNote, contactNote` import on line 30):
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 33-79) with:
    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-bold text-3xl text-text">
            Юридично та операційно
          </h2>

          <RevealOnScroll
            staggerChildren
            className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3"
          >
            {/* Column 1 — legal entity + ЄДРПОУ */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                Юр. особа
              </span>
              <span className="font-bold text-base text-text">{legalName}</span>
              <span className="text-base text-text-muted">ЄДРПОУ {edrpou}</span>
            </motion.div>

            {/* Column 2 — license */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                Ліцензія
              </span>
              <span className="font-bold text-base text-text">
                від {licenseDate} {licenseNote}
              </span>
              <span className="text-base text-text-muted">
                {licenseScopeNote}
              </span>
            </motion.div>

            {/* Column 3 — contact email (clickable mailto) */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                Контакт
              </span>
              <a
                href={`mailto:${email}`}
                className="font-bold text-base text-text hover:text-accent"
              >
                {email}
              </a>
              <span className="text-base text-text-muted">{contactNote}</span>
            </motion.div>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>
    );
    ```

    The H2 «Юридично та операційно» (24 chars) stays inline per Phase 3 D-29 (Plan 03-07 precedent — same carve-out used previously).

    Defensive guard preservation: TrustBlock still contains zero `<img>` tags, zero `команда`/`керівник`/`обличчя`/`портрет` strings. Plan 03-07 D-precedent enforced.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/components/sections/home/MethodologyTeaser.tsx src/components/sections/home/TrustBlock.tsx; do grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" "$f" || { echo "MISSING import RevealOnScroll in $f"; FAIL=1; }; grep -q "import { motion } from 'motion/react'" "$f" || { echo "MISSING import motion in $f"; FAIL=1; }; grep -q "import { fadeUp } from '../../../lib/motionVariants'" "$f" || { echo "MISSING import fadeUp in $f"; FAIL=1; }; grep -nc '<RevealOnScroll' "$f" | tr -d ' ' | grep -q '^2$' || { echo "wrong RevealOnScroll count in $f"; FAIL=1; }; grep -n 'staggerChildren' "$f" | wc -l | tr -d ' ' | grep -q '^1$' || { echo "wrong staggerChildren count in $f"; FAIL=1; }; grep -n 'variants={fadeUp}' "$f" | wc -l | tr -d ' ' | grep -q '^3$' || { echo "wrong variants count in $f"; FAIL=1; }; done; grep -nE '<img|команда|керівник|обличчя|портрет' src/components/sections/home/TrustBlock.tsx | wc -l | tr -d ' ' | grep -q '^0$' || { echo "TrustBlock guard failed"; FAIL=1; }; if [ $FAIL -eq 0 ]; then npm run build 2>&1 | tail -3 | grep -qE '[0-9]+/[0-9]+ checks passed' && echo OK || { echo FAIL build; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - Both files import RevealOnScroll, motion, fadeUp
    - Both files have exactly 2 `<RevealOnScroll` occurrences (outer section + inner staggerChildren grid)
    - Both files have 3 `variants={fadeUp}` occurrences (one per cascade child)
    - TrustBlock defensive guard intact: 0 occurrences of `<img|команда|керівник|обличчя|портрет`
    - `npm run build` exits 0 (lint + check-brand 4/4 + bundle delta within budget)
    - Bundle delta: motionVariants now reachable (+~0.5 KB gzipped), RevealOnScroll now reachable (+~0.5 KB gzipped). Bundle target: ≤135 KB gzipped.
    - Combined: home page sections wrapped count for VALIDATION map row "ANI-02 SC#2 ≥ 18 below-fold sections" — this plan contributes 6 home reveals + several inner stagger reveals; Plan 05-05 delivers the rest.
  </done>
</task>

</tasks>

<verification>
- After all 3 tasks: `grep -rnc '<RevealOnScroll' src/components/sections/home/` returns:
  - BrandEssence: 2 (section + inner 4-card stagger per D-02)
  - ConstructionTeaser: 1 (section only)
  - ContactForm: 1 (section only)
  - PortfolioOverview: 2 (section + 3-card grid stagger)
  - MethodologyTeaser: 2 (section + 3-card grid stagger)
  - TrustBlock: 2 (section + 3-column grid stagger)
  - Hero: 0 (excluded — D-06)
  - Total home contribution: 10 RevealOnScroll occurrences
- Hero exclusion: `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` exits 1 (covers VALIDATION map row "Hero NOT wrapped")
- 80ms stagger evidence: `grep -rnE 'staggerChildren' src/components/sections/home/ | wc -l` returns 4 (BrandEssence, PortfolioOverview, MethodologyTeaser, TrustBlock — covers VALIDATION map row "80ms stagger cadence for card lists ≥1 match")
- `npm run build` exits 0 (full pipeline)
- Phase 5 SC#1 grep gate `! grep -rn 'transition=\{\{' src/` still exits 1 (no inline transition objects added — variants carry transition)
- Bundle: ≤135 KB gzipped (motionVariants ~0.3 KB + RevealOnScroll ~0.5 KB now reachable; ~67% of 200 KB Phase 6 budget)
</verification>

<success_criteria>
- [ ] All 6 home sections wrapped at section level: BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm
- [ ] Hero NOT wrapped (LCP target — D-06)
- [ ] BrandEssence 4-card grid uses 80ms stagger across 4 value cards via inner `<RevealOnScroll staggerChildren>` + `<motion.article variants={fadeUp}>` children (D-02)
- [ ] PortfolioOverview pipeline grid uses 80ms stagger across 3 cards via inner `<RevealOnScroll staggerChildren>` + `<motion.article variants={fadeUp}>` children
- [ ] MethodologyTeaser 3-card grid uses 80ms stagger
- [ ] TrustBlock 3-column legal table uses 80ms stagger (D-03)
- [ ] hover-card class on PortfolioOverview pipeline cards preserved (no regression of 05-02)
- [ ] TrustBlock defensive guard intact (no team-photo class words)
- [ ] `npm run build` exits 0 with check-brand 4/4 PASS
- [ ] Phase 5 SC#1 grep gate still clean (zero inline transition objects)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-04-reveal-home-page-SUMMARY.md` documenting:
- Per-section pattern used (simple `as="section"` vs section + inner staggerChildren grid)
- Verbatim diff of PortfolioOverview's pipeline grid (the most structurally complex change — replaces bare `<article>` with `<motion.article variants={fadeUp}>`)
- Bundle size delta (expected: motionVariants + RevealOnScroll now reachable, ~+1 KB gzipped)
- Confirmation of D-06 Hero exclusion
- Confirmation that hover-card consolidation from 05-02 is preserved on PortfolioOverview pipeline cards
</output>
