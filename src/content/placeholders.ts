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
 *   POLICY (D-19): the public value is the raw em-dash «—» (U+2014). We
 *   NEVER render template-style tokens in production HTML — CI denylist
 *   (scripts/check-brand.ts placeholderTokens() in Plan 02-05) greps dist/
 *   for double-brace tokens and fails the build.
 *
 *   Update policy: when client confirms a value, replace the «—» with the
 *   real string in this file. Consumers across pages + sections pick up the
 *   change in one build. No component touches needed.
 *
 *   Open items map to CONCEPT §11:
 *     - phone            → §11.1 (corporate phone, separate from Lakeview)
 *     - address          → §11.2 (юр. / поштова адреса)
 *     - pipeline4Title   → §11.3 (Pipeline-4 real name)
 *     - etnoDimAddress   → §11.8 (Etno Dim вул. Судова confirmation)
 */

/** Corporate phone (CONCEPT §11.1). Rendered on /contact and in footer microcopy. */
export const phone = '—';

/** Legal / postal address (CONCEPT §11.2). Rendered on /contact trust block. */
export const address = '—';

/**
 * Pipeline-4 public title (CONCEPT §11.3). Defaults to «Без назви» per D-06 /
 * D-19; also appears in src/data/projects.ts pipeline-4 record (duplicated for
 * runtime clarity — see RESEARCH Open Question 1). Update BOTH when client confirms.
 */
export const pipeline4Title = 'Без назви';

/** Etno Dim confirmed address (CONCEPT §11.8). Consumer: ZhkPage fact block. */
export const etnoDimAddress = '—';
