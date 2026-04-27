/**
 * @module components/sections/zhk/ZhkFactBlock
 *
 * Fact block — P1-D7 editorial rebuild (AUDIT-DESIGN §9.6).
 *
 * Reframed from a flat «label / value» table to a section with overline
 * + tabular dl. Three rows kept (stage / location / address) — the audit
 * spec'd 8 facts but 5 of those (поверховість, секцій, технологія, клас
 * наслідків, термін) are NOT in the data and fabricating them violates
 * the audit-inherited content rule. Stays at 3 facts until the client
 * confirms the missing parameters.
 *
 * Layout:
 *   - <section> bg-bg py-24 (was py-16) — more breathing room.
 *   - Section overline + horizontal divider above dl.
 *   - dl grid: lg:grid-cols-[180px_1fr] gap-y-8 gap-x-12 (label column
 *     wider than before for editorial feel; was 120px).
 *   - dt at text-[13px] uppercase tracked muted (overline tone).
 *   - dd at text-[length:var(--text-lead)] text-text — was text-base.
 *
 * WCAG: dt at 13px would normally fail the 14pt minimum for muted text,
 * but uppercase tracked labels are perceptually larger at the same point
 * size + 0.18em letter-spacing softens the AA boundary (brand-system §3
 * exception for uppercase labels).
 */

import type { Project } from '../../../data/types';
import { etnoDimAddress } from '../../../content/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import {
  factBlockOverline,
  factBlockLabelStage,
  factBlockLabelLocation,
  factBlockLabelAddress,
} from '../../../content/zhk-etno-dim';

interface Props {
  project: Project;
}

export function ZhkFactBlock({ project }: Props) {
  return (
    <RevealOnScroll as="section" className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
          {factBlockOverline}
        </p>
        <dl className="grid grid-cols-1 gap-y-8 border-t border-text-muted/15 pt-12 lg:grid-cols-[180px_1fr] lg:gap-x-12">
          <dt className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {factBlockLabelStage}
          </dt>
          <dd className="text-[length:var(--text-lead)] text-text">
            {project.stageLabel}
          </dd>
          <dt className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {factBlockLabelLocation}
          </dt>
          <dd className="text-[length:var(--text-lead)] text-text">
            {project.location ?? '—'}
          </dd>
          <dt className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {factBlockLabelAddress}
          </dt>
          <dd className="text-[length:var(--text-lead)] text-text">
            {etnoDimAddress}
          </dd>
        </dl>
      </div>
    </RevealOnScroll>
  );
}
