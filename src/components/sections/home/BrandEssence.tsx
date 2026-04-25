/**
 * @module components/sections/home/BrandEssence
 *
 * HOME-02 — 4 brand-value cards (системність, доцільність, надійність,
 * довгострокова цінність). Reads from src/content/values.ts; never inlines
 * the Ukrainian copy (Phase 2 D-20 / Phase 3 D-29).
 *
 * Layout per Phase 3 RESEARCH Open Question 1: 2×2 numbered (01–04).
 * Pure typography — no decorative icons (brand-system.md §7) and no cube
 * primitives in this section per D-11 (cube use restricted to hero overlay
 * + PortfolioOverview aggregate row on the home page). Body uses
 * text-text-muted — 16-18px body size keeps it within ≥14pt AA-readable
 * threshold (brand-system.md §3).
 */

import { brandValues } from '../../../content/values';

export function BrandEssence() {
  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-16">
          {brandValues.map((value, i) => {
            const num = String(i + 1).padStart(2, '0');
            return (
              <article key={value.title} className="flex flex-col gap-4">
                <span className="font-medium text-sm text-text-muted">
                  {num}
                </span>
                <h3 className="font-bold text-2xl text-text">
                  {value.title}
                </h3>
                <p className="text-base leading-relaxed text-text-muted">
                  {value.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
