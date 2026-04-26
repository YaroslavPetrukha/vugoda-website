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
 *   /#/dev/brand            → DevBrandPage (Phase 3 D-25, hidden — not linked from Nav)
 *   /#/dev/grid             → DevGridPage (Phase 4 D-39, hidden — fixtures stress test)
 *   /#/anything-else        → NotFoundPage
 *
 * Phase 5 will wrap the Outlet inside Layout.tsx with the route-transition
 * motion wrapper; nothing in App.tsx needs to change for that.
 *
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
 */
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
