/**
 * @module components/sections/home/MethodologyTeaser
 *
 * HOME-05 — 2-3 blocks from §8 methodology.
 *
 * Selection per Phase 3 RESEARCH Open Question 2 recommendation:
 * indexes [1, 3, 7] — all needsVerification: false. This avoids
 * foregrounding unverified blocks on the home page (CONCEPT §11.5).
 *
 * Defensive ⚠-marker: if any selected block has needsVerification: true
 * (future swap to e.g. [4, 5, 7]), the title gets a ⚠ marker (Phase 2 D-16)
 * — never silently ship unverified content as fact. The aria-label string
 * lives in src/content/home.ts (Phase 3 D-29 / checker Warning 6).
 *
 * Reads methodologyBlocks from src/content/methodology.ts. NO inline
 * Ukrainian copy (Phase 2 D-20 / Phase 3 D-29) — including aria-labels.
 */

import { methodologyBlocks } from '../../../content/methodology';
import { methodologyVerificationWarning } from '../../../content/home';

/** Block indexes to feature on home — all currently needsVerification: false. */
const FEATURED_INDEXES = [1, 3, 7] as const;

export function MethodologyTeaser() {
  const featured = methodologyBlocks.filter((b) =>
    FEATURED_INDEXES.includes(b.index as 1 | 3 | 7),
  );

  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 font-bold text-3xl text-text">Як ми будуємо</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featured.map((block) => (
            <article key={block.index} className="flex flex-col gap-4">
              <span className="font-medium text-sm text-text-muted">
                {String(block.index).padStart(2, '0')}
              </span>
              <h3 className="font-bold text-xl text-text">
                {block.needsVerification && (
                  <span
                    aria-label={methodologyVerificationWarning}
                    className="mr-2 text-accent"
                  >
                    ⚠
                  </span>
                )}
                {block.title}
              </h3>
              <p className="text-base leading-relaxed text-text-muted">
                {block.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
