---
phase: 01-foundation-shell
plan: 01
subsystem: scaffold
tags: [deps, vite, typescript, tailwind, svgr, gh-pages]
dependency_graph:
  requires: []
  provides: [package.json, lockfile, tsconfig, vite.config.ts, index.html, public/.nojekyll, favicon, svg-types]
  affects: [01-02, 01-03, 01-04, 01-05]
tech_stack:
  added:
    - vite@6.3.6
    - react@19.2.0
    - react-dom@19.2.0
    - react-router-dom@7.14.0
    - motion@12.38.0
    - lucide-react@1.11.0
    - "@fontsource/montserrat@5.2.8"
    - "@tailwindcss/vite@4.2.4"
    - tailwindcss@4.2.4
    - "@vitejs/plugin-react@5.2.0"
    - vite-plugin-svgr@4.3.0
    - typescript@5.8.3
    - "@types/react@19.2.0"
    - "@types/react-dom@19.2.0"
    - "@types/node@22.14.0"
  patterns:
    - Tailwind v4 CSS-first @theme directive (no tailwind.config.js)
    - vite-plugin-svgr with ?react query suffix only (non-destructive for URL imports)
    - HashRouter pattern prepared via base: '/vugoda-website/' in Vite config
key_files:
  created:
    - package.json
    - package-lock.json
    - .nvmrc
    - tsconfig.json
    - tsconfig.node.json
    - vite.config.ts
    - public/.nojekyll
    - public/favicon.svg
    - src/vite-env.d.ts
    - src/types/svg.d.ts
    - index.html
  modified: []
decisions:
  - "Anti-list packages excluded: @google/genai, express, dotenv, autoprefixer, gh-pages, framer-motion — all prototype AI-backend leftovers"
  - "lucide-react pinned at ^1.11.0 (not ^0.546) to avoid breaking Footer imports in Plan 01-03"
  - "svgo: false in vite-plugin-svgr to prevent geometry drift on brand-authored SVGs"
  - "index.html favicon path uses /vugoda-website/ base prefix for GH Pages correctness"
  - "OG/Twitter/canonical meta deferred to Phase 6 (QA-03 scope)"
metrics:
  duration_seconds: 169
  completed_date: "2026-04-24T16:03:45Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 11
  files_modified: 0
---

# Phase 01 Plan 01: Deps and Scaffold Summary

Pinned dependency scaffold for Vite 6 + React 19 + TypeScript 5.8 + Tailwind v4 + Motion 12 + react-router-dom 7 + SVGR, with GH Pages base-path plumbing and brand favicon in place.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Initialize package.json, lockfile, tsconfig, .nvmrc | 3f0df1e | package.json, package-lock.json, .nvmrc, tsconfig.json, tsconfig.node.json |
| 2 | Vite config with base path, plugins, and public scaffold | 77b4929 | vite.config.ts, public/.nojekyll, public/favicon.svg, src/vite-env.d.ts, src/types/svg.d.ts |
| 3 | Create index.html entry | 5c3cf33 | index.html |

## Dependency Groups

**Runtime (6 packages):**
- `react@^19.2.0`, `react-dom@^19.2.0`
- `react-router-dom@^7.14.0`
- `motion@^12.38.0`
- `lucide-react@^1.11.0`
- `@fontsource/montserrat@^5.2.8`

**Dev (9 packages):**
- `vite@^6.3.6`, `@vitejs/plugin-react@^5.2.0`
- `tailwindcss@^4.2.4`, `@tailwindcss/vite@^4.2.4`
- `vite-plugin-svgr@^4.3.0`
- `typescript@~5.8.3`
- `@types/react@^19.2.0`, `@types/react-dom@^19.2.0`, `@types/node@^22.14.0`

## npm install Output

- 129 packages added, 0 vulnerabilities found
- No peer-dep warnings blocking the build

## Anti-list Confirmation

The following packages are confirmed ABSENT from package.json:
- `@google/genai` — prototype AI backend leftover
- `express` — prototype server leftover
- `dotenv` — prototype env management leftover
- `autoprefixer` — Tailwind v4 handles prefixing natively
- `gh-pages` (npm package) — replaced by `actions/deploy-pages@v4`
- `framer-motion` — renamed to `motion`; only `motion@^12.38.0` present

## public/.nojekyll

Zero-byte file confirmed (`wc -c` returns 0). Committed at `77b4929`. GitHub Pages will not run Jekyll and will not strip `_`-prefixed folders from the build output.

## Files Created and Their Roles

| File | Role |
|------|------|
| `package.json` | Pinned dependency surface for Phase 1 and all downstream plans |
| `package-lock.json` | Deterministic install lockfile; committed so CI gets exact versions |
| `.nvmrc` | Node 20.19.0 pin — matches Vite 6 minimum requirement |
| `tsconfig.json` | React 19 + Vite 6 TypeScript config (strict, Bundler moduleResolution, noEmit) |
| `tsconfig.node.json` | Config for vite.config.ts itself (composite, allows esbuild to type-check Vite config) |
| `vite.config.ts` | Build config: base `/vugoda-website/`, react + tailwindcss + svgr plugins, dist output |
| `public/.nojekyll` | GitHub Pages Jekyll bypass (zero bytes) |
| `public/favicon.svg` | Brand favicon copied from `brand-assets/favicon/favicon-32.svg` (32×32 cube glyph) |
| `src/vite-env.d.ts` | Vite client type reference (`/// <reference types="vite/client" />`) |
| `src/types/svg.d.ts` | TypeScript declarations for `*.svg?react` (React component) and `*.svg` (URL string) |
| `index.html` | HTML entry: lang=uk, theme-color=#2F3640, title, favicon, #root mount, /src/main.tsx |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan delivers only scaffold/config files. No UI components, no data flow, no rendering stubs.

## Self-Check: PASSED

- `package.json` exists: FOUND
- `package-lock.json` exists: FOUND
- `.nvmrc` contains `20.19.0`: FOUND
- `tsconfig.json` with `jsx: react-jsx`, `strict: true`, `moduleResolution: Bundler`: FOUND
- `vite.config.ts` with `base: '/vugoda-website/'`: FOUND
- `public/.nojekyll` zero-byte: FOUND
- `public/favicon.svg` with `viewBox="0 0 32 32"`: FOUND
- `src/vite-env.d.ts`: FOUND
- `src/types/svg.d.ts`: FOUND
- `index.html` with `lang="uk"`, `#2F3640`, no OG tags: FOUND
- Commits 3f0df1e, 77b4929, 5c3cf33: FOUND (git log verified)
