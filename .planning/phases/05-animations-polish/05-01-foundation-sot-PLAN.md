---
phase: 05-animations-polish
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/motionVariants.ts
  - src/index.css
autonomous: true
requirements: [ANI-02, ANI-04]
must_haves:
  truths:
    - "All Phase 5 motion consumers can import easings, durations, and variants from a single named-export module"
    - "Tailwind v4 utilities can reference --ease-brand for the @utility hover-card block created in 05-02"
  artifacts:
    - path: src/lib/motionVariants.ts
      provides: "easeBrand · durations · fadeUp · fade · stagger · pageFade · parallaxRange named exports"
      exports: [easeBrand, durations, fadeUp, fade, stagger, pageFade, parallaxRange]
      min_lines: 35
    - path: src/index.css
      provides: "--ease-brand CSS variable in @theme block"
      contains: "--ease-brand: cubic-bezier(0.22, 1, 0.36, 1)"
  key_links:
    - from: src/lib/motionVariants.ts
      to: "Tailwind v4 @theme --ease-brand"
      via: "lockstep coupling — same cubic-bezier curve in two physical representations"
      pattern: "cubic-bezier\\(0\\.22, 1, 0\\.36, 1\\)"
---

<objective>
Establish the Phase 5 motion single-source-of-truth (SOT). Create `src/lib/motionVariants.ts` with named exports per CONTEXT D-22, and add the `--ease-brand` CSS variable to `src/index.css` `@theme` per D-23. Both representations of the easing curve `cubic-bezier(0.22, 1, 0.36, 1)` MUST stay in lockstep — they are the JS-side and CSS-side of the same brand easing.

Purpose: Foundation for all subsequent Phase 5 plans. 05-02 (`@utility hover-card`) consumes `--ease-brand` via `var(--ease-brand)`. 05-03 (`<RevealOnScroll>`), 05-04..05-05 (reveal application), 05-06 (`<AnimatePresence>` + `pageFade`), 05-07 (Hero `parallaxRange`) all consume named exports from `motionVariants.ts`. NO CONSUMERS EXIST AT THIS PLAN — this plan creates the SOT only.

Output: `src/lib/motionVariants.ts` (~40 lines, 7 named exports) + 1-line `--ease-brand` declaration added to existing `@theme` block in `src/index.css`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/05-animations-polish/05-CONTEXT.md
@.planning/phases/05-animations-polish/05-RESEARCH.md
@.planning/phases/05-animations-polish/05-VALIDATION.md
@src/index.css
@src/lib/assetUrl.ts
</context>

<interfaces>
<!-- Existing @theme block in src/index.css (lines 8-26) — Phase 5 adds ONE line at the end of this block. No removal, no replacement. -->

From src/index.css `@theme` block:
```css
@theme {
  --color-bg:          #2F3640;
  --color-bg-surface:  #3D3B43;
  --color-bg-black:    #020A0A;
  --color-accent:      #C1F33D;
  --color-text:        #F5F7FA;
  --color-text-muted:  #A7AFBC;
  --font-sans: "Montserrat", system-ui, -apple-system, sans-serif;
  --spacing-rhythm-xs: 4px;
  --spacing-rhythm-sm: 8px;
  --spacing-rhythm-md: 16px;
  --spacing-rhythm-lg: 32px;
  --spacing-rhythm-xl: 64px;
}
```

Pattern from src/lib/assetUrl.ts — established conventions:
- Pure utility module with `@module` doc-block
- Named exports only (no default export)
- No React imports, no motion imports inside lib/

From `motion/react` (verified at runtime per RESEARCH §Standard Stack):
```ts
import type { Variants } from 'motion/react';
```

Phase 4 inline easing constant (proves canonical curve form, locked in 5 hover surfaces + StageFilter):
```
ease-[cubic-bezier(0.22,1,0.36,1)]
```
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/lib/motionVariants.ts with 7 named exports (D-22)</name>
  <read_first>
    - src/lib/assetUrl.ts (named-export + @module doc-block convention to follow)
    - src/components/sections/home/Hero.tsx (current consumer of `motion/react` imports — confirms `Variants` type path is `motion/react`)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-22 (verbatim variant shapes)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Code Examples Example 1 (verbatim file body)
  </read_first>
  <files>src/lib/motionVariants.ts</files>
  <behavior>
    - Test 1: `easeBrand` exported as `[0.22, 1, 0.36, 1] as const` — readonly tuple of length 4
    - Test 2: `durations` exported as `{ fast: 0.2, base: 0.4, slow: 1.2 } as const` — three numeric fields
    - Test 3: `fadeUp` Variants exports `hidden: { opacity: 0, y: 24 }` and `visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easeBrand } }`
    - Test 4: `fade` Variants exports `hidden: { opacity: 0 }` and `visible: { opacity: 1, transition: { duration: durations.base, ease: easeBrand } }` (no Y axis)
    - Test 5: `stagger` Variants parent variant: `hidden: {}` and `visible: { transition: { staggerChildren: 0.08, delayChildren: 0 } }`
    - Test 6: `pageFade` Variants — hidden opacity 0; visible opacity 1 with `duration: durations.base` ease `easeBrand`; exit opacity 0 with `duration: 0.35` ease `easeBrand` (350ms exit per SC#3, hardcoded inline per Claude's-Discretion call)
    - Test 7: `parallaxRange` exported as `[0, -100] as const` — readonly tuple consumed by Hero useTransform (D-28)
  </behavior>
  <action>
    Create new file at exact path `src/lib/motionVariants.ts` with this EXACT contents (verbatim from RESEARCH §Code Examples Example 1, D-22 verbatim):

    ```ts
    /**
     * @module lib/motionVariants
     *
     * Phase 5 SOT — variants, easings, durations for the Motion layer.
     *
     * Named exports per CONTEXT D-22 — NO namespace object, NO default export.
     * Consumers (Phase 5):
     *   - <RevealOnScroll> (Plan 05-03) consumes fadeUp · fade · stagger
     *   - <AnimatePresence> in Layout.tsx (Plan 05-06) consumes pageFade
     *   - Hero.tsx (Plan 05-07) consumes parallaxRange + easeBrand transitively
     *
     * COUPLING RULE — D-23: easeBrand here MUST stay in lockstep with the
     * --ease-brand CSS variable in src/index.css @theme block. Two physical
     * representations of the SAME brand cubic-bezier curve. If you change one,
     * change both. Drift means Tailwind hover utilities and Motion variants
     * animate on different curves — invisible regression on visual QA.
     *
     * Pure config module — NO React imports, NO component imports.
     * Type-only import of Variants from motion/react is permitted.
     */
    import type { Variants } from 'motion/react';

    export const easeBrand = [0.22, 1, 0.36, 1] as const;

    export const durations = {
      fast: 0.2,
      base: 0.4,
      slow: 1.2,
    } as const;

    export const fadeUp: Variants = {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: durations.base, ease: easeBrand },
      },
    };

    export const fade: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: durations.base, ease: easeBrand },
      },
    };

    export const stagger: Variants = {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0 },
      },
    };

    export const pageFade: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: durations.base, ease: easeBrand },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.35, ease: easeBrand },
      },
    };

    export const parallaxRange = [0, -100] as const;
    ```

    Doc-block self-screen (Phases 02-07 precedent): the JSDoc above does NOT contain the literals `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, or `/construction/`. The string `transition: {` appears only in TypeScript type annotations (which the regex `transition\{\{` does not match — `\{\{` requires double-open-brace). No collisions with check-brand greps.
  </action>
  <verify>
    <automated>npx tsx -e "const m = require('./src/lib/motionVariants.ts'); ['easeBrand','durations','fadeUp','fade','stagger','pageFade','parallaxRange'].forEach(k => { if (!(k in m)) throw new Error('missing export: '+k); }); console.log('OK')" 2>&1 || (grep -nE '^export const (easeBrand|durations|fadeUp|fade|stagger|pageFade|parallaxRange) ' src/lib/motionVariants.ts | wc -l | tr -d ' ' | grep -q '^7$' && echo OK || (echo FAIL && exit 1))</automated>
  </verify>
  <done>
    - File `src/lib/motionVariants.ts` exists
    - `grep -nE '^export const (easeBrand|durations|fadeUp|fade|stagger|pageFade|parallaxRange) ' src/lib/motionVariants.ts | wc -l` returns 7
    - `grep -nE 'duration: 0\.35|duration: durations\.base' src/lib/motionVariants.ts | wc -l` returns ≥ 2 (covers VALIDATION map row for ANI-04 SC#3)
    - `grep -n 'cubic-bezier' src/lib/motionVariants.ts` returns 0 (we use the array form, not the CSS string form, in JS)
    - `npm run lint` (= `tsc --noEmit`) exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add --ease-brand CSS variable to @theme block in src/index.css (D-23)</name>
  <read_first>
    - src/index.css (current @theme block — must verify exact line where to insert)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-23 (declares the CSS var must live in @theme)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Code Examples Example 3 (verbatim form)
  </read_first>
  <files>src/index.css</files>
  <behavior>
    - Test 1: `--ease-brand: cubic-bezier(0.22, 1, 0.36, 1);` declared inside the `@theme {...}` block (NOT in `@layer base`, NOT outside @theme)
    - Test 2: Existing `@theme` token declarations (--color-bg, --color-bg-surface, --color-bg-black, --color-accent, --color-text, --color-text-muted, --font-sans, --spacing-rhythm-xs..xl) all preserved unchanged
    - Test 3: New CSS var positioned after `--spacing-rhythm-xl` (last existing token), under a `/* Motion */` section comment
    - Test 4: paletteWhitelist() check-brand still PASSES because the new declaration contains zero hex literals
  </behavior>
  <action>
    Edit `src/index.css`. Inside the `@theme {...}` block (currently lines 8-26), add a new section AFTER the spacing-rhythm tokens and BEFORE the closing `}` of `@theme`. The exact insertion is two lines (one comment + one declaration):

    Insert at end of @theme block, before its closing `}`:

    ```css

      /* Motion — Phase 5 D-23. Coupled with easeBrand in src/lib/motionVariants.ts (lockstep rule). */
      --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
    ```

    The full @theme block AFTER this edit MUST look exactly like this (existing content preserved verbatim, two lines added at end):

    ```css
    @theme {
      /* Palette — canonical hexes, verified WCAG contrast */
      --color-bg:          #2F3640;
      --color-bg-surface:  #3D3B43;
      --color-bg-black:    #020A0A;
      --color-accent:      #C1F33D;
      --color-text:        #F5F7FA;
      --color-text-muted:  #A7AFBC;

      /* Typography */
      --font-sans: "Montserrat", system-ui, -apple-system, sans-serif;

      /* Spacing rhythm — brand-system.md §7 (brandbook gap; proposed scale) */
      --spacing-rhythm-xs: 4px;
      --spacing-rhythm-sm: 8px;
      --spacing-rhythm-md: 16px;
      --spacing-rhythm-lg: 32px;
      --spacing-rhythm-xl: 64px;

      /* Motion — Phase 5 D-23. Coupled with easeBrand in src/lib/motionVariants.ts (lockstep rule). */
      --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
    }
    ```

    Do NOT modify any other CSS in the file. The `@layer base { ... }` block stays untouched.

    Doc-block self-screen: the comment text contains no literals from check-brand greps (no `Pictorial`, `Rubikon`, `transition={{`, `/renders/`, `/construction/`).
  </action>
  <verify>
    <automated>grep -n -- '--ease-brand: cubic-bezier(0.22, 1, 0.36, 1);' src/index.css | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE '^@theme \{' src/index.css | wc -l | tr -d ' ' | grep -q '^1$' && npx tsx scripts/check-brand.ts 2>&1 | tail -2 | grep -q '4/4 checks passed' && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `grep -n -- '--ease-brand:' src/index.css` returns exactly 1 match (covers VALIDATION map ANI-02 SC#1 row)
    - The match is positioned inside the `@theme { ... }` block (verified by reading file — line number falls between `@theme {` line and its matching `}`)
    - `npx tsx scripts/check-brand.ts` exits 0 (4/4 PASS — palette whitelist unaffected by CSS-var declaration)
    - All 6 brand color tokens still present in @theme block: `grep -cE -- '--color-(bg|bg-surface|bg-black|accent|text|text-muted)' src/index.css` returns 6
    - `npm run build` (full prebuild + lint + vite + postbuild check-brand) exits 0
  </done>
</task>

</tasks>

<verification>
After both tasks: run `npm run build` and confirm:
- `tsc --noEmit` clean (motionVariants.ts type-checks against motion 12.38.0 Variants type)
- vite build succeeds and emits CSS containing `--ease-brand` (`grep -- '--ease-brand' dist/assets/*.css` returns ≥1 hit)
- postbuild check-brand 4/4 PASS
- bundle size unchanged from Phase 4 baseline 131.60 kB gzipped (motionVariants.ts has zero consumers in this plan; tree-shaking drops it from the bundle until 05-02..05-07 import from it)
</verification>

<success_criteria>
- [ ] `src/lib/motionVariants.ts` exists with 7 named exports verified by grep
- [ ] `--ease-brand` declared inside @theme block in src/index.css
- [ ] `npm run build` exits 0 (lint + check-brand 4/4 + vite build)
- [ ] No consumers reference these exports yet (this plan is foundation only — 05-02..05-07 are the consumers)
- [ ] Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transition objects introduced — variants in motionVariants.ts use `transition: {` which is TypeScript object syntax, not the JSX prop pattern `transition={{`)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-01-foundation-sot-SUMMARY.md` documenting:
- Verbatim final shape of motionVariants.ts (so 05-02..05-07 SUMMARYs can cite it)
- Confirmation that --ease-brand is the second physical representation of the curve already locked across Phase 4's 5 hover surfaces (no semantic drift, just SOT lift)
- Bundle size delta (expected: 0 — no consumers yet)
- Doc-block self-screen confirmed clean
</output>
