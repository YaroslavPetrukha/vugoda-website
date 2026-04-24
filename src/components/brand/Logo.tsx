// Canonical brand logo — dark-background version per VIS-04 + D-05.
// Imported from brand-assets/ via vite-plugin-svgr's ?react query.
// NEVER re-author the SVG paths in this file (PITFALLS.md §Anti-Pattern 4) —
// the brand-assets SVG is the source of truth; when designers reissue, this
// component auto-updates.
import DarkLogoSvg from '../../../brand-assets/logo/dark.svg?react';

export interface LogoProps {
  /** Additional classes (e.g. sizing: h-8, h-10). */
  className?: string;
  /** Accessible name; defaults to brand wordmark. */
  title?: string;
}

/**
 * Dark-version logo wordmark + cube + petals (descriptor).
 * Renders on dark backgrounds (#2F3640, #020A0A). Охоронне поле
 * (clear-space) is the cap-height of «В» — parent must provide padding.
 */
export function Logo({ className, title = 'ВИГОДА' }: LogoProps) {
  return <DarkLogoSvg className={className} title={title} aria-label={title} role="img" />;
}
