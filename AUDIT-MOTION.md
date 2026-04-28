# Аудит Motion Design — vugoda-website

**Дата:** 2026-04-27
**Аудитор:** Frontend / Motion Design Specialist
**Live URL:** https://yaroslavpetrukha.github.io/vugoda-website/
**Скоп:** анімація і motion-шар (Motion 12.38, CSS @keyframes, scroll-driven UI)
**Стек:** Vite 6 + React 19 + Tailwind v4 + Motion `^12.38.0`, без Three.js / Lottie / GSAP

---

## 0. Executive summary

Поточний стан motion-шару — **технічно акуратний, інженерно дисциплінований, але креативно мертвий**. Bundle-чистота, RM-threading, стабільні easing-токени, єдиний SOT для variants, відсутність inline-transition objects — це premium-grade engineering. Те що візуально віддається користувачу — **bootstrap-level fade-up + opacity page-transitions + 1.02 scale hover**, тобто базовий React-template 2019 року.

Premium real-estate сайт зараз тримається на типографіці і пропорціях. У 2026 індустрія розв'язала набагато більшу мову руху: scroll-velocity-driven type, layoutId-shared elements, image-reveal masks, 3D-перспективні куби в hero, magnetic CTA, marquee taglines, choreographed cinematic page-transitions. Все це досягається на існуючому стеку без додавання Three.js і без розриву performance budget.

| Вимір | Оцінка | Коментар |
|---|---|---|
| **Modernity (2026 Awwwards bar)** | **3.5 / 10** | Хороший fundament, але mood «довідник школи». Немає жодного «WOW»-моменту, який запам'ятовується. |
| **Brand consistency** | **8 / 10** | `easeBrand` cubic-bezier(0.22,1,0.36,1) + 200/400/1200ms — дисципліновано і саме це, чого вимагає brand voice «стримано». Жодних bouncy-springs. |
| **Performance** | **9 / 10** | Motion 12.38 ~ 35–40 kB gzipped, lazy-loaded через React.lazy. Variants tree-shaken. RM-fallback unwrap'ить компоненти, IntersectionObserver один на instance. CSS-only spinner. |
| **Accessibility (RM threading)** | **9 / 10** | `useReducedMotion()` в Hero, RevealOnScroll, Layout. CSS-fallback для hover-card і mark-pulse. ОДИН пробіл — на ConstructionTeaser scroller `scroll-smooth` не реагує на RM (детально нижче). |
| **Креатив / WOW-фактор** | **2 / 10** | Парралакс на 100px і fade-up на всіх секціях. Немає вау-моментів. |

**Вердикт:** інфраструктура для motion-шару готова на 90%. Креативу не вистачає на 80%. Цей аудит — план підняти креатив до 8/10 без жертв performance/a11y/brand.

---

## 1. Інвентар поточного motion-шару (повний)

### 1.1 Глобальний SOT — `src/lib/motionVariants.ts`

```ts
easeBrand   = [0.22, 1, 0.36, 1]              // brand expo-out
durations   = { fast: 0.2, base: 0.4, slow: 1.2 }
fadeUp      = opacity 0→1, y 24→0, 400ms
fade        = opacity 0→1, 400ms
stagger     = staggerChildren 80ms
pageFade    = enter 400ms / exit 350ms opacity
parallaxRange = [0, -100]
```

**Сильні сторони:**
- Жорсткий лімерейтинг до 5 variants — neither over-engineered nor under-specified.
- Coupling rule між JS-кортежем `easeBrand` і CSS-змінною `--ease-brand` — задокументовано у файлі (D-23).
- `as const` для `easeBrand` дає Motion типобезпечний bezier.

**Слабкі сторони:**
- **Жодних variants для image-reveal**, **layout transitions**, **scroll-velocity**, **magnetic**, **marquee**, **clip-path reveal** — тобто всього сучасного motion-словника.
- `stagger.staggerChildren = 80ms` — універсальний для всіх секцій. Cards (4 шт.) хочуть швидше, paragraph-paragraph (2 шт.) хочуть повільніше, gallery thumbs (8) хочуть експоненційну криву, не лінійну.
- **Немає `easeBrandIn`** (для exits) — поточний `easeBrand` це expo-out, який гарний на enter, але на exit виглядає «лінивим».

### 1.2 RM threading — пройдено по всіх місцях

| Місце | RM fallback | Вердикт |
|---|---|---|
| Hero parallax | `[0, 0]` collapse | OK |
| RevealOnScroll | unwrap до `<as>` без motion wrapper | OK, найкращий патерн |
| Layout pageFade | `{ hidden:1, visible:1, exit:1 }` no-op variant | OK |
| `.hover-card` | nested `@media (prefers-reduced-motion: reduce)` | OK |
| `.mark-pulse` | static opacity 0.6 | OK |
| ConstructionTeaser scroller | **`scroll-smooth` НЕ обернено в RM** | **MINOR ISSUE** — браузер сам поважає `prefers-reduced-motion` для `scroll-behavior: smooth` (CSSWG спека), але документувати не зайве. |
| StageFilter chip transition | inline `transition-[background-color,color,border-color] duration-200` | **MINOR ISSUE** — Tailwind transition-class не має автоматичного RM-fallback. Hover/active не критично, але Tailwind `motion-reduce:transition-none` варто додати. |

### 1.3 Анімовані елементи на сайті

| Елемент | Тип | Тривалість | Easing |
|---|---|---|---|
| Hero parallax (grid фон) | scroll-driven translateY | linked to scroll | linear |
| BrandEssence cards | fade-up + stagger | 400ms | easeBrand |
| FlagshipCard hover | scale 1.02 + box-shadow accent 15% | 200ms | easeBrand |
| PipelineCard hover | scale 1.02 + box-shadow accent 15% | 200ms | easeBrand |
| ZhkGallery thumb hover | scale 1.02 + box-shadow accent 15% | 200ms | easeBrand |
| MonthGroup thumb hover | scale 1.02 + box-shadow accent 15% | 200ms | easeBrand |
| StageFilter chip hover | border-color, color | 200ms | easeBrand |
| Lightbox open/close | native `<dialog>` showModal — без анімації | — | — |
| ConstructionTeaser arrow scroll | `scrollBy({ behavior: 'smooth' })` | browser default | browser default |
| Page transition | opacity 0/1 | 400/350ms | easeBrand |
| MarkSpinner | opacity 0.4↔0.8 alternate | 1.2s | easeBrand |
| RevealOnScroll | fade-up | 400ms | easeBrand |
| RevealOnScroll stagger | 80ms cascade | — | — |

**Це 13 ефектів, з яких 8 — варіації одного fade-up і одного scale-hover.** Effective unique motion patterns ≈ **3**: parallax, fade-up, scale-hover. Premium-developer сайт має нести 12–15 effective patterns.

### 1.4 Чого нема (gap analysis)

- ❌ Магнітні кнопки (CTA pull до курсора)
- ❌ Кастомний курсор (з content-aware blending — circle-on-hover-text-becomes-pill)
- ❌ Marquee/scroll-velocity TEXT
- ❌ Scroll-snap pinned sections
- ❌ Image-reveal masks (clip-path inset wipes)
- ❌ Skew-on-scroll-velocity
- ❌ Layout transitions через `layoutId` (shared element між Pipeline grid → Zhk hero)
- ❌ SVG `<animate>` / draw-on / path-tracing
- ❌ Кінематографічний intro (logo lock-up reveal на першу візит)
- ❌ Animated cube primitives (IsometricCube існує, але статичний)
- ❌ Mouse-parallax (multilayer cube depth)
- ❌ Number count-up (для майбутнього «27 років досвіду» / м²)
- ❌ Scroll-driven video segments
- ❌ Scrambled text reveal (заголовок типу «ВИГОДА» декодується)
- ❌ Текст-ліфт по літерах (split-text)

---

## 2. Performance check

### 2.1 Motion bundle footprint

Motion 12.38.0 — кор API `motion`, `useScroll`, `useTransform`, `useReducedMotion`, `AnimatePresence`. Це **~35–40 kB gzipped** (Motion v12 дуже добре tree-shake'нутий, гірше ніж GSAP core ~28kB, але краще ніж framer-motion v6 ~52kB). На лазі чанк, бо сторінки лежать за `React.lazy`. **OK для 200 kB JS budget.**

### 2.2 Tree-shake перевірка

Поточний імпорт — named-only: `import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'`. Це вже tree-shake friendly. Якщо додавати `LayoutGroup`, `motionValue`, `useDragControls` — кожне додає 2–4 kB.

### 2.3 Що треба закласти у бюджет при імплементації рекомендацій нижче

| Pattern | Мотіon API | Cost (gzipped) |
|---|---|---|
| Magnetic button | `useMotionValue` + `useSpring` | +3 kB |
| layoutId shared element | `<motion.div layoutId>` + `LayoutGroup` | +6 kB |
| Marquee | pure CSS animation | 0 kB |
| Image reveal mask | `clip-path` + `useTransform` (вже є) | 0 kB |
| Scrambled text | own hook ~0.3 kB | +0.3 kB |
| Custom cursor | `useMotionValue` + `useSpring` (вже використовуєш) | 0 kB (reuse) |
| Mouse parallax cubes | те саме | 0 kB |

**Мax потенційний bundle bloat від рекомендацій нижче: ~10–12 kB gzipped.** Все ще в межах 200 kB JS budget.

---

## 3. Accessibility audit (RM threading) — пройдено детально

| # | Поверхня | RM threading | Висновок |
|---|---|---|---|
| 1 | `Hero.tsx` parallax | `useReducedMotion()` → `[0, 0]` | ✅ OK |
| 2 | `Hero.tsx` session-skip | `useSessionFlag('vugoda:hero-seen')` | ✅ Не RM-related, але зменшує WOW-momentum для 2-го перегляду — див. §6 |
| 3 | `RevealOnScroll.tsx` | RM → unwrap motion wrapper до plain `<as>` tag | ✅ Найкращий pattern (no IO observer мертвим спостерігачем) |
| 4 | `Layout.tsx` pageFade | RM → no-op variants `{1,1,1}` | ✅ OK |
| 5 | `BrandEssence`, `PortfolioOverview`, `MethodologyTeaser`, `TrustBlock` | спадково через `RevealOnScroll` | ✅ OK |
| 6 | `ConstructionTeaser` | через `RevealOnScroll` для секції; **scroll-smooth ARROW не RM-thread** | ⚠️ Браузер для `scroll-behavior` поважає RM автоматично, але `scrollBy({behavior:'smooth'})` JS-API НЕ автоматично. **TODO** додати: `behavior: prefersReducedMotion ? 'auto' : 'smooth'` |
| 7 | `Lightbox` | native `<dialog>` без motion | ✅ Tehnochno OK; але див. §5.7 — додавання fade-in для backdrop не повинно ламати RM |
| 8 | `StageFilter` chips | Tailwind `transition-[background-color]` | ⚠️ Додати `motion-reduce:transition-none` |
| 9 | `.hover-card` utility | nested `@media (prefers-reduced-motion: reduce)` | ✅ OK |
| 10 | `.mark-pulse` utility | global `@media` rule | ✅ OK |

**Загальний вердикт A11Y:** **9/10**. Дві дрібні дірки (#6, #8) — nitpicks, легко закрити в одному PR.

---

## 4. Brand consistency

`easeBrand = cubic-bezier(0.22, 1, 0.36, 1)` — це **expo-out з міцним m'яким приземленням**. Це САМЕ правильний вибір для бренду «системний девелопмент / стримано / без bouncy». Жодного `spring(stiffness, damping)` в коді немає — і це добре, springи в premium sense ніколи не виглядають серйозно.

Тривалості:
- 200ms (hover micro-interactions) — стандарт
- 400ms (reveal/page-transitions) — стандарт
- 1200ms (mark-pulse) — стандарт slow-organic

**Коментар:** для cinematic-моментів (Hero opening, page-transitions) **400ms короткувато**. Premium-real-estate Awwwards-level зазвичай у 600–900ms для головних transitions. Рекомендую додати `durations.cinematic = 0.9` спеціально для Hero intro і for page-curtain (див. §5.13).

---

## 5. ТОП-15 рекомендацій (з кодом)

Кожна рекомендація містить:
- **What** — що додаємо
- **Where** — конкретний файл
- **Variant** для `motionVariants.ts` (якщо потрібен)
- **Code** — ready-to-paste
- **RM fallback** — як ведеться при `prefers-reduced-motion`
- **Performance** — bundle/runtime оцінка
- **Brand fit** — чому стримано

---

### REC-01. Hero: cinematic opening (multi-layer reveal logo + slogan + CTA)

**Where:** `src/components/sections/home/Hero.tsx`

**Why:** Зараз hero на першу візит просто з'являється. Парралакс — це reaction на scroll, не на mount. Premium-developer треба **1 раз на сесію** показати кінематографічний lock-up: фон проявляється → wordmark «опускається» з масштабу 1.05 → slogan fade-up → CTA fade-up. Реgexto stagger + один-два cubic-bezier-ы.

**New variant у `motionVariants.ts`:**

```ts
// додай нижче existing exports
export const heroIntroParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

export const heroBgFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.15,                              // = IsometricGridBG opacity
    transition: { duration: 1.2, ease: easeBrand },
  },
};

export const heroWordmark: Variants = {
  hidden: { opacity: 0, scale: 1.05, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeBrand },
  },
};

export const heroSlogan: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeBrand },
  },
};
```

**Hero.tsx code:**

```tsx
const skipIntro = prefersReducedMotion || heroSeen;

return (
  <section ref={heroRef} className="relative ... overflow-hidden bg-bg">
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ y: cubeY }}
      variants={skipIntro ? undefined : heroBgFade}
      initial={skipIntro ? false : 'hidden'}
      animate={skipIntro ? undefined : 'visible'}
    >
      <IsometricGridBG className="h-full w-full" opacity={skipIntro ? 0.15 : 1} />
    </motion.div>

    <motion.div
      className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 text-center"
      variants={skipIntro ? undefined : heroIntroParent}
      initial={skipIntro ? false : 'hidden'}
      animate={skipIntro ? undefined : 'visible'}
    >
      <motion.h1
        variants={skipIntro ? undefined : heroWordmark}
        className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text"
      >
        ВИГОДА
      </motion.h1>
      <motion.p
        variants={skipIntro ? undefined : heroSlogan}
        className="max-w-3xl text-xl text-text"
      >
        {heroSlogan}
      </motion.p>
      <motion.div variants={skipIntro ? undefined : heroSlogan}>
        <Link to="/projects" className="inline-flex ...">{heroCta}</Link>
      </motion.div>
    </motion.div>
  </section>
);
```

**RM fallback:** `skipIntro = prefersReducedMotion || heroSeen` → `initial={false}`, no variants, мить-рендер без анімації.

**Performance:** 0 додаткового bundle. Хіба що ~1 kB JSX.

**Brand fit:** 0.9s + cubic-bezier(0.22,1,0.36,1) = «впевнено приземляється» без bounce. Stagger 180ms дає глядачу час прочитати Hero як **речення-послідовність**, а не «одночасний flash».

---

### REC-02. Hero: 3-шаровий parallax (мультіperspective)

**Where:** `src/components/sections/home/Hero.tsx`

**Why:** Зараз parallax — один шар (фон → -100px). Premium-developer hero — це 3-шаровий depth: дальній шар повільно, середній з нормальною швидкістю (= scroll), фронт — швидше (overshoots на сlightly negative). Дає реальне відчуття 3D без Three.js.

**Code:**

```tsx
const cubeYBack   = useTransform(scrollYProgress, [0, 1], skipParallax ? [0, 0] : [0, -60]);
const cubeYMid    = useTransform(scrollYProgress, [0, 1], skipParallax ? [0, 0] : [0, -120]);
const cubeYFront  = useTransform(scrollYProgress, [0, 1], skipParallax ? [0, 0] : [0, -180]);
const cubeOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

// JSX:
<motion.div className="absolute inset-0" style={{ y: cubeYBack, opacity: cubeOpacity }}>
  <IsometricGridBG className="h-full w-full" opacity={0.06} />
</motion.div>
<motion.div className="absolute inset-0" style={{ y: cubeYMid }}>
  <IsometricGridBG className="h-full w-full" opacity={0.1} />
</motion.div>
<motion.div className="absolute inset-0 [transform:translateZ(0)]" style={{ y: cubeYFront }}>
  <IsometricGridBG className="h-full w-full" opacity={0.18} />
</motion.div>
```

**RM fallback:** `skipParallax → [0,0]` для всіх трьох шарів (як зараз).

**Performance:** 3 transforms замість 1, але всі GPU-acelerated. Мінімально (<0.5 ms/frame).

**Brand fit:** opacity 0.06 / 0.1 / 0.18 — всі в межах 0.05–0.20 brandbook диапазону для grid (D-03 ceiling). `--mid-band` стандарт зберігається.

---

### REC-03. Hero: mouse-parallax поверх scroll-parallax

**Where:** `src/components/sections/home/Hero.tsx`

**Why:** Awwwards-2026 patternу — на mouse-move фон трошки «дихає». Це ламає враження статичного hero до scroll. Поєднання з scroll-parallax = живий простір.

**Code (additional):**

```tsx
import { useMotionValue, useSpring, useTransform } from 'motion/react';

const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

// translate up to ±20px based on cursor position
const px = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
const py = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

useEffect(() => {
  if (prefersReducedMotion) return;
  const onMove = (e: PointerEvent) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  window.addEventListener('pointermove', onMove);
  return () => window.removeEventListener('pointermove', onMove);
}, [prefersReducedMotion]);

// merge with scroll y:
<motion.div style={{ x: px, y: useTransform([cubeYFront, py], ([s, m]) => (s as number) + (m as number)) }} />
```

**RM fallback:** `if (prefersReducedMotion) return` — обробник просто не реєструється.

**Performance:** `useSpring` ~ 0.5 kB add. Pointermove throttle через RAF не потрібен (Motion v12 уже batch'ить через MotionValue → render-pass).

**Brand fit:** ±20px у hero розміром 1920×1080 = ~1% — субтильно, нікого не вкачує.

---

### REC-04. Page transitions: cinematic curtain reveal (clip-path)

**Where:** `src/components/layout/Layout.tsx` + `motionVariants.ts`

**Why:** `pageFade` opacity-only — bootstrap-level. Premium varіанта — exit ділиться по diagonal/horizontal `clip-path: inset()`, потім нова сторінка emerges from opposite edge. Дає шар «cinematic continuity».

**New variant:**

```ts
// motionVariants.ts
export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 1.2,
  cinematic: 0.7,                  // new — for page-curtain
} as const;

export const pageCurtain: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',  // hidden = collapsed from bottom
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: durations.cinematic, ease: easeBrand },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(100% 0 0 0)',  // exit = collapse to top
    transition: { duration: 0.55, ease: easeBrand },
  },
};
```

**Layout.tsx:**

```tsx
const variants = prefersReducedMotion
  ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
  : pageCurtain;
```

**RM fallback:** no-op variants (як зараз).

**Performance:** `clip-path` = GPU compositor layer, без re-layout. 0 bundle add.

**Brand fit:** No bounce, no flash, no color overlay — це чистий «cut» через layout, що матчить «системний» tone. Якщо хочеш ще strict — можна замінити на горизонтальний (`inset(0 100% 0 0)`).

**Альтернатива (більш driven by accent):** додай оверлей-pannel `bg-accent` що залітає диагонально з top-right → covers viewport на 250ms → unfolds при enter нової сторінки. Цей варіант ВЖЕ на гран допустимого «стримано». Поверхня ділиться 50/50 — клієнт скаже yes/no.

---

### REC-05. Custom cursor — content-aware (text vs button vs image)

**Where:** новий файл `src/components/ui/Cursor.tsx` + регістрація в `Layout.tsx`

**Why:** Awwwards-2026 — custom cursor більше не «гімік», а brand instrument. На «системний» сайт він ідеально лягає: малий circle 8px на default → expands до pill «View →» на hover-button → expands до 60px circle outline на hover-image.

**Code:**

```tsx
// src/components/ui/Cursor.tsx
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

type Mode = 'default' | 'button' | 'image' | 'text';

export function Cursor() {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<Mode>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // hide on touch devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;
    setVisible(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role=button]')) setMode('button');
      else if (t.closest('img, picture')) setMode('image');
      else setMode('default');
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [prefersReducedMotion]);

  if (!visible) return null;

  const size = mode === 'image' ? 60 : mode === 'button' ? 40 : 8;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-accent mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{ width: size, height: size }}
      transition={{ duration: 0.2, ease: easeBrand }}
    />
  );
}
```

**Where to mount:** `Layout.tsx` під `<Footer/>` (поза AnimatePresence — не рестартується між сторінками).

**RM fallback:** `if (prefersReducedMotion) return` + перевірка `pointer: coarse` (тач-девайси, на mobile нема).

**Performance:** ~2 kB. Pointer-events: none значить навіть не блокує клікі. mix-blend-difference дає auto-contrast на світлих/темних блоках.

**Brand fit:** circle border 1px з accent-color = пряма цитата isometric line-language. Без jelly-spring, без trail-blur. Стримано.

**Caveat:** на «премʼюм» сайт custom cursor — на 50% трендовий, на 50% дратівливий. Перед прод-деплоєм — A/B з клієнтом. Якщо клієнт vetoes — не сваритися; чисто прибираємо одним рядком.

---

### REC-06. Magnetic CTAs (привʼязка до курсора)

**Where:** новий хук `src/hooks/useMagnet.ts` + застосовуємо до hero CTA, ContactForm CTA, ZhkCtaPair CTA.

**Why:** «Переглянути проекти» / «Ініціювати діалог» — ключові точки конверсії. Магніт-effect (10-15px pull до cursor) суттєво підвищує hover-engagement без зміни тексту/іконки.

**Code:**

```ts
// src/hooks/useMagnet.ts
import { RefObject, useEffect } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

export function useMagnet(ref: RefObject<HTMLElement>, strength = 0.25) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, strength, x, y]);

  return { x: sx, y: sy };
}
```

**Use:**

```tsx
// in Hero.tsx
const ctaRef = useRef<HTMLAnchorElement>(null);
const { x, y } = useMagnet(ctaRef, 0.25);

<motion.a
  ref={ctaRef}
  to="/projects"
  style={{ x, y }}
  className="inline-flex items-center bg-accent px-8 py-4 ..."
>
  {heroCta}
</motion.a>
```

**RM fallback:** перевірка `matchMedia('(prefers-reduced-motion: reduce)')` всередині useEffect.

**Performance:** 1 spring per CTA = ~0.5 kB shared. 3 CTAs site-wide.

**Brand fit:** strength=0.25 — легкий pull, не «жирний» магніт.

---

### REC-07. Animated cubes — IsometricCube ротація на scroll

**Where:** `src/components/brand/IsometricCube.tsx` + `AggregateRow.tsx` (де single-cube використовується)

**Why:** Куб — це визначальний бренд-символ і він зараз НУЛЬ-разів анімований у проекті. Premium move — додати на single-куб scroll-driven `rotateY` 0→360° від 0% → 100% scrollProgress секції в якій він живе. На AggregateRow це ідеально: куб «обертається», поки користувач читає текст про pipeline-4.

**Code (новий wrapper компонент):**

```tsx
// src/components/brand/AnimatedIsometricCube.tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { IsometricCube, type IsometricCubeProps } from './IsometricCube';

export function AnimatedIsometricCube(props: IsometricCubeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 360]);

  return (
    <motion.div ref={ref} style={{ rotate, perspective: 800 }} className="inline-block">
      <IsometricCube {...props} />
    </motion.div>
  );
}
```

**RM fallback:** rotate-range collapses to `[0, 0]`.

**Performance:** 1 useScroll per instance, GPU-accelerated transform. Use sparingly — 1 на головну, 1 на /projects empty-state. Не 8.

**Brand fit:** Cube IS the brand. Animation reinforces the «системний модуль» metaphor. NO bounce. Linear scroll-driven rotation = «механічна впевненість».

---

### REC-08. Scrambled text reveal на «ВИГОДА» wordmark

**Where:** новий хук `src/hooks/useScramble.ts` + Hero.tsx

**Why:** Один з найбільш бренд-підходящих ефектів 2026: word starts as random cyrillic glyphs (е.g. `Ы3Ж0Ъ2`) і протягом ~600ms кожна літера фіксується на вірному значенні зліва направо. Це ідеально пасує до «системний девелопмент» — символізує "вирішення системи".

**Code:**

```ts
// src/hooks/useScramble.ts
import { useEffect, useState, useRef } from 'react';

const ALPHABET = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789';

export function useScramble(target: string, durationMs = 700, enabled = true): string {
  const [out, setOut] = useState(enabled ? '' : target);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!enabled) { setOut(target); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const fixed = Math.floor(t * target.length);
      let s = target.slice(0, fixed);
      for (let i = fixed; i < target.length; i++) {
        s += target[i] === ' ' ? ' ' : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
      setOut(s);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, durationMs, enabled]);

  return out;
}
```

**Use:**

```tsx
// Hero.tsx
const scrambled = useScramble('ВИГОДА', 700, !skipIntro);

<h1 className="font-bold ...">{scrambled}</h1>
```

**RM fallback:** показуємо одразу `target` без animation.

**Performance:** 1 RAF, 6 setState calls. ~0.4 kB.

**Brand fit:** "система рішень" → text вирішується. Концептуально красиво. Не bounce, не sparkle, не glow — pure typography.

---

### REC-09. Marquee taglinе на /projects секція-розділювач

**Where:** новий компонент `src/components/sections/projects/Marquee.tsx` + ProjectsPage.tsx

**Why:** Між StageFilter і pipeline grid — порожнє місце. Premium real-estate сайти кладуть туди безшовний marquee з ключовими словами/датами. У brand voice: «системний девелопмент · 4 цінності · 27 років · 5 ЖК ·» — петля.

**Code (CSS-only):**

```tsx
// src/components/sections/projects/Marquee.tsx
import { useReducedMotion } from 'motion/react';

const ITEMS = [
  'СИСТЕМНИЙ ДЕВЕЛОПМЕНТ',
  '4 ЦІННОСТІ',
  '5 ЖК У ПОРТФЕЛІ',
  'ВИГОДА',
];

export function Marquee() {
  const prefersReducedMotion = useReducedMotion();
  const items = [...ITEMS, ...ITEMS]; // duplicate for seamless loop

  if (prefersReducedMotion) {
    return (
      <div className="flex gap-12 overflow-hidden border-y border-bg-surface py-6">
        {ITEMS.map((it) => (
          <span key={it} className="text-2xl font-bold text-text-muted">
            {it} <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-y border-bg-surface py-6">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {items.map((it, i) => (
          <span key={i} className="text-2xl font-bold text-text-muted">
            {it} <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

**index.css:**

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@utility animate-marquee {
  animation: marquee 30s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
}
```

**RM fallback:** компонент рендерить static row замість дублікату (без translation).

**Performance:** 0 JS. Pure CSS. 30s loop.

**Brand fit:** uppercase Bold Montserrat = brand wordmark style. Single-line, no decoration. accent dot як separator (точкова доза акцента).

---

### REC-10. Image-reveal mask для FlagshipCard і ZhkHero

**Where:** wrapper навколо `<ResponsivePicture>` у `FlagshipCard.tsx` і `ZhkHero.tsx`

**Why:** Зараз картинки fade-up разом з родителем. Premium-pattern — `clip-path` mask reveal знизу-вгору (як «штора піднімається»). Subtle, але масштабує hero до cinematic. Не «зум-ін Apple-style» (це банально), а саме clip-path inset.

**New variant:**

```ts
export const imageReveal: Variants = {
  hidden: {
    clipPath: 'inset(0 0 100% 0)',
    scale: 1.05,
  },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    scale: 1,
    transition: {
      clipPath: { duration: 1.0, ease: easeBrand },
      scale:    { duration: 1.4, ease: easeBrand },
    },
  },
};
```

**Use:**

```tsx
// FlagshipCard.tsx
<motion.div variants={imageReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  <ResponsivePicture ... />
</motion.div>
```

**RM fallback:** RevealOnScroll already unwraps; для standalone — додай  `useReducedMotion()` і повертай simple wrapper. Або в `motionVariants.ts`:

```ts
export const imageRevealRM: Variants = { hidden: { opacity: 1 }, visible: { opacity: 1 } };
```

і в компоненті:
```tsx
const v = prefersReducedMotion ? imageRevealRM : imageReveal;
```

**Performance:** clip-path GPU-accelerated. scale 1.05 → 1 — вже звичний transform. 0 bundle add.

**Brand fit:** «штора відкриває правду» = brand «доказовий, прозорий».

---

### REC-11. Stagger differentiation — диференційний cadence

**Where:** `src/lib/motionVariants.ts` + точкові оновлення у consumers

**Why:** Зараз `staggerChildren: 0.08` для всіх 5 стек-секцій. На 4 cards (BrandEssence) це OK. На 8 thumbs (ZhkGallery) це 640ms total → відчувається LONG. На 3 cards (MethodologyTeaser) занадто швидко. Premium-design — диференційно.

**Recipe:**

```ts
// motionVariants.ts
export const staggerCadence = {
  tight:  0.04,   // dense lists (gallery 8 items)
  base:   0.08,   // 3-4 cards
  relaxed:0.12,   // 2-paragraph reveal
  hero:   0.18,   // hero intro per REC-01
} as const;
```

**Use:**

```tsx
// ZhkGallery.tsx
<RevealOnScroll staggerChildren={staggerCadence.tight * 1000} ...>

// MethodologyTeaser.tsx (3 items, narrative-pace)
<RevealOnScroll staggerChildren={staggerCadence.relaxed * 1000} ...>
```

**RM fallback:** RevealOnScroll already unwraps under RM.

**Brand fit:** контрольована різноманітність. Без хаосу.

---

### REC-12. ConstructionLog — pinned month-headers + scroll progress bar

**Where:** `src/pages/ConstructionLogPage.tsx` + `MonthGroup.tsx`

**Why:** /construction-log — найдовша сторінка. Зараз скрол іде по «однорідній стрічці» без orientation. Premium-pattern — sticky header з місяцем + progress-bar зверху що заповнюється від 0 до 1 коли користувач скролить через лог. Дає сенс часу.

**Sticky header:**

```tsx
// MonthGroup.tsx
<RevealOnScroll as="section" className="bg-bg py-16">
  <div className="mx-auto max-w-7xl px-6">
    <h2 className="sticky top-20 z-10 -mx-6 mb-8 bg-bg/95 px-6 py-3 backdrop-blur font-bold text-3xl text-text">
      {month.label} · {month.photos.length} фото
    </h2>
    {/* ... */}
  </div>
</RevealOnScroll>
```

**Progress bar:**

```tsx
// ConstructionLogPage.tsx
import { motion, useScroll, useReducedMotion } from 'motion/react';

const { scrollYProgress } = useScroll();
const prefersReducedMotion = useReducedMotion();

return (
  <>
    {!prefersReducedMotion && (
      <motion.div
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
    )}
    {/* ... */}
  </>
);
```

**RM fallback:** progress bar просто не рендерится; sticky header = native CSS, RM-neutral.

**Performance:** scrollYProgress = single Motion value, hardware-accelerated. 0.5 kB.

**Brand fit:** accent line — точкова доза. Не «glow», не «gradient». 2px height.

---

### REC-13. ProjectsPage — layoutId shared element до /zhk/:slug

**Where:** `PipelineCard.tsx` + `ZhkHero.tsx`

**Why:** Коли клікаєш на pipeline-card → hero на /zhk/etno-dim, картинка одна і та сама, але прокидається повний reflow. layoutId дозволяє Motion анімувати **позицію картки → fullscreen hero** як один shared element. Це гордість Awwwards. Працює відмінно з HashRouter тому що `<AnimatePresence>` уже є.

**Code:**

```tsx
// PipelineCard.tsx — wrap image
<motion.div layoutId={`hero-${project.slug}`} className="w-full aspect-[4/3] overflow-hidden">
  <ResponsivePicture ... />
</motion.div>

// ZhkHero.tsx
<RevealOnScroll as="section" variant={fade} className="bg-bg">
  <motion.div layoutId={`hero-${project.slug}`}>
    <ResponsivePicture ... className="w-full h-auto" />
  </motion.div>
</RevealOnScroll>
```

**RM fallback:** Motion auto-respects useReducedMotion для layout animations за замовчуванням (Motion v12 docs). Все ж явно:

```tsx
// in Layout.tsx або wrapper
<MotionConfig reducedMotion="user">
  <AnimatePresence ...>{/*...*/}</AnimatePresence>
</MotionConfig>
```

**Performance:** layoutId додає `LayoutGroup` runtime ~6 kB. Це найдорожчий pattern у списку. Але візуально найвпливовіший.

**Brand fit:** continuity = «системний». Без glow, без spin.

**Caveat:** працює лише якщо AnimatePresence `mode="wait"` дозволяє overlap. Зараз mode='wait' = exit fully before enter starts. Для shared layout треба `mode="popLayout"` або `mode="sync"`. Це невелика зміна Layout.tsx, але треба тестувати скрол-state на enter.

---

### REC-14. Number count-up на TrustBlock (для майбутніх цифр)

**Where:** `src/components/sections/home/TrustBlock.tsx` + новий `src/components/ui/CountUp.tsx`

**Why:** ЄДРПОУ і дата ліцензії = чесні цифри. Premium-pattern — counter іде від 0 до фінального значення (наприклад «27» років, «4218938» ЄДРПОУ — БЕЗ animation для коду EDRPOU, але якщо у v2 з'являться counts якогось «27 років досвіду» / «5 проектів» — count-up готовий).

**Code:**

```tsx
// src/components/ui/CountUp.tsx
import { useEffect, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

export function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();
  const [n, setN] = useState(prefersReducedMotion ? to : 0);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      // easeBrand approximation: 1 - Math.pow(1 - p, 4)
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, prefersReducedMotion]);

  return <span ref={ref}>{n.toLocaleString('uk-UA')}</span>;
}
```

**RM fallback:** initial state immediately = `to`.

**Performance:** ~0.5 kB. RAF-based, no spring lib.

**Brand fit:** `1 - (1-p)^4` = quartic-out, наближене до easeBrand. Без bounce.

**Use coming up:** v2 коли клієнт додасть «27» / «5» / «4 цінності».

---

### REC-15. Lightbox: subtle fade + scale-in на open

**Where:** `src/components/ui/Lightbox.tsx`

**Why:** Native `<dialog>.showModal()` зараз блимає мить. Premium UX: fade in на 200ms + photo внутрішньо `scale 0.96 → 1`. Backdrop opacity 0 → 0.8. Без bounce.

**Code (replace native showModal flow):**

```tsx
// Lightbox.tsx — wrap inner content
import { motion, AnimatePresence } from 'motion/react';

return (
  <dialog ref={dialogRef} aria-label="..." onClick={onDialogClick} className="...">
    <AnimatePresence>
      {open && (
        <motion.div
          key="lb"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: easeBrand }}
          className="relative flex h-full w-full flex-col"
        >
          {/* existing buttons + img */}
        </motion.div>
      )}
    </AnimatePresence>
  </dialog>
);
```

**RM fallback:** Motion respects useReducedMotion globally if MotionConfig set up; else add manual:

```tsx
const v = prefersReducedMotion
  ? { initial:{}, animate:{}, exit:{} }
  : { initial:{opacity:0,scale:0.96}, animate:{opacity:1,scale:1}, exit:{opacity:0,scale:0.98} };
```

**Performance:** AnimatePresence per dialog = ~1 kB. Reusing existing AnimatePresence import.

**Brand fit:** scale delta 0.04 — ledve hto pomi'tыt'. Just enough щоб не «cut».

---

## 6. Page-by-page рекомендації (concrete)

### 6.1 Home / `Hero`
- REC-01: cinematic intro (logo+slogan+CTA stagger)
- REC-02: 3-layer parallax
- REC-03: mouse-parallax overlay
- REC-06: magnetic CTA
- REC-08: scrambled text on «ВИГОДА»

### 6.2 Home / `BrandEssence`
- REC-11: stagger.relaxed (4 items, narrative pace)
- Add: numbered «01..04» count-up on viewport-enter (per REC-14 pattern, but for static `padStart` numbers — animate digit-up over 300ms each)
- Add: на hover кожної card — accent-color border-bottom 2px росте від 0% до 100% (CSS-only, no Motion)

### 6.3 Home / `PortfolioOverview`
- REC-10: image-reveal mask на FlagshipCard hero render
- REC-13: layoutId shared element для pipeline cards → ZhkHero
- Replace `.hover-card` scale 1.02 → 0.985 (інверс — «прес», бо в ділових патернах «прес» виглядає серйознішим за «росте»). Або: scale 1, але ledve-видна `box-shadow` 0 0 32px і `border-color: accent` 1px (не glow — лінія, brand-correct)

### 6.4 Home / `ConstructionTeaser`
- Fix: `scrollByDir` должен поважати RM:

```tsx
const scrollByDir = (dir: 1 | -1) => {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
  scroller.current?.scrollBy({ left: SCROLL_STEP * dir, behavior });
};
```

- Add: scroll-velocity skew-x на photos (`useScroll` на scroller, `useTransform` velocity → skewX 0..3deg). Дає «фізичну» інерцію.
- Add: Edge-fade gradient (left+right) — pure CSS (`mask-image: linear-gradient(...)`), щоб карти "втікали" у фон.

### 6.5 Home / `MethodologyTeaser`
- REC-11: stagger.relaxed
- Add: на index lit `01 / 02 / 03` — splittext від нижче з opacity 0 → 1 + delay-per-character (Motion `staggerChildren` на span-level)

### 6.6 Home / `TrustBlock`
- REC-14: count-up для будь-яких numerals в майбутньому
- Add: на column heading (uppercase «Юр. особа» / «Ліцензія» / «Контакт») — letter-by-letter reveal від initial `letter-spacing: -0.5em` → `0.04em`. Дуже brand-friendly — «розгортання system».

### 6.7 Home / `ContactForm`
- REC-06: magnetic CTA
- Add: на `<h2>{contactHeading}</h2>` — split-line reveal: divider `border-bottom` ширшає від 0% до 100% за 600ms перед тим як заголовок з'являється.

### 6.8 ProjectsPage / `StageFilter` chips
- Fix: додати `motion-reduce:transition-none` до chip-class
- Add: active-chip — анімація background-color через Motion, з `layoutId="active-chip"` бекдрopом — pill переїжджає від chip до chip (не fade)

```tsx
{active === s && (
  <motion.span layoutId="active-chip" className="absolute inset-0 -z-10 rounded-full bg-accent" />
)}
```

### 6.9 ProjectsPage / `Marquee`
- REC-09: marquee tagline між фільтром і grid

### 6.10 ProjectsPage / `PipelineGrid`
- REC-13: layoutId shared element

### 6.11 ZhkPage / `ZhkHero`
- REC-10: image-reveal mask
- Add: subtle Ken Burns на hero image (`scale 1 → 1.04` over 12s loop, infinite, alternate). RM-respect: animation-play-state: paused.

### 6.12 ZhkPage / `ZhkGallery` thumbs
- REC-11: stagger.tight (40ms)
- Add: на hover thumb — short rotate 0.5 deg + scale 1.02 (combo). 0.5 deg = ledve видно, ale daje "vivacity".

### 6.13 ZhkPage / `Lightbox`
- REC-15: fade + scale-in на open
- Add: keyboard arrow key → photo slide замість cut: photo on `key.left`/`key.right` slides x ±50px з opacity 0 → 1 (200ms).

### 6.14 ZhkPage / `ZhkCtaPair`
- REC-06: magnetic primary CTA
- Disabled secondary («Instagram» disabled state) — hover: subtle dashed-border-rotate 2 deg (CSS-only). Робить статус «coming soon» більш expressive.

### 6.15 ConstructionLogPage
- REC-12: sticky month-headers + scroll progress bar
- Add: total-photo-count counter в hero header («340 фотографій будівництва») — REC-14 count-up.

### 6.16 ContactPage
- REC-06: magnetic primary CTA
- Add: на split-text `{contactPageHeading}` — letter-by-letter cascade z opacity 0 → 1 + y `0.5em → 0`.

---

## 7. Що видалити / переробити

| # | What | Why |
|---|---|---|
| 1 | `pageFade` exit-step (350ms opacity-only) | Це bootstrap-level. Замінити на `pageCurtain` (REC-04) АБО взагалі прибрати exit-fade і використовувати `mode="popLayout"` з shared layoutId (REC-13). Поточний «fade out → blank → fade in» дає flicker-feeling «нічого не сталося» |
| 2 | `.hover-card` scale 1.02 — на FlagshipCard / PipelineCard / GalleryThumb | Scale 1.02 на large image-card — це 1.02× pixel re-sample → blur. На 1280×720 image це 25 pixel-row gain — починає виглядати «trembled». Краще: scale 1 (no resize) + `transform: translateY(-4px)` + accent border 1px (не glow). Це тримається у бренді  |
| 3 | `easeBrand = [0.22, 1, 0.36, 1]` — використати ТАКОЖ для exits | Цей easing — expo-out (smooth landing). На exits він виглядає «лінивим». Додати `easeBrandIn = [0.64, 0, 0.78, 0]` для exits (expo-in). Symetry між enter і exit — premium-touch |
| 4 | `staggerChildren: 0.08` універсал | Замінити на REC-11 cadence тиер |
| 5 | `useSessionFlag('vugoda:hero-seen')` — на 2nd visit hero «мертвий» | На 2nd visit зараз парралакс і intro skip'аються. Це хороша інтенція (no «cinematic заїбав»), але робити Hero повністю static — занадто. Краще: на 2nd visit залишити parallax (низькокоштовний скрол-effect), скіпнути ТІЛЬКИ intro stagger. Запропонована Hero.tsx переробка: `skipIntro = prefersReducedMotion || heroSeen`, а `skipParallax = prefersReducedMotion` (без heroSeen) |
| 6 | inline `transition-[background-color,color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]` у `StageFilter.chipClass()` | Перенести у `@utility chip-transition` в index.css (вже є `--ease-brand`). Менше inline-string, RM fallback в одному місці |
| 7 | `MarkSpinner` opacity pulse 0.4↔0.8 | Достатньо. Залишити. **DON'T overdesign Suspense fallback** — пользователь бачить його ~150ms |

---

## 8. Implementation roadmap (priority)

| Tier | Recs | ETA | Bundle impact |
|---|---|---|---|
| **P0 — must-have для «WOW»** | REC-01 (Hero intro), REC-02 (3-layer parallax), REC-04 (page curtain), REC-10 (image reveal), REC-13 (layoutId hero) | 8–12h | +6 kB |
| **P1 — premium polish** | REC-06 (magnetic CTAs), REC-12 (log progress + sticky), REC-09 (marquee), REC-15 (lightbox fade), REC-11 (stagger cadence) | 6–8h | +1 kB |
| **P2 — signature** | REC-05 (custom cursor), REC-08 (scrambled text), REC-07 (animated cube) | 5–7h | +3 kB |
| **P3 — future-proofing** | REC-14 (count-up), REC-03 (mouse parallax) | 3–4h | +2 kB |

Загальний бюджет: ~22–31h дев-роботи, +12 kB bundle. Все — в межах 200 kB JS gzipped.

---

## 9. Modernity scorecard після впровадження

| Аспект | Зараз | Після P0 | Після P0+P1 | Після P0+P1+P2 |
|---|---|---|---|---|
| Hero impact | 4 | 8 | 8 | 9 |
| Page transitions | 3 | 7 | 8 | 8 |
| Hover/micro-interactions | 5 | 5 | 8 | 9 |
| Scroll storytelling | 4 | 8 | 8 | 9 |
| Brand-cube кінетика | 1 | 2 | 4 | 9 |
| Cursor / pointer story | 0 | 0 | 5 | 9 |
| Typography motion | 2 | 3 | 5 | 9 |
| **Overall (out of 10)** | **3.5** | **6.5** | **8** | **9+** |

---

## 10. Final notes

**1. Що тримати недоторканим:**
- `easeBrand` cubic-bezier — це душа brand-motion, не міняти.
- 200/400/1200ms triplet — стандарт, не міняти.
- RM threading patterns — `RevealOnScroll` unwrap і `mark-pulse` CSS @media — найкращі практики.
- Chiseled SOT в `motionVariants.ts` — продовжувати додавати тільки named variants, без default exports.

**2. Що додати у `motionVariants.ts` сумарно:**

```ts
export const easeBrandIn = [0.64, 0, 0.78, 0] as const;

export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 1.2,
  cinematic: 0.7,
  reveal: 1.0,
} as const;

export const staggerCadence = {
  tight:  0.04,
  base:   0.08,
  relaxed:0.12,
  hero:   0.18,
} as const;

export const heroIntroParent: Variants = { /* ... */ };
export const heroBgFade:      Variants = { /* ... */ };
export const heroWordmark:    Variants = { /* ... */ };
export const heroSlogan:      Variants = { /* ... */ };
export const pageCurtain:     Variants = { /* ... */ };
export const imageReveal:     Variants = { /* ... */ };
export const imageRevealRM:   Variants = { /* ... */ };
```

Все ще <80 рядків. Все ще читається за 30 секунд. Brand DNA збережено.

**3. Що не робити, навіть якщо tempting:**
- ❌ Bouncy springs — конфлікт з brand voice
- ❌ Glow-effects (filter:drop-shadow з кольоровим радіусом) — brandbook §6 explicit заборона
- ❌ Particle-systems (snow, dust, glitch) — НЕ системний
- ❌ Auto-playing video в hero — ламає LCP бюджет
- ❌ Three.js / WebGL — концепція §9 і CLAUDE.md «What NOT to Use» забороняють
- ❌ Lottie — для 1 brand-cube кінетика overkill, своя SVG + Motion дає більше контролю
- ❌ AOS / framer-motion-features-import-all — bundle bloat без виправдання

---

**Bottom line:** інженерія готова. Креативу немає. План на ~25h дає $$$ ROI у візуальній якості. Кожен ефект тримається в брендcues «стримано/системно/без bounce». Жоден з 15 не виходить з performance budget. Жоден не ламає WCAG 2.1 AA. На виході — Awwwards-bar презентація, зроблена на тому самому стеку, без додавання Three.js, без Lottie.

— Frontend / Motion Specialist, 2026-04-27
