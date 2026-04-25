---
phase: 04-portfolio-construction-log-contact
plan: 10
type: execute
wave: 3
depends_on: ["04-03", "04-05", "04-06a", "04-06b", "04-07"]
files_modified:
  - src/components/sections/projects/FlagshipCard.tsx
  - src/components/sections/projects/PipelineCard.tsx
  - src/components/sections/home/PortfolioOverview.tsx
autonomous: true
requirements: [ANI-03]
must_haves:
  truths:
    - "FlagshipCard <article> applies hover triple-effect (scale-1.02 + accent shadow + transition + ease-out + motion-reduce variants)"
    - "PipelineCard <article> (the inner shape inside the link wrapper) applies the SAME hover class string"
    - "Home PortfolioOverview's inline pipeline grid <article> elements (the .map at lines 90-112 of that file, kept inline per plan 04-03) ALSO apply the same hover class string — D-30 explicit retroactive sweep"
    - "Construction-log thumb buttons + zhk gallery thumb buttons ALREADY have hover (shipped in plans 04-06 and 04-07) — this plan does NOT regress them"
    - "All hover surfaces: zero `transition-all`, zero `spring`, all use explicit property list `transition-[transform,box-shadow,background-color]` + `cubic-bezier(0.22,1,0.36,1)`"
    - "All hover surfaces honor `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` (D-35)"
  artifacts:
    - path: "src/components/sections/projects/FlagshipCard.tsx"
      provides: "Hover-enabled flagship card (used on home + /projects + /dev/grid)"
      contains: "hover:scale-\\[1.02\\]"
    - path: "src/components/sections/projects/PipelineCard.tsx"
      provides: "Hover-enabled pipeline card (used on /projects + /dev/grid)"
      contains: "hover:scale-\\[1.02\\]"
    - path: "src/components/sections/home/PortfolioOverview.tsx"
      provides: "Home pipeline grid <article> with retroactive hover (D-30)"
      contains: "hover:scale-\\[1.02\\]"
  key_links:
    - from: "src/components/sections/projects/FlagshipCard.tsx"
      to: "(consumers home + /projects + /dev/grid all inherit hover)"
      via: "shared <article> with hover class string"
      pattern: "hover:scale"
---

<objective>
Cross-surface ANI-03 hover sweep — apply the brand-consistent hover triple-effect to the 3 remaining surfaces that don't already have it:

1. **`<FlagshipCard>`** (`src/components/sections/projects/FlagshipCard.tsx`) — applied to the outer `<article>`. Affects home `/`, `/projects`, and `/dev/grid` simultaneously (single component).
2. **`<PipelineCard>`** (`src/components/sections/projects/PipelineCard.tsx`) — applied to the inner `<article>` (the visual surface; the outer link/div wrapper handles cursor semantics per D-34).
3. **Home `PortfolioOverview` inline pipeline grid** (`src/components/sections/home/PortfolioOverview.tsx` lines 90-112) — D-30 explicit «Phase 4 wires both surfaces, retroactively touching the home component». The home pipeline cards stayed inline-mapped per plan 04-03 (not extracted to PipelineCard); this plan adds the hover class string directly to those inline `<article>` elements.

Already-hovering surfaces (NOT touched by this plan):
- ZhkGallery thumbs (plan 04-06)
- ConstructionLog MonthGroup thumbs (plan 04-07)

Hover spec verbatim (D-31..D-35):
- `transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`
- `hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`
- `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`
- D-34: Maietok / NTEREST grid-only cards keep `cursor-default` (already in PipelineCard).

Output: 3 file edits (no new files).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/components/sections/projects/FlagshipCard.tsx
@src/components/sections/projects/PipelineCard.tsx
@src/components/sections/home/PortfolioOverview.tsx
@src/components/sections/zhk/ZhkGallery.tsx
@src/components/sections/construction-log/MonthGroup.tsx

<interfaces>
The exact hover class string to apply (D-31..D-35, verbatim from RESEARCH §F):
```
transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]
motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none
```

Tailwind v4.2 confirmed support (RESEARCH §Q5 + §Q16):
- Arbitrary-value classes (`scale-[1.02]`, `shadow-[...]`, `ease-[cubic-bezier(...)]`) compile correctly.
- `motion-reduce:` modifier emits `@media (prefers-reduced-motion: reduce)`.
- `transition-[...]` with explicit comma-separated property list NOT `transition-all` (D-32 + Pitfall 3).

The `(193,243,61)` decimal triple = `#C1F33D` brand accent. Source paletteWhitelist regex (`#[0-9A-Fa-f]{3,6}`) does NOT match decimal-rgba — safe.

PipelineCard.tsx structure (after plan 04-05): outer is either `<a href="#/zhk/...">` (clickable) or `<div className="cursor-default">` (non-clickable per D-34); inner is the `<article>`. The hover scale should apply to the visual `<article>` (so non-clickable cards still glow).

Home PortfolioOverview.tsx structure (after plan 04-03 refactor): pipeline-grid `.map` produces `<article key={project.slug} className="flex flex-col gap-4 bg-bg-surface">` at lines ~91-111. This plan adds the hover class string to that className.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Apply hover triple-effect to FlagshipCard <article></name>
  <read_first>
    - src/components/sections/projects/FlagshipCard.tsx (full file — find the `<article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">`)
    - src/components/sections/zhk/ZhkGallery.tsx (reference pattern — same hover class string already on the gallery `<button>`)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-30, D-31, D-32, D-33, D-35)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §F (hover triple-effect class string)
  </read_first>
  <files>src/components/sections/projects/FlagshipCard.tsx</files>
  <action>
    Edit `src/components/sections/projects/FlagshipCard.tsx`. Find the outer `<article>` element:

    **Current (after plan 04-03):**
    ```tsx
    <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr]">
    ```

    **Replace with:**
    ```tsx
    <article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```

    NOTES:
    - Single-line className OR multi-line — Tailwind doesn't care, but the verify grep is single-line for `hover:scale-[1.02]` so make sure that token appears on a SINGLE line.
    - DO NOT modify the inner `<ResponsivePicture>` or the inner `<div>` — only the outer `<article>` className.
    - DO NOT change `cursor-pointer` — FlagshipCard already represents Lakeview which IS clickable (external CTA in body opens new tab); the article-level hover doesn't trigger nav, the CTA button does. Keep no cursor-pointer on the article (default cursor is fine).
    - DO update the module-level doc-block to remove the «Phase 4 plan 04-10 (Wave 3, ANI-03) adds hover triple-effect classes to this article. This plan does NOT add hover yet — keeps the diff focused on extraction-only.» paragraph and replace with: «Wave 3 plan 04-10 added the brand hover triple-effect (D-31..D-35) to the outer article — affects home, /projects, /dev/grid simultaneously.» The doc-block must NOT contain literal `'/renders/'` substring (importBoundaries grep — Phase 3 lesson).

    Per D-30 (cross-surface) + D-31 (triple values) + D-32 (transition spec) + D-33 (Tailwind classes) + D-35 (motion-reduce).
  </action>
  <verify>
    <automated>grep -nE "hover:scale-\\[1.02\\]" src/components/sections/projects/FlagshipCard.tsx && grep -nE "hover:shadow-\\[0_0_24px_rgba\\(193,243,61,0.15\\)\\]" src/components/sections/projects/FlagshipCard.tsx && grep -nE "motion-reduce:hover:scale-100" src/components/sections/projects/FlagshipCard.tsx && grep -nE "motion-reduce:hover:shadow-none" src/components/sections/projects/FlagshipCard.tsx && grep -nE "transition-\\[transform,box-shadow,background-color\\]" src/components/sections/projects/FlagshipCard.tsx && grep -nE "ease-\\[cubic-bezier\\(0.22,1,0.36,1\\)\\]" src/components/sections/projects/FlagshipCard.tsx && ! grep -nE "transition-all" src/components/sections/projects/FlagshipCard.tsx && ! grep -nE "spring" src/components/sections/projects/FlagshipCard.tsx && npm run lint</automated>
  </verify>
  <done>
    - FlagshipCard.tsx outer `<article>` className contains all of: `transition-[transform,box-shadow,background-color]`, `duration-200`, `ease-[cubic-bezier(0.22,1,0.36,1)]`, `hover:scale-[1.02]`, `hover:shadow-[0_0_24px_rgba(193,243,61,0.15)]`, `motion-reduce:hover:scale-100`, `motion-reduce:hover:shadow-none`.
    - Zero `transition-all` or `spring` keywords.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Apply hover triple-effect to PipelineCard inner <article></name>
  <read_first>
    - src/components/sections/projects/PipelineCard.tsx (full file — note the structure: outer is link-or-div, inner is `<article className="flex flex-col gap-4 bg-bg-surface">`)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-30, D-31, D-32, D-33, D-34, D-35)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §F (class string)
  </read_first>
  <files>src/components/sections/projects/PipelineCard.tsx</files>
  <action>
    Edit `src/components/sections/projects/PipelineCard.tsx`. Find the inner `<article>` element (defined as a JSX const named `inner` in the function body per plan 04-05 Task 1):

    **Current (after plan 04-05):**
    ```tsx
    const inner = (
      <article className="flex flex-col gap-4 bg-bg-surface">
        ...
      </article>
    );
    ```

    **Replace the article opening tag with:**
    ```tsx
    <article className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```

    NOTES:
    - The hover applies to the article (the visual surface) regardless of whether the outer wrapper is `<a>` or `<div>`.
    - For clickable cards (full-internal): outer `<a href="#/zhk/{slug}">` doesn't need hover styling — the inner article glows.
    - For non-clickable cards (grid-only — Maietok / NTEREST): outer `<div className="cursor-default">` keeps cursor as default (D-34); the inner article still glows. «Cards feel alive but not clickable».
    - Update module-level doc-block: replace the «Phase 4 plan 04-10 (Wave 3, ANI-03) adds hover triple-effect classes. This plan ships static-only.» paragraph with: «Wave 3 plan 04-10 added the brand hover triple-effect (D-31..D-35) to the inner article. Outer wrapper retains its anchor-or-div shape (D-34: clickable vs non-clickable cursor semantics).»
    - Doc-block must NOT contain `'/renders/'` literal.

    Per D-30, D-31, D-32, D-33, D-34, D-35.
  </action>
  <verify>
    <automated>grep -nE "hover:scale-\\[1.02\\]" src/components/sections/projects/PipelineCard.tsx && grep -nE "hover:shadow-\\[0_0_24px_rgba\\(193,243,61,0.15\\)\\]" src/components/sections/projects/PipelineCard.tsx && grep -nE "motion-reduce:hover:scale-100" src/components/sections/projects/PipelineCard.tsx && grep -nE "motion-reduce:hover:shadow-none" src/components/sections/projects/PipelineCard.tsx && grep -nE "cursor-default" src/components/sections/projects/PipelineCard.tsx && ! grep -nE "transition-all" src/components/sections/projects/PipelineCard.tsx && ! grep -nE "spring" src/components/sections/projects/PipelineCard.tsx && npm run lint</automated>
  </verify>
  <done>
    - PipelineCard.tsx inner `<article>` className contains the full hover spec.
    - `cursor-default` still present on the outer non-clickable wrapper (D-34 not regressed).
    - Zero `transition-all` or `spring`.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Retroactively apply hover triple-effect to home PortfolioOverview inline pipeline grid <article></name>
  <read_first>
    - src/components/sections/home/PortfolioOverview.tsx (full file — note that lines ~91-111 still hold an inline `.map` over pipelineGridProjects rendering `<article key={project.slug} className="flex flex-col gap-4 bg-bg-surface">`; plan 04-03 KEPT this inline)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-30 — explicit retroactive sweep)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Recommended File Structure final note
  </read_first>
  <files>src/components/sections/home/PortfolioOverview.tsx</files>
  <action>
    Edit `src/components/sections/home/PortfolioOverview.tsx`. Find the inline pipeline grid `.map` (after plan 04-03 refactor, this stays inline; only flagship + aggregate were extracted).

    **Current (post-plan-04-03):**
    ```tsx
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {pipelineGridProjects.map((project) => (
        <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface">
          <ResponsivePicture ... />
          <div ...>...</div>
        </article>
      ))}
    </div>
    ```

    **Replace the article opening tag with:**
    ```tsx
    <article key={project.slug} className="flex flex-col gap-4 bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none">
    ```

    NOTES:
    - This is THE D-30 «retroactive home component touch» — D-30 explicit: «Phase 4 wires both surfaces, retroactively touching the home component».
    - Same class string as PipelineCard (Task 2) — visual parity across home + /projects.
    - Home pipeline cards remain non-clickable in v1 (no link wrapper around the inline article); hover effect is decorative-glow only, no navigation. Future v2 may add `<Link>` wrappers when /zhk/etno-dim full-page is available; the article hover stays correct either way.
    - Update module-level doc-block: the existing comment on line 27-28 says «Static section in Phase 3 — Phase 5 owns scroll reveal + card hover via shared Motion variants; this file ships with no inline keyframe transition objects». Replace with: «Phase 4 plan 04-10 added inline hover triple-effect (Tailwind classes, D-31..D-35) to pipeline cards. Phase 5 may absorb the cubic-bezier into motionVariants.ts.»
    - The pipeline grid (lines ~91-111) is the ONLY surface touched in this file. FlagshipCard / AggregateRow are imports — already hover-enabled by Tasks 1+2 (FlagshipCard) and not-needed (AggregateRow has no card-hover).
  </action>
  <verify>
    <automated>grep -nE "hover:scale-\\[1.02\\]" src/components/sections/home/PortfolioOverview.tsx && grep -nE "motion-reduce:hover:scale-100" src/components/sections/home/PortfolioOverview.tsx && grep -nE "transition-\\[transform,box-shadow,background-color\\]" src/components/sections/home/PortfolioOverview.tsx && ! grep -nE "transition-all" src/components/sections/home/PortfolioOverview.tsx && ! grep -nE "spring" src/components/sections/home/PortfolioOverview.tsx && npm run build</automated>
  </verify>
  <done>
    - PortfolioOverview.tsx inline pipeline grid `<article>` className contains the full hover spec.
    - Zero `transition-all` or `spring` introduced.
    - `npm run build` exits 0 (full chain — including check-brand 4/4 PASS).
    - Manual smoke (`npm run dev` → `/`):
      - Flagship card hover: scale-1.02 + accent glow visible (FlagshipCard task 1).
      - Pipeline card hover: same effect (this task).
      - Aggregate row: NO hover (intentional — it's a text+cube row, not a card).
      - `/projects` page hover: same effect on FlagshipCard + 3 pipeline cards.
      - `/dev/grid` page hover: same effect on synthetic flagship + 8 fixture cards.
    - Reduced-motion smoke (System Settings → Reduce Motion ON, reload page): hover yields no scale, no shadow.
  </done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. **All 3 files edited** — no new files created.

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0.

4. **Brand invariants**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.

5. **Cross-surface hover audit** — verify the class string lands on every required surface:
   ```bash
   grep -rE "hover:scale-\\[1.02\\]" src/components/sections/
   ```
   Should return matches in:
   - `src/components/sections/projects/FlagshipCard.tsx` (Task 1)
   - `src/components/sections/projects/PipelineCard.tsx` (Task 2)
   - `src/components/sections/home/PortfolioOverview.tsx` (Task 3)
   - `src/components/sections/zhk/ZhkGallery.tsx` (already shipped in plan 04-06)
   - `src/components/sections/construction-log/MonthGroup.tsx` (already shipped in plan 04-07)
   - 5 surfaces total — covering all D-30 listed surfaces.

6. **Anti-regression**:
   - `! grep -rE "transition-all" src/components/` — clean
   - `! grep -rE "type:\\s*['\"]spring['\"]" src/` — clean (Pitfall 3 + brand-system §6)

7. **Manual smoke checklist** (`npm run dev`):
   - Hover on `/` → flagship card scale + glow; pipeline cards scale + glow; aggregate row NO hover.
   - Hover on `/#/projects` → flagship + 3 pipeline cards scale + glow.
   - Hover on `/#/dev/grid` → synthetic flagship + 8 grid cards scale + glow.
   - Hover on `/#/zhk/etno-dim` → 8 gallery thumbs scale + glow (already verified plan 04-06).
   - Hover on `/#/construction-log` → photo thumbs scale + glow (already verified plan 04-07).
   - macOS System Settings → Reduce Motion ON → all hover effects suppressed across all 5 surfaces.

8. **Bundle delta**: ~0 KB (only Tailwind class strings added; no new JS imports).
</verification>

<success_criteria>
- ANI-03 closed: subtle scale ≤1.02 + overlay-opacity (via shadow glow proxy) + accent border-glow on all 5 hover surfaces, brand-consistent ease-out, no springs.
- All ROADMAP §Phase 4 Success Criteria #5 (ЖК cards + FlagshipCard show subtle hover-state) end-to-end functional.
- D-30 honored: home PortfolioOverview pipeline grid retroactively touched (the explicit cross-surface mandate).
- D-32: zero `transition-all`, zero springs anywhere in src/components/.
- D-35: motion-reduce variants on every hover surface — Phase 5's full reduced-motion sweep will validate but not regress.
- Phase 4 fully complete: 9 plans done, 9 phase requirements (HUB-01..04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03) closed end-to-end.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-10-SUMMARY.md` documenting:
- 3 file paths edited
- Decision IDs implemented (D-30, D-31, D-32, D-33, D-34, D-35 + ANI-03)
- Any rule-3 doc-block self-consistency fixes (3 doc-blocks updated; pre-screen each against verify grep)
- `npm run lint` and `npm run build` exit codes
- Cross-surface hover audit results (count of `hover:scale-[1.02]` matches across src/components/sections/)
- Manual smoke results: hover behavior on all 5 surfaces + reduced-motion suppression verification
- Bundle delta (expected ~0 KB — Tailwind class strings only)
- Phase 4 closure summary: all 9 phase REQ-IDs (HUB-01..04, ZHK-01, LOG-01, LOG-02, CTC-01, ANI-03) end-to-end functional; ready for Phase 4 verification + UAT
</output>
