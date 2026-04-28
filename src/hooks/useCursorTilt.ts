/**
 * @module hooks/useCursorTilt
 *
 * Cursor-tilt hook — W2 P1-D10 (AUDIT-DESIGN §10 Pattern 10).
 *
 * Card responds to cursor position with a subtle 3D tilt (rotateX / rotateY
 * driven by useSpring for natural settle, not hard-target). Decorative
 * interaction — the card feels alive when the user hovers, the way
 * Apple's Dynamic Island or Linear's pricing cards do.
 *
 * Why useSpring (not duration tween): cursor-tilt is the canonical case
 * Emil cites for spring decoration — the card needs to feel mass-and-
 * inertia, not snap-to-target. Per emil-design-eng/SKILL.md:
 *   «Tying visual changes directly to mouse position feels artificial
 *    because it lacks motion. Use useSpring to interpolate.»
 *
 * Brand discipline: the tilt amplitude is capped at 6° (3° max each axis,
 * scaled by cursor-from-center ratio). Anything stronger reads as «toy
 * card» and breaks the стриманий-доказовий register. Spring config is
 * Apple-style { duration, bounce: 0.15 } — gentle settle, no overshoot.
 *
 * RM threading: useReducedMotion gates the entire effect. When prefers-
 * reduced-motion is true, the listener never registers and motion values
 * stay at 0. Caller mounts unconditionally; style is just inert at 0,0.
 *
 * Performance: pointer-move listener is attached to the element itself
 * (not window) so the bounding rect is read only when the cursor is over
 * the card. 60fps friendly on a single card per page (Flagship). Adding
 * to many cards is fine but batch-test if it becomes >5 listeners visible.
 *
 * Usage:
 *   const tilt = useCursorTilt();
 *   <motion.div ref={tilt.ref} style={tilt.style} className="…">
 *     <CardContents />
 *   </motion.div>
 *
 * The wrapping motion.div should set `style={{ ...tilt.style, transformStyle: 'preserve-3d', perspective: '1200px' }}`
 * — perspective is what gives the rotation real depth instead of flat skew.
 */

import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';

interface UseCursorTiltOptions {
  /** Max rotation amplitude per axis in degrees. Default 3 (cap 6° total). */
  maxRotation?: number;
  /** Spring stiffness — higher = snappier. Default 150. */
  stiffness?: number;
  /** Spring damping — higher = settles faster. Default 18. */
  damping?: number;
}

interface UseCursorTiltReturn {
  ref: React.RefObject<HTMLElement | null>;
  style: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    transformPerspective: number;
  };
}

export function useCursorTilt({
  maxRotation = 3,
  stiffness = 150,
  damping = 18,
}: UseCursorTiltOptions = {}): UseCursorTiltReturn {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Raw cursor offset normalised to [-1, 1] across the element's box.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed motion values — what the consumer applies via style.
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-maxRotation, maxRotation]), {
    stiffness,
    damping,
  });
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [maxRotation, -maxRotation]), {
    stiffness,
    damping,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    function handleMove(e: PointerEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      rawX.set(Math.max(-1, Math.min(1, nx)));
      rawY.set(Math.max(-1, Math.min(1, ny)));
    }

    function handleLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);
    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [prefersReducedMotion, rawX, rawY]);

  return {
    ref,
    style: {
      rotateX,
      rotateY,
      transformPerspective: 1200,
    },
  };
}
