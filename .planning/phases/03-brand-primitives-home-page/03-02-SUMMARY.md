---
phase: 03-brand-primitives-home-page
plan: 02
subsystem: content
tags: [microcopy, content-module, hero-gaslo, i18n-ua, leaf-module]

# Dependency graph
requires:
  - phase: 02-data-layer-content
    provides: IMPORT BOUNDARY pattern (values.ts, placeholders.ts, methodology.ts, company.ts) — leaf-module shape, doc-block convention
  - phase: 03-brand-primitives-home-page (Plan 03-01)
    provides: brand primitives (Logo/Mark/IsometricCube/IsometricGridBG) — independent track; 03-02 has no compile-time link, just sequencing
provides:
  - src/content/home.ts (12 named string exports — hero gasло, CTA labels, section headings, captions, aria-labels)
  - Hero gasло byte-exact in TS source (closes HOME-01 content half — Hero.tsx in Wave 3 will consume)
  - Microcopy unblock for Wave 3 sections (Hero, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm)
affects: [03-04 hero-section, 03-05 essence-portfolio, 03-06 construction-methodology, 03-07 trust-contact, 03-08 compose-and-dev-route]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Leaf content module (zero imports) per Phase 2 D-20 / Phase 3 D-29 boundary"
    - "Single-line export form for `^export const X = ` regex compatibility (plan verify gate)"
    - "Byte-exact typographic glyphs (U+2019 apostrophe, U+2014 em-dash, U+2197 arrow, U+00B7 middle-dot) preserved in source — never substituted with ASCII fallbacks"

key-files:
  created:
    - "src/content/home.ts (64 lines, 12 named string exports)"
  modified: []

key-decisions:
  - "Single-line export form chosen over multi-line for all 12 strings — plan's <verify> regex `^export const X = ` requires `= ` (equals + space + content) on the same line; multi-line `=\\n  '...'` would fail the gate. Plan's <action> example used multi-line which contradicted its own verify regex. Resolved per Rule 3 (auto-fix blocking) by collapsing to single-line. Strings remain readable (max ~100 chars)."
  - "Forbidden-lexicon hits in doc-block prose were rephrased upstream during write — doc-block references the *enforcement* (`scripts/check-brand.ts denylistTerms + plan-level grep`) without quoting the literal banned words, mirroring Plan 02-04's same self-consistency fix on values.ts/placeholders.ts."

patterns-established:
  - "home.ts is the canonical surface for any home-page Ukrainian copy >40 chars — Wave 3 components import by name, never inline JSX literals (D-29)"
  - "Apostrophe rule: every Ukrainian noun like об'єкт / зобов'язань uses U+2019 (’) at source — verifiable via `grep -c \"об’єкт\" src/content/home.ts` returning 1"

requirements-completed: [HOME-01]

# Metrics
duration: 2m 14s
completed: 2026-04-25
---

# Phase 03 Plan 02: Home Microcopy Module Summary

**Hero gasло «Системний девелопмент, у якому цінність є результатом точних рішень.» now lives in src/content/home.ts alongside 11 other home-page microcopy strings (CTAs, headings, captions, aria-labels) — Wave 3 sections can import by name without inline Ukrainian JSX literals.**

## Performance

- **Duration:** 2m 14s
- **Started:** 2026-04-25T02:21:48Z
- **Completed:** 2026-04-25T02:24:02Z
- **Tasks:** 1
- **Files created:** 1

## Accomplishments

- Created `src/content/home.ts` with 12 named string exports — verbatim hero gasло from КОНЦЕПЦІЯ-САЙТУ.md §2 plus all CTA labels, section headings, subtitles, and captions for Phase 3 home sections.
- Closed checker Warnings 6-9 from plan 03-02 (MethodologyTeaser ⚠ aria-label, TrustBlock license/contact captions, ContactForm heading + body) — these no longer require inline JSX literals downstream.
- Preserved byte-exact typographic glyphs across the file: U+2019 (’) typographic apostrophe, U+2014 (—) em-dash, U+2197 (↗) NORTH EAST ARROW, U+00B7 (·) middle-dot. Verified via grep counters.
- Phase 2 IMPORT BOUNDARY pattern preserved: zero imports, leaf module — `tsx scripts/check-brand.ts importBoundaries` `content must not import react/motion/components/hooks/pages` PASS.
- HOME-01 content half closed; Hero.tsx in Wave 3 (Plan 03-04) is now unblocked to consume the gasло as a named import.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/content/home.ts microcopy module** - `fe14bc4` (feat)

_Note: Plan declared `tdd="true"` but content modules with zero runtime logic have nothing to unit-test. Per Plan 02-02 precedent, the TDD gate here is `npm run lint` (`tsc --noEmit`) + acceptance-criteria grep battery + brand-invariant script — all PASS. No separate RED/GREEN commit pair was warranted._

## Files Created/Modified

- `src/content/home.ts` (CREATED, 64 lines) — Home-page microcopy module: hero gasло, hero CTA, portfolio heading + subtitle, flagship external CTA, construction teaser CTA, contact CTA, methodology verification warning, license-scope note, contact note, contact heading, contact body. Pure string literals, zero imports, doc-block declares IMPORT BOUNDARY rule.

## Decisions Made

- **Single-line export form for all 12 strings.** Plan's `<verify>` regex `^export const X = ` requires `= ` (equals + space + content) on a single line. The `<action>` block in the plan template used multi-line form (`= \n  '...'`) for 4 strings, which would have produced 8/12 matches and failed the gate. Collapsed all to single-line for regex compatibility. Strings remain within readable ~100-char width.

- **Doc-block prose avoids the banned lexicon literally.** Following Plan 02-04's self-consistency fix (Decision: «values.ts / placeholders.ts doc-blocks»), the `home.ts` doc-block paraphrases the forbidden-lexicon rule (`forbidden lexicon enforced by scripts/check-brand.ts denylistTerms + plan-level grep — see brand-system.md §1`) instead of quoting «мрія», «найкращий», «унікальний», «преміальний». Keeps the file passing the plan-level grep gate that scans `src/` for those literals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Collapsed multi-line exports to single-line so plan's verify regex matches**

- **Found during:** Task 1 (after initial Write, during verification battery)
- **Issue:** Plan `<action>` template uses multi-line export form (`export const X =\n  'value';`) for `heroSlogan`, `portfolioSubtitle`, `licenseScopeNote`, `contactBody`. Plan's `<verify>` automated regex `^export const (heroSlogan|...|contactBody) = ` requires `= ` (equals + space + content) on a single line. With multi-line form the regex matches only 8/12 exports; verify count fails the «12» gate.
- **Fix:** Collapsed the 4 multi-line exports to single-line. All other content (the strings themselves, doc-comments, U+2019/U+2014/U+2197/U+00B7 glyphs) remains byte-identical to the plan's `<action>` template.
- **Files modified:** `src/content/home.ts`
- **Verification:** `grep -cE "^export const (heroSlogan|...|contactBody) = " src/content/home.ts` → `12`. `npm run lint` → exit 0. `tsx scripts/check-brand.ts` → 4/4 PASS.
- **Committed in:** `fe14bc4` (Task 1 commit — collapse happened before commit, so single atomic commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — internal contradiction in plan between `<action>` template form and `<verify>` regex)

**Impact on plan:** Zero scope creep. The 4 strings that changed line-shape are byte-identical in content. The plan's stated done criterion («12 named exports») is satisfied; the plan's stated verify regex passes; the plan's done literal «file has 12 named exports» is true. Plan-author intent preserved on every axis.

## Issues Encountered

None beyond the line-shape mismatch documented under Deviations. All 5 plan-level checks (export count, no imports, no forbidden lexicon, no Pictorial/Rubikon, U+2019 apostrophes in `об’єкт` / `зобов’язань`) PASS on first re-run after the collapse.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/content/home.ts` is ready for import by Wave 3 components (Plans 03-04 through 03-07). Each component in those plans imports the named exports it needs and renders them as text content.
- HOME-01 hero gasло source-of-truth established in TS — Plan 03-04 (Hero section) consumes `heroSlogan` and `heroCta`.
- Wave 1 (Plans 03-01 + 03-02) of Phase 3 is complete. Plan 03-03 (image pipeline) is the remaining Wave 1 plan; it has no dependency on home.ts and runs independently.
- No blockers, no carryover tech debt, no deferred items.

## Self-Check: PASSED

- File `src/content/home.ts` exists at expected path: FOUND
- Commit `fe14bc4` exists in `git log`: FOUND
- 12 named exports verified via plan regex: 12/12
- Zero `import` statements: 0
- Zero forbidden lexicon literals: 0
- Zero Pictorial/Rubikon literals: 0
- U+2019 typographic apostrophes: `об’єкт` (1), `зобов’язань` (1) — both PASS
- `npm run lint`: exit 0
- `tsx scripts/check-brand.ts`: 4/4 PASS

---
*Phase: 03-brand-primitives-home-page*
*Completed: 2026-04-25*
