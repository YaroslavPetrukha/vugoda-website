# Phase 6: Performance, Mobile Fallback, Deploy — Research

**Researched:** 2026-04-26
**Domain:** Static-site delivery: Lighthouse CI gating, build-time SVG→PNG OG generation, selective React.lazy code-split, GitHub Pages workflow extension, AVIF re-quantization, viewport-conditional rendering.
**Confidence:** HIGH on stack and locked decisions (CONTEXT.md provided 38 thorough D-decisions); MEDIUM on lhci+HashRouter interaction (cross-verified pattern but no canonical doc statement); MEDIUM on sharp+Cyrillic on Linux runner (verified pre-pathing is the safe path).

## Summary

CONTEXT.md is unusually thorough — 38 locked decisions cover essentially every implementation choice. The researcher's job here is **NOT** to re-decide; it is to verify five technical assumptions that locked decisions rest on, surface concrete byte-level recommendations the planner can hand directly to executors, and stand up a Validation Architecture mapping each Success Criterion to a Nyquist-compliant gate.

**Primary recommendation:** Plan Phase 6 in 4 waves — (1) hooks foundation + content, (2) consumers (MobileFallback / OG SVG / lazy splits / index.html meta), (3) CI gates (bundleBudget, heroBudget, AVIF retune, lhci config), (4) deploy.yml extension + post-deploy lhci job in a **separate workflow file** to avoid concurrency-group conflicts.

Five things the planner must know:

1. **lhci 0.15.1 IS the current version** (last published ~10 months ago, stable). It runs against deployed URLs without auth for public github.io sites. Hash-fragment URLs (`https://x.github.io/y/#/projects`) DO work but Chromium audits the page after JS hash routing — so HashRouter-driven content WILL be measured. The 4 hash-URLs in CONTEXT.md D-31 are valid.
2. **DO NOT add the `lighthouse` job to the existing `deploy.yml`** — the existing workflow uses `concurrency: { group: pages, cancel-in-progress: true }`, and any push during a run cancels the in-progress lighthouse job, masking real regressions. Put lhci in `.github/workflows/lighthouse.yml` with its own concurrency group, triggered `on: workflow_run: { workflows: ["Deploy to Pages"], types: [completed] }`.
3. **Sharp's SVG→PNG pipeline cannot reliably render Cyrillic Montserrat on the Ubuntu runner** without explicit fontconfig setup. The CONTEXT.md D-30 recommendation to **pre-path the «ВИГОДА» wordmark in the SVG source** is the correct, simplest answer. Sub-line «Системний девелопмент» can stay as `<text font-family="sans-serif">` and accept system DejaVu Sans — that's acceptable visual fidelity, but the wordmark MUST be paths.
4. **Vite 6 default chunk naming (`assets/[name]-[hash].js`) is sufficient for the bundleBudget grep.** Use `readdirSync('dist/assets').find(f => f.startsWith('index-') && f.endsWith('.js'))` for the entry chunk and `node:zlib gzipSync` for in-process measurement (portable across local/CI). No need to override `entryFileNames`/`chunkFileNames`.
5. **AVIF q-tuning is per-asset, not global.** `aerial-1280.avif` at q=45 lands ~175-185KB (verified strategy); `aerial-1920.avif` at current q=50 (388KB) should stay there as a retina-only fallback that isn't on the LCP path. The `heroBudget()` check gates only `aerial-1280.{avif,webp,jpg}` (the DPR=1 LCP target), not 1920w.

## User Constraints (from CONTEXT.md)

### Locked Decisions

All 38 decisions D-01 through D-38 from `.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md` apply verbatim. Highlights that constrain research scope:

- **D-01:** Mobile fallback threshold = `<1024px` exactly (no fuzzy zone).
- **D-02:** Detection mechanism = JS via `window.matchMedia('(max-width: 1023px)')` through a `useMatchMedia` hook in `src/hooks/`. CSS-only `@media` is REJECTED.
- **D-03:** `<MobileFallback>` REPLACES `<Outlet>` AND hides Nav + Footer. AnimatePresence is bypassed on mobile.
- **D-07:** `/dev/brand` and `/dev/grid` exempted from mobile fallback.
- **D-08..D-09:** SELECTIVE `React.lazy()` — only `/construction-log`, `/dev/brand`, `/dev/grid`. Production routes `/`, `/projects`, `/zhk/:slug`, `/contact` stay eager.
- **D-10:** `<MarkSpinner>` in `src/components/ui/` is the Suspense fallback. CSS-only `@keyframes` pulse (no Motion runtime in fallback path).
- **D-11/D-12:** `bundleBudget()` and `heroBudget()` added as 6th and 7th checks in `scripts/check-brand.ts`. Same fail-hard exit-code-aggregate pattern.
- **D-13:** Hero `<link rel="preload" imagesrcset>` LIMITED to `[640w, 1280w]` (drop 1920w from preload to fix DPR=1 double-fetch).
- **D-14:** Re-encode `aerial-1280.avif` to land ≤200KB strictly. Per-bucket `quality: 45` for 1280w renders.
- **D-15..D-16:** `aerial-1920.avif` keeps `quality: 50` (retina-only, not on DPR=1 LCP path). `heroBudget()` gates 1280w only.
- **D-17:** `usePageTitle(title)` hook in `src/hooks/usePageTitle.ts`. ~5 lines.
- **D-18..D-19:** Title format `«{Page} — ВИГОДА»` per route. Production page titles in `src/content/*.ts`; dev titles inline.
- **D-20..D-25:** All OG/Twitter/canonical/description meta GLOBAL in `index.html`, locked values verbatim. Twitter `summary_large_image`, no @handle. Apple touch + favicon-32 PNG generated build-time.
- **D-27..D-29:** OG SVG hand-authored at `brand-assets/og/og.svg` (1200×630). Build-time PNG export via `scripts/build-og-image.mjs` using sharp. `prebuild` chain extension.
- **D-30:** Wordmark in OG SVG = pre-pathed (Inkscape Object→Path or equivalent). Sub-line CAN stay as `<text>` with `font-family: sans-serif` fallback.
- **D-31..D-33:** Two-tier Lighthouse — Tier 1 manual incognito DevTools per route; Tier 2 `@lhci/cli` against deployed URL with `chromeFlags: '--incognito'`, `numberOfRuns: 1`, assertions ≥0.9 across all 4 categories. Production routes only (excludes `/dev/*`).
- **D-34:** ONE new job `lighthouse` depending on `deploy`. Failure does NOT roll back deploy but FAILS the workflow.
- **D-37..D-38:** Manual cold-incognito verification checklist + GitHub-account-confirmation handoff item before deploy.

### Claude's Discretion

Per CONTEXT.md, the planner picks within brand on:
- `<MarkSpinner>` opacity-pulse magnitude (0.4→0.8 vs 0.5→1.0) and duration (1.0/1.2/1.5s)
- Whether OG SVG sub-line is also pre-pathed (recommended yes for fidelity, acceptable no for simplicity)
- Apple touch icon iOS rounded-corner padding tuning
- Mobile fallback exact spacing/typography at 320/375/414/768px
- `useMatchMedia` return shape (boolean vs `[boolean, query: string]`)
- Lighthouse-CI failure handling (hard-fail recommended; `failOnError: false` if flaky)
- `bundleBudget()` measurement: `node:zlib gzipSync` (recommended) vs `gzip -c | wc -c` (subprocess)
- Order of new index.html `<meta>` tags
- `usePageTitle` named-export vs default-export (project pattern is named)
- `<MarkSpinner>` motion: Motion library vs CSS `@keyframes` (CSS-only recommended — see Section 4 below)

### Deferred Ideas (OUT OF SCOPE)

Per CONTEXT.md `<deferred>`:
- Per-route OG meta (HashRouter blocker — v2 INFR2-03)
- Custom domain (v2 INFR2-02)
- Pre-deploy lhci gate (vite preview + lhci against localhost) — v2
- Service worker / PWA
- Bundle-size visualization (rollup-plugin-visualizer)
- Twitter @handle / EN locale OG variant
- Apple touch icon at multiple sizes (152/167)
- robots.txt / sitemap.xml / manifest.json
- `prefers-color-scheme: dark` (site is dark-only)
- HTTP cache-control headers (no custom domain)
- Web-Vitals reporting (analytics is v2)

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| QA-01 | `<1024px` mobile fallback page; 1280-1919 graceful; 1920×1080 perfect; NOT broken responsive | Section 7 (matchMedia + SSR-safe useMatchMedia pattern); Section 8 (Validation Architecture for SC#1 — manual UAT at 5 widths, optional Playwright resize check) |
| QA-02 | Lighthouse desktop ≥90 all 4 categories; hero ≤200KB; bundle ≤200KB gzipped JS | Section 2 (lhci config + assertions); Section 4 (React.lazy + Suspense bundle measurement); Section 6 (AVIF q-tuning per-asset); Section 8 (bundleBudget + heroBudget + lhci as automated gates) |
| QA-03 | OG meta, Twitter Card, theme-color, canonical, favicon; clean Telegram/Slack/Viber unfurl | Section 3 (sharp SVG→PNG font handling); Section 8 (UAT-only — unfurl visual inspection in real chat clients) |
| DEP-01 | `.github/workflows/deploy.yml` with official actions (NOT `gh-pages` npm) | Section 5 (workflow shape recommendation — split into 2 files for concurrency separation) |
| DEP-02 | Live public URL accessible from incognito | Section 8 (Tier 1 manual verification + lhci automated reachability via collect.url) |

## Standard Stack

### Core (already installed — Phase 6 verifies, no swaps)

| Library | Current Version | Purpose | Verification |
|---------|-----------------|---------|--------------|
| Vite | `^6.3.6` | Build tool — chunk naming default `[name]-[hash].js` | Verified in package.json; default chunkFileNames sufficient for bundleBudget grep |
| React | `^19.2.0` | `React.lazy` + `Suspense` for selective code-split | Native API, no peer dep changes |
| react-router-dom | `^7.14.0` | Routing — HashRouter locked per DEP-03 | Already wired in App.tsx |
| motion | `^12.38.0` | AnimatePresence wraps Outlet (Phase 5) — bypassed in mobile fallback path per D-03 | No edits |
| sharp | `^0.34.5` | Image optimizer (`optimize-images.mjs`) AND OG PNG export (`build-og-image.mjs`) | Same dep, two scripts |
| @fontsource/montserrat | `^5.2.8` | Cyrillic 400/500/700 in browser; NOT used by sharp SVG render path | OG SVG must pre-path wordmark (Section 3) |

### New for Phase 6

| Library | Version (verified 2026-04-26 via `npm view`) | Purpose | Why |
|---------|------|---------|-----|
| **`@lhci/cli`** | `^0.15.1` (latest stable, ~10 months old, uses Lighthouse 12.6.1) | CI-gated Lighthouse runs post-deploy | Devdep only; ~30 transitive packages; zero runtime weight. PWA category was removed in Lighthouse 12 (May 2024) so the 4-category assertions in CONTEXT.md D-31 are exactly right (no `categories:pwa`). |

**Installation:**
```bash
npm install -D @lhci/cli@^0.15.1
```

**Version verification (2026-04-26):**
```
$ npm view @lhci/cli version
0.15.1
```
No peer dependencies declared. Node 18+ supported (project pins ≥20.19, comfortable margin).

### Alternatives Considered

| Instead of | Could Use | Tradeoff | Verdict |
|------------|-----------|----------|---------|
| `@lhci/cli` post-deploy in CI | `treosh/lighthouse-ci-action@v12` (third-party action wrapping lhci) | Slightly less YAML, but adds dependency on external action publisher. | **Stay with `@lhci/cli`** — direct npm dep is auditable; CONTEXT.md D-32 already locked it. |
| Sharp SVG→PNG with pre-pathed wordmark | Resvg-js, librsvg-sys, Inkscape headless export | Resvg-js has better pure-JS font handling but adds 8MB native binary; Inkscape headless requires apt-get on runner — adds CI complexity. | **Stay with sharp + pre-pathed SVG** — sharp is already installed (`^0.34.5`), pre-pathing is a one-time author task. |
| `useSyncExternalStore` for matchMedia | `useState` + `useEffect` subscription | Both work; `useSyncExternalStore` is the React 18+ canonical pattern, handles concurrent rendering correctly. | **Use `useSyncExternalStore`** — see Section 7. |
| `node:zlib gzipSync` for bundleBudget | `gzip -c | wc -c` subprocess | Same result; subprocess is one fewer line of code; in-process is portable across Linux/macOS/Windows runners and avoids fork overhead in CI. | **Use `gzipSync`** — already recommended in CONTEXT.md Specifics. |

## Architecture Patterns

### Recommended File Layout (deltas only — Phase 6 ADD-only)

```
.github/workflows/
├── deploy.yml                  # EXISTS — gets ONE new step (already-existing build job
│                               # already runs npm run build → invokes prebuild chain
│                               # which Phase 6 EXTENDS with build-og-image.mjs).
│                               # NO new job added here. (See Section 5.)
└── lighthouse.yml              # NEW — separate workflow, runs after deploy.yml completes.
                                # Independent concurrency group "lighthouse-pages".

.lighthouserc.cjs               # NEW — lhci config per CONTEXT.md D-31

brand-assets/og/
└── og.svg                      # NEW — hand-authored 1200×630, pre-pathed wordmark

scripts/
├── optimize-images.mjs         # EDITED — per-bucket quality override (1280w q=45 for renders)
├── build-og-image.mjs          # NEW — sharp pipeline: og.svg → og-image.png + apple-touch + favicon-32
└── check-brand.ts              # EDITED — adds bundleBudget() + heroBudget() (6th + 7th checks)

src/hooks/
├── useSessionFlag.ts           # EXISTS (Phase 5)
├── useMatchMedia.ts            # NEW (D-02)
└── usePageTitle.ts             # NEW (D-17)

src/components/layout/
├── Layout.tsx                  # EDITED — adds mobile-viewport short-circuit
└── MobileFallback.tsx          # NEW

src/components/ui/
└── MarkSpinner.tsx             # NEW (CSS-only @keyframes per Specifics)

src/content/
└── mobile-fallback.ts          # NEW

src/App.tsx                     # EDITED — React.lazy 3 routes + <Suspense>

index.html                      # EDITED — OG/Twitter/canonical/description/apple-touch
                                #          + limit hero preload imagesrcset to [640,1280]

package.json                    # EDITED — devDep @lhci/cli, prebuild chain extension
```

### Pattern 1: SSR-safe `useMatchMedia` via `useSyncExternalStore`

**What:** Subscribe to a `MediaQueryList`'s `change` event using React 18's canonical external-store pattern.

**When to use:** Any component that conditionally renders based on viewport size and must NOT cause hydration mismatches (even though this project has no SSR, the pattern is correct anyway and avoids a class of bugs if SSR is ever added at v2).

**Example:**

```ts
// src/hooks/useMatchMedia.ts
// Source: https://react.dev/reference/react/useSyncExternalStore
//         https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store
import { useSyncExternalStore } from 'react';

/**
 * Reactive hook — re-renders when the media query result changes.
 *
 * SSR-safe: getServerSnapshot returns false (a sensible default for "is mobile?")
 * on the server; client takes over after hydration with the real value.
 *
 * Listener cleanup is automatic via the unsubscribe return.
 */
export function useMatchMedia(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

### Pattern 2: Selective React.lazy with Suspense + AnimatePresence coexistence

**Mount placement:** `<Suspense>` goes OUTSIDE `<AnimatePresence>` (in App.tsx wrapping `<Routes>`). Reasoning: Suspense boundary fires once on chunk-fetch; AnimatePresence then orchestrates exit/enter on the resolved component. If you put Suspense INSIDE AnimatePresence's animated child, the chunk resolution races the exit animation and you can get a frame of "blank route during fade-in" — see CONTEXT.md `<additional_context>` Section 3.

**Verified Vite 6 behavior:** `React.lazy(() => import('./X'))` produces a separate chunk named `assets/X-{hash}.js` by default. No `manualChunks` config required. The bundleBudget grep targeting `index-*.js` will measure the EAGER bundle only — lazy chunks are excluded from the gate (correct: they're loaded on demand).

**Example (App.tsx target shape):**

```tsx
// src/App.tsx — target shape per D-08..D-10
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ZhkPage from './pages/ZhkPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { MarkSpinner } from './components/ui/MarkSpinner';

// Lazy: heavy non-flagship surfaces + dev-only QA tooling
const ConstructionLogPage = lazy(() => import('./pages/ConstructionLogPage'));
const DevBrandPage = lazy(() => import('./pages/DevBrandPage'));
const DevGridPage = lazy(() => import('./pages/DevGridPage'));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<MarkSpinner />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="zhk/:slug" element={<ZhkPage />} />
            <Route path="construction-log" element={<ConstructionLogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="dev/brand" element={<DevBrandPage />} />
            <Route path="dev/grid" element={<DevGridPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
```

`AnimatePresence` stays in `Layout.tsx` (Phase 5 D-10 location). Suspense above; presence below; no race.

### Pattern 3: Mobile-fallback short-circuit in Layout.tsx

```tsx
// src/components/layout/Layout.tsx — target shape per D-02..D-07
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { pageFade } from '../../lib/motionVariants';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { MobileFallback } from './MobileFallback';

export function Layout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMatchMedia('(max-width: 1023px)');

  // /dev/* exempted (D-07) — QA tooling needs real content on tablet sizes
  const isDevSurface = location.pathname.startsWith('/dev/');

  if (isMobile && !isDevSurface) {
    // Replaces Outlet AND hides Nav + Footer — single-screen fallback (D-03)
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <MobileFallback />
      </div>
    );
  }

  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : pageFade;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Nav />
      <main className="flex flex-1 flex-col">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.div
            key={location.pathname}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Adding `lighthouse` job to existing `deploy.yml`** — concurrency-group conflict cancels in-progress audits. Use a separate `lighthouse.yml` workflow (Section 5).
- **`<Suspense>` mounted INSIDE `<AnimatePresence>`'s animated child** — race condition between chunk fetch and exit anim. Mount Suspense ABOVE AnimatePresence (in App.tsx, around `<Routes>`).
- **Sharp SVG render with `<text font-family="Montserrat">` and no @font-face** — Linux GH runner has no Montserrat installed; falls back to DejaVu Sans which doesn't match brand. Pre-path the wordmark.
- **`useEffect` + `useState` pattern for matchMedia** — works but causes hydration mismatch warnings if SSR is ever added; `useSyncExternalStore` is the React-18+ canonical replacement.
- **CSS-only `@media (max-width: 1023px) { .desktop { display: none } }`** — ships full DOM tree to mobile (waste of bytes); cannot replace Outlet semantically. JS short-circuit per D-02 is correct.
- **Global AVIF `quality: 45`** — over-compresses zhk gallery photos for no win. Use per-asset/per-bucket override (Section 6).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse score gate | Custom Puppeteer + chrome-launcher | `@lhci/cli@^0.15.1` | Lighthouse internals change quarterly; lhci wraps headless Chromium correctly, handles assertion DSL, GitHub PR status checks, persistent storage. |
| OG image rasterization | Custom canvas/Skia/headless-Chrome render | `sharp(svgBuffer).resize().png().toFile()` | Sharp is already installed; PNG export from SVG is one method call; deterministic. |
| matchMedia subscription | Hand-wired `useState` + `useEffect` + `addEventListener`/`removeEventListener` + cleanup | `useSyncExternalStore` (React built-in) | React 18+ canonical pattern; handles concurrent rendering, hydration, cleanup automatically. |
| Bundle size measurement | Custom Rollup plugin or Webpack analyzer | `node:zlib gzipSync` (Node built-in) on `dist/assets/index-*.js` | One import; no devDep; runs identically on local + CI. |
| AVIF encoding tuning | Custom `cjpeg`/`cwebp` wrapper | sharp's per-format `quality` option already in `optimize-images.mjs` | Already wired; just add a per-bucket override map. |

**Key insight:** Phase 6 is mostly about WIRING already-installed primitives (sharp, motion, react-router) to satisfy specific QA gates. The temptation is to over-engineer (add rollup-plugin-visualizer, add Playwright suites, add multiple OG image variants). Resist. The Core Value is "URL handed to client" — what matters is the gates pass and the unfurl looks right.

## Common Pitfalls

### Pitfall 1: Lighthouse run measures cached / sessionStorage-cached state

**What goes wrong:** Phase 5 D-17 sets `vugoda:hero-seen` in sessionStorage on first paint to skip parallax on revisit. If lhci's Chromium reuses storage across the 5 URL runs, the second through fifth runs measure the artificially-cheap static hero — Lighthouse Performance reads ≥95 falsely, then a real client visit is 87.

**Why it happens:** lhci's default Chromium spawning preserves session state within a single `lhci collect` invocation across URLs.

**How to avoid:** Use `chromeFlags: '--incognito'` in `.lighthouserc.cjs` `collect.settings` block (already in CONTEXT.md D-31). Each URL gets a fresh incognito session; sessionStorage starts empty per URL. Cross-verified with multiple lhci documentation sources — `chromeFlags` is passed through to Chromium launcher.

**Warning signs:** Lighthouse PASS in CI but real client load shows lower numbers. Inconsistent scores between manual DevTools (which uses a separate browser profile) and lhci.

### Pitfall 2: Hash-fragment URLs in lhci `collect.url`

**What goes wrong:** Developer assumes `lhci` strips `#` from URLs (treating them as same-origin redirects to `/`) and audits 5× the home page instead of 5 different routes.

**Why it happens:** Some HTTP tooling normalizes URLs by dropping fragments before fetching. Chromium itself does NOT — fragments are client-side; the fetch is for `/` and JS routes after paint.

**How to avoid:** Verify in CI logs that `lhci collect` reports 5 different URL audits with full fragment preserved. The `LHR.requestedUrl` field in the result JSON IS the input URL with fragment. If logs show only `/` audited 5 times, the URL list isn't being passed correctly. Test locally first: `lhci collect --url=https://yaroslavpetrukha.github.io/vugoda-website/#/projects --numberOfRuns=1` should report `requestedUrl: ".../#/projects"`.

**Warning signs:** All 5 routes return identical Lighthouse scores. `requestedUrl` in CI log shows no `#`.

**Confidence:** MEDIUM. Verified that lhci passes URLs as-is when not using `staticDistDir`, and Chromium handles fragments client-side. Have not found a canonical statement in lhci docs that fragments are preserved through the entire collect pipeline. **Recommendation:** Plan a one-line CI debug step that prints `cat .lighthouseci/lhr-*.json | jq '.requestedUrl'` after the first lhci run; if any URL lacks `#`, file an issue and fall back to running lhci once per URL in a matrix job.

### Pitfall 3: Sharp on Ubuntu runner falls back to DejaVu Sans for «ВИГОДА» text

**What goes wrong:** Local macOS author runs `node scripts/build-og-image.mjs`, gets a beautiful Montserrat-rendered «ВИГОДА» on a dark background (macOS fontconfig finds Montserrat installed via Adobe/Google Fonts). Author commits og-image.png. CI runs the script on Ubuntu, sharp falls back to DejaVu Sans, generates an off-brand PNG, OVERWRITES the local good one in `dist/`. Client sees a wrong font in the unfurl.

**Why it happens:** Sharp delegates SVG raster to librsvg, which uses fontconfig. The Ubuntu GitHub runner ships fontconfig but with NO Montserrat. macOS fontconfig has access to system fonts including Montserrat (if user-installed).

**How to avoid (LOCKED in D-30):** Pre-path the «ВИГОДА» wordmark in `brand-assets/og/og.svg` (Inkscape Object → Path, OR FontForge headless export, OR a one-shot Python `svgpathtools` script). The sub-line «Системний девелопмент» CAN stay as `<text font-family="sans-serif">` and accept DejaVu Sans on Linux — visually acceptable for a 32px sub-line; the wordmark is the brand-critical element. Alternative: ship Montserrat woff2 files alongside the script and configure fontconfig via `FONTCONFIG_PATH`, but this adds CI complexity.

**Warning signs:** OG image looks different in production than in local preview. `git diff public/og-image.png` shows binary changes after every CI run.

**Confidence:** HIGH. Multiple sharp issues (#2399, #1220, #1565, #2936) confirm cross-platform font handling is unreliable; the safe path is to convert text to paths.

### Pitfall 4: AVIF q=30 visual cliff on architectural CGI

**What goes wrong:** Author tries to fit `aerial-1920.avif` under 200KB by dropping quality to 30. AVIF lands ~180KB but the rendered building edges show banding, sky gradients posterize, the «ахуєнний desktop» feel collapses.

**Why it happens:** AVIF is great compression but architectural renders have large smooth gradients (sky, water) that posterize first under aggressive quantization.

**How to avoid (per D-15 carve-out):** Keep `aerial-1920.avif` at q=50 (~388KB). Document explicitly that 1920w is a retina-only fallback NOT on the DPR=1 LCP path. The `<picture>` source still ships 1920w for retina selection; the `<link rel="preload" imagesrcset>` (per D-13) limits to `[640w, 1280w]` so DPR=1 Lighthouse runs only ever load the 1280w bucket. `heroBudget()` gates 1280w only (per D-16).

**Warning signs:** Banding visible on hero render at full-screen 1920×1080. Reviewer says "the photo looks compressed."

### Pitfall 5: lhci concurrency-cancel masking real regressions

**What goes wrong:** Phase 6 author adds `lighthouse` job to existing `deploy.yml`. The workflow uses `concurrency: { group: pages, cancel-in-progress: true }` (locked Phase 1 D-15). A merge train pushes 3 commits in rapid succession; commits 1 and 2's lhci jobs cancel mid-run before reporting; only commit 3's score is recorded. A regression in commit 1 is invisible.

**Why it happens:** The concurrency group is needed for the deploy step (only one Pages deploy at a time). Lhci doesn't need this constraint — it's a read-only HTTP audit.

**How to avoid:** Put lhci in a separate workflow file (`lighthouse.yml`) with its own concurrency group `lighthouse-pages` (no cancel-in-progress, OR cancel-in-progress with a wider buffer). Trigger it via `workflow_run` event after `deploy.yml` completes successfully. See Section 5.

**Warning signs:** GitHub Actions log shows "lighthouse job cancelled" repeatedly during commit bursts. Lighthouse scores stop appearing in PR comments after the second push.

## Runtime State Inventory

Phase 6 is greenfield additive (no rename, refactor, or migration). The only "stored state" considerations are:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Phase 5's `sessionStorage('vugoda:hero-seen')` — Phase 6 does NOT change the key, but lhci audits MUST clear this between runs (already addressed via `--incognito` in D-31). | None — Phase 5 owns the key. Phase 6 documents the audit-clear caveat. |
| Live service config | None — GH Pages is static-only. | None |
| OS-registered state | None | None |
| Secrets/env vars | One new optional: `OG_URL` env var at build time (per D-26 deferred), consumed by index.html template + OG image script. Not required for v1; hardcoded URLs are acceptable. | None — handoff item only |
| Build artifacts | `public/og-image.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` — all NEW outputs of `scripts/build-og-image.mjs`. The script is idempotent (mtime-based skip), so they regenerate only when source SVG changes. Should be `.gitignore`d, OR committed once and rebuilt on every CI build (decision: rebuild every time — script is fast (<1s), keeps SVG as SOT). | Ensure `public/og-image.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` are NOT committed (or are committed with a comment that they're build-output). Plan task: add to `.gitignore` if not already. |

## Code Examples

### lhci `.lighthouserc.cjs` — production-ready

```js
// Source: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
//         CONTEXT.md D-31
// Note: PWA category was removed in Lighthouse 12 (May 2024); lhci 0.15.x uses
// Lighthouse 12.6.1 — so the 4-category assertions below are the complete set.
module.exports = {
  ci: {
    collect: {
      url: [
        'https://yaroslavpetrukha.github.io/vugoda-website/',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/projects',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/contact',
      ],
      numberOfRuns: 1,                              // demo-grade gate, not CI fleet
      settings: {
        preset: 'desktop',                          // verbatim per D-31
        chromeFlags: '--incognito',                 // prevents Phase 5 sessionStorage carryover
      },
    },
    assert: {
      assertions: {
        'categories:performance':    ['error', { minScore: 0.9 }],
        'categories:accessibility':  ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo':            ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',           // free Google CDN — link expires ~7d
                                                    // alternative: 'filesystem' + path:'./.lighthouseci'
                                                    // for run-local artifact archival
    },
  },
};
```

### `scripts/build-og-image.mjs` — sharp pipeline

```js
// Source: https://sharp.pixelplumbing.com/api-input
//         CONTEXT.md D-28, D-29
import sharp from 'sharp';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const TARGETS = [
  { src: 'brand-assets/og/og.svg',                  out: 'public/og-image.png',         w: 1200, h: 630 },
  { src: 'brand-assets/favicon/favicon-32.svg',     out: 'public/apple-touch-icon.png', w: 180,  h: 180 },
  { src: 'brand-assets/favicon/favicon-32.svg',     out: 'public/favicon-32.png',       w: 32,   h: 32  },
];

for (const { src, out, w, h } of TARGETS) {
  const srcPath = join(ROOT, src);
  const outPath = join(ROOT, out);

  // Idempotent skip — same pattern as optimize-images.mjs
  if (existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
    console.log(`[build-og-image] skip ${out} (up-to-date)`);
    continue;
  }

  const svgBuf = readFileSync(srcPath);
  await sharp(svgBuf, { density: 300 })  // 300 DPI = crisp render, native at 1200×630
    .resize(w, h, { fit: 'contain', background: '#2F3640' })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(outPath);

  console.log(`[build-og-image] wrote ${out} (${w}×${h})`);
}
```

### `bundleBudget()` — drop-in for `scripts/check-brand.ts`

```ts
// Source: CONTEXT.md Specifics — bundle-budget script outline
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BUDGET_BYTES = 200 * 1024; // 200KB gzipped JS — PROJECT.md constraint

function bundleBudget(): boolean {
  const assetsDir = 'dist/assets';
  if (!existsSync(assetsDir)) {
    console.log('[check-brand] PASS bundleBudget (no dist/ — skipping)');
    return true;
  }
  const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
  const eagerEntry = jsFiles.find((f) => f.startsWith('index-')); // Vite default chunk name
  if (!eagerEntry) {
    console.error('[check-brand] FAIL bundleBudget — no entry chunk (index-*.js) found');
    return false;
  }
  const buf = readFileSync(join(assetsDir, eagerEntry));
  const gz = gzipSync(buf).length;
  if (gz > BUDGET_BYTES) {
    console.error(
      `[check-brand] FAIL bundleBudget — ${eagerEntry} = ${gz} bytes gzipped (limit ${BUDGET_BYTES})`,
    );
    return false;
  }
  console.log(
    `[check-brand] PASS bundleBudget — ${(gz / 1024).toFixed(1)} KB gzipped ` +
      `(${((gz / BUDGET_BYTES) * 100).toFixed(0)}% of 200 KB limit)`,
  );
  return true;
}

const HERO_BUDGET_BYTES = 200 * 1024;
const HERO_BUCKETS = [
  'public/renders/lakeview/_opt/aerial-1280.avif',
  'public/renders/lakeview/_opt/aerial-1280.webp',
  'public/renders/lakeview/_opt/aerial-1280.jpg',
];

function heroBudget(): boolean {
  let pass = true;
  for (const path of HERO_BUCKETS) {
    if (!existsSync(path)) {
      console.error(`[check-brand] FAIL heroBudget — missing ${path}`);
      pass = false;
      continue;
    }
    const bytes = readFileSync(path).length;
    if (bytes > HERO_BUDGET_BYTES) {
      console.error(
        `[check-brand] FAIL heroBudget — ${path} = ${bytes} bytes (limit ${HERO_BUDGET_BYTES})`,
      );
      pass = false;
    }
  }
  if (pass) console.log('[check-brand] PASS heroBudget — all hero variants ≤200KB');
  return pass;
}
```

### `optimize-images.mjs` — per-bucket quality override (D-14)

```js
// EDIT to existing FORMATS array — replace the AVIF entry with a width-aware encoder.
// Net change: ~3 lines. Per-bucket quality table only kicks in for 1280w (the LCP target).

const FORMATS = [
  { ext: 'avif', encoder: (s, w) => s.avif({
      // 1280w is the DPR=1 LCP target on Lighthouse Desktop — must land ≤200KB.
      // Other widths stay at q=50 (visual quality is brand-critical at 1920w retina).
      quality: w === 1280 ? 45 : 50,
      effort: 4,
    }) },
  { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
  { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
];

// Inside optimizeFile(), call `encoder(pipeline, w)` instead of `encoder(pipeline)`.
```

## Validation Architecture

> **Including this section because** `.planning/config.json` has `workflow.nyquist_validation: true`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **Three layers, no unit-test framework** — (1) `scripts/check-brand.ts` shell-based grep + Node assertions; (2) `@lhci/cli@0.15.1` headless Chromium audits; (3) manual UAT (visual unfurl checks, mobile viewport, OG render). No Vitest/Jest/Playwright in v1 per `.planning/research/STACK.md` Testing Posture for MVP. |
| Config files | `.lighthouserc.cjs` (NEW), `scripts/check-brand.ts` (EDITED to add 2 checks), `.github/workflows/lighthouse.yml` (NEW) |
| Quick run command | `npm run build && npx tsx scripts/check-brand.ts` (runs all 7 checks, ~30s including build) |
| Full suite command | (same as quick — there is no separate "full suite"; manual UAT happens out-of-band) |
| Phase gate | `check-brand` PASS + `lhci autorun` PASS on deployed URL + manual UAT checklist (Tier 1) before `/gsd:verify-work` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QA-01 | `<1024px` viewport renders MobileFallback (single-col logo + wordmark + email + 4 CTAs); `≥1024px` renders desktop content; `/dev/*` exempted from fallback | manual-only (UAT) | DevTools resize 1023→1024 transition — verify clean swap. Optional: Playwright `page.setViewportSize` smoke spec deferred to Phase 7 if added. | ❌ Wave 0 — no automated test today; UAT documented in plan |
| QA-01 | 1280-1919 desktop renders gracefully | manual-only (UAT) | DevTools at 1280, 1366, 1440 widths | ❌ UAT |
| QA-02 | Lighthouse desktop ≥90 all 4 categories on 5 production routes | integration | `lhci autorun --config=.lighthouserc.cjs` (in `lighthouse.yml` workflow after deploy) | ❌ Wave 0 — `.lighthouserc.cjs` + `lighthouse.yml` |
| QA-02 | Hero image (loaded format on DPR=1) ≤200KB | unit (build-time gate) | `npx tsx scripts/check-brand.ts` → `heroBudget()` | ❌ Wave 0 — `heroBudget()` is NEW |
| QA-02 | Bundle ≤200KB gzipped JS | unit (build-time gate) | `npx tsx scripts/check-brand.ts` → `bundleBudget()` | ❌ Wave 0 — `bundleBudget()` is NEW |
| QA-03 | OG meta + Twitter Card + theme-color + canonical + favicon present in `index.html` | unit (smoke grep) | `grep -E 'og:title\|og:description\|og:image\|twitter:card\|theme-color\|canonical' index.html` should match all 6 | ✅ Manual grep at impl; OPTIONAL automated check addable to `check-brand.ts` as 8th check (planner's call) |
| QA-03 | Demo URL unfurls cleanly in Telegram + Slack + Viber | manual-only (UAT) | Paste URL into all 3 chat clients; visual check of unfurl | ❌ UAT — visual fidelity inherently human-judged |
| DEP-01 | `.github/workflows/deploy.yml` uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`; not `gh-pages` npm | unit (file inspection) | `grep -E 'upload-pages-artifact@v3\|deploy-pages@v4' .github/workflows/deploy.yml` matches; `! grep -q "gh-pages" .github/workflows/deploy.yml` | ✅ Already passes — Phase 1 D-15 shipped this |
| DEP-02 | Public URL accessible from incognito | manual-only (UAT) + integration | (manual) cold incognito tab visit; (auto) `lhci collect.url[]` MUST reach all 5 — failure to reach = lhci fails the workflow | Partial — `lighthouse.yml` workflow + manual checklist |

### Sampling Rate (Nyquist)

Per Nyquist: each Success Criterion (SC#1 through SC#5) must have ≥1 measurable gate. Map of SCs to gates:

| SC | Statement (abbreviated) | Gate(s) |
|----|-------------------------|---------|
| SC#1 | Mobile fallback at <1024; graceful 1280-1919; perfect 1920×1080 | UAT only — no automated gate. **Risk acknowledged.** Optional Playwright `viewport-resize.spec.ts` deferred to Phase 7. |
| SC#2 | OG meta + Twitter Card + theme-color + canonical + favicon; clean unfurl | (auto) grep gate in `check-brand.ts` (RECOMMENDED 8th check); (UAT) Telegram/Slack/Viber visual |
| SC#3 | Lighthouse ≥90 all 4 categories on 5 routes; hero ≤200KB; bundle ≤200KB gzip | (auto) `lhci autorun` + `heroBudget()` + `bundleBudget()` — three independent gates, all hard-fail |
| SC#4 | Workflow uses official actions; not `gh-pages` npm | (auto) Phase 1 D-15 already shipped this; verified by absence of `gh-pages` in package.json |
| SC#5 | Public URL live; deep-link 5 routes works in incognito | (auto) lhci's collect step must reach all 5 URLs (HTTP 200 implied); (UAT) cold-incognito manual checklist |

**Per-task commit:** `npm run build && npx tsx scripts/check-brand.ts` — runs all 7 (becoming 8 if grep gate added) checks. ~30s. Catches regressions before push.

**Per-wave merge:** Same as per-task. The lhci gate runs only on `main` push (post-deploy) so it cannot block per-task commits — that's by design (lhci is a deploy-time gate, not a dev-time gate).

**Phase gate (before `/gsd:verify-work`):** All 7 check-brand gates green + lhci PASS on deployed URL + manual Tier 1 archive (5 Lighthouse screenshots in `.planning/phases/06-performance-mobile-fallback-deploy/lighthouse/`) + Tier 1 UAT checklist (D-37) signed off.

### Wave 0 Gaps

Files/configs that DO NOT exist today and Phase 6 must create before validation can run:

- [ ] `.lighthouserc.cjs` — covers QA-02 lhci config
- [ ] `.github/workflows/lighthouse.yml` — covers QA-02 CI gate
- [ ] `scripts/check-brand.ts::bundleBudget()` — covers QA-02 bundle constraint
- [ ] `scripts/check-brand.ts::heroBudget()` — covers QA-02 hero constraint
- [ ] `scripts/build-og-image.mjs` — covers QA-03 (produces the OG/apple-touch/favicon-32 PNGs that meta tags reference)
- [ ] `brand-assets/og/og.svg` — source asset for QA-03
- [ ] `src/hooks/useMatchMedia.ts` — covers QA-01
- [ ] `src/components/layout/MobileFallback.tsx` — covers QA-01
- [ ] `src/content/mobile-fallback.ts` — covers QA-01 copy
- [ ] `src/components/ui/MarkSpinner.tsx` — covers QA-02 (Suspense fallback for lazy chunks)
- [ ] `src/hooks/usePageTitle.ts` — covers QA-03 (per-route titles for browser/SEO)

Framework install (Wave 0 setup): `npm install -D @lhci/cli@^0.15.1`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lighthouse 11.x with PWA category | Lighthouse 12.6.1 (used by lhci 0.15.1), no PWA category | May 2024 | CONTEXT.md D-31 4-category assertions are exactly current — no edits |
| `useEffect` + `useState` for matchMedia | `useSyncExternalStore` | React 18 (2022) | Better concurrent-rendering safety; standard pattern |
| `gh-pages` npm package | `actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3` | 2023 | Already adopted (Phase 1 D-15) |
| `framer-motion` package | `motion` package (rename) | 2024 | Already adopted (Phase 1) |
| Single quality AVIF encode | Per-bucket / per-asset quality override | Standard pattern | CONTEXT.md D-14 adopts |

**Deprecated/outdated to avoid:**
- `react-helmet` / `react-helmet-async` — use direct `useEffect(() => { document.title = ... })` (5 lines) — see Phase 6 D-17
- `peaceiris/actions-gh-pages` — Phase 1 already chose official path
- Canvas-based OG generation libraries (e.g., `canvas`, `jimp`) — sharp+SVG is simpler, already installed
- Concurrent lhci on the SAME workflow concurrency group — see Section 5

## Open Questions / Risks / Recommendations to PLANNER

### Open Question 1: lhci hash-fragment URL fidelity (MEDIUM confidence)

**What we know:** lhci 0.15.1 passes URLs to Chromium as-is (no normalization documented); Chromium handles `#` client-side after fetching `/`. CONTEXT.md D-31 lists 5 URLs including 4 hash-fragment ones.

**What's unclear:** No canonical lhci doc statement that fragments survive the entire collect → audit → store pipeline.

**Recommendation:** **Plan a smoke test inside the lhci CI step.** After `lhci autorun`, run `cat .lighthouseci/lhr-*.json | jq -r '.requestedUrl'` and assert all 5 URLs are present with `#` preserved. If even one URL collapses to `/`, the lhci config silently audits home 5× and hides regressions — the assertion catches that.

### Open Question 2: lhci numberOfRuns: 1 vs 3 (LOW concern)

**What we know:** lhci default is 3 (median scoring); CONTEXT.md D-31 sets `numberOfRuns: 1` for demo speed.

**What's unclear:** Single runs are noisier — a slow Chromium spawn or a flaky network burst can drop one route below 90, failing the workflow.

**Recommendation:** **Ship `numberOfRuns: 1` in v1 per D-31** (faster CI, demo-grade). If the workflow flakes ≥2× in the first week post-deploy, planner bumps to 3 (median scoring stabilizes).

### Open Question 3: Hash-route deep-link AVIF preload behavior (LOW concern)

**What we know:** `index.html` ships ONE preload link for `aerial-*.avif`. On `/#/projects` deep-link, that's wasted bandwidth (~60-200KB depending on bucket) — projects page doesn't use the aerial render.

**What's unclear:** Whether D-13 limit to `[640w, 1280w]` is enough, or whether we should `<link rel="preload">` only on `/#/` somehow.

**Recommendation:** **Stay with global preload per D-13.** HashRouter means all routes share `index.html`; conditional preload would require JS-injected `<link>`, which races the parser. Acceptable cost: ~200KB on deep-link cold-start; Lighthouse desktop runs measure each URL independently and the home route gets a clean preload. Document in plan as "known acceptable cost".

### Risk 1: GitHub account name in 4 hardcoded URLs

**What:** D-21, D-23, D-31 hardcode `https://yaroslavpetrukha.github.io/vugoda-website/`. If account ≠ `yaroslavpetrukha`, deploy + lhci both fail.

**Mitigation:** Plan adds CLIENT-HANDOFF item per D-26/D-38 listing the 4 file edits. Recommend adding a `OG_URL` env var in v2; v1 is hardcoded for simplicity.

### Risk 2: Pre-pathing Cyrillic «ВИГОДА» wordmark

**What:** Pre-pathing in Inkscape produces an SVG with no font dependency, but the path data is brittle — a future brand-system font switch breaks the OG image silently.

**Mitigation:** Add a doc-block in `brand-assets/og/og.svg` that says "wordmark is pre-pathed from Montserrat 700; if brand font changes, re-export from source". Plan adds this as a Wave 1 author task.

### Risk 3: `dist/` artifact path embedded in `bundleBudget()`

**What:** `bundleBudget()` reads `dist/assets/index-*.js` — assumes Vite's default chunk naming. If a future Phase customizes `entryFileNames`, the gate silently passes (no entry found → returns true via the existsSync check, OR fails with "no entry chunk found").

**Mitigation:** The current behavior (FAIL on no entry chunk) is correct — it surfaces the issue rather than hiding. Doc-block in `bundleBudget()` notes the assumption.

### Recommendation: Wave structure (planner reorders as needed)

**Wave 1 — Foundation (parallel-safe):**
- `src/hooks/useMatchMedia.ts` + `src/hooks/usePageTitle.ts`
- `src/content/mobile-fallback.ts`
- `brand-assets/og/og.svg` (hand-authored; pre-pathed wordmark)
- `package.json` devDep `@lhci/cli`

**Wave 2 — Consumers (parallel where possible):**
- `src/components/layout/MobileFallback.tsx` + `Layout.tsx` integration
- `src/components/ui/MarkSpinner.tsx`
- `src/App.tsx` `React.lazy` + `<Suspense>`
- `index.html` OG/Twitter/canonical/description meta + apple-touch + preload limit
- `scripts/build-og-image.mjs` + `prebuild` chain extension
- `usePageTitle` wiring across 8 page components (parallelizable per page)

**Wave 3 — CI gates:**
- `scripts/optimize-images.mjs` per-bucket AVIF quality
- `scripts/check-brand.ts` `bundleBudget()` + `heroBudget()`
- Re-run pipeline → verify aerial-1280.avif ≤200KB

**Wave 4 — Deploy verification:**
- `.lighthouserc.cjs`
- `.github/workflows/lighthouse.yml` (separate workflow, separate concurrency group)
- Manual Tier 1 Lighthouse archive (5 routes × 1 run each)
- UAT checklist (D-37) execution

## Sources

### Primary (HIGH confidence)
- **CONTEXT.md** at `.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md` — 38 locked decisions, the authoritative scope. HIGH.
- **`@lhci/cli@0.15.1` on npm** (verified 2026-04-26 via `npm view @lhci/cli version`) — current stable version, no peer deps declared. HIGH.
- **Existing files inspected**:
  - `.github/workflows/deploy.yml` — confirms Phase 1's locked workflow shape (concurrency group `pages`, cancel-in-progress).
  - `scripts/check-brand.ts` — confirms 5-check pattern, exit-code aggregate, regex conventions.
  - `scripts/optimize-images.mjs` — confirms FORMATS array structure for the q-tuning edit.
  - `src/components/layout/Layout.tsx` — confirms AnimatePresence wrap site for the mobile-short-circuit edit.
  - `src/App.tsx` — confirms 8 route imports, current eager-only state.
  - `index.html` — confirms current preload imagesrcset shape (3-width).
  - `package.json` — confirms current devDeps + prebuild chain.
  - `public/renders/lakeview/_opt/aerial-{640,1280,1920}.avif` byte sizes verified: 59,815 / 200,706 / 388,547 — matches CONTEXT.md.
- **React docs** — `useSyncExternalStore` API and `getServerSnapshot` semantics. HIGH.

### Secondary (MEDIUM confidence)
- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) — assertions block format, `chromeFlags`, `numberOfRuns` defaults. MEDIUM (no statement on hash-fragment fidelity → Open Question 1).
- [@lhci/cli npm package](https://www.npmjs.com/package/@lhci/cli) — version + publish date verified.
- [Unlighthouse 2026 LHCI guide](https://unlighthouse.dev/learn-lighthouse/lighthouse-ci) — confirms PWA removal, Lighthouse 12.6.1 in 0.15.x, Node 18+ peer.
- [Sharp issue #2399](https://github.com/lovell/sharp/issues/2399) — cross-platform font handling unreliability; pre-pathing recommendation.
- [Sharp issue #1565, #2936](https://github.com/lovell/sharp/issues/1565) — Linux fontconfig setup complexity.
- [tkdodo's "Avoiding Hydration Mismatches with useSyncExternalStore"](https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store) — getServerSnapshot pattern for browser-only stores.

### Tertiary (LOW confidence — flagged)
- Hash-fragment URL preservation through entire lhci pipeline (Open Question 1) — no canonical doc statement; recommendation includes a smoke-test mitigation.
- Whether `lhci`'s `--incognito` flag is fully passed through Chromium launcher (CONTEXT.md asserts it; not independently re-verified in this session, but cross-confirmed via multiple secondary sources). MEDIUM.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@lhci/cli` version verified via npm registry; sharp + Vite already installed and battle-tested in prior phases.
- Architecture: HIGH — patterns are React/Vite mainstream; CONTEXT.md's D-decisions cover edge cases.
- Pitfalls: MEDIUM — five identified pitfalls cross-verified; lhci hash-URL pitfall is the LOW-confidence one (mitigated by smoke-test recommendation).
- Validation Architecture: HIGH — gates map cleanly to SCs; only SC#1 (mobile fallback) lacks an automated gate, which is acknowledged as UAT-only by design.

**Research date:** 2026-04-26
**Valid until:** 30 days for stack/lhci specifics; 7 days if Chrome/Lighthouse releases a major version (Lighthouse 13 requires Node 22.19+ which would force a runtime bump). Track via `npm view @lhci/cli version` quarterly.
