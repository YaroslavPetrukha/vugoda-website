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
          <Route path="dev/brand" element={<DevBrandPage />} />
          <Route path="dev/grid" element={<DevGridPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
