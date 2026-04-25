---
phase: 03-brand-primitives-home-page
plan: 4
type: execute
wave: 2
depends_on: ["03-01", "03-02", "03-03"]
files_modified:
  - src/components/sections/home/Hero.tsx
  - index.html
autonomous: true
requirements: [HOME-01, ANI-01, VIS-03, VIS-04]
requirements_addressed: [HOME-01, ANI-01]

must_haves:
  truths:
    - "Hero section renders wordmark `<h1>` ВИГОДА (Montserrat 700 uppercase, ~180-220px responsive), gasло (from `heroSlogan` content import), CTA «Переглянути проекти» Link → /projects, and IsometricGridBG overlay at opacity 0.10-0.20 (Roadmap SC#1, D-01..D-06)"
    - "Hero parallax uses Motion `useScroll({ target: heroRef, offset: ['start start','end start'] })` + `useTransform(scrollYProgress, [0,1], [0,-120])` — bounded ≤120px, no spring, no bounce (D-04, ANI-01)"
    - "Hero respects `prefers-reduced-motion` via `useReducedMotion()` hook — output range collapses to `[0, 0]` when reduced (D-04 + 03-CONTEXT deferred reduced-motion guard)"
    - "`index.html` includes `<link rel='preload' as='image' type='image/avif' fetchpriority='high'>` for `aerial-1920.avif` (D-18) — placed before `<title>`"
    - "Hero contains NO inline `transition={{}}` — uses `style={{ y: cubeY }}` only (D-04 + Phase 5 boundary; Pitfall 14)"
  artifacts:
    - path: "src/components/sections/home/Hero.tsx"
      provides: "Hero section primitive — wordmark + gasло + CTA + parallax overlay"
      exports: ["Hero"]
      min_lines: 55
    - path: "index.html"
      provides: "AVIF hero preload link directive (D-18) + existing favicon/theme-color meta"
      contains: 'rel="preload" as="image"'
  key_links:
    - from: "src/components/sections/home/Hero.tsx"
      to: "src/components/brand/IsometricGridBG.tsx"
      via: "import { IsometricGridBG } — overlay component from Wave 1"
      pattern: "from '../../brand/IsometricGridBG'"
    - from: "src/components/sections/home/Hero.tsx"
      to: "src/content/home.ts"
      via: "import { heroSlogan, heroCta } — content from Wave 1"
      pattern: "from '../../../content/home'"
    - from: "src/components/sections/home/Hero.tsx"
      to: "react-router-dom Link"
      via: "Hero CTA navigates to /projects via <Link>"
      pattern: 'to="/projects"'
    - from: "src/components/sections/home/Hero.tsx"
      to: "motion/react"
      via: "import { motion, useScroll, useTransform, useReducedMotion }"
      pattern: "from 'motion/react'"
    - from: "index.html"
      to: "public/renders/lakeview/_opt/aerial-1920.avif"
      via: "preload directive references the optimizer output (Wave 2 dep)"
      pattern: "/vugoda-website/renders/lakeview/_opt/aerial-1920\\.avif"
---

<objective>
Build the hero section that closes HOME-01 + ANI-01 — wordmark + gasло + CTA + slow-parallax IsometricGridBG overlay — and add the AVIF preload `<link>` to `index.html` so Phase 6 Lighthouse can hit ≤200KB hero LCP at desktop profile.

Purpose: HOME-01 is the «ахуєнний desktop» moment — the cinematic brand opening. ANI-01 is its parallax. Both must be implemented together (Hero is where the parallax lives) and gated by Wave 1 (IsometricGridBG, heroSlogan content) + Wave 2 (preload references aerial-1920.avif from optimizer).

Output:
1. `src/components/sections/home/Hero.tsx` (~70 lines) — wordmark + paragraph + CTA + Motion-parallaxed `<IsometricGridBG>`
2. `index.html` modified to add the hero preload `<link>` above `<title>`
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@.planning/phases/03-brand-primitives-home-page/03-VALIDATION.md
@brand-system.md

<interfaces>
Wave 1 dependency: src/components/brand/IsometricGridBG.tsx (Plan 03-01)

```ts
export interface IsometricGridBGProps {
  className?: string;
  opacity?: number;  // default 0.15, range 0.05-0.60
}
export function IsometricGridBG(props: IsometricGridBGProps): JSX.Element;
```

Wave 1 dependency: src/content/home.ts (Plan 03-02)

```ts
export const heroSlogan: string;  // "Системний девелопмент, у якому цінність є результатом точних рішень."
export const heroCta: string;     // "Переглянути проекти"
```

Wave 2 dependency: index.html preload references the optimizer output.
After running `npm run prebuild` from Wave 2, the file
`public/renders/lakeview/_opt/aerial-1920.avif` exists (~80-140KB).
Final URL on Pages: `/vugoda-website/renders/lakeview/_opt/aerial-1920.avif`.

Motion 12.38 verified API surface (from node_modules/framer-motion/dist/types/index.d.ts):

```ts
declare function useScroll({ target, offset, ...options }?: UseScrollOptions): {
  scrollYProgress: MotionValue<number>;
};
declare function useTransform<I, O>(
  value: MotionValue<I>,
  inputRange: I[],
  outputRange: O[],
): MotionValue<O>;
declare function useReducedMotion(): boolean | null;
```

Re-exported under `'motion/react'` (project uses `motion@^12.38.0` per package.json).

Tailwind v4 utilities generated by @theme block (src/index.css:8-26):
- `bg-bg` → `#2F3640`, `bg-bg-surface` → `#3D3B43`, `bg-bg-black` → `#020A0A`
- `text-text` → `#F5F7FA`, `text-text-muted` → `#A7AFBC`
- `bg-accent` / `text-accent` → `#C1F33D`
- `font-sans` → Montserrat stack

Existing `index.html` (current 14 lines, full content):

```html
<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2F3640" />
    <link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg" />
    <title>ВИГОДА — Системний девелопмент</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Phase 5 boundary — DO NOT touch:
NO inline `transition={{}}` props on motion components in this plan. Hero uses `style={{ y: cubeY }}` driven by MotionValue from `useTransform`. Phase 5 owns project-wide easing variants.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/components/sections/home/Hero.tsx</name>
  <files>src/components/sections/home/Hero.tsx</files>
  <read_first>
    - src/components/brand/IsometricGridBG.tsx (Wave 1 dep — props signature)
    - src/content/home.ts (Wave 1 dep — heroSlogan + heroCta exports)
    - 03-CONTEXT.md D-01 through D-06 (hero section locked decisions)
    - 03-RESEARCH.md lines 218-318 (Motion useScroll+useTransform recipe — copy structurally)
    - 03-RESEARCH.md lines 905-931 (Lighthouse Desktop ≥90 prerequisites for `/`)
    - 03-RESEARCH.md lines 1230-1234 (Pitfall 6: useScroll ref-attach timing — recipe handles correctly)
    - 03-RESEARCH.md lines 1271-1274 (Pitfall 14: NO inline `transition={{}}`)
    - brand-system.md §3 (CTA contrast: bg-accent on #020A0A = AAA 8.85:1)
    - brand-system.md §5 (IsometricGridBG opacity 5-60% — recipe uses 0.15)
  </read_first>
  <behavior>
    - Test 1: file exports `Hero` named function
    - Test 2: imports `motion`, `useScroll`, `useTransform`, `useReducedMotion` from `'motion/react'`
    - Test 3: imports `Link` from `'react-router-dom'`
    - Test 4: imports `useRef` from `'react'`
    - Test 5: imports `IsometricGridBG` from `'../../brand/IsometricGridBG'` (relative — sections dir is src/components/sections/home/)
    - Test 6: imports `heroSlogan` and `heroCta` from `'../../../content/home'`
    - Test 7: hooks called in order: `useRef<HTMLElement>(null)`, `useReducedMotion()`, `useScroll({ target: heroRef, offset: ['start start', 'end start'] })`, `useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -120])`
    - Test 8: `<section ref={heroRef}>` has Tailwind classes `relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg`
    - Test 9: parallax overlay is `<motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ y: cubeY }}>` wrapping `<IsometricGridBG className="h-full w-full" opacity={0.15} />`
    - Test 10: content container is `<div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">` (max-w-7xl per D-24)
    - Test 11: wordmark `<h1>` Tailwind classes include `font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text` and contains text ВИГОДА
    - Test 12: gasло `<p>` contains `{heroSlogan}` (variable, not literal) and Tailwind classes include `max-w-3xl text-xl text-text`
    - Test 13: CTA `<Link to="/projects">` contains `{heroCta}` and Tailwind classes include `inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110`
    - Test 14: file does NOT contain `transition={{` — purely scroll-driven (Pitfall 14)
    - Test 15: file does NOT contain string literals "Системний девелопмент" or "Переглянути проекти" — content comes from imports (D-29)
  </behavior>
  <action>
    Step A — Create directory if missing: `src/components/sections/home/` (mkdir -p).

    Step B — CREATE file `src/components/sections/home/Hero.tsx` with the following content:

    File body (verbatim):

    ```
    /**
     * @module components/sections/home/Hero
     *
     * HOME-01 + ANI-01 + VIS-03 + VIS-04 — the desktop-opening hero.
     *
     * Anatomy (Phase 3 D-01..D-06):
     *   - 100vh section, max-w-7xl inner content (D-01, D-24)
     *   - <h1> ВИГОДА Montserrat 700 uppercase, clamp(120px, 12vw, 200px) (D-02)
     *   - <IsometricGridBG opacity 0.15> overlay, parallax-translates UP on scroll (D-03 + D-04)
     *   - Gasло paragraph from src/content/home.ts (D-06, D-29)
     *   - CTA "Переглянути проекти" -> /projects via <Link> (D-05)
     *
     * Parallax recipe (D-04):
     *   - useScroll scoped to hero section (target: heroRef) — stops once hero scrolls out
     *   - useTransform maps scrollYProgress 0->1 to translateY 0 -> -120px
     *   - Reduced-motion: output range collapses to [0, 0] (Phase 5 owns full hook threading)
     *   - Linear (no spring, no bounce — D-04)
     *
     * NO inline transition={{}} — Phase 5 owns easing config (Pitfall 14).
     */

    import { useRef } from 'react';
    import {
      motion,
      useScroll,
      useTransform,
      useReducedMotion,
    } from 'motion/react';
    import { Link } from 'react-router-dom';
    import { IsometricGridBG } from '../../brand/IsometricGridBG';
    import { heroSlogan, heroCta } from '../../../content/home';

    export function Hero() {
      const heroRef = useRef<HTMLElement>(null);
      const prefersReducedMotion = useReducedMotion();

      const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
      });

      const cubeY = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [0, 0] : [0, -120],
      );

      return (
        <section
          ref={heroRef}
          className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg"
        >
          {/* Parallax overlay — translates UP on scroll, behind wordmark */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ y: cubeY }}
          >
            <IsometricGridBG className="h-full w-full" opacity={0.15} />
          </motion.div>

          {/* Hero content — max-w-7xl per D-24 */}
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">
            <h1 className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text">
              ВИГОДА
            </h1>
            <p className="max-w-3xl text-xl text-text">{heroSlogan}</p>
            <Link
              to="/projects"
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
            >
              {heroCta}
            </Link>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - The `<h1>` text ВИГОДА is the wordmark display moment (D-02) — short Cyrillic literal allowed; gasло (40+ chars) and CTA copy come from imports (D-29).
    - Tailwind arbitrary value `text-[clamp(120px,12vw,200px)]` requires NO spaces inside the function.
    - `hover:brightness-110` is built-in filter utility; no custom CSS, no inline transition.
    - DO NOT add `prefers-reduced-motion` CSS — `useReducedMotion()` hook handles it at React layer.
  </action>
  <verify>
    <automated>test -f src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "useScroll" src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "useTransform" src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "useReducedMotion" src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "from '../../brand/IsometricGridBG'" src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "from '../../../content/home'" src/components/sections/home/Hero.tsx &amp;&amp; grep -cE 'to="/projects"' src/components/sections/home/Hero.tsx &amp;&amp; grep -cE "ВИГОДА" src/components/sections/home/Hero.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/Hero.tsx &amp;&amp; ! grep -nE "type: ?'spring'|bounce:" src/components/sections/home/Hero.tsx &amp;&amp; grep -nE 'useTransform\(.*\[0,\s*-120\]' src/components/sections/home/Hero.tsx &amp;&amp; grep -nE "offset: \[['\"]start start['\"], ['\"]end start['\"]\]" src/components/sections/home/Hero.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    Hero.tsx exists with `useScroll({target,offset})` + `useTransform([0,1], [0,-120])` (linear, no spring), `useReducedMotion` guard, IsometricGridBG overlay, gasло + CTA from `home.ts` content imports, Link to `/projects`. No inline `transition={{}}` (Phase 5 boundary preserved). The `useTransform` output bound `[0, -120]` and `useScroll` `offset: ['start start', 'end start']` are both grep-asserted (parity with VALIDATION.md HOME-01 + ANI-01 rows). `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add AVIF hero preload link to index.html</name>
  <files>index.html</files>
  <read_first>
    - index.html (current 14 lines)
    - 03-CONTEXT.md D-18 (preload link spec — type, fetchpriority, no crossorigin)
    - 03-RESEARCH.md lines 397-437 (preload recipe — recommends simple form: just 1920w via `href`, no `imagesrcset`)
    - 03-RESEARCH.md lines 1221-1228 (Pitfalls 4 + 5: AVIF type-attr silent-ignore is fine; OMIT crossorigin)
  </read_first>
  <action>
    EDIT `index.html` to add the AVIF hero preload `<link>` directly ABOVE the `<title>` tag. The Wave 2 image pipeline already produced `public/renders/lakeview/_opt/aerial-1920.avif`; on production deploy the URL is `/vugoda-website/renders/lakeview/_opt/aerial-1920.avif` (Vite `base: '/vugoda-website/'`).

    Final `index.html` content (14-line file becomes ~21 lines):

    ```
    <!doctype html>
    <html lang="uk">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2F3640" />
        <link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg" />
        <link
          rel="preload"
          as="image"
          href="/vugoda-website/renders/lakeview/_opt/aerial-1920.avif"
          type="image/avif"
          fetchpriority="high"
        />
        <title>ВИГОДА — Системний девелопмент</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
    ```

    Critical caveats (per RESEARCH §C and Pitfalls 4, 5):
    - DO NOT add `crossorigin` — same-origin on Pages; `crossorigin` would cause double-fetch (Pitfall 5).
    - DO NOT add `imagesrcset` / `imagesizes` for the simple desktop-first MVP (RESEARCH recommendation).
    - The `type="image/avif"` is silently ignored by browsers without AVIF support (Pitfall 4 — acceptable degraded path; `<picture>` JPG fallback handles them at render time).
  </action>
  <verify>
    <automated>grep -cE 'rel="preload"' index.html &amp;&amp; grep -cE 'as="image"' index.html &amp;&amp; grep -cE 'type="image/avif"' index.html &amp;&amp; grep -cE 'fetchpriority="high"' index.html &amp;&amp; grep -cE 'aerial-1920\.avif' index.html &amp;&amp; ! grep -nE 'crossorigin' index.html</automated>
  </verify>
  <done>
    `index.html` contains a single `<link rel="preload" as="image" type="image/avif" fetchpriority="high" href="…aerial-1920.avif">` directive above `<title>`. No `crossorigin` attribute. Phase 6 Lighthouse can use this preload to start fetch at HTML-parse time.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0 (TS clean — Hero compiles against Wave 1 + 2 deps)
2. `npm run build` exits 0 — full pipeline including postbuild check-brand
3. `tsx scripts/check-brand.ts` PASS all 4 invariants:
   - `denylistTerms` — no Pictorial/Rubikon
   - `paletteWhitelist` — Hero contains zero hex literals (uses Tailwind utilities only)
   - `placeholderTokens` — dist/ clean
   - `importBoundaries` — Hero only imports from brand/, content/, react-router-dom, react, motion/react (all allowed)
4. Manual visual QA at `npm run dev`:
   - Open `http://localhost:5173/#/`
   - Hero fills 100vh, wordmark visible, gasло readable, CTA clickable
   - Scroll slowly with mouse wheel — IsometricGridBG drifts UP behind wordmark, ≤120px max translation, no bounce, stops cleanly when scroll stops
   - DevTools Network → reload `/` → verify `aerial-1920.avif` (or webp/jpg) loads with `Highest` priority, BEFORE other resources
</verification>

<success_criteria>
- [ ] `src/components/sections/home/Hero.tsx` exists, ~70 lines
- [ ] Imports motion + useScroll + useTransform + useReducedMotion from 'motion/react'
- [ ] Imports IsometricGridBG from '../../brand/IsometricGridBG'
- [ ] Imports heroSlogan + heroCta from '../../../content/home'
- [ ] `useTransform` output range bounded `[0, -120]` (D-04 ceiling) — grep-asserted
- [ ] `useScroll` offset is `['start start', 'end start']` (ANI-01) — grep-asserted
- [ ] `useReducedMotion()` guard collapses parallax when user prefers reduced motion
- [ ] CTA `<Link to="/projects">{heroCta}</Link>` with `bg-accent text-bg-black`
- [ ] Wordmark `<h1>` text "ВИГОДА", classes include `font-bold uppercase`
- [ ] No `transition={{` literal anywhere in Hero.tsx (Phase 5 boundary)
- [ ] `index.html` includes `<link rel="preload" as="image" type="image/avif" fetchpriority="high">` for `aerial-1920.avif` BEFORE `<title>`
- [ ] `index.html` contains no `crossorigin` attribute (same-origin)
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0 — check-brand 4/4 PASS
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-04-SUMMARY.md` documenting:
- Hero.tsx + index.html preload shipped
- HOME-01 + ANI-01 closed (parallax verified by manual scroll-test on 1920×1080)
- Reduced-motion guard verified by toggling Chrome DevTools "Emulate prefers-reduced-motion: reduce" → grid stays static, content remains accessible
- Network panel screenshot or note: aerial-1920.{avif|webp|jpg} loads at Highest priority before bundle
- Wave 3 partial: PortfolioOverview + below-fold sections still pending (Plans 03-05, 03-06, 03-07)
</output>
</output>
