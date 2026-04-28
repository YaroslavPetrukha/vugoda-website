/**
 * @module pages/ContactPage
 *
 * Apr-2026 — site-vocabulary rebuild + real form + map embed.
 *
 * Previous version:
 *   - full-bleed `grid-cols-2 min-h-screen` split with bg-bg + bg-bg-black
 *     halves — broke the rhythm of every other page (which use the standard
 *     `mx-auto max-w-7xl px-6` container with bg-bg + 12-col grid)
 *   - mailto: button as primary action, while a real <ContactFormFields>
 *     component already lived in the codebase, designed for this exact page
 *   - 3 «У розробці» rows + dead social icons in реквізити, even though
 *     ContactFormFields is the actual primary contact path
 *
 * This rebuild aligns /contact with the rest of the site:
 *
 *   Section 1 — header + form (bg-bg, max-w-7xl, 12-col grid 5/7)
 *     <decorative isometric pattern, right side, mask-faded — same vocab
 *      as PortfolioMasthead so the page-heads of /projects and /contact
 *      speak one design language>
 *     LEFT col-5  → overline · H1 · subtitle · ContactDetails
 *                   (email + address + closing line)
 *     RIGHT col-7 → ContactFormFields variant=inline (real, validated,
 *                   formsubmit.co backend). Form gets the wider column
 *                   because it IS the primary action.
 *
 *   Section 2 — Google Maps embed (bg-bg, max-w-7xl)
 *     Iframe: maps.google.com/maps?q=…&output=embed (no API key, no JS bundle
 *     cost, lazy-loaded). Caption underneath duplicates the address so the
 *     page is readable when the iframe is blocked (corp networks / privacy
 *     extensions). a11y title attr names the iframe content.
 *
 * Pin stack from the previous design dropped — /projects already shows the
 * same 3 ЖК objects, repeating them on /contact added noise. The map gives
 * the page its own visual anchor instead.
 *
 * Default export preserved (App.tsx import unchanged).
 */

import { usePageTitle } from '../hooks/usePageTitle';
import {
  contactPageHeading,
  contactPageOverline,
  contactPageSubtitle,
  contactMailSubject,
  mapIframeTitle,
  mapCaption,
  pageTitle,
} from '../content/contact';
import { address, addressUnit } from '../content/placeholders';
import { ContactDetails } from '../components/sections/contact/ContactDetails';
import { ContactFormFields } from '../components/forms/ContactFormFields';
import { IsometricGridBG } from '../components/brand/IsometricGridBG';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { SectionOverline } from '../components/ui/typography';

const HEADING_ID = 'contact-page-heading';

/** Google Maps no-API-key embed. Cyrillic query → Google geocodes; z=17 lands
 *  the user on the building, not the district. Falls back to text caption
 *  when the iframe is blocked. */
const MAP_QUERY = encodeURIComponent('вул. Володимира Великого, 4, Львів');
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&output=embed&z=17`;

export default function ContactPage() {
  usePageTitle(pageTitle);

  return (
    <>
      {/* Section 1 — header + real form.
          Layout: 50/50 split (lg:grid-cols-2). Previous 5/7 split (12-col)
          was too narrow for the H1 — at 16" Mac (1728px) col-5 ≈ 476px and
          «Поговоримо» Bold 84px ≈ 483px, overflowing into the form column.
          Even shrunk, 50/50 reads more balanced for two equal-content cols
          (header+реквізити vs. form).
          Background: ambient isometric pattern at opacity 0.07 over the full
          section. Same level as home/ContactForm corner accent (0.04) — quiet
          enough not to compete with the form's underline inputs, present
          enough that the section doesn't read as «порожній фон». */}
      <RevealOnScroll
        as="section"
        aria-labelledby={HEADING_ID}
        className="relative overflow-hidden bg-bg pt-20 pb-20 lg:pt-32 lg:pb-24"
      >
        {/* Ambient isometric texture — full-section, very low opacity so it
            reads as paper-grain, not decoration. aria-hidden, pointer-events
            none. Hidden below lg where the layout stacks and pattern would
            compete with the single-column reading flow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          <IsometricGridBG className="h-full w-full" opacity={0.07} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            {/* LEFT — header + direct contact info. min-w-0 keeps long
                strings (email, address) from stretching the column. */}
            <div className="flex min-w-0 flex-col gap-10">
              <header className="flex flex-col gap-4">
                <SectionOverline>{contactPageOverline}</SectionOverline>
                {/* H1 sized to fit a 50/50 column at lg-min through 1728px:
                    clamp(48, 4.4vw, 72) keeps «Поговоримо» Bold under
                    ~414px max-width — well within the column. */}
                <h1
                  id={HEADING_ID}
                  className="text-[length:clamp(48px,4.4vw,72px)] font-bold leading-[0.95] text-balance text-text"
                >
                  {contactPageHeading}
                </h1>
                <p className="max-w-[44ch] text-[length:var(--text-lead)] leading-[1.55] text-text-muted">
                  {contactPageSubtitle}
                </p>
              </header>

              <ContactDetails />
            </div>

            {/* RIGHT — real form. */}
            <div className="min-w-0 lg:pt-2">
              <ContactFormFields
                variant="inline"
                subject={contactMailSubject}
              />
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Section 2 — Google Maps embed + caption. Same container as
          section 1 so the visual band aligns with the rest of the site. */}
      <RevealOnScroll
        as="section"
        aria-label="Карта офісу продажу"
        className="bg-bg pb-24 lg:pb-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden">
            <iframe
              title={mapIframeTitle}
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-80 w-full border-0 lg:h-[480px]"
            />
          </div>
          <p className="mt-6 max-w-[60ch] text-[length:var(--text-lead)] leading-[1.55] text-text-muted">
            <span className="text-text">{address}</span>
            {' · '}
            {addressUnit}
            {' — '}
            {mapCaption}
          </p>
        </div>
      </RevealOnScroll>
    </>
  );
}
