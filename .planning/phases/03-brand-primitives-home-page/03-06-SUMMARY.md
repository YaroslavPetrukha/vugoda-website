---
phase: 03-brand-primitives-home-page
plan: 6
subsystem: ui
tags: [react, motion, react-router-dom, lucide-react, tailwind, scroll-snap, methodology, construction]

requires:
  - phase: 02-data-layer-content
    provides: latestMonth() helper + teaserPhotos field; methodologyBlocks (7 §8 entries with needsVerification flags); content/home.ts (constructionTeaserCta, methodologyVerificationWarning)
  - phase: 03-brand-primitives-home-page
    provides: ResponsivePicture (Plan 03-03, widths=[640,960] for construction sizes); home-section directory pattern (Plan 03-04)
provides:
  - ConstructionTeaser section (HOME-04) — horizontal CSS scroll-snap strip of 5 photos from latestMonth().teaserPhotos with arrow buttons + CTA → /construction-log
  - MethodologyTeaser section (HOME-05) — 3-block grid (indexes [1, 3, 7]) with defensive ⚠-marker logic for needsVerification: true blocks
  - First production consumption of construction-tree ResponsivePicture (widths=[640,960] sizes=320px loading=lazy)
affects: [03-08-compose-and-dev-route (HomePage composition); 04-portfolio-zhk-log-contact (/construction-log timeline reuses month + photos shape); 05-animations-polish (Phase 5 owns scroll-reveal + arrow-button hover variants for both sections)]

tech-stack:
  added: []
  patterns:
    - "Native CSS scroll-snap (snap-x snap-mandatory + overflow-x-auto + scroll-smooth) over swiper/embla/keen-slider for low-item-count carousels — matches CLAUDE.md What NOT to Use"
    - "Programmatic scrollBy via React useRef<HTMLDivElement> + element.scrollBy({ left: STEP, behavior: 'smooth' }) for arrow-button affordance"
    - "Defensive content-flag rendering — UI maps a data flag (needsVerification) to a real DOM element (⚠ + aria-label) rather than string concatenation, so future block-selection swaps don't silently lose verification provenance"

key-files:
  created:
    - src/components/sections/home/ConstructionTeaser.tsx
    - src/components/sections/home/MethodologyTeaser.tsx
  modified: []

key-decisions:
  - "ConstructionTeaser uses native CSS scroll-snap + manual arrow buttons via useRef.scrollBy — zero carousel-library dep, matches CLAUDE.md What NOT to Use"
  - "Card width 320px + gap 16px → SCROLL_STEP = 336 constant for arrow-click scroll distance (one-card-per-click affordance)"
  - "ResponsivePicture for construction photos uses widths=[640,960] sizes=320px loading=lazy per Phase 3 D-22 — first production consumer of the construction-sized variant set; teaser sits below fold so lazy is correct"
  - "MethodologyTeaser featured set = indexes [1, 3, 7] (RESEARCH Open Question 2 recommendation) — all needsVerification: false. Avoids foregrounding unverified blocks 2/5/6 on home page (CONCEPT §11.5)"
  - "Defensive ⚠-marker conditional rendered in component even though current selection has no flagged blocks — future-proofs swap to e.g. [4, 5, 7] without code change beyond the FEATURED_INDEXES const"
  - "methodologyVerificationWarning aria-label sourced from src/content/home.ts (Phase 3 D-29 boundary) — closes plan-checker Warning 6; no inline «Потребує верифікації» literal in component"
  - "Numbered prefix uses block.index directly (01/03/07, not consecutive 01/02/03) — preserves §8 source structure visibly"
  - "Both component h2 headings («Хід будівництва Lakeview», «Як ми будуємо») kept inline as short brand-section labels — under 40-char content-boundary threshold + match Phase 2 D-20 microcopy carve-out and Plan 03-05 PortfolioOverview h2 inlining precedent"

patterns-established:
  - "CSS scroll-snap horizontal teaser pattern: container `flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4` + child `snap-start flex-shrink-0` with explicit width — reusable across Phase 4 /construction-log if a horizontal teaser appears there"
  - "Defensive data-flag rendering pattern: components consume a content-layer boolean (needsVerification) and render an aria-label-bearing marker DOM node from a content-layer string — future content swaps can flip the flag without component churn and aria provenance survives"

requirements-completed: [HOME-04, HOME-05]

duration: 7min
completed: 2026-04-25
---

# Phase 3 Plan 6: Construction & Methodology Teasers Summary

**Two below-fold home sections shipped — ConstructionTeaser (5-photo CSS scroll-snap strip + CTA → /construction-log) and MethodologyTeaser (3 verified §8 blocks with defensive ⚠-marker logic for future unverified swaps).**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-04-25T07:03:42Z
- **Completed:** 2026-04-25T07:10:15Z
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments

- HOME-04 closed: `ConstructionTeaser.tsx` renders 5 photos from `latestMonth().teaserPhotos` (mar-2026) in a horizontal scroll-snap strip; arrow buttons fire `scrollBy({ left: ±336, behavior: 'smooth' })`; CTA `<Link to="/construction-log">{constructionTeaserCta}</Link>` exits to the full timeline page (Phase 4 will populate)
- HOME-05 closed: `MethodologyTeaser.tsx` filters `methodologyBlocks` to indexes `[1, 3, 7]` (all verified) and renders 3 cards in `lg:grid-cols-3` grid; defensive ⚠-marker conditional with `aria-label={methodologyVerificationWarning}` ready for future `[4, 5, 7]`-style swaps
- First production consumer of construction-sized ResponsivePicture variant set (`widths=[640, 960]` sizes="320px" loading="lazy") — validates Plan 03-03's two-width construction encoder branch end-to-end
- Wave 3 progress: 5/7 home sections shipped (Hero + BrandEssence + PortfolioOverview + ConstructionTeaser + MethodologyTeaser); TrustBlock + ContactForm pending in Plan 03-07
- Build pipeline green: `npm run lint` exits 0 after each task, `npm run build` exits 0, postbuild check-brand 4/4 PASS, bundle 242.85 kB JS / 76.85 kB gzipped (unchanged from Plan 03-05 — no new imports beyond already-used `lucide-react` icons)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ConstructionTeaser.tsx** — `9a8b9db` (feat)
2. **Task 2: Create MethodologyTeaser.tsx** — `e6d8f60` (feat)

**Plan metadata commit:** see final commit below.

## Files Created/Modified

- `src/components/sections/home/ConstructionTeaser.tsx` — HOME-04 horizontal scroll-snap photo strip; reads `latestMonth()` from `data/construction`; renders teaser via `ResponsivePicture widths=[640,960]`; CTA Link to `/construction-log`; ChevronLeft/Right buttons fire programmatic `scrollBy`
- `src/components/sections/home/MethodologyTeaser.tsx` — HOME-05 3-block grid; reads `methodologyBlocks` filtered to `[1, 3, 7]`; defensive ⚠-marker on `needsVerification` with `aria-label={methodologyVerificationWarning}`

## Decisions Made

- **CSS scroll-snap over carousel libraries** — `snap-x snap-mandatory` + `overflow-x-auto` + `scroll-smooth` covers the 5-card teaser without swiper/embla/keen-slider footprint. Matches CLAUDE.md "What NOT to Use" hard rule.
- **`SCROLL_STEP = 336` (320 card + 16 gap) as module constant** — single literal in one place; arrow-click moves exactly one card. Easier to retune than scattered magic numbers.
- **Construction ResponsivePicture variant defaults end-to-end** — first home consumer of the `[640, 960]` two-width encoder branch from Plan 03-03 D-19; teaser cards are 320px wide, so 640w covers 1× DPR and 960w covers ~1.5× DPR. The 1280w/1920w branch stays exclusive to renders.
- **MethodologyTeaser feature-set = `[1, 3, 7]`** — RESEARCH Open Question 2 recommendation. All three are `needsVerification: false`, so the home page never foregrounds unverified §8 content (CONCEPT §11.5). Block 7 over block 4 for the "soft inter-section flow" recommendation in RESEARCH.
- **Defensive ⚠-marker conditional always rendered** — even though current selection triggers zero ⚠ at runtime. The conditional is cheap (one `&&` + nullable JSX) and survives future content swaps without code touch. Selection change becomes a single-line `FEATURED_INDEXES` const edit.
- **`methodologyVerificationWarning` aria-label sourced from `content/home.ts`** — D-29 content boundary applied even to short Cyrillic strings used in aria attributes. Closes the planner's checker Warning 6 about hardcoded «Потребує верифікації» literals in component code.
- **Numbered prefix uses `block.index` (01/03/07)** not consecutive `01/02/03` — preserves §8 source structure as a visible signal that the home page is showing curated subset of a longer document.
- **Section h2 headings inline** — «Хід будівництва Lakeview» (24 chars) and «Як ми будуємо» (13 chars) are short brand-section labels under the 40-char content-boundary threshold. Matches Plan 03-05 PortfolioOverview h2 inlining precedent and BrandEssence's lack of an h2 for the same reason. Body copy still 100% sourced from content modules.

## Deviations from Plan

**1. [Rule 3 - Blocking] Doc-block self-consistency on ConstructionTeaser.tsx**

- **Found during:** Task 1 (CREATE ConstructionTeaser.tsx)
- **Issue:** The plan's verbatim `<action>` JSX shipped a doc-block comment containing the literal `NO inline transition={{}}`, but the same plan's `<verify>` automated grep gate asserts `! grep -nE "transition=\{\{"` against the same file. Same self-consistency anti-pattern previously caught in Plans 02-04 (`placeholders.ts` / `values.ts`), 03-03 (`ResponsivePicture.tsx`), 03-04 (`Hero.tsx`), 03-05 (`BrandEssence.tsx` / `PortfolioOverview.tsx`).
- **Fix:** Rephrased the comment to `NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14)`. Documents the same Phase 5 boundary as the original wording without literally embedding the regex pattern the file's own grep gate forbids.
- **Files modified:** src/components/sections/home/ConstructionTeaser.tsx (doc-block only — JSX/runtime code unchanged from plan verbatim)
- **Verification:** Grep gate `! grep -nE "transition=\{\{" src/components/sections/home/ConstructionTeaser.tsx` exits 0; meaning preserved.
- **Committed in:** `9a8b9db` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — doc-block self-consistency)
**Impact on plan:** Cosmetic — JSX runtime byte-identical to plan verbatim. Recurring pattern across 6 plans is now firmly a planner-template smell; future plans should pre-screen `<action>` doc-blocks against their own `<verify>` regex battery before issuing.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Wave 3 home-section directory now contains 5/7 sections (Hero, BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser). Plan 03-07 (`trust-contact`) ships TrustBlock (HOME-06) + ContactForm (HOME-07) → 7/7. Plan 03-08 (`compose-and-dev-route`) composes HomePage.tsx and adds /dev/brand QA route.
- Bundle stable at 242.85 kB JS / 76.85 kB gzipped — within 200 KB-gzipped budget. No bundle pressure from this plan.
- check-brand 4/4 PASS preserved across both new files (importBoundaries did NOT trip on the `construction/${month.key}/${file}` template; ResponsivePicture is the only path that goes through assetUrl, and the literal in the template lacks the leading `/` the boundary regex demands).
- Phase 5 boundary preserved: zero inline Motion `transition` objects in either new component; both rely on shared CSS transitions only (`scroll-smooth`, hover color shifts via Tailwind utilities). Phase 5 will own scroll-reveal + arrow-button hover variants.

## Self-Check: PASSED

- FOUND: src/components/sections/home/ConstructionTeaser.tsx
- FOUND: src/components/sections/home/MethodologyTeaser.tsx
- FOUND: .planning/phases/03-brand-primitives-home-page/03-06-SUMMARY.md
- FOUND: commit 9a8b9db (Task 1: ConstructionTeaser)
- FOUND: commit e6d8f60 (Task 2: MethodologyTeaser)

---
*Phase: 03-brand-primitives-home-page*
*Completed: 2026-04-25*
