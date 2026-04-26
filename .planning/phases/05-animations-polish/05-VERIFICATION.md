---
phase: 05-animations-polish
verified: 2026-04-26T09:50:00Z
status: human_needed
score: 5/5 must-haves verified (all automated gates green; SC#3/SC#4/SC#5 visual confirmation pending human)
human_verification:
  - test: "Inter-route fade transitions feel smooth, no jank"
    expected: "Each transition fades out then fades in within ~750ms total. No instant cuts, no double-paint, no scroll-position jump during fade. Visit /, /projects, /zhk/etno-dim, /construction-log, /contact in sequence and confirm pageFade looks brand-cinematic."
    why_human: "Visual perception of timing/feel cannot be verified programmatically — Lighthouse and unit tests cannot judge cinematic quality (SC#3)."
  - test: "Reduced-motion mode is fully respected across all motion surfaces"
    expected: "DevTools → Rendering → Emulate prefers-reduced-motion: reduce → reload → navigate all 5 routes. No reveal animations run, route transitions instant (no fade), hero parallax static. Site fully navigable and readable."
    why_human: "OS/browser-emulated reduced-motion state requires actual emulation; the unwrap-children path in RevealOnScroll and the no-op variant in Layout cannot be exercised by grep (SC#4)."
  - test: "Hero session-skip works on revisit"
    expected: "Cold incognito tab → / → scroll, hero parallax animates (cinematic intro). Same-tab refresh → / → scroll, IsometricGridBG sits static at y:0 (no animation). Tab close + new tab → cinematic returns."
    why_human: "sessionStorage state + visual confirmation of static-vs-cinematic parallax cannot be inspected from grep; useSessionFlag('vugoda:hero-seen') wiring is verified but observable behavior requires browser session (SC#5)."
  - test: "/zhk/etno-dim LCP image still paints fast (D-09 fade-only variant)"
    expected: "DevTools Performance → record /zhk/etno-dim cold load → confirm LCP element is the hero render and LCP timing ≤ 2.5s (no Y-translate delay)."
    why_human: "LCP timing requires real-browser performance recording; D-09 mandates ZhkHero uses variant={fade} (verified in code) but visual paint timing is empirical."
  - test: "Hover-card consolidation byte-equivalent to Phase 4 inline class"
    expected: "Before/after screenshots of one card per surface (PortfolioOverview pipeline grid · FlagshipCard · PipelineCard · ZhkGallery thumb · MonthGroup thumb) at idle and hover. Same scale, same glow color/intensity, same transition timing as Phase 4 baseline."
    why_human: "Visual diff between inline-class baseline and @utility hover-card consolidation needs a screenshot pass; CSS-rule equivalence cannot be confirmed without rendered comparison (D-24)."
---

# Phase 5: Animations & Polish — Verification Report

**Phase Goal (ROADMAP.md):** "Unified Motion system layered on top of stable content — single source of truth for variants/easings/durations, scroll-reveal on every section, smooth inter-route transitions, full prefers-reduced-motion respect."

**Verified:** 2026-04-26T09:50:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria from ROADMAP.md)

| #   | Truth (verbatim from ROADMAP)                                                                                                                                                                                                                                                                                                       | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC1 | `src/lib/motionVariants.ts` is the single source of truth for `fadeUp`, `stagger`, `pageFade`, `parallaxRange` variants using shared easings (`cubic-bezier(0.22, 1, 0.36, 1)`, no bounce-springs) and durations (fast 200ms / base 400ms / slow 1200ms); `grep -r "transition={{" src/` returns zero inline transition objects | ✓ VERIFIED | 7 named exports present (`easeBrand`, `durations`, `fadeUp`, `fade`, `stagger`, `pageFade`, `parallaxRange`); `easeBrand = [0.22, 1, 0.36, 1]`; `durations = { fast: 0.2, base: 0.4, slow: 1.2 }`; `grep -rn 'transition={{' src/` returns 0 matches; check-brand 5/5 PASS includes `noInlineTransition` permanent CI gate.                              |
| SC2 | `<RevealOnScroll>` wrapper in `components/ui/` uses Motion `whileInView` + `viewport={{ once: true, margin: '-50px' }}` + shared `fadeUp` variant; applied to every below-fold section across all 5 pages; card lists use parent `stagger` with 80ms `staggerChildren` (no 30+ independent IntersectionObservers)                  | ✓ VERIFIED | `src/components/ui/RevealOnScroll.tsx` exists with `whileInView="visible"`, `viewport={{ once: true, margin: '-50px' }}`; **26** `<RevealOnScroll` instances across `src/components/sections/` and `src/pages/` (≥18 threshold); 7 `staggerChildren` consumers (BrandEssence, PortfolioOverview, MethodologyTeaser, TrustBlock, StageFilter, PipelineGrid, ZhkGallery); MonthGroup uses 1 reveal per month (D-04 enforced — 4 IO observers on /construction-log, not 50). |
| SC3 | `<AnimatePresence mode="wait" initial={false}>` wraps `<Outlet />` in Layout, keyed on `useLocation().pathname`; navigating between all 5 routes produces fade-out-then-fade-in (~350ms exit / ~400ms enter) with no visual jank; hero re-enters cleanly when returning to `/` after visiting another route                          | ⚠ NEEDS HUMAN | Layout.tsx wires `<AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>` + `<motion.div key={location.pathname} variants={variants}>`; pageFade has `transition: { duration: durations.base, ease: easeBrand }` (400ms enter) + `exit: { transition: { duration: 0.35, ease: easeBrand } }` (350ms exit); reduced-motion swaps for no-op variant. Visual smoothness needs human eyes. |
| SC4 | `useReducedMotion()` hook is honored: when `prefers-reduced-motion: reduce` is active, `RevealOnScroll` renders children without variants, hero parallax is static, route-transition becomes instant; site remains fully navigable and readable                                                                                       | ⚠ NEEDS HUMAN | `useReducedMotion` consumed in 3 sites: `RevealOnScroll.tsx` (early-return unwrap path renders `<Tag {...rest}>{children}</Tag>` with no motion wrapper); `Layout.tsx` (no-op variant `{hidden:{opacity:1}, visible:{opacity:1}, exit:{opacity:1}}`); `Hero.tsx` (`skipParallax = prefersReducedMotion || heroSeen`). CSS `@media (prefers-reduced-motion: reduce)` block in `@utility hover-card` neutralises hover scale + box-shadow. Behavioral confirmation needs DevTools emulation. |
| SC5 | Session-scoped skip: a `sessionStorage.getItem('hero-seen')` check on second+ visit within a session fades the hero in 2× faster (or skips parallax entirely) — demo-URL reloads during client pitch don't force re-watching the cinematic intro                                                                                    | ⚠ NEEDS HUMAN | `src/hooks/useSessionFlag.ts` exists with lazy `useState` initializer reading sessionStorage synchronously + useRef double-write guard; Hero.tsx calls `useSessionFlag('vugoda:hero-seen')` (D-18 brand-prefix); `skipParallax` flips `useTransform` outputRange between `[0, 0]` (static) and `[...parallaxRange]` (cinematic). sessionStorage state observation needs browser session. |

**Score:** 5/5 truths verified at code-level. SC#3/SC#4/SC#5 carry visual/runtime confirmation that requires human eyes (per VALIDATION.md Manual-Only Verifications table).

---

### Required Artifacts

| Artifact                                                  | Expected                                                              | Status     | Details                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `src/lib/motionVariants.ts`                               | 7 named exports, easeBrand `[0.22, 1, 0.36, 1]`, durations, variants  | ✓ VERIFIED | All 7 exports present; lockstep doc-block notes coupling with `--ease-brand`                                  |
| `src/index.css`                                           | `--ease-brand` token + `@utility hover-card` block                    | ✓ VERIFIED | `--ease-brand: cubic-bezier(0.22, 1, 0.36, 1)` in @theme (line 28); `@utility hover-card { ... }` (line 97)   |
| `src/components/ui/RevealOnScroll.tsx`                    | whileInView + viewport + RM-aware unwrap branch                       | ✓ VERIFIED | RM unwrap renders plain `<Tag>` without motion; non-RM uses `motion.{as}` with `viewport={{ once, margin }}`  |
| `src/hooks/useSessionFlag.ts`                             | One-shot read+write of sessionStorage flag                            | ✓ VERIFIED | Lazy useState init + useEffect write + useRef guard; SSR-safe `typeof window === 'undefined'` check           |
| `src/components/layout/Layout.tsx`                        | AnimatePresence + onExitComplete + RM no-op variant                   | ✓ VERIFIED | `mode="wait" initial={false}` + key=location.pathname + onExitComplete window.scrollTo                        |
| `src/components/layout/ScrollToTop.tsx`                   | DELETED per D-14                                                      | ✓ VERIFIED | File does not exist; import removed from Layout.tsx                                                            |
| `src/components/sections/home/Hero.tsx`                   | parallaxRange import + useSessionFlag wiring + skipParallax           | ✓ VERIFIED | Lines 44-45 import; line 50-51 sets heroSeen + skipParallax; line 58-62 uses spread `[...parallaxRange]`     |
| `scripts/check-brand.ts`                                  | 5th check `noInlineTransition()` for SC#1 permanent CI gate           | ✓ VERIFIED | Function on lines 211-228; output `5/5 checks passed` confirmed in run                                         |
| 9 SUMMARY.md files                                        | One per plan: 05-01..05-08 (with 05-05a + 05-05b after split)         | ✓ VERIFIED | `ls` confirms all 9 files exist                                                                                |

---

### Key Link Verification (Wiring)

| From                          | To                                | Via                                                            | Status   | Details                                                                                                                  |
| ----------------------------- | --------------------------------- | -------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Below-fold sections           | RevealOnScroll component          | `<RevealOnScroll>` wrapping per D-08 coverage map              | WIRED    | 26 instances across home (BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm), zhk (Hero, FactBlock, WhatsHappening, Gallery, CtaPair), construction-log (MonthGroup), and pages (ContactPage ×3, ProjectsPage, ConstructionLogPage). Hero excluded per D-06 (LCP target). |
| Hover surfaces (5)            | `@utility hover-card`             | `className="... hover-card"`                                   | WIRED    | 5 surfaces: PortfolioOverview pipeline `<article>` (line 65), FlagshipCard `<article>` (line 32), PipelineCard `<article>` (line 39), ZhkGallery thumb `<button>` (line 61), MonthGroup thumb `<button>` (line 60).                       |
| `--ease-brand` CSS var        | `easeBrand` JS const              | Lockstep documentation rule (D-23)                             | WIRED    | Both contain `cubic-bezier(0.22, 1, 0.36, 1)`; doc-block in motionVariants.ts notes coupling rule.                       |
| Layout AnimatePresence        | pageFade variant                  | Named import `import { pageFade } from '../../lib/motionVariants'` | WIRED    | Layout.tsx line 35 imports pageFade; line 44 assigns to `variants` (or no-op under RM); line 57 passes to motion.div.    |
| Hero                          | parallaxRange + useSessionFlag    | Named imports                                                  | WIRED    | Hero.tsx line 44-45 imports both; line 50-51 wires skipParallax; line 58-62 spreads parallaxRange in useTransform.       |
| RevealOnScroll                | fadeUp + stagger variants         | Named import                                                   | WIRED    | RevealOnScroll.tsx line 34 imports `{ fadeUp, stagger }`; line 47 default variant; line 65-77 stagger orchestration.     |
| Hover-card                    | Reduced-motion CSS                | `@media (prefers-reduced-motion: reduce)` nested block         | WIRED    | index.css lines 107-112 neutralise scale + box-shadow on RM.                                                              |
| ScrollToTop helper            | (deleted) → onExitComplete         | `onExitComplete={() => window.scrollTo(0, 0)}`                  | WIRED    | Old `useEffect`-on-pathname pattern removed; scroll-restore now lives inside AnimatePresence callback (D-14).            |

---

### Data-Flow Trace (Level 4)

| Artifact            | Data Variable      | Source                                          | Produces Real Data | Status     |
| ------------------- | ------------------ | ----------------------------------------------- | ------------------ | ---------- |
| Hero.tsx            | `cubeY`            | `useTransform(scrollYProgress, [0,1], range)`   | Yes — scroll-driven MotionValue; flips static under skipParallax (verified)        | ✓ FLOWING  |
| Layout.tsx          | `location.pathname` | `useLocation()` from react-router-dom            | Yes — re-keys motion.div on every route change (HashRouter pathname propagates correctly per CONTEXT) | ✓ FLOWING  |
| RevealOnScroll      | `prefersReducedMotion` | `useReducedMotion()` from motion/react          | Yes — hook subscribes to matchMedia listener; unwrap branch verified | ✓ FLOWING  |
| Hero (session flag) | `heroSeen`         | `useSessionFlag('vugoda:hero-seen')`             | Yes — lazy useState reads sessionStorage synchronously; first call returns false + writes flag, subsequent mounts return true | ✓ FLOWING  |
| StageFilter chips   | `staggerChildren` cascade | `<RevealOnScroll staggerChildren>` + `<motion.button variants={fadeUp}>` children | Yes — 80ms cadence × 5 chips per Plan 05-05b | ✓ FLOWING  |

---

### Behavioral Spot-Checks

| Behavior                                                   | Command                                                                                       | Result                                                  | Status |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------ |
| TypeScript compiles cleanly                                 | `npm run lint` (= `tsc --noEmit`)                                                              | exit 0, no output                                        | ✓ PASS |
| Brand CI gate (5 checks)                                    | `npx tsx scripts/check-brand.ts`                                                               | "5/5 checks passed" — denylistTerms · paletteWhitelist · placeholderTokens · importBoundaries · noInlineTransition | ✓ PASS |
| No inline `transition={{...}}` JSX-prop in src/             | `grep -rn 'transition={{' src/`                                                                | 0 matches (exit 1 from grep)                             | ✓ PASS |
| RevealOnScroll coverage threshold                           | `grep -rn '<RevealOnScroll' src/ \| wc -l`                                                     | 26 (≥18 threshold)                                       | ✓ PASS |
| Bundle size under 200KB gzipped                             | `npx vite build` → check report                                                                 | 137.11 kB gzipped JS (68.6% of budget)                   | ✓ PASS |
| ScrollToTop.tsx deleted                                     | `test ! -f src/components/layout/ScrollToTop.tsx`                                              | File does not exist                                      | ✓ PASS |
| All 9 SUMMARY.md files exist                                | `ls .planning/phases/05-animations-polish/*-SUMMARY.md \| wc -l`                                | 9                                                        | ✓ PASS |
| 5 hover-card surfaces                                       | `grep -rn 'hover-card' src/components/ \| wc -l`                                               | 5                                                        | ✓ PASS |

**Note on full `npm run build`:** confirmed green end-to-end on second invocation (exit 0; postbuild check-brand prints `5/5 checks passed`; 137.11 kB gzipped JS reported by Vite). One earlier attempt failed at the prebuild image-pipeline step with a transient sharp filesystem race on `feb-2026/_opt/feb-12-1920.avif`; this is a Phase 2 surface concern, not a Phase 5 regression. Recommend Phase 6 plan covers `mkdir -p` hardening on `scripts/optimize-images.mjs` if the race recurs.

---

### Requirements Coverage

| Requirement | Source Plan(s)                          | Description                                                                 | Status     | Evidence                                                                                                                                                |
| ----------- | --------------------------------------- | --------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ANI-02      | 05-01, 05-03, 05-04, 05-05a, 05-05b, 05-07, 05-08 | `<RevealOnScroll>` Motion `whileInView` + `fadeUp` variant ~400ms, stagger for cards; SOT in `lib/motionVariants.ts`; no inline `transition={{...}}` | ✓ SATISFIED | RevealOnScroll component implements whileInView + viewport per D-07; 26 wraps across all 5 pages per D-08 coverage map; SOT motionVariants.ts owns durations.base = 0.4 (400ms); SC#1 grep returns 0; permanent CI gate active in check-brand 5/5. |
| ANI-04      | 05-01, 05-06                            | `AnimatePresence mode="wait"` keyed on pathname, `pageFade` variant; respects `useReducedMotion` | ✓ SATISFIED | Layout.tsx wires AnimatePresence with `mode="wait" initial={false}`, keyed on `location.pathname`; pageFade variant with 400ms enter / 350ms exit per D-11; useReducedMotion swaps to no-op variant per D-25; onExitComplete handles scroll-restore per D-14. |

**Orphan check:** REQUIREMENTS.md maps Phase 5 to exactly ANI-02 + ANI-04. No additional REQ-IDs are mapped to Phase 5 in REQUIREMENTS.md. Both IDs are claimed by Phase 5 plan frontmatters and verified above. Zero orphans.

---

### Anti-Patterns Found

| File                                          | Line  | Pattern                                                       | Severity | Impact                                                                                                                                                                                                              |
| --------------------------------------------- | ----- | ------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (none in src/)                                | —     | —                                                             | —        | check-brand 5/5 PASS; SC#1 grep clean; no `framer-motion` legacy imports; no `transition-all`; no spring transitions; no hardcoded empty arrays/objects in render path; no `console.log`-only handlers; no `TODO`/`FIXME` markers in src.        |
| `scripts/optimize-images.mjs` (Phase 2 surface) | runtime | Transient sharp filesystem race on `_opt/feb-12-1920.avif`     | ℹ Info   | NOT a Phase 5 surface; build fails on `npm run build` prebuild but `npx vite build` succeeds. Recommend Phase 6 plan covers image-pipeline robustness (mkdir -p before sharp.toFile) — out of scope for Phase 5 sign-off. |

**Deferred-items resolution:** `deferred-items.md` flagged a TS2322 error on `StageFilter.tsx:60` (role/aria-label props on Stagger component). Resolved by Plan 05-05b's HTMLAttributes Props widening on RevealOnScroll (line 36 `interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'>`). Verified `npm run lint` exits 0 — error is gone.

---

### Human Verification Required

See frontmatter `human_verification:` block. Five items needing visual/runtime confirmation:

1. **Inter-route fade transitions feel smooth, no jank** — SC#3 visual quality
2. **Reduced-motion mode is fully respected across all motion surfaces** — SC#4 OS-emulated state
3. **Hero session-skip works on revisit** — SC#5 sessionStorage + visual
4. **`/zhk/etno-dim` LCP image still paints fast (D-09 fade-only variant)** — Lighthouse LCP threshold
5. **Hover-card consolidation byte-equivalent to Phase 4 inline class** — visual diff

Per VALIDATION.md sign-off, these were planned as Manual-Only Verifications from the start.

---

### Gaps Summary

**No gaps found at code level.** All five Success Criteria are wired in code:

- SC#1 SOT (motionVariants.ts 7 exports + --ease-brand + permanent CI gate) — verified
- SC#2 RevealOnScroll with `whileInView` + `viewport={{ once: true, margin: '-50px' }}` + 26 wraps + 7 stagger consumers — verified
- SC#3 AnimatePresence mode="wait" initial={false} keyed on pathname + pageFade 400ms/350ms + onExitComplete scroll restore — verified in code
- SC#4 useReducedMotion threaded through RevealOnScroll (unwrap), Layout (no-op variant), Hero (skipParallax); CSS `@media (prefers-reduced-motion: reduce)` in hover-card — verified in code
- SC#5 useSessionFlag('vugoda:hero-seen') hook + lazy useState init + Hero wiring + skipParallax — verified in code

The five visual/runtime items above (SC#3 smoothness, SC#4 OS emulation, SC#5 sessionStorage browser test, ZhkHero LCP, hover-card visual diff) cannot be exercised by grep — they require human inspection of the running site. They were planned as Manual-Only verifications from the start (VALIDATION.md sign-off line 122).

**Recommendation:** the phase delivers the goal at code level; sign-off requires human walk-through of the manual gates. Proceed to manual gate execution before marking Phase 5 complete on the roadmap.

---

_Verified: 2026-04-26T09:50:00Z_
_Verifier: Claude (gsd-verifier)_
