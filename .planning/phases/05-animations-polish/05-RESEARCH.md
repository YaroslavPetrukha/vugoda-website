# Phase 5: Animations & Polish — Research

**Researched:** 2026-04-26
**Domain:** Motion 12.x + React Router 7.14 inter-route animation, Tailwind v4 `@utility` consolidation, `prefers-reduced-motion` threading, sessionStorage hero gating
**Confidence:** HIGH on all 9 spike questions (Motion + Router exports verified at runtime; Tailwind v4 `@utility` nesting verified against official docs; `paletteWhitelist()` rgba acceptance verified against live `check-brand.ts` run)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

CONTEXT.md ships **28 numbered decisions D-01..D-28** across 4 areas. Researcher MUST treat them as authoritative — research targets the spike, not the choices. Verbatim copy is suppressed for length; planner reads CONTEXT.md directly. The decisions cluster as follows:

**A1 — Reveal scope & stagger (D-01..D-09):** `<RevealOnScroll>` is the sole reveal API; default variant `fadeUp`; viewport `{ once: true, margin: '-50px' }` (D-07); 80ms universal stagger (D-02); /construction-log photos reveal per-MonthGroup only (D-04); /zhk gallery 8 thumbs at 80ms stagger (D-05); Hero excluded entirely (D-06); /zhk hero render uses `fade` variant (opacity-only) per D-09 to protect LCP.

**A2 — Route transitions + ScrollToTop (D-10..D-16):** `<AnimatePresence mode="wait" initial={false}>` lives in `Layout.tsx` wrapping `<Outlet/>` (D-10); `pageFade` = pure opacity 0↔1, 350ms exit / 400ms enter, easeBrand (D-11); key on `location.pathname` (D-12); inline `<motion.div>` wrapper, no new file (D-13); `ScrollToTop.tsx` REPLACED by `onExitComplete={() => window.scrollTo(0,0)}` callback (D-14); back-button scroll-restore is v2 (D-15); lightbox coexistence — no coordination needed (D-16).

**A3 — Session-skip hero (D-17..D-21):** Skip parallax entirely on revisit (D-17); sessionStorage key `'vugoda:hero-seen'` (D-18); flag set on hero mount, no scroll-past gate (D-19); `prefersReducedMotion` is a hard override — RM always wins (D-20); `useSessionFlag` is a tiny `src/hooks/useSessionFlag.ts` custom hook (D-21).

**A4 — `motionVariants.ts` shape + hover DRY + RM threading (D-22..D-27):** Named exports — `easeBrand`, `durations`, `fadeUp`, `fade`, `stagger`, `pageFade`, `parallaxRange` (D-22); `--ease-brand` CSS variable in `@theme` (D-23); `@utility hover-card` block consolidates Phase 4's 5-surface hover string (D-24); per-component `useReducedMotion()` hook calls — no provider, no context (D-25, D-26); `check-brand.ts` does NOT need new rules; optional `noInlineTransition()` 5th check is planner discretion (D-27).

**Cross-cutting (D-28):** Hero.tsx absorbs `parallaxRange` import + `useSessionFlag` — minimal ~5-line edit.

### Claude's Discretion

Per CONTEXT.md `<decisions> § Claude's Discretion` — planner picks within brand:

- Exact `delayChildren` value when `staggerChildren=true` is requested with custom delay (default 0; planner may set 80ms for StageFilter chip row).
- Whether `<RevealOnScroll>` exposes a `<RevealItem>` helper (`<motion.div variants={fadeUp}>`) or expects callers to inline it.
- Whether `ScrollToTop.tsx` is deleted or kept as a no-op-with-deprecation comment.
- Whether to add an optional `noInlineTransition()` 5th check to `scripts/check-brand.ts`.
- Whether `parallaxRange` lives in `motionVariants.ts` (recommended) or sibling `motionConfig.ts`.
- Whether `pageFade.exit.transition.duration` is hardcoded (350ms per SC#3) or pulled from a new `durations.exit` field.
- Whether existing `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants in Phase 4's 5 surfaces are also removed (recommended yes — `@utility hover-card`'s `@media` block carries the equivalent).
- Lightbox open-anim absorption into SOT (recommended leave-as-is per D-16).
- Exact form of `useSessionFlag` (one-shot read+write vs stateful `[flag, setFlag]`).
- Whether `<RevealOnScroll>` defaults `as` prop to `'div'` or `'section'`.

### Deferred Ideas (OUT OF SCOPE)

Per CONTEXT.md `<deferred>`:

- Lightbox open-anim absorption into SOT (Phase 4 surface, not touched here).
- Browser back-button per-route scroll restoration — v2.
- Phase 4 hover triple-effect re-implemented as Motion variants — v2 if hover ever needs JS-driven state.
- IntersectionObserver pooling for high-N reveals — irrelevant at current N≤7 below-fold sections per page.
- Subtle slide / scale variants beyond `pageFade` — v2 if user feedback after demo.
- `will-change: transform` performance audit — Phase 6 if Lighthouse surfaces it.
- Auto-replay reveal on scroll-up via `once: false` — v2.
- MotionConfig provider for global Motion options — v2 if 20+ surfaces share config.
- Splash / preloader screen — out of scope (cinematic hero IS the splash).
- `/dev/brand` and `/dev/grid` route-transition exclusion — same `pageFade` as production routes; opt-out is planner-deferred.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description (from REQUIREMENTS.md) | Research Support |
|----|------------------------------------|------------------|
| **ANI-02** | Scroll-triggered reveal секцій — `<RevealOnScroll>` wrapper (Motion `whileInView` + `fadeUp` variant), ~400ms, stagger для карток. Один SOT варіантів у `lib/motionVariants.ts` — ніяких inline `transition={{…}}`. | Spike Q4 (RM hook in unwrapped branch), Q5 (`<motion.section>` semantic OK), Q6 (`will-change` not needed), Q9 (bundle ~3KB add) |
| **ANI-04** | Smooth route-transitions між 5 сторінками — `AnimatePresence mode="wait"` keyed on pathname, `pageFade` варіант. Respects `useReducedMotion`. | Spike Q1 (Outlet+key compat), Q2 (`onExitComplete` scroll sequencing), Q4 (RM threading), Q7 (HashRouter+pathname stable across base) |

</phase_requirements>

## Summary

All 9 spike questions resolved with HIGH confidence. The CONTEXT.md decisions are implementable as written; no architectural pivots required. Three findings the planner must internalise:

1. **`onExitComplete` + scroll-restore + `mode="wait"` is the canonical pattern** — verified against Motion docs, Max Schmitt's reference write-up, and motion issue #764. The callback fires precisely in the gap between exit-finished and enter-starting; `window.scrollTo(0,0)` lands invisibly during a brief blank-screen frame. NO race condition with React Router v7 because HashRouter does not provide native scroll restoration (verified against ScrollRestoration docs — explicitly «not available in Declarative mode»). Browser auto-restore on hash-route change is also a non-issue: hash navigation does not trigger the browser's built-in scroll-restoration heuristic. The `history.scrollRestoration = 'manual'` defensive flip is **not needed** but is harmless if planner wants belt-and-suspenders.

2. **Tailwind v4 `@utility` supports nested `&:hover` AND `@media (prefers-reduced-motion: reduce)` blocks AND `var(--ease-brand)` references — the D-24 spec is byte-correct as written.** Verified against the official «Adding custom styles» docs which show explicit nested pseudo-element/media-query examples (`@utility scrollbar-hidden { &::-webkit-scrollbar {...} }` is the documentation's own canonical example). Tree-shaking applies: the `hover-card` class is only emitted if it appears in scanned files, which it will (5 surfaces). The `paletteWhitelist()` check passes the `rgba(193, 243, 61, 0.15)` literal as-is because the regex matches `#[0-9A-Fa-f]{3,6}` literals only — decimal-RGB rgba() is invisible to the check. **Live verification: ran `npx tsx scripts/check-brand.ts` against current Phase 4 code (which already inlines that exact rgba 5×) — 4/4 PASS.** No exemption needed; D-24 ships clean.

3. **The `<motion.div key={location.pathname}>` inside `<AnimatePresence mode="wait" initial={false}>` directly wrapping `<Outlet/>` is the supported pattern** — confirmed against Motion's official AnimatePresence docs (direct-child + unique-key requirement) and against ARCHITECTURE §3 Q7's recipe. `<Outlet/>` is the rendered content, not a routing boundary; React Router v7 does not interfere because the outlet just renders the matched route's element. **`useSearchParams` filter state on `/projects` does NOT regress** because pathname stays `/projects` across `?stage=` chip clicks; the AnimatePresence key is stable, no remount, no state loss. Phase 4's StageFilter pattern survives Phase 5 unchanged.

**Primary recommendation:** Ship Phase 5 in 7 commits per the CONTEXT.md `<specifics>` granularity (motionVariants SOT → @utility hover-card → RevealOnScroll on home → RevealOnScroll on remaining pages → AnimatePresence in Layout → useSessionFlag + Hero skip → Hero parallaxRange import). Total impl is **~250 lines net**, **~3-5 KB gzipped bundle add**, **0 new npm dependencies**.

## Standard Stack

### Core (already installed — verified `node_modules/`)
| Library | Installed Version | Purpose | Status |
|---------|------|---------|--------------|
| `motion` | **12.38.0** (verified `node_modules/motion/package.json`, published 2026-03-17) | `motion`, `useScroll`, `useTransform`, `useReducedMotion`, `AnimatePresence` from `motion/react` | All 5 needed exports verified at runtime via `node -e "require('motion/react')"`. NO upgrade required. |
| `react-router-dom` | **7.14.2** (verified `node_modules/react-router-dom/package.json`) | `useLocation`, `useSearchParams`, `Outlet` | Already used. NO upgrade required. |
| `tailwindcss` | **4.2.4** + `@tailwindcss/vite@4.2.4` | `@theme`, `@utility` directives | `@utility` introduced in v4 GA; v4.2.4 supports nested CSS verified against docs. |
| `react` | **19.2.0** | hook ecosystem | No interaction issues. |

### NO new packages
Phase 5 adds **zero** runtime dependencies. The `useSessionFlag` hook is a 15-line custom file. No `MotionConfig` provider, no `framer-motion-router-transition`, no `react-helmet`, no animation lib.

**Version verification:** `npm view motion@latest` returned `12.38.0` (modified 2026-03-17). The installed version IS the latest. No registry drift.

## Architecture Patterns

### Recommended File Additions (Phase 5 only)
```
src/
├── lib/
│   └── motionVariants.ts           # NEW — named exports per D-22
├── hooks/                           # NEW directory (first member)
│   └── useSessionFlag.ts           # NEW — D-21
├── components/ui/
│   └── RevealOnScroll.tsx          # NEW — D-01
├── components/layout/
│   ├── Layout.tsx                  # MODIFIED — wrap <Outlet/> per D-10..D-13
│   └── ScrollToTop.tsx             # MODIFIED (no-op) or DELETED — D-14
├── components/sections/home/
│   └── Hero.tsx                    # MODIFIED — D-28 (parallaxRange + useSessionFlag)
└── index.css                       # MODIFIED — add --ease-brand to @theme + @utility hover-card per D-23, D-24
```

### Pattern 1: AnimatePresence + Outlet inside Layout
**What:** Single AnimatePresence wraps `<Outlet/>` directly. The keyed `<motion.div>` triggers re-mount on path change.
**When to use:** Every route nav.
**Verified pattern:**
```tsx
// src/components/layout/Layout.tsx (Phase 5 form)
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
Source: motion.dev/docs/react-animate-presence (verified 2026-04-26) + ARCHITECTURE.md §3 Q7.

### Pattern 2: RevealOnScroll with RM hook branch
**What:** Wrapper that swaps to direct children when `useReducedMotion()` is true.
**When to use:** Every below-fold section.
**Verified pattern:**
```tsx
// src/components/ui/RevealOnScroll.tsx
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
Source: D-01 + D-25 + Motion docs whileInView pattern.

### Pattern 3: useSessionFlag — one-shot read+write
**Verified pattern:**
```ts
// src/hooks/useSessionFlag.ts
import { useEffect, useRef, useState } from 'react';

/**
 * Returns true if the session-storage key was already set when this hook
 * first ran (i.e. the user has been here before in this session). On first
 * call ever in the session, the hook returns false AND writes the flag,
 * so subsequent mounts return true.
 *
 * Single-purpose: hero parallax skip on revisit (D-21).
 * Window-only: returns false during SSR (we have none, but pattern is safe).
 */
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
Recommended over `[flag, setFlag]` stateful form — simpler API, sufficient for D-21's hero use case.

### Anti-Patterns to Avoid
- **Inline `transition={{ duration: ... }}` on motion components** — SC#1 grep gate. Variants only, sourced from `motionVariants.ts`.
- **Wrapping Hero in `<RevealOnScroll>`** — D-06. Hero is LCP, must paint immediately.
- **Per-photo IO observers on /construction-log** — D-04. 50 IOs is the threshold SC#2 forbids.
- **Conditional `useScroll`/`useReducedMotion` calls** — React rule of hooks. Always call unconditionally; gate the OUTPUT (e.g., outputRange swap) per Hero.tsx Phase 3 D-04 precedent.
- **`will-change: transform` blanket** — Pitfall 16. Default off; planner verifies in Phase 6 Lighthouse.
- **`framer-motion` package install** — anti-list. Only `motion@^12.38.0`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| `prefers-reduced-motion` matchMedia subscription | Custom `useEffect` + `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ...)` | `useReducedMotion()` from `motion/react` | Motion already wraps it React-friendly with subscription cleanup (D-26) |
| Page-fade route transition state machine | Manual mount/unmount tracking with refs | `<AnimatePresence mode="wait">` + keyed motion.div | Motion's mode='wait' handles the exit-then-enter sequencing including the gap window |
| Scroll-to-top after exit anim | `setTimeout(() => scrollTo(0,0), 350)` racing the exit duration | `onExitComplete` callback on AnimatePresence | Fires precisely when all exiting nodes finish — no timing guess |
| Once-per-session flag | Module-level `let seen = false` (lost on full reload) | `sessionStorage` + custom hook | Survives reload within a tab; clears on tab close (D-18) |
| Hover triple-effect repeated 5× | Copy-paste long Tailwind class string | Tailwind v4 `@utility hover-card` block | One source of truth, one place to retune (D-24) |
| Easing constant in 8 components | Inline `[0.22, 1, 0.36, 1]` arrays everywhere | `easeBrand` named export + `--ease-brand` CSS var (lockstep) | SC#1 grep gate enforces this; two physical reps of one curve documented in D-22/D-23 |

## Common Pitfalls

### Pitfall 1: `key={location.search}` instead of `key={location.pathname}`
**What goes wrong:** Filter chip clicks on `/projects` (chip toggles `?stage=u-rozrakhunku`) trigger a fresh page-fade — disorienting and wasteful.
**Why it happens:** Naive «key on the whole location» reflex.
**How to avoid:** Per D-12, use `useLocation().pathname` only. Confirmed: `<motion.div key={location.pathname}>` does NOT re-mount on `?stage=` changes; `useSearchParams` chip state survives unchanged.
**Warning sign:** Visiting `/projects` then clicking «Будується» triggers a fade. Should be instant.

### Pitfall 2: `initial={true}` on AnimatePresence — entry fade on first paint
**What goes wrong:** Home page appears to fade in over a black background on first load — looks like a broken site rather than a cinematic intro. Hero's parallax hasn't started yet so the page just stutters.
**Why it happens:** Default `initial` in AnimatePresence is `true` (motion.dev docs verified).
**How to avoid:** D-10 mandates `initial={false}`. The pageFade `initial: { opacity: 0 }` is now ignored on first paint; only subsequent route changes animate.
**Warning sign:** First visit to `/` shows a 400ms fade-in covering the hero.

### Pitfall 3: `onExitComplete` does not fire on instant transitions
**What goes wrong:** When `useReducedMotion()` is true and we swap pageFade for a 0-duration variant, the callback might not fire. Result: scroll-to-top stops working in reduced-motion mode.
**Why it happens:** Motion's lifecycle for 0-duration animations is implementation-detail-dependent; older Motion versions sometimes skipped `onExitComplete` for synchronous exits.
**How to avoid:** Verified at Motion 12.38.0: 0-duration animations DO fire the exit lifecycle synchronously, so `onExitComplete` runs. Defensive fallback: planner can add a `useEffect(() => { window.scrollTo(0,0) }, [pathname])` ALSO when `prefersReducedMotion === true` (small redundancy, no UX harm). RECOMMENDED: leave the `onExitComplete` as the only scroll-restore mechanism; if a reduced-motion bug surfaces in Phase 6, add the defensive useEffect at that point. **Acceptance:** in DevTools toggle «Emulate prefers-reduced-motion: reduce», navigate route → scroll resets to top.

### Pitfall 4: `<motion.div>` re-mount on RM hook branch loses focus / lightbox state
**What goes wrong:** `<RevealOnScroll>`'s D-25 branch — when RM is true, render `<Tag>{children}</Tag>` instead of `<motion.div>{children}</motion.div>`. If the user toggles RM at runtime (rare but possible), the swap unmounts the wrapper subtree, losing any focused element or open `<dialog>` inside.
**Why it happens:** React reconciles by element type; `motion.div` and `div` are different types, force re-mount.
**How to avoid:** Phase 5 risk is extremely low — RM toggles at runtime are rare (typically OS-level preference set once). For safety, the alternative idiom is: ALWAYS render `<motion.div>` and pass `initial={false}` + `animate="visible"` (no `whileInView` / no variants) when RM is true. This keeps the element type stable. **Recommendation: keep D-25's unwrap branch as written** — the simpler idiom is more readable and the runtime-toggle case is not a real scenario for this MVP. Document the trade in `RevealOnScroll.tsx` JSDoc.
**Warning sign:** Toggle reduced-motion in DevTools mid-page — if a `<details>` is open inside a wrapped section, it closes.

### Pitfall 5: Hero `useSessionFlag` returns wrong value during initial paint
**What goes wrong:** If the hook returns `false` on first mount and `true` after a `useEffect`, the parallax renders for one frame then snaps to static — visible flash.
**Why it happens:** Naive `useState(false)` + `useEffect` write pattern produces this exact bug.
**How to avoid:** The pattern in Pattern 3 above uses a **lazy initializer** — `useState<boolean>(() => sessionStorage.getItem(key) !== null)` runs ONCE during the first React render, before paint. Initial value matches reality on the very first frame; no flash. The `useEffect` only handles the WRITE-back, not the read.
**Warning sign:** On second tab navigation back to `/`, hero parallax briefly animates before snapping static.

### Pitfall 6: `pageFade.exit` configured but exit anim never plays
**What goes wrong:** Variant declares `exit: { opacity: 0 }` but exiting page disappears instantly.
**Why it happens:** AnimatePresence requires the keyed motion.div to be a DIRECT child (verified motion docs). Wrapping in `<main>` or `<div>` breaks detection.
**How to avoid:** The pattern in Pattern 1 above places `<motion.div key={...}>` as the immediate child of `<AnimatePresence>` and puts `<Outlet/>` INSIDE the motion.div. NOT `<motion.div><main><Outlet/></main></motion.div>` outside the motion.div. The existing `<main>` in Layout.tsx wraps the AnimatePresence (chrome stays static), not the inverse.
**Warning sign:** Navigating routes — old page vanishes instantly, only new page fades in.

### Pitfall 7: Hash-route navigation triggers browser auto-restore racing onExitComplete
**What goes wrong:** Browser default scroll-restoration on `popstate` events could race the manual `window.scrollTo(0,0)` from `onExitComplete`.
**Why it happens:** History API includes `history.scrollRestoration = 'auto'` by default.
**How to avoid:** Verified: HashRouter changes don't trigger the browser's URL-bar scroll-restoration heuristic (the heuristic targets full-page navigations and back-forward, not hash changes). Manual `scrollTo` in `onExitComplete` is the only scroll movement and runs in the gap between exit-finished and enter-starting (confirmed via Max Schmitt's reference write-up). **No defensive `history.scrollRestoration = 'manual'` required**; if planner wants belt-and-suspenders, set it once in `main.tsx` — harmless. Also, D-15 explicitly defers per-route scroll RESTORE (the «remember-then-restore» feature is v2); this pitfall is about avoiding INTERFERENCE with our manual scroll-to-top, not implementing restoration.

## Code Examples

### Example 1: motionVariants.ts (D-22 verbatim shape)
```ts
// src/lib/motionVariants.ts
// SOT for all motion config — variants, easings, durations.
// Coupled with --ease-brand in src/index.css @theme — keep in lockstep.
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
Source: D-22 + Motion `Variants` type from `motion/react`.

### Example 2: Hero.tsx Phase 5 form (D-28 — minimal edit)
```tsx
// src/components/sections/home/Hero.tsx (Phase 5 form)
// Phase 3 D-04 useScroll + useTransform retained at component level
// (rule-of-hooks: cannot move out). Phase 5 swaps inline [0,-100] for
// parallaxRange import + adds useSessionFlag for D-17 revisit-skip.
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
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

  // ... existing JSX unchanged
}
```

### Example 3: index.css Phase 5 additions (D-23 + D-24)
```css
@theme {
  /* ... existing tokens ... */
  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
}

/*
 * Hover-card consolidation — Phase 5 D-24.
 * Replaces the duplicated Phase 4 hover-string on 5 surfaces:
 *   PortfolioOverview pipeline cards · FlagshipCard · PipelineCard
 *   ZhkGallery thumbs · MonthGroup thumbs
 * Coupled with --ease-brand (D-23). Reduced-motion neutralisation built in.
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
Source: D-23 + D-24 + Tailwind v4 `@utility` docs (verified nested CSS support: scrollbar-hidden example uses `&::-webkit-scrollbar` nested selector).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (same team) | 2024 rebrand | Phase 5 only uses `motion/react` — already current |
| Tailwind v3 `@layer components .hover-card` | Tailwind v4 `@utility hover-card` | Tailwind v4 GA (2024) | D-24 uses the v4-native primitive (verified docs) |
| `framer-motion-router-transition` 3rd-party libs | Native `<AnimatePresence>` + `<Outlet>` + `key={pathname}` | Stable since Motion 6+ / Router v6 | No 3rd-party libs needed — D-13 inline pattern |
| `<ScrollRestoration/>` from React Router | Manual `onExitComplete` for HashRouter | React Router v7 ScrollRestoration is data-router only | D-14's pattern is the correct one for HashRouter |

## Open Questions

1. **Should `RevealOnScroll`'s `as` prop default to `'div'` or `'section'`?**
   - What we know: D-01 default is `'div'`; CONTEXT.md `<specifics>` notes `'section'` is more semantic for typical consumers but conservative default = div.
   - Recommendation: keep `'div'` default, document that consumers wrapping a top-level page section should pass `as="section"`. Most call sites in Phase 5 will pass `as="section"` (BrandEssence, PortfolioOverview, etc.) — that's fine, no fight with the default.

2. **Should planner add `noInlineTransition()` 5th check to `check-brand.ts`?**
   - What we know: D-27 leaves it optional. Current `grep -rn "transition={{" src/` returns 0 matches (verified). SC#1 grep gate is satisfied today.
   - Recommendation: ADD the optional 5th check for forward defence. Cost is ~10 lines in check-brand.ts; benefit is permanent enforcement. Use the existing 4-check pattern.

3. **`<RevealItem>` helper component — ship or skip?**
   - What we know: D-01 leaves to planner discretion. With staggerChildren, every child must be `<motion.div variants={fadeUp}>`.
   - Recommendation: SKIP. Inline `<motion.div variants={fadeUp}>` is 30 chars, perfectly readable. Adding `<RevealItem>` is one more component to import and document; doesn't earn its keep. If planner sees ≥3 stagger consumers writing the same `<motion.div variants={fadeUp}>`, revisit.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm scripts | ✓ | 20.19+ (assumed per .nvmrc convention from STACK.md) | — |
| `motion@^12.38.0` | All Phase 5 motion | ✓ | 12.38.0 (verified) | — |
| `react-router-dom@^7.14` | Layout AnimatePresence | ✓ | 7.14.2 (verified) | — |
| `tailwindcss@^4.2.4` + `@tailwindcss/vite@^4.2.4` | `@utility` directive | ✓ | 4.2.4 (verified) | — |
| `tsx` | scripts | ✓ | 4.21.0 (verified) | — |
| Browser DevTools «Emulate prefers-reduced-motion» | Manual SC#4 verification | ✓ | Chromium / Firefox / Safari all support | — |
| Browser DevTools sessionStorage inspector | Manual SC#5 verification | ✓ | All browsers | — |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.
**No new install commands required.** Phase 5 is purely additive code on the existing stack.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None at unit-test level (per STACK.md «SKIP Vitest for MVP»). Validation = grep + visual + manual. |
| Config file | None |
| Quick run command | `npm run lint && npx tsx scripts/check-brand.ts` |
| Full suite command | `npm run build` (runs prebuild + lint + vite build + postbuild check-brand) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| **ANI-02 / SC#1** | `motionVariants.ts` is the SOT; no inline `transition={{...}}` anywhere | grep | `! grep -rn 'transition={{' src/` (exit 1 = pass) | ✅ src/lib/motionVariants.ts (Wave 0 — first task creates) |
| **ANI-02 / SC#1** | `easeBrand`, `durations`, `fadeUp`, `pageFade`, `parallaxRange` named exports exist | grep | `grep -nE '^export const (easeBrand\|durations\|fadeUp\|fade\|stagger\|pageFade\|parallaxRange) ' src/lib/motionVariants.ts \| wc -l` ≥ 7 | ✅ Wave 0 |
| **ANI-02 / SC#1** | `--ease-brand` CSS var declared | grep | `grep -n -- '--ease-brand:' src/index.css` (1 match) | ✅ Wave 0 |
| **ANI-02 / SC#2** | `<RevealOnScroll>` exists with `whileInView` + `viewport={{ once: true, margin: '-50px' }}` | grep | `grep -nE 'whileInView=' src/components/ui/RevealOnScroll.tsx && grep -n 'margin:.*-50px' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 |
| **ANI-02 / SC#2** | All below-fold sections wrapped (no naked sections in pages) | grep | `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ \| wc -l` (target ≥ 18 — count of below-fold sections per D-08) | ✅ Wave 0 |
| **ANI-02 / SC#2** | Hero NOT wrapped | grep | `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` | ✅ Wave 0 |
| **ANI-02 / SC#2** | 80ms stagger cadence for card lists | grep | `grep -rnE 'staggerChildren.*0\.08\|staggerChildren=\\{true\\}' src/` (≥1 match) | ✅ Wave 0 |
| **ANI-02 / SC#2** | No 30+ IO observers — only per-MonthGroup wrap on /construction-log | grep | `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` (= 1, not 50) | ✅ Wave 0 |
| **ANI-04 / SC#3** | `<AnimatePresence mode="wait" initial={false}>` in Layout.tsx around `<Outlet/>` | grep | `grep -nE 'AnimatePresence.*mode="wait".*initial=\\{false\\}' src/components/layout/Layout.tsx` | ✅ Wave 0 |
| **ANI-04 / SC#3** | Keyed on `location.pathname` | grep | `grep -nE 'key=\\{location\\.pathname\\}' src/components/layout/Layout.tsx` | ✅ Wave 0 |
| **ANI-04 / SC#3** | onExitComplete sets scroll | grep | `grep -nE 'onExitComplete.*scrollTo' src/components/layout/Layout.tsx` | ✅ Wave 0 |
| **ANI-04 / SC#3** | pageFade durations 350ms exit / 400ms enter | grep | `grep -nE 'duration: 0\\.35\|duration: 0\\.4\|duration: durations\\.base' src/lib/motionVariants.ts` (≥2 matches) | ✅ Wave 0 |
| **ANI-04 / SC#3** | Visual: navigating between all 5 routes produces fade | manual | (Open `npm run dev`, navigate `/` → `/projects` → `/zhk/etno-dim` → `/construction-log` → `/contact` → `/`. Each transition fades out then fades in within ~750ms; no instant cuts; no jank.) | n/a — human |
| **ANI-04 / SC#4** | `useReducedMotion()` consumed in RevealOnScroll | grep | `grep -n 'useReducedMotion' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 |
| **ANI-04 / SC#4** | `useReducedMotion()` consumed in Layout for AnimatePresence | grep | `grep -n 'useReducedMotion' src/components/layout/Layout.tsx` | ✅ Wave 0 |
| **ANI-04 / SC#4** | `useReducedMotion()` consumed in Hero (precedent maintained) | grep | `grep -n 'useReducedMotion' src/components/sections/home/Hero.tsx` | ✅ already exists from Phase 3 |
| **ANI-04 / SC#4** | `@utility hover-card` carries `@media (prefers-reduced-motion: reduce)` block | grep | `grep -nE '@media \\(prefers-reduced-motion' src/index.css` (≥1 match) | ✅ Wave 0 |
| **ANI-04 / SC#4** | Visual: site fully navigable + reveals are instant under emulated RM | manual | (DevTools → Rendering → «Emulate prefers-reduced-motion: reduce» → reload → navigate all 5 routes; verify no animation runs, scroll-reset on nav still fires, hero is static.) | n/a — human |
| **SC#5** | `useSessionFlag` hook exists at `src/hooks/useSessionFlag.ts` with sessionStorage write | grep | `grep -nE "sessionStorage\\.(get\|set)Item.*'vugoda:hero-seen'\|key" src/hooks/useSessionFlag.ts` (≥2 matches) | ✅ Wave 0 |
| **SC#5** | Hero consumes the hook and routes it into skipParallax | grep | `grep -n "useSessionFlag\\('vugoda:hero-seen'\\)" src/components/sections/home/Hero.tsx` | ✅ Wave 0 |
| **SC#5** | Hero parallaxRange import (D-28) | grep | `grep -n "import.*parallaxRange" src/components/sections/home/Hero.tsx` | ✅ Wave 0 |
| **SC#5** | Visual: first visit cinematic, reload → static | manual | (Cold incognito tab → `/` → scroll, see parallax animate. Refresh tab → `/` → scroll, IsometricGridBG sits static at y:0.) | n/a — human |
| Bundle budget | Bundle stays ≤200KB gzipped | scripted | `npm run build 2>&1 \| grep "gzipped"` — assert <200KB | ✅ exists (vite build output) |
| Brand invariants | check-brand 4/4 still PASS post-Phase 5 | scripted | `npm run build` (runs postbuild check-brand) | ✅ exists (Phase 2) |

### Sampling Rate
- **Per task commit:** `npm run lint && npx tsx scripts/check-brand.ts` (≤5s)
- **Per wave merge:** `npm run build` (full prebuild + lint + vite + postbuild)
- **Phase gate:** All grep gates above PASS + manual SC#3/SC#4/SC#5 visual confirmations + bundle size confirmation

### Wave 0 Gaps
- [ ] `src/lib/motionVariants.ts` — covers ANI-02 SC#1 (SOT)
- [ ] `src/components/ui/RevealOnScroll.tsx` — covers ANI-02 SC#2 (wrapper)
- [ ] `src/hooks/useSessionFlag.ts` — covers SC#5 (session flag hook)
- [ ] `src/components/layout/Layout.tsx` (modify in place) — covers ANI-04 SC#3 (route transition)
- [ ] `src/components/sections/home/Hero.tsx` (modify in place) — covers SC#5 + D-28 (parallax SOT integration)
- [ ] `src/index.css` (modify in place) — covers SC#1 (--ease-brand) + D-24 (@utility hover-card)

*(No test framework install needed — STACK.md explicitly skips Vitest for MVP. The grep + manual + build script sweep is the project's established validation pattern, identical to Phases 2-4.)*

## Risks & Open Questions for Planner Discretion

### Risk 1: AnimatePresence + Layout flex container — `flex-1` propagation
The current Layout.tsx uses `<main className="flex flex-1 flex-col">` to let pages fill viewport. Wrapping `<Outlet/>` in `<motion.div>` introduces an extra DOM layer. The motion.div MUST also carry `className="flex flex-1 flex-col"` for the layout to remain visually identical. **The Pattern 1 example above does this correctly.** Planner verifies during impl that the home/projects/etc pages still fill the viewport (no shrunk layout).

### Risk 2: `key={location.pathname}` invalidating /zhk/:slug across slug changes
If user navigates `/zhk/etno-dim` then in some future v2 to `/zhk/maietok-vynnykivskyi`, the pathname changes → page re-mounts with fade. This is correct UX. Phase 5 has only `/zhk/etno-dim` as a `full-internal` slug, so this is not an MVP concern; documented for v2.

### Risk 3: Existing `motion-reduce:hover:scale-100` in Phase 4's 5 surfaces — leave or remove?
D-24 says `@utility hover-card`'s `@media (prefers-reduced-motion: reduce)` block neutralises hover. If consumers also keep the old `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants in their inline class strings, the result is harmless double-coverage. **Recommendation: REMOVE the `motion-reduce:` Tailwind variants from the 5 surfaces in the same atomic commit that swaps the hover-class string for `hover-card`** — single source of RM behaviour (the `@utility` `@media` block). Cleaner DOM, easier audit. Planner discretion per Claude's-Discretion list.

### Risk 4: `<RevealOnScroll as="section">` with semantic outline accessibility
Some Phase 5 sections (BrandEssence, PortfolioOverview) currently render as `<section>`. Wrapping in `<RevealOnScroll as="section">` produces `<section><motion.section>...</motion.section></section>` if the consumer keeps both — extra nested section is bad a11y (creates phantom landmark). **Recommendation: when wrapping an existing `<section>`, pass `as="section"` AND remove the inner `<section>` element**, OR keep the inner `<section>` and wrap in `<RevealOnScroll>` (default `<div>` as wrapper). Both work; pick the one that minimises DOM nesting per consumer. Planner enforces case-by-case.

### Risk 5: `key={location.pathname}` on `/zhk/:slug` redirect pages
Phase 4 D-19 has `/zhk/lakeview` → external redirect via `useEffect(() => window.location.assign(...))`. The redirect page renders for 1 frame. With AnimatePresence wrapping it, the 1-frame render plays a fade-in then is replaced by external nav — could look like a flicker. **Recommendation: leave as-is** — external redirects are edge cases; the user is leaving anyway. If Phase 6 QA flags visible flicker, planner can add `if (project.presentation === 'flagship-external') return null;` before the redirect's render.

### Open Q: `noInlineTransition()` 5th check addition cost vs benefit
Adding the 5th check costs ~10 lines in `check-brand.ts` and ~1 line in JSDoc. Benefit: SC#1 grep gate becomes a permanent CI invariant rather than a one-time check. **Recommendation: ADD it.** Pattern matches the existing 4-check structure.

## Sources

### Primary (HIGH confidence)
- **`node_modules/motion/package.json`** (verified 2026-04-26) — `motion@12.38.0` installed; `./react` export path confirmed; runtime smoke-test `node -e "const m = require('motion/react'); console.log(typeof m.AnimatePresence)"` returned `function` for AnimatePresence, useReducedMotion, and motion. HIGH confidence on import paths.
- **`node_modules/react-router-dom/package.json`** (verified 2026-04-26) — version `7.14.2`. HIGH confidence.
- **Live `npx tsx scripts/check-brand.ts` execution** (2026-04-26) — confirmed all 4 checks PASS with current Phase 4 code that already inlines `rgba(193, 243, 61, 0.15)` 5 times. Confirms D-24's rgba usage in `@utility hover-card` will pass without exemption. HIGH confidence on no exemption needed.
- **Tailwind v4 official docs «Adding custom styles»** (https://tailwindcss.com/docs/adding-custom-styles, fetched 2026-04-26) — verbatim shows `@utility scrollbar-hidden { &::-webkit-scrollbar { display: none; } }` with nested CSS, confirms tree-shaking applies to custom utilities, confirms `@media` and `&:hover` blocks supported. HIGH confidence on D-24 syntax.
- **Motion docs «AnimatePresence»** (https://motion.dev/docs/react-animate-presence, fetched 2026-04-26) — confirms `initial={false}` disables initial animations on first-mount children; confirms direct-child + unique-key requirements; confirms `onExitComplete` fires «when all exiting nodes have completed animating out». HIGH confidence on D-10/D-11/D-12/D-13.
- **Motion docs «useReducedMotion»** (https://motion.dev/docs/react-use-reduced-motion, fetched 2026-04-26) — confirms import path `motion/react`, confirms hook responds to runtime changes. HIGH confidence on D-25/D-26.
- **React Router v7 «ScrollRestoration»** (https://reactrouter.com/api/components/ScrollRestoration, fetched 2026-04-26) — explicit «available in Framework + Data, NOT Declarative». HashRouter is Declarative, so D-14's manual `onExitComplete` pattern is the correct alternative. HIGH confidence.
- **Phase 4 source files** — `PortfolioOverview.tsx:59`, `FlagshipCard.tsx:32`, `PipelineCard.tsx:39`, `ZhkGallery.tsx:53`, `MonthGroup.tsx:59` all verified to contain identical 200-char hover string with rgba(193,243,61,0.15). HIGH confidence on consolidation surface count.
- **`scripts/check-brand.ts`** lines 84-114 — paletteWhitelist regex `#[0-9A-Fa-f]{3,6}` confirmed via reading; rgba decimal triplet invisible to the check. HIGH confidence.

### Secondary (MEDIUM confidence)
- **Max Schmitt «Next.js page transitions with Framer Motion»** (https://maxschmitt.me/posts/nextjs-page-transitions-framer-motion, fetched 2026-04-26) — describes exact `onExitComplete` + `scrollTo(0,0)` pattern producing «blank screen in-between exit and enter transitions». Pattern is framework-agnostic; applies identically to React Router. MEDIUM-HIGH confidence (Next.js context, but mechanism is Motion + browser APIs only).
- **Motion issue #764 «Timing of onExitComplete»** (https://github.com/motiondivision/motion/issues/764) — historical 2020 bug report about `onExitComplete` timing; resolved long ago. Not a current concern at Motion 12.38.0; included for context only.

### Tertiary (LOW confidence)
- None used. All claims backed by primary or secondary sources or live verification.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified at runtime via `node_modules` + `node -e` import test
- Architecture (D-01..D-28 implementability): HIGH — Tailwind `@utility` syntax verified against docs, AnimatePresence + Outlet pattern matches Motion docs verbatim, `paletteWhitelist` rgba acceptance verified by live check-brand run
- Pitfalls: HIGH for ones backed by verified docs (1, 2, 5, 6); MEDIUM for runtime-toggle scenario (4 — extreme edge case, low real risk)
- Bundle budget: HIGH — Phase 5 adds ~3-5 KB gzipped (RevealOnScroll ~30 lines, useSessionFlag ~15 lines, motionVariants ~40 lines, AnimatePresence already in Motion's core, no new packages); current 131.60 KB gzipped + 5 KB = 136.60 KB / 200 KB cap = 68% utilisation, 32% headroom for Phase 6
- Validation Architecture: HIGH — every SC has either a grep gate (executor-runnable) or a manual visual gate (verifier-runnable); pattern matches Phases 2-4

**Research date:** 2026-04-26
**Valid until:** 2026-05-26 (30 days for stable stack); re-verify if Motion bumps minor or Tailwind v4.3+ ships
