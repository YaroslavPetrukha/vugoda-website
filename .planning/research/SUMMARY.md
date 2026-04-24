# Project Research Summary — Vugoda Website

**Project:** Vugoda Website (корпоративний сайт забудовника «ВИГОДА»)
**Domain:** Ukrainian real-estate developer corporate hub — static desktop-first React SPA on GitHub Pages, brand-constrained ("системний девелопмент"), 0 completed · 1 active · 4 pipeline
**Researched:** 2026-04-24
**Confidence:** MEDIUM-HIGH (stack HIGH, architecture HIGH, pitfalls MEDIUM-HIGH, features MEDIUM — live competitor audit blocked)

## Executive Summary

This is a **static desktop-first marketing SPA** whose deliverable is a clickable demo URL handed to a client via chat. Zero backend, zero CMS, zero business logic — content is TSX/TS literals. The foundation is pre-decided (Vite 6 + React 19 + Tailwind v4 + Motion) and diverges intentionally from the concept doc's Next.js+Sanity recommendation because GitHub Pages is static-only and the MVP doesn't need SSR/ISR. The brand is the hard constraint: 6-colour closed palette, Montserrat-only (3 weights), isometric-cube language, "стримано" tone — everything else bends around that.

**Recommended approach:** ship a 5-route SPA (`/`, `/projects`, `/zhk/:slug` (Etno Dim only in v1), `/construction-log`, `/contact`) with a single-source-of-truth `projects.ts` data layer, a pre-build script that transliterates Cyrillic-named `/renders/` folders into ASCII paths under `public/`, and a **HashRouter** on GitHub Pages to eliminate the 404-on-deep-link class of bugs. Brand primitives (Logo, IsometricCube 3 variants, Wordmark) live in `components/brand/` and are inviolable; the cube-ladder (`single` / `group` / `grid`) doubles as the empty-state for projects without renders so nothing ever has to be faked with stock imagery.

**Key risks & mitigations:** (1) Palette drift — delete Tailwind defaults in `@theme` + CI hex-grep. (2) GH Pages SPA 404 on hard-refresh — HashRouter in v1. (3) Cyrillic filenames on Pages — build-time translit script. (4) Silent-displacement leak (Pictorial/Rubikon mention) — CI denylist. (5) Hero LCP regression — pre-computed `<picture>` AVIF/WebP/JPG via sharp + `preload`. (6) ЖК grid breaks at N≥6 — 10-item fixtures file driving hidden `/dev/grid` QA route.

## Key Findings

### Recommended Stack

Full detail: `.planning/research/STACK.md`. Total MVP surface: ~19 packages.

**Core runtime:**
- `react@^19.2.0` + `react-dom@^19.2.0` — UI framework, proven in existing prototype
- `react-router-dom@^7.14.0` — used with **HashRouter** (not BrowserRouter) for GH Pages
- `motion@^12.38.0` — successor to framer-motion, cinematic animations
- `lucide-react@^1.11.0` — icon set, outline-only matches brand
- `@fontsource/montserrat@^5.2.8` — **static** variant; import only `cyrillic-{400,500,700}.css`

**Core build:**
- `vite@^6.3.6` (stay on 6, NOT 8 — v8 needs Rolldown + React Compiler peer deps)
- `@vitejs/plugin-react@^5.2.0` (not v6)
- `tailwindcss@^4.2.4` + `@tailwindcss/vite@^4.2.4`
- `typescript@~5.8.3` — type-check only via `tsc --noEmit`

**Scripts / deploy:**
- `sharp@^0.34.5` — image pre-optimization (not vite-imagetools)
- `tsx` — run scripts
- `actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3` (NOT `gh-pages` npm)

**Conditional:** `clsx@^2.1.1` (when variants appear); `vite-plugin-svgr@^4` (for brand-asset SVG imports)

**NOT used in MVP:** Next.js, Three.js, framer-motion (use `motion`), emotion/styled-components, classnames, react-helmet, swiper, react-hook-form, zod, redux/zustand, react-query, axios, dotenv, moment/date-fns, any CMS, GA4/Pixel, autoprefixer, ESLint, Vitest/Playwright.

### Expected Features

Full detail: `.planning/research/FEATURES.md`. ⚠ Competitor rows LOW-conf (live audit blocked).

**Must have (table stakes — in MVP):**
- ЄДРПОУ 42016395 + licence 27.12.2019 in footer on *every* page (not just home)
- 4-bucket Model-Б stage filter (У розрахунку / У погодженні / Будується / Здано)
- Stage marker on every card
- Etno Dim ZHK template (8 renders)
- Home teaser + `/construction-log` timeline (50 photos)
- Contact page with `mailto:vygoda.sales@gmail.com` (phone/address = `—` placeholder)
- Favicon + **OG meta tags** (⚠ gap — adding to PROJECT.md)
- Differentiated Lakeview hero-card vs pipeline grid + aggregate row

**Should have (brand differentiators — in MVP):**
- Honest "Здано (0)" bucket kept visible
- Stage-precise language ("меморандум", "дозвільна") — not "скоро в продажу"
- Cube-ladder visuals per CONCEPT §5.2
- Monthly time-sequenced construction archive
- Aggregator row for Pipeline-4 unnamed (no fake name)
- Isometric restrained brand (no WebGL, no video hero)
- Template-driven scalability (adding ЖК #6 = 1-record PR)
- No team photos (differentiator by omission)

**Defer to v1.x:** `/about`, `/how-we-build`, `/buying` full pages; real phone + address; map; additional `/zhk/{slug}` full pages.

**Defer to v2+:** mobile responsive (⚠ reclassify as v2 table-stakes), `/news`/`/faq`/`/documents`/`/partners`, backend form handler, єОселя per project, EN language, analytics + cookie banner, Sanity migration, privacy-policy page.

**Anti-features (skip):** price at corp level, apartment-picker, 360°/VR, mortgage calc, agent finder, team page, full Lakeview internal page, Lakeview social-cover imagery on Vugoda corp, stock photos, reviews, awards badges, RU switcher, live chat.

### Architecture Approach

Full detail: `.planning/research/ARCHITECTURE.md`.

Build-time script translits `/renders/ЖК …/` + `/construction/…/` into `public/renders/{slug}/` + `public/construction/{key}/`; Tailwind v4 emits utility classes from `@theme` tokens. Runtime is `HashRouter` → `<Layout>` (Nav + Footer) → `<AnimatePresence mode="wait">` wrapping 5 pages.

**Boundary rule:** `pages/` import from `data/` + compose `components/`; `components/` never import from `data/`.

**Major components:**
1. **`data/`** — single SOT (`projects.ts`, `construction.ts`, `methodology.ts`, `values.ts`, `company.ts`); plain TS typed by `types.ts`
2. **`components/brand/`** — inviolable primitives: `Logo`, `Mark`, `IsometricCube` (variant: `single`|`group`|`grid`), `IsometricGridBG`, `Wordmark`
3. **`components/sections/`** — one folder per page (`home/`, `projects/`, `zhk/`); wraps content in `RevealOnScroll`
4. **`components/ui/`** — `Button`, `StageBadge`, `ResponsivePicture` (`<picture>` AVIF→WebP→JPG), `RevealOnScroll`
5. **`pages/`** — 5 files; `ZhkPage` uses `findBySlug()` and `<Navigate>` when `presentation !== 'full-internal'`
6. **`lib/`** — `assetUrl.ts`, `formatDate.ts`, `motionVariants.ts` (shared variants)
7. **`scripts/`** — `copy-renders.ts` + `optimize-images.mjs`

**Data model — key discriminant:**
```ts
presentation: 'flagship-external' | 'full-internal' | 'grid-only' | 'aggregate'
```
Adding ЖК #6 = append one record. Flipping `grid-only` → `full-internal` = one field change.

### Critical Pitfalls — Top 7

Full list (16 pitfalls): `.planning/research/PITFALLS.md`.

1. **Palette drift** — dev adds `gray-700` not in brandbook. **Phase 1:** delete Tailwind defaults; CI grep `#[0-9A-Fa-f]{6}` ⊆ 6 canonicals; states = opacity variations.
2. **GH Pages SPA 404 on hard-refresh** — pasted `/projects` URL → 404. **Phase 1:** HashRouter + `public/.nojekyll`; Phase 7: smoke test all 5 routes in incognito.
3. **Silent-displacement leak** (Pictorial/Rubikon) — one sentence breaks brand strategy. **Phase 2:** CI denylist grep.
4. **Hero LCP regression + AVIF-without-fallback** — 2.4MB JPG breaks Lighthouse; AVIF-only breaks Safari ≤14. **Phase 3:** sharp pre-compresses to `{640,1280,1920}×{avif,webp,jpg}`; `ResponsivePicture` emits all three; `preload as="image"` on hero.
5. **ЖК grid breaks at N=6** — "scales to N" stated but never tested. **Phase 2:** `projects.fixtures.ts` with 10 synthetic ЖК + invented 5th bucket; hidden `/dev/grid` route.
6. **Invisible focus + `#A7AFBC` small text** — default focus invisible on `#2F3640`; muted fails WCAG on 12-14px. **Phase 1:** `:focus-visible { outline: 2px solid var(--color-accent) }`; `text-muted` requires ≥16px OR `font-medium` at ≥14px; footer uses `var(--color-text)` at `opacity: 0.8`.
7. **Placeholder `{{token}}` shipped + slug contradictions** — raw `{{телефон}}` in footer; shared URL breaks. **Phase 2 + 6:** visible text placeholders render as `—`; decision placeholders = committed defaults with `TODO` + PROJECT.md Key Decisions; CI fails build on `{{` or `TODO` in `dist/`.

Additional: easing drift (pitfall 3), scroll-trigger/AnimatePresence conflict (4), cinematic-on-revisit friction (13), mobile broken-vs-fallback (14), Cyrillic `ЖК`-orphan typography (15), `will-change` layer explosion (16).

## Implications for Roadmap

### Unified 7-Phase Structure

Each phase independently shippable.

### Phase 1: Foundation & Shell
**Rationale:** tokens + routing + layout must be correct before content is built; palette-drift/focus-trap pitfalls root here
**Delivers:** `index.css` with Tailwind v4 `@theme` (6 canonical hexes, Montserrat, motion tokens, `:focus-visible`); HashRouter; `<Layout>` (Nav + Footer); 5 route stubs; GitHub Actions workflow scaffold; `public/.nojekyll`; Lighthouse baseline ≥90
**Uses:** Vite, Tailwind v4, `@fontsource/montserrat`, react-router-dom HashRouter, Motion tokens only
**Addresses:** VIS-01, VIS-02, NAV-01, DEP-01/02/03
**Avoids pitfalls:** 1, 2, 5, 6, 15
**Research flag:** SKIP — standard patterns, STACK.md has configs

### Phase 2: Data Layer & Content
**Rationale:** all content as typed data before pages consume it; asset translit must precede image rendering; prevents silent-displacement and placeholder leaks
**Delivers:** `data/types.ts` (`Stage` + `Presentation` discriminated unions); `data/projects.ts` (5 canonical) + `data/projects.fixtures.ts` (10 synthetic); `data/construction.ts`; `data/methodology.ts` + `values.ts` + `company.ts`; page-copy modules; `scripts/copy-renders.ts` executed + committed; `scripts/optimize-images.mjs` executed + committed; `lib/assetUrl.ts`; CI denylist for `Pictorial|Rubikon`
**Implements:** `data/` + `lib/` + `scripts/` components
**Addresses:** CON-01, CON-02, ZHK-02 (scalability)
**Avoids pitfalls:** 3, 7, 10, 11, 12
**Research flag:** SKIP — data-layer shape decided, fixture pattern standard

### Phase 3: Brand Primitives & Home Page
**Rationale:** home uses every brand primitive — build them together rather than abstractly; hero LCP fix roots here
**Delivers:** `components/brand/` (Logo via svgr, Mark, IsometricCube 3-variant, IsometricGridBG, Wordmark); home sections (Hero w/ parallax, BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm mailto); `ResponsivePicture` with AVIF/WebP/JPG; hidden `/dev/brand` route
**Implements:** `components/brand/` + `components/ui/` + `pages/Home.tsx`
**Addresses:** HOME-01…07, VIS-03, VIS-04, ANI-01
**Avoids pitfalls:** 8 (hero LCP), 9 (AVIF fallback)
**Research flag:** **NEEDS SPIKE** — Motion `useScroll`+`useTransform` API; svgr v4 API

### Phase 4: Portfolio, ЖК, Construction Log, Contact
**Rationale:** four pages share Layout, ResponsivePicture, Motion wrappers, data shape — build together, single polish pass
**Delivers:** `/projects` with StageFilter + FlagshipCard + PipelineGrid + AggregateRow; `/zhk/:slug` template (Etno Dim first; Maietok/NTEREST as `grid-only` cards without internal page); `/construction-log` month-grouped + lazy-load + lightbox (native `<dialog>`); `/contact` with mailto; `/dev/grid` using fixtures; route-level `React.lazy()`
**Implements:** `pages/Projects.tsx`, `pages/Zhk.tsx`, `pages/ConstructionLog.tsx`, `pages/Contact.tsx`, `components/sections/projects/…zhk/…`
**Addresses:** HUB-01…04, ZHK-01, ZHK-02, LOG-01, LOG-02, CTC-01
**Avoids pitfalls:** 11 (N-scaling), 12 (placeholders)
**Research flag:** OPTIONAL spike — lightbox if native `<dialog>` insufficient

### Phase 5: Animations & Polish
**Rationale:** animations must layer on stable content — animating half-finished components leads to refactor churn; also this is where reduced-motion + session-skip root
**Delivers:** `lib/motionVariants.ts` (SOT for fadeUp/stagger/pageFade); `RevealOnScroll` wrapper; `AnimatePresence mode="wait"` on routes; hero `useScroll`+`useTransform` parallax; card hover (subtle, no springs); `useReducedMotion` fallback; session-scoped skip for re-visits
**Implements:** `lib/motionVariants.ts` + Motion-composition across all pages
**Addresses:** ANI-01, ANI-02, ANI-03, ANI-04
**Avoids pitfalls:** 3 (easing drift), 4 (scroll/AnimatePresence conflict), 13 (re-visit friction), 16 (will-change explosion)
**Research flag:** **NEEDS SPIKE** — Motion 12.x `AnimatePresence` + React Router v7 pattern; `useReducedMotion` hook name

### Phase 6: Performance, Mobile Fallback, Deploy
**Rationale:** GH Pages + Lighthouse ≥90 + mobile fallback are deploy-phase concerns, can't be verified in dev
**Delivers:** `<link rel="preload" as="image">` for hero; bundle audit (≤200KB gzipped); mobile-fallback page at <1024px (single-column "Сайт оптимізовано для екранів ≥1280px" + 4 CTA links — NOT a broken responsive attempt); OG meta tags + Twitter Card + favicon + theme-color (QA-03); Lighthouse audit archived; actions/deploy-pages live
**Implements:** GH Actions workflow activated; `pages/MobileFallback.tsx`; meta in `index.html`
**Addresses:** QA-01, QA-02, QA-03 (new)
**Avoids pitfalls:** 8 (LCP), 14 (broken mobile)
**Research flag:** SKIP — deploy YAML in STACK.md

### Phase 7: Post-deploy QA & Client Handoff
**Rationale:** "Looks Done But Isn't" checklist must run on production, not localhost; handoff doc consolidates 8 CONCEPT §11 open questions for one-pass client answer
**Delivers:** keyboard-only walkthrough; hard-refresh all 5 routes incognito; desktop QA at 1280/1366/1440/1920; mobile fallback render verified; axe-core per route; `grep dist/` for `{{`, `TODO`, `Pictorial`, `Rubikon` (empty); CI denylist enabled; Lighthouse ≥90 archived; handoff doc listing 8 CONCEPT §11 open items with current placeholder values
**Implements:** `docs/CLIENT-HANDOFF.md`; CI denylist script
**Addresses:** QA-04 (new, CI denylist)
**Avoids pitfalls:** all
**Research flag:** SKIP — verification, not investigation

### Phase Ordering Rationale

- **Tokens first** — pitfalls 1/5/6/15 root here; can't fix drift retroactively
- **Data before pages** — pitfalls 7/10/11/12 root in data; building pages first forces rewrite when types stabilize
- **Brand primitives + Home together** — Home uses every primitive; `/dev/brand` = Storybook replacement
- **Portfolio/ZHK/Log/Contact together** — shared Layout, ResponsivePicture, data shape
- **Animations last** — PITFALLS explicitly says "animations after pages (content stable before motion layered on)"
- **Deploy not last** — 404-class can't be caught in dev; full Phase 7 for verification
- **QA as its own phase** — 18-item checklist; bolting onto Phase 6 guarantees skipping

### Research Flags Summary

| Phase | Flag | Reason |
|-------|------|--------|
| 1 | SKIP | Standard Vite/Tailwind/router patterns; STACK.md has configs |
| 2 | SKIP | Data-layer shape decided; fixture pattern standard |
| 3 | **NEEDS SPIKE** | Motion `useScroll`+`useTransform` API; svgr v4 API |
| 4 | OPTIONAL | Lightbox choice if native `<dialog>` insufficient |
| 5 | **NEEDS SPIKE** | Motion 12.x `AnimatePresence` + Router v7; `useReducedMotion` hook name |
| 6 | SKIP | Deploy YAML verbatim in STACK.md |
| 7 | SKIP | QA is verification |

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | npm registry verified 2026-04-24; prototype runs on stack; Fontsource Cyrillic confirmed by tarball |
| Features | **MEDIUM** | Domain patterns HIGH; competitor rows LOW (no live audit — WebSearch blocked). Don't quote competitor specifics as fact. |
| Architecture | **HIGH** | Concrete patterns. MEDIUM for Motion+Router v7 specifics. HIGH for translit. |
| Pitfalls | **MEDIUM-HIGH** | HIGH for brand-contrast math. MEDIUM for React-Router/GH-Pages specifics. LOW for Cyrillic line-height. |

**Overall confidence:** MEDIUM-HIGH. Safe to proceed to roadmap. Two 30-60 min spikes at Phase 3 and Phase 5.

### Gaps to Address

1. **Live competitor audit blocked** (WebSearch denied). FEATURES competitor table is pattern-level; treat as hypothesis.
2. **Motion 12.x API names** — verify `useScroll`, `whileInView`, `useReducedMotion` before Phase 3/5 spike.
3. **React Router v7 + HashRouter + AnimatePresence** — largely moot (HashRouter stable); `<Outlet>` pattern verify in Phase 5.
4. **AVIF baseline** — `<picture>` fallback makes this moot.
5. **UA real-estate mobile traffic** — 60-70% claim is training-level; affects whether mobile-fallback is enough or Phase 8 mobile-responsive becomes post-deploy blocker.
6. **GDPR/UA data law for `mailto:`-only** — current reading: no processing, no requirement.
7. **CONCEPT §11 open client questions** (8 items) — handled by placeholder-layer in Phase 2; compiled into Phase 7 handoff for one-pass client answer.

## Recommended PROJECT.md Amendments (before Phase 1)

1. **Add `QA-03`** — OG meta tags + Twitter Card + theme-color `#2F3640` + canonical URL; OG image = hero isometric-cube render 1200×630
2. **Tighten `NAV-01`** — footer on every page contains (minimum): legal name, ЄДРПОУ `42016395`, licence `27.12.2019`, `vygoda.sales@gmail.com`
3. **Update `DEP-03`** — "react-router-dom HashRouter; Vite `base: '/vugoda-website/'`; `public/.nojekyll` committed"
4. **Add to Out-of-Scope** — privacy-policy page/footer link deferred to when analytics added
5. **Add `QA-04`** — CI denylist grep for `Pictorial|Rubikon|Пикторіал|Рубікон` + non-token hex values (pitfalls 1, 10)

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — requirements, constraints, key decisions
- `КОНЦЕПЦІЯ-САЙТУ.md` §4/5/6/7/8/10/11 — sitemap, visual language, content model, sections, methodology, hard rules, open questions
- `CONTEXT.md` §1/2/3/4/7/8 — identity, portfolio, market, personas
- `brand-system.md` §3/4/5/7 — palette (WCAG measured), typography, graphic system, gaps
- `brand-assets/patterns/isometric-grid.svg` + `brand-assets/mark/mark.svg` — direct inspection
- `/renders/` + `/construction/` directory inspection — filename conventions, counts
- `вигода-—-системний-девелопмент/package.json` — existing prototype deps
- npm registry verified 2026-04-24 — all pinned versions
- `@fontsource/montserrat@5.2.8` tarball — Cyrillic CSS entry points confirmed

### Secondary (MEDIUM confidence)
- Training data on Motion (framer-motion) API
- Vite `base` + Router `basename` coupling patterns
- GH Pages SPA fallback (HashRouter vs 404.html) patterns
- UA developer site patterns (AVALON/LEV/Parus/RIEL/VD Group/Globus)
- European small-developer archetype

### Tertiary (LOW confidence — needs validation)
- UA real-estate mobile traffic ~60-70%
- Competitor feature-by-feature claims (WebSearch/WebFetch denied)
- AVIF baseline across Safari versions
- Montserrat Cyrillic glyph-specific metrics
- `actions/deploy-pages` NFC/NFD filename handling

---
*Research completed: 2026-04-24*
*Ready for roadmap: yes*
