/**
 * @module content/projects
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/. Must NEVER import React,
 *   motion, components, hooks, or pages.
 *
 *   Source of truth for /projects page chrome:
 *     - projectsHeading: D-01 page H1
 *     - projectsSubtitle: D-01 honest 0/1/4 portfolio truth
 *     - zdanoEmptyMessage: D-09 empty-state line for the zero-delivered bucket
 *     - buduetsyaPointerMessage: D-08 one-line pointer to Lakeview above
 *       (the U+2191 glyph signals direction; no arrow icon needed)
 *
 *   Tone: стримано, предметно (CONCEPT §2). No marketing claims.
 *   Forbidden lexicon enforced by scripts/check-brand.ts denylistTerms.
 */

/** Page H1 — matches Nav label (D-01). */
export const projectsHeading = 'Проєкти';

/** Muted subtitle — honest 0/1/4 count (D-01). Middle-dot is U+00B7,
 *  identical literal to home portfolioSubtitle for visual parity. */
export const projectsSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

/** Empty-state line under the single-cube marker for the zero-delivered bucket (D-09).
 *  Stripped tone — empty means empty, no marketing fill. */
export const zdanoEmptyMessage = 'Наразі жоден ЖК не здано';

/** Pointer line — directs reader to the flagship above (D-08).
 *  Trailing arrow is U+2191 UPWARDS ARROW. */
export const buduetsyaPointerMessage = 'Див. ЖК Lakeview вище ↑';
