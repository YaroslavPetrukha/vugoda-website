---
phase: 05-animations-polish
plan: 06
type: execute
wave: 3
depends_on: [05-01-foundation-sot]
files_modified:
  - src/components/layout/Layout.tsx
  - src/components/layout/ScrollToTop.tsx
autonomous: true
requirements: [ANI-04]
must_haves:
  truths:
    - "Navigating between any 2 of the 5 production routes produces a fade-out then fade-in transition (~350ms exit / ~400ms enter) with NO instant cuts"
    - "Window scrolls to top precisely between exit-finished and enter-starting (onExitComplete callback) — never during fade-out"
    - "useReducedMotion() respects RM preference: when RM is reduce, route swaps are instant (no fade) but scroll-to-top still fires"
    - "?stage=... query changes on /projects do NOT trigger a route fade (key is pathname only, not pathname+search — D-12)"
  artifacts:
    - path: src/components/layout/Layout.tsx
      provides: "<AnimatePresence mode='wait' initial={false}> wrapping <Outlet/> with keyed motion.div carrying flex flex-1 flex-col"
      contains: "AnimatePresence"
    - path: src/components/layout/ScrollToTop.tsx
      provides: "Either deleted OR no-op'd (D-14 Claude's-Discretion: this plan deletes — cleaner)"
  key_links:
    - from: src/components/layout/Layout.tsx
      to: src/lib/motionVariants.ts pageFade
      via: "named import + variant prop on motion.div"
      pattern: "import \\{ pageFade \\}"
    - from: src/components/layout/Layout.tsx
      to: react-router-dom useLocation
      via: "named import + useLocation().pathname as motion.div key"
      pattern: "key=\\{location\\.pathname\\}"
    - from: "AnimatePresence onExitComplete callback"
      to: "window.scrollTo(0, 0)"
      via: "onExitComplete prop fires window.scrollTo in the gap between exit-finished and enter-starting"
      pattern: "onExitComplete.*scrollTo"
---

<objective>
Add `<AnimatePresence>` route-transition wrapper to `src/components/layout/Layout.tsx` per CONTEXT D-10..D-14. Wrap `<Outlet/>` directly inside a keyed `<motion.div>`, hooked into `pageFade` variant from 05-01 motionVariants.ts. Replace the existing instant-scroll-to-top behaviour (currently in `src/components/layout/ScrollToTop.tsx`) with `onExitComplete={() => window.scrollTo(0, 0)}` — scroll lands precisely between the old route's exit-finished frame and the new route's enter-starting frame, not during the fade-out (D-14).

Per Claude's-Discretion call (D-14): DELETE `src/components/layout/ScrollToTop.tsx` and remove its import + render from Layout.tsx. Cleaner than no-op'ing — no dead component file in the tree, no import to maintain.

Per RESEARCH Risk 1 (Layout flex container — flex-1 propagation): the inserted `<motion.div>` MUST carry `className="flex flex-1 flex-col"` so the existing `<main className="flex flex-1 flex-col">` flex-grow chain continues into the route content. Without this class on the inserted layer, every page's `min-h-screen`-style layouts visually shrink.

Per CONTEXT D-25 (RM threading) + RESEARCH Pitfall 3 (`onExitComplete` lifecycle on instant transitions): `useReducedMotion()` swaps `pageFade` for a no-op variant `{ hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }` with implicit 0-duration. Motion 12.38.0 fires onExitComplete synchronously for 0-duration exits (verified in RESEARCH), so scroll-to-top still works under RM.

Per CONTEXT D-12 (key strategy): `key={location.pathname}` ONLY — NOT `pathname + search`. Chip clicks on /projects update `?stage=...` without re-keying the AnimatePresence; useSearchParams chip state survives unchanged (verified by RESEARCH Pitfall 1).

Output: `src/components/layout/Layout.tsx` rewritten with AnimatePresence wrapper; `src/components/layout/ScrollToTop.tsx` deleted.
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
@src/components/layout/Layout.tsx
@src/components/layout/ScrollToTop.tsx
@src/components/layout/Nav.tsx
@src/components/layout/Footer.tsx
</context>

<interfaces>
<!-- Motion 12.38.0 + react-router-dom 7.14.2 exports verified at runtime -->

From motion/react:
```ts
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
```

From react-router-dom:
```ts
import { Outlet, useLocation } from 'react-router-dom';
```

From src/lib/motionVariants.ts (created by Plan 05-01):
```ts
export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easeBrand },   // 0.4s = 400ms enter
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: easeBrand },              // 350ms exit
  },
};
```

Current Layout.tsx (verbatim):
```tsx
import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <ScrollToTop />
      <Nav />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

Current ScrollToTop.tsx (verbatim):
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

Phase 5 form pattern from RESEARCH §Pattern 1 (verbatim):
```tsx
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { pageFade } from '../../lib/motionVariants';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : pageFade;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Nav />
      <main className="flex flex-1 flex-col">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.div
            key={location.pathname}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
```

App.tsx routes (read-only context — does NOT need editing):
```tsx
<Route element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="projects" element={<ProjectsPage />} />
  <Route path="zhk/:slug" element={<ZhkPage />} />
  <Route path="construction-log" element={<ConstructionLogPage />} />
  <Route path="contact" element={<ContactPage />} />
  <Route path="dev/brand" element={<DevBrandPage />} />
  <Route path="dev/grid" element={<DevGridPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
```
All routes flow through Layout's `<Outlet/>`. Phase 5 D-defer: /dev/brand and /dev/grid get the same pageFade as production routes — no exclusion logic.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Rewrite src/components/layout/Layout.tsx with AnimatePresence + onExitComplete (D-10..D-14, RM threading per D-25)</name>
  <read_first>
    - src/components/layout/Layout.tsx (current verbatim form — for sanity-check before replacing)
    - src/lib/motionVariants.ts (verify pageFade export shape post-05-01)
    - src/components/layout/Nav.tsx (do NOT touch — confirms it exports `Nav` named export)
    - src/components/layout/Footer.tsx (do NOT touch — confirms it exports `Footer` named export)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-10..D-14, §D-25 (RM threading), §D-26 (no provider)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pattern 1 (verbatim file body)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Risk 1 (flex-1 propagation — motion.div MUST carry className="flex flex-1 flex-col")
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pitfalls 2, 3, 6 (initial={false}, RM 0-duration onExitComplete fires, motion.div as direct child of AnimatePresence)
  </read_first>
  <files>src/components/layout/Layout.tsx</files>
  <behavior>
    - Test 1: Imports added — `AnimatePresence, motion, useReducedMotion` from 'motion/react'; `useLocation` from 'react-router-dom' (added to existing Outlet import)
    - Test 2: Imports added — `pageFade` from '../../lib/motionVariants'
    - Test 3: ScrollToTop import REMOVED from Layout.tsx (deletion of file in Task 2 below)
    - Test 4: Inside Layout function: `useLocation()` and `useReducedMotion()` hooks called at top
    - Test 5: `variants` const is conditional: `prefersReducedMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } } : pageFade`
    - Test 6: JSX wraps `<Outlet/>` inside `<AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>`
    - Test 7: Inside AnimatePresence is exactly ONE direct child: `<motion.div key={location.pathname} variants={variants} initial="hidden" animate="visible" exit="exit" className="flex flex-1 flex-col">`
    - Test 8: `<Outlet/>` is inside the motion.div (NOT wrapping the motion.div, NOT a sibling)
    - Test 9: `<main className="flex flex-1 flex-col">` STILL wraps the AnimatePresence (chrome stays static around the motion layer per D-10)
    - Test 10: Nav and Footer are siblings of `<main>` inside the outer `<div className="flex min-h-screen flex-col bg-bg">` — NOT inside AnimatePresence
    - Test 11: NO `<ScrollToTop />` JSX render anywhere (replaced by onExitComplete callback)
    - Test 12: NO inline `transition={{...}}` JSX prop (variants carry transition; SC#1 grep gate stays clean)
  </behavior>
  <action>
    Replace ENTIRE contents of `src/components/layout/Layout.tsx` with this exact code (verbatim from RESEARCH §Pattern 1, with project-style doc-block):

    ```tsx
    /**
     * @module components/layout/Layout
     *
     * Site chrome — Nav (top) + main + Footer. Renders on every route via
     * <Route element={<Layout/>}> in App.tsx.
     *
     * Phase 5 (D-10..D-14, D-25): wraps <Outlet/> in <AnimatePresence
     * mode="wait" initial={false}> + keyed <motion.div> for inter-route
     * page transitions per ANI-04. Replaces the Phase 1 ScrollToTop
     * useEffect side-effect with onExitComplete={() => window.scrollTo(0,0)}
     * — scroll resets in the gap between exit-finished and enter-starting,
     * never during fade-out.
     *
     * Risk 1 enforcement: motion.div carries className="flex flex-1 flex-col"
     * so the existing <main> flex-grow chain continues into the route content
     * subtree. Without this class on the inserted layer, every page's
     * min-h-screen-style layouts visually shrink.
     *
     * D-12 key strategy: location.pathname ONLY (NOT pathname+search). Chip
     * clicks on /projects (?stage=...) update searchParams without re-keying
     * — useSearchParams state survives, no spurious page fade.
     *
     * D-25 RM threading: useReducedMotion() swaps pageFade for a no-op
     * variant. Routes still mount/unmount but without animation. Motion
     * 12.38.0 fires onExitComplete synchronously on 0-duration exits, so
     * scroll-to-top still works under reduced-motion (RESEARCH Pitfall 3).
     *
     * Phase 1 ScrollToTop.tsx is DELETED in this same plan (D-14 Claude's-
     * Discretion: deletion is cleaner than no-op file).
     */
    import { Outlet, useLocation } from 'react-router-dom';
    import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
    import { pageFade } from '../../lib/motionVariants';
    import { Nav } from './Nav';
    import { Footer } from './Footer';

    export function Layout() {
      const location = useLocation();
      const prefersReducedMotion = useReducedMotion();
      const variants = prefersReducedMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
        : pageFade;

      return (
        <div className="flex min-h-screen flex-col bg-bg">
          <Nav />
          <main className="flex flex-1 flex-col">
            <AnimatePresence
              mode="wait"
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <motion.div
                key={location.pathname}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-1 flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      );
    }
    ```

    Doc-block self-screen: the comment text uses TypeScript object syntax `{ hidden: ... }` (single-brace) when describing the no-op variant — does NOT contain the `transition={{` literal pattern. No `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals.
  </action>
  <verify>
    <automated>grep -nE "import \\{ AnimatePresence, motion, useReducedMotion \\} from 'motion/react'" src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n "import { pageFade } from '../../lib/motionVariants'" src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE 'AnimatePresence' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^[23]$' && grep -nE 'mode="wait"' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE 'initial=\{false\}' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE 'onExitComplete.*scrollTo' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE 'key=\{location\.pathname\}' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'className="flex flex-1 flex-col"' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^[12]$' && grep -n 'useReducedMotion' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^[12]$' && grep -n 'ScrollToTop' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^0$' && grep -nE 'transition=\{\{' src/components/layout/Layout.tsx | wc -l | tr -d ' ' | grep -q '^0$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - File `src/components/layout/Layout.tsx` exists and matches the spec
    - `grep -nE 'AnimatePresence.*mode="wait".*initial=\{false\}' src/components/layout/Layout.tsx` returns 1 match (covers VALIDATION map row "AnimatePresence mode wait initial false")
    - `grep -nE 'key=\{location\.pathname\}' src/components/layout/Layout.tsx` returns 1 match (covers VALIDATION map row "Keyed on location.pathname")
    - `grep -nE 'onExitComplete.*scrollTo' src/components/layout/Layout.tsx` returns 1 match (covers VALIDATION map row "onExitComplete sets scroll")
    - `grep -n 'useReducedMotion' src/components/layout/Layout.tsx` returns ≥1 match (covers VALIDATION map row "useReducedMotion in Layout")
    - `grep -n 'ScrollToTop' src/components/layout/Layout.tsx` returns 0 matches (import + render fully removed)
    - `grep -nE 'transition=\{\{' src/components/layout/Layout.tsx` returns 0 (no inline transitions added)
    - `npm run lint` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Delete src/components/layout/ScrollToTop.tsx (D-14 — Claude's-Discretion: delete over no-op)</name>
  <read_first>
    - src/components/layout/ScrollToTop.tsx (current contents — verify it has no other consumers)
    - src/components/layout/Layout.tsx (post-Task-1 form — confirm import is already removed)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-14 (Claude's-Discretion)
  </read_first>
  <files>src/components/layout/ScrollToTop.tsx</files>
  <behavior>
    - Test 1: File `src/components/layout/ScrollToTop.tsx` does NOT exist after this task
    - Test 2: NO file in `src/` imports from `./ScrollToTop` or `../layout/ScrollToTop`
    - Test 3: `npm run lint` exits 0 (no broken imports)
  </behavior>
  <action>
    Delete the file at `src/components/layout/ScrollToTop.tsx`.

    Use the Bash tool: `rm src/components/layout/ScrollToTop.tsx`

    Then verify no consumers remain:
    `grep -rn 'ScrollToTop' src/ --include='*.ts' --include='*.tsx'` should return 0 lines.

    If any consumers ARE found (Task 1 should have eliminated the only consumer in Layout.tsx), STOP and report — do NOT proceed with deletion until consumer count is 0.

    Rationale (D-14 Claude's-Discretion): kept-as-no-op file would be a confusing artifact for future maintainers — `ScrollToTop.tsx` that does nothing is a dead module. Deletion + import removal is the cleaner exit. The git history retains the file for historical reference.
  </action>
  <verify>
    <automated>test ! -f src/components/layout/ScrollToTop.tsx && grep -rn 'ScrollToTop' src/ --include='*.ts' --include='*.tsx' | wc -l | tr -d ' ' | grep -q '^0$' && npm run build 2>&1 | tail -3 | grep -q '4/4 checks passed' && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `test -f src/components/layout/ScrollToTop.tsx` returns false (file deleted)
    - `grep -rn 'ScrollToTop' src/ --include='*.ts' --include='*.tsx'` returns 0 lines (no remaining consumers)
    - `npm run build` exits 0 (full pipeline green; deletion + Layout edit consistent)
  </done>
</task>

</tasks>

<verification>
- `npm run build` exits 0 — lint + check-brand 4/4 + bundle delta within budget
- Bundle: AnimatePresence is part of Motion's core which is already in the bundle (motion/react was imported by Hero.tsx and RevealOnScroll.tsx). Net add: ~0.5 KB gzipped (the AnimatePresence subtree pulls in additional motion lifecycle code, but tree-shaking keeps it small). Bundle target: ≤140 KB gzipped.
- Phase 5 SC#1 grep gate `! grep -rn 'transition=\{\{' src/` exits 1 (no inline transition objects)
- Manual verification (deferred to Phase 6 / VALIDATION manual gates):
  - Navigate `/` → `/projects` → `/zhk/etno-dim` → `/construction-log` → `/contact` → `/`. Each transition fades out (~350ms) then fades in (~400ms).
  - Click stage chips on /projects: chip filter changes, NO route fade fires (D-12 verified — pathname stays `/projects`).
  - DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → navigate routes: instant swap, scroll resets to top.
- Risk 1 verification: every page (Home, Projects, Zhk, ConstructionLog, Contact, NotFound, /dev/brand, /dev/grid) still renders full-height — no layout shrinkage from missing flex propagation.
- Risk 5 verification (Lakeview redirect 1-frame fade): the `<ZhkLakeviewRedirect>` component renders for 1 frame inside motion.div before `window.location.assign(...)` fires; 1-frame fade is acceptable per CONTEXT and RESEARCH (deferred to Phase 6 QA if visible flicker is reported).
</verification>

<success_criteria>
- [ ] Layout.tsx wraps `<Outlet/>` in `<AnimatePresence mode="wait" initial={false} onExitComplete={...}>` + keyed `<motion.div>`
- [ ] motion.div carries `className="flex flex-1 flex-col"` (Risk 1 — flex-1 propagation preserved)
- [ ] motion.div is keyed on `location.pathname` (D-12 — query params don't re-key)
- [ ] onExitComplete fires `window.scrollTo(0, 0)` (D-14 — replaces ScrollToTop useEffect)
- [ ] useReducedMotion() swaps pageFade for no-op variant when RM is reduce (D-25)
- [ ] ScrollToTop.tsx file deleted; no remaining imports/references
- [ ] `npm run build` exits 0 with check-brand 4/4 PASS
- [ ] Phase 5 SC#1 grep gate clean (no inline transition objects)
- [ ] D-26 invariant: no new global context, no new provider — useReducedMotion is per-component hook only
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-06-animate-presence-layout-SUMMARY.md` documenting:
- Verbatim final form of Layout.tsx (so /gsd:verify-work can assert against it)
- Confirmation that ScrollToTop.tsx is deleted (file does NOT exist)
- Confirmation that Risk 1 flex-1 propagation class is on motion.div
- Risk 5 acknowledgement: /zhk/lakeview redirect path may exhibit 1-frame fade-in before external nav fires; documented for Phase 6 QA inspection
- Bundle size delta vs Plan 05-05 baseline (expected: +~0.5 KB gzipped from AnimatePresence lifecycle code)
- Note for Phase 6: Lighthouse runs on `/` should clear sessionStorage between cold loads (else hero session-skip from 05-07 produces artificially cheap Performance scores on second pass)
</output>
