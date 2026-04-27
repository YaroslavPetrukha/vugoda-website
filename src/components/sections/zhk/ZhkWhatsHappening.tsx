/**
 * @module components/sections/zhk/ZhkWhatsHappening
 *
 * Editorial pull-quote — P1-D7 rebuild (AUDIT-DESIGN §9.6 «WHAT'S
 * HAPPENING editorial»).
 *
 * Replaces the «center max-w-3xl» plain paragraph with a full-bleed
 * editorial moment that carries the project's restoration arc:
 *
 *   1. Narrative timeline overline (3-stage arrow): Об'єкт законсервовано
 *      → меморандум 2026 → старт відновлення. This arc is the brand-
 *      defining story of Etno Dim — visitors read the journey, not
 *      «here's some text».
 *   2. H2 «Що відбувається зараз» bumped to text-h2 token.
 *   3. Body bumped to text-lead text-text — manifesto-grade luminance,
 *      not muted.
 *   4. 64×1px accent-bar punctuation at bottom.
 *
 * BeforeAfterSlider deferred (AUDIT-DESIGN §9.6 §«КЛЮЧОВЕ»): the slider
 * needs a real «before» photo of the frozen construction site, which
 * we don't have. Fabricating it (e.g. picking two renders to fake
 * before/after) violates the audit-inherited content rule (skeptic-pass
 * memory). Restore in P2 when client provides the freeze-state asset.
 *
 * Reads project.whatsHappening (defined for full-internal records;
 * may be undefined for fixtures — guard with conditional render).
 *
 * NO prices, NO sale terms — pipeline projects per PROJECT.md hard rule.
 */

import { motion, useReducedMotion } from 'motion/react';
import type { Project } from '../../../data/types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { accentBarDraw } from '../../../lib/motionVariants';
import {
  whatsHappeningTimeline,
  whatsHappeningHeading,
} from '../../../content/zhk-etno-dim';

interface Props {
  project: Project;
}

export function ZhkWhatsHappening({ project }: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (!project.whatsHappening) return null;

  return (
    <RevealOnScroll as="section" className="bg-bg-surface py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-6 text-[13px] font-medium uppercase tracking-[0.18em] text-accent">
          {whatsHappeningTimeline}
        </p>
        <h2 className="mb-10 text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
          {whatsHappeningHeading}
        </h2>
        <p className="text-[length:var(--text-lead)] leading-relaxed text-text">
          {project.whatsHappening}
        </p>
        <div className="mt-12">
          {prefersReducedMotion ? (
            <span
              aria-hidden="true"
              className="block h-px bg-accent"
              style={{ width: 64 }}
            />
          ) : (
            <motion.span
              aria-hidden="true"
              className="block h-px origin-left bg-accent"
              style={{ width: 64 }}
              variants={accentBarDraw}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            />
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}
