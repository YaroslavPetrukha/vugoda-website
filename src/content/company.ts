/**
 * @module content/company
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   Source of truth: PROJECT.md §Context · Довіра-блок + NAV-01 footer
 *   requirements. These facts are LEGAL and MUST NOT drift — every footer,
 *   trust block, and methodology ref reads from here.
 *
 *   Socials are placeholders (href='#') per CTC-01 until client provides
 *   real URLs. Phase 4 ContactPage uses the same '#' convention.
 */

export const legalName = 'ТОВ «БК ВИГОДА ГРУП»' as const;
export const edrpou = '42016395' as const;
export const licenseDate = '27.12.2019' as const;
export const licenseNote = '(безстрокова)' as const;
export const email = 'vygoda.sales@gmail.com' as const;

/**
 * Social-media placeholders. Every href = '#' until launch (CTC-01).
 * Rendered with cursor-disabled styling and aria-label per channel.
 */
export const socials: {
  telegram: string;
  instagram: string;
  facebook: string;
} = {
  telegram: '#',
  instagram: '#',
  facebook: '#',
};
