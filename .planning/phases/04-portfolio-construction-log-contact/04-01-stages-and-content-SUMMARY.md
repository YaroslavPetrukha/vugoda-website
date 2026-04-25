---
phase: 04-portfolio-construction-log-contact
plan: "01"
subsystem: content
tags: [content-modules, stage-helper, type-utility, wave-1-foundation]
dependency_graph:
  requires: []
  provides:
    - src/lib/stages.ts → STAGES, stageLabel(), isStage()
    - src/content/projects.ts → projectsHeading, projectsSubtitle, zdanoEmptyMessage, buduetsyaPointerMessage
    - src/content/zhk-etno-dim.ts → mailtoSubject, mailtoLabel, instagramLabel, lakeviewRedirectMessage
    - src/content/contact.ts → contactPageHeading, contactPageSubtitle, contactPageCta, contactMailSubject
  affects:
    - Wave 2 plans: StageFilter, PipelineCard, EmptyStateZdano, BuduetsyaPointer, ZhkCtaPair, ContactDetails, ContactPage
tech_stack:
  added: []
  patterns:
    - Pure TS content modules with @rule IMPORT BOUNDARY doc-block (established in Phase 2)
    - as const satisfies readonly Stage[] for narrow tuple + type-checking (TS 4.9+)
key_files:
  created:
    - src/lib/stages.ts
    - src/content/projects.ts
    - src/content/zhk-etno-dim.ts
    - src/content/contact.ts
  modified: []
decisions:
  - D-11: STAGES tuple + stageLabel() as single source of truth for Stage → Ukrainian label mapping
  - D-42: Unknown stage fallback returns em-dash «—» (U+2014) — never crashes
  - D-01: projectsHeading «Проєкти» + honest 0/1/4 subtitle
  - D-08: buduetsyaPointerMessage «Див. ЖК Lakeview вище ↑» (U+2191)
  - D-09: zdanoEmptyMessage «Наразі жоден ЖК не здано»
  - D-18: mailtoSubject «Запит про ЖК Етно Дім» + mailtoLabel for /zhk/etno-dim CTA pair
  - D-19: lakeviewRedirectMessage «Переходимо до ЖК Lakeview…» (U+2026) for redirect paint flash
  - D-36: contactPageHeading «Контакт» + subtitle + CTA label
metrics:
  duration: "7m 10s"
  completed: "2026-04-25"
  tasks: 4
  files: 4
---

# Phase 04 Plan 01: Stages Helper + Content Modules Summary

**One-liner:** Four pure-TS Wave 1 foundation modules — `stages.ts` utility with STAGES tuple + stageLabel() + isStage(), and three content modules for `/projects`, `/zhk/etno-dim`, and `/contact` page strings — providing single source of truth for all Phase 4 surface consumers.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create src/lib/stages.ts | 15f71bc | src/lib/stages.ts |
| 2 | Create src/content/projects.ts | 0029ba7 | src/content/projects.ts |
| 3 | Create src/content/zhk-etno-dim.ts | d846395 | src/content/zhk-etno-dim.ts |
| 4 | Create src/content/contact.ts | 7df9f3c | src/content/contact.ts |

## Files Created

### src/lib/stages.ts
- `STAGES` tuple: `['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano'] as const satisfies readonly Stage[]`
- `stageLabel(stage)`: Stage → Ukrainian label, returns «—» (U+2014) for unknown input
- `isStage(s)`: type predicate for URL state validation (`?stage=...`)
- Type-only import from `../data/types`; no React/motion/component imports

### src/content/projects.ts
- `projectsHeading`: `'Проєкти'` (D-01 page H1)
- `projectsSubtitle`: `'1 в активній фазі будівництва · 4 у pipeline · 0 здано'` (D-01 honest count)
- `zdanoEmptyMessage`: `'Наразі жоден ЖК не здано'` (D-09 empty-state)
- `buduetsyaPointerMessage`: `'Див. ЖК Lakeview вище ↑'` (D-08 pointer with U+2191)

### src/content/zhk-etno-dim.ts
- `mailtoSubject`: `'Запит про ЖК Етно Дім'` (D-18 primary CTA)
- `mailtoLabel`: `'Написати про ЖК Етно Дім'` (D-18 button label)
- `instagramLabel`: `'Підписатись на оновлення (Instagram)'` (disabled secondary CTA)
- `lakeviewRedirectMessage`: `'Переходимо до ЖК Lakeview…'` (D-19, U+2026 ellipsis)

### src/content/contact.ts
- `contactPageHeading`: `'Контакт'` (D-36 H1)
- `contactPageSubtitle`: `'Напишіть нам, щоб обговорити проект.'` (D-36 bare invitation, M-2)
- `contactPageCta`: `'Ініціювати діалог'` (D-36 CTA label)
- `contactMailSubject`: `'Ініціювати діалог через сайт ВИГОДА'` (M-3 single-source mailto subject)

## Decision IDs Implemented

D-01, D-08, D-09, D-11, D-18, D-19, D-36, D-42

## Deviations from Plan

None — plan executed exactly as written. All 4 files match the plan `<action>` text verbatim.

The doc-blocks were pre-screened against their own `<verify>` grep patterns before writing (established practice from Phase 3). No self-consistency fixes were needed — the plan-level doc-blocks for these pure content modules contained no regex-bait literals.

## Wave 2 Import Map

Wave 2 plans consume these exports as follows:

| Consumer (Wave 2) | Imports from |
|-------------------|-------------|
| StageFilter, PipelineCard, /dev/grid | `STAGES`, `stageLabel`, `isStage` from `src/lib/stages.ts` |
| EmptyStateZdano | `zdanoEmptyMessage` from `src/content/projects.ts` |
| BuduetsyaPointer | `buduetsyaPointerMessage` from `src/content/projects.ts` |
| ProjectsPage | `projectsHeading`, `projectsSubtitle` from `src/content/projects.ts` |
| ZhkCtaPair | `mailtoSubject`, `mailtoLabel`, `instagramLabel` from `src/content/zhk-etno-dim.ts` |
| ZhkPage (lakeview redirect) | `lakeviewRedirectMessage` from `src/content/zhk-etno-dim.ts` |
| ContactPage, ContactDetails | `contactPageHeading`, `contactPageSubtitle`, `contactPageCta`, `contactMailSubject` from `src/content/contact.ts` |

## Verification Results

- `npm run lint` (tsc --noEmit): **exits 0** — all 4 files type-clean
- Content boundary check: **CLEAN** — no React/motion/components/hooks/pages imports in any content module
- Stage canonical order: **VERIFIED** — `u-rozrakhunku → u-pogodzhenni → buduetsya → zdano` on line 19 of stages.ts
- `npm run build`: **pre-existing failure in optimize-images.mjs** (copy-renders.ts recreates `public/renders/` and then `_opt/` subdirs go missing before optimize-images.mjs runs). This failure predates Plan 04-01 — confirmed by checking out baseline commit and reproducing identical error. My 4 TS-only files do not affect the image pipeline. The TypeScript compilation step (`tsc --noEmit`) passes clean.

## Known Stubs

None. All exports are literal Ukrainian strings or a utility function. No placeholder data flows to UI rendering.

## Self-Check: PASSED

All 4 files exist on disk and all 4 commits exist in git history:
- `src/lib/stages.ts` — FOUND
- `src/content/projects.ts` — FOUND
- `src/content/zhk-etno-dim.ts` — FOUND
- `src/content/contact.ts` — FOUND
- Commit `15f71bc` — FOUND
- Commit `0029ba7` — FOUND
- Commit `d846395` — FOUND
- Commit `7df9f3c` — FOUND
