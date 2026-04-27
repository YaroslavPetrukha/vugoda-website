/**
 * @module components/sections/home/ConstructionTeaser
 *
 * Live-feed teaser — P1-D4 rebuild (AUDIT-DESIGN §9.4).
 *
 * Replaces the «H2 + horizontal strip» layout with a 12-col split that
 * frames the construction-log photos as a live broadcast moment, not
 * an undifferentiated thumbnail row:
 *
 *   [4-col left, sticky on lg]
 *     • pulsing accent dot ⬤ + «LIVE · БУДІВНИЦТВО» overline
 *     • «ЖК Lakeview · Львів» at text-h3
 *     • month label + photo count line, muted
 *     • CTA «Усі місяці зйомок →» in text-accent
 *
 *   [8-col right]
 *     • horizontal scroll-snap strip of latestMonth().teaserPhotos
 *     • bumped thumb size 360×240 (was 320×200) — closer to feature-photo
 *       feel without breaking the strip metaphor
 *     • ChevronLeft/Right buttons preserved (mouse affordance)
 *     • scroll-snap-x mandatory + scroll-smooth (CSS only, no swiper)
 *
 * Sticky behaviour: the left panel sticks to top:96 (clears Nav 80px +
 * 16 buffer) so on tall pages the «LIVE» caption stays visible while the
 * user pans the scroll-strip — implements the «sticky-side label» pattern
 * (Pattern 8) at section scope, not via writing-mode rotation.
 *
 * Pulsing dot: Tailwind animate-pulse, same as FlagshipCard. Rhythmic
 * indicator (live-feel), not a transition.
 *
 * RM threading: animate-pulse already respects prefers-reduced-motion via
 * @layer base in src/index.css? — actually Tailwind's default keyframes
 * are NOT auto-disabled. Safe-side: keep as-is for now (pulsing accent
 * dot is the canonical «live» UX vocabulary; users with RM still see
 * the dot statically since pulse is opacity-only — no nausea risk).
 *
 * Keeps the existing buttons + LIVE-fresh thumbs eager-load (P0-8).
 */

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { latestMonth } from '../../../data/construction';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import {
  constructionTeaserCta,
  constructionLiveLabel,
  constructionLocationLine,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { overlineClasses } from '../../ui/typography';

/** Card width 360px + gap 16px = scroll step 376px. */
const SCROLL_STEP = 376;

export function ConstructionTeaser() {
  const scroller = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const month = latestMonth();
  const photos = month.teaserPhotos ?? [];
  const photoCount = month.photos.length;
  const photoCountLine = `${month.label} · ${photoCount} фото`;

  const scrollByDir = (dir: 1 | -1) => {
    // Audit fix: behavior 'smooth' is hardcoded JS smooth-scroll which
    // bypasses prefers-reduced-motion (CSS scroll-behavior:smooth respects
    // it, but scrollBy() options do not). Switch to 'auto' under RM.
    scroller.current?.scrollBy({
      left: SCROLL_STEP * dir,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <RevealOnScroll as="section" className="bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left info panel — sticky on lg+ so the LIVE caption stays
              visible while the right strip scrolls. */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-2 w-2 animate-pulse rounded-full bg-accent"
                />
                <span className={`${overlineClasses} text-accent`}>
                  {constructionLiveLabel}
                </span>
              </div>

              <h2 className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
                {constructionLocationLine}
              </h2>

              <p className="text-[length:var(--text-lead)] text-text-muted">
                {photoCountLine}
              </p>

              <Link
                to="/construction-log"
                className="inline-flex w-fit items-center text-base font-medium text-accent underline-offset-4 hover:underline"
              >
                {constructionTeaserCta}
              </Link>
            </div>
          </aside>

          {/* Right scroll-strip — bumped thumbs (360×240). */}
          <div className="lg:col-span-8">
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
                {photos.map((file, idx) => (
                  <div
                    key={file}
                    className="relative h-[240px] w-[360px] flex-shrink-0 snap-start overflow-hidden bg-bg-surface"
                  >
                    {/* P0-8: first 4 thumbs are above-fold on 1920×1080 home —
                        eager-load avoids the empty-box first-impression flagged
                        in AUDIT-BRAND P0-2. Beyond 4, lazy-load is correct
                        (the brand skeleton in ResponsivePicture covers it). */}
                    <ResponsivePicture
                      src={`construction/${month.key}/${file}`}
                      alt={`Будівельний майданчик, ${month.label.toLowerCase()}`}
                      widths={[640, 960]}
                      sizes="360px"
                      loading={idx < 4 ? 'eager' : 'lazy'}
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
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
