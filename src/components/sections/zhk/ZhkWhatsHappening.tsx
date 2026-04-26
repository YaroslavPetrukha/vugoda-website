/**
 * @module components/sections/zhk/ZhkWhatsHappening
 *
 * ZHK-01 — Stage-specific paragraph block (D-13, D-15).
 * Reads project.whatsHappening (defined for full-internal records;
 * may be undefined for fixtures — guard with conditional render).
 *
 * NO prices, NO sale terms — pipeline projects per PROJECT.md hard rule.
 */

import type { Project } from '../../../data/types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

interface Props {
  project: Project;
}

export function ZhkWhatsHappening({ project }: Props) {
  if (!project.whatsHappening) return null;
  return (
    <RevealOnScroll as="section" className="bg-bg-surface py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-6 font-bold text-3xl text-text">Що відбувається зараз</h2>
        <p className="text-base text-text">{project.whatsHappening}</p>
      </div>
    </RevealOnScroll>
  );
}
