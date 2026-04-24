---
phase: 02-data-layer-content
plan: 05
subsystem: infra
tags: [ci, check-brand, grep, postbuild, github-actions, tsx, brand-invariants]

# Dependency graph
requires:
  - phase: 02-01-foundation-types
    provides: tsconfig.scripts.json, tsx runner, scripts/ directory layout
  - phase: 02-02-projects-and-fixtures
    provides: src/data/projects.ts, src/data/projects.fixtures.ts (for boundary scans)
  - phase: 02-03-construction-and-copy-script
    provides: scripts/copy-renders.ts (prebuild chain), src/data/construction.ts
  - phase: 02-04-content-modules
    provides: src/content/{methodology,values,company,placeholders}.ts (for boundary + denylist scans)
provides:
  - scripts/check-brand.ts — 4-check CI guard (denylist, palette, placeholder, import-boundary)
  - package.json postbuild hook wiring check-brand into every npm run build
  - .github/workflows/deploy.yml "Check brand invariants" step before artifact upload
  - Enforcement of D-25 silent-displacement rule (Pictorial/Rubikon never in dist/ or src/)
  - Enforcement of D-26 6-hex palette whitelist in src/**/*.{ts,tsx,css}
  - Enforcement of D-27 placeholder-token ban in dist/ (paired {{...}} + TODO + FIXME)
  - Enforcement of D-32 + D-09 import boundaries (components↛pages, data↛react/motion, content↛react/motion/pages, components-no-raw-/renders/, pages+components↛fixtures)
affects: [phase-03-brand-primitives, phase-04-portfolio-zhk-log-contact, phase-05-animations-polish, phase-06-performance-deploy, phase-07-post-deploy-qa]

# Tech tracking
tech-stack:
  added: []  # No new npm deps — node:child_process + node:fs only
  patterns:
    - "Shell-out grep with `|| true` suffix + output.trim() check — BSD/GNU exit-code portability"
    - "Aggregate exit-code: every check returns boolean, final process.exit(1) if any false"
    - "Existence guards (existsSync) for graceful pass-when-scope-absent — manual runs without prior build"
    - "Paired brace regex `\\{\\{[^}]*\\}\\}` for placeholder tokens — avoids minified JS/CSS false positives"
    - "Overlapping safety nets: postbuild (dev gate) + named CI step (log visibility)"

key-files:
  created:
    - scripts/check-brand.ts
    - .planning/phases/02-data-layer-content/02-05-SUMMARY.md
  modified:
    - package.json — added postbuild script
    - .github/workflows/deploy.yml — inserted "Check brand invariants" step
    - src/data/projects.ts — rephrased comment to remove Pictorial/Rubikon literals

key-decisions:
  - "Tightened placeholder regex from bare `{{|}}` to paired `{{[^}]*}}` — bare-brace regex false-positives on ~318 minified JS `}}` and ~18 minified CSS `}}` per Vite build"
  - "Rephrased src/data/projects.ts:18 self-referential comment — even inside a comment about the silent-displacement rule, naming the legacy source projects violates D-25"
  - "Script lives in scripts/ which is intentionally OUT of scope for all 4 checks (scope is dist/ + src/ only) — allows regex constants to reference disallowed literals without self-triggering"
  - "No new npm deps — node:child_process + node:fs cover all needs; ESLint explicitly rejected per STACK.md 'SKIP for MVP' + Plan 02-02 boundary-enforcement-via-grep pattern"
  - "Kept double-coverage per D-28: postbuild is the enforcing gate, named CI step is for PR log visibility — both intentional"

patterns-established:
  - "Grep-based invariant checks over ESLint — simpler, no config, script-level readable"
  - "Full-pair Mustache matching for placeholder leaks — paired braces distinguish real tokens from minifier artifacts"
  - "Dev-script quarantine — scripts/*.ts intentionally excluded from src/ scans so regex constants can reference denylist literals"
  - "Regression-via-forge-and-remove — prove a check actually catches violations by writing a throwaway file, running, confirming FAIL, deleting, re-running, confirming PASS"

requirements-completed: [QA-04]

# Metrics
duration: 4min
completed: 2026-04-24
---

# Phase 2 Plan 5: Check-Brand CI Summary

**4-check grep-based brand-invariant guard wired into npm run build postbuild + GitHub Pages deploy workflow — blocks any silent-displacement leak, palette drift, leaked `{{placeholder}}`, or import-boundary violation from reaching the artifact upload**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-24T19:21:59Z
- **Completed:** 2026-04-24T19:25:45Z
- **Tasks:** 2
- **Files created:** 1 (scripts/check-brand.ts, 195 lines)
- **Files modified:** 3 (package.json, .github/workflows/deploy.yml, src/data/projects.ts)

## Accomplishments

- **scripts/check-brand.ts (195 lines, 0 npm deps)** — 4 check functions with aggregate exit code:
  - `denylistTerms()` — case-insensitive scan of dist/+src/ for Pictorial|Rubikon|Пикторіал|Рубікон
  - `paletteWhitelist()` — extracts every hex literal from src/**/*.{ts,tsx,css}, fails on any non-canonical value; second grep pass on violations locates the exact file:line for the dev
  - `placeholderTokens()` — scans dist/ for paired `{{...}}` Mustache-style tokens + TODO + FIXME (src/ excluded so dev TODO comments stay legal)
  - `importBoundaries()` — 5 grep rules covering D-32 (components↛pages, data↛react/motion/components/hooks, content↛same+pages, components no raw /renders/ or /construction/ paths) + D-09 (pages+components↛projects.fixtures)
- **Aggregate exit semantics (D-29):** every check returns boolean; final `results.some(r => !r) && process.exit(1)` blocks the build on any failure; prints `[check-brand] N/4 checks passed` summary
- **Existence guards:** dist/ and src/ both checked via `existsSync` — manual runs of the script before any build succeed gracefully instead of crashing
- **package.json postbuild hook** — `tsx scripts/check-brand.ts` chains after `tsc --noEmit && vite build`; entire `npm run build` now runs prebuild (copy-renders) → tsc → vite → check-brand in one atomic success-or-fail pipeline
- **.github/workflows/deploy.yml "Check brand invariants" step** — inserted between `npm run build` and `actions/upload-pages-artifact@v3`; named step shows as collapsible entry in PR checks for log visibility (overlapping safety net per D-28 — postbuild is the gate; this step is for observability)
- **Regression tests (forge-and-remove):** proved paletteWhitelist catches `#ABCDEF` throwaway file + proved denylistTerms catches a forged `PICTORIAL` constant; cleanup returns to 4/4 PASS

## Task Commits

1. **Task 1: Create scripts/check-brand.ts** — `20c8697` (feat)
2. **Task 2: Wire postbuild npm script + deploy.yml step** — `a3450cf` (feat)

## Files Created/Modified

- `scripts/check-brand.ts` (new, 195 lines) — 4 check functions, aggregate-exit CI guard, no npm deps
- `package.json` — added `"postbuild": "tsx scripts/check-brand.ts"` (preserves predev, prebuild, build, preview, lint, list:construction)
- `.github/workflows/deploy.yml` — inserted "Check brand invariants" step between `npm run build` and `actions/upload-pages-artifact@v3`; step count in build job 5 → 6
- `src/data/projects.ts` — rephrased line 18 comment (silent-displacement deviation fix — see below)

## Decisions Made

- **Placeholder regex: paired `\\{\\{[^}]*\\}\\}` over bare `\\{\\{|\\}\\}`.** The plan's original regex matched unpaired braces, which false-positives on minified JS (~318 occurrences of `}}` from closed object literals in a typical Vite 6 bundle) and minified Tailwind CSS (~18 occurrences from `@supports` block closings). Full-pair matching catches real Mustache-style `{{token}}` leaks without the noise. Rationale recorded inline in the script doc-block.
- **Script quarantine.** `scripts/check-brand.ts` lives under `scripts/`, which is intentionally NOT in the scan scope of any of the 4 checks (scope is `dist/` + `src/` only, per D-25/D-26/D-27/D-33). This allows the script to contain the regex literals for the denylist (`Pictorial|Rubikon|Пикторіал|Рубікон`) and palette without self-triggering. Recorded in doc-block.
- **No ESLint.** Consistent with STACK.md "SKIP for MVP" and Plan 02-02's pattern of boundary enforcement via grep. 5 grep rules are simpler to audit than the equivalent ESLint plugin config, and run inside the same script as the other 3 checks under one aggregate exit.
- **Kept double-coverage per D-28.** Postbuild is the enforcing gate (runs on every dev build); named CI step is for PR log visibility. The named step re-runs the full script — this is intentional overlapping-safety-net design, not a bug.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Placeholder regex would false-positive on every real build**

- **Found during:** Task 1 pre-flight verification of current dist/ state
- **Issue:** Plan specified `grep -rnE '\\{\\{|\\}\\}|TODO|FIXME' dist/ --include='*.html' --include='*.js' --include='*.css'`. Minified Vite output contains 318 `}}` in index-*.js (closed object literals, arrow closures) and 18 `}}` in index-*.css (nested `@supports`/`@layer` block closings). The plan's claim "Running `npm run build` against current src/ + dist/ exits 0" would fail on first real build.
- **Fix:** Tightened regex to `'\\{\\{[^}]*\\}\\}|TODO|FIXME'` — matches FULL token pairs like `{{variable}}` but NOT bare unmatched braces. Real Mustache-style placeholders always use the pair; minifier artifacts use single `}}` on their own line.
- **Files modified:** `scripts/check-brand.ts` (placeholderTokens regex + inline doc-block explanation)
- **Verification:** `npm run build` end-to-end produces real 243KB minified JS + 27KB CSS, and check-brand exits 0 with PASS placeholderTokens. Regex still catches real `{{token}}` tokens (confirmed by character-class semantics — `[^}]*` accepts any content between the braces).
- **Committed in:** `20c8697` (Task 1 commit)

**2. [Rule 1 - Bug] src/data/projects.ts:18 comment literally named the legacy source projects**

- **Found during:** Task 1 pre-flight grep against current src/
- **Issue:** Line 18 of `src/data/projects.ts` read `// Silent displacement hard-rule applies ONLY here (never name Pictorial/Rubikon).` The comment about NOT naming them literally named them — violating D-25 / CONCEPT §10.2 silent-displacement policy regardless of whether the denylist script exists. Also caused the plan's claim "all 4 checks PASS currently" to be false: denylistTerms() would immediately FAIL on this line.
- **Fix:** Rephrased the comment to `// Silent displacement hard-rule applies ONLY here — legacy source-project / names must never appear in shipped source per CONCEPT §10.2 / D-25.` Semantic meaning preserved; the literal names are gone.
- **Files modified:** `src/data/projects.ts`
- **Verification:** `grep -rniE 'Pictorial|Rubikon|Пикторіал|Рубікон' src/` returns empty; full check-brand run exits 0 with PASS denylistTerms.
- **Committed in:** `20c8697` (Task 1 commit)

**3. [Cosmetic / Spec-vs-reality delta] Docstring reference removed to hit acceptance-grep count**

- **Found during:** Task 1 acceptance criteria battery
- **Issue:** Plan acceptance criterion specified `grep -c "Pictorial|Rubikon|Пикторіал|Рубікон" scripts/check-brand.ts` returns `1`. The initial script had this literal in both the grep-cmd regex (line ~60) AND a doc-block comment (line ~14), returning 2.
- **Fix:** Rephrased the doc-block comment to `silent-displacement literals in dist/+src/` — removes literal references without losing semantic clarity.
- **Files modified:** `scripts/check-brand.ts`
- **Verification:** `grep -c ...` now returns `1`; script still exits 0 cleanly; all other acceptance criteria still satisfied.
- **Committed in:** `20c8697` (Task 1 commit)

---

**Total deviations:** 3 (2 Rule 1 bug fixes — both critical to plan claims being true; 1 cosmetic spec alignment)
**Impact on plan:** All three were necessary to make the plan's own success criteria verifiable. No scope creep — the script, postbuild hook, deploy-step, and 4 checks are exactly as specified. The regex tightening and comment rephrase are both strict improvements that make the script more correct, not less.

## Issues Encountered

- None during planned work; the two Rule 1 bugs were pre-existing conditions the plan didn't account for, resolved automatically per deviation rules.

## User Setup Required

None — no external service configuration needed. The script runs locally via `npx tsx scripts/check-brand.ts` and in CI via the `Check brand invariants` step (no secrets, no env vars, no OIDC changes).

## Next Phase Readiness

- **Phase 3 (Brand Primitives & Home Page):** Can now author components freely — any accidental palette drift, silent-displacement leak, raw `/renders/` path literal, or `projects.fixtures` import will fail the build locally at postbuild, not in CI after a 3-min deploy cycle.
- **Phase 6 (Performance, Deploy):** The `Check brand invariants` step is already wired into `deploy.yml`; Phase 6 only needs to add Lighthouse-CI + OG meta verification, no structural changes to the build job.
- **Phase 7 (Post-deploy QA & Handoff):** QA-04 is fully automated — verifier can point at green CI as proof; no manual grep needed.
- **Fifth brand rule (paletteWhitelist const in script mirrors `@theme` in src/index.css)** — drift is caught only if BOTH are updated in lockstep. Adding a 7th color requires editing `scripts/check-brand.ts` `PALETTE_WHITELIST` + `src/index.css` `@theme`. Inline comment records the coupling.

---
*Phase: 02-data-layer-content*
*Completed: 2026-04-24*

## Self-Check: PASSED

**Created files:**
- `scripts/check-brand.ts` — FOUND

**Modified files:**
- `package.json` — FOUND (postbuild script present)
- `.github/workflows/deploy.yml` — FOUND (Check brand invariants step present)
- `src/data/projects.ts` — FOUND (comment rephrased)

**Commits:**
- `20c8697` feat(02-05): add check-brand.ts CI guard with 4 invariant checks — FOUND
- `a3450cf` feat(02-05): wire check-brand via postbuild + deploy.yml step — FOUND

**Functional verification:**
- `npx tsx scripts/check-brand.ts` → exit 0, 4/4 PASS
- `npm run build` end-to-end → exit 0, full pipeline (prebuild → tsc → vite → postbuild check-brand) green
- Regression forge-and-remove: `#ABCDEF` throwaway → exit 1 FAIL paletteWhitelist → cleanup → exit 0 PASS
- Regression forge-and-remove: `PICTORIAL` throwaway → exit 1 FAIL denylistTerms → cleanup → exit 0 PASS
