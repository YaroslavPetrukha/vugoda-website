/**
 * @module components/sections/home/ContactForm
 *
 * Home Contact section — inline real form (W0 rebuild, AUDIT-SALES P1-S4).
 *
 * Replaces the prior mailto: stub with `<ContactFormFields variant="inline">`
 * — controlled inputs, validation, formsubmit.co submission. Same form
 * shape is also reachable via the popup mounted at App root, triggered
 * from CTAs across surfaces (Hero, FlagshipCard, PipelineCard, Trust).
 *
 * The inline form lives at the bottom of the home page so the user who
 * scrolled the entire narrative arrives here ready to act. The popup
 * variant is for users who hit a CTA mid-page and don't want to scroll.
 *
 * Heading + body + overline come from src/content/home.ts (Phase 3 D-29
 * boundary). Subject for the inbox is set here per surface.
 */

import {
  contactHeading,
  contactBody,
  contactOverline,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline } from '../../ui/typography';
import { ContactFormFields } from '../../forms/ContactFormFields';

const INLINE_SUBJECT = 'Запит з головної — vugoda';

export function ContactForm() {
  return (
    <RevealOnScroll as="section" className="bg-bg-black py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:gap-24">
        <header className="flex flex-col gap-6">
          <SectionOverline>{contactOverline}</SectionOverline>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {contactHeading}
          </h2>
          <p className="text-[length:var(--text-lead)] leading-relaxed text-text">
            {contactBody}
          </p>
        </header>

        <div className="lg:pt-2">
          <ContactFormFields variant="inline" subject={INLINE_SUBJECT} />
        </div>
      </div>
    </RevealOnScroll>
  );
}
