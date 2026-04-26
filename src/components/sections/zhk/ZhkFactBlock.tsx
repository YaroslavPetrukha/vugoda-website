/**
 * @module components/sections/zhk/ZhkFactBlock
 *
 * ZHK-01 — Fact block with semantic dl/dt/dd markup (D-15 + RESEARCH §Q7).
 * Three rows: stage (descriptive stageLabel), location, address (em-dash
 * placeholder from placeholders.ts until client confirms).
 *
 * Layout: 2-column at lg breakpoint (label 120px / value flex), stacked
 * below lg.
 *
 * WCAG: dt uses text-base (16px) at lg — at AA floor for #A7AFBC/#2F3640
 * (5.3:1 contrast) at 16px. font-medium at sm breakpoint provides
 * contrast-perception bump (Pitfall 6).
 */

import type { Project } from '../../../data/types';
import { etnoDimAddress } from '../../../content/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';

interface Props {
  project: Project;
}

export function ZhkFactBlock({ project }: Props) {
  return (
    <RevealOnScroll as="section" className="bg-bg py-16">
      <div className="mx-auto max-w-7xl px-6">
        <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[120px_1fr] lg:gap-x-8">
          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Стадія
          </dt>
          <dd className="text-base text-text">{project.stageLabel}</dd>
          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Локація
          </dt>
          <dd className="text-base text-text">{project.location ?? '—'}</dd>
          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Адреса
          </dt>
          <dd className="text-base text-text">{etnoDimAddress}</dd>
        </dl>
      </div>
    </RevealOnScroll>
  );
}
