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
 *   (forbidden lexicon enforced by scripts/check-brand.ts denylistTerms +
 *   plan-level grep — see brand-system.md §1).
 *   Adding new microcopy here = preferred over inline JSX literals
 *   (Phase 2 D-20 / Phase 3 D-29).
 */

/** Hero wordmark — lowercase, brand-faithful per concept §5.3 + brandbook
 *  duo-bren rule (AUDIT-DESIGN §4.3). The wordmark «вигода» sits at top-of-
 *  hero in clamp(120px,14vw,240px) Bold, letter-by-letter mask-revealed at
 *  load. Lowercase resolves the duo-brand mismatch (logo is lowercase, prior
 *  hero rendered ВЕЛИКИМИ — broke the pair). */
export const heroWordmark = 'вигода';

/** Hero data-counter — top-left overline strip (P1-D1, deprecated W7).
 *  Retained for backwards-compat; replaced by per-stat tokens below
 *  (heroStatActive · heroStatPipeline · heroStatDelivered) in W7 hybrid
 *  hero rebuild ($impeccable layout). DO NOT consume in new code. */
export const heroCounter = 'ЛЬВІВ · 1 АКТИВНИЙ · 4 У РОЗРОБЦІ · 0 ЗДАНО';

/** Hero photo caption — names the right-half aerial render in W7
 *  asymmetric hero layout. Sits at the bottom-right of the photo column,
 *  small overline tier. Names the project + city + status so the image
 *  is captioned, not floating. */
export const heroLocation = 'Lakeview · Винники · в активному будівництві';

/** Hero edge label — vertical-rl rotated label on far-left edge of hero
 *  (W7 hybrid layout). Single-word locale anchor; uppercase tracked.
 *  Pattern 8 from AUDIT-DESIGN — sticky-side label primitive. */
export const heroEdgeLabel = 'ЛЬВІВ · UA-46';

/** Hero portfolio overline — small caption above the display stats
 *  (W7 hybrid). Names what the «01 / 04 / 00» numerals report — the
 *  full ВИГОДА portfolio at the listed reference year. Without this
 *  framing the numerals read as decoration. */
export const heroPortfolioOverline = 'Портфель ВИГОДА · станом на 2026';

/** Hero display stats — three numerals at display tier in W7 hybrid hero.
 *  Padded with leading zero so the trio reads as a tabular fact-row, not
 *  three independent counters. Order matches reading flow:
 *  active → pipeline → delivered. Honest 1·4·0 portfolio truth. */
export const heroStatActive = '01';
export const heroStatPipeline = '04';
export const heroStatDelivered = '00';

/** Hero stat labels — small overline below each numeral, names the
 *  category. Lowercase by brand convention (overline pattern uppercase
 *  via CSS). Kept short so the trio reads at a glance. */
export const heroStatActiveLabel = 'активний';
export const heroStatPipelineLabel = 'у розробці';
export const heroStatDeliveredLabel = 'здано';

/** Hero descriptor — sub-line under the small wordmark signature at
 *  bottom of the LEFT column. The brand descriptor «системний девелопмент»
 *  is the canonical phrase under the logo per brandbook §2 — when
 *  wordmark appears, descriptor follows. */
export const heroDescriptor = 'системний девелопмент';

/** Hero slogan — split into two pieces for mixed-weight rendering
 *  (AUDIT-DESIGN §4.2 + §9.1). The leading clause (Bold) loads the
 *  argument; the trailing clause (Medium) softens it. Concatenated with
 *  a space when read by screen-readers via aria-label.
 *
 *  Content per AUDIT-COPY §4.1 variant C — 0/1/4 stinger that names
 *  the honest portfolio truth in one sentence. Em-dash is U+2014. */
export const heroSloganLead = '1 ЖК у будівництві.';
export const heroSloganTail = '4 — на стадії розрахунків і дозволів. 0 — для вітрини.';

/** Backwards-compat: full slogan string for screen-reader aria-label and
 *  any legacy consumers. Equal to heroSloganLead + ' ' + heroSloganTail. */
export const heroSlogan = `${heroSloganLead} ${heroSloganTail}`;

/** Hero primary CTA label — navigates to /projects (Phase 3 D-05).
 *  Per AUDIT-COPY §4.2: scoped count carries more weight than generic verb. */
export const heroCta = 'Усі 5 проєктів';

/** Hero secondary CTA label — opens ContactPopup (W8 audit fix).
 *  Was «Контакт» (dead noun, no action). Replaced with verb-phrase that
 *  names what happens on click — user expects question-flow, not a
 *  contact-info dump. Trailing arrow U+2192 matches other site CTAs. */
export const heroSecondaryCta = 'Поставити запитання →';

/** PortfolioOverview overline strip — small uppercase caption above H2
 *  (P1-D3, AUDIT-DESIGN §9.3). Tabular factual frame: «1 + 4» mirrors
 *  the 0/1/4 honesty (1 active + 4 in pipeline) without repeating the
 *  exact subtitle wording. Middle-dot is U+00B7. */
export const portfolioOverline = 'Портфель · 1 + 4 · Львів';

/** PortfolioOverview section heading — matches Nav label «Проєкти» (D-13). */
export const portfolioHeading = 'Проєкти';

/** BrandEssence overline + heading — manifesto-block frame (P1-D2, W8 fix).
 *  «Бренд-есенція» dropped as marketing-cliché (audit-copy round 2). New
 *  overline names the section literally: principles, count of 04. New
 *  heading «На чому стоїмо.» — declarative, three syllables, no template
 *  filler. Replaces «Чотири принципи, що формують кожне рішення.» (which
 *  was a textbook AI-slop heading: number + abstract noun + verb + abstract
 *  object). */
export const brandEssenceOverline = 'ПРИНЦИПИ · 04';
export const brandEssenceHeading = 'На чому стоїмо.';

/** PortfolioOverview muted subtitle — honest 0/1/4 count (D-13).
 *  Per AUDIT-COPY §4.3: drop English «pipeline» for «у розробці»; tighter.
 *  Middle-dot is U+00B7. */
export const portfolioSubtitle = '1 будується · 4 у розробці · 0 здано';

/** Flagship card external CTA — opens Lakeview site in new tab (D-14).
 *  Per AUDIT-COPY §4.4: name the project rather than say «перейти».
 *  Trailing arrow is U+2197 NORTH EAST ARROW. */
export const flagshipExternalCta = 'Сайт ЖК Lakeview ↗';

/** ConstructionLogPage overline + heading — editorial frame (P1-D8).
 *  Bumped from inline JSX literal «Хід будівництва Lakeview» H1 to a
 *  display-sized H1 framed by an overline. The overline names the
 *  «LIVE · LAKEVIEW» context (mirrors the home ConstructionTeaser
 *  vocabulary so a returning visitor reads continuity). */
export const constructionLogOverline = 'ХІД БУДІВНИЦТВА · LAKEVIEW';
export const constructionLogHeading = 'Місяці зйомок';

/** MethodologyTeaser overline + heading — editorial frame (P1-D5).
 *  Shows the curated «3 / 8» count so the visitor reads «we picked the
 *  three blocks worth featuring on home», not «we listed everything».
 *  H2 stays «Як ми будуємо» (existing) — declarative, brand-faithful. */
export const methodologyOverline = 'Методологія · 3 / 8';
export const methodologyHeading = 'Як ми будуємо';

/** TrustBlock heading — bumped from inline string to content token for
 *  Phase 3 D-29 boundary (P1-D6). Existing copy preserved. */
export const trustHeading = 'Юридично та операційно';

/** TrustBlock overline — added in W5 (audit P1-S5: Trust expansion 3→6).
 *  Editorial frame mirrors other home sections + names the "6 проявів"
 *  count so visitor reads "this is the proof grid", not generic info row. */
export const trustOverline = 'ДОВІРА · 6 ПРОЯВІВ';

/** TrustBlock column labels — moved from inline JSX literals to tokens
 *  for Phase 3 D-29 boundary discipline (P1-D6). Each column gets a
 *  pictograph icon now; the label below stays as-is.
 *  W5 expansion adds 3 more cells: Років · Класс наслідків · Реквізити. */
export const trustLabelLegal = 'Юр. особа';
export const trustLabelLicense = 'Ліцензія';
export const trustLabelContact = 'Контакт';
export const trustLabelYears = 'Років на ринку';
export const trustLabelConsequence = 'Клас наслідків';
export const trustLabelDocuments = 'Реквізити';

/** TrustBlock years cell — note under CountUp showing years since license.
 *  Honest framing: "ліцензія з 2019" so reader sees the actual anchor
 *  date, not a vanity-metric headline. */
export const trustYearsNote = 'ліцензія з 2019';

/** TrustBlock documents cell — placeholder until the official requisites
 *  PDF is provisioned. Keeps the cell honest about what's coming, not
 *  promising a download that doesn't exist (CONTEXT.md §6.13 "сертифікати
 *  + реквізити-pdf — корисно (деталі)"). */
export const trustDocumentsValue = 'Реквізити-PDF';
export const trustDocumentsNote = 'Запит реквізитів — на email нижче. PDF готується.';

/** ConstructionTeaser CTA — navigates to /construction-log (HOME-04).
 *  Per AUDIT-COPY §4.5: drop English «таймлайн» for «місяці зйомок» (a hint
 *  at monthly cadence — brand signal for «we shoot regularly»).
 *  Trailing arrow is U+2192 RIGHTWARDS ARROW (typographic glyph, not ASCII >),
 *  baked into the constant so the JSX call site renders the literal verbatim
 *  (parity with flagshipExternalCta U+2197 ↗ pattern; Phase 3 D-29 / QC-3). */
export const constructionTeaserCta = 'Усі місяці зйомок →';

/** ConstructionTeaser live-caption — LIVE label with pulsing dot
 *  (P1-D4, AUDIT-DESIGN §9.4). The «БУДІВНИЦТВО» trailing word names
 *  the activity, while «LIVE» signals fresh-feed cadence. Middle-dot U+00B7. */
export const constructionLiveLabel = 'LIVE · БУДІВНИЦТВО';

/** ConstructionTeaser location line — names the project + city below the
 *  LIVE caption (P1-D4). Connects the construction feed to the flagship
 *  ЖК so the visitor reads «we're shooting Lakeview right now», not
 *  «generic stock construction». Middle-dot U+00B7. */
export const constructionLocationLine = 'ЖК Lakeview · Львів';

/** ContactForm primary CTA — opens mailto: (HOME-07 / D-29).
 *  Per AUDIT-COPY §4.8: drop canceloriately-juridical «Ініціювати діалог»
 *  for human «Написати команді». */
export const contactCta = 'Написати команді';

/** MethodologyTeaser defensive ⚠-marker aria-label — used when a featured
 *  block has needsVerification: true (Phase 3 D-29 / checker Warning 6). */
export const methodologyVerificationWarning = 'Потребує верифікації';

/** TrustBlock col 2 — license-scope caption under «від {date} (безстрокова)»
 *  (Phase 3 D-29 / checker Warning 7). Per AUDIT-COPY §4.11: trim verbose
 *  literal-license-clause to a punchy stripped-tone sentence. */
export const licenseScopeNote = 'Будівельна ліцензія, безстроково.';

/** TrustBlock col 3 — contact-channel caption under email anchor
 *  (Phase 3 D-29 / checker Warning 7). Per AUDIT-COPY §4.10: directional +
 *  honest about other channels. Em-dash is U+2014. */
export const contactNote = 'Усі запити — сюди. Інші канали в розробці.';

/** ContactForm overline + heading on bg-bg-black closer (P1-cleanup, W8 fix).
 *  «3 ПРИВОДИ» dropped — homonym («приводи» = leashes vs. occasions, only
 *  the latter intended). Replaced with city-anchor «ЛЬВІВ» mirroring
 *  contactPageOverline format on /contact route — single overline grammar
 *  across both contact surfaces. */
export const contactOverline = 'КОНТАКТ · ЛЬВІВ';

/** ContactForm h2 — section heading on bg-bg-black closer
 *  (Phase 3 D-29 / checker Warning 8). Per AUDIT-COPY §4.6: drop fake-friendly
 *  «поговоримо» for three concrete reasons — predметно, brand-faithful. */
export const contactHeading = 'Розрахунок, термін, або співпраця';

/** ContactForm body — short invitational paragraph above the mailto button
 *  (Phase 3 D-29 / checker Warning 8, W8 audit-copy round 2).
 *  Was «Розкажіть про задачу — повернемось із розрахунком, термінами,
 *  варіантами участі.» — flagged as B2B-tendering register + verbatim
 *  duplicate of popupSubheading. New form: human imperative «Опишіть, що
 *  цікавить» + concrete service-level «протягом 24 годин у робочі дні».
 *  Apostrophe is U+2019; em-dash is U+2014. */
export const contactBody = 'Опишіть, що цікавить — повернемось із цифрами і строками протягом 24 годин у робочі дні.';

/** Browser-tab title for `/` route. Phase 6 D-18: root keeps verbatim
 *  no-`«{Page} —» ВИГОДА` prefix form (matches og:title at root).
 *  Per AUDIT-COPY §4.24: localize tab-title with «Львівський забудовник»
 *  for SEO + brand-tab signal. */
export const pageTitle = 'ВИГОДА — Львівський забудовник';
