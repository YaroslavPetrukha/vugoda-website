---
phase: 06-performance-mobile-fallback-deploy
plan: 05
type: execute
wave: 2
depends_on: [06-03-devdep-and-utility]
files_modified:
  - src/components/ui/MarkSpinner.tsx
  - src/App.tsx
autonomous: true
requirements: [QA-02]
must_haves:
  truths:
    - "src/components/ui/MarkSpinner.tsx renders a centered <Mark> primitive with className='mark-pulse w-12 h-12' inside a min-h-screen flex-centered bg-bg div with role='status' + aria-live='polite' for accessibility"
    - "MarkSpinner does NOT import Motion (CSS-only @keyframes animation per D-10 Specifics — keeps the Suspense fallback path Motion-free so the lazy split delivers genuine bytes savings)"
    - "src/App.tsx converts /construction-log, /dev/brand, /dev/grid imports to React.lazy() (D-08); production routes /, /projects, /zhk/:slug, /contact, NotFoundPage stay eager (D-09)"
    - "src/App.tsx wraps the entire <Routes> block in <Suspense fallback={<MarkSpinner />}> placed INSIDE <HashRouter> but ABOVE <Routes> per RESEARCH §Pattern 2 (Suspense above AnimatePresence in Layout, to avoid chunk-fetch / exit-anim race)"
    - "After build: dist/assets/ contains separate JS chunks for ConstructionLogPage, DevBrandPage, DevGridPage; the eager index-*.js chunk does NOT contain these pages' code"
  artifacts:
    - path: src/components/ui/MarkSpinner.tsx
      provides: "Suspense fallback for lazy-loaded routes (D-10) — brand-consistent <Mark> cube with CSS-only opacity pulse (uses .mark-pulse @utility from plan 06-03)"
      contains: "mark-pulse"
    - path: src/App.tsx
      provides: "React.lazy() split for 3 heavy/dev routes + Suspense fallback wiring per D-08..D-10"
      contains: "lazy(() => import"
  key_links:
    - from: "src/App.tsx"
      to: "src/pages/ConstructionLogPage.tsx via React.lazy()"
      via: "const ConstructionLogPage = lazy(() => import('./pages/ConstructionLogPage'))"
      pattern: "lazy\\(\\(\\) => import\\('\\./pages/ConstructionLogPage'\\)\\)"
    - from: "src/App.tsx"
      to: "src/components/ui/MarkSpinner.tsx via Suspense fallback prop"
      via: "<Suspense fallback={<MarkSpinner />}>"
      pattern: "<Suspense fallback=\\{<MarkSpinner"
    - from: "src/components/ui/MarkSpinner.tsx"
      to: ".mark-pulse @utility in src/index.css (plan 06-03)"
      via: "className='mark-pulse'"
      pattern: "className=\"mark-pulse"
---

<objective>
Wire the QA-02 selective React.lazy code-split + Suspense fallback per CONTEXT D-08..D-10 + RESEARCH §"Pattern 2".

Two files modified:

**1. New file `src/components/ui/MarkSpinner.tsx`** (D-10 + Specifics §"<MarkSpinner> minimal CSS-only implementation"):
Brand-consistent Suspense fallback. Renders the existing `<Mark>` primitive (from `src/components/brand/Mark.tsx`, Phase 3 D-28) inside a min-h-screen flex-centered container with `className="mark-pulse w-12 h-12"` to apply the CSS-only opacity pulse defined in `src/index.css` by plan 06-03. CSS-only — NOT Motion. Reasoning: Suspense fallback gates lazy chunks; if the fallback ITSELF imports Motion, the lazy-split defeats its own purpose.

**2. Edit `src/App.tsx`** (D-08, D-09, D-10):

- Convert 3 page imports from eager to lazy: `ConstructionLogPage`, `DevBrandPage`, `DevGridPage`
- Keep eager: `HomePage`, `ProjectsPage`, `ZhkPage`, `ContactPage`, `NotFoundPage`
- Add `Suspense, lazy` imports from React + `MarkSpinner` import
- Wrap `<Routes>` in `<Suspense fallback={<MarkSpinner />}>` — placed INSIDE `<HashRouter>`, ABOVE `<Routes>` (Suspense above AnimatePresence-in-Layout per RESEARCH §"Pattern 2")

Output: 1 new component (~25 lines), 1 file edited (~6 line-edits in App.tsx).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@src/App.tsx
@src/index.css
@src/components/brand/Mark.tsx
</context>

<interfaces>
<!-- Existing src/App.tsx (Phase 1 + Phase 4) -->

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ZhkPage from './pages/ZhkPage';
import ConstructionLogPage from './pages/ConstructionLogPage';
import ContactPage from './pages/ContactPage';
import DevBrandPage from './pages/DevBrandPage';
import DevGridPage from './pages/DevGridPage';
import NotFoundPage from './pages/NotFoundPage';

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
          <Route path="dev/brand" element={<DevBrandPage />} />
          <Route path="dev/grid" element={<DevGridPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
```

<!-- Target shape per RESEARCH §"Pattern 2" verbatim: -->

```tsx
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ZhkPage from './pages/ZhkPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { MarkSpinner } from './components/ui/MarkSpinner';

const ConstructionLogPage = lazy(() => import('./pages/ConstructionLogPage'));
const DevBrandPage = lazy(() => import('./pages/DevBrandPage'));
const DevGridPage = lazy(() => import('./pages/DevGridPage'));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<MarkSpinner />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="zhk/:slug" element={<ZhkPage />} />
            <Route path="construction-log" element={<ConstructionLogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="dev/brand" element={<DevBrandPage />} />
            <Route path="dev/grid" element={<DevGridPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
```

<!-- src/components/brand/Mark.tsx (existing Phase 3 D-28) -->

Read this file before authoring MarkSpinner to confirm export shape (default vs named) and whether it accepts className. If named + accepts className: import as `import { Mark } from '../brand/Mark'` and pass className directly. If default: `import Mark from '../brand/Mark'`. If does NOT accept className: wrap with a span/div carrying the mark-pulse class.

<!-- mark-pulse @utility from src/index.css (plan 06-03) -->

```css
@utility mark-pulse {
  animation: mark-pulse 1.2s var(--ease-brand) infinite alternate;
}
@keyframes mark-pulse { from { opacity: 0.4; } to { opacity: 0.8; } }
@media (prefers-reduced-motion: reduce) { .mark-pulse { animation: none; opacity: 0.6; } }
```
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/ui/MarkSpinner.tsx (D-10 CSS-only Suspense fallback)</name>
  <read_first>
    - src/index.css (confirm `@utility mark-pulse` from plan 06-03 is present)
    - src/components/brand/Mark.tsx (confirm export shape — default vs named — and props signature)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-10 (Suspense fallback = CSS-only, brand «cube > generic spinner»)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §Specifics "<MarkSpinner> minimal CSS-only implementation" (verbatim ~10-line template)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pattern 2: Selective React.lazy with Suspense + AnimatePresence coexistence"
    - src/components/ui/RevealOnScroll.tsx (existing Phase 5 — reference pattern for ui/ component file shape)
  </read_first>
  <files>src/components/ui/MarkSpinner.tsx</files>
  <action>
    First read `src/components/brand/Mark.tsx` to determine export shape. Then create `src/components/ui/MarkSpinner.tsx` with this content (adjust import line to match Mark's actual export):

    ```tsx
    /**
     * @module components/ui/MarkSpinner
     *
     * Suspense fallback for the QA-02 React.lazy routes (Phase 6 D-08..D-10).
     * Wired in src/App.tsx as <Suspense fallback={<MarkSpinner />}>.
     *
     * CSS-only animation (D-10 Claude's Discretion + RESEARCH §"Pattern 2"):
     * the fallback gates lazy chunks. If THIS component imported Motion, the
     * lazy-split would defeat its own purpose — Motion would be loaded into
     * the eager bundle to render the fallback ITSELF. CSS @keyframes (defined
     * in src/index.css `@utility mark-pulse`, plan 06-03) keeps the fallback
     * path Motion-free; Motion only loads when the lazy chunk resolves and
     * the AnimatePresence path in Layout.tsx mounts.
     *
     * Brand alignment: <Mark> primitive (Phase 3 D-28) — small cube glyph,
     * ~48px (w-12 h-12). Pulse magnitude 0.4 → 0.8 opacity, 1.2s, ease-brand
     * (Phase 5 D-23) — «стримано» per brand-system §6 («без bouncy springs»).
     *
     * Accessibility: role="status" announces a loading state without
     * interrupting; aria-live="polite" lets screen readers announce after
     * current speech completes (Phase 1 D-21 a11y rule).
     *
     * Reduced-motion: handled at CSS layer (src/index.css `@media
     * (prefers-reduced-motion: reduce)` overrides .mark-pulse to static
     * opacity 0.6). Component code does NOT need useReducedMotion() — the
     * stylesheet does the right thing automatically.
     *
     * @rule IMPORT BOUNDARY: ui component. Imports brand/ primitives only.
     *   No data, no content, no pages. CSS class .mark-pulse is the @utility
     *   declared in src/index.css (Phase 6 plan 06-03).
     */
    import { Mark } from '../brand/Mark';

    export function MarkSpinner() {
      return (
        <div
          role="status"
          aria-live="polite"
          aria-label="Завантаження"
          className="flex min-h-screen items-center justify-center bg-bg"
        >
          <Mark className="mark-pulse w-12 h-12" aria-hidden="true" />
          <span className="sr-only">Завантаження</span>
        </div>
      );
    }
    ```

    Adjustments based on Mark.tsx:
    - If Mark is default export: `import Mark from '../brand/Mark';`
    - If Mark does not accept className: wrap in `<span className="mark-pulse w-12 h-12 inline-block"><Mark /></span>`
    - If Mark rejects aria-hidden: drop the prop and rely on the wrapper's aria-label

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon/Пикторіал/Рубікон
    - Hex literals: NO `#XXXXXX` (Tailwind tokens only)
    - Placeholder tokens: NO `\{\{[^}]*\}\}` (JSX uses single-brace `{<MarkSpinner />}`)
    - Inline transition: NO `transition={{` (CSS-only)
    - Import boundaries: imports `../brand/Mark` only (within ui boundary)

    Note on `sr-only`: standard Tailwind v4 utility. If absent from project config, substitute `className="absolute -m-px h-px w-px overflow-hidden border-0 p-0"` or omit the redundant span.
  </action>
  <verify>
    <automated>test -f src/components/ui/MarkSpinner.tsx && grep -q "export function MarkSpinner" src/components/ui/MarkSpinner.tsx && grep -q "mark-pulse" src/components/ui/MarkSpinner.tsx && grep -q 'role="status"' src/components/ui/MarkSpinner.tsx && grep -q 'aria-live' src/components/ui/MarkSpinner.tsx && ! grep -qE "from ['\"]motion" src/components/ui/MarkSpinner.tsx && npx tsc --noEmit && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f src/components/ui/MarkSpinner.tsx` exits 0
    - `grep -c "^export function MarkSpinner" src/components/ui/MarkSpinner.tsx` returns 1
    - `grep -c "mark-pulse" src/components/ui/MarkSpinner.tsx` returns ≥ 1 (className applied to Mark or wrapper)
    - `grep -c 'role="status"' src/components/ui/MarkSpinner.tsx` returns 1
    - `grep -c 'aria-live="polite"' src/components/ui/MarkSpinner.tsx` returns 1
    - `grep -cE "from ['\"]motion" src/components/ui/MarkSpinner.tsx` returns 0 (NO Motion import — D-10 CSS-only)
    - `grep -cE "from ['\"]\\.\\./brand/Mark['\"]" src/components/ui/MarkSpinner.tsx` returns 1 (imports Mark primitive)
    - `grep -cE "#[0-9A-Fa-f]{6}" src/components/ui/MarkSpinner.tsx` returns 0 (no hex literals)
    - `grep -cE "transition=\\{\\{" src/components/ui/MarkSpinner.tsx` returns 0 (no inline transition prop)
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
  </acceptance_criteria>
  <done>
    - File exists at `src/components/ui/MarkSpinner.tsx`
    - Named export `MarkSpinner`
    - Renders `<Mark>` primitive with `mark-pulse` class via CSS @utility
    - Zero Motion imports (D-10 CSS-only fallback path)
    - Accessible: role="status", aria-live="polite", aria-label
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with all 5 brand checks PASS
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Edit src/App.tsx — React.lazy 3 routes + Suspense fallback wiring (D-08..D-10 + RESEARCH §Pattern 2)</name>
  <read_first>
    - src/App.tsx (FULL CURRENT FILE — must understand the exact existing import + Routes structure)
    - src/components/ui/MarkSpinner.tsx (Task 1 above — confirm export name)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-08 (3 routes lazy: /construction-log, /dev/brand, /dev/grid)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-09 (production routes stay eager: /, /projects, /zhk/:slug, /contact + NotFoundPage)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-10 (Suspense placement)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pattern 2: Selective React.lazy with Suspense + AnimatePresence coexistence" (Suspense ABOVE Routes/AnimatePresence to avoid chunk-fetch / exit-anim race)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Verified Vite 6 behavior" (default chunk naming `assets/[name]-[hash].js`; bundleBudget grep targets `index-*.js` — eager only)
  </read_first>
  <files>src/App.tsx</files>
  <action>
    Edit `src/App.tsx` (existing Phase 1 + Phase 4 file). Make these surgical changes:

    **Change A — Imports section.** Replace the existing import block (HashRouter through NotFoundPage) with:

    ```tsx
    import { Suspense, lazy } from 'react';
    import { HashRouter, Routes, Route } from 'react-router-dom';
    import { Layout } from './components/layout/Layout';
    import HomePage from './pages/HomePage';
    import ProjectsPage from './pages/ProjectsPage';
    import ZhkPage from './pages/ZhkPage';
    import ContactPage from './pages/ContactPage';
    import NotFoundPage from './pages/NotFoundPage';
    import { MarkSpinner } from './components/ui/MarkSpinner';

    // Lazy: heavy non-flagship + dev-only QA tooling (Phase 6 D-08).
    // Production routes (/, /projects, /zhk/:slug, /contact) and NotFoundPage
    // stay eager per D-09 — LCP-relevant + shared deps + small surface.
    const ConstructionLogPage = lazy(() => import('./pages/ConstructionLogPage'));
    const DevBrandPage = lazy(() => import('./pages/DevBrandPage'));
    const DevGridPage = lazy(() => import('./pages/DevGridPage'));
    ```

    Removed: 3 eager imports (`ConstructionLogPage`, `DevBrandPage`, `DevGridPage`) — they become lazy const declarations below the imports.

    **Change B — Update JSDoc.** Update the existing JSDoc above the `App` function. Add a paragraph at the end documenting the Phase 6 D-08..D-10 behavior:

    Find the existing JSDoc block (Phase 1 wrote it). Append after the «URLs:» list:

    ```
     * Phase 6 (D-08..D-10): selective React.lazy() split for /construction-log
     * (50-photo grid + Lightbox state — heaviest non-flagship surface),
     * /dev/brand (QA tooling, never seen by client), and /dev/grid (QA tooling
     * + projects.fixtures import). Production routes stay eager (D-09 — LCP
     * entry, shared deps, tiny surface). <Suspense fallback={<MarkSpinner />}>
     * wraps the entire <Routes> block per RESEARCH §"Pattern 2": Suspense ABOVE
     * Routes (which is above AnimatePresence in Layout.tsx) — prevents the
     * chunk-fetch / exit-anim race that would manifest if Suspense were
     * mounted INSIDE AnimatePresence's animated child.
     *
     * Vite 6 chunk naming default `assets/[name]-[hash].js` is preserved — no
     * `manualChunks` config required. The bundleBudget() CI gate (plan 06-08)
     * targets `dist/assets/index-*.js` (eager entry chunk only); lazy chunks
     * are correctly excluded from the gate (loaded on demand only).
    ```

    **Change C — Wrap Routes in Suspense.** In the function body, wrap the existing `<Routes>...</Routes>` block with `<Suspense fallback={<MarkSpinner />}>`. The Suspense element is INSIDE `<HashRouter>` and ABOVE `<Routes>`. Final return:

    ```tsx
    export default function App() {
      return (
        <HashRouter>
          <Suspense fallback={<MarkSpinner />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="zhk/:slug" element={<ZhkPage />} />
                <Route path="construction-log" element={<ConstructionLogPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="dev/brand" element={<DevBrandPage />} />
                <Route path="dev/grid" element={<DevGridPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      );
    }
    ```

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero in additions)
    - Hex literals: NO `#XXXXXX` (zero — pure JSX/imports)
    - Placeholder tokens: NO `\{\{[^}]*\}\}` (Mustache pairs absent — `<Suspense fallback={<MarkSpinner />}>` is single-brace JSX)
    - Inline transition: NO `transition={{` JSX prop pattern (App.tsx is route wiring; no Motion props introduced)
    - Import boundaries: pages/ imports stay; new imports are `react` (Suspense, lazy) and `./components/ui/MarkSpinner` — within boundary

    **Verification expectations after this edit:**
    - `npx tsc --noEmit` exits 0
    - `npm run build` succeeds; `dist/assets/` contains:
      - One `index-{hash}.js` (eager bundle) — should be smaller than the pre-Phase-6 baseline due to 3 routes being split off
      - At least one chunk file matching `ConstructionLogPage` or similar identifier (Vite uses the dynamic-import target name as chunk basename by default)
      - At least one chunk for DevBrandPage and DevGridPage
    - `gzip -c dist/assets/index-*.js | wc -c` should be LESS than the pre-Phase-6 measurement (expect ~110-130KB; was ~134KB) — confirming the lazy split removed bytes from the eager bundle
    - Manual smoke (browser, ~30 sec):
      - Load `/` — no MarkSpinner flash (eager)
      - Navigate to `/#/construction-log` — brief MarkSpinner flash while ConstructionLogPage chunk loads, then page renders
      - Navigate to `/#/dev/brand` — brief MarkSpinner flash, then DevBrandPage renders
      - With DevTools throttling at "Slow 3G": MarkSpinner is visible for 1-2 seconds before ConstructionLogPage paints
      - Console: ZERO errors during all transitions; no React Suspense warnings
  </action>
  <verify>
    <automated>grep -q "import { Suspense, lazy } from 'react'" src/App.tsx && grep -q "import { MarkSpinner } from './components/ui/MarkSpinner'" src/App.tsx && grep -q "lazy(() => import('./pages/ConstructionLogPage'))" src/App.tsx && grep -q "lazy(() => import('./pages/DevBrandPage'))" src/App.tsx && grep -q "lazy(() => import('./pages/DevGridPage'))" src/App.tsx && grep -q "<Suspense fallback={<MarkSpinner />}>" src/App.tsx && ! grep -qE "^import (ConstructionLogPage|DevBrandPage|DevGridPage)" src/App.tsx && grep -q "import HomePage from './pages/HomePage'" src/App.tsx && npx tsc --noEmit && npm run build && ls dist/assets/ | grep -qE "ConstructionLogPage" && ls dist/assets/ | grep -qE "DevBrandPage" && ls dist/assets/ | grep -qE "DevGridPage" && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "import { Suspense, lazy } from 'react'" src/App.tsx` returns 1
    - `grep -c "import { MarkSpinner } from './components/ui/MarkSpinner'" src/App.tsx` returns 1
    - `grep -c "lazy(() => import('./pages/ConstructionLogPage'))" src/App.tsx` returns 1
    - `grep -c "lazy(() => import('./pages/DevBrandPage'))" src/App.tsx` returns 1
    - `grep -c "lazy(() => import('./pages/DevGridPage'))" src/App.tsx` returns 1
    - `grep -cE "<Suspense fallback=\\{<MarkSpinner */>\\}>" src/App.tsx` returns 1 (Suspense wraps Routes)
    - `grep -cE "^import (ConstructionLogPage|DevBrandPage|DevGridPage) from" src/App.tsx` returns 0 (the 3 lazy routes are NO LONGER eager imports)
    - `grep -c "import HomePage from './pages/HomePage'" src/App.tsx` returns 1 (eager preserved)
    - `grep -c "import ProjectsPage from './pages/ProjectsPage'" src/App.tsx` returns 1
    - `grep -c "import ZhkPage from './pages/ZhkPage'" src/App.tsx` returns 1
    - `grep -c "import ContactPage from './pages/ContactPage'" src/App.tsx` returns 1
    - `grep -c "import NotFoundPage from './pages/NotFoundPage'" src/App.tsx` returns 1
    - All 8 `<Route>` declarations preserved with correct paths
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
    - **Bundle split verified**: `ls dist/assets/ | grep -E "ConstructionLogPage"` returns ≥ 1 line (separate JS chunk exists for ConstructionLogPage)
    - `ls dist/assets/ | grep -E "DevBrandPage"` returns ≥ 1 line
    - `ls dist/assets/ | grep -E "DevGridPage"` returns ≥ 1 line
    - **Eager chunk shrunk**: `gzip -c dist/assets/index-*.js | wc -c` returns a value LESS than 138000 (the pre-Phase-6 ~134KB baseline; expect ~110-130KB after lazy split)
  </acceptance_criteria>
  <done>
    - App.tsx imports `Suspense, lazy` from React + `MarkSpinner` from ui/
    - 3 lazy declarations at top: `ConstructionLogPage`, `DevBrandPage`, `DevGridPage` via `lazy(() => import('./pages/...'))`
    - 5 eager imports preserved: `HomePage`, `ProjectsPage`, `ZhkPage`, `ContactPage`, `NotFoundPage`
    - `<Suspense fallback={<MarkSpinner />}>` wraps `<Routes>` (placed inside HashRouter, above Routes)
    - All 8 `<Route>` paths preserved exactly
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 — produces separate dist chunks for the 3 lazy pages, eager `index-*.js` chunk shrinks
    - Manual smoke: navigation to /construction-log, /dev/brand, /dev/grid shows brief MarkSpinner flash; production routes load without flash
  </done>
</task>

</tasks>

<verification>
- `test -f src/components/ui/MarkSpinner.tsx` exits 0
- App.tsx contains: `Suspense, lazy` import, MarkSpinner import, 3 lazy declarations, `<Suspense fallback={<MarkSpinner />}>` wrap, all 8 routes preserved
- `npx tsc --noEmit` exits 0
- `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
- `ls dist/assets/` shows separate JS chunks for ConstructionLogPage, DevBrandPage, DevGridPage
- `gzip -c dist/assets/index-*.js | wc -c` returns a smaller number than pre-Phase-6 (lazy split removed bytes from eager)
- Manual smoke (UAT): MarkSpinner flash visible at lazy routes; no console errors; reduced-motion preserves static spinner state
</verification>

<success_criteria>
- [ ] `src/components/ui/MarkSpinner.tsx` exists with CSS-only mark-pulse animation, role="status", aria-live="polite"
- [ ] No Motion import in MarkSpinner (D-10 CSS-only fallback path)
- [ ] App.tsx ships `React.lazy()` for the 3 routes specified by D-08
- [ ] Production routes stay eager per D-09
- [ ] `<Suspense fallback={<MarkSpinner />}>` wraps `<Routes>` inside `<HashRouter>` per RESEARCH §"Pattern 2"
- [ ] Build produces separate JS chunks for the 3 lazy routes; eager bundle shrinks
- [ ] `npx tsc --noEmit` and `npm run build` both pass with 5/5 check-brand gates
- [ ] Lighthouse Performance benefit measured indirectly: smaller eager bundle = faster TBT/LCP on production routes
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-05-lazy-routes-suspense-SUMMARY.md` documenting:
- Verbatim final form of MarkSpinner.tsx (~25 lines)
- The diff applied to App.tsx (imports replaced, Suspense wrap added)
- Build artifact verification: `ls dist/assets/` listing showing the 3 new lazy chunks (with hashes)
- Bundle delta: before/after gzipped JS sizes for both `index-*.js` and the 3 lazy chunks individually
- Confirmation that Vite 6 default chunk naming is preserved (no `manualChunks` config edit) — bundleBudget grep target stays valid
- Manual UAT results: spinner flash duration on Slow 3G throttling at each lazy route; zero console errors during transitions
- Note that bundleBudget() in plan 06-08 targets the eager chunk only; lazy chunks are excluded from the gate by design (loaded on demand)
</output>
