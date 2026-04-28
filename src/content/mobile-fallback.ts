/**
 * @module content/mobile-fallback
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/ and src/components/layout/.
 *   Must NEVER import React, motion, components, hooks, or pages.
 *
 *   Source of truth for the QA-01 mobile-fallback page rendered when
 *   useMatchMedia('(max-width: 1023px)') returns true (Phase 6 D-04).
 *
 *   Layout (D-04 verbatim):
 *     - Logo (dark.svg, ~120px wide, 32px top margin)
 *     - Wordmark «ВИГОДА» (Montserrat 700 ~48px) — rendered as TEXT in
 *       the React component, NOT pre-pathed (pre-pathing only matters
 *       for sharp SVG→PNG export; in-browser DOM has @fontsource/montserrat
 *       cyrillic-700.css loaded so live render is fine)
 *     - Body text (max-w-[20ch], text-text-muted #A7AFBC, ≥14pt for
 *       WCAG AA contrast on #2F3640 bg per Phase 1 D-21)
 *     - Mailto link (accent-fill #C1F33D — never on light bg, dark bg here)
 *     - 40%-width divider (#A7AFBC opacity 0.2)
 *     - 4 CTA links stacked, text-only, focus-visible accent underline
 *     - Footer juridical block (one column, no 3-col Footer treatment)
 *
 *   Tone (CONCEPT §2): стримано, без хвастощів. No marketing claims.
 *   No "view desktop anyway" override (D-05 — terminal state).
 *
 *   CTA hrefs (D-06):
 *     - 3 internal CTAs are clean paths consumed by Router <Link>
 *       (P1-UX1 BrowserRouter migration). They navigate to the same
 *       fallback at <1024px (no real content), but exist for visual
 *       signal that the site has structure AND so a later desktop
 *       open of the same URL goes straight to the right page.
 *       The renderer prefixes basename automatically via <Link>.
 *     - 1 external Lakeview CTA opens the Lakeview marketing site
 *       in a new tab (Lakeview handles its own mobile responsive)
 */

/** Body copy — single paragraph, max-w-[20ch] in component (Phase 6 D-04).
 *  Per AUDIT-COPY §4.19: shift from «йди звідси» bouncer-tone to
 *  bridge-tone «у нас є план, ви в ньому є». Не виключаємо mobile-юзера —
 *  пояснюємо маршрут. */
export const fallbackBody =
  'Десктоп-версія готова. Мобільна — у розробці. Зайдіть з ноутбука або напишіть — обговоримо все звідти.';

/** Email — accent-fill mailto link in component. Same email as company.email
 *  but exported here as a literal so the mobile-fallback module is fully
 *  self-contained (no cross-import, simpler audit). */
export const fallbackEmail = 'vygoda.sales@gmail.com';

/** 4 CTA links in display order (D-04 ASCII layout + D-06 hrefs).
 *  Per AUDIT-COPY §4.20: each CTA carries one extra info-bit beyond the
 *  section name (count, scope, function, status). Mobile user learns
 *  something, doesn't just see a navigation list. */
export const fallbackCtas: ReadonlyArray<{
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}> = [
  { label: 'Проєкти (5 штук) →',           href: '/projects',         external: false },
  { label: 'Хід будівництва (Lakeview) →', href: '/construction-log', external: false },
  { label: 'Написати нам →',                href: '/contact',          external: false },
  { label: 'Lakeview — окремий сайт ↗',     href: 'https://yaroslavpetrukha.github.io/Lakeview/', external: true },
] as const;
