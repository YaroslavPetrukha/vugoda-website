/**
 * @module components/sections/home/Hero
 *
 * W7 Hybrid Hero — P0 layout rebuild ($impeccable critique → layout).
 *
 * Replaces the centered-stack 2014-SaaS template silhouette
 * (`mx-auto items-center text-center`) with an asymmetric 12-col grid
 * that promotes the honest 1·4·0 portfolio truth to display-tier visual
 * hero, while keeping the wordmark + descriptor present as a quiet
 * signature at bottom-left:
 *
 *   ┌─ vertical-rl edge label «ЛЬВІВ · UA-46»
 *   │
 *   ├─ LEFT 7/12 — text-anchored stats column
 *   │   ┌ overline «Портфель ВИГОДА · станом на 2026»
 *   │   │ ┌─────────────────────────────────────────┐
 *   │   │ │ 01      04      00                       │
 *   │   │ │ active  pipeline delivered  ← display tier
 *   │   │ │ ━━━━━━━━━━━━━━━━━━━━━━━ ← accent bar      │
 *   │   │ │ slogan (mixed-weight)                    │
 *   │   │ │ [Усі 5 проєктів]  Контакт                │
 *   │   │ └─────────────────────────────────────────┘
 *   │   └ wordmark + descriptor (small signature)
 *   │
 *   └─ RIGHT 5/12 — Lakeview aerial photo (right 42% width, opacity 0.55)
 *       └ photo caption «Lakeview · Винники · …»
 *
 * Display tier: stats at --text-display (clamp 120-240px) — the brand's
 * reserved «3-4 display moments per site» quota now allocates one to the
 * stats trio. Active=01 in accent (#C1F33D); pipeline=04 in text; delivered=00
 * in muted/40 (visually receded — honest about «0 здано»).
 *
 * Photo composition: backdrop occupies right 42% width only. Soft 128px
 * gradient mask on the photo's left edge avoids hard seam. Photo opacity
 * bumped 0.32 → 0.55 because it no longer fights centred text — only
 * lives on the right half where the LEFT column is on solid bg-bg.
 *
 * Vertical edge label: writing-mode vertical-rl, far-left absolute pos,
 * Pattern 8 from AUDIT-DESIGN. Names the city + region code; reads as
 * registry annotation, not marketing flourish.
 *
 * Wordmark signature: ~32px lowercase Bold, anchored at the BOTTOM-LEFT
 * of the LEFT column. Descriptor «системний девелопмент» follows in
 * overline tier. Hero no longer claims the wordmark as visual hero —
 * the navbar already carries the lockup; this is a film-poster signature.
 *
 * Letter-by-letter wordmark mask reveal removed in W7 — the wordmark
 * is no longer the visual hero, so the cinematic intro has no anchor.
 * Stage 4 ($impeccable animate) will introduce a NEW signature gesture
 * tied to the stats (count-up + accent-bar draw).
 *
 * Parallax preserved — photo translates DOWN, grid translates UP, both
 * skipParallax-gated (RM + heroSeen sessionFlag) per Phase 5 D-25.
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
  heroLocation,
  heroEdgeLabel,
  heroPortfolioOverline,
  heroStatActive,
  heroStatPipeline,
  heroStatDelivered,
  heroStatActiveLabel,
  heroStatPipelineLabel,
  heroStatDeliveredLabel,
  heroSloganLead,
  heroSloganTail,
  heroCta,
  heroSecondaryCta,
  heroDescriptor,
} from '../../../content/home';
import {
  photoParallaxRange,
  heroPhotoReveal,
  heroGridReveal,
  heroStackContainer,
  heroStackItem,
} from '../../../lib/motionVariants';
import { useMagnet } from '../../../hooks/useMagnet';
import { useContactPopup } from '../../forms/ContactPopupProvider';
import { overlineClasses } from '../../ui/typography';
import { CountUp } from '../../ui/CountUp';
import { AccentBar } from '../../ui/AccentBar';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // W8 — `skipReveal` gates one-shot entrance clip-path wipes; `skipParallax`
  // gates continuous-axis motions (scroll Y-parallax, scroll rotation, drift
  // loop). Both now collapse to `prefersReducedMotion` only — for the demo
  // URL handed to the client, every visit should land as a fresh first-time
  // experience. The heroSeen sessionFlag (D-25 throttle on revisit-cinema)
  // is dropped: the original concern was «restless re-firing» on repeated
  // navigation, but in practice the slow 90s drift + sub-pixel scroll deltas
  // are below the perceptual restless threshold.
  const skipReveal = prefersReducedMotion;
  const skipParallax = prefersReducedMotion;
  const primaryMagnet = useMagnet();
  const secondaryMagnet = useMagnet();
  const contactPopup = useContactPopup();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // W8 Beat 4 replaces scroll-driven Y-parallax with continuous drift loop
  // (defined inside heroGridReveal `visible` variant). Y-component is now
  // owned by the drift; scroll axis carries rotation only.

  // W8 Beat 4 — scroll-driven rotation on iso-grid (motion-framer §Scroll-
  // Based Animations). 0° at top → 2.5° at hero-bottom-leaves-viewport.
  // Subtle rotation gives the grid spatial dimensionality matching the
  // isometric vocabulary; capped at 2.5° to stay below «dizzy» threshold.
  // skipParallax-gated (RM + heroSeen) — same gate as parallax Y so
  // continuous-axis motions disappear together on revisit / RM.
  const gridRotate = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [0, 2.5],
  );

  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [...photoParallaxRange],
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-bg"
    >
      {/* Layer 1 — RIGHT-half photo backdrop. Cropped to right 42% via absolute
          positioning; 128px gradient mask on left edge softens seam to bg-bg.
          Opacity 0.55 — higher than W1's 0.32 because LEFT column is solid bg
          and the photo no longer fights centred text. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-[0.55] lg:block"
        style={{ y: photoY }}
        variants={skipReveal ? undefined : heroPhotoReveal}
        initial={skipReveal ? false : 'hidden'}
        animate={skipReveal ? undefined : 'visible'}
      >
        <ResponsivePicture
          src="renders/lakeview/aerial.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          sizes="42vw"
          className="h-full w-full object-cover"
          skeleton={false}
        />
        {/* Soft seam — 128px bg-to-transparent fade on photo's left edge.
            Not a decorative gradient (banned on lines/strokes); functional
            mask between text-half and photo-half. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent"
        />
      </motion.div>

      {/* Layer 2 — isometric grid overlay.
          OUTER motion.div: W8 Beat 1 (L→R clip-path wipe on first paint) +
          scroll-driven Y-parallax + scroll-driven rotation (Beat 4).
          INNER motion.div: continuous diagonal drift loop (Beat 4) — 90s cycle
          ±25px X / ±15px Y. Reads as «engineering trace alive» without
          being decorative. Drift gated on skipParallax (RM + heroSeen)
          alongside scroll-driven motions so continuous-axis behavior stays
          consistent. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ rotate: gridRotate }}
        variants={skipReveal ? undefined : heroGridReveal}
        initial={skipReveal ? false : 'hidden'}
        animate={skipReveal ? undefined : 'visible'}
      >
        {/* Inner CSS-driven drift wrapper — pure @keyframes loop applied
            via .iso-drift utility (defined in src/index.css). Lives as a
            child div so the parent's Motion-driven rotate transform stays
            isolated and doesn't conflict with the drift's translate(). */}
        <div className={`h-full w-full ${skipParallax ? '' : 'iso-drift'}`}>
          <IsometricGridBG className="h-full w-full" opacity={0.12} />
        </div>
      </motion.div>

      {/* Vertical edge label — far-left, writing-mode vertical-rl. Reads as
          registry annotation (city + region code). Pattern 8 sticky-side label.
          aria-hidden because the same locale info appears in the photo caption +
          nav contact line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 z-10 -translate-y-1/2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className={`${overlineClasses} text-text-muted`}>
          {heroEdgeLabel}
        </span>
      </div>

      {/* Main grid — asymmetric 12-col, generous left+right gutters so the
          edge label has air (left-6 absolute), stats column never butts the
          edge, and the photo gets its full 42% on the right. */}
      <div className="relative z-10 mx-auto grid h-full max-w-[1600px] grid-cols-12 gap-8 px-16 pt-16 pb-10">
        {/* LEFT 7/12 — text-anchored stats column.
            W8 entrance: 3-beat cascade (overline → middle block → wordmark)
            via heroStackContainer/Item. Plays once on first mount, NOT
            gated by heroSeen sessionFlag (parallax stays gated; entrance
            is the deliberate compose-and-reveal moment). RM users bypass
            the variants entirely (initial=false, no animate). */}
        <motion.div
          className="col-span-12 flex min-h-[calc(100vh-176px)] flex-col justify-between lg:col-span-7"
          variants={prefersReducedMotion ? undefined : heroStackContainer}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
        >
          {/* Top row — portfolio overline (frames the stats below) */}
          <motion.p
            variants={prefersReducedMotion ? undefined : heroStackItem}
            className={`${overlineClasses} text-text-muted`}
          >
            {heroPortfolioOverline}
          </motion.p>

          {/* Middle column — display stats + accent bar + slogan + CTAs */}
          <motion.div
            variants={prefersReducedMotion ? undefined : heroStackItem}
            className="flex flex-col gap-12"
          >
            {/* 3-up display stats. Active=accent, pipeline=text, delivered=muted/40.
                Honest 1·4·0 portfolio truth at the brand's display tier. */}
            <div
              role="list"
              aria-label="Портфель ВИГОДА — 1 активний, 4 у розробці, 0 здано"
              className="flex flex-wrap items-baseline gap-x-12 gap-y-6"
            >
              <div role="listitem" className="flex flex-col gap-3">
                <CountUp
                  to={Number(heroStatActive)}
                  pad={2}
                  duration={1.6}
                  delay={0}
                  className="text-[length:var(--text-display)] font-bold leading-[0.85] tabular-nums text-accent"
                />
                <span className={`${overlineClasses} text-text-muted`}>
                  {heroStatActiveLabel}
                </span>
              </div>
              <div role="listitem" className="flex flex-col gap-3">
                <CountUp
                  to={Number(heroStatPipeline)}
                  pad={2}
                  duration={2.0}
                  delay={0.15}
                  className="text-[length:var(--text-display)] font-bold leading-[0.85] tabular-nums text-text"
                />
                <span className={`${overlineClasses} text-text-muted`}>
                  {heroStatPipelineLabel}
                </span>
              </div>
              <div role="listitem" className="flex flex-col gap-3">
                {/* Delivered = 00 — CountUp from 0 to 0 is a no-op visual,
                    but kept on the same primitive so the stat trio shares
                    one rendering surface (tabular-nums alignment, RM
                    branch). The stat is honest: nothing animates because
                    nothing is delivered. */}
                <CountUp
                  to={Number(heroStatDelivered)}
                  pad={2}
                  duration={1.2}
                  delay={0.3}
                  className="text-[length:var(--text-display)] font-bold leading-[0.85] tabular-nums text-text-muted/40"
                />
                <span className={`${overlineClasses} text-text-muted`}>
                  {heroStatDeliveredLabel}
                </span>
              </div>
            </div>

            {/* Lime accent bar — punctuation between stats and slogan.
                Animated draw-on-view via AccentBar (origin-left scaleX). */}
            <AccentBar width={128} />

            {/* Slogan — mixed-weight Bold lead + Medium tail. Names what the
                stats above mean in one sentence. Max-w-2xl keeps line length
                in the 65-75ch readable band. */}
            <p className="max-w-2xl text-[length:var(--text-lead)] leading-snug text-text">
              <span className="font-bold">{heroSloganLead}</span>{' '}
              <span className="font-medium text-text-muted">
                {heroSloganTail}
              </span>
            </p>

            {/* CTA pair — left-aligned (NOT centered). Magnet hover preserved
                (RM-gated inside hook). Primary stays bg-accent, secondary
                stays underline-on-hover for hierarchy. */}
            <div className="flex flex-wrap items-center gap-8">
              <motion.div
                ref={primaryMagnet.ref as React.RefObject<HTMLDivElement>}
                style={primaryMagnet.style}
                className="inline-block"
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black transition-[transform,filter] duration-150 ease-out hover:brightness-110 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
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
                  className="inline-flex items-center text-base font-medium text-text underline-offset-4 transition-transform duration-150 ease-out hover:underline active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {heroSecondaryCta}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom row — small wordmark signature.
              h1 lives here (semantic): the canonical brand title is still
              the page H1 for SEO + outline integrity. Visually relegated
              to film-poster signature; visual hero is the stats above. */}
          <motion.div
            variants={prefersReducedMotion ? undefined : heroStackItem}
            className="flex items-baseline gap-3 pt-8"
          >
            <h1 className="text-3xl font-bold lowercase leading-none tracking-tight text-text">
              {heroWordmark}
            </h1>
            <span
              aria-hidden="true"
              className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted"
            >
              — {heroDescriptor}
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT 5/12 — visual photo half (photo absolute-positioned above this
            column at z-0). This col holds the photo caption only, anchored
            bottom-right so reader can identify what they see. */}
        <div className="hidden flex-col justify-end lg:col-span-5 lg:flex">
          <p
            className={`${overlineClasses} text-text/80`}
            style={{ textShadow: '0 1px 2px rgba(2,10,10,0.4)' }}
          >
            {heroLocation}
          </p>
        </div>
      </div>
    </section>
  );
}
