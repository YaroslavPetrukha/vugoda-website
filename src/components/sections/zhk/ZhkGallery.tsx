/**
 * @module components/sections/zhk/ZhkGallery
 *
 * ZHK-01 — 8-render gallery (D-16, D-17). 4-col at lg breakpoint (1280+),
 * 2-col at md (1024-1279), 1-col at sm/xs. Each cell uses
 * <ResponsivePicture widths={[640, 1280]} loading="lazy"> per Phase 4
 * convention.
 *
 * Click opens shared <Lightbox> (D-17, D-25..D-28). Single page-level
 * useState<number> for current index (-1 = closed). Lightbox state lives
 * inside this gallery component (per plan truths).
 *
 * Hover triple-effect (ANI-03 / D-30..D-35) is applied here on the
 * <button> wrapper around each thumb. Wave 3 plan 04-10 sweeps other
 * surfaces (FlagshipCard, PipelineCard); gallery thumb hover ships here.
 *
 * IMPORT BOUNDARY: forwards render path strings into ResponsivePicture, which
 * composes URLs via lib/assetUrl. This component never embeds the
 * quoted, slash-delimited tree-prefix patterns that scripts/check-brand.ts
 * importBoundaries() greps for.
 */

import { useState } from 'react';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';

interface Props {
  project: Project;
}

export function ZhkGallery({ project }: Props) {
  const [index, setIndex] = useState(-1);

  const photos: LightboxPhoto[] = project.renders.map((file, i) => ({
    src: `renders/${project.slug}/${file}`,
    alt: `${project.title} — рендер ${i + 1}`,
    label: project.title,
  }));

  if (project.renders.length === 0) return null;

  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {project.renders.map((file, i) => (
            <button
              key={file}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Відкрити рендер ${i + 1}`}
              className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ResponsivePicture
                src={`renders/${project.slug}/${file}`}
                alt={`${project.title} — рендер ${i + 1}`}
                widths={[640, 1280]}
                sizes="(min-width: 1280px) 320px, 50vw"
                loading="lazy"
                className="w-full aspect-video object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <Lightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(-1)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
