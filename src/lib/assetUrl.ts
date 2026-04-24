/**
 * @module lib/assetUrl
 * @rule Pure utility module. No React imports, no motion imports, no component
 *   imports. All asset URL construction goes through these helpers to ensure
 *   BASE_URL prefix correctness. Vite sets import.meta.env.BASE_URL =
 *   '/vugoda-website/' in prod and '/' in dev (see vite.config.ts base option).
 *   Never hardcode '/renders/…' or '/construction/…' in JSX — always go through
 *   renderUrl() / constructionUrl(). Enforced by scripts/check-brand.ts
 *   importBoundaries() — see Plan 02-05.
 */

const BASE = import.meta.env.BASE_URL;

/**
 * Generic asset URL helper. Prepends BASE_URL and strips any leading slash on
 * the input so callers can use either 'foo/bar.svg' or '/foo/bar.svg' safely.
 * Prefer the domain-specific helpers renderUrl / constructionUrl for the
 * /renders/ and /construction/ trees — they're more refactor-proof.
 */
export const assetUrl = (path: string): string =>
  `${BASE}${path.replace(/^\//, '')}`;

/**
 * Build a URL for a project render image. Slug is the translit folder name
 * (e.g. 'lakeview', 'etno-dim'). File is a filename from project.renders[].
 * Consumers: <FlagshipCard>, <PipelineCard>, <ZhkHero>, <ZhkGallery> (Phase 3/4).
 */
export const renderUrl = (slug: string, file: string): string =>
  `${BASE}renders/${slug}/${file}`;

/**
 * Build a URL for a construction-log photo. Month is an ASCII key
 * (e.g. 'mar-2026'). File is a filename from ConstructionMonth.photos[].file.
 * Consumers: <ConstructionTeaser>, <ConstructionLogPage> (Phase 3/4).
 */
export const constructionUrl = (month: string, file: string): string =>
  `${BASE}construction/${month}/${file}`;
