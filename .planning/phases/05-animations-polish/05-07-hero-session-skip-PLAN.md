---
phase: 05-animations-polish
plan: 07
type: execute
wave: 3
depends_on: [05-01-foundation-sot]
files_modified:
  - src/hooks/useSessionFlag.ts
  - src/components/sections/home/Hero.tsx
autonomous: true
requirements: [ANI-02, ANI-04]
must_haves:
  truths:
    - "On first visit in a session, the hero parallax animates as before — IsometricGridBG translates from 0 to -100px on scrollYProgress 0→1"
    - "On second+ visit in the same session (refresh, return-to-/), parallax is SKIPPED — IsometricGridBG sits static at y:0 with no scroll-driven motion"
    - "When useReducedMotion() is reduce, parallax is ALWAYS skipped (D-20 hard override) regardless of session-flag state"
    - "Hero parallax magnitude [0, -100] sources from `parallaxRange` named export in motionVariants.ts (no inline numeric literal in Hero.tsx — D-28 SOT lift)"
  artifacts:
    - path: src/hooks/useSessionFlag.ts
      provides: "useSessionFlag(key) custom hook — one-shot read+write of sessionStorage flag, lazy-init useState avoids first-paint flash"
      exports: [useSessionFlag]
      min_lines: 25
    - path: src/components/sections/home/Hero.tsx
      provides: "Hero with parallax-skip-on-revisit + parallaxRange import from SOT"
      contains: "useSessionFlag('vugoda:hero-seen')"
  key_links:
    - from: src/components/sections/home/Hero.tsx
      to: src/hooks/useSessionFlag.ts
      via: "named import + hook call"
      pattern: "useSessionFlag\\('vugoda:hero-seen'\\)"
    - from: src/components/sections/home/Hero.tsx
      to: src/lib/motionVariants.ts parallaxRange
      via: "named import + useTransform outputRange"
      pattern: "import.*parallaxRange"
    - from: "skipParallax boolean"
      to: "useTransform outputRange ternary"
      via: "skipParallax ? [0, 0] : parallaxRange"
      pattern: "skipParallax \\? \\[0, 0\\] : parallaxRange"
---

<objective>
Implement two coupled changes per CONTEXT D-17..D-21 + D-28 to deliver SC#5 (session-scoped hero skip on revisit):

1. **Create `src/hooks/useSessionFlag.ts`** (~25 lines) — first member of new `src/hooks/` directory. Custom hook with signature `useSessionFlag(key: string): boolean` that:
   - Returns `true` if the sessionStorage key was already set when the hook first ran (revisit path)
   - Returns `false` on first call ever in the session (cinematic path) AND writes the flag so subsequent mounts return true
   - Uses lazy `useState` initializer to avoid the «one-frame flash» Pitfall 5 — first React render reads sessionStorage synchronously, so initial value matches reality on first paint
   - Per Claude's-Discretion call (D-21 + RESEARCH Open Q): one-shot read+write semantic (returns boolean, no setter)
   - Window-only safe (returns false during SSR — pattern correctness, project has no SSR)

2. **Modify `src/components/sections/home/Hero.tsx`** (~5 lines net) per D-28:
   - Import `parallaxRange` from `'../../../lib/motionVariants'`
   - Import `useSessionFlag` from `'../../../hooks/useSessionFlag'`
   - Add `const heroSeen = useSessionFlag('vugoda:hero-seen');` (sessionStorage key namespaced with brand prefix per D-18)
   - Compute `const skipParallax = prefersReducedMotion || heroSeen;` (D-20 — RM is hard override, session is OR-combined)
   - Change useTransform outputRange from `prefersReducedMotion ? [0, 0] : [0, -100]` to `skipParallax ? [0, 0] : parallaxRange`
   - Update the doc-block to reference Phase 5 D-17..D-21, D-28 as authoritative

Hero JSX, useScroll hook, useRef setup, all other imports — all stay byte-identical. The change is precisely 5 lines per D-28.

Output: New `src/hooks/useSessionFlag.ts` file. Modified `src/components/sections/home/Hero.tsx`.
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
@src/components/sections/home/Hero.tsx
@src/lib/motionVariants.ts
@src/lib/assetUrl.ts
</context>

<interfaces>
<!-- Existing Hero.tsx (verbatim, post-Phase-3 form): -->
```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IsometricGridBG } from '../../brand/IsometricGridBG';
import { heroSlogan, heroCta } from '../../../content/home';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const cubeY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -100],
  );

  return (
    <section ref={heroRef} className="...">
      <motion.div ... style={{ y: cubeY }}>
        <IsometricGridBG ... opacity={0.15} />
      </motion.div>
      <div ...>
        <h1 ...>ВИГОДА</h1>
        <p ...>{heroSlogan}</p>
        <Link to="/projects" ...>{heroCta}</Link>
      </div>
    </section>
  );
}
```

From src/lib/motionVariants.ts (Plan 05-01):
```ts
export const parallaxRange = [0, -100] as const;   // readonly tuple consumed by Hero useTransform
```

useSessionFlag signature target (RESEARCH §Pattern 3, Claude's-Discretion call: one-shot semantic):
```ts
export function useSessionFlag(key: string): boolean;
// First call in session: returns false, writes flag.
// Subsequent calls: returns true, no-op write.
// Lazy useState init: synchronous read on first React render — no flash.
```

Pitfall 5 (RESEARCH): naive `useState(false) + useEffect(write)` produces a 1-frame flash where parallax briefly animates on revisit before snapping static. The lazy init pattern `useState<boolean>(() => sessionStorage.getItem(key) !== null)` runs ONCE during first render, before paint — initial value matches reality.

D-19 (CONTEXT): «Flag is set on hero mount, in the same useEffect that reads it.» — i.e., session writes do NOT require user-scroll-past. Mount = saw. Reasoning: at 1920×1080 desktop the hero is fully visible at scroll 0, so user has «seen» it the moment the page paints.

D-18: sessionStorage key is `'vugoda:hero-seen'` (brand-prefixed namespace).

D-20: `prefersReducedMotion` is a HARD override — RM always wins. Code shape: `const skipParallax = prefersReducedMotion || heroSeen;` (boolean OR with RM in dominant position is fine — both branches converge on identical static-mode output).
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/hooks/useSessionFlag.ts (D-21)</name>
  <read_first>
    - src/lib/assetUrl.ts (named-export + @module doc-block convention to follow — `src/hooks/` is a new directory but follows the same module-style)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-21, §D-18, §D-19 (key, write semantics)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pattern 3 (verbatim file body)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Pitfall 5 (lazy init avoids first-paint flash)
  </read_first>
  <files>src/hooks/useSessionFlag.ts</files>
  <behavior>
    - Test 1: File exists at exact path `src/hooks/useSessionFlag.ts` (creates `src/hooks/` directory as first member)
    - Test 2: Single named export `useSessionFlag(key: string): boolean`
    - Test 3: Lazy useState initializer reads sessionStorage synchronously on first render: `useState<boolean>(() => { if (typeof window === 'undefined') return false; return sessionStorage.getItem(key) !== null; })`
    - Test 4: useEffect writes flag once if not already set, guarded by useRef to prevent double-write in StrictMode dev double-mount: `wroteOnce.current` ref pattern
    - Test 5: SSR-safe — checks `typeof window === 'undefined'` in both lazy init and useEffect
    - Test 6: Hook returns the `wasAlreadySet` boolean from lazy init (NOT the post-effect value — first-render value is what consumers branch on, no flicker)
  </behavior>
  <action>
    First, create the directory if it does not exist:
    `mkdir -p src/hooks`

    Then create new file at exact path `src/hooks/useSessionFlag.ts` with this EXACT contents (verbatim from RESEARCH §Pattern 3):

    ```ts
    /**
     * @module hooks/useSessionFlag
     *
     * Tiny custom hook for one-shot session-scoped flags. Phase 5 D-21.
     *
     * Returns true if the sessionStorage key was already set when this hook
     * first ran (i.e. user has been here before in this session). On first
     * call ever in the session, the hook returns false AND writes the flag,
     * so subsequent mounts return true.
     *
     * Single-purpose for Phase 5: Hero parallax skip on revisit (D-17..D-20).
     * Reusable for future first-visit-only animations (e.g. v2 onboarding
     * tooltips on /projects filter).
     *
     * Lazy useState initializer reads sessionStorage SYNCHRONOUSLY on first
     * React render — initial value matches reality on first paint, no
     * flash-of-cinematic-then-static (Pitfall 5).
     *
     * SSR-safe by pattern (project has no SSR but the typeof window check is
     * cheap insurance). Returns false during SSR.
     *
     * Pure utility — NO React imports beyond useState/useEffect/useRef. NO
     * external deps.
     */
    import { useEffect, useRef, useState } from 'react';

    export function useSessionFlag(key: string): boolean {
      const [wasAlreadySet] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return sessionStorage.getItem(key) !== null;
      });
      const wroteOnce = useRef(false);

      useEffect(() => {
        if (typeof window === 'undefined') return;
        if (wroteOnce.current) return;
        wroteOnce.current = true;
        if (sessionStorage.getItem(key) === null) {
          sessionStorage.setItem(key, '1');
        }
      }, [key]);

      return wasAlreadySet;
    }
    ```

    Doc-block self-screen: text contains no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals. The phrase `sessionStorage.getItem(key)` appears only in real code (and is what VALIDATION map row greps for to confirm the hook implements the SessionStorage write correctly).
  </action>
  <verify>
    <automated>test -d src/hooks && test -f src/hooks/useSessionFlag.ts && grep -nE '^export function useSessionFlag' src/hooks/useSessionFlag.ts | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE "sessionStorage\\.getItem|sessionStorage\\.setItem" src/hooks/useSessionFlag.ts | wc -l | tr -d ' ' | grep -q '^[34]$' && grep -n 'useState<boolean>' src/hooks/useSessionFlag.ts | wc -l | tr -d ' ' | grep -q '^1$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - Directory `src/hooks/` exists; file `src/hooks/useSessionFlag.ts` exists
    - `grep -nE '^export function useSessionFlag' src/hooks/useSessionFlag.ts` returns 1 match
    - `grep -nE "sessionStorage\\.(get|set)Item.*key" src/hooks/useSessionFlag.ts` returns ≥ 2 matches (covers VALIDATION map row for SC#5 hook)
    - `grep -n 'useState<boolean>' src/hooks/useSessionFlag.ts` returns 1 (lazy init pattern present — Pitfall 5 mitigation)
    - `npm run lint` exits 0 (hook type-checks against react 19.2)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Wire useSessionFlag + parallaxRange into Hero.tsx (D-28 — minimal 5-line edit)</name>
  <read_first>
    - src/components/sections/home/Hero.tsx (current verbatim form — confirm 5 lines change spec)
    - src/hooks/useSessionFlag.ts (verify hook is created in Task 1)
    - src/lib/motionVariants.ts (verify parallaxRange named export from 05-01)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-17..D-21, §D-28 (cross-cutting Hero edit)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Code Examples Example 2 (verbatim Phase 5 Hero form)
  </read_first>
  <files>src/components/sections/home/Hero.tsx</files>
  <behavior>
    - Test 1: New imports added — `parallaxRange` from `'../../../lib/motionVariants'` and `useSessionFlag` from `'../../../hooks/useSessionFlag'`
    - Test 2: Inside Hero function, `const heroSeen = useSessionFlag('vugoda:hero-seen');` added after `prefersReducedMotion`
    - Test 3: `const skipParallax = prefersReducedMotion || heroSeen;` added — combines both gates per D-20
    - Test 4: useTransform call changed: outputRange becomes `skipParallax ? [0, 0] : parallaxRange` (was `prefersReducedMotion ? [0, 0] : [0, -100]`)
    - Test 5: NO other changes to Hero — useRef, useScroll, JSX structure, all other imports byte-identical
    - Test 6: Doc-block updated to reference Phase 5 D-17..D-21, D-28 as authoritative for the new behaviour
    - Test 7: NO inline `transition={{...}}` JSX prop introduced (SC#1 grep gate stays clean)
    - Test 8: NO inline `[0, -100]` literal remains in Hero.tsx (D-28 SOT lift — magnitude lives in motionVariants only)
  </behavior>
  <action>
    Replace ENTIRE contents of `src/components/sections/home/Hero.tsx` with this exact code (combines Phase 3 D-04 form with Phase 5 D-28 edits):

    ```tsx
    /**
     * @module components/sections/home/Hero
     *
     * HOME-01 + ANI-01 + VIS-03 + VIS-04 — the desktop-opening hero.
     *
     * Anatomy (Phase 3 D-01..D-06):
     *   - 100vh section, max-w-7xl inner content (D-01, D-24)
     *   - <h1> ВИГОДА Montserrat 700 uppercase, clamp(120px, 12vw, 200px) (D-02)
     *   - <IsometricGridBG opacity 0.15> overlay, parallax-translates UP on scroll (D-03 + D-04)
     *   - Gasло paragraph from src/content/home.ts (D-06, D-29)
     *   - CTA "Переглянути проекти" -> /projects via <Link> (D-05)
     *
     * Parallax recipe (D-04 + Phase 5 D-28):
     *   - useScroll scoped to hero section (target: heroRef) — stops once hero scrolls out
     *   - useTransform maps scrollYProgress 0->1 to translateY 0 -> -100px
     *     (Roadmap SC#1 says strictly «<120px»; -100 keeps a 20px headroom)
     *   - The [0, -100] magnitude lives in `parallaxRange` named export in
     *     src/lib/motionVariants.ts (Phase 5 D-22 SOT). Hero imports it; the
     *     hook calls themselves stay component-local per React rule-of-hooks.
     *   - Linear (no spring, no bounce — D-04)
     *
     * Reduced-motion + session-skip (Phase 5 D-17..D-21):
     *   - useReducedMotion() — when reduce, output range collapses to [0, 0]
     *     (hard override per D-20)
     *   - useSessionFlag('vugoda:hero-seen') — on 2nd+ visit in session, output
     *     range collapses to [0, 0] (cinematic intro skipped per SC#5;
     *     demo-pitch reload doesn't force re-watching)
     *   - Combined boolean: skipParallax = prefersReducedMotion || heroSeen
     *
     * NO inline Motion transition objects — Phase 5 SOT in motionVariants.ts
     * carries duration + ease via variants only (SC#1 grep gate).
     */

    import { useRef } from 'react';
    import {
      motion,
      useScroll,
      useTransform,
      useReducedMotion,
    } from 'motion/react';
    import { Link } from 'react-router-dom';
    import { IsometricGridBG } from '../../brand/IsometricGridBG';
    import { heroSlogan, heroCta } from '../../../content/home';
    import { parallaxRange } from '../../../lib/motionVariants';
    import { useSessionFlag } from '../../../hooks/useSessionFlag';

    export function Hero() {
      const heroRef = useRef<HTMLElement>(null);
      const prefersReducedMotion = useReducedMotion();
      const heroSeen = useSessionFlag('vugoda:hero-seen');
      const skipParallax = prefersReducedMotion || heroSeen;

      const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
      });

      const cubeY = useTransform(
        scrollYProgress,
        [0, 1],
        skipParallax ? [0, 0] : parallaxRange,
      );

      return (
        <section
          ref={heroRef}
          className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg"
        >
          {/* Parallax overlay — translates UP on scroll, behind wordmark */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ y: cubeY }}
          >
            <IsometricGridBG className="h-full w-full" opacity={0.15} />
          </motion.div>

          {/* Hero content — max-w-7xl per D-24 */}
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">
            <h1 className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text">
              ВИГОДА
            </h1>
            <p className="max-w-3xl text-xl text-text">{heroSlogan}</p>
            <Link
              to="/projects"
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
            >
              {heroCta}
            </Link>
          </div>
        </section>
      );
    }
    ```

    Diff vs Phase 3 form:
    1. New imports: `parallaxRange` from motionVariants, `useSessionFlag` from hooks
    2. New const: `heroSeen = useSessionFlag('vugoda:hero-seen')`
    3. New const: `skipParallax = prefersReducedMotion || heroSeen`
    4. useTransform outputRange: `skipParallax ? [0, 0] : parallaxRange` (was `prefersReducedMotion ? [0, 0] : [0, -100]`)
    5. Doc-block extended with Phase 5 D-17..D-21, D-28 references

    The JSX block is byte-identical to Phase 3 form. The wordmark «ВИГОДА» (Cyrillic), the heroSlogan, the heroCta, the IsometricGridBG, the Link to /projects — all unchanged.

    Doc-block self-screen:
    - The phrase «no inline Motion transition objects» does NOT contain the literal `transition={{` (no double-open-brace pattern in JSDoc)
    - No `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals
    - The literal `[0, -100]` appears only in the JSDoc as descriptive prose («maps scrollYProgress 0->1 to translateY 0 -> -100px») — NOT as code; check-brand has no rule against this pattern in JSDoc
    - VALIDATION map row "import.*parallaxRange" — line `import { parallaxRange } from '../../../lib/motionVariants'` matches the regex `import.*parallaxRange`
    - VALIDATION map row "useSessionFlag\\('vugoda:hero-seen'\\)" — line `useSessionFlag('vugoda:hero-seen')` matches verbatim

    Critical check: `grep -nE "useTransform.*\[0, -100\]" src/components/sections/home/Hero.tsx` returns 0 — the inline magnitude is fully replaced by `parallaxRange`. (D-28 SOT lift complete.)
  </action>
  <verify>
    <automated>grep -n "import { parallaxRange } from '../../../lib/motionVariants'" src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n "import { useSessionFlag } from '../../../hooks/useSessionFlag'" src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n "useSessionFlag('vugoda:hero-seen')" src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'skipParallax' src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^[23]$' && grep -nE 'useTransform' src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^[12]$' && grep -nE 'transition=\{\{' src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^0$' && grep -n 'useReducedMotion' src/components/sections/home/Hero.tsx | wc -l | tr -d ' ' | grep -q '^[12]$' && npm run build 2>&1 | tail -3 | grep -qE '[0-9]+/[0-9]+ checks passed' && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `import { parallaxRange } from '../../../lib/motionVariants'` present (covers VALIDATION map row "import.*parallaxRange")
    - `import { useSessionFlag } from '../../../hooks/useSessionFlag'` present
    - `useSessionFlag('vugoda:hero-seen')` called once in Hero (covers VALIDATION map row "useSessionFlag('vugoda:hero-seen')")
    - `skipParallax` boolean used in useTransform outputRange ternary
    - `useReducedMotion` still imported and called (Phase 3 D-04 precedent maintained, D-25 Phase 5 RM threading consumer #3)
    - `grep -nE 'transition=\{\{' src/components/sections/home/Hero.tsx` returns 0 (no inline transitions added — SC#1 grep gate clean)
    - `grep -nE 'useTransform.*\[0, -100\]' src/components/sections/home/Hero.tsx` returns 0 (D-28 SOT lift — inline magnitude removed)
    - `npm run build` exits 0 (lint + check-brand 4/4 PASS + bundle ≤140 KB gzipped)
    - At runtime: cold incognito tab → `/` → scroll, parallax animates (cinematic). Same-tab refresh → `/` → scroll, IsometricGridBG sits static at y:0 (skipped). Tab close + new tab → cinematic returns. (VALIDATION manual gate — verified by user during Phase 6 / verify-work.)
  </done>
</task>

</tasks>

<verification>
- `npm run build` exits 0 — full pipeline including lint and check-brand 4/4
- Phase 5 SC#1 grep gate `! grep -rn 'transition=\{\{' src/` exits 1 (no inline transition objects added)
- Bundle delta: useSessionFlag is ~25 lines (~300 B raw, ~150 B gzipped); Hero edit removes a literal `[0, -100]` and adds two import statements (~50 B net). Bundle target: ≤140 KB gzipped.
- Phase 5 SC#5 grep gates (from VALIDATION map):
  - `grep -nE "sessionStorage\.(get|set)Item.*'vugoda:hero-seen'|key" src/hooks/useSessionFlag.ts` — covered by Task 1
  - `grep -n "useSessionFlag\('vugoda:hero-seen'\)" src/components/sections/home/Hero.tsx` — covered by Task 2
  - `grep -n "import.*parallaxRange" src/components/sections/home/Hero.tsx` — covered by Task 2
- Manual verification (deferred to Phase 6 / VALIDATION manual gates):
  - Cold incognito tab → /: cinematic parallax animates
  - Same-tab refresh: static hero (IsometricGridBG sits at y:0, no scroll-driven motion)
  - Tab close + new tab: cinematic returns (sessionStorage cleared on tab close)
  - DevTools → Application → Storage → Session storage: confirm `vugoda:hero-seen=1` after first paint of /
  - DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → cold tab → /: hero static (D-20 hard override; same output as session-skip path)
</verification>

<success_criteria>
- [ ] `src/hooks/useSessionFlag.ts` exists with single named export `useSessionFlag(key: string): boolean`
- [ ] Hook uses lazy useState initializer (Pitfall 5 mitigation — no first-paint flash)
- [ ] Hook writes flag in useEffect with useRef double-write guard (StrictMode-safe)
- [ ] Hero.tsx imports parallaxRange from motionVariants (D-28 SOT lift; inline `[0, -100]` removed)
- [ ] Hero.tsx imports useSessionFlag from hooks
- [ ] Hero.tsx calls `useSessionFlag('vugoda:hero-seen')` (D-18 namespaced key)
- [ ] Hero.tsx computes `skipParallax = prefersReducedMotion || heroSeen` (D-20 RM hard override)
- [ ] useTransform outputRange ternary uses `skipParallax ? [0, 0] : parallaxRange`
- [ ] `npm run build` exits 0 with check-brand 4/4 PASS
- [ ] Phase 5 SC#1 grep gate clean (no inline transition objects added)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-07-hero-session-skip-SUMMARY.md` documenting:
- Verbatim final form of useSessionFlag.ts (~25 lines — for VALIDATION/verify-work cross-reference)
- Verbatim Hero.tsx diff vs Phase 3 form (5-line change — imports + skipParallax + useTransform outputRange)
- Confirmation of D-28 SOT lift: `[0, -100]` literal no longer appears in Hero.tsx body (only in JSDoc descriptive prose)
- Bundle size delta vs Plan 05-06 baseline (expected: ~+150 B gzipped)
- Note for Phase 6 Lighthouse runs: clear sessionStorage between cold runs (chrome --incognito flag, or storage clear in DevTools) — else second pass measures static hero (artificially cheap Performance score)
- Note for Phase 7 hard-refresh test (CONTEXT §Phase 7 integration): cold incognito tab re-shows cinematic; same-tab refresh during a session = static. Document for client demo.
</output>
