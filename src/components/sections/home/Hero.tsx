/**
 * @module components/sections/home/Hero
 *
 * HOME-01 + ANI-01 + VIS-03 + VIS-04 — the desktop-opening hero.
 *
 * Anatomy (Phase 3 D-01..D-06):
 *   - 100vh section, max-w-7xl inner content (D-01, D-24)
 *   - <h1> ВИГОДА Montserrat 700 uppercase, clamp(120px, 12vw, 200px) (D-02)
 *   - <IsometricGridBG opacity 0.15> overlay, parallax-translates UP on scroll (D-03 + D-04)
 *   - Gasло paragraph from src/content/home.ts (D-06, D-29)
 *   - CTA "Переглянути проекти" -> /projects via <Link> (D-05)
 *
 * Parallax recipe (D-04 + Phase 5 D-28):
 *   - useScroll scoped to hero section (target: heroRef) — stops once hero scrolls out
 *   - useTransform maps scrollYProgress 0->1 to translateY 0 -> -100px
 *     (Roadmap SC#1 says strictly «<120px»; -100 keeps a 20px headroom)
 *   - The [0, -100] magnitude lives in `parallaxRange` named export in
 *     src/lib/motionVariants.ts (Phase 5 D-22 SOT). Hero imports it; the
 *     hook calls themselves stay component-local per React rule-of-hooks.
 *   - Linear (no spring, no bounce — D-04)
 *
 * Reduced-motion + session-skip (Phase 5 D-17..D-21):
 *   - useReducedMotion() — when reduce, output range collapses to [0, 0]
 *     (hard override per D-20)
 *   - useSessionFlag('vugoda:hero-seen') — on 2nd+ visit in session, output
 *     range collapses to [0, 0] (cinematic intro skipped per SC#5;
 *     demo-pitch reload doesn't force re-watching)
 *   - Combined boolean: skipParallax = prefersReducedMotion || heroSeen
 *
 * NO inline Motion transition objects — Phase 5 SOT in motionVariants.ts
 * carries duration + ease via variants only (SC#1 grep gate).
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { IsometricGridBG } from '../../brand/IsometricGridBG';
import { heroSlogan, heroCta } from '../../../content/home';
import { parallaxRange } from '../../../lib/motionVariants';
import { useSessionFlag } from '../../../hooks/useSessionFlag';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const heroSeen = useSessionFlag('vugoda:hero-seen');
  const skipParallax = prefersReducedMotion || heroSeen;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const cubeY = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [...parallaxRange],
  );

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg"
    >
      {/* Parallax overlay — translates UP on scroll, behind wordmark */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: cubeY }}
      >
        <IsometricGridBG className="h-full w-full" opacity={0.15} />
      </motion.div>

      {/* Hero content — max-w-7xl per D-24 */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center">
        <h1 className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text">
          ВИГОДА
        </h1>
        <p className="max-w-3xl text-xl text-text">{heroSlogan}</p>
        <Link
          to="/projects"
          className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110"
        >
          {heroCta}
        </Link>
      </div>
    </section>
  );
}
