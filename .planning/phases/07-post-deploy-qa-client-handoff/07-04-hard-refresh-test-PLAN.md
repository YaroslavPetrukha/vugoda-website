---
phase: 07-post-deploy-qa-client-handoff
plan: 04
type: execute
wave: 2
depends_on: ["07-03-keyboard-walkthrough"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md
autonomous: false
requirements_addressed: [DEP-03]

must_haves:
  truths:
    - "All 6 hard-refresh table rows show Pass: 5 production hash-routes + 1 unknown-slug 404/redirect path"
    - "Each row was tested in a NEW cold incognito window (not the same window 6 times) per D-10"
    - "Failure recovery procedure (D-11) is documented and STOP-condition is honored if any row fails"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md"
      provides: "6-row hard-refresh deep-link test markdown table + pass criteria + failure recovery procedure"
      min_lines: 30
  key_links:
    - from: "hard-refresh.md"
      to: "deployed URL all 5 hash-routes + /#/zhk/unknown"
      via: "cold incognito window per row"
      pattern: "Cold incognito"
    - from: "hard-refresh.md"
      to: "Phase 1 D-22 HashRouter contract (DEP-03)"
      via: "verifies 404-on-deep-link class is eliminated"
      pattern: "HashRouter"
---

<objective>
Document a 6-row hard-refresh deep-link test of every production URL on the deployed GitHub Pages site, conducted in NEW cold incognito windows (not the same window 6 times) per D-10. Each row records expected/actual content + Pass/Fail + screenshot reference if Fail.

Purpose: Closes Phase 7 SC#2 (verbatim: «Hard-refresh of every production URL works: `/#/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`, `/#/zhk/unknown` — proper 404 or redirect; no 404 class failures, no blank-screen class failures»). Also closes Phase 6 UAT-4 (D-04 absorption pairing). Verifies Phase 1 DEP-03 HashRouter contract still holds post-deploy (a regression here = HashRouter broken, hard STOP per D-11).
Output: `.planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md

<interfaces>
<!-- HashRouter contract (Phase 1 D-22, REQUIREMENTS DEP-03): -->
<!--   URLs are `/#/projects`, `/#/zhk/etno-dim`, etc. -->
<!--   GitHub Pages serves index.html for the base path; React Router parses the hash fragment client-side. -->
<!--   Hard-refresh of a deep-link URL returns the SAME index.html (because the path is just `/`); -->
<!--   the hash is then parsed by HashRouter on first render. NO 404-on-deep-link class. -->

<!-- Phase 4 D-32 unknown-slug redirect map (relevant for row 6): -->
<!--   /#/zhk/unknown should either: -->
<!--     a) Render NotFoundPage (if route catch-all is wired), OR -->
<!--     b) <Navigate> to /projects (if the redirect-on-unknown pattern is used) -->
<!--   The current implementation choice is documented somewhere in src/App.tsx routing table. Walker confirms which. -->

<!-- Phase 5 D-21 sessionStorage 'vugoda:hero-seen' flag: -->
<!--   Same incognito window across rows would carry sessionStorage between tab opens. -->
<!--   Second tab to / would measure the artificially-cheap "session-skip" hero (no parallax). -->
<!--   D-10 mandates NEW incognito window per row to ensure clean measurement (fresh sessionStorage). -->

<!-- MarkSpinner (Phase 6 D-08 lazy chunk fallback) appears briefly on /construction-log first load: -->
<!--   Tester should see the spinner for ~200-500ms before MonthGroup blocks render. -->
<!--   This is expected behavior on cold tab (chunk download); record in Actual column. -->
</interfaces>
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 1: Cold-incognito hard-refresh test of 6 URLs + write hard-refresh.md</name>
  <what-built>
    Phase 6 deployed the site to GitHub Pages with HashRouter (Phase 1 DEP-03). Phase 7 verifies cold-tab deep-links all work — closes SC#2 + UAT-4.
  </what-built>
  <how-to-verify>
    Per D-09 (6-row table format) + D-10 (new window per row) + D-11 (failure recovery):

    **Setup:**
    1. Confirm the deployed URL base. Use the Phase 6 D-37 outcome — likely `https://yaroslavpetrukha.github.io/vugoda-website/`. If a different account, substitute `{account}` in all rows below.
    2. Confirm Chrome is the testing browser (other browsers acceptable but Chrome's incognito is the canonical baseline). Note Chrome version for the doc header.
    3. Have a screenshot tool ready (Cmd+Shift+4 on macOS for region capture, or DevTools «Capture screenshot» from the Run command palette).

    **Procedure (6 rows, NEW incognito window per row per D-10):**

    For each row 1-6:
    1. Cmd+Shift+N → opens NEW incognito window (NOT a new tab in an existing incognito session — this is the D-10 distinction).
    2. Paste the row's URL into the address bar → press Enter.
    3. Wait up to 3 seconds for content to render.
    4. Compare actual content against the Expected column. Note what loaded (specific section names, lazy-chunk visible, etc.).
    5. If Pass: record «✅ Pass» in the Pass/Fail column, leave Screenshot column empty.
    6. If Fail: capture screenshot → save to `.planning/phases/07-post-deploy-qa-client-handoff/hard-refresh-fail-{row}.png` → record «❌ Fail» + screenshot path.
    7. Close the incognito window. Open a fresh one for the next row.

    **The 6 rows (D-09 verbatim, with actual deployed URL substituted):**

    | # | URL | Tab | Expected | Actual | Pass/Fail | Screenshot |
    |---|-----|-----|----------|--------|-----------|------------|
    | 1 | `https://{account}.github.io/vugoda-website/` | Cold incognito (new window) | Hero renders with «ВИГОДА» wordmark + IsometricGridBG overlay (opacity 0.1-0.2) + slogan «Системний девелопмент…» + CTA «Переглянути проекти» (active link to /#/projects) | … | … | … |
    | 2 | `https://{account}.github.io/vugoda-website/#/projects` | Cold incognito (new window) | StageFilter (4 chips: У розрахунку / У погодженні / Будується / Здано (0)) + FlagshipCard (Lakeview aerial render + external CTA) + PipelineGrid (3 cards: Етно Дім / Маєток / NTEREST) + AggregateRow (text + single-cube marker) | … | … | … |
    | 3 | `https://{account}.github.io/vugoda-website/#/zhk/etno-dim` | Cold incognito (new window) | ZhkHero (etno-dim render) + ZhkFactBlock («меморандум про відновлення будівництва», вул. Судова, Львів) + ZhkWhatsHappening + 8-image ZhkGallery + ZhkCtaPair (Instagram + mailto) | … | … | … |
    | 4 | `https://{account}.github.io/vugoda-website/#/construction-log` | Cold incognito (new window) | MarkSpinner appears briefly (lazy chunk per Phase 6 D-08) → 4 MonthGroup blocks: «Грудень 2025 · 12 фото», «Січень 2026 · 11 фото», «Лютий 2026 · 12 фото», «Березень 2026 · 15 фото» (50 photos total, lazy below fold); lightbox opens on click | … | … | … |
    | 5 | `https://{account}.github.io/vugoda-website/#/contact` | Cold incognito (new window) | Contact реквізити-block (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / ліцензія 27.12.2019) + active mailto:vygoda.sales@gmail.com + dash placeholder for phone/address (literal `—`, NOT `{{token}}`) + 4 disabled-style social `href="#"` links | … | … | … |
    | 6 | `https://{account}.github.io/vugoda-website/#/zhk/unknown` | Cold incognito (new window) | Either: NotFoundPage rendered, OR `<Navigate>` redirect (the URL bar should auto-flip to /#/projects per Phase 4 D-32 redirect map). Verify which behavior applies — both are «proper 404» per SC#2 verbatim («proper 404 or redirect»). NEITHER blank screen NOR 404 from GH Pages itself (if that happens, HashRouter is broken — STOP per D-11). | … | … | … |

    **Pass criteria (paste into doc above the table OR after the table):**
    ```
    ## Pass criteria
    - Pass = expected content fully visible within 3s on a cold tab; no GH Pages 404; no blank screen; no JS errors in console (Cmd+Opt+J to inspect)
    - Fail = any expected element missing, OR GH Pages 404 page (white page with «There isn't a GitHub Pages site here»), OR blank white/black screen, OR JS error in console
    - Row 6 specifically: Pass = NotFoundPage OR Navigate redirect renders; Fail = GH Pages 404 (which would mean HashRouter broken)
    ```

    **Failure recovery (D-11) — paste below pass criteria:**
    ```
    ## Failure recovery (D-11)

    If any row fails:
    1. Record the failure with screenshot in the table (above).
    2. STOP Phase 7 progression — DO NOT proceed to Plan 07-05/06/07/08/09 until the failure is resolved.
    3. The failure indicates a regression of DEP-03 / Phase 1 D-22 HashRouter contract — high-severity.
    4. Trigger /gsd:debug against the failure: identify root cause (likely .nojekyll missing, or vite.config.ts base path drift, or HashRouter import regression).
    5. Fix the underlying issue, push to main, wait for CI deploy, RESUME Phase 7 verification — re-run this entire 6-row test in fresh incognito windows (D-10 still applies on retry).
    6. Phase 7 does NOT band-aid a deep-link failure (no manual workarounds, no client-side rewrite hacks).
    ```

    **File output structure:**
    ```markdown
    # Phase 7 — Hard-refresh Deep-link Test (SC#2 + UAT-4)

    **Date:** {ISO date}
    **Tester:** {name}
    **Browser:** Chrome {version}
    **Deployed URL base:** https://{account}.github.io/vugoda-website/

    | # | URL | Tab | Expected | Actual | Pass/Fail | Screenshot |
    | 1 | … | Cold incognito | … | … | … | … |
    …
    | 6 | … | Cold incognito | … | … | … | … |

    ## Pass criteria
    …

    ## Failure recovery (D-11)
    …
    ```

    **Time estimate:** ~10-15 min (6 windows × ~2 min each including window open/close).

    **D-10 enforcement reminder:** Each row uses a NEW incognito WINDOW (Cmd+Shift+N), not a new TAB in an existing window. Reasoning: Phase 5 D-21 sessionStorage `vugoda:hero-seen` flag persists within a session — a second / visit in the same incognito session would skip parallax and produce a not-cold measurement. The walkthrough must measure the genuine cold-tab experience that the client will see when first opening each URL.

    **Stub fallback (if autonomous executor cannot perform manual walk):** create the file as a STUB with the full structure above + the 6-row table populated with TODO/placeholder rows for the dev to fill manually. Plan 07-09 will block on dev completing the manual test.
  </how-to-verify>
  <resume-signal>
    Type "approved" if all 6 rows show ✅ Pass. Otherwise describe failures with row numbers + screenshot paths; STOP signal applies per D-11.
  </resume-signal>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md` exists
- File contains a markdown table with exactly 6 data rows (rows 1-6, hash-routes per D-09 verbatim)
- File contains H2 «## Pass criteria» section
- File contains H2 «## Failure recovery (D-11)» section
- Each of the 6 «Tab» column cells reads «Cold incognito (new window)» (D-10 enforcement)
- Each row's Pass/Fail column is filled with ✅ Pass — OR ❌ Fail with a screenshot path that exists on disk
- If any row is ❌, Plan 07-09 will treat as blocking
</verification>

<success_criteria>
- Phase 7 SC#2 closure: 6-row hard-refresh table evidences cold-tab deep-link of all 5 production routes + 1 unknown-slug path renders correctly
- Phase 6 UAT-4 closure (per D-04 absorption pairing)
- Phase 1 DEP-03 HashRouter contract verified post-deploy still holds
- Plan 07-09 can cite this file as SC#2 + UAT-4 closure pointer
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-04-SUMMARY.md`.
</output>
