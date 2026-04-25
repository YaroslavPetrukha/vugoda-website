---
phase: 04-portfolio-construction-log-contact
plan: 06b
type: execute
wave: 2
depends_on: ["04-01", "04-02", "04-06a"]
files_modified:
  - src/components/sections/zhk/ZhkGallery.tsx
  - src/components/sections/zhk/ZhkCtaPair.tsx
  - src/pages/ZhkPage.tsx
autonomous: true
requirements: [ZHK-01]
must_haves:
  truths:
    - "8-render gallery is 2-col (1024-1279) / 4-col (≥1280) grid; click opens shared <Lightbox> (D-16, D-17)"
    - "Per-page useState<number>(-1) inside ZhkGallery — Lightbox state lives inside the gallery component"
    - "Gallery thumb buttons apply ANI-03 hover triple-effect (D-31..D-35) including motion-reduce: variants"
    - "CTA pair: primary mailto with encodeURIComponent subject + secondary disabled-styled Instagram (D-18)"
    - "/zhk/etno-dim renders hero render → fact block → 'Що відбувається зараз' → 8-render gallery → CTA pair (D-13)"
    - "/zhk/lakeview triggers ZhkLakeviewRedirect (cross-origin) (D-19)"
    - "/zhk/{maietok-vynnykivskyi|nterest|pipeline-4} redirects to /projects via <Navigate replace /> (D-19)"
    - "/zhk/unknown-slug renders inline NotFoundPage (D-19 + RESEARCH §Pattern 3 recommendation)"
  artifacts:
    - path: "src/components/sections/zhk/ZhkGallery.tsx"
      provides: "8-render grid with embedded Lightbox state"
      exports: ["ZhkGallery"]
      contains: "Lightbox"
    - path: "src/components/sections/zhk/ZhkCtaPair.tsx"
      provides: "Primary mailto + secondary Instagram CTA pair"
      exports: ["ZhkCtaPair"]
      contains: "encodeURIComponent\\(mailtoSubject\\)"
    - path: "src/pages/ZhkPage.tsx"
      provides: "Slug dispatcher: full template OR redirect OR 404"
      contains: "findBySlug|Navigate"
  key_links:
    - from: "src/pages/ZhkPage.tsx"
      to: "src/data/projects.ts (findBySlug)"
      via: "import { findBySlug, projects }"
      pattern: "findBySlug"
    - from: "src/components/sections/zhk/ZhkGallery.tsx"
      to: "src/components/ui/Lightbox.tsx"
      via: "import { Lightbox }"
      pattern: "Lightbox"
    - from: "src/components/sections/zhk/ZhkCtaPair.tsx"
      to: "src/content/zhk-etno-dim.ts"
      via: "import { mailtoSubject, mailtoLabel, instagramLabel }"
      pattern: "encodeURIComponent\\(mailtoSubject\\)"
---

<objective>
Compose the gallery (with Lightbox state) + CTA pair, then wire the `/zhk/:slug` page dispatcher. Builds on plan 04-06a's 4 shell components.

Components shipped here:
1. ZhkGallery — 8-render grid, embedded `useState<number>(-1)` Lightbox state, ANI-03 hover on thumbs
2. ZhkCtaPair — primary mailto + secondary disabled Instagram
3. ZhkPage (page replacement) — slug dispatcher with all 4 cases (template / lakeview redirect / projects redirect / 404)

Slug dispatcher (D-19):
- `etno-dim` → render full template via the 5 zhk components (4 from plan 04-06a + ZhkGallery from this plan) + ZhkCtaPair
- `lakeview` → ZhkLakeviewRedirect (from plan 04-06a)
- `maietok-vynnykivskyi` / `nterest` / `pipeline-4` → `<Navigate to="/projects" replace />`
- unknown → render `<NotFoundPage />` inline (RESEARCH §Pattern 3 + §Q6)

Output: 2 new section components + 1 page replacement.
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
@src/components/ui/ResponsivePicture.tsx
@src/components/ui/Lightbox.tsx
@src/content/zhk-etno-dim.ts
@src/content/company.ts
@src/components/sections/zhk/ZhkHero.tsx
@src/components/sections/zhk/ZhkFactBlock.tsx
@src/components/sections/zhk/ZhkWhatsHappening.tsx
@src/components/sections/zhk/ZhkLakeviewRedirect.tsx
@src/components/sections/home/ContactForm.tsx
@src/pages/ZhkPage.tsx
@src/pages/NotFoundPage.tsx

<interfaces>
From src/components/ui/Lightbox.tsx (Wave 1 plan 04-02):
```typescript
export interface LightboxPhoto { src: string; alt: string; caption?: string; label?: string; }
export function Lightbox(props: { photos, index, onClose, onIndexChange }): JSX.Element;
```

From src/content/zhk-etno-dim.ts (Wave 1 plan 04-01):
```typescript
export const mailtoSubject: string;          // 'Запит про ЖК Етно Дім'
export const mailtoLabel: string;            // 'Написати про ЖК Етно Дім'
export const instagramLabel: string;         // 'Підписатись на оновлення (Instagram)'
```

From src/content/company.ts:
```typescript
export const email: 'vygoda.sales@gmail.com';
export const socials: { telegram: string; instagram: string; facebook: string };
```

From plan 04-06a (just shipped):
```typescript
// ZhkHero({ project }) — full-width hero render, eager+high
// ZhkFactBlock({ project }) — <dl>/<dt>/<dd> fact block
// ZhkWhatsHappening({ project }) — paragraph or null
// ZhkLakeviewRedirect({ url }) — useEffect window.location.assign + branded placeholder
```

From src/data/projects.ts:
```typescript
export const projects: Project[];
export const findBySlug: (slug: string) => Project | undefined;
// findBySlug only returns presentation === 'full-internal' projects per Phase 2 D-04.
```

For etnoDim specifically (locked by Phase 2):
- slug='etno-dim', presentation='full-internal', stage='u-pogodzhenni',
- renders has 8 entries starting with '43615.jpg.webp'.

For flagship/Lakeview (locked by Phase 2):
- slug='lakeview', externalUrl='https://yaroslavpetrukha.github.io/Lakeview/'.

Phase 4 ANI-03 hover (D-30..D-35) on gallery thumbs is APPLIED HERE (D-30 mentions «/zhk/etno-dim 8 gallery thumbnails» in the cross-surface scope) since the gallery thumb buttons are leaf components owned by this plan. Wave 3 plan 04-10 owns FlagshipCard + PipelineCard + Construction thumb hover; gallery thumb hover ships here for completeness.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create ZhkGallery (8-render grid + embedded Lightbox state) and ZhkCtaPair</name>
  <read_first>
    - src/data/projects.ts (etnoDim record verbatim — 8 renders)
    - src/data/types.ts (Project interface)
    - src/components/ui/ResponsivePicture.tsx (prop signature)
    - src/components/ui/Lightbox.tsx (LightboxPhoto + Lightbox props)
    - src/content/zhk-etno-dim.ts (CTA labels + mailto subject)
    - src/content/company.ts (email + socials)
    - src/components/sections/home/ContactForm.tsx (mailto + encodeURIComponent reference pattern lines 28-31)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-16, D-17, D-18, D-30..D-35)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q10 (gallery layout) + §Q17 (mailto cyrillic) + §F (hover triple-effect)
  </read_first>
  <files>src/components/sections/zhk/ZhkGallery.tsx, src/components/sections/zhk/ZhkCtaPair.tsx</files>
  <action>
    **File 1 — `src/components/sections/zhk/ZhkGallery.tsx`:**

    ```tsx
    /**
     * @module components/sections/zhk/ZhkGallery
     *
     * ZHK-01 — 8-render gallery (D-16, D-17). 4-col at ≥lg (1280+),
     * 2-col at md (1024-1279), 1-col at <md. Each cell uses
     * <ResponsivePicture widths={[640, 1280]} loading="lazy"> per Phase 4
     * convention.
     *
     * Click opens shared <Lightbox> (D-17, D-25..D-28). Single page-level
     * useState<number> for current index (-1 = closed).
     *
     * Hover triple-effect (ANI-03 / D-30..D-35) is applied here on the
     * <button> wrapper around each thumb. Class string verbatim from D-31..D-35
     * (RESEARCH §F). Wave 3 plan 04-10 sweeps other surfaces but the gallery
     * thumb hover ships here as part of the same plan since it's local.
     *
     * IMPORT BOUNDARY: forwards `renders/{slug}/{file}` template into
     * ResponsivePicture; never embeds quoted slash-prefixed paths.
     */

    import { useState } from 'react';
    import type { Project } from '../../../data/types';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';
    import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';

    interface Props {
      project: Project;
    }

    export function ZhkGallery({ project }: Props) {
      const [index, setIndex] = useState(-1);

      const photos: LightboxPhoto[] = project.renders.map((file, i) => ({
        src: `renders/${project.slug}/${file}`,
        alt: `${project.title} — рендер ${i + 1}`,
        label: project.title,
      }));

      if (project.renders.length === 0) return null;

      return (
        <section className="bg-bg py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {project.renders.map((file, i) => (
                <button
                  key={file}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Відкрити рендер ${i + 1}`}
                  className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <ResponsivePicture
                    src={`renders/${project.slug}/${file}`}
                    alt={`${project.title} — рендер ${i + 1}`}
                    widths={[640, 1280]}
                    sizes="(min-width: 1280px) 320px, 50vw"
                    loading="lazy"
                    className="w-full aspect-video object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <Lightbox
            photos={photos}
            index={index}
            onClose={() => setIndex(-1)}
            onIndexChange={setIndex}
          />
        </section>
      );
    }
    ```

    NOTES on ZhkGallery:
    - Hover class string is the exact D-31..D-35 spec — `transition-[transform,box-shadow,background-color]`, `duration-200`, `ease-[cubic-bezier(0.22,1,0.36,1)]`, `hover:scale-[1.02]`, `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`, `motion-reduce:hover:scale-100`, `motion-reduce:hover:shadow-none`. The `(193,243,61)` triple is `#C1F33D` decimal — palette-whitelisted as the same color (paletteWhitelist regex matches `#[0-9A-Fa-f]{3,6}` only, NOT decimal rgba; so this rgba in source is fine).
    - NO `transition-all` — only the 3 explicit properties.
    - `aspect-video` = 16:9 — assumes architectural CGI; if any of etnoDim's 8 renders are non-16:9 (e.g., `61996.png.webp` smaller logo render), `object-cover` will crop center; verify visually during impl.
    - The button has `aria-label` for screen readers (icon-only-equivalent — image has alt; button needs its own action label).
    - `focus-visible:outline-accent` keeps Phase 1 D-21 focus-ring contract.

    **File 2 — `src/components/sections/zhk/ZhkCtaPair.tsx`:**

    ```tsx
    /**
     * @module components/sections/zhk/ZhkCtaPair
     *
     * ZHK-01 — CTA pair: primary mailto (accent-fill) + secondary disabled
     * Instagram link (D-18). Side-by-side at ≥lg, stacked at <lg.
     *
     * Mirrors home ContactForm mailto pattern (encodeURIComponent for cyrillic-
     * safe URI per RESEARCH §Q17). Mailto subject literal lives in
     * src/content/zhk-etno-dim.ts (D-29 content-boundary).
     *
     * Secondary button uses href={socials.instagram} (= '#') with cursor-default
     * + aria-label, matching Footer disabled-social pattern (Phase 1 D-08).
     */

    import { email, socials } from '../../../content/company';
    import { mailtoSubject, mailtoLabel, instagramLabel } from '../../../content/zhk-etno-dim';

    export function ZhkCtaPair() {
      const mailHref = `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}`;

      return (
        <section className="bg-bg py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 lg:flex-row lg:justify-center">
            <a
              href={mailHref}
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {mailtoLabel}
            </a>
            <a
              href={socials.instagram}
              aria-label={instagramLabel}
              className="inline-flex items-center border border-text-muted px-8 py-4 text-base font-medium text-text-muted cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {instagramLabel}
            </a>
          </div>
        </section>
      );
    }
    ```

    NOTES:
    - Primary CTA accent-fill matches Phase 3 home ContactForm pattern.
    - Secondary CTA uses `cursor-default` (NOT `cursor-pointer`) since `socials.instagram === '#'` placeholder. Same disabled-state convention as Footer.
    - `aria-label` on the disabled link communicates purpose to screen readers.
  </action>
  <verify>
    <automated>grep -nE "export function ZhkGallery" src/components/sections/zhk/ZhkGallery.tsx && grep -nE "Lightbox" src/components/sections/zhk/ZhkGallery.tsx && grep -nE "useState\\(-1\\)" src/components/sections/zhk/ZhkGallery.tsx && grep -nE "hover:scale-\\[1.02\\]" src/components/sections/zhk/ZhkGallery.tsx && grep -nE "motion-reduce:hover:scale-100" src/components/sections/zhk/ZhkGallery.tsx && grep -nE "export function ZhkCtaPair" src/components/sections/zhk/ZhkCtaPair.tsx && grep -nE "encodeURIComponent\\(mailtoSubject\\)" src/components/sections/zhk/ZhkCtaPair.tsx && ! grep -rnE "transition-all|spring" src/components/sections/zhk/ZhkGallery.tsx src/components/sections/zhk/ZhkCtaPair.tsx && ! grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/zhk/ZhkGallery.tsx src/components/sections/zhk/ZhkCtaPair.tsx && npm run lint</automated>
  </verify>
  <done>
    - 2 files created at correct paths.
    - ZhkGallery: useState<number>(-1), Lightbox wired, hover triple-effect class string verbatim, motion-reduce: variants.
    - ZhkCtaPair: encodeURIComponent on mailto subject, secondary cursor-default.
    - Zero `transition-all` or `spring` in either component.
    - Zero quoted-prefix path literals (importBoundaries clean).
    - `npm run lint` exits 0.
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Visual smoke deferred to Task 2 (page composition) which makes both reachable.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Replace src/pages/ZhkPage.tsx with slug dispatcher</name>
  <read_first>
    - src/pages/ZhkPage.tsx (current Phase 1 stub — to be REPLACED)
    - src/data/projects.ts (`projects`, `findBySlug`)
    - src/pages/NotFoundPage.tsx (default export — used inline for unknown slug case per RESEARCH §Pattern 3)
    - All 4 zhk shell components from plan 04-06a (ZhkHero, ZhkFactBlock, ZhkWhatsHappening, ZhkLakeviewRedirect)
    - The 2 components just created in Task 1 (ZhkGallery, ZhkCtaPair)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-13, D-19)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 3 (full ZhkPage redirect dispatch)
  </read_first>
  <files>src/pages/ZhkPage.tsx</files>
  <action>
    Fully REPLACE `src/pages/ZhkPage.tsx`:

    ```tsx
    /**
     * @module pages/ZhkPage
     *
     * ZHK-01 — Slug dispatcher. Reads :slug param and dispatches:
     *   - 'etno-dim' → render full template (the only full-internal project)
     *   - 'lakeview' → cross-origin redirect via <ZhkLakeviewRedirect>
     *   - 'maietok-vynnykivskyi' / 'nterest' / 'pipeline-4' → <Navigate to="/projects" replace />
     *   - any other slug → render <NotFoundPage /> inline (the route ALREADY matched
     *     `zhk/:slug`, so the App.tsx catch-all `*` will not fire for unknown slugs
     *     under /zhk; we render NotFoundPage explicitly per RESEARCH §Pattern 3).
     *
     * Section ordering on full template (D-13):
     *   ZhkHero → ZhkFactBlock → ZhkWhatsHappening → ZhkGallery → ZhkCtaPair
     *
     * Default export is preserved (App.tsx import unchanged).
     */

    import { useParams, Navigate } from 'react-router-dom';
    import { findBySlug, projects } from '../data/projects';
    import { ZhkHero } from '../components/sections/zhk/ZhkHero';
    import { ZhkFactBlock } from '../components/sections/zhk/ZhkFactBlock';
    import { ZhkWhatsHappening } from '../components/sections/zhk/ZhkWhatsHappening';
    import { ZhkGallery } from '../components/sections/zhk/ZhkGallery';
    import { ZhkCtaPair } from '../components/sections/zhk/ZhkCtaPair';
    import { ZhkLakeviewRedirect } from '../components/sections/zhk/ZhkLakeviewRedirect';
    import NotFoundPage from './NotFoundPage';

    /** Slugs that exist in data/projects but are NOT full-internal. They redirect
     *  to /projects rather than render the template. */
    const REDIRECT_TO_PROJECTS = new Set(['maietok-vynnykivskyi', 'nterest', 'pipeline-4']);

    export default function ZhkPage() {
      const { slug = '' } = useParams<{ slug: string }>();

      // Full-internal template (etno-dim only in v1).
      const project = findBySlug(slug);
      if (project) {
        return (
          <>
            <ZhkHero project={project} />
            <ZhkFactBlock project={project} />
            <ZhkWhatsHappening project={project} />
            <ZhkGallery project={project} />
            <ZhkCtaPair />
          </>
        );
      }

      // Cross-origin flagship redirect (lakeview).
      const flagshipRecord = projects.find(
        (p) => p.slug === slug && p.presentation === 'flagship-external',
      );
      if (flagshipRecord && flagshipRecord.externalUrl) {
        return <ZhkLakeviewRedirect url={flagshipRecord.externalUrl} />;
      }

      // Same-origin redirect for grid-only / aggregate slugs.
      if (REDIRECT_TO_PROJECTS.has(slug)) {
        return <Navigate to="/projects" replace />;
      }

      // Unknown slug — render 404 inline (route /zhk/:slug already matched).
      return <NotFoundPage />;
    }
    ```

    NOTES:
    - DELETE the existing Phase 1 stub body entirely (centered H1 + Mark img placeholder).
    - Default export name `ZhkPage` retained — App.tsx route registration unchanged.
    - The `REDIRECT_TO_PROJECTS` set is hardcoded with the 3 known grid-only/aggregate slugs (matches Phase 2 data: maietok-vynnykivskyi=grid-only, nterest=grid-only, pipeline-4=aggregate). If a future ЖК is added with grid-only or aggregate presentation, manual edit here is required (which is correct — it's a deliberate listing of «known non-template» slugs).
    - Inline NotFoundPage import + render is the pattern from RESEARCH §Pattern 3 / §Q6 — preferred over `<Navigate to="/" />` because user sees a real 404 H1 («404 — сторінку не знайдено»), not a silent redirect.
  </action>
  <verify>
    <automated>grep -nE "export default function ZhkPage" src/pages/ZhkPage.tsx && grep -nE "findBySlug" src/pages/ZhkPage.tsx && grep -nE "<Navigate to=\"/projects\" replace" src/pages/ZhkPage.tsx && grep -nE "<ZhkLakeviewRedirect url" src/pages/ZhkPage.tsx && grep -nE "<NotFoundPage" src/pages/ZhkPage.tsx && grep -nE "REDIRECT_TO_PROJECTS" src/pages/ZhkPage.tsx && ! grep -nE "import markUrl" src/pages/ZhkPage.tsx && npm run build</automated>
  </verify>
  <done>
    - `src/pages/ZhkPage.tsx` body fully replaced — Phase 1 stub gone (no Mark import).
    - Page imports useParams + Navigate from react-router-dom, findBySlug + projects from data, all 6 zhk section components, NotFoundPage.
    - Body dispatches: full template (etno-dim) → ZhkLakeviewRedirect (lakeview) → Navigate (3 grid-only/aggregate slugs) → NotFoundPage (unknown).
    - Default export name is `ZhkPage`.
    - `npm run build` exits 0 (full chain green).
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]**:
      - `/#/zhk/etno-dim` → hero + facts + whatsHappening + 8 thumbs grid + CTA pair.
      - `/#/zhk/etno-dim` click any thumb → lightbox opens; ←/→ cycles within bounds; Esc closes; backdrop click closes.
      - `/#/zhk/lakeview` → branded placeholder line + cube briefly, then browser navigates to https://yaroslavpetrukha.github.io/Lakeview/.
      - `/#/zhk/maietok-vynnykivskyi`, `/#/zhk/nterest`, `/#/zhk/pipeline-4` → redirect to `/projects` (no flicker, react-router same-origin).
      - `/#/zhk/garbage-slug` → 404 NotFoundPage rendered.
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **Files exist**: 2 new section components (ZhkGallery + ZhkCtaPair) under `src/components/sections/zhk/` + 1 page replacement at `src/pages/ZhkPage.tsx`.

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).

4. **Brand invariants**:
   - `! grep -rnE "'/renders/|'/construction/" src/components/sections/zhk/` returns clean.
   - `! grep -rnE "transition-all|spring" src/components/sections/zhk/` returns clean.
   - `! grep -rnE "Pictorial|Rubikon" src/components/sections/zhk/ src/pages/ZhkPage.tsx` returns clean.

5. **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (`npm run dev`):
   - `/#/zhk/etno-dim` → all 5 sections render in order; hero is eager; 8 thumb grid clickable
   - Lightbox: ←/→ cycle, Esc close, backdrop close, body scroll locked while open
   - `/#/zhk/lakeview` → 1-frame branded placeholder, then redirect to lakeview lake
   - `/#/zhk/maietok-vynnykivskyi` → redirect to /projects (no flicker)
   - `/#/zhk/garbage` → 404 H1 «404 — сторінку не знайдено» visible

6. **Bundle delta**: expect +8-15 KB gzipped (Lightbox + 6 zhk sections + useEffect/useState surface).
</verification>

<success_criteria>
- ZHK-01 closed: full /zhk/etno-dim template (hero + fact + whatsHappening + gallery + CTA) + redirect contract for all 4 other slug cases + 404 for unknown.
- All ROADMAP §Phase 4 Success Criteria #2 (template + 8-render gallery + CTAs + redirect dispatch) end-to-end functional.
- Hover triple-effect (D-31..D-35) applied on gallery thumbs in this plan; FlagshipCard + PipelineCard hover deferred to Wave 3 plan 04-10.
- Lightbox keyboard nav + body scroll-lock verified via shared component.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-06b-SUMMARY.md` documenting:
- 3 file paths (2 new sections + 1 page replacement)
- Decision IDs implemented (D-13 full, D-16, D-17, D-18, D-19 full)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta
- Manual smoke results: all 4 redirect dispatch cases + lightbox keyboard/scroll-lock + hover effect verification
- Hero LCP risk note: if `43615.jpg.webp-1920.avif` exceeds 200KB on impl-time disk check, flag for Phase 6 encoder retune (RESEARCH §Q3 risk)
</output>
