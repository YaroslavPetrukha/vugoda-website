/**
 * @module hooks/useSessionFlag
 *
 * Tiny custom hook for one-shot session-scoped flags. Phase 5 D-21.
 *
 * Returns true if the sessionStorage key was already set when this hook
 * first ran (i.e. user has been here before in this session). On first
 * call ever in the session, the hook returns false AND writes the flag,
 * so subsequent mounts return true.
 *
 * Single-purpose for Phase 5: Hero parallax skip on revisit (D-17..D-20).
 * Reusable for future first-visit-only animations (e.g. v2 onboarding
 * tooltips on /projects filter).
 *
 * Lazy useState initializer reads sessionStorage SYNCHRONOUSLY on first
 * React render — initial value matches reality on first paint, no
 * flash-of-cinematic-then-static (Pitfall 5).
 *
 * SSR-safe by pattern (project has no SSR but the typeof window check is
 * cheap insurance). Returns false during SSR.
 *
 * Pure utility — NO React imports beyond useState/useEffect/useRef. NO
 * external deps.
 */
import { useEffect, useRef, useState } from 'react';

export function useSessionFlag(key: string): boolean {
  const [wasAlreadySet] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(key) !== null;
  });
  const wroteOnce = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (wroteOnce.current) return;
    wroteOnce.current = true;
    if (sessionStorage.getItem(key) === null) {
      sessionStorage.setItem(key, '1');
    }
  }, [key]);

  return wasAlreadySet;
}
