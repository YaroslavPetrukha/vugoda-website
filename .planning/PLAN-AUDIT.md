# PLAN.md — Skeptic-Pass Audit

**Date:** 2026-04-24
**Scope:** хрест-перевірка `.planning/PLAN.md` проти фактичного коду (`src/`, `scripts/`, `public/`), брендбуку (`brand-system.md`), концепції (`КОНЦЕПЦІЯ-САЙТУ.md`), ROADMAP/REQUIREMENTS/STATE, та лессон-лернд з Phase 1-2 SUMMARY/decisions.
**Verdict:** PLAN.md **НЕ готовий без патчів**. Нижче 5 blocker-level + 6 brand-compliance + 9 consistency знахідок. Суперечок з деплоєним Phase 1-2 **кодом** — 3 (A1, A2, A4). Решта — концептуальні пастки, які проявляться на Phase 3 merge.

---

## A. Blocker-level contradictions (fix BEFORE Phase 3 starts)

### A1. Logo.tsx не використовує svgr — суперечить VIS-04 і плану

**Що у плані:** §1.5 VIS-04: «Official Logo/Mark/Favicon SVG через `vite-plugin-svgr`»; §4 Phase 3: «**NEEDS SPIKE** — svgr v4 API».

**Що в коді:**
```tsx
// src/components/brand/Logo.tsx (Phase 1, deployed)
import darkLogoUrl from '../../../brand-assets/logo/dark.svg';
export function Logo({ className, title }) {
  return <img src={darkLogoUrl} alt={title} className={className} />;
}
```
Це **URL-import**, не SVG-as-component. Vite віддає файл як asset, `<img src>` завантажує окремим HTTP-запитом. `vite-plugin-svgr` у `package.json` і `vite.config.ts` є, але **не задіяний для Logo**.

**Два наслідки:**
1. Logo.tsx **не може** бути параметризований (stroke, opacity) через props — він просто картинка.
2. **Імпорт `../../../brand-assets/`** — це поза `src/` і поза `public/`. Vite за замовчуванням allowlist-ить `fs.allow`; прод-білд через Rollup зазвичай підтягне файл, але **це не гарантовано на GH Pages** — треба перевірити чи `dist/assets/dark-<hash>.svg` генерується при `npm run build`. Якщо ні — на задеплоєному URL буде **broken image**.

**Дія:**
- Спершу `npm run build && ls dist/assets/ | grep svg` — перевірити що файл copy-ується. Якщо ні — **це blocker на задеплоєному Phase 1**, а не тільки на Phase 3.
- Оновити PLAN.md VIS-04 acceptance: для **Logo + Mark** (повна композиція з 4 елементами брендбуку §2) URL-import з brand-assets/ **прийнятний**, якщо `dist/` містить asset. Для **IsometricCube/IsometricGridBG** — svgr `?react` (щоб можна було параметризувати opacity/stroke).
- Phase 3 «NEEDS SPIKE svgr v4» → downgrade до **verify-only** (30 min): імпорт `brand-assets/patterns/isometric-grid.svg?react`, переконатись що компонент рендериться + приймає props.

### A2. Image pipeline (sharp) — план припускає що copy-renders.ts розширюється, але Phase 2 вже зафіксував copy-only

**Що у плані:** §4 Phase 3 «Image pipeline» stage: «sharp-encoding у `copy-renders.ts` розширенні».

**Що в коді (Phase 2 decisions, STATE.md):**
- `scripts/copy-renders.ts` — чистий translit + copy; запускається на `predev` **І** `prebuild`
- Sharp не встановлено в package.json
- STACK.md Path A — окремий `scripts/optimize-images.mjs` (~60 LOC), запускається manually, commit outputs

**Суперечка:** якщо sharp вставити в `copy-renders.ts` → на кожен `npm run dev` пересиквається 20+ рендерів = ~5-15s cold-start замість <100ms copy. **Це зіпсує dev experience.**

**Дія:**
- Новий `scripts/optimize-images.mjs` як окремий npm script `"optimize:images"`, запускається manually при заміні рендера.
- `copy-renders.ts` продовжує копіювати (з `/renders/` або `/public/optimized/` — TBD Plan 03).
- Оновити PLAN.md §4 Phase 3: Image pipeline stage = окремий скрипт, не розширення copy-renders.
- Додати у Phase 3 першим Plan Task: «03-00-image-pipeline» (або 03-01-prefix).

### A3. Wordmark як brand primitive — потенційно порушує брендбук

**Що у плані:** §4 Phase 3 Wave A: «`Wordmark.tsx`» у brand primitives.
**Що у плані §5 folder structure:** «components/brand/Wordmark.tsx».
**Що у ARCHITECTURE.md:** «Wordmark — hero «ВИГОДА» text».

**Брендбук §2 (brand-system.md:26-50):**
- Логотип — **композиція 4 частин**: Знак/Куб, Символ (пелюстки), Назва «вигода», Дескриптор
- Назва **lowercase** «вигода», не uppercase
- Brand-system.md §4:119 прямим текстом: «Lowercase для логотипа та частини заголовків (дисципліна «вигода» з маленької) — **не ламати**»
- Заборонено: «масштабувати частини окремо» (§2:45)

**Концепція §7.1:**
> «великий wordmark "ВИГОДА"» (CAPITAL)

**Конфлікт:**
- Якщо Wordmark рендерить **великий типографічний текст «ВИГОДА» (uppercase)** — це **тайпсет, не частина лого**, тому не порушує «масштабувати частини окремо». Але суперечить «lowercase вигода — не ламати» дисципліні.
- Якщо Wordmark рендерить **`<Logo>` у великому розмірі (hero-size з lowercase «вигода»)** — це просто `<Logo className="h-48 md:h-64">` і **не потребує окремого компонента**.

**Рішення:**
1. **Або** (preferred) Wordmark = великий uppercase «ВИГОДА» Bold display typography (Montserrat 120-200px) — це **НЕ brand primitive**, це **типографія**. Перемістити в `components/sections/home/HeroWordmark.tsx` (композиційний компонент Hero, не `brand/`).
2. **Або** скасувати Wordmark, у Hero використовувати `<Logo className="h-40 lg:h-56">` з охоронним полем.
3. **Або** (якщо великий uppercase все-таки хочеться) — формально узгодити з клієнтом що Hero uppercase — це виняток для display-rendering, бренд-дисципліна зберігається у всіх інших місцях.

**Дія:**
- Додати до Phase 3 Discussion Phase питання: «Wordmark lowercase vs uppercase — клієнтське рішення».
- PLAN.md §1.5 HOME-01 у acceptance: «…wordmark «ВИГОДА» (uppercase) — requires client sign-off per brand-system.md §4 lowercase-discipline».
- Переставити Wordmark з `components/brand/` у `components/sections/home/` (якщо залишається).

### A4. DoD (§6) пункт «Single-source-of-truth boundary» послаблений проти ARCHITECTURE

**Що у плані §6:** «`pages/` + `components/` імпортують з `data/` + `content/`».
**Що у ARCHITECTURE.md §1 Boundary rule (line 61):** «`pages/` import from `data/` and compose `components/`. `components/` NEVER import from `data/`… `components/sections/` may accept data-shaped props **but not import the data module**».
**Що у `src/data/projects.ts` (Phase 2 committed):**
```
@rule IMPORT BOUNDARY: This module may only be imported from src/pages/ and
  src/components/sections/.
```

**Три різні версії boundary rule:**
- ARCHITECTURE: pages ТАК, всі components НІ (включно з sections)
- projects.ts @rule: pages ТАК, components/sections ТАК, інші components НІ
- PLAN.md DoD: pages ТАК, **всі** components ТАК (найшвидша)

**Реальна домовленість (Phase 2 committed code wins):** pages + sections can import data; brand/ + ui/ + layout/ cannot.

**Дія:**
- Замінити PLAN.md §6 DoD пункт на: «`pages/` і `components/sections/` імпортують з `data/` + `content/`; `components/{brand,ui,layout}/` — НІКОЛИ. Компоненти приймають data-shaped props».
- Додати в check-brand.ts майбутній чек (Plan у Phase 3): `grep -l "import.*from.*data/" src/components/{ui,brand,layout}/` ↦ empty.

### A5. `src/hooks/` відсутній у folder structure плану, але ARCHITECTURE його передбачає

**Що у плані §5:** немає `src/hooks/`.
**Що у ARCHITECTURE.md:** `src/hooks/useParallax.ts`, `useReducedMotion.ts`, `useSectionReveal.ts`.
**Що у реальності:** `src/hooks/` не створено (Phase 1-2 не потребував).

**Дія:**
- Оновити PLAN.md §5 folder tree: додати `src/hooks/` у Phase 3 deliverables **або** узгодити що всі hooks живуть inline в компонентах (`useScroll` + `useTransform` викликаються прямо в Hero.tsx).
- Motion 12.x експортує `useReducedMotion` з `motion/react` напряму — **не треба** власного wrapper (як і пропонує STATE.md Phase 5 Research flag).
- Рішення: **skip `src/hooks/` директорії**; імпортувати Motion hooks напряму з `motion/react`; shared variants — `src/lib/motionVariants.ts` (уже в плані). Оновити PLAN.md.

---

## B. Brandbook / concept compliance — скрипти для Phase 3-4 planner-а

### B1. Ізометричний куб viewBox — використовувати офіційний SVG, не recode

**Що у плані §4 Phase 3 Wave A:** «Logo.tsx, Mark.tsx, IsometricCube.tsx…».
**ARCHITECTURE.md Q4:** «viewBox `0 0 220.6 167.4`» з офіційного `brand-assets/patterns/isometric-grid.svg`.
**Auto-memory feedback (файл `feedback_svg_viewbox_trimming.md`):**
> always trace bezier path end-points before setting viewBox boundary; M coordinates alone are not bounding-box edges; add ≥15 SVG unit buffer.

**Поточний MinimalCube.tsx (Phase 1 stub):** viewBox 100×100, hand-coded polygon — це **тимчасово** (Phase 1 note line 3: «Phase 3 replaces this…»).

**Ризик Phase 3:**
- Якщо IsometricCube повторить MinimalCube pattern (hand-coded polygon) — буде **recode артефакту** → порушує Anti-Pattern 4 (ARCHITECTURE.md §6) для бренд-примітивів.
- Якщо IsometricCube = svgr import з `brand-assets/patterns/isometric-grid.svg?react` — viewBox треба трасувати BEFORE prop-параметризації (feedback rule).

**Дія:**
- У Phase 3 Plan: для variant=`grid` → svgr import з `brand-assets/patterns/isometric-grid.svg?react`. Для `single`/`group` — можна hand-coded (3-path simple cube), бо brandbook pdf не експортував їх як окремі SVG.
- Перед parameterization: `cat brand-assets/patterns/isometric-grid.svg | head -20` → подивитись справжній viewBox + bezier endpoints.
- Додати Phase 3 research spike задачу: «Trace bezier extremes of isometric-grid.svg».

### B2. Палета — `#C1F33D` ніколи на світлому фоні

**Що у плані:** §1.5 QA-02 згадує правило. §6 DoD має `#C1F33D` never on light background.
**Що у коді (Phase 1 index.css):** `::selection { background-color: var(--color-accent); color: var(--color-bg-black) }` — `#C1F33D` як фон (ОК, текст на ньому `#020A0A` — AAA 13.5:1).
**Що у Footer.tsx:** `text-muted` color `#A7AFBC` на dark `#2F3640` — 5.3:1 AA ≥14pt.

**Ризик Phase 3:** у Hero CTA кнопка «Переглянути проекти» — якщо зробити `bg-accent text-text` (`#C1F33D` фон + `#F5F7FA` текст) → contrast 1.2:1 FAIL (brand-system.md §3:92). 
**Правильно:** `bg-accent text-bg-black` → 13.5:1 AAA.

**Дія:**
- У Phase 3 Plan acceptance для кожного CTA: «button contrast ≥ 4.5:1 — `bg-accent`+`text-bg-black` OR `border-accent`+`text-accent`+`bg-bg`».
- Додати у check-brand.ts (Phase 2 → Phase 3 update): grep regex на `bg-accent.*text-text\|text-accent.*bg-(text|white|F5F7FA)` fail build.

### B3. Hero slogan — verbatim з брендбуку, не переписуємо

**Що у плані §1.5 HOME-01:** «гасло + CTA» (немає тексту гасла).
**brand-system.md §1:12:** «Системний девелопмент, у якому цінність є результатом точних рішень.»
**Концепція §2:25:** той самий рядок верботім.
**Реальність:** ще не в content/ modules (перевірив `src/content/` — є company/methodology/placeholders/values, немає hero module).

**Дія:**
- Phase 3 Plan: новий `src/content/hero.ts` з `slogan: 'Системний девелопмент, у якому цінність є результатом точних рішень.'` + CTA label. Верботім. Apostrophe U+2019 zero, але рядок чистий.

### B4. Cube-ladder semantic для Pipeline-4 empty-state

**Що у плані §1.5 HUB-04:** «Text + single-cube marker, без візуалу».
**CONCEPT §5.2 (рядки 103-111):** «Pipeline без рендерів (Pipeline-4 безіменний) | **1 базовий куб** + статус + CTA «підписатись на оновлення»».

**Інша частина плану забула CTA «підписатись» у HUB-04:**
- PROJECT.md HUB-04: «Агрегативний рядок Pipeline-4 під сіткою — без візуалу, текст: «+1 об'єкт у роботі…» + ізометричний куб base-module».
- PROJECT.md і REQUIREMENTS.md HUB-04 **не включають CTA «підписатись»** — тільки text + cube marker.
- Concept §5.2 радить CTA «підписатись на оновлення», але це **не в v1 REQ**.

**Дія:**
- Phase 3/4 Plan acceptance для HUB-04: «aggregate row = text (verbatim from `aggregateText`) + `<IsometricCube variant="single">` marker. CTA «підписатись на оновлення» — v2 (concept §5.2 recommendation)».

### B5. Hero parallax intensity — brand ToV «стримано» диктує ≤120px

**Що у плані §1.5 HOME-01:** «<120px translation, ease-out no bounce».
**ROADMAP Phase 3 Success #1:** «Motion `useScroll` + `useTransform`, ease-out, no bounce, <120px translation».
**brand-system.md §6 DON'T:** «Не робити зелений фоном широких блоків»; §5:151: «повільна, стримана, ease-out; без «bounce»» (з §7).

**Дія:** ОК, план вже це враховує. Додатково у Phase 3 Plan task: «parallax intensity test at 1920×1080 — якщо відчувається більше ніж «ледь-ледь» — reduce to 80px».

### B6. `#A7AFBC` та Footer — розмір тексту

**Brand-system.md §3:91:** «`#A7AFBC` на `#2F3640` ≈ 5.3:1 AA — **не використовувати для дрібного тексту (<14pt)**».
**Pitfalls.md §Pitfall 6:** «Muted text ≥16px OR `font-medium` ≥14px. Footer reqisits — `var(--color-text)` at `opacity: 0.8`».
**Що у Footer.tsx (рядки 45-70):** `<p className="text-base text-text-muted">ЄДРПОУ 42016395</p>` + інші реквізити — **`text-base` = 16px** + `text-text-muted` = `#A7AFBC`. **ОК.**

АЛЕ: `<h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">` — **`text-xs` = 12px** + muted + bold. Bold compensates але все ще fail (§Pitfall 6: bold ≥14px only).

**Дія:**
- Phase 3 plan task: перегляд Footer.tsx `text-xs text-text-muted` — замінити на `text-sm font-medium` АБО `text-xs text-text opacity-60` (primary color + opacity стабільно AA).
- check-brand.ts майбутнє поліпшення: grep на `text-(xs|2xs)` в одному класі з `text-text-muted` fail.

---

## C. Phase 1-2 lessons — план має їх пам'ятати

### C1. Filesystem authoritative over spec (Phase 2-02 learned)

**Lesson (STATE.md):** «lakeview renders use the 7 verified `.jpg` filenames from `/renders/likeview/`, NOT the `.webp` list in ARCHITECTURE Q2».

**Дія Phase 3:**
- Перед імпортом будь-якого рендеру в `<ResponsivePicture>`: `ls renders/ЖК\ …/` → skeptic-pass.
- Verified сьогодні (2026-04-24):
  - `renders/likeview/` — **7 файлів `.jpg`** (aerial, closeup, entrance, hero, lake-bridge, semi-aerial, terrace)
  - `renders/ЖК Етно Дім/` — **8 файлів `.webp`** (43615…43621 jpg.webp + 61996 png.webp)
  - `renders/ЖК Маєток Винниківський/` — **2 файли `.webp`** (44463 jpg.webp + 62343 png.webp)
  - `renders/Дохідний дім NTEREST/` — **3 файли `.webp`** (2213, 2214 jpg.webp + 60217 png.webp)
- Phase 3/4 `<ResponsivePicture>` має підтримувати **mixed** джерела: lakeview = raw `.jpg` (треба sharp-encode), інші вже pre-converted `.webp`.

### C2. Scripts завжди через `fileURLToPath` (Phase 2-03 learned)

**Lesson (STATE.md):** «`fileURLToPath` instead of `.pathname`» — path з «Проєкти» (cyrillic) percent-encodes в `.pathname`.

**Дія:**
- Phase 3 `optimize-images.mjs` + будь-які нові `scripts/*.ts`: `const ROOT = fileURLToPath(new URL('..', import.meta.url))`, ніколи `.pathname`.
- Додати у PLAN.md §7 Risks: R17.

### C3. check-brand.ts placeholder regex — paired `\{\{[^}]*\}\}`

**Lesson (Phase 2-05):** bare `\{\{|\}\}` false-positive на minified output.

**Дія:**
- Phase 3+ не чіпати regex в check-brand.ts без запуску на повний `dist/`.
- Якщо Phase 3 Plan додає додаткові grep-checks (hex drift, boundary imports, bold-muted combo) — завжди **test on dist/** перед merge.

### C4. HashRouter + `base: '/vugoda-website/'` + `.nojekyll` — вже працює, не ламати

**Що в коді:** `vite.config.ts base: '/vugoda-website/'` ✅; `src/App.tsx` `<HashRouter>` ✅; треба перевірити `public/.nojekyll`.

**Дія:**
- Phase 3 Plan: **заборона** додавати `<BrowserRouter>` в НОВІ роутери (якщо Phase 3/4 додадуть nested routers) — це порушить DEP-03.
- `verify: test -f public/.nojekyll`. Якщо відсутній — blocker.

### C5. PALETTE_WHITELIST в check-brand.ts mirror @theme — drift guardrail

**Lesson (Phase 2-05):** «PALETTE_WHITELIST in script mirrors `@theme` in src/index.css».

**Дія:**
- Phase 3+: будь-який новий hex треба синхронізувати **двосторонньо** (index.css + scripts/check-brand.ts). Brand-system.md §3 — 6 канонічних, жодної 7-ї.

---

## D. Consistency & minor fixes

### D1. §2.6 performance budget — «Lighthouse ≥ 90» для ВСІХ 4 категорій

**Що у плані:** «Lighthouse Performance (desktop) ≥ 90» + окремі рядки Accessibility/BP/SEO.
**QA-02 requirement:** «Lighthouse desktop ≥ 90 усі 4 категорії».
**Дія:** замінити на зведений рядок «Performance / Accessibility / Best Practices / SEO ≥ 90 each, desktop profile».

### D2. Phase 5 stages не включають session-skip (ROADMAP success #5)

**ROADMAP Phase 5 Success #5:** «sessionStorage.getItem('hero-seen') 2× speedup on revisit».
**PLAN.md §4 Phase 5 table:** stages не перелічують session-skip implementation.
**Дія:** додати stage «Session-scoped hero skip → `useSessionSkip` hook або inline».

### D3. OG image — краще sharp composite, ніж AI-prompt

**Що у плані Phase 6:** `design-image-prompt-engineer` + sharp → OG 1200×630.
**Ризик:** brand-system.md §6 DON'T «стокові «смайлові» ілюстрації»; AI генерація може звалитися в «мрія-міськомі» vibe.
**Брендбук §5:** «Тільки каркасна ізометрія, креслення, реальні фото архітектури з патерном-оверлеєм».

**Дія:**
- Phase 6 Plan stage: OG = **static composite** — reuse hero `<IsometricGridBG>` SVG + Montserrat Bold wordmark + dark `#2F3640` bg → headless Chrome screenshot або sharp SVG-to-PNG.
- Зняти `design-image-prompt-engineer` agent з Phase 6. Залишити sharp + (optionally) `design-visual-storyteller` для композиційного review.

### D4. Phase 1 `deploy.yml` вже існує — план каже «Phase 6 activates»

**Що в коді:** `.github/workflows/deploy.yml` **committed** з Phase 1 + Phase 2-05 (додав check-brand step).
**Що у плані §3 table:** «DEP-01 | Phase 6».
**Реальність:** workflow **вже activates** на push to main. Якщо push зараз — build спробує задеплоїтись (може fail на відсутність secrets/Pages setup, але workflow run триггериться).

**Дія:**
- PLAN.md §3: DEP-01 clarifying text: «workflow scaffolded у Phase 1, `check-brand` step додано у Phase 2-05. Phase 6 = verify Pages settings enabled на GH repo + перша успішна deploy run + verify public URL».
- Phase 6 task list: первинно `gh repo view` перевірити Pages settings перед push-triggering.

### D5. deploy.yml double-run check-brand — навмисно, не bug

**deploy.yml line 23:** `Check brand invariants: npx tsx scripts/check-brand.ts`.
**package.json postbuild:** `postbuild: tsx scripts/check-brand.ts`.
**Коли запускається обидва:** `npm run build` → postbuild auto (1st run) → deploy.yml explicit step (2nd run).
**STATE.md decision (Phase 2-05 D-28):** «Double-coverage kept — постбілд — enforcing gate; deploy.yml — PR log visibility».

**Дія:** у PLAN.md §7 Risks R16 (Lighthouse-related) — не конфліктує; **додати** тривіальний коментар у PLAN.md §4 Phase 6 «deploy.yml уже має check-brand step; перевіряємо що не регресія».

### D6. `/dev/brand` і `/dev/grid` hidden routes — не в v1 REQ але у ROADMAP успіху

**ROADMAP Phase 3 Success #5:** «Hidden `/dev/brand` route renders all brand primitives — not linked from production Nav».
**ROADMAP Phase 4 Success #6:** «Hidden `/dev/grid` route uses `projects.fixtures.ts`».
**PLAN.md §1.5:** немає окремих REQ-ID, тільки згадка в §4 Phase 3 Wave C.

**Ризик:** Phase 3/4 executor може пропустити `/dev/brand` + `/dev/grid` бо немає REQ-ID.
**Дія:**
- PLAN.md §1.5 додати рядок «DEV-01: Hidden `/dev/brand` route для brand primitives visual QA. DEV-02: Hidden `/dev/grid` route використовує `projects.fixtures.ts`. Не лінкуємо з production Nav; robots.txt disallow (Phase 6)».
- Phase 3 Plan і Phase 4 Plan — atomic task для кожного.

### D7. `ScrollToTop.tsx` вже існує — план не згадує

**Що в коді:** `src/components/layout/ScrollToTop.tsx` (Phase 1).
**Що у плані §5:** згадано як «[DONE Phase 1]» ✅.
**Ризик:** Phase 5 `AnimatePresence mode="wait"` з ScrollToTop може конфліктувати — scroll-restore перед exit animation завершиться = glitch.
**Дія:** Phase 5 Plan research spike: «ScrollToTop interaction з AnimatePresence mode=wait — scroll reset after enter animation starts, not before exit ends».

### D8. `MobileFallback.tsx` — план каже «Phase 6», REQUIREMENTS теж Phase 6

**PLAN §5 folder:** «MobileFallback.tsx [Phase 6]» ✅.
**Ризик:** Phase 6 робить і fallback-page, і deploy, і Lighthouse — одна фаза перевантажена.
**Дія:** Phase 6 розбити на 3 паралельні плани: 06-01-mobile-fallback, 06-02-og-seo-meta, 06-03-deploy-activate.

### D9. NAV-01 + keyboard `:focus-visible` — вже реалізовано в index.css

**Що у плані §1.5 NAV-01 Acceptance:** «Keyboard Tab показує `:focus-visible` 2px `#C1F33D`».
**Що в коді index.css lines 59-69:** `:focus-visible` на a/button/input/select/textarea/summary/[tabindex] → 2px accent outline, 2px offset. ✅
**Phase 1 SUMMARY:** VIS-01 complete, NAV-01 complete.
**Дія:** нічого не робити, ✅. Phase 7 перевірка — keyboard walkthrough.

---

## E. Suggested patches to PLAN.md

Порядок важливості — найвпливовіші згори.

1. **§4 Phase 3 Image pipeline stage** → «окремий `scripts/optimize-images.mjs` (sharp, 60 LOC), commit outputs; `copy-renders.ts` не зачіпаємо». (A2)
2. **§4 Phase 3 research spike** → «svgr v4 verify-only (30 min), downgrade from NEEDS SPIKE». (A1)
3. **§4 Phase 3 Wave A примітиви** → замінити «Wordmark» на «HeroWordmark.tsx у `components/sections/home/`» з приміткою «client sign-off на uppercase display-typography required». (A3)
4. **§5 folder structure** → видалити `src/hooks/` (не потрібен); `useReducedMotion` імпортимо з `motion/react`. (A5)
5. **§6 DoD SOT boundary** → «`pages/` + `components/sections/`» (не «всі components»). (A4)
6. **§2.6 performance budget** → замінити «Lighthouse Performance ≥ 90» на «Lighthouse Perf/A11y/BP/SEO ≥ 90 each». (D1)
7. **§1.5 HUB-04 Acceptance** → видалити CTA «підписатись» (v2 only); залишити text + single cube. (B4)
8. **§1.5 HOME-01 Acceptance** → додати "slogan verbatim з brand-system §1; wordmark case — client sign-off". (A3, B3)
9. **§4 Phase 6 stages** → OG image: `sharp` composite (не AI-prompt); зняти `design-image-prompt-engineer`, додати `design-visual-storyteller` для composition review. (D3)
10. **§4 Phase 5 stages** → додати «Session-skip implementation (sessionStorage `hero-seen`)». (D2)
11. **§1.5** додати **DEV-01** («/dev/brand») і **DEV-02** («/dev/grid») як P1-feature IDs з phase mapping. (D6)
12. **§7 Risks** → додати:
    - R17: Logo URL-import з `brand-assets/` може fail на Rollup prod-build — verify `dist/assets/` містить SVG (A1)
    - R18: `scripts/*` завжди `fileURLToPath`, ніколи `.pathname` (C2 lesson)
    - R19: Montserrat ≥14px ONLY discipline для `text-text-muted` — не використовувати `text-xs` з muted навіть з bold (B6, Footer h2 вже has it)
13. **§4 «НЕ викликаємо» table** → перенести `design-image-prompt-engineer` в «skip» для OG. (D3)
14. **§4 Phase 6 deploy** → clarifying: workflow вже scaffolded Phase 1+2; Phase 6 = Pages settings verify + first successful run + public URL smoke. (D4)

---

## F. Verdict

**План перед застосуванням патчів:** **NOT SAFE to execute `/gsd:plan-phase 03`**.
**Причина:** patch #1 (image pipeline split) і patch #3 (Wordmark brand discipline) — фундаментальні для Phase 3 plan-shape. Якщо planner gsd-planner візьме поточний PLAN.md як вхід, він запропонує Wordmark як brand primitive + sharp у copy-renders, і Phase 3 буде частково переробляти обидва.

**План після застосування 14 патчів:** **SAFE**. Phase 3 stable-ready.

**Пріоритет виконання:** патчі A1-A5 (blocker-level) — **обов'язково** до `/gsd:plan-phase 03`. Патчі B1-B6 і C1-C5 — бажано **у тому ж passі** бо Phase 3 Plan на них спирається. Патчі D1-D9 — можна застосувати upon Phase 3 completion без негативних наслідків.

---

*Audit 2026-04-24. Prepared at user request «прискіпливо перевір весь план».*
