/**
 * @module components/sections/projects/PipelineGrid
 *
 * HUB-03 — Pure data-source-agnostic grid renderer. Accepts `projects:
 * Project[]` prop and current `active: Stage | null`. ProjectsPage feeds
 * pipelineGridProjects (3 records); DevGridPage feeds fixtures filter.
 *
 * Filter logic: when active === null, render all input projects that are
 * full-internal or grid-only. When active is a Stage, filter by stage AND
 * keep only those same presentation variants (flagship and aggregate live
 * outside the grid).
 *
 * D-08 «Будується» edge case: when active='buduetsya' and projects=
 * pipelineGridProjects, filtered is empty (Lakeview is flagship-external,
 * not in pipelineGridProjects). PipelineGrid returns null; ProjectsPage
 * substitutes BuduetsyaPointer. On /dev/grid (fixture-07 buduetsya +
 * grid-only) WILL match — PipelineGrid renders 1 card without any pointer.
 *
 * Empty handling: returns null when filtered list is empty. Caller
 * dispatches EmptyStateZdano / BuduetsyaPointer at the page level.
 */

import type { Project, Stage } from '../../../data/types';
import { PipelineCard } from './PipelineCard';

interface Props {
  projects: Project[];
  active: Stage | null;
}

export function PipelineGrid({ projects, active }: Props) {
  const filtered =
    active === null
      ? projects.filter(
          (p) => p.presentation === 'full-internal' || p.presentation === 'grid-only',
        )
      : projects.filter(
          (p) =>
            p.stage === active &&
            (p.presentation === 'full-internal' || p.presentation === 'grid-only'),
        );

  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {filtered.map((p) => (
        <PipelineCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
