/**
 * @module components/sections/contact/ContactDetails
 *
 * Реквізити-block — P1-D9 typography bump (AUDIT-DESIGN §9.8).
 *
 * 4 rows in dl/dt/dd: Email, Телефон, Адреса, Соцмережі. Email is the
 * only active link (mailto); phone/address render the «У розробці»
 * placeholder per Phase 2 D-19 + P0-3; social icons are <button disabled>
 * per P0-5.
 *
 * Typography (P1-D9):
 *   - dt: text-[13px] uppercase tracked muted (overline tone) — was
 *     text-sm/text-base mixed. Stays consistent with home overline pattern.
 *   - dd: text-[length:var(--text-lead)] — bumped from text-base for
 *     editorial weight on the contact page. Email link gets hover:text-accent.
 *   - Label column lg:180px (was 120px) — wider gutter for editorial feel.
 *
 * D-38: No legal-registry / license duplication here — Footer renders
 * those on every route per Phase 1 D-06.
 *
 * Lucide icon choice: lucide-react v1.11 does not export Instagram or
 * Facebook by name. Fallback per Phase 3 RESEARCH §I: Send (Telegram),
 * MessageCircle (Instagram-ish), Globe (Facebook).
 */

import { Send, MessageCircle, Globe } from 'lucide-react';
import { email } from '../../../content/company';
import { phone, address } from '../../../content/placeholders';
import { overlineClasses } from '../../ui/typography';

export function ContactDetails() {
  return (
    <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[180px_1fr] lg:gap-x-8">
      <dt className={`${overlineClasses} text-text-muted`}>
        Email
      </dt>
      <dd className="text-[length:var(--text-lead)] text-text">
        <a
          href={`mailto:${email}`}
          className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {email}
        </a>
      </dd>

      <dt className={`${overlineClasses} text-text-muted`}>
        Телефон
      </dt>
      <dd className="text-[length:var(--text-lead)] text-text">{phone}</dd>

      <dt className={`${overlineClasses} text-text-muted`}>
        Адреса
      </dt>
      <dd className="text-[length:var(--text-lead)] text-text">{address}</dd>

      <dt className={`${overlineClasses} text-text-muted`}>
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
          className="cursor-not-allowed text-text-muted opacity-50"
        >
          <Send size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-label="Instagram (скоро)"
          className="cursor-not-allowed text-text-muted opacity-50"
        >
          <MessageCircle size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-label="Facebook (скоро)"
          className="cursor-not-allowed text-text-muted opacity-50"
        >
          <Globe size={20} aria-hidden="true" />
        </button>
      </dd>
    </dl>
  );
}
