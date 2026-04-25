---
phase: 04-portfolio-construction-log-contact
plan: 06a
type: execute
wave: 2
depends_on: ["04-01"]
files_modified:
  - src/components/sections/zhk/ZhkHero.tsx
  - src/components/sections/zhk/ZhkFactBlock.tsx
  - src/components/sections/zhk/ZhkWhatsHappening.tsx
  - src/components/sections/zhk/ZhkLakeviewRedirect.tsx
autonomous: true
requirements: [ZHK-01]
must_haves:
  truths:
    - "Hero render is `etnoDim.renders[0]` = 43615.jpg.webp with loading=eager and fetchPriority=high (D-14)"
    - "Fact block uses <dl>/<dt>/<dd> showing project.stageLabel + location + etnoDimAddress em-dash (D-15)"
    - "WhatsHappening section renders only when project.whatsHappening is defined (graceful absence)"
    - "/zhk/lakeview triggers cross-origin redirect via window.location.assign with branded placeholder (D-19)"
  artifacts:
    - path: "src/components/sections/zhk/ZhkHero.tsx"
      provides: "Full-width hero render with LCP wiring"
      exports: ["ZhkHero"]
      contains: "fetchPriority=\"high\""
    - path: "src/components/sections/zhk/ZhkFactBlock.tsx"
      provides: "Semantic <dl>/<dt>/<dd> fact block"
      exports: ["ZhkFactBlock"]
      contains: "<dl"
    - path: "src/components/sections/zhk/ZhkWhatsHappening.tsx"
      provides: "Stage-narrative paragraph block"
      exports: ["ZhkWhatsHappening"]
    - path: "src/components/sections/zhk/ZhkLakeviewRedirect.tsx"
      provides: "Cross-origin redirect placeholder for /zhk/lakeview"
      exports: ["ZhkLakeviewRedirect"]
      contains: "window\\.location\\.assign"
  key_links:
    - from: "src/components/sections/zhk/ZhkLakeviewRedirect.tsx"
      to: "src/content/zhk-etno-dim.ts"
      via: "import { lakeviewRedirectMessage }"
      pattern: "lakeviewRedirectMessage"
    - from: "src/components/sections/zhk/ZhkFactBlock.tsx"
      to: "src/content/placeholders.ts"
      via: "import { etnoDimAddress }"
      pattern: "etnoDimAddress"
---

<objective>
Ship the 4 LEAF section components for the `/zhk/etno-dim` template (D-13..D-15) and the cross-origin redirect placeholder for `/zhk/lakeview` (D-19). NO Lightbox state, NO gallery, NO page composition — those land in plan 04-06b.

This split (04-06a-shell + 04-06b-gallery) keeps each plan within ~50% context budget. The original 04-06 was at the scope-degradation threshold (3 tasks creating 7 new files; lightbox state + cross-origin redirect + LCP-target hero + mailto encoding all in one plan).

Components shipped here:
1. ZhkHero — full-width hero render, eager + fetchPriority="high" LCP target
2. ZhkFactBlock — `<dl>` showing stage label + location + address (em-dash placeholder)
3. ZhkWhatsHappening — paragraph block from `project.whatsHappening`
4. ZhkLakeviewRedirect — branded placeholder + window.location.assign for cross-origin redirect

Output: 4 new section components.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/data/projects.ts
@src/data/types.ts
@src/lib/stages.ts
@src/components/ui/ResponsivePicture.tsx
@src/components/brand/IsometricCube.tsx
@src/content/zhk-etno-dim.ts
@src/content/placeholders.ts

<interfaces>
From src/data/projects.ts:
```typescript
export const projects: Project[];
export const findBySlug: (slug: string) => Project | undefined;
// findBySlug only returns presentation === 'full-internal' projects per Phase 2 D-04.
```

From src/data/types.ts → Project (already loaded from prior reads):
- `slug`, `title`, `stageLabel` (descriptive narrative), `stage` (Model-Б bucket), `presentation`,
- `location?`, `externalUrl?`, `renders: string[]`, `facts?`, `whatsHappening?`, `aggregateText?`, `order`.

For etnoDim specifically (locked by Phase 2):
- slug='etno-dim', presentation='full-internal', stage='u-pogodzhenni',
- stageLabel='меморандум про відновлення будівництва',
- location='Львів', renders has 8 entries starting with '43615.jpg.webp',
- whatsHappening = 'Підписано меморандум про відновлення будівництва. Проводимо аудит наявних конструкцій та юридичне переоформлення прав забудовника.'

For flagship/Lakeview (locked by Phase 2):
- slug='lakeview', externalUrl='https://yaroslavpetrukha.github.io/Lakeview/'.

From src/content/zhk-etno-dim.ts (Wave 1 plan 04-01):
```typescript
export const lakeviewRedirectMessage: string;// 'Переходимо до ЖК Lakeview…'
```

From src/content/placeholders.ts:
```typescript
export const etnoDimAddress: string;  // '—'
```

ANI-03 hover (D-30..D-35) is NOT applied in these 4 components. Hover only applies to the gallery thumb buttons, which ship in plan 04-06b.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create ZhkHero, ZhkFactBlock, ZhkWhatsHappening (3 leaf components)</name>
  <read_first>
    - src/data/projects.ts (etnoDim record verbatim — confirm `renders[0] === '43615.jpg.webp'`)
    - src/data/types.ts (Project interface)
    - src/components/ui/ResponsivePicture.tsx (prop signature)
    - src/lib/stages.ts (stageLabel function)
    - src/content/placeholders.ts (etnoDimAddress)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-13, D-14, D-15)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §B (hero LCP signature) + §Q7 (dl/dt/dd)
  </read_first>
  <files>src/components/sections/zhk/ZhkHero.tsx, src/components/sections/zhk/ZhkFactBlock.tsx, src/components/sections/zhk/ZhkWhatsHappening.tsx</files>
  <action>
    **File 1 — `src/components/sections/zhk/ZhkHero.tsx`:**

    ```tsx
    /**
     * @module components/sections/zhk/ZhkHero
     *
     * ZHK-01 — Full-width hero render at top of /zhk/etno-dim (D-13, D-14).
     * LCP target on this route: loading="eager" + fetchPriority="high" per
     * Pitfall 8 + Phase 3 D-18. The 1920w AVIF preload is NOT in index.html
     * (only home flagship is preloaded there per Phase 3); rely on eager+high
     * for /zhk/etno-dim — RESEARCH §Q3 Option A. Phase 6 measures with
     * Lighthouse and may add dynamic preload via useEffect if LCP regresses.
     *
     * Hero rendered at 100vw with explicit width/height for CLS prevention.
     * The render is presumed 16:9 (architectural CGI); if it's not, override
     * width/height per Pitfall 4.
     */

    import type { Project } from '../../../data/types';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';

    interface Props {
      project: Project;
    }

    export function ZhkHero({ project }: Props) {
      return (
        <section className="bg-bg">
          <ResponsivePicture
            src={`renders/${project.slug}/${project.renders[0]}`}
            alt={project.title}
            widths={[640, 1280, 1920]}
            sizes="100vw"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto"
          />
        </section>
      );
    }
    ```

    **File 2 — `src/components/sections/zhk/ZhkFactBlock.tsx`:**

    ```tsx
    /**
     * @module components/sections/zhk/ZhkFactBlock
     *
     * ZHK-01 — Fact block with <dl>/<dt>/<dd> semantic markup (D-15 + RESEARCH §Q7).
     * Three rows: Стадія (descriptive `project.stageLabel`), Локація («Львів»),
     * Адреса (etnoDimAddress em-dash placeholder per Phase 2 D-19 / CONCEPT §11.8).
     *
     * Layout: 2-column at ≥lg (label 120px / value flex), stacked at <lg.
     *
     * WCAG: <dt> uses text-base (16px) lg:text-base — at AA floor for
     * #A7AFBC/#2F3640 (5.3:1) at 16px. text-sm at <lg uses font-medium for
     * contrast perception bump (Pitfall 6).
     */

    import type { Project } from '../../../data/types';
    import { etnoDimAddress } from '../../../content/placeholders';

    interface Props {
      project: Project;
    }

    export function ZhkFactBlock({ project }: Props) {
      return (
        <section className="bg-bg py-16">
          <div className="mx-auto max-w-7xl px-6">
            <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[120px_1fr] lg:gap-x-8">
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
                Стадія
              </dt>
              <dd className="text-base text-text">{project.stageLabel}</dd>
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
                Локація
              </dt>
              <dd className="text-base text-text">{project.location ?? '—'}</dd>
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
                Адреса
              </dt>
              <dd className="text-base text-text">{etnoDimAddress}</dd>
            </dl>
          </div>
        </section>
      );
    }
    ```

    NOTES on ZhkFactBlock:
    - Inline cyrillic «Стадія» (6 chars), «Локація» (7 chars), «Адреса» (6 chars) — well below 40-char content-boundary threshold + structural-label carve-out. Same pattern as Phase 3 BrandEssence index labels (Phase 3 D-29 carve-out).
    - `project.stageLabel` = «меморандум про відновлення будівництва» (verbatim from data/projects.ts, NOT a literal in this file).
    - `etnoDimAddress` = '—' from placeholders.ts.

    **File 3 — `src/components/sections/zhk/ZhkWhatsHappening.tsx`:**

    ```tsx
    /**
     * @module components/sections/zhk/ZhkWhatsHappening
     *
     * ZHK-01 — Stage-specific «Що відбувається зараз» paragraph (D-13, D-15).
     * Reads `project.whatsHappening` (defined for full-internal records;
     * may be undefined for fixtures — guard with conditional render).
     *
     * NO prices, NO sale terms — pipeline projects per PROJECT.md hard rule.
     */

    import type { Project } from '../../../data/types';

    interface Props {
      project: Project;
    }

    export function ZhkWhatsHappening({ project }: Props) {
      if (!project.whatsHappening) return null;
      return (
        <section className="bg-bg-surface py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-6 font-bold text-3xl text-text">Що відбувається зараз</h2>
            <p className="text-base text-text">{project.whatsHappening}</p>
          </div>
        </section>
      );
    }
    ```

    NOTES:
    - Inline H2 «Що відбувається зараз» (20 chars) — structural label below 40-char threshold + Phase 3 D-29 short-structural carve-out.
    - `project.whatsHappening` paragraph (~140 chars) is the data-layer string, NOT a JSX literal here.
  </action>
  <verify>
    <automated>grep -nE "export function ZhkHero" src/components/sections/zhk/ZhkHero.tsx && grep -nE 'loading="eager"' src/components/sections/zhk/ZhkHero.tsx && grep -nE 'fetchPriority="high"' src/components/sections/zhk/ZhkHero.tsx && grep -nE "export function ZhkFactBlock" src/components/sections/zhk/ZhkFactBlock.tsx && grep -nE "<dl|<dt|<dd" src/components/sections/zhk/ZhkFactBlock.tsx && grep -nE "etnoDimAddress" src/components/sections/zhk/ZhkFactBlock.tsx && grep -nE "export function ZhkWhatsHappening" src/components/sections/zhk/ZhkWhatsHappening.tsx && ! grep -rnE "transition-all|spring" src/components/sections/zhk/ && ! grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/zhk/ZhkHero.tsx src/components/sections/zhk/ZhkFactBlock.tsx src/components/sections/zhk/ZhkWhatsHappening.tsx && npm run lint</automated>
  </verify>
  <done>
    - 3 files created at correct paths.
    - ZhkHero: eager+high, project prop, ResponsivePicture widths [640,1280,1920].
    - ZhkFactBlock: `<dl>/<dt>/<dd>` semantic markup, consumes etnoDimAddress placeholder.
    - ZhkWhatsHappening: conditional render (returns null if no whatsHappening).
    - Zero `transition-all` or `spring` in any zhk component.
    - Zero quoted-prefix path literals (importBoundaries clean).
    - `npm run lint` exits 0.
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Visual smoke deferred to plan 04-06b composition.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create ZhkLakeviewRedirect (cross-origin redirect with branded placeholder)</name>
  <read_first>
    - src/content/zhk-etno-dim.ts (lakeviewRedirectMessage)
    - src/components/brand/IsometricCube.tsx (variant='single' + stroke options)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-19 redirect contract for /zhk/lakeview)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 3 (ExternalRedirect) + §Q6 + §Pitfall 5 (1-frame flicker is intentional)
  </read_first>
  <files>src/components/sections/zhk/ZhkLakeviewRedirect.tsx</files>
  <action>
    Create new file `src/components/sections/zhk/ZhkLakeviewRedirect.tsx`:

    ```tsx
    /**
     * @module components/sections/zhk/ZhkLakeviewRedirect
     *
     * ZHK-01 — Cross-origin redirect placeholder for /zhk/lakeview (D-19).
     * react-router's <Navigate> is same-origin only; for cross-origin URLs
     * we use window.location.assign() inside useEffect (post-paint).
     *
     * 1-frame flicker is unavoidable (Pitfall 5) — make it look intentional
     * with branded copy + IsometricCube. User sees «Переходимо до ЖК Lakeview…»
     * for ~16-50ms before the browser navigates away.
     *
     * Caller (ZhkPage) passes the externalUrl prop after looking it up via
     * `projects.find(p => p.slug === 'lakeview' && p.presentation === 'flagship-external')`.
     */

    import { useEffect } from 'react';
    import { IsometricCube } from '../../brand/IsometricCube';
    import { lakeviewRedirectMessage } from '../../../content/zhk-etno-dim';

    interface Props {
      url: string;
    }

    export function ZhkLakeviewRedirect({ url }: Props) {
      useEffect(() => {
        window.location.assign(url);
      }, [url]);

      return (
        <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
          <IsometricCube
            variant="single"
            stroke="#A7AFBC"
            opacity={0.4}
            className="h-16 w-16"
          />
          <p className="text-base text-text-muted" aria-live="polite">
            {lakeviewRedirectMessage}
          </p>
        </section>
      );
    }
    ```

    NOTES:
    - `useEffect` with the URL in deps array — useLayoutEffect would NOT skip the paint per RESEARCH §Q6.
    - aria-live="polite" so screen readers announce the redirect message.
    - IsometricCube `variant="single"` opening tag must keep `variant="single"` on the line containing `<IsometricCube` (Phase 3 lesson + verify grep).
    - Stroke `#A7AFBC` is palette-whitelisted.
  </action>
  <verify>
    <automated>grep -nE "export function ZhkLakeviewRedirect" src/components/sections/zhk/ZhkLakeviewRedirect.tsx && grep -nE "window\\.location\\.assign" src/components/sections/zhk/ZhkLakeviewRedirect.tsx && grep -nE "lakeviewRedirectMessage" src/components/sections/zhk/ZhkLakeviewRedirect.tsx && grep -nE "useEffect" src/components/sections/zhk/ZhkLakeviewRedirect.tsx && grep -nE 'aria-live="polite"' src/components/sections/zhk/ZhkLakeviewRedirect.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at `src/components/sections/zhk/ZhkLakeviewRedirect.tsx`.
    - Exports `ZhkLakeviewRedirect({ url }: { url: string })`.
    - Contains `window.location.assign(url)` inside `useEffect`.
    - Contains `aria-live="polite"`.
    - Renders `<IsometricCube variant="single"` with palette-whitelisted stroke.
    - `npm run lint` exits 0.
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Smoke is exercised by plan 04-06b's ZhkPage composition (which wires this to the lakeview slug case).
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **Files exist**: 4 new section components under `src/components/sections/zhk/`:
   - ZhkHero.tsx, ZhkFactBlock.tsx, ZhkWhatsHappening.tsx, ZhkLakeviewRedirect.tsx

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (the 4 components are unreachable until plan 04-06b composes them; tree-shaking will keep bundle stable).

4. **Brand invariants**:
   - `! grep -rnE "'/renders/|'/construction/" src/components/sections/zhk/` returns clean.
   - `! grep -rnE "transition-all|spring" src/components/sections/zhk/` returns clean.
   - `! grep -rnE "Pictorial|Rubikon" src/components/sections/zhk/` returns clean.

5. **Manual smoke deferred to plan 04-06b** — these 4 components have no entry point until ZhkPage dispatcher (plan 04-06b) consumes them.

6. **Bundle delta**: ~0 (unreachable from entry until plan 04-06b lands).
</verification>

<success_criteria>
- ZHK-01 partial (shell): hero + fact block + whatsHappening + lakeview redirect placeholder all built and ready for composition by plan 04-06b.
- 4 leaf section components, zero state (no useState hooks except useEffect in redirect), no Lightbox imports.
- Plan stays well under 50% context budget — pure leaf components, no cross-cutting state.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-06a-SUMMARY.md` documenting:
- 4 file paths created
- Decision IDs implemented (D-13 partial, D-14, D-15, D-19 partial — redirect placeholder shipped; dispatcher logic in 04-06b)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta (expected 0 — unreachable until 04-06b composes ZhkPage)
- Note for plan 04-06b: import these 4 from `../components/sections/zhk/{ZhkHero,ZhkFactBlock,ZhkWhatsHappening,ZhkLakeviewRedirect}`
</output>
