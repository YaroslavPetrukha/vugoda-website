/**
 * @module components/sections/projects/AggregateRow
 *
 * Apr-2026 redesign — refactored from a small footnote-style row into a
 * full registry entry that matches PipelineRowCard rhythm. Pipeline-4
 * («Без назви», U+2192 calculation) now reads as «05 / 05» of the
 * portfolio register, not as an apologetic afterthought below the grid.
 *
 * Layout (12-col at lg+ — mirrors PipelineRowCard 1:1):
 *   col 1-5  framed cube placeholder (replaces the photo position)
 *   col 6    ordinal block «05 / 05» (accent + muted)
 *   col 7-12 stage overline · title · aggregate body text
 *
 * The cube placeholder is the brand-sanctioned «pipeline without renders»
 * UX state per DESIGN.md §Graphic Language. bg-bg-surface frame anchors
 * the row visually so the photo-vs-no-photo asymmetry doesn't break the
 * registry's rhythm.
 *
 * Border-top hairline matches PipelineRowCard so a stack of rows
 * (PipelineRegistry → AggregateRow) reads as one continuous register.
 *
 * total prop defaults to 5 for backward-compat with /dev/grid which
 * passes a synthetic aggregate without specifying total.
 */

import type { Project } from '../../../data/types';
import { IsometricCube } from '../../brand/IsometricCube';
import { overlineClasses } from '../../ui/typography';

interface Props {
  project: Project | undefined;
  /** Registry total size for «{order} / {total}» label. Defaults to 5. */
  total?: number;
}

export function AggregateRow({ project, total = 5 }: Props) {
  if (!project) return null;

  const ordinal = String(project.order).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <article className="grid grid-cols-1 gap-8 border-t border-text-muted/15 py-12 lg:grid-cols-12 lg:gap-12">
      {/* LEFT col-span-5 — framed cube placeholder. Aspect 5:4 matches
          PipelineRowCard photo aspect so the registry rhythm stays intact
          when this row sits below them. Hairline border + soft surface
          fill mirror home PortfolioOverview's aggregate panel for
          cross-surface coherence (single source of truth for the «pipeline
          без рендерів» visual signature). */}
      <div className="lg:col-span-5">
        <div className="relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden border border-text-muted/15 bg-bg-surface/40">
          <IsometricCube
            variant="single"
            opacity={0.55}
            className="h-1/2 w-1/2"
          />
        </div>
      </div>

      {/* MIDDLE col-span-2 — ordinal «05 / 05». Mirrors PipelineRowCard
          ordinal block (also col-span-2) so adjacent rows align
          typographically. col-span-1 is too narrow for the display-l
          numerals — they overflow into the content column. */}
      <div
        aria-hidden="true"
        className="hidden flex-col items-baseline gap-1 lg:col-span-2 lg:flex"
      >
        <span className="text-[length:var(--text-display-l)] font-bold leading-none tabular-nums text-accent">
          {ordinal}
        </span>
        <span className="text-base font-medium tabular-nums text-text-muted/60">
          / {totalLabel}
        </span>
      </div>

      {/* RIGHT col-span-5 — content stack. Same vertical rhythm as
          PipelineRowCard content. The aggregateText carries the full
          editorial line per content/projects data, including the
          back-reference to methodology №1. */}
      <div className="flex flex-col justify-center gap-4 lg:col-span-5">
        <span className={`${overlineClasses} text-text-muted`}>
          {project.stageLabel}
        </span>

        <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
          {project.title}
        </h3>

        <p className="text-base leading-[1.65] text-text-muted">
          {project.aggregateText}
        </p>
      </div>
    </article>
  );
}
