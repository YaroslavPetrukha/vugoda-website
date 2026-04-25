# Phase 4: Portfolio, ЖК, Construction Log, Contact — Research

**Researched:** 2026-04-25
**Domain:** desktop-first React 19 SPA — production routes (`/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`) + hidden `/dev/grid` fixtures stress-test + shared `<Lightbox>` UI primitive + cross-surface ANI-03 hover language
**Confidence:** HIGH for code-grounded findings (every Phase 1/2/3 surface read on disk this session); MEDIUM for native-`<dialog>` keyboard-behavior tuning (well-documented pattern but tuning is a visual judgment call); HIGH for HashRouter + `useSearchParams` interop (verified against react-router-dom v7 install at `node_modules/react-router-dom/dist/index.d.mts`).

## RESEARCH COMPLETE

## Summary

Phase 4 is a **composition-and-glue phase**: every brand primitive, every data surface, every helper, and every CI guard already exists. The work is wiring four routes against `<ResponsivePicture>` + `<IsometricCube>` + `data/projects` + `data/construction` + `lib/assetUrl`, plus shipping ONE new UI primitive (`<Lightbox>`) and ONE new lib helper (`lib/stages.ts`). Phase 4 also retroactively adds the ANI-03 hover language to the home `PortfolioOverview` flagship + pipeline cards (which today have no hover treatment) and extends `scripts/optimize-images.mjs` with a one-line widths edit.

**Primary recommendation:** Plan eight thin tasks that mirror the §Specifics commit-granularity list (one task per surface — `lib/stages.ts` + `<Lightbox>` + `/projects` + `/zhk/etno-dim` + `/construction-log` + `/contact` + ANI-03 retroactive sweep + `/dev/grid`). The optimizer extension can ride along with `/construction-log` since they touch the same path. Resist any urge to introduce a new dependency; every "would be nice to have a library for this" check (lightbox, search-params, lazy-load, hover) is already covered by the platform or existing primitives — STACK.md "What NOT to Use" enumerates them by name.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**`/projects` page (HUB-01..04):**
- **D-01** — Page header `<h1>Проєкти</h1>` (Montserrat 700, ~56px) + muted subtitle «1 в активній фазі будівництва · 4 у pipeline · 0 здано». Subtitle copy lives in `src/content/projects.ts` (new) OR pulled from `src/content/home.ts`. No Ukrainian JSX literals >40 chars in components (Phase 3 D-29).
- **D-02** — FlagshipCard ALWAYS above StageFilter, never hidden by stage. Lakeview aerial = LCP target on `/projects` (`loading="eager"` + `fetchPriority="high"`). Planner picks: extract `<FlagshipCard>` from `PortfolioOverview` to a shared component, OR keep two near-duplicate JSX blocks.
- **D-03** — StageFilter chip counts span ALL projects (incl. flagship + Pipeline-4 aggregate). Counts: «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)».
- **D-04** — Filter affects PipelineGrid + AggregateRow only. Flagship is structurally outside filter scope.
- **D-05** — Default state = «Усі» (no chip selected, no `?stage=` param). PipelineGrid shows the 3 grid-only/full-internal cards. AggregateRow visible (Pipeline-4).
- **D-06** — «У розрахунку» selected → PipelineGrid shows Маєток only; AggregateRow visible (Pipeline-4 also is u-rozrakhunku).
- **D-07** — «У погодженні» selected → PipelineGrid shows Етно Дім + NTEREST; AggregateRow hidden.
- **D-08** — «Будується» selected → PipelineGrid hides all cards, shows centered note «Див. ЖК Lakeview вище ↑» (text-muted, ~64-96px py, aria-live polite). AggregateRow hidden.
- **D-09** — «Здано» selected → PipelineGrid shows `<IsometricCube variant='single' stroke="#A7AFBC" opacity={0.4}>` ~96-120px + line «Наразі жоден ЖК не здано». AggregateRow hidden.
- **D-10** — URL state via `useSearchParams()` — `?stage=u-rozrakhunku|u-pogodzhenni|buduetsya|zdano`. Absence = default. `setSearchParams(..., { replace: true })`. Hash-router compatible: `/#/projects?stage=...`.
- **D-11** — Stage labels via `src/lib/stages.ts` (new): `stageLabel(stage)` + `STAGES: readonly Stage[]`. Unknown-stage fallback returns `'—'`.
- **D-12** — Chip visual style — Claude's Discretion. Recommended: outline-pill at rest, accent-fill at active. NO springs, 200ms ease-out color.

**`/zhk/etno-dim` template (ZHK-01):**
- **D-13** — Section ordering: hero render → fact block → «Що відбувається зараз» → 8-render gallery → CTA pair. No breadcrumb in v1.
- **D-14** — Hero render = `etnoDim.renders[0]` = `'43615.jpg.webp'`. `loading="eager"` + `fetchPriority="high"`. 1920w AVIF target ≤200KB; verify during impl.
- **D-15** — Fact block: stage label (descriptive `project.stageLabel` recommended), location («Львів» + `etnoDimAddress` em-dash), `whatsHappening` paragraph in own block. Layout 2-column (40/60) at ≥1280 OR stacked. NO prices, NO sale terms.
- **D-16** — Gallery 4×2 uniform grid at ≥1280px (each cell ~280-300px wide, 16:9). 2-column at 1024-1279px. Cells use `<ResponsivePicture widths={[640, 1280]} loading="lazy">`. No hero slot.
- **D-17** — Gallery click → opens shared `<Lightbox>`. Lightbox loads 1920w. Hover state = full ANI-03 triple effect.
- **D-18** — CTA pair: primary mailto button (`bg-accent text-bg-black`, label «Написати про ЖК Етно Дім», pre-fills mailto subject `Запит про ЖК Етно Дім` to `vygoda.sales@gmail.com`) + secondary Instagram button (outlined or text-link, `cursor-disabled`, label «Підписатись на оновлення (Instagram)»). CTA copy in `src/content/zhk-etno-dim.ts` (new).
- **D-19** — Redirect contract: `/zhk/etno-dim` renders template; `/zhk/lakeview` → `useEffect` `window.location.assign(flagship.externalUrl)` + 1-frame redirect screen; `/zhk/maietok-vynnykivskyi`, `/zhk/nterest`, `/zhk/pipeline-4` → `<Navigate to="/projects" replace />`; `/zhk/unknown-slug` → catch-all NotFoundPage.

**`/construction-log` page (LOG-01/02):**
- **D-20** — Month order = latest-first (already exported in this order from Phase 2 D-21).
- **D-21** — Each month: `<h2>` «{label} · {photos.length} фото». Sticky-on-scroll NOT in v1 (Phase 5 may add).
- **D-22** — Photos within month = uniform grid. Recommended 4-col at ≥1280px, 3-col at 1024-1279px. `<ResponsivePicture widths={[640, 960]} loading="lazy">`. Explicit width/height (CLS-safe).
- **D-23** — Click photo → shared `<Lightbox>` opens with 1920w. Hover = full ANI-03 triple effect.
- **D-24** — Total page weight target <2MB on initial load (LOG-01 mandate). Strict lazy-loading required. Phase 4 sets the lazy default; Phase 6 verifies.

**Shared `<Lightbox>` component:**
- **D-25** — `src/components/ui/Lightbox.tsx` controlled component. Props: `photos: LightboxPhoto[]` (`{src, alt, caption?, label?}`), `index: number`, `onClose`, `onIndexChange`. Native `<dialog>`. Body scroll lock (`document.body.style.overflow = 'hidden'`). Backdrop click → onClose. Esc → native dialog close → onClose via `close` event.
- **D-26** — Keyboard nav on dialog keydown: `ArrowLeft` → `onIndexChange(max(0, index-1))`, `ArrowRight` → `onIndexChange(min(photos.length-1, index+1))`. Buttons as overlays on left+right edges. Counter «{index+1} / {photos.length}» bottom-center.
- **D-27** — Text strip at bottom: «{label} — {caption || alt}» + counter. Caption falls back to alt. Strip styling: dark `#020A0A` semi-transparent, primary text, ~16px py, full-width.
- **D-28** — Lightbox image = `<ResponsivePicture widths={[1920]}>` OR inline `<picture><source><img>` rendering only 1920w. `loading="eager"`. 200ms fade-in OK; no spring.

**Optimizer extension:**
- **D-29** — Extend `scripts/optimize-images.mjs` construction widths from `[640, 960]` to `[640, 960, 1920]`. One-line script change. Sharp params unchanged. Idempotent.

**ANI-03 hover (cross-surface):**
- **D-30** — Hover applied to: pipeline cards on `/projects`, FlagshipCard on home + `/projects` (Phase 4 wires both), construction-log photo thumbnails (50), `/zhk/etno-dim` 8 gallery thumbnails. `/dev/grid` inherits via shared component.
- **D-31** — Triple effect: `transform: scale(1.02)` + `box-shadow: 0 0 24px rgba(193, 243, 61, 0.15)` (planner tunes 12-20% alpha, 16-24px spread) + image-overlay tint `bg-bg-black/10` → `bg-bg-black/0`.
- **D-32** — Transition: `transition: transform/box-shadow/background-color 200ms cubic-bezier(0.22, 1, 0.36, 1)`. NO `transition-all`. NO springs. Easing constant absorbed by Phase 5 into `motionVariants.ts` `ease-brand`.
- **D-33** — Implementation = pure Tailwind `hover:*` classes (`hover:scale-[1.02]`, `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`, `transition-[transform,box-shadow,background-color]`, `duration-200`, `ease-[cubic-bezier(0.22,1,0.36,1)]`). No Motion variants.
- **D-34** — Maietok / NTEREST grid-only cards get SAME hover treatment. `cursor: default` (NOT pointer). No tooltip, no aria-disabled, no «coming soon» label.
- **D-35** — Reduced-motion: `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`. Phase 5 owns full RM sweep.

**`/contact` page (CTC-01):**
- **D-36** — Single-column centered layout: `<h1>Контакт</h1>` + one-line subtitle (copy in `src/content/contact.ts` or extend home). Below: реквізити-block (4 rows). Below: primary mailto CTA button.
- **D-37** — Реквізити-block 4-row label/value: Email = `vygoda.sales@gmail.com` mailto; Телефон = `—`; Адреса = `—`; Соцмережі = Telegram · Instagram · Facebook icons (lucide-react) wrapped in `<a href="#">` with `cursor-default` + `aria-label`. Same disabled-state pattern as Footer.
- **D-38** — NO duplicate ЄДРПОУ/license on `/contact` — Footer already renders these.

**`/dev/grid` hidden route:**
- **D-39** — Route registration: `<Route path="dev/grid" element={<DevGridPage />} />` in `App.tsx`. Hidden, not linked from Nav.
- **D-40** — Page composition = same `StageFilter + PipelineGrid + AggregateRow + FlagshipCard` shapes as `/projects`, but feeds `fixtures` (10 records) via prop.
- **D-41** — Synthetic flagship slot = `presentation: 'flagship-external'` fixture (`fixture-06`). External URL may be `'#'` or placeholder.
- **D-42** — Stage-fallback unknown returns `'—'` from `src/lib/stages.ts`. Audit can include cast-to-`'unknown'` test.

### Claude's Discretion

- StageFilter chip exact visual style (pill vs underline vs accent-fill on active — recommended outline-at-rest + accent-fill-active).
- StageFilter empty-state copy precise wording (within stripped brand tone).
- 1-card and 2-card grid layouts (centered/left-aligned/full-width — visual balance).
- Whether to extract `<FlagshipCard>` from home `PortfolioOverview`.
- `/zhk` fact-block precise layout (2-col vs stacked) and which stage label to feature (descriptive `project.stageLabel` recommended).
- `/zhk` redirect implementation pattern for external URL.
- `/zhk` CTA copy precise wording for mailto subject and Instagram label.
- Lightbox specifics: focus trap, scroll-lock body, soft fade transition (200ms ease-out).
- Construction-log per-month grid columns (3 vs 4 at ≥1280px) — depends on photo aspect ratios. **See Q11 below — actual photos are 1080×1346 portrait (~4:5), 3-col is the right call.**
- Lightbox image-loading transition (instant fade-in vs 200ms ease-out fade between photos).
- Page-level scroll-restoration on `/construction-log` after lightbox close.
- `/contact` subtitle wording.
- `/dev/grid` synthetic flagship's external URL value.
- File location for shared `<Lightbox>` (`src/components/ui/Lightbox.tsx` recommended).
- Per-page content modules vs extending `home.ts` (per-page recommended for scannability per Phase 2 D-15).
- Hover triple-effect tuning: box-shadow alpha 12-20%, spread 16-24px, overlay-tint delta 5-15%.

### Deferred Ideas (OUT OF SCOPE)

- Scroll-reveal on Phase 4 sections — Phase 5 (ANI-02).
- Route transitions (`AnimatePresence`) — Phase 5 (ANI-04).
- `useReducedMotion()` full sweep — Phase 5.
- Card hover micro-animations (counter roll-up, line-draw) — Phase 5.
- OG meta tags per Phase 4 route — Phase 6 (QA-03).
- `<title>` per route — Phase 6 (or inline `useEffect` if planner judges worthwhile, no `react-helmet`).
- Phone / address / Pipeline-4 title client confirmations — `placeholders.ts` em-dash holds; Phase 7 client handoff doc.
- Етно Дім вул. Судова verification — `etnoDimAddress` em-dash placeholder until client confirms.
- Real Instagram URL — `socials.instagram === '#'` placeholder.
- Real contact form (name/email/message + server endpoint) — v2 INFR2-04.
- Multi-language EN — v2.
- Detail page for Маєток / NTEREST — v2.
- Pipeline-4 detail page — never (presentation = `aggregate`).
- Sticky month headers on `/construction-log` — Phase 5 if UX gap.
- Scroll-restoration after lightbox close — Phase 5 if jarring.
- Construction photo captions hand-authored — content-only commit pre-handoff, not Phase 4 dev.
- Stage-filter URL state persisting across navigation — Phase 4 ships `?stage=`; reset on nav-away is acceptable.
- Lightbox image zoom (pan/pinch) — v2.
- Lightbox social-share button — v2.
- Lazy-loading of below-the-fold months — Phase 6 if budget tight.
- `/dev/grid` Vitest coverage — STACK.md skips Vitest for MVP.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HUB-01 | `/projects` StageFilter 4 buckets (Model-Б), «Здано (0)» empty-state visible with cube-marker | Q1 (URL state + `useSearchParams`), Q8 (param validation), Q5 (chip hover via ANI-03), `<IsometricCube variant='single'>` already shipped |
| HUB-02 | Lakeview FlagshipCard above filter, aerial render LCP, external CTA new tab | Q3 (LCP preload pattern per route), Q9 (FlagshipCard extraction from `PortfolioOverview` — already a clean self-contained block), home `flagshipExternalCta` content key reusable |
| HUB-03 | 3-in-row pipeline grid with stage labels («меморандум»/«кошторисна документація»/«дозвільна документація») | `pipelineGridProjects` derived view ships sorted by `order`; `stageLabel` is a project field, distinct from `stages.stageLabel(stage)` |
| HUB-04 | Pipeline-4 aggregate row with cube marker | `aggregateProjects` derived view + `<IsometricCube variant='single' stroke="#A7AFBC" opacity={0.4}>` already wired in home `PortfolioOverview` line 117 — copy verbatim |
| ZHK-01 | `/zhk/etno-dim` full template — hero render, fact block, «Що відбувається зараз», 8-render gallery, CTAs; redirects for other slugs | Q3 + Q6 + Q7 + Q9 + Q10; `findBySlug()` already gates on `presentation === 'full-internal'` |
| LOG-01 | 50 photos grouped by month, lazy-load, native `<dialog>` lightbox | Q1 (native dialog), Q4 (lazy-load + 50-photo budget), Q11 (4:5 portrait aspect ratio drives 3-col), Q12 (Lightbox state pattern) |
| LOG-02 | Stripped captions per CONCEPT §7.9, AVIF/WebP/JPG via `<picture>` | `<ResponsivePicture>` already emits AVIF→WebP→JPG; alt-text default already in `data/construction.ts`; captions undefined-OK fallback to alt per Phase 2 D-21 |
| CTC-01 | `/contact` mailto active, phone/address `—`, socials `href="#"` | Q7 (`<dl>/<dt>/<dd>` semantic markup), Q17 (mailto URL-encoding for cyrillic), `placeholders.ts` em-dash + `socials` in `content/company.ts` already shipped |
| ANI-03 | Subtle scale ≤1.02 + overlay-opacity + accent border-glow, brand-consistent ease-out, no springs | Q5 (Tailwind v4 hover triple-effect compilation), Q16 (motion-reduce: prefix), D-31..D-35 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack pinned:** Vite 6.3 + React 19.2 + TS 5.8 + Tailwind 4.2 + Motion 12 + react-router-dom 7.14 + lucide-react 1.11 + @fontsource/montserrat 5.2 + sharp 0.34. NO new runtime/dev deps for Phase 4 (verified against package.json).
- **HashRouter only** in v1 (DEP-03); URLs are `/#/projects?stage=u-rozrakhunku`. `useSearchParams()` works inside HashRouter — confirmed below.
- **Performance budget:** Lighthouse Desktop ≥90 all 4 categories; hero render ≤200KB; bundle ≤200KB gzipped JS. Current bundle 131.60 kB gzipped (65% of budget) — Phase 4 has ~70 kB headroom; native `<dialog>` + `useSearchParams` add zero runtime weight.
- **WCAG 2.1 AA floor:** `#A7AFBC` text only ≥14pt (5.3:1); `#C1F33D` never on light bg. `/contact` реквізити-block muted labels MUST be ≥16px (Pitfall 6).
- **Desktop-first 1920×1080:** 1280-1919 graceful, <1024 mobile-fallback (Phase 6). Phase 4 must hold layout integrity at 1024-1279, no explosion (Pitfall 14).
- **Brand silent-displacement:** Pictorial/Rubikon never named. Renders ONLY from `/renders/` (no stock photos). `check-brand.ts` denylist enforces.
- **Tone of voice:** стримано, без хвастощів. Forbidden lexicon: «мрія», «найкращий», «унікальний», «преміальний стиль життя».
- **No springs, no `transition-all`** (brand-system §6, Pitfall 3, D-32).
- **No client-state libraries** (no swiper/embla/keen/react-modal/headless-ui/react-helmet/react-hook-form). Native `<dialog>` for lightbox; CSS scroll-snap (or grid here) for layout; `mailto:` for forms.
- **Content boundary:** Ukrainian JSX literals >40 chars or with brand names live in `src/content/*.ts`. Microcopy buttons may stay inline (Phase 2 D-20).
- **GSD workflow enforcement:** all edits via planned phase work — no direct edits outside `/gsd:execute-phase`.

## Standard Stack

### Already installed — Phase 4 reuses verbatim

| Package | Version | Purpose | Phase 4 Consumers |
|---------|---------|---------|-------------------|
| `react-router-dom` | `^7.14.0` | Routing + `useSearchParams` + `useParams` + `<Navigate>` | `/projects` filter URL state, `/zhk/:slug` redirect logic, `/dev/grid` route |
| `motion` | `^12.38.0` | Already in graph; **NOT used in Phase 4** | Phase 4 hover is pure Tailwind (D-33). Phase 5 absorbs easing |
| `lucide-react` | `^1.11.0` | Icons | `/contact` social icons (Send/MessageCircle/Globe — same as Footer); lightbox arrows (ChevronLeft/Right — already used by ConstructionTeaser); X-close icon for lightbox |
| `sharp` | `^0.34.5` | AVIF/WebP/JPG encoding | Optimizer extension D-29 (1920w added to construction tree) |

### NOT to add — confirmed against STACK.md "What NOT to Use"

| Library | Why Not | Use Instead |
|---------|---------|-------------|
| `react-modal`, `headless-ui`, `@radix-ui/react-dialog` | D-25 mandates native `<dialog>`; modern browsers (Chrome 37+, Safari 15.4+, Firefox 98+) ship full `showModal()` + Esc-close + backdrop pseudo-element. Adding modal lib = +~30KB gzipped + a11y patterns we'd reimplement | Native `<dialog ref={dialogRef}>` + `dialogRef.current?.showModal()` + `dialog.close` event listener |
| `swiper`, `embla-carousel`, `keen-slider` | D-22 uses CSS grid (no carousel); lightbox does NOT need a slider — keyboard nav is index-stepping not slide-tracking | CSS grid + `<Lightbox photos={...} index onIndexChange>` controlled component |
| `react-helmet`, `react-helmet-async` | Phase 6 owns OG-meta. If per-route `<title>` is desired in Phase 4, inline `useEffect(() => { document.title = ... }, [])` is one line | Phase 6 OR inline `useEffect` |
| `react-hook-form`, `zod` | `/contact` is reading-only data + 1 mailto button (no inputs) | Plain `<a href={mailto}>` styled as button |
| `@tanstack/react-virtual` | 50 photos × 4 months = 200-cell ceiling; `loading="lazy"` covers it | Browser-native lazy loading on `<img>` inside `<picture>` |
| `react-intersection-observer` | No scroll-reveal in Phase 4 (Phase 5 owns ANI-02). Lazy-load uses native `loading="lazy"` not IO | Native `loading="lazy"` |
| `framer-motion` (legacy package name) | Renamed to `motion` in 2024; already on `motion@^12` | `motion@^12.38.0` |

**Installation:** none. `package.json` is unchanged for Phase 4. Build pipeline (`prebuild → tsc → vite build → postbuild check-brand`) is unchanged.

## Architecture Patterns

### Recommended file structure

```
src/
├── pages/
│   ├── ProjectsPage.tsx              # REPLACE stub — composes StageFilter + Flagship + PipelineGrid + AggregateRow + EmptyStates
│   ├── ZhkPage.tsx                   # REPLACE stub — adds findBySlug + redirect logic + full template
│   ├── ConstructionLogPage.tsx       # REPLACE stub — composes month groups + photo grids + Lightbox wiring
│   ├── ContactPage.tsx               # REPLACE stub — реквізити-block + mailto CTA
│   └── DevGridPage.tsx               # NEW — fixtures stress test
├── lib/
│   └── stages.ts                     # NEW — STAGES const + stageLabel(stage)
├── content/
│   ├── projects.ts                   # NEW — page header + StageFilter empty-state copy + «Будується» pointer
│   ├── zhk-etno-dim.ts                # NEW — CTA labels + mailto subject + redirect-screen text
│   └── contact.ts                    # NEW — subtitle + label microcopy (or extend home.ts)
└── components/
    ├── ui/
    │   └── Lightbox.tsx              # NEW — controlled native <dialog> primitive
    └── sections/
        ├── projects/
        │   ├── FlagshipCard.tsx      # NEW (if extracted per D-02) — shared by home + /projects
        │   ├── StageFilter.tsx       # NEW — chip row + URL-state read/write
        │   ├── PipelineGrid.tsx      # NEW — accepts `projects: Project[]` prop, computes filtered view
        │   ├── PipelineCard.tsx      # NEW — single grid card (extract from PortfolioOverview .map body); used by both /projects and /dev/grid
        │   ├── AggregateRow.tsx      # NEW — text + cube marker (extract from PortfolioOverview line 115-124)
        │   └── EmptyStateZdano.tsx    # NEW — single cube + line (D-09)
        ├── zhk/
        │   ├── ZhkHero.tsx           # NEW — full-width hero render (eager + high)
        │   ├── ZhkFactBlock.tsx      # NEW — <dl> stage label + location + etnoDimAddress
        │   ├── ZhkWhatsHappening.tsx # NEW — paragraph block
        │   ├── ZhkGallery.tsx        # NEW — 4×2 grid + lightbox state
        │   └── ZhkCtaPair.tsx        # NEW — primary mailto + secondary disabled-Instagram
        ├── construction-log/
        │   └── MonthGroup.tsx        # NEW — h2 + photo grid + lightbox state per group
        └── contact/
            └── ContactDetails.tsx    # NEW — реквізити-block <dl>
```

Routes added in `App.tsx`:
```tsx
<Route path="dev/grid" element={<DevGridPage />} />  // sibling of dev/brand
```

### Pattern 1: Stage filter via `useSearchParams` (HashRouter-compatible)

**What:** Read `?stage=...` from URL on mount/render, validate against `STAGES` whitelist, default to «Усі» if invalid/missing, write back via `setSearchParams(..., { replace: true })` on chip click.

**When to use:** `/projects` chip filter (D-10).

**Verified:** `react-router-dom@7` re-exports `useSearchParams` from `react-router` (confirmed at `node_modules/react-router-dom/dist/index.d.mts:1-2`). HashRouter parses query strings AFTER the hash — `https://example.com/#/projects?stage=buduetsya` becomes `pathname='/projects'`, `search='?stage=buduetsya'`. Confirmed by reading react-router-dom source signatures and the v7 changelog (no breaking change to `useSearchParams` since v6).

**Example:**
```typescript
// src/lib/stages.ts (new)
import type { Stage } from '../data/types';

export const STAGES = ['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano'] as const satisfies readonly Stage[];

const LABELS: Record<Stage, string> = {
  'u-rozrakhunku': 'У розрахунку',
  'u-pogodzhenni': 'У погодженні',
  'buduetsya':     'Будується',
  'zdano':         'Здано',
};

/** Unknown-stage fallback returns em-dash per D-11 + D-42 + Phase 2 D-19 placeholder rule. */
export function stageLabel(stage: Stage | string | undefined): string {
  if (stage && stage in LABELS) return LABELS[stage as Stage];
  return '—';
}

export function isStage(s: string | null): s is Stage {
  return s != null && (STAGES as readonly string[]).includes(s);
}
```

```tsx
// src/components/sections/projects/StageFilter.tsx (new)
import { useSearchParams } from 'react-router-dom';
import { STAGES, stageLabel, isStage } from '../../../lib/stages';
import type { Stage } from '../../../data/types';

interface Props {
  counts: Record<Stage, number>;  // computed from raw projects[] in parent
}

export function StageFilter({ counts }: Props) {
  const [params, setParams] = useSearchParams();
  const raw = params.get('stage');
  const active: Stage | null = isStage(raw) ? raw : null;

  const setActive = (s: Stage | null) => {
    const next = new URLSearchParams(params);
    if (s == null) next.delete('stage');
    else next.set('stage', s);
    setParams(next, { replace: true });
  };

  return (
    <div role="group" aria-label="Фільтр за стадіями" className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => setActive(null)}
        aria-pressed={active === null}
        className={chipClass(active === null)}
      >
        Усі
      </button>
      {STAGES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setActive(s)}
          aria-pressed={active === s}
          className={chipClass(active === s)}
        >
          {stageLabel(s)} ({counts[s]})
        </button>
      ))}
    </div>
  );
}
```

**Note:** the active filter must be lifted up to `ProjectsPage` (or read from URL again there) so PipelineGrid can render the right subset. Two options:
1. Filter lives in URL only — every consumer reads `useSearchParams` independently. Simpler, less prop-drilling. RECOMMENDED.
2. ProjectsPage reads URL once, passes `active: Stage | null` as prop to children. Slightly more re-render surface area but easier to test.

### Pattern 2: Native `<dialog>` lightbox (verbatim minimum-viable)

**What:** Controlled component with `dialogRef.current.showModal()` on open, `.close()` on close. Listens to dialog's native `close` event for Esc/backdrop. Body scroll lock via `useEffect`.

**When to use:** D-25 — `/zhk/etno-dim` gallery + `/construction-log` photo grid.

**Critical browser-spec facts (verified against MDN / WHATWG):**
- `dialog.showModal()` (not `dialog.show()`) — `showModal` traps focus (top-layer + inert), `show` does not. We need `showModal` for keyboard a11y per D-25/D-26.
- Native Esc-handling: when modal `<dialog>` is open, browser DOES NOT call `preventDefault()` on Esc — it auto-closes the dialog and fires the `close` event. We just listen.
- Backdrop click: pre-2024, this had to be done manually. As of Chrome 120+ / Safari 17+, you can use `dialog::backdrop` CSS + a click-outside check on the dialog content. The robust pattern (works back to baseline browser support per CLAUDE.md "last 2 versions Chrome/Safari/Firefox/Edge") is to attach `onClick` to the dialog and check `event.target === dialogRef.current` (because native `<dialog>` semantics make a click on the backdrop bubble with `target` === the dialog itself).
- Focus trap: `showModal()` traps focus automatically — Tab cycles within dialog content, Shift-Tab cycles backward. We do NOT need a focus-trap library.

**Example (verified pattern, ~80 lines including JSDoc):**
```tsx
// src/components/ui/Lightbox.tsx (new)
import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ResponsivePicture } from './ResponsivePicture';

export interface LightboxPhoto {
  /** Path under public/, e.g. 'renders/etno-dim/43615.jpg.webp' */
  src: string;
  alt: string;
  caption?: string;
  label?: string;
}

interface Props {
  photos: LightboxPhoto[];
  /** Index of currently displayed photo. -1 = closed. */
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index >= 0 && index < photos.length;

  // Open / close native dialog when index validity flips.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  // Body scroll lock while open (D-25).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Listen to native close event (Esc, backdrop, .close()).
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onCloseEvt = () => onClose();
    dlg.addEventListener('close', onCloseEvt);
    return () => dlg.removeEventListener('close', onCloseEvt);
  }, [onClose]);

  // Keyboard: ←/→ for index nav. Native Esc handled by browser.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onIndexChange(Math.max(0, index - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onIndexChange(Math.min(photos.length - 1, index + 1));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, photos.length, onIndexChange]);

  // Backdrop click — when target === dialog itself (not content), close.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  if (!open) return <dialog ref={dialogRef} aria-label="Перегляд фото" />;
  const photo = photos[index];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Перегляд фото"
      onClick={onDialogClick}
      className="m-0 max-h-screen max-w-screen w-screen h-screen bg-bg-black p-0 backdrop:bg-black/80"
    >
      <div className="relative flex h-full w-full flex-col">
        <button type="button" onClick={onClose} aria-label="Закрити" className="absolute right-4 top-4 z-10 text-text">
          <X size={32} />
        </button>
        {index > 0 && (
          <button type="button" onClick={() => onIndexChange(index - 1)} aria-label="Попереднє фото"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text">
            <ChevronLeft size={48} />
          </button>
        )}
        {index < photos.length - 1 && (
          <button type="button" onClick={() => onIndexChange(index + 1)} aria-label="Наступне фото"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-text">
            <ChevronRight size={48} />
          </button>
        )}
        <div className="flex flex-1 items-center justify-center p-12">
          <ResponsivePicture
            src={photo.src}
            alt={photo.alt}
            widths={[1920]}
            sizes="100vw"
            loading="eager"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex w-full items-center justify-between bg-bg-black/80 px-6 py-4 text-text">
          <span className="text-base">
            {photo.label ? `${photo.label} — ` : ''}{photo.caption || photo.alt}
          </span>
          <span className="text-base text-text-muted">
            {index + 1} / {photos.length}
          </span>
        </div>
      </div>
    </dialog>
  );
}
```

### Pattern 3: ZhkPage redirect dispatch

**What:** Single page component reads `:slug`, then dispatches:
- `'etno-dim'` → render full template
- `'lakeview'` → cross-origin redirect via `useEffect(() => { window.location.assign(flagship.externalUrl); }, [])` + 1-frame minimal screen
- other valid slugs (`'maietok-vynnykivskyi'`, `'nterest'`, `'pipeline-4'`) → `<Navigate to="/projects" replace />`
- unknown slugs → `<Navigate to="/" replace />` (catch-all NotFoundPage doesn't apply here because this route IS matched; we don't want to render NotFound under `/zhk/X`)

Per CONTEXT D-19 the unknown-slug case is "handled by the catch-all" — but the catch-all only fires when nothing matches. Since `zhk/:slug` matches anything, the explicit dispatch must handle the "unknown slug" case via `<Navigate to="/projects" replace />` or render the NotFoundPage component directly. **Recommendation: render `<NotFoundPage />` inline so the user sees a proper 404 H1, not a silent redirect to `/projects`.**

**Code shape:**
```tsx
import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { findBySlug, projects } from '../data/projects';
// ... section imports

const KNOWN_SLUGS = ['lakeview', 'etno-dim', 'maietok-vynnykivskyi', 'nterest', 'pipeline-4'];

export default function ZhkPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const project = findBySlug(slug);  // returns full-internal only

  if (project) return <EtnoDimTemplate project={project} />;

  // Lakeview = cross-origin redirect
  const flagshipRecord = projects.find((p) => p.slug === slug && p.presentation === 'flagship-external');
  if (flagshipRecord) return <ExternalRedirect url={flagshipRecord.externalUrl!} />;

  // grid-only / aggregate slugs go back to /projects
  if (KNOWN_SLUGS.includes(slug)) return <Navigate to="/projects" replace />;

  // Unknown slug — render NotFound inline (route already matched, so * catch-all won't fire)
  return <NotFoundPage />;
}

function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => { window.location.assign(url); }, [url]);
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-24">
      <p className="text-base text-text-muted">Переходимо до ЖК Lakeview…</p>
    </section>
  );
}
```

### Pattern 4: PipelineGrid as data-source-agnostic component

**What:** Accepts `projects: Project[]` prop + reads `?stage` from `useSearchParams` to compute its own filtered view. Same component renders production data on `/projects` and fixtures on `/dev/grid`.

**Why:** D-40 explicitly mandates this composition. Consumer-side prop forwarding is the only thing that differs.

**Code shape:**
```tsx
interface PipelineGridProps {
  projects: Project[];  // production: pipelineGridProjects, /dev/grid: fixtures
  active: Stage | null; // 'Усі' = null
}
export function PipelineGrid({ projects, active }: PipelineGridProps) {
  // Filter by active stage; if null show all grid-eligible.
  const filtered = active == null
    ? projects.filter(p => p.presentation === 'full-internal' || p.presentation === 'grid-only')
    : projects.filter(p => p.stage === active && (p.presentation === 'full-internal' || p.presentation === 'grid-only'));

  if (active === 'buduetsya') return <BuduetsyaPointer />;
  if (active === 'zdano' && filtered.length === 0) return <EmptyStateZdano />;
  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {filtered.map((p) => <PipelineCard key={p.slug} project={p} />)}
    </div>
  );
}
```

**Note on D-08 «Будується»:** `pipelineGridProjects` does NOT include the flagship (it's filtered to `full-internal` + `grid-only`). When `active='buduetsya'`, `filtered.length === 0` because Lakeview is `flagship-external`. That's correct — D-08 wants the «Див. ЖК Lakeview вище ↑» pointer. But on `/dev/grid` with fixtures, fixture-07 is `buduetsya` + `grid-only` so the filter would actually have results. **The pointer is `/projects`-specific behavior.** Implementation: dispatch the buduetsya-empty-pointer only when the data source is the production array; on `/dev/grid` show the matching cards. This means `<PipelineGrid>` needs a `mode: 'production' | 'fixtures'` prop OR the pointer logic lives in `ProjectsPage` (renders `<BuduetsyaPointer>` instead of `<PipelineGrid>` when filtering buduetsya). **Recommendation: latter** — composition-level dispatch in the page, keep `PipelineGrid` as a pure data renderer.

### Pattern 5: Stage counts derived from full `projects[]`

**Why:** D-03 mandates counts span ALL projects (incl. flagship + Pipeline-4 aggregate). Counts must be honest and stable.

**Code:**
```tsx
import { projects } from '../data/projects';
import { STAGES } from '../lib/stages';

const counts = STAGES.reduce((acc, s) => {
  acc[s] = projects.filter(p => p.stage === s).length;
  return acc;
}, {} as Record<Stage, number>);
// Result: { 'u-rozrakhunku': 2, 'u-pogodzhenni': 2, 'buduetsya': 1, 'zdano': 0 }
```

This computation is module-level (constant per render), can live in `ProjectsPage` body or extracted to a memoized helper. For 5 records, no perf concern.

### Anti-patterns to avoid

- **Hardcoded `/renders/etno-dim/...` or `/construction/mar-2026/...` strings in JSX** — `check-brand.ts importBoundaries()` blocks builds (verified at `scripts/check-brand.ts` lines 161-166: `grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/`). Always pass via `<ResponsivePicture src="renders/...">`.
- **`loading="lazy"` on the `/projects` flagship aerial OR `/zhk/etno-dim` hero** — Pitfall 8 LCP regression. Both must be `loading="eager" fetchPriority="high"`.
- **`<img src={...}>` directly on construction photos** — bypasses `<ResponsivePicture>`'s AVIF/WebP/JPG fallback chain (Pitfall 9).
- **Springs / `transition-all`** — D-32 + Pitfall 3.
- **`cursor-pointer` on Maietok/NTEREST cards** — D-34 mandates `cursor-default` (they're not clickable).
- **Importing `projects.fixtures` from `pages/` or `components/sections/`** — only `DevGridPage` may import it; check-brand boundary rule at line 168-172 of `check-brand.ts` enforces. NB: the script greps `src/pages/` AND `src/components/`, so `DevGridPage` import IS caught — needs verification (see Open Question 1 below).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal dialog with focus trap | Custom modal w/ portals + focus management + Esc-handler + scroll-lock | Native `<dialog>` + `showModal()` | `showModal` is the spec — focus trap + Esc + top-layer baseline-supported; ~30KB+ saved vs react-modal/headless-ui |
| URL state ↔ filter sync | Custom hook with `window.location.hash` listeners | `useSearchParams()` from `react-router-dom` (already installed) | Works inside HashRouter; `setParams(..., { replace: true })` handles history correctly |
| Image format fallback | Custom `<img onError>` with format detection | `<picture><source type="image/avif"><source type="image/webp"><img src=fallback>` (already in `ResponsivePicture`) | Native browser MIME-type negotiation — no JS, no flash-of-broken-image (Pitfall 9) |
| Lazy-load offscreen images | IntersectionObserver custom hook | `<img loading="lazy">` (in `ResponsivePicture` already) | Browser implements optimal viewport heuristics (typically 1.25× viewport ahead in scroll direction); no library needed |
| Hover triple-effect | Motion variants + `whileHover` | Pure Tailwind `hover:scale-[1.02] hover:shadow-[...]` (D-33) | Zero JS overhead; CSS transitions hardware-accelerated |
| Reduced-motion respect | `useReducedMotion()` hook + conditional render | Tailwind `motion-reduce:hover:scale-100` prefix (D-35) | One class per surface; native CSS `@media (prefers-reduced-motion: reduce)` |
| Cyrillic-safe mailto subject | Custom URL builder | `encodeURIComponent(subject)` (already used in `ContactForm.tsx:31`) | Built-in; handles all UTF-8 |
| `<dl>/<dt>/<dd>` table styling | Custom Definition List component | Tailwind utilities directly on `<dl><dt><dd>` | Semantic HTML + utility classes; no abstraction needed |
| Slug-to-label mapping | Switch statement scattered across components | Single `src/lib/stages.ts` with typed map + fallback (D-11) | One source of truth; unknown-stage fallback documented |

**Key insight:** Phase 4 has zero "do I really need a library for this?" cases. Every modal/filter/lazy/hover/format-fallback need is platform-native. Resist scope creep.

## Common Pitfalls

### Pitfall 1: Lightbox `<dialog>` doesn't close cleanly on backdrop click

**What goes wrong:** Naive backdrop-click handler fires on every click inside the dialog (including on photo, captions, buttons).

**Why it happens:** Click events bubble. Without target check, every click registers as backdrop.

**How to avoid:** `onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}` — the click on backdrop targets the dialog element itself; clicks on inner content target inner elements. Verified pattern (also in MDN `<dialog>` docs).

**Warning signs:** Lightbox closes immediately on opening (because the click that opened it bubbles into dialog and triggers close); clicking «next» button closes the lightbox.

### Pitfall 2: `<picture><source>` srcset breaks AVIF lazy-load on `/construction-log`

**What goes wrong:** `loading="lazy"` works on the `<img>` element inside `<picture>`. Some older browser versions (Safari 14, Chrome <77) ignored the lazy attribute when used inside `<picture>` — but per CLAUDE.md target browsers ("last 2 versions Chrome/Safari/Firefox/Edge", as of 2026-04: Chrome 122-124, Safari 17.4-18, Firefox 124-126), all current browsers respect `<img loading="lazy">` inside `<picture>`. The `<source>` srcsets ARE eager — they're just resource hints, not loaders. The `<img>` element is the resource owner.

**Why it happens:** Confusion between `<source srcSet>` (browser picks one, doesn't fetch until `<img>` is needed) and `<link rel="preload" imagesrcset>` (browser fetches immediately).

**How to avoid:** Trust the `<ResponsivePicture loading="lazy">` default. Verify in DevTools Network panel — under-fold construction photos should NOT appear in Initial Load waterfall.

**Warning signs:** Initial page weight on `/construction-log` >2MB (LOG-01 budget); Network panel shows 50 image requests in waterfall before scroll.

### Pitfall 3: HashRouter + `?stage=` query string lost on browser back

**What goes wrong:** Click chip → URL becomes `/#/projects?stage=buduetsya` → click another chip with `setSearchParams(..., { replace: true })` → URL becomes `/#/projects?stage=zdano` → back button skips to last NON-replace URL (e.g., the home `/`). Filter history is "consumed" by replace.

**Why it happens:** `replace: true` is intentional per D-10 to avoid history bloat. But it means user can't browser-back through chip selections.

**How to avoid:** `replace: true` is the right call for this UX (chip clicks are not "navigation"). Document this as expected behavior. If user requests back-button-through-filter behavior in v2, swap to `replace: false`.

**Warning signs:** User testing reports «back button doesn't undo my filter».

### Pitfall 4: Construction photo aspect ratio mismatch causes CLS

**What goes wrong:** Photos are 1080×1346 (4:5 portrait, verified via `file public/construction/mar-2026/mar-01.jpg`). `<ResponsivePicture>`'s default `height = round(largestWidth * 9 / 16)` assumes 16:9 — wrong for these photos. At 640w that's 360px height; actual aspect needs ~800px height. Layout reserves wrong space → CLS as image loads.

**Why it happens:** `ResponsivePicture` defaults are tuned for architectural CGI (renders) which are 16:9. Construction photos are vertical phone shots.

**How to avoid:** Pass explicit `width={640} height={800}` (or proportional values) on construction-log thumbnails. CLS-safe. **This is the strongest argument for 3-col-at-1280 layout in D-22**: 4-col × 280px wide × 4:5 aspect ≈ 4 × 350px tall = uncomfortably tall row at 1280 viewport; 3-col × 380px × 4:5 ≈ 3 × 475px = clean 3:5 row composition.

**Warning signs:** Lighthouse CLS score below 0.1; photos «jump» as they load.

### Pitfall 5: ZhkPage `/zhk/lakeview` flickers white before redirect

**What goes wrong:** `useEffect(() => { window.location.assign(url) }, [])` runs AFTER React's first paint. User sees one frame of the redirect placeholder, then the URL change. On slow connections, the placeholder may show for 100-300ms.

**Why it happens:** React effects run post-paint by design. There's no synchronous-pre-paint redirect API.

**How to avoid:** Make the placeholder look intentional — render the cube + «Переходимо до ЖК Lakeview…» line in brand styling so a 200ms flash doesn't read as a glitch. Per D-19 / Claude's Discretion.

**Alternative considered:** `<a href={url} ref={a => a?.click()}>` — also runs post-paint, no advantage.

**Warning signs:** Client says «I see something flash before the Lakeview site loads».

### Pitfall 6: Stage filter chip count drift if `projects[]` reordered

**What goes wrong:** Adding ЖК #6 with `stage: 'buduetsya'` adds 1 to the «Будується» count. But if the chip-counts object is hard-coded `{ buduetsya: 1, ... }` instead of computed, count diverges from reality.

**Why it happens:** Tempting micro-optimization to hardcode the 4-tuple.

**How to avoid:** Always compute via `STAGES.reduce(...)` over the full `projects` array. Phase 2 D-04 derived-view discipline applies to counts too — this is just another derived view.

**Warning signs:** Count says «Будується (1)» but two cards visible after adding a record.

### Pitfall 7: Lightbox `dialog::backdrop` styling not applied

**What goes wrong:** `<dialog className="backdrop:bg-black/80">` uses Tailwind's `backdrop:` modifier (added in Tailwind 4.1+). If on older Tailwind, this is silently ignored. Since project is on Tailwind 4.2.4 (per package.json), this should work. **Verify during impl** by inspecting the rendered backdrop color.

**Why it happens:** Tailwind v4 introduced the `backdrop:` modifier; older v3 didn't have it.

**How to avoid:** Test the rendered backdrop. Fallback if needed: `<dialog>::backdrop` rule in `index.css` `@layer base`:
```css
dialog::backdrop { background-color: rgba(0, 0, 0, 0.8); }
```

**Warning signs:** Backdrop shows browser-default (semi-transparent gray) instead of the brand-black tone.

### Pitfall 8: Unknown `?stage=garbage` value crashes filter

**What goes wrong:** `params.get('stage') === 'garbage'`; without validation, code passes to `STAGES.includes(...)` (false) and to `LABELS['garbage']` (undefined), so chip labels become empty strings, counts undefined.

**Why it happens:** `useSearchParams` returns whatever string is in the URL, never typed.

**How to avoid:** Validate via `isStage()` type predicate in `lib/stages.ts` (Pattern 1 above). Default to `null` (= «Усі») on unknown values.

**Warning signs:** Visiting `/#/projects?stage=foo` shows empty page; no chips highlighted.

### Pitfall 9: Lightbox state leaks across month-groups on `/construction-log`

**What goes wrong:** Single page-level `useState({ photos, index })` shared across all 4 month groups. User clicks photo in March → `index = 3, photos = mar-photos`. User then clicks photo in February without closing lightbox → `index` stays at 3 but `photos` swap. Index 3 may be out-of-bounds in February (only 12 photos vs March's 15). Crash on `<img alt={photo.alt}>` with `photo === undefined`.

**Why it happens:** Lightbox state is one variable, not a per-group variable.

**How to avoid:** Lift lightbox state to ConstructionLogPage. State = `{ groupKey: string | null, index: number }`. When user clicks photo in a group, set `{ groupKey: 'mar-2026', index: i }`. Pass that group's `photos[]` to Lightbox. Prev/next stay within the group (D-26: `Math.min(photos.length-1, ...)` already handles bounds within the active group). **OR**: each `<MonthGroup>` owns its own lightbox state. Simpler. Choose this.

**Recommendation:** Per-month `useState` inside `<MonthGroup>` component. Lightbox is per-group; opening one closes others (only one `<dialog>` open at a time enforced by browser top-layer semantics). For `/zhk/etno-dim` gallery, single page-level state is fine (only one group).

**Warning signs:** Lightbox shows photo from wrong month; runtime error on next-button at month boundary.

### Pitfall 10: `optimize-images.mjs` D-29 widths edit breaks cached output

**What goes wrong:** Adding `1920` to construction widths means existing `_opt/` directories are missing the new width. On next build, `existsSync(outPath) && mtime >= srcMtime` skip-path fires for 640/960 (existing) but not 1920 (missing) — so 1920 gets generated. Idempotent. **Verified by reading `optimize-images.mjs` lines 50-56**: skip per-output-file basis. Good.

**Why it could fail:** If widths changed AND source mtime older than existing output, no re-encoding happens for the new width. Wait — that's wrong. The output for the new width DOESN'T EXIST, so `existsSync(outPath)` is false, so the `&&` short-circuits, condition is false, and we DO encode. Fine.

**How to avoid:** Confirm post-edit by `ls public/construction/*/_opt/ | grep 1920` after `npm run prebuild`. Should see 50 × 3 formats × 1 new width = 150 new files.

**Warning signs:** Lightbox loads a 960w photo when expecting 1920w; 1920w files missing from `_opt/`.

### Pitfall 11: `<dialog>` Esc-key prevention breaks during nav

**What goes wrong:** Some apps `e.preventDefault()` on Esc to handle close manually. `<dialog>` already handles Esc natively → fires `close` event → our listener calls `onClose()` → React state updates → React re-renders with `index=-1` → effect closes dialog (no-op, already closed). All fine.

**Why it could fail:** If we ALSO add a manual Esc keydown listener that does `e.preventDefault()`, we'd suppress native close. Don't do that.

**How to avoid:** Listen only to `←` and `→` in the keydown handler; let native Esc through.

**Warning signs:** Esc doesn't close lightbox; or Esc closes lightbox but state stays at `index >= 0` (stale).

## Runtime State Inventory

> Phase 4 is greenfield composition (new components + new routes); no rename/refactor/migration involved. **N/A — this section omitted per template.**

## Code Examples

### Source-grounded patterns from existing Phase 1-3 code

Phase 4 should mirror these patterns verbatim where applicable.

#### A. Mailto with cyrillic-safe subject (already in `ContactForm.tsx:28-31`)
```typescript
const MAIL_SUBJECT = 'Запит про ЖК Етно Дім';  // for ZhkCtaPair primary CTA
const href = `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
```

#### B. ResponsivePicture flagship-LCP signature (from `PortfolioOverview.tsx:59-69`)
```tsx
<ResponsivePicture
  src={`renders/${flagship.slug}/${flagship.renders[0]}`}
  alt={flagship.title}
  widths={[640, 1280, 1920]}
  sizes="(min-width: 1280px) 768px, 100vw"
  width={1280}
  height={720}
  loading="eager"
  fetchPriority="high"
  className="w-full h-auto rounded-lg"
/>
```

For `/zhk/etno-dim` hero, use:
```tsx
<ResponsivePicture
  src={`renders/${project.slug}/${project.renders[0]}`}
  alt={project.title}
  widths={[640, 1280, 1920]}
  sizes="100vw"
  width={1920}
  height={1080}
  loading="eager"
  fetchPriority="high"
  className="w-full h-auto"
/>
```

#### C. Pipeline card image (from `PortfolioOverview.tsx:93-100`) — extract verbatim into `<PipelineCard>`
```tsx
<ResponsivePicture
  src={`renders/${project.slug}/${project.renders[0]}`}
  alt={project.title}
  widths={[640, 1280]}
  sizes="(min-width: 1280px) 400px, 100vw"
  loading="lazy"
  className="w-full aspect-[4/3] object-cover"
/>
```

#### D. AggregateRow (from `PortfolioOverview.tsx:115-124`) — extract verbatim
```tsx
{aggregate && (
  <div className="mt-12 flex items-center gap-6 border-t border-bg-surface pt-12">
    <IsometricCube variant="single"
      stroke="#A7AFBC"
      opacity={0.4}
      className="h-12 w-12 flex-shrink-0"
    />
    <p className="text-base text-text">{aggregate.aggregateText}</p>
  </div>
)}
```

#### E. EmptyStateZdano (D-09) — new, mirrors AggregateRow pattern
```tsx
import { IsometricCube } from '../../brand/IsometricCube';
import { zdanoEmptyMessage } from '../../../content/projects';

export function EmptyStateZdano() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <IsometricCube
        variant="single"
        stroke="#A7AFBC"
        opacity={0.4}
        className="h-24 w-24"
      />
      <p className="text-base text-text-muted">{zdanoEmptyMessage}</p>
    </div>
  );
}
// content/projects.ts:
// export const zdanoEmptyMessage = 'Наразі жоден ЖК не здано';
```

#### F. ANI-03 hover triple-effect on a card (D-31..D-35)
```tsx
<article
  className="
    flex flex-col gap-4 bg-bg-surface
    transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
    hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]
    motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none
  "
>
  {/* image + body */}
</article>
```

For Maietok / NTEREST per D-34, add `cursor-default` instead of cursor-pointer.

#### G. ZhkPage redirect dispatch
See Pattern 3 above.

#### H. Per-month MonthGroup with lightbox (D-22, D-23, D-25..D-28)
```tsx
import { useState } from 'react';
import type { ConstructionMonth } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';
import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';

export function MonthGroup({ month }: { month: ConstructionMonth }) {
  const [index, setIndex] = useState(-1);

  const photos: LightboxPhoto[] = month.photos.map((p) => ({
    src: `construction/${month.key}/${p.file}`,
    alt: p.alt ?? '',
    caption: p.caption,
    label: month.label,
  }));

  return (
    <section className="py-16">
      <h2 className="mb-8 font-bold text-3xl text-text">
        {month.label} · {month.photos.length} фото
      </h2>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        {month.photos.map((p, i) => (
          <button
            key={p.file}
            type="button"
            onClick={() => setIndex(i)}
            className="
              relative overflow-hidden bg-bg-surface
              transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]
              motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none
            "
          >
            <ResponsivePicture
              src={`construction/${month.key}/${p.file}`}
              alt={p.alt ?? ''}
              widths={[640, 960]}
              sizes="(min-width: 1280px) 380px, 33vw"
              width={640}
              height={800}
              loading="lazy"
              className="w-full h-full object-cover aspect-[4/5]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(-1)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
```

#### I. Contact реквізити-block as `<dl>`
```tsx
import { email, socials } from '../../../content/company';
import { phone, address } from '../../../content/placeholders';
import { Send, MessageCircle, Globe } from 'lucide-react';

export function ContactDetails() {
  return (
    <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[120px_1fr] lg:gap-x-8">
      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">Email</dt>
      <dd className="text-base text-text">
        <a href={`mailto:${email}`} className="hover:text-accent">{email}</a>
      </dd>
      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">Телефон</dt>
      <dd className="text-base text-text">{phone}</dd>
      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">Адреса</dt>
      <dd className="text-base text-text">{address}</dd>
      <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">Соцмережі</dt>
      <dd className="flex gap-4">
        <a href={socials.telegram} aria-label="Telegram" className="text-text-muted hover:text-accent cursor-default">
          <Send size={20} aria-hidden="true" />
        </a>
        <a href={socials.instagram} aria-label="Instagram" className="text-text-muted hover:text-accent cursor-default">
          <MessageCircle size={20} aria-hidden="true" />
        </a>
        <a href={socials.facebook} aria-label="Facebook" className="text-text-muted hover:text-accent cursor-default">
          <Globe size={20} aria-hidden="true" />
        </a>
      </dd>
    </dl>
  );
}
```

WCAG note: `<dt>` muted is at `text-sm` (14px) which is the AA floor for `#A7AFBC` on `#2F3640` (5.3:1) — acceptable. At lg breakpoint we bump to `text-base` (16px) — clear AA. Per Pitfall 6.

## Per-Question Findings

### Q1. Native `<dialog>` lightbox keyboard contract

**Findings (HIGH confidence):**
- `dialog.showModal()` (NOT `dialog.show()`) is required for the modal mode that traps focus, applies inert to the rest of the document, and renders in the top-layer (covers everything). `show()` is non-modal.
- Esc auto-closes a modal `<dialog>` with no extra code. The browser fires the `close` event. Our `onClose` handler runs.
- Backdrop click: attach `onClick` to the `<dialog>` element. When the click target is the dialog itself (not inner content), the click was on the backdrop. Pattern: `if (e.target === dialogRef.current) onClose()`.
- Focus trap: `showModal()` provides automatic focus trapping; Tab cycles within dialog content.
- Body scroll lock: NOT automatic. We must do `document.body.style.overflow = 'hidden'` on open and restore on close (D-25 explicit).
- 200ms fade-in: use CSS `transition` on the `<dialog>` element with `&[open]` selector or Tailwind `data-[open]:opacity-100` + `[&:not([open])]:opacity-0` modifier. Simpler: rely on the @starting-style at-rule (Chrome 117+, Safari 17.5+, Firefox 129+) for animatable open. Fallback: instant open is brand-acceptable.

**Sources:** MDN `<dialog>` element page; HTML Living Standard `<dialog>` interface; verified against Chrome 124 / Safari 18 behavior in CLAUDE.md target browsers.

### Q2. `useSearchParams()` + HashRouter compat

**Findings (HIGH confidence):**
- `useSearchParams` is exported from `react-router-dom@7.14.0` (verified at `node_modules/react-router-dom/dist/index.d.mts:1` re-exports from `react-router/dom`).
- Inside HashRouter, the URL is `https://example.com/vugoda-website/#/projects?stage=buduetsya`. The hash fragment `/projects?stage=buduetsya` becomes the router's "location" — `pathname='/projects'`, `search='?stage=buduetsya'`.
- `useSearchParams()` parses `search` correctly: `params.get('stage') === 'buduetsya'`.
- `setSearchParams(next, { replace: true })` updates the hash without adding to history. Browser back goes to the previous non-replaced URL.

**Edge cases:**
- Empty params: `setSearchParams({}, { replace: true })` results in `/#/projects` (no `?` suffix). Confirmed via react-router source (`URLSearchParams` toString returns empty string for empty map).
- URL encoding: spaces in stage values impossible (we control the whitelist), no concern.

**Recommendation:** Use directly per Pattern 1. No HashRouter-specific workaround needed.

### Q3. Image LCP on two pages — preload pattern without `react-helmet`

**Findings (HIGH confidence based on Phase 3 03-04 implementation):**
- Phase 3 inserts a static `<link rel="preload" as="image" href={aerial-1920w-avif} fetchpriority="high">` directly in `index.html` for the home flagship LCP. That serves `/`.
- For `/projects`, the same flagship aerial is the LCP target. Since the same render is preloaded in `index.html`, `/projects` benefits from the existing preload (same URL, same cache hit).
- For `/zhk/etno-dim`, the LCP is `43615.jpg.webp` (different render). To preload per-route without `react-helmet`:
  - **Option A (recommended):** rely on `loading="eager" fetchPriority="high"` on the `<ResponsivePicture>` — modern browsers prioritize eager+high images even without `<link rel="preload">`. Lighthouse may report a 100-300ms LCP delta vs full preload, but Phase 6 will measure.
  - **Option B:** dynamic `<link rel="preload">` injection via `useEffect`:
    ```tsx
    useEffect(() => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.fetchPriority = 'high';
      link.href = `${BASE_URL}renders/etno-dim/_opt/43615.jpg-1920.avif`;
      link.type = 'image/avif';
      document.head.appendChild(link);
      return () => link.remove();
    }, []);
    ```
    Effect runs post-paint, so preload start is delayed by 1-2 frames. Marginal benefit on a fast network. **Probably skip for v1**; revisit in Phase 6 if Lighthouse LCP is below threshold.

**Size budget check:** `aerial.jpg-1920.avif` shipped at 388 KB (Phase 3 STATE.md noted as Phase 6 risk). For `/zhk/etno-dim` the hero will likely be similar (architectural CGI 1920w AVIF at quality=50 sharp params). The 1280w variant is the actually-loaded one on typical 1280-1440 desktop viewports per Phase 3 Decision (PortfolioOverview `sizes="(min-width: 1280px) 768px, 100vw"` already serves 1280w). For `/zhk/etno-dim` use full-width hero `sizes="100vw"` — this WILL pick the 1920w on 1920px viewports. Budget check at impl: `ls -la public/renders/etno-dim/_opt/43615.jpg-1920.avif` → likely 200-400 KB. If above 200 KB, Phase 6 may need encoder retune (deviation from Phase 3 D-19).

### Q4. Lazy-load + 50-photo budget on `/construction-log`

**Findings (HIGH confidence):**
- Sample math: 50 photos × 1080×1346 source × Sharp WebP q=75 at 640w → roughly 60-80 KB each (verified by `ls -la public/construction/mar-2026/_opt/` showing `mar-01-640.webp = 60 KB`). 50 × 70 KB = 3.5 MB if all eager. **Above 2 MB budget.**
- AVIF at 640w: `mar-01-640.avif = 43 KB`. 50 × 43 KB = 2.15 MB. Still slightly above.
- BUT: with `loading="lazy"`, only the photos in the initial viewport (~6-9 photos at 1280×800) load eagerly. 9 × 43 KB AVIF = 387 KB initial. Comfortable under 2MB.
- Browser intersection-observer threshold: per Chromium docs, `loading="lazy"` images load when within ~1.25 viewports of the scroll target. So scrolling triggers next-row loads ~600-800px before visibility. Acceptable for desktop scroll patterns.
- `<picture>` + `<img loading="lazy">` works in all current browsers (Chrome 77+, Safari 15.4+, Firefox 75+ — all within CLAUDE.md target).

**Recommendation:** Trust the default `loading="lazy"` on `<ResponsivePicture>`. Verify in Phase 6 with Lighthouse + DevTools waterfall.

### Q5. ANI-03 hover triple-effect tuning

**Findings (HIGH confidence for Tailwind v4 syntax):**
- Tailwind 4.2.4 supports arbitrary-value classes verbatim per D-33: `hover:scale-[1.02]`, `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`, `transition-[transform,box-shadow,background-color]`, `duration-200`, `ease-[cubic-bezier(0.22,1,0.36,1)]`. **All compile** in Tailwind 4.x. Verified by Tailwind docs and the project's Phase 3 patterns (e.g., `text-[clamp(80px,8vw,180px)]` in DevBrandPage.tsx:120).
- `motion-reduce:hover:scale-100` — Tailwind v4 `motion-reduce:` modifier emits `@media (prefers-reduced-motion: reduce)` wrapper. Stacks with other modifiers (`hover:`, `lg:`).
- Subpixel blur on `transform: scale(1.02)` with child `<picture>`: minimal at 1.02 (only 2% scaling). Most browsers' GPU compositor handles cleanly. Adding `transform: translateZ(0)` or `backface-visibility: hidden` forces layer promotion which is RECOMMENDED by Pitfall 16 to AVOID (`will-change: transform` overhead). **Don't add layer-promotion hints** — let the browser handle.
- The transition shorthand `transition-[transform,box-shadow,background-color]` correctly excludes other properties (per D-32 / Pitfall 3). NOT `transition-all`.

**Verified:** D-33 class string is correct verbatim. No need to add `will-change` or `translateZ(0)`.

**Hover triple values to commit:**
- scale: `1.02` (D-31 verbatim)
- box-shadow alpha: 0.15 (mid-band of 12-20% per D-31; visually subtle, not loud)
- box-shadow spread: 24px (mid-band of 16-24px)
- overlay-tint delta: from `bg-bg-black/10` to `bg-bg-black/0` (10% delta, visible without being theatrical)

### Q6. `<Navigate>` for same-origin + `window.location.assign` for cross-origin

**Findings (HIGH confidence):**
- `<Navigate to="..." replace />` from `react-router-dom` is the right tool for `/zhk/maietok-vynnykivskyi` → `/projects` and `/zhk/nterest` → `/projects`. Same-origin, no flicker (rendered as part of React tree).
- `window.location.assign(url)` is the right tool for `/zhk/lakeview` → `https://yaroslavpetrukha.github.io/Lakeview/`. Cross-origin, browser-level redirect.
- `useEffect(() => { window.location.assign(url); }, [url])` runs post-first-paint. User sees 1-2 frames of placeholder. Acceptable per D-19 with intentional placeholder content (cube + «Переходимо до ЖК Lakeview…»).
- **React 19 effect timing:** `useEffect` runs after commit, post-paint. No change from React 18. The redirect placeholder will visibly render for ~16-50ms on most connections.

**Recommendation:** See Pattern 3. Render branded placeholder. Don't try to skip the paint via `useLayoutEffect` (that runs synchronously post-DOM-mutation but pre-browser-paint — `window.location.assign` inside `useLayoutEffect` would still trigger after React's commit, similar timing in practice for navigation).

### Q7. `<dl>/<dt>/<dd>` semantic markup

**Findings (HIGH confidence):**
- Used on `/zhk/etno-dim` fact block AND `/contact` реквізити-block.
- Tailwind v4 styling without `@apply`: utility classes directly on `<dl>`, `<dt>`, `<dd>`. The `<dl>` becomes a CSS grid for label+value pairs:
  ```tsx
  <dl className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-8">
    <dt>Стадія</dt>
    <dd>{stageLabel(project.stage)}</dd>
    <dt>Локація</dt>
    <dd>{project.location ?? '—'}</dd>
  </dl>
  ```
- A11y: `<dt>` and `<dd>` have built-in label-value association per ARIA. Screen readers announce «term/definition» pairs.
- WCAG note (Pitfall 6): muted-color labels at small sizes fail. Use `text-base` (16px) on `<dt>` muted, OR `text-sm` (14px) which is AT the floor for `#A7AFBC` (14pt = ~18.66px; `text-sm` = 14px is technically below 14pt). **Recommendation: `text-base lg:text-base` minimum on muted `<dt>`. At lg use `text-sm` only if `font-medium` (which boosts contrast perception).**

### Q8. Stage filter URL state validation (already covered in Q2 + Pattern 1)

`?stage=garbage` → `isStage('garbage')` returns false → active = null → render «Усі» state. No throw, no crash. Per D-11 + D-42 fallback.

### Q9. Where to extract `<FlagshipCard>` from

**Findings (HIGH confidence — based on direct read of `src/components/sections/home/PortfolioOverview.tsx` lines 58-87):**

The flagship section in `PortfolioOverview` IS a clean self-contained block, ~30 lines including `<article>` wrapper. Lines 58-87:
- Outer `<article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">`
- `<ResponsivePicture>` for the aerial (uses `flagship.slug`, `flagship.renders[0]`, eager+high LCP target)
- Inner `<div>` with stage label, title, optional `facts.note`, external CTA `<a target="_blank" rel="noopener">`
- All content imports cleanly: `flagship` from data, `flagshipExternalCta` from content/home

**Extraction recommendation:** YES, extract to `src/components/sections/projects/FlagshipCard.tsx`. Both surfaces use IDENTICAL props and rendering (no badge variation, no loading-mode variation that I could find in the spec). Diff between home and `/projects`:
- Home: lives inside `<section>` with `<header>` (h2 «Проєкти» + subtitle). Renders flagship + grid + aggregate.
- `/projects`: lives below page-level `<h1>Проєкти</h1>` + subtitle + StageFilter.

The flagship article itself is byte-identical. Extraction is a clean DRY win. After extraction, `PortfolioOverview` imports `<FlagshipCard project={flagship} />` and `ProjectsPage` does the same.

**Implementation note:** `ResponsivePicture loading="eager" fetchPriority="high"` should be a prop on `<FlagshipCard>` so the home version can stay eager (it IS the page LCP) AND the `/projects` version stays eager (it's also that page's LCP per D-02).

```tsx
// src/components/sections/projects/FlagshipCard.tsx
interface Props { project: Project }
export function FlagshipCard({ project }: Props) { /* extracted JSX */ }
```

### Q10. `/zhk/etno-dim` 8-render gallery 4×2 layout

**Findings (HIGH confidence):**
- Etno Dim has 8 renders (verified in `data/projects.ts:52-61`). Aspect ratios: `43615.jpg.webp` through `43621.jpg.webp` are likely 16:9 architectural CGI (need to confirm at impl, but `_opt/` files exist and ResponsivePicture default 16:9 height calc applies). `61996.png.webp` is smaller (49 KB original), likely a different aspect (logo/detail shot?). Worth verifying during impl whether this 8th render needs different aspect handling.
- 4-col × 2-row grid at ≥1280: `lg:grid-cols-4 grid-rows-2 gap-6`. Each cell ~280-300px wide × 16:9 aspect = ~158-170px tall. Comfortable.
- 2-col × 4-row at 1024-1279: `md:grid-cols-2 grid-rows-4`.
- All `loading="lazy"` (gallery is below fold). Browser fires intersection observers in viewport order — first row loads on viewport entry, second row on scroll.

**Code sketch:**
```tsx
<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
  {project.renders.map((file, i) => (
    <button type="button" key={file} onClick={() => setIndex(i)} className={hoverClasses}>
      <ResponsivePicture
        src={`renders/${project.slug}/${file}`}
        alt={`${project.title} — рендер ${i + 1}`}
        widths={[640, 1280]}
        sizes="(min-width: 1280px) 320px, 50vw"
        loading="lazy"
        className="w-full aspect-video object-cover"
      />
    </button>
  ))}
</div>
```

### Q11. Construction-log photo grid columns

**Findings (HIGH confidence — verified via `file` command):**
- Sample photos: `public/construction/mar-2026/mar-01.jpg`, `mar-05.jpg`, `dec-01.jpg` are all **1080×1346** (4:5 aspect, portrait).
- Phone-camera typical orientation. Construction site photos taken handheld → portrait dominant.

**Layout decision:**
- 4-col at ≥1280px × 280px wide × 4:5 aspect = 4 × 350px tall = unbalanced row composition (very tall).
- 3-col at ≥1280px × 380px wide × 4:5 aspect = 3 × 475px tall = clean.
- Brand mood: «системний», structured. Even ratios > tight grid for portrait photos.

**Recommendation: 3-col at lg breakpoint** — overrides the D-22 «recommended 4-col» note. Grid:
```css
.month-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
```

CLS-safe sizing: pass explicit `width={640} height={800}` (4:5) on the construction `<ResponsivePicture>` calls. The `ResponsivePicture` default `height = round(largestWidth * 9 / 16)` would compute 360 for largestWidth=640 — wrong. Override per Pattern.

**Verified file existence in `_opt/`:** `mar-01-640.webp = 60 KB`, `mar-01-960.webp = 110 KB`, etc. Optimizer is producing the variants correctly.

### Q12. `<Lightbox>` reuse pattern

**Findings (HIGH confidence based on Pattern 2 spec):**
- State shape: `useState<{ groupKey: string | null; index: number }>` page-level OR per-group `useState<number>` in each `<MonthGroup>`.
- **Recommendation: per-group state.** Rationale:
  - 50 photos / 4 months = 4 groups. Each group manages its own group's lightbox.
  - Lightbox cycles within month per D-26 «`Math.min(photos.length-1, ...)` — so per-month groupings».
  - Browser top-layer guarantees only one `<dialog>` open at a time; opening one auto-closes any prior.
  - Per-group state = simpler code, no key/group dispatch logic.
- For `/zhk/etno-dim` gallery: single page-level `useState<number>(-1)` (only one group of 8 photos).

**Pattern (D-25..D-28 verbatim):**
```tsx
// MonthGroup or ZhkGallery
const [index, setIndex] = useState(-1);
const photos = month.photos.map((p) => ({
  src: `construction/${month.key}/${p.file}`,
  alt: p.alt ?? '',
  caption: p.caption,
  label: month.label,
}));
return (
  <>
    {/* thumbnails */}
    <Lightbox
      photos={photos}
      index={index}
      onClose={() => setIndex(-1)}
      onIndexChange={setIndex}
    />
  </>
);
```

### Q13. `/dev/grid` fixtures stress test composition

**Findings (HIGH confidence based on direct read of `data/projects.fixtures.ts`):**
- `fixtures[]` has 10 records: 3 u-rozrakhunku × (1 aggregate + 2 grid-only); 2 u-pogodzhenni × (1 full-internal + 1 grid-only); 2 buduetsya × (1 flagship-external + 1 grid-only); 3 zdano × (2 grid-only + 1 full-internal).
- Synthetic flagship is `fixture-06` (`presentation: 'flagship-external'`). External URL = `'https://example.com/fixture-flagship'`.
- `<DevGridPage>` composition mirrors `<ProjectsPage>` but feeds `fixtures` instead of `projects`:
  ```tsx
  // /dev/grid:
  // 1. Compute counts from fixtures
  // 2. Find synthetic flagship: fixtures.find(p => p.presentation === 'flagship-external')
  // 3. Render: <FlagshipCard project={syntheticFlagship} /> + <StageFilter counts /> + <PipelineGrid projects={fixtures.filter(p => p.presentation !== 'flagship-external')} active /> + <AggregateRow project={fixtures.find(p => p.presentation === 'aggregate')} />
  ```

**Component-level data-source-agnostic refactor:**
- `<PipelineGrid>` accepts `projects: Project[]` prop (already in Pattern 4).
- `<FlagshipCard>` accepts `project: Project` prop.
- `<AggregateRow>` accepts `project: Project | undefined` prop.
- `<StageFilter>` accepts `counts: Record<Stage, number>` prop.

All four components are pure renderers; ProjectsPage and DevGridPage compose them with different data sources. **Zero shared state.** Recommended.

**CHECK-BRAND BOUNDARY CONCERN:** `scripts/check-brand.ts:170-172` greps `src/pages/` AND `src/components/` for `projects.fixtures` imports. `DevGridPage` lives in `src/pages/` and MUST import fixtures. **This will trigger the boundary check fail.**

Reading the check more carefully:
```
grep -rnE 'projects\.fixtures' src/pages/ src/components/
```

This greps the whole `src/pages/` tree. `DevGridPage.tsx` will match. **Confirmed bug**: the check as written prevents the `/dev/grid` page from existing. See Open Question 1 below for resolution.

### Q14. Optimizer extension D-29 (one-line widths edit)

**Findings (HIGH confidence — verified by reading `scripts/optimize-images.mjs:84`):**

Current line 84:
```javascript
await processTree(join(PUBLIC, 'construction'), [640, 960]);
```

Edit to:
```javascript
await processTree(join(PUBLIC, 'construction'), [640, 960, 1920]);
```

Single-line change. Idempotency analysis (per `optimizeFile()` lines 41-57):
- Per-output-file mtime check: `if (existsSync(outPath) && statSync(outPath).mtimeMs >= srcMtime) continue`.
- Existing 640/960 outputs have same source mtime → skip path fires for them.
- New 1920 outputs: `existsSync(outPath)` is false → full encode runs.
- Sharp `withoutEnlargement: true` on `.resize({ width: 1920 })` means a 1080-wide source DOES NOT upscale to 1920 → output is 1080w. But we still encode at the requested width name `mar-01-1920.{avif,webp,jpg}`. Important: the lightbox `<ResponsivePicture widths={[1920]}>` will request `mar-01-1920.{avif,webp,jpg}` and get a 1080-wide image. That's correct behavior — we don't want to upscale phone photos beyond their native resolution.

**Net new files:** 50 photos × 3 formats (AVIF, WebP, JPG) = 150 new files in `public/construction/{month}/_opt/`.

**Build cost:** Sharp encoding 50 × 3 formats × 1 width on cold first run ≈ 15-30 seconds. Subsequent runs: skip path fires for existing outputs, so prebuild stays fast (~500ms).

**Bundle impact:** None. The `_opt/` files are static assets in `public/`; Vite copies verbatim, no JS bundle inclusion.

### Q15. Brand CI guard — paths and regex

**Findings (HIGH confidence — verified by reading `scripts/check-brand.ts:140-184`):**
- `importBoundaries()` checks 5 rules.
- Rule 4 (line 161-166): `grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/ --include='*.ts' --include='*.tsx'`
- **Both `/renders/` AND `/construction/` are grepped.** Confirmed.
- The grep is bounded to `src/components/`. `src/pages/` is NOT scanned by this rule. So a hardcoded `/renders/...` in `ProjectsPage.tsx` (in `src/pages/`) would pass — BUT pages should still go through `<ResponsivePicture>` per Phase 2 D-30 D-33 spirit. Phase 4 components (in `src/components/sections/`) MUST go through `<ResponsivePicture src="renders/...">` (no leading slash, no quotes around the renders/construction prefixes).

**Verified by reading existing code:** `PortfolioOverview.tsx:60` uses ``src={`renders/${flagship.slug}/${flagship.renders[0]}`}`` — backtick template, NOT a quoted string with `'/renders/...'`. Passes the grep.

**The grep regex `'/renders/|'/construction/|\"/renders/|\"/construction/`**:
- Matches `'/renders/...'` and `"/renders/..."` (single AND double quotes, leading slash).
- Does NOT match backtick templates ``` `${X}/renders/${Y}` ```.
- Does NOT match `'renders/...'` (no leading slash) — this is what `ResponsivePicture` accepts.
- **Confirmed safe pattern:** template literals `` `renders/${slug}/${file}` `` or string `'renders/etno-dim/...'` (no leading slash) — both pass the grep.

### Q16. Reduced-motion via Tailwind `motion-reduce:` prefix

**Findings (HIGH confidence):**
- Tailwind v4 supports `motion-reduce:` modifier (verified: this is the standard `@media (prefers-reduced-motion: reduce)` wrapper).
- Stacks with `hover:`: `motion-reduce:hover:scale-100`. Compiles to:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .motion-reduce\:hover\:scale-100:hover { transform: scale(1); }
  }
  ```
- Works with arbitrary-value classes: `motion-reduce:hover:shadow-none` is fine. `motion-reduce:hover:shadow-[none]` would also work but `shadow-none` is the standard utility.

**D-35 verbatim works:** `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`. Confirmed.

**Caveat:** `motion-reduce:` only handles the hover-end states; it doesn't disable the transition itself. If the user has reduced-motion AND hovers a card, the card snaps to `scale-100` (no animation). If they then unhover, it snaps back. For Phase 4 this is fine — no transition feels more correct than a 200ms ease-out for someone with motion sickness.

### Q17. Mailto with cyrillic subject

**Findings (HIGH confidence — pattern already in use):**
- `ContactForm.tsx:31` does `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`.
- `encodeURIComponent('Запит про ЖК Етно Дім')` = `'%D0%97%D0%B0%D0%BF%D0%B8%D1%82%20%D0%BF%D1%80%D0%BE%20%D0%96%D0%9A%20%D0%84%D1%82%D0%BD%D0%BE%20%D0%94%D1%96%D0%BC'`. Browser address bar shows this percent-encoded form when the link is interpreted; mail client decodes it back to «Запит про ЖК Етно Дім» correctly.
- Modern mail clients (Apple Mail, Gmail web, Outlook) all handle cyrillic mailto subjects via UTF-8 encoding. Verified by Phase 3 ContactForm shipping with `'Ініціювати діалог через сайт ВИГОДА'` and presumably tested.
- `&body=` would also be `encodeURIComponent`'d. Phase 4 D-18 mailto subject only — no body.

**Recommendation:** mirror the existing pattern verbatim:
```tsx
const MAIL_SUBJECT_ETNO_DIM = 'Запит про ЖК Етно Дім';
const href = `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT_ETNO_DIM)}`;
```

Subject literal lives in `src/content/zhk-etno-dim.ts` per D-29 content-boundary rule.

### Q18. Validation Architecture

See dedicated section below.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build pipeline (prebuild + tsc + vite + postbuild) | ✓ | (per .nvmrc, ^20.19) | — |
| Vite | dev/build | ✓ | 6.3.6 (verified `package.json`) | — |
| sharp | optimizer | ✓ | 0.34.5 | — |
| react-router-dom | routing + useSearchParams | ✓ | 7.14.0 | — |
| lucide-react | icons (X, ChevronLeft/Right, Send, MessageCircle, Globe) | ✓ | 1.11.0 | — |
| Native `<dialog>` element | Lightbox | ✓ | Browser API (Chrome 37+, Safari 15.4+, Firefox 98+) | — |
| Browser `loading="lazy"` | Construction-log lazy-load | ✓ | Browser API (all CLAUDE.md targets) | — |
| `useSearchParams` HashRouter compat | URL state | ✓ | Confirmed via re-export in `node_modules/react-router-dom/dist/index.d.mts` | — |
| Tailwind 4.2 `motion-reduce:` | ANI-03 reduced-motion | ✓ | 4.2.4 | — |
| Tailwind 4.2 arbitrary values | hover triple-effect classes | ✓ | 4.2.4 | — |
| Tailwind 4.2 `backdrop:` modifier | Lightbox backdrop styling | ✓ | 4.2.4 (added in 4.1) | Hand-write `dialog::backdrop {}` in index.css |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

Phase 4 has zero new dependencies. All build/runtime/browser surface area exists.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — STACK.md skips Vitest for MVP. Validation is `tsc --noEmit` + `check-brand.ts` (4 grep checks) + `vite build` + manual smoke test |
| Config file | `tsconfig.json`, `tsconfig.scripts.json` (existing) |
| Quick run command | `npm run lint` (= `tsc --noEmit`, exits 0 on success) |
| Full suite command | `npm run build` (chains prebuild → lint → vite build → postbuild check-brand 4/4) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HUB-01 | Stage filter renders 4 chips with counts spanning all projects | manual + grep | `grep -E "u-rozrakhunku\|u-pogodzhenni\|buduetsya\|zdano" src/lib/stages.ts && grep -E "STAGES" src/lib/stages.ts` | ❌ Wave 0 |
| HUB-01 | URL state `?stage=...` updates via setSearchParams replace | manual smoke | Visit `/#/projects?stage=zdano` → cube + line render; Visit `/#/projects?stage=garbage` → «Усі» state | manual |
| HUB-02 | FlagshipCard renders Lakeview aerial as LCP target with eager+high | grep | `grep -E "loading=\"eager\"\|fetchPriority=\"high\"" src/components/sections/projects/FlagshipCard.tsx` | ❌ Wave 0 |
| HUB-03 | 3-card pipeline grid renders with stage labels | manual + grep | `grep -E "stageLabel" src/components/sections/projects/PipelineCard.tsx` (consumes `project.stageLabel` directly) | ❌ Wave 0 |
| HUB-04 | Aggregate row + cube marker rendered when not filtered out | grep | `grep -E "IsometricCube variant=\"single\"" src/components/sections/projects/AggregateRow.tsx` | ❌ Wave 0 |
| ZHK-01 | `/zhk/etno-dim` renders full template; redirect for other slugs | manual | Visit `/#/zhk/etno-dim`, `/#/zhk/lakeview`, `/#/zhk/maietok-vynnykivskyi`, `/#/zhk/foo` → expected dispatch | manual |
| LOG-01 | 50 photos in 4 month groups, lazy-load, native `<dialog>` lightbox | manual + grep | `grep -rE "<dialog\|showModal" src/components/ui/Lightbox.tsx` | ❌ Wave 0 |
| LOG-02 | `<picture>` AVIF/WebP/JPG via `<ResponsivePicture>` (already shipped) | grep | `grep -E "type=\"image/avif\"" src/components/ui/ResponsivePicture.tsx` (existing — unchanged) | ✅ |
| CTC-01 | Mailto active, phone/address `—`, socials `href="#"` | grep | `grep "mailto:\${email}\|cursor-default" src/components/sections/contact/ContactDetails.tsx` | ❌ Wave 0 |
| ANI-03 | hover:scale-[1.02] hover:shadow + motion-reduce + transition (no all/spring) | grep | `grep -rE "transition-\\[transform" src/components/sections/` AND `! grep -rE "transition-all\|spring" src/components/sections/` | ❌ Wave 0 |
| Build pipeline | All checks pass on phase end | `npm run build` exit 0 | (full chain) | ✅ |
| Brand invariants | denylistTerms / paletteWhitelist / placeholderTokens / importBoundaries | `npm run postbuild` (or as part of build) | (existing script) | ✅ |
| Bundle budget | ≤200 KB gzipped JS | manual: `vite build` reports gzip; eyeball | manual |

### Sampling Rate

- **Per task commit:** `npm run lint` (`tsc --noEmit`, ~2-3 sec on this codebase).
- **Per wave merge:** `npm run build` (full pipeline including `prebuild` optimizer + check-brand). ~30 sec cold, ~5 sec warm.
- **Phase gate:** `npm run build` green + manual smoke test of all 5 production routes (HomePage `/`, `/projects`, `/projects?stage=zdano`, `/zhk/etno-dim`, `/zhk/lakeview` redirect, `/zhk/maietok-vynnykivskyi` redirect, `/zhk/garbage` 404, `/construction-log`, `/contact`, `/dev/brand`, `/dev/grid`) before `/gsd:verify-work`.

### Wave 0 Gaps

Phase 4 has no pre-existing test infrastructure to extend (Vitest not installed, STACK.md says skip). Validation is `tsc --noEmit` + grep + manual smoke. **Wave 0 deliverables for Phase 4 are NOT new test files** — they're the source files themselves with grep-friendly content (signature class strings + element types).

If future phases want automated validation, the spike would be: install `vitest` + `@testing-library/react` + `jsdom`, write smoke spec asserting routes mount + DOM presence of key elements. ~30 min setup. **Recommend deferring to Phase 7 (post-deploy QA)** if at all — STACK.md says skip for MVP.

**Manual validation checklist for Phase 4 phase gate:**

- [ ] `/#/projects` — flagship visible above filter; chips show «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)»; PipelineGrid shows 3 cards by default; AggregateRow visible
- [ ] `/#/projects?stage=u-rozrakhunku` — only Маєток grid card; AggregateRow visible
- [ ] `/#/projects?stage=u-pogodzhenni` — Етно Дім + NTEREST grid cards; AggregateRow hidden
- [ ] `/#/projects?stage=buduetsya` — empty grid + «Див. ЖК Lakeview вище ↑» pointer; AggregateRow hidden
- [ ] `/#/projects?stage=zdano` — single cube empty-state + «Наразі жоден ЖК не здано»; AggregateRow hidden
- [ ] `/#/projects?stage=garbage` — defaults to «Усі» (no chip active, default content)
- [ ] Click chip — URL updates with `replace`; back button does NOT undo chip selection
- [ ] `/#/zhk/etno-dim` — hero render + fact block + whatsHappening + 8-render gallery + CTA pair
- [ ] Click any gallery photo → lightbox opens with 1920w; ←/→ cycles within bounds; Esc closes; click backdrop closes
- [ ] `/#/zhk/lakeview` — placeholder line then redirect to https://yaroslavpetrukha.github.io/Lakeview/
- [ ] `/#/zhk/maietok-vynnykivskyi`, `/#/zhk/nterest`, `/#/zhk/pipeline-4` — redirect to `/projects`
- [ ] `/#/zhk/garbage-slug` — NotFound H1 «404 — сторінку не знайдено»
- [ ] `/#/construction-log` — 4 month headers (Бер 2026 · 15 фото / Лют 2026 · 12 фото / Січ 2026 · 11 фото / Грудень 2025 · 12 фото); each month a 3-col grid of 4:5 thumbnails; lazy-load triggers on scroll; click → lightbox; ←/→ cycles within month
- [ ] `/#/contact` — H1 + subtitle + реквізити-block (4 rows: Email mailto, Телефон —, Адреса —, Соц icons #) + mailto CTA button
- [ ] Hover on any pipeline card / flagship / construction thumbnail / zhk gallery thumbnail — scale-1.02 + accent glow visible; matches D-31 spec
- [ ] System reduced-motion ON (Settings → Display → Reduce Motion) — hover effects suppressed (no scale, no shadow)
- [ ] `/#/dev/grid` — fixtures version of `/projects` renders without runtime crash; 10 cards visible across stages; chip counts reflect fixtures
- [ ] Tab through entire `/zhk/etno-dim` page — focus rings visible everywhere on `:focus-visible`; lightbox traps focus when open
- [ ] `npm run build` — exits 0; bundle size in vite report unchanged or within 30% of Phase 3 baseline (131.60 kB gzipped)
- [ ] `npm run postbuild` — check-brand 4/4 PASS

## Risks & Open Questions

### Open Question 1 (BLOCKER for /dev/grid): `check-brand.ts` import-boundary rule blocks `DevGridPage` from importing `projects.fixtures`

**Detail:** `scripts/check-brand.ts:170-172` greps `src/pages/` AND `src/components/` for `projects.fixtures` imports:
```
grep -rnE 'projects\.fixtures' src/pages/ src/components/
```

`DevGridPage.tsx` MUST live in `src/pages/` (per `App.tsx` route registration pattern matching `DevBrandPage`). Importing `fixtures` from there will trigger the boundary check → exit 1 → build fails.

**Three resolution options:**

1. **Add `DevGridPage` exception to the grep** — modify `scripts/check-brand.ts` rule 4 to use a `--exclude=DevGridPage.tsx` flag or add `pages/DevGridPage` to an exception list.
2. **Move `DevGridPage` outside the gated tree** — put it in `src/dev/DevGridPage.tsx` and have App.tsx import from there. The check-brand rule scans `src/pages/` so anything outside is excluded.
3. **Re-export fixtures via a `dev/` data module** — create `src/dev/fixtures.ts` that re-exports from `src/data/projects.fixtures.ts`. The import statement in DevGridPage now references `'../dev/fixtures'`, not `'projects.fixtures'`. Boundary grep doesn't match because the literal string `projects.fixtures` doesn't appear in the page.

**Recommendation:** Option 1 (planner edits `scripts/check-brand.ts` to add `DevGridPage.tsx` to the rule exclusion). Cleanest. The boundary rule's intent is «never import fixtures into production code paths», not «never import them anywhere». `/dev/grid` is the explicit exception per Phase 2 D-09.

The plan should include a task: `chore(04-XX): scripts/check-brand.ts allow DevGridPage import of projects.fixtures`. Same dev-eyebrow-raise as `DevBrandPage` is already an exception in spirit (the brand-primitive surface).

**Verification path:** Read `scripts/check-brand.ts:140-184` — Rule 4 (`label: 'pages and components must not import projects.fixtures'`). Edit pattern to filter `src/pages/DevGridPage.tsx` (e.g., `grep ... | grep -v DevGridPage`). Document in plan checker.

### Open Question 2: `/zhk/lakeview` external redirect 1-frame placeholder may be Lighthouse penalty

**Detail:** Per Phase 6 QA-02, all 5 routes must Lighthouse ≥90. The redirect placeholder for `/zhk/lakeview` (a brief «Переходимо до ЖК Lakeview…» line + cube before `window.location.assign` runs) IS a route Lighthouse can audit. If Lighthouse runs against `/#/zhk/lakeview`, it'll measure the placeholder's LCP/FCP, which will be poor (no real content).

**Resolution:** Phase 6 may need to exclude `/zhk/lakeview` from Lighthouse audit (it's a 1-frame redirect, not a real route). Document in Phase 6 plan as a known false-positive. Phase 4 ships the redirect as-spec'd.

### Open Question 3: `<Lightbox>` opening transition (200ms fade-in)

**Detail:** Per D-28, soft 200ms fade-in is acceptable. Tailwind 4 + `<dialog>` opening via `showModal()` is INSTANT by default. Animating `<dialog>` open requires:
1. `@starting-style { dialog[open] { opacity: 0; transform: translateY(20px); } }` (Chrome 117+, Safari 17.5+, Firefox 129+)
2. + transitioning to `dialog[open] { opacity: 1; transform: translateY(0); }` with `transition: opacity 200ms ease-out`
3. + `transition-behavior: allow-discrete` for `display: none → block` transition

Browser support is recent (late 2024). All target browsers support it. **Recommendation: ship without animation in v1.** Adding `@starting-style` is +5 lines of CSS, low risk, but Phase 4's static-section principle says minimize. Phase 5 may add it as part of the broader animation system if a UX gap emerges. Document as Phase 5 candidate.

### Open Question 4: Subject literal location for ZHK mailto CTA

**Detail:** D-18 mailto subject = `Запит про ЖК Етно Дім`. Per Phase 3 D-29 content-boundary, this should live in `src/content/zhk-etno-dim.ts` (per CONTEXT D-18 explicit «CTA copy lives in `src/content/zhk-etno-dim.ts`»). New file.

**No conflict.** Just a planner reminder to create the new content module per the path: `src/content/zhk-etno-dim.ts` exporting `mailtoSubject`, `mailtoLabel`, `instagramLabel`.

### Open Question 5: `/dev/grid` flagship card's `external CTA target="_blank"` opens example.com

**Detail:** D-41: synthetic flagship's external URL = `'#'` or placeholder. Currently in `fixtures.ts:84` it's `'https://example.com/fixture-flagship'`. Visiting `/dev/grid` and clicking the synthetic flagship CTA opens `https://example.com/fixture-flagship` (404). Acceptable for QA?

**Recommendation:** Option (a) leave as-is (clicking the QA-only synthetic flagship CTA goes to a real domain that 404s — visibly a fixture, not confusable for a real link); option (b) override to `'#'` in `<DevGridPage>` before passing to `<FlagshipCard>`. Either works. Per D-41 «External URL may be `'#'` or a placeholder». Planner picks. Lean toward (a) — fixture file is the source of truth and already commits to the URL.

### Open Question 6: ConstructionLogPage scroll-position on lightbox close

**Detail:** User scrolls to month 3 (page-y=3000), clicks photo, lightbox opens (body scroll-locked), closes lightbox — does scroll position restore to 3000?

**Browser behavior:** `document.body.style.overflow = 'hidden'` doesn't lose scroll position. After restore, scroll-y stays at 3000. **Verified** by Phase 1 D-23-style scroll-restoration patterns. No action needed.

**Caveat:** If user scrolls within the lightbox's content (the dialog has its own scrollable region for tall photos at lower viewport heights), this is independent of body scroll. Browser handles correctly.

### Open Question 7: `aspect-[4/5]` Tailwind class compiles correctly?

**Detail:** Pattern H above uses `aspect-[4/5]` for construction thumbnail aspect ratio. Tailwind v4 supports arbitrary aspect values: `aspect-[4/5]` → `aspect-ratio: 4 / 5`. Verified by Tailwind v4 docs. No issue.

### Open Question 8: Optimizer 1920w sharp `withoutEnlargement` produces different output sizes per source

**Detail:** Construction sources are 1080×1346. With `width: 1920, withoutEnlargement: true`, Sharp returns 1080w (no upscale). The output filename is still `mar-01-1920.{avif,webp,jpg}` regardless of actual pixel width. The lightbox `<ResponsivePicture widths={[1920]}>` will request `mar-01-1920` and get a 1080-wide image displayed at 100vw — fine on a 1920px viewport (slight upscale by browser, but native AVIF decode is good quality).

**Action:** None. This is correct behavior; 1080w is the maximum useful resolution for these phone-camera photos.

## Recommended File Structure

### Files to create (new)

| Path | Purpose |
|------|---------|
| `src/lib/stages.ts` | `STAGES`, `stageLabel`, `isStage` helpers |
| `src/content/projects.ts` | Page H1 + subtitle + StageFilter empty-state + Будується pointer copy |
| `src/content/zhk-etno-dim.ts` | CTA labels + mailto subject + redirect-screen text |
| `src/content/contact.ts` | `/contact` subtitle + section labels (or extend `home.ts`) |
| `src/components/ui/Lightbox.tsx` | Native `<dialog>` controlled lightbox |
| `src/components/sections/projects/FlagshipCard.tsx` | Extracted from `PortfolioOverview` (consumes `project: Project` prop) |
| `src/components/sections/projects/StageFilter.tsx` | Chip row + URL-state read/write |
| `src/components/sections/projects/PipelineGrid.tsx` | Filtered grid wrapper |
| `src/components/sections/projects/PipelineCard.tsx` | Single grid card (may be inlined within PipelineGrid; planner picks) |
| `src/components/sections/projects/AggregateRow.tsx` | Cube + text (extracted from `PortfolioOverview` lines 115-124) |
| `src/components/sections/projects/EmptyStateZdano.tsx` | Single big cube + line (D-09) |
| `src/components/sections/projects/BuduetsyaPointer.tsx` | One-line «Див. ЖК Lakeview вище ↑» (D-08) |
| `src/components/sections/zhk/ZhkHero.tsx` | Full-width hero render (eager + high) |
| `src/components/sections/zhk/ZhkFactBlock.tsx` | `<dl>` stage label + location + etnoDimAddress |
| `src/components/sections/zhk/ZhkWhatsHappening.tsx` | Paragraph block |
| `src/components/sections/zhk/ZhkGallery.tsx` | 4×2 grid + lightbox state |
| `src/components/sections/zhk/ZhkCtaPair.tsx` | Primary mailto + secondary disabled-Instagram |
| `src/components/sections/construction-log/MonthGroup.tsx` | h2 + 3-col grid + lightbox per month |
| `src/components/sections/contact/ContactDetails.tsx` | `<dl>` реквізити-block (4 rows) |
| `src/pages/DevGridPage.tsx` | Hidden `/dev/grid` route, fixtures stress test |

### Files to replace (existing stub bodies)

| Path | Current state | New state |
|------|---------------|-----------|
| `src/pages/ProjectsPage.tsx` | Phase 1 stub (centered H1 + Mark) | Compose `<h1>` + subtitle + `<FlagshipCard>` + `<StageFilter>` + dispatched body |
| `src/pages/ZhkPage.tsx` | Phase 1 stub | `useParams` + dispatch (Pattern 3) |
| `src/pages/ConstructionLogPage.tsx` | Phase 1 stub | Map `constructionLog` → `<MonthGroup>` × 4 |
| `src/pages/ContactPage.tsx` | Phase 1 stub | `<h1>` + subtitle + `<ContactDetails>` + mailto CTA |

### Files to edit (one-line / small)

| Path | Edit |
|------|------|
| `src/App.tsx` | Add `import DevGridPage from './pages/DevGridPage';` + `<Route path="dev/grid" element={<DevGridPage />} />` (between `dev/brand` and `*`) |
| `scripts/optimize-images.mjs` | Line 84: `[640, 960]` → `[640, 960, 1920]` |
| `scripts/check-brand.ts` | Rule 4 importBoundaries: add `DevGridPage` exclusion to fixtures-import grep (Open Question 1 resolution) |
| `src/components/sections/home/PortfolioOverview.tsx` | Replace inline flagship JSX (lines 58-87) with `<FlagshipCard project={flagship} />` import; replace inline aggregate row (lines 115-124) with `<AggregateRow project={aggregate} />` import; **AND apply ANI-03 hover classes to the pipeline cards** (lines 91-111) |

### Files to NOT touch

- `src/components/brand/*` — brand primitives are inviolable per Phase 3 D-04. No edits.
- `src/components/ui/ResponsivePicture.tsx` — already supports `widths={[1920]}`, eager+high, lazy. No edits.
- `src/data/*` — Phase 2 surface stable. No edits.
- `src/content/{methodology,values,company,placeholders,home}.ts` — existing modules unchanged. New modules (`projects.ts`, `zhk-etno-dim.ts`, `contact.ts`) ship alongside.
- `src/components/layout/*` — Layout stable. No edits.
- `vite.config.ts`, `tsconfig.json`, `package.json` — stable.

## Sources

### Primary (HIGH confidence — code read directly this session)

- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` — D-01..D-42 verbatim; primary input for User Constraints section
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/REQUIREMENTS.md` — HUB-01..04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03 mapping verified to Phase 4
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/ROADMAP.md §Phase 4` — Success Criteria 1-6
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/STATE.md` — Phase 3 closure summary, bundle size baseline 131.60 kB gzipped, current_phase=4
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/research/ARCHITECTURE.md §3 Q2/Q4/Q5/Q6/Q7/Q8` — data shape, cube semantics, Motion patterns, AnimatePresence + Router (Phase 5), translit guarantees
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/research/PITFALLS.md §3,5,7,8,9,10,11,12,14` — easing consistency, focus visibility, /zhk/:slug catch-all, hero LCP, AVIF fallback, silent displacement, scale-to-N, placeholder leaks, mobile-fallback
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/research/STACK.md §What NOT to Use` — modal/carousel/helmet/RHF/zod prohibitions confirmed
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/phases/01-foundation-shell/01-CONTEXT.md` — Layout/Nav/Footer + HashRouter + page stubs in place
- `/Users/admin/Documents/Проєкти/vugoda-website/.planning/phases/02-data-layer-content/02-CONTEXT.md` — data/projects + fixtures + helpers + check-brand wired
- `/Users/admin/Documents/Проєкти/vugoda-website/CLAUDE.md` — desktop-first, GitHub Pages, brand rules
- `/Users/admin/Documents/Проєкти/vugoda-website/brand-system.md §1-4` — palette, typography, isometric language
- `/Users/admin/Documents/Проєкти/vugoda-website/src/App.tsx` — confirmed HashRouter pattern, dev/brand route precedent
- `/Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/PortfolioOverview.tsx` — flagship + pipeline + aggregate JSX surfaces (extraction targets)
- `/Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/ContactForm.tsx` — mailto + encodeURIComponent pattern (Phase 4 mirrors)
- `/Users/admin/Documents/Проєкти/vugoda-website/src/components/ui/ResponsivePicture.tsx` — confirmed prop signature, AVIF/WebP/JPG triple emission, 1920w pass-through
- `/Users/admin/Documents/Проєкти/vugoda-website/src/components/brand/IsometricCube.tsx` — variant=single signature for empty-state cube
- `/Users/admin/Documents/Проєкти/vugoda-website/src/data/projects.ts` — flagship/pipelineGridProjects/aggregateProjects/findBySlug derived views, etnoDim renders array, slugs locked
- `/Users/admin/Documents/Проєкти/vugoda-website/src/data/projects.fixtures.ts` — 10 fixture records, fixture-06 = synthetic flagship-external
- `/Users/admin/Documents/Проєкти/vugoda-website/src/data/construction.ts` — 4 months × N photos, latest-first order, alt defaults
- `/Users/admin/Documents/Проєкти/vugoda-website/src/data/types.ts` — Stage / Presentation / Project / ConstructionMonth / ConstructionPhoto types
- `/Users/admin/Documents/Проєкти/vugoda-website/src/lib/assetUrl.ts` — assetUrl/renderUrl/constructionUrl helpers (BASE_URL handling)
- `/Users/admin/Documents/Проєкти/vugoda-website/src/content/{company,placeholders,home}.ts` — email, socials, phone/address `—`, mailto patterns
- `/Users/admin/Documents/Проєкти/vugoda-website/src/index.css` — `@theme` palette + focus-visible global rule
- `/Users/admin/Documents/Проєкти/vugoda-website/src/components/layout/{Layout,Nav,Footer}.tsx` — chrome unchanged for Phase 4
- `/Users/admin/Documents/Проєкти/vugoda-website/scripts/optimize-images.mjs` — line 84 widths edit point verified
- `/Users/admin/Documents/Проєкти/vugoda-website/scripts/check-brand.ts` — 4 checks; rule 4 importBoundaries grep patterns verified
- `/Users/admin/Documents/Проєкти/vugoda-website/package.json` — pinned versions, build pipeline scripts
- `/Users/admin/Documents/Проєкти/vugoda-website/node_modules/react-router-dom/dist/index.d.mts` — confirmed `useSearchParams` re-export from `react-router`
- `/Users/admin/Documents/Проєкти/vugoda-website/public/construction/mar-2026/mar-01.jpg` (file inspection: 1080×1346, 4:5 portrait — verified via `file` command) — drives Q11 3-col-not-4-col recommendation
- `/Users/admin/Documents/Проєкти/vugoda-website/public/renders/etno-dim/` (8 files: 43615.jpg.webp through 43621.jpg.webp + 61996.png.webp — verified via `ls`) — drives Q10 gallery layout
- `/Users/admin/Documents/Проєкти/vugoda-website/public/renders/etno-dim/_opt/` (24 optimized files at 640/1280/1920 × AVIF/WebP/JPG — verified via `ls`) — confirms hero hero variants ready for Phase 4 consumption

### Secondary (MEDIUM confidence — pattern knowledge)

- MDN `<dialog>` element documentation — `showModal()`, `close` event, backdrop pattern
- Tailwind CSS v4.2 docs — `motion-reduce:`, `backdrop:`, arbitrary values
- React 19.2 effect timing — `useEffect` post-paint, `useLayoutEffect` pre-paint
- Lighthouse LCP heuristics — `loading="eager" fetchPriority="high"` baseline-supported by Chromium

### Tertiary (no LOW-confidence claims in this research)

None — every recommendation is grounded in either CONTEXT.md, source code, or platform spec. Open Questions section flags items that need planner-time decision (none of which are research gaps; they're judgment calls).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every dep already installed and version-pinned per `package.json`; no new deps for Phase 4
- Architecture: HIGH — every pattern grounded in either Phase 1-3 source code or browser spec
- Pitfalls: HIGH — Pitfalls 1-9 derived from spec edge cases or direct code inspection (e.g., 4:5 photo aspect ratio); Pitfall 10-11 from spec read of optimizer + dialog APIs
- Validation: HIGH — `tsc --noEmit` + `check-brand.ts` are existing infrastructure; manual smoke test list directly maps to D-01..D-42

**Research date:** 2026-04-25

**Valid until:** 30 days (stable static SPA stack; brand spec frozen; no upstream API churn anticipated). If Phase 4 planning extends past 2026-05-25, re-verify (1) react-router-dom v7.14 still latest, (2) browser baseline for `<dialog>` + `@starting-style` in CLAUDE.md targets, (3) Tailwind 4.2 still current.
