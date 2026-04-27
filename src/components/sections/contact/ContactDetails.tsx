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
import { email } from '../../../content/company';
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
      {/* P0-5 / AUDIT-UX §1.4.C + 1.5.B: <a href="#"> dropped users to /
          under HashRouter; disabled <button> is the correct pattern for
          «coming soon». aria-label includes status; opacity-50 conveys
          the disabled state visually. */}
      <dd className="flex gap-4">
        <button
          type="button"
          disabled
          aria-label="Telegram (скоро)"
          className="text-text-muted opacity-50 cursor-not-allowed"
        >
          <Send size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-label="Instagram (скоро)"
          className="text-text-muted opacity-50 cursor-not-allowed"
        >
          <MessageCircle size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-label="Facebook (скоро)"
          className="text-text-muted opacity-50 cursor-not-allowed"
        >
          <Globe size={20} aria-hidden="true" />
        </button>
      </dd>
    </dl>
  );
}
