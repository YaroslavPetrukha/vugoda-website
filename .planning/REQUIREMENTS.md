# Requirements: Vugoda Website

**Defined:** 2026-04-24
**Core Value:** Клієнт отримує публічний URL, за яким видно «ахуєнний» desktop-варіант корпсайту ВИГОДИ у бренді — з точною палітрою, ізометричними кубами, cinematic-анімаціями на Motion, і чесним відображенням портфеля 0-здано / 1-активно / 4-pipeline.

## v1 Requirements (MVP — Core-4 scope)

Requirements for clickable demo URL handed to client. Each maps to a roadmap phase.

### Home (`/`)

- [ ] **HOME-01**: Desktop-first головна з hero-секцією — wordmark «ВИГОДА» + slow-parallax ізометричний куб-патерн (opacity 10–20%) + гасло «Системний девелопмент, у якому цінність є результатом точних рішень.» + функціональний CTA «Переглянути проекти»
- [ ] **HOME-02**: Секція бренд-есенції — 4 цінності картками (системність · доцільність · надійність · довгострокова цінність)
- [ ] **HOME-03**: Секція огляду портфеля — дворівнева ієрархія: Lakeview-флагман (велика hero-картка) + 3 pipeline-картки (Етно Дім / Маєток / NTEREST) у сітці 3-в-ряд + агрегативний рядок Pipeline-4
- [ ] **HOME-04**: Секція «Хід будівництва Lakeview» — компактна стрічка-тизер (3–5 фото з `/construction/mar-2026/` горизонтально) + дата + CTA «Дивитись повний таймлайн» → `/construction-log`
- [ ] **HOME-05**: Методологія teaser — 2–3 блоки з «Як ми будуємо» (§8 концепції) + CTA «Детальніше про процес»
- [ ] **HOME-06**: Довіра-блок — реквізити-таблиця: ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, безстрокова ліцензія від 27.12.2019. Не «команда», не обличчя.
- [ ] **HOME-07**: Форма контакту «Ініціювати діалог» — функціональний стиль, `mailto:vygoda.sales@gmail.com` для MVP

### Portfolio Hub (`/projects`)

- [ ] **HUB-01**: Сторінка `/projects` з фільтром за 4 бакетами Моделі-Б: «У розрахунку» · «У погодженні» · «Будується» · «Здано»; бакет «Здано (0)» видимий як прозорість
- [ ] **HUB-02**: Lakeview — дворівнева hero-картка, рендер `renders/likeview/aerial.jpg` (→ public/renders/lakeview/), ключові параметри, CTA «Перейти на сайт проекту» → `https://yaroslavpetrukha.github.io/Lakeview/` (зовнішній редирект, без внутрішньої ЖК-сторінки)
- [ ] **HUB-03**: Сітка 3-в-ряд для pipeline-карток з явним маркуванням стадії («меморандум», «кошторисна документація», «дозвільна документація»); одна стадія на картку словами з CONCEPT §2, не синоніми
- [ ] **HUB-04**: Агрегативний рядок Pipeline-4 під сіткою — без візуалу, текст: «+1 об'єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.» + ізометричний куб base-module (cube-ladder page-20)

### ЖК Template (`/zhk/etno-dim`)

- [ ] **ZHK-01**: Повноцінна сторінка `/zhk/etno-dim` — hero-рендер з `renders/ЖК Етно Дім/` (→ public/renders/etno-dim/), факт-блок (стадія «меморандум про відновлення будівництва», розташування вул. Судова Львів), блок «Що відбувається зараз» (стадія-специфічний текст), галерея 8 рендерів, CTA «Підписатись на оновлення (Instagram)» + форма зв'язку. Без цін, без умов продажу — pipeline не продається.
- [ ] **ZHK-02**: Шаблон масштабований — додавання ЖК #6 = один запис у `src/data/projects.ts`. Discriminated union `presentation: 'flagship-external' | 'full-internal' | 'grid-only' | 'aggregate'`. Маєток/NTEREST у v1 залишаються як `grid-only` (картка на хабі, без внутрішньої сторінки).

### Construction Log (`/construction-log`)

- [ ] **LOG-01**: Окрема сторінка `/construction-log` з галерею-таймлайном Lakeview — 50 фото з `/construction/{dec-2025, jan-2026, feb-2026, mar-2026}/` згруповані по місяцях, lazy-load, lightbox (native `<dialog>`)
- [ ] **LOG-02**: Підписи у стилі «Січень 2026 — фундамент, секція 1», без маркетингових хвастощів; alt-и короткі («Будівельний майданчик, січень 2026»). WebP first, AVIF якщо доступно, JPG fallback через `<picture>`

### Contact (`/contact`)

- [ ] **CTC-01**: Сторінка `/contact` — email `vygoda.sales@gmail.com` (активний `mailto:`); телефон / юр. адреса — текст `—` (placeholder для незапитаних у клієнта даних, не `{{token}}` в розмітці); соцмережі — `href="#"` заглушки до запуску

### Navigation & Layout

- [ ] **NAV-01**: Фіксований навбар (dark, `#2F3640`, dark-лого SVG з `brand-assets/logo/dark.svg`) + футер на КОЖНІЙ сторінці містить мінімум: юр. назва ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ `42016395`, ліцензія `27.12.2019`, email `vygoda.sales@gmail.com`. Persona-3 (банк DD) заходить з Google на глибокі сторінки, не лише home.

### Visual System (brand tokens)

- [ ] **VIS-01**: Брендові токени — точно `#2F3640` / `#C1F33D` / `#F5F7FA` / `#A7AFBC` / `#3D3B43` / `#020A0A`. Tailwind v4 `@theme` block у `index.css` (не JS token export). Прототипне значення `#2a3038` — замінити на `#2F3640` при міграції.
- [ ] **VIS-02**: Montserrat через `@fontsource/montserrat@5.2.8` — імпортувати ТІЛЬКИ `cyrillic-{400,500,700}.css` entry points (не package root) для повної кирилиці без латинського overhead
- [ ] **VIS-03**: Ізометричний куб-патерн — інлайн-SVG React-компонент `<IsometricCube variant='single'|'group'|'grid' />` (3 ступені складності з брендбуку page-20). Hero overlay — `<IsometricGridBG opacity=0.1-0.2 />`. Cube-ladder semantics для стадій — CONCEPT §5.2.
- [ ] **VIS-04**: Офіційні SVG/PNG логотипи з `brand-assets/logo/` (`dark.svg` у навбарі; `black.svg` на чорних секціях; `primary.svg` на світлих — якщо будуть); favicon з `brand-assets/favicon/favicon-32.svg`. Охоронне поле = cap-height літери «В». Мін. розмір 100px.

### Animations

- [ ] **ANI-01**: Hero slow-parallax ізометричного куб-патерну — Motion `useScroll`+`useTransform`, ease-out, без bounce. Кінематографічна повільна подача (concept tone: стриманий).
- [ ] **ANI-02**: Scroll-triggered reveal секцій — `<RevealOnScroll>` wrapper (Motion `whileInView` + `fadeUp` variant), ~400ms, stagger для карток. Один SOT варіантів у `lib/motionVariants.ts` — ніяких inline `transition={{…}}`.
- [ ] **ANI-03**: Hover-стани карток ЖК — subtle scale (≤1.02) + overlay-opacity delta, brand-consistent (без пружинних springs)
- [ ] **ANI-04**: Smooth route-transitions між 5 сторінками — `AnimatePresence mode="wait"` keyed on pathname, `pageFade` варіант. Respects `useReducedMotion`.

### Deploy

- [ ] **DEP-01**: GitHub Actions workflow `deploy.yml` — build → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`. Не використовуємо `gh-pages` npm-пакет.
- [ ] **DEP-02**: Публічний URL `https://yaroslavpetrukha.github.io/vugoda-website/` (чи інший обліковий запис) доступний клієнту; demo-посилання разово перевіряється в incognito перед handoff
- [ ] **DEP-03**: react-router-dom **HashRouter** (не BrowserRouter) + Vite `base: '/vugoda-website/'` + `public/.nojekyll` закомічено. HashRouter позбавляє від 404-on-hard-refresh на GH Pages без трюків з 404.html. Переходимо на BrowserRouter у v2 при custom domain.

### Content

- [ ] **CON-01**: Контент копірайту — безпосередньо з `КОНЦЕПЦІЯ-САЙТУ.md` (§7, §8) як TSX/MDX literals або модулі `src/content/*.ts`; без CMS у v1. ⚠ пункти методології 2/5/6 — позначаємо як потребуючі верифікації (не публікуємо як факт).
- [ ] **CON-02**: Дані портфеля — типізований `src/data/projects.ts` (інтерфейс `Project` + discriminated `presentation` union). Плюс `src/data/projects.fixtures.ts` з 10 синтетичними ЖК (для `/dev/grid` QA route, не в production build).

### QA

- [ ] **QA-01**: Desktop-first 1920×1080 виглядає бездоганно; 1280–1919px — graceful; <1024px — dedicated mobile-fallback сторінка («Сайт оптимізовано для ≥1280px» + 4 CTA-лінки), НЕ зламаний responsive. Mobile/tablet повний — явно v2.
- [ ] **QA-02**: Lighthouse desktop ≥ 90 усі 4 категорії (Performance / Accessibility / Best Practices / SEO). Hero render ≤ 200KB (AVIF/WebP), bundle ≤ 200KB gzipped JS.
- [ ] **QA-03**: OG meta tags + Twitter Card + `theme-color="#2F3640"` + canonical URL у `index.html`. OG image — 1200×630 render з hero ізометричним кубом. Демо-URL має чисто анфурлитись у Viber/Telegram/Slack.
- [ ] **QA-04**: CI denylist — `grep -r "Pictorial\|Rubikon\|Пикторіал\|Рубікон" dist/` порожньо на кожен build; `grep -rE "#[0-9A-Fa-f]{6}" src/` — усі hex ⊆ 6 брендбукових кольорів; `grep -r "{{\|TODO" dist/` порожньо.

## v2 Requirements

Deferred — not in MVP roadmap.

### Pages v2

- **PAGE2-01**: `/about` — повна сторінка (юр. особа, принцип системності, реквізити, документи)
- **PAGE2-02**: `/how-we-build` — повна сторінка з §8 методологією (7 блоків)
- **PAGE2-03**: `/buying` — умови купівлі (розтермінування, знижки, переуступка, єОселя)
- **PAGE2-04**: `/investors` — блок для Персони-1 (дохідна нерухомість, переуступка, юр. захист, FAQ)
- **PAGE2-05**: Повні `/zhk/maetok-vynnykivskyi` та `/zhk/nterest` (`grid-only` → `full-internal`)

### Content v2

- **CONT2-01**: Реальний телефон + юр./поштова адреса замість `—` placeholder-ів (блокер §11.1–2)
- **CONT2-02**: Фінальна назва Pipeline-4 + дані (блокер §11.3)
- **CONT2-03**: Верифікована методологія §8 (пункти 2/5/6) з клієнтом
- **CONT2-04**: Технічні характеристики Lakeview (клас наслідків, технологія, кадастр) — після верифікації

### Infrastructure v2

- **INFR2-01**: Sanity CMS міграція — маркетолог додає ЖК без розробника
- **INFR2-02**: Перехід на Next.js 15 + SSR/ISR при міграції на production + custom domain
- **INFR2-03**: BrowserRouter + clean URLs замість HashRouter (при custom domain)
- **INFR2-04**: Серверний endpoint форм (не `mailto:`) + Telegram-бот для менеджерів
- **INFR2-05**: Privacy-policy сторінка (триггерить при додаванні аналітики)
- **INFR2-06**: GA4 + Meta Pixel + GTM (§11.14 — після підтвердження вимог клієнта)
- **INFR2-07**: **Повний mobile/tablet responsive** — ⚠ reclassify from deprioritised to pre-production blocker (UA real-estate mobile share 60-70%)

### Features v2

- **FEAT2-01**: `/news` або `/construction-log` розширена (інші ЖК крім Lakeview)
- **FEAT2-02**: `/faq` — часті питання
- **FEAT2-03**: `/documents` — публічна бібліотека (ліцензія, дозволи, сертифікати)
- **FEAT2-04**: `/partners` — B2B-секція (банки, ріелтори, юристи)
- **FEAT2-05**: єОселя-акредитація badge на ЖК-картках
- **FEAT2-06**: EN localisation (для закордонних інвесторів, §11.13)

## Out of Scope

Explicit exclusions. Anti-features from research.

| Feature | Reason |
|---------|--------|
| Прайс-лист на корпсайті | Корпсайт — це фільтр довіри, не sales channel; ціни на лендингах ЖК (зараз Lakeview має); CONCEPT §7.5 |
| Apartment picker / конфігуратор квартир | Функція sales-лендингу, не корпсайту; буде у Lakeview і майбутніх ЖК-лендингах |
| Virtual tours / 3D / 360° | Концепція §9 — «Three.js зараз надлишковий»; WebGL деконструює cinematic Motion подачу |
| Mortgage/єОселя calculator | Функція банка-партнера, не забудовника; ризик невірних даних |
| Agent finder / менеджер-матчинг | Малий штат; контакт менеджера через `mailto:` |
| Team page / фото керівництва | Hard-rule клієнта (CONTEXT §1, CONCEPT §10.1): довіра = юр. факти, не обличчя |
| Повноцінна внутрішня сторінка Lakeview | CONCEPT §4.3: мініатюра + редирект, уникаємо SEO-канібалізації з Lakeview-лендингом |
| Lakeview social-cover imagery (`/construction/_social-covers/`) | Бренд-конфлікт: різна типографіка (Lakeview Cormorant Garamond); CONCEPT §7.9, §10.2 |
| Stock photos чужих будинків | CONCEPT Додаток C: прототипні `public/*.jpg` заборонені; рендери ТІЛЬКИ з `/renders/` |
| Рендери Pictorial/Rubikon legacy | Silent-displacement, hard-rule; CONCEPT §10.2 |
| Reviews/testimonials | Корпсайт забудовника; довіра через юр. реєстри та ліцензію, не через соцпруф |
| Awards / рейтинги badges | 0 зданих → немає що показувати; concept tone «без суперлативів» |
| RU language switcher | Українськомовний ринок 2026; ніколи |
| Live chat / Intercom | Overhead без цінності для low-volume B2C ринку; форма + mailto достатньо |
| Next.js 15 + Sanity + Vercel | Концепція §9 радить, але MVP = GitHub Pages static. Розглядаємо при міграції в production (v2 INFR2-02) |
| Three.js / WebGL / Spline | Concept tone стриманий; Motion + SVG достатньо для cinematic |
| Mobile responsive повний | v1 — desktop-first; mobile — fallback-сторінка. Повний responsive — v2 INFR2-07 |
| Privacy-policy у v1 | `mailto:`-only → нуль обробки даних → UA-DPA/GDPR не триггерить. Додається у v2 з аналітикою. |
| Аналітика у v1 | §11.14 — клієнт ще не підтвердив вимоги. У v2 INFR2-06. |
| CMS у v1 | Клієнт потребує URL для демо, не редакційну платформу. Контент у коді. |
| Бекенд форм у v1 | `mailto:` достатньо для demo-handoff. Server endpoint — v2 INFR2-04. |
| Verbal verification методології §8 до показу | ⚠ Блоки 2/5/6 позначаємо «потребує верифікації» у UI; не ховаємо, не фабрикуємо. CONCEPT §11.5. |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | TBD | Pending |
| HOME-02 | TBD | Pending |
| HOME-03 | TBD | Pending |
| HOME-04 | TBD | Pending |
| HOME-05 | TBD | Pending |
| HOME-06 | TBD | Pending |
| HOME-07 | TBD | Pending |
| HUB-01 | TBD | Pending |
| HUB-02 | TBD | Pending |
| HUB-03 | TBD | Pending |
| HUB-04 | TBD | Pending |
| ZHK-01 | TBD | Pending |
| ZHK-02 | TBD | Pending |
| LOG-01 | TBD | Pending |
| LOG-02 | TBD | Pending |
| CTC-01 | TBD | Pending |
| NAV-01 | TBD | Pending |
| VIS-01 | TBD | Pending |
| VIS-02 | TBD | Pending |
| VIS-03 | TBD | Pending |
| VIS-04 | TBD | Pending |
| ANI-01 | TBD | Pending |
| ANI-02 | TBD | Pending |
| ANI-03 | TBD | Pending |
| ANI-04 | TBD | Pending |
| DEP-01 | TBD | Pending |
| DEP-02 | TBD | Pending |
| DEP-03 | TBD | Pending |
| CON-01 | TBD | Pending |
| CON-02 | TBD | Pending |
| QA-01 | TBD | Pending |
| QA-02 | TBD | Pending |
| QA-03 | TBD | Pending |
| QA-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 0 (awaiting roadmap)
- Unmapped: 34 ⚠️

---
*Requirements defined: 2026-04-24*
*Last updated: 2026-04-24 after initial definition*
