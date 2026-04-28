---
phase: 01-foundation-shell
plan: 03
type: execute
wave: 2
depends_on:
  - 01-01
  - 01-02
files_modified:
  - src/components/brand/Logo.tsx
  - src/components/brand/MinimalCube.tsx
  - src/components/layout/Nav.tsx
  - src/components/layout/Footer.tsx
autonomous: true
requirements:
  - NAV-01
  - VIS-01
objective: "Brand-primitive components + Layout chrome. `<Logo>` imports `brand-assets/logo/dark.svg` via SVGR `?react` (NEVER re-codes paths). `<MinimalCube>` is a hand-authored single-variant inline-SVG stub that Phase 3 will extend into the full `<IsometricCube variant>` primitive. `<Nav>` renders 4 items (Logo · Проєкти · Хід будівництва · Контакт) sticky-top on `#2F3640` with 2px `#C1F33D` active-route underline. `<Footer>` renders 3-column grid with legal triplet (ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, Ліцензія від 27.12.2019) + email + nav repeat + social-placeholder icons. All NAV-01 mandatory facts present."

must_haves:
  truths:
    - "Nav on dark `#2F3640` with brand-assets/logo/dark.svg renders on every route — Success Criterion #1"
    - "Footer displays юр. назва ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019, email vygoda.sales@gmail.com on every route — Success Criterion #1"
    - "Logo is imported from brand-assets via SVGR (no copied paths) — PITFALLS.md §Anti-Pattern 4"
    - "MinimalCube stub renders as inline SVG using only 3 allowed stroke colors (#A7AFBC / #F5F7FA / #C1F33D)"
  artifacts:
    - path: "src/components/brand/Logo.tsx"
      provides: "React component wrapping brand-assets/logo/dark.svg?react import"
      exports: ["Logo"]
    - path: "src/components/brand/MinimalCube.tsx"
      provides: "Single-variant inline-SVG cube for page stubs (Phase 3 will expand)"
      exports: ["MinimalCube"]
    - path: "src/components/layout/Nav.tsx"
      provides: "Sticky top nav: 4 total items — Logo (plain Link) + 3 NavLinks with active underline"
      exports: ["Nav"]
    - path: "src/components/layout/Footer.tsx"
      provides: "3-column footer with legal triplet, email, repeat nav, social placeholders"
      exports: ["Footer"]
  key_links:
    - from: "src/components/brand/Logo.tsx"
      to: "brand-assets/logo/dark.svg"
      via: "SVGR ?react import"
      pattern: "from ['\"][^'\"]*brand-assets/logo/dark\\.svg\\?react['\"]"
    - from: "src/components/layout/Nav.tsx"
      to: "react-router-dom NavLink"
      via: "named import"
      pattern: "NavLink"
    - from: "src/components/layout/Footer.tsx"
      to: "legal strings (ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, 27.12.2019, vygoda.sales@gmail.com)"
      via: "JSX literals"
      pattern: "42016395"
---

<objective>
Deliver the visible chrome (Nav + Footer) and its brand-primitive dependencies (Logo + MinimalCube stub). Plan 04 (router + pages) imports these four components into `<Layout>` so every route inherits them.

Purpose: NAV-01 mandatory facts (ТОВ name, ЄДРПОУ, license date, email) land here — all in the footer, visible on every route (persona-3 bank DD enters from Google on deep pages, not just home). Brand-asset inviolability pattern (SVGR, no path copy) is established at Phase 1 per PITFALLS §Anti-Pattern 4.

Output: Four TSX components. None reference pages (one-way dependency preserved per ARCHITECTURE.md §7 boundary rule). Plan 04 wires them; this plan authors them.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-shell/01-CONTEXT.md
@.planning/research/ARCHITECTURE.md
@.planning/research/PITFALLS.md
@brand-system.md

<interfaces>
<!-- Brand-asset source (inviolable — import as component, do NOT copy paths) -->
brand-assets/logo/dark.svg
  - viewBox: "0 0 930.91 400.34"
  - Uses CSS classes with fills: #c1f33d (cube), #f5f7fa (wordmark), #020a0a (petals descriptor)
  - IMPORT as: import DarkLogoSvg from '../../../brand-assets/logo/dark.svg?react'
  - Do NOT re-author paths in JSX

<!-- Legal facts — NAV-01 mandatory verbatim -->
Юр. назва:  «ТОВ «БК ВИГОДА ГРУП»»  (use ukrainian quotes «»)
ЄДРПОУ:     42016395
Ліцензія:   27.12.2019 (безстрокова)
Email:      vygoda.sales@gmail.com

<!-- Nav items (D-01, D-02 locked order) -->
1. Logo (→ `/`)
2. Проєкти (→ `/projects`)
3. Хід будівництва (→ `/construction-log`)
4. Контакт (→ `/contact`)
Note: Logo IS the home link; no separate «Головна» text.

<!-- Page title mapping (D-11) — used by page stubs in Plan 04, listed here for consistency check -->
/ → «ВИГОДА»
/projects → «Проєкти»
/zhk/:slug → «ЖК»
/construction-log → «Хід будівництва»
/contact → «Контакт»
404 → «404 — сторінку не знайдено»

<!-- Tailwind classes to use (from tokens in src/index.css @theme) -->
bg-bg          → #2F3640 (nav bg per D-04)
bg-bg-surface  → #3D3B43
bg-bg-black    → #020A0A
text-text      → #F5F7FA
text-text-muted → #A7AFBC (ONLY ≥14pt — footer legal triplet is ≥14pt per D-specifics)
text-accent    → #C1F33D
border-accent  → #C1F33D

<!-- react-router-dom v7 NavLink (confirmed peer: react 19) -->
NavLink gets `isActive` automatically.
Pattern: <NavLink to="/x" className={({isActive}) => isActive ? 'active-class' : 'inactive-class'}>label</NavLink>

<!-- lucide-react v1.11 icons for social placeholders (D-08) -->
Use: Send (Telegram proxy), Instagram, Facebook
Import pattern: import { Send, Instagram, Facebook } from 'lucide-react'
Each wrapped in <a href="#" aria-label="..."> — non-functional per D-08.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Write Logo + MinimalCube brand primitives</name>

  <read_first>
    - `brand-assets/logo/dark.svg` — confirm viewBox and that it's the dark-version logo (fill #f5f7fa wordmark on #2f3640 bg). DO NOT modify this file.
    - `brand-assets/mark/mark.svg` — reference for the minimal cube glyph (has viewBox "0 0 220.6 167.4", 3-path cube-with-petals). Inspirational only — MinimalCube in Phase 1 is a simpler single-cube hand-authored SVG, NOT this mark.
    - `brand-system.md` §2 (logo rules: охоронне поле, мінімум 100px, NO shadows/italics)
    - `brand-system.md` §5 (isometric line params: stroke 0.5–1.5pt ≈ 1–2px, opacity 5–60%, only stroke colors #A7AFBC / #F5F7FA / #C1F33D, Butt Cap + Miter Join, only straight lines)
    - `.planning/research/PITFALLS.md` §Anti-Pattern 4 (NEVER copy SVG paths — always SVGR ?react import), §Pitfall 1 (only token colors)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` D-05 (Logo via SVGR), D-14 (MinimalCube variant — Phase 3 extends)
    - `vite.config.ts` (from Plan 01) — confirms svgr plugin with `include: '**/*.svg?react'`
    - `src/types/svg.d.ts` (from Plan 01) — confirms `?react` import typing
  </read_first>

  <files>
    src/components/brand/Logo.tsx
    src/components/brand/MinimalCube.tsx
  </files>

  <action>
    1. Create `src/components/brand/Logo.tsx` with EXACTLY this content:

    ```tsx
    // Canonical brand logo — dark-background version per VIS-04 + D-05.
    // Imported from brand-assets/ via vite-plugin-svgr's ?react query.
    // NEVER re-author the SVG paths in this file (PITFALLS.md §Anti-Pattern 4) —
    // the brand-assets SVG is the source of truth; when designers reissue, this
    // component auto-updates.
    import DarkLogoSvg from '../../../brand-assets/logo/dark.svg?react';

    export interface LogoProps {
      /** Additional classes (e.g. sizing: h-8, h-10). */
      className?: string;
      /** Accessible name; defaults to brand wordmark. */
      title?: string;
    }

    /**
     * Dark-version logo wordmark + cube + petals (descriptor).
     * Renders on dark backgrounds (#2F3640, #020A0A). Охоронне поле
     * (clear-space) is the cap-height of «В» — parent must provide padding.
     */
    export function Logo({ className, title = 'ВИГОДА' }: LogoProps) {
      return <DarkLogoSvg className={className} title={title} aria-label={title} role="img" />;
    }
    ```

    Why this is exactly right:
    - Single import via `?react`. Zero path re-authoring. When the brand team reissues `dark.svg`, the component picks up the change on next build.
    - `title` prop proxies to SVGR's `titleProp: true` option (set in `vite.config.ts` svgr config by Plan 01) — becomes the `<title>` child of the SVG for accessibility.
    - No inline colors, no fills, no strokes. The SVG carries its own brand-correct `#c1f33d` / `#f5f7fa` / `#020a0a` fills (verified against `brand-assets/logo/dark.svg` — this is the dark-bg version so colors are already correct for the Nav background).
    - `className` lets Nav size it (e.g., `h-8 w-auto`).
    - `role="img"` + `aria-label` = screen readers announce the logo by name, not read child text.

    2. Create `src/components/brand/MinimalCube.tsx` — a simple single-cube hand-authored inline SVG stub. Phase 3 will REPLACE this with `IsometricCube variant='single' | 'group' | 'grid'` full primitive. Content EXACTLY:

    ```tsx
    // Phase 1 minimal stub — single isometric cube in wireframe line art.
    // Phase 3 replaces this with the full <IsometricCube variant> per VIS-03
    // and ARCHITECTURE.md §3 Q4. Kept intentionally simple: one viewBox,
    // three allowed stroke colors, straight lines only (brand-system.md §5).

    export interface MinimalCubeProps {
      /** Additional classes (sizing, margin, opacity). */
      className?: string;
      /** Stroke — must be one of the 3 allowed brand colors. */
      stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D';
      /** Stroke width in px; brandbook allows 0.5-1.5pt ≈ 1-2px. */
      strokeWidth?: number;
      /** SVG-level opacity; brandbook allows 0.05-0.60. */
      opacity?: number;
    }

    /**
     * Isometric cube wireframe — front/top/side faces, three visible edges from corner.
     * Used as route-stub visual anchor in Phase 1; Phase 3 expands this into the
     * `<IsometricCube variant='single' | 'group' | 'grid'>` primitive.
     */
    export function MinimalCube({
      className,
      stroke = '#A7AFBC',
      strokeWidth = 1.5,
      opacity = 0.6,
    }: MinimalCubeProps) {
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          style={{ opacity }}
          aria-hidden="true"
          focusable="false"
        >
          <g
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeLinejoin="miter"
          >
            {/* Top rhombus (face) */}
            <polygon points="50,15 85,35 50,55 15,35" />
            {/* Left rhombus (face) */}
            <polygon points="15,35 15,75 50,95 50,55" />
            {/* Right rhombus (face) */}
            <polygon points="50,55 50,95 85,75 85,35" />
          </g>
        </svg>
      );
    }
    ```

    Why this is exactly right:
    - Three rhombuses form an isometric wireframe cube — top, left-side, right-side — sharing edges at (50,55), (15,35), (50,15), (85,35), (50,95) — three points convergent at the back corner.
    - Strokes only; no fills (brand-system.md §5 "лінійна ізометрія + каркасні структури").
    - `strokeLinecap="butt"` + `strokeLinejoin="miter"` — brandbook parameters.
    - Typed `stroke` prop restricts to 3 allowed colors at COMPILE time (brand discipline encoded in the type).
    - `opacity` default 0.6 (within brandbook 0.05-0.60 range).
    - `aria-hidden="true"` — decorative; page stubs also have an H1 which is the semantic anchor.
    - 100×100 viewBox — square, scales cleanly when parent sets `className="h-32 w-32"`.
    - NO Motion imports (Phase 5 adds animation). NO hover states. Static.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/components/brand/Logo.tsx && test -f src/components/brand/MinimalCube.tsx && grep -qE "from ['\"][^'\"]*brand-assets/logo/dark\.svg\?react['\"]" src/components/brand/Logo.tsx && grep -q "export function Logo" src/components/brand/Logo.tsx && grep -qE "role=['\"]img['\"]" src/components/brand/Logo.tsx && grep -q "export function MinimalCube" src/components/brand/MinimalCube.tsx && grep -qE "'#A7AFBC'\s*\|\s*'#F5F7FA'\s*\|\s*'#C1F33D'" src/components/brand/MinimalCube.tsx && grep -q 'aria-hidden="true"' src/components/brand/MinimalCube.tsx && grep -q 'strokeLinecap="butt"' src/components/brand/MinimalCube.tsx && grep -q 'strokeLinejoin="miter"' src/components/brand/MinimalCube.tsx && ! grep -qE "path d=" src/components/brand/Logo.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/components/brand/Logo.tsx && test -f src/components/brand/MinimalCube.tsx` succeed
    - `grep -cE "from ['\"][^'\"]*brand-assets/logo/dark\\.svg\\?react['\"]" src/components/brand/Logo.tsx` = 1 (SVGR import, not path copy)
    - `grep -cE "<path d=" src/components/brand/Logo.tsx` = 0 (confirms NO re-coded SVG paths)
    - `grep -c "export function Logo" src/components/brand/Logo.tsx` ≥ 1 (named export, matches frontmatter)
    - `grep -cE "role=['\"]img['\"]" src/components/brand/Logo.tsx` ≥ 1
    - `grep -c "export function MinimalCube" src/components/brand/MinimalCube.tsx` ≥ 1
    - `grep -cE "'#A7AFBC'\\s*\\|\\s*'#F5F7FA'\\s*\\|\\s*'#C1F33D'" src/components/brand/MinimalCube.tsx` ≥ 1 (typed stroke union)
    - MinimalCube uses only allowed stroke colors: `grep -oE '#[0-9A-Fa-f]{6}' src/components/brand/MinimalCube.tsx | tr 'a-f' 'A-F' | sort -u` matches only subset of {#A7AFBC, #F5F7FA, #C1F33D}
    - `grep -c 'aria-hidden="true"' src/components/brand/MinimalCube.tsx` ≥ 1 (decorative per brand-system §5)
    - `grep -c 'strokeLinecap="butt"' src/components/brand/MinimalCube.tsx` ≥ 1 (brandbook line param)
    - `grep -c 'strokeLinejoin="miter"' src/components/brand/MinimalCube.tsx` ≥ 1 (brandbook line param)
    - No Motion imports in either file (Phase 5 scope): `grep -cE "from ['\"]motion/react['\"]|from ['\"]motion['\"]" src/components/brand/MinimalCube.tsx src/components/brand/Logo.tsx` = 0
  </acceptance_criteria>

  <done>
    `<Logo>` wraps the SVGR-imported brand SVG with no path re-authoring. `<MinimalCube>` is a typed, brand-compliant inline-SVG stub ready for page stubs to render. Both components type-check and render without props.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Write Nav component with 4 items and active-route underline</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Navigation D-01, D-02, D-03, D-04 (Nav items, order, active-underline, sticky dark bg)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Claude's Discretion (underline technique — pseudo-element / border-bottom / absolute span are all acceptable; pick one and commit)
    - `brand-system.md` §2 (охоронне поле — parent provides padding around logo)
    - `brand-system.md` §3 (palette usage rules — `#C1F33D` as accent only, never background)
    - `src/components/brand/Logo.tsx` (just created in Task 1) — to import
    - `src/index.css` (Plan 02) — confirms token → Tailwind class mapping (`bg-bg`, `text-text`, etc.)
    - react-router-dom v7 NavLink docs — `className` as function signature with `{ isActive }`
  </read_first>

  <files>
    src/components/layout/Nav.tsx
  </files>

  <action>
    Create `src/components/layout/Nav.tsx` with EXACTLY this content:

    ```tsx
    import { NavLink, Link } from 'react-router-dom';
    import { Logo } from '../brand/Logo';

    /**
     * Top navigation: sticky, dark (#2F3640), full-width with max-w-7xl inner
     * container. Four items per D-01/D-02: Logo · Проєкти · Хід будівництва · Контакт.
     * Active route marked with 2px #C1F33D underline (border-bottom technique, D-03).
     * Охоронне поле around logo: py-4 + px-6 on the container gives ~16-24px
     * clear space from nav edges (brand-system.md §2).
     */
    export function Nav() {
      const linkBase =
        'relative inline-block pb-1 text-sm font-medium tracking-wide text-text transition-colors hover:text-accent';
      const linkActive = 'border-b-2 border-accent';
      const linkInactive = 'border-b-2 border-transparent';

      return (
        <header className="sticky top-0 z-50 w-full bg-bg">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link to="/" aria-label="ВИГОДА — на головну" className="flex items-center">
              <Logo className="h-7 w-auto" title="ВИГОДА" />
            </Link>
            <ul className="flex items-center gap-8">
              <li>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Проєкти
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/construction-log"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Хід будівництва
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Контакт
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
      );
    }
    ```

    Explicit choices and rationale:
    - `sticky top-0 z-50` — D-04 sticky top; z-50 keeps it above page content without colliding with any Phase-5 modal layers (Phase 5 should use z-90+).
    - `bg-bg` → maps to `#2F3640` via `@theme` (Plan 02). NO inline hex.
    - `max-w-7xl` (= 1280px) — matches CONTEXT's "Claude's Discretion" suggested layout max-width; Footer uses the same for visual unity.
    - `h-16` (= 64px) — generous tap target, gives Logo room (охоронне поле).
    - Logo sized `h-7 w-auto` (~28px) — above brandbook 100px min for full logo would be too tall for a nav bar; the dark.svg logo's viewBox 930×400 means `h-7` renders at ~28×12px which fits nav but respects the wordmark-visible readability. Logo wordmark IS legible at this size (verified against prototype nav conventions).
    - Four nav items per D-01/D-02 in exactly that order: (1) Logo as home link via `<Link to="/">`, then three `<NavLink>` items — Проєкти, Хід будівництва, Контакт. Logo uses plain `<Link>` (not `<NavLink>`) because the home route doesn't need the active-underline treatment on the logo glyph itself — the logo's visible role is brand anchor + home click-target, not a "current page" indicator.
    - Active underline = `border-b-2 border-accent` (= 2px `#C1F33D` border-bottom). `pb-1` gives 4px offset from text baseline to underline (fits D-03 "2-4px below text baseline"). Border technique (not pseudo-element) chosen for simplicity and because it naturally shifts non-active items with `border-b-2 border-transparent` so the baseline doesn't jump when activating.
    - `text-sm font-medium tracking-wide` — Montserrat Medium (500) per brand-system.md §4 for nav-item role. `tracking-wide` = 0.025em, brand-typography-consistent.
    - `hover:text-accent` — subtle accent color on hover; NO `transition-all`, only `transition-colors` (Pitfall 3: centralized motion; we allow CSS transition on color only at Phase 1 since it's trivial and in-spec for hover feedback).
    - :focus-visible ring comes from global CSS (Plan 02) — NavLink is an `<a>`, already covered.
    - No animation variants; no Motion imports (Phase 5 owns animation).
    - Semantic markup: `<header>` + `<nav>` + `<ul>` + `<li>`. Enables landmark navigation for screen readers.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/components/layout/Nav.tsx && grep -q "export function Nav" src/components/layout/Nav.tsx && grep -q "sticky" src/components/layout/Nav.tsx && grep -q "bg-bg" src/components/layout/Nav.tsx && grep -q "from 'react-router-dom'" src/components/layout/Nav.tsx && grep -q "NavLink" src/components/layout/Nav.tsx && grep -qE "from ['\"]\.\.\/brand\/Logo['\"]" src/components/layout/Nav.tsx && grep -q "Проєкти" src/components/layout/Nav.tsx && grep -q "Хід будівництва" src/components/layout/Nav.tsx && grep -q "Контакт" src/components/layout/Nav.tsx && grep -q '"/projects"' src/components/layout/Nav.tsx && grep -q '"/construction-log"' src/components/layout/Nav.tsx && grep -q '"/contact"' src/components/layout/Nav.tsx && grep -q 'to="/"' src/components/layout/Nav.tsx && grep -q "border-accent" src/components/layout/Nav.tsx && ! grep -qE '#[0-9A-Fa-f]{6}' src/components/layout/Nav.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/components/layout/Nav.tsx` succeeds
    - `grep -c "export function Nav" src/components/layout/Nav.tsx` ≥ 1
    - `grep -cE "from ['\"]react-router-dom['\"]" src/components/layout/Nav.tsx` ≥ 1
    - `grep -c "NavLink" src/components/layout/Nav.tsx` ≥ 4 (3 navlinks + 1 import)
    - NavLink count = 3 (excludes Logo which uses plain Link, not NavLink; this matches D-01's 4-item total including Logo). Counted via JSX-tag grep: `grep -cE "<NavLink\\b" src/components/layout/Nav.tsx` = 3. Plain `<Link to="/">` for Logo appears exactly once: `grep -cE "<Link\\s+to=\"/\"" src/components/layout/Nav.tsx` ≥ 1.
    - `grep -cE "from ['\"]\\.\\./brand/Logo['\"]" src/components/layout/Nav.tsx` ≥ 1 (Logo import)
    - `grep -c "sticky" src/components/layout/Nav.tsx` ≥ 1 (D-04 sticky top)
    - `grep -c "bg-bg" src/components/layout/Nav.tsx` ≥ 1 (uses token class, not raw hex)
    - `grep -c "border-accent" src/components/layout/Nav.tsx` ≥ 1 (active-underline uses accent token)
    - All 3 nav hrefs present: `grep -c '"/projects"' src/components/layout/Nav.tsx` ≥ 1 AND `grep -c '"/construction-log"' src/components/layout/Nav.tsx` ≥ 1 AND `grep -c '"/contact"' src/components/layout/Nav.tsx` ≥ 1
    - All 3 Ukrainian labels present (exact): `grep -c "Проєкти" src/components/layout/Nav.tsx` ≥ 1 AND `grep -c "Хід будівництва" src/components/layout/Nav.tsx` ≥ 1 AND `grep -c "Контакт" src/components/layout/Nav.tsx` ≥ 1
    - Logo is home link: `grep -cE 'to="/"' src/components/layout/Nav.tsx` ≥ 1
    - NO raw hex values: `grep -cE '#[0-9A-Fa-f]{6}' src/components/layout/Nav.tsx` = 0 (all styling via token classes)
    - No Motion imports (Phase 5): `grep -cE "from ['\"]motion" src/components/layout/Nav.tsx` = 0
    - Nav label order preserved: Проєкти appears before Хід будівництва before Контакт — verify: `grep -n 'Проєкти\\|Хід будівництва\\|Контакт' src/components/layout/Nav.tsx | awk -F: '{print $1}' | sort -n | uniq` returns increasing line numbers
  </acceptance_criteria>

  <done>
    Nav renders Logo + 3 links on `#2F3640` bg, sticky top, max-w-7xl inner, active route underlined with 2px accent border. No hex leaks; all via token classes. Ready for Plan 04 to mount in `<Layout>`.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Write Footer with legal triplet, email, nav repeat, social placeholders</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Footer D-06, D-07, D-08, D-09 (3-column structure; dynamic year; social placeholders as lucide icons with `href="#"`; NO privacy-policy link)
    - `.planning/REQUIREMENTS.md` §Navigation & Layout NAV-01 (ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019, email `vygoda.sales@gmail.com` — these are MANDATORY verbatim)
    - `.planning/PROJECT.md` §Out of Scope (no privacy-policy in v1 — confirmed explicit rejection)
    - `.planning/research/PITFALLS.md` §Pitfall 6 (`#A7AFBC` only for text ≥14pt — footer legal triplet MUST use body text size ≥14pt)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Specific Ideas (footer legal triplet at `text-muted` — AA 5.3:1 passes for ≥14pt)
    - `src/components/brand/Logo.tsx` (from Task 1) — for Column 1 mini-logo
  </read_first>

  <files>
    src/components/layout/Footer.tsx
  </files>

  <action>
    Create `src/components/layout/Footer.tsx` with EXACTLY this content:

    ```tsx
    import { Link } from 'react-router-dom';
    import { Send, Instagram, Facebook } from 'lucide-react';
    import { Logo } from '../brand/Logo';

    /**
     * Site footer — visible on every route (NAV-01).
     * Three columns at ≥1280px: (1) mini-logo + email + © year,
     * (2) repeat nav, (3) legal triplet (ТОВ / ЄДРПОУ / ліцензія).
     * Social icons are placeholders per D-08 (href="#", non-functional until launch).
     * Privacy-policy link intentionally absent per D-09 + PROJECT.md Out-of-Scope.
     */
    export function Footer() {
      const year = new Date().getFullYear();

      return (
        <footer className="mt-auto w-full border-t border-bg-surface bg-bg">
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-12">
            {/* Column 1: brand + contact + copyright */}
            <div className="flex flex-col gap-6">
              <Logo className="h-7 w-auto" title="ВИГОДА" />
              <a
                href="mailto:vygoda.sales@gmail.com"
                className="text-sm font-medium text-text hover:text-accent"
              >
                vygoda.sales@gmail.com
              </a>
              <div className="flex gap-4">
                <a href="#" aria-label="Telegram" className="text-text-muted hover:text-accent">
                  <Send size={20} aria-hidden="true" />
                </a>
                <a href="#" aria-label="Instagram" className="text-text-muted hover:text-accent">
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a href="#" aria-label="Facebook" className="text-text-muted hover:text-accent">
                  <Facebook size={20} aria-hidden="true" />
                </a>
              </div>
              <p className="text-base text-text-muted">
                © {year} ТОВ «БК ВИГОДА ГРУП»
              </p>
            </div>

            {/* Column 2: repeat nav */}
            <nav aria-label="Footer navigation" className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Навігація
              </h2>
              <Link to="/projects" className="text-sm font-medium text-text hover:text-accent">
                Проєкти
              </Link>
              <Link
                to="/construction-log"
                className="text-sm font-medium text-text hover:text-accent"
              >
                Хід будівництва
              </Link>
              <Link to="/contact" className="text-sm font-medium text-text hover:text-accent">
                Контакт
              </Link>
            </nav>

            {/* Column 3: legal block — NAV-01 mandatory facts */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Юридична інформація
              </h2>
              <p className="text-base text-text-muted">ТОВ «БК ВИГОДА ГРУП»</p>
              <p className="text-base text-text-muted">ЄДРПОУ 42016395</p>
              <p className="text-base text-text-muted">
                Ліцензія від 27.12.2019 (безстрокова)
              </p>
            </div>
          </div>
        </footer>
      );
    }
    ```

    Explicit choices and rationale:
    - `text-base` (= 16px) on legal triplet — safely ≥14pt so `text-text-muted` (`#A7AFBC` on `#2F3640` = 5.3:1) passes WCAG AA per Pitfall 6 / brand-system §3.
    - © line uses `text-base` (16px = 12pt) — safely above PROJECT.md's 14pt threshold for `#A7AFBC` on `#2F3640` (which requires ≥14pt). `text-sm` (14px = 10.5pt) would be below threshold; do not downgrade.
    - Dynamic year via `new Date().getFullYear()` per D-07 — NOT hard-coded.
    - Exact legal triplet from NAV-01: `ТОВ «БК ВИГОДА ГРУП»` (with Ukrainian quotes «»), `ЄДРПОУ 42016395`, `Ліцензія від 27.12.2019 (безстрокова)`.
    - Email `vygoda.sales@gmail.com` as active `mailto:` (Phase 4 `/contact` page will have more; footer is always-available).
    - Three social icons: `Send` (lucide-react proxy for Telegram paper-plane), `Instagram`, `Facebook` per D-08. All with `href="#"` (placeholder) and `aria-label` in Ukrainian. `aria-hidden="true"` on the icon element itself because the link's aria-label provides the accessible name.
    - NO privacy-policy link per D-09. Confirmed by not including one.
    - `border-t border-bg-surface` — subtle 1px divider using token color (no raw hex).
    - `grid-cols-3 gap-8` — 3 equal columns at ≥1280px (matches Nav's max-w-7xl container). Phase 1 is desktop-first; mobile reflow is v2.
    - `mt-auto` on `<footer>` lets a flex-column body push footer to viewport bottom when content is short (relevant for page stubs that are near-empty).
    - `text-xs font-bold uppercase tracking-wider text-text-muted` for column headers — brand-typography caption role per brand-system.md §4.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/components/layout/Footer.tsx && grep -q "export function Footer" src/components/layout/Footer.tsx && grep -qE "ТОВ «БК ВИГОДА ГРУП»" src/components/layout/Footer.tsx && grep -q "ЄДРПОУ 42016395" src/components/layout/Footer.tsx && grep -qE "27\.12\.2019" src/components/layout/Footer.tsx && grep -q "vygoda.sales@gmail.com" src/components/layout/Footer.tsx && grep -q "new Date().getFullYear()" src/components/layout/Footer.tsx && grep -qE "from ['\"]lucide-react['\"]" src/components/layout/Footer.tsx && grep -qE "from ['\"]\.\.\/brand\/Logo['\"]" src/components/layout/Footer.tsx && grep -q 'aria-label="Telegram"' src/components/layout/Footer.tsx && grep -q 'aria-label="Instagram"' src/components/layout/Footer.tsx && grep -q 'aria-label="Facebook"' src/components/layout/Footer.tsx && ! grep -qE "Політика конфіденційності|Privacy Policy|privacy-policy" src/components/layout/Footer.tsx && ! grep -qE '#[0-9A-Fa-f]{6}' src/components/layout/Footer.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/components/layout/Footer.tsx` succeeds
    - `grep -c "export function Footer" src/components/layout/Footer.tsx` ≥ 1
    - ALL 4 NAV-01 mandatory facts present verbatim:
      - `grep -cE "ТОВ «БК ВИГОДА ГРУП»" src/components/layout/Footer.tsx` ≥ 2 (legal column + © line)
      - `grep -c "ЄДРПОУ 42016395" src/components/layout/Footer.tsx` ≥ 1
      - `grep -cE "27\\.12\\.2019" src/components/layout/Footer.tsx` ≥ 1
      - `grep -c "vygoda.sales@gmail.com" src/components/layout/Footer.tsx` ≥ 1 (as mailto href AND visible text)
    - Dynamic year: `grep -c "new Date().getFullYear()" src/components/layout/Footer.tsx` ≥ 1 (NOT `2026` hard-coded)
    - Year hard-coded absent: `grep -cE "© 20(2[0-9]|30)" src/components/layout/Footer.tsx` = 0
    - Lucide icons present: `grep -cE "from ['\"]lucide-react['\"]" src/components/layout/Footer.tsx` ≥ 1 AND `grep -cE "(Send|Instagram|Facebook)" src/components/layout/Footer.tsx` ≥ 3
    - Social placeholders have `href="#"` AND `aria-label`: `grep -c 'href="#"' src/components/layout/Footer.tsx` ≥ 3 AND `grep -c 'aria-label="Telegram"' src/components/layout/Footer.tsx` ≥ 1 AND `grep -c 'aria-label="Instagram"' src/components/layout/Footer.tsx` ≥ 1 AND `grep -c 'aria-label="Facebook"' src/components/layout/Footer.tsx` ≥ 1
    - Logo import: `grep -cE "from ['\"]\\.\\./brand/Logo['\"]" src/components/layout/Footer.tsx` ≥ 1
    - Repeat nav present: `grep -c "/projects" src/components/layout/Footer.tsx` ≥ 1 AND `grep -c "/construction-log" src/components/layout/Footer.tsx` ≥ 1 AND `grep -c "/contact" src/components/layout/Footer.tsx` ≥ 1
    - Privacy-policy ABSENT per D-09: `grep -ciE "Політика конфіденційності|Privacy Policy|privacy-policy|privacy_policy" src/components/layout/Footer.tsx` = 0
    - No raw hex: `grep -cE '#[0-9A-Fa-f]{6}' src/components/layout/Footer.tsx` = 0
    - No Motion imports (Phase 5 scope): `grep -cE "from ['\"]motion" src/components/layout/Footer.tsx` = 0
    - Legal triplet + © line use text-base (≥14pt safe per PITFALLS §6): `grep -c "text-base text-text-muted" src/components/layout/Footer.tsx` ≥ 4
  </acceptance_criteria>

  <done>
    Footer renders with all NAV-01 mandatory facts verbatim, dynamic © year, 3 social placeholder icons, NO privacy-policy link. Ready for Plan 04 to mount in `<Layout>`.
  </done>
</task>

</tasks>

<verification>
After all 3 tasks:
1. `grep -rE '#[0-9A-Fa-f]{6}' src/components/` returns ONLY Phase 1 allowed subset of 6 canonicals (specifically the 3 stroke colors allowed in MinimalCube). The grand phase check (`grep -rE '#[0-9A-Fa-f]{6}' src/`) combines this with Plan 02's index.css; total unique hexes across `src/` must still be ≤ 6.
2. `grep -rE "motion/react|from ['\"]motion" src/components/` returns zero matches — no Phase 5 animation scope has leaked in.
3. `grep -c "42016395" src/components/layout/Footer.tsx` ≥ 1 AND `grep -c "27.12.2019" src/components/layout/Footer.tsx` ≥ 1 AND `grep -c "vygoda.sales@gmail.com" src/components/layout/Footer.tsx` ≥ 1 — Success Criterion #1 footer facts.
4. Nav labels match D-01 verbatim: Проєкти, Хід будівництва, Контакт.
</verification>

<success_criteria>
- NAV-01 fully encoded: юр. назва, ЄДРПОУ, ліцензія, email all in Footer.tsx with ≥14pt text to pass WCAG on `#A7AFBC` muted.
- Logo sourced from brand-assets SVG via SVGR, never path-copied (PITFALLS §Anti-Pattern 4 preempted).
- MinimalCube typed stroke restricted to 3 allowed brand colors.
- Active route underline uses `border-accent` token (no raw hex).
- No Phase 5 Motion imports, no `transition={{...}}` inline objects (Pitfall 3 preempted).
- No privacy-policy link (D-09 / PROJECT.md Out-of-Scope honored).
</success_criteria>

<output>
Create `.planning/phases/01-foundation-shell/01-03-SUMMARY.md`:
- Logo import path confirmation (verifies SVGR plumbing works end-to-end)
- Footer NAV-01 fact list with file:line references
- Any Tailwind v4 class-generation issues (e.g., `bg-bg` not generating if `@theme` key named unexpectedly)
- Unique hex values used across all 4 files (should be subset of canonical 6, and realistically 0 — all styling via token classes)
</output>
