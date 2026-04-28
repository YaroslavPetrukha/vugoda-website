/**
 * @module data/projects
 * @rule IMPORT BOUNDARY: This module may only be imported from src/pages/ and
 *   src/components/sections/. It must NEVER import React, motion, components,
 *   or hooks. Data modules are pure TypeScript. Consumers read from the
 *   derived views (flagship / pipelineGridProjects / aggregateProjects /
 *   detailPageProjects / findBySlug) rather than filtering the raw array.
 *
 *   Adding ЖК #6 = append one record with order: 6 and the right
 *   presentation variant. No other code changes. Per ZHK-02 and CONCEPT §10.6.
 */

import type { Project } from './types';

export const projects: Project[] = [
  {
    // Lakeview — active construction, external redirect flagship (no internal page).
    // Silent displacement hard-rule applies ONLY here — legacy source-project
    // names must never appear in shipped source per CONCEPT §10.2 / D-25.
    slug: 'lakeview',
    title: 'ЖК Lakeview',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'flagship-external',
    location: 'Львів',
    externalUrl: 'https://yaroslavpetrukha.github.io/Lakeview/',
    // Verified from filesystem 2026-04-24: /renders/lakeview/ has 7 .jpg files.
    // ARCHITECTURE Q2 listed these as .webp — that was wrong. Use the .jpg list.
    // Folder renamed from «likeview» → «lakeview» at P1-R3 (REMEDIATION typo fix).
    renders: [
      'aerial.jpg',
      'closeup.jpg',
      'entrance.jpg',
      'hero.jpg',
      'lake-bridge.jpg',
      'semi-aerial.jpg',
      'terrace.jpg',
    ],
    facts: { deadline: '2027', note: 'Здача у 2027' },
    order: 1,
  },
  {
    // Etno Dim — template-demo ЖК; has the most renders (8) of any pipeline project.
    // «меморандум» stage = useful «system» narrative for Phase 4 /zhk/etno-dim.
    // CONCEPT §11.8 flags вул. Судова as unconfirmed — location stays 'Львів' here;
    // etnoDimAddress em-dash lives in content/placeholders.ts for audit visibility.
    slug: 'etno-dim',
    title: 'ЖК Етно Дім',
    stageLabel: 'меморандум про відновлення будівництва',
    stage: 'u-pogodzhenni',
    presentation: 'full-internal',
    location: 'Львів',
    renders: [
      '43615.jpg.webp',
      '43616.jpg.webp',
      '43617.jpg.webp',
      '43618.jpg.webp',
      '43619.jpg.webp',
      '43620.jpg.webp',
      '43621.jpg.webp',
      '61996.png.webp',
    ],
    whatsHappening:
      'Підписано меморандум про відновлення будівництва. Проводимо аудит наявних конструкцій та юридичне переоформлення прав забудовника.',
    cta: {
      label: 'Запит на передбронь →',
      mailtoSubject: 'Запит на передбронь — ЖК Етно Дім',
    },
    order: 2,
  },
  {
    // Маєток Винниківський — grid-only in v1 (card on hub, no internal page).
    slug: 'maietok-vynnykivskyi',
    title: 'ЖК Маєток Винниківський',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Винники',
    renders: ['44463.jpg.webp', '62343.png.webp'],
    cta: {
      label: 'Старт продажів →',
      mailtoSubject: 'Підписка на старт продажів — ЖК Маєток Винниківський',
    },
    order: 3,
  },
  {
    // Дохідний дім NTEREST — grid-only in v1. Client §11.7: «NTEREST» без «I»
    // confirmed by default; audit surface lives in content/placeholders.ts.
    slug: 'nterest',
    title: 'Дохідний дім NTEREST',
    stageLabel: 'дозвільна документація',
    stage: 'u-pogodzhenni',
    presentation: 'grid-only',
    location: 'Львів',
    renders: ['2213.jpg.webp', '2214.jpg.webp', '60217.png.webp'],
    cta: {
      label: 'Інвест-кейс →',
      mailtoSubject: 'Запит інвест-кейсу — Дохідний дім NTEREST',
    },
    order: 4,
  },
  {
    // Pipeline-4 — no visuals, aggregate row only. Title defaults to «Без назви»
    // per CONCEPT §11.3 pending client name. aggregateText is verbatim from
    // ARCHITECTURE Q2 / CONCEPT §6.2 — do not paraphrase.
    // placeholder per placeholders.ts#pipeline4Title — update both when client confirms
    slug: 'pipeline-4',
    title: 'Без назви',
    stageLabel: 'прорахунок кошторисної вартості',
    stage: 'u-rozrakhunku',
    presentation: 'aggregate',
    renders: [],
    // Per AUDIT-COPY §4.14: turn dry admin notice into a brand moment by
    // back-referencing methodology №1 — «we don't publish until we've
    // calculated» is the системний-девелопмент position, not an apology.
    aggregateText:
      '+1 проєкт на стадії розрахунку. Назва і локація з’являться, коли кошторис буде готовий — це наша норма (див. методологію №1).',
    order: 5,
  },
];

// Derived views — every consumer reads from these, not the raw array.
// Adding a sixth ЖК with the right `presentation` automatically flows into
// the correct view via the filter predicate.

/** Single flagship project (Lakeview). Non-null assertion safe because the
 *  invariant «exactly one flagship-external record» is guaranteed by the
 *  discriminated union — lint would break before runtime if violated. */
export const flagship: Project = projects.find(
  (p) => p.presentation === 'flagship-external',
)!;

/** Projects shown in the hub 3-in-a-row grid (pipeline cards). Sorted by order.
 *  Includes both grid-only (hub-card-only) and full-internal (linked to /zhk/{slug}). */
export const pipelineGridProjects: Project[] = projects
  .filter(
    (p) => p.presentation === 'full-internal' || p.presentation === 'grid-only',
  )
  .sort((a, b) => a.order - b.order);

/** Projects surfaced in the AggregateRow (text-only under the grid). */
export const aggregateProjects: Project[] = projects.filter(
  (p) => p.presentation === 'aggregate',
);

/** Projects that get a /zhk/{slug} detail page. */
export const detailPageProjects: Project[] = projects.filter(
  (p) => p.presentation === 'full-internal',
);

/**
 * Find the project for /zhk/{slug} rendering. Only returns records with
 * presentation='full-internal' per D-04 / PITFALLS Anti-Pattern 7. Other
 * slugs (lakeview / maietok / nterest / pipeline-4) return undefined —
 * ZhkPage (Phase 4) handles redirect via <Navigate>.
 */
export const findBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug && p.presentation === 'full-internal');
