---
status: partial
phase: 03-brand-primitives-home-page
source: [03-VERIFICATION.md, 03-AUDIT.md]
started: 2026-04-25T05:55:00Z
updated: 2026-04-25T09:25:00Z
---

## Current Test

[item 3 resolved by fix commit 3ae662d; item 1 deferred to Phase 6; item 2 client-approved]

## Tests

### 1. Lighthouse Performance audit on `/`
expected: Lighthouse Desktop Performance score ≥ 90 on `/` alone (Roadmap Phase 3 SC#3 sub-clause). Programmatically not verifiable in CI without `@lhci/cli`. Phase 6 owns full Lighthouse pipeline; here we just need a one-shot score check (Chrome DevTools → Lighthouse → Desktop → Performance) on the deployed-or-local-built `/` to confirm the Phase 3 hero pipeline did not regress baseline.
result: [deferred to Phase 6 — fix 3ae662d switched index.html preload to imagesrcset+imagesizes so the LCP fetch now lands on aerial-1280.avif (200KB) instead of aerial-1920.avif (388KB). Score audit lives in Phase 6 anyway.]

### 2. Visual QA on `/` and `/dev/brand`
expected:
- `/` cinematic feel — gасло readable on dark bg, IsometricGridBG overlay не «забиває» wordmark, parallax відчувається повільним і керованим (≤120px при повному скролі), без bounce/spring
- BrandEssence cards (4×) рівно вирівняні, нумерація 01–04 видима, вивагою як «системно/раціонально»
- PortfolioOverview flagship LCP — `aerial.jpg` лоадиться без видимого jank, hover state на pipeline-картках стримано
- ConstructionTeaser horizontal scroll-snap працює мишкою + трекпадом
- MethodologyTeaser ⚠ маркери на блоках 2/5/6 з aria-label
- TrustBlock 3-колонки читабельно, ЄДРПОУ + ліцензія + email візуально витримано
- ContactForm на bg-bg-black закриває сторінку без візуального розриву
- `/dev/brand` показує всі brand primitives standalone (Logo, Mark, IsometricCube×3, IsometricGridBG, Wordmark) — корисно для клієнтського handoff
result: [approved — client confirmed visual sweep on deployed Pages 2026-04-25 after fix push 3ae662d landed]

### 3. Hero parallax translation amplitude
expected: Roadmap SC#1 wording «<120px translation». Plan 03-04 implemented range `[0, -120]` — на самій межі. Resolved by fix commit 3ae662d: Hero.tsx range tightened to `[0, -100]`, leaving 20px headroom under the strict-less wording.
result: passed (3ae662d)

## Summary

total: 3
passed: 1
issues: 0
pending: 0
skipped: 0
blocked: 0
deferred: 2  # item 1 → Phase 6; item 2 → client-approved

## Gaps
