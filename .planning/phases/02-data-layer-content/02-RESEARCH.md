# Phase 2: Data Layer & Content — Research

**Researched:** 2026-04-24
**Domain:** TypeScript data modules, translit build script, content modules, CI brand-enforcement script
**Confidence:** HIGH — all findings verified against live filesystem, package.json, tsconfig.json, deploy.yml, and Node.js API

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Data schema inherits verbatim from `.planning/research/ARCHITECTURE.md §3 Q2` — `Project` interface + `Stage` union + `Presentation` union + 5 canonical records + derived views. Planner does NOT re-decide shape; implements it.
- **D-02:** `src/data/types.ts` is the only module with interface/type declarations. `projects.ts` imports types and exports records + derived views. No inlined interface re-declarations.
- **D-03:** Ordering by explicit `order: 1..5` field. Derived views sort ascending. No timestamp guessing.
- **D-04:** `findBySlug()` returns only `presentation: 'full-internal'` records. Other slugs → Navigate redirect per ARCHITECTURE Anti-Pattern 7.
- **D-05:** Slugs locked: `lakeview`, `etno-dim`, `maietok-vynnykivskyi`, `nterest`, `pipeline-4`.
- **D-06:** Pipeline-4 aggregate copy verbatim from ARCHITECTURE Q2. `pipeline4Title = 'Без назви'` in `placeholders.ts`.
- **D-07:** `src/data/projects.fixtures.ts` — 10 synthetic ЖК, all 4 buckets (min 2 per bucket), empty `renders: []`. Never in production build.
- **D-08:** Scale-to-N signal = fixtures type-check as `Project[]` via `tsc --noEmit`. Visual `/dev/grid` = Phase 4.
- **D-09:** Fixtures never imported from `src/pages/` or `src/components/sections/`. Enforced by CI grep.
- **D-10:** `scripts/copy-renders.ts` ships verbatim from ARCHITECTURE Q8. Translit map: `likeview→lakeview`, `ЖК Етно Дім→etno-dim`, `ЖК Маєток Винниківський→maietok-vynnykivskyi`, `Дохідний дім NTEREST→nterest`.
- **D-11:** Construction months are already ASCII; copied verbatim to `public/construction/{month}/`. `_social-covers/` skipped.
- **D-12:** Missing source folder = warning (stderr) not build failure.
- **D-13:** Wired as `prebuild` AND `predev` npm scripts. Executed via `tsx scripts/copy-renders.ts`.
- **D-14:** Script is idempotent: `rmSync(DST, {recursive: true})` before copy.
- **D-15:** Four separate content modules: `src/content/methodology.ts`, `src/content/values.ts`, `src/content/company.ts`, `src/content/placeholders.ts`.
- **D-16:** `methodologyBlocks: MethodologyBlock[]`, `MethodologyBlock = { index: 1..7, title: string, body: string, needsVerification: boolean }`. Blocks 2, 5, 6 have `needsVerification: true`.
- **D-17:** `brandValues: { title: string; body: string }[]` — 4 records.
- **D-18:** `company.ts` typed consts: legalName, edrpou, licenseDate, licenseNote, email, socials scaffold.
- **D-19:** `placeholders.ts` named consts: `phone: '—'`, `address: '—'`, `pipeline4Title: 'Без назви'`, `etnoDimAddress: '—'`. Raw em-dash, never `{{token}}`.
- **D-20:** Components never contain Ukrainian JSX literal paragraphs >40 chars containing brand name. Short UI microcopy (button labels) may stay inline.
- **D-21:** `src/data/construction.ts` hand-authored. `scripts/list-construction.ts` is dev helper that prints TS-literal inventory. `import.meta.glob` explicitly rejected.
- **D-22:** `ConstructionMonth` gets optional `teaserPhotos: string[]`. Populated only for `latestMonth()` (mar-2026) with 3–5 curated filenames.
- **D-23:** `ConstructionMonth` type definition in `src/data/types.ts`.
- **D-24:** `scripts/check-brand.ts` exports 3 check functions: `denylistTerms()`, `paletteWhitelist()`, `placeholderTokens()`. No npm deps. Exit code aggregate.
- **D-25:** `denylistTerms()` greps `dist/**` AND `src/**` for `Pictorial`, `Rubikon`, `Пикторіал`, `Рубікон` (case-insensitive).
- **D-26:** `paletteWhitelist()` greps `src/**/*.{ts,tsx,css}` for hex patterns. Whitelist: `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A`. `.planning/**` and `brand-system.md` excluded.
- **D-27:** `placeholderTokens()` greps `dist/**` for `{{`, `}}`, `TODO`, `FIXME`. `src/**` excluded from TODO-check.
- **D-28:** Wired in BOTH: `"postbuild": "tsx scripts/check-brand.ts"` AND dedicated CI step BEFORE `upload-pages-artifact`.
- **D-29:** Fail mode: exit code 1 → build fails locally AND Actions deploy blocks. No warn-only.
- **D-30:** `src/lib/assetUrl.ts` exports `renderUrl(slug, file)`, `constructionUrl(month, file)`, `assetUrl(path)`.
- **D-31:** Both helpers prepend `import.meta.env.BASE_URL`. Never hardcode `/renders/…` or `/construction/…` in JSX.
- **D-32:** Boundary rules enforced via README + CI grep checks (no ESLint).
- **D-33:** `importBoundaries()` = 4th check function in `scripts/check-brand.ts`.
- **D-34:** Per-file doc-block at top of `src/data/*.ts` and `src/content/*.ts` states import rule.

### Claude's Discretion

- Exact glob pattern implementation in `check-brand.ts` (shell-out to `grep` vs pure-JS). Use `child_process.execSync('grep -rE …')` for MVP.
- Whether `scripts/list-construction.ts` runs automatically or is manual helper. Recommended: `npm run list:construction` (manual).
- Exact synthetic-data field values in `projects.fixtures.ts` (union constraints must be satisfied).
- Whether `brand-system.md` + `КОНЦЕПЦІЯ-САЙТУ.md` move to `docs/`. Not a Phase 2 blocker.
- `MethodologyBlock.body` line-break: raw `\n\n` as paragraph separator.
- `socials` field typing: plain `string` is simpler.

### Deferred Ideas (OUT OF SCOPE)

- `/dev/grid` route rendering — Phase 4
- `/dev/brand` route — Phase 3
- Sharp-based image pipeline / AVIF encoding — Phase 6
- ESLint `import/no-restricted-paths` — rejected for MVP
- Portable-text / Block[] for methodology — v2
- Sanity / headless CMS integration — v2
- Real phone number / juridical address — v2 (client-blocked)
- Pipeline-4 real title + location — v2 (client-blocked)
- Methodology §8 blocks 2/5/6 verification content — v2 (client-blocked)
- Lakeview technical characteristics — v2
- Construction-log expansion beyond Lakeview — v2

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CON-01 | All user-facing copy from КОНЦЕПЦІЯ-САЙТУ.md §7, §8 as `src/content/*.ts` modules; ⚠ markers on methodology blocks 2/5/6 | D-15..D-20 cover content modules; filesystem confirms КОНЦЕПЦІЯ content is sourced from spec not JSX literals |
| CON-02 | Typed `src/data/projects.ts` with `Project` interface + discriminated `presentation` union; plus `src/data/projects.fixtures.ts` with 10 synthetic ЖК | D-01..D-09 cover schema + fixtures; tsconfig gap (see §Tsconfig Script Coverage) requires `tsconfig.scripts.json` |
| ZHK-02 | Template scalable — adding ЖК #6 = one record PR; discriminated union `presentation` drives all routing + rendering | ARCHITECTURE Q2 schema satisfies this; fixture type-check is the acceptance signal |
| QA-04 | CI denylist: `Pictorial\|Rubikon\|Пикторіал\|Рубікон` in `dist/` empty; hex whitelist in `src/`; `{{\|TODO` in `dist/` empty | D-24..D-29 + D-33; grep exit-code behavior verified; deploy.yml insertion point mapped |

</phase_requirements>

---

## Summary

Phase 2 is implementation-heavy, research-light. The CONTEXT.md has 34 locked decisions that fully specify what to build. This research document answers the 9 concrete questions the planner still needs: filesystem inventory, package.json gaps, script edge cases, CI grep patterns, tsconfig extension, import boundary grep incantations, deploy.yml diff, and validation architecture.

**Key findings that diverge from ARCHITECTURE.md expectations (planner must correct):**

1. Lakeview render files are `aerial.jpg`, `closeup.jpg`, `entrance.jpg`, `hero.jpg`, `lake-bridge.jpg`, `semi-aerial.jpg`, `terrace.jpg` — **7 files, all `.jpg`**. ARCHITECTURE Q2 listed them as `.webp` (`aerial.webp`, `02.webp`, `03.webp`). The `projects.ts` canonical data must use the actual filenames.
2. `tsx` is NOT installed — not in `package.json`, not in `node_modules`. Must be added as devDependency.
3. `tsconfig.json` includes only `src/` — `scripts/` is not covered. A companion `tsconfig.scripts.json` is needed so `tsc --noEmit` can optionally type-check scripts; but `tsx` runs scripts without type-checking by default.
4. `cpSync` from `node:fs` WILL copy `.DS_Store` files from macOS authoring machine. The ARCHITECTURE Q8 script needs a `filter` callback added to exclude `.DS_Store`.
5. `scripts/` directory does not yet exist — must be created.
6. Phase 1 already wired `build: "tsc --noEmit && vite build"` with no `pre/postbuild` hooks — Phase 2 adds them without conflict.

**Primary recommendation:** Build in commit order: types → projects + fixtures → copy-renders + assetUrl → content modules → check-brand + deploy.yml patch. Each commit is independently buildable.

---

## Filesystem Inventory (Verified)

### `/renders/` Source Folders

| Source folder | Translit slug | File count | Extensions | Notes |
|---------------|---------------|-----------|------------|-------|
| `likeview/` | `lakeview` | 7 | `.jpg` only | Fixes misspelling. Files: `aerial.jpg`, `closeup.jpg`, `entrance.jpg`, `hero.jpg`, `lake-bridge.jpg`, `semi-aerial.jpg`, `terrace.jpg` |
| `ЖК Етно Дім/` | `etno-dim` | 8 | `.jpg.webp`, `.png.webp` | Files: `43615.jpg.webp`–`43621.jpg.webp`, `61996.png.webp` |
| `ЖК Маєток Винниківський/` | `maietok-vynnykivskyi` | 2 | `.jpg.webp`, `.png.webp` | Files: `44463.jpg.webp`, `62343.png.webp` |
| `Дохідний дім NTEREST/` | `nterest` | 3 | `.jpg.webp`, `.png.webp` | Files: `2213.jpg.webp`, `2214.jpg.webp`, `60217.png.webp` |

**No nested subdirectories** in any render folder — `cpSync` recursive depth is flat (verified).

**`.DS_Store` present** at `renders/.DS_Store` (macOS artifact). The ARCHITECTURE Q8 script copies `from/` with `cpSync(from, to, {recursive: true})` — this will copy `.DS_Store` into `public/renders/` without a filter. Must add filter callback (Node 16.7+ supports it, Node 25.9 confirmed available).

### `/construction/` Source Folders

| Month folder | File count | Extensions | Notes |
|-------------|-----------|------------|-------|
| `dec-2025/` | 12 | `.jpg` | Files: `dec-01.jpg`–`dec-12.jpg` |
| `jan-2026/` | 11 | `.jpg` | Files: `jan-01.jpg`–`jan-11.jpg` |
| `feb-2026/` | 12 | `.jpg` | Files: `feb-01.jpg`–`feb-12.jpg` |
| `mar-2026/` | 15 | `.jpg` | Files: `mar-01.jpg`–`mar-15.jpg` |
| `_social-covers/` | 6 | `.jpg` | **SKIP** — 6 files: `monthly-feb.jpg`, `progress-dec.jpg`, `progress-mar.jpg`, `site-feb.jpg`, `snow-jan.jpg`, `stage-jan.jpg` |

**Total copied construction files: 50** (dec+jan+feb+mar, excluding _social-covers).
All folder names already ASCII — no translit needed for construction.
All filenames already ASCII and follow uniform `{mon}-{NN}.jpg` pattern.

**Discrepancy from ARCHITECTURE Q6:** ARCHITECTURE Q6 lists `latestMonth()` photos with `Array.from({length:15}, ...)` generating names like `mar-{01..15}.jpg` — this matches the actual filesystem. Construction data for `construction.ts` can list filenames directly.

---

## Current Package.json State

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  }
}
```

**What Phase 2 adds:**

```json
{
  "scripts": {
    "predev": "tsx scripts/copy-renders.ts",
    "dev": "vite",
    "prebuild": "tsx scripts/copy-renders.ts",
    "build": "tsc --noEmit && vite build",
    "postbuild": "tsx scripts/check-brand.ts",
    "preview": "vite preview",
    "lint": "tsc --noEmit",
    "list:construction": "tsx scripts/list-construction.ts"
  },
  "devDependencies": {
    "tsx": "^4.21.0"
  }
}
```

**`tsx` not installed** — confirmed absent from `package.json` devDependencies and `node_modules/`. Must `npm install -D tsx@^4.21.0`. Current latest version: `4.21.0` (verified via `npm view tsx version`).

**Pre/post hook execution order:**
- `npm run dev` → `predev` (copy-renders) → `vite`
- `npm run build` → `prebuild` (copy-renders) → `tsc --noEmit && vite build` → `postbuild` (check-brand)
- `npm run lint` → `tsc --noEmit` only (no hooks on `lint`)

---

## Translit Script: Edge Cases and Fixes

### Canonical source (ARCHITECTURE Q8)

The Q8 code block is the verbatim implementation target. It uses:
- `import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'`
- `import { join } from 'node:path'`
- `new URL('..', import.meta.url).pathname` for ROOT (requires `"type": "module"` in package.json — confirmed present)

### Edge case 1: `.DS_Store` propagation

`cpSync` with `{recursive: true}` copies all files including `.DS_Store`. On CI (ubuntu-latest), macOS-generated `.DS_Store` files from the authoring machine will be present in the committed `renders/` tree and will copy to `public/renders/`. This pollutes the artifact. Fix:

```typescript
cpSync(from, to, {
  recursive: true,
  filter: (src) => !src.endsWith('.DS_Store'),
});
```

The `filter` option is available in Node ≥16.7 (confirmed working on Node 25.9). Add to ALL `cpSync` calls in the script (both renders and construction copy loops).

### Edge case 2: Lakeview filename discrepancy

ARCHITECTURE Q2 lists lakeview renders as `'aerial.webp', '02.webp', '03.webp'`. **Actual files are all `.jpg`**: `aerial.jpg`, `closeup.jpg`, `entrance.jpg`, `hero.jpg`, `lake-bridge.jpg`, `semi-aerial.jpg`, `terrace.jpg` (7 files). The `projects.ts` lakeview record must list the actual `.jpg` filenames. This also means `renders[0]` for lakeview = `'aerial.jpg'` (not `'aerial.webp'`).

### Edge case 3: No nested subdirectories

Verified: no subfolder exists inside any render source folder. `cpSync` recursive will not encounter intermediate directories to create.

### Edge case 4: Construction copy — no filter needed for filenames

Construction filenames are already ASCII (`dec-01.jpg`, etc.) and contain no special characters. Only `.DS_Store` exclusion needed.

### Edge case 5: `import.meta.url` on macOS returns file:// URI

`new URL('..', import.meta.url).pathname` on macOS returns `/Users/admin/Documents/Проєкти/vugoda-website/` — the path contains Cyrillic characters (`Проєкти`). This is fine because `path.join()` uses filesystem paths (not URLs), and Node.js handles UTF-8 filesystem paths correctly on macOS. On CI ubuntu-latest the path will be clean ASCII.

### fs.cpSync availability

`fs.cpSync` landed in Node 16.7.0. Current project uses Node 20 (Actions) / Node 25.9 (local). Confirmed available.

---

## CI Denylist Implementation

### Shell-out vs pure-JS

D-24 (Claude's Discretion) recommends `child_process.execSync('grep -rE …')` for MVP. This is correct because:
- `grep` on ubuntu-latest is GNU grep — fully available, no install needed
- `grep -rE` supports extended regex; `grep -ri` adds case-insensitivity
- 3× faster than pure-JS `fs.readFile` + regex scan for large dist/
- Exit code propagation: `grep` exits 0 if match found, 1 if no match — maps naturally to failure logic

### Exit code pattern (verified)

```bash
grep finds match  → exit 0  (truthy in shell)
grep no match     → exit 1  (falsy in shell)
```

In Node.js `execSync`: if grep exits 0 (match found), function returns output. If grep exits 1 (no match), `execSync` throws with `status: 1`.

**Correct CI denylist pattern** — two approaches work equivalently:

**Approach A (shell-out, throw on match):**
```typescript
import { execSync } from 'node:child_process';

function denylistTerms(): boolean {
  try {
    // grep exits 0 if match found — execSync returns output
    const result = execSync(
      'grep -rE --include="*.html" --include="*.js" --include="*.css" ' +
      '"Pictorial|Rubikon|Пикторіал|Рубікон" dist/ src/',
      { encoding: 'utf8' }
    );
    console.error('[check-brand] FAIL denylistTerms:\n' + result);
    return false;
  } catch (e: any) {
    if (e.status === 1) {
      // grep found nothing — good
      console.log('[check-brand] PASS denylistTerms: 0 matches');
      return true;
    }
    throw e; // unexpected error
  }
}
```

**Approach B (shell-out, `|| true` pattern):**
```typescript
// Returns stdout if match, empty string if no match
const out = execSync(
  'grep -rE "Pictorial|Rubikon|Пикторіал|Рубікон" dist/ src/ || true',
  { encoding: 'utf8' }
);
if (out.trim()) { console.error('[check-brand] FAIL:\n' + out); return false; }
```

Approach B is simpler. Use it.

### Concrete grep incantations for each check

**D-25 — denylistTerms() — terms forbidden in ALL of dist/ and src/:**
```bash
grep -rliE "Pictorial|Rubikon|Пикторіал|Рубікон" dist/ src/ --include="*.html" --include="*.js" --include="*.css" --include="*.ts" --include="*.tsx"
```
Note: `-l` returns filenames only. Remove `-l` and add `-n` to get `filename:linenum:content` for better CI logs.

**D-26 — paletteWhitelist() — hex values in src/*.{ts,tsx,css}:**
```bash
grep -rnhE '#[0-9A-Fa-f]{3,6}' src/ --include="*.ts" --include="*.tsx" --include="*.css"
# Then filter: any result NOT matching canonical set → fail
```

Implementation note: the check must filter output lines, not just check for exit code. Shell approach:
```bash
grep -rEoh '#[0-9A-Fa-f]{3,6}' src/ --include="*.ts" --include="*.tsx" --include="*.css" \
  | grep -iEv '^(#2F3640|#C1F33D|#F5F7FA|#A7AFBC|#3D3B43|#020A0A)$' \
  || true
```
The outer grep extracts hexes, inner grep removes known-good ones. Remaining = violations.

**Case sensitivity note:** All 6 canonical hexes use uppercase A-F. But `src/index.css` is confirmed uppercase. `MinimalCube.tsx` has `'#A7AFBC'`, `'#F5F7FA'`, `'#C1F33D'` — uppercase. The whitelist regex should be case-insensitive (`-i`) to handle any developer who types `#c1f33d` instead of `#C1F33D` — both are brand-correct, just different casing. Make the exclusion pattern case-insensitive.

**Known false-positive for paletteWhitelist:** `brand-assets/logo/black.svg` contains `#2a3038` (old prototype color). BUT: `brand-assets/` is NOT under `src/`, so `grep src/` will NOT scan it. Confirmed safe.

**D-27 — placeholderTokens() — template tokens in dist/:**
```bash
grep -rn "{{" dist/ --include="*.html" --include="*.js"
grep -rn "}}" dist/ --include="*.html" --include="*.js"
grep -rn "TODO\|FIXME" dist/ --include="*.html" --include="*.js"
```
`src/**` excluded from TODO-check per D-27.

**D-33 — importBoundaries():**

```bash
# Rule 1: components/ may NOT import from pages/
grep -rn "from ['\"].*pages/" src/components/ --include="*.ts" --include="*.tsx" || true

# Rule 2: data/ may NOT import React, motion, components/, hooks/
grep -rn "from 'react'\|from \"react\"\|from 'motion/react'\|from \"motion/react\"\|from '.*components\|from \".*components\|from '.*hooks\|from \".*hooks" src/data/ --include="*.ts" || true

# Rule 3: content/ follows same rule as data/
grep -rn "from 'react'\|from \"react\"\|from 'motion/react'\|from \"motion/react\"\|from '.*components\|from \".*components\|from '.*hooks\|from \".*hooks" src/content/ --include="*.ts" || true

# Rule 4: components/ may NOT contain raw /renders/ or /construction/ path literals
grep -rn "'/renders/\|'/construction/\|\"/renders/\|\"/construction/" src/components/ --include="*.ts" --include="*.tsx" || true
```

Each grep: if output is non-empty → fail. Add `|| true` to prevent shell exit-on-nonzero killing the Node process prematurely (let Node handle the fail logic).

---

## Tsconfig Script Coverage

**Current state:** `tsconfig.json` has `"include": ["src"]`. The `scripts/` directory is NOT included.

**What this means:**
- `tsc --noEmit` (the lint script) does NOT type-check `scripts/*.ts`
- `tsx` runs scripts by transpiling on-the-fly without type-checking (esbuild under the hood)
- Scripts can have type errors and `npm run lint` will not catch them

**Decision: create `tsconfig.scripts.json`** in repo root for type-checking scripts optionally. This avoids polluting the main tsconfig with DOM-less lib settings.

```json
// tsconfig.scripts.json
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
    "lib": ["ES2022"]
  },
  "include": ["scripts"]
}
```

Note: `lib: ["ES2022"]` — no DOM (scripts run in Node, not browser). No `types: ["vite/client"]` (no `import.meta.env` needed in scripts; `import.meta.url` is a Node ESM built-in).

**Planner choice:** Add a `lint:scripts` npm script: `"tsc --noEmit -p tsconfig.scripts.json"`. Run it manually; don't add to main `lint` script to avoid requiring DOM-less lib flags globally.

---

## Tailwind v4 @theme and paletteWhitelist()

**Question:** Can `paletteWhitelist()` read hexes dynamically from `src/index.css` as source of truth?

**Answer:** Yes, technically — parse the CSS file, extract `@theme` block, pull `--color-*` values. But this is 20+ lines of fragile string parsing. The simpler and safer approach is a **literal const array in `check-brand.ts`** that is manually synced with `@theme`.

**Drift risk analysis:** The `@theme` palette in `src/index.css` was established in Phase 1 and is locked by brand policy. It will not change during Phase 2-6. If `@theme` hexes ever change, `check-brand.ts` must be updated in the same commit — this is discoverable via the failing CI (wrong hex in `@theme` would either be caught by paletteWhitelist or cause a visual brand violation obvious in review).

**Recommended approach:** Literal const:
```typescript
const PALETTE_WHITELIST = [
  '#2F3640', '#C1F33D', '#F5F7FA', '#A7AFBC', '#3D3B43', '#020A0A',
];
```

Add a comment: `// Matches @theme in src/index.css — update both if palette changes.`

---

## deploy.yml: check-brand Step Insertion

**Current deploy.yml** (Phase 1 baseline, lines 17-28):
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
```

**Phase 2 diff** — insert ONE new step between `npm run build` and `upload-pages-artifact`:

```yaml
      - run: npm ci
      - run: npm run build
      - name: Check brand invariants
        run: npx tsx scripts/check-brand.ts
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
```

**Why `npx tsx` (not just `tsx`):** `tsx` is a devDependency installed to `node_modules/.bin/tsx`. In GitHub Actions after `npm ci`, `npx tsx` resolves to `./node_modules/.bin/tsx`. Alternatively use `./node_modules/.bin/tsx scripts/check-brand.ts`. Both work. `npx tsx` is idiomatic.

**Why this step is separate from `postbuild`:** `postbuild` runs inside `npm run build`. The dedicated step runs after build completes and produces a named, collapsible step in the Actions UI — logs show `✓ 3 checks passed` vs buried in `npm run build` output. D-28 explicitly calls this out as the intent ("dedicated CI step prints per-check summary in PR logs").

**Double-run behavior:** check-brand runs twice on CI — once via `postbuild` (inside `npm run build`), once via the named step. Both exit 1 on failure. If `postbuild` fails, `npm run build` step fails and the named step is skipped (never reached). The named step only runs on a clean build — so it serves as a confirmation log entry, not a redundant catch. This matches D-28 "overlapping safety nets."

**No OIDC/permissions change needed:** The `check-brand` step is a read-only script that scans `dist/` and `src/`. It requires no GitHub permissions beyond what `actions/checkout@v4` already provides (read-only fs access). The existing `permissions: { contents: read, pages: write, id-token: write }` block is unchanged.

---

## Import Boundary Grep Patterns

Six concrete grep incantations for acceptance criteria:

```bash
# 1. components/ must not import from pages/
grep -rn "from ['\"].*pages/" src/components/ --include="*.ts" --include="*.tsx"
# Expected: empty output

# 2. data/ must not import React
grep -rn "from 'react'\|from \"react\"" src/data/ --include="*.ts"
# Expected: empty output

# 3. data/ must not import motion or components
grep -rn "from 'motion/react'\|from \"motion/react\"\|from '.*components\|from \".*components" src/data/ --include="*.ts"
# Expected: empty output

# 4. content/ follows same rule as data/
grep -rn "from 'react'\|from \"react\"\|from 'motion\|from \"motion\|from '.*components\|from \".*components\|from '.*pages\|from \".*pages" src/content/ --include="*.ts"
# Expected: empty output

# 5. components/ must not contain raw /renders/ or /construction/ path literals
grep -rn "'/renders/\|'/construction/\|\"/renders/\|\"/construction/" src/components/ --include="*.ts" --include="*.tsx"
# Expected: empty output

# 6. pages/ and components/ must not import projects.fixtures.ts
grep -rn "projects\.fixtures" src/pages/ src/components/ --include="*.ts" --include="*.tsx"
# Expected: empty output (fixtures only imported in Phase 4 /dev/grid route)
```

---

## Correct `projects.ts` Data (Divergence from ARCHITECTURE Q2)

ARCHITECTURE Q2 has lakeview renders as `['aerial.webp', '02.webp', '03.webp']`. **These are wrong.** Actual files verified from filesystem:

**Correct lakeview record `renders` array:**
```typescript
renders: ['aerial.jpg', 'closeup.jpg', 'entrance.jpg', 'hero.jpg', 'lake-bridge.jpg', 'semi-aerial.jpg', 'terrace.jpg'],
```

**Correct Etno Dim renders array** (matches ARCHITECTURE Q2 exactly):
```typescript
renders: ['43615.jpg.webp', '43616.jpg.webp', '43617.jpg.webp', '43618.jpg.webp', '43619.jpg.webp', '43620.jpg.webp', '43621.jpg.webp', '61996.png.webp'],
```

**Correct Maietok renders array:**
```typescript
renders: ['44463.jpg.webp', '62343.png.webp'],
```

**Correct NTEREST renders array** (matches ARCHITECTURE Q2):
```typescript
renders: ['2213.jpg.webp', '2214.jpg.webp', '60217.png.webp'],
```

The `renders[0]` convention (first file = hero/cover) means:
- Lakeview: `aerial.jpg` is the cover
- Etno Dim: `43615.jpg.webp` is the cover

---

## Correct `construction.ts` Data

**Verified from filesystem — exact file counts and naming pattern:**

```typescript
// src/data/construction.ts
export const constructionLog: ConstructionMonth[] = [
  {
    key: 'mar-2026',
    label: 'Березень 2026',
    yearMonth: '2026-03',
    teaserPhotos: ['mar-01.jpg', 'mar-05.jpg', 'mar-10.jpg'],  // 3 curated; adjust to taste
    photos: [
      { file: 'mar-01.jpg', alt: 'Будівельний майданчик, березень 2026' },
      { file: 'mar-02.jpg', alt: 'Будівельний майданчик, березень 2026' },
      // ... through mar-15.jpg (15 files total)
    ],
  },
  {
    key: 'feb-2026',
    label: 'Лютий 2026',
    yearMonth: '2026-02',
    photos: [
      { file: 'feb-01.jpg', alt: 'Будівельний майданчик, лютий 2026' },
      // ... through feb-12.jpg (12 files total)
    ],
  },
  {
    key: 'jan-2026',
    label: 'Січень 2026',
    yearMonth: '2026-01',
    photos: [
      { file: 'jan-01.jpg', alt: 'Будівельний майданчик, січень 2026' },
      // ... through jan-11.jpg (11 files total)
    ],
  },
  {
    key: 'dec-2025',
    label: 'Грудень 2025',
    yearMonth: '2025-12',
    photos: [
      { file: 'dec-01.jpg', alt: 'Будівельний майданчик, грудень 2025' },
      // ... through dec-12.jpg (12 files total)
    ],
  },
];

export const latestMonth = () => constructionLog[0];
```

`list-construction.ts` should print these arrays as TS literal to allow the author to paste them directly.

---

## Architecture Patterns

### Module Hierarchy

```
src/
├── data/
│   ├── types.ts           # ONLY place for interface/type declarations (Project, Stage, Presentation, ConstructionMonth)
│   ├── projects.ts        # 5 canonical records + derived views
│   ├── projects.fixtures.ts  # 10 synthetic records for dev/QA only
│   └── construction.ts    # 4 months × photos[]
├── content/
│   ├── methodology.ts     # methodologyBlocks: MethodologyBlock[]
│   ├── values.ts          # brandValues: {title, body}[]
│   ├── company.ts         # legalName, edrpou, licenseDate, licenseNote, email, socials
│   └── placeholders.ts    # phone, address, pipeline4Title, etnoDimAddress
├── lib/
│   └── assetUrl.ts        # renderUrl(), constructionUrl(), assetUrl()
scripts/
├── copy-renders.ts        # prebuild + predev hook
├── check-brand.ts         # postbuild + CI step
└── list-construction.ts   # manual helper (npm run list:construction)
```

### Named exports over default exports

All `src/data/*.ts` and `src/content/*.ts` use named exports:
```typescript
export const projects: Project[] = [...];          // not: export default [...]
export const flagship = ...;                        // not: export default flagship
export const methodologyBlocks: MethodologyBlock[] = [...];
```
Rationale: grep/refactor easier; prevents rename-at-import aliasing; IDEs navigate to declaration directly.

### Doc-block requirement (D-34)

Every `src/data/*.ts` and `src/content/*.ts` file starts with:
```typescript
/**
 * @module data/projects
 * @rule IMPORT BOUNDARY: This module may only be imported from src/pages/ and
 *   src/components/sections/. It must never import React, motion, components,
 *   or hooks. Data modules are pure TypeScript.
 */
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript runner for scripts | Custom babel/esbuild setup | `tsx@^4.21.0` | 1-line install, ESM-compatible, no config |
| Hex color extraction from CSS | Custom CSS parser | Literal const array in check-brand.ts | CSS parser adds complexity; `@theme` is stable |
| Import boundary enforcement | ESLint `no-restricted-paths` | `grep` shell-out in check-brand.ts | ESLint rejected for MVP per STACK.md; grep is sufficient |
| Ukrainian locale date formatting | `date-fns` / `dayjs` | `new Intl.DateTimeFormat('uk-UA', {month:'long', year:'numeric'})` | Zero deps, native Cyrillic |

---

## Common Pitfalls

### Pitfall A: Using ARCHITECTURE Q2 lakeview filenames verbatim

**What goes wrong:** `projects.ts` lists `renders: ['aerial.webp', '02.webp', '03.webp']`. After copy-renders runs, `public/renders/lakeview/aerial.jpg` exists but `aerial.webp` does not. Phase 3 `<img src={renderUrl('lakeview', 'aerial.webp')}>` returns 404.
**Root cause:** ARCHITECTURE.md Q2 has wrong filenames (`.webp` when actual files are `.jpg`).
**Prevention:** Use exact filenames from filesystem inventory above. `renders[0]` for lakeview = `'aerial.jpg'`.

### Pitfall B: .DS_Store in dist/

**What goes wrong:** macOS dev machine has `.DS_Store` in `renders/`. `cpSync` copies it to `public/renders/`. Vite copies `public/` to `dist/`. `dist/renders/.DS_Store` ships in artifact.
**Root cause:** `cpSync` without filter includes all files.
**Prevention:** Add `filter: (src) => !src.endsWith('.DS_Store')` to all `cpSync` calls in `copy-renders.ts`.

### Pitfall C: tsx missing = predev/prebuild fails silently

**What goes wrong:** Developer runs `npm run dev` and gets `sh: tsx: command not found`. No renders copied. Phase 3/4 images all 404.
**Root cause:** `tsx` not in package.json devDependencies.
**Prevention:** `npm install -D tsx@^4.21.0` as part of Phase 2 commit 1.

### Pitfall D: paletteWhitelist false-positive from brand-assets SVGs

**What goes wrong:** `brand-assets/logo/black.svg` contains `#2a3038` (old prototype color). If paletteWhitelist() accidentally scans `brand-assets/`, it fails on every build.
**Root cause:** Scope creep in grep pattern.
**Prevention:** D-26 explicitly scopes to `src/**/*.{ts,tsx,css}`. The grep command must use `src/` not the repo root. `brand-assets/` sits outside `src/` — grep with `src/` argument won't touch it.

### Pitfall E: postbuild check-brand scanning empty dist/

**What goes wrong:** If `vite build` fails partway through, `dist/` may be partially populated or empty. `check-brand.ts` runs `postbuild`, greps `dist/`, finds nothing (empty dir), reports PASS. False pass.
**Root cause:** Vite build failure + postbuild still runs if exit code is ambiguous.
**Prevention:** The `build` script is `tsc --noEmit && vite build` — if `tsc` or `vite build` fails, npm stops before `postbuild`. This is correct npm lifecycle behavior. No additional guard needed.

### Pitfall F: `content/` folder divergence from ARCHITECTURE.md

ARCHITECTURE.md §2 placed everything in `data/`. CONTEXT.md D-15 overrides: `src/content/` holds editorial copy, `src/data/` holds structured domain records. The planner must NOT follow the ARCHITECTURE §2 folder structure for content modules — use CONTEXT.md D-15 which supersedes it.

---

## Code Examples

### copy-renders.ts (ARCHITECTURE Q8 + .DS_Store fix)

```typescript
// scripts/copy-renders.ts — pre-build: translit + copy /renders /construction into /public
// @rule: no npm deps; uses only node:fs + node:path
import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'renders');
const DST = join(ROOT, 'public/renders');

const FILTER = (src: string) => !src.endsWith('.DS_Store');

// mapping: source folder → translit destination slug
const MAP: Record<string, string> = {
  'likeview':                 'lakeview',              // fixes misspelling
  'ЖК Етно Дім':              'etno-dim',
  'ЖК Маєток Винниківський':  'maietok-vynnykivskyi',
  'Дохідний дім NTEREST':     'nterest',
};

if (existsSync(DST)) rmSync(DST, { recursive: true });
mkdirSync(DST, { recursive: true });

for (const [src, dst] of Object.entries(MAP)) {
  const from = join(SRC, src);
  const to = join(DST, dst);
  if (!existsSync(from)) { console.warn(`[copy-renders] missing: ${from}`); continue; }
  cpSync(from, to, { recursive: true, filter: FILTER });
  console.log(`[copy-renders] ${src} → ${dst}`);
}

// Construction (names already ASCII) — copy 4 months, skip _social-covers
const CSRC = join(ROOT, 'construction');
const CDST = join(ROOT, 'public/construction');
if (existsSync(CDST)) rmSync(CDST, { recursive: true });
mkdirSync(CDST, { recursive: true });

for (const m of ['dec-2025', 'jan-2026', 'feb-2026', 'mar-2026']) {
  const from = join(CSRC, m);
  if (!existsSync(from)) { console.warn(`[copy-renders] missing construction: ${from}`); continue; }
  cpSync(from, join(CDST, m), { recursive: true, filter: FILTER });
}
console.log('[copy-renders] construction done — _social-covers skipped per CONCEPT §7.9');
```

### check-brand.ts structure

```typescript
// scripts/check-brand.ts — brand invariant CI guard
// @rule: no npm deps; uses only node:child_process + node:fs
import { execSync } from 'node:child_process';

function run(cmd: string): string {
  return execSync(cmd + ' || true', { encoding: 'utf8' });
}

function denylistTerms(): boolean {
  const out = run(
    'grep -rn --include="*.html" --include="*.js" --include="*.css" --include="*.ts" --include="*.tsx"' +
    ' -E "Pictorial|Rubikon|Пикторіал|Рубікон" dist/ src/'
  );
  if (out.trim()) { console.error('[check-brand] FAIL denylistTerms:\n' + out); return false; }
  console.log('[check-brand] PASS denylistTerms');
  return true;
}

function paletteWhitelist(): boolean {
  const ALLOWED = ['#2F3640', '#C1F33D', '#F5F7FA', '#A7AFBC', '#3D3B43', '#020A0A'];
  // Extract all hexes from src/, then filter out allowed ones (case-insensitive)
  const allHexes = run(
    "grep -rEoh '#[0-9A-Fa-f]{3,6}' src/ --include='*.ts' --include='*.tsx' --include='*.css'"
  ).split('\n').filter(Boolean);
  const violations = allHexes.filter(h =>
    !ALLOWED.some(a => a.toLowerCase() === h.toLowerCase())
  );
  if (violations.length) {
    console.error('[check-brand] FAIL paletteWhitelist — unexpected hex values:', [...new Set(violations)]);
    return false;
  }
  console.log('[check-brand] PASS paletteWhitelist');
  return true;
}

function placeholderTokens(): boolean {
  const out = run("grep -rn '{{\\|}}\\|TODO\\|FIXME' dist/ --include='*.html' --include='*.js' --include='*.css'");
  if (out.trim()) { console.error('[check-brand] FAIL placeholderTokens:\n' + out); return false; }
  console.log('[check-brand] PASS placeholderTokens');
  return true;
}

function importBoundaries(): boolean {
  let pass = true;
  const checks = [
    {
      label: 'components must not import pages',
      cmd: "grep -rn \"from '.*pages/\\|from \\\".*pages/\" src/components/ --include='*.ts' --include='*.tsx'",
    },
    {
      label: 'data must not import react/motion/components/hooks',
      cmd: "grep -rn \"from 'react'\\|from 'motion\\|from '.*components\\|from '.*hooks\" src/data/ --include='*.ts'",
    },
    {
      label: 'content must not import react/motion/components/pages',
      cmd: "grep -rn \"from 'react'\\|from 'motion\\|from '.*components\\|from '.*pages\" src/content/ --include='*.ts'",
    },
    {
      label: 'components must not contain raw /renders/ or /construction/ paths',
      cmd: "grep -rn \"'/renders/\\|'/construction/\\|\\\"/renders/\\|\\\"/construction/\" src/components/ --include='*.ts' --include='*.tsx'",
    },
    {
      label: 'pages and components must not import fixtures',
      cmd: "grep -rn 'projects\\.fixtures' src/pages/ src/components/ --include='*.ts' --include='*.tsx'",
    },
  ];
  for (const { label, cmd } of checks) {
    const out = run(cmd);
    if (out.trim()) { console.error(`[check-brand] FAIL importBoundaries(${label}):\n` + out); pass = false; }
  }
  if (pass) console.log('[check-brand] PASS importBoundaries');
  return pass;
}

const results = [denylistTerms(), paletteWhitelist(), placeholderTokens(), importBoundaries()];
const passed = results.filter(Boolean).length;
console.log(`[check-brand] ${passed}/${results.length} checks passed`);
if (results.some(r => !r)) process.exit(1);
```

### assetUrl.ts

```typescript
// src/lib/assetUrl.ts
// @rule: no React imports; pure utility module.
// All asset URL construction goes through these helpers to ensure BASE_URL prefix.
// Vite sets import.meta.env.BASE_URL = '/vugoda-website/' in prod, '/' in dev.

const BASE = import.meta.env.BASE_URL;

export const assetUrl = (path: string): string =>
  `${BASE}${path.replace(/^\//, '')}`;

export const renderUrl = (slug: string, file: string): string =>
  `${BASE}renders/${slug}/${file}`;

export const constructionUrl = (month: string, file: string): string =>
  `${BASE}construction/${month}/${file}`;
```

---

## Validation Architecture

Validation architecture is enabled (`workflow.nyquist_validation: true` in `.planning/config.json`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | TypeScript type-check (`tsc --noEmit`) — no test runner (Vitest skipped per STACK.md) |
| Config file | `tsconfig.json` (src/) + `tsconfig.scripts.json` (scripts/ — new, Wave 0) |
| Quick run command | `npm run lint` (covers src/) |
| Scripts type-check | `npx tsc --noEmit -p tsconfig.scripts.json` (manual, post-Phase-2) |
| Full suite command | `npm run build` (includes prebuild + tsc + vite build + postbuild check-brand) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CON-01 | All content in `src/content/*.ts` modules, no JSX literal paragraphs | Static (tsc) + grep | `grep -rn "^\s*['\"].*[А-ЯҐЄІЇа-яґєії].*['\"]" src/components/ src/pages/` | ❌ Wave 0: content modules |
| CON-02 | `projects.ts` exports 5 records; `fixtures.ts` type-checks as `Project[]` | Static (tsc) | `npm run lint` | ❌ Wave 0: data modules |
| ZHK-02 | `findBySlug()` returns only `full-internal`; other slugs → undefined | Static (tsc) + grep | `grep -n "findBySlug" src/data/projects.ts` | ❌ Wave 0: projects.ts |
| QA-04 | CI denylist passes on current src/ and dist/ | Script execution | `npm run build` (triggers postbuild) | ❌ Wave 0: check-brand.ts |

### Sampling Rate

- **Per task commit:** `npm run lint` — type-checks `src/` (fast, ~2s)
- **Per commit that adds scripts:** `npx tsc --noEmit -p tsconfig.scripts.json` (manual)
- **Per wave merge:** `npm run build` — full pipeline including prebuild + postbuild
- **Phase gate:** `npm run build` passes with zero errors before closing Phase 2

### Wave 0 Gaps (files that must be created before tasks can be verified)

- [ ] `scripts/` directory — does not exist yet
- [ ] `tsconfig.scripts.json` — needed for optional script type-check
- [ ] `src/data/types.ts` — Wave 0 foundation for all other data modules
- [ ] `src/data/projects.ts` — required by CON-02, ZHK-02
- [ ] `src/data/projects.fixtures.ts` — required by CON-02
- [ ] `src/data/construction.ts` — required by CON-01
- [ ] `src/content/methodology.ts` — required by CON-01
- [ ] `src/content/values.ts` — required by CON-01
- [ ] `src/content/company.ts` — required by CON-01
- [ ] `src/content/placeholders.ts` — required by CON-01
- [ ] `src/lib/assetUrl.ts` — required by D-30/D-31
- [ ] `scripts/copy-renders.ts` — required by success criterion 2
- [ ] `scripts/check-brand.ts` — required by QA-04
- [ ] `scripts/list-construction.ts` — required by D-21
- [ ] `tsx` in devDependencies — required for all script execution

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scripts | ✓ | v25.9.0 (local) / v20 (CI) | — |
| `tsx` | `scripts/*.ts` execution | ✗ | — (not installed) | Must install: `npm install -D tsx@^4.21.0` |
| `node:fs` `cpSync` | `copy-renders.ts` | ✓ | Node 16.7+ (present on both) | — |
| `grep` (GNU) | `check-brand.ts` | ✓ | ubuntu-latest standard | — |
| `grep` (macOS BSD) | `check-brand.ts` local | ✓ | macOS standard (BSD grep differs slightly from GNU) | Use `|| true` pattern to handle exit code differences |

**Missing dependencies with no fallback:**
- `tsx` — blocks ALL script execution; must be installed in Wave 0

**Missing dependencies with fallback:**
- None

**BSD vs GNU grep note:** macOS ships BSD grep, ubuntu-latest ships GNU grep. The `|| true` pattern (`execSync(cmd + ' || true')`) handles the exit-code difference. Regex pattern `"Pictorial|Rubikon"` with `-E` flag works identically on both.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|-----------------|-------|
| `ts-node` for script execution | `tsx` | tsx is faster (no typecheck), ESM-compatible, no tsconfig needed |
| `cp -r` in npm scripts | `node:fs cpSync` | Same-process, no child spawn, portable |
| ESLint `import/no-restricted-paths` | `grep`-based CI check | Simpler for MVP; ESLint explicitly rejected per STACK.md |

---

## Open Questions

1. **`pipeline4Title` location: `placeholders.ts` vs `projects.ts`**
   - What we know: D-06 says title comes from `content/placeholders.ts#pipeline4Title`. D-01 says projects.ts implements ARCHITECTURE Q2 which has `title: 'Без назви'` directly in the project record.
   - What's unclear: Should `projects.ts` import from `placeholders.ts`? This creates a `data/` → `content/` import. Or should `projects.ts` hard-code `'Без назви'` with a comment pointing to `placeholders.ts` as the canonical value?
   - Recommendation: Hard-code `title: 'Без назви'` in `projects.ts` with a comment: `// placeholder per placeholders.ts#pipeline4Title — update both when client confirms`. This avoids a cross-module import in the data layer that violates boundary simplicity. The `placeholders.ts` version is the client-facing audit surface; `projects.ts` holds the runtime value.

2. **MinimalCube.tsx vs IsometricCube.tsx naming**
   - What we know: Phase 1 created `src/components/brand/MinimalCube.tsx` as a stub. Phase 3 will replace/extend it with full `<IsometricCube variant>` per VIS-03. Phase 2 should NOT touch MinimalCube.
   - What's unclear: check-brand.ts `importBoundaries()` scans `src/components/` for raw hex literals. MinimalCube.tsx already has `stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D'` — these are in the TypeScript type annotation (not a CSS hex literal) but `grep -oE '#[0-9A-Fa-f]{3,6}'` will match them. These ARE in the whitelist, so `paletteWhitelist()` should PASS. Confirmed: all three are canonical palette colors.
   - Recommendation: No action needed; existing MinimalCube.tsx hexes are all whitelist-compliant.

3. **`teaserPhotos` selection for mar-2026**
   - What we know: D-22 says `teaserPhotos: string[]` is a curated array of 3–5 filenames. Phase 2 populates it for `latestMonth()`.
   - What's unclear: which 3–5 of the 15 mar-2026 files are the "best" for the homepage teaser?
   - Recommendation: Phase 2 defaults to `['mar-01.jpg', 'mar-05.jpg', 'mar-10.jpg', 'mar-12.jpg', 'mar-15.jpg']` (5 evenly spaced) with a comment: `// curate these 3-5 files before client handoff`. Marketing swap = one-PR change per D-22.

---

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** Vite 6 + React 19 + Tailwind v4 + Motion + HashRouter — no alternatives
- **6-color palette only:** `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A` — CI blocks any deviation
- **Montserrat only, 3 weights** (400/500/700)
- **Rendering source = `/renders/` ONLY** — legacy `вигода-—-системний-девелопмент/Рендера/` forbidden
- **No CMS in v1** — all content hardcoded in TS modules
- **No ESLint** — boundary enforcement via grep scripts only
- **Skeptic-pass rule** — before quoting inherited content, verify source file says what the reference claims
- **`tsx`** is the script runner (confirmed by STACK.md)
- **`sharp`** is NOT needed in Phase 2 — copy-renders.ts copies files verbatim; no image transformation
- **Desktop-first** — no mobile, no responsive work in Phase 2
- **No `import.meta.glob`** for `/public/` contents — breaks `<img src>` Vite hashing
- **GSD workflow enforcement** — all edits via `gsd:execute-phase`, not direct file edits

---

## Sources

### Primary (HIGH confidence)
- Filesystem inspection (`find`, `ls`) — verified render folder contents, file counts, extensions, naming patterns — 2026-04-24
- `/Users/admin/Documents/Проєкти/vugoda-website/package.json` — confirmed tsx absent, scripts shape, existing devDeps
- `/Users/admin/Documents/Проєкти/vugoda-website/tsconfig.json` — confirmed `"include": ["src"]` only
- `/Users/admin/Documents/Проєкти/vugoda-website/.github/workflows/deploy.yml` — confirmed Phase 1 state, insertion point for check-brand step
- `/Users/admin/Documents/Проєкти/vugoda-website/src/index.css` — confirmed `@theme` hexes (all 6 canonical, uppercase)
- `node -e "require('node:fs').cpSync(...)"` — confirmed cpSync availability + filter option on Node 25.9
- `grep exit code test` — confirmed exit 0 on match, exit 1 on no-match behavior
- `npm view tsx version` — confirmed current version 4.21.0

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md §3 Q2, Q6, Q8` — schema + construction shape + copy script (ARCHITECTURE.md Q2 has wrong lakeview filenames — corrected by filesystem verification)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` — 34 locked decisions (authoritative for Phase 2 scope)
- `.planning/research/STACK.md` — ESLint skip, tsx confirmation, testing posture

### Tertiary (used for context, not critical findings)
- `.planning/research/PITFALLS.md §7, §10, §11, §12` — pitfall rationale for decisions already locked
- `brand-system.md §3` — palette hexes (cross-reference for paletteWhitelist const)

---

## Metadata

**Confidence breakdown:**
- Filesystem inventory: HIGH — directly verified
- Package.json gaps (tsx missing): HIGH — directly verified
- Script edge cases (cpSync filter, .DS_Store): HIGH — verified via Node.js execution
- CI grep patterns: HIGH — verified exit code behavior + grep syntax
- tsconfig scripts coverage: HIGH — verified via file inspection
- deploy.yml insertion: HIGH — verified current state and pattern
- Validation architecture: HIGH — nyquist_validation=true confirmed in config.json

**Research date:** 2026-04-24
**Valid until:** 2026-07-24 (stable domain — TypeScript data modules, Node.js fs, grep; no fast-moving APIs)
