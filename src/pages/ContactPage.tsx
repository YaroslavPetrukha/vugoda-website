/**
 * @module pages/ContactPage
 *
 * Split-immersive contact — P1-D9 rebuild (AUDIT-DESIGN §9.8).
 *
 * Replaces the centered «h1 + dl + button» single-column layout with a
 * 50/50 split that turns the contact page into a real moment, not a
 * Word-styled form-without-form:
 *
 *   [Left 50%, bg-bg, min-h-screen]
 *     • overline «КОНТАКТ · ЛЬВІВ» tracked uppercase muted
 *     • h1 «Поговоримо» at text-display-l Bold (clamp 72-128)
 *     • subtitle bumped to text-lead muted
 *     • <ContactDetails> dl with bumped typography (own commit)
 *     • primary CTA bg-accent
 *
 *   [Right 50%, bg-bg-black, min-h-screen]
 *     • IsometricGridBG @ opacity 0.30 (denser than home hero 0.15 —
 *       this is the visual-anchor moment of the section)
 *     • Pin-stack: 3 IsometricCube anchors next to project name + city.
 *       Cube stroke maps to project stage:
 *         Lakeview (active)      → accent #C1F33D
 *         Етно Дім (memorandum)  → text   #F5F7FA
 *         Маєток (calculation)   → muted  #A7AFBC
 *
 * The full Lviv map SVG with geographic-positioned pins (audit §9.8 spec)
 * is deferred to P2 / dedicated LvivMapSvg component. The pin-stack here
 * carries the «we're shooting Lviv from 3 sites» message without
 * fabricating a map polygon we can't ground-truth.
 *
 * H1 «Поговоримо» (was «Контакт») per AUDIT-DESIGN §9.8. Conversational
 * invitation, not a marketing superlative — within brand «стримано» tone.
 *
 * Default export preserved (App.tsx import unchanged).
 */

import { usePageTitle } from '../hooks/usePageTitle';
import { email } from '../content/company';
import {
  contactPageHeading,
  contactPageOverline,
  contactPageSubtitle,
  contactPageCta,
  contactMailSubject,
  contactPinsLabel,
  pageTitle,
} from '../content/contact';
import { ContactDetails } from '../components/sections/contact/ContactDetails';
import { IsometricCube } from '../components/brand/IsometricCube';
import { IsometricGridBG } from '../components/brand/IsometricGridBG';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';

interface Pin {
  title: string;
  meta: string;
  stroke: '#A7AFBC' | '#F5F7FA' | '#C1F33D';
}

/** 3 brand-pinned objects for the right-pane pin stack. Stage → stroke
 *  hierarchy: active = accent, memorandum = text, calculation = muted.
 *  Sourced from data/projects.ts presentation/stage but hard-coded here
 *  for editorial freedom (only 3 of 4 projects map to «Lviv area»; we
 *  also surface stage in user-facing words rather than `stage` enum). */
const PINS: Pin[] = [
  { title: 'ЖК Lakeview', meta: 'Львів · активне будівництво', stroke: '#C1F33D' },
  { title: 'ЖК Етно Дім', meta: 'Львів · меморандум', stroke: '#F5F7FA' },
  { title: 'ЖК Маєток Винниківський', meta: 'Винники · кошторис', stroke: '#A7AFBC' },
];

export default function ContactPage() {
  usePageTitle(pageTitle);
  const href = `mailto:${email}?subject=${encodeURIComponent(contactMailSubject)}`;

  return (
    <section className="grid grid-cols-1 lg:min-h-screen lg:grid-cols-2">
      {/* Left half — content stack on bg-bg. */}
      <RevealOnScroll
        as="div"
        className="flex flex-col justify-center gap-10 bg-bg px-12 py-24 lg:px-20"
      >
        <header className="flex flex-col gap-4">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {contactPageOverline}
          </p>
          <h1 className="text-[length:var(--text-display-l)] font-bold leading-[0.95] text-text">
            {contactPageHeading}
          </h1>
          <p className="text-[length:var(--text-lead)] text-text-muted">
            {contactPageSubtitle}
          </p>
        </header>

        <ContactDetails />

        <a
          href={href}
          className="inline-flex w-fit items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {contactPageCta}
        </a>
      </RevealOnScroll>

      {/* Right half — pin stack on bg-bg-black with denser grid backdrop. */}
      <div className="relative flex flex-col justify-center bg-bg-black px-12 py-24 lg:px-20">
        {/* Backdrop grid — denser opacity than hero (0.30 vs 0.15) to
            signal «this is the visual-anchor moment». aria-hidden. */}
        <div className="pointer-events-none absolute inset-0">
          <IsometricGridBG className="h-full w-full" opacity={0.3} />
        </div>

        <div className="relative z-10 flex flex-col gap-10">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {contactPinsLabel}
          </p>
          <ul role="list" className="flex flex-col gap-8">
            {PINS.map((pin) => (
              <li key={pin.title} className="flex items-center gap-6">
                <IsometricCube
                  variant="single"
                  stroke={pin.stroke}
                  strokeWidth={1.5}
                  opacity={0.9}
                  className="h-16 w-16 flex-shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[length:var(--text-h3)] font-bold leading-tight text-text">
                    {pin.title}
                  </span>
                  <span className="text-[13px] uppercase tracking-[0.18em] text-text-muted">
                    {pin.meta}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
