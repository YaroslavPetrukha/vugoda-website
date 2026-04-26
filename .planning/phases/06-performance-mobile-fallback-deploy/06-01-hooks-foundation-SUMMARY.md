---
phase: 06-performance-mobile-fallback-deploy
plan: 01
subsystem: ui
tags: [react, hooks, useSyncExternalStore, matchMedia, document-title, ssr-safe, leaf-module]

requires:
  - phase: 05-motion-and-cinematic
    provides: "src/hooks/useSessionFlag.ts — sibling leaf-hook pattern (named export, JSDoc @module header, typeof window/document SSR guards, react-only imports)"
provides:
  - "src/hooks/useMatchMedia(query) — reactive boolean for any CSS media query, useSyncExternalStore-based"
  - "src/hooks/usePageTitle(title) — per-route document.title setter on [title] dep"
affects:
  - 06-04-mobile-fallback (Layout.tsx will subscribe to '(max-width: 1023px)' via useMatchMedia for QA-01 short-circuit)
  - 06-07-page-titles (all 8 page components will call usePageTitle for QA-03 SEO + tab discrimination)

tech-stack:
  added: []
  patterns:
    - "useSyncExternalStore canonical pattern for reactive browser-API subscriptions (React 18+, hydration-mismatch-safe, future-proof for v2 SSR)"
    - "5-line useEffect for document.title (no react-helmet — RESEARCH §Don't Hand-Roll)"
    - "Sibling-of-useSessionFlag leaf-hook pattern: one-file-one-hook, named export only, react-only imports, JSDoc @module header, defensive typeof window/document guards"

key-files:
  created:
    - "src/hooks/useMatchMedia.ts (45 lines incl. JSDoc) — reactive media-query hook"
    - "src/hooks/usePageTitle.ts (38 lines incl. JSDoc) — document.title setter hook"
  modified: []

key-decisions:
  - "useSyncExternalStore over useEffect+useState for matchMedia (D-02 + RESEARCH §Pattern 1) — locked: handles concurrent rendering, hydration-mismatch-safe, future-proof for v2 BrowserRouter migration"
  - "getServerSnapshot returns false (assume desktop pre-hydration) — sensible default for primary use case '(max-width: 1023px)' = is-mobile-viewport"
  - "5-line useEffect over react-helmet for document.title (D-17 locked) — direct DOM API ships zero kB of library code"

patterns-established:
  - "Leaf-hook envelope: src/hooks/*.ts files import ONLY from 'react'; never from 'motion', 'components', 'data', 'content', 'pages' (enforced by check-brand.ts importBoundaries gate)"
  - "SSR-safe defaults: typeof window/document guards in every hook, even though project has no SSR — cheap insurance for v2 migration consistency, matches useSessionFlag.ts precedent"

requirements-completed: [QA-01, QA-03]

duration: 5min
completed: 2026-04-26
---

# Phase 06 Plan 01: hooks-foundation Summary

**Two leaf-module hooks (useMatchMedia via useSyncExternalStore + usePageTitle via useEffect) shipped as Phase 6 Wave 1 dependencies — zero consumers in this plan, leaf-only by design.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-26T19:11:11Z
- **Completed:** 2026-04-26T19:15:48Z
- **Tasks:** 2
- **Files created:** 2
- **Files modified:** 0

## Accomplishments

- `src/hooks/useMatchMedia.ts` — React-18 canonical `useSyncExternalStore` pattern (subscribe → getSnapshot → getServerSnapshot), reactive on MediaQueryList `'change'`, with proper unsubscribe cleanup. SSR-safe via `typeof window === 'undefined'` guards in subscribe + getSnapshot, plus `getServerSnapshot` returning `false` (assume desktop pre-hydration).
- `src/hooks/usePageTitle.ts` — 5-line `useEffect` with `[title]` dep, SSR-safe via `typeof document === 'undefined'` guard. No `react-helmet`, no library code shipped.
- Both hooks follow the sibling `useSessionFlag.ts` pattern verbatim: named export only, JSDoc `@module hooks/{name}` header, `react`-only imports, defensive SSR guards. Zero cross-imports from Motion / components / data / content / pages — passes `scripts/check-brand.ts` `importBoundaries` gate (5/5 PASS).

## Task Commits

Each task was committed atomically (`--no-verify` per parallel-executor protocol — orchestrator runs hooks once after all agents complete):

1. **Task 1: Create src/hooks/useMatchMedia.ts (D-02 + RESEARCH §Pattern 1)** — `bd057ff` (feat)
2. **Task 2: Create src/hooks/usePageTitle.ts (D-17)** — `54407ca` (feat)

**Plan metadata:** _committed at end of plan_

## Files Created/Modified

**Created:**

- `src/hooks/useMatchMedia.ts` — Reactive media-query hook for QA-01 mobile-fallback detection (D-02). 45 lines incl. ~30-line JSDoc. Verbatim final form (per `<action>` block):

  ```ts
  import { useSyncExternalStore } from 'react';

  export function useMatchMedia(query: string): boolean {
    const subscribe = (callback: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    };
    const getSnapshot = () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    };
    const getServerSnapshot = () => false;
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }
  ```

- `src/hooks/usePageTitle.ts` — Per-route `document.title` setter for QA-03 SEO + tab discrimination (D-17). 38 lines incl. ~30-line JSDoc. Verbatim final form (per `<action>` block):

  ```ts
  import { useEffect } from 'react';

  export function usePageTitle(title: string): void {
    useEffect(() => {
      if (typeof document === 'undefined') return;
      document.title = title;
    }, [title]);
  }
  ```

**Modified:** none — leaf-only plan, no edits to existing files.

## Decisions Made

All decisions inherited and locked from `06-CONTEXT.md` and `06-RESEARCH.md`; no new decisions introduced in this plan:

- **`useSyncExternalStore` over `useEffect`+`useState` for matchMedia** (D-02 + RESEARCH §"Pattern 1" — locked). Rationale: handles React 18 concurrent rendering, avoids hydration-mismatch class even without SSR today, future-proof for v2 BrowserRouter + Vercel migration that would otherwise require re-write.
- **`getServerSnapshot` returns `false`** — sensible default for the primary use site `(max-width: 1023px)` ("is mobile viewport?"). Pre-hydration assumes desktop; client takes over with real value after hydration.
- **5-line `useEffect` over `react-helmet`** (D-17 locked, RESEARCH §"Don't Hand-Roll"). Rationale: direct DOM API ships zero kB of library code; per-route title constants live with content modules per D-19, not in the hook.
- **SSR-safe `typeof window/document` guards in both hooks** — matches `useSessionFlag.ts` precedent, cheap insurance for v2 migration consistency even though project has no SSR today.

## Deviations from Plan

None — plan executed exactly as written. Verbatim file contents from the `<action>` blocks shipped without edit.

(No Rule 1 bugs found — both hooks compile cleanly on first try and pass every grep gate enumerated in `<acceptance_criteria>`.)

## Issues Encountered

**Pre-existing prebuild failure on `npm run build`** — out-of-scope, logged in `.planning/phases/06-performance-mobile-fallback-deploy/deferred-items.md`.

- `npm run build` runs `prebuild = tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs renders && node scripts/optimize-images.mjs construction`. The second step fails with `unable to open for write` on `public/renders/etno-dim/_opt/43621.jpg-1920.jpg` — sharp cannot write to a non-existent `_opt/` directory.
- **Confirmed pre-existing:** stashed Plan 06-01 changes and re-ran `npm run build` → same failure reproduces. Hook files do NOT touch the image pipeline; failure is unrelated to 06-01 scope.
- **Verification proxy used:** `npx tsc --noEmit` (PASS — both hooks compile) + `npx tsx scripts/check-brand.ts` (5/5 PASS — denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries, noInlineTransition all pass on the new hook files). Both gates are the only verification this leaf-only plan can drive.

## Verification Evidence

```
$ test -f src/hooks/useMatchMedia.ts && test -f src/hooks/usePageTitle.ts && echo OK
OK

$ npx tsc --noEmit && echo OK
OK

$ wc -l src/hooks/useMatchMedia.ts src/hooks/usePageTitle.ts
      45 src/hooks/useMatchMedia.ts
      38 src/hooks/usePageTitle.ts
      83 total

$ npx tsx scripts/check-brand.ts
[check-brand] PASS denylistTerms
[check-brand] PASS paletteWhitelist
[check-brand] PASS placeholderTokens
[check-brand] PASS importBoundaries
[check-brand] PASS noInlineTransition
[check-brand] 5/5 checks passed

# Acceptance grep counts (Task 1):
#   ^export function useMatchMedia(query: string): boolean   → 1
#   useSyncExternalStore                                     → 4 (≥2)
#   getServerSnapshot                                        → 3 (≥2)
#   addEventListener('change'                                → 1
#   removeEventListener('change'                             → 1
#   from 'react'                                             → 1
#   forbidden imports (motion|components|data|content|pages) → none
#
# Acceptance grep counts (Task 2):
#   ^export function usePageTitle(title: string): void       → 1
#   document.title = title                                   → 1
#   import { useEffect } from 'react'                        → 1
#   useEffect(                                               → 1
#   [title] dep                                              → 1
#   forbidden imports                                        → none
#   {{...}} mustache placeholders                            → none
```

## Next Phase Readiness

Wave 2 consumers can now import these hooks:

- **Plan 06-04 (mobile-fallback)** — `Layout.tsx` will `import { useMatchMedia } from '../hooks/useMatchMedia'` and short-circuit to `<MobileFallback>` at `useMatchMedia('(max-width: 1023px)') === true` per QA-01.
- **Plan 06-07 (page-titles)** — all 8 page components (`Home.tsx`, `Projects.tsx`, `ZhkEtnoDim.tsx`, `Construction.tsx`, `Contact.tsx`, `DevBrand.tsx`, `DevGrid.tsx`, `NotFound.tsx`) will `import { usePageTitle } from '../hooks/usePageTitle'` and call it with their per-page constants per QA-03.

The `useSyncExternalStore` choice is **locked** for the entire phase — any 06-04 or future plan considering a `useEffect`+`useState` rewrite must re-open D-02. Same for `react-helmet` vs. 5-line `useEffect` — D-17 closed.

---

## Self-Check: PASSED

**Files exist:**

- FOUND: `src/hooks/useMatchMedia.ts`
- FOUND: `src/hooks/usePageTitle.ts`

**Commits exist:**

- FOUND: `bd057ff` (feat(06-01): add useMatchMedia reactive media-query hook)
- FOUND: `54407ca` (feat(06-01): add usePageTitle document.title setter hook)

---

_Phase: 06-performance-mobile-fallback-deploy_
_Completed: 2026-04-26_
