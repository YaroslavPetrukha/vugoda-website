/**
 * @module components/sections/zhk/ZhkGallery
 *
 * Feature-first gallery — P1-D7 rebuild (AUDIT-DESIGN §9.6 spec
 * «feature-render першим (aspect-16:10, 100% width); решта 7 — 2-col»).
 *
 * Pulls the first render out of the grid as a hero feature image
 * (full-width 16:10 aspect ratio), then displays the remaining 7 renders
 * in a responsive grid below. Section-level overline frames the set.
 *
 * Click on any thumb (incl. feature) opens the shared <Lightbox>.
 *
 * Hover triple-effect (ANI-03 / D-30..D-35) preserved on the <button>
 * wrapper around each thumb. Phase 4 plan 04-10 sweep applied here.
 *
 * IMPORT BOUNDARY: forwards render path strings into ResponsivePicture, which
 * composes URLs via lib/assetUrl. This component never embeds the
 * quoted, slash-delimited tree-prefix patterns that scripts/check-brand.ts
 * importBoundaries() greps for.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';
import { galleryOverline } from '../../../content/zhk-etno-dim';

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

  const [feature, ...rest] = project.renders;

  return (
    <RevealOnScroll as="section" className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-12 text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
          {galleryOverline}
        </p>

        {/* Feature render — full-width 16:10. */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mb-6">
          <button
            type="button"
            onClick={() => setIndex(0)}
            aria-label={`Відкрити рендер 1`}
            className="hover-card block w-full overflow-hidden bg-bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ResponsivePicture
              src={`renders/${project.slug}/${feature}`}
              alt={`${project.title} — рендер 1`}
              widths={[640, 1280, 1920]}
              sizes="(min-width: 1280px) 1280px, 100vw"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          </button>
        </motion.div>

        {/* Remaining 7 renders — 4-col mason at lg, 2-col at md. */}
        <RevealOnScroll
          as="ul"
          staggerChildren
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {rest.map((file, i) => (
            <motion.li key={file} variants={fadeUp} className="list-none">
              <button
                type="button"
                onClick={() => setIndex(i + 1)}
                aria-label={`Відкрити рендер ${i + 2}`}
                className="hover-card block w-full overflow-hidden bg-bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <ResponsivePicture
                  src={`renders/${project.slug}/${file}`}
                  alt={`${project.title} — рендер ${i + 2}`}
                  widths={[640, 1280]}
                  sizes="(min-width: 1280px) 320px, 50vw"
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              </button>
            </motion.li>
          ))}
        </RevealOnScroll>
      </div>
      <Lightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(-1)}
        onIndexChange={setIndex}
      />
    </RevealOnScroll>
  );
}
