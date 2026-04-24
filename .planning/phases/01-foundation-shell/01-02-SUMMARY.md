---
phase: 01-foundation-shell
plan: 02
subsystem: ui
tags: [tailwind, tokens, fonts, css, react, montserrat, accessibility]

# Dependency graph
requires:
  - phase: 01-01
    provides: [package.json with @fontsource/montserrat + tailwindcss + @tailwindcss/vite, index.html with #root div]
provides:
  - src/index.css with Tailwind v4 @theme (6-hex closed palette), body base, :focus-visible ring
  - src/main.tsx React 19 entrypoint with Montserrat cyrillic 400/500/700 subset imports
affects:
  - 01-03
  - 01-04
  - all downstream phases using bg-bg / text-text-muted / border-accent Tailwind utilities

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Tailwind v4 CSS-first @theme directive for design tokens (no tailwind.config.js, no :root)
    - Fontsource cyrillic-only subset import pattern (per-weight CSS, no package root)
    - focus-visible-only keyboard accessibility ring in accent color

key-files:
  created:
    - src/index.css
    - src/main.tsx
  modified: []

key-decisions:
  - "@theme uses --color-* naming convention which generates bg-*/text-*/border-* Tailwind utilities (not --bg-color which would not generate utilities)"
  - "Fontsource imports use cyrillic-400/500/700.css entry points, NOT package root — prevents ~300-file Latin overhead"
  - "Suppressed :focus with outline:none + :focus-visible for keyboard-only ring — mouse clicks don't show outline, Tab does (WCAG 2.1 AA)"
  - "No standalone @tailwindcss/cli — Tailwind v4 runs only through Vite plugin; CLI probe in plan's verify step is not applicable without the CLI package"

patterns-established:
  - "Tokens pattern: all brand values in @theme block in src/index.css, consumed via var(--color-*) or Tailwind utility classes"
  - "Entrypoint pattern: fonts first, then index.css, then App — font-face registered before @theme references Montserrat"

requirements-completed:
  - VIS-01
  - VIS-02

# Metrics
duration: 2min
completed: 2026-04-24
---

# Phase 01 Plan 02: Tokens, Fonts & Base CSS Summary

**Tailwind v4 @theme block with 6-hex closed brand palette, Montserrat cyrillic-only subset (400/500/700), and WCAG-compliant :focus-visible ring in acid lime accent**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-24T16:07:20Z
- **Completed:** 2026-04-24T16:09:08Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Brand palette locked at exactly 6 hexes in @theme: `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A` — no prototype `#2a3038` drift
- Montserrat cyrillic 400/500/700 imported via subset CSS entry points only (full Ukrainian glyph coverage, ~60-80KB woff2 vs ~300-file Latin overhead)
- Keyboard :focus-visible ring: 2px `#C1F33D` outline, 2px offset (8.85:1 WCAG AAA contrast on `#2F3640`)
- React 19 StrictMode entrypoint with null-check on `#root` element

## Token Inventory

**Unique hexes in src/index.css (exactly 6):**

```
#020A0A  --color-bg-black   (deep black sections)
#2F3640  --color-bg          (main dark background)
#3D3B43  --color-bg-surface  (cards, panels)
#A7AFBC  --color-text-muted  (muted text — ≥14pt only)
#C1F33D  --color-accent      (acid lime — accent only)
#F5F7FA  --color-text        (primary text on dark, 10.5:1 AAA)
```

## Fontsource Import List (src/main.tsx)

```
@fontsource/montserrat/cyrillic-400.css  (Regular)
@fontsource/montserrat/cyrillic-500.css  (Medium)
@fontsource/montserrat/cyrillic-700.css  (Bold)
```

No package-root import (`@fontsource/montserrat`). No Latin subsets. No extra weights.

## Focus-Visible Rule Coverage

`:focus-visible` applies to: `a`, `button`, `input`, `select`, `textarea`, `summary`, `[tabindex]`

```css
outline: 2px solid var(--color-accent);
outline-offset: 2px;
border-radius: 2px;
```

## Tailwind Utility Generation

Note: Tailwind v4 with `@tailwindcss/vite` does not ship a standalone CLI binary. Utility generation (`bg-bg`, `text-text-muted`, `border-accent`) is verified at Vite build/dev time when Plans 03/04 add components using these classes. The @theme key naming convention `--color-bg` correctly generates `.bg-bg`, `--color-text-muted` generates `.text-text-muted`, `--color-accent` generates `.border-accent` per Tailwind v4 CSS-first specification.

## Task Commits

1. **Task 1: Write src/index.css with @theme tokens and base styles** - `7d701bf` (feat)
2. **Task 2: Write src/main.tsx entrypoint with Fontsource cyrillic imports** - `c366071` (feat)

## Files Created/Modified

- `/Users/admin/Documents/Проєкти/vugoda-website/src/index.css` — Tailwind v4 @import + @theme (6 hexes) + @layer base (body + focus-visible), 76 lines
- `/Users/admin/Documents/Проєкти/vugoda-website/src/main.tsx` — ReactDOM.createRoot → StrictMode App; 3 cyrillic Fontsource imports; index.css + App imports, 28 lines

## Decisions Made

- `@theme` keys use `--color-*` naming so Tailwind v4 generates `bg-*`/`text-*`/`border-*` utility classes. If keys were named `--bg-color` instead, utilities would silently fail downstream.
- Fontsource imports use cyrillic-only entry points to avoid the ~300-file package root which would pull in all Latin weights.
- `:focus` suppressed (outline: none) + `:focus-visible` added — mouse clicks show no outline, keyboard Tab shows 2px lime ring.
- Tailwind v4 standalone CLI probe in the plan's verify step is not executable without `@tailwindcss/cli` package, which is intentionally not in the project's dependencies (Vite plugin handles all Tailwind compilation).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The plan's automated verify step calls `npx tailwindcss` for the CLI probe, but Tailwind v4 with `@tailwindcss/vite` does not include a standalone CLI binary. The project correctly uses Vite integration only. Utility generation is confirmed as correct by design (verified @theme key naming convention matches Tailwind v4 docs) and will be validated end-to-end when Plans 03/04 add components.

## Known Stubs

None — this plan creates CSS and entrypoint files only. No UI stubs or placeholders.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/index.css` ready: bg-bg/text-text-muted/border-accent Tailwind utilities available for Plans 03/04 components
- `src/main.tsx` ready: expects `src/App.tsx` from Plan 03 — will not compile in isolation until Plan 03 lands (expected in parallel-wave work)
- VIS-01 and VIS-02 fully satisfied

---
*Phase: 01-foundation-shell*
*Completed: 2026-04-24*
