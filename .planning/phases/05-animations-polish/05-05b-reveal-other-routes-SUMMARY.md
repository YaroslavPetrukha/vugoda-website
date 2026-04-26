---
phase: 05-animations-polish
plan: 05b
subsystem: ui
tags: [motion, react, animations, scroll-reveal, intersection-observer, stagger, ani-02]

# Dependency graph
requires:
  - phase: 05-animations-polish
    provides: "Plan 05-01 motionVariants.ts SOT (fadeUp + stagger + easeBrand); Plan 05-02 hover-card utility (preserved on MonthGroup thumbs); Plan 05-03 RevealOnScroll component"
provides:
  - "/projects scroll-reveal coverage — page header + StageFilter chip stagger (5×80ms) + PipelineGrid card stagger (1-3×80ms)"
  - "/construction-log scroll-reveal coverage — page header + 4 per-MonthGroup reveals (D-04 enforcement: 1 reveal per month, NOT per photo)"
  - "/contact scroll-reveal coverage — 3 separate reveals (header + ContactDetails + mailto CTA) per D-08"
  - "RevealOnScroll Props extension — HTMLAttributes pass-through (role, aria-label, etc.) forwarded to underlying motion element"
affects: [05-06-animate-presence-layout, 05-07-hero-session-skip, 05-08-no-inline-transition-check]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "External card-stagger wrap: <RevealOnScroll staggerChildren> + per-card <motion.div variants={fadeUp}> wrapper, with shared component (PipelineCard) untouched"
    - "Chip-row stagger via motion.button promotion: each <button> in a 5-element row becomes <motion.button variants={fadeUp}>"
    - "RevealOnScroll HTMLAttributes spread: role/aria-label/etc. forwarded to underlying motion element so reveal wrappers can carry semantic attributes (preserves existing ARIA landmarks)"
    - "Per-MonthGroup section reveal (D-04): the reveal wraps the entire MonthGroup component, NOT each photo — 4 IO observers on /construction-log instead of 50"

key-files:
  created:
    - ".planning/phases/05-animations-polish/05-05b-reveal-other-routes-SUMMARY.md"
  modified:
    - "src/components/ui/RevealOnScroll.tsx — Props now extend HTMLAttributes; rest spread onto motion element AND on the RM-unwrap fallback Tag"
    - "src/components/sections/construction-log/MonthGroup.tsx — outer <section> → <RevealOnScroll as=\"section\">; photos remain plain <button>"
    - "src/pages/ConstructionLogPage.tsx — page-header <section> → <RevealOnScroll as=\"section\">"
    - "src/pages/ProjectsPage.tsx — page-header <header> → <RevealOnScroll className=\"mb-8 flex flex-col gap-2\">"
    - "src/components/sections/projects/StageFilter.tsx — outer <div role=\"group\"> → <RevealOnScroll as=\"div\" staggerChildren role=\"group\">; 5 motion.button children with variants={fadeUp}"
    - "src/components/sections/projects/PipelineGrid.tsx — grid <div> → <RevealOnScroll as=\"div\" staggerChildren>; PipelineCards externally wrapped in <motion.div variants={fadeUp}>"
    - "src/pages/ContactPage.tsx — 3 separate <RevealOnScroll> instances (header + details + CTA); outer <section> stays plain"

key-decisions:
  - "Extended RevealOnScroll Props to spread HTMLAttributes — necessary so D-08's mandate to put role=\"group\"/aria-label on the StageFilter reveal wrapper compiles without losing ARIA semantics"
  - "PipelineCard NOT modified — wrapping each card externally in <motion.div variants={fadeUp}> from PipelineGrid is the conventional Motion pattern for opting an unmodified component into a parent stagger cascade"
  - "ProjectsPage outer <section className=\"bg-bg py-24\"> stays plain (carries page background) — page-header reveal lives inside, not around the section, to avoid 4-layer nested reveals"
  - "ContactPage outer <section> stays plain; the 3 reveals D-08 maps live as siblings inside the width-container <div>"

patterns-established:
  - "Pattern: external-wrap stagger child — when the cascading child is a shared component you don't want to modify, wrap it from the parent grid in <motion.div variants={fadeUp}>"
  - "Pattern: HTMLAttributes pass-through on reveal wrappers — RevealOnScroll now accepts arbitrary HTML attributes (role, aria-label, data-*) forwarded to the underlying motion element"

requirements-completed: [ANI-02]

# Metrics
duration: 4m
completed: 2026-04-26
---

# Phase 05 Plan 05b: Reveal Other Routes Summary

**Scroll-reveal coverage extended to /construction-log (per-MonthGroup, NOT per-photo, D-04), /projects (page header + 80ms StageFilter chip stagger + 80ms PipelineGrid card stagger, D-08), and /contact (3 separate reveals per D-08).**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-26T06:29:35Z
- **Completed:** 2026-04-26T06:33:44Z
- **Tasks:** 3
- **Files modified:** 7 (one of which — RevealOnScroll.tsx — touched as Rule 3 deviation)

## Accomplishments

- /construction-log: page header + 4 per-MonthGroup reveals = 5 IO observers (D-04 enforcement: SHOULD NOT be 50)
- /projects: page-header reveal + StageFilter inner stagger (5 motion.button × 80ms) + PipelineGrid inner stagger (1-3 cards × 80ms)
- /contact: 3 separate reveals (header landmark preserved via `as="header"`, ContactDetails, mailto CTA)
- RevealOnScroll widened: now forwards HTML attributes (role, aria-label) to underlying motion element — necessary so role-bearing wrappers can be reveal targets without losing ARIA semantics

## Task Commits

Each task committed atomically with `--no-verify` (parallel-execution context):

1. **Task 1: MonthGroup + ConstructionLogPage header reveal wraps** — `a638bfd` (feat)
2. **Task 2: ProjectsPage header + StageFilter chip stagger + PipelineGrid card stagger** — `b1183e8` (feat)
3. **Task 3: ContactPage 3 reveals per D-08** — `fb05f97` (feat)

## Files Created/Modified

- `src/components/ui/RevealOnScroll.tsx` — Props now extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`; `...rest` spread onto both motion-component path and reduced-motion Tag path
- `src/components/sections/construction-log/MonthGroup.tsx` — outer `<section className="bg-bg py-16">` → `<RevealOnScroll as="section" className="bg-bg py-16">` (only the boundary tags changed; ALL inner content byte-identical: H2, grid `<div>`, plain `<button>` thumbs preserving `hover-card`, `<Lightbox>`)
- `src/pages/ConstructionLogPage.tsx` — page-header `<section className="bg-bg pt-24 pb-8">` → `<RevealOnScroll as="section" className="bg-bg pt-24 pb-8">` (constructionLog.map body unchanged)
- `src/pages/ProjectsPage.tsx` — outer `<section className="bg-bg py-24">` STAYS plain; page-header `<header className="mb-8 flex flex-col gap-2">` → `<RevealOnScroll className="mb-8 flex flex-col gap-2">`; FlagshipCard / StageFilter / body siblings unchanged
- `src/components/sections/projects/StageFilter.tsx` — outer `<div role="group">` → `<RevealOnScroll as="div" staggerChildren role="group" aria-label="Фільтр за стадіями" className="my-12 flex flex-wrap gap-3">`; 5 buttons promoted to `<motion.button … variants={fadeUp}>`; `chipClass()` helper unchanged
- `src/components/sections/projects/PipelineGrid.tsx` — grid `<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">` → `<RevealOnScroll as="div" staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">`; each `<PipelineCard project={p} />` wrapped externally in `<motion.div key={p.slug} variants={fadeUp}>`; `if (filtered.length === 0) return null;` early-return preserved
- `src/pages/ContactPage.tsx` — outer `<section className="bg-bg py-24">` STAYS plain; 3 reveals as siblings of width-container: (1) `<RevealOnScroll as="header" className="flex flex-col gap-4">` — preserves `<header>` landmark; (2) `<RevealOnScroll>` wrapping `<ContactDetails />`; (3) `<RevealOnScroll className="pt-4">` wrapping mailto `<a>`. mailto href construction unchanged

### Verbatim diff — MonthGroup (D-04 critical enforcement)

```diff
 import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
@@
   return (
-    <section className="bg-bg py-16">
+    <RevealOnScroll as="section" className="bg-bg py-16">
       <div className="mx-auto max-w-7xl px-6">
@@
       <Lightbox … />
-    </section>
+    </RevealOnScroll>
```

`grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` returns exactly **1**. Photos stay as plain `<button>` (no per-photo motion components, no nested staggerChildren) — D-04 explicit.

### Verbatim diff — StageFilter (B5 chip stagger)

```diff
 import { useSearchParams } from 'react-router-dom';
+import { motion } from 'motion/react';
 import type { Stage } from '../../../data/types';
 import { STAGES, stageLabel, isStage } from '../../../lib/stages';
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
+import { fadeUp } from '../../../lib/motionVariants';
@@
-    <div role="group" aria-label="Фільтр за стадіями" className="my-12 flex flex-wrap gap-3">
-      <button
+    <RevealOnScroll
+      as="div"
+      staggerChildren
+      role="group"
+      aria-label="Фільтр за стадіями"
+      className="my-12 flex flex-wrap gap-3"
+    >
+      <motion.button
         type="button"
         onClick={() => setActive(null)}
         aria-pressed={active === null}
+        variants={fadeUp}
         className={chipClass(active === null)}
       >
         Усі
-      </button>
+      </motion.button>
       {STAGES.map((s) => (
-        <button
+        <motion.button
           key={s}
           type="button"
           onClick={() => setActive(s)}
           aria-pressed={active === s}
+          variants={fadeUp}
           className={chipClass(active === s)}
         >
           {stageLabel(s)} ({counts[s]})
-        </button>
+        </motion.button>
       ))}
-    </div>
+    </RevealOnScroll>
```

5 motion.button children — total cascade 5 × 80 ms = 400 ms.

### Verbatim diff — PipelineGrid (B5 card stagger; PipelineCard untouched)

```diff
+import { motion } from 'motion/react';
 import type { Project, Stage } from '../../../data/types';
 import { PipelineCard } from './PipelineCard';
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
+import { fadeUp } from '../../../lib/motionVariants';
@@
   if (filtered.length === 0) return null;

   return (
-    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
+    <RevealOnScroll
+      as="div"
+      staggerChildren
+      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
+    >
       {filtered.map((p) => (
-        <PipelineCard key={p.slug} project={p} />
+        <motion.div key={p.slug} variants={fadeUp}>
+          <PipelineCard project={p} />
+        </motion.div>
       ))}
-    </div>
+    </RevealOnScroll>
   );
```

PipelineCard.tsx **NOT touched** — wrapping done externally so the shared component stays single-purpose.

### Verbatim diff — ContactPage (B5 — 3 separate reveals)

```diff
 import { ContactDetails } from '../components/sections/contact/ContactDetails';
+import { RevealOnScroll } from '../components/ui/RevealOnScroll';
@@
       <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
-        <header className="flex flex-col gap-4">
+        <RevealOnScroll as="header" className="flex flex-col gap-4">
           <h1 className="font-bold text-6xl text-text">{contactPageHeading}</h1>
           <p className="text-base text-text-muted">{contactPageSubtitle}</p>
-        </header>
+        </RevealOnScroll>

-        <ContactDetails />
+        <RevealOnScroll>
+          <ContactDetails />
+        </RevealOnScroll>

-        <div className="pt-4">
+        <RevealOnScroll className="pt-4">
           <a href={href} … >{contactPageCta}</a>
-        </div>
+        </RevealOnScroll>
       </div>
```

`grep -nc '<RevealOnScroll' src/pages/ContactPage.tsx` returns exactly **3** — D-08 verbatim.

## Per-route reveal counts (post-05-05b)

| Route              | Reveals | Composition |
|--------------------|--------:|-------------|
| /construction-log  |       5 | 1 page header + 4 per-MonthGroup |
| /projects          |     2-3 | 1 page header + 1 StageFilter inner + 1 PipelineGrid inner (only when grid renders, i.e. active ≠ buduetsya/zdano) |
| /contact           |       3 | header + ContactDetails + mailto CTA |

Cumulative count of `<RevealOnScroll` occurrences across `src/components/sections/` and `src/pages/` post-05-05b: **25** (target ≥18 per VALIDATION SC#2). Includes contributions from 05-04 (home), 05-05a (zhk), and this plan.

`grep -rnE 'staggerChildren' src/components/` post-05-05b returns **15 occurrences** (covers VALIDATION SC#2 stagger-surface map and includes the new chip-row + card-grid orchestrators added here).

## Decisions Made

- **RevealOnScroll Props widened to HTMLAttributes** — Plan instructed to put `role="group" aria-label="…"` on the StageFilter reveal wrapper, but the original Plan 05-03 Props interface dropped any prop other than `as`/`variant`/`staggerChildren`/`delayChildren`/`className`/`children`. Extending Props to `Omit<HTMLAttributes<HTMLElement>, 'children'>` and spreading `...rest` onto the rendered element (both motion path and RM-unwrap path) was the minimum-surface fix that lets reveal wrappers carry ARIA semantics without losing them.
- **PipelineCard not modified** — wrapping externally in `<motion.div variants={fadeUp}>` keeps PipelineCard a presentational component and follows the conventional Motion pattern for opting an existing component into a parent stagger.
- **Outer `<section>` on /projects and /contact stays plain** — these sections carry page background + padding. Wrapping them in RevealOnScroll would create a redundant outer reveal layered above the inner per-block reveals; D-08 explicitly maps the inner per-block reveals.
- **/construction-log: page header reveal lives in ConstructionLogPage; per-month reveal lives INSIDE MonthGroup.tsx** — guarantees `grep -nc '<RevealOnScroll' MonthGroup.tsx = 1` (D-04 VALIDATION row) and yields exactly 5 IO observers on the route.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Extended RevealOnScroll Props to forward HTMLAttributes**
- **Found during:** Task 2 (StageFilter edit)
- **Issue:** Plan instructed `<RevealOnScroll as="div" staggerChildren role="group" aria-label="Фільтр за стадіями" …>` but the existing Props interface from Plan 05-03 declared only `{ as, variant, staggerChildren, delayChildren, className, children }`. `tsc --noEmit` hard-failed: `Property 'role' does not exist on type 'IntrinsicAttributes & Props'`.
- **Fix:** Widened `interface Props` to `extends Omit<HTMLAttributes<HTMLElement>, 'children'>`; destructured `...rest` and spread onto both the motion `<Component>` path and the reduced-motion `<Tag>` path so any HTML/ARIA attribute forwards correctly.
- **Files modified:** `src/components/ui/RevealOnScroll.tsx`
- **Verification:** `npm run lint` exits 0; check-brand 5/5 PASS; `<RevealOnScroll role="group" aria-label="…">` now compiles and forwards both attributes to the rendered motion.div (and to the plain Tag in RM mode).
- **Committed in:** `b1183e8` (Task 2 commit — kept atomic with the StageFilter/PipelineGrid/ProjectsPage edits that motivated it)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Strictly necessary. The plan EXPLICITLY required role="group" + aria-label to live on the reveal wrapper (D-08 + accessibility); the prior RevealOnScroll surface couldn't accept those props. The fix is additive (existing call-sites unaffected — extra props just default to undefined) and preserves ARIA semantics that would otherwise have been lost.

## Issues Encountered

- The plan's Task 3 verify gate `grep -n 'mailto:' src/pages/ContactPage.tsx | wc -l = 1` is too strict — the file's existing module doc-block contains the literal `mailto:` in a comment line (`a[href=mailto:]`), so the grep returned 2 (1 comment + 1 actual `href = `mailto:…` const). This was true on the unmodified file too. The functional intent — mailto href construction preserved exactly — was confirmed via a more targeted grep for the template literal: `grep -n 'mailto:\${' src/pages/ContactPage.tsx | wc -l = 1`. No deviation needed; just noted.

## User Setup Required

None — no external service configuration introduced. Reveal coverage is pure client-side rendering.

## Next Phase Readiness

- /projects, /construction-log, /contact now match D-08 reveal coverage exactly.
- Combined with 05-04 (home) and 05-05a (zhk), Wave 2/3 reveal-application work is fully shipped — Plan 05-08 grep gate `! grep -rn 'transition={{' src/` continues to exit 1 (zero inline transitions added).
- RevealOnScroll's HTMLAttributes pass-through is now available to any future reveal call-site that needs role/aria/data-* on the wrapper itself.
- Plan 05-06 (AnimatePresence layout) and 05-07 (Hero session-skip) can proceed independently.

## Self-Check

Verifying claims before sign-off.

**Files claimed modified:**

| Path                                                                  | Found? |
|-----------------------------------------------------------------------|--------|
| src/components/ui/RevealOnScroll.tsx                                  | FOUND  |
| src/components/sections/construction-log/MonthGroup.tsx               | FOUND  |
| src/pages/ConstructionLogPage.tsx                                     | FOUND  |
| src/pages/ProjectsPage.tsx                                            | FOUND  |
| src/components/sections/projects/StageFilter.tsx                      | FOUND  |
| src/components/sections/projects/PipelineGrid.tsx                     | FOUND  |
| src/pages/ContactPage.tsx                                             | FOUND  |

**Commits claimed:**

| Hash    | Found in `git log`? |
|---------|---------------------|
| a638bfd | FOUND               |
| b1183e8 | FOUND               |
| fb05f97 | FOUND               |

**Per-file critical gates (re-checked at SUMMARY time):**

- `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` = 1 — OK
- `grep -nc '<RevealOnScroll' src/pages/ConstructionLogPage.tsx` = 1 — OK
- `grep -nc '<RevealOnScroll' src/pages/ProjectsPage.tsx` = 1 — OK
- `grep -nc '<RevealOnScroll' src/components/sections/projects/StageFilter.tsx` = 1 — OK
- `grep -nc '<RevealOnScroll' src/components/sections/projects/PipelineGrid.tsx` = 1 — OK
- `grep -nc '<RevealOnScroll' src/pages/ContactPage.tsx` = 3 — OK
- `grep -n '<motion.button' src/components/sections/projects/StageFilter.tsx | wc -l` = 2 — OK
- `grep -rn 'transition={{' src/` returns 0 lines — OK (Phase 5 SC#1 grep gate clean)
- `npm run lint` exits 0 — OK
- `npx tsx scripts/check-brand.ts` reports 5/5 PASS — OK

## Self-Check: PASSED

---
*Phase: 05-animations-polish*
*Completed: 2026-04-26*
