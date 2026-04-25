/**
 * @module components/sections/projects/EmptyStateZdano
 *
 * HUB-01 — «Здано (0)» empty-state cube + line (D-09). Rendered by
 * ProjectsPage when active stage filter === 'zdano'. Cube-ladder
 * semantics (CONCEPT §5.2): single = empty-state focal marker,
 * larger than the aggregate-row decorative cube to claim the bucket.
 *
 * Stroke '#A7AFBC' + opacity 0.4 — palette-whitelisted, brandbook
 * 5-60% opacity range, on the muted side (non-foreground signal
 * communicating «зрозуміло, що тут пусто»).
 */

import { IsometricCube } from '../../brand/IsometricCube';
import { zdanoEmptyMessage } from '../../../content/projects';

export function EmptyStateZdano() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <IsometricCube variant="single"
        stroke="#A7AFBC"
        opacity={0.4}
        className="h-24 w-24"
      />
      <p className="text-base text-text-muted">{zdanoEmptyMessage}</p>
    </div>
  );
}
