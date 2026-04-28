/**
 * @module components/sections/home/PortfolioOverview
 *
 * W7 editorial redesign — drops 3-up pipeline grid + 2010-style hover-card
 * green glow. Replaced with magazine feature spread:
 *
 *   1. Section header with isometric pattern overlay top-right corner
 *   2. FlagshipCard (already redesigned in projects/FlagshipCard) — full-bleed
 *      photo 8/12 + content panel 4/12 with «01» display index
 *   3. Pipeline 3 as VERTICAL ROW LIST (PipelineRowCard) — each row carries
 *      «02 / 05», «03 / 05», «04 / 05» display indices, photo 5/12 + content
 *      6/12, hairline rules between rows
 *   4. AggregateRow as «05 / 05» closer with accent-numbered index
 *
 * Rationale (per user feedback «блок проектів чмо, треба передумати»):
 *   - 3-up grid + photo + bg-bg-surface frame + green-glow hover = canonical
 *     2010 «card grid» pattern
 *   - Vertical list with index numbers + hairline separators reads as
 *     editorial registry — brand «системний» comes from the rhythm of
 *     numbered rows, not from card frames
 *   - Mason translate-y offset dropped (vertical list doesn't benefit)
 *   - Cards drop bg-bg-surface frame (rows breathe on bg-bg)
 */

import type { Project } from '../../../data/types';
import {
  flagship,
  pipelineGridProjects,
  aggregateProjects,
  projects,
} from '../../../data/projects';
import {
  portfolioOverline,
  portfolioHeading,
  portfolioSubtitle,
} from '../../../content/home';
import { FlagshipCard } from '../projects/FlagshipCard';
import { PipelineRowCard } from '../projects/PipelineRowCard';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline } from '../../ui/typography';
import { IsometricCube } from '../../brand/IsometricCube';
import isometricGridUrl from '../../../../brand-assets/patterns/isometric-grid.svg';

const TOTAL_PROJECTS = projects.length; // 5

export function PortfolioOverview() {
  const aggregate: Project | undefined = aggregateProjects[0];

  return (
    <section className="relative overflow-hidden bg-bg pt-24 pb-32">
      {/* Section backdrop pattern — top-right corner anchor. opacity-[0.04]
          keeps the cube grid as faint engineering trace, not wallpaper.
          aria-hidden, pointer-events-none — purely atmospheric. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-[60%] w-[40%] opacity-[0.10] lg:block"
        style={{
          backgroundImage: `url(${isometricGridUrl})`,
          backgroundSize: '440px 334px',
          backgroundRepeat: 'repeat',
          // W8 fix — radial mask anchored at top-right corner; see
          // ConstructionTeaser for full rationale on hard-edge avoidance.
          maskImage:
            'radial-gradient(circle 600px at right top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage:
            'radial-gradient(circle 600px at right top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-16">
        <RevealOnScroll className="contents">
          {/* Section frame — overline + bumped H2 + honest 0/1/4 subtitle. */}
          <header className="mb-16 flex flex-col gap-3">
            <SectionOverline>{portfolioOverline}</SectionOverline>
            <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
              {portfolioHeading}
            </h2>
            <p className="text-[length:var(--text-lead)] text-text-muted">
              {portfolioSubtitle}
            </p>
          </header>
        </RevealOnScroll>

        {/* Flagship — extracted to <FlagshipCard> (cross-surface). */}
        <RevealOnScroll className="block">
          <FlagshipCard project={flagship} />
        </RevealOnScroll>

        {/* Pipeline 3 — vertical row list. staggerChildren cascade. */}
        <RevealOnScroll staggerChildren className="flex flex-col">
          {pipelineGridProjects.map((project) => (
            <PipelineRowCard
              key={project.slug}
              project={project}
              index={project.order}
              total={TOTAL_PROJECTS}
            />
          ))}
        </RevealOnScroll>

        {/* Aggregate row — «05 / 05» closer with display index marker.
            5/12 frame holds a placeholder-card matching pipeline-row photo
            visual mass — brand mark centered on a hairline-bordered surface
            with «очікується» caption. Without the equivalent visual weight
            the row reads as a stub instead of a deliberate registry entry
            (W7 layout pass — user feedback «біда» on tiny floating cube). */}
        {aggregate && (
          <RevealOnScroll className="block">
            <article className="grid grid-cols-1 gap-8 border-t border-text-muted/15 py-12 lg:grid-cols-12 lg:gap-12">
              <div className="hidden lg:col-span-5 lg:block">
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border border-text-muted/15 bg-bg-surface/40">
                  <IsometricCube
                    variant="single"
                    opacity={0.55}
                    className="h-1/2 w-1/2"
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-4 left-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-text-muted/70`}
                  >
                    рендер очікується
                  </span>
                </div>
              </div>

              {/* Display index — stacked, baseline-aligned with text.
                  col-span-2 (was col-span-1) so display-l numerals fit
                  inside the lg-grid track without overflowing the
                  content column. Mirrors PipelineRowCard fix. */}
              <div
                aria-hidden="true"
                className="hidden flex-col items-baseline gap-1 lg:col-span-2 lg:flex"
              >
                <span className="text-[length:var(--text-display-l)] font-bold leading-none tabular-nums text-text-muted/40">
                  {String(aggregate.order).padStart(2, '0')}
                </span>
                <span className="text-base font-medium tabular-nums text-text-muted/40">
                  / {String(TOTAL_PROJECTS).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col justify-center gap-3 lg:col-span-5">
                <p className="text-[length:var(--text-lead)] leading-relaxed text-text">
                  {aggregate.aggregateText}
                </p>
              </div>
            </article>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
