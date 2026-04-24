---
phase: 02-data-layer-content
plan: 03
subsystem: data
tags: [node-scripts, tsx, cpSync, translit, construction-log, build-pipeline]

# Dependency graph
requires:
  - phase: 02-01-foundation-types
    provides: ConstructionMonth/ConstructionPhoto types, tsconfig.scripts.json, tsx runner
provides:
  - constructionLog (4-month reverse-chronological array of Lakeview photos)
  - latestMonth() helper (returns constructionLog[0] = mar-2026 with teaserPhotos)
  - copy-renders prebuild/predev hooks (translits 4 render folders, copies 4 construction months)
  - list-construction helper (manual TS-literal inventory printer)
  - public/renders/{lakeview,etno-dim,maietok-vynnykivskyi,nterest}/ (ASCII slug folders)
  - public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/ (50 photos total)
  - .gitignore (project-level, ignores generated public/renders/ + public/construction/ + dist/ + node_modules/ + .DS_Store)
affects:
  - 02-04-content-modules (can author captions later without touching data shape)
  - 02-05-check-brand-ci (will grep dist/ for Pictorial/Rubikon + run check-brand in postbuild)
  - 03-brand-primitives-home (ConstructionTeaser on HomePage consumes latestMonth().teaserPhotos)
  - 04-portfolio-zhk-log-contact (ConstructionLogPage consumes full constructionLog)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "translit-at-build-time (ARCHITECTURE §3 Q8): prebuild script maps Cyrillic source folders to ASCII runtime paths"
    - ".DS_Store filter on every cpSync (RESEARCH §Pitfall B): macOS metadata never leaks to public/ or dist/"
    - "manual-authoring over import.meta.glob (D-21): photos[] is hand-edited; helper script emits paste-ready TS literal"
    - "teaserPhotos on latestMonth() only (D-22): HomePage carousel swap is a one-field PR"
    - "UA alt default «Будівельний майданчик, {month-UA} {year}» — accessible a11y floor without marketing fluff"
    - "idempotent copy via rmSync-before-copy: prebuild runs on every dev/build without accumulation"

key-files:
  created:
    - scripts/copy-renders.ts
    - scripts/list-construction.ts
    - src/data/construction.ts
    - .gitignore
  modified:
    - package.json (added predev, prebuild, list:construction scripts)

key-decisions:
  - "Used fileURLToPath(new URL('..', import.meta.url)) instead of .pathname — the repo path contains non-ASCII 'Проєкти' folder, which .pathname percent-encodes and breaks existsSync. fileURLToPath decodes back to filesystem path. Flagged in 02-RESEARCH §Translit Script edge case 5 as a known pitfall; applied preemptively after first dry-run reproduced the failure."
  - "Added project-level .gitignore in this plan (no prior .gitignore existed). Covers dist/, node_modules/, generated public/renders/ + public/construction/, .DS_Store, editor caches. Source of truth for render/construction assets remains /renders/ and /construction/ at repo root."
  - "Curated 5 evenly-spaced teaserPhotos for mar-2026 (mar-01, -05, -10, -12, -15) as placeholder selection — marked TODO for client review pre-handoff."

patterns-established:
  - "prebuild hook pattern: `tsx scripts/copy-renders.ts` runs before every `npm run dev` and `npm run build`. Plan 02-05 adds postbuild for check-brand CI."
  - "scripts/ files use only node: builtins (fs, path, url) — zero npm deps, zero type mismatches with tsconfig.scripts.json."
  - "Cyrillic-safe path resolution in build scripts: always fileURLToPath, never .pathname."

requirements-completed: [CON-01, CON-02]

# Metrics
duration: 4min
completed: 2026-04-24
---

# Phase 02 Plan 03: Construction Data + Copy-Renders Script Summary

**Typed 4-month Lakeview construction log (50 photos) + prebuild/predev translit script that turns Cyrillic authoring folders into ASCII runtime paths, all idempotent and .DS_Store-safe**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-24T19:11:01Z
- **Completed:** 2026-04-24T19:15:12Z
- **Tasks:** 3
- **Files modified:** 5 (4 created: copy-renders.ts, list-construction.ts, construction.ts, .gitignore; 1 modified: package.json)

## Accomplishments

- `scripts/copy-renders.ts` translits 4 Cyrillic render folders to ASCII slugs (likeview→lakeview, ЖК Етно Дім→etno-dim, ЖК Маєток Винниківський→maietok-vynnykivskyi, Дохідний дім NTEREST→nterest) and copies 4 construction months verbatim, with `.DS_Store` filtered and `_social-covers/` skipped per CONCEPT §7.9. Runs clean and idempotent.
- `src/data/construction.ts` exports `constructionLog` with 4 months reverse-chronological (mar-2026: 15, feb-2026: 12, jan-2026: 11, dec-2025: 12 = 50 photos total), typed against `ConstructionMonth`, with mar-2026 as `latestMonth()` carrying 5 curated `teaserPhotos` for HomePage ConstructionTeaser.
- `scripts/list-construction.ts` helper prints TS-literal `photos: [...]` inventory per month to stdout; author pastes into construction.ts when new shoots arrive. Default UA alt `«Будівельний майданчик, {month-UA} {year}»`.
- `package.json` gained `predev`, `prebuild`, `list:construction` scripts (no `postbuild` — reserved for Plan 02-05 check-brand).
- `.gitignore` created (no prior file existed); generated `public/renders/` and `public/construction/` are now correctly ignored.

## Task Commits

Each task was committed atomically:

1. **Task 1: scripts/copy-renders.ts** — `a5540b9` (feat)
2. **Task 2: src/data/construction.ts** — `5b4c8d8` (feat)
3. **Task 3: scripts/list-construction.ts + package.json + .gitignore** — `83e725f` (chore)

**Plan metadata commit:** to be added after this SUMMARY (docs: complete 02-03 plan).

## Files Created/Modified

- `scripts/copy-renders.ts` — prebuild/predev hook; translits + copies source trees to public/
- `scripts/list-construction.ts` — manual helper; emits TS-literal inventory for paste-into-construction.ts
- `src/data/construction.ts` — 4 months × N photos typed data source
- `.gitignore` — ignores dist/, node_modules/, generated public/renders/, public/construction/, .DS_Store, editor caches
- `package.json` — added predev, prebuild, list:construction scripts (preserved dev, build, preview, lint)

## Decisions Made

- **`fileURLToPath` over `.pathname`** — repo path contains the non-ASCII "Проєкти" folder. `new URL('..', import.meta.url).pathname` returns a percent-encoded string (`/Users/admin/Documents/%D0%9F%D1%80%D0%BE%D1%94%D0%BA%D1%82%D0%B8/...`) which `existsSync` cannot resolve. Using `fileURLToPath(new URL(...))` decodes to the filesystem-usable path. Applied to both `copy-renders.ts` and `list-construction.ts`.
- **Project-level `.gitignore` created here** — no prior `.gitignore` existed. Added the minimum needed to keep the repo clean: generated `public/renders/` + `public/construction/` (per plan's verification block), `dist/`, `node_modules/`, `.DS_Store`, editor caches.
- **5 teaserPhotos for mar-2026** — picked evenly-spaced shots (mar-01, -05, -10, -12, -15) as placeholder curation; marked `TODO: review with client before handoff` in the file.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Cyrillic repo path broke existsSync**
- **Found during:** Task 1 (scripts/copy-renders.ts first dry-run)
- **Issue:** First run of `npx tsx scripts/copy-renders.ts` reported all 4 render folders and all 4 construction months as "missing", because `new URL('..', import.meta.url).pathname` returned a percent-encoded path (`/Users/admin/Documents/%D0%9F%D1%80%D0%BE%D1%94%D0%BA%D1%82%D0%B8/...`) for the non-ASCII "Проєкти" parent folder. `existsSync` cannot resolve percent-encoded paths. Flagged in 02-RESEARCH §Translit Script edge case 5 as a known risk.
- **Fix:** Switched to `fileURLToPath(new URL('..', import.meta.url))` which decodes back to the filesystem path. Applied symmetrically to `scripts/list-construction.ts` for consistency.
- **Files modified:** scripts/copy-renders.ts, scripts/list-construction.ts
- **Verification:** Re-ran `npm run prebuild` — all 4 render folders + 4 construction months copied with correct file counts (7/8/2/3 + 12/11/12/15). Also verified script runs from `list-construction.ts` — found same issue there and applied same fix preemptively.
- **Committed in:** a5540b9 (Task 1) + 83e725f (Task 3 for list-construction.ts)

**2. [Rule 2 - Missing Critical] Project-level .gitignore missing**
- **Found during:** Task 3 (package.json wiring + verification block)
- **Issue:** Verification block of plan 02-03 explicitly states *"public/renders/ and public/construction/ gitignored (not committed to repo)"* and instructs to *"check `.gitignore` for `/public/renders` and `/public/construction` entries. If missing, add them in this same commit."* No `.gitignore` existed at repo root. Without one, `git status` showed the 50+ generated asset files as untracked, inviting accidental commits of build output.
- **Fix:** Created `.gitignore` at repo root with: `dist/`, `node_modules/`, `public/renders/`, `public/construction/`, `.DS_Store`, `.vite/`, `.vscode/`, `.idea/`, `.playwright-mcp/`. Minimum scope — did not try to solve every untracked-file situation in the repo (many are out-of-scope source folders: `renders/`, `construction/`, `вигода-…-системний-девелопмент/`).
- **Files modified:** .gitignore (new)
- **Verification:** `git check-ignore public/renders public/construction` returns both paths — confirmed ignored. `git status` post-prebuild shows clean working tree.
- **Committed in:** 83e725f (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 bug-fix, 1 missing-critical).
**Impact on plan:** Both deviations were surfaced by the plan's own verification — the fileURLToPath fix was pre-flagged in 02-RESEARCH as a known edge case; the `.gitignore` was explicit in the verification block. Zero scope creep.

## Issues Encountered

- None beyond the two deviations above.

## User Setup Required

None — no external service configuration required. The author may optionally run `npm run list:construction` ad-hoc when new construction photos arrive, then paste the emitted `photos: [...]` block into `src/data/construction.ts` and hand-author `caption` fields per CONCEPT §7.9 tone.

## Next Phase Readiness

Ready for Plan 02-04 (content modules) and Plan 02-05 (check-brand CI). Downstream consumers:

- **Plan 02-04 (content):** Can import `constructionLog` and `latestMonth()` if needed for any copy-adjacent derivation; otherwise independent.
- **Plan 02-05 (check-brand):** Will `postbuild` grep `dist/` for forbidden strings — must not collide with the runtime path `public/construction/` (it won't; grep is on `dist/`).
- **Phase 3 HomePage ConstructionTeaser:** Reads `latestMonth().teaserPhotos` → 5-item preview; swap content is a one-field PR per D-22.
- **Phase 4 ConstructionLogPage:** Reads full `constructionLog` → renders 4-month grouped gallery with 50 photos.

No blockers.

## Self-Check: PASSED

All claimed artifacts verified present with correct shape:

- `scripts/copy-renders.ts` — FOUND
- `scripts/list-construction.ts` — FOUND
- `src/data/construction.ts` — FOUND
- `.gitignore` — FOUND
- `package.json` predev/prebuild/list:construction — PRESENT
- `public/renders/{lakeview,etno-dim,maietok-vynnykivskyi,nterest}/` — 7/8/2/3 files (expected)
- `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/` — 12/11/12/15 files (expected), `_social-covers` absent, 0 `.DS_Store`
- Commit `a5540b9` (Task 1) — FOUND
- Commit `5b4c8d8` (Task 2) — FOUND
- Commit `83e725f` (Task 3) — FOUND
- `npm run prebuild` exits 0; `npm run lint` exits 0; idempotent (md5 identical on 2× runs)
- Derived-data sanity: `constructionLog.length === 4`, `latestMonth().key === 'mar-2026'`, `latestMonth().teaserPhotos.length === 5`, siblings have no `teaserPhotos`

---
*Phase: 02-data-layer-content*
*Completed: 2026-04-24*
