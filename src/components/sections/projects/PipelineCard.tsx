/**
 * @module components/sections/projects/PipelineCard
 *
 * HUB-03 + P1-S4 — Single pipeline grid card with optional stage-matched
 * CTA. Extracted from home PortfolioOverview pipeline-grid map body.
 * Consumed by PipelineGrid on /projects, /dev/grid, AND now (after the
 * P1-S4 cross-surface refactor) directly by home PortfolioOverview.
 *
 * P1-S4 changes:
 *   - When `project.cta` is present (etno-dim / maietok / nterest in v1),
 *     render a primary mailto CTA with bg-accent fill mirroring the
 *     FlagshipCard pattern. Subject is encodeURIComponent'd from
 *     project.cta.mailtoSubject; recipient = company.email.
 *   - Whole-card-as-Link wrapper REMOVED. Previously full-internal cards
 *     wrapped the entire <article> in a <Link to=`/zhk/${slug}`>; nesting
 *     a <a href="mailto:"> CTA inside that produced invalid HTML
 *     (a-inside-a) and accessibility violations (nested interactive
 *     controls). New pattern: the title <h3> is the navigational <Link>
 *     for full-internal cards, the CTA is a sibling mailto. Two distinct
 *     interactive elements, no nesting.
 *   - For grid-only cards (no /zhk/{slug} page), title stays a plain h3.
 *     CTA is the only interactive element on the card.
 *   - For aggregate / flagship-external presentations, this component is
 *     not used (FlagshipCard / AggregateRow surface them).
 *
 * The whole-card hover-card glow still applies via the article-level
 * className — that's a visual hint, not a click target.
 *
 * Reads project.stageLabel directly (descriptive narrative-style string
 * like «меморандум» / «кошторисна документація» / «дозвільна документація»),
 * NOT stageLabel(stage) from lib/stages (which is the chip-friendly short form).
 *
 * Wave 3 plan 04-10 added the brand hover triple-effect (D-31..D-35) to
 * the inner article — preserved.
 *
 * IMPORT BOUNDARY: forwards path templates into ResponsivePicture which
 * composes URLs via lib/assetUrl. Never embeds quoted slash-delimited
 * tree-prefix patterns that scripts/check-brand.ts importBoundaries()
 * greps for.
 */

import { Link } from 'react-router-dom';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { email } from '../../../content/company';

interface Props {
  project: Project;
}

export function PipelineCard({ project }: Props) {
  const isClickable = project.presentation === 'full-internal';
  const ctaHref = project.cta
    ? `mailto:${email}?subject=${encodeURIComponent(project.cta.mailtoSubject)}`
    : null;

  return (
    <article className="hover-card flex flex-col gap-4 bg-bg-surface">
      {project.renders.length > 0 && (
        <ResponsivePicture
          src={`renders/${project.slug}/${project.renders[0]}`}
          alt={project.title}
          widths={[640, 1280]}
          sizes="(min-width: 1280px) 400px, 100vw"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      <div className="flex flex-col gap-2 p-6">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {project.stageLabel}
        </span>
        {isClickable ? (
          <h3 className="text-xl font-bold text-text">
            <Link
              to={`/zhk/${project.slug}`}
              className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {project.title}
            </Link>
          </h3>
        ) : (
          <h3 className="text-xl font-bold text-text">{project.title}</h3>
        )}
        {project.location && (
          <span className="text-sm text-text-muted">{project.location}</span>
        )}
        {project.nextStep && (
          <span className="text-sm text-text-muted">
            <span aria-hidden="true" className="text-accent">→ </span>
            {project.nextStep}
          </span>
        )}
        {project.cta && ctaHref && (
          <a
            href={ctaHref}
            className="mt-4 inline-flex w-fit items-center bg-accent px-5 py-3 text-sm font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {project.cta.label}
          </a>
        )}
      </div>
    </article>
  );
}
