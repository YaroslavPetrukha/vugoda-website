/**
 * @module components/sections/projects/ClosingNote
 *
 * Apr-2026 redesign — section 6 of 6, the editorial closer of the
 * /projects registry. Single statement of the publication policy with a
 * cross-page link into the methodology section on home.
 *
 * Composition: 2-col masthead-echo at lg+ — left col carries a small
 * «Реєстр» overline (rhymes with the masthead's date-stamp); right col
 * carries the editorial line + accent link.
 *
 * Link target: `/#methodology` — a plain anchor (not <Link>) so the
 * browser handles the cross-page hash scroll natively. Trade-off: full
 * route transition is bypassed for this one link, but we get correct
 * fragment-scroll behavior without bolting hash-scroll handling onto
 * HomePage. Acceptable for a marketing-site cross-link.
 *
 * The link href is composed against Vite's BASE_URL so the same JSX
 * resolves correctly under dev (`/`) and Pages prod (`/vugoda-website/`).
 */

import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline } from '../../ui/typography';
import {
  closingNoteText,
  closingNoteLinkLabel,
  closingNoteLinkHref,
} from '../../../content/projects';

const HEADING_ID = 'projects-closing-note';

/** Compose link URL respecting Vite's basename. closingNoteLinkHref is
 *  declared as `/#methodology`; under prod it resolves to
 *  `/vugoda-website/#methodology` so the hash navigation works on Pages. */
function resolveClosingHref(href: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  // href starts with '/' → strip leading slash, prepend base.
  return `${base}${href}`;
}

export function ClosingNote() {
  const linkHref = resolveClosingHref(closingNoteLinkHref);

  return (
    <RevealOnScroll
      as="section"
      aria-labelledby={HEADING_ID}
      className="bg-bg pt-24 pb-32 lg:pt-32 lg:pb-40"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — small overline echoing masthead. */}
          <div className="lg:col-span-2 lg:pt-2">
            <SectionOverline tone="muted">Реєстр</SectionOverline>
          </div>

          {/* RIGHT — editorial line + link. */}
          <div className="flex flex-col gap-8 lg:col-span-8">
            <p
              id={HEADING_ID}
              className="text-[length:var(--text-h3)] font-medium leading-[1.25] text-text"
            >
              {closingNoteText}
            </p>
            <a
              href={linkHref}
              className="inline-flex w-fit items-center gap-2 text-base font-medium text-accent transition-opacity duration-150 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {closingNoteLinkLabel}
            </a>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
