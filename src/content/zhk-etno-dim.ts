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

/** Primary CTA button label — accent-fill, opens mailto: */
export const mailtoLabel = 'Написати про ЖК Етно Дім';

/** Secondary CTA label — disabled-styled (socials.instagram === '#').
 *  Communicates «coming soon» without lying about working interactivity. */
export const instagramLabel = 'Підписатись на оновлення (Instagram)';

/** 1-frame redirect placeholder for /zhk/lakeview before window.location.assign.
 *  Ellipsis is U+2026 HORIZONTAL ELLIPSIS (single glyph). */
export const lakeviewRedirectMessage = 'Переходимо до ЖК Lakeview…';
