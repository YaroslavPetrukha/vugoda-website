/**
 * @module components/sections/projects/PortfolioMasthead
 *
 * Apr-2026 redesign — section 1 of 6 of the /projects registry composition.
 *
 * Editorial portfolio-register cover, replacing the previous tiny H1 block.
 * Two-column at lg+ (7/5 split): left carries overline + display H1 «5
 * проєктів» + a 3-cell figure-triplet (0 / 1 / 4) divided by faint hairlines;
 * right carries the policy paragraph as a leading muted line.
 *
 * The display H1 is the page-level <h1> — matches the «registry, not
 * marketing» voice (factual count instead of category title). Browser tab
 * still reads «Проєкти — ВИГОДА» via usePageTitle().
 *
 * Typography per DESIGN.md tokens — text-display-l for H1, text-figure for
 * the triplet numerals (tabular-nums), text-lead for the policy paragraph.
 * No accent on the numerals: cube-ladder reserves accent for cubes/CTAs.
 *
 * Stagger: parent RevealOnScroll fadeUp; children inherit (no per-child
 * variants here — the section reads as one editorial block).
 */

import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline, overlineClasses } from '../../ui/typography';
import { IsometricGridBG } from '../../brand/IsometricGridBG';
import {
  mastheadOverline,
  mastheadHeading,
  mastheadCounts,
  mastheadPolicy,
} from '../../../content/projects';

const HEADING_ID = 'portfolio-masthead-heading';

export function PortfolioMasthead() {
  return (
    <RevealOnScroll
      as="section"
      aria-labelledby={HEADING_ID}
      className="relative overflow-hidden bg-bg pt-20 pb-16 lg:pt-32 lg:pb-24"
    >
      {/* Decorative isometric cube cluster — desktop-only architectural
          accent on the right half. Static (no parallax / no drift) so the
          eye can rest on the «5 проєктів» numeral; the pattern reads as
          a blueprint behind the registry. Opacity 0.22 sits between home
          hero ambient (0.12) and contact focal (0.30) — present, not loud.
          maskImage fades the left edge so the pattern never collides with
          the H1 column. aria-hidden — purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block xl:w-[52%]"
        style={{
          maskImage:
            'linear-gradient(to left, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to left, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)',
        }}
      >
        <IsometricGridBG className="h-full w-full" opacity={0.22} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — overline + display H1 + counts triplet. */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <SectionOverline>{mastheadOverline}</SectionOverline>

            <h1
              id={HEADING_ID}
              className="text-[length:var(--text-display-l)] font-bold leading-[0.92] tabular-nums text-text"
            >
              {mastheadHeading}
            </h1>

            <ul
              aria-label="Розподіл проєктів за стадією"
              className="grid grid-cols-3 divide-x divide-text-muted/15 pt-2"
            >
              {mastheadCounts.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-3 px-6 first:pl-0 last:pr-0"
                >
                  <span className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-text">
                    {item.value}
                  </span>
                  <span className={`${overlineClasses} text-text-muted`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — policy paragraph anchored at column bottom so the
              first line aligns with the bottom of the triplet on desktop. */}
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="max-w-[44ch] text-[length:var(--text-lead)] leading-[1.55] text-text-muted">
              {mastheadPolicy}
            </p>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
