/**
 * @module pages/ContactPage
 *
 * CTC-01 — Single-column centered contact page (D-36).
 *   h1 {contactPageHeading}
 *   p  {contactPageSubtitle}
 *   ContactDetails          — 4-row реквізити-block (D-37)
 *   a[href=mailto:]         — primary CTA button, accent-fill
 *
 * Mailto subject reuses the home pattern (encodeURIComponent for cyrillic).
 * Subject literal is single-sourced from content/contact.ts (M-3) so the
 * mail client dedupes the thread across home ContactForm and this page.
 *
 * Default export preserved (App.tsx import unchanged).
 *
 * D-38: No legal-registry duplication — Footer renders those on every
 * route per Phase 1 D-06 (NAV-01 footer requirements).
 */

import { email } from '../content/company';
import {
  contactPageHeading,
  contactPageSubtitle,
  contactPageCta,
  contactMailSubject,
} from '../content/contact';
import { ContactDetails } from '../components/sections/contact/ContactDetails';

export default function ContactPage() {
  const href = `mailto:${email}?subject=${encodeURIComponent(contactMailSubject)}`;

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
        <header className="flex flex-col gap-4">
          <h1 className="font-bold text-6xl text-text">{contactPageHeading}</h1>
          <p className="text-base text-text-muted">{contactPageSubtitle}</p>
        </header>

        <ContactDetails />

        <div className="pt-4">
          <a
            href={href}
            className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {contactPageCta}
          </a>
        </div>
      </div>
    </section>
  );
}
