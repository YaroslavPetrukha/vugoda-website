---
phase: 05-animations-polish
plan: 02
type: execute
wave: 2
depends_on: [05-01-foundation-sot]
files_modified:
  - src/index.css
  - src/components/sections/home/PortfolioOverview.tsx
  - src/components/sections/projects/FlagshipCard.tsx
  - src/components/sections/projects/PipelineCard.tsx
  - src/components/sections/zhk/ZhkGallery.tsx
  - src/components/sections/construction-log/MonthGroup.tsx
autonomous: true
requirements: [ANI-02, ANI-04]
must_haves:
  truths:
    - "All 5 Phase 4 hover surfaces use the consolidated `hover-card` utility — visually byte-equivalent to the Phase 4 inline class string"
    - "The `@utility hover-card` block in src/index.css is the SINGLE place that defines the hover triple-effect (transform + shadow + transition)"
    - "Reduced-motion neutralisation lives ONLY inside the @utility @media block — no `motion-reduce:` Tailwind variants remain inline on the 5 surfaces"
  artifacts:
    - path: src/index.css
      provides: "@utility hover-card block consuming var(--ease-brand)"
      contains: "@utility hover-card"
  key_links:
    - from: "src/index.css @utility hover-card"
      to: "src/index.css @theme --ease-brand"
      via: "var(--ease-brand) reference inside transition-timing-function"
      pattern: "var\\(--ease-brand\\)"
    - from: "5 surface .tsx files"
      to: "src/index.css @utility hover-card"
      via: "Tailwind class string `hover-card` on outer card element"
      pattern: "hover-card"
---

<objective>
Consolidate the duplicated Phase 4 hover triple-effect class string (200 chars × 5 occurrences = ~1000 chars of repetition) into a single Tailwind v4 `@utility hover-card` block in `src/index.css` per CONTEXT D-24, then replace all 5 surface call sites with the new utility class. Per RESEARCH Risk 3 recommendation, ALSO remove the inline `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants from each surface — single source of reduced-motion behaviour lives inside the `@utility`'s built-in `@media (prefers-reduced-motion: reduce)` block.

Purpose: DRY consolidation. Future hover-curve retunes are a single-file edit. Reduced-motion behaviour is auditable in one place. Visually byte-equivalent to current Phase 4 output (RESEARCH §Pitfall verified — `paletteWhitelist()` accepts `rgba(193, 243, 61, 0.15)` literal already; live Phase 4 build PASSES check-brand 4/4 with the same rgba inlined 5 times).

Output: 1 new `@utility hover-card { ... }` block added to `src/index.css` after the `@layer base` block; 5 surface .tsx files have their long hover-class string replaced with the literal class name `hover-card` and lose the `motion-reduce:hover:*` variants.
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
@src/index.css
@src/components/sections/home/PortfolioOverview.tsx
@src/components/sections/projects/FlagshipCard.tsx
@src/components/sections/projects/PipelineCard.tsx
@src/components/sections/zhk/ZhkGallery.tsx
@src/components/sections/construction-log/MonthGroup.tsx
</context>

<interfaces>
<!-- Phase 4 inline hover-class string (literally identical across 5 surfaces, verified by grep): -->

```
transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none
```

That entire string MUST be replaced with the single token: `hover-card`.

Surface 1 — `src/components/sections/home/PortfolioOverview.tsx:59`:
```tsx
<article key={project.slug} className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
```

Surface 2 — `src/components/sections/projects/FlagshipCard.tsx:32`:
```tsx
<article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
```

Surface 3 — `src/components/sections/projects/PipelineCard.tsx:39`:
```tsx
<article className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
```

Surface 4 — `src/components/sections/zhk/ZhkGallery.tsx:53`:
```tsx
className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
```

Surface 5 — `src/components/sections/construction-log/MonthGroup.tsx:59`:
```tsx
className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
```

After this plan, surfaces 4 and 5 retain their `focus-visible:outline*` classes (NOT part of hover-card consolidation — those are accessibility, not motion).
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Add @utility hover-card block to src/index.css (D-24)</name>
  <read_first>
    - src/index.css (full file — must understand where @utility goes relative to @theme and @layer base)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-24 (verbatim CSS body)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Code Examples Example 3 (verbatim CSS form)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pitfall paletteWhitelist verification (rgba accepted as-is)
  </read_first>
  <files>src/index.css</files>
  <behavior>
    - Test 1: `@utility hover-card { ... }` block exists at end of src/index.css, AFTER the `@layer base` block
    - Test 2: Inside the block: `transition-property: transform, box-shadow, background-color;` — matches the 3 properties from Phase 4 inline class
    - Test 3: Inside the block: `transition-duration: 200ms;` — matches Phase 4's `duration-200`
    - Test 4: Inside the block: `transition-timing-function: var(--ease-brand);` — references the SOT CSS var from 05-01
    - Test 5: Inside `&:hover { ... }`: `transform: scale(1.02);` and `box-shadow: 0 0 24px rgba(193, 243, 61, 0.15);` — matches Phase 4's `hover:scale-[1.02]` + `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`
    - Test 6: Inside `@media (prefers-reduced-motion: reduce) { &:hover { ... } }`: `transform: scale(1);` and `box-shadow: none;` — matches Phase 4's `motion-reduce:hover:scale-100` + `motion-reduce:hover:shadow-none`
    - Test 7: paletteWhitelist() check still PASSES (rgba decimal triplet is invisible to the `#[0-9A-Fa-f]{3,6}` regex per RESEARCH live verification)
  </behavior>
  <action>
    Edit `src/index.css`. Append a new section AFTER the closing `}` of the existing `@layer base` block (currently the last block in the file). The exact addition is:

    ```css

    /*
     * Hover-card consolidation — Phase 5 D-24.
     * Replaces the Phase 4 inline hover-class string previously duplicated across
     * 5 surfaces (home PortfolioOverview pipeline cards, FlagshipCard outer
     * article, PipelineCard inner article, ZhkGallery thumb buttons, MonthGroup
     * thumb buttons). Single source of truth for the brand hover triple-effect:
     *   - transform: scale(1.02)
     *   - box-shadow: 0 0 24px rgba accent at 15%
     *   - transition: 200ms cubic-bezier(0.22, 1, 0.36, 1)
     *
     * Reduced-motion neutralisation lives in the nested @media block below —
     * no Tailwind motion-reduce: variants are needed at consumer sites (RESEARCH
     * Risk 3: single source of RM behaviour).
     *
     * Couples with --ease-brand declared in @theme above (D-23 lockstep rule).
     */
    @utility hover-card {
      transition-property: transform, box-shadow, background-color;
      transition-duration: 200ms;
      transition-timing-function: var(--ease-brand);

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 0 24px rgba(193, 243, 61, 0.15);
      }

      @media (prefers-reduced-motion: reduce) {
        &:hover {
          transform: scale(1);
          box-shadow: none;
        }
      }
    }
    ```

    Do NOT modify the existing `@theme` or `@layer base` blocks — they stay byte-identical to their post-05-01 form.

    Doc-block self-screen: the comment uses no literals from check-brand greps — does NOT contain `Pictorial`, `Rubikon`, `transition={{`, `/renders/`, or `/construction/`. The literal `0 0 24px rgba(193, 243, 61, 0.15)` contains only decimal RGBA, not hex — invisible to `paletteWhitelist()`.
  </action>
  <verify>
    <automated>grep -nE '@utility hover-card' src/index.css | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE '@media \(prefers-reduced-motion' src/index.css | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'var(--ease-brand)' src/index.css | wc -l | tr -d ' ' | grep -q '^1$' && npx tsx scripts/check-brand.ts 2>&1 | tail -2 | grep -qE '[0-9]+/[0-9]+ checks passed' && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `grep -nE '@utility hover-card' src/index.css` returns exactly 1 match (covers VALIDATION map row "05-02 SC#1 / D-24")
    - `grep -nE '@media \(prefers-reduced-motion' src/index.css` returns 1 match (covers ANI-04 SC#4 row)
    - `grep -n 'var(--ease-brand)' src/index.css` returns 1 match (lockstep coupling with 05-01)
    - `grep -n 'rgba(193, 243, 61, 0.15)' src/index.css` returns 1 match (canonical accent-15% glow value)
    - `npx tsx scripts/check-brand.ts` exits 0 (4/4 PASS — palette whitelist invariant maintained)
    - `npm run build` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Replace inline hover-class string with `hover-card` utility on 5 surfaces (D-24 + Risk 3)</name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (line 59 is the article element to edit)
    - src/components/sections/projects/FlagshipCard.tsx (line 32 is the article element)
    - src/components/sections/projects/PipelineCard.tsx (line 39 is the article element)
    - src/components/sections/zhk/ZhkGallery.tsx (line 53 is the button element — preserve focus-visible classes)
    - src/components/sections/construction-log/MonthGroup.tsx (line 59 is the button element — preserve focus-visible classes)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-24 (replacement spec)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Risk 3 (remove motion-reduce: variants)
  </read_first>
  <files>
    src/components/sections/home/PortfolioOverview.tsx,
    src/components/sections/projects/FlagshipCard.tsx,
    src/components/sections/projects/PipelineCard.tsx,
    src/components/sections/zhk/ZhkGallery.tsx,
    src/components/sections/construction-log/MonthGroup.tsx
  </files>
  <behavior>
    - Test 1 (PortfolioOverview line 59 article): className becomes exactly `flex flex-col gap-4 bg-bg-surface hover-card`
    - Test 2 (FlagshipCard line 32 article): className becomes exactly `mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] hover-card`
    - Test 3 (PipelineCard line 39 article): className becomes exactly `flex flex-col gap-4 bg-bg-surface hover-card`
    - Test 4 (ZhkGallery line 53 button): className becomes `block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
    - Test 5 (MonthGroup line 59 button): className becomes `block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
    - Test 6: Across all 5 files, NO occurrences remain of: `transition-[transform,box-shadow,background-color]`, `ease-[cubic-bezier(0.22,1,0.36,1)]`, `hover:scale-[1.02]`, `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`, `motion-reduce:hover:scale-100`, `motion-reduce:hover:shadow-none`
    - Test 7: All visual chrome unchanged — the rendered CSS via Tailwind v4's `@utility` produces byte-equivalent output to Phase 4
  </behavior>
  <action>
    For each of the 5 files below, locate the className string described in the Interfaces block above and apply the EXACT replacement specified. Do NOT touch any other JSX in those files. Do NOT modify any imports. Do NOT modify any of the doc-block JSDoc comments (those reference Phase 4 D-31..D-35 in past tense — leaving them as historical record).

    **File 1 — `src/components/sections/home/PortfolioOverview.tsx`:**
    On line 59 (the article element inside `pipelineGridProjects.map`), change:
    ```tsx
    <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```
    to:
    ```tsx
    <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface hover-card">
    ```

    **File 2 — `src/components/sections/projects/FlagshipCard.tsx`:**
    On line 32 (the outer article element), change:
    ```tsx
    <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```
    to:
    ```tsx
    <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] hover-card">
    ```

    **File 3 — `src/components/sections/projects/PipelineCard.tsx`:**
    On line 39 (inside the const inner = (...) JSX block, the article element), change:
    ```tsx
    <article className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```
    to:
    ```tsx
    <article className="flex flex-col gap-4 bg-bg-surface hover-card">
    ```

    **File 4 — `src/components/sections/zhk/ZhkGallery.tsx`:**
    On line 53 (the button element inside `project.renders.map`), change:
    ```tsx
    className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    ```
    to:
    ```tsx
    className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    ```

    **File 5 — `src/components/sections/construction-log/MonthGroup.tsx`:**
    On line 59 (the button element inside `month.photos.map`), change:
    ```tsx
    className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    ```
    to:
    ```tsx
    className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    ```

    All other code (state, props, JSX structure, ResponsivePicture children, Lightbox children, focus-visible classes) MUST remain byte-identical to its pre-edit form.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/components/sections/home/PortfolioOverview.tsx src/components/sections/projects/FlagshipCard.tsx src/components/sections/projects/PipelineCard.tsx src/components/sections/zhk/ZhkGallery.tsx src/components/sections/construction-log/MonthGroup.tsx; do grep -q 'hover-card' "$f" || { echo "MISSING hover-card in $f"; FAIL=1; }; grep -q 'transition-\[transform,box-shadow,background-color\]' "$f" && { echo "STALE inline transition in $f"; FAIL=1; }; grep -q 'motion-reduce:hover:scale-100' "$f" && { echo "STALE motion-reduce variant in $f"; FAIL=1; }; done; if [ $FAIL -eq 0 ]; then npm run build 2>&1 | tail -5 | grep -qE '[0-9]+/[0-9]+ checks passed' && echo OK || { echo FAIL build; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - `grep -rn 'hover-card' src/components/ | wc -l` returns ≥ 5 (covers VALIDATION map row "05-02 SC#1 / D-24" — 5 surfaces consume)
    - `grep -rn 'transition-\[transform,box-shadow,background-color\]' src/components/ | wc -l` returns 0 (Phase 4 inline string fully removed from these 5 surfaces)
    - `grep -rn 'motion-reduce:hover:scale-100' src/components/ | wc -l` returns 0 (RM Tailwind variants fully removed; @utility @media block carries the equivalent)
    - `grep -rn 'motion-reduce:hover:shadow-none' src/components/ | wc -l` returns 0
    - `grep -rn 'rgba(193,243,61,0.15)' src/components/ | wc -l` returns 0 (rgba literal moved into @utility block — only place it lives now)
    - `npm run build` exits 0 (lint + check-brand 4/4 + bundle byte-equivalent or smaller — class string saved ≈ 200 chars × 5 occurrences = ~1KB pre-gzip; gzip will deflate further)
    - StageFilter.tsx is INTENTIONALLY unmodified (its `ease-[cubic-bezier(0.22,1,0.36,1)]` is on a chip background-color transition, not a hover triple-effect — out of scope for hover-card)
  </done>
</task>

</tasks>

<verification>
- Run `npm run build` — full pipeline must pass: prebuild + lint + vite + postbuild check-brand 4/4
- Bundle size: expected slight reduction (~50-200B gzipped) due to class-string deduplication; check `npm run build 2>&1 | grep gzipped` total stays well under 200KB
- Visual: manual side-by-side check at `npm run dev` of one surface per type (PortfolioOverview pipeline grid hover, FlagshipCard hover, PipelineCard hover, ZhkGallery thumb hover, MonthGroup thumb hover) — confirm scale and glow visually identical to Phase 4 (deferred to Phase 5 final verification per VALIDATION manual gates)
- Reduced-motion: DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → verify hover on all 5 surfaces is neutral (no scale, no glow) — confirms @utility @media block is operative
</verification>

<success_criteria>
- [ ] `@utility hover-card` block exists in src/index.css (1 occurrence)
- [ ] All 5 surface .tsx files use `hover-card` token in className string
- [ ] No surface .tsx file contains the inline transition/hover/motion-reduce class fragments
- [ ] `npm run build` exits 0
- [ ] check-brand 4/4 PASS (palette whitelist not regressed by rgba in CSS @utility block)
- [ ] Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transition objects added)
- [ ] D-24 satisfied: hover triple-effect is consolidated to a single CSS source of truth
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-02-hover-card-utility-SUMMARY.md` documenting:
- Verbatim final form of the @utility hover-card block (so verification plans + Phase 6 can reference)
- Confirmation of byte-equivalence at rendered-CSS layer (the `@utility` directive emits the same property/value pairs as the Phase 4 inline class)
- Bundle size delta vs Phase 4 baseline (expected: small reduction)
- Confirmation that paletteWhitelist() PASSES with rgba(193, 243, 61, 0.15) literal in @utility block (RESEARCH live verification reproduced)
- Note for Phase 6 QA: 5 visual hover-comparison screenshots needed (PortfolioOverview pipeline card, FlagshipCard, PipelineCard, ZhkGallery thumb, MonthGroup thumb)
</output>
