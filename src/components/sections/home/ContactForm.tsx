/**
 * @module components/sections/home/ContactForm
 *
 * HOME-07 — Single CTA «Ініціювати діалог» that opens the user's mail
 * client to a pre-filled mailto: message addressed to the corporate sales
 * inbox. The actual address comes from src/content/company.ts (`email`)
 * so a single edit propagates to Footer + TrustBlock + here.
 *
 * NO real form fields. Per PROJECT.md Out of Scope:
 *   «Бекенд форм у v1 — mailto: достатньо для demo-handoff.
 *    Server endpoint — v2 INFR2-04.»
 * A fake form that only concatenates inputs into a mailto query string
 * adds UI surface without real utility — D-29 rejects it.
 *
 * Heading + body + CTA label come from src/content/home.ts (contactHeading,
 * contactBody, contactCta) — Phase 3 D-29 / checker Warning 8 closes the
 * inline-Ukrainian-paragraph drift surface. Editorial copy in one file.
 */

import { email } from '../../../content/company';
import {
  contactCta,
  contactHeading,
  contactBody,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

/** Pre-filled subject line — short, branded, not a marketing claim. */
const MAIL_SUBJECT = 'Ініціювати діалог через сайт ВИГОДА';

export function ContactForm() {
  const href = `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;

  return (
    <RevealOnScroll as="section" className="bg-bg-black py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
        <h2 className="font-bold text-3xl text-text">{contactHeading}</h2>
        <p className="max-w-2xl text-base text-text-muted">{contactBody}</p>
        <a
          href={href}
          className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
        >
          {contactCta}
        </a>
      </div>
    </RevealOnScroll>
  );
}
