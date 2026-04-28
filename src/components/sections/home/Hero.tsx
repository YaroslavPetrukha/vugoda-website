/**
 * @module components/sections/home/Hero
 *
 * Cinematic Hero — P1-D1 rebuild (AUDIT-DESIGN §9.1, §4.3, §10 Pattern 3).
 *
 * Layered composition (z-order, bottom → top):
 *   z-0  bg-bg base color
 *   z-1  Photo backdrop (Lakeview aerial render @ opacity 0.18) — slow
 *        parallax DOWN (counter-direction to grid). LCP-eager.
 *   z-2  IsometricGridBG @ opacity 0.15 — slow parallax UP. Existing.
 *   z-10 Counter strip top-left — 1·4·0 honest data tile (text-overline).
 *   z-10 Wordmark «вигода» (lowercase, text-display Bold) — letter-by-letter
 *        mask-reveal on first visit (Pattern 3, easeBrand 0.5s/letter,
 *        stagger 60ms). RM-gated and session-gated.
 *   z-10 Mixed-weight slogan — Bold lead + Medium tail (AUDIT-DESIGN §4.2).
 *   z-10 CTA pair — primary bg-accent + secondary underline-on-hover.
 *
 * Parallax recipe (Phase 5 D-04 + D-22):
 *   - useScroll scoped to hero section (target: heroRef)
 *   - Grid translates UP    [0, -100] (parallaxRange,        SOT)
 *   - Photo translates DOWN [0, +60]  (photoParallaxRange,   SOT)
 *   - Linear (no spring/bounce per brand discipline §6).
 *
 * Reduced-motion + session-skip (Phase 5 D-17..D-21):
 *   - prefersReducedMotion (Motion's hook) → output ranges collapse to [0, 0]
 *   - heroSeen (sessionStorage) → revisit also collapses ranges (cinematic
 *     intro skipped per SC#5 — demo-pitch reload doesn't re-watch).
 *   - skipParallax = prefersReducedMotion || heroSeen
 *   - Letter-reveal also gated by skipParallax: when true, wordmark renders
 *     with no variants and is statically visible (no flash-of-hidden).
 *
 * Brand discipline:
 *   - Wordmark lowercase resolves duo-brand pairing (logo is lowercase).
 *   - 6-color palette: bg/text/accent/text-muted only. No glow/shadow/spring.
 *   - mix-blend-mode: difference deferred to W2+ when photo strip + video
 *     layer richen the backdrop tonally — at W1 photo @ 0.18 opacity is too
 *     thin for difference to read brand-faithfully.
 *
 * NO inline Motion transition objects — Phase 5 SOT in motionVariants.ts.
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { IsometricGridBG } from '../../brand/IsometricGridBG';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import {
  heroWordmark,
  heroCounter,
  heroLocation,
  heroSloganLead,
  heroSloganTail,
  heroCta,
  heroSecondaryCta,
} from '../../../content/home';
import {
  parallaxRange,
  photoParallaxRange,
  heroIntroParent,
  heroLetter,
  heroPhotoReveal,
} from '../../../lib/motionVariants';
import { useSessionFlag } from '../../../hooks/useSessionFlag';
import { useMagnet } from '../../../hooks/useMagnet';
import { useContactPopup } from '../../forms/ContactPopupProvider';
import { overlineClasses } from '../../ui/typography';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const heroSeen = useSessionFlag('vugoda:hero-seen');
  const skipParallax = prefersReducedMotion || heroSeen;
  const primaryMagnet = useMagnet();
  const secondaryMagnet = useMagnet();
  const contactPopup = useContactPopup();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const gridY = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [...parallaxRange],
  );

  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [...photoParallaxRange],
  );

  // Split wordmark to characters for letter-by-letter reveal. aria-label on
  // <h1> carries the full word so screen-readers read it once, not 6 times.
  const wordmarkChars = [...heroWordmark];

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg"
    >
      {/* Layer 1 — photo backdrop (Lakeview aerial), slow parallax DOWN.
          First-paint image-reveal: L→R clip-path wipe (M0b), gated by
          skipParallax so RM/heroSeen revisits get a static visible photo.
          aria-hidden because alt context lives in PortfolioOverview below. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{ y: photoY }}
        variants={skipParallax ? undefined : heroPhotoReveal}
        initial={skipParallax ? false : 'hidden'}
        animate={skipParallax ? undefined : 'visible'}
      >
        <ResponsivePicture
          src="renders/lakeview/aerial.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="h-full w-full object-cover"
          skeleton={false}
        />
      </motion.div>

      {/* Layer 2 — isometric grid overlay, slow parallax UP (existing). */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: gridY }}
      >
        <IsometricGridBG className="h-full w-full" opacity={0.15} />
      </motion.div>

      {/* Counter strip — top-left, honest 1·4·0 data tile + sub-line that
          names the active flagship. Two-line stack with tighter tracking on
          the location anchor (audit P1-COPY: localize-first, name the city). */}
      <div className="absolute top-12 left-12 z-10 flex flex-col gap-1.5">
        <p className={`${overlineClasses} text-text-muted`}>{heroCounter}</p>
        <p className="text-xs font-medium tracking-[0.06em] text-text/70">
          {heroLocation}
        </p>
      </div>

      {/* Hero content stack — max-w-7xl per D-24. */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">
        {/*
         * Wordmark — lowercase «вигода», letter-by-letter mask reveal.
         * <h1> carries aria-label with the full word (single SR announcement);
         * each <span> is aria-hidden so the SR doesn't read 6 letters.
         * Inner <span> wrapper has overflow-hidden — clips y: 100% hidden
         * state to produce the mask effect (motionVariants.ts contract).
         */}
        <motion.h1
          aria-label={heroWordmark}
          className="text-[length:var(--text-display)] font-bold leading-[0.85] tracking-tight text-text"
          variants={skipParallax ? undefined : heroIntroParent}
          initial={skipParallax ? false : 'hidden'}
          animate={skipParallax ? undefined : 'visible'}
        >
          <span className="inline-flex overflow-hidden pb-[0.05em]">
            {wordmarkChars.map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                variants={skipParallax ? undefined : heroLetter}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Mixed-weight slogan — Bold lead + Medium tail. Spans carry
            visible text content for SR (no aria-label / no aria-hidden);
            audit fix vs prior aria-label-on-p-with-aria-hidden-children
            redundant pattern. The space between spans concatenates as
            normal whitespace at SR level. */}
        <p className="max-w-3xl text-[length:var(--text-lead)] leading-snug text-text">
          <span className="font-bold">{heroSloganLead}</span>{' '}
          <span className="font-medium text-text-muted">{heroSloganTail}</span>
        </p>

        {/* CTA pair — primary bg-accent, secondary underline-on-hover.
            gap-8 = 32px per spacing rhythm-lg. Each CTA wrapped in
            motion.div with useMagnet (P1-M1) — RM-gated inside the hook. */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          <motion.div
            ref={primaryMagnet.ref as React.RefObject<HTMLDivElement>}
            style={primaryMagnet.style}
            className="inline-block"
          >
            <Link
              to="/projects"
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
            >
              {heroCta}
            </Link>
          </motion.div>
          <motion.div
            ref={secondaryMagnet.ref as React.RefObject<HTMLDivElement>}
            style={secondaryMagnet.style}
            className="inline-block"
          >
            <button
              type="button"
              onClick={() =>
                contactPopup.open({
                  subject: 'Запит з Hero — vugoda',
                })
              }
              className="inline-flex items-center text-base font-medium text-text underline-offset-4 hover:underline"
            >
              {heroSecondaryCta}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
