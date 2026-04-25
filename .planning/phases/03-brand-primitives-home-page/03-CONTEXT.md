# Phase 3: Brand Primitives & Home Page — Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Inviolable brand-primitive React components (**Logo**, **Mark**, **Wordmark**, **IsometricCube** 3-variant, **IsometricGridBG**) + the full `/` home page (7 sections) + hidden `/dev/brand` QA route + hero-image `<picture>` pipeline that feeds Phase 6's Lighthouse gate. The home page consumes Phase 2's data/content modules verbatim — no new data shapes, no CMS reach.

Explicit phase-scope clarifications (authorised during discussion):

- **Image pipeline** (`scripts/optimize-images.mjs` with sharp, producing AVIF/WebP/JPG × 3 widths) ships in Phase 3 — reused by Phase 4 (/zhk gallery, /construction-log 50-photo grid) and Phase 6 (Lighthouse verification owns no extra image work). Phase 6's image remit narrows to verification + budget audit.
- **`<ResponsivePicture>`** component lands in Phase 3 (in `src/components/ui/`), used by PortfolioOverview flagship, pipeline cards where optimized variants exist, and ConstructionTeaser; reused by all later phases.
- **Hero image = `aerial.jpg`** — the Lighthouse LCP target because the hero section itself is pure SVG + type, so the flagship render in PortfolioOverview (immediately below or within fold) is the first large raster the browser paints. SC#3's ≤200KB budget, preload link, and `loading="eager"` apply to this specific asset.
- **No inline `transition={{}}`** — Phase 5 owns `motionVariants.ts`. Phase 3 hero parallax uses `useScroll` + `useTransform` (not `transition` objects), which is compatible. `whileInView` is acceptable for section reveals using only the Motion-default easing OR a local `ease: [0.22, 1, 0.36, 1]` constant (documented) that Phase 5 will later absorb into `motionVariants.ts`. The _no-inline-transition_ rule applies specifically to keyframe transition config — not to shared hook-based scroll linking.

</domain>

<decisions>
## Implementation Decisions

### Hero section (HOME-01 + ANI-01 + VIS-03 + VIS-04)

- **D-01:** Hero height = **100vh**. Fills the viewport; user must scroll to reach BrandEssence. Sells the «ахуєнний desktop» brand moment on 1920×1080.
- **D-02:** Wordmark = **plain `<h1>` in Montserrat 700 uppercase** «ВИГОДА», sized large (approx. 180–220px at 1920×1080 — planner tunes). Semantic H1, accessibility-perfect, no extra asset. NO svgr-extract from logo file (brand-system.md §2 reserves lowercase for the composite logo; hero uppercase is a separate display moment per CONCEPT §7.1).
- **D-03:** Background overlay = **`<IsometricGridBG>` component** that imports `brand-assets/patterns/isometric-grid.svg` via `vite-plugin-svgr` `?react` query (plugin already installed). Absolute-positioned, full-bleed within the hero, opacity 0.1–0.2. No hand-re-authoring of the grid geometry; brand asset is the source of truth.
- **D-04:** Parallax = **vertical drift, grid translates UP** as user scrolls down. Uses Motion's `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` + `useTransform(scrollYProgress, [0, 1], [0, -120])`. Max translation ≤120px (success criteria ceiling). Ease-out, no bounce. Wordmark stays fixed; grid moves behind it — «passing through a structured space» feeling, cinematic but restrained.
- **D-05:** CTA = **«Переглянути проекти»**, accent-filled button (`bg-accent text-bg-black`, the signature accent-on-dark moment), functional styling (no rounded-pill, no shadow), navigates to `/projects` via `<Link>`. AAA contrast 8.85:1 per brand-system.md §3.
- **D-06:** Gasло = **«Системний девелопмент, у якому цінність є результатом точних рішень.»** (verbatim from CONCEPT §2, PROJECT.md Core Value). Rendered as paragraph between wordmark and CTA, text color `#F5F7FA` (primary). Copy lives in `src/content/values.ts` or a new `src/content/home.ts` — planner's call (does NOT stay as JSX literal per Phase 2 D-20 content-boundary rule).

### IsometricCube primitive (VIS-03)

- **D-07:** `src/components/brand/IsometricCube.tsx` exports a **hand-authored stroke-based SVG React component** with 3 compile-time variants via discriminated prop: `variant: 'single' | 'group' | 'grid'`. Consistent with MinimalCube's wireframe aesthetic (stroke-only, butt cap, miter join, straight lines per brand-system.md §5). ~150 lines total across all 3 variants.
- **D-08:** Typed stroke prop restricts to the 3 allowed hexes: `stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D'` (default `#A7AFBC`). `strokeWidth?: number` default 1 (brand-system.md §5 says 0.5–1 pt ≈ 1–1.5px, max 1.5pt). `opacity?: number` default 0.3 (brandbook 5–60%).
- **D-09:** `single` variant = 1 cube, wireframe, all 3 faces visible (trimmed copy of current MinimalCube geometry is the starting point). `group` variant = 2–3 cubes touching faces (brandbook page-20 "Структурна група"). `grid` variant = repeating isometric-grid tile — ***implementation note:*** the `grid` variant MAY internally delegate to the same svgr import used by `<IsometricGridBG>` (one asset, two wrappers with different sizing/positioning contexts). Planner picks whether `<IsometricCube variant='grid' />` is a thin wrapper around `<IsometricGridBG>` or rewrites the tile inline. Either is acceptable; consumer API is unchanged.
- **D-10:** **Cube-ladder role mapping locked** per CONCEPT §5.2 + ARCHITECTURE Q4:
  - `single` → Pipeline-4 aggregate-row state-marker (Phase 3 use) + «Здано (0)» empty-state marker (Phase 4 use)
  - `group` → decorative corner on pipeline cards with renders (Phase 4 use)
  - `grid` → hero overlay (via `<IsometricGridBG>` wrapper, Phase 3) + full-bleed fallback on empty states (Phase 4)
- **D-11:** **Home-page cube uses restricted to TWO locations only:** hero overlay (`variant='grid'` via `<IsometricGridBG>`) + PortfolioOverview aggregate row (`variant='single'`). BrandEssence / MethodologyTeaser / TrustBlock / ContactForm / ConstructionTeaser are pure typography + layout — NO decorative cubes. Restrained use matches brand tone (стримано); preserves the cube as a meaningful signal, not filler.
- **D-12:** **`src/components/brand/MinimalCube.tsx` is deleted** as part of the commit that introduces `IsometricCube.tsx`. The P1 comment in MinimalCube.tsx explicitly marks it «Phase 3 replaces this»; grep-verified zero call sites. The `single` variant's geometry SHOULD preserve MinimalCube's 3-polygon shape (same 100×100 viewBox or scaled equivalent) so the visual doesn't shift between phases.

### PortfolioOverview section (HOME-03)

- **D-13:** **Section H2 = «Проєкти»** (matches nav label for navigation-parity) + muted subtitle: **«1 в активній фазі будівництва · 4 у pipeline · 0 здано»**. Subtitle makes the honest 0/1/4 count explicit in Ukrainian (PROJECT.md Core Value language).
- **D-14:** **Lakeview flagship = full-width hero card** (within `max-w-7xl` container). Large `aerial.jpg` as `<ResponsivePicture>` (AVIF/WebP/JPG, 3 widths), title «ЖК Lakeview», stage label «активне будівництво», facts summary (deadline «Здача у 2027» from `flagship.facts`), external CTA **«Перейти на сайт проекту ↗»** with `target="_blank" rel="noopener"` pointing to `flagship.externalUrl` (`https://yaroslavpetrukha.github.io/Lakeview/`). Dominant because it IS the only active build — hierarchy honest to data.
- **D-15:** **Pipeline grid = 3-in-row equal cards** at ≥1280px, symmetric (Етно Дім / Маєток Винниківський / Дохідний дім NTEREST, order by `pipelineGridProjects` which sorts by `order` ascending). Each card: render cover (first render file via `<ResponsivePicture>`) + title + stage label + `location`. Card hover = Phase 4 (ANI-03); Phase 3 ships static cards.
- **D-16:** **Aggregate row below grid = full-width text strip** — `<IsometricCube variant='single'>` (left, opacity 0.4, stroke `#A7AFBC`, approx 48×48px) + aggregate text `aggregateProjects[0].aggregateText` on the right (primary text color). The placeholder title «Без назви» from `placeholders.pipeline4Title` is NOT foregrounded; the row leads with the stage narrative. No separate «Без назви» header — reads as a summary row, not as another project card.
- **D-17:** **Section ordering on home:** Hero → BrandEssence → **PortfolioOverview** → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm. PortfolioOverview sits third (after brand-essence framing) so the portfolio honesty lands with context, not cold.

### Hero image & image pipeline

- **D-18:** **`aerial.jpg` is THE hero image for Lighthouse purposes** — the first large raster above or at the fold on 1920×1080. It gets:
  - `<link rel="preload" as="image" href="{optimized-avif-or-webp-1920}" fetchpriority="high" type="image/avif">` in `index.html`
  - `loading="eager"` + `fetchpriority="high"` on the `<img>` inside `<picture>`
  - Never `loading="lazy"` — PITFALLS.md §Pitfall 8.
  - AVIF → WebP → JPG fallback per `<picture><source type="image/avif"><source type="image/webp"><img src="…jpg">`
  - Loaded format (whichever the browser picks) must be ≤200KB — hard budget; sharp-encoded AVIF at 1920px wide on architectural CGI typically lands 80–140KB at quality 50.
- **D-19:** **`scripts/optimize-images.mjs` ships in Phase 3.** Reads source JPGs from `public/renders/**/*.jpg` AND `public/construction/**/*.jpg` (after Phase 2's `copy-renders.ts` has run). Outputs optimized variants to `public/renders/{slug}/_opt/{name}-{w}.{fmt}` and `public/construction/{month}/_opt/{name}-{w}.{fmt}`. Formats: AVIF (quality 50), WebP (quality 75), JPG (mozjpeg, quality 80). Widths: `[640, 1280, 1920]` for renders; `[640, 960]` for construction (teaser + log-page card sizes). Dependencies: `sharp@^0.34.5` added to devDependencies. Node engine `^20.19 || >=22.12` (already pinned in Phase 1).
- **D-20:** **Wired as `prebuild` step AFTER `copy-renders`** — npm script chain: `prebuild: "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs"`. (Note: `optimize-images.mjs` is `.mjs` not `.ts` to avoid adding `@types/sharp` to the tsconfig.scripts.json surface Phase 2 established; if the planner prefers TS, `scripts/optimize-images.ts` is equally acceptable.) Idempotent: skips files whose source mtime ≤ output mtime. `predev` runs the same chain so dev previews match prod.
- **D-21:** **`<ResponsivePicture>` component** in `src/components/ui/ResponsivePicture.tsx`:
  - Props: `src: string` (base path under `public/`, e.g., `'renders/lakeview/aerial.jpg'`), `alt: string`, `widths?: number[]` default `[640, 1280, 1920]`, `sizes?: string` default `'100vw'`, `loading?: 'eager' | 'lazy'` default `'lazy'`, `fetchPriority?: 'high' | 'low' | 'auto'`, `className?: string`.
  - Emits `<picture><source type="image/avif" srcset="…"><source type="image/webp" srcset="…"><img src="…jpg" srcset="…" sizes="…" loading="…" fetchpriority="…"></picture>`.
  - Srcset construction: `{assetUrl(path)}/_opt/{base}-{w}.{fmt} {w}w`. Uses `renderUrl` / `constructionUrl` from `src/lib/assetUrl.ts` (Phase 2 D-30) internally — NEVER hardcoded `/renders/` paths (enforced by Phase 2's check-brand boundary grep).
  - Reused by: Phase 3 PortfolioOverview flagship + pipeline cards + ConstructionTeaser; Phase 4 `/zhk/etno-dim` gallery (8 renders), `/construction-log` timeline (50 photos).
- **D-22:** **Construction teaser photos** (3–5 from `mar-2026/` via `constructionLog.latestMonth().teaserPhotos` from Phase 2 D-22) go through the same pipeline with smaller widths `[640, 960]`, lazy-loaded (`loading="lazy"`) because they sit below the above-fold region. Total teaser weight ≈ 200–300KB — well within budget.
- **D-23:** **Projects.ts render filenames stay unchanged.** Phase 2 `projects.ts` already references `aerial.jpg` / `43615.jpg.webp` / etc. as the source filenames. `<ResponsivePicture src={...}>` receives the source path; the component transforms internally to the `_opt/` variants. No data-layer edit required — the base filename is the handle, the optimizer produces the optimized siblings alongside.

### Remaining home-page sections (Claude's Discretion within brand)

The following are Claude's Discretion for the planner — decisions lock in during planning based on the Phase 2 content modules and brand-system rules. They are NOT blocking questions for the user at Phase 3 start:

- **BrandEssence (HOME-02)** — 4 cards from `brandValues` in `src/content/values.ts` (системність / доцільність / надійність / довгострокова цінність). Layout: 4-in-row OR 2×2. No lucide-react icons (brand-system.md §7 says icons missing — not in MVP); numbered (01–04) OR pure typography. No cube decoration per D-11.
- **ConstructionTeaser (HOME-04)** — 3–5 photos from `constructionLog.latestMonth().teaserPhotos` in a horizontal scroll-snap container + «Березень 2026» label + CTA «Дивитись повний таймлайн» → `/construction-log`. Pure CSS `scroll-snap-x mandatory` + `overflow-x-auto` + arrow buttons scrolling via `element.scrollBy({ left: N, behavior: 'smooth' })` (per STACK.md "What NOT to Use" — skip swiper/embla).
- **MethodologyTeaser (HOME-05)** — 2–3 blocks from `methodologyBlocks` in `src/content/methodology.ts`. Blocks 2, 5, 6 have `needsVerification: true` — render a ⚠ marker (visible, small) inline with the block title per Phase 2 D-16. Planner picks which 2–3 to feature (recommendation: blocks 1, 3, 4 — all verified — to avoid foregrounding unverified content on home).
- **TrustBlock (HOME-06)** — reading from `src/content/company.ts`: three-column table-like layout — ЄДРПОУ | Ліцензія | Email. NO team photos, NO faces (hard rule). Legal tone; `#A7AFBC` muted labels on `#2F3640` background (contrast 5.3:1 — only for ≥14pt body size per brand-system.md §3 / PROJECT.md Constraints).
- **ContactForm (HOME-07)** — single functional CTA «Ініціювати діалог» styled as a form-submit button, opens `mailto:vygoda.sales@gmail.com?subject=…` on click. NO real form fields with name/email/message in MVP — PROJECT.md Out of Scope rejects server endpoints, and a fake form that only concatenates into a mailto query string adds UI without real utility. Planner may choose to include an optional short paragraph above the button («Напишіть нам, щоб обговорити…») but the interactive surface is one button.
- **Section spacing / rhythm** — use `--spacing-rhythm-xl: 64px` between sections (`py-16` equivalent). Section internal padding use `--spacing-rhythm-lg: 32px` horizontal/vertical.

### Layout & container width

- **D-24:** **Home page retains `max-w-7xl` (1280px) container** matching Nav/Footer (Phase 1 D-01/D-06). The hero may be `min-h-[100vh]` but the content inside (wordmark, gasло, CTA) stays inside the `max-w-7xl` container. Section-level layouts stay uniform to 1280px width for readability and to avoid sparse layout at 1920×1080 — the margins on each side become part of the design, not a bug.
  - Exception: the hero's `<IsometricGridBG>` overlay is positioned `absolute inset-0` within the hero section, naturally full-bleed (ignores container).
  - Flagship card `<ResponsivePicture>` at 1280px wide + max-w-7xl container = approx 1280×720 card at 1920 viewport. Center-column reading flow.

### `/dev/brand` QA route

- **D-25:** **Add `src/pages/DevBrandPage.tsx`** as a hidden QA surface (not linked from Nav, not in sitemap). Route registered in `App.tsx` as `<Route path="dev/brand" element={<DevBrandPage />} />` alongside the 5 production routes. Accessible via direct URL `/#/dev/brand`.
  - Showcases: Logo (dark.svg at nav size + hero size), Mark (from `brand-assets/mark/mark.svg`), Wordmark (the H1 from D-02 at hero scale), IsometricCube all 3 variants × 3 allowed stroke colors × 2 opacity levels, IsometricGridBG at opacity 0.1 and 0.2, the 6 palette swatches as a table with hex + computed CSS var, the Montserrat weight ladder (400/500/700 at sample sizes 14/16/20/24/40/56/80/180px).
  - Purpose: single-URL visual QA before client demo — confirm no palette drift, confirm cube variants render, confirm typography scale holds.
- **D-26:** **Not deploy-hidden** — `/#/dev/brand` ships to production (the overhead is <5KB) but it's not linked from Nav per Phase 1 D-01. Client will not discover it organically; QA team uses direct URL.

### Logo primitive refinement (VIS-04)

- **D-27:** **Logo.tsx stays as URL-import + `<img>`** (current Phase 1 implementation), NOT migrated to `?react` component import. Rationale: Phase 1 spec'd `?react` but reality shipped URL import; the quick-task 260424-whr verified `<img src>` URL imports correctly bundle in prod build (byte-identical 12,469 B at `dist/assets/dark-CqLEGef8.svg`). The hero wordmark is NOT the logo (per D-02 it's an H1); brand-primitive styling needs (animations, color swaps) don't apply to the Nav/Footer logo use. svgr is still installed and AVAILABLE for `<IsometricGridBG>` (D-03).
- **D-28:** **Add `<Mark>` component** in `src/components/brand/Mark.tsx` that imports `brand-assets/mark/mark.svg` (the cube-with-petals mark) via the same URL-import pattern (`<img src={markUrl} alt="" aria-hidden />`). Used by `DevBrandPage` and potentially by future Phase 4 empty-state fallbacks. Not consumed by home page in Phase 3 — the home page doesn't use the composite mark anywhere. Kept as a primitive available for phases 4–7.

### Content boundary (re-asserts Phase 2 D-20)

- **D-29:** **No Ukrainian JSX literal paragraphs in Phase 3 components.** Any string >40 chars OR containing «Системний» / «ВИГОДА» / brand values lives in a `src/content/*.ts` module. If a section needs copy not yet in Phase 2 modules (e.g., portfolio-section H2 subtitle «1 в активній фазі…»), the planner ADDS it to an appropriate existing module (`values.ts` for brand framing, or creates `src/content/home.ts` for home-specific microcopy — the planner decides which is scannable). Button labels («Переглянути проекти», «Перейти на сайт проекту ↗», «Ініціювати діалог») MAY stay inline per Phase 2 D-20 microcopy exception — judgment call per component.
- **D-30:** **Phase 2's `scripts/check-brand.ts` already catches** forbidden terms (Pictorial/Rubikon), hex drift, and placeholder leaks. Phase 3 adds no new CI guards. The `importBoundaries()` check in Phase 2 D-33 blocks `src/components/` from hardcoding `/renders/` paths — so `<ResponsivePicture>` MUST use `renderUrl` / `constructionUrl` helpers from Phase 2 D-30.

### Claude's Discretion

- Exact hero wordmark pixel size (180 vs 220px) — planner tunes at the browser for 1920×1080 presence.
- Exact pattern of accent-filled CTA hover (brightness shift vs underline-grow vs letter-spacing) — brand-consistent, no springs.
- BrandEssence card layout (4-in-row vs 2×2) — planner picks based on content density after reading `values.ts`.
- MethodologyTeaser block selection (which 2–3 of 7) — planner picks; recommendation is blocks 1 + 3 + 4 (all verified) to avoid foregrounding `needsVerification: true` content on the home page.
- TrustBlock exact layout (3-column table vs 3 stacked facts vs horizontal strip).
- ConstructionTeaser scroll-snap arrow button placement (outside strip vs overlayed on left/right edges, appearing on hover).
- Section spacing precision (py-16 vs py-20 vs py-24 — all use the `--spacing-rhythm-*` scale).
- Whether to add a subtle "scroll down" indicator at the bottom of the hero (small down-arrow or "Далі ↓" text). Brand tone says probably no; Claude decides.
- Order of `<source>` tags in `<picture>` — AVIF first (most modern, smallest) → WebP → JPG fallback is the standard; planner confirms at impl.
- `sharp` encoding parameters (quality, effort, chromaSubsampling) within reasonable defaults for each format.
- Dev-mode skip for `optimize-images.mjs` (if skipping makes dev startup faster and the optimized files already exist from a prior build).
- Whether `/dev/brand` lists ONLY the brand primitives or also includes sample compositions (flagship card mock, pipeline card mock). Leaning toward primitives-only to keep it fast to maintain; expanded composition samples are Phase 4 work.

### Folded Todos

_None — `gsd-tools todo match-phase 3` returned zero matches at discussion time; a cross-reference check during planning is still recommended if the backlog has been updated._

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)

- `.planning/REQUIREMENTS.md` §Home — HOME-01 (hero desktop-first + wordmark + parallax + CTA), HOME-02 (BrandEssence 4 cards), HOME-03 (PortfolioOverview dual-level), HOME-04 (ConstructionTeaser 3–5 photos + CTA), HOME-05 (MethodologyTeaser 2–3 §8 blocks), HOME-06 (TrustBlock ЄДРПОУ + license), HOME-07 (ContactForm functional mailto)
- `.planning/REQUIREMENTS.md` §Visual System — VIS-03 (IsometricCube 3 variants + IsometricGridBG overlay 10–20%), VIS-04 (official SVG logos + favicon)
- `.planning/REQUIREMENTS.md` §Animations — ANI-01 (hero slow-parallax, Motion useScroll+useTransform, ease-out, no bounce)
- `.planning/REQUIREMENTS.md` §QA — QA-02 constraint preview (hero image ≤200KB loaded format, bundle ≤200KB gzipped JS — Phase 3 does NOT verify Lighthouse but must ship image pipeline that hits budget)
- `.planning/ROADMAP.md` §"Phase 3: Brand Primitives & Home Page" — Success Criteria 1–5 (authoritative test surface)

### Project-level policy

- `.planning/PROJECT.md` §Core Value — «ахуєнний desktop-варіант на 1920×1080 з точною палітрою, ізометричними кубами, cinematic-анімаціями на Motion, і чесним відображенням портфеля 0/1/4»
- `.planning/PROJECT.md` §Constraints — desktop-first 1920×1080, hero ≤200KB, bundle ≤200KB gzipped, WCAG 2.1 AA, silent-displacement (Pictorial/Rubikon never named)
- `.planning/PROJECT.md` §Out of Scope — no team photos, no faces, no CMS, no real form backend (mailto-only), no privacy-policy link, no analytics scripts, no swiper/embla libraries, no React-helmet
- `.planning/PROJECT.md` §Key Decisions — Core-4 scope, Модель-Б stages, Етно Дім as flagship template, UA-only

### Prior-phase decisions (Phase 3 inherits wholesale)

- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Nav/Footer — D-01 through D-09 (nav items, footer structure — Phase 3 does not touch these)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Tokens — D-19 `@theme` 6-hex palette (Phase 3 consumes via Tailwind classes `bg-bg`, `text-accent`, etc.)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Fonts — D-20 Montserrat cyrillic-400/500/700 subset entry points (Phase 3 uses weight 700 for hero wordmark, 500 for section titles, 400 for body)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-14 — MinimalCube is a throwaway stub; Phase 3 deletes it (see D-12 this phase)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §Data schema — D-01 through D-06 (Project interface + derived views; Phase 3 imports `flagship`, `pipelineGridProjects`, `aggregateProjects`)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §Content modules — D-15 through D-20 (methodology / values / company / placeholders — Phase 3 home sections consume by named imports)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §Construction data — D-21, D-22 (`constructionLog.latestMonth().teaserPhotos` for Phase 3 teaser)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §Asset helpers — D-30, D-31 (always use `renderUrl` / `constructionUrl` — never hardcode `/renders/` paths)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §CI boundary — D-32, D-33 (`check-brand.ts` `importBoundaries()` enforces no hardcoded asset paths in `src/components/`; `<ResponsivePicture>` MUST obey)

### Research artifacts

- `.planning/research/ARCHITECTURE.md` §3 Q4 — **IsometricCube recommended shape** (verbatim implementation target for `src/components/brand/IsometricCube.tsx`); also rationale for inline SVG (styleable, brand-locked color, typed variant prop, `<IsometricGridBG>` as grid-variant wrapper)
- `.planning/research/ARCHITECTURE.md` §3 Q5 — **Motion patterns** (3-layer composition: variants lib + `<RevealOnScroll>` wrapper + per-component `useScroll`/`useInView`); hero parallax code block is the direct template for D-04
- `.planning/research/ARCHITECTURE.md` §3 Q6 — construction data consumption (Phase 3 teaser reads `latestMonth().teaserPhotos`)
- `.planning/research/PITFALLS.md` §Pitfall 3 — easing/duration inconsistency (Phase 3 must not scatter inline `transition={{}}`; use shared easing constant)
- `.planning/research/PITFALLS.md` §Pitfall 6 — `#A7AFBC` muted text on body copy fails WCAG (restrict to ≥14pt; Phase 3 section titles, fact rows, legal subtitles obey)
- `.planning/research/PITFALLS.md` §Pitfall 8 — **Hero image LCP regression** (preload + eager + no-lazy; drives D-18)
- `.planning/research/PITFALLS.md` §Pitfall 9 — AVIF fallback trap (`<picture>` with explicit JPG fallback; drives D-21 `<ResponsivePicture>` emit)
- `.planning/research/PITFALLS.md` §Pitfall 10 — silent-displacement leak (Phase 3 home copy must not name Pictorial/Rubikon anywhere; Phase 2 `check-brand.ts` will block builds that do)
- `.planning/research/PITFALLS.md` §Pitfall 13 — cinematic intro on re-visit friction (Phase 5 owns sessionStorage skip; Phase 3 must design hero so it CAN be skipped — no mandatory full animation before content is reachable)
- `.planning/research/PITFALLS.md` §Pitfall 16 — `will-change: transform` layer explosion (hero parallax may need `will-change`, but apply sparingly to the IsometricGridBG container only, not to every motion element)
- `.planning/research/STACK.md` §"Recommended Stack" — `motion@^12.38.0`, `vite-plugin-svgr@^4.3.0`, `sharp@^0.34.5`, `@fontsource/montserrat` (already installed per `package.json`)
- `.planning/research/STACK.md` §"What NOT to Use" — skip swiper/embla/keen-slider (use CSS scroll-snap for ConstructionTeaser); skip react-helmet (use `document.title` via `useEffect` if needed); skip react-hook-form+zod (ContactForm is 1 button)
- `.planning/research/STACK.md` §Image Pipeline — Path A (sharp script) is the recommended approach for 70+ images; drives D-19

### Brand authority (visual + content DNA)

- `brand-system.md` §2 — logo охоронне поле (cap-height of «В»), min size 100px screen (Phase 3's hero wordmark is NOT the logo; охоронне поле applies to Nav/Footer logo only)
- `brand-system.md` §3 — palette (6 hexes, WCAG contrast table: `#F5F7FA/#2F3640` AAA 10.5:1, `#C1F33D/#2F3640` AAA 8.85:1, `#A7AFBC/#2F3640` AA 5.3:1 for ≥14pt only, `#C1F33D/#F5F7FA` FAIL 1.2:1 — never used)
- `brand-system.md` §4 — typography scale (Montserrat 3 weights, H1 hero 56–80px per brandbook — Phase 3's hero wordmark at 180–220px is a DISPLAY moment, above the brandbook hero scale, intentional departure for the home signature)
- `brand-system.md` §5 — isometric graphic system (stroke 0.5–1.5pt, opacity 5–60%, 3 allowed colors `#A7AFBC`/`#F5F7FA`/`#C1F33D`, butt cap + miter join, straight lines only — hard constraints for IsometricCube API per D-08)
- `brand-system.md` §6 — DO/DON'T checklist (Phase 3 must respect: dark background default, accent only on CTAs + active states + isometric strokes, no gradients, no glow/shadow/blur on logo/cube)
- `brand-system.md` §7 — layout scale proposal (spacing 4/8/16/32/64 — Phase 1 already encoded in `@theme` as `--spacing-rhythm-*`)
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 — tone of voice (чітко · впевнено · предметно · стримано); forbidden words: мрія, найкращий, унікальний
- `КОНЦЕПЦІЯ-САЙТУ.md` §5.1 — brand token set (aligned with Phase 1 `@theme`)
- `КОНЦЕПЦІЯ-САЙТУ.md` §5.2 — **cube-ladder semantic table** (locks variant → project-state mapping; drives D-10)
- `КОНЦЕПЦІЯ-САЙТУ.md` §6.2 — visual hierarchy on `/projects` (Level 1 flagship, Level 2 pipeline grid, Level 3 aggregate row) — applied to home PortfolioOverview per D-14–D-16
- `КОНЦЕПЦІЯ-САЙТУ.md` §7.1 — **Home page section spec** (verbatim list: hero wordmark + parallax cube + gasлo + CTA; brand-essence 4 values; portfolio dual-level; construction teaser; methodology 2–3 blocks; trust ЄДРПОУ block; contact form) — authoritative scope for HOME-01 through HOME-07
- `КОНЦЕПЦІЯ-САЙТУ.md` §7.9 — construction-log tone («Січень 2026 — фундамент, секція 1», без хвастощів); Phase 3 teaser captions obey
- `КОНЦЕПЦІЯ-САЙТУ.md` §10 — hard rules (closed palette, no team photos, silent-displacement Lakeview-only, no stock photos, no Pictorial/Rubikon anywhere)

### Brand assets (authoritative sources)

- `brand-assets/patterns/isometric-grid.svg` — **source for `<IsometricGridBG>`** (svgr-imported via `vite-plugin-svgr` `?react`, per D-03); 15KB, fill-based geometry with mix-blend-mode (accepted for hero overlay use at opacity 0.1–0.2 — reads as grid not as fill)
- `brand-assets/logo/dark.svg` — Nav logo (Phase 1 D-05, URL-import pattern); Phase 3 `/dev/brand` showcases it at 2 sizes
- `brand-assets/logo/black.svg`, `brand-assets/logo/primary.svg` — alternate versions; Phase 3 `/dev/brand` may showcase, but Phase 3 home page uses only `dark.svg`
- `brand-assets/mark/mark.svg` — cube-with-petals mark; Phase 3 D-28 wraps as `<Mark>` component for future phase reuse + `/dev/brand` display
- `brand-assets/favicon/favicon-32.svg` — wired in `index.html` by Phase 1 (re-verify during Phase 3)
- `brand-assets/brandbook/*` — not consumed at runtime; reference for designers

### Source assets (Phase 3 consumes)

- `/renders/likeview/aerial.jpg` — 1.5MB raw; after Phase 2 copy-renders → `public/renders/lakeview/aerial.jpg`; after Phase 3 optimizer → `public/renders/lakeview/_opt/aerial-{640,1280,1920}.{avif,webp,jpg}`; consumed by PortfolioOverview flagship
- `/renders/likeview/hero.jpg`, `lake-bridge.jpg`, `terrace.jpg`, `closeup.jpg`, `entrance.jpg`, `semi-aerial.jpg` — remaining 6 Lakeview renders (total 7 files in folder); Phase 3 uses `aerial.jpg` for flagship; others reserved for flagship card hover-state or Phase 4 use
- `/renders/ЖК Етно Дім/*.jpg.webp`, `/renders/ЖК Маєток Винниківський/*.webp`, `/renders/Дохідний дім NTEREST/*.webp` — already WebP in source; optimizer runs on them anyway (re-encodes at consistent widths/quality) OR treats them as final (skipping re-encode) — planner decides. Safest: run through optimizer for consistent width/format matrix.
- `/construction/mar-2026/mar-01.jpg` through `mar-15.jpg` — 15 JPG photos; Phase 3 teaser uses 3–5 per `teaserPhotos` field from Phase 2 D-22

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 1–2)

- **Layout shell** (`src/components/layout/{Layout,Nav,Footer,ScrollToTop}.tsx`, Phase 1) — Phase 3 renders inside the existing `<Outlet>` in `Layout.tsx`; no layout changes needed.
- **Brand tokens** (`src/index.css` `@theme`, Phase 1 D-19) — Phase 3 consumes `bg-bg`, `bg-bg-surface`, `bg-bg-black`, `bg-accent`, `text-text`, `text-text-muted` Tailwind utilities that the `@theme` block generates. No new tokens.
- **Logo primitive** (`src/components/brand/Logo.tsx`, Phase 1) — URL-import pattern; Phase 3 does not touch it (D-27). Re-used in `/dev/brand` display.
- **Cube stub** (`src/components/brand/MinimalCube.tsx`, Phase 1) — DELETED in Phase 3 (D-12); the `single` variant's geometry is preserved in the new `IsometricCube.tsx`.
- **Data surface** (`src/data/projects.ts`, `src/data/construction.ts`, Phase 2) — named imports: `flagship`, `pipelineGridProjects`, `aggregateProjects`, `constructionLog`, `latestMonth` (helper TBD — if Phase 2 shipped `constructionLog[0]` directly, Phase 3 imports that; planner verifies at time of plan).
- **Content modules** (`src/content/{methodology,values,company,placeholders}.ts`, Phase 2) — named imports: `brandValues`, `methodologyBlocks`, `legalName`, `edrpou`, `licenseDate`, `email`, `socials`, `phone`, `address`, `pipeline4Title`, `etnoDimAddress`.
- **Asset URL helpers** (`src/lib/assetUrl.ts`, Phase 2 D-30) — Phase 3 `<ResponsivePicture>` uses `renderUrl(slug, file)` and `constructionUrl(month, file)` — NEVER hardcoded paths.
- **svgr + sharp pipeline slots** — `vite-plugin-svgr@^4.3.0` is already in `devDependencies`; Phase 3 USES it for `<IsometricGridBG>`. `sharp@^0.34.5` is NOT installed yet; Phase 3 adds it.
- **Prebuild chain** (`package.json`, Phase 2) — `predev: tsx scripts/copy-renders.ts`, `prebuild: tsx scripts/copy-renders.ts`. Phase 3 extends both to chain `&& node scripts/optimize-images.mjs` (or `tsx scripts/optimize-images.ts` if TS preferred).
- **CI guard** (`scripts/check-brand.ts`, Phase 2 D-24+) — 4 checks (denylist, palette, placeholders, boundaries). Phase 3 introduces no new CI rules; existing `importBoundaries()` already forces `<ResponsivePicture>` to use `renderUrl`/`constructionUrl`.

### Anti-list — DO NOT copy from prototype or unused code

- Prototype `вигода-—-системний-девелопмент/public/*.jpg` stock photos (CONCEPT Додаток C — forbidden)
- Any font-family other than Montserrat (brand-system.md §4)
- Inline `transition={{...}}` objects on motion components (PITFALLS §Pitfall 3; Phase 5 owns centralised variants)
- Hardcoded hex values outside the 6 palette hexes (Phase 2 `check-brand.ts` blocks builds)
- Hardcoded `/renders/*` or `/construction/*` path strings in JSX (Phase 2 `importBoundaries()` blocks)
- `loading="lazy"` on the hero image (`aerial.jpg` in flagship) — PITFALLS §Pitfall 8 (LCP regression)
- Bounce springs (`type: 'spring', bounce: 0.4`) — brand tone: стримано
- `transition-all` CSS (sweeping class that animates unintended properties)
- `react-helmet` — not installed, don't add (STACK.md "What NOT to Use")
- `swiper`, `embla-carousel`, `keen-slider` — use native `scroll-snap` for ConstructionTeaser
- `react-hook-form`, `zod` — ContactForm is 1 button, not a form

### Established Patterns

- **Tailwind v4 utility class generation from `@theme`** — `--color-bg` generates `bg-bg`/`text-bg`/`border-bg` etc. Phase 3 uses these utilities instead of inline `style={{ color: 'var(--color-bg)' }}` wherever possible (keeps className-driven styling consistent with Phase 1's Nav/Footer).
- **Brand-primitive folder policy** (`src/components/brand/*`) — inviolable per brandbook; every edit needs design-review intent. Phase 3 additions: `IsometricCube.tsx`, `IsometricGridBG.tsx`, `Mark.tsx`. No edits to `Logo.tsx`.
- **Sections-grouped-by-page** (`src/components/sections/home/*`) — ARCHITECTURE §2 pattern; Phase 3 creates: `Hero.tsx`, `BrandEssence.tsx`, `PortfolioOverview.tsx`, `ConstructionTeaser.tsx`, `MethodologyTeaser.tsx`, `TrustBlock.tsx`, `ContactForm.tsx` under `src/components/sections/home/`. `HomePage.tsx` composes these.
- **UI components folder** (`src/components/ui/*`) — Phase 3 adds `ResponsivePicture.tsx`. Phase 5 will add `RevealOnScroll.tsx` there. Phase 3 does NOT pre-create RevealOnScroll (Phase 5's scope).
- **Asset helpers** — always `renderUrl(slug, file)` / `constructionUrl(month, file)` in JSX; enforced by `importBoundaries()`.

### Integration Points (Phase 3 → Phase 4, 5, 6)

- **Phase 4** consumes `<ResponsivePicture>` for `/zhk/etno-dim` gallery (8 renders) and `/construction-log` timeline (50 photos) — Phase 3 ships the generalized component, Phase 4 wires surfaces.
- **Phase 4** consumes `<IsometricCube variant='group'>` for pipeline card decorative corners (per D-10 cube-ladder mapping) — Phase 3 ships the variant, Phase 4 wires it.
- **Phase 4** consumes `<IsometricCube variant='single'>` for «Здано (0)» empty-state on `/projects` stage filter — Phase 3 ships the variant; Phase 4 wires.
- **Phase 5** replaces hero parallax's local easing constant with the shared `motionVariants.parallaxSlow` variant (ANI-01 semantically moves to shared lib). No hero code churn — only the `transition` object swap.
- **Phase 5** wraps Phase 3's home sections with `<RevealOnScroll>` for scroll-triggered reveals (ANI-02). Phase 3 leaves sections wrapper-free so Phase 5's wrap is additive.
- **Phase 5** keys `<AnimatePresence>` around `<Outlet>` for route transitions (ANI-04). Phase 3 does not touch `App.tsx`'s router structure.
- **Phase 6** runs Lighthouse against deployed URL and verifies Phase 3's image budget held. Expected pass because Phase 3 optimizer targets AVIF ≤140KB at 1920.
- **Phase 6** extends the optimizer for any additional source formats (PNG sources, for instance) if Phase 4 gallery needs them.

</code_context>

<specifics>
## Specific Ideas

- **Hero wordmark letter-spacing** — tighten to `tracking-tight` (`-0.025em` Tailwind default) or slightly tighter (`-0.03em`). At 180–220px scale default Montserrat tracking looks airy; tighten for a confident, dense wordmark (matches brand tone «впевнено»).
- **Accent-bar echo** — if the planner decides D-13 subtitle «1 в активній фазі · 4 у pipeline · 0 здано» needs visual weight, a 2px `#C1F33D` bar under the H2 «Проєкти» (not under subtitle) echoes the Nav active-underline system (Phase 1 D-03) — accent-used-sparingly system discipline.
- **Flagship card padding** — `aerial.jpg` renders 1280×720 inside the card, but the CARD itself wraps it with ~32px dark inner padding on Lakeview + title/CTA overlay on the image OR beside it. Planner picks side-by-side (image left 60%, text right 40%) vs overlay (text on dark gradient over bottom of image) based on readability. Recommendation: side-by-side — overlays on architectural CGI often compete with building facades.
- **Section spacing rhythm** — section-to-section = `py-24` (96px top + bottom), section-internal = `py-16` (64px). Hero gets `min-h-screen` (100vh) instead of `py-*`.
- **ConstructionTeaser arrow buttons** — place OUTSIDE the scroll strip (left + right, vertically centered, 40×40 `bg-bg-surface` circles with `<ChevronLeft>`/`<ChevronRight>` lucide-react icons) rather than overlayed. Outside placement is more desktop-conventional for scroll-carousels; overlayed buttons often overlap photo subjects.
- **`/dev/brand` route URL** — `/#/dev/brand` is the natural hash-route form. If the planner wants a namespace for later QA surfaces (`/dev/grid` in Phase 4), consider registering the Route inside a `<Route path="dev">` group with nested child routes. Claude's Discretion on exact route structure.
- **Optimizer output directory naming** — `_opt/` prefix visually signals "generated, don't hand-edit" (underscore prefix reads as meta). Alternative: `optimized/` or `variants/` — planner picks, but keep consistent across renders/ and construction/.
- **Sharp encoding quality defaults** — AVIF quality 50 (sharp's default-sweet-spot per their docs), WebP quality 75, JPG mozjpeg quality 80. Planner tunes if Lighthouse audit shows specific images over budget.
- **`<ResponsivePicture>` prop nomenclature** — use `src` not `source` (matches HTML `<img src>` convention; `source` overloads `<source>` element semantic). Use `sizes` not `sizeHint` (standard HTML attr name).
- **Commit granularity** — suggested Phase 3 commits: (1) `feat(03-01): IsometricCube + IsometricGridBG + Mark primitives + /dev/brand`; (2) `feat(03-02): scripts/optimize-images.mjs + ResponsivePicture component + prebuild wiring`; (3) `feat(03-03): Hero + BrandEssence + PortfolioOverview sections`; (4) `feat(03-04): ConstructionTeaser + MethodologyTeaser sections`; (5) `feat(03-05): TrustBlock + ContactForm + HomePage composition + hero-image preload`. Planner adjusts based on actual wave structure.

</specifics>

<deferred>
## Deferred Ideas

- **Scroll-reveal on home sections (ANI-02)** — Phase 5 scope. Phase 3 leaves sections wrapper-free; Phase 5 adds `<RevealOnScroll>` around each.
- **Route transitions (ANI-04)** — Phase 5 scope. Phase 3 does not wrap `<Outlet>` with `<AnimatePresence>`.
- **Reduced-motion respect** — Phase 5 `useReducedMotion()` hook threaded through all animated components; Phase 3 should, at minimum, ensure hero parallax is disable-able (a single `if (prefersReducedMotion) useTransform returns [0]` guard would suffice). Planner checks.
- **Session-skip hero (re-visit fast-fade)** — Phase 5 scope (`sessionStorage.getItem('hero-seen')`). Phase 3 ships the full cinematic hero; Phase 5 adds the skip guard.
- **Card hover states (ANI-03)** — Phase 4 scope (ЖК cards). Phase 3 pipeline grid cards render static; hover in Phase 4.
- **`/dev/grid` fixtures stress test** — Phase 4 scope (PipelineGrid component owns the fixture route).
- **OG image** — Phase 6 scope (QA-03). The 1200×630 OG render derives from the hero isometric-cube visual that Phase 3 establishes, but Phase 6 produces the static OG file and wires the meta tags.
- **Multi-language (EN)** — v2 scope (PROJECT.md Out of Scope, §11.13 open question).
- **Real contact form with name/email/message** — v2 INFR2-04 (serverless endpoint). Phase 3 ships single CTA mailto per D-HOME-07.
- **BrandEssence card micro-animations** — numbered counter roll-up, line-draw under each card, etc. — Phase 5 scope. Phase 3 ships static cards.
- **Hero "scroll down" hint** — leaning no (brand tone); if Claude's Discretion picks yes, it's a subtle 12px text + micro-arrow, never a cursor-bounce or springy animation.
- **Lighthouse verification** — Phase 6 runs Lighthouse against deployed URL and reports per-route scores. Phase 3 targets the budget; Phase 6 verifies.
- **Image optimizer skip-unchanged / caching** — MVP-sufficient to check source mtime vs output mtime; fancier content-hash caching is v2.
- **PortfolioOverview flagship hover state** — static in Phase 3; subtle hover added in Phase 5 (ANI-02/03 alignment).
- **MethodologyTeaser block swap UI** — Phase 3 ships 2–3 fixed blocks; if the design needs a "read all 7" expand, that's v2 /how-we-build (PAGE2-02).
- **Mark and Wordmark components** — Mark.tsx ships in Phase 3 (D-28) for `/dev/brand` + future use, but home page does not consume it. Wordmark does NOT become a component in Phase 3 (D-02 is H1 HTML; if later designs want SVG wordmark, v2 can extract).

### Reviewed Todos (not folded)

_No pending todos matched this phase at discussion time._

</deferred>

---

*Phase: 03-brand-primitives-home-page*
*Context gathered: 2026-04-25*
