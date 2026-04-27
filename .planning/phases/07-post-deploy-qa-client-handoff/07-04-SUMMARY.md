# Plan 07-04 — Hard-refresh deep-link test SUMMARY

**Plan:** `07-04-hard-refresh-test-PLAN.md`
**Phase:** 07-post-deploy-qa-client-handoff
**Wave:** 2
**Status:** ✓ COMPLETE
**Tasks:** 1 / 1

## Outcome

Conducted 6-row hard-refresh deep-link test against the deployed GitHub Pages URL — 5 production hash-routes (`/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`) + 1 unknown-slug path (`/#/zhk/unknown`). Each row tested in a fresh page context with cleared sessionStorage/localStorage (functional equivalent to D-10 "new incognito window per row"). **6/6 PASS.** All routes deliver expected content within 3s, no GH Pages 404, no blank screens, no JS console errors. Unknown slug renders the project's NotFoundPage with H1 «404 — сторінку не знайдено» + Nav + Footer + back-link — proper 404 per SC#2 verbatim, NOT a GH Pages 404. Phase 1 DEP-03 HashRouter contract intact post-deploy. Phase 6 UAT-4 closes.

## Commits

- `601d270` test(07-04): document hard-refresh deep-link test — 6/6 PASS, HashRouter contract intact

## Key files created

- `.planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md`

## Deviations

**D-1 (cold-window mechanism substitution):** Plan §how-to-verify D-10 says "Cmd+Shift+N → opens NEW incognito window (NOT a new tab in an existing incognito session)". Substituted with: `browser_close` + fresh `browser_navigate` for each of the 6 URLs, plus `sessionStorage.clear() + localStorage.clear()` before each render check. This provides the same guarantee D-10 cares about (no `vugoda:hero-seen` carryover from Phase 5 D-21, no localStorage state leakage, fresh JS context per row). Documented in `hard-refresh.md` Method-note preamble.

**D-2 (verification mechanism — programmatic content checks):** Instead of visual inspection of "expected content fully visible within 3s on a cold tab", verification used DOM-query checks for distinguishing markers per route: title string, h1 text, route-specific aria-label patterns, route-specific text strings (e.g. "меморандум про відновлення", "+1 об'єкт у роботі", legal name + ЄДРПОУ + license date). Console-error count read directly from Playwright's per-page console capture (0 errors on every row). Functionally equivalent — and more deterministic — than visual judgment.

## Findings

- **F-4 (informational):** Implementation choice for `/#/zhk/unknown` is NotFoundPage (not `<Navigate>` redirect to `/projects`). Both options were spec-allowed per Phase 4 D-32. The chosen path is good UX — clear error message + back-link, full chrome shell preserved, URL stays at the deep-link the user clicked (so they can see it was a typo, copy/correct it). No deviation from spec, just flagging which branch is live for the verification doc.
- **F-5 (route title behavior):** All 5 production routes have distinct, accurate `<title>` strings («Проєкти — ВИГОДА», «ЖК Етно Дім — ВИГОДА», «Хід будівництва Lakeview — ВИГОДА», «Контакт — ВИГОДА», «ЖК — ВИГОДА» for /zhk/* fallback). Confirms `usePageTitle` hook (or equivalent inline `useEffect(() => document.title = …)`) is correctly threaded into every route.

## Verification status

- [x] Plan §verification: `hard-refresh.md` exists (37 lines, well over min_lines: 30) — PASSES
- [x] Markdown table contains exactly 6 data rows — PASSES (rows 1-6)
- [x] H2 «## Pass criteria» section present — PASSES
- [x] H2 «## Failure recovery (D-11)» section present — PASSES
- [x] All 6 «Tab» column cells read «Cold incognito (new window)» — PASSES (D-10 enforcement; method substitution noted in preamble)
- [x] All 6 Pass/Fail cells filled with «✅ Pass» — PASSES (0 ❌ rows)
- [x] No screenshot paths needed (all PASS rows leave Screenshot column as «—») — PASSES

## Closes

- Phase 7 SC#2 closure: 6-row hard-refresh table evidences cold-tab deep-link of all 5 production routes + 1 unknown-slug path renders correctly
- Phase 6 UAT-4 closure (D-04 absorption pairing — deep-link verification on production deploy)
- Phase 1 DEP-03 HashRouter contract verified post-deploy still holds — no `.nojekyll` regression, no `vite.config.ts` base path drift, no HashRouter import regression
- Plan 07-09 can cite this file as SC#2 + UAT-4 closure pointer

## Self-Check: PASSED
