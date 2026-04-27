/**
 * @module components/sections/home/MethodologyTeaser
 *
 * Methodology editorial — P1-D5 rebuild (AUDIT-DESIGN §9.5 + §10 Pattern 6).
 *
 * Replaces the «3 muted parameters next to each other» grid with an
 * editorial 3-col composition where each block reads as one decisive
 * statement, not a sub-cell of a Word document.
 *
 * Per-block anatomy:
 *   - Big numeric tile «01 / 03 / 07» at top of column (text-display-l,
 *     opacity 0.20 — supportive, not screaming). Non-sequential 1/3/7
 *     conveys «we picked 3 of 8», not «1 2 3».
 *   - IsometricCube 48×48 with #A7AFBC stroke (subtle/secondary, NOT
 *     accent — varies the cube treatment from BrandEssence which uses
 *     accent stroke; brand cube-ladder needs varied surfaces per AUDIT
 *     §10 Pattern 6).
 *   - h3 bumped to text-h3 (clamp 28-40) — was text-xl 20px.
 *   - body bumped to text-lead text-text — was text-base muted.
 *   - 64×1px accent-bar at bottom, draw-on-scroll (origin-left scaleX)
 *     RM-gated via JSX branch.
 *
 * Section frame: «МЕТОДОЛОГІЯ · 3 / 8» overline + «Як ми будуємо» H2
 * bumped to text-h2 token. The «3 / 8» honest fraction is brand-faithful
 * (we picked 3 of 8 blocks for home).
 *
 * Selection: indexes [1, 3, 7] — all needsVerification: false. Defensive
 * ⚠-marker preserved if a future swap brings a needs-verification block.
 *
 * Reads methodologyBlocks from src/content/methodology.ts. NO inline
 * Ukrainian copy (Phase 2 D-20 / Phase 3 D-29).
 */

import { motion, useReducedMotion } from 'motion/react';
import { methodologyBlocks } from '../../../content/methodology';
import {
  methodologyVerificationWarning,
  methodologyOverline,
  methodologyHeading,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { IsometricCube } from '../../brand/IsometricCube';
import { fadeUp, accentBarDraw } from '../../../lib/motionVariants';

/** Block indexes to feature on home — all currently needsVerification: false. */
const FEATURED_INDEXES = [1, 3, 7] as const;

export function MethodologyTeaser() {
  const prefersReducedMotion = useReducedMotion();

  const featured = methodologyBlocks.filter((b) =>
    FEATURED_INDEXES.includes(b.index as 1 | 3 | 7),
  );

  return (
    <RevealOnScroll as="section" className="bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section frame — overline + bumped H2. */}
        <header className="mb-16 max-w-3xl">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {methodologyOverline}
          </p>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {methodologyHeading}
          </h2>
        </header>

        <RevealOnScroll
          staggerChildren
          className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8"
        >
          {featured.map((block) => {
            const num = String(block.index).padStart(2, '0');
            return (
              <motion.article
                key={block.index}
                variants={fadeUp}
                className="flex flex-col gap-6"
              >
                {/* Big number tile — supportive, opacity 0.20. */}
                <span
                  aria-hidden="true"
                  className="select-none text-[length:var(--text-display-l)] font-bold leading-none text-text opacity-[0.20]"
                >
                  {num}
                </span>

                {/* Cube anchor — secondary stroke (vs BrandEssence accent). */}
                <IsometricCube
                  variant="single"
                  stroke="#A7AFBC"
                  strokeWidth={1.25}
                  opacity={0.7}
                  className="h-12 w-12"
                />

                <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
                  {block.needsVerification && (
                    <span
                      aria-label={methodologyVerificationWarning}
                      className="mr-2 text-accent"
                    >
                      ⚠
                    </span>
                  )}
                  {block.title}
                </h3>

                <p className="text-[length:var(--text-lead)] leading-relaxed text-text">
                  {block.body}
                </p>

                {/* Accent-bar punctuation. */}
                {prefersReducedMotion ? (
                  <span
                    aria-hidden="true"
                    className="block h-px bg-accent"
                    style={{ width: 64 }}
                  />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    className="block h-px origin-left bg-accent"
                    style={{ width: 64 }}
                    variants={accentBarDraw}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                  />
                )}
              </motion.article>
            );
          })}
        </RevealOnScroll>
      </div>
    </RevealOnScroll>
  );
}
