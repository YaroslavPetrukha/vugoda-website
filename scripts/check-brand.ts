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
 * 4 checks:
 *   1. denylistTerms()    — silent-displacement literals in dist/+src/
 *   2. paletteWhitelist() — hex literals in src/ ⊆ 6-canonical brandbook palette
 *   3. placeholderTokens()— {{...}}, TODO, FIXME in dist/ only (not src/)
 *   4. importBoundaries() — D-32 + D-09 import/path-literal rules
 *
 * Scope: dist/+src/ for denylist (D-25), src/**\/*.{ts,tsx,css} for palette
 * (D-26), dist/ only for placeholders (D-27), src/ grep patterns for
 * boundaries (D-33). This script itself lives in scripts/ — intentionally
 * OUT of scope for all four checks, so its regex constants can reference
 * the disallowed literals without self-triggering.
 *
 * Regex note (placeholderTokens): we match the FULL token pair
 * `\{\{[^}]*\}\}`, not bare `\{\{` or `\}\}`. Minified JS/CSS contains
 * unpaired `}}` from nested object-literal closings (hundreds of occurrences
 * per build). Matching only full pairs catches real Mustache-style
 * `{{token}}` leaks without false positives.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

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
      label: 'pages and components must not import projects.fixtures',
      cmd:
        `grep -rnE 'projects\\.fixtures' src/pages/ src/components/ ` +
        `--include='*.ts' --include='*.tsx'`,
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

// ---- Aggregate -----------------------------------------------------------
const results = [
  denylistTerms(),
  paletteWhitelist(),
  placeholderTokens(),
  importBoundaries(),
];
const passed = results.filter(Boolean).length;
console.log(`[check-brand] ${passed}/${results.length} checks passed`);
if (results.some((r) => !r)) process.exit(1);
