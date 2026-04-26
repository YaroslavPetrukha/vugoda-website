---
phase: 06-performance-mobile-fallback-deploy
plan: 07
type: execute
wave: 2
depends_on: [06-01-hooks-foundation]
files_modified:
  - src/content/home.ts
  - src/content/projects.ts
  - src/content/zhk-etno-dim.ts
  - src/content/construction.ts
  - src/content/contact.ts
  - src/pages/HomePage.tsx
  - src/pages/ProjectsPage.tsx
  - src/pages/ZhkPage.tsx
  - src/pages/ConstructionLogPage.tsx
  - src/pages/ContactPage.tsx
  - src/pages/DevBrandPage.tsx
  - src/pages/DevGridPage.tsx
  - src/pages/NotFoundPage.tsx
autonomous: true
requirements: [QA-03]
must_haves:
  truths:
    - "Each of the 5 production page content modules (home, projects, zhk-etno-dim, construction, contact) exports a `pageTitle` named string export per Phase 2 D-15 scannability rule (D-19)"
    - "Each of the 8 page components calls usePageTitle(...) at the top of its render with the locked title string per D-18: production pages import pageTitle from their content module; dev/404 pages use inline string literals"
    - "All 9 title strings are exactly verbatim per D-18: `«ВИГОДА — Системний девелопмент»` for /, `«Проєкти — ВИГОДА»`, `«ЖК Етно Дім — ВИГОДА»` (uses project.title interpolation; for /zhk/etno-dim resolves to «ЖК Етно Дім — ВИГОДА»), `«Хід будівництва Lakeview — ВИГОДА»`, `«Контакт — ВИГОДА»`, `«Brand QA — ВИГОДА»`, `«Grid QA — ВИГОДА»`, `«404 — ВИГОДА»`"
    - "Title em-dash is U+2014 (not hyphen-minus U+002D); brand «ВИГОДА» is the ONLY proper-noun on every title; root keeps its verbatim no-prefix form"
    - "Browser tab updates immediately on route navigation (useEffect fires on mount); the 350-400ms Phase 5 page-fade transition still happens but the title-update is independent (D-17 deferred concern: tab is correct for the in-flight new route while old route is still painting during exit — acceptable per CONTEXT <deferred>)"
  artifacts:
    - path: src/content/home.ts
      provides: "pageTitle export = «ВИГОДА — Системний девелопмент» (D-18 root no-prefix form)"
      contains: "pageTitle"
    - path: src/content/projects.ts
      provides: "pageTitle export = «Проєкти — ВИГОДА»"
      contains: "pageTitle"
    - path: src/content/zhk-etno-dim.ts
      provides: "pageTitle export = «ЖК Етно Дім — ВИГОДА» (matches project.title for the etno-dim slug)"
      contains: "pageTitle"
    - path: src/content/construction.ts
      provides: "pageTitle export = «Хід будівництва Lakeview — ВИГОДА»"
      contains: "pageTitle"
    - path: src/content/contact.ts
      provides: "pageTitle export = «Контакт — ВИГОДА»"
      contains: "pageTitle"
  key_links:
    - from: "8 page components in src/pages/"
      to: "src/hooks/usePageTitle.ts"
      via: "usePageTitle(...) call in render"
      pattern: "usePageTitle\\("
    - from: "5 production page components"
      to: "their content/<page>.ts module pageTitle export"
      via: "named import"
      pattern: "import.*pageTitle.*from"
---

<objective>
Wire the QA-03 per-route document.title across all 8 routes per CONTEXT D-17..D-19.

**Decision split (D-19 per Phase 2 D-15 scannability rule):**
- **Production pages** (5) — title constants live in their content module: `src/content/home.ts`, `src/content/projects.ts`, `src/content/zhk-etno-dim.ts`, `src/content/construction.ts`, `src/content/contact.ts`. Each gains a single `pageTitle` named-export string.
- **Dev surfaces + 404** (3) — title constants are INLINE in their page components (no content module to extract to; QA tooling, not editorial copy).

**Locked title strings (D-18 verbatim — em-dash U+2014):**

| Route | Title |
|-------|-------|
| `/` | `ВИГОДА — Системний девелопмент` (no `«{Page} —» ВИГОДА` prefix; matches og:title and root brand impression) |
| `/projects` | `Проєкти — ВИГОДА` |
| `/zhk/etno-dim` | `ЖК Етно Дім — ВИГОДА` (uses project.title; for the etno-dim slug this resolves to «ЖК Етно Дім»; the page component constructs `${project.title} — ВИГОДА`) |
| `/zhk/lakeview` (redirect intermediate) | (no title change — `<Navigate>` happens before paint per D-18) |
| `/zhk/maietok-vynnykivskyi` etc | (redirects don't change title per D-18) |
| `/construction-log` | `Хід будівництва Lakeview — ВИГОДА` |
| `/contact` | `Контакт — ВИГОДА` |
| `/dev/brand` | `Brand QA — ВИГОДА` (English to signal dev surface, D-18) |
| `/dev/grid` | `Grid QA — ВИГОДА` |
| 404 | `404 — ВИГОДА` |

**Edits per file (13 files total):**

5 content modules each get ONE `export const pageTitle = '...';` line + JSDoc one-liner (~3 lines each).

8 page components each get:
- `import { usePageTitle } from '../hooks/usePageTitle';` at top (5-char relative path adjustment from each component's location: `pages/HomePage.tsx` → `../hooks/usePageTitle`)
- For production pages: `import { pageTitle } from '../content/{name}';` + `usePageTitle(pageTitle);` at top of component body
- For ZhkPage: `usePageTitle(\`${project.title} — ВИГОДА\`);` (interpolation; only fires after `findBySlug` returns a project; for redirect-intermediate slugs the call short-circuits)
- For dev/404 pages: `usePageTitle('Brand QA — ВИГОДА');` (inline literal)

Output: 5 content files modified (~3 lines added each); 8 page files modified (1-2 lines each). Net: 13 files, ~25-30 lines total.

Note: this plan can be parallelized as multiple sub-tasks per page (each content + page pair is independent), but for scope sanity all 13 edits are grouped in this single plan since each is a 1-2-line edit and they share the same pattern.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@src/hooks/usePageTitle.ts
@src/content/home.ts
@src/content/projects.ts
@src/content/zhk-etno-dim.ts
@src/content/construction.ts
@src/content/contact.ts
@src/pages/HomePage.tsx
@src/pages/ProjectsPage.tsx
@src/pages/ZhkPage.tsx
@src/pages/ConstructionLogPage.tsx
@src/pages/ContactPage.tsx
@src/pages/DevBrandPage.tsx
@src/pages/DevGridPage.tsx
@src/pages/NotFoundPage.tsx
</context>

<interfaces>
<!-- src/hooks/usePageTitle.ts (Wave 1 plan 06-01) -->

```ts
import { useEffect } from 'react';

export function usePageTitle(title: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
  }, [title]);
}
```

<!-- Existing src/content/home.ts (head) — pattern reference -->

```ts
/**
 * @module content/home
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *   ...
 */

export const heroSlogan = '...';
export const heroCta = 'Переглянути проекти';
// ... more named exports
```

Phase 6 adds ONE new `pageTitle` export per file. Pattern: a one-line JSDoc `/** Browser-tab title for /. Phase 6 D-18: root keeps verbatim no-prefix form. */` immediately above the export.

<!-- Existing src/pages/HomePage.tsx -->

```tsx
import { Hero } from '../components/sections/home/Hero';
// ... 6 more section imports

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandEssence />
      // ...
    </>
  );
}
```

Phase 6 adds: `import { usePageTitle } from '../hooks/usePageTitle';` + `import { pageTitle } from '../content/home';` + `usePageTitle(pageTitle);` at the top of the function body, before the `return`.

<!-- src/data/projects.ts findBySlug pattern (Phase 2) -->

ZhkPage.tsx uses `findBySlug(slug)` from `src/data/projects.ts` to resolve the project. The function returns `Project | undefined`. The component already handles the undefined case (redirects via <Navigate> for non-full-internal slugs). For the etno-dim slug, `findBySlug('etno-dim')` returns a Project where `title === 'ЖК Етно Дім'`.

For Phase 6, the ZhkPage usePageTitle call uses interpolation: ``usePageTitle(`${project.title} — ВИГОДА`)``. This is called AFTER the project is resolved (so `project.title` is defined). For the redirect intermediate frames, the page component's existing logic short-circuits to `<Navigate>` before usePageTitle would meaningfully fire.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Add pageTitle exports to 5 content modules (D-19)</name>
  <read_first>
    - src/content/home.ts (full file — confirm top JSDoc style + existing export list)
    - src/content/projects.ts
    - src/content/zhk-etno-dim.ts
    - src/content/construction.ts (NOTE: this is a DATA module, not just content — it exports `constructionLog` per Plan 02-03. The pageTitle export goes here per D-19 because /construction-log content semantically lives with the construction data; alternative is a new src/content/construction-log.ts but per Phase 2 D-15 scannability rule, ONE module per page. Read the existing file shape.)
    - src/content/contact.ts
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-18 (locked title strings)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-19 (production page titles in content/, dev surfaces inline)
  </read_first>
  <files>src/content/home.ts, src/content/projects.ts, src/content/zhk-etno-dim.ts, src/content/construction.ts, src/content/contact.ts</files>
  <action>
    For each of the 5 content modules, add ONE new named-export `pageTitle` near the bottom of the file (or grouped with other page-chrome exports if a logical group exists — read the file first). Each export gets a one-line JSDoc.

    **A. `src/content/home.ts`** — append at end of file:
    ```ts
    /** Browser-tab title for `/` route. Phase 6 D-18: root keeps verbatim
     *  no-`«{Page} —» ВИГОДА` prefix form (matches og:title at root). */
    export const pageTitle = 'ВИГОДА — Системний девелопмент';
    ```

    **B. `src/content/projects.ts`** — append at end of file:
    ```ts
    /** Browser-tab title for `/projects` route. Phase 6 D-18 format
     *  «{Page} — ВИГОДА». */
    export const pageTitle = 'Проєкти — ВИГОДА';
    ```

    **C. `src/content/zhk-etno-dim.ts`** — append at end of file. Note: `pageTitle` for /zhk/etno-dim is literally «ЖК Етно Дім — ВИГОДА» — but the actual page component uses `${project.title} — ВИГОДА` template literal (interpolating from `findBySlug('etno-dim').title === 'ЖК Етно Дім'`). For consistency with D-19's «production page titles in content/», this content module exports the FULL string for the etno-dim slug specifically. The ZhkPage component imports it as a fallback OR uses the dynamic template — Task 4 below picks the cleaner pattern.
    ```ts
    /** Browser-tab title for `/zhk/etno-dim` route. Phase 6 D-18 format
     *  «{Page} — ВИГОДА». For dynamically-resolved slugs other than etno-dim,
     *  ZhkPage uses interpolation `${project.title} — ВИГОДА`; for the
     *  hard-coded etno-dim path the value is locked here for traceability. */
    export const pageTitle = 'ЖК Етно Дім — ВИГОДА';
    ```

    **D. `src/content/construction.ts`** — append a new export. If this file is a DATA module (constructionLog export from Phase 2 plan 02-03), add the page-title export AFTER the data exports (data-then-content order is fine; the boundary rule allows pageTitle in data modules — read the existing file's IMPORT BOUNDARY block to confirm). If the file's boundary doc-block prohibits non-data exports, ADD the pageTitle to a NEW `src/content/construction-log.ts` module instead, with proper IMPORT BOUNDARY doc-block.
    ```ts
    /** Browser-tab title for `/construction-log` route. Phase 6 D-18 format
     *  «{Page} — ВИГОДА» — page label includes «Lakeview» since the timeline
     *  is Lakeview-specific in v1 (other ЖК construction logs = v2 FEAT2-01). */
    export const pageTitle = 'Хід будівництва Lakeview — ВИГОДА';
    ```

    **E. `src/content/contact.ts`** — append at end of file:
    ```ts
    /** Browser-tab title for `/contact` route. Phase 6 D-18 format
     *  «{Page} — ВИГОДА». */
    export const pageTitle = 'Контакт — ВИГОДА';
    ```

    Doc-block self-screen for ALL 5 edits:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero matches in any of the 5 added strings)
    - Hex literals: NO `#XXXXXX` (zero — strings are all UA copy)
    - Placeholder tokens: NO `{{...}}` (verified — values use literal Cyrillic with em-dash, no template tokens)
    - Inline transition: NO JSX (.ts content files)
    - Import boundaries: each export adds ZERO new imports — content files stay zero-import leaf modules

    Em-dash verification: the character `—` between «{Page}» and «ВИГОДА» MUST be U+2014 EM DASH (not U+002D HYPHEN-MINUS, not U+2013 EN DASH). When typing the string, use the existing apostrophe/em-dash conventions of the project (the Phase 2 D-23 typographic-apostrophe pattern). Verify with: `grep -P '\\xE2\\x80\\x94' src/content/home.ts` exits 0 (em-dash present in UTF-8 byte form).

    NB: if `src/content/construction.ts` does NOT exist (i.e., the data file is `src/data/construction.ts`), then the page-title export goes into a NEW file `src/content/construction-log.ts` with proper IMPORT BOUNDARY doc-block. Read the actual file location first; the file_modified array above lists `src/content/construction.ts` based on a typical convention but is subject to verification.
  </action>
  <verify>
    <automated>grep -q "^export const pageTitle = 'ВИГОДА — Системний девелопмент'" src/content/home.ts && grep -q "^export const pageTitle = 'Проєкти — ВИГОДА'" src/content/projects.ts && grep -q "^export const pageTitle = 'ЖК Етно Дім — ВИГОДА'" src/content/zhk-etno-dim.ts && (grep -q "^export const pageTitle = 'Хід будівництва Lakeview — ВИГОДА'" src/content/construction.ts || grep -q "^export const pageTitle = 'Хід будівництва Lakeview — ВИГОДА'" src/content/construction-log.ts) && grep -q "^export const pageTitle = 'Контакт — ВИГОДА'" src/content/contact.ts && npx tsc --noEmit && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "^export const pageTitle = 'ВИГОДА — Системний девелопмент'" src/content/home.ts` returns 1
    - `grep -c "^export const pageTitle = 'Проєкти — ВИГОДА'" src/content/projects.ts` returns 1
    - `grep -c "^export const pageTitle = 'ЖК Етно Дім — ВИГОДА'" src/content/zhk-etno-dim.ts` returns 1
    - Either `grep -c "^export const pageTitle = 'Хід будівництва Lakeview — ВИГОДА'" src/content/construction.ts` returns 1 OR (if a new module was needed) `grep -c "^export const pageTitle" src/content/construction-log.ts` returns 1 with the same value
    - `grep -c "^export const pageTitle = 'Контакт — ВИГОДА'" src/content/contact.ts` returns 1
    - All 5 files still pass `importBoundaries()` content-rule check (zero forbidden imports added)
    - Em-dash `—` (U+2014) used between page name and brand in all 5 strings; verified with `grep -P '\\xE2\\x80\\x94' src/content/{home,projects,zhk-etno-dim,construction,contact}.ts` returning at least 1 match per file
    - `npx tsc --noEmit` exits 0
  </acceptance_criteria>
  <done>
    - 5 content modules each ship a `pageTitle` named export with the locked D-18 string
    - Em-dashes verified as U+2014
    - Content modules remain leaf (zero new imports)
    - `npx tsc --noEmit` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Wire usePageTitle into 5 production page components (HomePage, ProjectsPage, ZhkPage, ConstructionLogPage, ContactPage)</name>
  <read_first>
    - src/pages/HomePage.tsx (current shape — confirms how to wire usePageTitle)
    - src/pages/ProjectsPage.tsx
    - src/pages/ZhkPage.tsx (especially the findBySlug → project resolution path)
    - src/pages/ConstructionLogPage.tsx
    - src/pages/ContactPage.tsx
    - src/hooks/usePageTitle.ts (Wave 1 plan 06-01 — confirm import path + signature)
    - src/data/projects.ts (Phase 2 — confirms Project.title field for the etno-dim project)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-17 (hook usage)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-18 (locked titles)
  </read_first>
  <files>src/pages/HomePage.tsx, src/pages/ProjectsPage.tsx, src/pages/ZhkPage.tsx, src/pages/ConstructionLogPage.tsx, src/pages/ContactPage.tsx</files>
  <action>
    Edit each page component. Pattern: add ONE import for usePageTitle at top, add ONE import for `pageTitle` from the page's content module, call `usePageTitle(pageTitle);` at the top of the function body.

    **A. `src/pages/HomePage.tsx`** — Add at top imports:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    import { pageTitle } from '../content/home';
    ```
    Add at the top of the `HomePage()` function body, BEFORE the `return`:
    ```tsx
      usePageTitle(pageTitle);
    ```

    **B. `src/pages/ProjectsPage.tsx`** — Same pattern:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    import { pageTitle } from '../content/projects';
    // ...
      usePageTitle(pageTitle);
    ```

    **C. `src/pages/ZhkPage.tsx`** — Read the existing file. The component uses `findBySlug(slug)` → `project | undefined`. Import the etno-dim-specific pageTitle:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    import { pageTitle as etnoDimTitle } from '../content/zhk-etno-dim';
    ```
    Wire the call in the part of the component AFTER `project` is resolved. The cleanest pattern depends on the existing component shape. Two options:

    **Option I — interpolate from project.title (preferred for ZHK-02 scale-to-N):**
    ```tsx
    // After: const project = findBySlug(slug); ...redirect logic...
    usePageTitle(project ? `${project.title} — ВИГОДА` : 'ЖК — ВИГОДА');
    ```
    This produces «ЖК Етно Дім — ВИГОДА» for the etno-dim slug (because project.title === 'ЖК Етно Дім' per Phase 2). For other valid full-internal slugs added in v2 (FEAT2-05 etc.), it produces the right title automatically. The fallback string «ЖК — ВИГОДА» is for the brief redirect-intermediate frame before <Navigate> fires.

    **Option II — use the static literal from content/zhk-etno-dim.ts:**
    ```tsx
    usePageTitle(etnoDimTitle);
    ```
    This is locked to «ЖК Етно Дім — ВИГОДА» for ALL slugs. Simpler but won't auto-extend to v2 ЖК pages.

    Recommended: **Option I** (interpolation). The static `etnoDimTitle` import is still useful as documentation; the component does not need to import it. Drop the import line if Option I is chosen.

    Final ZhkPage edit (Option I):
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    // ... existing imports
    
    export default function ZhkPage() {
      const { slug } = useParams();
      const project = slug ? findBySlug(slug) : undefined;
      
      // Phase 6 D-18: «{project.title} — ВИГОДА». Fallback for redirect-
      // intermediate frames where project is undefined (Navigate fires
      // before paint per existing redirect logic).
      usePageTitle(project ? `${project.title} — ВИГОДА` : 'ЖК — ВИГОДА');
      
      // ... existing redirect + render logic
    }
    ```

    **D. `src/pages/ConstructionLogPage.tsx`** — Same pattern:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    import { pageTitle } from '../content/construction'; // or '../content/construction-log' if Task 1 created a new module
    // ...
      usePageTitle(pageTitle);
    ```

    **E. `src/pages/ContactPage.tsx`** — Same pattern:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    import { pageTitle } from '../content/contact';
    // ...
      usePageTitle(pageTitle);
    ```

    **NOTE: ConstructionLogPage is a lazy-loaded route per plan 06-05.** This is fine — the lazy chunk includes the usePageTitle hook + the pageTitle import from content/construction. When the lazy chunk loads, the hook fires and updates the title. Title-update timing for lazy routes:
    1. User clicks `/#/construction-log`
    2. MarkSpinner renders during chunk load (~200ms-2s on slow networks)
    3. **Tab title during MarkSpinner**: still shows the previous route's title — acceptable; documented in CONTEXT <deferred>
    4. Chunk resolves → ConstructionLogPage mounts → usePageTitle fires → tab shows «Хід будівництва Lakeview — ВИГОДА»

    This is consistent with D-17's deferred concern about title-vs-transition timing.

    Doc-block self-screen for all 5 page edits:
    - Forbidden lexicon: NO Pictorial/Rubikon (zero in additions)
    - Hex literals: NO `#XXXXXX` (zero — pure imports + hook calls)
    - Placeholder tokens: NO `{{...}}` (verified — JSX template literals use single-brace `${project.title}` which is JS template-string syntax, not Mustache `{{...}}`)
    - Inline transition: NO `transition={{` (no Motion props introduced)
    - Import boundaries: hooks/ imports allowed in pages/; content/ imports allowed in pages/
  </action>
  <verify>
    <automated>grep -q "import { usePageTitle } from '../hooks/usePageTitle'" src/pages/HomePage.tsx && grep -q "import { pageTitle } from '../content/home'" src/pages/HomePage.tsx && grep -q "usePageTitle(pageTitle)" src/pages/HomePage.tsx && grep -q "import { usePageTitle }" src/pages/ProjectsPage.tsx && grep -q "import { pageTitle } from '../content/projects'" src/pages/ProjectsPage.tsx && grep -q "import { usePageTitle }" src/pages/ZhkPage.tsx && grep -q "usePageTitle(" src/pages/ZhkPage.tsx && grep -q "import { usePageTitle }" src/pages/ConstructionLogPage.tsx && grep -q "import { pageTitle }" src/pages/ConstructionLogPage.tsx && grep -q "import { usePageTitle }" src/pages/ContactPage.tsx && grep -q "import { pageTitle } from '../content/contact'" src/pages/ContactPage.tsx && npx tsc --noEmit && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - HomePage.tsx: imports usePageTitle + pageTitle from content/home; calls `usePageTitle(pageTitle)` in body
    - ProjectsPage.tsx: imports usePageTitle + pageTitle from content/projects; calls `usePageTitle(pageTitle)`
    - ZhkPage.tsx: imports usePageTitle; calls usePageTitle with interpolated `${project.title} — ВИГОДА` (or static etnoDimTitle if Option II chosen)
    - ConstructionLogPage.tsx: imports usePageTitle + pageTitle; calls `usePageTitle(pageTitle)`
    - ContactPage.tsx: imports usePageTitle + pageTitle from content/contact; calls `usePageTitle(pageTitle)`
    - All 5 page files preserve existing imports, JSX, redirect logic — no other behavior changes
    - `grep -cE "^import \\{ usePageTitle" src/pages/HomePage.tsx src/pages/ProjectsPage.tsx src/pages/ZhkPage.tsx src/pages/ConstructionLogPage.tsx src/pages/ContactPage.tsx | awk -F: '{sum+=$2} END {print sum}'` returns 5 (one import per page)
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
  </acceptance_criteria>
  <done>
    - 5 production page components call usePageTitle with the locked D-18 title
    - ZhkPage uses interpolation from project.title (scales to v2 ЖК pages without code changes)
    - All 5 pages preserve existing functionality (imports, JSX, redirect logic, etc.)
    - `npx tsc --noEmit` and `npm run build` both exit 0 with 5/5 brand checks PASS
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Wire usePageTitle into 3 dev/404 page components with INLINE titles (DevBrandPage, DevGridPage, NotFoundPage)</name>
  <read_first>
    - src/pages/DevBrandPage.tsx (current shape)
    - src/pages/DevGridPage.tsx
    - src/pages/NotFoundPage.tsx
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-18 (locked dev/404 titles)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-19 (dev surfaces use inline strings, no content module)
  </read_first>
  <files>src/pages/DevBrandPage.tsx, src/pages/DevGridPage.tsx, src/pages/NotFoundPage.tsx</files>
  <action>
    Edit each of the 3 page components. Pattern: add ONE import for usePageTitle, call it with an INLINE locked literal (per D-19 — dev/404 surfaces don't get content modules).

    **A. `src/pages/DevBrandPage.tsx`**:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    // ...
    export default function DevBrandPage() {
      usePageTitle('Brand QA — ВИГОДА');
      // ... existing render
    }
    ```

    **B. `src/pages/DevGridPage.tsx`**:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    // ...
      usePageTitle('Grid QA — ВИГОДА');
    ```

    **C. `src/pages/NotFoundPage.tsx`**:
    ```tsx
    import { usePageTitle } from '../hooks/usePageTitle';
    // ...
      usePageTitle('404 — ВИГОДА');
    ```

    NOTE: DevBrandPage and DevGridPage are lazy-loaded per plan 06-05. The lazy chunk includes the inline title; same timing as ConstructionLogPage. NotFoundPage is eager.

    Em-dash verification on all 3 inline strings: must be U+2014 (`—`).

    Doc-block self-screen:
    - Forbidden lexicon: NO Pictorial/Rubikon
    - Hex literals: NO `#XXXXXX`
    - Placeholder tokens: NO `{{...}}` (verified — pure literals, no JSX template syntax)
    - Inline transition: NO `transition={{` (no Motion props)
    - Import boundaries: hooks/ allowed in pages/
  </action>
  <verify>
    <automated>grep -q "import { usePageTitle } from '../hooks/usePageTitle'" src/pages/DevBrandPage.tsx && grep -q "usePageTitle('Brand QA — ВИГОДА')" src/pages/DevBrandPage.tsx && grep -q "import { usePageTitle } from '../hooks/usePageTitle'" src/pages/DevGridPage.tsx && grep -q "usePageTitle('Grid QA — ВИГОДА')" src/pages/DevGridPage.tsx && grep -q "import { usePageTitle } from '../hooks/usePageTitle'" src/pages/NotFoundPage.tsx && grep -q "usePageTitle('404 — ВИГОДА')" src/pages/NotFoundPage.tsx && npx tsc --noEmit && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - DevBrandPage.tsx: imports usePageTitle, calls `usePageTitle('Brand QA — ВИГОДА')`
    - DevGridPage.tsx: imports usePageTitle, calls `usePageTitle('Grid QA — ВИГОДА')`
    - NotFoundPage.tsx: imports usePageTitle, calls `usePageTitle('404 — ВИГОДА')`
    - All 3 page files preserve existing functionality
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
  </acceptance_criteria>
  <done>
    - 3 dev/404 page components call usePageTitle with inline locked D-18 strings (no content-module extraction per D-19)
    - All 3 pages preserve existing functionality
    - Build green
  </done>
</task>

</tasks>

<verification>
- All 5 content modules export `pageTitle`
- All 8 page components call `usePageTitle(...)` exactly once
- Em-dashes are U+2014 in all 9 title strings (5 production from content/ + 3 dev/404 inline + 1 ZhkPage interpolated form)
- `npx tsc --noEmit` exits 0
- `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
- Manual smoke (browser, ~1 min): navigate through all 5 production routes — browser tab title updates to the locked D-18 strings on each route. Visit `/#/dev/brand` → tab shows «Brand QA — ВИГОДА». Visit nonexistent `/#/asdf` → tab shows «404 — ВИГОДА».
- Phase 5 page-fade transition works as before (title-update is independent of the fade timing per D-17 deferred-concern documentation)
</verification>

<success_criteria>
- [ ] 5 content modules each ship a `pageTitle` named-export with the locked D-18 string (em-dash U+2014)
- [ ] 5 production pages import + call `usePageTitle(pageTitle)` (or interpolated for ZhkPage)
- [ ] 3 dev/404 pages call `usePageTitle('...')` with inline literals
- [ ] All 9 titles match D-18 verbatim
- [ ] No regression: `npx tsc --noEmit` green, `npm run build` green with 5/5 brand checks
- [ ] Manual smoke: browser tab updates on every route navigation (including lazy routes — title fires after Suspense fallback resolves)
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-07-page-titles-SUMMARY.md` documenting:
- 5 content-module diffs (one-line addition each)
- 8 page-component diffs (2-line addition each: import + hook call)
- ZhkPage interpolation pattern (project.title-driven; scales to v2 ЖК pages)
- Title timing on lazy routes (D-17 deferred concern documented)
- Manual smoke results: tab title updates verified at all 8 routes
- Note that the title-update happens IMMEDIATELY on mount; the Phase 5 page-fade still proceeds in parallel — for 350ms during exit, the previous route's content is still painting BUT the tab already shows the new title (D-17 deferred: «not noticeable in static-content site»)
</output>
