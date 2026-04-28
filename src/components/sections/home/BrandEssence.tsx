/**
 * @module components/sections/home/BrandEssence
 *
 * Manifesto-block — P1-D2 rebuild (AUDIT-DESIGN §9.2).
 *
 * Replaces the prior 2×2 numbered grid with a vertical stack of 4
 * manifesto-cards. Each card carries:
 *   - IsometricCube 64×64 with accent stroke (one of the 3 brand-allowed
 *     stroke colors per IsometricCube primitive contract).
 *   - h3 bumped to text-h3 (clamp 28-40px) — was text-2xl 24px.
 *   - Body bumped to text-lead (clamp 20-24px) text-text — was text-base
 *     muted. Note: text-text on bg-bg is 10.5:1 AAA per brand-system §3.
 *   - 64×1px accent-bar that draws on scroll-into-view (origin-left).
 *
 * RM threading: useReducedMotion gates the bar — when prefers-reduced
 * is true, render a static full-width <span> instead of the scaling
 * motion.span. Card stagger reveal stays via <RevealOnScroll> which
 * already threads RM internally.
 *
 * Brand:
 *   - 6-color palette only. accent stroke + text-text body.
 *   - No drop-shadow, no glow, no spring. Pure scaleX transition for bar.
 *   - Cube primitive locked to brand contract (IsometricCube §5).
 *
 * Cube-restriction note: Phase 3 D-11 limited cube use to hero overlay
 * + AggregateRow on home. AUDIT-DESIGN §10 Pattern 6 explicitly proposes
 * "SVG cubes everywhere" including BrandEssence (4 cubes). This rebuild
 * adopts that recommendation; D-11 is superseded by AUDIT recommendation
 * for W2+.
 */

import { motion } from 'motion/react';
import { brandValues } from '../../../content/values';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline } from '../../ui/typography';
import { AccentBar } from '../../ui/AccentBar';
import { AnimatedMark } from '../../brand/AnimatedMark';
import { fadeUp } from '../../../lib/motionVariants';
import {
  brandEssenceOverline,
  brandEssenceHeading,
} from '../../../content/home';
import isometricGridUrl from '../../../../brand-assets/patterns/isometric-grid.svg';

export function BrandEssence() {
  return (
    <RevealOnScroll as="section" className="relative overflow-hidden bg-bg py-40">
      {/* Brand isometric-grid overlay — left edge, top-anchored, masked
          fade. Reads as engineering-trace texture under the manifesto rows
          without competing with display-tier «01 / 04» numerals. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[80%] w-[35%] opacity-[0.05] lg:block"
        style={{
          backgroundImage: `url(${isometricGridUrl})`,
          backgroundSize: '440px 334px',
          backgroundRepeat: 'repeat',
          // W8 fix — radial mask anchored at top-left corner; see
          // ConstructionTeaser for full rationale on hard-edge avoidance.
          maskImage:
            'radial-gradient(circle 600px at left top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage:
            'radial-gradient(circle 600px at left top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section frame — overline + bumped H2. */}
        <header className="mb-20 max-w-3xl">
          <SectionOverline className="mb-4">{brandEssenceOverline}</SectionOverline>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {brandEssenceHeading}
          </h2>
        </header>

        {/* 4 manifesto-cards stacked vertical, divider-on-top.
            W3: ratio-numeral column (3/12) prepended — display-l figure
            «01 / 04» reads as editorial chapter marker, not decoration.
            Audit P1-D2: «ratio number 01/04 у display-розмірі». */}
        <RevealOnScroll staggerChildren className="flex flex-col">
          {brandValues.map((value, i) => {
            const ordinal = String(i + 1).padStart(2, '0');
            const total = String(brandValues.length).padStart(2, '0');
            return (
              <motion.article
                key={value.title}
                variants={fadeUp}
                className="relative grid grid-cols-12 gap-8 overflow-hidden border-t border-text-muted/15 py-16"
              >
                {/* Ratio-numeral column (left 3/12). Figure-tier typography,
                    text-muted/40 so the number reads as quiet chapter marker.
                    «01 / 04» pattern: ordinal in accent, denominator muted —
                    visitor reads «1 з 4», not a vanity counter.
                    aria-hidden because the heading h3 carries the semantic
                    chapter intent; SR shouldn't read the ordinal twice. */}
                <div
                  aria-hidden="true"
                  className="relative z-10 col-span-12 flex items-baseline gap-2 lg:col-span-3"
                >
                  <span className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-accent">
                    {ordinal}
                  </span>
                  <span className="text-2xl font-medium tabular-nums text-text-muted/50">
                    / {total}
                  </span>
                </div>

                {/* Cube + heading column (middle 4/12). */}
                <div className="relative z-10 col-span-12 flex flex-col gap-6 lg:col-span-4">
                  {/* W8 Beat 2: drawable mark — top → left → right faces
                      stroke-on as user scrolls each card into view (svg-animations
                      + motion-framer pathLength). Each card animates independently
                      via whileInView once-mode; ratio numerals stay static. */}
                  <AnimatedMark
                    stroke="#C1F33D"
                    strokeWidth={1.5}
                    opacity={0.9}
                    className="h-16 w-14"
                  />
                  <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
                    {value.title}
                  </h3>
                </div>

                {/* Body column (right 5/12). text-text not muted —
                    manifesto body deserves full luminance. */}
                <div className="relative z-10 col-span-12 flex flex-col gap-8 lg:col-span-5">
                  <p className="text-[length:var(--text-lead)] leading-relaxed text-text">
                    {value.body}
                  </p>

                  <AccentBar />

                </div>
              </motion.article>
            );
          })}
        </RevealOnScroll>
      </div>
    </RevealOnScroll>
  );
}
