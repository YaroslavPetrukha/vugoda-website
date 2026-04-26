/**
 * scripts/check-brand.ts — CI brand-invariant guard
 *
 * Runs as `postbuild` npm hook AND as a dedicated GH Actions step (double
 * coverage per D-28). Exit code is aggregate: any check fails → exit 1,
 * blocking deploy (D-29, no warn-only).
 *
 * No npm deps — uses node:child_process.execSync shelling out to GNU/BSD
 * grep (the `|| true` suffix handles BSD vs GNU exit-code difference).
 *
 * 7 checks:
 *   1. denylistTerms()      — silent-displacement literals in dist/+src/
 *   2. paletteWhitelist()   — hex literals in src/ ⊆ 6-canonical brandbook palette
 *   3. placeholderTokens()  — {{...}}, TODO, FIXME in dist/ only (not src/)
 *   4. importBoundaries()   — D-32 + D-09 import/path-literal rules
 *   5. noInlineTransition() — Phase 5 SC#1 — no inline JSX-prop transition objects in src/
 *   6. bundleBudget()       — Phase 6 D-11 — eager JS bundle (dist/assets/index-*.js) ≤200KB gzipped
 *   7. heroBudget()         — Phase 6 D-12 + D-16 — public/renders/lakeview/_opt/aerial-1280.{avif,webp,jpg} each ≤200KB
 *
 * Scope: dist/+src/ for denylist (D-25), src/**\/*.{ts,tsx,css} for palette
 * (D-26), dist/ only for placeholders (D-27), src/ grep patterns for
 * boundaries (D-33), src/**\/*.{ts,tsx} for noInlineTransition (Phase 5
 * D-27), dist/assets/ for bundleBudget (Phase 6 D-11), public/renders/
 * lakeview/_opt/ for heroBudget (Phase 6 D-12 + D-16).
 * This script itself lives in scripts/ — intentionally OUT of scope for all
 * seven checks, so its regex constants can reference the disallowed literals
 * without self-triggering.
 *
 * Regex note (placeholderTokens): we match the FULL token pair
 * `\{\{[^}]*\}\}`, not bare `\{\{` or `\}\}`. Minified JS/CSS contains
 * unpaired `}}` from nested object-literal closings (hundreds of occurrences
 * per build). Matching only full pairs catches real Mustache-style
 * `{{token}}` leaks without false positives.
 *
 * Regex note (noInlineTransition): pattern is `transition=\{\{` — `=`
 * immediately followed by double-open-brace. Matches the JSX prop form
 * `transition={{ duration: ... }}`. Does NOT match `transition: {` (colon +
 * single brace) which is TypeScript object syntax in motionVariants.ts
 * Variants declarations — those are SOT-managed and correct.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

/** Run a grep command that MAY fail (no matches). `|| true` normalises exit. */
function run(cmd: string): string {
  try {
    return execSync(cmd + ' || true', { encoding: 'utf8' });
  } catch (e) {
    // execSync throws only if the shell itself blows up; grep's exit-1-on-no-match
    // is neutralised by `|| true`. If we got here, something else is wrong.
    return `[check-brand] execSync error: ${(e as Error).message}`;
  }
}

// ---- 1. Denylist terms (D-25, PITFALLS §10) ------------------------------
// Silent-displacement hard-rule: legacy source projects must never appear
// by name in shipped code or inline comments. Case-insensitive, scanned
// in both dist/ (shipped) and src/ (authoritative).
function denylistTerms(): boolean {
  const scopes: string[] = [];
  if (existsSync('dist')) scopes.push('dist/');
  if (existsSync('src')) scopes.push('src/');
  if (scopes.length === 0) {
    console.log('[check-brand] PASS denylistTerms (no scope to scan)');
    return true;
  }
  const out = run(
    `grep -rniE --include='*.html' --include='*.js' --include='*.css' ` +
      `--include='*.ts' --include='*.tsx' --include='*.json' ` +
      `'Pictorial|Rubikon|Пикторіал|Рубікон' ${scopes.join(' ')}`,
  );
  if (out.trim()) {
    console.error(`[check-brand] FAIL denylistTerms — silent-displacement leak:\n${out}`);
    return false;
  }
  console.log('[check-brand] PASS denylistTerms');
  return true;
}

// ---- 2. Palette whitelist (D-26, PITFALLS §1) ----------------------------
// Must match @theme in src/index.css — update BOTH if palette ever changes.
const PALETTE_WHITELIST = [
  '#2F3640',
  '#C1F33D',
  '#F5F7FA',
  '#A7AFBC',
  '#3D3B43',
  '#020A0A',
];

function paletteWhitelist(): boolean {
  if (!existsSync('src')) {
    console.log('[check-brand] PASS paletteWhitelist (no src/)');
    return true;
  }
  // -Eoh extracts each hex occurrence; -n would give line numbers which we
  // want for violations — we do a second pass with -n if any unknowns found.
  const allHexes = run(
    `grep -rEoh '#[0-9A-Fa-f]{3,6}' src/ --include='*.ts' --include='*.tsx' --include='*.css'`,
  )
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedLower = PALETTE_WHITELIST.map((h) => h.toLowerCase());
  const violations = allHexes.filter(
    (h) => !allowedLower.includes(h.toLowerCase()),
  );

  if (violations.length) {
    const unique = [...new Set(violations)];
    // Second pass — find WHERE the violations live so the dev can fix them.
    const pattern = unique.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const locs = run(
      `grep -rnE '${pattern}' src/ --include='*.ts' --include='*.tsx' --include='*.css'`,
    );
    console.error(
      `[check-brand] FAIL paletteWhitelist — non-canonical hex values:`,
      unique,
      `\nLocations:\n${locs}`,
    );
    return false;
  }
  console.log('[check-brand] PASS paletteWhitelist');
  return true;
}

// ---- 3. Placeholder tokens (D-27) ----------------------------------------
// dist/ only. src/ excluded so dev TODO comments stay legal.
//
// Pattern `\{\{[^}]*\}\}` matches full Mustache-style tokens with content
// between the braces. Bare `\{\{` or `\}\}` would false-positive on minified
// JS/CSS (318 `}}` in a typical Vite bundle from closed object literals).
function placeholderTokens(): boolean {
  if (!existsSync('dist')) {
    console.log('[check-brand] PASS placeholderTokens (no dist/ — skipping)');
    return true;
  }
  const out = run(
    `grep -rnE '\\{\\{[^}]*\\}\\}|TODO|FIXME' dist/ ` +
      `--include='*.html' --include='*.js' --include='*.css'`,
  );
  if (out.trim()) {
    console.error(`[check-brand] FAIL placeholderTokens — leaked placeholders in dist/:\n${out}`);
    return false;
  }
  console.log('[check-brand] PASS placeholderTokens');
  return true;
}

// ---- 4. Import boundaries (D-32, D-33, D-09) -----------------------------
function importBoundaries(): boolean {
  let pass = true;
  const checks: Array<{ label: string; cmd: string }> = [
    {
      label: 'components must not import pages',
      cmd:
        `grep -rnE "from ['\\\"].*pages/" src/components/ ` +
        `--include='*.ts' --include='*.tsx'`,
    },
    {
      label: 'data must not import react/motion/components/hooks',
      cmd:
        `grep -rnE "from ['\\\"]react['\\\"]|from ['\\\"]motion|from ['\\\"].*components|from ['\\\"].*hooks" ` +
        `src/data/ --include='*.ts'`,
    },
    {
      label: 'content must not import react/motion/components/hooks/pages',
      cmd:
        `grep -rnE "from ['\\\"]react['\\\"]|from ['\\\"]motion|from ['\\\"].*components|from ['\\\"].*hooks|from ['\\\"].*pages" ` +
        `src/content/ --include='*.ts'`,
    },
    {
      label: 'components must not contain raw /renders/ or /construction/ paths',
      cmd:
        `grep -rnE "'/renders/|'/construction/|\\\"/renders/|\\\"/construction/" ` +
        `src/components/ --include='*.ts' --include='*.tsx'`,
    },
    {
      // Rule 4 exclusion (Phase 4 plan 04-04, RESEARCH Open Question 1):
      // src/pages/DevGridPage.tsx is THE hidden QA surface for the
      // /dev/grid route (D-39..D-42 + ZHK-02 scale-to-N stress test). It is
      // expected and required to import fixtures — that is the explicit
      // boundary exception per src/data/projects.fixtures.ts module rule.
      // The fixtures-import ban applies to ALL OTHER pages/components.
      label: 'pages and components must not import projects.fixtures (DevGridPage exempt)',
      cmd:
        `grep -rnE 'projects\\.fixtures' src/pages/ src/components/ ` +
        `--include='*.ts' --include='*.tsx' | grep -v 'DevGridPage'`,
    },
  ];

  for (const { label, cmd } of checks) {
    const out = run(cmd);
    if (out.trim()) {
      console.error(`[check-brand] FAIL importBoundaries (${label}):\n${out}`);
      pass = false;
    }
  }
  if (pass) console.log('[check-brand] PASS importBoundaries');
  return pass;
}

// ---- 5. No inline JSX-prop transition objects (Phase 5 D-27, SC#1) ------
// Phase 5 owns easing config: all motion timing comes from src/lib/
// motionVariants.ts SOT (variants carry transition; consumers use
// variants={...} or whileInView/initial/animate/exit prop names — never
// an inline `transition={{ duration: ... }}` JSX prop).
//
// Pattern `transition=\{\{` requires `=` directly followed by double
// open-brace — matches JSX prop form, NOT TypeScript object syntax
// `transition: {` inside Variants declarations. Scope: src/ everywhere
// including src/lib/ — Variants type literals use `transition: {` (colon)
// which the regex does not match.
function noInlineTransition(): boolean {
  if (!existsSync('src')) {
    console.log('[check-brand] PASS noInlineTransition (no src/)');
    return true;
  }
  const out = run(
    `grep -rnE "transition=\\{\\{" src/ ` +
      `--include='*.ts' --include='*.tsx'`,
  );
  if (out.trim()) {
    console.error(
      `[check-brand] FAIL noInlineTransition — inline Motion transition objects (use variants from src/lib/motionVariants.ts):\n${out}`,
    );
    return false;
  }
  console.log('[check-brand] PASS noInlineTransition');
  return true;
}

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

// ---- Aggregate -----------------------------------------------------------
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
