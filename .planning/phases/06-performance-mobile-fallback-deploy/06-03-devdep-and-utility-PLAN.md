---
phase: 06-performance-mobile-fallback-deploy
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - src/index.css
  - .gitignore
autonomous: true
requirements: [QA-02]
must_haves:
  truths:
    - "package.json declares `@lhci/cli@^0.15.1` as a devDependency"
    - "`npx lhci --version` reports 0.15.x (lhci CLI is installed and runnable from node_modules)"
    - "src/index.css declares a `@utility mark-pulse` block + `@keyframes mark-pulse` (0.4 → 0.8 opacity, 1.2s, var(--ease-brand)) + a `@media (prefers-reduced-motion: reduce)` override forcing `animation: none; opacity: 0.6;`"
    - ".gitignore excludes the build-time-generated PNGs `public/og-image.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` (RESEARCH §Runtime State Inventory)"
  artifacts:
    - path: package.json
      provides: "@lhci/cli@^0.15.1 devDep entry for the Wave 4 lhci CI gate"
      contains: "@lhci/cli"
    - path: src/index.css
      provides: "Brand-consistent CSS-only opacity-pulse utility class (mark-pulse) used by MarkSpinner.tsx in plan 06-05 (D-10)"
      contains: "@utility mark-pulse"
    - path: .gitignore
      provides: "Excludes 3 build-time-generated PNG artifacts from git (RESEARCH §Runtime State Inventory)"
      contains: "og-image.png"
  key_links:
    - from: "package.json devDependencies"
      to: "node_modules/@lhci/cli"
      via: "npm install"
      pattern: "@lhci/cli"
    - from: "src/index.css mark-pulse @utility"
      to: "src/components/ui/MarkSpinner.tsx (built in plan 06-05)"
      via: "className=\"mark-pulse\""
      pattern: "@utility mark-pulse"
---

<objective>
Three independent foundation chores in Wave 1 — packaged together because each is a one-shot small change with zero coupling to the hooks plan (06-01) or the content/SVG plan (06-02). Combined LOC: ~25 lines across 4 files.

**Chore 1 — Install `@lhci/cli@^0.15.1` as devDep** (CONTEXT D-32 + RESEARCH §"Standard Stack → New for Phase 6"):
The Wave 4 plan (06-09) creates `.lighthouserc.cjs` and `.github/workflows/lighthouse.yml` that invoke `lhci autorun`. Both require `@lhci/cli` to be installed. Pin version `^0.15.1` (latest stable, uses Lighthouse 12.6.1 with no PWA category — matches CONTEXT D-31 4-category assertions verbatim). Devdep only — never bundled, runs only in CI.

**Chore 2 — Add `@utility mark-pulse` block + `@keyframes` + reduced-motion override** to `src/index.css` (CONTEXT D-10 + Specifics §"`<MarkSpinner>` minimal CSS-only implementation"):
The `<MarkSpinner>` component (built in plan 06-05) is the Suspense fallback for the 3 lazy routes. Per D-10 Claude's Discretion + RESEARCH recommendation: CSS-only `@keyframes` (NOT Motion). Reasoning: Suspense fallback gates lazy chunks — if the fallback itself imports Motion, you defeat the lazy-split purpose for routes that crash on chunk-load. CSS-only keeps the fallback chunk genuinely lightweight.

Pulse magnitude: 0.4 → 0.8 (Claude's Discretion within D-10 «brand стримано»). Duration: 1.2s. Easing: `var(--ease-brand)` (Phase 5 D-23 exposed this CSS variable). Reduced-motion path: `animation: none; opacity: 0.6;` (per brand-system §6 hard-rule + Phase 5 D-25 RM threading).

**Chore 3 — Add 3 generated PNG artifacts to `.gitignore`** (RESEARCH §"Runtime State Inventory"):
`scripts/build-og-image.mjs` (created in plan 06-06) generates `public/og-image.png`, `public/apple-touch-icon.png`, and `public/favicon-32.png` from SVG sources at every build. These are build outputs, not source — they should not be in git (same logic as `dist/` and `public/renders/_opt/` already in .gitignore from Plan 02-03). The script is idempotent (mtime-based skip), so excluding them from git keeps the repo clean and forces every CI build to regenerate from the SVG source-of-truth.

Output: 4 files modified (package.json + package-lock.json from npm install, src/index.css, .gitignore). All changes are additive; zero existing behavior changes; no consumer needs anything from this plan synchronously (Wave 2 consumers use these artifacts but don't break if absent — lhci is Wave 4, mark-pulse is Wave 2's plan 06-05, gitignore is hygiene).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md
@package.json
@src/index.css
@.gitignore
</context>

<interfaces>
<!-- Existing src/index.css @utility pattern reference (Phase 5 introduced @utility hover-card; Phase 6 adds mark-pulse the same way). -->

The existing `src/index.css` is Tailwind v4 CSS-first format with `@theme` block (palette + ease-brand var) and may already have one or more `@utility {name} { ... }` blocks. Read the full file before editing. The mark-pulse utility goes alongside any existing utility blocks (pattern: one block per utility, with the @keyframes definition adjacent — Tailwind v4 accepts plain CSS `@keyframes` outside `@theme`).

Phase 5 D-23 declared `--ease-brand` in the @theme block, used as `var(--ease-brand)` in CSS or `easeBrand` in JS via motionVariants.ts. Phase 6 mark-pulse references it the CSS way:

```css
@utility mark-pulse {
  animation: mark-pulse 1.2s var(--ease-brand) infinite alternate;
}

@keyframes mark-pulse {
  from { opacity: 0.4; }
  to   { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .mark-pulse {
    animation: none;
    opacity: 0.6;
  }
}
```

<!-- Existing .gitignore content (read before editing) -->

Plan 02-03 created the project .gitignore with: `dist/`, `node_modules/`, `public/renders/`, `public/construction/`, `.DS_Store`, editor caches. Phase 6 appends 3 PNG artifact paths. Read the current file shape before edits.

<!-- @lhci/cli verified version (RESEARCH §Standard Stack) -->

```
$ npm view @lhci/cli version
0.15.1
```

Pin to `^0.15.1` (caret allows 0.15.x patch updates). Lighthouse 12.6.1 internal — no PWA category — matches CONTEXT D-31 4-category assertions exactly.
</interfaces>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Install @lhci/cli@^0.15.1 as devDependency (D-32 + RESEARCH §Standard Stack)</name>
  <read_first>
    - package.json (full file — must understand current devDeps list before adding)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-32 (devdep, not bundled)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Standard Stack → New for Phase 6" (version verified 2026-04-26)
  </read_first>
  <files>package.json, package-lock.json</files>
  <action>
    Run from repo root:

    ```bash
    npm install -D @lhci/cli@^0.15.1
    ```

    This:
    - Adds `@lhci/cli` to `devDependencies` in `package.json` with the caret range `^0.15.1`
    - Updates `package-lock.json` with the resolved tree (~30 transitive packages)
    - Installs into `node_modules/@lhci/cli/` → `node_modules/.bin/lhci` becomes available

    Verify the install:
    ```bash
    npx lhci --version
    ```
    Expected: prints `0.15.x` (any patch within the caret range).

    If `npm install -D` fails for any reason (network, registry timeout), do NOT manually edit package.json — re-run the install. Manual edit risks lock-file drift from the registry-resolved tree.

    Commit both `package.json` and `package-lock.json` (the lock file is the source of truth for CI reproducibility — Phase 1 D-15 deploy.yml runs `npm ci` which requires the lock).
  </action>
  <verify>
    <automated>grep -q '"@lhci/cli"' package.json && npx lhci --version 2>&1 | grep -qE '^0\.15\.' && test -f package-lock.json && grep -q '"@lhci/cli"' package-lock.json && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c '"@lhci/cli"' package.json` returns 1 (single entry in devDependencies)
    - `node -e "console.log(require('./package.json').devDependencies['@lhci/cli'])"` prints a string starting with `^0.15` (caret range matches)
    - `npx lhci --version` exits 0 and prints a version starting with `0.15.` (e.g. `0.15.1`)
    - `test -f package-lock.json` exits 0
    - `grep -c '"@lhci/cli"' package-lock.json` returns ≥ 1 (lock file has entry)
    - `node -e "require('@lhci/cli/package.json')"` exits 0 (module resolves from node_modules — useful for CI sanity)
    - `npx tsc --noEmit` exits 0 (no type-check regressions)
    - `npm run build` exits 0 (build is unaffected by the new devDep)
  </acceptance_criteria>
  <done>
    - `@lhci/cli@^0.15.1` is in `package.json` devDependencies
    - `package-lock.json` updated with resolved tree
    - `npx lhci --version` prints 0.15.x
    - Plan 06-09 (Wave 4 lhci CI gate) can now reference `npx lhci autorun` without a missing-binary error
    - Build remains green; no runtime/bundle weight added (devdep only, never imported by src/)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add `@utility mark-pulse` + `@keyframes` + reduced-motion override to src/index.css (D-10 + Phase 5 D-23 ease-brand pattern)</name>
  <read_first>
    - src/index.css (full file — must see existing @theme block + any existing @utility blocks before adding the new one)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-10 (Suspense fallback = MarkSpinner with subtle opacity pulse)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §Specifics "<MarkSpinner> minimal CSS-only implementation" (verbatim CSS template)
    - .planning/phases/05-animations-polish/05-CONTEXT.md §D-23 (--ease-brand declared in @theme; src/index.css already exposes it as a CSS variable)
    - brand-system.md §6 (DO/DON'T: no bouncy springs; respects prefers-reduced-motion)
  </read_first>
  <files>src/index.css</files>
  <action>
    First, read `src/index.css` end-to-end. Identify an appropriate insertion point — typically AFTER any existing `@utility` block(s) and BEFORE any global element selectors or media queries unrelated to motion.

    Append the following block (or insert at the located insertion point — the order does not matter functionally because CSS specificity is selector-based, but place it grouped with other @utility blocks for readability):

    ```css
    /* QA-02 Suspense fallback opacity-pulse for <MarkSpinner> (Phase 6 D-10).
     *
     * CSS-only — Suspense fallback gates lazy chunks; the fallback itself
     * MUST NOT import Motion (defeats the lazy-split purpose). @keyframes
     * with var(--ease-brand) keeps brand timing consistent with Phase 5
     * SOT (motionVariants.ts uses the same easing curve in JS form).
     *
     * Pulse: 0.4 → 0.8 opacity, 1.2s, ease-brand (Phase 5 D-23), infinite
     * alternating. Brand «стримано» — no bouncy spring (brand-system §6).
     *
     * Reduced-motion override: animation: none + static 0.6 opacity (mid-
     * point of the pulse range). Phase 5 D-25 RM-threading pattern.
     */
    @utility mark-pulse {
      animation: mark-pulse 1.2s var(--ease-brand) infinite alternate;
    }

    @keyframes mark-pulse {
      from { opacity: 0.4; }
      to   { opacity: 0.8; }
    }

    @media (prefers-reduced-motion: reduce) {
      .mark-pulse {
        animation: none;
        opacity: 0.6;
      }
    }
    ```

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (zero matches in this CSS comment)
    - Hex literals: NO `#XXXXXX` patterns (zero — opacity values 0.4/0.6/0.8 only)
    - Placeholder tokens: NO `{{...}}` patterns (verified — no Mustache pairs)
    - Inline transition: NO `transition={{` JSX prop pattern (this is a CSS file, no JSX)
    - Import boundaries: not applicable (CSS file)

    Note on `@utility` directive: this is Tailwind v4 syntax. The block defines a custom utility class `mark-pulse` that components can use via `className="mark-pulse"`. The `@keyframes` block is plain CSS, fully supported by Tailwind v4's CSS-first pipeline. The `@media (prefers-reduced-motion: reduce)` block is standard CSS — `.mark-pulse` selector targets the SAME class the @utility declares.
  </action>
  <verify>
    <automated>grep -q "@utility mark-pulse" src/index.css && grep -q "@keyframes mark-pulse" src/index.css && grep -q "var(--ease-brand)" src/index.css && grep -q "prefers-reduced-motion: reduce" src/index.css && grep -c "opacity: 0.4" src/index.css | grep -qE '^[1-9]' && grep -c "opacity: 0.8" src/index.css | grep -qE '^[1-9]' && grep -c "opacity: 0.6" src/index.css | grep -qE '^[1-9]' && npm run build && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "@utility mark-pulse" src/index.css` returns 1
    - `grep -c "@keyframes mark-pulse" src/index.css` returns 1
    - `grep -c "var(--ease-brand)" src/index.css` returns ≥ 1 (the new mark-pulse uses it; existing references may be present too)
    - `grep -c "prefers-reduced-motion: reduce" src/index.css` returns ≥ 1 (new block; may already exist for other reduced-motion overrides)
    - `grep -q "animation: mark-pulse 1.2s" src/index.css` exits 0 (correct duration)
    - `grep -q "animation: none" src/index.css` exits 0 (reduced-motion override path)
    - `grep -q "opacity: 0.6" src/index.css` exits 0 (reduced-motion static value)
    - `npm run build` exits 0 (Tailwind v4 + Vite compile the new utility cleanly into dist/)
    - `npx tsx scripts/check-brand.ts` exits 0 (5/5 — paletteWhitelist scope is `*.{ts,tsx,css}` and the new comment uses no hex literals; no false positive)
    - In dist build output: `grep -r "mark-pulse" dist/assets/*.css` finds the compiled class (i.e. Tailwind v4 emitted the utility into the production CSS — confirms the `@utility` block was syntactically valid)
  </acceptance_criteria>
  <done>
    - `@utility mark-pulse` block exists in src/index.css with `animation: mark-pulse 1.2s var(--ease-brand) infinite alternate`
    - `@keyframes mark-pulse` defined: `from { opacity: 0.4 }` → `to { opacity: 0.8 }`
    - `@media (prefers-reduced-motion: reduce) { .mark-pulse { animation: none; opacity: 0.6; } }` block present
    - `npm run build` exits 0 with `[check-brand] 5/5 checks passed`
    - dist build includes the compiled `mark-pulse` class (verifiable in dist/assets/*.css)
    - Plan 06-05 MarkSpinner.tsx can use `<Mark className="mark-pulse w-12 h-12" />` directly
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Add build-time PNG artifacts to .gitignore (RESEARCH §Runtime State Inventory)</name>
  <read_first>
    - .gitignore (full current file — must see existing rules before appending)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-RESEARCH.md §"Runtime State Inventory" (3 PNG artifacts ARE build outputs, NOT source — should be regenerated every CI build from SVG SOT)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md §D-28 (idempotent generator: skip if PNG mtime ≥ source SVG mtime)
  </read_first>
  <files>.gitignore</files>
  <action>
    Read current `.gitignore` end-to-end. Append a new section at the end with these 4 lines (3 paths + 1 comment header):

    ```
    # Phase 6: build-time PNG artifacts generated by scripts/build-og-image.mjs from
    # brand-assets/og/og.svg (OG image) and brand-assets/favicon/favicon-32.svg (icons).
    # SVGs are source-of-truth; PNGs are reproducible from `npm run build` (idempotent
    # mtime check in build-og-image.mjs). Excluding from git keeps repo clean.
    public/og-image.png
    public/apple-touch-icon.png
    public/favicon-32.png
    ```

    If the .gitignore already excludes a broad pattern that covers these (e.g. `public/*.png` or `*.png`), check first — if covered, this task is a no-op + a comment-only diff documenting the intent (still preferred for explicit traceability rather than relying on a broad pattern that may be relaxed later).

    Doc-block self-screen:
    - Forbidden lexicon: NO «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (verified zero)
    - Hex literals: NO `#XXXXXX` (zero)
    - Placeholder tokens: NO `{{...}}` (zero)
    - Other: .gitignore is text — not in any check-brand scope. No collisions possible.
  </action>
  <verify>
    <automated>grep -q "^public/og-image.png" .gitignore && grep -q "^public/apple-touch-icon.png" .gitignore && grep -q "^public/favicon-32.png" .gitignore && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "^public/og-image.png" .gitignore` returns 1
    - `grep -c "^public/apple-touch-icon.png" .gitignore` returns 1
    - `grep -c "^public/favicon-32.png" .gitignore` returns 1
    - `grep -c "Phase 6:" .gitignore` returns ≥ 1 (the new section comment header is present)
    - `git check-ignore -v public/og-image.png` exits 0 (git confirms the path is ignored — this works even when the file does not yet exist on disk)
    - `git check-ignore -v public/apple-touch-icon.png` exits 0
    - `git check-ignore -v public/favicon-32.png` exits 0
  </acceptance_criteria>
  <done>
    - `.gitignore` contains the 3 new entries `public/og-image.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` with a comment header explaining the rationale
    - `git check-ignore` confirms all 3 paths are git-ignored
    - When plan 06-06 generates these files via `scripts/build-og-image.mjs`, they will NOT show up in `git status` — repo stays clean across builds
  </done>
</task>

</tasks>

<verification>
- `grep -q '"@lhci/cli"' package.json && npx lhci --version` exits 0 and prints 0.15.x
- `grep -q "@utility mark-pulse" src/index.css && grep -q "@keyframes mark-pulse" src/index.css` exits 0
- `grep -q "^public/og-image.png" .gitignore` exits 0
- `npm run build` exits 0 with `[check-brand] 5/5 checks passed` (no regression — chores 1+2+3 are additive, no existing behavior changes)
- `npx tsc --noEmit` exits 0
- Bundle size unchanged: `gzip -c dist/assets/index-*.js | wc -c` returns approximately the pre-Wave-1 baseline (133.9KB) ± noise. New devDep does NOT bundle into src/.
</verification>

<success_criteria>
- [ ] `@lhci/cli@^0.15.1` installed as devDependency, `npx lhci --version` reports 0.15.x
- [ ] `package-lock.json` updated and committed (CI `npm ci` will reproduce the install deterministically)
- [ ] `src/index.css` ships `@utility mark-pulse` + `@keyframes mark-pulse` + reduced-motion override
- [ ] `mark-pulse` class compiles into `dist/assets/*.css` after `npm run build`
- [ ] `.gitignore` excludes 3 build-time PNG artifacts under `public/`
- [ ] No regressions: `npm run build` green, `npx tsc --noEmit` green, `npx tsx scripts/check-brand.ts` 5/5
</success_criteria>

<output>
After completion, create `.planning/phases/06-performance-mobile-fallback-deploy/06-03-devdep-and-utility-SUMMARY.md` documenting:
- The exact `@lhci/cli` version installed (e.g. `0.15.1` reported by `npx lhci --version`)
- The new src/index.css block (verbatim ~15 lines)
- The new .gitignore entries
- Confirmation that bundle size is unchanged (devDep is never bundled; mark-pulse is CSS-only and Tailwind v4 only emits utilities that are referenced in src/ — no bytes added until plan 06-05 MarkSpinner uses className="mark-pulse")
- Note that consumer Wave 2 plan 06-05 uses the mark-pulse @utility, and Wave 4 plan 06-09 uses the @lhci/cli binary
- Note that .gitignore exclusions activate when plan 06-06 first generates the 3 PNGs — until then, no observable change
</output>
