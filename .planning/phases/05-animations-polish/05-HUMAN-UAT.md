---
status: partial
phase: 05-animations-polish
source: [05-VERIFICATION.md]
started: 2026-04-26T07:50:00Z
updated: 2026-04-26T07:50:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Inter-route fade transitions feel smooth, no jank (SC#3)
expected: Navigating between /, /projects, /zhk/etno-dim, /construction-log, /contact produces a clean fade transition (~250ms enter, ~150ms exit per `pageFade` in motionVariants.ts), no flicker or layout shift, scroll lands at top of new route.
result: [pending]

### 2. Reduced-motion mode is fully respected across all motion surfaces (SC#4)
expected: With Chrome DevTools "Emulate prefers-reduced-motion: reduce" enabled — RevealOnScroll renders content immediately (no fade-up), hover-card has no scale/shadow transition, route transitions are instant (no fade), Hero parallax cubes do not move on scroll. All content remains accessible.
result: [pending]

### 3. Hero session-skip works on revisit (SC#5)
expected: First visit to / shows full cinematic Hero intro (parallax cubes animate in). Refresh page or navigate to another route and back to / within the same browser session — Hero renders instantly with no entry animation. Open new browser session (close tab + reopen, or new incognito window) — full intro returns. `useSessionFlag('vugoda:hero-seen')` controls this via sessionStorage.
result: [pending]

### 4. /zhk/etno-dim LCP image still paints fast (D-09 fade-only variant)
expected: ZhkHero uses `fade` variant (not `fadeUp` with translate) so the LCP image is not delayed. Lighthouse Desktop LCP < 2.5s on /zhk/etno-dim. No visible "pop-in" of the hero image.
result: [pending]

### 5. Hover-card consolidation byte-equivalent to Phase 4 inline class (D-24)
expected: Cards on /, /projects, /zhk/etno-dim, /construction-log produce the same hover triple-effect as Phase 4 (scale + shadow + ease) with no visual regression. The 5 surfaces — PortfolioOverview pipeline cards, FlagshipCard, PipelineCard, ZhkGallery thumbs, MonthGroup thumbs — all behave identically to before Phase 5.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
