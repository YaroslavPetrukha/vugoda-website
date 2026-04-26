/**
 * @module components/sections/zhk/ZhkCtaPair
 *
 * ZHK-01 — CTA pair: primary mailto (accent-fill) + secondary disabled
 * Instagram link (D-18). Side-by-side at lg breakpoint, stacked below lg.
 *
 * Mirrors home ContactForm mailto pattern (encodeURIComponent for cyrillic-
 * safe URI per RESEARCH §Q17). Mailto subject literal lives in
 * src/content/zhk-etno-dim.ts (D-29 content-boundary).
 *
 * Secondary button uses href={socials.instagram} (= '#') with cursor-default
 * + aria-label, matching Footer disabled-social pattern (Phase 1 D-08).
 * The socials.instagram placeholder href communicates «coming soon» without
 * implying working interactivity.
 */

import { email, socials } from '../../../content/company';
import { mailtoSubject, mailtoLabel, instagramLabel } from '../../../content/zhk-etno-dim';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

export function ZhkCtaPair() {
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}`;

  return (
    <RevealOnScroll as="section" className="bg-bg py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 lg:flex-row lg:justify-center">
        <a
          href={mailHref}
          className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {mailtoLabel}
        </a>
        <a
          href={socials.instagram}
          aria-label={instagramLabel}
          className="inline-flex items-center border border-text-muted px-8 py-4 text-base font-medium text-text-muted cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {instagramLabel}
        </a>
      </div>
    </RevealOnScroll>
  );
}
