/**
 * @module content/placeholders
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   This file is the SINGLE AUDIT SURFACE for every open client question
 *   from КОНЦЕПЦІЯ-САЙТУ.md §11. A client / stakeholder opens this file and
 *   sees every pending answer as one named const with the current fallback.
 *
 *   POLICY (D-19, revised 2026-04-27 per AUDIT-SALES P0-3 / AUDIT-COPY §7.1):
 *   the public value is a self-explanatory status string, not a raw em-dash.
 *   Em-dash «—» reads as «forgot to fill» / «not serious»; «У розробці»
 *   reads as «we know what we're doing, channel is coming». Brand-faithful.
 *   CI denylist (scripts/check-brand.ts placeholderTokens()) still blocks
 *   double-brace tokens in dist/.
 *
 *   Update policy: when client confirms a value, replace the placeholder
 *   string with the real string in this file. Consumers across pages +
 *   sections pick up the change in one build. No component touches needed.
 *
 *   Open items map to CONCEPT §11:
 *     - phone            → §11.1 (corporate phone, separate from Lakeview)
 *     - address          → §11.2 (юр. / поштова адреса)
 *     - pipeline4Title   → §11.3 (Pipeline-4 real name)
 *     - etnoDimAddress   → §11.8 (Etno Dim вул. Судова confirmation)
 */

/** Corporate phone (CONCEPT §11.1). Rendered on /contact and in footer microcopy. */
export const phone = 'У розробці';

/** Sales-office address (CONCEPT §11.2). Confirmed by client 2026-04-28.
 *  Consumer: /contact ContactDetails + Google Maps embed. */
export const address = 'Львів · вул. В. Великого, 4';

/** Sales-office unit detail — separate so the address line stays short
 *  and the unit reads as a secondary descriptor. */
export const addressUnit = '4-й поверх, каб. 406';

/** Address block label — names what kind of address (sales-floor walk-in,
 *  not юридична / поштова). */
export const addressLabel = 'Офіс продажу';

/**
 * Pipeline-4 public title (CONCEPT §11.3). Per AUDIT-COPY §7.3, the title
 * describes the stage (rather than empty «Без назви») so the absence of a
 * brand name reads as deliberate, not forgotten. Also appears in
 * src/data/projects.ts pipeline-4 record (duplicated for runtime clarity —
 * see RESEARCH Open Question 1). Update BOTH when client confirms.
 */
export const pipeline4Title = 'Проєкт на стадії кошторису';

/** Etno Dim confirmed address (CONCEPT §11.8). Consumer: ZhkPage fact block.
 *  Per AUDIT-COPY §7.4, surface the rights-transfer reason that explains
 *  why the precise address isn't yet public (brand-faithful: explanation,
 *  not magic / dash). */
export const etnoDimAddress = 'Львів · точна адреса — після переоформлення прав';
