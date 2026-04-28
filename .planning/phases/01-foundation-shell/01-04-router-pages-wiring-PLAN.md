---
phase: 01-foundation-shell
plan: 04
type: execute
wave: 3
depends_on:
  - 01-01
  - 01-02
  - 01-03
files_modified:
  - src/App.tsx
  - src/components/layout/Layout.tsx
  - src/components/layout/ScrollToTop.tsx
  - src/pages/HomePage.tsx
  - src/pages/ProjectsPage.tsx
  - src/pages/ZhkPage.tsx
  - src/pages/ConstructionLogPage.tsx
  - src/pages/ContactPage.tsx
  - src/pages/NotFoundPage.tsx
autonomous: true
requirements:
  - NAV-01
  - DEP-03
objective: "HashRouter wiring + Layout wrapping + 5 route stubs + 404 catch-all + ScrollToTop helper. Uses react-router-dom v7 HashRouter (no BrowserRouter, no basename). `<Layout>` wraps `<Outlet/>` so Nav + Footer render on every route. Each of 6 page stubs (HomePage, ProjectsPage, ZhkPage, ConstructionLogPage, ContactPage, NotFoundPage) uses identical shape: H1 Montserrat 700 + centered MinimalCube. Plain `<main><Outlet/></main>` — Phase 5 wraps with AnimatePresence."

must_haves:
  truths:
    - "HashRouter navigates between stubs: `/#/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` all render — Success Criterion #4"
    - "Catch-all route `/#/zhk/unknown` → 404 stub with link back to `/` — D-13"
    - "Every route shows Nav + Footer via `<Layout><Outlet/></Layout>` — Success Criterion #1"
    - "Page stubs display H1 page-title per D-11 (`ВИГОДА`, `Проєкти`, `ЖК`, `Хід будівництва`, `Контакт`) + MinimalCube"
    - "`<ScrollToTop/>` resets window scroll on route change (D: recommended yes in Claude's Discretion)"
  artifacts:
    - path: "src/App.tsx"
      provides: "HashRouter + Routes + Layout wrapping; mounts 5 routes + 404 catch-all"
      exports: ["default App"]
    - path: "src/components/layout/Layout.tsx"
      provides: "<Layout>: <Nav /> + <ScrollToTop /> + <main><Outlet /></main> + <Footer />"
      exports: ["Layout"]
    - path: "src/components/layout/ScrollToTop.tsx"
      provides: "useEffect on useLocation().pathname → window.scrollTo(0,0); renders null"
      exports: ["ScrollToTop"]
    - path: "src/pages/HomePage.tsx"
      provides: "Home stub: H1 «ВИГОДА» + MinimalCube"
      exports: ["default HomePage"]
    - path: "src/pages/ProjectsPage.tsx"
      provides: "Projects stub: H1 «Проєкти» + MinimalCube"
      exports: ["default ProjectsPage"]
    - path: "src/pages/ZhkPage.tsx"
      provides: "ЖК stub: H1 «ЖК» + MinimalCube (Phase 4 adds slug resolution)"
      exports: ["default ZhkPage"]
    - path: "src/pages/ConstructionLogPage.tsx"
      provides: "Construction log stub: H1 «Хід будівництва» + MinimalCube"
      exports: ["default ConstructionLogPage"]
    - path: "src/pages/ContactPage.tsx"
      provides: "Contact stub: H1 «Контакт» + MinimalCube"
      exports: ["default ContactPage"]
    - path: "src/pages/NotFoundPage.tsx"
      provides: "404 stub: H1 «404 — сторінку не знайдено» + link «Повернутись до головної» → /"
      exports: ["default NotFoundPage"]
  key_links:
    - from: "src/App.tsx"
      to: "react-router-dom HashRouter"
      via: "named import + <HashRouter> wrapper"
      pattern: "import\\s+\\{[^}]*HashRouter[^}]*\\}\\s+from\\s+['\"]react-router-dom['\"]"
    - from: "src/App.tsx"
      to: "5 page stubs + NotFoundPage"
      via: "default imports + <Route element>"
      pattern: "<Route\\s+path="
    - from: "src/components/layout/Layout.tsx"
      to: "Nav + Footer + Outlet"
      via: "JSX composition"
      pattern: "<Outlet"
---

<objective>
Wire HashRouter + Layout + 6 page stubs + 404 catch-all. This plan lights up Success Criterion #1 (Nav + Footer on every route) and Success Criterion #4 (HashRouter navigation) at runtime. After this, `npm run dev` serves a clickable 5-page desktop-first shell.

Purpose: DEP-03 fully satisfied in code (base path set in Plan 01's vite.config.ts, HashRouter here, .nojekyll already committed). NAV-01 runs because Footer (Plan 03) renders on every route via Layout. Phase 5's future `AnimatePresence` wrapper needs only to replace `<main><Outlet/></main>` — structure is pre-factored for it.

Output: App runs end-to-end. Navigation between 5 routes works. Direct refresh of `/#/zhk/etno-dim` works (HashRouter's DEP-03 payoff). 404 catches unknown paths.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-shell/01-CONTEXT.md
@.planning/phases/01-foundation-shell/01-01-deps-and-scaffold-PLAN.md
@.planning/phases/01-foundation-shell/01-02-tokens-fonts-base-PLAN.md
@.planning/phases/01-foundation-shell/01-03-brand-primitives-layout-PLAN.md
@.planning/research/ARCHITECTURE.md
@.planning/research/PITFALLS.md

<interfaces>
<!-- react-router-dom v7 HashRouter API (verified peer: react 19, peer-supports React ≥18) -->
import { HashRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';

HashRouter:   no `basename` prop needed (D-22 — hash handles base path)
Routes:       wraps <Route>s
Route:        path + element; nested <Route element={<Layout/>}> + child <Route path="x">
Outlet:       renders nested route's element
Link:         internal navigation with hash handling
useLocation:  { pathname, search, hash }

<!-- Routes (D-10, D-11, D-12, D-13) -->
/                    → HomePage          (H1 «ВИГОДА»)
/projects            → ProjectsPage      (H1 «Проєкти»)
/zhk/:slug           → ZhkPage           (H1 «ЖК» — no slug resolution in Phase 1)
/construction-log    → ConstructionLogPage (H1 «Хід будівництва»)
/contact             → ContactPage       (H1 «Контакт»)
*                    → NotFoundPage      (H1 «404 — сторінку не знайдено»)

<!-- Components imported (from Plans 02/03) -->
src/components/layout/Nav.tsx           export function Nav()
src/components/layout/Footer.tsx        export function Footer()
src/components/brand/MinimalCube.tsx    export function MinimalCube(props)
src/components/brand/Logo.tsx           (not used in pages, only Nav/Footer)

<!-- Page shape (D-10 — identical for all stubs) -->
<main min-h-[calc(100vh-4rem-footer)] flex items-center justify-center>
  <div flex flex-col items-center gap-8>
    <h1 font-bold text-6xl>{title}</h1>
    <MinimalCube className="h-32 w-32" />
  </div>
</main>

<!-- NO Motion imports anywhere (Phase 5 scope) -->
<!-- NO inline transition={{...}} objects (Pitfall 3 preempted) -->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Write ScrollToTop helper + Layout wrapper</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Claude's Discretion (ScrollToTop — recommended yes) + §Deferred Ideas (Phase 5 owns AnimatePresence — Plan 04 leaves plain `<main><Outlet/></main>`)
    - `.planning/research/ARCHITECTURE.md` §3 Q7 (Layout shape: Nav + AnimatedOutlet + Footer — Phase 1 version is Nav + ScrollToTop + main>Outlet + Footer, AnimatePresence added in Phase 5)
    - `src/components/layout/Nav.tsx` (from Plan 03) — exports `Nav`
    - `src/components/layout/Footer.tsx` (from Plan 03) — exports `Footer`
    - react-router-dom v7 useLocation + Outlet APIs
  </read_first>

  <files>
    src/components/layout/ScrollToTop.tsx
    src/components/layout/Layout.tsx
  </files>

  <action>
    1. Create `src/components/layout/ScrollToTop.tsx` with EXACTLY this content:

    ```tsx
    import { useEffect } from 'react';
    import { useLocation } from 'react-router-dom';

    /**
     * Resets window scroll to top on route-path change.
     * Phase 1 includes this for UX baseline (Claude's Discretion in CONTEXT.md).
     * Phase 5 replaces with motion-aware variant alongside AnimatePresence.
     * Renders null — side-effect only.
     */
    export function ScrollToTop() {
      const { pathname } = useLocation();

      useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);

      return null;
    }
    ```

    Rationale:
    - Depends on `pathname` only, not full location — hash/query changes within same page should not trigger scroll reset (per ARCHITECTURE §3 Q7 key-on-pathname rule).
    - `window.scrollTo(0, 0)` — instant scroll; Phase 5 can replace with smooth-scroll or cancel if AnimatePresence is doing its own transition.
    - Returns `null` — this is a side-effect-only component.

    2. Create `src/components/layout/Layout.tsx` with EXACTLY this content:

    ```tsx
    import { Outlet } from 'react-router-dom';
    import { Nav } from './Nav';
    import { Footer } from './Footer';
    import { ScrollToTop } from './ScrollToTop';

    /**
     * Site chrome — Nav (sticky top) + main content + Footer.
     * Renders on every route via <Route element={<Layout/>}> in App.tsx.
     * Phase 5 will wrap <Outlet/> with <AnimatePresence mode="wait">;
     * Phase 1 uses plain <main><Outlet/></main> so Phase 5 only needs
     * to wrap, not rearchitect (ARCHITECTURE.md §3 Q7).
     *
     * Flex-column layout with min-h-screen + mt-auto on Footer lets page
     * stubs fill the viewport cleanly even when content is minimal.
     */
    export function Layout() {
      return (
        <div className="flex min-h-screen flex-col bg-bg">
          <ScrollToTop />
          <Nav />
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>
      );
    }
    ```

    Rationale:
    - `min-h-screen flex flex-col` — standard sticky-footer pattern; `flex-1` on `<main>` + `mt-auto` on Footer (set in Plan 03) lets Footer stick to viewport bottom when main content is short (relevant for all 6 near-empty page stubs).
    - `bg-bg` on outer div ensures no flash-of-white during SPA navigation or font-swap.
    - ScrollToTop placed BEFORE Nav so its effect runs on every route change regardless of what's rendered.
    - `<main>` is the semantic landmark for page content; screen readers jump here via keyboard shortcut.
    - No Motion imports — Phase 5 scope.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/components/layout/ScrollToTop.tsx && test -f src/components/layout/Layout.tsx && grep -q "export function ScrollToTop" src/components/layout/ScrollToTop.tsx && grep -q "useLocation" src/components/layout/ScrollToTop.tsx && grep -q "window.scrollTo(0, 0)" src/components/layout/ScrollToTop.tsx && grep -q "return null" src/components/layout/ScrollToTop.tsx && grep -q "export function Layout" src/components/layout/Layout.tsx && grep -q "Outlet" src/components/layout/Layout.tsx && grep -q "from './Nav'" src/components/layout/Layout.tsx && grep -q "from './Footer'" src/components/layout/Layout.tsx && grep -q "from './ScrollToTop'" src/components/layout/Layout.tsx && grep -q "<Nav />" src/components/layout/Layout.tsx && grep -q "<Footer />" src/components/layout/Layout.tsx && grep -q "<main" src/components/layout/Layout.tsx && ! grep -qE "AnimatePresence|motion\." src/components/layout/Layout.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/components/layout/ScrollToTop.tsx && test -f src/components/layout/Layout.tsx` succeed
    - ScrollToTop file:
      - `grep -c "export function ScrollToTop" src/components/layout/ScrollToTop.tsx` ≥ 1
      - `grep -c "useLocation" src/components/layout/ScrollToTop.tsx` ≥ 2 (import + call)
      - `grep -c "window.scrollTo(0, 0)" src/components/layout/ScrollToTop.tsx` ≥ 1
      - `grep -c "return null" src/components/layout/ScrollToTop.tsx` ≥ 1
      - `grep -c "useEffect" src/components/layout/ScrollToTop.tsx` ≥ 2 (import + call)
      - Effect dep array contains ONLY pathname: `grep -cE "\\}, \\[pathname\\]\\)" src/components/layout/ScrollToTop.tsx` ≥ 1
    - Layout file:
      - `grep -c "export function Layout" src/components/layout/Layout.tsx` ≥ 1
      - `grep -cE "Outlet" src/components/layout/Layout.tsx` ≥ 2 (import + JSX)
      - `grep -c "from './Nav'" src/components/layout/Layout.tsx` ≥ 1
      - `grep -c "from './Footer'" src/components/layout/Layout.tsx` ≥ 1
      - `grep -c "from './ScrollToTop'" src/components/layout/Layout.tsx` ≥ 1
      - `grep -c "<Nav />" src/components/layout/Layout.tsx` ≥ 1
      - `grep -c "<Footer />" src/components/layout/Layout.tsx` ≥ 1
      - `grep -cE "<main" src/components/layout/Layout.tsx` ≥ 1
      - NO Phase 5 scope leaked: `grep -cE "AnimatePresence|from ['\"]motion" src/components/layout/Layout.tsx` = 0
    - No raw hex: `grep -cE '#[0-9A-Fa-f]{6}' src/components/layout/Layout.tsx src/components/layout/ScrollToTop.tsx` = 0
  </acceptance_criteria>

  <done>
    `<Layout>` composes Nav + ScrollToTop + main+Outlet + Footer. ScrollToTop resets scroll on pathname change. Both files type-check and expose named exports that `App.tsx` consumes.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Write 6 page stubs (Home / Projects / Zhk / ConstructionLog / Contact / NotFound)</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Route Stubs D-10, D-11, D-12, D-13 (page titles per route, identical structure, 404 copy)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Specific Ideas (stub-cube centering — min-height flex to fill viewport between Nav and Footer; 404 copy «404 — сторінку не знайдено» + «Повернутись до головної»)
    - `src/components/brand/MinimalCube.tsx` (from Plan 03) — exports `MinimalCube` with props className/stroke/strokeWidth/opacity
    - `src/index.css` tokens — `text-text`, `bg-bg`, `text-accent` available
    - `brand-system.md` §4 (H1 hero: Bold 56-80px — Tailwind `text-6xl` ≈ 60px, `font-bold` = 700)
  </read_first>

  <files>
    src/pages/HomePage.tsx
    src/pages/ProjectsPage.tsx
    src/pages/ZhkPage.tsx
    src/pages/ConstructionLogPage.tsx
    src/pages/ContactPage.tsx
    src/pages/NotFoundPage.tsx
  </files>

  <action>
    Create 6 page-stub files. All five non-404 stubs share IDENTICAL structure per D-10 — only the H1 string changes. 404 has the same base + an added link back home.

    1. `src/pages/HomePage.tsx`:

    ```tsx
    import { MinimalCube } from '../components/brand/MinimalCube';

    export default function HomePage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">ВИГОДА</h1>
            <MinimalCube className="h-32 w-32" />
          </div>
        </section>
      );
    }
    ```

    2. `src/pages/ProjectsPage.tsx`:

    ```tsx
    import { MinimalCube } from '../components/brand/MinimalCube';

    export default function ProjectsPage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">Проєкти</h1>
            <MinimalCube className="h-32 w-32" />
          </div>
        </section>
      );
    }
    ```

    3. `src/pages/ZhkPage.tsx` (Phase 1: no `useParams()` echo per D-12; literal heading «ЖК»):

    ```tsx
    import { MinimalCube } from '../components/brand/MinimalCube';

    /**
     * ЖК route stub. Phase 1 renders identically regardless of :slug (D-12).
     * Phase 4 adds findBySlug() + redirect logic for flagship-external / grid-only.
     */
    export default function ZhkPage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">ЖК</h1>
            <MinimalCube className="h-32 w-32" />
          </div>
        </section>
      );
    }
    ```

    4. `src/pages/ConstructionLogPage.tsx`:

    ```tsx
    import { MinimalCube } from '../components/brand/MinimalCube';

    export default function ConstructionLogPage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">Хід будівництва</h1>
            <MinimalCube className="h-32 w-32" />
          </div>
        </section>
      );
    }
    ```

    5. `src/pages/ContactPage.tsx`:

    ```tsx
    import { MinimalCube } from '../components/brand/MinimalCube';

    export default function ContactPage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">Контакт</h1>
            <MinimalCube className="h-32 w-32" />
          </div>
        </section>
      );
    }
    ```

    6. `src/pages/NotFoundPage.tsx` (D-13 — H1 + subline link back to `/`, brand tone «стримано без "oops"»):

    ```tsx
    import { Link } from 'react-router-dom';
    import { MinimalCube } from '../components/brand/MinimalCube';

    export default function NotFoundPage() {
      return (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-12">
            <h1 className="font-bold tracking-tight text-6xl text-text">
              404 — сторінку не знайдено
            </h1>
            <MinimalCube className="h-32 w-32" />
            <Link
              to="/"
              className="text-base font-medium text-accent underline underline-offset-4"
            >
              Повернутись до головної
            </Link>
          </div>
        </section>
      );
    }
    ```

    Rationale common to all:
    - Default export (react-router-dom convention for route-element components).
    - `flex flex-1 flex-col items-center justify-center` — fills the main container space vertically + horizontally centers the content stack. Flex-1 pulls footer to the bottom naturally (parent `<main>` has `flex flex-1 flex-col` from Plan 04 Task 1).
    - H1 uses `text-6xl` (60px) + `font-bold` (700) + `tracking-tight` (-0.025em) — brand-system.md §4 H1 hero target 56-80px Bold; tracking-tight counters Montserrat Cyrillic defaults (Pitfall 15).
    - `text-text` = `#F5F7FA` via token. NO raw hex.
    - `gap-12` (48px) between H1 and MinimalCube for breathing room; `px-6 py-24` on section gives 24px horizontal + 96px vertical padding.
    - MinimalCube at `h-32 w-32` (128×128px) — large enough to register, not dominant.
    - 404 adds a `<Link>` styled as accented underlined text — intentional brand-tone subdued CTA, not a button.
    - NO Motion imports anywhere. NO inline `transition={{...}}` (Pitfall 3).
    - NO `document.title` updates per Phase 1 (deferred to Phase 6 QA-03 SEO scope).
    - NO `useParams()` call in ZhkPage (D-12 — Phase 4 owns slug resolution).
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && for f in HomePage ProjectsPage ZhkPage ConstructionLogPage ContactPage NotFoundPage; do test -f "src/pages/$f.tsx" || { echo "MISSING $f"; exit 1; }; done && grep -q 'export default function HomePage' src/pages/HomePage.tsx && grep -q 'export default function ProjectsPage' src/pages/ProjectsPage.tsx && grep -q 'export default function ZhkPage' src/pages/ZhkPage.tsx && grep -q 'export default function ConstructionLogPage' src/pages/ConstructionLogPage.tsx && grep -q 'export default function ContactPage' src/pages/ContactPage.tsx && grep -q 'export default function NotFoundPage' src/pages/NotFoundPage.tsx && grep -q '>ВИГОДА<' src/pages/HomePage.tsx && grep -q '>Проєкти<' src/pages/ProjectsPage.tsx && grep -q '>ЖК<' src/pages/ZhkPage.tsx && grep -q '>Хід будівництва<' src/pages/ConstructionLogPage.tsx && grep -q '>Контакт<' src/pages/ContactPage.tsx && grep -q '404 — сторінку не знайдено' src/pages/NotFoundPage.tsx && grep -q 'Повернутись до головної' src/pages/NotFoundPage.tsx && grep -qE 'to="/"' src/pages/NotFoundPage.tsx && ! grep -qEr 'AnimatePresence|from ['"'"'"]motion' src/pages/ && ! grep -qE '#[0-9A-Fa-f]{6}' src/pages/*.tsx && ! grep -qE 'useParams' src/pages/ZhkPage.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - All 6 files exist: `for f in HomePage ProjectsPage ZhkPage ConstructionLogPage ContactPage NotFoundPage; do test -f "src/pages/$f.tsx"; done` all pass
    - Each file has a matching default export:
      - `grep -c 'export default function HomePage' src/pages/HomePage.tsx` ≥ 1
      - `grep -c 'export default function ProjectsPage' src/pages/ProjectsPage.tsx` ≥ 1
      - `grep -c 'export default function ZhkPage' src/pages/ZhkPage.tsx` ≥ 1
      - `grep -c 'export default function ConstructionLogPage' src/pages/ConstructionLogPage.tsx` ≥ 1
      - `grep -c 'export default function ContactPage' src/pages/ContactPage.tsx` ≥ 1
      - `grep -c 'export default function NotFoundPage' src/pages/NotFoundPage.tsx` ≥ 1
    - Each page has H1 with exact D-11 title (as text node between `<h1>` tags):
      - `grep -c '>ВИГОДА<' src/pages/HomePage.tsx` ≥ 1
      - `grep -c '>Проєкти<' src/pages/ProjectsPage.tsx` ≥ 1
      - `grep -c '>ЖК<' src/pages/ZhkPage.tsx` ≥ 1
      - `grep -c '>Хід будівництва<' src/pages/ConstructionLogPage.tsx` ≥ 1
      - `grep -c '>Контакт<' src/pages/ContactPage.tsx` ≥ 1
      - `grep -c '404 — сторінку не знайдено' src/pages/NotFoundPage.tsx` ≥ 1
    - NotFoundPage has home link: `grep -c 'Повернутись до головної' src/pages/NotFoundPage.tsx` ≥ 1 AND `grep -cE 'to="/"' src/pages/NotFoundPage.tsx` ≥ 1
    - Every page imports MinimalCube: `grep -rc "from '../components/brand/MinimalCube'" src/pages/` ≥ 6
    - ZhkPage does NOT use useParams in Phase 1 (D-12): `grep -c "useParams" src/pages/ZhkPage.tsx` = 0
    - H1 brand typography: each page has `font-bold` AND `text-6xl` AND `text-text`: `grep -cE 'font-bold[^>]*text-6xl[^>]*text-text' src/pages/*.tsx` ≥ 6 (all pages)
    - No Motion imports anywhere in pages: `grep -rcE "from ['\"]motion" src/pages/` = 0
    - No inline transition objects: `grep -rc "transition={{" src/pages/` = 0 (Pitfall 3)
    - No raw hex values in pages: `grep -rcE '#[0-9A-Fa-f]{6}' src/pages/` = 0
    - No document.title updates (Phase 6 scope): `grep -rc "document.title" src/pages/` = 0
  </acceptance_criteria>

  <done>
    All 6 page stubs ship with correct D-11 titles, identical structure, MinimalCube anchor, brand-token-only styling. NotFoundPage has link home. ZhkPage is agnostic of slug. Ready for App.tsx to mount them as route elements.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Wire HashRouter + Routes + Layout in src/App.tsx</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Router & Build Config D-22 (HashRouter, no basename), §Route Stubs D-10 through D-13 (all 5 routes + catch-all)
    - `.planning/research/STACK.md` §Stack Patterns → Router subsection (HashRouter decision rationale)
    - `.planning/research/ARCHITECTURE.md` §3 Q7 (App.tsx structure — Phase 1 version without AnimatePresence)
    - `src/components/layout/Layout.tsx` (just created in Task 1) — exports `Layout`
    - `src/pages/*.tsx` (just created in Task 2) — default exports
    - `src/main.tsx` (Plan 02) — already imports `App from './App'`, so Plan 02's main.tsx becomes compile-valid once this file exists
  </read_first>

  <files>
    src/App.tsx
  </files>

  <action>
    Create `src/App.tsx` with EXACTLY this content:

    ```tsx
    import { HashRouter, Routes, Route } from 'react-router-dom';
    import { Layout } from './components/layout/Layout';
    import HomePage from './pages/HomePage';
    import ProjectsPage from './pages/ProjectsPage';
    import ZhkPage from './pages/ZhkPage';
    import ConstructionLogPage from './pages/ConstructionLogPage';
    import ContactPage from './pages/ContactPage';
    import NotFoundPage from './pages/NotFoundPage';

    /**
     * Router root. Uses HashRouter per DEP-03 — GH Pages static server has no
     * SPA fallback; hash routing eliminates the 404-on-hard-refresh class
     * without needing a public/404.html redirect shim.
     *
     * URLs:
     *   /#/                     → HomePage
     *   /#/projects             → ProjectsPage
     *   /#/zhk/:slug            → ZhkPage (Phase 4 adds slug resolution)
     *   /#/construction-log     → ConstructionLogPage
     *   /#/contact              → ContactPage
     *   /#/anything-else        → NotFoundPage
     *
     * Phase 5 will wrap <Outlet/> inside Layout.tsx with <AnimatePresence>;
     * nothing in App.tsx needs to change for that.
     */
    export default function App() {
      return (
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="zhk/:slug" element={<ZhkPage />} />
              <Route path="construction-log" element={<ConstructionLogPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      );
    }
    ```

    Explicit choices and rationale:
    - `HashRouter` per D-22 and DEP-03. No `basename` prop — HashRouter handles base path via `location.hash`, which is why we didn't need `BrowserRouter + basename + public/404.html` gymnastics.
    - Nested routes with `<Route element={<Layout/>}>` — react-router-dom v7 idiom. The `<Outlet/>` inside Layout renders the matched child route. Result: every route automatically gets Nav + Footer + ScrollToTop. NAV-01 satisfied at the router level.
    - `<Route index element={<HomePage/>}>` — matches exactly `/`; cleaner than `path=""`.
    - Other paths have NO leading slash (e.g. `path="projects"`, not `path="/projects"`) — nested routes inherit parent path, and leading slash would break the nesting per react-router-dom v7.
    - `<Route path="*" element={<NotFoundPage/>}>` — catch-all at the end; matches any unmatched path including `/zhk/unknown` (D-13). ZhkPage matches `/zhk/:slug` for ANY slug, so `/zhk/unknown` hits ZhkPage first — Phase 1 behavior is identical stub regardless (D-12). Phase 4 will add `findBySlug` + `<Navigate to="/projects"/>` redirect logic for unknown slugs.
    - Default export per React convention; `src/main.tsx` from Plan 02 imports `App from './App'`.
    - No StrictMode wrapper here — that's in `src/main.tsx` (Plan 02) one level up.
    - NO providers (ThemeProvider, QueryClientProvider, etc.) — Phase 1 has no global state per PROJECT.md §Key Decisions.
    - NO `AnimatePresence` / Motion imports — Phase 5 scope.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/App.tsx && grep -q "export default function App" src/App.tsx && grep -qE "import\s+\{[^}]*HashRouter[^}]*\}\s+from\s+['\"]react-router-dom['\"]" src/App.tsx && grep -q "from './components/layout/Layout'" src/App.tsx && grep -q "from './pages/HomePage'" src/App.tsx && grep -q "from './pages/ProjectsPage'" src/App.tsx && grep -q "from './pages/ZhkPage'" src/App.tsx && grep -q "from './pages/ConstructionLogPage'" src/App.tsx && grep -q "from './pages/ContactPage'" src/App.tsx && grep -q "from './pages/NotFoundPage'" src/App.tsx && grep -q '<HashRouter>' src/App.tsx && grep -q '<Route index element={<HomePage' src/App.tsx && grep -q 'path="projects"' src/App.tsx && grep -q 'path="zhk/:slug"' src/App.tsx && grep -q 'path="construction-log"' src/App.tsx && grep -q 'path="contact"' src/App.tsx && grep -q 'path="\*"' src/App.tsx && grep -q '<Layout' src/App.tsx && ! grep -qE "BrowserRouter|basename" src/App.tsx && ! grep -qE "AnimatePresence|from ['\"]motion" src/App.tsx && npm run build 2>&1 | tee /tmp/build-log.txt && grep -q "built in" /tmp/build-log.txt && echo "BUILD_PASS" && (nohup npm run dev > /tmp/dev-log.txt 2>&1 &) && sleep 6 && curl -sf http://localhost:5173/ | grep -q 'id="root"' && (pkill -f "vite" 2>/dev/null || true) && echo "DEV_SERVER_PASS" && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/App.tsx` succeeds
    - `grep -c "export default function App" src/App.tsx` ≥ 1
    - HashRouter import (NOT BrowserRouter): `grep -cE "import\\s+\\{[^}]*HashRouter[^}]*\\}\\s+from\\s+['\"]react-router-dom['\"]" src/App.tsx` ≥ 1
    - BrowserRouter absent: `grep -cE "\\bBrowserRouter\\b" src/App.tsx` = 0
    - basename prop absent (HashRouter doesn't need it): `grep -c "basename" src/App.tsx` = 0
    - Layout import and usage: `grep -c "from './components/layout/Layout'" src/App.tsx` ≥ 1 AND `grep -cE "<Layout" src/App.tsx` ≥ 1
    - All 6 page default imports present:
      - `grep -c "from './pages/HomePage'" src/App.tsx` ≥ 1
      - `grep -c "from './pages/ProjectsPage'" src/App.tsx` ≥ 1
      - `grep -c "from './pages/ZhkPage'" src/App.tsx` ≥ 1
      - `grep -c "from './pages/ConstructionLogPage'" src/App.tsx` ≥ 1
      - `grep -c "from './pages/ContactPage'" src/App.tsx` ≥ 1
      - `grep -c "from './pages/NotFoundPage'" src/App.tsx` ≥ 1
    - All 5 route paths present (verbatim) + index + catch-all:
      - `grep -c "<Route index" src/App.tsx` ≥ 1
      - `grep -c 'path="projects"' src/App.tsx` ≥ 1
      - `grep -c 'path="zhk/:slug"' src/App.tsx` ≥ 1
      - `grep -c 'path="construction-log"' src/App.tsx` ≥ 1
      - `grep -c 'path="contact"' src/App.tsx` ≥ 1
      - `grep -cE 'path="\\*"' src/App.tsx` ≥ 1 (404 catch-all)
    - HashRouter wrapper present: `grep -c "<HashRouter>" src/App.tsx` ≥ 1
    - No Phase 5 scope leaked: `grep -cE "AnimatePresence|from ['\"]motion" src/App.tsx` = 0
    - No raw hex: `grep -cE '#[0-9A-Fa-f]{6}' src/App.tsx` = 0
    - **Phase-level build gate:** `npm run build` exits 0 and the output contains `built in` (confirms `tsc --noEmit` + `vite build` succeed for Plans 02+03+04 combined — first end-to-end type-check in the phase; Plans 02/03 cannot compile in isolation because `src/main.tsx` imports `./App` created in Plan 04).
    - **Phase-level dev-server smoke:** `npm run dev` starts, `curl -sf http://localhost:5173/` returns HTML containing `id="root"`, then the dev-server process is killed. Confirms Vite middleware path serves the app before Plan 05's live-deploy checkpoint (complements `npm run build` which covers tsc + bundle path; dev-server exercises a separate code path).
  </acceptance_criteria>

  <done>
    App.tsx wires HashRouter + 5 route stubs + 404 catch-all + Layout-wrapped outlet. `npm run dev` serves all 5 routes at `/#/...` URLs with Nav and Footer visible throughout. DEP-03 plumbing complete (base path + HashRouter + .nojekyll). Phase 1 Success Criteria #1 and #4 both pass. **Plan 04 Task 3 is the first end-to-end type-check + build gate for Plans 02+03+04** — Plans 02/03 cannot tsc-compile in isolation (Plan 02's `main.tsx` imports `./App` which only exists after Plan 04). The `npm run build` step proves the whole cohort compiles; the `npm run dev` smoke proves Vite's middleware path serves the app before Plan 05's live-URL human checkpoint.
  </done>
</task>

</tasks>

<verification>
Phase-level verification this plan contributes to:
1. `grep -rE "@fontsource/montserrat/cyrillic-(400|500|700)" src/main.tsx` returns 3 matches (Plan 02 enforced).
2. `grep -rE '#[0-9A-Fa-f]{6}' src/` returns only 6 canonical hexes across entire src/ tree (Plan 02 CSS is only legit source; Plans 03/04 have zero hexes).
3. After `npm install` (Plan 01) + this plan: `npm run build` should exit 0 (TypeScript compiles cleanly, Vite bundles).
4. After `npm run dev`: browser at `localhost:5173/#/` shows Home stub with Nav + Footer; `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` all render. `/#/zhk/anything` renders ZhkPage (stub is slug-agnostic per D-12). `/#/nonsense-route` renders NotFoundPage.
5. Keyboard Tab through Nav links shows 2px accent outline (Plan 02 CSS rule + native focus on NavLink = Success Criterion #5).
</verification>

<success_criteria>
- HashRouter + 5 routes + 404 catch-all all wired in App.tsx.
- Layout renders Nav (sticky) + main(Outlet) + Footer on every route, via nested route pattern.
- 6 page stubs use identical shape per D-10; page titles exactly match D-11.
- ZhkPage is slug-agnostic (D-12 — no `useParams()` Phase 1).
- NotFoundPage has H1 + link home (D-13 copy verbatim).
- ScrollToTop resets scroll on pathname change only (not full location).
- No Motion imports anywhere — Phase 5 scope intact.
- No raw hex values in `src/pages/` or `src/App.tsx` or `src/components/layout/Layout.tsx`.
</success_criteria>

<output>
Create `.planning/phases/01-foundation-shell/01-04-SUMMARY.md`:
- Route table confirming `/`, `/projects`, `/zhk/:slug`, `/construction-log`, `/contact`, `*` all wired
- Import graph: App.tsx → Layout → (Nav, Footer, ScrollToTop); pages are leaves
- `npm run dev` output confirming dev server starts on port 5173 without errors
- `npm run build` output confirming tsc + vite build complete (if run in this plan's verification)
- Any react-router-dom v7-specific warnings surfaced by the React console
</output>
