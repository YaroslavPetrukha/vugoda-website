/**
 * @module data/construction
 * @rule IMPORT BOUNDARY: This module may only be imported from src/pages/ and
 *   src/components/sections/. It must NEVER import React, motion, components,
 *   or hooks. Construction data is manually authored per D-21 — use
 *   `npm run list:construction` to regenerate the photos[] array as TS literal
 *   when new months arrive.
 *
 *   Caption authoring follows CONCEPT §7.9 tone: «Січень 2026 — фундамент,
 *   секція 1», без хвастощів. Leave `caption` undefined until the author
 *   writes one — missing captions are acceptable; wrong captions are not.
 *
 *   teaserPhotos is populated ONLY on latestMonth() per D-22 — it controls
 *   what HomePage ConstructionTeaser shows (3–5 curated shots). Marketing
 *   swap = one-field PR.
 */

import type { ConstructionMonth } from './types';

export const constructionLog: ConstructionMonth[] = [
  {
    key: 'mar-2026',
    label: 'Березень 2026',
    yearMonth: '2026-03',
    // Curated 5 evenly-spaced shots. Marketing can swap any of these without
    // touching photos[]. TODO: review with client before handoff.
    teaserPhotos: [
      'mar-01.jpg',
      'mar-05.jpg',
      'mar-10.jpg',
      'mar-12.jpg',
      'mar-15.jpg',
    ],
    photos: [
      { file: 'mar-01.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-02.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-03.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-04.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-05.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-06.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-07.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-08.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-09.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-10.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-11.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-12.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-13.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-14.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-15.jpg', alt: 'Будівельний майданчик, березень 2026' },
    ],
  },
  {
    key: 'feb-2026',
    label: 'Лютий 2026',
    yearMonth: '2026-02',
    photos: [
      { file: 'feb-01.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-02.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-03.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-04.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-05.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-06.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-07.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-08.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-09.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-10.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-11.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      { file: 'feb-12.jpg', alt: 'Будівельний майданчик, лютий 2026' },
    ],
  },
  {
    key: 'jan-2026',
    label: 'Січень 2026',
    yearMonth: '2026-01',
    photos: [
      { file: 'jan-01.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-02.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-03.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-04.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-05.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-06.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-07.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-08.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-09.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-10.jpg', alt: 'Будівельний майданчик, січень 2026' },
      { file: 'jan-11.jpg', alt: 'Будівельний майданчик, січень 2026' },
    ],
  },
  {
    key: 'dec-2025',
    label: 'Грудень 2025',
    yearMonth: '2025-12',
    photos: [
      { file: 'dec-01.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-02.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-03.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-04.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-05.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-06.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-07.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-08.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-09.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-10.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-11.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      { file: 'dec-12.jpg', alt: 'Будівельний майданчик, грудень 2025' },
    ],
  },
];

/** HomePage ConstructionTeaser entry point. Reads constructionLog[0].teaserPhotos. */
export const latestMonth = (): ConstructionMonth => constructionLog[0];
