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

/** Hero data-counter — top-left overline strip (P1-D1).
 *  Brand-faithful 0/1/4 stat tile, complements the slogan below without
 *  duplicating its sentence rhythm. Caption tone, not narrative. */
export const heroCounter = '1 активний · 4 у розробці · 0 зданих';

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

/** Hero secondary CTA label — navigates to /contact (P1-D1).
 *  Underlined-on-hover, sits next to primary bg-accent CTA. */
export const heroSecondaryCta = 'Контакт';

/** PortfolioOverview overline strip — small uppercase caption above H2
 *  (P1-D3, AUDIT-DESIGN §9.3). Tabular factual frame: «1 + 4» mirrors
 *  the 0/1/4 honesty (1 active + 4 in pipeline) without repeating the
 *  exact subtitle wording. Middle-dot is U+00B7. */
export const portfolioOverline = 'Портфель · 1 + 4 · Львів';

/** PortfolioOverview section heading — matches Nav label «Проєкти» (D-13). */
export const portfolioHeading = 'Проєкти';

/** BrandEssence overline + heading — manifesto-block frame (P1-D2).
 *  Heading ties to Доцільність value «кожне рішення оцінюється…» without
 *  using forbidden lexicon. Declarative, brand-faithful per §1. */
export const brandEssenceOverline = 'Бренд-есенція · 04';
export const brandEssenceHeading = 'Чотири принципи, що формують кожне рішення.';

/** PortfolioOverview muted subtitle — honest 0/1/4 count (D-13).
 *  Per AUDIT-COPY §4.3: drop English «pipeline» for «у розробці»; tighter.
 *  Middle-dot is U+00B7. */
export const portfolioSubtitle = '1 будується · 4 у розробці · 0 здано';

/** Flagship card external CTA — opens Lakeview site in new tab (D-14).
 *  Per AUDIT-COPY §4.4: name the project rather than say «перейти».
 *  Trailing arrow is U+2197 NORTH EAST ARROW. */
export const flagshipExternalCta = 'Сайт ЖК Lakeview ↗';

/** ConstructionTeaser CTA — navigates to /construction-log (HOME-04).
 *  Per AUDIT-COPY §4.5: drop English «таймлайн» for «місяці зйомок» (a hint
 *  at monthly cadence — brand signal for «we shoot regularly»).
 *  Trailing arrow is U+2192 RIGHTWARDS ARROW (typographic glyph, not ASCII >),
 *  baked into the constant so the JSX call site renders the literal verbatim
 *  (parity with flagshipExternalCta U+2197 ↗ pattern; Phase 3 D-29 / QC-3). */
export const constructionTeaserCta = 'Усі місяці зйомок →';

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

/** ContactForm h2 — section heading on bg-bg-black closer
 *  (Phase 3 D-29 / checker Warning 8). Per AUDIT-COPY §4.6: drop fake-friendly
 *  «поговоримо» for three concrete reasons — predметно, brand-faithful. */
export const contactHeading = 'Розрахунок, термін, або співпраця';

/** ContactForm body — short invitational paragraph above the mailto button
 *  (Phase 3 D-29 / checker Warning 8). Per AUDIT-COPY §4.7: drop «без
 *  зобов’язань» (страхово-захисний tone), use confident promise of action.
 *  Apostrophe is U+2019; em-dash is U+2014. */
export const contactBody = 'Розкажіть про задачу — повернемось із розрахунком, термінами, варіантами участі.';

/** Browser-tab title for `/` route. Phase 6 D-18: root keeps verbatim
 *  no-`«{Page} —» ВИГОДА` prefix form (matches og:title at root).
 *  Per AUDIT-COPY §4.24: localize tab-title with «Львівський забудовник»
 *  for SEO + brand-tab signal. */
export const pageTitle = 'ВИГОДА — Львівський забудовник';
