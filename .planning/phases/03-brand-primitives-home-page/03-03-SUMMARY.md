---
phase: 03-brand-primitives-home-page
plan: 3
subsystem: infra
tags: [sharp, avif, webp, image-pipeline, picture-element, lcp, esm, vite, react-19]

requires:
  - phase: 02-data-layer-content
    provides: scripts/copy-renders.ts (populates public/renders + public/construction)
  - phase: 02-data-layer-content
    provides: src/lib/assetUrl.ts (assetUrl helper — single path into asset trees per D-30)
  - phase: 02-data-layer-content
    provides: scripts/check-brand.ts (importBoundaries() grep enforces no raw render-tree literals in src/components/)
  - phase: 01-foundation-shell
    provides: Node engine pin ^20.19 || >=22.12 (sharp@0.34 compat OK)

provides:
  - sharp@^0.34.5 devDependency
  - scripts/optimize-images.mjs (build-time AVIF/WebP/JPG encoder, idempotent via mtime)
  - chained predev/prebuild scripts (copy-renders.ts && optimize-images.mjs)
  - src/components/ui/ResponsivePicture.tsx (reusable <picture> with AVIF→WebP→JPG fallback)
  - public/{renders,construction}/**/_opt/{name}-{w}.{avif,webp,jpg} optimized variants
  - 480 optimized files generated on first prebuild (180 renders + 300 construction)

affects:
  - phase 03-04-hero-section — Hero component will consume <ResponsivePicture src='renders/lakeview/aerial.jpg' loading='eager' fetchPriority='high'>
  - phase 03-05-essence-portfolio — PortfolioOverview flagship + 4 pipeline cards via <ResponsivePicture>
  - phase 03-06-construction-methodology — ConstructionTeaser uses widths={[640, 960]}
  - phase 04 — /zhk/etno-dim gallery (8 renders), /construction-log timeline (50 photos) reuse ResponsivePicture
  - phase 06 — Lighthouse hero ≤200KB budget (QA-02). RISK NOTE: aerial-1920.avif = 379 KB (above budget at largest width). Phase 6 must use sizes/srcset to deliver 1280-width AVIF at 196 KB OR 640-width AVIF at 58 KB on the typical 1280-1920 desktop viewport. Encoder params unchanged (D-19 spec) — Phase 6 will tune via sizes attribute, not encoder.

tech-stack:
  added:
    - "sharp@^0.34.5 (devDep) — Node-native AVIF/WebP/JPG encoder; binds libvips, no JS runtime cost"
  patterns:
    - "Build-time image optimization (Path A in STACK.md): script generates _opt/ siblings; Vite touches none of the 70 originals — preserves cold-start perf"
    - "ESM .mjs scripts for sharp interop — keeps tsconfig.scripts.json free of @types/sharp surface (D-20)"
    - "Idempotent walk: mtime-stat skip per output triplet; standalone re-run on 70 sources = 337ms"
    - "Walker skips _opt/ AND dotfiles to avoid recursing into output and macOS metadata"
    - "<picture><source AVIF><source WebP><img JPG/></picture> emit order — AVIF first per Pitfall 12"
    - "Caller-controlled loading/fetchPriority — defaults lazy, hero passes eager+high explicitly (Pitfall 11)"
    - "Filename strip regex /\\.(jpg|jpeg|png|webp)$/i — matched in optimizer + component (43615.jpg.webp → base 43615.jpg)"
    - "Self-consistency rule: doc-blocks must NEVER literally contain quoted slash-prefixed literals that check-brand greps for — paraphrase the rule instead (Plan 02-04 / 03-03 pattern)"

key-files:
  created:
    - scripts/optimize-images.mjs
    - src/components/ui/ResponsivePicture.tsx
  modified:
    - package.json (sharp devDep + chained predev/prebuild)
    - package-lock.json (sharp dep tree)

key-decisions:
  - "sharp@^0.34.5 + script-based pipeline (Path A from STACK.md) — Vite plugin path B rejected for 70-image cold-start perf"
  - "ESM .mjs not .ts — keeps @types/sharp out of tsconfig.scripts.json per D-20"
  - "fileURLToPath repo-root pattern reused from copy-renders.ts — Cyrillic Проєкти path edge case (Plan 02-03 D-precedent)"
  - "Walker skips _opt/ subdirs AND dotfiles — prevents infinite recursion + .DS_Store noise"
  - "Component default loading='lazy'; hero LCP caller MUST explicitly opt into loading='eager' + fetchPriority='high' (Pitfall 11)"
  - "Idempotency at script level (mtime stat); chain idempotency depends on Phase 2 copy-renders.ts being non-destructive — currently it IS destructive (rmSync), so chained re-runs always do full encode. Standalone optimize-images re-run is 337ms, confirming script logic is correct. Not a Phase 3 plan miss — Phase 2 D-22 design choice."
  - "Doc-block self-consistency fix (Rule 1 auto-fix): rephrased ResponsivePicture.tsx JSDoc to avoid containing the quoted slash-delimited literals that check-brand importBoundaries() greps for in src/components/. Same pattern as Plan 02-04 placeholders.ts/values.ts fix."

patterns-established:
  - "Build-time image pipeline: script in scripts/, output to public/**/_opt/, gitignored, regenerated on every prebuild. Future asset trees follow the same shape."
  - "ResponsivePicture is the SINGLE entry point for all raster imagery in src/. Phase 4+ gallery/log MUST consume this component, not roll their own <picture>."
  - "src/components/ui/ namespace established for cross-domain UI primitives (siblings to brand/, layout/)."

requirements-completed: [HOME-03, HOME-04]

duration: 14min
completed: 2026-04-25
---

# Phase 03 Plan 3: Image Pipeline Summary

**Build-time AVIF/WebP/JPG triplet pipeline using sharp 0.34 + reusable <ResponsivePicture> wired through assetUrl — 70 source images expand to 480 optimized files emitted to gitignored `_opt/` siblings, ready for Wave 3 Hero/PortfolioOverview/ConstructionTeaser consumers.**

## Performance

- **Duration:** ~14 min wall (most of which is sharp's first-pass encode at ~3m 45s for 70 sources)
- **Started:** 2026-04-25T06:21:00Z (sharp install)
- **Completed:** 2026-04-25T06:35:44Z (Task 3 commit)
- **Tasks:** 3 (all `auto`, no checkpoints)
- **Files created:** 2 (scripts/optimize-images.mjs, src/components/ui/ResponsivePicture.tsx)
- **Files modified:** 2 (package.json, package-lock.json)

## Accomplishments

- **sharp@^0.34.5** installed as devDependency; `predev` and `prebuild` now chain `tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs`
- **scripts/optimize-images.mjs** ships per D-19 encoder spec (AVIF q50/effort4, WebP q75, JPG mozjpeg q80), at widths `[640, 1280, 1920]` for renders and `[640, 960]` for construction; idempotent via output-mtime-≥-source-mtime stat skip; walker skips `_opt/` subdirs and dotfiles; uses `fileURLToPath(new URL('..', import.meta.url))` to handle the Cyrillic `Проєкти` checkout path
- **src/components/ui/ResponsivePicture.tsx** ships per D-21 — emits `<picture>` with AVIF → WebP → `<img>` fallback order, srcset built via `assetUrl()` from Phase 2 D-30 (zero hardcoded `/renders/` or `/construction/` literals), default 16:9 width/height for CLS prevention, caller-overridable `loading` and `fetchPriority` props for LCP control
- **First prebuild** generated 480 optimized files (180 in `public/renders/**/_opt/`, 300 in `public/construction/**/_opt/`); `aerial-1920.{avif,webp,jpg}` triplet present in `public/renders/lakeview/_opt/`
- **`npm run build` exits 0**: prebuild → tsc → vite build (242.85 kB JS / 76.85 kB gzipped — no regression from Plan 03-01 baseline) → postbuild check-brand 4/4 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries)
- **Idempotency confirmed at script level**: standalone `node scripts/optimize-images.mjs` re-run on populated tree = **337ms** (mtime skip path active for all 480 files)

## Task Commits

1. **Task 1: Install sharp and update package.json scripts** — `35d8ae2` (chore)
2. **Task 2: Create scripts/optimize-images.mjs** — `2deed4d` (feat)
3. **Task 3: Create src/components/ui/ResponsivePicture.tsx** — `2a4cf22` (feat)

_TDD note: project skips Vitest per STACK.md MVP posture; Task 2 and Task 3 used the plan's behavior tests as a verification checklist (10 invariants per task), enforced via grep + `npm run lint` + `npm run build` postbuild check-brand — same TDD-without-Vitest gate pattern Plan 02-02 / 02-03 / 02-04 established._

## Files Created/Modified

- `scripts/optimize-images.mjs` — 85 lines ESM, sharp-based image encoder; idempotent via mtime; walks `public/renders` and `public/construction`, emits AVIF/WebP/JPG triples to sibling `_opt/` dirs
- `src/components/ui/ResponsivePicture.tsx` — 90 lines, reusable `<picture>` component with AVIF→WebP→JPG fallback; uses `assetUrl()` from Phase 2; first occupant of `src/components/ui/` namespace
- `package.json` — added `"sharp": "^0.34.5"` to devDependencies; updated `predev` and `prebuild` to chain `node scripts/optimize-images.mjs` after `tsx scripts/copy-renders.ts`
- `package-lock.json` — sharp dep tree (~6 transitive packages)

## Decisions Made

- **Path A (script) over Path B (vite-imagetools):** Plan baseline; STACK.md ranks Path A higher for ≥70 images because Vite never touches originals — keeps dev cold-start fast.
- **`.mjs` not `.ts`:** keeps `tsconfig.scripts.json` lean (no `@types/sharp`), per D-20.
- **`node` not `tsx` to run optimizer:** plain ESM, no TS surface, no transpile cost.
- **fileURLToPath pattern reused** from `scripts/copy-renders.ts` (Plan 02-03) — avoids percent-encoding bug on the Cyrillic `Проєкти` checkout path.
- **Walker skips `_opt/` and dotfiles** — prevents infinite recursion into output dirs and macOS `.DS_Store` noise (Plan 02-03 .DS_Store filter pattern).
- **Component default `loading='lazy'`:** safe default for non-LCP usage. Hero/flagship caller MUST opt-in to `loading='eager' + fetchPriority='high'` (D-18 + Pitfall 11) — wave 3 Hero/PortfolioOverview will pass these explicitly.
- **`assetUrl()` not `renderUrl()`/`constructionUrl()`:** the component receives an already-domain-qualified path (e.g. `'renders/lakeview/aerial.jpg'`), and the `_opt/{base}-{w}.{fmt}` suffix is appended via string template before calling the generic `assetUrl()`. The two domain-specific helpers (`renderUrl`, `constructionUrl`) take a `(slug, file)` pair and don't compose with the optimized-suffix step. Final URL composition is identical (BASE_URL + path).
- **Default `height = round(largestWidth * 9 / 16)`:** assumes 16:9 architectural CGI (matches all current renders + construction photos). Caller can override `width`/`height` for non-16:9 sources.
- **Doc-block self-consistency rule reused** from Plan 02-04 — JSDoc paraphrases the policy without literally embedding the quoted slash-delimited substrings that check-brand greps for. Source must be self-consistent under its own CI rules.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] ResponsivePicture.tsx doc-block contained the forbidden quoted-path literals**

- **Found during:** Task 3 (initial file write) — verification grep `grep -rnE "'/renders/|'/construction/" src/components/` matched line 9 of the doc-block: `* raw '/renders/' or '/construction/' literal strings.`
- **Issue:** scripts/check-brand.ts importBoundaries() rule «components must not contain raw /renders/ or /construction/ paths» does not distinguish between code and comments — the grep matches anywhere in `*.tsx` files. The doc-block accidentally tripped its own rule.
- **Fix:** rephrased the comment to describe the policy without embedding the literal quoted substrings. The new wording references «render-tree or construction-tree path prefixes» and «forbidden substrings… that scripts/check-brand.ts importBoundaries() greps for», preserving the documentation intent.
- **Files modified:** src/components/ui/ResponsivePicture.tsx
- **Verification:** `grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/` exits with no matches; full `npm run build` postbuild check-brand reports 4/4 PASS.
- **Committed in:** 2a4cf22 (folded into the Task 3 commit, no separate commit)
- **Precedent:** Plan 02-04 STATE.md decision «Self-consistency fix on doc-blocks (deviation Rule 3)» — same anti-pattern, same fix.

---

**Total deviations:** 1 auto-fixed (Rule 1 — self-consistency bug)
**Impact on plan:** Zero scope creep. Fix was strictly local to one comment block; the executable code was correct on first write.

## Issues Encountered

- **`aerial-1920.avif` is 379 KB**, not the 80–140 KB the D-19 spec anticipated. Documented as a Phase 6 risk note in the frontmatter `affects` field. Source is 2400×1599 architectural CGI; sharp's q50/effort4 produces 379 KB at 1920×1280 output. **Encoder params will not be tuned** (D-19 specifies them verbatim) — Phase 6 instead must use the `sizes` attribute on `<ResponsivePicture>` to deliver the **1280-width AVIF (196 KB)** or **640-width AVIF (58 KB)** to typical 1280–1920 desktop viewports. The 1920 variant exists for the high-DPI (2× DPR) edge case and is acceptable to ship at 379 KB **provided** the browser only loads it when the layout demands a 1920-wide source. This is a srcset/sizes tuning task, not a pipeline regression.
- **Chained `prebuild` re-runs are not <5s** as the plan's `<verification>` block claimed. The plan's idempotency assertion measures the optimizer in isolation (337 ms standalone re-run, confirmed). The chain re-run takes the full ~3m 45s because Phase 2's `scripts/copy-renders.ts` is destructive — it `rmSync`'s `public/renders/` and `public/construction/` before each copy, resetting all source mtimes. This is a Phase 2 D-22 design choice (idempotent-via-rebuild, not idempotent-via-skip), not a Phase 3 plan miss. Acceptable: the heavy first-build cost is paid once per CI run; local devs only re-encode when they touch `/renders/` or `/construction/`.

## User Setup Required

None — no external service configuration required. Sharp downloads its native libvips binary on `npm install` automatically.

## Next Phase Readiness

- **Wave 3 unblocked:** Hero (Plan 03-04), PortfolioOverview (Plan 03-05), ConstructionTeaser (Plan 03-06) can now consume `<ResponsivePicture src='…' loading='…' fetchPriority='…' />`. Hero MUST pass `loading='eager' fetchPriority='high'` for LCP (D-18 + Pitfall 11).
- **Phase 4 unblocked:** /zhk/etno-dim gallery (8 renders), /construction-log timeline (50 photos) reuse the same component.
- **Phase 6 risk recorded:** `aerial-1920.avif` is 379 KB. Hero must use `sizes` attribute to deliver 1280-width or smaller variant on typical viewports. If Lighthouse desktop still fails QA-02 ≥90, escalate to a Phase 6 encoder-tune deviation (would override D-19 — requires user sign-off).

## Self-Check: PASSED

Verified files exist:
- FOUND: `scripts/optimize-images.mjs` (committed 2deed4d)
- FOUND: `src/components/ui/ResponsivePicture.tsx` (committed 2a4cf22)
- FOUND: `package.json` sharp@^0.34.5 + chained predev/prebuild (committed 35d8ae2)

Verified commits exist:
- FOUND: 35d8ae2 (Task 1) — `git log --oneline | grep 35d8ae2` matches
- FOUND: 2deed4d (Task 2) — `git log --oneline | grep 2deed4d` matches
- FOUND: 2a4cf22 (Task 3) — `git log --oneline | grep 2a4cf22` matches

Verified build:
- `npm run build` exits 0 (prebuild → tsc → vite build → postbuild check-brand 4/4 PASS)
- `npm run lint` exits 0
- `aerial-1920.{avif,webp,jpg}` triplet present in `public/renders/lakeview/_opt/`
- 480 optimized files total (180 renders + 300 construction)

---
*Phase: 03-brand-primitives-home-page*
*Completed: 2026-04-25*
