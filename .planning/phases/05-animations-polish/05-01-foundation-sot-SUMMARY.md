---
phase: 05-animations-polish
plan: 01
subsystem: ui
tags: [motion, tailwind-v4, css-variables, easing, variants, sot]

requires:
  - phase: 03-brand-primitives-home-page
    provides: "Hero.tsx parallax pattern (useScroll + useTransform), inline outputRange [0, -100] (Plan 03-04 D-04) — magnitude that 05-07 will swap for parallaxRange import"
  - phase: 04-portfolio-construction-log-contact
    provides: "Hover triple-effect inline class string with cubic-bezier(0.22, 1, 0.36, 1) locked across 5 hover surfaces + StageFilter (D-32) — first physical representation of the brand easing curve"

provides:
  - "src/lib/motionVariants.ts SOT — 7 named exports (easeBrand, durations, fadeUp, fade, stagger, pageFade, parallaxRange) consumable by all subsequent Phase 5 plans"
  - "--ease-brand CSS variable in @theme — second physical representation of the same brand easing curve, available to Tailwind v4 generated utilities (ease-brand) and any custom @utility blocks (Plan 05-02)"
  - "Lockstep coupling rule documented in motionVariants.ts JSDoc — if the curve changes, both files change together"

affects:
  - 05-02-hover-card-utility (consumes --ease-brand via var(--ease-brand) inside @utility hover-card)
  - 05-03-reveal-on-scroll-component (consumes fadeUp · fade · stagger · easeBrand as default variants)
  - 05-04-reveal-home-page (consumes RevealOnScroll which consumes the SOT)
  - 05-05a-reveal-zhk-page (consumes fade variant for ZhkHero LCP-sensitive opacity-only reveal per D-09)
  - 05-05b-reveal-other-routes (consumes fadeUp default + stagger for card lists)
  - 05-06-animate-presence-layout (consumes pageFade variant — 350ms exit / 400ms enter per SC#3)
  - 05-07-hero-session-skip (consumes parallaxRange + easeBrand transitively)
  - 05-08-no-inline-transition-check (greps src/ for transition={{ — SOT pattern eliminates the need)

tech-stack:
  added: []
  patterns:
    - "JS/CSS dual-representation lockstep — same easing curve in motionVariants.ts (4-tuple) and index.css @theme (cubic-bezier string); 3rd codebase instance after brand palette (Phase 1 D-19) and check-brand whitelist (Phase 2 D-26)"
    - "Pure-config lib module (no React imports, no component imports, type-only Variants import from motion/react) — same boundary as src/lib/{assetUrl.ts, stages.ts}"
    - "Named exports only (no namespace object, no default export) — extends src/lib convention to motion-config surface"

key-files:
  created:
    - "src/lib/motionVariants.ts (~70 lines, 7 named exports)"
  modified:
    - "src/index.css (+1 motion section comment, +1 --ease-brand declaration inside @theme block)"

key-decisions:
  - "Doc-block self-screen at write-time prevented Rule 3 collision — initial verbatim plan TSX contained literal 'cubic-bezier' in the COUPLING RULE paragraph, but the plan's own done criteria asserted `grep -n 'cubic-bezier' src/lib/motionVariants.ts` returns 0; rephrased to 'CSS-string form there' without the literal. This is the 9th codebase occurrence of the planner-template smell (after 02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2; 03-08 was the only zero-fix plan)."
  - "Plan's verify regex `^export const (NAMES) ` (trailing space-required) only matched 3/7 exports because typed exports use colon: `export const fadeUp: Variants =`. The 4 typed exports use ` :` not ` =`. Functional file is correct (all 7 exports verified via `^export const` direct count + manual grep). Plan's verify regex is buggy — future Phase 5 plans should use `[ :]` character class instead of literal space."
  - "pageFade exit duration hardcoded inline as 0.35 (per Specifics — 'single-use config, not a primitive'); enter duration uses durations.base (0.4) named reference. Asymmetric on purpose — exit is route-specific timing per SC#3, enter is the canonical reveal timing."

patterns-established:
  - "Phase 5 SOT pattern: lib/motionVariants.ts owns easings + durations + variants; @theme owns the CSS-side mirror of the same easing constant; consumers import named exports + use Tailwind ease-brand utility"
  - "4-tuple `[0.22, 1, 0.36, 1] as const` is the JS canonical form (readonly tuple, type-narrows to `readonly [number, number, number, number]`); cubic-bezier(0.22, 1, 0.36, 1) string is the CSS canonical form. Drift between them is invisible visual regression — CONTEXT D-23 + JSDoc COUPLING RULE block enforce manual lockstep"

requirements-completed: [ANI-02, ANI-04]
# Note: ANI-02 and ANI-04 are PARTIALLY satisfied by this plan (SOT foundation only).
# Full closure requires 05-02..05-07 to consume the SOT. Marked complete here per the
# plan's frontmatter requirements field; verifier may reopen if they assess "partial vs full".

duration: 10m
started: 2026-04-26T05:51:23Z
completed: 2026-04-26T06:01:32Z
tasks: 2
files_modified: 2
---

# Phase 5 Plan 01: Motion SOT Foundation Summary

**Phase 5 single-source-of-truth shipped: `src/lib/motionVariants.ts` with 7 named exports (easeBrand · durations · fadeUp · fade · stagger · pageFade · parallaxRange) + lockstep `--ease-brand` CSS variable in `@theme` — zero consumers in this plan, foundation only.**

## Performance

- **Duration:** 10 min 9 s
- **Started:** 2026-04-26T05:51:23Z
- **Completed:** 2026-04-26T06:01:32Z
- **Tasks:** 2 (both `type="auto"`, no TDD, no checkpoints)
- **Files created:** 1 (`src/lib/motionVariants.ts`)
- **Files modified:** 1 (`src/index.css`)
- **Build status:** `npm run build` exits 0 (tsc clean → vite 5.64s → postbuild check-brand 4/4 PASS)
- **Bundle JS:** 440.68 kB raw / **135.62 kB gzipped** (was 131.60 kB at end of Phase 3 close in STATE.md; Phase 4's net additions account for the ~4 kB delta — motionVariants.ts itself is tree-shaken because zero consumers exist in this plan, verified via `grep -c 'easeBrand\|parallaxRange\|fadeUp' dist/assets/index-*.js` returning 0)
- **Bundle CSS:** 36.57 kB raw / 7.26 kB gzipped — `--ease-brand` declaration confirmed in `dist/assets/index-*.css` (`grep -c -- '--ease-brand' dist/assets/index-*.css` returns 1)
- **SC#5 grep gate (Phase 5 anti-pattern):** `grep -rn 'transition={{' src/` returns no matches (exit 1) — clean

## Accomplishments

1. **`src/lib/motionVariants.ts` created** with 7 named exports per CONTEXT D-22 verbatim:
   - `easeBrand` — `[0.22, 1, 0.36, 1] as const` (readonly 4-tuple)
   - `durations` — `{ fast: 0.2, base: 0.4, slow: 1.2 } as const` (200/400/1200ms per SC#1)
   - `fadeUp` — `Variants` reveal default: hidden `opacity:0, y:24` → visible at `durations.base + easeBrand`
   - `fade` — `Variants` opacity-only sibling for LCP-sensitive surfaces (D-09)
   - `stagger` — `Variants` parent with `staggerChildren: 0.08, delayChildren: 0` (D-02 universal 80ms)
   - `pageFade` — `Variants` for `<AnimatePresence>` with explicit `exit` state at 0.35s + `easeBrand` (350ms exit per SC#3 verbatim, asymmetric to 400ms enter)
   - `parallaxRange` — `[0, -100] as const` (the magnitude pair Hero.tsx will consume in 05-07 per D-28)

2. **`--ease-brand: cubic-bezier(0.22, 1, 0.36, 1)`** added inside `@theme` block in `src/index.css`, positioned after the spacing-rhythm tokens with a `/* Motion — Phase 5 D-23. Coupled with easeBrand in src/lib/motionVariants.ts (lockstep rule). */` section comment. Tailwind v4 auto-generates the `ease-brand` utility from this `--ease-*` token namespace, so 05-02's `@utility hover-card` block can reference `var(--ease-brand)` directly.

3. **Lockstep verification:** `0.22, 1, 0.36, 1` appears in BOTH files in their canonical forms — array literal in `motionVariants.ts:24`, function-arg list in `index.css:28`. Drift between them is now flagged in the `motionVariants.ts` JSDoc COUPLING RULE block as an invisible regression risk.

## Verbatim final shape of `src/lib/motionVariants.ts`

So 05-02 .. 05-07 SUMMARYs and any cross-plan reviewer can cite without re-reading the source:

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
 * representations of the SAME brand easing curve (4-tuple here, CSS-string
 * form there). If you change one, change both. Drift means Tailwind hover
 * utilities and Motion variants animate on different curves — invisible
 * regression on visual QA.
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

## Curve continuity confirmation

The brand easing curve `cubic-bezier(0.22, 1, 0.36, 1)` is now expressed in TWO physical representations across the codebase, locked in step:

| Representation | Location | Form |
|---|---|---|
| JS 4-tuple | `src/lib/motionVariants.ts:24` (`easeBrand`) | `[0.22, 1, 0.36, 1] as const` |
| CSS string | `src/index.css:28` (`--ease-brand`) | `cubic-bezier(0.22, 1, 0.36, 1)` |

Phase 4 D-32 locked this curve inline across 5 hover surfaces (PortfolioOverview pipeline cards, FlagshipCard, PipelineCard, ZhkGallery thumbs, MonthGroup thumbs) + StageFilter — Plan 05-02 will absorb those 5 inline copies into `@utility hover-card` referencing `var(--ease-brand)`. **No semantic drift in Plan 05-01: just SOT lift.** The curve number is identical (4 numbers, 2 representations); only the storage location changes.

## Task Commits

Each task committed atomically:

1. **Task 1: Create src/lib/motionVariants.ts (D-22)** — `2fcfa03` (feat)
2. **Task 2: Add --ease-brand to @theme in src/index.css (D-23)** — `fd94222` (feat)

Final docs/state commit (this SUMMARY + STATE/ROADMAP updates) — appended after this writeup.

## Files Created/Modified

- **Created:** `src/lib/motionVariants.ts` — 69 lines, 7 named exports, type-only Motion import. Pure-config module; consumers in Plans 05-02..05-07.
- **Modified:** `src/index.css` — added 2 lines inside `@theme` block (1 section comment + 1 `--ease-brand` declaration). All existing brand tokens preserved unchanged. `@layer base { ... }` unchanged.

## Decisions Made

1. **Hardcoded 0.35 for `pageFade.exit.transition.duration`** (rather than a `durations.exit = 0.35` named field). Single-use config; the SC#3 «350ms exit» is route-fade-specific, not a generic motion primitive. CONTEXT Claude's-Discretion section recommended hardcoded inline; followed verbatim.
2. **Kept `parallaxRange` in `motionVariants.ts`** (not in a sibling `motionConfig.ts`). CONTEXT Claude's-Discretion recommended same-file for proximity to `easeBrand` and `durations`; followed.
3. **Doc-block self-screen applied at write-time** — initial verbatim plan TSX contained the literal word `cubic-bezier` in the COUPLING RULE paragraph; same paragraph was contradicted by the plan's done criteria #3 (`grep -n 'cubic-bezier' src/lib/motionVariants.ts` returns 0). Rephrased the JSDoc to "Two physical representations of the SAME brand easing curve (4-tuple here, CSS-string form there)" without the literal word. **9th codebase occurrence of the planner-template smell** (per Plan 03-08 STATE.md note that pre-screen + 9 prior occurrences = confirmed pattern). Phase 5 plans 05-02..05-08 should pre-screen `<action>` JSDoc against `<verify>` and `<done>` regex battery before issuing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Doc-block self-consistency: removed `cubic-bezier` literal from JSDoc**
- **Found during:** Task 1 verification (running done-criteria #3: `grep -n 'cubic-bezier' src/lib/motionVariants.ts` returns 0)
- **Issue:** The plan's verbatim `<action>` TSX shipped JSDoc text reading «Two physical representations of the SAME brand cubic-bezier curve» — but the plan's own done-criteria #3 asserts the file must NOT contain `cubic-bezier`. Rule 3 self-consistency violation.
- **Fix:** Rephrased the JSDoc paragraph to «Two physical representations of the SAME brand easing curve (4-tuple here, CSS-string form there)» — preserves the meaning, drops the literal word.
- **Files modified:** `src/lib/motionVariants.ts` (JSDoc paragraph only; substantive code byte-identical to plan)
- **Verification:** `grep -n 'cubic-bezier' src/lib/motionVariants.ts` returns 0 matches.
- **Committed in:** `2fcfa03` (folded into Task 1 commit before staging)

---

**Total deviations:** 1 auto-fixed (Rule 3 — blocking)
**Impact on plan:** Zero — substantive code matches plan verbatim. Only documentation prose changed to satisfy plan's own grep gate. Same precedent as Plans 02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2.

## Doc-block self-screen (per plan output spec)

- **`src/lib/motionVariants.ts` JSDoc forbidden-literal grep:**
  - `transition={{` — 0 matches (TS object syntax `transition: {` does not match the JSX-prop double-brace form)
  - `Pictorial` — 0 matches
  - `Rubikon` — 0 matches
  - `/renders/` — 0 matches
  - `/construction/` — 0 matches
  - `cubic-bezier` — 0 matches (after fix)
  - **Result: clean**
- **`src/index.css` motion-section-comment forbidden-literal grep:**
  - `Pictorial`, `Rubikon`, `transition={{`, `/renders/`, `/construction/` — all 0 matches
  - **Result: clean**

## Issues Encountered

- **Plan's `<verify>` regex bug:** the plan's automated grep `^export const (easeBrand|durations|fadeUp|fade|stagger|pageFade|parallaxRange) ` (trailing literal space) returned 3 not 7 because the four typed exports (`fadeUp: Variants`, `fade: Variants`, `stagger: Variants`, `pageFade: Variants`) use a colon `:` after the name, not a space. Worked around with the alternate regex `[ :]` character class — returned 7. **Plan's verify gate is buggy; functional file is correct.** Recorded as guidance for Phase 5 planner: use `[ :]` character class for typed-export grep gates.

## Next Plan (05-02) Readiness

- **`--ease-brand` available** — Plan 05-02's `@utility hover-card` block can reference `var(--ease-brand)` directly. Tailwind v4 will also generate the `ease-brand` utility for class-string usage if any consumer needs it.
- **`easeBrand` JS array available** — Plan 05-03's `<RevealOnScroll>` and Plan 05-06's `<AnimatePresence>` can import `easeBrand` from `'../lib/motionVariants'` (or `'../../lib/motionVariants'` depending on consumer location); type narrows to `readonly [0.22, 1, 0.36, 1]`.
- **Tree-shaking confirmed** — motionVariants exports are absent from `dist/assets/index-*.js` until a consumer imports them. Plan 05-02 will be the first consumer (via CSS variable, not JS import — JS-side first consumer is 05-03 `<RevealOnScroll>`).
- **CONTEXT D-22 / D-23 closed** — both decisions are now physically present in code; downstream plans cite this SUMMARY for verbatim shape.

## Self-Check: PASSED

- `src/lib/motionVariants.ts` exists — FOUND
- `src/index.css` modified with `--ease-brand` — FOUND (line 28)
- Commit `2fcfa03` exists — FOUND
- Commit `fd94222` exists — FOUND
- 7 named exports verified by 2 different greps (corrected `[ :]` regex) — PASS
- `npm run build` exits 0 — PASS
- check-brand 4/4 PASS — PASS
- Lockstep curve verification — PASS (identical 4 numbers in both files)
- SC#5 grep gate `! grep -rn 'transition={{' src/` — PASS (no matches)

---
*Phase: 05-animations-polish*
*Plan: 01-foundation-sot*
*Completed: 2026-04-26*
