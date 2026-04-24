# Architecture Research

**Domain:** Visually-demanding desktop-first marketing SPA (Vite 6 + React 19 + TS + Tailwind v4 + Motion) deployed to GitHub Pages
**Researched:** 2026-04-24
**Confidence:** HIGH for folder/data/token patterns (concrete, well-known); MEDIUM for Motion + AnimatePresence specifics (training-data era, verify at impl time); HIGH for GH Pages Cyrillic-filename recommendation (first-principles: URL-encoded paths + deploy tooling footguns warrant translit regardless)

> This document answers 8 concrete architecture questions for the MVP. It's deliberately opinionated — "do X because Y" — so the roadmap can be built against it without further decisions. Where a recommendation is inherited from the brand or concept, the source is cited inline.

---

## 1. System Overview

This is a **static marketing SPA** with no backend, no CMS, no state server. All "business logic" is content configured in TypeScript — the runtime is purely presentational.

```
┌─────────────────────────────────────────────────────────────┐
│                    Build time (Vite)                         │
├─────────────────────────────────────────────────────────────┤
│  copy-assets.ts   tailwindcss()   vite-plugin-react          │
│       │                 │                  │                 │
│       ▼                 ▼                  ▼                 │
│  /public/renders   index.css (@theme)   bundled JS           │
│  /public/construction  + tokens         + SVG-as-component   │
└──────────────────────┬──────────────────────────────────────┘
                       │ static output
┌──────────────────────▼──────────────────────────────────────┐
│                    Runtime (browser)                         │
├─────────────────────────────────────────────────────────────┤
│   BrowserRouter(basename=/vugoda-website)                    │
│        │                                                     │
│        ▼                                                     │
│   <Layout>  (nav, footer, scroll-restoration)                │
│    ├── <AnimatePresence mode="wait">                         │
│    │     ├── <HomePage>                                      │
│    │     ├── <ProjectsPage>   ←─┐                            │
│    │     ├── <ZhkPage slug/>  ←─┤  read from data/projects.ts│
│    │     ├── <ConstructionLog>←─┤  read from data/log.ts     │
│    │     └── <ContactPage>      │                            │
│    │                            │                            │
│    └─ <Footer>                  │                            │
│                                 │                            │
│   data/ (pure TS, bundle-time)──┘                            │
│   hooks/ (useInView, useScrollParallax, useReducedMotion)    │
│   components/ (atoms → molecules → sections)                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Layer | Responsibility | Implementation |
|-------|----------------|----------------|
| `data/` | Single source of truth for projects, construction log, page copy | Plain TS consts, typed by interfaces in `data/types.ts`. No fetching, no hydration. |
| `pages/` | Route-level orchestration: pull data, compose sections, manage page-transition animations | One `.tsx` per route; minimal local state |
| `components/sections/` | Full-width page sections (Hero, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, ContactForm) | Consume props or `data/` directly; own their scroll-reveal animations |
| `components/ui/` | Reusable atoms/molecules (Button, StageBadge, CubeMark, RenderCard, AggregateRow) | Dumb, prop-driven, brand-locked styles |
| `components/brand/` | Brand-primitive components (`<Logo>`, `<IsometricCube variant>`, `<IsometricGrid>`, `<Wordmark>`) | Inline SVG as React components — single source of visual DNA |
| `tokens/` | Declarative design tokens — consumed only via `index.css` `@theme` | CSS-only. No JS exports. |
| `hooks/` | Animation & responsive primitives (`useParallax`, `useReducedMotion`, `useSectionReveal`) | Pure React hooks; no side effects outside DOM |
| `lib/` | Tiny utilities (slug helpers, date formatters, asset-URL builder respecting Vite `BASE_URL`) | Pure functions |

**Boundary rule:** `pages/` import from `data/` and compose `components/`. `components/` NEVER import from `data/` (except `brand/`-level, which doesn't need it). `components/sections/` may accept data-shaped props but not import the data module — this keeps sections testable/reusable and preserves single source of truth.

---

## 2. Recommended Project Structure

```
vugoda-website/
├── public/                         # Vite-served-verbatim assets (copied to dist)
│   ├── renders/                    # translit copy from /renders/ (script, build step)
│   │   ├── lakeview/               # ← likeview → lakeview (fix misspelling)
│   │   ├── etno-dim/               # ← ЖК Етно Дім
│   │   ├── maietok-vynnykivskyi/   # ← ЖК Маєток Винниківський
│   │   └── nterest/                # ← Дохідний дім NTEREST
│   ├── construction/               # translit copy from /construction/
│   │   ├── dec-2025/ ... mar-2026/ # folder names already ASCII — copy verbatim
│   ├── brand/
│   │   ├── patterns/isometric-grid.svg
│   │   └── favicon/favicon-32.svg
│   └── og/                         # social share images
│
├── src/
│   ├── main.tsx                    # entry: StrictMode + BrowserRouter + App
│   ├── App.tsx                     # <Layout> shell + <Routes> + <AnimatePresence>
│   ├── index.css                   # Tailwind v4 @import + @theme + font-face + base
│   │
│   ├── pages/                      # one file per route
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ZhkPage.tsx             # reads useParams().slug → projects[slug]
│   │   ├── ConstructionLogPage.tsx
│   │   └── ContactPage.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageTransition.tsx  # wraps <Outlet> with motion.div variants
│   │   ├── brand/
│   │   │   ├── Logo.tsx            # imports /brand-assets/logo/dark.svg via ?react
│   │   │   ├── Mark.tsx            # standalone cube+petals glyph
│   │   │   ├── IsometricCube.tsx   # 3 variants: "single" | "group" | "grid"
│   │   │   ├── IsometricGridBG.tsx # full-bleed pattern overlay
│   │   │   └── Wordmark.tsx        # hero «ВИГОДА» text
│   │   ├── sections/
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── BrandEssence.tsx
│   │   │   │   ├── PortfolioOverview.tsx
│   │   │   │   ├── ConstructionTeaser.tsx
│   │   │   │   ├── MethodologyTeaser.tsx
│   │   │   │   ├── TrustBlock.tsx
│   │   │   │   └── ContactForm.tsx
│   │   │   ├── projects/
│   │   │   │   ├── FlagshipCard.tsx    # Lakeview-sized, redirect CTA
│   │   │   │   ├── PipelineGrid.tsx    # 3-col of pipeline cards
│   │   │   │   ├── PipelineCard.tsx
│   │   │   │   ├── StageFilter.tsx
│   │   │   │   └── AggregateRow.tsx    # Pipeline-4 text-only row
│   │   │   └── zhk/
│   │   │       ├── ZhkHero.tsx
│   │   │       ├── ZhkFactBlock.tsx
│   │   │       ├── ZhkWhatsHappening.tsx
│   │   │       └── ZhkGallery.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── StageBadge.tsx      # В розрахунку / У погодженні / Будується / Здано
│   │       ├── MutedCaption.tsx
│   │       ├── RevealOnScroll.tsx  # shared Motion wrapper (FadeIn++)
│   │       └── ResponsivePicture.tsx  # <picture> + AVIF/WebP fallback
│   │
│   ├── data/
│   │   ├── types.ts                # Project, Stage, ConstructionMonth, etc.
│   │   ├── projects.ts             # canonical portfolio (5 ЖК)
│   │   ├── construction.ts         # Lakeview month→photos[]
│   │   ├── methodology.ts          # §8 blocks
│   │   ├── values.ts               # 4 brand values
│   │   └── company.ts              # ЄДРПОУ, licence, email, socials
│   │
│   ├── hooks/
│   │   ├── useParallax.ts          # scroll-linked Motion useScroll/useTransform
│   │   ├── useReducedMotion.ts     # respect prefers-reduced-motion
│   │   └── useSectionReveal.ts     # Motion whileInView shorthand
│   │
│   ├── lib/
│   │   ├── assetUrl.ts             # prefixes import.meta.env.BASE_URL
│   │   ├── formatDate.ts           # "Січень 2026" in UA locale
│   │   └── motionVariants.ts       # shared Variants (fadeUp, stagger, pageFade)
│   │
│   └── types/
│       └── svg.d.ts                # declares ?react imports (vite-plugin-svgr)
│
├── scripts/
│   └── copy-renders.ts             # pre-build: translit + copy /renders /construction into /public
│
├── .github/workflows/
│   └── deploy.yml                  # actions/deploy-pages
│
├── index.html                      # <link rel="icon" href="/brand/favicon/…">
├── vite.config.ts                  # base: '/vugoda-website/', plugins: [react, tailwind, svgr]
├── tsconfig.json
├── package.json
└── .planning/                      # pre-existing — gsd workflow
```

### Structure Rationale

- **`public/` vs `src/assets/`:** Renders and construction photos live in `public/` because (a) they're bulk-imported at build time via a copy script, (b) `src/` imports route them through Rollup which adds hashing we don't want for `<img src>` URLs referenced by data strings, (c) 100+ images in `src/` slow down HMR needlessly. Only brand-logo SVGs that become React components live in `src/components/brand/` (or are `import`ed from `brand-assets/` with `?react`).
- **`data/` is flat, not nested:** Five ЖК is small. One `projects.ts` is easier to scan than `data/projects/lakeview.ts + etno-dim.ts + …`. Scale threshold to split: ~20 projects.
- **`sections/` grouped by page** (`home/`, `projects/`, `zhk/`): prevents a flat 30-file directory. Cross-page-shared sections go into a `sections/shared/` if that ever emerges.
- **`brand/` separated from `ui/`:** brand primitives (logo, cube, grid) are **inviolable** per the brandbook — every developer edit to these needs design review. Keeping them namespaced makes that policy enforceable via CODEOWNERS / PR rules.
- **No `features/` folder, no `stores/` folder, no `hoc/` folder:** this is a 5-page marketing site. Feature-sliced-design is overkill and was explicitly flagged as out-of-scope in the milestone brief.

---

## 3. Answers to the 8 Concrete Questions

### Q1. `src/` folder structure

Answered above (§2). Key non-obvious choices:

- **`pages/` not `routes/`:** matches React-Router v6/v7 convention where a *page* is a leaf, a *route* is the config.
- **`components/sections/` not `components/blocks/`:** "section" matches the copy in `КОНЦЕПЦІЯ-САЙТУ.md §7` ("Ключові секції сайту").
- **Brand primitives are siblings of UI, not nested:** enforces separation of "brand-locked" from "generic-locked".

### Q2. Single source of truth for 5 ЖК — no duplication across detail page / hub grid / aggregate row

**Decision:** one exported array in `src/data/projects.ts`. All three views derive from it via filters. The shape supports both "full detail page" and "aggregate-only" projects without conditional explosions.

```typescript
// src/data/types.ts
export type Stage =
  | 'u-rozrakhunku'       // У розрахунку (кошторисна вартість / документація)
  | 'u-pogodzhenni'       // У погодженні (меморандум / дозвільна)
  | 'buduetsya'           // Будується
  | 'zdano';              // Здано

export type Presentation =
  | 'flagship-external'   // Lakeview: big card + external redirect, no internal page
  | 'full-internal'       // Has /zhk/{slug} page with full template
  | 'grid-only'           // Hub grid card, no internal page in v1
  | 'aggregate';          // No card, appears in AggregateRow text only

export interface Project {
  /** Slug used in /zhk/{slug} AND in render folder names. Anchored to one value. */
  slug: string;
  /** Human-readable title, Ukrainian. */
  title: string;
  /** Sub-stage label shown on card: "меморандум", "кошторисна документація", etc. */
  stageLabel: string;
  /** Bucket used by StageFilter on /projects. */
  stage: Stage;
  /** How this project surfaces in the UI. Drives routing & rendering. */
  presentation: Presentation;
  /** Location shown under title. May be placeholder for aggregate. */
  location?: string;
  /** External URL for flagship-external (Lakeview goes here). */
  externalUrl?: string;
  /** Rendered images — first is hero/cover. Relative to /public/renders/{slug}/. */
  renders: string[];
  /** Optional facts for detail page. */
  facts?: {
    sections?: number;
    floors?: string;
    area?: string;
    deadline?: string;
    note?: string;
  };
  /** "Що відбувається зараз" — stage-specific paragraph. */
  whatsHappening?: string;
  /** Short caption for the aggregate row — used only when presentation='aggregate'. */
  aggregateText?: string;
  /** For ordering on hub page; ascending. */
  order: number;
}
```

```typescript
// src/data/projects.ts — canonical portfolio
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'lakeview',
    title: 'ЖК Lakeview',
    stageLabel: 'активне будівництво',
    stage: 'buduetsya',
    presentation: 'flagship-external',
    location: 'Львів',
    externalUrl: 'https://yaroslavpetrukha.github.io/Lakeview/',
    renders: ['aerial.webp', '02.webp', '03.webp'],
    facts: { deadline: '2027', note: 'Здача у 2027' },
    order: 1,
  },
  {
    slug: 'etno-dim',
    title: 'ЖК Етно Дім',
    stageLabel: 'меморандум про відновлення будівництва',
    stage: 'u-pogodzhenni',
    presentation: 'full-internal',
    location: 'Львів', // TODO: verify вул. Судова per CONCEPT §11.8
    renders: [
      '43615.jpg.webp', '43616.jpg.webp', '43617.jpg.webp', '43618.jpg.webp',
      '43619.jpg.webp', '43620.jpg.webp', '43621.jpg.webp', '61996.png.webp',
    ],
    whatsHappening: 'Підписано меморандум про відновлення будівництва. Проводимо аудит наявних конструкцій та юридичне переоформлення прав забудовника.',
    order: 2,
  },
  {
    slug: 'maietok-vynnykivskyi',
    title: 'ЖК Маєток Винниківський',
    stageLabel: 'прорахунок кошторисної документації',
    stage: 'u-rozrakhunku',
    presentation: 'grid-only', // no /zhk/ page in v1 per PROJECT.md
    location: 'Винники',
    renders: ['render-01.webp', 'render-02.webp'],
    order: 3,
  },
  {
    slug: 'nterest',
    title: 'Дохідний дім NTEREST',
    stageLabel: 'погодження дозвільної документації',
    stage: 'u-pogodzhenni',
    presentation: 'grid-only',
    location: 'Львів',
    renders: ['2213.jpg.webp', '2214.jpg.webp', '60217.png.webp'],
    order: 4,
  },
  {
    slug: 'pipeline-4',
    title: 'Без назви',
    stageLabel: 'прорахунок кошторисної вартості',
    stage: 'u-rozrakhunku',
    presentation: 'aggregate',
    renders: [],
    aggregateText: '+1 об’єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.',
    order: 5,
  },
];

// Derived views — the three places on the site read from these, not from the raw array:
export const flagship = projects.find(p => p.presentation === 'flagship-external')!;

export const pipelineGridProjects = projects
  .filter(p => p.presentation === 'full-internal' || p.presentation === 'grid-only')
  .sort((a, b) => a.order - b.order);

export const aggregateProjects = projects.filter(p => p.presentation === 'aggregate');

export const detailPageProjects = projects.filter(p => p.presentation === 'full-internal');

export const findBySlug = (slug: string) =>
  projects.find(p => p.slug === slug && p.presentation === 'full-internal');
```

Why this shape:
- Adding ЖК #6 that has a detail page = append one record with `presentation: 'full-internal'`. Grid, route, detail page all pick it up automatically. Hard-rule from CONCEPT §10.6 ("масштабується до N") is satisfied.
- Adding a grid-only → full-internal promotion = flip the discriminant. Zero structural change.
- The `presentation` discriminated union **replaces** ad-hoc boolean flags like `hasDetailPage`, `isExternal`, `isAggregate` that would otherwise multiply.
- `renders[0]` is the cover by convention — no separate `hero: string` field to sync.

For `/zhk/{slug}`, router declares `<Route path="/zhk/:slug" element={<ZhkPage />} />`. `ZhkPage` calls `findBySlug(useParams().slug)` → 404 if null (or better: if present but `presentation !== 'full-internal'`).

### Q3. Where do CSS brand tokens live?

**Decision: Tailwind v4 `@theme` in `index.css`. No separate `:root` layer, no JS export.**

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* 6-color closed palette — brand-system.md §3 (canonical) */
  --color-bg:          #2F3640;
  --color-bg-surface:  #3D3B43;
  --color-bg-black:    #020A0A;
  --color-accent:      #C1F33D;
  --color-text:        #F5F7FA;
  --color-text-muted:  #A7AFBC;
  /* (note: existing prototype's #2a3038 is wrong — must not propagate) */

  /* Typography */
  --font-sans: "Montserrat", system-ui, sans-serif;

  /* Spacing scale — concept §7 adds what brandbook omits (brand-system.md §7) */
  --spacing-rhythm-xs: 4px;
  --spacing-rhythm-sm: 8px;
  --spacing-rhythm-md: 16px;
  --spacing-rhythm-lg: 32px;
  --spacing-rhythm-xl: 64px;

  /* Motion — shared easings/durations */
  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1); /* ease-out, no bounce */
  --duration-reveal: 400ms;
  --duration-parallax: 1200ms;
}

@layer base {
  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background-color: var(--color-accent); color: var(--color-bg-black); }
}
```

Rationale:
- **Tailwind v4's `@theme` directive IS the design token system.** It emits CSS custom properties AND generates the Tailwind utility class scale simultaneously (e.g. `--color-bg` makes `bg-bg`, `text-bg`, `border-bg` all work). A parallel `:root {}` block would be duplication.
- **Not exporting tokens as JS:** no runtime token resolution needed, no CSS-in-JS, no theme-switcher (site is dark-only per brandbook). Any component that needs a raw color uses `var(--color-accent)` in a `style={}` or a Tailwind class like `text-accent`.
- **Single file for tokens (not `src/tokens/*.ts`):** for a 6-color palette, a token package is ceremony. If ever we need to feed tokens into SVG generation or email templates, promote to `tokens/` then.
- **The prototype's `--color-bg-base: #2a3038` is explicitly corrected to `#2F3640`** — PROJECT.md Constraints calls this out; index.css is the place the fix lives.

Confidence: HIGH (Tailwind v4 `@theme` behavior is documented in the official release; values come verbatim from brand-system.md §3).

### Q4. Pattern for the isometric cube

**Decision: inline-SVG React component in `src/components/brand/`, three compile-time variants matching brandbook's 3 ladder steps, driven by a prop.** NOT a CSS `background-image`, NOT a Lucide icon, NOT a Three.js mesh.

```tsx
// src/components/brand/IsometricCube.tsx
import { motion, type MotionProps } from 'motion/react';

type CubeVariant = 'single' | 'group' | 'grid';

interface IsometricCubeProps extends MotionProps {
  variant: CubeVariant;
  /** 0–1; brandbook says 0.05–0.60 */
  opacity?: number;
  /** stroke width in px (brandbook: 0.5–1.5pt ≈ 0.67–2px on retina) */
  strokeWidth?: number;
  /** one of the 3 allowed colors */
  stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D';
  className?: string;
}

export function IsometricCube({
  variant,
  opacity = 0.3,
  strokeWidth = 1,
  stroke = '#A7AFBC',
  className,
  ...motion
}: IsometricCubeProps) {
  return (
    <motion.svg
      viewBox="0 0 220.6 167.4"
      aria-hidden
      className={className}
      style={{ opacity }}
      {...motion}
    >
      {variant === 'single' && <SingleCubePath stroke={stroke} strokeWidth={strokeWidth} />}
      {variant === 'group' && <GroupCubesPath stroke={stroke} strokeWidth={strokeWidth} />}
      {variant === 'grid' && <IsometricGridPath stroke={stroke} strokeWidth={strokeWidth} />}
    </motion.svg>
  );
}
```

Why inline SVG (not background-image, not separate file + `<img>`):

1. **Styleable.** We need to animate opacity / transform / path-length on scroll; CSS background images can't have per-path motion.
2. **Brand-locked color.** If it's `<img src="/patterns/isometric-grid.svg">`, a dev could style it red and nothing stops them. Typed `stroke` prop enforces the 3 allowed colors at compile time.
3. **The existing `brand-assets/patterns/isometric-grid.svg` is 15kB** and contains absolute color values and mix-blend-mode hardcoded. For runtime theming (opacity, motion) it's better to rewrite as React JSX. Option: use `vite-plugin-svgr` to import the brand-assets SVGs as React components (`import Grid from '@/brand-assets/patterns/isometric-grid.svg?react'`) — this avoids hand-rewriting the geometry and is my recommendation for the `grid` variant specifically.
4. **Cube-ladder semantic** (CONCEPT §5.2) maps cleanly to the 3 variants:
   - `single` → Pipeline-4 aggregate row state-marker
   - `group` → decorative corner on pipeline cards with renders
   - `grid` → full-bleed hero overlay + "Здано (0)" empty-state
5. `<IsometricGridBG>` is a thin wrapper: full-bleed absolute-positioned `<IsometricCube variant="grid" />` for hero overlays.

Confidence: HIGH for architecture. MEDIUM for exact svgr setup (pick `vite-plugin-svgr` v4+ at impl time; verify current docs).

### Q5. Pattern for Motion animations

**Decision: three-layer composition.**

1. **Shared variants in `src/lib/motionVariants.ts`** — reusable `Variants` objects (fadeUp, stagger, pageFade, parallaxSlow).
2. **`<RevealOnScroll>` wrapper component** (thin, in `components/ui/`) — the 80% case: fade-in on viewport entry.
3. **Per-component `motion.X` + `useInView`** — the 20% case where the animation is bespoke (hero parallax, gallery horizontal scroll, card hover).

```typescript
// src/lib/motionVariants.ts
import type { Variants } from 'motion/react';

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
```

```tsx
// src/components/ui/RevealOnScroll.tsx — 80% of the site's animations go through this
import { motion } from 'motion/react';
import { fadeUp } from '@/lib/motionVariants';

export const RevealOnScroll = ({ children, delay = 0, className = '' }) => (
  <motion.div
    variants={fadeUp}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);
```

**`whileInView` (the existing prototype's choice) over manual `useInView`:**
- Less boilerplate for the common case.
- `viewport={{ once: true }}` prevents re-animation on scroll-back — matches "stримано / no bounce" brand tone.
- Fall back to `useInView` hook only when triggering non-motion side-effects (e.g. autoplay video, increment counter).

**`useScroll` + `useTransform` for hero parallax** (ANI-01):
```tsx
// inside Hero.tsx
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
const cubeY = useTransform(scrollYProgress, [0, 1], [0, -120]);
return <motion.div style={{ y: cubeY }}>…</motion.div>;
```

**Anti-patterns to avoid:**
- Bounce springs (`type: 'spring', bounce: 0.4`) — explicitly off-brand (§2 ToV: стримано).
- Long durations >600ms — makes the site feel sluggish on desktop where brand impression forms in the first scroll.
- `staggerChildren` with >6 children — rolling stagger >480ms becomes visible as "loading", not "reveal".

**Reduced-motion respect:**
```typescript
// src/hooks/useReducedMotion.ts — wrap once, use everywhere
import { useReducedMotion as useReducedMotionBase } from 'motion/react';
export const useReducedMotion = useReducedMotionBase;
```
In `RevealOnScroll`, if `useReducedMotion()` is true, skip variants and just render children — WCAG nicety; also placates Lighthouse.

Confidence: MEDIUM (Motion API stable but fast-evolving; verify `motion/react` import path at impl — used to be `framer-motion` pre-rebrand).

### Q6. Pattern for `/construction-log`

**Decision: one typed TS data module `src/data/construction.ts` that maps month-keys to photo manifests. Authored by hand, with a helper script that auto-fills from filesystem on dev to reduce tedium.**

```typescript
// src/data/types.ts (addition)
export interface ConstructionMonth {
  /** Machine key: matches folder name in /public/construction/ */
  key: 'dec-2025' | 'jan-2026' | 'feb-2026' | 'mar-2026' | string;
  /** Display label in Ukrainian: "Грудень 2025", "Січень 2026" */
  label: string;
  /** ISO year-month for ordering. */
  yearMonth: string;
  /** Photos — file names inside /public/construction/{key}/ */
  photos: Array<{
    file: string;
    caption?: string; // "Фундамент, секція 1" — optional; stays blank if not written
    alt?: string;     // "Будівельний майданчик, січень 2026"
  }>;
}
```

```typescript
// src/data/construction.ts
import type { ConstructionMonth } from './types';

export const constructionLog: ConstructionMonth[] = [
  {
    key: 'mar-2026',
    label: 'Березень 2026',
    yearMonth: '2026-03',
    photos: Array.from({ length: 15 }, (_, i) => ({
      file: `mar-${String(i + 1).padStart(2, '0')}.jpg`,
    })),
  },
  {
    key: 'feb-2026',
    label: 'Лютий 2026',
    yearMonth: '2026-02',
    photos: Array.from({ length: 12 }, (_, i) => ({
      file: `feb-${String(i + 1).padStart(2, '0')}.jpg`,
    })),
  },
  // … jan-2026, dec-2025
];

export const latestMonth = () => constructionLog[0]; // used by home-page teaser
```

**Why not build-time folder scan via `import.meta.glob`:**
- Tempting (`const photos = import.meta.glob('/public/construction/**/*.jpg', { eager: true })`) but it hashes URLs and breaks the `<img src>` contract for assets in `/public/`. You'd have to use it against `src/assets/` instead, which creates the whole-folder-in-src problem from §2.
- Captions need human authoring (CONCEPT §7.9: "«Січень 2026 — фундамент, секція 1», без хвастощів") — no scanner can produce those.
- Manual authoring with a helper: a dev-only script `scripts/list-construction.ts` prints the filesystem inventory as TS literal → copy-paste into `construction.ts`. Easier to maintain than a magic glob.

**Photo filenames are already ASCII** (`jan-01.jpg`, `mar-15.jpg`) — verified inspection. So no translit needed for construction assets. Just copy `/construction/{month}/` verbatim to `/public/construction/{month}/`.

Confidence: HIGH.

### Q7. Pattern for page transitions (AnimatePresence + Router)

**Decision: `AnimatePresence mode="wait"` wrapping `<Routes>` inside a `<Layout>`, keyed by `location.pathname`, with `pageFade` variants from `motionVariants.ts`.**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { pageFade } from '@/lib/motionVariants';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
// … other imports

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        variants={pageFade}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.main>
    </AnimatePresence>
  );
}

function Layout() {
  return (
    <>
      <Nav />
      <AnimatedOutlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/zhk/:slug" element={<ZhkPage />} />
          <Route path="/construction-log" element={<ConstructionLogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

Key points:
- **`mode="wait"`** (not `sync`) — outgoing page finishes exit before incoming starts. Matches "стримано" tone; avoids cross-fade chaos on visually heavy pages.
- **Key on `pathname` not full `location`** — avoids redundant re-animation on hash/query changes within the same page.
- **`initial={false}` on AnimatePresence** — skips entrance animation on first load (hero hero will be doing its own entrance). Only inter-route transitions animate.
- **`basename={import.meta.env.BASE_URL}`** — Vite injects `/vugoda-website/` from `vite.config.ts base` option; React Router's basename normalizes it with trailing-slash handling. DEP-03 solved.
- **404 route** — `/vugoda-website/zhk/unknown` hits the `*` catch. For GitHub Pages deep links, add a `404.html` that's a copy of `index.html` (or use the `react-router-dom` SPA-fallback `<ScrollRestoration />` on v7) so F5 on a deep route doesn't 404.

**Scroll reset on route change:**
```tsx
// inside Layout, before <AnimatedOutlet />
useEffect(() => { window.scrollTo(0, 0); }, [useLocation().pathname]);
```
Or use React Router v7's built-in `<ScrollRestoration />` if using `createBrowserRouter` pattern.

Confidence: MEDIUM (AnimatePresence + React Router compatibility has been stable for years but verify current `react-router-dom` version's recommended pattern — `createBrowserRouter` vs `BrowserRouter` — at impl time).

### Q8. Ukrainian filenames in `/renders/ЖК Етно Дім/` on GitHub Pages

**Recommendation: TRANSLITERATE AT BUILD TIME via a `scripts/copy-renders.ts` pre-build script. Do NOT reference the original Cyrillic+space paths from production code.**

**The problem (specific, not abstract):**
1. URL with Cyrillic + space like `/renders/ЖК Етно Дім/43615.jpg.webp` must be percent-encoded to `/renders/%D0%96%D0%9A%20%D0%95%D1%82%D0%BD%D0%BE%20%D0%94%D1%96%D0%BC/43615.jpg.webp` for the browser to fetch it. Writing `<img src="/renders/ЖК Етно Дім/…">` in JSX works in most modern browsers because the rendering engine auto-encodes, but the resulting source of truth is invisible/fragile.
2. GitHub Pages is served by Jekyll (or a static layer that mimics it). Historically, paths containing non-ASCII + spaces have caused 404s on deploy — the deploy pipeline URL-encodes once, the server expects twice-encoded, mismatch → 404. Even when it works, caching layers inconsistently handle the encoding.
3. `actions/deploy-pages` uses `tar` to package artifacts. `tar` and unicode filenames can have normalization issues (NFC vs NFD — macOS produces NFD, Linux runners expect NFC), causing files to go missing from the artifact silently.
4. Spaces in filenames compound all three: browsers treat `%20` and `+` differently in query vs path contexts.
5. The fifth filename like `ЖК Маєток Винниківський` has both Cyrillic AND a space — maximum fragility.

Even if #1–#4 were solvable, **slug translit is already mandated elsewhere:**
- `/zhk/:slug` routes use transliterated slugs (`etno-dim`, `maietok-vynnykivskyi`, `nterest`) per concept §4.1.
- Keeping the asset folder matching the slug (`/public/renders/etno-dim/`) means `project.slug` → asset path is a clean 1:1 join: `` `${BASE_URL}renders/${project.slug}/${project.renders[0]}` ``. No special case.

**Implementation:**

```typescript
// scripts/copy-renders.ts — run as "prebuild" npm script
import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'renders');
const DST = join(ROOT, 'public/renders');

// mapping: Cyrillic source folder → translit destination folder
const MAP: Record<string, string> = {
  'likeview':                 'lakeview',              // also fixes misspelling
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
  cpSync(from, to, { recursive: true });
  console.log(`[copy-renders] ${src} → ${dst}`);
}

// Also copy construction (names already ASCII)
const CSRC = join(ROOT, 'construction');
const CDST = join(ROOT, 'public/construction');
if (existsSync(CDST)) rmSync(CDST, { recursive: true });
for (const m of ['dec-2025', 'jan-2026', 'feb-2026', 'mar-2026']) {
  cpSync(join(CSRC, m), join(CDST, m), { recursive: true });
}
// Note: skip /construction/_social-covers/ per concept §7.9 (Lakeview brand conflict)
```

```json
// package.json
"scripts": {
  "prebuild": "tsx scripts/copy-renders.ts",
  "build": "vite build",
  "predev": "tsx scripts/copy-renders.ts",
  "dev": "vite"
}
```

**Why copy to `public/` vs direct-import from `renders/`:**
- Original `/renders/` is at repo root (sibling of `src/`), outside both `public/` and `src/` — Vite won't serve it.
- Moving it into `src/assets/` loses the "human readable folder names per concept" that the raw `/renders/` preserves.
- Keeping a pre-build copy means `/renders/` is the **authoring surface** (marketing drops new renders into Ukrainian-named folders) and `/public/renders/` is the **runtime surface** (translit, ASCII, GH-Pages safe). Single direction, idempotent.

**`public/` + `BASE_URL`:**
```typescript
// src/lib/assetUrl.ts
export const renderUrl = (slug: string, file: string) =>
  `${import.meta.env.BASE_URL}renders/${slug}/${file}`;
```
Never hardcode `/renders/…` in JSX — always go through `renderUrl()` because Vite's `BASE_URL` is `/vugoda-website/` in prod and `/` in dev.

Confidence: HIGH on the recommendation (translit); MEDIUM on the specific failure-mode ordering for GH Pages (the concrete 404 scenarios are known issues in the ecosystem but vary by deploy action version). The recommendation is defensively correct regardless of whether Cyrillic paths *would* work — the slug-asset alignment benefit alone justifies it.

---

## 4. Data Flow

### Project data → 3 views

```
src/data/projects.ts  (single canonical array)
        │
        ├─── flagship ────────────────► HomePage ▸ PortfolioOverview ▸ FlagshipCard
        │                                ProjectsPage ▸ Top
        │
        ├─── pipelineGridProjects ────► HomePage ▸ PortfolioOverview ▸ grid
        │                                ProjectsPage ▸ PipelineGrid
        │
        ├─── detailPageProjects ──────► router generates /zhk/{slug} for each
        │                                ZhkPage consumes findBySlug(slug)
        │
        └─── aggregateProjects ───────► HomePage + ProjectsPage ▸ AggregateRow
```

No writes, no async, no cache. Bundle-time constants.

### Construction log → 2 views

```
src/data/construction.ts
        │
        ├─── latestMonth().photos[0..4] ──► HomePage ▸ ConstructionTeaser (horizontal strip)
        │
        └─── entire array ────────────────► ConstructionLogPage (month-grouped grid)
```

### Route → page → section composition

```
URL change ──► Router picks Route ──► Page component ──► imports data +
composes sections ──► sections render RevealOnScroll-wrapped content
```

No state manager needed. Forms (`/contact`) use local `useState` + `mailto:` submit.

---

## 5. Scaling Considerations

| Scale | Adjustments |
|-------|-------------|
| **Today (5 projects, 50 construction photos)** | Everything in-memory, bundled JS. Fine. |
| **20 projects, 500 construction photos** | `projects.ts` stays one file; split construction into `data/construction/{year}.ts`. Lazy-load `/construction-log` route via `React.lazy()`. |
| **50+ projects, 2000+ photos** | Move to Sanity (CONCEPT §12 already flags this for v2). Refactor `projects.ts` into a fetcher with same `Project` interface — zero change to consuming components. |
| **Marketing wants CMS editing** | Sanity + ISR. At that point Vite SPA → Next.js 15 App Router migration becomes the right move (per CONCEPT §9, already acknowledged). |

**What breaks first (not theoretical):**
1. **Bundle size from unused image imports** — if someone starts `import` ing WebPs from `src/assets/`. Guardrail: ESLint rule to forbid `import.*\\.(webp|jpg|png)` from `src/` tree. Assets live in `/public/` always.
2. **Initial HTML with 50 construction photos inlined** — `/construction-log` page. Mitigation: `loading="lazy"` (built-in), plus `React.lazy()` on the route itself so no construction data is in initial bundle.
3. **Montserrat full-weight load** — 3 weights × 2 subsets (latin + cyrillic-ext) = ~300KB if not careful. Use `@fontsource/montserrat` with `font-display: swap` and only import the 3 weights (Bold 700, Medium 500, Regular 400) + cyrillic subsets — per VIS-02.

---

## 6. Anti-Patterns

### Anti-Pattern 1: Duplicate project data across pages

**What people do:** Copy the Etno Dim card data into both `HomePage.tsx` (as a prop) and `ProjectsPage.tsx` (as another prop).
**Why it's wrong:** Update drift. Client fixes a typo once, developer "fixed it" in only one place. CONCEPT §10.6 hard-rule (масштабується до N) fails the moment #6 is added.
**Do this instead:** Every consumer imports from `data/projects.ts`. Components accept `Project` (or `Project[]`) props; pages pass the derived views.

### Anti-Pattern 2: Using the Pictorial/Rubikon renders as placeholders

**What people do:** "Just temporarily use what's in `/вигода-—-системний-девелопмент/Рендера/` while we wait for the real Etno Dim shots."
**Why it's wrong:** Silent displacement rule (CONCEPT §10.2) — legacy Pictorial/Rubikon imagery is **forbidden** on Vugoda corp site. Temporary placeholders have a way of surviving into production.
**Do this instead:** Missing renders → show the `<IsometricCube variant="group">` with stage text. The brandbook *explicitly* prescribes this (cube-ladder, CONCEPT §5.2). It's the correct empty state, not a placeholder.

### Anti-Pattern 3: Green (`#C1F33D`) as a full-block background

**What people do:** "The call-to-action section would really pop if we made it acid-lime background."
**Why it's wrong:** brand-system.md §3 explicit: *"Зелений — не фон широких секцій. Це акцент, не основа."* Also fails WCAG — `#C1F33D` on `#F5F7FA` text contrast = 1.2:1 (FAIL).
**Do this instead:** Dark-surface CTA with accent-colored border, button, or underline. The brandbook's own pages demonstrate this.

### Anti-Pattern 4: Logo as a JSX path-by-path rewrite

**What people do:** Copy the logo SVG path coordinates into `<Logo>` component, inline.
**Why it's wrong:** Logos are legally/bureaucratically versioned artifacts. When the brand team reissues, the SVG changes. A rewritten component won't auto-update.
**Do this instead:** `import Logo from '@/brand-assets/logo/dark.svg?react'` (via vite-plugin-svgr). The SVG file in `brand-assets/logo/` stays canonical; React gets a component.

### Anti-Pattern 5: Transitions on every hover

**What people do:** Add `transition-all duration-300` on everything hoverable.
**Why it's wrong:** The existing prototype has `transition-none` scattered intentionally — the brand tone is "стриманий", sharp state changes. Motion studio, not Apple-store.
**Do this instead:** Motion only where it carries meaning: scroll reveals (`RevealOnScroll`), parallax hero, route fades, explicit card hover zoom on ЖК cards (ANI-03, 400-700ms scale subtle). Buttons: instant color change, no transition.

### Anti-Pattern 6: Referencing `/renders/ЖК …/` paths directly in JSX

**What people do:** `<img src="/renders/ЖК Етно Дім/43615.jpg.webp">`.
**Why it's wrong:** Works in dev, breaks on Pages deploy — see Q8. Also couples component code to brand naming that might change.
**Do this instead:** Always `renderUrl(project.slug, project.renders[0])`. Tested once, works everywhere.

### Anti-Pattern 7: `zhk/:slug` catch-all that renders any project

**What people do:** `ZhkPage` renders any project regardless of `presentation`.
**Why it's wrong:** Visiting `/zhk/lakeview` shows a thin internal page, defeating the flagship-external rule (CONCEPT §4.3 — Lakeview is redirect-only). Visiting `/zhk/pipeline-4` renders an aggregate object as a detail page — nonsense.
**Do this instead:** `findBySlug()` returns only `presentation === 'full-internal'`. Other cases → `<Navigate to={externalUrl ?? '/projects'} replace />` for flagship, `<Navigate to="/projects" replace />` for grid-only/aggregate. Tested at route level.

---

## 7. Integration Points

### External Services (MVP)

| Service | Integration | Notes |
|---------|-------------|-------|
| `mailto:vygoda.sales@gmail.com` | Contact form submit → `window.location.href = 'mailto:…?body=…'` | Encodes form values into body. Out-of-scope to actually send from browser. |
| GitHub Pages | Static deploy via `actions/deploy-pages` | `base: '/vugoda-website/'` in vite.config + `basename={BASE_URL}` in Router. |
| Lakeview external site | `<a href="https://yaroslavpetrukha.github.io/Lakeview/" target="_blank" rel="noopener">` | From `project.externalUrl` field. Open in new tab — user shouldn't lose the corp site. |
| `@fontsource/montserrat` | `import '@fontsource/montserrat/400.css'` etc. in `main.tsx` | Self-hosted, no network call to fonts.googleapis.com → GDPR cleaner + faster. |

### Internal Boundaries

| Boundary | Direction | Notes |
|----------|-----------|-------|
| `data/` → `pages/` | pages import from data; never the reverse | Bundle-time, no async |
| `pages/` → `components/` | pages compose components | Components accept props; don't import pages |
| `components/brand/` → everyone | read-only consumers | Only `brand/` can contain SVG geometry for logo, cube, mark |
| `components/ui/` → `components/sections/` | sections compose ui atoms | ui atoms never import sections |
| `hooks/` → `components/` | components call hooks | Hooks never own DOM markup |
| `lib/` → everyone | pure utilities | No React in `lib/` |

---

## 8. Suggested Build Order (for roadmap)

This maps to phase structure in the roadmap. Each step is independently shippable — you can `git commit + deploy` after any of them and have a coherent (if incomplete) site.

1. **Phase: Token & Shell foundation** — `index.css` with corrected `@theme`, `@fontsource/montserrat`, `<Layout>` with Nav + Footer, `BrowserRouter`, route stubs (5 empty pages). Lighthouse baseline ≥90. *(Deliverable: deployed blank nav-shell with 5 clickable empty pages in brand palette.)*

2. **Phase: Brand primitives** — `<Logo>`, `<Mark>`, `<IsometricCube>` (3 variants), `<IsometricGridBG>`, `<Wordmark>`. Storybook-in-route: a `/dev/brand` hidden page to visual-QA. *(Deliverable: all brand primitives renderable standalone.)*

3. **Phase: Data layer** — `data/types.ts`, `data/projects.ts` (5 projects), `data/construction.ts`, `data/methodology.ts`, `data/values.ts`, `data/company.ts`. `scripts/copy-renders.ts` + `prebuild` hook. `lib/assetUrl.ts`. *(Deliverable: `npm run build` successfully copies 20+ renders + 50 photos into dist/renders and dist/construction under translit paths.)*

4. **Phase: Home page** — Hero (with parallax), BrandEssence, PortfolioOverview (reads data), ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm. All `RevealOnScroll`-wrapped. *(Deliverable: `/` is done; clicking "Переглянути проекти" goes to empty `/projects`.)*

5. **Phase: Portfolio + ZHK template** — `/projects` with StageFilter, FlagshipCard, PipelineGrid, AggregateRow. `/zhk/:slug` template (Hero, FactBlock, WhatsHappening, Gallery) rendering Etno Dim. Verify Maietok + NTEREST flow to grid-only cards correctly. *(Deliverable: full portfolio + Etno Dim detail; adding ЖК #6 is a one-record PR.)*

6. **Phase: Construction log + Contact** — `/construction-log` grouped by month, `/contact` with mailto form + reqs block. `<AnimatePresence>` page transitions wired. *(Deliverable: all 5 pages done.)*

7. **Phase: Performance + Deploy** — Image compression audit (`<picture>` with AVIF), bundle size check, Lighthouse pass ≥90 all 4 categories, `actions/deploy-pages` workflow, `404.html` SPA-fallback, share URL with client. *(Deliverable: public demo URL.)*

---

## 9. Open Technical Questions (for impl phase, not blocking now)

1. **`react-router-dom` v6 vs v7:** v7 introduced `createBrowserRouter` + `RouterProvider` as preferred over `BrowserRouter`. Worth using v7 if starting fresh; `AnimatePresence` pattern differs slightly (animated outlets via `createBrowserRouter`). *Decision at impl start.* Confidence: LOW (training data era).
2. **`vite-plugin-svgr` vs raw SVG imports:** svgr is the cleanest way to import brand-assets SVGs as components. Small dep. Recommended yes; verify latest version at impl.
3. **Image pipeline: `vite-imagetools` vs manual WebP:** renders are already `.webp` in `/renders/`. Could skip image pipeline entirely for MVP; add `vite-imagetools` only if needing responsive srcsets. For 1920×1080 desktop-only v1, manual is fine.
4. **Static paths on GitHub Pages for deep routes:** does `actions/deploy-pages` include a `404.html` copy of `index.html`, or must we generate it? Likely need a small plugin or post-build `cp dist/index.html dist/404.html`. Flag for impl.

---

## Sources

- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/PROJECT.md` (requirements: VIS-01/02/03/04, ANI-01..04, DEP-01..03, CON-01..02, ZHK-01/02) — authoritative
- `/Users/admin/Documents/Проєкти/vugoda-website/КОНЦЕПЦІЯ-САЙТУ.md` (§4.1 sitemap, §4.3 Lakeview model, §5.1 tokens, §5.2 cube-ladder, §6.1 stage model, §6.2 visual hierarchy, §7.9 construction log, §10 hard rules) — authoritative
- `/Users/admin/Documents/Проєкти/vugoda-website/brand-system.md` (§3 palette with verified WCAG, §4 typography scale proposal, §5 isometric line params, §7 layout/spacing scale proposal) — authoritative
- `/Users/admin/Documents/Проєкти/vugoda-website/вигода-—-системний-девелопмент/src/` (existing prototype — stack confirmation: Vite 6.2, React 19, Tailwind 4.1, Motion 12.23 in package.json; `@theme` pattern in index.css; `FadeIn`/`whileInView` prototype pattern in App.tsx) — reference
- `/Users/admin/Documents/Проєкти/vugoda-website/brand-assets/patterns/isometric-grid.svg` (inspected: 15kB, uses `#c1f33d` + mix-blend-mode; viable as `?react` import for the `grid` variant) — primary
- `/Users/admin/Documents/Проєкти/vugoda-website/brand-assets/mark/mark.svg` (inspected: minimal 3-path cube-with-petals; trivially reproducible as React component) — primary
- Directory inspection of `/renders/` (4 folders with Cyrillic names + spaces; ASCII filenames within) — primary (grounds the Q8 translit recommendation in actual state)
- Directory inspection of `/construction/` (4 month folders, ASCII filenames `jan-01.jpg`) — primary (grounds Q6's "no translit needed for construction" detail)

**Unverified (marked for impl-time verification):**
- React Router v7 `createBrowserRouter` + AnimatePresence pattern — MEDIUM confidence
- `vite-plugin-svgr` v4+ exact API — MEDIUM confidence
- `actions/deploy-pages` NFC/NFD filename handling — LOW confidence (informed the recommendation but not the root of it; translit is correct regardless)

---
*Architecture research for: Vugoda corporate website MVP (static SPA, GitHub Pages)*
*Researched: 2026-04-24*
