# Phase 4: Portfolio, ЖК, Construction Log, Contact — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 04-portfolio-construction-log-contact
**Areas discussed:** StageFilter mechanics, /zhk/etno-dim layout, Construction log timeline, ANI-03 hover spec
**Areas left to Claude's Discretion:** /contact composition, /dev/grid scope

---

## Gray-Area Selection

**Question:** Which areas should we discuss for Phase 4? Pick all that need your call.

| Option | Description | Selected |
|--------|-------------|----------|
| StageFilter mechanics | How the 4-bucket filter interacts with FlagshipCard (above filter) + Pipeline-4 aggregate (below grid). | ✓ |
| /zhk/etno-dim layout | 8-render gallery shape, lightbox, CTA pairing, section ordering. | ✓ |
| Construction log timeline | Lightbox UX (←→ + caption), month order, image widths in lightbox. | ✓ |
| ANI-03 hover spec | Card hover (scale + overlay-opacity + accent border-glow): which surfaces, exact glow color/width. | ✓ |

**User's choice:** All four selected.

---

## StageFilter Mechanics

### Q1 — Filter model relative to Flagship + Aggregate

| Option | Description | Selected |
|--------|-------------|----------|
| Honest counts, flagship-fixed | Chips count ALL 5 (incl. Lakeview's Будується:1). Flagship always above filter. Filter affects only PipelineGrid + AggregateRow. «Будується» click → «Див. ЖК Lakeview вище ↑». «Здано» click → empty-state cube. | ✓ |
| Filter-only-grid, flagship as banner | Chips count only pipeline-grid + aggregate (excludes Lakeview). «Будується (0)». Cleaner mental model but reads dishonestly to skim. | |
| Inclusive filter, flagship-conditional | Default «Усі» chip; selecting «Будується» hides everything except flagship. Breaks «flagship sits above the filter» structural rule. | |

**User's choice:** Honest counts, flagship-fixed (Recommended).
**Notes:** Honors PROJECT.md Core Value language («чесне відображення портфеля 0/1/4»).

### Q2 — Filter URL state

| Option | Description | Selected |
|--------|-------------|----------|
| URL query param `?stage=...` | useSearchParams; deep-link/share-able; hash-router compatible (/#/projects?stage=buduetsya). | ✓ |
| Local useState | Reset on refresh; simpler. | |

**User's choice:** URL query param (Recommended).

### Q3 — Pipeline-4 aggregate row visibility under filter

| Option | Description | Selected |
|--------|-------------|----------|
| Tracks the filter | Visible in default + «У розрахунку» (its bucket). Hidden otherwise. Honest. | ✓ |
| Always visible | Stays under grid in all filter states. Simpler but visually weird («Здано: 0 + 1 у роботі»). | |

**User's choice:** Tracks the filter (Recommended).

### Q4 — Page header at top of /projects

| Option | Description | Selected |
|--------|-------------|----------|
| H1 + subtitle | «Проєкти» + muted «1 в активній фазі будівництва · 4 у pipeline · 0 здано». Echoes home portfolioSubtitle. | ✓ |
| FlagshipCard straight to top | No header. Magazine-cover feel. | |
| H1 only, no subtitle | StageFilter chip counts already convey the truth. | |

**User's choice:** H1 + subtitle (Recommended).

---

## /zhk/etno-dim Layout

### Q1 — 8-render gallery shape

| Option | Description | Selected |
|--------|-------------|----------|
| 4×2 uniform grid | Equal weight, clean portfolio moment. Falls to 2-col at 1024-1279. Widths=[640, 1280]. | ✓ |
| Editorial heavy + grid | 1 hero render + 7 in 3+3+1. Magazine-feel. | |
| Horizontal scroll-snap | Saves vertical space; weak for detail-page scanning UX. | |
| Masonry 3-col | Visually rich; with 8 uniform 16:9 the masonry payoff is small. | |

**User's choice:** 4×2 uniform grid (Recommended).

### Q2 — Gallery click → lightbox?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, same lightbox as /construction-log | Reuse <Lightbox> component. ←→ nav, caption, position counter. | ✓ |
| No, gallery is browse-only | Static grid. Spec-compliant minimum but loses fullscreen CGI moment. | |
| Yes, but standalone full-page route | /zhk/etno-dim/render/3 navigation. Adds 8 routes; messes with history. Reject. | |

**User's choice:** Yes, same lightbox (Recommended).

### Q3 — CTA pairing (Instagram + mailto)

| Option | Description | Selected |
|--------|-------------|----------|
| Primary mailto + secondary Instagram | Mailto = accent-fill primary. Instagram = outlined secondary, cursor-disabled until launch. Honest hierarchy. | ✓ |
| Equal-weight side-by-side | Both buttons same accent-fill. Misleading while Instagram is href='#'. | |
| Mailto only, drop Instagram in v1 | Cleanest, but spec lists both. | |

**User's choice:** Primary mailto + secondary Instagram (Recommended).

### Q4 — ZhkPage redirect contract

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 2 contract verbatim | /zhk/lakeview → external; /zhk/maietok|/zhk/nterest → /projects. /zhk/unknown → NotFoundPage. | ✓ |
| Add a soft toast on redirect | 1-second «Перенаправляємо...» message. Adds moving parts; demo unlikely to encounter direct deep-links. | |

**User's choice:** Phase 2 contract verbatim (Recommended).

---

## Construction Log Timeline

### Q1 — Lightbox navigation

| Option | Description | Selected |
|--------|-------------|----------|
| ←→ keys + on-screen buttons + counter | Full keyboard-friendly + discoverable. Reused on /zhk gallery. | ✓ |
| Open / Esc only | Single-photo viewer; close-only. Defeats fullscreen browse UX. | |
| Buttons only, no ←→ keys | Less power-user friendly; minor a11y regression. | |

**User's choice:** ←→ keys + on-screen buttons + counter (Recommended).

### Q2 — Lightbox text

| Option | Description | Selected |
|--------|-------------|----------|
| Month + caption + position | «Січень 2026 — фундамент, секція 1» + «12 / 50» counter. Caption falls back to alt. | ✓ |
| Month + counter only | Less duplicate text; loses context if user opens directly. | |
| No text inside lightbox | Pure image; fails «which month is this» question. | |

**User's choice:** Month + caption + position (Recommended).

### Q3 — Month order

| Option | Description | Selected |
|--------|-------------|----------|
| Latest-first: Mar → Dec | Reverse-chrono. Above-fold = newest progress. Standard blog-style timeline. | ✓ |
| Chronological: Dec → Mar | «Foundation to today» narrative. Latest invisible without scrolling. | |

**User's choice:** Latest-first (Recommended).

### Q4 — Lightbox image width

| Option | Description | Selected |
|--------|-------------|----------|
| Extend optimizer to [640, 960, 1920] | One-line change; lazy thumbs unchanged; lightbox loads 1920 on open. | ✓ |
| Keep [640, 960], lightbox shows 960 | CSS-scaled; soft on 1920 viewport — fights «ахуєнний desktop» mandate. | |
| Don't extend; preload raw .jpg | Loads UN-encoded JPG; breaks pipeline. Reject. | |

**User's choice:** Extend to [640, 960, 1920] (Recommended).

---

## ANI-03 Hover Spec

### Q1 — Hover scope

| Option | Description | Selected |
|--------|-------------|----------|
| ЖК cards + flagship + construction thumbs | Pipeline cards, FlagshipCard (home + /projects), 50 construction thumbs. /dev/grid inherits via shared component. Single hover-language. | ✓ |
| Just ЖК cards + flagship (spec literal) | Tighter scope; construction thumbs use lighter affordance. | |
| All of above + /zhk gallery renders | Add 8 ЖК gallery thumbs too. Most comprehensive. | |

**User's choice:** ЖК cards + flagship + construction thumbs (Recommended).
**Notes:** Implicit: /zhk gallery thumbs ALSO get hover (they're clickable to lightbox). Promoted from option (c) into the standard scope.

### Q2 — Hover effect intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Full triple: scale 1.02 + accent border-glow + image-overlay lift | Whole card scale, 16-24px box-shadow #C1F33D ~12-20% alpha, overlay tint reduces. 200ms ease-out cubic-bezier. Spec verbatim. | ✓ |
| Scale + overlay-opacity only | Drop the accent border-glow. Visually cleaner; slight spec drift. | |
| CSS-only via Tailwind hover: classes | Pure Tailwind; no Motion/JS. (Implementation choice, not effect intensity.) | |

**User's choice:** Full triple effect (Recommended).
**Notes:** Implementation will use pure Tailwind hover:* classes (no Motion variant) per Claude's Discretion.

### Q3 — Non-clickable cards (Maietok/NTEREST)

| Option | Description | Selected |
|--------|-------------|----------|
| Same hover, no cursor-pointer | Uniform brand mood; cursor: default; no tooltip. | ✓ |
| Hover only on clickable cards | Differential PipelineCard rendering; spec drift. | |
| Lighter hover for non-clickable | Image-overlay only (no scale/glow). Overengineered for v1. | |

**User's choice:** Same hover, no cursor-pointer (Recommended).

---

## Claude's Discretion

The user authorized me to settle these without asking:

- **`/contact` composition** — Single-column layout: H1 «Контакт» + subtitle + реквізити-block (4 rows: email/phone/address/socials) + primary mailto CTA. NO duplicate ЄДРПОУ/license (Footer covers). Disabled socials visible (`href="#"` + cursor-default + aria-label) per Phase 1 D-08 pattern.
- **`/dev/grid` scope** — Hidden route alongside `/dev/brand` (Phase 3 D-25 pattern). Renders the full /projects composition (StageFilter + FlagshipCard + PipelineGrid + AggregateRow) but feeds `fixtures` (10 synthetic ЖК across 4 stages × 4 presentations). Includes synthetic flagship slot via fixture-08 (`presentation: 'flagship-external'`). Stage-fallback test (cast unknown stage → expect `'—'` badge) is a one-shot manual verify.

---

## Deferred Ideas (captured in CONTEXT.md `<deferred>`)

- Scroll-reveal on Phase 4 sections — Phase 5
- Route transitions — Phase 5
- `useReducedMotion()` full sweep — Phase 5
- OG meta tags per route — Phase 6
- `<title>` per route — Phase 6 (or Phase 4 inline `useEffect` at planner discretion)
- Sticky month headers on /construction-log — Phase 5 if needed
- Lightbox zoom / share — v2
- Real contact form + endpoint — v2 INFR2-04
- Multi-language EN — v2
- Detail pages for Маєток / NTEREST — v2
- Phone / address / Pipeline-4 / Etno Dim address client confirmations — Phase 7 handoff doc

---

*Discussion completed: 2026-04-25*
