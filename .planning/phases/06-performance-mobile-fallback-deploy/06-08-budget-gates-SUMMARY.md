---
phase: 06-performance-mobile-fallback-deploy
plan: 08
subsystem: infra
tags: [budget-gate, ci-invariant, hero-budget, bundle-budget, sharp, avif, webp, jpeg, gzip, lcp, qa-02]

requires:
  - phase: 06-performance-mobile-fallback-deploy
    provides:
      - "06-04: mobile fallback gate (eliminated tablet/mobile bundle weight from LCP path)"
      - "06-05: lazy-routes-suspense (App.tsx React.lazy() split — eager bundle shrunk so bundleBudget gate passes comfortably)"
      - "06-06: meta-and-og-image (no bundle impact; OG/Twitter shipped, hero preload limited to [640w,1280w])"
      - "06-07: page-titles (per-page document.title via usePageTitle hook; no bundle impact)"
      - "Phase 3: scripts/optimize-images.mjs FORMATS array (idempotent mtime-based skip, AVIF/WebP/JPEG triple at 3 widths)"
      - "Phase 2: scripts/check-brand.ts 5-check pattern (denylist, palette, placeholders, importBoundaries, noInlineTransition)"

provides:
  - "scripts/optimize-images.mjs — width-aware FORMATS encoders (s, w) with per-bucket quality tuning for 1280w LCP target"
  - "scripts/check-brand.ts ships 7 CI checks (5 inherited + bundleBudget + heroBudget)"
  - "Permanent CI invariant: any future plan that bloats eager JS bundle past 200KB gzipped OR re-shoots the hero with a >200KB 1280w variant will fail npm run build automatically"
  - "QA-02 byte budgets locked: bundle 133.7 KB gzipped (67% of limit), hero-1280 all 3 formats ≤200KB"

affects: [06-09-lhci-and-handoff, qa-handoff, lighthouse-performance, lcp-target]

tech-stack:
  added:
    - "node:zlib (already in Node stdlib — used for in-process gzip sizing)"
    - "node:path (already in Node stdlib — used for join in dist/assets path resolution)"
  patterns:
    - "Width-aware sharp encoder closure: (s, w) => s.{format}({ quality: w === 1280 ? <low> : <default>, ... }) — per-bucket quality without per-asset map"
    - "In-process gzip sizing via gzipSync(buf).length — no subprocess overhead, portable across Linux/macOS GitHub Actions runners"
    - "scripts/check-brand.ts skip-when-no-dist behavior: bundleBudget returns true (logs SKIP) so dev runs from clean checkout don't fail; postbuild always has dist/"
    - "Verbatim hardcoded HERO_BUCKETS constant (3 paths) — gates only the LCP target (1280w); 1920w retina-only fallback documented as carve-out (D-15..D-16)"

key-files:
  created: []
  modified:
    - "scripts/optimize-images.mjs"
    - "scripts/check-brand.ts"

key-decisions:
  - "Per-bucket quality applied to ALL 3 formats (AVIF + WebP + JPG), not just AVIF as plan literal specified — heroBudget surfaced that WebP@q75 = 247KB and JPG@q80 = 265KB at 1280w both overshoot 200KB gate (Rule 1 deviation, scope-bounded to 1280w bucket)"
  - "Final 1280w qualities: AVIF=45, WebP=58, JPG=70 — empirically tuned against aerial.jpg source until all 3 fit ≤200KB"
  - "1920w retina-only variants left untouched (q=50/75/80) per D-15 carve-out — preload never points at 1920w (Phase 6 plan 06-06 D-13 fix), <picture> handles DPR=2 selection on its own"
  - "Construction-log 1280w files also re-encoded with the new lower-quality settings — deliberate per D-14 «slightly more aggressive global quality that affects all renders (acceptable; 1280w is already a fallback-not-LCP for non-hero renders)»"
  - "bundleBudget grep target `index-*.js` assumes Vite default chunk naming — if a future plan customizes entryFileNames in vite.config.ts, the gate FAILs with `no entry chunk found` (descriptive error surfaces misconfiguration rather than silently passing)"

patterns-established:
  - "Pattern: width-aware encoder closures with per-bucket ternary quality — extensible to per-asset map if needed in v2 (currently overkill for single LCP target)"
  - "Pattern: byte-budget CI gates fold into existing 5-check check-brand.ts aggregate without changing exit-code semantics (any FAIL → process.exit(1) → block deploy)"
  - "Pattern: separate BUDGET_BYTES constants per gate (BUNDLE_BUDGET_BYTES, HERO_BUDGET_BYTES) — both at 200*1024 today, but decoupled so future tuning of one does not silently shift the other"

requirements-completed: [QA-02]

duration: 25min
completed: 2026-04-26
---

# Phase 06 Plan 08: Budget Gates Summary

**Wired the QA-02 byte-budget enforcement: scripts/optimize-images.mjs FORMATS now accepts width-aware encoder closures with per-bucket quality (1280w LCP target gets aggressive q values), and scripts/check-brand.ts gains 6th check `bundleBudget()` (eager dist/assets/index-*.js ≤200KB gzipped) and 7th check `heroBudget()` (aerial-1280.{avif,webp,jpg} each ≤200KB) as permanent CI invariants.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-26T20:11:13Z
- **Completed:** 2026-04-26T20:36:47Z
- **Tasks:** 2 / 2
- **Files modified:** 2 (0 created, 2 edited)

## Accomplishments

- **Per-bucket AVIF quality (D-14):** `scripts/optimize-images.mjs` FORMATS AVIF encoder now takes `(s, w)` instead of `(s)`, applying `quality: w === 1280 ? 45 : 50`. Re-encoded `aerial-1280.avif` from 200,706 bytes → 169,213 bytes (165.2 KB) — fits the 200KB heroBudget gate. 1920w retina variant unchanged at 388,547 bytes (q=50, not gated per D-15..D-16).
- **WebP/JPG retune (Rule 1 deviation):** heroBudget surfaced that AVIF alone wasn't enough — WebP@q75 was 247,380 bytes and JPG@q80 was 265,401 bytes at 1280w, both overshooting. Extended the same `(s, w)` width-aware pattern to WebP (q=58 for 1280w, was 75) and JPG (q=70 for 1280w, was 80). All 3 hero formats now fit ≤200KB at 1280w. 1920w retina-only fallback paths kept untouched (q=75/80 — visual fidelity preserved per D-15).
- **bundleBudget() (D-11):** new 6th check in `scripts/check-brand.ts`. Reads `dist/assets/index-*.js`, gzips in-process via `node:zlib gzipSync`, asserts ≤ `200 * 1024` bytes. PASS log includes percent-of-limit. Skips gracefully if `dist/` doesn't exist (clean-checkout dev safety). Vite default `entryFileNames: 'assets/[name]-[hash].js'` produces `index-{hash}.js` — `.find()` predicate keyed on `startsWith('index-')`.
- **heroBudget() (D-12 + D-16):** new 7th check. Reads `public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg}` (3 hardcoded paths in HERO_BUCKETS), asserts each ≤200KB. FAILs with violating path + size; PASS logs «all hero variants ≤200KB». 1920w retina paths NOT in the gate per D-15..D-16.
- **JSDoc + imports updated:** top doc-block now lists 7 checks with descriptions; scope paragraph extended to mention dist/assets and public/renders/lakeview/_opt; the «5 checks» → «7 checks» language updated. New imports: `readFileSync`/`readdirSync` extended onto existing `node:fs` import; `gzipSync` from `node:zlib` (new); `join` from `node:path` (new).
- **Results aggregate extended:** `const results = [...5 inherited..., bundleBudget(), heroBudget()]` — same exit-code semantics (`process.exit(1)` if any FAIL).

## Task Commits

Each task was committed atomically:

- **Task 1** [`903a0d9`] `refactor(06-08): per-bucket AVIF quality (1280w → q=45) for hero LCP target` — 1 file (scripts/optimize-images.mjs), +7/-2 lines
- **Task 2** [`97d89a7`] `feat(06-08): add bundleBudget + heroBudget gates (7/7 check-brand)` — 2 files (scripts/check-brand.ts +95 lines for the 2 new check functions, scripts/optimize-images.mjs Rule 1 retune of WebP/JPG to make heroBudget pass)

## Pre/Post Sizes

| Asset | Pre-Phase-6-08 | Post-Phase-6-08 | Limit | Status |
|-------|----------------|-----------------|-------|--------|
| `dist/assets/index-{hash}.js` (gzipped) | (raw 441 KB → unchanged) | 133.7 KB gzipped | 200 KB | PASS (67% of limit) |
| `public/renders/lakeview/_opt/aerial-1280.avif` | 200,706 B (200.7 KB) | 169,213 B (165.2 KB) | 204,800 B (200 KB) | PASS |
| `public/renders/lakeview/_opt/aerial-1280.webp` | 247,380 B (247.4 KB) | 202,248 B (197.5 KB) | 204,800 B (200 KB) | PASS |
| `public/renders/lakeview/_opt/aerial-1280.jpg`  | 265,401 B (265.4 KB) | 201,017 B (196.3 KB) | 204,800 B (200 KB) | PASS |
| `public/renders/lakeview/_opt/aerial-1920.avif` (retina, NOT gated) | 388,547 B | 388,547 B | — | unchanged (D-15 carve-out) |
| `public/renders/lakeview/_opt/aerial-1920.webp` (retina, NOT gated) | 500,134 B | 500,134 B | — | unchanged (D-15 carve-out) |
| `public/renders/lakeview/_opt/aerial-1920.jpg`  (retina, NOT gated) | 552,301 B | 552,301 B | — | unchanged (D-15 carve-out) |

The bundle (133.7 KB gzipped) is comfortable under the 200 KB ceiling — Wave 2 plan 06-05 React.lazy() split removed `ConstructionLogPage`, `DevGridPage`, `DevBrandPage` from the eager chunk (3 separate small chunks now load on demand: 0.79 KB / 1.17 KB / 1.41 KB gzipped).

## Construction-Log Side-Effect (acknowledged)

All construction-log AVIF/WebP/JPG files at the 1280w bucket also went through the new lower-quality encoders (q=45/58/70 vs q=50/75/80 before). Per D-14, this is acceptable: «slightly more aggressive global quality that affects all renders (acceptable; 1280w is already a fallback-not-LCP for non-hero renders)». Visual sanity check on construction-log 1280w outputs at impl time — no banding/posterization regression detected.

## Verbatim Final Forms

### `scripts/optimize-images.mjs` — FORMATS array (after Task 1 + Rule 1 deviation)

```js
const FORMATS = [
  // Phase 6 D-14: 1280w is the DPR=1 LCP target on Lighthouse Desktop —
  // must land ≤200KB across ALL hero variants gated by heroBudget()
  // (avif/webp/jpg). Other widths (640w, 1920w) keep their default quality
  // — the 1920w retina variant is documented as not on the LCP path
  // (D-15 carve-out + heroBudget() in scripts/check-brand.ts gates only
  // aerial-1280.{avif,webp,jpg} per D-16).
  //
  // Per-bucket retune for 1280w (deviation Rule 1 during plan 06-08 exec —
  // empirically tuned against aerial.jpg source so all 3 formats land ≤200KB):
  // - AVIF q=45 (was 50) → ~169KB
  // - WebP q=58 (was 75) → ~190-200KB (heavy aerial render needs aggressive)
  // - JPG  q=70 (was 80) → ~175-200KB (mozjpeg)
  { ext: 'avif', encoder: (s, w) => s.avif({ quality: w === 1280 ? 45 : 50, effort: 4 }) },
  { ext: 'webp', encoder: (s, w) => s.webp({ quality: w === 1280 ? 58 : 75 }) },
  { ext: 'jpg',  encoder: (s, w) => s.jpeg({ quality: w === 1280 ? 70 : 80, mozjpeg: true }) },
];
```

The downstream `optimizeFile()` call site updated to `await encoder(pipeline, w).toFile(outPath);` — passes `w` to all 3 encoders (each uses it).

### `scripts/check-brand.ts` — bundleBudget() + heroBudget() (after Task 2)

```ts
// ---- 6. Bundle budget (Phase 6 D-11) -----------------------------------
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

## Verification

- `npm run build` exits 0
- Final `[check-brand]` line: `7/7 checks passed`
- All 7 individual PASS lines printed:
  - `PASS denylistTerms`
  - `PASS paletteWhitelist`
  - `PASS placeholderTokens`
  - `PASS importBoundaries`
  - `PASS noInlineTransition`
  - `PASS bundleBudget — 133.7 KB gzipped (67% of 200 KB limit)`
  - `PASS heroBudget — all hero variants ≤200KB`
- `npx tsc --noEmit` exits 0
- `git status` shows only the 2 expected file edits (modified images regenerate as untracked because public/renders/ + public/construction/ are gitignored — generated artifacts)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan retuned only AVIF quality at 1280w but heroBudget() gates all 3 formats**
- **Found during:** Task 2 (npm run build verification)
- **Issue:** After Task 1 brought aerial-1280.avif to 169 KB, the new heroBudget() check correctly FAILed because aerial-1280.webp (247 KB) and aerial-1280.jpg (265 KB) were both still over the 200 KB limit. The plan's must_haves listed `quality: w === 1280 ? 45 : 50` only for AVIF and stated «After re-running npm run build, aerial-1280.avif shrinks from 200,706 bytes to ≤200KB; heroBudget() PASS» — implicitly assuming the WebP/JPG variants were already under 200KB (they weren't).
- **Fix:** Extended the same `(s, w)` width-aware pattern to the WebP and JPG encoders. WebP gets q=58 for 1280w (was 75); JPG gets q=70 for 1280w (was 80). 1920w retina paths kept at default q=75/80 per D-15 carve-out.
- **Files modified:** scripts/optimize-images.mjs (additional ~3 lines)
- **Commit:** included in 97d89a7 (Task 2 commit, since the retune was discovered during Task 2 verification)

## Permanent CI Invariants Established

`bundleBudget()` and `heroBudget()` are now permanent CI invariants. Any future plan that:

- Bloats the eager JS bundle past 200 KB gzipped (e.g., adds a heavy library to `App.tsx` or pulls a lazy chunk back into the eager path) → `npm run build` FAILs with the violating size + limit
- Re-shoots the hero with a >200 KB 1280w variant (e.g., new aerial.jpg source that re-encodes too large at the current quality settings) → `npm run build` FAILs with the violating path + size

Both failures block deploy via `process.exit(1)`. No warn-only mode (D-29 inheritance from Phase 2).

## Risks Acknowledged

- **Vite chunk-naming assumption:** `bundleBudget()` greps for `index-*.js` (Vite default `entryFileNames: 'assets/[name]-[hash].js'`). If a future plan customizes `entryFileNames` in `vite.config.ts`, the gate currently FAILs with `no entry chunk found` (correct behavior — surfaces misconfiguration rather than hiding it). If Vite changes the default in v8+, update the `.find()` predicate.
- **Static HERO_BUCKETS list:** if Phase 4/5 ever changes the hero asset slug (e.g., not `aerial-1280` anymore), `heroBudget()` will FAIL with `missing` errors — gate becomes a tripwire that flags the asset rename. Update HERO_BUCKETS at the same PR.

## Self-Check: PASSED

Verified post-write:

- `scripts/optimize-images.mjs`: FOUND, contains `w === 1280 ? 45 : 50` (1×), `w === 1280 ? 58 : 75` (1×), `w === 1280 ? 70 : 80` (1×), `encoder(pipeline, w)` (1×)
- `scripts/check-brand.ts`: FOUND, contains `function bundleBudget(): boolean` (1×), `function heroBudget(): boolean` (1×), `bundleBudget(),` in results (1×), `heroBudget(),` in results (1×), `7 checks:` (1×)
- Commit `903a0d9`: FOUND in `git log` (Task 1 — `refactor(06-08): per-bucket AVIF quality (1280w → q=45) for hero LCP target`)
- Commit `97d89a7`: FOUND in `git log` (Task 2 — `feat(06-08): add bundleBudget + heroBudget gates (7/7 check-brand)`)
- `npm run build` final line: `[check-brand] 7/7 checks passed` (verified live)
