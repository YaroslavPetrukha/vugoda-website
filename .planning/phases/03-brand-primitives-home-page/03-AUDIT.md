---
auditor: Code Reviewer
audited_at: 2026-04-25
status: concerns_noted
plans_audited: 8
findings_count: 9
---

# Phase 3 Audit — Brand Primitives & Home Page

## Summary

Phase 3 actually delivered. All 8 plans' must_haves verify against the source: 4 brand primitives shipped (`IsometricCube` typed-discriminated, `IsometricGridBG` svgr-imported, `Mark` URL-imported, `Logo` retained as Phase-1 URL-import), `MinimalCube.tsx` deleted, `home.ts` has 12 named exports with U+2019/U+2197/U+00B7/U+2014 codepoints in the right places, the image pipeline is wired (`sharp@0.34.5`, `optimize-images.mjs` chained `predev`/`prebuild`), `ResponsivePicture` + 7 home sections + `HomePage` compose + `DevBrandPage` + `App.tsx` route all match plan literals. `npm run lint` exits 0; `tsx scripts/check-brand.ts` returns `4/4 checks passed`. The structural goals of Roadmap SC#1, #2, #4, #5 are met. **The one substantive concern is SC#3's hero-image budget**: `aerial-1920.avif` weighs 388KB on disk (verified `ls -la` line 388547 bytes), nearly 2× the ≤200KB ceiling set in Roadmap SC#3 and PROJECT.md Constraints. The 03-VERIFICATION.md report explicitly flags this as Phase 6 follow-up, but it should be called out clearly so it isn't lost. The audit otherwise found no drift between plan and code.

## Critical Findings

### 🔴 CF-1: Hero LCP image overshoots the ≤200KB budget by ~94%

`public/renders/lakeview/_opt/aerial-1920.avif` is **388,547 bytes (388KB)**; `aerial-1920.webp` is 500KB; `aerial-1920.jpg` is 552KB. PROJECT.md "Performance budget: hero render ≤ 200KB (AVIF/WebP)" and Roadmap SC#3 ("Hero image ships as `<picture>` … ≤200KB for the loaded format") are both violated by what the preload `<link>` and PortfolioOverview flagship currently target. The smaller `aerial-1280.avif` is 200,706 bytes — exactly at the boundary and a more realistic LCP — but `index.html:11` and `PortfolioOverview.tsx:64` reference 1920 as the largest srcset entry and the preload, and `index.html` preloads the 1920 variant explicitly. This was self-flagged in `03-VERIFICATION.md:9` ("Currently aerial-1920.avif = 388KB exceeds the 200KB hero budget — Phase 6 will need to either (a) re-encode at lower quality, (b) target the 1280-width AVIF (200KB exactly) as the LCP, or (c) raise the AVIF quality knob"). It is technically a Phase 6 problem (Lighthouse score lives there), but it is on the Phase 3 deliverable surface today.

## Quality Concerns

### 🟡 QC-1: Hero parallax range exactly hits Roadmap SC#1's «<120px» wording

`Hero.tsx:42-46` calls `useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -120])`. Roadmap SC#1 says "<120px translation" (strict less-than). At full scroll progress the magnitude is 120px exactly, equal to — not less than — the spec. Plan 03-04 must_have says "≤ 120" (inclusive, accepted) and the hero is 100vh so the user normally scrolls past before reaching 100% progress. This is borderline ambiguity, not a bug, but worth a one-character fix (`-119` or `-100`) before Phase 5 absorbs the variant. 03-VERIFICATION.md `human_verification` already flags this.

### 🟡 QC-2: Plan 03-02 grep gate for `мрія|найкращий|унікальний|преміальний` would still falsely match plan/spec text

Plan 03-02-home-microcopy-PLAN.md frontmatter and tasks contain literal occurrences of `мрія`/`найкращий`/`унікальний`/`преміальний` as the negative-list (e.g. PLAN.md:165, 247). The CI grep (Test 16, line 143) is correctly scoped to `src/content/home.ts` only, so this passes today. But if the grep ever broadens to `src/**` plus `.planning/**` (some teams do this in pre-commit), the plan would self-trigger. This is a documentation hazard, not a code bug; the same pattern was the original "self-consistency smell" in Phase 1/2. The fix is documentation discipline: keep CI greps narrowly scoped to content/source dirs.

### 🟡 QC-3: ConstructionTeaser arrow CTA appends an inline ASCII `→`, drifting from the typographic-arrow discipline elsewhere

`ConstructionTeaser.tsx:91` renders `{constructionTeaserCta} →` — a plain ASCII `>` -less arrow concatenated outside the content layer. Compare `home.ts:38` which uses U+2197 (NORTH EAST ARROW) baked INTO the `flagshipExternalCta` constant. The pattern here is inconsistent: the link constructs a typographic glyph in the JSX rather than baking it into the content string. Either move the `→` into the content constant, or accept it as a microcopy-exception (Phase 2 D-20). Not a regression — just a cosmetic inconsistency between two CTAs.

### 🟡 QC-4: ConstructionTeaser inline literal «Хід будівництва Lakeview» bypasses the D-29 content-boundary

`ConstructionTeaser.tsx:42` has `<h2>Хід будівництва Lakeview</h2>` as an inline Cyrillic JSX literal. D-29 says short heading literals MAY stay inline ("button labels MAY stay inline per Phase 2 D-20 microcopy exception — judgment call per component"). The plan author justified this in the implementation notes (line 273: "short brand-section heading"). Same exception was applied to MethodologyTeaser:33 («Як ми будуємо»), TrustBlock:36 («Юридично та операційно»), and DevBrandPage section h2s. It is an explicit decision, not a violation, but it leaves a small drift surface — in 6 months when copy needs to change, you'll have to grep for the literal across 5 files instead of editing `home.ts`. Worth recording as a Phase-4 documentation cue: list the 5 inline-section-heading exceptions so future contributors know they're intentional.

### 🟡 QC-5: `IsometricCube.tsx` polygons use comma-separated points; brand-system.md §5 mandates "straight lines, butt cap, miter join" — verified, but `<g>` element does set `fill="none"` and the polygons inherit, so opening/closing line continuity is correct

`IsometricCube.tsx:69-75` sets `<g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="butt" strokeLinejoin="miter">`. All three rules verified. Single-variant viewBox `0 0 100 100`, group `0 0 220 100`, 3 polygons single, 6 polygons group — verbatim plan match.

### 💭 QC-6: Doc-block in `IsometricCube.tsx` mentions "MinimalCube" 3× (lines 4, 5, 78)

This is innocuous prose referencing the deleted file as a historical anchor, but a future grep `from '.*MinimalCube'|import.*MinimalCube` (the verify check in Plan 03-01 Task 3 Step B) would NOT match these doc references because they don't match the import-pattern regex. The check was correctly designed. No action needed.

### 💭 QC-7: Plan 03-05 must_have claims «<IsometricCube variant="single">» rendered with double-quoted attribute; actual code is multi-line

`PortfolioOverview.tsx:117-121` renders `<IsometricCube variant="single"\n              stroke="#A7AFBC"\n              opacity={0.4}\n              ...>` — JSX attribute split across lines. The plan's grep `grep -cE '<IsometricCube variant="single"'` (Plan 03-05 verify line) still matches because the regex spans only the variant token. Functionally fine; cosmetic only.

## Per-Plan Verdict Table

| plan | must_haves count (truths) | verified | gaps | severity |
|------|---|---|---|---|
| 03-01 brand-primitives | 6 | 6 | none | none |
| 03-02 home-microcopy | 4 | 4 | none | none |
| 03-03 image-pipeline | 5 | 4 | aerial-1920.avif = 388KB > 200KB target | **🔴 critical (CF-1)** |
| 03-04 hero-section | 5 | 5 | parallax range hits 120 not <120 (QC-1) | 🟡 minor |
| 03-05 essence-portfolio | 6 | 6 | none | none |
| 03-06 construction-methodology | 6 | 6 | inline ASCII `→` and inline h2 (QC-3, QC-4) | 💭 cosmetic |
| 03-07 trust-contact | 5 | 5 | inline h2 «Юридично та операційно» (QC-4 same family) | 💭 cosmetic |
| 03-08 compose-and-dev-route | 5 | 5 | none | none |

## Phase 5 Carryover (correctly deferred)

These are intentional Phase 3→Phase 5 handoffs, verified intact and not regressions:

- **No inline `transition={{}}` anywhere in Phase 3 sections** — verified by `grep -rnE "transition=\{\{" src/components/sections/home/ src/components/brand/ src/components/ui/ src/pages/` returning zero hits. Phase 5 owns `motionVariants.ts` and will add transition variants centrally.
- **No `<RevealOnScroll>` wrappers around home sections** — Plan 03-08 explicitly notes "Phase 5 will wrap each section with `<RevealOnScroll>` for ANI-02; this file leaves the sections wrapper-free per Phase 3 deferred scope." `HomePage.tsx:24-35` is wrapper-free as planned.
- **No `<AnimatePresence>` on the `<Outlet>`** — Phase 5 owns route-transition fade. App.tsx is unchanged from the route-only structure.
- **Card hover (ANI-03) not on pipeline cards** — `PortfolioOverview.tsx:91-110` ships static cards. Phase 4 owns hover.
- **`useReducedMotion` only threaded into Hero** — Plan 03-04 says "Phase 5 owns full hook threading"; correctly limited to Hero.tsx in Phase 3.

## Phase 6 Carryover (correctly deferred)

- **Lighthouse score itself** (`/` Performance ≥90 desktop) — Plan 03-04 + 03-CONTEXT explicitly defers to Phase 6 deployed-URL audit. Cannot be measured on localhost.
- **Mobile fallback at <1024px** — out of Phase 3 scope; Phase 6 owns `MobileFallback.tsx`.
- **OG meta tags** — index.html has only `theme-color`, favicon, and AVIF preload. OG / Twitter Card / canonical URL are Phase 6.
- **Bundle ≤200KB gzipped JS verification** — vite-build report inspection is Phase 6.
- **GitHub Actions deploy.yml live deploy** — Phase 6 wires `actions/deploy-pages@v4`.
- **Hero image budget enforcement (CF-1 above)** — was always destined for Phase 6 reconciliation per Roadmap SC#3 ownership; Phase 3 ships the pipeline, Phase 6 verifies the score. The 388KB AVIF is the single biggest tuning lever Phase 6 will need (re-encode at quality 35–40 or target 1280-width as LCP).

---

**Files audited (all absolute paths):**
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/brand/IsometricCube.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/brand/IsometricGridBG.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/brand/Mark.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/brand/Logo.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/vite-env.d.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/content/home.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/Hero.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/BrandEssence.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/PortfolioOverview.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/ConstructionTeaser.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/MethodologyTeaser.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/TrustBlock.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/sections/home/ContactForm.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/ui/ResponsivePicture.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/pages/HomePage.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/pages/DevBrandPage.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/App.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/src/components/layout/Nav.tsx
- /Users/admin/Documents/Проєкти/vugoda-website/index.html
- /Users/admin/Documents/Проєкти/vugoda-website/scripts/optimize-images.mjs
- /Users/admin/Documents/Проєкти/vugoda-website/package.json
- /Users/admin/Documents/Проєкти/vugoda-website/src/data/projects.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/data/construction.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/content/values.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/content/methodology.ts
- /Users/admin/Documents/Проєкти/vugoda-website/src/content/company.ts
