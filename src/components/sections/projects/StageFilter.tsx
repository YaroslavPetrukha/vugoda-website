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
 * Chip state transitions use explicit property list per D-32 — named
 * properties only, NOT the catch-all utility. 200ms ease-out color transition.
 * Phase 5 absorbs the inline cubic-bezier into motionVariants.ts.
 */

import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Stage } from '../../../data/types';
import { STAGES, stageLabel, isStage } from '../../../lib/stages';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';

interface Props {
  counts: Record<Stage, number>;
}

/** Chip class string. Active = accent-fill, rest = outline-pill (D-12). */
function chipClass(active: boolean): string {
  const base =
    'inline-flex items-center px-4 py-2 text-sm font-medium border rounded-full ' +
    'transition-[background-color,color,border-color] duration-200 ' +
    'ease-[cubic-bezier(0.22,1,0.36,1)] ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
  if (active) {
    return `${base} bg-accent text-bg-black border-accent`;
  }
  return `${base} bg-transparent text-text border-text-muted hover:border-text`;
}

export function StageFilter({ counts }: Props) {
  const [params, setParams] = useSearchParams();
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
          {stageLabel(s)} ({counts[s]})
        </motion.button>
      ))}
    </RevealOnScroll>
  );
}
