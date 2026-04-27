/**
 * @module components/ui/AccentBar
 *
 * 64×1px accent-bar punctuation — extracted after simplify skill review.
 *
 * Used 3+ times across W1-W5 design patterns (BrandEssence card divider,
 * MethodologyTeaser card divider, ZhkWhatsHappening editorial closer)
 * with verbatim-identical JSX shape including the RM JSX-branch:
 *
 *   prefersReducedMotion
 *     ? <span static at 100% width>
 *     : <motion.span scaleX 0→1 origin-left whileInView>
 *
 * Encapsulating the branch removes 14 lines per consumer + centralises
 * the RM-threading contract — future motion-wave changes to the bar
 * happen in one place, not three.
 *
 * Brand:
 *   - bg-accent (the only place pure accent appears outside CTAs)
 *   - h-px (1px) × default 64px width
 *   - origin-left scaleX with motionVariants.accentBarDraw (D-22 SOT)
 *   - aria-hidden — purely decorative punctuation
 *
 * RM threading: useReducedMotion gates motion.span vs static <span>.
 * The static <span> renders at full 64px width (no draw, no fade-in)
 * — implements the «essential animation» exception of WCAG 2.3.3.
 *
 * Customisation:
 *   - `width` prop: override the default 64px (BrandEssence may want
 *     wider in v2). Pass numeric pixels.
 *   - `className`: extra utilities (e.g. `mt-12` for spacing). The
 *     canonical block + h-px + bg-accent + origin-left classes are
 *     baked in; consumer adds layout context only.
 */

import { motion, useReducedMotion } from 'motion/react';
import { accentBarDraw } from '../../lib/motionVariants';

interface AccentBarProps {
  /** Bar width in pixels. Default 64 (brand standard). */
  width?: number;
  /** Extra utility classes — usually spacing (mt-*, mb-*). */
  className?: string;
}

export function AccentBar({ width = 64, className }: AccentBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const extra = className ? ` ${className}` : '';

  if (prefersReducedMotion) {
    return (
      <span
        aria-hidden="true"
        className={`block h-px bg-accent${extra}`}
        style={{ width }}
      />
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px origin-left bg-accent${extra}`}
      style={{ width }}
      variants={accentBarDraw}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    />
  );
}
