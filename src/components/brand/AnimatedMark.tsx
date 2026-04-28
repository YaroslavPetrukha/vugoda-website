/**
 * @module components/brand/AnimatedMark
 *
 * W8 Beat 2 — drawable brand mark for cinematic cube-assembly moments.
 *
 * Inline-SVG sibling of `Mark` and `IsometricCube`. Where `IsometricCube`
 * renders mark.svg via `<img>` (static, fill-based — drop-in for placeholders
 * + empty states), `AnimatedMark` re-authors the same 3-rhombus geometry as
 * stroked `<path>` elements with normalized `pathLength="1"` so each face
 * can draw line-by-line via `stroke-dashoffset` 1→0 transition.
 *
 * Implementation note: uses `useInView` + raw CSS `transition: stroke-dashoffset`
 * instead of `motion.path` + `pathLength` variant. Empirical finding (W8) —
 * Motion's `pathLength` prop sets the SVG attribute eagerly but defers
 * `stroke-dashoffset` style updates to the first animation tick, so on
 * initial paint the path renders with NO dasharray/offset → visible-from-zero,
 * defeating the draw-on illusion. Hand-rolled CSS transition guarantees the
 * correct initial state at first paint.
 *
 * Choreography on viewport-enter (top → left → right):
 *   - Top face (horizontal diamond):    delay 0,    0.8s draw
 *   - Left face (rising from left):     delay 0.15, 0.8s draw
 *   - Right face (rising from right):   delay 0.30, 0.8s draw
 *
 * Total reveal window: 1.1s. Reads as «cube assembling itself, face by face» —
 * the engineering-sketch vocabulary the brand methodology preaches, made literal.
 *
 * Geometry source: brand-assets/mark/mark.svg (viewBox 0 0 220.6 167.4).
 *
 * RM threading: `useReducedMotion` short-circuits — under RM, `drawn` is
 * forced true on mount, no transition (paths render fully drawn statically).
 *
 * Brand contract:
 *   - stroke ∈ {#C1F33D, #A7AFBC, #F5F7FA} (brand-allowed strokes; default lime)
 *   - opacity 0.05–1.0 per brandbook §5
 *   - strokeWidth 1–2 (1.5 default — same as old polygon-cube stroke baseline)
 */
import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export interface AnimatedMarkProps {
  /** One of 3 brand-allowed stroke colors. Default '#C1F33D' (accent). */
  stroke?: AllowedStroke;
  /** Stroke width 1–2px range. Default 1.5. */
  strokeWidth?: number;
  /** Container opacity per brandbook §5. Default 0.9. */
  opacity?: number;
  /** Sizing className. */
  className?: string;
  /** Per-face stagger in seconds. Default 0.15s — total reveal window 1.1s. */
  faceStagger?: number;
  /** Per-face draw duration in seconds. Default 0.8s. */
  faceDuration?: number;
  /** Threshold (0–1) of element visible before triggering. Default 0.5. */
  viewportAmount?: number;
}

const EASE_BRAND = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function AnimatedMark({
  stroke = '#C1F33D',
  strokeWidth = 1.5,
  opacity = 0.9,
  className,
  faceStagger = 0.15,
  faceDuration = 0.8,
  viewportAmount = 0.5,
}: AnimatedMarkProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: viewportAmount });
  const drawn = prefersReducedMotion || inView;

  // Geometry: three 4-point rhombi forming an isometric cube.
  // Coords lifted from brand-assets/mark/mark.svg outer rings, simplified.
  const faces = [
    {
      // Top face — horizontal diamond at canvas lower-middle
      d: 'M 110.3 136.11 L 65.72 110.37 L 110.3 84.63 L 154.88 110.37 Z',
      delay: 0,
    },
    {
      // Left face — rhombus rising from left to apex
      d: 'M 64.65 108.52 L 64.65 57.04 L 109.23 31.30 L 109.23 82.78 Z',
      delay: faceStagger,
    },
    {
      // Right face — rhombus rising from right to apex
      d: 'M 155.95 108.52 L 111.37 82.78 L 111.37 31.30 L 155.95 57.04 Z',
      delay: faceStagger * 2,
    },
  ];

  return (
    <svg
      ref={ref}
      // Tight viewBox: cube vertices span X=64.65–155.95, Y=31.30–136.11.
      // 1.5–2 unit buffer on each side for strokeWidth spillover. Cropping
      // the empty 30% left padding that ships in mark.svg's native viewBox
      // (0 0 220.6 167.4) so the cube's left edge aligns with text below
      // it in flex-column layouts. preserveAspectRatio xMinYMid meet
      // anchors the cube to the LEFT of any container that's wider than
      // the cube's natural ratio — second line of defense if a consumer
      // passes a non-matching className aspect.
      viewBox="63 29 95 110"
      preserveAspectRatio="xMinYMid meet"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="miter"
      >
        {faces.map((face) => (
          <path
            key={face.d}
            d={face.d}
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: prefersReducedMotion
                ? 'none'
                : `stroke-dashoffset ${faceDuration}s ${EASE_BRAND} ${face.delay}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
