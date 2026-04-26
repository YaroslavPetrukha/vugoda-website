/**
 * @module lib/motionVariants
 *
 * Phase 5 SOT — variants, easings, durations for the Motion layer.
 *
 * Named exports per CONTEXT D-22 — NO namespace object, NO default export.
 * Consumers (Phase 5):
 *   - <RevealOnScroll> (Plan 05-03) consumes fadeUp · fade · stagger
 *   - <AnimatePresence> in Layout.tsx (Plan 05-06) consumes pageFade
 *   - Hero.tsx (Plan 05-07) consumes parallaxRange + easeBrand transitively
 *
 * COUPLING RULE — D-23: easeBrand here MUST stay in lockstep with the
 * --ease-brand CSS variable in src/index.css @theme block. Two physical
 * representations of the SAME brand easing curve (4-tuple here, CSS-string
 * form there). If you change one, change both. Drift means Tailwind hover
 * utilities and Motion variants animate on different curves — invisible
 * regression on visual QA.
 *
 * Pure config module — NO React imports, NO component imports.
 * Type-only import of Variants from motion/react is permitted.
 */
import type { Variants } from 'motion/react';

export const easeBrand = [0.22, 1, 0.36, 1] as const;

export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 1.2,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easeBrand },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easeBrand },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
};

export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easeBrand },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: easeBrand },
  },
};

export const parallaxRange = [0, -100] as const;
