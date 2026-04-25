---
phase: 04-portfolio-construction-log-contact
plan: 04
type: execute
wave: 1
depends_on: []
files_modified:
  - scripts/check-brand.ts
  - scripts/optimize-images.mjs
autonomous: true
requirements: [HUB-04, LOG-01]
must_haves:
  truths:
    - "scripts/check-brand.ts importBoundaries() rule 4 (projects.fixtures import) excludes src/pages/DevGridPage.tsx so /dev/grid can compile"
    - "scripts/optimize-images.mjs construction widths grow from [640, 960] to [640, 960, 1920] so Lightbox can serve fullscreen 1920w variant"
    - "Both edits preserve idempotency and existing 4-check brand-guard behavior"
  artifacts:
    - path: "scripts/check-brand.ts"
      provides: "Updated importBoundaries() rule 4 with DevGridPage.tsx exclusion clause"
      contains: "DevGridPage"
    - path: "scripts/optimize-images.mjs"
      provides: "Construction-tree processed at 3 widths including 1920 for lightbox fullscreen"
      contains: "[640, 960, 1920]"
  key_links:
    - from: "scripts/check-brand.ts"
      to: "(downstream consumer Wave 2 plan 04-09 DevGridPage)"
      via: "fixture-import exclusion clause"
      pattern: "DevGridPage"
    - from: "scripts/optimize-images.mjs"
      to: "(downstream consumer Wave 2 plan 04-07 ConstructionLogPage Lightbox)"
      via: "1920w AVIF/WebP/JPG variants for construction photos"
      pattern: "1920"
---

<objective>
Two surgical edits to the build infrastructure — both gating Wave 2:

1. **`scripts/check-brand.ts` rule-4 DevGridPage exclusion** (RESEARCH Open Question 1, marked BLOCKER). The current rule-4 grep (line 168-172) blocks ALL imports of `projects.fixtures` from `src/pages/` and `src/components/`. Wave 2 plan 04-09 must create `src/pages/DevGridPage.tsx` that imports fixtures — without this exclusion, the build fails at postbuild.

2. **`scripts/optimize-images.mjs` construction widths** (D-29). Line 84 currently calls `processTree(join(PUBLIC, 'construction'), [640, 960])` — extend to `[640, 960, 1920]` so the Lightbox `<ResponsivePicture widths={[1920]}>` consumer (plan 04-07 MonthGroup → Lightbox) finds 1920w variants in `_opt/`. Idempotent; existing 640/960 outputs untouched.

Purpose: clear the two infrastructure gates blocking Wave 2 + Wave 3. Both edits are single-line / surgical.

Output: 2 files edited (zero new files).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@scripts/check-brand.ts
@scripts/optimize-images.mjs
@src/data/projects.fixtures.ts

<interfaces>
Current state of scripts/check-brand.ts importBoundaries() rule 4 (lines 168-172):
```typescript
{
  label: 'pages and components must not import projects.fixtures',
  cmd:
    `grep -rnE 'projects\\.fixtures' src/pages/ src/components/ ` +
    `--include='*.ts' --include='*.tsx'`,
},
```

Resolution per RESEARCH Open Question 1 (Option 1, recommended): pipe the grep output through a second grep that strips DevGridPage matches:
```typescript
`grep -rnE 'projects\\.fixtures' src/pages/ src/components/ --include='*.ts' --include='*.tsx' | grep -v 'DevGridPage' || true`
```
Wait — note that the existing run() helper in this file already appends `|| true`. The negation `grep -v 'DevGridPage'` should be inside the BUILT command, BEFORE the `|| true` is appended by run().

Current state of scripts/optimize-images.mjs lines 83-84:
```javascript
await processTree(join(PUBLIC, 'renders'), [640, 1280, 1920]);
await processTree(join(PUBLIC, 'construction'), [640, 960]);
```

Edit line 84 only:
```javascript
await processTree(join(PUBLIC, 'construction'), [640, 960, 1920]);
```

Idempotency analysis (verified in RESEARCH §Q14 + §Pitfall 10): per-output-file mtime check at optimizeFile() lines 50-56 means existing 640/960 outputs skip; 1920 outputs don't exist yet, so they encode. Sharp `withoutEnlargement: true` at line 53 caps real width at source size (1080 for these phone photos), so output filename is `mar-01-1920.{avif,webp,jpg}` but pixel width may stay at 1080 — that's correct behavior; lightbox displays 1080 at 100vw which is fine for desktop.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Update scripts/check-brand.ts rule 4 to exclude DevGridPage from fixtures-import boundary check</name>
  <read_first>
    - scripts/check-brand.ts (full file — confirm rule 4 location at lines 161-172, the run() helper at lines 32-41, and how `|| true` is appended)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Open Question 1 (BLOCKER for /dev/grid; recommended resolution Option 1)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-39, D-40, D-41 — DevGridPage scope)
    - src/data/projects.fixtures.ts (lines 1-19 — confirm IMPORT BOUNDARY doc-block already mentions «Only the hidden /dev/grid route (Phase 4) and any future Vitest suites may import it»)
  </read_first>
  <files>scripts/check-brand.ts</files>
  <action>
    Edit `scripts/check-brand.ts` rule 4 (currently lines 161-172). Modify the `cmd` string to pipe through `grep -v 'DevGridPage'` so DevGridPage.tsx imports are excluded from the boundary check.

    **Find this block:**
    ```typescript
    {
      label: 'pages and components must not import projects.fixtures',
      cmd:
        `grep -rnE 'projects\\.fixtures' src/pages/ src/components/ ` +
        `--include='*.ts' --include='*.tsx'`,
    },
    ```

    **Replace with:**
    ```typescript
    {
      // Rule 4 exclusion (Phase 4 plan 04-04, RESEARCH Open Question 1):
      // src/pages/DevGridPage.tsx is THE hidden QA surface for the
      // /dev/grid route (D-39..D-42 + ZHK-02 scale-to-N stress test). It is
      // expected and required to import fixtures — that is the explicit
      // boundary exception per src/data/projects.fixtures.ts module rule.
      // The fixtures-import ban applies to ALL OTHER pages/components.
      label: 'pages and components must not import projects.fixtures (DevGridPage exempt)',
      cmd:
        `grep -rnE 'projects\\.fixtures' src/pages/ src/components/ ` +
        `--include='*.ts' --include='*.tsx' | grep -v 'DevGridPage'`,
    },
    ```

    **Critical observations:**
    - The `run()` helper at lines 32-41 appends `' || true'` after the cmd. So the final shelled-out command becomes:
      `grep -rnE 'projects\.fixtures' src/pages/ src/components/ --include='*.ts' --include='*.tsx' | grep -v 'DevGridPage' || true`
    - When the upstream grep finds no matches: it exits 1, the `| grep -v 'DevGridPage'` receives empty input, exits 1; `|| true` normalizes to exit 0. Output: empty. PASS.
    - When the upstream grep finds only DevGridPage matches: those are filtered out by `grep -v`; output empty; exit code resolves to 0 via `|| true`. PASS.
    - When the upstream grep finds non-DevGridPage matches (the boundary violation we want to catch): output is non-empty; check fails as before. FAIL — boundary still enforced.
    - Label updated to «(DevGridPage exempt)» so the failure log makes the exception self-documenting if a future violation occurs.

    **Verify the rest of rule 4's checks are not regressed.** The 4 OTHER rules (components→pages, data→react, content→react, raw renders/construction paths) remain byte-identical. Only this single block is edited.

    Per RESEARCH Open Question 1 Resolution (Option 1, planner-recommended) + D-39..D-42.
  </action>
  <verify>
    <automated>grep -nE "DevGridPage" scripts/check-brand.ts && grep -nE "grep -v 'DevGridPage'" scripts/check-brand.ts && grep -nE "DevGridPage exempt" scripts/check-brand.ts && npm run lint && npm run postbuild</automated>
  </verify>
  <done>
    - `scripts/check-brand.ts` line ~170 contains the literal `grep -v 'DevGridPage'`.
    - The label string contains the substring `DevGridPage exempt`.
    - `npm run lint` exits 0 (the script is .ts, lint covers it).
    - `npm run postbuild` reports `[check-brand] 4/4 checks passed` (assumes a `dist/` exists from a recent build; if not, run `npm run build` first which will trigger postbuild).
    - The 3 OTHER importBoundaries rules + 3 OTHER top-level checks (denylistTerms, paletteWhitelist, placeholderTokens) are unmodified — diff shows only the rule-4 cmd string changed.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Extend scripts/optimize-images.mjs construction widths to [640, 960, 1920]</name>
  <read_first>
    - scripts/optimize-images.mjs (full file — confirm line 84 location and confirm optimizeFile() idempotency at lines 41-57)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-29)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q14 (one-line widths edit, idempotency analysis) + §Pitfall 10 (output existence guard)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q11 (1080×1346 4:5 source — Sharp withoutEnlargement caps at 1080)
  </read_first>
  <files>scripts/optimize-images.mjs</files>
  <action>
    Edit `scripts/optimize-images.mjs` line 84. Change ONE literal:

    **Find this line:**
    ```javascript
    await processTree(join(PUBLIC, 'construction'), [640, 960]);
    ```

    **Replace with:**
    ```javascript
    await processTree(join(PUBLIC, 'construction'), [640, 960, 1920]);
    ```

    **No other changes to the file.** No new exports, no new functions, no Sharp parameter tuning. The encoder params (AVIF q=50 effort=4, WebP q=75, JPG q=80 mozjpeg) at lines 35-39 stay verbatim per D-29.

    **Effect:**
    - 50 photos × 3 formats × 1 new width = 150 new files emitted into `public/construction/{month}/_opt/` on the next `npm run prebuild`.
    - Existing 640w and 960w outputs untouched (idempotency at line 52 mtime check).
    - Build cost: cold first run after this edit ≈ 15-30 sec extra encoding. Warm runs (subsequent prebuild) ≈ 500ms (skip path fires for all 480 → 630 outputs).
    - Sharp `withoutEnlargement: true` at line 53 caps real pixel width at source resolution (1080 for these phone photos). Filename is `mar-01-1920.{avif,webp,jpg}` regardless of actual decoded width — Lightbox `<ResponsivePicture widths={[1920]}>` requests by name and gets the available variant.

    Per D-29 (locked).
  </action>
  <verify>
    <automated>grep -nE "\[640, 960, 1920\]" scripts/optimize-images.mjs && grep -nE "construction.*640.*960.*1920" scripts/optimize-images.mjs && npm run prebuild && [ "$(ls public/construction/mar-2026/_opt/*-1920.* 2>/dev/null | wc -l)" -ge 3 ]</automated>
  </verify>
  <done>
    - `scripts/optimize-images.mjs` line ~84 contains the literal `[640, 960, 1920]` for the construction tree.
    - The renders tree call (line ~83) still has `[640, 1280, 1920]` — unchanged.
    - `npm run prebuild` exits 0 and logs construction encoding output.
    - After prebuild: `ls public/construction/mar-2026/_opt/*-1920.* 2>/dev/null | wc -l` returns ≥3 (at least one source file × avif + webp + jpg variants present, regardless of source filename).
    - All 4 months × ~12-15 photos × 3 formats × 1 new width ≈ 150 new files generated total across `public/construction/{dec-2025,jan-2026,feb-2026,mar-2026}/_opt/`.
    - `npm run build` exits 0 (full chain green).
    - Subsequent `npm run prebuild` (re-run) is fast — skip path fires for all outputs (idempotency confirmed).
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **DevGridPage exclusion in place**: `grep -nE "DevGridPage" scripts/check-brand.ts` returns at least 2 matches (label string + grep -v command).

2. **Construction widths extended**: `grep -nE "\[640, 960, 1920\]" scripts/optimize-images.mjs` returns 1 match.

3. **Build pipeline green**: `npm run build` exits 0 (prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).

4. **1920w construction outputs exist**:
   ```
   ls public/construction/mar-2026/_opt/mar-01-1920.{avif,webp,jpg}
   ```
   Should print 3 files without errors.

5. **No regression in existing 4 brand checks**: `npm run postbuild` reports `4/4 checks passed`.

6. **No regression in renders tree**: `ls public/renders/etno-dim/_opt/43615.jpg-1920.avif` should still exist (untouched).
</verification>

<success_criteria>
- HUB-04 enabled (Wave 2 plan 04-09 DevGridPage no longer blocked by importBoundaries grep).
- LOG-01 enabled (Wave 2 plan 04-07 ConstructionLogPage MonthGroup → Lightbox can request 1920w variants).
- Brand-guard 4/4 checks still green; only rule-4 logic clarified, never weakened.
- Sharp encoder params unchanged (D-29 explicitly locks them).
- Idempotency preserved — re-running prebuild is fast, no destructive re-encoding.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-04-SUMMARY.md` documenting:
- 2 file paths edited (zero new files)
- Decision IDs implemented (D-29 + RESEARCH Open Question 1 resolution)
- `npm run lint`, `npm run prebuild`, `npm run build`, `npm run postbuild` exit codes
- Cold-run encoding time delta (expected +15-30 sec on first prebuild after edit)
- Number of new 1920w variant files generated (expected ~150 across construction tree)
- Note for Wave 2 plans: 04-07 (MonthGroup → Lightbox) can now safely pass `widths={[1920]}` for construction photos; 04-09 (DevGridPage) can `import { fixtures } from '../data/projects.fixtures'` without tripping the brand-guard
</output>
