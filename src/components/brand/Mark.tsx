/**
 * @module components/brand/Mark
 * Cube-with-petals brand mark (brand-assets/mark/mark.svg, 739 B,
 * viewBox 0 0 220.6 167.4, fill #C1F33D opacity 0.6 — see brand-system.md).
 *
 * URL-import pattern per Phase 3 D-28 — mirrors Logo.tsx (D-27). Quick-task
 * 260424-whr verified that URL-import bundling lands the SVG in dist/ as a
 * static asset rather than inlining via svgr's ?react query.
 *
 * Decorative — alt="" + aria-hidden="true". Used by DevBrandPage (Phase 3)
 * and reserved for Phase 4 empty-state fallbacks. NOT consumed on home page.
 */
import markUrl from '../../../brand-assets/mark/mark.svg';

export interface MarkProps {
  className?: string;
}

export function Mark({ className }: MarkProps) {
  return <img src={markUrl} alt="" aria-hidden="true" className={className} />;
}
