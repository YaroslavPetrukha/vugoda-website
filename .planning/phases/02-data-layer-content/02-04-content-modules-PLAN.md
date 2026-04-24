---
phase: 02-data-layer-content
plan: 04
type: execute
wave: 2
depends_on: [02-01]
files_modified:
  - src/content/methodology.ts
  - src/content/values.ts
  - src/content/company.ts
  - src/content/placeholders.ts
autonomous: true
requirements_addressed:
  - CON-01
must_haves:
  truths:
    - "All user-facing editorial copy lives under src/content/ — Phase 3/4 page components import named consts, never Ukrainian JSX literal paragraphs (PITFALLS §Pitfall 7 prevention)"
    - "src/content/methodology.ts exports `methodologyBlocks: MethodologyBlock[]` with exactly 7 records (index 1..7); blocks 2, 5, 6 have `needsVerification: true` (D-16, CONCEPT §11.5)"
    - "src/content/values.ts exports `brandValues: BrandValue[]` with exactly 4 records in this order: системність, доцільність, надійність, довгострокова цінність (D-17, brand-system §1)"
    - "src/content/company.ts exports typed consts for ТОВ name, ЄДРПОУ 42016395, ліцензія 27.12.2019 (безстрокова), email vygoda.sales@gmail.com, and socials scaffold with `href='#'` placeholders until launch (D-18)"
    - "src/content/placeholders.ts exports named consts phone='—', address='—', pipeline4Title='Без назви', etnoDimAddress='—' — raw em-dash, NEVER `{{token}}` (D-19)"
    - "All 4 modules have `@rule IMPORT BOUNDARY` doc-block (D-34) and zero React/motion/component/hook/page imports"
    - "`npm run lint` passes"
  artifacts:
    - path: "src/content/methodology.ts"
      provides: "methodologyBlocks — 7 blocks from CONCEPT §8 with ⚠-verification flags on 2/5/6"
      contains: "export const methodologyBlocks"
    - path: "src/content/values.ts"
      provides: "brandValues — 4 values from brand-system §1 / CONCEPT §2"
      contains: "export const brandValues"
    - path: "src/content/company.ts"
      provides: "legalName, edrpou, licenseDate, licenseNote, email, socials"
      contains: "42016395"
    - path: "src/content/placeholders.ts"
      provides: "phone, address, pipeline4Title, etnoDimAddress — audit surface for §11 open items"
      contains: "pipeline4Title"
  key_links:
    - from: "src/content/*.ts"
      to: "src/data/types.ts"
      via: "type-only imports for MethodologyBlock / BrandValue"
      pattern: "import type \\{ (MethodologyBlock|BrandValue) \\}"
    - from: "src/content/placeholders.ts"
      to: "§11 open client questions"
      via: "named const per pending item, single audit surface"
      pattern: "pipeline4Title|etnoDimAddress"
---

<objective>
Author the 4 content modules that hold every piece of editorial copy in Phase 3/4 pages. Methodology blocks (§8) carry ⚠-verification flags on blocks 2/5/6 so the UI can render a marker until client-confirmed (CONCEPT §11.5). Brand values (§1) render as BrandEssence cards. Company consts power the Trust block + footer. Placeholders are the single audit surface — client opens `placeholders.ts` and sees every pending answer (phone, address, Pipeline-4 title, Etno Dim address) as one em-dash per line.

Purpose: CON-01 entire requirement. Kills the "Ukrainian paragraph as JSX literal" anti-pattern before it starts. Makes v2 Sanity migration trivial — each module is already a typed consumable.
Output: 4 new TS modules under src/content/; `npm run lint` passes; every module has doc-block.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-data-layer-content/02-CONTEXT.md
@.planning/phases/02-data-layer-content/02-RESEARCH.md
@.planning/phases/02-data-layer-content/02-01-SUMMARY.md
@КОНЦЕПЦІЯ-САЙТУ.md
@brand-system.md
@src/data/types.ts
</context>

<interfaces>
<!-- Types consumed from Plan 02-01 -->
```typescript
import type { MethodologyBlock } from '../data/types';
import type { BrandValue } from '../data/types';
```

<!-- CONCEPT §8 methodology blocks (source of truth — verbatim from КОНЦЕПЦІЯ-САЙТУ.md lines 241–266) -->

Block 1: «Чесно маркуємо стадію кожного проекту» — needsVerification: false
Block 2: «Працюємо в межах ліцензії та юридичного статусу» — **needsVerification: true** (CONCEPT adds ⚠ about single vs multi-юрособа)
Block 3: «Поєднуємо ролі забудовника і генерального підрядника» — needsVerification: false
Block 4: «Беремо на себе заморожені об'єкти» — needsVerification: false
Block 5: «Технологія відповідає класу наслідків» — **needsVerification: true** (CONCEPT ⚠ about technical specs per-ЖК)
Block 6: «Рішення приймаємо за доцільністю» — **needsVerification: true** (CONCEPT ⚠ about 3-criteria extension)
Block 7: «Проектуємо середовище, а не квадратні метри» — needsVerification: false

D-16 mandates blocks {2, 5, 6} flag = true. Blocks {1, 3, 4, 7} flag = false.

<!-- Brand values from brand-system.md §1 / CONCEPT §2 (4 canonical values) -->

1. системність
2. доцільність
3. надійність
4. довгострокова цінність

<!-- Company facts from PROJECT.md / CONTEXT D-18 -->

- legalName: ТОВ «БК ВИГОДА ГРУП»
- edrpou: 42016395
- licenseDate: 27.12.2019
- licenseNote: (безстрокова)
- email: vygoda.sales@gmail.com
- socials: { telegram: '#', instagram: '#', facebook: '#' } (placeholders until launch per CTC-01)

<!-- Placeholders per CONTEXT D-19 + CONCEPT §11 open items -->

- phone: '—'                  // §11.1 pending client
- address: '—'                // §11.2 pending client
- pipeline4Title: 'Без назви' // §11.3 pending client name
- etnoDimAddress: '—'         // §11.8 pending confirmation
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create src/content/methodology.ts (7 blocks from CONCEPT §8 with ⚠ flags on 2/5/6)</name>
  <files>src/content/methodology.ts</files>
  <read_first>
    - src/data/types.ts (MethodologyBlock interface)
    - КОНЦЕПЦІЯ-САЙТУ.md §8 (lines 241–266 — verbatim source for all 7 blocks)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-16 (blocks 2, 5, 6 have needsVerification: true)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-20 (no Ukrainian JSX literal paragraphs in components)
  </read_first>
  <behavior>
    - methodologyBlocks has exactly 7 elements, indices 1..7 in order
    - Block titles EXACTLY match CONCEPT §8:
      - 1: «Чесно маркуємо стадію кожного проекту»
      - 2: «Працюємо в межах ліцензії та юридичного статусу»
      - 3: «Поєднуємо ролі забудовника і генерального підрядника»
      - 4: «Беремо на себе заморожені об'єкти»
      - 5: «Технологія відповідає класу наслідків»
      - 6: «Рішення приймаємо за доцільністю»
      - 7: «Проектуємо середовище, а не квадратні метри»
    - Block bodies are verbatim from CONCEPT §8 (no paraphrasing, no truncation)
    - Blocks 2, 5, 6 have `needsVerification: true`; blocks 1, 3, 4, 7 have `needsVerification: false`
    - File has @rule doc-block per D-34
    - Zero React/motion/component imports
    - `npm run lint` passes
  </behavior>
  <action>
Create `src/content/methodology.ts` with this EXACT content. Every `body` string is copy-pasted from КОНЦЕПЦІЯ-САЙТУ.md lines 245-264 — DO NOT paraphrase, DO NOT truncate, DO NOT add emphasis or line breaks beyond what's in the source.

```typescript
/**
 * @module content/methodology
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages. Components consume methodologyBlocks by name
 *   — they NEVER contain these Ukrainian paragraphs as JSX literals
 *   (PITFALLS §Pitfall 7).
 *
 *   Source of truth: КОНЦЕПЦІЯ-САЙТУ.md §8 (7 blocks, verbatim). Blocks 2, 5, 6
 *   carry needsVerification: true per CONCEPT §11.5 — UI (Phase 3
 *   MethodologyTeaser, v2 /how-we-build) renders a ⚠ marker until client
 *   confirms. Do not ship these three blocks as uncaveated fact.
 *
 *   body uses \n\n as paragraph separator per D-16 recommendation; currently
 *   each block is a single paragraph from CONCEPT, so no \n\n appears yet.
 */

import type { MethodologyBlock } from '../data/types';

export const methodologyBlocks: MethodologyBlock[] = [
  {
    index: 1,
    title: 'Чесно маркуємо стадію кожного проекту',
    body: 'Назва, терміни і ціна з’являються на сайті тоді, коли ми можемо їх підтвердити. Якщо деталі ще в роботі — маркуємо стадію точним словом: «меморандум», «дозвільна», «кошторисна документація», «кошторисна вартість». Без «скоро» без конкретики і без вигаданих дат.',
    needsVerification: false,
  },
  {
    index: 2,
    title: 'Працюємо в межах ліцензії та юридичного статусу',
    body: 'ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395. Безстрокова ліцензія на будівництво від 27.12.2019. Юридичний трек відкритий для перевірки через публічні реєстри. Чи ведемо всі проекти під єдиною юрособою або використовуємо окремі структури під кожен ЖК — потребує підтвердження клієнтом.',
    needsVerification: true,
  },
  {
    index: 3,
    title: 'Поєднуємо ролі забудовника і генерального підрядника',
    body: 'Ми відповідаємо і за девелопмент, і за виконання робіт на майданчику. За підсумкову якість, терміни і бюджет ми не розділяємо відповідальність з третіми сторонами — власнику квартири зрозуміло, з ким говорити.',
    needsVerification: false,
  },
  {
    index: 4,
    title: 'Беремо на себе заморожені об’єкти',
    body: 'Коли це доцільно, ми підписуємо меморандуми про відновлення будівництва з правовласниками об’єкта. У такому форматі зараз ведеться ЖК «Етно Дім». Відновлення замороженого об’єкта — це окрема технічна робота: аудит наявних конструкцій, перерахунок, юридичне переоформлення прав забудовника.',
    needsVerification: false,
  },
  {
    index: 5,
    title: 'Технологія відповідає класу наслідків',
    body: 'Технологія (тип конструкції, матеріали несучих стін, утеплення) добирається під клас наслідків об’єкта і специфіку ділянки, а не навпаки. Конкретні технічні характеристики по кожному ЖК (клас наслідків, тип конструкції, кадастровий номер) публікуємо на сторінці об’єкта тільки після верифікації з відповідальною командою. До верифікації на корпсайті конкретних цифр не наводимо.',
    needsVerification: true,
  },
  {
    index: 6,
    title: 'Рішення приймаємо за доцільністю',
    body: 'Кожне конструктивне і планувальне рішення оцінюється за трьома критеріями: технічна обґрунтованість, довгостроковий ресурс, вартість володіння для власника. Якщо дорожче рішення не дає переваги за цими критеріями, ми його не беремо. Три критерії — розширення від контент-стратега, потребує підтвердження клієнтом.',
    needsVerification: true,
  },
  {
    index: 7,
    title: 'Проектуємо середовище, а не квадратні метри',
    body: 'Планування квартир, інженерія, благоустрій, логіка першого поверху розглядаються як одна система. Ціль — щоб об’єкт зберігав цінність довгостроково, а не лише продавався на старті.',
    needsVerification: false,
  },
];
```

Typography notes:
- Use typographic apostrophe `’` (U+2019) in Ukrainian words like `об’єкт`, `з’являються` — this matches CONCEPT source and brandbook tone. Do NOT use ASCII `'`.
- Use guillemets `«…»` (U+00AB / U+00BB) for all quoted strings inside bodies — already present in the source.
- Em-dash `—` (U+2014), not two hyphens `--` or regular hyphen `-`.

Do NOT:
- Add an 8th block (CONCEPT §8 has 7; the structure is locked).
- Paraphrase "make it shorter" — verbatim only.
- Merge the ⚠ parenthetical disclaimer with the main sentence via markdown italics — the body is plain text; the UI renders the `needsVerification` flag as a visual marker separately.
- Use `export default` — named exports only per RESEARCH §Named exports over default exports.
  </action>
  <acceptance_criteria>
    - `test -f src/content/methodology.ts` passes
    - `grep -c "export const methodologyBlocks: MethodologyBlock\\[\\]" src/content/methodology.ts` returns `1`
    - `grep -cE "index: [1-7]," src/content/methodology.ts` returns `7`
    - `grep -c "needsVerification: true" src/content/methodology.ts` returns `3`
    - `grep -c "needsVerification: false" src/content/methodology.ts` returns `4`
    - `grep -c "Чесно маркуємо стадію кожного проекту" src/content/methodology.ts` returns `1`
    - `grep -c "Працюємо в межах ліцензії та юридичного статусу" src/content/methodology.ts` returns `1`
    - `grep -c "Поєднуємо ролі забудовника і генерального підрядника" src/content/methodology.ts` returns `1`
    - `grep -c "Беремо на себе заморожені" src/content/methodology.ts` returns `1` (block 4 title)
    - `grep -c "Технологія відповідає класу наслідків" src/content/methodology.ts` returns `1`
    - `grep -c "Рішення приймаємо за доцільністю" src/content/methodology.ts` returns `1`
    - `grep -c "Проектуємо середовище, а не квадратні метри" src/content/methodology.ts` returns `1`
    - `grep -c "ЄДРПОУ 42016395" src/content/methodology.ts` returns `1` (block 2 body)
    - `grep -c "27.12.2019" src/content/methodology.ts` returns `1` (block 2 body)
    - `grep -c "@rule IMPORT BOUNDARY" src/content/methodology.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion" src/content/methodology.ts` returns `0`
    - `grep -cE "from ['\"][^'\"]*components[/'\"]|from ['\"][^'\"]*hooks[/'\"]|from ['\"][^'\"]*pages[/'\"]" src/content/methodology.ts` returns `0`
    - Derived assertion (blocks 2/5/6 flagged): `node --input-type=module -e "import('./src/content/methodology.ts').then(m => { const flagged = m.methodologyBlocks.filter(b => b.needsVerification).map(b => b.index).sort(); if (JSON.stringify(flagged) !== '[2,5,6]') process.exit(1); console.log('ok'); })"` exits 0
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>methodology.ts type-checks; 7 blocks present in order with correct titles; blocks 2/5/6 have needsVerification:true; bodies verbatim from CONCEPT §8.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create src/content/values.ts (4 brand values) and src/content/company.ts (legal facts)</name>
  <files>src/content/values.ts, src/content/company.ts</files>
  <read_first>
    - src/data/types.ts (BrandValue interface)
    - brand-system.md §1 (4 values: системність · доцільність · надійність · довгострокова цінність)
    - КОНЦЕПЦІЯ-САЙТУ.md §2 (tone brief — same 4 values)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-17 (brandValues shape), D-18 (company consts)
    - .planning/PROJECT.md §Портфель (for legal consts: ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія 27.12.2019, email vygoda.sales@gmail.com)
  </read_first>
  <behavior>
    values.ts:
    - Exports `brandValues: BrandValue[]` with exactly 4 elements
    - Order: системність (index 0), доцільність (1), надійність (2), довгострокова цінність (3)
    - Every record has non-empty title + non-empty body; bodies are 1-3 sentences, brand-tone-compliant (стримано, без «мрія»/«найкращий»/«унікальний»/«преміальний стиль життя»)
    - @rule doc-block present; zero React/motion/component/hook imports

    company.ts:
    - Exports named consts: legalName, edrpou, licenseDate, licenseNote, email, socials
    - legalName === 'ТОВ «БК ВИГОДА ГРУП»'
    - edrpou === '42016395'
    - licenseDate === '27.12.2019'
    - licenseNote === '(безстрокова)'
    - email === 'vygoda.sales@gmail.com'
    - socials === { telegram: '#', instagram: '#', facebook: '#' }
    - @rule doc-block present; zero React/motion/component/hook imports
    - `npm run lint` passes
  </behavior>
  <action>
Step 1. Create `src/content/values.ts`:

```typescript
/**
 * @module content/values
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   Source of truth: brand-system.md §1 + CONCEPT §2. The 4 values are the
 *   brandbook surface — do NOT add a 5th value without client sign-off and
 *   a brandbook update. Tone: стримано, без «мрія», «найкращий»,
 *   «унікальний» (brand-system §1 forbidden lexicon).
 */

import type { BrandValue } from '../data/types';

export const brandValues: BrandValue[] = [
  {
    title: 'Системність',
    body: 'Архітектура, функціональність та інвестиційна доцільність — одна система. Рішення приймаються у зв’язку одне з одним, а не послідовно і розірвано.',
  },
  {
    title: 'Доцільність',
    body: 'Кожне рішення оцінюється за технічною обґрунтованістю, довгостроковим ресурсом і вартістю володіння. Дорожче — тільки якщо дає перевагу за цими критеріями.',
  },
  {
    title: 'Надійність',
    body: 'ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, безстрокова ліцензія на будівництво від 27.12.2019. Юридичний трек відкритий для перевірки через публічні реєстри.',
  },
  {
    title: 'Довгострокова цінність',
    body: 'Проектуємо середовище, яке зберігає цінність на горизонті десятиліть. Не оптимізуємо показники запуску за рахунок експлуатаційної якості.',
  },
];
```

Step 2. Create `src/content/company.ts`:

```typescript
/**
 * @module content/company
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   Source of truth: PROJECT.md §Context · Довіра-блок + NAV-01 footer
 *   requirements. These facts are LEGAL and MUST NOT drift — every footer,
 *   trust block, and methodology ref reads from here.
 *
 *   Socials are placeholders (href='#') per CTC-01 until client provides
 *   real URLs. Phase 4 ContactPage uses the same '#' convention.
 */

export const legalName = 'ТОВ «БК ВИГОДА ГРУП»' as const;
export const edrpou = '42016395' as const;
export const licenseDate = '27.12.2019' as const;
export const licenseNote = '(безстрокова)' as const;
export const email = 'vygoda.sales@gmail.com' as const;

/**
 * Social-media placeholders. Every href = '#' until launch (CTC-01).
 * Rendered with cursor-disabled styling and aria-label per channel.
 */
export const socials: {
  telegram: string;
  instagram: string;
  facebook: string;
} = {
  telegram: '#',
  instagram: '#',
  facebook: '#',
};
```

Typography note: use Ukrainian guillemets `«…»` around ТОВ name and typographic apostrophe `’` in `об’єкт` / `з’являються` (already present in values.ts body text).

Do NOT:
- Add a 5th brand value (brandbook surface is 4 — system is closed).
- Inline legal facts into a single frozen object — named consts make grep/refactor easier (RESEARCH §Named exports).
- Add a `socials.youtube` or similar — D-18 locks the 3-channel scaffold.
- Import lucide-react icon names here — those belong in the Footer / ContactPage components.
  </action>
  <acceptance_criteria>
    values.ts:
    - `test -f src/content/values.ts` passes
    - `grep -c "export const brandValues: BrandValue\\[\\]" src/content/values.ts` returns `1`
    - `grep -cE "title: 'Системність'|title: 'Доцільність'|title: 'Надійність'|title: 'Довгострокова цінність'" src/content/values.ts` returns `4`
    - `grep -c "@rule IMPORT BOUNDARY" src/content/values.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion" src/content/values.ts` returns `0`
    - `grep -cE "мрія|найкращий|унікальний|преміальний стиль життя" src/content/values.ts` returns `0` (forbidden lexicon per brand-system §1)
    - Derived (4 records): `node --input-type=module -e "import('./src/content/values.ts').then(m => { if (m.brandValues.length !== 4) process.exit(1); console.log('ok'); })"` exits 0

    company.ts:
    - `test -f src/content/company.ts` passes
    - `grep -c "export const legalName = 'ТОВ «БК ВИГОДА ГРУП»'" src/content/company.ts` returns `1`
    - `grep -c "export const edrpou = '42016395'" src/content/company.ts` returns `1`
    - `grep -c "export const licenseDate = '27.12.2019'" src/content/company.ts` returns `1`
    - `grep -c "export const licenseNote = '(безстрокова)'" src/content/company.ts` returns `1`
    - `grep -c "export const email = 'vygoda.sales@gmail.com'" src/content/company.ts` returns `1`
    - `grep -c "export const socials" src/content/company.ts` returns `1`
    - `grep -cE "telegram: '#'|instagram: '#'|facebook: '#'" src/content/company.ts` returns `3`
    - `grep -c "@rule IMPORT BOUNDARY" src/content/company.ts` returns `1`
    - `grep -cE "from ['\"]react['\"]|from ['\"]motion" src/content/company.ts` returns `0`
    - `npm run lint` exits 0 (covers both new files)
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>values.ts has 4 BrandValue records; company.ts has 6 named exports (5 legal consts + socials); both have doc-blocks; `npm run lint` passes.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Create src/content/placeholders.ts (single audit surface for §11 open items)</name>
  <files>src/content/placeholders.ts</files>
  <read_first>
    - КОНЦЕПЦІЯ-САЙТУ.md §11 (8 open client questions — lines 300–308)
    - .planning/phases/02-data-layer-content/02-CONTEXT.md D-19 (placeholders.ts exact consts + em-dash policy)
    - .planning/research/PITFALLS.md §Pitfall 12 (placeholder-vs-decision classification)
  </read_first>
  <behavior>
    - Exports named consts: `phone`, `address`, `pipeline4Title`, `etnoDimAddress`
    - phone === '—' (U+2014 em-dash, NOT two hyphens)
    - address === '—'
    - pipeline4Title === 'Без назви'
    - etnoDimAddress === '—'
    - File contains ZERO instances of `{{` or `}}` substrings (the whole point per D-19: raw em-dash is the public value)
    - @rule doc-block present
    - Zero imports of any kind (this is a leaf module — no types needed either, just strings)
    - `npm run lint` passes
  </behavior>
  <action>
Create `src/content/placeholders.ts` with this EXACT content:

```typescript
/**
 * @module content/placeholders
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/pages/ and src/components/sections/. Must NEVER import React, motion,
 *   components, hooks, or pages.
 *
 *   This file is the SINGLE AUDIT SURFACE for every open client question
 *   from КОНЦЕПЦІЯ-САЙТУ.md §11. A client / stakeholder opens this file and
 *   sees every pending answer as one named const with the current fallback.
 *
 *   POLICY (D-19): the public value is the raw em-dash «—» (U+2014). We
 *   NEVER render template-style tokens like {{phone}} in production HTML —
 *   CI denylist (scripts/check-brand.ts placeholderTokens() in Plan 02-05)
 *   greps dist/ for `{{` and fails the build.
 *
 *   Update policy: when client confirms a value, replace the «—» with the
 *   real string in this file. Consumers across pages + sections pick up the
 *   change in one build. No component touches needed.
 *
 *   Open items map to CONCEPT §11:
 *     - phone            → §11.1 (corporate phone, separate from Lakeview)
 *     - address          → §11.2 (юр. / поштова адреса)
 *     - pipeline4Title   → §11.3 (Pipeline-4 real name)
 *     - etnoDimAddress   → §11.8 (Etno Dim вул. Судова confirmation)
 */

/** Corporate phone (CONCEPT §11.1). Rendered on /contact and in footer microcopy. */
export const phone = '—';

/** Legal / postal address (CONCEPT §11.2). Rendered on /contact trust block. */
export const address = '—';

/**
 * Pipeline-4 public title (CONCEPT §11.3). Defaults to «Без назви» per D-06 /
 * D-19; also appears in src/data/projects.ts pipeline-4 record (duplicated for
 * runtime clarity — see RESEARCH Open Question 1). Update BOTH when client confirms.
 */
export const pipeline4Title = 'Без назви';

/** Etno Dim confirmed address (CONCEPT §11.8). Consumer: ZhkPage fact block. */
export const etnoDimAddress = '—';
```

Typographic check: every em-dash MUST be the Unicode character U+2014 `—`, NOT `-` (hyphen) or `--` (two hyphens). In this file there are 3 em-dashes in `export const … = '—'`.

Do NOT:
- Use `{{phone}}` / `{{address}}` / any `{{token}}` — the D-19 / QA-04 policy is explicit: raw em-dash is the public value; `{{` is a CI-denylist failure.
- Import anything (this is pure strings).
- Add a FORBIDDEN value like `'TBD'`, `'coming soon'`, `'???'` — em-dash is the audit-legible default.
- Add a `phone2` / `addressAlt` — one canonical per §11 item.
- Replace `pipeline4Title` with a function / hook — it's a static string until client confirms.
  </action>
  <acceptance_criteria>
    - `test -f src/content/placeholders.ts` passes
    - `grep -c "export const phone = '—'" src/content/placeholders.ts` returns `1`
    - `grep -c "export const address = '—'" src/content/placeholders.ts` returns `1`
    - `grep -c "export const pipeline4Title = 'Без назви'" src/content/placeholders.ts` returns `1`
    - `grep -c "export const etnoDimAddress = '—'" src/content/placeholders.ts` returns `1`
    - `grep -c "{{" src/content/placeholders.ts` returns `0` (zero template tokens — D-19 policy)
    - `grep -c "}}" src/content/placeholders.ts` returns `0`
    - `grep -cE "TODO|FIXME|TBD" src/content/placeholders.ts` returns `0` (no informal placeholders)
    - `grep -c "@rule IMPORT BOUNDARY" src/content/placeholders.ts` returns `1`
    - `grep -cE "^import" src/content/placeholders.ts` returns `0` (leaf module — no imports)
    - `npm run lint` exits 0
  </acceptance_criteria>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>placeholders.ts has 4 named string consts with em-dash values (3) and «Без назви» (1); zero imports; zero template tokens; doc-block present; `npm run lint` passes.</done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. `npm run lint` — exits 0 (all 4 content modules type-check)

2. Content integrity check via node:
   ```bash
   node --input-type=module -e "
   Promise.all([
     import('./src/content/methodology.ts'),
     import('./src/content/values.ts'),
     import('./src/content/company.ts'),
     import('./src/content/placeholders.ts'),
   ]).then(([m, v, c, p]) => {
     if (m.methodologyBlocks.length !== 7) process.exit(1);
     if (JSON.stringify(m.methodologyBlocks.filter(b => b.needsVerification).map(b => b.index).sort()) !== '[2,5,6]') process.exit(2);
     if (v.brandValues.length !== 4) process.exit(3);
     if (c.edrpou !== '42016395') process.exit(4);
     if (c.email !== 'vygoda.sales@gmail.com') process.exit(5);
     if (Object.values(c.socials).some(v => v !== '#')) process.exit(6);
     if (p.phone !== '—' || p.address !== '—' || p.etnoDimAddress !== '—') process.exit(7);
     if (p.pipeline4Title !== 'Без назви') process.exit(8);
     console.log('content modules OK');
   })"
   ```
   Exit 0 = pass. Non-zero = specific invariant violation.

3. Boundary pre-check (early proof for Plan 05 importBoundaries):
   ```bash
   grep -rE "from ['\"]react['\"]|from ['\"]motion|from ['\"].*components[/'\"]|from ['\"].*hooks[/'\"]|from ['\"].*pages[/'\"]" src/content/
   # Expected: empty output (exit 1 from grep)
   ```

Commit boundary (per CONTEXT.md <specifics> — commit 3 of 4):
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(02): add content modules (methodology, values, company, placeholders)" --files src/content/methodology.ts src/content/values.ts src/content/company.ts src/content/placeholders.ts
```
</verification>

<success_criteria>
- [ ] src/content/methodology.ts exports 7 blocks, blocks 2/5/6 have needsVerification:true, bodies verbatim from CONCEPT §8
- [ ] src/content/values.ts exports 4 BrandValue records in canonical order; no forbidden lexicon
- [ ] src/content/company.ts exports 6 named consts (legalName, edrpou=42016395, licenseDate=27.12.2019, licenseNote, email, socials)
- [ ] src/content/placeholders.ts exports 4 named consts (phone='—', address='—', pipeline4Title='Без назви', etnoDimAddress='—'); zero `{{` tokens
- [ ] All 4 modules have @rule IMPORT BOUNDARY doc-block (D-34)
- [ ] All 4 modules have zero React/motion/component/hook/page imports
- [ ] `npm run lint` exits 0
- [ ] Files committed with single atomic commit
</success_criteria>

<output>
After completion, create `.planning/phases/02-data-layer-content/02-04-SUMMARY.md`. Key fields:
- `affects`: [content]
- `provides`: [methodologyBlocks (7), brandValues (4), legalName, edrpou, licenseDate, licenseNote, email, socials, phone, address, pipeline4Title, etnoDimAddress]
- `patterns`: [editorial-only under src/content/ (D-15), verbatim CONCEPT §8 bodies, ⚠-flag on blocks 2/5/6 (D-16), single audit surface for §11 open items (D-19), raw em-dash not {{token}} (D-19), 4-module-split over single content/index.ts (D-15)]
</output>
