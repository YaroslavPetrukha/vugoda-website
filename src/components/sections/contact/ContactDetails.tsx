/**
 * @module components/sections/contact/ContactDetails
 *
 * Реквізити-block — Apr-2026 honest-data rebuild.
 *
 * Two real blocks (Email + Address) plus one editorial closing line for
 * the still-in-progress channels (phone, socials).
 *
 *   [overline EMAIL]
 *   [vygoda.sales@gmail.com — text-h3, hover:accent]
 *
 *   [overline АДРЕСА · ОФІС ПРОДАЖУ]
 *   [Львів · вул. В. Великого, 4]
 *   [4-й поверх, каб. 406 — muted descriptor]
 *
 *   [Телефон і соцмережі — у роботі. … — muted lead]
 *
 * Address became real on 2026-04-28 (placeholders.ts client confirmation).
 * Phone + socials remain placeholders so the closing line shrinks from
 * the previous 3-row tally to a single tail.
 *
 * Disabled social icons remain removed (don't show non-functional
 * affordances). Lucide imports dropped accordingly.
 */

import { email } from '../../../content/company';
import { address, addressUnit, addressLabel } from '../../../content/placeholders';
import { contactDetailsClosingLine } from '../../../content/contact';
import { overlineClasses } from '../../ui/typography';

export function ContactDetails() {
  return (
    <div className="flex flex-col gap-8">
      {/* Email — primary direct channel. Sized to match the Address block
          below so the two реквізити-blocks read as one ladder, not as
          «hero email + small address». Both are equal-weight data. */}
      <div className="flex flex-col gap-3">
        <span className={`${overlineClasses} text-text-muted`}>Email</span>
        <a
          href={`mailto:${email}`}
          className="w-fit text-[length:var(--text-lead)] font-medium leading-tight text-text break-all hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {email}
        </a>
      </div>

      {/* Address — real, confirmed 2026-04-28. Two-line: street, then
          unit detail muted. Overline names the type so it doesn't read
          as «юридична». */}
      <div className="flex flex-col gap-3">
        <span className={`${overlineClasses} text-text-muted`}>
          Адреса · {addressLabel}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[length:var(--text-lead)] font-medium leading-tight text-text">
            {address}
          </span>
          <span className="text-[length:var(--text-lead)] leading-tight text-text-muted">
            {addressUnit}
          </span>
        </div>
      </div>

      {/* Editorial closing for non-active channels. */}
      <p className="text-[length:var(--text-lead)] leading-[1.5] text-text-muted">
        {contactDetailsClosingLine}
      </p>
    </div>
  );
}
