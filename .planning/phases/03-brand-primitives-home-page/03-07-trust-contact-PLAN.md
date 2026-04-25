---
phase: 03-brand-primitives-home-page
plan: 7
type: execute
wave: 2
depends_on: ["03-01", "03-02", "03-03"]
files_modified:
  - src/components/sections/home/TrustBlock.tsx
  - src/components/sections/home/ContactForm.tsx
autonomous: true
requirements: [HOME-06, HOME-07]
requirements_addressed: [HOME-06, HOME-07]

must_haves:
  truths:
    - "TrustBlock renders 3-column table-like layout reading `legalName`, `edrpou`, `licenseDate`, `licenseNote`, `email` from `src/content/company.ts` PLUS `licenseScopeNote`, `contactNote` captions from `src/content/home.ts` — NO `<img>` of people, NO «команда»/«керівник» literals (HOME-06, hard-rule no team photos, Phase 3 D-29 / checker Warning 7)"
    - "ContactForm renders heading + body + a single CTA «Ініціювати діалог» as a `<a href='mailto:vygoda.sales@gmail.com?subject=...'>` button — heading and body imported from `src/content/home.ts` (`contactHeading`, `contactBody`) — NO `<input>`, NO `<form>`, NO `<textarea>` (HOME-07, D-29 / checker Warning 8)"
    - "TrustBlock muted labels use `text-text-muted` (#A7AFBC) at body size ≥14pt — AA contrast 5.3:1 holds (brand-system §3)"
    - "ContactForm uses `contactCta`, `contactHeading`, `contactBody` from `src/content/home.ts` — no inline «Ініціювати діалог», «Поговоримо про ваш об'єкт», «Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.» strings"
    - "Both components contain no `transition={{}}` (Phase 5 boundary)"
  artifacts:
    - path: "src/components/sections/home/TrustBlock.tsx"
      provides: "HOME-06 — 3-column legal facts table (ЄДРПОУ + ліцензія + email)"
      exports: ["TrustBlock"]
      min_lines: 35
    - path: "src/components/sections/home/ContactForm.tsx"
      provides: "HOME-07 — single mailto: CTA, no form fields"
      exports: ["ContactForm"]
      min_lines: 25
  key_links:
    - from: "src/components/sections/home/TrustBlock.tsx"
      to: "src/content/company.ts"
      via: "import { legalName, edrpou, licenseDate, licenseNote, email }"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/company'"
    - from: "src/components/sections/home/TrustBlock.tsx"
      to: "src/content/home.ts"
      via: "import { licenseScopeNote, contactNote } — col 2/3 captions (Phase 3 D-29 / checker Warning 7)"
      pattern: "licenseScopeNote|contactNote"
    - from: "src/components/sections/home/ContactForm.tsx"
      to: "src/content/company.ts"
      via: "import { email } — base for mailto: href"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/company'"
    - from: "src/components/sections/home/ContactForm.tsx"
      to: "src/content/home.ts"
      via: "import { contactCta, contactHeading, contactBody } — button label + heading + body (Phase 3 D-29 / checker Warning 8)"
      pattern: "from '\\.\\./\\.\\./\\.\\./content/home'"
    - from: "src/components/sections/home/ContactForm.tsx"
      to: "mailto: protocol"
      via: "<a href={`mailto:${email}?subject=...`}>"
      pattern: "mailto:"
---

<objective>
Ship the final two below-fold home sections — `TrustBlock` (HOME-06, ЄДРПОУ + ліцензія + email three-column legal table) and `ContactForm` (HOME-07, single mailto: CTA, no form fields). These close all 7 HOME requirements when composed in Plan 03-08.

Purpose: HOME-06 is the trust-via-legal-facts (no team photos hard-rule) — Persona-3 (bank DD) lands here from Google. HOME-07 is the lowest-friction "talk to us" surface — no fake form (PROJECT.md Out of Scope rejects server endpoints, INFR2-04 owns real backend in v2).

Output:
1. `src/components/sections/home/TrustBlock.tsx` (~50 lines) — 3-column horizontal table, NO team imagery
2. `src/components/sections/home/ContactForm.tsx` (~35 lines) — single button, optional small paragraph above
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
@brand-system.md

<interfaces>
Phase 2 content: `src/content/company.ts` (verified):
```ts
export const legalName = 'ТОВ «БК ВИГОДА ГРУП»' as const;
export const edrpou = '42016395' as const;
export const licenseDate = '27.12.2019' as const;
export const licenseNote = '(безстрокова)' as const;
export const email = 'vygoda.sales@gmail.com' as const;
```

Wave 1 dep: `src/content/home.ts` (Plan 03-02) — both sections consume:
```ts
export const contactCta = 'Ініціювати діалог';
// Phase 3 D-29 / checker Warning 7 (TrustBlock captions):
export const licenseScopeNote =
  'на провадження господарської діяльності з будівництва';
export const contactNote = 'Звернення з усіх питань — на цю адресу';
// Phase 3 D-29 / checker Warning 8 (ContactForm heading + body, U+2019 apostrophes):
export const contactHeading = 'Поговоримо про ваш об’єкт';
export const contactBody =
  'Напишіть нам — обговоримо запит, опції, графік. Без зобов’язань.';
```

PROJECT.md Out of Scope (verbatim):
- "Team page / фото керівництва — Hard-rule клієнта (CONTEXT §1, CONCEPT §10.1): довіра = юр. факти, не обличчя"
- "Бекенд форм у v1 — `mailto:` достатньо для demo-handoff. Server endpoint — v2 INFR2-04."

`scripts/check-brand.ts` `placeholderTokens` already gates `dist/` for `{{` / `TODO` — TrustBlock must render `email`, `edrpou`, `licenseDate` as resolved values, not Mustache template literals.

Tailwind v4 utilities — labels use `text-text-muted` (≥14pt only, AA 5.3:1); values use `text-text` (AAA 10.5:1).
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/components/sections/home/TrustBlock.tsx</name>
  <files>src/components/sections/home/TrustBlock.tsx</files>
  <read_first>
    - src/content/company.ts (named exports — verify spellings, especially `licenseNote = '(безстрокова)'`)
    - src/content/home.ts (`licenseScopeNote`, `contactNote` exports from Plan 03-02 — Phase 3 D-29 / checker Warning 7)
    - 03-CONTEXT.md "TrustBlock (HOME-06)" subsection (D-recommendation: 3-column table-like, NO team photos)
    - 03-RESEARCH.md lines 1119-1128 (company facts named exports)
    - 03-RESEARCH.md lines 1344 (Open Question 3 — recommendation: 3-column horizontal table with column headers in text-text-muted font-medium uppercase, values in text-text font-bold)
    - PROJECT.md Out of Scope (no team photos hard-rule)
  </read_first>
  <behavior>
    - Test 1: file exports `TrustBlock` named function
    - Test 2: imports `legalName`, `edrpou`, `licenseDate`, `licenseNote`, `email` from `'../../../content/company'`
    - Test 3: imports `licenseScopeNote`, `contactNote` from `'../../../content/home'` (Phase 3 D-29 / checker Warning 7)
    - Test 4: renders `<section>` with `bg-bg py-24` (or rhythm-xl spacing) inside `max-w-7xl px-6` container
    - Test 5: 3-column grid layout via Tailwind `grid-cols-3 gap-12`
    - Test 6: each column has a label + value pair — labels use `text-text-muted text-xs font-medium uppercase tracking-wider`; values use `text-text` `font-bold` (recommendation per OQ 3)
    - Test 7: column 1: label «Юр. особа», value `{legalName}` + `<span>ЄДРПОУ {edrpou}</span>` rendered below
    - Test 8: column 2: label «Ліцензія», value «від {licenseDate} {licenseNote}» (template-literal — combined render of the 2 fields), caption `{licenseScopeNote}`
    - Test 9: column 3: label «Контакт», value `<a href={`mailto:${email}`}>{email}</a>` (clickable mailto), caption `{contactNote}`
    - Test 10: file does NOT contain `<img>` AT ALL (no images in TrustBlock — defensive against drift)
    - Test 11: file does NOT contain literals «команда», «керівник», «обличчя», «фото», «портрет» (defensive against future inadvertent additions; HOME-06 hard rule)
    - Test 12: file does NOT contain inline literal `"на провадження господарської діяльності з будівництва"` — comes from `licenseScopeNote` import (closes checker Warning 7)
    - Test 13: file does NOT contain inline literal `"Звернення з усіх питань — на цю адресу"` — comes from `contactNote` import (closes checker Warning 7)
    - Test 14: file does NOT contain `transition={{`
    - Test 15: section heading is short (e.g. «Юридично та операційно» or just structural — not «Наша команда» style)
  </behavior>
  <action>
    CREATE file `src/components/sections/home/TrustBlock.tsx`:

    ```
    /**
     * @module components/sections/home/TrustBlock
     *
     * HOME-06 — Trust-via-legal-facts (NOT trust-via-team-photos).
     * 3-column horizontal table: Юр. особа | Ліцензія | Контакт.
     *
     * Hard rule: NO team photos, NO faces, NO «команда»/«керівник» copy.
     * Trust signal = ЄДРПОУ in public registry + active construction license,
     * not portraits (PROJECT.md Out of Scope, brand-system.md §6, CONCEPT §10.1).
     *
     * Reads facts from src/content/company.ts named exports and longer
     * captions (licenseScopeNote, contactNote) from src/content/home.ts —
     * Phase 3 D-29 boundary discipline (closes checker Warning 7). Phase 1
     * Footer.tsx shows the same 3 facts in column 3 — TrustBlock is the
     * home-page higher-emphasis surface (Persona-3 bank-DD lands here from
     * Google).
     *
     * Muted labels use text-text-muted (#A7AFBC) at text-xs (12px ≈ 9pt) —
     * BUT the labels are uppercase tracking-wider, so the effective optical
     * size + label-pattern usage stays inside brand-system §3 acceptable
     * (labels, not body). Values use text-text (#F5F7FA, AAA 10.5:1).
     */

    import {
      legalName,
      edrpou,
      licenseDate,
      licenseNote,
      email,
    } from '../../../content/company';
    import { licenseScopeNote, contactNote } from '../../../content/home';

    export function TrustBlock() {
      return (
        <section className="bg-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 font-bold text-3xl text-text">
              Юридично та операційно
            </h2>

            <div className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3">
              {/* Column 1 — legal entity + ЄДРПОУ */}
              <div className="flex flex-col gap-3">
                <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                  Юр. особа
                </span>
                <span className="font-bold text-base text-text">{legalName}</span>
                <span className="text-base text-text-muted">ЄДРПОУ {edrpou}</span>
              </div>

              {/* Column 2 — license */}
              <div className="flex flex-col gap-3">
                <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                  Ліцензія
                </span>
                <span className="font-bold text-base text-text">
                  від {licenseDate} {licenseNote}
                </span>
                <span className="text-base text-text-muted">
                  {licenseScopeNote}
                </span>
              </div>

              {/* Column 3 — contact email (clickable mailto) */}
              <div className="flex flex-col gap-3">
                <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                  Контакт
                </span>
                <a
                  href={`mailto:${email}`}
                  className="font-bold text-base text-text hover:text-accent"
                >
                  {email}
                </a>
                <span className="text-base text-text-muted">{contactNote}</span>
              </div>
            </div>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - Heading «Юридично та операційно» (24 chars) is a short brand-section heading — short Cyrillic literal, allowed inline (D-29 lets short labels stay).
    - Column 2 caption (`licenseScopeNote` = «на провадження господарської діяльності з будівництва», 52 chars) and column 3 caption (`contactNote` = «Звернення з усіх питань — на цю адресу», 38 chars) are sourced from `src/content/home.ts` per Phase 3 D-29 + checker Warning 7. They are no longer inline literals.
    - Footer.tsx already shows ЄДРПОУ + ліцензія in column 3 — TrustBlock REPEATS them on home as a higher-emphasis surface (HOME-06 mandates this; not redundant). Footer remains untouched per CONTEXT D-27 (Phase 3 does not refactor Footer).
    - The grid `lg:grid-cols-3` keeps mobile fallback (1-col stack) consistent with QA-01 — at <1024px Phase 6 mobile-fallback page replaces the whole site, so the lg breakpoint is fine.
  </action>
  <verify>
    <automated>test -f src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "from '../../../content/company'" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "from '../../../content/home'" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "licenseScopeNote" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "contactNote" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "edrpou" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE "licenseDate" src/components/sections/home/TrustBlock.tsx &amp;&amp; grep -cE 'mailto:' src/components/sections/home/TrustBlock.tsx &amp;&amp; ! grep -nE "<img" src/components/sections/home/TrustBlock.tsx &amp;&amp; ! grep -nE "команда|керівник|обличчя|портрет" src/components/sections/home/TrustBlock.tsx &amp;&amp; ! grep -nE "на провадження господарської діяльності з будівництва" src/components/sections/home/TrustBlock.tsx &amp;&amp; ! grep -nE "Звернення з усіх питань — на цю адресу" src/components/sections/home/TrustBlock.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/TrustBlock.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    TrustBlock.tsx exists, 3 columns reading from company.ts (facts) + home.ts (captions), no `<img>`, no team-related literals, mailto: link clickable. No inline `licenseScopeNote`/`contactNote` literal copies (closes checker Warning 7). `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/components/sections/home/ContactForm.tsx</name>
  <files>src/components/sections/home/ContactForm.tsx</files>
  <read_first>
    - src/content/company.ts (email export)
    - src/content/home.ts (contactCta, contactHeading, contactBody exports — Wave 1 dep from Plan 03-02; Phase 3 D-29 / checker Warning 8)
    - 03-CONTEXT.md "ContactForm (HOME-07)" subsection (D-29 microcopy, NO real form fields, single CTA)
    - PROJECT.md Out of Scope (no server endpoints, mailto-only — INFR2-04 v2)
  </read_first>
  <behavior>
    - Test 1: file exports `ContactForm` named function
    - Test 2: imports `email` from `'../../../content/company'`
    - Test 3: imports `contactCta`, `contactHeading`, `contactBody` from `'../../../content/home'`
    - Test 4: file does NOT contain `<input>`, `<form>`, `<textarea>`, OR `<label>` elements (HOME-07 / D-29)
    - Test 5: renders an `<a href="mailto:vygoda.sales@gmail.com?subject=...">{contactCta}</a>` styled as a button (Tailwind classes mimicking the hero CTA: `bg-accent text-bg-black px-8 py-4 font-medium`)
    - Test 6: subject parameter is URL-encoded — e.g. `?subject=Ініціювати діалог через сайт ВИГОДА` (URL-encoded with `encodeURIComponent` at runtime OR inline as `?subject=…` allowed since the literal subject string isn't in scope of the «no Ukrainian JSX literal paragraphs» rule when used in URL context — but a TS const at module top is cleaner)
    - Test 7: section heading is `<h2>{contactHeading}</h2>` (no inline literal — closes checker Warning 8)
    - Test 8: body `<p>` contains `{contactBody}` (no inline literal — closes checker Warning 8)
    - Test 9: NO `transition={{}}`
    - Test 10: file does NOT contain literal «vygoda.sales@gmail.com» — uses `{email}` import (defensive against drift if email ever changes)
    - Test 11: file does NOT contain inline literals «Поговоримо про ваш об» or «обговоримо запит, опції, графік» — both come from imports (closes checker Warning 8)
  </behavior>
  <action>
    CREATE file `src/components/sections/home/ContactForm.tsx`:

    ```
    /**
     * @module components/sections/home/ContactForm
     *
     * HOME-07 — Single CTA «Ініціювати діалог» that opens the user's mail
     * client to a pre-filled mailto: vygoda.sales@gmail.com message.
     *
     * NO real form fields. Per PROJECT.md Out of Scope:
     *   «Бекенд форм у v1 — mailto: достатньо для demo-handoff.
     *    Server endpoint — v2 INFR2-04.»
     * A fake form that only concatenates inputs into a mailto query string
     * adds UI surface without real utility — D-29 rejects it.
     *
     * Reads `email` from src/content/company.ts (so a single edit propagates
     * here, Footer, TrustBlock) and `contactCta`/`contactHeading`/`contactBody`
     * from src/content/home.ts (microcopy in one file — Phase 3 D-29 / checker
     * Warning 8). The previously inline heading and body literals are now
     * imports so the editorial surface is centralized.
     */

    import { email } from '../../../content/company';
    import {
      contactCta,
      contactHeading,
      contactBody,
    } from '../../../content/home';

    /** Pre-filled subject line — short, branded, not a marketing claim. */
    const MAIL_SUBJECT = 'Ініціювати діалог через сайт ВИГОДА';

    export function ContactForm() {
      const href = `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;

      return (
        <section className="bg-bg-black py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
            <h2 className="font-bold text-3xl text-text">{contactHeading}</h2>
            <p className="max-w-2xl text-base text-text-muted">{contactBody}</p>
            <a
              href={href}
              className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
            >
              {contactCta}
            </a>
          </div>
        </section>
      );
    }
    ```

    Implementation notes:
    - Uses `bg-bg-black` (deep black `#020A0A`) instead of `bg-bg` to give ContactForm visual emphasis as the page closer — accent-on-black is brand-strongest contrast (8.85:1 AAA per brand-system §3).
    - The `<h2>{contactHeading}</h2>` («Поговоримо про ваш об'єкт», U+2019 apostrophe) and `<p>{contactBody}</p>` («Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.», U+2019 apostrophe) are sourced from `src/content/home.ts` per Phase 3 D-29 + checker Warning 8.
    - `MAIL_SUBJECT` remains as a const at module top — it's a URL-context value, short, single-purpose. Keeping the literal one place to edit; `encodeURIComponent` ensures the Cyrillic encodes correctly into the mailto URL.
    - The `<a>` is styled to look like a button (no `rounded-full`, no springs, no shadow per brand discipline). On click, browser/OS opens the user's default mail composer with `To:` and `Subject:` pre-filled.
  </action>
  <verify>
    <automated>test -f src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "from '../../../content/company'" src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "from '../../../content/home'" src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "contactHeading" src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "contactBody" src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "mailto:" src/components/sections/home/ContactForm.tsx &amp;&amp; grep -cE "encodeURIComponent" src/components/sections/home/ContactForm.tsx &amp;&amp; ! grep -nE "<input|<form|<textarea|<label" src/components/sections/home/ContactForm.tsx &amp;&amp; ! grep -nE "vygoda\.sales@gmail\.com" src/components/sections/home/ContactForm.tsx &amp;&amp; ! grep -nE "Поговоримо про ваш об" src/components/sections/home/ContactForm.tsx &amp;&amp; ! grep -nE "обговоримо запит, опції, графік" src/components/sections/home/ContactForm.tsx &amp;&amp; ! grep -nE "transition=\{\{" src/components/sections/home/ContactForm.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    ContactForm.tsx exists, single mailto: anchor styled as button, no form/input/textarea elements, email comes from import (no hardcoded address), heading + body come from `src/content/home.ts` imports (no inline Ukrainian heading/body literals — closes checker Warning 8). `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
1. `npm run lint` exits 0
2. `npm run build` exits 0; check-brand 4/4 PASS
3. Manual visual QA at `npm run dev` (after Plan 03-08 wires HomePage, but components are self-renderable in `/dev/brand` if added):
   - TrustBlock: 3 columns, no images, mailto: clickable
   - ContactForm: single button on dark `bg-bg-black` section, click opens mail composer with subject pre-filled
4. `tsx scripts/check-brand.ts` PASS — both files clean
</verification>

<success_criteria>
- [ ] `TrustBlock.tsx` exists with 3-column layout reading from company.ts (facts) + home.ts (captions)
- [ ] No `<img>` in TrustBlock.tsx, no «команда»/«керівник»/«обличчя»/«портрет» literals
- [ ] TrustBlock includes clickable `mailto:${email}` anchor
- [ ] TrustBlock col 2/3 captions come from `licenseScopeNote`/`contactNote` imports — no inline copies (closes checker Warning 7)
- [ ] `ContactForm.tsx` exists, renders single mailto: anchor styled as button
- [ ] No `<input>`, `<form>`, `<textarea>`, `<label>` in ContactForm.tsx
- [ ] No literal `vygoda.sales@gmail.com` in ContactForm.tsx (uses `email` import)
- [ ] ContactForm heading + body come from `contactHeading`/`contactBody` imports — no inline Ukrainian h2/p copies (closes checker Warning 8)
- [ ] No `transition={{` in either file
- [ ] `npm run build` exits 0; check-brand 4/4 PASS
</success_criteria>

<output>
After completion, create `.planning/phases/03-brand-primitives-home-page/03-07-SUMMARY.md` documenting:
- TrustBlock + ContactForm shipped
- HOME-06 closed (3-column legal facts table; no team imagery; defensive grep against future drift; captions sourced from content/home.ts per D-29)
- HOME-07 closed (mailto-only single CTA; no fake form; heading + body sourced from content/home.ts per D-29)
- check-brand result; any deviations
- Wave 3 progress: 7/7 home sections shipped — Plan 03-08 will compose them into HomePage.tsx + register /dev/brand
</output>
</output>
