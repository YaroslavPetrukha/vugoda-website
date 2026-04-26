---
phase: 05-animations-polish
plan: 03
type: execute
wave: 2
depends_on: [05-01-foundation-sot]
files_modified:
  - src/components/ui/RevealOnScroll.tsx
autonomous: true
requirements: [ANI-02]
must_haves:
  truths:
    - "A reusable <RevealOnScroll> component exists and provides the sole API for entry-on-scroll reveal across all 5 production routes"
    - "The component respects useReducedMotion() — when RM is active, children render directly without motion wrapper, no IntersectionObserver registered"
    - "The component supports 80ms cadence stagger via the staggerChildren prop (true = 80ms canonical, number = custom ms)"
  artifacts:
    - path: src/components/ui/RevealOnScroll.tsx
      provides: "RevealOnScroll component — props: as, variant, staggerChildren, delayChildren, viewport, className, children"
      exports: [RevealOnScroll]
      min_lines: 60
  key_links:
    - from: src/components/ui/RevealOnScroll.tsx
      to: src/lib/motionVariants.ts
      via: "named imports of fadeUp · stagger"
      pattern: "from '\\.\\./\\.\\./lib/motionVariants'"
    - from: src/components/ui/RevealOnScroll.tsx
      to: motion/react
      via: "named imports of motion · useReducedMotion · type Variants"
      pattern: "from 'motion/react'"
---

<objective>
Create the `<RevealOnScroll>` component at `src/components/ui/RevealOnScroll.tsx` per CONTEXT D-01 and D-25. This is the SOLE entry-on-scroll reveal API for Phase 5 — every below-fold section across all 5 production routes will wrap in this component (Plans 05-04 and 05-05 are the consumers). The component:
1. Uses Motion 12.x's `whileInView` pattern with `viewport={{ once: true, margin: '-50px' }}` (D-07)
2. Defaults to the `fadeUp` variant from motionVariants.ts (24px Y-translate + opacity 0→1, 400ms, easeBrand)
3. Supports the `fade` variant override for LCP-sensitive surfaces (D-09 — used by ZhkHero in Plan 05-05)
4. Supports stagger orchestration: `staggerChildren=true` → canonical 80ms, `staggerChildren={n}` → custom ms (D-02)
5. Respects `useReducedMotion()` — if true, renders children directly inside a plain `<as>` tag without ANY motion wrapper or IntersectionObserver (D-25)
6. Uses configurable `as` prop (default `'div'`, but consumers can pass `'section'` for semantic alignment per Risk 4)

Purpose: Single source of reveal behaviour. Plans 05-04 and 05-05 consume this component verbatim — no per-section `<motion.section>` calls. Compliance with SC#2 «no 30+ independent IntersectionObservers» becomes structural (the component is the only IO surface).

Output: `src/components/ui/RevealOnScroll.tsx` (~70 lines, single named export). No consumers added in this plan — it is the component foundation; Plans 05-04 and 05-05 wire it across 5 routes.
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
@src/lib/motionVariants.ts
@src/components/ui/ResponsivePicture.tsx
@src/components/ui/Lightbox.tsx
@src/components/sections/home/Hero.tsx
</context>

<interfaces>
<!-- Motion 12.38.0 exports verified at runtime per RESEARCH §Standard Stack -->

From motion/react:
```ts
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
```

The `motion` export is an object indexed by HTML element tag (`motion.div`, `motion.section`, `motion.article`, etc.) — each is a React component accepting `variants`, `initial`, `whileInView`, `viewport`, `animate`, `exit` props.

`useReducedMotion()` returns `boolean | null` per Motion docs; treat `null` as "not yet determined → assume false" for first paint, but in practice Motion resolves it synchronously to `true`/`false`.

From src/lib/motionVariants.ts (created by Plan 05-01):
```ts
export const easeBrand: readonly [number, number, number, number];
export const durations: { fast: 0.2; base: 0.4; slow: 1.2 };
export const fadeUp: Variants;       // { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration, ease } } }
export const fade: Variants;         // opacity-only sibling, for LCP surfaces (D-09)
export const stagger: Variants;      // parent variant: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0 } } }
export const pageFade: Variants;     // for AnimatePresence in Plan 05-06
export const parallaxRange: readonly [number, number];   // for Hero in Plan 05-07
```

Existing `src/components/ui/` siblings (pattern reference):
- ResponsivePicture.tsx — uses single named export, JSDoc @module block, props interface above the component
- Lightbox.tsx — same pattern

Pattern: NO default export — named export only (matches lib/* + components/ui/* conventions).

Phase 5 SOL pattern from RESEARCH §Pattern 2 — verbatim usable:
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

  const Component = motion[as as keyof typeof motion] ?? motion.div;
  const parentVariant = staggerChildren
    ? {
        ...stagger,
        visible: {
          ...stagger.visible,
          transition: {
            staggerChildren: typeof staggerChildren === 'number' ? staggerChildren / 1000 : 0.08,
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
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/ui/RevealOnScroll.tsx (D-01 + D-07 + D-25)</name>
  <read_first>
    - src/lib/motionVariants.ts (verify named exports actually exist after 05-01 — required imports: fadeUp, stagger; type-import: Variants from motion/react)
    - src/components/ui/ResponsivePicture.tsx (sibling component file pattern: @module doc-block, named export, Props interface)
    - src/components/sections/home/Hero.tsx (precedent for `useReducedMotion()` usage)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-01..D-09 (component contract + RM behaviour)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pattern 2 (verbatim file body)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Risk 4 (RM hook branch unwraps to plain Tag — leave-as-written per recommendation)
  </read_first>
  <files>src/components/ui/RevealOnScroll.tsx</files>
  <behavior>
    - Test 1: Single named export `RevealOnScroll` (no default export, no second export)
    - Test 2: Props interface accepts `as?: ElementType` defaulting to `'div'`, `variant?: Variants` defaulting to `fadeUp`, `staggerChildren?: boolean | number` defaulting to `false`, `delayChildren?: number` defaulting to `0`, `className?: string`, `children: ReactNode`
    - Test 3: When `useReducedMotion() === true` returns `<Tag className={className}>{children}</Tag>` — NO motion wrapper, NO whileInView, NO IntersectionObserver registered
    - Test 4: When RM is false, renders `motion[as]` (or motion.div fallback) with `variants={parentVariant}`, `initial="hidden"`, `whileInView="visible"`, `viewport={{ once: true, margin: '-50px' }}`
    - Test 5: When `staggerChildren=true`, parent's variant uses `stagger` from motionVariants with `staggerChildren: 0.08` (80ms canonical per D-02)
    - Test 6: When `staggerChildren=42` (number ms), parent's `transition.staggerChildren` is `0.042` (42ms / 1000 — ms-to-seconds conversion correct)
    - Test 7: When `delayChildren=80`, parent's `transition.delayChildren` is `0.08` (80ms / 1000)
    - Test 8: NO inline `transition={{...}}` JSX prop on the motion component (variants carry transition; SC#1 grep gate must remain clean)
  </behavior>
  <action>
    Create new file at exact path `src/components/ui/RevealOnScroll.tsx` with this EXACT contents (combines RESEARCH §Pattern 2 with the conventions established by ResponsivePicture/Lightbox sibling files):

    ```tsx
    /**
     * @module components/ui/RevealOnScroll
     *
     * ANI-02 — sole entry-on-scroll reveal API for Phase 5.
     *
     * Wraps children in a Motion <motion.{as}> with whileInView + a single
     * IntersectionObserver per instance. When useReducedMotion() is true,
     * renders children directly inside a plain <as> tag — NO motion wrapper,
     * NO IO observer (D-25 + RESEARCH Risk 4: simpler unwrap is correct for
     * MVP, runtime RM-toggle edge case is acceptable trade).
     *
     * Default variant = fadeUp (opacity 0 + y:24 → opacity 1 + y:0 over 400ms
     * with easeBrand). Override with variant={fade} for LCP-sensitive surfaces
     * per D-09 (e.g. ZhkHero on /zhk/etno-dim — Y-translate would delay paint).
     *
     * Stagger orchestration:
     *   staggerChildren={true}    → 80ms cadence (D-02 canonical)
     *   staggerChildren={120}     → 120ms cadence (caller-specified ms)
     *   delayChildren={80}        → 80ms beat before first child reveals
     * When staggerChildren is set, children must opt in by being
     * <motion.div variants={fadeUp}> (or pass `variant` prop) — see consumer
     * plans 05-04 and 05-05.
     *
     * Viewport: { once: true, margin: '-50px' } per D-07. Once: true means
     * scrolling away and back does NOT replay (no re-trigger flicker). Margin
     * -50px triggers reveal slightly before section enters the viewport — feels
     * natural rather than mechanically-on-edge.
     *
     * NO inline Motion transition objects — Phase 5 SOT in motionVariants.ts
     * carries duration + ease via variants only (SC#1 grep gate).
     */
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

    Doc-block self-screen: the JSDoc text contains:
    - The literal `transition={{...}}` does NOT appear (only described as «inline Motion transition objects» — no double-brace literal, no `transition\{\{` pattern).
    - No `Pictorial`, `Rubikon`, `/renders/`, `/construction/`.
    - The check-brand `importBoundaries()` rule «components must not contain raw /renders/ or /construction/ paths» is automatically satisfied (RevealOnScroll.tsx has zero asset paths).

    Type note: the `(motion[as as keyof typeof motion] ?? motion.div) as ElementType` cast handles motion 12.x's typed namespace where `motion.div`/`motion.section`/etc. are typed as their specific component shapes. The `as ElementType` cast lets us spread the React props through without a TS conflict on per-element prop types.
  </action>
  <verify>
    <automated>test -f src/components/ui/RevealOnScroll.tsx && grep -nE '^export function RevealOnScroll' src/components/ui/RevealOnScroll.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'whileInView=' src/components/ui/RevealOnScroll.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n "margin: '-50px'" src/components/ui/RevealOnScroll.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'useReducedMotion' src/components/ui/RevealOnScroll.tsx | wc -l | tr -d ' ' | grep -q '^[12]$' && grep -nE 'transition=\{\{' src/components/ui/RevealOnScroll.tsx | wc -l | tr -d ' ' | grep -q '^0$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - File `src/components/ui/RevealOnScroll.tsx` exists
    - `grep -nE '^export function RevealOnScroll' src/components/ui/RevealOnScroll.tsx` returns 1 match
    - `grep -n 'whileInView=' src/components/ui/RevealOnScroll.tsx` returns 1 match (covers VALIDATION map ANI-02 SC#2 row)
    - `grep -n "margin: '-50px'" src/components/ui/RevealOnScroll.tsx` returns 1 match (covers VALIDATION map row D-07 viewport)
    - `grep -n 'useReducedMotion' src/components/ui/RevealOnScroll.tsx` returns ≥ 1 match (covers ANI-04 SC#4 row)
    - `grep -nE 'transition=\{\{' src/components/ui/RevealOnScroll.tsx` returns 0 matches (no inline transitions; SC#1 grep gate stays clean)
    - `! grep -rn 'transition=\{\{' src/` exits 1 (whole-tree gate; new file did not regress)
    - `npm run lint` (= `tsc --noEmit`) exits 0 (component type-checks against motion 12.38.0 + react 19.2)
    - `npm run build` exits 0 (RevealOnScroll bundles into vendor chunk via tree-shake — no consumers yet, so impact is ~0KB; consumers in 05-04, 05-05 will pull it in)
  </done>
</task>

</tasks>

<verification>
- `npm run build` exits 0 — full pipeline including lint and check-brand 4/4
- Bundle size delta: minimal — RevealOnScroll has 0 consumers in this plan (will be reachable from the bundle once Plans 05-04, 05-05 wire it). Tree-shaking drops it for now. Expected bundle: 131.60 kB gzipped (unchanged from Phase 4).
- Phase 5 SC#1 invariant: `! grep -rn 'transition=\{\{' src/` still exits 1 (no inline transition objects added).
</verification>

<success_criteria>
- [ ] `src/components/ui/RevealOnScroll.tsx` exists with single named export `RevealOnScroll`
- [ ] Props interface matches D-01 contract (as, variant, staggerChildren, delayChildren, className, children)
- [ ] `useReducedMotion()` early-return path renders plain `<Tag>` (no motion wrapper, no IO)
- [ ] Default `whileInView` + viewport `{ once: true, margin: '-50px' }` per D-07
- [ ] `staggerChildren=true` produces 80ms cadence; numeric value converts ms→s correctly
- [ ] No inline `transition={{...}}` JSX prop (variants carry transition only)
- [ ] `npm run build` exits 0 with check-brand 4/4 PASS
- [ ] Component is consumer-free in this plan (Plans 05-04 and 05-05 are the consumers)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-03-reveal-on-scroll-component-SUMMARY.md` documenting:
- Verbatim final form of RevealOnScroll.tsx (so Plans 05-04, 05-05 SUMMARYs can cite the exact prop signature)
- Bundle size delta (expected: 0 due to tree-shake — consumers in 05-04, 05-05 land it)
- Confirmation of D-25 unwrap-on-RM behaviour (the early-return branch is the single-source guarantee)
- Note: the `motion[as as keyof typeof motion]` indexed access is the standard idiom; if any consumer in 05-04/05-05 needs an HTML element not present in motion's type union (unlikely — div/section/article/ul/ol/li/dl/dt/dd are all there), the consumer should pass `as="section"` (typed) rather than relying on the `motion.div` fallback
</output>
