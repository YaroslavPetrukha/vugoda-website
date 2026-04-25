---
phase: 03-brand-primitives-home-page
plan: 8
type: execute
wave: 3
depends_on: ["03-01", "03-02", "03-03", "03-04", "03-05", "03-06", "03-07"]
files_modified:
  - src/pages/HomePage.tsx
  - src/pages/DevBrandPage.tsx
  - src/App.tsx
autonomous: true
requirements: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, VIS-03, VIS-04, ANI-01]
requirements_addressed: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, VIS-03, VIS-04, ANI-01]

must_haves:
  truths:
    - "`src/pages/HomePage.tsx` REPLACES the Phase 1 placeholder and composes 7 sections IN ORDER: Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm (Phase 3 D-17, Roadmap SC#2)"
    - "`src/pages/DevBrandPage.tsx` exists as the hidden QA surface showing all primitives standalone — Logo, Mark, Wordmark sample, IsometricCube 3 variants × 3 strokes × 2 opacities, IsometricGridBG @ opacity 0.10/0.20, 6-palette swatches, Montserrat weight ladder (D-25, Roadmap SC#5)"
    - "`src/App.tsx` registers `<Route path='dev/brand' element={<DevBrandPage />} />` ABOVE the catch-all `<Route path='*'>` (D-25); accessible via `/#/dev/brand`"
    - "`/dev/brand` is NOT linked from Nav (D-26) — production deploy hides it from navigation but ships the 5KB overhead"
    - "`npm run build` exits 0; `tsx scripts/check-brand.ts` PASS all 4 invariants; no inline transition={{}} literals introduced anywhere in src/components/sections/home/"
  artifacts:
    - path: "src/pages/HomePage.tsx"
      provides: "REPLACED Phase 1 stub. Composes 7 sections in canonical order."
      exports: ["default (HomePage)"]
    - path: "src/pages/DevBrandPage.tsx"
      provides: "Hidden QA surface — palette + typography + brand primitives showcase"
      exports: ["default (DevBrandPage)"]
      min_lines: 100
    - path: "src/App.tsx"
      provides: "Router with /dev/brand route added above catch-all"
      contains: 'path="dev/brand"'
  key_links:
    - from: "src/pages/HomePage.tsx"
      to: "src/components/sections/home/{Hero,BrandEssence,PortfolioOverview,ConstructionTeaser,MethodologyTeaser,TrustBlock,ContactForm}.tsx"
      via: "named imports — composes 7 sections"
      pattern: "from '../components/sections/home/"
    - from: "src/pages/DevBrandPage.tsx"
      to: "src/components/brand/{Logo,Mark,IsometricCube,IsometricGridBG}.tsx"
      via: "showcases primitives at multiple sizes/strokes/opacities"
      pattern: "from '../components/brand/"
    - from: "src/App.tsx"
      to: "src/pages/DevBrandPage.tsx"
      via: "<Route path='dev/brand'>"
      pattern: "path=\"dev/brand\""
---

<objective>
The final integration plan — REPLACE Phase 1's `HomePage.tsx` stub with the composed 7-section home page, ADD the hidden `/dev/brand` QA surface, and register its route in `App.tsx`. After this plan, all 10 Phase 3 requirements (HOME-01..07, VIS-03, VIS-04, ANI-01) are closed end-to-end.

Purpose: Wave 1-3 produced 4 brand primitives + 1 image pipeline + 7 home sections in isolation. Wave 4 wires them so `/` and `/dev/brand` actually render. This is the visible-from-outside change.

Output:
1. `src/pages/HomePage.tsx` (~25 lines) — replaces 12-line Phase 1 stub; imports + composes 7 sections in D-17 order
2. `src/pages/DevBrandPage.tsx` (~150 lines) — palette swatches + typography ladder + primitive matrix; not linked from Nav (D-26)
3. `src/App.tsx` — adds `<Route path='dev/brand' element={<DevBrandPage />} />` above the catch-all

Roadmap Success Criteria #1-#5 are achievable end-to-end after this plan.
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
Phase 1 placeholder HomePage.tsx (12 lines — REPLACED in this plan):
```tsx
import markUrl from '../../brand-assets/mark/mark.svg';
export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">ВИГОДА</h1>
        <img src={markUrl} alt="" aria-hidden="true" className="h-24 w-auto" />
      </div>
    </section>
  );
}
```

Section components produced by Wave 3 (verify all exist before composing):
- `src/components/sections/home/Hero.tsx` (Plan 03-04) — `export function Hero()`
- `src/components/sections/home/BrandEssence.tsx` (Plan 03-05) — `export function BrandEssence()`
- `src/components/sections/home/PortfolioOverview.tsx` (Plan 03-05) — `export function PortfolioOverview()`
- `src/components/sections/home/ConstructionTeaser.tsx` (Plan 03-06) — `export function ConstructionTeaser()`
- `src/components/sections/home/MethodologyTeaser.tsx` (Plan 03-06) — `export function MethodologyTeaser()`
- `src/components/sections/home/TrustBlock.tsx` (Plan 03-07) — `export function TrustBlock()`
- `src/components/sections/home/ContactForm.tsx` (Plan 03-07) — `export function ContactForm()`

Brand primitives produced by Wave 1:
- `src/components/brand/Logo.tsx` (Phase 1) — `export function Logo({ className, title })`
- `src/components/brand/Mark.tsx` (Plan 03-01) — `export function Mark({ className })`
- `src/components/brand/IsometricCube.tsx` (Plan 03-01) — `export function IsometricCube(props: IsometricCubeProps)`
- `src/components/brand/IsometricGridBG.tsx` (Plan 03-01) — `export function IsometricGridBG(props: IsometricGridBGProps)`

Existing `src/App.tsx` (lines 26-41):
```tsx
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="zhk/:slug" element={<ZhkPage />} />
          <Route path="construction-log" element={<ConstructionLogPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
```
Phase 3 inserts `<Route path="dev/brand" element={<DevBrandPage />} />` BETWEEN the `contact` route and the catch-all `*` route.

@theme palette (`src/index.css:9-15`) — DevBrandPage swatch table reads these:
```
--color-bg:          #2F3640
--color-bg-surface:  #3D3B43
--color-bg-black:    #020A0A
--color-accent:      #C1F33D
--color-text:        #F5F7FA
--color-text-muted:  #A7AFBC
```
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: REPLACE src/pages/HomePage.tsx with the composed 7-section page</name>
  <files>src/pages/HomePage.tsx</files>
  <read_first>
    - src/pages/HomePage.tsx (current Phase 1 placeholder — to be REPLACED entirely)
    - All 7 section files from Wave 3 (verify exports before composing — fail loudly if any missing)
    - 03-CONTEXT.md D-17 (section ordering: Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm)
    - .planning/ROADMAP.md Phase 3 Success Criteria #2 (lists the same 7 sections — authoritative order)
  </read_first>
  <behavior>
    - Test 1: file exports `default` function (default export — matches Phase 1 pattern; App.tsx imports `import HomePage from './pages/HomePage'`)
    - Test 2: imports the 7 section components by named import from `'../components/sections/home/{Hero,BrandEssence,PortfolioOverview,ConstructionTeaser,MethodologyTeaser,TrustBlock,ContactForm}'`
    - Test 3: returns a fragment OR a wrapping element rendering 7 sections IN ORDER per D-17
    - Test 4: file does NOT contain `<img src={markUrl}>` literal (Phase 1 placeholder removed)
    - Test 5: file does NOT contain inline section copy — composition only
    - Test 6: file does NOT contain `transition={{`
    - Test 7: HomePage renders to a single React element with no extra wrapper that would break Layout's `<Outlet>` (the Layout already wraps in `<main>` if applicable — verify via reading layout/Layout.tsx)
  </behavior>
  <action>
    REPLACE the entire content of `src/pages/HomePage.tsx` with:

    ```
    /**
     * @module pages/HomePage
     *
     * Composes the 7 home sections in canonical Phase 3 D-17 order:
     *   Hero → BrandEssence → PortfolioOverview → ConstructionTeaser
     *        → MethodologyTeaser → TrustBlock → ContactForm.
     *
     * Closes HOME-01..07 + VIS-03 + VIS-04 + ANI-01 by virtue of the
     * sections it composes. Each section is self-contained and reads
     * its own data from src/data/ + src/content/ — no cross-section state.
     *
     * Phase 5 will wrap each section with <RevealOnScroll> for ANI-02; this
     * file leaves the sections wrapper-free per Phase 3 deferred scope.
     */

    import { Hero } from '../components/sections/home/Hero';
    import { BrandEssence } from '../components/sections/home/BrandEssence';
    import { PortfolioOverview } from '../components/sections/home/PortfolioOverview';
    import { ConstructionTeaser } from '../components/sections/home/ConstructionTeaser';
    import { MethodologyTeaser } from '../components/sections/home/MethodologyTeaser';
    import { TrustBlock } from '../components/sections/home/TrustBlock';
    import { ContactForm } from '../components/sections/home/ContactForm';

    export default function HomePage() {
      return (
        <>
          <Hero />
          <BrandEssence />
          <PortfolioOverview />
          <ConstructionTeaser />
          <MethodologyTeaser />
          <TrustBlock />
          <ContactForm />
        </>
      );
    }
    ```

    Implementation notes:
    - Default export preserved — `App.tsx` line 3 has `import HomePage from './pages/HomePage'`. Changing to a named export would break the import.
    - React fragment `<>...</>` wraps the sections — Layout.tsx already provides Nav + `<Outlet>` + Footer; no extra wrapper needed.
    - Order MUST match D-17 EXACTLY. Roadmap SC#2 is the assertion.
    - This commit DELETES the Phase 1 `<img src={markUrl}>` placeholder — the mark.svg is preserved as a brand asset (Phase 3 D-28 wraps it in `<Mark>` for DevBrandPage; HOME does NOT consume it per D-11).
  </action>
  <verify>
    <automated>grep -cE "import \{ Hero \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ BrandEssence \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ PortfolioOverview \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ ConstructionTeaser \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ MethodologyTeaser \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ TrustBlock \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "import \{ ContactForm \}" src/pages/HomePage.tsx &amp;&amp; grep -cE "export default function HomePage" src/pages/HomePage.tsx &amp;&amp; ! grep -nE "markUrl" src/pages/HomePage.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/pages/HomePage.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    HomePage.tsx replaced; 7 section imports present, default export preserved, no Phase 1 placeholder code remaining. `npm run lint` exits 0. Section render order matches D-17.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/pages/DevBrandPage.tsx</name>
  <files>src/pages/DevBrandPage.tsx</files>
  <read_first>
    - src/components/brand/Logo.tsx (Phase 1 — `export function Logo({ className, title })`)
    - src/components/brand/Mark.tsx (Plan 03-01 — `export function Mark({ className })`)
    - src/components/brand/IsometricCube.tsx (Plan 03-01 — `export function IsometricCube(props)`)
    - src/components/brand/IsometricGridBG.tsx (Plan 03-01 — `export function IsometricGridBG(props)`)
    - 03-CONTEXT.md D-25 (DevBrandPage scope: palette, typography ladder, all primitives, IsometricGridBG @ 0.10/0.20)
    - 03-RESEARCH.md lines 779-789 (minimum viable content list — copy structurally)
    - 03-RESEARCH.md lines 1352 (Open Question 7 — recommendation: primitives only, no sample compositions)
    - src/index.css (palette CSS vars to display in swatch table)
  </read_first>
  <behavior>
    - Test 1: file exports `default` function `DevBrandPage`
    - Test 2: imports `Logo`, `Mark` from `'../components/brand/Logo'` and `'../components/brand/Mark'`
    - Test 3: imports `IsometricCube`, `IsometricGridBG` from their respective files
    - Test 4: file renders ALL of:
      - 6-color palette swatch grid (one card per hex from `--color-bg`/`--color-bg-surface`/`--color-bg-black`/`--color-accent`/`--color-text`/`--color-text-muted` with hex value + token name visible)
      - Logo at 2 sizes (e.g. nav-size 56px and hero-size 200px)
      - Mark at 96px
      - Wordmark sample: H1 «ВИГОДА» at large display size (~120-180px)
      - IsometricCube matrix: 3 variants × 3 strokes (`#A7AFBC`, `#F5F7FA`, `#C1F33D`) × 2 opacities (0.3, 0.6) — 18 cubes total
      - IsometricGridBG side-by-side at opacity 0.10 and 0.20 (in 2 dark rectangles)
      - Montserrat weight ladder: 400/500/700 at sizes 14/16/20/24/40/56/80/180px
    - Test 5: file does NOT consume `flagship`/`pipelineGridProjects`/`brandValues`/data — it's atoms-only (Open Question 7 recommendation)
    - Test 6: NO `transition={{`
    - Test 7: section h2 labels use short literals («Палітра», «Типографіка», «Лого», «Куб», «Сітка») — short Cyrillic ≤15 chars, allowed inline
  </behavior>
  <action>
    CREATE file `src/pages/DevBrandPage.tsx`:

    ```
    /**
     * @module pages/DevBrandPage
     *
     * Hidden QA surface (D-25, D-26) — accessible via /#/dev/brand,
     * NOT linked from Nav. Showcases all brand primitives standalone for
     * pixel-level visual QA before client demo.
     *
     * Scope per RESEARCH Open Question 7: primitives ONLY (atoms).
     * Sample compositions (real flagship/pipeline cards) are Phase 4's
     * /dev/grid responsibility.
     */

    import { Logo } from '../components/brand/Logo';
    import { Mark } from '../components/brand/Mark';
    import { IsometricCube } from '../components/brand/IsometricCube';
    import { IsometricGridBG } from '../components/brand/IsometricGridBG';

    /** 6 brandbook hexes — order matches @theme block in src/index.css */
    const PALETTE = [
      { token: '--color-bg',          hex: '#2F3640', name: 'bg' },
      { token: '--color-bg-surface',  hex: '#3D3B43', name: 'bg-surface' },
      { token: '--color-bg-black',    hex: '#020A0A', name: 'bg-black' },
      { token: '--color-accent',      hex: '#C1F33D', name: 'accent' },
      { token: '--color-text',        hex: '#F5F7FA', name: 'text' },
      { token: '--color-text-muted',  hex: '#A7AFBC', name: 'text-muted' },
    ] as const;

    /** Type-size ladder for Montserrat weight matrix */
    const TYPE_SIZES = [14, 16, 20, 24, 40, 56, 80, 180] as const;
    const WEIGHTS = [
      { weight: 400, label: 'Regular' },
      { weight: 500, label: 'Medium' },
      { weight: 700, label: 'Bold' },
    ] as const;

    /** Allowed cube strokes (matches IsometricCubeProps['stroke']) */
    const STROKES = ['#A7AFBC', '#F5F7FA', '#C1F33D'] as const;
    const OPACITIES = [0.3, 0.6] as const;

    export default function DevBrandPage() {
      return (
        <div className="mx-auto max-w-7xl px-6 py-24 text-text">
          <h1 className="mb-12 font-bold text-4xl">/dev/brand</h1>
          <p className="mb-24 max-w-3xl text-base text-text-muted">
            Hidden QA surface. Not linked from Nav. Showcases brand primitives
            for visual regression checks. Phase 3 D-25.
          </p>

          {/* === Palette === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Палітра</h2>
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
              {PALETTE.map((c) => (
                <div key={c.token} className="flex flex-col gap-2">
                  <div
                    className="h-32 w-full border border-bg-surface"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-sm text-text">{c.name}</span>
                  <span className="text-xs text-text-muted">{c.hex}</span>
                </div>
              ))}
            </div>
          </section>

          {/* === Typography === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Типографіка</h2>
            <div className="flex flex-col gap-12">
              {WEIGHTS.map(({ weight, label }) => (
                <div key={weight} className="flex flex-col gap-3 border-l-2 border-bg-surface pl-4">
                  <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                    Montserrat {weight} · {label}
                  </span>
                  {TYPE_SIZES.map((px) => (
                    <span
                      key={px}
                      style={{ fontWeight: weight, fontSize: `${px}px`, lineHeight: 1.2 }}
                    >
                      {px}px — ВИГОДА
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* === Logo === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Лого (dark.svg)</h2>
            <div className="flex flex-wrap items-end gap-12 bg-bg-surface p-8">
              <Logo className="h-14 w-auto" />
              <Logo className="h-48 w-auto" />
            </div>
          </section>

          {/* === Mark === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Знак (mark.svg)</h2>
            <div className="bg-bg-surface p-8">
              <Mark className="h-24 w-auto" />
            </div>
          </section>

          {/* === Wordmark sample === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Wordmark (H1 hero scale)</h2>
            <div className="bg-bg-surface p-8">
              <h1 className="font-bold uppercase tracking-tight text-[clamp(80px,8vw,180px)] leading-none text-text">
                ВИГОДА
              </h1>
            </div>
          </section>

          {/* === IsometricCube matrix: 3 variants × 3 strokes × 2 opacities === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">Куб — 3 варіанти × 3 кольори × 2 непрозорості</h2>
            {(['single', 'group', 'grid'] as const).map((variant) => (
              <div key={variant} className="mb-8">
                <h3 className="mb-4 font-medium text-sm uppercase tracking-wider text-text-muted">
                  variant=&quot;{variant}&quot;
                </h3>
                <div className="grid grid-cols-3 gap-4 bg-bg-surface p-6">
                  {STROKES.map((stroke) =>
                    OPACITIES.map((opacity) => (
                      <div key={`${stroke}-${opacity}`} className="flex flex-col items-center gap-2">
                        <div className="h-32 w-32">
                          <IsometricCube
                            variant={variant}
                            stroke={stroke}
                            opacity={opacity}
                            className="h-full w-full"
                          />
                        </div>
                        <span className="text-xs text-text-muted">
                          {stroke} · {opacity}
                        </span>
                      </div>
                    )),
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* === IsometricGridBG @ 0.10 and 0.20 === */}
          <section className="mb-24">
            <h2 className="mb-8 font-bold text-2xl">IsometricGridBG (opacity 0.10 / 0.20)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 overflow-hidden bg-bg-black">
                <IsometricGridBG opacity={0.1} className="h-full w-full" />
                <span className="absolute bottom-2 left-2 text-xs text-text-muted">
                  opacity 0.10
                </span>
              </div>
              <div className="relative h-64 overflow-hidden bg-bg-black">
                <IsometricGridBG opacity={0.2} className="h-full w-full" />
                <span className="absolute bottom-2 left-2 text-xs text-text-muted">
                  opacity 0.20
                </span>
              </div>
            </div>
          </section>
        </div>
      );
    }
    ```

    Implementation notes:
    - The `style={{ backgroundColor: c.hex }}` and `style={{ fontWeight: weight, fontSize: `${px}px` }}` use inline style for the swatch + ladder DEMOS — this DEMO surface needs to display the actual hex/weight values, so JSX template-literal inline style is necessary. NOT a brand violation: the values come from a const array (`PALETTE`) whose entries are already inside the 6-canonical palette (check-brand `paletteWhitelist` matches the same 6).
    - The cube matrix renders 18 cubes total (3 × 3 × 2). At small `h-32 w-32` (128px) the `grid` variant via `IsometricGridBG` may not have a meaningful tile pattern at that scale — that's OK; consumers can still see the wrapper renders without crashing.
    - `&quot;{variant}&quot;` HTML entity for embedded quotes inside JSX text — TS-React lint-clean.
    - The `as const` arrays let TS narrow the union types when passed as `variant` / `stroke` props.
    - DO NOT add a Nav link to /dev/brand — D-26 says hidden, direct-URL only.
  </action>
  <verify>
    <automated>test -f src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "import \{ Logo \}" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "import \{ Mark \}" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "import \{ IsometricCube \}" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "import \{ IsometricGridBG \}" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "export default function DevBrandPage" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "Палітра" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "Типографіка" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "Montserrat" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#A7AFBC" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#F5F7FA" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#C1F33D" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#2F3640" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#3D3B43" src/pages/DevBrandPage.tsx &amp;&amp; grep -cE "#020A0A" src/pages/DevBrandPage.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/pages/DevBrandPage.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    DevBrandPage.tsx exists with palette swatch grid (all 6 hexes), Montserrat weight ladder (3 weights × 8 sizes), Logo at 2 sizes, Mark at 96px, Wordmark hero sample, IsometricCube 3×3×2 matrix, IsometricGridBG side-by-side at 0.10/0.20. `npm run lint` exits 0. `tsx scripts/check-brand.ts paletteWhitelist` PASS (the 6 hexes are subset of canonical palette).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Register /dev/brand route in src/App.tsx</name>
  <files>src/App.tsx</files>
  <read_first>
    - src/App.tsx (current 41 lines)
    - 03-CONTEXT.md D-25 (route registration + D-26 hidden-from-Nav rule)
    - 03-RESEARCH.md lines 760-776 (route registration recipe; HashRouter behavior on refresh)
  </read_first>
  <action>
    EDIT `src/App.tsx`. Two surgical changes:

    Change 1 — Add lazy import OR eager import for DevBrandPage. Use eager (matches Phase 1 pattern; <5KB overhead per D-26 + RESEARCH §H recommendation):

    Insert at the top of the imports list (after existing page imports, BEFORE `NotFoundPage`):
    ```
    import DevBrandPage from './pages/DevBrandPage';
    ```

    Change 2 — Insert the route. Inside the `<Route element={<Layout />}>` block, AFTER the `contact` route and BEFORE the catch-all `*` route:
    ```
    <Route path="dev/brand" element={<DevBrandPage />} />
    ```

    Final state of `src/App.tsx` (verbatim):

    ```
    import { HashRouter, Routes, Route } from 'react-router-dom';
    import { Layout } from './components/layout/Layout';
    import HomePage from './pages/HomePage';
    import ProjectsPage from './pages/ProjectsPage';
    import ZhkPage from './pages/ZhkPage';
    import ConstructionLogPage from './pages/ConstructionLogPage';
    import ContactPage from './pages/ContactPage';
    import DevBrandPage from './pages/DevBrandPage';
    import NotFoundPage from './pages/NotFoundPage';

    /**
     * Router root. Uses HashRouter per DEP-03 — GH Pages static server has no
     * SPA fallback; hash routing eliminates the 404-on-hard-refresh class
     * without needing a public/404.html redirect shim.
     *
     * URLs:
     *   /#/                     → HomePage
     *   /#/projects             → ProjectsPage
     *   /#/zhk/:slug            → ZhkPage (Phase 4 adds slug resolution)
     *   /#/construction-log     → ConstructionLogPage
     *   /#/contact              → ContactPage
     *   /#/dev/brand            → DevBrandPage (Phase 3 D-25, hidden — not linked from Nav)
     *   /#/anything-else        → NotFoundPage
     *
     * Phase 5 will wrap the Outlet inside Layout.tsx with the route-transition
     * motion wrapper; nothing in App.tsx needs to change for that.
     */
    export default function App() {
      return (
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="zhk/:slug" element={<ZhkPage />} />
              <Route path="construction-log" element={<ConstructionLogPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="dev/brand" element={<DevBrandPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      );
    }
    ```

    Note: DevBrandPage is registered INSIDE the `<Route element={<Layout />}>` block — meaning `/dev/brand` ALSO renders Nav + Footer. This is acceptable for QA (helps verify Nav primitive at multiple route contexts) and matches the existing 5-route shell. If Plan 03-checker flags that QA surface should NOT show Nav, re-register outside the Layout wrapper (single-line edit).

    DO NOT add a `<NavLink to="/dev/brand">` in `src/components/layout/Nav.tsx` — D-26 explicitly says NOT linked from Nav.
  </action>
  <verify>
    <automated>grep -cE "import DevBrandPage from './pages/DevBrandPage'" src/App.tsx &amp;&amp; grep -cF 'path="dev/brand" element={<DevBrandPage />}' src/App.tsx &amp;&amp; grep -cF 'path="*" element={<NotFoundPage />}' src/App.tsx &amp;&amp; ! grep -nE "to=\"/dev/brand\"" src/components/layout/Nav.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    `src/App.tsx` imports DevBrandPage and registers `<Route path="dev/brand">` ABOVE the catch-all `<Route path="*">`. Nav.tsx contains no link to /dev/brand (hidden per D-26). `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0
2. `npm run build` exits 0 — full pipeline including:
   - prebuild: copy-renders + optimize-images
   - tsc --noEmit
   - vite build (produces `dist/` with optimized images + bundled JS)
   - postbuild: tsx scripts/check-brand.ts → 4/4 PASS
3. `tsx scripts/check-brand.ts` PASS specifically:
   - `denylistTerms` — no Pictorial/Rubikon
   - `paletteWhitelist` — only 6 canonical hexes (the literal array in DevBrandPage.tsx is whitelisted)
   - `placeholderTokens` — dist/ clean (no `{{`/`TODO`)
   - `importBoundaries` — components don't contain raw `/renders/` or `/construction/` literals
4. Manual visual QA at `npm run dev`:
   - `http://localhost:5173/#/` shows all 7 sections in D-17 order, hero parallax works, flagship loads from preload, all sections render with real data (no `undefined`, no broken images, no console errors)
   - `http://localhost:5173/#/dev/brand` shows palette + typography + logos + mark + wordmark + 18-cube matrix + 2-grid panels — all primitives visible, no palette drift
   - `http://localhost:5173/#/projects` (still placeholder from Phase 1) renders Layout but no /dev/brand link in Nav
5. Check Roadmap §"Phase 3" Success Criteria #1-#5 — all 5 should be visually verifiable on 1920×1080.
</verification>

<success_criteria>
- [ ] `src/pages/HomePage.tsx` REPLACED — composes 7 sections in D-17 order (Hero → BrandEssence → PortfolioOverview → ConstructionTeaser → MethodologyTeaser → TrustBlock → ContactForm)
- [ ] `src/pages/DevBrandPage.tsx` exists with palette + typography + brand-primitive matrix
- [ ] `src/App.tsx` has `<Route path="dev/brand" element={<DevBrandPage />} />` above catch-all
- [ ] No /dev/brand link in `src/components/layout/Nav.tsx` (D-26)
- [ ] `npm run build` exits 0; check-brand 4/4 PASS
- [ ] `npm run dev`: `/` renders all 7 sections; `/dev/brand` renders all primitives; both work via direct URL refresh (HashRouter)
- [ ] No `transition={{` in any new file
- [ ] All 10 Phase 3 requirements (HOME-01..07, VIS-03, VIS-04, ANI-01) end-to-end achievable on the running site
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-08-SUMMARY.md` documenting:
- HomePage composed; DevBrandPage shipped; /dev/brand route registered
- Phase 3 fully closed: HOME-01..07 + VIS-03 + VIS-04 + ANI-01 all end-to-end functional
- Roadmap §"Phase 3" Success Criteria 1-5 verification — note manual QA results at 1920×1080
- check-brand 4/4 PASS confirmed
- Bundle size delta (record from `vite build` output) — track against ≤200KB gzipped JS budget for Phase 6 horizon
- aerial-1920.{avif,webp,jpg} sizes — track against ≤200KB hero image budget
- Any deviations or issues for Phase 4 to inherit
</output>
</output>
