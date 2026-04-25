---
phase: 04-portfolio-construction-log-contact
plan: 06a
subsystem: zhk-section-components
tags: [zhk, hero, fact-block, redirect, leaf-components]
dependency_graph:
  requires: [04-01]
  provides: [ZhkHero, ZhkFactBlock, ZhkWhatsHappening, ZhkLakeviewRedirect]
  affects: [04-06b]
tech_stack:
  added: []
  patterns: [ResponsivePicture-LCP, dl-dt-dd-semantic, useEffect-cross-origin-redirect, conditional-render-guard]
key_files:
  created:
    - src/components/sections/zhk/ZhkHero.tsx
    - src/components/sections/zhk/ZhkFactBlock.tsx
    - src/components/sections/zhk/ZhkWhatsHappening.tsx
    - src/components/sections/zhk/ZhkLakeviewRedirect.tsx
  modified: []
decisions:
  - "ZhkHero uses loading=eager + fetchPriority=high (no index.html preload for etno-dim — RESEARCH §Q3 Option A; home flagship only is preloaded)"
  - "ZhkFactBlock dl/dt/dd grid: 2-col at lg (120px label / 1fr value), stacked below — uses stageLabel from project data, etnoDimAddress from placeholders.ts"
  - "ZhkWhatsHappening returns null when project.whatsHappening undefined — graceful absence for fixtures/future projects"
  - "ZhkLakeviewRedirect uses useEffect (not useLayoutEffect) per RESEARCH §Q6 — window.location.assign in useEffect fires post-paint; 1-frame flicker made intentional with branded copy + IsometricCube single variant"
metrics:
  duration: "~6 minutes"
  completed: "2026-04-25"
  tasks: 2
  files: 4
---

# Phase 4 Plan 06a: ZHK Etno Dim Shell Components Summary

4 leaf section components for `/zhk/etno-dim` template (D-13..D-15) and cross-origin redirect placeholder for `/zhk/lakeview` (D-19), all typed with `Project` prop, zero state except redirect `useEffect`.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | ZhkHero + ZhkFactBlock + ZhkWhatsHappening | e9b42e4 | ZhkHero.tsx, ZhkFactBlock.tsx, ZhkWhatsHappening.tsx |
| 2 | ZhkLakeviewRedirect | a4fff75 | ZhkLakeviewRedirect.tsx |

## Components Shipped

### ZhkHero (`src/components/sections/zhk/ZhkHero.tsx`)
Full-width hero render at top of `/zhk/etno-dim`. Accepts `project: Project`, renders `renders/${project.slug}/${project.renders[0]}` (etnoDim = `43615.jpg.webp`) via `<ResponsivePicture>` with `widths=[640, 1280, 1920]`, `loading="eager"`, `fetchPriority="high"` for LCP wiring (D-14). Explicit `width={1920} height={1080}` for CLS prevention.

### ZhkFactBlock (`src/components/sections/zhk/ZhkFactBlock.tsx`)
Semantic `<dl>/<dt>/<dd>` fact block (D-15). Three rows: Стадія (`project.stageLabel`), Локація (`project.location ?? '—'`), Адреса (`etnoDimAddress` from `src/content/placeholders.ts` = em-dash placeholder). 2-column grid at `lg` breakpoint.

### ZhkWhatsHappening (`src/components/sections/zhk/ZhkWhatsHappening.tsx`)
Stage-narrative paragraph block (D-13/D-15). Conditionally renders: `if (!project.whatsHappening) return null`. Body text sourced entirely from `project.whatsHappening` data field — no content in JSX literals beyond H2 structural label.

### ZhkLakeviewRedirect (`src/components/sections/zhk/ZhkLakeviewRedirect.tsx`)
Cross-origin redirect placeholder for `/zhk/lakeview` (D-19). `useEffect(() => window.location.assign(url), [url])` fires post-paint. Branded 1-frame placeholder with `<IsometricCube variant="single" stroke="#A7AFBC" opacity={0.4}>` + `lakeviewRedirectMessage` text + `aria-live="polite"`.

## Decisions Made

1. **LCP without index.html preload** — Home flagship gets the `<link rel="preload">` in `index.html` (Plan 03-04). For `/zhk/etno-dim`, rely on `eager+high` per RESEARCH §Q3 Option A. Phase 6 Lighthouse will measure and may add a dynamic preload via `useEffect` if LCP regresses.

2. **useEffect not useLayoutEffect for redirect** — Per RESEARCH §Q6, `useLayoutEffect` does NOT skip the paint either. Using `useEffect` is the correct cross-origin redirect pattern. The 1-frame branded placeholder is intentional.

3. **Inline Cyrillic structural labels** — `Стадія`, `Локація`, `Адреса`, `Що відбувається зараз` are short structural labels (6–20 chars) under the 40-char content-boundary threshold, matching the Phase 3 D-29 short-structural carve-out pattern.

4. **No doc-block grep collisions** — Pre-screened all `<action>` doc-blocks against plan `<verify>` regexes before writing. Zero Rule 3 self-consistency fixes needed. Breaks the recurring planner-template-smell pattern from Phases 2–3.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- `npm run lint` (`tsc --noEmit`): exit 0 after Task 1 and Task 2
- `npx vite build`: exit 0 — bundle 134.83 kB gzipped (4 new components unreachable from entry until 04-06b composes ZhkPage; delta ~3 kB from parallel agents)
- `check-brand 4/4`: PASS — denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries all clean
- Brand invariants: no `transition-all`, no `spring`, no quoted path literals in zhk/ components
- Pre-existing issue: `npm run build` (full prebuild) fails on Node 25 due to HEIF encoder resource exhaustion in `scripts/optimize-images.mjs` — documented in the script itself (comment line 86-88). Not caused by this plan. Build works correctly when `npx vite build` is run directly (prebuild skipped).

## Note for Plan 04-06b

Import these 4 components from their canonical paths:

```typescript
import { ZhkHero } from '../components/sections/zhk/ZhkHero';
import { ZhkFactBlock } from '../components/sections/zhk/ZhkFactBlock';
import { ZhkWhatsHappening } from '../components/sections/zhk/ZhkWhatsHappening';
import { ZhkLakeviewRedirect } from '../components/sections/zhk/ZhkLakeviewRedirect';
```

`ZhkLakeviewRedirect` expects `url: string` prop (the Lakeview `externalUrl` from `projects.find(p => p.slug === 'lakeview')`).

## Known Stubs

- `etnoDimAddress` in `ZhkFactBlock` renders as `'—'` (em-dash) until client confirms the Etno Dim address (CONCEPT §11.8). Tracked in `src/content/placeholders.ts` as `etnoDimAddress`.

## Self-Check: PASSED

Files exist:
- src/components/sections/zhk/ZhkHero.tsx: FOUND
- src/components/sections/zhk/ZhkFactBlock.tsx: FOUND
- src/components/sections/zhk/ZhkWhatsHappening.tsx: FOUND
- src/components/sections/zhk/ZhkLakeviewRedirect.tsx: FOUND

Commits exist:
- e9b42e4: FOUND (Task 1)
- a4fff75: FOUND (Task 2)
