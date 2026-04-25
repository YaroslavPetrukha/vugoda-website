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

/** Hero gasло — verbatim from КОНЦЕПЦІЯ-САЙТУ.md §2 + brand-system.md §1.
 *  Keep typographic apostrophe (U+2019) and end punctuation. */
export const heroSlogan = 'Системний девелопмент, у якому цінність є результатом точних рішень.';

/** Hero CTA label — navigates to /projects (Phase 3 D-05). */
export const heroCta = 'Переглянути проекти';

/** PortfolioOverview section heading — matches Nav label «Проєкти» (D-13). */
export const portfolioHeading = 'Проєкти';

/** PortfolioOverview muted subtitle — honest 0/1/4 count (D-13).
 *  Middle-dot is U+00B7. */
export const portfolioSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

/** Flagship card external CTA — opens Lakeview site in new tab (D-14).
 *  Trailing arrow is U+2197 NORTH EAST ARROW. */
export const flagshipExternalCta = 'Перейти на сайт проекту ↗';

/** ConstructionTeaser CTA — navigates to /construction-log (HOME-04).
 *  Trailing arrow is U+2192 RIGHTWARDS ARROW (typographic glyph, not ASCII >),
 *  baked into the constant so the JSX call site renders the literal verbatim
 *  (parity with flagshipExternalCta U+2197 ↗ pattern; Phase 3 D-29 / QC-3). */
export const constructionTeaserCta = 'Дивитись повний таймлайн →';

/** ContactForm primary CTA — opens mailto: (HOME-07 / D-29). */
export const contactCta = 'Ініціювати діалог';

/** MethodologyTeaser defensive ⚠-marker aria-label — used when a featured
 *  block has needsVerification: true (Phase 3 D-29 / checker Warning 6). */
export const methodologyVerificationWarning = 'Потребує верифікації';

/** TrustBlock col 2 — license-scope caption under «від {date} (безстрокова)»
 *  (Phase 3 D-29 / checker Warning 7). */
export const licenseScopeNote = 'на провадження господарської діяльності з будівництва';

/** TrustBlock col 3 — contact-channel caption under email anchor
 *  (Phase 3 D-29 / checker Warning 7). Em-dash is U+2014. */
export const contactNote = 'Звернення з усіх питань — на цю адресу';

/** ContactForm h2 — section heading on bg-bg-black closer
 *  (Phase 3 D-29 / checker Warning 8). Apostrophe is U+2019 right single quote. */
export const contactHeading = 'Поговоримо про ваш об’єкт';

/** ContactForm body — short invitational paragraph above the mailto button
 *  (Phase 3 D-29 / checker Warning 8). Apostrophe is U+2019; em-dash is U+2014. */
export const contactBody = 'Напишіть нам — обговоримо запит, опції, графік. Без зобов’язань.';
