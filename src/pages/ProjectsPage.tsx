/**
 * @module pages/ProjectsPage
 *
 * Apr-2026 redesign — six-section registry composition:
 *
 *   1. <PortfolioMasthead />    — display H1 «5 проєктів» + 0/1/4 triplet
 *                                  + policy paragraph (replaces tiny H1
 *                                  block).
 *   2. Flagship section         — overline «01 / 05 · Активне будівництво»
 *                                  + <FlagshipCard project={flagship} />.
 *   3. StageFilter section      — overline + chip rail (URL state ?stage=).
 *   4-5. Body                   — dispatched on active stage (D-05..D-09):
 *        - null / u-rozrakhunku / u-pogodzhenni
 *            → <PipelineRegistry /> + maybe <AggregateRow /> (when
 *               Pipeline-4 in the filtered scope).
 *        - buduetsya  → <BuduetsyaPointer />
 *        - zdano      → <EmptyStateZdano />
 *   6. <ClosingNote />          — methodology cross-link.
 *
 * URL state: useSearchParams reads ?stage=...; isStage() validation
 * coerces unknown values to null (= «Усі», D-11). Counts span ALL projects
 * per D-03 (incl. Lakeview and Pipeline-4). Computed once at module load
 * (memoization-equivalent for 5-element array).
 *
 * Registry total: REGISTRY_TOTAL = 5 — passed down to PipelineRegistry
 * and AggregateRow so the «{order} / {total}» numerals stay stable
 * regardless of filter state. Stable identity is the registry's defining
 * property: «Маєток» is always 03/05 even when filtering by «у
 * розрахунку» surfaces only it.
 */

import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  projects,
  flagship,
  pipelineGridProjects,
  aggregateProjects,
} from '../data/projects';
import type { Stage } from '../data/types';
import { STAGES, isStage } from '../lib/stages';
import {
  pageTitle,
  flagshipSectionOverline,
  filterSectionOverline,
} from '../content/projects';
import { PortfolioMasthead } from '../components/sections/projects/PortfolioMasthead';
import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
import { StageFilter } from '../components/sections/projects/StageFilter';
import { PipelineRegistry } from '../components/sections/projects/PipelineRegistry';
import { AggregateRow } from '../components/sections/projects/AggregateRow';
import { EmptyStateZdano } from '../components/sections/projects/EmptyStateZdano';
import { BuduetsyaPointer } from '../components/sections/projects/BuduetsyaPointer';
import { ClosingNote } from '../components/sections/projects/ClosingNote';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { SectionOverline } from '../components/ui/typography';

/** Counts span the FULL projects array (D-03). Computed once at module load. */
const counts: Record<Stage, number> = STAGES.reduce(
  (acc, s) => {
    acc[s] = projects.filter((p) => p.stage === s).length;
    return acc;
  },
  {} as Record<Stage, number>,
);

/** Stable registry size for ordinal labels. Five-by-design until ЖК #6
 *  joins the data array, at which point this constant is the only edit
 *  site needed (per CON-01 portfolio-extension contract). */
const REGISTRY_TOTAL = 5;

export default function ProjectsPage() {
  usePageTitle(pageTitle);
  const [params] = useSearchParams();
  const raw = params.get('stage');
  const active: Stage | null = isStage(raw) ? raw : null;

  const aggregate = aggregateProjects[0];

  // Body dispatch on active stage (D-05..D-09).
  let body: React.ReactNode;
  if (active === 'buduetsya') {
    body = <BuduetsyaPointer />;
  } else if (active === 'zdano') {
    body = <EmptyStateZdano />;
  } else {
    // null / u-rozrakhunku / u-pogodzhenni — show registry rows + maybe
    // aggregate. AggregateRow is hidden when filter excludes Pipeline-4
    // (its stage = u-rozrakhunku).
    const showAggregate =
      active === null || (aggregate !== undefined && aggregate.stage === active);
    body = (
      <>
        <PipelineRegistry
          projects={pipelineGridProjects}
          active={active}
          total={REGISTRY_TOTAL}
        />
        {showAggregate && (
          <AggregateRow project={aggregate} total={REGISTRY_TOTAL} />
        )}
      </>
    );
  }

  return (
    <>
      {/* 1 — Masthead. Self-contained section with internal container. */}
      <PortfolioMasthead />

      {/* 2 — Flagship. Overline ties Lakeview into the «01 / 05» series. */}
      <section
        aria-labelledby="projects-flagship-heading"
        className="bg-bg pb-12 lg:pb-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="projects-flagship-heading" className="sr-only">
            Флагман
          </h2>
          <RevealOnScroll className="mb-8">
            <SectionOverline tone="muted">
              {flagshipSectionOverline}
            </SectionOverline>
          </RevealOnScroll>
          <FlagshipCard project={flagship} />
        </div>
      </section>

      {/* 3 — Stage filter. Overline gives the chip rail editorial
          context — without it the chips read as floating UI rather than
          a labelled control group. */}
      <section
        aria-labelledby="projects-filter-heading"
        className="bg-bg"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="projects-filter-heading" className="sr-only">
            Фільтр за стадіями
          </h2>
          <RevealOnScroll className="mb-3">
            <SectionOverline tone="muted">
              {filterSectionOverline}
            </SectionOverline>
          </RevealOnScroll>
          <StageFilter counts={counts} />
        </div>
      </section>

      {/* 4-5 — Registry body (rows / pointer / empty state). */}
      <section
        aria-labelledby="projects-registry-heading"
        className="bg-bg pb-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="projects-registry-heading" className="sr-only">
            Перелік проєктів
          </h2>
          {body}
        </div>
      </section>

      {/* 6 — Closing note + methodology link. Self-contained section. */}
      <ClosingNote />
    </>
  );
}
