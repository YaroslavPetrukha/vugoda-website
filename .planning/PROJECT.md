# Vugoda Website — корпоративний сайт забудовника «ВИГОДА»

## What This Is

Корпоративний багатосторінковий сайт львівського забудовника «ВИГОДА» — хаб-точка входу, яка демонструє портфель (1 активний ЖК Lakeview + 4 pipeline-об'єкти) через лінзу «системного девелопменту»: стриманий, доказовий, рациональний. **Поточний deliverable — клікабельний desktop-first MVP-прототип для передачі клієнту як URL**, задеплоений на GitHub Pages з власного репозиторію `vugoda-website`.

## Core Value

**Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді — з точною палітрою, ізометричними кубами, cinematic-анімаціями на Motion, і чесним відображенням портфеля 0-здано/1-активно/4-pipeline.** Якщо все інше не вийде, ця демо-версія має виглядати дорого на 1920×1080 і клікатись між чотирма ключовими екранами.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] **CON-01**: Контент копірайту — безпосередньо з `КОНЦЕПЦІЯ-САЙТУ.md` (§7, §8) як TSX/MDX literals; без CMS *(Validated in Phase 2: 4 content modules `src/content/*.ts` — methodology з ⚠-flags на §8 блоках 2/5/6, values, company, placeholders)*
- [x] **CON-02**: Дані портфеля (назва, стадія, рендери, slug) — у TypeScript-об'єкті `src/data/projects.ts`; додавання нового ЖК = один запис *(Validated in Phase 2: 5 канонічних ЖК у `projects.ts` + 10 синтетичних fixtures доводять scale-to-N)*
- [x] **ZHK-02**: Шаблон має бути масштабований — без змін коду додаємо Маєток, NTEREST, Pipeline-4 через дані *(Validated in Phase 2: discriminated `presentation` union + fixtures для всіх 4 Stage × 4 Presentation варіантів)*
- [x] **QA-04**: CI denylist — `grep -r "Pictorial\|Rubikon\|..." dist/` порожньо; hex ⊆ 6 брендбукових; `{{`/`TODO` у `dist/` порожньо *(Validated in Phase 2: `scripts/check-brand.ts` з 4 інваріантами, wired через postbuild + deploy.yml)*
- [x] **HOME-01**: Desktop-first головна з hero-секцією *(Validated in Phase 3: Hero.tsx wordmark + IsometricGridBG opacity 0.15 + heroSlogan + CTA → /projects + parallax range [0,-100] under SC#1 strict «<120px»)*
- [x] **HOME-02**: Секція бренд-есенції *(Validated in Phase 3: BrandEssence.tsx renders 4 numbered cards from `brandValues` content module)*
- [x] **HOME-03**: Секція огляду портфеля *(Validated in Phase 3: PortfolioOverview.tsx flagship LCP + 3 pipeline cards + Pipeline-4 aggregate row with single-cube marker; reads derived views, never filters projects[])*
- [x] **HOME-04**: Секція «Хід будівництва Lakeview» *(Validated in Phase 3: ConstructionTeaser.tsx CSS scroll-snap + ResponsivePicture + CTA from content layer with U+2192 baked-in glyph)*
- [x] **HOME-05**: Методологія teaser *(Validated in Phase 3: MethodologyTeaser.tsx renders 3 §8 blocks with ⚠ DOM marker + aria-label for needsVerification)*
- [x] **HOME-06**: Довіра-блок *(Validated in Phase 3: TrustBlock.tsx 3-column legal table from `company.ts` typed legal facts; zero `<img>` of people)*
- [x] **HOME-07**: Форма контакту *(Validated in Phase 3: ContactForm.tsx zero `<form>/<input>/<textarea>` — single mailto: anchor styled as button on bg-bg-black closer)*
- [x] **VIS-03**: Ізометричний куб-патерн *(Validated in Phase 3: IsometricCube typed-discriminated 3 variants × 3 strokes + IsometricGridBG svgr-imported with D-03 opacity 0.10–0.20 ceiling)*
- [x] **VIS-04**: Офіційні SVG-логотипи *(Validated in Phase 3: Logo URL-import dark.svg + Mark URL-import mark.svg + favicon)*
- [x] **ANI-01**: Hero slow-parallax *(Validated in Phase 3: useScroll target=heroRef + useTransform [0,1]→[0,-100] linear, no spring/bounce; useReducedMotion collapses to [0,0])*
- [x] **ANI-02**: Scroll-triggered reveal секцій *(Validated in Phase 5: `<RevealOnScroll>` SOT API at `src/components/ui/RevealOnScroll.tsx` consumed across 26 sites; `motionVariants.ts` + `--ease-brand` lockstep SOT; `noInlineTransition` permanent CI gate)*
- [x] **ANI-04**: Smooth route-transitions між 5 сторінками *(Validated in Phase 5: `<AnimatePresence mode="wait">` in `Layout.tsx` keyed by pathname + `pageFade` variant + `onExitComplete` scroll-restore; `ScrollToTop.tsx` removed)*

### Active

<!-- Core-4 MVP scope + Lakeview construction layer. -->

- [ ] **HUB-01**: Сторінка `/projects` з фільтром за 4 бакетами Модель-Б (У розрахунку · У погодженні · Будується · Здано)
- [ ] **HUB-02**: Дворівнева картка Lakeview (hero-розмір, рендер `aerial.jpg`, CTA «Перейти на сайт проекту» → `https://yaroslavpetrukha.github.io/Lakeview/`)
- [ ] **HUB-03**: Сітка 3-в-ряд для pipeline-карток з явним маркуванням стадії
- [ ] **HUB-04**: Агрегативний рядок Pipeline-4 під сіткою (без візуалу, текст + pending-куб)
- [ ] **ZHK-01**: Повноцінна сторінка `/zhk/etno-dim` як шаблон-демо: hero-рендер з `renders/ЖК Етно Дім/`, факт-блок стадії, «Що відбувається зараз», галерея 8 рендерів, CTA «Підписатись на оновлення», без форм продажу/цін
- [ ] **LOG-01**: Окрема сторінка `/construction-log` з таймлайн-галереєю Lakeview (50 фото, групування по місяцях dec-2025, jan-2026, feb-2026, mar-2026)
- [ ] **LOG-02**: Підписи в стилі «Січень 2026 — фундамент, секція 1», без хвастощів; webp, lazy-load
- [ ] **CTC-01**: Сторінка `/contact` (email `vygoda.sales@gmail.com`; телефон/адреса — `{{placeholder}}` до уточнення; соцмережі — `href="#"`)
- [ ] **NAV-01**: Фіксований навбар (dark, `#2F3640`) + футер на КОЖНІЙ сторінці містить мінімум: юр. назву ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ `42016395`, ліцензію `27.12.2019`, email `vygoda.sales@gmail.com`. Persona-3 (банк DD) заходить з Google на глибокі сторінки, не лише home. Desktop-first.
- [ ] **VIS-01**: Брендові токени — точно `#2F3640` / `#C1F33D` / `#F5F7FA` / `#A7AFBC` / `#3D3B43` / `#020A0A` (CSS-змінні, Tailwind v4 theme)
- [ ] **VIS-02**: Montserrat через `@fontsource/montserrat` (Bold/Medium/Regular), повна кирилиця
- [ ] **ANI-03**: Hover-стани карток ЖК (subtle scale/overlay, brand-consistent)
- [ ] **DEP-01**: Автоматичний деплой на GitHub Pages (GitHub Action `build → gh-pages` або `actions/deploy-pages`)
- [ ] **DEP-02**: Публічний URL `https://yaroslavpetrukha.github.io/vugoda-website/` (або інший обліковий запис) доступний клієнту
- [ ] **DEP-03**: react-router-dom **HashRouter** (не BrowserRouter) + Vite `base: '/vugoda-website/'` + `public/.nojekyll` закомічено. HashRouter позбавляє від 404-on-hard-refresh на GH Pages без трюків з 404.html. Переходимо на BrowserRouter у v2 при custom domain.
- [ ] **QA-01**: Desktop-first 1920×1080 — виглядає бездоганно; мінімальний graceful fallback для ≥1280px; mobile/tablet — **явно out-of-scope в v1**
- [ ] **QA-02**: Lighthouse desktop ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] **QA-03**: OG meta tags + Twitter Card + `theme-color="#2F3640"` + canonical URL в `index.html`. OG image — 1200×630 render з hero ізометричним кубом. Демо-URL має чисто анфурлитись у Viber/Telegram/Slack.

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- **Sanity CMS / будь-яка CMS в MVP** — клієнту потрібна демо-URL, не редакційна платформа. Контент у коді. Sanity розглядаємо у v2, якщо проект рухається в production.
- **Next.js 15 / SSR / ISR** — концепція §9 рекомендує, але для GitHub Pages static-деплою Vite-SPA простіший і швидший. Next.js можна розглянути при міграції в production (окремий milestone).
- **Mobile/tablet адаптив** — користувач явно деприоритизував. Desktop-first, mobile = graceful fallback (без розвалу верстки). Повний responsive дизайн — v2.
- **Three.js / WebGL / Spline** — концепція §9 прямо пише «Three.js зараз надлишковий»; cinematic-рівень досягаємо через Motion + SVG + CSS transform. Повертаємось до 3D тільки якщо клієнт явно просить після першого показу.
- **Фото/імена команди, керівництва** — hard-rule клієнта (CONTEXT §1, CONCEPT §10.1). Не плануємо і не моделюємо.
- **Lakeview як повноцінна внутрішня сторінка** — тільки мініатюра + редирект (CONCEPT §4.3). Уникаємо SEO-канібалізації і дублювання з лендингом ЖК.
- **SMM-обкладинки `/construction/_social-covers/`** — бренд-конфлікт (типографіка Lakeview, не Вигоди). На корпсайті Вигоди НЕ використовуємо (CONCEPT §7.9, §10.2).
- **Прототипні асети з `/вигода-—-системний-девелопмент/public/*.jpg`** — чужі будинки, не Вигоди (CONCEPT Додаток C). Заборонено.
- **Рендери Pictorial/Rubikon з `/вигода-—-системний-девелопмент/Рендера/`** — silent displacement, legacy. Заборонено (CONCEPT §10.2).
- **Сторінки `/about`, `/how-we-build`, `/buying`, `/investors`** — v2. Core-4 фокус на найбільш візуально-критичних екранах.
- **`/news`, `/faq`, `/documents`, `/partners`** — явно в concept §4.2 позначені як v2.
- **Бекенд форм (окрім `mailto:`)** — у MVP форма лише відкриває пошту. Серверний endpoint — v2.
- **Мультимовність (EN для інвесторів)** — відкрите питання §11.13, UA-only в MVP.
- **Аналітика (GA4, Meta Pixel, GTM)** — v2, коли клієнт підтвердить вимоги (§11.14).
- **Privacy-policy сторінка / лінк у футері** — у v1 лише `mailto:` (нуль обробки даних, нуль cookies, нуль third-party скриптів → UA-DPA/GDPR не триггерить). Додавання мертвого лінка «Політика конфіденційності» гірше за відсутність. Повертаємося до цього у v2, коли додаємо аналітику АБО real contact-endpoint.
- **Верифікація методології §8 з клієнтом** — у MVP показуємо проект зі знаком ⚠ на пунктах 2/5/6; правка після фідбеку.

## Context

### Бренд (зафіксовано, джерело правди — брендбук)

- Палітра: закрита, 6 кольорів (див. VIS-01)
- Шрифт: Montserrat, 3 ваги
- Графічна мова: лінійна ізометрія + каркасні куби (stroke 0.5–1.5pt, opacity 5–60%, `#A7AFBC` / `#F5F7FA` / `#C1F33D`, тільки прямі лінії)
- Tone of voice: чітко · впевнено · предметно · стримано
- Заборонені слова: «мрія», «найкращий», «унікальний», «преміальний стиль життя»
- Контраст WCAG 2.1 перевірено (brand-system §3): `#F5F7FA/#2F3640` = 10.5:1 AAA

### Портфель (станом на 2026-04-24, з CONTEXT §2)

| # | Об'єкт | Стадія | Рендери | MVP-картка |
|---|--------|--------|---------|-----------|
| 1 | **ЖК Lakeview** | активне будівництво, здача 2027 | `renders/likeview/` (7) | мініатюра + редирект |
| 2 | **ЖК Етно Дім** | меморандум | `renders/ЖК Етно Дім/` (8) | **повноцінна `/zhk/etno-dim`** (шаблон-демо) |
| 3 | **ЖК Маєток Винниківський** | кошторисна документація | `renders/ЖК Маєток Винниківський/` (2) | картка на хабі (без окремої сторінки в v1) |
| 4 | **Дохідний дім NTEREST** | дозвільна документація | `renders/Дохідний дім NTEREST/` (3) | картка на хабі (без окремої сторінки в v1) |
| 5 | Без назви | кошторисна вартість | — | агрегативний рядок |

### Хід будівництва Lakeview

- Джерело: `/construction/` — 50 сирих документальних фото у 4 папках (dec-2025: 12, jan-2026: 11, feb-2026: 12, mar-2026: 15)
- ВИКОРИСТОВУЄМО на корпсайті Вигоди (landscape, без тексту)
- `/construction/_social-covers/` (6 файлів) — **НЕ використовуємо** (бренд-конфлікт: Lakeview-typography)

### Існуючий прототип

- Папка `вигода-—-системний-девелопмент/` — існуючий Vite + React 19 + Tailwind v4 + Motion прототип
- **Код/структура** — можна дивитись як референс патернів
- **Контент і асети** — НЕ інхеритимо (placeholder-ні фото, чужі будинки; концепція §Додаток C прямо забороняє)
- Токен `--color-bg-base: #2a3038` у прототипі — ⚠ неточний, дорівнює брендбуковому `#2F3640` має бути; виправити при міграції

### Відкриті питання (з CONCEPT §11 — placeholder-имо в MVP, чекаємо клієнта)

Блокує фінал, не старт: корпоративний телефон, юр. адреса, назва Pipeline-4, фінальне підтвердження Моделі-Б для стадій, верифікація методології (блоки 2/5/6), транслітерація slug-ів (особливо `maetok` vs `maietok`; `nterest` vs `dohidnyi-dim-nterest`), написання «NTEREST» без «I», чи зберігається адреса Етно Діма вул. Судова.

## Constraints

- **Tech stack**: Vite 6 + React 19 + Tailwind v4 + Motion (inherit зі стеку існуючого прототипу; react-router-dom для 5 сторінок) — GitHub Pages static-only, без CMS, без SSR
- **Deployment**: GitHub Pages з гілки `gh-pages` або `actions/deploy-pages` — публічний URL для демо клієнту
- **Performance budget**: Lighthouse Desktop ≥ 90 усі 4 категорії; hero render ≤ 200KB (AVIF/WebP), bundle ≤ 200KB gzipped JS
- **Accessibility floor**: WCAG 2.1 AA для normal text; текст `#A7AFBC` на `#2F3640` — тільки для ≥14pt (контраст 5.3:1); `#C1F33D` — ніколи на світлому фоні
- **Дизайн**: desktop-first 1920×1080; нижче 1280px — graceful fallback без розвалу; mobile responsive — НЕ v1
- **Бренд**: 6 кольорів, 1 шрифт (3 ваги), ізометричні куби — без винятків. Жодних декоративних шрифтів, тіней на лого, градієнтів.
- **Копі**: tone of voice брендбуку — стриманий, без маркетингових суперлативів; ні «мрія»/«найкращий»/«унікальний»
- **Правила**: silent displacement — ТІЛЬКИ Lakeview (Pictorial/Rubikon); без фото/імен команди; рендери ТІЛЬКИ з `/renders/`
- **Skeptic-pass правило**: перед використанням будь-якого inherited-контенту з CONCEPT/CONTEXT — флажити бездокументальні заяви, не тихо розширювати (auto-memory rule)
- **Timeline**: MVP — кілька ітерацій; клієнту віддаємо URL, коли 5 сторінок клікабельні і десктоп виглядає «ахуєнно»
- **Browser support**: сучасні (last 2 versions Chrome/Safari/Firefox/Edge), без IE11

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite + React + Motion (не Next.js + Sanity) | GitHub Pages = static; Vite простіший; інхерит з існуючого прототипу | — Pending |
| Core-4 scope (Home + /projects + /zhk/etno-dim + /contact + /construction-log) | Демо-URL має бути клікабельним швидко; `/about`, `/how-we-build`, `/buying`, `/investors` = v2 | — Pending |
| Етно Дім як шаблон-демо ЖК | 8 рендерів (найбільше); стадія «меморандум» = корисна «системна» історія | — Pending |
| Повний Lakeview construction (teaser + /construction-log) | Єдиний візуальний доказ активності при 4/5 об'єктах у pre-construction | — Pending |
| Thin cinematic (Motion + SVG, без WebGL) | Концепція прямо каже «Three.js надлишковий»; Motion достатньо для wow-ефекту | — Pending |
| Модель Б для стадій (4 бакети) + placeholder-ні дані | CONCEPT §6.1 рекомендує Модель Б; placeholder-ним підходом не блокуємось на client-sign-off | — Pending |
| Repo name: `vugoda-website` | Збігається з іменем папки, передбачувано | — Pending |
| UA-only в MVP | EN для інвесторів — відкрите питання §11.13 | — Pending |
| Контент — інхеримо з CONCEPT §7, §8 безпосередньо, з ⚠ на неверифікованих пунктах | Клієнт сам узгодив цей документ (tu.) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-25 — Phase 3 (Brand Primitives & Home Page) complete; HOME-01..07, VIS-03, VIS-04, ANI-01 validated. Audit findings CF-1, QC-1, QC-3 closed by fix commit 3ae662d before transition to Phase 4.*
