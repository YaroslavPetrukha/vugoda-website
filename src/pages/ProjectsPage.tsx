/**
 * @module pages/ProjectsPage
 *
 * HUB-01 + HUB-02 + HUB-03 + HUB-04 — /projects Portfolio Hub.
 *
 * Composition order (D-01..D-09):
 *   1. <h1>Проєкти</h1> + muted subtitle
 *   2. <FlagshipCard project={flagship} />  — always visible (D-02)
 *   3. <StageFilter counts={counts} />      — URL-state ?stage=... (D-10)
 *   4. Body dispatched on active stage:
 *        - null / u-rozrakhunku / u-pogodzhenni  → PipelineGrid + AggregateRow
 *          (AggregateRow renders only when Pipeline-4 is in the filtered scope)
 *        - buduetsya  → BuduetsyaPointer (D-08)
 *        - zdano      → EmptyStateZdano (D-09)
 *
 * URL state: useSearchParams reads ?stage=...; isStage() validation
 * coerces unknown values to null (= «Усі», D-11).
 *
 * Counts span ALL projects per D-03 (incl. Lakeview and Pipeline-4).
 * Computed once at module load (memoization-equivalent for 5-element array).
 *
 * Default export is preserved (App.tsx import unchanged).
 */

import { useSearchParams } from 'react-router-dom';
import { projects, flagship, pipelineGridProjects, aggregateProjects } from '../data/projects';
import type { Stage } from '../data/types';
import { STAGES, isStage } from '../lib/stages';
import { projectsHeading, projectsSubtitle } from '../content/projects';
import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
import { StageFilter } from '../components/sections/projects/StageFilter';
import { PipelineGrid } from '../components/sections/projects/PipelineGrid';
import { AggregateRow } from '../components/sections/projects/AggregateRow';
import { EmptyStateZdano } from '../components/sections/projects/EmptyStateZdano';
import { BuduetsyaPointer } from '../components/sections/projects/BuduetsyaPointer';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';

/** Counts span the FULL projects array (D-03). Computed once at module load. */
const counts: Record<Stage, number> = STAGES.reduce(
  (acc, s) => {
    acc[s] = projects.filter((p) => p.stage === s).length;
    return acc;
  },
  {} as Record<Stage, number>,
);

export default function ProjectsPage() {
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
    // null / u-rozrakhunku / u-pogodzhenni — show grid + maybe aggregate.
    // AggregateRow is hidden when filter excludes Pipeline-4 (its stage = u-rozrakhunku).
    const showAggregate =
      active === null || (aggregate !== undefined && aggregate.stage === active);
    body = (
      <>
        <PipelineGrid projects={pipelineGridProjects} active={active} />
        {showAggregate && <AggregateRow project={aggregate} />}
      </>
    );
  }

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <RevealOnScroll className="mb-8 flex flex-col gap-2">
          <h1 className="font-bold text-6xl text-text">{projectsHeading}</h1>
          <p className="text-base text-text-muted">{projectsSubtitle}</p>
        </RevealOnScroll>
        <FlagshipCard project={flagship} />
        <StageFilter counts={counts} />
        {body}
      </div>
    </section>
  );
}
