---
status: passed
phase: 07-post-deploy-qa-client-handoff
date: 2026-04-27
author: Phase 7 execution (Claude)
---

# Phase 7 — Verification (Post-deploy QA & Client Handoff)

**Phase:** 07-post-deploy-qa-client-handoff
**Status:** ✓ COMPLETE — 5/5 SCs passed, 5/5 UATs closed
**Bundle audited:** `assets/index-C35JwVpg.js` from commit `de3b2b3` (deployed to https://yaroslavpetrukha.github.io/vugoda-website/)
**Postbuild check-brand re-run:** 7/7 PASS at HEAD `4d726d6` (this consolidation commit)

This document is the consolidated artifact pointer for Phase 7's 5 success criteria + 5 absorbed Phase 6 UAT items. Each section links to the evidence file produced by the corresponding plan.

## Success Criteria

### SC#1: Keyboard-only walkthrough of all 5 routes

Verbatim from ROADMAP.md: «Keyboard-only walkthrough of all 5 routes on deployed URL: every interactive element (nav links, CTAs, card links, filter buttons, mailto CTA, lightbox open/close) is reachable and shows visible :focus-visible outline; no focus traps; Esc closes lightbox dialogs»

- **Evidence:** [keyboard-walkthrough.md](./keyboard-walkthrough.md)
- **Plan:** 07-03-keyboard-walkthrough
- **Closure threshold:** Summary table shows zero ❌ rows; both lightbox surfaces (/construction-log + /zhk/etno-dim) pass focus-trap + Esc subsection
- **Outcome:** ✅ **PASS** — 134 / 134 interactive elements across 5 routes Tab-reachable with visible 2px solid #C1F33D outline + 2px offset (Phase 1 D-21 confirmed live in deployed CSS); both lightbox surfaces verified open/Tab-trap/Esc/focus-return

### SC#2: Hard-refresh deep-link of every production URL works

Verbatim from ROADMAP.md: «Hard-refresh (cold incognito tab) of every production URL works: /#/, /#/projects, /#/zhk/etno-dim, /#/construction-log, /#/contact, /#/zhk/unknown (→ proper 404 or redirect); no 404 class failures, no blank-screen class failures»

- **Evidence:** [hard-refresh.md](./hard-refresh.md)
- **Plan:** 07-04-hard-refresh-test
- **Closure threshold:** All 6 rows ✅ Pass; new incognito window per row honored (D-10)
- **Outcome:** ✅ **PASS** — 6 / 6 cold-context loads pass (5 production routes + `/#/zhk/unknown` → NotFoundPage with H1 «404 — сторінку не знайдено»). HashRouter contract intact, no GH Pages 404, no blank screens, 0 console errors

### SC#3: Build-output denylist + axe-core a11y

Verbatim from ROADMAP.md: «Build-output grep audit passes: grep -r 'Pictorial|Rubikon|Пикторіал|Рубікон' dist/ empty; grep -r '{{' dist/ empty; grep -r 'TODO' dist/ empty; axe-core run per route reports zero critical a11y issues»

- **Evidence (denylist):** [check-brand-4d726d6.txt](./check-brand-4d726d6.txt) — 7/7 [check-brand] PASS lines, 0 FAIL
- **Evidence (axe):** [axe/axe-summary.md](./axe/axe-summary.md) + 5 per-route JSONs in [axe/](./axe/)
- **Plans:** 07-01-axe-script-and-devdep (axe), inherited from Phase 5+6 (check-brand)
- **Closure threshold:**
  - check-brand: 7/7 PASS, 0 FAIL ✓
  - axe: 0 critical AND 0 serious across 5 routes ✓ (D-16 strengthened threshold)
- **Outcome:** ✅ **PASS** — denylistTerms / paletteWhitelist / placeholderTokens / importBoundaries / noInlineTransition / bundleBudget (133.7 KB gzipped, 67% of 200 KB limit) / heroBudget (all hero variants ≤200KB) all PASS. Axe-core 0 critical / 0 serious / 0 violations across 5 routes (Plan 07-01)

### SC#4: Lighthouse archived + layout verified at 4 widths + mobile fallback

Verbatim from ROADMAP.md: «Lighthouse desktop results archived per route (≥90 all 4 categories documented); tested at 1280 / 1366 / 1440 / 1920 widths for layout verification; mobile fallback rendered correctly at <1024px»

- **Evidence (scores):** [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md)
- **Evidence (desktop layouts):** [layout/SUMMARY.md](./layout/SUMMARY.md) + 20 PNGs in [layout/](./layout/)
- **Evidence (mobile fallback):** [layout/mobile-375.png](./layout/mobile-375.png)
- **Plans:** 07-05-layout-screenshots, 07-06-mobile-fallback-screenshot, 07-07-lhci-archive
- **Closure threshold:**
  - Lighthouse: all 4 categories ≥0.9 on all 5 routes ✓
  - Layout: 20 PNGs captured + SUMMARY.md checklist 100% pass per route×width ✓
  - Mobile: mobile-375.png shows MobileFallback (not desktop) with all expected elements ✓
- **Outcome:** ✅ **PASS**
  - Lighthouse minimums: Performance 0.98, Accessibility 0.98, Best Practices 1.00, SEO 1.00 (5 routes × 4 categories = 20 cells, 0 violations)
  - 20 desktop PNGs + 5×4 brand-system §3-7 checklist all PASS (no horizontal scroll, brand 6-color palette holds, hero hierarchy intact, no card overflow, no clipped text)
  - Mobile fallback @ 375×844: MobileFallback short-circuit confirmed (Layout.tsx D-02..D-07 wiring live), Logo + ВИГОДА wordmark + body + mailto + 4 stacked CTAs + juridical block visible; Nav/Footer correctly hidden

### SC#5: docs/CLIENT-HANDOFF.md §11 lists all 8 open items

Verbatim from ROADMAP.md: «docs/CLIENT-HANDOFF.md exists listing all 8 open CONCEPT §11 items (phone, юр. адреса, Pipeline-4 назва, Model-Б підтвердження, методологія блоки 2/5/6 верифікація, slug транслітерація maietok vs maetok, NTEREST без I підтвердження, Етно Дім вул. Судова підтвердження)»

- **Evidence:** [../../../docs/CLIENT-HANDOFF.md](../../../docs/CLIENT-HANDOFF.md) §11 section + dev appendix
- **Plan:** 07-02-clienthandoff-section-11
- **Closure threshold:** §11 H2 section appended; 8-row table populated verbatim from D-29; dev appendix has 8 H3 sub-sections; existing GH-account section (Phase 6) untouched
- **Outcome:** ✅ **PASS** — §11 «Open Client Items» H2 + 4-column UA-language client-facing table (8 rows) + collapsed `<details>` dev appendix (8 H3 sub-sections mapping each answer to file edits). Phase 6 GH-account preview note preserved verbatim

## UAT Closure (Phase 6 → Phase 7 absorption per D-01..D-06)

| UAT | Phase 6 expected | Phase 7 closure plan | Evidence | Status |
|-----|------------------|----------------------|----------|--------|
| UAT-1 | Lighthouse desktop ≥90 on deployed URL (4 cats × 5 routes) | 07-07-lhci-archive | [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md) | passed via 07-07 |
| UAT-2 | MobileFallback visual at <1024px | 07-06-mobile-fallback-screenshot | [layout/mobile-375.png](./layout/mobile-375.png) | passed via 07-06 |
| UAT-3 | Social unfurl Viber/Telegram/Slack | 07-08-social-unfurl-verify | [unfurls/SUMMARY.md](./unfurls/SUMMARY.md) + 3 PNGs | passed via 07-08 |
| UAT-4 | Hard-refresh deep-link incognito (5 routes) | 07-04-hard-refresh-test | [hard-refresh.md](./hard-refresh.md) | passed via 07-04 |
| UAT-5 | lhci CI workflow_run chain validation | 07-07-lhci-archive | [lighthouse/SUMMARY.md](./lighthouse/SUMMARY.md) UAT-5 section | passed via 07-07 |

## Findings (informational, not blocking)

These items surfaced during Phase 7 evidence-gathering. None block phase closure; all are recorded for client-handoff transparency or v2 backlog.

- **F-1 (content sourcing):** ZhkHero render on `/zhk/etno-dim` carries a "ЛУН" 3rd-party watermark in the bottom-right corner. Silent-displacement rule (Phase 1) applies only to Lakeview (Pictorial/Rubikon), so this is NOT a brand-rule violation — but it IS a content-sourcing item the client should be aware of. Recommend swap pre-handoff if client requests. Recorded in `layout/SUMMARY.md`.
- **F-2 (capture pipeline):** Lazy-loading on /construction-log occasionally leaves the last MonthGroup partially loaded for ≥1.5s after the IntersectionObserver fires. Capture pipeline handles this via 2-pass scroll + image-decode await. Confirms Phase 6 lazy-load is working — NOT a deployed-code defect.
- **F-3 (deploy-pipeline gap):** `origin/main` was 49 commits behind local main at start of Phase 7 (deployed bundle was Phase 5 final). Resolved mid-execution by pushing `bb76dbf..de3b2b3` and waiting for fresh deploy run `24979632726`. Recommend a phase-completion git-push gate (or branch-protection rule) so `/gsd:execute-phase` can never start QA against a stale deploy. Surface to backlog for v2.
- **F-4 (404 implementation choice):** `/#/zhk/unknown` renders NotFoundPage (not `<Navigate>` redirect to `/projects`). Both options were spec-allowed per Phase 4 D-32. The chosen path is good UX — clear error message + back-link, full chrome shell preserved, URL stays at the deep-link the user clicked. No deviation from spec.
- **F-5 (route titles):** All 5 production routes have distinct, accurate `<title>` strings (per-route titles thread correctly through HashRouter). Phase 7 finding confirms route-title behavior is intact.
- **F-6 (lhci CI artifact pipeline):** `.lighthouserc.cjs` has `upload.target: 'temporary-public-storage'` which causes lhci to upload LHRs to Google CDN AND clean up local `.lighthouseci/` after upload — meaning `actions/upload-artifact@v4` finds an empty directory. CI run scores were obtained via D-20 fallback (local `lhci collect`). Backlog item: edit `.lighthouserc.cjs` to drop `upload.target` for CI variant so future runs produce downloadable artifacts on `gh run download`. Documented in `lighthouse/SUMMARY.md`.

## Phase 7 outcome

- **SCs passed:** 5 / 5
- **UATs closed:** 5 / 5
- **Phase status:** ✓ COMPLETE

## Next steps

- ✓ Demo URL ready for client handoff: https://yaroslavpetrukha.github.io/vugoda-website/
- Hand off the demo URL + this document + `docs/CLIENT-HANDOFF.md` to client
- Client uses `docs/CLIENT-HANDOFF.md` §11 to answer 8 open items in one reply
- Post-handoff: dev applies edits per the §11 dev appendix (D-30); F-1/F-3/F-6 recorded for backlog
