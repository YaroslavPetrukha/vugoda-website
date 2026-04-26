---
phase: 05-animations-polish
plan: 05a
type: execute
wave: 3
depends_on: [05-01-foundation-sot, 05-02-hover-card-utility, 05-03-reveal-on-scroll-component]
files_modified:
  - src/components/sections/zhk/ZhkHero.tsx
  - src/components/sections/zhk/ZhkFactBlock.tsx
  - src/components/sections/zhk/ZhkWhatsHappening.tsx
  - src/components/sections/zhk/ZhkGallery.tsx
  - src/components/sections/zhk/ZhkCtaPair.tsx
autonomous: true
requirements: [ANI-02]
must_haves:
  truths:
    - "Every below-fold section on /zhk/etno-dim is wrapped in <RevealOnScroll>"
    - "ZhkHero (LCP target on /zhk/etno-dim) uses opacity-only `fade` variant per D-09 — no Y-translate that would delay paint"
    - "ZhkGallery 8-render gallery uses 80ms stagger across the 8 thumbnails (D-05) inside a semantic `<ul>` of `<motion.li>` items"
  artifacts:
    - path: src/components/sections/zhk/ZhkGallery.tsx
      provides: "Section-level reveal + 80ms stagger across 8 thumbs (motion.li variants={fadeUp} inside <ul>) per D-05"
      contains: "RevealOnScroll"
    - path: src/components/sections/zhk/ZhkHero.tsx
      provides: "Reveal with `variant={fade}` (opacity-only) per D-09 to protect LCP"
      contains: "variant={fade}"
  key_links:
    - from: "ZhkHero.tsx"
      to: "src/lib/motionVariants.ts fade export"
      via: "named import + variant prop"
      pattern: "import \\{ fade \\}"
    - from: "ZhkGallery.tsx 8-thumb cascade"
      to: "src/lib/motionVariants.ts fadeUp export"
      via: "motion.li variants={fadeUp} children of staggerChildren wrapper"
      pattern: "<motion\\.li.*variants=\\{fadeUp\\}"
---

<objective>
Apply `<RevealOnScroll>` coverage to `/zhk/etno-dim` per CONTEXT D-08:
- **ZhkHero** — single reveal with `variant={fade}` (D-09 — opacity-only protects LCP)
- **ZhkFactBlock** — single section reveal
- **ZhkWhatsHappening** — single section reveal (preserves the existing early-return guard)
- **ZhkGallery** — section reveal + 80ms stagger across 8 thumbs (D-05) using semantic `<ul>` + `<motion.li>` per D-05 verbatim
- **ZhkCtaPair** — single section reveal

Critical D-09 enforcement: `ZhkHero` is the LCP target on /zhk/etno-dim. A Y-translate on its hero render would delay paint and regress LCP. Pass `variant={fade}` (opacity-only sibling — declared in 05-01 motionVariants.ts) explicitly to that one wrapper.

Critical D-05 enforcement (B4 fix from review): the gallery uses semantic `<ul>` containing `<motion.li>` children per D-05 verbatim — «Thumb itself uses `<motion.li variants={fadeUp}>` inside the gallery `<ul>`». The clickable surface is a nested `<button>` inside each `<li>`, preserving the Phase 4 hover-card utility, focus-visible outline, and aria-label/onClick from the existing implementation. This is the literal compliance with D-05 and avoids the «non-list role on grid container» a11y concern.

Output: 5 files modified inside `/zhk/etno-dim` route. Plan 05-05b covers /projects, /construction-log, /contact. Both 05-05a and 05-05b are Wave 3 and depend on `[05-01, 05-03]` only (no inter-dependency).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/05-animations-polish/05-CONTEXT.md
@.planning/phases/05-animations-polish/05-RESEARCH.md
@.planning/phases/05-animations-polish/05-VALIDATION.md
@.planning/phases/05-animations-polish/05-01-foundation-sot-SUMMARY.md
@.planning/phases/05-animations-polish/05-03-reveal-on-scroll-component-SUMMARY.md
@src/pages/ZhkPage.tsx
@src/components/sections/zhk/ZhkHero.tsx
@src/components/sections/zhk/ZhkFactBlock.tsx
@src/components/sections/zhk/ZhkWhatsHappening.tsx
@src/components/sections/zhk/ZhkGallery.tsx
@src/components/sections/zhk/ZhkCtaPair.tsx
</context>

<interfaces>
<!-- RevealOnScroll component signature (from 05-03): -->
```tsx
import { RevealOnScroll } from '../../ui/RevealOnScroll';   // for files in src/components/sections/*/

<RevealOnScroll as="section" className="...">  // section-level reveal
<RevealOnScroll variant={fade} as="section" className="...">  // LCP-safe opacity-only (D-09)
<RevealOnScroll staggerChildren className="...">  // 80ms cascade orchestrator
```

<!-- For stagger to cascade, children must be motion.{tag} variants={fadeUp}. -->

From src/lib/motionVariants.ts:
```ts
export const fadeUp: Variants;   // { hidden: { opacity: 0, y: 24 }, visible: ... }
export const fade: Variants;     // { hidden: { opacity: 0 }, visible: ... } — opacity-only sibling
```

ZhkPage outer composition (read-only, NOT modified by this plan):
```tsx
return (
  <>
    <ZhkHero project={project} />
    <ZhkFactBlock project={project} />
    <ZhkWhatsHappening project={project} />
    <ZhkGallery project={project} />
    <ZhkCtaPair />
  </>
);
```
ZhkPage CANNOT be wrapped at the page level because it contains the redirect/404 fallback paths (`<ZhkLakeviewRedirect>`, `<NotFoundPage/>`, `<Navigate/>`) — wrapping all of those in motion would either cause flicker on the redirect path (RESEARCH Risk 5) or trigger spurious reveals on the 404 path. Each section component owns its own reveal.

Current ZhkGallery.tsx markup (verbatim — for B4 reference):
```tsx
<section className="bg-bg py-16">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {project.renders.map((file, i) => (
        <button key={file} type="button" onClick={() => setIndex(i)} aria-label={...}
          className="block overflow-hidden bg-bg-surface transition-... focus-visible:...">
          <ResponsivePicture .../>
        </button>
      ))}
    </div>
  </div>
  <Lightbox .../>
</section>
```

After 05-02 (hover-card consolidation), the long inline transition class collapses to `hover-card`. After this plan (05-05a Task 2), the grid container becomes `<ul>` and each thumb becomes `<motion.li>` containing a nested `<button>`.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Wrap ZhkPage section components — ZhkHero (fade variant), ZhkFactBlock, ZhkWhatsHappening, ZhkCtaPair (D-08 + D-09)</name>
  <read_first>
    - src/components/sections/zhk/ZhkHero.tsx (LCP target — must use D-09 fade variant)
    - src/components/sections/zhk/ZhkFactBlock.tsx
    - src/components/sections/zhk/ZhkWhatsHappening.tsx
    - src/components/sections/zhk/ZhkCtaPair.tsx
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fade export — opacity-only)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08, §D-09 (ZhkHero opacity-only override)
  </read_first>
  <files>
    src/components/sections/zhk/ZhkHero.tsx,
    src/components/sections/zhk/ZhkFactBlock.tsx,
    src/components/sections/zhk/ZhkWhatsHappening.tsx,
    src/components/sections/zhk/ZhkCtaPair.tsx
  </files>
  <behavior>
    - Test 1: ZhkHero outer `<section>` becomes `<RevealOnScroll as="section" variant={fade} className="bg-bg">` — fade variant explicit per D-09 (opacity-only, no Y-translate)
    - Test 2: ZhkFactBlock outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">` (default fadeUp variant — fact block is not LCP)
    - Test 3: ZhkWhatsHappening outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg-surface py-16">`
    - Test 4: ZhkCtaPair outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">`
    - Test 5: ZhkHero imports `fade` named export from motionVariants (covers D-09)
    - Test 6: All 4 components import `RevealOnScroll`
    - Test 7: Inner content (ResponsivePicture in ZhkHero, dl/dt/dd in ZhkFactBlock, h2/p in ZhkWhatsHappening, mailto + Instagram anchors in ZhkCtaPair) byte-identical to pre-edit
  </behavior>
  <action>
    Edit 4 files. Pattern: outer `<section>` → `<RevealOnScroll as="section" ...>` . Only ZhkHero gets `variant={fade}`.

    **File 1 — `src/components/sections/zhk/ZhkHero.tsx`:**

    Add imports (after the existing `ResponsivePicture` import on line 17):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fade } from '../../../lib/motionVariants';
    ```

    Replace the return JSX (current lines 23-39) with:
    ```tsx
    return (
      <RevealOnScroll as="section" variant={fade} className="bg-bg">
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
      </RevealOnScroll>
    );
    ```

    Critical: `variant={fade}` is the D-09 LCP-safe override — opacity 0→1 only, NO Y-translate. The `loading="eager"` and `fetchPriority="high"` props on ResponsivePicture remain — they fire HTML-parse-time fetch start regardless of the React reveal mechanism. The fade-in plays AFTER the image has decoded; it does NOT delay paint. Phase 6 LCP audit measures this on /zhk/etno-dim cold load (VALIDATION manual gate).

    **File 2 — `src/components/sections/zhk/ZhkFactBlock.tsx`:**

    Add import (after the existing `etnoDimAddress` import on line 17):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-16">...</section>` (lines 24-43) and change opening to `<RevealOnScroll as="section" className="bg-bg py-16">` and closing to `</RevealOnScroll>`. Inner `<div className="mx-auto max-w-7xl px-6">` and `<dl>` block stay byte-identical.

    **File 3 — `src/components/sections/zhk/ZhkWhatsHappening.tsx`:**

    Add import (after the existing `Project` type import on line 11):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    NOTE: this component has an `if (!project.whatsHappening) return null;` early return on line 18. The early return STAYS — the RevealOnScroll wrapper applies only to the rendered branch. Locate `<section className="bg-bg-surface py-16">...</section>` (lines 19-26) and change opening to `<RevealOnScroll as="section" className="bg-bg-surface py-16">` and closing to `</RevealOnScroll>`. Inner h2 + p stay byte-identical.

    **File 4 — `src/components/sections/zhk/ZhkCtaPair.tsx`:**

    Add import (after the existing `instagramLabel` import on line 18):
    ```tsx
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    ```

    Locate the outer `<section className="bg-bg py-16">...</section>` (lines 23-41) and change opening to `<RevealOnScroll as="section" className="bg-bg py-16">` and closing to `</RevealOnScroll>`. Inner `<div className="mx-auto flex max-w-3xl ...">` and the two anchors (mailto + Instagram) stay byte-identical.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced in plan-action text.
  </action>
  <verify>
    <automated>FAIL=0; for f in src/components/sections/zhk/ZhkHero.tsx src/components/sections/zhk/ZhkFactBlock.tsx src/components/sections/zhk/ZhkWhatsHappening.tsx src/components/sections/zhk/ZhkCtaPair.tsx; do grep -q "import { RevealOnScroll } from '../../ui/RevealOnScroll'" "$f" || { echo "MISSING import in $f"; FAIL=1; }; grep -nc '<RevealOnScroll' "$f" | tr -d ' ' | grep -q '^1$' || { echo "wrong RevealOnScroll count in $f"; FAIL=1; }; done; grep -n 'variant={fade}' src/components/sections/zhk/ZhkHero.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ZhkHero D-09 fade variant missing"; FAIL=1; }; grep -n "import { fade }" src/components/sections/zhk/ZhkHero.tsx | wc -l | tr -d ' ' | grep -q '^1$' || { echo "ZhkHero fade import missing"; FAIL=1; }; if [ $FAIL -eq 0 ]; then npm run lint && echo OK || { echo FAIL lint; exit 1; }; else exit 1; fi</automated>
  </verify>
  <done>
    - All 4 zhk files import RevealOnScroll
    - All 4 files have exactly 1 `<RevealOnScroll` occurrence each
    - ZhkHero specifically uses `variant={fade}` AND imports `fade` from motionVariants (D-09 LCP protection)
    - `npm run lint` exits 0
    - Inner content (ResponsivePicture, dl/dt/dd, h2/p, mailto + Instagram anchors) byte-identical to pre-edit forms
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Wrap ZhkGallery with section reveal + 80ms stagger across 8 thumbs as semantic ul/motion.li (D-05 verbatim)</name>
  <read_first>
    - src/components/sections/zhk/ZhkGallery.tsx (CURRENT post-05-02 form: button[hover-card] elements inside a 4-col `<div>` grid; after 05-02 the long inline transition class is replaced with `hover-card`)
    - src/components/ui/RevealOnScroll.tsx
    - src/lib/motionVariants.ts (fadeUp)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-05 («Thumb itself uses `<motion.li variants={fadeUp}>` inside the gallery `<ul>`», 8-render gallery, 80ms stagger, total cascade 640ms within SC#2 budget)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-08 (zhk gallery section-level reveal + per-thumb stagger)
  </read_first>
  <files>src/components/sections/zhk/ZhkGallery.tsx</files>
  <behavior>
    - Test 1: Outer `<section>` becomes `<RevealOnScroll as="section" className="bg-bg py-16">`
    - Test 2: Inner thumb container changes from `<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">` to `<RevealOnScroll as="ul" staggerChildren className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" role="list">` — semantic `<ul>` per D-05 verbatim, `role="list"` to defend against Safari list-style override removing the implicit list role
    - Test 3: Each thumb becomes `<motion.li key={file} variants={fadeUp}>` containing a nested `<button type="button" onClick={() => setIndex(i)} aria-label={...} className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">` — preserves all original button props and the post-05-02 hover-card class
    - Test 4: Lightbox component renders OUTSIDE staggerChildren cascade (it's a portal sibling, not a thumb)
    - Test 5: Total: 2 `<RevealOnScroll` opens in this file (outer section + inner staggerChildren as `<ul>`)
    - Test 6: Existing hover-card class on each nested `<button>` preserved (no regression of 05-02)
    - Test 7: NO `<motion.button>` in this file (B4 — D-05 mandates `<motion.li>` containing nested `<button>`, not motion-fied button as direct grid child)
  </behavior>
  <action>
    Edit `src/components/sections/zhk/ZhkGallery.tsx`. Two changes:

    **Change A — imports.** After the existing `Lightbox` import on line 26, add:
    ```tsx
    import { motion } from 'motion/react';
    import { RevealOnScroll } from '../../ui/RevealOnScroll';
    import { fadeUp } from '../../../lib/motionVariants';
    ```

    **Change B — JSX rewrite.** Replace the return JSX (current lines 43-74, post-05-02 form) with:
    ```tsx
    return (
      <RevealOnScroll as="section" className="bg-bg py-16">
        <div className="mx-auto max-w-7xl px-6">
          <RevealOnScroll
            as="ul"
            staggerChildren
            role="list"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {project.renders.map((file, i) => (
              <motion.li key={file} variants={fadeUp} className="list-none">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Відкрити рендер ${i + 1}`}
                  className="block w-full overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
              </motion.li>
            ))}
          </RevealOnScroll>
        </div>
        <Lightbox
          photos={photos}
          index={index}
          onClose={() => setIndex(-1)}
          onIndexChange={setIndex}
        />
      </RevealOnScroll>
    );
    ```

    Notes (B4 — D-05 literal compliance):
    - The grid container is now a SEMANTIC `<ul>` per D-05 verbatim («inside the gallery `<ul>`»). Tailwind utilities still drive the grid layout — `<ul>` accepts `grid grid-cols-* gap-*` classes identically to `<div>`.
    - `role="list"` defends against Safari's `list-style: none` heuristic that strips the implicit list role; explicit `role="list"` keeps the `<ul>` discoverable to assistive tech as a list of 8 items.
    - Each `<motion.li>` carries `className="list-none"` so the default browser list-marker (bullet) is suppressed — Tailwind's `list-none` utility sets `list-style-type: none`. The `<motion.li>` is the cascade child carrying `variants={fadeUp}`.
    - The original `<button>` is now NESTED inside the `<li>`. All original props preserved (type, onClick, aria-label). `className` includes `w-full` so the button fills the `<li>` width-wise (otherwise nested buttons collapse to inline width).
    - hover-card class preserved exactly on the nested button (post-05-02 form).
    - `<Lightbox>` renders OUTSIDE the staggerChildren cascade — it's a sibling of the inner `<ul>`, inside the outer section reveal. Lightbox uses native `<dialog>` portal; it lives at z-index higher than RevealOnScroll wrapper per CONTEXT D-16.
    - Phase 4 D-25 lightbox open-anim coexists with reveal — sequential lifecycle phases, not overlapping (D-05 explicit).
    - `key={file}` on `<motion.li>` (React reconciliation), NOT on the inner button.

    Doc-block self-screen: no `transition={{`, `Pictorial`, `Rubikon`, `/renders/`, `/construction/` literals introduced in plan-action prose. The literal `renders/${project.slug}/${file}` is a template-literal computed at runtime via lib/assetUrl composition (Phase 2 D-32 path-prefix rule); not the forbidden bare-string `'/renders/...'` form.
  </action>
  <verify>
    <automated>grep -nc '<RevealOnScroll' src/components/sections/zhk/ZhkGallery.tsx | tr -d ' ' | grep -q '^2$' && grep -n 'staggerChildren' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -nE 'as="ul"' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<motion.li' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<motion.button' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^0$' && grep -n 'variants={fadeUp}' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'hover-card' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n '<Lightbox' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'role="list"' src/components/sections/zhk/ZhkGallery.tsx | wc -l | tr -d ' ' | grep -q '^1$' && npm run lint && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - 2 `<RevealOnScroll` occurrences (outer section + inner `as="ul"` staggerChildren)
    - 1 `<motion.li>` with `variants={fadeUp}` (the gallery thumb cascade child per D-05)
    - 0 `<motion.button>` occurrences (B4 — D-05 mandates motion.li, not motion.button)
    - 1 `as="ul"` and 1 `role="list"` (semantic markup + Safari defence)
    - hover-card class preserved on the NESTED `<button>` inside each `<motion.li>` (post-05-02 work intact)
    - Lightbox component still rendered (functionality preserved)
    - `npm run lint` exits 0
  </done>
</task>

</tasks>

<verification>
After both tasks, this plan contributes 6 `<RevealOnScroll` occurrences across /zhk/etno-dim:
- ZhkHero: 1 (with `variant={fade}`)
- ZhkFactBlock: 1
- ZhkWhatsHappening: 1
- ZhkGallery: 2 (section + inner `<ul>` stagger)
- ZhkCtaPair: 1

Per-file critical gates (from VALIDATION):
- `grep -n 'variant={fade}' src/components/sections/zhk/ZhkHero.tsx` returns 1 (LCP-safe override — D-09)
- `grep -nc '<RevealOnScroll' src/components/sections/zhk/ZhkGallery.tsx` returns 2
- `grep -n '<motion.li' src/components/sections/zhk/ZhkGallery.tsx` returns 1 (D-05 literal compliance)
- `grep -n '<motion.button' src/components/sections/zhk/ZhkGallery.tsx` returns 0 (B4 — no motion-button as direct grid child)

`npm run build` exits 0 — full pipeline. Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` still exits 1 (no inline transitions added).

Bundle: minimal — RevealOnScroll already pulled in by 05-04. Net add ~0.2 KB gzipped (motion.li component path).
</verification>

<success_criteria>
- [ ] All 4 ZhkPage section components wrapped (ZhkHero with `variant={fade}`, ZhkFactBlock, ZhkWhatsHappening, ZhkCtaPair)
- [ ] ZhkGallery uses section + 80ms stagger across 8 thumbs in semantic `<ul>` of `<motion.li>` per D-05 verbatim (B4 fix)
- [ ] Nested `<button>` inside each `<motion.li>` preserves Phase 4 hover-card + focus-visible behaviour
- [ ] hover-card class on ZhkGallery thumbs preserved (no regression of 05-02)
- [ ] `npm run build` exits 0 with check-brand 5/5 PASS (after 05-08 lands; count-agnostic regex tolerates either 4/4 or 5/5)
- [ ] Phase 5 SC#1 grep gate clean (zero inline transition objects)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-05a-reveal-zhk-page-SUMMARY.md` documenting:
- Per-file reveal count (ZhkHero 1, ZhkFactBlock 1, ZhkWhatsHappening 1, ZhkGallery 2, ZhkCtaPair 1 — total 6 on /zhk/etno-dim)
- Verbatim diff of ZhkGallery (D-05 + B4 — must remain `<ul>` with `<motion.li>` cascade children, NOT `<motion.button>` direct children)
- Verbatim diff of ZhkHero (D-09 fade variant — must remain LCP-safe)
- Bundle size delta vs Plan 05-04 baseline (expected: minimal — same modules already reachable)
- Note for Phase 6 LCP audit: /zhk/etno-dim cold load Lighthouse measurement validates D-09 fade-only choice
- Note for Phase 7 a11y audit: confirm screen reader announces «list, 8 items» on the gallery (`<ul role="list">` + 8 `<li>`)
</output>
</content>
</invoke>