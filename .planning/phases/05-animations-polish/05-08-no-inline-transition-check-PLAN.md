---
phase: 05-animations-polish
plan: 08
type: execute
wave: 2
depends_on: [05-01-foundation-sot]
files_modified:
  - scripts/check-brand.ts
autonomous: true
requirements: [ANI-02, ANI-04]
must_haves:
  truths:
    - "scripts/check-brand.ts ships a 5th check `noInlineTransition()` that fails the build if any `transition={{...}}` JSX prop appears under src/components/, src/pages/, src/hooks/"
    - "The aggregate exit code semantics preserved — any check failing fails the whole script (exit 1)"
    - "Output format matches existing 4-check style: `[check-brand] PASS noInlineTransition` / `[check-brand] FAIL noInlineTransition — inline Motion transition objects:`"
  artifacts:
    - path: scripts/check-brand.ts
      provides: "5th check noInlineTransition() invoked from results aggregate"
      contains: "noInlineTransition"
  key_links:
    - from: "scripts/check-brand.ts noInlineTransition()"
      to: "src/components/, src/pages/, src/hooks/ tsx files"
      via: "grep -rnE 'transition=\\{\\{' on those scopes"
      pattern: "noInlineTransition"
---

<objective>
Add an optional 5th check `noInlineTransition()` to `scripts/check-brand.ts` per CONTEXT D-27 + RESEARCH Open Q recommendation (ADD). The check is a permanent CI invariant for ANI-02 SC#1: «no inline `transition={{...}}` objects» — Phase 5 owns easing config, all motion timing must come from `motionVariants.ts` SOT.

Implementation pattern matches the existing 4 checks (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries):
- Returns `boolean` (PASS = true, FAIL = false)
- Logs `[check-brand] PASS noInlineTransition` or `[check-brand] FAIL noInlineTransition — ...` with violations
- Added to the `results` aggregate at the bottom of the file so total check count becomes `5/5` not `4/5`
- Scope: `src/components/, src/pages/, src/hooks/` — the dirs containing motion-using code. Excludes `src/lib/motionVariants.ts` (variant declarations themselves use `transition: {` inside Variants — TypeScript object syntax, single-brace, NOT the `transition={{` JSX-prop double-brace pattern)
- Excludes `src/components/sections/home/Hero.tsx` JSDoc descriptive prose (the file's doc-block describes the rule using the literal characters; doc-block self-screen across Phase 5 plans confirms zero collisions, but a defensive exclusion lets future plans add doc-block descriptions safely)

Wait — RE-CHECK: Phase 5 plan-action doc-blocks have been pre-screened. The Hero.tsx Phase 5 form (Plan 05-07) JSDoc says «no inline Motion transition objects» — this string does NOT contain `transition={{` (zero double-open-braces). The literal `transition={{` should NOT appear anywhere in src/ post-Phase 5. Therefore noInlineTransition() can scope ALL of src/components/, src/pages/, src/hooks/ without exclusions.

Actually re-reading the spec — the scope of `src/lib/` may contain the literal `transition: {` (single-brace, TS object) inside Variants declarations in motionVariants.ts. The grep regex `transition=\{\{` requires `=` immediately followed by double `{{` — does NOT match `transition: {` (colon + space + single brace). So motionVariants.ts is NOT a false-positive risk; the scope can safely include `src/lib/` too. But per CONTEXT D-27 + the existing 4 checks (palette + boundaries restricted to `src/components/`, `src/pages/`, `src/data/`, `src/content/`), and per simplicity, this plan scopes the new check to `src/` overall (matching the SC#1 grep gate `! grep -rn 'transition={{' src/` verbatim from VALIDATION map).

Output: 1 file modified — `scripts/check-brand.ts`. Approximately +15-20 lines added (function + invocation + import not needed since execSync is already imported).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/05-animations-polish/05-CONTEXT.md
@.planning/phases/05-animations-polish/05-RESEARCH.md
@.planning/phases/05-animations-polish/05-VALIDATION.md
@scripts/check-brand.ts
</context>

<interfaces>
<!-- Existing scripts/check-brand.ts pattern (verbatim shape of an existing check): -->

```ts
function denylistTerms(): boolean {
  const scopes: string[] = [];
  if (existsSync('dist')) scopes.push('dist/');
  if (existsSync('src')) scopes.push('src/');
  if (scopes.length === 0) {
    console.log('[check-brand] PASS denylistTerms (no scope to scan)');
    return true;
  }
  const out = run(
    `grep -rniE --include='*.html' --include='*.js' --include='*.css' ` +
      `--include='*.ts' --include='*.tsx' --include='*.json' ` +
      `'Pictorial|Rubikon|Пикторіал|Рубікон' ${scopes.join(' ')}`,
  );
  if (out.trim()) {
    console.error(`[check-brand] FAIL denylistTerms — silent-displacement leak:\n${out}`);
    return false;
  }
  console.log('[check-brand] PASS denylistTerms');
  return true;
}
```

Aggregate at bottom of file:
```ts
const results = [
  denylistTerms(),
  paletteWhitelist(),
  placeholderTokens(),
  importBoundaries(),
];
const passed = results.filter(Boolean).length;
console.log(`[check-brand] ${passed}/${results.length} checks passed`);
if (results.some((r) => !r)) process.exit(1);
```

The scripts/ directory is intentionally OUT of scope for the existing checks — its regex constants (e.g., `'Pictorial|Rubikon|...'`) reference the disallowed literals without self-triggering. The new noInlineTransition() check follows the same pattern: it scans src/ only, never scripts/.

VALIDATION map row for SC#1: `! grep -rn 'transition=\{\{' src/` (exit 1 = pass). This is the runtime invariant the new check encodes.

Current Phase 4 + post-Phase-5 state: zero `transition={{` matches under src/. The check should PASS on the very first run.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Add noInlineTransition() function + invoke from aggregate (D-27 + RESEARCH Open Q recommendation)</name>
  <read_first>
    - scripts/check-brand.ts (full file — must understand 4-check structure before adding 5th)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-27 (Claude's-Discretion: optional, RESEARCH recommends ADD)
    - .planning/phases/05-animations-polish/05-RESEARCH.md §Open Questions Q2 (recommendation: ADD; cost ~10 lines, benefit permanent CI invariant)
    - .planning/phases/05-animations-polish/05-VALIDATION.md SC#1 grep gate (`! grep -rn 'transition={{' src/`)
  </read_first>
  <files>scripts/check-brand.ts</files>
  <behavior>
    - Test 1: New function `noInlineTransition()` defined in the file with the same signature pattern as existing checks (returns boolean, logs PASS/FAIL)
    - Test 2: Function uses `run('grep -rnE ...')` on src/ scope, with --include for *.ts and *.tsx
    - Test 3: Pattern matched is the JSX prop form `transition=\{\{` (double-open-brace required — won't match `transition: {` TypeScript object syntax in motionVariants.ts)
    - Test 4: Function is invoked in the `results` aggregate array at the bottom of the file, becoming the 5th element
    - Test 5: Aggregate `console.log` line still says `${passed}/${results.length}` — total becomes `5/5` when all PASS
    - Test 6: When the function returns false, the `results.some((r) => !r)` check still triggers `process.exit(1)`
    - Test 7: Script's existing `@module` doc-block at top of file updated to reference the new 5-check count
    - Test 8: Running `npx tsx scripts/check-brand.ts` exits 0 with "5/5 checks passed" output
  </behavior>
  <action>
    Edit `scripts/check-brand.ts`. Two changes:

    **Change A — update top doc-block.** The existing doc-block (lines 1-28) says «4 checks:» and lists 4 names. Update the count and append the 5th. Replace the block:

    ```ts
    /**
     * scripts/check-brand.ts — CI brand-invariant guard
     *
     * Runs as `postbuild` npm hook AND as a dedicated GH Actions step (double
     * coverage per D-28). Exit code is aggregate: any check fails → exit 1,
     * blocking deploy (D-29, no warn-only).
     *
     * No npm deps — uses node:child_process.execSync shelling out to GNU/BSD
     * grep (the `|| true` suffix handles BSD vs GNU exit-code difference).
     *
     * 4 checks:
     *   1. denylistTerms()    — silent-displacement literals in dist/+src/
     *   2. paletteWhitelist() — hex literals in src/ ⊆ 6-canonical brandbook palette
     *   3. placeholderTokens()— {{...}}, TODO, FIXME in dist/ only (not src/)
     *   4. importBoundaries() — D-32 + D-09 import/path-literal rules
     *
     * Scope: dist/+src/ for denylist (D-25), src/**\/*.{ts,tsx,css} for palette
     * (D-26), dist/ only for placeholders (D-27), src/ grep patterns for
     * boundaries (D-33). This script itself lives in scripts/ — intentionally
     * OUT of scope for all four checks, so its regex constants can reference
     * the disallowed literals without self-triggering.
     *
     * Regex note (placeholderTokens): we match the FULL token pair
     * `\{\{[^}]*\}\}`, not bare `\{\{` or `\}\}`. Minified JS/CSS contains
     * unpaired `}}` from nested object-literal closings (hundreds of occurrences
     * per build). Matching only full pairs catches real Mustache-style
     * `{{token}}` leaks without false positives.
     */
    ```

    with this exact updated block:

    ```ts
    /**
     * scripts/check-brand.ts — CI brand-invariant guard
     *
     * Runs as `postbuild` npm hook AND as a dedicated GH Actions step (double
     * coverage per D-28). Exit code is aggregate: any check fails → exit 1,
     * blocking deploy (D-29, no warn-only).
     *
     * No npm deps — uses node:child_process.execSync shelling out to GNU/BSD
     * grep (the `|| true` suffix handles BSD vs GNU exit-code difference).
     *
     * 5 checks:
     *   1. denylistTerms()      — silent-displacement literals in dist/+src/
     *   2. paletteWhitelist()   — hex literals in src/ ⊆ 6-canonical brandbook palette
     *   3. placeholderTokens()  — {{...}}, TODO, FIXME in dist/ only (not src/)
     *   4. importBoundaries()   — D-32 + D-09 import/path-literal rules
     *   5. noInlineTransition() — Phase 5 SC#1 — no inline JSX-prop transition objects in src/
     *
     * Scope: dist/+src/ for denylist (D-25), src/**\/*.{ts,tsx,css} for palette
     * (D-26), dist/ only for placeholders (D-27), src/ grep patterns for
     * boundaries (D-33), src/**\/*.{ts,tsx} for noInlineTransition (Phase 5 D-27).
     * This script itself lives in scripts/ — intentionally OUT of scope for all
     * five checks, so its regex constants can reference the disallowed literals
     * without self-triggering.
     *
     * Regex note (placeholderTokens): we match the FULL token pair
     * `\{\{[^}]*\}\}`, not bare `\{\{` or `\}\}`. Minified JS/CSS contains
     * unpaired `}}` from nested object-literal closings (hundreds of occurrences
     * per build). Matching only full pairs catches real Mustache-style
     * `{{token}}` leaks without false positives.
     *
     * Regex note (noInlineTransition): pattern is `transition=\{\{` — `=`
     * immediately followed by double-open-brace. Matches the JSX prop form
     * `transition={{ duration: ... }}`. Does NOT match `transition: {` (colon +
     * single brace) which is TypeScript object syntax in motionVariants.ts
     * Variants declarations — those are SOT-managed and correct.
     */
    ```

    **Change B — add the new function definition AND wire it into the results aggregate.** After the `importBoundaries()` function closes (~line 190 in the current file, just before the `// ---- Aggregate ----` separator), add the new function:

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

    Then update the `results` aggregate (currently lines 193-198) by appending `noInlineTransition()` to the array:

    Replace:
    ```ts
    // ---- Aggregate -----------------------------------------------------------
    const results = [
      denylistTerms(),
      paletteWhitelist(),
      placeholderTokens(),
      importBoundaries(),
    ];
    const passed = results.filter(Boolean).length;
    console.log(`[check-brand] ${passed}/${results.length} checks passed`);
    if (results.some((r) => !r)) process.exit(1);
    ```

    with:
    ```ts
    // ---- Aggregate -----------------------------------------------------------
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

    Doc-block self-screen: the new comment uses backtick-quoted code samples with single-brace TypeScript syntax `transition: {` AND describes the regex shape `transition=\{\{`. The script's intentional scripts/-out-of-scope rule (RESEARCH §scripts/ quarantine) means scripts/check-brand.ts can contain those literals without triggering its own checks. NO collisions.
  </action>
  <verify>
    <automated>grep -n '^function noInlineTransition' scripts/check-brand.ts | wc -l | tr -d ' ' | grep -q '^1$' && grep -n 'noInlineTransition()' scripts/check-brand.ts | wc -l | tr -d ' ' | grep -q '^[23]$' && grep -n '5 checks:' scripts/check-brand.ts | wc -l | tr -d ' ' | grep -q '^1$' && npx tsx scripts/check-brand.ts 2>&1 | tail -2 | grep -q '5/5 checks passed' && echo OK || (echo FAIL && exit 1)</automated>
  </verify>
  <done>
    - `grep -n '^function noInlineTransition' scripts/check-brand.ts` returns 1 match (function defined)
    - `grep -n 'noInlineTransition()' scripts/check-brand.ts` returns ≥ 2 matches (1 invocation in `results` array + at least 1 self-reference in PASS log; the function definition line uses `noInlineTransition(): boolean` so won't be counted by `noInlineTransition()` exact match)
    - `npx tsx scripts/check-brand.ts` exits 0 with output ending in `5/5 checks passed`
    - `npm run build` exits 0 (postbuild check-brand 5/5 PASS)
    - Future regression: any plan in Phase 6 or beyond that introduces an inline `transition={{ duration: ... }}` JSX prop will fail `npm run build` postbuild — the check is a permanent CI invariant going forward
  </done>
</task>

</tasks>

<verification>
- `npx tsx scripts/check-brand.ts` exits 0 with `5/5 checks passed` (was `4/4` before)
- `npm run build` exits 0 (postbuild step now runs the 5-check battery)
- The 4 existing checks still PASS (denylistTerms, paletteWhitelist, placeholderTokens, importBoundaries) — no regression
- Manual sanity: temporarily inject `<motion.div transition={{ duration: 0.5 }} />` somewhere in src/ → re-run check → expect exit 1 with FAIL message → revert
</verification>

<success_criteria>
- [ ] `noInlineTransition()` function exists in scripts/check-brand.ts following the existing 4-check pattern
- [ ] Function is invoked in the `results` aggregate as the 5th element
- [ ] Top-of-file doc-block updated from "4 checks" to "5 checks" with description of the new check
- [ ] `npx tsx scripts/check-brand.ts` exits 0 with "5/5 checks passed" output
- [ ] `npm run build` exits 0
- [ ] Phase 5 SC#1 grep gate is now ENFORCED in CI (was a one-time external grep before; now a permanent invariant in the postbuild gate)
</success_criteria>

<output>
After completion, create `.planning/phases/05-animations-polish/05-08-no-inline-transition-check-SUMMARY.md` documenting:
- Verbatim final form of the new noInlineTransition() function (~20 lines)
- Confirmation of "5/5 checks passed" on first build
- Note that this is a forward-defence gate: zero violations expected at Phase 5 closure, but the gate prevents regressions in Phase 6+ (e.g., if a Phase 6 perf-tuning task adds inline `transition={{...}}` for some hover micro-interaction)
- Note that scripts/ is intentionally out-of-scope for all 5 checks (preserves the script's ability to define its own regex constants without self-triggering — RESEARCH §scripts/ quarantine D-precedent)
</output>
