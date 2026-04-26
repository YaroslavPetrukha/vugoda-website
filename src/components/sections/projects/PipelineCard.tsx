/**
 * @module components/sections/projects/PipelineCard
 *
 * HUB-03 — Single pipeline grid card. Extracted from home PortfolioOverview
 * pipeline-grid map body. Consumed by PipelineGrid on /projects and /dev/grid.
 *
 * Reads project.stageLabel directly (descriptive narrative-style string
 * like «меморандум» / «кошторисна документація» / «дозвільна документація»),
 * NOT stageLabel(stage) from lib/stages (which is the chip-friendly short form).
 * Per HUB-03 the card surfaces the system-narrative weight, chips show
 * Model-Б buckets — different fields by design.
 *
 * D-34: grid-only cards get cursor-default (NOT pointer) because they are not
 * clickable in v1. full-internal cards link to /zhk/{slug}.
 *
 * Wave 3 plan 04-10 added the brand hover triple-effect (D-31..D-35) to
 * the inner article. Outer wrapper retains its anchor-or-div shape
 * (D-34: clickable vs non-clickable cursor semantics).
 *
 * IMPORT BOUNDARY: forwards path templates into ResponsivePicture which
 * composes URLs via lib/assetUrl. Never embeds quoted slash-delimited
 * tree-prefix patterns that scripts/check-brand.ts importBoundaries() greps for.
 */

import { Link } from 'react-router-dom';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';

interface Props {
  project: Project;
}

export function PipelineCard({ project }: Props) {
  // D-34: only full-internal cards are clickable (link to /zhk/{slug}).
  // grid-only cards stay cursor-default; Wave 3 ANI-03 still applies hover glow.
  const isClickable = project.presentation === 'full-internal';

  const inner = (
    <article className="flex flex-col gap-4 bg-bg-surface hover-card">
      {project.renders.length > 0 && (
        <ResponsivePicture
          src={`renders/${project.slug}/${project.renders[0]}`}
          alt={project.title}
          widths={[640, 1280]}
          sizes="(min-width: 1280px) 400px, 100vw"
          loading="lazy"
          className="w-full aspect-[4/3] object-cover"
        />
      )}
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
  );

  if (isClickable) {
    // react-router-dom <Link> — HashRouter prefixes the path with `#/` automatically;
    // `to="/zhk/etno-dim"` resolves to `/#/zhk/etno-dim` in the browser.
    // Wave 3 ANI-03 hover applies to the inner <article>, not this wrapper.
    return (
      <Link to={`/zhk/${project.slug}`} className="block">
        {inner}
      </Link>
    );
  }

  // Non-clickable card — wrapper preserves cursor-default per D-34.
  return <div className="cursor-default">{inner}</div>;
}
