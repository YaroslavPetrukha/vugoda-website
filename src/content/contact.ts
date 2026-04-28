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

/** /contact page overline — «КОНТАКТ · ЛЬВІВ» frame (P1-D9). Names the
 *  city so the visitor reads «Lviv-based, in person possible». */
export const contactPageOverline = 'КОНТАКТ · ЛЬВІВ';

/** /contact page H1 (P1-D9, AUDIT-DESIGN §9.8).
 *  Was «Контакт» (neutral noun). Bumped to invitational «Поговоримо» —
 *  conversational without overpromising, brand-disciplined within
 *  «стримано» tone (this is a conversation invitation, not a marketing
 *  superlative). Rendered at text-display-l size to match audit spec. */
export const contactPageHeading = 'Поговоримо';

/** /contact right-pane label — names the «pin-stack» 3-project preview
 *  on the dark half of the split. Each pin is a brand IsometricCube
 *  next to project name + city. (P1-D9 simplified vs §9.8 spec — the
 *  full Lviv map SVG is deferred to P2 / dedicated LvivMapSvg.) */
export const contactPinsLabel = 'Об’єкти у Львові';

/** /contact page subtitle — short stripped-tone invitation.
 *  Apr-2026 update: address became real (placeholders.ts confirmed
 *  2026-04-28) and the page now shows a real <ContactFormFields> form
 *  on the right. Three active channels: email, form, office. Subtitle
 *  names them factually without overpromising SLAs. Phone + socials
 *  remain in-work — handled by ContactDetails closing line, not here. */
export const contactPageSubtitle =
  'Залиште повідомлення формою або напишіть на email — це найшвидший шлях до відповіді.';

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

/** Iframe title for the Google Maps embed (a11y — screen readers
 *  announce iframe content via title attr). */
export const mapIframeTitle = 'Карта офісу продажу ВИГОДА — Львів, вул. В. Великого 4';

/** Map caption — appears under the iframe as editorial annotation,
 *  duplicates the address text so the page is readable without the
 *  embedded map (image-blocked / iframe-blocked corp networks). */
export const mapCaption = 'Заходьте без попередження у робочі години — є гостьові паркомісця у дворі.';

/** Closing-line copy in ContactDetails — replaces the prior 3 dl rows of
 *  «У розробці». Phone + soc still pending; address is now real (see
 *  placeholders.ts confirmed 2026-04-28). */
export const contactDetailsClosingLine =
  'Телефон і соцмережі — у роботі. Відкриваємо публічно, коли канал готовий до клієнта.';
