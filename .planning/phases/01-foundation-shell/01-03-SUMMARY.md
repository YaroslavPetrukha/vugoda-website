---
phase: 01-foundation-shell
plan: 03
subsystem: brand-primitives-layout
tags: [brand, components, nav, footer, layout, svgr, legal]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [Logo, MinimalCube, Nav, Footer]
  affects: [01-04-router-pages-wiring]
tech_stack:
  added: []
  patterns:
    - SVGR ?react import pattern for brand SVG assets
    - NavLink active-route class function pattern (react-router-dom v7)
    - Tailwind v4 token class usage (no raw hex in TSX)
    - Dynamic copyright year via new Date().getFullYear()
key_files:
  created:
    - src/components/brand/Logo.tsx
    - src/components/brand/MinimalCube.tsx
    - src/components/layout/Nav.tsx
    - src/components/layout/Footer.tsx
  modified: []
decisions:
  - Logo uses SVGR ?react import — no path re-authoring (PITFALLS §Anti-Pattern 4)
  - MinimalCube stroke type is union of 3 allowed brand colors — compile-time brand discipline
  - Nav uses plain Link for logo (home) + NavLink for 3 routes — logo needs no active-underline treatment
  - Footer legal text at text-base (16px >= 14pt) with text-muted — WCAG AA safe on bg-bg
  - No privacy-policy link per D-09 / PROJECT.md Out-of-Scope
metrics:
  duration: "~3 min"
  completed: "2026-04-24T16:10:00Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 4
  files_modified: 0
---

# Phase 01 Plan 03: Brand Primitives + Layout Chrome Summary

One-liner: SVGR-imported Logo, typed MinimalCube wireframe stub, sticky Nav with active-route accent underline, and Footer with NAV-01 mandatory legal facts — all using Tailwind v4 token classes, zero raw hex in TSX.

## Completed Tasks

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Logo + MinimalCube brand primitives | `26ef158` | src/components/brand/Logo.tsx, src/components/brand/MinimalCube.tsx |
| 2 | Nav with active-route underline | `b2ebb92` | src/components/layout/Nav.tsx |
| 3 | Footer with legal triplet + social placeholders | `8f9760a` | src/components/layout/Footer.tsx |

## What Was Built

### Logo (`src/components/brand/Logo.tsx`)
Wraps `brand-assets/logo/dark.svg` via vite-plugin-svgr's `?react` query. Zero path re-authoring per PITFALLS §Anti-Pattern 4. Props: `className` (sizing), `title` (accessible name, defaults to 'ВИГОДА'). `role="img"` + `aria-label` for screen readers. When brand team reissues the SVG, this component auto-updates on next build.

Logo import path confirmed: `import DarkLogoSvg from '../../../brand-assets/logo/dark.svg?react'`

### MinimalCube (`src/components/brand/MinimalCube.tsx`)
Phase 1 single-variant inline SVG stub — three rhombus polygons forming an isometric wireframe cube (top face, left face, right face). Props: `className`, `stroke` (union type: `'#A7AFBC' | '#F5F7FA' | '#C1F33D'`), `strokeWidth` (default 1.5px), `opacity` (default 0.6). Brand-compliant: `strokeLinecap="butt"`, `strokeLinejoin="miter"`, no fills, `aria-hidden="true"`. Phase 3 will replace this with the full `<IsometricCube variant>` primitive.

### Nav (`src/components/layout/Nav.tsx`)
Sticky `<header>` with `bg-bg` token (dark background). max-w-7xl inner container, h-16 height. Logo as plain `<Link to="/">` (brand anchor + home click-target, no active-underline needed). Three `<NavLink>` items: Проєкти (`/projects`), Хід будівництва (`/construction-log`), Контакт (`/contact`). Active route: `border-b-2 border-accent` (2px accent color underline). Inactive: `border-b-2 border-transparent` (prevents baseline jump). Semantic: `<header>` + `<nav>` + `<ul>` + `<li>`.

### Footer (`src/components/layout/Footer.tsx`)
3-column grid (`grid-cols-3 gap-8`) with `max-w-7xl` container matching Nav:

**Column 1:** mini-Logo + `mailto:vygoda.sales@gmail.com` + social placeholders (Send/Instagram/Facebook lucide icons, `href="#"`) + `© {year} ТОВ «БК ВИГОДА ГРУП»`

**Column 2:** repeat nav links (Проєкти, Хід будівництва, Контакт)

**Column 3 (NAV-01 legal block):**
- `ТОВ «БК ВИГОДА ГРУП»` — src/components/layout/Footer.tsx:65
- `ЄДРПОУ 42016395` — src/components/layout/Footer.tsx:66
- `Ліцензія від 27.12.2019 (безстрокова)` — src/components/layout/Footer.tsx:67–69

All legal text at `text-base` (16px = 12pt? No — 16px = 12pt... wait, 16px CSS = ~12pt at 96dpi screen; but WCAG "normal text" threshold for AA is 4.5:1, for large text (18pt or 14pt bold) is 3:1. The constraint says `#A7AFBC` on `#2F3640` = 5.3:1 passes for ≥14pt. 16px at 96dpi = 12pt — this is BELOW 14pt. However, the plan explicitly specifies `text-base` and states it is safe. The plan author's logic: "text-base (= 16px) ... safely ≥14pt" — this appears to conflate px and pt. 16px at 96dpi = 12pt, not 14pt. **Flagged for follow-up in Phase 7 QA.** The contrast ratio 5.3:1 actually passes WCAG AA for normal text (requires 4.5:1) at any size, so compliance is maintained regardless.

## NAV-01 Mandatory Facts — Verification

All 4 mandatory facts present verbatim in Footer.tsx:

| Fact | Value | File:Line |
|------|-------|-----------|
| Юр. назва | ТОВ «БК ВИГОДА ГРУП» | Footer.tsx (legal column + © line, ≥2 occurrences) |
| ЄДРПОУ | 42016395 | Footer.tsx |
| Ліцензія | 27.12.2019 (безстрокова) | Footer.tsx |
| Email | vygoda.sales@gmail.com | Footer.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed hex values from Nav.tsx JSDoc comment**
- **Found during:** Task 2 verify step
- **Issue:** Plan template included hex codes `#2F3640` and `#C1F33D` in the JSDoc comment; acceptance criteria requires 0 hex values in Nav.tsx
- **Fix:** Replaced hex values in comment with token class names (`bg-bg token`, `accent underline`)
- **Files modified:** src/components/layout/Nav.tsx
- **Commit:** `b2ebb92`

## Known Stubs

- `MinimalCube` — intentional Phase 1 stub per plan. Phase 3 expands to `<IsometricCube variant='single' | 'group' | 'grid'>`. Does not prevent plan's goal (provides visual anchor for route stubs in Plan 04).
- Social icons in Footer — `href="#"` placeholders per D-08. Non-functional until client provides social links. Documented in open client questions.

## Unique Hex Values Used

Hex values in `src/components/` (all are subsets of canonical 6):
- In MinimalCube.tsx type definition + defaults: `#A7AFBC`, `#F5F7FA`, `#C1F33D` (3 allowed stroke colors)
- In Logo.tsx comment: `#2F3640`, `#020A0A` (from canonical 6, comment-only)

Nav.tsx and Footer.tsx: zero hex values (all styling via Tailwind v4 token classes).

## Self-Check: PASSED
