/**
 * @module components/layout/BlueprintGridSweep
 *
 * Route-transition blueprint-grid сворачивается-розворачивается за 350ms
 * (per spec Top #1 «Page transitions = той же blueprint-grid»).
 *
 * Mechanism: одинокий fixed-inset SVG-overlay з паралельними lime-hairlines
 * під 30° (isometric brand-code, лівий нижній → правий верхній). На кожен
 * route change запускається GSAP-tween: scaleY 0 → 1 → 0 з origin-center —
 * сітка «розгортається з горизонтальної лінії», тримається мить, потім
 * згортається назад. Загальна тривалість 350ms (175 unwrap + 175 wrap).
 *
 * Накладається ПОВЕРХ pageCurtain (existing W7 clip-path content sweep у
 * Layout.tsx) — два паралельні шари cinematic-language:
 *   pageCurtain  → content clip-path L→R 0.6s + 0.5s (header/footer лишаються)
 *   GridSweep    → overlay scaleY 350ms (читається як «креслення мерехтить
 *                  на стику сторінок»)
 *
 * Position: z-40 (вище content/Nav z-50? — fix: z-30, нижче за Nav який
 * z-50). Pointer-events none — не блокує click-through за останні ~10ms,
 * якщо користувач спам-натискає nav. fixed inset-0.
 *
 * First-mount skip: BlueprintLoader на старті сайту вже показує full
 * blueprint-arrival — додатковий sweep при initial mount = подвоєння motion.
 * `firstMountRef` — пропускає sweep для першого pathname (rоут '/' зазвичай).
 *
 * RM threading: useReducedMotion — повертає null. Жодного DOM-у, жодного
 * GSAP, нуль cost для motion-sensitive користувачів.
 *
 * @rule layout/-Folder boundary: imports lib/ + brand/ заборонено (немає
 *   потреби — SVG inline). Імпорти: react, react-router-dom, gsap,
 *   motionVariants (для D-23 lockstep — easeBrand).
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
// Side-effect import: registers 'easeBrand' CustomEase globally (D-23 lockstep).
import { gsap, EASE_BRAND_NAME } from '../../lib/gsapBrand';

export function BlueprintGridSweep() {
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const firstMountRef = useRef(true);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Перший mount — loader тримає arrival, не дублюємо sweep.
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Cancel будь-який in-flight tween (швидкі pathname changes — chip
    // clicks на /projects спам-набирає search params, але pathname stays
    // same, тому це лише захист від rapid back/forward navigation).
    tweenRef.current?.kill();

    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.175, ease: 'easeBrand' },
    ).to(el, {
      scaleY: 0,
      opacity: 0,
      duration: 0.175,
      ease: EASE_BRAND_NAME,
    });
    tweenRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [pathname, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        // `scaleY: 0` is not a CSS property — використовуємо transform-string
        // initial. GSAP перехопить transform через transform-manager при
        // першому tween, перевизначивши inline string без conflict.
        transform: 'scaleY(0)',
        transformOrigin: 'center',
        opacity: 0,
      }}
    >
      {/*
        Blueprint grid SVG — паралельні hairlines під 30° (isometric brand
        кут, узгоджено з IsometricGridBG.svg в hero overlay). Lime #C1F33D
        @ 0.3 opacity — присутність є, але не закриває content. ViewBox
        нормалізовано через preserveAspectRatio="none" + 100% width/height
        для повного покриття viewport.

        Лінії побудовано як 12 паралельних line-elements з step=64 у 30°
        напрямку. На 1920×1080 видно ~7-9 ліній — щільність credible-без-
        захаращення.
      */}
      <svg
        className="h-full w-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="blueprintGridPattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            {/* Одинокий горизонтальний штрих per tile — pattern repeats by 64px */}
            <line
              x1="0"
              y1="0"
              x2="64"
              y2="0"
              stroke="#C1F33D"
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#blueprintGridPattern)"
        />
      </svg>
    </div>
  );
}
