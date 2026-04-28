/**
 * @module content/projects
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported
 *   from src/pages/ and src/components/sections/. Must NEVER import React,
 *   motion, components, hooks, or pages.
 *
 *   Source of truth for /projects page chrome.
 *
 *   Tone: стримано, предметно (CONCEPT §2). No marketing claims.
 *   Forbidden lexicon enforced by scripts/check-brand.ts denylistTerms.
 */

/** Page H1 — matches Nav label (D-01). */
export const projectsHeading = 'Проєкти';

/** Muted subtitle — honest 0/1/4 count (D-01). Per AUDIT-COPY §4.3: drop
 *  English «pipeline» for «у розробці»; tighter. Middle-dot is U+00B7,
 *  identical literal to home portfolioSubtitle for visual parity. */
export const projectsSubtitle = '1 будується · 4 у розробці · 0 здано';

/** Empty-state line under the single-cube marker for the zero-delivered bucket (D-09).
 *  Per AUDIT-COPY §4.12: turn the «0 здано» from apologetic «наразі» to
 *  confident statement of policy + concrete first-delivery anchor. */
export const zdanoEmptyMessage = '0 здано — це політика. Перший — Lakeview, 2027.';

/** Pointer line — directs reader to the flagship above (D-08).
 *  Per AUDIT-COPY §4.13: name the project + add scope qualifier «єдиний».
 *  Trailing arrow is U+2191 UPWARDS ARROW. */
export const buduetsyaPointerMessage = 'Єдиний ЖК у будівництві — Lakeview ↑';

/** Browser-tab title for `/projects` route. Phase 6 D-18 format
 *  «{Page} — ВИГОДА». */
export const pageTitle = 'Проєкти — ВИГОДА';

// ─────────────────────────────────────────────────────────────────────
// Registry redesign (Apr-2026) — six-section composition
// ─────────────────────────────────────────────────────────────────────

/** Masthead overline — date-stamps the registry. Update ad-hoc when the
 *  portfolio changes; the date is part of the «це реєстр, не маркетинг»
 *  signal — a marketing page wouldn't have a freshness stamp. */
export const mastheadOverline = 'Портфель ВИГОДА · оновлено 04 / 2026';

/** Display H1 of the masthead. Number-form (not «П'ять») picked for
 *  registry/tabular tone — matches the cube-ladder counting language. */
export const mastheadHeading = '5 проєктів';

/** Triplet labels under the masthead H1 — three dt/dd-style pairs.
 *  Number first, label second; tabular-nums on the digit. */
export const mastheadCounts: ReadonlyArray<{ value: string; label: string }> = [
  { value: '0', label: 'здано' },
  { value: '1', label: 'у будівництві' },
  { value: '4', label: 'у розробці' },
];

/** Right-column policy paragraph — frames the portfolio as a registry,
 *  not a marketing roster. Two sentences, em-dash allowed (Ukrainian
 *  typography per DESIGN.md override). */
export const mastheadPolicy =
  'Реєстр оновлюється повільно. Кожен об’єкт відкриваємо публічно лише після завершеного кошторису — це наша норма.';

/** Section overline above FlagshipCard. Pairs «01/05» numeral series
 *  with the project's stage label. */
export const flagshipSectionOverline = '01 / 05 · Активне будівництво';

/** Section overline above StageFilter chips. */
export const filterSectionOverline = 'Фільтр за стадіями';

/** Closing-note copy — final editorial line linking to the methodology
 *  section on home (anchored via #methodology on /). */
export const closingNoteText =
  'Як ми приймаємо рішення про публікацію — у розділі методології.';
export const closingNoteLinkLabel = 'Методологія →';
export const closingNoteLinkHref = '/#methodology';
