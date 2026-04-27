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

/**
 * Cinematic page-curtain — P1-M0a route transitions (AUDIT-MOTION).
 *
 * Continuous downward sweep:
 *   - hidden:  inset(0 0 100% 0)  — bottom-clipped, content invisible at start
 *   - visible: inset(0 0 0 0)     — fully revealed
 *   - exit:    inset(0 0 100% 0)  — same bottom-clip, content sweeps off
 *
 * Both enter and exit clip from BOTTOM upward, producing a continuous
 * «curtain rolling away» feel. AnimatePresence mode="wait" guarantees the
 * old page exits BEFORE the new page enters — no visual overlap.
 *
 * Coupling: easeBrand. Layout.tsx swaps to a 1-frame no-op opacity pair
 * under prefersReducedMotion (D-25 RM-threading lockstep) — clip-path
 * animation can read aggressive for motion-sensitive users.
 */
export const pageCurtain: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.6, ease: easeBrand },
  },
  exit: {
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.5, ease: easeBrand },
  },
};

export const parallaxRange = [0, -100] as const;

/** Photo-backdrop parallax — slower than IsometricGrid (counter-direction).
 *  Translates DOWN as user scrolls (positive Y). 60px keeps hero contained. */
export const photoParallaxRange = [0, 60] as const;

/**
 * Hero photo backdrop — first-paint image-reveal mask (P1-M0b, AUDIT-MOTION).
 *
 * Left-to-right clip-path wipe that emerges the Lakeview aerial backdrop
 * AFTER the page-curtain finishes. Reads as a deliberate camera-pan
 * establishing shot — distinct from the curtain's top-down sweep so the
 * two motions don't double up visually.
 *
 *   - hidden:  clipPath inset(0 100% 0 0)  — clipped from right, photo invisible
 *   - visible: clipPath inset(0 0 0 0)     — fully revealed
 *
 * Sequencing:
 *   - pageCurtain duration = 0.6s (route shell sweep)
 *   - heroPhotoReveal delay = 0.5s (slight overlap, photo emerges as
 *     curtain settles — passes the visual baton, no dead frame)
 *   - heroPhotoReveal duration = 1.0s (cinematic, slower than curtain)
 *
 * Coupling: easeBrand. Hero.tsx threads `skipParallax` (prefersReducedMotion
 * || heroSeen sessionFlag) — both states render the photo statically visible
 * with no clip animation. RM-threading lockstep per D-25.
 *
 * Composition note: Hero's photo motion.div ALSO carries `style={{ y: photoY }}`
 * (parallax motion value). Motion combines variants + style motion values
 * cleanly — clipPath animates while y stays driven by useScroll.
 */
export const heroPhotoReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0 0 0)',
    transition: { duration: 1.0, ease: easeBrand, delay: 0.5 },
  },
};

/**
 * Hero wordmark — letter-by-letter mask reveal (P1-D1, AUDIT-DESIGN §10 Pattern 3).
 *
 * Parent stages children with 60ms cadence and 200ms delay so the cinematic
 * intro reads "compose then reveal" — wordmark exists in the layout
 * (occupying space) before the letters slide up from clipped y: 100%.
 *
 * Companion easing: easeBrand (4-tuple), companion duration: 0.5s per letter.
 *
 * Wrapper around the letters MUST set `overflow: hidden` so the y: 100%
 * hidden state is clipped by the bounding box (mask effect, not just
 * fade-up). Hero.tsx is the consumer; consumer-side overflow is the contract.
 *
 * RM threading: Hero.tsx switches `initial`/`animate` props to skip variants
 * entirely when prefersReducedMotion || heroSeen — variant declarations
 * stay pure (no RM-aware branching here, lockstep rule per D-23).
 */
export const heroIntroParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

export const heroLetter: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easeBrand },
  },
};

/**
 * Accent-bar draw-on-scroll (P1-D2 BrandEssence dividers).
 *
 * 1×64px accent-bar that draws from the left edge as the section
 * enters viewport. Used as visual punctuation between manifesto-cards
 * (AUDIT-DESIGN §9.2 spec). Origin-left transform so the bar grows
 * left-to-right, not center-out.
 *
 * RM threading: consumer (BrandEssence) checks useReducedMotion and
 * renders a static <span> with full width when prefersReducedMotion is
 * true. Variant declaration stays pure per D-22 lockstep rule.
 */
export const accentBarDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easeBrand },
  },
};
