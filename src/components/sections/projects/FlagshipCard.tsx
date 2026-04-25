/**
 * @module components/sections/projects/FlagshipCard
 *
 * HUB-02 — Flagship card extracted from home PortfolioOverview (D-02).
 * Consumed by home (PortfolioOverview), /projects (ProjectsPage), and
 * /dev/grid (DevGridPage). All three surfaces use the same JSX shape;
 * the only difference is surrounding chrome.
 *
 * LCP target on BOTH home and /projects (D-02). Caller MUST NOT change
 * loading/fetchPriority — they are baked in here for the cross-surface
 * LCP guarantee. The single 1920-AVIF preload link in index.html
 * (Phase 3 03-04) covers home; /projects gets the same cache hit.
 *
 * Phase 4 plan 04-10 (Wave 3, ANI-03) adds hover triple-effect classes
 * to this article. This plan ships extraction-only.
 *
 * IMPORT BOUNDARY: forwards path templates into ResponsivePicture which
 * composes URLs via lib/assetUrl. Never embeds the quoted, slash-
 * delimited tree-prefix patterns that scripts/check-brand.ts greps for.
 */

import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { flagshipExternalCta } from '../../../content/home';

interface Props {
  project: Project;
}

export function FlagshipCard({ project }: Props) {
  return (
    <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">
      {project.renders.length > 0 && (
        <ResponsivePicture
          src={`renders/${project.slug}/${project.renders[0]}`}
          alt={project.title}
          widths={[640, 1280, 1920]}
          sizes="(min-width: 1280px) 768px, 100vw"
          width={1280}
          height={720}
          loading="eager"
          fetchPriority="high"
          className="w-full h-auto rounded-lg"
        />
      )}
      <div className="flex flex-col justify-center gap-4 p-8">
        <span className="font-medium text-sm uppercase tracking-wider text-text-muted">
          {project.stageLabel}
        </span>
        <h3 className="font-bold text-3xl text-text">{project.title}</h3>
        {project.facts?.note && (
          <p className="text-base text-text-muted">{project.facts.note}</p>
        )}
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex w-fit items-center bg-accent px-6 py-3 text-base font-medium text-bg-black hover:brightness-110"
          >
            {flagshipExternalCta}
          </a>
        )}
      </div>
    </article>
  );
}
