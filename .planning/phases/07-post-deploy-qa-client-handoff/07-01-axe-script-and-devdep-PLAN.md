---
phase: 07-post-deploy-qa-client-handoff
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - scripts/axe-audit.mjs
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/home.json
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/projects.json
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/zhk-etno-dim.json
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/construction-log.json
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/contact.json
  - .planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md
autonomous: true
requirements_addressed: [QA-04]

must_haves:
  truths:
    - "Running `npm run audit:a11y` against vite preview reports zero critical and zero serious axe violations on all 5 production routes"
    - "Each of 5 routes has a JSON evidence file in axe/ subdir with axe-core's standard violation report format"
    - "axe-summary.md aggregates per-route violation counts (critical/serious/moderate/minor) into a single scannable table"
  artifacts:
    - path: "scripts/axe-audit.mjs"
      provides: "One-shot axe-core orchestrator: spawns vite preview, polls TCP port, iterates 5 hash-routes, shells `npx axe`, writes JSONs, tears down, exits non-zero on critical/serious"
      min_lines: 50
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md"
      provides: "Per-route violation aggregate table (5 rows × 4 severity columns)"
      contains: "| Route |"
    - path: "package.json"
      provides: "audit:a11y npm script entry, @axe-core/cli devDep"
      contains: "audit:a11y"
  key_links:
    - from: "scripts/axe-audit.mjs"
      to: "vite preview --port 4173"
      via: "child_process.spawn"
      pattern: "spawn\\(['\"]npx['\"]"
    - from: "scripts/axe-audit.mjs"
      to: "npx axe http://localhost:4173/#/{path}"
      via: "shell out per-route"
      pattern: "wcag2a,wcag2aa"
    - from: "package.json"
      to: "scripts/axe-audit.mjs"
      via: "npm script entry"
      pattern: "\"audit:a11y\""
---

<objective>
Add `@axe-core/cli` as devDependency and create `scripts/axe-audit.mjs` that runs WCAG 2.1 A+AA axe-core audits against `vite preview` localhost on all 5 production hash-routes, producing 5 per-route JSONs + 1 aggregate summary as Phase 7 SC#3 (axe part) evidence.

Purpose: Closes Phase 7 SC#3 second half ("axe-core run per route reports zero critical a11y issues"; per D-16 strengthened to "zero critical AND zero serious"). The script is ONE-SHOT — registered as `npm run audit:a11y` ONLY, NOT wired into prebuild/postbuild/deploy.yml per D-17. Audit target is `vite preview` localhost (NOT deployed URL) per D-14, because axe-core scoring is DOM-only and same dist/ output ships to GH Pages.

**Honors D-35 — does NOT modify deploy.yml or add audit:a11y to CI.** The npm script is one-shot evidence at handoff time only. No new PR-merge gate is introduced beyond existing `check-brand` + `lhci`. Promotion path to a permanent CI a11y gate is documented in deferred ideas (v2 trigger).

Output: `scripts/axe-audit.mjs`, `package.json` updated (devDep + script), `.planning/phases/07-post-deploy-qa-client-handoff/axe/{home,projects,zhk-etno-dim,construction-log,contact}.json`, `.planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@scripts/check-brand.ts
@package.json

<interfaces>
<!-- Existing one-shot script pattern (Phase 2 D-22 precedent for `scripts/list-construction.ts`): -->
<!-- ESM .mjs file with shebang OR `node scripts/...` invocation; lives in scripts/; registered as npm run script entry; NOT wired to lifecycle hooks. -->

<!-- Axe-core CLI invocation shape (from D-13 outline): -->
<!-- npx axe {url} --tags wcag2a,wcag2aa --exit --save {out.json} -->
<!-- - --tags filters to WCAG 2.1 A + AA per D-15 (excludes wcag2aaa, best-practice, experimental) -->
<!-- - --exit makes axe non-zero on any violation; we override with our own critical+serious threshold check -->
<!-- - --save writes the JSON report -->

<!-- Production hash-routes (from D-13 outline + Phase 6 D-31 lhci config): -->
<!--   home              -> http://localhost:4173/#/ -->
<!--   projects          -> http://localhost:4173/#/projects -->
<!--   zhk-etno-dim      -> http://localhost:4173/#/zhk/etno-dim -->
<!--   construction-log  -> http://localhost:4173/#/construction-log -->
<!--   contact           -> http://localhost:4173/#/contact -->

<!-- Vite preview default port: 4173 (Vite 6 unchanged). `npx vite preview --port 4173` serves dist/. -->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Install @axe-core/cli devDep + add audit:a11y npm script</name>
  <files>package.json</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-13, D-15, D-17 — devDep + tags + one-shot rule)
    - package.json (current scripts + devDependencies — DO NOT remove existing entries)
  </read_first>
  <action>
    Per D-13 + D-17:

    1. Run `npm install --save-dev @axe-core/cli@^4` (latest @axe-core/cli major as of 2026-04). Verify after install that `package.json` `devDependencies` contains `"@axe-core/cli": "^X.Y.Z"` (caret-pinned, semver minor).

    2. Add ONE new entry to `package.json` `scripts` block (preserving all existing entries — predev, dev, prebuild, build, postbuild, preview, lint, list:construction):

       ```json
       "audit:a11y": "node scripts/axe-audit.mjs"
       ```

       DO NOT modify `prebuild`, `postbuild`, or any other lifecycle hook (D-17 explicitly forbids — one-shot script only).

    3. Verify the resulting package.json:
       - `cat package.json | jq -r '.scripts."audit:a11y"'` returns `"node scripts/axe-audit.mjs"`
       - `cat package.json | jq -r '.devDependencies."@axe-core/cli"'` returns a valid semver string (NOT null)
       - `cat package.json | jq -r '.scripts.prebuild'` is unchanged from pre-edit value (`"tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction && node scripts/build-og-image.mjs"`)
       - `cat package.json | jq -r '.scripts.postbuild'` is unchanged (`"tsx scripts/check-brand.ts"`)

    Reasoning: D-17 keeps a11y as one-shot evidence at handoff time; promotion to CI gate is a v2 trigger (deferred ideas). `@axe-core/cli` is the chosen tool over pa11y per D-13 (axe-core engine is more widely cited + SC#3 explicitly says "axe-core run").
  </action>
  <verify>
    <automated>cat package.json | jq -e '.scripts."audit:a11y" == "node scripts/axe-audit.mjs"' && cat package.json | jq -e '.devDependencies."@axe-core/cli" != null' && cat package.json | jq -e '.scripts.prebuild != null and .scripts.postbuild != null'</automated>
  </verify>
  <done>
    package.json contains the new `audit:a11y` script and `@axe-core/cli` devDep; no existing entries removed; lockfile updated; D-17 honored (no lifecycle wiring).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Author scripts/axe-audit.mjs orchestrator (~50–60 lines)</name>
  <files>scripts/axe-audit.mjs</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-13, D-15, D-16, D-18 — script outline + WCAG tags + critical+serious threshold + output schema)
    - scripts/check-brand.ts (existing one-shot script style for reference)
    - package.json (verify "audit:a11y" entry exists from Task 1)
  </read_first>
  <action>
    Per D-13 outline + D-15 tag scope + D-16 threshold + D-18 output schema. Create `scripts/axe-audit.mjs` (ESM, plain `.mjs` so no TS surface — same precedent as `scripts/optimize-images.mjs` from Plan 03-03 D-3).

    Required script structure:

    ```js
    // scripts/axe-audit.mjs
    // One-shot Phase 7 axe-core audit. NOT wired to prebuild/postbuild/deploy.yml (D-17).
    // Tags scoped wcag2a,wcag2aa (D-15). Fails on critical OR serious (D-16).

    import { spawn, spawnSync } from 'node:child_process';
    import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
    import net from 'node:net';
    import { fileURLToPath } from 'node:url';
    import path from 'node:path';

    const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
    const ROUTES = [
      { slug: 'home',             hash: '/' },
      { slug: 'projects',         hash: '/projects' },
      { slug: 'zhk-etno-dim',     hash: '/zhk/etno-dim' },
      { slug: 'construction-log', hash: '/construction-log' },
      { slug: 'contact',          hash: '/contact' },
    ];
    const PREVIEW_PORT = 4173;
    const OUT_DIR = path.join(REPO_ROOT, '.planning/phases/07-post-deploy-qa-client-handoff/axe');

    mkdirSync(OUT_DIR, { recursive: true });

    // 1. Spawn vite preview --port 4173 in background, stdio:pipe to suppress noise
    const preview = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT)], {
      cwd: REPO_ROOT, stdio: 'pipe',
    });

    // 2. Wait for TCP port to accept connections (≤30s timeout, 200ms poll)
    await waitForPort(PREVIEW_PORT, 30_000);

    // 3. Iterate 5 production hash-routes, shell out npx axe per route
    const summary = [];
    let hadCriticalOrSerious = false;
    for (const { slug, hash } of ROUTES) {
      const url = `http://localhost:${PREVIEW_PORT}/#${hash === '/' ? '' : hash}`;
      const outFile = path.join(OUT_DIR, `${slug}.json`);
      const res = spawnSync('npx', [
        'axe', url,
        '--tags', 'wcag2a,wcag2aa',
        '--save', outFile,
      ], { cwd: REPO_ROOT, stdio: 'pipe', encoding: 'utf-8' });
      // axe writes the JSON regardless of exit code; we read it ourselves
      const counts = countViolations(outFile);
      summary.push({ slug, ...counts });
      if (counts.critical > 0 || counts.serious > 0) hadCriticalOrSerious = true;
    }

    // 4. Write aggregate summary markdown
    writeFileSync(path.join(OUT_DIR, 'axe-summary.md'), renderSummary(summary));

    // 5. Tear down preview server
    preview.kill('SIGTERM');

    // 6. Exit code per D-16: critical OR serious > 0 -> exit 1
    process.exit(hadCriticalOrSerious ? 1 : 0);

    // Helpers below ---------------------------------------------------------

    function waitForPort(port, timeoutMs) { /* TCP poll loop using net.Socket */ }

    function countViolations(jsonPath) {
      // axe-core JSON shape: { violations: [{ impact: 'critical'|'serious'|'moderate'|'minor', ... }, ...] }
      // Returns { critical, serious, moderate, minor }
    }

    function renderSummary(rows) {
      // Returns markdown:
      //   # Phase 7 — axe-core a11y summary
      //   | Route | Critical | Serious | Moderate | Minor |
      //   |-------|----------|---------|----------|-------|
      //   | home  | 0        | 0       | 2        | 1     |
      //   ...
      // Plus a footer line: "Threshold: critical+serious must be 0 (D-16). Exit code: PASS/FAIL."
    }
    ```

    Implementation notes:
    - `waitForPort` uses Node `net.Socket` with `connect()` retry every 200ms, bails after 30s with thrown error.
    - `countViolations` reads the JSON, iterates `violations[]`, increments per-impact bucket. Default impact (when missing) → treat as `moderate`.
    - `renderSummary` produces a 6-row table (header + 5 routes) + threshold/exit footer.
    - The script must be runnable as `node scripts/axe-audit.mjs` AFTER a successful `npm run build` (so dist/ exists for vite preview to serve).
    - Headless behavior: `npx axe` runs Chromium headless under the hood (axe-core/cli bundles puppeteer-core); first run downloads Chromium ~150MB.

    Pre-screen for self-consistency (per recurring planner-template smell from Plans 02-04, 03-03..06): the script's own doc-block comment must NOT contain the literal forbidden lexicon (Pictorial/Rubikon/Пикторіал/Рубікон) AND must NOT contain unpaired `{{` or `TODO` literals. Currently safe — no such literals required.
  </action>
  <verify>
    <automated>test -f scripts/axe-audit.mjs && wc -l < scripts/axe-audit.mjs | awk '{ if ($1 >= 50 && $1 <= 120) exit 0; else exit 1 }' && grep -c "wcag2a,wcag2aa" scripts/axe-audit.mjs | grep -q "^1$" && grep -c "PREVIEW_PORT = 4173" scripts/axe-audit.mjs | grep -q "^1$" && node -c scripts/axe-audit.mjs</automated>
  </verify>
  <done>
    `scripts/axe-audit.mjs` exists, ~50–120 lines, parses with `node -c`, contains the `wcag2a,wcag2aa` tag literal once and the `PREVIEW_PORT = 4173` literal once, structurally matches the D-13 outline.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Run audit:a11y, archive 5 JSONs + axe-summary.md, verify exit code</name>
  <files>
    .planning/phases/07-post-deploy-qa-client-handoff/axe/home.json
    .planning/phases/07-post-deploy-qa-client-handoff/axe/projects.json
    .planning/phases/07-post-deploy-qa-client-handoff/axe/zhk-etno-dim.json
    .planning/phases/07-post-deploy-qa-client-handoff/axe/construction-log.json
    .planning/phases/07-post-deploy-qa-client-handoff/axe/contact.json
    .planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md
  </files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-16 critical+serious threshold)
    - scripts/axe-audit.mjs (just authored)
    - package.json (audit:a11y entry)
  </read_first>
  <action>
    **Note:** First run of `npm run audit:a11y` downloads Chromium (~150MB) via the @axe-core/cli driver (puppeteer-core). Subsequent runs use the cached binary. Ensure dev environment has internet on first run; allow ~2-5 extra minutes for the cold-start download. CI environments without cached browser will re-download every run — another reason D-17 keeps this OUT of CI.

    Per D-13 step 6 + D-16 + D-18 schema:

    1. Ensure `dist/` is fresh: `npm run build`. Must exit 0 with `[check-brand] 7/7 checks passed`.

    2. Run `npm run audit:a11y`. The script will:
       - Spawn `vite preview --port 4173`
       - Wait for the port (≤30s)
       - Iterate 5 routes, run `npx axe` for each, write JSON to `.planning/phases/07-post-deploy-qa-client-handoff/axe/{slug}.json`
       - Write `axe-summary.md` aggregate
       - Kill preview
       - Exit 0 (no critical/serious) OR 1 (had critical/serious)

    3. After the run completes, verify:
       - 5 JSON files exist: `ls .planning/phases/07-post-deploy-qa-client-handoff/axe/*.json | wc -l` returns `5`
       - Each JSON parses: `for f in .planning/phases/07-post-deploy-qa-client-handoff/axe/*.json; do jq empty "$f" || echo "BAD: $f"; done` produces no "BAD:" lines
       - axe-summary.md exists and starts with `# Phase 7` (or similar header) and contains a markdown table
       - The script exited 0 (critical+serious threshold met per D-16)

    4. If the script exits 1 (critical or serious violation found):
       - Inspect the offending JSON's `violations[].impact === 'critical' | 'serious'` entries
       - Per D-11 failure recovery analog: STOP Phase 7 progression, raise as a11y regression, trigger `/gsd:debug` against the violations, fix the underlying src/ code, re-deploy via existing CI, re-run `npm run audit:a11y`. DO NOT band-aid by lowering the threshold.
       - Phase 7 verification doc (Plan 07-09) cannot complete until this exits 0.

    5. Commit the 5 JSONs + axe-summary.md to git as evidence (gitignore does NOT exclude `.planning/phases/`). The JSONs may be 1KB–50KB each depending on violation count; commit them verbatim, no minification.

    Reasoning: D-16 strengthens SC#3's "zero critical" to "zero critical AND zero serious" because critical-only is too lenient (missing alt-text scores serious). Moderate/minor violations stay in the JSON for record but do NOT fail the script.
  </action>
  <verify>
    <automated>ls .planning/phases/07-post-deploy-qa-client-handoff/axe/*.json | wc -l | grep -q "^[[:space:]]*5$" && test -f .planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md && head -1 .planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md | grep -qi "axe\|phase 7" && for f in .planning/phases/07-post-deploy-qa-client-handoff/axe/*.json; do jq empty "$f" || exit 1; done</automated>
  </verify>
  <done>
    5 JSON files exist (one per production route), each parses as valid JSON with axe-core's standard violation report shape; axe-summary.md exists and starts with a Phase 7 / axe-related header; npm run audit:a11y exits 0 (zero critical, zero serious per D-16).
  </done>
</task>

</tasks>

<verification>
- `package.json` `scripts."audit:a11y"` is `"node scripts/axe-audit.mjs"`
- `package.json` `devDependencies."@axe-core/cli"` is non-null caret-pinned semver
- `package.json` `scripts.prebuild` and `scripts.postbuild` UNCHANGED from pre-Phase-7 (D-17 — no lifecycle wiring)
- `scripts/axe-audit.mjs` exists, parses, contains literal `wcag2a,wcag2aa` once, `PREVIEW_PORT = 4173` once
- 5 JSONs exist in `.planning/phases/07-post-deploy-qa-client-handoff/axe/{home,projects,zhk-etno-dim,construction-log,contact}.json`
- `axe-summary.md` exists in same directory
- `npm run audit:a11y` exits 0 (zero critical + zero serious per D-16)
</verification>

<success_criteria>
- Phase 7 SC#3 (axe part): zero critical AND zero serious violations across 5 production routes — VERIFIED via JSON archive + script exit code
- Evidence directory `.planning/phases/07-post-deploy-qa-client-handoff/axe/` populated with 5 JSONs + 1 summary markdown
- Plan 07-09 (final verification doc) can cite `axe-summary.md` as SC#3 closure pointer
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-01-SUMMARY.md`.
</output>
</content>
