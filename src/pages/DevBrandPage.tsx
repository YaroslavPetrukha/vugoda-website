/**
 * @module pages/DevBrandPage
 *
 * Hidden QA surface (D-25, D-26) — accessible via /#/dev/brand,
 * NOT linked from Nav. Showcases all brand primitives standalone for
 * pixel-level visual QA before client demo.
 *
 * Scope per RESEARCH Open Question 7: primitives ONLY (atoms).
 * Sample compositions (real flagship/pipeline cards) are Phase 4's
 * /dev/grid responsibility.
 *
 * The 6 hex literals declared in the PALETTE const are the canonical
 * brandbook palette and are whitelisted by scripts/check-brand.ts —
 * displaying them on this surface is the entire point of the QA route.
 *
 * NO inline Motion transition objects — Phase 5 owns easing config (Pitfall 14).
 */

import { Logo } from '../components/brand/Logo';
import { Mark } from '../components/brand/Mark';
import { IsometricCube } from '../components/brand/IsometricCube';
import { IsometricGridBG } from '../components/brand/IsometricGridBG';

/** 6 brandbook hexes — order matches @theme block in src/index.css */
const PALETTE = [
  { token: '--color-bg', hex: '#2F3640', name: 'bg' },
  { token: '--color-bg-surface', hex: '#3D3B43', name: 'bg-surface' },
  { token: '--color-bg-black', hex: '#020A0A', name: 'bg-black' },
  { token: '--color-accent', hex: '#C1F33D', name: 'accent' },
  { token: '--color-text', hex: '#F5F7FA', name: 'text' },
  { token: '--color-text-muted', hex: '#A7AFBC', name: 'text-muted' },
] as const;

/** Type-size ladder for Montserrat weight matrix */
const TYPE_SIZES = [14, 16, 20, 24, 40, 56, 80, 180] as const;
const WEIGHTS = [
  { weight: 400, label: 'Regular' },
  { weight: 500, label: 'Medium' },
  { weight: 700, label: 'Bold' },
] as const;

/** Allowed cube strokes (matches IsometricCubeProps['stroke']) */
const STROKES = ['#A7AFBC', '#F5F7FA', '#C1F33D'] as const;
const OPACITIES = [0.3, 0.6] as const;
const VARIANTS = ['single', 'group', 'grid'] as const;

export default function DevBrandPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-text">
      <h1 className="mb-12 font-bold text-4xl">/dev/brand</h1>
      <p className="mb-24 max-w-3xl text-base text-text-muted">
        Hidden QA surface. Not linked from Nav. Showcases brand primitives
        for visual regression checks. Phase 3 D-25.
      </p>

      {/* === Palette === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">Палітра</h2>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
          {PALETTE.map((c) => (
            <div key={c.token} className="flex flex-col gap-2">
              <div
                className="h-32 w-full border border-bg-surface"
                style={{ backgroundColor: c.hex }}
                aria-hidden="true"
              />
              <span className="font-medium text-sm text-text">{c.name}</span>
              <span className="text-xs text-text-muted">{c.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* === Typography === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">Типографіка</h2>
        <div className="flex flex-col gap-12">
          {WEIGHTS.map(({ weight, label }) => (
            <div
              key={weight}
              className="flex flex-col gap-3 border-l-2 border-bg-surface pl-4"
            >
              <span className="font-medium text-xs uppercase tracking-wider text-text-muted">
                Montserrat {weight} · {label}
              </span>
              {TYPE_SIZES.map((px) => (
                <span
                  key={px}
                  style={{ fontWeight: weight, fontSize: `${px}px`, lineHeight: 1.2 }}
                >
                  {px}px — ВИГОДА
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* === Logo === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">Лого (dark.svg)</h2>
        <div className="flex flex-wrap items-end gap-12 bg-bg-surface p-8">
          <Logo className="h-14 w-auto" />
          <Logo className="h-48 w-auto" />
        </div>
      </section>

      {/* === Mark === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">Знак (mark.svg)</h2>
        <div className="bg-bg-surface p-8">
          <Mark className="h-24 w-auto" />
        </div>
      </section>

      {/* === Wordmark sample === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">Wordmark (H1 hero scale)</h2>
        <div className="bg-bg-surface p-8">
          <span className="block font-bold uppercase tracking-tight text-[clamp(80px,8vw,180px)] leading-none text-text">
            ВИГОДА
          </span>
        </div>
      </section>

      {/* === IsometricCube matrix: 3 variants × 3 strokes × 2 opacities === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">
          Куб — 3 варіанти × 3 кольори × 2 непрозорості
        </h2>
        {VARIANTS.map((variant) => (
          <div key={variant} className="mb-8">
            <h3 className="mb-4 font-medium text-sm uppercase tracking-wider text-text-muted">
              variant=&quot;{variant}&quot;
            </h3>
            <div className="grid grid-cols-3 gap-4 bg-bg-surface p-6">
              {STROKES.map((stroke) =>
                OPACITIES.map((opacity) => (
                  <div
                    key={`${stroke}-${opacity}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="h-32 w-32">
                      <IsometricCube
                        variant={variant}
                        stroke={stroke}
                        opacity={opacity}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="text-xs text-text-muted">
                      {stroke} · {opacity}
                    </span>
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </section>

      {/* === IsometricGridBG @ 0.10 and 0.20 === */}
      <section className="mb-24">
        <h2 className="mb-8 font-bold text-2xl">
          IsometricGridBG (opacity 0.10 / 0.20)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-64 overflow-hidden bg-bg-black">
            <IsometricGridBG opacity={0.1} className="h-full w-full" />
            <span className="absolute bottom-2 left-2 text-xs text-text-muted">
              opacity 0.10
            </span>
          </div>
          <div className="relative h-64 overflow-hidden bg-bg-black">
            <IsometricGridBG opacity={0.2} className="h-full w-full" />
            <span className="absolute bottom-2 left-2 text-xs text-text-muted">
              opacity 0.20
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
