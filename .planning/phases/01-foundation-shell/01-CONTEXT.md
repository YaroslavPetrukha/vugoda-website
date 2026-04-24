# Phase 1: Foundation & Shell — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Brand-locked visual foundation + routing + empty shell, deploy-ready. Scope anchor: tokens, fonts, `<Layout>` (Nav + Footer), 5 route stubs, HashRouter, GH Actions workflow — and one live deploy at phase end. Everything downstream phases inherit. No data, no page content, no sections, no animations beyond focus/hover basics.

Explicit carry-ups from later phases into this phase (authorised during discussion):
- Minimal single-cube SVG for stub visuals (Phase 3 still owns the full 3-variant `IsometricCube` primitive — Phase 1 ships a throwaway/seed version)
- Live GitHub Pages deploy (Phase 6 still owns full DEP-01/02/OG/Lighthouse/perf-budget work — Phase 1 only proves the deploy plumbing)

</domain>

<decisions>
## Implementation Decisions

### Navigation

- **D-01:** Nav items are exactly four: `Logo` (→ `/`), `Проєкти`, `Хід будівництва`, `Контакт`. No v2 ghost-links (Про / Купівля / Інвесторам). Logo acts as home link; no separate text «Головна».
- **D-02:** Link order left→right: `Logo · Проєкти · Хід будівництва · Контакт`. Content-hierarchy order (Проєкти most important for portfolio demo, Хід будівництва as flagship proof, Контакт last).
- **D-03:** Active route indicator = 2px `#C1F33D` underline, 2–4px below text baseline. Invisible on inactive state, crisp on active. Doubles naturally with focus-visible treatment (same accent color).
- **D-04:** Nav position: sticky top, dark `#2F3640` background, full-width with inner max-width container. Per NAV-01.
- **D-05:** Logo asset = `brand-assets/logo/dark.svg` imported via `vite-plugin-svgr`'s `?react` query (per research STACK.md + PITFALLS.md anti-pattern 4). Never copy SVG paths into a component.

### Footer

- **D-06:** Footer structure = 3-column grid at ≥1280px. Column 1: mini-logo + `vygoda.sales@gmail.com` email + `© ${new Date().getFullYear()} ТОВ «БК ВИГОДА ГРУП»`. Column 2: repeat of nav links (Проєкти / Хід будівництва / Контакт). Column 3: legal block — `ТОВ «БК ВИГОДА ГРУП»`, `ЄДРПОУ 42016395`, `Ліцензія від 27.12.2019 (безстрокова)`.
- **D-07:** Dynamic `©` year via `new Date().getFullYear()` — no hard-coded year. Single line, legal name.
- **D-08:** Social placeholders present in Column 1 (or new micro-row): Telegram / Instagram / Facebook icons as `lucide-react` icons, each wrapped in `<a href="#">` with cursor-disabled styling — consistent with CTC-01 contact-page treatment. Labeled `aria-label` but non-functional.
- **D-09:** **No privacy-policy link** in footer for v1. Confirmed override: PROJECT.md Out of Scope hard-rule stands — `mailto:`-only v1 = zero data processing = no GDPR/UA-DPA trigger = dead privacy link is worse than its absence.

### Route Stubs

- **D-10:** All 5 routes (`/`, `/projects`, `/zhk/:slug`, `/construction-log`, `/contact`) render in Phase 1 with identical structure: centered H1 page-title in Montserrat 700 + minimal IsometricCube mark (`variant='single'`) below it. No lorem, no "coming soon", no dev-only banners.
- **D-11:** Page titles per route (Ukrainian, brandbook-consistent tone):
  - `/` → «ВИГОДА» (wordmark will replace in Phase 3; Phase 1 ships plain H1)
  - `/projects` → «Проєкти»
  - `/zhk/:slug` → «ЖК» (no slug resolution in Phase 1 — just the literal heading)
  - `/construction-log` → «Хід будівництва»
  - `/contact` → «Контакт»
- **D-12:** `/zhk/:slug` stub renders identically to other stubs — no `useParams()` echo, no `findBySlug()` logic. Phase 4 adds data-aware resolution + redirect logic for flagship-external / grid-only presentations.
- **D-13:** Catch-all route `<Route path="*" element={<NotFoundPage/>} />` inside `<Layout>` → page with H1 «404 — сторінку не знайдено» + link back to `/`. Nav + Footer still render. Handles `/#/zhk/unknown` class gracefully.
- **D-14:** Phase 1 ships a **minimal single-cube SVG** — either hand-authored ~30-line `<MinimalCube/>` component OR early draft of `<IsometricCube variant='single'/>` that Phase 3 then expands to full 3-variant + typed stroke prop. Decision between those two is Claude's Discretion in planning; outcome is the same: stubs have a cube.

### Deploy

- **D-15:** `.github/workflows/deploy.yml` committed in Phase 1 — uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`. Verbatim from `.planning/research/STACK.md` GitHub-Pages workflow block. NOT the `gh-pages` npm package.
- **D-16:** GitHub Pages enabled in repo settings during Phase 1; live deploy happens at Phase 1 end. Public URL: `https://yaroslavpetrukha.github.io/vugoda-website/` (or equivalent account). This proves `base: '/vugoda-website/'` + `.nojekyll` + HashRouter work on real Pages servers — removes Phase 6 risk.
- **D-17:** Public exposure OK — no WIP banner, no private-repo gate. Stubs-with-cubes look intentional; client briefed this is work-in-progress and seeing the shell is credibility-building, not embarrassing.
- **D-18:** Phase 6 (DEP-01/02) scope narrows: it still owns OG meta tags (QA-03), Lighthouse verification (QA-02), perf budget, mobile-fallback page (QA-01), and image pipeline — but the deploy workflow file itself ships in Phase 1.

### Tokens, Fonts, Accessibility (mechanical — locked by requirements)

- **D-19:** CSS tokens live in `src/index.css` via Tailwind v4 `@theme` directive. Six hex values exactly — `--color-bg: #2F3640`, `--color-bg-surface: #3D3B43`, `--color-bg-black: #020A0A`, `--color-accent: #C1F33D`, `--color-text: #F5F7FA`, `--color-text-muted: #A7AFBC`. No `:root` layer, no JS token module. Prototype's `#2a3038` does NOT propagate.
- **D-20:** Montserrat imported in `src/main.tsx` via `@fontsource/montserrat/cyrillic-400.css`, `.../cyrillic-500.css`, `.../cyrillic-700.css` — subset entry points only. Never import the package root.
- **D-21:** `:focus-visible` styling: global CSS rule on interactive elements — `outline: 2px solid #C1F33D; outline-offset: 2px; border-radius: 2px;`. Applies to `<a>`, `<button>`, `<input>`, `<summary>`, `[tabindex]`. Per success criteria #5.

### Router & Build Config

- **D-22:** `HashRouter` from `react-router-dom@^7.14` in `src/main.tsx`. No `basename` prop (HashRouter handles base-path via location hash). URLs resolve to `/#/projects`, `/#/zhk/etno-dim`, etc. Per DEP-03.
- **D-23:** `vite.config.ts`: `base: '/vugoda-website/'`. Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-plugin-svgr` (for brand SVG imports). `public/.nojekyll` empty file committed.
- **D-24:** `index.html` carries `<html lang="uk">`, page title `«ВИГОДА — Системний девелопмент»`, `<meta name="theme-color" content="#2F3640">`. Full OG/Twitter tags are Phase 6 scope.

### Claude's Discretion

- Exact CSS technique for the active-route underline (pseudo-element vs `border-bottom` vs absolute-positioned span).
- Single-cube SVG shape — can be a trimmed copy of `brand-assets/mark/mark.svg`, a hand-authored inline SVG, or a first draft of the full `<IsometricCube variant='single'>` primitive (Phase 3 will expand whatever ships).
- Layout container max-width: 1280 / 1440 / 1600 — pick one consistent value (the prototype uses `max-w-7xl` = 1280 which is a reasonable default) and use it uniformly in Nav + Footer + page main.
- Vertical rhythm / padding between Nav / main / Footer — use the `--spacing-rhythm-*` scale defined in index.css.
- Whether to include a `<ScrollToTop/>` helper that resets `window.scrollTo(0,0)` on `useLocation().pathname` change. Recommended yes for UX even though route transitions are Phase 5.
- `tsc --noEmit` wiring in the `lint` npm script + pre-commit (optional Husky) — can defer unless blocking.
- Whether to keep `lucide-react` at v1.x or the prototype's `0.546` — either works; v1.x is the current major per STACK.md.

### Folded Todos

_None — `gsd-tools todo match-phase 1` returned zero matches._

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (project-level, authoritative)
- `.planning/REQUIREMENTS.md` §Navigation & Layout — NAV-01 (fixed dark navbar + footer mandatory items: ТОВ name / ЄДРПОУ 42016395 / ліцензія 27.12.2019 / email)
- `.planning/REQUIREMENTS.md` §Visual System — VIS-01 (6-hex palette), VIS-02 (Montserrat cyrillic 400/500/700 via Fontsource)
- `.planning/REQUIREMENTS.md` §Deploy — DEP-03 (HashRouter + `base: '/vugoda-website/'` + `.nojekyll`)
- `.planning/REQUIREMENTS.md` §QA — QA-04 (CI denylist: palette-hex grep whitelist, Pictorial/Rubikon forbidden, `{{` / `TODO` forbidden in `dist/`)
- `.planning/ROADMAP.md` §"Phase 1: Foundation & Shell" — Success Criteria 1–5 (authoritative test surface)

### Project-level policy
- `.planning/PROJECT.md` §Constraints — palette/font/browser-support constraints
- `.planning/PROJECT.md` §Out of Scope — confirms: no privacy-policy link in v1, no mobile responsive, no CMS, no `@google/genai`/`express`/`dotenv`/`autoprefixer` (prototype leftovers)
- `.planning/PROJECT.md` §Key Decisions — HashRouter, Core-4 scope, Модель-Б stages

### Research artifacts
- `.planning/research/STACK.md` §"Recommended Stack" — pinned versions (Vite 6.3.6, React 19.2, TS 5.8.3, Tailwind 4.2.4, Motion 12.38, react-router-dom 7.14, @fontsource/montserrat 5.2.8)
- `.planning/research/STACK.md` §"Stack Patterns by Variant" → Router subsection — HashRouter decision + workflow shape
- `.planning/research/STACK.md` §"GitHub Pages Deploy — Workflow Shape" — verbatim `.github/workflows/deploy.yml` contents (copy into Phase 1)
- `.planning/research/STACK.md` §"What NOT to Use" — autoprefixer removal, no framer-motion (use `motion`), no react-helmet
- `.planning/research/ARCHITECTURE.md` §2 "Recommended Project Structure" — folder tree (only Phase 1 portions: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/components/layout/{Nav,Footer}.tsx`, `src/pages/*.tsx` stubs)
- `.planning/research/ARCHITECTURE.md` §3 Q3 — Tailwind v4 `@theme` block with full 6-hex map (verbatim target for `index.css`)
- `.planning/research/ARCHITECTURE.md` §3 Q4 — IsometricCube component shape (Phase 1 uses minimal single-variant version; Phase 3 expands)
- `.planning/research/ARCHITECTURE.md` §3 Q7 — page-transition pattern (Phase 5 owns `AnimatePresence`, but `<Layout>` + `<Outlet>` structure is Phase 1)
- `.planning/research/PITFALLS.md` §Pitfall 1 — silent palette drift; Phase 1 owns the prevention (delete Tailwind defaults, grep-based CI)
- `.planning/research/PITFALLS.md` §Pitfall 2 — GH Pages SPA 404 (HashRouter answers this; Phase 1 commits `.nojekyll`)
- `.planning/research/PITFALLS.md` §Pitfall 3 — easing/duration inconsistency (Phase 5 owns `motionVariants.ts`, but Phase 1 MUST NOT introduce ad-hoc inline `transition={{...}}` that Phase 5 later has to purge)

### Brand authority
- `brand-system.md` §3 — palette with measured WCAG contrast (10.5:1 for `#F5F7FA` on `#2F3640` AAA)
- `brand-system.md` §4 — typography scale (Montserrat, 3 weights)
- `brand-system.md` §5 — isometric-line params (stroke 0.5–1.5pt, opacity 5–60%, only 3 allowed stroke colors `#A7AFBC` / `#F5F7FA` / `#C1F33D`)
- `КОНЦЕПЦІЯ-САЙТУ.md` §4.1 — MVP sitemap (confirms 5 routes; v2 routes like `/about`, `/how-we-build`, `/buying`, `/investors` NOT in Phase 1 nav)
- `КОНЦЕПЦІЯ-САЙТУ.md` §10 — hard rules (closed palette, no team photos, silent-displacement applies only to Lakeview)

### Brand assets (authoritative SVG sources)
- `brand-assets/logo/dark.svg` — Nav logo (dark-background version), import via `vite-plugin-svgr` `?react`
- `brand-assets/logo/` — also has `black.svg`, `primary.svg` available for later phases
- `brand-assets/favicon/favicon-32.svg` — favicon source (Phase 1 wires it in `index.html`)
- `brand-assets/mark/mark.svg` — minimal 3-path cube-with-petals; candidate reference for the Phase 1 stub-cube

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from prototype `вигода-—-системний-девелопмент/`)

- **Stack parity**: prototype's `package.json` already lists Vite 6.2, React 19, Tailwind 4.1, Motion 12.23 — version targets in STACK.md are compatible bumps within same majors. Installation list can be lifted wholesale, minus the anti-list below.
- **Tailwind v4 `@theme` pattern**: `вигода-—-системний-девелопмент/src/index.css` demonstrates the directive but uses **wrong tokens** (`#2a3038`, `#1e2329`, `#000000`, `#c1f33d`, `#f5f7fa`, `#a7afbc`). Phase 1 rewrites with 6 canonical hexes (per D-19).
- **Motion `FadeIn` pattern**: `вигода-—-системний-девелопмент/src/App.tsx` shows a `<FadeIn>` wrapper using `whileInView` + `viewport={{ once: true, margin: "-50px" }}` — this is the template for Phase 5's `<RevealOnScroll>` (not Phase 1, but noted for continuity).
- **Prototype ships zero routing**: it's a single-page demo. Phase 1 is greenfield for router setup — no carry-over here.

### Anti-list — DO NOT copy from prototype

- `@google/genai`, `express`, `dotenv` (AI-backend leftovers from experimental prototype — Pages is static, no Node runtime)
- `autoprefixer` (Tailwind v4 handles prefixing; conflicts possible)
- Hard-coded token values (`#2a3038`, `#1e2329`) — replace with canonical 6
- `public/*.jpg` prototype images (stock photos of other buildings — CONCEPT Додаток C hard-rule forbidden)
- Inline `transition={{...}}` objects on motion components — Phase 5 centralises these; Phase 1 must not seed duplication
- `lucide-react@0.546` — bump to `^1.11.0` per STACK.md

### Established Patterns

- `@theme` is THE token system. No separate `:root` block. No JS token module. (ARCHITECTURE.md Q3)
- Brand-primitive components live in `src/components/brand/` (separate from `src/components/ui/`) to enforce inviolability via CODEOWNERS or PR review. Phase 1 seeds this folder with `<Logo/>` + minimal `<MinimalCube/>` or `<IsometricCube/>` stub.
- Logo via SVGR `?react` import — never copy SVG paths into a component (PITFALLS §Anti-Pattern 4).
- Layout boundary: `pages/` → `components/` → never reverse. Nav + Footer live in `components/layout/`, consumed by `App.tsx`'s `<Layout>` route wrapper.

### Integration Points (Phase 1 → later phases)

- `<Layout>` wraps `<Outlet/>` so every page auto-gets Nav + Footer — Phase 3 onward fills `<Outlet/>` with real page content.
- `src/index.css` `@theme` block is the only place downstream phases tweak tokens (never add tokens inside component files).
- `src/lib/assetUrl.ts` (a thin `(path) => import.meta.env.BASE_URL + path` helper) is a Phase 2 deliverable per ARCHITECTURE Q8 — but Phase 1 may seed it if needed for favicon / logo path construction.
- `AnimatePresence` wrapper around `<Outlet/>` is a Phase 5 deliverable — Phase 1 leaves a plain `<main><Outlet/></main>` so Phase 5 only needs to wrap, not rearchitect.
- Empty stub components (one per route) sit in `src/pages/*.tsx`. Phase 3 (Home) replaces `HomePage.tsx` with real content. Phase 4 replaces the other four.

</code_context>

<specifics>
## Specific Ideas

- Active route underline styling idea: echo the accent-as-highlight discipline from `brand-system.md` §3 — «Зелений — акцент, не основа». Underline only on active = accent used sparingly.
- Stub-cube centering: vertically midway between Nav bottom and Footer top (`min-height: calc(100vh - nav - footer)` main + `flex items-center justify-center`) so stubs feel intentional at 1920×1080, not cramped to the top.
- 404 page copy: «404 — сторінку не знайдено» + subline «Повернутись до головної» as a link. No error emoji, no "oops" — matches brand tone «стримано, без суперлативів».
- Footer legal block visual: use `#A7AFBC` muted text for the legal triplet (ТОВ / ЄДРПОУ / ліцензія) at ≥14pt body size (contrast 5.3:1 passes AA for that size class per `brand-system.md` §3 rule).
- Deploy commit message for Phase 1-end: `feat(deploy): publish Phase 1 shell to GitHub Pages` — not a release tag, not a version, just "Phase 1 shell live."

</specifics>

<deferred>
## Deferred Ideas

- **Layout max-width experimentation** — pick one value in Phase 1 (Claude's Discretion, defaults to `max-w-7xl`/1280px per prototype). Revisit at Phase 3 (Home hero) if 1280 feels cramped on 1920×1080 — but do not re-decide in Phase 1.
- **Page-level `<title>` updates** — setting `document.title` per route is trivial, but route-level `<title>` + canonical URL are Phase 6 SEO scope (QA-03). Phase 1 ships only the global `<title>` in `index.html`.
- **Font-preload optimization** — `<link rel="preload" as="font" href="...montserrat-cyrillic-700.woff2" crossorigin>` in `index.html` for LCP. Belongs in Phase 6 (perf). Phase 1 just imports the cyrillic CSS; Fontsource's default `font-display: swap` is enough to not block render.
- **Full `<IsometricCube variant>` with typed stroke prop** — Phase 3 owns this. Phase 1 ships a minimal subset (Claude's Discretion on whether to hand-author a separate `<MinimalCube/>` or seed `<IsometricCube variant='single'>` as a starter that Phase 3 then extends).
- **`AnimatePresence` route transitions** — Phase 5 (ANI-04). Phase 1 leaves a plain `<Outlet/>` without animation wrapping.
- **Reduced-motion hook + variants** — Phase 5 (ANI-02/04 honor). Phase 1 has no animations beyond CSS `:focus-visible` outlines and native browser defaults.
- **Page transitions / scroll reset** — a `useEffect` on `useLocation().pathname` that does `window.scrollTo(0,0)` is Claude's Discretion for Phase 1 (small enough to include; improves UX immediately) but not a gate — can also defer to Phase 5 alongside `AnimatePresence` wiring.
- **Hidden `/dev/brand` and `/dev/grid` QA routes** — Phase 3 (`/dev/brand` after brand primitives land) and Phase 4 (`/dev/grid` with fixtures). Not in Phase 1's 5-route stub set.
- **CI denylist scripts (QA-04)** — Phase 2 owns these (roadmap maps QA-04 to Phase 2). Phase 1's palette discipline is enforced manually + by code review; the grep-based CI guard lands in Phase 2.
- **Privacy-policy link** — explicitly rejected in Phase 1 per PROJECT.md Out of Scope. Returns in v2 INFR2-05 alongside analytics.

### Reviewed Todos (not folded)

_No pending todos matched this phase — subsection omitted._

</deferred>

---

*Phase: 01-foundation-shell*
*Context gathered: 2026-04-24*
