---
phase: 04-portfolio-construction-log-contact
plan: 07
type: execute
wave: 2
depends_on: ["04-02", "04-04"]
files_modified:
  - src/components/sections/construction-log/MonthGroup.tsx
  - src/pages/ConstructionLogPage.tsx
autonomous: true
requirements: [LOG-01, LOG-02]
must_haves:
  truths:
    - "/construction-log renders 4 month groups in latest-first order: Березень 2026 / Лютий 2026 / Січень 2026 / Грудень 2025 (D-20)"
    - "Each month section H2 reads «{label} · {photos.length} фото» (D-21)"
    - "Photos render as 3-col grid at ≥lg with explicit width=640 height=800 for 4:5 portrait CLS-safety (D-22 + RESEARCH §Q11)"
    - "All photos use loading='lazy'; only ~6-9 thumbnails load eagerly per LOG-01 <2MB initial budget (D-24)"
    - "Click any photo → shared <Lightbox> opens with 1920w variant; ←/→ cycles within month bounds (D-23, D-25..D-28)"
    - "Per-month useState<number>(-1) — Lightbox state lives inside MonthGroup (RESEARCH §Pitfall 9)"
    - "<picture> emits AVIF/WebP/JPG via existing <ResponsivePicture> (LOG-02)"
  artifacts:
    - path: "src/components/sections/construction-log/MonthGroup.tsx"
      provides: "Per-month grid + per-month Lightbox state"
      contains: "loading=\"lazy\""
    - path: "src/pages/ConstructionLogPage.tsx"
      provides: "Composed /construction-log page (REPLACES Phase 1 stub)"
      contains: "constructionLog.map"
  key_links:
    - from: "src/components/sections/construction-log/MonthGroup.tsx"
      to: "src/components/ui/Lightbox.tsx"
      via: "import { Lightbox }"
      pattern: "Lightbox"
    - from: "src/pages/ConstructionLogPage.tsx"
      to: "src/data/construction.ts"
      via: "import { constructionLog }"
      pattern: "constructionLog\\.map"
---

<objective>
Compose `/construction-log` — Lakeview construction-log timeline page. Ships LOG-01 + LOG-02. Replaces Phase 1 stub at `src/pages/ConstructionLogPage.tsx`.

Page anatomy (D-20..D-24):
- 4 month sections, latest-first order (already exported sorted from `src/data/construction.ts`)
- Each section: `<h2>` «{label} · {N} фото» + 3-col grid of 4:5 portrait thumbnails
- Click any photo → shared Lightbox opens with 1920w variant, ←/→ cycles within month
- All thumbs `loading="lazy"` per <2MB initial weight budget

Output: 1 new section component (MonthGroup) + 1 page replacement.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/data/construction.ts
@src/data/types.ts
@src/components/ui/ResponsivePicture.tsx
@src/components/ui/Lightbox.tsx
@src/pages/ConstructionLogPage.tsx

<interfaces>
From src/data/construction.ts:
```typescript
export const constructionLog: ConstructionMonth[];  // 4 months, sorted latest-first
export const latestMonth: () => ConstructionMonth;
```

From src/data/types.ts:
```typescript
export interface ConstructionPhoto {
  file: string;       // 'mar-01.jpg' etc.
  caption?: string;   // optional hand-authored stripped-tone
  alt?: string;       // default 'Будівельний майданчик, {month-UA} {year}'
}

export interface ConstructionMonth {
  key: string;        // 'mar-2026' (folder under public/construction/)
  label: string;      // 'Березень 2026'
  yearMonth: string;  // '2026-03'
  teaserPhotos?: string[];  // only on latestMonth() — Phase 3 home consumer
  photos: ConstructionPhoto[];  // 12-15 per month
}
```

From src/components/ui/Lightbox.tsx (Wave 1 plan 04-02):
```typescript
export interface LightboxPhoto { src: string; alt: string; caption?: string; label?: string; }
export function Lightbox(props: { photos, index, onClose, onIndexChange }): JSX.Element;
```

From src/components/ui/ResponsivePicture.tsx — supports `widths`, `sizes`, `loading`, explicit `width` and `height` overrides.

From scripts/optimize-images.mjs (Wave 1 plan 04-04 EDIT):
- After plan 04-04 lands: construction widths = `[640, 960, 1920]`. So `<ResponsivePicture src="construction/{month}/{file}" widths={[640, 960]}>` works for thumbnails (lazy-loaded grid) and `widths={[1920]}` works for the Lightbox open state.

From RESEARCH §Q11 + §Pitfall 4:
- Construction source photos are 1080×1346 (4:5 portrait, verified via `file` command).
- 3-col at ≥lg (1280+) gives clean ~380px wide × 4:5 aspect ≈ 475px tall row.
- ResponsivePicture default height calc is `largestWidth × 9 / 16` — WRONG for 4:5 photos. Must override with explicit width=640 height=800 (4:5 ratio) for CLS safety.

Phase 4 ANI-03 hover (D-30..D-35) on photo thumbnails is APPLIED HERE. The class string verbatim from D-31..D-35 (RESEARCH §H — Pattern H is the per-month MonthGroup with hover wired). This is one of the surfaces in D-30's «Phase 4 wires» list — owned by this plan rather than Wave 3 plan 04-10.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/sections/construction-log/MonthGroup.tsx</name>
  <read_first>
    - src/data/types.ts (ConstructionMonth + ConstructionPhoto interfaces)
    - src/components/ui/Lightbox.tsx (LightboxPhoto + Lightbox props)
    - src/components/ui/ResponsivePicture.tsx (prop signature)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-21, D-22, D-23, D-24)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §H (Per-month MonthGroup with lightbox — verbatim) + §Q11 (3-col 4:5) + §Pitfall 9 (per-group state)
  </read_first>
  <files>src/components/sections/construction-log/MonthGroup.tsx</files>
  <action>
    Create new file `src/components/sections/construction-log/MonthGroup.tsx`:

    ```tsx
    /**
     * @module components/sections/construction-log/MonthGroup
     *
     * LOG-01 + LOG-02 — Single month section of the construction-log timeline
     * (D-20..D-24). H2 with «{label} · {N} фото», 3-col grid of 4:5 portrait
     * thumbnails (D-22 + RESEARCH §Q11), all loading="lazy" per <2MB budget.
     *
     * Per-month useState<number>(-1) for Lightbox index — opening one
     * MonthGroup's lightbox does NOT crash when state from a sibling MonthGroup
     * is stale (Pitfall 9 — per-group state avoids the «index out of bounds»
     * class of bug). Browser top-layer guarantees only one <dialog> open at
     * a time.
     *
     * 4:5 portrait override: ResponsivePicture default height = largestWidth*9/16
     * is wrong for these phone photos. Explicit width=640 height=800 (4:5) is
     * CLS-safe (Pitfall 4 — verified 1080×1346 sources).
     *
     * Hover triple-effect (ANI-03 / D-31..D-35) on the <button> wrapper.
     * Class string verbatim — Wave 3 plan 04-10 sweeps other surfaces;
     * thumbnail hover ships locally here.
     *
     * IMPORT BOUNDARY: forwards `construction/{key}/{file}` template into
     * ResponsivePicture; never embeds quoted slash-prefixed tree-paths.
     */

    import { useState } from 'react';
    import type { ConstructionMonth } from '../../../data/types';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';
    import { Lightbox, type LightboxPhoto } from '../../ui/Lightbox';

    interface Props {
      month: ConstructionMonth;
    }

    export function MonthGroup({ month }: Props) {
      const [index, setIndex] = useState(-1);

      const photos: LightboxPhoto[] = month.photos.map((p) => ({
        src: `construction/${month.key}/${p.file}`,
        alt: p.alt ?? '',
        caption: p.caption,
        label: month.label,
      }));

      return (
        <section className="bg-bg py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-bold text-3xl text-text">
              {month.label} · {month.photos.length} фото
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {month.photos.map((p, i) => (
                <button
                  key={p.file}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Відкрити фото ${i + 1}`}
                  className="block overflow-hidden bg-bg-surface transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(193,243,61,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <ResponsivePicture
                    src={`construction/${month.key}/${p.file}`}
                    alt={p.alt ?? ''}
                    widths={[640, 960]}
                    sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
                    width={640}
                    height={800}
                    loading="lazy"
                    className="w-full h-auto object-cover aspect-[4/5]"
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

    NOTES:
    - The H2 template `{month.label} · {month.photos.length} фото` is JSX expression composition — NOT a Cyrillic literal in source. The «фото» (4 chars) inline is a structural label (D-21).
    - 3-col grid only at `lg` (1280+); 2-col at `sm` (≥640); 1-col below `sm`. The `sm:` breakpoint covers tablets gracefully without explosion (Pitfall 14).
    - Sizes attr `(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw` matches the responsive grid: at lg → 1/3 of 1200px ≈ 380px → browser picks 640w AVIF; at sm → 50vw on a 768px tablet ≈ 384px → 640w AVIF; at <sm → full-width 100vw → 960w AVIF on phones.
    - `aspect-[4/5]` Tailwind arbitrary value compiles to `aspect-ratio: 4 / 5` — verified at RESEARCH §Open Question 7. Combined with explicit `width={640} height={800}` (= 4:5 native) → CLS-safe.
    - Hover class string verbatim from D-31..D-35.
    - The Lightbox sits OUTSIDE the grid `<div>` but inside `<section>` — keeps it scoped to this MonthGroup's state only.
    - `widths={[640, 960]}` on thumbnails — the `1920` from plan 04-04 D-29 is for Lightbox fullscreen, NOT the thumbnail. The thumbnail uses 640/960 only.
    - LightboxPhoto.src format `construction/{key}/{file}` (no leading slash, no quotes-prefix) → check-brand importBoundaries clean.
  </action>
  <verify>
    <automated>grep -nE "export function MonthGroup" src/components/sections/construction-log/MonthGroup.tsx && grep -nE "useState\\(-1\\)" src/components/sections/construction-log/MonthGroup.tsx && grep -nE "Lightbox" src/components/sections/construction-log/MonthGroup.tsx && grep -nE 'loading="lazy"' src/components/sections/construction-log/MonthGroup.tsx && grep -nE 'aspect-\[4/5\]' src/components/sections/construction-log/MonthGroup.tsx && grep -nE 'width=\{640\}' src/components/sections/construction-log/MonthGroup.tsx && grep -nE 'height=\{800\}' src/components/sections/construction-log/MonthGroup.tsx && grep -nE "hover:scale-\\[1.02\\]" src/components/sections/construction-log/MonthGroup.tsx && grep -nE "motion-reduce:hover:scale-100" src/components/sections/construction-log/MonthGroup.tsx && grep -nE "lg:grid-cols-3" src/components/sections/construction-log/MonthGroup.tsx && ! grep -nE "transition-all|spring" src/components/sections/construction-log/MonthGroup.tsx && ! grep -nE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/sections/construction-log/MonthGroup.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at correct path.
    - Per-month `useState(-1)` for Lightbox index (Pitfall 9 fix).
    - Imports + uses `Lightbox` from `../../ui/Lightbox`.
    - All photos have `loading="lazy"` (LOG-01 budget).
    - Explicit `width={640} height={800}` + `aspect-[4/5]` (Pitfall 4 CLS fix).
    - 3-col grid at lg breakpoint.
    - Hover triple-effect class string verbatim (D-31..D-35) including `motion-reduce:` modifiers.
    - Zero `transition-all`, zero `spring`, zero quoted-prefix paths.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Replace src/pages/ConstructionLogPage.tsx body with map of MonthGroups</name>
  <read_first>
    - src/pages/ConstructionLogPage.tsx (current Phase 1 stub — to be REPLACED)
    - src/data/construction.ts (`constructionLog` array, latest-first sorted)
    - src/components/sections/construction-log/MonthGroup.tsx (just created)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-20)
  </read_first>
  <files>src/pages/ConstructionLogPage.tsx</files>
  <action>
    Fully REPLACE `src/pages/ConstructionLogPage.tsx`:

    ```tsx
    /**
     * @module pages/ConstructionLogPage
     *
     * LOG-01 — Lakeview construction-log timeline. Reads constructionLog
     * (already sorted latest-first per Phase 2 D-21) and renders one
     * <MonthGroup> per month. Each MonthGroup owns its own Lightbox state
     * (Pitfall 9 — per-group state).
     *
     * Page header: simple <h1>Хід будівництва Lakeview</h1> at top. Subtitle
     * not needed (CONCEPT §7.9 stripped tone — page label says it all).
     *
     * Default export preserved (App.tsx import unchanged).
     */

    import { constructionLog } from '../data/construction';
    import { MonthGroup } from '../components/sections/construction-log/MonthGroup';

    export default function ConstructionLogPage() {
      return (
        <>
          <section className="bg-bg pt-24 pb-8">
            <div className="mx-auto max-w-7xl px-6">
              <h1 className="font-bold text-6xl text-text">Хід будівництва Lakeview</h1>
            </div>
          </section>
          {constructionLog.map((month) => (
            <MonthGroup key={month.key} month={month} />
          ))}
        </>
      );
    }
    ```

    NOTES:
    - DELETE the existing Phase 1 stub body entirely (centered H1 + Mark img placeholder).
    - The H1 «Хід будівництва Lakeview» (24 chars) inline is a structural page label; mirrors home ConstructionTeaser «Хід будівництва Lakeview» (Phase 3 D-29 short-structural carve-out).
    - Default export name `ConstructionLogPage` retained.
    - Page is a fragment — Layout (Phase 1) provides Nav + Footer wrapping.
    - Pretty short page module — no scroll-restoration logic, no sticky headers (Phase 5 may add `position: sticky` if UX gap appears per D-21).
  </action>
  <verify>
    <automated>grep -nE "export default function ConstructionLogPage" src/pages/ConstructionLogPage.tsx && grep -nE "constructionLog\\.map" src/pages/ConstructionLogPage.tsx && grep -nE "<MonthGroup key=\\{month.key\\} month=\\{month\\}" src/pages/ConstructionLogPage.tsx && grep -nE "Хід будівництва Lakeview" src/pages/ConstructionLogPage.tsx && ! grep -nE "import markUrl" src/pages/ConstructionLogPage.tsx && npm run build</automated>
  </verify>
  <done>
    - `src/pages/ConstructionLogPage.tsx` body fully replaced — Phase 1 stub gone.
    - Page imports `constructionLog` and `MonthGroup`, maps over array.
    - H1 contains literal «Хід будівництва Lakeview».
    - Default export name is `ConstructionLogPage`.
    - `npm run build` exits 0.
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (`npm run dev` → `/#/construction-log`):
      - 4 month headers visible: «Березень 2026 · 15 фото», «Лютий 2026 · 12 фото», «Січень 2026 · 11 фото», «Грудень 2025 · 12 фото» (in this order).
      - 3-col grid at desktop ≥1280px, 2-col at ≥640px, 1-col below.
      - Photos load lazily (DevTools Network panel: only ~6-9 thumbs in initial waterfall).
      - Click any photo → Lightbox opens with 1920w; ←/→ cycles WITHIN that month only; Esc closes; backdrop closes.
      - Body scroll locked while lightbox open; restored on close.
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **Files exist**: `src/components/sections/construction-log/MonthGroup.tsx` (new) + `src/pages/ConstructionLogPage.tsx` (refactored).

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0.

4. **Brand invariants**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.

5. **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Manual smoke checklist (`npm run dev`):
   - `/#/construction-log` → page H1 + 4 month sections in latest-first order
   - Each month: H2 «{label} · {N} фото» format
   - 3-col grid at 1920×1080
   - All 50 thumbs are 4:5 portrait, no CLS
   - Lazy-load: scroll triggers next-row loads ~600-800px before visibility
   - Lightbox opens on click; ←/→ cycles within month bounds; Esc closes
   - Browser DevTools Network panel: initial transfer ≤2MB (LOG-01 budget — verify by counting summed transferred image bytes on initial load before scroll)

6. **Regression checks**:
   - Plan 04-04 D-29 1920w outputs MUST exist before lightbox opens — verify `ls public/construction/mar-2026/_opt/mar-01-1920.{avif,webp,jpg}` shows 3 files.
   - If running this plan BEFORE plan 04-04 lands, the Lightbox would request 1920w variants that don't exist; the `<picture>` falls back to JPG fallbackSrc (`mar-01-1920.jpg`) which would 404. This plan declares `depends_on: ["04-02", "04-04"]` to enforce ordering.

7. **Bundle delta**: expect +5-10 KB gzipped (MonthGroup + slight overhead from ConstructionLogPage refactor).

8. **Page-weight <2MB deferral note (LOG-01 SC#3):**
   > Page-weight <2MB on /construction-log: VERIFIED MANUALLY in Phase 4 phase-gate via DevTools Network panel; FORMAL Lighthouse measurement deferred to Phase 6 QA-02. Phase 4 ships the lazy-loading mechanism (`loading="lazy"` on every below-fold thumbnail) which is the only Phase-4-controllable lever; total bytes depend on optimizer output (Phase 4 D-29) and source photo file sizes (Phase 2-shipped assets). NOT a blocking automated check.

   No Phase 4 task claims to enforce <2MB; this plan ships the lazy mechanism + manual smoke. Phase 6 QA-02 owns the formal Lighthouse audit.
</verification>

<success_criteria>
- LOG-01 closed: 50 photos in 4 month groups, lazy-loaded, native `<dialog>` lightbox via Lightbox primitive (Wave 1 plan 04-02).
- LOG-02 closed: `<picture>` AVIF→WebP→JPG via existing `<ResponsivePicture>`; alt-text default per Phase 2 D-21.
- All ROADMAP §Phase 4 Success Criteria #3 (50-photo timeline + month groups + lazy + lightbox + <2MB initial) end-to-end functional.
- Hover triple-effect (D-31..D-35) applied on construction thumbs in this plan; Wave 3 plan 04-10 sweeps remaining surfaces (FlagshipCard + PipelineCard + home pipeline grid).
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-07-SUMMARY.md` documenting:
- 2 file paths (1 new component + 1 page replacement)
- Decision IDs implemented (D-20..D-24)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta
- Manual smoke results: month-header format, 3-col grid, lazy-load behavior, lightbox cycle bounds within month, body scroll-lock
- Note on LOG-01 <2MB budget: actual measured transfer size on initial /#/construction-log load before scroll. If exceeded, escalate to Phase 6 (encoder retune or smaller thumb width).
</output>
