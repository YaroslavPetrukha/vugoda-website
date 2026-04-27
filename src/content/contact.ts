/**
 * @module content/contact
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/. Must NEVER import React,
 *   motion, components, hooks, or pages.
 *
 *   Source of truth for /contact page chrome (D-36):
 *     - contactPageHeading: H1 «Контакт»
 *     - contactPageSubtitle: one-line stripped invitation
 *     - contactPageCta: primary mailto button label
 *
 *   Реквізити-block content (D-37: email, phone, address, socials) reads
 *   directly from src/content/company.ts (`email`, `socials`) and
 *   src/content/placeholders.ts (`phone`, `address`) — no duplication here.
 *
 *   Tone: стримано (CONCEPT §2). No marketing superlatives.
 */

/** /contact page H1 (D-36). */
export const contactPageHeading = 'Контакт';

/** /contact page subtitle — short stripped-tone invitation (D-36).
 *  Per AUDIT-COPY §4.9 (adapted): the audit recommended «Чотири канали для
 *  звернення» but only email is currently active (phone/address are «У розробці»,
 *  socials are disabled). Honest version: name the active channel, flag the
 *  rest as in-progress. Brand-faithful: системно, no overpromise. */
export const contactPageSubtitle = 'Email — основний канал. Інші — у розробці.';

/** Primary mailto CTA button label (D-36). Mirrors home contactCta
 *  but kept as separate const for /contact-page editorial freedom
 *  (home label and contact-page label may diverge in v2).
 *  Per AUDIT-COPY §4.8: human «Написати команді» over юридичне «Ініціювати діалог». */
export const contactPageCta = 'Написати команді';

/** Pre-filled mailto subject for /contact CTA (M-3 single-source).
 *  Identical literal to home ContactForm MAIL_SUBJECT so a returning user
 *  sees the same thread continued. Plan 04-08 imports this and uses it
 *  in the mailto href instead of inlining its own const. */
export const contactMailSubject = 'Ініціювати діалог через сайт ВИГОДА';

/** Browser-tab title for `/contact` route. Phase 6 D-18 format
 *  «{Page} — ВИГОДА». */
export const pageTitle = 'Контакт — ВИГОДА';
