/**
 * @module components/sections/home/TrustBlock
 *
 * HOME-06 — Trust-via-legal-facts (NOT trust-via-portraits).
 * 3-column horizontal table: Юр. особа | Ліцензія | Контакт.
 *
 * Hard rule: NO portrait imagery, NO faces, NO leadership-roster copy.
 * Trust signal = ЄДРПОУ in public registry + active construction license,
 * not headshots (PROJECT.md Out of Scope, brand-system.md §6, CONCEPT §10.1).
 *
 * Reads facts from src/content/company.ts named exports and longer captions
 * (licenseScopeNote, contactNote) from src/content/home.ts — Phase 3 D-29
 * boundary discipline (closes checker Warning 7). Phase 1 Footer.tsx shows
 * the same 3 facts in column 3 — TrustBlock is the home-page higher-emphasis
 * surface (Persona-3 bank-DD lands here from Google).
 *
 * Muted labels use text-text-muted (#A7AFBC) at text-xs (12px ≈ 9pt) — BUT the
 * labels are uppercase tracking-wider, so the effective optical size + label-
 * pattern usage stays inside brand-system §3 acceptable (labels, not body).
 * Values use text-text (#F5F7FA, AAA 10.5:1).
 */

import { motion } from 'motion/react';
import {
  legalName,
  edrpou,
  licenseDate,
  licenseNote,
  email,
} from '../../../content/company';
import { licenseScopeNote, contactNote } from '../../../content/home';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { fadeUp } from '../../../lib/motionVariants';

export function TrustBlock() {
  return (
    <RevealOnScroll as="section" className="bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 font-bold text-3xl text-text">
          Юридично та операційно
        </h2>

        <RevealOnScroll
          staggerChildren
          className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3"
        >
          {/* Column 1 — legal entity + ЄДРПОУ */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
              Юр. особа
            </span>
            <span className="font-bold text-base text-text">{legalName}</span>
            <span className="text-base text-text-muted">ЄДРПОУ {edrpou}</span>
          </motion.div>

          {/* Column 2 — license */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
              Ліцензія
            </span>
            <span className="font-bold text-base text-text">
              від {licenseDate} {licenseNote}
            </span>
            <span className="text-base text-text-muted">
              {licenseScopeNote}
            </span>
          </motion.div>

          {/* Column 3 — contact email (clickable mailto) */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
              Контакт
            </span>
            <a
              href={`mailto:${email}`}
              className="font-bold text-base text-text hover:text-accent"
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
