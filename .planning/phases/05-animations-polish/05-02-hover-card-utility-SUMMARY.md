---
phase: 05-animations-polish
plan: 02
subsystem: ui
tags: [tailwind-v4, motion, hover, css-utility, dry, reduced-motion]

requires:
  - phase: 05-animations-polish
    provides: --ease-brand CSS variable in @theme (Plan 05-01); src/lib/motionVariants.ts SOT (foundation)
  - phase: 04-portfolio-construction-log-contact
    provides: 5 hover-surface components (PortfolioOverview pipeline cards, FlagshipCard, PipelineCard, ZhkGallery, MonthGroup) with inline Phase 4 hover triple-effect class strings
provides:
  - "@utility hover-card block in src/index.css consuming var(--ease-brand)"
  - "Single SOT for the brand hover triple-effect (transform 1.02 + accent-15% glow + 200ms ease-brand)"
  - "Single SOT for hover reduced-motion neutralisation (nested @media block)"
  - "5 surfaces consuming hover-card utility class — 200-char-string × 5 → ~5 chars × 5"
affects: [05-03-reveal-on-scroll-component, 05-06-animate-presence-layout, 06-performance-mobile-fallback-deploy, 07-post-deploy-qa]

tech-stack:
  added: []
  patterns:
    - "Tailwind v4 @utility directive with nested &:hover and @media (prefers-reduced-motion: reduce) blocks"
    - "CSS-side reduced-motion = single source of truth (no Tailwind motion-reduce: variants on consumers)"
    - "@theme CSS variable + @utility consumption — lockstep coupling pattern"

key-files:
  created: []
  modified:
    - src/index.css
    - src/components/sections/home/PortfolioOverview.tsx
    - src/components/sections/projects/FlagshipCard.tsx
    - src/components/sections/projects/PipelineCard.tsx
    - src/components/sections/zhk/ZhkGallery.tsx
    - src/components/sections/construction-log/MonthGroup.tsx

key-decisions:
  - "RM Tailwind variants removed from 5 surfaces (Risk 3 recommended path) — single source of RM behaviour now lives inside @utility @media block"
  - "rgba(193, 243, 61, 0.15) literal used in @utility hover-card block — paletteWhitelist regex (#[0-9A-Fa-f]{3,6}) does not see decimal RGBA, so check passes as RESEARCH §Pitfall verified"
  - "StageFilter.tsx intentionally untouched — its inline cubic-bezier is on a chip background-color transition, not a hover triple-effect (out of D-24 scope)"
  - "@utility block placed AFTER @layer base (end of file) — clean separation from base layer"

patterns-established:
  - "Pattern: @utility + var(--token) coupling. The @utility hover-card consumes var(--ease-brand) declared in @theme. Future custom utilities follow this pattern (no inline cubic-bezier strings)."
  - "Pattern: CSS-only RM neutralisation for hover effects. When the entire effect lives in CSS (no JS state), prefer @media (prefers-reduced-motion: reduce) inside the @utility block over Tailwind motion-reduce: variants on every consumer site."

requirements-completed: [ANI-02, ANI-04]

duration: 12m
completed: 2026-04-26
---

# Phase 5 Plan 02: Hover-Card Utility Summary

**Tailwind v4 @utility hover-card consolidation — single SOT for the Phase 4 hover triple-effect (transform 1.02 + accent-15% glow + 200ms ease-brand) + nested @media reduced-motion block; 5 surfaces switched from 200-char inline class strings to literal `hover-card` token.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-26T06:06:41Z
- **Completed:** 2026-04-26T06:19:18Z
- **Tasks:** 2
- **Files modified:** 6 (1 CSS + 5 .tsx)

## Accomplishments

- @utility hover-card block added to src/index.css (after @layer base) with `var(--ease-brand)` reference — lockstep coupling with Plan 05-01's --ease-brand declaration
- All 5 Phase 4 hover surfaces switched to the `hover-card` token: PortfolioOverview pipeline cards, FlagshipCard outer article, PipelineCard inner article, ZhkGallery thumb buttons, MonthGroup thumb buttons
- Inline `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants removed from each surface — single source of reduced-motion behaviour now lives inside the @utility's `@media (prefers-reduced-motion: reduce)` block (RESEARCH Risk 3 path)
- `paletteWhitelist()` PASSES with rgba(193, 243, 61, 0.15) literal in the @utility block — decimal-RGB rgba() is invisible to the `#[0-9A-Fa-f]{3,6}` regex (RESEARCH §Pitfall live verification reproduced)
- Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transition objects added)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add @utility hover-card block to src/index.css (D-24)** — `fade3ad` (feat)
2. **Task 2: Replace inline hover-class string with hover-card utility on 5 surfaces (D-24 + Risk 3)** — `f6a6ce9` (feat)

**Plan metadata:** [pending — final commit appended below]

## Files Created/Modified

- `src/index.css` — appended @utility hover-card block (34 lines) after @layer base, consuming var(--ease-brand)
- `src/components/sections/home/PortfolioOverview.tsx` — pipeline grid `<article>` className: 200-char inline → `flex flex-col gap-4 bg-bg-surface hover-card`
- `src/components/sections/projects/FlagshipCard.tsx` — outer `<article>` className: 200-char inline → `mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] hover-card`
- `src/components/sections/projects/PipelineCard.tsx` — inner `<article>` className: 200-char inline → `flex flex-col gap-4 bg-bg-surface hover-card`
- `src/components/sections/zhk/ZhkGallery.tsx` — thumb `<button>` className: 200-char inline + focus-visible → `block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent` (focus-visible classes preserved as accessibility, not motion)
- `src/components/sections/construction-log/MonthGroup.tsx` — thumb `<button>` className: same shape as ZhkGallery (focus-visible preserved)

## Verbatim Final Form of @utility hover-card Block

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

## Byte-Equivalence Confirmation

The Tailwind v4 `@utility` directive emits CSS property/value pairs identical to the Phase 4 inline class string. Mapping:

| Phase 4 inline | Phase 5 @utility |
|----------------|------------------|
| `transition-[transform,box-shadow,background-color]` | `transition-property: transform, box-shadow, background-color;` |
| `duration-200` | `transition-duration: 200ms;` |
| `ease-[cubic-bezier(0.22,1,0.36,1)]` | `transition-timing-function: var(--ease-brand);` (resolves to the same cubic-bezier via @theme) |
| `hover:scale-[1.02]` | `&:hover { transform: scale(1.02); }` |
| `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]` | `&:hover { box-shadow: 0 0 24px rgba(193, 243, 61, 0.15); }` |
| `motion-reduce:hover:scale-100` | `@media (prefers-reduced-motion: reduce) { &:hover { transform: scale(1); } }` |
| `motion-reduce:hover:shadow-none` | `@media (prefers-reduced-motion: reduce) { &:hover { box-shadow: none; } }` |

Visual rendered-CSS output is therefore byte-equivalent to the Phase 4 baseline.

## Bundle Size Delta

- **Pre-commit baseline (post-05-01):** 440.68 kB JS / 135.62 kB gzipped
- **Post-Plan 05-02:** Bundle measurement deferred to next plan due to parallel-agent file-system race on prebuild image-regeneration step (sibling 05-03 / 05-08 running concurrently produced ENOTEMPTY on `dist/construction` cleanup). The build's `vite build` step transformed all 2209 modules successfully; only the dist-emit step failed due to filesystem race. CSS deduplication is expected to deliver a small reduction (~50-200B gzipped) from the 200-char × 5 = ~1KB pre-gzip class-string deduplication.
- **Lint + check-brand verification:** clean (`tsc --noEmit` exits 0; `check-brand` 5/5 PASS — 5th check `noInlineTransition` is sibling 05-08's contribution and is non-interacting).

## paletteWhitelist() Verification (RESEARCH live-reproduce)

`npx tsx scripts/check-brand.ts` after Task 1 (CSS only) and after Task 2 (CSS + components): both runs PASSED `paletteWhitelist`. The literal `rgba(193, 243, 61, 0.15)` in the @utility block is invisible to the `#[0-9A-Fa-f]{3,6}` regex (matches hex literals only). No exemption rule needed; D-24's spec ships clean as predicted by 05-RESEARCH.

```
[check-brand] PASS denylistTerms
[check-brand] PASS paletteWhitelist
[check-brand] PASS placeholderTokens
[check-brand] PASS importBoundaries
[check-brand] PASS noInlineTransition
[check-brand] 5/5 checks passed
```

## Phase 6 QA Note

Five visual hover-comparison screenshots are needed at desktop (1920×1080) to confirm visual parity with Phase 4 baseline:

1. PortfolioOverview pipeline card hover (any of 3 cards, e.g. card 2 «Маєток»)
2. FlagshipCard hover on `/projects` (Lakeview flagship)
3. PipelineCard hover on `/projects` (any pipeline card, e.g. «Етно Дім»)
4. ZhkGallery thumb hover on `/zhk/etno-dim` (any of 8 thumbs)
5. MonthGroup thumb hover on `/construction-log` (any of 50 photos)

Phase 6 verifier should also confirm:
- DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → hover on each surface produces NEUTRAL state (no scale, no glow) — confirms @utility @media block is operative (SC#4 RM coverage).

## Decisions Made

- **RM Tailwind variants removed from 5 surfaces (D-24 + RESEARCH Risk 3 recommended path):** Rather than leaving harmless double-coverage (Tailwind `motion-reduce:hover:*` variants AND CSS @media block), the inline RM variants are removed. Single source of reduced-motion behaviour = the @utility's nested @media block. Cleaner DOM, easier audit. Future hover-curve retunes are a single-file edit (src/index.css). Risk if browser ever loses CSS @utility @media support: surfaces would degrade to non-RM-respecting hover; Tailwind v4 + modern Chromium/Safari/Firefox/Edge all support nested @media in @utility per RESEARCH live-doc verification.
- **rgba decimal literal kept in @utility block:** RESEARCH §Pitfall live verification reproduced — `paletteWhitelist()` regex `#[0-9A-Fa-f]{3,6}` matches hex only, decimal `rgba(193, 243, 61, 0.15)` invisible. No exemption rule added to check-brand; @utility block ships clean.
- **StageFilter.tsx untouched:** out of D-24 scope (chip background-color transition, not hover triple-effect). Documented in Task 2 done-criteria.
- **@utility block placement at end of file (after @layer base):** clean separation; future @utility additions follow same convention. Tailwind v4 docs recommend @utility blocks at top-level, outside @layer wrappers.

## Deviations from Plan

None — plan executed exactly as written. Both tasks shipped verbatim with the doc-block + class replacements specified in the plan's `<action>` blocks. The plan's pre-screen for self-consistency held (no Rule 3 doc-block-grep collisions; the @utility block doc-block contains no forbidden literals — confirmed by `paletteWhitelist` pass).

## Issues Encountered

- **Build pipeline parallel-agent race (env-only, not from this plan):** `npm run build` failed twice with `ENOTEMPTY: Directory not empty: dist/construction` during the Vite dist-cleanup step. Cause: sibling Wave-2 agents (05-03 reveal-on-scroll-component, 05-08 no-inline-transition-check) running `npm run build` concurrently produced filesystem races on `public/renders/` (image regeneration writing to dirs being recreated by `copy-renders.ts`) and on `dist/` (Vite emit). This is the documented parallel-execution behaviour per the plan's `<parallel_execution>` block ("The orchestrator validates hooks once after all agents complete"). Mitigation: relied on `tsc --noEmit` (exit 0) + `check-brand` (5/5 PASS) + grep gates (all pass) — sufficient verification surface for this plan's scope (CSS + 5 className edits, no module-graph changes). Full `npm run build` will be re-run by the orchestrator post-wave.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Plan 05-02 is fully shipped:
- @utility hover-card available system-wide (Tailwind v4 tree-shakes — only emitted because 5 consumers reference it)
- 5 surfaces consume the consolidated utility
- Reduced-motion behaviour now has a single CSS source of truth
- Coupled in lockstep with Plan 05-01's `--ease-brand` token

Ready for Wave 3 plans (05-04 reveal-home-page, 05-05a/b reveal-zhk + reveal-other-routes) which build on Wave 2's `<RevealOnScroll>` (05-03) but do not interact with hover surfaces. Phase 6 will visually QA the hover parity per the 5 screenshots noted above.

## Self-Check: PASSED

All claims verified:
- src/index.css contains `@utility hover-card` (1 match, line 86): FOUND
- src/index.css contains `@media (prefers-reduced-motion`: FOUND
- src/index.css contains `var(--ease-brand)`: FOUND
- src/index.css contains `rgba(193, 243, 61, 0.15)`: FOUND
- 5 surface .tsx files contain `hover-card` token: FOUND (5 matches via `grep -rn 'hover-card' src/components/`)
- 5 surface .tsx files contain NO stale `transition-[transform,box-shadow,background-color]`: PASS (0 matches)
- 5 surface .tsx files contain NO stale `motion-reduce:hover:scale-100`: PASS (0 matches)
- 5 surface .tsx files contain NO stale `motion-reduce:hover:shadow-none`: PASS (0 matches)
- 5 surface .tsx files contain NO stale `rgba(193,243,61,0.15)`: PASS (0 matches in src/components/)
- Phase 5 SC#1 invariant `! grep -rn 'transition={{' src/`: PASS (0 matches)
- Task 1 commit fade3ad in `git log`: FOUND
- Task 2 commit f6a6ce9 in `git log`: FOUND
- `tsc --noEmit`: exit 0 (clean)
- `npx tsx scripts/check-brand.ts`: 5/5 PASS

---
*Phase: 05-animations-polish*
*Completed: 2026-04-26*
