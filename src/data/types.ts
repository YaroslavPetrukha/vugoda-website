/**
 * @module data/types
 * @rule IMPORT BOUNDARY: This module holds type declarations only. It must NEVER
 *   import React, motion, components, pages, hooks, or other runtime modules.
 *   All src/data/*.ts and src/content/*.ts files import types from here.
 *   No interface/type declarations live anywhere else in src/data/ or src/content/.
 */

/** Model-Б stage buckets per CONCEPT §6.1. StageFilter (Phase 4) groups by these. */
export type Stage =
  | 'u-rozrakhunku'   // У розрахунку — кошторисна вартість / документація
  | 'u-pogodzhenni'   // У погодженні — меморандум / дозвільна
  | 'buduetsya'       // Будується
  | 'zdano';          // Здано

/**
 * How a project surfaces in the UI. Drives routing, rendering, and which derived
 * view picks it up. Adding a sixth presentation variant means auditing every
 * consumer — keep the union tight.
 */
export type Presentation =
  | 'flagship-external'  // Lakeview: big card + external redirect, no internal page
  | 'full-internal'      // Has /zhk/{slug} page with full ZhkPage template
  | 'grid-only'          // Hub grid card only, no internal page in v1
  | 'aggregate';         // No card, appears in AggregateRow text-only

export interface Project {
  /** Slug used in /zhk/{slug} AND in render folder name public/renders/{slug}/. */
  slug: string;
  /** Human-readable title (Ukrainian). */
  title: string;
  /** Stage label shown on card: «меморандум», «кошторисна документація», etc. */
  stageLabel: string;
  /** Bucket used by StageFilter on /projects. */
  stage: Stage;
  /** How this project surfaces in the UI. Drives routing and rendering. */
  presentation: Presentation;
  /** Location shown under title; may be placeholder em-dash for aggregate. */
  location?: string;
  /** External URL for presentation='flagship-external' (Lakeview). */
  externalUrl?: string;
  /** Render filenames — first is hero/cover. Relative to public/renders/{slug}/. */
  renders: string[];
  /** Optional facts surfaced on the detail page (presentation='full-internal'). */
  facts?: {
    sections?: number;
    floors?: string;
    area?: string;
    deadline?: string;
    note?: string;
  };
  /** Stage-specific paragraph for /zhk/{slug} detail page. */
  whatsHappening?: string;
  /** Short caption for AggregateRow — used only when presentation='aggregate'. */
  aggregateText?: string;
  /** Ordering on hub page; ascending. Append ЖК #6 with order: 6. */
  order: number;
}

/** One construction-log photo. */
export interface ConstructionPhoto {
  /** Filename inside public/construction/{month}/. */
  file: string;
  /** Stripped caption per CONCEPT §7.9, e.g. «фундамент, секція 1». */
  caption?: string;
  /** Alt text, e.g. «Будівельний майданчик, січень 2026». */
  alt?: string;
}

/** One month of Lakeview construction-log photos. */
export interface ConstructionMonth {
  /** Machine key matching folder in public/construction/ — e.g. 'mar-2026'. */
  key: string;
  /** Display label in Ukrainian — e.g. «Березень 2026». */
  label: string;
  /** ISO year-month for ordering — e.g. '2026-03'. */
  yearMonth: string;
  /**
   * Curated 3–5 filenames (subset of photos[].file) used by HomePage
   * ConstructionTeaser — ONLY set on latestMonth() per D-22.
   */
  teaserPhotos?: string[];
  /** All photos for this month, ordered by filename. */
  photos: ConstructionPhoto[];
}

/**
 * One methodology block from CONCEPT §8 (7 total).
 * Blocks 2, 5, 6 have needsVerification: true per CONCEPT §11.5 — UI renders
 * a ⚠ marker until client confirms.
 */
export interface MethodologyBlock {
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  /** Paragraph body; use \n\n as paragraph separator per D-16 recommendation. */
  body: string;
  needsVerification: boolean;
}

/** One of 4 brand values (системність, доцільність, надійність, довгострокова цінність). */
export interface BrandValue {
  title: string;
  body: string;
}
