---
phase: 06-performance-mobile-fallback-deploy
plan: 09
subsystem: infra
tags: [lighthouse-ci, github-actions, workflow_run, ci-gate, client-handoff, deploy]

requires:
  - phase: 06
    provides: "@lhci/cli@^0.15.1 installed (06-03); 5 routes lazy-split with budgets enforced (06-05, 06-08); OG meta + apple-touch wired (06-06); page titles per route (06-07); MobileFallback.tsx active <1024px (06-04)"
  - phase: 01
    provides: ".github/workflows/deploy.yml (Deploy to Pages workflow with concurrency: pages, cancel-in-progress: true)"

provides:
  - ".lighthouserc.cjs — Lighthouse CI config with 5 locked production URLs, 4 category assertions at minScore 0.9, --incognito chromeFlags, numberOfRuns: 1"
  - ".github/workflows/lighthouse.yml — separate Lighthouse Audit workflow (NOT a job in deploy.yml) triggered by workflow_run after Deploy to Pages succeeds; own concurrency group lighthouse-pages with cancel-in-progress: false"
  - "docs/CLIENT-HANDOFF.md — pre-deploy checklist with GitHub-account confirmation item documenting the 9-line edit procedure if account ≠ yaroslavpetrukha"
  - "Hash-fragment URL fidelity smoke check (RESEARCH Open Q1) inside lighthouse.yml — asserts ≥4 of 5 lhr-*.json files preserve fragment in requestedUrl"
  - "30-day .lighthouseci/ artifact upload for Phase 7 archival"

affects: [phase-07-post-deploy-qa-handoff]

tech-stack:
  added:
    - "@lhci/cli configuration via .lighthouserc.cjs (binary already installed in 06-03)"
    - "GitHub Actions workflow_run trigger pattern (chains lhci after Deploy to Pages)"
  patterns:
    - "Separate workflow files per concern (deploy vs audit) when concurrency-group requirements diverge — deploy uses cancel-in-progress: true (only newest deploy matters), lhci uses cancel-in-progress: false (every score matters)"
    - "Post-run smoke check for tool-output fidelity (RESEARCH Open Q1 mitigation): assert lhci preserved hash fragments rather than silently auditing root 5×"
    - "CommonJS config (.cjs) when host package.json declares type: module — avoids the --js-config=esm flag dance"
    - "Forward-reference doc pattern: this plan's CLIENT-HANDOFF.md ships the 1 Phase 6 item AND lists the 8 Phase 7 §11 items by name, so Phase 7 only needs to extend not restructure"

key-files:
  created:
    - ".lighthouserc.cjs (61 lines, root)"
    - ".github/workflows/lighthouse.yml (94 lines)"
    - "docs/CLIENT-HANDOFF.md (61 lines)"
  modified: []

key-decisions:
  - "RESEARCH §5 deviation from CONTEXT D-34 ratified at execution time: lighthouse.yml ships as a SEPARATE workflow file (not appended to deploy.yml). Rationale documented in workflow's top comment + this SUMMARY."
  - "workflow_run + cancel-in-progress: false for lighthouse-pages concurrency group — never cancels mid-run lhci jobs (every score must be auditable). Worst case: queued runs."
  - "ref: github.event.workflow_run.head_sha || github.sha — checkout the just-deployed SHA when triggered by workflow_run, fallback to github.sha for workflow_dispatch"
  - "workflow_dispatch added as fallback trigger for manual lhci runs against arbitrary commits"
  - "Hash-fragment fidelity smoke check (RESEARCH Open Q1) implemented as bash + jq + grep — fails workflow with descriptive error if lhci silently dropped fragments"
  - ".lighthouseci/ uploaded as workflow artifact (30-day retention) for Phase 7 Tier 1 archive"
  - "CLIENT-HANDOFF.md uses sed-with-backup-suffix pattern (.bak) for the account-swap one-liner — recoverable typo path"
  - "CLIENT-HANDOFF.md explicitly distinguishes vugoda-website hardcoded URLs from the EXTERNAL Lakeview site links (yaroslavpetrukha.github.io/Lakeview/) which do NOT change with this account swap"

patterns-established:
  - "Workflow chaining pattern: secondary workflows declare on.workflow_run pointing at upstream workflow's name, gate jobs with if: github.event.workflow_run.conclusion == 'success'"
  - "CI tool config in .cjs when host is type=module: 1-line module.exports wrapper, no further loader plumbing required"
  - "Pre-deploy handoff doc pattern: document the smallest set of items the user MUST confirm with the client before merging, with copy-paste verification commands"

requirements-completed: [QA-02, QA-03, DEP-01, DEP-02]

duration: 6min
completed: 2026-04-26
---

# Phase 6 Plan 09: Lighthouse CI + Client Handoff Summary

**Lhci CI gate for 5 deployed URLs (4 categories × minScore 0.9) wired via separate `Lighthouse Audit` workflow chained off `Deploy to Pages` — plus a pre-deploy CLIENT-HANDOFF.md documenting the 9-line GitHub-account swap procedure if the deployer's account ≠ yaroslavpetrukha.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-26T20:38:54Z (immediately after STATE.md mark of 06-08 complete)
- **Completed:** 2026-04-26T20:43:52Z
- **Tasks:** 3 (all `type="auto"`, no TDD, no checkpoints)
- **Files created:** 3 (`.lighthouserc.cjs`, `.github/workflows/lighthouse.yml`, `docs/CLIENT-HANDOFF.md`)
- **Files modified:** 0 (deploy.yml UNCHANGED per RESEARCH §5 deviation)

## Accomplishments

- **Lighthouse CI runtime gate live:** `.lighthouserc.cjs` ships D-31 verbatim — 5 production URLs (root + 4 hash-fragment routes), `--incognito` chromeFlags (clears Phase 5 sessionStorage between runs), `numberOfRuns: 1` (demo-grade), 4 category assertions at minScore 0.9 each (no PWA category — Lighthouse 12 removed it).
- **Separate workflow file pattern adopted:** `.github/workflows/lighthouse.yml` — own concurrency group `lighthouse-pages` (cancel-in-progress: false), `workflow_run` trigger after `Deploy to Pages` succeeds. deploy.yml stays untouched (Phase 1 D-15 shape preserved). Documented deviation from CONTEXT D-34 in workflow's top comment block.
- **Hash-fragment URL fidelity smoke check** (RESEARCH Open Q1 mitigation): bash + jq + grep over `.lighthouseci/lhr-*.json` asserts ≥4 of 5 URLs preserve `#` in `requestedUrl` — catches the silent failure mode where lhci normalizes fragments and audits home 5× instead of 5 different routes.
- **`.lighthouseci/` artifact** uploaded with 30-day retention — feeds Phase 7's Tier 1 Lighthouse archive.
- **CLIENT-HANDOFF.md** documents the GitHub-account swap procedure: 9 line edits across 2 files (4 in index.html + 5 in .lighthouserc.cjs), with copy-paste sed command and verification steps. Forward-references Phase 7's planned extension with the 8 КОНЦЕПЦІЯ-САЙТУ.md §11 open items.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create .lighthouserc.cjs (D-31 verbatim)** — `28c5cf6` (feat)
2. **Task 2: Create .github/workflows/lighthouse.yml** — `b8e2086` (feat)
3. **Task 3: Create docs/CLIENT-HANDOFF.md** — `ace4664` (docs)

**Plan metadata commit:** to be added by final-commit step (this SUMMARY + STATE + ROADMAP + REQUIREMENTS).

## Files Created/Modified

- `.lighthouserc.cjs` (61 lines) — Lighthouse CI config: 5 locked production URLs, Desktop preset, --incognito, numberOfRuns: 1, 4 category assertions at minScore 0.9, temporary-public-storage upload. CommonJS because package.json has type: module.
- `.github/workflows/lighthouse.yml` (94 lines) — Lighthouse Audit workflow: workflow_run trigger after `Deploy to Pages` succeeds + workflow_dispatch fallback; concurrency group `lighthouse-pages` with cancel-in-progress: false; runs `npx lhci autorun --config=.lighthouserc.cjs` then asserts hash-fragment URL fidelity; uploads `.lighthouseci/` artifact (30-day retention).
- `docs/CLIENT-HANDOFF.md` (61 lines) — pre-deploy checklist with GitHub-account confirmation item: hardcoded URL inventory (4 in index.html + 5 in .lighthouserc.cjs = 9 total), copy-paste sed command, verification steps, v1-vs-v2 trade-off table, forward-reference to Phase 7's §11 extension.

## Verbatim final form

### .lighthouserc.cjs

```js
/**
 * .lighthouserc.cjs — Phase 6 D-31 (locked) + RESEARCH.md §Code Examples.
 *
 * CommonJS (.cjs) is required because package.json has "type": "module" —
 * lhci's loader expects CommonJS by default.
 *
 * 5 URLs match CONTEXT D-31 verbatim. The 4 hash-fragment URLs MUST
 * preserve the fragment marker through the lhci collect → audit → store
 * pipeline. Workflow lighthouse.yml runs a smoke check after `lhci autorun`.
 *
 * numberOfRuns: 1 — demo-grade gate. If observed flake rate ≥ 2× in
 * week 1 post-deploy, planner bumps to 3.
 *
 * chromeFlags: '--incognito' — RESEARCH Pitfall 1: prevents Phase 5
 * sessionStorage 'vugoda:hero-seen' from carrying across URL runs.
 *
 * 4 category assertions only — Lighthouse 12 (used by lhci 0.15.x since
 * May 2024) removed the PWA category.
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

### .github/workflows/lighthouse.yml

Key shape (top comment elided for brevity; see file):

```yaml
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
    if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
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
          if ! ls .lighthouseci/lhr-*.json > /dev/null 2>&1; then
            echo "FAIL: no .lighthouseci/lhr-*.json files found"
            exit 1
          fi
          HASHED=$(for f in .lighthouseci/lhr-*.json; do jq -r '.requestedUrl' "$f"; done | grep -c '#' || true)
          echo "Hash-fragment URLs in lhr-*.json: $HASHED of 5 expected ≥ 4"
          if [ "$HASHED" -lt 4 ]; then
            echo "FAIL: lhci silently dropped fragments"
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

### docs/CLIENT-HANDOFF.md

Front matter and key sections:

```markdown
# Client Handoff — Pre-deploy checklist

## Item 1: GitHub-account confirmation (Phase 6 D-26 + D-38)

Hardcoded URLs point to https://yaroslavpetrukha.github.io/vugoda-website/.
If account is NOT yaroslavpetrukha:

| File | Count |
|------|-------|
| index.html (og:url, og:image, twitter:image, canonical) | 4 |
| .lighthouserc.cjs (ci.collect.url array) | 5 |

Total edits: 9 line changes across 2 files.

Sed: sed -i.bak "s/yaroslavpetrukha\.github\.io\/vugoda-website/<account>.github.io\/vugoda-website/g" index.html .lighthouserc.cjs

Lakeview external links in src/content/mobile-fallback.ts and src/data/projects.ts
do NOT change (separate Yaroslav-owned product site).

## Phase 7 will extend this document
[8 КОНЦЕПЦІЯ-САЙТУ.md §11 items listed]
```

## Decisions Made

- **Verbatim plan execution on all 3 tasks** — no TSX/YAML/MD diverged from plan `<action>` blocks.
- **DEVIATION FROM CONTEXT.md D-34 ratified:** CONTEXT D-34 said «.github/workflows/deploy.yml gets ONE new job: lighthouse depending on deploy». Phase 6 planner (this plan's frontmatter `must_haves.truths` line 6 + RESEARCH §5 + §Pitfall 5) chose separate-workflow-file path instead. Rationale: deploy.yml's `concurrency: { group: pages, cancel-in-progress: true }` would cancel mid-run lhci jobs during merge bursts, masking real regressions. Separate file gets its own concurrency group `lighthouse-pages` with `cancel-in-progress: false` so every score is auditable. **This deviation is recorded in 3 places:** (1) the workflow file's top comment block, (2) this SUMMARY's accomplishments + decisions sections, (3) the plan's frontmatter `must_haves.truths` (planner-side).
- **Hash-fragment URL fidelity smoke check shipped inside the workflow** (not deferred to Phase 7) — RESEARCH Open Q1 caught early: lhci could silently normalize fragments and audit `https://.../vugoda-website/` 5×, returning identical scores for all "5 routes" without anyone noticing. Bash + jq + grep gate fails the workflow with a descriptive error before scores are trusted.
- **`workflow_dispatch` added as fallback trigger** — lets the user manually run lhci against arbitrary commits without waiting for a deploy. The `if:` condition handles both event types via `github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success'`.
- **`ref: github.event.workflow_run.head_sha || github.sha`** — checkout the SHA of the just-deployed commit when triggered by workflow_run; fallback to `github.sha` for workflow_dispatch (where head_sha is null). Ensures lhci always audits the same code that was deployed.
- **`.lighthouseci/` artifact uploaded with `if: always()`** — even if lhci fails (score regression OR hash-fragment fidelity failure), the report is preserved for forensic review. 30-day retention matches GitHub's default for upload-artifact@v4.
- **CLIENT-HANDOFF.md uses sed-with-backup-suffix pattern** (`-i.bak`) — recoverable typo path. Backup files removed only after successful build.
- **CLIENT-HANDOFF.md explicitly distinguishes the two URL types:** the 9 hardcoded URLs to be edited live in index.html + .lighthouserc.cjs (corporate site), while the EXTERNAL Lakeview product site URLs in src/content/mobile-fallback.ts and src/data/projects.ts do NOT change (those point to Yaroslav's separate Lakeview product, not the vugoda-website corporate hub).
- **Doc-block pre-screen worked first try, ZERO Rule 3 self-consistency fixes needed** — extends the Phase 5 streak (05-01-doc-only, 05-03, 05-08) into Phase 6 (06-01..06-08 not surveyed here, but 06-09 is clean). Markdown body uses `<account>` placeholder (not `{{account}}`) and em-dash `—` (not `{{phone}}`); no Mustache-pattern matches.

## Deviations from Plan

None - plan executed exactly as written.

(The CONTEXT D-34 → RESEARCH §5 deviation was already RATIFIED at planning time inside the plan's `must_haves.truths` line 6 + objective body — this is NOT a runtime deviation. Plan was executed verbatim.)

## Issues Encountered

- **Pre-existing prebuild race (NOT introduced by 06-09):** confirmed by Plans 06-01..06-04 deferred-items + Plan 06-04 decisions: concurrent prebuild scripts from sibling parallel-wave executors race on `_opt/` writes. **Not relevant to this plan** — Wave 4 runs solo, all upstream Wave 1–3 outputs are committed, and this plan creates 3 NEW files that are out of `prebuild`/`postbuild` scope (`.cjs`, `.yml`, `.md`). Verification proxy used: `npx tsc --noEmit` (PASS) + `npx tsx scripts/check-brand.ts` (7/7 PASS, bundle 133.7 KB gzipped — 67% of 200 KB budget). Full `npm run build` skipped to avoid the race; not needed because the new files don't affect the build pipeline.

## Phase 6 Closure — All 5 Success Criteria Wired

This plan completes Phase 6. Mapping each Phase 6 Roadmap Success Criterion to its enforcing gate:

- **SC#1 (mobile fallback `<1024px`):** UAT-only per VALIDATION.md — DevTools resize 1023↔1024 verifies clean swap to MobileFallback.tsx (Plan 06-04). Phase 7 owns the live-browser confirmation against deployed URL.
- **SC#2 (OG meta + Twitter Card + canonical + theme-color + favicon + clean unfurl):** index.html grep gates from Plan 06-06 + scripts/build-og-image.mjs prebuild. Optional 8th `metaPresence()` check on scripts/check-brand.ts deferred (planner choice — keep plan scope tight; add in Phase 7 if regression risk emerges from real PR activity).
- **SC#3 (Lighthouse desktop ≥ 90 + hero ≤ 200 KB + JS ≤ 200 KB gzipped):** `bundleBudget` + `heroBudget` (Plan 06-08, postbuild + deploy.yml) + `lhci autorun` (this plan, lighthouse.yml after Deploy to Pages succeeds). Bundle currently 133.7 KB gzipped (well under 200 KB).
- **SC#4 (deploy.yml uses official actions, NOT gh-pages npm):** inherited from Phase 1 D-15 — verified by absence of `gh-pages` in package.json + workflow uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`.
- **SC#5 (live URL + deep-link works):** Tier 2 lhci (this plan) must reach all 5 URLs (HTTP 200 implied by lhci collect step) + Tier 1 manual incognito verification per CONTEXT.md D-37 checklist (deferred to Phase 7).

## Next Phase Readiness

**Phase 6 complete — 9/9 plans done.** All 5 phase requirements (QA-01, QA-02, QA-03, DEP-01, DEP-02) have either an automated gate (5/7 of the gates target QA-02 directly: bundleBudget, heroBudget, denylistTerms, paletteWhitelist, placeholderTokens — plus the new lhci CI workflow) OR a documented UAT path (QA-01 mobile-fallback DevTools resize + parts of QA-03 social-unfurl in Telegram/Slack/Viber).

**Ready for:**
- `git push origin main` — triggers `Deploy to Pages` → on success triggers `Lighthouse Audit` workflow_run chain
- Phase 7 (post-deploy QA & client handoff) picks up: keyboard walkthrough, axe-core a11y audit, Tier 1 Lighthouse archive (visual capture per route from `.lighthouseci/` artifact OR DevTools manual run), hard-refresh deep-link tests on production URL, and the remaining 8 §11 client items appended to docs/CLIENT-HANDOFF.md (already forward-referenced in this plan's CLIENT-HANDOFF.md).

**Blockers:** None.

## Self-Check: PASSED

Verification of claims (all 3 created files + all 4 commits exist):

- `.lighthouserc.cjs` — FOUND (61 lines, loads as CommonJS, `c.ci.collect.url.length === 5`, all 4 category assertions present at minScore 0.9, no `categories:pwa`)
- `.github/workflows/lighthouse.yml` — FOUND (valid YAML per `python3 -c "import yaml; yaml.safe_load(open(...))"`, `name: Lighthouse Audit`, `workflow_run` + `workflow_dispatch` triggers, concurrency group `lighthouse-pages`, `cancel-in-progress: false`, `npx lhci autorun --config=.lighthouserc.cjs`, hash-fragment smoke check via `lhr-*.json`, `actions/upload-artifact@v4` with 30-day retention)
- `docs/CLIENT-HANDOFF.md` — FOUND (61 lines, GitHub-account confirmation section, 8 yaroslavpetrukha references, sed command, verification steps, Phase 7 forward-reference, 0 Mustache placeholder matches)
- Commit `28c5cf6` (Task 1) — FOUND in git log
- Commit `b8e2086` (Task 2) — FOUND in git log
- Commit `ace4664` (Task 3) — FOUND in git log
- `.github/workflows/deploy.yml` — UNCHANGED (`git diff` returns 0 lines)

---
*Phase: 06-performance-mobile-fallback-deploy*
*Completed: 2026-04-26*
