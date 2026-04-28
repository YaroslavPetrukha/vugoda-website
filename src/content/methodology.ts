/**
 * @module content/methodology
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages. Components consume methodologyBlocks by name
 *   — they NEVER contain these Ukrainian paragraphs as JSX literals
 *   (PITFALLS §Pitfall 7).
 *
 *   Source of truth: AUDIT-COPY §8 (P1-C1 — 50%-shorter rewrites). The
 *   pre-rewrite verbose form lived in КОНЦЕПЦІЯ-САЙТУ.md §8; the audit
 *   confirmed the long-form was tone-deviation (academic, apology mode)
 *   and prescribed the stripped declarative form below.
 *
 *   Blocks 2, 5, 6 carry needsVerification: true per CONCEPT §11.5 — UI
 *   (Phase 3 MethodologyTeaser, v2 /how-we-build) renders a ⚠ marker
 *   automatically. Do not ship these three blocks as uncaveated fact.
 *
 *   body uses \n\n as paragraph separator per D-16 recommendation; current
 *   stinger bodies are single paragraphs, so no \n\n appears yet.
 */

import type { MethodologyBlock } from '../data/types';

export const methodologyBlocks: MethodologyBlock[] = [
  {
    index: 1,
    title: 'Стадія — точним словом',
    body: 'Деталі публікуємо лише після підтвердження. До того — стадія: меморандум, дозвільна, кошторисна. Без «скоро» без дати.',
    needsVerification: false,
  },
  {
    index: 2,
    title: 'Юридичний трек — відкритий',
    body: 'ЄДРПОУ 42016395 · ліцензія від 27.12.2019, безстрокова · публічно перевіряється.',
    needsVerification: true,
  },
  {
    index: 3,
    title: 'Забудовник + генпідрядник в одній юрособі',
    body: 'Якість, терміни, бюджет — одна відповідальність. Власнику зрозуміло, з ким говорити.',
    needsVerification: false,
  },
  {
    index: 4,
    title: 'Беремо заморожені об’єкти',
    body: 'Меморандум з правовласником, аудит конструкцій, переоформлення прав. Зараз — ЖК Етно Дім.',
    needsVerification: false,
  },
  {
    index: 5,
    title: 'Технологія — під клас наслідків і ділянку',
    body: 'Конструкцію, матеріали, утеплення добираємо під об’єкт. Не навпаки. Цифри — на сторінці ЖК після верифікації командою.',
    needsVerification: true,
  },
  {
    index: 6,
    title: 'Дорожче — тільки якщо дає перевагу',
    body: 'Три критерії: обґрунтованість, ресурс, вартість володіння. Інакше — ні.',
    needsVerification: true,
  },
  {
    index: 7,
    title: 'Середовище, не квадратні метри',
    body: 'Квартири, інженерія, благоустрій, перший поверх — одна система. Цінність на десятиліття, не на запуск.',
    needsVerification: false,
  },
];
