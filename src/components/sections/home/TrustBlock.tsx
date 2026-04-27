/**
 * @module components/sections/home/TrustBlock
 *
 * Certificate-style legal-trust block — P1-D6 rebuild (AUDIT-DESIGN §9.5).
 *
 * Replaces the «3 muted Excel rows» with a certificate-feel composition
 * where the ЄДРПОУ tabular number is the central доказовий element
 * (text-figure size, accent color), framed by pictograph icons +
 * vertical dividers between columns.
 *
 * Hard rule preserved: NO portrait imagery, NO faces, NO leadership-roster
 * copy. Trust signal = ЄДРПОУ in public registry + active construction
 * license, not headshots (PROJECT.md Out of Scope, brand-system.md §6,
 * CONCEPT §10.1).
 *
 * Per-column anatomy:
 *   - Lucide pictograph icon (32×32) — Building2 / ScrollText / Mail.
 *     Line-art style consistent with brand «pictographs» language.
 *   - Uppercase tracked label (Юр. особа / Ліцензія / Контакт).
 *   - Primary value at full luminance.
 *   - Secondary caption muted.
 *
 * Col 1 (Юр. особа) ALSO carries the ЄДРПОУ at text-figure tabular-nums
 * accent — the audit's «це доказовий елемент» moment. 8-digit number
 * gets the visual weight it deserves (was text-base 16px, now clamp 60-96).
 *
 * Vertical dividers via lg:border-l on cols 2 & 3 (border-text-muted/15).
 * Single horizontal top divider preserved.
 *
 * Reads facts from src/content/company.ts named exports and longer captions
 * (licenseScopeNote, contactNote) from src/content/home.ts. Heading + col
 * labels also live in content/home.ts now (Phase 3 D-29 boundary).
 */

import { motion } from 'motion/react';
import { Building2, ScrollText, Mail } from 'lucide-react';
import {
  legalName,
  edrpou,
  licenseDate,
  licenseNote,
  email,
} from '../../../content/company';
import {
  licenseScopeNote,
  contactNote,
  trustHeading,
  trustLabelLegal,
  trustLabelLicense,
  trustLabelContact,
} from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';

export function TrustBlock() {
  return (
    <RevealOnScroll as="section" className="bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-[length:var(--text-h2)] font-bold leading-[1.05] text-text">
          {trustHeading}
        </h2>

        <RevealOnScroll
          staggerChildren
          className="grid grid-cols-1 gap-12 border-t border-text-muted/15 pt-12 lg:grid-cols-3 lg:gap-0"
        >
          {/* Column 1 — legal entity + ЄДРПОУ tabular-nums tile */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-4 lg:pr-8"
          >
            <Building2
              size={32}
              strokeWidth={1.25}
              className="text-text-muted"
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
              {trustLabelLegal}
            </span>
            <span className="text-base font-bold text-text">{legalName}</span>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                ЄДРПОУ
              </span>
              <span className="text-[length:var(--text-figure)] font-bold leading-none tabular-nums text-accent">
                {edrpou}
              </span>
            </div>
          </motion.div>

          {/* Column 2 — license, vertical divider on lg */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-4 lg:border-l lg:border-text-muted/15 lg:px-8"
          >
            <ScrollText
              size={32}
              strokeWidth={1.25}
              className="text-text-muted"
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
              {trustLabelLicense}
            </span>
            <span className="text-base font-bold text-text">
              від {licenseDate} {licenseNote}
            </span>
            <span className="text-base text-text-muted">
              {licenseScopeNote}
            </span>
          </motion.div>

          {/* Column 3 — contact email, vertical divider on lg */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-4 lg:border-l lg:border-text-muted/15 lg:pl-8"
          >
            <Mail
              size={32}
              strokeWidth={1.25}
              className="text-text-muted"
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
              {trustLabelContact}
            </span>
            <a
              href={`mailto:${email}`}
              className="text-base font-bold text-text hover:text-accent"
            >
              {email}
            </a>
            <span className="text-base text-text-muted">{contactNote}</span>
          </motion.div>
        </RevealOnScroll>
      </div>
    </RevealOnScroll>
  );
}
