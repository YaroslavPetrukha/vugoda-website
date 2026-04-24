// Phase 1 minimal stub — single isometric cube in wireframe line art.
// Phase 3 replaces this with the full <IsometricCube variant> per VIS-03
// and ARCHITECTURE.md §3 Q4. Kept intentionally simple: one viewBox,
// three allowed stroke colors, straight lines only (brand-system.md §5).

export interface MinimalCubeProps {
  /** Additional classes (sizing, margin, opacity). */
  className?: string;
  /** Stroke — must be one of the 3 allowed brand colors. */
  stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D';
  /** Stroke width in px; brandbook allows 0.5-1.5pt ≈ 1-2px. */
  strokeWidth?: number;
  /** SVG-level opacity; brandbook allows 0.05-0.60. */
  opacity?: number;
}

/**
 * Isometric cube wireframe — front/top/side faces, three visible edges from corner.
 * Used as route-stub visual anchor in Phase 1; Phase 3 expands this into the
 * `<IsometricCube variant='single' | 'group' | 'grid'>` primitive.
 */
export function MinimalCube({
  className,
  stroke = '#A7AFBC',
  strokeWidth = 1.5,
  opacity = 0.6,
}: MinimalCubeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ opacity }}
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
        {/* Top rhombus (face) */}
        <polygon points="50,15 85,35 50,55 15,35" />
        {/* Left rhombus (face) */}
        <polygon points="15,35 15,75 50,95 50,55" />
        {/* Right rhombus (face) */}
        <polygon points="50,55 50,95 85,75 85,35" />
      </g>
    </svg>
  );
}
