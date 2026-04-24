---
phase: 02-data-layer-content
verified: 2026-04-24T19:33:46Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 2: Data Layer & Content — Verification Report

**Phase Goal:** All project data, construction log, methodology copy, company facts, and brand-rule enforcement exist as typed modules + CI guards — pages can consume without re-deciding content shape.

**Verified:** 2026-04-24T19:33:46Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
| - | ----- | ------ | -------- |
| 1 | `src/data/projects.ts` exports 5 canonical projects with discriminated `presentation` union; adding a 6th ЖК is a one-record PR (verified via 10-synthetic `projects.fixtures.ts`) | VERIFIED | Runtime: `projects.length === 5`, flagship/pipelineGridProjects/aggregateProjects/detailPageProjects cardinalities 1/3/1/1; fixtures.length === 10 with all 4 Stage buckets + all 4 Presentation variants covered |
| 2 | `scripts/copy-renders.ts` transliterates 4 Cyrillic `/renders/` folders into `public/renders/{slug}/` and copies 4 construction months verbatim; `prebuild` hook wires it into `npm run build` | VERIFIED | `npm run prebuild` completes clean; `public/renders/{lakeview,etno-dim,maietok-vynnykivskyi,nterest}/` = 7/8/2/3 files; `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/` = 12/11/12/15 files; `_social-covers/` absent; 0 `.DS_Store` in public/; prebuild is present in `package.json` scripts |
| 3 | CI denylist script fails the build when forbidden terms / palette outliers / `{{` / `TODO` appear | VERIFIED | `npm run build` full pipeline exits 0 with `[check-brand] 4/4 checks passed`; postbuild hook chains check-brand; deploy.yml has named "Check brand invariants" step before artifact upload; standalone `npx tsx scripts/check-brand.ts` also 4/4 |
| 4 | All user-facing copy lives in `src/content/*.ts` with ⚠-flags on methodology blocks 2/5/6; placeholders use `—` (U+2014) not `{{token}}` | VERIFIED | `src/content/{methodology,values,company,placeholders}.ts` all present; methodologyBlocks.length === 7 with needsVerification on indexes [2,5,6]; brandValues.length === 4 in canonical order (Системність/Доцільність/Надійність/Довгострокова цінність); company exports legalName + edrpou (42016395) + licenseDate (27.12.2019) + licenseNote + email + socials; placeholders use charCode 8212 (U+2014); zero `{{` / `}}` in placeholders.ts |
| 5 | Page-to-data import boundary holds: components/↛pages/, data/ and content/ have no React/motion imports; `lib/assetUrl.ts` is the single URL-prefix helper | VERIFIED | `importBoundaries()` in check-brand passes all 5 sub-rules on current code; manual grep `from ['\"]react` against src/data/ + src/lib/ + src/content/ returns empty; `assetUrl.ts` wraps `import.meta.env.BASE_URL` once via 3 helpers (assetUrl/renderUrl/constructionUrl) |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/data/types.ts` | 7 named type exports (Stage, Presentation, Project, ConstructionPhoto, ConstructionMonth, MethodologyBlock, BrandValue) | VERIFIED | 105 lines; all 7 type exports present with JSDoc; zero runtime exports; zero imports (types-only leaf) |
| `src/lib/assetUrl.ts` | 3 BASE_URL-safe helpers | VERIFIED | 38 lines; `assetUrl`, `renderUrl`, `constructionUrl` all reference `import.meta.env.BASE_URL` via module-level `const BASE`; zero React/motion imports |
| `tsconfig.scripts.json` | Node-only scoped to scripts/ | VERIFIED | `include: ["scripts/**/*.ts"]`; `lib: ["ES2022"]`, `types: ["node"]`; does NOT extend root tsconfig |
| `src/data/projects.ts` | 5 canonical records + 5 derived views | VERIFIED | slugs [lakeview, etno-dim, maietok-vynnykivskyi, nterest, pipeline-4]; orders 1..5; presentations cover all 4 variants; Lakeview uses verified 7 .jpg filenames (not .webp); findBySlug gates on `full-internal` per D-04 |
| `src/data/projects.fixtures.ts` | 10 synthetic records covering scale-to-N | VERIFIED | 10 records; stages {u-rozrakhunku:3, u-pogodzhenni:2, buduetsya:2, zdano:3}; presentations {aggregate:1, grid-only:6, full-internal:2, flagship-external:1}; renders:[] for all; standalone module (no import from projects.ts) |
| `src/data/construction.ts` | constructionLog + latestMonth | VERIFIED | 4 months reverse-chronological; photo counts 15/12/11/12 = 50 total; `latestMonth().key === 'mar-2026'` with 5 teaserPhotos; siblings have no teaserPhotos |
| `scripts/copy-renders.ts` | translit + copy with DS_Store filter | VERIFIED | 81 lines; uses `fileURLToPath(new URL('..', import.meta.url))` for Cyrillic-path safety; RENDER_MAP covers all 4 source folders; `.DS_Store` filter; `_social-covers` never named for copy |
| `scripts/list-construction.ts` | Manual TS-literal inventory printer | VERIFIED | Uses same fileURLToPath pattern; emits `photos: [...]` snippets per month with UA alt default |
| `scripts/check-brand.ts` | 4 check functions + aggregate exit | VERIFIED | 195 lines; denylistTerms/paletteWhitelist/placeholderTokens/importBoundaries all present; PALETTE_WHITELIST = 6 canonical hexes; paired `\\{\\{[^}]*\\}\\}` regex prevents minifier false-positives |
| `src/content/methodology.ts` | 7 MethodologyBlock records | VERIFIED | indexes 1..7 in order; needsVerification true on [2,5,6]; bodies verbatim from CONCEPT §8 |
| `src/content/values.ts` | 4 BrandValue records | VERIFIED | Системність / Доцільність / Надійність / Довгострокова цінність in canonical order |
| `src/content/company.ts` | legal facts + socials scaffold | VERIFIED | legalName, edrpou (42016395), licenseDate (27.12.2019), licenseNote, email, socials{telegram/instagram/facebook → '#'} |
| `src/content/placeholders.ts` | em-dash audit surface | VERIFIED | phone/address/etnoDimAddress = em-dash U+2014; pipeline4Title = «Без назви»; zero `{{` or `}}` |
| `package.json` | predev/prebuild/postbuild/list:construction scripts | VERIFIED | All 4 scripts present; tsx@^4.21.0 in devDependencies; build chains tsc → vite → check-brand |
| `.github/workflows/deploy.yml` | Check brand invariants step | VERIFIED | Named step between `npm run build` and `actions/upload-pages-artifact@v3`; runs `npx tsx scripts/check-brand.ts` |
| `.gitignore` | Generated assets + dist ignored | VERIFIED | dist/, node_modules/, public/renders/, public/construction/, .DS_Store all listed; `git check-ignore` confirms all three paths |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `src/lib/assetUrl.ts` | `import.meta.env.BASE_URL` | module-level const | WIRED | `const BASE = import.meta.env.BASE_URL` at line 12; all 3 helpers use `${BASE}` template |
| `src/data/projects.ts` | `src/data/types.ts` | type import | WIRED | `import type { Project } from './types'` at line 13 |
| `src/data/projects.fixtures.ts` | `src/data/types.ts` | type import | WIRED | `import type { Project } from './types'` at line 18 |
| `src/data/construction.ts` | `src/data/types.ts` | type import | WIRED | `import type { ConstructionMonth } from './types'` |
| `src/content/methodology.ts` | `src/data/types.ts` | type-only import | WIRED | `import type { MethodologyBlock } from '../data/types'` |
| `src/content/values.ts` | `src/data/types.ts` | type-only import | WIRED | `import type { BrandValue } from '../data/types'` |
| `package.json` | `scripts/copy-renders.ts` | prebuild + predev hooks | WIRED | Both scripts run `tsx scripts/copy-renders.ts` |
| `package.json` | `scripts/check-brand.ts` | postbuild hook | WIRED | `"postbuild": "tsx scripts/check-brand.ts"` |
| `.github/workflows/deploy.yml` | `scripts/check-brand.ts` | named GH Actions step | WIRED | `npx tsx scripts/check-brand.ts` runs before `upload-pages-artifact@v3` |
| `scripts/copy-renders.ts` | `/renders/` + `/construction/` source trees | cpSync with DS_Store filter | WIRED | Runtime verified: 20 render files + 50 construction files produced in public/; 0 .DS_Store |

### Data-Flow Trace (Level 4)

Not applicable — Phase 2 ships typed data modules and CI guards, not UI components that render dynamic data. Data flow into pages/components will be verified in Phase 3/4 when consumers are built. Runtime invariant checks (32 assertions via `npx tsx -e`) confirmed every exported value produces the expected shape.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| `npm run lint` exits 0 | `tsc --noEmit` | exit 0, no output | PASS |
| `npm run prebuild` produces correct tree | `tsx scripts/copy-renders.ts` + `find public/ -type f` | 20 renders + 50 construction; 0 .DS_Store; `_social-covers` absent | PASS |
| `npm run build` full pipeline exits 0 | prebuild → tsc → vite build → postbuild | exit 0; `[check-brand] 4/4 checks passed`; dist/index-\*.js 242.85KB (gzip 76.85KB) | PASS |
| `npx tsx scripts/check-brand.ts` standalone | 4-check invariant scan | 4/4 PASS | PASS |
| `grep -rE "#[0-9A-Fa-f]{6}" src/` ⊆ 6 canonicals | repo-wide hex extraction | Only 6 brand hexes present; all in `src/index.css` @theme + 2 prop-type annotations in `MinimalCube.tsx` (#A7AFBC, #F5F7FA, #C1F33D all canonical) | PASS |
| 32 runtime invariants via `npx tsx -e` | Import all 10 modules, assert counts/keys/codes | All 32 assertions match expected values (projects.length, flagship.slug, pipelineGrid order, findBySlug gate, fixtures distribution, constructionLog months, teaserPhotos, methodologyBlocks verification flags, brandValues titles, company consts, placeholder em-dash charCodes) | PASS |
| Prebuild is idempotent | Re-run `npm run prebuild` | File counts unchanged (20 + 50); no duplicate/orphan files | PASS |
| `.gitignore` covers generated assets | `git check-ignore` on public/renders, public/construction, dist | All 3 paths reported as ignored | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| **CON-01** | 02-03, 02-04 | Editorial copy via src/content/*.ts; methodology §8 with ⚠ flags on 2/5/6 | SATISFIED | All 4 content modules present; methodologyBlocks indexes 1..7 with needsVerification on [2,5,6]; bodies verbatim from CONCEPT §8; zero Ukrainian paragraphs in JSX (no components yet; boundary enforced for Phase 3+) |
| **CON-02** | 02-01, 02-02, 02-03 | Typed `projects.ts` with Project interface + discriminated presentation union; `projects.fixtures.ts` with 10 synthetic ЖК | SATISFIED | types.ts defines Project interface + Stage + Presentation unions; projects.ts exports 5 records + 5 derived views; fixtures.ts exports 10 Project[] decoupled from projects.ts |
| **ZHK-02** | 02-01, 02-02 | Template scalable — ЖК #6 = one record append; discriminated `presentation` union; Маєток/NTEREST as grid-only in v1 | SATISFIED | Presentation union = 4 literals; findBySlug gates on `full-internal` per D-04; Маєток (order 3) + NTEREST (order 4) = `grid-only`; fixtures.ts proves scale-to-N by rendering 10 synthetics with all variants |
| **QA-04** | 02-05 | CI denylist for Pictorial/Rubikon, 6-hex palette, {{/TODO in dist/ | SATISFIED | scripts/check-brand.ts runs 4 checks with aggregate exit; postbuild wiring + deploy.yml step; 4/4 PASS on current code; forge-and-remove regression tests in SUMMARY prove checks actually catch violations |

All 4 declared requirements for Phase 2 are SATISFIED on disk. No orphaned requirements (REQUIREMENTS.md maps exactly CON-01, CON-02, ZHK-02, QA-04 to Phase 2, matching what plans claim).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `src/data/construction.ts` | 27 | `TODO: review with client before handoff` comment on teaserPhotos curation | Info | Expected — flagged for client handoff per SUMMARY. Does NOT leak into `dist/` because check-brand placeholderTokens scopes to dist/ only (src/ TODOs are legal per D-27). |
| `src/data/projects.ts` | 92 | comment says "placeholder per placeholders.ts#pipeline4Title" | Info | Intentional audit-surface discoverability marker; not a stub. The data value «Без назви» is the actual decided fallback per CONCEPT §11.3. |

No blocker or warning-level anti-patterns. All "TODO" / "placeholder" occurrences in src/ are:
1. Legitimate dev-facing comments about pending client confirmations (CONCEPT §11)
2. Scoped to `src/` (not `dist/`) where check-brand correctly allows them per D-27

No stubs, no dead code, no empty implementations.

### Advisory Notes (Acceptance-Criteria Grep Mismatches — Non-Defects)

The 5 plan SUMMARYs collectively documented 5 benign off-by-one grep mismatches where the plan's own acceptance-criteria count differed from the actual code. Runtime behavior verified correct in every case:

1. **Plan 02-01:** `grep -c "'flagship-external'" src/data/types.ts` expected 1, actual 2 (union literal + JSDoc reference on `Project.externalUrl`). Behavior correct.
2. **Plan 02-01:** `grep -c "import.meta.env.BASE_URL" src/lib/assetUrl.ts` expected 1, actual 2 (runtime const + doc-block reference). Behavior correct.
3. **Plan 02-02:** `grep -c "presentation === 'full-internal'" src/data/projects.ts` expected 2, actual 3 (pipelineGridProjects filter + detailPageProjects + findBySlug). Behavior correct — runtime invariant check confirmed findBySlug gate, detailPageProjects.length === 1, pipelineGridProjects includes etno-dim.
4. **Plan 02-02:** `grep -c "Fixture ЖК #" src/data/projects.fixtures.ts` expected 10, actual 11 (10 records + 1 doc-block self-reference). Behavior correct — all 10 fixture titles carry the prefix.
5. **Plan 02-05:** Placeholder-token regex tightened from bare `\{\{|\}\}` to paired `\{\{[^}]*\}\}` to avoid 318 false-positives from minified JS `}}` closings. Strict improvement, not a defect.

All 5 mismatches were spec oversights in plan acceptance counts, not code defects. Every produced file is functionally correct per the underlying must-haves.

### Human Verification Required

None. Phase 2 ships typed data modules, pre/postbuild scripts, and a CI guard. Every artifact is programmatically testable and verified on disk. No visual / UX / real-time behavior to inspect.

Future phases (Phase 3/4) will consume these modules into UI components that will require visual QA — but that's their scope, not Phase 2's.

### Gaps Summary

No gaps. All 5 Success Criteria from ROADMAP.md are verified by actual code on disk and confirmed by full-pipeline build (`npm run build` exits 0 with 4/4 check-brand PASS). All 4 declared requirements (CON-01, CON-02, ZHK-02, QA-04) are SATISFIED.

The Phase 2 goal — "All project data, construction log, methodology copy, company facts, and brand-rule enforcement exist as typed modules + CI guards — pages can consume without re-deciding content shape" — is achieved. Phase 3 can begin importing from `src/data/projects.ts`, `src/data/construction.ts`, and `src/content/*` without re-deciding any content shape; check-brand will catch any palette / displacement / placeholder regression at build-time.

---

*Verified: 2026-04-24T19:33:46Z*
*Verifier: Claude (gsd-verifier)*
