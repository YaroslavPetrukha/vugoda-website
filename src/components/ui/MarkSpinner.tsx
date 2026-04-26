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
 * current speech completes (Phase 1 D-21 a11y rule). The <Mark> primitive
 * already sets aria-hidden="true" + alt="" internally (decorative); the
 * sr-only span carries the visible-to-AT label "Завантаження".
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
      <Mark className="mark-pulse w-12 h-12" />
      <span className="sr-only">Завантаження</span>
    </div>
  );
}
