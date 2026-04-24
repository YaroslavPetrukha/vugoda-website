---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 01-02-tokens-fonts-base-PLAN.md
last_updated: "2026-04-24T16:10:05.388Z"
progress:
  total_phases: 7
  completed_phases: 0
  total_plans: 5
  completed_plans: 2
  percent: 40
---

# Project State: Vugoda Website

**Last updated:** 2026-04-24T16:03:45Z (plan 01-01 complete)
**Updated by:** execute-phase agent → 01-01-deps-and-scaffold

## Project Reference

- **Project:** Vugoda Website — корпоративний сайт забудовника «ВИГОДА»
- **Core Value:** Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді (точна палітра, ізометричні куби, cinematic-анімації на Motion, чесне відображення портфеля 0-здано / 1-активно / 4-pipeline).
- **Domain:** Ukrainian real-estate developer corporate hub, static desktop-first React SPA on GitHub Pages
- **Current focus:** Phase 01, Plan 02 — tokens-fonts-base

## Current Position

- **Phase:** 1 — Foundation & Shell (executing)
- **Plan:** 3 of 5 (01-01 complete, moving to 01-02)
- **Status:** Ready to execute
- **Stopped at:** Completed 01-02-tokens-fonts-base-PLAN.md
- **Progress:** [████░░░░░░] 40%

```
[█░░░░░░░░░░░░░░░░░░░] 5% — 0/7 phases complete, 1/5 plans in Phase 01
```

## Roadmap Summary

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Foundation & Shell | 4 (VIS-01, VIS-02, NAV-01, DEP-03) | Not started |
| 2 | Data Layer & Content | 4 (CON-01, CON-02, ZHK-02, QA-04) | Not started |
| 3 | Brand Primitives & Home Page | 10 (HOME-01…07, VIS-03, VIS-04, ANI-01) | Not started |
| 4 | Portfolio, ЖК, Log, Contact | 9 (HUB-01…04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03) | Not started |
| 5 | Animations & Polish | 2 (ANI-02, ANI-04) | Not started |
| 6 | Performance, Mobile Fallback, Deploy | 5 (QA-01, QA-02, QA-03, DEP-01, DEP-02) | Not started |
| 7 | Post-deploy QA & Client Handoff | 0 (verification of all prior) | Not started |

**Coverage:** 34/34 v1 requirements mapped. No orphans.

## Performance Metrics

Targets from PROJECT.md Constraints:

- **Lighthouse desktop:** ≥90 on Performance / Accessibility / Best Practices / SEO (QA-02)
- **Hero image:** ≤200KB (loaded format, AVIF or WebP)
- **JS bundle:** ≤200KB gzipped
- **WCAG:** 2.1 AA floor; `#A7AFBC` allowed only ≥14pt; `#C1F33D` never on light bg

## Stack (decided, not re-debated)

- Vite 6 + React 19 + TypeScript 5.8 + Tailwind v4 + Motion 12
- `react-router-dom` v7 with **HashRouter** (not BrowserRouter) + Vite `base: '/vugoda-website/'` + `public/.nojekyll`
- `@fontsource/montserrat` (cyrillic-400/500/700 entry points only)
- `vite-plugin-svgr` for brand-assets SVG imports
- `sharp` + `tsx` for build-time image pipeline + translit script
- `actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3` (NOT `gh-pages` npm)
- Content hardcoded in TSX/TS (no CMS in v1)

## Accumulated Context

### Decisions (from PROJECT.md Key Decisions)

- **Vite + React + Motion** (not Next.js + Sanity): GH Pages is static; simpler stack
- **Core-4 scope**: Home + `/projects` + `/zhk/etno-dim` + `/construction-log` + `/contact` (5 routes); `/about`, `/how-we-build`, `/buying`, `/investors` = v2
- **Етно Дім as template-demo ЖК**: has 8 renders (most of any pipeline project); «меморандум» stage = useful «system» narrative
- **Маєток Винниківський + Дохідний дім NTEREST = `grid-only`** in v1 (hub card, no internal page)
- **Модель Б (4 buckets)** for stage filter: У розрахунку · У погодженні · Будується · Здано
- **Desktop-first, mobile = fallback page at <1024px** (not responsive; full mobile = v2)
- **HashRouter in v1**, BrowserRouter only when custom domain added (v2)
- **UA-only** in MVP; EN for investors = v2

### Hard Rules (from brand-system + CONCEPT §10)

- Closed palette: 6 hexes only (`#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A`)
- Montserrat only, 3 weights (400/500/700)
- Isometric cube language: stroke 0.5–1.5pt, opacity 5–60%, only 3 allowed stroke colors
- Tone: стримано, предметно, без суперлативів — заборонені слова «мрія», «найкращий», «унікальний», «преміальний стиль життя»
- Silent displacement (Pictorial / Rubikon never named) — applies ONLY to Lakeview
- No team photos, no faces, no names
- Rendering source = `/renders/` ONLY; legacy `/вигода-—-системний-девелопмент/Рендера/` forbidden; `/construction/_social-covers/` forbidden (brand conflict)

### Open Client Questions (CONCEPT §11, placeholder layer — not blocking MVP)

Deferred to Phase 7 handoff doc:

1. Корпоративний телефон (render as `—` until resolved)
2. Юр. / поштова адреса (render as `—`)
3. Pipeline-4 назва (render as «Без назви» + aggregate-row copy)
4. Model-Б fінальне підтвердження стадій
5. Методологія §8 — верифікація блоків 2/5/6 (render with ⚠ marker)
6. Slug транслітерація (`maietok` vs `maetok`; committed default = `maietok-vynnykivskyi`, TODO-marked)
7. Написання «NTEREST» без «I» (committed default = `nterest`, confirm with client)
8. Етно Дім — адреса вул. Судова збережена? (render as `—` until confirmed)

### Todos / Blockers

- None blocking Phase 1
- 01-01 complete: package.json, lockfile, tsconfig, vite.config.ts, index.html, public scaffold
- Two research spikes flagged for Phase 3 (Motion `useScroll` API, `vite-plugin-svgr` v4) and Phase 5 (AnimatePresence + Router v7, `useReducedMotion` export)

### Research Artifacts Available

- `.planning/research/SUMMARY.md` — executive summary, 7-phase proposal, confidence assessment
- `.planning/research/STACK.md` — verified package versions + configs (npm-registry-verified 2026-04-24)
- `.planning/research/FEATURES.md` — must-have / should-have / defer tiers
- `.planning/research/ARCHITECTURE.md` — 8 concrete Q&A (folder structure, data model, tokens, cube SVG, Motion patterns, construction log, AnimatePresence + Router, Cyrillic filename translit)
- `.planning/research/PITFALLS.md` — 16 pitfalls mapped to preventing phases

## Session Continuity

**Next action for user:**

```
/gsd:plan-phase 1
```

This will decompose Phase 1 (Foundation & Shell) into executable plans covering VIS-01, VIS-02, NAV-01, DEP-03.

**If returning after context loss, read in order:**

1. `.planning/PROJECT.md` — what and why
2. `.planning/REQUIREMENTS.md` — 34 v1 REQ-IDs with phase mappings
3. `.planning/ROADMAP.md` — 7-phase structure with success criteria
4. `.planning/STATE.md` (this file) — current position
5. `.planning/research/ARCHITECTURE.md` — folder structure + data model (load before phase 1 planning)
6. `.planning/research/PITFALLS.md` — pitfall-to-phase map (load per phase as reference)

---
*Project memory evolves at phase transitions (via `/gsd:transition`) and milestone boundaries (via `/gsd:complete-milestone`).*
