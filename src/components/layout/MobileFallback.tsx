/**
 * @module components/layout/MobileFallback
 *
 * QA-01 mobile fallback page rendered when viewport <1024px (D-01..D-03).
 * Layout.tsx short-circuits to this component INSTEAD of <Outlet> AND
 * hides Nav + Footer (single-screen, self-contained per D-03).
 *
 * Layout (D-04 verbatim):
 *   - <Logo /> dark variant ~120px wide, 32px top margin
 *   - «ВИГОДА» wordmark text (Montserrat 700 ~48px, fill via Tailwind
 *     token text-text)
 *   - Body copy (max-w-[20ch], text-text-muted, ≥14pt for WCAG AA contrast
 *     on bg-bg per Phase 1 D-21 / brand-system §3)
 *   - Active mailto link (text-accent — never on light bg, ok on dark)
 *   - 40%-width divider (border-t border-text-muted/20 — uses opacity
 *     modifier to express the 0.2 alpha)
 *   - 4 CTA links stacked, focus-visible:focus rules global from Phase 1
 *     D-21; explicit underline on focus inherited
 *   - Juridical block (single-column — NOT the 3-col Footer treatment;
 *     reads legalName/edrpou/licenseDate from src/content/company)
 *
 * Tone (CONCEPT §2): стримано. No marketing claims. NO «view desktop
 * anyway» override per D-05 (terminal state).
 *
 * AnimatePresence is BYPASSED for this component (Layout.tsx D-03):
 * mobile users never load Motion's exit/enter animation runtime path,
 * saving runtime bytes. This component is plain JSX + Tailwind — no
 * Motion import.
 *
 * 4 CTA hrefs (D-06):
 *   - 3 internal hash routes — navigate to same fallback at <1024px;
 *     desktop visits the right page directly
 *   - 1 external Lakeview — opens new tab with rel="noopener noreferrer"
 *     (Phase 4 HUB-02 pattern); Lakeview handles its own mobile responsive
 *
 * @rule IMPORT BOUNDARY: layout component. Imports from content/, brand/,
 *   nothing from pages/. content/mobile-fallback.ts is the locked copy SOT.
 */
import { Logo } from '../brand/Logo';
import { fallbackBody, fallbackEmail, fallbackCtas } from '../../content/mobile-fallback';
import { legalName, edrpou, licenseDate } from '../../content/company';
import { withLakeviewUtm } from '../../lib/utm';

export function MobileFallback() {
  return (
    <main
      role="main"
      aria-label="Сайт оптимізовано для десктопа"
      className="flex min-h-screen flex-col items-center justify-between bg-bg px-6 py-8 text-center"
    >
      {/* Top stack: logo + wordmark + body + mailto + divider + CTAs */}
      <div className="flex w-full max-w-md flex-col items-center gap-6 pt-6">
        <Logo className="h-auto w-[120px]" title="ВИГОДА" />

        <h1 className="text-5xl font-bold tracking-tight text-text" lang="uk">
          ВИГОДА
        </h1>

        <p className="max-w-[20ch] text-base leading-relaxed text-text-muted" lang="uk">
          {fallbackBody}
        </p>

        <a
          href={`mailto:${fallbackEmail}`}
          className="text-base font-medium text-accent underline-offset-4 hover:underline"
        >
          {fallbackEmail}
        </a>

        <div aria-hidden="true" className="h-px w-2/5 bg-text-muted/20" />

        <nav aria-label="Навігація сайту" className="flex w-full flex-col items-center gap-3">
          {fallbackCtas.map((cta) => (
            <a
              key={cta.href}
              href={cta.external ? withLakeviewUtm(cta.href, 'mobile-fallback') : cta.href}
              {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-base font-medium text-text underline-offset-4 hover:underline"
            >
              {cta.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom juridical block — single-column variant of Footer (D-04) */}
      <div className="mt-12 flex flex-col items-center gap-1 text-sm text-text-muted">
        <p>{legalName}</p>
        <p>ЄДРПОУ {edrpou}</p>
        <p>Ліцензія від {licenseDate}</p>
      </div>
    </main>
  );
}
