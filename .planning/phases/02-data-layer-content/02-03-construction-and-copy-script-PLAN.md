---
phase: 02-data-layer-content
plan: 03
type: execute
wave: 2
depends_on: [02-01]
files_modified:
  - src/data/construction.ts
  - scripts/copy-renders.ts
  - scripts/list-construction.ts
  - package.json
autonomous: true
requirements_addressed:
  - CON-01
  - CON-02
must_haves:
  truths:
    - "`src/data/construction.ts` exports `constructionLog: ConstructionMonth[]` with exactly 4 months (mar-2026, feb-2026, jan-2026, dec-2025) and photos arrays sized 15/12/11/12 respectively (verified from filesystem)"
    - "`latestMonth()` returns mar-2026 month (constructionLog[0]) — it has `teaserPhotos` populated with 3-5 curated filenames for HomePage ConstructionTeaser"
    - "`scripts/copy-renders.ts` translits 4 Cyrillic render folders to ASCII slugs (likeview→lakeview, ЖК Етно Дім→etno-dim, ЖК Маєток Винниківський→maietok-vynnykivskyi, Дохідний дім NTEREST→nterest) AND copies 4 construction months verbatim, skipping `_social-covers` and `.DS_Store`"
    - "`npm run prebuild` executes copy-renders and produces `public/renders/{lakeview,etno-dim,maietok-vynnykivskyi,nterest}/` + `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/` with correct file counts (7/8/2/3 renders; 12/11/12/15 construction photos)"
    - "`npm run list:construction` prints TS-literal inventory helpers for the author to paste into construction.ts when new photos arrive"
    - "`_social-covers/` is NEVER copied (CONCEPT §7.9 brand conflict); `.DS_Store` files are filtered out of every cpSync call"
  artifacts:
    - path: "src/data/construction.ts"
      provides: "constructionLog array + latestMonth() helper"
      contains: "export const constructionLog"
    - path: "scripts/copy-renders.ts"
      provides: "prebuild + predev hook script"
      contains: "cpSync"
    - path: "scripts/list-construction.ts"
      provides: "manual helper to print filesystem inventory as TS literal"
      contains: "readdirSync"
    - path: "package.json"
      provides: "predev, prebuild, list:construction scripts"
      contains: "\"prebuild\": \"tsx scripts/copy-renders.ts\""
  key_links:
    - from: "scripts/copy-renders.ts"
      to: "/renders/ and /construction/ source trees"
      via: "cpSync with DS_Store filter"
      pattern: "cpSync.*filter.*DS_Store"
    - from: "src/data/construction.ts"
      to: "src/data/types.ts"
      via: "type imports"
      pattern: "from ['\"]\\./types['\"]"
    - from: "package.json"
      to: "scripts/copy-renders.ts"
      via: "prebuild + predev hooks"
      pattern: "tsx scripts/copy-renders"
---

<objective>
Make the image asset pipeline and Lakeview construction-log data surface real. `copy-renders.ts` turns the Cyrillic-named authoring folders into ASCII-path runtime folders in `public/` — every ЖК slug matches its asset path 1:1 (zero URL-encoding drama on GH Pages). `construction.ts` gives Phase 3's ConstructionTeaser and Phase 4's ConstructionLogPage a typed data source with 50 curated photos across 4 months. `list-construction.ts` is a dev helper — `npm run list:construction` prints the filesystem inventory as TS-literal so the author can paste into construction.ts when new photos drop.

Purpose: Success Criterion 2 of Phase 2 (prebuild translit + construction copy) + CON-01 construction data module. Unblocks every downstream render consumer.
Output: 3 new files + package.json scripts patch; `npm run prebuild` produces the expected public/ tree.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-data-layer-content/02-CONTEXT.md
@.planning/phases/02-data-layer-content/02-RESEARCH.md
@.planning/phases/02-data-layer-content/02-01-SUMMARY.md
@.planning/research/ARCHITECTURE.md
@src/data/types.ts
@package.json
</context>

<interfaces>
<!-- Types consumed from Plan 02-01 -->
```typescript
import type { ConstructionMonth, ConstructionPhoto } from './types';
```

<!-- Filesystem truths (verified 2026-04-24, RESEARCH §Filesystem Inventory) -->

`/renders/` source folders (authoring surface):
| Source | Target slug | Files | Notes |
|--------|-------------|-------|-------|
| `likeview/` | `lakeview` | 7 .jpg | fixes misspelling |
| `ЖК Етно Дім/` | `etno-dim` | 8 `.{jpg,png}.webp` | |
| `ЖК Маєток Винниківський/` | `maietok-vynnykivskyi` | 2 `.{jpg,png}.webp` | |
| `Дохідний дім NTEREST/` | `nterest` | 3 `.{jpg,png}.webp` | |

`/construction/` source folders (already ASCII, copied verbatim):
| Folder | Count | Pattern | Notes |
|--------|-------|---------|-------|
| `dec-2025/` | 12 | `dec-NN.jpg` | |
| `jan-2026/` | 11 | `jan-NN.jpg` | |
| `feb-2026/` | 12 | `feb-NN.jpg` | |
| `mar-2026/` | 15 | `mar-NN.jpg` | |
| `_social-covers/` | 6 | — | **SKIP** (CONCEPT §7.9 brand conflict) |

`.DS_Store` present at `renders/.DS_Store` (macOS). Must be filtered out per RESEARCH §Pitfall B.

<!-- Package.json after this plan runs (RESEARCH §Current Package.json State → «What Phase 2 adds») -->

```json
{
  "scripts": {
    "predev": "tsx scripts/copy-renders.ts",
    "dev": "vite",
    "prebuild": "tsx scripts/copy-renders.ts",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit",
    "list:construction": "tsx scripts/list-construction.ts"
  }
}
```

(Plan 02-05 adds `postbuild`. Do NOT add postbuild here — it belongs with check-brand.)
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create scripts/copy-renders.ts (translit + construction copy with .DS_Store filter)</name>
  <files>scripts/copy-renders.ts</files>
  <read_first>
    - .planning/research/ARCHITECTURE.md §3 Q8 (canonical copy-renders.ts source — note .DS_Store filter missing from Q8)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Translit Script: Edge Cases and Fixes" (the 5 edge cases — DS_Store, lakeview filenames, no nested subdirs, ASCII construction, import.meta.url Cyrillic path)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Code Examples → copy-renders.ts" (EXACT implementation target)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-10, D-11, D-12, D-14 (translit map, _social-covers skip, missing-folder = warn not fail, idempotent via rmSync)
    - package.json "type": "module" (confirms ESM — `import { … } from 'node:fs'` works)
    - /renders/ folder listing (verify 4 source folders exist and .DS_Store is present)
    - /construction/ folder listing (verify 4 month folders + _social-covers)
  </read_first>
  <behavior>
    - `npm run prebuild` succeeds (exit 0) and produces the expected public/ tree
    - After running: `ls public/renders/` prints exactly `etno-dim  lakeview  maietok-vynnykivskyi  nterest` (4 directories, no .DS_Store)
    - After running: `ls public/renders/lakeview/ | wc -l` returns `7`
    - After running: `ls public/renders/etno-dim/ | wc -l` returns `8`
    - After running: `ls public/renders/maietok-vynnykivskyi/ | wc -l` returns `2`
    - After running: `ls public/renders/nterest/ | wc -l` returns `3`
    - After running: `ls public/construction/` prints exactly `dec-2025  feb-2026  jan-2026  mar-2026` (4 months, NO _social-covers)
    - After running: no `.DS_Store` files anywhere under public/renders/ or public/construction/
    - Script is idempotent: running twice in a row produces identical output (rmSync wipes DST before copy)
    - Missing source folder writes a `[copy-renders] missing:` warning to stderr/stdout but does NOT exit non-zero
    - Script uses only `node:fs` and `node:path` — no npm deps
  </behavior>
  <action>
Step 1. Create directory `scripts/` at repo root (it does not yet exist — verified from Plan 02-01 RESEARCH).

Step 2. Create `scripts/copy-renders.ts` with this EXACT content:

```typescript
/**
 * scripts/copy-renders.ts — pre-build: translit + copy /renders /construction into /public
 *
 * Runs as `prebuild` AND `predev` npm hooks via `tsx scripts/copy-renders.ts`.
 * Idempotent (wipes destinations before copy). No npm deps — uses only node:fs
 * and node:path.
 *
 * Translit rationale (ARCHITECTURE §3 Q8):
 *   Browsers auto-URL-encode Cyrillic paths inconsistently; GH Pages tar pipeline
 *   has NFC/NFD normalization edge cases; slug<->asset-path alignment requires
 *   ASCII folder names regardless.
 *
 * Skip rationale:
 *   /construction/_social-covers/ is Lakeview-branded (Cormorant Garamond
 *   typography) — hard-rule brand conflict per CONCEPT §7.9. Never copied.
 *
 * .DS_Store filter rationale (02-RESEARCH §Pitfall B):
 *   cpSync with {recursive: true} copies all files including macOS .DS_Store.
 *   The filter prevents .DS_Store from polluting public/ and downstream dist/.
 */
import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const RENDERS_SRC = join(ROOT, 'renders');
const RENDERS_DST = join(ROOT, 'public/renders');
const CONSTRUCTION_SRC = join(ROOT, 'construction');
const CONSTRUCTION_DST = join(ROOT, 'public/construction');

/** Exclude macOS .DS_Store. Any other files filtered here become an explicit
 *  policy decision — add sparingly. */
const FILTER = (src: string): boolean => !src.endsWith('.DS_Store');

/** Cyrillic folder name → ASCII slug. Slugs mirror src/data/projects.ts slugs. */
const RENDER_MAP: Record<string, string> = {
  'likeview':                 'lakeview',              // fixes misspelling
  'ЖК Етно Дім':              'etno-dim',
  'ЖК Маєток Винниківський':  'maietok-vynnykivskyi',
  'Дохідний дім NTEREST':     'nterest',
};

/** Construction months to copy. Already ASCII, no translit needed.
 *  _social-covers intentionally omitted per CONCEPT §7.9. */
const CONSTRUCTION_MONTHS = ['dec-2025', 'jan-2026', 'feb-2026', 'mar-2026'];

// ---- Renders ----
if (existsSync(RENDERS_DST)) rmSync(RENDERS_DST, { recursive: true });
mkdirSync(RENDERS_DST, { recursive: true });

for (const [src, dst] of Object.entries(RENDER_MAP)) {
  const from = join(RENDERS_SRC, src);
  const to = join(RENDERS_DST, dst);
  if (!existsSync(from)) {
    console.warn(`[copy-renders] missing: ${from}`);
    continue;
  }
  cpSync(from, to, { recursive: true, filter: FILTER });
  console.log(`[copy-renders] ${src} → ${dst}`);
}

// ---- Construction ----
if (existsSync(CONSTRUCTION_DST)) rmSync(CONSTRUCTION_DST, { recursive: true });
mkdirSync(CONSTRUCTION_DST, { recursive: true });

for (const month of CONSTRUCTION_MONTHS) {
  const from = join(CONSTRUCTION_SRC, month);
  if (!existsSync(from)) {
    console.warn(`[copy-renders] missing construction: ${from}`);
    continue;
  }
  cpSync(from, join(CONSTRUCTION_DST, month), { recursive: true, filter: FILTER });
}

console.log('[copy-renders] construction done — _social-covers skipped per CONCEPT §7.9');
```

Do NOT:
- Add any npm deps (no `fs-extra`, no `shelljs`, no `rimraf` — node:fs has everything).
- Remove the `filter: FILTER` option from any `cpSync` call (every one of the 2 calls above MUST have it — see RESEARCH §Pitfall B).
- Translit construction folders (already ASCII).
- Copy `_social-covers` (brand conflict).
- Use `fs/promises` — synchronous is fine for a build-time script.
- Import sharp / AVIF encoding — that's Phase 6 (per deferred_ideas).

Edge case handled: if `renders/likeview/` is temporarily missing in dev, script warns and continues — does NOT fail the build (per D-12). Same for construction months.
  </action>
  <acceptance_criteria>
    - `test -d scripts` passes (scripts/ directory now exists)
    - `test -f scripts/copy-renders.ts` passes
    - `grep -c "filter: FILTER" scripts/copy-renders.ts` returns `2` (applied to BOTH cpSync calls — renders + construction loops)
    - `grep -c "!src.endsWith('.DS_Store')" scripts/copy-renders.ts` returns `1`
    - `grep -c "'likeview':" scripts/copy-renders.ts` returns `1` (translit map)
    - `grep -c "'lakeview'" scripts/copy-renders.ts` returns `1`
    - `grep -c "'ЖК Етно Дім':" scripts/copy-renders.ts` returns `1` (Cyrillic source folder name)
    - `grep -c "'etno-dim'" scripts/copy-renders.ts` returns `1`
    - `grep -c "'maietok-vynnykivskyi'" scripts/copy-renders.ts` returns `1`
    - `grep -c "'nterest'" scripts/copy-renders.ts` returns `1`
    - `grep -c "_social-covers" scripts/copy-renders.ts` returns `1` (only in comment, never as a copy target)
    - `grep -cE "'dec-2025'|'jan-2026'|'feb-2026'|'mar-2026'" scripts/copy-renders.ts` returns `4`
    - `grep -cE "import .* from 'node:fs'" scripts/copy-renders.ts` returns `1`
    - `grep -cE "^import .* from '[^n]" scripts/copy-renders.ts` returns `0` (only node: imports, no npm deps)
    - Running `npx tsx scripts/copy-renders.ts` exits 0
    - After execution: `test -d public/renders/lakeview && test -d public/renders/etno-dim && test -d public/renders/maietok-vynnykivskyi && test -d public/renders/nterest` passes
    - After execution: `ls public/renders/lakeview/ | grep -c "\\.jpg$"` returns `7` (all 7 lakeview .jpg files present)
    - After execution: `ls public/renders/etno-dim/ | wc -l` returns `8`
    - After execution: `ls public/renders/maietok-vynnykivskyi/ | wc -l` returns `2`
    - After execution: `ls public/renders/nterest/ | wc -l` returns `3`
    - After execution: `test ! -d public/construction/_social-covers` passes (skipped per §7.9)
    - After execution: `ls public/construction/ | tr '\\n' ' '` contains `dec-2025` `feb-2026` `jan-2026` `mar-2026` and NOT `_social-covers`
    - After execution: `find public/renders public/construction -name '.DS_Store' | wc -l` returns `0` (filter works)
    - After execution: `ls public/construction/mar-2026/ | wc -l` returns `15`
    - After execution: `ls public/construction/dec-2025/ | wc -l` returns `12`
    - Running script TWICE back-to-back produces identical output (idempotent)
  </acceptance_criteria>
  <verify>
    <automated>npm run prebuild && test -d public/renders/lakeview && test -d public/construction/mar-2026 && test ! -d public/construction/_social-covers</automated>
  </verify>
  <done>scripts/copy-renders.ts runs clean; public/renders/ contains 4 ASCII slug folders with correct file counts; public/construction/ contains 4 months (no _social-covers); no .DS_Store anywhere.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/data/construction.ts (4 months of Lakeview photos)</name>
  <files>src/data/construction.ts</files>
  <read_first>
    - src/data/types.ts (ConstructionMonth + ConstructionPhoto)
    - .planning/research/ARCHITECTURE.md §3 Q6 (ConstructionMonth shape)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-21, D-22, D-23 (manual authoring, teaserPhotos on latestMonth only, types live in types.ts)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Correct construction.ts Data" (verified file counts)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Open Questions #3" (teaserPhotos default recommendation)
    - /construction/mar-2026/ listing (verify filenames) — already observed: mar-01.jpg…mar-15.jpg
  </read_first>
  <behavior>
    - `constructionLog: ConstructionMonth[]` has exactly 4 elements
    - Order: mar-2026 first (index 0 = latestMonth), then feb-2026, jan-2026, dec-2025 (reverse chronological)
    - mar-2026.photos has exactly 15 ConstructionPhoto entries (mar-01.jpg through mar-15.jpg)
    - feb-2026.photos has exactly 12 entries (feb-01.jpg through feb-12.jpg)
    - jan-2026.photos has exactly 11 entries (jan-01.jpg through jan-11.jpg)
    - dec-2025.photos has exactly 12 entries (dec-01.jpg through dec-12.jpg)
    - Every photo has a default alt text «Будівельний майданчик, {month-UA} {year}» (CONCEPT §7.9 tone, D-21)
    - No photo has a caption yet (captions are hand-authored later per §7.9 «без хвастощів»; all `caption` fields are undefined/absent)
    - mar-2026.teaserPhotos is defined as 3–5 filenames (strings from mar-2026.photos[].file)
    - feb-2026/jan-2026/dec-2025 have NO teaserPhotos field defined (only latestMonth has it per D-22)
    - `latestMonth()` helper exported; returns constructionLog[0] (mar-2026)
    - File has @rule IMPORT BOUNDARY doc-block (D-34)
    - No React / motion / component imports
    - `npm run lint` passes
  </behavior>
  <action>
Create `src/data/construction.ts` with this EXACT content. Every photo filename must match a real file in `/construction/{month}/` (verified from filesystem).

```typescript
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
```

Do NOT:
- Use `Array.from({length: N}, ...)` to generate the photos array (per D-21, manual authoring is the policy — glob rejection rationale is «import.meta.glob breaks img src», and Array.from gives up the "each photo can carry its own caption later" design).
- Populate `caption` on any photo yet (per §7.9, hand-authored captions come later; stub captions violate «без хвастощів» tone).
- Add `teaserPhotos` to feb-2026 / jan-2026 / dec-2025 (per D-22, only latestMonth gets it).
- Import anything other than the ConstructionMonth type.
  </action>
  <acceptance_criteria>
    - `test -f src/data/construction.ts` passes
    - `grep -c "export const constructionLog" src/data/construction.ts` returns `1`
    - `grep -c "export const latestMonth" src/data/construction.ts` returns `1`
    - `grep -cE "key: 'mar-2026'|key: 'feb-2026'|key: 'jan-2026'|key: 'dec-2025'" src/data/construction.ts` returns `4`
    - `grep -cE "file: 'mar-(0[1-9]|1[0-5])\\.jpg'" src/data/construction.ts` returns `15` (mar-01 through mar-15)
    - `grep -cE "file: 'feb-(0[1-9]|1[0-2])\\.jpg'" src/data/construction.ts` returns `12` (feb-01 through feb-12)
    - `grep -cE "file: 'jan-(0[1-9]|1[01])\\.jpg'" src/data/construction.ts` returns `11` (jan-01 through jan-11)
    - `grep -cE "file: 'dec-(0[1-9]|1[0-2])\\.jpg'" src/data/construction.ts` returns `12` (dec-01 through dec-12)
    - `grep -c "teaserPhotos:" src/data/construction.ts` returns `1` (only mar-2026 has teaserPhotos per D-22)
    - `grep -cE "caption:" src/data/construction.ts` returns `0` (captions are hand-authored later per §7.9)
    - `grep -c "Будівельний майданчик, березень 2026" src/data/construction.ts` returns `15` (all mar photos have alt)
    - `grep -c "@rule IMPORT BOUNDARY" src/data/construction.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion" src/data/construction.ts` returns `0`
    - `grep -cE "from ['\"][^'\"]*components[/'\"]|from ['\"][^'\"]*hooks[/'\"]|from ['\"][^'\"]*pages[/'\"]" src/data/construction.ts` returns `0`
    - `grep -cE "Array\\.from\\(" src/data/construction.ts` returns `0` (manual authoring per D-21)
    - First key in constructionLog is 'mar-2026' (latestMonth()): verified via `head -20 src/data/construction.ts | grep "'mar-2026'"` succeeds
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>src/data/construction.ts exports 4 months with correct photo counts (15/12/11/12), mar-2026 is first with teaserPhotos populated, all photos have UA alt, no captions yet, type-checks clean.</done>
</task>

<task type="auto">
  <name>Task 3: Create scripts/list-construction.ts (manual helper) + wire package.json scripts</name>
  <files>scripts/list-construction.ts, package.json</files>
  <read_first>
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-21 (list-construction is a manual helper per <specifics>, emits UA alt default)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Current Package.json State" (the "What Phase 2 adds" script block)
    - package.json (current state after Plan 02-01 — tsx installed, existing scripts intact)
    - /construction/ filesystem (to validate the script will find real folders)
  </read_first>
  <action>
Step 1. Create `scripts/list-construction.ts` with this EXACT content:

```typescript
/**
 * scripts/list-construction.ts — manual helper that prints a TS-literal
 * photos[] array per month for pasting into src/data/construction.ts.
 *
 * Usage: `npm run list:construction`
 *
 * Prints (to stdout) for each month folder in /construction/ (excluding
 * _social-covers): a TS-snippet with photos as `{ file, alt }` entries where
 * alt defaults to «Будівельний майданчик, {month-UA} {year}». The author
 * copy-pastes the snippet into construction.ts and adds captions by hand
 * per CONCEPT §7.9 («без хвастощів»).
 *
 * Manual rather than automatic (per CONTEXT Claude's Discretion + D-21): the
 * semantic caption («фундамент, секція 1») is a thinking task, not a refresh.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CSRC = join(ROOT, 'construction');

/** Month-key → Ukrainian label. Keys are the folder names we copy. */
const LABELS: Record<string, string> = {
  'dec-2025': 'грудень 2025',
  'jan-2026': 'січень 2026',
  'feb-2026': 'лютий 2026',
  'mar-2026': 'березень 2026',
};

const months = Object.keys(LABELS);

for (const month of months) {
  const folder = join(CSRC, month);
  if (!existsSync(folder)) {
    console.error(`[list-construction] missing: ${folder}`);
    continue;
  }
  const files = readdirSync(folder)
    .filter((f) => f.endsWith('.jpg') && !f.startsWith('.'))
    .sort();

  const altPrefix = `Будівельний майданчик, ${LABELS[month]}`;

  console.log(`\n// ---- ${month} (${files.length} files) ----`);
  console.log(`photos: [`);
  for (const file of files) {
    console.log(`  { file: '${file}', alt: '${altPrefix}' },`);
  }
  console.log(`],`);
}
```

Step 2. Update `package.json` scripts section to add `predev`, `prebuild`, `list:construction` — preserving all existing scripts. Use Edit or Read+Write.

Current scripts block:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "tsc --noEmit"
}
```

After edit (exact target):
```json
"scripts": {
  "predev": "tsx scripts/copy-renders.ts",
  "dev": "vite",
  "prebuild": "tsx scripts/copy-renders.ts",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "tsc --noEmit",
  "list:construction": "tsx scripts/list-construction.ts"
}
```

Do NOT:
- Add `postbuild` here — that's Plan 02-05's scope (check-brand). Adding it now wires an undefined command and breaks `npm run build` before check-brand.ts exists.
- Rename or remove any existing script.
- Add any other npm deps.
- Alphabetize scripts — keep the order above (predev before dev, prebuild before build, list:construction last) for readability.
  </action>
  <acceptance_criteria>
    - `test -f scripts/list-construction.ts` passes
    - `grep -c "readdirSync" scripts/list-construction.ts` returns `1`
    - `grep -c "Будівельний майданчик" scripts/list-construction.ts` returns `1` (UA alt template)
    - `grep -cE "'dec-2025': '|'jan-2026': '|'feb-2026': '|'mar-2026': '" scripts/list-construction.ts` returns `4`
    - `grep -cE "^import .* from '[^n]" scripts/list-construction.ts` returns `0` (only node: imports)
    - `grep -c '"predev": "tsx scripts/copy-renders.ts"' package.json` returns `1`
    - `grep -c '"prebuild": "tsx scripts/copy-renders.ts"' package.json` returns `1`
    - `grep -c '"list:construction": "tsx scripts/list-construction.ts"' package.json` returns `1`
    - `grep -c '"dev": "vite"' package.json` returns `1` (existing script preserved)
    - `grep -c '"build": "tsc --noEmit && vite build"' package.json` returns `1` (existing script preserved)
    - `grep -c '"lint": "tsc --noEmit"' package.json` returns `1` (existing script preserved)
    - `grep -c '"postbuild"' package.json` returns `0` (NOT added yet — Plan 02-05 adds it)
    - `npx tsx scripts/list-construction.ts > /dev/null 2>&1` exits 0
    - `npx tsx scripts/list-construction.ts | grep -c "mar-01.jpg" ` returns `1` (helper emits expected mar-2026 line)
    - `npx tsx scripts/list-construction.ts | grep -cE "^// ---- (dec-2025|jan-2026|feb-2026|mar-2026) \\([0-9]+ files\\) ----$"` returns `4`
    - `npm run list:construction > /dev/null 2>&1` exits 0 (npm script wires correctly)
    - `npm run lint` still exits 0 (nothing under src/ changed)
    - `npm run prebuild` exits 0 (wires to copy-renders.ts from Task 1)
  </acceptance_criteria>
  <verify>
    <automated>npm run lint && npx tsx scripts/list-construction.ts > /dev/null && npm run list:construction > /dev/null</automated>
  </verify>
  <done>scripts/list-construction.ts runs and prints TS-literal inventory for 4 months; package.json has 3 new scripts (predev, prebuild, list:construction); `npm run prebuild` and `npm run list:construction` both succeed.</done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. Full pipeline smoke test:
   ```bash
   npm run prebuild && npm run lint
   ```
   Must exit 0. Produces populated public/renders/ and public/construction/ trees with correct counts.

2. File-count assertions:
   ```bash
   # Renders
   ls public/renders/lakeview/ | wc -l              # expect: 7
   ls public/renders/etno-dim/ | wc -l              # expect: 8
   ls public/renders/maietok-vynnykivskyi/ | wc -l  # expect: 2
   ls public/renders/nterest/ | wc -l               # expect: 3
   # Construction
   ls public/construction/mar-2026/ | wc -l         # expect: 15
   ls public/construction/feb-2026/ | wc -l         # expect: 12
   ls public/construction/jan-2026/ | wc -l         # expect: 11
   ls public/construction/dec-2025/ | wc -l         # expect: 12
   # Exclusions
   test ! -d public/construction/_social-covers     # must pass
   find public/renders public/construction -name '.DS_Store' | wc -l  # expect: 0
   ```

3. Idempotency: run `npm run prebuild` TWICE; second run produces identical tree (no duplicated files, no errors).

4. construction.ts derived data sanity:
   ```bash
   node --input-type=module -e "
   import('./src/data/construction.ts').then(m => {
     if (m.constructionLog.length !== 4) process.exit(1);
     if (m.latestMonth().key !== 'mar-2026') process.exit(2);
     if (!m.latestMonth().teaserPhotos || m.latestMonth().teaserPhotos.length < 3 || m.latestMonth().teaserPhotos.length > 5) process.exit(3);
     if (m.constructionLog[1].teaserPhotos !== undefined) process.exit(4);
     console.log('construction.ts shape OK');
   })"
   ```
   Exit 0 = pass.

Commit boundary (per CONTEXT.md <specifics> — commit 2 of 4):
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(02): add copy-renders + construction data + list helper" --files scripts/copy-renders.ts scripts/list-construction.ts src/data/construction.ts package.json
```

Do NOT commit the generated `public/renders/` and `public/construction/` trees — they should be added to .gitignore IF they're not already. Check `.gitignore` for `/public/renders` and `/public/construction` entries. If missing, add them in this same commit. Verify via:
```bash
git status public/renders public/construction
# Expect: empty or "untracked" (not staged). If staged, unstage and add to .gitignore.
```
</verification>

<success_criteria>
- [ ] scripts/copy-renders.ts runs clean, translits 4 render folders, skips _social-covers and .DS_Store
- [ ] scripts/list-construction.ts helper prints TS-literal inventory for 4 months
- [ ] src/data/construction.ts exports 4 months × N photos (15/12/11/12), mar-2026 is latestMonth() with teaserPhotos
- [ ] package.json has `predev`, `prebuild`, `list:construction` scripts (no postbuild yet)
- [ ] `npm run prebuild` exits 0 and produces populated public/renders/ + public/construction/
- [ ] `npm run lint` still exits 0
- [ ] public/renders/ and public/construction/ gitignored (not committed to repo)
- [ ] Files committed with single atomic commit
</success_criteria>

<output>
After completion, create `.planning/phases/02-data-layer-content/02-03-SUMMARY.md`. Key fields:
- `affects`: [scripts, data, public/, build-pipeline]
- `provides`: [constructionLog, latestMonth, copy-renders prebuild/predev hooks, list-construction helper, public/renders/{4-slugs}, public/construction/{4-months}]
- `patterns`: [translit-at-build-time (ARCHITECTURE Q8), .DS_Store filter in every cpSync, manual-authoring over import.meta.glob (D-21), teaserPhotos on latestMonth only (D-22), UA alt-default «Будівельний майданчик, {month-UA}»]
</output>
