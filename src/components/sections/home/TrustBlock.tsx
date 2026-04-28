/**
 * @module components/sections/home/TrustBlock
 *
 * Certificate-row trust grid — W7 rebuild ($impeccable layout, P1).
 *
 * Replaces the 2×3 cell grid (icon · overline · primary · secondary
 * × 6) — flagged by critique as «3 hero stats + 3 footnotes under
 * uniform frames». New composition reads as a registry document: a
 * 6-row table with [label · value · note] anatomy, accent rule at top
 * and bottom, hairline rules between rows.
 *
 * Anatomy per row (12-col grid):
 *   col 1-3   label    overline tier, muted
 *   col 4-7   value    h3 tier, bold, tabular-nums, accent for verified
 *                      figures (ЄДРПОУ, years, СС3) + text for narrative
 *                      values (license date, email, requisites placeholder)
 *   col 8-12  note     base body, muted
 *
 * Drops:
 *   - Per-cell Lucide icons. The «certificate» reading no longer needs
 *     visual iconography per cell — uniform anatomy + accent rule is
 *     enough. Reduces «AI 6-cell grid» feel decisively.
 *   - 2×3 grid metaphor. Now a stack — registry, not catalog.
 *
 * Preserves:
 *   - 6 verifiable trust signals (no fake stats).
 *   - CountUp on numeric values (ЄДРПОУ + years).
 *   - RevealOnScroll staggerChildren cadence for soft entrance.
 *   - PROJECT-mandated bans: no portrait imagery, no team copy.
 *
 * Hard rule preserved: NO faces, NO leadership-roster copy.
 *
 * Beat-pattern padding: py-20 (terse — administrative tier in the
 * 6-section beat). Up from py-32 was BrandEssence/Methodology (py-40,
 * editorial); down from py-32 here is intentional «brisk registry»
 * cadence between Construction (py-24) and Contact (py-48).
 */

import { motion, useReducedMotion } from 'motion/react';
import {
  legalName,
  edrpou,
  licenseDate,
  licenseYear,
  email,
  consequenceClass,
} from '../../../content/company';
import {
  trustHeading,
  trustOverline,
  trustLabelLegal,
  trustLabelLicense,
  trustLabelContact,
  trustLabelYears,
  trustLabelConsequence,
  trustLabelDocuments,
  trustYearsNote,
  trustDocumentsValue,
  trustDocumentsNote,
  licenseScopeNote,
  contactNote,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline, overlineClasses } from '../../ui/typography';
import { CountUp } from '../../ui/CountUp';
import { fadeUp, accentBarDraw } from '../../../lib/motionVariants';

/** Reference year for «X років на ринку». Static per W5 — no moving count. */
const REFERENCE_YEAR = 2026;
const yearsOnMarket = REFERENCE_YEAR - licenseYear;

interface RowProps {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  /** When true (first row) suppresses the top hairline — top rule already
   *  carried by the section's accent ledger. */
  isFirst?: boolean;
}

function CertRow({ label, value, note, isFirst }: RowProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={`grid grid-cols-12 items-baseline gap-8 py-8 ${
        isFirst ? '' : 'border-t border-text-muted/15'
      }`}
    >
      <span
        className={`${overlineClasses} col-span-12 text-text-muted lg:col-span-3`}
      >
        {label}
      </span>
      <div className="col-span-12 lg:col-span-5">{value}</div>
      {note && (
        <span className="col-span-12 text-base leading-relaxed text-text-muted lg:col-span-4">
          {note}
        </span>
      )}
    </motion.div>
  );
}

const valueClass =
  'text-[length:var(--text-h3)] font-bold leading-tight tabular-nums text-text';
const valueAccent =
  'text-[length:var(--text-h3)] font-bold leading-tight tabular-nums text-accent';

export function TrustBlock() {
  const prefersReducedMotion = useReducedMotion();

  // Top + bottom accent rules — animated draw-on-view via accentBarDraw
  // variant (origin-left scaleX 0→1, 0.8s easeBrand). Under RM rendered
  // statically at full scaleX. The two rules visually seal the
  // certificate ledger; animating them at full width reinforces the
  // «document opening» reading without flashy effects.
  const ruleClass = 'block h-px w-full origin-left bg-accent';

  return (
    <RevealOnScroll as="section" className="bg-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header — overline + H2. Body description omitted; the certificate
            structure speaks for itself. */}
        <header className="mb-12 flex flex-col gap-3">
          <SectionOverline>{trustOverline}</SectionOverline>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {trustHeading}
          </h2>
        </header>

        {/* Top accent rule — seals the certificate. 1px lime full-width. */}
        {prefersReducedMotion ? (
          <span aria-hidden="true" className={ruleClass} />
        ) : (
          <motion.span
            aria-hidden="true"
            className={ruleClass}
            variants={accentBarDraw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          />
        )}

        {/* 6 certificate rows — staggerChildren cadence inherited from outer
            RevealOnScroll. Each row uses fadeUp variant via motion.div. */}
        <RevealOnScroll staggerChildren className="flex flex-col">
          <CertRow
            isFirst
            label={trustLabelLegal}
            value={
              <div className="flex flex-col gap-2">
                <CountUp
                  to={Number(edrpou)}
                  className={valueAccent}
                />
                <span className="text-base text-text">{legalName}</span>
              </div>
            }
            note="Реєстраційний код ЄДРПОУ — публічний реєстр Мінʼюсту."
          />

          <CertRow
            label={trustLabelLicense}
            value={<span className={valueClass}>{licenseDate}</span>}
            note={licenseScopeNote}
          />

          <CertRow
            label={trustLabelContact}
            value={
              <a
                href={`mailto:${email}`}
                className="text-[length:var(--text-h3)] font-bold leading-tight text-text underline-offset-4 transition-colors duration-150 ease-out hover:text-accent hover:underline"
              >
                {email}
              </a>
            }
            note={contactNote}
          />

          <CertRow
            label={trustLabelYears}
            value={
              <CountUp to={yearsOnMarket} className={valueAccent} />
            }
            note={trustYearsNote}
          />

          <CertRow
            label={trustLabelConsequence}
            value={<span className={valueAccent}>{consequenceClass}</span>}
            note="Найвищий клас за ДБН В.1.2-14:2018 — для Lakeview."
          />

          <CertRow
            label={trustLabelDocuments}
            value={<span className={valueClass}>{trustDocumentsValue}</span>}
            note={trustDocumentsNote}
          />
        </RevealOnScroll>

        {/* Bottom accent rule — closes the ledger. */}
        {prefersReducedMotion ? (
          <span aria-hidden="true" className={ruleClass} />
        ) : (
          <motion.span
            aria-hidden="true"
            className={ruleClass}
            variants={accentBarDraw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          />
        )}
      </div>
    </RevealOnScroll>
  );
}
