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
    title: 'Архітектура, функціональність та доцільність — одне рішення',
    body: 'Не послідовно. У зв’язку.',
  },
  {
    title: 'Дорожче — тільки якщо дає перевагу',
    body: 'Три критерії: технічна обґрунтованість, ресурс, вартість володіння.',
  },
  {
    title: 'Юридичний трек — відкритий до перевірки',
    body: 'ТОВ «БК ВИГОДА ГРУП» · ЄДРПОУ 42016395 · ліцензія від 27.12.2019, безстрокова.',
  },
  {
    title: 'Середовище, що залишається актуальним',
    body: 'Не оптимізуємо запуск за рахунок експлуатації.',
  },
];
