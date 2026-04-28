/**
 * @module components/sections/projects/PipelineRegistry
 *
 * Apr-2026 redesign — registry-list replacement for the deprecated 3-up
 * PipelineGrid on /projects. Stacks PipelineRowCard horizontally-row entries
 * with stable ordinals derived from `project.order` (so «Маєток» is always
 * «03/05» regardless of filter).
 *
 * Filter semantics mirror PipelineGrid:
 *   - active === null            → full-internal + grid-only (all 3 rows)
 *   - active === <stage>         → same predicate AND stage match
 *
 * Pipeline-4 (presentation='aggregate') is NOT rendered here — its
 * registry row lives in AggregateRow (refactored to row format).
 *
 * Lakeview (presentation='flagship-external') is also not rendered here —
 * it lives above as the FlagshipCard.
 *
 * total prop = registry size (5 = 1 flagship + 3 internal/grid + 1
 * aggregate). Caller is the source of truth so /dev/grid fixtures can
 * pass a synthetic total without coupling to data/projects.ts.
 *
 * Empty handling: returns null when filter excludes everything; the page
 * may dispatch an empty-state at the section level (BuduetsyaPointer /
 * EmptyStateZdano) — same contract as PipelineGrid.
 */

import { motion } from 'motion/react';
import type { Project, Stage } from '../../../data/types';
import { PipelineRowCard } from './PipelineRowCard';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';

interface Props {
  projects: Project[];
  active: Stage | null;
  /** Total registry size for «{order} / {total}» label on each row. */
  total: number;
}

export function PipelineRegistry({ projects, active, total }: Props) {
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
    <RevealOnScroll as="div" staggerChildren className="flex flex-col">
      {filtered.map((p) => (
        <motion.div key={p.slug} variants={fadeUp}>
          <PipelineRowCard project={p} index={p.order} total={total} />
        </motion.div>
      ))}
    </RevealOnScroll>
  );
}
