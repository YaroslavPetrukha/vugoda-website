/**
 * @module pages/ConstructionLogPage
 *
 * LOG-01 — Lakeview construction-log timeline. Reads constructionLog
 * (already sorted latest-first per Phase 2 D-21) and renders one
 * <MonthGroup> per month. Each MonthGroup owns its own Lightbox state
 * (Pitfall 9 — per-group state).
 *
 * Page header: simple <h1>Хід будівництва Lakeview</h1> at top. Subtitle
 * not needed (CONCEPT §7.9 stripped tone — page label says it all).
 *
 * Default export preserved (App.tsx import unchanged).
 */

import { usePageTitle } from '../hooks/usePageTitle';
import { constructionLog, pageTitle } from '../data/construction';
import { MonthGroup } from '../components/sections/construction-log/MonthGroup';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';

export default function ConstructionLogPage() {
  usePageTitle(pageTitle);
  return (
    <>
      <RevealOnScroll as="section" className="bg-bg pt-24 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-bold text-6xl text-text">Хід будівництва Lakeview</h1>
        </div>
      </RevealOnScroll>
      {constructionLog.map((month) => (
        <MonthGroup key={month.key} month={month} />
      ))}
    </>
  );
}
