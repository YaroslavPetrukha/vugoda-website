---
phase: 01-foundation-shell
plan: 04
subsystem: ui
tags: [react-router-dom, hashrouter, react, vite, tailwind, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: package.json with react-router-dom v7, vite.config.ts with base /vugoda-website/
  - phase: 01-02
    provides: src/main.tsx entry point, index.css tokens (text-text, text-accent, bg-bg, bg-surface)
  - phase: 01-03
    provides: Nav, Footer, Logo, MinimalCube components
provides:
  - HashRouter + Routes + Layout-wrapped outlet wired in src/App.tsx
  - ScrollToTop helper (pathname-keyed, renders null)
  - Layout component (Nav + ScrollToTop + main>Outlet + Footer)
  - 6 page stubs: HomePage, ProjectsPage, ZhkPage, ConstructionLogPage, ContactPage, NotFoundPage
  - 404 catch-all route with link back to home
  - Full end-to-end TypeScript compile + Vite build (tsc --noEmit + vite build exit 0)
affects:
  - phase 02 (data layer): page stubs receive real data
  - phase 03 (brand primitives + home page): HomePage replaced with full hero
  - phase 05 (animations): Layout's <main><Outlet/> wrapped with AnimatePresence

# Tech tracking
tech-stack:
  added: []
  patterns:
    - HashRouter with nested <Route element={<Layout/>}> + child routes — every route inherits Nav+Footer
    - Page stub pattern: default export function + section flex-1 items-center + H1 text-6xl font-bold + MinimalCube
    - ScrollToTop as side-effect-only component (returns null, depends on pathname)

key-files:
  created:
    - src/App.tsx
    - src/components/layout/ScrollToTop.tsx
    - src/components/layout/Layout.tsx
    - src/pages/HomePage.tsx
    - src/pages/ProjectsPage.tsx
    - src/pages/ZhkPage.tsx
    - src/pages/ConstructionLogPage.tsx
    - src/pages/ContactPage.tsx
    - src/pages/NotFoundPage.tsx
  modified:
    - tsconfig.node.json (removed noEmit incompatible with composite)
    - src/components/layout/Footer.tsx (replaced removed lucide-react v1 icons)

key-decisions:
  - "HashRouter per DEP-03: no basename needed, hash handles base path, no 404.html shim required"
  - "Nested Route pattern: <Route element={<Layout/>}> wraps all child routes, Nav+Footer on every route"
  - "ZhkPage slug-agnostic in Phase 1 per D-12: no useParams, Phase 4 adds findBySlug resolution"
  - "NotFoundPage: literal H1 + Link to / only — brand-tone subdued, no bounce animation (Phase 5 scope)"
  - "Page stubs use flex-1 on section to push Footer to bottom via parent flex-col chain"

patterns-established:
  - "Page stub: default export + section flex-1 flex-col items-center justify-center + H1 text-6xl font-bold text-text + MinimalCube h-32 w-32"
  - "Layout wrapper: div flex min-h-screen flex-col bg-bg > ScrollToTop + Nav + main flex flex-1 flex-col > Outlet + Footer"

requirements-completed: [NAV-01, DEP-03]

# Metrics
duration: 4min
completed: 2026-04-24
---

# Phase 01 Plan 04: Router + Pages Wiring Summary

**HashRouter + nested Layout wrapping + 6 page stubs wired in App.tsx — NAV-01 and DEP-03 fully satisfied at runtime, with first end-to-end tsc + vite build passing (80KB gzipped JS bundle)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-24T16:13:21Z
- **Completed:** 2026-04-24T16:17:29Z
- **Tasks:** 3
- **Files modified:** 11 (9 created, 2 modified)

## Accomplishments

- HashRouter + Routes + Layout wrapping in App.tsx — every route now shows Nav + Footer (NAV-01 satisfied)
- 6 page stubs (Home/Projects/Zhk/ConstructionLog/Contact/NotFound) with correct D-11 titles, brand tokens, MinimalCube anchors
- First successful end-to-end build: `tsc --noEmit` + `vite build` exit 0 — 80.66 KB gzipped JS; dev server confirmed at localhost:5173/vugoda-website/

## Route Table

| URL hash | Component | H1 |
|---|---|---|
| `/#/` | HomePage | ВИГОДА |
| `/#/projects` | ProjectsPage | Проєкти |
| `/#/zhk/:slug` | ZhkPage | ЖК |
| `/#/construction-log` | ConstructionLogPage | Хід будівництва |
| `/#/contact` | ContactPage | Контакт |
| `/#/*` | NotFoundPage | 404 — сторінку не знайдено |

## Import Graph

```
App.tsx
  └── HashRouter (react-router-dom)
  └── Layout (components/layout/Layout.tsx)
        ├── Nav (components/layout/Nav.tsx)
        ├── ScrollToTop (components/layout/ScrollToTop.tsx)
        ├── Outlet (react-router-dom)
        └── Footer (components/layout/Footer.tsx)
  └── HomePage, ProjectsPage, ZhkPage, ConstructionLogPage, ContactPage, NotFoundPage
        └── MinimalCube (components/brand/MinimalCube.tsx)
  └── NotFoundPage (also imports Link from react-router-dom)
```

## Task Commits

1. **Task 1: ScrollToTop helper + Layout wrapper** - `6360ffc` (feat)
2. **Task 2: 6 page stubs** - `928ddc5` (feat)
3. **Task 3: App.tsx + build verification** - `aa8060e` (feat)

**Plan metadata:** TBD (docs commit)

## Files Created/Modified

- `src/App.tsx` - HashRouter + Routes + Layout nested routes, 5 routes + 404 catch-all
- `src/components/layout/ScrollToTop.tsx` - useEffect on pathname → window.scrollTo(0,0), renders null
- `src/components/layout/Layout.tsx` - flex-col shell: Nav + ScrollToTop + main>Outlet + Footer
- `src/pages/HomePage.tsx` - stub: H1 «ВИГОДА» + MinimalCube
- `src/pages/ProjectsPage.tsx` - stub: H1 «Проєкти» + MinimalCube
- `src/pages/ZhkPage.tsx` - stub: H1 «ЖК» + MinimalCube (slug-agnostic per D-12)
- `src/pages/ConstructionLogPage.tsx` - stub: H1 «Хід будівництва» + MinimalCube
- `src/pages/ContactPage.tsx` - stub: H1 «Контакт» + MinimalCube
- `src/pages/NotFoundPage.tsx` - stub: H1 «404 — сторінку не знайдено» + MinimalCube + Link home
- `tsconfig.node.json` - removed `noEmit: true` (incompatible with `composite: true`)
- `src/components/layout/Footer.tsx` - replaced removed lucide-react v1 icons

## Decisions Made

- HashRouter per DEP-03: no `basename` needed, hash handles base path via `location.hash`
- Nested `<Route element={<Layout/>}>` pattern: all child routes inherit Nav + Footer
- ZhkPage slug-agnostic in Phase 1 (D-12): `useParams` deferred to Phase 4
- Page stubs use `flex-1` on `<section>` to push Footer to bottom via parent `flex-col` chain

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] tsconfig.node.json: noEmit incompatible with composite**
- **Found during:** Task 3 (npm run build)
- **Issue:** TypeScript error TS6310 — referenced project `tsconfig.node.json` has `noEmit: true` but `composite: true` requires emit capability
- **Fix:** Removed `"noEmit": true` from tsconfig.node.json (root tsconfig.json keeps it; the node sub-project only needs `composite`)
- **Files modified:** `tsconfig.node.json`
- **Verification:** `npm run build` exits 0 after fix
- **Committed in:** `aa8060e` (Task 3 commit)

**2. [Rule 1 - Bug] Footer.tsx: Instagram and Facebook icons removed in lucide-react v1**
- **Found during:** Task 3 (npm run build, tsc --noEmit)
- **Issue:** lucide-react v1.11.0 removed brand-specific social icons (Instagram, Facebook); TypeScript reported TS2305 export not found
- **Fix:** Replaced `Instagram` with `MessageCircle` and `Facebook` with `Globe` — both are generic placeholder icons (social links are `href="#"` per D-08 and non-functional in Phase 1 anyway)
- **Files modified:** `src/components/layout/Footer.tsx`
- **Verification:** tsc --noEmit passes, build exits 0
- **Committed in:** `aa8060e` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2× Rule 1 - Bug)
**Impact on plan:** Both fixes necessary for build to pass. No scope creep. Social icon placeholders remain correct for Phase 1 (non-functional `href="#"` per D-08 — actual brand icons can be substituted in Phase 3/6 if SVG assets are available).

## Issues Encountered

The `npm run build` command failed twice before clean pass:
1. TS6310 from tsconfig.node.json (fixed)
2. TS2305 from lucide-react v1 removing Instagram/Facebook exports (fixed)

Both were pre-existing issues in Plans 01 and 03 that only surfaced here because Plan 04 is the first plan that triggers a full end-to-end TypeScript compile (Plans 02/03 could not compile in isolation — `src/main.tsx` imports `./App` which didn't exist until this plan).

## Known Stubs

All 6 pages are intentional stubs — this is by design for Phase 1. Each page displays H1 title + MinimalCube as visual anchors. Stubs will be replaced with full page content in Phases 2-4.

| Stub | File | Phase that wires real content |
|------|------|-------------------------------|
| HomePage hero | `src/pages/HomePage.tsx` | Phase 3 (HOME-01…07) |
| ProjectsPage hub | `src/pages/ProjectsPage.tsx` | Phase 4 (HUB-01…04) |
| ZhkPage slug resolution | `src/pages/ZhkPage.tsx` | Phase 4 (ZHK-01, ZHK-02) |
| ConstructionLogPage timeline | `src/pages/ConstructionLogPage.tsx` | Phase 4 (LOG-01, LOG-02) |
| ContactPage form | `src/pages/ContactPage.tsx` | Phase 4 (CTC-01) |

NotFoundPage is complete per Phase 1 spec (static 404 with link home).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 01-05 (deploy workflow) can proceed: all 5 routes serve correctly via HashRouter, build output in `dist/` is production-ready
- Phase 02 (data layer): `src/data/projects.ts` needs to be created; pages are stubs waiting for data injection
- Phase 03 (brand + home): HomePage stub is the target; Layout + Nav + Footer scaffold is locked in

---
*Phase: 01-foundation-shell*
*Completed: 2026-04-24*
