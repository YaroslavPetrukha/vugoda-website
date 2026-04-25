/**
 * @module components/sections/projects/AggregateRow
 *
 * HUB-04 — Pipeline-4 aggregate row with single-cube state marker.
 * Extracted from home PortfolioOverview (lines 114-125). Consumed by
 * home, /projects, and /dev/grid.
 *
 * Renders only when project prop is defined (aggregateProjects[0] in
 * production, or fixtures.find(p => p.presentation === 'aggregate')
 * on /dev/grid). Filter logic lives in the consumer.
 *
 * IsometricCube variant='single' + stroke='#A7AFBC' + opacity=0.4 are
 * the locked aggregate-marker values per Phase 3 D-04 brand-primitive
 * immutability. Cube-ladder semantics (CONCEPT §5.2): single = aggregate.
 */

import type { Project } from '../../../data/types';
import { IsometricCube } from '../../brand/IsometricCube';

interface Props {
  project: Project | undefined;
}

export function AggregateRow({ project }: Props) {
  if (!project) return null;
  return (
    <div className="mt-12 flex items-center gap-6 border-t border-bg-surface pt-12">
      <IsometricCube variant="single"
        stroke="#A7AFBC"
        opacity={0.4}
        className="h-12 w-12 flex-shrink-0"
      />
      <p className="text-base text-text">{project.aggregateText}</p>
    </div>
  );
}
