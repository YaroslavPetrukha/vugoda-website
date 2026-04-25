---
phase: 03-brand-primitives-home-page
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/vite-env.d.ts
  - src/components/brand/IsometricGridBG.tsx
  - src/components/brand/IsometricCube.tsx
  - src/components/brand/Mark.tsx
  - src/components/brand/MinimalCube.tsx
autonomous: true
requirements: [VIS-03, VIS-04]
requirements_addressed: [VIS-03, VIS-04]

must_haves:
  truths:
    - "IsometricCube exposes typed variant 'single'|'group'|'grid' and typed stroke restricted to 3 brand hexes (Roadmap SC#4)"
    - "IsometricGridBG component exists and imports brand-assets/patterns/isometric-grid.svg via vite-plugin-svgr ?react query (D-03)"
    - "Mark component exists wrapping brand-assets/mark/mark.svg via URL-import (D-28)"
    - "MinimalCube.tsx is deleted in the same commit that introduces IsometricCube.tsx (D-12)"
    - "tsc --noEmit passes — svgr ?react import is type-resolved via vite-plugin-svgr/client reference"
    - "When IsometricCube variant='grid' is used WITHOUT explicit opacity prop, delegated grid opacity defaults to 0.15 (mid of D-03 0.10–0.20 range); explicit opacity is clamped to ≤ 0.20 inside the grid branch (D-03 hero ceiling enforcement)"
  artifacts:
    - path: "src/components/brand/IsometricCube.tsx"
      provides: "VIS-03 cube primitive (3 variants × 3 strokes × opacity)"
      exports: ["IsometricCube", "IsometricCubeProps"]
    - path: "src/components/brand/IsometricGridBG.tsx"
      provides: "Hero overlay grid background, svgr-imported"
      exports: ["IsometricGridBG", "IsometricGridBGProps"]
    - path: "src/components/brand/Mark.tsx"
      provides: "Cube-with-petals mark for /dev/brand + future Phase 4 empty-states"
      exports: ["Mark"]
    - path: "src/vite-env.d.ts"
      provides: "Triple-slash reference adds svgr ?react module type"
      contains: '/// <reference types="vite-plugin-svgr/client" />'
  key_links:
    - from: "src/components/brand/IsometricCube.tsx"
      to: "src/components/brand/IsometricGridBG.tsx"
      via: "import { IsometricGridBG } when variant='grid'"
      pattern: "from './IsometricGridBG'"
    - from: "src/components/brand/IsometricGridBG.tsx"
      to: "brand-assets/patterns/isometric-grid.svg"
      via: "vite-plugin-svgr ?react query"
      pattern: "from '../../../brand-assets/patterns/isometric-grid.svg\\?react'"
    - from: "src/components/brand/Mark.tsx"
      to: "brand-assets/mark/mark.svg"
      via: "URL import (per D-28 / D-27 pattern)"
      pattern: "from '../../../brand-assets/mark/mark.svg'"
---

<objective>
Ship the four inviolable brand primitives Phase 3 introduces — `IsometricGridBG` (svgr-wrapped grid background), `IsometricCube` (3-variant typed primitive), `Mark` (URL-imported cube-with-petals) — and DELETE `MinimalCube.tsx` (D-12, replacement geometry preserved in `IsometricCube` `variant='single'`).

Purpose: VIS-03 and VIS-04 require these primitives to exist before any home-page section consumes them. They are the brandbook-locked atoms — every later wave imports from this output.

Output: 3 new TSX files in `src/components/brand/`, 1 deletion, 1 single-line edit to `src/vite-env.d.ts` to register the svgr `?react` module type so `tsc --noEmit` passes.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/STATE.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@.planning/phases/03-brand-primitives-home-page/03-VALIDATION.md
@CLAUDE.md
@brand-system.md

<interfaces>
<!-- Files-of-truth executor MUST read first. Do not invent. -->

Existing primitive being replaced — `src/components/brand/MinimalCube.tsx` (53 lines). Geometry to preserve in IsometricCube `single` variant:
```
viewBox="0 0 100 100"
<polygon points="50,15 85,35 50,55 15,35" />  // top rhombus
<polygon points="15,35 15,75 50,95 50,55" />  // left rhombus
<polygon points="50,55 50,95 85,75 85,35" />  // right rhombus
```

Existing primitive to NOT touch — `src/components/brand/Logo.tsx`:
```ts
import darkLogoUrl from '../../../brand-assets/logo/dark.svg';
export function Logo({ className, title = 'ВИГОДА' }: LogoProps) {
  return <img src={darkLogoUrl} alt={title} className={className} />;
}
```
D-27 locks Logo.tsx as URL-import — DO NOT migrate to ?react. Quick-task 260424-whr verified bundling.

Existing svgr config in `vite.config.ts:9-21`:
```ts
svgr({
  svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
  include: '**/*.svg?react',
})
```
This is FROZEN — Phase 3 does not modify vite.config.ts.

Brand asset sources (verified present 2026-04-25):
- `brand-assets/patterns/isometric-grid.svg` — 15.6KB, viewBox `0 0 220.6 167.4`. Contains `<defs><style>` with `.cls-1 { fill: #c1f33d }` and `.cls-2 { mix-blend-mode: overlay }`. Wrap-only via opacity, NO stroke override possible.
- `brand-assets/mark/mark.svg` — 739B, viewBox `0 0 220.6 167.4`. 3 paths fill `#c1f33d` opacity 0.6.

Current `src/vite-env.d.ts` content (1 line):
```
/// <reference types="vite/client" />
```

Brand-system.md §5 hard rules for cube SVG:
- stroke-width 0.5–1.5pt ≈ 1–2px (default 1)
- opacity 5%–60% (default 0.3)
- 3 allowed stroke colors only: `#A7AFBC` (muted) | `#F5F7FA` (primary) | `#C1F33D` (accent)
- straight lines only, butt cap, miter join

Phase 2 `scripts/check-brand.ts` `paletteWhitelist()` scans `src/**/*.{ts,tsx,css}` for hex literals — only the 6 canonical hexes are allowed. The 3 stroke-color literals embedded in `IsometricCube.tsx` (`'#A7AFBC' | '#F5F7FA' | '#C1F33D'`) are subset of the 6 — they pass.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Add svgr ?react type reference to vite-env.d.ts</name>
  <files>src/vite-env.d.ts</files>
  <read_first>
    - src/vite-env.d.ts (current 1-line content above)
    - 03-RESEARCH.md lines 330–342 (svgr `?react` query type augmentation rationale)
    - 03-RESEARCH.md lines 1206–1209 (Pitfall 1: TS error if `vite-plugin-svgr/client` not referenced)
  </read_first>
  <action>
    REPLACE entire file `src/vite-env.d.ts` with the following two-line content (svgr type reference FIRST, then the existing vite/client reference — order matters per svgr README):

    ```
    /// <reference types="vite-plugin-svgr/client" />
    /// <reference types="vite/client" />
    ```

    No other changes. This makes `import GridSvg from '…?react'` type-resolve in Tasks 2–3.
  </action>
  <verify>
    <automated>grep -nF 'reference types="vite-plugin-svgr/client"' src/vite-env.d.ts</automated>
  </verify>
  <done>
    File `src/vite-env.d.ts` has exactly two `/// <reference>` lines, the svgr one BEFORE the vite/client one. `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create IsometricGridBG.tsx (svgr ?react wrapper)</name>
  <files>src/components/brand/IsometricGridBG.tsx</files>
  <read_first>
    - 03-CONTEXT.md D-03 (IsometricGridBG spec — opacity 0.1–0.2, absolute positioned, full-bleed)
    - 03-RESEARCH.md lines 320–393 (svgr ?react recipe + critical caveat about `<defs><style>` blocks; single-instance-per-page rule)
    - 03-RESEARCH.md lines 1216–1219 (Pitfall 3: duplicate-id risk if two instances rendered — Phase 3 only renders ONE per page)
    - brand-system.md §5 (opacity 5–60% range)
    - vite.config.ts lines 9–21 (svgr include pattern `**/*.svg?react`)
  </read_first>
  <behavior>
    - Test 1: file exports `IsometricGridBG` named function with props `{ className?: string; opacity?: number }`
    - Test 2: imports `brand-assets/patterns/isometric-grid.svg?react` (relative path `../../../brand-assets/patterns/isometric-grid.svg?react`)
    - Test 3: defaults — `className = 'h-full w-full'`, `opacity = 0.15` (within brandbook 0.05–0.60)
    - Test 4: renders `<div aria-hidden="true">` wrapping the SVG; container `style={{ opacity }}`; no `id` attribute on the wrapper (avoid duplicate-id risk per Pitfall 3)
    - Test 5: SVG element passed `width="100%" height="100%" preserveAspectRatio="xMidYMid slice"` so it fills its container while preserving aspect
    - Test 6: NO inline `transition={{}}` — purely structural
  </behavior>
  <action>
    CREATE file `src/components/brand/IsometricGridBG.tsx` with verbatim content (only minor doc-block tweaks allowed):

    ```tsx
    /**
     * @module components/brand/IsometricGridBG
     * Hero overlay — imports brand-assets/patterns/isometric-grid.svg via
     * vite-plugin-svgr's ?react query (Phase 3 D-03).
     *
     * The source SVG uses inline <style> with hardcoded fill: #c1f33d and
     * mix-blend-mode: overlay — geometry is FILLED, not stroked. We rely on:
     *   1) Container opacity (0.05–0.60 per brandbook §5).
     *   2) The fill color being canonical accent #C1F33D (passes check-brand).
     *   3) Wrapper className for sizing/positioning.
     *
     * Render ONLY ONCE per page (Phase 3 = hero overlay only) to avoid duplicate
     * <defs><style> blocks and duplicate ids — see 03-RESEARCH.md §Pitfall 3.
     */
    import GridSvg from '../../../brand-assets/patterns/isometric-grid.svg?react';

    export interface IsometricGridBGProps {
      /** Container className. Default fills parent. */
      className?: string;
      /** Container opacity per brandbook 0.05–0.60. Default 0.15 (mid-band). */
      opacity?: number;
    }

    export function IsometricGridBG({
      className = 'h-full w-full',
      opacity = 0.15,
    }: IsometricGridBGProps) {
      return (
        <div aria-hidden="true" className={className} style={{ opacity }}>
          <GridSvg
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </div>
      );
    }
    ```

    Implementation notes:
    - The relative import path MUST be `'../../../brand-assets/patterns/isometric-grid.svg?react'` (3× `..` from `src/components/brand/` to repo root).
    - DO NOT pass `stroke` or `fill` props — the SVG's inline `<style>` overrides them; opacity is the only API surface.
    - DO NOT add `transition={{}}` — Phase 5 owns motion config; this is a structural primitive.
  </action>
  <verify>
    <automated>test -f src/components/brand/IsometricGridBG.tsx &amp;&amp; grep -E "export function IsometricGridBG" src/components/brand/IsometricGridBG.tsx &amp;&amp; grep -nE "from '\.\./\.\./\.\./brand-assets/patterns/isometric-grid\.svg\?react'" src/components/brand/IsometricGridBG.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    File exists, exports `IsometricGridBG`, imports the brand-asset SVG via `?react`, `tsc --noEmit` exits 0 (svgr type ref from Task 1 resolves the ?react module). No `transition={{` literal in file (`grep -nE "transition=\{\{" src/components/brand/IsometricGridBG.tsx` empty).
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Create IsometricCube.tsx (3-variant typed primitive) and DELETE MinimalCube.tsx</name>
  <files>src/components/brand/IsometricCube.tsx, src/components/brand/MinimalCube.tsx</files>
  <read_first>
    - src/components/brand/MinimalCube.tsx (53 lines — geometry being preserved in `single` variant)
    - 03-CONTEXT.md D-07 through D-12 (cube primitive lock: 3 variants, typed stroke union, opacity default 0.3, MinimalCube delete in same commit)
    - 03-CONTEXT.md D-03 (hero grid opacity 0.10–0.20 range — IsometricCube grid-variant delegate MUST clamp to this ceiling)
    - 03-RESEARCH.md lines 793–893 (TypeScript discriminated-union pattern + body recipe)
    - 03-RESEARCH.md lines 898–903 (verified MinimalCube has zero call sites — clean delete)
    - brand-system.md §5 (cube line params: butt cap, miter join, straight lines, opacity 5–60%, 3 allowed strokes)
    - 03-VALIDATION.md per-task verification map row "VIS-03" (typed variant + stroke literals + npm run lint)
  </read_first>
  <behavior>
    - Test 1: file exports `IsometricCube` function and `IsometricCubeProps` type
    - Test 2: prop type `variant: 'single' | 'group' | 'grid'` (literal union, not string)
    - Test 3: prop type `stroke?: '#A7AFBC' | '#F5F7FA' | '#C1F33D'` with default `'#A7AFBC'`
    - Test 4: prop `strokeWidth?: number` default `1` (1pt ≈ 1px); `opacity?: number` default `0.3` (mid brandbook range)
    - Test 5: when `variant='grid'`, returns `<IsometricGridBG className={className} opacity={...} />` with delegated opacity rules per Test 12
    - Test 6: when `variant='single'`, renders `<svg viewBox="0 0 100 100">` with the 3 polygons preserved verbatim from MinimalCube
    - Test 7: when `variant='group'`, renders `<svg viewBox="0 0 220 100">` with 6 polygons (Cube 1 sharing edge x=85 with Cube 2 — brandbook page-20 «Структурна група»)
    - Test 8: `<g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="butt" strokeLinejoin="miter">`
    - Test 9: SVG `aria-hidden="true" focusable="false"`; `style={{ opacity }}`
    - Test 10: TypeScript prevents `<IsometricCube stroke="#FF0000" />` at compile time (`tsc --noEmit` errors if literal-union violated)
    - Test 11: `MinimalCube.tsx` is deleted by the END of this task
    - Test 12 (D-03 hero ceiling): when `variant='grid'` and caller does NOT pass `opacity` (i.e. `opacity` prop is undefined), the delegated `<IsometricGridBG>` receives `opacity={0.15}` (mid of D-03 0.10–0.20 range) — NOT the global 0.3 default. When caller passes `opacity` explicitly, the delegate receives `Math.min(callerOpacity, 0.2)` (clamped to ≤ 0.2). Non-grid variants are unaffected — `opacity` defaults to 0.3 on the SVG `style` as before.
  </behavior>
  <action>
    Step A — Create file `src/components/brand/IsometricCube.tsx` with verbatim content:

    ```tsx
    /**
     * @module components/brand/IsometricCube
     * 3-variant inviolable brand primitive per VIS-03 + brand-system.md §5.
     * Replaces Phase 1's MinimalCube (deleted in same commit per Phase 3 D-12).
     * `single` variant preserves MinimalCube's polygon geometry verbatim — no
     * visual shift between phases when consumers swap component name.
     *
     * Cube-ladder semantics per CONCEPT §5.2 + Phase 3 D-10:
     *   single → Pipeline-4 aggregate-row marker (Phase 3) +
     *            Phase 4 «Здано (0)» empty-state marker
     *   group  → Phase 4 pipeline-card decorative corner
     *   grid   → hero overlay (delegates to IsometricGridBG) +
     *            Phase 4 empty-state full-bleed
     *
     * D-03 hero opacity ceiling (grid variant only):
     *   The hero overlay grid MUST sit in the 0.10–0.20 opacity band per
     *   brandbook §5 + Phase 3 D-03. The `single`/`group` variants follow
     *   the broader brandbook 0.05–0.60 cube range (default 0.3).
     *   Therefore when `variant='grid'`:
     *     - opacity undefined → delegate receives 0.15 (mid-band)
     *     - opacity explicit  → delegate receives Math.min(opacity, 0.2)
     *   This prevents an accidental `<IsometricCube variant='grid' />` call
     *   from washing the hero in 30% accent-overlay.
     */
    import { IsometricGridBG } from './IsometricGridBG';

    type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

    export interface IsometricCubeProps {
      variant: 'single' | 'group' | 'grid';
      /** One of 3 brand-allowed stroke colors. Default '#A7AFBC'. */
      stroke?: AllowedStroke;
      /** Stroke width 0.5–1.5pt ≈ 1–2px. Default 1. */
      strokeWidth?: number;
      /** Container opacity. Default 0.3 for single/group (brandbook §5).
       *  For variant='grid', see D-03 hero ceiling logic in component body. */
      opacity?: number;
      /** Sizing className. */
      className?: string;
    }

    export function IsometricCube({
      variant,
      stroke = '#A7AFBC',
      strokeWidth = 1,
      opacity,
      className,
    }: IsometricCubeProps) {
      // grid variant delegates to the svgr-imported IsometricGridBG so we keep
      // a single source of truth for grid geometry (Phase 3 D-09 wrapper option).
      // D-03: enforce hero 0.10–0.20 opacity ceiling at the delegate boundary.
      if (variant === 'grid') {
        const gridOpacity =
          opacity === undefined ? 0.15 : Math.min(opacity, 0.2);
        return <IsometricGridBG className={className} opacity={gridOpacity} />;
      }

      // Non-grid variants: brandbook §5 default 0.3 if caller omitted opacity.
      const svgOpacity = opacity ?? 0.3;

      return (
        <svg
          viewBox={variant === 'group' ? '0 0 220 100' : '0 0 100 100'}
          className={className}
          style={{ opacity: svgOpacity }}
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
            {variant === 'single' && (
              <>
                {/* Top rhombus — preserved from Phase 1 MinimalCube */}
                <polygon points="50,15 85,35 50,55 15,35" />
                {/* Left rhombus */}
                <polygon points="15,35 15,75 50,95 50,55" />
                {/* Right rhombus */}
                <polygon points="50,55 50,95 85,75 85,35" />
              </>
            )}
            {variant === 'group' && (
              <>
                {/* Cube 1 (left), viewBox 0 0 220 100 */}
                <polygon points="50,15 85,35 50,55 15,35" />
                <polygon points="15,35 15,75 50,95 50,55" />
                <polygon points="50,55 50,95 85,75 85,35" />
                {/* Cube 2 (right) — shares vertical edge x=85 with Cube 1 right face */}
                <polygon points="120,15 155,35 120,55 85,35" />
                <polygon points="85,35 85,75 120,95 120,55" />
                <polygon points="120,55 120,95 155,75 155,35" />
              </>
            )}
          </g>
        </svg>
      );
    }
    ```

    Step B — Verify zero call sites of MinimalCube before delete:
    Run `grep -rnE "from '.*MinimalCube'|import.*MinimalCube" src/`. The pattern matches ONLY actual import statements (not docstring/comment mentions — including the new IsometricCube.tsx doc-block which mentions «MinimalCube» in prose). Expected output: empty (no matches). If any consumer is found, STOP and report — Phase 3 plan assumed zero call sites per RESEARCH.md line 898–903 (verified at research time).

    Step C — DELETE the file:
    Remove `src/components/brand/MinimalCube.tsx` (whole file — 53 lines). Same atomic commit as Step A so the brand primitive set transitions cleanly.
  </action>
  <verify>
    <automated>test -f src/components/brand/IsometricCube.tsx &amp;&amp; test ! -f src/components/brand/MinimalCube.tsx &amp;&amp; grep -nE "variant: 'single' \| 'group' \| 'grid'" src/components/brand/IsometricCube.tsx &amp;&amp; grep -nE "stroke\?: '#A7AFBC' \| '#F5F7FA' \| '#C1F33D'" src/components/brand/IsometricCube.tsx &amp;&amp; grep -nE "Math\.min\(opacity, 0\.2\)" src/components/brand/IsometricCube.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    `src/components/brand/IsometricCube.tsx` exists with typed `variant` discriminated union and typed `stroke` literal union (3 brand hexes only). Grid-variant delegate clamps opacity to ≤ 0.2 (D-03 hero ceiling). `src/components/brand/MinimalCube.tsx` is deleted. `npm run lint` (≡ `tsc --noEmit`) exits 0. No new hex literal outside the 6 canonical brand colors enters `src/`. `tsx scripts/check-brand.ts` `paletteWhitelist` PASS.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 4: Create Mark.tsx (URL-import wrapper for mark.svg)</name>
  <files>src/components/brand/Mark.tsx</files>
  <read_first>
    - src/components/brand/Logo.tsx (15-line URL-import pattern to mirror)
    - 03-CONTEXT.md D-28 (Mark spec — URL-import per Logo pattern, used by DevBrandPage + Phase 4 empty-states)
    - 03-RESEARCH.md lines 204–207 (mark.svg metadata: 739B, viewBox `0 0 220.6 167.4`, 3 paths fill `#c1f33d` opacity 0.6)
  </read_first>
  <behavior>
    - Test 1: file exports `Mark` named function with props `{ className?: string }`
    - Test 2: imports `mark.svg` as URL (`import markUrl from '../../../brand-assets/mark/mark.svg'`) — NOT `?react`
    - Test 3: renders `<img src={markUrl} alt="" aria-hidden="true" className={className} />` (decorative — no alt text per brand pattern)
    - Test 4: NO `?react` query, NO svgr import — keeps Mark as a binary asset reference (D-28 mirrors Logo.tsx D-27)
  </behavior>
  <action>
    CREATE file `src/components/brand/Mark.tsx` with verbatim content:

    ```tsx
    /**
     * @module components/brand/Mark
     * Cube-with-petals brand mark (brand-assets/mark/mark.svg, 739 B,
     * viewBox 0 0 220.6 167.4, fill #C1F33D opacity 0.6 — see brand-system.md).
     *
     * URL-import pattern per Phase 3 D-28 — mirrors Logo.tsx (D-27). Quick-task
     * 260424-whr verified that URL-import bundling lands the SVG in dist/ as a
     * static asset rather than inlining via svgr's ?react query.
     *
     * Decorative — alt="" + aria-hidden="true". Used by DevBrandPage (Phase 3)
     * and reserved for Phase 4 empty-state fallbacks. NOT consumed on home page.
     */
    import markUrl from '../../../brand-assets/mark/mark.svg';

    export interface MarkProps {
      className?: string;
    }

    export function Mark({ className }: MarkProps) {
      return <img src={markUrl} alt="" aria-hidden="true" className={className} />;
    }
    ```

    Note: relative path `'../../../brand-assets/mark/mark.svg'` (3× `..` from `src/components/brand/` to repo root). NO `?react` query — Vite's default URL handling kicks in, just like Logo.tsx.
  </action>
  <verify>
    <automated>test -f src/components/brand/Mark.tsx &amp;&amp; grep -nE "from '\.\./\.\./\.\./brand-assets/mark/mark\.svg'" src/components/brand/Mark.tsx &amp;&amp; grep -nE "export function Mark" src/components/brand/Mark.tsx &amp;&amp; ! grep -nE "\?react" src/components/brand/Mark.tsx</automated>
  </verify>
  <done>
    File exists, URL-imports `mark.svg` (no `?react`), exports `Mark`. `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
After all tasks:
1. `npm run lint` exits 0 (TypeScript clean — svgr `?react` types resolve from Task 1)
2. `tsx scripts/check-brand.ts` exits 0 — all 4 invariants PASS (denylist, palette, placeholders, importBoundaries). The 3 stroke-color literals in IsometricCube are subset of the canonical 6 hexes; no new violations.
3. `grep -rnE "from '.*MinimalCube'|import.*MinimalCube" src/` returns empty (file deleted, zero import sites pre-deletion confirmed in Task 3 Step B)
4. `npm run build` exits 0 (full pipeline including postbuild check-brand)
</verification>

<success_criteria>
- [ ] `src/vite-env.d.ts` references `vite-plugin-svgr/client` first, then `vite/client`
- [ ] `src/components/brand/IsometricGridBG.tsx` exists, imports `…isometric-grid.svg?react`
- [ ] `src/components/brand/IsometricCube.tsx` exists with typed `variant` discriminated union and typed `stroke` literal union; delegates `grid` variant to IsometricGridBG with D-03 opacity clamp (≤ 0.2)
- [ ] `src/components/brand/Mark.tsx` exists, URL-imports `mark.svg` (no `?react`)
- [ ] `src/components/brand/MinimalCube.tsx` does NOT exist (deleted)
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0 (postbuild check-brand passes — palette whitelist holds with the 3 stroke hexes, all subset of the 6 canonical brand hexes)
- [ ] No `transition={{` literal anywhere in the 3 new TSX files (Phase 5 owns motion config)
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-01-SUMMARY.md` documenting:
- 4 files added (3 new TSX + 1 vite-env.d.ts edit), 1 file deleted (MinimalCube.tsx)
- VIS-03 + VIS-04 partially closed (cube primitive + Mark; Logo from Phase 1 inherits)
- Wave 1 unblocks Wave 3 home-section consumers (PortfolioOverview imports IsometricCube, Hero imports IsometricGridBG)
- check-brand passes — record any minor note about hex-literal palette compliance
- Any deviations from the plan (e.g., MinimalCube delete blocked by an unexpected call-site)
</output>
</output>
