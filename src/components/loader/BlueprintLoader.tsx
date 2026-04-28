/**
 * @module components/loader/BlueprintLoader
 *
 * Initial site loader — Blueprint Reveal System (brainstorm Top #1, GSAP impl).
 *
 * Сцена за ~1.45с (full reveal), композиція через `gsap.timeline()` з
 * `CustomEase` brand-curve (D-23 lockstep — третє представлення easeBrand,
 * поряд з motionVariants.ts 4-tuple і src/index.css `--ease-brand` CSS var):
 *
 *   1. Wireframe — 3 cube faces draw-on послідовно за 600ms (per spec
 *      «лайм-лінія за 600ms»). stroke-dashoffset 1 → 0, stagger 0.10s,
 *      duration 0.40 кожен path → 0.40 + 0.20 = 0.60s total. Order:
 *      top → right → left (DOM order у BlueprintCube PATHS, читається
 *      як «creolaution» — згори по правій, потім ліва грань).
 *   2. Fill — brandbook fill #C1F33D opacity 0 → 0.6 cross-fade поки
 *      stroke ще тримається (overlap '-=0.30'); читається як «креслення
 *      проявлено в реальність».
 *   3. Grain — pattern overlay opacity 0 → 0.12 (subtle texture, не
 *      перетягує увагу з cube).
 *   4. Wordmark — Logo (brandbook dark.svg) fade-up 12px + opacity.
 *   5. Typewriter — bottom-line з ratio numeral «01/05 · ВИГОДА · ЛЬВІВ ·
 *      49°N · 5 ОБ’ЄКТІВ» reveal через clip-path inset L→R.
 *
 * sessionStorage flag (lib/loaderState):
 *   Перший mount у сесії → full timeline. Repeat mounts → fade-only 250ms
 *   через `gsap.set()` snap + fade. ~tab-lifetime invalidation за замовчанням.
 *
 * prefers-reduced-motion:
 *   Skip timeline повністю. `gsap.set()` snap-final → 200ms hold → 200ms
 *   fade-out. Жодних transforms / clip-path animations — тільки opacity на
 *   container (essential motion exception per CSSWG).
 *
 * Skip-механіка:
 *   click/keydown(Esc/Space/Enter)/wheel/touchstart на window → `tl.kill()` +
 *   snap-final + 250ms fade-out.
 *
 * Performance:
 *   - Loader pos:fixed inset-0 z-[200] hijacks viewport, але не блокує hydration
 *   - Timeline killed на unmount (cleanup)
 *   - GSAP core ~28KB gzipped + CustomEase ~3KB — у межах bundle-budget 200KB
 *   - 0 Router dependencies → mount у App.tsx ВИЩЕ за BrowserRouter дозволено
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Logo } from '../brand/Logo';
import { BlueprintCube } from './BlueprintCube';
import { hasSeenLoader, markLoaderSeen } from '../../lib/loaderState';
// Side-effect import: registers CustomEase + 'easeBrand' globally на GSAP
// (D-23 lockstep — третій repr брендової кривої).
import { gsap, EASE_BRAND_NAME } from '../../lib/gsapBrand';

const EASE_BRAND = EASE_BRAND_NAME;

// Per spec: «01/05 · ВИГОДА · LVIV 49°N · 04 PROJECTS» — first-load loader
// завжди показує позицію '01/05' (старт сайту). Адаптовано на українську
// з повним brand-блоком («5 ОБ’ЄКТІВ» — 1 active Lakeview + 4 pipeline = 5).
const TYPEWRITER_LINE = '01 / 05 · ВИГОДА · ЛЬВІВ · 49°N · 5 ОБ’ЄКТІВ';

export function BlueprintLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const seen = hasSeenLoader();
    const skipFullIntro = seen || prefersReducedMotion;

    // Snap-final helper — використовується або у quick-path, або у skip handler.
    // gsap.set() — instant property mutation без timeline.
    const snapFinal = () => {
      gsap.set('[data-cube-stroke] path', { strokeDashoffset: 0 });
      gsap.set('[data-cube-fill]', { opacity: 0.6 });
      gsap.set('[data-grain]', { opacity: 0.12 });
      gsap.set('[data-wordmark]', { opacity: 1, y: 0 });
      gsap.set('[data-typewriter-mask]', { clipPath: 'inset(0 0% 0 0)' });
    };

    const fadeOutAndUnmount = (duration: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      markLoaderSeen();
      gsap.to(root, {
        opacity: 0,
        duration,
        ease: 'none',
        onComplete: () => setMounted(false),
      });
    };

    // Quick path — repeat visit OR reduced-motion. Snap final, hold 150ms,
    // потім fade-out 250ms. Hold дає мозку зареєструвати «це сайт ВИГОДА»
    // навіть без full animation.
    if (skipFullIntro) {
      snapFinal();
      const t = window.setTimeout(() => fadeOutAndUnmount(0.25), 150);
      return () => window.clearTimeout(t);
    }

    // Full timeline — gsap.timeline() з position parameters. Position
    // syntax: `'-=N'` = N seconds overlap with end of previous, `'<'` =
    // same start as previous, default = sequential append.
    const tl = gsap.timeline({
      defaults: { ease: EASE_BRAND },
      onComplete: () => {
        // Hold 250ms на full-arrival стейті, потім fade-out 500ms.
        gsap.delayedCall(0.25, () => fadeOutAndUnmount(0.5));
      },
    });

    timelineRef.current = tl;

    tl
      // 1. Cube wireframe — 0.40s × 3 paths з stagger 0.10 = 0.60s total
      //    (per spec «лайм-лінія за 600ms»)
      .to('[data-cube-stroke] path', {
        strokeDashoffset: 0,
        duration: 0.40,
        stagger: 0.10,
      })
      // 2. Fill cross-fade — start 0.30s before strokes finish
      .to('[data-cube-fill]', {
        opacity: 0.6,
        duration: 0.45,
      }, '-=0.30')
      // 3. Grain — start 0.20s before fill ends
      .to('[data-grain]', {
        opacity: 0.12,
        duration: 0.40,
      }, '-=0.20')
      // 4. Wordmark — start 0.30s before grain ends (overlap)
      .to('[data-wordmark]', {
        opacity: 1,
        y: 0,
        duration: 0.45,
      }, '-=0.30')
      // 5. Typewriter — clip-path L→R, linear ease для machine-feel
      .to('[data-typewriter-mask]', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.50,
        ease: 'none',
      }, '-=0.15');

    // Skip-механіка — будь-яка user-interaction обриває сцену.
    const skip = () => {
      if (finishedRef.current) return;
      timelineRef.current?.kill();
      snapFinal();
      window.setTimeout(() => fadeOutAndUnmount(0.25), 80);
      detach();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skip();
    };
    const detach = () => {
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };
    window.addEventListener('click', skip);
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });

    return () => {
      timelineRef.current?.kill();
      detach();
    };
  }, [prefersReducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Завантаження сайту ВИГОДА"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      style={{ willChange: 'opacity' }}
    >
      {/* Grain overlay — repeating SVG-pattern data-uri (zero-asset, ~80B per
          tile). Subtle dot-grid additive texture для blueprint-paper feel. */}
      <div
        data-grain
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='1' cy='1' r='0.6' fill='%23C1F33D'/></svg>\")",
          backgroundSize: '40px 40px',
        }}
      />

      {/* Stage — cube + wordmark stack */}
      <div className="relative flex flex-col items-center gap-12">
        <BlueprintCube
          className="h-[280px] w-[280px] md:h-[360px] md:w-[360px]"
          strokeWidth={0.8}
        />

        <div
          data-wordmark
          style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform' }}
        >
          <Logo className="h-10 w-auto md:h-14" title="ВИГОДА" />
        </div>
      </div>

      {/* Typewriter — bottom band, blueprint-style annotation з ratio numeral */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-8">
        <div
          data-typewriter-mask
          className="overflow-hidden"
          style={{
            clipPath: 'inset(0 100% 0 0)',
            willChange: 'clip-path',
          }}
        >
          <p
            className="whitespace-nowrap text-[13px] font-medium uppercase text-text-muted tabular-nums"
            style={{ letterSpacing: '0.18em' }}
          >
            {TYPEWRITER_LINE}
          </p>
        </div>
      </div>

      <span className="sr-only">Завантаження</span>
    </div>
  );
}
