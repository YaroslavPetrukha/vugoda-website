# Phase 2: Data Layer & Content — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Typed TS modules for all project data, construction log, methodology copy, company facts, and placeholder values — plus CI guards that enforce brand-rule invariants on every build. Pages and components consume these modules without re-deciding content shape. No page UI, no sections, no component work beyond `<RouterLink>`-level integration. Single-pass work; downstream phases (3–4) inherit the data surface wholesale.

Explicit phase-scope clarifications (authorised during discussion):

- Fixtures file authored in Phase 2; `/dev/grid` rendering proof deferred to Phase 4 (when `PipelineGrid` component naturally lands). Phase 2's scale-to-N signal is that `projects.fixtures.ts` type-checks as `Project[]`.
- `src/content/` holds editorial copy (methodology, values, company facts, placeholders). `src/data/` holds structured domain records (projects, construction log). This overrides ARCHITECTURE §2 — which used `data/` for everything — per ROADMAP Phase 2 Success Criterion #4.
- `scripts/check-brand.ts` lands in Phase 2 and wires into both local `postbuild` and a dedicated GitHub Actions job. Phase 1's `.github/workflows/deploy.yml` gets a `check-brand` step inserted before upload-artifact.

</domain>

<decisions>
## Implementation Decisions

### Data schema (projects.ts)

- **D-01:** Data schema **inherits verbatim from `.planning/research/ARCHITECTURE.md §3 Q2`** — `Project` interface + `Stage` union (`u-rozrakhunku` · `u-pogodzhenni` · `buduetsya` · `zdano`) + `Presentation` union (`flagship-external` · `full-internal` · `grid-only` · `aggregate`) + 5 canonical records + derived views (`flagship`, `pipelineGridProjects`, `aggregateProjects`, `detailPageProjects`, `findBySlug`). Planner does NOT re-decide the shape; planner implements it.
- **D-02:** `src/data/types.ts` is the only module with interface/type declarations. `projects.ts` imports types and exports records + derived views. No inlined interface re-declarations.
- **D-03:** Project ordering: explicit numeric `order: 1..5` field per ARCHITECTURE Q2. Derived views sort by `order` ascending. Adding ЖК #6 = append record with `order: 6`; no timestamp guessing, no stage-bucket-implied order.
- **D-04:** `findBySlug()` returns only `presentation: 'full-internal'` records. Visiting `/zhk/lakeview` → `<Navigate to={flagship.externalUrl} replace />`. Visiting `/zhk/pipeline-4` or `/zhk/maietok-vynnykivskyi` → `<Navigate to="/projects" replace />`. Per Pitfall 7.
- **D-05:** Slugs locked: `lakeview` (fixes `likeview` misspell), `etno-dim`, `maietok-vynnykivskyi`, `nterest`, `pipeline-4`. Slug MUST equal the translit folder name in `public/renders/{slug}/`.
- **D-06:** Pipeline-4 aggregate copy ships verbatim from ARCHITECTURE Q2: `«+1 об'єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.»`. Title renders from `content/placeholders.ts#pipeline4Title` = `«Без назви»` (commits §11.3 default, audit-visible).

### Fixtures (projects.fixtures.ts) — CON-02

- **D-07:** Phase 2 authors `src/data/projects.fixtures.ts` — 10 synthetic ЖК spanning all 4 Model-Б buckets (minimum 2 per bucket; one bucket intentionally gets 3+ to stress orphan-grid behaviour). Records use obviously-synthetic titles (`Fixture ЖК #1`…`#10`) and empty `renders: []`. Never imported in production build.
- **D-08:** Phase 2 scale-to-N signal = the fixture file type-checks as `Project[]` against `src/data/types.ts` (enforced via `tsc --noEmit` as part of Phase 1's `lint` npm script). Visual `/dev/grid` rendering proof is Phase 4's responsibility, wired when `PipelineGrid` component exists.
- **D-09:** `import.meta.env.PROD` guard on any accidental fixture import — but the policy is simpler: fixtures are NEVER imported by `src/pages/` or `src/components/sections/`. Only Phase 4's `/dev/grid` route (when it exists) and any future Vitest suites may import them. Enforced by CI grep (see D-22).

### Translit script (copy-renders.ts)

- **D-10:** `scripts/copy-renders.ts` ships verbatim from ARCHITECTURE Q8 code block. Uses `node:fs` + `node:path` (no extra deps). Translit map: `likeview→lakeview`, `ЖК Етно Дім→etno-dim`, `ЖК Маєток Винниківський→maietok-vynnykivskyi`, `Дохідний дім NTEREST→nterest`.
- **D-11:** Construction months (`dec-2025`, `jan-2026`, `feb-2026`, `mar-2026`) are already ASCII and copied verbatim to `public/construction/{month}/`. `_social-covers/` folder explicitly skipped (CONCEPT §7.9 + PROJECT.md Out-of-Scope — Lakeview Cormorant typography brand conflict).
- **D-12:** Missing source folder = warning (stderr) but NOT build failure. Rationale: during dev, a render folder might be temporarily missing; build should still produce a deployable site with empty `public/renders/{slug}/` (pages render the `<IsometricCube variant='group'>` empty-state per ARCHITECTURE Anti-Pattern 2).
- **D-13:** Wired as `prebuild` AND `predev` npm scripts (both), per ARCHITECTURE Q8. Executes via `tsx scripts/copy-renders.ts`. `tsx` is added to devDependencies if not already present from Phase 1.
- **D-14:** Script is idempotent: `rmSync(DST, {recursive: true})` before copy so removed renders in source drop out of `public/` on next build.

### Content modules (src/content/)

- **D-15:** Four modules by domain: `src/content/methodology.ts`, `src/content/values.ts`, `src/content/company.ts`, `src/content/placeholders.ts`. NOT a single `content/index.ts`. Scannability > import-count.
- **D-16:** Methodology §8 shape: `export const methodologyBlocks: MethodologyBlock[]` where `MethodologyBlock = { index: 1..7, title: string, body: string, needsVerification: boolean }`. Blocks 2, 5, 6 have `needsVerification: true`. Plain `body: string` (not `Block[]` rich type) — inline emphasis deferred to v2 CMS migration (body → portableText is trivial then).
- **D-17:** `values.ts` exports `brandValues: { title: string; body: string }[]` — 4 records (системність · доцільність · надійність · довгострокова цінність), copy from CONCEPT §2 tone brief + brand-system.md §1.
- **D-18:** `company.ts` exports typed consts: `legalName = 'ТОВ «БК ВИГОДА ГРУП»'`, `edrpou = '42016395'`, `licenseDate = '27.12.2019'`, `licenseNote = '(безстрокова)'`, `email = 'vygoda.sales@gmail.com'`, plus socials scaffold as `socials: { telegram: '#', instagram: '#', facebook: '#' }` (href='#' until launch per CTC-01). NO hard-coded HTML — consumer components format.
- **D-19:** `placeholders.ts` exports named consts: `phone: '—'`, `address: '—'`, `pipeline4Title: 'Без назви'`, `etnoDimAddress: '—'` (CONCEPT §11.8 unconfirmed). One audit surface — client opens one file to see every pending answer. Raw em-dash `—` is the public value; NEVER `{{token}}`.
- **D-20:** Components never contain Ukrainian JSX literal paragraphs. Any string >40 chars or containing the `Системний` / `ВИГОДА` brand-name lives in a `content/` or `data/` module (Pitfall 7 enforcement). Short UI microcopy like button labels («Переглянути проекти») may stay inline per reference in the component to avoid a `content/ui-strings.ts` proliferation trap — judgment call per component.

### Construction log data (construction.ts)

- **D-21:** `src/data/construction.ts` manually authored per-month. Helper `scripts/list-construction.ts` prints each folder's filesystem inventory as TS-literal `{ file, alt: 'Будівельний майданчик, <month UA>' }[]` — dev copy-pastes into `constructionLog` array. Alt-text auto-filled to a default string; captions left `undefined` until hand-authored per CONCEPT §7.9 tone rule («без хвастощів»). `import.meta.glob` explicitly rejected (breaks `<img src>` via Vite hashing).
- **D-22:** `ConstructionMonth` type gets an optional `teaserPhotos: string[]` field — array of filenames (subset of `photos[].file`). Populated only for `latestMonth()` (mar-2026) with 3–5 curated filenames. Homepage `ConstructionTeaser` reads `latestMonth().teaserPhotos` (not `.photos.slice(0,5)`). Marketing controls which shots clients see. One-PR swap.
- **D-23:** Type definition for `ConstructionMonth` moves from inline to `src/data/types.ts` alongside `Project`. Keep all data-layer types in one file.

### CI denylist script (scripts/check-brand.ts) — QA-04

- **D-24:** Single Node script `scripts/check-brand.ts` exports 3 check functions: `denylistTerms()`, `paletteWhitelist()`, `placeholderTokens()`. Uses `node:fs` + `node:child_process` `grep` (or equivalent pure-JS). No npm deps. Exit code is aggregate (any failure → exit 1).
- **D-25:** `denylistTerms()` greps: `Pictorial`, `Rubikon`, `Пикторіал`, `Рубікон` (case-insensitive, word-boundary-aware). Scope: `dist/**` AND `src/**`. Match → fail with filename:line output.
- **D-26:** `paletteWhitelist()` greps `src/**/*.{ts,tsx,css}` for `#[0-9A-Fa-f]{3,6}` patterns. Whitelist: `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A` (case-insensitive). Any other hex → fail. `.planning/**` and `brand-system.md` excluded (design authorship surface, not runtime).
- **D-27:** `placeholderTokens()` greps `dist/**` for `{{`, `}}`, `TODO`, `FIXME`. Match → fail. `src/**` scope explicitly EXCLUDED from TODO-check (dev may use `TODO` comments legitimately); only shipped HTML/JS/CSS is checked.
- **D-28:** Wired in BOTH places: (a) `package.json` `"postbuild": "tsx scripts/check-brand.ts"` runs after `vite build` locally; (b) GitHub Actions `deploy.yml` gains a `check-brand` step BEFORE `upload-pages-artifact` — dedicated CI step prints per-check summary in PR logs. Local + CI = overlapping safety nets.
- **D-29:** Fail mode: exit code 1 → `npm run build` fails locally AND Actions deploy blocks. No warn-only. The point of a denylist is to block deploy; warn-only is theatre.

### Asset URL helpers (lib/assetUrl.ts)

- **D-30:** `src/lib/assetUrl.ts` exports two domain-specific helpers + one private base:
  - `renderUrl(slug: string, file: string): string` → `${BASE_URL}renders/${slug}/${file}`
  - `constructionUrl(month: string, file: string): string` → `${BASE_URL}construction/${month}/${file}`
  - `assetUrl(path: string): string` (private, used by both; also export for edge cases like favicon/OG images but callers should prefer domain helpers).
- **D-31:** Both helpers prepend `import.meta.env.BASE_URL` (which is `/vugoda-website/` in prod and `/` in dev per Phase 1's vite.config). Never hardcode `/renders/…` or `/construction/…` in JSX — always go through a helper. Enforced by CI grep (D-32).

### Import boundary & enforcement

- **D-32:** Boundary rules enforced via README documentation + CI grep checks (no ESLint — aligns with STACK.md "skip ESLint for MVP"):
  - `src/components/` may NOT import from `src/pages/` → CI: `grep -rE "from ['\"].*pages/" src/components/ && exit 1 || true`
  - `src/data/` may NOT import React, `motion`, `src/components/`, `src/hooks/` → CI: grep for `from 'react'`, `from 'motion/react'`, `from '../components'`, `from '../hooks'` in `src/data/`
  - `src/content/` follows same rule as `src/data/` — string/object modules only
  - `src/components/` may NOT contain raw-asset path literals (`/renders/...`, `/construction/...`) → CI grep (forces use of `renderUrl`/`constructionUrl`)
- **D-33:** Boundary grep checks added to `scripts/check-brand.ts` as a 4th check function `importBoundaries()`. Same fail-hard mode. Runs alongside the other 3.
- **D-34:** Per-file doc-block at top of `src/data/*.ts` and `src/content/*.ts` states the import rule in one sentence, so a reader opening the file immediately sees the constraint.

### Claude's Discretion

- Exact glob pattern implementation in `check-brand.ts` (shell-out to `grep` vs pure-JS `fs.readFile` + regex — both fine, grep is ~3× faster but adds a platform assumption). Use `child_process.execSync('grep -rE …')` for MVP; measure at Phase 6 if CI time becomes an issue.
- Whether `scripts/list-construction.ts` runs automatically (dev command) or is manual helper (`npm run list:construction`). Recommended: manual — authoring captions is a thinking task, not an automated refresh.
- Exact synthetic-data field values in `projects.fixtures.ts` (as long as union constraints are satisfied and at least one record exists per `stage` + at least one of each `presentation` variant).
- Whether to pre-bundle `brand-system.md` + `КОНЦЕПЦІЯ-САЙТУ.md` into a `docs/` folder within the repo or leave at repo root. Not a Phase 2 blocker.
- `MethodologyBlock.body` line-break handling (raw `\n\n` vs pre-split `paragraphs: string[]`). Recommended: single `body` string with `\n\n` as paragraph separator; consumer splits at render. Keeps content authoring one-field.
- Whether `socials: { telegram, instagram, facebook }` in `company.ts` uses string union `'#' | string` or just `string`. Fine either way; just `string` is simpler.

### Folded Todos

_None — `gsd-tools todo match-phase 2` returned zero matches._

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)
- `.planning/REQUIREMENTS.md` §Content — CON-01 (content from CONCEPT §7/§8 as TSX/MDX literals OR `src/content/*.ts` modules; ⚠ markers on §8 blocks 2/5/6), CON-02 (typed `projects.ts` + `projects.fixtures.ts` with 10 synthetic ЖК, discriminated `presentation` union)
- `.planning/REQUIREMENTS.md` §ЖК Template — ZHK-02 (template scalable; adding ЖК #6 = one-record PR; `grid-only` for Маєток/NTEREST in v1)
- `.planning/REQUIREMENTS.md` §QA — QA-04 (CI denylists: `Pictorial|Rubikon|Пикторіал|Рубікон` in `dist/`; hex whitelist in `src/`; `{{`/`TODO` in `dist/`)
- `.planning/ROADMAP.md` §"Phase 2: Data Layer & Content" — Success Criteria 1–5 (authoritative test surface; note that Success Criterion 1 mentions `/dev/grid` rendering — resolved by cross-phase carry per D-08)

> ⚠ **Spec-authority note:** `.planning/REQUIREMENTS.md` currently contains an unresolved git merge conflict at lines 166-174 (`<<<<<<< HEAD`/`=======`/`>>>>>>> worktree-agent-a264b7394de85bd88`). This does NOT affect Phase 2 scope but MUST be resolved before the planner begins (planner reads this file). Fix the conflict on `main` — both sides disagree only about VIS-02 status (`Complete` vs `Pending`); Phase 1 UAT confirms Complete.

### Project-level policy
- `.planning/PROJECT.md` §Constraints — palette lock, Montserrat-only, `mailto:` v1 form, rendering source = `/renders/` ONLY, skeptic-pass rule
- `.planning/PROJECT.md` §Key Decisions — HashRouter, Core-4 scope, Model-Б (4 buckets), UA-only, Етно Дім as template-demo
- `.planning/PROJECT.md` §Out of Scope — no CMS, no mobile responsive, `/construction/_social-covers/` forbidden, Pictorial/Rubikon legacy forbidden, stock photos forbidden (CONCEPT Додаток C)

### Prior-phase decisions (Phase 1 carries forward)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Tokens — `@theme` palette (6 hexes); Phase 2 palette-whitelist must match this set exactly
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Deploy — `.github/workflows/deploy.yml` already exists; Phase 2 inserts a `check-brand` step before `upload-pages-artifact`
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-23 — `vite.config.ts base: '/vugoda-website/'` (drives `BASE_URL` used by `assetUrl` helpers)

### Research artifacts (shape + rationale)
- `.planning/research/ARCHITECTURE.md` §3 Q2 — **full `Project` interface + 5 canonical records + derived views** (verbatim implementation target for `src/data/projects.ts`)
- `.planning/research/ARCHITECTURE.md` §3 Q6 — **construction data shape** (`ConstructionMonth` interface + manual-authoring pattern); D-21 adapts this by rejecting `Array.from` helper and using hand-authored `{file, alt, caption?}[]`
- `.planning/research/ARCHITECTURE.md` §3 Q8 — **`scripts/copy-renders.ts` verbatim** (translit map + construction copy + `_social-covers` skip). Phase 2 lifts directly
- `.planning/research/ARCHITECTURE.md` §6 Anti-Patterns 1, 2, 6, 7 — data-layer guardrails (no duplication, no Pictorial placeholders, no raw `/renders/ЖК …/` in JSX, no catch-all `zhk/:slug`)
- `.planning/research/PITFALLS.md` §Pitfall 7 — hardcoded content rewrite cost; drives `src/content/*.ts` policy (D-15, D-20)
- `.planning/research/PITFALLS.md` §Pitfall 10 — silent displacement leak; drives `denylistTerms()` scope (D-25)
- `.planning/research/PITFALLS.md` §Pitfall 11 — ЖК grid breaks at N; drives `projects.fixtures.ts` (D-07, D-08)
- `.planning/research/PITFALLS.md` §Pitfall 12 — placeholder-vs-decision classification; drives `src/content/placeholders.ts` surface (D-19) and `placeholderTokens()` check scope (D-27, src/ excluded from TODO check)
- `.planning/research/STACK.md` §"What NOT to Use" — ESLint skip for MVP (drives D-32 grep-only boundary enforcement); `tsx` as script runner (D-13, D-28)

### Brand authority (content source)
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 — tone of voice + 4 brand values (values.ts source)
- `КОНЦЕПЦІЯ-САЙТУ.md` §4.1 — 5-route sitemap (confirms ЖК-template applies to `etno-dim` only; Маєток/NTEREST = grid-only per D-01)
- `КОНЦЕПЦІЯ-САЙТУ.md` §5.2 — cube-ladder semantics (IsometricCube variants map to stage markers — drives empty-render fallback per Anti-Pattern 2, but that's Phase 3 rendering, Phase 2 just exposes the data)
- `КОНЦЕПЦІЯ-САЙТУ.md` §6.2 — Pipeline-4 aggregate row visual hierarchy + copy anchor (already realised in D-06)
- `КОНЦЕПЦІЯ-САЙТУ.md` §7.9 — construction-log caption tone («Січень 2026 — фундамент, секція 1», без хвастощів) — drives D-21 caption-authoring posture
- `КОНЦЕПЦІЯ-САЙТУ.md` §8 — methodology 7 blocks (primary source for `methodologyBlocks`); §11.5 flags blocks 2/5/6 as needing verification → D-16 `needsVerification: true`
- `КОНЦЕПЦІЯ-САЙТУ.md` §10.2 — silent-displacement hard rule (applies only to Lakeview); drives `denylistTerms()` invariant
- `КОНЦЕПЦІЯ-САЙТУ.md` §10.6 — "масштабується до N" (drives scale-to-N fixture strategy)
- `КОНЦЕПЦІЯ-САЙТУ.md` §11 — 8 open client items (drives `placeholders.ts` content per D-19)
- `brand-system.md` §1 — 4 brand values (cross-reference for `values.ts`)
- `brand-system.md` §3 — closed 6-hex palette (drives `paletteWhitelist()` values per D-26)

### Source asset folders
- `/renders/likeview/` — Lakeview renders (translit → `lakeview`)
- `/renders/ЖК Етно Дім/` — 8 renders (translit → `etno-dim`)
- `/renders/ЖК Маєток Винниківський/` — 2 renders (translit → `maietok-vynnykivskyi`)
- `/renders/Дохідний дім NTEREST/` — 3 renders (translit → `nterest`)
- `/construction/dec-2025/`, `/construction/jan-2026/`, `/construction/feb-2026/`, `/construction/mar-2026/` — ASCII already, copy verbatim
- `/construction/_social-covers/` — **SKIP** (CONCEPT §7.9 Lakeview brand conflict)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phase 1)

- `src/index.css` — Tailwind v4 `@theme` block with 6 canonical hexes (Phase 1 D-19). `paletteWhitelist()` reads this indirectly — the whitelist in the script is a literal const that MUST match `@theme`; drift would mean the script is wrong, not the code.
- `vite.config.ts` — `base: '/vugoda-website/'` already set (Phase 1 D-23). `BASE_URL` environment variable propagates into `assetUrl` helpers automatically.
- `.github/workflows/deploy.yml` — exists (Phase 1 D-15). Phase 2 inserts a new job step `check-brand` after `npm run build` and before `actions/upload-pages-artifact@v3`.
- `package.json` scripts — `build: "tsc --noEmit && vite build"` already wires type-check. Phase 2 adds `prebuild`, `predev`, `postbuild` scripts.
- `tsconfig.json` — strict mode with `noEmit` from Phase 1; covers `src/` + `scripts/` by default (verify `include` expands to `scripts/`).
- `src/pages/*.tsx` — 5 route stubs exist; Phase 2 does NOT touch them (pages don't consume data yet — that's Phase 3/4). Phase 2 only writes modules + scripts.

### Anti-list — DO NOT copy

- `вигода-—-системний-девелопмент/Рендера/` (legacy prototype renders) — **forbidden**; rendering source is `/renders/` only (PROJECT.md hard rule, CONCEPT §10.2)
- `/construction/_social-covers/` (Lakeview Cormorant branding) — **forbidden** (CONCEPT §7.9); copy script skips explicitly
- Prototype `public/*.jpg` stock photos (CONCEPT Додаток C) — **forbidden**
- Any non-palette hex literals in `src/**/*.{ts,tsx,css}` — CI blocks deploy
- `import.meta.glob` for `/public/` contents — breaks `<img src>` via Vite hashing (ARCHITECTURE Q6)

### Established Patterns

- **Single-source-of-truth rule** (ARCHITECTURE Anti-Pattern 1): every project-data consumer imports from `data/projects.ts`; no duplication across pages. Phase 2 guarantees this is possible; Phase 3/4 enforce via code review + the boundary CI grep.
- **Boundary stack** (ARCHITECTURE §1): `data/` ← `pages/` ← `components/sections/` ← `components/ui/` + `components/brand/`. Never reversed. `hooks/` + `lib/` are pure (no React rendering), may be called from anywhere.
- **Asset helpers** (ARCHITECTURE Q8): always `renderUrl(slug, file)` / `constructionUrl(month, file)` in JSX — never path strings. Forces `BASE_URL` prefix correctness.
- **Named consts over default exports** in data/content modules — makes grep/refactor easier and forbids renaming-at-import.

### Integration Points (Phase 2 → later phases)

- Phase 3 (Home page) consumes `projects`, `flagship`, `pipelineGridProjects`, `aggregateProjects`, `brandValues`, `methodologyBlocks`, `company`, `placeholders`, `constructionLog.latestMonth().teaserPhotos` — all by name import, no dynamic lookup.
- Phase 4 (`/projects` hub) consumes `pipelineGridProjects`, `aggregateProjects`, `flagship`, `stageFilter` buckets. Phase 4 also wires `/dev/grid` and imports `projects.fixtures.ts`.
- Phase 4 (`/zhk/:slug`) calls `findBySlug(useParams().slug)`; Phase 2 guarantees only `full-internal` projects return (D-04).
- Phase 4 (`/construction-log`) consumes `constructionLog` array directly.
- Phase 6 (perf) reads `constructionLog.latestMonth().photos.length` for lazy-load decisions; fine via direct import.
- Phase 6 (deploy, OG tags) reads `company.email`, `flagship.externalUrl` for OG meta; no new helpers needed.

</code_context>

<specifics>
## Specific Ideas

- **REQUIREMENTS.md merge conflict (skeptic-pass flag):** `.planning/REQUIREMENTS.md` lines 166-174 have unresolved conflict markers. Resolve before planner runs. Both sides differ only on VIS-02 status; Phase 1 evidence (commit `d7b4ddf test(01): complete UAT`) confirms **Complete**. User must fix manually — outside Phase 2 scope.
- **Pipeline-4 title `«Без назви»`** goes in `placeholders.ts` (not `projects.ts`) — signals client-audit-surface, consistent with phone/address pattern, reflects §11.3 as a pending answer rather than a brand statement.
- **Helper script tone**: `scripts/list-construction.ts` (the captions-authoring helper) must emit Ukrainian alt defaults «Будівельний майданчик, <month UA>» — pre-localises for the author who then types only the semantic caption («фундамент, секція 1»).
- **`paletteWhitelist()` should print the offending line**, not just the file. When palette drift happens, dev needs to see the literal line to understand what to replace. `grep -n` output format is sufficient.
- **`check-brand.ts` exit summary** prints `✓ N files scanned, 3 checks passed` on success so deploy logs show evidence of enforcement (not silent pass).
- **Fixture naming convention**: `Fixture ЖК #1 · У розрахунку` — include bucket label in title for obvious synthetic-vs-real distinction at `/dev/grid` render (Phase 4).
- **Commit granularity**: 4 atomic commits suggested — `feat(02): types + projects + fixtures`, `feat(02): copy-renders + assetUrl`, `feat(02): content modules`, `feat(02): check-brand CI + deploy integration`. Makes rollback granular if any one piece breaks.

</specifics>

<deferred>
## Deferred Ideas

- **`/dev/grid` route rendering** — Phase 4 (Portfolio hub). Phase 2 only writes the fixture file; the visual scale-to-N proof lives where `PipelineGrid` does.
- **`/dev/brand` route** — Phase 3 (when brand primitives land).
- **Render responsive picture `srcset` generation** — Phase 6 (QA-02 hero ≤200KB + bundle budgets). Phase 2's `copy-renders.ts` copies raw `.jpg`/`.webp` verbatim; downstream pipeline handles AVIF/WebP/multi-width. Do not extend `copy-renders.ts` with sharp transforms in Phase 2.
- **ESLint `import/no-restricted-paths`** — explicitly rejected for MVP per STACK.md. Revisit in v2 if boundary violations appear repeatedly in code review.
- **Portable-text / Block[] for methodology** — v2 when Sanity CMS arrives (PROJECT.md INFR2-01). `MethodologyBlock.body: string` migrates cleanly.
- **Sanity / headless CMS integration** — v2 (PROJECT.md Out of Scope). Phase 2's module shapes are migration-friendly: `data/` becomes `const projects = await client.fetch(…)`, `content/` becomes `const methodologyBlocks = await client.fetch(…)`. Zero consumer-side change.
- **i18n / l10n for methodology & values** — v2 PAGE2-06 / FEAT2-06 (EN for investors). Current structure (keyed consts + typed blocks) migrates to `content/uk/methodology.ts` + `content/en/methodology.ts` under a language-context wrapper.
- **`needsVerification: true` visual rendering (⚠ badge)** — Phase 3 (MethodologyTeaser) and future v2 `/how-we-build` (PAGE2-02). Phase 2 only exposes the flag.
- **Real phone number + juridical address** — v2 CONT2-01 (client-blocked per §11.1–2). Phase 2 renders `—`.
- **Pipeline-4 real title + location** — v2 CONT2-02 (client-blocked per §11.3). Phase 2 renders `«Без назви»` via placeholder.
- **Methodology §8 blocks 2/5/6 verification content** — v2 CONT2-03 (client-blocked per §11.5). Phase 2 ships with `needsVerification: true` flag visible.
- **Lakeview technical characteristics (клас наслідків, технологія, кадастр)** — v2 CONT2-04. Phase 2's `flagship.facts` omits these; adds when verified.
- **Construction-log expansion beyond Lakeview** — v2 FEAT2-01. Current `ConstructionMonth[]` type already supports `projectSlug?: string` field addition for multi-project use.
- **Real form backend** — v2 INFR2-04. `company.email` consumed by Phase 4 mailto; no server endpoint.
- **Sharp-based image pipeline + AVIF encoding** — Phase 6 (QA-02 budget). Phase 2 copies verbatim.

### Reviewed Todos (not folded)

_No pending todos matched this phase — subsection omitted._

</deferred>

---

*Phase: 02-data-layer-content*
*Context gathered: 2026-04-24*
