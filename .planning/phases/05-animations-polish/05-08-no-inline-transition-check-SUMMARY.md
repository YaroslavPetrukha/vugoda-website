---
phase: 05-animations-polish
plan: 08
subsystem: ci-brand-invariants
tags: [phase-5, ci, check-brand, sot, anti-pattern-gate, ani-02, sc-1]
requires:
  - "scripts/check-brand.ts (existing 4-check structure from Plan 02-05)"
  - "src/lib/motionVariants.ts (Phase 5 SOT, exists per Plan 05-01)"
provides:
  - "5th check `noInlineTransition()` permanent CI invariant — fails build if any `transition={{...}}` JSX prop appears in src/**/*.{ts,tsx}"
  - "Aggregate `[check-brand] 5/5 checks passed` output (was 4/4)"
  - "Forward-defence gate: enforces Phase 5 SC#1 in CI for Phase 6+"
affects:
  - "scripts/check-brand.ts (one file modified, +47 −8 lines net)"
  - "npm run build postbuild step (now runs 5 checks instead of 4)"
  - "GH Actions deploy.yml `Check brand invariants` step (inherits same 5/5 by virtue of running same script)"
tech-stack:
  added: []
  patterns:
    - "Existing 4-check pattern reused verbatim — `function name(): boolean { ... return true/false }` + `console.log('[check-brand] PASS|FAIL ...')` + invocation via `results` aggregate array (no class, no interface, no orchestrator beyond the array)"
    - "scripts/-quarantine D-precedent (Plan 02-05) preserved: this script's regex literals don't trigger its own checks because scripts/ is intentionally OUT of scope for all 5 checks"
key-files:
  created: []
  modified:
    - "scripts/check-brand.ts (top doc-block updated 4→5 checks; +noInlineTransition() function ~18 lines; +1 line in `results` aggregate)"
decisions:
  - "Single-task plan executed verbatim per `<action>` — zero plan deviations, zero Rule 1/2/3 auto-fixes triggered"
  - "Scope of new check = `src/` everywhere (incl. src/lib/) per CONTEXT D-27 + VALIDATION SC#1 verbatim — regex `transition=\\{\\{` (double-open-brace required) does NOT match `transition: {` (colon + single brace) which is TypeScript object syntax in motionVariants.ts Variants declarations, so scope inclusion is safe"
  - "Output format `[check-brand] PASS noInlineTransition` / `[check-brand] FAIL noInlineTransition — inline Motion transition objects (use variants from src/lib/motionVariants.ts):\\n{violations}` matches existing 4-check semantic (PASS line for clean, FAIL line + violation locations for dirty)"
  - "`existsSync('src')` early-PASS branch mirrors paletteWhitelist's `if (!existsSync('src')) ...` pattern — keeps script behavior consistent on edge-case fresh-checkout state"
  - "Doc-block self-consistency check: new noInlineTransition function's inline JSDoc references `transition: {` (single-brace TS form) and the regex shape `transition=\\{\\{` — both literals are SAFE in scripts/ (out-of-scope for the script's own checks per Plan 02-05 D-precedent). Zero Rule 3 fixes needed (10th plan in codebase running pre-screen workflow; second consecutive plan with zero collisions after 9-plan template-smell streak ended at Plan 03-08)"
metrics:
  duration: "12 min"
  completed: "2026-04-26"
  tasks: 1
  files: 1
---

# Phase 5 Plan 08: noInlineTransition CI Gate Summary

**One-liner:** Added 5th permanent CI invariant `noInlineTransition()` to `scripts/check-brand.ts` that greps `transition={{` in `src/**/*.{ts,tsx}` and fails the build on any match — encodes Phase 5 SC#1 (no inline Motion transition objects; all timing must come from `src/lib/motionVariants.ts` SOT) into the postbuild + GH Actions gate.

## What Shipped

### `scripts/check-brand.ts` — verbatim final form of new check

```ts
// ---- 5. No inline JSX-prop transition objects (Phase 5 D-27, SC#1) ------
// Phase 5 owns easing config: all motion timing comes from src/lib/
// motionVariants.ts SOT (variants carry transition; consumers use
// variants={...} or whileInView/initial/animate/exit prop names — never
// an inline `transition={{ duration: ... }}` JSX prop).
//
// Pattern `transition=\{\{` requires `=` directly followed by double
// open-brace — matches JSX prop form, NOT TypeScript object syntax
// `transition: {` inside Variants declarations. Scope: src/ everywhere
// including src/lib/ — Variants type literals use `transition: {` (colon)
// which the regex does not match.
function noInlineTransition(): boolean {
  if (!existsSync('src')) {
    console.log('[check-brand] PASS noInlineTransition (no src/)');
    return true;
  }
  const out = run(
    `grep -rnE "transition=\\{\\{" src/ ` +
      `--include='*.ts' --include='*.tsx'`,
  );
  if (out.trim()) {
    console.error(
      `[check-brand] FAIL noInlineTransition — inline Motion transition objects (use variants from src/lib/motionVariants.ts):\n${out}`,
    );
    return false;
  }
  console.log('[check-brand] PASS noInlineTransition');
  return true;
}
```

### Aggregate (bottom of file)

```ts
const results = [
  denylistTerms(),
  paletteWhitelist(),
  placeholderTokens(),
  importBoundaries(),
  noInlineTransition(),
];
const passed = results.filter(Boolean).length;
console.log(`[check-brand] ${passed}/${results.length} checks passed`);
if (results.some((r) => !r)) process.exit(1);
```

### Top doc-block — 4 checks → 5 checks

Updated bullet list to enumerate 5 checks; added Scope clause for `src/**/*.{ts,tsx}` for noInlineTransition; added new "Regex note (noInlineTransition)" paragraph explaining the JSX-double-brace vs TypeScript-single-brace distinction.

## Verification Results

### `npx tsx scripts/check-brand.ts` (standalone)

```
[check-brand] PASS denylistTerms
[check-brand] PASS paletteWhitelist
[check-brand] PASS placeholderTokens
[check-brand] PASS importBoundaries
[check-brand] PASS noInlineTransition
[check-brand] 5/5 checks passed
```

Exit 0. **5/5 PASS on first run as predicted** — zero `transition={{` matches in current src/ (Phase 5 anti-pattern surface preserved by Plans 03-04, 03-06, 05-01 doc-block hygiene).

### `npm run build` (full pipeline)

```
✓ built in 6.20s

> vugoda-website@0.0.0 postbuild
> tsx scripts/check-brand.ts

[check-brand] PASS denylistTerms
[check-brand] PASS paletteWhitelist
[check-brand] PASS placeholderTokens
[check-brand] PASS importBoundaries
[check-brand] PASS noInlineTransition
[check-brand] 5/5 checks passed
```

Exit 0. Bundle **439.60 kB JS / 135.53 kB gzipped** (was 135.62 kB at end of 05-01; ~0.1 kB drift = noise, no content delta from this plan since `scripts/check-brand.ts` is build-time only and ships zero bytes to runtime). Within 200 KB-gzipped Phase 6 budget.

### `npm run lint` (`tsc --noEmit`)

Exit 0 — clean.

### Plan's `<verify>` automated assertion

```bash
grep -n '^function noInlineTransition' scripts/check-brand.ts | wc -l → 1 ✓
grep -n 'noInlineTransition()' scripts/check-brand.ts | wc -l → 3 ✓ (within 2-3 expected range)
grep -n '5 checks:' scripts/check-brand.ts | wc -l → 1 ✓
npx tsx scripts/check-brand.ts | tail -2 | grep '5/5 checks passed' → ✓
```

All four asserts green.

## Phase 5 SC#1 Status

**Was (pre-plan):** Phase 5 SC#1 (`! grep -rn 'transition={{' src/`) was a one-time external grep — would catch a violation IF someone manually re-ran it during phase closure. No automated continuous enforcement.

**Now (post-plan):** SC#1 grep gate is **embedded in the postbuild + GH Actions check-brand battery**. Every `npm run build` (local and CI) runs all 5 checks. A regression in any future plan that introduces an inline `transition={{ duration: ... }}` JSX prop will fail the build at postbuild time and block deploy at Pages-action time.

**Forward-defence cost:** ~18 net source lines + ~120 ms additional grep on every build. Permanent invariant for the lifetime of the project. Cost-benefit per RESEARCH Open Q recommendation: ADD = correct call; the gate would have caught the doc-block self-consistency anti-pattern that plans 03-04 / 03-06 had to fix manually if the literal had been a JSX form rather than a doc comment.

## Deviations from Plan

**None — plan executed exactly as written.**

- Zero Rule 1 (bug) auto-fixes
- Zero Rule 2 (missing critical functionality) auto-fixes
- Zero Rule 3 (blocking) auto-fixes
- Zero Rule 4 (architectural) escalations
- Zero doc-block self-consistency fixes (10th plan in codebase running pre-screen workflow; second consecutive zero-collision plan after the 9-plan template-smell streak ended at Plan 03-08)

The plan's `<action>` text was character-byte-identical to what shipped. Both Change A (top doc-block) and Change B (function + aggregate wiring) applied verbatim.

## Notes

### `scripts/` quarantine D-precedent preserved

The new check's inline JSDoc references the literal characters `transition: {` (single-brace TS form) and the regex shape `transition=\{\{` — both would trigger denylist-style false positives if `scripts/` were in scope for any of the 5 checks. Per Plan 02-05's `scripts/`-quarantine decision, none of the 5 checks scan `scripts/`, so the script's own regex constants and explanatory comments cannot self-trigger. **This is the same D-precedent that lets `denylistTerms()` literally name «Pictorial» / «Rubikon» as the regex pattern without flagging itself.** Pattern is now applied across 5/5 checks.

### Sibling-wave parallel-execution note

This plan ran in Wave 2 (Phase 5) parallel with siblings 05-02 (hover-card-utility) and 05-03 (reveal-on-scroll-component). All three share `package.json prebuild` chain (`copy-renders.ts` + `optimize-images.mjs`) which is **destructive on `public/renders/`** (rmSync-then-cpSync). Concurrent `npm run build` invocations from sibling executors race on subdirectory creation — first build attempt failed with `ENOENT: unable to open for write public/renders/etno-dim/_opt/43615.jpg-640.avif`. **This is a parallel-wave race condition in the image pipeline, NOT a bug introduced by this plan.** Retried build (after siblings settled) succeeded with 5/5 PASS. Recorded as a known parallel-wave artifact for future Phase 6 perf-tuning consideration: if image-pipeline determinism becomes important, `optimize-images.mjs` could be refactored to use atomic dir creation or per-process scratch directories.

### What this plan does NOT do

- Does NOT scan or modify `src/**` — purely a CI infrastructure change
- Does NOT close ANI-02 SC#1 single-handedly — the SC requires zero `transition={{` literals AND the runtime invariant (motion timing flows through SOT). This plan adds the **automated enforcement** of the literal-grep half. Runtime invariant validation lives in Plans 05-02 / 05-03 / 05-04 / 05-05a / 05-05b / 05-06 / 05-07 (each consumer of motionVariants.ts) and Phase 5 closure verification.
- Does NOT touch GH Actions deploy.yml — the workflow already runs `tsx scripts/check-brand.ts` as a named step (Plan 02-05 D-28 double-coverage); inheriting the new 5/5 behavior comes for free with the script change.

## Self-Check: PASSED

- `scripts/check-brand.ts`: FOUND (modified, contains `function noInlineTransition` at line 211, `noInlineTransition()` invocation in aggregate at line 236, "5 checks:" doc-block at line 11)
- `61fc55f` commit: FOUND (`feat(05-08): add noInlineTransition CI gate to check-brand`) — verified via `git log --oneline | grep 61fc55f`
- `.planning/phases/05-animations-polish/05-08-no-inline-transition-check-SUMMARY.md`: FOUND (this file)
