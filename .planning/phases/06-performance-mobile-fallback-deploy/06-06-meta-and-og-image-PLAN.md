---
phase: 06-performance-mobile-fallback-deploy
plan: 06
type: execute
wave: 2
depends_on: [06-02-content-and-og-svg]
files_modified:
  - index.html
  - scripts/build-og-image.mjs
  - package.json
autonomous: true
requirements: [QA-02, QA-03]
must_haves:
  truths:
    - "index.html ships locked OG meta values verbatim per D-21: og:title=«ВИГОДА — Системний девелопмент», og:description (143 ch), og:url, og:image, og:image:width=1200, og:image:height=630, og:image:alt, og:type=website, og:locale=uk_UA, og:site_name=ВИГОДА"
    - "index.html ships Twitter Card per D-22: twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image, twitter:image:alt — NO twitter:site or twitter:creator (no @handle in v1)"
    - "index.html ships <link rel=\"canonical\" href=\"https://yaroslavpetrukha.github.io/vugoda-website/\"> per D-23, plus <meta name=\"description\"> identical to og:description per D-24"
    - "index.html ships <link rel=\"apple-touch-icon\"> + <link rel=\"icon\" sizes=\"32x32\" type=\"image/png\"> per D-25"
    - "index.html limits hero <link rel=\"preload\" imagesrcset=\"...\"> to [640w, 1280w] only (drops 1920w) per D-13 — fixes the DPR=1 double-fetch waste"
    - "index.html keeps existing <meta name=\"theme-color\" content=\"#2F3640\"> + <link rel=\"icon\" type=\"image/svg+xml\"> from Phase 1 D-24 (Phase 6 is additive, not replacing)"
    - "scripts/build-og-image.mjs reads brand-assets/og/og.svg + brand-assets/favicon/favicon-32.svg via sharp and outputs public/og-image.png (1200×630) + public/apple-touch-icon.png (180×180) + public/favicon-32.png (32×32) — idempotent (skip if output mtime ≥ source mtime)"
    - "package.json `prebuild` script chain extended to include `node scripts/build-og-image.mjs` AFTER optimize-images.mjs steps; same pattern for `predev`"
  artifacts:
    - path: index.html
      provides: "Global OG/Twitter/canonical/description/apple-touch-icon meta + limited hero preload (Phase 6 D-13, D-21..D-25)"
      contains: "og:title"
    - path: scripts/build-og-image.mjs
      provides: "Sharp pipeline converting brand-assets SVG sources to PNG artifacts at build time (D-28..D-29) — idempotent mtime-based skip"
      contains: "sharp"
    - path: package.json
      provides: "`prebuild`/`predev` chain extended with the build-og-image.mjs step"
      contains: "build-og-image.mjs"
  key_links:
    - from: "index.html og:image meta"
      to: "public/og-image.png"
      via: "absolute URL https://yaroslavpetrukha.github.io/vugoda-website/og-image.png"
      pattern: "og-image\\.png"
    - from: "scripts/build-og-image.mjs"
      to: "brand-assets/og/og.svg"
      via: "sharp(svgBuffer).resize(1200, 630).png().toFile('public/og-image.png')"
      pattern: "brand-assets/og/og.svg"
    - from: "package.json prebuild script"
      to: "scripts/build-og-image.mjs"
      via: "&& node scripts/build-og-image.mjs"
      pattern: "build-og-image\\.mjs"
---

<objective>
Wire QA-03 OG/social-unfurl meta tags + apple-touch-icon + canonical, fix the QA-02 hero preload DPR=1 double-fetch, and create the build-time OG image pipeline. Three files modified:

**1. Edit `index.html`** — surgical additions to the existing `<head>` block, AND a one-line edit to the existing hero preload `imagesrcset` attribute.

**2. Create `scripts/build-og-image.mjs`** — sharp pipeline that converts:
- `brand-assets/og/og.svg` (created in plan 06-02) → `public/og-image.png` (1200×630)
- `brand-assets/favicon/favicon-32.svg` (existing Phase 1) → `public/apple-touch-icon.png` (180×180) + `public/favicon-32.png` (32×32)

Idempotent: skip if output mtime ≥ source mtime (same pattern as `scripts/optimize-images.mjs`).

**3. Edit `package.json`** — extend `prebuild` AND `predev` script chains to invoke `node scripts/build-og-image.mjs` AFTER the `optimize-images.mjs` calls. The PNGs are regenerated on every fresh build (via mtime invalidation when SVG changes).

**index.html locked meta values (D-21..D-25 verbatim — DO NOT paraphrase):**

| Tag | Value |
|-----|-------|
| `<meta name="description">` | `Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline.` |
| `<meta property="og:title">` | `ВИГОДА — Системний девелопмент` |
| `<meta property="og:description">` | (same as description) |
| `<meta property="og:url">` | `https://yaroslavpetrukha.github.io/vugoda-website/` |
| `<meta property="og:image">` | `https://yaroslavpetrukha.github.io/vugoda-website/og-image.png` |
| `<meta property="og:image:width">` | `1200` |
| `<meta property="og:image:height">` | `630` |
| `<meta property="og:image:alt">` | `ВИГОДА — Системний девелопмент` |
| `<meta property="og:type">` | `website` |
| `<meta property="og:locale">` | `uk_UA` |
| `<meta property="og:site_name">` | `ВИГОДА` |
| `<meta name="twitter:card">` | `summary_large_image` |
| `<meta name="twitter:title">` | (same as og:title) |
| `<meta name="twitter:description">` | (same as og:description) |
| `<meta name="twitter:image">` | (same as og:image) |
| `<meta name="twitter:image:alt">` | (same as og:image:alt) |
| `<link rel="canonical">` | `https://yaroslavpetrukha.github.io/vugoda-website/` |
| `<link rel="apple-touch-icon">` | `/vugoda-website/apple-touch-icon.png` |
| `<link rel="icon" sizes="32x32" type="image/png">` | `/vugoda-website/favicon-32.png` |

**No `twitter:site` / `twitter:creator`** per D-22 (no @handle exists in v1; placeholders would be lying).

**Hero preload edit (D-13):** the existing `<link rel="preload" imagesrcset="..." imagesizes="..." type="image/avif" fetchpriority="high">` ships 3 widths `[640w, 1280w, 1920w]`. Phase 6 LIMITS the preload to `[640w, 1280w]` — drops 1920w from preload to fix the DPR=1 double-fetch documented in audit. The `<picture>` source elements in the hero component (Phase 3) keep their full `[640w, 1280w, 1920w]` srcset for retina selection — that path is single-resolution-per-DPR and does not double-fetch.

**Why hardcoded URLs are acceptable for v1 (D-26 deferred):** if the user's GitHub account differs from `yaroslavpetrukha`, the 4 hardcoded URLs need a one-PR edit before deploy. Plan 06-09 (Wave 4 client-handoff note) lists the 4 file edits required. Env-driven URLs are deferred to v2 (custom domain).

Output: 1 file edited (~25 lines added to index.html, 1 line edit to existing preload), 1 new script file (~50 lines), 2 small package.json script-chain edits.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@index.html
@package.json
@scripts/optimize-images.mjs
@brand-assets/og/og.svg
@brand-assets/favicon/favicon-32.svg
</context>

<interfaces>
<!-- Existing index.html (Phase 1 + Phase 3) -->

```html
<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2F3640" />
    <link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg" />
    <link
      rel="preload"
      as="image"
      imagesrcset="/vugoda-website/renders/lakeview/_opt/aerial-640.avif 640w, /vugoda-website/renders/lakeview/_opt/aerial-1280.avif 1280w, /vugoda-website/renders/lakeview/_opt/aerial-1920.avif 1920w"
      imagesizes="(min-width: 1280px) 768px, 100vw"
      type="image/avif"
      fetchpriority="high"
    />
    <title>ВИГОДА — Системний девелопмент</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Phase 6 KEEPS: charset, viewport, theme-color, existing favicon SVG link, hero preload (with width edit), title.
Phase 6 ADDS: description meta + 9 og:* meta + 5 twitter:* meta + canonical + apple-touch-icon link + favicon-32 PNG link.

<!-- Existing scripts/optimize-images.mjs (Phase 3 D-19) — pattern reference for build-og-image.mjs -->

```js
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// ... idempotent mtime check + per-format encoder loop
```

Pattern conventions for build-og-image.mjs to follow:
- `.mjs` (not `.ts`) — avoids `@types/sharp` surface in tsconfig.scripts.json
- `fileURLToPath(new URL('..', import.meta.url))` for repo root path (handles non-ASCII «Проєкти» folder name per Plan 02-03)
- Idempotent mtime check before writing
- One target = one TARGETS array entry: `{ src, out, w, h }`
- Console.log progress for each output file

<!-- Existing package.json scripts (Phase 3 + Phase 5 baseline) -->

```json
"scripts": {
  "predev":   "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction",
  "dev":      "vite",
  "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction",
  "build":    "tsc --noEmit && vite build",
  "postbuild":"tsx scripts/check-brand.ts",
  "preview":  "vite preview",
  "lint":     "tsc --noEmit",
  "list:construction": "tsx scripts/list-construction.ts"
}
```

Phase 6 EXTENDS `predev` and `prebuild` by appending ` && node scripts/build-og-image.mjs` to BOTH chains. The OG image needs to be ready before `vite build` consumes `public/` (Vite copies public/ verbatim into dist/).

<!-- RESEARCH §"Code Examples — `scripts/build-og-image.mjs` — sharp pipeline" verbatim shape -->

```js
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
  if (existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
    console.log(`[build-og-image] skip ${out} (up-to-date)`);
    continue;
  }
  const svgBuf = readFileSync(srcPath);
  await sharp(svgBuf, { density: 300 })
    .resize(w, h, { fit: 'contain', background: '#2F3640' })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(outPath);
  console.log(`[build-og-image] wrote ${out} (${w}×${h})`);
}
```
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create scripts/build-og-image.mjs (D-28..D-29 + RESEARCH §Code Examples)</name>
  <read_first>
    - scripts/optimize-images.mjs (existing pattern reference — fileURLToPath, idempotent mtime, .mjs over .ts)
    - brand-assets/og/og.svg (must exist from plan 06-02 — sharp reads this as input)
    - brand-assets/favicon/favicon-32.svg (existing Phase 1 — apple-touch + favicon-32 source)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-28 (script wiring)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-29 (apple-touch + favicon-32 from same SVG source)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Code Examples — `scripts/build-og-image.mjs` — sharp pipeline" (verbatim ~30-line implementation)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pitfall 3" (sharp + Cyrillic — pre-pathing in og.svg already mitigates; this script does NOT need any font handling)
  </read_first>
  <files>scripts/build-og-image.mjs</files>
  <action>
    Create new file `scripts/build-og-image.mjs` with this content (RESEARCH §"Code Examples" verbatim, plus a top doc-block):

    ```js
    /**
     * scripts/build-og-image.mjs — Phase 6 D-28, D-29.
     *
     * Build-time SVG → PNG export for QA-03 social-unfurl artifacts:
     *   - public/og-image.png         (1200×630, source: brand-assets/og/og.svg)
     *   - public/apple-touch-icon.png (180×180,  source: brand-assets/favicon/favicon-32.svg)
     *   - public/favicon-32.png       (32×32,    source: brand-assets/favicon/favicon-32.svg)
     *
     * Pipeline: sharp(svgBuffer, {density: 300}).resize(w, h, {fit:'contain',
     * background:'#2F3640'}).png({quality:85, compressionLevel:9}).toFile(out).
     *
     * Wired into `prebuild` and `predev` script chains AFTER copy-renders.ts +
     * optimize-images.mjs (Phase 6 plan 06-06 package.json edit). Vite then
     * copies public/ → dist/ verbatim, so the 3 PNGs land at the correct
     * served paths.
     *
     * Idempotent: skips files where output mtime >= source mtime (same pattern
     * as optimize-images.mjs). Fast on repeat builds (<200ms). First run on
     * a fresh checkout regenerates all 3 PNGs.
     *
     * Generated outputs are gitignored (Phase 6 plan 06-03 added 3 entries to
     * .gitignore — public/og-image.png, public/apple-touch-icon.png,
     * public/favicon-32.png). SVG sources in brand-assets/ are the source of
     * truth.
     *
     * Path construction uses fileURLToPath(new URL('..', import.meta.url))
     * per Plan 02-03 — repo checkout path may contain non-ASCII characters
     * (e.g. "Проєкти") which percent-encode if you use .pathname directly.
     *
     * Font handling note: brand-assets/og/og.svg has the Cyrillic «ВИГОДА»
     * wordmark PRE-PATHED (Phase 6 D-30 + RESEARCH §Pitfall 3 — Linux GH
     * runner has no Cyrillic Montserrat available; pre-pathing eliminates
     * the font dependency). The sub-line «Системний девелопмент» falls back
     * to DejaVu Sans on Linux runner per D-30 carve-out (acceptable at 32px).
     * favicon-32.svg has no text — purely glyph paths — so no font issue.
     *
     * Why .mjs not .ts: avoids @types/sharp surface in tsconfig.scripts.json.
     * Plain ESM JS runs natively under Node ≥20.
     */
    import sharp from 'sharp';
    import { readFileSync, statSync, existsSync } from 'node:fs';
    import { fileURLToPath } from 'node:url';
    import { join } from 'node:path';

    const ROOT = fileURLToPath(new URL('..', import.meta.url));

    const TARGETS = [
      { src: 'brand-assets/og/og.svg',              out: 'public/og-image.png',         w: 1200, h: 630 },
      { src: 'brand-assets/favicon/favicon-32.svg', out: 'public/apple-touch-icon.png', w: 180,  h: 180 },
      { src: 'brand-assets/favicon/favicon-32.svg', out: 'public/favicon-32.png',       w: 32,   h: 32  },
    ];

    for (const { src, out, w, h } of TARGETS) {
      const srcPath = join(ROOT, src);
      const outPath = join(ROOT, out);

      if (!existsSync(srcPath)) {
        console.error(`[build-og-image] FAIL — source missing: ${src}`);
        process.exit(1);
      }

      // Idempotent skip — same pattern as optimize-images.mjs
      if (existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
        console.log(`[build-og-image] skip ${out} (up-to-date)`);
        continue;
      }

      const svgBuf = readFileSync(srcPath);
      await sharp(svgBuf, { density: 300 })
        .resize(w, h, { fit: 'contain', background: '#2F3640' })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(outPath);

      console.log(`[build-og-image] wrote ${out} (${w}×${h})`);
    }

    console.log('[build-og-image] complete');
    ```

    File length: ~80 lines including JSDoc.

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon/Пикторіал/Рубікон (zero matches in this content)
    - Hex literals: `#2F3640` appears in the doc-block AND in the `background: '#2F3640'` parameter. Whitelist contains it — paletteWhitelist scope is `*.{ts,tsx,css}`; .mjs is NOT in scope. Even if it were, #2F3640 is in the 6-canonical whitelist. NO FALSE POSITIVE.
    - Placeholder tokens: NO `\{\{[^}]*\}\}` Mustache pairs (the doc-block uses curly braces in JS object literal syntax `{src, out, w, h}` — single braces; no `{{...}}`)
    - Inline transition: NO JSX (this is a Node script)
    - Import boundaries: imports `sharp` (devDep, fine in scripts/) + node built-ins (fs, url, path) — within scripts/ boundary
    - Note: scripts/ is intentionally OUT of scope for all check-brand checks per Plan 02-05 (script's regex constants reference disallowed literals without self-triggering); build-og-image.mjs follows the same convention

    Verification: run the script directly:
    ```bash
    node scripts/build-og-image.mjs
    ```
    Expected output: 3 console lines either `wrote` or `skip` for each TARGETS entry, then `complete`. Files appear at `public/og-image.png` (1200×630), `public/apple-touch-icon.png` (180×180), `public/favicon-32.png` (32×32). Verify dimensions with `file public/og-image.png` (returns `PNG image data, 1200 x 630, ...`) or `sharp` exec; verify the OG image visually by opening it.
  </action>
  <verify>
    <automated>test -f scripts/build-og-image.mjs && grep -q "import sharp from 'sharp'" scripts/build-og-image.mjs && grep -q "brand-assets/og/og.svg" scripts/build-og-image.mjs && grep -q "brand-assets/favicon/favicon-32.svg" scripts/build-og-image.mjs && grep -q "public/og-image.png" scripts/build-og-image.mjs && grep -q "public/apple-touch-icon.png" scripts/build-og-image.mjs && grep -q "public/favicon-32.png" scripts/build-og-image.mjs && grep -q "1200" scripts/build-og-image.mjs && grep -q "630" scripts/build-og-image.mjs && grep -q "180" scripts/build-og-image.mjs && grep -q "fileURLToPath" scripts/build-og-image.mjs && node scripts/build-og-image.mjs && test -f public/og-image.png && test -f public/apple-touch-icon.png && test -f public/favicon-32.png && file public/og-image.png | grep -qE "1200 x 630|1200x630" && file public/apple-touch-icon.png | grep -qE "180 x 180|180x180" && file public/favicon-32.png | grep -qE "32 x 32|32x32" && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f scripts/build-og-image.mjs` exits 0
    - `grep -c "import sharp from 'sharp'" scripts/build-og-image.mjs` returns 1
    - `grep -c "brand-assets/og/og.svg" scripts/build-og-image.mjs` returns ≥ 1
    - `grep -c "brand-assets/favicon/favicon-32.svg" scripts/build-og-image.mjs` returns ≥ 1 (used twice — apple-touch + favicon-32)
    - `grep -c "public/og-image.png" scripts/build-og-image.mjs` returns ≥ 1
    - `grep -c "public/apple-touch-icon.png" scripts/build-og-image.mjs` returns ≥ 1
    - `grep -c "public/favicon-32.png" scripts/build-og-image.mjs` returns ≥ 1
    - `grep -c "fileURLToPath" scripts/build-og-image.mjs` returns ≥ 1 (non-ASCII path safety per Plan 02-03)
    - `grep -c "mtimeMs >= statSync" scripts/build-og-image.mjs` returns 1 (idempotent skip)
    - `node scripts/build-og-image.mjs` exits 0 and prints 3 progress lines + `[build-og-image] complete`
    - `test -f public/og-image.png` exits 0 after run
    - `test -f public/apple-touch-icon.png` exits 0
    - `test -f public/favicon-32.png` exits 0
    - `file public/og-image.png` reports `PNG image data, 1200 x 630` (exact dimensions)
    - `file public/apple-touch-icon.png` reports `PNG image data, 180 x 180`
    - `file public/favicon-32.png` reports `PNG image data, 32 x 32`
    - **OG image visual sanity** (manual, 10 sec): open `public/og-image.png` — see dark background + grid overlay + crisp «ВИГОДА» wordmark (pre-pathed) + sub-line «Системний девелопмент» + accent cube top-right. NO font fallback artifacts on the wordmark.
  </acceptance_criteria>
  <done>
    - File exists at `scripts/build-og-image.mjs`
    - 3 TARGETS configured (og.svg → og-image.png 1200×630; favicon-32.svg → apple-touch-icon.png 180×180; favicon-32.svg → favicon-32.png 32×32)
    - Idempotent mtime-based skip (matches optimize-images.mjs pattern)
    - First-run produces 3 PNGs in `public/` with correct dimensions
    - Wordmark «ВИГОДА» renders correctly (paths, not fonts) — proof that pre-pathing in og.svg was successful
    - Files are gitignored (per plan 06-03) — `git status` after run shows no new files for these paths
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Edit package.json — extend prebuild/predev with build-og-image.mjs (D-28)</name>
  <read_first>
    - package.json (FULL CURRENT FILE — must understand the existing scripts block before editing)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-28 (prebuild chain extension)
    - scripts/build-og-image.mjs (Task 1 above — confirm the script runs cleanly before package.json depends on it)
  </read_first>
  <files>package.json</files>
  <action>
    Edit `package.json`. Locate the `"scripts"` block. Modify the existing `predev` and `prebuild` values:

    **Before:**
    ```json
    "predev":   "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction",
    "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction",
    ```

    **After:**
    ```json
    "predev":   "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction && node scripts/build-og-image.mjs",
    "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction && node scripts/build-og-image.mjs",
    ```

    Net change: append ` && node scripts/build-og-image.mjs` to BOTH chains. Order matters — `build-og-image.mjs` must run AFTER `copy-renders.ts` (not strictly required since it reads brand-assets/ not public/renders/) but BEFORE `vite build` (so the 3 PNGs are present in `public/` when Vite copies it to `dist/`).

    Doc-block self-screen on edits: package.json is JSON; not in any check-brand scope. Edit is a 24-character append on each of 2 lines. Zero collisions possible.

    Verify after edit:
    - `npm run build` exits 0; the prebuild chain logs the build-og-image step output BEFORE the postbuild check-brand step
    - `dist/og-image.png` exists after build (Vite copied it from public/)
    - `dist/apple-touch-icon.png` exists
    - `dist/favicon-32.png` exists
  </action>
  <verify>
    <automated>grep -q "build-og-image.mjs" package.json && node -e "const s = require('./package.json').scripts; if (!s.predev.endsWith('build-og-image.mjs') || !s.prebuild.endsWith('build-og-image.mjs')) process.exit(1)" && rm -f public/og-image.png public/apple-touch-icon.png public/favicon-32.png && npm run build && test -f dist/og-image.png && test -f dist/apple-touch-icon.png && test -f dist/favicon-32.png && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "build-og-image.mjs" package.json` returns ≥ 2 (predev + prebuild both reference it)
    - `node -e "console.log(require('./package.json').scripts.prebuild)"` outputs a string ending in `&& node scripts/build-og-image.mjs`
    - `node -e "console.log(require('./package.json').scripts.predev)"` outputs a string ending in `&& node scripts/build-og-image.mjs`
    - After deleting `public/og-image.png` etc and running `npm run build`: the 3 PNGs are regenerated in `public/` AND copied to `dist/` (verified by `test -f dist/og-image.png && test -f dist/apple-touch-icon.png && test -f dist/favicon-32.png`)
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
    - `dist/index.html` is identical to `index.html` (Vite copies it; we have not edited index.html in this task; that is Task 3)
  </acceptance_criteria>
  <done>
    - `predev` and `prebuild` scripts both end with `&& node scripts/build-og-image.mjs`
    - Fresh build produces og-image.png + apple-touch-icon.png + favicon-32.png in `public/` AND copies them to `dist/`
    - `npm run build` green
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Edit index.html — add OG/Twitter/canonical/description/apple-touch + limit hero preload (D-13, D-21..D-25)</name>
  <read_first>
    - index.html (FULL CURRENT FILE — must understand exact existing structure before adding/editing meta)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-13 (hero preload imagesrcset limited to [640w, 1280w])
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-21 (locked OG values verbatim)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-22 (Twitter Card values; NO twitter:site/creator)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-23 (canonical URL)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-24 (description = same as og:description)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-25 (apple-touch-icon + favicon-32 PNG; existing favicon.svg + theme-color preserved)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Open Question 3: Hash-route deep-link AVIF preload behavior" (preload stays global per D-13; ~200KB cost on /#/projects deep-link is documented acceptable)
  </read_first>
  <files>index.html</files>
  <action>
    Edit `index.html` (existing Phase 1 + Phase 3 file). Two distinct edits:

    **Edit A — Limit hero preload `imagesrcset` (D-13).** Find the existing `<link rel="preload">` block:

    ```html
    <link
      rel="preload"
      as="image"
      imagesrcset="/vugoda-website/renders/lakeview/_opt/aerial-640.avif 640w, /vugoda-website/renders/lakeview/_opt/aerial-1280.avif 1280w, /vugoda-website/renders/lakeview/_opt/aerial-1920.avif 1920w"
      imagesizes="(min-width: 1280px) 768px, 100vw"
      type="image/avif"
      fetchpriority="high"
    />
    ```

    Replace with (drop `1920w` from imagesrcset only):

    ```html
    <!-- Phase 6 D-13: hero preload limited to [640w, 1280w]. The 1920w
         variant remains available for retina selection in <picture>'s
         <source srcset> (Hero.tsx Phase 3) — that path is single-resolution-
         per-DPR and does NOT double-fetch. Stripping 1920w from the preload
         alone fixes the DPR=1 double-fetch waste documented in audit. -->
    <link
      rel="preload"
      as="image"
      imagesrcset="/vugoda-website/renders/lakeview/_opt/aerial-640.avif 640w, /vugoda-website/renders/lakeview/_opt/aerial-1280.avif 1280w"
      imagesizes="(min-width: 1280px) 768px, 100vw"
      type="image/avif"
      fetchpriority="high"
    />
    ```

    Net change: removed `, /vugoda-website/renders/lakeview/_opt/aerial-1920.avif 1920w` (one comma-separated entry from the imagesrcset). Comment block added above.

    **Edit B — Add OG / Twitter / canonical / description / apple-touch / favicon-32 meta tags.** Insert these 24 new lines INSIDE `<head>`, AFTER the existing `<meta name="theme-color">` and BEFORE the existing `<link rel="icon" type="image/svg+xml">` (or in a logical group with the other meta tags — exact ordering of meta is not semantic, but readability suggests SEO group → OG group → Twitter group → favicon group → preload):

    ```html
    <!-- Phase 6 D-24: SEO description (same text as og:description per D-24) -->
    <meta name="description" content="Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline." />

    <!-- Phase 6 D-21: Open Graph meta — locked values verbatim. HashRouter
         forces global meta (D-20); per-route OG is v2 (BrowserRouter at
         custom domain INFR2-03). -->
    <meta property="og:title" content="ВИГОДА — Системний девелопмент" />
    <meta property="og:description" content="Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline." />
    <meta property="og:url" content="https://yaroslavpetrukha.github.io/vugoda-website/" />
    <meta property="og:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="ВИГОДА — Системний девелопмент" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="uk_UA" />
    <meta property="og:site_name" content="ВИГОДА" />

    <!-- Phase 6 D-22: Twitter Card. NO twitter:site/twitter:creator — no
         @handle exists in v1; placeholders would be lying. -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="ВИГОДА — Системний девелопмент" />
    <meta name="twitter:description" content="Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline." />
    <meta name="twitter:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />
    <meta name="twitter:image:alt" content="ВИГОДА — Системний девелопмент" />

    <!-- Phase 6 D-23: canonical URL — production root only (HashRouter forces
         single canonical). v2 BrowserRouter opens per-route. -->
    <link rel="canonical" href="https://yaroslavpetrukha.github.io/vugoda-website/" />

    <!-- Phase 6 D-25: apple-touch-icon (180×180) + favicon PNG (32×32, legacy
         fallback). Both generated by scripts/build-og-image.mjs from
         brand-assets/favicon/favicon-32.svg at build time. SVG favicon link
         (Phase 1 D-24) preserved below as primary. -->
    <link rel="apple-touch-icon" href="/vugoda-website/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/vugoda-website/favicon-32.png" />
    ```

    **Edit C — Preserve existing tags unchanged.**
    - `<meta charset="UTF-8" />` — keep
    - `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` — keep
    - `<meta name="theme-color" content="#2F3640" />` — keep (D-25: «existing theme-color preserved»)
    - `<link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg" />` — keep (Phase 1 D-24 SVG favicon, primary; the new favicon-32.png is a legacy fallback)
    - `<title>ВИГОДА — Системний девелопмент</title>` — keep (matches og:title; D-18 root keeps verbatim)

    **Final head block layout** (recommended ordering for readability):

    ```html
    <head>
      <!-- Charset + viewport -->
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2F3640" />

      <!-- SEO description -->
      <meta name="description" content="..." />

      <!-- Open Graph (Phase 6 D-21) -->
      <meta property="og:title" content="..." />
      <!-- ...10 og:* tags... -->

      <!-- Twitter Card (Phase 6 D-22) -->
      <meta name="twitter:card" content="summary_large_image" />
      <!-- ...4 twitter:* tags... -->

      <!-- Canonical (Phase 6 D-23) -->
      <link rel="canonical" href="..." />

      <!-- Favicon (existing Phase 1 SVG + Phase 6 PNG fallbacks) -->
      <link rel="icon" type="image/svg+xml" href="..." />
      <link rel="apple-touch-icon" href="..." />
      <link rel="icon" type="image/png" sizes="32x32" href="..." />

      <!-- Hero preload (Phase 3 + Phase 6 D-13 width limit) -->
      <link rel="preload" as="image" imagesrcset="..." imagesizes="..." />

      <title>ВИГОДА — Системний девелопмент</title>
    </head>
    ```

    Doc-block self-screen on the new HTML:
    - Forbidden lexicon: NO Pictorial/Rubikon/Пикторіал/Рубікон in any meta/comment (verified)
    - Hex literals: `#2F3640` is in 6-canonical whitelist; index.html is in `dist/` after build but paletteWhitelist scope is `src/**/*.{ts,tsx,css}` not `*.html`; no false positive
    - Placeholder tokens: NO `{{...}}` Mustache pairs (the locked literal copy uses no template syntax). HTML attributes use single-brace `content="..."` always.
    - Inline transition: not applicable (HTML)
    - Import boundaries: not applicable (HTML)
  </action>
  <verify>
    <automated>grep -q '<meta name="description"' index.html && grep -q 'content="ВИГОДА — Системний девелопмент"' index.html && grep -q 'og:title' index.html && grep -q 'og:description' index.html && grep -q 'og:url' index.html && grep -q 'og:image' index.html && grep -q 'og:image:width' index.html && grep -q 'content="1200"' index.html && grep -q 'og:image:height' index.html && grep -q 'content="630"' index.html && grep -q 'og:type' index.html && grep -q 'content="website"' index.html && grep -q 'og:locale' index.html && grep -q 'content="uk_UA"' index.html && grep -q 'og:site_name' index.html && grep -q 'twitter:card' index.html && grep -q 'content="summary_large_image"' index.html && grep -q 'twitter:title' index.html && grep -q 'twitter:image' index.html && ! grep -q 'twitter:site' index.html && ! grep -q 'twitter:creator' index.html && grep -q '<link rel="canonical"' index.html && grep -q 'href="https://yaroslavpetrukha.github.io/vugoda-website/"' index.html && grep -q 'apple-touch-icon' index.html && grep -q 'favicon-32.png' index.html && grep -q 'sizes="32x32"' index.html && grep -q 'theme-color' index.html && grep -q 'favicon.svg' index.html && grep -q 'aerial-640.avif 640w' index.html && grep -q 'aerial-1280.avif 1280w' index.html && ! grep -q 'aerial-1920.avif 1920w' index.html && npm run build && grep -q 'og:title' dist/index.html && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - **D-24 description**: `grep -c '<meta name="description"' index.html` returns 1; content matches the locked 143-character string
    - **D-21 OG meta presence (10 tags)**:
      - `grep -c '<meta property="og:title"' index.html` returns 1
      - `grep -c '<meta property="og:description"' index.html` returns 1
      - `grep -c '<meta property="og:url"' index.html` returns 1
      - `grep -c '<meta property="og:image"' index.html` returns 1
      - `grep -c '<meta property="og:image:width"' index.html` returns 1
      - `grep -c '<meta property="og:image:height"' index.html` returns 1
      - `grep -c '<meta property="og:image:alt"' index.html` returns 1
      - `grep -c '<meta property="og:type"' index.html` returns 1
      - `grep -c '<meta property="og:locale"' index.html` returns 1
      - `grep -c '<meta property="og:site_name"' index.html` returns 1
    - **D-21 OG values exact**:
      - `grep -q 'content="ВИГОДА — Системний девелопмент"' index.html` exits 0 (og:title + og:image:alt)
      - `grep -q 'Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline.' index.html` exits 0 (description + og:description + twitter:description)
      - `grep -q 'content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png"' index.html` exits 0 (og:image)
      - `grep -q 'content="1200"' index.html` exits 0 (og:image:width)
      - `grep -q 'content="630"' index.html` exits 0 (og:image:height)
      - `grep -q 'content="website"' index.html` exits 0 (og:type)
      - `grep -q 'content="uk_UA"' index.html` exits 0 (og:locale)
      - `grep -q 'content="ВИГОДА"' index.html` exits 0 (og:site_name — note: literal "ВИГОДА" appears here AND elsewhere; the matcher is correct)
    - **D-22 Twitter (5 tags + 0 forbidden)**:
      - `grep -c '<meta name="twitter:card"' index.html` returns 1
      - `grep -q 'content="summary_large_image"' index.html` exits 0
      - `grep -c '<meta name="twitter:title"' index.html` returns 1
      - `grep -c '<meta name="twitter:description"' index.html` returns 1
      - `grep -c '<meta name="twitter:image"' index.html` returns 1
      - `grep -c '<meta name="twitter:image:alt"' index.html` returns 1
      - `grep -c '<meta name="twitter:site"' index.html` returns 0 (D-22 forbids @handle in v1)
      - `grep -c '<meta name="twitter:creator"' index.html` returns 0
    - **D-23 canonical**: `grep -c '<link rel="canonical"' index.html` returns 1; href = `https://yaroslavpetrukha.github.io/vugoda-website/`
    - **D-25 favicon block**:
      - `grep -c '<link rel="apple-touch-icon"' index.html` returns 1; href = `/vugoda-website/apple-touch-icon.png`
      - `grep -c '<link rel="icon" type="image/png" sizes="32x32"' index.html` returns 1; href = `/vugoda-website/favicon-32.png`
      - `grep -c '<link rel="icon" type="image/svg+xml"' index.html` returns 1 (Phase 1 favicon.svg preserved)
      - `grep -q 'content="#2F3640"' index.html` exits 0 (theme-color preserved per D-25)
    - **D-13 hero preload limit**:
      - `grep -q 'aerial-640.avif 640w' index.html` exits 0 (640w preserved)
      - `grep -q 'aerial-1280.avif 1280w' index.html` exits 0 (1280w preserved)
      - `grep -c 'aerial-1920.avif 1920w' index.html` returns 0 (1920w REMOVED from preload imagesrcset)
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
    - `dist/index.html` (post-build) contains all the same meta tags (Vite copies index.html verbatim)
    - `grep -c 'og:title' dist/index.html` returns 1
  </acceptance_criteria>
  <done>
    - index.html ships 10 og:* + 5 twitter:* + 1 canonical + 1 description + 2 favicon PNG links
    - All locked values from D-21..D-25 are present verbatim
    - twitter:site / twitter:creator are NOT present (D-22)
    - Hero preload imagesrcset limited to [640w, 1280w] (1920w dropped per D-13)
    - Existing Phase 1 tags (charset, viewport, theme-color, favicon.svg, title) preserved
    - `npm run build` green; dist/index.html carries the same meta
    - Manual UAT (deferred to plan 06-09 deploy verification): paste deployed URL into Telegram/Slack/Viber → clean unfurl with 1200×630 OG image + correct title + description
  </done>
</task>

</tasks>

<verification>
- `test -f scripts/build-og-image.mjs && test -f public/og-image.png && test -f public/apple-touch-icon.png && test -f public/favicon-32.png` all exit 0
- `file public/og-image.png` reports `1200 x 630`
- `file public/apple-touch-icon.png` reports `180 x 180`
- `file public/favicon-32.png` reports `32 x 32`
- `grep -c 'og:title\|og:description\|og:image\|twitter:card\|theme-color\|canonical' index.html` returns ≥ 6 (all required meta groups present)
- index.html hero preload contains `aerial-640.avif 640w, aerial-1280.avif 1280w` only — `aerial-1920.avif 1920w` is absent from the preload imagesrcset
- `npm run build` exits 0 with `[check-brand] 5/5 checks passed`; dist/og-image.png + dist/apple-touch-icon.png + dist/favicon-32.png all exist after build
- package.json prebuild + predev both end with `&& node scripts/build-og-image.mjs`
- Manual visual sanity: open `public/og-image.png` — wordmark crisp, sub-line readable, accent cube present
</verification>

<success_criteria>
- [ ] `scripts/build-og-image.mjs` exists, runs cleanly, produces 3 PNGs at correct dimensions
- [ ] `package.json` prebuild + predev chains extended with `&& node scripts/build-og-image.mjs`
- [ ] `index.html` ships all required QA-03 meta: 10 og:*, 5 twitter:*, 1 canonical, 1 description, apple-touch + favicon-32 PNG, theme-color preserved
- [ ] `index.html` hero preload `imagesrcset` limited to `[640w, 1280w]` per D-13 (drops 1920w)
- [ ] No twitter:site / twitter:creator present (D-22)
- [ ] All 4 hardcoded URLs use `https://yaroslavpetrukha.github.io/vugoda-website/` (CLIENT-HANDOFF item D-38 lists the file edits if account differs — Wave 4 plan 06-09)
- [ ] `npm run build` produces green build with all 5 brand checks PASS; dist/ contains all meta + PNGs
- [ ] OG image visual sanity: wordmark «ВИГОДА» renders crisply (proves pre-pathing in og.svg works through sharp)
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-06-meta-and-og-image-SUMMARY.md` documenting:
- Verbatim final form of `scripts/build-og-image.mjs` (~80 lines)
- The package.json prebuild/predev edits (one-line append on each)
- The 24 new meta lines added to index.html + the 1-line preload imagesrcset edit
- Bytes saved by D-13 preload limit (the 1920w preload was ~388KB AVIF on DPR=1; dropping it from preload eliminates the double-fetch — measurable improvement in Lighthouse Performance)
- Visual confirmation that the OG PNG renders correctly (proves end-to-end pipeline: pre-pathed SVG → sharp → PNG → Vite copy → dist)
- Note that hardcoded URLs (`yaroslavpetrukha.github.io/vugoda-website/`) appear 4 times in index.html (og:url, og:image, twitter:image, canonical) — Wave 4 plan 06-09 produces a CLIENT-HANDOFF note listing all 4 if the GitHub account differs (D-38)
- Hash-route deep-link cost acknowledgement (RESEARCH §"Open Question 3"): the hero preload still fires on `/#/projects` deep-links — ~80-100KB cost on cold deep-link load; documented acceptable per HashRouter constraint, mitigated in v2 by per-route preload via JS-injected `<link>` (deferred)
</output>
