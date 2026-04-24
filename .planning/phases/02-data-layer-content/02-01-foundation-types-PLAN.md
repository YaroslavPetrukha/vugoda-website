---
phase: 02-data-layer-content
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - tsconfig.scripts.json
  - src/data/types.ts
  - src/lib/assetUrl.ts
autonomous: true
requirements_addressed:
  - CON-02
  - ZHK-02
must_haves:
  truths:
    - "tsx is installed as devDependency so all downstream script tasks can execute"
    - "src/data/types.ts defines Project, Stage, Presentation, ConstructionMonth, MethodologyBlock, BrandValue — the ONLY file with interface/type declarations for data+content modules"
    - "src/lib/assetUrl.ts exposes renderUrl(slug,file), constructionUrl(month,file), assetUrl(path) helpers that prepend import.meta.env.BASE_URL"
    - "tsconfig.scripts.json allows manual `npx tsc --noEmit -p tsconfig.scripts.json` against scripts/ without polluting src/ lib config"
    - "npm run lint (tsc --noEmit on src/) still passes — types.ts and assetUrl.ts compile clean"
  artifacts:
    - path: "src/data/types.ts"
      provides: "Project, Stage, Presentation, ConstructionMonth, MethodologyBlock, BrandValue type exports"
      contains: "export interface Project"
    - path: "src/lib/assetUrl.ts"
      provides: "renderUrl, constructionUrl, assetUrl named exports"
      contains: "import.meta.env.BASE_URL"
    - path: "tsconfig.scripts.json"
      provides: "TypeScript config scoped to scripts/ directory, Node-only libs"
      contains: "\"include\": [\"scripts\""
    - path: "package.json"
      provides: "tsx@^4.21.0 in devDependencies"
      contains: "\"tsx\""
  key_links:
    - from: "src/lib/assetUrl.ts"
      to: "import.meta.env.BASE_URL"
      via: "direct reference"
      pattern: "import\\.meta\\.env\\.BASE_URL"
    - from: "tsconfig.scripts.json"
      to: "scripts/"
      via: "include array"
      pattern: "\"include\": \\[\"scripts"
---

<objective>
Lay the foundational scaffolding Phase 2 depends on: install the `tsx` script runner, add `src/data/types.ts` as the single source of truth for all data+content type declarations (per D-02, D-23), wire `src/lib/assetUrl.ts` for BASE_URL-safe asset paths (per D-30, D-31), and add `tsconfig.scripts.json` so `scripts/` TS files can be type-checked without polluting the main tsconfig DOM-lib scope.

Purpose: Every downstream Plan 02/03/04/05 task imports from one of these files. Without them, nothing compiles.
Output: tsx installed; 2 new TS modules (types.ts, assetUrl.ts) committed; tsconfig.scripts.json committed; npm run lint still exits 0.
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
@.planning/research/ARCHITECTURE.md
@package.json
@tsconfig.json
@src/index.css
</context>

<interfaces>
<!-- Key types/helpers this plan creates; downstream plans consume these. -->

`src/data/types.ts` exports (full surface — Plans 02/03/04 import from this):
```typescript
export type Stage =
  | 'u-rozrakhunku'
  | 'u-pogodzhenni'
  | 'buduetsya'
  | 'zdano';

export type Presentation =
  | 'flagship-external'
  | 'full-internal'
  | 'grid-only'
  | 'aggregate';

export interface Project {
  slug: string;
  title: string;
  stageLabel: string;
  stage: Stage;
  presentation: Presentation;
  location?: string;
  externalUrl?: string;
  renders: string[];
  facts?: {
    sections?: number;
    floors?: string;
    area?: string;
    deadline?: string;
    note?: string;
  };
  whatsHappening?: string;
  aggregateText?: string;
  order: number;
}

export interface ConstructionPhoto {
  file: string;
  caption?: string;
  alt?: string;
}

export interface ConstructionMonth {
  key: string;
  label: string;
  yearMonth: string;
  teaserPhotos?: string[];
  photos: ConstructionPhoto[];
}

export interface MethodologyBlock {
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  body: string;
  needsVerification: boolean;
}

export interface BrandValue {
  title: string;
  body: string;
}
```

`src/lib/assetUrl.ts` exports:
```typescript
export const assetUrl: (path: string) => string;
export const renderUrl: (slug: string, file: string) => string;
export const constructionUrl: (month: string, file: string) => string;
```

Runtime BASE_URL values:
- dev: `/`
- prod (GH Pages): `/vugoda-website/` (set by `vite.config.ts base`)
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Install tsx and create tsconfig.scripts.json</name>
  <files>package.json, package-lock.json, tsconfig.scripts.json</files>
  <read_first>
    - package.json (current state — verify tsx NOT already present; existing scripts shape)
    - tsconfig.json (current state — note `"include": ["src"]` and lib set)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Tsconfig Script Coverage" and §"Current Package.json State"
  </read_first>
  <action>
Step 1. Install tsx as devDependency (pinned to caret-4.21.0 per RESEARCH §Environment Availability):

```bash
npm install -D tsx@^4.21.0
```

Do NOT add any other package. Do NOT bump React, Vite, Tailwind, or other existing deps. Do NOT run `npm update`. The install must produce ONLY the tsx addition and a package-lock.json diff.

Step 2. Create `tsconfig.scripts.json` at the repo root with this EXACT content:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "lib": ["ES2022"],
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts"]
}
```

Rationale (do not embed as comments — JSON doesn't support them):
- `lib: ["ES2022"]` only — scripts run in Node, no DOM/DOM.Iterable.
- `types: ["node"]` — enables `import { cpSync } from 'node:fs'` type resolution.
- `include: ["scripts/**/*.ts"]` — scoped to scripts/; does NOT overlap src/.
- Do NOT add `extends: "./tsconfig.json"` — parent pulls in DOM libs that break Node-only scripts.

Step 3. Do NOT create `scripts/` directory yet — Plan 03 creates it when adding copy-renders.ts. `tsc -p tsconfig.scripts.json` invoked before scripts/ exists will report "No inputs were found" and exit 1 — that is EXPECTED for this plan's commit. The config file is seeded; Plan 03 populates the directory.
  </action>
  <acceptance_criteria>
    - `grep -c '"tsx":' package.json` returns `1` (tsx is present in devDependencies)
    - `grep '"tsx":' package.json | grep -oE '"\^[0-9]+\.[0-9]+\.[0-9]+"' | head -1` returns a version `^4.21.0` or higher within major 4
    - `node_modules/tsx/package.json` exists (tsx actually installed, not just declared)
    - `test -f tsconfig.scripts.json` passes (file exists at repo root)
    - `grep -c '"include": \["scripts' tsconfig.scripts.json` returns `1`
    - `grep -c '"lib": \["ES2022"\]' tsconfig.scripts.json` returns `1`
    - `grep -q '"DOM"' tsconfig.scripts.json` EXITS NON-ZERO (DOM must NOT be in scripts tsconfig)
    - `npm run lint` still exits 0 (tsc --noEmit on src/ unaffected)
    - `git diff --stat package.json package-lock.json tsconfig.scripts.json` shows exactly these 3 files touched (plus the new tsconfig.scripts.json as 'A')
  </acceptance_criteria>
  <verify>
    <automated>test -f node_modules/tsx/package.json && test -f tsconfig.scripts.json && npm run lint</automated>
  </verify>
  <done>tsx@^4.21.0 installed and available via `npx tsx --version`; tsconfig.scripts.json exists with Node-only lib; existing `npm run lint` passes.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/data/types.ts (data-layer type declarations)</name>
  <files>src/data/types.ts</files>
  <read_first>
    - .planning/research/ARCHITECTURE.md §3 Q2 (full Project interface + Stage/Presentation unions — verbatim target)
    - .planning/research/ARCHITECTURE.md §3 Q6 (ConstructionMonth interface)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-01, D-02, D-03, D-04, D-16, D-17, D-22, D-23, D-34
    - src/index.css (confirms 6-hex palette — types.ts must not contain hex literals)
    - tsconfig.json (note strict: true — all interface fields must be correctly typed)
  </read_first>
  <behavior>
    - types.ts exports Stage union: 4 literals 'u-rozrakhunku' | 'u-pogodzhenni' | 'buduetsya' | 'zdano'
    - types.ts exports Presentation union: 4 literals 'flagship-external' | 'full-internal' | 'grid-only' | 'aggregate'
    - types.ts exports Project interface with 11 fields (slug, title, stageLabel, stage, presentation, location?, externalUrl?, renders, facts?, whatsHappening?, aggregateText?, order)
    - types.ts exports ConstructionPhoto interface: { file, caption?, alt? }
    - types.ts exports ConstructionMonth interface: { key, label, yearMonth, teaserPhotos?, photos } where photos: ConstructionPhoto[]
    - types.ts exports MethodologyBlock interface: { index: 1..7, title, body, needsVerification }
    - types.ts exports BrandValue interface: { title, body }
    - `npm run lint` passes (tsc --noEmit src/)
    - types.ts has NO runtime values (no const, no default export, no JSX) — types/interfaces only
    - types.ts has NO React imports, NO motion imports, NO component imports (per D-32 boundary rule)
  </behavior>
  <action>
Create file `src/data/types.ts` with this EXACT content (doc-block per D-34, full types per ARCHITECTURE §3 Q2+Q6):

```typescript
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
```

Do NOT add any runtime exports (const, function, class) to this file. Types-only.
Do NOT import from anywhere — this file is a leaf in the import graph.
  </action>
  <acceptance_criteria>
    - `test -f src/data/types.ts` passes
    - `grep -c "export type Stage" src/data/types.ts` returns `1`
    - `grep -c "export type Presentation" src/data/types.ts` returns `1`
    - `grep -c "export interface Project" src/data/types.ts` returns `1`
    - `grep -c "export interface ConstructionPhoto" src/data/types.ts` returns `1`
    - `grep -c "export interface ConstructionMonth" src/data/types.ts` returns `1`
    - `grep -c "export interface MethodologyBlock" src/data/types.ts` returns `1`
    - `grep -c "export interface BrandValue" src/data/types.ts` returns `1`
    - `grep -c "'u-rozrakhunku'" src/data/types.ts` returns `1` (stage literal)
    - `grep -c "'flagship-external'" src/data/types.ts` returns `1` (presentation literal)
    - `grep -cE "^import" src/data/types.ts` returns `0` (no imports)
    - `grep -cE "^export const|^export function|^export default" src/data/types.ts` returns `0` (no runtime exports)
    - `grep -c "@rule IMPORT BOUNDARY" src/data/types.ts` returns `1` (doc-block present per D-34)
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>`src/data/types.ts` type-checks clean, exports all 7 named types, contains doc-block, has zero imports and zero runtime exports.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Create src/lib/assetUrl.ts (BASE_URL-safe asset helpers)</name>
  <files>src/lib/assetUrl.ts</files>
  <read_first>
    - .planning/research/ARCHITECTURE.md §3 Q8 end of section (renderUrl example)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-30, D-31
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Code Examples → assetUrl.ts"
    - vite.config.ts (confirm `base: '/vugoda-website/'` still present — assetUrl's behavior depends on it)
    - tsconfig.json `types: ["vite/client"]` line (this gives import.meta.env.BASE_URL its type)
  </read_first>
  <behavior>
    - `renderUrl('lakeview', 'aerial.jpg')` returns `'/vugoda-website/renders/lakeview/aerial.jpg'` in prod, `'/renders/lakeview/aerial.jpg'` in dev
    - `constructionUrl('mar-2026', 'mar-01.jpg')` returns `'/vugoda-website/construction/mar-2026/mar-01.jpg'` in prod, `'/construction/mar-2026/mar-01.jpg'` in dev
    - `assetUrl('/brand/favicon/favicon-32.svg')` and `assetUrl('brand/favicon/favicon-32.svg')` both return `'/vugoda-website/brand/favicon/favicon-32.svg'` in prod (leading slash stripped)
    - No React import, no motion import, no component imports
    - Pure function — no side effects, no caching
  </behavior>
  <action>
Create file `src/lib/assetUrl.ts` with this EXACT content:

```typescript
/**
 * @module lib/assetUrl
 * @rule Pure utility module. No React imports, no motion imports, no component
 *   imports. All asset URL construction goes through these helpers to ensure
 *   BASE_URL prefix correctness. Vite sets import.meta.env.BASE_URL =
 *   '/vugoda-website/' in prod and '/' in dev (see vite.config.ts base option).
 *   Never hardcode '/renders/…' or '/construction/…' in JSX — always go through
 *   renderUrl() / constructionUrl(). Enforced by scripts/check-brand.ts
 *   importBoundaries() — see Plan 02-05.
 */

const BASE = import.meta.env.BASE_URL;

/**
 * Generic asset URL helper. Prepends BASE_URL and strips any leading slash on
 * the input so callers can use either 'foo/bar.svg' or '/foo/bar.svg' safely.
 * Prefer the domain-specific helpers renderUrl / constructionUrl for the
 * /renders/ and /construction/ trees — they're more refactor-proof.
 */
export const assetUrl = (path: string): string =>
  `${BASE}${path.replace(/^\//, '')}`;

/**
 * Build a URL for a project render image. Slug is the translit folder name
 * (e.g. 'lakeview', 'etno-dim'). File is a filename from project.renders[].
 * Consumers: <FlagshipCard>, <PipelineCard>, <ZhkHero>, <ZhkGallery> (Phase 3/4).
 */
export const renderUrl = (slug: string, file: string): string =>
  `${BASE}renders/${slug}/${file}`;

/**
 * Build a URL for a construction-log photo. Month is an ASCII key
 * (e.g. 'mar-2026'). File is a filename from ConstructionMonth.photos[].file.
 * Consumers: <ConstructionTeaser>, <ConstructionLogPage> (Phase 3/4).
 */
export const constructionUrl = (month: string, file: string): string =>
  `${BASE}construction/${month}/${file}`;
```

Do NOT use template literals that concatenate import.meta.env.BASE_URL lazily per call — the module-level `const BASE = ...` is intentional (evaluated once at module init, type-narrows cleanly).

Do NOT add any other helpers (no `ogImageUrl`, no `faviconUrl`) — those are one-off and will hardcode in Phase 6 where they're consumed; premature helpers bloat this file.
  </action>
  <acceptance_criteria>
    - `test -f src/lib/assetUrl.ts` passes
    - `grep -c "export const assetUrl" src/lib/assetUrl.ts` returns `1`
    - `grep -c "export const renderUrl" src/lib/assetUrl.ts` returns `1`
    - `grep -c "export const constructionUrl" src/lib/assetUrl.ts` returns `1`
    - `grep -c "import.meta.env.BASE_URL" src/lib/assetUrl.ts` returns `1`
    - `grep -cE "^import " src/lib/assetUrl.ts` returns `0` (no imports — pure module)
    - `grep -cE "from 'react'|from \"react\"|from 'motion|from \"motion" src/lib/assetUrl.ts` returns `0`
    - `grep -c "@rule" src/lib/assetUrl.ts` returns `1` (doc-block present)
    - `grep -cE "path\\.replace\\(/\\^\\\\//, ''\\)" src/lib/assetUrl.ts` returns `1` (assetUrl strips leading slash)
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>`src/lib/assetUrl.ts` exports 3 named helpers, references import.meta.env.BASE_URL, has no React/motion imports, type-checks clean.</done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. `npm run lint` — exits 0 (src/ type-checks including new types.ts and assetUrl.ts)
2. `ls package-lock.json node_modules/tsx/package.json > /dev/null` — both exist (tsx actually installed)
3. `grep -c "export" src/data/types.ts` — ≥ 7 (Stage, Presentation, Project, ConstructionPhoto, ConstructionMonth, MethodologyBlock, BrandValue)
4. `grep -c "export const" src/lib/assetUrl.ts` — exactly 3 (assetUrl, renderUrl, constructionUrl)
5. `test -f tsconfig.scripts.json` — exists
6. Boundary pre-check (early proof for Plan 05): `grep -rE "from 'react'|from 'motion" src/data/ src/lib/` — exits non-zero (no matches), confirms data/ and lib/ are clean of runtime framework imports

Commit boundary (per CONTEXT.md <specifics> — "4 atomic commits"):

```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(02): install tsx + add data/types + assetUrl foundation" --files package.json package-lock.json tsconfig.scripts.json src/data/types.ts src/lib/assetUrl.ts
```

This is commit 1 of the 4 atomic commits (<specifics> groups types + projects + fixtures; Plan 02 adds projects.ts and fixtures, which completes that commit's intent. For clarity, this plan commits the types+tsx/tsconfig foundation first as its own logical unit.).
</verification>

<success_criteria>
- [ ] `tsx` in package.json devDependencies, installed in node_modules
- [ ] tsconfig.scripts.json exists at repo root with Node-only lib/types
- [ ] src/data/types.ts exports Stage, Presentation, Project, ConstructionPhoto, ConstructionMonth, MethodologyBlock, BrandValue — zero runtime exports, zero imports
- [ ] src/lib/assetUrl.ts exports renderUrl, constructionUrl, assetUrl — all prepend import.meta.env.BASE_URL
- [ ] `npm run lint` exits 0
- [ ] Every file has a `@rule` doc-block per D-34 requirement
- [ ] Files committed with single atomic commit message
</success_criteria>

<output>
After completion, create `.planning/phases/02-data-layer-content/02-01-SUMMARY.md` following template at `$HOME/.claude/get-shit-done/templates/summary.md`. Key fields:
- `affects`: [types, lib, devDeps]
- `provides`: [tsx-installed, types.Project, types.Stage, types.Presentation, types.ConstructionMonth, types.MethodologyBlock, types.BrandValue, lib.renderUrl, lib.constructionUrl, lib.assetUrl, tsconfig.scripts]
- `patterns`: [types-only-module (D-02), BASE_URL-helper (D-30), doc-block-rule (D-34)]
</output>
