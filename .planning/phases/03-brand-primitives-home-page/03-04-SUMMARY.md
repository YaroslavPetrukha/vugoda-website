---
phase: 03-brand-primitives-home-page
plan: 4
subsystem: ui
tags: [hero, motion, useScroll, useTransform, useReducedMotion, parallax, react-19, tailwind-v4, avif, preload, lcp]

requires:
  - phase: 03-brand-primitives-home-page
    provides: src/components/brand/IsometricGridBG.tsx (Plan 03-01 — svgr ?react wrapper for hero overlay)
  - phase: 03-brand-primitives-home-page
    provides: src/content/home.ts (Plan 03-02 — heroSlogan + heroCta exports per D-29 content boundary)
  - phase: 03-brand-primitives-home-page
    provides: public/renders/lakeview/_opt/aerial-1920.avif (Plan 03-03 — sharp-encoded 388 KB, optimizer prebuild)
  - phase: 01-foundation-shell
    provides: react-router-dom <Link> + HashRouter (CTA → /projects)
  - phase: 01-foundation-shell
    provides: Tailwind v4 @theme tokens (bg-bg, bg-accent, text-text, text-bg-black) + Montserrat 700 cyrillic subset
  - phase: 01-foundation-shell
    provides: motion@^12.38 (useScroll, useTransform, useReducedMotion exports verified in Plan 03-04 RESEARCH §A)

provides:
  - src/components/sections/home/Hero.tsx (~80 lines; named export Hero)
  - HOME-01 closure: wordmark <h1> ВИГОДА Montserrat 700 uppercase clamp(120px,12vw,200px) + heroSlogan paragraph + heroCta <Link to="/projects"> bg-accent
  - ANI-01 closure: useScroll({target:heroRef, offset:['start start','end start']}) + useTransform(scrollYProgress,[0,1],[0,-120]) — linear, no spring, ≤120px ceiling
  - Reduced-motion guard: useReducedMotion() collapses output range to [0, 0] when user prefers reduced motion (Phase 5 owns full RM hook threading; minimum viable here)
  - index.html AVIF hero preload <link> directive (rel=preload, as=image, type=image/avif, fetchpriority=high) above <title> per D-18

affects:
  - phase 03-05-essence-portfolio — PortfolioOverview composes BELOW the hero on HomePage; Hero is at top of <Outlet>
  - phase 03-08-compose-and-dev-route — HomePage.tsx imports Hero as the first home section
  - phase 05-animations-polish — Hero parallax becomes the swap-target for shared motionVariants.parallaxSlow (no behavior change; only easing-config relocation per ANI-01 deferred handoff)
  - phase 06-performance-mobile-deploy — Lighthouse desktop ≥90 LCP test consumes index.html preload; aerial-1920.avif still 388 KB — Phase 6 must use <ResponsivePicture sizes> to deliver 1280-AVIF (200 KB) or 640-AVIF (60 KB) to typical viewports per STATE.md Phase 6 risk note

tech-stack:
  added: []
  patterns:
    - "Hero parallax recipe: useRef<HTMLElement>(null) + useScroll({target,offset}) + useTransform(progress, [0,1], rmGuard ? [0,0] : [0,-120]) — drives <motion.div style={{y:cubeY}}> wrapper around IsometricGridBG"
    - "Reduced-motion respect at hook-call time (NOT conditional hook calls) — output range swap preserves React rule-of-hooks order and keeps the MotionValue identity stable"
    - "No inline Motion transition objects in Phase 3 components (Pitfall 14) — Phase 5 owns project-wide easing variants; Hero uses purely scroll-driven MotionValue binding"
    - "Self-consistency: Hero.tsx doc-block phrases the Phase 5 boundary as 'inline Motion transition objects' (paraphrased) so the file does not literally trip its own grep gate — same anti-pattern fixed in Plans 02-04 + 03-03"
    - "Brand display moment exception: ВИГОДА wordmark is ALLOWED inline (Cyrillic ≤6 chars, brand display per D-02), but heroSlogan + heroCta come from src/content/home.ts (D-29 content boundary)"
    - "AVIF hero preload pattern: rel=preload, as=image, type=image/avif, fetchpriority=high, NO crossorigin (same-origin Pages avoids Pitfall 5 double-fetch); type silently ignored by non-AVIF browsers (Pitfall 4 — <picture> JPG fallback handles them)"
    - "Section file location: src/components/sections/home/{SectionName}.tsx — first section directory created in Plan 03-04; Plans 03-05/06/07 add siblings"

key-files:
  created:
    - src/components/sections/home/Hero.tsx
  modified:
    - index.html

key-decisions:
  - "Verbatim plan execution — Hero.tsx body matches plan <action> step B character-for-character (only doc-block phrasing adjusted to avoid self-consistency grep trip; substantive code unchanged)"
  - "Doc-block forbidden-literal rephrasing (deviation Rule 3 - blocking issue): replaced 'NO inline transition={{}}' in module-level comment with 'NO inline Motion transition objects' so Hero.tsx does not literally contain the regex pattern its own plan grep-gate forbids. Same self-consistency precedent as Plan 02-04 (placeholders.ts/values.ts) and Plan 03-03 (ResponsivePicture.tsx)"
  - "useReducedMotion guard collapses outputRange to [0, 0] (recipe from 03-RESEARCH §A lines 263-268) — keeps useTransform call unconditional (rule-of-hooks safe) while still respecting user signal"
  - "AVIF preload uses simple-form href (single 1920w URL), no imagesrcset — per 03-RESEARCH lines 397-437 simple form is recommended for desktop-first MVP (avoids the imagesrcset-vs-href browser-quirk surface area)"

patterns-established:
  - "Sections-grouped-by-page directory structure — src/components/sections/home/Hero.tsx is the first; later home plans add siblings under same path"
  - "Hero parallax = scoped useScroll (target=ref, NOT viewport) — parallax stops cleanly when hero scrolls out of view; matches D-04 «passing through structured space»"
  - "Reduced-motion respect threaded into Phase 3 components — minimum viable form (output range swap); Phase 5 will systematise across all animated components per ANI-04 deferred"

requirements-completed: [HOME-01, ANI-01]

# Metrics
duration: 5min
completed: 2026-04-25
---

# Phase 3 Plan 04: Hero Section Summary

**Hero section with Motion useScroll/useTransform parallax (≤120px, reduced-motion-aware) + AVIF aerial-1920 preload directive — closes HOME-01 + ANI-01.**

## Performance

- **Duration:** ~5 min (286 s)
- **Started:** 2026-04-25T06:42:24Z
- **Completed:** 2026-04-25T06:47:10Z
- **Tasks:** 2
- **Files modified:** 2 (1 created + 1 modified)

## Accomplishments

- **HOME-01 closed** — Hero section renders wordmark `<h1>` ВИГОДА (Montserrat 700 uppercase, `clamp(120px,12vw,200px)`), gasло paragraph from `heroSlogan` content import, accent CTA `<Link to="/projects">` with the heroCta label, and `IsometricGridBG` overlay at opacity 0.15 (the «ахуєнний desktop» brand opening).
- **ANI-01 closed** — vertical parallax via `useScroll({target:heroRef, offset:['start start','end start']})` + `useTransform(scrollYProgress, [0,1], [0,-120])`, linear (no spring, no bounce), bounded at the D-04 ≤120px ceiling.
- **Reduced-motion guard** — `useReducedMotion()` collapses the `useTransform` outputRange to `[0, 0]` so the grid stays put for users who request reduced motion. Hook call order stays unconditional (rule-of-hooks safe).
- **AVIF hero preload** — `index.html` now ships `<link rel="preload" as="image" type="image/avif" fetchpriority="high" href="/vugoda-website/renders/lakeview/_opt/aerial-1920.avif">` directly above `<title>`. Phase 6 Lighthouse can use this preload to start the LCP fetch at HTML-parse time.
- **No inline Motion transition objects** — Phase 5 boundary preserved (Pitfall 14). `<motion.div>` uses `style={{y:cubeY}}` only.
- **Build pipeline green** — `tsc --noEmit` clean, `vite build` 3.09 s, bundle 242.85 kB JS / 76.85 kB gzipped (within 200 KB-gzipped budget), `check-brand` 4/4 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries).

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/components/sections/home/Hero.tsx** — `7d737aa` (feat)
2. **Task 2: Add AVIF hero preload link to index.html** — `4b5b6e0` (feat)

**Plan metadata commit:** appended after this summary file is written.

## Files Created/Modified

- **Created** `src/components/sections/home/Hero.tsx` (~80 lines) — Hero section primitive: wordmark `<h1>` + gasло `<p>` + CTA `<Link>` + Motion-parallax `<IsometricGridBG>` overlay; named export `Hero`.
- **Modified** `index.html` (14 → 21 lines) — added 7-line AVIF hero preload `<link>` block above `<title>`. No `crossorigin` attribute (same-origin Pages avoids Pitfall 5 double-fetch).

## Decisions Made

- **Verbatim plan execution.** Hero.tsx body matches plan `<action>` Step B character-for-character — code itself unchanged.
- **Doc-block self-consistency fix (Rule 3 - blocking issue).** The plan's `<action>` Step B verbatim TSX includes a module-level doc comment that literally reads `NO inline transition={{}}`. The plan's own `<verify>` automated check then asserts `! grep -nE "transition=\\{\\{"` against the same file. This is the same self-consistency anti-pattern flagged in Plans 02-04 (placeholders.ts/values.ts forbidden-lexicon doc-blocks) and 03-03 (ResponsivePicture.tsx render-tree literal doc-blocks). Resolution: rephrased the comment to `NO inline Motion transition objects` — preserves the Phase 5 boundary documentation without literally embedding the pattern the file's own grep gate forbids. Substantive code is byte-identical to the plan spec.
- **Plan grep regex was single-line; verbatim TSX is multi-line.** The plan's `<verify>` automated check `grep -nE 'useTransform\(.*\[0,\s*-120\]' Hero.tsx` is a single-line regex, but the verbatim TSX it specifies splits the `useTransform(...)` call across 5 lines (one arg per line). The substantive invariant — output range `[0, -120]` — is present at line 45; verified by plain-text presence grep `grep -nE '\[0, -120\]' Hero.tsx`. Treated as plan-side regex incompleteness (not a code defect); did not redact the multi-line code to satisfy a single-line regex because that would worsen readability.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Rephrased Hero.tsx doc-block to avoid self-consistency grep trip**
- **Found during:** Task 1 verification (Hero.tsx grep battery)
- **Issue:** The plan's verbatim TSX module doc-block contained the literal string `NO inline transition={{}}`, but the plan's own automated verification asserts `! grep -nE "transition=\\{\\{" Hero.tsx`. The doc-block (intended to document the Phase 5 boundary rule) literally embedded the pattern the rule forbids — file would trip its own grep gate.
- **Fix:** Rephrased the comment to `NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14)`. Preserves the documented intent without literally writing the forbidden regex pattern.
- **Files modified:** `src/components/sections/home/Hero.tsx` (1 line within doc-block; substantive code unchanged)
- **Verification:** Re-ran grep battery — `! grep -nE "transition=\\{\\{"` now passes. `npm run lint` clean.
- **Committed in:** `7d737aa` (Task 1 commit — fix landed in same commit as the new file, keeps Hero.tsx history clean)

---

**Total deviations:** 1 auto-fixed (1 blocking, self-consistency)
**Impact on plan:** No scope creep. Substantive code byte-identical to plan spec; only a doc-comment was rephrased to satisfy the file's own grep gate. Documents the Phase 5 boundary as well as the original wording would have.

## Issues Encountered

- None beyond the doc-block self-consistency fix above. Build pipeline passed on first run after Task 1 commit; check-brand 4/4 PASS; no follow-up fixes needed.

## Known Stubs

None. Hero.tsx contains no TODO/FIXME/placeholder markers; all data flows from real content imports (`heroSlogan`, `heroCta`) and a real Wave 2 image asset (`aerial-1920.avif` exists at `public/renders/lakeview/_opt/`, 388 KB).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Wave 3 partial:** Hero (Plan 03-04) ships; PortfolioOverview (Plan 03-05) + below-fold sections (Plans 03-06, 03-07) + HomePage composition (Plan 03-08) still pending.
- **Phase 5 hand-off:** Hero parallax uses local `useTransform` linear binding; Phase 5 ANI-01 deferred work will swap to shared `motionVariants.parallaxSlow` — additive change, no behavior swing.
- **Phase 6 risk preserved:** `aerial-1920.avif` = 388 KB (above 200 KB hero budget at largest width). Phase 6 must use `<ResponsivePicture sizes>` to deliver 1280-AVIF (~200 KB) or 640-AVIF (~60 KB) on typical 1280-1920 desktop viewports. Encoder params pinned by D-19; tuning is Phase 6's call (would override D-19 — requires user sign-off).
- **Manual visual QA recommended at handoff:** open `npm run dev` → `http://localhost:5173/#/`, scroll, verify grid drifts UP ≤120px, no bounce, stops cleanly. Toggle DevTools "Emulate prefers-reduced-motion: reduce" → grid should stay static. (Hero is mounted via Plan 03-08's HomePage composition or a temporary direct mount — not done in this plan.)

## Self-Check: PASSED

- File `src/components/sections/home/Hero.tsx` exists (verified post-write).
- File `index.html` modified (preload `<link>` block present, lines 8-14).
- Commit `7d737aa` exists in `git log` (verified via `git log --oneline -5`).
- Commit `4b5b6e0` exists in `git log` (verified via `git log --oneline -5`).
- `npm run build` exit 0 — full pipeline (prebuild → tsc → vite build → postbuild check-brand 4/4) green.
- Bundle: 242.85 kB JS / 76.85 kB gzipped — within 200 KB-gzipped budget.

---

*Phase: 03-brand-primitives-home-page*
*Completed: 2026-04-25*
