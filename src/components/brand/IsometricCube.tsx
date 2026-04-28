/**
 * @module components/brand/IsometricCube
 * 3-variant inviolable brand primitive per VIS-03 + brand-system.md §5.
 *
 * 2026-04-28 brand-correction: `single` + `group` variants now render the
 * canonical brand mark (brand-assets/mark/mark.svg) instead of locally
 * authored polygon strokes. The polygon path was an in-house re-creation
 * that drifted from the brandbook geometry — user feedback flagged it as
 * off-brand. Replacing with the source SVG via URL-import (Phase 3 D-28
 * pattern, mirrors Mark.tsx) makes the brand mark the single source of
 * truth across every consumer (AggregateRow, MethodologyTeaser, BrandEssence,
 * EmptyStateZdano, ContactPage, DevBrandPage).
 *
 * Cube-ladder semantics per CONCEPT §5.2 + Phase 3 D-10:
 *   single → Pipeline-4 aggregate-row marker (Phase 3) +
 *            Phase 4 «Здано (0)» empty-state marker
 *   group  → Phase 4 pipeline-card decorative corner (2 marks side-by-side)
 *   grid   → hero overlay (delegates to IsometricGridBG) +
 *            Phase 4 empty-state full-bleed
 *
 * Prop compatibility:
 *   - `stroke` and `strokeWidth` are now no-ops for `single`/`group`
 *     (mark.svg uses fill #C1F33D natively per brandbook). Kept in the
 *     API surface so existing callers don't need refactor; the props are
 *     accepted and silently ignored. Lime is the only sanctioned mark color.
 *   - `opacity` multiplies onto the mark's intrinsic 0.6 fill-opacity.
 *     Default 0.5 (gives effective 0.3 on screen — matches old default).
 *   - `className` flows to the wrapper. Use object-contain semantics
 *     internally to letterbox the 220×167 viewBox in any aspect container.
 *
 * D-03 hero opacity ceiling (grid variant only):
 *   The hero overlay grid MUST sit in the 0.10–0.20 opacity band per
 *   brandbook §5 + Phase 3 D-03. The `single`/`group` variants follow
 *   the broader brandbook 0.05–0.60 cube range.
 */
import { IsometricGridBG } from './IsometricGridBG';
import markUrl from '../../../brand-assets/mark/mark.svg';

type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export interface IsometricCubeProps {
  variant: 'single' | 'group' | 'grid';
  /** No-op for single/group (mark.svg ships in #C1F33D only). Retained for
   *  API compatibility. */
  stroke?: AllowedStroke;
  /** No-op for single/group. Retained for API compatibility. */
  strokeWidth?: number;
  /** Container opacity per brandbook 0.05–0.60. Default 0.5 (matches the
   *  old polygon variant's effective contrast on bg-bg). For variant='grid',
   *  see D-03 hero ceiling logic in component body. */
  opacity?: number;
  /** Sizing className (passed to the wrapper). */
  className?: string;
}

export function IsometricCube({
  variant,
  opacity,
  className,
}: IsometricCubeProps) {
  // grid variant delegates to the svgr-imported IsometricGridBG so we keep
  // a single source of truth for grid geometry (Phase 3 D-09 wrapper option).
  // D-03: enforce hero 0.10–0.20 opacity ceiling at the delegate boundary.
  if (variant === 'grid') {
    const gridOpacity =
      opacity === undefined ? 0.15 : Math.min(opacity, 0.2);
    return <IsometricGridBG className={className} opacity={gridOpacity} />;
  }

  const wrapperOpacity = opacity ?? 0.5;

  if (variant === 'group') {
    return (
      <div
        className={className}
        style={{ opacity: wrapperOpacity }}
        aria-hidden="true"
      >
        <div className="flex h-full w-full items-center justify-center gap-2">
          <img
            src={markUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-auto object-contain"
          />
          <img
            src={markUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ opacity: wrapperOpacity }}
      aria-hidden="true"
    >
      <img
        src={markUrl}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
