/**
 * @module content/values
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   Source of truth: brand-system.md §1 + CONCEPT §2. The 4 values are the
 *   brandbook surface — do NOT add a 5th value without client sign-off and
 *   a brandbook update. Tone: стримано, предметно, без маркетингових
 *   суперлативів (forbidden-lexicon list — brand-system §1).
 */

import type { BrandValue } from '../data/types';

export const brandValues: BrandValue[] = [
  {
    title: 'Системність',
    body: 'Архітектура, функціональність та інвестиційна доцільність — одна система. Рішення приймаються у зв’язку одне з одним, а не послідовно і розірвано.',
  },
  {
    title: 'Доцільність',
    body: 'Кожне рішення оцінюється за технічною обґрунтованістю, довгостроковим ресурсом і вартістю володіння. Дорожче — тільки якщо дає перевагу за цими критеріями.',
  },
  {
    title: 'Надійність',
    body: 'ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, безстрокова ліцензія на будівництво від 27.12.2019. Юридичний трек відкритий для перевірки через публічні реєстри.',
  },
  {
    title: 'Довгострокова цінність',
    body: 'Проектуємо середовище, яке зберігає цінність на горизонті десятиліть. Не оптимізуємо показники запуску за рахунок експлуатаційної якості.',
  },
];
