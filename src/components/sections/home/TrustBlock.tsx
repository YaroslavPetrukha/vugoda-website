/**
 * @module components/sections/home/TrustBlock
 *
 * Six-cell legal-trust grid — W5 rebuild (AUDIT-MASTER §SIN-2 + AUDIT-SALES
 * P1-S5 «Trust block: розширити до 6 елементів»).
 *
 * Replaces the prior 3-column layout with a 2×3 grid carrying six
 * verifiable trust signals:
 *
 *   1. Юр. особа     — legal entity + ЄДРПОУ tabular CountUp tile
 *   2. Ліцензія      — license date + scope note
 *   3. Контакт       — corporate email anchor
 *   4. Років на ринку — CountUp years-since-license-year (2026−2019 = 7)
 *   5. Клас наслідків — СС3 + ДБН note (Lakeview-anchored fact)
 *   6. Реквізити     — placeholder pointing to email until the PDF lands
 *
 * Hard rule preserved: NO portrait imagery, NO faces, NO leadership-roster
 * copy. Trust signal = registry/license/CountUp facts, not headshots
 * (PROJECT.md Out of Scope, brand-system.md §6).
 *
 * Layout:
 *   - Section frame with overline («ДОВІРА · 6 ПРОЯВІВ») + bumped H2.
 *   - 2×3 grid (3 cols on lg, 2 cols on md, 1 col on sm).
 *   - Hairline borders between cells (border-text-muted/15) — produces
 *     the «certificate document» reading the audit asked for.
 *   - Each cell follows uniform anatomy:
 *       Lucide pictograph icon (32×32, strokeWidth 1.25, text-muted) →
 *       overline label →
 *       primary value (figure tier where numeric, base tier where text) →
 *       muted secondary caption.
 *
 * Numeric cells use CountUp on view (years, ЄДРПОУ) — adds the «доказовий
 * build-up» moment per P1-D6. The classification cell shows СС3 statically
 * (text label, not a count target).
 *
 * Reads facts from src/content/company.ts and labels from src/content/home.ts
 * (Phase 3 D-29 boundary). yearsOnMarket is computed once at module-eval
 * time from licenseYear and a fixed reference year — keeps the count
 * deterministic across SSR/CSR and CountUp re-mounts.
 */

import { motion } from 'motion/react';
import { Building2, ScrollText, Mail, Calendar, ShieldCheck, FileText } from 'lucide-react';
import {
  legalName,
  edrpou,
  licenseDate,
  licenseYear,
  licenseNote,
  email,
  consequenceClass,
  consequenceClassNote,
} from '../../../content/company';
import {
  licenseScopeNote,
  contactNote,
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
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionOverline, overlineClasses } from '../../ui/typography';
import { CountUp } from '../../ui/CountUp';
import { fadeUp } from '../../../lib/motionVariants';

/** Reference year for «X років на ринку». Pinned to 2026 because the
 *  current site is timestamped «MVP 2026»; recompute when shipping a
 *  major version after Jan 1 2027 (or thread Date.now() if a moving
 *  count becomes the design intent). Static for now keeps it honest. */
const REFERENCE_YEAR = 2026;
const yearsOnMarket = REFERENCE_YEAR - licenseYear;

interface CellProps {
  icon: React.ReactNode;
  label: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}

function TrustCell({ icon, label, primary, secondary }: CellProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-3 border-t border-text-muted/15 pt-8"
    >
      <span aria-hidden="true" className="text-text-muted">
        {icon}
      </span>
      <span className={`${overlineClasses} text-text-muted`}>{label}</span>
      <div className="flex flex-col gap-1">{primary}</div>
      {secondary && <span className="text-base text-text-muted">{secondary}</span>}
    </motion.div>
  );
}

export function TrustBlock() {
  return (
    <RevealOnScroll as="section" className="bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16 flex flex-col gap-3">
          <SectionOverline>{trustOverline}</SectionOverline>
          <h2 className="text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
            {trustHeading}
          </h2>
        </header>

        <RevealOnScroll
          staggerChildren
          className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* 1 — Legal entity + ЄДРПОУ CountUp */}
          <TrustCell
            icon={<Building2 size={32} strokeWidth={1.25} />}
            label={trustLabelLegal}
            primary={
              <>
                <span className="text-base font-bold text-text">{legalName}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                  ЄДРПОУ
                </span>
                <CountUp
                  to={Number(edrpou)}
                  className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-accent"
                />
              </>
            }
          />

          {/* 2 — License */}
          <TrustCell
            icon={<ScrollText size={32} strokeWidth={1.25} />}
            label={trustLabelLicense}
            primary={
              <span className="text-base font-bold text-text">
                від {licenseDate} {licenseNote}
              </span>
            }
            secondary={licenseScopeNote}
          />

          {/* 3 — Contact email */}
          <TrustCell
            icon={<Mail size={32} strokeWidth={1.25} />}
            label={trustLabelContact}
            primary={
              <a
                href={`mailto:${email}`}
                className="text-base font-bold text-text hover:text-accent"
              >
                {email}
              </a>
            }
            secondary={contactNote}
          />

          {/* 4 — Years on market (CountUp) */}
          <TrustCell
            icon={<Calendar size={32} strokeWidth={1.25} />}
            label={trustLabelYears}
            primary={
              <CountUp
                to={yearsOnMarket}
                className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-accent"
              />
            }
            secondary={trustYearsNote}
          />

          {/* 5 — Consequence class (static label) */}
          <TrustCell
            icon={<ShieldCheck size={32} strokeWidth={1.25} />}
            label={trustLabelConsequence}
            primary={
              <span className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-accent">
                {consequenceClass}
              </span>
            }
            secondary={consequenceClassNote}
          />

          {/* 6 — Documents (placeholder until real PDF lands) */}
          <TrustCell
            icon={<FileText size={32} strokeWidth={1.25} />}
            label={trustLabelDocuments}
            primary={
              <span className="text-base font-bold text-text">
                {trustDocumentsValue}
              </span>
            }
            secondary={trustDocumentsNote}
          />
        </RevealOnScroll>
      </div>
    </RevealOnScroll>
  );
}
