---
phase: 03-brand-primitives-home-page
plan: 5
subsystem: ui
tags: [react-19, tailwind-v4, brand-values, portfolio, lcp, avif, isometric-cube, derived-views, content-boundary, responsive-picture]

requires:
  - phase: 02-data-layer-content
    provides: src/data/projects.ts derived views (flagship, pipelineGridProjects, aggregateProjects) — Plan 02-02
  - phase: 02-data-layer-content
    provides: src/content/values.ts brandValues (4 entries) — Plan 02-04
  - phase: 03-brand-primitives-home-page
    provides: src/content/home.ts microcopy (portfolioHeading, portfolioSubtitle, flagshipExternalCta) — Plan 03-02
  - phase: 03-brand-primitives-home-page
    provides: src/components/brand/IsometricCube.tsx (variant='single' for aggregate row marker) — Plan 03-01
  - phase: 03-brand-primitives-home-page
    provides: src/components/ui/ResponsivePicture.tsx (AVIF/WebP/JPG fallback, srcset composition via assetUrl) — Plan 03-03
  - phase: 03-brand-primitives-home-page
    provides: index.html AVIF aerial-1920 preload directive (Plan 03-04 — race target consumed by flagship card)

provides:
  - src/components/sections/home/BrandEssence.tsx (~43 lines; named export BrandEssence)
  - src/components/sections/home/PortfolioOverview.tsx (~128 lines; named export PortfolioOverview)
  - HOME-02 closure: 4 numbered value cards (01–04) reading brandValues from content/values.ts
  - HOME-03 closure: flagship card (LCP target) + 3-in-row pipeline grid + Pipeline-4 aggregate row
  - LCP wiring: flagship ResponsivePicture loading="eager" fetchPriority="high" + explicit width=1280 height=720 (16:9 CLS-safe; consumes Plan 03-04 AVIF preload)
  - First production consumer of <IsometricCube variant="single"> in the home page (D-16 + cube-ladder D-10)

affects:
  - phase 03-08-compose-and-dev-route — HomePage.tsx imports BrandEssence + PortfolioOverview as 2nd and 3rd sections after Hero (D-17)
  - phase 04-portfolio-zhk-log-contact — /projects HUB-02 reuses the flagship-card pattern; HUB-03/HUB-04 reuse pipeline grid + aggregate row patterns
  - phase 04-portfolio-zhk-log-contact — IsometricCube variant='single' reused for «Здано (0)» empty-state marker (cube-ladder D-10)
  - phase 05-animations-polish — ANI-02 wraps both sections with <RevealOnScroll>; ANI-03 adds pipeline card hover states (sections ship hover-free in Phase 3)
  - phase 06-performance-mobile-deploy — Lighthouse LCP test exercises flagship ResponsivePicture sizes attribute; the (min-width:1280px) 768px hint should drive 1280-width AVIF (~196 KB) selection on typical desktop viewports

tech-stack:
  added: []
  patterns:
    - "Numbered-card layout: 2×2 grid with String(i+1).padStart(2,'0') prefix derived from data index — applies the brandbook §5 «3 ступені складності» numbered-ladder echo on the home brand-essence surface"
    - "Side-by-side flagship card: lg:grid-cols-[3fr_2fr] (60/40 split at lg breakpoint) — image left, text right; overlay variant rejected per RESEARCH Open Question 8 (architectural CGI competes with text overlays)"
    - "Pipeline grid: lg:grid-cols-3 with aspect-[4/3] images — keeps mixed-resolution renders (.jpg / .jpg.webp / .png.webp) visually consistent via cropped aspect ratio"
    - "Aggregate row visual: border-t separator + IsometricCube marker + aggregateText — reads as summary row, not as another project card (D-16)"
    - "Derived-view consumption: components import flagship/pipelineGridProjects/aggregateProjects, never filter projects[] directly — adding ЖК #6 = append one record, no component touch (Phase 2 D-04 / ZHK-02 scale-to-N invariant)"
    - "Content-boundary discipline: all UA copy >40 chars (heading, subtitle, external CTA label, value bodies) imported from src/content/*.ts; no inline JSX literals (D-29). External-link CTA exempt per microcopy rule but still moved to home.ts for one-edit propagation."
    - "ResponsivePicture call-site discipline: flagship eager+high+explicit-w/h; pipeline lazy with smaller widths; never embeds raw render-tree paths — picture component composes URLs internally via assetUrl()"
    - "Self-consistency doc-block rephrasing: replaced literal 'Lakeview' / 'Етно Дім' / 'Маєток' / 'NTEREST' / 'lucide-react' / 'IsometricCube' / 'transition={{' substrings with paraphrases so files do not trip their own plan grep gates (same Rule 3 fix as Plans 02-04 / 03-03 / 03-04)"

key-files:
  created:
    - src/components/sections/home/BrandEssence.tsx
    - src/components/sections/home/PortfolioOverview.tsx
  modified: []

key-decisions:
  - "BrandEssence layout = 2×2 numbered (01–04) per RESEARCH Open Question 1 recommendation. body strings 150–200 chars are too dense for 4-in-row at 280px column width; 2×2 at ~600px gives breathing room. Numbered prefix derived from index (String(i+1).padStart(2,'0')) — no data-shape edit required to brandValues type."
  - "PortfolioOverview flagship layout = side-by-side (lg:grid-cols-[3fr_2fr], image left 60% / text right 40%) per RESEARCH Open Question 8 + CONTEXT.md §Specifics. Overlay variant rejected: dark-gradient masks on architectural CGI tend to murk render legibility."
  - "Flagship sizes='(min-width: 1280px) 768px, 100vw' — derived from the 60% column at 1280-container = ~768px. Picks the 1280w srcset entry on desktop with retina headroom (the 1920w variant is for 2× DPR edge cases; aerial-1920.avif is 388 KB and exceeds the 200 KB hero budget per Plan 03-03 risk note, so the 1280w entry at ~196 KB is the actual LCP target on typical viewports)."
  - "Explicit width={1280} height={720} on flagship ResponsivePicture (16:9) — closes plan checker Blocker 4. Documents the AVIF/WebP/JPG triple's intrinsic-ratio contract on-screen; prevents CLS at hydration."
  - "External CTA = a target='_blank' rel='noopener' — avoid noreferrer per D-14 (we WANT the Referer header on the cross-property navigation so Lakeview's analytics can attribute the traffic source). noopener alone defeats the tabnabbing vector without breaking referrer signal."
  - "Doc-block self-consistency fix (deviation Rule 3 — blocking): both files initially shipped doc-blocks containing the literal substrings their own plan grep gates forbid (BrandEssence: 'lucide-react' / 'IsometricCube'; PortfolioOverview: 'Lakeview' / 'Етно Дім' / 'Маєток' / 'NTEREST' / 'transition={{' / quoted '/renders/'). Rephrased to describe the policy without including the regex-bait literals. Same precedent as Plans 02-04 (placeholders.ts/values.ts), 03-03 (ResponsivePicture.tsx), 03-04 (Hero.tsx). Pattern to keep: source text must be self-consistent under its own CI/grep rules."
  - "IsometricCube variant='single' attribute formatted on same line as opening tag (single-line `<IsometricCube variant=\"single\"`) so the plan's verification regex matches. Multi-line attribute layout is JSX-equivalent but trips the strict regex; readability cost is negligible at 4 attributes."

patterns-established:
  - "Section-file naming pattern continued: src/components/sections/home/{SectionName}.tsx — Hero.tsx (Plan 03-04) + BrandEssence.tsx + PortfolioOverview.tsx (this plan); Plans 03-06/07 add ConstructionTeaser/MethodologyTeaser/TrustBlock/ContactForm under same path"
  - "Content-boundary precedent extended: heading + subtitle + external-CTA label moved to src/content/home.ts even though the external-CTA arrow ↗ is microcopy-eligible per D-20 — preference for one-edit propagation over inline tactical literals when the string carries content semantics"
  - "Derived-view-only consumption proven on second surface: pipelineGridProjects + aggregateProjects + flagship all read as named imports; zero `.filter(p => p.presentation === ...)` calls in component code"

requirements-completed: [HOME-02, HOME-03]

# Metrics
duration: 6min
completed: 2026-04-25
---

# Phase 3 Plan 05: Essence + Portfolio Summary

**Two above-fold home sections — BrandEssence (4 numbered value cards from brandValues) + PortfolioOverview (flagship card with LCP-eager AVIF + 3-in-row pipeline grid + Pipeline-4 aggregate row marked by IsometricCube single variant).**

## Performance

- **Duration:** ~6 min (359 s)
- **Started:** 2026-04-25T06:52:12Z
- **Completed:** 2026-04-25T06:58:11Z
- **Tasks:** 2
- **Files modified:** 2 (2 created, 0 modified)

## Accomplishments

- **HOME-02 closed:** BrandEssence renders 4 numbered cards (01–04) reading from `src/content/values.ts` (no inline UA literals). 2×2 layout per RESEARCH Open Question 1.
- **HOME-03 closed:** PortfolioOverview composes flagship card (Lakeview-source, side-by-side at lg) + 3-card pipeline grid (Етно Дім / Маєток / NTEREST sorted by `order`) + aggregate row with IsometricCube single-variant marker for Pipeline-4.
- **LCP wiring complete:** flagship `<ResponsivePicture>` ships `loading="eager"`, `fetchPriority="high"`, explicit `width={1280} height={720}` — consumes the AVIF aerial-1920 preload directive landed by Plan 03-04. The race from HTML-parse-time preload → React-render-time `<picture>` consume is now end-to-end wired.
- **VIS-03 partially exercised in production:** first home consumer of `<IsometricCube variant="single">` (the aggregate row state-marker; Phase 4 will reuse for «Здано (0)» empty-state per cube-ladder D-10).
- **Derived-view discipline preserved:** zero `.filter(...)` calls on `projects[]` in component code; all consumption goes through `flagship` / `pipelineGridProjects` / `aggregateProjects` named imports — confirms ZHK-02 scale-to-N invariant on a second surface.

## Task Commits

Each task was committed atomically:

1. **Task 1: BrandEssence section (HOME-02)** — `dc7487e` (feat)
2. **Task 2: PortfolioOverview section (HOME-03)** — `998cdf6` (feat)

**Plan metadata:** _to be added by final commit_ (docs: complete 03-05 plan)

## Files Created/Modified

- `src/components/sections/home/BrandEssence.tsx` (43 lines) — 2×2 grid of 4 numbered value cards from `brandValues`; no decorative icons or cubes (D-11); body uses `text-text-muted` on `text-base` (16px) to stay above ≥14pt WCAG AA threshold for `#A7AFBC` on `#2F3640` (5.3:1 AA per brand-system §3).
- `src/components/sections/home/PortfolioOverview.tsx` (128 lines) — section heading + subtitle from `home.ts`; flagship card with eager+high LCP-targeted ResponsivePicture; 3-in-row pipeline grid with lazy ResponsivePicture per card; aggregate row with `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4}>` marker.

## Decisions Made

1. **BrandEssence layout = 2×2 numbered (01–04)** per RESEARCH Open Question 1 recommendation. Body text 150–200 chars at 4-in-row would crowd at 280px column; 2×2 at ~600px column is the readability win. Numbered prefix derived from data index, no `brandValues` type edit.
2. **PortfolioOverview flagship = side-by-side at lg (3fr/2fr)** per RESEARCH Open Question 8. Overlay variant rejected: dark-gradient masks on architectural CGI degrade render legibility.
3. **Flagship `sizes="(min-width: 1280px) 768px, 100vw"`** — picks the 1280w srcset entry (~196 KB AVIF) on typical desktop, NOT the 1920w (388 KB exceeds budget per Plan 03-03 risk). The 1920w stays available for 2× DPR edge cases.
4. **Explicit `width={1280} height={720}` on flagship** — closes plan checker Blocker 4. CLS-safe at hydration; documents the 16:9 contract for the AVIF/WebP/JPG triple.
5. **External CTA `target="_blank" rel="noopener"`** (NOT `noreferrer`) — preserves the Referer header so Lakeview can attribute cross-property traffic; `noopener` alone defeats tabnabbing.
6. **Single-line `<IsometricCube variant="single"` opening tag** — multi-line attributes are JSX-equivalent but trip the plan's strict regex; single-line keeps the verification gate green.
7. **Self-consistency doc-block rephrasing** — both files' module doc-blocks initially contained their own forbidden-literal grep targets; rephrased without losing semantic intent. Recurring pattern (4th occurrence in this codebase: 02-04, 03-03, 03-04, 03-05) — should be folded into the planner template guidance for future phases.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] BrandEssence doc-block self-consistency**
- **Found during:** Task 1 verify gate
- **Issue:** Module-level comment contained literal substrings `lucide-react` and `<IsometricCube>` describing what the file MUST NOT contain — the file's own plan grep gate `! grep -nE "lucide-react|IsometricCube"` flagged it.
- **Fix:** Rephrased comment to describe the policy without embedding the regex-bait substrings: «no decorative icons (brand-system.md §7) and no cube primitives in this section per D-11».
- **Files modified:** `src/components/sections/home/BrandEssence.tsx` (doc-block lines 9–13)
- **Verification:** `grep -nE "lucide-react|IsometricCube" src/components/sections/home/BrandEssence.tsx` → 0 matches
- **Committed in:** `dc7487e` (Task 1 commit)

**2. [Rule 3 - Blocking] PortfolioOverview doc-block self-consistency**
- **Found during:** Task 2 verify gate
- **Issue:** Module-level comment contained literal substrings `Lakeview`, `Etno Dim`, `Maietok`, `NTEREST` describing the inputs — but the file's own plan grep gate `! grep -nE "Lakeview|Етно|Маєток|NTEREST"` (Test 15) flagged ASCII «Lakeview» in the doc.
- **Fix:** Rephrased the doc-block to use generic descriptors: «flagship card (full-width hero, aerial.jpg as LCP target) + 3-in-row pipeline grid (the 3 grid-presentation projects)» — semantically identical, no regex-bait substrings.
- **Files modified:** `src/components/sections/home/PortfolioOverview.tsx` (doc-block lines 4–6, comment line 57)
- **Verification:** `grep -nE "Lakeview|Етно|Маєток|NTEREST" src/components/sections/home/PortfolioOverview.tsx` → 0 matches
- **Committed in:** `998cdf6` (Task 2 commit)

**3. [Rule 3 - Blocking] PortfolioOverview IsometricCube attribute formatting**
- **Found during:** Task 2 verify gate
- **Issue:** Plan's `<action>` showed `<IsometricCube\n              variant="single"\n              ...`. The plan's verify regex `<IsometricCube variant="single"` is single-line; multi-line layout returned 0 matches.
- **Fix:** Moved `variant="single"` onto the same line as the opening tag (`<IsometricCube variant="single"\n  stroke="#A7AFBC"\n  ...`). JSX-equivalent at runtime; readability cost negligible at 4 attributes.
- **Files modified:** `src/components/sections/home/PortfolioOverview.tsx` (line 117 of file at task end)
- **Verification:** `grep -cE '<IsometricCube variant="single"' ...` → 1 match
- **Committed in:** `998cdf6` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking — all Rule 3 self-consistency / regex-bait / attribute-format)
**Impact on plan:** All three fixes are mechanical alignments between source text and the plan's own grep-gate regexes. Zero semantic change to component behavior; zero scope creep. The recurring self-consistency pattern (4th occurrence in this codebase) is a planner-template smell — future plans should pre-screen `<action>` doc-blocks against their own `<verify>` regexes before issuing the plan.

## Issues Encountered

- None blocking. The 3 deviations above were caught at the task-level verify gate and fixed inline within the same task commit.

## Self-Check

- [x] `src/components/sections/home/BrandEssence.tsx` exists (verified `test -f`)
- [x] `src/components/sections/home/PortfolioOverview.tsx` exists (verified `test -f`)
- [x] `dc7487e` exists in git log (Task 1: BrandEssence)
- [x] `998cdf6` exists in git log (Task 2: PortfolioOverview)
- [x] `npm run lint` exits 0 (verified after each task)
- [x] `npm run build` exits 0 — full pipeline including postbuild check-brand 4/4 PASS (verified after Task 2)
- [x] Bundle 242.85 kB JS / 76.85 kB gzipped — within 200 KB-gzipped budget
- [x] No raw `'/renders/` or `"/renders/` literals in either component (verified via importBoundaries check)
- [x] No `transition={{` literals in either component (Phase 5 boundary preserved)

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- HOME-02 + HOME-03 closed; first 3 home sections (Hero + BrandEssence + PortfolioOverview) ready for HomePage composition in Plan 03-08.
- Plan 03-06 (construction-methodology) is unblocked — does not share files with this plan; can run in parallel with the rest of Wave 4.
- Plan 03-07 (trust-contact) likewise unblocked.
- Phase 6 LCP gate is now end-to-end testable: index.html preload (Plan 03-04) → flagship ResponsivePicture eager+high consume (this plan). Phase 6 should verify aerial-1280.avif (~196 KB) is what the browser actually picks at 1920×1080 viewport via DevTools Network panel and Lighthouse LCP element trace.

---
*Phase: 03-brand-primitives-home-page*
*Completed: 2026-04-25*
