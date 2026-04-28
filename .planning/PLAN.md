# Vugoda Website — Engineering Plan (Planning Mode, 2026-04-24)

> **Input scope:** цей документ — компас для Phase 3–7. Phase 1 (Foundation & Shell) і Phase 2 (Data Layer & Content) вже validated у `.planning/PROJECT.md`. PRD / Architecture / Roadmap / Folder-structure / Definition-of-Done нижче переписують попередні матеріали в єдину картину + **розкладку агентів і скілів у розрізі фаз**, щоб виконавець не витрачав час на навігацію по артефактах.
>
> **Canonical sources:** `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/research/{SUMMARY,STACK,ARCHITECTURE,FEATURES,PITFALLS}.md`, `КОНЦЕПЦІЯ-САЙТУ.md`, `brand-system.md`, `CLAUDE.md`.

---

## 1. Product Requirements Document (PRD)

### 1.1 Executive Summary

Clickable desktop-first React SPA-прототип корпоративного сайту забудовника «ВИГОДА» на GitHub Pages, який за URL демонструє портфель (1 активно · 4 pipeline) через лінзу «системного девелопменту» — з точною брендовою палітрою, ізометричними кубами, cinematic-анімаціями на Motion, і чесним маркуванням стадій. Deliverable — 5 клікабельних сторінок (Home / `/projects` / `/zhk/etno-dim` / `/construction-log` / `/contact`) з Lighthouse desktop ≥ 90 на всіх чотирьох категоріях, що клієнт відкриває з Viber/Telegram/Slack і бачить чистий unfurl. Все решта (mobile, CMS, аналітика, бекенд форм) — явно v2.

### 1.2 Goals

1. **Демо-URL `https://yaroslavpetrukha.github.io/vugoda-website/`** живий, reach-able, з HashRouter deep-links без 404-on-refresh.
2. **Бренд-жорсткість:** 6 hex-ів, Montserrat 3 ваги, ізометричні куби, жодних Pictorial/Rubikon leaks (CI-denylist enforces).
3. **Cinematic-відчуття** без WebGL — Motion `useScroll` parallax + `whileInView` reveal + smooth route-transitions, respects `prefers-reduced-motion`.
4. **Чесність стадій:** 0-здано, 1-активно (Lakeview flagship-external redirect), 3-pipeline (Етно Дім full-internal, Маєток+NTEREST grid-only), 1-aggregate (Pipeline-4).
5. **Lighthouse desktop ≥ 90** усі 4 категорії на всіх 5 роутах; hero ≤ 200 KB; bundle ≤ 200 KB gzipped JS.
6. **Persona-3 (банк DD) deep-link: юр. реквізити (ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019, email vygoda.sales@gmail.com)** на КОЖНІЙ сторінці у футері.

### 1.3 Non-Goals (explicit — see PROJECT.md §Out of Scope)

- Next.js / SSR / Sanity / будь-який CMS у v1.
- Mobile/tablet повний responsive (<1024px = dedicated fallback-сторінка).
- Three.js / WebGL / Spline / відео-hero.
- Бекенд форм (тільки `mailto:`); аналітика GA4/GTM/Pixel; privacy-policy.
- Team-photos / імена / обличчя (hard-rule клієнта).
- Повноцінна внутрішня сторінка Lakeview (тільки мініатюра + редирект).
- EN/RU мови; Apartment picker; Awards; Live chat.

### 1.4 User Personas (from CONTEXT.md / CONCEPT §3)

| # | Persona | Context | Primary need | Entry path |
|---|---------|---------|--------------|------------|
| **P1** | Інвестор у дохідну нерухомість (40–55) | Диверсифікує капітал, шукає Lakeview-типи проектів | Підтвердження юр. здатності + чіткий pipeline | `/` → `/projects` → Lakeview external |
| **P2** | Покупець для життя (30–45, власний побут) | Ставить на «зʼїду пізніше», потребує довіри | Доказ «ми збудуємо те, що обіцяємо» | `/` → `/construction-log` → `/contact` |
| **P3** | Банк / DD спеціаліст | Перевіряє забудовника по Google перед кредитуванням | Юр. факти без маркетингу | Deep-link на `/zhk/:slug` або `/contact`, сканує футер |
| **P4** | Ріелтор / брокер | Партнер-канал, шукає матеріал для презентації клієнту | Професійний look + стабільність бренду | `/` → `/projects` → screenshot |
| **P5** | Потенційний співробітник / підрядник | Перевіряє чи «проект реальний» | Активність + професіоналізм | `/construction-log` — головний доказ |

### 1.5 Feature List (v1 — Core-4 MVP)

Priority: **P0 = must-have to ship**, **P1 = should-have (ship-blocking if missed at handoff)**, **P2 = nice-to-have**. Status reflects `.planning/REQUIREMENTS.md` Traceability as of 2026-04-24.

| REQ-ID | Feature | P | Acceptance Criteria (from ROADMAP success-criteria) | Depends on | Status |
|--------|---------|---|------------------------------------------------------|------------|--------|
| VIS-01 | 6-колір брендові токени в `@theme` | P0 | `grep -rE "#[0-9A-Fa-f]{6}" src/` ⊆ 6 canonicals, нуль Tailwind defaults | — | ✅ Phase 1 |
| VIS-02 | Montserrat cyrillic 400/500/700 | P0 | `ЖК`, `ВИГОДА`, `Маєток Винниківський` рендериться без latin-overhead | VIS-01 | ✅ Phase 1 |
| NAV-01 | Nav (dark) + Footer з юр. реквізитами на всіх 5 роутах | P0 | Keyboard Tab показує `:focus-visible` 2px `#C1F33D`; футер містить ЄДРПОУ 42016395 | VIS-01 | ✅ Phase 1 |
| DEP-03 | HashRouter + `base: '/vugoda-website/'` + `.nojekyll` | P0 | Усі 5 роутів клікабельні з URL `/#/…` | — | ✅ Phase 1 |
| CON-01 | Contents modules (methodology, values, company, placeholders) | P0 | 0 raw Ukrainian paragraphs в JSX; ⚠-flags на §8 блоки 2/5/6 | — | ✅ Phase 2 |
| CON-02 | `src/data/projects.ts` typed + 10 synthetic fixtures | P0 | Adding ЖК #6 = one-record PR; `/dev/grid` рендерить N=4,6,8,10 без зламу | — | ✅ Phase 2 |
| ZHK-02 | Discriminated `presentation` union | P0 | 4 Stage × 4 Presentation покриті fixtures | CON-02 | ✅ Phase 2 |
| QA-04 | CI denylist (Pictorial/Rubikon, hex drift, `{{`/TODO) | P0 | `postbuild` script blokує build при violation | — | ✅ Phase 2 |
| **HOME-01** | Hero з wordmark + slow-parallax + CTA | **P0** | Slogan verbatim з brand-system §1 («Системний девелопмент, у якому цінність є результатом точних рішень.»); Motion `useScroll`+`useTransform`, <120px translation, ease-out `[0.22,1,0.36,1]` no bounce; `<picture>` AVIF→WebP→JPG; preload hero. **⚠ Wordmark case (uppercase «ВИГОДА» vs lowercase «вигода») — client sign-off required** (brand-system §4 lowercase-discipline vs concept §7.1 uppercase prototype) | VIS-01/02, CON-02 | 🟡 Phase 3 |
| **HOME-02** | Bлок 4 цінностей | **P0** | Читає `content/values.ts`; cards з RevealOnScroll stagger 80 ms | CON-01 | 🟡 Phase 3 |
| **HOME-03** | PortfolioOverview (Flagship + 3 pipeline + aggregate) | **P0** | Читає `data/projects.ts` derived views; FlagshipCard ≠ PipelineCard візуально | CON-02 | 🟡 Phase 3 |
| **HOME-04** | ConstructionTeaser (3–5 фото з mar-2026) | **P0** | Читає `latestMonth().teaserPhotos`; CTA → `/construction-log` | Phase 2 | 🟡 Phase 3 |
| **HOME-05** | MethodologyTeaser (2–3 блоки з §8) | **P0** | ⚠-marker рендериться як data field, не string | CON-01 | 🟡 Phase 3 |
| **HOME-06** | TrustBlock (юр. реквізити) | **P0** | Читає `content/company.ts`; no photos, no faces | CON-01 | 🟡 Phase 3 |
| **HOME-07** | ContactForm (mailto) | **P0** | `mailto:vygoda.sales@gmail.com` з preset subject/body | — | 🟡 Phase 3 |
| **VIS-03** | IsometricCube 3 variants + IsometricGridBG | **P0** | Typed `variant: 'single'\|'group'\|'grid'` + `stroke ∈ 3 hexes`; cube-ladder semantic (§5.2) | VIS-01 | 🟡 Phase 3 |
| **VIS-04** | Official Logo/Mark/Favicon SVG через `vite-plugin-svgr` АБО URL-import | **P0** | Logo/Mark: URL-import from `brand-assets/` (Phase 1 pattern, if `dist/assets/*.svg` verified) OR svgr `?react` (for cube-variants needing props). **No re-coded paths** (Anti-Pattern 4). Favicon: `brand-assets/favicon/favicon-32.svg` → `public/favicon.svg` copy or direct reference | — | 🟡 Phase 3 |
| **ANI-01** | Hero parallax (Motion useScroll) | **P0** | ease-out [0.22,1,0.36,1], duration 1200ms, respects reduced-motion | Phase 3 primitives | 🟡 Phase 3 |
| **HUB-01** | `/projects` 4-bucket StageFilter | **P0** | «Здано (0)» візуально present як empty з cube-marker | CON-02 | 🟡 Phase 4 |
| **HUB-02** | Lakeview FlagshipCard з external CTA | **P0** | `rel="noopener"` на `yaroslavpetrukha.github.io/Lakeview/` | CON-02 | 🟡 Phase 4 |
| **HUB-03** | 3-в-ряд pipeline сітка | **P0** | stage labels із §2 канонічно («меморандум», не синоніми) | CON-02 | 🟡 Phase 4 |
| **HUB-04** | AggregateRow Pipeline-4 | **P0** | Text verbatim з `projects.ts#aggregateText` + `<IsometricCube variant="single">` marker, без візуалу. CTA «підписатись на оновлення» = v2 (concept §5.2 recommendation, not v1 REQ) | CON-02 | 🟡 Phase 4 |
| **ZHK-01** | `/zhk/etno-dim` template (hero + fact + what's happening + 8-render gallery + CTA) | **P0** | `findBySlug()` гейтить `presentation === 'full-internal'`; lakeview/maietok/nterest → `<Navigate>` | CON-02 | 🟡 Phase 4 |
| **LOG-01** | `/construction-log` 50 фото, groups по місяцях | **P0** | Native `<dialog>` lightbox, `loading="lazy"` below fold | Phase 2 | 🟡 Phase 4 |
| **LOG-02** | Короткі caption/alt у brand tone | **P0** | «Січень 2026 — фундамент, секція 1» стиль | CON-01 | 🟡 Phase 4 |
| **CTC-01** | `/contact` (mailto, phone/address=`—`, socials `#`) | **P0** | `{{token}}` → `—` (visible placeholder), не `{{…}}` | CON-01 | 🟡 Phase 4 |
| **ANI-03** | Hover-стани карток ЖК (subtle ≤1.02 scale) | P1 | no springs, brand ease-out 200ms | Phase 4 cards | 🟡 Phase 4 |
| **ANI-02** | Scroll-reveal wrapper `<RevealOnScroll>` | **P0** | Shared variants у `lib/motionVariants.ts`; 0 inline `transition={{…}}` | Phase 3 | 🟡 Phase 5 |
| **ANI-04** | Smooth route-transitions (AnimatePresence mode="wait") | **P0** | Keyed on `pathname`; respects `useReducedMotion`; session-skip на revisit | Phase 3, 4 | 🟡 Phase 5 |
| **QA-01** | Desktop-first 1920×1080; 1280px graceful; <1024px fallback | **P0** | Dedicated `MobileFallback.tsx` (single column) | Phase 4 | 🟡 Phase 6 |
| **QA-02** | Lighthouse desktop ≥ 90 на всіх 5 роутах | **P0** | Archived report per route; hero ≤ 200 KB; bundle ≤ 200 KB gzipped | Phase 5 | 🟡 Phase 6 |
| **QA-03** | OG + Twitter Card + `theme-color` + canonical | **P0** | 1200×630 OG render; unfurl в Viber/TG/Slack | Phase 3 hero | 🟡 Phase 6 |
| **DEP-01** | GitHub Actions `deploy.yml` з `actions/deploy-pages@v4` | **P0** | Runs on push to main; триггерить `prebuild` translit + `postbuild` check-brand | QA-04 | 🟡 Phase 6 |
| **DEP-02** | Публічний URL живий | **P0** | Incognito cold-tab усі 5 URL працюють | DEP-01 | 🟡 Phase 6 |
| (verification) | Phase 7 checklist | **P0** | Keyboard walkthrough, hard-refresh, axe-core, denylist, handoff doc | all | 🟡 Phase 7 |
| **DEV-01** | Hidden `/dev/brand` — visual QA всіх brand primitives (Logo/Mark/IsometricCube 3 variants/IsometricGridBG) | P1 | Not linked from production Nav; `robots.txt disallow` Phase 6 | VIS-03, VIS-04 | 🟡 Phase 3 |
| **DEV-02** | Hidden `/dev/grid` — stress test 10 synthetic ЖК через fixtures | P1 | Grid reflows N=4,6,8,10 без зламу; stage-to-badge default на unknown | CON-02 | 🟡 Phase 4 |

### 1.6 Out of Scope (v1)

Повний перелік — у `.planning/PROJECT.md §Out of Scope` і `.planning/REQUIREMENTS.md §Out of Scope`. Ключові відсічки:

- CMS (Sanity) · SSR · backend форм · аналітика · privacy-policy
- Mobile responsive (повний) · apartment-picker · mortgage calc · agent finder
- Team photos · Pictorial/Rubikon-рендери · stock photos чужих будинків
- `/about` · `/how-we-build` · `/buying` · `/investors` · `/news` · `/faq` · `/documents` · `/partners` повні сторінки
- EN/RU мови · reviews · awards

---

## 2. Technical Architecture

### 2.1 System Overview

```
┌────────────────── Build time (Vite 6 + Node 20.19) ─────────────────┐
│                                                                      │
│  [prebuild]   scripts/copy-renders.ts                                │
│   ├─ translit /renders/ЖК …/ → /public/renders/{slug}/               │
│   └─ copy /construction/{dec-2025…mar-2026}/ → /public/construction/ │
│                                                                      │
│  [build]      vite build (tsc --noEmit → esbuild → Rollup → dist/)   │
│   ├─ plugin-react (JSX + Fast Refresh)                               │
│   ├─ @tailwindcss/vite (@theme → CSS utilities)                      │
│   └─ vite-plugin-svgr (brand-assets/*.svg → React components)        │
│                                                                      │
│  [postbuild]  scripts/check-brand.ts                                 │
│   └─ CI denylist: Pictorial|Rubikon / hex ⊄ 6 / {{…}} / TODO         │
│                                                                      │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ actions/upload-pages-artifact@v3
                                 │ actions/deploy-pages@v4
                                 ▼
┌────────────────── Runtime (browser) ────────────────────────────────┐
│                                                                      │
│  HashRouter (`/vugoda-website/#/…`) — DEP-03 decision                │
│    └─ <Layout>                                                       │
│       ├─ <Nav>            (sticky, `#2F3640`, dark-SVG logo)         │
│       ├─ <AnimatePresence mode="wait" initial={false}>               │
│       │   ├─ <HomePage>                                              │
│       │   ├─ <ProjectsPage>     ───┐                                 │
│       │   ├─ <ZhkPage :slug>    ───┤ all import from                 │
│       │   ├─ <ConstructionLogPage>─┤ src/data/ + src/content/        │
│       │   └─ <ContactPage>      ───┘ (no fetch, bundle-time)         │
│       └─ <Footer>         (юр. реквізити on every page — NAV-01)     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack (with rationale — див. `.planning/research/STACK.md`)

| Layer | Choice | Version pin | Rationale |
|-------|--------|-------------|-----------|
| Runtime | React 19 + React DOM | `^19.2.0` | Inherit зі прототипу; 19.2 stable; Motion 12 + Router 7 peer-OK |
| Build | Vite 6 + @vitejs/plugin-react 5 | `^6.3.6` / `^5.2.0` | v8 потребує Rolldown + React Compiler — передчасна складність для 5 сторінок |
| Styling | Tailwind v4 + @tailwindcss/vite | `^4.2.4` | CSS-first `@theme` — ідеально для 6-color closed palette; утиліти генеруються з токенів |
| Animation | Motion | `^12.38.0` | framer-motion successor; `useScroll`, `whileInView`, `AnimatePresence`, `useReducedMotion` — все потрібне |
| Routing | react-router-dom 7 (**HashRouter**) | `^7.14.0` | HashRouter усуває 404-on-hard-refresh на GH Pages без трюку з 404.html |
| Fonts | @fontsource/montserrat (static) | `^5.2.8` | Cyrillic-400/500/700 entry points перевірено в tarball; ~60-80 KB total |
| Icons | lucide-react | `^1.11.0` | Outline-only estetics сумісна з брендом |
| SVG | vite-plugin-svgr | `^4.3.0` | Brand logos як React-components (`?react`); single-source-of-truth SVG |
| TS | TypeScript (type-check only) | `~5.8.3` | Vite транспілює через esbuild; `tsc --noEmit` — корректність, без emit |
| Script runner | tsx | `^4.21.0` | Запускає `scripts/*.ts` з Node 20.19 без складної конфігурації |
| Deploy | actions/deploy-pages@v4 + upload-pages-artifact@v3 | pinned in YAML | Native GH path з OIDC; НЕ `gh-pages` npm |
| Image pipeline | sharp (manual script, Path A) | `^0.34.5` | Pre-compute `{640,1280,1920}×{avif,webp,jpg}`; вбудований в `copy-renders.ts` або окремий `optimize-images.mjs` |

**NOT used:** Next.js, Three.js, framer-motion (деprecated name), emotion/styled-components, classnames, react-helmet, swiper, react-hook-form+zod, redux/zustand, react-query, axios, dotenv, moment/date-fns, **будь-який CMS**, GA4/Pixel, autoprefixer, ESLint (MVP), Vitest, Playwright (опц. Phase 7), Storybook.

### 2.3 Data Model (implemented у Phase 2 — див. `src/data/types.ts`)

```ts
// src/data/types.ts — Single Source of Truth for data shapes
export type Stage =
  | 'u-rozrakhunku'   // У розрахунку (кошторисна вартість/документація)
  | 'u-pogodzhenni'   // У погодженні (меморандум/дозвільна)
  | 'buduetsya'       // Будується
  | 'zdano';          // Здано (0 зараз)

export type Presentation =
  | 'flagship-external'  // Lakeview only: external redirect, no /zhk page
  | 'full-internal'      // Etno Dim: /zhk/{slug} full template
  | 'grid-only'          // Maietok, NTEREST: card on hub, no page
  | 'aggregate';         // Pipeline-4: no card, AggregateRow text only

export interface Project {
  slug: string;
  title: string;
  stageLabel: string;
  stage: Stage;
  presentation: Presentation;
  location?: string;
  externalUrl?: string;
  renders: string[];
  facts?: { sections?: number; floors?: string; area?: string; deadline?: string; note?: string };
  whatsHappening?: string;
  aggregateText?: string;
  order: number;
}

export interface ConstructionMonth {
  key: 'dec-2025' | 'jan-2026' | 'feb-2026' | 'mar-2026' | string;
  label: string;        // «Березень 2026»
  yearMonth: string;    // '2026-03'
  photos: Array<{ file: string; caption?: string; alt?: string }>;
  teaserPhotos?: string[];  // only on latestMonth() for HomePage teaser
}
```

**Derived views** (в `src/data/projects.ts`) — consumers ніколи не фільтрують `projects[]` напряму:
- `flagship` — Lakeview (find by `presentation === 'flagship-external'`)
- `pipelineGridProjects` — Etno Dim + Maietok + NTEREST (sort by `order`)
- `aggregateProjects` — Pipeline-4 text row
- `detailPageProjects` — тільки `full-internal` (зараз тільки Etno Dim)
- `findBySlug(slug)` — gate на `presentation === 'full-internal'`, інакше `undefined` → `<Navigate>` у ZhkPage

### 2.4 API Contract

**None.** Це static SPA — немає серверних endpoint-ів. Два зовнішні «integration points»:

| # | Integration | Direction | Failure mode |
|---|-------------|-----------|--------------|
| 1 | `mailto:vygoda.sales@gmail.com` (CTC-01, HOME-07) | Browser → user's mail client | Якщо немає mail-клієнта — CTA все ще показує email textом (copy-friendly) |
| 2 | `https://yaroslavpetrukha.github.io/Lakeview/` (HUB-02) | External `<a target="_blank" rel="noopener">` | Якщо Lakeview лендинг впаде — корп-сайт не деградує; CTA відкриває новий таб |

### 2.5 Authentication Strategy

**None needed.** Сайт — публічний read-only marketing surface. Доступ до CI/deploy — GitHub OIDC через `actions/deploy-pages@v4` (id-token:write permission у `deploy.yml`). Жодних session/JWT/OAuth для end-users.

### 2.6 Performance Targets (hard budget — QA-02)

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Lighthouse Performance / Accessibility / Best Practices / SEO (desktop) | **≥ 90 each (all 4 categories)** — QA-02 hard budget | 5 роутів, архівується у Phase 7 per route; + axe-core zero critical; Brotli/gzip, HTTPS, console clean; Meta, canonical, `<title>` per route |
| LCP | < 2.5 s | Hero `<picture>` preload |
| CLS | < 0.1 | Explicit `width`/`height` на усі `<img>`/`<picture>` |
| INP (replaces FID) | < 200 ms | Motion `will-change` тільки на active elements |
| Hero image | ≤ 200 KB | AVIF or WebP; sharp-encoded |
| JS bundle | ≤ 200 KB gzipped | `React.lazy()` per route у Phase 6 |
| Total page weight `/construction-log` | < 2 MB initial | `loading="lazy"` на 50 фото below fold |

---

## 3. Project Roadmap

**Coverage: 34/34 v1 REQ-IDs mapped.** Ordering rationale: tokens first → data before pages → brand+home together → remaining pages together → animations last → deploy separately → QA as own phase (PITFALLS §Ordering).

| Phase | Features (REQ-IDs) | Dependencies | Estimated duration | Research flag |
|-------|--------------------|--------------|-------------------|---------------|
| 1. Foundation & Shell | VIS-01, VIS-02, NAV-01, DEP-03 | — | ✅ done | SKIP |
| 2. Data Layer & Content | CON-01, CON-02, ZHK-02, QA-04 | Phase 1 | ✅ done | SKIP |
| **3. Brand Primitives & Home** | HOME-01..07, VIS-03, VIS-04, ANI-01, **DEV-01** | Phases 1–2 | **1.5–2 days** | **NEEDS SPIKE** — Motion 12.x `useScroll`+`useTransform` (30 min); svgr v4 `?react` **verify-only** (vite-plugin-svgr already installed+configured, need to confirm `?react` import works) |
| **4. Portfolio, ЖК, Log, Contact** | HUB-01..04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03, **DEV-02** | Phase 3 | **2–2.5 days** | OPTIONAL — native `<dialog>` lightbox fallback |
| **5. Animations & Polish** | ANI-02, ANI-04 | Phase 4 | **0.5–1 day** | **NEEDS SPIKE** — Motion `AnimatePresence` × Router 7 outlet pattern, `useReducedMotion` export |
| **6. Performance, Mobile Fallback, Deploy** | QA-01, QA-02, QA-03, DEP-01, DEP-02 | Phase 5 | **1 day** | SKIP |
| **7. Post-deploy QA & Handoff** | (verification — всі prior REQ-IDs) | Phase 6 | **0.5 day** | SKIP |

**Dependency chain** is strictly sequential; within a phase, `config.json:parallelization=true` дозволяє паралельні плани (напр., Phase 3: brand-primitives можна робити паралельно з секціями Home, які їх ще не споживають).

---

## 4. Agents & Skills Map per Phase

> Мапа зроблена з огляду на наявні глобальні агенти (`/Users/admin/.claude/agents/`) і скіли (`/Users/admin/.claude/skills/`) + project-local GSD skills. **Мета — не викликати агентів «про всяк випадок»**, а лише там, де вони сильніші за inline-роботу або дають `parallelization`-ефект.
>
> **Загальне правило (CLAUDE.md):** вхід у роботу — через GSD-команди (`/gsd:quick`, `/gsd:debug`, `/gsd:execute-phase`), а не прямі edit-и. Спеціалізовані агенти викликаються **всередині GSD-фази**, коли потрібна експертиза, яку не покриває gsd-executor.

### Phase 3 — Brand Primitives & Home Page

**Entry:** `/gsd:plan-phase 03-brand-primitives-home` → `/gsd:execute-phase`

| Stage | Agent / Skill | Purpose | Invocation |
|-------|---------------|---------|------------|
| Research spike (Motion 12.x API, svgr v4 verify) | `gsd-phase-researcher` | Verify `useScroll`+`useTransform` signatures, `motion/react` imports. **svgr verify-only**: `vite-plugin-svgr@4.3` вже installed + configured в `vite.config.ts` (include `'**/*.svg?react'`) — потрібно 30-min verify що `import Grid from 'brand-assets/patterns/isometric-grid.svg?react'` рендериться з пропами | Auto by `/gsd:plan-phase` (flag NEEDS SPIKE) |
| **Image pipeline setup (NEW separate script)** | `gsd-executor` | Створити `scripts/optimize-images.mjs` (sharp, ~60 LOC) — reads `/renders/{slug}/*.{jpg,png,webp}`, emits `public/renders/{slug}/{name}-{640,1280,1920}.{avif,webp,jpg}`. `npm run optimize:images` manual (not in prebuild — dev slowdown). Commit outputs. **НЕ змінюємо `copy-renders.ts`** | New `02-06-image-pipeline` plan **OR** first plan of Phase 3 |
| Brand-assets URL-import verify | `gsd-executor` | `npm run build && ls dist/assets/ \| grep svg` — переконатись що Logo.tsx `../../../brand-assets/logo/dark.svg` import потрапляє у `dist/assets/`. Якщо fail — move `brand-assets/logo/dark.svg` → `public/brand/logo/dark.svg` + fix Logo.tsx `<img src={assetUrl('/brand/logo/dark.svg')}>` | Phase 3 Plan 01 first task |
| UI design contract | `gsd-ui-researcher` + **skill `ui-ux-pro-max`** | Produce `UI-SPEC.md` для Home (7 sections layout, 1920×1080 grid, spacing rhythm, hero composition) | `/gsd:ui-phase 03-brand-primitives-home` |
| Brand invariants QA | **agent `design-brand-guardian`** | Перед і після кожного брандового примітиву: палета ⊆ 6, Montserrat only, ізометричні куби правила (stroke 0.5–1.5pt, 3 allowed hexes, opacity 5–60%) | Delegate review: "verify `IsometricCube.tsx`, `Logo.tsx`, `Wordmark.tsx` проти `brand-system.md` + CONCEPT §5.2" |
| Home page implementation (7 секцій паралельно) | `gsd-executor` (main) + **agent `engineering-frontend-developer`** for Hero parallax | Hero — найскладніша секція (Motion `useScroll`); решта 6 — straight React consume `data/` + `content/` | Sub-agent for Hero only; inline для інших секцій |
| Image pipeline | `gsd-executor` with **skill `ui-ux-pro-max`** (image guidance) | `<ResponsivePicture>` з AVIF→WebP→JPG, sharp-encoding у `copy-renders.ts` розширенні | Inline; skill consulted для srcset breakpoints |
| Accessibility review (colors, focus, alt) | **agent `testing-accessibility-auditor`** | Pre-merge: axe-core per section, `#A7AFBC` only ≥14pt, `#C1F33D` never on light | Before plan-completion on Home |
| Plan verification | `gsd-plan-checker` → `gsd-verifier` | Goal-backward check: кожен з 7 секцій відповідає HOME-xx acceptance | Auto by GSD |
| UI audit (retroactive) | `gsd-ui-auditor` + **skill `web-design-guidelines`** | Score Home page проти 6 pillars | `/gsd:ui-review` після Phase 3 |

**Parallel wave** (within Phase 3):
- Wave A (brand foundation): `Logo.tsx` (verify URL-import), `Mark.tsx`, `IsometricCube.tsx` (variant `single`/`group`/`grid` — `grid` = svgr `?react` from `brand-assets/patterns/isometric-grid.svg`), `IsometricGridBG.tsx`, `ResponsivePicture.tsx`
- Wave B (sections — after A): `HeroWordmark.tsx` (у `components/sections/home/` — **великий uppercase «ВИГОДА» display-typography**, НЕ brand primitive, бо це порушило б brand-system.md §4 lowercase-discipline для лого; потрібен client sign-off), `Hero` (composition of HeroWordmark + IsometricGridBG + parallax, sequential), `BrandEssence`, `PortfolioOverview`, `ConstructionTeaser`, `MethodologyTeaser`, `TrustBlock`, `ContactForm`
- Wave C (integration): `HomePage.tsx` композиція + `/dev/brand` hidden route (DEV-01) для QA

---

### Phase 4 — Portfolio, ЖК, Construction Log, Contact

**Entry:** `/gsd:plan-phase 04-portfolio-zhk-log-contact` → `/gsd:execute-phase`

| Stage | Agent / Skill | Purpose | Invocation |
|-------|---------------|---------|------------|
| UI contract для 4 сторінок | `gsd-ui-researcher` + **skill `ui-ux-pro-max`** | `UI-SPEC.md`: StageFilter UX, FlagshipCard vs PipelineCard hierarchy, lightbox pattern, MobileFallback preview | `/gsd:ui-phase 04-…` |
| Implementation (4 сторінки паралельно) | `gsd-executor` (main) + **agent `engineering-frontend-developer`** для складних (StageFilter + lightbox) | Решта — straight React consume `data/` derived views + `content/` modules | Delegate лише StageFilter + `<dialog>` lightbox логіку |
| Content tone-of-voice review | **skill `copy-editing`** | Перевірити caption/alt тексти construction log проти brand ToV («стримано, предметно») — no «мрія/найкращий/унікальний» | Before LOG-02 merge |
| Accessibility на `/construction-log` | **agent `testing-accessibility-auditor`** | `<dialog>` focus-trap, `Esc` close, alt-текст кожне з 50 фото, keyboard cycle через gallery | Before phase completion |
| Grid stress test | `gsd-executor` | `/dev/grid` з fixtures на N=4,6,8,10 — reflow, stage-to-badge lookup | Inline у Phase 4, частина ZHK-02 verification |
| Plan verification | `gsd-plan-checker` → `gsd-verifier` | Goal-backward | Auto |
| UI audit | `gsd-ui-auditor` + **skill `web-design-guidelines`** | After Phase 4 | `/gsd:ui-review` |

---

### Phase 5 — Animations & Polish

**Entry:** `/gsd:plan-phase 05-animations-polish`

| Stage | Agent / Skill | Purpose | Invocation |
|-------|---------------|---------|------------|
| Research spike | `gsd-phase-researcher` | Verify Motion 12.x `AnimatePresence mode="wait"` compatibility з `react-router-dom@7` `<Outlet>`; `useReducedMotion` export path | Auto (NEEDS SPIKE flag) |
| Motion SOT implementation | `gsd-executor` | `src/lib/motionVariants.ts` — fadeUp / stagger / pageFade / parallaxSlow з shared eases/durations. **`useReducedMotion` імпортимо напряму з `motion/react`**, не обгортаємо власним hook (немає `src/hooks/` директорії у v1 — рішення) | Inline |
| Animation consistency audit | **agent `engineering-senior-developer`** OR `gsd-executor` з **skills `gsap-core` + `gsap-performance`** (референс-патерни animation performance, переносяться в Motion) | `grep -r "transition={{" src/` ↦ 0; перевірка `will-change` не розтікається; 60fps на 1920×1080 Chrome | Delegate якщо jank з'являється |
| Reduced-motion honor | `gsd-executor` | `useReducedMotion()` honored у Hero parallax, `RevealOnScroll`, `AnimatePresence` — при `prefers-reduced-motion: reduce` rendering instant без variants | Inline |
| **Session-skip implementation** | `gsd-executor` | `sessionStorage.getItem('hero-seen')` check — на second+ visit у сесії hero parallax 2× faster (або skip зовсім); set flag у Hero useEffect. **ROADMAP Phase 5 Success #5** | Inline |
| ScrollToTop × AnimatePresence coordination | `gsd-phase-researcher` (30 min spike) | Existing `ScrollToTop.tsx` (Phase 1) + `AnimatePresence mode="wait"` — scroll reset має відбуватись після exit завершення, не до нього (інакше flash) | Before plan-completion |
| Accessibility final pass | **agent `testing-accessibility-auditor`** | prefers-reduced-motion smoke test, keyboard nav під час page-transitions | End of phase |
| Performance pre-check | **agent `testing-performance-benchmarker`** | Motion overhead на 1920×1080 (target: no jank на scroll, <200KB JS bundle) | End of phase |

---

### Phase 6 — Performance, Mobile Fallback, Deploy

**Entry:** `/gsd:plan-phase 06-perf-mobile-deploy`

| Stage | Agent / Skill | Purpose | Invocation |
|-------|---------------|---------|------------|
| Performance audit | **agent `testing-performance-benchmarker`** | Bundle-size analysis (≤200KB gzipped), per-route `React.lazy()`, hero-image ≤200KB | Before deploy.yml activation |
| Mobile fallback UX | **agent `design-ux-architect`** + **skill `ui-ux-pro-max`** | Design single-column `<1024px` fallback (logo + wordmark + text + 4 CTA links stacked) | Inline with consultation |
| SEO meta wiring | **skill `schema-markup`** + **skill `seo-technical`** | OG meta + Twitter Card + JSON-LD `Organization` (ТОВ БК ВИГОДА ГРУП + ЄДРПОУ) + canonical + `theme-color` | Inline |
| OG image generation (sharp composite, NOT AI) | **skill/agent `design-visual-storyteller`** (composition review) + sharp | 1200×630 **static composite**: dark `#2F3640` bg + Montserrat Bold «ВИГОДА» wordmark + `<IsometricGridBG>` SVG overlay (opacity 0.15) + дескриптор «системний девелопмент» `#A7AFBC`. Рендеримо через headless Chromium screenshot OR sharp `composite()` з pre-rendered elements. **НЕ генеруємо через AI prompt** — brand-system.md §6 DON'T: «стокові «смайлові» ілюстрації» | Sharp script у Phase 6 |
| GitHub Actions deploy verify | **agent `engineering-devops-automator`** | `deploy.yml` **уже scaffolded** у Phase 1 + `Check brand invariants` step додано Phase 2-05. Phase 6 = (1) `gh repo view` перевірити Pages settings enabled; (2) перша deploy run на staging repo; (3) smoke test public URL | Before first live deploy |
| Lighthouse validation | **agent `testing-performance-benchmarker`** | Archived reports per 5 routes проти бюджету (Perf/A11y/BP/SEO ≥ 90) | After deploy |
| Plan verification | `gsd-plan-checker` → `gsd-verifier` | | Auto |

---

### Phase 7 — Post-deploy QA & Client Handoff

**Entry:** `/gsd:plan-phase 07-qa-handoff` → `/gsd:validate-phase` для Nyquist gap-fill

| Stage | Agent / Skill | Purpose | Invocation |
|-------|---------------|---------|------------|
| Hard-refresh deep-link smoke | **agent `testing-evidence-collector`** | Cold incognito tab на всі 5 роутів + `/#/zhk/unknown` 404 — screenshot evidence | Inline Phase 7 |
| Keyboard-only walkthrough | **agent `testing-accessibility-auditor`** | Tab + Enter на всіх interactive elements; `:focus-visible` видимість на dark-bg; `Esc` на dialog | End of phase |
| axe-core + SEO final | **skill `seo-audit`** + **skill `seo-content`** | Technical SEO audit deployed URL; no CLS, canonical correct | End of phase |
| Denylist grep | `gsd-executor` | `grep -r "Pictorial\|Rubikon"` на `dist/`; `{{` `TODO` на `dist/` — все порожнє | Inline |
| Client handoff doc | **agent `engineering-technical-writer`** + **agent `support-executive-summary-generator`** | `docs/CLIENT-HANDOFF.md` — 8 CONCEPT §11 open items для one-pass client answer | End of phase |
| Reality check | **agent `testing-reality-checker`** | Default «NEEDS WORK», вимагає overwhelming proof for production-readiness | Final gate перед client URL handoff |
| Integration check | `gsd-integration-checker` | Перевірка що всі 7 phases з'єднуються — E2E flows (Home → Projects → ЖК → Contact) | Auto |

---

### Agents / skills які НЕ викликаємо (свідомо skip)

| Category | Item | Reason |
|----------|------|--------|
| AI image gen | `design-image-prompt-engineer` | brand-system.md §6 DON'T: «стокові «смайлові» ілюстрації»; OG-image композитний sharp, не AI (див. D3 audit) |
| Marketing | `marketing-*`, skills `paid-ads`, `seo-programmatic`, `ai-seo`, `cold-email`, `content-strategy`, `email-sequence` | Demo-URL handoff ≠ marketing launch; marketing задачі — клієнтська фаза після sign-off |
| Growth | `growth-hacker`, skills `ab-test-setup`, `referral-program`, `churn-prevention` | Static demo without users/analytics |
| 3D / XR | `threejs-*`, `unity-*`, `unreal-*`, `xr-*`, `macos-spatial-metal-engineer`, `visionos-*` | Concept §9 явно: «Three.js надлишковий»; desktop web SPA only |
| Gaming | `game-*`, `godot-*`, `level-designer`, `narrative-designer`, `roblox-*` | Off-domain |
| Backend/Data | `backend-architect`, `database-optimizer`, `data-engineer`, `ai-engineer`, `blockchain-security-auditor`, `accounts-payable-agent` | Zero backend у MVP |
| Platform-specific | `weixin-*`, `douyin-*`, `bilibili-*`, `wechat-*`, `baidu-*`, `kuaishou-*`, `xiaohongshu-*`, `zhihu-*`, `weibo-*` | UA market only |
| Sales | `sales-*`, `deal-strategist`, `pipeline-analyst` | Not sales website |
| Mobile native | `mobile-app-builder`, `wechat-mini-program-developer` | Web SPA, mobile fallback only |
| `gsap-*` (крім performance reference) | More reference than invocation; ми на Motion 12.x | Consult як reference якщо jank, не як primary toolchain |
| `threejs-*` | Explicitly excluded by CONCEPT §9 |
| `ui-ux-pro-max` **action: build** | Use for planning/design guidance **only**; не дозволяємо скілу власноруч генерувати компоненти — вони не знайомі з brand-system.md закритою палітрою |

---

## 5. Folder / File Structure

Фактичний tree (частково створено у Phase 1–2; Phase 3+ заповнює `components/`, `pages/` тіла, `lib/`).

```
vugoda-website/
├── .planning/                      # GSD artifacts (existing)
│   ├── PROJECT.md · REQUIREMENTS.md · ROADMAP.md · STATE.md
│   ├── PLAN.md                     # ← цей файл
│   ├── config.json
│   ├── research/ (SUMMARY · STACK · ARCHITECTURE · FEATURES · PITFALLS .md)
│   └── phases/
│       ├── 01-foundation-shell/    [DONE: 5/5 plans]
│       ├── 02-data-layer-content/  [DONE: 5/5 plans]
│       ├── 03-brand-primitives-home/         [NEXT]
│       ├── 04-portfolio-zhk-log-contact/
│       ├── 05-animations-polish/
│       ├── 06-perf-mobile-deploy/
│       └── 07-qa-handoff/
│
├── .github/workflows/
│   └── deploy.yml                  # actions/deploy-pages@v4 (Phase 1 scaffold, Phase 6 activates)
│
├── brand-assets/                   # Authoring surface — canonical SVG/PNG
│   ├── logo/ (dark.svg, primary.svg, …)
│   ├── mark/ (mark.svg)
│   ├── favicon/ (favicon-32.svg)
│   ├── patterns/ (isometric-grid.svg)
│   └── brandbook/
│
├── construction/                   # Authoring surface — 50 фото Lakeview
│   ├── dec-2025/ · jan-2026/ · feb-2026/ · mar-2026/
│   └── _social-covers/             # ❌ forbidden (brand conflict, CONCEPT §7.9)
│
├── renders/                        # Authoring surface — ЖК рендери
│   ├── likeview/                   # → translit to public/renders/lakeview/
│   ├── ЖК Етно Дім/                # → etno-dim
│   ├── ЖК Маєток Винниківський/    # → maietok-vynnykivskyi
│   └── Дохідний дім NTEREST/       # → nterest
│
├── public/                         # Vite-served verbatim
│   ├── .nojekyll                   # (DEP-03)
│   ├── favicon.svg
│   ├── renders/                    # pre-build cp from /renders (transliterated)
│   └── construction/               # pre-build cp from /construction (ASCII names)
│
├── scripts/
│   ├── copy-renders.ts             # [DONE Phase 2] translit + copy
│   ├── list-construction.ts        # [DONE Phase 2] paste-ready TS helper
│   └── check-brand.ts              # [DONE Phase 2] CI denylist
│
├── src/
│   ├── main.tsx                    # [DONE] StrictMode + HashRouter + <App />
│   ├── App.tsx                     # [DONE] <Layout> + <Routes>
│   ├── index.css                   # [DONE] @theme (6 hexes + Montserrat + motion tokens)
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── layout/                 # [DONE Phase 1]
│   │   │   ├── Layout.tsx · Nav.tsx · Footer.tsx · ScrollToTop.tsx
│   │   ├── brand/                  # [Phase 3 — IsometricCube, IsometricGridBG, Mark expand]
│   │   │   ├── Logo.tsx             # [DONE Phase 1 — URL-import from brand-assets/logo/dark.svg; verify dist/assets/ у Phase 3 first task]
│   │   │   ├── Mark.tsx             # [Phase 3]
│   │   │   ├── IsometricCube.tsx    # [Phase 3 — variant: single/group/grid; grid = svgr ?react from brand-assets/patterns/isometric-grid.svg]
│   │   │   ├── IsometricGridBG.tsx  # [Phase 3 — thin wrapper over IsometricCube variant="grid"]
│   │   │   └── MinimalCube.tsx      # [DONE Phase 1 stub — Phase 3 replaces with IsometricCube]
│   │   ├── sections/               # [Phase 3–4]
│   │   │   ├── home/               # Hero, HeroWordmark (uppercase display-typography — NOT brand primitive), BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm
│   │   │   ├── projects/           # FlagshipCard, PipelineCard, PipelineGrid, StageFilter, AggregateRow
│   │   │   └── zhk/                # ZhkHero, ZhkFactBlock, ZhkWhatsHappening, ZhkGallery
│   │   └── ui/                     # [Phase 3–4]
│   │       ├── Button.tsx · StageBadge.tsx · RevealOnScroll.tsx · ResponsivePicture.tsx
│   │
│   ├── content/                    # [DONE Phase 2] UA copy modules
│   │   ├── methodology.ts · values.ts · company.ts · placeholders.ts
│   │   └── hero.ts                 # [Phase 3 — slogan verbatim з brand-system §1, CTA labels]
│   │
│   ├── data/                       # [DONE Phase 2]
│   │   ├── types.ts · projects.ts · projects.fixtures.ts · construction.ts
│   │
│   ├── lib/                        # [Phase 2 assetUrl, Phase 5 motion]
│   │   ├── assetUrl.ts             # [DONE]
│   │   └── motionVariants.ts       # [Phase 5 — fadeUp/stagger/pageFade/parallaxSlow; shared eases]
│   │
│   # NOTE: no src/hooks/ directory — Motion's useReducedMotion/useScroll/useTransform
│   # imported directly from 'motion/react'. Keeping boundary thin per ARCHITECTURE §1.
│   │
│   ├── pages/                      # [DONE route stubs; Phase 3–4 fill bodies]
│   │   ├── HomePage.tsx · ProjectsPage.tsx · ZhkPage.tsx
│   │   ├── ConstructionLogPage.tsx · ContactPage.tsx · NotFoundPage.tsx
│   │   └── MobileFallback.tsx      # [Phase 6]
│   │
│   └── types/
│       └── svg.d.ts                # [Phase 3] vite-plugin-svgr declarations
│
├── index.html                      # [DONE Phase 1 shell; Phase 6 OG + preload + theme-color]
├── vite.config.ts                  # [DONE] base: '/vugoda-website/', plugins (react, tailwind, svgr Phase 3)
├── tsconfig.json · tsconfig.node.json · tsconfig.scripts.json
├── package.json                    # [DONE] scripts wired (predev/prebuild/postbuild)
├── CLAUDE.md                       # Project instructions
├── CONTEXT.md                      # Developer/client context
├── brand-system.md                 # Palette, typography, graphic system (source of truth)
├── КОНЦЕПЦІЯ-САЙТУ.md              # Original client concept (§7, §8, §10, §11)
└── Вигода_брендбук.{ai,pdf}
```

---

## 6. Definition of Done (per-feature ship criteria)

A feature ships only when **ALL** of:

- [ ] **Acceptance criteria** з §1.5 (PRD) і `.planning/ROADMAP.md` success-criteria — всі виконані.
- [ ] `npm run build` passes (`tsc --noEmit` + Vite build + postbuild `check-brand.ts` 4 invariants зелені: no Pictorial/Rubikon, hex ⊆ 6, no `{{…}}`, no `TODO` в `dist/`).
- [ ] **No console errors** в production build (`npm run preview` на dev-server + browser DevTools Network/Console).
- [ ] **Brand invariants:** `grep -rE "#[0-9A-Fa-f]{6}" src/` ⊆ 6 canonicals; Montserrat тільки cyrillic-400/500/700; ізометричні куби proportions правильні (viewBox `220.6 × 167.4`, 3 allowed stroke colors).
- [ ] **Performance budget:**
  - [ ] Hero image ≤ 200 KB у завантаженому форматі (AVIF or WebP)
  - [ ] Bundle ≤ 200 KB gzipped (`vite build` summary)
  - [ ] LCP < 2.5 s (Lighthouse на deployed URL)
  - [ ] CLS < 0.1
  - [ ] INP < 200 ms
- [ ] **Accessibility (WCAG 2.1 AA):**
  - [ ] axe-core zero critical issues on the route
  - [ ] Keyboard Tab through all interactive — visible `:focus-visible` (2px `#C1F33D`, 2px offset)
  - [ ] `#A7AFBC` text contrast ≥ 5.3:1 only at ≥ 14pt
  - [ ] `#C1F33D` never on light background
  - [ ] Alt text на всі `<img>` (UA default з `list-construction` helper)
- [ ] **Copy tone** compliance — зaboрrнene lex («мрія», «найкращий», «унікальний», «преміальний стиль життя») — 0 matches.
- [ ] **No team photos**, no faces, no staff names.
- [ ] **Single-source-of-truth boundary** (canonical per ARCHITECTURE.md §1 + `projects.ts` @rule):
  - `pages/` ↦ можна імпортити `data/` + `content/`
  - `components/sections/` ↦ можна імпортити `data/` + `content/`
  - `components/{brand,ui,layout}/` ↦ **ніколи** не імпортять `data/` чи `content/` (приймають props)
  - `components/*` ↦ **ніколи** не імпортять `pages/`
  - Assets ↦ **тільки** через `lib/assetUrl.ts` (respects `import.meta.env.BASE_URL`)
  - Verify: `grep -l "import.*from.*\\(data\\|content\\)" src/components/{ui,brand,layout}/` ↦ empty
- [ ] **If rendering UI:**
  - [ ] `/gsd:ui-review` pass (6-pillar audit ≥ 4/6 per pillar)
  - [ ] Visual QA at 1920, 1440, 1366, 1280 widths
  - [ ] Reduced-motion honored (respects `prefers-reduced-motion: reduce`)
- [ ] **GSD verification** pass: `gsd-verifier` goal-backward check — phase goal delivered у codebase, не просто tasks completed.
- [ ] **Git hygiene:** atomic commit per logical task; conventional commit message (`feat(03-01): …`, `fix(04-03): …`); PR-ready branch if using `/gsd:pr-branch`.

---

## 7. Risks (no "TBD" — every unknown is a flagged risk)

| # | Risk | Likelihood | Impact | Mitigation | Owner phase |
|---|------|-----------|--------|------------|-------------|
| R1 | Motion 12.x API drift vs training data (useScroll / whileInView) | MED | HIGH (Phase 3 + 5 both) | Gsd-phase-researcher spike перед Phase 3 та 5; verify `motion/react` imports проти npm-registry docs | Phase 3, 5 |
| R2 | `vite-plugin-svgr@^4.3` import syntax зміни (`?react` suffix) | MED | MED (Phase 3 Logo import) | 30-min spike before Phase 3 Plan; fallback — inline SVG rewrite для Logo | Phase 3 |
| R3 | GH Pages не URL-decode-ить cyrillic filenames в `tar` → silent missing files | LOW | HIGH (Phase 2 translit вирішив, але regression на нові assets) | `check-brand.ts` — додатковий check на `existsSync(public/renders/{slug}/aerial.*)` | Phase 6 |
| R4 | Hero LCP > 2.5s при 1920×1080 AVIF без proper preload | MED | HIGH (QA-02 blocker) | `<link rel="preload" as="image">` в `index.html` + `fetchpriority="high"`; sharp-encode 3 widths (640/1280/1920) | Phase 3 + Phase 6 |
| R5 | Client надасть телефон/адресу посеред Phase 4 → `{{token}}` витече у prod | MED | LOW (cosmetic) | `placeholders.ts` — single SOT; `check-brand.ts` вже ловить `{{…}}` в `dist/` | Phase 2 ✅ |
| R6 | Safari ≤ 14 не підтримує AVIF → broken hero у Safari 14 | LOW | MED | `<picture>` fallback `WebP → JPG`; перевірка `caniuse` перед Phase 6 final | Phase 3, Phase 6 |
| R7 | `AnimatePresence mode="wait"` + React Router v7 `<Outlet>` incompat → flicker на route change | MED | MED | Phase 5 NEEDS SPIKE флаг уже виставлений; fallback — `initial={false}` + `sync` mode | Phase 5 |
| R8 | Mobile real traffic 60–70% (UA real estate) — fallback-сторінка може бути нарахом для банку DD (P3 persona на mobile) | MED | MED | Fallback містить всі юр. реквізити + email (не просто «use desktop»); логуємо як v2 INFR2-07 blocker | Phase 6 |
| R9 | `prefers-reduced-motion` respect не implemented → vestibular user зіткнеться з parallax | LOW | HIGH (a11y blocker) | Phase 5 `useReducedMotion` hook wired у кожну Motion-точку | Phase 5 |
| R10 | CI denylist false-positive на minified `{{` у `dist/*.js` (already seen in Phase 2) | LOW | LOW (tightened regex) | Phase 2 вже затиснув regex до paired `\{\{[^}]*\}\}` | Phase 2 ✅ |
| R11 | Cyrillic paste в Edit tool втрачає NFC/NFD нормалізацію | LOW | LOW | `list-construction.ts` emits helper; always paste → scripts не rewrite-ять cyrillic | Phase 3–4 |
| R12 | Client міняє scope («додай /about») посеред phase → Core-4 delayed | MED | MED | `.planning/PROJECT.md §Out of Scope` цитується у client comms; новий scope → `/gsd:add-phase` без зламу ROADMAP | continuous |
| R13 | GitHub Actions `actions/deploy-pages@v4` вимагає Pages-enabled на repo settings | LOW | HIGH (blocker) | Perform once перед Phase 6 deploy; документ у `docs/DEPLOY.md` | Phase 6 |
| R14 | 8 відкритих client-питань (CONCEPT §11) залишаться без відповіді на handoff | HIGH | MED | Phase 7 `CLIENT-HANDOFF.md` консолідує всі 8 в один form для one-pass answer | Phase 7 |
| R15 | Rapid iteration → palette drift (новий dev додає `gray-700`) | MED | HIGH (brand breach) | `check-brand.ts` postbuild enforces; `design-brand-guardian` agent delegated review per PR | continuous |
| R16 | Lighthouse score falls below 90 due to third-party script (hidden dep) | LOW | HIGH (QA-02) | Zero third-party scripts у `index.html`; `npm ls` audit перед Phase 6 | Phase 6 |
| R17 | Logo.tsx URL-import з `brand-assets/` (поза src/ та public/) може fail на Rollup prod-build → broken image на задеплоєному URL | MED | HIGH | Phase 3 task 01: `npm run build && ls dist/assets/ \| grep svg` verify. Fallback: move `brand-assets/logo/dark.svg` → `public/brand/logo/dark.svg` | Phase 3 |
| R18 | Scripts using `new URL('..', import.meta.url).pathname` percent-encode cyrillic «Проєкти» → `existsSync` fails | LOW (Phase 2 вже fix) | LOW | Будь-який новий `scripts/*.ts`: **завжди** `fileURLToPath(new URL(...))`, **ніколи** `.pathname`. Додати у `check-brand.ts` grep: `import.meta.url).pathname` fail | continuous |
| R19 | `text-text-muted` (`#A7AFBC`) з `text-xs` (12px) на dark — fail WCAG AA навіть при bold (Footer `<h2 class="text-xs font-bold">` у Phase 1 — ALREADY PRESENT) | MED | MED | Phase 3 task: перегляд Footer.tsx, замінити muted+xs на `text-sm font-medium` або `text-xs text-text opacity-60`. Додати check-brand.ts grep | Phase 3 |
| R20 | Hand-coded IsometricCube polygons (following MinimalCube Phase 1 pattern) може порушити Anti-Pattern 4 (brand primitive re-code) | MED | MED | Phase 3 variant=`grid` = svgr `?react` import з `brand-assets/patterns/isometric-grid.svg`; `single`/`group` — hand-coded допустимий бо brandbook не експортує їх окремо. Trace bezier endpoints перед parameterization (auto-memory feedback) | Phase 3 |
| R21 | Image optimization у `copy-renders.ts` prebuild → кожен `npm run dev` триггерить 20+ sharp encodes = 5-15s slowdown | MED (якщо план не patcheно) | MED | Patch A2: окремий `scripts/optimize-images.mjs` npm script `optimize:images`, manual run, commit outputs. `copy-renders.ts` залишається copy-only | Phase 3 |

---

## 8. Next Action

**Immediate** (у цій сесії, коли користувач готовий):

0. **Skeptic-pass гейти (з `PLAN-AUDIT.md` §A blocker-level — ОБОВ'ЯЗКОВО перед `/gsd:plan-phase 03`):**
   - **A1:** `npm run build && ls dist/assets/ | grep svg` — verify Logo.tsx URL-import потрапляє у bundle. Якщо fail — move `brand-assets/logo/*.svg` у `public/brand/logo/` + патч Logo.tsx.
   - **A2:** узгодити — `scripts/optimize-images.mjs` окремий (рекомендовано) чи `copy-renders.ts` розширяємо? (дефолт plan-а — окремий).
   - **A3:** клієнт sign-off на «ВИГОДА» uppercase у Hero (порушує brand-system §4 lowercase-discipline) **АБО** змінити на lowercase «вигода».
   - **A4:** DoD §6 boundary rule — consume як `pages/ + sections/` → data/content (уже зафіксовано в patched PLAN).
   - **A5:** `src/hooks/` не створюємо; Motion hooks напряму з `motion/react` (уже зафіксовано).

1. **Phase 3 research spike** (`gsd-phase-researcher`) — Motion 12.x useScroll API + svgr `?react` **verify-only** (30 min).
2. **UI-SPEC contract** (`gsd-ui-researcher` + skill `ui-ux-pro-max`) — через `/gsd:ui-phase 03-brand-primitives-home`.
3. **Brand guardian review** (`design-brand-guardian`) — перед merge кожного brand primitive (Logo, Mark, IsometricCube).

Далі:
```
/gsd:plan-phase 03-brand-primitives-home
```
з паралельним хвилевим розбиттям (wave A: primitives + image pipeline setup, wave B: sections, wave C: integration + `/dev/brand`).

---

*PLAN.md prepared 2026-04-24 in /planning mode. Phase 1–2 complete. Phase 3 ready to plan **after 5 blocker patches applied** (see `.planning/PLAN-AUDIT.md`).*
