---
phase: 07-post-deploy-qa-client-handoff
plan: 09
type: execute
wave: 3
depends_on: ["07-01-axe-script-and-devdep", "07-02-clienthandoff-section-11", "07-03-keyboard-walkthrough", "07-04-hard-refresh-test", "07-05-layout-screenshots", "07-06-mobile-fallback-screenshot", "07-07-lhci-archive", "07-08-social-unfurl-verify"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md
  - .planning/phases/07-post-deploy-qa-client-handoff/check-brand-{commit-sha}.txt
  - .planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md
autonomous: false
requirements_addressed: []

must_haves:
  truths:
    - "07-VERIFICATION.md exists as the single consolidated artifact pointer for SC#1-5 closure + UAT-1-5 closure"
    - "Each of 5 SC sections (SC#1..SC#5) links to its evidence artifact in this phase's directory"
    - "check-brand-{commit-sha}.txt captures the latest postbuild stdout (7/7 PASS lines per D-12)"
    - "06-HUMAN-UAT.md result: lines for all 5 UATs are flipped from [pending] to [passed via 07-...] (or [failed]) per D-06"
    - "Phase 7 closes when 5/5 SCs pass AND 5/5 UATs close"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md"
      provides: "Consolidated artifact pointer per D-33 — SC#1..5 + UAT-1..5 cross-reference table"
      min_lines: 60
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/check-brand-{commit-sha}.txt"
      provides: "Captured stdout from `npm run build` postbuild step (7 [check-brand] PASS lines per D-12)"
      contains: "[check-brand]"
    - path: ".planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md"
      provides: "Inline-updated result: fields per D-06 (5/5 closed)"
      contains: "passed via 07-"
  key_links:
    - from: "07-VERIFICATION.md SC#3 entry"
      to: "check-brand-{sha}.txt + axe/axe-summary.md"
      via: "evidence pointer"
      pattern: "check-brand|axe-summary"
    - from: "07-VERIFICATION.md SC#5 entry"
      to: "docs/CLIENT-HANDOFF.md §11 section"
      via: "external doc reference"
      pattern: "CLIENT-HANDOFF\\.md"
    - from: "06-HUMAN-UAT.md UAT-1 result line"
      to: "07-VERIFICATION.md UAT-1 closure"
      via: "inline cross-reference"
      pattern: "passed via 07-"
---

<objective>
Capture the latest postbuild `[check-brand]` stdout as evidence (D-12), write the consolidated `07-VERIFICATION.md` pointing to all SC#1-5 + UAT-1-5 evidence files, and inline-update `06-HUMAN-UAT.md` `result:` fields to flip 5/5 UATs from `[pending]` to `[passed via 07-{plan-id}]` per D-06.

Purpose: Closes Phase 7 entirely. The verification doc is the single artifact a developer/auditor reads to confirm SC#1–5 closure (D-33). 06-HUMAN-UAT.md becomes a fully-closed file (5/5 result: passed via). NO standalone `/gsd:verify-work` for Phase 6 needed — Phase 7 absorbs UAT-1..5 atomically per D-06.

**Honors D-34 plan-granularity:** this is the final plan in Wave 3 (artifact bundling), per D-34's «Wave 3 sequential: lhci-archive, social-unfurl-verify, verification-doc-and-uat-closure» locked order.

Output: `07-VERIFICATION.md`, `check-brand-{commit-sha}.txt`, updated `06-HUMAN-UAT.md`.
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
@.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md
@scripts/check-brand.ts

<interfaces>
<!-- Phase 7 SC#1..5 verbatim from ROADMAP.md (lines 147-152): -->
<!--   SC#1 = Keyboard walkthrough (5 routes; focus-visible; no traps; Esc closes lightbox) -->
<!--   SC#2 = Hard-refresh deep-link (5 + unknown slug) -->
<!--   SC#3 = Build-output grep + axe-core (zero critical a11y) -->
<!--   SC#4 = Lighthouse archived per route + 1280/1366/1440/1920 layouts + mobile-fallback -->
<!--   SC#5 = docs/CLIENT-HANDOFF.md §11 8 items -->

<!-- Phase 6 UAT-1..5 from 06-HUMAN-UAT.md: -->
<!--   UAT-1 = Lighthouse desktop ≥90 deployed (closes via Plan 07-07 lhci-archive — D-01) -->
<!--   UAT-2 = MobileFallback visual at <1024px (closes via Plan 07-06 mobile-fallback-screenshot — D-02) -->
<!--   UAT-3 = Social unfurl Viber/Telegram/Slack (closes via Plan 07-08 social-unfurl-verify — D-03) -->
<!--   UAT-4 = Hard-refresh deep-link incognito (closes via Plan 07-04 hard-refresh-test — D-04) -->
<!--   UAT-5 = lhci CI workflow_run chain (closes via Plan 07-07 lhci-archive — D-05) -->

<!-- 06-HUMAN-UAT.md schema (from existing file): -->
<!--   Each test has: -->
<!--     ### N. {name} -->
<!--     expected: {text} -->
<!--     result: [pending]   <-- inline-update target per D-06 -->

<!-- check-brand.ts (Phase 2 + Phase 5 + Phase 6 extensions, 7 active checks): -->
<!--   Run via `npm run build` postbuild hook -->
<!--   Stdout format per check: `[check-brand] PASS {check-name}` × 7 lines -->
<!--   Captures Pictorial/Rubikon, hex whitelist, {{}/TODO, import boundaries, no-inline-transition, bundle budget, hero budget -->
-->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Capture postbuild check-brand stdout as evidence (D-12)</name>
  <files>.planning/phases/07-post-deploy-qa-client-handoff/check-brand-{commit-sha}.txt</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-12 — re-run, archive, no extension)
    - scripts/check-brand.ts (verify 7 checks active)
  </read_first>
  <action>
    Per D-12 («re-run existing scripts/check-brand.ts and archive output as evidence; no new checks added»):

    1. Get the current commit SHA (short form, 7 chars):
       ```bash
       SHORT_SHA=$(git rev-parse --short HEAD)
       echo "SHORT_SHA=$SHORT_SHA"
       ```

    2. Run a fresh build and capture postbuild output:
       ```bash
       OUT_FILE=".planning/phases/07-post-deploy-qa-client-handoff/check-brand-${SHORT_SHA}.txt"
       npm run build 2>&1 | tee /tmp/build-output.txt
       # Filter to just the [check-brand] lines + any PASS/FAIL summary:
       grep -E "^\[check-brand\]|^PASS|^FAIL" /tmp/build-output.txt > "$OUT_FILE"
       # Or simpler: capture the whole postbuild section:
       awk '/postbuild/,EOF' /tmp/build-output.txt >> "$OUT_FILE" 2>/dev/null || true
       ```

       Alternative (cleaner — capture only check-brand stdout):
       ```bash
       OUT_FILE=".planning/phases/07-post-deploy-qa-client-handoff/check-brand-${SHORT_SHA}.txt"
       # Run a build-with-tee, then extract check-brand lines
       npm run build 2>&1 | grep "\[check-brand\]" > "$OUT_FILE"
       # Verify the file has 7 PASS lines (or 7+ counting summary)
       wc -l "$OUT_FILE"
       grep -c "PASS" "$OUT_FILE"
       ```

    3. Verify the captured file:
       - File exists at `.planning/phases/07-post-deploy-qa-client-handoff/check-brand-${SHORT_SHA}.txt`
       - Contains at least 7 lines starting with `[check-brand]` (one per active check)
       - Contains the literal `PASS` at least 7 times (one per check)
       - DOES NOT contain `FAIL` anywhere (if it does, build is broken — STOP and trigger /gsd:debug)

    4. If the build fails (non-zero exit code OR `FAIL` in output):
       - This is a regression of QA-04 (Phase 2 SC#3 + Phase 5 SC#1 + Phase 6 budget gates)
       - STOP Phase 7 progression
       - Trigger /gsd:debug → identify which of 7 checks failed → fix → rebuild → re-run this task

    5. The captured file is committed verbatim — small (~1KB), human-readable, dated by SHA.

    Expected file content (example from Plan 06-09 build):
    ```
    [check-brand] PASS denylistTerms — no Pictorial/Rubikon/Пикторіал/Рубікон in dist/
    [check-brand] PASS paletteWhitelist — only 6 brand hexes in src/
    [check-brand] PASS placeholderTokens — no {{token}} or TODO in dist/
    [check-brand] PASS importBoundaries — pages/components/data/content boundaries hold
    [check-brand] PASS noInlineTransition — no transition={{ in src/ (Phase 5 D-31)
    [check-brand] PASS bundleBudget — gzipped JS ≤200KB
    [check-brand] PASS heroBudget — hero AVIF ≤200KB at 1280w
    ```
  </action>
  <verify>
    <automated>f=$(ls .planning/phases/07-post-deploy-qa-client-handoff/check-brand-*.txt 2>/dev/null | head -1) && test -f "$f" && [ "$(grep -c '\[check-brand\]' "$f")" -ge 7 ] && ! grep -q "FAIL" "$f"</automated>
  </verify>
  <done>
    check-brand-{sha}.txt exists in the phase directory; contains ≥7 lines with `[check-brand]` literal; contains ≥7 `PASS` literals; contains ZERO `FAIL` literals.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Author 07-VERIFICATION.md consolidating SC#1-5 + UAT-1-5 evidence pointers (D-33)</name>
  <files>.planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-33 structure)
    - .planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md (Plan 07-03 output — verify exists)
    - .planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md (Plan 07-04 output — verify exists)
    - .planning/phases/07-post-deploy-qa-client-handoff/axe/axe-summary.md (Plan 07-01 output — verify exists)
    - .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md (Plan 07-07 output — verify exists)
    - .planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md (Plan 07-05 output — verify exists)
    - .planning/phases/07-post-deploy-qa-client-handoff/unfurls/SUMMARY.md (Plan 07-08 output — verify exists)
    - docs/CLIENT-HANDOFF.md (Plan 07-02 §11 section — verify exists)
  </read_first>
  <action>
    Per D-33 (consolidated artifact pointer with 6 sections — 5 SCs + UAT closure):

    Before writing, verify all upstream evidence files exist. If ANY are missing or zero-byte, list them as «pending» in the verification doc rather than claiming closure (do not falsely close).

    Create `.planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md`:

    ```markdown
    # Phase 7 — Verification (Post-deploy QA & Client Handoff)

    **Date:** {ISO date}
    **Phase:** 07-post-deploy-qa-client-handoff
    **Status:** {complete | partial — see pending items below}
    **Author:** Phase 7 execution

    This document is the consolidated artifact pointer for Phase 7's 5 success criteria + 5 absorbed Phase 6 UAT items. Each section links to the evidence file produced by the corresponding plan.

    ## Success Criteria

    ### SC#1: Keyboard-only walkthrough of all 5 routes

    Verbatim from ROADMAP.md: «Keyboard-only walkthrough of all 5 routes on deployed URL: every interactive element (nav links, CTAs, card links, filter buttons, mailto CTA, lightbox open/close) is reachable and shows visible :focus-visible outline; no focus traps; Esc closes lightbox dialogs»

    - **Evidence:** [keyboard-walkthrough.md](./keyboard-walkthrough.md)
    - **Plan:** 07-03-keyboard-walkthrough
    - **Closure threshold:** Summary table shows zero ❌ rows; both lightbox surfaces (/construction-log + /zhk/etno-dim) pass focus-trap + Esc subsection
    - **Outcome:** {PASS | FAIL — see ❌ rows in linked doc}

    ### SC#2: Hard-refresh deep-link of every production URL works

    Verbatim from ROADMAP.md: «Hard-refresh (cold incognito tab) of every production URL works: /#/, /#/projects, /#/zhk/etno-dim, /#/construction-log, /#/contact, /#/zhk/unknown (→ proper 404 or redirect); no 404 class failures, no blank-screen class failures»

    - **Evidence:** [hard-refresh.md](./hard-refresh.md)
    - **Plan:** 07-04-hard-refresh-test
    - **Closure threshold:** All 6 rows ✅ Pass; new incognito window per row honored (D-10)
    - **Outcome:** {PASS | FAIL — see ❌ rows in linked doc}

    ### SC#3: Build-output denylist + axe-core a11y

    Verbatim from ROADMAP.md: «Build-output grep audit passes: grep -r 'Pictorial|Rubikon|Пикторіал|Рубікон' dist/ empty; grep -r '{{' dist/ empty; grep -r 'TODO' dist/ empty; axe-core run per route reports zero critical a11y issues»

    - **Evidence (denylist):** [check-brand-{commit-sha}.txt](./check-brand-{commit-sha}.txt) — 7/7 [check-brand] PASS lines
    - **Evidence (axe):** [axe/axe-summary.md](./axe/axe-summary.md) + 5 per-route JSONs in [axe/](./axe/)
    - **Plans:** 07-01-axe-script-and-devdep (axe), inherited from Phase 5+6 (check-brand)
    - **Closure threshold:**
      - check-brand: 7/7 PASS, 0 FAIL
      - axe: 0 critical AND 0 serious across 5 routes (D-16 strengthened threshold)
    - **Outcome:** {PASS | FAIL}

    ### SC#4: Lighthouse archived + layout verified at 4 widths + mobile fallback

    Verbatim from ROADMAP.md: «Lighthouse desktop results archived per route (≥90 all 4 categories documented); tested at 1280 / 1366 / 1440 / 1920 widths for layout verification; mobile fallback rendered correctly at <1024px»

    - **Evidence (scores):** [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md)
    - **Evidence (desktop layouts):** [layout/SUMMARY.md](./layout/SUMMARY.md) + 20 PNGs in [layout/](./layout/)
    - **Evidence (mobile fallback):** [layout/mobile-375.png](./layout/mobile-375.png)
    - **Plans:** 07-05-layout-screenshots, 07-06-mobile-fallback-screenshot, 07-07-lhci-archive
    - **Closure threshold:**
      - Lighthouse: all 4 categories ≥0.9 on all 5 routes (lhci-archive PASS)
      - Layout: 20 PNGs captured + SUMMARY.md checklist 100% pass per route×width
      - Mobile: mobile-375.png shows MobileFallback (not desktop) with all expected elements
    - **Outcome:** {PASS | FAIL}

    ### SC#5: docs/CLIENT-HANDOFF.md §11 lists all 8 open items

    Verbatim from ROADMAP.md: «docs/CLIENT-HANDOFF.md exists listing all 8 open CONCEPT §11 items (phone, юр. адреса, Pipeline-4 назва, Model-Б підтвердження, методологія блоки 2/5/6 верифікація, slug транслітерація maietok vs maetok, NTEREST без I підтвердження, Етно Дім вул. Судова підтвердження)»

    - **Evidence:** [../../../docs/CLIENT-HANDOFF.md](../../../docs/CLIENT-HANDOFF.md) §11 section + dev appendix
    - **Plan:** 07-02-clienthandoff-section-11
    - **Closure threshold:** §11 H2 section appended; 8-row table populated verbatim from D-29; dev appendix has 8 H3 sub-sections; existing GH-account section (Phase 6) untouched
    - **Outcome:** {PASS | FAIL}

    ## UAT Closure (Phase 6 → Phase 7 absorption per D-01..D-06)

    | UAT | Phase 6 expected | Phase 7 closure plan | Evidence | Status |
    |-----|------------------|----------------------|----------|--------|
    | UAT-1 | Lighthouse desktop ≥90 on deployed URL (4 cats × 5 routes) | 07-07-lhci-archive | [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md) | {passed via 07-07 / failed} |
    | UAT-2 | MobileFallback visual at <1024px | 07-06-mobile-fallback-screenshot | [layout/mobile-375.png](./layout/mobile-375.png) | {passed via 07-06 / failed} |
    | UAT-3 | Social unfurl Viber/Telegram/Slack | 07-08-social-unfurl-verify | [unfurls/SUMMARY.md](./unfurls/SUMMARY.md) + 3 PNGs | {passed via 07-08 / failed} |
    | UAT-4 | Hard-refresh deep-link incognito (5 routes) | 07-04-hard-refresh-test | [hard-refresh.md](./hard-refresh.md) | {passed via 07-04 / failed} |
    | UAT-5 | lhci CI workflow_run chain validation | 07-07-lhci-archive | [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md) UAT-5 section | {passed via 07-07 / failed} |

    ## Pending items (if any)

    {Only if any evidence file is missing or zero-byte; list specifically:}
    - layout/mobile-375.png is zero-byte stub — dev must capture before handoff
    - …

    ## Phase 7 outcome

    - SCs passed: {N}/5
    - UATs closed: {N}/5
    - Phase status: {complete (5/5 + 5/5) | partial (any missing)}

    ## Next steps

    {If complete:}
    - Hand off the demo URL + this document to client
    - Client uses docs/CLIENT-HANDOFF.md §11 to answer 8 open items in one reply
    - Post-handoff: dev applies edits per the dev appendix (D-30)

    {If partial:}
    - Complete pending items
    - Re-run /gsd:execute-phase 7 to refresh this verification doc
    - Phase 7 cannot be marked complete in STATE.md until 5/5 + 5/5
    ```

    Substitute `{commit-sha}` with the actual SHA from Task 1. Substitute outcome cells based on inspection of each upstream evidence file. If an evidence file shows FAIL, mark the SC/UAT FAIL here too — do NOT paper over.

    Self-consistency pre-screen:
    - Mentions «Pictorial|Rubikon|Пикторіал|Рубікон» as a regex literal IN the SC#3 description — file is under `.planning/`, NOT `src/`, so check-brand denylistTerms() does not scan it. Safe.
    - No `{{token}}` literals (em-dashes only).
    - No `TODO` literals (uses «pending» word).
  </action>
  <verify>
    <automated>test -f .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md && [ "$(grep -c '## Success Criteria' .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md)" -eq 1 ] && [ "$(grep -c '### SC#' .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md)" -eq 5 ] && [ "$(grep -cE '^\| UAT-[0-9]' .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md)" -eq 5 ] && [ "$(grep -c '## Phase 7 outcome' .planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md)" -eq 1 ]</automated>
  </verify>
  <done>
    07-VERIFICATION.md exists; contains H2 «## Success Criteria» + 5 H3 SC entries (SC#1..SC#5); UAT closure table with 5 data rows (UAT-1..UAT-5); H2 «## Phase 7 outcome» summary; each SC + UAT entry links to a real evidence file in this phase directory.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Inline-update 06-HUMAN-UAT.md result: lines per D-06 (5/5 closures)</name>
  <what-built>
    Tasks 1-2 produced check-brand-{sha}.txt + 07-VERIFICATION.md. All upstream evidence is in place. Now flip 06-HUMAN-UAT.md result: fields atomically.
  </what-built>
  <how-to-verify>
    Per D-06 (Phase 6 UAT closure is ATOMIC — when 07-VERIFICATION.md is written, all 5 UAT result: fields are inline-updated):

    **Setup:**
    1. Open `.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md`.
    2. Confirm current state: 5 tests, all `result: [pending]` (per the file as it existed at end of Phase 6).

    **Per-UAT inline edit (D-06 + planner discretion: inline edit of result: line, not append-block):**

    For each of UAT-1..UAT-5, locate the `result: [pending]` line under its `### N. {test name}` section and replace with:
    - `result: [passed via 07-{plan-id}, evidence at {path}]` if the corresponding evidence shows PASS
    - `result: [failed — see 07-{plan-id}]` if FAIL

    Specific edits (verify each against 07-VERIFICATION.md outcomes):

    **UAT-1 (Lighthouse desktop ≥90):**
    Find:
    ```
    ### 1. Lighthouse Desktop ≥90 on deployed URL (all 5 routes, all 4 categories)
    expected: ...
    result: [pending]
    ```
    Replace `result: [pending]` with:
    `result: [passed via 07-07-lhci-archive, evidence at .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md]`
    (Or `[failed — see 07-07-lhci-archive]` if SUMMARY.md shows ≥1 threshold violation.)

    **UAT-2 (MobileFallback at <1024px):**
    Find: `### 2. MobileFallback visual at <1024px (real iPhone or DevTools emulation)` → `result: [pending]`
    Replace with: `result: [passed via 07-06-mobile-fallback-screenshot, evidence at .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png]`

    **UAT-3 (Social unfurl):**
    Find: `### 3. Social unfurl in Viber/Telegram/Slack` → `result: [pending]`
    Replace with: `result: [passed via 07-08-social-unfurl-verify, evidence at .planning/phases/07-post-deploy-qa-client-handoff/unfurls/SUMMARY.md]`

    **UAT-4 (Hard-refresh deep-link):**
    Find: `### 4. Hard-refresh deep-link incognito test (5 production routes)` → `result: [pending]`
    Replace with: `result: [passed via 07-04-hard-refresh-test, evidence at .planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md]`

    **UAT-5 (lhci CI workflow_run chain):**
    Find: `### 5. Lighthouse CI workflow_run chain validation` → `result: [pending]`
    Replace with: `result: [passed via 07-07-lhci-archive, evidence at .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md (UAT-5 section)]`

    **After 5 edits, update the Summary block at the bottom of the file:**

    Find:
    ```
    ## Summary

    total: 5
    passed: 0
    issues: 0
    pending: 5
    skipped: 0
    blocked: 0
    ```

    Replace with (assuming all 5 PASS — adjust counts if any FAIL):
    ```
    ## Summary

    total: 5
    passed: 5
    issues: 0
    pending: 0
    skipped: 0
    blocked: 0

    ## Status

    Closed atomically by Phase 7 verification (per Phase 7 D-06).
    See: ../07-post-deploy-qa-client-handoff/07-VERIFICATION.md
    ```

    Also update the frontmatter `status: partial` → `status: closed` (or `status: failed` if any UAT failed):
    ```yaml
    ---
    status: closed
    phase: 06-performance-mobile-fallback-deploy
    source: [06-VERIFICATION.md]
    started: 2026-04-26T00:00:00Z
    updated: {ISO date today}
    closed_by: 07-post-deploy-qa-client-handoff
    ---
    ```

    **Verification:**
    ```bash
    # Count "passed via 07-" occurrences — must be exactly 5
    grep -c "passed via 07-" .planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md

    # Verify no [pending] remains in result: lines
    grep -c "result: \[pending\]" .planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md
    # Must return: 0

    # Verify status flipped
    grep "^status:" .planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md
    # Must return: status: closed (or status: failed)
    ```

    If any UAT failed (per 07-VERIFICATION.md outcomes from Task 2):
    - Use `result: [failed — see 07-{plan-id}]` for that row
    - Set `status: failed` in frontmatter
    - Update Summary counts accordingly
    - This Phase 7 does NOT close until those failures are addressed (Plan 07-09 cannot be marked done; Phase status stays at «partial»)

    **Why this is a checkpoint and not auto:** the autonomous executor can technically write the inline edits, but D-06 says «atomic» — the closure is meaningful only if the dev has confirmed all 5 evidence files reflect actual passes. The checkpoint forces explicit human approval that no UAT is being prematurely flipped from pending to passed.
  </how-to-verify>
  <resume-signal>
    Type "approved" once 06-HUMAN-UAT.md shows 5/5 result: lines flipped to «passed via 07-…» (or appropriate failure markers), Summary block updated, and frontmatter status: closed (or failed). Confirm via: grep -c "passed via 07-" returns 5 AND grep -c "result: \[pending\]" returns 0.
  </resume-signal>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/check-brand-{sha}.txt` exists with ≥7 [check-brand] PASS lines, 0 FAIL
- `.planning/phases/07-post-deploy-qa-client-handoff/07-VERIFICATION.md` exists with 5 SC sections + 5-row UAT closure table + Phase 7 outcome summary
- `.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md` shows 0× `result: [pending]` AND 5× `passed via 07-` (or appropriate failure markers); frontmatter `status:` is `closed` (or `failed` if FAIL detected)
- Phase 7 STATE.md update: phase 7 marked complete + UATs marked closed (this happens via the orchestrator post-execute, not in this plan directly, but evidence is now in place)
</verification>

<success_criteria>
- Phase 7 closes: 5/5 SCs evidenced + 5/5 UATs closed atomically (D-06)
- Phase 6 HUMAN-UAT becomes a fully-closed file (no pending result: fields)
- 07-VERIFICATION.md is the single artifact a developer/auditor reads to confirm Phase 7 completion (D-33)
- Demo URL handoff to client unblocked: docs/CLIENT-HANDOFF.md §11 + 07-VERIFICATION.md jointly form the handoff bundle
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-09-SUMMARY.md`. This SUMMARY closes Phase 7.
</output>
</content>
</invoke>