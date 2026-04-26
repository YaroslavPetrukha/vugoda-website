/**
 * @module components/sections/construction-log/MonthGroup
 *
 * LOG-01 + LOG-02 — Single month section of the construction-log timeline
 * (D-20..D-24). H2 with the month label and photo count, 3-col grid of 4:5
 * portrait thumbnails (D-22 + RESEARCH §Q11), all loading="lazy" per <2MB
 * initial weight budget.
 *
 * Per-month useState<number>(-1) for Lightbox index — opening one
 * MonthGroup's lightbox does NOT crash when state from a sibling MonthGroup
 * is stale (Pitfall 9 — per-group state avoids the index-out-of-bounds
 * class of bug). Browser top-layer guarantees only one <dialog> open at
 * a time.
 *
 * 4:5 portrait override: ResponsivePicture default height = largestWidth*9/16
 * is wrong for these phone photos. Explicit width=640 height=800 (4:5) is
 * CLS-safe (Pitfall 4 — verified 1080x1346 sources).
 *
 * Hover triple-effect (ANI-03 / D-31..D-35) on the <button> wrapper.
 * Class string verbatim — Wave 3 plan 04-10 sweeps other surfaces;
 * thumbnail hover ships locally here.
 *
 * IMPORT BOUNDARY: forwards construction/{key}/{file} template into
 * ResponsivePicture; never embeds quoted slash-prefixed tree-paths.
 */

import { useState } from 'react';
import type { ConstructionMonth } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

interface Props {
  month: ConstructionMonth;
}

export function MonthGroup({ month }: Props) {
  const [index, setIndex] = useState(-1);

  const photos: LightboxPhoto[] = month.photos.map((p) => ({
    src: `construction/${month.key}/${p.file}`,
    alt: p.alt ?? '',
    caption: p.caption,
    label: month.label,
  }));

  return (
    <RevealOnScroll as="section" className="bg-bg py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 font-bold text-3xl text-text">
          {month.label} · {month.photos.length} фото
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {month.photos.map((p, i) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Відкрити фото ${i + 1}`}
              className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ResponsivePicture
                src={`construction/${month.key}/${p.file}`}
                alt={p.alt ?? ''}
                widths={[640, 960]}
                sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
                width={640}
                height={800}
                loading="lazy"
                className="w-full h-auto object-cover aspect-[4/5]"
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
    </RevealOnScroll>
  );
}
