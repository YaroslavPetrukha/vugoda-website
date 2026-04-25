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
 * Parallax recipe (D-04):
 *   - useScroll scoped to hero section (target: heroRef) — stops once hero scrolls out
 *   - useTransform maps scrollYProgress 0->1 to translateY 0 -> -120px
 *   - Reduced-motion: output range collapses to [0, 0] (Phase 5 owns full hook threading)
 *   - Linear (no spring, no bounce — D-04)
 *
 * NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14).
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

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const cubeY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -120],
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
