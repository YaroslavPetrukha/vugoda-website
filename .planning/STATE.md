---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 02-03-construction-and-copy-script-PLAN.md (parallel wave 2)
last_updated: "2026-04-24T19:16:50.680Z"
progress:
  total_phases: 7
  completed_phases: 1
  total_plans: 10
  completed_plans: 9
  percent: 80
---

# Project State: Vugoda Website

**Last updated:** 2026-04-24T19:14:25Z (plan 02-02 complete)
**Updated by:** execute-phase agent → 02-02-projects-and-fixtures

## Project Reference

- **Project:** Vugoda Website — корпоративний сайт забудовника «ВИГОДА»
- **Core Value:** Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді (точна палітра, ізометричні куби, cinematic-анімації на Motion, чесне відображення портфеля 0-здано / 1-активно / 4-pipeline).
- **Domain:** Ukrainian real-estate developer corporate hub, static desktop-first React SPA on GitHub Pages
- **Current focus:** Phase 02 — data-layer-content

## Current Position

Phase: 02 (data-layer-content) — EXECUTING
Plan: 4 of 5 complete (02-01, 02-02, 02-03, 02-04 done — only 02-05 check-brand CI remains)

- **Phase:** 2 — Data Layer & Content (executing)
- **Plan:** 4 of 5 complete (02-01, 02-02, 02-03, 02-04 done — only 02-05 check-brand CI remains)
- **Status:** Ready to execute
- **Stopped at:** Completed 02-03-construction-and-copy-script-PLAN.md (parallel wave 2)
- **Progress:** [████████░░] 80%

## Roadmap Summary

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Foundation & Shell | 4 (VIS-01, VIS-02, NAV-01, DEP-03) | Not started |
| 2 | Data Layer & Content | 4 (CON-01, CON-02, ZHK-02, QA-04) | Not started |
| 3 | Brand Primitives & Home Page | 10 (HOME-01…07, VIS-03, VIS-04, ANI-01) | Not started |
| 4 | Portfolio, ЖК, Log, Contact | 9 (HUB-01…04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03) | Not started |
| 5 | Animations & Polish | 2 (ANI-02, ANI-04) | Not started |
| 6 | Performance, Mobile Fallback, Deploy | 5 (QA-01, QA-02, QA-03, DEP-01, DEP-02) | Not started |
| 7 | Post-deploy QA & Client Handoff | 0 (verification of all prior) | Not started |

**Coverage:** 34/34 v1 requirements mapped. No orphans.

## Performance Metrics

Targets from PROJECT.md Constraints:

- **Lighthouse desktop:** ≥90 on Performance / Accessibility / Best Practices / SEO (QA-02)
- **Hero image:** ≤200KB (loaded format, AVIF or WebP)
- **JS bundle:** ≤200KB gzipped
- **WCAG:** 2.1 AA floor; `#A7AFBC` allowed only ≥14pt; `#C1F33D` never on light bg

## Stack (decided, not re-debated)

- Vite 6 + React 19 + TypeScript 5.8 + Tailwind v4 + Motion 12
- `react-router-dom` v7 with **HashRouter** (not BrowserRouter) + Vite `base: '/vugoda-website/'` + `public/.nojekyll`
- `@fontsource/montserrat` (cyrillic-400/500/700 entry points only)
- `vite-plugin-svgr` for brand-assets SVG imports
- `sharp` + `tsx` for build-time image pipeline + translit script
- `actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3` (NOT `gh-pages` npm)
- Content hardcoded in TSX/TS (no CMS in v1)

## Accumulated Context

### Decisions (from PROJECT.md Key Decisions)

- **Vite + React + Motion** (not Next.js + Sanity): GH Pages is static; simpler stack
- **Core-4 scope**: Home + `/projects` + `/zhk/etno-dim` + `/construction-log` + `/contact` (5 routes); `/about`, `/how-we-build`, `/buying`, `/investors` = v2
- **Етно Дім as template-demo ЖК**: has 8 renders (most of any pipeline project); «меморандум» stage = useful «system» narrative
- **Маєток Винниківський + Дохідний дім NTEREST = `grid-only`** in v1 (hub card, no internal page)
- **Модель Б (4 buckets)** for stage filter: У розрахунку · У погодженні · Будується · Здано
- **Desktop-first, mobile = fallback page at <1024px** (not responsive; full mobile = v2)
- **HashRouter in v1**, BrowserRouter only when custom domain added (v2)
- **UA-only** in MVP; EN for investors = v2

### Plan 02-01 Decisions (2026-04-24)

- **types.ts = single source of truth for data+content types** — no interface/type decls anywhere else in `src/data/` or `src/content/` (D-02, D-23). Zero imports, zero runtime exports; enforced by grep in Plan 02-05.
- **assetUrl.ts = only path into /renders/ and /construction/ asset URLs** — reads `import.meta.env.BASE_URL` once at module init; all downstream JSX goes through `renderUrl(slug, file)` / `constructionUrl(month, file)` / `assetUrl(path)` (D-30, D-31). No hardcoded `/renders/…` or `/construction/…` in components.
- **tsconfig.scripts.json is standalone** — does NOT extend `tsconfig.json` (parent pulls DOM libs harmful to Node scripts). Uses `lib: ["ES2022"]` + `types: ["node"]`, scoped to `scripts/**/*.ts`. Directory itself created in Plan 02-03.
- **tsx@^4.21.0 pinned** — Plan 02-03 copy-renders.ts script runner.
- **No premature helpers in assetUrl.ts** — `ogImageUrl`/`faviconUrl` deferred to their Phase 6 call sites; only 3 helpers shipped now (assetUrl, renderUrl, constructionUrl).

### Plan 02-02 Decisions (2026-04-24)

- **Single-array-plus-derived-views pattern** for `src/data/projects.ts` — raw `projects[]` is the source; `flagship` / `pipelineGridProjects` / `aggregateProjects` / `detailPageProjects` / `findBySlug` are the public read surface. Consumers never filter `projects[]` directly. Adding ЖК #6 = append one record with the right `presentation` and it flows into the correct view automatically (ZHK-02 scale-to-N).
- **findBySlug gates on `presentation === 'full-internal'`** per D-04 / PITFALLS Anti-Pattern 7 — lakeview / maietok / nterest / pipeline-4 slugs return `undefined` so the `/zhk/:slug` route component (Phase 4) can redirect via `<Navigate>` instead of rendering a half-page.
- **Filesystem authoritative over spec:** lakeview renders use the 7 verified `.jpg` filenames from `/renders/likeview/`, NOT the `.webp` list in ARCHITECTURE Q2. RESEARCH skeptic-pass caught the mismatch before it shipped.
- **Pipeline-4 title hardcoded `«Без назви»`** in projects.ts with an inline `placeholder per placeholders.ts#pipeline4Title` comment — avoids a cross-module import in the data layer while keeping the audit surface discoverable when Plan 02-04 creates `placeholders.ts`.
- **Fixtures stand-alone (no import from `./projects`)** — `src/data/projects.fixtures.ts` ships 10 `Fixture ЖК #N` records covering all 4 Stage buckets (u-rozrakhunku×3, u-pogodzhenni×2, buduetsya×2, zdano×3) and all 4 Presentation variants. Decoupling guarantees production data bugs cannot leak into `/dev/grid` stress surface, and vice versa. Enforcement of the IMPORT BOUNDARY doc-block (pages/+components/ MUST NOT import fixtures) is Plan 02-05's `scripts/check-brand.ts` responsibility.
- **TDD gate without Vitest:** plan marked tasks `tdd="true"` but STACK.md skips Vitest for MVP. The TDD gate here is `npm run lint` (`tsc --noEmit`) + acceptance-criteria grep battery + a one-shot runtime invariant check via `npx tsx -e` (11 invariants, all PASS).

### Plan 02-03 Decisions (2026-04-24)

- **`fileURLToPath` instead of `.pathname`** in `scripts/copy-renders.ts` and `scripts/list-construction.ts` — the repo checkout path contains the non-ASCII "Проєкти" folder, and `new URL('..', import.meta.url).pathname` returns a percent-encoded string (`%D0%9F%D1%80%D0%BE%D1%94%D0%BA%D1%82%D0%B8`) which `existsSync` cannot resolve. First dry-run reproduced the failure exactly as flagged in 02-RESEARCH §Translit Script edge case 5. `fileURLToPath(new URL(...))` decodes to the filesystem-usable path. Pattern applies to every future `scripts/*.ts` that builds paths from `import.meta.url`.
- **Project-level `.gitignore` created in this plan** — no prior `.gitignore` existed. Covers `dist/`, `node_modules/`, generated `public/renders/` + `public/construction/` (source of truth lives at `/renders/` and `/construction/` repo root), `.DS_Store`, and editor caches. Minimum scope — did not attempt to gitignore every out-of-scope untracked source folder.
- **`constructionLog` reverse-chronological with `teaserPhotos` only on `latestMonth()`** (D-22) — `mar-2026` sits at index 0 and carries 5 curated filenames; feb/jan/dec have no `teaserPhotos` field. HomePage ConstructionTeaser swap becomes a one-field PR; ConstructionLogPage consumes the full array.
- **UA alt default `«Будівельний майданчик, {month-UA} {year}»`** — provides WCAG 2.1 AA alt floor without marketing fluff; hand-authored `caption` fields remain optional and are added later per CONCEPT §7.9 tone («без хвастощів»). `list-construction` helper emits this default alt in its paste-ready TS literal so captions stay additive.
- **`_social-covers/` and `.DS_Store` filtered in every cpSync call** — hard-rule brand conflict (CONCEPT §7.9) + macOS metadata hygiene (RESEARCH Pitfall B). Grep-auditable (`filter: FILTER` must appear on both cpSync calls; enforced by Plan 02-05 check-brand).

### Plan 02-04 Decisions (2026-04-24)

- **`src/content/methodology.ts` bodies verbatim from КОНЦЕПЦІЯ-САЙТУ.md §8** — no paraphrasing, no truncation; typographic apostrophes (U+2019) and guillemets («») preserved. Blocks 2, 5, 6 carry `needsVerification: true` per D-16 / CONCEPT §11.5 — UI renders a ⚠ marker as data, not a string-embedded caveat.
- **Four-module split retained over single `content/index.ts`** (D-15): methodology / values / company / placeholders are independently editable; each has its own `@rule IMPORT BOUNDARY` doc-block.
- **Self-consistency fix on doc-blocks (deviation Rule 3):** plan's `<action>` for `values.ts` and `placeholders.ts` shipped doc-blocks that literally contained the forbidden-lexicon words and `{{token}}` examples the plan's own acceptance criteria forbid. Rephrased to reference the policy without including the banned literals. Keeps source text clean for Plan 02-05's `check-brand` CI grep over `src/`.
- **`company.ts` uses 5 top-level `as const` named exports + 1 typed `socials` object** (not a frozen bundle) per RESEARCH §Named exports. `edrpou` / `licenseDate` / `email` etc. have narrow string-literal types — cheap correctness guard for legal facts that must not drift.
- **`placeholders.ts` is a leaf module** (zero imports, zero types needed). Values are raw em-dashes (U+2014 verified at runtime) and `«Без назви»` — never `{{token}}` literals. Client-confirmation edits propagate in one build with no component touches.

### Hard Rules (from brand-system + CONCEPT §10)

- Closed palette: 6 hexes only (`#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A`)
- Montserrat only, 3 weights (400/500/700)
- Isometric cube language: stroke 0.5–1.5pt, opacity 5–60%, only 3 allowed stroke colors
- Tone: стримано, предметно, без суперлативів — заборонені слова «мрія», «найкращий», «унікальний», «преміальний стиль життя»
- Silent displacement (Pictorial / Rubikon never named) — applies ONLY to Lakeview
- No team photos, no faces, no names
- Rendering source = `/renders/` ONLY; legacy `/вигода-—-системний-девелопмент/Рендера/` forbidden; `/construction/_social-covers/` forbidden (brand conflict)

### Open Client Questions (CONCEPT §11, placeholder layer — not blocking MVP)

Deferred to Phase 7 handoff doc:

1. Корпоративний телефон (render as `—` until resolved)
2. Юр. / поштова адреса (render as `—`)
3. Pipeline-4 назва (render as «Без назви» + aggregate-row copy)
4. Model-Б fінальне підтвердження стадій
5. Методологія §8 — верифікація блоків 2/5/6 (render with ⚠ marker)
6. Slug транслітерація (`maietok` vs `maetok`; committed default = `maietok-vynnykivskyi`, TODO-marked)
7. Написання «NTEREST» без «I» (committed default = `nterest`, confirm with client)
8. Етно Дім — адреса вул. Судова збережена? (render as `—` until confirmed)

### Todos / Blockers

- None blocking Phase 2
- 02-01 complete: tsx@^4.21.0 installed; src/data/types.ts (7 types); src/lib/assetUrl.ts (3 helpers); tsconfig.scripts.json seeded
- 02-02 complete: src/data/projects.ts (5 records + 5 derived views); src/data/projects.fixtures.ts (10 synthetic records); CON-02 + ZHK-02 marked complete
- 02-03 complete: scripts/copy-renders.ts (translit + DS_Store filter); scripts/list-construction.ts (manual helper); src/data/construction.ts (4 months × N photos, 50 total); .gitignore added; package.json predev/prebuild/list:construction wired; CON-01 marked complete (co-owned with 02-04)
- 02-04 complete: src/content/{methodology,values,company,placeholders}.ts (content modules)
- Remaining serial: 02-05 (check-brand CI) — depends on all prior plans
- Two research spikes flagged for Phase 3 (Motion `useScroll` API, `vite-plugin-svgr` v4) and Phase 5 (AnimatePresence + Router v7, `useReducedMotion` export)

### Research Artifacts Available

- `.planning/research/SUMMARY.md` — executive summary, 7-phase proposal, confidence assessment
- `.planning/research/STACK.md` — verified package versions + configs (npm-registry-verified 2026-04-24)
- `.planning/research/FEATURES.md` — must-have / should-have / defer tiers
- `.planning/research/ARCHITECTURE.md` — 8 concrete Q&A (folder structure, data model, tokens, cube SVG, Motion patterns, construction log, AnimatePresence + Router, Cyrillic filename translit)
- `.planning/research/PITFALLS.md` — 16 pitfalls mapped to preventing phases

## Session Continuity

**Next action for user:**

```
/gsd:execute-phase 02-data-layer-content
```

Phase 2 is in flight. 02-01 (foundation types) and 02-02 (projects + fixtures) complete; 02-03 (construction + copy script), 02-04 (content modules) in parallel flight; 02-05 (check-brand CI) remaining.

**If returning after context loss, read in order:**

1. `.planning/PROJECT.md` — what and why
2. `.planning/REQUIREMENTS.md` — 34 v1 REQ-IDs with phase mappings
3. `.planning/ROADMAP.md` — 7-phase structure with success criteria
4. `.planning/STATE.md` (this file) — current position
5. `.planning/research/ARCHITECTURE.md` — folder structure + data model (load before phase 1 planning)
6. `.planning/research/PITFALLS.md` — pitfall-to-phase map (load per phase as reference)

---
*Project memory evolves at phase transitions (via `/gsd:transition`) and milestone boundaries (via `/gsd:complete-milestone`).*
