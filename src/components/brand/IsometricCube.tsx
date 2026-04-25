/**
 * @module components/brand/IsometricCube
 * 3-variant inviolable brand primitive per VIS-03 + brand-system.md §5.
 * Replaces Phase 1's MinimalCube (deleted in same commit per Phase 3 D-12).
 * `single` variant preserves MinimalCube's polygon geometry verbatim — no
 * visual shift between phases when consumers swap component name.
 *
 * Cube-ladder semantics per CONCEPT §5.2 + Phase 3 D-10:
 *   single → Pipeline-4 aggregate-row marker (Phase 3) +
 *            Phase 4 «Здано (0)» empty-state marker
 *   group  → Phase 4 pipeline-card decorative corner
 *   grid   → hero overlay (delegates to IsometricGridBG) +
 *            Phase 4 empty-state full-bleed
 *
 * D-03 hero opacity ceiling (grid variant only):
 *   The hero overlay grid MUST sit in the 0.10–0.20 opacity band per
 *   brandbook §5 + Phase 3 D-03. The `single`/`group` variants follow
 *   the broader brandbook 0.05–0.60 cube range (default 0.3).
 *   Therefore when `variant='grid'`:
 *     - opacity undefined → delegate receives 0.15 (mid-band)
 *     - opacity explicit  → delegate receives Math.min(opacity, 0.2)
 *   This prevents an accidental `<IsometricCube variant='grid' />` call
 *   from washing the hero in 30% accent-overlay.
 */
import { IsometricGridBG } from './IsometricGridBG';

type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export interface IsometricCubeProps {
  variant: 'single' | 'group' | 'grid';
  /** One of 3 brand-allowed stroke colors. Default '#A7AFBC'. */
  stroke?: AllowedStroke;
  /** Stroke width 0.5–1.5pt ≈ 1–2px. Default 1. */
  strokeWidth?: number;
  /** Container opacity. Default 0.3 for single/group (brandbook §5).
   *  For variant='grid', see D-03 hero ceiling logic in component body. */
  opacity?: number;
  /** Sizing className. */
  className?: string;
}

export function IsometricCube({
  variant,
  stroke = '#A7AFBC',
  strokeWidth = 1,
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

  // Non-grid variants: brandbook §5 default 0.3 if caller omitted opacity.
  const svgOpacity = opacity ?? 0.3;

  return (
    <svg
      viewBox={variant === 'group' ? '0 0 220 100' : '0 0 100 100'}
      className={className}
      style={{ opacity: svgOpacity }}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {variant === 'single' && (
          <>
            {/* Top rhombus — preserved from Phase 1 MinimalCube */}
            <polygon points="50,15 85,35 50,55 15,35" />
            {/* Left rhombus */}
            <polygon points="15,35 15,75 50,95 50,55" />
            {/* Right rhombus */}
            <polygon points="50,55 50,95 85,75 85,35" />
          </>
        )}
        {variant === 'group' && (
          <>
            {/* Cube 1 (left), viewBox 0 0 220 100 */}
            <polygon points="50,15 85,35 50,55 15,35" />
            <polygon points="15,35 15,75 50,95 50,55" />
            <polygon points="50,55 50,95 85,75 85,35" />
            {/* Cube 2 (right) — shares vertical edge x=85 with Cube 1 right face */}
            <polygon points="120,15 155,35 120,55 85,35" />
            <polygon points="85,35 85,75 120,95 120,55" />
            <polygon points="120,55 120,95 155,75 155,35" />
          </>
        )}
      </g>
    </svg>
  );
}
