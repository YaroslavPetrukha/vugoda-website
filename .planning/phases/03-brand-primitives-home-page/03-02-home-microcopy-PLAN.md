---
phase: 03-brand-primitives-home-page
plan: 2
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/home.ts
autonomous: true
requirements: [HOME-01]
requirements_addressed: [HOME-01]

must_haves:
  truths:
    - "Hero gasло text «Системний девелопмент, у якому цінність є результатом точних рішень.» exists as named export `heroSlogan` from `src/content/home.ts` (D-06, D-29)"
    - "All home-page CTA labels and section headings live in `src/content/home.ts` so Phase 3 components import by name (Phase 2 D-20 content boundary)"
    - "Module follows Phase 2 IMPORT BOUNDARY pattern (no React, no motion, no components, no hooks)"
    - "Module exports MethodologyTeaser ⚠ aria-label, TrustBlock license/contact captions, and ContactForm heading/body so downstream sections (03-06, 03-07) import by name (Phase 3 D-29 content boundary, addresses checker Warnings 6-9)"
  artifacts:
    - path: "src/content/home.ts"
      provides: "Home-specific microcopy strings — gasло, CTA labels, section headings, subtitle, captions, aria-labels"
      exports: [
        "heroSlogan",
        "heroCta",
        "portfolioHeading",
        "portfolioSubtitle",
        "flagshipExternalCta",
        "constructionTeaserCta",
        "contactCta",
        "methodologyVerificationWarning",
        "licenseScopeNote",
        "contactNote",
        "contactHeading",
        "contactBody"
      ]
  key_links:
    - from: "src/content/home.ts"
      to: "(none — leaf content module)"
      via: "no imports — pure string literals only"
      pattern: "^export const \\w+ ="
---

<objective>
Create `src/content/home.ts` — the home-page-specific microcopy module mandated by Phase 3 D-29 (no Ukrainian JSX literal paragraphs in components). All hero copy, section headings, CTA labels, captions, and aria-labels live here so Phase 3 home sections (Wave 3) can import by name.

Purpose: HOME-01's hero gasло «Системний девелопмент, у якому цінність є результатом точних рішень.» is currently NOT in any `src/content/*.ts` module (verified by grep at research time). It MUST be in a content module before Hero.tsx is authored — Wave 3 dependency. Additionally, MethodologyTeaser ⚠-marker aria-label, TrustBlock license/contact captions, and ContactForm heading/body must live here so Plans 03-06 and 03-07 can import them (Phase 3 D-29 boundary; addresses checker Warnings 6-9).

Output: 1 new TS file ~50 lines, 12 named exports, zero imports. Pure string-literal leaf module per Phase 2 D-20 / D-29 boundary rule.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md
@.planning/phases/03-brand-primitives-home-page/03-RESEARCH.md
@КОНЦЕПЦІЯ-САЙТУ.md

<interfaces>
<!-- Existing content modules — pattern to mirror -->

`src/content/values.ts:1-32` (the doc-block + IMPORT BOUNDARY rule pattern):
```ts
/**
 * @module content/values
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 * ...
 */
import type { BrandValue } from '../data/types';

export const brandValues: BrandValue[] = [...];
```

`src/content/placeholders.ts` — leaf content module pattern (zero imports):
```ts
export const phone = '—';
export const address = '—';
export const pipeline4Title = 'Без назви';
```

Phase 2 `scripts/check-brand.ts` enforces:
- `content must not import react/motion/components/hooks/pages` — `home.ts` has zero imports, passes by construction
- `paletteWhitelist` (no hex literals — `home.ts` is pure copy)
- `denylistTerms` (Pictorial/Rubikon — none present)

Authoritative source for hero gasло (verbatim, do NOT paraphrase):
- `КОНЦЕПЦІЯ-САЙТУ.md` §2 → «Системний девелопмент, у якому цінність є результатом точних рішень.»
- Mirrored in `.planning/PROJECT.md` Core Value
- Mirrored in `brand-system.md` §1

Authoritative CTA labels per CONTEXT D-decisions:
- D-05 hero CTA → «Переглянути проекти»
- D-13 PortfolioOverview heading → «Проєкти» (matches Nav label)
- D-13 PortfolioOverview subtitle → «1 в активній фазі будівництва · 4 у pipeline · 0 здано»
- D-14 flagship external CTA → «Перейти на сайт проекту ↗»
- HOME-04 / 03-RESEARCH §E ConstructionTeaser CTA → «Дивитись повний таймлайн»
- HOME-07 / D-29 ContactForm CTA → «Ініціювати діалог»

Additional copy moved here per checker Warnings 6-9 (D-29 content boundary):
- MethodologyTeaser ⚠-marker aria-label → «Потребує верифікації»
- TrustBlock license-scope caption → «на провадження господарської діяльності з будівництва»
- TrustBlock contact caption → «Звернення з усіх питань — на цю адресу»
- ContactForm heading → «Поговоримо про ваш об'єкт» (use U+2019 right single quote)
- ContactForm body → «Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.» (use U+2019)
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/content/home.ts microcopy module</name>
  <files>src/content/home.ts</files>
  <read_first>
    - src/content/values.ts (1-32) — doc-block + IMPORT BOUNDARY pattern to mirror
    - src/content/placeholders.ts — zero-imports leaf-module pattern
    - 03-CONTEXT.md D-06 (gasло verbatim), D-13 (PortfolioOverview heading + subtitle), D-29 (content boundary)
    - 03-RESEARCH.md lines 947–998 (recommended `home.ts` shape — copy the named exports verbatim; this plan adds 5 more for Warnings 6-9)
    - КОНЦЕПЦІЯ-САЙТУ.md §2 (gasло source — verify Cyrillic + apostrophe character rendering)
  </read_first>
  <behavior>
    - Test 1: module is a leaf — zero `import` statements
    - Test 2: exports `heroSlogan` of type `string` literal — verbatim text «Системний девелопмент, у якому цінність є результатом точних рішень.»
    - Test 3: exports `heroCta` = «Переглянути проекти»
    - Test 4: exports `portfolioHeading` = «Проєкти»
    - Test 5: exports `portfolioSubtitle` = «1 в активній фазі будівництва · 4 у pipeline · 0 здано»
    - Test 6: exports `flagshipExternalCta` = «Перейти на сайт проекту ↗»
    - Test 7: exports `constructionTeaserCta` = «Дивитись повний таймлайн»
    - Test 8: exports `contactCta` = «Ініціювати діалог»
    - Test 9: exports `methodologyVerificationWarning` = «Потребує верифікації» (MethodologyTeaser ⚠-marker aria-label)
    - Test 10: exports `licenseScopeNote` = «на провадження господарської діяльності з будівництва» (TrustBlock col 2 caption)
    - Test 11: exports `contactNote` = «Звернення з усіх питань — на цю адресу» (TrustBlock col 3 caption)
    - Test 12: exports `contactHeading` = «Поговоримо про ваш об'єкт» (ContactForm h2 — apostrophe MUST be U+2019)
    - Test 13: exports `contactBody` = «Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.» (ContactForm body — apostrophe MUST be U+2019)
    - Test 14: doc-block contains the literal phrase `IMPORT BOUNDARY` (mirror Phase 2 pattern)
    - Test 15: file does NOT contain the words «Pictorial», «Rubikon», «Пикторіал», «Рубікон» (denylist guard)
    - Test 16: file does NOT contain forbidden brandbook lexicon literals (the words «мрія», «найкращий», «унікальний», «преміальний» MUST be absent — `КОНЦЕПЦІЯ-САЙТУ.md` §2)
    - Test 17: file does NOT contain `{{` or `TODO` (placeholder leak guard)
  </behavior>
  <action>
    CREATE file `src/content/home.ts` with verbatim content:

    ```ts
    /**
     * @module content/home
     * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
     *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
     *   components, hooks, or pages.
     *
     *   Source of truth:
     *     - heroSlogan: КОНЦЕПЦІЯ-САЙТУ.md §2 (verbatim, Phase 3 D-06)
     *     - portfolioSubtitle: PROJECT.md Core Value language (0/1/4 honesty, D-13)
     *     - CTA labels: Phase 3 CONTEXT D-05 / D-13 / D-14 / D-29 + RESEARCH.md §J
     *     - methodologyVerificationWarning / licenseScopeNote / contactNote
     *       / contactHeading / contactBody: moved from inline JSX literals
     *       per Phase 3 D-29 + plan checker Warnings 6-9.
     *
     *   Tone: стримано, предметно, без маркетингових суперлативів
     *   (forbidden lexicon: «мрія», «найкращий», «унікальний», «преміальний»).
     *   Adding new microcopy here = preferred over inline JSX literals
     *   (Phase 2 D-20 / Phase 3 D-29).
     */

    /** Hero gasло — verbatim from КОНЦЕПЦІЯ-САЙТУ.md §2 + brand-system.md §1.
     *  Keep typographic apostrophe (U+2019) and end punctuation. */
    export const heroSlogan =
      'Системний девелопмент, у якому цінність є результатом точних рішень.';

    /** Hero CTA label — navigates to /projects (Phase 3 D-05). */
    export const heroCta = 'Переглянути проекти';

    /** PortfolioOverview section heading — matches Nav label «Проєкти» (D-13). */
    export const portfolioHeading = 'Проєкти';

    /** PortfolioOverview muted subtitle — honest 0/1/4 count (D-13). */
    export const portfolioSubtitle =
      '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

    /** Flagship card external CTA — opens Lakeview site in new tab (D-14). */
    export const flagshipExternalCta = 'Перейти на сайт проекту ↗';

    /** ConstructionTeaser CTA — navigates to /construction-log (HOME-04). */
    export const constructionTeaserCta = 'Дивитись повний таймлайн';

    /** ContactForm primary CTA — opens mailto: (HOME-07 / D-29). */
    export const contactCta = 'Ініціювати діалог';

    /** MethodologyTeaser defensive ⚠-marker aria-label — used when a featured
     *  block has needsVerification: true (Phase 3 D-29 / checker Warning 6). */
    export const methodologyVerificationWarning = 'Потребує верифікації';

    /** TrustBlock col 2 — license-scope caption under «від {date} (безстрокова)»
     *  (Phase 3 D-29 / checker Warning 7). */
    export const licenseScopeNote =
      'на провадження господарської діяльності з будівництва';

    /** TrustBlock col 3 — contact-channel caption under email anchor
     *  (Phase 3 D-29 / checker Warning 7). */
    export const contactNote = 'Звернення з усіх питань — на цю адресу';

    /** ContactForm h2 — section heading on bg-bg-black closer
     *  (Phase 3 D-29 / checker Warning 8). Apostrophe is U+2019 right single quote. */
    export const contactHeading = 'Поговоримо про ваш об’єкт';

    /** ContactForm body — short invitational paragraph above the mailto button
     *  (Phase 3 D-29 / checker Warning 8). Apostrophe is U+2019 right single quote. */
    export const contactBody =
      'Напишіть нам — обговоримо запит, опції, графік. Без зобов’язань.';
    ```

    Implementation requirements:
    - File MUST have zero `import` statements (leaf content module).
    - The hero gasло MUST be byte-exact: copy from КОНЦЕПЦІЯ-САЙТУ.md §2 — apostrophe is U+2019, em-dashes are not used here.
    - The «Перейти на сайт проекту ↗» literal includes the U+2197 «NORTH EAST ARROW» symbol — not an ASCII `^` or `→`.
    - The «·» middle-dot in `portfolioSubtitle` is U+00B7.
    - `contactHeading` and `contactBody` MUST use U+2019 RIGHT SINGLE QUOTATION MARK (’) — NOT the ASCII apostrophe (U+0027). Verify via `grep -c "об’єкт" src/content/home.ts` returning 1.
  </action>
  <verify>
    <automated>test -f src/content/home.ts &amp;&amp; grep -nE "^export const heroSlogan = " src/content/home.ts &amp;&amp; grep -nE "Системний девелопмент" src/content/home.ts &amp;&amp; [ "$(grep -cE '^export const (heroSlogan|heroCta|portfolioHeading|portfolioSubtitle|flagshipExternalCta|constructionTeaserCta|contactCta|methodologyVerificationWarning|licenseScopeNote|contactNote|contactHeading|contactBody) = ' src/content/home.ts)" = "12" ] &amp;&amp; ! grep -nE "^import " src/content/home.ts &amp;&amp; ! grep -nE "мрія|найкращий|унікальний|преміальний" src/content/home.ts &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    File exists with 12 named exports (`heroSlogan`, `heroCta`, `portfolioHeading`, `portfolioSubtitle`, `flagshipExternalCta`, `constructionTeaserCta`, `contactCta`, `methodologyVerificationWarning`, `licenseScopeNote`, `contactNote`, `contactHeading`, `contactBody`), zero imports, gasло byte-matches КОНЦЕПЦІЯ-САЙТУ.md §2, contactHeading/contactBody use U+2019. `npm run lint` exits 0. `tsx scripts/check-brand.ts importBoundaries` PASS («content must not import react/motion/components/hooks/pages»). `tsx scripts/check-brand.ts denylistTerms` PASS (no Pictorial/Rubikon).
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0 (TS file is well-formed)
2. `tsx scripts/check-brand.ts` exits 0 — all 4 invariants pass (especially `importBoundaries` `content must not import react/motion/components/hooks/pages`)
3. Manual byte-check (optional): `grep -c "Системний девелопмент, у якому цінність є результатом точних рішень" src/content/home.ts` returns `1`
4. Export-count check: `grep -cE "^export const (heroSlogan|heroCta|portfolioHeading|portfolioSubtitle|flagshipExternalCta|constructionTeaserCta|contactCta|methodologyVerificationWarning|licenseScopeNote|contactNote|contactHeading|contactBody) = " src/content/home.ts` returns `12`
</verification>

<success_criteria>
- [ ] `src/content/home.ts` exists, ~50 lines
- [ ] 12 named exports: `heroSlogan`, `heroCta`, `portfolioHeading`, `portfolioSubtitle`, `flagshipExternalCta`, `constructionTeaserCta`, `contactCta`, `methodologyVerificationWarning`, `licenseScopeNote`, `contactNote`, `contactHeading`, `contactBody`
- [ ] Zero `import` statements
- [ ] `heroSlogan` value is verbatim «Системний девелопмент, у якому цінність є результатом точних рішень.»
- [ ] `contactHeading` and `contactBody` use U+2019 typographic apostrophe (’) — not ASCII '
- [ ] No forbidden lexicon literals («мрія», «найкращий», «унікальний», «преміальний»)
- [ ] No Pictorial/Rubikon literals (denylist invariant intact)
- [ ] `npm run lint` exits 0
- [ ] `tsx scripts/check-brand.ts` exits 0
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-02-SUMMARY.md` documenting:
- 1 new content module added (`src/content/home.ts`) with 12 named exports
- HOME-01 partially closed (hero gasло now in content layer; Hero.tsx in Wave 3 will consume)
- Phase 2 IMPORT BOUNDARY pattern preserved (zero imports, leaf module)
- Wave 1 unblocks Wave 3 (Hero, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm sections all import from `home.ts`)
</output>
</output>
