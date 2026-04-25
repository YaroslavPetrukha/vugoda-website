/**
 * @module components/brand/IsometricGridBG
 * Hero overlay — imports brand-assets/patterns/isometric-grid.svg via
 * vite-plugin-svgr's ?react query (Phase 3 D-03).
 *
 * The source SVG uses inline <style> with hardcoded fill: #c1f33d and
 * mix-blend-mode: overlay — geometry is FILLED, not stroked. We rely on:
 *   1) Container opacity (0.05–0.60 per brandbook §5).
 *   2) The fill color being canonical accent #C1F33D (passes check-brand).
 *   3) Wrapper className for sizing/positioning.
 *
 * Render ONLY ONCE per page (Phase 3 = hero overlay only) to avoid duplicate
 * <defs><style> blocks and duplicate ids — see 03-RESEARCH.md §Pitfall 3.
 */
import GridSvg from '../../../brand-assets/patterns/isometric-grid.svg?react';

export interface IsometricGridBGProps {
  /** Container className. Default fills parent. */
  className?: string;
  /** Container opacity per brandbook 0.05–0.60. Default 0.15 (mid-band). */
  opacity?: number;
}

export function IsometricGridBG({
  className = 'h-full w-full',
  opacity = 0.15,
}: IsometricGridBGProps) {
  return (
    <div aria-hidden="true" className={className} style={{ opacity }}>
      <GridSvg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      />
    </div>
  );
}
