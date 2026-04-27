---
phase: 07-post-deploy-qa-client-handoff
plan: 01
subsystem: testing
tags: [a11y, axe-core, wcag, vite-preview, chromedriver]

# Dependency graph
requires:
  - phase: 06-performance-mobile-fallback-deploy
    provides: dist/ + vite preview + 5 production hash-routes
provides:
  - One-shot a11y audit pipeline (npm run audit:a11y) producing 5 per-route JSONs + axe-summary.md
  - Phase 7 SC#3 (axe part) closure evidence: zero critical + zero serious violations across 5 routes
affects: [07-09-verification-doc-and-uat-closure]

# Tech tracking
tech-stack:
  added:
    - "@axe-core/cli@^4.11.2 (devDep, one-shot audit only — D-17 forbids lifecycle wiring)"
    - "chromedriver@^147.0.4 (devDep, matched to locally installed Chrome 147 to bypass axe-core/cli's bundled 148-only driver)"
  patterns:
    - "One-shot audit script registered via `audit:*` npm script entry — mirrors scripts/list-construction.ts (Phase 2 D-22)"
    - "Evidence directory pattern at .planning/phases/{phase}/{axis}/{slug}.{json,md}"

key-files:
  created:
    - "scripts/axe-audit.mjs (114 lines, ESM .mjs, vite-preview spawner + 5-route axe iterator + summary aggregator)"
    - ".planning/phases/07-post-deploy-qa-client-handoff/axe/{home,projects,zhk-etno-dim,construction-log,contact}.json"
    - ".planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md"
  modified:
    - "package.json (audit:a11y script + 2 devDeps)"
    - "package-lock.json"

key-decisions:
  - "Auto-fix Rule 3: poll localhost (not 127.0.0.1) — vite preview binds IPv6 ::1 first on Node 25, IPv4 dial never connects"
  - "Auto-fix Rule 3: URL composition uses Vite base /vugoda-website/ + hash, otherwise dist/index.html 404 at /"
  - "Auto-fix Rule 3: pin chromedriver@^147 + pass --chromedriver-path; @axe-core/cli ships ChromeDriver 148 which fails on Chrome 147"
  - "Auto-fix Rule 3: pass relative --save path; @axe-core/cli joins absolute paths onto cwd, doubling the prefix"
  - "WCAG 2.1 A + AA tag scope (D-15) — excludes wcag2aaa, best-practice, experimental"
  - "Critical + Serious threshold (D-16) — strictly stronger than SC#3's wording 'zero critical'"

patterns-established:
  - "One-shot audit script: spawn server → TCP-poll port → iterate routes via spawnSync → write evidence → tear down → exit per threshold"
  - "Evidence triple: per-route machine-readable JSON + aggregate markdown summary + npm-script entry"
  - "Local chromedriver pin pattern when CLI tools bundle a different major than the dev's installed browser"

requirements-completed: [QA-04]

# Metrics
duration: 10min
completed: 2026-04-27
---

# Phase 7 Plan 01: Axe-script and devDep Summary

**One-shot a11y audit pipeline (`npm run audit:a11y`) using @axe-core/cli + matched chromedriver; 5 production hash-routes audited under WCAG 2.1 A+AA against vite preview localhost; zero critical and zero serious violations on every route.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-27T05:31:01Z
- **Completed:** 2026-04-27T05:41:19Z
- **Tasks:** 3
- **Files modified/created:** 9 (package.json + package-lock.json + scripts/axe-audit.mjs + 5 JSONs + axe-summary.md)

## Accomplishments

- `@axe-core/cli@^4.11.2` and `chromedriver@^147.0.4` added as devDependencies; `audit:a11y` npm script registered; existing `prebuild`/`postbuild` chains untouched per D-17
- `scripts/axe-audit.mjs` (114 lines) spawns `vite preview --port 4173`, TCP-polls the port (≤30s), iterates the 5 production hash-routes (`/`, `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`), shells `npx axe ... --tags wcag2a,wcag2aa --save {slug}.json --chromedriver-path ...` per route, aggregates results into `axe-summary.md`, tears down the preview, and exits non-zero if any route reports a critical or serious violation (D-16 threshold)
- 5 JSON evidence files committed at `.planning/phases/07-post-deploy-qa-client-handoff/axe/` — every route reports `0 violations`; `axe-summary.md` table shows 0/0/0/0 across all severities for all 5 routes; script exit code 0
- Phase 7 SC#3 (axe-core part) closed with machine-readable evidence; ready for citation in Plan 07-09 verification doc

## Task Commits

1. **Task 1: Install @axe-core/cli devDep + add audit:a11y npm script** — `0be5e6c` (chore)
2. **Task 2: Author scripts/axe-audit.mjs orchestrator** — `213ad65` (feat)
3. **Task 3: Run audit:a11y, archive 5 JSONs + axe-summary.md, verify exit code** — `12d4d03` (test)

## Files Created/Modified

- `scripts/axe-audit.mjs` — one-shot audit orchestrator, ESM .mjs (114 lines)
- `package.json` — added `audit:a11y` script entry + `@axe-core/cli@^4.11.2` + `chromedriver@^147.0.4` devDeps
- `package-lock.json` — locked versions for the two new devDeps + transitive packages
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/home.json` — axe-core JSON evidence (0 violations)
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/projects.json` — axe-core JSON evidence (0 violations)
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/zhk-etno-dim.json` — axe-core JSON evidence (0 violations)
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/construction-log.json` — axe-core JSON evidence (0 violations)
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/contact.json` — axe-core JSON evidence (0 violations)
- `.planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md` — per-route violation aggregate table (5 rows × 4 severity columns) + PASS footer

## Decisions Made

- **`@axe-core/cli` is one-shot (D-17 reaffirmed).** No lifecycle wiring, no deploy.yml gate. Promotion to permanent CI a11y gate is an explicit v2 trigger (deferred ideas).
- **WCAG 2.1 A + AA tag scope (D-15).** Excluded `wcag2aaa` (project doesn't claim AAA), `best-practice` (subjective noise), `experimental` (false positive risk).
- **Critical + Serious threshold (D-16).** Strictly stronger than SC#3's literal wording «zero critical». Missing alt-text scores serious not critical, so critical-only would silently pass that regression class. Moderate/minor stay in JSONs as record but don't fail the script.
- **Local chromedriver pin (not in plan, deviation).** `@axe-core/cli@4.11.2` ships ChromeDriver 148 which refuses to attach to Chrome 147. Rather than bumping the user's Chrome (out of project scope) or migrating to puppeteer-bundled headless Chromium (heavier, would require swap from `@axe-core/cli` to a different driver), the script pins `chromedriver@^147` as a devDep and passes `--chromedriver-path` when the binary is present at `node_modules/chromedriver/lib/chromedriver/chromedriver`. The `existsSync` guard means the script also works on machines where `npx browser-driver-manager install chrome` was run (CI happy path).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Port poll never connects on Node 25 + macOS**
- **Found during:** Task 3 (first run of `npm run audit:a11y`)
- **Issue:** `waitForPort` polled `127.0.0.1:4173` but `vite preview` binds to IPv6 `::1` first. On Node 25 + macOS the IPv4 connect attempt timed out at 30 s.
- **Fix:** Changed `sock.connect(port, '127.0.0.1')` → `sock.connect(port, 'localhost')` so DNS resolves to whichever family is listening.
- **Files modified:** `scripts/axe-audit.mjs`
- **Verification:** Re-run hit the port instantly; 5 routes audited successfully.
- **Committed in:** `12d4d03` (Task 3 commit)

**2. [Rule 3 — Blocking] URL composition missing Vite base path**
- **Found during:** Task 3 (first run with port poll fixed)
- **Issue:** Plan's URL template `http://localhost:4173/#/{path}` assumed root-mounted SPA. Vite config sets `base: '/vugoda-website/'`, so the production-shape URL is `http://localhost:4173/vugoda-website/#/{path}`. Hitting `/` returns a 302 to `/vugoda-website/` and axe-core would have audited the redirect target, not the intended route.
- **Fix:** Added `PREVIEW_BASE = '/vugoda-website/'` constant and updated the URL template to interpolate it before `#`.
- **Files modified:** `scripts/axe-audit.mjs`
- **Verification:** `npm run audit:a11y` ran each of the 5 hash-routes against the correctly-prefixed URL; SPA hash routing exercised; 0 violations across the board.
- **Committed in:** `12d4d03` (Task 3 commit)

**3. [Rule 3 — Blocking] ChromeDriver / Chrome version mismatch**
- **Found during:** Task 3 (first run that actually reached axe-core)
- **Issue:** `@axe-core/cli@4.11.2` bundles ChromeDriver 148 which threw `session not created: This version of ChromeDriver only supports Chrome version 148. Current browser version is 147.0.7727.102` for all 5 routes, leaving the JSON files unwritten.
- **Fix:** Installed `chromedriver@^147.0.4` as a devDependency (locally yields ChromeDriver 147.0.7727.57) and passed `--chromedriver-path node_modules/chromedriver/lib/chromedriver/chromedriver` when the binary exists. Guarded with `existsSync` so other environments fall back to the bundled driver.
- **Files modified:** `scripts/axe-audit.mjs`, `package.json`, `package-lock.json`
- **Verification:** Re-run produced `0 violations found!` per route and successfully wrote 5 JSON files.
- **Committed in:** `12d4d03` (Task 3 commit)

**4. [Rule 1 — Bug] Absolute --save path doubled cwd prefix**
- **Found during:** Task 3 (chromedriver pinned, axe ran but ENOENT on save)
- **Issue:** `@axe-core/cli` interprets `--save` as a path relative to the working directory and concatenates absolute paths after `cwd`, producing `/Users/admin/.../vugoda-website/Users/admin/.../vugoda-website/.planning/.../home.json` and failing `ENOENT`.
- **Fix:** Compute `outFileRel = path.relative(REPO_ROOT, outFile)` and pass that to `--save` instead of the absolute path.
- **Files modified:** `scripts/axe-audit.mjs`
- **Verification:** All 5 JSONs saved at the correct `.planning/.../axe/{slug}.json` location; `jq empty` parses each cleanly.
- **Committed in:** `12d4d03` (Task 3 commit)

---

**Total deviations:** 4 auto-fixed (3 blocking, 1 bug — all under Rule 1/3 scope)
**Impact on plan:** All 4 fixes were inside the boundary of the plan's own task (run the audit and archive evidence) and required to satisfy the plan's own `<verify>` block. None of them altered the plan's stated artifact list, schema, or threshold semantics. No scope creep.

## Issues Encountered

None beyond the four auto-fixed blockers above. axe-core itself reported 0 violations on first successful run, so no a11y regressions to triage.

## User Setup Required

None — the audit pipeline is fully local and one-shot. The first `npm run audit:a11y` run downloads no browser binaries (the locally-installed Chrome 147 is reused via `chromedriver@^147`); subsequent runs are network-free.

## Next Phase Readiness

- Phase 7 SC#3 (axe-core part) is closed with machine-readable evidence; Plan 07-09 verification doc can cite `axe-summary.md` directly.
- The 5 JSONs preserve the full axe-core report shape (rules, helpUrl, nodes, etc.) so any future regression triage has the structured starting point.
- `audit:a11y` is available as a one-shot dev tool for any future content edit (post-handoff cycle): re-run before redeploy to confirm no regression.
- `chromedriver@^147` devDep should be bumped in lockstep with the developer's local Chrome whenever the major version changes; this is a known maintenance touchpoint, not a permanent sticky.

---
*Phase: 07-post-deploy-qa-client-handoff*
*Completed: 2026-04-27*

## Self-Check: PASSED

- All 8 expected files present (script + 5 JSONs + summary md + SUMMARY.md)
- All 3 task commits present in git history (`0be5e6c`, `213ad65`, `12d4d03`)
- `npm run audit:a11y` exits 0; `axe-summary.md` reports `PASS — zero critical, zero serious` across all 5 routes
