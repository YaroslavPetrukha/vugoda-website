---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 4
current_plan: Not started
status: planning
stopped_at: Completed 04-03-flagship-extract-PLAN.md
last_updated: "2026-04-25T19:08:17.076Z"
progress:
  total_phases: 7
  completed_phases: 3
  total_plans: 29
  completed_plans: 21
  percent: 72
---

# Project State: Vugoda Website

**Last updated:** 2026-04-25 — Plan 03-08 complete (compose-and-dev-route: HomePage 7-section composition + /dev/brand QA surface + route registration; **Phase 3 fully closed: 8/8 plans, all 10 requirements end-to-end, ready for verification**)
**Updated by:** /gsd:execute-phase orchestrator

## Project Reference

- **Project:** Vugoda Website — корпоративний сайт забудовника «ВИГОДА»
- **Core Value:** Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді (точна палітра, ізометричні куби, cinematic-анімації на Motion, чесне відображення портфеля 0-здано / 1-активно / 4-pipeline).
- **Domain:** Ukrainian real-estate developer corporate hub, static desktop-first React SPA on GitHub Pages
- **Current focus:** Phase 03 — brand-primitives-home-page

## Current Position

- **Current Phase:** 4
- **Current Plan:** Not started
- **Total Plans in Phase:** 8
- **Status:** Ready to plan
- **Stopped at:** Completed 04-03-flagship-extract-PLAN.md
- **Progress:** [███████░░░] 72%

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

### Plan 02-05 Decisions (2026-04-24)

- **Placeholder regex tightened to paired `\{\{[^}]*\}\}`** — bare `\{\{|\}\}` false-positives on minified output (318 `}}` in index-*.js from closed object literals + 18 `}}` in index-*.css from nested `@supports`/`@layer` blocks per typical Vite 6 build). Full-pair matching catches real Mustache-style `{{token}}` leaks without the minifier-artifact noise. Recorded in inline doc-block.
- **`src/data/projects.ts:18` comment rephrased (Rule 1 auto-fix)** — original comment literally named Pictorial/Rubikon while stating the rule forbidding their naming; self-reference violates D-25 regardless of script existence. New wording preserves meaning without triggering denylist.
- **`scripts/` quarantine** — check-brand scan scope is intentionally `dist/` + `src/` only (never `scripts/`). The script's own regex constants can therefore contain the forbidden literals without self-triggering. Doc-block records the coupling.
- **No ESLint (reaffirmed)** — 5 grep-based boundary rules run under the same aggregate-exit script as the 3 content checks. One tool, one exit code, one output stream. STACK.md "SKIP ESLint for MVP" + Plan 02-02 boundary-via-grep pattern both align.
- **D-28 double-coverage kept** — `postbuild` is the enforcing gate (runs on every `npm run build` locally + in CI); the `Check brand invariants` named step in deploy.yml re-runs the same script for PR log visibility. Overlapping safety nets by design.
- **`PALETTE_WHITELIST` in script mirrors `@theme` in src/index.css** — drift is only caught if BOTH are updated in lockstep. Inline doc-block notes the coupling; adding a 7th color requires editing both.

### Plan 03-01 Decisions (2026-04-25)

- **`AllowedStroke` type alias** for the 3-hex stroke literal union (instead of inlining `'#A7AFBC' | '#F5F7FA' | '#C1F33D'` on the `stroke?` prop). TypeScript constraint identical to inline form; alias improves readability and lets future brand primitives reuse the same constraint. Per plan `<action>` verbatim TSX.
- **D-03 hero opacity ceiling enforced INSIDE IsometricCube grid branch** (not just by call-site convention). When `variant='grid'`: `undefined → 0.15`, `explicit → Math.min(opacity, 0.2)`. Prevents accidental `<IsometricCube variant='grid' />` from washing the hero in 30% accent-overlay (the global default opacity for single/group). Contract is local to the component — reviewer can see the clamp in the file.
- **Grid variant DELEGATES to IsometricGridBG** (D-09 wrapper option, not duplicate hand-authored geometry). Single source of truth for grid SVG; no risk of duplicate `<defs><style>` blocks if multiple variant=grid instances ever land on the same page.
- **Mark uses URL-import (no `?react`)** per D-28, mirroring Logo.tsx D-27. Quick-task 260424-whr verified URL-imported SVGs land in `dist/assets/` as binary assets; svgr `?react` would inline the markup which is wrong for binary brand-asset references.
- **MinimalCube deleted in same atomic commit as IsometricCube introduction** (D-12). Pre-deletion grep confirmed zero call sites in `src/` — clean delete with no consumer touch. Geometry preserved verbatim in IsometricCube `variant='single'` (3 polygons, viewBox `0 0 100 100`).
- **Build pipeline green on first run:** lint → check-brand 4/4 → vite build → postbuild check-brand 4/4. Bundle 242.85 kB JS / 76.85 kB gzipped (well under 200KB-gzipped budget).

### Plan 03-03 Decisions (2026-04-25)

- **sharp@^0.34.5 + script-based image pipeline (Path A from STACK.md)** — Vite plugin path B (`vite-imagetools`) rejected for 70-image cold-start perf; sharp script keeps Vite untouched.
- **`scripts/optimize-images.mjs` is ESM `.mjs`, not `.ts`** (per D-20) — keeps `tsconfig.scripts.json` free of `@types/sharp`. Run with `node` (not `tsx`) — plain ESM, no TS surface, no transpile cost.
- **`fileURLToPath(new URL('..', import.meta.url))` repo-root pattern** reused from `scripts/copy-renders.ts` (Plan 02-03 D-precedent) — handles the Cyrillic «Проєкти» checkout path; `.pathname` would percent-encode and `existsSync` would fail.
- **Walker skips `_opt/` AND dotfiles** — prevents infinite recursion into output dirs and macOS `.DS_Store` noise. Same `.DS_Store`-filter precedent as Plan 02-03's `copy-renders.ts` `FILTER`.
- **Idempotency at script level only** (mtime stat per output triplet); chained `predev`/`prebuild` re-runs do full encode because Phase 2's `copy-renders.ts` is destructive (`rmSync` before copy). Standalone `node scripts/optimize-images.mjs` re-run = **337 ms** on 480 outputs (skip path active). Acceptable: heavy first-build cost paid once per CI run; local devs only re-encode when they touch `/renders/` or `/construction/`.
- **`<ResponsivePicture>` default `loading='lazy'` + caller-explicit `loading='eager' fetchPriority='high'`** for hero LCP (D-18 + Pitfall 11). Component never assumes hero usage; Wave 3 Hero/PortfolioOverview MUST opt in.
- **`<ResponsivePicture>` uses generic `assetUrl()` (not `renderUrl`/`constructionUrl`)** — receives an already-domain-qualified path like `'renders/lakeview/aerial.jpg'` and appends the `_opt/{base}-{w}.{fmt}` suffix via string template. Final URL identical to domain-helper composition.
- **Default `height = round(largestWidth * 9 / 16)`** assumes 16:9 architectural CGI — matches all current renders + construction photos. Caller can override `width`/`height` for non-16:9 sources.
- **Self-consistency fix on doc-block (Rule 1 auto-fix):** ResponsivePicture.tsx JSDoc initially contained the literal forbidden quoted-path substrings that `check-brand importBoundaries()` greps for. Rephrased to describe the policy without embedding the literals — same anti-pattern + same fix as Plan 02-04 (`placeholders.ts`/`values.ts`). Source must be self-consistent under its own CI rules.
- **Risk note for Phase 6:** `aerial-1920.avif` = 379 KB (above the 200KB Lighthouse hero budget at 1920 width). Encoder params are pinned by D-19 — not tuned. Phase 6 must use `sizes` attribute on `<ResponsivePicture>` to deliver the **1280-width AVIF (196 KB)** or **640-width AVIF (58 KB)** to typical 1280–1920 desktop viewports. The 1920 variant exists for high-DPI (2× DPR) edge cases. If QA-02 still fails, escalate to a Phase 6 encoder-tune deviation (would override D-19 — requires user sign-off).
- **First prebuild output:** 480 optimized files (180 in `public/renders/**/_opt/`, 300 in `public/construction/**/_opt/`); `aerial-1920.{avif,webp,jpg}` triplet present; `npm run build` exits 0 (prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).

### Plan 03-04 Decisions (2026-04-25)

- **Verbatim plan execution.** `src/components/sections/home/Hero.tsx` body matches Plan 03-04 `<action>` Step B character-for-character; substantive code byte-identical. Only the module-level doc-block was rephrased (see next bullet).
- **Doc-block self-consistency fix (Rule 3 — blocking):** the plan's verbatim TSX contained the literal string `NO inline transition={{}}` in a doc comment, but the plan's own `<verify>` automated check asserts `! grep -nE "transition=\{\{"` against the same file. Same self-consistency anti-pattern as Plans 02-04 (`placeholders.ts`/`values.ts` forbidden-lexicon docs) and 03-03 (`ResponsivePicture.tsx` render-tree literal docs). Resolution: rephrased the comment to `NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14)`. Documents the Phase 5 boundary as well as the original wording would have, without literally embedding the regex pattern the file's own grep gate forbids. Pattern to keep: source text must be self-consistent under its own CI/grep rules.
- **`useReducedMotion()` guard via outputRange swap, NOT conditional hook calls.** Recipe from 03-RESEARCH §A lines 263-268: `useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -120])`. The `useTransform` call itself is unconditional → React rule-of-hooks safe; only the output range is swapped at hook-call time. MotionValue identity stays stable across re-renders. Phase 5 ANI-04 deferred = full project-wide RM hook threading; Plan 03-04 ships the minimum viable form.
- **AVIF preload uses simple-form `href` (single 1920w URL), no `imagesrcset` / `imagesizes`** — per 03-RESEARCH §C lines 397-437 recommendation for desktop-first MVP. Avoids the imagesrcset-vs-href browser-quirk surface area; 1920w covers all desktop targets. `type="image/avif"` silently ignored by non-AVIF browsers (Pitfall 4 acceptable degraded path; `<picture>` JPG fallback handles them at render time). NO `crossorigin` attribute — same-origin Pages avoids Pitfall 5 double-fetch.
- **Section directory pattern established:** `src/components/sections/home/{SectionName}.tsx` is the home-page section directory (created in this plan; first member `Hero.tsx`). Plans 03-05 / 03-06 / 03-07 add siblings (`PortfolioOverview.tsx`, `ConstructionTeaser.tsx`, etc.) under same path. `HomePage.tsx` (Plan 03-08) composes them.
- **Hero ВИГОДА wordmark inline exception.** `<h1>` text «ВИГОДА» (6 Cyrillic chars) stays as JSX literal per D-02 — it IS the brand display moment, not editorial copy. Gasло (heroSlogan, 70+ chars) and CTA label (heroCta) come from `src/content/home.ts` per D-29 content boundary. The 40-char threshold + brand-display-moment carve-out is the documented edge of the content-boundary rule.
- **Build pipeline green on first run:** prebuild (copy-renders → optimize-images: skip-path active, 480 files mtime-checked) → `tsc --noEmit` clean → vite build 3.09 s → postbuild check-brand 4/4 PASS. Bundle 242.85 kB JS / 76.85 kB gzipped — within 200 KB-gzipped budget.

### Plan 03-05 Decisions (2026-04-25)

- **BrandEssence layout = 2×2 numbered (01–04)** per RESEARCH Open Question 1 recommendation. `brandValues` body strings are 150–200 chars; 4-in-row at ~280px column width was rejected as too dense. 2×2 at ~600px gives breathing room and echoes the brandbook §5 «3 ступені складності» numbered ladder. Numbered prefix derived from index via `String(i+1).padStart(2,'0')` — no `BrandValue` type edit required.
- **PortfolioOverview flagship = side-by-side (3fr/2fr) at lg breakpoint** per RESEARCH Open Question 8 + 03-CONTEXT.md §Specifics. Overlay variant rejected: dark-gradient masks on architectural CGI tend to murk the render. Image left 60%, text right 40% at ≥1280px container.
- **Flagship `sizes="(min-width: 1280px) 768px, 100vw"`** — at 1280-container width, 3fr/(3fr+2fr) ≈ 60% × 1280 ≈ 768px. The 1280w srcset entry (~196 KB AVIF) is the actual LCP target on typical desktop viewports; the 1920w (388 KB, exceeds Plan 03-03 risk budget) stays available for 2× DPR edge cases. Phase 6 Lighthouse verification consumes this hint to confirm browser picks the 1280w entry at standard resolution.
- **Explicit `width={1280} height={720}` on flagship ResponsivePicture (16:9)** — closes plan checker Blocker 4. Documents the AVIF/WebP/JPG triple's intrinsic-ratio contract; prevents CLS at hydration. Standard architectural CGI ratio matches the encoder pipeline output.
- **External CTA `target="_blank" rel="noopener"` (NOT `noreferrer`)** — preserves the `Referer` header so Lakeview's analytics can attribute cross-property traffic; `noopener` alone is sufficient to defeat the tabnabbing vector. Per D-14: we WANT cross-property referrer signal between vugoda-website and Lakeview.
- **Doc-block self-consistency fix (Rule 3 — blocking, 4th occurrence in codebase):** both files initially shipped doc-blocks containing literal substrings their own plan grep gates forbid. BrandEssence: `lucide-react` / `<IsometricCube>` (Test 10). PortfolioOverview: `Lakeview` / `Етно Дім` / `Маєток` / `NTEREST` (Test 15). Resolution: rephrased to describe policy without embedding regex-bait literals. Same precedent as Plans 02-04 (`placeholders.ts` / `values.ts`), 03-03 (`ResponsivePicture.tsx`), 03-04 (`Hero.tsx`). The recurring pattern across 4 plans is now a planner-template smell — future plans should pre-screen `<action>` doc-blocks against their own `<verify>` regexes before issuing.
- **Single-line `<IsometricCube variant="single"` opening tag (Rule 3 - blocking):** plan's verbatim `<action>` JSX showed multi-line attribute layout, but the plan's verify regex `<IsometricCube variant="single"` is single-line and returned 0 matches against multi-line layout. Resolution: moved `variant="single"` onto the opening tag line (`<IsometricCube variant="single"\n  stroke=…`). JSX-equivalent at runtime; readability cost negligible at 4 attributes.
- **Derived-view discipline preserved on 2nd surface:** PortfolioOverview imports `flagship` / `pipelineGridProjects` / `aggregateProjects` as named imports — zero `.filter(p => p.presentation === ...)` calls in component code. Confirms the ZHK-02 scale-to-N invariant (Phase 2 D-04): adding ЖК #6 = append one record with the right `presentation`, no component touch.
- **Content-boundary discipline extended:** heading + subtitle + external-CTA label all sourced from `src/content/home.ts` even though the external-CTA arrow ↗ is microcopy-eligible per D-20. Preference for one-edit propagation over inline tactical literals when the string carries content semantics. Matches Plan 03-04's exception treatment: brand display moments (wordmark) inline, everything else via content imports.
- **VIS-03 production debut for `variant='single'`:** first home consumer of the single-cube state-marker (D-16). Phase 4 will reuse the same variant for «Здано (0)» empty-state on `/projects` per cube-ladder D-10. Stroke `#A7AFBC` opacity 0.4 — within brandbook 5–60% band, on the muted side as a non-foreground signal.
- **LCP wiring end-to-end:** index.html AVIF preload (Plan 03-04) → flagship `<ResponsivePicture loading="eager" fetchPriority="high">` (this plan). HTML-parse-time fetch start, React-render-time `<picture>` consume. Phase 6 LCP test now exercisable via DevTools Network panel + Lighthouse LCP-element trace.
- **Build pipeline green:** `npm run lint` exits 0 after each task; `npm run build` exits 0 (full prebuild → tsc → vite → postbuild check-brand 4/4 PASS). Bundle 242.85 kB JS / 76.85 kB gzipped — unchanged from Plan 03-04 (no new imports, two pure-render components added). Within 200 KB-gzipped budget.

### Plan 03-06 Decisions (2026-04-25)

- **Native CSS scroll-snap over carousel libs (D-22 reaffirmed)** for ConstructionTeaser: container `flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4` + child `snap-start flex-shrink-0` with explicit `w-[320px] h-[200px]`. Zero swiper/embla/keen-slider footprint per CLAUDE.md What NOT to Use. Arrow buttons fire `scroller.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: 'smooth' })` via React `useRef<HTMLDivElement>`.
- **`SCROLL_STEP = 336` (320 card width + 16 gap)** as a module-level constant in ConstructionTeaser — single literal, easy retune. Arrow click moves exactly one card distance.
- **First production consumer of construction-sized ResponsivePicture variant set** (`widths=[640, 960]` `sizes="320px"` `loading="lazy"`) — validates Plan 03-03 D-19's two-width construction encoder branch end-to-end. Teaser sits below fold so lazy is correct (NOT eager — that's exclusively the LCP target's domain).
- **MethodologyTeaser `FEATURED_INDEXES = [1, 3, 7]`** per RESEARCH Open Question 2 recommendation — all `needsVerification: false`. Avoids foregrounding §8 blocks 2/5/6 on home (CONCEPT §11.5). Index 7 chosen over 4 for "soft inter-section flow" handoff to TrustBlock.
- **Defensive ⚠-marker conditional always rendered** in MethodologyTeaser — even though current `[1, 3, 7]` selection produces zero ⚠ at runtime. Conditional is cheap (one `&&` + nullable JSX) and survives future content swaps without component touch. Selection swap = single-line `FEATURED_INDEXES` const edit. ⚠ marker is a real DOM `<span>` with `aria-label={methodologyVerificationWarning}`, NOT string concat — preserves screenreader provenance.
- **`methodologyVerificationWarning` aria-label sourced from `src/content/home.ts`** (Plan 03-02) — D-29 content-boundary applied to short Cyrillic strings used in aria attributes. Closes plan-checker Warning 6. Pattern: any user-perceivable Cyrillic string in components (visible OR aria) goes through content layer.
- **Numbered prefix uses `block.index` directly (01/03/07)** — preserves §8 source structure visibly, signals home page is showing curated subset of a longer 7-block document. NOT consecutive 01/02/03 (which would erase the curation signal).
- **Section h2 inline carve-out reaffirmed:** «Хід будівництва Lakeview» (24 chars) and «Як ми будуємо» (13 chars) stay as JSX literals. Both under the 40-char content-boundary threshold + match Plan 03-04 (Hero «ВИГОДА»), Plan 03-05 (PortfolioOverview «Проєкти» imported from content but BrandEssence has no h2 at all). Body copy continues to be 100% from content modules.
- **Doc-block self-consistency fix on ConstructionTeaser.tsx (Rule 3 — blocking, 6th codebase occurrence):** plan's verbatim TSX shipped JSDoc literally containing `NO inline transition={{}}`, but the same plan's `<verify>` automated grep gate `! grep -nE "transition=\{\{"` runs against the same file. Same precedent as Plans 02-04, 03-03, 03-04, 03-05. Resolution: rephrased to `NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14)`. Recurring across 6 plans is now firmly a planner-template smell — future plans MUST pre-screen `<action>` doc-blocks against their own `<verify>` regex battery before issuing. MethodologyTeaser was clean on first write (no doc-block grep collision).
- **Build pipeline green:** `npm run lint` exits 0 after each task; `npm run build` exits 0 (full prebuild → tsc → vite → postbuild check-brand 4/4 PASS). Bundle **242.85 kB JS / 76.85 kB gzipped — unchanged** from Plan 03-05 (lucide-react ChevronLeft/Right already used by Footer; useRef and Link already in the import graph; tree-shaking preserves bundle stability). Within 200 KB-gzipped budget.

### Plan 03-07 Decisions (2026-04-25)

- **TrustBlock = 3-column horizontal table at lg breakpoint** (Юр. особа | Ліцензія | Контакт), inside `max-w-7xl px-6` on `bg-bg py-24`. Section H2 «Юридично та операційно» (24 chars) inline carve-out per D-29 short-structural-label rule. Each column: muted uppercase label (text-xs tracking-wider, label-pattern carve-out for `#A7AFBC`) + bold value (`text-text` AAA) + body-size caption (`text-text-muted` at `text-base` ≥14pt floor). Phase 1 Footer.tsx already shows the same 3 facts in column 3 — TrustBlock REPEATS them as the home-page higher-emphasis surface (HOME-06 mandate; Persona-3 bank-DD lands here from Google).
- **TrustBlock col 2/3 captions imported** (`licenseScopeNote`, `contactNote` from `src/content/home.ts`) — closes plan-checker Warning 7. Eliminates inline Ukrainian paragraphs >40 chars per Phase 3 D-29. Same content-boundary discipline as MethodologyTeaser's `methodologyVerificationWarning` aria-label (Plan 03-06 / Warning 6).
- **TrustBlock email = clickable `mailto:${email}` anchor** in col 3 (not just rendered text) — direct-action affordance, matches Footer pattern. Hover swap to `text-accent` (subtle, no underline-grow per brand-system §6 no-decorative-flourishes).
- **Defensive grep guards on TrustBlock** — file MUST NOT contain `<img>`, `команда`, `керівник`, `обличчя`, `портрет` (any of these trip the grep). Survives future inadvertent additions; HOME-06 hard-rule «no team photos / no portraits» enforced at the file level.
- **ContactForm = single mailto: anchor styled as button** (NO `<input>`, `<form>`, `<textarea>`, `<label>`) — PROJECT.md Out of Scope «mailto: достатньо для demo-handoff. Server endpoint = v2 INFR2-04». A fake form that only concatenates inputs into a mailto query string adds UI surface without real utility — D-29 rejects it.
- **ContactForm `MAIL_SUBJECT` module-top const** (`'Ініціювати діалог через сайт ВИГОДА'`), wrapped in `encodeURIComponent` at href construction — Cyrillic-safe browser address-bar parsing. URL-context value, single-purpose; one place to edit.
- **ContactForm bg-bg-black closer** (#020A0A) over bg-bg (#2F3640) — accent button on `#020A0A` is the brand's strongest contrast moment (8.85:1 AAA per brand-system §3), and the closer position warrants the maximum visual emphasis available in the closed palette. Visual button parity with Hero CTA (same Tailwind classes).
- **ContactForm heading + body imported** (`contactHeading`, `contactBody` from `src/content/home.ts`) — closes plan-checker Warning 8. Both strings carry U+2019 typographic apostrophes («об'єкт», «зобов'язань») per CONCEPT §2 tone discipline.
- **Doc-block self-consistency fixes on TrustBlock + ContactForm (Rule 3 — blocking, 7th + 8th codebase occurrence):** TrustBlock's verbatim plan TSX shipped a JSDoc literally containing «команда»/«керівник» policy descriptors that the file's own grep gate forbids. ContactForm's verbatim plan TSX shipped a JSDoc literally containing the email `vygoda.sales@gmail.com` that the file's own grep gate forbids (gate's intent: enforce email-via-import). Resolution: rephrased both doc-blocks to describe policy without embedding regex-bait literals. Same precedent as Plans 02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06. **Pattern is now confirmed across 8 plans — planner-template smell is real.** Future plans MUST pre-screen `<action>` doc-blocks against their own `<verify>` regex battery before issuing; recommended: planner-side automated check that greps proposed `<action>` text against proposed `<verify>` patterns and rejects collisions at plan time, not at executor time.
- **Wave 3 home-section sweep complete: 7/7 home sections shipped** (Hero · BrandEssence · PortfolioOverview · ConstructionTeaser · MethodologyTeaser · TrustBlock · ContactForm). Plan 03-08 (last in phase) composes them into `src/pages/HomePage.tsx` and registers `/dev/brand` QA route.
- **Build pipeline green:** `npm run lint` exits 0 after each task; `npm run build` exits 0 (full prebuild → tsc → vite → postbuild check-brand 4/4 PASS). Bundle **242.85 kB JS / 76.85 kB gzipped — unchanged** from Plan 03-06 (both new components are pure render, dependencies already in graph; tree-shaking preserves bundle stability). Within 200 KB-gzipped budget.

### Plan 03-08 Decisions (2026-04-25)

- **HomePage = React fragment composer** (no extra wrapper) — Layout.tsx already provides Nav + `<main>` + Footer; sections sit directly inside `<Outlet>`. D-17 order Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm. Default export preserved (App.tsx import unchanged).
- **DevBrandPage Wordmark sample uses `<span className="block">` not `<h1>`** — page-level H1 is `/dev/brand` (the route name); each demo section is `<h2>`. Using a second `<h1>` for the wordmark sample would break single-H1 a11y discipline. Visual contract preserved verbatim (`clamp(80px, 8vw, 180px)`); semantic element is the only change. Documented in 03-08-SUMMARY.md as Decision (Rule 1/Rule 2 grey-zone, leaning Rule 2 a11y correctness).
- **`/dev/brand` registered INSIDE the `<Route element={<Layout/>}>` block** — QA surface inherits Nav + Footer chrome. Acceptable per CONTEXT D-25 note; helps verify Nav primitive at multiple route contexts. If a future plan flags Nav should be hidden on /dev/brand, single-line edit moves the route outside the Layout wrapper.
- **Eager (non-lazy) DevBrandPage import** — ~5KB overhead per CONTEXT D-26 + RESEARCH §H; lazy + Suspense was rejected as premature complexity for a single QA route.
- **Pre-screen `<action>` doc-blocks against own `<verify>` regexes BEFORE writing** — applied successfully in 03-08; **zero Rule 3 self-consistency fixes needed**. First plan in Phase 3 with zero doc-block-grep collisions, breaking the 8-plan streak (02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2). The planner-template smell is mitigated executor-side this round; Phase 4 planner should still adopt pre-screen as standard procedure (`<action>` text greppy text vs `<verify>` regexes at plan time, not executor time).
- **Bundle 131.60 kB gzipped (was 76.85 kB unchanged across 03-04..03-07)** — NOT a regression. Sections were authored in 03-04..03-07 but no page imported them, so tree-shaking dropped them. HomePage composition in this plan brings them all into the reachable graph for the first time, plus motion's useScroll/useReducedMotion/useTransform/motion components, plus lucide-react ChevronLeft/Right, plus the IsometricGridBG svgr `?react` inline SVG. **131.60 kB gzipped = 65% of the 200 KB-gzipped Phase 6 budget**, leaving 35% headroom for Phase 4 (`/zhk/etno-dim`, `/projects` filter, `/construction-log`) + Phase 5 (motion variants library, AnimatePresence).
- **Phase 3 fully closed: 8/8 plans done, all 10 phase requirements (HOME-01..07 + VIS-03 + VIS-04 + ANI-01) end-to-end functional on running build.** All Phase 3 Roadmap Success Criteria #1-#5 achievable via direct URL navigation on `/` and `/#/dev/brand`. Manual visual QA at 1920×1080 deferred to Phase 7 client-handoff.

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

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260424-whr | verify Logo.tsx SVG lands in prod build | 2026-04-24 | 110c997 | [260424-whr-verify-logo-tsx-svg-lands-in-prod-build](./quick/260424-whr-verify-logo-tsx-svg-lands-in-prod-build/) |
| Phase 03 P01 | 3m 9s | 4 tasks | 5 files |
| Phase 03-brand-primitives-home-page P03 | 14min | 3 tasks | 4 files |
| Phase 03 P04 | 5min | 2 tasks | 2 files |
| Phase 03 P5 | 6min | 2 tasks | 2 files |
| Phase 03 P6 | 7min | 2 tasks | 2 files |
| Phase 03-brand-primitives-home-page P06 | 7min | 2 tasks | 2 files |
| Phase 03 P07 | 4m 39s | 2 tasks | 2 files |
| Phase 03 P8 | 6m 3s | 3 tasks | 3 files |
| Phase 04 P02 | 525619min | 1 tasks | 1 files |
| Phase 04 P02 | 8min | 1 tasks | 1 files |
| Phase 04 P01 | 430 | 4 tasks | 4 files |
| Phase 04 P03 | 17min | 3 tasks | 3 files |

### Todos / Blockers

- None blocking Phase 2 → Phase 3 transition
- **2026-04-24 — Quick task 260424-whr PASSED:** R17 mitigated; Logo.tsx URL-import bundles correctly (`dist/assets/dark-CqLEGef8.svg`, byte-identical 12 469 B). Phase 3 does NOT need asset move. Skeptic-pass gate A1 cleared.
- 02-01 complete: tsx@^4.21.0 installed; src/data/types.ts (7 types); src/lib/assetUrl.ts (3 helpers); tsconfig.scripts.json seeded
- 02-02 complete: src/data/projects.ts (5 records + 5 derived views); src/data/projects.fixtures.ts (10 synthetic records); CON-02 + ZHK-02 marked complete
- 02-03 complete: scripts/copy-renders.ts (translit + DS_Store filter); scripts/list-construction.ts (manual helper); src/data/construction.ts (4 months × N photos, 50 total); .gitignore added; package.json predev/prebuild/list:construction wired; CON-01 marked complete (co-owned with 02-04)
- 02-04 complete: src/content/{methodology,values,company,placeholders}.ts (content modules)
- **02-05 complete: scripts/check-brand.ts (4-check CI guard, 195 lines, 0 npm deps); package.json postbuild hook; deploy.yml "Check brand invariants" step; QA-04 marked complete**
- **Phase 2 complete — 5/5 plans done; all phase requirements (CON-01, CON-02, ZHK-02, QA-04) complete; ready for `/gsd:transition` to Phase 3**
- **03-01 complete: src/components/brand/IsometricGridBG.tsx (svgr ?react wrapper); IsometricCube.tsx (3-variant typed primitive with D-03 grid opacity clamp); Mark.tsx (URL-import wrapper); src/vite-env.d.ts (svgr/client TS reference); MinimalCube.tsx deleted (geometry preserved in IsometricCube variant=single); VIS-03 + VIS-04 partially closed**
- **03-03 complete: sharp@^0.34.5 installed; scripts/optimize-images.mjs (AVIF q50/effort4, WebP q75, JPG mozjpeg q80; widths [640,1280,1920] for renders + [640,960] for construction); chained predev/prebuild after copy-renders.ts; src/components/ui/ResponsivePicture.tsx (assetUrl-based srcset, AVIF→WebP→JPG fallback, no /renders/ literals — passes check-brand 4/4); 480 optimized files generated (180 renders + 300 construction); HOME-03 + HOME-04 partial (full closure when Hero/PortfolioOverview consume in Wave 3)**
- **03-04 complete: src/components/sections/home/Hero.tsx (~80 lines) — wordmark `<h1>` ВИГОДА + heroSlogan paragraph + heroCta `<Link to="/projects">` + parallax IsometricGridBG overlay (useScroll target=heroRef + useTransform [0,1]→[0,-120], linear, no spring); useReducedMotion() collapses outputRange to [0,0]; index.html AVIF aerial-1920 preload `<link>` above `<title>` (D-18); HOME-01 + ANI-01 closed; Phase 5 boundary preserved (no inline Motion transition objects); build pipeline 4/4 PASS**
- **03-05 complete: src/components/sections/home/BrandEssence.tsx (~43 lines, 2×2 grid of 4 numbered cards from brandValues) + PortfolioOverview.tsx (~128 lines, flagship side-by-side at lg with eager+high+w=1280 h=720 ResponsivePicture, 3-card pipeline grid lazy with aspect-[4/3], aggregate row with `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4}>`); HOME-02 + HOME-03 closed; first home consumer of VIS-03 single variant; LCP wiring end-to-end (index.html preload from 03-04 → flagship picture consume); 3 Rule 3 doc-block self-consistency fixes (4th codebase occurrence — pattern is a planner-template smell); build pipeline 4/4 PASS, bundle 242.85 kB JS / 76.85 kB gzipped (unchanged)**
- **03-06 complete: src/components/sections/home/ConstructionTeaser.tsx (~96 lines, native CSS scroll-snap strip of 5 photos from latestMonth().teaserPhotos via ResponsivePicture widths=[640,960] lazy; ChevronLeft/Right buttons fire scrollBy({left: ±336, behavior: 'smooth'}) via useRef; CTA Link to /construction-log with constructionTeaserCta) + MethodologyTeaser.tsx (~61 lines, filters methodologyBlocks to FEATURED_INDEXES=[1,3,7], renders 3-card grid with defensive ⚠-marker conditional `{block.needsVerification && <span aria-label={methodologyVerificationWarning}>⚠</span>}`); HOME-04 + HOME-05 closed; first production consumer of construction-sized ResponsivePicture two-width branch; 1 Rule 3 doc-block self-consistency fix (6th codebase occurrence — confirmed planner-template smell); build pipeline 4/4 PASS, bundle 242.85 kB JS / 76.85 kB gzipped (unchanged)**
- **03-07 complete: src/components/sections/home/TrustBlock.tsx (80 lines, 3-column horizontal table at lg breakpoint reading legalName/edrpou/licenseDate/licenseNote/email from content/company.ts + licenseScopeNote/contactNote captions from content/home.ts; clickable mailto:${email} in col 3; section H2 «Юридично та операційно»; defensive greps against `<img>` + portrait literals) + ContactForm.tsx (47 lines, single mailto: anchor on bg-bg-black closer with encodeURIComponent(MAIL_SUBJECT) for Cyrillic-safe href, NO `<input>`/`<form>`/`<textarea>`/`<label>`; heading + body + CTA imported from content/home.ts); HOME-06 + HOME-07 closed; 2 Rule 3 doc-block self-consistency fixes (7th + 8th codebase occurrence — pattern confirmed across 8 plans, planner-template smell); Wave 3 home-section sweep complete (7/7 sections shipped, ready for Plan 03-08 composition); build pipeline 4/4 PASS, bundle 242.85 kB JS / 76.85 kB gzipped (unchanged)**
- **03-08 complete: src/pages/HomePage.tsx REPLACED (Phase 1 placeholder removed) — fragment composer of 7 sections in canonical D-17 order (Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm); src/pages/DevBrandPage.tsx CREATED (184 lines — palette swatch grid + Montserrat 3×8 weight ladder + Logo at 2 sizes + Mark + Wordmark hero-scale + IsometricCube 3×3×2=18 matrix + IsometricGridBG @ 0.10/0.20); src/App.tsx adds DevBrandPage import + `<Route path="dev/brand">` above catch-all (inside Layout wrapper, NO NavLink per D-26); HOME-01..07 + VIS-03 + VIS-04 + ANI-01 all close end-to-end; ZERO Rule 3 doc-block self-consistency fixes (pre-screen pattern worked first try, breaking 8-plan streak); build pipeline 4/4 PASS, bundle 421.36 kB JS / 131.60 kB gzipped (sections finally reachable from entry — was 76.85 kB unreachable; 65% of 200 KB-gzipped Phase 6 budget)**
- **Phase 3 complete — 8/8 plans done; all 10 phase requirements (HOME-01..07, VIS-03, VIS-04, ANI-01) closed end-to-end; ready for `/gsd:transition` to Phase 4 (Portfolio, ЖК, Log, Contact)**
- **Phase 6 risk recorded:** `aerial-1920.avif` = 388.5 KB (above 200KB hero budget). Phase 6 must use `sizes` attribute on `<ResponsivePicture>` to deliver 1280-width AVIF (200.7 KB — at budget edge) or 640-width AVIF (58 KB) on typical desktop viewports. Encoder params pinned by D-19 — not tuned at Phase 3. Mitigation already wired in PortfolioOverview (`sizes="(min-width: 1280px) 768px, 100vw"`).
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
/gsd:transition
```

Phase 3 complete — 8/8 plans done (03-01 brand-primitives, 03-02 home-microcopy, 03-03 image-pipeline, 03-04 hero-section, 03-05 essence-portfolio, 03-06 construction-methodology, 03-07 trust-contact, 03-08 compose-and-dev-route). All 10 phase requirements (HOME-01..07, VIS-03, VIS-04, ANI-01) close end-to-end on running build. `/` renders the 7-section composed home page; `/#/dev/brand` exposes the hidden QA surface (palette + typography + cube matrix + grid backdrop). Bundle 131.60 kB gzipped — 65% of Phase 6 200 KB budget. Phase 4 (Portfolio, ЖК, Log, Contact) next: HUB-01..04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03 (9 requirements).

**If returning after context loss, read in order:**

1. `.planning/PROJECT.md` — what and why
2. `.planning/REQUIREMENTS.md` — 34 v1 REQ-IDs with phase mappings
3. `.planning/ROADMAP.md` — 7-phase structure with success criteria
4. `.planning/STATE.md` (this file) — current position
5. `.planning/research/ARCHITECTURE.md` — folder structure + data model (load before phase 1 planning)
6. `.planning/research/PITFALLS.md` — pitfall-to-phase map (load per phase as reference)

---
*Project memory evolves at phase transitions (via `/gsd:transition`) and milestone boundaries (via `/gsd:complete-milestone`).*
