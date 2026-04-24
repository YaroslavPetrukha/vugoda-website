# Stack Research

**Domain:** Static desktop-first React SPA (developer/real-estate corporate hub) deployed to GitHub Pages
**Researched:** 2026-04-24
**Confidence:** HIGH on core (Vite/React/Tailwind/Motion/Router/Fontsource/gh-pages) — all verified against npm registry on research date. MEDIUM on image-optimization path (multiple viable approaches; recommendation is opinionated). HIGH on testing posture (skip for MVP).

> **Scope framing.** Client pre-decided the foundation (Vite + React 19 + Tailwind v4 + Motion) and diverged from the concept doc's Next.js + Sanity + Vercel recommendation because the deliverable is **a static URL on GitHub Pages**. This document does NOT re-litigate that decision. It pins versions, fills the gaps (router, icons, fonts, images, deploy, testing), and marks what to explicitly NOT add.

---

## Recommended Stack

### Core Technologies

| Technology | Version (pin) | Purpose | Why Recommended |
|------------|---------------|---------|-----------------|
| **Node.js** | `^20.19 \|\| >=22.12` | Runtime for build/dev | Minimum required by Vite 6; `.nvmrc` = `20.19.0` keeps parity with existing prototype. Use 22 LTS if starting fresh. |
| **Vite** | `^6.3.6` (stay on 6) | Dev server + build | Prototype already on Vite 6.2.0. Vite 8 is latest but `@vitejs/plugin-react@6` now requires Rolldown + babel-plugin-react-compiler — **premature complexity for a 5-page MVP**. Stay on stable 6.x line. |
| **@vitejs/plugin-react** | `^5.2.0` | React Fast Refresh + JSX | Classic Babel path, works with Vite 6. Version 6 pins to Vite 8 + Rolldown and is not needed here. |
| **React** | `^19.2.0` | UI library | Prototype already on 19. React 19.2 is stable latest. |
| **React DOM** | `^19.2.0` | DOM renderer | Matches React; must be exact-minor-aligned. |
| **TypeScript** | `~5.8.3` | Type-check only (`tsc --noEmit`) | Matches prototype `~5.8.2`. TS 6 is latest but brings breaking changes; 5.8 is the current stable ecosystem consensus. Vite transpiles TS via esbuild — TypeScript is NOT in the runtime build path, so version drift risk is low. |
| **Tailwind CSS** | `^4.2.4` | Utility CSS + design tokens | v4 uses CSS-first `@theme` directive — ideal for the 6-color closed palette. Prototype on 4.1.14; safe to bump to 4.2.x (same major, additive changes). |
| **@tailwindcss/vite** | `^4.2.4` | Tailwind v4 Vite plugin | Required companion to Tailwind v4 with Vite. Peer-supports Vite `^5.2 \|\| ^6 \|\| ^7 \|\| ^8`. |
| **Motion** | `^12.38.0` | Animations (scroll, route transitions, parallax) | The framer-motion successor (same team, renamed package). Prototype on 12.23.24; safe to bump within v12. Supports React 19. |
| **react-router-dom** | `^7.14.0` | Client-side routing for 5 pages | v7 unified library-mode router (formerly Remix). Stable, peer-supports React ≥18. `HashRouter` or `BrowserRouter` + `basename` both work on Pages — see Stack Patterns below. |
| **@fontsource/montserrat** | `^5.2.8` | Self-hosted Montserrat | **Confirmed** (verified by unpacking 5.2.8): ships `cyrillic-400.css`, `cyrillic-500.css`, `cyrillic-700.css`, `cyrillic-ext-*` — full Ukrainian coverage. Subset `.css` files ship per weight, so you only import the three weights you need. |
| **lucide-react** | `^1.11.0` | Icon set | Prototype already uses 0.546 (old major). 1.x is current. Clean, minimal SVG icons consistent with the brand's line-based isometric language. Tree-shaken per-icon import. |

### Supporting Libraries (add only what you need)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **clsx** | `^2.1.1` | Conditional class concatenation | From page 3 onward when component variants appear. ~200 bytes. Do NOT use `classnames` (older, heavier). |
| **tailwind-merge** | `^2.6.0` | Deduplicate conflicting Tailwind classes | Only if you build shared button/card components with overridable className props. Skip for hand-written pages. |
| **@tanstack/react-virtual** | — | List virtualization | **SKIP.** 5 pages × ≤50 images ÷ 4 grouped months = no list long enough to need virtualization. Revisit if a gallery ever exceeds 500 items. |
| **react-intersection-observer** | — | Scroll reveal helpers | **SKIP.** Motion's `whileInView` handles scroll-triggered reveal natively. Adding IO observer is redundant with Motion 12. |
| **@fontsource-variable/montserrat** | `^5.2.8` | Variable-axis version | **Optional alternative.** Single file with all weights (~60KB woff2 cyrillic vs 3× ~20KB static). Use IF you discover you need in-between weights (e.g. 550 for hover). Static variant is smaller for "only 400/500/700" brand use — **prefer static for this project**. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **TypeScript** | Type-check via `tsc --noEmit` | Matches prototype `lint` script. No tsc emit; Vite handles build. |
| **GitHub Actions** (`actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3`) | Deploy built `dist/` to Pages | Native GitHub path. Do NOT use the `gh-pages` npm package for CI — it pushes to a `gh-pages` branch which is the older, clunkier pattern. `actions/deploy-pages` is the 2024+ standard with better OIDC, no branch mess. |
| **Prettier** (optional, `^3.3.x`) | Code formatting | Nice-to-have, not required for MVP. Skip if the team doesn't already use it. |
| **ESLint** (optional) | Linting | **SKIP for MVP.** `tsc --noEmit` covers the catastrophic bugs; a 5-page demo doesn't justify eslint config overhead. Add in v2 when the codebase has >20 components. |
| **sharp** (indirect via vite-imagetools or `scripts/optimize-images.mjs`) | WebP/AVIF encoding | See Image Optimization section. Node ≥20.3 required. |

---

## Installation

```bash
# Core runtime + framework
npm install react@^19.2.0 react-dom@^19.2.0 \
            react-router-dom@^7.14.0 \
            motion@^12.38.0 \
            lucide-react@^1.11.0 \
            @fontsource/montserrat@^5.2.8

# Build toolchain
npm install -D vite@^6.3.6 \
               @vitejs/plugin-react@^5.2.0 \
               tailwindcss@^4.2.4 \
               @tailwindcss/vite@^4.2.4 \
               typescript@~5.8.3 \
               @types/react@^19.2.0 \
               @types/react-dom@^19.2.0 \
               @types/node@^22.14.0

# Image pipeline (pick ONE — see section below; recommendation: path A)
# Path A (recommended, simple script):
npm install -D sharp@^0.34.5

# Path B (vite-imagetools URL-query API, needs Vite 7+ for v10):
# npm install -D vite-imagetools@^9.0.0 sharp@^0.34.5

# Conditional utilities (add when first needed):
# npm install clsx@^2.1.1
# npm install tailwind-merge@^2.6.0
```

**Total initial dependency surface:** 11 runtime + 8 dev = **19 packages**. Compare the "maximalist" version at the bottom (~32 packages). Fewer is faster to install, faster to audit, fewer CVE exposures, fewer "why did this break?" moments.

---

## Stack Patterns by Variant

### Router: `HashRouter` vs `BrowserRouter` on GitHub Pages

**The 404 problem.** GitHub Pages serves `index.html` only for the root request. A direct visit to `/vugoda-website/zhk/etno-dim` → 404, because Pages looks for `zhk/etno-dim/index.html` which doesn't exist.

Three mitigations exist. Pick by trade-off:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **`HashRouter`** — URLs become `/#/zhk/etno-dim` | Zero infra. Direct links and refresh always work. No `basename` gymnastics. | Ugly URL with `#`. Weaker for SEO/sharing. | **Ship this for MVP.** For a *demo* URL handed to a client, the hash is invisible after the first click. SEO/social sharing isn't a Core Value for a clickable-demo milestone. |
| **`BrowserRouter` + `basename="/vugoda-website"` + `public/404.html` SPA fallback** (the "spa-github-pages" trick by rafgraph) | Clean URLs. Direct links work via redirect trick. | Requires the 404.html redirect + a small `index.html` decoder script. Extra moving part that breaks subtly if the team forgets to copy 404.html. | Use when a v2 custom domain is added (moves to root path, less fragile). |
| **`BrowserRouter` + duplicate `index.html` as `404.html`** (the simplest BrowserRouter fix) | No decoder script. | Route state (query strings) lost on refresh — router re-parses on next tick, may flicker. | Middle-ground only if the team dislikes hash URLs. |

**Decision for this project:** **`HashRouter`** for v1. Write it into `DEP-03` constraint as an amendment: `base: '/vugoda-website/'` in `vite.config.ts`, `HashRouter` in `main.tsx`, no `basename` needed. Revisit to `BrowserRouter` if/when a custom domain is attached.

> **Rejected option.** `basename` prop on `BrowserRouter` alone, without a 404.html fallback, WILL break on direct-link visits. Do not ship `BrowserRouter` without the fallback.

### Fonts: `@fontsource/montserrat` static vs `@fontsource-variable/montserrat`

**Decision: static.**

- You need exactly 3 weights: 400 (Regular), 500 (Medium), 700 (Bold).
- Static ships **3 `.woff2` files × cyrillic subset ≈ 60-80 KB total** after subset-loading.
- Variable ships **1 `.woff2` ≈ 55-70 KB cyrillic** but forces loading ALL weights even if you use three.
- Bandwidth difference is noise on desktop ethernet. The tiebreaker: static gives you explicit control over `font-display: swap` per weight and lets you preload only the 700 (used for the wordmark hero) for LCP optimization.

**Import pattern** in `src/main.tsx`:
```ts
import '@fontsource/montserrat/cyrillic-400.css';
import '@fontsource/montserrat/cyrillic-500.css';
import '@fontsource/montserrat/cyrillic-700.css';
```
Do NOT import the package root (`@fontsource/montserrat`) — that pulls in the full Latin + every weight = ~300 files bundled. Import only the subset-weight CSS entry points you need.

### Image Pipeline for 71 source images

The project has 21 renders (JPG, likely 2–5 MB each) + 50 construction photos (JPG, mixed sizes) = ~70 source images. Target: WebP/AVIF at multiple widths with JPG fallback. Two paths:

**Path A — pre-build script with `sharp` (recommended).**
- Write `scripts/optimize-images.mjs` (≈60 lines): reads `src/assets/raw/**/*.{jpg,png}`, outputs `public/images/**/{name}-{width}.{webp,avif,jpg}` at widths [640, 1280, 1920].
- Run `npm run optimize` once per asset change, commit the outputs.
- Build stays fast (Vite doesn't touch 70 images on every rebuild).
- No Vite plugin, no build-time surprises.
- Pairs with a simple `<Picture>` component (hand-written, ~30 lines) that emits `<picture><source type="image/avif"><source type="image/webp"><img></picture>`.

**Path B — `vite-imagetools` (URL-query API).**
- Install `vite-imagetools@^9.0.0` (Vite 6 + Node 20+) OR `^10.0.0` (Vite 7+ + Node 22+).
- Import with a query: `import heroSet from './hero.jpg?w=640;1280;1920&format=avif;webp;jpg&as=srcset'`.
- Build regenerates every image on every full build (slow cold start with 70 images).
- More "magical" but ties every component to a Vite plugin.

**Verdict: Path A.** Cinematic sites rebuild often during polish passes; 70 images through sharp on every `vite build` will add 30-60s per build. A pre-compute-and-commit pipeline keeps `vite build` under 5 seconds. Path B is elegant but pays a tax this MVP doesn't need.

### Testing Posture for MVP

| Tool | Recommendation | Reasoning |
|------|---------------|-----------|
| **Vitest** | **SKIP for MVP.** | A static marketing site with 0 business logic has nothing worth unit-testing. The value-add of a test is near-zero; setup cost is real. Add when interactive forms/state become non-trivial (v2). |
| **@testing-library/react** | **SKIP** | Same as above. |
| **Playwright** | **SKIP for MVP, reconsider at handoff.** | **Maybe** add 1 smoke spec (`pages-render.spec.ts`) that visits all 5 routes and asserts `document.title !== ''` right before client handoff. 30 min setup, catches broken-route deploys. Do NOT build a test pyramid here — it's a demo. |
| **Lighthouse CI** | Optional, nice-to-have | `@lhci/cli` in a GH Actions job post-deploy to enforce the QA-02 constraint (Lighthouse desktop ≥ 90). 1 YAML file, no component changes. Recommended IF the team wants the score visible in PRs. |

**Net recommendation for test libs:** zero runtime test deps in v1. If you want the deploy-smoke safety net, one-line add `@playwright/test@^1.59.1` in devDependencies late in the milestone.

### GitHub Pages Deploy — Workflow Shape

Put this in `.github/workflows/deploy.yml`. Do NOT use the `gh-pages` npm package; the Pages-native actions are the 2024+ standard.

```yaml
name: Deploy to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.dep.outputs.page_url }} }
    steps:
      - id: dep
        uses: actions/deploy-pages@v4
```

Two required `vite.config.ts` settings: `base: '/vugoda-website/'` and `build.outDir: 'dist'` (default).

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `react-router-dom@7` | **TanStack Router** (`@tanstack/react-router@^1.168`) | Type-safe route params, code-splitting by route, first-class data loaders. **Overkill for 5 routes with no dynamic params beyond `/zhk/:slug`.** Use when you have 20+ routes or need type-checked query params. |
| `react-router-dom@7` | **wouter** (`wouter@^3.9`) | Ultra-minimal (~1.5KB gzipped) hook-based router. Great for "just need `useRoute`". **Rejected here** because Motion's `AnimatePresence` + route transitions pattern is better documented with react-router's `<Outlet>` + `useLocation`. Wouter is a fine choice if the team is already fluent; no benefit to learning a new API for 5 routes. |
| `react-router-dom@7` | **Plain `useState` + conditional render** | Sufficient if pages are few and no URL sharing required. **Rejected** because DEP-02 explicitly needs shareable URLs per page for the demo handoff (client will deep-link to `/zhk/etno-dim` in chat). |
| Static Fontsource | **Google Fonts CDN** (`<link href="https://fonts.googleapis.com/css2?...">`) | Zero install, auto-updated. **Rejected** for this project: (a) external request hurts Lighthouse; (b) GDPR/privacy footgun — Google Fonts CDN leaks IPs; (c) the project is Ukrainian-market, external CDN latency is worse than self-host from Pages CDN. Self-host wins on every axis. |
| Static Fontsource | **Variable Fontsource** | See Fonts section above — swap to variable if you discover you need hover-weight interpolation. |
| Sharp script (Path A) | **vite-imagetools** (Path B) | Better when the image set is smaller or changes at development time and rebuild time is not an issue. Good for prototypes; bad for 70-image sites. |
| Sharp script (Path A) | **`@vite-pwa/assets-generator`** / **Squoosh CLI** | Squoosh CLI is fine for one-off generation; sharp is the same underlying tech but with a scriptable JS API that's easier to integrate into `package.json scripts`. |
| `actions/deploy-pages@v4` | **`peaceiris/actions-gh-pages@v4`** | Third-party action; was the standard before GitHub shipped official Pages actions. **Rejected** — official actions have better OIDC, no PAT/token dance, tighter Pages integration. |
| `actions/deploy-pages@v4` | **`gh-pages` npm package + manual `npm run deploy`** | Works locally. **Rejected** — creates a `gh-pages` branch (pollution), pushes from a developer machine (not CI), breaks if a dev forgets to build first. |
| Vite 6 | **Vite 8** | Vite 8 is latest. Rejected because `@vitejs/plugin-react@6` now requires Rolldown (the experimental Rollup replacement) + `babel-plugin-react-compiler` as peer deps. That's a lot of moving parts for "it renders slightly faster." Revisit in Q3 2026 when Rolldown is GA and stable. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js 15 / Remix / SSR** | Concept doc §9 recommends it, but GitHub Pages is **static files only**. No Node runtime. Next.js `next export` works but loses half of Next's value (ISR, server actions). The concept doc is writing for a Vercel deployment that isn't the MVP target. | Vite + React SPA (current choice). Migrate to Next.js at v2 if moving to Vercel. |
| **Three.js / react-three-fiber / Spline** | Concept §9 explicitly says *«Three.js зараз надлишковий»*. 3D parallax cubes are achievable with Motion + CSS `transform: translate3d() rotateX() rotateY()`. | Motion's `useScroll` + `useTransform` + CSS 3D transforms on SVG. ~2KB overhead vs ~600KB Three. |
| **framer-motion** (the old package name) | Renamed to `motion` in 2024. `framer-motion` still exists as a re-export but is the legacy name. | `motion@^12.38.0`. Same team, same API. |
| **`@emotion/*` / `styled-components`** | Tailwind v4 + CSS vars covers the design system with zero runtime cost. Motion supports style-props natively. | Tailwind classes + `@theme` tokens. |
| **`classnames`** | Older, larger (~1KB vs clsx's ~200B), same API as clsx. | `clsx` (add only when needed). |
| **`react-helmet` / `react-helmet-async`** | For 5 static pages, set `<title>` via `document.title = ...` in a `useEffect` on each page component. One line, no dep. | Inline `useEffect(() => { document.title = 'ВИГОДА — Проекти' }, [])`. Or a 20-line `usePageTitle` hook. |
| **`swiper` / `keen-slider` / `embla-carousel`** | Only needed for the construction-log horizontal-scroll teaser. Native CSS `scroll-snap-x` + `overflow-x-auto` gets 90% of the UX with zero deps. Add a carousel lib only if the design needs programmatic slide-to, autoplay, or dot indicators. | CSS `scroll-snap-type: x mandatory` + arrow buttons that do `element.scrollBy({ left: 320, behavior: 'smooth' })`. |
| **`react-hook-form` + `zod`** | Overkill for a single `mailto:` form (CTC-01, HOME-07). The form has name + email + message fields and submits to `mailto:`. Raw `<form>` is fine. | Plain controlled inputs + `form.elements.email.value`. Add RHF when there's a real backend endpoint. |
| **Redux / Zustand / Jotai** | There is NO global state in this MVP. Page-local `useState` and route params cover everything. | `useState`, `useContext` if absolutely needed. |
| **`react-query` / `@tanstack/react-query`** | No data-fetching. All content is static TSX/MDX per CON-01. | Direct imports. |
| **`axios`** | No network calls. | N/A. `fetch` would be fine if/when calls appear. |
| **`dotenv` / `@google/genai` / `express`** (all in current prototype) | Prototype leftovers — the prototype had an AI-assisted express backend. This MVP is static; no Node runtime exists on Pages. | **Remove on migration.** These must NOT carry over into `vugoda-website`. |
| **`moment` / `date-fns` / `dayjs`** | One hard-coded date formatter (for construction month labels like "Січень 2026") is 15 lines of `Intl.DateTimeFormat('uk-UA', {...})`. | `new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' })`. Zero deps, native cyrillic. |
| **Sanity Studio / Contentful / Strapi / any headless CMS** | Out-of-scope per PROJECT.md. | TSX data file `src/data/projects.ts` per CON-02. |
| **Google Analytics / GTM / Meta Pixel scripts** | Out-of-scope per PROJECT.md (§11.14). Also a Lighthouse score killer if naively embedded. | Skip. Add in v2 only with client sign-off. |
| **autoprefixer** (in current prototype devDeps) | Tailwind v4 handles prefixing. Autoprefixer is redundant and sometimes conflicts. | Remove. Tailwind v4 → done. |
| **`@testing-library/jest-dom`** / **jest** | Jest is unmaintained relative to Vitest; Vitest is a drop-in with native ESM/Vite integration. If you add tests later, use Vitest. | Vitest (but see Testing Posture — skip entirely for MVP). |
| **Storybook** | For a 5-page marketing site with no reusable component library, Storybook is pure overhead. | Build pages directly. Revisit at v2 if a component library emerges. |

---

## Version Compatibility

| Package | Required Peers | Notes |
|---------|---------------|-------|
| `vite@6` | Node `^20.19 \|\| >=22.12` | Matches existing prototype. |
| `@vitejs/plugin-react@5.2` | `vite@^4.2 \|\| ^5 \|\| ^6 \|\| ^7` | Do NOT jump to `@vitejs/plugin-react@6` without also jumping Vite to 8 + adopting Rolldown. |
| `@tailwindcss/vite@4.2.4` | `vite@^5.2 \|\| ^6 \|\| ^7 \|\| ^8` | Safe with Vite 6. |
| `tailwindcss@4.2.4` | — | Peer-free. Uses `@tailwindcss/vite` for integration. |
| `motion@12.38` | `react@^18 \|\| ^19`, `react-dom@^18 \|\| ^19` | React 19 supported. |
| `react-router-dom@7.14` | `react >=18`, `react-dom >=18` | Fine with React 19. |
| `lucide-react@1.11` | `react@^16.5 \|\| ^17 \|\| ^18 \|\| ^19` | Fine. |
| `@fontsource/montserrat@5.2.8` | — | Pure CSS + woff2, no JS peer deps. |
| `sharp@0.34.5` (Path A images) | Node `^18.17 \|\| ^20.3 \|\| >=21` | Fine with Node 20.19. |
| `vite-imagetools@9` (Path B images, if chosen) | Node `>=20`, Sharp `^0.34` | Use this if sticking on Vite 6. Do NOT jump to `vite-imagetools@10` unless upgrading to Vite 7+ and Node 22+. |

**Version-pinning rule of thumb:** use `^` (caret) for all deps except runtime-critical ones where the prototype version is already proven (`react`, `react-dom`, `motion`). For those, match the prototype exactly, then bump intentionally.

---

## Upgrade Path (Post-MVP)

When v2 starts, these are the safe upgrades in priority order:

1. **Bump Vite 6 → Vite 8** (and `@vitejs/plugin-react` → 6). Wait until Rolldown hits stable GA. Adds faster cold builds, little else for a small project.
2. **Swap `HashRouter` → `BrowserRouter` + custom domain.** Requires DNS and the 404.html fallback.
3. **Add Sanity or Contentful.** Only if the client actually edits content themselves. For a marketing site updated quarterly, a Git commit is fine.
4. **Add `@lhci/cli` Lighthouse gate.** After v2 content freezes.
5. **Consider Next.js migration** IF hosting moves to Vercel AND SEO/OG-image generation becomes a priority. A pure static Vite SPA can also handle SEO (pre-rendered HTML via `vite-plugin-prerender` or similar) without a framework switch.

---

## Sources

- **npm registry** (verified 2026-04-24 via `npm view`) — current versions and peer-dependency constraints for every package listed. HIGH confidence.
- **Existing prototype** at `вигода-—-системний-девелопмент/package.json` — confirms Vite 6 + React 19 + Tailwind v4 + Motion work together as a reference implementation. HIGH confidence.
- **`@fontsource/montserrat@5.2.8` tarball** (unpacked 2026-04-24 at `/tmp/fontsource-check/`) — confirmed 307 files including `cyrillic-400.css`, `cyrillic-500.css`, `cyrillic-700.css`. HIGH confidence on Ukrainian coverage.
- **Vite docs / GitHub Pages Actions docs** — behavioral knowledge (`base`, `HashRouter` vs `BrowserRouter`, `actions/deploy-pages@v4`). MEDIUM confidence — patterns unchanged since 2023, but NOT re-verified against live docs this session (web search tool denied). If team has any doubt on the deploy YAML, cross-check GitHub's [Publishing with a custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) page at implementation time.
- **PROJECT.md** (this repo) — constraints on scope, silent displacement, desktop-first, bundle budget.
- **КОНЦЕПЦІЯ-САЙТУ.md §9, §10** — original Next.js/Sanity recommendation (explicitly diverged from) and hard rules on palette/typography/cube language.

---

*Stack research for: static React SPA on GitHub Pages (developer/real-estate marketing hub)*
*Researched: 2026-04-24*
