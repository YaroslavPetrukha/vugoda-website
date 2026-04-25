/**
 * @module pages/DevGridPage
 *
 * HUB-04 Success Criterion #6 — hidden fixtures stress-test surface.
 * Direct URL only (/#/dev/grid); not linked from Nav (D-39).
 *
 * Mirrors /projects (plan 04-05) composition but feeds `fixtures` (10
 * synthetic records from src/data/projects.fixtures.ts) instead of
 * production projects:
 *   1. <FlagshipCard project={syntheticFlagship} />
 *   2. <StageFilter counts={fixtureCounts} />
 *   3. <PipelineGrid projects={fixturesForGrid} active={...} /> + <AggregateRow project={syntheticAggregate} />
 *
 * Synthetic flagship = fixtures.find(p => p.presentation === 'flagship-external') = fixture-06.
 * Synthetic aggregate = fixtures.find(p => p.presentation === 'aggregate') = fixture-01.
 *
 * Stage-fallback unknown returns em-dash from src/lib/stages.ts (D-42) — this
 * page exercises that path indirectly: any future fixture with a
 * runtime-cast stage value would render the chip badge as «—».
 *
 * IMPORT BOUNDARY: this file is THE explicit exception to the fixtures-
 * import boundary (Phase 2 D-09 + Wave 1 plan 04-04 check-brand exclusion).
 * The file MUST be named exactly `DevGridPage.tsx` for `grep -v 'DevGridPage'`
 * in scripts/check-brand.ts rule 4 to fire — do NOT rename.
 *
 * Default export.
 */

import { useSearchParams } from 'react-router-dom';
import { fixtures } from '../data/projects.fixtures';
import type { Stage } from '../data/types';
import { STAGES, isStage } from '../lib/stages';
import { FlagshipCard } from '../components/sections/projects/FlagshipCard';
import { StageFilter } from '../components/sections/projects/StageFilter';
import { PipelineGrid } from '../components/sections/projects/PipelineGrid';
import { AggregateRow } from '../components/sections/projects/AggregateRow';

/** Counts span the FULL fixtures array (D-03 + D-40 — honest counts apply here too). */
const fixtureCounts: Record<Stage, number> = STAGES.reduce(
  (acc, s) => {
    acc[s] = fixtures.filter((p) => p.stage === s).length;
    return acc;
  },
  {} as Record<Stage, number>,
);

/** Synthetic flagship slot (D-41). fixture-06 is the only flagship-external variant. */
const syntheticFlagship = fixtures.find((p) => p.presentation === 'flagship-external');

/** Synthetic aggregate slot. fixture-01 is the only aggregate variant. */
const syntheticAggregate = fixtures.find((p) => p.presentation === 'aggregate');

/** Grid-scope: PipelineGrid filters by full-internal + grid-only already, but
 *  passing the full fixtures array is fine — non-grid variants are filtered out
 *  inside the component. Pre-filtering here would be redundant. */
const fixturesForGrid = fixtures;

export default function DevGridPage() {
  const [params] = useSearchParams();
  const raw = params.get('stage');
  const active: Stage | null = isStage(raw) ? raw : null;

  const showAggregate =
    syntheticAggregate &&
    (active === null || syntheticAggregate.stage === active);

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="font-bold text-6xl text-text">Dev · Grid Stress Test</h1>
          <p className="text-base text-text-muted">
            Hidden fixtures surface — /dev/grid · {fixtures.length} synthetic ЖК · QA only
          </p>
        </header>

        {syntheticFlagship && <FlagshipCard project={syntheticFlagship} />}

        <StageFilter counts={fixtureCounts} />

        <PipelineGrid projects={fixturesForGrid} active={active} />
        {showAggregate && <AggregateRow project={syntheticAggregate} />}
      </div>
    </section>
  );
}
