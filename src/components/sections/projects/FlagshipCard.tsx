/**
 * @module components/sections/projects/FlagshipCard
 *
 * W7 editorial redesign — drops bg-bg-surface frame + 2010-style green-glow
 * hover shadow. New composition reads as a magazine feature spread:
 *
 *   LEFT 8/12: photo full-bleed (no frame), aspect 16:10. Pulsing accent
 *     dot top-left + bottom-overlay caption «LAKEVIEW · АКТИВНЕ
 *     БУДІВНИЦТВО · 2027». Photo reveal mask on view (heroPhotoReveal
 *     L→R clip-path).
 *
 *   RIGHT 4/12: content stack on bg-bg-surface panel.
 *     • Display index «01» (text-display-l accent) — anchors as flagship-of-five
 *     • Stage overline (muted)
 *     • H2 title (bumped from h3 — flagship deserves display-second tier)
 *     • Body fact.note
 *     • CTA bg-accent with press feedback
 *
 * Drops:
 *   - hover-card scale(1.02) + green glow → utility v2 (image zoom + accent
 *     hairline). Hover affordance still present, less «2010 SaaS card».
 *   - useCursorTilt 2.5deg (dropped — competed with image zoom, was decoration)
 *
 * Preserves:
 *   - LCP target (eager + fetchPriority=high on image)
 *   - 1280-AVIF preload covers home + /projects cross-surface
 *   - Pulsing dot on stage label (Tailwind animate-pulse, RM-gated globally)
 *   - useMagnet on CTA (RM-gated inside hook)
 *   - withLakeviewUtm tracking
 *
 * Cross-surface contract: same JSX consumed by home PortfolioOverview,
 * /projects, /dev/grid (HUB-02). All 3 get the same redesign.
 */

import { motion, useReducedMotion } from 'motion/react';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { overlineClasses } from '../../ui/typography';
import { flagshipExternalCta } from '../../../content/home';
import { useMagnet } from '../../../hooks/useMagnet';
import { withLakeviewUtm } from '../../../lib/utm';
import { heroPhotoReveal } from '../../../lib/motionVariants';

interface Props {
  project: Project;
}

export function FlagshipCard({ project }: Props) {
  const ctaMagnet = useMagnet();
  const prefersReducedMotion = useReducedMotion();

  const captionParts = [
    project.title.toUpperCase(),
    project.stageLabel.toUpperCase(),
    project.facts?.deadline,
  ].filter(Boolean) as string[];
  const captionLine = captionParts.join(' · ');

  return (
    <article className="hover-card relative mb-24 grid grid-cols-1 gap-0 overflow-hidden lg:grid-cols-12">
      {/* LEFT 8/12 — photo full-bleed, no frame. */}
      {project.renders.length > 0 && (
        <div className="relative lg:col-span-8">
          {prefersReducedMotion ? (
            <ResponsivePicture
              src={`renders/${project.slug}/${project.renders[0]}`}
              alt={project.title}
              widths={[640, 1280, 1920]}
              sizes="(min-width: 1280px) 1024px, 100vw"
              width={1280}
              height={800}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/10] h-full w-full object-cover"
            />
          ) : (
            <motion.div
              className="h-full"
              variants={heroPhotoReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <ResponsivePicture
                src={`renders/${project.slug}/${project.renders[0]}`}
                alt={project.title}
                widths={[640, 1280, 1920]}
                sizes="(min-width: 1280px) 1024px, 100vw"
                width={1280}
                height={800}
                loading="eager"
                fetchPriority="high"
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </motion.div>
          )}

          {/* Top-left pulsing accent + LIVE strip (mirrors construction LIVE
              language for cross-section coherence). pointer-events-none so
              hover-card ::after rule + image zoom remain unobstructed. */}
          <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-2 w-2 animate-pulse rounded-full bg-accent"
            />
            <span className={`${overlineClasses} text-accent`}>
              {project.stageLabel}
            </span>
          </div>

          {/* Bottom-overlay caption. Gradient mask softens edge for caption
              legibility on bright aerial pixels. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-black/85 via-bg-black/40 to-transparent p-8">
            <p className={`${overlineClasses} text-text`}>{captionLine}</p>
          </div>
        </div>
      )}

      {/* RIGHT 4/12 — content panel. */}
      <div className="flex flex-col justify-center gap-6 bg-bg-surface p-12 lg:col-span-4">
        {/* Display index — flagship-of-five anchor. text-display-l accent
            tabular-nums. Sits at top of content panel as editorial chapter
            mark. */}
        <span
          aria-hidden="true"
          className="text-[length:var(--text-display-l)] font-bold leading-[0.85] tabular-nums text-accent"
        >
          01
        </span>

        <h3 className="text-[length:var(--text-h2)] font-bold leading-tight text-text">
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
              className="inline-flex items-center bg-accent px-6 py-3 text-base font-medium text-bg-black transition-[transform,filter] duration-150 ease-out hover:brightness-110 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {flagshipExternalCta}
            </a>
          </motion.div>
        )}
      </div>
    </article>
  );
}
