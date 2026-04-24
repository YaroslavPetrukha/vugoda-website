---
phase: 02-data-layer-content
plan: 01
subsystem: data
tags: [typescript, vite, base-url, tsx, tsconfig]

# Dependency graph
requires:
  - phase: 01-foundation-shell
    provides: [vite-config-with-base, tsconfig-src-scoped, package.json-pinned]
provides:
  - tsx-installed
  - types.Stage
  - types.Presentation
  - types.Project
  - types.ConstructionPhoto
  - types.ConstructionMonth
  - types.MethodologyBlock
  - types.BrandValue
  - lib.assetUrl
  - lib.renderUrl
  - lib.constructionUrl
  - tsconfig.scripts
affects: [02-02, 02-03, 02-04, 02-05, 03-*, 04-*]

# Tech tracking
tech-stack:
  added: [tsx@^4.21.0]
  patterns:
    - types-only module (D-02) — src/data/types.ts is the single source of truth
      for all data+content type declarations; zero imports, zero runtime exports
    - BASE_URL helper (D-30) — all asset path construction routed through
      src/lib/assetUrl.ts so prod vs dev BASE_URL prefix is applied once
    - doc-block rule (D-34) — every data/lib module carries a @rule comment
      naming its import-boundary constraints
    - tsconfig.scripts.json — Node-only lib/types, scoped to scripts/ so
      `npx tsc --noEmit -p tsconfig.scripts.json` can run without DOM libs

key-files:
  created:
    - src/data/types.ts
    - src/lib/assetUrl.ts
    - tsconfig.scripts.json
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "tsx pinned to ^4.21.0 per Phase 2 RESEARCH §Environment Availability (caret within major 4 is safe for script runner)"
  - "tsconfig.scripts.json does NOT extend tsconfig.json — parent pulls in DOM/DOM.Iterable libs that break Node-only scripts"
  - "assetUrl.ts reads import.meta.env.BASE_URL once into module-level const BASE — not per-call (type narrows cleanly, evaluated at module init)"
  - "No additional helpers (ogImageUrl/faviconUrl) — those are one-offs, hardcoded in Phase 6 consumers; premature helpers bloat the module"
  - "Types-only file (zero runtime exports) enforces D-02 boundary — verified by grep; downstream projects.ts / construction.ts / content modules will import Project, Stage, Presentation, ConstructionMonth, MethodologyBlock, BrandValue from here"

patterns-established:
  - "Types-only leaf module: src/data/types.ts has zero imports, zero const/function/default exports — pure type declarations"
  - "Pure utility module: src/lib/assetUrl.ts has zero imports (incl. no React/motion) and only named arrow-function exports"
  - "Node-only tsconfig for scripts/: tsconfig.scripts.json uses lib:[ES2022] types:[node] — separates script type-check from app type-check"

requirements-completed: []  # CON-02 and ZHK-02 partially addressed (types laid) but remain open until Plan 02-02 ships src/data/projects.ts

# Metrics
duration: 3min
completed: 2026-04-24
---

# Phase 02 Plan 01: Foundation Types Summary

**Installed tsx@^4.21.0 and added the three foundation files Phase 2 downstream plans depend on: src/data/types.ts (7 named type exports, zero runtime, zero imports), src/lib/assetUrl.ts (3 BASE_URL-safe helpers), and tsconfig.scripts.json (Node-only, scripts/-scoped).**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-24T19:03:10Z
- **Completed:** 2026-04-24T19:06:16Z
- **Tasks:** 3
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments

- tsx@^4.21.0 installed as devDependency — Plan 02-03 script runner ready
- tsconfig.scripts.json seeded with Node-only lib/types, scoped to `scripts/**/*.ts` (directory itself created in Plan 02-03)
- src/data/types.ts exports all 7 data-layer types (Stage, Presentation, Project, ConstructionPhoto, ConstructionMonth, MethodologyBlock, BrandValue) with full JSDoc per D-34
- src/lib/assetUrl.ts exports assetUrl / renderUrl / constructionUrl — all three prepend import.meta.env.BASE_URL so downstream JSX never hardcodes `/renders/…` or `/construction/…`
- Import-boundary pre-check (Plan 02-05 will enforce): `grep -rE "from 'react'|from 'motion" src/data/ src/lib/` is empty — clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Install tsx + create tsconfig.scripts.json** — `17cd0f1` (chore)
2. **Task 2: Create src/data/types.ts** — `aae606e` (feat)
3. **Task 3: Create src/lib/assetUrl.ts** — `3b11335` (feat)

**Plan metadata:** (appended below at final commit step)

## Files Created/Modified

- `src/data/types.ts` — Single source of truth for data-layer types: Stage union (4 literals), Presentation union (4 literals), Project interface (11 fields), ConstructionPhoto, ConstructionMonth (with teaserPhotos? subset), MethodologyBlock (index: 1..7, needsVerification), BrandValue. Zero imports, zero runtime exports.
- `src/lib/assetUrl.ts` — Three BASE_URL-safe helpers: `assetUrl(path)` (generic, strips leading slash), `renderUrl(slug, file)` (→ `${BASE}renders/${slug}/${file}`), `constructionUrl(month, file)` (→ `${BASE}construction/${month}/${file}`). Module-level `const BASE = import.meta.env.BASE_URL`.
- `tsconfig.scripts.json` — Node-only tsconfig scoped to `scripts/**/*.ts`. `lib: ["ES2022"]`, `types: ["node"]`. Does NOT extend tsconfig.json (parent includes DOM libs that break Node scripts).
- `package.json` — Added `tsx: "^4.21.0"` to devDependencies.
- `package-lock.json` — Reflects tsx + transitive deps (5 packages added).

## Decisions Made

- **tsx pinned within major 4** (`^4.21.0`) per RESEARCH §Environment Availability — safe carrier for npx-run scripts.
- **tsconfig.scripts.json is standalone, not extending** the root tsconfig.json. Parent ships DOM/DOM.Iterable libs needed for React code but harmful for Node scripts (would type-check `fetch`/`Response` against browser shapes). Keeping them separated lets `npx tsc --noEmit -p tsconfig.scripts.json` give clean errors against `node:fs`, `node:path`, etc.
- **scripts/ directory intentionally NOT created in this plan** — Plan 02-03 creates it with copy-renders.ts. `tsc -p tsconfig.scripts.json` before Plan 03 would exit 1 with "No inputs were found" — expected; config is seeded for later.
- **assetUrl.ts reads BASE_URL once at module init** (`const BASE = import.meta.env.BASE_URL`), not per call. TypeScript narrows cleanly at module scope; per-call evaluation would be needlessly repetitive with identical result.
- **Only 3 helpers in assetUrl.ts** — no ogImageUrl, no faviconUrl. Those are one-off call sites (Phase 6 meta tags). Premature helpers bloat a pure utility.
- **Types-only types.ts** — zero runtime exports enforces the D-02 boundary (types live in ONE file, consumed everywhere). Downstream projects.ts, construction.ts, methodology.ts all import from here.

## Deviations from Plan

None — plan executed exactly as written. All 3 tasks produced the verbatim file content specified. No bugs encountered. No missing critical functionality. No blocking issues. No architectural changes needed.

## Issues Encountered

None.

**Note on plan acceptance criteria strictness:**

Two acceptance-criterion grep counts in the plan were slightly off-by-one vs the verbatim content the plan itself prescribed:

- `grep -c "'flagship-external'" src/data/types.ts returns 1` — actual count is 2 (once in the type union literal, once in the JSDoc comment on `Project.externalUrl` which explicitly references `presentation='flagship-external'`). The comment is specified verbatim in the plan's `<action>` block, so returning 2 is correct behavior.
- `grep -c "import.meta.env.BASE_URL" src/lib/assetUrl.ts returns 1` — actual count is 2 (once in the runtime `const BASE` assignment, once in the opening JSDoc `@rule` comment which explicitly mentions `import.meta.env.BASE_URL`). Same pattern — the doc-block is specified verbatim, so returning 2 is correct.

Both "discrepancies" are spec oversights in the plan's acceptance-criteria count, not defects in the produced files. The underlying behavior (types defined, BASE_URL referenced in code) is satisfied. No change needed; flagging here for the verifier.

## User Setup Required

None — no external service configuration, no env vars, no dashboard steps.

## Next Phase Readiness

- Plan 02-02 (projects + fixtures) can import `Project`, `Stage`, `Presentation` from `src/data/types.ts` directly.
- Plan 02-03 (construction + copy script) can import `ConstructionMonth`, `ConstructionPhoto` from types.ts; can create `scripts/copy-renders.ts` covered by tsconfig.scripts.json; tsx available as script runner.
- Plan 02-04 (content modules) can import `MethodologyBlock`, `BrandValue` from types.ts.
- Plan 02-05 (check-brand CI) can enforce the import-boundary rule (no `from 'react'|from 'motion'` inside `src/data/` or `src/lib/`) — already empty today; just needs the CI grep step added.
- No blockers. No concerns.

## Self-Check

Verified on disk:

- [x] `src/data/types.ts` — FOUND
- [x] `src/lib/assetUrl.ts` — FOUND
- [x] `tsconfig.scripts.json` — FOUND
- [x] `node_modules/tsx/package.json` — FOUND
- [x] commit `17cd0f1` — FOUND in git log
- [x] commit `aae606e` — FOUND in git log
- [x] commit `3b11335` — FOUND in git log
- [x] `npm run lint` — exits 0
- [x] Import-boundary grep (`from 'react'|from 'motion'` in src/data/ src/lib/) — empty

## Self-Check: PASSED

---
*Phase: 02-data-layer-content*
*Completed: 2026-04-24*
