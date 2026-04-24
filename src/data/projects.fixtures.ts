/**
 * @module data/projects.fixtures
 * @rule IMPORT BOUNDARY: This module is the scale-to-N stress surface for the
 *   PipelineGrid / StageFilter layout (CON-02, ZHK-02, PITFALLS §Pitfall 11).
 *   It MUST NEVER be imported from src/pages/ or src/components/sections/ in
 *   production. Only the hidden /dev/grid route (Phase 4) and any future
 *   Vitest suites may import it. Enforcement: scripts/check-brand.ts
 *   importBoundaries() greps for `projects.fixtures` imports in pages/+components/.
 *
 *   Design intent: every Stage bucket has ≥2 records (including Zdano which is
 *   normally 0 in real data) so filter + empty-state UI is forced into
 *   non-trivial reflow. Every Presentation variant appears at least once.
 *   Titles are OBVIOUSLY synthetic (prefix «Fixture ЖК #N»), slugs are
 *   ASCII-only with `fixture-NN` convention so real-data slugs are never
 *   shadowed. renders: [] for every record — no real images referenced.
 */

import type { Project } from './types';

export const fixtures: Project[] = [
  // === Stage: u-rozrakhunku (3 records, exercises min-2 + orphan-row behavior) ===
  {
    slug: 'fixture-01',
    title: 'Fixture ЖК #1 · У розрахунку',
    stageLabel: 'кошторисна вартість',
    stage: 'u-rozrakhunku',
    presentation: 'aggregate',
    renders: [],
    aggregateText: 'Fixture aggregate — пункт агрегативного рядка для QA.',
    order: 101,
  },
  {
    slug: 'fixture-02',
    title: 'Fixture ЖК #2 · У розрахунку',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 102,
  },
  {
    slug: 'fixture-03',
    title: 'Fixture ЖК #3 · У розрахунку',
    stageLabel: 'кошторисна документація',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 103,
  },

  // === Stage: u-pogodzhenni (2 records) ===
  {
    slug: 'fixture-04',
    title: 'Fixture ЖК #4 · У погодженні',
    stageLabel: 'меморандум',
    stage: 'u-pogodzhenni',
    presentation: 'full-internal',
    location: 'Fixture-City',
    renders: [],
    whatsHappening: 'Fixture whatsHappening — QA-only text for ZhkPage template.',
    order: 104,
  },
  {
    slug: 'fixture-05',
    title: 'Fixture ЖК #5 · У погодженні',
    stageLabel: 'дозвільна документація',
    stage: 'u-pogodzhenni',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 105,
  },

  // === Stage: buduetsya (2 records — including a synthetic flagship for variant coverage) ===
  {
    slug: 'fixture-06',
    title: 'Fixture ЖК #6 · Будується',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'flagship-external',
    location: 'Fixture-City',
    externalUrl: 'https://example.com/fixture-flagship',
    renders: [],
    facts: { deadline: '2099' },
    order: 106,
  },
  {
    slug: 'fixture-07',
    title: 'Fixture ЖК #7 · Будується',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 107,
  },

  // === Stage: zdano (3 records — stress-tests the 0-in-real-data «Здано» bucket) ===
  {
    slug: 'fixture-08',
    title: 'Fixture ЖК #8 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 108,
  },
  {
    slug: 'fixture-09',
    title: 'Fixture ЖК #9 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'grid-only',
    location: 'Fixture-City',
    renders: [],
    order: 109,
  },
  {
    slug: 'fixture-10',
    title: 'Fixture ЖК #10 · Здано',
    stageLabel: 'здано',
    stage: 'zdano',
    presentation: 'full-internal',
    location: 'Fixture-City',
    renders: [],
    whatsHappening: 'Fixture whatsHappening for a «Здано» variant.',
    order: 110,
  },
];
