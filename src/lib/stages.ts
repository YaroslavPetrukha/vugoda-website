/**
 * @module lib/stages
 * @rule IMPORT BOUNDARY: Pure utility module. No React imports, no motion
 *   imports, no component imports. Type-only import from `../data/types`.
 *
 *   Single source of truth for Stage → Ukrainian label mapping (D-11).
 *   Consumers: StageFilter chips, ZhkFactBlock fact rows, PipelineCard
 *   stage badges (Phase 4 /projects, /zhk/etno-dim, /dev/grid).
 *
 *   Unknown-stage fallback returns em-dash «—» (U+2014) per D-11 + D-42 +
 *   Phase 2 D-19 placeholder rule. This makes /dev/grid stress-test
 *   robust against any future cast-through bug — chip renders «—» instead
 *   of throwing or rendering empty string.
 */

import type { Stage } from '../data/types';

/** Canonical chip order on /projects per D-03 + CONCEPT §6.1 Model-Б. */
export const STAGES = ['u-rozrakhunku', 'u-pogodzhenni', 'buduetsya', 'zdano'] as const satisfies readonly Stage[];

const LABELS: Record<Stage, string> = {
  'u-rozrakhunku': 'У розрахунку',
  'u-pogodzhenni': 'У погодженні',
  'buduetsya':     'Будується',
  'zdano':         'Здано',
};

/** Stage → Ukrainian label. Unknown stage returns em-dash per D-11 + D-42. */
export function stageLabel(stage: Stage | string | undefined): string {
  if (stage && stage in LABELS) return LABELS[stage as Stage];
  return '—';
}

/** Type predicate for URL state validation (?stage=...) per D-10 + Pitfall 8. */
export function isStage(s: string | null | undefined): s is Stage {
  return s != null && (STAGES as readonly string[]).includes(s);
}
