/**
 * @module components/ui/CountUp
 *
 * Count-up animation primitive — P1-M3 (AUDIT-MOTION + AUDIT-DESIGN §10
 * Pattern 5).
 *
 * Animates a number from 0 to `to` over `duration` seconds when the
 * element scrolls into view. Used for «доказовий» figure-tiles —
 * primarily TrustBlock's ЄДРПОУ 8-digit tile, where the visible build-up
 * frames the number as a fact being summoned, not a static label.
 *
 * Implementation notes:
 *   - useInView with `once: true` — fires count-up exactly once per
 *     mount; scrolling back doesn't re-animate (would feel jittery).
 *   - useMotionValue + useTransform — Motion-native imperative animation
 *     pipeline; no React re-renders per frame.
 *   - Easing easeBrand (D-22 SOT lockstep with --ease-brand CSS var).
 *   - prefersReducedMotion → initial value already at `to`, animate hook
 *     bails — SR users + motion-sensitive users see the final figure
 *     immediately (essential animation exception per WCAG 2.3.3).
 *   - aria-label on the wrapping <span> = final formatted value, so
 *     screen-readers announce the figure once, not as a stream of
 *     intermediate ticks during the count-up.
 *
 * Format:
 *   - default Math.round (no thousand separators) — fits 8-digit codes
 *     like ЄДРПОУ. Future v2 may add a `format` prop for currencies
 *     (uk-UA `Intl.NumberFormat`); skip for MVP.
 *
 * Brand:
 *   - No spring, no bounce. Pure tween with easeBrand cubic-bezier.
 *   - className passes through so consumers carry the figure-size +
 *     accent-color + tabular-nums utilities — primitive stays
 *     style-agnostic.
 */

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'motion/react';
import { easeBrand } from '../../lib/motionVariants';

interface CountUpProps {
  /** Final integer value the count-up settles on. */
  to: number;
  /** Animation duration in seconds. Default 2.4. */
  duration?: number;
  /** className passthrough — style the span at the consumer site. */
  className?: string;
  /** Zero-pad the rendered integer to this digit count.
   *  Use for ordinal-style display: pad=2 renders 1 as «01», 4 as «04».
   *  When omitted, no padding is applied. */
  pad?: number;
  /** Seconds to delay count-up start after element enters view.
   *  Used by Hero's stat trio to cascade-stagger 3 figures by 0.15s
   *  per Emil («stagger creates cascading effect that feels more
   *  natural than everything at once»). Default 0. */
  delay?: number;
}

const formatInt = (n: number, pad?: number): string => {
  const s = Math.round(n).toString();
  return pad ? s.padStart(pad, '0') : s;
};

export function CountUp({
  to,
  duration = 2.4,
  className,
  pad,
  delay = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const value = useMotionValue(prefersReducedMotion ? to : 0);
  const rounded = useTransform(value, (latest) => formatInt(latest, pad));
  const [display, setDisplay] = useState<string>(
    prefersReducedMotion ? formatInt(to, pad) : formatInt(0, pad),
  );

  // Subscribe to the MotionValue and mirror to React state so the rendered
  // span re-renders with the latest integer. useTransform alone doesn't
  // trigger re-render — it's reactive only via the on-change subscription.
  useEffect(() => rounded.on('change', setDisplay), [rounded]);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const controls = animate(value, to, { duration, ease: easeBrand, delay });
    return controls.stop;
  }, [inView, prefersReducedMotion, to, duration, delay, value]);

  return (
    <motion.span ref={ref} aria-label={formatInt(to, pad)} className={className}>
      {display}
    </motion.span>
  );
}
