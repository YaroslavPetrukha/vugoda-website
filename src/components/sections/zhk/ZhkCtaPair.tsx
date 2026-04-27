/**
 * @module components/sections/zhk/ZhkCtaPair
 *
 * ZHK-01 — primary mailto CTA (accent-fill). Originally shipped as a CTA
 * pair (primary + secondary disabled Instagram link), but per AUDIT-MASTER
 * §3 SIN 3 + AUDIT-UX §1.5.B + P0-4 of remediation plan, the disabled
 * secondary was removed entirely. A disabled CTA reads as a public proof
 * of «we're not ready» and harms more than it helps; «краще нічого, ніж
 * disabled». When Instagram launches, restore the secondary using
 * `instagramLabel` from content/zhk-etno-dim.ts (kept for v2 reuse).
 *
 * Mirrors home ContactForm mailto pattern (encodeURIComponent for cyrillic-
 * safe URI per RESEARCH §Q17). Mailto subject literal lives in
 * src/content/zhk-etno-dim.ts (D-29 content-boundary).
 */

import { email } from '../../../content/company';
import { mailtoSubject, mailtoLabel } from '../../../content/zhk-etno-dim';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

export function ZhkCtaPair() {
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}`;

  return (
    <RevealOnScroll as="section" className="bg-bg py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6">
        <a
          href={mailHref}
          className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {mailtoLabel}
        </a>
      </div>
    </RevealOnScroll>
  );
}
