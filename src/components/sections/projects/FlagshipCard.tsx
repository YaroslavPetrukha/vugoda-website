/**
 * @module components/sections/projects/FlagshipCard
 *
 * Flagship dramatized — P1-D3 (AUDIT-DESIGN §9.3).
 *
 * Restructured from the 60/40 framed-rectangle that read as «Lakeview
 * у однотонному контейнері» into a half-bleed image + half-content
 * composition with editorial overlay caption and pulsing-dot stage
 * label. Same JSX shape consumed by home (PortfolioOverview),
 * /projects (ProjectsPage), and /dev/grid (DevGridPage) — single
 * cross-surface contract per HUB-02.
 *
 * Layout (lg ≥ 1280):
 *   [3fr image]                 |   [2fr content]
 *   - object-cover full-height  |   • pulsing accent dot + stage label
 *   - bottom gradient overlay   |   • H3 title at text-h3 token
 *   - tracked overline caption  |   • optional facts.note
 *     «{TITLE} · {STAGE} · {Y}» |   • CTA bg-accent
 *
 * Below lg the image stacks above content (mobile-fallback / tablet).
 *
 * LCP target on home + /projects (D-02). Caller MUST NOT change
 * loading/fetchPriority — they are baked in here for the cross-surface
 * LCP guarantee (single 1280-AVIF preload covers home; /projects
 * gets the same cache hit).
 *
 * Pulsing dot: Tailwind animate-pulse — rhythmic indicator (live-feel),
 * not transitional. easeBrand applies to transitions, not infinite
 * pulses; the in/out cubic-bezier-default is acceptable here (brand
 * §6 «no decorative bouncy springs» — pulse is not bouncy).
 *
 * Contains overflow-hidden so the gradient overlay clips inside the
 * card boundary even though Image's natural ratio may extend further.
 *
 * IMPORT BOUNDARY: forwards path templates into ResponsivePicture which
 * composes URLs via lib/assetUrl. Never embeds the quoted, slash-
 * delimited tree-prefix patterns that scripts/check-brand.ts greps for.
 */

import { motion } from 'motion/react';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { overlineClasses } from '../../ui/typography';
import { flagshipExternalCta } from '../../../content/home';
import { useMagnet } from '../../../hooks/useMagnet';
import { withLakeviewUtm } from '../../../lib/utm';

interface Props {
  project: Project;
}

export function FlagshipCard({ project }: Props) {
  const ctaMagnet = useMagnet();
  const captionParts = [
    project.title.toUpperCase(),
    project.stageLabel.toUpperCase(),
    project.facts?.deadline,
  ].filter(Boolean) as string[];
  const captionLine = captionParts.join(' · ');

  return (
    <article className="hover-card relative mb-24 grid grid-cols-1 overflow-hidden bg-bg-surface lg:grid-cols-[3fr_2fr]">
      {/* Image left (3fr) — object-cover full-height with bottom-gradient
          overlay carrying the tracked caption strip. */}
      {project.renders.length > 0 && (
        <div className="relative">
          <ResponsivePicture
            src={`renders/${project.slug}/${project.renders[0]}`}
            alt={project.title}
            widths={[640, 1280, 1920]}
            sizes="(min-width: 1280px) 768px, 100vw"
            width={1280}
            height={720}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          {/* Bottom-overlay caption — pointer-events-none so it never
              steals clicks from CTA. Gradient softens edge so caption
              stays readable on bright aerial shots. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-black/85 via-bg-black/40 to-transparent p-8">
            <p className={`${overlineClasses} text-text`}>{captionLine}</p>
          </div>
        </div>
      )}

      {/* Content right (2fr) — pulsing-dot stage label, big title,
          optional note, CTA. Vertical-centered. */}
      <div className="flex flex-col justify-center gap-6 p-12">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-2 w-2 animate-pulse rounded-full bg-accent"
          />
          <span className={`${overlineClasses} text-accent`}>
            {project.stageLabel}
          </span>
        </div>

        <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
          {project.title}
        </h3>

        {project.facts?.note && (
          <p className="text-[length:var(--text-lead)] text-text-muted">
            {project.facts.note}
          </p>
        )}

        {project.externalUrl && (
          <motion.div
            ref={ctaMagnet.ref as React.RefObject<HTMLDivElement>}
            style={ctaMagnet.style}
            className="mt-2 inline-block w-fit"
          >
            <a
              href={withLakeviewUtm(project.externalUrl, 'flagship-card')}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center bg-accent px-6 py-3 text-base font-medium text-bg-black hover:brightness-110"
            >
              {flagshipExternalCta}
            </a>
          </motion.div>
        )}
      </div>
    </article>
  );
}
