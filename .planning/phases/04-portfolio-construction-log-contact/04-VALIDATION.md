---
phase: 4
slug: portfolio-construction-log-contact
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-25
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Sourced verbatim from `04-RESEARCH.md` §"Validation Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — STACK.md skips Vitest for MVP. Validation = `tsc --noEmit` + `check-brand.ts` (4 grep checks) + `vite build` + manual smoke test |
| **Config file** | `tsconfig.json`, `tsconfig.scripts.json` (existing) |
| **Quick run command** | `npm run lint` (= `tsc --noEmit`, exits 0 on success) |
| **Full suite command** | `npm run build` (chains prebuild → lint → vite build → postbuild check-brand 4/4) |
| **Estimated runtime** | ~2-3 sec (`lint`); ~30 sec cold / ~5 sec warm (`build`) |

---

## Sampling Rate

- **After every task commit:** `npm run lint` (~2-3 sec)
- **After every plan wave:** `npm run build` (full pipeline including `prebuild` optimizer + `postbuild` check-brand)
- **Before `/gsd:verify-work`:** Full `npm run build` green AND complete manual smoke checklist (below) executed
- **Max feedback latency:** 30 seconds (cold build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-XX | 01-stages-and-content | 1 | HUB-01 | grep | `grep -E "u-rozrakhunku\|u-pogodzhenni\|buduetsya\|zdano" src/lib/stages.ts && grep -E "STAGES" src/lib/stages.ts` | ❌ W0 | ⬜ pending |
| 04-02-XX | 02-lightbox | 1 | LOG-01, ZHK-01 | grep | `grep -rE "<dialog\|showModal" src/components/ui/Lightbox.tsx` | ❌ W0 | ⬜ pending |
| 04-03-XX | 03-flagship-extract | 1 | HUB-02 | grep | `grep -E "loading=\"eager\"\|fetchPriority=\"high\"" src/components/sections/projects/FlagshipCard.tsx` | ❌ W0 | ⬜ pending |
| 04-04-XX | 04-check-brand-fix | 1 | HUB-04 (enables /dev/grid) | grep | `grep -nE "DevGridPage" scripts/check-brand.ts` (must show exclusion) | ❌ W0 | ⬜ pending |
| 04-05-XX | 05-projects-page | 2 | HUB-01..04 | manual + grep | `grep -E "stageLabel" src/components/sections/projects/PipelineCard.tsx` AND `grep -E "IsometricCube variant=\"single\"" src/components/sections/projects/AggregateRow.tsx` | ❌ W0 | ⬜ pending |
| 04-06a-XX | 06a-zhk-etno-dim-shell | 2 | ZHK-01 | grep | `grep -E "fetchPriority=\"high\"" src/components/sections/zhk/ZhkHero.tsx && grep -E "<dl" src/components/sections/zhk/ZhkFactBlock.tsx && grep -E "window\.location\.assign" src/components/sections/zhk/ZhkLakeviewRedirect.tsx` | ❌ W0 | ⬜ pending |
| 04-06b-XX | 06b-zhk-etno-dim-gallery | 2 | ZHK-01 | manual + grep | `grep -E "findBySlug\|<Navigate" src/pages/ZhkPage.tsx && grep -E "Lightbox" src/components/sections/zhk/ZhkGallery.tsx` | ❌ W0 | ⬜ pending |
| 04-07-XX | 07-construction-log | 2 | LOG-01, LOG-02 | manual + grep | `grep -E "loading=\"lazy\"" src/components/sections/construction-log/MonthGroup.tsx` | ❌ W0 | ⬜ pending |
| 04-08-XX | 08-contact | 2 | CTC-01 | grep | `grep -E "mailto:\${email}\|cursor-default" src/components/sections/contact/ContactDetails.tsx` | ❌ W0 | ⬜ pending |
| 04-09-XX | 09-dev-grid | 2 | HUB-04 SC#6 | manual | Visit `/#/dev/grid` → 10 cards render; no runtime crash | ❌ W0 | ⬜ pending |
| 04-10-XX | 10-ani-03-hover | 3 | ANI-03 | grep | `grep -rE "hover:scale-\\[1.02\\]" src/components/sections/` AND `! grep -rE "transition-all\|spring" src/components/sections/` | ❌ W0 | ⬜ pending |
| 04-11-XX | 11-optimizer-widths | 3 | LOG-01 (1920w) | grep + build | `grep -E "1920" scripts/optimize-images.mjs` AND `npm run prebuild` exits 0 | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Plan IDs above are illustrative and will be finalized by gsd-planner. Wave assignments are recommendations from research.*

---

## Wave 0 Requirements

Phase 4 has **no pre-existing test infrastructure to extend** (Vitest not installed, STACK.md says skip). Validation is `tsc --noEmit` + grep + manual smoke. **Wave 0 deliverables for Phase 4 are NOT new test files** — they're the source files themselves with grep-friendly content (signature class strings + element types).

If future phases want automated validation, the spike would be: install `vitest` + `@testing-library/react` + `jsdom`, write smoke spec asserting routes mount + DOM presence of key elements. ~30 min setup. **Recommend deferring to Phase 7 (post-deploy QA)** if at all — STACK.md says skip for MVP.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Stage filter URL state via `?stage=...` | HUB-01 | Behavioral routing — needs browser address bar | Visit `/#/projects?stage=zdano` → cube + line render; visit `/#/projects?stage=garbage` → «Усі» state |
| `/zhk/:slug` redirect dispatch (4 cases) | ZHK-01 | Cross-origin redirect can't be unit-tested without browser | Visit `/#/zhk/etno-dim` → template; `/#/zhk/lakeview` → external redirect; `/#/zhk/maietok-vynnykivskyi` → `/projects`; `/#/zhk/garbage` → 404 |
| Lightbox keyboard nav (←/→/Esc) + backdrop click | LOG-01, ZHK-01 | Keyboard event timing — manual smoke is faster | Click photo → ←/→ cycles within bounds; Esc closes; click backdrop closes |
| Hover triple-effect visual quality | ANI-03 | Subjective tuning of glow alpha/spread — eyeball at 1920×1080 | Hover any card → scale 1.02 + accent glow visible at 12-20% alpha; not too loud, not invisible |
| Reduced-motion suppression | ANI-03 | OS setting — can't be flagged in build | macOS Settings → Reduce Motion ON → hover yields no scale/shadow |
| `/dev/grid` fixture stress test | HUB-04 SC#6 | Visual layout integrity at 4/6/8/10 cards | Visit `/#/dev/grid` → grid reflows; 10 cards distributed across stages; chip counts reflect fixtures |
| Bundle budget | Phase budget (Phase 6 owns formal verify) | Lighthouse measurement is Phase 6 scope | `vite build` reports gzip; visual check ≤200 KB JS gzipped |
| Page-weight `/construction-log` <2MB | LOG-01 | Network panel inspection | Open DevTools Network → filter Img → reload `/#/construction-log` → sum transferred ≤2MB |

---

## Phase Gate Manual Smoke Checklist

Before declaring Phase 4 complete, run through every item:

- [ ] `/#/projects` — flagship visible above filter; chips show «У розрахунку (2) · У погодженні (2) · Будується (1) · Здано (0)»; PipelineGrid shows 3 cards by default; AggregateRow visible
- [ ] `/#/projects?stage=u-rozrakhunku` — only Маєток grid card; AggregateRow visible
- [ ] `/#/projects?stage=u-pogodzhenni` — Етно Дім + NTEREST grid cards; AggregateRow hidden
- [ ] `/#/projects?stage=buduetsya` — empty grid + «Див. ЖК Lakeview вище ↑» pointer; AggregateRow hidden
- [ ] `/#/projects?stage=zdano` — single cube empty-state + «Наразі жоден ЖК не здано»; AggregateRow hidden
- [ ] `/#/projects?stage=garbage` — defaults to «Усі» (no chip active, default content)
- [ ] Click chip — URL updates with `replace`; back button does NOT undo chip selection
- [ ] `/#/zhk/etno-dim` — hero render + fact block + whatsHappening + 8-render gallery + CTA pair
- [ ] Click any gallery photo → lightbox opens with 1920w; ←/→ cycles within bounds; Esc closes; click backdrop closes
- [ ] `/#/zhk/lakeview` — placeholder line then redirect to `https://yaroslavpetrukha.github.io/Lakeview/`
- [ ] `/#/zhk/maietok-vynnykivskyi`, `/#/zhk/nterest`, `/#/zhk/pipeline-4` — redirect to `/projects`
- [ ] `/#/zhk/garbage-slug` — NotFound H1
- [ ] `/#/construction-log` — 4 month headers (Бер 2026 · 15 фото / Лют 2026 · 12 фото / Січ 2026 · 11 фото / Гру 2025 · 12 фото); each month a 3-col grid of 4:5 thumbnails; lazy-load triggers on scroll; click → lightbox; ←/→ cycles within month
- [ ] `/#/contact` — H1 + subtitle + реквізити-block (4 rows: Email mailto, Телефон —, Адреса —, Соц icons #) + mailto CTA button
- [ ] Hover on any pipeline card / flagship / construction thumbnail / zhk gallery thumbnail — scale-1.02 + accent glow visible; matches D-31 spec
- [ ] System reduced-motion ON — hover effects suppressed (no scale, no shadow)
- [ ] `/#/dev/grid` — fixtures version of `/projects` renders without runtime crash; 10 cards visible across stages; chip counts reflect fixtures
- [ ] Tab through entire `/zhk/etno-dim` page — focus rings visible everywhere on `:focus-visible`; lightbox traps focus when open
- [ ] `npm run build` — exits 0; bundle size in vite report unchanged or within 30% of Phase 3 baseline (131.60 kB gzipped)
- [ ] `npm run postbuild` — check-brand 4/4 PASS

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies (per planner output)
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (per RESEARCH §Validation Architecture)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30 sec
- [ ] `nyquist_compliant: true` set in frontmatter (set by checker after plans pass Dimension 8)

**Approval:** pending
