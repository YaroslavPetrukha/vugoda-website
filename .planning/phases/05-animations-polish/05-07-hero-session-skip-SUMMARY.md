---
phase: 05-animations-polish
plan: 07
subsystem: ui
tags: [motion, react-hooks, sessionStorage, parallax, hero, useReducedMotion, useTransform]

# Dependency graph
requires:
  - phase: 05-animations-polish
    provides: parallaxRange named export from src/lib/motionVariants.ts (Plan 05-01)
  - phase: 03-brand-primitives-home-page
    provides: Hero.tsx with useScroll + useTransform parallax recipe (D-04)
provides:
  - useSessionFlag(key) custom hook — one-shot read+write of sessionStorage flag
  - Hero parallax skip on revisit within session (SC#5)
  - D-28 SOT lift complete — inline [0, -100] removed from Hero code
affects: [phase-06-validation, phase-07-deploy]

# Tech tracking
tech-stack:
  added: []  # No new deps — pure React hook + sessionStorage Web API
  patterns:
    - "Lazy useState initializer for synchronous SSR-safe storage reads (Pitfall 5 mitigation)"
    - "useRef double-write guard for StrictMode dev double-mount safety"
    - "src/hooks/ directory established for custom hooks (first member)"

key-files:
  created:
    - src/hooks/useSessionFlag.ts
  modified:
    - src/components/sections/home/Hero.tsx

key-decisions:
  - "useSessionFlag returns boolean only (one-shot semantic) — no [flag, setFlag] tuple, since hero use case is read-only after first paint"
  - "useTransform spread workaround [...parallaxRange] — readonly tuple from `as const` does not satisfy useTransform's mutable number[] signature; spread preserves D-28 SOT lift while satisfying TS"
  - "skipParallax = prefersReducedMotion || heroSeen — reduced-motion is hard override per D-20, OR-combined since both branches converge on identical static-mode output"

patterns-established:
  - "Session-scoped flag pattern: lazy init + useEffect write + useRef guard. Reusable for v2 first-visit-only animations (e.g. /projects filter onboarding tooltips)."
  - "Branded sessionStorage key namespace: 'vugoda:*' prefix per D-18"
  - "Single-purpose custom hook lives in src/hooks/ as named export with @module JSDoc, mirroring src/lib/* convention"

requirements-completed: [ANI-02, ANI-04]

# Metrics
duration: 4min
completed: 2026-04-26
---

# Phase 05 Plan 07: Hero Session Skip Summary

**Session-scoped hero parallax skip via useSessionFlag hook — first visit gets cinematic, refresh/revisit in same session renders static (SC#5; D-17..D-21, D-28).**

## Performance

- **Duration:** ~4 min (executor wall-clock)
- **Started:** 2026-04-26T06:29:36Z
- **Completed:** 2026-04-26T06:33:05Z
- **Tasks:** 2
- **Files modified:** 2 (1 created + 1 edited)

## Accomplishments

- `useSessionFlag(key)` custom hook in `src/hooks/useSessionFlag.ts` — first member of the new `src/hooks/` directory. Lazy useState initializer reads sessionStorage synchronously on first render (Pitfall 5 mitigation, no first-paint flash). useRef guard prevents StrictMode double-write. SSR-safe by pattern (`typeof window === 'undefined'`).
- `Hero.tsx` wired to call `useSessionFlag('vugoda:hero-seen')` (D-18 brand-namespaced key) and combine with `useReducedMotion()` into a single `skipParallax` boolean. useTransform outputRange flips between `[0, 0]` (static) and `[...parallaxRange]` (cinematic).
- D-28 SOT lift complete: inline `[0, -100]` magnitude is GONE from Hero code body — sourced from `parallaxRange` named export in `src/lib/motionVariants.ts`. The literal appears only in JSDoc descriptive prose (line 17), not in any code expression.
- Phase 5 SC#1 grep gate stays clean across `src/` (no inline `transition={{...}}` props introduced).
- check-brand 5/5 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries, noInlineTransition).

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/hooks/useSessionFlag.ts (D-21)** — `daafdc5` (feat)
2. **Task 2: Wire useSessionFlag + parallaxRange into Hero.tsx (D-28)** — committed as part of `fbe447f` (parallel-agent collision; see Issues Encountered)

_Note: Task 2 file changes match plan exactly. The Hero.tsx + deferred-items.md were swept into sibling 05-05a's commit (fbe447f) due to a parallel-execution working-tree race in Wave 3. Final state on disk is verified to match the plan._

## Files Created/Modified

### Created — `src/hooks/useSessionFlag.ts` (44 lines, ~1.5 KB raw)

Verbatim final form (per VALIDATION/verify-work cross-reference):

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

### Modified — `src/components/sections/home/Hero.tsx`

5-line diff vs Phase 3 D-04 form (per D-28):

```diff
+ import { parallaxRange } from '../../../lib/motionVariants';
+ import { useSessionFlag } from '../../../hooks/useSessionFlag';

  export function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();
+   const heroSeen = useSessionFlag('vugoda:hero-seen');
+   const skipParallax = prefersReducedMotion || heroSeen;

    const { scrollYProgress } = useScroll({ ... });

    const cubeY = useTransform(
      scrollYProgress,
      [0, 1],
-     prefersReducedMotion ? [0, 0] : [0, -100],
+     skipParallax ? [0, 0] : [...parallaxRange],
    );

    return ( /* JSX byte-identical to Phase 3 form */ );
  }
```

JSDoc block extended with Phase 5 D-17..D-21 + D-28 references; the JSX block (section, motion.div, h1, p, Link) is byte-identical.

## D-28 SOT lift verification

- `grep -nE 'useTransform.*\[0, -100\]' src/components/sections/home/Hero.tsx` → 0 matches (PASS — no inline magnitude in code)
- `grep -nE '\[0, -100\]' src/components/sections/home/Hero.tsx` → 1 match on line 17 (JSDoc descriptive prose only — `* The [0, -100] magnitude lives in parallaxRange named export…`). check-brand has no rule against this pattern in JSDoc; confirmed allowed by Task 2 self-screen and verified clean.
- `grep -n 'import.*parallaxRange' src/components/sections/home/Hero.tsx` → 1 match (VALIDATION map row covered)
- `grep -n "useSessionFlag('vugoda:hero-seen')" src/components/sections/home/Hero.tsx` → 1 match in code (line 50) + 1 in JSDoc (line 25) (VALIDATION map row covered)

## Bundle size delta vs Plan 05-06 baseline

- `useSessionFlag.ts` raw source: 1535 B; ~300 B of executable code (rest is JSDoc); ~150 B gzipped after tree-shake.
- `Hero.tsx` net: removed `[0, -100]` literal, added two import statements + two consts + one `[...parallaxRange]` spread. Net ~+50 B raw, near-zero gzipped (imports dedupe against existing Hero ones).
- **Estimated total bundle delta: ~+150 B gzipped.** Bundle target ≤140 KB gzipped — well within budget. Final measurement deferred to Wave-3-end orchestrator full `npm run build`.

## Decisions Made

- **One-shot hook semantic vs `[flag, setFlag]` tuple** (Claude's-Discretion call from RESEARCH Open Q + plan §interfaces): chose one-shot `(key: string) => boolean`. Hero use case is read-only after first paint — no consumer needs to manually clear or re-set the flag. Stateful tuple is YAGNI for Phase 5; can be added in v2 if onboarding tooltip use case demands programmatic reset.
- **`skipParallax = prefersReducedMotion || heroSeen` ordering** (D-20): RM placed first as the dominant gate. Both branches converge on identical `[0, 0]` output; the OR is purely for readability — code reviewer sees "RM is hard override" before "session-skip is the OR-combined extension".
- **Spread `[...parallaxRange]` instead of relaxing the `as const` on the export** (Rule 3 deviation, see below): preserves the readonly intent at the SOT (motionVariants.ts) and pays the 1-spread cost only at the consumer. Alternative would have been to drop `as const`, but that would weaken the type guarantee that Phase 5 SOT exports are immutable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] useTransform readonly-tuple type rejection**
- **Found during:** Task 2 (Hero.tsx wire-up; `npm run lint` after first write)
- **Issue:** Plan's `skipParallax ? [0, 0] : parallaxRange` produced TS2769 — useTransform's overload signature requires `number[]` (mutable), but `parallaxRange` is `readonly [0, -100]` due to `as const` on the SOT export. The conditional unioned the two into `readonly [0, -100] | number[]`, which fails the mutable-array overload.
- **Fix:** Changed outputRange to `skipParallax ? [0, 0] : [...parallaxRange]` — spread converts the readonly tuple to a fresh mutable array per render. Cost is negligible (one 2-element array allocation per render); preserves D-28 SOT lift (the magnitude is still sourced from the named export).
- **Files modified:** `src/components/sections/home/Hero.tsx` (line 61, one-character change vs plan)
- **Verification:** `npm run lint` clean for Hero.tsx; `grep -cE 'useTransform.*\[0, -100\]' src/components/sections/home/Hero.tsx` → 0 (D-28 SOT lift still complete — magnitude is not inline literal).
- **Committed in:** `fbe447f` (collision-merged with sibling 05-05a; see Issues Encountered)

---

**Total deviations:** 1 auto-fixed (1 blocking, type-system issue)
**Impact on plan:** The fix is a 1-character change (`parallaxRange` → `[...parallaxRange]`) that satisfies TypeScript without compromising any plan invariant. The D-28 SOT lift goal — "no inline numeric literal in Hero.tsx" — is achieved as specified. RESEARCH did not catch this because the readonly-vs-mutable subtype clash is specific to motion@12's overload set.

## Issues Encountered

**1. Parallel-agent commit collision in Wave 3 (Task 2)**

When I attempted to commit Task 2 (`git add src/components/sections/home/Hero.tsx .planning/phases/05-animations-polish/deferred-items.md && git commit`), my staged changes were swept into sibling 05-05a's commit `fbe447f` instead of producing a new HEAD commit. The collision occurred because parallel agents in Wave 3 share the same working tree, and one sibling's `git add` operation picked up my pre-staged Hero.tsx mid-flight.

**Resolution:** No action needed — the work IS committed (under `fbe447f`), the file content on disk matches the plan exactly, and `git log --all --follow -- src/components/sections/home/Hero.tsx` confirms the changes are in HEAD. Wave 3 orchestrator should be aware that this commit hash (`fbe447f`) contains both 05-05a's ZhkHero work AND 05-07's Hero session-skip wire-up. SUMMARY references this commit hash for Task 2.

**2. Out-of-scope TS error in StageFilter.tsx (logged to deferred-items.md)**

`tsc --noEmit` surfaces a TS2322 error in `src/components/sections/projects/StageFilter.tsx:60` — `role` and `aria-label` props rejected on Stagger component when `as="div"`. The error is from sibling Wave 3 work (05-04 reveal-home-page or 05-05a/b reveal-zhk/other) that introduced a Stagger with these props. **Not fixed in 05-07** (out of scope per plan). Logged to `.planning/phases/05-animations-polish/deferred-items.md` for the Wave 3 orchestrator's post-wave validation pass.

## User Setup Required

None — no external service configuration. Behavior is verifiable purely in the browser's DevTools (Application → Storage → Session storage shows `vugoda:hero-seen=1` after first paint of `/`).

## Phase 6 / Phase 7 handoff notes

**For Phase 6 Lighthouse runs:** clear sessionStorage between cold runs (use Chrome `--incognito` or DevTools → Application → Storage → "Clear site data") before each measurement pass. Otherwise the second pass measures static-mode hero (no parallax = artificially cheap Performance score; the cinematic-pass score is the one that matters for the budget gate ≥90).

**For Phase 7 hard-refresh / demo:** cold incognito tab + visit `/` → cinematic parallax animates. Same-tab refresh during the same browser session → static hero (no scroll motion). Tab close + new tab → cinematic returns (sessionStorage cleared on tab close). Document this for the client demo so a "second look" reload doesn't surprise the client into thinking the parallax broke.

**For Phase 6 reduced-motion test:** DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → cold incognito tab → `/` → hero is static (D-20 hard override). Output is identical to session-skip path — both branches converge on `[0, 0]`.

## Next Phase Readiness

- 05-07 deliverables complete and verified.
- Wave 3 sibling work (05-04, 05-05a, 05-05b, 05-06) committed in parallel — orchestrator should run final post-wave `npm run build` to validate the full Wave 3 closure (including the out-of-scope StageFilter TS error owned by sibling 05-04/05-05a).
- Plan 05-08 (no-inline-transition CI gate) was completed earlier — SC#1 grep gate stayed clean across this plan's edits.

## Self-Check: PASSED

- File `src/hooks/useSessionFlag.ts` exists at expected path (44 lines, single named export, lazy useState init present, SSR-safe guards present).
- File `src/components/sections/home/Hero.tsx` modified at expected path with all 5 plan-spec edits applied (parallaxRange import, useSessionFlag import, heroSeen const, skipParallax const, useTransform outputRange ternary).
- Commit `daafdc5` exists in git log (Task 1 — useSessionFlag.ts).
- Commit `fbe447f` exists in git log and contains both Hero.tsx 5-line edit and deferred-items.md addition (Task 2 — collision-merged into sibling 05-05a's commit).
- check-brand 5/5 PASS.
- Phase 5 SC#1 grep gate clean.
- D-28 SOT lift verified via grep (no inline `[0, -100]` in code body; JSDoc descriptive prose only).

---
*Phase: 05-animations-polish*
*Completed: 2026-04-26*
