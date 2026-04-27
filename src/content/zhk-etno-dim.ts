/**
 * @module content/zhk-etno-dim
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/. Must NEVER import React,
 *   motion, components, hooks, or pages.
 *
 *   Source of truth for /zhk/etno-dim CTA pair (D-18) + redirect copy (D-19).
 *
 *   - mailtoSubject: pre-filled subject for primary CTA mailto. Wrapped
 *     in encodeURIComponent at the href construction site (consumer
 *     follows ContactForm.tsx pattern).
 *   - mailtoLabel: visible button text on primary CTA.
 *   - instagramLabel: visible label on secondary disabled CTA.
 *   - lakeviewRedirectMessage: 1-frame placeholder text for /zhk/lakeview
 *     external redirect (paint flash before window.location.assign
 *     — make it look intentional with branded copy).
 */

/** Pre-filled mailto subject for the primary CTA on the etno-dim page. */
export const mailtoSubject = 'Запит про ЖК Етно Дім';

/** Primary CTA button label — accent-fill, opens mailto:
 *  Per AUDIT-COPY §4.17: «Запит» more active than «Написати про». */
export const mailtoLabel = 'Запит по ЖК Етно Дім';

/** Secondary CTA label — per AUDIT-COPY §4.18, when Instagram channel is
 *  not yet live, communicate status honestly rather than imply working
 *  «Підписатись» action. NOTE: the secondary CTA is now removed entirely
 *  in P0-4 (ZhkCtaPair.tsx) per AUDIT-MASTER §3 SIN 3 («краще нічого, ніж
 *  disabled»). This constant is retained for v2 reuse if Instagram launches. */
export const instagramLabel = 'Instagram — у запуску';

/** 1-frame redirect placeholder for /zhk/lakeview before window.location.assign.
 *  Per AUDIT-COPY §4.16: explain WHY the redirect happens (own site exists)
 *  rather than just announce the redirect. Ellipsis is U+2026.
 *  NOTE: superseded in P0-6 by react-router <Navigate> — this string is no
 *  longer rendered in production after that fix; retained for v2. */
export const lakeviewRedirectMessage = 'Lakeview має власний сайт. Переходимо…';

/** Browser-tab title for `/zhk/etno-dim` route. Phase 6 D-18 format
 *  «{Page} — ВИГОДА». For dynamically-resolved slugs other than etno-dim,
 *  ZhkPage uses interpolation `${project.title} — ВИГОДА`; for the
 *  hard-coded etno-dim path the value is locked here for traceability. */
export const pageTitle = 'ЖК Етно Дім — ВИГОДА';

/** ZhkHero overline — appears above the hero caption stack (P1-D7).
 *  Brand-faithful: signals «we picked this project for the full
 *  editorial» without forbidden lexicon. Middle-dot is U+00B7. */
export const zhkHeroOverline = 'ЖК · ПОВНИЙ КЕЙС';

/** ZhkWhatsHappening narrative arrow — overline above the H2 (P1-D7).
 *  Three-stage timeline of the project's restoration arc, brand-faithful.
 *  «→» is U+2192 RIGHTWARDS ARROW (typographic, not ASCII >). */
export const whatsHappeningTimeline =
  'Об’єкт законсервовано → меморандум 2026 → старт відновлення';

/** ZhkWhatsHappening section heading — bumped to text-h2 token (P1-D7). */
export const whatsHappeningHeading = 'Що відбувається зараз';

/** ZhkFactBlock section overline — minimal frame (P1-D7).
 *  «Об’єкт» is U+2019 RIGHT SINGLE QUOTATION MARK (apostrophe form). */
export const factBlockOverline = 'Параметри об’єкта';

/** ZhkFactBlock dl labels — moved from inline JSX literals to tokens
 *  for D-29 boundary discipline (P1-D7). */
export const factBlockLabelStage = 'Стадія';
export const factBlockLabelLocation = 'Локація';
export const factBlockLabelAddress = 'Адреса';

/** ZhkGallery section overline — frames the render set (P1-D7). */
export const galleryOverline = 'Архітектура · 8 рендерів';
