/**
 * @module components/sections/contact/ContactDetails
 *
 * CTC-01 — Реквізити-block (D-37). 4 rows in dl/dt/dd: Email,
 * Телефон, Адреса, Соцмережі. Email is the only active link (mailto);
 * phone/address render the em-dash placeholder per Phase 2 D-19;
 * social icons are href="#" with cursor-default and aria-label per
 * Phase 1 D-08 disabled-state convention.
 *
 * D-38: No legal-registry / license duplication here — Footer renders
 * those on every route per Phase 1 D-06 (NAV-01 footer requirements).
 * This component stays focused on contact channels only.
 *
 * WCAG note (Pitfall 6): dt labels at text-base (16px) on bg-bg pass
 * the 5.3:1 AA floor for text-text-muted (#A7AFBC on #2F3640) at ≥14pt.
 * text-sm + font-medium boosts perceived contrast at smaller sizes.
 *
 * Lucide icon choice: lucide-react v1.11 does not export Instagram or
 * Facebook by name. Fallback per Phase 3 RESEARCH §I: Send (Telegram),
 * MessageCircle (Instagram-ish), Globe (Facebook).
 */

import { Send, MessageCircle, Globe } from 'lucide-react';
import { email, socials } from '../../../content/company';
import { phone, address } from '../../../content/placeholders';

export function ContactDetails() {
  return (
    <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[120px_1fr] lg:gap-x-8">
      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
        Email
      </dt>
      <dd className="text-base text-text">
        <a
          href={`mailto:${email}`}
          className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {email}
        </a>
      </dd>

      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
        Телефон
      </dt>
      <dd className="text-base text-text">{phone}</dd>

      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
        Адреса
      </dt>
      <dd className="text-base text-text">{address}</dd>

      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
        Соцмережі
      </dt>
      <dd className="flex gap-4">
        <a
          href={socials.telegram}
          aria-label="Telegram"
          className="cursor-default text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Send size={20} aria-hidden="true" />
        </a>
        <a
          href={socials.instagram}
          aria-label="Instagram"
          className="cursor-default text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <MessageCircle size={20} aria-hidden="true" />
        </a>
        <a
          href={socials.facebook}
          aria-label="Facebook"
          className="cursor-default text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Globe size={20} aria-hidden="true" />
        </a>
      </dd>
    </dl>
  );
}
