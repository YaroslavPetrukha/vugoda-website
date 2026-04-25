---
phase: 04-portfolio-construction-log-contact
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/stages.ts
  - src/content/projects.ts
  - src/content/zhk-etno-dim.ts
  - src/content/contact.ts
autonomous: true
requirements: [HUB-01]
must_haves:
  truths:
    - "Stage→label mapping has a single source of truth that all of /projects, /zhk, and /dev/grid consume"
    - "Unknown stage values fall back to em-dash («—»), never crash"
    - "Page H1s, subtitles, empty-state copy, mailto subjects, and contact strings live in src/content/* not inline JSX"
  artifacts:
    - path: "src/lib/stages.ts"
      provides: "STAGES tuple, stageLabel(), isStage() type predicate"
      exports: ["STAGES", "stageLabel", "isStage"]
    - path: "src/content/projects.ts"
      provides: "Projects-page H1, subtitle, empty-state copy, Будується pointer copy"
      exports: ["projectsHeading", "projectsSubtitle", "zdanoEmptyMessage", "buduetsyaPointerMessage"]
    - path: "src/content/zhk-etno-dim.ts"
      provides: "ZHK page CTA labels, mailto subject, redirect-screen text"
      exports: ["mailtoSubject", "mailtoLabel", "instagramLabel", "lakeviewRedirectMessage"]
    - path: "src/content/contact.ts"
      provides: "Contact page subtitle, label microcopy, and mailto subject (M-3)"
      exports: ["contactPageHeading", "contactPageSubtitle", "contactPageCta", "contactMailSubject"]
  key_links:
    - from: "src/lib/stages.ts"
      to: "src/data/types.ts"
      via: "import type { Stage }"
      pattern: "import type \\{ Stage \\} from"
    - from: "src/content/zhk-etno-dim.ts"
      to: "(downstream consumer ZhkCtaPair)"
      via: "encodeURIComponent(mailtoSubject)"
      pattern: "Запит про ЖК Етно Дім"
---

<objective>
Wave 1 foundation: ship the stage-label helper + four content modules that downstream Phase 4 surfaces (StageFilter, PipelineCard, EmptyStateZdano, BuduetsyaPointer, ZhkCtaPair, ContactDetails, ContactPage) consume by name. No JSX, no React imports — pure TS modules.

Purpose: a single source of truth for Stage→Ukrainian-label mapping (D-11) and a clean content boundary (Phase 3 D-29) so no Phase 4 component carries Ukrainian paragraph literals >40 chars.

Output: 4 new files, all imported in Wave 2 plans.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/data/types.ts
@src/content/home.ts
@src/content/placeholders.ts
@src/content/company.ts

<interfaces>
<!-- Types and patterns this plan must conform to. Pulled from existing source. -->

From src/data/types.ts:
```typescript
export type Stage =
  | 'u-rozrakhunku'
  | 'u-pogodzhenni'
  | 'buduetsya'
  | 'zdano';
```

From src/content/home.ts (pattern reference — content module shape):
```typescript
// Each export is a top-level named const string. Module-level JSDoc opens
// with `@module content/home` + `@rule IMPORT BOUNDARY:` block. No types,
// no React, no components.
export const heroSlogan = 'Системний девелопмент, у якому цінність є результатом точних рішень.';
```

From scripts/check-brand.ts importBoundaries() rule for content/:
- `grep -rnE "from ['\"]react['\"]|from ['\"]motion|from ['\"].*components|from ['\"].*hooks|from ['\"].*pages" src/content/`
- Content modules MAY only import from `../data/types` (type-only) or other content modules.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/lib/stages.ts with STAGES tuple, stageLabel(), isStage()</name>
  <read_first>
    - src/data/types.ts (to confirm `Stage` type union; do NOT redefine)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-11, D-42)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q2 (HashRouter useSearchParams compat) and §Pattern 1 (Stage filter implementation pattern)
    - src/content/home.ts (module-level JSDoc + IMPORT BOUNDARY pattern reference)
  </read_first>
  <files>src/lib/stages.ts</files>
  <action>
    Create new file `src/lib/stages.ts` with:

    ```typescript
    /**
     * @module lib/stages
     * @rule IMPORT BOUNDARY: Pure utility module. No React imports, no motion
     *   imports, no component imports. Type-only import from `../data/types`.
     *
     *   Single source of truth for Stage → Ukrainian label mapping (D-11).
     *   Consumers: StageFilter chips, ZhkFactBlock fact rows, PipelineCard
     *   stage badges (Phase 4 /projects, /zhk/etno-dim, /dev/grid).
     *
     *   Unknown-stage fallback returns em-dash «—» (U+2014) per D-11 + D-42 +
     *   Phase 2 D-19 placeholder rule. This makes /dev/grid stress-test
     *   robust against any future cast-through bug — chip renders «—» instead
     *   of throwing or rendering empty string.
     */

    import type { Stage } from '../data/types';

    /** Canonical chip order on /projects per D-03 + CONCEPT §6.1 Model-Б. */
    export const STAGES = ['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano'] as const satisfies readonly Stage[];

    const LABELS: Record<Stage, string> = {
      'u-rozrakhunku': 'У розрахунку',
      'u-pogodzhenni': 'У погодженні',
      'buduetsya':     'Будується',
      'zdano':         'Здано',
    };

    /** Stage → Ukrainian label. Unknown stage returns em-dash per D-11 + D-42. */
    export function stageLabel(stage: Stage | string | undefined): string {
      if (stage && stage in LABELS) return LABELS[stage as Stage];
      return '—';
    }

    /** Type predicate for URL state validation (?stage=...) per D-10 + Pitfall 8. */
    export function isStage(s: string | null | undefined): s is Stage {
      return s != null && (STAGES as readonly string[]).includes(s);
    }
    ```

    NOTES:
    - Use `as const satisfies readonly Stage[]` (TS 4.9+) to keep the literal tuple narrow AND verify all Stage members are present.
    - Em-dash literal is U+2014 (raw character, NOT `&mdash;` HTML entity, NOT `--` ASCII).
    - The 4 LABELS keys MUST exactly match the 4 `Stage` union members; if you typo one, TS will error.
    - Doc-block describes policy WITHOUT containing forbidden literals (no «мрія», no «найкращий» — content-clean).

    Per D-11 + D-42 (decisions locked, do not deviate).
  </action>
  <verify>
    <automated>grep -E "STAGES" src/lib/stages.ts &amp;&amp; grep -E "u-rozrakhunku.*u-pogodzhenni.*buduetsya.*zdano" src/lib/stages.ts &amp;&amp; grep -E "stageLabel|isStage" src/lib/stages.ts &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    - File `src/lib/stages.ts` exists.
    - `grep -nE "export const STAGES" src/lib/stages.ts` returns 1 line.
    - `grep -nE "export function stageLabel" src/lib/stages.ts` returns 1 line.
    - `grep -nE "export function isStage" src/lib/stages.ts` returns 1 line.
    - File contains the 4-tuple `'u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano'` in canonical chip order.
    - File contains the em-dash «—» fallback (U+2014).
    - `npm run lint` exits 0 (`tsc --noEmit` clean).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create src/content/projects.ts (page H1 + subtitle + empty-state copy)</name>
  <read_first>
    - src/content/home.ts (pattern reference for content module shape + JSDoc style + portfolioSubtitle string we may reuse)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-01, D-08, D-09)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 5 + §Q5 chip empty-state
    - scripts/check-brand.ts (importBoundaries content rule — line 156-159)
  </read_first>
  <files>src/content/projects.ts</files>
  <action>
    Create new file `src/content/projects.ts` with:

    ```typescript
    /**
     * @module content/projects
     * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
     *   from src/pages/ and src/components/sections/. Must NEVER import React,
     *   motion, components, hooks, or pages.
     *
     *   Source of truth for /projects page chrome:
     *     - projectsHeading: D-01 page H1 («Проєкти»)
     *     - projectsSubtitle: D-01 honest 0/1/4 portfolio truth
     *     - zdanoEmptyMessage: D-09 «Здано» empty-state line
     *     - buduetsyaPointerMessage: D-08 «Будується» one-line pointer
     *       (the U+2191 «↑» glyph already signals direction; no arrow icon needed)
     *
     *   Tone: стримано, предметно (CONCEPT §2). No marketing claims.
     *   Forbidden lexicon enforced by scripts/check-brand.ts denylistTerms.
     */

    /** Page H1 — matches Nav label «Проєкти» (D-01). */
    export const projectsHeading = 'Проєкти';

    /** Muted subtitle — honest 0/1/4 count (D-01). Middle-dot is U+00B7,
     *  identical literal to home portfolioSubtitle for visual parity. */
    export const projectsSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

    /** «Здано» empty-state line under the single-cube marker (D-09).
     *  Stripped tone — empty means empty, no marketing fill. */
    export const zdanoEmptyMessage = 'Наразі жоден ЖК не здано';

    /** «Будується» pointer line — directs reader to the flagship above (D-08).
     *  Trailing arrow is U+2191 UPWARDS ARROW. */
    export const buduetsyaPointerMessage = 'Див. ЖК Lakeview вище ↑';
    ```

    NOTES:
    - The «↑» is U+2191 (raw glyph, not `&uarr;`).
    - The «·» middle-dot in subtitle is U+00B7 (matches home.ts portfolioSubtitle for cross-page parity).
    - No `import` statements. Pure leaf content module. No types needed (4 string consts).
    - Doc-block must NOT contain any of the forbidden palette hex literals or denylist terms (Pictorial/Rubikon).

    Per D-01, D-08, D-09 (decisions locked).
  </action>
  <verify>
    <automated>grep -E "projectsHeading|projectsSubtitle|zdanoEmptyMessage|buduetsyaPointerMessage" src/content/projects.ts &amp;&amp; grep -E "Наразі жоден ЖК не здано" src/content/projects.ts &amp;&amp; grep -E "Див\\. ЖК Lakeview вище" src/content/projects.ts &amp;&amp; ! grep -nE "from ['\\\"]react['\\\"]|from ['\\\"]motion|from ['\\\"].*components|from ['\\\"].*hooks|from ['\\\"].*pages" src/content/projects.ts &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    - File `src/content/projects.ts` exists.
    - 4 named exports: projectsHeading, projectsSubtitle, zdanoEmptyMessage, buduetsyaPointerMessage.
    - Subtitle contains literal `1 в активній фазі будівництва · 4 у pipeline · 0 здано`.
    - Empty-state contains literal `Наразі жоден ЖК не здано`.
    - Pointer message contains literal `Див. ЖК Lakeview вище ↑` (with U+2191 arrow).
    - Zero React/motion/components/hooks/pages imports (content boundary clean).
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Create src/content/zhk-etno-dim.ts (CTA labels + mailto subject + redirect copy)</name>
  <read_first>
    - src/content/home.ts (pattern reference)
    - src/components/sections/home/ContactForm.tsx (mailto + encodeURIComponent pattern lines 28-31)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-18, D-19)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Q17 (mailto cyrillic) + §Open Question 4
  </read_first>
  <files>src/content/zhk-etno-dim.ts</files>
  <action>
    Create new file `src/content/zhk-etno-dim.ts` with:

    ```typescript
    /**
     * @module content/zhk-etno-dim
     * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
     *   from src/pages/ and src/components/sections/. Must NEVER import React,
     *   motion, components, hooks, or pages.
     *
     *   Source of truth for /zhk/etno-dim CTA pair (D-18) + redirect copy (D-19).
     *
     *   - mailtoSubject: pre-filled subject for primary CTA mailto. Wrapped
     *     in encodeURIComponent at the href construction site (consumer
     *     follows ContactForm.tsx pattern lines 28-31).
     *   - mailtoLabel: visible button text on primary CTA.
     *   - instagramLabel: visible label on secondary disabled CTA.
     *   - lakeviewRedirectMessage: 1-frame placeholder text for /zhk/lakeview
     *     external redirect (Pitfall 5: paint flash before window.location.assign
     *     — make it look intentional with branded copy).
     */

    /** Pre-filled mailto subject for «Написати про ЖК Етно Дім». */
    export const mailtoSubject = 'Запит про ЖК Етно Дім';

    /** Primary CTA button label — accent-fill, opens mailto: */
    export const mailtoLabel = 'Написати про ЖК Етно Дім';

    /** Secondary CTA label — disabled-styled (socials.instagram === '#').
     *  Communicates «coming soon» without lying about working interactivity. */
    export const instagramLabel = 'Підписатись на оновлення (Instagram)';

    /** 1-frame redirect placeholder for /zhk/lakeview before window.location.assign.
     *  Em-dash is U+2014 (intentionally not used here — line is a single phrase). */
    export const lakeviewRedirectMessage = 'Переходимо до ЖК Lakeview…';
    ```

    NOTES:
    - The «…» in lakeviewRedirectMessage is U+2026 HORIZONTAL ELLIPSIS (single glyph), NOT three ASCII dots.
    - No imports needed.
    - Doc-block must not contain Pictorial/Rubikon literals (it doesn't — content-clean).

    Per D-18, D-19 (decisions locked, verbatim copy).
  </action>
  <verify>
    <automated>grep -E "mailtoSubject|mailtoLabel|instagramLabel|lakeviewRedirectMessage" src/content/zhk-etno-dim.ts &amp;&amp; grep -E "Запит про ЖК Етно Дім" src/content/zhk-etno-dim.ts &amp;&amp; grep -E "Переходимо до ЖК Lakeview" src/content/zhk-etno-dim.ts &amp;&amp; ! grep -nE "from ['\\\"]react['\\\"]|from ['\\\"]motion|from ['\\\"].*components|from ['\\\"].*hooks|from ['\\\"].*pages" src/content/zhk-etno-dim.ts &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    - File `src/content/zhk-etno-dim.ts` exists.
    - 4 named exports: mailtoSubject, mailtoLabel, instagramLabel, lakeviewRedirectMessage.
    - mailtoSubject contains literal `Запит про ЖК Етно Дім`.
    - mailtoLabel contains literal `Написати про ЖК Етно Дім`.
    - instagramLabel contains literal `Підписатись на оновлення (Instagram)`.
    - lakeviewRedirectMessage contains literal `Переходимо до ЖК Lakeview…` (with U+2026 ellipsis).
    - Zero React/motion/components/hooks/pages imports.
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Create src/content/contact.ts (page H1 + subtitle + CTA label)</name>
  <read_first>
    - src/content/home.ts (pattern reference + reuse contactCta literal? No — separate label per D-36)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-36, D-37)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 5 + §Open Question
  </read_first>
  <files>src/content/contact.ts</files>
  <action>
    Create new file `src/content/contact.ts` with:

    ```typescript
    /**
     * @module content/contact
     * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
     *   from src/pages/ and src/components/sections/. Must NEVER import React,
     *   motion, components, hooks, or pages.
     *
     *   Source of truth for /contact page chrome (D-36):
     *     - contactPageHeading: H1 «Контакт»
     *     - contactPageSubtitle: one-line stripped invitation
     *     - contactPageCta: primary mailto button label
     *
     *   Реквізити-block content (D-37: email, phone, address, socials) reads
     *   directly from src/content/company.ts (`email`, `socials`) and
     *   src/content/placeholders.ts (`phone`, `address`) — no duplication here.
     *
     *   Tone: стримано (CONCEPT §2). No «мрія»/«найкращий»/«унікальний».
     */

    /** /contact page H1 (D-36). */
    export const contactPageHeading = 'Контакт';

    /** /contact page subtitle — short stripped-tone invitation (D-36).
     *  Bare invitation per M-2 (stripped tone wins; no «— без зобов'язань» half-promise). */
    export const contactPageSubtitle = 'Напишіть нам, щоб обговорити проект.';

    /** Primary mailto CTA button label (D-36). Mirrors home contactCta
     *  «Ініціювати діалог» but kept as separate const for /contact-page editorial
     *  freedom (the home label and contact-page label may diverge in v2). */
    export const contactPageCta = 'Ініціювати діалог';

    /** Pre-filled mailto subject for /contact CTA (M-3 single-source).
     *  Identical literal to home ContactForm MAIL_SUBJECT so a returning user
     *  sees the same thread continued. Plan 04-08 imports this and uses it
     *  in the mailto href instead of inlining its own const. */
    export const contactMailSubject = 'Ініціювати діалог через сайт ВИГОДА';
    ```

    NOTES:
    - Subtitle is the bare invitation (M-2): no apostrophe, no em-dash, no «— без зобов'язань» trailing half-promise.
    - contactMailSubject literal must be byte-identical to home ContactForm MAIL_SUBJECT (`Ініціювати діалог через сайт ВИГОДА`) so the mail client dedupes the thread.
    - No imports.

    Per D-36, D-37 (D-36 locked; D-37 is reading-only data — handled in Wave 2 ContactDetails).
  </action>
  <verify>
    <automated>grep -E "contactPageHeading|contactPageSubtitle|contactPageCta|contactMailSubject" src/content/contact.ts &amp;&amp; grep -E "Контакт" src/content/contact.ts &amp;&amp; grep -E "Ініціювати діалог" src/content/contact.ts &amp;&amp; grep -E "Ініціювати діалог через сайт ВИГОДА" src/content/contact.ts &amp;&amp; ! grep -nE "from ['\\\"]react['\\\"]|from ['\\\"]motion|from ['\\\"].*components|from ['\\\"].*hooks|from ['\\\"].*pages" src/content/contact.ts &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    - File `src/content/contact.ts` exists.
    - 4 named exports: contactPageHeading, contactPageSubtitle, contactPageCta, contactMailSubject.
    - Heading contains literal `Контакт`.
    - Subtitle is the bare invitation (`Напишіть нам, щоб обговорити проект.` — no trailing «— без зобов'язань»).
    - CTA label contains literal `Ініціювати діалог`.
    - contactMailSubject contains literal `Ініціювати діалог через сайт ВИГОДА` (M-3 single-source for /contact mailto subject).
    - Zero React/motion/components/hooks/pages imports.
    - `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
After all 4 tasks complete:

1. **Files exist**: `ls src/lib/stages.ts src/content/projects.ts src/content/zhk-etno-dim.ts src/content/contact.ts` shows 4 files.

2. **Type integrity**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (full chain — prebuild → tsc → vite build → postbuild check-brand 4/4 PASS).

4. **Content boundary clean** (no forbidden imports in content modules):
   ```
   ! grep -rnE "from ['\"]react['\"]|from ['\"]motion|from ['\"].*components|from ['\"].*hooks|from ['\"].*pages" src/content/
   ```
   Returns nothing.

5. **Stage canonical order verified**: `grep -nE "u-rozrakhunku.*u-pogodzhenni.*buduetsya.*zdano" src/lib/stages.ts` returns 1 line (matches D-03 chip order).

6. **No prior commit regressions**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.
</verification>

<success_criteria>
- HUB-01 partial: stage-label single source of truth (`src/lib/stages.ts`) ready for Wave 2 StageFilter consumer.
- Content boundary holds: 4 new modules, zero React/motion/components imports.
- All Ukrainian strings >40 chars (Phase 3 D-29) live in content modules, not in JSX (this plan ships the prerequisite — Wave 2 plans honor the boundary by importing).
- Build pipeline unchanged (no behavioral change yet — these modules become reachable via Wave 2 imports).
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-01-SUMMARY.md` documenting:
- File paths created
- Decision IDs implemented (D-01, D-08, D-09, D-11, D-18, D-19, D-36, D-42)
- Any deviations from plan `<action>` text (if any)
- `npm run lint` and `npm run build` exit codes
- Note for Wave 2 plans: which exports they will consume from each module
</output>
