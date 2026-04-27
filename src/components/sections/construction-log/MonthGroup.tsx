/**
 * @module components/sections/construction-log/MonthGroup
 *
 * Single-month timeline section — P1-D8 rebuild (AUDIT-DESIGN §9.7).
 *
 * Restructured from a centered «H2 + 3-col grid» to a 25/75 split
 * with a sticky-left chapter-mark panel.
 *
 * Layout (lg+):
 *   [3-col left, sticky top-24]
 *     • month label «Грудень 2025» at text-h3 Bold
 *     • photo count «12 фото» at text-lead muted
 *   [9-col right]
 *     • 3-col mason grid of 4:5 portrait thumbnails (preserved)
 *     • Click opens shared <Lightbox> (preserved)
 *
 * Below lg: stacks single-col.
 *
 * Per-month useState<number>(-1) for Lightbox index — opening one
 * MonthGroup's lightbox does NOT crash when state from a sibling is
 * stale (Pitfall 9 — per-group state).
 *
 * 4:5 portrait override: ResponsivePicture default height = largestWidth*9/16
 * is wrong for these phone photos. Explicit width=640 height=800 (4:5) is
 * CLS-safe (Pitfall 4).
 *
 * Hover triple-effect (D-31..D-35) on the <button> wrapper preserved.
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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left numerics panel — sticky on lg+. */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 flex flex-col gap-3">
              <h2 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
                {month.label}
              </h2>
              <p className="text-[length:var(--text-lead)] text-text-muted">
                {month.photos.length} фото
              </p>
            </div>
          </aside>

          {/* Right thumbnails grid. */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {month.photos.map((p, i) => (
                <button
                  key={p.file}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Відкрити фото ${i + 1}`}
                  className="hover-card block overflow-hidden bg-bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <ResponsivePicture
                    src={`construction/${month.key}/${p.file}`}
                    alt={p.alt ?? ''}
                    widths={[640, 960]}
                    sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
                    width={640}
                    height={800}
                    loading="lazy"
                    className="aspect-[4/5] h-auto w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
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
