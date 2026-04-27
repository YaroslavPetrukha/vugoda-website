/**
 * @module pages/ConstructionLogPage
 *
 * Timeline-progress page — P1-D8 rebuild (AUDIT-DESIGN §9.7).
 *
 * Reads constructionLog (already sorted latest-first per Phase 2 D-21)
 * and renders one <MonthGroup> per month with chronological numbering
 * (oldest = 01, newest = NN). Each MonthGroup owns its own Lightbox state
 * (Pitfall 9 — per-group state).
 *
 * Page header bumped: editorial overline + display-sized H1 (text-display-l).
 * Was «text-6xl» plain. Carries the same vocabulary («LAKEVIEW») as the
 * home ConstructionTeaser so the visitor reads continuity, not a different
 * voice between surfaces.
 *
 * Sticky 4-step progress-bar across months — DEFERRED (audit §9.7 spec).
 * Implementation requires cross-month state and intersection-observer
 * tracking; for W5 the editorial typography + per-month sticky-left numerics
 * carry the timeline-feel. Restore in P2 / motion wave.
 *
 * Default export preserved (App.tsx import unchanged).
 */

import { usePageTitle } from '../hooks/usePageTitle';
import { constructionLog, pageTitle } from '../data/construction';
import {
  constructionLogOverline,
  constructionLogHeading,
} from '../content/home';
import { MonthGroup } from '../components/sections/construction-log/MonthGroup';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { SectionOverline } from '../components/ui/typography';

export default function ConstructionLogPage() {
  usePageTitle(pageTitle);

  // Chronological numbering: oldest month = 01, newest = NN.
  // constructionLog is sorted latest-first (D-21), so order = length - i.
  const total = constructionLog.length;

  return (
    <>
      <RevealOnScroll as="section" className="bg-bg pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionOverline className="mb-6">
            {constructionLogOverline}
          </SectionOverline>
          <h1 className="text-[length:var(--text-display-l)] font-bold leading-[0.95] text-text">
            {constructionLogHeading}
          </h1>
        </div>
      </RevealOnScroll>
      {constructionLog.map((month, i) => (
        <MonthGroup key={month.key} month={month} order={total - i} />
      ))}
    </>
  );
}
