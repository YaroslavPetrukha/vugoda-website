/**
 * @module hooks/useMatchMedia
 *
 * Reactive media-query hook for QA-01 viewport-conditional rendering.
 * Phase 6 D-02 (locked): JS detection mechanism, NOT CSS-only `@media` —
 * because CSS-only would still ship the desktop DOM tree to mobile users
 * AND cannot semantically replace `<Outlet>` (only style-hide it).
 *
 * Implementation: React 18 canonical `useSyncExternalStore` pattern per
 * RESEARCH §"Pattern 1" — handles concurrent rendering and avoids the
 * useState+useEffect hydration-mismatch class (cheap insurance even though
 * this project has no SSR; v2 BrowserRouter + Vercel migration would
 * otherwise need a re-write).
 *
 * Re-renders when the MediaQueryList result changes (resize / orientation
 * change). Listener cleanup is automatic via the unsubscribe return.
 *
 * `getServerSnapshot` returns `false` — a sensible default for the
 * primary use case "is this a mobile viewport?". On the server (or before
 * hydration), assume desktop. Client takes over with the real value
 * after hydration.
 *
 * Pure utility — only imports useSyncExternalStore from react. NO Motion,
 * NO components, NO data, NO content (sibling-of-useSessionFlag pattern).
 *
 * Phase 6 single-use site: Layout.tsx subscribes to `(max-width: 1023px)`
 * to short-circuit to <MobileFallback> per D-01..D-03. Reusable for any
 * future viewport-conditional logic.
 */
import { useSyncExternalStore } from 'react';

export function useMatchMedia(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
  const getSnapshot = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
