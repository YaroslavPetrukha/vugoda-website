/**
 * @module components/layout/Layout
 *
 * Site chrome — Nav (top) + main + Footer. Renders on every route via
 * <Route element={<Layout/>}> in App.tsx.
 *
 * Phase 5 (D-10..D-14, D-25): wraps the Outlet in a presence wrapper +
 * keyed motion layer for inter-route page transitions per ANI-04.
 * Replaces the Phase 1 scroll-reset useEffect side-effect with the
 * presence-wrapper's onExitComplete callback (resets window scroll to
 * the top in the gap between exit-finished and enter-starting, never
 * during the fade-out).
 *
 * Risk 1 enforcement: the motion layer carries the same flex-grow
 * utility classes as the wrapping main element so the existing flex
 * chain continues into the route content subtree. Without this on the
 * inserted layer, every page's min-h-screen-style layouts visually
 * shrink.
 *
 * D-12 key strategy: location.pathname ONLY (NOT pathname+search). Chip
 * clicks on /projects (?stage=...) update searchParams without re-keying
 * — useSearchParams state survives, no spurious page fade.
 *
 * D-25 RM threading: when the user prefers reduced motion, pageFade is
 * swapped for a no-op variant. Routes still mount/unmount but without
 * animation. Motion 12.38.0 fires onExitComplete synchronously on
 * 0-duration exits, so scroll-to-top still works under reduced-motion
 * (RESEARCH Pitfall 3).
 *
 * Phase 1's standalone scroll-reset component is DELETED in this same
 * plan (D-14 Claude's-Discretion: deletion is cleaner than no-op file).
 *
 * Phase 6 (D-02..D-07): mobile-fallback short-circuit. When
 * useMatchMedia('(max-width: 1023px)') returns true AND the route is
 * NOT a /dev/* QA surface, return <MobileFallback /> directly inside
 * the bg-bg shell — bypassing Nav, AnimatePresence, Outlet, and Footer
 * (saves Motion-runtime bytes mobile users never see). Desktop path
 * (≥1024px) and /dev/brand + /dev/grid routes pass through to the
 * existing Phase 5 chain unchanged.
 */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { pageCurtain } from '../../lib/motionVariants';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { MobileFallback } from './MobileFallback';
import { RouteRatioBadge } from './RouteRatioBadge';
import { BlueprintGridSweep } from './BlueprintGridSweep';

export function Layout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  // P1-M0a: pageCurtain replaces pageFade for cinematic «curtain rolling
  // away» transitions on non-RM path. RM path stays a 1-frame no-op so
  // motion-sensitive users see instant route swap (scroll-to-top still
  // fires via onExitComplete on synchronous 0-duration exit per Motion
  // 12.38 behaviour, RESEARCH Pitfall 3).
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : pageCurtain;

  // P1-UX2: focus #main-content on route change so SR users hear the
  // new page contents instead of staying parked on the nav link they
  // clicked. tabIndex={-1} on <main> below makes it programmatically
  // focusable without entering the tab order. Skip-link still routes
  // here on first tab.
  useEffect(() => {
    const main = document.getElementById('main-content');
    main?.focus({ preventScroll: true });
  }, [location.pathname]);

  // Phase 6 D-02: JS viewport detection (not CSS-only — avoids shipping
  // desktop DOM tree to mobile bytes; lets us replace <Outlet> semantically).
  const isMobile = useMatchMedia('(max-width: 1023px)');

  // Phase 6 D-07: /dev/* QA surfaces are exempt — developers may inspect
  // /dev/brand or /dev/grid on tablet sizes; they need real content.
  const isDevSurface = location.pathname.startsWith('/dev/');

  // Phase 6 D-03: replace Outlet AND hide Nav + Footer; AnimatePresence
  // is bypassed entirely on mobile (Motion-runtime path mobile users
  // never see — saves runtime bytes on the mobile rendering branch).
  if (isMobile && !isDevSurface) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileFallback />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Skip-link — WCAG 2.4.1 (P0-11 / AUDIT-UX §3.2). Hidden off-screen
          until :focus-visible (first tab-press from page load). */}
      <a href="#main-content" className="skip-link">
        Перейти до основного контенту
      </a>
      <Nav />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.div
            key={location.pathname}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      {/* Persistent route-tag (W3 ratio-numerals language extended to global
          scope). ПОЗА AnimatePresence — інакше counter-roll конфліктував би
          з page-curtain exit. Hidden на /dev/* + 404 (getRouteMeta null) і
          mobile (md:block + Layout вже short-circuits на mobile). */}
      <RouteRatioBadge />
      {/* Blueprint-grid sweep — 350ms scaleY wrap/unwrap на pathname change.
          Накладається ПОВЕРХ pageCurtain (independent visual layer). Skips
          first mount (loader тримає arrival). Returns null під RM. */}
      <BlueprintGridSweep />
    </div>
  );
}
