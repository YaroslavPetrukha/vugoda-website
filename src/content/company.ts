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
/** License year extracted as integer for «років на ринку» CountUp tile in
 *  TrustBlock W5 expansion. Derived once from licenseDate so we don't drift. */
export const licenseYear = 2019 as const;
export const licenseNote = '(безстрокова)' as const;
export const email = 'vygoda.sales@gmail.com' as const;
/** Construction consequence class for the active flagship (Lakeview).
 *  СС3 is the highest classification under ДБН В.1.2-14:2018 — used as a
 *  trust signal on home TrustBlock to anchor «monolithic + bunker-grade
 *  construction» as a fact, not a marketing claim (CONTEXT.md §2.1). */
export const consequenceClass = 'СС3' as const;
export const consequenceClassNote = 'найвищий клас за ДБН В.1.2-14:2018' as const;

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
