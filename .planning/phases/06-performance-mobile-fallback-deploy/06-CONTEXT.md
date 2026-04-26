# Phase 6: Performance, Mobile Fallback, Deploy — Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Site ships to a public GitHub Pages URL with verified Lighthouse ≥90 (Performance / Accessibility / Best Practices / SEO) on all 5 production routes, working OG/Twitter/canonical/favicon for clean unfurls in Telegram/Slack/Viber, and an intentional `<MobileFallback>` page that turns "out-of-scope mobile" into an explicit desktop-first notice. 5 v1 requirements: QA-01 (mobile fallback), QA-02 (Lighthouse + ≤200KB hero + ≤200KB gzipped JS), QA-03 (OG meta + Twitter Card + theme-color + canonical + favicon), DEP-01 (Actions deploy.yml), DEP-02 (live public URL).

Explicit phase-scope clarifications (authorised during discussion + audit findings):

- **`deploy.yml` is EXTENDED, not rebuilt.** Phase 1 D-15..D-18 already ships the verbatim `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` workflow with `npm run build` + `check-brand` step. Phase 6 adds: (a) optional `@lhci/cli` job after deploy, (b) byte-budget assertion step (hero ≤200KB + JS bundle ≤200KB gzipped). Workflow shape stays.
- **HashRouter is locked (DEP-03), so OG meta is necessarily global** (one `og:title`, one `og:description`, one `og:image`, one `og:url`, one `<link rel="canonical">`). Crawlers/unfurlers see only `https://yaroslavpetrukha.github.io/vugoda-website/` — they do not execute JS, do not see `/#/projects` route variations. Per-route OG is impossible without leaving HashRouter; that's a v2 decision (INFR2-03 BrowserRouter at custom domain).
- **Per-route `<title>` updates DO work** (browsers update tab title via JS). Phase 6 ships `usePageTitle(title)` hook in `src/hooks/` and wires it into all 5 production pages — for SEO of deep links, browser-history readability, and tab discrimination during demo.
- **Image pipeline NOT rebuilt.** Phase 3 D-19/D-20 ships `scripts/optimize-images.mjs` (sharp AVIF q=50 / WebP q=75 / JPG q=80). Phase 6 only TUNES: re-encodes `aerial-1920.{avif,webp,jpg}` at lower quality to fit the ≤200KB hero budget, AND limits the hero `<link rel="preload">` `imagesrcset` to `[640w, 1280w]` (drops 1920w from preload to eliminate the DPR=1 double-fetch waste documented in audit). The 1920w variant still ships for retina `<picture>` selection at full `<img>`.
- **OG image (1200×630) is hand-authored as SVG** in `brand-assets/og/og.svg` (or `src/assets/og.svg` per planner taste) — composition: `#2F3640` background + `<IsometricGridBG>` overlay at 0.15 opacity + Montserrat 700 wordmark «ВИГОДА» + Montserrat 400 gasло in `#A7AFBC` muted text. A new `scripts/build-og-image.mjs` exports it to `public/og-image.png` at exactly 1200×630 via sharp. Build-time, not commit-time, so the brand SVG stays as the source of truth.
- **Mobile fallback REPLACES `<Outlet>`, not the site** at `<1024px`. JS viewport-check in `Layout.tsx` (via `useSyncExternalStore`-style subscription to `window.matchMedia('(max-width: 1023px)')`) renders `<MobileFallback>` instead of the route content. Nav and Footer are also hidden on mobile (the fallback is single-screen, self-contained). No "view desktop anyway" override — stripped, single-purpose, matches brand tone.
- **Code-splitting is SELECTIVE, not blanket.** Bundle today is **133.9 KB gzipped JS** (67% of 200KB budget). Three routes are split off: `/construction-log` (50-photo `<MonthGroup>` + Lightbox state), `/dev/brand` (QA tooling, never seen by client), `/dev/grid` (QA tooling + fixtures import). Production routes `/`, `/projects`, `/zhk/:slug`, `/contact` stay eager (LCP-relevant, hero render uses imports from these surfaces). SC#3 letter is satisfied via the lazy splits + the documented "bundle 67% of budget" rationale; full route-lazy is over-engineering for a 5-page MVP demo.
- **Lighthouse runs MUST clear sessionStorage between passes** per Phase 5 D-17 — otherwise the second run measures the artificially-cheap static hero (no parallax JS work). Phase 6 plan documents this explicitly: manual run uses incognito, `@lhci/cli` uses `chromeFlags: '--incognito'` or per-run cookie-clear.
- **Phase 7 owns final QA** — keyboard walkthrough, axe-core a11y audit, hard-refresh deep-link verification on production URL, Lighthouse-archive-per-route, `docs/CLIENT-HANDOFF.md` with 8 open §11 items. Phase 6 ships green Lighthouse + working OG; Phase 7 verifies-and-archives.

</domain>

<decisions>
## Implementation Decisions

### M1 — Mobile Fallback (QA-01)

- **D-01:** **Threshold = `<1024px`** (matches SC#1 verbatim). At exactly `1024px` and above → desktop renders graciously (1024-1279 graceful, 1280-1919 polished, 1920×1080 perfect). At `1023px` and below → `<MobileFallback>` replaces the route content. Single integer breakpoint, no fuzzy zone.
- **D-02:** **Detection mechanism = JS viewport-check inside `Layout.tsx`** via `window.matchMedia('(max-width: 1023px)')` subscribed through a tiny `useMatchMedia(query: string): boolean` hook in `src/hooks/useMatchMedia.ts` (sibling of Phase 5's `useSessionFlag.ts`). Reactive — resize/orientation-change updates the flag. CSS-only `@media` rejected because (a) it would still ship the full DOM tree to mobile browsers (waste) and (b) it cannot replace `<Outlet>` semantically (only style-hide it).
- **D-03:** **`<MobileFallback>` REPLACES `<Outlet>` AND hides Nav + Footer.** When `useMatchMedia('(max-width: 1023px)')` is true, `Layout.tsx` short-circuits its return: instead of rendering `<Nav> <main><AnimatePresence><motion.div><Outlet/></motion.div></AnimatePresence></main> <Footer>`, it returns `<MobileFallback />` directly inside the same `<div className="flex min-h-screen flex-col bg-bg">` shell. AnimatePresence is also bypassed on mobile (saves ~3KB Motion-runtime path that mobile users never see).
- **D-04:** **`<MobileFallback>` content (single-column centered, full viewport height):**
  ```
  ┌─────────────────────────────────────┐
  │                                     │
  │           [Logo dark.svg]           │   (~120px wide, 32px top margin)
  │                                     │
  │              ВИГОДА                 │   (Montserrat 700 ~48px wordmark)
  │                                     │
  │  Сайт оптимізовано для екранів     │   (Montserrat 400 ~16px, max-w-[20ch])
  │  ≥1280px. Перегляньте на десктопі   │   (text-text-muted #A7AFBC)
  │  або напишіть нам                   │
  │                                     │
  │  [vygoda.sales@gmail.com]           │   (mailto link, accent-fill)
  │                                     │
  │  ──────────────────                 │   (40% width divider, #A7AFBC opacity 0.2)
  │                                     │
  │  [Проєкти →]                        │   (4 stacked CTA-links, text-only,
  │  [Хід будівництва →]                │    #F5F7FA, focus-visible accent
  │  [Контакт →]                        │    underline; non-functional in mobile
  │  [Перейти до Lakeview ↗]            │    fallback BUT visually present so
  │                                     │    user sees the site has structure.
  │                                     │    Click on any of the first 3 still
  │                                     │    routes to /#/{slug} — desktop URL,
  │                                     │    user sees same fallback. Lakeview
  │                                     │    link IS functional → external CTA.)
  │                                     │
  │  Footer: ТОВ «БК ВИГОДА ГРУП»       │   (#A7AFBC ≥14pt for WCAG AA; one
  │  ЄДРПОУ 42016395                    │    column at bottom, no 3-col
  │  Ліцензія від 27.12.2019            │    treatment from desktop Footer)
  │                                     │
  └─────────────────────────────────────┘
  ```
  Copy lives in `src/content/mobile-fallback.ts` (new module per Phase 2 D-15 scannability rule). Layout uses brand `--spacing-rhythm-*` tokens.
- **D-05:** **No "view desktop anyway" override.** `<MobileFallback>` is the terminal state on `<1024px`. Reasoning: PROJECT.md hard-rule «mobile responsive повний → v2 INFR2-07»; offering an override invites broken-layout reports during demo. Stripped, single-purpose. (Override is the v2 path when full mobile responsive ships.)
- **D-06:** **CTA-links на mobile = same-origin internal links (`/#/projects`, `/#/construction-log`, `/#/contact`) + 1 external (`flagship.externalUrl`).** Internal links navigate to the same fallback page on mobile (because every route gets the fallback at `<1024px`); they exist for visual signal that the site has structure, AND so a user who later opens the link on desktop sees real content. External Lakeview link works on mobile (it's a Lakeview marketing site that handles its own mobile).
- **D-07:** **Mobile fallback NEVER appears on `/dev/brand` and `/dev/grid`** — those are QA tooling routes used by developers/designers who may inspect on tablet sizes and need real content. Layout's mobile-check exempts `useLocation().pathname.startsWith('/dev/')`. (Production routes: full block. QA routes: pass through.)

### M2 — Code-splitting + Bundle Audit (QA-02)

- **D-08:** **Selective `React.lazy()` split, NOT blanket route-lazy.** Bundle today (post-Phase 5) = **133.9 KB gzipped JS** (measured via `gzip -c dist/assets/index-*.js | wc -c` = 137,126 bytes); 67% of the 200KB budget. SC#3 letter is satisfied through the splits below + a documented justification in the Phase 6 README/handoff that aggregate bundle holds the ≤200KB constraint. Routes that get `React.lazy()`:
  - `/construction-log` → `ConstructionLogPage.tsx` (50-photo grid + `<Lightbox>` + `<MonthGroup>` × 4) — the heaviest non-flagship surface
  - `/dev/brand` → `DevBrandPage.tsx` (QA tooling, never seen by client; lazy keeps it OUT of the eager bundle for production users)
  - `/dev/grid` → `DevGridPage.tsx` (QA tooling + `projects.fixtures.ts` import; lazy keeps fixtures OUT of the eager bundle)
- **D-09:** **Production routes `/`, `/projects`, `/zhk/:slug`, `/contact` stay eager.** Reasoning: (a) `/` is LCP entry, lazy-load adds Suspense flash on cold visit; (b) `/projects` and `/zhk/etno-dim` share `<FlagshipCard>` and `<ResponsivePicture>` heavily — lazy creates duplicate chunks for shared deps; (c) `/contact` is ~30 lines of static JSX, not worth a chunk; (d) NotFoundPage stays eager since it's the 404 fallback.
- **D-10:** **`<Suspense fallback={<MarkSpinner />}>`** wraps the `<Routes>` block in `App.tsx` (or just the lazy routes individually — planner picks the cleaner pattern). `<MarkSpinner>` lives at `src/components/ui/MarkSpinner.tsx`: a `<Mark>` cube (existing primitive) centered in `min-h-screen flex items-center justify-center bg-bg`, with a subtle `motion.div` opacity pulse (0.4 → 0.8 over 1.2s, infinite, ease-brand). Reuses Motion lib already in bundle; no new deps. Aligned with brand (cube > generic spinner).
- **D-11:** **Bundle-budget CI gate** added as a 6th check in `scripts/check-brand.ts`: function `bundleBudget()` reads `dist/assets/index-*.js`, gzips in-memory via `node:zlib` `gzipSync`, asserts ≤200KB. Per-chunk budget for lazy chunks: ≤50KB gzipped each (the 3 lazy chunks should land 5-15KB each). Exit code 1 on overshoot — same fail-hard pattern as the other checks. Not optional; aligns with QA-04 «CI denylist» philosophy.
- **D-12:** **Hero image budget CI gate** added as a 7th check: function `heroBudget()` reads `public/renders/lakeview/_opt/aerial-{640,1280,1920}.{avif,webp,jpg}` and asserts each AVIF ≤200KB. Exit code 1 on overshoot. Catches future hero re-shoots that exceed budget. (NB: today aerial-1280.avif = 200,706 bytes — 706 bytes over; aerial-1920.avif = 388,547 bytes — almost 2× over. The Phase 6 sharp-quality re-tune fixes both before this check goes green.)

### M3 — Hero AVIF budget fix (QA-02 SC#3)

- **D-13:** **Drop `aerial-1920.avif` from hero `<link rel="preload" imagesrcset="...">`.** Current `imagesrcset` includes `[640w, 1280w, 1920w]`; on DPR=1 1920×1080 the browser picks 1920w (380KB) for preload but the actual `<img>` (with `sizes="(min-width: 1280px) 768px, 100vw"`) picks 1280w (200KB) — double-fetch waste. New preload `imagesrcset` keeps only `[640w, 1280w]`. The `<img>` inside `<picture>` keeps full `[640w, 1280w, 1920w]` srcset for retina selection — that path uses 1920w on DPR=2 retina but does NOT double-fetch (single resolution per Picture spec).
- **D-14:** **Re-encode `aerial-1280.avif` to land ≤200KB strictly.** Current = 200,706 bytes (706 over). Sharp `quality: 50` produces this; new `quality: 45` for the 1280w bucket on render images will land ~170-185KB (verify during impl). One-line change in `scripts/optimize-images.mjs` per-bucket quality table OR a manifest override for hero-class assets.
- **D-15:** **Re-encode `aerial-1920.avif` to land ≤200KB OR document carve-out.** Current = 388,547 bytes (~380KB). At sharp `quality: 30`, AVIF lands ~180-220KB but visual quality on a 1920×1080 render becomes noticeably blurry. Two routes:
  - **Preferred**: keep `quality: 50` for 1920w but DOCUMENT that the 1920w variant is retina-only (DPR=2) and the QA-02 ≤200KB budget applies to the **loaded format on DPR=1** = `aerial-1280.avif` (≤200KB after D-14 retune). Lighthouse desktop runs at DPR=1 by default → measures 1280w → passes budget.
  - **Fallback**: tighten 1920w to `quality: 35-38` (~220-260KB) and accept the visible quality dip. Planner picks based on visual diff at impl time; recommended is the documented carve-out.
- **D-16:** **`heroBudget()` CI gate (D-12) targets `aerial-1280.{avif,webp,jpg}` strictly** (the loaded variant on DPR=1 — Lighthouse target). The 1920w variant is not gated; it's a retina-only fallback whose budget is "as small as visually acceptable." Documented in script comments.

### M4 — Per-route `<title>` (QA-03 + SEO)

- **D-17:** **`usePageTitle(title: string)` hook in `src/hooks/usePageTitle.ts`.** `useEffect(() => { document.title = title }, [title])`. ~5 lines including JSDoc. Sibling of Phase 5's `useSessionFlag.ts`.
- **D-18:** **Title format = `«{Page} — ВИГОДА»` (em-dash, brand last).** Locked per route:
  - `/` → `«ВИГОДА — Системний девелопмент»` (kept verbatim; matches `og:title` and root brand impression — root has no «{Page} —» prefix)
  - `/projects` → `«Проєкти — ВИГОДА»`
  - `/zhk/etno-dim` → `«ЖК Етно Дім — ВИГОДА»` (uses `project.title`)
  - `/zhk/lakeview` (redirect intermediate frame) → kept root title (renders for ≤1 frame)
  - `/zhk/maietok-vynnykivskyi` etc → redirects don't change title (`<Navigate>` happens before paint)
  - `/construction-log` → `«Хід будівництва Lakeview — ВИГОДА»`
  - `/contact` → `«Контакт — ВИГОДА»`
  - `/dev/brand` → `«Brand QA — ВИГОДА»` (English to signal dev surface)
  - `/dev/grid` → `«Grid QA — ВИГОДА»`
  - 404 → `«404 — ВИГОДА»`
- **D-19:** **Title constants live with each page's content module** (e.g., `src/content/projects.ts` exports `pageTitle: 'Проєкти — ВИГОДА'`). NotFoundPage uses inline string (one-line page, no content module). DevBrand/DevGrid use inline strings (QA tooling, no scannability win from extracting). Per Phase 2 D-15 scannability rule: production page titles in content/, dev surfaces inline.

### M5 — OG / Twitter / canonical / favicon meta (QA-03)

- **D-20:** **All meta is GLOBAL in `index.html`.** HashRouter forces this — crawlers see only the bare URL. Not negotiable in v1; v2 (BrowserRouter at custom domain) opens per-route meta. Phase 6 ships ONE set, locked to home-page framing.
- **D-21:** **Locked OG meta values:**
  - `og:title` = `«ВИГОДА — Системний девелопмент»`
  - `og:description` = `«Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline.»` (143 ch, fits ~155 OG limit)
  - `og:url` = `https://yaroslavpetrukha.github.io/vugoda-website/` (production root; user must confirm github account before deploy if different)
  - `og:image` = `https://yaroslavpetrukha.github.io/vugoda-website/og-image.png` (built artifact at `/og-image.png` per D-26)
  - `og:image:width` = `1200`
  - `og:image:height` = `630`
  - `og:image:alt` = `«ВИГОДА — Системний девелопмент»`
  - `og:type` = `website`
  - `og:locale` = `uk_UA`
  - `og:site_name` = `ВИГОДА`
- **D-22:** **Twitter Card values:**
  - `twitter:card` = `summary_large_image` (verbatim per QA-03)
  - `twitter:title` = same as `og:title`
  - `twitter:description` = same as `og:description`
  - `twitter:image` = same as `og:image`
  - `twitter:image:alt` = same as `og:image:alt`
  - **No `twitter:site` / `twitter:creator`** — no @handle exists in v1; placeholders would be lying. Add in v2 if marketing requests.
- **D-23:** **`<link rel="canonical" href="https://yaroslavpetrukha.github.io/vugoda-website/">`** — production root only. Hashes are not part of canonical URL semantics; per-route canonical is impossible without leaving HashRouter.
- **D-24:** **`<meta name="description">`** = same text as `og:description` (143 ch). Single description for both SEO snippet and OG unfurl.
- **D-25:** **Favicon refinement.** `index.html` already has `<link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg">` (Phase 1 D-24). Phase 6 adds:
  - `<link rel="apple-touch-icon" href="/vugoda-website/apple-touch-icon.png">` (180×180 PNG built from `favicon.svg` via the same `scripts/build-og-image.mjs` extension)
  - `<link rel="icon" type="image/png" sizes="32x32" href="/vugoda-website/favicon-32.png">` (legacy fallback)
  - `<meta name="theme-color" content="#2F3640">` already present, kept
- **D-26:** **Domain-specific build override deferred.** If the user's GitHub account is NOT `yaroslavpetrukha`, the `og:url` / `og:image` / canonical hardcoded URLs need a one-line edit before deploy. Plan documents this as a CLIENT-HANDOFF item AND adds an `OG_URL` env var consumed by the OG-image build script + index.html template (Vite `transformIndexHtml` hook OR a sed pass during prebuild). Recommended: keep hardcoded for v1 demo; switch to env-driven on v2 custom domain.

### M6 — OG image generation (QA-03 sub-decision)

- **D-27:** **OG image source = hand-authored SVG** at `brand-assets/og/og.svg` (1200×630 viewBox). Composition:
  - Background: `#2F3640` solid (matches site bg, matches `theme-color`)
  - Overlay: `<IsometricGridBG>` at opacity 0.15 (faint, brand-consistent ambient layer)
  - Wordmark: «ВИГОДА» Montserrat 700 ~140px, `#F5F7FA`, centered horizontally, ~30% from top
  - Sub-line: «Системний девелопмент» Montserrat 500 ~32px, `#A7AFBC`, centered below wordmark with ~24px gap
  - Accent: a single `<IsometricCube variant='single'>` at right edge, opacity 0.4, `#C1F33D` stroke (one accent dot, brand «accent used sparingly»)
  - No tagline duplicate, no portfolio counts, no CTA — meta description carries that copy in unfurls
- **D-28:** **Build-time PNG export via `scripts/build-og-image.mjs`** (new file, ~40 lines). Reads `brand-assets/og/og.svg`, exports to `public/og-image.png` at exactly 1200×630 via `sharp(svgBuffer).resize(1200, 630).png({ quality: 85 }).toFile(...)`. Wired into `prebuild` chain AFTER `optimize-images.mjs`:
  ```
  "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction && node scripts/build-og-image.mjs"
  ```
  Idempotent: skip if `public/og-image.png` mtime ≥ source SVG mtime (same pattern as `optimize-images.mjs`).
- **D-29:** **Apple touch icon** (180×180 PNG) generated by the same script from `brand-assets/favicon/favicon-32.svg` (existing Phase 1 source). Output: `public/apple-touch-icon.png` and `public/favicon-32.png`. One pre-build pass produces all three artifacts (og-image, apple-touch, favicon-32).
- **D-30:** **Font handling in SVG → PNG export.** Sharp's SVG-to-raster pipeline does NOT load custom fonts — Montserrat will fall back to system if the SVG references it via `<text>` only. Solution: convert wordmark `<text>` to `<path>` in the SVG source (Inkscape Object → Path, OR use an inline `<text>` with embedded `<style>` referencing a base64-data-URI woff2 — heavier). Recommended: pre-compute the «ВИГОДА» wordmark as paths once during SVG authoring; sub-line «Системний девелопмент» can stay as `<text>` with `font-family: sans-serif` fallback (visually acceptable at 32px, OR also pre-pathed). Planner picks at impl based on visual fidelity.

### M7 — Lighthouse verification (QA-02 verification)

- **D-31:** **Two-tier verification: manual + CI-gated.**
  - **Tier 1 (manual, Phase 6 dev pass):** developer runs Chrome DevTools Lighthouse Desktop preset on the deployed URL once per route, in incognito (sessionStorage cleared per Phase 5 D-17 caveat). Saves screenshots to `.planning/phases/06-performance-mobile-fallback-deploy/lighthouse/{route}.png` for handoff archive (Phase 7 reuses).
  - **Tier 2 (CI gate, post-deploy):** `@lhci/cli` step added to `deploy.yml` AFTER `actions/deploy-pages@v4`, running `lhci autorun --collect.url=...` for the 5 production routes. Configuration in `.lighthouserc.cjs`:
    ```js
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
          settings: { preset: 'desktop', chromeFlags: '--incognito' },
          numberOfRuns: 1,
        },
        assert: {
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
            'categories:seo': ['error', { minScore: 0.9 }],
          },
        },
      },
    };
    ```
  Tier 2 fails the deploy if any route < 90 on any category. Tier 1 is the dev's "find problems before CI rejects you" loop.
- **D-32:** **`@lhci/cli` is a `devDependency`**, not bundled (only runs in CI). Adds ~30 packages to `node_modules` but zero runtime/bundle weight. Action runner uses cached `node_modules` from prior steps.
- **D-33:** **Lighthouse audit excludes `/dev/brand` and `/dev/grid`** (QA tooling, may use forbidden patterns like fixture-import, may render unoptimized state). Production-only audit.

### M8 — deploy.yml extension (DEP-01)

- **D-34:** **`.github/workflows/deploy.yml` gets ONE new job: `lighthouse`** depending on `deploy`. After deploy succeeds, lhci runs against the live URL. Failure of `lighthouse` does NOT roll back the deploy (artifact is already published — rollback would require manual deploy of prior commit), but it FAILS the workflow visibly so PR/merge ergonomics surface the regression. The `concurrency: { group: pages, cancel-in-progress: true }` setting stays — only one deploy at a time.
- **D-35:** **Existing `check-brand` step gains the new bundle/hero budget checks** (D-11, D-12) automatically (they're added to `scripts/check-brand.ts`, which the step already invokes). No new step needed for budget gates.
- **D-36:** **`peaceiris/actions-gh-pages` and `gh-pages` npm package — REJECTED again** (per Phase 1 D-15). Phase 6 doesn't touch the Pages publishing pattern.

### M9 — Public URL verification (DEP-02)

- **D-37:** **Final verification = browse from cold incognito tab.** Phase 6 manual checklist (in plan):
  - `https://yaroslavpetrukha.github.io/vugoda-website/` (root) — loads, hero paints, CTA navigates to `/#/projects`
  - `https://yaroslavpetrukha.github.io/vugoda-website/#/projects` — direct paste, no click-through, full page renders
  - `https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim` — same
  - `https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log` — same; lazy chunk loads with `<MarkSpinner>` fallback briefly
  - `https://yaroslavpetrukha.github.io/vugoda-website/#/contact` — same
  - Paste root URL into Telegram + Slack + Viber chat — clean unfurl with «ВИГОДА — Системний девелопмент» title, description, 1200×630 OG image
  - Resize browser to 800×600 — `<MobileFallback>` renders; logo + wordmark + email + 4 CTAs visible
  - Set DevTools `prefers-reduced-motion: reduce` — hero is static, page transitions instant, fallback unaffected
- **D-38:** **GitHub account confirmation** is a CLIENT-HANDOFF item BEFORE deploy. If account ≠ `yaroslavpetrukha`, edit the 4 hardcoded URLs (D-21, D-23, D-31 lhci config) in one PR before merging Phase 6 to main. Document in plan.

### Folded Todos

_None — `gsd-tools todo match-phase 6` returned 0 matches at discussion time. Cross-reference recommended at planning if backlog has been updated since._

### Claude's Discretion (planner picks within brand)

- Exact `<MarkSpinner>` opacity-pulse magnitude (0.4→0.8 vs 0.5→1.0) and duration (1.0s vs 1.2s vs 1.5s) — brand «стримано», planner tunes at browser
- Whether the OG SVG wordmark is pre-pathed (Inkscape) or kept as `<text>` with embedded font (sharp may or may not pick up `@font-face` from inline `<style>`; pre-pathed is safer)
- Apple touch icon styling: identical to `favicon.svg` rasterized to 180×180, OR a slightly tighter crop with extra padding for iOS rounded-corner masking — planner verifies on real iOS device
- Mobile fallback exact spacing/typography tuning at 320px, 375px, 414px, 768px viewports
- Whether `useMatchMedia` returns just `boolean` or `[boolean, query: string]` — boolean is enough for Phase 6's single use site, but hook ergonomics may diverge
- Lighthouse-CI failure handling: hard-fail the workflow OR set `failOnError: false` and let it warn (recommended hard-fail per D-31; but if flaky on CI Chromium, planner can flip)
- Whether the bundle-budget script measures gzipped size via `node:zlib gzipSync` (in-process, no shell-out) or `gzip -c | wc -c` (subprocess, simpler). Same result; in-process is portable across Linux/macOS GitHub Actions runners.
- Order of new index.html `<meta>` tags (semantic groups: charset/viewport → SEO description → OG → Twitter → favicon → preload). Planner picks for readability.
- Whether `usePageTitle` is named-export OR default-export — Phase 1+ pattern is named-export from `src/hooks/`; planner follows.
- Whether dev `<MarkSpinner>` consumer of Suspense fallback uses Motion or a CSS-only `@keyframes` pulse. Motion is already in bundle so no weight cost; CSS-only is one less dependency in the file. Planner picks; CSS-only is recommended for the smallest blast radius (Suspense fallback on lazy chunk failure paths).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)

- `.planning/REQUIREMENTS.md` §QA — QA-01 (mobile fallback `<1024px`, graceful 1280-1919, perfect 1920×1080), QA-02 (Lighthouse desktop ≥90 all 4 categories, hero ≤200KB, JS bundle ≤200KB gzipped), QA-03 (OG meta + Twitter Card + theme-color + canonical + favicon; clean Telegram/Slack/Viber unfurl)
- `.planning/REQUIREMENTS.md` §Deploy — DEP-01 (`.github/workflows/deploy.yml` with `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`; NOT `gh-pages` npm package), DEP-02 (live `https://yaroslavpetrukha.github.io/vugoda-website/` accessible from incognito)
- `.planning/REQUIREMENTS.md` §Visual System — VIS-04 (favicon source `brand-assets/favicon/favicon-32.svg`)
- `.planning/ROADMAP.md` §"Phase 6: Performance, Mobile Fallback, Deploy" — Success Criteria 1–5 (authoritative test surface; SC#3 verbatim mentions `React.lazy()` per-route — D-08/D-09 ships selective lazy + documented bundle-budget rationale)

### Project-level policy

- `.planning/PROJECT.md` §Core Value — desktop-first 1920×1080 «ахуєнний» demo; clickable URL handed to client
- `.planning/PROJECT.md` §Constraints — Lighthouse Desktop ≥90, hero ≤200KB AVIF/WebP, JS bundle ≤200KB gzipped, WCAG 2.1 AA, desktop-first 1920×1080 with graceful fallback below 1280, mobile/tablet → v2
- `.planning/PROJECT.md` §Out of Scope — no team photos, no analytics in v1, no privacy-policy link, no full mobile responsive (v2 INFR2-07), no CMS, no real form backend, `gh-pages` npm package, custom domain (v2 INFR2-02), BrowserRouter (v2 INFR2-03)
- `.planning/PROJECT.md` §Key Decisions — HashRouter, Core-4 scope, UA-only, mailto-only forms

### Prior-phase decisions (Phase 6 inherits and extends)

- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-15..D-18 — `deploy.yml` already exists with verbatim STACK.md workflow; Phase 6 EXTENDS (not rebuilds) with Lighthouse job + budget checks
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-22 — HashRouter (drives D-20 «OG meta is necessarily global» constraint)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-24 — `index.html` already has `theme-color="#2F3640"` + `<title>` + `<html lang="uk">`; Phase 6 adds OG/Twitter/canonical/description meta tags AROUND these existing ones
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-21 — `:focus-visible` accent outline (Phase 6 `<MobileFallback>` mailto + CTA links MUST preserve this; trivially satisfied by existing global CSS rule)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-15 — content-module scannability (drives D-19 «production page titles in content/, dev surfaces inline» + D-04 «mobile-fallback.ts» content module)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-19 — em-dash `—` placeholders (no Phase 6 surface uses these directly; consistency note)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-24..D-29 — `scripts/check-brand.ts` 5-check pattern (Phase 6 D-11/D-12 add a 6th `bundleBudget()` and 7th `heroBudget()` check using the same fail-hard exit-code pattern)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-32..D-33 — `importBoundaries()` enforces `<ResponsivePicture>` uses `renderUrl` helpers (Phase 6 mobile fallback uses `<Logo>` only — does not touch image asset paths; `og-image.png` is in `public/` root, not under `renders/` or `construction/`, so the helper system doesn't apply)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-18..D-23 — image pipeline + `<ResponsivePicture>` (Phase 6 D-13..D-16 tunes existing pipeline, doesn't add new component)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-19 — sharp encoder params (AVIF q=50, WebP q=75, JPG q=80) — Phase 6 D-14 lowers AVIF q for hero-class assets to land ≤200KB
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-25..D-26 — `/dev/brand` route pattern; Phase 6 D-07 exempts `/dev/*` from mobile fallback (QA tooling)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §D-28 — `<Mark>` component (Phase 6 D-10 reuses inside `<MarkSpinner>` Suspense fallback)
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §Integration Points — «Phase 6 Lighthouse audit on `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact` — verifies hero LCP, bundle size, image budgets» — Phase 6 D-31 wires this; «Phase 6 mobile fallback at <1024px — REPLACES Phase 4 pages on mobile devices entirely» — D-03 confirms
- `.planning/phases/05-animations-polish/05-CONTEXT.md` §D-17..D-21 — `useSessionFlag` hook + sessionStorage `vugoda:hero-seen` (drives D-31 caveat: Lighthouse must clear sessionStorage between runs)
- `.planning/phases/05-animations-polish/05-CONTEXT.md` §Integration Points — «Phase 6 Lighthouse audit on `/` — Phase 5's hero session-skip means a reload-during-Lighthouse-pass measures the static hero (no parallax JS work) — the second pass is therefore artificially cheap. Phase 6 should run Lighthouse with sessionStorage cleared between runs.» — D-31 documents in plan, lhci config uses `--incognito`

### Research artifacts

- `.planning/research/STACK.md` §"GitHub Pages Deploy — Workflow Shape" — verbatim `.github/workflows/deploy.yml` (already shipped Phase 1 D-15; Phase 6 D-34 adds Lighthouse job after deploy)
- `.planning/research/STACK.md` §"Stack Patterns by Variant" → Router subsection — HashRouter decision rationale (drives D-20 OG-global constraint); v2 path noted
- `.planning/research/STACK.md` §"Testing Posture for MVP" — `@lhci/cli` listed as «Optional, nice-to-have» — Phase 6 D-31..D-32 promotes to «yes, hard CI gate» based on Phase 6 own QA-02 verification need
- `.planning/research/STACK.md` §"What NOT to Use" — `gh-pages` npm package, `peaceiris/actions-gh-pages`, BrowserRouter+404.html shim — all rejected; Phase 6 stays with official GitHub Pages actions
- `.planning/research/STACK.md` §"Stack Patterns by Variant" → Image Pipeline → Path A — sharp script (already shipped Phase 3 D-19); Phase 6 D-28 extends with `build-og-image.mjs` peer script
- `.planning/research/ARCHITECTURE.md` §6 Anti-Pattern 8 — public/ vs src/assets/ asset placement (drives D-29 OG image at `public/og-image.png`, served as static at production root)
- `.planning/research/PITFALLS.md` §Pitfall 8 — Hero LCP regression (Phase 6 D-13..D-16 mitigations: limit preload widths, retune quality, CI gate)
- `.planning/research/PITFALLS.md` §Pitfall 9 — AVIF fallback trap (`<picture>` already emits AVIF→WebP→JPG; Phase 6 doesn't change this)
- `.planning/research/PITFALLS.md` §Pitfall 14 — mobile/tablet broken in practice (Phase 6 D-01..D-07 mitigates with explicit fallback rather than pretending mobile works)
- `.planning/research/PITFALLS.md` §Pitfall 16 — `will-change: transform` (out of scope here; Phase 5 left default «don't add it»; Phase 6 Lighthouse may surface need — D-31 manual run is the canary)

### Brand authority (visual + content DNA)

- `brand-system.md` §3 — palette (6 hexes; `<MobileFallback>` uses `bg-bg`, `text-text`, `text-text-muted`, `bg-accent` for mailto button; OG SVG uses same 4)
- `brand-system.md` §4 — typography (Montserrat 400/500/700; OG SVG wordmark = 700, sub-line = 500)
- `brand-system.md` §5 — isometric line params (OG SVG cube respects stroke 0.5–1.5pt + 3 allowed colors `#A7AFBC`/`#F5F7FA`/`#C1F33D` + opacity 5–60%)
- `brand-system.md` §6 — DO/DON'T (Phase 6 respects: NO bouncy springs in `<MarkSpinner>` pulse, NO multi-color OG image, NO gradient on OG, NO photo background on OG)
- `brand-system.md` §7 — layout scale (`<MobileFallback>` uses `--spacing-rhythm-*` tokens consistently with desktop)
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 — tone of voice (стримано, без хвастощів) — drives D-04 mobile copy and D-21 og:description wording
- `КОНЦЕПЦІЯ-САЙТУ.md` §11 — open client items (drives D-26/D-38 GitHub-account-confirmation handoff item)

### Brand assets (authoritative SVG sources)

- `brand-assets/logo/dark.svg` — used by `<MobileFallback>` logo top-of-screen and Footer-style legal block (Phase 1 already exposes via `<Logo>` component; reused)
- `brand-assets/favicon/favicon-32.svg` — source for `public/favicon.svg` (existing) + new `public/favicon-32.png` and `public/apple-touch-icon.png` (Phase 6 D-29)
- `brand-assets/patterns/isometric-grid.svg` — source for `<IsometricGridBG>` overlay in OG SVG composition (D-27)
- `brand-assets/og/og.svg` — **NEW for Phase 6** — hand-authored 1200×630 SVG composition (D-27)
- `brand-assets/mark/mark.svg` — wraps `<Mark>` component used inside `<MarkSpinner>` (D-10)

### Components Phase 6 modifies (built in Phases 1–5)

- `src/components/layout/Layout.tsx` — Phase 6 adds mobile-viewport check; short-circuits to `<MobileFallback>` at `<1024px` for non-`/dev/*` routes (D-02..D-07)
- `src/App.tsx` — Phase 6 wraps Routes in `<Suspense>`; converts `/construction-log`, `/dev/brand`, `/dev/grid` imports to `React.lazy()` (D-08..D-10)
- `index.html` — Phase 6 adds OG/Twitter/canonical/description/apple-touch-icon meta tags + LIMITS hero preload `imagesrcset` to `[640w, 1280w]` (D-13, D-21..D-25)
- `scripts/optimize-images.mjs` — Phase 6 D-14 tunes AVIF quality for hero-class assets (`aerial-1280` strict ≤200KB)
- `scripts/check-brand.ts` — Phase 6 adds `bundleBudget()` (D-11) + `heroBudget()` (D-12) as 6th + 7th checks
- `package.json` — Phase 6 adds `@lhci/cli` to devDependencies; extends `prebuild` chain with `build-og-image.mjs` step
- `.github/workflows/deploy.yml` — Phase 6 adds `lighthouse` job depending on `deploy` (D-34)
- `src/pages/HomePage.tsx`, `ProjectsPage.tsx`, `ZhkPage.tsx`, `ConstructionLogPage.tsx`, `ContactPage.tsx`, `NotFoundPage.tsx`, `DevBrandPage.tsx`, `DevGridPage.tsx` — Phase 6 wires `usePageTitle()` per route (D-17, D-18)
- `src/content/projects.ts`, `home.ts` (or new), `zhk-etno-dim.ts`, `construction.ts` (page title), `contact.ts` — Phase 6 adds `pageTitle` exports per page (D-19)

### Components Phase 6 adds

- `src/components/layout/MobileFallback.tsx` (D-04)
- `src/components/ui/MarkSpinner.tsx` (D-10)
- `src/hooks/useMatchMedia.ts` (D-02)
- `src/hooks/usePageTitle.ts` (D-17)
- `src/content/mobile-fallback.ts` (D-04)
- `scripts/build-og-image.mjs` (D-28, D-29)
- `brand-assets/og/og.svg` (D-27)
- `.lighthouserc.cjs` (D-31)

### Data Phase 6 consumes

- None new. Phase 6 reads `flagship.externalUrl` (Lakeview link in `<MobileFallback>` CTA) + `legalName/edrpou/licenseDate` (mobile fallback footer block) — already in Phase 2 modules.

### External documentation (downstream agents may reference at impl)

- Lighthouse CI config reference — https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md (latest; `assertions` block format used in D-31 verbatim)
- OpenGraph protocol spec — https://ogp.me (drives D-21 tag list completeness)
- Twitter Card meta tags — https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards (drives D-22 tag list)
- sharp SVG → PNG — https://sharp.pixelplumbing.com/api-input#input (font fallback caveat noted in D-30)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 1–5)

- **`Layout.tsx`** (Phase 5) — already imports `useReducedMotion` and `AnimatePresence`. Phase 6 adds one more hook (`useMatchMedia`) at top + an early-return branch for mobile. Net edit: ~10 lines.
- **`index.html`** (Phase 1 + Phase 3) — already carries `theme-color`, `favicon.svg`, hero AVIF preload `imagesrcset`. Phase 6 adds OG/Twitter/canonical/description meta + apple-touch-icon link + limits preload `imagesrcset` to `[640w, 1280w]`. Single file edit.
- **`<Mark>` component** (Phase 3 D-28) — Phase 6 reuses inside `<MarkSpinner>` (Suspense fallback). No edits to `<Mark>`.
- **`<Logo>` component** (Phase 1 D-05) — Phase 6 reuses inside `<MobileFallback>`. No edits.
- **`<IsometricCube variant='single'>`** (Phase 3 D-07..D-09) — referenced inside the OG SVG (D-27); SVG can either inline-copy a cube path OR be a hand-authored composition. Recommended: inline-copy (one-time author task; OG SVG doesn't need runtime React reference).
- **`<IsometricGridBG>`** (Phase 3 D-03) — referenced inside the OG SVG; same inline-copy treatment.
- **`scripts/optimize-images.mjs`** (Phase 3 D-19) — Phase 6 tunes AVIF quality (per-bucket override) and adds peer script `build-og-image.mjs`.
- **`scripts/check-brand.ts`** (Phase 2 D-24..D-29 + Phase 5 D-27) — already 5 checks; Phase 6 adds 2 more checks (`bundleBudget`, `heroBudget`) following the same exit-code-aggregate pattern.
- **`src/hooks/useSessionFlag.ts`** (Phase 5 D-21) — first member of `src/hooks/`. Phase 6 adds `useMatchMedia` and `usePageTitle` as siblings; same one-file-one-hook pattern.
- **`src/lib/motionVariants.ts`** (Phase 5 D-22) — `<MarkSpinner>` opacity-pulse can use `easeBrand` + `durations.slow` for the breathing effect, OR a CSS-only `@keyframes` pulse with `var(--ease-brand)`. Either is fine.
- **Existing GitHub Actions workflow** (`.github/workflows/deploy.yml`) — runs `npm ci`, `npm run build`, `check-brand`, `upload-pages-artifact`, `deploy-pages`. Phase 6 D-34 adds a peer `lighthouse` job.

### Anti-list — DO NOT introduce in Phase 6

- `react-helmet`, `react-helmet-async` — `usePageTitle` hook is one-line `useEffect`; no need for a library
- `gh-pages` npm package — Phase 1 already chose `actions/deploy-pages@v4`; never deviate
- `peaceiris/actions-gh-pages` — same reason
- `next-pwa`, `vite-plugin-pwa` — no service worker, no offline; out of scope for static demo
- BrowserRouter + 404.html shim — DEP-03 hard-locks HashRouter for v1
- `react-meta-tags`, `react-document-meta` — global meta lives in static `index.html`; per-route is impossible with HashRouter
- Manual `og-image.png` commit — D-27/D-28 generates it from SVG; no static binary in git
- `swiper` / `embla-carousel` — out of scope; mobile fallback is a static page, not a slider
- `iframe-resizer`, `react-responsive` — `useMatchMedia` is 8 lines of native browser API; no library
- New `<Provider>` / context wrapping the App — D-02 hooks are leaf-level, no cross-component state
- Spring animations on `<MarkSpinner>` — brand-system §6 explicit DON'T; Phase 5 reaffirmed
- Per-route OG meta via `<Helmet>` style — impossible with HashRouter; documented v2 path
- Image hosting CDN (Cloudinary, ImageKit) — sharp + GH Pages CDN is sufficient for v1
- HTTP basic auth, password gates — out of scope; the URL is the demo

### Established Patterns

- **CSS-var + JS-const lockstep** (Phase 1 D-19 palette, Phase 5 D-23 ease-brand) — Phase 6 stays consistent: bundle-budget literal `200 * 1024` lives in `check-brand.ts` constants block; if budget ever changes, update there
- **Per-component `useReducedMotion()`** (Phase 5 D-25) — `<MarkSpinner>` follows: if reduced-motion, render static `<Mark>` without pulse (`@media (prefers-reduced-motion: reduce)` block in CSS, or hook conditional in JS)
- **Tailwind v4 `@utility` + tokens** (Phase 5 D-23/D-24) — `<MobileFallback>` uses `--spacing-rhythm-*` tokens; layout uses `flex flex-col items-center justify-center min-h-screen` consistent with rest of site
- **Brand-primitive immutability** (`src/components/brand/*`) — Phase 6 does NOT edit `<Logo>`, `<Mark>`, `<IsometricCube>`, `<IsometricGridBG>`. New `<MarkSpinner>` lives in `src/components/ui/` (composition, not a primitive)
- **Boundary stack** (Phase 2 D-32) — Phase 6's `<MobileFallback>` lives in `src/components/layout/` (alongside Layout/Nav/Footer); imports `<Logo>` from brand/, content from `src/content/mobile-fallback.ts`

### Integration Points (Phase 6 → Phase 7)

- Phase 7 keyboard walkthrough audits Phase 6 mobile fallback links (CTA Tab order; mailto activates in mailto-aware browsers; focus-visible on each link)
- Phase 7 axe-core a11y audit confirms mobile fallback contrast (`#A7AFBC` on `#2F3640` muted text — needs ≥14pt per Phase 1 D-21 / brand-system.md §3 rule; CTA accent on dark passes 8.85:1)
- Phase 7 hard-refresh test verifies HashRouter deep-links survive Phase 6 changes (lazy chunks load via Suspense without breaking deep URL flow)
- Phase 7 archives final Lighthouse runs to `docs/CLIENT-HANDOFF.md` referencing Phase 6's screenshot folder (Tier 1) + lhci CI artifact (Tier 2)
- Phase 7 verifies OG unfurl visually in real Telegram + Slack + Viber clients (Phase 6 D-21..D-22 ships meta; Phase 7 confirms human-eye result)

</code_context>

<specifics>
## Specific Ideas

### Hero AVIF re-encoding strategy (D-13..D-16)

- **The DPR=1 double-fetch is the real waste.** On Lighthouse Desktop preset (DPR=1, viewport ~1350×940), `imagesrcset="640w, 1280w, 1920w"` + `imagesizes="(min-width: 1280px) 768px, 100vw"` resolves the preload to 1280w (768 effective px → 1280w bucket). But our network audit captured BOTH `aerial-1920.avif` AND `aerial-1280.avif` GETs — meaning the actual render layer chose 1920w (likely because the `<picture>` `<source>` tags don't match the preload's sizes hint). Stripping 1920w from preload `imagesrcset` is the clean fix; the `<picture>` source still carries 1920 for retina rendering, and retina selection happens once (single GET).
- **`aerial-1280.avif` budget fix is one-line:** `optimize-images.mjs` line 36 currently `quality: 50`; for the 1280w bucket we want q=45 → expected ~175-185KB (verify). Easiest: per-asset override map keyed by basename + width, OR a slightly more aggressive global q=45 that affects all renders (acceptable; 1280w is already a fallback-not-LCP for non-hero renders).
- **Hero preload ≤200KB success criterion has been silently violated since Phase 3 ship.** Audit confirms 200,706 bytes — a 706-byte overshoot. Phase 6 D-14 is the first explicit fix.

### Mobile fallback breakpoint precision (D-01)

- Set `(max-width: 1023px)` matchMedia query → triggers at 0..1023px exactly. At 1024px the fallback unmounts and desktop layout mounts. No fuzzy zone, no flicker.
- iPad portrait at 768px → fallback renders. iPad landscape at 1024px → desktop renders (intentional; iPad horizontal viewport handles desktop site at 1024 fine, per audit screenshot). MacBook 13" notebook at 1280×800 → desktop renders comfortably.
- iPhone 14 (390×844) → fallback renders. Galaxy S23 (360×800) → fallback renders.

### `<MarkSpinner>` minimal CSS-only implementation (D-10)

```css
@utility mark-pulse {
  animation: mark-pulse 1.2s var(--ease-brand) infinite alternate;
}

@keyframes mark-pulse {
  from { opacity: 0.4; }
  to { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .mark-pulse { animation: none; opacity: 0.6; }
}
```

Component:

```tsx
export function MarkSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg" role="status" aria-live="polite">
      <Mark className="mark-pulse w-12 h-12" aria-label="Завантаження" />
    </div>
  );
}
```

~10 lines total + the @utility block in `index.css`. Brand-consistent, no Motion runtime needed in the Suspense fallback path (so the chunk it gates is genuinely lazy without dragging Motion forward).

### OG image SVG sketch (D-27)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#2F3640" />
  <!-- IsometricGridBG paths, copy from brand-assets/patterns/isometric-grid.svg, scaled, opacity 0.15 -->
  <g opacity="0.15">
    <!-- ... cube tile pattern ... -->
  </g>
  <!-- Wordmark — pre-pathed Montserrat 700 «ВИГОДА» -->
  <g transform="translate(220, 240)">
    <!-- 5 letter paths for В И Г О Д А -->
  </g>
  <!-- Sub-line -->
  <text x="600" y="430" text-anchor="middle" fill="#A7AFBC"
        font-family="Montserrat, sans-serif" font-weight="500" font-size="32">
    Системний девелопмент
  </text>
  <!-- Single isometric cube accent, top-right -->
  <g transform="translate(1050, 90)" stroke="#C1F33D" stroke-width="1.5" fill="none" opacity="0.4">
    <!-- 3 polygon paths from IsometricCube variant='single' -->
  </g>
</svg>
```

### Bundle-budget script outline (D-11)

```ts
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function bundleBudget(): boolean {
  const assetsDir = 'dist/assets';
  if (!existsSync(assetsDir)) return true; // skip in dev
  const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
  const eagerJs = jsFiles.find(f => f.startsWith('index-')); // main entry
  if (!eagerJs) {
    console.error('[check-brand] FAIL bundleBudget — no entry chunk found');
    return false;
  }
  const buf = readFileSync(join(assetsDir, eagerJs));
  const gz = gzipSync(buf).length;
  const limit = 200 * 1024;
  if (gz > limit) {
    console.error(`[check-brand] FAIL bundleBudget — ${eagerJs} = ${gz} bytes gzipped (limit ${limit})`);
    return false;
  }
  console.log(`[check-brand] PASS bundleBudget — ${(gz/1024).toFixed(1)} KB gzipped (${((gz/limit)*100).toFixed(0)}% of limit)`);
  return true;
}
```

Same pattern for `heroBudget()` reading `aerial-1280.{avif,webp,jpg}`.

### Commit granularity (suggested for planner)

1. `feat(06-01): src/hooks/{useMatchMedia,usePageTitle}.ts — hooks foundation`
2. `feat(06-02): src/components/layout/MobileFallback.tsx + content/mobile-fallback.ts + Layout.tsx integration`
3. `feat(06-03): App.tsx React.lazy split for /construction-log + /dev/* + MarkSpinner Suspense fallback`
4. `feat(06-04): index.html OG/Twitter/canonical/description meta + apple-touch-icon + limit hero preload to [640,1280]`
5. `feat(06-05): scripts/build-og-image.mjs + brand-assets/og/og.svg + prebuild chain extension`
6. `feat(06-06): scripts/optimize-images.mjs AVIF q tune + check-brand.ts bundleBudget + heroBudget`
7. `feat(06-07): per-route usePageTitle wiring across 8 page components`
8. `feat(06-08): @lhci/cli + .lighthouserc.cjs + deploy.yml lighthouse job`
9. `chore(06-09): client-handoff GitHub-account confirmation note in plan/README`

Planner reorders by wave (foundation → consumers → CI gate) and parallelizes where possible (hooks file pair + OG SVG can ship parallel).

### Doc-block self-consistency pre-screen

Phase 5 noted a recurring doc-block-grep collision pattern. Phase 6's grep gates:
- `paletteWhitelist()` — Phase 6 introduces NO new hex literals in components (mobile fallback uses Tailwind utilities; OG SVG hex literals live in `brand-assets/og/og.svg` — `.svg` extension is OUTSIDE the script's `.{ts,tsx,css}` scope).
- `denylistTerms()` — Phase 6 NEVER mentions Pictorial/Rubikon (they're not in mobile copy, OG copy, page titles, hook docs).
- `placeholderTokens()` — Phase 6's mobile fallback copy does NOT use `{{...}}`. Plan doc-blocks are screened pre-PR.
- `importBoundaries()` — Phase 6 hooks are leaf-level (no cross-import); OG image script is scripts/-only (no src/ boundary issues).
- `noInlineTransition()` — Phase 6 motion is CSS-only (`<MarkSpinner>` `@keyframes`); no `transition={{...}}` JSX prop introduced.
- New `bundleBudget()` / `heroBudget()` — own checks, can't collide with self.

Pre-screen says zero collisions. Planner verifies during plan-doc authoring.

### Variants the audit confirmed are NOT problems

- **`/zhk/etno-dim` blank screen at 1920×1080** — false alarm. mainHeight=2228, content fully rendered. Audit screenshot was taken before AVIF hero loaded; the `bg-bg` (#2F3640) painted while AVIF was in-flight, looking deceptively blank. Real bug not present.
- **Bundle gzipped vs. uncompressed** — uncompressed JS is 445KB but `gzip -c | wc -c` measures 137KB (133.9KB rounded). Stay-on-target.
- **Console errors** — zero across all 5 routes during navigation. Phase 5's AnimatePresence + Phase 4's lightbox + Phase 3's hero parallax all clean.
- **Reduced-motion query reactive** — `window.matchMedia('(prefers-reduced-motion: reduce)').matches` returns false in test env (no DevTools emulation), but the hook subscription is in place per Phase 5 D-25.

</specifics>

<deferred>
## Deferred Ideas

### Pulled from audit findings (NOT Phase 6 scope)

- **`/construction-log` 3-в-ряд instead of 4-в-ряд at ≥1280px** — Phase 4 D-22 specified «4-column at ≥1280px». Audit at 1920×1080 shows 3-column. This is a Phase 4 visual regression; Phase 6 does NOT fix it. Trigger `/gsd:debug` after Phase 6 ships, or surface in Phase 7 keyboard walkthrough as a UX cleanup PR.
- **Race condition in parallel `npm run build`** — running two `npm run build` simultaneously locally creates write-conflicts in `public/{renders,construction}/_opt/` directories. CI runs single-build-per-job so it's not a blocker for green deploys; document as «do not parallelize local builds» in `README.md` or plan note. Not a Phase 6 task surface.
- **`<title>` flicker during Phase 5 `pageFade` route transitions** — `usePageTitle` fires on mount, AnimatePresence holds the old route 350ms during exit. Title updates IMMEDIATELY (browser-tab readability win), so for 350ms the user sees old route content with new title. Acceptable; alternative «defer title until after transition» adds complexity for a UX subtlety nobody will notice in a static-content site. Document as known-and-accepted; revisit in v2 if user feedback requests sequencing.

### Out-of-scope features (v2 / never)

- **Per-route OG meta** — impossible with HashRouter; v2 INFR2-03 (BrowserRouter + custom domain) opens this. Until then, root-only OG is correct.
- **Custom domain** — v2 INFR2-02. Phase 6 ships at `*.github.io`; switching to `vugoda.com.ua` (or similar) is a 1-PR change to `og:url`/canonical/lhci-config + DNS. Plan documents the variables.
- **`@lhci/cli` build-time gate (not deploy-time gate)** — D-31 runs lhci AFTER deploy. Some teams prefer to fail at PR-merge before deploy. Trade-off: pre-deploy gate adds a deploy-preview step (Vercel-style) which GitHub Pages doesn't support natively; would require manual `vite preview` + lhci against localhost in CI. Out of scope for MVP; v2 if needed.
- **Service worker / PWA** — out of scope; static demo, no offline need
- **Real-time analytics in Lighthouse output** — `@lhci/cli` plain mode only; no Datadog/CloudWatch integration. v2 if marketing wants performance trends.
- **Bundle-size visualization (rollup-plugin-visualizer, source-map-explorer)** — useful for DEEP optimization beyond Phase 6's needs. Bundle is 67% of budget; no need to dig. Add at v2 if budget tightens.
- **CDN for OG image** — `og-image.png` is served from GH Pages CDN; sufficient for demo. v2 might host on Cloudinary for transformation flexibility.
- **OG image variants per locale** — UA-only in v1 (PROJECT.md). v2 EN locale (FEAT2-06) might need an `og-image-en.png`.
- **OG image dynamic generation per route** — impossible with HashRouter; v2 BrowserRouter could use `@vercel/og` style runtime-OG service. v2.
- **Apple touch icon at multiple sizes** (152×152, 167×167, 180×180) — D-29 ships only 180×180 (covers iOS 14+). Older iOS versions degrade gracefully to favicon.
- **Open Graph article-type meta** (`og:type="article"` for blog posts) — no blog in v1; not needed.
- **Twitter @handle / `twitter:site` / `twitter:creator`** — no @handle exists; D-22 explicit skip.
- **`hreflang` alternate links** — UA-only site; no alternates. v2 EN adds them.
- **`<link rel="manifest">` / `manifest.json`** — would require PWA setup; not needed for static demo.
- **Robots / sitemap.xml** — `<meta name="robots" content="index, follow">` is the default; explicit ship is unnecessary. `sitemap.xml` for 5 routes can be hand-authored or generated at v2 when custom domain + analytics matter for SEO.
- **Service worker offline mobile fallback** — D-03 mobile fallback is a single online page; offline is not a concern (the fallback IS the offline-style page). No SW needed.
- **`viewport` meta tweak for mobile fallback** — current `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is correct for both desktop and the mobile fallback page. No change.
- **`prefers-color-scheme: dark`** — site IS dark by default (brand); no light theme. Out of scope.
- **CSS `content-visibility: auto` for off-screen sections** — Phase 6 may add to `/construction-log` 50-photo grid as a Lighthouse-perf hint if needed; default «don't add» until the manual run shows demand.
- **HTTP cache-control headers** — GH Pages serves with default headers; no edit possible without custom domain + CDN. v2.
- **Web Vitals reporting (`web-vitals` lib)** — out of scope; analytics is v2.

### Reviewed Todos (not folded)

_No pending todos matched this phase at discussion time (`gsd-tools todo match-phase 6` → 0 matches)._

</deferred>

---

*Phase: 06-performance-mobile-fallback-deploy*
*Context gathered: 2026-04-26*
*Audit-informed: real bytes measured, real browser tested at 1920/1280/1024/375 viewports*
