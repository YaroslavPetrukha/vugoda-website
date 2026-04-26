/**
 * @module components/ui/RevealOnScroll
 *
 * ANI-02 — sole entry-on-scroll reveal API for Phase 5.
 *
 * Wraps children in a Motion <motion.{as}> with whileInView + a single
 * IntersectionObserver per instance. When useReducedMotion() is true,
 * renders children directly inside a plain <as> tag — NO motion wrapper,
 * NO IO observer (D-25 + RESEARCH Risk 4: simpler unwrap is correct for
 * MVP, runtime RM-toggle edge case is acceptable trade).
 *
 * Default variant = fadeUp (opacity 0 + y:24 → opacity 1 + y:0 over 400ms
 * with easeBrand). Override with variant={fade} for LCP-sensitive surfaces
 * per D-09 (e.g. ZhkHero on /zhk/etno-dim — Y-translate would delay paint).
 *
 * Stagger orchestration:
 *   staggerChildren={true}    → 80ms cadence (D-02 canonical)
 *   staggerChildren={120}     → 120ms cadence (caller-specified ms)
 *   delayChildren={80}        → 80ms beat before first child reveals
 * When staggerChildren is set, children must opt in by being
 * <motion.div variants={fadeUp}> (or pass `variant` prop) — see consumer
 * plans 05-04 and 05-05.
 *
 * Viewport: { once: true, margin: '-50px' } per D-07. Once: true means
 * scrolling away and back does NOT replay (no re-trigger flicker). Margin
 * -50px triggers reveal slightly before section enters the viewport — feels
 * natural rather than mechanically-on-edge.
 *
 * NO inline Motion transition objects — Phase 5 SOT in motionVariants.ts
 * carries duration + ease via variants only (SC#1 grep gate).
 */
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { fadeUp, stagger } from '../../lib/motionVariants';

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: ElementType;
  variant?: Variants;
  staggerChildren?: boolean | number;
  delayChildren?: number;
  className?: string;
  children: ReactNode;
}

export function RevealOnScroll({
  as = 'div',
  variant = fadeUp,
  staggerChildren = false,
  delayChildren = 0,
  className,
  children,
  ...rest
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const Component = (motion[as as keyof typeof motion] ?? motion.div) as ElementType;
  const parentVariant: Variants = staggerChildren
    ? {
        ...stagger,
        visible: {
          ...((stagger.visible as object) ?? {}),
          transition: {
            staggerChildren:
              typeof staggerChildren === 'number' ? staggerChildren / 1000 : 0.08,
            delayChildren: delayChildren / 1000,
          },
        },
      }
    : variant;

  return (
    <Component
      className={className}
      variants={parentVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      {...rest}
    >
      {children}
    </Component>
  );
}
