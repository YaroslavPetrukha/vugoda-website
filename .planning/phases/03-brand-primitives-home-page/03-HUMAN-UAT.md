---
status: partial
phase: 03-brand-primitives-home-page
source: [03-VERIFICATION.md]
started: 2026-04-25T05:55:00Z
updated: 2026-04-25T05:55:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Lighthouse Performance audit on `/`
expected: Lighthouse Desktop Performance score ≥ 90 on `/` alone (Roadmap Phase 3 SC#3 sub-clause). Programmatically not verifiable in CI without `@lhci/cli`. Phase 6 owns full Lighthouse pipeline; here we just need a one-shot score check (Chrome DevTools → Lighthouse → Desktop → Performance) on the deployed-or-local-built `/` to confirm the Phase 3 hero pipeline did not regress baseline.
result: [pending]

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
result: [pending]

### 3. Hero parallax translation amplitude
expected: Roadmap SC#1 wording «<120px translation». Plan 03-04 implements range `[0, -120]` exactly — це ставить значення amplitude на самій межі. На повний scroll-out hero translates by exactly 120px. Перевірити: чи це «strict less than 120» порушення, чи спокійне інтерпретація меж (sentinel of D-04 specification). Якщо потрібен strict <120, змінити на `[0, -119]` або `[0, -100]` у Hero.tsx parallax range.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
