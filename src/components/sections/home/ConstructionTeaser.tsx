/**
 * @module components/sections/home/ConstructionTeaser
 *
 * HOME-04 — 3-5 photos from latestMonth().teaserPhotos in a horizontal
 * scroll-snap strip + CTA → /construction-log.
 *
 * Uses native CSS scroll-snap (snap-x snap-mandatory + overflow-x-auto)
 * per CLAUDE.md «What NOT to Use» — no swiper/embla/keen-slider for a
 * 3-5-item teaser. Arrow buttons fire scrollBy() programmatic scrolling
 * for mouse-affordance; the scroller is keyboard-scrollable natively.
 *
 * Reads from data/construction (latestMonth helper) and content/home
 * (CTA label). Photos go through ResponsivePicture with widths [640, 960]
 * per Phase 3 D-22 (smaller card sizes than flagship's [640,1280,1920]).
 *
 * NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14).
 */

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { latestMonth } from '../../../data/construction';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { constructionTeaserCta } from '../../../content/home';

/** Card width 320px + gap 16px = scroll step 336px. */
const SCROLL_STEP = 336;

export function ConstructionTeaser() {
  const scroller = useRef<HTMLDivElement>(null);
  const month = latestMonth();
  const photos = month.teaserPhotos ?? [];

  const scrollByDir = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: 'smooth' });
  };

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-bold text-3xl text-text">Хід будівництва Lakeview</h2>
          <span className="text-sm text-text-muted">{month.label}</span>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Прокрутити назад"
            onClick={() => scrollByDir(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
          >
            {photos.map((file) => (
              <div
                key={file}
                className="relative h-[200px] w-[320px] flex-shrink-0 snap-start overflow-hidden bg-bg-surface"
              >
                <ResponsivePicture
                  src={`construction/${month.key}/${file}`}
                  alt={`Будівельний майданчик, ${month.label.toLowerCase()}`}
                  widths={[640, 960]}
                  sizes="320px"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Прокрутити вперед"
            onClick={() => scrollByDir(1)}
            className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>

        <Link
          to="/construction-log"
          className="mt-6 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {constructionTeaserCta}
        </Link>
      </div>
    </section>
  );
}
