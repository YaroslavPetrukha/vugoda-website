---
phase: 06-performance-mobile-fallback-deploy
plan: 09
type: execute
wave: 4
depends_on: [06-03-devdep-and-utility, 06-06-meta-and-og-image, 06-08-budget-gates]
files_modified:
  - .lighthouserc.cjs
  - .github/workflows/lighthouse.yml
  - docs/CLIENT-HANDOFF.md
autonomous: true
requirements: [QA-02, QA-03, DEP-01, DEP-02]
must_haves:
  truths:
    - ".lighthouserc.cjs exports a CommonJS module with `ci.collect.url` listing all 5 production URLs verbatim per CONTEXT D-31 (root, /#/projects, /#/zhk/etno-dim, /#/construction-log, /#/contact)"
    - ".lighthouserc.cjs uses `chromeFlags: '--incognito'` per D-31 (clears Phase 5 sessionStorage 'vugoda:hero-seen' between URL runs — RESEARCH §Pitfall 1)"
    - ".lighthouserc.cjs uses `numberOfRuns: 1` per D-31 (demo-grade gate; if flaky in week 1 post-deploy, planner bumps to 3 — RESEARCH §Open Q2)"
    - ".lighthouserc.cjs `assert.assertions` ships exactly 4 categories (performance, accessibility, best-practices, seo) at minScore 0.9 each per D-31 (Lighthouse 12 has no PWA category — RESEARCH §State of the Art)"
    - ".github/workflows/lighthouse.yml is a SEPARATE workflow file (NOT appended to deploy.yml) per RESEARCH.md §5 + §Pitfall 5 — explicit deviation from CONTEXT D-34's 'one new job in deploy.yml' wording, with rationale: deploy.yml's `concurrency: { group: pages, cancel-in-progress: true }` would cancel mid-run lhci jobs during merge bursts, masking real regressions. Separate file gets its own concurrency group `lighthouse-pages` and triggers via `workflow_run: { workflows: ['Deploy to Pages'], types: [completed] }` after deploy.yml succeeds."
    - ".github/workflows/lighthouse.yml runs `npx lhci autorun` against the deployed URL; ASSERTS post-run that all 5 URLs in `.lighthouseci/lhr-*.json` carry `requestedUrl` with `#` preserved (RESEARCH Open Q1 smoke check via jq); failure exits the workflow with a clear error"
    - "docs/CLIENT-HANDOFF.md exists listing the 9 line edits across 2 files required if the user's GitHub account ≠ 'yaroslavpetrukha' (D-26 + D-38 + RESEARCH §Risk 1) — index.html (4 occurrences), .lighthouserc.cjs (5 occurrences), src/content/mobile-fallback.ts (1 Lakeview link — does NOT change with account), src/data/projects.ts (Lakeview externalUrl — does NOT change with account)"
  artifacts:
    - path: .lighthouserc.cjs
      provides: "Lighthouse CI configuration per CONTEXT D-31 (locked URLs + 4 assertions + incognito + numberOfRuns:1)"
      contains: "categories:performance"
    - path: .github/workflows/lighthouse.yml
      provides: "Separate lhci workflow with workflow_run trigger after Deploy to Pages succeeds (RESEARCH §5 — concurrency-group separation from deploy.yml)"
      contains: "workflow_run"
    - path: docs/CLIENT-HANDOFF.md
      provides: "Client-handoff document listing pre-deploy GitHub-account confirmation item (D-38) + the 4 file paths to edit if account differs"
      contains: "yaroslavpetrukha"
  key_links:
    - from: ".github/workflows/lighthouse.yml"
      to: ".lighthouserc.cjs"
      via: "npx lhci autorun --config=.lighthouserc.cjs"
      pattern: "lhci autorun"
    - from: ".github/workflows/lighthouse.yml"
      to: ".github/workflows/deploy.yml"
      via: "workflow_run trigger on completed Deploy to Pages workflow"
      pattern: "workflows: \\['Deploy to Pages'\\]"
    - from: ".lighthouserc.cjs"
      to: "5 production URLs at https://yaroslavpetrukha.github.io/vugoda-website/"
      via: "ci.collect.url array"
      pattern: "yaroslavpetrukha\\.github\\.io"
    - from: "docs/CLIENT-HANDOFF.md"
      to: "4 hardcoded-URL file paths"
      via: "documentation list"
      pattern: "yaroslavpetrukha"
---

<objective>
Wave 4 — final wiring + handoff documentation.

**3 files created:**

**1. `.lighthouserc.cjs`** (CONTEXT D-31 verbatim + RESEARCH §"Code Examples — lhci `.lighthouserc.cjs`"):
The Lighthouse CI configuration file. CommonJS (`.cjs`) format because `package.json` has `"type": "module"` — lhci's loader expects CommonJS by default. Uses the locked 5-URL list with `#` fragments preserved per HashRouter (DEP-03), Lighthouse Desktop preset, `--incognito` chromeFlags (RESEARCH Pitfall 1 — clears sessionStorage between runs), `numberOfRuns: 1` (demo-grade gate per D-31; planner can bump to 3 if flaky per RESEARCH Open Q2), and 4 category assertions at minScore 0.9.

**2. `.github/workflows/lighthouse.yml`** (RESEARCH §5 — DEVIATES from CONTEXT D-34 with documented rationale):

CONTEXT D-34 says «.github/workflows/deploy.yml gets ONE new job: `lighthouse` depending on `deploy`». RESEARCH §5 OVERRIDES this with the separate-workflow recommendation, citing:
- deploy.yml's `concurrency: { group: pages, cancel-in-progress: true }` would cancel in-progress lhci jobs during merge bursts (RESEARCH §Pitfall 5)
- A separate workflow file with its OWN concurrency group `lighthouse-pages` allows lhci to complete even when a new push triggers a fresh deploy
- `workflow_run` trigger is the GitHub-Actions native way to chain workflows (runs after the named workflow completes successfully on the same SHA)

The new workflow has these jobs/steps:
- `name: Lighthouse Audit`
- Trigger: `on: workflow_run: { workflows: ['Deploy to Pages'], types: [completed] }`
- Concurrency: `lighthouse-pages` (different group from deploy.yml's `pages`)
- Permissions: `contents: read` only (read-only)
- Single job `lighthouse` running on `ubuntu-latest`:
  1. Skip if upstream deploy did not succeed (`if: github.event.workflow_run.conclusion == 'success'`)
  2. Checkout (for the .lighthouserc.cjs file)
  3. Setup Node 20 with npm cache
  4. `npm ci` (installs @lhci/cli from package.json)
  5. `npx lhci autorun --config=.lighthouserc.cjs`
  6. Smoke check (RESEARCH Open Q1 mitigation): `for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done | grep -c '#' >= 4` — asserts 4 of the 5 URLs (all except root) preserve their `#` fragment in the audit. If only 0 or 1 URL has `#`, lhci silently re-audited home N times — fail the workflow with a descriptive error.
  7. Upload `.lighthouseci/` directory as workflow artifact for Phase 7 archival

**3. `docs/CLIENT-HANDOFF.md`** (D-26 + D-38 + RESEARCH §Risk 1):
Pre-deploy CLIENT-HANDOFF document listing items the user must confirm with the client before merging Phase 6 to main. Specifically the GitHub-account confirmation: if the user's account is NOT `yaroslavpetrukha`, the 4 hardcoded URLs need a one-PR edit. The document lists the exact files + line counts + the replacement value to use. Plan 06-09 produces this; Phase 7 (post-deploy QA) consumes + extends it with the remaining 8 §11 open client items.

Output: 3 new files. ~80-100 lines total. Zero edits to existing files (deploy.yml stays unchanged per RESEARCH §5).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@.github/workflows/deploy.yml
@package.json
</context>

<interfaces>
<!-- Existing .github/workflows/deploy.yml (Phase 1 D-15..D-18) — NOT EDITED in this plan -->

```yaml
name: Deploy to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
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

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.dep.outputs.page_url }}
    steps:
      - id: dep
        uses: actions/deploy-pages@v4
```

The workflow's `name` is `Deploy to Pages` (used as the `workflow_run.workflows` trigger value in lighthouse.yml). The lhci workflow does NOT extend this file.

<!-- .lighthouserc.cjs target shape (RESEARCH §"Code Examples" verbatim, CONTEXT D-31) -->

```js
module.exports = {
  ci: {
    collect: {
      url: [
        'https://yaroslavpetrukha.github.io/vugoda-website/',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/projects',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/contact',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--incognito',
      },
    },
    assert: {
      assertions: {
        'categories:performance':    ['error', { minScore: 0.9 }],
        'categories:accessibility':  ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo':            ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

<!-- .github/workflows/lighthouse.yml target shape (RESEARCH §5 + §Pitfall 5) -->

```yaml
name: Lighthouse Audit

on:
  workflow_run:
    workflows: ['Deploy to Pages']
    types: [completed]

permissions:
  contents: read

concurrency:
  group: lighthouse-pages
  cancel-in-progress: false

jobs:
  lighthouse:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Run Lighthouse CI
        run: npx lhci autorun --config=.lighthouserc.cjs
      - name: Verify hash-fragment URL fidelity (RESEARCH Open Q1)
        run: |
          set -e
          HASHED=$(for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done | grep -c '#' || true)
          if [ "$HASHED" -lt 4 ]; then
            echo "FAIL: only $HASHED of 5 URLs preserved hash fragment in lhci audit; expected 4."
            for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done
            exit 1
          fi
          echo "PASS: $HASHED of 5 URLs preserved hash fragment."
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lighthouseci-results
          path: .lighthouseci/
          retention-days: 30
```
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create .lighthouserc.cjs (D-31 verbatim)</name>
  <read_first>
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-31 (verbatim 4-category assertion + 5-URL list + numberOfRuns:1 + chromeFlags:--incognito)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Code Examples — lhci `.lighthouserc.cjs` — production-ready"
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pitfall 1" (incognito clears sessionStorage)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"State of the Art" (Lighthouse 12 has no PWA category — 4 categories is exact)
    - package.json (confirm `"type": "module"` is set — that's why we use `.cjs` not `.js`)
  </read_first>
  <files>.lighthouserc.cjs</files>
  <action>
    Create new file `.lighthouserc.cjs` (in repo root, alongside package.json) with this content:

    ```js
    /**
     * .lighthouserc.cjs — Phase 6 D-31 (locked) + RESEARCH.md §Code Examples.
     *
     * CommonJS (.cjs) is required because package.json has "type": "module" —
     * lhci's loader expects CommonJS by default. Switching to ESM would
     * require lhci to be invoked with --js-config=esm flag plus other
     * adjustments; .cjs is simpler.
     *
     * Notes:
     *   - 5 URLs match CONTEXT D-31 verbatim. The 4 hash-fragment URLs MUST
     *     preserve `#` through the lhci collect → audit → store pipeline.
     *     Workflow `.github/workflows/lighthouse.yml` runs a smoke check
     *     after `lhci autorun` to verify (RESEARCH Open Q1 mitigation).
     *   - numberOfRuns: 1 — demo-grade gate (D-31). Single runs are noisier
     *     (a slow Chromium spawn or flaky network burst can drop one route
     *     below 90, failing the workflow). If observed flake rate ≥ 2× in
     *     week 1 post-deploy, planner bumps to 3 (median scoring stabilizes).
     *   - chromeFlags: '--incognito' — RESEARCH Pitfall 1: prevents Phase 5
     *     sessionStorage 'vugoda:hero-seen' from carrying across URL runs
     *     within a single lhci collect invocation.
     *   - 4 category assertions only — Lighthouse 12 (used by lhci 0.15.x
     *     since May 2024) removed the PWA category (RESEARCH §State of the
     *     Art). The 4 below are the complete current set.
     *   - upload.target: 'temporary-public-storage' — free Google CDN, link
     *     expires ~7d. Sufficient for demo workflow's PR-comment lifecycle.
     *     Alternative 'filesystem' is used in CI workflow's upload-artifact
     *     step instead for 30-day retention (lighthouse.yml).
     *
     * GITHUB-ACCOUNT NOTE: 5 URLs hardcode `yaroslavpetrukha.github.io`. If
     * the user's account differs, edit this file alongside index.html (D-21,
     * D-23). See docs/CLIENT-HANDOFF.md for the full edit checklist.
     */
    module.exports = {
      ci: {
        collect: {
          url: [
            'https://yaroslavpetrukha.github.io/vugoda-website/',
            'https://yaroslavpetrukha.github.io/vugoda-website/#/projects',
            'https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim',
            'https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log',
            'https://yaroslavpetrukha.github.io/vugoda-website/#/contact',
          ],
          numberOfRuns: 1,
          settings: {
            preset: 'desktop',
            chromeFlags: '--incognito',
          },
        },
        assert: {
          assertions: {
            'categories:performance':    ['error', { minScore: 0.9 }],
            'categories:accessibility':  ['error', { minScore: 0.9 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
            'categories:seo':            ['error', { minScore: 0.9 }],
          },
        },
        upload: {
          target: 'temporary-public-storage',
        },
      },
    };
    ```

    File length: ~70 lines including JSDoc.

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero matches)
    - Hex literals: NO `#XXXXXX` (zero — though the URL fragments use `#/...` as part of HashRouter URLs, those aren't 6-char hex literals; paletteWhitelist scope is `*.{ts,tsx,css}` and `.cjs` is OUT of scope anyway)
    - Placeholder tokens: NO `\{\{[^}]*\}\}` Mustache pairs (verified — JS object syntax `{ minScore: 0.9 }` is single-brace)
    - Inline transition: not applicable (config file)
    - Import boundaries: not applicable (config file in repo root)

    Smoke validation locally (optional, fast — does NOT actually run lhci against the deployed URL):
    ```bash
    node -e "const c = require('./.lighthouserc.cjs'); console.log(c.ci.collect.url.length, c.ci.assert.assertions['categories:performance'])"
    ```
    Expected output: `5 [ 'error', { minScore: 0.9 } ]` — confirms the config loads as CommonJS and exposes the right shape.
  </action>
  <verify>
    <automated>test -f .lighthouserc.cjs && grep -q "module.exports" .lighthouserc.cjs && grep -q "https://yaroslavpetrukha.github.io/vugoda-website/" .lighthouserc.cjs && grep -c "https://yaroslavpetrukha.github.io/vugoda-website/" .lighthouserc.cjs | grep -qE "^[5-9]" && grep -q "chromeFlags: '--incognito'" .lighthouserc.cjs && grep -q "numberOfRuns: 1" .lighthouserc.cjs && grep -q "preset: 'desktop'" .lighthouserc.cjs && grep -q "categories:performance" .lighthouserc.cjs && grep -q "categories:accessibility" .lighthouserc.cjs && grep -q "categories:best-practices" .lighthouserc.cjs && grep -q "categories:seo" .lighthouserc.cjs && ! grep -q "categories:pwa" .lighthouserc.cjs && grep -c "minScore: 0.9" .lighthouserc.cjs | grep -qE "^[4-9]" && node -e "const c = require('./.lighthouserc.cjs'); if (c.ci.collect.url.length !== 5) process.exit(1); if (!c.ci.assert.assertions['categories:performance']) process.exit(1); console.log('OK')" && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f .lighthouserc.cjs` exits 0
    - `grep -c "module.exports" .lighthouserc.cjs` returns 1 (CommonJS export)
    - `grep -c "https://yaroslavpetrukha.github.io/vugoda-website/" .lighthouserc.cjs` returns 5 (one per URL — root + 4 hash-fragment URLs)
    - The 5 URLs match D-31 EXACTLY:
      - `grep -c "yaroslavpetrukha.github.io/vugoda-website/'$" .lighthouserc.cjs` — checks for the root URL line (with trailing slash + close-quote + comma + EOL)
      - `grep -c "/#/projects" .lighthouserc.cjs` returns 1
      - `grep -c "/#/zhk/etno-dim" .lighthouserc.cjs` returns 1
      - `grep -c "/#/construction-log" .lighthouserc.cjs` returns 1
      - `grep -c "/#/contact" .lighthouserc.cjs` returns 1
    - `grep -c "chromeFlags: '--incognito'" .lighthouserc.cjs` returns 1
    - `grep -c "numberOfRuns: 1" .lighthouserc.cjs` returns 1
    - `grep -c "preset: 'desktop'" .lighthouserc.cjs` returns 1
    - 4 category assertions present: `grep -c "categories:performance" .lighthouserc.cjs` returns 1; same for accessibility, best-practices, seo
    - PWA category NOT present: `grep -c "categories:pwa" .lighthouserc.cjs` returns 0
    - 4× `minScore: 0.9`: `grep -c "minScore: 0.9" .lighthouserc.cjs` returns ≥ 4
    - Loadable as CommonJS: `node -e "require('./.lighthouserc.cjs')"` exits 0
    - Shape verification: `node -e "const c = require('./.lighthouserc.cjs'); if (c.ci.collect.url.length !== 5) process.exit(1)"` exits 0 (5 URLs at the expected path)
    - `npm run build` exits 0 with `[check-brand] 7/7 checks passed` (the new file does not break the build; .cjs is not in any check-brand scope)
  </acceptance_criteria>
  <done>
    - .lighthouserc.cjs exists with the 5 locked URLs + 4 category assertions + incognito + numberOfRuns:1
    - Loads cleanly as CommonJS module
    - All values match CONTEXT D-31 verbatim
    - Plan 06-09 Task 2 (lighthouse.yml workflow) can invoke `npx lhci autorun --config=.lighthouserc.cjs`
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create .github/workflows/lighthouse.yml (RESEARCH §5 — separate workflow file with workflow_run trigger)</name>
  <read_first>
    - .github/workflows/deploy.yml (existing — confirm the workflow `name:` field used as `workflow_run.workflows` trigger value)
    - .lighthouserc.cjs (Task 1 above — confirm config path used in the lhci autorun command)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-34 (deploy.yml gets «one new job: lighthouse» — Phase 6 DEVIATES from this with rationale below)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Architecture Patterns → Recommended File Layout" (separate lighthouse.yml file)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pitfall 5" (concurrency-cancel masking — drives the separate-file decision)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Open Question 1: lhci hash-fragment URL fidelity" (smoke check inside the workflow)
  </read_first>
  <files>.github/workflows/lighthouse.yml</files>
  <action>
    **DEVIATION NOTE FROM CONTEXT.md D-34**: CONTEXT D-34 says «.github/workflows/deploy.yml gets ONE new job: `lighthouse` depending on `deploy`». RESEARCH §5 OVERRIDES this with the separate-workflow-file recommendation, citing concurrency-cancel risk on deploy.yml's `pages` group (RESEARCH §Pitfall 5). The planner has chosen RESEARCH's recommendation. Rationale documented in this file's top doc-block.

    Create new file `.github/workflows/lighthouse.yml` with this content:

    ```yaml
    # Phase 6 plan 06-09 — Lighthouse Audit workflow.
    #
    # DEVIATION FROM CONTEXT.md D-34: CONTEXT D-34 said «.github/workflows/
    # deploy.yml gets ONE new job: lighthouse depending on deploy». Phase 6
    # planner CHOSE RESEARCH §5 + §Pitfall 5 instead — separate workflow file
    # with its own concurrency group. Rationale:
    #
    #   - deploy.yml uses `concurrency: { group: pages, cancel-in-progress:
    #     true }` (Phase 1 D-15, locked). Adding lhci as a sibling job means a
    #     merge burst (3 commits in rapid succession) cancels lhci jobs 1+2
    #     mid-run; only commit 3's score is recorded, masking regressions.
    #
    #   - This file uses concurrency group `lighthouse-pages` with
    #     cancel-in-progress: false — lhci runs complete even when a new
    #     deploy starts. Worst case: queued lhci runs (auditable, never
    #     hidden).
    #
    #   - workflow_run trigger is the GitHub-Actions native chain mechanism;
    #     fires after `Deploy to Pages` completes successfully on the same
    #     SHA, ensuring the audit always targets the just-deployed code.
    #
    #   - Failure of this workflow does NOT roll back the deploy (artifact
    #     is already published; rollback would require manual redeploy of
    #     prior commit) — but the workflow run shows red on the merge
    #     commit's status, surfacing the regression in PR ergonomics.

    name: Lighthouse Audit

    on:
      workflow_run:
        workflows: ['Deploy to Pages']
        types: [completed]
      workflow_dispatch:

    permissions:
      contents: read

    concurrency:
      group: lighthouse-pages
      cancel-in-progress: false

    jobs:
      lighthouse:
        # Skip if the upstream Deploy to Pages workflow did not succeed
        # (e.g. build failed, check-brand failed, deploy failed). Manual
        # workflow_dispatch invocations bypass this guard.
        if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success' }}
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              # When triggered by workflow_run, GitHub checks out the SHA of
              # the workflow_run event (the just-deployed commit) — the same
              # code lhci is auditing.
              ref: ${{ github.event.workflow_run.head_sha || github.sha }}

          - uses: actions/setup-node@v4
            with:
              node-version: 20
              cache: npm

          - run: npm ci

          - name: Run Lighthouse CI
            run: npx lhci autorun --config=.lighthouserc.cjs

          - name: Verify hash-fragment URL fidelity (RESEARCH Open Q1 mitigation)
            run: |
              set -e
              # CONTEXT D-31's 5 URLs include 4 with hash fragments. lhci passes
              # URLs to Chromium as-is; Chromium handles `#` client-side. This
              # smoke check asserts at least 4 of the 5 lhr-*.json results
              # carry `#` in their requestedUrl — catches a silent fallback
              # where lhci normalised fragments and audited home 5 times.
              if ! ls .lighthouseci/lhr-*.json > /dev/null 2>&1; then
                echo "FAIL: no .lighthouseci/lhr-*.json files found — lhci output missing"
                exit 1
              fi
              HASHED=$(for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done | grep -c '#' || true)
              echo "Hash-fragment URLs in lhr-*.json: $HASHED of 5 expected ≥ 4"
              if [ "$HASHED" -lt 4 ]; then
                echo "FAIL: lhci silently dropped # fragments — audited home 5× instead of 5 different routes"
                for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done
                exit 1
              fi
              echo "PASS: hash-fragment URL fidelity verified."

          - name: Upload Lighthouse results
            if: always()
            uses: actions/upload-artifact@v4
            with:
              name: lighthouseci-results
              path: .lighthouseci/
              retention-days: 30
    ```

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon
    - Hex literals: NO `#XXXXXX` (zero — the `#` characters are URL fragments, not hex literals)
    - Placeholder tokens: NO `\{\{[^}]*\}\}` Mustache pairs in YAML body. **CRITICAL**: GitHub Actions uses `${{ ... }}` (DOLLAR-SIGN-prefixed double-brace) syntax — these are GitHub Actions expressions, NOT plain Mustache. The check-brand placeholderTokens regex pattern is `\{\{[^}]*\}\}` (DOES match `{{ ... }}` without the dollar prefix). Will it match `${{ ... }}`? Let's check: the regex `\{\{[^}]*\}\}` matches the substring `{{conclusion}}` regardless of what precedes it. So `${{ github.event.workflow_run.conclusion == 'success' }}` MATCHES — the regex finds the `{{ ... }}` portion. **HOWEVER**, the check-brand placeholderTokens scope is `dist/` only (Phase 2 D-27 — «dist/ only. src/ excluded so dev TODO comments stay legal»). YAML files in `.github/workflows/` are NOT in `dist/` (Vite does not copy them); they are NOT in `src/` either; they are in their own folder which is OUT of all check-brand scopes. So the GitHub Actions `${{ ... }}` syntax in this YAML file does NOT trigger placeholderTokens. Verified safe.
    - Inline transition: not applicable
    - Import boundaries: not applicable

    Verify after creation:
    - `npx js-yaml .github/workflows/lighthouse.yml > /dev/null 2>&1 && echo "valid YAML"` (if `js-yaml` is not installed, use `python -c "import yaml; yaml.safe_load(open('.github/workflows/lighthouse.yml'))"`)
    - Or use `cat .github/workflows/lighthouse.yml | head -3` to verify the `name:` field
    - The actual lhci execution can ONLY be tested in CI on a real deployed URL — local validation is structure-only

    NOTE about workflow_dispatch: added as a fallback trigger so the user can manually run the audit against a specific commit without waiting for a deploy. The `if:` condition handles both event types.
  </action>
  <verify>
    <automated>test -f .github/workflows/lighthouse.yml && grep -q "^name: Lighthouse Audit" .github/workflows/lighthouse.yml && grep -q "workflow_run:" .github/workflows/lighthouse.yml && grep -q "workflows: \\['Deploy to Pages'\\]" .github/workflows/lighthouse.yml && grep -q "lighthouse-pages" .github/workflows/lighthouse.yml && grep -q "cancel-in-progress: false" .github/workflows/lighthouse.yml && grep -q "npx lhci autorun --config=.lighthouserc.cjs" .github/workflows/lighthouse.yml && grep -q "lhr-\*.json" .github/workflows/lighthouse.yml && grep -q "actions/upload-artifact@v4" .github/workflows/lighthouse.yml && grep -q "node-version: 20" .github/workflows/lighthouse.yml && python3 -c "import yaml; yaml.safe_load(open('.github/workflows/lighthouse.yml'))" 2>&1 | grep -v Error && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f .github/workflows/lighthouse.yml` exits 0
    - `grep -c "^name: Lighthouse Audit" .github/workflows/lighthouse.yml` returns 1
    - `grep -c "workflow_run:" .github/workflows/lighthouse.yml` returns 1
    - `grep -cE "workflows: \\['Deploy to Pages'\\]" .github/workflows/lighthouse.yml` returns 1
    - `grep -c "lighthouse-pages" .github/workflows/lighthouse.yml` returns 1 (own concurrency group, NOT `pages`)
    - `grep -c "cancel-in-progress: false" .github/workflows/lighthouse.yml` returns 1 (NOT canceling — RESEARCH §Pitfall 5)
    - `grep -c "npx lhci autorun --config=.lighthouserc.cjs" .github/workflows/lighthouse.yml` returns 1
    - `grep -c "lhr-" .github/workflows/lighthouse.yml` returns ≥ 1 (the smoke check references lhr-*.json)
    - `grep -c "actions/upload-artifact@v4" .github/workflows/lighthouse.yml` returns 1
    - `grep -c "node-version: 20" .github/workflows/lighthouse.yml` returns 1
    - YAML is valid: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/lighthouse.yml'))"` exits 0 with no error output
    - **deploy.yml is UNCHANGED** by this plan: `git diff .github/workflows/deploy.yml` reports no changes
    - `npm run build` exits 0 with `[check-brand] 7/7 checks passed` (no regression)
  </acceptance_criteria>
  <done>
    - .github/workflows/lighthouse.yml exists with `name: Lighthouse Audit`, `workflow_run` trigger on `Deploy to Pages`, own concurrency group `lighthouse-pages`
    - Job runs `npx lhci autorun --config=.lighthouserc.cjs` then asserts hash-fragment URL fidelity (RESEARCH Open Q1)
    - Uploads `.lighthouseci/` as workflow artifact (30-day retention) for Phase 7 archival
    - Includes `workflow_dispatch` for manual runs (fallback)
    - DEVIATION FROM CONTEXT D-34 documented in the workflow's top doc-comment with full rationale (RESEARCH §Pitfall 5)
    - deploy.yml is left alone — Phase 1 D-15 shape preserved
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Create docs/CLIENT-HANDOFF.md (D-26 + D-38 + RESEARCH §Risk 1)</name>
  <read_first>
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-26 (env-driven URLs deferred to v2; v1 hardcoded acceptable)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-38 (CLIENT-HANDOFF item before deploy)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Risk 1" (4 file paths + line counts)
    - КОНЦЕПЦІЯ-САЙТУ.md §11 (8 open client items — referenced for completeness; Phase 7 owns the full §11 list, this plan addresses just the GitHub-account item)
  </read_first>
  <files>docs/CLIENT-HANDOFF.md</files>
  <action>
    First, ensure the `docs/` directory exists. Then create `docs/CLIENT-HANDOFF.md` with this content:

    ```markdown
    # Client Handoff — Pre-deploy checklist

    > **Status:** Phase 6 — items the user must confirm with the client BEFORE merging Phase 6 to `main`.
    > Phase 7 will EXTEND this document with the remaining 8 open §11 client items.

    ## Item 1: GitHub-account confirmation (Phase 6 D-26 + D-38)

    Phase 6 ships with hardcoded production URLs pointing to `https://yaroslavpetrukha.github.io/vugoda-website/` (Phase 6 CONTEXT.md §D-21, §D-23, §D-31). If the user's GitHub account name is **NOT** `yaroslavpetrukha`, the following 4 occurrences MUST be edited in a single PR before deploying.

    **Replacement value:** if the actual account is `<account>`, replace `yaroslavpetrukha` with `<account>` in:

    | File | Line shape | Count |
    |------|------------|-------|
    | `index.html` | `<meta property="og:url" content="https://yaroslavpetrukha.github.io/vugoda-website/" />`<br/>`<meta property="og:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<meta name="twitter:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<link rel="canonical" href="https://yaroslavpetrukha.github.io/vugoda-website/" />` | 4 occurrences |
    | `.lighthouserc.cjs` | The `ci.collect.url` array — 5 URLs, all under `https://yaroslavpetrukha.github.io/vugoda-website/...` | 5 occurrences |
    | (no other source files affected) | `src/content/mobile-fallback.ts` and `src/data/projects.ts` reference `yaroslavpetrukha.github.io/Lakeview/` (the EXTERNAL Lakeview site, NOT the vugoda-website demo) — these do **NOT** change with this account swap. | 0 (do not edit) |

    **Total edits:** 9 line changes across 2 files (index.html + .lighthouserc.cjs).

    **One-line `sed` to apply:**

    ```bash
    sed -i.bak "s/yaroslavpetrukha\\.github\\.io\\/vugoda-website/<account>.github.io\\/vugoda-website/g" index.html .lighthouserc.cjs
    ```

    Replace `<account>` with the actual GitHub account name. The `.bak` files are backups in case of typo; delete them after a successful build (`rm index.html.bak .lighthouserc.cjs.bak`).

    **Verification after edit:**

    1. `npm run build` exits 0 with `[check-brand] 7/7 checks passed`
    2. `grep -r "yaroslavpetrukha.github.io/vugoda-website" index.html .lighthouserc.cjs` returns NO MATCHES (replacement complete)
    3. `grep -r "<account>.github.io/vugoda-website" index.html .lighthouserc.cjs` returns the expected 9 occurrences
    4. The `og:url`, `og:image`, `twitter:image`, and `canonical` URLs all resolve to the new account's GH Pages
    5. The Lakeview external link in `src/content/mobile-fallback.ts` and `src/data/projects.ts` STILL points to `https://yaroslavpetrukha.github.io/Lakeview/` (this is the Lakeview product site owned by Yaroslav, separate from the corporate site)

    ### Why this is hardcoded in v1 (and not env-driven)

    Per Phase 6 CONTEXT.md §D-26: env-driven URLs (e.g., reading from `OG_URL` env var, with `vite.config.ts` `transformIndexHtml` hook to substitute at build time) are deferred to v2. Trade-offs:

    | Hardcoded (v1, current) | Env-driven (v2, deferred) |
    |-------------------------|---------------------------|
    | Simple — visible in source, auditable, no Vite plugin gymnastics | More flexible — one-PR account/domain swap, but adds a build-time templating layer |
    | One-time edit if account differs (this checklist) | Zero edits per environment but need to set `OG_URL=...` in CI + local dev |
    | Sufficient for a 5-URL demo handoff | Useful when adding custom domain (v2 INFR2-02) |

    The recommended migration trigger is the v2 custom domain switch — at that point `og:url` etc. will move from `*.github.io` to `vugoda.com.ua` (or similar) and an env var is the natural way to manage the change.

    ## Phase 7 will extend this document

    Phase 7 (post-deploy QA & client handoff) ships the 8 KOНЦЕПЦІЯ-САЙТУ.md §11 open items in this same file:

    - Phone (`—` placeholder)
    - Юр. адреса (`—` placeholder)
    - Pipeline-4 фінальна назва (currently «Без назви»)
    - Model-Б stage-bucket confirmation
    - Methodology §8 blocks 2/5/6 verification (currently flagged ⚠)
    - Slug transliteration: `maietok` vs `maetok` for Маєток Винниківський
    - «NTEREST» without «I» — confirm or reject
    - Етно Дім вул. Судова — confirm or correct address

    These are NOT Phase 6 scope — Phase 6 ships the GitHub-account confirmation only.
    ```

    File length: ~85 lines.

    Doc-block self-screen on the markdown:
    - Forbidden lexicon: NO Pictorial/Rubikon/Пикторіал/Рубікон (zero matches)
    - Hex literals: NO `#XXXXXX` (zero in markdown body)
    - Placeholder tokens: the markdown contains literal text «Без назви» and «—» — these are NOT `{{...}}` Mustache pairs. The `<account>` substitution placeholder uses single-brace angle-bracket convention, NOT `{{...}}`. Verified zero matches for `\{\{[^}]*\}\}` in the document.
    - Inline transition: not applicable
    - Import boundaries: not applicable
    - Note: `docs/` is OUT of all check-brand scopes (the script scans dist/ and src/ only); this file is reference documentation
  </action>
  <verify>
    <automated>test -d docs && test -f docs/CLIENT-HANDOFF.md && grep -q "GitHub-account confirmation" docs/CLIENT-HANDOFF.md && grep -q "yaroslavpetrukha" docs/CLIENT-HANDOFF.md && grep -q "index.html" docs/CLIENT-HANDOFF.md && grep -q ".lighthouserc.cjs" docs/CLIENT-HANDOFF.md && grep -q "9 line changes across 2 files" docs/CLIENT-HANDOFF.md && grep -q "Phase 7" docs/CLIENT-HANDOFF.md && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -d docs` exits 0
    - `test -f docs/CLIENT-HANDOFF.md` exits 0
    - `grep -c "GitHub-account confirmation" docs/CLIENT-HANDOFF.md` returns ≥ 1
    - `grep -c "yaroslavpetrukha" docs/CLIENT-HANDOFF.md` returns ≥ 4 (referenced multiple times in the body — line shapes + sed command)
    - `grep -c "index.html" docs/CLIENT-HANDOFF.md` returns ≥ 1 (file path listed)
    - `grep -c ".lighthouserc.cjs" docs/CLIENT-HANDOFF.md` returns ≥ 1
    - `grep -c "9 line changes across 2 files" docs/CLIENT-HANDOFF.md` returns 1 (exact total stated)
    - `grep -c "Phase 7" docs/CLIENT-HANDOFF.md` returns ≥ 1 (forward reference to extension)
    - `grep -cE '\\{\\{[^}]*\\}\\}' docs/CLIENT-HANDOFF.md` returns 0 (no Mustache placeholders — file uses `<account>` and «—» which don't match the regex)
    - `npm run build` exits 0 with `[check-brand] 7/7 checks passed` (no regression — docs/ is out of all check scopes)
  </acceptance_criteria>
  <done>
    - `docs/CLIENT-HANDOFF.md` exists with the GitHub-account confirmation item documented
    - Lists the 4 hardcoded-URL occurrences in index.html + 5 in .lighthouserc.cjs (9 total) with a copy-paste-ready `sed` command for a one-PR swap
    - References v2 env-driven URLs as the future migration path
    - Forward-references Phase 7's planned extension with the 8 §11 items
    - Phase 7 will read this file and extend it; Phase 6 closes here
  </done>
</task>

</tasks>

<verification>
- All 3 new files exist: `.lighthouserc.cjs`, `.github/workflows/lighthouse.yml`, `docs/CLIENT-HANDOFF.md`
- `.lighthouserc.cjs` loads as CommonJS, contains 5 URLs + 4 category assertions + incognito + numberOfRuns:1
- `.github/workflows/lighthouse.yml` is valid YAML, has separate concurrency group `lighthouse-pages`, triggers via `workflow_run` after `Deploy to Pages` succeeds, runs lhci autorun + hash-fragment smoke check + uploads artifact
- `docs/CLIENT-HANDOFF.md` documents the GitHub-account swap procedure with `sed` command + 9 total line changes
- `.github/workflows/deploy.yml` is UNCHANGED by Phase 6 (RESEARCH §5 — separate file decision)
- `npm run build` exits 0 with `[check-brand] 7/7 checks passed` (full Phase 6 build green)
- Manual verification (deferred to actual deploy): after `git push origin main`, verify:
  - `Deploy to Pages` workflow runs and succeeds
  - `Lighthouse Audit` workflow auto-triggers via workflow_run, runs to completion
  - All 5 URLs in lhci report have `requestedUrl` with `#` preserved (smoke check passes)
  - All 4 category scores ≥ 0.9 on each of 5 URLs (lhci PASS)
  - `.lighthouseci/` artifact uploaded for Phase 7 archive
  - Tier 1 manual UAT (per CONTEXT.md D-31): incognito DevTools Lighthouse Desktop run on each of 5 URLs; save 5 PNG screenshots to `.planning/phases/06-performance-mobile-fallback-deploy/lighthouse/{route}.png`
  - Paste root URL into Telegram + Slack + Viber → clean unfurl with «ВИГОДА — Системний девелопмент» title + description + 1200×630 OG image
</verification>

<success_criteria>
- [ ] `.lighthouserc.cjs` ships D-31 verbatim (5 URLs, 4 categories, incognito, numberOfRuns:1, temporary-public-storage upload)
- [ ] `.github/workflows/lighthouse.yml` exists as a SEPARATE file (RESEARCH §5 deviation from D-34, documented)
- [ ] Workflow uses `workflow_run` trigger on `Deploy to Pages` and own concurrency group `lighthouse-pages`
- [ ] Workflow runs `npx lhci autorun` + post-run hash-fragment smoke check + uploads artifact
- [ ] `docs/CLIENT-HANDOFF.md` documents the GitHub-account confirmation item with the 9 line-edit list and copy-paste `sed` command
- [ ] `.github/workflows/deploy.yml` is UNCHANGED (Phase 1 D-15 shape preserved)
- [ ] `npm run build` exits 0 with `[check-brand] 7/7 checks passed`
- [ ] Phase 6 closure: when this plan completes, all 5 phase requirements (QA-01 SC#1, QA-02 SC#3, QA-03 SC#2, DEP-01 SC#4, DEP-02 SC#5) have either an automated gate (5/7 of the gates target QA-02 directly) OR a documented UAT path (QA-01 and parts of QA-03 are UAT-only per VALIDATION.md)
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-09-lhci-and-handoff-SUMMARY.md` documenting:
- Verbatim final form of `.lighthouserc.cjs` (~70 lines)
- Verbatim final form of `.github/workflows/lighthouse.yml` (~80 lines)
- Verbatim final form of `docs/CLIENT-HANDOFF.md` (~85 lines)
- **DEVIATION DOCUMENTATION**: explicit statement that Phase 6 deviated from CONTEXT.md D-34 (single new job in deploy.yml) in favor of RESEARCH §5 + §Pitfall 5 (separate lighthouse.yml file). Cite RESEARCH § as the rationale source. Note that this deviation is recorded in the workflow file's top comment, this SUMMARY, and PHASE-CONTEXT.md if Phase 7 extends.
- Confirmation that all Phase 6 success criteria gates are wired:
  - SC#1 (mobile fallback): UAT-only per VALIDATION.md — DevTools resize 1023↔1024 verifies clean swap
  - SC#2 (OG meta + unfurl): index.html grep gates from plan 06-06 (could optionally add 8th `metaPresence()` check to scripts/check-brand.ts; planner decision: SKIP for v1 to keep plan scope tight; add in Phase 7 if regression risk emerges)
  - SC#3 (Lighthouse + budget): bundleBudget + heroBudget (plan 06-08) + lhci autorun (this plan)
  - SC#4 (deploy.yml uses official actions): inherited from Phase 1 D-15 — verified by absence of `gh-pages` in package.json + workflow's `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` references
  - SC#5 (live URL + deep-link works): Tier 2 lhci must reach all 5 URLs (HTTP 200 implied by lhci collect step) + Tier 1 manual incognito verification (D-37 checklist)
- Note that Phase 7 picks up: keyboard walkthrough, axe-core a11y audit, Tier 1 Lighthouse archive, hard-refresh deep-link tests on production URL, and the remaining 8 §11 client items appended to docs/CLIENT-HANDOFF.md
</output>
