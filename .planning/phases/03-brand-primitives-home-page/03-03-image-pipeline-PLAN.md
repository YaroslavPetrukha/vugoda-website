---
phase: 03-brand-primitives-home-page
plan: 3
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - scripts/optimize-images.mjs
  - src/components/ui/ResponsivePicture.tsx
autonomous: true
requirements: [HOME-03, HOME-04]
requirements_addressed: [HOME-03, HOME-04]

must_haves:
  truths:
    - "`scripts/optimize-images.mjs` exists and emits AVIF/WebP/JPG triples at 3 widths (640/1280/1920 for renders, 640/960 for construction) per D-19"
    - "`prebuild` and `predev` chain `optimize-images.mjs` AFTER `copy-renders.ts` per D-20 — `npm run prebuild` produces optimized variants in `public/{renders,construction}/**/_opt/`"
    - "`<ResponsivePicture>` emits `<picture><source type=\"image/avif\"><source type=\"image/webp\"><img></picture>` and uses `assetUrl` from `src/lib/assetUrl.ts` (NEVER hardcoded /renders/ paths) per D-21"
    - "`sharp@^0.34.5` added to devDependencies (Node engine compat with project's `^20.19 || >=22.12` pin)"
    - "`npm run build` exits 0 — including `tsc --noEmit && vite build` and `postbuild` `check-brand` (importBoundaries holds — ResponsivePicture.tsx contains zero `'/renders/'` or `'/construction/'` literals)"
  artifacts:
    - path: "scripts/optimize-images.mjs"
      provides: "Build-time image encoder using sharp 0.34"
      min_lines: 60
    - path: "src/components/ui/ResponsivePicture.tsx"
      provides: "Reusable picture/source/img component used by Hero (Wave 3), PortfolioOverview (Wave 3), ConstructionTeaser (Wave 3), and Phase 4 gallery + log"
      exports: ["ResponsivePicture", "ResponsivePictureProps"]
    - path: "package.json"
      provides: "sharp devDependency + chained `predev`/`prebuild` scripts"
      contains: '"sharp":'
  key_links:
    - from: "src/components/ui/ResponsivePicture.tsx"
      to: "src/lib/assetUrl.ts"
      via: "import { assetUrl } — single path constructor (Phase 2 D-30)"
      pattern: "from '\\.\\./\\.\\./lib/assetUrl'"
    - from: "package.json scripts"
      to: "scripts/optimize-images.mjs"
      via: "predev/prebuild chain — runs AFTER copy-renders.ts"
      pattern: "tsx scripts/copy-renders\\.ts && node scripts/optimize-images\\.mjs"
    - from: "scripts/optimize-images.mjs"
      to: "public/{renders,construction}/**/*"
      via: "filesystem read after copy-renders has populated public/"
      pattern: "processTree.*PUBLIC.*renders.*construction"
---

<objective>
Ship the build-time image pipeline that hits Phase 6's Lighthouse hero ≤200KB budget AND the reusable `<ResponsivePicture>` component that ALL home/Phase-4 image surfaces consume. This is the single new piece of build infrastructure Phase 3 introduces.

Purpose: Phase 6 owns Lighthouse verification (QA-02), but Phase 6's image budget is only achievable if Phase 3 ships an AVIF/WebP/JPG triplets-at-3-widths optimizer NOW. Per D-18 the hero LCP image is `aerial.jpg` — its AVIF-1920 variant must exist before Wave 3's Hero/PortfolioOverview reference it via `<ResponsivePicture>`.

Output:
1. `sharp@^0.34.5` added to `devDependencies`
2. `scripts/optimize-images.mjs` (~80 lines, ESM, idempotent via mtime comparison)
3. `package.json` `predev`/`prebuild` chain updated
4. `src/components/ui/ResponsivePicture.tsx` (~70 lines, uses `assetUrl` per Phase 2 D-30)
5. After first `npm run prebuild`, ~70 source images × 3 widths × 3 formats ≈ 600+ optimized files in `_opt/` siblings — `aerial-1920.{avif,webp,jpg}` is the LCP-critical triplet
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@CLAUDE.md

<interfaces>
<!-- Existing build infrastructure to integrate with -->

Current `package.json:6-15` scripts:
```json
"predev": "tsx scripts/copy-renders.ts",
"dev": "vite",
"prebuild": "tsx scripts/copy-renders.ts",
"build": "tsc --noEmit && vite build",
"postbuild": "tsx scripts/check-brand.ts",
"preview": "vite preview",
"lint": "tsc --noEmit",
"list:construction": "tsx scripts/list-construction.ts"
```

Current `package.json:24-35` devDependencies — Phase 3 ADDS only `sharp`:
```
"@tailwindcss/vite", "@types/node", "@types/react", "@types/react-dom",
"@vitejs/plugin-react", "tailwindcss", "tsx", "typescript", "vite", "vite-plugin-svgr"
```

Phase 2 `scripts/copy-renders.ts` populates:
- `public/renders/{lakeview,etno-dim,maietok-vynnykivskyi,nterest}/*.{jpg,jpg.webp,png.webp}`
- `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/*.jpg`

Existing `src/lib/assetUrl.ts:12-37`:
```ts
const BASE = import.meta.env.BASE_URL;
export const assetUrl = (path: string): string =>
  `${BASE}${path.replace(/^\//, '')}`;
export const renderUrl = (slug: string, file: string): string =>
  `${BASE}renders/${slug}/${file}`;
export const constructionUrl = (month: string, file: string): string =>
  `${BASE}construction/${month}/${file}`;
```

Phase 2 `scripts/check-brand.ts importBoundaries()` rule (lines 162-166):
```
'components must not contain raw /renders/ or /construction/ paths'
grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/"
  src/components/
```
ResponsivePicture.tsx must NOT contain raw `/renders/` or `/construction/` string literals — uses `assetUrl(path)` instead.

Brand-asset filenames the optimizer must handle (Phase 2 stored these — verified):
- `public/renders/lakeview/aerial.jpg` (1.5MB raw — LCP target)
- `public/renders/etno-dim/43615.jpg.webp` (already WebP, optimizer re-encodes for consistency)
- `public/renders/maietok-vynnykivskyi/44463.jpg.webp`
- `public/renders/nterest/2213.jpg.webp`
- `public/construction/mar-2026/mar-01.jpg` through `mar-15.jpg` (15 files, ~280–500KB each)

Sharp `^0.34.5` engines requirement: `^18.17 || ^20.3 || >=21` — project's `.nvmrc` pins Node 20.19; compat OK.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Install sharp and update package.json scripts</name>
  <files>package.json</files>
  <read_first>
    - package.json (current scripts + devDependencies)
    - 03-CONTEXT.md D-19, D-20 (sharp@^0.34.5; predev/prebuild chain syntax)
    - 03-RESEARCH.md lines 555–658 (sharp encoding params + script recipe)
    - 03-RESEARCH.md lines 1241–1244 (Pitfall 8: sharp ESM/CJS interop on Node 20+ — verified OK)
  </read_first>
  <action>
    Step A — Install sharp as devDependency:
    ```bash
    npm install --save-dev sharp@^0.34.5
    ```
    Verify the install adds `"sharp": "^0.34.5"` to `package.json` `devDependencies` AND updates `package-lock.json`. If `npm install` reports peer-dep warnings, ignore them — sharp has no relevant peers.

    Step B — Modify `package.json` scripts to chain the optimizer:
    Edit `package.json:6-15` so the relevant scripts read:
    ```json
    "predev": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs",
    "dev": "vite",
    "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs",
    "build": "tsc --noEmit && vite build",
    "postbuild": "tsx scripts/check-brand.ts",
    "preview": "vite preview",
    "lint": "tsc --noEmit",
    "list:construction": "tsx scripts/list-construction.ts"
    ```
    The chain ORDER is critical: `copy-renders.ts` MUST run first (populates `public/`), THEN `optimize-images.mjs` reads from there.

    Use `node` (not `tsx`) to run `optimize-images.mjs` — it's pure ESM, no TS, and per D-20 we avoid adding `@types/sharp` to `tsconfig.scripts.json`'s lean surface.

    Note: don't run `npm run prebuild` here — that's Task 2's verification step, after the script file exists.
  </action>
  <verify>
    <automated>grep -nE '"sharp":\s*"\^0\.34\.5"' package.json &amp;&amp; grep -nE '"prebuild":\s*"tsx scripts/copy-renders\.ts &amp;&amp; node scripts/optimize-images\.mjs"' package.json &amp;&amp; grep -nE '"predev":\s*"tsx scripts/copy-renders\.ts &amp;&amp; node scripts/optimize-images\.mjs"' package.json</automated>
  </verify>
  <done>
    `package.json` shows `"sharp": "^0.34.5"` in devDependencies. `predev` and `prebuild` both chain `copy-renders.ts && node scripts/optimize-images.mjs`. `package-lock.json` updated to reflect new dep tree. `node_modules/sharp/` exists (sharp downloaded its native binary).
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create scripts/optimize-images.mjs</name>
  <files>scripts/optimize-images.mjs</files>
  <read_first>
    - 03-CONTEXT.md D-19, D-20 (encoder params, output paths, idempotency requirement)
    - 03-RESEARCH.md lines 555–658 (verbatim recipe — copy structurally, adjust as needed)
    - 03-RESEARCH.md lines 1246–1248 (Pitfall 9: source-mtime drift after git pull — accept slow first build)
    - 03-RESEARCH.md lines 1250–1253 (Pitfall 10: `_opt/` already covered by Phase 2 `.gitignore` for `public/renders/` and `public/construction/`)
    - scripts/copy-renders.ts (Phase 2 — Pattern: `fileURLToPath(new URL('..', import.meta.url))` to handle Cyrillic checkout path)
  </read_first>
  <behavior>
    - Test 1: file is ESM (`.mjs`), uses `import sharp from 'sharp'`
    - Test 2: encoder params match D-19 verbatim — AVIF `quality: 50, effort: 4`; WebP `quality: 75`; JPG `mozjpeg: true, quality: 80`
    - Test 3: widths matrix — `[640, 1280, 1920]` for `public/renders/`, `[640, 960]` for `public/construction/`
    - Test 4: outputs to sibling `_opt/` directory (NOT inside the source dir; siblings of source files): `public/renders/lakeview/_opt/aerial-1920.avif`
    - Test 5: idempotency — skips when source mtime ≤ output mtime (`statSync(outPath).mtimeMs >= srcMtime`)
    - Test 6: `withoutEnlargement: true` on `.resize()` — never upscale below source resolution
    - Test 7: walks recursively but SKIPS dotfiles AND any directory named `_opt` (no infinite recursion into output)
    - Test 8: uses `fileURLToPath(new URL('..', import.meta.url))` to compute repo root (handles non-ASCII checkout path per Phase 2 03 plan decision)
    - Test 9: filename base-strip regex `/\.(jpg|jpeg|png|webp)$/i` — keeps `.jpg.webp` files producing base `43615.jpg` (consistent with ResponsivePicture's same regex)
    - Test 10: console-log progress per tree (e.g. `[optimize-images] public/renders: 20 sources`)
  </behavior>
  <action>
    CREATE file `scripts/optimize-images.mjs` with verbatim content (taken from RESEARCH.md §D, line 572–652):

    ```js
    /**
     * scripts/optimize-images.mjs
     *
     * Build-time image optimizer per Phase 3 D-19/D-20.
     *
     * Reads source JPG/PNG/WebP from public/renders/**\/* and public/construction/**\/*
     * (after copy-renders.ts has populated public/) and emits sharp-encoded
     * AVIF/WebP/JPG triples at 3 widths into public/{renders,construction}/{slug,month}/_opt/.
     *
     * Idempotent: skips files where output mtime >= source mtime. First run on a fresh
     * checkout is ~30–60s for ~70 sources. Subsequent runs are <500ms (mtime stat only).
     *
     * Runs as `prebuild`/`predev` step AFTER copy-renders.ts:
     *   "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs"
     *
     * Why .mjs (not .ts): avoids @types/sharp surface in tsconfig.scripts.json.
     * Plain ESM JS runs natively under Node ≥20.
     *
     * Path construction uses fileURLToPath(new URL('..', import.meta.url)) per
     * Plan 02-03's pattern — repo checkout path may contain non-ASCII characters
     * (e.g. "Проєкти") which percent-encode if you use .pathname directly.
     */

    import sharp from 'sharp';
    import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
    import { join, relative, basename } from 'node:path';
    import { fileURLToPath } from 'node:url';

    const ROOT = fileURLToPath(new URL('..', import.meta.url));
    const PUBLIC = join(ROOT, 'public');

    const isImage = (f) => /\.(jpg|jpeg|png|webp)$/i.test(f);
    const stripFormatSuffix = (f) => f.replace(/\.(jpg|jpeg|png|webp)$/i, '');

    const FORMATS = [
      { ext: 'avif', encoder: (s) => s.avif({ quality: 50, effort: 4 }) },
      { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
      { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
    ];

    async function optimizeFile(srcPath, destDir, widths) {
      const filename = basename(srcPath);
      const base = stripFormatSuffix(filename);
      const srcMtime = statSync(srcPath).mtimeMs;

      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

      for (const w of widths) {
        for (const { ext, encoder } of FORMATS) {
          const outPath = join(destDir, `${base}-${w}.${ext}`);
          // Idempotency: skip if existing output is newer than source.
          if (existsSync(outPath) && statSync(outPath).mtimeMs >= srcMtime) continue;
          const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
          await encoder(pipeline).toFile(outPath);
        }
      }
    }

    function* walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === '_opt') continue;       // never recurse into output dir
        if (entry.name.startsWith('.')) continue;  // skip dotfiles (.DS_Store etc.)
        const full = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (entry.isFile() && isImage(entry.name)) yield full;
      }
    }

    async function processTree(treeDir, widths) {
      if (!existsSync(treeDir)) {
        console.warn(`[optimize-images] missing tree: ${treeDir}`);
        return;
      }
      const files = [...walk(treeDir)];
      console.log(`[optimize-images] ${relative(ROOT, treeDir)}: ${files.length} sources`);
      for (const src of files) {
        const destDir = join(src, '..', '_opt');
        await optimizeFile(src, destDir, widths);
      }
      console.log(`[optimize-images] ${relative(ROOT, treeDir)}: done`);
    }

    await processTree(join(PUBLIC, 'renders'), [640, 1280, 1920]);
    await processTree(join(PUBLIC, 'construction'), [640, 960]);
    console.log('[optimize-images] complete');
    ```

    After file creation, RUN `npm run prebuild` once to verify the optimizer works end-to-end. Expected output:
    - Console shows `[optimize-images] public/renders: N sources` (N = count of jpg/png/webp under renders/)
    - Console shows `[optimize-images] public/construction: 50 sources` (4 months × ~12 photos each)
    - Console final line: `[optimize-images] complete`
    - Spot-check files exist:
      - `public/renders/lakeview/_opt/aerial-1920.avif`
      - `public/renders/lakeview/_opt/aerial-1920.webp`
      - `public/renders/lakeview/_opt/aerial-1920.jpg`
      - `public/construction/mar-2026/_opt/mar-01-960.avif`
    - Spot-check file size: `aerial-1920.avif` should be 80–140KB; if >200KB the encoder params or source resolution warrants a deeper look — log size + raise as Phase 3 risk note.
  </action>
  <verify>
    <automated>test -f scripts/optimize-images.mjs &amp;&amp; grep -nE "import sharp from 'sharp'" scripts/optimize-images.mjs &amp;&amp; grep -nE "quality: 50, effort: 4" scripts/optimize-images.mjs &amp;&amp; grep -nE "quality: 75" scripts/optimize-images.mjs &amp;&amp; grep -nE "mozjpeg: true" scripts/optimize-images.mjs &amp;&amp; grep -nE "\[640, 1280, 1920\]" scripts/optimize-images.mjs &amp;&amp; grep -nE "\[640, 960\]" scripts/optimize-images.mjs &amp;&amp; npm run prebuild &amp;&amp; test -f public/renders/lakeview/_opt/aerial-1920.avif &amp;&amp; test -f public/renders/lakeview/_opt/aerial-1920.webp &amp;&amp; test -f public/renders/lakeview/_opt/aerial-1920.jpg</automated>
  </verify>
  <done>
    `scripts/optimize-images.mjs` exists with sharp + encoder params per D-19. `npm run prebuild` runs both `copy-renders.ts` and `optimize-images.mjs` to completion. `aerial-1920.{avif,webp,jpg}` triplet exists in `public/renders/lakeview/_opt/`. `aerial-1920.avif` size <200KB (LCP budget guard).
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Create src/components/ui/ResponsivePicture.tsx</name>
  <files>src/components/ui/ResponsivePicture.tsx</files>
  <read_first>
    - src/lib/assetUrl.ts (Phase 2 — `assetUrl` is the helper this component uses; NEVER hardcode `/renders/`)
    - 03-CONTEXT.md D-21 (full component prop spec)
    - 03-RESEARCH.md lines 442–553 (verbatim recipe — copy structurally)
    - 03-RESEARCH.md lines 1259–1262 (Pitfall 11: forgotten `loading="eager"` on flagship → LCP regression — caller passes the override; component default is lazy)
    - 03-RESEARCH.md lines 1260–1263 (Pitfall 12: `<source>` order MUST be AVIF → WebP → JPG)
    - scripts/check-brand.ts lines 161-166 (importBoundaries — components MUST NOT contain `'/renders/'` or `'/construction/'` literal strings)
  </read_first>
  <behavior>
    - Test 1: file exports `ResponsivePicture` named function and `ResponsivePictureProps` type
    - Test 2: imports `assetUrl` from `'../../lib/assetUrl'` (relative path from `src/components/ui/`)
    - Test 3: file does NOT contain string literals `'/renders/'` or `'/construction/'` (passes `check-brand` `importBoundaries`)
    - Test 4: emits `<picture>` containing `<source type="image/avif">` FIRST, then `<source type="image/webp">`, then `<img>` fallback (D-21 + Pitfall 12 order)
    - Test 5: srcset uses `assetUrl(`${dir}/_opt/${base}-${w}.${fmt}`)` syntax for each format/width combo
    - Test 6: prop defaults: `widths = [640, 1280, 1920]`, `sizes = '100vw'`, `loading = 'lazy'`, no default for `fetchPriority`
    - Test 7: caller-overridable `loading: 'eager' | 'lazy'` and `fetchPriority?: 'high' | 'low' | 'auto'`
    - Test 8: filename strip regex `/\.(jpg|jpeg|png|webp)$/i` — same as optimizer (Test 9 of Task 2)
    - Test 9: explicit `width`/`height` attrs for CLS prevention; default height = `Math.round(largestWidth * 9 / 16)` (16:9 architectural CGI assumption)
    - Test 10: `decoding="async"` on `<img>` to avoid main-thread block
  </behavior>
  <action>
    CREATE file `src/components/ui/ResponsivePicture.tsx` with verbatim content (from 03-RESEARCH.md §C, lines 441–518):

    ```tsx
    /**
     * @module components/ui/ResponsivePicture
     *
     * Emits <picture><source type="image/avif"><source type="image/webp"><img></picture>
     * where each <source> has srcset pointing at sharp-generated _opt/ siblings
     * (per scripts/optimize-images.mjs).
     *
     * IMPORT BOUNDARY: Uses `assetUrl` from src/lib/assetUrl — NEVER hardcode
     * '/renders/' or '/construction/' literal strings. Phase 2 D-30 + check-brand
     * importBoundaries() block builds that violate this.
     *
     * Usage:
     *   - Hero/PortfolioOverview flagship (LCP target): pass loading="eager" +
     *     fetchPriority="high". Default lazy is wrong for the LCP image
     *     (Pitfall 11).
     *   - Pipeline grid cards: lazy + sizes="(min-width: 1280px) 400px, 100vw"
     *   - ConstructionTeaser: widths={[640, 960]} + sizes="320px"
     *
     * Source-format awareness: optimizer emits AVIF/WebP/JPG for ALL inputs
     * (jpg, png, webp). Component's regex strips the trailing format suffix —
     * 'aerial.jpg' → base 'aerial'; '43615.jpg.webp' → base '43615.jpg'.
     */

    import { assetUrl } from '../../lib/assetUrl';

    export interface ResponsivePictureProps {
      /** Path under public/, e.g. 'renders/lakeview/aerial.jpg' or
       *  'construction/mar-2026/mar-01.jpg'. NOT a URL — assetUrl() prepends BASE_URL. */
      src: string;
      alt: string;
      widths?: number[];
      sizes?: string;
      loading?: 'eager' | 'lazy';
      fetchPriority?: 'high' | 'low' | 'auto';
      className?: string;
      /** Optional explicit width/height for CLS prevention. Defaults to
       *  largest width × 9/16 (architectural CGI ~16:9). */
      width?: number;
      height?: number;
    }

    export function ResponsivePicture({
      src,
      alt,
      widths = [640, 1280, 1920],
      sizes = '100vw',
      loading = 'lazy',
      fetchPriority,
      className,
      width,
      height,
    }: ResponsivePictureProps) {
      const lastSlash = src.lastIndexOf('/');
      const dir = src.substring(0, lastSlash);
      const filename = src.substring(lastSlash + 1);
      const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

      const buildSrcset = (fmt: 'avif' | 'webp' | 'jpg') =>
        widths
          .map((w) => `${assetUrl(`${dir}/_opt/${base}-${w}.${fmt}`)} ${w}w`)
          .join(', ');

      const largestWidth = widths[widths.length - 1];
      const fallbackSrc = assetUrl(`${dir}/_opt/${base}-${largestWidth}.jpg`);

      const finalWidth = width ?? largestWidth;
      const finalHeight = height ?? Math.round(largestWidth * 9 / 16);

      return (
        <picture>
          <source type="image/avif" srcSet={buildSrcset('avif')} sizes={sizes} />
          <source type="image/webp" srcSet={buildSrcset('webp')} sizes={sizes} />
          <img
            src={fallbackSrc}
            srcSet={buildSrcset('jpg')}
            sizes={sizes}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            width={finalWidth}
            height={finalHeight}
            className={className}
            decoding="async"
          />
        </picture>
      );
    }
    ```

    Note on directory: `src/components/ui/` may not yet exist — create it as part of file creation.

    Critical: Test the importBoundaries invariant by running `tsx scripts/check-brand.ts` AFTER file creation. If `[check-brand] FAIL importBoundaries` appears with the «components must not contain raw /renders/ or /construction/ paths» rule triggering, audit the file — the only place those literals legitimately appear here is inside string-template substitutions where `dir` is already a variable (not a literal), so the check should pass.
  </action>
  <verify>
    <automated>test -f src/components/ui/ResponsivePicture.tsx &amp;&amp; grep -nE 'export function ResponsivePicture' src/components/ui/ResponsivePicture.tsx &amp;&amp; grep -nE 'type="image/avif"' src/components/ui/ResponsivePicture.tsx &amp;&amp; grep -nE 'type="image/webp"' src/components/ui/ResponsivePicture.tsx &amp;&amp; grep -nE "from '\.\./\.\./lib/assetUrl'" src/components/ui/ResponsivePicture.tsx &amp;&amp; ! grep -nE "'/renders/|'/construction/" src/components/ui/ResponsivePicture.tsx &amp;&amp; npm run lint &amp;&amp; tsx scripts/check-brand.ts</automated>
  </verify>
  <done>
    `src/components/ui/ResponsivePicture.tsx` exists, exports `ResponsivePicture` and `ResponsivePictureProps`. `<source>` order is AVIF → WebP → `<img>` fallback. Uses `assetUrl` from Phase 2; zero hardcoded `/renders/` or `/construction/` literals. `npm run lint` exits 0. `tsx scripts/check-brand.ts` PASS importBoundaries.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0 (TS clean)
2. `npm run build` exits 0 — full chain: prebuild (copy-renders + optimize-images) → tsc → vite build → postbuild check-brand. ALL 4 invariants PASS.
3. Spot-check optimized output sizes:
   - `ls -la public/renders/lakeview/_opt/aerial-1920.{avif,webp,jpg}` shows all 3 files exist
   - `aerial-1920.avif` ≤ 200KB (LCP budget)
4. `tsx scripts/check-brand.ts importBoundaries` PASS — ResponsivePicture.tsx contains no raw `/renders/` or `/construction/` string literals
5. Idempotency check: `npm run prebuild` second time runs in <5s (mtime skip path active)
</verification>

<success_criteria>
- [ ] `package.json` has `"sharp": "^0.34.5"` in devDependencies
- [ ] `package.json` `predev` and `prebuild` chain `tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs`
- [ ] `scripts/optimize-images.mjs` exists, ESM, sharp encoder with D-19 params (AVIF q50/effort4, WebP q75, JPG mozjpeg q80)
- [ ] `npm run prebuild` runs end-to-end and produces `public/renders/lakeview/_opt/aerial-1920.{avif,webp,jpg}` plus all other tree variants
- [ ] `aerial-1920.avif` size ≤ 200KB
- [ ] `src/components/ui/ResponsivePicture.tsx` exists, uses `assetUrl`, emits AVIF→WebP→JPG `<picture>` with explicit width/height
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0 (postbuild check-brand: 4/4 PASS)
- [ ] No raw `/renders/` or `/construction/` string literals in `src/components/`
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-03-SUMMARY.md` documenting:
- sharp@0.34.5 installed; predev/prebuild chained
- `scripts/optimize-images.mjs` shipped; first prebuild generated N optimized files (record actual count)
- `aerial-1920.avif` actual size (verify ≤200KB; if larger, raise as risk for Phase 6 Lighthouse work)
- Idempotency confirmed (second prebuild runs in <5s)
- `<ResponsivePicture>` ready for Wave 3 consumers (Hero, PortfolioOverview, ConstructionTeaser)
- check-brand `importBoundaries` PASS — Phase 2 D-30/D-33 invariant holds
</output>
