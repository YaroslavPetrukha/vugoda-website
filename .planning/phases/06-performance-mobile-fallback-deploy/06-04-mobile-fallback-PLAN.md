---
phase: 06-performance-mobile-fallback-deploy
plan: 04
type: execute
wave: 2
depends_on: [06-01-hooks-foundation, 06-02-content-and-og-svg]
files_modified:
  - src/components/layout/MobileFallback.tsx
  - src/components/layout/Layout.tsx
autonomous: true
requirements: [QA-01]
must_haves:
  truths:
    - "Viewport `<1024px` renders <MobileFallback> instead of <Outlet> AND hides Nav + Footer (D-03)"
    - "Viewport `≥1024px` renders the existing AnimatePresence + Outlet + Nav + Footer chain unchanged"
    - "/dev/brand and /dev/grid routes are EXEMPT from mobile fallback at all viewport sizes (D-07) — pathname.startsWith('/dev/') bypass"
    - "<MobileFallback> renders: <Logo dark> + «ВИГОДА» wordmark text + locked body copy + active mailto + 4 CTA links + juridical Footer-style block"
    - "3 internal CTA links use href='/#/{slug}' (HashRouter-compatible — clicking does navigate but on mobile re-renders the same fallback); 1 external Lakeview link opens in new tab with rel='noopener'"
    - "Mailto + all 4 CTAs preserve `:focus-visible` accent outline (Phase 1 D-21 — global rule auto-applies; component does not override)"
    - "AnimatePresence path is BYPASSED on mobile (D-03 — saves Motion-runtime path that mobile users never see; entire render returns <MobileFallback /> directly inside the bg-bg shell)"
  artifacts:
    - path: src/components/layout/MobileFallback.tsx
      provides: "QA-01 single-screen fallback page rendered on viewport <1024px (D-04 layout)"
      contains: "fallbackBody"
    - path: src/components/layout/Layout.tsx
      provides: "Viewport-conditional short-circuit: mobile branch returns <MobileFallback /> early; desktop branch unchanged"
      contains: "useMatchMedia"
  key_links:
    - from: "src/components/layout/Layout.tsx"
      to: "src/hooks/useMatchMedia.ts"
      via: "useMatchMedia('(max-width: 1023px)')"
      pattern: "useMatchMedia\\("
    - from: "src/components/layout/Layout.tsx"
      to: "src/components/layout/MobileFallback.tsx"
      via: "early-return JSX when isMobile && !isDevSurface"
      pattern: "<MobileFallback"
    - from: "src/components/layout/MobileFallback.tsx"
      to: "src/content/mobile-fallback.ts"
      via: "named imports of fallbackBody, fallbackEmail, fallbackCtas"
      pattern: "from '../../content/mobile-fallback'"
    - from: "src/components/layout/MobileFallback.tsx"
      to: "src/components/brand/Logo.tsx (existing Phase 1)"
      via: "<Logo /> render at top of fallback"
      pattern: "<Logo"
---

<objective>
Wire the QA-01 mobile-fallback flow end-to-end. Two files modified:

**1. New file `src/components/layout/MobileFallback.tsx`** — single-screen fallback page rendered when `useMatchMedia('(max-width: 1023px)')` returns true. Composition per CONTEXT D-04 ASCII-art layout:

```
┌─────────────────────────────────────┐
│        [Logo dark.svg ~120px]       │   (32px top margin)
│                                     │
│              ВИГОДА                  │   (Montserrat 700 ~48px wordmark text)
│                                     │
│   Сайт оптимізовано для екранів     │   (max-w-[20ch], text-text-muted #A7AFBC,
│   ≥1280px. Перегляньте на десктопі  │    ≥14pt for WCAG AA contrast on #2F3640)
│   або напишіть нам                  │
│                                     │
│   vygoda.sales@gmail.com            │   (mailto, accent #C1F33D)
│                                     │
│   ───────────────                   │   (40%-width divider, #A7AFBC opacity 0.2)
│                                     │
│   Проєкти →                         │   (4 stacked CTA links — internal x3 +
│   Хід будівництва →                 │    external x1; text-only; focus-visible
│   Контакт →                         │    accent underline; tab-navigable)
│   Перейти до Lakeview ↗             │
│                                     │
│   ТОВ «БК ВИГОДА ГРУП»              │   (single-column juridical block — no
│   ЄДРПОУ 42016395                   │    3-col Footer; Phase 1 D-21 contrast)
│   Ліцензія від 27.12.2019           │
└─────────────────────────────────────┘
```

Component imports content from `src/content/mobile-fallback.ts` (created in plan 06-02), `<Logo />` from `src/components/brand/Logo.tsx` (existing Phase 1), and juridical facts from `src/content/company.ts` (`legalName`, `edrpou`, `licenseDate`). Layout uses Tailwind utilities + `--spacing-rhythm-*` tokens; min-h-screen flex centering; max-w-[20ch] body text width per D-04.

**2. Edit `src/components/layout/Layout.tsx`** — add a viewport-conditional short-circuit at the TOP of the function body, BEFORE the existing AnimatePresence path:

- Read `useLocation().pathname` (already imported)
- Subscribe to `useMatchMedia('(max-width: 1023px)')` (new import from src/hooks/)
- Compute `isDevSurface = pathname.startsWith('/dev/')`
- If `isMobile && !isDevSurface` → return `<div className="flex min-h-screen flex-col bg-bg"><MobileFallback /></div>` directly. AnimatePresence + Nav + Footer are bypassed (D-03 — saves the Motion-runtime path mobile users never see).
- Otherwise → fall through to the existing desktop render (unchanged).

D-07 exemption: `/dev/brand` and `/dev/grid` are QA tooling that may be inspected on tablet sizes by developers; they pass through to real content.

**Why short-circuit replaces Outlet, NOT just style-hide it (D-02):** CSS-only `@media (max-width: 1023px) { .desktop { display: none } }` would still ship the entire desktop DOM tree to mobile browsers (waste) AND cannot semantically replace `<Outlet>` (the routes still mount, lazy chunks still attempt to load for /construction-log on a 414px iPhone, hero AVIF still preloads, etc.). JS short-circuit per D-02 is the correct design.

Output: 1 new component file (~80-100 lines including JSX + JSDoc), 1 file edited (~10 lines added to Layout.tsx).

NOTE: This plan does NOT delete or modify existing Phase 5 AnimatePresence/RM threading on the desktop path. The desktop render branch is preserved verbatim — only a new conditional branch is added above it.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@src/components/layout/Layout.tsx
@src/hooks/useMatchMedia.ts
@src/content/mobile-fallback.ts
@src/content/company.ts
@src/components/brand/Logo.tsx
@src/components/layout/Footer.tsx
</context>

<interfaces>
<!-- src/components/layout/Layout.tsx (existing — Phase 5 D-10..D-14) -->

```tsx
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { pageFade } from '../../lib/motionVariants';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : pageFade;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Nav />
      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div key={location.pathname} variants={variants} initial="hidden" animate="visible" exit="exit" className="flex flex-1 flex-col">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
```

<!-- src/hooks/useMatchMedia.ts (Wave 1 plan 06-01 created this) -->

```ts
import { useSyncExternalStore } from 'react';

export function useMatchMedia(query: string): boolean {
  // ... (subscribe / getSnapshot / getServerSnapshot)
}
```

<!-- src/content/mobile-fallback.ts (Wave 1 plan 06-02 created this) -->

Named exports:
- `fallbackBody: string` — «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам»
- `fallbackEmail: string` — «vygoda.sales@gmail.com»
- `fallbackCtas: ReadonlyArray<{ label: string; href: string; external: boolean }>` — 4 CTAs

<!-- src/content/company.ts (existing Phase 2) -->

Named exports include `legalName`, `edrpou`, `licenseDate`, `email`. Read this file before authoring MobileFallback to confirm the exact export names and string contents (the juridical block must match the desktop Footer's content for cross-route consistency).

<!-- src/components/brand/Logo.tsx (existing Phase 1 D-05) -->

Renders `brand-assets/logo/dark.svg` via vite-plugin-svgr. Accepts standard `<svg>` props (width, className, etc.). Used here at ~120px wide.

<!-- Tailwind v4 token references (read src/index.css before edits) -->

The site uses CSS variables from @theme:
- `bg-bg` → `#2F3640` (page bg)
- `text-text` → `#F5F7FA` (primary text)
- `text-text-muted` → `#A7AFBC` (secondary text — body + juridical block)
- `text-accent` / `bg-accent` → `#C1F33D` (mailto, focus underline)
- `--spacing-rhythm-*` tokens for vertical spacing

These are referenced by Tailwind utility classes (`text-text`, `text-text-muted`, `bg-bg`, etc.) — do NOT inline hex values in tsx files (paletteWhitelist will fail).
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/layout/MobileFallback.tsx (D-04 layout + D-06 hrefs)</name>
  <read_first>
    - src/content/mobile-fallback.ts (Wave 1 plan 06-02 — named exports to import)
    - src/content/company.ts (Phase 2 — `legalName`, `edrpou`, `licenseDate`, `email` exports for the juridical block)
    - src/components/brand/Logo.tsx (Phase 1 — confirm import path + props signature)
    - src/components/layout/Footer.tsx (Phase 1 — reference juridical-block render style; mobile fallback uses a single-column variant)
    - src/index.css (confirm Tailwind tokens: `bg-bg`, `text-text`, `text-text-muted`, `text-accent`)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-04 (ASCII-art layout verbatim)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-06 (4 CTA hrefs locked)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §Specifics §"Mobile fallback breakpoint precision" (no flicker on swap; 320/375/414/768 viewports tested at impl time)
  </read_first>
  <files>src/components/layout/MobileFallback.tsx</files>
  <action>
    Create new file `src/components/layout/MobileFallback.tsx` with this structure:

    ```tsx
    /**
     * @module components/layout/MobileFallback
     *
     * QA-01 mobile fallback page rendered when viewport <1024px (D-01..D-03).
     * Layout.tsx short-circuits to this component INSTEAD of <Outlet> AND
     * hides Nav + Footer (single-screen, self-contained per D-03).
     *
     * Layout (D-04 verbatim):
     *   - <Logo /> dark variant ~120px wide, 32px top margin
     *   - «ВИГОДА» wordmark text (Montserrat 700 ~48px, fill #F5F7FA via
     *     Tailwind token text-text)
     *   - Body copy (max-w-[20ch], text-text-muted #A7AFBC, ≥14pt for
     *     WCAG AA contrast on bg-bg #2F3640 per Phase 1 D-21 / brand-system §3)
     *   - Active mailto link (text-accent #C1F33D — never on light bg, ok
     *     on dark)
     *   - 40%-width divider (border-t border-text-muted/20 — uses opacity
     *     modifier to express the 0.2 alpha)
     *   - 4 CTA links stacked, focus-visible:focus rules global from Phase 1
     *     D-21; explicit underline on focus inherited
     *   - Juridical block (single-column — NOT the 3-col Footer treatment;
     *     reads legalName/edrpou/licenseDate/email from src/content/company)
     *
     * Tone (CONCEPT §2): стримано. No marketing claims. NO «view desktop
     * anyway» override per D-05 (terminal state).
     *
     * AnimatePresence is BYPASSED for this component (Layout.tsx D-03):
     * mobile users never load Motion's exit/enter animation runtime path,
     * saving ~3KB. This component is plain JSX + Tailwind — no Motion import.
     *
     * 4 CTA hrefs (D-06):
     *   - 3 internal `/#/{slug}` — navigate to same fallback at <1024px;
     *     desktop visits the right page directly
     *   - 1 external Lakeview — opens new tab with rel="noopener" (Phase 4
     *     HUB-02 pattern); Lakeview handles its own mobile responsive
     *
     * @rule IMPORT BOUNDARY: layout component. Imports from content/, brand/,
     *   nothing from pages/. content/mobile-fallback.ts is the locked copy SOT.
     */
    import { Logo } from '../brand/Logo';
    import { fallbackBody, fallbackEmail, fallbackCtas } from '../../content/mobile-fallback';
    import { legalName, edrpou, licenseDate } from '../../content/company';

    export function MobileFallback() {
      return (
        <main
          role="main"
          aria-label="Сайт оптимізовано для десктопа"
          className="flex min-h-screen flex-col items-center justify-between bg-bg px-6 py-8 text-center"
        >
          {/* Top stack: logo + wordmark + body + mailto + divider + CTAs */}
          <div className="flex w-full max-w-md flex-col items-center gap-6 pt-6">
            <Logo className="w-30 h-auto" aria-label="ВИГОДА" />

            <h1 className="font-bold text-5xl tracking-tight text-text" lang="uk">
              ВИГОДА
            </h1>

            <p className="max-w-[20ch] text-base leading-relaxed text-text-muted" lang="uk">
              {fallbackBody}
            </p>

            <a
              href={`mailto:${fallbackEmail}`}
              className="text-base font-medium text-accent underline-offset-4 hover:underline"
            >
              {fallbackEmail}
            </a>

            <div
              aria-hidden="true"
              className="h-px w-2/5 bg-text-muted/20"
            />

            <nav aria-label="Навігація сайту" className="flex w-full flex-col items-center gap-3">
              {fallbackCtas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-base font-medium text-text underline-offset-4 hover:underline"
                >
                  {cta.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom juridical block — single-column variant of Footer (D-04) */}
          <div className="mt-12 flex flex-col items-center gap-1 text-sm text-text-muted">
            <p>{legalName}</p>
            <p>ЄДРПОУ {edrpou}</p>
            <p>Ліцензія від {licenseDate}</p>
          </div>
        </main>
      );
    }
    ```

    Implementation notes:
    - **Logo width**: D-04 says «~120px wide»; `w-30` is Tailwind v4 default for `7.5rem` = 120px. If the project's Tailwind config does NOT have w-30 in the default scale, use `style={{ width: '120px' }}` inline OR `w-[120px]` arbitrary value. Verify against `src/index.css` @theme spacing scale during impl.
    - **Wordmark sizing**: D-04 says «~48px»; `text-5xl` ≈ 48px in Tailwind default scale. Confirm against project's @theme font-size scale at impl time; adjust to `text-[48px]` arbitrary if needed.
    - **Mailto + CTA focus styles**: Phase 1 D-21 ships a global `:focus-visible` rule (2px `#C1F33D` outline, 2px offset). Component does NOT override — inherits.
    - **Hex literals**: NONE inline in this file. All colors come from Tailwind token classes (`bg-bg`, `text-text`, `text-text-muted`, `text-accent`). paletteWhitelist gate scans .ts/.tsx for hex literals — this file ships ZERO hex literals, passes cleanly.
    - **Content imports**: `legalName`, `edrpou`, `licenseDate` are exported by `src/content/company.ts` (Phase 2 D-15). If the exact export names differ in the existing file, ALIGN to the existing names — read company.ts first and adjust the import + interpolation. This task is hard-blocked on company.ts having those (or equivalent) exports; if missing, file an issue rather than improvise.
    - **No Motion imports**: deliberate per D-03 — keeps the mobile bundle path Motion-free.

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero matches in the file)
    - Hex literals: NO `#XXXXXX` patterns in the JSX or doc-block (the doc-block mentions hex values in prose like `#A7AFBC` — paletteWhitelist scope is `*.{ts,tsx,css}` and ALL of those hexes are in the 6-canonical whitelist, so no false positive)
    - Wait — re-check: `#2F3640`, `#A7AFBC`, `#C1F33D`, `#F5F7FA` ARE in the whitelist. `#020A0A`, `#3D3B43` are also in the whitelist. ZERO non-whitelist hexes — verified.
    - Placeholder tokens: NO `{{...}}` patterns (verified — JSX uses `{cta.label}` single brace, doc-block uses `{slug}` single brace)
    - Inline transition: NO `transition={{` JSX prop (this component is plain JSX, no Motion)
    - Import boundaries: imports content/, brand/ — both allowed for layout components
  </action>
  <verify>
    <automated>test -f src/components/layout/MobileFallback.tsx && grep -q "export function MobileFallback" src/components/layout/MobileFallback.tsx && grep -q "fallbackBody" src/components/layout/MobileFallback.tsx && grep -q "fallbackEmail" src/components/layout/MobileFallback.tsx && grep -q "fallbackCtas" src/components/layout/MobileFallback.tsx && grep -q "from '../brand/Logo'" src/components/layout/MobileFallback.tsx && grep -q "from '../../content/mobile-fallback'" src/components/layout/MobileFallback.tsx && grep -q "from '../../content/company'" src/components/layout/MobileFallback.tsx && ! grep -qE "from ['\"]motion" src/components/layout/MobileFallback.tsx && npx tsc --noEmit && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -f src/components/layout/MobileFallback.tsx` exits 0
    - `grep -c "^export function MobileFallback" src/components/layout/MobileFallback.tsx` returns 1
    - `grep -c "fallbackBody" src/components/layout/MobileFallback.tsx` returns ≥ 1 (imported)
    - `grep -c "fallbackEmail" src/components/layout/MobileFallback.tsx` returns ≥ 2 (import + interpolated in href + label)
    - `grep -c "fallbackCtas" src/components/layout/MobileFallback.tsx` returns ≥ 1 (mapped over)
    - `grep -c "from '../brand/Logo'" src/components/layout/MobileFallback.tsx` returns 1
    - `grep -c "from '../../content/mobile-fallback'" src/components/layout/MobileFallback.tsx` returns 1
    - `grep -c "from '../../content/company'" src/components/layout/MobileFallback.tsx` returns 1
    - `grep -cE "from ['\"]motion" src/components/layout/MobileFallback.tsx` returns 0 (NO Motion import — D-03 mobile path is Motion-free)
    - `grep -c '<Logo' src/components/layout/MobileFallback.tsx` returns ≥ 1
    - `grep -c '<a href={\`mailto:' src/components/layout/MobileFallback.tsx | head -1` matches the mailto pattern (active mailto rendered)
    - `grep -cE "#[0-9A-Fa-f]{6}" src/components/layout/MobileFallback.tsx` returns 0 (no hex literals — all colors via Tailwind tokens)
    - `grep -c "rel=" src/components/layout/MobileFallback.tsx` returns ≥ 1 (external CTA carries rel="noopener noreferrer")
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
  </acceptance_criteria>
  <done>
    - File exists at `src/components/layout/MobileFallback.tsx`
    - Named export `MobileFallback`
    - Renders Logo + «ВИГОДА» wordmark + body copy + mailto + divider + 4 CTAs + juridical block in D-04 order
    - All copy comes from `src/content/mobile-fallback.ts` and `src/content/company.ts` — zero inline strings except «ЄДРПОУ» / «Ліцензія від» field labels (these are field labels, not microcopy; acceptable inline per Phase 2 D-15 scannability rule)
    - Zero Motion imports (D-03 bypass)
    - Zero hex literals (Tailwind tokens only)
    - External Lakeview CTA carries `target="_blank" rel="noopener noreferrer"` (HUB-02 pattern)
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with all 5 brand checks PASS
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Edit src/components/layout/Layout.tsx — add viewport-conditional short-circuit (D-02..D-07)</name>
  <read_first>
    - src/components/layout/Layout.tsx (FULL CURRENT FILE — must understand the exact existing AnimatePresence structure before adding the early-return branch)
    - src/hooks/useMatchMedia.ts (Wave 1 plan 06-01 — confirm import path + signature)
    - src/components/layout/MobileFallback.tsx (Task 1 above — confirm export name)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-02 (matchMedia detection mechanism — JS not CSS)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-03 (replaces Outlet AND hides Nav + Footer; AnimatePresence bypassed)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-07 (/dev/* routes EXEMPT — pass through to real content)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Pattern 3: Mobile-fallback short-circuit in Layout.tsx" (verbatim target shape)
  </read_first>
  <files>src/components/layout/Layout.tsx</files>
  <action>
    Edit `src/components/layout/Layout.tsx` (existing Phase 5 file). Make the following SURGICAL changes — preserve the existing desktop branch verbatim.

    **Change A — Add 2 imports** at the top of the file. After the existing `import { pageFade } from '../../lib/motionVariants';` line, add:

    ```ts
    import { useMatchMedia } from '../../hooks/useMatchMedia';
    import { MobileFallback } from './MobileFallback';
    ```

    **Change B — Update the JSDoc** at the top of the file to mention Phase 6 D-02..D-07 mobile short-circuit. Replace the existing JSDoc block (whichever lines they are in the current file — read first) with this updated version. Keep all the Phase 5 documentation; add a new paragraph after the Phase 5 block:

    ```tsx
    /**
     * @module components/layout/Layout
     *
     * Site chrome — Nav (top) + main + Footer. Renders on every route via
     * <Route element={<Layout/>}> in App.tsx.
     *
     * Phase 5 (D-10..D-14, D-25): wraps the Outlet in a presence wrapper +
     * keyed motion layer for inter-route page transitions per ANI-04.
     * Replaces the Phase 1 scroll-reset useEffect side-effect with the
     * presence-wrapper's onExitComplete callback (resets window scroll to
     * the top in the gap between exit-finished and enter-starting, never
     * during the fade-out).
     *
     * Risk 1 enforcement: the motion layer carries the same flex-grow
     * utility classes as the wrapping main element so the existing flex
     * chain continues into the route content subtree. Without this on the
     * inserted layer, every page's min-h-screen-style layouts visually
     * shrink.
     *
     * D-12 key strategy: location.pathname ONLY (NOT pathname+search). Chip
     * clicks on /projects (?stage=...) update searchParams without re-keying
     * — useSearchParams state survives, no spurious page fade.
     *
     * D-25 RM threading: when the user prefers reduced motion, pageFade is
     * swapped for a no-op variant. Routes still mount/unmount but without
     * animation. Motion 12.38.0 fires onExitComplete synchronously on
     * 0-duration exits, so scroll-to-top still works under reduced-motion
     * (RESEARCH Pitfall 3).
     *
     * Phase 6 (D-02..D-07): mobile-fallback short-circuit. When
     * useMatchMedia('(max-width: 1023px)') returns true AND the route is
     * NOT a /dev/* QA surface, return <MobileFallback /> directly inside
     * the bg-bg shell — bypassing Nav, AnimatePresence, Outlet, and Footer
     * (saves Motion-runtime bytes mobile users never see). Desktop path
     * (≥1024px) and /dev/brand + /dev/grid routes pass through to the
     * existing Phase 5 chain unchanged.
     */
    ```

    **Change C — Add the mobile short-circuit** at the top of the function body. After the existing 4 hooks (`useLocation`, `useReducedMotion`, ... `pageFade` const), and BEFORE the `return` statement, add:

    ```tsx
      // Phase 6 D-02: JS viewport detection (not CSS-only — avoids shipping
      // desktop DOM tree to mobile bytes; lets us replace <Outlet> semantically).
      const isMobile = useMatchMedia('(max-width: 1023px)');

      // Phase 6 D-07: /dev/* QA surfaces are exempt — developers may inspect
      // /dev/brand or /dev/grid on tablet sizes; they need real content.
      const isDevSurface = location.pathname.startsWith('/dev/');

      // Phase 6 D-03: replace Outlet AND hide Nav + Footer; AnimatePresence
      // is bypassed entirely on mobile (Motion-runtime path mobile users
      // never see — saves ~3KB on the mobile rendering branch).
      if (isMobile && !isDevSurface) {
        return (
          <div className="flex min-h-screen flex-col bg-bg">
            <MobileFallback />
          </div>
        );
      }
    ```

    **Change D — Leave the existing return statement UNCHANGED.** The desktop branch (the `return` with Nav + main + AnimatePresence + Footer) stays exactly as it was. The new mobile branch is an early-return ABOVE it.

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero in the new content)
    - Hex literals: NO `#XXXXXX` (zero in the additions; existing file may reference Tailwind tokens like `bg-bg` only)
    - Placeholder tokens: NO `{{...}}` (verified — JSDoc uses `<...>` not `{{...}}`)
    - Inline transition: NO `transition={{` JSX prop (the new branch is plain JSX, no Motion; existing AnimatePresence path uses `variants={...}` not `transition={{...}}`)
    - Import boundaries: imports from `../brand/Logo` (already in the new MobileFallback.tsx) — for Layout.tsx itself, the new imports are from `../../hooks/useMatchMedia` and `./MobileFallback` — both within layout boundary

    Verify after edit:
    - `npx tsc --noEmit` exits 0
    - `npm run dev` (or `npm run build`) starts cleanly
    - Manual smoke (~30 sec): in browser DevTools, toggle device emulation to a 414×844 viewport → page renders MobileFallback with no Nav/Footer; resize back to 1280px+ → desktop renders normally with hero/portfolio/etc.
    - Manual: navigate to `/dev/brand` at 414px → desktop content renders (NOT MobileFallback) — D-07 exemption confirmed
  </action>
  <verify>
    <automated>grep -q "import { useMatchMedia } from '../../hooks/useMatchMedia'" src/components/layout/Layout.tsx && grep -q "import { MobileFallback } from './MobileFallback'" src/components/layout/Layout.tsx && grep -q "useMatchMedia('(max-width: 1023px)')" src/components/layout/Layout.tsx && grep -q "location.pathname.startsWith('/dev/')" src/components/layout/Layout.tsx && grep -q "isMobile && !isDevSurface" src/components/layout/Layout.tsx && grep -q "<MobileFallback />" src/components/layout/Layout.tsx && grep -q "<AnimatePresence" src/components/layout/Layout.tsx && grep -q "<Outlet" src/components/layout/Layout.tsx && grep -q "<Nav " src/components/layout/Layout.tsx && grep -q "<Footer " src/components/layout/Layout.tsx && npx tsc --noEmit && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "import { useMatchMedia } from '../../hooks/useMatchMedia'" src/components/layout/Layout.tsx` returns 1
    - `grep -c "import { MobileFallback } from './MobileFallback'" src/components/layout/Layout.tsx` returns 1
    - `grep -c "useMatchMedia('(max-width: 1023px)')" src/components/layout/Layout.tsx` returns 1
    - `grep -c "location.pathname.startsWith('/dev/')" src/components/layout/Layout.tsx` returns 1
    - `grep -c "isMobile && !isDevSurface" src/components/layout/Layout.tsx` returns 1 (the early-return condition)
    - `grep -c "<MobileFallback />" src/components/layout/Layout.tsx` returns 1
    - **Desktop branch preserved**: `grep -c "<AnimatePresence" src/components/layout/Layout.tsx` returns 1, `grep -c "<Outlet" src/components/layout/Layout.tsx` returns 1, `grep -c "<Nav" src/components/layout/Layout.tsx` returns 1, `grep -c "<Footer" src/components/layout/Layout.tsx` returns 1
    - `grep -cE "transition=\\{\\{" src/components/layout/Layout.tsx` returns 0 (Phase 5 noInlineTransition gate stays green)
    - `grep -cE "#[0-9A-Fa-f]{6}" src/components/layout/Layout.tsx` returns 0 (no hex literals)
    - `npx tsc --noEmit` exits 0
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
    - Bundle size: `gzip -c dist/assets/index-*.js | wc -c` returns approximately 134-140KB (small increase from MobileFallback addition; well under 200KB budget)
  </acceptance_criteria>
  <done>
    - Layout.tsx imports `useMatchMedia` and `MobileFallback`
    - At top of function body: subscribes to `(max-width: 1023px)`, computes `isDevSurface` from pathname
    - Early-return when mobile && !dev: renders `<div className="flex min-h-screen flex-col bg-bg"><MobileFallback /></div>` — bypassing Nav/AnimatePresence/Outlet/Footer
    - Desktop branch (≥1024px) and /dev/* routes (any size) render the existing Phase 5 chain unchanged
    - JSDoc updated with Phase 6 D-02..D-07 documentation paragraph
    - All Phase 5 invariants intact: AnimatePresence, useReducedMotion + pageFade variants, onExitComplete scroll-reset, location.pathname keying
    - `npx tsc --noEmit` and `npm run build` both exit 0 with 5/5 brand checks PASS
  </done>
</task>

</tasks>

<verification>
- `test -f src/components/layout/MobileFallback.tsx` exits 0
- Layout.tsx imports useMatchMedia + MobileFallback (2 grep matches)
- Layout.tsx contains the `if (isMobile && !isDevSurface) return ...` early-return branch
- Layout.tsx desktop branch unchanged (AnimatePresence, Outlet, Nav, Footer still present)
- `npx tsc --noEmit` exits 0
- `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
- Bundle delta: gzipped JS bundle should remain ≤ 145KB (still 70-72% of 200KB budget; bundleBudget gate added in plan 06-08 is comfortably green)
- Manual smoke (UAT — Phase 6 VALIDATION §"Manual UAT"):
  - DevTools resize 1024 ↔ 1023 — clean swap (MobileFallback ↔ desktop) with no flicker, no console errors
  - At 414px (iPhone 14): MobileFallback renders with Logo + wordmark + body + mailto + 4 CTAs + juridical block
  - At 1280px: desktop home page renders normally with hero parallax / portfolio / etc.
  - Navigate to `/#/dev/brand` at 414px: D-07 exemption — desktop /dev/brand page renders, NOT MobileFallback
  - With `prefers-reduced-motion: reduce` emulated: MobileFallback renders unchanged (no animations to begin with — D-03 Motion-free)
</verification>

<success_criteria>
- [ ] `src/components/layout/MobileFallback.tsx` exists, renders D-04 layout from `src/content/mobile-fallback.ts` + `src/content/company.ts` data
- [ ] No Motion import in MobileFallback.tsx (D-03 mobile branch is Motion-free)
- [ ] Layout.tsx ships short-circuit: when `isMobile && !isDevSurface`, returns `<MobileFallback />` directly inside the bg-bg shell
- [ ] Layout.tsx /dev/* exemption working: D-07 — `/dev/brand` and `/dev/grid` always render desktop content regardless of viewport
- [ ] Layout.tsx desktop path (≥1024px) preserves Phase 5 AnimatePresence + RM threading verbatim
- [ ] `npx tsc --noEmit` passes, `npm run build` passes with all 5 check-brand gates green
- [ ] Manual UAT (DevTools): viewport swap works, `/dev/*` exemption works, juridical block reads correct legal facts
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-04-mobile-fallback-SUMMARY.md` documenting:
- Verbatim final form of MobileFallback.tsx (~80-100 lines)
- The 5 lines added to Layout.tsx (imports + 3-line short-circuit block)
- Confirmation that the desktop branch is unchanged (Phase 5 AnimatePresence intact)
- Bundle delta: before/after gzipped JS bundle size; confirmation that the 200KB budget remains comfortably green
- Manual UAT results (DevTools swap timings, dev-surface exemption confirmation, no console errors at any viewport)
- Note that QA-01 SC#1 letter is now satisfied at runtime; the automated gate for SC#1 is UAT-only (planner accepted this in VALIDATION.md)
- Risk acknowledged: if a future plan adds a NEW route at the path `/dev/*`, it MUST register before Phase 6 D-07's `pathname.startsWith('/dev/')` matcher to inherit the exemption — the matcher is a permanent invariant going forward
</output>
