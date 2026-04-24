// Canonical brand logo — dark-background version per VIS-04 + D-05.
// Imported from brand-assets/ via vite-plugin-svgr's ?react query.
// NEVER re-author the SVG paths in this file (PITFALLS.md §Anti-Pattern 4) —
// the brand-assets SVG is the source of truth; when designers reissue, this
// component auto-updates.
import darkLogoUrl from '../../../brand-assets/logo/dark.svg';

export interface LogoProps {
  className?: string;
  title?: string;
}

export function Logo({ className, title = 'ВИГОДА' }: LogoProps) {
  return <img src={darkLogoUrl} alt={title} className={className} />;
}
