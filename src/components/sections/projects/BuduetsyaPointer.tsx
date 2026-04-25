/**
 * @module components/sections/projects/BuduetsyaPointer
 *
 * HUB-01 — «Будується» pointer (D-08). Rendered by ProjectsPage when
 * active stage filter === 'buduetsya'. The only buduetsya project IS
 * Lakeview, but Lakeview renders as the flagship ABOVE the filter, so
 * this component tells the user honestly: «look up».
 *
 * aria-live="polite" so screen readers announce the dispatch when user
 * clicks the «Будується» chip.
 *
 * The U+2191 «↑» glyph already signals direction; no arrow icon needed
 * (CLAUDE.md no-decorative-flourishes constraint).
 */

import { buduetsyaPointerMessage } from '../../../content/projects';

export function BuduetsyaPointer() {
  return (
    <div
      className="flex items-center justify-center py-16 lg:py-24"
      aria-live="polite"
      role="status"
    >
      <p className="text-base text-text-muted">{buduetsyaPointerMessage}</p>
    </div>
  );
}
