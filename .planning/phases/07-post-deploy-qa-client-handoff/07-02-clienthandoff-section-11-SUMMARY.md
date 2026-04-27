---
phase: 07-post-deploy-qa-client-handoff
plan: 02
subsystem: docs

tags: [client-handoff, markdown, concept-section-11, placeholders, dev-appendix]

# Dependency graph
requires:
  - phase: 06-perf-mobile-deploy
    provides: docs/CLIENT-HANDOFF.md (Phase 6 GH-account-confirmation section)
  - phase: 02-data-content
    provides: src/content/placeholders.ts em-dash convention (D-19)
  - phase: 02-data-content
    provides: src/content/methodology.ts needsVerification flag on §8 blocks 2/5/6 (D-16)
  - phase: 02-data-content
    provides: src/data/projects.ts slugs (maietok-vynnykivskyi, NTEREST title, Etno Dim address)
provides:
  - "§11 — Open Client Items" 4-column 8-row UA-language client-facing form
  - Dev appendix mapping each of 8 open §11 items to a single-PR file edit
  - Phase 7 SC#5 evidence pointer (docs/CLIENT-HANDOFF.md §11)
affects: [07-09-verification-doc-and-uat-closure, post-handoff-edit-cycle]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - GitHub-flavored markdown table (4-col schema) for client questionnaire
    - Collapsed <details>/<summary> HTML block for dev-only post-handoff playbook
    - Append-not-rewrite pattern preserves Phase 6 GH-account-confirmation section verbatim

key-files:
  created: []
  modified:
    - docs/CLIENT-HANDOFF.md

key-decisions:
  - "Collapsed <details> wrapper for dev appendix (D-30 planner discretion) — keeps client-facing table the visual focus on GitHub web; expandable on click"
  - "Common preamble at top of <details> block collapses 8x re-deploy step into one paragraph instead of repeating per item (Item 1 originally had a 4th Re-deploy line; Items 2-8 referenced it implicitly — preamble formalizes the shared post-edit workflow)"
  - "Em-dashes in column 2 of §11 table are literal U+2014 characters per Phase 2 D-19 (placeholders.ts SOT) — NOT {{token}} literals (which would trip Phase 2 Plan 02-05's check-brand if leaked into dist/)"
  - "Row order matches PROJECT.md «Відкриті питання» source-document order (D-29 lock); planner discretion to re-sort by priority NOT exercised — preserves client's reading flow"
  - "Column 3 («Що зміниться після відповіді») is plain UA prose with NO file paths or code refs — those go exclusively in dev appendix per D-28 column-3 rule"
  - "Dev appendix Item 4 is a no-code path (PROJECT.md «Key Decisions» table edit only) when client confirms current 4 buckets verbatim — every other item maps to ≥1 src/ file edit"

patterns-established:
  - "Single client-facing handoff doc grows append-only across phases: Phase 6 GH-account section (lines 1-46) + Phase 7 §11 section (after line 61). Future phases extend at the end."
  - "Each dev-appendix sub-section follows: H3 + File + Edit + Verify (4 lines). One file per item where possible; multi-file items list all paths under one Files: header."

requirements-completed: [CON-01]

# Metrics
duration: 2min
completed: 2026-04-27
---

# Phase 7 Plan 02: Client Handoff §11 Section Summary

**8-row UA-language client-questionnaire table + collapsed dev appendix mapping each answer to a single-PR file edit, appended verbatim to docs/CLIENT-HANDOFF.md without touching the existing Phase 6 GH-account-confirmation section.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-27T05:31:06Z
- **Completed:** 2026-04-27T05:33:04Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Added "§11 — Open Client Items" H2 section with 4-column 8-row table covering all open КОНЦЕПЦІЯ-САЙТУ.md §11 items (phone, address, Pipeline-4 name, Модель-Б confirmation, methodology blocks 2/5/6, Маєток slug, NTEREST spelling, Етно Дім address)
- Added collapsed `<details>` dev appendix with 8 H3 sub-sections mapping each answer to file path + edit shape + verify command
- Preserved Phase 6 GH-account-confirmation section (lines 1-46) verbatim — no edits to existing content
- Closes Phase 7 SC#5 evidence: single client-facing form for one-pass answer (8 items in one email/chat reply per D-31)

## Task Commits

Each task was committed atomically:

1. **Task 1: Append §11 H2 section + 8-row client-facing table** - `b11f418` (docs)
2. **Task 2: Append dev appendix mapping each of 8 items to file edits** - `4fcc151` (docs)

**Plan metadata:** (forthcoming docs commit for SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md)

## Files Created/Modified

- `docs/CLIENT-HANDOFF.md` — Extended (lines 63-141): new H2 «§11 — Open Client Items» + 4-col 8-row markdown table + collapsed `<details>` dev appendix with 8 H3 sub-sections. Phase 6 GH-account-confirmation section (lines 1-46) and Phase 7 preview note (lines 48-61) UNCHANGED.

## Decisions Made

- **Collapsed `<details>` wrapper for dev appendix** — Renders cleanly on GitHub web markdown (collapsed by default, expandable on click). Keeps client-facing 8-row table the visual focus when client opens the doc; dev sees the playbook only when actively expanding.
- **Common preamble inside `<details>` block** — Item 1's planner-spec'd "Re-deploy" 4th line collapsed into a single paragraph at the top of the appendix. All 8 items share the same post-edit workflow (`npm run build` → push to main → CI deploy → lhci gate). Repeating per-item would be 8x noise.
- **Row order = source-document order** (PROJECT.md «Відкриті питання»), NOT priority-sorted. Preserves client's reading flow against the original list. Priority labels (P0/P1/P2) appear in column 5 as advisory metadata.
- **Em-dashes are literal U+2014** in column 2 per Phase 2 D-19 — NOT `{{token}}` placeholders. The em-dash IS the placeholder convention; check-brand scans `dist/` for paired `{{...}}` literals which would represent un-templated leaks. Source code uses em-dashes by design.
- **Item 4 (Модель-Б) has a no-code path** — If client confirms current 4 buckets verbatim, NO src/ file change; only PROJECT.md "Key Decisions" table flips to «Confirmed». Acknowledges that not every §11 answer requires code; the demo intentionally ships valid-as-is and answers may simply confirm.

## Deviations from Plan

### Out-of-Spec Verify Regex (informational, not a bug)

Task 1's planner-issued automated verify gate `grep -c "NTEREST" docs/CLIENT-HANDOFF.md | grep -q "^1$"` expected exactly 1 match, but the file actually has 2 NTEREST occurrences:

- Line 58 (pre-existing, written in Phase 6): `- «NTEREST» without «I» — confirm or reject` — part of the 8-bullet preview Phase 7 was scheduled to extend
- Line 79 (added in Task 1): the §11 row 7 NTEREST question

Both occurrences are correct and intended. The planner's `grep -q "^1$"` was over-restrictive — the planner did not account for the pre-existing preview note Phase 6 had already written. Task intent ("§11 row about NTEREST exists") is satisfied. No remediation needed; recorded here for trace.

**Total deviations:** 0 auto-fixed, 1 informational verify-gate over-restriction
**Impact on plan:** None — plan executed exactly as written; only a planner-template observation about the verify regex.

## Issues Encountered

None. Both tasks were pure markdown appends with no code, no build pipeline interaction, and no cross-file references.

## User Setup Required

None — docs-only change. No environment variables, no external service configuration, no dashboard work.

## Next Phase Readiness

- **Plan 07-09 (final verification doc)** can cite `docs/CLIENT-HANDOFF.md §11` as Phase 7 SC#5 closure pointer.
- **Post-handoff edit playbook ready**: when the client replies, dev applies the per-item edit listed in the dev appendix; each maps to a single-PR change.
- No new dependencies on prior or subsequent plans. Plan 07-02 is a leaf doc — closes a Phase 7 success criterion without affecting Phase 7's other 8 plans (all parallel-safe).

## Self-Check: PASSED

- File `docs/CLIENT-HANDOFF.md` exists ✓
- Commit `b11f418` (Task 1) exists in git log ✓
- Commit `4fcc151` (Task 2) exists in git log ✓
- §11 H2 header count = 1 ✓
- Developer appendix summary count = 1 ✓
- 8-row table rows present (`| 1 |` through `| 8 |`) ✓
- All 8 H3 dev-appendix headers present (Item 1 through Item 8) ✓
- Phase 6 GH-account-confirmation section preserved ("Item 1: GitHub-account confirmation" still appears once) ✓
- No denylist literals (Pictorial / Rubikon / Пикторіал / Рубікон) ✓

---
*Phase: 07-post-deploy-qa-client-handoff*
*Completed: 2026-04-27*
