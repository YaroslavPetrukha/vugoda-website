# Phase 7: Post-deploy QA & Client Handoff — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 07-post-deploy-qa-client-handoff
**Mode:** discuss (standard)
**Areas discussed:** A11y audit depth, Lighthouse archive scope, Phase 6 HUMAN-UAT closure, CLIENT-HANDOFF.md §11 format

---

## Gray-area triage

| Option | Description | Selected |
|--------|-------------|----------|
| A11y audit depth | Manual keyboard checklist vs scripted axe-core run vs CI-gated | ✓ |
| Lighthouse archive scope | Full grid vs sampled (lhci-CI + manual screenshots) vs minimal | ✓ |
| Phase 6 HUMAN-UAT closure | Absorb into Phase 7 vs run /gsd:verify-work first vs cross-reference only | ✓ |
| CLIENT-HANDOFF.md §11 format | One-pass table vs per-item ticket vs Q&A vs split docs | ✓ |

**User's choice:** All 4 areas selected for deep-dive (multiSelect).

---

## Phase 6 HUMAN-UAT Closure

| Option | Description | Selected |
|--------|-------------|----------|
| Absorb all 5 into Phase 7 | Phase 7 plan tasks explicitly cover UAT-1–5; UAT-3 + UAT-5 get dedicated tasks; `06-HUMAN-UAT.md` `result:` flips when Phase 7 evidence lands | ✓ |
| Run /gsd:verify-work for Phase 6 first | Closes Phase 6 UAT independently before Phase 7 begins; cleaner separation, duplicates keyboard/incognito work | |
| Cross-reference only | Phase 7 plan cites which tasks satisfy which UAT, items remain in `06-HUMAN-UAT.md`, closed separately; most paperwork-heavy | |

**User's choice:** Absorb all 5 into Phase 7 (Recommended).
**Notes:** Drives D-01..D-06 in CONTEXT.md. UAT-1, UAT-2, UAT-4 map directly to Phase 7 SC#1/2/4; UAT-3 (social unfurl) and UAT-5 (lhci chain) get dedicated Phase 7 tasks despite no SC overlap because they're handoff-quality gates.

---

## A11y Audit Depth

| Option | Description | Selected |
|--------|-------------|----------|
| One-shot script + archive | `@axe-core/cli` devDep + `scripts/axe-audit.mjs` against `vite preview` localhost; JSON archive to phase dir; NOT a CI gate | ✓ |
| CI-permanent gate in deploy.yml | Adds axe job after deploy, fails build on critical violations; persistent quality guard, adds CI surface | |
| Manual axe DevTools sweep + checklist | Developer runs axe DevTools browser extension, records pass/fail; no machine-readable evidence | |

**User's choice:** One-shot script + archive (Recommended).
**Notes:** Drives D-13..D-18 in CONTEXT.md. SC#3 says «axe-core run per route reports zero critical issues» — CLI satisfies the «run» semantic and produces machine-readable JSON evidence. Promotion path to CI gate is a documented v2 deferred idea.

### Follow-up: axe target

| Option | Description | Selected |
|--------|-------------|----------|
| `vite preview` localhost | Same dist/ output as production, no network/CI flakiness, repeatable | ✓ |
| Deployed GH Pages URL | Catches GH Pages serving quirks; flaky on CDN warmup; account-name dependent | |
| Both — localhost in script + live URL in manual smoke | Belt-and-suspenders; extra plumbing | |

**User's choice:** `vite preview` localhost (Recommended).
**Notes:** Drives D-13/D-14. Deployed URL still gets keyboard / hard-refresh / Lighthouse smoke testing — those need GH Pages-specific behaviour. Axe-core scoring is DOM-only and doesn't differ between targets.

---

## Lighthouse Archive Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Sampled: lhci-CI scores + manual screenshots at other widths | Trust lhci CI for 1920×5 routes; layout-only screenshots at 1280/1366/1440/1920; ~30 min one-pass; no per-width LH score noise | ✓ |
| Full grid: 4 widths × 5 routes Lighthouse runs | 20 manual LH passes + 1 mobile; ~2 hours; LH scores virtually identical at 1280 vs 1366 (no narrative win) | |
| Minimal: lhci-CI + 1 mobile screenshot | Trust lhci CI as SC#4 evidence; no layout grid; trades thoroughness for speed | |

**User's choice:** Sampled — lhci-CI for scores + manual screenshots at other widths (Recommended).
**Notes:** Drives D-19..D-26. Score-source-of-truth = lhci CI artifact (1920 desktop preset × 5 routes × 4 categories). Layout verification at other widths is screenshot-only, no Lighthouse re-run.

### Follow-up: layout-screenshot capture tool

| Option | Description | Selected |
|--------|-------------|----------|
| Manual DevTools resize + screenshot | Tedious but no new dep; ~30 min one-pass; full-size capture via DevTools menu | ✓ |
| Headless Chrome script (no Playwright) | `scripts/capture-layouts.mjs` shells out to system Chrome with `--headless --window-size=… --screenshot=…`; reproducible | |
| Playwright + script | Add Playwright as devDep; over-engineered for one-time capture | |

**User's choice:** Manual DevTools resize + screenshot (Recommended).
**Notes:** Drives D-22..D-25. 21 PNGs total: 5 routes × 4 widths + 1 mobile. Saved to `.planning/phases/07-.../layout/`.

---

## CLIENT-HANDOFF.md §11 Format

| Option | Description | Selected |
|--------|-------------|----------|
| One-pass 4-col table + dev appendix | Columns: Питання / Поточне значення / Що зміниться / Пріоритет; client answers all 8 in one email; separate dev-side mapping appendix | ✓ |
| Per-item checklist sections (H3 headers) | Each item gets H3 with question + current + impact; harder to scan, more context per item | |
| Two-column Q&A | Just Question + Current placeholder; minimal, no impact column, no priority | |
| Split: client-facing 1-pager + dev-facing appendix | Two docs (`docs/CLIENT-DEMO.md` + existing `docs/CLIENT-HANDOFF.md`); cleaner separation but two-doc-sync overhead | |

**User's choice:** One-pass 4-col table (Recommended).
**Notes:** Drives D-27..D-32 in CONTEXT.md. 8 items locked verbatim from PROJECT.md «Відкриті питання». Existing `docs/CLIENT-HANDOFF.md` GH-account section stays untouched; new §11 section appends after the existing «Phase 7 will extend this document» note. Dev appendix (D-30) maps each answer to file edits in collapsed `<details>` block.

---

## Closure check

| Option | Description | Selected |
|--------|-------------|----------|
| Write CONTEXT.md | Defaults obvious for keyboard walkthrough (manual checklist), hard-refresh (6 incognito tabs), build-output denylist (re-run check-brand), plan granularity (~6-8 plans) | ✓ |
| Explore more gray areas | Keyboard walkthrough format, hard-refresh recording structure, plan granularity, dev-appendix detail level | |

**User's choice:** Write CONTEXT.md (Recommended).

---

## Claude's Discretion (deferred to planner)

- Naming convention for axe JSONs (locked at slug-style per D-24, planner picks identical format for axe outputs)
- `scripts/axe-audit.mjs` port-poll mechanism (`node:net` built-in vs `wait-on` helper)
- `lhci-archive` plan task: `gh` CLI vs REST curl
- Layout-screenshot composition checks: markdown checklist vs free-text
- Keyboard-walkthrough table column consistency across routes
- Hard-refresh test row count: 6 (locked) vs 7 (add `/#/zhk/maietok-vynnykivskyi` redirect)
- §11 table item ordering: source-document order (locked) vs priority-first
- Dev appendix collapse: `<details>` HTML vs plain H3
- `06-HUMAN-UAT.md` update format: inline `result:` field vs file-end closure block

## Deferred Ideas

Captured in CONTEXT.md `<deferred>` section:
- Permanent CI a11y gate (v2 trigger)
- `@axe-core/playwright` E2E harness (v2 if interactive flows)
- Multi-width Lighthouse grid (v2 if tablet measurement requested)
- Real-device mobile testing (v2 with INFR2-07)
- Visual regression testing (v2 if design-system PRs need diffs)
- E2E Playwright suite (v2)
- Sitemap.xml + robots.txt (v2 with custom domain)
- Client-facing demo brief / Loom video / Calendly (out of v1 scope)
- Translation of CLIENT-HANDOFF.md to EN (v2 with FEAT2-06)
- 8 §11 answers application (post-handoff cycle, not Phase 7)
- Slug migration if `maietok` → `maetok` (post-handoff one-PR change)
