---
phase: 05-animations-polish
plan: 03
subsystem: ui
tags: [motion, react, animations, scroll-reveal, intersection-observer, reduced-motion, anir-02]

# Dependency graph
requires:
  - phase: 05-animations-polish
    provides: "Plan 05-01 — src/lib/motionVariants.ts SOT (fadeUp, stagger, fade Variants + easeBrand + durations)"
provides:
  - "src/components/ui/RevealOnScroll.tsx — sole entry-on-scroll reveal API for Phase 5"
  - "RevealOnScroll component with as/variant/staggerChildren/delayChildren/className/children props"
  - "Component-level RM unwrap pattern (useReducedMotion → plain Tag without motion wrapper or IO observer)"
affects: [05-04-reveal-home-page, 05-05a-reveal-zhk-page, 05-05b-reveal-other-routes, 05-06-animate-presence-layout, 05-08-no-inline-transition-check]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Component-level useReducedMotion early-return: when RM is true, bypass motion wrapper and IO observer entirely (D-25 + RESEARCH Risk 4)"
    - "motion[as] dynamic component selection with motion.div fallback for arbitrary HTML tag"
    - "Stagger ms→s conversion: staggerChildren=number / 1000 and delayChildren / 1000"

key-files:
  created:
    - "src/components/ui/RevealOnScroll.tsx (~74 lines, single named export)"
  modified: []

key-decisions:
  - "Default `as` prop = 'div' (conservative); consumers pass `as='section'` for semantic alignment per CONTEXT D-domain risk note"
  - "Default `variant` = fadeUp; LCP-sensitive surfaces (ZhkHero per D-09) override with `variant={fade}` opacity-only"
  - "Default `viewport` HARDCODED inside component as `{ once: true, margin: '-50px' }` per D-07 — NOT a prop (would invite inconsistent overrides across consumers)"
  - "useReducedMotion returns true → render plain `<Tag className={className}>{children}</Tag>` with NO motion wrapper, NO whileInView, NO IntersectionObserver per D-25"
  - "When `staggerChildren=true`, parent variant uses `stagger` from motionVariants with 80ms cadence; numeric value converts via `n / 1000`"
  - "Component cast `(motion[as as keyof typeof motion] ?? motion.div) as ElementType` handles motion 12.x's typed namespace and React 19 prop typing"
  - "ZERO inline `transition={{...}}` JSX — variants carry transition only (SC#1 grep gate stays clean)"

patterns-established:
  - "Component-level RM unwrap: hook at top of component, RM=true → plain HTML tag with no motion lifecycle (consumer-side perf win + simpler mental model than threading variants)"
  - "Single reveal API surface: every consumer in 05-04 + 05-05 uses RevealOnScroll, never inline `<motion.section variants={fadeUp} whileInView=...>` calls"

requirements-completed: [ANI-02]

# Metrics
duration: 2min
completed: 2026-04-26
---

# Phase 5 Plan 03: RevealOnScroll Component Summary

**Sole entry-on-scroll reveal API for Phase 5 — RevealOnScroll wrapper with fadeUp default + stagger orchestration + useReducedMotion unwrap to plain Tag.**

## Performance

- **Duration:** ~2 min (133s wall clock)
- **Started:** 2026-04-26T06:06:38Z
- **Completed:** 2026-04-26T06:09:00Z
- **Tasks:** 1 (atomic — single component file)
- **Files modified:** 1 (1 created, 0 edited)

## Accomplishments

- `src/components/ui/RevealOnScroll.tsx` shipped (~74 lines incl. JSDoc) — single named export `RevealOnScroll` with the D-01 prop contract
- All 8 plan acceptance-criteria grep gates PASS:
  - `^export function RevealOnScroll` → 1 match
  - `whileInView=` → 1 match
  - `margin: '-50px'` → present (in JSDoc + active code)
  - `useReducedMotion` → 3 matches (import + hook call + JSDoc reference)
  - `transition={{` (inline) → 0 matches
- Whole-tree gate (`grep -rnE 'transition=\{\{' src/`) → 0 matches (Phase 5 SC#1 invariant preserved)
- `npx tsc --noEmit` exits 0 (clean type-check against motion 12.38.0 + React 19.2)
- `npx vite build` exits 0 — bundle 440.68 kB JS / **135.62 kB gzipped** — IDENTICAL to Plan 05-01 close (RevealOnScroll has zero consumers, tree-shaken away — exactly as expected per plan's bundle-delta=0 prediction)

## Task Commits

1. **Task 1: Create src/components/ui/RevealOnScroll.tsx** — `531d153` (feat)

## Files Created/Modified

- `src/components/ui/RevealOnScroll.tsx` — sole reveal API for Phase 5; consumed by Plans 05-04 (HomePage sections) and 05-05a/b (ZhkPage hero with `variant={fade}`, gallery thumb stagger, /projects, /construction-log MonthGroup, /contact)

## Verbatim Final Form (for downstream consumer plans)

```tsx
import type { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { fadeUp, stagger } from '../../lib/motionVariants';

interface Props {
  as?: ElementType;
  variant?: Variants;
  staggerChildren?: boolean | number;
  delayChildren?: number;
  className?: string;
  children: ReactNode;
}

export function RevealOnScroll({
  as = 'div',
  variant = fadeUp,
  staggerChildren = false,
  delayChildren = 0,
  className,
  children,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = (motion[as as keyof typeof motion] ?? motion.div) as ElementType;
  const parentVariant: Variants = staggerChildren
    ? {
        ...stagger,
        visible: {
          ...((stagger.visible as object) ?? {}),
          transition: {
            staggerChildren:
              typeof staggerChildren === 'number' ? staggerChildren / 1000 : 0.08,
            delayChildren: delayChildren / 1000,
          },
        },
      }
    : variant;

  return (
    <Component
      className={className}
      variants={parentVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </Component>
  );
}
```

## Consumer Cookbook (for 05-04, 05-05a, 05-05b authors)

**Pattern A — section reveal, no children stagger:**
```tsx
<RevealOnScroll as="section" className="py-24">
  <h2>Brand Essence</h2>
  <p>...</p>
</RevealOnScroll>
```

**Pattern B — section + 80ms canonical stagger across cards (D-02):**
```tsx
<RevealOnScroll as="section" staggerChildren className="grid grid-cols-3 gap-6">
  {pipelineGridProjects.map((p) => (
    <motion.article key={p.slug} variants={fadeUp}>
      ...
    </motion.article>
  ))}
</RevealOnScroll>
```

**Pattern C — LCP-sensitive (ZhkHero, D-09) — opacity-only fade:**
```tsx
<RevealOnScroll as="section" variant={fade}>
  <ResponsivePicture loading="eager" fetchPriority="high" .../>
</RevealOnScroll>
```

**Pattern D — custom stagger ms (e.g. 120ms for slower cascade):**
```tsx
<RevealOnScroll staggerChildren={120}>...</RevealOnScroll>
```

**Pattern E — delayChildren beat (e.g. 80ms before first child reveals):**
```tsx
<RevealOnScroll staggerChildren delayChildren={80}>...</RevealOnScroll>
```

## Decisions Made

- **Verbatim plan execution.** TSX body matches Plan 05-03 `<action>` character-for-character; substantive code byte-identical. JSDoc was already pre-screened — zero Rule 3 doc-block-grep collisions on first write (continuing the 05-01 + 03-08 pattern of pre-screened plans).
- **`(motion[as as keyof typeof motion] ?? motion.div) as ElementType` cast** — handles motion 12.x's typed namespace where `motion.div`/`motion.section`/etc. are typed as their specific component shapes. The `as ElementType` outer cast lets React props spread through without TS conflict on per-element prop types. Confirmed working via `tsc --noEmit` exit 0.
- **D-25 unwrap is the single-source guarantee** — when `useReducedMotion() === true`, the component returns `<Tag className={className}>{children}</Tag>` immediately. NO motion wrapper means no `whileInView` setup, no IO observer registration, no variant lifecycle. This is the structural reason SC#4 («reduced-motion fully respected») is automatically satisfied: the IO surface simply doesn't exist when RM is on.
- **Stagger ms→s conversion** — Motion's `transition.staggerChildren` and `transition.delayChildren` are in **seconds**, but the public API of `RevealOnScroll` accepts **milliseconds** for ergonomic consistency with the rest of the brand-system (which is ms-based). Conversion happens once at the variant-construction site (`/1000`).
- **Default `as='div'`** (conservative) per RESEARCH §Pattern 2. Consumers pick `as='section'`/`'article'`/`'ul'` per their semantic role. The default `'div'` always works as a fallback even on edge HTML tags not in motion's typed namespace (the `?? motion.div` cushion).
- **Hardcoded viewport options** (not exposed as a prop per D-07) — `{ once: true, margin: '-50px' }` is THE Phase 5 reveal contract; allowing per-consumer override would fragment the visual cadence across the site. If a future plan needs different viewport options, the entire reveal contract should be revisited (not patched per-call).

## Deviations from Plan

None — plan executed exactly as written. RevealOnScroll.tsx body matches the plan `<action>` verbatim including JSDoc.

## Issues Encountered

**Wave 2 parallel-build race (NOT caused by this plan):** During verification, `npm run build` failed at `prebuild` step with `optimize-images.mjs` ENOENT errors writing into `public/renders/etno-dim/_opt/*.{webp,jpg}`. Root cause: sibling Wave 2 agents (05-02 hover-card-utility and 05-08 no-inline-transition-check) running concurrent `npm run build` invocations each invoke the destructive `prebuild` chain (`copy-renders.ts` does `rmSync` then `optimize-images.mjs` re-encodes). The destructive copy of one agent wipes `_opt/` directories that another agent's parallel optimizer is trying to write into.

**Resolution:** Per deviation rules SCOPE BOUNDARY, this is pre-existing build infrastructure (Plan 02-03 / Plan 03-03 surfaces) and unrelated to RevealOnScroll component changes. Bypassed `prebuild` and ran `npx tsc --noEmit && npx vite build` directly — both exit 0, bundle 135.62 kB gzipped (unchanged from 05-01 close). The actual component compiles, types, and bundles cleanly. The prebuild failure is logged for future Wave-coordination work (orchestrator or scripts/copy-renders.ts could add file-level locks or inter-agent build serialization).

## User Setup Required

None — no external service configuration required.

## Self-Check: PASSED

- File `src/components/ui/RevealOnScroll.tsx` exists ✓
- Commit `531d153` exists in `git log --oneline` ✓
- All 8 plan grep-gate acceptance criteria pass ✓
- `tsc --noEmit` exit 0 ✓
- `vite build` exit 0, bundle unchanged at 135.62 kB gzipped ✓

## Next Phase Readiness

- **Plan 05-04** (reveal-home-page) — wraps HomePage sections (BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm) in `<RevealOnScroll>`; Hero EXCLUDED per D-06 (LCP target). PortfolioOverview pipeline grid uses `staggerChildren` (Pattern B). Component imports verified working: `from '../../components/ui/RevealOnScroll'` (page-level) or `from '../ui/RevealOnScroll'` (section-level).
- **Plan 05-05a** (reveal-zhk-page) — wraps ZhkHero with `variant={fade}` per D-09 (LCP-sensitive); gallery thumbs use `staggerChildren` (Pattern B with 8 thumbs × 80ms = 640ms cascade per D-05).
- **Plan 05-05b** (reveal-other-routes) — `/projects`, `/construction-log` (per-MonthGroup wrap, NOT per-photo per D-04), `/contact`.
- **Plan 05-06** (animate-presence-layout) — independent route-transition surface; no direct dependency on RevealOnScroll but SHARES the `useReducedMotion` thread (D-25).
- **Plan 05-08** (no-inline-transition-check) — CI gate check. RevealOnScroll passes the gate (zero `transition={{`); whole-`src/` tree currently passes too.

**Component is consumer-free in this plan as designed.** Tree-shake is in effect: bundle hash unchanged from 05-01 close at 440.68 kB JS / 135.62 kB gzipped. Plans 05-04 and 05-05 land it into the reachable graph.

---
*Phase: 05-animations-polish*
*Completed: 2026-04-26*
