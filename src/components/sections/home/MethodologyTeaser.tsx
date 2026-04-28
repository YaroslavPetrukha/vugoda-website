/**
 * @module components/sections/home/MethodologyTeaser
 *
 * Editorial single-statement — W7 rebuild ($impeccable bolder).
 *
 * Replaces the 3-up icon-title-text grid (the canonical AI-slop pattern
 * the critique flagged as «3 cube + h3 + body + AccentBar repeated»)
 * with a single full-width editorial moment: ONE principle from the
 * methodology stack of 7, presented as a 3-tier pyramid with stair-step
 * left-margin offsets that break the centered-stack template.
 *
 * Featured principle: methodologyBlocks #3 — «Забудовник і генпідрядник
 * в одній юрособі». Picked because:
 *   1. needsVerification: false — safe to feature without ⚠ marker.
 *   2. Most differentiated: structural fact (legal entity merger) that
 *      most developers do NOT have. Other principles (block 7
 *      «середовище, не квадратні метри») risk tautology with brand
 *      essence value #4 «довгострокова цінність».
 *   3. Stands alone: doesn't need supporting context to read.
 *   4. Investor-readable AND family-buyer-readable: «one signature on
 *      the contract» is a universal trust signal.
 *
 * Tiered hierarchy (editorial: kicker → headline → lede):
 *   overline:    «МЕТОДОЛОГІЯ · 03 / 07 · ЗАБУДОВНИК + ГЕНПІДРЯДНИК»
 *                                                   (text-overline, muted)
 *   display:     «Одна юрособа.»                    (text-display-l, bold, text)
 *   accent bar:  64×1px lime
 *   body:        block 3 verbatim from data         (text-lead, medium, muted)
 *   link out:    «Подивитися на проєкті →»          (text-base, accent)
 *
 * The overline carries the kicker «забудовник + генпідрядник» so the
 * display title «Одна юрособа.» reads as the verdict, not a cryptic
 * fragment. Body delivers consequence verbatim from methodology.ts —
 * no editorial subtitle tier (an earlier draft inserted one and
 * generated a literal tautology with body's «одна відповідальність»).
 *
 * Stair-step layout: overline + display anchor at col-start-2; accent
 * bar steps to col-start-3; body steps to col-start-4; CTA right-aligns
 * across col-start-2/col-span-11. Eye descends diagonally through the
 * statement — distinct from the centered-stack template every other
 * section variation has been built on.
 *
 * Drops:
 *   - 3-up grid scaffolding (`grid-cols-3`)
 *   - per-card IsometricCube (cube quota preserved on home via Hero
 *     overlay + BrandEssence cards — Methodology surrenders its 3 cubes)
 *   - AccentBar component import (inline lime hairline preferred for
 *     consistent rendering with new layout)
 *   - FEATURED_INDEXES selection (no longer curating 3, picking 1)
 *   - Section-level overline + H2 «Як ми будуємо» — replaced by per-
 *     statement overline + display title (the statement IS the heading).
 *
 * Preserves:
 *   - py-40 (Stage 2 beat-pattern: editorial tier).
 *   - bg-bg base.
 *   - RevealOnScroll wrapper for entrance.
 *   - Link to /projects since methodology is operationalized per-project
 *     in ZHK detail pages.
 */

import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { methodologyBlocks } from '../../../content/methodology';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { AccentBar } from '../../ui/AccentBar';
import { overlineClasses } from '../../ui/typography';
import { displayCurtain } from '../../../lib/motionVariants';
import isometricGridUrl from '../../../../brand-assets/patterns/isometric-grid.svg';

const FEATURED = methodologyBlocks.find((b) => b.index === 3);

/** Overline carries the kicker — primes the display title. Without
 *  this priming, «Одна юрособа.» reads as a cryptic fragment. With
 *  it, the verdict lands. «03 / 07» honestly counts the principle. */
const EDITORIAL_OVERLINE =
  'МЕТОДОЛОГІЯ · 03 / 07 · ЗАБУДОВНИК + ГЕНПІДРЯДНИК';
/** Display headline — operational verdict in noun-phrase form.
 *  «Одна юрособа.» in three syllables; brandbook reserves «3-4 display
 *  moments per site», this is one. */
const EDITORIAL_DISPLAY = 'Одна юрособа.';
/** Link-out CTA — em-dash + right arrow are deliberate brand glyphs.
 *  Destination /projects renders the principle in per-ЖК context. */
const EDITORIAL_CTA = 'Подивитися на проєкті';

export function MethodologyTeaser() {
  const prefersReducedMotion = useReducedMotion();

  // Defensive — block #3 must exist; if missing (data drift) bail out
  // rather than render a half-section. Stage 5 will harden this further.
  if (!FEATURED) return null;

  // Display heading — RM-gated curtain reveal. Under RM renders as plain
  // h2 with no clip-path animation; otherwise wraps in motion.h2 with
  // displayCurtain variant (bottom-up clip-path sweep, 0.7s easeBrand).
  const displayHeadingClass =
    'col-span-12 text-[length:var(--text-display-l)] font-bold leading-[0.92] tracking-tight text-text lg:col-span-10 lg:col-start-2';

  return (
    <RevealOnScroll as="section" id="methodology" className="relative overflow-hidden bg-bg py-40">
      {/* Brand isometric-grid overlay — far-right vertical strip, masked
          fade. Sits under the empty 11/12 column area where editorial
          tiers don't reach, so it's atmosphere, not interference. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[30%] opacity-[0.05] lg:block"
        style={{
          backgroundImage: `url(${isometricGridUrl})`,
          backgroundSize: '440px 334px',
          backgroundRepeat: 'repeat',
          // W8 fix — radial mask anchored at right-center; see
          // ConstructionTeaser for full rationale on hard-edge avoidance.
          maskImage:
            'radial-gradient(circle 600px at right center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage:
            'radial-gradient(circle 600px at right center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-x-8 gap-y-12 px-16">
        {/* Tier 1 — overline marker. col-start-2 anchors all tiers to
            the same leftward indent so the stair-step rhythm starts
            from a clear left edge, not the page gutter. */}
        <p
          className={`${overlineClasses} col-span-12 text-text-muted lg:col-span-10 lg:col-start-2`}
        >
          {EDITORIAL_OVERLINE}
        </p>

        {/* Tier 2 — display headline with curtain reveal. */}
        {prefersReducedMotion ? (
          <h2 className={displayHeadingClass}>{EDITORIAL_DISPLAY}</h2>
        ) : (
          <motion.h2
            className={displayHeadingClass}
            variants={displayCurtain}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {EDITORIAL_DISPLAY}
          </motion.h2>
        )}

        {/* Lime accent bar — hinge between display verdict and body.
            AccentBar (origin-left scaleX 0.8s draw-on-view, RM-gated
            internally). Steps one indent right (col-start-3). */}
        <AccentBar
          width={128}
          className="col-span-12 -mt-4 lg:col-span-10 lg:col-start-3"
        />

        {/* Tier 3 — body verbatim from methodology.ts data. Lead tier,
            medium weight, muted color — visually receded but readable.
            Two indents right of display title. */}
        <p
          className="col-span-12 max-w-3xl text-[length:var(--text-lead)] font-medium leading-relaxed text-text-muted lg:col-span-8 lg:col-start-4"
        >
          {FEATURED.body}
        </p>

        {/* Tier 4 — link out (right-aligned, broadest span). Crosses
            the page diagonally vs. the leftward-anchored tiers above.
            Accent color carries the only «click here» weight on the section. */}
        <div className="col-span-12 flex justify-end lg:col-span-11 lg:col-start-2">
          <Link
            to="/projects"
            className="inline-flex items-baseline gap-2 text-base font-medium text-accent underline-offset-4 transition-transform duration-150 ease-out hover:underline active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <span>{EDITORIAL_CTA}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </RevealOnScroll>
  );
}
