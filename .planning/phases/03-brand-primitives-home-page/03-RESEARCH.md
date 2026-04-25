# Phase 3 Research: Brand Primitives & Home Page

**Researched:** 2026-04-25
**Domain:** Vite 6 + React 19 + Tailwind v4 + Motion 12 + react-router-dom 7 (HashRouter) + vite-plugin-svgr 4 + sharp 0.34 — desktop-first marketing SPA on GitHub Pages
**Confidence:** HIGH overall (every recommendation grounded in installed-package source or official docs)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero (HOME-01 + ANI-01 + VIS-03 + VIS-04)**
- **D-01:** Hero height = 100vh.
- **D-02:** Wordmark = `<h1>` Montserrat 700 uppercase «ВИГОДА», ~180–220px at 1920×1080. NO svgr extraction; H1 only.
- **D-03:** Background = `<IsometricGridBG>` importing `brand-assets/patterns/isometric-grid.svg` via `vite-plugin-svgr` `?react`. Absolute, full-bleed, opacity 0.1–0.2.
- **D-04:** Parallax = grid translates UP on scroll. `useScroll({ target: heroRef, offset: ['start start','end start'] })` + `useTransform(scrollYProgress,[0,1],[0,-120])`. Max 120px. Ease-out, no bounce. Wordmark static.
- **D-05:** CTA «Переглянути проекти», `bg-accent text-bg-black`, no rounded-pill, no shadow, navigates to `/projects` via `<Link>`.
- **D-06:** Gasло «Системний девелопмент, у якому цінність є результатом точних рішень.» — paragraph between wordmark and CTA, `text-text` color. Copy lives in a `src/content/*.ts` module (planner picks `values.ts` vs new `home.ts`).

**IsometricCube primitive (VIS-03)**
- **D-07:** `src/components/brand/IsometricCube.tsx`, hand-authored stroke-based SVG, 3 variants via `variant: 'single' | 'group' | 'grid'`. ~150 lines total.
- **D-08:** Typed `stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D'` default `#A7AFBC`. `strokeWidth?: number` default 1. `opacity?: number` default 0.3.
- **D-09:** `single` = trimmed copy of MinimalCube geometry. `group` = 2–3 cubes touching faces. `grid` MAY delegate to `<IsometricGridBG>` wrapper or rewrite tile inline (planner's call).
- **D-10:** Cube-ladder mapping locked: `single`→Pipeline-4 marker + Phase 4 «Здано» empty-state · `group`→Phase 4 pipeline-card decorative corner · `grid`→hero overlay + Phase 4 empty-state full-bleed.
- **D-11:** Home page uses cubes in TWO places only: hero overlay (grid via `<IsometricGridBG>`) + PortfolioOverview aggregate row (single). No cubes in BrandEssence/MethodologyTeaser/TrustBlock/ContactForm/ConstructionTeaser.
- **D-12:** `MinimalCube.tsx` is DELETED in the same commit that adds `IsometricCube.tsx`. The `single` variant preserves MinimalCube's polygon shape so visual doesn't shift.

**PortfolioOverview (HOME-03)**
- **D-13:** H2 «Проєкти» + muted subtitle «1 в активній фазі будівництва · 4 у pipeline · 0 здано».
- **D-14:** Lakeview flagship = full-width hero card inside `max-w-7xl`. `aerial.jpg` via `<ResponsivePicture>` (AVIF/WebP/JPG, 3 widths). Title + stage label + facts («Здача у 2027») + external CTA «Перейти на сайт проекту ↗» with `target="_blank" rel="noopener"` → `flagship.externalUrl`.
- **D-15:** Pipeline grid = 3-in-row equal cards at ≥1280px. Each: render cover + title + stage label + location. Card hover = Phase 4. Phase 3 ships static.
- **D-16:** Aggregate row = full-width text strip — `<IsometricCube variant='single'>` (left, opacity 0.4, `#A7AFBC`, ~48×48) + `aggregateProjects[0].aggregateText` (right, primary text). No «Без назви» foregrounded — reads as summary row.
- **D-17:** Section ordering on home: Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm.

**Hero image & image pipeline**
- **D-18:** `aerial.jpg` is THE Lighthouse LCP image. Gets: preload link `<link rel="preload" as="image" fetchpriority="high" type="image/avif" href="…1920">`; `loading="eager"` + `fetchpriority="high"` on `<img>`; never `loading="lazy"`; AVIF→WebP→JPG fallback via `<picture>`; loaded format ≤200KB.
- **D-19:** `scripts/optimize-images.mjs` ships in Phase 3. Reads `public/renders/**/*.jpg` AND `public/construction/**/*.jpg` AFTER `copy-renders.ts` ran. Outputs to `public/renders/{slug}/_opt/{name}-{w}.{fmt}` and `public/construction/{month}/_opt/{name}-{w}.{fmt}`. Formats: AVIF q50, WebP q75, JPG mozjpeg q80. Widths: `[640,1280,1920]` for renders, `[640,960]` for construction. `sharp@^0.34.5` added to devDependencies. Node engine `^20.19 || >=22.12`.
- **D-20:** Wired as `prebuild` step AFTER `copy-renders`: `prebuild: "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs"`. `.mjs` over `.ts` to avoid `@types/sharp` in tsconfig.scripts.json (TS variant equally OK if planner prefers). Idempotent: skip if source mtime ≤ output mtime. `predev` mirrors `prebuild`.
- **D-21:** `<ResponsivePicture>` in `src/components/ui/ResponsivePicture.tsx`. Props: `src: string` (path under `public/`), `alt: string`, `widths?: number[]` default `[640,1280,1920]`, `sizes?: string` default `'100vw'`, `loading?: 'eager'|'lazy'` default `'lazy'`, `fetchPriority?`, `className?`. Emits `<picture><source type="image/avif" srcset><source type="image/webp" srcset><img …></picture>`. Srcset: `{assetUrl(path)}/_opt/{base}-{w}.{fmt} {w}w`. MUST use `renderUrl`/`constructionUrl`/`assetUrl` from `src/lib/assetUrl.ts` — NEVER hardcoded `/renders/` (Phase 2 D-30/D-33 enforces).
- **D-22:** Construction teaser photos use the same pipeline with widths `[640,960]`, `loading="lazy"` (below fold).
- **D-23:** `src/data/projects.ts` render filenames stay UNCHANGED — `<ResponsivePicture src={...}>` transforms internally to `_opt/` siblings.

**Remaining sections (Claude's Discretion)**
- **BrandEssence (HOME-02):** 4 cards from `brandValues` (системність / доцільність / надійність / довгострокова цінність). 4-in-row OR 2×2. No lucide icons. Numbered 01–04 OR pure typography. No cube decoration per D-11.
- **ConstructionTeaser (HOME-04):** 3–5 photos from `constructionLog.latestMonth().teaserPhotos` in horizontal scroll-snap container + «Березень 2026» label + CTA «Дивитись повний таймлайн» → `/construction-log`. Native CSS `scroll-snap-x mandatory` + `overflow-x-auto` + arrow buttons via `element.scrollBy({left:N, behavior:'smooth'})`. NO swiper/embla.
- **MethodologyTeaser (HOME-05):** 2–3 blocks from `methodologyBlocks`. Blocks 2/5/6 have `needsVerification: true` — render ⚠ marker inline with title. Recommended: pick blocks 1 + 3 + 4 (all verified) to avoid foregrounding unverified content.
- **TrustBlock (HOME-06):** 3-column table-like layout from `src/content/company.ts`: ЄДРПОУ | Ліцензія | Email. NO team photos, NO faces. `#A7AFBC` muted labels on `#2F3640` background only ≥14pt body size (5.3:1 AA).
- **ContactForm (HOME-07):** single CTA «Ініціювати діалог» styled as form-submit, opens `mailto:vygoda.sales@gmail.com?subject=…` on click. NO real form fields. Optional short paragraph allowed.
- **Section spacing:** `--spacing-rhythm-xl: 64px` between sections; section-internal `--spacing-rhythm-lg: 32px`.

**Layout & container width**
- **D-24:** Home retains `max-w-7xl` (1280px) container matching Phase 1 Nav/Footer. Hero `min-h-[100vh]` but inner content stays inside `max-w-7xl`. Exception: `<IsometricGridBG>` overlay = `absolute inset-0`, full-bleed.

**`/dev/brand` QA route**
- **D-25:** `src/pages/DevBrandPage.tsx` + `<Route path="dev/brand" element={<DevBrandPage />} />` alongside 5 production routes. Accessible via `/#/dev/brand`. Showcases: Logo (dark.svg @ nav size + hero size), Mark, Wordmark (H1 hero scale), IsometricCube all 3 variants × 3 stroke colors × 2 opacity levels, IsometricGridBG @ opacity 0.1 and 0.2, 6-palette swatches (hex + var name), Montserrat weight ladder (400/500/700 @ 14/16/20/24/40/56/80/180px).
- **D-26:** Not deploy-hidden — `/dev/brand` ships to production (<5KB overhead) but not linked from Nav.

**Logo primitive (VIS-04)**
- **D-27:** `Logo.tsx` STAYS as URL-import + `<img>` (current Phase 1 implementation — quick-task 260424-whr verified the bundling works). NOT migrated to `?react`. svgr remains AVAILABLE for `<IsometricGridBG>` (D-03).
- **D-28:** Add `<Mark>` component in `src/components/brand/Mark.tsx` importing `brand-assets/mark/mark.svg` via URL-import (`<img src={markUrl} alt="" aria-hidden />`). Used by `DevBrandPage` and future Phase 4 empty-state fallbacks. Not consumed by home page in Phase 3.

**Content boundary (re-asserts Phase 2 D-20)**
- **D-29:** No Ukrainian JSX literal paragraphs in Phase 3 components. Strings >40 chars OR containing «Системний» / «ВИГОДА» / brand values live in `src/content/*.ts`. New copy not in Phase 2 modules → planner ADDS to existing module OR creates `src/content/home.ts`. Button labels («Переглянути проекти», «Перейти на сайт проекту ↗», «Ініціювати діалог») MAY stay inline per Phase 2 D-20 microcopy exception.
- **D-30:** Phase 2's `scripts/check-brand.ts` already catches forbidden terms, hex drift, placeholder leaks. Phase 3 adds NO new CI guards. The `importBoundaries()` check blocks `src/components/` from hardcoding `/renders/` paths — `<ResponsivePicture>` MUST use `renderUrl`/`constructionUrl`.

### Claude's Discretion
- Hero wordmark pixel size (180 vs 220 px) — tune at browser
- Accent CTA hover style (brightness vs underline-grow vs letter-spacing)
- BrandEssence layout (4-in-row vs 2×2)
- MethodologyTeaser block selection (recommended: 1 + 3 + 4)
- TrustBlock exact layout (3-col table vs stacked vs strip)
- ConstructionTeaser arrow placement (outside vs overlayed)
- Section spacing precision (py-16 / py-20 / py-24)
- Optional "scroll down" indicator at hero bottom (recommended: skip — brand tone)
- `<source>` tag order in `<picture>` — AVIF → WebP → JPG (planner confirms)
- sharp encoding params within reasonable defaults
- Dev-mode skip for `optimize-images.mjs` if optimized files already exist
- `/dev/brand` scope (primitives only vs include sample compositions; recommended: primitives only)

### Deferred Ideas (OUT OF SCOPE)
- Scroll-reveal on home sections (ANI-02) — Phase 5
- Route transitions (ANI-04) — Phase 5
- Reduced-motion respect (full hook threading) — Phase 5; Phase 3 only ensures hero parallax has a graceful disable path
- Session-skip hero (re-visit fast-fade) — Phase 5
- Card hover states (ANI-03) — Phase 4
- `/dev/grid` fixtures stress test — Phase 4
- OG image — Phase 6 (QA-03)
- Multi-language (EN) — v2
- Real contact form with name/email/message — v2 INFR2-04
- BrandEssence card micro-animations — Phase 5
- Lighthouse verification — Phase 6
- Image optimizer fancy content-hash caching — v2
- PortfolioOverview flagship hover — Phase 5
- MethodologyTeaser block-swap UI — v2
- Wordmark as SVG component — Phase 3 keeps it as H1; v2 if SVG wordmark needed
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **HOME-01** | Hero: wordmark «ВИГОДА» + slow-parallax cube pattern (opacity 10–20%) + gasло + CTA «Переглянути проекти» | §A Motion `useScroll`/`useTransform` recipe; §B svgr `?react` for IsometricGridBG; §C `<picture>` + preload; §H Lighthouse readiness |
| **HOME-02** | BrandEssence — 4 value cards (системність · доцільність · надійність · довгострокова цінність) | §I `brandValues: BrandValue[]` shape; §Data Shape Catalog |
| **HOME-03** | PortfolioOverview — Lakeview flagship + 3 pipeline + Pipeline-4 aggregate row | §I `flagship` / `pipelineGridProjects` / `aggregateProjects` shapes; §C `<ResponsivePicture>` for renders |
| **HOME-04** | ConstructionTeaser — 3–5 photos from `mar-2026` + CTA → `/construction-log` | §E scroll-snap CSS + arrow buttons; §I `latestMonth().teaserPhotos: string[]` |
| **HOME-05** | MethodologyTeaser — 2–3 §8 blocks with ⚠ markers on `needsVerification` | §I `methodologyBlocks: MethodologyBlock[]` with `needsVerification: boolean` |
| **HOME-06** | TrustBlock — реквізити table (ЄДРПОУ + ліцензія + email) | §I `legalName` / `edrpou` / `licenseDate` / `email` named exports |
| **HOME-07** | ContactForm — single CTA «Ініціювати діалог» = `mailto:` button | §I `email` const; mailto pattern documented in PITFALLS |
| **VIS-03** | IsometricCube 3 variants + IsometricGridBG overlay 10–20% | §G discriminated union; §B svgr `?react` |
| **VIS-04** | Logo (dark.svg) + favicon | Logo.tsx already shipped Phase 1 (D-27 keeps it); favicon already in `index.html` Phase 1 |
| **ANI-01** | Hero slow-parallax — Motion `useScroll`+`useTransform`, ease-out, no bounce | §A code recipe + reduced-motion guard |
</phase_requirements>

## Summary

The home page is six new sections + one hero wired to **already-shipped data** — `flagship`, `pipelineGridProjects`, `aggregateProjects`, `constructionLog.latestMonth()`, `brandValues`, `methodologyBlocks`, `legalName`/`edrpou`/`licenseDate`/`email`, `phone`/`address` placeholders. Phase 2 left the consumer surface intact; Phase 3 builds on top.

Brand primitives split cleanly: `IsometricCube` is a hand-authored TSX component with a discriminated `variant` prop; `IsometricGridBG` is a thin wrapper that imports `brand-assets/patterns/isometric-grid.svg` via `vite-plugin-svgr`'s `?react` query (the plugin and Vite config were prepared in Phase 1 — verified `svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true }` in `vite.config.ts`); `Mark` follows `Logo.tsx`'s URL-import pattern.

The image pipeline is the single new piece of build infrastructure: a `scripts/optimize-images.mjs` script using sharp 0.34 to emit AVIF/WebP/JPG triples at three widths. Hero parallax uses Motion 12's `useScroll({ target, offset })` + `useTransform([0,1],[0,-120])` (verified against installed framer-motion@12.38 type defs at `node_modules/framer-motion/dist/types/index.d.ts`).

**Primary recommendation:** ship in 6 commit-sized pieces — (1) `IsometricCube` + `IsometricGridBG` + `Mark` primitives + `/dev/brand` route, (2) `optimize-images.mjs` + `<ResponsivePicture>` + prebuild wiring + hero preload link, (3) `Hero` (wordmark + parallax + CTA), (4) `BrandEssence` + `PortfolioOverview`, (5) `ConstructionTeaser` + `MethodologyTeaser`, (6) `TrustBlock` + `ContactForm` + `HomePage` composition. Each step is independently verifiable and reverts cleanly.

## Current State Baseline

Pre-flight inventory (verified 2026-04-25, NOT trusting memory):

**Installed dependencies (`package.json`):**
| Package | Version pinned | Purpose | Notes |
|---|---|---|---|
| `motion` | `^12.38.0` | Hero parallax + future Phase 5 | Latest; re-exports framer-motion@12.38.0 from `motion/react` |
| `react-router-dom` | `^7.14.0` | Routing | HashRouter already wired in `src/App.tsx` |
| `lucide-react` | `^1.11.0` | Icons | Already used in `Footer.tsx` (Send / MessageCircle / Globe) |
| `@fontsource/montserrat` | `^5.2.8` | Cyrillic 400/500/700 | Already imported in `src/main.tsx` |
| `vite-plugin-svgr` | `^4.3.0` | SVG → React component | **INSTALLED, NOT YET USED** by any source file. Phase 1 added the plugin to `vite.config.ts` (verified). Phase 3 lights it up via `?react` for `<IsometricGridBG>` |
| `tailwindcss` | `^4.2.4` + `@tailwindcss/vite` | Tokens via `@theme` | 6 hexes confirmed in `src/index.css` |
| `tsx` | `^4.21.0` | TS scripts runner | Used by `predev`/`prebuild` |
| `vite` | `^6.3.6` | Bundler | Confirmed `base: '/vugoda-website/'` in `vite.config.ts` |

**NOT installed (Phase 3 must add):**
- `sharp@^0.34.5` — devDependency. `npm view sharp version` confirms 0.34.5 latest, engines `^18.17 || ^20.3 || >=21`.

**Existing source layout:**
```
src/
├── App.tsx                 — HashRouter with 5 routes + 404 catch-all (line 28-39)
├── main.tsx                — Fontsource cyrillic 400/500/700 imports
├── index.css               — @theme block: 6 colors + Montserrat + spacing-rhythm + focus-visible
├── vite-env.d.ts           — only `/// <reference types="vite/client" />` — Phase 3 ADDS svgr/client reference
├── components/
│   ├── brand/
│   │   ├── Logo.tsx        — URL-import dark.svg (12 lines, D-27 keeps as-is)
│   │   └── MinimalCube.tsx — 53 lines, 3-polygon wireframe @ viewBox="0 0 100 100" (D-12 DELETES this)
│   └── layout/
│       ├── Layout.tsx      — flex min-h-screen + Nav + <Outlet/> + Footer
│       ├── Nav.tsx         — sticky, max-w-7xl, 4 NavLinks with accent border-b active state
│       ├── Footer.tsx      — 3-column legal block; uses `legalName`/`edrpou`/`licenseDate` literally embedded (NOT yet imported from content/company.ts — opportunity to refactor in Phase 3 if planner wants, NOT required by phase scope)
│       └── ScrollToTop.tsx — useLocation-driven window.scrollTo(0,0) on path change
├── content/
│   ├── company.ts          — legalName/edrpou/licenseDate/licenseNote/email/socials (named exports, all `as const` literal types)
│   ├── methodology.ts      — methodologyBlocks: MethodologyBlock[] (7 entries, blocks 2/5/6 needsVerification:true)
│   ├── placeholders.ts     — phone='—', address='—', pipeline4Title='Без назви', etnoDimAddress='—'
│   └── values.ts           — brandValues: BrandValue[] (4 entries: системність, доцільність, надійність, довгострокова цінність)
├── data/
│   ├── construction.ts     — constructionLog: ConstructionMonth[] (4 months reverse-chrono); latestMonth()=>constructionLog[0]; mar-2026.teaserPhotos = ['mar-01.jpg','mar-05.jpg','mar-10.jpg','mar-12.jpg','mar-15.jpg']
│   ├── projects.fixtures.ts — fixtures: Project[] (10 synthetic, NOT for prod)
│   ├── projects.ts         — projects: Project[] (5 records); flagship/pipelineGridProjects/aggregateProjects/detailPageProjects/findBySlug
│   └── types.ts            — Stage / Presentation / Project / ConstructionMonth / ConstructionPhoto / MethodologyBlock / BrandValue
├── lib/
│   └── assetUrl.ts         — renderUrl(slug,file) / constructionUrl(month,file) / assetUrl(path)
└── pages/
    ├── HomePage.tsx        — placeholder: H1 «ВИГОДА» + mark.svg (12 lines, REPLACED in Phase 3)
    ├── ProjectsPage.tsx    — placeholder (Phase 4 owns)
    ├── ZhkPage.tsx         — placeholder (Phase 4 owns)
    ├── ConstructionLogPage.tsx — placeholder (Phase 4 owns)
    ├── ContactPage.tsx     — placeholder (Phase 4 owns)
    └── NotFoundPage.tsx    — 404 + link to /

scripts/
├── check-brand.ts          — 4-check CI guard (denylist + palette + placeholders + boundaries); INCLUDES the rule «components must not contain raw /renders/ or /construction/ paths» — ResponsivePicture compliance gate
├── copy-renders.ts         — uses fileURLToPath; translit map likeview→lakeview etc.; .DS_Store filter; idempotent
└── list-construction.ts    — manual helper for caption authoring
```

**Existing `public/` after `npm run predev`:**
```
public/
├── .nojekyll
├── favicon.svg
├── construction/
│   ├── dec-2025/  (12 jpgs)
│   ├── jan-2026/  (11 jpgs)
│   ├── feb-2026/  (12 jpgs)
│   └── mar-2026/  (15 jpgs, e.g. mar-01.jpg through mar-15.jpg, ~280-500KB each)
└── renders/
    ├── lakeview/                  (7 raw .jpg, e.g. aerial.jpg=1.54MB, hero.jpg=987KB, etc.)
    ├── etno-dim/                  (8 .jpg.webp, ~50-220KB each)
    ├── maietok-vynnykivskyi/      (2 .jpg.webp / .png.webp)
    └── nterest/                   (3 .jpg.webp / .png.webp)
```

**Brand assets (authoritative SVG sources):**
- `brand-assets/patterns/isometric-grid.svg` — 15.6KB, viewBox `0 0 220.6 167.4`. **CRITICAL OBSERVATION:** the file uses `<defs><style>` with hard-coded `fill: #c1f33d` on `.cls-1` and `mix-blend-mode: overlay` on `.cls-2`. NO stroke-based geometry — it's filled polygons. `<g class="cls-3">` wraps the geometry with `opacity: .4`. This means a naïve `?react` import yields a component that ignores any `stroke="currentColor"` we pass — see §B for the override pattern.
- `brand-assets/mark/mark.svg` — 739B, viewBox `0 0 220.6 167.4`. 3 paths, all `fill: #c1f33d` opacity 0.6 (cube-with-petals).
- `brand-assets/logo/dark.svg` — 12,469B, used by `Logo.tsx` via URL-import (verified working in dist build per quick-task 260424-whr).
- `brand-assets/favicon/favicon-32.svg` — wired in `index.html` line 7 as `/vugoda-website/favicon.svg` (Phase 1 copied to `public/favicon.svg`).

**Key file references the planner will need verbatim:**
- `vite.config.ts:12-20` — svgr plugin already configured with `exportType: 'default'`, `ref: true`, `svgo: false`, `titleProp: true`, `include: '**/*.svg?react'`. **No changes needed to vite.config.ts in Phase 3.**
- `src/index.css:8-26` — `@theme` block; Tailwind v4 utilities `bg-bg`, `bg-bg-surface`, `bg-bg-black`, `bg-accent`, `text-text`, `text-text-muted`, `font-sans` are auto-generated.
- `package.json:7-14` — current scripts: `predev`/`dev`/`prebuild`/`build`/`postbuild`/`preview`/`lint`/`list:construction`. Phase 3 modifies `predev` and `prebuild` (chain `&& node scripts/optimize-images.mjs`).
- `index.html:1-14` — `<html lang="uk">`, theme-color meta, favicon, root div, main.tsx script. **Phase 3 ADDS `<link rel="preload">` for hero AVIF (D-18) directly above `<title>`.**
- `tsconfig.json:14` — `types: ["vite/client"]`. Phase 3 may either add `"vite-plugin-svgr/client"` here OR add `/// <reference types="vite-plugin-svgr/client" />` to `src/vite-env.d.ts` (the latter is svgr's documented pattern).

## Technical Recipes

### A. Motion 12 hero parallax — `useScroll` + `useTransform` (HOME-01 + ANI-01)

**API surface (verified against `node_modules/framer-motion/dist/types/index.d.ts`):**

```ts
declare function useScroll({ container, target, ...options }?: UseScrollOptions): {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
};

interface UseScrollOptions extends Omit<ScrollInfoOptions, "container" | "target"> {
    container?: RefObject<HTMLElement | null>;
    target?: RefObject<HTMLElement | null>;
    offset?: ScrollOffset;  // ['start start', 'end start'] etc.
}

declare function useTransform<I, O>(
  value: MotionValue<I>,
  inputRange: I[],
  outputRange: O[],
  options?: TransformOptions<O>,
): MotionValue<O>;
```

**Reference component (paste into `src/components/sections/home/Hero.tsx`):**

```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IsometricGridBG } from '../../brand/IsometricGridBG';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Motion's useReducedMotion returns boolean | null; treat null as "respect user signal not yet known" → safe to behave as if reduced
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // When prefersReducedMotion is truthy, collapse output range to [0, 0] — no parallax movement.
  // Cleanest path: keep one useTransform call but switch its output by RM at hook-call time.
  const cubeY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -120],
  );

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg"
    >
      {/* Parallax overlay — translates UP on scroll, behind wordmark */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: cubeY }}
      >
        <IsometricGridBG className="h-full w-full" opacity={0.15} />
      </motion.div>

      {/* Hero content stays static, max-w-7xl per D-24 */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">
        <h1 className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text">
          ВИГОДА
        </h1>
        {/* Gasло — copy from src/content/{values|home}.ts per D-06 */}
        <p className="max-w-3xl text-xl text-text">
          {heroSlogan /* imported from content module — see §J */}
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
        >
          Переглянути проекти
        </Link>
      </div>
    </section>
  );
}
```

**Why this satisfies D-04:**
- `target: heroRef` scoped to the hero section (NOT viewport) — parallax stops once the hero scrolls out of view, exactly the «passing through structured space» feel.
- `offset: ['start start', 'end start']` means `scrollYProgress` goes 0→1 as the hero's top moves from "top of viewport" to "out the top of viewport".
- Output range `[0, -120]` translates the grid 120px UP over that scroll distance — ANI-01 ceiling.
- `useTransform` is linear by default; ease-out without bounce is achieved by the linear range itself (no spring config). If a stricter feel is wanted, wrap in a `useSpring` with `{ stiffness: 100, damping: 30, restDelta: 0.001 }` — but D-04 says no bounce, and linear is already strictly monotonic, so plain `useTransform` is the recommended path.

**Reduced-motion handling:**
- `useReducedMotion()` is a stable hook from `motion/react` (re-exported from framer-motion@12.38, signature `(): boolean | null`).
- The recipe above swaps the `outputRange` at hook-call time so the MotionValue is always created (consistent hook-call order — React rule of hooks). When `prefersReducedMotion` is true, output is `[0, 0]` and the grid stays put.
- This is the minimum viable RM respect for Phase 3. Phase 5 owns the full hook threading (deferred per D-deferred).

**DO NOT use `useViewportScroll`** — it's marked `@deprecated` in framer-motion 12.38's `index.d.ts`. Use `useScroll()` with no args for viewport, or with `target/container` for scoping.

**Performance note (PITFALLS §16):** add `transform: translate3d(0,0,0)` (or rely on Motion's auto layer-promotion for `style.y`) but DO NOT manually apply `will-change: transform` — Motion already manages compositor hints. Audit Chrome DevTools → Layers panel: target <10 composite layers. Apply layer-promotion to the IsometricGridBG container only, NOT to every motion element.

### B. `vite-plugin-svgr ?react` query with the brand-asset isometric-grid.svg

**The plugin (Phase 1 already configured in `vite.config.ts`):**
```ts
svgr({
  svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
  include: '**/*.svg?react',
})
```

**Type declaration for `?react` imports (svgr ships this, vendored at `node_modules/vite-plugin-svgr/client.d.ts`):**
```ts
declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string; titleId?: string; desc?: string; descId?: string }
  >;
  export default ReactComponent;
}
```

**Action required for Phase 3:** add `/// <reference types="vite-plugin-svgr/client" />` to `src/vite-env.d.ts` (currently only references `vite/client`). Without this, TS errors on `import GridSvg from '…?react'`.

**Reference `IsometricGridBG.tsx`:**
```tsx
// src/components/brand/IsometricGridBG.tsx
//
// Imports the brand-asset isometric grid SVG via vite-plugin-svgr's ?react query.
// Note: the source SVG (brand-assets/patterns/isometric-grid.svg) uses inline <style>
// with hardcoded fill: #c1f33d and mix-blend-mode: overlay. Stroke-based override is
// NOT possible — the geometry is FILLED polygons, not strokes. We rely on:
//   1) The fill color being already-canonical brand accent #C1F33D (passes check-brand).
//   2) Container opacity (0.10–0.20) to land in brandbook §5 «opacity 5–60%» range.
//   3) Wrapper className for sizing.
//
// If a future redesign requires a different fill color, the brand-asset SVG itself
// must be reauthored (single source of truth, brand-locked) — not a runtime override.

import GridSvg from '../../../brand-assets/patterns/isometric-grid.svg?react';

export interface IsometricGridBGProps {
  /** Container className (sizing). Default fills parent. */
  className?: string;
  /** Container opacity per brandbook 0.05–0.60 (D-08, brand-system.md §5). */
  opacity?: number;
}

export function IsometricGridBG({
  className = 'h-full w-full',
  opacity = 0.15,
}: IsometricGridBGProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ opacity }}
    >
      <GridSvg
        // svg fills its container; preserveAspectRatio default 'xMidYMid meet' keeps tile centered
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      />
    </div>
  );
}
```

**Critical caveat — the asset uses `<defs><style>` blocks:** the inline CSS scopes `.cls-1 { fill: #c1f33d }` etc. inside the rendered SVG. This means:
- A second `?react` import elsewhere in the page (say, for the `IsometricCube variant='grid'` tile) would inject a SECOND `<defs><style>` with the same `.cls-1` selector — shouldn't conflict because both blocks use the same value, but is brittle.
- If `<IsometricCube variant='grid'>` is implemented as a wrapper around `<IsometricGridBG>` (D-09 option), there's no duplicate-style issue.
- If implemented as a separate inline-SVG `<polygon>` clone, the new SVG must NOT re-import the `?react` asset — it should hand-author the tile geometry.

**Recommendation for D-09:** make `<IsometricCube variant='grid'>` a thin wrapper around `<IsometricGridBG>` with a different default `opacity` and `className`. Single source of truth for grid geometry; no duplicate `<defs><style>` blocks.

### C. AVIF/WebP/JPG `<picture>` LCP pattern on GitHub Pages (HOME-01 + HOME-03 + D-18 + D-21)

**`<link rel="preload">` in `index.html` for hero (D-18):**

```html
<!-- index.html — ADD just above the <title> tag -->
<link
  rel="preload"
  as="image"
  href="/vugoda-website/renders/lakeview/_opt/aerial-1920.avif"
  imagesrcset="
    /vugoda-website/renders/lakeview/_opt/aerial-1280.avif 1280w,
    /vugoda-website/renders/lakeview/_opt/aerial-1920.avif 1920w
  "
  imagesizes="100vw"
  type="image/avif"
  fetchpriority="high"
/>
```

**Three things to verify:**

1. **`type="image/avif"` does NOT break browsers without AVIF support.** Browsers that don't recognize the type simply skip the preload directive — they fall through to the `<img>`'s `<picture>` fallback chain on render. Verified per HTML spec semantics for `<link rel="preload">` with `type` attribute (browsers MUST ignore preloads with unknown types). AVIF support has been Baseline-2024 — Safari 16+ (Sept 2022), Safari 16.4 retroactively for macOS Monterey/Big Sur. Modern Chrome/Firefox/Edge: native. Older Safari falls through to WebP/JPG.

2. **`imagesrcset` + `imagesizes` are honored.** Modern browsers (Chrome ≥73, Firefox ≥78, Safari ≥14) preload the most appropriate width for the viewport. Without these, browsers preload the URL in `href` regardless of viewport — fine for desktop-first 1920×1080 (preload the 1920 always), but `imagesrcset` is more correct.

3. **`fetchpriority="high"` works alongside preload.** Documented by Chrome team and HTML spec — `fetchpriority` on a `<link rel="preload">` raises the resource's priority above other preloads. Required for hitting LCP <2.5s on a 1920×1080 viewport.

**Optional simplification:** since this site is desktop-first 1920×1080 and `<1024px` gets the mobile-fallback page (Phase 6 QA-01), preloading just the 1920w variant directly via `href` (no `imagesrcset`) is acceptable:

```html
<link
  rel="preload"
  as="image"
  href="/vugoda-website/renders/lakeview/_opt/aerial-1920.avif"
  type="image/avif"
  fetchpriority="high"
/>
```

**Recommendation:** ship the simple version. Add `imagesrcset` only if Phase 6 Lighthouse audit shows LCP regression on 1280–1919 viewports.

**No `crossorigin` attribute** — same-origin images on Pages don't need it; adding `crossorigin` without anonymous CORS makes preload silently miss.

**`<ResponsivePicture>` reference component:**

```tsx
// src/components/ui/ResponsivePicture.tsx
//
// Emits <picture><source type="image/avif"><source type="image/webp"><img></picture>
// where each <source> has srcset pointing at sharp-generated _opt/ siblings.
// MUST consume renderUrl/constructionUrl from src/lib/assetUrl.ts — never hardcode
// /renders/ or /construction/ paths (Phase 2 D-30 / check-brand importBoundaries()).
//
// Width strategy:
//   - widths default [640, 1280, 1920] for full-width renders (Lakeview flagship).
//   - widths=[640,960] passed by ConstructionTeaser (smaller card sizes).
//   - sizes default '100vw' — caller should pass a more precise value when card width
//     is known (e.g. '(min-width: 1280px) 33vw, 100vw' for pipeline grid).

import { assetUrl } from '../../lib/assetUrl';

export interface ResponsivePictureProps {
  /** Path under public/, e.g. 'renders/lakeview/aerial.jpg' or 'construction/mar-2026/mar-01.jpg' */
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  /** Optional explicit width/height attributes for CLS prevention. Defaults computed from largest width × 9/16 if not provided. */
  width?: number;
  height?: number;
}

export function ResponsivePicture({
  src,
  alt,
  widths = [640, 1280, 1920],
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  width,
  height,
}: ResponsivePictureProps) {
  // Strip extension from src — sharp emits {basename}-{w}.{fmt}, base = filename without extension.
  // For 'renders/lakeview/aerial.jpg' → dir='renders/lakeview', base='aerial'.
  const lastSlash = src.lastIndexOf('/');
  const dir = src.substring(0, lastSlash);
  const filename = src.substring(lastSlash + 1);
  const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  const buildSrcset = (fmt: 'avif' | 'webp' | 'jpg') =>
    widths.map((w) => `${assetUrl(`${dir}/_opt/${base}-${w}.${fmt}`)} ${w}w`).join(', ');

  const largestWidth = widths[widths.length - 1];
  const fallbackSrc = assetUrl(`${dir}/_opt/${base}-${largestWidth}.jpg`);

  // CLS prevention — provide explicit width/height attrs. Architectural CGI is ~16:9.
  const finalWidth = width ?? largestWidth;
  const finalHeight = height ?? Math.round(largestWidth * 9 / 16);

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcset('webp')} sizes={sizes} />
      <img
        src={fallbackSrc}
        srcSet={buildSrcset('jpg')}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        width={finalWidth}
        height={finalHeight}
        className={className}
        decoding="async"
      />
    </picture>
  );
}
```

**Three call sites in Phase 3:**
```tsx
// PortfolioOverview flagship — eager + high priority (LCP target)
<ResponsivePicture
  src={`renders/${flagship.slug}/${flagship.renders[0]}`}
  alt={flagship.title}
  loading="eager"
  fetchPriority="high"
  sizes="(min-width: 1280px) 1280px, 100vw"
  className="w-full"
/>

// Pipeline grid card cover — lazy
<ResponsivePicture
  src={`renders/${project.slug}/${project.renders[0]}`}
  alt={project.title}
  widths={[640, 1280]}
  sizes="(min-width: 1280px) 400px, 100vw"
  loading="lazy"
  className="w-full aspect-[4/3] object-cover"
/>

// ConstructionTeaser strip photo — lazy
<ResponsivePicture
  src={`construction/${latestMonth().key}/${file}`}
  alt={`Будівельний майданчик, ${latestMonth().label.toLowerCase()}`}
  widths={[640, 960]}
  sizes="320px"
  loading="lazy"
  className="h-full w-auto"
/>
```

**Note on Phase 2 source paths:** the etno-dim/maietok/nterest renders are already `.jpg.webp` files (e.g. `43615.jpg.webp`). The optimizer should treat the part before the LAST `.` as the format-suffix; for `43615.jpg.webp`, the base is `43615.jpg` (the dot is not stripped further) — sharp will emit `43615.jpg-1280.avif` etc., which is fine for the srcset construction above provided the script and the component agree on the base-name regex. **Recommendation:** the optimizer takes the input filename verbatim (minus the trailing format-suffix), so `aerial.jpg` → base `aerial`, `43615.jpg.webp` → base `43615.jpg`. The component's regex above strips only `\.(jpg|jpeg|png|webp)$` — so `aerial.jpg` → `aerial` ✅; `43615.jpg.webp` → `43615.jpg` ✅. Both work consistently.

### D. sharp encoding parameters for the image pipeline (D-19, D-20)

**Verified via `sharp` 0.34.5 docs (`sharp.pixelplumbing.com/api-output`) and GitHub issue #4227 (lovell/sharp project):**

| Format | Quality | Effort | Other | Expected output for 1920×1080 architectural CGI |
|---|---|---|---|---|
| AVIF | `50` | `4` (default) — increase to `6` if cold-cache build time acceptable | `chromaSubsampling: '4:4:4'` for sharp text overlay readability (architectural CGI has mostly smooth surfaces, default `'4:2:0'` is fine here) | 80–140KB |
| WebP | `75` | `effort: 4` (default) | `smartSubsample: true` for better text/edge | 120–180KB |
| JPG | `80` | `mozjpeg: true` (sharp routes through libjpeg-turbo's mozjpeg encoder when this flag is true; significantly better compression for the same quality) | `chromaSubsampling: '4:2:0'` (default for JPG; brand renders don't need 4:4:4) | 150–200KB |

**`sharp.pixelplumbing.com` docs confirm:**
- `.avif({ quality: 50, effort: 4 })` — defaults are quality 50 / effort 4. effort 0–9; 9 is slowest with best compression. For 70 source images, effort=4 is the sweet spot; effort=6 typically saves 5–10% size at 2–3× build time.
- `.webp({ quality: 75 })` — default quality 80 in sharp; 75 is a deliberate down-step for smaller files since WebP is the fallback (AVIF is the primary).
- `.jpeg({ quality: 80, mozjpeg: true })` — `mozjpeg: true` requires sharp to be built with mozjpeg support (default in npm packages since 0.30+).

**Reference `scripts/optimize-images.mjs`:**

```js
// scripts/optimize-images.mjs
//
// Reads source JPG/PNG/WebP from public/renders/**/* and public/construction/**/*
// (after copy-renders.ts has populated public/), emits sharp-encoded AVIF/WebP/JPG
// triples at 3 widths into public/{renders,construction}/{slug,month}/_opt/.
//
// Idempotent: skip if output mtime >= source mtime.
//
// Runs as `prebuild` step AFTER copy-renders.ts, via:
//   "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs"
//
// Why .mjs not .ts: avoids @types/sharp surface in tsconfig.scripts.json. Plain ESM JS.

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC = join(ROOT, 'public');

// Skip files macOS sometimes leaves behind even after copy-renders filter.
const isImage = (f) => /\.(jpg|jpeg|png|webp)$/i.test(f);
const stripFormatSuffix = (f) => f.replace(/\.(jpg|jpeg|png|webp)$/i, '');

const FORMATS = [
  { ext: 'avif', encoder: (s) => s.avif({ quality: 50, effort: 4 }) },
  { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
  { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
];

async function optimizeFile(srcPath, destDir, widths) {
  const filename = basename(srcPath);
  const base = stripFormatSuffix(filename);
  const srcMtime = statSync(srcPath).mtimeMs;

  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  for (const w of widths) {
    for (const { ext, encoder } of FORMATS) {
      const outPath = join(destDir, `${base}-${w}.${ext}`);
      // Idempotency: skip if existing output is newer than source.
      if (existsSync(outPath) && statSync(outPath).mtimeMs >= srcMtime) continue;
      const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
      await encoder(pipeline).toFile(outPath);
    }
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_opt') continue;       // never recurse into output dir
    if (entry.name.startsWith('.')) continue;  // skip dotfiles
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && isImage(entry.name)) yield full;
  }
}

async function processTree(treeDir, widths) {
  if (!existsSync(treeDir)) {
    console.warn(`[optimize-images] missing tree: ${treeDir}`);
    return;
  }
  const files = [...walk(treeDir)];
  console.log(`[optimize-images] ${relative(ROOT, treeDir)}: ${files.length} sources`);
  let done = 0, skipped = 0;
  for (const src of files) {
    const destDir = join(src, '..', '_opt');
    const sizeBefore = files.length * widths.length * FORMATS.length;
    await optimizeFile(src, destDir, widths);
    done++;
  }
  console.log(`[optimize-images] ${relative(ROOT, treeDir)}: done`);
}

await processTree(join(PUBLIC, 'renders'), [640, 1280, 1920]);
await processTree(join(PUBLIC, 'construction'), [640, 960]);
console.log('[optimize-images] complete');
```

**Why `node` not `tsx` for this script (D-20 deviation note):** Phase 2 used `tsx scripts/copy-renders.ts` because copy-renders is in TS. The optimizer in `.mjs` runs natively under Node ≥20, no transpiler needed, no @types/sharp added. Result: lighter `tsconfig.scripts.json` surface.

**Idempotency note:** The mtime check guards against re-encoding 70 images on every dev start. First run: ~30–60s for the full set. Subsequent runs: <500ms (just stat'ing files).

**`withoutEnlargement: true`** is critical — if a source is already <1920w, don't upscale; just emit the smaller-than-1920 version at original width. This protects against future smaller renders being upscaled and looking blocky.

### E. ConstructionTeaser native scroll-snap + arrow buttons (HOME-04)

**Pattern (no swiper/embla per CLAUDE.md "What NOT to Use"):**

```tsx
// src/components/sections/home/ConstructionTeaser.tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { latestMonth } from '../../../data/construction';
import { ResponsivePicture } from '../../ui/ResponsivePicture';

export function ConstructionTeaser() {
  const scroller = useRef<HTMLDivElement>(null);
  const month = latestMonth();
  const photos = month.teaserPhotos ?? [];

  // Snap-card width = 320px (matches sm-card sizing on 1280px container ≈ 4 cards visible).
  // scrollBy advances by one card-width including gap.
  const SCROLL_STEP = 336; // 320px card + 16px gap

  const scrollByDir = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: 'smooth' });
  };

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-3xl font-bold text-text">Хід будівництва Lakeview</h2>
          <span className="text-sm text-text-muted">{month.label}</span>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Прокрутити назад"
            onClick={() => scrollByDir(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollPaddingLeft: '24px' }}
          >
            {photos.map((file) => (
              <div
                key={file}
                className="relative h-[200px] w-[320px] flex-shrink-0 snap-start overflow-hidden bg-bg-surface"
              >
                <ResponsivePicture
                  src={`construction/${month.key}/${file}`}
                  alt={`Будівельний майданчик, ${month.label.toLowerCase()}`}
                  widths={[640, 960]}
                  sizes="320px"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Прокрутити вперед"
            onClick={() => scrollByDir(1)}
            className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>

        <Link
          to="/construction-log"
          className="mt-6 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Дивитись повний таймлайн →
        </Link>
      </div>
    </section>
  );
}
```

**SCROLL_STEP rationale:** 320px card + 16px gap = 336. At 1280px container, ~3.8 cards visible. 5 photos in `teaserPhotos` × 320 + 4 gaps × 16 = 1664px wide strip → overflows by ~400px. Two arrow clicks reach the end.

**Tailwind v4 utilities used:** `snap-x snap-mandatory snap-start scroll-smooth overflow-x-auto` — all built-in to Tailwind v4 core, no plugin needed.

**Accessibility:** arrow buttons have `aria-label`. The scroller itself is keyboard-scrollable via Tab → arrow keys (native browser behavior on `overflow-x-auto`). The buttons add mouse-affordance; they're not the only way to scroll.

**Disabled-state for arrows ("no more photos"):** intentionally OUT of scope for Phase 3. Native scroll-snap doesn't expose a "scroll position" event that's free to compute against scrollWidth without a scroll listener. For 3–5 photos, the overflow is short enough that users discover the boundary by scrolling. If post-launch QA shows confusion, Phase 5 can add a `useScroll`-driven boolean disable.

**Keyboard focus trap:** none — the buttons are focusable, the scroller children (the `<picture>`s) are NOT focusable. Tab order: button-back → first button-forward → next page section. Clean.

### F. Hidden `/dev/brand` route (D-25, D-26)

**Pattern in `src/App.tsx`:**

```tsx
// Add this child route ABOVE the catch-all <Route path="*" />.
// HashRouter URL: /#/dev/brand — refresh works because the hash is client-side only.

<Route element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="projects" element={<ProjectsPage />} />
  <Route path="zhk/:slug" element={<ZhkPage />} />
  <Route path="construction-log" element={<ConstructionLogPage />} />
  <Route path="contact" element={<ContactPage />} />
  <Route path="dev/brand" element={<DevBrandPage />} />  {/* NEW Phase 3 */}
  <Route path="*" element={<NotFoundPage />} />
</Route>
```

**HashRouter behavior on refresh:** because the URL is `https://yaroslavpetrukha.github.io/vugoda-website/#/dev/brand`, the server only sees `/vugoda-website/` and serves `index.html`. The router then reads `window.location.hash` and resolves `#/dev/brand` to the matching `<Route>`. Refresh works without any 404.html shim. This is the entire reason DEP-03 picked HashRouter — see Phase 1 D-22.

**robots.txt / noindex:** NOT needed. `/dev/brand` is unlinked from Nav; search engines won't discover it. Even if discovered, the hash fragment isn't indexed by Google for SPA route states (HashRouter is a known weakness in SEO terms — for a hidden QA page that's a feature). Phase 6 owns site-wide SEO meta (QA-03), not this.

**Inside `DevBrandPage.tsx` — minimum viable content per D-25:**
- 6-palette swatch grid (one row of 6 cards, each: hex value + computed CSS var name + sample text on the swatch)
- Montserrat weight ladder (400/500/700 at 14/16/20/24/40/56/80/180px, each on a single line with size label)
- Logo at 56px (nav size) and 200px (hero-equivalent size)
- Mark at 96px
- Wordmark sample: H1 «ВИГОДА» at hero scale (180–220px; tune to match Hero section)
- IsometricCube: a 3×3×2 matrix — 3 variants × 3 stroke colors × 2 opacities (0.3 and 0.6)
- IsometricGridBG at opacity 0.10 and 0.20 (two side-by-side dark rectangles 400×300 each)

**Out of scope for `/dev/brand`:** no actual rendered cards from `pipelineGridProjects` or `flagship` (that's Phase 4's `/dev/grid`).

### G. IsometricCube 3-variant component design (VIS-03, D-07–D-12)

**TypeScript discriminated-union pattern (D-08):**

```ts
// Allowed-stroke literal union — TS enforces at compile time.
type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export interface IsometricCubeProps {
  variant: 'single' | 'group' | 'grid';
  /** One of 3 brand-allowed stroke colors. Default '#A7AFBC'. */
  stroke?: AllowedStroke;
  /** Stroke width 0.5–1.5pt ≈ 1–2px. Default 1. */
  strokeWidth?: number;
  /** Container opacity 0.05–0.60 (brandbook §5). Default 0.3. */
  opacity?: number;
  /** Sizing className. */
  className?: string;
}
```

**Why a literal union over `string`:** TS catches `<IsometricCube stroke="#FF0000" />` at the call site at compile time, BEFORE check-brand's runtime grep would have a chance to fail the build. Hover-tooltips in IDE display the 3 allowed values. Cost: zero runtime overhead, ~3 lines of type code.

**Why NOT runtime guard (`if (!ALLOWED.includes(stroke)) throw`):** runtime guards run at component-render time AFTER TS would've blocked it. Unnecessary defense-in-depth that adds bytes to the bundle.

**Body — recommended `single` variant geometry preserved from MinimalCube:**

```tsx
// src/components/brand/IsometricCube.tsx
//
// 3-variant inviolable brand primitive per VIS-03 + brand-system.md §5.
// Replaces Phase 1's MinimalCube (deleted in same commit per D-12).
// `single` variant preserves MinimalCube polygon geometry (viewBox 0 0 100 100,
// same 3-polygon points) — no visual shift between Phase 1 and Phase 3 stubs
// during the changeover commit.

import { IsometricGridBG } from './IsometricGridBG';

type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export interface IsometricCubeProps {
  variant: 'single' | 'group' | 'grid';
  stroke?: AllowedStroke;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}

export function IsometricCube({
  variant,
  stroke = '#A7AFBC',
  strokeWidth = 1,
  opacity = 0.3,
  className,
}: IsometricCubeProps) {
  // For the grid variant, delegate to IsometricGridBG — single source of geometry truth (D-09 wrapper option).
  if (variant === 'grid') {
    return <IsometricGridBG className={className} opacity={opacity} />;
  }

  return (
    <svg
      viewBox={variant === 'group' ? '0 0 220 100' : '0 0 100 100'}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {variant === 'single' && (
          <>
            <polygon points="50,15 85,35 50,55 15,35" />
            <polygon points="15,35 15,75 50,95 50,55" />
            <polygon points="50,55 50,95 85,75 85,35" />
          </>
        )}
        {variant === 'group' && (
          <>
            {/* Cube 1 (left) */}
            <polygon points="50,15 85,35 50,55 15,35" />
            <polygon points="15,35 15,75 50,95 50,55" />
            <polygon points="50,55 50,95 85,75 85,35" />
            {/* Cube 2 (right, sharing vertical edge with Cube 1's right face) */}
            <polygon points="120,15 155,35 120,55 85,35" />
            <polygon points="85,35 85,75 120,95 120,55" />
            <polygon points="120,55 120,95 155,75 155,35" />
            {/* Cube 3 (further right, optional 3rd cube — uncomment for 3-cube group)
            <polygon points="190,15 225,35 190,55 155,35" />
            <polygon points="155,35 155,75 190,95 190,55" />
            <polygon points="190,55 190,95 225,75 225,35" />
            */}
          </>
        )}
      </g>
    </svg>
  );
}
```

**Important:** the `group` viewBox is `0 0 220 100` (wider) so two cubes fit side-by-side. The shared edge (at x=85 for Cube 1's right face = x=85 for Cube 2's left face) makes them touch — brandbook page-20 «Структурна група».

**Replacing MinimalCube call sites:** check-brand's `denylistTerms` regex scope is `dist/**` and `src/**`, so the `<MinimalCube/>` import in any stub page must be deleted in the same commit. **Verified via grep before this research:**
```
$ grep -rn "MinimalCube" src/
(no matches)
```
The Phase 1 plan didn't actually use MinimalCube anywhere in pages — every page uses `<img src={markUrl}>` instead. So deleting `MinimalCube.tsx` is a clean delete with no consumer touch.

### H. Lighthouse Desktop ≥90 prerequisites for `/` (HOME-01 + D-18)

Phase 6 owns the verification (QA-02), but Phase 3 must **ship the foundations**:

**LCP target = `aerial.jpg` flagship card image.** Confirmed: the hero (above-fold) is pure SVG (IsometricGridBG) + type (H1, paragraph, button) — no rasters. The first large raster on the page is `aerial.jpg` in PortfolioOverview's flagship card. With `loading="eager" fetchpriority="high"` + preload link, browser starts fetching this image at HTML parse time, BEFORE the JS bundle finishes evaluating. Target LCP < 2.5s on desktop.

**CLS prevention:**
- `<ResponsivePicture>` emits explicit `width` and `height` attributes per the recipe in §C. Browser reserves space at layout time. Zero CLS from images.
- Web fonts (`@fontsource/montserrat/cyrillic-{400,500,700}.css`) ship with `font-display: swap` baked in (Fontsource default — verified in their docs). FOUT happens but is < 100ms on desktop ethernet for ~25KB cyrillic woff2.
- Hero parallax animates `transform: translateY()` only — never `top`/`margin`/`height`. Compositor-only operation, zero layout shift.

**TBT (Total Blocking Time):** Motion's `useScroll` + `useTransform` are MotionValue-driven (not React state) — they read scroll position via passive scroll listeners and write transforms directly to the GPU layer, bypassing React's render cycle. TBT impact: ~5–10ms on first scroll. Acceptable.

**FCP (First Contentful Paint):** with the Phase 1 cyrillic-only Fontsource subset (~60-80KB total for 3 weights) + a ~50KB JS bundle gzipped (target < 200KB per CLAUDE.md), FCP on desktop ethernet < 1s.

**Bundle budget check:** current `npm run build` produces (verified in Phase 1's `dist/`):
- index.html ~3KB
- Fontsource WOFF2 ~60–80KB total (loaded async)
- JS bundle (React 19 + react-router-dom + Motion + Tailwind utilities + page TSX) — Phase 2 baseline was small. Phase 3 adds: Hero/BrandEssence/PortfolioOverview/ConstructionTeaser/MethodologyTeaser/TrustBlock/ContactForm/HomePage + `<ResponsivePicture>` + `<IsometricCube>` + `<IsometricGridBG>` + Mark + DevBrandPage. Estimate ~30-40KB additional gzipped JS, leaving 130-150KB headroom.
- Motion 12 itself is ~25KB gzipped (just the parts used: motion.div, useScroll, useTransform, useReducedMotion).

**Optional: lazy-load `DevBrandPage`** via `React.lazy()` to keep it out of the homepage critical path:
```tsx
const DevBrandPage = lazy(() => import('./pages/DevBrandPage'));
// wrap with <Suspense fallback={null}>
```
**Recommendation:** Phase 3 ships eager — DevBrandPage is small and only contains static JSX. Phase 6 introduces lazy() if the bundle audit shows headroom pressure.

### I. Phase 2 content & data shapes (the planner needs these verbatim)

See §"Data Shape Catalog" below for the full catalog. Highlights:

- `flagship` is a single `Project` (typed, non-null assertion safe per Phase 2 D-04 invariant).
- `pipelineGridProjects` is a `Project[]` of length 3 (Etno Dim + Maietok + NTEREST, sorted by `order`).
- `aggregateProjects` is a `Project[]` of length 1 (Pipeline-4).
- `latestMonth().teaserPhotos` is `string[]` of 5 filenames — they are bare filenames, NOT URLs. Use `constructionUrl(month.key, file)` or `<ResponsivePicture src={`construction/${month.key}/${file}`}>` to get a URL.
- `brandValues` is a `BrandValue[]` (4 entries) — each `{ title: string; body: string }`. NO `id` field. NO `index` field. The position in the array IS the order.
- `methodologyBlocks` is a `MethodologyBlock[]` (7 entries) — each `{ index: 1..7; title: string; body: string; needsVerification: boolean }`. Filter to render 2–3 (recommended: index 1, 3, 7 — all `needsVerification: false`).
- `legalName`, `edrpou`, `licenseDate`, `licenseNote`, `email` are top-level named exports with `as const` literal types from `src/content/company.ts`.

### J. Source-of-truth hero copy (D-06)

**Status check (verified by grep):**
- Гасло «Системний девелопмент, у якому цінність є результатом точних рішень.» appears in:
  - `КОНЦЕПЦІЯ-САЙТУ.md` (multiple places, authoritative)
  - `.planning/PROJECT.md` Core Value
  - `brand-system.md` §1
  - **NOT** in any `src/content/*.ts` module yet (`grep -r "Системний девелопмент" src/` returns nothing).
- CTA labels:
  - «Переглянути проекти» — also not in any content module yet
  - «Перейти на сайт проекту ↗» — not yet authored
  - «Ініціювати діалог» — not yet authored
  - «Дивитись повний таймлайн» — not yet authored

**Recommendation:** create a NEW `src/content/home.ts` module with:

```ts
// src/content/home.ts
//
// Home-page-specific microcopy and the canonical hero gasло.
// Per D-06: gasло is verbatim from CONCEPT §2; keep typographic guillemets and apostrophe.
// Per D-29 / Phase 2 D-20: any string >40 chars OR containing «Системний» / «ВИГОДА»
// MUST live in a content module — never as a JSX literal.
//
// IMPORT BOUNDARY: same as other content modules — only pages/ and components/sections/
// may import. Never React/motion/components/hooks.

/** Hero gasло — canonical per CONCEPT §2 + brand-system.md §1. */
export const heroSlogan =
  'Системний девелопмент, у якому цінність є результатом точних рішень.';

/** Hero CTA label → /projects */
export const heroCta = 'Переглянути проекти';

/** PortfolioOverview section heading + subtitle */
export const portfolioHeading = 'Проєкти';
export const portfolioSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

/** Flagship card external CTA */
export const flagshipExternalCta = 'Перейти на сайт проекту ↗';

/** ConstructionTeaser CTA → /construction-log */
export const constructionTeaserCta = 'Дивитись повний таймлайн';

/** ContactForm primary CTA — opens mailto: */
export const contactCta = 'Ініціювати діалог';
```

**Why a new module, not extend `values.ts` or `placeholders.ts`:**
- `values.ts` is brandbook-authoritative — adding microcopy there muddies the file's intent.
- `placeholders.ts` is only for §11 open-questions (em-dash and «Без назви» fallbacks).
- A new `home.ts` is the cleanest scannable surface — the planner can grep one file when reviewing home copy.

**Microcopy exception (Phase 2 D-20):** button labels MAY stay inline per the exception. The recommendation above moves them to `home.ts` because (a) D-29 says «Phase 3 components have NO Ukrainian JSX literal paragraphs», and CTAs like «Перейти на сайт проекту ↗» are >40 chars; (b) keeping them in one file makes A/B copy iteration a one-edit change. Planner has discretion to inline shorter ones — «Переглянути проекти» (21 chars) is borderline.

## Data Shape Catalog

**Verbatim from `src/data/types.ts` and `src/content/*.ts` — for the planner's `<action>` blocks:**

### `Project` (`src/data/types.ts:27-58`)

```ts
export interface Project {
  slug: string;             // 'lakeview' | 'etno-dim' | 'maietok-vynnykivskyi' | 'nterest' | 'pipeline-4'
  title: string;            // 'ЖК Lakeview', 'ЖК Етно Дім', etc.
  stageLabel: string;       // 'активне будівництво', 'меморандум про відновлення будівництва', etc.
  stage: Stage;             // 'u-rozrakhunku' | 'u-pogodzhenni' | 'buduetsya' | 'zdano'
  presentation: Presentation; // 'flagship-external' | 'full-internal' | 'grid-only' | 'aggregate'
  location?: string;        // 'Львів', 'Винники', or undefined for aggregate
  externalUrl?: string;     // ONLY set when presentation='flagship-external' (Lakeview)
  renders: string[];        // filenames relative to public/renders/{slug}/
  facts?: { sections?: number; floors?: string; area?: string; deadline?: string; note?: string };
  whatsHappening?: string;  // ONLY set when presentation='full-internal'
  aggregateText?: string;   // ONLY set when presentation='aggregate' (Pipeline-4)
  order: number;            // 1..5; sort ascending
}
```

**Phase 3 consumers and field usage:**
- `<HeroCTA>` → `flagship.externalUrl`? No — Hero CTA goes to `/projects`. Flagship card uses `flagship.externalUrl`.
- PortfolioOverview flagship card → `flagship.title` + `flagship.stageLabel` + `flagship.facts?.deadline` (e.g. `'2027'`) OR `flagship.facts?.note` (e.g. `'Здача у 2027'`) + `flagship.renders[0]` (`'aerial.jpg'`) + `flagship.externalUrl`.
- PortfolioOverview pipeline card → `project.title` + `project.stageLabel` + `project.location` + `project.renders[0]` (NOTE: etno-dim is `'43615.jpg.webp'`, maietok is `'44463.jpg.webp'`, nterest is `'2213.jpg.webp'` — all `.jpg.webp` extensions, the optimizer handles them).
- PortfolioOverview aggregate row → `aggregateProjects[0].aggregateText` (the verbatim Pipeline-4 line).

### Derived views (`src/data/projects.ts:113-142`)

```ts
export const flagship: Project = projects.find(p => p.presentation === 'flagship-external')!;
// = the Lakeview record. Always defined (TS non-null assertion safe per Phase 2 D-04 invariant).

export const pipelineGridProjects: Project[] = projects
  .filter(p => p.presentation === 'full-internal' || p.presentation === 'grid-only')
  .sort((a, b) => a.order - b.order);
// = [etno-dim, maietok-vynnykivskyi, nterest], length 3 in Phase 3.

export const aggregateProjects: Project[] = projects
  .filter(p => p.presentation === 'aggregate');
// = [pipeline-4], length 1.

export const detailPageProjects: Project[] = projects
  .filter(p => p.presentation === 'full-internal');
// = [etno-dim], length 1. Phase 4 uses this; Phase 3 does NOT.

export const findBySlug = (slug: string): Project | undefined =>
  projects.find(p => p.slug === slug && p.presentation === 'full-internal');
// Phase 4 only.
```

### `ConstructionMonth` + `ConstructionPhoto` (`src/data/types.ts:60-85`)

```ts
export interface ConstructionPhoto {
  file: string;       // 'mar-01.jpg' (bare filename — pass to constructionUrl(month.key, file))
  caption?: string;   // optional brandbook-tone caption
  alt?: string;       // 'Будівельний майданчик, березень 2026'
}

export interface ConstructionMonth {
  key: string;            // 'mar-2026' (= folder name)
  label: string;          // 'Березень 2026'
  yearMonth: string;      // '2026-03' (sortable ISO)
  teaserPhotos?: string[]; // ONLY set on latestMonth() — array of filenames (subset of photos[].file)
  photos: ConstructionPhoto[];
}

// Helpers
export const constructionLog: ConstructionMonth[] = [/* 4 months reverse-chrono */];
export const latestMonth = (): ConstructionMonth => constructionLog[0];
```

**Phase 3 consumer (ConstructionTeaser):**
```ts
const month = latestMonth();
const photos: string[] = month.teaserPhotos ?? [];  // = ['mar-01.jpg', 'mar-05.jpg', 'mar-10.jpg', 'mar-12.jpg', 'mar-15.jpg']
const monthLabel = month.label;                      // = 'Березень 2026'
// To build URL for an <img>: constructionUrl(month.key, file)
```

### `BrandValue` (`src/data/types.ts:101-104`) and `brandValues`

```ts
export interface BrandValue {
  title: string;  // 'Системність', 'Доцільність', 'Надійність', 'Довгострокова цінність'
  body: string;   // ~150-200 char paragraph each
}

export const brandValues: BrandValue[];  // 4 entries, in canonical order
```

**No `id`, no `index`, no `icon` field.** The 4 values are positionally ordered. BrandEssence renders them via `brandValues.map((v, i) => <Card key={v.title} number={i + 1} {...v} />)`.

### `MethodologyBlock` (`src/data/types.ts:88-98`) and `methodologyBlocks`

```ts
export interface MethodologyBlock {
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  body: string;             // \n\n is paragraph separator if multi-paragraph; currently each is a single paragraph
  needsVerification: boolean;
}

export const methodologyBlocks: MethodologyBlock[];  // 7 entries
```

**`needsVerification: true`** on indexes 2, 5, 6.

**Phase 3 consumer (MethodologyTeaser, recommended block selection 1, 3, 7 — three verified blocks):**
```ts
const featured = methodologyBlocks.filter(b => [1, 3, 7].includes(b.index));
// All three have needsVerification: false → no ⚠ markers needed in MVP.
// If planner picks blocks that include a needsVerification:true (e.g. 4 + 5),
// render the ⚠ inline with that block's title.
```

### Company facts (`src/content/company.ts`)

```ts
export const legalName = 'ТОВ «БК ВИГОДА ГРУП»' as const;
export const edrpou = '42016395' as const;
export const licenseDate = '27.12.2019' as const;
export const licenseNote = '(безстрокова)' as const;
export const email = 'vygoda.sales@gmail.com' as const;

export const socials: { telegram: string; instagram: string; facebook: string };
// All values = '#' until launch.
```

### Placeholders (`src/content/placeholders.ts`)

```ts
export const phone = '—';
export const address = '—';
export const pipeline4Title = 'Без назви';
export const etnoDimAddress = '—';
```

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **None — `tsc --noEmit` + grep + manual visual QA at `/dev/brand`** per CLAUDE.md "SKIP for MVP" + Phase 2 STATE pattern |
| Config file | `tsconfig.json` (root, type-only check); `scripts/check-brand.ts` (CI invariants) |
| Quick run command | `npm run lint` (= `tsc --noEmit`) |
| Full suite command | `npm run build` (chains `prebuild` → `tsc --noEmit && vite build` → `postbuild` `tsx scripts/check-brand.ts`) |

**Rationale:** STACK.md (verified 2026-04-24) says SKIP Vitest/Playwright for MVP — a 5-page marketing site with zero business logic has nothing worth unit-testing. The test pyramid would be ceremony, not value. Phase 2 PASSED its TDD gate via `npm run lint` + acceptance-criteria grep + a one-shot `npx tsx -e` runtime invariant check (11 invariants). Phase 3 follows the same pattern.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| **HOME-01** | Hero renders wordmark + CTA + parallax + gasло | grep + manual visual at `/` | `grep -E "ВИГОДА.*<.*h1\|heroSlogan\|useScroll" src/components/sections/home/Hero.tsx` ; `npm run dev → open / and scroll` | ❌ Wave 0 (file does not exist) |
| HOME-01 (parallax constraint) | `useTransform` output range bounded `[0, -120]` | grep | `grep -nE "useTransform.*\\[0,?\\s*-120\\]" src/components/sections/home/Hero.tsx` | ❌ Wave 0 |
| HOME-01 (no inline transitions) | No new `transition={{}}` introduced | grep | `grep -rn "transition={{" src/components/sections/home/ \|\| echo PASS` | ❌ Wave 0 |
| **HOME-02** | BrandEssence renders 4 cards with verbatim `brandValues` titles | grep | `grep -nE "Системність\|Доцільність\|Надійність\|Довгострокова" src/components/sections/home/BrandEssence.tsx` (NEGATIVE — must NOT find inline; values come from import) ; `grep -nE "from '\\.\\.\\/\\.\\.\\/\\.\\.\\/content/values'" src/components/sections/home/BrandEssence.tsx` (POSITIVE — must find the import) | ❌ Wave 0 |
| **HOME-03** | PortfolioOverview imports `flagship` + `pipelineGridProjects` + `aggregateProjects` and uses `<ResponsivePicture>` for renders | grep | `grep -nE "from '\\.\\.\\/\\.\\.\\/\\.\\.\\/data/projects'" src/components/sections/home/PortfolioOverview.tsx ; grep -nE "<ResponsivePicture" src/components/sections/home/PortfolioOverview.tsx` | ❌ Wave 0 |
| HOME-03 (no hardcoded /renders/) | `check-brand.ts importBoundaries()` passes | invariant | `tsx scripts/check-brand.ts` (already wired as `postbuild`) | ✅ Phase 2 |
| **HOME-04** | ConstructionTeaser renders 3–5 photos from `latestMonth().teaserPhotos` + CTA → `/construction-log` | grep | `grep -nE "latestMonth\\(\\)\\.teaserPhotos\|teaserPhotos" src/components/sections/home/ConstructionTeaser.tsx ; grep -nE 'to="/construction-log"' src/components/sections/home/ConstructionTeaser.tsx` | ❌ Wave 0 |
| **HOME-05** | MethodologyTeaser renders 2–3 blocks; ⚠ marker on `needsVerification: true` if any | grep + visual | `grep -nE "methodologyBlocks\|needsVerification" src/components/sections/home/MethodologyTeaser.tsx` ; manual visual | ❌ Wave 0 |
| **HOME-06** | TrustBlock renders ЄДРПОУ + ліцензія + email from `company.ts` | grep | `grep -nE "edrpou\|licenseDate\|email" src/components/sections/home/TrustBlock.tsx ; grep -nE "<img.*team\|керівник\|команда" src/components/sections/home/TrustBlock.tsx \|\| echo PASS` | ❌ Wave 0 |
| **HOME-07** | ContactForm renders single `mailto:` button (NO form fields) | grep | `grep -nE "mailto:vygoda.sales@gmail.com" src/components/sections/home/ContactForm.tsx ; grep -nE "<input\|<form\|<textarea" src/components/sections/home/ContactForm.tsx \|\| echo PASS` | ❌ Wave 0 |
| **VIS-03** | IsometricCube exposes typed `variant` + `stroke` restricted to 3 hexes | grep + lint | `grep -nE "variant: 'single' \\| 'group' \\| 'grid'" src/components/brand/IsometricCube.tsx ; grep -nE "stroke\\?: '#A7AFBC' \\| '#F5F7FA' \\| '#C1F33D'" src/components/brand/IsometricCube.tsx ; npm run lint` | ❌ Wave 0 |
| VIS-03 (IsometricGridBG ships) | Component file exists and exports IsometricGridBG | file-exists | `test -f src/components/brand/IsometricGridBG.tsx && grep -E "export function IsometricGridBG" src/components/brand/IsometricGridBG.tsx` | ❌ Wave 0 |
| VIS-03 (MinimalCube deleted) | The throwaway stub is removed | file-not-exists | `test ! -f src/components/brand/MinimalCube.tsx` | ✅ (file currently EXISTS, will be deleted in Phase 3 commit) |
| **VIS-04** | Logo (Phase 1) + Mark (Phase 3 new) + favicon | grep | `test -f src/components/brand/Logo.tsx && test -f src/components/brand/Mark.tsx ; grep -nE "favicon" index.html` | Logo: ✅ Phase 1; Mark: ❌ Wave 0; favicon: ✅ Phase 1 |
| **ANI-01** | Hero parallax uses Motion `useScroll`+`useTransform`, ease-out (no spring), no bounce, max 120px | grep | `grep -nE "useScroll\\(.*target.*offset" src/components/sections/home/Hero.tsx ; grep -nE "useTransform.*\\[0, ?-120\\]\|\\[0,?\\s*-120\\]" src/components/sections/home/Hero.tsx ; grep -nE "type: ?'spring'\|bounce:" src/components/sections/home/Hero.tsx \|\| echo PASS` | ❌ Wave 0 |
| ANI-01 (reduced-motion) | Hero respects `prefers-reduced-motion` | grep | `grep -nE "useReducedMotion" src/components/sections/home/Hero.tsx` | ❌ Wave 0 |
| **D-19 image pipeline** | `scripts/optimize-images.mjs` exists; emits AVIF/WebP/JPG triples | file-exists + spot-check | `test -f scripts/optimize-images.mjs ; ls public/renders/lakeview/_opt/aerial-1920.avif public/renders/lakeview/_opt/aerial-1920.webp public/renders/lakeview/_opt/aerial-1920.jpg` (after `npm run prebuild`) | ❌ Wave 0 |
| **D-18 hero preload** | `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` in `index.html` for aerial-1920 | grep | `grep -nE 'rel="preload".*as="image".*aerial-1920\|fetchpriority="high"' index.html` | ❌ Wave 0 (index.html does not yet have preload) |
| **D-25 /dev/brand** | Hidden route registered in `src/App.tsx` and DevBrandPage exists | grep + file-exists | `grep -nE 'path="dev/brand"' src/App.tsx ; test -f src/pages/DevBrandPage.tsx` | ❌ Wave 0 |
| **Phase 2 D-30 / D-33 import boundaries hold** | `check-brand.ts importBoundaries()` PASS after Phase 3 lands | invariant | `tsx scripts/check-brand.ts` exit 0; section header `[check-brand] PASS importBoundaries` in output | ✅ Phase 2 (script exists; will run on Phase 3 build) |
| **Phase 2 D-25 silent-displacement holds** | No Pictorial/Rubikon leaks in `dist/` after Phase 3 build | invariant | `tsx scripts/check-brand.ts` `[check-brand] PASS denylistTerms` | ✅ Phase 2 |
| **Phase 2 D-26 palette holds** | No non-canonical hex in `src/`; the 6 in IsometricCube TS literals are whitelisted | invariant | `tsx scripts/check-brand.ts` `[check-brand] PASS paletteWhitelist` | ✅ Phase 2 |

### Sampling Rate

- **Per task commit:** `npm run lint` (≈2-5s) — type-check the new components.
- **Per wave merge:** `npm run build` (full prebuild + tsc + vite build + postbuild check-brand). Includes the image-pipeline optimizer (~30-60s on first run, <5s incremental).
- **Phase gate:** `npm run build` is green AND manual visual QA at `/#/dev/brand` shows all primitives render AND `/` looks correct on 1920×1080 desktop AND PORTFOLIO/CONSTRUCTION/METHODOLOGY/TRUST/CONTACT sections all render with real data (no `undefined`, no broken images, no console errors).

### Wave 0 Gaps

- [ ] `scripts/optimize-images.mjs` — sharp encoder (D-19/D-20). Install `sharp@^0.34.5` first.
- [ ] `src/components/brand/IsometricCube.tsx` — 3-variant primitive (VIS-03 / D-07).
- [ ] `src/components/brand/IsometricGridBG.tsx` — svgr `?react` wrapper (D-03).
- [ ] `src/components/brand/Mark.tsx` — URL-import wrapper (D-28).
- [ ] **Delete** `src/components/brand/MinimalCube.tsx` (D-12).
- [ ] `src/components/ui/ResponsivePicture.tsx` — picture/source/img helper (D-21).
- [ ] `src/components/sections/home/{Hero,BrandEssence,PortfolioOverview,ConstructionTeaser,MethodologyTeaser,TrustBlock,ContactForm}.tsx` — 7 home-page sections.
- [ ] `src/pages/HomePage.tsx` — REPLACE Phase 1 placeholder, compose 7 sections.
- [ ] `src/pages/DevBrandPage.tsx` — `/dev/brand` QA surface (D-25).
- [ ] `src/App.tsx` — add `<Route path="dev/brand">`.
- [ ] `src/content/home.ts` — home-specific microcopy module (recommended; planner has discretion).
- [ ] `src/vite-env.d.ts` — add `/// <reference types="vite-plugin-svgr/client" />` line.
- [ ] `package.json` — modify `predev` and `prebuild` to chain `optimize-images.mjs`; add `sharp` to devDependencies.
- [ ] `index.html` — add `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` for `aerial-1920.avif` (D-18).

## Pitfalls & Gotchas

### 1. svgr `?react` query — TypeScript error if `vite-plugin-svgr/client` types not referenced
**What goes wrong:** `import GridSvg from '../../../brand-assets/patterns/isometric-grid.svg?react'` produces `Cannot find module '...?react'` TS error.
**Why:** `tsconfig.json` only references `vite/client`; svgr's type augmentation lives in `vite-plugin-svgr/client.d.ts`.
**How to avoid:** add `/// <reference types="vite-plugin-svgr/client" />` as the FIRST line of `src/vite-env.d.ts` (above the existing `vite/client` reference). Alternatively, add `"vite-plugin-svgr/client"` to `compilerOptions.types` in `tsconfig.json`. The svgr README documents the first option as canonical.

### 2. `vite-plugin-svgr` `include: '**/*.svg?react'` is the CORRECT default — don't overthink
**What goes wrong:** Believing the default include pattern is too narrow and rewriting it to `'brand-assets/**/*.svg?react'` or `**/*.svg`.
**Why:** Phase 1's `vite.config.ts` uses `include: '**/*.svg?react'`. The `?react` query is the trigger; ALL `.svg` files imported with that query get processed. Files imported as `import url from 'foo.svg'` (no query) get URL-imported via Vite's default handling — that's how `Logo.tsx` works (D-27). Both patterns coexist on the same file: `import Foo from 'foo.svg?react'` → React component; `import fooUrl from 'foo.svg'` → URL string. No collision.

### 3. `<defs><style>` blocks in svgr-imported SVGs persist across instances
**What goes wrong:** Two `<IsometricGridBG />` instances on the same page produce two `<style>` blocks with the same `.cls-1 { fill: #c1f33d }` selectors. Browser behavior is fine (last-defined wins, but they're identical), BUT the document has duplicate IDs if any are present. The brand-asset isometric-grid.svg has `id="_Шар_1"` — duplicate.
**Why:** svgr inlines the SVG verbatim; class scoping in inline `<style>` is global within the document.
**How to avoid:** for Phase 3, only ever instantiate `<IsometricGridBG />` ONCE per page (hero only). The `<IsometricCube variant='grid'>` wrapper that delegates to `<IsometricGridBG>` is fine because it's the same single instance, just rendered differently. If multiple instances become necessary in v2, configure svgr's `svgo` to strip ids and `<defs><style>`. For Phase 3 — single instance, ship as-is.

### 4. AVIF preload `type="image/avif"` is silently ignored on unsupported browsers — fine, but VERIFY on Safari ≤16
**What goes wrong:** A pre-Safari-16 client opens the demo, browser doesn't recognize AVIF, preload directive is silently dropped, browser falls back to `<img src="…1920.jpg">` (the JPG fallback in `<picture>`), but without preload — LCP regresses.
**Why:** AVIF baseline = Safari 16 (Sept 2022). Older Safari (15 and below) is rare in the Ukrainian market in 2026 but possible on corporate-managed Macs.
**How to avoid:** `<picture>` already provides JPG fallback (D-18 + §C recipe). The preload optimization is bonus for AVIF-supporting browsers. Acceptable degraded LCP on ancient Safari.

### 5. `<link rel="preload" crossorigin>` mismatch silently misses
**What goes wrong:** Adding `crossorigin` to the preload link without the actual `<picture>` request also being CORS-anonymous causes the browser to fetch the image TWICE (once as preload, once as the actual `<img>` request).
**Why:** Browsers strictly match preload by URL + CORS state.
**How to avoid:** OMIT `crossorigin` entirely on the preload link. The hero image is same-origin (Pages serves it from `/vugoda-website/`), so no CORS dance is needed. Recipe in §C reflects this.

### 6. Motion `useScroll({ target: ref })` requires the ref to be attached BEFORE the hook reads it
**What goes wrong:** Hero component does `const heroRef = useRef(null); const { scrollYProgress } = useScroll({ target: heroRef });` and then `<section ref={heroRef}>`. On first render, `target.current === null`, so `useScroll` falls back to viewport scrolling; first scroll event triggers correct re-evaluation.
**Why:** React refs are populated AFTER render commit. Motion 12 handles this internally — it re-subscribes when the ref attaches — but during the brief initial mount, behavior may be viewport-scoped.
**How to avoid:** The recipe in §A is correct. Motion 12.38's `useScroll` properly handles ref-attachment timing. The "double scroll listener on first mount" artifact is invisible in practice (well under 16ms before the next frame).

### 7. HashRouter + anchor links (`<a href="#section">`)
**What goes wrong:** Internal in-page anchors inside the home page (e.g., scroll-to-section) collide with the hash-route URL. `<a href="#contact">` on `/#/` would navigate to `/#contact` which the router parses as a new top-level route — page reload-ish behavior.
**Why:** HashRouter uses the hash for routing; nested in-page hashes are ambiguous.
**How to avoid:** Phase 3 doesn't need anchor scrolling — sections are visible by scrolling, not by hash navigation. If a future feature adds "scroll to contact" behavior, use a `useEffect`-driven `element.scrollIntoView({ behavior: 'smooth' })` triggered by a button click, NOT an `<a href="#contact">`.

### 8. sharp ESM/CJS interop on Node 20
**What goes wrong:** `import sharp from 'sharp'` in `optimize-images.mjs` works on Node 20 (sharp 0.34 supports both CJS and ESM via `package.json` `exports` map). On Node 18 (which is below the project's pinned `^20.19 || >=22.12`), `sharp` may complain about interop. We're not on 18, so this is fine.
**Why:** sharp pre-0.33 was CJS-only; 0.33+ ships dual CJS/ESM. Node 20+ honors the `exports` map.
**How to avoid:** confirm `node --version` ≥ 20.19 in the contributor environment. Phase 1 pinned this in `.nvmrc` (per Phase 1 D-19 references). CI uses `actions/setup-node@v4` with `node-version: 20`.

### 9. sharp source-mtime drift after `git pull`
**What goes wrong:** After `git pull`, all files get a fresh mtime (newer than the existing `_opt/` outputs from a prior build), so the optimizer thinks every source has changed and re-encodes 70 images — first build after a pull is slow.
**Why:** git doesn't preserve mtime; new checkouts get NOW timestamps.
**How to avoid:** ACCEPT the slow first build after pull (~30-60s). This is preferable to a content-hash-based skip mechanism (which would be more code, more state to maintain). If post-launch the CI build time becomes a concern, add a `git restore-mtime`-style step or migrate to a manifest-file caching scheme — neither is Phase 3 scope.

### 10. `_opt/` folders pollute git after `npm run prebuild` locally
**What goes wrong:** Dev runs `npm run dev`, which runs `predev` (which runs `optimize-images.mjs`), which creates 70 × 3 = 210 files in `public/renders/lakeview/_opt/`, etc. These are not in `.gitignore` and pollute git status.
**Why:** Phase 2's `.gitignore` (verified: `cat .gitignore`) covers `node_modules/`, `dist/`, `public/renders/`, `public/construction/`. **`public/renders/` and `public/construction/` are ALREADY ignored** because Phase 2 considers them generated output. So `_opt/` siblings (subdirectories of these ignored trees) are also ignored — no Phase 3 .gitignore change needed.
**Verified:** `cat .gitignore` shows the relevant lines. (If somehow the .gitignore is missing these entries, Phase 3 plan should add them — but per Phase 2 STATE the .gitignore was created with the correct scope.)

### 11. `loading="lazy"` accidentally applied to flagship hero card
**What goes wrong:** Default `<ResponsivePicture loading>` is `'lazy'` per the recipe in §C. If PortfolioOverview forgets to override to `loading="eager" fetchPriority="high"` for the flagship card, LCP regresses by 1-2s on cold load.
**Why:** Sensible default for most images, wrong default for the LCP image specifically.
**How to avoid:** PortfolioOverview component code passes `loading="eager"` and `fetchPriority="high"` explicitly to the flagship's `<ResponsivePicture>`. Validation: grep for `loading="eager"` should match exactly ONE call site in `src/` after Phase 3 lands (the flagship card). Anywhere else with eager loading is suspect.

### 12. `<picture>` `<source>` ordering matters
**What goes wrong:** Browser picks the FIRST `<source>` with a supported `type`. If WebP source is listed before AVIF, AVIF-supporting browsers will still use WebP (suboptimal compression).
**Why:** Per HTML spec, `<picture>` evaluates sources in document order, picks first match.
**How to avoid:** Order is **AVIF first, WebP second, JPG fallback in `<img>`**. The recipe in §C reflects this. Don't reorder.

### 13. SSR-hydration gotchas (irrelevant — but noted for completeness)
**What goes wrong:** N/A.
**Why:** This site is **a static SPA on GitHub Pages with no SSR**. Vite builds to a static `dist/` and serves it; there's no server-rendered pre-paint to mismatch with React hydration. Motion's `useScroll` works only client-side, which is fine here. React 19's new SSR concurrency hooks are unused.
**How to avoid:** N/A. Mentioned to head off any SSR hand-wringing.

### 14. Inline `transition={{}}` on `<motion.*>` — Phase 5 will purge
**What goes wrong:** Hero parallax recipe in §A uses `style={{ y: cubeY }}` on `<motion.div>`. If a developer is tempted to add `transition={{ duration: 0.4, ease: 'easeOut' }}` to make the parallax "feel slower", that contradicts D-04 (no inline transitions) and Phase 5's centralization plan.
**Why:** `transition` on a motion component governs the spring/tween of declarative `animate=`. Parallax driven by `useTransform` is NOT a transition — it's a direct MotionValue→style map. Adding `transition={{}}` here is redundant AND scatters easing config across files.
**How to avoid:** the recipe in §A has NO `transition={{}}` prop. The parallax range itself is the easing curve (linear over scrollYProgress). For "slower feel", widen the offset window (`['start start', 'end -200px']`) or shrink the output range. Phase 5 owns shared easing constants.

### 15. `MotionConfig` not used — fine
**What goes wrong:** None — but Motion offers a `<MotionConfig>` provider for project-wide reduced-motion / nonce settings. Phase 3 doesn't wire it.
**Why:** Phase 5 owns project-wide motion config. Phase 3's reduced-motion guard is local to Hero.

### 16. Logo.tsx URL-import vs `?react` (settled — D-27)
**What goes wrong:** Trying to "fix" Logo.tsx during Phase 3 to use `?react`, breaking the byte-identical bundling that quick-task 260424-whr verified.
**Why:** Phase 1 spec'd `?react` but reality shipped URL-import. The quick task verified URL-import works. D-27 explicitly says STAY.
**How to avoid:** don't touch `Logo.tsx`. Mark the file as "Phase 1 inviolable" in the planner's `<no-edit>` list.

## Recommended Order of Operations

The phase has 7 home-page sections + 4 brand primitives + 1 image pipeline + 1 hidden route. Suggested commit/wave structure (planner adjusts based on actual parallelization config — `parallelization: true` per `.planning/config.json` allows independent waves):

### Wave 1 — Brand primitives + dev showcase (sequential foundation)

1. **Install sharp** (`npm i -D sharp@^0.34.5`) — separate from any code commit, just lockfile.
2. **Add svgr type reference** to `src/vite-env.d.ts` (single line).
3. **Author IsometricGridBG.tsx** (svgr `?react` import + opacity wrapper) — 30 lines.
4. **Author IsometricCube.tsx** (3 variants discriminated union, delegate `grid` to IsometricGridBG) — 80 lines.
5. **Author Mark.tsx** (URL-import wrapper for mark.svg) — 12 lines.
6. **Delete MinimalCube.tsx** in same commit as #4 — verify zero call sites with grep before deleting.
7. **Author DevBrandPage.tsx** — palette + Montserrat ladder + all primitives showcase, ~150 lines static JSX.
8. **Add `<Route path="dev/brand">` to App.tsx** — 1-line edit.
9. **Verification:** `npm run lint`, `npm run dev`, navigate to `/#/dev/brand`, eyeball all primitives.

### Wave 2 — Image pipeline + ResponsivePicture (sequential, depends on Wave 1 nothing)

10. **Author scripts/optimize-images.mjs** per §D recipe — ~80 lines.
11. **Modify `package.json` `predev`/`prebuild`** to chain `&& node scripts/optimize-images.mjs`.
12. **Run `npm run prebuild` once** — confirms 70 sources × 3 widths × 3 formats = ~630 files emerge in `_opt/` directories within budget. Spot-check `aerial-1920.avif` size <140KB, `aerial-1920.jpg` size <200KB.
13. **Author ResponsivePicture.tsx** per §C recipe — 60 lines.
14. **Add hero preload `<link>` to `index.html`** — 5-line addition above `<title>`.
15. **Verification:** `npm run build` runs prebuild → tsc → vite → postbuild check-brand all green.

Wave 1 and Wave 2 can run in parallel — they don't share files. Wave 3+ depends on both.

### Wave 3 — Above-fold home sections (Hero + BrandEssence + PortfolioOverview)

16. **Create `src/content/home.ts`** with hero + microcopy strings.
17. **Author Hero.tsx** per §A recipe — wordmark + parallax + CTA. ~50 lines.
18. **Author BrandEssence.tsx** — consume `brandValues`, render 4 cards (4-in-row OR 2×2 — planner picks). ~40 lines.
19. **Author PortfolioOverview.tsx** — flagship card + pipeline grid + aggregate row. ~120 lines.
20. **Compose first half of `HomePage.tsx`** — replace stub, render `<Hero/><BrandEssence/><PortfolioOverview/>`.
21. **Verification:** `/` shows hero with parallax + 4 values + flagship + 3 pipeline cards + aggregate row. Lighthouse spot-check on `/` Performance > 80 (Phase 6 owns 90+ verification).

### Wave 4 — Below-fold home sections (ConstructionTeaser + MethodologyTeaser + TrustBlock + ContactForm)

22. **Author ConstructionTeaser.tsx** per §E recipe — 60 lines.
23. **Author MethodologyTeaser.tsx** — pick 2–3 verified blocks, render with optional ⚠ marker logic.
24. **Author TrustBlock.tsx** — 3-column from `company.ts`.
25. **Author ContactForm.tsx** — single mailto: button.
26. **Compose final `HomePage.tsx`** — append the 4 below-fold sections.
27. **Verification:** full `/` page renders all 7 sections in order Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm. `npm run build` green. Manual visual QA on 1920×1080.

### Wave 5 — Phase gate

28. **Run `npm run build`** — full pipeline green.
29. **Run `tsx scripts/check-brand.ts`** — all 4 invariants pass.
30. **Manual visual QA** on `/` and `/dev/brand` at 1920×1080 (and a 1280px reflow check).
31. **Commit phase-end snapshot** + transition to Phase 4.

**Total estimated SLOC:** ~700 lines new TSX + ~80 lines mjs + ~5 lines config = ~785 lines for Phase 3.

## Open Questions for Planner

1. **BrandEssence layout: 4-in-row vs 2×2.** `brandValues` body strings are ~150-200 chars each. At 1280px container width, 4-in-row gives each card ~280px width — readable but tight. 2×2 gives ~600px — generous, more breathing room. Recommendation: **2×2 with numbered «01–04»** counters in `text-text-muted` font-medium (echoes brandbook's «3 ступені складності» numbered ladder, brand-system.md §5). Planner has authority to override.

2. **MethodologyTeaser block selection.** Three blocks recommended: 1, 3, 7 (all `needsVerification: false`). Alternative: 1, 4, 7 — block 4 narrates Etno Dim memorandum work, ties to PortfolioOverview's Etno Dim card, creates a soft inter-section hook. Either selection is brand-clean. Planner picks based on visual flow.

3. **TrustBlock layout — 3-col table vs stacked vs strip.** Footer already shows ЄДРПОУ/ліцензія/email in column 3 of a 3-col grid (Phase 1). TrustBlock on home is the FIRST surface most visitors see those facts. Recommendation: **3-column horizontal table** with column headers («Юр. особа» / «Ліцензія» / «Контакт») in `text-text-muted` `font-medium uppercase` and values in `text-text` `font-bold` — gives the legal triplet visual weight without being a card. Planner has discretion to make it 3 stacked rows for more emphasis.

4. **ConstructionTeaser arrow button placement.** Recipe in §E places them OUTSIDE the strip with `absolute -translate-x-1/2 / translate-x-1/2` (centered on the strip's left/right edges, 50% inside / 50% outside). Alternative: hide on small viewports, show on hover only via `group-hover:opacity-100`. Recommendation: **outside, always-visible** — desktop-first, no hover-discoverable UI per brand tone «впевнено, предметно».

5. **Hero "scroll down" indicator (subtle down-arrow + text).** D-decisions / Claude's Discretion says "leaning no". Recommendation: **skip entirely** — wordmark + gasло + CTA + parallax already give the user 3 affordances to engage; adding a 4th is noise. If a UX gap surfaces in real-user testing post-launch, it's a 5-line addition.

6. **`scripts/optimize-images.mjs` vs `.ts`.** Per D-20, planner may write it as `.ts` if `@types/sharp` is added to `tsconfig.scripts.json`. Recommendation: **stay with `.mjs`** — keeps tsconfig.scripts.json surface tight (Phase 2 D-01 / 02-01 decisions established the lean tsconfig discipline). Plain ESM is also more grep-able for ops people.

7. **`/dev/brand` includes sample compositions or just primitives.** D-discretion says "leaning toward primitives only". Recommendation: **primitives only** — Phase 4's `/dev/grid` will showcase real composition (PipelineGrid with synthetic fixtures). Keeping `/dev/brand` to atoms aligns with that split (atoms here, molecules there).

8. **PortfolioOverview flagship card layout: side-by-side vs overlay.** §Specifics in CONTEXT.md recommends side-by-side (image left 60%, text right 40%) over overlay. Recommendation: **side-by-side** — overlays on architectural CGI compete with building facades and tend to require dark gradient masks that murk the render.

9. **Footer.tsx refactor — pull legal text from `company.ts`?** Phase 1's `Footer.tsx` hardcodes `«ТОВ «БК ВИГОДА ГРУП»»`, `«ЄДРПОУ 42016395»`, `«Ліцензія від 27.12.2019 (безстрокова)»` as JSX literals (lines 67-71). Phase 2 `company.ts` exports the same as `legalName`/`edrpou`/`licenseDate`/`licenseNote` named consts. Refactor would dedupe — one edit propagates to both Footer and TrustBlock. **NOT in Phase 3 scope per CONTEXT.md** — Phase 3 should NOT touch `Footer.tsx`. Planner may flag this as a quick-task post-Phase-3. If undertaken, ensure check-brand still passes (it would; no boundary violation introduced).

## Sources

### Primary (HIGH confidence)
- `node_modules/framer-motion/dist/types/index.d.ts` (verified 2026-04-25) — `useScroll`, `useTransform`, `useReducedMotion`, `UseScrollOptions` signatures for Motion 12.38.0
- `node_modules/vite-plugin-svgr/client.d.ts` + `node_modules/vite-plugin-svgr/README.md` (verified 2026-04-25) — `?react` query type augmentation
- `npm view sharp version` + `npm view sharp engines` (verified 2026-04-25) — sharp 0.34.5 latest, Node `^18.17 || ^20.3 || >=21`
- `vite.config.ts:12-20` (verified 2026-04-25) — svgr plugin config already in place
- `package.json:7-14` (verified 2026-04-25) — current scripts, all installed deps
- `src/data/types.ts`, `src/data/projects.ts`, `src/data/construction.ts`, `src/content/{values,methodology,company,placeholders}.ts`, `src/lib/assetUrl.ts` (verified 2026-04-25) — exact data/content shapes Phase 3 imports
- `src/index.css:8-26` — Tailwind v4 `@theme` block, generates utilities `bg-bg`, `text-text`, etc.
- `scripts/check-brand.ts` (verified 2026-04-25) — 4-check invariant guard
- [.planning/research/ARCHITECTURE.md](.planning/research/ARCHITECTURE.md) §3 Q4 — IsometricCube template
- [.planning/research/ARCHITECTURE.md](.planning/research/ARCHITECTURE.md) §3 Q5 — Motion 3-layer composition + hero parallax block
- [.planning/research/PITFALLS.md](.planning/research/PITFALLS.md) §Pitfall 8 — Hero LCP preload pattern
- [.planning/research/PITFALLS.md](.planning/research/PITFALLS.md) §Pitfall 9 — AVIF/WebP fallback `<picture>` shape
- [brand-system.md](brand-system.md) §3, §5 — palette + isometric line params
- [КОНЦЕПЦІЯ-САЙТУ.md](КОНЦЕПЦІЯ-САЙТУ.md) §7.1 — home page section spec

### Secondary (MEDIUM confidence — WebSearch verified against multiple sources)
- AVIF browser baseline as of 2026 — Safari 16+ (Sept 2022), 16.4 retroactive for older macOS, Baseline 2024 status. Sources: [Can I use… AVIF](https://caniuse.com/avif), [Wikipedia AVIF](https://en.wikipedia.org/wiki/AVIF), [Coywolf: Safari 16 supports AVIF](https://coywolf.com/news/web-development/safari-supports-avif-in-macos-ventura-and-ios-16/)
- sharp AVIF default settings (quality 50, effort 4) — confirmed in [GitHub issue lovell/sharp#4227](https://github.com/lovell/sharp/issues/4227) and [sharp output options docs](https://sharp.pixelplumbing.com/api-output/)

### Tertiary (LOW confidence — flagged for validation at impl)
- Exact pixel sizing for `<h1>` hero wordmark (180–220px clamp) — visually tunes at 1920×1080; planner adjusts in browser
- BrandEssence card body length tolerance for 4-in-row vs 2×2 — depends on character count; verify after Wave 3

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package version verified against installed `node_modules` types
- Architecture: HIGH — recipes paste-ready, derived from official type definitions and existing Phase 1/2 code
- Pitfalls: HIGH — 14 of 16 pitfalls reference verified file paths or known browser/library behavior; #4 (AVIF preload silent ignore) and #13 (SSR irrelevance) are deductive

**Research date:** 2026-04-25
**Valid until:** 2026-05-25 (30 days; stable stack — Vite 6, React 19, Motion 12, sharp 0.34, svgr 4 are all in their stable lifecycle phase)

## RESEARCH COMPLETE
