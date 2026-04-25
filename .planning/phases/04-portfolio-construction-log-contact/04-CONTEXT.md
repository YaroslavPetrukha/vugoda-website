# Phase 4: Portfolio, ЖК, Construction Log, Contact — Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Four production routes — `/projects` (HUB-01..04), `/zhk/etno-dim` template (ZHK-01), `/construction-log` (LOG-01/02), `/contact` (CTC-01) — plus a shared **card-hover language** (ANI-03) that lights up every interactive card on the site, plus a hidden `/dev/grid` fixtures route that proves the hub layout scales to N. They consume Phase 2's data layer (`flagship`, `pipelineGridProjects`, `aggregateProjects`, `findBySlug`, fixtures) and Phase 3's primitives (`<ResponsivePicture>`, `<IsometricCube variant=...>`, `<IsometricGridBG>`) verbatim — no new data shapes, no new brand primitives.

Explicit phase-scope clarifications (authorised during discussion):

- **`<Lightbox>` UI primitive** ships in Phase 4 under `src/components/ui/Lightbox.tsx` — used by both `/zhk/etno-dim` 8-render gallery (D-16) AND `/construction-log` 50-photo timeline (D-22). One component, two consumers, one keyboard contract.
- **Image-pipeline extension** — `scripts/optimize-images.mjs` construction widths grow from `[640, 960]` (Phase 3 D-19) to `[640, 960, 1920]` (D-26). One-line script change. Page still loads 640/960 srcset for thumbnails; lightbox loads 1920 on open. Initial page weight unchanged.
- **`<FlagshipCard>` may be extracted** from Phase 3's `PortfolioOverview` if it ends up reused on `/projects` (D-02). Planner picks: extract to `src/components/sections/projects/FlagshipCard.tsx` and have home + /projects both consume it, OR keep two near-duplicate inline JSX blocks. DRY-win > extraction-overhead is the heuristic; if the surfaces diverge in non-trivial ways (e.g., projects-page card shows the stage-label badge while home doesn't), keep them inline.
- **Hover-language wrapper** is implemented in pure Tailwind `hover:*` classes (D-31) — no Motion variant needed. Phase 5 absorbs the inline `cubic-bezier(0.22, 1, 0.36, 1)` constant into `motionVariants.ts` later; no churn at the consumer level.
- **Phase 5 deferred touchpoints** — scroll-reveal wrappers (`<RevealOnScroll>`), `AnimatePresence` route transitions, full `useReducedMotion` sweep, session-skip hero. Phase 4 ships static-section delivery; Phase 5 layers animation atop. Phase 4's only motion concern is hover (ANI-03) + lightbox open/close (200ms fade, no spring).

</domain>

<decisions>
## Implementation Decisions

### `/projects` page (HUB-01..04)

- **D-01:** **Page header above FlagshipCard** = `<h1>Проєкти</h1>` (Montserrat 700, large, ~56px) + muted subtitle «1 в активній фазі будівництва · 4 у pipeline · 0 здано» (echoing home `PortfolioOverview` portfolioSubtitle). Subtitle copy lives in `src/content/projects.ts` (new module, Phase 2 D-15 scannability rule) OR is pulled from `src/content/home.ts` if the planner judges it duplicate-worthy. Per Phase 3 D-29 content-boundary — no Ukrainian JSX literals in components.
- **D-02:** **FlagshipCard ALWAYS renders above the StageFilter**, never hidden by stage selection (success-criteria literal: «above the filter sits Lakeview FlagshipCard»). Planner picks: extract `<FlagshipCard>` from `PortfolioOverview` to a shared component reused by both home and /projects, OR keep two near-duplicate JSX blocks. The Lakeview aerial render is the LCP target on `/projects` — passes `loading="eager"` + `fetchPriority="high"` on this page (same pattern as Phase 3 D-18 home flagship).
- **D-03:** **StageFilter chip counts span ALL projects** (not just `pipelineGridProjects`): «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)». Counts derived from the raw `projects` array, computed inline. Honest 0/1/4 portfolio truth shown in chip form — matches PROJECT.md Core Value language.
- **D-04:** **Filter affects PipelineGrid + AggregateRow only**. Flagship is structurally outside the filter scope (always visible above). This honors the success-criteria literal AND the «honest counts» model: chips count Lakeview as buduetsya:1, but Lakeview is rendered as flagship-special above, not as a grid card.
- **D-05:** **Default state (no chip selected, no `?stage=` param) = «Усі»** — implicit. PipelineGrid shows the 3 grid-only/full-internal cards (Etno Dim · Маєток · NTEREST in `pipelineGridProjects` order). AggregateRow visible (Pipeline-4). Same composition as Phase 3 home `PortfolioOverview`, plus the page header above and the chip row in between.
- **D-06:** **«У розрахунку» selected** → PipelineGrid shows Маєток only (single card, full-width OR 1-column-of-3 layout — planner picks); AggregateRow visible (Pipeline-4 also is u-rozrakhunku). Layout-stress: handle 1-card grid gracefully (no orphan-row weirdness — left-align card at 1-of-3 width or center it; planner chooses).
- **D-07:** **«У погодженні» selected** → PipelineGrid shows Етно Дім + NTEREST (2 cards, 2-of-3 layout or centered pair); AggregateRow hidden (Pipeline-4 not in this bucket).
- **D-08:** **«Будується» selected** → PipelineGrid hides all cards and shows a single one-line note centered: «Див. ЖК Lakeview вище ↑» (text-muted, ~64-96px py vertical breathing). Aria-live polite region for screen readers. AggregateRow hidden. Reason: Lakeview IS the only buduetsya project, but it's already rendered as flagship above — telling the user where to look is the honest UX.
- **D-09:** **«Здано» selected** → PipelineGrid shows the empty-state cube + line «Наразі жоден ЖК не здано». `<IsometricCube variant='single'>` with `stroke="#A7AFBC"` + `opacity={0.4}` ~96-120px (larger than the aggregate-row cube; this IS the focus of an empty bucket). One copy line below the cube. AggregateRow hidden. Honors success-criteria #1 «Здано (0) візуально present as empty-state with cube-marker, not hidden».
- **D-10:** **URL state via `useSearchParams()`** from react-router-dom — `?stage=u-rozrakhunku|u-pogodzhenni|buduetsya|zdano`. Absence of param = default state. `setSearchParams(..., { replace: true })` to avoid history bloat. Hash-router compatible: final URL is `/#/projects?stage=buduetsya`. Shareable for the demo URL — clients can deep-link to a filtered view.
- **D-11:** **Stage-to-Ukrainian-label mapping** lives in a single source: `src/lib/stages.ts` (new) exporting `stageLabel(stage: Stage): string` + `STAGES: readonly Stage[]` (4-tuple in canonical chip order). Reused by StageFilter chip labels, fact-block stage display on `/zhk/etno-dim`, and any future stage-aware UI. Unknown-stage fallback returns `'—'` (em-dash placeholder per Phase 2 D-19 + success-criteria #6 fixture stress test «no runtime crash, no invisible label»).
- **D-12:** **Chip visual style** — Claude's Discretion within brand. Recommended: outline pill at rest (1px `#A7AFBC` border, transparent bg), accent-fill at active (`bg-accent text-bg-black`). Active state echoes Nav active-underline-accent system (Phase 1 D-03) but as fill, not underline (chips are buttons, not links). NO springs on click; 200ms ease-out color transition.

### `/zhk/etno-dim` template (ZHK-01)

- **D-13:** **Section ordering top-to-bottom**: hero render (full-width, eager + fetchPriority="high" = LCP for `/zhk/etno-dim`) → fact block (stage label + location + key facts) → «Що відбувається зараз» paragraph (`whatsHappening` from data) → 8-render gallery → CTA pair. Standard architectural detail-page flow; no breadcrumb in v1 (Nav active state already shows «Проєкти» context).
- **D-14:** **Hero render = `etnoDim.renders[0]`** = `'43615.jpg.webp'` per Phase 2 data. Picture has `loading="eager"` + `fetchPriority="high"`. Planner verifies the optimizer produces 1920w AVIF/WebP/JPG variants; if `aerial.jpg` (lakeview) was the home LCP target at ≤200KB AVIF, `43615.jpg.webp` should land in the same range — measure during build, tune sharp `quality` if it overshoots.
- **D-15:** **Fact block** displays: stage label (from `stageLabel(etnoDim.stage)` = «У погодженні»; the longer descriptive `stageLabel` field on the project = «меморандум про відновлення будівництва» — both are useful, planner picks which to feature; recommended: descriptive `project.stageLabel` because it carries the «system-narrative» weight), location («Львів», `etnoDimAddress` em-dash for the street per `placeholders.ts`), `whatsHappening` paragraph rendered separately below in its own block. Layout: 2-column at ≥1280 (facts left ~40%, whatsHappening right ~60%) OR stacked vertically — planner's call. NO prices, NO sale terms (PROJECT.md hard rule for pipeline projects).
- **D-16:** **Gallery layout = 4×2 uniform grid at ≥1280px** (each cell ~280-300px wide, 16:9 aspect-ratio). Falls to 2-column at 1024-1279px (4×2 → 2×4). Cells use `<ResponsivePicture widths={[640, 1280]}>` `loading="lazy"` (gallery is below fold). Equal weight across all 8 renders; no «hero slot» editorial layout.
- **D-17:** **Gallery click → opens shared `<Lightbox>`** component (D-25 below). Lightbox loads the 1920w variant for fullscreen viewing. Hover state on each gallery thumbnail = full ANI-03 triple effect (D-29).
- **D-18:** **CTA pair** = primary mailto button (`bg-accent text-bg-black`, label «Написати про ЖК Етно Дім» — pre-fills mailto subject as `Запит про ЖК Етно Дім` to `vygoda.sales@gmail.com`) + secondary Instagram button (outlined or text-link with `cursor-disabled` styling, label «Підписатись на оновлення (Instagram)»). Side-by-side at ≥1280, stacked vertically below. Mailto is THE primary CTA because Instagram is `socials.instagram === '#'` placeholder per `content/company.ts`; the disabled-styled secondary signals «coming soon» without lying about working interactivity. CTA copy lives in `src/content/zhk-etno-dim.ts` (new) — planner picks file name; one editorial surface per page is the Phase 2 D-15 pattern.
- **D-19:** **Redirect contract verbatim from Phase 2 D-04**:
  - `/zhk/etno-dim` → renders the full template (the only `presentation === 'full-internal'`).
  - `/zhk/lakeview` → external redirect to `flagship.externalUrl`. Implementation note: react-router's `<Navigate>` is same-origin only; for cross-origin external URL, use a `useEffect` that calls `window.location.assign(flagship.externalUrl)` while rendering a 1-frame minimal redirect screen («Переходимо до ЖК Lakeview…» + cube). Or render `<a href={url}>` with `useEffect` triggering `.click()`. Planner picks the lowest-flicker pattern.
  - `/zhk/maietok-vynnykivskyi`, `/zhk/nterest`, `/zhk/pipeline-4` → `<Navigate to="/projects" replace />` (same-origin, react-router native).
  - `/zhk/unknown-slug` → handled by the catch-all `<Route path="*" element={<NotFoundPage />}>` (Phase 1 D-13). No additional logic in `ZhkPage`.

### `/construction-log` page (LOG-01/02)

- **D-20:** **Month order = latest-first** (Mar 2026 → Feb 2026 → Jan 2026 → Dec 2025). `constructionLog` already exported in this order from Phase 2 D-21. Above-fold = newest construction state; client refreshing the demo URL sees current progress, not 4-month-old foundation work. Standard reverse-chronological blog/timeline pattern.
- **D-21:** **Each month gets a section header**: `<h2>` with format «{month.label} · {month.photos.length} фото» (e.g., «Березень 2026 · 15 фото»). Stripped tone per CONCEPT §7.9. Sticky-on-scroll NOT in v1 (Phase 5 may add `position: sticky` if a UX gap appears; default static).
- **D-22:** **Photos within a month rendered as a uniform grid** — recommended 4-column at ≥1280px (4 photos per row), 3-column at 1024-1279px. Each cell is `<ResponsivePicture widths={[640, 960]}>` `loading="lazy"` with explicit width/height attrs (16:9 by default; planner may pick 4:3 if construction photos are predominantly landscape-tighter — verify against actual photo aspect-ratios during impl). CLS-safe.
- **D-23:** **Click any photo → shared `<Lightbox>`** opens with the 1920w variant (per D-26 optimizer extension). Hover state = full ANI-03 triple effect (D-29).
- **D-24:** **Total page weight target <2MB on initial load** (success-criteria #3 LOG-01 hard mandate). 50 thumbs at 640w WebP × ~30-50KB each ≈ 1.5-2.5MB if all eager. Strict lazy-loading is REQUIRED (`<ResponsivePicture loading="lazy">` default per Phase 3 D-21). Verify during Phase 6 Lighthouse audit; if budget exceeded, options: smaller thumb width (480 instead of 640) + tighter sharp quality. Phase 4 just sets the lazy default and trusts the budget; Phase 6 verifies.

### Shared `<Lightbox>` component (D-16, D-22 consumer)

- **D-25:** **`src/components/ui/Lightbox.tsx`** — controlled component. Props:
  - `photos: LightboxPhoto[]` where `LightboxPhoto = { src: string; alt: string; caption?: string; label?: string }` (`src` is the path-under-public passed to `<ResponsivePicture>`; `caption` is the stripped CONCEPT §7.9 text; `label` is the group label like «Березень 2026»)
  - `index: number` (current photo index)
  - `onClose: () => void`
  - `onIndexChange: (i: number) => void`
  
  Renders a native `<dialog>` element (per STACK.md «What NOT to Use» — no react-modal, no headless-ui). Calls `dialogRef.current?.showModal()` when `index` becomes valid; `.close()` on `onClose`. Body scroll lock while open (`document.body.style.overflow = 'hidden'`). Backdrop click → `onClose`. Esc → native dialog close → `onClose` via dialog's `close` event listener.
- **D-26:** **Lightbox keyboard nav** — keydown listener active while dialog is open: `ArrowLeft` → `onIndexChange(max(0, index-1))`, `ArrowRight` → `onIndexChange(min(photos.length-1, index+1))`. Buttons rendered as overlays on left+right edges (~40-48px square, semi-transparent, accent-on-hover). Position counter «{index+1} / {photos.length}» bottom-center.
- **D-27:** **Lightbox text strip** at bottom of dialog: «{photo.label} — {photo.caption || photo.alt}» + counter. Caption falls back to alt when undefined (Phase 2 D-21 — captions left undefined until hand-authored; alt is always present). Strip styling: dark `#020A0A` semi-transparent background, primary text, ~16px py, full-width.
- **D-28:** **Lightbox image** — uses `<ResponsivePicture>` with `widths={[1920]}` (single-width srcset, lightbox is fullscreen) OR an inline `<picture><source><img>` rendering only the 1920w variant directly via `assetUrl()`. Planner picks; the goal is "load the largest variant once, no srcset gymnastics in fullscreen". `loading="eager"` (user expects the photo immediately when they click). Soft fade-in (200ms) acceptable; no spring.

### Optimizer extension (D-22, D-25 dependency)

- **D-29:** **Extend `scripts/optimize-images.mjs`** construction widths from `[640, 960]` (Phase 3 D-19) to `[640, 960, 1920]`. One-line script change in the widths-per-tree mapping. Sharp encoding params unchanged (AVIF q=50, WebP q=75, JPG q=80). Idempotent — only re-encodes new/changed sources, so existing 640/960 outputs stay; adds 1920 alongside. Run via existing `npm run prebuild` chain.

### ANI-03 hover (cross-surface)

- **D-30:** **Hover applied to**: pipeline cards (Etno Dim · Маєток · NTEREST on `/projects`), FlagshipCard (on home `PortfolioOverview` AND on `/projects` — Phase 4 wires both surfaces, retroactively touching the home component), construction-log photo thumbnails (50 of them), AND `/zhk/etno-dim` 8 gallery thumbnails. `/dev/grid` fixture cards inherit automatically via the shared `PipelineCard` component (or whatever pipeline-card pattern the planner extracts).
- **D-31:** **Hover effect = full triple (spec verbatim)**:
  - `transform: scale(1.02)` on the whole card / thumbnail
  - `box-shadow: 0 0 24px rgba(193, 243, 61, 0.15)` (accent `#C1F33D` glow, ~15% alpha — planner tunes 12-20% alpha and 16-24px spread for visual «not too loud» balance)
  - Image-overlay tint reduces from `bg-bg-black/10` to `bg-bg-black/0` (image lights up subtly)
- **D-32:** **Transition** = `transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms cubic-bezier(0.22, 1, 0.36, 1)`. NO `transition-all` (Pitfall 3 + brand-system §7). NO springs. Easing constant `cubic-bezier(0.22, 1, 0.36, 1)` is the same one Phase 5 will absorb into `motionVariants.ts` (`ease-brand`); inline use here is documented temporary.
- **D-33:** **Implementation = pure Tailwind `hover:*` classes**, no Motion variants:
  ```
  hover:scale-[1.02]
  hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]
  transition-[transform,box-shadow,background-color]
  duration-200
  ease-[cubic-bezier(0.22,1,0.36,1)]
  ```
  Plus a child-selector for the image-overlay opacity. No JS overhead. Phase 5 may consolidate into a `<HoverCard>` wrapper if 4+ surfaces duplicate the class string; for Phase 4, pasted-class is fine.
- **D-34:** **Maietok / NTEREST grid-only cards** (no `/zhk` page in v1) get the SAME hover treatment as Etno Dim. Brand mood is uniform across all ЖК cards — hover is not a click affordance, it's «the cards feel alive». BUT: `cursor: default` (NOT `cursor: pointer`) so users don't expect navigation that doesn't exist. No tooltip, no `aria-disabled`, no «coming soon» label — silent.
- **D-35:** **Reduced-motion respect** = `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` (Tailwind motion-reduce: prefix). Ensures `prefers-reduced-motion: reduce` users see no scale/glow on hover. Phase 5 owns the full reduced-motion sweep across all animated surfaces; Phase 4's hover is one of the touchpoints it covers.

### `/contact` page (CTC-01) — Claude's Discretion within brand

- **D-36:** **Single-column centered layout**: `<h1>Контакт</h1>` + one-line subtitle (e.g., «Напишіть нам, щоб обговорити проект» — copy in `src/content/contact.ts` or extend an existing module). Below: реквізити-block (4 rows: Email, Телефон, Адреса, Соцмережі). Below: primary mailto CTA button (same accent-fill pattern as home `ContactForm`, label «Ініціювати діалог» or «Написати нам» — planner picks; Phase 3 home uses «Ініціювати діалог»).
- **D-37:** **Реквізити-block** = 4-row label/value layout (table or 2-column grid). Labels in `text-muted` (`#A7AFBC`, ≥14pt per WCAG); values in primary `text-text` (`#F5F7FA`):
  - **Email**: `vygoda.sales@gmail.com` (active mailto link)
  - **Телефон**: `—` (em-dash placeholder per Phase 2 D-19)
  - **Адреса**: `—` (em-dash placeholder)
  - **Соцмережі**: Telegram · Instagram · Facebook icons (lucide-react) wrapped in `<a href="#">` with `cursor-default` + `aria-label`. Same disabled-state pattern as Footer (Phase 1 D-08).
- **D-38:** **NO duplicate ЄДРПОУ / license** on `/contact` — Footer already renders these on every route per Phase 1 D-06. Repeating them adds noise without information. Trust signal stays in Footer.

### `/dev/grid` hidden route (HUB-04 fixture stress test) — Claude's Discretion

- **D-39:** **Route registration**: `<Route path="dev/grid" element={<DevGridPage />} />` in `App.tsx` alongside the existing `dev/brand` route (Phase 3 D-25). Direct URL only (`/#/dev/grid`); not linked from Nav. Hidden QA surface for visual stress-testing the hub layout against 10 synthetic ЖК.
- **D-40:** **Page composition** = same `StageFilter + PipelineGrid + AggregateRow + FlagshipCard` shapes as `/projects`, but feeds `fixtures` (10 records from `src/data/projects.fixtures.ts`) instead of `projects`. Reuses the same `PipelineCard` / `StageFilter` / `<FlagshipCard>` (if extracted per D-02) / `AggregateRow` components. Single data-source switch via prop.
- **D-41:** **Synthetic flagship slot** = the `presentation: 'flagship-external'` fixture (Phase 2 D-07 — fixtures cover all 4 presentation variants; one of them is the synthetic flagship). Renders at the top with the same FlagshipCard layout. `externalUrl` may be `'#'` or a placeholder; demonstrates the layout with non-Lakeview content.
- **D-42:** **Stage-to-badge unknown-fallback** is exercised by `/dev/grid` indirectly: if any future fixture introduces an unrecognized `stage` value (TypeScript would catch most cases at compile time, but a runtime override / cast could slip through), `stageLabel(stage)` from `src/lib/stages.ts` (D-11) returns `'—'`. The Phase 4 audit can include a one-shot test: «cast a fixture's stage to `'unknown'` in TS-ignore-comment, verify `/dev/grid` renders the badge as `'—'` instead of crashing».

### Folded Todos

_None — `gsd-tools todo match-phase 4` returned 0 matches at discussion time. Cross-reference recommended at planning if backlog has been updated since._

### Claude's Discretion (planner picks within brand)

- StageFilter chip exact visual style (pill vs underline vs accent-fill on active — recommended outline-at-rest + accent-fill-active, but planner has freedom).
- StageFilter empty-state copy precise wording (within stripped brand tone — no marketing claims, no «мрія/найкращий/унікальний»).
- `/projects` 1-card and 2-card grid layouts (when `«У розрахунку»` shows 1 card, when `«У погодженні»` shows 2) — center the cards, left-align in a 1/3 column, or full-width single — planner picks based on visual balance.
- Whether to extract `<FlagshipCard>` from home `PortfolioOverview` into a shared component reused by `/projects` (DRY-win > extraction-overhead).
- `/zhk` fact-block precise layout (2-col vs stacked) and which stage label to feature (descriptive `project.stageLabel` recommended).
- `/zhk` redirect implementation pattern for external URL (`useEffect` + `window.location.assign` vs `<a>` + auto-click vs an inline 1-frame redirect screen with cube).
- `/zhk` CTA copy precise wording for mailto subject line and Instagram label tooltip.
- Lightbox implementation specifics: focus trap, scroll-lock body, soft fade transition (200ms ease-out — Phase 5 absorbs the easing constant later).
- Construction-log per-month grid columns (3 vs 4 at ≥1280px) — depends on photo aspect ratios (verify against actual JPGs). 4-col recommended for 16:9 photos.
- Lightbox image-loading transition (instant fade-in on photo change vs 200ms ease-out fade between photos as user navigates).
- Page-level scroll-restoration on `/construction-log` after lightbox close (back to where user was reading; existing `<ScrollToTop>` may need bypass for in-page lightbox interactions).
- `/contact` subtitle wording (one stripped-tone line — no marketing claims).
- `/dev/grid` synthetic flagship's external URL value (placeholder `'#'` or Lakeview's URL repurposed).
- File location for shared `<Lightbox>` (`src/components/ui/Lightbox.tsx` recommended).
- Whether to colocate page-level content modules under `src/content/` per page (`projects.ts`, `contact.ts`, `zhk-etno-dim.ts`) or extend `home.ts` (Phase 3 created it). Recommended: per-page modules for scannability (Phase 2 D-15 pattern).
- Hover triple-effect tuning: box-shadow alpha 12-20%, spread 16-24px, overlay-tint delta 5-15% — visual judgment at the browser, not in spec.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)

- `.planning/REQUIREMENTS.md` §Portfolio Hub — HUB-01 (StageFilter 4 buckets + «Здано (0)» empty-state), HUB-02 (Lakeview flagship + external CTA), HUB-03 (3-in-row pipeline grid + stage labels), HUB-04 (Pipeline-4 aggregate row + cube marker)
- `.planning/REQUIREMENTS.md` §ЖК Template — ZHK-01 (full `/zhk/etno-dim` page; hero render, fact block, «Що відбувається зараз», 8-render gallery, Instagram + mailto CTAs; NO prices, NO sale terms)
- `.planning/REQUIREMENTS.md` §Construction Log — LOG-01 (50 photos grouped by month, lazy-load, native `<dialog>` lightbox), LOG-02 (CONCEPT §7.9 stripped-tone captions, AVIF/WebP/JPG via `<picture>`)
- `.planning/REQUIREMENTS.md` §Contact — CTC-01 (mailto active, phone/address `—`, socials `href="#"`)
- `.planning/REQUIREMENTS.md` §Animations — ANI-03 (subtle scale ≤1.02 + overlay-opacity + accent border-glow, brand-consistent ease-out, no springs)
- `.planning/ROADMAP.md` §"Phase 4: Portfolio, ЖК, Construction Log, Contact" — Success Criteria 1–6 (authoritative test surface; SC#6 exercises `/dev/grid` fixtures stress test)

### Project-level policy

- `.planning/PROJECT.md` §Core Value — desktop-first 1920×1080 «ахуєнний» demo with «чесне відображення портфеля 0/1/4» (drives D-03 honest-counts model)
- `.planning/PROJECT.md` §Constraints — desktop-first, hero ≤200KB, bundle ≤200KB gzipped, WCAG 2.1 AA, silent-displacement Lakeview-only, mailto-only forms (drives D-18, D-37)
- `.planning/PROJECT.md` §Out of Scope — no team photos/faces, no CMS, no real form backend, no swiper/embla/keen-slider, no react-hook-form/zod, no privacy-policy link, no analytics scripts, no GDPR triggers (drives D-25 native `<dialog>`, D-37 phone/address `—`)
- `.planning/PROJECT.md` §Key Decisions — Core-4 scope, Model-Б 4 buckets, Етно Дім as `full-internal` template, Маєток/NTEREST as `grid-only`, UA-only

### Prior-phase decisions (Phase 4 inherits wholesale)

- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Nav/Footer — D-01..D-09 (4 nav items, footer 3-col with ЄДРПОУ/license/email — drives D-38 «no duplicate ЄДРПОУ on /contact»)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-08 — social `href="#"` + `cursor-default` + `aria-label` pattern (drives D-37 contact-page socials)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-13 — `<Route path="*" element={<NotFoundPage />} />` catch-all (drives D-19 unknown `/zhk/:slug` handling)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-19 — `@theme` 6-hex palette (Phase 4 consumes via Tailwind utilities; ANI-03 glow uses `#C1F33D` directly via inline rgba per D-31, exempt from palette grep because the value matches whitelist)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-22 — HashRouter (drives D-10 `?stage=` URL works as `/#/projects?stage=...`)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-01..D-09 — `Project` schema, derived views (`flagship`, `pipelineGridProjects`, `aggregateProjects`, `findBySlug`, `detailPageProjects`), fixture pattern (10 synthetic ЖК across 4 stages × 4 presentations) — Phase 4 consumes verbatim, never re-shapes
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-04 — `findBySlug()` returns only `'full-internal'`; redirect contract for other slugs (drives D-19)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-19 — em-dash `—` placeholders (phone, address, etnoDimAddress) — Phase 4 consumes; `pipeline4Title` defaults to «Без назви»
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-21..D-22 — `constructionLog[]` shape + `teaserPhotos` field on latestMonth + `latestMonth()` helper (drives D-20 month order)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-30..D-33 — `assetUrl` / `renderUrl` / `constructionUrl` helpers + `importBoundaries()` CI grep (Phase 4 lightbox + gallery MUST use helpers; never hardcode `/renders/` paths)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-07..D-12 — `IsometricCube` 3 variants + cube-ladder mapping (`single` for empty-state + Pipeline-4 aggregate; drives D-09 «Здано (0)» cube)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-18..D-23 — image pipeline + `<ResponsivePicture>` (Phase 4 reuses verbatim; D-29 extends construction widths from [640,960] to [640,960,1920])
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-25..D-28 — `/dev/brand` hidden route pattern (Phase 4 follows for `/dev/grid` per D-39)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-29 — content-boundary rule (no Ukrainian JSX literals >40 chars in components — drives D-01, D-18, D-36 content-module placement)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-13..D-17 — home `PortfolioOverview` flagship + pipeline-grid + aggregate composition that Phase 4's `/projects` page expands on (potential `<FlagshipCard>` extraction per D-02)

### Research artifacts

- `.planning/research/ARCHITECTURE.md` §3 Q2 — Project schema + derived views + 5 canonical records (consumed by Phase 4 verbatim)
- `.planning/research/ARCHITECTURE.md` §3 Q4 — `IsometricCube` 3 variants (Phase 4 wires `single` for «Здано» empty-state + Pipeline-4 aggregate; `group` for pipeline card decorative corner per Phase 3 D-10 cube-ladder)
- `.planning/research/ARCHITECTURE.md` §3 Q5 — Motion patterns (Phase 4 hover uses inline easing constant `cubic-bezier(0.22, 1, 0.36, 1)`; Phase 5 absorbs into `motionVariants.ts`)
- `.planning/research/ARCHITECTURE.md` §3 Q6 — construction data shape (Phase 4 reads `constructionLog[]` for grouped-by-month rendering)
- `.planning/research/ARCHITECTURE.md` §3 Q8 — translit translation guarantees: `etno-dim` slug = `public/renders/etno-dim/` folder = `<ResponsivePicture src="renders/etno-dim/...">`. Drives D-14 hero render path.
- `.planning/research/ARCHITECTURE.md` §6.5 — phase plan «Phase 5: Portfolio + ZHK template» (Phase 4 here implements that proposal; «Phase 6: Construction log + Contact» merged into this phase per ROADMAP)
- `.planning/research/PITFALLS.md` §Pitfall 3 — animation easing/duration consistency (drives D-32 «no `transition-all`, single ease-brand cubic-bezier»)
- `.planning/research/PITFALLS.md` §Pitfall 5 — dark-mode focus invisibility (Phase 4 lightbox + StageFilter MUST preserve `:focus-visible` outlines per Phase 1 D-21 global rule)
- `.planning/research/PITFALLS.md` §Pitfall 7 — `/zhk/:slug` catch-all rendering (drives D-19 — only `full-internal` renders the template; other slugs `<Navigate>`)
- `.planning/research/PITFALLS.md` §Pitfall 8 — hero LCP regression (Phase 4 `/projects` flagship + `/zhk/etno-dim` hero both follow Phase 3 D-18 `loading="eager"` + `fetchPriority="high"` + preload pattern)
- `.planning/research/PITFALLS.md` §Pitfall 9 — AVIF fallback trap (Phase 4 lightbox + gallery use `<ResponsivePicture>` which already emits `<picture><source type="image/avif"><source type="image/webp"><img>`)
- `.planning/research/PITFALLS.md` §Pitfall 10 — silent-displacement leak (Phase 4 copy across `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact` MUST NOT name Pictorial/Rubikon; Phase 2 `check-brand.ts` blocks)
- `.planning/research/PITFALLS.md` §Pitfall 11 — ЖК-card template scale-to-N (Phase 4 `/dev/grid` exercises this; D-11 stage fallback `'—'` covers unknown-stage class; `pipelineGridProjects` sorted by `order` so ЖК #6 appends cleanly)
- `.planning/research/PITFALLS.md` §Pitfall 12 — placeholder leaks (Phase 2 D-19 em-dash policy holds; D-37 contact phone/address as `—`)
- `.planning/research/PITFALLS.md` §Pitfall 13 — cinematic intro on revisit (out-of-scope here; Phase 5 owns sessionStorage-skip)
- `.planning/research/PITFALLS.md` §Pitfall 14 — mobile/tablet broken in practice (Phase 4 must hold layout integrity at 1024-1279, not «explode»; full mobile fallback is Phase 6's MobileFallback page)
- `.planning/research/STACK.md` §«What NOT to Use» — no swiper/embla/keen-slider (D-22 uses CSS grid, not carousel; D-25 uses native `<dialog>`, not react-modal); no react-helmet (page titles via `useEffect(() => { document.title = ... }, [])` if needed); no react-hook-form (D-37 contact is reading-only data + 1 button)

### Brand authority (visual + content DNA)

- `brand-system.md` §3 — palette (6 hexes; ANI-03 glow uses `#C1F33D` at low alpha — palette-whitelisted; rgba inline use here is the documented exception per D-31)
- `brand-system.md` §5 — isometric line params (D-09 empty-state cube respects stroke 0.5–1.5pt + 3 allowed colors + opacity 5-60% range)
- `brand-system.md` §6 — DO/DON'T (Phase 4 respects: dark background default, accent only on CTAs + active states + isometric strokes + hover-glow, no gradients, no springs)
- `brand-system.md` §7 — layout scale (Phase 4 uses `--spacing-rhythm-*` tokens; section spacing py-16/py-24 echoing Phase 3 home rhythm)
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 — tone of voice (стримано, без хвастощів) — drives D-05, D-08, D-09, D-21, D-27, D-36 copy decisions
- `КОНЦЕПЦІЯ-САЙТУ.md` §4.1 — sitemap (5 routes: /, /projects, /zhk/{slug}, /construction-log, /contact — Phase 4 ships the 4 non-home routes)
- `КОНЦЕПЦІЯ-САЙТУ.md` §4.3 — Lakeview as flagship-external (drives D-19 redirect contract for `/zhk/lakeview`)
- `КОНЦЕПЦІЯ-САЙТУ.md` §6.1 — Model-Б stage buckets (drives D-03 chip labels + counts)
- `КОНЦЕПЦІЯ-САЙТУ.md` §6.2 — visual hierarchy on `/projects` (Level 1 flagship, Level 2 pipeline grid, Level 3 aggregate — drives D-02 / D-04 / D-08 structural separation)
- `КОНЦЕПЦІЯ-САЙТУ.md` §7.9 — construction-log tone («Січень 2026 — фундамент, секція 1», без хвастощів) — drives D-21, D-27 lightbox text
- `КОНЦЕПЦІЯ-САЙТУ.md` §10 — hard rules (closed palette, no team photos, silent-displacement Lakeview-only, no stock photos, no Pictorial/Rubikon anywhere)
- `КОНЦЕПЦІЯ-САЙТУ.md` §11 — open client items (drives D-15 etnoDimAddress placeholder, D-37 phone/address placeholders, D-41 Pipeline-4 title placeholder)

### Source assets (Phase 4 consumes)

- `public/renders/etno-dim/` — 8 render files copied via Phase 2 `copy-renders.ts` (drives D-14 hero + D-16 gallery)
- `public/renders/lakeview/aerial.jpg` — flagship LCP target on `/projects` (D-02)
- `public/renders/maietok-vynnykivskyi/` + `public/renders/nterest/` — pipeline-card cover images (D-05 grid)
- `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/*.jpg` — 50 photos for `/construction-log` (D-20..D-24)
- `brand-assets/mark/mark.svg` — already used as `<Mark>` per Phase 3 D-28; Phase 4 may reuse for `/contact` decorative element (Claude's Discretion)
- `brand-assets/patterns/isometric-grid.svg` — already wrapped as `<IsometricGridBG>` per Phase 3 D-03; not consumed in Phase 4 unless `/contact` decoration calls for it

### Components Phase 4 consumes verbatim (built in Phase 3)

- `src/components/ui/ResponsivePicture.tsx` — gallery + construction-log thumbnails + lightbox image
- `src/components/brand/IsometricCube.tsx` — `single` variant for «Здано» empty-state + Pipeline-4 aggregate; `group` for pipeline card decorative corners
- `src/components/brand/Logo.tsx`, `src/components/brand/Mark.tsx` — already in Layout/Footer; not directly touched in Phase 4
- `src/lib/assetUrl.ts` (renderUrl, constructionUrl) — every image path goes through these

### Data Phase 4 consumes (built in Phase 2)

- `src/data/projects.ts` — `projects[]`, `flagship`, `pipelineGridProjects`, `aggregateProjects`, `detailPageProjects`, `findBySlug`
- `src/data/projects.fixtures.ts` — `fixtures[]` for `/dev/grid`
- `src/data/construction.ts` — `constructionLog[]`, `latestMonth()`
- `src/data/types.ts` — `Project`, `Stage`, `Presentation`, `ConstructionMonth`, `ConstructionPhoto`
- `src/content/company.ts` — `email`, `socials` (drives D-37)
- `src/content/placeholders.ts` — `phone`, `address`, `etnoDimAddress`, `pipeline4Title` (drives D-37, D-15)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 1–3)

- **Layout shell** (`src/components/layout/{Layout,Nav,Footer,ScrollToTop}.tsx`, Phase 1) — Phase 4 pages render inside the existing `<Outlet>`; no Layout edits.
- **Page stubs already in `src/pages/`** — `ProjectsPage.tsx`, `ZhkPage.tsx`, `ConstructionLogPage.tsx`, `ContactPage.tsx` exist as Phase 1 D-10 stubs (centered H1 + Mark cube). Phase 4 replaces their bodies.
- **Routes already wired** in `App.tsx` — `<Route path="zhk/:slug" element={<ZhkPage />} />` already exists; Phase 4 adds the redirect logic + full template inside `ZhkPage`. Adds `<Route path="dev/grid" element={<DevGridPage />} />` per D-39.
- **Brand tokens** (`src/index.css` `@theme`, Phase 1 D-19) — Phase 4 consumes `bg-bg`, `bg-bg-surface`, `bg-bg-black`, `bg-accent`, `text-text`, `text-text-muted` Tailwind utilities. No new tokens. ANI-03 glow uses `rgba(193,243,61,N)` inline (palette-whitelisted hex; `check-brand.ts` paletteWhitelist regex matches hex-with-or-without-alpha).
- **`<ResponsivePicture>`** (`src/components/ui/ResponsivePicture.tsx`, Phase 3 D-21) — Phase 4 gallery + construction-log + lightbox all use this. Lightbox passes `widths={[1920]}` (single-width srcset) for fullscreen viewing.
- **`<IsometricCube>`** (`src/components/brand/IsometricCube.tsx`, Phase 3 D-07..D-09) — `variant='single'` for «Здано» empty-state + Pipeline-4 aggregate row marker. Already wired into Phase 3 home `PortfolioOverview`; Phase 4 reuses verbatim on `/projects`.
- **Data surface** (`src/data/projects.ts`, `src/data/projects.fixtures.ts`, `src/data/construction.ts`) — named imports per D-02..D-22 above.
- **Content modules** (`src/content/{company,placeholders,home,values,methodology}.ts`) — Phase 4 adds `src/content/projects.ts` (page header + StageFilter empty-state copy), `src/content/zhk-etno-dim.ts` (CTA copy), `src/content/contact.ts` (subtitle + label microcopy). Or extends `home.ts` — planner picks per Phase 2 D-15 scannability.
- **Asset URL helpers** (`src/lib/assetUrl.ts`) — `renderUrl(slug, file)` for `/zhk/etno-dim` gallery + `/dev/grid`; `constructionUrl(month, file)` for `/construction-log`.
- **CI guard** (`scripts/check-brand.ts`, Phase 2) — 4 checks active. Phase 4 obeys: no Pictorial/Rubikon in copy, no hex-drift outside palette, no `{{` placeholder leaks, no hardcoded `/renders/` or `/construction/` paths in components (importBoundaries).
- **Optimizer pipeline** (`scripts/optimize-images.mjs`, Phase 3 D-19/D-20) — Phase 4 D-29 extends construction widths to `[640, 960, 1920]`. One-line script edit. `prebuild` chain unchanged.
- **`<ContactForm>` home section** (`src/components/sections/home/ContactForm.tsx`, Phase 3 D-29) — pattern for D-37 (single-button mailto, accent-fill, `encodeURIComponent` subject). Phase 4 `/contact` page may reuse the visual button style; the реквізити-block above is new.
- **`<DevBrandPage>`** (`src/pages/DevBrandPage.tsx`, Phase 3 D-25) — pattern reference for D-39 `<DevGridPage>` (hidden, direct-URL-only QA surface).

### Anti-list — DO NOT copy from prototype or unused code

- Prototype `вигода-—-системний-девелопмент/public/*.jpg` stock photos (CONCEPT Додаток C — forbidden)
- Inline `transition={{...}}` objects on motion components or `transition-all` Tailwind classes (Pitfall 3 + brand-system §7; D-32 enforces explicit per-property transition lists)
- Spring transitions (`type: 'spring', bounce: 0.4`) — brand-system §6 explicit DON'T (D-31 hover uses cubic-bezier ease-out)
- Hardcoded `/renders/etno-dim/...` or `/construction/mar-2026/...` strings in JSX — `importBoundaries()` blocks builds
- `loading="lazy"` on the `/projects` flagship aerial.jpg or `/zhk/etno-dim` hero render — Pitfall 8 (LCP regression)
- `react-modal`, `headless-ui`, `swiper`, `embla-carousel`, `keen-slider` — D-25 uses native `<dialog>`; D-22 uses CSS grid; STACK.md «What NOT to Use»
- `react-hook-form`, `zod`, `react-query`, `axios` — D-37 contact is reading-only data + 1 mailto button
- `react-helmet`, `react-helmet-async` — `useEffect(() => { document.title = ... })` if title changes per route are needed; no helmet
- `framer-motion` (renamed `motion`) — already on `motion@^12` per package.json; never install legacy name
- Pictorial / Rubikon / Пикторіал / Рубікон in any copy or alt text — `check-brand.ts` denylist hard-fails build
- `cursor-pointer` on Maietok/NTEREST grid cards (D-34 — they're not clickable; `cursor: default`)

### Established Patterns

- **Sections under `src/components/sections/{page}/*`** (Phase 3 pattern) — Phase 4 creates: `src/components/sections/projects/{StageFilter,PipelineGrid,FlagshipCard,AggregateRow,EmptyStateZdano,...}.tsx`; `src/components/sections/zhk/{ZhkHero,ZhkFactBlock,ZhkWhatsHappening,ZhkGallery,ZhkCtaPair}.tsx`; `src/components/sections/construction-log/{MonthGroup,...}.tsx`; `src/components/sections/contact/{ContactDetails,...}.tsx` (planner picks granularity).
- **`ResponsivePicture` widths convention** — flagship/hero `[640, 1280, 1920]`; pipeline-card cover `[640, 1280]`; `/zhk` gallery thumb `[640, 1280]`; construction-log thumb `[640, 960]`; lightbox `[1920]` single-width.
- **Content-boundary rule** — Ukrainian JSX literals >40 chars or containing brand names (`Системний`, `ВИГОДА`) live in `src/content/*.ts`. Button labels (`Перейти на сайт проекту ↗`) MAY stay inline if short and microcopy-only (Phase 2 D-20 microcopy exception).
- **Brand-primitive immutability** (`src/components/brand/*`) — no edits to `IsometricCube`, `IsometricGridBG`, `Logo`, `Mark` in Phase 4. If any tweak is needed (e.g., new variant), it's a Phase 4 surprise that should be flagged in audit, not silently shipped.
- **CI guard `importBoundaries()`** forces `<ResponsivePicture src="renders/...">` not `<img src="/renders/...">`. Phase 4 components MUST go through `<ResponsivePicture>` for any renders/construction asset.

### Integration Points (Phase 4 → Phase 5, 6, 7)

- **Phase 5** wraps Phase 4 sections with `<RevealOnScroll>` for scroll-triggered reveals (ANI-02). Phase 4 leaves sections wrapper-free so Phase 5's wrap is additive.
- **Phase 5** keys `<AnimatePresence>` around `<Outlet>` for route transitions (ANI-04). Phase 4 does NOT touch `App.tsx`'s router structure.
- **Phase 5** absorbs Phase 4's inline `cubic-bezier(0.22, 1, 0.36, 1)` constant into shared `motionVariants.ts` `ease-brand`. Phase 4 hover classes get a one-line CSS variable swap; no consumer churn.
- **Phase 5** threads `useReducedMotion()` through Phase 4 components — Phase 4 ships `motion-reduce:` Tailwind prefix (D-35) so Phase 5's hook integration is additive verification, not a rewrite.
- **Phase 6** runs Lighthouse against Phase 4 routes (`/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`) — verifies hero LCP, bundle size, image budgets. Phase 4 hits the budgets via the existing optimizer (D-29 extension).
- **Phase 6** OG meta-tags per route (`og:title`, `og:description`, `og:image`) — uses Phase 4 hero renders as `og:image` source; Phase 4 ships the renders, Phase 6 wires meta.
- **Phase 6** mobile fallback at <1024px — REPLACES Phase 4 pages on mobile devices entirely. Phase 4 only targets 1280-1920 desktop + 1024-1279 graceful fallback.
- **Phase 7** keyboard walkthrough audits Phase 4 lightbox keyboard contract (D-26 `←→ +Esc`); StageFilter keyboard tab order; mailto CTAs reachable; focus-visible visible everywhere.

</code_context>

<specifics>
## Specific Ideas

- **StageFilter chip count notation** — preferred: `«У розрахунку (2)»` with the count in parentheses, muted color. Alternative: `«У розрахунку · 2»` with bullet. Either is brand-consistent; first is slightly more conventional.
- **Empty-state «Здано (0)» visual weight** — single-cube ~96-120px (larger than pipeline-grid card cubes which are decorative; this is the focal point of an entire empty bucket). Centered horizontally. Single line of stripped-tone copy below: «Наразі жоден ЖК не здано». No CTA, no «Дізнатись більше» — empty means empty.
- **«Будується» one-line note styling** — text-muted, ~16-20px, centered, ~64-96px py vertical. Optionally wrap in a thin border or just whitespace. NO arrow icon (the `↑` glyph in the copy already signals direction).
- **`/zhk/etno-dim` hero render aspect ratio** — `43615.jpg.webp` is presumed 16:9 (architectural CGI standard). If it's a different aspect, the `<ResponsivePicture width/height>` props derive from the actual image dimensions, NOT defaulted to 16:9 — verify during impl. Same for the other 7 renders if any are non-16:9.
- **Fact-block label/value pattern** — `<dl>` with `<dt>` (label, muted) + `<dd>` (value, primary). Semantic, accessible, simple to style. Reused on `/contact` реквізити-block per D-37.
- **`<Lightbox>` keyboard contract** — keydown listener attached to `dialog` element (not `window`) so it only fires when dialog is open. `event.preventDefault()` on `←→` to avoid native scroll. Native dialog handles `Esc` → `close` event → call `onClose`.
- **`<Lightbox>` body scroll-lock** — on dialog open: `document.body.style.overflow = 'hidden'`; on close: restore. Prevents background scroll bleed-through. Standard pattern.
- **Construction grid columns at desktop** — verify photo aspect ratios first. If predominantly 4:3 (common for construction phone photos), 4-col at 1280 = 4 × 280 × 4/3 ≈ 4 × 210 = 840 — possibly tight; recommend 3-col 4:3. If 16:9 (architectural drone shots), 4-col at 1280 = 4 × 280 × 9/16 ≈ 4 × 158 = comfortable.
- **`/dev/grid` flagship slot** — use fixture-08 (currently `presentation: 'flagship-external'` in fixtures per Phase 2 D-07). Or wire a flag prop to the shared `<FlagshipCard>` so `/dev/grid` chooses any fixture as flagship (more flexible). Planner picks.
- **Page-titles per Phase 4 route** — Phase 1 D-11 set page titles per route at the H1 level (rendered text). Browser `<title>` updates per route are deferred to Phase 6 OG-meta work; if the planner wants to inline `useEffect(() => { document.title = ... })` in each Phase 4 page, that's Claude's Discretion (no helmet, no library).
- **Commit granularity** — suggested Phase 4 commits: (1) `feat(04-01): src/lib/stages.ts + StageFilter + chip-counts`; (2) `feat(04-02): ProjectsPage compose (header + flagship + filter + grid + aggregate + empty-states)`; (3) `feat(04-03): Lightbox shared component + keyboard nav + scroll-lock`; (4) `feat(04-04): ZhkPage full template (hero + facts + whatsHappening + gallery + CTAs + redirect logic)`; (5) `feat(04-05): ConstructionLogPage (month groups + photo grids + lightbox wiring)`; (6) `feat(04-06): ContactPage (реквізити + mailto CTA)`; (7) `feat(04-07): ANI-03 hover wrapper applied across pipeline cards + flagship + construction thumbs + zhk gallery thumbs`; (8) `feat(04-08): /dev/grid hidden route + DevGridPage`; (9) `chore(04-09): scripts/optimize-images.mjs construction widths [640,960,1920]`. Planner adjusts based on parallelization.

</specifics>

<deferred>
## Deferred Ideas

- **Scroll-reveal on Phase 4 sections** — Phase 5 scope (ANI-02). Phase 4 ships static; Phase 5 wraps with `<RevealOnScroll>`.
- **Route transitions (`AnimatePresence`)** — Phase 5 (ANI-04). Phase 4 does not touch `App.tsx`.
- **`useReducedMotion()` full sweep** — Phase 5 owns the hook integration; Phase 4 ships `motion-reduce:` Tailwind class fallbacks per D-35.
- **Card hover micro-animations** (numbered counter roll-up, line-draw under card title) — Phase 5; Phase 4 ships the static-but-hover-glowing card.
- **OG meta tags per Phase 4 route** — Phase 6 (QA-03). Phase 4 ships pages; Phase 6 wires `og:image` using Phase 3/4 renders.
- **`<title>` per route** — Phase 6, OR inline `useEffect(() => { document.title = ... })` per page if the planner judges it worth doing now (Claude's Discretion). No `react-helmet`.
- **Phone / address / Pipeline-4 title client confirmations** — `placeholders.ts` em-dash pattern stays through v1; client may answer at handoff and Phase 7 captures in `docs/CLIENT-HANDOFF.md`.
- **Етно Дім вул. Судова verification** — `etnoDimAddress` em-dash placeholder until client confirms (CONCEPT §11.8). Fact-block (D-15) shows `«—»` as the street value.
- **Real Instagram URL for socials** — `socials.instagram === '#'` placeholder until client provides. D-18 secondary CTA stays disabled-styled.
- **Real contact form (name/email/message + server endpoint)** — v2 (PROJECT.md Out of Scope, INFR2-04). Phase 4 ships single mailto CTA per D-37.
- **Multi-language EN** — v2 scope (PROJECT.md §11.13).
- **Detail page for Маєток / NTEREST** — v2 (current spec is `grid-only`). Phase 4 D-34 same hover, no cursor.
- **Pipeline-4 detail page** — never (presentation = `aggregate`; will never have a detail page; client confirms title in v1).
- **Sticky month headers on `/construction-log`** — Phase 5 if a UX gap appears; D-21 default static.
- **Scroll-restoration on `/construction-log` after lightbox close** — Phase 5 if browser default is jarring; default behavior in Phase 4.
- **Construction photo captions hand-authored** — Phase 2 D-21 left captions undefined; alt fallback works. Captions can be added pre-handoff in a content-only commit; not a Phase 4 dev task.
- **Stage-filter URL state persisting across navigation** — Phase 4 ships `?stage=...` per D-10; if user navigates away to `/projects/.../zhk/etno-dim` and back, the param resets unless they used browser back. Acceptable v1.
- **Lightbox image zoom (pan/pinch fullscreen)** — v2 if a UX request emerges. v1 is fixed-fit-viewport.
- **Lightbox social-share button** — v2 if needed. v1 is view-only.
- **Lazy-loading of below-the-fold months on `/construction-log`** — Phase 6 if the bundle/page-weight budget is tight; v1 default `<ResponsivePicture loading="lazy">` per-photo is sufficient.
- **`/dev/grid` Vitest coverage** — STACK.md skips Vitest for MVP; D-42 stage-fallback test is a one-shot manual verify, not automated.

### Reviewed Todos (not folded)

_No pending todos matched this phase at discussion time (`gsd-tools todo match-phase 4` → 0 matches)._

</deferred>

---

*Phase: 04-portfolio-construction-log-contact*
*Context gathered: 2026-04-25*
