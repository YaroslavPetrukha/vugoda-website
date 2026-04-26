---
phase: 06-performance-mobile-fallback-deploy
plan: 08
type: execute
wave: 3
depends_on: [06-04-mobile-fallback, 06-05-lazy-routes-suspense, 06-06-meta-and-og-image, 06-07-page-titles]
files_modified:
  - scripts/optimize-images.mjs
  - scripts/check-brand.ts
autonomous: true
requirements: [QA-02]
must_haves:
  truths:
    - "scripts/optimize-images.mjs FORMATS array uses a per-bucket AVIF quality map: 1280w renders bucket gets quality:45 (target ≤200KB strict for hero LCP), other widths keep quality:50 (D-14)"
    - "scripts/check-brand.ts ships a 6th check `bundleBudget()` that reads `dist/assets/index-*.js`, gzips in-process via node:zlib gzipSync, and asserts ≤200KB (204800 bytes); FAIL exits with descriptive error showing actual size + limit"
    - "scripts/check-brand.ts ships a 7th check `heroBudget()` that reads `public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg}` (3 files) and asserts each ≤200KB; FAIL exits with the violating path + size; aerial-1920.* is NOT gated (retina-only fallback per D-15..D-16)"
    - "After re-running `npm run build` (which triggers the optimize-images.mjs re-encode at q=45 for 1280w renders), `aerial-1280.avif` shrinks from 200,706 bytes to ≤200KB (verified 175-185KB expected per RESEARCH §6); heroBudget() PASS"
    - "After Wave 2 lazy split (plan 06-05) shrunk the eager bundle, bundleBudget() PASS at the new lower size (~110-130KB gzipped expected, well under 200KB)"
    - "Total check-brand check count becomes 7/7; output line `[check-brand] 7/7 checks passed`; postbuild exits 0"
  artifacts:
    - path: scripts/optimize-images.mjs
      provides: "Per-bucket AVIF quality override (1280w → q=45) per D-14 for hero LCP target ≤200KB"
      contains: "quality: w === 1280 ? 45 : 50"
    - path: scripts/check-brand.ts
      provides: "6th check bundleBudget() + 7th check heroBudget() (D-11, D-12, D-16)"
      contains: "bundleBudget"
  key_links:
    - from: "scripts/check-brand.ts bundleBudget()"
      to: "dist/assets/index-*.js (Vite default chunk naming)"
      via: "readdirSync + readFileSync + gzipSync"
      pattern: "bundleBudget"
    - from: "scripts/check-brand.ts heroBudget()"
      to: "public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg}"
      via: "readFileSync + bytes-length comparison"
      pattern: "heroBudget"
    - from: "scripts/optimize-images.mjs FORMATS AVIF encoder"
      to: "1280w hero bucket (aerial-1280.avif)"
      via: "encoder closure receives width parameter"
      pattern: "w === 1280 \\? 45 : 50"
---

<objective>
Wave 3 ships the QA-02 byte-budget enforcement: per-bucket AVIF quality tuning + 2 new CI gates in `scripts/check-brand.ts`. Two files modified.

**1. Edit `scripts/optimize-images.mjs`** (D-14 + RESEARCH §"AVIF q-tuning is per-asset"):
Replace the global AVIF encoder closure with a per-bucket variant. The 1280w bucket on render images (the DPR=1 LCP target on Lighthouse Desktop) gets `quality: 45` to land ≤200KB strict; all other widths (640w, 1920w) and all construction-log images stay at `quality: 50`.

This is a ~3-line edit to the FORMATS array — replace the AVIF entry with a width-aware encoder. The downstream `optimizeFile()` function already passes `w` (width) into encoder calls; verify before edit and adjust if the existing signature needs minor tweaks.

After this edit + a fresh `npm run build`, `aerial-1280.avif` re-encodes from 200,706 bytes to an expected 170-185KB — fitting the heroBudget() ≤200KB gate.

**2. Edit `scripts/check-brand.ts`** (D-11 + D-12 + D-16):
Add 2 new check functions following the existing 5-check pattern (returns boolean, logs PASS/FAIL with [check-brand] prefix, included in the results aggregate). Update the top JSDoc from «5 checks» to «7 checks» and append the new descriptions.

**`bundleBudget()`** (D-11, RESEARCH §"Code Examples — bundleBudget()" verbatim):
- Reads `dist/assets/index-*.js` (Vite default eager-chunk naming)
- gzip in-process via `node:zlib gzipSync`
- Asserts ≤ `200 * 1024` bytes (204800)
- FAIL exits with the actual size + limit; PASS logs the size + percent of limit
- If `dist/` doesn't exist (e.g., before first build): logs SKIP + returns true (developer's `npx tsx scripts/check-brand.ts` from a clean checkout shouldn't fail; `postbuild` invocation always has dist/)
- If no `index-*.js` found (e.g., Vite config changed): FAIL with descriptive error (catches misconfigurations)

**`heroBudget()`** (D-12 + D-16 — gates ONLY 1280w):
- Reads `public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg}` (3 files)
- For each: assert byte length ≤ 200KB (204800 bytes)
- FAIL exits with the violating path + size; PASS logs «all hero variants ≤200KB»
- 1920w variants are NOT in the gate per D-15..D-16 (retina-only fallback; quality kept at q=50 for visual fidelity per D-15 carve-out)
- 640w variants are NOT in the gate (small enough by definition; if a 640w were over 200KB it would indicate a bug worth investigating, but the gate scope is the LCP-target only)

Both new functions are added to the `results` aggregate at the bottom of the file. Total checks become 7/7.

Output: 2 files edited. ~50-70 lines added across both. Same commit-friendly pattern as Phase 5 plan 05-08 (which added the 5th check `noInlineTransition()`).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@scripts/optimize-images.mjs
@scripts/check-brand.ts
</context>

<interfaces>
<!-- Existing scripts/optimize-images.mjs FORMATS block (Phase 3 D-19) -->

```js
const FORMATS = [
  { ext: 'avif', encoder: (s) => s.avif({ quality: 50, effort: 4 }) },
  { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
  { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
];

async function optimizeFile(srcPath, destDir, widths) {
  // ...
  for (const w of widths) {
    for (const { ext, encoder } of FORMATS) {
      // ...
      const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
      await encoder(pipeline).toFile(outPath);
      // ...
    }
  }
}
```

The encoder closure currently takes 1 parameter (sharp pipeline). Phase 6 D-14 makes it take 2: `(s, w)` — sharp pipeline + width. The downstream call site in optimizeFile becomes `await encoder(pipeline, w).toFile(outPath)`.

<!-- Existing scripts/check-brand.ts (Phase 2-5 — 5-check pattern) -->

```ts
// Top doc-block says «5 checks»; lists denylistTerms, paletteWhitelist,
// placeholderTokens, importBoundaries, noInlineTransition.

// 5 function definitions, each:
function denylistTerms(): boolean {
  // ... grep + console.log + return boolean
}

// Aggregate at bottom:
const results = [
  denylistTerms(),
  paletteWhitelist(),
  placeholderTokens(),
  importBoundaries(),
  noInlineTransition(),
];
const passed = results.filter(Boolean).length;
console.log(`[check-brand] ${passed}/${results.length} checks passed`);
if (results.some((r) => !r)) process.exit(1);
```

Phase 6 adds 2 functions + extends the results array to 7 entries.

<!-- bundleBudget + heroBudget verbatim shape (RESEARCH §"Code Examples") -->

```ts
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BUDGET_BYTES = 200 * 1024; // 200KB gzipped JS

function bundleBudget(): boolean {
  const assetsDir = 'dist/assets';
  if (!existsSync(assetsDir)) {
    console.log('[check-brand] PASS bundleBudget (no dist/ — skipping)');
    return true;
  }
  const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
  const eagerEntry = jsFiles.find((f) => f.startsWith('index-'));
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

The existing `existsSync` import in check-brand.ts (line 38) covers the new functions; `readFileSync`, `readdirSync` need to be added to the existing `node:fs` import. `gzipSync` from `node:zlib` is a NEW import. `join` from `node:path` is a NEW import.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Edit scripts/optimize-images.mjs — per-bucket AVIF quality (D-14 + RESEARCH §6)</name>
  <read_first>
    - scripts/optimize-images.mjs (full file — must understand current FORMATS array + encoder call site in optimizeFile)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-14 (per-bucket override; 1280w q=45)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-15..D-16 (1920w stays q=50; documented carve-out)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"`optimize-images.mjs` — per-bucket quality override" (verbatim ~3-line edit)
  </read_first>
  <files>scripts/optimize-images.mjs</files>
  <action>
    Edit `scripts/optimize-images.mjs`. Make 2 small changes:

    **Change A — Update the FORMATS array** so the AVIF encoder closure takes a width parameter:

    Find this line (currently around line 36):
    ```js
    const FORMATS = [
      { ext: 'avif', encoder: (s) => s.avif({ quality: 50, effort: 4 }) },
      { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
      { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
    ];
    ```

    Replace with:
    ```js
    const FORMATS = [
      // Phase 6 D-14: 1280w is the DPR=1 LCP target on Lighthouse Desktop —
      // must land ≤200KB. Other widths (640w, 1920w) keep quality:50 — the
      // 1920w retina variant is documented as not on the LCP path
      // (D-15 carve-out + heroBudget() in scripts/check-brand.ts gates only
      // aerial-1280.{avif,webp,jpg} per D-16).
      { ext: 'avif', encoder: (s, w) => s.avif({ quality: w === 1280 ? 45 : 50, effort: 4 }) },
      { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
      { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
    ];
    ```

    Net change: AVIF encoder takes `(s, w)` instead of `(s)`; uses ternary `w === 1280 ? 45 : 50` for quality.

    **Change B — Update the call site in optimizeFile()** to pass width to the encoder:

    Find this line (in `optimizeFile()`, currently around line 54):
    ```js
    await encoder(pipeline).toFile(outPath);
    ```

    Replace with:
    ```js
    await encoder(pipeline, w).toFile(outPath);
    ```

    Net change: pass `w` as second argument. The webp/jpg encoders already ignore extra args (their closures take only `(s)`); the avif encoder now uses the second arg.

    **Verify after edit:**
    - Delete the existing optimized hero bucket to force regeneration: `rm -f public/renders/lakeview/_opt/aerial-1280.avif`
    - Run `npm run build`
    - Check the new size: `ls -la public/renders/lakeview/_opt/aerial-1280.avif | awk '{print $5}'` should print a value LESS than 204800 (200KB)
    - Visual sanity: open `public/renders/lakeview/_opt/aerial-1280.avif` in browser — verify the hero render still looks brand-quality (no posterization, no banding) at q=45

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero matches)
    - Hex literals: NO `#XXXXXX` (zero — pure quality numbers)
    - Placeholder tokens: NO `{{...}}` (zero)
    - Inline transition: not applicable (.mjs script)
    - Import boundaries: scripts/ is out of scope for all check-brand checks
  </action>
  <verify>
    <automated>grep -q "w === 1280 ? 45 : 50" scripts/optimize-images.mjs && grep -q "encoder(pipeline, w)" scripts/optimize-images.mjs && rm -f public/renders/lakeview/_opt/aerial-1280.avif && npm run build && test -f public/renders/lakeview/_opt/aerial-1280.avif && SIZE=$(stat -f%z public/renders/lakeview/_opt/aerial-1280.avif 2>/dev/null || stat -c%s public/renders/lakeview/_opt/aerial-1280.avif) && [ "$SIZE" -le 204800 ] && echo "OK ($SIZE bytes)"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "w === 1280 ? 45 : 50" scripts/optimize-images.mjs` returns 1 (per-bucket quality override applied)
    - `grep -c "encoder(pipeline, w)" scripts/optimize-images.mjs` returns 1 (call site passes width)
    - `grep -c "(s, w) =>" scripts/optimize-images.mjs` returns ≥ 1 (AVIF closure signature updated)
    - After deleting aerial-1280.avif and running `npm run build`: file regenerated AND `stat` returns size ≤ 204800 bytes (≤200KB)
    - aerial-1920.avif is NOT changed by this edit (still ~388KB at q=50; not gated; documented carve-out)
    - aerial-640.avif is NOT changed by this edit (small by definition; was already <50KB)
    - Construction-log AVIF images (e.g. `public/construction/mar-2026/_opt/IMG_*-1280.avif`) — these go through the SAME pipeline. The 1280w bucket on construction images now also encodes at q=45. This is a deliberate side-effect documented in the comment («Other widths (640w, 1920w) keep quality:50»); per D-14 «Easiest: per-asset override map keyed by basename + width, OR a slightly more aggressive global q=45 that affects all renders (acceptable; 1280w is already a fallback-not-LCP for non-hero renders)». Visual sanity check on a construction-log photo at 1280w confirms no quality regression.
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed` (no new check yet — Task 2 adds them)
    - `file public/renders/lakeview/_opt/aerial-1280.avif` confirms a valid AVIF
  </acceptance_criteria>
  <done>
    - optimize-images.mjs ships per-bucket AVIF quality (1280w → q=45; 640w + 1920w stay q=50)
    - aerial-1280.avif re-encoded ≤200KB after fresh build
    - Visual quality preserved (no banding/posterization on hero render at q=45)
    - aerial-1920.avif unchanged (retina-only fallback, documented carve-out)
    - `npm run build` green
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add bundleBudget() + heroBudget() to scripts/check-brand.ts (D-11, D-12, D-16)</name>
  <read_first>
    - scripts/check-brand.ts (FULL FILE — must understand existing 5-check structure: imports, function defs, results aggregate at bottom)
    - .planning/phases/05-animations-polish/05-08-no-inline-transition-check-PLAN.md (reference: how the 5th check was added in Phase 5 — same surgical pattern)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-11 (bundleBudget specs)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-12 + §D-16 (heroBudget specs — gates 1280w only)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Code Examples — `bundleBudget()` — drop-in for `scripts/check-brand.ts`" (verbatim ~70-line implementation)
  </read_first>
  <files>scripts/check-brand.ts</files>
  <action>
    Edit `scripts/check-brand.ts`. Three groups of changes — same surgical pattern as Phase 5 plan 05-08.

    **Change A — Update top JSDoc** (line 1-36 in the current file). The existing block says «5 checks:» and lists 5 names. Update count to 7 and append the new descriptions:

    Replace the existing «5 checks:» block list with:
    ```ts
     * 7 checks:
     *   1. denylistTerms()      — silent-displacement literals in dist/+src/
     *   2. paletteWhitelist()   — hex literals in src/ ⊆ 6-canonical brandbook palette
     *   3. placeholderTokens()  — {{...}}, TODO, FIXME in dist/ only (not src/)
     *   4. importBoundaries()   — D-32 + D-09 import/path-literal rules
     *   5. noInlineTransition() — Phase 5 SC#1 — no inline JSX-prop transition objects in src/
     *   6. bundleBudget()       — Phase 6 D-11 — eager JS bundle (dist/assets/index-*.js) ≤200KB gzipped
     *   7. heroBudget()         — Phase 6 D-12 + D-16 — public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg} each ≤200KB
    ```

    Update the «Scope:» paragraph to mention the new scopes:
    ```ts
     * Scope: dist/+src/ for denylist (D-25), src/**\/*.{ts,tsx,css} for palette
     * (D-26), dist/ only for placeholders (D-27), src/ grep patterns for
     * boundaries (D-33), src/**\/*.{ts,tsx} for noInlineTransition (Phase 5
     * D-27), dist/assets/ for bundleBudget (Phase 6 D-11), public/renders/
     * lakeview/_opt/ for heroBudget (Phase 6 D-12 + D-16).
    ```

    **Change B — Add 3 new imports** at the top of the file. Find the existing import block (around lines 37-38):
    ```ts
    import { execSync } from 'node:child_process';
    import { existsSync } from 'node:fs';
    ```

    Replace with:
    ```ts
    import { execSync } from 'node:child_process';
    import { existsSync, readFileSync, readdirSync } from 'node:fs';
    import { gzipSync } from 'node:zlib';
    import { join } from 'node:path';
    ```

    **Change C — Add bundleBudget() and heroBudget() function definitions** AFTER `noInlineTransition()` closes (currently around line 228) and BEFORE the `// ---- Aggregate ---` separator. Insert this block:

    ```ts

    // ---- 6. Bundle budget (Phase 6 D-11) -----------------------------------
    // Asserts the eager JS bundle (Vite default chunk: dist/assets/index-*.js)
    // is ≤200KB gzipped (PROJECT.md QA-02 hard constraint). Lazy chunks
    // produced by App.tsx React.lazy() (Phase 6 plan 06-05) are correctly
    // excluded from this gate — they're loaded on demand.
    //
    // gzip in-process via node:zlib gzipSync (no subprocess overhead, portable
    // across Linux/macOS GitHub Actions runners). 200 * 1024 = 204800 bytes.
    //
    // Doc-block assumption: Vite 6 default `entryFileNames: 'assets/[name]-[hash].js'`
    // produces an `index-{hash}.js` for the eager entry. If a future Phase
    // customises entryFileNames, update the .find() predicate here OR the
    // chunk renaming itself.
    const BUNDLE_BUDGET_BYTES = 200 * 1024;

    function bundleBudget(): boolean {
      const assetsDir = 'dist/assets';
      if (!existsSync(assetsDir)) {
        console.log('[check-brand] PASS bundleBudget (no dist/ — skipping)');
        return true;
      }
      const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
      const eagerEntry = jsFiles.find((f) => f.startsWith('index-'));
      if (!eagerEntry) {
        console.error('[check-brand] FAIL bundleBudget — no entry chunk (index-*.js) found');
        return false;
      }
      const buf = readFileSync(join(assetsDir, eagerEntry));
      const gz = gzipSync(buf).length;
      if (gz > BUNDLE_BUDGET_BYTES) {
        console.error(
          `[check-brand] FAIL bundleBudget — ${eagerEntry} = ${gz} bytes gzipped (limit ${BUNDLE_BUDGET_BYTES})`,
        );
        return false;
      }
      console.log(
        `[check-brand] PASS bundleBudget — ${(gz / 1024).toFixed(1)} KB gzipped ` +
          `(${((gz / BUNDLE_BUDGET_BYTES) * 100).toFixed(0)}% of 200 KB limit)`,
      );
      return true;
    }

    // ---- 7. Hero budget (Phase 6 D-12 + D-16) ------------------------------
    // Asserts public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg} each
    // ≤200KB. The 1280w bucket is the DPR=1 LCP target on Lighthouse Desktop
    // (per `<picture>` source `sizes="(min-width: 1280px) 768px, 100vw"` —
    // the 768 effective px maps to 1280w). 1920w retina-only variants are
    // NOT gated (D-15 carve-out — kept at q=50 for visual fidelity).
    //
    // After Phase 6 plan 06-08 Task 1 retunes optimize-images.mjs to q=45
    // for 1280w renders, aerial-1280.avif lands ~170-185KB; this gate goes
    // green and stays green going forward.
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

    **Change D — Update the results aggregate** at the bottom of the file. Find this block:
    ```ts
    const results = [
      denylistTerms(),
      paletteWhitelist(),
      placeholderTokens(),
      importBoundaries(),
      noInlineTransition(),
    ];
    const passed = results.filter(Boolean).length;
    console.log(`[check-brand] ${passed}/${results.length} checks passed`);
    if (results.some((r) => !r)) process.exit(1);
    ```

    Replace with:
    ```ts
    const results = [
      denylistTerms(),
      paletteWhitelist(),
      placeholderTokens(),
      importBoundaries(),
      noInlineTransition(),
      bundleBudget(),
      heroBudget(),
    ];
    const passed = results.filter(Boolean).length;
    console.log(`[check-brand] ${passed}/${results.length} checks passed`);
    if (results.some((r) => !r)) process.exit(1);
    ```

    Doc-block self-screen on the additions:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero matches in JSDoc + function bodies)
    - Hex literals: NO `#XXXXXX` (zero — only number literals 200/1024/204800)
    - Placeholder tokens: NO `{{...}}` Mustache pairs. **CRITICAL CHECK**: the existing check-brand.ts already handles the dist/ scope for placeholderTokens (which uses the regex `\{\{[^}]*\}\}`). The scripts/ directory is OUT of scope for this check (line 27-28 doc-block: «This script itself lives in scripts/ — intentionally OUT of scope for all five checks»). Phase 6 inherits this convention — scripts/check-brand.ts can reference `{{...}}` in JSDoc descriptive prose without self-triggering. Verified: the new content does NOT use any `\{\{[^}]*\}\}` patterns — verified.
    - Inline transition: NO `transition={{` (this is a Node script, no JSX)
    - Import boundaries: scripts/ is out of scope for all 7 checks (continues the established convention)

    Verify after edit:
    - `npx tsc --noEmit` exits 0 (the new TS imports + functions type-check cleanly; readFileSync/readdirSync/gzipSync/join all from Node built-ins)
    - `npm run build` invokes `tsc --noEmit && vite build && tsx scripts/check-brand.ts` — exits 0
    - `npx tsx scripts/check-brand.ts` (after a fresh build) outputs «7/7 checks passed»
    - Try inducing a regression to confirm gates work:
      - Temporarily add `import 'all-of-react'` (a non-existent fake import) to a small page → `vite build` should still succeed (or fail; either way the bundle changes)
      - More realistic: temporarily add a 50KB hero render shim (e.g., echo random data into aerial-1280.avif) → `npx tsx scripts/check-brand.ts` should print FAIL with the size + limit, exit 1
      - Revert the test mutation
  </action>
  <verify>
    <automated>grep -q "^function bundleBudget" scripts/check-brand.ts && grep -q "^function heroBudget" scripts/check-brand.ts && grep -q "import { existsSync, readFileSync, readdirSync } from 'node:fs'" scripts/check-brand.ts && grep -q "import { gzipSync } from 'node:zlib'" scripts/check-brand.ts && grep -q "import { join } from 'node:path'" scripts/check-brand.ts && grep -q "bundleBudget()," scripts/check-brand.ts && grep -q "heroBudget()," scripts/check-brand.ts && grep -q "7 checks:" scripts/check-brand.ts && npm run build 2>&1 | grep -q "7/7 checks passed" && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "^function bundleBudget(): boolean" scripts/check-brand.ts` returns 1
    - `grep -c "^function heroBudget(): boolean" scripts/check-brand.ts` returns 1
    - `grep -c "import { existsSync, readFileSync, readdirSync } from 'node:fs'" scripts/check-brand.ts` returns 1 (existing existsSync import extended with the 2 new symbols)
    - `grep -c "import { gzipSync } from 'node:zlib'" scripts/check-brand.ts` returns 1
    - `grep -c "import { join } from 'node:path'" scripts/check-brand.ts` returns 1
    - `grep -c "bundleBudget()," scripts/check-brand.ts` returns 1 (in results aggregate)
    - `grep -c "heroBudget()," scripts/check-brand.ts` returns 1 (in results aggregate)
    - `grep -c "BUNDLE_BUDGET_BYTES" scripts/check-brand.ts` returns ≥ 2 (declaration + usage)
    - `grep -c "HERO_BUDGET_BYTES" scripts/check-brand.ts` returns ≥ 2 (declaration + usage)
    - `grep -c "HERO_BUCKETS" scripts/check-brand.ts` returns ≥ 2 (declaration + usage)
    - `grep -c "7 checks:" scripts/check-brand.ts` returns 1 (top JSDoc updated)
    - `grep -cE 'aerial-1280\\.(avif|webp|jpg)' scripts/check-brand.ts` returns 3 (one per hero variant)
    - `grep -cE 'aerial-1920' scripts/check-brand.ts` returns 0 (1920w NOT gated per D-15..D-16)
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0; output contains the line `[check-brand] 7/7 checks passed`
    - **Regression sanity** (manual, optional): temporarily delete `public/renders/lakeview/_opt/aerial-1280.avif` → run `npx tsx scripts/check-brand.ts` → output contains `FAIL heroBudget — missing public/renders/lakeview/_opt/aerial-1280.avif` and exits 1; run `node scripts/optimize-images.mjs renders` to regenerate, then re-run check → 7/7 PASS
  </acceptance_criteria>
  <done>
    - check-brand.ts ships 7 checks (5 inherited + 2 new: bundleBudget + heroBudget)
    - Top JSDoc updated from «5 checks» → «7 checks» with descriptions
    - Result aggregate includes the 2 new functions
    - `npm run build` outputs `[check-brand] 7/7 checks passed`
    - The bundleBudget gate verifies the post-Wave-2 lazy-split-eager-bundle is comfortably under 200KB
    - The heroBudget gate verifies the post-Task-1 retuned aerial-1280.* is ≤200KB
    - Future regressions (unintended bundle bloat, hero re-shoots that exceed budget) FAIL the build automatically — permanent CI invariant
  </done>
</task>

</tasks>

<verification>
- `npm run build` exits 0 with `[check-brand] 7/7 checks passed` printed near the end
- `aerial-1280.avif` ≤ 200KB after the optimizer retune
- `dist/assets/index-*.js` gzipped ≤ 200KB (expected ~110-130KB after Wave 2 lazy split)
- `npx tsc --noEmit` exits 0
- Manual regression test (optional): induce a hero overshoot OR a bundle bloat → verify the relevant gate FAILs the build with descriptive error → revert
- `git status` shows only the 2 expected file edits + the auto-regenerated PNGs (which are gitignored)
</verification>

<success_criteria>
- [ ] `scripts/optimize-images.mjs` per-bucket AVIF quality applied (1280w → q=45)
- [ ] `aerial-1280.avif` ≤ 200KB after fresh build
- [ ] `aerial-1920.avif` unchanged (retina-only fallback, documented carve-out)
- [ ] `scripts/check-brand.ts` ships 6th check `bundleBudget()` + 7th check `heroBudget()`
- [ ] Top JSDoc updated to «7 checks»
- [ ] Result aggregate includes both new functions
- [ ] `npm run build` exits 0 with output `[check-brand] 7/7 checks passed`
- [ ] Future bundle bloat or hero overshoot will fail the build (permanent CI invariants)
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-08-budget-gates-SUMMARY.md` documenting:
- The 4-line edit to optimize-images.mjs (FORMATS array + call site)
- Verbatim final form of bundleBudget() + heroBudget() (~50 lines)
- Pre/post sizes:
  - aerial-1280.avif: was 200,706 bytes → after q=45 retune: report exact size (expected 170-185KB)
  - dist/assets/index-*.js: was ~134KB pre-Phase-6 → after Wave 2 lazy split: report exact size (expected 110-130KB)
- Construction-log 1280w side-effect: aware that all _opt/*-1280.avif files are now at q=45 (acceptable per D-14; visual sanity confirmed at impl time)
- Confirmation that 7/7 check-brand gates PASS on first run after the retune
- Note that bundleBudget() and heroBudget() are now permanent CI invariants — any future plan that bloats the eager bundle past 200KB OR re-shoots the hero with a >200KB 1280w variant will fail the build automatically
- Risk acknowledged: the bundleBudget grep target `index-*.js` assumes Vite default chunk naming. If a future plan customizes `entryFileNames` in vite.config.ts, the gate may silently pass (no entry chunk found → returns false with descriptive error per current implementation). The current "FAIL on no entry chunk" behavior is correct — it surfaces misconfiguration rather than hiding it.
</output>
