# Phase 5: Animations & Polish — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 05-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 05-animations-polish
**Areas discussed:** Reveal scope & stagger · Route transition + ScrollToTop · Session-skip hero · motionVariants.ts shape + hover DRY

---

## Gray Areas Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Reveal scope & stagger | Які surfaces отримують `<RevealOnScroll>`/stagger; що з 50 фото /construction-log; 8 thumbs ZHK gallery; TrustBlock; hero | ✓ |
| Route transition + ScrollToTop | Тривалість/тип переходу; як ScrollToTop узгоджується з mode='wait' | ✓ |
| Session-skip hero | 2× faster fade vs повний skip parallax; storage key; коли ставити флаг | ✓ |
| motionVariants.ts + hover DRY | SOT shape; CSS-змінна `--ease-brand`; hover-class консолідація; reduced-motion threading | ✓ |

**User's choice:** All four selected.

---

## Area 1: Reveal scope & stagger

### Q1.1: /construction-log — 50 фото у 4 місяцях. Який pattern reveal-анімації?

| Option | Description | Selected |
|--------|-------------|----------|
| Per-MonthGroup only (recommended) | Ревіл на рівні MonthGroup: header + grid фото fade-up разом одним блоком. 4 reveals на всій сторінці — чисто, перф безпечно. | ✓ |
| Per-photo stagger 40ms | Кожне фото ревілиться окремо зі staggerChildren=40ms в межах month-grid. Візуально багатше але 50 IO callbacks + ризик janku. | |
| First-row stagger then immediate | Перші 4 фото кожного місяця stagger 80ms; решта видимі одразу. Компроміс. | |
| Header-only reveal | Ревілиться тільки month-header («Березень 2026 · 15 фото»); фото просто рендеряться. Мінімально. | |

**User's choice:** Per-MonthGroup only.

### Q1.2: /zhk/etno-dim — 8-render gallery. Як reveal?

| Option | Description | Selected |
|--------|-------------|----------|
| Section-level + per-thumb stagger 80ms (recommended) | Gallery section fade-in як ціле; всередині staggerChildren=80ms дає 8×80ms=640ms total. Помірно cinematic, тримається в бюджеті SC#2. | ✓ |
| Section-only fade | Gallery як один блок fade-up; thumbs без individual stagger. Більш стримано. | |
| First-row stagger only (4 thumbs) | Стагер тільки перших 4 thumbs (видимих в в'юпорті після scroll); решта 4 вже рендеряться без anim. | |
| No gallery animation | Галерея тільки статична (lightbox залишається з fade-in 200ms як в Phase 4). Thumbs reveal-вільні. | |

**User's choice:** Section-level + per-thumb stagger 80ms.

### Q1.3: Card-list stagger cadence — SC#2 каже 80ms. Як буде виглядати?

| Option | Description | Selected |
|--------|-------------|----------|
| 80ms universal (recommended) | Скрізь staggerChildren=80ms; delayChildren=0. SC#2 verbatim. 3-card grid = 240ms total cascade; 4-card = 320ms. | ✓ |
| 80ms + delayChildren 100ms | Парент fades-in першим (header/h2), потім через 100ms починає стагер карток. Читається як «header → cards». | |
| Variable per surface | 60ms для 5+ елементів, 80ms для 3-4. Порушує SC#2 verbatim але візуально рівніше. | |

**User's choice:** 80ms universal.

### Q1.4: Hero — включати в RevealOnScroll-свитв? Він вже має parallax + появляється відразу як LCP.

| Option | Description | Selected |
|--------|-------------|----------|
| Skip RevealOnScroll (recommended) | Hero як LCP пав'ється видимим відразу; parallax вже є (стане parallaxSlow варіантом з SOT). Жодних fade-in/translate на wordmark. | ✓ |
| Subtle wordmark fade-in 600ms | Wordmark + гасло + CTA fade-in при mount (one-shot, не scroll-triggered) — додає cinematic але відкладає LCP. Ризик Lighthouse. | |
| Fade-in only on first session-load | Fade-in 600ms тільки при першому візиті в сесії (sessionStorage skip з SC#5 об'єднується). На demo-reload — відразу visible. | |

**User's choice:** Skip RevealOnScroll.

---

## Area 2: Route transition + ScrollToTop

### Q2.1: Стиль переходу між роутами?

| Option | Description | Selected |
|--------|-------------|----------|
| Pure pageFade (recommended) | Чистий opacity 0→1 без translate. Стриманий, brand-tone-aligned «без руху». Один варіант `pageFade`. Найлегший reduced-motion патерн. | ✓ |
| Subtle fade + 8px Y-translate | Opacity 0→1 + translateY(8px→0) на enter; opacity 1→0 + translateY(0→-8px) на exit. Більш cinematic. Вимагає більше reduced-motion-гвардів. | |
| Fade + scale 0.98→1.0 | Opacity плюс легкий zoom-in на enter. Ризик «compound zoom» з lightbox open-anim. | |

**User's choice:** Pure pageFade.

### Q2.2: Де живе `<AnimatePresence>`? Чи торкаємо Layout.tsx?

| Option | Description | Selected |
|--------|-------------|----------|
| В Layout.tsx (recommended) | Обгортка `<AnimatePresence mode='wait' initial={false}>` прямо навколо `<Outlet/>` у існуючому Layout.tsx; `<main>` + Nav + Footer залишаються статичними. Phase 1 вже залишив цю точку саме для цього. | ✓ |
| Окремий <RouteShell> компонент | Новий src/components/layout/RouteShell.tsx рендерить `<AnimatePresence>`+`<motion.div>` всередині `<Outlet/>`. +1 файл, +1 рівень вкладеності. | |
| В App.tsx навколо `<Routes>` | AnimatePresence охоплює увесь `<Routes>`; key={location.pathname}. Потребує useLocation() у App; не вписується в layout патерн Phase 1. | |

**User's choice:** В Layout.tsx.

### Q2.3: ScrollToTop + AnimatePresence mode='wait' — коли скролити вверх?

| Option | Description | Selected |
|--------|-------------|----------|
| onExitComplete callback (recommended) | Скрол відбувається ПІСЛЯ exit-анімації старої сторінки, перед рендером нової. Користувач бачить fade-out на своїй позиції, потім нова сторінка fade-in вже вверху. Чистий UX. | ✓ |
| Instant on pathname-change (поточно) | Залишаємо поточну поведінку. Проблема: exit вже почався — якщо user був scrolled-down, він побачить top старої сторінки fading-out, потім top нової — jarring. | |
| On enter (after new page mount) | ScrollToTop живе в useEffect нової сторінки. user бачить флеш enter-анімації на 0 (top), потім одразу в 0. | |
| Disable scroll-restore, browser-default | Прибрати ScrollToTop зовсім. HashRouter + browser scroll-restoration буває inconsistent — не рекомендується. | |

**User's choice:** onExitComplete callback.

### Q2.4: AnimatePresence key — який рівень?

| Option | Description | Selected |
|--------|-------------|----------|
| key=location.pathname (recommended) | Кожен роут = окремий mount/unmount. /zhk/etno-dim → /projects → /contact — три різні mounts, три fade переходи. SC#3 verbatim. | ✓ |
| key=first-segment (/projects, /zhk, /contact) | Перехід між /zhk/etno-dim і (гіпотетично в v2) /zhk/maietok був би без fade. Не рекомендується. | |
| key=full URL (pathname + search) | /projects?stage=u-rozrakhunku → /projects?stage=zdano будуть різними mount — fade на кожну зміну фільтра. Надлишково. | |

**User's choice:** key=location.pathname.

---

## Area 3: Session-skip hero

### Q3.1: Поведінка hero на 2-му+ візиті в сесії?

| Option | Description | Selected |
|--------|-------------|----------|
| Skip parallax entirely (recommended) | Hero на 2-му візиті рендериться статично: жодного useScroll/useTransform, IsometricGridBG стоїть на місці. Клієнт при demo-reload бачить сайт відразу. Найчистіша реалізація. | ✓ |
| Faster: 2× (parallax-range з/2) | Parallax залишається, але outputRange ½: [0,-50] замість [0,-100]. Швидше «done» на скролі але все ще рухається — легко переплутати з reduced-motion. | |
| Skip parallax + skip first RevealOnScroll | Skip parallax ПЛЮС BrandEssence (перша below-fold секція) рендериться opacity:1 відразу без reveal-anim. Швидший «get-to-content» але втрачає cinematic відчуття на reveal-и. | |

**User's choice:** Skip parallax entirely.

### Q3.2: Storage key naming?

| Option | Description | Selected |
|--------|-------------|----------|
| vugoda:hero-seen (recommended) | Неймспейсований ключ з префіксом бренду. Чисто в DevTools, легко грепати. | ✓ |
| hero-seen (просто) | Коротко без префіксу. Ризик колізії якщо v2 додає більше sessionStorage ключів. | |
| vugoda:visited | Більш абстрактний — «відвідав сайт в цій сесії». Дає плацдарм для інших first-time-anim в майбутньому. Але менш специфічний для херо. | |

**User's choice:** vugoda:hero-seen.

### Q3.3: Коли виставляться прапор?

| Option | Description | Selected |
|--------|-------------|----------|
| On hero mount (recommended) | В useEffect Hero.tsx: якщо !sessionStorage.getItem(KEY) → рендерити cinematic + setItem(KEY); інакше — статично. Простий lifecycle. | ✓ |
| On first scroll past hero | Прапор ставиться коли hero виходить з в'юпорту. Більш точний «saw it» сигнал але якщо юзер reload-ив не роздивляючись, він побачить cinematic знову. Для demo-pitch ризик. | |
| On nav-away (вперше вийшов з /) | Прапор ставиться коли user клікає nav-link. Первий reload покаже cinematic знову. На demo-pitch клієнт може reload-ити без навігації — регресія. | |

**User's choice:** On hero mount.

### Q3.4: Reduced-motion + session-skip — як комбінуються?

| Option | Description | Selected |
|--------|-------------|----------|
| RM завжди виграє (recommended) | useReducedMotion()===true → hero статичний завжди, sessionStorage не перевіряється. RM є hard-override над усіма motion-рішеннями (SC#4 вербатим). | ✓ |
| OR логіка (будь-який флаг → skip) | skipParallax = prefersReducedMotion \|\| sessionFlag. Простіший boolean. Той же результат але в коді розрізнення «RM» від «session» втрачається. | |

**User's choice:** RM завжди виграє.

---

## Area 4: motionVariants.ts shape + hover DRY

### Q4.1: Структура експортів src/lib/motionVariants.ts?

| Option | Description | Selected |
|--------|-------------|----------|
| Named exports (recommended) | `export const fadeUp`, `export const stagger`, `export const pageFade`, `export const parallaxRange` + `export const easeBrand = [0.22,1,0.36,1] as const` + `export const durations = {...}`. Tree-shake-friendly, легко грепати. | ✓ |
| Single namespace object | `export const motion = { variants: {fadeUp,...}, easings: {brand:[...]}, durations: {...} }`. Один імпорт на consumer. Гірше для tree-shake. | |
| Split: variants.ts + easings.ts + durations.ts | Три файли. Розбивання надлишкове для 5-7 константів. | |

**User's choice:** Named exports.

### Q4.2: Easing в CSS-змінній (`--ease-brand`)?

| Option | Description | Selected |
|--------|-------------|----------|
| Так, абсорбувати у @theme (recommended) | Додаємо `--ease-brand: cubic-bezier(0.22,1,0.36,1)` у src/index.css блоку @theme. Tailwind v4 генерить utility `ease-brand`. JS-бік (`easeBrand` array для Motion variants) залишається. Дві репрезентації однієї кривої, документовано. | ✓ |
| Ні — тільки JS const | `easeBrand` живе в motionVariants.ts; hover-класи залишаються з inline `ease-[cubic-bezier(...)]`. Дві точки дрифту. | |
| Тільки CSS-змінна, JS читає з getComputedStyle | Одна фізична точка правди. Але Motion variants потребують [число,число,число,число] array, парсинг cubic-bezier(...) string рунтайм — надлишковий код. | |

**User's choice:** Так, абсорбувати у @theme.

### Q4.3: Hover-class duplication (5 сурфейсів) — як консолідуємо?

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind v4 @utility hover-card (recommended) | В src/index.css визначаємо `@utility hover-card { ... }` з усіма hover-спец-властивостями + motion-reduce. 5 сурфейсів замінюють 100+ символів на `hover-card`. Native Tailwind v4. | ✓ |
| <HoverCard> React-обгортка | src/components/ui/HoverCard.tsx — обгортка з фіксованими hover-класами + className passthrough. +1 рівень DOM, +1 компонент. | |
| @layer components .hover-card | Старий Tailwind v3 патерн. v4 підтримує але «@utility» є нативний v4-примітив для саме цього use-case. | |
| Залишити duplicated | Phase 4 D-33 сказав «Phase 5 may consolidate» — «may». Залишаємо ad-hoc-класи. | |

**User's choice:** Tailwind v4 @utility hover-card.

### Q4.4: Reduced-motion threading для `<RevealOnScroll>` і `<AnimatePresence>`?

| Option | Description | Selected |
|--------|-------------|----------|
| Per-component useReducedMotion() (recommended) | `<RevealOnScroll>` всередині викликає useReducedMotion(); якщо true → рендерить children без motion-обгортки (opacity:1 immediate). Layout.tsx `<AnimatePresence>` також перевіряє; при RM duration=0 для pageFade. | ✓ |
| Context provider (MotionPreferencesContext) | src/lib/motion-context.tsx + provider у main.tsx; всі споживачі читають з useContext. Надлишково для 3-4 споживачів. | |
| CSS @media (prefers-reduced-motion) | Чисто CSS-рішення. Не працює для Motion-варіантів (вони JS-driven). Може доповнювати (a) для hover-класів але не замінює. | |

**User's choice:** Per-component useReducedMotion().

---

## Claude's Discretion

The following were left for the planner per 05-CONTEXT.md `<decisions>` § Claude's Discretion:

- Exact `delayChildren` value when stagger is requested with custom delay (default 0; planner may set 80ms for chip rows).
- Whether `<RevealOnScroll>` exposes a `<RevealItem>` helper or expects callers to inline `<motion.div variants={fadeUp}>`.
- Whether `ScrollToTop.tsx` is deleted or kept as a no-op-with-deprecation comment.
- Whether to add an optional `noInlineTransition()` 5th check to `scripts/check-brand.ts`.
- Whether `parallaxRange` lives in `motionVariants.ts` (recommended for proximity to `easeBrand`/`durations`) or a sibling `motionConfig.ts`.
- Whether `pageFade.exit.transition.duration` is hardcoded (350ms) or pulled from a new `durations.exit` field.
- Whether existing `motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none` Tailwind variants in inline classes are also removed (recommended yes — `@utility hover-card` carries the `@media` block).
- Lightbox open-anim absorption into SOT (recommended leave-as-is per D-16).
- Exact form of `useSessionFlag` (one-shot read+write vs stateful [flag, setFlag]).
- Whether `<RevealOnScroll>` defaults `as` prop to `'div'` or `'section'`.

## Deferred Ideas

Captured in 05-CONTEXT.md `<deferred>`:

- Lightbox open-anim absorption into SOT (Phase 4 surface)
- Browser back-button per-route scroll restoration (v2)
- Phase 4 hover triple-effect as Motion variants instead of CSS (v2 if hover ever needs JS-driven state)
- IO observer pooling for high-N reveals (v2 if content grows)
- Subtle slide / scale variants beyond pageFade (v2 if user feedback)
- `will-change: transform` performance audit (Phase 6 if Lighthouse surfaces it)
- Auto-replay reveal on scroll-up via `once: false` (v2 if requested)
- MotionConfig provider for global Motion options (v2 if many surfaces share config)
- Splash / preloader screen for first session-load (out of scope; cinematic hero IS the splash)
- `/dev/brand` and `/dev/grid` route-transition exclusion (planner can opt-in if QA inspection slows)
