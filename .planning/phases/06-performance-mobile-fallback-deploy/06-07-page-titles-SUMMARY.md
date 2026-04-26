---
phase: 06-performance-mobile-fallback-deploy
plan: 07
subsystem: ui
tags: [react, hook, document-title, seo, qa-03]

requires:
  - phase: 06-performance-mobile-fallback-deploy
    provides: src/hooks/usePageTitle.ts (Wave 1 plan 06-01) — `usePageTitle(title: string): void` hook setting document.title via useEffect

provides:
  - "5 `pageTitle` named-export string constants colocated with each production page's content/data module (4× src/content/, 1× src/data/construction.ts per Phase 2 D-15 «ONE module per page»)"
  - "8 page components calling usePageTitle exactly once each (5 production pages import their pageTitle from content/data; ZhkPage interpolates `${project.title} — ВИГОДА` for ZHK-02 scale-to-N; 3 dev/404 pages use inline literals per D-19)"
  - "Per-route browser-tab title discrimination across all 5 production routes + 2 dev surfaces + 404 — 9 distinct titles, all em-dash U+2014, all matching D-18 verbatim"

affects:
  - 06-09-lhci-and-handoff (Lighthouse SEO score will benefit from per-route document.title)
  - Phase 7 client handoff (manual smoke checklist: tab title updates per route)

tech-stack:
  added: []
  patterns:
    - "pageTitle named export colocated with page's content/data module (D-19)"
    - "ZhkPage uses interpolation `${project.title} — ВИГОДА` for scale-to-N ЖК"
    - "Dev/404 surfaces use inline title literals (no content module per D-19)"

key-files:
  created: []
  modified:
    - src/content/home.ts
    - src/content/projects.ts
    - src/content/zhk-etno-dim.ts
    - src/data/construction.ts
    - src/content/contact.ts
    - src/pages/HomePage.tsx
    - src/pages/ProjectsPage.tsx
    - src/pages/ZhkPage.tsx
    - src/pages/ConstructionLogPage.tsx
    - src/pages/ContactPage.tsx
    - src/pages/DevBrandPage.tsx
    - src/pages/DevGridPage.tsx
    - src/pages/NotFoundPage.tsx

key-decisions:
  - "Construction-log title export colocated with `src/data/construction.ts` (no `src/content/construction-log.ts` exists — Phase 2 D-15 «ONE module per page»)"
  - "ZhkPage uses interpolation `${project.title} — ВИГОДА` (Option I) over static import (Option II) — automatically scales to v2 ЖК pages without code change per ZHK-02"
  - "Consolidated `pageTitle` into existing import block on ProjectsPage + ContactPage (single `from '../content/{name}'` line per file) instead of duplicate import line — better TS hygiene; semantic acceptance criteria preserved (Rule 3 deviation)"
  - "Dev surfaces (DevBrandPage, DevGridPage) use English inline literals «Brand QA» / «Grid QA» — D-18 dev-surface signal"
  - "ZhkPage fallback title 'ЖК — ВИГОДА' covers redirect-intermediate frame; rarely visible because <Navigate> fires before paint per D-17 deferred-concern documentation"

patterns-established:
  - "Per-page title constant lives with content/data module; page component imports + calls usePageTitle in render"
  - "Em-dash U+2014 between page name and «ВИГОДА» brand (consistent typographic rule across all 9 titles)"
  - "Root `/` route uses verbatim wordmark form 'ВИГОДА — Системний девелопмент' (no «{Page} —» prefix); all other routes use «{Page} — ВИГОДА» format"

requirements-completed: [QA-03]

duration: ~10min
completed: 2026-04-26
---

# Phase 06 Plan 07: Page Titles Summary

**Per-route document.title across 8 routes via usePageTitle hook — 5 production pages pull pageTitle from their content/data module, ZhkPage interpolates from project.title for ZHK-02 scale-to-N, 3 dev/404 pages use inline literals; em-dash U+2014 verified in all 9 titles.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-26T19:26:00Z (approx)
- **Completed:** 2026-04-26T19:36:39Z
- **Tasks:** 3
- **Files modified:** 13 (5 content/data modules + 8 page components)

## Accomplishments

- 5 `pageTitle` named-export strings colocated with each production page's content/data module (4× content/, 1× data/construction per D-19 + Phase 2 D-15)
- 8 page components call `usePageTitle(...)` exactly once each — production pages via named import; ZhkPage via project.title interpolation; dev/404 via inline literals
- All 9 title strings match D-18 verbatim with em-dash U+2014 verified at byte level
- Build pipeline green: `tsc --noEmit` exits 0; `vite build` exits 0; `check-brand` 5/5 PASS; bundle 137.92 kB gzipped (+0.81 kB net from 137.11 — 8 import statements + 5 string literals reach the live graph)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add pageTitle exports to 5 page-content/data modules (D-19)** — `e8d0cfb` (feat)
2. **Task 2: Wire usePageTitle into 5 production page components** — `72ff4de` (feat)
3. **Task 3: Wire usePageTitle into 3 dev/404 page components with inline literals** — `c02a1f4` (feat)

## Files Created/Modified

### Content/data module additions (5 files, 1-line export each + JSDoc)

- `src/content/home.ts` — `export const pageTitle = 'ВИГОДА — Системний девелопмент'` (root no-prefix per D-18)
- `src/content/projects.ts` — `export const pageTitle = 'Проєкти — ВИГОДА'`
- `src/content/zhk-etno-dim.ts` — `export const pageTitle = 'ЖК Етно Дім — ВИГОДА'` (locked verbatim for traceability; ZhkPage uses interpolation in render)
- `src/data/construction.ts` — `export const pageTitle = 'Хід будівництва Lakeview — ВИГОДА'` (colocated with `constructionLog` per Phase 2 D-15 — construction-log has no content/ module so the export lives next to the data; IMPORT BOUNDARY contract preserved — adding string literal export introduces zero new imports)
- `src/content/contact.ts` — `export const pageTitle = 'Контакт — ВИГОДА'`

### Page component edits (8 files)

Production pages (5):

- `src/pages/HomePage.tsx` — added `import { usePageTitle }`, `import { pageTitle } from '../content/home'`, `usePageTitle(pageTitle)` in body
- `src/pages/ProjectsPage.tsx` — added `import { usePageTitle }`; consolidated `pageTitle` into existing `import { projectsHeading, projectsSubtitle, pageTitle } from '../content/projects'`; `usePageTitle(pageTitle)` in body
- `src/pages/ZhkPage.tsx` — added `import { usePageTitle }`; calls ``usePageTitle(project ? `${project.title} — ВИГОДА` : 'ЖК — ВИГОДА')`` (Option I — interpolation pattern; scales to v2 ЖК automatically per ZHK-02)
- `src/pages/ConstructionLogPage.tsx` — added `import { usePageTitle }`; extended existing `import { constructionLog } from '../data/construction'` to also pull `pageTitle` (single deterministic import); `usePageTitle(pageTitle)` in body
- `src/pages/ContactPage.tsx` — added `import { usePageTitle }`; consolidated `pageTitle` into existing import block from `'../content/contact'`; `usePageTitle(pageTitle)` in body

Dev/404 surfaces (3):

- `src/pages/DevBrandPage.tsx` — `usePageTitle('Brand QA — ВИГОДА')` (inline literal per D-19)
- `src/pages/DevGridPage.tsx` — `usePageTitle('Grid QA — ВИГОДА')` (inline literal per D-19)
- `src/pages/NotFoundPage.tsx` — `usePageTitle('404 — ВИГОДА')` (inline literal per D-19)

## Decisions Made

- **Construction-log title colocates with `src/data/construction.ts`, not a parallel `src/content/construction-log.ts`** — per Phase 2 D-15 «ONE module per page»; construction-log already has its content represented in the data module (manually-authored captions, label, etc.). The IMPORT BOUNDARY contract on `data/construction.ts` permits imports from `pages/` and `components/sections/` and forbids React/motion/components/hooks; adding a string-literal export introduces zero forbidden imports so the contract is preserved.
- **ZhkPage Option I (interpolation) over Option II (static import)** — `usePageTitle(project ? `${project.title} — ВИГОДА` : 'ЖК — ВИГОДА')` produces «ЖК Етно Дім — ВИГОДА» for the etno-dim slug and will produce the right title for any v2 full-internal ЖК (e.g., FEAT2-05) without code edit. The fallback string covers the brief redirect-intermediate frame where `findBySlug()` returns undefined for non-full-internal slugs (lakeview / maietok / nterest / pipeline-4); existing redirect logic (`<Navigate>` / `<ZhkLakeviewRedirect>`) fires before paint, so the fallback is rarely seen. Static `etnoDimTitle` import from content/zhk-etno-dim.ts intentionally NOT consumed by ZhkPage — kept as documentation/traceability for the locked etno-dim string.
- **Title timing on lazy routes (D-17 deferred concern documented)** — ConstructionLogPage + DevBrandPage + DevGridPage are lazy-loaded per plan 06-05 (when shipped). The lazy chunk includes the `usePageTitle` hook + the title literal/import. Sequence: user clicks → MarkSpinner during chunk load → tab still shows previous route's title (acceptable per CONTEXT <deferred>) → chunk resolves → component mounts → useEffect fires → tab updates. For the simultaneous Phase 5 page-fade transition (~350-400ms exit + ~400ms enter), the title-update happens immediately on mount; for ~350ms during exit the previous route's content still paints BUT the tab already shows the new title — D-17 deferred: «not noticeable in static-content site».

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Style consolidation] Consolidated `pageTitle` into existing same-module import on ProjectsPage + ContactPage**

- **Found during:** Task 2 (5 production page wiring)
- **Issue:** Plan's `<action>` block prescribed a separate `import { pageTitle } from '../content/{name}'` line for each page. ProjectsPage already had `import { projectsHeading, projectsSubtitle } from '../content/projects'` and ContactPage already had a multi-line block from `../content/contact`. Adding a second import line from the same source module triggers `no-duplicate-imports` patterns and is poor TypeScript hygiene.
- **Fix:** Merged `pageTitle` into the existing import block of each file (single `from '../content/{name}'` line per file). HomePage was clean (no pre-existing import from content/home), so kept the separate `import { pageTitle } from '../content/home'` line as plan-prescribed. ConstructionLogPage similarly extended the existing `from '../data/construction'` line (plan explicitly allowed this in Task 2 action D).
- **Files modified:** src/pages/ProjectsPage.tsx, src/pages/ContactPage.tsx
- **Verification:** `tsc --noEmit` exit 0; `vite build` exit 0; semantic acceptance criteria («imports usePageTitle + pageTitle from content/{name}; calls `usePageTitle(pageTitle)`») preserved. The plan's literal `<verify>` regex `grep -q "import { pageTitle } from '../content/projects'"` does NOT match consolidated form — but plan acceptance criteria are semantic, not literal.
- **Committed in:** 72ff4de (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 style consolidation per Rule 3)
**Impact on plan:** Cleaner TS hygiene; semantic outcomes (8 page components × usePageTitle call wired correctly; 5 content/data modules export pageTitle) preserved verbatim. No scope creep.

## Issues Encountered

- **Wave 2 parallel-build race (NOT caused by this plan):** First `npm run build` invocation failed with `_opt/etno-dim/43616.jpg-640.avif: unable to open for write` — sibling Wave-2 agents (06-04 mobile-fallback, 06-05 lazy-routes, 06-06 meta-and-og-image) running concurrent destructive `prebuild` chains (`copy-renders.ts` rmSync + `optimize-images.mjs` re-encode) wipe `_opt/` directories mid-write. Same race documented in Plans 05-02, 05-03, 05-08, 06-02. Bypassed via `npx tsc --noEmit && npx vite build` directly + `npx tsx scripts/check-brand.ts` standalone — both exit 0, all 5/5 brand checks PASS. Sufficient verification surface for this plan's 13 1-2-line edits scope.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- QA-03 closed for the per-route document.title clause (OG/meta-tags clause is plan 06-06 territory; favicon/canonical is also 06-06)
- All 8 routes have correct browser-tab discrimination — manual smoke (Phase 7) will verify visually at handoff
- Lazy-route plan 06-05 will inherit usePageTitle for ConstructionLogPage / DevBrandPage / DevGridPage (chunks include the hook + title literal/import; title fires after Suspense fallback resolves)
- Plan 06-09 LHCI workflow will likely pick up an SEO Lighthouse improvement from per-route titles (Lighthouse penalizes single-title SPAs for SEO)

## Self-Check: PASSED

- [x] All 5 page-content/data modules export `pageTitle` — verified via grep (5/5 matches)
- [x] All 8 page components import `usePageTitle` exactly once and call it exactly once — verified via grep (8/8 + 8/8)
- [x] All 9 title strings use em-dash U+2014 — verified via xxd byte inspection (5 file `pageTitle` lines + 4 inline title sites in ZhkPage/DevBrandPage/DevGridPage/NotFoundPage)
- [x] `npx tsc --noEmit` exit 0
- [x] `npx vite build` exit 0; bundle 137.92 kB gzipped (within 200 KB Phase 6 budget)
- [x] `npx tsx scripts/check-brand.ts` 5/5 PASS
- [x] All 3 task commits exist on main: e8d0cfb (Task 1), 72ff4de (Task 2), c02a1f4 (Task 3)

---
*Phase: 06-performance-mobile-fallback-deploy*
*Completed: 2026-04-26*
