---
phase: 07-post-deploy-qa-client-handoff
plan: 03
type: execute
wave: 2
depends_on: ["07-01-axe-script-and-devdep", "07-02-clienthandoff-section-11"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md
autonomous: false
requirements_addressed: [VIS-01, NAV-01]

must_haves:
  truths:
    - "All 5 production routes (`/`, `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`) walked Tab→Enter only with a recorded checklist"
    - "Every interactive element on each route shows visible :focus-visible outline (2px #C1F33D, 2px offset on dark) per Phase 1 D-21"
    - "Lightbox dialogs on /construction-log AND /zhk/etno-dim trap focus while open AND release on Esc"
    - "No focus traps detected anywhere outside lightbox; Tab cycles return to first focusable after final element"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md"
      provides: "Per-route 5-column markdown checklist of every interactive element + dedicated 3-step focus-trap subsection for 2 lightbox surfaces"
      min_lines: 80
  key_links:
    - from: "keyboard-walkthrough.md"
      to: "deployed URL all 5 routes"
      via: "manual Tab+Enter walk"
      pattern: "https://.+\\.github\\.io/vugoda-website"
    - from: "keyboard-walkthrough.md"
      to: ":focus-visible outline (Phase 1 D-21)"
      via: "visual verification per element"
      pattern: "Visible focus-visible outline"
---

<objective>
Manually walk all 5 production routes via Tab → Enter only on the deployed GitHub Pages URL, recording a per-route 5-column markdown checklist of every interactive element. Verify two lightbox surfaces (`/construction-log` 50-photo gallery + `/zhk/etno-dim` 8-render gallery) trap focus while open and release on Esc.

Purpose: Closes Phase 7 SC#1 (verbatim: «Keyboard-only walkthrough of all 5 routes on deployed URL: every interactive element reachable, visible :focus-visible outline, no focus traps; Esc closes lightbox»). Verifies Phase 1 D-21 focus-visible rule (2px #C1F33D outline) still fires post-deploy on lazy-loaded chunks (Phase 6 D-08). NO scripted test — manual recorded walkthrough per D-07.

**Wave 2 boundary (D-34):** This is the first Wave 2 plan. `depends_on` formally lists Wave 1 plans (07-01, 07-02) to make the wave-1 → wave-2 boundary self-describing in the dependency graph. Functional no-op (the wave system already serializes), but eliminates ambiguity for re-planners and graph-walkers.

Output: `.planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@brand-system.md

<interfaces>
<!-- Phase 1 D-21 :focus-visible global rule (set in src/index.css @theme block): -->
<!--   2px outline color #C1F33D (brand accent) -->
<!--   2px offset -->
<!--   On dark backgrounds (Nav, Footer, ContactForm closer): high-contrast accent visible -->
<!--   On light backgrounds: WCAG-compliant fallback (browser default OR brand-system §6 rule) -->

<!-- Lightbox component (Phase 4 Plan 04-02 + ZhkGallery + ConstructionLogPage MonthGroup): -->
<!--   Native <dialog> element via showModal() -->
<!--   Esc closes per browser default <dialog> behavior -->
<!--   Focus is trapped inside <dialog> (browser-managed) -->
<!--   On close, focus returns to triggering button (Phase 4 D-22..D-32) -->

<!-- HashRouter URLs (Phase 1 D-22, Phase 6 D-31): -->
<!--   https://{account}.github.io/vugoda-website/#/ -->
<!--   https://{account}.github.io/vugoda-website/#/projects -->
<!--   https://{account}.github.io/vugoda-website/#/zhk/etno-dim -->
<!--   https://{account}.github.io/vugoda-website/#/construction-log -->
<!--   https://{account}.github.io/vugoda-website/#/contact -->

<!-- Lazy chunks (Phase 6 D-08): /projects, /zhk/etno-dim, /construction-log, /contact lazy-load via React.lazy(). -->
<!-- MarkSpinner suspense fallback. Walkthrough must verify focus stack is preserved across the lazy boundary. -->
</interfaces>
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 1: Manual keyboard walkthrough of 5 routes + lightbox focus-trap verification</name>
  <what-built>
    Phase 6 ships HashRouter on GH Pages with focus-visible global rule and 2 lightbox surfaces. Phase 7 verifies these still work post-deploy.
  </what-built>
  <how-to-verify>
    Per D-07 (manual per-route checklist) + D-08 (lightbox focus-trap subsection):

    **Setup:**
    1. Open the deployed URL in a fresh browser tab (Chrome recommended; Firefox + Safari acceptable). Confirm the URL — should be `https://{account}.github.io/vugoda-website/` where `{account}` matches Phase 6 D-37/D-38 outcome (likely `yaroslavpetrukha` per Phase 6 D-26). If the actual deployed URL differs, use the actual one.
    2. Click into the address bar then back into the page body to reset focus to document root. (Avoid mouse on interactive elements during the walk.)
    3. Record results in `.planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md`.

    **For each of 5 routes** — use the same column schema (D-07 + planner discretion: identical headers across routes for scannability):

    Header per route:
    ```markdown
    ## Route: {URL}

    | # | Element | Reachable via Tab | Visible focus-visible outline | Activates correctly (Enter/Space) | Notes |
    |---|---------|-------------------|-------------------------------|-----------------------------------|-------|
    ```

    Walk Tab through every interactive element from page top to bottom, recording one row per element. Expected element counts (approximate, drives Notes column if a count diverges):
    - **`/` (home, ~10-15 elements):** Skip-to-main link (if present) → Nav logo + 4 nav links → Hero CTA «Переглянути проекти» → BrandEssence (no clickables, value cards are static) → PortfolioOverview FlagshipCard CTA («Перейти на сайт проекту ↗» — opens external Lakeview) → 3 PipelineGrid card links (or hover-to-reveal CTAs) → ConstructionTeaser left/right arrow buttons + «Дивитись повний таймлайн» CTA → MethodologyTeaser «Детальніше про процес» CTA (if present) → TrustBlock email mailto link → ContactForm mailto button → Footer email mailto + 4 footer links.
    - **`/projects` (~10 elements):** Nav (5) → FlagshipCard external CTA → 4 StageFilter chip buttons → 3 PipelineGrid card links → AggregateRow has no clickables → Footer (already counted but Tab continues).
    - **`/zhk/etno-dim` (~12-15 elements):** Nav → Back-to-projects link if present → ZhkHero has no clickables → ZhkFactBlock has no clickables → ZhkWhatsHappening has no clickables → 8 ZhkGallery thumbnails (each opens lightbox) → ZhkCtaPair: «Підписатись на оновлення (Instagram)» link + mailto CTA → Footer.
    - **`/construction-log` (variable; 50 photo links):** Nav → Page header has no clickables → 4 MonthGroup blocks each with N photo links (12 + 11 + 12 + 15 = 50 total clickables) → Footer. **Tab through ALL 50** to verify Tab cycles through every photo and the focus-visible outline shows on each. Record one row per MonthGroup with element count + spot-check «first photo, middle photo, last photo» of each group.
    - **`/contact` (~5 elements):** Nav → реквізити-block (no clickables) → mailto active link → 4 disabled-style social `href="#"` (verify Tab still reaches them — they're focusable; Notes: «cursor-disabled style applies but Tab reaches per WCAG»; Enter does nothing useful but should not error) → Footer.

    For each row:
    - **Reachable via Tab:** ✅ if Tab reaches it in expected DOM order, ❌ if skipped.
    - **Visible focus-visible outline:** ✅ if 2px #C1F33D outline + 2px offset visible (Phase 1 D-21); ❌ if no outline OR wrong color OR wrong offset. Record the actual color in Notes if non-conformant.
    - **Activates correctly:** ✅ if Enter (for links) or Space/Enter (for buttons) triggers expected action (page nav for links, button click for buttons). For external links — verify new tab opens via Cmd+Enter or default Enter (depending on rel/target).
    - **Notes:** any deviation, screenreader label issues, focus order anomaly.

    **Lightbox focus-trap subsection** (D-08; dedicated 3-step subsection in the walkthrough doc, AFTER all 5 route tables):

    ```markdown
    ## Lightbox focus-trap verification (D-08)

    ### /construction-log lightbox

    1. Tab to first photo thumbnail in any MonthGroup → press Enter to open lightbox.
       - Expected: native `<dialog>` opens via `showModal()`, focus moves into the dialog, body scroll locked.
       - Actual: …
       - Pass/Fail: …

    2. Tab inside the open lightbox repeatedly. Expected: focus cycles among lightbox controls (close button, prev/next if present) and does NOT escape to the underlying page.
       - Actual: …
       - Pass/Fail: …

    3. Press Esc. Expected: lightbox closes, focus returns to the triggering thumbnail (Phase 4 D-22..D-32 contract).
       - Actual: …
       - Pass/Fail: …

    ### /zhk/etno-dim lightbox

    Same 3-step procedure on the 8-render ZhkGallery. Repeat all 3 steps; record results.
    ```

    **Pre-walkthrough verifications:**
    - All 5 routes loaded at least once on the deployed URL (cold tab or refresh).
    - Browser is full desktop (not mobile/tablet emulation) — viewport ≥1280px so the production layout, NOT MobileFallback, renders.
    - DevTools is closed during the walk to avoid devtools-Tab-cycling artifacts.

    **Failure handling (D-11 analog):**
    If any element fails (no Tab reachability, missing focus outline, wrong color, focus trap escape, Esc-doesn't-close, focus doesn't return on close):
    1. Record the failure with a screenshot saved to `.planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough-fail-{N}.png`.
    2. Add a "❌ Pass/Fail" cell pointing to the screenshot.
    3. Continue the walkthrough — don't abort on first failure (capture full picture).
    4. After the walkthrough completes, the verification doc (Plan 07-09) MUST flag any ❌ as a blocking issue and trigger `/gsd:debug` against the offending component.

    **Time estimate:** ~25-30 min for a one-pass walkthrough of all 5 routes + 2 lightbox surfaces.

    **File output structure:**
    ```markdown
    # Phase 7 — Keyboard Walkthrough (SC#1)

    **Date:** {ISO date}
    **Tester:** {name}
    **Browser:** Chrome {version}
    **Deployed URL base:** https://{account}.github.io/vugoda-website/
    **Viewport:** {width}×{height}

    ## Route: /
    | # | Element | … | … | … | Notes |
    | 1 | Nav: Logo (link to /) | ✅ | ✅ | ✅ | — |
    | 2 | Nav: Проекти | ✅ | ✅ | ✅ | — |
    …

    ## Route: /projects
    …

    ## Route: /zhk/etno-dim
    …

    ## Route: /construction-log
    …

    ## Route: /contact
    …

    ## Lightbox focus-trap verification (D-08)
    ### /construction-log lightbox
    …
    ### /zhk/etno-dim lightbox
    …

    ## Summary

    | Route | Total elements | Passed | Failed |
    |-------|----------------|--------|--------|
    | / | … | … | … |
    | /projects | … | … | … |
    | /zhk/etno-dim | … | … | … |
    | /construction-log | … | … | … |
    | /contact | … | … | … |

    **Outcome:** PASS (all elements reachable, focus-visible visible, no traps, Esc closes) / FAIL (see ❌ rows + screenshots)
    ```

    **If autonomous executor cannot perform manual walk:** create the file as a STUB with the full structure above + each table populated with TODO/placeholder rows (one row per known interactive element from the codebase audit) for the dev to fill manually. Better than nothing in the evidence directory; Plan 07-09 will block on the dev completing the manual walk.
  </how-to-verify>
  <resume-signal>
    Type "approved" if all 5 routes pass + both lightbox surfaces pass + Summary table shows zero ❌ rows. Otherwise describe failures with row references and screenshot paths.
  </resume-signal>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough.md` exists
- File contains 5 H2 «## Route:» headers (one per production route)
- File contains H2 «## Lightbox focus-trap verification (D-08)» with 2 H3 sub-sections (`### /construction-log lightbox`, `### /zhk/etno-dim lightbox`)
- File contains a final «## Summary» H2 with a 5-row aggregate table
- Each route's element table has the standard 5-column header (Element / Reachable / Outline / Activates / Notes per D-07 planner discretion: identical headers)
- No ❌ rows in the Summary (PASS outcome) — OR if any ❌, a screenshot file exists at `.planning/phases/07-post-deploy-qa-client-handoff/keyboard-walkthrough-fail-*.png` and Plan 07-09 will treat as blocking
</verification>

<success_criteria>
- Phase 7 SC#1 closure: keyboard walkthrough doc evidences every interactive element on 5 routes is Tab-reachable with visible :focus-visible outline + lightbox surfaces correctly trap+release focus on Esc
- Phase 1 D-21 :focus-visible accent rule still fires post-deploy (verifies it survived Phase 6 lazy-chunk introduction)
- Plan 07-09 can cite this file as SC#1 closure pointer
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-03-SUMMARY.md`.
</output>
</content>
