/**
 * @module components/loader/BlueprintCube
 *
 * SVG-серце BlueprintLoader. Два layer-и однакової геометрії, обидва
 * успадковують path data 1:1 з brand-assets/mark/mark.svg (220.6×167.4
 * viewBox, 3 isometric-cube faces — top/right/left). Жодних ручних
 * polygon-перерисовок: brandbook geometry — single source of truth
 * (PITFALLS §Anti-Pattern 4).
 *
 * Layer 1 — `[data-cube-stroke]`:
 *   Wireframe phase. fill: none, stroke: accent, pathLength=1,
 *   strokeDasharray=1, strokeDashoffset=1 (схований). Parent
 *   BlueprintLoader animate-ить strokeDashoffset до 0 послідовно по
 *   3-х paths — створює CAD-style draw-on (svg-animations skill).
 *
 * Layer 2 — `[data-cube-fill]`:
 *   Brandbook fill phase. opacity 0 → 0.6 (інтринзік mark.svg —
 *   IsometricCube wrapper-default ×0.5 = ефективні 0.3, але loader
 *   досяжний максимум 0.6 для драматичнішої arrival).
 *
 * Wireframe stays visible under fill (stroke 1px overlays fill 0.6 —
 * читається як «креслення проявлено в реальність»). На кінці послідовності
 * stroke fade'ить до 0 опціонально (parent вирішує).
 *
 * Композиція: parent контролює timing 100% — компонент рендерить лише
 * baseline-hidden state. Під prefers-reduced-motion parent просто snap-ить
 * до final state без анімації (через duration: 0).
 *
 * @rule компонент чисто-presentational; жодних refs, жодних useEffect,
 *   жодних imports з motion/react. Parent controls everything.
 */

const PATHS = [
  // Top diamond face — drawn first (apex of cube reads as «початок»)
  'M110.3,136.11l-44.58-25.74,44.58-25.74,44.58,25.74-44.58,25.74ZM67.72,110.37l42.58,24.59,42.58-24.59-42.58-24.59-42.58,24.59Z',
  // Right side face — drawn second (rightward sweep як архітектор)
  'M155.95,108.52l-44.58-25.74V31.3l44.58,25.74v51.48ZM112.37,82.2l42.58,24.59v-49.17l-42.58-24.59v49.17Z',
  // Left side face — drawn third (closes the form, reveals depth)
  'M64.65,108.52v-51.48l44.58-25.74v51.48l-.25.14-44.33,25.6ZM65.65,57.61v49.17l42.58-24.59v-49.17l-42.58,24.59Z',
] as const;

export interface BlueprintCubeProps {
  className?: string;
  /** Stroke-width у SVG units (viewBox 220×167). Default 0.8 →
   *  ~1px на screen при cube width 280-360px (per spec «тонка обводка 1px»). */
  strokeWidth?: number;
}

/**
 * CAD-blueprint stylistic choice notes (svg-animations skill checklist):
 *
 * - `stroke-linecap="butt"` + `stroke-linejoin="miter"` — навмисний CAD-look.
 *   Skill general guidance рекомендує `round` для polish, але це для loaders/
 *   icons general-purpose. Тут — технічне креслення, sharp corners читаються
 *   як «креслярська чорнильна ручка», не як полуцукерочна loader-anim.
 *
 * - `pathLength="1"` нормалізація — кожен compound path (outer rhombus + inner
 *   counter-cutout через ZM) повідомляє SVG про total length = 1 unit. Стандарт
 *   SVG 2 (Chrome 88+, Firefox 87+, Safari 14.1+, всі 2021+) розподіляє
 *   strokeDasharray/strokeDashoffset пропорційно по sub-paths — outer і inner
 *   рисуються одночасно як подвійна лінія, що додає CAD-вірогідності.
 *
 * - `aria-hidden="true"` — куб декоративний у контексті BlueprintLoader, який
 *   сам виставляє role="status" + aria-label="Завантаження". Дублювати
 *   announcement через role="img" + <title> = шум для screen reader.
 */
export function BlueprintCube({
  className,
  strokeWidth = 0.8,
}: BlueprintCubeProps) {
  return (
    <svg
      viewBox="0 0 220.6 167.4"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* WIREFRAME LAYER — stroke-only, draw-on via dashoffset */}
      <g
        data-cube-stroke
        fill="none"
        stroke="#C1F33D"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      >
        {PATHS.map((d, i) => (
          <path
            key={`stroke-${i}`}
            d={d}
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
            }}
          />
        ))}
      </g>

      {/* FILL LAYER — original brandbook fill, opacity 0 → 0.6 */}
      <g
        data-cube-fill
        fill="#C1F33D"
        style={{ opacity: 0 }}
      >
        {PATHS.map((d, i) => (
          <path key={`fill-${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
