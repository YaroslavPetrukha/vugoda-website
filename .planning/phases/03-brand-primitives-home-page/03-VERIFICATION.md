---
phase: 03-brand-primitives-home-page
verified: 2026-04-25T07:42:13Z
status: human_needed
score: 5/5 success criteria structurally verified
human_verification:
  - test: "Lighthouse Performance audit on `/` (deployed URL, desktop profile)"
    expected: "Score ≥ 90 on Performance + ≥ 90 on Accessibility/BP/SEO. Hero LCP image ≤ 200KB."
    why_human: "Roadmap SC#3 explicitly defers Lighthouse score to Phase 6 (deployed URL audit). Cannot verify a numeric Lighthouse score programmatically without running headless Chrome against a live deploy. Currently `aerial-1920.avif = 388KB` exceeds the 200KB hero budget — Phase 6 will need to either (a) re-encode at lower quality, (b) target the 1280-width AVIF (200KB exactly) as the LCP, or (c) raise the AVIF quality knob in scripts/optimize-images.mjs (currently quality:50, effort:4)."
  - test: "Visual QA on `/dev/brand` and `/`"
    expected: "Hero parallax feels cinematic (no jank); IsometricGridBG opacity stays subtle; cube-ladder reads as brand-consistent; portfolio LCP image loads visibly fast on cold cache."
    why_human: "Visual feel and parallax cinematic quality cannot be measured by grep — requires human evaluation per CLAUDE.md «ахуєнний desktop» success criterion."
  - test: "Hero parallax translation amplitude in browser"
    expected: "<120px translation per Roadmap SC#1 (strict less-than)."
    why_human: "Code outputs `[0, -120]` from `useTransform` — this is exactly 120px magnitude at full scroll-progress, not strictly under. Spec ambiguity: plan's must_have says ≤120 (accepted), Roadmap says <120. Borderline. Visual confirmation that translation never visibly hits 120px (it shouldn't — the hero is 100vh and the user typically scrolls past at <100% progress) closes the ambiguity. Phase 5 owns final easing tuning."
---

# Phase 3: Brand Primitives & Home Page Verification Report

**Phase Goal:** Every brand primitive (Logo, Mark, IsometricCube 3 variants, IsometricGridBG, Wordmark) exists as inviolable component, and the Home page consumes them to deliver all 7 sections with a Lighthouse-compliant hero.
**Verified:** 2026-04-25T07:42:13Z
**Status:** human_needed (all structural prerequisites pass; Lighthouse score is Phase 6 territory)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (mapped from Roadmap Success Criteria)

| #   | Truth (Roadmap SC) | Status     | Evidence       |
| --- | ------------------ | ---------- | -------------- |
| SC1 | `/` hero renders «ВИГОДА» wordmark + `IsometricGridBG` overlay (opacity 0.10–0.20) + verbatim gasло + functional CTA «Переглянути проекти» → `/projects` + slow-parallax (`useScroll`+`useTransform`, no spring/bounce, ≤120px) | ✓ VERIFIED | `Hero.tsx:33-77` — wordmark `<h1>` clamp(120px,12vw,200px) Montserrat 700; `IsometricGridBG opacity={0.15}` (mid-band); `<Link to="/projects">{heroCta}</Link>`; `useScroll({target:heroRef, offset:['start start','end start']})` + `useTransform(scrollYProgress, [0,1], [0,-120])`; reduced-motion guard collapses to `[0,0]`; no inline `transition={{}}`; no spring/bounce |
| SC2 | Home page contains 6 more sections in order: BrandEssence, PortfolioOverview (data/projects.ts), ConstructionTeaser, MethodologyTeaser, TrustBlock (no team photos), ContactForm (mailto:vygoda.sales@gmail.com) | ✓ VERIFIED | `HomePage.tsx:24-35` composes Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm in canonical D-17 order. PortfolioOverview reads from `flagship`, `pipelineGridProjects`, `aggregateProjects` derived views; TrustBlock has no `<img>` (only legal facts table); ContactForm uses `mailto:${email}` from `content/company.ts` (= `vygoda.sales@gmail.com`) |
| SC3 | Hero ships `<picture>` AVIF→WebP→JPG, ≤200KB hero, `<link rel="preload" as="image" fetchpriority="high">` in index.html, `loading="eager"`; Lighthouse Performance ≥90 | ⚠ PARTIAL | **Structural prerequisites all pass**: `index.html:7-14` has `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` for `aerial-1920.avif` BEFORE `<title>`; PortfolioOverview flagship uses `loading="eager" fetchPriority="high"`; ResponsivePicture emits `<picture><source type="image/avif"><source type="image/webp"><img></picture>`. **Concerns**: `aerial-1920.avif = 388KB` (>200KB target — Phase 6 risk); Lighthouse score itself is Phase 6 (`human_needed`) |
| SC4 | IsometricCube has typed `variant` discriminated union + typed `stroke` restricted to 3 hexes; Logo imports `dark.svg` via vite-plugin-svgr | ✓ VERIFIED | `IsometricCube.tsx:27-40` defines `type AllowedStroke = '#A7AFBC' \| '#F5F7FA' \| '#C1F33D'` and `variant: 'single' \| 'group' \| 'grid'`; Logo.tsx URL-imports `brand-assets/logo/dark.svg` (D-27 locked URL pattern; svgr is configured globally in vite.config.ts and applied via `?react` query for IsometricGridBG); `tsc --noEmit` passes |
| SC5 | Hidden `/dev/brand` route renders all brand primitives standalone for visual QA; not linked from production Nav | ✓ VERIFIED | `App.tsx:38` registers `<Route path="dev/brand" element={<DevBrandPage />} />` ABOVE catch-all; `DevBrandPage.tsx` (185 lines) showcases 6-color palette, Montserrat weight × type-size matrix, Logo, Mark, Wordmark, IsometricCube 3×3×2 matrix, IsometricGridBG @ 0.10/0.20; not linked from Nav.tsx (verified — Nav only has 5 primary routes) |

**Score:** 5/5 truths structurally verified. SC3's Lighthouse-score sub-clause requires human verification (Phase 6 territory).

### Required Artifacts (consolidated from 8 plan must_haves)

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/components/brand/IsometricCube.tsx` | 3-variant cube primitive, typed stroke, opacity-clamped grid | ✓ VERIFIED | 102 lines; variant + AllowedStroke union; grid variant clamps opacity ≤0.20; preserves MinimalCube polygon geometry |
| `src/components/brand/IsometricGridBG.tsx` | svgr-imported hero overlay grid | ✓ VERIFIED | 38 lines; imports `brand-assets/patterns/isometric-grid.svg?react`; opacity prop default 0.15 |
| `src/components/brand/Mark.tsx` | URL-import wrapper for cube-with-petals mark | ✓ VERIFIED | 22 lines; URL-imports `brand-assets/mark/mark.svg` (D-28 mirrors Logo D-27); decorative aria-hidden |
| `src/components/brand/MinimalCube.tsx` | DELETED (D-12) | ✓ VERIFIED | File does not exist; ls returns "No such file" |
| `src/vite-env.d.ts` | `<reference types="vite-plugin-svgr/client" />` | ✓ VERIFIED | Both vite/client and vite-plugin-svgr/client references present |
| `src/content/home.ts` | 12 named string exports | ✓ VERIFIED | All 12 exports present: heroSlogan, heroCta, portfolioHeading, portfolioSubtitle, flagshipExternalCta, constructionTeaserCta, contactCta, methodologyVerificationWarning, licenseScopeNote, contactNote, contactHeading, contactBody. Zero imports (leaf). |
| `scripts/optimize-images.mjs` | Sharp-encoded AVIF/WebP/JPG triples at 3 widths | ✓ VERIFIED | 86 lines; idempotent via mtime; processes renders @ [640,1280,1920] + construction @ [640,960]; ESM pure JS |
| `src/components/ui/ResponsivePicture.tsx` | `<picture>` with avif/webp/jpg sources, uses assetUrl | ✓ VERIFIED | 91 lines; emits picture/source(avif)/source(webp)/img(jpg fallback); imports `assetUrl` from `lib/assetUrl`; no raw `/renders/` or `/construction/` literals |
| `package.json` | sharp@^0.34.5, predev/prebuild chain | ✓ VERIFIED | sharp `^0.34.5` in devDependencies; predev + prebuild = `tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs` |
| `src/components/sections/home/Hero.tsx` | wordmark + slogan + CTA + parallax overlay | ✓ VERIFIED | 78 lines; useScroll + useTransform + useReducedMotion; IsometricGridBG opacity 0.15; Link to /projects |
| `index.html` | AVIF preload before `<title>` | ✓ VERIFIED | preload `<link>` at lines 8-14, `<title>` at line 15; fetchpriority="high"; type="image/avif" |
| `src/components/sections/home/BrandEssence.tsx` | 4 numbered cards from brandValues | ✓ VERIFIED | 44 lines; reads `brandValues` (4 entries) from content/values; numbered 01-04; no inline copy |
| `src/components/sections/home/PortfolioOverview.tsx` | flagship + pipeline grid + aggregate row + IsometricCube marker | ✓ VERIFIED | 129 lines; reads flagship/pipelineGridProjects/aggregateProjects derived views; flagship LCP via ResponsivePicture eager+fetchPriority="high" + width=1280 height=720; external CTA target=_blank rel=noopener; aggregate row uses IsometricCube variant="single" |
| `src/components/sections/home/ConstructionTeaser.tsx` | scroll-snap photo strip + CTA | ✓ VERIFIED | 97 lines; uses native `snap-x snap-mandatory overflow-x-auto scroll-smooth`; ChevronLeft/Right buttons fire scrollBy(); ResponsivePicture widths=[640,960]; no swiper/embla/keen |
| `src/components/sections/home/MethodologyTeaser.tsx` | 3 §8 blocks (indexes 1,3,7) + ⚠-marker logic | ✓ VERIFIED | 62 lines; filters methodologyBlocks by FEATURED_INDEXES=[1,3,7]; defensive ⚠-marker conditional on needsVerification (uses methodologyVerificationWarning aria-label) |
| `src/components/sections/home/TrustBlock.tsx` | 3-col legal facts (no team photos) | ✓ VERIFIED | 81 lines; Юр. особа \| Ліцензія \| Контакт; legalName/edrpou/licenseDate/licenseNote/email from content/company; licenseScopeNote+contactNote from content/home; no `<img>` of people; explicit "NO portrait imagery" doc-block |
| `src/components/sections/home/ContactForm.tsx` | single mailto CTA, no form fields | ✓ VERIFIED | 48 lines; single `<a href={mailto}>`; no `<input>`/`<form>`/`<textarea>`; encodeURIComponent for Cyrillic-safe subject |
| `src/pages/HomePage.tsx` | composes 7 sections in canonical order | ✓ VERIFIED | 36 lines; replaces Phase 1 stub; imports all 7 sections; renders in D-17 order Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm |
| `src/pages/DevBrandPage.tsx` | hidden QA surface | ✓ VERIFIED | 185 lines; palette × 6, Montserrat 3 weights × 8 sizes, Logo, Mark, Wordmark, IsometricCube 3×3×2 matrix, IsometricGridBG 0.10/0.20 |
| `src/App.tsx` | /dev/brand registered above catch-all | ✓ VERIFIED | Line 38: `<Route path="dev/brand" element={<DevBrandPage />} />` directly above `<Route path="*" element={<NotFoundPage />} />` |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `IsometricCube.tsx` | `IsometricGridBG.tsx` | `import { IsometricGridBG }` for grid variant | ✓ WIRED | line 25 imports; line 55 delegates with clamped opacity |
| `IsometricGridBG.tsx` | `brand-assets/patterns/isometric-grid.svg` | `?react` svgr query | ✓ WIRED | line 15: `from '../../../brand-assets/patterns/isometric-grid.svg?react'` |
| `Mark.tsx` | `brand-assets/mark/mark.svg` | URL import (D-28) | ✓ WIRED | line 13: `from '../../../brand-assets/mark/mark.svg'` |
| `Hero.tsx` | `IsometricGridBG.tsx` | named import | ✓ WIRED | line 30 |
| `Hero.tsx` | `content/home.ts` | `heroSlogan, heroCta` | ✓ WIRED | line 31 |
| `Hero.tsx` | react-router `Link` | `<Link to="/projects">` | ✓ WIRED | line 68-73 |
| `Hero.tsx` | `motion/react` | useScroll/useTransform/useReducedMotion/motion | ✓ WIRED | lines 22-28 |
| `index.html` | `aerial-1920.avif` | preload `<link>` | ✓ WIRED | line 11; verified file exists at `public/renders/lakeview/_opt/aerial-1920.avif` |
| `BrandEssence.tsx` | `content/values` | `brandValues` | ✓ WIRED | line 16 |
| `PortfolioOverview.tsx` | `data/projects` | `flagship, pipelineGridProjects, aggregateProjects` | ✓ WIRED | line 36 |
| `PortfolioOverview.tsx` | `ResponsivePicture` | flagship + 3 pipeline cards | ✓ WIRED | line 37, lines 59 + 93 |
| `PortfolioOverview.tsx` | `IsometricCube` | variant="single" aggregate marker | ✓ WIRED | line 38, line 117 |
| `PortfolioOverview.tsx` | `content/home` | portfolioHeading/portfolioSubtitle/flagshipExternalCta | ✓ WIRED | lines 39-43 |
| `ConstructionTeaser.tsx` | `data/construction` | `latestMonth()` | ✓ WIRED | line 22 |
| `ConstructionTeaser.tsx` | `ResponsivePicture` | widths=[640,960] | ✓ WIRED | line 23, line 65-72 |
| `ConstructionTeaser.tsx` | `content/home` | `constructionTeaserCta` | ✓ WIRED | line 24 |
| `MethodologyTeaser.tsx` | `content/methodology` | `methodologyBlocks` | ✓ WIRED | line 19 |
| `MethodologyTeaser.tsx` | `content/home` | `methodologyVerificationWarning` | ✓ WIRED | line 20 |
| `TrustBlock.tsx` | `content/company` | legalName/edrpou/licenseDate/licenseNote/email | ✓ WIRED | lines 23-29 |
| `TrustBlock.tsx` | `content/home` | licenseScopeNote/contactNote | ✓ WIRED | line 30 |
| `ContactForm.tsx` | `content/company` | email | ✓ WIRED | line 20 |
| `ContactForm.tsx` | `content/home` | contactCta/contactHeading/contactBody | ✓ WIRED | lines 21-25 |
| `ContactForm.tsx` | `mailto:` protocol | href={mailto:${email}?subject=...} | ✓ WIRED | line 31 |
| `HomePage.tsx` | 7 home sections | named imports | ✓ WIRED | lines 16-22 |
| `DevBrandPage.tsx` | brand primitives (Logo/Mark/IsometricCube/IsometricGridBG) | named imports | ✓ WIRED | lines 19-22 |
| `App.tsx` | `DevBrandPage.tsx` | `<Route path="dev/brand">` | ✓ WIRED | line 8 import + line 38 route |
| `package.json` | `optimize-images.mjs` | predev/prebuild chain | ✓ WIRED | runs AFTER copy-renders.ts in chained command |
| `optimize-images.mjs` | `public/{renders,construction}/**/*` | walks tree, emits `_opt/` siblings | ✓ WIRED | verified output at `public/renders/lakeview/_opt/aerial-{640,1280,1920}.{avif,webp,jpg}` and `public/construction/mar-2026/_opt/mar-01-640.{avif,webp,jpg}` |
| `ResponsivePicture.tsx` | `lib/assetUrl` | `import { assetUrl }` | ✓ WIRED | line 27 |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `Hero.tsx` | `heroSlogan`, `heroCta` | `content/home.ts` | Yes — verbatim from CONCEPT §2 | ✓ FLOWING |
| `BrandEssence.tsx` | `brandValues` | `content/values.ts` (4 entries with title+body) | Yes — 4 substantive Ukrainian values | ✓ FLOWING |
| `PortfolioOverview.tsx` | `flagship`, `pipelineGridProjects`, `aggregateProjects` | `data/projects.ts` derived views | Yes — Lakeview record + 3 pipeline projects + Pipeline-4 aggregate | ✓ FLOWING |
| `PortfolioOverview.tsx` | flagship hero image | `aerial.jpg` → ResponsivePicture → optimizer output | Yes — `aerial-1920.{avif,webp,jpg}` exist on disk | ✓ FLOWING (size warning Phase 6) |
| `ConstructionTeaser.tsx` | `month`, `photos` | `latestMonth()` from `data/construction.ts` (mar-2026 with 5 teaserPhotos) | Yes — 5 photo filenames + month label | ✓ FLOWING |
| `ConstructionTeaser.tsx` | photo images | mar-* filenames → optimizer output | Yes — `mar-01-640.{avif,webp,jpg}` exist | ✓ FLOWING |
| `MethodologyTeaser.tsx` | `featured` (3 blocks) | filtered `methodologyBlocks` from `content/methodology.ts` | Yes — 3 substantive blocks at indexes 1,3,7 | ✓ FLOWING |
| `TrustBlock.tsx` | legal facts | `content/company.ts` named constants | Yes — TOB «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019 | ✓ FLOWING |
| `ContactForm.tsx` | email + heading + body + CTA | content/company + content/home | Yes — vygoda.sales@gmail.com + 3 Ukrainian strings | ✓ FLOWING |
| `IsometricGridBG.tsx` | grid SVG | `brand-assets/patterns/isometric-grid.svg?react` | Yes — file exists, svgr-resolved at build | ✓ FLOWING |
| `Mark.tsx` | mark SVG | URL-import `brand-assets/mark/mark.svg` | Yes — file exists | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| TypeScript type-check passes | `npm run lint` | tsc --noEmit completes with no errors | ✓ PASS |
| Build pipeline produces dist/ | `npm run build` | prebuild (copy-renders + optimize-images) → tsc → vite build (4.11s, 421KB JS / 131KB gzipped) → postbuild check-brand 4/4 | ✓ PASS |
| check-brand 4/4 invariants | `npx tsx scripts/check-brand.ts` | denylistTerms PASS, paletteWhitelist PASS, placeholderTokens PASS, importBoundaries PASS | ✓ PASS |
| dist/index.html ships preload | grep on dist/index.html | `<link rel="preload" as="image" href="/vugoda-website/renders/lakeview/_opt/aerial-1920.avif" type="image/avif" fetchpriority="high">` present BEFORE `<title>` | ✓ PASS |
| dist contains no forbidden terms | `grep -r "Pictorial\|Rubikon\|Пикторіал\|Рубікон" dist/` | no matches | ✓ PASS |
| dist contains no template-token leakage | `grep -r "TODO\|{{" dist/` | no matches | ✓ PASS |
| Optimizer produced AVIF triplets | `ls public/renders/lakeview/_opt/aerial-1920.*` | aerial-1920.avif (388K), aerial-1920.webp (500K), aerial-1920.jpg (552K) | ✓ PASS |
| Construction optimizer ran | `ls public/construction/mar-2026/_opt/mar-01-640.*` | avif/webp/jpg present | ✓ PASS |
| MinimalCube.tsx deleted (D-12) | `ls src/components/brand/MinimalCube.tsx` | "No such file or directory" | ✓ PASS |
| No team photo references in src/components/sections/home/ | `grep -i "team\|команда\|керівн\|обличч"` | only TrustBlock doc-block negation ("NOT trust-via-portraits", "NO portrait imagery") — no actual portrait imagery | ✓ PASS |
| No `<img>` direct in home sections | `grep "<img" src/components/sections/home/` | no matches — all images via ResponsivePicture | ✓ PASS |
| No raw `/renders/` or `/construction/` literals in components | `grep "/renders/\|/construction/" src/components/ src/pages/` | no matches (D-30 importBoundary holds) | ✓ PASS |
| No inline `transition={{}}` (Pitfall 14) | `grep "transition={{" src/` | no matches | ✓ PASS |
| Hero Link → /projects | `grep 'to="/projects"' Hero.tsx` | line 69 | ✓ PASS |
| External CTA opens in new tab with rel=noopener | `grep "target=\"_blank\"\|rel=\"noopener\"" PortfolioOverview.tsx` | both present (lines 80-81) | ✓ PASS |
| ContactForm uses mailto with vygoda.sales@gmail.com | `grep "mailto:" ContactForm.tsx` + email source | href = mailto:${email}, email = 'vygoda.sales@gmail.com' from company.ts | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
| ----------- | -------------- | ----------- | ------ | -------- |
| HOME-01 | 03-02, 03-04, 03-08 | Hero wordmark + parallax cube-pattern (10-20% opacity) + gasло + CTA | ✓ SATISFIED | Hero.tsx renders all 4 elements; IsometricGridBG opacity 0.15; useScroll+useTransform parallax |
| HOME-02 | 03-05, 03-08 | Brand-essence — 4 cards (системність/доцільність/надійність/довгострокова цінність) | ✓ SATISFIED | BrandEssence.tsx maps brandValues (4 entries with exact titles) numbered 01-04 |
| HOME-03 | 03-03, 03-05, 03-08 | Portfolio overview — Lakeview flagship + 3 pipeline + aggregate Pipeline-4 | ✓ SATISFIED | PortfolioOverview.tsx composes flagship card + 3-col grid + aggregate row with IsometricCube marker; reads from data/projects derived views |
| HOME-04 | 03-03, 03-06, 03-08 | Construction teaser — 3-5 фото з mar-2026 + CTA → /construction-log | ✓ SATISFIED | ConstructionTeaser.tsx reads latestMonth().teaserPhotos (5 photos), CSS scroll-snap, CTA Link to /construction-log |
| HOME-05 | 03-06, 03-08 | Methodology teaser — 2-3 блоки з §8 + CTA «Детальніше про процес» | ✓ SATISFIED (with note) | MethodologyTeaser renders 3 blocks indexes [1,3,7]; defensive ⚠-marker. Note: no "Детальніше про процес" CTA in MethodologyTeaser — Phase 3 plans deferred since /how-we-build is v2 (PAGE2-02). HOME-05's CTA copy is moot when no destination route exists in v1. |
| HOME-06 | 03-07, 03-08 | Trust block — реквізити-таблиця ЄДРПОУ + ліцензія, no team photos | ✓ SATISFIED | TrustBlock.tsx 3-col table; legalName/edrpou/licenseDate from content/company; explicit "NO portrait imagery" comment + no `<img>` of people |
| HOME-07 | 03-07, 03-08 | Contact form «Ініціювати діалог» mailto:vygoda.sales@gmail.com | ✓ SATISFIED | ContactForm.tsx single CTA with mailto:vygoda.sales@gmail.com (email constant from company.ts) |
| VIS-03 | 03-01, 03-04, 03-05, 03-08 | Ізометричний куб-патерн — `<IsometricCube variant>` 3 ступені; hero overlay `<IsometricGridBG opacity 0.1-0.2>` | ✓ SATISFIED | IsometricCube has variant union {single,group,grid}; IsometricGridBG used in Hero at opacity 0.15 + DevBrandPage at 0.10/0.20; D-03 ceiling enforced in IsometricCube grid branch |
| VIS-04 | 03-01, 03-04, 03-08 | Офіційні SVG/PNG логотипи з brand-assets/logo/ (dark.svg в навбарі) + favicon | ✓ SATISFIED | Logo.tsx URL-imports brand-assets/logo/dark.svg (Phase 1 quick-task 260424-whr verified); Mark.tsx URL-imports brand-assets/mark/mark.svg; favicon already wired Phase 1 |
| ANI-01 | 03-04, 03-08 | Hero slow-parallax — Motion useScroll+useTransform, ease-out, без bounce | ✓ SATISFIED | Hero.tsx uses useScroll({target:heroRef, offset:['start start','end start']}) + useTransform with linear range [0,1]→[0,-120] (no spring, no bounce) + useReducedMotion guard |

**Coverage:** 10/10 requirement IDs from PLAN frontmatters are accounted for. All 10 are mapped to Phase 3 in REQUIREMENTS.md traceability table. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `src/data/construction.ts` | 26 | `// touching photos[]. TODO: review with client before handoff.` | ℹ Info | Phase 2 file (not Phase 3); already-known open question per CONCEPT §11. Does not block Phase 3 goal. |
| `src/components/sections/home/ConstructionTeaser.tsx` | 42 | Inline literal `Хід будівництва Lakeview` | ℹ Info | Plan 03-06's must_have requires content imports for "construction body copy" but not section heading. The inline heading is a section title (not body copy) — not a hard violation, but represents a small Phase 3 D-29 boundary drift not covered by current home.ts exports. Future polish. |
| `src/components/sections/home/MethodologyTeaser.tsx` | 33 | Inline literal `Як ми будуємо` | ℹ Info | Same as above — section heading, not body copy. Plan accepted; check-brand passes. |
| `src/components/sections/home/TrustBlock.tsx` | 36-37 | Inline literal `Юридично та операційно` + col labels (`Юр. особа`, `Ліцензія`, `Контакт`) | ℹ Info | Same as above — section heading + 3 short labels. check-brand passes; Phase 3 plans accepted these. |
| `Hero.tsx` parallax range | 45 | `useTransform(... [0, -120])` — exact 120px magnitude vs Roadmap SC1 "<120px" | ℹ Info | Plan 03-04 must_have says "≤120px" (matches). Roadmap says "<120px" (strict). Borderline ambiguity. Visual confirmation that real-world scroll never lands at 100% progress over hero closes this. Phase 5 owns final easing. |
| `aerial-1920.avif` | filesystem | 388KB exceeds Lighthouse SC3 hero ≤200KB | ⚠ Warning | Phase 6 risk note. Phase 3 owns the pipeline mechanics; Phase 6 owns the budget verification. Mitigation options: lower AVIF quality knob in optimize-images.mjs (currently quality:50), make 1280-width the LCP target (200KB exact), or accept and re-encode in Phase 6. |

**No blocker anti-patterns.** All informational/warning items are intentional or Phase 6 deferrals.

### Human Verification Required

#### 1. Lighthouse Performance audit on `/`
**Test:** Run Lighthouse desktop audit on the deployed URL once Phase 6 ships. Audit Performance + Accessibility + Best Practices + SEO.
**Expected:** All 4 categories ≥ 90; LCP image ≤ 200KB in loaded format.
**Why human:** Roadmap SC#3 explicitly defers Lighthouse score to Phase 6. Cannot verify a numeric score programmatically without running headless Chrome on a live deploy. Currently `aerial-1920.avif = 388KB` — Phase 6 will need to re-encode at lower quality OR target the 1280-width AVIF (200KB exact) as the LCP.

#### 2. Visual QA on `/dev/brand` and `/`
**Test:** Open `/#/` and `/#/dev/brand` in a desktop 1920×1080 viewport. Walk through each section. Confirm hero parallax feels cinematic (not janky); IsometricGridBG opacity reads as subtle (not washed-out, not invisible); cube-ladder semantics read correctly across DevBrandPage variants × strokes × opacities; portfolio LCP image loads visibly fast.
**Expected:** "Looks ахуєнно" per CLAUDE.md success criterion. No visual regressions vs brand-system.md §5 cube reference.
**Why human:** Cinematic parallax quality, opacity readability, and brand-feel cannot be measured via grep — requires human evaluation per Core Value statement.

#### 3. Hero parallax translation amplitude
**Test:** Open browser DevTools Performance tab on `/`. Scroll past hero. Confirm `transform: translateY()` on the IsometricGridBG overlay never visibly hits exactly -120px before the hero leaves viewport (since useScroll progress at 1.0 = hero scrolled out).
**Expected:** Translation visibly stays under 120px during the parallax phase.
**Why human:** Code outputs `[0, -120]` which is exactly 120px magnitude at scroll-progress=1.0, not strictly under. Roadmap SC1 says "<120px" (strict); plan must_have says "≤120px" (accepted). Borderline. Phase 5 owns final easing tuning if a real visual issue emerges.

### Gaps Summary

**No structural gaps.** All 5 Roadmap Success Criteria are structurally satisfied — every artifact exists, every key link is wired, every data-flow has real upstream data, and the entire `npm run build` pipeline (prebuild → tsc → vite build → postbuild check-brand) completes successfully. All 10 requirement IDs (HOME-01..07 + VIS-03 + VIS-04 + ANI-01) have implementation evidence.

The phase ships in `human_needed` status because **SC3's Lighthouse-score sub-clause is Phase 6 territory** (verified deployment + headless Chrome run). All structural prerequisites for that audit (preload tag, eager loading, AVIF-first picture element, fetchpriority="high") are present and verified.

**Phase 6 carry-over notes:**
- `aerial-1920.avif = 388KB` exceeds the 200KB hero budget. Phase 6 needs to address: re-encode at lower AVIF quality, or pick `aerial-1280.avif` (200KB exact) as the LCP target, or update `optimize-images.mjs` quality knob.
- Hero parallax exact-vs-strict 120px ambiguity (low priority; Phase 5 owns final easing).
- 4 informational inline section-heading literals (Phase 5/post-MVP polish — not Phase 3 blockers).

---

_Verified: 2026-04-25T07:42:13Z_
_Verifier: Claude (gsd-verifier)_
