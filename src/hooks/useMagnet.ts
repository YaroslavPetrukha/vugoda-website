/**
 * @module hooks/useMagnet
 *
 * Magnetic-cursor effect for primary CTAs — P1-M1 (AUDIT-MOTION).
 *
 * When the cursor enters the magnetic field around an element, the element
 * translates a fraction of the offset toward the cursor — reads as «the
 * button is attracted to the cursor». Outside the radius the element
 * animates back to (0, 0) on easeBrand for a snap-but-not-bouncy release.
 *
 * Brand discipline:
 *   - NO spring (per BrandEssence cube-rule §6 «no decorative bouncy
 *     springs»). Linear ease via easeBrand SOT.
 *   - 200ms (durations.fast) return cycle — fast enough that re-entry mid-
 *     release reads as continuous, not whip-then-snap.
 *
 * RM threading: useReducedMotion gates the entire effect — when prefers-
 * reduced-motion is true, the listener is never registered and motion
 * values stay at 0. Style still returned so caller can mount unconditionally.
 *
 * Performance: window-level mousemove listener with getBoundingClientRect
 * inside handler. Per page we expect ≤3 magnet hooks (Hero × 2 + Flagship
 * × 1) — 3 listeners + 3 boundingRect reads per mouse event is well under
 * 60fps frame budget on desktop.
 *
 * Usage:
 *   const magnet = useMagnet();
 *   <motion.div ref={magnet.ref} style={magnet.style} className="inline-block">
 *     <Link to="/...">CTA</Link>
 *   </motion.div>
 *
 * Returned ref is intentionally typed as RefObject<HTMLElement> so it works
 * with motion.div / motion.a / motion.button without per-call casting.
 */
import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  animate,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { easeBrand, durations } from '../lib/motionVariants';

interface UseMagnetOptions {
  /** Magnetic field radius in CSS pixels (default 80). */
  radius?: number;
  /** Fraction of cursor-offset translated to the element (default 0.3). */
  strength?: number;
}

interface UseMagnetReturn {
  ref: React.RefObject<HTMLElement | null>;
  style: { x: MotionValue<number>; y: MotionValue<number> };
}

export function useMagnet({
  radius = 80,
  strength = 0.3,
}: UseMagnetOptions = {}): UseMagnetReturn {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else if (x.get() !== 0 || y.get() !== 0) {
        animate(x, 0, { duration: durations.fast, ease: easeBrand });
        animate(y, 0, { duration: durations.fast, ease: easeBrand });
      }
    }

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [prefersReducedMotion, radius, strength, x, y]);

  return { ref, style: { x, y } };
}
