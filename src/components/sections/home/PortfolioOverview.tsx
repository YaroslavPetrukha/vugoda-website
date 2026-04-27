/**
 * @module components/sections/home/PortfolioOverview
 *
 * HOME-03 + P1-D3 — flagship card + 3 pipeline cards (mason offset)
 * + AggregateRow for the 5th invisible project.
 *
 * Restructured per AUDIT-DESIGN §9.3:
 *   1. Section frame: «Портфель · 1 + 4 · Львів» overline + bumped H2
 *      (text-h2 token, was text-4xl).
 *   2. FlagshipCard absorbed the dramatization (overlay caption +
 *      pulsing dot + bigger title).
 *   3. Pipeline 3 grid: middle card translate-y +12 to break the
 *      flat-row rhythm into a mason-feel composition.
 *   4. AggregateRow unchanged.
 *
 * Reads from data/projects derived views (flagship/pipelineGridProjects/
 * aggregateProjects) — never filters projects[] directly (Phase 2 D-04).
 *
 * LCP: flagship renders eager + fetchPriority=high (baked into
 * <FlagshipCard> for cross-surface LCP guarantee). Pipeline cards stay
 * lazy.
 *
 * Mason offset: only middle (i === 1) gets lg:translate-y-12. Phase 5
 * stagger cadence still drives reveal-order via <RevealOnScroll>.
 *
 * Phase 4 hover-card utility (D-31..D-35) preserved on pipeline cards.
 * Phase 5 SOT (motionVariants.fadeUp) drives stagger reveal.
 */

import { motion } from 'motion/react';
import { flagship, pipelineGridProjects, aggregateProjects } from '../../../data/projects';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import {
  portfolioOverline,
  portfolioHeading,
  portfolioSubtitle,
} from '../../../content/home';
import { FlagshipCard } from '../projects/FlagshipCard';
import { AggregateRow } from '../projects/AggregateRow';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';

export function PortfolioOverview() {
  const aggregate = aggregateProjects[0];

  return (
    <RevealOnScroll as="section" className="bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section frame — overline + bumped H2 + honest 0/1/4 subtitle. */}
        <header className="mb-16 flex flex-col gap-3">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {portfolioOverline}
          </p>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {portfolioHeading}
          </h2>
          <p className="text-[length:var(--text-lead)] text-text-muted">
            {portfolioSubtitle}
          </p>
        </header>

        {/* Flagship — extracted to <FlagshipCard> (D-02 cross-surface). */}
        <FlagshipCard project={flagship} />

        {/* Pipeline 3 — mason offset on middle card breaks the flat-row
            rhythm without breaking grid alignment below lg. */}
        <RevealOnScroll
          staggerChildren
          className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {pipelineGridProjects.map((project, i) => (
            <motion.article
              key={project.slug}
              variants={fadeUp}
              className={`hover-card flex flex-col gap-4 bg-bg-surface ${
                i === 1 ? 'lg:translate-y-12' : ''
              }`}
            >
              <ResponsivePicture
                src={`renders/${project.slug}/${project.renders[0]}`}
                alt={project.title}
                widths={[640, 1280]}
                sizes="(min-width: 1280px) 400px, 100vw"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-col gap-2 p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  {project.stageLabel}
                </span>
                <h3 className="text-xl font-bold text-text">{project.title}</h3>
                {project.location && (
                  <span className="text-sm text-text-muted">{project.location}</span>
                )}
              </div>
            </motion.article>
          ))}
        </RevealOnScroll>

        {/* Aggregate row — extracted to <AggregateRow> (HUB-04). */}
        <AggregateRow project={aggregate} />
      </div>
    </RevealOnScroll>
  );
}
