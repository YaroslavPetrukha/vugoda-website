/**
 * @module components/sections/zhk/ZhkHero
 *
 * Cinematic ЖК hero — P1-D7 rebuild (AUDIT-DESIGN §9.6).
 *
 * Replaces the contained 16:9 aspect-ratio render with a 100vh full-bleed
 * hero whose render fills the viewport and a bottom-overlay caption
 * stack carries the project name, stage chip, and overline.
 *
 * Anatomy:
 *   - <section> 100vh, position relative, overflow-hidden, bg-bg-black
 *     (avoid bg-bg flash before image loads)
 *   - <ResponsivePicture> absolute inset-0, object-cover.
 *     LCP target: loading=eager + fetchPriority=high preserved (Pitfall 8).
 *   - bottom-overlay <div> linear-gradient bg-bg-black/85 → transparent,
 *     padding-x rhythm-xl, padding-bottom rhythm-xl. pointer-events-none
 *     so future hover effects on the image don't lose hit-testing.
 *     Contents:
 *       • overline «ЖК · ПОВНИЙ КЕЙС» tracked uppercase muted
 *       • h1 project.title at text-display-l (clamp 72-128) Bold
 *       • accent-bordered chip with project.stageLabel (text-accent on
 *         bg-bg-black/60 with 1px accent border)
 *       • optional location tail muted
 *
 * Accessibility:
 *   - h1 carries the project name (top of doc heading hierarchy).
 *   - aria-hidden image (alt='') because the title duplicates name. The
 *     <img>'s alt is the project.title — keep so SR users hear the
 *     subject once via h1, once via image-alt — accept this small
 *     duplication for SR-discoverable image semantic.
 *   - chip stage label is a separate <span> with semantic color contrast
 *     accent-on-bg-black-60 = 11.5:1 AAA.
 *
 * LCP: 1920w AVIF preload still NOT in index.html (only home flagship is
 * preloaded there). Rely on eager+high for /zhk/etno-dim — RESEARCH §Q3
 * Option A. Phase 6 measures with Lighthouse and may add dynamic preload
 * if LCP regresses post-restructure.
 */

import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { zhkHeroOverline } from '../../../content/zhk-etno-dim';

interface Props {
  project: Project;
}

export function ZhkHero({ project }: Props) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg-black">
      {/* Render — fills viewport, object-cover. LCP target. */}
      <div className="absolute inset-0">
        <ResponsivePicture
          src={`renders/${project.slug}/${project.renders[0]}`}
          alt={project.title}
          widths={[640, 1280, 1920]}
          sizes="100vw"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover"
          skeleton={false}
        />
      </div>

      {/* Bottom-overlay caption stack — gradient softens the edge so the
          caption stays readable on bright/varied renders. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-black/90 via-bg-black/40 to-transparent">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-32">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {zhkHeroOverline}
          </p>
          <h1 className="text-[length:var(--text-display-l)] font-bold leading-[0.95] text-text">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            {/* Stage chip — accent border, accent text on bg-black/60. */}
            <span className="pointer-events-auto inline-flex items-center border border-accent bg-bg-black/60 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.18em] text-accent">
              {project.stageLabel}
            </span>
            {project.location && (
              <span className="text-[length:var(--text-lead)] text-text-muted">
                {project.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
