import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll to top on route-path change.
 * Phase 1 includes this for UX baseline (Claude's Discretion in CONTEXT.md).
 * Phase 5 replaces with motion-aware variant (route transition layer).
 * Renders null — side-effect only.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
