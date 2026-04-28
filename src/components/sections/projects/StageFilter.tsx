/**
 * @module components/sections/projects/StageFilter
 *
 * HUB-01 — Chip-row filter (D-03 chip counts span ALL projects;
 * D-10 URL state via ?stage=...; D-11 unknown values fallback;
 * D-12 outline-pill at rest, accent-fill at active).
 *
 * URL state: ?stage=u-rozrakhunku|u-pogodzhenni|buduetsya|zdano
 * Absence of param = «Усі» (default). setSearchParams(..., { replace: true })
 * to avoid history bloat (D-10 + chip clicks are not navigation events).
 *
 * HashRouter compat verified: useSearchParams parses query string AFTER
 * the hash, so /#/projects?stage=zdano works correctly.
 *
 * Active-pill via layoutId (P1-UX8). The accent-fill is rendered as a
 * SHARED motion.span layer — Motion translates it between chips on filter
 * change, producing iOS-style segmented-control glide. Falls back to a
 * static absolute-positioned span under prefers-reduced-motion (D-25
 * RM-threading rule). Text color flips on each chip locally.
 *
 * Chip color transitions still use named-property list per D-32 — duration
 * and easing inline because the brand colors-only animation pre-dates the
 * variants module and the value matches easeBrand 1:1.
 */

import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { Stage } from '../../../data/types';
import { STAGES, stageLabel, isStage } from '../../../lib/stages';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp, stageFilterPillTransition } from '../../../lib/motionVariants';

interface Props {
  counts: Record<Stage, number>;
}

const PILL_LAYOUT_ID = 'stage-filter-pill';

/** Chip class string. text-color flips on active; pill renders separately. */
function chipClass(active: boolean): string {
  const base =
    'relative isolate inline-flex items-center px-4 py-2 text-sm font-medium border rounded-full ' +
    'transition-[color,border-color] duration-200 ' +
    'ease-[cubic-bezier(0.22,1,0.36,1)] ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
  if (active) {
    return `${base} text-bg-black border-accent`;
  }
  return `${base} text-text border-text-muted hover:border-text`;
}

interface PillProps {
  reduceMotion: boolean;
}

/** Active accent-fill pill — animated via shared layoutId, static under RM. */
function ActivePill({ reduceMotion }: PillProps) {
  if (reduceMotion) {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-accent"
      />
    );
  }
  return (
    <motion.span
      layoutId={PILL_LAYOUT_ID}
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-full bg-accent"
      transition={stageFilterPillTransition}
    />
  );
}

export function StageFilter({ counts }: Props) {
  const [params, setParams] = useSearchParams();
  const reduceMotion = useReducedMotion() ?? false;
  const raw = params.get('stage');
  const active: Stage | null = isStage(raw) ? raw : null;

  const setActive = (s: Stage | null) => {
    const next = new URLSearchParams(params);
    if (s == null) next.delete('stage');
    else next.set('stage', s);
    setParams(next, { replace: true });
  };

  return (
    <RevealOnScroll
      as="div"
      staggerChildren
      role="group"
      aria-label="Фільтр за стадіями"
      className="my-12 flex flex-wrap gap-3"
    >
      <motion.button
        type="button"
        onClick={() => setActive(null)}
        aria-pressed={active === null}
        variants={fadeUp}
        className={chipClass(active === null)}
      >
        {active === null && <ActivePill reduceMotion={reduceMotion} />}
        Усі
      </motion.button>
      {STAGES.map((s) => (
        <motion.button
          key={s}
          type="button"
          onClick={() => setActive(s)}
          aria-pressed={active === s}
          variants={fadeUp}
          className={chipClass(active === s)}
        >
          {active === s && <ActivePill reduceMotion={reduceMotion} />}
          {stageLabel(s)} ({counts[s]})
        </motion.button>
      ))}
    </RevealOnScroll>
  );
}
