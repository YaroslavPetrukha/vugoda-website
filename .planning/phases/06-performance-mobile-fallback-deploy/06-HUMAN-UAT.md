---
status: closed
phase: 06-performance-mobile-fallback-deploy
source: [06-VERIFICATION.md]
started: 2026-04-26T00:00:00Z
updated: 2026-04-27T00:00:00Z
closed_by: 07-post-deploy-qa-client-handoff
---

## Current Test

[closed by Phase 7]

## Tests

### 1. Lighthouse Desktop ≥90 on deployed URL (all 5 routes, all 4 categories)
expected: All 4 categories (Performance, Accessibility, Best Practices, SEO) ≥90 on each of: `/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`. Archive scores per route for Phase 7 handoff.
result: [passed via 07-07-lhci-archive, evidence at .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md]

### 2. MobileFallback visual at <1024px (real iPhone or DevTools emulation)
expected: Single-screen `<MobileFallback>` renders cleanly at iPhone widths — Logo + wordmark + body copy + mailto + 4 CTA links + juridical block (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / Ліцензія від 27.12.2019). Nav and Footer absent in mobile branch. mailto opens mail client; 4 CTAs tab-navigable.
result: [passed via 07-06-mobile-fallback-screenshot, evidence at .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png]

### 3. Social unfurl in Viber/Telegram/Slack
expected: Each platform shows clean card — OG image (`og-image.png` 1200×630), title «ВИГОДА — Системний девелопмент», description «Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline.» No broken image; no fallback to URL string.
result: [passed via 07-08-social-unfurl-verify, evidence at .planning/phases/07-post-deploy-qa-client-handoff/unfurls/SUMMARY.md]

### 4. Hard-refresh deep-link incognito test (5 production routes)
expected: All 5 hash routes (`/#/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`) load directly via Cmd+Shift+R or new incognito tab — no 404, no blank screen. HashRouter eliminates the GH Pages 404-on-deep-link class.
result: [passed via 07-04-hard-refresh-test, evidence at .planning/phases/07-post-deploy-qa-client-handoff/hard-refresh.md]

### 5. Lighthouse CI workflow_run chain validation
expected: After next push to main, `.github/workflows/lighthouse.yml` is triggered by `workflow_run` after Deploy to Pages succeeds, completes successfully, AND its smoke-check step reports `PASS: hash-fragment URL fidelity verified.` `.lighthouseci/` artifact uploaded; ≥4 of 5 lhr-*.json files contain `#` in `requestedUrl`.
result: [passed via 07-07-lhci-archive, evidence at .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md (UAT-5 section)]

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

## Gaps
