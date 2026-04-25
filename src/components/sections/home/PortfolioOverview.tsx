/**
 * @module components/sections/home/PortfolioOverview
 *
 * HOME-03 — flagship card (full-width hero, aerial.jpg as LCP target)
 * + 3-in-row pipeline grid (the 3 grid-presentation projects)
 * + Pipeline-4 aggregate row with single-cube state marker.
 *
 * Reads from data/projects derived views (flagship/pipelineGridProjects/
 * aggregateProjects) — never filters projects[] directly (Phase 2 D-04).
 * Uses <ResponsivePicture> for pipeline grid images so the optimizer
 * pipeline + AVIF fallback chain is consistent with Hero.
 *
 * LCP: flagship card renders eager + fetchPriority=high (Phase 3 D-18 +
 * Pitfall 11 — default lazy is wrong for the LCP image). Wiring lives
 * inside <FlagshipCard> — baked in for cross-surface LCP guarantee.
 *
 * Flagship intrinsic dimensions: 1280×720 (16:9). Explicit width/height
 * attrs prevent CLS and document the 16:9 contract for the AVIF/WebP/JPG
 * triple (per checker Blocker 4 fix). Sizes hint on flagship: 768px at lg.
 *
 * Layout (D-14 + RESEARCH Open Question 8): flagship side-by-side
 * (image left 60%, text right 40% at ≥1280px). Pipeline cards: 3 columns,
 * equal width. Aggregate row: cube left + text right, full-width strip.
 *
 * Phase 4 plan 04-10 added inline hover triple-effect (Tailwind classes,
 * D-31..D-35) to pipeline cards. Phase 5 may absorb the cubic-bezier into
 * motionVariants.ts.
 *
 * Extracted (D-02 + HUB-04 — Phase 4 plan 04-03): the flagship card and
 * aggregate-row shapes were lifted out to
 * src/components/sections/projects/{FlagshipCard,AggregateRow}.tsx so
 * /projects (Phase 4) and /dev/grid (Phase 4) reuse them verbatim.
 */

import { flagship, pipelineGridProjects, aggregateProjects } from '../../../data/projects';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { portfolioHeading, portfolioSubtitle } from '../../../content/home';
import { FlagshipCard } from '../projects/FlagshipCard';
import { AggregateRow } from '../projects/AggregateRow';

export function PortfolioOverview() {
  const aggregate = aggregateProjects[0];

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading + honest 0/1/4 subtitle (D-13) */}
        <header className="mb-12 flex flex-col gap-2">
          <h2 className="font-bold text-4xl text-text">{portfolioHeading}</h2>
          <p className="text-base text-text-muted">{portfolioSubtitle}</p>
        </header>

        {/* Flagship card — extracted to <FlagshipCard> for cross-surface reuse (D-02) */}
        <FlagshipCard project={flagship} />

        {/* Pipeline grid — 3 cards in row at ≥lg (D-15). Static in Phase 3; hover in Phase 4. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pipelineGridProjects.map((project) => (
            <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
              <ResponsivePicture
                src={`renders/${project.slug}/${project.renders[0]}`}
                alt={project.title}
                widths={[640, 1280]}
                sizes="(min-width: 1280px) 400px, 100vw"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="flex flex-col gap-2 p-6">
                <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                  {project.stageLabel}
                </span>
                <h3 className="font-bold text-xl text-text">{project.title}</h3>
                {project.location && (
                  <span className="text-sm text-text-muted">{project.location}</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Aggregate row — extracted to <AggregateRow> for cross-surface reuse (HUB-04) */}
        <AggregateRow project={aggregate} />
      </div>
    </section>
  );
}
