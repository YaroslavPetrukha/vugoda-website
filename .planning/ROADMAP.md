# Roadmap: Vugoda Website

**Created:** 2026-04-24
**Granularity:** standard
**Parallelization:** enabled
**Coverage:** 34/34 v1 requirements mapped
**Core Value:** Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді — точна палітра, ізометричні куби, cinematic-анімації на Motion, чесне відображення портфеля 0-здано / 1-активно / 4-pipeline.

## Phases

- [x] **Phase 1: Foundation & Shell** — Vite + React + Tailwind v4 tokens, Montserrat, HashRouter, Layout (Nav + Footer), 5 route stubs, GH Actions scaffold (completed 2026-04-24)
- [x] **Phase 2: Data Layer & Content** — typed `projects.ts` + fixtures, content modules, pre-build translit script, asset pipeline, CI denylist (completed 2026-04-24)
- [ ] **Phase 3: Brand Primitives & Home Page** — Logo/Mark/IsometricCube/Wordmark + full `/` page (7 секцій), hero parallax, responsive picture pipeline
- [ ] **Phase 4: Portfolio, ЖК, Construction Log, Contact** — `/projects` hub, `/zhk/etno-dim` template, `/construction-log` timeline, `/contact` mailto, card hover
- [ ] **Phase 5: Animations & Polish** — shared motion variants, scroll-reveal, AnimatePresence route-transitions, `useReducedMotion`, session-skip
- [ ] **Phase 6: Performance, Mobile Fallback, Deploy** — image preload, bundle audit, mobile-fallback page, OG meta, GitHub Actions deploy live
- [ ] **Phase 7: Post-deploy QA & Client Handoff** — keyboard walkthrough, hard-refresh test, Lighthouse archive, denylist verification, handoff doc

## Phase Details

### Phase 1: Foundation & Shell
**Goal**: Brand-locked visual foundation, routing, and empty shell deploy-ready — so every subsequent phase inherits correct tokens and can ship independently.
**Depends on**: Nothing (first phase)
**Requirements**: VIS-01, VIS-02, NAV-01, DEP-03
**Success Criteria** (what must be TRUE):
  1. `npm run dev` serves a local site where Nav (dark `#2F3640` with dark-version logo SVG) and Footer (юр. назва ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019, email `vygoda.sales@gmail.com`) render on every one of 5 empty route stubs (`/`, `/projects`, `/zhk/:slug`, `/construction-log`, `/contact`)
  2. `grep -rE "#[0-9A-Fa-f]{6}" src/` returns only the 6 canonical brandbook hexes (`#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A`) — no Tailwind defaults, no prototype `#2a3038`
  3. Montserrat renders cyrillic glyphs at weights 400/500/700 from `@fontsource/montserrat` cyrillic entry points only (no latin overhead); `ЖК`, `ВИГОДА`, `Маєток Винниківський` display correctly
  4. HashRouter navigates between stubs with URLs like `/#/projects`, `/#/zhk/etno-dim`; `vite.config.ts` sets `base: '/vugoda-website/'`; `public/.nojekyll` committed
  5. Keyboard Tab across Nav links shows visible `:focus-visible` outline (2px `#C1F33D`, 2px offset) on dark background
**Plans**: 5 (01-01 complete, 01-02 through 01-05 pending)
**Progress**: 1/5 plans complete
**UI hint**: yes

### Phase 2: Data Layer & Content
**Goal**: All project data, construction log, methodology copy, company facts, and brand-rule enforcement exist as typed modules + CI guards — pages can consume without re-deciding content shape.
**Depends on**: Phase 1
**Requirements**: CON-01, CON-02, ZHK-02, QA-04
**Success Criteria** (what must be TRUE):
  1. `src/data/projects.ts` exports 5 canonical projects with discriminated `presentation: 'flagship-external' | 'full-internal' | 'grid-only' | 'aggregate'` — adding a 6th ЖК is a one-record PR (verified via `src/data/projects.fixtures.ts` 10-synthetic-project rendering in hidden `/dev/grid` route without layout breaks)
  2. `scripts/copy-renders.ts` transliterates all 4 Cyrillic-named `/renders/ЖК …/` folders into `public/renders/{slug}/` (lakeview, etno-dim, maietok-vynnykivskyi, nterest) + copies `/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/` verbatim (already ASCII); `prebuild` hook wires it into `npm run build`
  3. CI denylist script fails the build when `grep -r "Pictorial\|Rubikon\|Пикторіал\|Рубікон" dist/` returns any match, when hex values in `src/` exceed the 6 canonicals, or when `{{` / `TODO` appear in `dist/`
  4. All user-facing copy lives in `src/content/*.ts` modules (methodology §8 with ⚠-verification markers on blocks 2/5/6, 4 brand values, company facts, placeholder values rendered as `—` not `{{token}}`) — no raw Ukrainian paragraphs as JSX literals in component files
  5. Page-to-data import boundary holds: `pages/` and `components/` can import from `data/` + `content/`; `components/` never import `pages/`; `lib/assetUrl.ts` is the single URL-prefix helper (respects `import.meta.env.BASE_URL`)
**Plans**: 5 plans
  - [x] 02-01-foundation-types-PLAN.md — install tsx, tsconfig.scripts.json, src/data/types.ts, src/lib/assetUrl.ts (Wave 1, foundation)
  - [x] 02-02-projects-and-fixtures-PLAN.md — 5 canonical projects + 10 synthetic fixtures (Wave 2, CON-02 + ZHK-02)
  - [x] 02-03-construction-and-copy-script-PLAN.md — construction.ts data + copy-renders.ts + list-construction.ts + npm scripts wiring (Wave 2, CON-01/CON-02 infra)
  - [x] 02-04-content-modules-PLAN.md — methodology/values/company/placeholders content modules (Wave 2, CON-01)
  - [x] 02-05-check-brand-ci-PLAN.md — check-brand.ts + postbuild hook + deploy.yml step (Wave 3, QA-04)

### Phase 3: Brand Primitives & Home Page
**Goal**: Every brand primitive (Logo, Mark, IsometricCube 3 variants, IsometricGridBG, Wordmark) exists as inviolable component, and the Home page consumes them to deliver all 7 sections with a Lighthouse-compliant hero.
**Depends on**: Phase 1, Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, VIS-03, VIS-04, ANI-01
**Success Criteria** (what must be TRUE):
  1. `/` hero renders the «ВИГОДА» wordmark with `IsometricGridBG` overlay (opacity 0.1–0.2), гасло «Системний девелопмент, у якому цінність є результатом точних рішень.», functional CTA «Переглянути проекти» that navigates to `/projects`, and a slow-parallax effect on scroll (Motion `useScroll` + `useTransform`, ease-out, no bounce, <120px translation)
  2. Home page contains 6 more sections in order: BrandEssence (4 картки цінностей), PortfolioOverview (Lakeview flagship + 3 pipeline + aggregate row, reads from `data/projects.ts`), ConstructionTeaser (3–5 фото з `/construction/mar-2026/` horizontally + CTA → `/construction-log`), MethodologyTeaser (2–3 блоки з §8), TrustBlock (реквізити-таблиця з ЄДРПОУ 42016395 + ліцензія 27.12.2019, no team photos), ContactForm (`mailto:vygoda.sales@gmail.com` button styled as form submit)
  3. Hero image ships as `<picture>` with AVIF → WebP → JPG fallback, ≤200KB for the loaded format, `<link rel="preload" as="image" fetchpriority="high">` in `index.html`, `loading="eager"` (never lazy); Lighthouse Performance on `/` alone ≥90 at desktop profile
  4. `IsometricCube` component exposes typed `variant: 'single' | 'group' | 'grid'` + typed `stroke` restricted to 3 allowed hexes; `Logo` imports canonical `brand-assets/logo/dark.svg` via `vite-plugin-svgr` (no re-coded SVG paths)
  5. Hidden `/dev/brand` route renders all brand primitives standalone for visual QA (Storybook replacement); not linked from production Nav
**Plans**: 8 plans
  - [x] 03-01-brand-primitives-PLAN.md — IsometricCube + IsometricGridBG + Mark + delete MinimalCube + svgr typedef (Wave 1)
  - [x] 03-02-home-microcopy-PLAN.md — src/content/home.ts (Wave 1)
  - [x] 03-03-image-pipeline-PLAN.md — sharp install + scripts/optimize-images.mjs + ResponsivePicture (Wave 1)
  - [x] 03-04-hero-section-PLAN.md — Hero + index.html AVIF preload (Wave 2)
  - [x] 03-05-essence-portfolio-PLAN.md — BrandEssence + PortfolioOverview (Wave 2)
  - [ ] 03-06-construction-methodology-PLAN.md — ConstructionTeaser + MethodologyTeaser (Wave 2)
  - [ ] 03-07-trust-contact-PLAN.md — TrustBlock + ContactForm (Wave 2)
  - [ ] 03-08-compose-and-dev-route-PLAN.md — HomePage compose + DevBrandPage + App.tsx route (Wave 3)
**UI hint**: yes

### Phase 4: Portfolio, ЖК, Construction Log, Contact
**Goal**: Four remaining routes ship as a coherent unit — they share Layout, ResponsivePicture, card hover, and data shape, so single-pass polish delivers the whole viewable site.
**Depends on**: Phase 3
**Requirements**: HUB-01, HUB-02, HUB-03, HUB-04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03
**Success Criteria** (what must be TRUE):
  1. `/projects` renders a StageFilter with 4 Model-Б buckets (У розрахунку · У погодженні · Будується · Здано) — «Здано (0)» визуально present as empty-state with cube-marker, not hidden; above the filter sits Lakeview FlagshipCard (aerial render, CTA «Перейти на сайт проекту ↗» opens `https://yaroslavpetrukha.github.io/Lakeview/` in new tab with `rel="noopener"`); below sits PipelineGrid (3-in-row cards: Етно Дім / Маєток / NTEREST with stage labels «меморандум» / «кошторисна документація» / «дозвільна документація»); AggregateRow text-only under grid with Pipeline-4 copy + single-cube marker
  2. `/zhk/etno-dim` template renders hero render, fact block («меморандум про відновлення будівництва», вул. Судова Львів — `—` placeholder where unverified), «Що відбувається зараз» stage-specific paragraph, 8-render gallery, CTA «Підписатись на оновлення (Instagram)» + mailto button; NO prices, NO sale terms; `findBySlug()` returns only `presentation === 'full-internal'` → visiting `/zhk/maietok-vynnykivskyi` or `/zhk/lakeview` `<Navigate>`s appropriately (not nonsensical render)
  3. `/construction-log` renders 50 photos grouped by month headers («Грудень 2025 · 12 фото», «Січень 2026 · 11 фото», «Лютий 2026 · 12 фото», «Березень 2026 · 15 фото»); photos are `<picture>` WebP first + AVIF if available + JPG fallback, `loading="lazy"` below fold, native `<dialog>` lightbox opens on click; captions in brandbook-consistent stripped style («Січень 2026 — фундамент, секція 1»); total page weight <2MB on initial load
  4. `/contact` renders email `vygoda.sales@gmail.com` as active `mailto:` (opens mail client, not fake form), phone / юр. адреса render as `—` (visible placeholder, NOT `{{token}}`), соцмережі render as `href="#"` with cursor-disabled styling
  5. ЖК cards + FlagshipCard show subtle hover-state: scale ≤1.02 + overlay-opacity delta + accent border-glow; no pружинні springs, no `transition-all`, only brand-compliant ease-out ~200ms
  6. Hidden `/dev/grid` route uses `projects.fixtures.ts` (10 synthetic ЖК across 4+ stage buckets) — grid reflows correctly at N=4, 6, 8, 10; stage-to-badge lookup returns default for unknown stage (no runtime crash, no invisible label)
**Plans**: TBD
**UI hint**: yes

### Phase 5: Animations & Polish
**Goal**: Unified Motion system layered on top of stable content — single source of truth for variants/easings/durations, scroll-reveal on every section, smooth inter-route transitions, full `prefers-reduced-motion` respect.
**Depends on**: Phase 4
**Requirements**: ANI-02, ANI-04
**Success Criteria** (what must be TRUE):
  1. `src/lib/motionVariants.ts` is the single source of truth for `fadeUp`, `stagger`, `pageFade`, `parallaxSlow` variants using shared easings (`cubic-bezier(0.22, 1, 0.36, 1)`, no bounce-springs) and durations (fast 200ms / base 400ms / slow 1200ms) — `grep -r "transition={{" src/` returns zero inline transition objects
  2. `<RevealOnScroll>` wrapper in `components/ui/` uses Motion `whileInView` + `viewport={{ once: true, margin: '-50px' }}` + shared `fadeUp` variant; applied to every below-fold section across all 5 pages; card lists use parent `stagger` with 80ms `staggerChildren` (no 30+ independent IntersectionObservers)
  3. `<AnimatePresence mode="wait" initial={false}>` wraps `<Outlet />` in Layout, keyed on `useLocation().pathname`; navigating between all 5 routes produces fade-out-then-fade-in (~350ms exit / ~400ms enter) with no visual jank; hero re-enters cleanly when returning to `/` after visiting another route
  4. `useReducedMotion()` hook is honored: when `prefers-reduced-motion: reduce` is active, `RevealOnScroll` renders children without variants, hero parallax is static, route-transition becomes instant; site remains fully navigable and readable
  5. Session-scoped skip: a `sessionStorage.getItem('hero-seen')` check on second+ visit within a session fades the hero in 2× faster (or skips parallax entirely) — demo-URL reloads during client pitch don't force re-watching the cinematic intro
**Plans**: TBD
**UI hint**: yes

### Phase 6: Performance, Mobile Fallback, Deploy
**Goal**: Site ships to a public GitHub Pages URL with verified Lighthouse ≥90, working OG/social previews, and an intentional mobile-fallback page that turns "out-of-scope mobile" into "explicit desktop-first notice."
**Depends on**: Phase 5
**Requirements**: QA-01, QA-02, QA-03, DEP-01, DEP-02
**Success Criteria** (what must be TRUE):
  1. `<1024px` viewport serves a dedicated `MobileFallback.tsx` page (single-column: logo + wordmark + text «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть: vygoda.sales@gmail.com» + 4 CTA-лінки stacked); 1280px–1919px desktop renders gracefully without layout explosion; 1920×1080 is visually bездоганно
  2. `index.html` carries OG meta tags (`og:title`, `og:description`, `og:image` = 1200×630 render з hero isometric cube, `og:url`), Twitter Card (`summary_large_image`), `theme-color="#2F3640"`, canonical URL, favicon from `brand-assets/favicon/favicon-32.svg`; pasting the demo URL into Viber/Telegram/Slack produces a clean unfurl
  3. Lighthouse desktop audit (run on deployed URL, not localhost) returns ≥90 for each of Performance, Accessibility, Best Practices, SEO on all 5 routes; hero image ≤200KB in loaded format; total bundle ≤200KB gzipped JS (verified via `vite build` report + per-route `React.lazy()` code-splitting)
  4. GitHub Actions workflow `.github/workflows/deploy.yml` runs on push to main: `npm ci` → `npm run build` (triggers `prebuild` translit + image pipeline) → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4` with `permissions: contents:write, pages:write, id-token:write`; not `gh-pages` npm package
  5. Public URL `https://yaroslavpetrukha.github.io/vugoda-website/` (or chosen account equivalent) is live and reachable; accessing `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` directly (cold tab, no click-through) works — HashRouter eliminates 404-on-hard-refresh class
**Plans**: TBD
**UI hint**: yes

### Phase 7: Post-deploy QA & Client Handoff
**Goal**: "Looks-Done-But-Isn't" checklist runs against production URL, not localhost — verify denylists, accessibility, deep-link robustness, and produce a handoff doc consolidating CONCEPT §11 open questions for one-pass client answer.
**Depends on**: Phase 6
**Requirements**: (no new REQ-IDs — verification phase covering all prior requirements)
**Success Criteria** (what must be TRUE):
  1. Keyboard-only walkthrough of all 5 routes on deployed URL: every interactive element (nav links, CTAs, card links, filter buttons, mailto CTA, lightbox open/close) is reachable and shows visible `:focus-visible` outline; no focus traps; `Esc` closes lightbox dialogs
  2. Hard-refresh (cold incognito tab) of every production URL works: `/#/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`, `/#/zhk/unknown` (→ proper 404 or redirect); no 404 class failures, no blank-screen class failures
  3. Build-output grep audit passes: `grep -r "Pictorial\|Rubikon\|Пикторіал\|Рубікон" dist/` empty; `grep -r "{{" dist/` empty; `grep -r "TODO" dist/` empty; axe-core run per route reports zero critical a11y issues (contrast, missing alt, focus)
  4. Lighthouse desktop results archived per route (≥90 all 4 categories documented); tested at 1280 / 1366 / 1440 / 1920 widths for layout verification; mobile fallback rendered correctly at <1024px (verified on real iPhone viewport or DevTools device emulation, not just CSS media query)
  5. `docs/CLIENT-HANDOFF.md` exists listing all 8 open CONCEPT §11 items (phone, юр. адреса, Pipeline-4 назва, Model-Б підтвердження, методологія блоки 2/5/6 верифікація, slug транслітерація `maietok` vs `maetok`, «NTEREST» без «I» підтвердження, Етно Дім вул. Судова підтвердження) with the current placeholder value and the field the client should fill — one-pass client answer captures them all
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Shell | 5/5 | Complete   | 2026-04-24 |
| 2. Data Layer & Content | 5/5 | Complete   | 2026-04-24 |
| 3. Brand Primitives & Home Page | 3/8 | In Progress | — |
| 4. Portfolio, ЖК, Log, Contact | 0/0 | Not started | — |
| 5. Animations & Polish | 0/0 | Not started | — |
| 6. Performance, Mobile Fallback, Deploy | 0/0 | Not started | — |
| 7. Post-deploy QA & Handoff | 0/0 | Not started | — |

## Requirement Coverage

| Phase | Requirement IDs | Count |
|-------|-----------------|-------|
| 1. Foundation & Shell | VIS-01, VIS-02, NAV-01, DEP-03 | 4 |
| 2. Data Layer & Content | CON-01, CON-02, ZHK-02, QA-04 | 4 |
| 3. Brand Primitives & Home Page | HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, VIS-03, VIS-04, ANI-01 | 10 |
| 4. Portfolio, ЖК, Log, Contact | HUB-01, HUB-02, HUB-03, HUB-04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03 | 9 |
| 5. Animations & Polish | ANI-02, ANI-04 | 2 |
| 6. Performance, Mobile Fallback, Deploy | QA-01, QA-02, QA-03, DEP-01, DEP-02 | 5 |
| 7. Post-deploy QA & Handoff | (verification — covers all prior requirements) | 0 |
| **Total mapped** | | **34 / 34** |

**Coverage validated:** every v1 REQ-ID from REQUIREMENTS.md is mapped to exactly one phase. No orphans. No duplicates. Phase 7 intentionally carries no new REQ-IDs because its role is verification of prior phases.

## Research Flags

| Phase | Flag | Rationale |
|-------|------|-----------|
| 1 | SKIP | Standard Vite 6 + Tailwind v4 + React 19 + HashRouter patterns; STACK.md has verified configs |
| 2 | SKIP | Data-layer shape decided in ARCHITECTURE.md Q2; fixture pattern is standard |
| 3 | **NEEDS SPIKE** | Motion 12.x `useScroll`+`useTransform` API verification; `vite-plugin-svgr` v4 import syntax |
| 4 | OPTIONAL | Native `<dialog>` lightbox fallback spike only if UX gap emerges |
| 5 | **NEEDS SPIKE** | Motion 12.x `AnimatePresence` + React Router v7 `<Outlet>` compatibility; `useReducedMotion` hook export path |
| 6 | SKIP | `actions/deploy-pages` YAML verbatim in STACK.md; Lighthouse is verification, not investigation |
| 7 | SKIP | QA checklist is verification, not research |

## Dependencies

```
Phase 1 (Foundation & Shell)
    │
    ▼
Phase 2 (Data Layer & Content)
    │
    ▼
Phase 3 (Brand Primitives & Home)
    │
    ▼
Phase 4 (Portfolio / ЖК / Log / Contact)
    │
    ▼
Phase 5 (Animations & Polish)
    │
    ▼
Phase 6 (Perf + Mobile Fallback + Deploy)
    │
    ▼
Phase 7 (Post-deploy QA & Handoff)
```

Within each phase, parallelization is enabled (config.json `parallelization: true`). Phase 3 example: brand primitives (Logo/Mark/IsometricCube) can be built in parallel with home sections that don't yet consume them; final integration serializes.

---
*Roadmap created: 2026-04-24*
*Source inputs: PROJECT.md, REQUIREMENTS.md (34 v1 REQ-IDs), research/SUMMARY.md (7-phase proposal), research/ARCHITECTURE.md (folder structure, data model, 8 concrete Q&A), research/PITFALLS.md (16 pitfalls + phase mapping), config.json (standard granularity, parallelization enabled)*
