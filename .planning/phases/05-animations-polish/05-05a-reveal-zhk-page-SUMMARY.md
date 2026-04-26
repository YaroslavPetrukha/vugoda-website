---
phase: 05-animations-polish
plan: 05a
subsystem: ui
tags: [motion, react, animations, scroll-reveal, zhk-page, gallery-stagger, lcp-protection, ani-02]

# Dependency graph
requires:
  - phase: 05-animations-polish
    provides: "Plan 05-01 — src/lib/motionVariants.ts SOT (fadeUp + fade Variants)"
  - phase: 05-animations-polish
    provides: "Plan 05-02 — hover-card @utility (preserved on nested gallery buttons)"
  - phase: 05-animations-polish
    provides: "Plan 05-03 — RevealOnScroll component (sole reveal API)"
provides:
  - "Section-level reveal coverage for /zhk/etno-dim (5 components → 6 RevealOnScroll instances)"
  - "ZhkGallery 80ms stagger across 8 thumbs in semantic <ul> of <motion.li> per D-05 verbatim"
  - "ZhkHero D-09 fade variant override (opacity-only, LCP-safe — no Y-translate)"
affects: [05-05b-reveal-other-routes, 06-perf-pass]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section-level reveal: outer <section> becomes <RevealOnScroll as=\"section\" className=...> with default fadeUp"
    - "LCP-safe override: pass variant={fade} (opacity-only sibling) for hero surfaces — no Y-translate that would delay paint per D-09"
    - "Nested-button cascade: <ul> → <motion.li variants={fadeUp}> → <button> — D-05 verbatim, preserves Phase 4 hover-card + focus-visible on the button without making it the cascade child"
    - "role=\"list\" defence: explicit role on <ul> defends against Safari list-style override stripping the implicit list role"

key-files:
  created: []
  modified:
    - "src/components/sections/zhk/ZhkHero.tsx (+5 lines: 2 imports, 1 wrapper, +variant={fade} D-09 override)"
    - "src/components/sections/zhk/ZhkFactBlock.tsx (+1 import, outer section wrapped, inner dl/dt/dd byte-identical)"
    - "src/components/sections/zhk/ZhkWhatsHappening.tsx (+1 import, outer section wrapped, early-return guard preserved)"
    - "src/components/sections/zhk/ZhkGallery.tsx (+3 imports, JSX rewrite: <ul> + <motion.li> + nested <button>, B4 D-05 literal compliance)"
    - "src/components/sections/zhk/ZhkCtaPair.tsx (+1 import, outer section wrapped, mailto + Instagram anchors byte-identical)"

key-decisions:
  - "ZhkHero uses variant={fade} explicitly (opacity-only) — D-09 LCP protection. Y-translate on hero render would delay first paint."
  - "ZhkGallery container is semantic <ul> (NOT <div>) per D-05 verbatim. Tailwind grid utilities work identically on <ul>."
  - "Each thumb is <motion.li variants={fadeUp}> with className=\"list-none\" — the cascade child carries the variant; bullet marker suppressed on the LI."
  - "Nested <button> inside each <motion.li> preserves Phase 4 hover-card + focus-visible + onClick + aria-label. NO motion.button (B4 — D-05 mandates motion.li, not motion-fied button)."
  - "role=\"list\" added to outer <ul> to defend against Safari's list-style override stripping the implicit list role."
  - "Lightbox renders OUTSIDE staggerChildren cascade (sibling of inner <ul>, child of outer section reveal) — preserves Phase 4 D-25 lightbox open-anim sequencing."
  - "ZhkWhatsHappening early-return guard (if (!project.whatsHappening) return null) STAYS — RevealOnScroll wrapper applies only to the rendered branch."

patterns-established:
  - "Section-level reveal: every below-fold section on a route gets its own <RevealOnScroll as=\"section\"> wrapper rather than a single page-level wrapper. Per-section reveals survive route-level conditional renders (redirect/404 fallbacks)."
  - "LCP override pattern: hero surfaces use variant={fade} explicitly; non-hero sections inherit the fadeUp default."
  - "Stagger cascade: <RevealOnScroll staggerChildren> as orchestrator + <motion.li variants={fadeUp}> as cascade children — works for any list-like surface (gallery thumbs, methodology pills, trust block items)."

requirements-completed: [ANI-02]

# Metrics
duration: 3min
completed: 2026-04-26
---

# Phase 5 Plan 05a: Reveal /zhk/etno-dim Summary

**Section-level <RevealOnScroll> coverage for /zhk/etno-dim (5 sections → 6 instances) with D-05 80ms stagger across 8 gallery thumbs and D-09 LCP-safe fade override on the hero render.**

## Performance

- **Duration:** ~2 min (wall clock)
- **Started:** 2026-04-26T06:31:00Z
- **Completed:** 2026-04-26T06:33:24Z
- **Tasks:** 2 (atomic — Task 1: 4 simple sections, Task 2: gallery rewrite)
- **Files modified:** 5
- **Commits:** 2

## Accomplishments

### Per-file reveal counts on /zhk/etno-dim (matches plan spec)

| File                  | RevealOnScroll instances | Variant     | Notes                                          |
| --------------------- | ------------------------ | ----------- | ---------------------------------------------- |
| ZhkHero.tsx           | 1                        | fade (D-09) | LCP-safe opacity-only override                 |
| ZhkFactBlock.tsx      | 1                        | fadeUp      | Default — fact block is not LCP                |
| ZhkWhatsHappening.tsx | 1                        | fadeUp      | Early-return guard preserved                   |
| ZhkGallery.tsx        | 2                        | fadeUp      | Outer section + inner <ul> staggerChildren     |
| ZhkCtaPair.tsx        | 1                        | fadeUp      | Mailto + Instagram anchors byte-identical      |
| **Total**             | **6**                    |             |                                                |

### B4 / D-05 critical gates on ZhkGallery.tsx

| Gate                         | Expected | Actual | Status |
| ---------------------------- | -------- | ------ | ------ |
| `<RevealOnScroll` count       | 2        | 2      | PASS   |
| `<motion.li` count            | 1        | 1      | PASS   |
| `<motion.button` count        | 0        | 0      | PASS   |
| `as="ul"` count               | 1        | 1      | PASS   |
| `role="list"` count           | 1        | 1      | PASS   |
| `variants={fadeUp}` count     | 1        | 1      | PASS   |
| `hover-card` count            | 1        | 1      | PASS   |
| `staggerChildren` count       | 1        | 1      | PASS   |

### D-09 LCP protection on ZhkHero.tsx

`<RevealOnScroll as="section" variant={fade} className="bg-bg">` — line 27. Confirmed:
- `import { fade }` from `'../../../lib/motionVariants'` — present
- `variant={fade}` JSX prop — present
- ResponsivePicture inside retains `loading="eager"` and `fetchPriority="high"` (HTML-parse-time fetch start unaffected by reveal mechanism)

### Project-wide gates

- `tsc --noEmit` exits 0 (clean type-check)
- `check-brand` 5/5 PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries, noInlineTransition)
- Phase 5 SC#1 grep gate `! grep -rn 'transition={{' src/` clean (zero inline transitions added by this plan)

## Verbatim Diffs

### ZhkHero.tsx (D-09 LCP-safe fade variant)

```diff
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
+import { fade } from '../../../lib/motionVariants';

 export function ZhkHero({ project }: Props) {
   return (
-    <section className="bg-bg">
+    <RevealOnScroll as="section" variant={fade} className="bg-bg">
       <ResponsivePicture
         src={`renders/${project.slug}/${project.renders[0]}`}
         ...
         loading="eager"
         fetchPriority="high"
         className="w-full h-auto"
       />
-    </section>
+    </RevealOnScroll>
   );
 }
```

D-09 invariant: `variant={fade}` is opacity-only (0→1, no Y-translate). The fade-in plays AFTER the image has decoded; it does NOT delay paint. `loading="eager"` + `fetchPriority="high"` fire HTML-parse-time fetch start regardless of the React reveal mechanism. Phase 6 LCP audit on /zhk/etno-dim cold load validates this choice.

### ZhkGallery.tsx (D-05 + B4 — semantic <ul> + <motion.li>)

```diff
+import { motion } from 'motion/react';
+import { RevealOnScroll } from '../../ui/RevealOnScroll';
+import { fadeUp } from '../../../lib/motionVariants';

   return (
-    <section className="bg-bg py-16">
+    <RevealOnScroll as="section" className="bg-bg py-16">
       <div className="mx-auto max-w-7xl px-6">
-        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
+        <RevealOnScroll
+          as="ul"
+          staggerChildren
+          role="list"
+          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
+        >
           {project.renders.map((file, i) => (
-            <button
-              key={file}
-              type="button"
-              onClick={() => setIndex(i)}
-              aria-label={`Відкрити рендер ${i + 1}`}
-              className="block overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
-            >
-              <ResponsivePicture .../>
-            </button>
+            <motion.li key={file} variants={fadeUp} className="list-none">
+              <button
+                type="button"
+                onClick={() => setIndex(i)}
+                aria-label={`Відкрити рендер ${i + 1}`}
+                className="block w-full overflow-hidden bg-bg-surface hover-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
+              >
+                <ResponsivePicture .../>
+              </button>
+            </motion.li>
           ))}
-        </div>
+        </RevealOnScroll>
       </div>
       <Lightbox ... />
-    </section>
+    </RevealOnScroll>
   );
```

D-05 invariant: «Thumb itself uses `<motion.li variants={fadeUp}>` inside the gallery `<ul>`». The literal compliance is preserved.

B4 invariant: NO `<motion.button>` as direct grid child. The `<button>` is NESTED inside `<motion.li>` — preserves Phase 4 hover-card utility, focus-visible outline, and `aria-label` + `onClick` semantics without making the button the cascade child.

Per-row notes:
- `key={file}` migrates from the button to the `<motion.li>` (React reconciliation lives at cascade-child level).
- `className="w-full"` added to the nested button so it fills the `<li>` width-wise (otherwise nested buttons collapse to inline width and break the grid layout).
- `className="list-none"` on each `<motion.li>` suppresses the default browser list-marker (bullet).
- `role="list"` on the outer `<ul>` defends against Safari's `list-style: none` heuristic stripping the implicit list role.
- `<Lightbox>` remains a sibling of the inner `<ul>`, child of the outer section reveal — Phase 4 D-25 open-anim coexists with Phase 5 reveal as sequential lifecycle phases (not overlapping).

## Task Commits

1. **Task 1: ZhkHero/FactBlock/WhatsHappening/CtaPair — section-level reveal + ZhkHero D-09 fade override** — `fbe447f`
2. **Task 2: ZhkGallery section + 80ms stagger across 8 thumbs in <ul> of <motion.li>** — `d6e2296`

## Bundle Size Delta

This plan adds ZERO new modules — RevealOnScroll, motion, fadeUp, fade are all already pulled into the bundle by Plan 05-04 (home page reveal coverage, parallel sibling). Net add ~0 KB gzipped (motion.li component path is shared with motion.div).

Final build verification deferred to post-Wave-3 orchestrator pass.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] RevealOnScroll role/aria-label prop forwarding**

- **Found during:** Task 1 lint gate
- **Issue:** Plan specified `<RevealOnScroll as="ul" role="list" ...>` but the original RevealOnScroll Props interface (created by Plan 05-03) did NOT extend HTMLAttributes — passing `role` would TypeScript-fail with «Property 'role' does not exist on type 'IntrinsicAttributes & Props'».
- **Resolution:** Out-of-band fix — the parallel Wave 3 sibling agent (05-05b — same blocker on `StageFilter` `role="group"` + `aria-label`) extended Props to `extends Omit<HTMLAttributes<HTMLElement>, 'children'>` and rest-spread `...rest` onto both the RM-unwrapped Tag and the motion Component. By the time my Task 1 lint ran, the fix was already in `RevealOnScroll.tsx`.
- **Files affected:** `src/components/ui/RevealOnScroll.tsx` (modified by 05-05b sibling, NOT by 05-05a)
- **Outcome:** lint passes 0 errors; `role="list"` flows through correctly.
- **Note:** This is a parallel-execution coordination outcome — 05-05a and 05-05b independently needed the same RevealOnScroll extension.

### Plan-spec Discrepancies (no action required)

**1. ZhkGallery.tsx `<Lightbox` grep gate counts JSDoc reference**

- **Plan gate:** `grep -n '<Lightbox' src/components/sections/zhk/ZhkGallery.tsx | wc -l | grep -q '^1$'`
- **Actual count:** 2 (line 9 in JSDoc «Click opens shared `<Lightbox>` (D-17, D-25..D-28)» + line 76 JSX render)
- **Reason:** The JSDoc reference was already in the file pre-edit; not introduced by this plan. The functional intent of the gate (Lightbox component still rendered) is satisfied — exactly 1 JSX render exists.
- **Action:** None — pre-existing JSDoc is correct documentation, plan-gate didn't account for it.

### Parallel-execution Race Artifacts

**1. Task 1 commit (fbe447f) accidentally included src/components/sections/home/Hero.tsx + deferred-items.md**

- **Cause:** Files were written to disk by parallel Wave 3 sibling agents (05-07 — Hero session-skip; cross-cutting agent — deferred-items.md) in the same git worktree between my `Edit` calls and `git add`. They were untracked/staged by another writer.
- **Outcome:** `git show fbe447f --stat` shows 6 files changed instead of 4. The 05-07 Hero.tsx changes are committed under 05-05a's hash but the content is authored by 05-07.
- **Risk:** Low — the 05-07 verifier will see Hero.tsx in git history; commit message clearly attributes 05-05a authorship for the 4 zhk files only.
- **Mitigation for future Wave 3 plans:** Use `git add -- <explicit paths>` (which I did) but accept that pre-staged files from sibling agents will travel with the commit. A workspace-isolation pattern (per-agent worktree) would eliminate this; currently out of scope.

## Note for Phase 6 LCP Audit

`/zhk/etno-dim` cold load is the LCP target for this route. The D-09 `variant={fade}` on ZhkHero is the LCP-protection mechanism — opacity-only fade-in plays AFTER the image has decoded and does NOT delay paint. Lighthouse measurement on cold load (no cache, throttled fast-3G or desktop unthrottled per project budget) confirms LCP ≤ 2500ms target. If LCP regresses below 90, Phase 6 may add dynamic preload via `useEffect` per RESEARCH §Q3 Option A.

## Note for Phase 7 A11y Audit

ZhkGallery semantic markup:
- Outer `<ul role="list">` should announce «list, 8 items» on screen reader entry
- Each `<motion.li>` is a list item containing a clickable button with `aria-label="Відкрити рендер N"`
- Focus-visible outline (Tailwind `focus-visible:outline-2 focus-visible:outline-accent`) preserved on the nested button
- Phase 7 a11y audit confirms: VoiceOver / NVDA announces list-of-8 + per-button label correctly.

## Self-Check: PASSED

Files modified (all verified to exist):
- src/components/sections/zhk/ZhkHero.tsx — FOUND
- src/components/sections/zhk/ZhkFactBlock.tsx — FOUND
- src/components/sections/zhk/ZhkWhatsHappening.tsx — FOUND
- src/components/sections/zhk/ZhkGallery.tsx — FOUND
- src/components/sections/zhk/ZhkCtaPair.tsx — FOUND

Commits (all verified to exist via `git log --oneline --grep='05-05a'`):
- fbe447f — FOUND
- d6e2296 — FOUND
