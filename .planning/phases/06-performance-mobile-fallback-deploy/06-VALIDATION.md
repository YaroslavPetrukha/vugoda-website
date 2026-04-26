---
phase: 6
slug: performance-mobile-fallback-deploy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-26
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `06-RESEARCH.md` §"Validation Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Three layers, no unit-test framework: (1) `scripts/check-brand.ts` shell-based grep + Node assertions; (2) `@lhci/cli@^0.15.1` headless Chromium audits in CI; (3) manual UAT (visual unfurl, mobile viewport swap, OG render). No Vitest/Jest/Playwright in v1 per `.planning/research/STACK.md` Testing Posture for MVP. |
| **Config files** | `.lighthouserc.cjs` (NEW, Wave 0), `scripts/check-brand.ts` (EDITED, +2 checks), `.github/workflows/lighthouse.yml` (NEW, Wave 0) |
| **Quick run command** | `npm run build && npx tsx scripts/check-brand.ts` |
| **Full suite command** | (same as quick — no separate "full suite"; manual UAT happens out-of-band; lhci runs only in CI post-deploy) |
| **Estimated runtime** | ~30 seconds local (build + check-brand); ~2-3 minutes CI lhci on 5 routes |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npx tsx scripts/check-brand.ts` (all check-brand gates green; ~30s)
- **After every plan wave:** Run quick command + visually inspect the route changed (e.g. resize to 1023px after MobileFallback wave)
- **Before `/gsd:verify-work`:** All check-brand gates green + lhci PASS on deployed URL + Tier 1 Lighthouse archive (5 screenshots) + UAT checklist (D-37) signed off
- **Max feedback latency:** ~30 seconds for build-time gates; ~3 minutes for lhci CI gate (deploy-time only)

---

## Per-Task Verification Map

> Filled at planning time by `gsd-planner` once tasks have IDs. Each task in plans must point at one of the gates below or declare manual UAT.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| _TBD by planner_ | _01_ | _1_ | _QA-01_ | _unit/UAT_ | _TBD_ | _W0 / ✅_ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

### Gate Inventory (planner picks per task)

| Gate | Source | Validates | Type |
|------|--------|-----------|------|
| `bundleBudget()` | `scripts/check-brand.ts` (NEW) | QA-02 — JS bundle ≤200KB gzipped | unit (build-time) |
| `heroBudget()` | `scripts/check-brand.ts` (NEW) | QA-02 — `aerial-1280.{avif,webp,jpg}` ≤200KB each | unit (build-time) |
| `paletteWhitelist()` | `scripts/check-brand.ts` (existing) | brand palette compliance | unit (build-time) |
| `denylistTerms()` | `scripts/check-brand.ts` (existing) | no Pictorial/Rubikon outside Lakeview | unit (build-time) |
| `placeholderTokens()` | `scripts/check-brand.ts` (existing) | no `{{...}}` tokens | unit (build-time) |
| `importBoundaries()` | `scripts/check-brand.ts` (existing) | render asset placement | unit (build-time) |
| `noInlineTransition()` | `scripts/check-brand.ts` (existing) | no inline `transition={{...}}` JSX | unit (build-time) |
| OPTIONAL `metaPresence()` | `scripts/check-brand.ts` (NEW, planner's call) | QA-03 — `index.html` carries `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `theme-color`, `<link rel="canonical">`, `<link rel="icon">`, `<link rel="apple-touch-icon">` | unit (build-time, grep) |
| `lhci autorun` | `.lighthouserc.cjs` + `lighthouse.yml` (NEW) | QA-02 — Lighthouse ≥90 all 4 categories on 5 production routes | integration (CI, post-deploy) |
| Hash-URL smoke | inline `jq '.requestedUrl'` after lhci | sanity — fragments survived collect pipeline | integration (CI) |
| Manual UAT — viewport swap | DevTools resize 1023↔1024 | QA-01 SC#1 letter | manual |
| Manual UAT — desktop sweep | DevTools at 1280, 1366, 1440, 1920 | QA-01 graceful 1280-1919 / perfect 1920×1080 | manual |
| Manual UAT — unfurl | Telegram + Slack + Viber paste | QA-03 visual unfurl fidelity | manual |
| Manual UAT — Tier 1 Lighthouse | Chrome DevTools incognito × 5 routes | QA-02 archive + sanity | manual (screenshots saved) |
| Manual UAT — incognito deep-link | Cold tab paste of all 5 production URLs | DEP-02 + HashRouter robustness | manual |

---

## Wave 0 Requirements

Files / configs that DO NOT exist today and Phase 6 must create before Phase-6 validation can run end-to-end. The planner MUST schedule these in Wave 1 (or earlier) so dependent waves can be validated.

- [ ] `.lighthouserc.cjs` — covers QA-02 lhci config (5 URL list + 4 assertions)
- [ ] `.github/workflows/lighthouse.yml` — covers QA-02 CI gate (separate workflow, own concurrency group, `workflow_run` trigger after `Deploy to GitHub Pages` succeeds — per RESEARCH.md §5)
- [ ] `scripts/check-brand.ts` `bundleBudget()` — covers QA-02 bundle constraint
- [ ] `scripts/check-brand.ts` `heroBudget()` — covers QA-02 hero constraint
- [ ] `scripts/build-og-image.mjs` — produces `public/og-image.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` referenced by QA-03 meta tags
- [ ] `brand-assets/og/og.svg` — source asset for QA-03 (pre-pathed Cyrillic wordmark per RESEARCH.md §3 Risk 2 mitigation)
- [ ] `src/hooks/useMatchMedia.ts` — covers QA-01 detection (useSyncExternalStore pattern per RESEARCH.md §7)
- [ ] `src/hooks/usePageTitle.ts` — covers QA-03 / SEO per-route titles
- [ ] `src/components/layout/MobileFallback.tsx` — covers QA-01 fallback UI
- [ ] `src/content/mobile-fallback.ts` — covers QA-01 copy module
- [ ] `src/components/ui/MarkSpinner.tsx` — covers QA-02 (Suspense fallback for `React.lazy` chunks)
- [ ] `npm install -D @lhci/cli@^0.15.1` — installs the CI gate runtime

---

## Manual-Only Verifications

Behaviors that intentionally have no automated gate. UAT only.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile fallback at `<1024px` swaps cleanly with desktop at `≥1024px` (no flicker, no scroll lock, no Nav/Footer leak) | QA-01 SC#1 | Playwright deferred to v2; layout/animation correctness is human-judged | DevTools → Toggle Device Toolbar → resize from 800px to 1024px and back; verify clean swap and no console errors |
| 1280-1919 desktop renders gracefully (no horizontal scroll, no broken grid, hero hero parallax stable) | QA-01 SC#1 | Visual judgement | DevTools at 1280, 1366, 1440 widths; visit `/`, `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact` |
| 1920×1080 desktop is "ахуєнно" (`PROJECT.md` Core Value letter) | QA-01 SC#1 | Brand-quality judgement | Real 1920×1080 monitor (or DevTools at 1920×1080); subjective brand eye |
| Demo URL unfurls cleanly in Telegram + Slack + Viber | QA-03 SC#2 | OG meta correctness is verified by 3rd-party rendering | Paste deployed URL into all three clients; confirm title + description + 1200×630 image render without truncation/blur |
| Deep-link to `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` from cold incognito tab | DEP-02 SC#5 | HashRouter behavior under "no prior route history" | Open incognito → paste full URL → confirm full route renders without 404 |
| OG image renders correctly with Cyrillic wordmark | QA-03 SC#2 | Pre-pathed SVG visual fidelity (RESEARCH.md §3 Risk 2) | Open `public/og-image.png` after `npm run build`; verify «ВИГОДА» wordmark crisp, sub-line readable, accent cube visible |
| Tier 1 Lighthouse archive — 5 routes × 1 run each, screenshots saved | QA-02 SC#3 (audit trail) | Phase 7 expects an artifact folder; not auto-validated | DevTools Lighthouse Desktop preset, incognito tab, save 5 PNGs to `.planning/phases/06-performance-mobile-fallback-deploy/lighthouse/{route}.png` |
| `prefers-reduced-motion: reduce` honored on `<MarkSpinner>` and route transitions | brand-system §6 (reaffirmed Phase 5) | OS-level setting + render path | DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`; navigate; confirm no opacity-pulse on MarkSpinner, instant page transitions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or are explicitly listed in Manual-Only Verifications above
- [ ] Sampling continuity: no 3 consecutive tasks without an automated verify (planner enforces during plan-write)
- [ ] Wave 0 covers all MISSING references (12 items above)
- [ ] No watch-mode flags used (one-shot commands only)
- [ ] Feedback latency < 30s for build-time gates (lhci is deploy-time, separately tracked)
- [ ] `nyquist_compliant: true` set in frontmatter once planner has filled the per-task verification map and wave 0 plan exists

**Approval:** pending
