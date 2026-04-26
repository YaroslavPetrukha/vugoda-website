# Phase 5: Animations & Polish — Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Unified Motion system layered on top of the now-stable content of phases 1–4 — single SOT for variants/easings/durations (`src/lib/motionVariants.ts`), `<RevealOnScroll>` wrapper applied to every below-fold section across all 5 production routes, `<AnimatePresence mode="wait">` for inter-route page transitions wrapping `<Outlet/>` in `Layout.tsx`, full `useReducedMotion()` respect threaded through both new motion surfaces, sessionStorage-backed hero skip on revisit, and DRY consolidation of the duplicated Phase 4 hover-class string into a single Tailwind v4 `@utility`. No new content, no new pages, no new data shapes, no new brand primitives. Phase 5 only touches motion + the easing/hover absorption layer.

Explicit phase-scope clarifications (authorised during discussion):

- **`<RevealOnScroll>` is the sole reveal surface** — `src/components/ui/RevealOnScroll.tsx`. Every below-fold section across all 5 routes gets wrapped (not animated as standalone Motion calls inside section files). Hero is excluded (LCP target — paints visible immediately).
- **`<AnimatePresence>` lives in `Layout.tsx`** wrapping `<Outlet/>` directly — not in App.tsx, not as a separate `<RouteShell>` component. Phase 1 D-pre-commented this exact slot («Phase 5 will wrap Outlet inside Layout.tsx with the motion route-transition wrapper»).
- **`ScrollToTop.tsx` is REPLACED, not augmented** — current Phase 1 implementation fires `window.scrollTo(0,0)` instantly on `pathname` change. Phase 5 routes the scroll-reset through `<AnimatePresence onExitComplete>` so it lands AFTER the exit animation of the old route, BEFORE the enter animation of the new route — clean UX, no jarring "scroll-to-top during fade-out" frame.
- **Phase 4 hover-class consolidation IS in scope** — Phase 4 D-33 left the door open ("for Phase 4, pasted-class is fine; Phase 5 may consolidate"). Phase 5 lifts the duplicated hover-string (5 surfaces: PortfolioOverview pipeline cards · FlagshipCard · PipelineCard on `/projects` · ZhkGallery thumbs · MonthGroup construction-log thumbs) into a single Tailwind v4 `@utility hover-card` block in `src/index.css` and replaces all 5 call sites with the new utility name.
- **Hero parallax migrates from inline outputRange to a SOT-backed pattern** — Phase 3 D-04 Hero ships `useTransform(scrollYProgress, [0, 1], [0, -100])` inline. Phase 5 keeps the `useScroll` + `useTransform` hook calls in Hero.tsx (cannot move them out — React rule-of-hooks), but the `[0, -100]` translation range and easing constants come from `parallaxRange` named export in `src/lib/motionVariants.ts`. The actual scroll-driven motion stays component-local; what moves to SOT is the magnitude config.
- **No new motion-using brand primitives** — Phase 5 does not add new components under `src/components/brand/`. Only `src/components/ui/RevealOnScroll.tsx` is added.

</domain>

<decisions>
## Implementation Decisions

### A1 — Reveal scope & stagger (ANI-02)

- **D-01:** **`src/components/ui/RevealOnScroll.tsx`** is the sole API for entry-on-scroll animation. Props: `as?: ElementType` (default `'div'`), `variant?: Variants` (default `fadeUp` from `motionVariants.ts`), `staggerChildren?: boolean | number` (false default; true → use canonical 80ms; number → custom ms), `delayChildren?: number` (default 0), `viewport?: ViewportOptions` (default `{ once: true, margin: '-50px' }` per SC#2), `className?: string`, `children: ReactNode`. Renders `<motion.{as}>` with `initial="hidden"` `whileInView="visible"`. When `staggerChildren=true`, parent's `transition` carries `staggerChildren: 0.08, delayChildren: 0`; children must be wrapped in `<motion.div variants={fadeUp}>` (or use the helper `<RevealItem>` if planner adds one).
- **D-02:** **Universal stagger cadence = 80ms** (SC#2 verbatim). Applied to: BrandEssence (4 cards 2×2), PortfolioOverview pipeline grid (3 cards), MethodologyTeaser (3 blocks), `/projects` PipelineGrid (1–3 cards depending on filter), `/zhk/etno-dim` gallery (8 thumbs in 4×2 grid). `delayChildren` stays 0 (no header-pause choreography); section-h2 + cards reveal as one wave.
- **D-03:** **TrustBlock 3-column legal table is treated as cards** for stagger purposes — the 3 columns (Юр. особа · Ліцензія · Контакт) get `staggerChildren=true` (80ms × 3 = 240ms cascade). Reads as «факти проявляються по черзі», matches the тон. Single section-level `<RevealOnScroll>` wraps the section heading; the inner 3-col grid is the staggered child list.
- **D-04:** **`/construction-log` 50 photos: per-MonthGroup reveal only.** Each `<MonthGroup>` is wrapped in a single `<RevealOnScroll>` — month header + uniform photo grid fade up together as one block. NO per-photo stagger (50 IntersectionObserver callbacks would exceed SC#2's «no 30+ independent observers» rule and risk jank on a long-scroll page). 4 reveals total on /construction-log (one per month). Photos animate with `opacity` only via the parent variant — no per-photo translate.
- **D-05:** **`/zhk/etno-dim` 8-render gallery: section-level `<RevealOnScroll>` + per-thumb stagger 80ms.** Total cascade 8 × 80ms = 640ms (within SC#2 budget for "card lists"). Thumb itself uses `<motion.li variants={fadeUp}>` inside the gallery `<ul>`. Hover triple-effect (Phase 4 D-31) and lightbox open-anim (Phase 4 D-25) coexist with reveal — they are sequential lifecycle phases, not overlapping.
- **D-06:** **Hero is excluded from `<RevealOnScroll>` entirely.** Hero is the LCP target on `/`; wrapping `<h1>` ВИГОДА or the gasло in a fade-in delays painting them above-the-fold. Hero's only motion in Phase 5 is the parallax-on-scroll (already shipped in Phase 3, refactored to read from `parallaxRange` per D-22 below). NotFoundPage and DevBrandPage / DevGridPage are also excluded (NotFoundPage is one screen of static text; the `/dev/*` surfaces are QA tooling — adding reveal would make QA inspection slower).
- **D-07:** **Reveal viewport = `{ once: true, margin: '-50px' }`** per SC#2 verbatim. `once: true` so revisiting via scroll-up doesn't replay (no re-trigger flicker). `margin: '-50px'` triggers reveal slightly before the section enters the viewport — feels natural rather than mechanically-on-edge.
- **D-08:** **Section coverage map** (Phase 5 must wrap each item exactly once):
  - `HomePage`: BrandEssence · PortfolioOverview (flagship + grid + aggregate as one section reveal with stagger on the 3 grid cards) · ConstructionTeaser · MethodologyTeaser · TrustBlock · ContactForm. Hero is NOT wrapped.
  - `ProjectsPage`: Page header (h1+subtitle) reveals as one block · FlagshipCard reveals (single-element, no stagger) · StageFilter chips row reveals (stagger 80ms across 4 chips) · PipelineGrid + AggregateRow reveal (grid uses 80ms stagger across 1–3 cards depending on filter; aggregate row is appended below grid in same wrapper).
  - `ZhkPage`: hero render (single-element reveal — not parallax; `/zhk/etno-dim` hero is `loading="eager"` LCP for that page so the reveal must use opacity only, no Y-translate that would delay paint) · fact block · whatsHappening paragraph · gallery (section + 80ms stagger) · CTA pair.
  - `ConstructionLogPage`: page header · 4 × MonthGroup (one reveal each per D-04).
  - `ContactPage`: page header · реквізити-block · mailto CTA.
- **D-09:** **The `/zhk/etno-dim` hero render reveal is opacity-only** (override of default `fadeUp` variant) — Y-translation on an LCP image risks layout-shift class regressions. Pass `variant={fade}` (a sibling variant in `motionVariants.ts` with no `y` axis) explicitly to that one wrapper.

### A2 — Route transitions + ScrollToTop (ANI-04)

- **D-10:** **`<AnimatePresence mode="wait" initial={false}>` lives in `Layout.tsx`** wrapping `<Outlet/>` directly (`<main>` chrome stays static around it, Nav and Footer also static). `initial={false}` suppresses the entry fade on first paint (otherwise the home page would appear to fade in over a blank dark background — looks broken at session start). Phase 1 D-pre comment explicitly reserved this slot.
- **D-11:** **Page-fade variant = pure opacity 0↔1**, no Y-translate, no scale. Variant name `pageFade` in `src/lib/motionVariants.ts`. Durations: enter 0.4s (400ms) per SC#3, exit 0.35s (350ms) per SC#3. Easing: `easeBrand` constant from SOT. No spring, no bounce. Reduced-motion path: enter and exit durations both collapse to 0 (instant swap).
- **D-12:** **AnimatePresence key strategy = `location.pathname`** (full path, not first segment, not pathname+search). Each route mount is a unique fade pair. `?stage=...` query changes on `/projects` do NOT re-key — chip clicks update internal filter state without unmounting the page (already Phase 4's pattern via `useSearchParams`). Lightbox open/close inside `/zhk/etno-dim` and `/construction-log` does NOT change pathname → no fade trigger (correct UX).
- **D-13:** **Wrapper component for the keyed route content** = inline `<motion.div key={location.pathname} variants={pageFade} initial="hidden" animate="visible" exit="hidden">` sitting inside `<AnimatePresence>` and containing `<Outlet/>`. No new file needed; the entire Phase 5 route-transition surface is ~10 lines of edits inside `Layout.tsx`.
- **D-14:** **`ScrollToTop.tsx` is REPLACED.** Current implementation (`useEffect` on `pathname` → instant `scrollTo(0,0)`) is unsafe with `mode="wait"`: scroll fires immediately, then exit-anim plays at top while the user was scrolled-down. New implementation uses `<AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>` — scroll lands precisely between exit-finished and enter-starting, so the user sees:
  1. Their current scroll position fade out (old route);
  2. Scroll resets to top (instant, invisible during the gap);
  3. New route fades in at the top.

  `ScrollToTop.tsx` keeps existing under `src/components/layout/` for export-discoverability but its body becomes a no-op or it gets deleted — planner picks. If kept, the file's docstring updates to «Phase 5 moved scroll-restore into AnimatePresence onExitComplete; this component is intentionally a no-op/legacy». If deleted, `<ScrollToTop />` import is removed from `Layout.tsx` in the same atomic commit as the AnimatePresence wrap.
- **D-15:** **Browser back-button + scroll restoration** — react-router's HashRouter does not natively restore per-route scroll positions. Phase 5 ships forward-only «scroll to top on every route change» behavior (consistent with Phase 1 baseline). True back-button-restores-prior-scroll is v2 if user feedback requests it; out of scope for Phase 5 per scope guardrail.
- **D-16:** **Lightbox open/close coexistence** — Phase 4 D-25 lightbox uses native `<dialog>` + 200ms fade-in on open. Phase 5 does NOT touch lightbox. Lightbox lives at the dialog layer above the page (z-index higher than `<motion.div>` route wrapper) and its open animation plays independently of any in-progress route transition. No coordination needed.

### A3 — Session-skip hero (SC#5)

- **D-17:** **Behavior on 2nd+ visit in session = SKIP PARALLAX ENTIRELY.** Hero on revisit renders fully static: no `useScroll`, no `useTransform`, the `<IsometricGridBG>` overlay sits at `y: 0` and never moves on scroll. Wordmark + gasло + CTA appear in their final positions immediately on mount. Demo-pitch reload during client conversation = clean instant render, no re-watching the cinematic intro.
- **D-18:** **sessionStorage key = `'vugoda:hero-seen'`** (namespaced with brand prefix). Lookup in Hero.tsx via a client-only `useEffect` reading `sessionStorage.getItem('vugoda:hero-seen')` on mount. SSR-safe-by-default: the parallax setup `useTransform(...)` runs unconditionally with the full output range; the static-mode flip happens client-side after first render. There is no SSR in this project, but the pattern is correct anyway.
- **D-19:** **Flag is set on hero mount, in the same `useEffect` that reads it.** Read first → if not present, render cinematic AND `setItem('vugoda:hero-seen', '1')`. If present → render static. The «seen» state is set immediately (mount = saw); it does not require user-scroll-past to qualify. Reasoning: Phase 5 is desktop-first; on a 1920×1080 viewport, the hero is fully visible at scroll 0 — the user has «seen» it the moment the page paints. Tying to scroll-past adds complexity without UX win.
- **D-20:** **Reduced-motion override is hard.** `useReducedMotion() === true` ⇒ hero renders static, regardless of session flag state. The session-skip and reduced-motion paths converge to identical output, but they are separate code paths in the component for readability:
  ```ts
  const prefersReducedMotion = useReducedMotion();
  const sessionFlag = useSessionFlag('vugoda:hero-seen');
  const skipParallax = prefersReducedMotion || sessionFlag;
  ```
  When `skipParallax === true`, the hook still runs (rule-of-hooks) but `cubeY` is set to a static `MotionValue(0)` rather than a `useTransform` derivative. SC#4 verbatim: «when prefers-reduced-motion: reduce is active, hero parallax is static».
- **D-21:** **`useSessionFlag` is a tiny custom hook** — `src/hooks/useSessionFlag.ts` (new file; first member of `src/hooks/`). Returns the current flag boolean and writes the flag on first mount. ~15 lines. NOT an external dep, NOT a context, NOT a global. Reusable for future first-visit-only animations (e.g., v2 onboarding tooltips on `/projects` filter); pattern stays consistent.

### A4 — `motionVariants.ts` shape + hover DRY consolidation + RM threading (SC#1, partial SC#2/3/4)

- **D-22:** **`src/lib/motionVariants.ts` uses NAMED EXPORTS** (no namespace object, no split files). The full export list:
  - `easeBrand` — `[0.22, 1, 0.36, 1] as const` (cubic-bezier, locked from Phase 4 D-32)
  - `durations` — `{ fast: 0.2, base: 0.4, slow: 1.2 } as const` (200ms / 400ms / 1200ms per SC#1)
  - `fadeUp` — `Variants` for default reveal: `hidden: { opacity: 0, y: 24 }` → `visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easeBrand } }`
  - `fade` — `Variants` opacity-only sibling for LCP-sensitive surfaces (D-09): `hidden: { opacity: 0 }` → `visible: { opacity: 1, transition: { duration: durations.base, ease: easeBrand } }`
  - `stagger` — `Variants` parent variant carrying `transition: { staggerChildren: 0.08, delayChildren: 0 }`. Child variants pass through as `fadeUp` or `fade`.
  - `pageFade` — `Variants` for `<AnimatePresence>`: `hidden: { opacity: 0 }` → `visible: { opacity: 1, transition: { duration: durations.base, ease: easeBrand } }` with explicit `exit: { opacity: 0, transition: { duration: 0.35, ease: easeBrand } }` (350ms exit per SC#3).
  - `parallaxRange` — `[0, -100] as const` (the magnitude pair Hero.tsx feeds to `useTransform`). Type: `readonly [number, number]`. Phase 3 D-04 had this inline; Phase 5 lifts it to SOT.
- **D-23:** **`--ease-brand` CSS variable** is added to `src/index.css` `@theme` block: `--ease-brand: cubic-bezier(0.22, 1, 0.36, 1);`. Tailwind v4 generates the `ease-brand` utility automatically. This is the second physical representation of the same curve (the first is the `easeBrand` JS array in `motionVariants.ts`); they MUST stay in lockstep — drift would mean Tailwind hover and Motion variants animate on different curves. A doc-block in `motionVariants.ts` notes the coupling.
- **D-24:** **Hover triple-effect consolidation = Tailwind v4 `@utility hover-card`** in `src/index.css`. Defined once with all hover/transition/motion-reduce properties:
  ```css
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
  All 5 surfaces (PortfolioOverview pipeline grid items, FlagshipCard `<article>`, PipelineCard `<article>`, ZhkGallery `<button>` thumbs, MonthGroup `<button>` thumbs) replace their long Tailwind class string with `hover-card`. The Phase 4 hover RGBA value `rgba(193, 243, 61, 0.15)` is the canonical representation — it is whitelisted by `check-brand.ts paletteWhitelist()` (matches the `#C1F33D` hex regex with alpha extension). Verify during impl that `paletteWhitelist()` does not reject this CSS literal — if it does, planner adds an exemption rule for `@utility` blocks.
- **D-25:** **Reduced-motion threading = per-component `useReducedMotion()` hook calls**, not a context provider, not a global. Three consumers in Phase 5:
  - **`<RevealOnScroll>`** — `useReducedMotion()` at top; if true, render `children` directly without the `<motion.{as}>` wrapper (no variants, no `whileInView`, no IO observer). Children paint at opacity:1, position:0 immediately.
  - **`Layout.tsx` `<AnimatePresence>` block** — `useReducedMotion()` at top; if true, swap `pageFade` variant for a no-op variant (`{ hidden: { opacity: 1 }, visible: { opacity: 1 } }` with `transition: { duration: 0 }`). Routes still mount/unmount but without animation. ScrollToTop's `onExitComplete` still fires (motion 0-duration still triggers the lifecycle event).
  - **`Hero.tsx`** — already has the hook (Phase 3 D-04). Phase 5 adjusts the static-mode logic to also account for the session flag (D-20). Hook stays at the same call site.
- **D-26:** **No new global context, no new provider, no new lib utility.** The Motion library's `useReducedMotion()` already wraps a `matchMedia('(prefers-reduced-motion: reduce)')` listener with React-friendly subscription — no value to wrapping it again. SC#4's «site remains fully navigable and readable» is satisfied by per-component hook respect; CSS `@media (prefers-reduced-motion: reduce)` block in the `@utility hover-card` (D-24) covers the hover path; combined coverage is total.
- **D-27:** **`scripts/check-brand.ts` does not need new rules for Phase 5.** SC#1 says `grep -r "transition={{" src/` returns zero — the script's existing `paletteWhitelist()` and `importBoundaries()` are unaffected. Planner MAY add an optional 5th check `noInlineTransition()` greppingjust this pattern in `src/components/`, but the existing `src/` audit + the absence of inline transition objects in shipped code (verified: `grep -rn "transition=\{\{" src/` returns 0 today) makes the explicit gate optional rather than mandatory. Planner's call.

### Hero parallax migration to SOT (cross-cutting D-22 + Phase 3 D-04)

- **D-28:** **`src/components/sections/home/Hero.tsx` change is minimal.** Two edits:
  1. Import `parallaxRange` from `src/lib/motionVariants.ts` and use it as the `useTransform` outputRange: `useTransform(scrollYProgress, [0, 1], skipParallax ? [0, 0] : parallaxRange)`.
  2. Add the `useSessionFlag('vugoda:hero-seen')` hook + the combined `skipParallax` boolean per D-20.

  Hero docstring updates to reference `motionVariants.parallaxRange` and `vugoda:hero-seen` session-skip behavior.

### Folded Todos

_None — `gsd-tools todo match-phase 5` returned 0 matches at discussion time. Cross-reference recommended at planning if backlog has been updated since._

### Claude's Discretion (planner picks within brand)

- Exact `delayChildren` value when `staggerChildren=true` is requested with `delayChildren` argument (default 0; planner may set 80ms for the StageFilter chip row to give the row label a beat).
- Whether `<RevealOnScroll>` exposes a `<RevealItem>` helper (a thin `<motion.div variants={fadeUp}>` for child-list ergonomics) or expects callers to inline `<motion.div variants={fadeUp}>` themselves.
- Whether `ScrollToTop.tsx` is deleted or kept as a no-op-with-deprecation-comment (D-14 leaves both as acceptable).
- Exact `noInlineTransition()` 5th check addition to `scripts/check-brand.ts` (D-27 leaves optional).
- Whether the Hero `parallaxRange` literal sits in `motionVariants.ts` or in a sibling file (`motionConfig.ts`). Recommended: same file for proximity to `easeBrand` and `durations`.
- Whether the `pageFade` exit duration is hardcoded (350ms per SC#3) or pulled from a new `durations.exit = 0.35` field. Recommended: hardcoded inline in the variant block (single-use config, not a primitive).
- Whether to replace `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants in inline class strings (Phase 4's 5 surfaces) with the `@utility hover-card`'s built-in `@media (prefers-reduced-motion)` block (D-24) — recommended yes, that's the consolidation point.
- Variant for the lightbox open-anim (Phase 4 D-25 says "200ms ease-out fade-in") — Phase 5 may absorb that easing constant into `easeBrand` reuse, OR leave it as the default Motion `easeOut` (not exposed as a SOT export). Planner picks; lightbox is not in the Phase 5 scope-of-changes per D-16, so the leave-as-is path is the cleanest.
- The exact form of `useSessionFlag` (D-21): one-shot read+write, or a stateful hook returning [flag, setFlag]. One-shot is sufficient for the hero use case; planner picks based on whether v2 first-visit hooks are anticipated.
- Whether `RevealOnScroll` wraps `<motion.section>` or `<motion.div>` — generally `<motion.section>` for semantic alignment with the wrapped section, but the `as` prop default of `'div'` is conservative. Planner picks per consumer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)

- `.planning/REQUIREMENTS.md` §Animations — ANI-02 (`<RevealOnScroll>` Motion `whileInView` + `fadeUp` variant, ~400ms, stagger for cards; SOT in `lib/motionVariants.ts`; no inline `transition={{...}}`), ANI-04 (`AnimatePresence mode="wait"` keyed on pathname; `pageFade` variant; respects `useReducedMotion`)
- `.planning/REQUIREMENTS.md` §QA — QA-04 (CI denylist still in force; Phase 5 may extend with optional inline-transition gate per D-27)
- `.planning/ROADMAP.md` §"Phase 5: Animations & Polish" — Success Criteria 1–5 (authoritative test surface; SC#1 SOT shape, SC#2 reveal coverage + 80ms stagger, SC#3 route-transition timing 350/400ms, SC#4 reduced-motion full respect, SC#5 sessionStorage hero-skip)

### Project-level policy

- `.planning/PROJECT.md` §Core Value — desktop-first 1920×1080 «cinematic-анімаціями на Motion» (drives the cinematic-stripping that session-skip targets — repeat clients shouldn't re-watch the intro)
- `.planning/PROJECT.md` §Constraints — bundle ≤200KB gzipped JS (Phase 5 net add ≈ +5–10 KB: `<RevealOnScroll>` wrapper + `useSessionFlag` hook + motionVariants exports — well within budget; current bundle is 131.60 kB / 65% of 200 KB cap)
- `.planning/PROJECT.md` §Out of Scope — no springs, no `transition-all`, no swiper/embla, no react-helmet, no `framer-motion` (the legacy package name); Phase 5 is `motion@^12.38.0` only

### Prior-phase decisions (Phase 5 inherits and extends)

- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-21 — `:focus-visible` 2px accent outline (Phase 5 must NOT regress focus styling — RevealOnScroll wrapper preserves children's focus-visible behavior; AnimatePresence motion.div is non-interactive)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Pitfall 3 reference — easing/duration inconsistency drove Phase 5's SOT existence; Phase 1 explicitly avoided seeding `transition={{...}}` so Phase 5 does not have a purge surface
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-26 — `paletteWhitelist()` regex matches hex with optional alpha; Phase 5 D-24 `rgba(193, 243, 61, 0.15)` literal in `@utility hover-card` should pass — verify during impl
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-04 — Hero parallax `useScroll` + `useTransform([0,1], [0,-100])` (Phase 5 D-28 absorbs the magnitude pair into `parallaxRange` SOT export, keeping hook calls in component)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-domain — «No inline `transition={{}}` — Phase 5 owns easing config» (Phase 5 SC#1 grep verifies this stays clean)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §Deferred — «Scroll-reveal on home sections (ANI-02): Phase 5 scope»; «Route transitions (ANI-04): Phase 5 scope»; «Reduced-motion respect: Phase 5 owns full sweep»; «Session-skip hero (re-visit fast-fade): Phase 5 scope». All four are now Phase 5 in-scope.
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §D-30..D-35 — Hover triple-effect on 5 surfaces with inline `cubic-bezier(0.22, 1, 0.36, 1)` and `motion-reduce:` Tailwind prefix; Phase 5 D-24 lifts to `@utility hover-card`
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §D-32 — easing constant `cubic-bezier(0.22, 1, 0.36, 1)` is canonical (Phase 5 D-22 `easeBrand` and D-23 `--ease-brand` are the two-representation locked form)
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §Integration Points — «Phase 5 absorbs the inline `cubic-bezier(0.22, 1, 0.36, 1)` constant into shared `motionVariants.ts`. Phase 4 hover classes get a one-line CSS variable swap; no consumer churn.» — Phase 5 plan delivers exactly this.
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §Integration Points — «Phase 5 keys `<AnimatePresence>` around `<Outlet>` for route transitions. Phase 4 does NOT touch `App.tsx`.» — Phase 5 D-10 confirms Layout.tsx (not App.tsx) as the wrap site.

### Research artifacts

- `.planning/research/ARCHITECTURE.md` §3 Q5 — Motion patterns (3-layer composition: variants lib + `<RevealOnScroll>` wrapper + per-component `useScroll`/`useInView`); this is the spine of Phase 5's architecture
- `.planning/research/ARCHITECTURE.md` §3 Q7 — page-transition pattern with `<AnimatePresence>` + `<Outlet>` + Router v7 `useLocation` (verbatim recipe for Phase 5 D-10..D-13)
- `.planning/research/PITFALLS.md` §Pitfall 3 — easing/duration inconsistency (Phase 5 SOT exists to prevent this; SC#1 grep guards against re-seeding)
- `.planning/research/PITFALLS.md` §Pitfall 13 — cinematic intro on revisit friction (drives D-17 session-skip; SC#5 verbatim)
- `.planning/research/PITFALLS.md` §Pitfall 14 — mobile/tablet broken in practice (out-of-scope here; Phase 6 owns mobile fallback; Phase 5 motion still degrades cleanly via `useReducedMotion()` even at non-target widths)
- `.planning/research/PITFALLS.md` §Pitfall 16 — `will-change: transform` layer explosion (Phase 5 must avoid `will-change: transform` on every reveal; `<RevealOnScroll>` does NOT set `will-change`. Hero's existing `<motion.div style={{ y: cubeY }}>` may benefit from `will-change: transform` ONLY on the IsometricGridBG container — planner verifies during impl, but default is "don't add it")
- `.planning/research/STACK.md` §"Recommended Stack" — `motion@^12.38.0` (already installed); `react-router-dom@^7.14` (already installed; `useLocation` + `useNavigationType` available)
- `.planning/research/STACK.md` §Phase 5 NEEDS SPIKE flag — «Motion 12.x AnimatePresence + React Router v7 Outlet compatibility; useReducedMotion hook export path». Phase 5 research phase (gsd-phase-researcher) should verify the import path `useReducedMotion` from `motion/react` and the `<AnimatePresence>` + `<Outlet>` + `key={pathname}` interplay. Hero.tsx already imports `useReducedMotion` from `motion/react` successfully, so the path is verified for the hook; AnimatePresence + Outlet specifically needs spike confirmation.

### Brand authority (visual + content DNA)

- `brand-system.md` §6 — DO/DON'T (Phase 5 respects: NO bouncy springs, NO scaling beyond 1.02, NO neon glows beyond accent at 15%, NO multi-step keyframe choreography on text, accent ONLY on motion-state markers)
- `brand-system.md` §7 — layout scale (Phase 5 reveal Y-offset = 24px; aligned with `--spacing-rhythm-md` token but NOT pulled from it — Y-offset is a motion magnitude, not spacing)
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 — tone of voice (стримано, без хвастощів) — drives D-11 pure-fade decision over slide/scale
- `КОНЦЕПЦІЯ-САЙТУ.md` §10 — hard rules (no team photos, silent-displacement Lakeview-only — Phase 5 motion never names projects in a way that could leak Pictorial/Rubikon, but: motion has no copy surface so this is automatic)

### Components Phase 5 modifies (built in Phases 1–4)

- `src/components/layout/Layout.tsx` — Phase 5 wraps `<Outlet/>` with `<AnimatePresence mode="wait" initial={false} onExitComplete={...}>` + keyed `<motion.div>` (D-10..D-14)
- `src/components/layout/ScrollToTop.tsx` — Phase 5 replaces or no-ops (D-14)
- `src/components/sections/home/Hero.tsx` — Phase 5 swaps inline `[0, -100]` for `parallaxRange` import + adds `useSessionFlag` (D-28)
- `src/components/sections/home/{BrandEssence,PortfolioOverview,ConstructionTeaser,MethodologyTeaser,TrustBlock,ContactForm}.tsx` — wrap in `<RevealOnScroll>` (D-08)
- `src/components/sections/projects/{StageFilter,FlagshipCard,PipelineGrid,AggregateRow,PipelineCard,EmptyStateZdano,BuduetsyaPointer}.tsx` — `/projects` page coverage (D-08)
- `src/components/sections/zhk/{ZhkHero,ZhkFactBlock,ZhkWhatsHappening,ZhkGallery,ZhkCtaPair}.tsx` — `/zhk/etno-dim` coverage (D-08); `ZhkHero` uses `fade` variant per D-09
- `src/components/sections/construction-log/MonthGroup.tsx` — wrap once per month (D-04)
- `src/components/sections/contact/ContactDetails.tsx` — `/contact` coverage (D-08)
- `src/pages/{HomePage,ProjectsPage,ZhkPage,ConstructionLogPage,ContactPage}.tsx` — page-level reveals (page header + section composition per D-08); planner picks where reveals are placed (per-section vs page-composer level)
- `src/components/sections/home/PortfolioOverview.tsx` (line 59) · `src/components/sections/projects/{FlagshipCard,PipelineCard}.tsx` · `src/components/sections/zhk/ZhkGallery.tsx` · `src/components/sections/construction-log/MonthGroup.tsx` — replace duplicated hover-class string with `hover-card` utility (D-24)
- `src/index.css` — add `--ease-brand` to `@theme` block (D-23) + `@utility hover-card` block (D-24)

### Components Phase 5 adds

- `src/components/ui/RevealOnScroll.tsx` (D-01)
- `src/lib/motionVariants.ts` (D-22)
- `src/hooks/useSessionFlag.ts` (D-21)

### Data Phase 5 consumes

- None new — Phase 5 is purely the motion layer + hover-class consolidation. No data, content, or asset changes.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 1–4)

- **Layout shell** (`src/components/layout/Layout.tsx`) — Phase 1 reserved the `<Outlet/>` slot specifically for Phase 5's AnimatePresence wrap. The component's docstring explicitly says «Phase 5 will wrap `<Outlet/>` with the motion route-transition wrapper» — wrap-not-rearchitect.
- **Hero component** (`src/components/sections/home/Hero.tsx`) — already imports `useReducedMotion` and `useScroll`/`useTransform` from `motion/react`. Phase 5 adds 2 lines: `parallaxRange` import + `useSessionFlag` import; modifies the `useTransform` outputRange ternary. Net edit: ~5 lines.
- **ScrollToTop helper** (`src/components/layout/ScrollToTop.tsx`) — current `useEffect`+`pathname` pattern is being replaced by `<AnimatePresence onExitComplete>`. File becomes a no-op or is deleted (D-14 Claude's Discretion).
- **Brand tokens** (`src/index.css` `@theme`) — current 6 color tokens + 5 spacing rhythm tokens. Phase 5 adds 1 motion token (`--ease-brand`) — matches the 7th-`--token` boundary; no conflict with `paletteWhitelist()` because the regex targets `#[0-9A-Fa-f]+` literals, not CSS-var declarations.
- **Hover triple-effect class** (verified inline in 5 places — see grep output in scout): `transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`. The `cubic-bezier(0.22,1,0.36,1)` argument is identical across all 5 sites — D-24's `@utility hover-card` is byte-equivalent at the rendered-CSS layer.
- **Motion library version** (`package.json` → `motion@^12.38.0`) — Motion 12.x exports `motion`, `useScroll`, `useTransform`, `useReducedMotion`, `AnimatePresence` from `'motion/react'`. Hero.tsx confirms the import path.
- **react-router-dom version** (`package.json` → `^7.14.0`) — exports `useLocation`, `useNavigationType` (forward/back/replace) from `'react-router-dom'`. Phase 5 uses `useLocation()` for the AnimatePresence key.
- **No existing `src/hooks/` directory** — Phase 5's `useSessionFlag.ts` is the first member; planner creates the folder.
- **No existing `src/lib/motionVariants.ts`** — Phase 5 creates it as a new file alongside `src/lib/{assetUrl.ts, stages.ts}`.

### Anti-list — DO NOT introduce in Phase 5

- `framer-motion` (legacy name) — already on `motion@^12.38.0`; never install legacy
- `transition-all` Tailwind utility — Phase 4 D-32 banned, Phase 5 reaffirms
- `transition={{...}}` inline objects on `motion.*` components — SC#1 grep gate
- Spring transitions (`type: 'spring', bounce: ...`) — brand-system §6 explicit DON'T
- New global state library, new context provider, new useReducedMotion wrapper — D-26 explicit
- `react-helmet`, `react-helmet-async` — STACK.md What NOT to Use
- `framer-motion-router-transition` and similar third-party route-transition libs — Motion + AnimatePresence + Router v7 covers it natively
- Per-photo IntersectionObservers on the construction-log 50 photos — D-04 explicit
- `will-change: transform` blanket on all motion elements — Pitfall 16; only on `<IsometricGridBG>` parallax container, planner verifies
- Splash-screen / loading skeleton on first paint — out of scope for Phase 5 (cinematic == hero parallax, not a loading screen)

### Established Patterns

- **Tailwind v4 `@utility` directive** — first use in Phase 5. Pattern: `@utility {name} { ... }` block in `src/index.css` produces an opt-in utility class. Compatible with Tailwind's responsive variants if needed (e.g., `lg:hover-card`). Doc-block in `index.css` next to `@utility hover-card` notes the «coupled with `--ease-brand`» relationship.
- **Per-component `useReducedMotion()` hook** — Hero.tsx Phase 3 set the precedent (D-25 thread continues this; no context).
- **Named exports over default exports** in `src/lib/*.ts` — `assetUrl.ts` and `stages.ts` use named exports; `motionVariants.ts` follows.
- **Tiny custom hooks in `src/hooks/`** — first member, but the pattern (one file = one named-exported hook) is the same as `src/lib/`.
- **CSS-var + JS const lockstep** — brand palette (Phase 1 D-19) and check-brand whitelist (Phase 2 D-26) already follow this pattern. `--ease-brand` + `easeBrand` is the third instance.

### Integration Points (Phase 5 → Phase 6, 7)

- **Phase 6 Lighthouse audit on `/`** — Phase 5's hero session-skip means a reload-during-Lighthouse-pass measures the static hero (no parallax JS work) — the second pass is therefore artificially cheap. Phase 6 should run Lighthouse with sessionStorage cleared between runs. Document in Phase 6 plan.
- **Phase 6 image budget audit** — unaffected by Phase 5 (no image work).
- **Phase 6 mobile fallback** — `<MobileFallback>` page renders below 1024px; it does NOT need RevealOnScroll wrapping (it's a single-screen static layout). Phase 5 reveal patterns are desktop-route-only.
- **Phase 7 keyboard walkthrough** — Phase 5's `<RevealOnScroll>` does NOT alter focus order (children's natural focus-visible behavior preserved). `<AnimatePresence>` route-fade does NOT trap focus during the 350+400ms transition (motion.div is non-interactive). Verify both in Phase 7.
- **Phase 7 axe-core audit** — Phase 5 motion is purely visual; ARIA semantics unchanged. axe should not flag new issues.
- **Phase 7 hard-refresh test** — sessionStorage `vugoda:hero-seen` clears on tab close; cold incognito tab re-shows cinematic hero (correct behavior). Same-tab refresh during a session = static hero (correct behavior). Document for client demo.

</code_context>

<specifics>
## Specific Ideas

- **`<RevealOnScroll>` component file location:** `src/components/ui/RevealOnScroll.tsx` (consistent with `ResponsivePicture.tsx`, `Lightbox.tsx` pattern). Sibling export `<RevealItem>` is Claude's Discretion if planner judges the child-list ergonomics warrants it.
- **`useSessionFlag` hook signature:** `function useSessionFlag(key: string): boolean` — returns `true` if the flag was already set when the component mounted, `false` if it was just set. The hook self-writes on first call. Single-use semantics; not a generic state hook.
- **`pageFade` exit timing precision:** SC#3 says «~350ms exit / ~400ms enter». «~» allows ±20ms tolerance. Locked at 0.35s exit / 0.4s enter inside `pageFade.exit.transition.duration` and `pageFade.visible.transition.duration` respectively.
- **Cards-vs-section reveal hierarchy on `/projects`:** the StageFilter chip row is a 4-element list (4 stage chips). Stagger applies (80ms × 4 = 320ms). Page-header reveal completes first; then `<RevealOnScroll staggerChildren={true}>` on the chip row; then PipelineGrid reveals as a separate `<RevealOnScroll>` because the chip row and grid are visually distinct sections (different y-position, different intent). Planner enforces this in the page composer.
- **Browser compatibility for `<AnimatePresence>` + HashRouter:** verified. Motion 12.x's AnimatePresence is route-library-agnostic — works with HashRouter the same as BrowserRouter. The `useLocation()` hook fires on hash change; `pathname` changes (without `#`) on every route-internal nav. No special handling.
- **Lighthouse impact estimate:** AnimatePresence + RevealOnScroll add ~3KB gzipped (one new file each + minor variant exports). Bundle goes from 131.60 kB to ~135 kB gzipped — still 67.5% of 200 KB budget. No risk to QA-02.
- **Hero session-skip + Lighthouse reproducibility:** Phase 6 must clear sessionStorage between Lighthouse runs (or use `--chrome-flags="--incognito"` lighthouse CLI flag) to ensure consistent first-load measurements. Document in Phase 6 plan / READme.
- **Commit granularity (suggested for planner):**
  1. `feat(05-01): src/lib/motionVariants.ts SOT + --ease-brand @theme token` (foundation, no consumers yet)
  2. `feat(05-02): @utility hover-card + replace 5 surfaces with consolidated class` (Phase 4 hover absorption — atomic; verify no visual regression)
  3. `feat(05-03): RevealOnScroll + apply to home page sections` (Hero excluded; HOME-* sections wrapped)
  4. `feat(05-04): apply RevealOnScroll to /projects, /zhk/etno-dim, /construction-log, /contact` (full page coverage)
  5. `feat(05-05): AnimatePresence pageFade + onExitComplete scroll-restore in Layout.tsx` (route transitions; ScrollToTop.tsx no-op'd or removed)
  6. `feat(05-06): useSessionFlag hook + Hero parallax skip on revisit` (SC#5)
  7. `feat(05-07): Hero parallaxRange import from motionVariants SOT` (final SOT integration; minimal Hero edit)
- **Doc-block self-consistency pre-screen:** Phases 02-04..03-07 had recurring «Rule 3 — blocking» doc-block-grep collisions (forbidden literals in JSDoc that the same plan's grep gate forbids). Phase 5's grep gates are minimal (`paletteWhitelist`, `importBoundaries`, optional `noInlineTransition`). Planner pre-screens the `<action>` JSDoc text against `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals. Should produce zero collisions per Phase 03-08 precedent (which broke the streak by pre-screening).
- **Reveal Y-offset 24px** is the proposed magnitude (`fadeUp.hidden.y = 24`). This is enough to read as motion at 1920×1080 desktop scale without being attention-grabbing. Aligned visually with `--spacing-rhythm-md: 16px` (close but distinct — motion magnitude ≠ spacing token).
- **PortfolioOverview hover-card refactor caveat:** the existing class string at `PortfolioOverview.tsx:59` lives ON the `<article>` for each pipeline card. Replacing with `hover-card` should be straightforward; verify the Tailwind v4 `@utility` block applies correctly to non-block-level `<article>` elements. Default `display: block` for `<article>` plays fine with the transform/box-shadow/transition properties.
- **Variant naming sanity check:** the SOT has `fadeUp` and `fade` (sibling). If planner wants `fadeIn` instead of `fade` (more common React-ecosystem name), that's fine — keep it consistent across the codebase. `pageFade` is the route-specific variant; do not rename.

</specifics>

<deferred>
## Deferred Ideas

- **Lightbox open-anim absorption into SOT** — Phase 4 D-25 ships native `<dialog>` + 200ms fade-in. Phase 5 D-16 does not touch it. If Phase 5 ends up touching the lightbox (e.g., focus-trap improvements), absorption can happen there; otherwise this is out of scope. Lightbox is a Phase 4 surface, not a Phase 5 motion surface.
- **Browser back-button + per-route scroll restoration** — D-15 ships forward-only scroll-to-top. True back-button-restores-prior-scroll is v2.
- **Variants for the Phase 4 hover triple-effect** as Motion variants (instead of pure CSS) — D-24 ships pure CSS via `@utility`. If a future phase wants the hover to animate in response to JS state (e.g., a programmatic selection highlight), Motion variants would be more flexible. Out of scope for Phase 5.
- **Section-level reveal magic at scale** (intersection-observer pooling, single-observer-multi-target) — irrelevant for Phase 5 because per-section reveals are already a small N (≤7 below-fold sections per longest page = HomePage; total cross-route ≤25 sections). React's per-component IO is fine. v2 if a content explosion happens.
- **`<RevealOnScroll>` `delayChildren` for choreography** — D-08 default is 0; planner may set 80ms in select cases (StageFilter chip row per Specifics). Not a deferred idea — just left as planner discretion.
- **Per-photo stagger on `/construction-log`** — explicitly deferred per D-04.
- **Subtle slide / scale variants** — D-11 ships pure pageFade; if user feedback after demo wants more "movement" on transitions, slide-fade or scale-fade can be added in v2 by adding a new variant export. Existing site code does not need to change to swap variants.
- **`will-change: transform` performance audit** — Pitfall 16 reference. Phase 5 default is "don't add it"; Phase 6 Lighthouse may surface a need (unlikely on desktop modern hardware). v2 if needed.
- **Auto-expanding/collapsing reveal on scroll-up** (`once: false` in viewport options) — D-07 is `once: true`. If user feedback wants re-trigger on scroll-up, swap `once: true` → `once: false` in `motionVariants.ts` `fadeUp` viewport options. Single edit. v2 if requested.
- **MotionConfig provider for global Motion options** (e.g., `transition: { duration: 0.4 }` as default) — possible but unnecessary; per-variant `transition` config is local and explicit. v2 if ever 20+ surfaces share the same config.
- **GSAP** — STACK.md rejects; Motion is sufficient.
- **Splash / preloader screen for first session-load** — out of scope; the cinematic hero IS the splash equivalent.
- **`/dev/brand` and `/dev/grid` route-transition exclusion** — deferred. The QA routes get the same `pageFade` as production routes; Phase 5 does not branch by route. If QA inspection slows down because of fade, a planner can add `key` exclusion later.

### Reviewed Todos (not folded)

_No pending todos matched this phase at discussion time (`gsd-tools todo match-phase 5` → 0 matches)._

</deferred>

---

*Phase: 05-animations-polish*
*Context gathered: 2026-04-26*
