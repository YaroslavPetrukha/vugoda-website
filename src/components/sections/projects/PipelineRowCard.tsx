/**
 * @module components/sections/projects/PipelineRowCard
 *
 * W7 horizontal-row pipeline card — used by home PortfolioOverview only.
 * /projects + /dev/grid surfaces keep the 3-up grid PipelineCard for
 * catalog-style browsing. Home reads as registry-list editorial: 3 rows
 * stacked vertically, each row anchored by an order index «02 / 05».
 *
 * Anatomy (12-col grid per row):
 *   col 1-5  photo with isometric-grid overlay (aspect 5/4)
 *   col 6    display index «02» (text-display-l accent, tabular-nums)
 *   col 7-12 content stack: stage overline · title · location · next step · CTA
 *
 * Hover: hover-card v2 utility (image zoom + accent hairline at bottom).
 * No green-glow shadow.
 *
 * Drops vs PipelineCard grid:
 *   - bg-bg-surface frame (registry list reads as transparent rows separated
 *     by hairlines, not stacked panels)
 *   - 4:3 aspect (replaced with 5:4 — closer to magazine feature ratio)
 *   - mason translate-y offset (vertical list doesn't benefit from offset)
 *
 * Press feedback on CTA (active:scale-[0.97]) per Emil framework. Magnet
 * dropped — at horizontal row scale, magnet jitter competes with image
 * zoom; consistent inline scale press is enough.
 *
 * IMPORT BOUNDARY: forwards path templates into ResponsivePicture.
 */

import { Link } from 'react-router-dom';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { useContactPopup } from '../../forms/ContactPopupProvider';
import { overlineClasses } from '../../ui/typography';
import isometricGridUrl from '../../../../brand-assets/patterns/isometric-grid.svg';

interface Props {
  project: Project;
  /** Order index for display chunking — «02», «03», etc. Pad to 2 digits. */
  index: number;
  /** Total project count for «of N» label. */
  total: number;
}

export function PipelineRowCard({ project, index, total }: Props) {
  const isClickable = project.presentation === 'full-internal';
  const contactPopup = useContactPopup();

  const handleCtaClick = () => {
    if (!project.cta) return;
    contactPopup.open({
      subject: project.cta.mailtoSubject,
      initialMessage: `Цікавить ${project.title}. `,
    });
  };

  const ordinal = String(index).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <article className="hover-card grid grid-cols-1 gap-8 border-t border-text-muted/15 py-12 lg:grid-cols-12 lg:gap-12">
      {/* Photo with brand isometric-grid overlay. col-span-5 on lg.
          Aspect 5:4 reads as registry feature (slightly taller than 4:3,
          slightly wider than square). */}
      {project.renders.length > 0 && (
        <div className="relative lg:col-span-5">
          <ResponsivePicture
            src={`renders/${project.slug}/${project.renders[0]}`}
            alt={project.title}
            widths={[640, 1280]}
            sizes="(min-width: 1280px) 600px, 100vw"
            loading="lazy"
            className="aspect-[5/4] w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-10"
            style={{
              backgroundImage: `url(${isometricGridUrl})`,
              backgroundSize: '220px 167px',
              backgroundRepeat: 'repeat',
            }}
          />
        </div>
      )}

      {/* Display ordinal index — col 6-7 (col-span-2). «02 / 05» style,
          ordinal accent + total muted. tabular-nums.
          col-span-2 is the minimum that fits text-display-l (~128px wide
          at 1920) inside the lg-grid track without overlapping the
          adjacent content column — col-span-1 measures ~60px on
          max-w-7xl, which forces the digits to overflow into col-7. */}
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

      {/* Content stack — col 8-12. Stage · Title · Location · NextStep · CTA. */}
      <div className="flex flex-col justify-center gap-4 lg:col-span-5">
        <span className={`${overlineClasses} text-text-muted`}>
          {project.stageLabel}
        </span>

        {isClickable ? (
          <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
            <Link
              to={`/zhk/${project.slug}`}
              className="transition-colors duration-150 ease-out hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {project.title}
            </Link>
          </h3>
        ) : (
          <h3 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
            {project.title}
          </h3>
        )}

        {project.location && (
          <span className="text-base text-text-muted">{project.location}</span>
        )}

        {project.nextStep && (
          <span className="text-base text-text-muted">
            <span aria-hidden="true" className="text-accent">→ </span>
            {project.nextStep}
          </span>
        )}

        {project.cta && (
          <button
            type="button"
            onClick={handleCtaClick}
            className="mt-4 inline-flex w-fit items-center bg-accent px-5 py-3 text-sm font-medium text-bg-black transition-[transform,filter] duration-150 ease-out hover:brightness-110 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {project.cta.label}
          </button>
        )}
      </div>
    </article>
  );
}
