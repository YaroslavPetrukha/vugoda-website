/**
 * @module content/values
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   Source of truth: AUDIT-COPY §5 (P1-C2 — declarative titles, stinger
 *   bodies). Pre-rewrite form was 1-word title + paragraph-definition body
 *   (dictionary format), which violates brand-system.md §1 «Заголовки
 *   декларативні, короткі ('Середовище, яке залишається актуальним'), не
 *   рекламні». Audit fix: title = full sentence-declaration, body = short
 *   stinger (≤2 sentences, active verb, concrete).
 *
 *   The 4 values are the brandbook surface — do NOT add a 5th without
 *   client sign-off and a brandbook update. Tone: стримано, предметно, без
 *   маркетингових суперлативів (forbidden-lexicon list — brand-system §1).
 */

import type { BrandValue } from '../data/types';

export const brandValues: BrandValue[] = [
  {
    // 01/04 — body rewritten in W8 audit round 2. Was «Не послідовно.
    // У зв'язку.» (tone-deviation: too cryptic, missed the brand voice).
    // New body names the operational mechanism — single-table workflow vs.
    // hand-off-the-folder waterfall — so reader understands what «у звʼязку»
    // actually means in practice.
    title: 'Архітектура, функціональність та доцільність — одне рішення',
    body: 'Архітектор, інженер і кошторис — за одним столом, не передають папку.',
  },
  {
    title: 'Дорожче — тільки якщо дає перевагу',
    body: 'Три критерії: технічна обґрунтованість, ресурс, вартість володіння.',
  },
  {
    // 03/04 — body rewritten in W8 audit round 2. Was data-row dump that
    // duplicated TrustBlock verbatim («ЄДРПОУ 42016395 · ліцензія від
    // 27.12.2019…»). Brand-essence card should read as narrative; data
    // table belongs in TrustBlock. New body points the reader at the
    // verifiable data without re-listing it.
    title: 'Юридичний трек — відкритий до перевірки',
    body: 'Будівельну ліцензію видали в кінці 2019, безстроково. Усі реквізити для перевірки — у блоці нижче.',
  },
  {
    // 04/04 — title rewritten in W8 audit round 2. Was «Середовище, що
    // залишається актуальним» (empty platitude). New title names the
    // specific mechanism: short-term savings cost more during the
    // multi-decade exploitation phase. Concrete consequence > abstract noun.
    title: 'Те, що зекономили на старті, дорого вилазить в експлуатації',
    body: 'Не оптимізуємо запуск за рахунок експлуатації.',
  },
];
