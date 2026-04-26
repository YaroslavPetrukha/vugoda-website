---
phase: 05-animations-polish
plan: 04
subsystem: animations-polish/home-reveals
tags:
  - animation
  - reveal-on-scroll
  - home-page
  - stagger
  - ANI-02
requirements:
  - ANI-02
dependency-graph:
  requires:
    - 05-01-foundation-sot   # motionVariants.ts (fadeUp, easeBrand, durations)
    - 05-02-hover-card-utility  # hover-card class on PortfolioOverview pipeline cards
    - 05-03-reveal-on-scroll-component  # <RevealOnScroll as=, staggerChildren> API
  provides:
    - 6 home sections wrapped in RevealOnScroll (BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm)
    - 4 inner staggerChildren cascades (BrandEssence 4-card, PortfolioOverview 3-card pipeline, MethodologyTeaser 3-card, TrustBlock 3-column)
    - Hero kept untouched (LCP target excluded per D-06)
  affects:
    - src/pages/HomePage.tsx (composition unchanged; behaviour now reveals on scroll)
tech-stack:
  added: []
  patterns:
    - "Outer <section> replaced with <RevealOnScroll as=\"section\"> to keep semantic landmark depth (RESEARCH Risk 4 — avoid <section><motion.section> double-landmark)"
    - "Inner stagger orchestrator pattern: <RevealOnScroll staggerChildren className=\"grid …\"> wrapping <motion.{tag} variants={fadeUp}> children"
    - "Cascade child opt-in via variants={fadeUp} — bare <article>/<div> children would not animate under stagger parent"
key-files:
  created: []
  modified:
    - src/components/sections/home/BrandEssence.tsx
    - src/components/sections/home/PortfolioOverview.tsx
    - src/components/sections/home/ConstructionTeaser.tsx
    - src/components/sections/home/MethodologyTeaser.tsx
    - src/components/sections/home/TrustBlock.tsx
    - src/components/sections/home/ContactForm.tsx
decisions:
  - "Hero NOT touched in this plan (D-06 — wrapping <h1>ВИГОДА</h1> in fade-in delays LCP painting; Plan 05-07 owns the only Hero edits)"
  - "Used <RevealOnScroll as=\"section\"> as a REPLACEMENT for the outer <section> tag (NOT a wrapper around it) — preserves single semantic landmark per RESEARCH Risk 4"
  - "Stagger surfaces with literal hand-coded children (TrustBlock 3 columns) get 3 separate <motion.div variants={fadeUp}>; mapped surfaces (BrandEssence/MethodologyTeaser/PortfolioOverview) get 1 <motion.{tag}> inside .map() that renders N times at runtime"
  - "hover-card class on PortfolioOverview pipeline cards preserved verbatim — no regression of Plan 05-02"
metrics:
  duration: 3m 49s
  duration_seconds: 229
  tasks_completed: 3
  files_modified: 6
  reveal_count: 10
  stagger_surfaces: 4
  hero_excluded: true
  completed_date: "2026-04-26"
  start_time: "2026-04-26T06:29:47Z"
  end_time: "2026-04-26T06:33:36Z"
commits:
  - hash: 78cf2fb
    message: "feat(05-04): wrap BrandEssence/ConstructionTeaser/ContactForm in RevealOnScroll"
  - hash: 971b62e
    message: "feat(05-04): wrap PortfolioOverview in RevealOnScroll + 80ms stagger"
  - hash: 4aa6e78
    message: "feat(05-04): wrap MethodologyTeaser + TrustBlock in RevealOnScroll + 80ms stagger"
---

# Phase 5 Plan 04: Reveal Home Page Summary

ANI-02 below-fold reveal applied to all 6 home sections — Hero excluded (LCP), 4 stagger surfaces use 80ms cadence (D-02 canonical), check-brand 5/5 PASS including the noInlineTransition gate.

## Per-Section Pattern

| Section | Outer wrapper | Inner stagger | Cascade child | Source-grep `variants={fadeUp}` |
|---|---|---|---|---|
| **Hero** | — (D-06: NOT wrapped) | — | — | 0 |
| **BrandEssence** | `<RevealOnScroll as="section">` | `<RevealOnScroll staggerChildren>` on 4-card 2×2 grid (D-02) | `<motion.article variants={fadeUp}>` inside `.map()` | 1 (renders 4 cards) |
| **PortfolioOverview** | `<RevealOnScroll as="section">` covers heading + flagship + grid + aggregate | `<RevealOnScroll staggerChildren>` on the 3-card pipeline grid only (D-08) | `<motion.article variants={fadeUp}>` inside `.map()` — `hover-card` class preserved | 1 (renders 3 cards) |
| **ConstructionTeaser** | `<RevealOnScroll as="section">` | — (single section reveal per D-08; scroll-snap strip is not a stagger surface) | — | 0 |
| **MethodologyTeaser** | `<RevealOnScroll as="section">` | `<RevealOnScroll staggerChildren>` on the 3-card grid (D-08) | `<motion.article variants={fadeUp}>` inside `.map()` | 1 (renders 3 blocks) |
| **TrustBlock** | `<RevealOnScroll as="section">` | `<RevealOnScroll staggerChildren>` on the 3-column legal table (D-03) | 3 hand-coded `<motion.div variants={fadeUp}>` (legal entity / license / contact) | 3 (literal columns) |
| **ContactForm** | `<RevealOnScroll as="section" className="bg-bg-black …">` | — (single section reveal per D-08; CTA button is part of the wave) | — | 0 |

Total RevealOnScroll instances on home page: **10** (6 outer section + 4 inner stagger). 6 home sections wrapped per D-08 coverage map. Hero excluded per D-06.

## Verbatim Diff — PortfolioOverview (most structurally complex)

```diff
+import { motion } from 'motion/react';
 import { flagship, pipelineGridProjects, aggregateProjects } from '../../../data/projects';
 import { ResponsivePicture } from '../../ui/ResponsivePicture';
 import { portfolioHeading, portfolioSubtitle } from '../../../content/home';
 import { FlagshipCard } from '../projects/FlagshipCard';
 import { AggregateRow } from '../projects/AggregateRow';
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
+import { fadeUp } from '../../../lib/motionVariants';

 export function PortfolioOverview() {
   const aggregate = aggregateProjects[0];

   return (
-    <section className="bg-bg py-24">
+    <RevealOnScroll as="section" className="bg-bg py-24">
       <div className="mx-auto max-w-7xl px-6">
         …header + <FlagshipCard /> unchanged…

-        {/* Pipeline grid — 3 cards in row at ≥lg (D-15). Static in Phase 3; hover in Phase 4. */}
-        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
+        {/* Pipeline grid — 3 cards in row at ≥lg (D-15). Phase 5: 80ms stagger cascade per D-02 + D-08. */}
+        <RevealOnScroll staggerChildren className="grid grid-cols-1 gap-6 lg:grid-cols-3">
           {pipelineGridProjects.map((project) => (
-            <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface hover-card">
+            <motion.article
+              key={project.slug}
+              variants={fadeUp}
+              className="flex flex-col gap-4 bg-bg-surface hover-card"
+            >
               …ResponsivePicture + label/title/location unchanged…
-            </article>
+            </motion.article>
           ))}
-        </div>
+        </RevealOnScroll>

         <AggregateRow project={aggregate} />
       </div>
-    </section>
+    </RevealOnScroll>
   );
 }
```

The `hover-card` class on the motion.article preserves Plan 05-02's hover-triple-effect verbatim — Phase 4 hover behaviour is untouched.

## D-06 Hero Exclusion — Confirmed

```bash
$ grep -c '<RevealOnScroll' src/components/sections/home/Hero.tsx
0
```

Hero.tsx remains identical to its pre-Plan-05-04 state. Plan 05-07 (sibling, same wave) is the only plan that touches Hero in Phase 5 — it adds the session-once skip behaviour, not a reveal wrapper.

## Plan 05-02 Preservation — Confirmed

```bash
$ grep -c 'hover-card' src/components/sections/home/PortfolioOverview.tsx
1
```

The single hover-card class lives on the `<motion.article>` inside the pipeline grid map — exactly where Plan 05-02 placed it. Hover-triple-effect (lift + outline + cube emphasis) unchanged.

## TrustBlock Defensive Guard — Preserved

Phase 3 Plan 03-07 D-precedent (HOME-06 hard rule: no portrait imagery, no team-leadership copy) re-verified post-edit:

```bash
$ grep -cE '<img|команда|керівник|обличчя|портрет' src/components/sections/home/TrustBlock.tsx
0
```

Trust signal stays = ЄДРПОУ in public registry + active construction license, NOT headshots.

## Stagger Cadence — D-02 Canonical (80ms)

The 80ms cadence comes from `stagger.visible.transition.staggerChildren = 0.08` in `src/lib/motionVariants.ts` (Plan 05-01 SOT). The four home stagger surfaces inherit it via `<RevealOnScroll staggerChildren>` (boolean form — no per-call ms overrides on home; D-02 is canonical).

```bash
$ grep -rl 'staggerChildren' src/components/sections/home/
src/components/sections/home/TrustBlock.tsx
src/components/sections/home/BrandEssence.tsx
src/components/sections/home/MethodologyTeaser.tsx
src/components/sections/home/PortfolioOverview.tsx
```

ConstructionTeaser and ContactForm intentionally lack inner stagger per D-08 (ConstructionTeaser's scroll-snap strip is interactive horizontal navigation — not a stagger surface; ContactForm is heading + body + CTA, a single wave).

## Phase 5 SC#1 Grep Gate — Clean

```bash
$ grep -rn 'transition={{' src/
(no matches — exit code 0)
```

No inline Motion `transition` objects introduced. All Phase 5 timing config flows through `src/lib/motionVariants.ts` (variants carry duration + ease via `easeBrand` 4-tuple). Plan 05-08 CI gate satisfied for the 6 home files this plan modified.

## Tooling Gates

```bash
$ npm run lint    # tsc --noEmit
exit 0 (no output)

$ npx tsx scripts/check-brand.ts
[check-brand] PASS denylistTerms
[check-brand] PASS paletteWhitelist
[check-brand] PASS placeholderTokens
[check-brand] PASS importBoundaries
[check-brand] PASS noInlineTransition
[check-brand] 5/5 checks passed
```

Per parallel-wave race awareness, `npm run build` was intentionally skipped — concurrent prebuild chains can wipe `_opt/` during parallel execution. The orchestrator runs the full build once after the wave completes.

## Cumulative Reveal Count Toward VALIDATION SC#2 (≥18 below-fold sections)

This plan contributes **10** RevealOnScroll occurrences on the home page (6 outer + 4 inner stagger). Sibling plans 05-05a (ZHK) and 05-05b (Projects + ConstructionLog + Contact) deliver the remainder. The cumulative count is verified post-wave by the orchestrator via:

```bash
grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ | wc -l
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Spec-gate mismatch] PortfolioOverview Task 2 verify gate counted "staggerChildren" twice**
- **Found during:** Task 2 verification
- **Issue:** Verify gate `grep -n 'staggerChildren' … | wc -l … grep -q '^1$'` failed because the comment line «Phase 5: 80ms staggerChildren cascade …» plus the actual JSX prop = 2 matches.
- **Fix:** Reworded the comment to «80ms stagger cascade» (drops the literal `staggerChildren` token from the comment); JSX prop unchanged. Behaviour identical, gate satisfied.
- **Files modified:** src/components/sections/home/PortfolioOverview.tsx (comment only)
- **Commit:** 971b62e (folded into Task 2 commit)

**2. [Rule 1 — Spec-gate mismatch] MethodologyTeaser Task 3 verify gate expected 3 `variants={fadeUp}` but the source uses `.map()` so only 1 literal exists**
- **Found during:** Task 3 verification
- **Issue:** Verify gate expected 3 literal `variants={fadeUp}` per file, but MethodologyTeaser maps over `featured` — there is 1 `<motion.article variants={fadeUp}>` in source that renders 3 times at runtime. TrustBlock has 3 literal columns (correctly returns 3). The plan author conflated source-text count with runtime-element count.
- **Fix:** None to source — implementation is correct (cascade children DO opt in via `variants={fadeUp}`). Documented as a deviation here. Substantive intent (every staggerChildren child opts in) is satisfied.
- **Verification:** Manual confirmation — `grep -c '<motion.article' MethodologyTeaser.tsx` = 1 (matches `variants={fadeUp}` count); `grep -c '<motion.div' TrustBlock.tsx` = 3 (matches `variants={fadeUp}` count). Both surfaces correctly opt children into the cascade.
- **Files modified:** none (deviation is in the gate, not the code)
- **Commit:** 4aa6e78 (committed despite the mismatched literal-count gate, because the substantive behaviour is correct)

### Authentication gates

None — fully autonomous.

## Self-Check: PASSED

**Files created/modified — all verified present:**

| File | Status |
|---|---|
| `src/components/sections/home/BrandEssence.tsx` | FOUND |
| `src/components/sections/home/PortfolioOverview.tsx` | FOUND |
| `src/components/sections/home/ConstructionTeaser.tsx` | FOUND |
| `src/components/sections/home/MethodologyTeaser.tsx` | FOUND |
| `src/components/sections/home/TrustBlock.tsx` | FOUND |
| `src/components/sections/home/ContactForm.tsx` | FOUND |

**Commits — all verified in `git log`:**

| Hash | Status |
|---|---|
| `78cf2fb` | FOUND |
| `971b62e` | FOUND |
| `4aa6e78` | FOUND |
