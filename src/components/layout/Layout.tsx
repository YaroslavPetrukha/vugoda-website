import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

/**
 * Site chrome — Nav (sticky top) + main content + Footer.
 * Renders on every route via <Route element={<Layout/>}> in App.tsx.
 * Phase 5 will wrap <Outlet/> with the motion route-transition wrapper;
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
