/**
 * @module components/sections/home/PortfolioOverview
 *
 * HOME-03 — flagship card (full-width hero, aerial.jpg as LCP target)
 * + 3-in-row pipeline grid (the 3 grid-presentation projects)
 * + Pipeline-4 aggregate row with single-cube state marker.
 *
 * Reads from data/projects derived views (flagship/pipelineGridProjects/
 * aggregateProjects) — never filters projects[] directly (Phase 2 D-04).
 * Uses <ResponsivePicture> for all images so the optimizer pipeline + AVIF
 * fallback chain is consistent with Hero.
 *
 * LCP: flagship.aerial.jpg renders eager + fetchPriority="high"
 * (Phase 3 D-18 + Pitfall 11 — default lazy is wrong for the LCP image).
 *
 * Flagship intrinsic dimensions: 1280×720 (16:9). The flagship cell at
 * lg breakpoint resolves to ~60% × 1200px container ≈ 720px wide; the
 * picked 1280w srcset entry covers it with retina headroom. Explicit
 * width/height attrs prevent CLS and document the 16:9 contract for
 * the AVIF/WebP/JPG triple (per checker Blocker 4 fix).
 *
 * Layout (D-14 + RESEARCH Open Question 8): flagship side-by-side
 * (image left 60%, text right 40% at ≥1280px). Pipeline cards: 3 columns,
 * equal width. Aggregate row: cube left + text right, full-width strip.
 *
 * Static section in Phase 3 — Phase 5 owns scroll reveal + card hover via
 * shared Motion variants; this file ships with no inline keyframe transition
 * objects (Pitfall 14).
 *
 * IMPORT BOUNDARY: passes path templates like `renders/{slug}/{file}` to
 * <ResponsivePicture src={...}>; the picture component composes URLs via
 * assetUrl() internally. Never embeds the quoted, slash-delimited render-
 * tree segment that scripts/check-brand.ts importBoundaries() greps for.
 */

import { flagship, pipelineGridProjects, aggregateProjects } from '../../../data/projects';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { IsometricCube } from '../../brand/IsometricCube';
import {
  portfolioHeading,
  portfolioSubtitle,
  flagshipExternalCta,
} from '../../../content/home';

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

        {/* Flagship card — full-width, side-by-side at ≥lg (D-14) */}
        <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">
          <ResponsivePicture
            src={`renders/${flagship.slug}/${flagship.renders[0]}`}
            alt={flagship.title}
            widths={[640, 1280, 1920]}
            sizes="(min-width: 1280px) 768px, 100vw"
            width={1280}
            height={720}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto rounded-lg"
          />
          <div className="flex flex-col justify-center gap-4 p-8">
            <span className="font-medium text-sm uppercase tracking-wider text-text-muted">
              {flagship.stageLabel}
            </span>
            <h3 className="font-bold text-3xl text-text">{flagship.title}</h3>
            {flagship.facts?.note && (
              <p className="text-base text-text-muted">{flagship.facts.note}</p>
            )}
            <a
              href={flagship.externalUrl}
              target="_blank"
              rel="noopener"
              className="mt-2 inline-flex w-fit items-center bg-accent px-6 py-3 text-base font-medium text-bg-black hover:brightness-110"
            >
              {flagshipExternalCta}
            </a>
          </div>
        </article>

        {/* Pipeline grid — 3 cards in row at ≥lg (D-15). Static in Phase 3; hover in Phase 4. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pipelineGridProjects.map((project) => (
            <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface">
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

        {/* Aggregate row — Pipeline-4 (D-16): IsometricCube marker + aggregateText, full-width strip */}
        {aggregate && (
          <div className="mt-12 flex items-center gap-6 border-t border-bg-surface pt-12">
            <IsometricCube variant="single"
              stroke="#A7AFBC"
              opacity={0.4}
              className="h-12 w-12 flex-shrink-0"
            />
            <p className="text-base text-text">{aggregate.aggregateText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
