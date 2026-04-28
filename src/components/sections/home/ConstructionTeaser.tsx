/**
 * @module components/sections/home/ConstructionTeaser
 *
 * W7 cinematic redesign — drops the «sticky-side label + horizontal thumb
 * tickertape» layout (user feedback: «йбіздний блок»). New composition is
 * a magazine-feature spread: 7/12 cinematic hero photo + 5/12 month timeline
 * editorial rail.
 *
 * Layout (12-col, lg ≥ 1280):
 *
 *   LEFT 7/12 — featured photo, aspect 4:3 cinematic
 *     • Top-left overlay: pulsing accent dot + «LIVE · LAKEVIEW · ВИННИКИ»
 *     • Bottom-left overlay: «БЕРЕЗЕНЬ 2026» (display-l accent) +
 *       photo count caption muted
 *     • Image-reveal mask on view (heroPhotoReveal L→R clip-path)
 *     • Bottom-gradient mask softens overlay legibility
 *
 *   RIGHT 5/12 — timeline editorial rail
 *     • Overline «ХІД БУДІВНИЦТВА · LAKEVIEW»
 *     • Display title from data.label «Березень 2026.» — text-h2 bold
 *     • Body: shoot cadence statement
 *     • Timeline list — 4 rows, each row = «{MMM YYYY} · {N фото}» with
 *       hairline separators. Latest row = accent + bold; older rows muted.
 *     • CTA «Усі місяці зйомок →» (accent, press-feedback)
 *
 * Reads constructionLog[] (full archive) instead of just latestMonth() —
 * needed for timeline rendering. latestMonth() still drives the hero photo.
 *
 * Drops:
 *   - sticky-side LIVE label panel + scroll-snap chevron strip
 *   - 5 thumb tickertape (replaced by 1 cinematic hero + month timeline)
 *   - lucide-react ChevronLeft / ChevronRight imports
 *
 * Preserves:
 *   - LIVE pulsing dot vocabulary (re-anchored on top-left of photo)
 *   - py-24 (Stage 2 beat-pattern: compressed teaser tier)
 *   - Link to /construction-log for «Усі місяці» destination
 *   - LCP eager-load on hero photo (was eager on first 4 strip thumbs)
 *
 * Brand pattern: isometric-grid overlay at bottom-right, masked to fade
 * into bg-bg. Adds engineering-trace texture without competing with photo.
 */

import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { constructionLog, latestMonth } from '../../../data/construction';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import {
  constructionTeaserCta,
  constructionLiveLabel,
  constructionLocationLine,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline, overlineClasses } from '../../ui/typography';
import { heroPhotoReveal } from '../../../lib/motionVariants';
import isometricGridUrl from '../../../../brand-assets/patterns/isometric-grid.svg';

const SECTION_OVERLINE = 'ХІД БУДІВНИЦТВА · LAKEVIEW';

export function ConstructionTeaser() {
  const prefersReducedMotion = useReducedMotion();
  const month = latestMonth();
  const heroPhoto = month.teaserPhotos?.[0] ?? month.photos[0]?.file;
  const photoCount = month.photos.length;

  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Brand isometric-grid overlay — bottom-right corner, masked fade.
          Engineering-trace texture under the timeline rail without competing
          with the cinematic photo on the left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 hidden h-[70%] w-[35%] opacity-[0.10] lg:block"
        style={{
          backgroundImage: `url(${isometricGridUrl})`,
          backgroundSize: '440px 334px',
          backgroundRepeat: 'repeat',
          // W8 fix — radial mask anchored at bottom-right corner. The prior
          // linear-gradient `to top left` left HARD edges where the pattern
          // container met the section bottom/right boundaries (mask was 100%
          // opaque at the corner-anchor point and only faded along ONE
          // diagonal axis). Radial fades on every axis so the pattern dies
          // smoothly into bg-bg regardless of where the pattern container
          // ends. `circle ... at right bottom` keeps the «anchored at corner»
          // composition — peak density still at bottom-right, gone by 90%
          // of the radius.
          maskImage:
            'radial-gradient(circle 600px at right bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage:
            'radial-gradient(circle 600px at right bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT 7/12 — cinematic featured photo with overlays. aspect-[4/3]
              gives the editorial 1.33:1 landscape ratio; right column is
              compressed to fit this height (W8 align fix — body line
              dropped, gap-12 → gap-6 between sections, justify-between
              stays so header anchors top / timeline middle / CTA bottom). */}
          {heroPhoto && (
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface lg:col-span-7">
              {prefersReducedMotion ? (
                <ResponsivePicture
                  src={`construction/${month.key}/${heroPhoto}`}
                  alt={`Будівельний майданчик Lakeview, ${month.label.toLowerCase()}`}
                  widths={[640, 960, 1920]}
                  sizes="(min-width: 1280px) 1024px, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                <motion.div
                  className="h-full w-full"
                  variants={heroPhotoReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <ResponsivePicture
                    src={`construction/${month.key}/${heroPhoto}`}
                    alt={`Будівельний майданчик Lakeview, ${month.label.toLowerCase()}`}
                    widths={[640, 960, 1920]}
                    sizes="(min-width: 1280px) 1024px, 100vw"
                    loading="eager"
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              )}

              {/* Top-left LIVE badge — pulsing accent dot + label.
                  Photo identity comes from the LIVE + location overline +
                  the right-column timeline (which owns the month sequence).
                  The big «БЕРЕЗЕНЬ 2026» display caption was removed in W8
                  alignment-pass: it duplicated the timeline's active row
                  and created a vertical-axis mismatch user flagged as «біда». */}
              <div
                className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-3"
                style={{ textShadow: '0 1px 3px rgba(2,10,10,0.7)' }}
              >
                <span
                  aria-hidden="true"
                  className="block h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_8px_rgba(193,243,61,0.6)]"
                />
                <span className={`${overlineClasses} text-accent`}>
                  {constructionLiveLabel}
                </span>
                <span aria-hidden="true" className="text-text/40">·</span>
                <span className={`${overlineClasses} text-text`}>
                  {constructionLocationLine}
                </span>
              </div>

              {/* Bottom-right photo count tag — small registry pill,
                  doesn't compete with the timeline's typographic hierarchy. */}
              <div
                className="pointer-events-none absolute right-6 bottom-6 z-10"
                style={{ textShadow: '0 1px 3px rgba(2,10,10,0.7)' }}
              >
                <span className={`${overlineClasses} text-accent`}>
                  {photoCount} фото
                </span>
              </div>
            </div>
          )}

          {/* RIGHT 5/12 — timeline editorial rail. W8 align fix:
              gap-12 → gap-6 across sections (tighter rhythm), body line
              «Дрон-зйомка майданчика…» dropped (cadence info redundant
              with the section overline + monthly timeline below — readers
              infer «monthly» from 4 dated rows). justify-between keeps
              header up top, timeline mid, CTA flush bottom against the
              photo's lower edge. */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <RevealOnScroll className="flex flex-col gap-4">
              <SectionOverline>{SECTION_OVERLINE}</SectionOverline>
              <h2 className="text-[length:var(--text-h2)] font-bold leading-tight text-text">
                Знімаємо щомісяця.
              </h2>
            </RevealOnScroll>

            {/* Timeline — 4 rows, latest = accent + bold, older = muted.
                Hairline separators read as registry ledger entries. */}
            <RevealOnScroll
              staggerChildren={60}
              className="flex flex-col"
            >
              {constructionLog.map((m, i) => {
                const isLatest = i === 0;
                return (
                  <motion.div
                    key={m.key}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className={`flex items-baseline justify-between border-t py-4 ${
                      isLatest
                        ? 'border-accent'
                        : 'border-text-muted/15'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className={`block h-2 w-2 rounded-full ${
                          isLatest ? 'bg-accent' : 'bg-text-muted/30'
                        }`}
                      />
                      <span
                        className={`text-base font-bold uppercase tracking-[0.06em] ${
                          isLatest ? 'text-text' : 'text-text-muted'
                        }`}
                      >
                        {m.label}
                      </span>
                    </div>
                    <span
                      className={`text-sm tabular-nums ${
                        isLatest ? 'text-accent' : 'text-text-muted/60'
                      }`}
                    >
                      {m.photos.length} фото
                    </span>
                  </motion.div>
                );
              })}
            </RevealOnScroll>

            <Link
              to="/construction-log"
              className="inline-flex w-fit items-baseline gap-2 text-base font-medium text-accent underline-offset-4 transition-transform duration-150 ease-out hover:underline active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <span>{constructionTeaserCta.replace(' →', '')}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
