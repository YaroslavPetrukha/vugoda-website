---
phase: 02-data-layer-content
plan: 05
type: execute
wave: 3
depends_on: [02-02, 02-03, 02-04]
files_modified:
  - scripts/check-brand.ts
  - package.json
  - .github/workflows/deploy.yml
autonomous: true
requirements_addressed:
  - QA-04
must_haves:
  truths:
    - "`scripts/check-brand.ts` runs 4 check functions: denylistTerms (Pictorial|Rubikon|Пикторіал|Рубікон in dist/+src/), paletteWhitelist (hex in src/ ⊆ 6 canonicals), placeholderTokens ({{, }}, TODO, FIXME in dist/ only), importBoundaries (D-32 rules)"
    - "Exit code is aggregate: any check fails → process.exit(1); all pass → exit 0 with summary «N/4 checks passed»"
    - "`npm run build` now chains `prebuild` → `tsc --noEmit && vite build` → `postbuild` (check-brand); any failure blocks the build"
    - "`.github/workflows/deploy.yml` runs a named `check-brand` step between `npm run build` and `actions/upload-pages-artifact@v3` — PR logs show per-check summary in a collapsible step"
    - "Running `npm run build` against current src/ + dist/ exits 0 (check-brand passes clean — Plans 02-02/03/04 produced compliant code)"
    - "The 4 boundary rules from D-32 all pass currently: components don't import pages, data/ has no react/motion imports, content/ follows same rule, components/ have no raw /renders/ or /construction/ path literals, and neither pages/ nor components/ import projects.fixtures.ts"
  artifacts:
    - path: "scripts/check-brand.ts"
      provides: "denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries check functions"
      contains: "function denylistTerms"
      min_lines: 80
    - path: "package.json"
      provides: "postbuild: tsx scripts/check-brand.ts"
      contains: "\"postbuild\": \"tsx scripts/check-brand.ts\""
    - path: ".github/workflows/deploy.yml"
      provides: "Check brand invariants step before upload-pages-artifact"
      contains: "name: Check brand invariants"
  key_links:
    - from: "scripts/check-brand.ts"
      to: "dist/ + src/ (grep scan scope)"
      via: "execSync grep with per-check argument"
      pattern: "execSync"
    - from: "package.json"
      to: "scripts/check-brand.ts"
      via: "postbuild hook"
      pattern: "postbuild.*check-brand"
    - from: ".github/workflows/deploy.yml"
      to: "scripts/check-brand.ts"
      via: "named GH Actions step before upload-pages-artifact"
      pattern: "npx tsx scripts/check-brand"
---

<objective>
Close Phase 2 with the CI brand-invariant script — `scripts/check-brand.ts` — and wire it into both `npm run build` (via postbuild) and `.github/workflows/deploy.yml` (as a named step before artifact upload). Four checks ship: denylist (Pictorial/Rubikon), palette whitelist (src/ hex ⊆ 6 canonicals), placeholder tokens (no `{{` / TODO in dist/), import boundaries (D-32 grep rules).

Purpose: QA-04 entire requirement. Catches every brand-policy regression at the build step — silent displacement leaks, palette drift, shipped `{{token}}`, and boundary violations all fail the deploy instead of reaching the client URL.
Output: 1 new script + package.json postbuild hook + 1 inserted deploy.yml step; full `npm run build` passes with all 4 checks green on current code.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-data-layer-content/02-CONTEXT.md
@.planning/phases/02-data-layer-content/02-RESEARCH.md
@.planning/phases/02-data-layer-content/02-01-SUMMARY.md
@.planning/phases/02-data-layer-content/02-02-SUMMARY.md
@.planning/phases/02-data-layer-content/02-03-SUMMARY.md
@.planning/phases/02-data-layer-content/02-04-SUMMARY.md
@package.json
@.github/workflows/deploy.yml
@src/index.css
</context>

<interfaces>
<!-- No new TS types introduced. This plan only ships a Node script and wiring. -->

Denylist terms (D-25) — case-insensitive, scanned in dist/ + src/:
- `Pictorial` · `Rubikon` · `Пикторіал` · `Рубікон`

Palette whitelist (D-26) — case-insensitive, scanned in src/**/*.{ts,tsx,css}:
```typescript
const PALETTE_WHITELIST = [
  '#2F3640', '#C1F33D', '#F5F7FA', '#A7AFBC', '#3D3B43', '#020A0A',
];
```
(Must match `@theme` in src/index.css exactly — drift in one = check fails.)

Placeholder tokens (D-27) — scanned in dist/ ONLY (src/ excluded so dev TODO comments are legitimate):
- `{{` · `}}` · `TODO` · `FIXME`

Import boundaries (D-32, D-33) — 5 grep rules:
1. src/components/ must NOT import from src/pages/
2. src/data/ must NOT import React, motion, components, hooks
3. src/content/ must NOT import React, motion, components, hooks, pages
4. src/components/ must NOT contain raw `/renders/` or `/construction/` path literals (forces `renderUrl` / `constructionUrl` use)
5. src/pages/ and src/components/ must NOT import projects.fixtures (fixtures are /dev/grid only)

Grep approach (RESEARCH §"Shell-out vs pure-JS"): `execSync('grep -rn ... || true', { encoding: 'utf8' })` — Approach B (|| true + output.trim() check) per RESEARCH §"Exit code pattern".

Script exit semantics (D-29): aggregate. `denylistTerms() && paletteWhitelist() && placeholderTokens() && importBoundaries()` — if any returns false, `process.exit(1)`. Otherwise exit 0.

<!-- deploy.yml insertion point (RESEARCH §"deploy.yml: check-brand Step Insertion") -->

Current deploy.yml build job steps (Phase 1 baseline):
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm
  - run: npm ci
  - run: npm run build
  - uses: actions/upload-pages-artifact@v3
    with:
      path: dist
```

Insert ONE step between `npm run build` and `actions/upload-pages-artifact@v3`:
```yaml
  - name: Check brand invariants
    run: npx tsx scripts/check-brand.ts
```

Double-run behavior (RESEARCH §"Double-run behavior"): check-brand runs TWICE on CI — once via `postbuild` inside `npm run build`, once as the named step. This is overlapping safety nets per D-28. The named step is for log visibility (PR-collapsible summary); postbuild is the gate.
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create scripts/check-brand.ts (4 check functions + aggregate exit)</name>
  <files>scripts/check-brand.ts</files>
  <read_first>
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"CI Denylist Implementation" (shell-out pattern, grep incantations for each check)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Code Examples → check-brand.ts structure" (reference skeleton — adapt, don't paste verbatim; RESEARCH has a slightly leaky TODO in placeholderTokens that should be split)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"Import Boundary Grep Patterns" (6 concrete grep commands)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-24 through D-29, D-32, D-33
    - src/index.css (verify @theme palette still has only 6 canonical hexes — paletteWhitelist must match)
    - scripts/copy-renders.ts (confirm `scripts/` folder exists from Plan 02-03)
  </read_first>
  <behavior>
    - File runs via `npx tsx scripts/check-brand.ts` and exits 0 when no violations, exit 1 on any violation
    - denylistTerms() scans dist/ + src/ for Pictorial|Rubikon|Пикторіал|Рубікон (case-insensitive); logs PASS or FAIL with filename:line output
    - paletteWhitelist() extracts all hex literals (`#[0-9A-Fa-f]{3,6}`) from src/**/*.{ts,tsx,css} and fails if any are NOT in the 6-canonical whitelist (case-insensitive)
    - placeholderTokens() scans dist/ for `{{`, `}}`, `TODO`, `FIXME`; fails on any match. src/ excluded.
    - importBoundaries() runs 5 grep rules (D-32 + fixtures); fails on any non-empty output
    - All 4 functions print `[check-brand] PASS <name>` on success and `[check-brand] FAIL <name>:\n<offending lines>` on failure
    - Script prints final summary `[check-brand] N/4 checks passed`
    - When run AFTER the current Phase 2 state (Plans 02-02/03/04 complete), all 4 checks PASS
    - No npm deps; uses only `node:child_process` execSync
    - The script is tolerant to dist/ being absent (gracefully passes denylist/placeholder checks when dist/ is empty — not silently; logs that dist/ was scanned empty)
  </behavior>
  <action>
Create `scripts/check-brand.ts` with this EXACT content:

```typescript
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
 *   1. denylistTerms()    — Pictorial|Rubikon|Пикторіал|Рубікон in dist/+src/
 *   2. paletteWhitelist() — hex literals in src/ ⊆ 6-canonical brandbook palette
 *   3. placeholderTokens()— {{, }}, TODO, FIXME in dist/ only (not src/)
 *   4. importBoundaries() — D-32 + D-09 import/path-literal rules
 *
 * Scope matches CONTEXT.md decisions D-25 (dist/+src/), D-26 (src/**/*.{ts,tsx,css}),
 * D-27 (dist/ only for TODO), D-33 (boundary check as 4th function).
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
function placeholderTokens(): boolean {
  if (!existsSync('dist')) {
    console.log('[check-brand] PASS placeholderTokens (no dist/ — skipping)');
    return true;
  }
  const out = run(
    `grep -rnE '\\{\\{|\\}\\}|TODO|FIXME' dist/ ` +
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
```

Do NOT:
- Add new checks not in D-24..D-33 — scope is locked.
- Use ESLint (rejected per STACK.md — boundary enforcement is grep-only).
- Use `find` instead of `grep -r` — grep's `--include` is simpler and same result.
- Skip the `existsSync` guards — `postbuild` runs after `vite build`, but if a dev runs the script manually before first build there's no dist/. Graceful pass-when-absent beats a crash.
- Change `||true` to throwing-on-exit-1 — BSD grep on macOS has subtly different exit codes; the trim-output pattern is platform-portable.
  </action>
  <acceptance_criteria>
    - `test -f scripts/check-brand.ts` passes
    - `grep -c "function denylistTerms" scripts/check-brand.ts` returns `1`
    - `grep -c "function paletteWhitelist" scripts/check-brand.ts` returns `1`
    - `grep -c "function placeholderTokens" scripts/check-brand.ts` returns `1`
    - `grep -c "function importBoundaries" scripts/check-brand.ts` returns `1`
    - `grep -c "process.exit(1)" scripts/check-brand.ts` returns `1` (aggregate fail path)
    - `grep -cE "'#2F3640'|'#C1F33D'|'#F5F7FA'|'#A7AFBC'|'#3D3B43'|'#020A0A'" scripts/check-brand.ts` returns `6` (whitelist has all 6 canonical hexes)
    - `grep -c "Pictorial|Rubikon|Пикторіал|Рубікон" scripts/check-brand.ts` returns `1` (denylist regex)
    - `grep -c "projects\\.fixtures" scripts/check-brand.ts` returns `1` (D-09 check covered)
    - `grep -cE "import .* from 'node:" scripts/check-brand.ts` returns `2` (child_process + fs — only node: imports)
    - `grep -cE "^import .* from '[^n]" scripts/check-brand.ts` returns `0` (no npm imports)
    - Running `npx tsx scripts/check-brand.ts` against CURRENT state (post Plans 02-02/03/04) exits 0 — all 4 checks PASS
    - Output contains `[check-brand] 4/4 checks passed` on stdout
    - Output contains `[check-brand] PASS denylistTerms`
    - Output contains `[check-brand] PASS paletteWhitelist`
    - Output contains `[check-brand] PASS importBoundaries`
    - Output contains `[check-brand] PASS placeholderTokens` (with either «no dist/ — skipping» or real scan — depends on whether dist/ was built recently)
    - Regression test (forge a violation): creating a throwaway file `src/tmp-violation.ts` with content `const x = '#ABCDEF';` → running `npx tsx scripts/check-brand.ts` exits 1 AND output contains `paletteWhitelist` + `#ABCDEF`. Then delete the throwaway file; re-running exits 0 again. (Run this sanity check to prove paletteWhitelist actually catches violations, then clean up.)
  </acceptance_criteria>
  <verify>
    <automated>npx tsx scripts/check-brand.ts</automated>
  </verify>
  <done>scripts/check-brand.ts has 4 check functions, aggregates exit code, uses only node: imports, passes clean against current repo state, catches simulated violations (prove via throwaway-file regression test).</done>
</task>

<task type="auto">
  <name>Task 2: Wire postbuild npm script + insert check-brand step into deploy.yml</name>
  <files>package.json, .github/workflows/deploy.yml</files>
  <read_first>
    - package.json (current state — scripts shape post-Plan 02-03, confirms postbuild NOT yet present)
    - .github/workflows/deploy.yml (current state — 11 lines in the build job per Phase 1 baseline)
    - .planning/phases/02-data-layer-content/02-RESEARCH.md §"deploy.yml: check-brand Step Insertion" (exact insertion diff)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-28 (both local postbuild AND named CI step)
    - scripts/check-brand.ts (verify Task 1 exists before wiring it)
  </read_first>
  <action>
Step 1. Edit `package.json` to add `"postbuild": "tsx scripts/check-brand.ts"` to the scripts block. Preserve all existing scripts (predev, dev, prebuild, build, preview, lint, list:construction from Plans 02-01 and 02-03).

Target scripts block (after edit):
```json
"scripts": {
  "predev": "tsx scripts/copy-renders.ts",
  "dev": "vite",
  "prebuild": "tsx scripts/copy-renders.ts",
  "build": "tsc --noEmit && vite build",
  "postbuild": "tsx scripts/check-brand.ts",
  "preview": "vite preview",
  "lint": "tsc --noEmit",
  "list:construction": "tsx scripts/list-construction.ts"
}
```

Use Edit with a minimal diff — change ONLY the line after `"build": "tsc --noEmit && vite build"` to insert `"postbuild"`. Do NOT re-order or re-format other lines.

Step 2. Edit `.github/workflows/deploy.yml`. Current build job steps are:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm
  - run: npm ci
  - run: npm run build
  - uses: actions/upload-pages-artifact@v3
    with:
      path: dist
```

Insert EXACTLY ONE new step between `- run: npm run build` and `- uses: actions/upload-pages-artifact@v3`:

```yaml
      - name: Check brand invariants
        run: npx tsx scripts/check-brand.ts
```

Match the indentation of the surrounding steps (2 spaces for the `-`, 8 spaces for `name` / `run` sub-keys — see existing `- run: npm run build` indent style; this is a GH Actions standard).

After edit, the steps block should look like:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm
  - run: npm ci
  - run: npm run build
  - name: Check brand invariants
    run: npx tsx scripts/check-brand.ts
  - uses: actions/upload-pages-artifact@v3
    with:
      path: dist
```

Do NOT:
- Rename the existing `build` job or the `deploy` job.
- Add any `permissions` change — check-brand is read-only (RESEARCH §"No OIDC/permissions change needed").
- Replace `npx tsx` with `./node_modules/.bin/tsx` — both work; `npx tsx` is idiomatic and matches what CI developers expect in logs.
- Move the step AFTER upload-pages-artifact — it must be BEFORE (blocking intent).
- Delete the postbuild wiring in package.json in favour of CI-only — per D-28, both overlap as safety nets.
  </action>
  <acceptance_criteria>
    - `grep -c '"postbuild": "tsx scripts/check-brand.ts"' package.json` returns `1`
    - `grep -c '"predev": "tsx scripts/copy-renders.ts"' package.json` returns `1` (preserved)
    - `grep -c '"prebuild": "tsx scripts/copy-renders.ts"' package.json` returns `1` (preserved)
    - `grep -c '"build": "tsc --noEmit && vite build"' package.json` returns `1` (preserved)
    - `grep -c '"list:construction": "tsx scripts/list-construction.ts"' package.json` returns `1` (preserved)
    - `grep -c "Check brand invariants" .github/workflows/deploy.yml` returns `1`
    - `grep -c "npx tsx scripts/check-brand.ts" .github/workflows/deploy.yml` returns `1`
    - Check-brand step ordering: `grep -nE "npm run build|Check brand|upload-pages-artifact" .github/workflows/deploy.yml` shows `npm run build` → `Check brand` → `upload-pages-artifact` in that line-order
    - YAML syntax valid: `node -e "const yaml=require('yaml'); yaml.parse(require('fs').readFileSync('.github/workflows/deploy.yml','utf8'))"` exits 0 — OR alternative quick check using python: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"` exits 0
    - `grep -cE "^[[:space:]]+- " .github/workflows/deploy.yml | head -1` shows step count increased by 1 vs Phase 1 baseline (6 → 7 steps in the build job)
    - Full build passes end-to-end: `npm run build` exits 0. Specifically:
      1. `prebuild` (copy-renders) runs and populates public/renders + public/construction
      2. `tsc --noEmit` passes
      3. `vite build` produces dist/
      4. `postbuild` (check-brand) runs 4 checks — all PASS
      5. Script exits 0; build overall exits 0
    - Full-pipeline output contains `[check-brand] 4/4 checks passed` once (from postbuild)
  </acceptance_criteria>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>package.json has postbuild script; deploy.yml has "Check brand invariants" step between build and upload-pages-artifact; `npm run build` runs the full chain end-to-end with all 4 checks passing.</done>
</task>

</tasks>

<verification>
After both tasks complete:

1. Full build pipeline smoke test:
   ```bash
   rm -rf dist public/renders public/construction
   npm run build
   ```
   Expected output (in order):
   - `[copy-renders] likeview → lakeview`
   - `[copy-renders] ЖК Етно Дім → etno-dim`
   - `[copy-renders] ЖК Маєток Винниківський → maietok-vynnykivskyi`
   - `[copy-renders] Дохідний дім NTEREST → nterest`
   - `[copy-renders] construction done — _social-covers skipped per CONCEPT §7.9`
   - (tsc + vite build output)
   - `[check-brand] PASS denylistTerms`
   - `[check-brand] PASS paletteWhitelist`
   - `[check-brand] PASS placeholderTokens`
   - `[check-brand] PASS importBoundaries`
   - `[check-brand] 4/4 checks passed`
   - Exit 0

2. Denylist proof (run manually; forge and remove):
   ```bash
   # Forge violation
   echo "const PICTORIAL = 'x';" > src/tmp-denylist-check.ts
   npx tsx scripts/check-brand.ts
   # Expect: exit 1, output contains "FAIL denylistTerms" and "tmp-denylist-check.ts"
   rm src/tmp-denylist-check.ts
   # Re-run
   npx tsx scripts/check-brand.ts
   # Expect: exit 0
   ```

3. Boundary proof: all 5 import-boundary rules pass against current Phase 2 state
   ```bash
   grep -rE "from ['\"].*pages/" src/components/ 2>&1 | grep -v "no such" | wc -l         # expect: 0
   grep -rE "from ['\"]react['\"]|from ['\"]motion" src/data/ src/content/ | wc -l         # expect: 0
   grep -rE "'/renders/|'/construction/" src/components/ 2>&1 | grep -v "no such" | wc -l  # expect: 0
   grep -rE "projects\\.fixtures" src/pages/ src/components/ 2>&1 | grep -v "no such" | wc -l  # expect: 0
   ```

4. YAML integrity of deploy.yml: parse successfully, insertion in correct order, no extra/missing keys.

Commit boundary (per CONTEXT.md <specifics> — commit 4 of 4, final):
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(02): add check-brand CI + wire postbuild + deploy.yml step" --files scripts/check-brand.ts package.json .github/workflows/deploy.yml
```

After this commit, Phase 2 is complete. Update ROADMAP.md Phase 2 status:
- Check `[x]` on Phase 2 «Data Layer & Content»
- Update «**Progress**: N/N plans complete» to `5/5`
- This is automated by the plan-phase finalisation step — not a manual task.
</verification>

<success_criteria>
- [ ] scripts/check-brand.ts has 4 check functions (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries)
- [ ] Palette whitelist const contains exactly the 6 canonical hexes (matches @theme)
- [ ] Aggregate exit: exit 1 on any failure, exit 0 on all pass, prints «N/4 checks passed»
- [ ] Script uses only node: imports (node:child_process, node:fs) — no npm deps
- [ ] package.json has `"postbuild": "tsx scripts/check-brand.ts"` (preserves all prior scripts)
- [ ] .github/workflows/deploy.yml has `Check brand invariants` step between `npm run build` and `actions/upload-pages-artifact@v3`
- [ ] `npm run build` end-to-end passes: prebuild copies assets, tsc passes, vite builds, postbuild check-brand exits 0 with «4/4 checks passed»
- [ ] Manual forge-and-remove test proves denylistTerms actually catches `Pictorial` / `Rubikon` strings (regression smoke test)
- [ ] All 5 boundary rules hold against current codebase (zero violations)
- [ ] Files committed with single atomic commit
</success_criteria>

<output>
After completion, create `.planning/phases/02-data-layer-content/02-05-SUMMARY.md`. Key fields:
- `affects`: [scripts, package.json, .github/workflows, build-pipeline, CI]
- `provides`: [check-brand postbuild hook, deploy.yml check-brand step, denylist enforcement (QA-04), palette-whitelist enforcement (QA-04 + VIS-01), placeholder-token enforcement (QA-04), 5 import-boundary grep rules (D-32 + D-09)]
- `patterns`: [shell-out grep over ESLint (STACK.md), aggregate-exit-1 on any failure (D-29), overlapping-safety-nets — postbuild + named CI step (D-28), literal palette whitelist over @theme parser (RESEARCH §Tailwind v4 @theme), graceful handling of missing dist/ at manual-run time]
</output>
