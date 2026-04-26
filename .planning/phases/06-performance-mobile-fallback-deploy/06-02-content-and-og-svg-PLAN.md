---
phase: 06-performance-mobile-fallback-deploy
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/mobile-fallback.ts
  - brand-assets/og/og.svg
autonomous: true
requirements: [QA-01, QA-03]
must_haves:
  truths:
    - "src/content/mobile-fallback.ts exports the locked copy strings the MobileFallback component will render: heading «ВИГОДА» wordmark, body «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам», email link «vygoda.sales@gmail.com», 4 CTA labels («Проєкти →», «Хід будівництва →», «Контакт →», «Перейти до Lakeview ↗»)"
    - "src/content/mobile-fallback.ts is a pure leaf content module — no React, no Motion, no components, no hooks (Phase 2 D-15 / D-32 boundary holds)"
    - "brand-assets/og/og.svg is a hand-authored 1200×630 SVG with a pre-pathed Cyrillic «ВИГОДА» wordmark (Montserrat 700 letterforms converted to <path>) — Linux GH runner sharp render does NOT need Cyrillic Montserrat installed"
    - "brand-assets/og/og.svg uses ONLY the 6 canonical brandbook hexes (#2F3640, #C1F33D, #F5F7FA, #A7AFBC, #3D3B43, #020A0A) — paletteWhitelist gate is unaffected because .svg files are out of paletteWhitelist scope, but visual brand compliance is enforced manually here"
  artifacts:
    - path: src/content/mobile-fallback.ts
      provides: "Locked microcopy for the QA-01 mobile fallback page (D-04 ASCII-art layout literal)"
      contains: "vygoda.sales@gmail.com"
    - path: brand-assets/og/og.svg
      provides: "Source SVG for QA-03 OG image PNG export — composed of #2F3640 background + IsometricGridBG @ 0.15 + pre-pathed «ВИГОДА» wordmark + 'Системний девелопмент' sub-line + single isometric cube accent in #C1F33D @ 0.4 (D-27)"
      contains: "viewBox=\"0 0 1200 630\""
  key_links:
    - from: "src/content/mobile-fallback.ts"
      to: "src/components/layout/MobileFallback.tsx (created in plan 06-04)"
      via: "named imports of body/email/cta strings"
      pattern: "from '../../content/mobile-fallback'"
    - from: "brand-assets/og/og.svg"
      to: "scripts/build-og-image.mjs (created in plan 06-06)"
      via: "sharp(svgBuffer).resize(1200, 630).png().toFile('public/og-image.png')"
      pattern: "brand-assets/og/og.svg"
---

<objective>
Ship two static asset files in parallel with the hooks (Wave 1). Both are downstream dependencies for Wave 2 consumers but neither has any code dependency itself — they can be authored before any other Phase 6 work begins.

**File 1 — `src/content/mobile-fallback.ts`** (D-04 + Phase 2 D-15 scannability rule):
Locked microcopy for the `<MobileFallback>` component (built in plan 06-04). Single source of truth for the «Сайт оптимізовано для екранів ≥1280px» body, the mailto, and the 4 CTA labels — so the consumer component is purely structural and the copy is auditable in isolation. Pattern matches existing leaf content modules (`src/content/contact.ts`, `src/content/projects.ts`).

**File 2 — `brand-assets/og/og.svg`** (D-27 + RESEARCH §"Pitfall 3" + §"Risk 2"):
Hand-authored 1200×630 SVG composed of:
- `<rect>` `#2F3640` background
- `<g opacity="0.15">` containing the IsometricGridBG cube-tile pattern (inline-copied from `brand-assets/patterns/isometric-grid.svg` per Phase 3 D-09 inline-SVG pattern)
- `<g>` containing the «ВИГОДА» wordmark as **pre-pathed `<path>` elements** (Montserrat 700 letterforms converted to bezier paths — this is mandatory per RESEARCH.md Pitfall 3 because sharp's SVG→PNG render on Ubuntu GH runner has no Cyrillic Montserrat font available; pre-pathing eliminates the font dependency entirely)
- `<text>` sub-line «Системний девелопмент» with `font-family="Montserrat, sans-serif"` Montserrat 500 32px — the sub-line falls back to DejaVu Sans on Linux runner; visually acceptable per D-30 carve-out (small 32px sub-line, not the brand-critical wordmark)
- `<g>` single `<IsometricCube variant='single'>` accent at top-right, opacity 0.4, stroke `#C1F33D` 1.5pt (3 polygon paths inline-copied from a Phase 3 cube primitive)

Composition follows D-27 verbatim layout sketch. All hex colors ⊆ 6 canonical brandbook palette. NO gradient, NO photo background, NO multi-color, NO bouncy spring, NO marketing tagline duplicate (brand-system §6 hard-rules respected).

**Why pre-pathing is non-negotiable** (RESEARCH Pitfall 3 + Risk 2): Sharp delegates SVG raster to librsvg, which uses fontconfig. The Ubuntu GitHub runner ships fontconfig with NO Montserrat. macOS local fontconfig may have it (user-installed). Without pre-pathing, the local author's `og-image.png` is correct, but every CI build silently regenerates it with DejaVu Sans for the Cyrillic wordmark, shipping an off-brand PNG to production unfurls. Pre-pathing the wordmark makes the SVG render deterministic across platforms.

Output: 2 new files. No edits. Both are author-time deliverables — no runtime, no build pipeline, no test framework required at this stage.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@brand-system.md
@src/content/contact.ts
@brand-assets/patterns/isometric-grid.svg
@brand-assets/logo/dark.svg
</context>

<interfaces>
<!-- Existing leaf content module shape (verbatim from src/content/contact.ts head): -->

```ts
/**
 * @module content/contact
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/. Must NEVER import React,
 *   motion, components, hooks, or pages.
 *
 *   Source of truth for /contact page chrome (D-36):
 *     - contactPageHeading: H1 «Контакт»
 *     - ...
 */

/** Page H1 — matches Nav label. */
export const contactPageHeading = 'Контакт';
```

Pattern conventions:
- Top JSDoc with `@module content/{name}` + `@rule IMPORT BOUNDARY` clause
- Named exports only (no default; no const-bundle)
- Each export has its own JSDoc one-liner
- Zero imports — leaf module
- importBoundaries() in scripts/check-brand.ts ENFORCES: content/ must NOT import react/motion/components/hooks/pages

<!-- Existing inline-SVG pattern reference for og.svg cube path (Phase 3 D-09): -->

`brand-assets/logo/dark.svg` and `brand-assets/patterns/isometric-grid.svg` are inline SVGs the project already uses. The og.svg author can:
1. Open `brand-assets/patterns/isometric-grid.svg` in a vector editor (Inkscape recommended for cross-platform Cyrillic-pre-pathing capability)
2. Copy the cube-tile `<path>` set into a `<g opacity="0.15">` group
3. Add a Montserrat-700 «ВИГОДА» text node, then use **Object → Path** (Inkscape menu) or equivalent FontForge headless export to convert text → path
4. Add the sub-line as a regular `<text>` node (no path conversion needed for the sans-serif fallback)
5. Add the accent cube as 3 `<polygon>` or `<path>` nodes copied from any IsometricCube reference
6. Save as `brand-assets/og/og.svg`

The exact bezier coordinates of the pre-pathed «ВИГОДА» wordmark are NOT specified by this plan — they are the output of running the wordmark text through Object → Path. Verification is by visual inspection at impl time + the `<text>` element absence check in acceptance criteria below.

<!-- D-27 layout sketch (CONTEXT.md verbatim): -->

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#2F3640" />
  <!-- IsometricGridBG paths, copy from brand-assets/patterns/isometric-grid.svg, scaled, opacity 0.15 -->
  <g opacity="0.15">
    <!-- ... cube tile pattern ... -->
  </g>
  <!-- Wordmark — pre-pathed Montserrat 700 «ВИГОДА» -->
  <g transform="translate(220, 240)">
    <!-- 6 letter <path> elements for В И Г О Д А (NOT <text>) -->
  </g>
  <!-- Sub-line (acceptable as <text> per D-30 carve-out) -->
  <text x="600" y="430" text-anchor="middle" fill="#A7AFBC"
        font-family="Montserrat, sans-serif" font-weight="500" font-size="32">
    Системний девелопмент
  </text>
  <!-- Single isometric cube accent, top-right -->
  <g transform="translate(1050, 90)" stroke="#C1F33D" stroke-width="1.5" fill="none" opacity="0.4">
    <!-- 3 polygon paths from IsometricCube variant='single' -->
  </g>
</svg>
```
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/content/mobile-fallback.ts (D-04 locked copy)</name>
  <read_first>
    - src/content/contact.ts (existing leaf-content-module pattern reference — JSDoc style + IMPORT BOUNDARY rule)
    - src/content/projects.ts (additional leaf-content reference for export style)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-04 (locked copy + ASCII-art layout)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-06 (4 CTA hrefs: 3 internal /#/projects, /#/construction-log, /#/contact + 1 external Lakeview)
  </read_first>
  <files>src/content/mobile-fallback.ts</files>
  <action>
    Create new file `src/content/mobile-fallback.ts` with this EXACT content:

    ```ts
    /**
     * @module content/mobile-fallback
     * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
     *   from src/pages/ and src/components/sections/ and src/components/layout/.
     *   Must NEVER import React, motion, components, hooks, or pages.
     *
     *   Source of truth for the QA-01 mobile-fallback page rendered when
     *   useMatchMedia('(max-width: 1023px)') returns true (Phase 6 D-04).
     *
     *   Layout (D-04 verbatim):
     *     - Logo (dark.svg, ~120px wide, 32px top margin)
     *     - Wordmark «ВИГОДА» (Montserrat 700 ~48px) — rendered as TEXT in
     *       the React component, NOT pre-pathed (pre-pathing only matters
     *       for sharp SVG→PNG export; in-browser DOM has @fontsource/montserrat
     *       cyrillic-700.css loaded so live render is fine)
     *     - Body text (max-w-[20ch], text-text-muted #A7AFBC, ≥14pt for
     *       WCAG AA contrast on #2F3640 bg per Phase 1 D-21)
     *     - Mailto link (accent-fill #C1F33D — never on light bg, dark bg here)
     *     - 40%-width divider (#A7AFBC opacity 0.2)
     *     - 4 CTA links stacked, text-only, focus-visible accent underline
     *     - Footer juridical block (one column, no 3-col Footer treatment)
     *
     *   Tone (CONCEPT §2): стримано, без хвастощів. No marketing claims.
     *   No "view desktop anyway" override (D-05 — terminal state).
     *
     *   CTA hrefs (D-06):
     *     - 3 internal CTAs route to /#/{slug} — they navigate to the same
     *       fallback at <1024px (no real content), but exist for visual
     *       signal that the site has structure AND so a later desktop
     *       open of the same URL goes straight to the right page
     *     - 1 external Lakeview CTA opens the Lakeview marketing site
     *       in a new tab (Lakeview handles its own mobile responsive)
     */

    /** Body copy — single paragraph, max-w-[20ch] in component (Phase 6 D-04). */
    export const fallbackBody =
      'Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам';

    /** Email — accent-fill mailto link in component. Same email as company.email
     *  but exported here as a literal so the mobile-fallback module is fully
     *  self-contained (no cross-import, simpler audit). */
    export const fallbackEmail = 'vygoda.sales@gmail.com';

    /** 4 CTA links in display order (D-04 ASCII layout + D-06 hrefs). */
    export const fallbackCtas: ReadonlyArray<{
      readonly label: string;
      readonly href: string;
      readonly external: boolean;
    }> = [
      { label: 'Проєкти →',          href: '/#/projects',         external: false },
      { label: 'Хід будівництва →',  href: '/#/construction-log', external: false },
      { label: 'Контакт →',          href: '/#/contact',          external: false },
      { label: 'Перейти до Lakeview ↗', href: 'https://yaroslavpetrukha.github.io/Lakeview/', external: true },
    ] as const;
    ```

    File length: ~50 lines including JSDoc. Named exports only. Zero imports — leaf module.

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (verified zero matches in this content)
    - Hex literals in source: `#2F3640`, `#A7AFBC`, `#C1F33D` appear ONLY in JSDoc descriptive prose. paletteWhitelist allows these — all 3 are in the 6-canonical whitelist.
    - Placeholder tokens: NO `\{\{[^}]*\}\}` Mustache-style tokens. The plan literal `{slug}` in JSDoc uses single curly braces, NOT double — verified zero matches for the full Mustache pair regex.
    - Inline transition: NO `transition={{` JSX prop pattern (this is a content file, no JSX)
    - Import boundaries: ZERO imports — strictest leaf form

    Note: the fallbackEmail value `vygoda.sales@gmail.com` matches `src/content/company.ts` `email` export (company.email). Decision per JSDoc: keep them as separate literals here for self-containment of the mobile module (component imports only mobile-fallback content; no cross-module dependency just for one string). If they ever drift, Phase 7 manual review catches it (acceptable risk for a 1-string duplication).
  </action>
  <verify>
    <automated>test -f src/content/mobile-fallback.ts && grep -q "export const fallbackBody" src/content/mobile-fallback.ts && grep -q "export const fallbackEmail" src/content/mobile-fallback.ts && grep -q "export const fallbackCtas" src/content/mobile-fallback.ts && grep -q "vygoda.sales@gmail.com" src/content/mobile-fallback.ts && grep -q "Сайт оптимізовано для екранів" src/content/mobile-fallback.ts && grep -q "yaroslavpetrukha.github.io/Lakeview" src/content/mobile-fallback.ts && npx tsc --noEmit && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f src/content/mobile-fallback.ts` exits 0
    - `grep -c "^export const fallbackBody" src/content/mobile-fallback.ts` returns 1
    - `grep -c "^export const fallbackEmail" src/content/mobile-fallback.ts` returns 1
    - `grep -c "^export const fallbackCtas" src/content/mobile-fallback.ts` returns 1
    - `grep -c "Сайт оптимізовано для екранів ≥1280px" src/content/mobile-fallback.ts` returns 1 (D-04 locked copy verbatim)
    - `grep -c "vygoda.sales@gmail.com" src/content/mobile-fallback.ts` returns 1
    - `grep -c "Проєкти →" src/content/mobile-fallback.ts` returns 1
    - `grep -c "Хід будівництва →" src/content/mobile-fallback.ts` returns 1
    - `grep -c "Контакт →" src/content/mobile-fallback.ts` returns 1
    - `grep -c "Перейти до Lakeview ↗" src/content/mobile-fallback.ts` returns 1
    - `grep -c "/#/projects" src/content/mobile-fallback.ts` returns 1
    - `grep -c "/#/construction-log" src/content/mobile-fallback.ts` returns 1
    - `grep -c "/#/contact" src/content/mobile-fallback.ts` returns 1
    - `grep -c "https://yaroslavpetrukha.github.io/Lakeview/" src/content/mobile-fallback.ts` returns 1
    - `grep -E "^import" src/content/mobile-fallback.ts` returns nothing (zero imports — leaf module)
    - `grep -E '\\{\\{[^}]*\\}\\}' src/content/mobile-fallback.ts` returns nothing (no Mustache tokens)
    - `npx tsc --noEmit` exits 0
  </acceptance_criteria>
  <done>
    - File exists at `src/content/mobile-fallback.ts`
    - 3 named exports: `fallbackBody` (string), `fallbackEmail` (string), `fallbackCtas` (readonly array of {label, href, external})
    - Body copy is verbatim D-04 wording: «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам»
    - Email matches `vygoda.sales@gmail.com`
    - 4 CTAs in correct order: Проєкти, Хід будівництва, Контакт, Lakeview (external)
    - Zero imports — leaf module passes `importBoundaries()` content-rule
    - `npx tsc --noEmit` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create brand-assets/og/og.svg with pre-pathed Cyrillic wordmark (D-27 + RESEARCH Pitfall 3)</name>
  <read_first>
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-27 (composition sketch verbatim)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-30 (font handling — wordmark MUST be pre-pathed; sub-line MAY be <text>)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pitfall 3" (sharp + Linux runner + Cyrillic = pre-pathing mandatory)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Risk 2" (mitigation: doc-block in og.svg saying wordmark is pre-pathed; if brand font changes, re-export from source)
    - brand-assets/patterns/isometric-grid.svg (existing pattern source for the cube-tile background — inline-copy candidate)
    - brand-assets/logo/dark.svg (existing wordmark/logo source — letterform reference)
    - brand-system.md §3 (palette: 6 canonical hexes only) and §5 (isometric line params: stroke 0.5–1.5pt, allowed colors #A7AFBC/#F5F7FA/#C1F33D, opacity 5–60%)
  </read_first>
  <files>brand-assets/og/og.svg</files>
  <action>
    **Step 1 — Ensure target directory exists.** Create `brand-assets/og/` if it does not exist (mkdir -p).

    **Step 2 — Author the SVG.** Create `brand-assets/og/og.svg` as a 1200×630 SVG composed of these layers in z-order (back to front):

    1. **Root `<svg>` element**: `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"`
    2. **Doc-block comment at top of file** (RESEARCH Risk 2 mitigation):
       ```xml
       <!--
         Vugoda OG image — 1200×630, used by sharp SVG→PNG export
         (scripts/build-og-image.mjs, plan 06-06) to produce
         public/og-image.png referenced by og:image meta in index.html.

         WORDMARK IS PRE-PATHED. The «ВИГОДА» letterforms below are <path>
         elements derived from Montserrat 700 via Inkscape Object → Path.
         Do NOT replace with <text> — sharp on Ubuntu GH runner has no
         Cyrillic Montserrat font available; falls back to DejaVu Sans
         and ships an off-brand PNG (RESEARCH §Pitfall 3).

         If the brand font ever changes (Montserrat → other), re-export the
         wordmark from source by:
           1. Open this SVG in Inkscape
           2. Add a <text font-family="{new-font}" font-weight="700"
              font-size="140">ВИГОДА</text> at the right position
           3. Select the <text> element → Object → Path (Ctrl+Shift+C)
           4. Delete the original wordmark group, save

         Sub-line «Системний девелопмент» (32px) stays as <text> per D-30
         carve-out — DejaVu Sans fallback is visually acceptable at 32px.

         Palette: only the 6 canonical brandbook hexes (#2F3640, #C1F33D,
         #F5F7FA, #A7AFBC, #3D3B43, #020A0A). NO gradients, NO photo, NO
         multi-color outside the brand set (brand-system §6 hard-rules).
       -->
       ```
    3. **Background rect**: `<rect width="1200" height="630" fill="#2F3640" />`
    4. **IsometricGridBG overlay** at opacity 0.15: a `<g opacity="0.15">` containing the cube-tile path set inline-copied from `brand-assets/patterns/isometric-grid.svg` (you may need to scale/re-tile to fit 1200×630). Stroke `#A7AFBC` per brand-system §5 allowed line color.
    5. **Wordmark group at translate(220, 240)** containing pre-pathed `<path>` elements for «ВИГОДА». Render path: open Inkscape (or equivalent), add a `<text font-family="Montserrat" font-weight="700" font-size="140" fill="#F5F7FA">ВИГОДА</text>` at translate(220, 240), select it, run Object → Path (Ctrl+Shift+C), save the resulting `<path>` data. There will be 6 path elements (one per letter В И Г О Д А) OR a single combined `<path>` — either is acceptable as long as zero `<text>` nodes remain in the wordmark group. Fill: `#F5F7FA`.
    6. **Sub-line `<text>` at (x=600, y=430)**:
       ```xml
       <text x="600" y="430" text-anchor="middle" fill="#A7AFBC"
             font-family="Montserrat, sans-serif" font-weight="500" font-size="32">Системний девелопмент</text>
       ```
       Sans-serif fallback per D-30 — DejaVu Sans on Linux runner is the visual outcome.
    7. **Accent cube** at translate(1050, 90), opacity 0.4, stroke `#C1F33D` 1.5pt: `<g transform="translate(1050, 90)" stroke="#C1F33D" stroke-width="1.5" fill="none" opacity="0.4">` containing 3 `<polygon>` or `<path>` nodes forming a single isometric cube (3 visible faces — top rhombus + 2 quad sides). You may inline-copy from any existing IsometricCube primitive in src/components/brand/ for the path geometry. Single cube only; no multi-cube group.

    **Step 3 — Visual sanity verification.** Open `brand-assets/og/og.svg` in a browser (or VS Code SVG preview). Confirm:
    - 1200×630 canvas, dark `#2F3640` background
    - Faint cube grid overlay visible at ~15% opacity
    - «ВИГОДА» wordmark rendered correctly (this is the visual proof of pre-pathing — the Cyrillic letters are visible WITHOUT any system font having Cyrillic Montserrat installed; if you see «ВИГОДА» in any browser, the paths are correct)
    - Sub-line «Системний девелопмент» visible in muted #A7AFBC
    - Single accent cube top-right in #C1F33D at low opacity
    - NO `<text>` element renders the «ВИГОДА» wordmark (use browser DevTools to confirm — the wordmark is rendered by `<path>` elements only)

    Doc-block self-screen on the SVG content itself:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero matches in og.svg or its comment)
    - Hex literals: `#2F3640`, `#A7AFBC`, `#C1F33D`, `#F5F7FA` all in 6-canonical whitelist. paletteWhitelist scope is `src/**/*.{ts,tsx,css}` — `.svg` files in brand-assets/ are OUT of scope, so this check does not gate; visual brand compliance is enforced manually here.
    - Placeholder tokens: NO `{{...}}` patterns. The doc-comment uses `{new-font}` single-brace which is NOT a Mustache pair (regex `\{\{[^}]*\}\}` does not match).
    - Inline transition: not applicable (SVG file, no JSX).
    - Import boundaries: not applicable (SVG file).
  </action>
  <verify>
    <automated>test -f brand-assets/og/og.svg && grep -q 'viewBox="0 0 1200 630"' brand-assets/og/og.svg && grep -q '#2F3640' brand-assets/og/og.svg && grep -q '#A7AFBC' brand-assets/og/og.svg && grep -q '#C1F33D' brand-assets/og/og.svg && grep -q '#F5F7FA' brand-assets/og/og.svg && grep -q 'WORDMARK IS PRE-PATHED' brand-assets/og/og.svg && grep -q 'Системний девелопмент' brand-assets/og/og.svg && ! grep -q '>ВИГОДА<' brand-assets/og/og.svg && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f brand-assets/og/og.svg` exits 0
    - `grep -c 'viewBox="0 0 1200 630"' brand-assets/og/og.svg` returns 1
    - `grep -c '#2F3640' brand-assets/og/og.svg` returns ≥ 1 (background fill)
    - `grep -c '#A7AFBC' brand-assets/og/og.svg` returns ≥ 1 (sub-line fill OR grid stroke)
    - `grep -c '#C1F33D' brand-assets/og/og.svg` returns ≥ 1 (accent cube stroke)
    - `grep -c '#F5F7FA' brand-assets/og/og.svg` returns ≥ 1 (wordmark fill)
    - `grep -c 'WORDMARK IS PRE-PATHED' brand-assets/og/og.svg` returns 1 (RESEARCH Risk 2 doc-block present)
    - `grep -c 'Системний девелопмент' brand-assets/og/og.svg` returns 1 (sub-line text content)
    - `! grep -E '<text[^>]*>ВИГОДА<' brand-assets/og/og.svg` exits 0 — i.e., NO `<text>...ВИГОДА...</text>` element. The wordmark is rendered by `<path>` only.
    - `grep -cE '<path[^>]*' brand-assets/og/og.svg` returns ≥ 1 (at least one `<path>` element exists for the wordmark; typical 6-letter pre-path produces 6 paths or 1 compound)
    - `grep -cE 'Pictorial|Rubikon|Пикторіал|Рубікон' brand-assets/og/og.svg` returns 0 (forbidden-lexicon clean)
    - `grep -E '\\{\\{[^}]*\\}\\}' brand-assets/og/og.svg` returns nothing (no Mustache placeholders)
  </acceptance_criteria>
  <done>
    - File exists at `brand-assets/og/og.svg`
    - viewBox = `0 0 1200 630`
    - Background = `#2F3640`
    - IsometricGridBG group at opacity 0.15 with stroke `#A7AFBC`
    - Wordmark «ВИГОДА» rendered by `<path>` elements (NOT `<text>`); fill `#F5F7FA`
    - Sub-line «Системний девелопмент» rendered by `<text>` (font-family Montserrat, sans-serif fallback acceptable per D-30)
    - Accent cube at translate(1050, 90), stroke `#C1F33D`, opacity 0.4
    - Doc-comment at top of file documenting "WORDMARK IS PRE-PATHED" + re-export procedure (RESEARCH Risk 2)
    - All hex colors ⊆ 6-canonical brandbook palette
    - No grep-detectable forbidden lexicon
    - Visual sanity: opens in any browser (Chrome/Safari/Firefox) and renders the four layers correctly
  </done>
</task>

</tasks>

<verification>
- `test -f src/content/mobile-fallback.ts && test -f brand-assets/og/og.svg` exits 0
- `npx tsc --noEmit` exits 0 (TS file in src/content/ compiles cleanly)
- `npx tsx scripts/check-brand.ts` exits 0 (5/5 checks PASS — importBoundaries verifies content/mobile-fallback has zero forbidden imports; SVG is out of grep scope so no palette/denylist false positive)
- `npm run build` exits 0 (no build pipeline change yet — Wave 2 plan 06-06 wires the OG SVG into prebuild via build-og-image.mjs)
- Visual sanity (manual, ~30 sec): open `brand-assets/og/og.svg` in Chrome/Safari/Firefox — all 4 layers (bg, grid, wordmark, sub-line, accent cube) render correctly. The «ВИГОДА» letters render even with NO Montserrat font installed because they are paths, not text.
</verification>

<success_criteria>
- [ ] `src/content/mobile-fallback.ts` exists with `fallbackBody`, `fallbackEmail`, `fallbackCtas` exports — zero imports, leaf content module
- [ ] All 4 D-04 CTA labels + their D-06 hrefs (3 internal `/#/...` + 1 external Lakeview) shipped verbatim
- [ ] `brand-assets/og/og.svg` exists with viewBox 0 0 1200 630
- [ ] Wordmark «ВИГОДА» rendered by `<path>` elements (pre-pathed) — RESEARCH Pitfall 3 mitigated
- [ ] Doc-comment at top of og.svg documents "WORDMARK IS PRE-PATHED" with re-export procedure (RESEARCH Risk 2)
- [ ] All hex colors in og.svg ⊆ 6-canonical brandbook palette
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-02-content-and-og-svg-SUMMARY.md` documenting:
- Verbatim final form of `src/content/mobile-fallback.ts`
- Description of og.svg layer composition (background hex, grid opacity, wordmark path count, sub-line text-family attr, cube transform/stroke)
- Confirmation that the wordmark is rendered by `<path>` elements only (RESEARCH Pitfall 3 mitigation locked at author time)
- Confirmation that paletteWhitelist gate is unaffected because .svg is out of scope (`*.{ts,tsx,css}` only); visual brand compliance is enforced manually here
- Note that consumer Wave 2 plans use these:
  - 06-04 MobileFallback.tsx imports `fallbackBody`, `fallbackEmail`, `fallbackCtas`
  - 06-06 scripts/build-og-image.mjs reads `brand-assets/og/og.svg` and exports to `public/og-image.png`
- Risk acknowledged: if the project switches off Montserrat, the og.svg pre-pathed wordmark becomes brand-stale; the doc-comment in og.svg lists the re-export procedure
</output>
