---
phase: 06-performance-mobile-fallback-deploy
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/hooks/useMatchMedia.ts
  - src/hooks/usePageTitle.ts
autonomous: true
requirements: [QA-01, QA-03]
must_haves:
  truths:
    - "src/hooks/useMatchMedia.ts exports a `useMatchMedia(query: string): boolean` hook using useSyncExternalStore (React 18 canonical pattern, SSR-safe via getServerSnapshot returning false)"
    - "src/hooks/useMatchMedia.ts updates reactively on window resize / orientationchange (subscribed to MediaQueryList 'change' event)"
    - "src/hooks/usePageTitle.ts exports a `usePageTitle(title: string): void` hook that sets document.title in a useEffect with [title] dep"
    - "Both hooks are pure utilities (NO Motion, NO components, NO data, NO content imports — leaf modules same as useSessionFlag.ts)"
    - "`tsc --noEmit` passes after both files exist; both hooks compile without errors"
  artifacts:
    - path: src/hooks/useMatchMedia.ts
      provides: "Reactive media-query hook for QA-01 mobile-fallback detection (D-02)"
      contains: "useSyncExternalStore"
    - path: src/hooks/usePageTitle.ts
      provides: "Per-route document.title setter for QA-03 SEO + tab discrimination (D-17)"
      contains: "document.title"
  key_links:
    - from: "src/hooks/useMatchMedia.ts"
      to: "window.matchMedia"
      via: "subscribe/getSnapshot/getServerSnapshot useSyncExternalStore"
      pattern: "useSyncExternalStore"
    - from: "src/hooks/usePageTitle.ts"
      to: "document.title"
      via: "useEffect side-effect"
      pattern: "document\\.title\\s*="
---

<objective>
Ship two leaf-module hooks under `src/hooks/` per CONTEXT D-02 and D-17 + RESEARCH §"Pattern 1: SSR-safe `useMatchMedia`".

These hooks are dependencies for downstream Phase 6 plans:
- `useMatchMedia('(max-width: 1023px)')` is consumed by `Layout.tsx` (06-04) to short-circuit to `<MobileFallback>` at `<1024px` per QA-01.
- `usePageTitle(title)` is consumed by all 8 page components (06-07) to set per-route `document.title` per QA-03 / SEO.

Both hooks are pure utilities — zero side imports, sibling files of the existing Phase 5 `useSessionFlag.ts`. Total LOC: ~30-40 lines across both files including JSDoc.

Why useSyncExternalStore (not useEffect+useState) for matchMedia: RESEARCH.md §"Pattern 1" — React 18+ canonical pattern, handles concurrent rendering, no hydration-mismatch class even if SSR is added at v2. The pattern is subscribe → getSnapshot → getServerSnapshot. getServerSnapshot returns `false` (sensible default for "is mobile?" before client hydration).

Why useEffect for document.title: RESEARCH.md §"State of the Art" rejects react-helmet — `useEffect(() => { document.title = title }, [title])` is 5 lines and ships zero kB of library code.

Output: 2 new files. No edits to any existing file. No tests (project has no test framework per STACK.md MVP posture; verification is `tsc --noEmit` + grep gates).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@src/hooks/useSessionFlag.ts
</context>

<interfaces>
<!-- Existing sibling hook pattern (verbatim). Phase 6 hooks follow this shape: -->

```ts
// src/hooks/useSessionFlag.ts (existing, do NOT edit)
import { useEffect, useRef, useState } from 'react';

export function useSessionFlag(key: string): boolean {
  const [wasAlreadySet] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(key) !== null;
  });
  const wroteOnce = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (wroteOnce.current) return;
    wroteOnce.current = true;
    if (sessionStorage.getItem(key) === null) {
      sessionStorage.setItem(key, '1');
    }
  }, [key]);

  return wasAlreadySet;
}
```

Pattern conventions to follow:
- Named export only (no default export)
- JSDoc `@module hooks/{name}` block at top
- Pure utility — only imports from `react`
- SSR-safe via `typeof window === 'undefined'` guards (project has no SSR; cheap insurance)
- One file = one hook
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/hooks/useMatchMedia.ts (D-02 + RESEARCH §Pattern 1)</name>
  <read_first>
    - src/hooks/useSessionFlag.ts (existing sibling — pattern reference for JSDoc style + SSR guards)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-02 (locked decision: matchMedia detection mechanism, NOT CSS-only)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pattern 1: SSR-safe `useMatchMedia` via `useSyncExternalStore`" (verbatim implementation)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-VALIDATION.md §"Wave 0 Requirements" (this file is on the W0 missing list)
  </read_first>
  <files>src/hooks/useMatchMedia.ts</files>
  <action>
    Create new file `src/hooks/useMatchMedia.ts` with this EXACT content (per RESEARCH §"Pattern 1" verbatim, plus JSDoc matching the useSessionFlag.ts style):

    ```ts
    /**
     * @module hooks/useMatchMedia
     *
     * Reactive media-query hook for QA-01 viewport-conditional rendering.
     * Phase 6 D-02 (locked): JS detection mechanism, NOT CSS-only `@media` —
     * because CSS-only would still ship the desktop DOM tree to mobile users
     * AND cannot semantically replace `<Outlet>` (only style-hide it).
     *
     * Implementation: React 18 canonical `useSyncExternalStore` pattern per
     * RESEARCH §"Pattern 1" — handles concurrent rendering and avoids the
     * useState+useEffect hydration-mismatch class (cheap insurance even though
     * this project has no SSR; v2 BrowserRouter + Vercel migration would
     * otherwise need a re-write).
     *
     * Re-renders when the MediaQueryList result changes (resize / orientation
     * change). Listener cleanup is automatic via the unsubscribe return.
     *
     * `getServerSnapshot` returns `false` — a sensible default for the
     * primary use case "is this a mobile viewport?". On the server (or before
     * hydration), assume desktop. Client takes over with the real value
     * after hydration.
     *
     * Pure utility — only imports useSyncExternalStore from react. NO Motion,
     * NO components, NO data, NO content (sibling-of-useSessionFlag pattern).
     *
     * Phase 6 single-use site: Layout.tsx subscribes to `(max-width: 1023px)`
     * to short-circuit to <MobileFallback> per D-01..D-03. Reusable for any
     * future viewport-conditional logic.
     */
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

    File length: ~40 lines including JSDoc. Named export only. Defensive `typeof window === 'undefined'` guards in subscribe + getSnapshot mirror the useSessionFlag.ts pattern exactly.

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero matches in this content)
    - Hex literals: NO `#XXXXXX` patterns (zero matches)
    - Placeholder tokens: NO `{{...}}` patterns (the words "{{token}}" do not appear)
    - Inline transition: NO `transition={{` JSX-prop pattern (this is a hook file, no JSX)
    - Import boundaries: imports ONLY `react` — within the leaf-hook envelope
  </action>
  <verify>
    <automated>test -f src/hooks/useMatchMedia.ts && grep -q "export function useMatchMedia" src/hooks/useMatchMedia.ts && grep -q "useSyncExternalStore" src/hooks/useMatchMedia.ts && grep -q "getServerSnapshot" src/hooks/useMatchMedia.ts && grep -q "addEventListener('change'" src/hooks/useMatchMedia.ts && grep -q "removeEventListener('change'" src/hooks/useMatchMedia.ts && npx tsc --noEmit && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f src/hooks/useMatchMedia.ts` exits 0
    - `grep -c "^export function useMatchMedia(query: string): boolean" src/hooks/useMatchMedia.ts` returns 1
    - `grep -c "useSyncExternalStore" src/hooks/useMatchMedia.ts` returns ≥ 2 (one import, one call)
    - `grep -c "getServerSnapshot" src/hooks/useMatchMedia.ts` returns ≥ 2 (one declaration, one passed-as-3rd-arg)
    - `grep -c "addEventListener('change'" src/hooks/useMatchMedia.ts` returns 1
    - `grep -c "removeEventListener('change'" src/hooks/useMatchMedia.ts` returns 1
    - `grep -c "from 'react'" src/hooks/useMatchMedia.ts` returns 1; the import line is exactly `import { useSyncExternalStore } from 'react';`
    - `grep -E "from ['\"]motion|from ['\"].*components|from ['\"].*data|from ['\"].*content|from ['\"].*pages" src/hooks/useMatchMedia.ts` returns nothing (leaf module — no cross-import)
    - `npx tsc --noEmit` exits 0
  </acceptance_criteria>
  <done>
    - File exists at `src/hooks/useMatchMedia.ts`
    - Named-export `useMatchMedia` returns `boolean`, accepts `query: string`
    - Uses `useSyncExternalStore` (React 18 canonical pattern) — not `useEffect`+`useState`
    - Reactive: subscribes to MediaQueryList 'change' event with proper cleanup
    - SSR-safe: `getServerSnapshot` returns `false`; `typeof window === 'undefined'` guards in subscribe + getSnapshot
    - Pure utility: only imports from `react` (no Motion, no components, no data, no content)
    - `npx tsc --noEmit` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create src/hooks/usePageTitle.ts (D-17)</name>
  <read_first>
    - src/hooks/useSessionFlag.ts (existing sibling — pattern reference for JSDoc style + SSR guards)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-17 (locked decision: 5-line useEffect, no react-helmet)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-18..D-19 (title format `«{Page} — ВИГОДА»`; per-page titles wired in plan 06-07)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Don't Hand-Roll" (no react-helmet, useEffect pattern is correct)
  </read_first>
  <files>src/hooks/usePageTitle.ts</files>
  <action>
    Create new file `src/hooks/usePageTitle.ts` with this EXACT content:

    ```ts
    /**
     * @module hooks/usePageTitle
     *
     * Per-route document.title setter for QA-03 / SEO / browser-tab
     * discrimination during demo. Phase 6 D-17 (locked): 5-line useEffect,
     * no react-helmet (RESEARCH §"Don't Hand-Roll" — direct DOM API ships
     * zero kB of library code).
     *
     * Title format per D-18: «{Page} — ВИГОДА» (em-dash U+2014, brand last).
     * Root `/` keeps the verbatim wordmark «ВИГОДА — Системний девелопмент»
     * (no «{Page} —» prefix).
     *
     * Per-page title constants live with each page's content module
     * (D-19): src/content/projects.ts, src/content/zhk-etno-dim.ts,
     * src/content/construction.ts, src/content/contact.ts, src/content/home.ts.
     * Dev surfaces (DevBrand, DevGrid) and 404 use inline strings.
     *
     * Phase 5 page-fade transition takes ~350-400ms exit + ~400ms enter.
     * usePageTitle fires on mount — title updates immediately on route
     * change for tab readability (D-17 deferred concern: title is correct
     * for the in-flight new route while the old route is still painting
     * during exit; acceptable per <deferred> «not noticeable in static-
     * content site»).
     *
     * Pure utility — only imports useEffect from react. NO Motion, NO
     * components, NO data, NO content. Sibling-of-useSessionFlag pattern.
     *
     * SSR-safe by `typeof document` guard (project has no SSR; cheap
     * insurance for v2 migration consistency).
     */
    import { useEffect } from 'react';

    export function usePageTitle(title: string): void {
      useEffect(() => {
        if (typeof document === 'undefined') return;
        document.title = title;
      }, [title]);
    }
    ```

    File length: ~35 lines including JSDoc. Named export only. SSR-safe `typeof document` guard.

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero matches)
    - Hex literals: NO `#XXXXXX` patterns (zero matches)
    - Placeholder tokens: NO `{{...}}` patterns. The `{Page}` reference uses single curly braces in JSDoc, NOT `{{...}}`. Verified: zero `\{\{[^}]*\}\}` matches.
    - Inline transition: NO `transition={{` JSX-prop pattern (this is a hook file)
    - Import boundaries: imports ONLY `react`
  </action>
  <verify>
    <automated>test -f src/hooks/usePageTitle.ts && grep -q "export function usePageTitle" src/hooks/usePageTitle.ts && grep -q "document.title = title" src/hooks/usePageTitle.ts && grep -q "import { useEffect } from 'react'" src/hooks/usePageTitle.ts && npx tsc --noEmit && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f src/hooks/usePageTitle.ts` exits 0
    - `grep -c "^export function usePageTitle(title: string): void" src/hooks/usePageTitle.ts` returns 1
    - `grep -c "document.title = title" src/hooks/usePageTitle.ts` returns 1
    - `grep -c "import { useEffect } from 'react'" src/hooks/usePageTitle.ts` returns 1
    - `grep -c "useEffect(" src/hooks/usePageTitle.ts` returns 1
    - `grep -c "\\[title\\]" src/hooks/usePageTitle.ts` returns 1 (dependency array on the useEffect)
    - `grep -E "from ['\"]motion|from ['\"].*components|from ['\"].*data|from ['\"].*content|from ['\"].*pages" src/hooks/usePageTitle.ts` returns nothing
    - `grep -E '\\{\\{[^}]*\\}\\}' src/hooks/usePageTitle.ts` returns nothing (no Mustache-style `{{...}}` placeholders in doc-block)
    - `npx tsc --noEmit` exits 0
  </acceptance_criteria>
  <done>
    - File exists at `src/hooks/usePageTitle.ts`
    - Named-export `usePageTitle` returns `void`, accepts `title: string`
    - Uses `useEffect` with `[title]` dependency array (re-fires when title changes)
    - SSR-safe: `typeof document === 'undefined'` guard
    - Pure utility: only imports `useEffect` from `react`
    - `npx tsc --noEmit` exits 0
  </done>
</task>

</tasks>

<verification>
- `test -f src/hooks/useMatchMedia.ts && test -f src/hooks/usePageTitle.ts` exits 0
- `npx tsc --noEmit` exits 0 (both hooks compile cleanly)
- `npx tsx scripts/check-brand.ts` exits 0 (5/5 checks PASS — Phase 5's noInlineTransition gate verifies these hook files contain no inline `transition={{`; importBoundaries verifies hooks dir has no forbidden cross-imports)
- `npm run build` exits 0 (build-time check still green; lazy-load + mobile-fallback consumers in Wave 2 are not yet present, so no consumer regression possible from Wave 1 alone)
- `wc -l src/hooks/useMatchMedia.ts src/hooks/usePageTitle.ts` returns ≤ 50 lines each
</verification>

<success_criteria>
- [ ] `src/hooks/useMatchMedia.ts` exists with `useSyncExternalStore`-based reactive media-query hook
- [ ] `src/hooks/usePageTitle.ts` exists with `useEffect`-based document.title setter
- [ ] Both hooks are pure utilities (only `react` import; no Motion, no components, no cross-deps)
- [ ] Both files are SSR-safe via `typeof window/document` guards
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
- [ ] Wave 2 consumers (Layout.tsx in 06-04, all 8 page components in 06-07) can import these hooks
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-01-hooks-foundation-SUMMARY.md` documenting:
- Verbatim final form of both hooks (~75 lines combined)
- Pattern alignment with useSessionFlag.ts (one-file-one-hook, leaf-only, SSR-safe guards)
- Note that Wave 2 plan 06-04 (Layout.tsx mobile short-circuit) imports useMatchMedia
- Note that Wave 2 plan 06-07 (page-title wiring) imports usePageTitle into all 8 page components
- Confirmation that the `useSyncExternalStore` choice over `useEffect+useState` is locked (D-02 + RESEARCH §"Pattern 1" rationale: handles concurrent rendering, hydration-mismatch-safe even without SSR today, future-proof for v2 BrowserRouter migration)
</output>
