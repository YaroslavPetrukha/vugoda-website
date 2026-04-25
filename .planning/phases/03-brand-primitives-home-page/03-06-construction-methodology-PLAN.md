---
phase: 03-brand-primitives-home-page
plan: 6
type: execute
wave: 2
depends_on: ["03-01", "03-02", "03-03"]
files_modified:
  - src/components/sections/home/ConstructionTeaser.tsx
  - src/components/sections/home/MethodologyTeaser.tsx
autonomous: true
requirements: [HOME-04, HOME-05]
requirements_addressed: [HOME-04, HOME-05]

must_haves:
  truths:
    - "ConstructionTeaser renders 3-5 photos from `latestMonth().teaserPhotos` in horizontal scroll-snap container; CTA «Дивитись повний таймлайн» links to /construction-log; arrow buttons scroll via `element.scrollBy({ left: N, behavior: 'smooth' })` (HOME-04, D-22, RESEARCH §E)"
    - "ConstructionTeaser uses native CSS `snap-x snap-mandatory snap-start scroll-smooth overflow-x-auto` — NO swiper/embla/keen-slider (CLAUDE.md What NOT to Use)"
    - "MethodologyTeaser renders exactly 3 blocks from `methodologyBlocks` filtered by indexes [1, 3, 7] — all `needsVerification: false` per Open Question 2 (HOME-05, D-recommendation)"
    - "ConstructionTeaser images use `<ResponsivePicture widths={[640, 960]} loading='lazy'>` per D-22"
    - "MethodologyTeaser respects `needsVerification: true` — renders ⚠ marker with aria-label `methodologyVerificationWarning` from src/content/home.ts if any selected block has the flag (defensive — current selection [1,3,7] has none, but the rendering logic must support it for safety)"
    - "Neither component contains inline Ukrainian methodology/construction body copy (Phase 2 D-20 / Phase 3 D-29) — all from `methodologyBlocks` / `constructionTeaserCta` / `methodologyVerificationWarning` content imports"
  artifacts:
    - path: "src/components/sections/home/ConstructionTeaser.tsx"
      provides: "HOME-04 — horizontal scroll-snap photo strip + CTA"
      exports: ["ConstructionTeaser"]
      min_lines: 60
    - path: "src/components/sections/home/MethodologyTeaser.tsx"
      provides: "HOME-05 — 3 verified methodology blocks"
      exports: ["MethodologyTeaser"]
      min_lines: 35
  key_links:
    - from: "src/components/sections/home/ConstructionTeaser.tsx"
      to: "src/data/construction.ts"
      via: "import { latestMonth } from '../../../data/construction'"
      pattern: "from '\\.\\./\\.\\./\\.\\./data/construction'"
    - from: "src/components/sections/home/ConstructionTeaser.tsx"
      to: "src/components/ui/ResponsivePicture.tsx"
      via: "<ResponsivePicture loading='lazy' widths={[640,960]}>"
      pattern: "widths=\\{\\[640, ?960\\]\\}"
    - from: "src/components/sections/home/ConstructionTeaser.tsx"
      to: "src/content/home.ts"
      via: "import { constructionTeaserCta }"
      pattern: "constructionTeaserCta"
    - from: "src/components/sections/home/MethodologyTeaser.tsx"
      to: "src/content/methodology.ts"
      via: "import { methodologyBlocks }"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/methodology'"
    - from: "src/components/sections/home/MethodologyTeaser.tsx"
      to: "src/content/home.ts"
      via: "import { methodologyVerificationWarning } — defensive ⚠-marker aria-label (Phase 3 D-29)"
      pattern: "methodologyVerificationWarning"
---

<objective>
Ship the two below-fold sections that follow PortfolioOverview — `ConstructionTeaser` (HOME-04, horizontal scroll-snap photo strip with CTA → /construction-log) and `MethodologyTeaser` (HOME-05, 3 §8 blocks with optional ⚠ markers).

Purpose: HOME-04 is the only proof of construction activity (Lakeview is the only buduetsya project in v1). HOME-05 makes the brand's methodology visible without hiding the verification gaps on blocks 2/5/6.

Output:
1. `src/components/sections/home/ConstructionTeaser.tsx` (~80 lines) — native CSS scroll-snap, 3-5 photos, lucide-react ChevronLeft/Right buttons, CTA link
2. `src/components/sections/home/MethodologyTeaser.tsx` (~50 lines) — 3 blocks (indexes 1, 3, 7), defensive ⚠-marker logic for `needsVerification: true`
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@CLAUDE.md

<interfaces>
Phase 2 data: `src/data/construction.ts`

```ts
export const latestMonth = (): ConstructionMonth => constructionLog[0];
```

Currently `latestMonth()` returns the `mar-2026` object:
```ts
{
  key: 'mar-2026',
  label: 'Березень 2026',
  yearMonth: '2026-03',
  teaserPhotos: ['mar-01.jpg', 'mar-05.jpg', 'mar-10.jpg', 'mar-12.jpg', 'mar-15.jpg'],  // 5 filenames
  photos: [...]  // 15 photos
}
```

`ConstructionMonth` type (`src/data/types.ts:71-85`):
```ts
export interface ConstructionMonth {
  key: string;             // 'mar-2026'
  label: string;           // 'Березень 2026'
  yearMonth: string;       // '2026-03'
  teaserPhotos?: string[]; // present only on latestMonth()
  photos: ConstructionPhoto[];
}
```

Phase 2 content: `src/content/methodology.ts` exports `methodologyBlocks: MethodologyBlock[]` (7 entries):
- index 1, 3, 4, 7 → `needsVerification: false`
- index 2, 5, 6 → `needsVerification: true`

`MethodologyBlock` type (`src/data/types.ts:92-98`):
```ts
export interface MethodologyBlock {
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  body: string;
  needsVerification: boolean;
}
```

Wave 1 dep: `src/content/home.ts` (Plan 03-02) — both sections consume:
```ts
export const constructionTeaserCta = 'Дивитись повний таймлайн';
// MethodologyTeaser ⚠-marker aria-label (Phase 3 D-29 / checker Warning 6):
export const methodologyVerificationWarning = 'Потребує верифікації';
```

Wave 2 dep: `src/components/ui/ResponsivePicture.tsx`. Pass `widths={[640, 960]}` for construction-card-sized variants per D-22.

lucide-react `ChevronLeft` / `ChevronRight` are already used in `Footer.tsx` (Phase 1 verified) — installed `lucide-react@^1.11.0` in package.json.

Tailwind v4 native scroll-snap utilities (verified in Tailwind v4 core):
- `snap-x` `snap-mandatory` `snap-start` `scroll-smooth` `overflow-x-auto`
- Arrow buttons use `element.scrollBy({ left: N, behavior: 'smooth' })` via React `ref`
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/components/sections/home/ConstructionTeaser.tsx</name>
  <files>src/components/sections/home/ConstructionTeaser.tsx</files>
  <read_first>
    - src/data/construction.ts (latestMonth helper)
    - src/components/ui/ResponsivePicture.tsx (Wave 2 dep)
    - src/content/home.ts (constructionTeaserCta — and verify the new export list from Plan 03-02 includes methodologyVerificationWarning, etc.)
    - 03-CONTEXT.md "ConstructionTeaser (HOME-04)" subsection (D-22 widths, no swiper, scroll-snap CSS)
    - 03-RESEARCH.md lines 660-755 (verbatim recipe — copy structurally)
    - CLAUDE.md "What NOT to Use" (skip swiper/embla/keen-slider)
    - src/components/layout/Footer.tsx (lucide-react import pattern: `import { Send, MessageCircle, Globe } from 'lucide-react';`)
  </read_first>
  <behavior>
    - Test 1: file exports `ConstructionTeaser` named function
    - Test 2: imports `useRef` from `'react'`
    - Test 3: imports `Link` from `'react-router-dom'`
    - Test 4: imports `ChevronLeft`, `ChevronRight` from `'lucide-react'`
    - Test 5: imports `latestMonth` from `'../../../data/construction'`
    - Test 6: imports `ResponsivePicture` from `'../../ui/ResponsivePicture'`
    - Test 7: imports `constructionTeaserCta` from `'../../../content/home'`
    - Test 8: uses `useRef<HTMLDivElement>(null)` for the scroller
    - Test 9: maps over `teaserPhotos = month.teaserPhotos ?? []` (defensive nullish-coalesce)
    - Test 10: `<ResponsivePicture src={`construction/${month.key}/${file}`} widths={[640, 960]} loading="lazy" sizes="320px">` per D-22
    - Test 11: scroller div has Tailwind classes `flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4`
    - Test 12: each photo card has `snap-start` class + fixed dimensions `h-[200px] w-[320px] flex-shrink-0`
    - Test 13: arrow buttons call `scroller.current?.scrollBy({ left: STEP * dir, behavior: 'smooth' })` where STEP is a constant (e.g. 336 = 320 card + 16 gap)
    - Test 14: arrow buttons have `aria-label` for accessibility
    - Test 15: CTA `<Link to="/construction-log">{constructionTeaserCta}</Link>`
    - Test 16: NO `import .* from 'swiper'` / `'embla-carousel'` / `'keen-slider'`
    - Test 17: NO `transition={{}}` literal
  </behavior>
  <action>
    CREATE file `src/components/sections/home/ConstructionTeaser.tsx`:

    ```
    /**
     * @module components/sections/home/ConstructionTeaser
     *
     * HOME-04 — 3-5 photos from latestMonth().teaserPhotos in a horizontal
     * scroll-snap strip + CTA → /construction-log.
     *
     * Uses native CSS scroll-snap (snap-x snap-mandatory + overflow-x-auto)
     * per CLAUDE.md «What NOT to Use» — no swiper/embla/keen-slider for a
     * 3-5-item teaser. Arrow buttons fire scrollBy() programmatic scrolling
     * for mouse-affordance; the scroller is keyboard-scrollable natively.
     *
     * Reads from data/construction (latestMonth helper) and content/home
     * (CTA label). Photos go through ResponsivePicture with widths [640, 960]
     * per Phase 3 D-22 (smaller card sizes than flagship's [640,1280,1920]).
     *
     * NO inline transition={{}} — Phase 5 owns motion config.
     */

    import { useRef } from 'react';
    import { Link } from 'react-router-dom';
    import { ChevronLeft, ChevronRight } from 'lucide-react';
    import { latestMonth } from '../../../data/construction';
    import { ResponsivePicture } from '../../ui/ResponsivePicture';
    import { constructionTeaserCta } from '../../../content/home';

    /** Card width 320px + gap 16px = scroll step 336px. */
    const SCROLL_STEP = 336;

    export function ConstructionTeaser() {
      const scroller = useRef<HTMLDivElement>(null);
      const month = latestMonth();
      const photos = month.teaserPhotos ?? [];

      const scrollByDir = (dir: 1 | -1) => {
        scroller.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: 'smooth' });
      };

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-bold text-3xl text-text">Хід будівництва Lakeview</h2>
              <span className="text-sm text-text-muted">{month.label}</span>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Прокрутити назад"
                onClick={() => scrollByDir(-1)}
                className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>

              <div
                ref={scroller}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
              >
                {photos.map((file) => (
                  <div
                    key={file}
                    className="relative h-[200px] w-[320px] flex-shrink-0 snap-start overflow-hidden bg-bg-surface"
                  >
                    <ResponsivePicture
                      src={`construction/${month.key}/${file}`}
                      alt={`Будівельний майданчик, ${month.label.toLowerCase()}`}
                      widths={[640, 960]}
                      sizes="320px"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                aria-label="Прокрутити вперед"
                onClick={() => scrollByDir(1)}
                className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-surface p-2 text-text hover:bg-bg-black"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </div>

            <Link
              to="/construction-log"
              className="mt-6 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              {constructionTeaserCta} →
            </Link>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - The h2 "Хід будівництва Lakeview" is a short brand-section heading — not 40+-char Ukrainian copy that D-29 forbids. Permissible inline.
    - Alt text uses Phase 2's UA-default pattern «Будівельний майданчик, {month-label-lowercase}»; the same pattern Phase 2's `data/construction.ts` photos[].alt uses.
    - `snap-mandatory` ensures the strip locks each card into the viewport edge after scroll-end — desktop-conventional carousel feel.
    - The `{constructionTeaserCta} →` is a microcopy link with an inline ASCII arrow — short literal, matches Phase 2 D-20 microcopy exception.
    - The `construction/${month.key}/${file}` template path passes through `<ResponsivePicture>` which uses `assetUrl` internally; no leading slash on the literal portion → `check-brand importBoundaries` passes (the boundary regex requires a leading `/` to flag).
  </action>
  <verify>
    <automated>test -f src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "from '../../../data/construction'" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "latestMonth\(\)" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "teaserPhotos" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE 'to="/construction-log"' src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "snap-x snap-mandatory" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "scrollBy" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; grep -cE "widths=\{\[640, ?960\]\}" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; ! grep -nE "from 'swiper|from 'embla|from 'keen-slider" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/ConstructionTeaser.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    ConstructionTeaser.tsx exists, uses native CSS scroll-snap (no swiper/embla), arrow buttons call scrollBy with smooth behavior, photos render via ResponsivePicture widths=[640,960] lazy, CTA Link → /construction-log. `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/components/sections/home/MethodologyTeaser.tsx</name>
  <files>src/components/sections/home/MethodologyTeaser.tsx</files>
  <read_first>
    - src/content/methodology.ts (methodologyBlocks: 7 entries with `needsVerification` field)
    - src/content/home.ts (methodologyVerificationWarning export from Plan 03-02 — Phase 3 D-29 / checker Warning 6)
    - src/data/types.ts (MethodologyBlock shape)
    - 03-CONTEXT.md "MethodologyTeaser (HOME-05)" subsection (recommendation: blocks 1+3+4 OR 1+3+7 — all verified)
    - 03-RESEARCH.md lines 1342 (Open Question 2 — recommendation: indexes [1, 3, 7] for soft inter-section flow)
    - 03-RESEARCH.md lines 1110-1117 (consumer recipe with `[1, 3, 7].includes(b.index)` filter)
    - 03-CONTEXT.md D-29 (no inline Ukrainian methodology copy, including aria-labels)
  </read_first>
  <behavior>
    - Test 1: file exports `MethodologyTeaser` named function
    - Test 2: imports `methodologyBlocks` from `'../../../content/methodology'`
    - Test 3: imports `methodologyVerificationWarning` from `'../../../content/home'` (Phase 3 D-29 / checker Warning 6)
    - Test 4: filters `methodologyBlocks` to indexes `[1, 3, 7]` (3 blocks, all `needsVerification: false`)
    - Test 5: renders one card per filtered block; key `={block.index}`
    - Test 6: each card displays `block.title` + `block.body`
    - Test 7: card title is wrapped in a defensive ⚠-marker conditional — `{block.needsVerification && <span aria-label={methodologyVerificationWarning}>⚠</span>}` rendered before/after title (defensive even though current selection has no flagged blocks; future-proofs swap to indexes 4 + 5)
    - Test 8: file does NOT contain inline methodology body literals («Чесно маркуємо», «Поєднуємо ролі», «Проектуємо середовище» — all from imports per D-29)
    - Test 9: file does NOT contain inline string literal `"Потребує верифікації"` — comes from the `methodologyVerificationWarning` import (Phase 3 D-29 / checker Warning 6)
    - Test 10: NO `transition={{}}`
    - Test 11: section uses `max-w-7xl px-6` container (D-24)
    - Test 12: uses Tailwind grid `grid grid-cols-1 lg:grid-cols-3 gap-8` for 3-block layout at desktop
  </behavior>
  <action>
    CREATE file `src/components/sections/home/MethodologyTeaser.tsx`:

    ```
    /**
     * @module components/sections/home/MethodologyTeaser
     *
     * HOME-05 — 2-3 blocks from §8 methodology.
     *
     * Selection per Phase 3 RESEARCH Open Question 2 recommendation:
     * indexes [1, 3, 7] — all needsVerification: false. This avoids
     * foregrounding unverified blocks on the home page (CONCEPT §11.5).
     *
     * Defensive ⚠-marker: if any selected block has needsVerification: true
     * (future swap to e.g. [4, 5, 7]), the title gets a ⚠ marker (Phase 2 D-16)
     * — never silently ship unverified content as fact. The aria-label string
     * lives in src/content/home.ts (Phase 3 D-29 / checker Warning 6).
     *
     * Reads methodologyBlocks from src/content/methodology.ts. NO inline
     * Ukrainian copy (Phase 2 D-20 / Phase 3 D-29) — including aria-labels.
     */

    import { methodologyBlocks } from '../../../content/methodology';
    import { methodologyVerificationWarning } from '../../../content/home';

    /** Block indexes to feature on home — all currently needsVerification: false. */
    const FEATURED_INDEXES = [1, 3, 7] as const;

    export function MethodologyTeaser() {
      const featured = methodologyBlocks.filter((b) =>
        FEATURED_INDEXES.includes(b.index as 1 | 3 | 7),
      );

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 font-bold text-3xl text-text">Як ми будуємо</h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {featured.map((block) => (
                <article key={block.index} className="flex flex-col gap-4">
                  <span className="font-medium text-sm text-text-muted">
                    {String(block.index).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-xl text-text">
                    {block.needsVerification && (
                      <span
                        aria-label={methodologyVerificationWarning}
                        className="mr-2 text-accent"
                      >
                        ⚠
                      </span>
                    )}
                    {block.title}
                  </h3>
                  <p className="text-base leading-relaxed text-text-muted">
                    {block.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - The h2 "Як ми будуємо" is a short section heading derived from CONCEPT §8 — short Cyrillic literal, allowed inline.
    - The aria-label `methodologyVerificationWarning` import resolves to «Потребує верифікації» from `src/content/home.ts` (Phase 3 D-29 boundary; addresses checker Warning 6 — the previous inline literal is moved to the content layer).
    - The numbered prefix uses `block.index` directly (1, 3, 7 — not consecutive 1, 2, 3) — this preserves the §8 source structure visibly. Not a 01/02/03 sequence intentionally.
    - The featured filter uses `as const` typing on the array so TS narrows the literal-union; the `.includes` check casts the field for compile-time exhaustion check.
    - `text-text-muted` body uses `text-base` (16px ≥ 14pt) — passes the AA contrast threshold (brand-system §3).
  </action>
  <verify>
    <automated>test -f src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "from '../../../content/methodology'" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "from '../../../content/home'" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "methodologyVerificationWarning" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "methodologyBlocks" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "needsVerification" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; grep -cE "\[1, ?3, ?7\]" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; ! grep -nE "Чесно маркуємо|Поєднуємо ролі|Проектуємо середовище" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; ! grep -nE "\"Потребує верифікації\"|'Потребує верифікації'" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/MethodologyTeaser.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    MethodologyTeaser.tsx exists, imports methodologyBlocks + methodologyVerificationWarning, filters to indexes [1, 3, 7], renders 3 cards with defensive ⚠-marker logic. No inline body literals. No inline `Потребує верифікації` literal — all aria-label copy comes from `src/content/home.ts`. `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0
2. `npm run build` exits 0; check-brand 4/4 PASS
3. Manual visual QA at `npm run dev`:
   - ConstructionTeaser displays 5 photos in horizontal scroll-snap, drag works, arrow buttons scroll one card per click
   - Photos load lazy (Network tab confirms — they're below fold so lazy is correct, NOT eager)
   - MethodologyTeaser shows 3 blocks (1, 3, 7) — confirm none renders the ⚠ marker (current selection is verified-only)
4. `tsx scripts/check-brand.ts` PASS — both files clean
</verification>

<success_criteria>
- [ ] `ConstructionTeaser.tsx` exists, uses native scroll-snap (snap-x snap-mandatory) — no swiper/embla
- [ ] Photos use `<ResponsivePicture widths={[640, 960]} loading="lazy">`
- [ ] Arrow buttons fire `scrollBy({ left: ±336, behavior: 'smooth' })`
- [ ] Arrow buttons have `aria-label`
- [ ] CTA `<Link to="/construction-log">{constructionTeaserCta}</Link>`
- [ ] `MethodologyTeaser.tsx` filters `methodologyBlocks` to `[1, 3, 7]` and renders 3 cards
- [ ] Defensive ⚠-marker conditional renders only when `needsVerification: true`, with `aria-label={methodologyVerificationWarning}` (no inline Ukrainian literal — closes checker Warning 6)
- [ ] Neither file contains inline Ukrainian methodology/construction body literals
- [ ] No `transition={{` in either file
- [ ] `npm run build` exits 0; check-brand 4/4 PASS
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-06-SUMMARY.md` documenting:
- ConstructionTeaser + MethodologyTeaser shipped
- HOME-04 closed (5 photos from teaserPhotos, scroll-snap working)
- HOME-05 closed (3 verified blocks, defensive ⚠-marker logic ready for future swaps; aria-label sourced from content/home.ts per D-29)
- check-brand result; any deviations
- Wave 3 progress: 4/7 home sections shipped (Hero, BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser); TrustBlock + ContactForm pending in Plan 03-07
</output>
</output>
