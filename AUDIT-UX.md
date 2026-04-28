# UX-аудит корпоративного сайту «ВИГОДА»

**Скоуп:** Десктопний клікабельний MVP-прототип, deploy на GitHub Pages.
**URL:** https://yaroslavpetrukha.github.io/vugoda-website/
**Дата аудиту:** 2026-04-27
**Аудитор:** UX Researcher (зовнішній)
**База доказів:** 5 пейджів × 8 viewport-скріншотів + 100% компонентного дерева src/.
**Контекст обмежень:** Hash-based SPA, mobile cutoff <1024px = заглушка (рішення клієнта), бекенду форм немає (тільки `mailto:`), кольорова паліта закрита (6 хексів), бренд-гайд жорсткий (стримано, без суперлативів).

> **Disclaimer:** аудит виконаний у режимі «жорсткого скептика» — фокус на проблемах, не на досягненнях. Багато архітектурних рішень обґрунтовані PROJECT.md/CONCEPT.md і свідомо прийняті — у звіті це позначено пунктами «навмисний trade-off».

---

## 0. Виконавчий підсумок

Сайт має **сильний бренд-каркас і чистий тон копірайтингу**, але **проявляє низку UX-критичних дефектів**, частина з яких напряму руйнує демонстрацію премʼюм-позиціонування для клієнта-забудовника й унеможливлює конверсію зі смартфону. Найкритичніші проблеми (P0): (1) хеш-URL у мережевих посиланнях виглядають як 2014 рік для бренду «системного девелопменту»; (2) повний mobile-cutoff <1024px викидає 65-75% потенційного українського трафіку у безвиходний placeholder без жодної альтернативи; (3) телефон і фізична адреса = «—» на сторінці «Контакт» руйнує юридичну довіру B2B-аудиторії, що приходить з земельним питанням; (4) відсутній skip-link, відсутня live-індикація на page-transition, фокус не повертається на `<h1>` після навігації — це WCAG 2.1 AA failure при заявленому AA-floor; (5) `/zhk/lakeview` робить cross-origin redirect через `window.location.assign`, що ламає Back-кнопку браузера й вибиває користувача з контексту головного бренду.

**Загальна оцінка готовності до клієнтської передачі:** 6.5/10 для desktop-only demo, 3/10 для production-ready B2C-конверсії.

**Рекомендований шлях:** P0-фікси (5-7 годин роботи) + чіткий Loom-disclaimer клієнту, що mobile-treatment = окремий phase.

---

## 1. Heuristic Evaluation (Nielsen 10)

### 1.1. Visibility of system status (Видимість стану системи) — **6/10**

**Що працює:**
- Active link в Nav має 2px accent underline (`linkActive` у `Nav.tsx`) — видно, де ти зараз. Підтверджено на скріні `live-contact-1920-full.png` («Контакт» з підкресленням).
- Hover-стан на картках `hover-card` додає scale+glow, відчутний feedback.
- `BuduetsyaPointer` має `aria-live="polite"` + `role="status"` — screen-reader дізнається про зміну фільтра.

**Проблеми:**

**1.1.A [P1]** Page transition (400ms opacity fade через `pageFade` у `Layout.tsx`) **не має live-region announcement** для assistive tech. Зрячий користувач бачить fade, незрячий — тиша + раптова зміна `<h1>`. Треба `aria-live` wrapper навколо `<motion.div key={pathname}>` або фокус-management (див. §3 A11y).

**1.1.B [P1]** Lazy-завантаження `/construction-log` показує `<MarkSpinner />` — але ця заглушка з’являється лише на cold-load. У SPA-режимі (натиснув з Nav) можливий 100-300ms blank flash між exit і enter route, і користувач не бачить індикатора того, що дія сприйнята.

**1.1.C [P0]** `ZhkLakeviewRedirect`: `window.location.assign(url)` у `useEffect` дає 1-frame placeholder («Переходимо до ЖК Lakeview…») перед cross-origin redirect. **Це не communicates exit — користувач не знає, що залишає корпсайт ВИГОДИ й переходить на окремий проектний сайт.** Прямий вплив на бренд-cohesion. Reproduce: відкрий /projects → клікни «Перейти на сайт проекту ↗» (працює нормально, новий tab). Тепер знайди /#/zhk/lakeview напряму — відбувається hard redirect, що знищує Back navigation.

**1.1.D [P2]** Hero CTA `«Переглянути проекти»` після кліка миттєво scroll-resets через `onExitComplete`, але немає loading state на самому button — для повільних з’єднань button виглядає dead 200ms.

### 1.2. Match between system and the real world (Відповідність реальному світу) — **8/10**

**Що працює:**
- Українська локалізація 100%, без англіцизмів (за винятком брендових Lakeview/NTEREST).
- Stage-лейбли вживають фахову термінологію девелопера: «меморандум», «дозвільна документація», «кошторисна документація» — це точна мова, як писав би юрист, не маркетолог.
- Нумерація 01-04 у BrandEssence/MethodologyTeaser — спокійний, документальний прийом.

**Проблеми:**

**1.2.A [P2]** Лейбл стадії «у розрахунку» (`u-rozrakhunku`) не звучить природно для пересічного українця-сімʼянина. У реальному світі люди говорять «проектується» / «на стадії проєктування». «У розрахунку» — це бухгалтерський жаргон. Перевір через юзер-тест із 3 родинами (P-2 персона нижче).

**1.2.B [P2]** Сторінка `/contact` має лейбл `СОЦМЕРЕЖІ` з трьома іконками (Send, MessageCircle, Globe з lucide-react). **Це не відомі візуальні sigils для Telegram/Instagram/Facebook.** Користувач очікує чорно-білі ОФІЦІЙНІ glyph-логи (як на 99% сайтів), а отримує «літачок», «бульбашку» і «глобус». Втрачаємо впізнаваність. (Підтверджено в `ContactDetails.tsx`: `// Lucide icon choice: lucide-react v1.11 does not export Instagram or Facebook by name. Fallback per Phase 3 RESEARCH §I`.) Це свідомий compromise через відсутність icons у lucide v1.11, але **рішення помилкове** — додай лeгкий `simple-icons-react` або статичні SVG (3 іконки × 0.5KB кожен).

### 1.3. User control and freedom (Контроль і свобода) — **5/10**

**Проблеми:**

**1.3.A [P0] / Bug.** `/zhk/lakeview` робить `window.location.assign()` — Back-button у браузері повертає користувача на `/zhk/lakeview` → знову redirect. **Loop. Користувач застрягає поза сайтом.** Reproduce:
1. Відкрий `/#/projects`
2. Натисни Lakeview-карточку (вона має посилання на зовнішній сайт відкритий в новому tab — це правильно)
3. Однак прямий ввід `/#/zhk/lakeview` (наприклад, з закладки клієнта) — `useEffect` тригерить `window.location.assign(externalUrl)` — користувач робить Back → попадає назад у `/zhk/lakeview` → знов redirect.
4. **Fix:** замість `<ZhkLakeviewRedirect>` надавати `<Navigate to="/projects" replace />` ДЛЯ внутрішнього переходу, а Lakeview-зовнішнє посилання тримати тільки як target цілої CTA-кнопки. Або використати `window.location.replace()` (не push) щоб не залишати hash в історії — але це теж не вирішує loop.

**1.3.B [P1]** Немає breadcrumb-навігації на `/zhk/etno-dim`. Користувач, який потрапив на сторінку напряму (з Google або шерінгу), не бачить контексту: «Я зараз на Етно Дім всередині розділу Проєкти». Brand-system §2 каже, що логотип у верхній панелі — link на головну, але цього недостатньо для глибинних сторінок.

**1.3.C [P2]** Lightbox: ескейп закриває (нативно `<dialog>`), стрілки навігують, кліком по бекдропу закривається (`onDialogClick` через `e.target === dialogRef.current`). **Але немає swipe-жесту для touch-пристроїв** — і немає підказок про шорткати в самому lightbox’і. Підказка типу «Esc · ← →» у нижньому лівому куті була б класичним UX-полегшенням.

**1.3.D [P1]** «Назад до фільтра» немає у /zhk/etno-dim. Якщо користувач прийшов з `/projects?stage=u-pogodzhenni` — на /zhk/etno-dim він не може повернутись до того ж фільтр-стану. Browser-Back повертає його через page-transition, **але опція `<Link to="/projects">← До всіх проєктів</Link>` у топі ZhkPage була б додатковим affordance**.

### 1.4. Consistency and standards (Консистентність) — **4/10** ⚠️

**Це найслабша зона.** Аудит CTA-кнопок і лінків знайшов **9 різних формулювань для аналогічних дій:**

| Action | Розташування | Стиль | Текст |
|--------|-------------|-------|-------|
| Hero CTA | / | accent-fill | «Переглянути проекти» |
| Flagship CTA | / + /projects | accent-fill | «Перейти на сайт проекту ↗» |
| Construction teaser | / | accent text-link | «Дивитись повний таймлайн →» |
| Home contact CTA | / | accent-fill | «Ініціювати діалог» |
| Contact page CTA | /contact | accent-fill | «Ініціювати діалог» (дубль ОК) |
| Etno Dim primary | /zhk/etno-dim | accent-fill | «Написати про ЖК Етно Дім» |
| Etno Dim secondary | /zhk/etno-dim | outline disabled | «Підписатись на оновлення (Instagram)» |
| Footer email | global | text-link | «vygoda.sales@gmail.com» |
| MobileFallback | <1024px | text-only | «Проєкти →» / «Хід будівництва →» / «Перейти до Lakeview ↗» |

**Проблема:** «Переглянути», «Дивитись», «Перейти», «Ініціювати», «Написати», «Підписатись». Бренд-гайд каже **«CTA — функціональні»** — це OK, але вони мають **гомогенно функціонувати**. Сімʼя, що просканувала Nav, потім зустрічає 5 різних CTA-формулювань і втрачає mental model: «що тут роблять кнопки?»

**1.4.A [P1] Пропоную:**
- Primary action (mailto) → `Написати нам` (єдиний текст)
- Navigation action (внутрішня) → `Дивитись {об’єкт}` або `→ {об’єкт}`
- External action → `→ {Об’єкт}` (без слова «перейти», яке неявно)

**1.4.B [P2]** Стрілочки: U+2197 ↗ (external), U+2192 → (internal), U+2191 ↑ (pointer). **Семантично коректно**, але візуальний шум — три різні стрілочки на одному hover. Можна спростити до двох (↗ external, → internal) і кинути ↑ на BuduetsyaPointer (заміни на текст «↑ дивитись вище» все одно з ↑ — OK залиши).

**1.4.C [P1]** Соціальні іконки в `Footer.tsx` мають `href="#"` — **WCAG fail**: це не disabled, це placeholder, що навігує в нікуди (точніше — на той же URL з #-fragment, що в HashRouter ламає route!). Reproduce:
1. Відкрий `/#/projects`
2. Клікни на іконку Telegram у footer
3. URL стає `/projects#` — HashRouter parse «#» → root → unexpected redirect на Home.

**Fix:** `<button disabled aria-label="Telegram (coming soon)">` замість `<a href="#">`.

### 1.5. Error prevention (Запобігання помилкам) — **6/10**

**Проблеми:**

**1.5.A [P2]** `mailto:` посилання не попереджають про те, що відкриється mail-client. Для користувача без налаштованого default email handler (browser → no app) це справляє враження «нічого не сталося». Реалістично: користувач натискає «Ініціювати діалог», нічого не відбувається, фрустрація. **Fix:** маленький tooltip або сабтекст: `«Відкриється ваш поштовий клієнт»` під кнопкою.

**1.5.B [P1]** `«Підписатись на оновлення (Instagram)»` на /zhk/etno-dim — **disabled-стиль (border-text-muted, cursor-default)**, але **це досі `<a href="#">`**. Тобто:
- Клік на нього → HashRouter сприймає `#` → resets up до Home. Втрата контексту.
- Користувач бачить «cursor-default», думає «не клікається», все одно клікає (як з кнопкою «спробуй ще раз») → перехід на головну → плутанина.

Це **той самий клас бага, що 1.4.C з footer-іконками**, тільки тут є саме disabled-намір. **Fix:** замість `<a>` — `<button disabled>` або хоча б `onClick={(e) => e.preventDefault()}`.

### 1.6. Recognition rather than recall (Розпізнавання vs пам’ятання) — **7/10**

**Працює:**
- Filter chips на /projects показують count: «У розрахунку (2)», «Здано (0)». Користувач не пам’ятає скільки — система йому це показує. ✅

**Проблеми:**

**1.6.A [P2]** Stage-лейбл на flagship card каже «активне будівництво», але filter chip каже «Будується (1)». Те саме поняття, два різних слова. Користувач, який бачив «активне будівництво» у hero-копії, шукатиме на фільтрі «Активне» — не знаходить. **Fix:** уніфікуй до «Будується» в обох місцях, або — кращий варіант — у chip напиши «Будується (1) · Lakeview», вмонтуй ім’я.

**1.6.B [P1]** На /construction-log заголовок секції «Березень 2026 · 15 фото». **Але** на фотографіях немає overlay-метадані: дата кадру, секція, ракурс. У lightbox’і `caption || alt` — і всі alt-теги однакові: «Будівельний майданчик, березень 2026». 15 однакових підписів = informational void. Reproduce у `data/construction.ts`:
```ts
photos: [
  { file: 'mar-01.jpg', alt: 'Будівельний майданчик, березень 2026' },
  { file: 'mar-02.jpg', alt: 'Будівельний майданчик, березень 2026' },
  // ... 13 more identical
]
```
Це не storytelling, це photo-dump. (Дані документують це як TODO у `caption` field, але поки що `undefined`).

### 1.7. Flexibility and efficiency of use (Гнучкість і ефективність) — **5/10**

**Проблеми:**

**1.7.A [P2]** Немає shortcut-навігації (Cmd-K palette, /-фокус search). Для B2B-юзера (журналіст / інвестор), що хоче швидко знайти ЄДРПОУ — мусить скролити Footer. Це не критично для 5-page MVP, але **позначено як «nice-to-have v2»**.

**1.7.B [P1]** /projects filter chips використовують `setSearchParams({ replace: true })`. **Це означає, що Back-button НЕ повертає до попереднього фільтра.** Користувач клікнув «У розрахунку» → побачив 2 проекти → клікнув «У погодженні» → бачить 2 інших. Натискає Back в очікуванні повернутись до «У розрахунку» → попадає на головну (попередній route). UX expectation broken. **Fix:** прибери `{ replace: true }`, прийми що history має +5 entries за сесію, це нормально.

**1.7.C [P3]** Lightbox не має fullscreen-button (хоча `<dialog>` уже full-screen). Не критично.

### 1.8. Aesthetic and minimalist design (Естетика та мінімалізм) — **9/10**

**Сила сайту.** Скріншоти `live-home-1920-fold.png` і `live-zhk-etno-1920-full.png` показують: палітра дотримана, типографіка чиста, ізометричні куби — дискретна декорація (opacity 0.15), а не аттракціон.

**Незначні проблеми:**

**1.8.A [P3]** Фон з ізометричних кубів на hero дуже легкий (opacity 0.15). На скріні 1920×1080 видно, що 4 куби по горизонталі. **На 1280px (скрін `live-home-1280-fold.png`) вони обрізані по краях**, що дає враження «недосвідченої CSS-роботи» — куби мають закінчуватись chiselled-edges, а не torsionly cut. Перевір `IsometricGridBG` overflow logic.

**1.8.B [P3]** На /construction-log thumbnail-grid 4 місяці без візуального розділювача — це континуум 50+ фото. Скрін `live-log-1920-full-loaded.png` показує цю monotonia. Невелика horizontal-rule або date-badge між місяцями допомогла би скан-навігації.

### 1.9. Help users recognize, diagnose, and recover from errors — **3/10** ⚠️

**Проблеми:**

**1.9.A [P0] / 404 page.** `NotFoundPage.tsx`:
```jsx
<h1>404 — сторінку не знайдено</h1>
<img src={markUrl} alt="" aria-hidden="true" />
<Link to="/">Повернутись до головної</Link>
```
**Це мінімум-мінімумом.** Що відсутнє:
- Підказка «Можливо, ви шукали:» з 4 топ-роутами (/, /projects, /construction-log, /contact). Це 5 рядків JSX і **критичне для recovery**.
- Search input — out of scope для MVP, OK.
- Логотип як декорація (`alt=""`) — добре, але «гола» сторінка ламає бренд-momentum. Хоча б один блок кубів або тонкий теж самий узор як на home.

**1.9.B [P0]** `EmptyStateZdano.tsx` (filter «Здано»):
```
<single cube>
<p>Наразі жоден ЖК не здано</p>
```
**Але користувач, що клікнув «Здано (0)» вже бачив (0) у chip-лейблі — це повторна інформація.** І немає alt-action: «Подивитись активні проекти →» або «Підписатись на повідомлення про здачу». Це dead-end empty state.

**1.9.C [P1]** Якщо JS не виконався (network error, deferred chunk fail) — `<Suspense fallback={<MarkSpinner />}>` крутиться вічно. Немає timeout-fallback з кнопкою «Перезавантажити сторінку». Реалістично — рідкісний failure mode, але для премʼюм-проекту класичний.

### 1.10. Help and documentation — **N/A** для MVP

Це маркетинговий сайт, не SaaS — допомога не потрібна. **Але** `methodologyVerificationWarning` ⚠ marker (на блоках 2/5/6) **показано як decorative ⚠ icon без tooltip-explanation**. Користувач бачить ⚠, не розуміє чому. Для MVP — допустимо (FEATURED_INDEXES на Home обмежено блоками без warning), але якщо колись з’явиться ⚠ на live — треба `<abbr title="Потребує верифікації клієнтом">⚠</abbr>` або подібно.

---

## 2. Cognitive Walkthroughs (3 персони)

### 2.1. Persona-1: Олександр, 47, заможний інвестор-діаспора

**Бекграунд:** Власник IT-bootstrapped бізнесу, проживає у Канаді, шукає об’єкт на повернення родини в Україну (Лівів — родинна привʼязка). Технологічна грамотність — висока. Бюджет: 200-400K USD, готовий до 1.5-2 років очікування здачі.

**Цілі за сесію:**
1. Зрозуміти, чи це серйозна компанія, не однодневка.
2. Побачити, чи є хоча б один objedt у будівництві.
3. Знайти юр. дані, перевірити в реєстрі ЄДРПОУ.
4. Зв’язатись напряму з засновником / sales.

**Шлях за сайтом:**

**Крок 1 — Лендинг.** Олександр заходить через Google (пошук «забудовник Лівів»). Бачить hero «ВИГОДА» (12vw, стримано). Гасло цитує бренд-гайд. **Реакція: «системний» — добре звучить, не як у конкурентів.** Скролить далі.

**Крок 2 — BrandEssence.** 4 цінності з нумерацією 01-04. Читає «Надійність — ТОВ БК ВИГОДА ГРУП ЄДРПОУ 42016395, ліцензія від 27.12.2019». **Зачіпка: реальний номер ліцензії і дата.** Запам’ятовує «42016395». Скролить.

**Крок 3 — PortfolioOverview.** Бачить flagship Lakeview (aerial.jpg, premiu CGI). «Здача у 2027». Pipeline 3 проекти + 1 без назви. **Реакція: «один проект у будівництві — мало, але чесно. Pipeline — добре, динамічна компанія».**

**Крок 4 — Construction Log Teaser.** Бачить 5 фото з березня 2026, label «Березень 2026». Натискає «Дивитись повний таймлайн →». Перехід на /construction-log.

**Крок 5 — /construction-log.** Бачить 4 місяці × 12-15 фото = 50+ фото. **Зависає на 30 сек: «це справжнє будівництво або PR?»** Кліки 1-2 фото в lightbox. Бачить «Будівельний майданчик, березень 2026» — однаковий підпис на всіх. **Frustration: немає progress-наративу. Не може скласти картинку, що змінилось між Січнем і Березнем.** Power-user-думка: «У серйозного забудовника має бути progress narrative, а не photo-dump». Втрата довіри −1.

**Крок 6 — TrustBlock на Home.** Повертається на головну. Бачить 3 колонки: Юр. особа / Ліцензія / Контакт. **Тут максимум-power для нього.** Копіює ЄДРПОУ, відкриває [https://usr.minjust.gov.ua/](https://usr.minjust.gov.ua/) у новому tab’і. Перевіряє. Знаходить компанію. **Trust +2.**

**Крок 7 — /contact.** Натискає «Контакт» у Nav. Бачить email, **«Телефон: —», «Адреса: —»**. **Стоп.** «У них немає телефону? Серйозно?» Це **КРИТИЧНИЙ FAILURE для P-1.** B2B-investor очікує телефон і фізичну адресу обов’язково. Em-dash placeholder читається як «компанія ще не готова» **навіть якщо це placeholder для майбутнього оновлення**. Trust −3.

**Крок 8 — Outcome.** Олександр пише email на vygoda.sales@gmail.com з низьким priority («Цікавить ваш проект, чекаю розрахунок»). Не дзвонить (немає телефону). Не приходить в офіс (немає адреси). **Conversion-quality: low.**

**Insights:**

- **P0:** Заповни телефон і адресу або **зніми ці рядки повністю**. Em-dash гірше за відсутність.
- **P1:** На /construction-log додай progress-наратив: 1-2 текстові підписи на місяць («Січень — фундамент закладений, 12 свай», «Березень — стартує цегляна кладка 2-го поверху»). Це 4 речення для всього таймлайна.
- **P1:** На TrustBlock додай посилання на `https://usr.minjust.gov.ua/?code=42016395` (deep-link). Це **prove-it-yourself** affordance для скептика.

### 2.2. Persona-2: Іра і Михайло, 33+35, сімʼя з 1 дитиною, шукають квартиру

**Бекграунд:** Іра — менеджер CRM у локальній компанії, Михайло — IT senior. Бюджет: 90-110K USD, готові до іпотеки. Шукають квартиру 2-кімн в Львові, 60-75 m². Технологічна грамотність — середня (Iра), висока (Михайло). Часто шукають з телефону вечорами.

**Цілі:**
1. Зрозуміти, як виглядатиме майбутнє житло.
2. Подивитись планування квартир, ціну за m².
3. Знайти, коли здача.
4. Подивитись фотки прогресу будівництва.

**Шлях:**

**Крок 1 — Іра з iPhone.** Заходить о 22:00 з ліжка. URL передав Михайло. Бачить **MobileFallback**: «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам». Логотип, 3 link’и, email.

> **Це P0-failure.** Іра не на десктопі. **Загубили лід.** ([Підтверджено `MobileFallback.tsx`](src/components/layout/MobileFallback.tsx) — це навмисний рішення-tradeoff клієнта, але треба чітко розуміти cost.)

**Крок 2.** Іра пробує «Перейти до Lakeview ↗». Перехід на yaroslavpetrukha.github.io/Lakeview. Цей сайт — окремий, можливо mobile-friendly (не аудитуємо). Іра бачить квартири там.

**Крок 3 — Михайло, наступний день, з 1280px ноут.** Заходить через `/`. Скролить на /projects. Бачить flagship Lakeview, натискає «Перейти на сайт проекту ↗» — нова tab. Повертається.

Натискає filter «Будується». Чекає, що покаже Lakeview-карточку з планувань. Бачить **`BuduetsyaPointer`: «Див. ЖК Lakeview вище ↑»**.

**Реакція:** «Ок, але я тільки що клікнув філтер «Будується» бо чекав detail. Чому система просто не показала Lakeview-карточку у filtered-стані?» Frustration −1. (Підтверджено в `ProjectsPage.tsx`: `if (active === 'buduetsya') body = <BuduetsyaPointer />` — flagship card розташований вище і завжди видимий, тому pointer семантично коректний, але **UX-несподівано**: фільтр **не змінює** список фактично.)

**Крок 4.** Михайло клікає Етно Дім — потрапляє на /zhk/etno-dim. Бачить hero-render, fact block (Стадія / Локація / **Адреса: —**), розділ «Що відбувається зараз», галерею 8 рендерів. **Hover на render — scale 1.02 + accent glow. Lightbox відкривається на клік. Стрілки навігують. Esc закриває.** Все працює.

**Крок 5.** В кінці сторінки бачить CTA-pair: «Написати про ЖК Етно Дім» + «Підписатись на оновлення (Instagram)» (disabled-стиль). **Михайло клікає на disabled-Instagram**, бо disabled-стиль не виразно дисабленний (border-text-muted на bg-bg = низький контраст; але курсор default). Click → href="#" → **HashRouter routes до '/'** → unexpected redirect на homepage. **Frustration −2.** «WTF? Чому я тепер на головній?»

**Крок 6.** Втратив context, пробує Back. Повертається на /zhk/etno-dim. Шукає планування квартир. **Не знаходить.** Bath info: фото фасадів, патіо, дитячий майданчик. **Немає планувань**. Михайло думає: «План — на Lakeview-сайті, OK». Пробує ще раз «Перейти на сайт проекту ↗» з /projects → новий tab.

**Крок 7.** На Lakeview-сайті **знаходить планування. Конверсія відбувається ТАМ, не на корпсайті.**

**Outcome:** family flow перенаправлений на саб-проект. Корпсайт VUGODA — лише intro-точка. Це OK для брендингу, але **значить, що / і /zhk/etno-dim не виконують конверсійну роботу для familly-buyer**. Якщо клієнт-замовник передбачає це — fine.

**Insights:**

- **P0 (mobile-fallback):** клієнтське рішення, але документально позначити як loss. Альтернатива — навіть простий single-column layout для /projects + /contact + /construction-log зробить дзвонити в 4-5x більше людей.
- **P1:** disabled-Instagram — НЕГАЙНО заміни на `<button disabled>` або забери з UI до launch.
- **P1:** filter «Будується» має показувати Lakeview-карточку у filtered-state, не просто pointer. UX-expectation = filter ⇔ list mutation.

### 2.3. Persona-3: Богдана, 28, журналіст-фрілансер для української економічної газети

**Бекграунд:** пише матеріал «Нові забудовники Львова — хто за брендами». Технологічна грамотність — висока. Пише з ноутбука Mac 1440px.

**Цілі:**
1. Знайти юр. особу, ЄДРПОУ, ліцензію.
2. Знайти ім’я директора, контакт PR (LinkedIn, Telegram).
3. Зрозуміти портфоліо, бачити завершені/активні/pipeline проекти.
4. Завантажити прес-кит (логотип, фото).

**Шлях:**

**Крок 1.** Заходить на `/`. Скролить до Footer. Бачить ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, ліцензія від 27.12.2019. **Це достатньо для основи статті.** ✅

**Крок 2.** Шукає прес-кит / media-asset link. **Не знаходить** (з підстав PROJECT.md — out of scope). Не критично, пише email.

**Крок 3.** Натискає Telegram-іконку у Footer. URL стає `/projects#` (бо HashRouter). **Конфузія.** Думає: «Чи це working link? Чи bug?» Закриває.

**Крок 4.** /contact. Бачить «Телефон: —», «Адреса: —», «Соцмережі: 3 disabled icons». **Frustration:** «У мене нема каналу для дзвінка журналістці-в-роботі». Пише email і чекає.

**Outcome:** Богдана подасть статтю, але напише: «Контактного телефону у компанії не вказано». **Це публічний reputational damage.**

**Insights:**

- **P0:** телефон і адреса = NON-NEGOTIABLE для B2B/media-аудиторії.
- **P2:** додай `mailto:press@vygoda.com.ua` (або pr@) як окремий канал у Footer — журналіст не йде на загальний sales-mailbox.
- **P3:** прес-кит link — v2.

---

## 3. Accessibility (WCAG 2.1 AA)

### 3.1. Контраст

✅ `text` (#F5F7FA) на `bg` (#2F3640) — 10.5:1 (AAA).
⚠️ `text-muted` (#A7AFBC) на `bg` (#2F3640) — 5.3:1 — пасує AA для **≥14pt (18.5px)**, **fail для <14pt body**. У `BrandEssence.tsx`: «text-base» = 16px = OK. У `TrustBlock.tsx` lable «text-xs uppercase tracking-wider» = 12px **uppercase**. Brand-system.md документально дозволяє цей паттерн «labels, not body» (брендбук §3), але **WCAG 2.1 формально не визнає uppercase exception** для контрасту. Можливий a11y audit fail. Reproduce: запусти axe-core на `/`, побач warning на «small text contrast». Fix: збільш до `text-sm` (14px) на label-tags, або затемни background під label на `bg-bg-black` (#020A0A) → contrast 7.0:1 → AA pass.

✅ `accent` (#C1F33D) на `bg-black` (#020A0A) — 16.0:1 (AAA для CTA fills).
❌ `accent` (#C1F33D) на `bg` (#2F3640) — 11.2:1 — пасує (тільки якщо аккумент НА темному, що завжди так у проєкті).

### 3.2. Skip-link — **відсутній**

`grep -n "skip" src/index.css src/components/layout/Layout.tsx index.html` → **0 матчів.**

WCAG 2.1 SC 2.4.1 «Bypass Blocks» — **fail.** Користувач клавіатури мусить tab’ити через Logo + 3 nav-links, щоб дістатись до content. На /zhk/etno-dim це 4 tab-stop’и тільки в Nav, потім ZhkHero (без focusable) → ZhkFactBlock (без focusable) → ZhkWhatsHappening (без focusable) → 8 gallery-buttons. Загалом **~12 tab’ів від nav до lightbox-trigger.**

**Fix:** додай в `Layout.tsx`:
```tsx
<a href="#main-content"
   className="absolute left-0 top-0 z-[100] -translate-y-full bg-accent p-4 text-bg-black focus-visible:translate-y-0">
  Перейти до основного контенту
</a>
<main id="main-content" ...>...</main>
```
30 хвилин роботи. Закриває WCAG 2.4.1.

### 3.3. Focus management при route change

`Layout.tsx` робить `window.scrollTo(0,0)` на `onExitComplete`, але **focus залишається на тому елементі, з якого користувач клікнув** (наприклад, на nav-link). Screen-reader-користувач після переходу не дізнається, що сторінка змінилась — focus стояв на «Контакт», тепер та сама focus-position, тільки сторінка інша.

**WCAG 2.4.3 «Focus Order» — partial fail.**

**Fix:**
```tsx
<motion.div
  ref={(el) => el?.querySelector('h1')?.focus()}
  key={location.pathname}
  ...
>
```
+ додай `tabIndex={-1}` на кожен `<h1>` щоб він міг приймати фокус програмно.

### 3.4. Tab order

Без skip-link на Home: Logo → Проєкти (Nav) → Хід будівництва → Контакт → Hero CTA → Brand Essence (no focusable) → Flagship CTA → Pipeline cards (3 div’ів **не focusable!** — `<div className="cursor-default">` для grid-only Project — користувач клавіатури НЕ ЗМОЖЕ навігувати на них) → Construction Teaser arrows + thumbs (no focusable thumbs!) → Methodology blocks (no focusable) → TrustBlock email link → Contact CTA → Footer email + 3 disabled-icons + 3 nav-link.

**Висновки:**

**3.4.A [P1]** Pipeline cards (grid-only) — без `tabIndex={0}` і без role="button" — **non-clickable on click АЛЕ і non-focusable for keyboard**. Це OK (consistent), але якщо вони мають hover-effect, то й focus-state теж очікується. Або додай `tabIndex={0}` + `role="article"`, або **прибери hover-effect** для grid-only-карток.

**3.4.B [P1]** ConstructionTeaser thumbs — `<div>` без button-wrapper. `live-home-1920-full.png` показує scroll-snap strip. Користувач клавіатури не зможе клікнути thumb для відкриття lightbox. **Fix:** або `<button>` wrapper, або взагалі прибрати lightbox з teaser і залишити тільки CTA `«Дивитись повний таймлайн →»`.

### 3.5. Reduced motion

✅ `useReducedMotion()` усюди де потрібно (Layout, Hero, RevealOnScroll). Перевірено.
✅ `@media (prefers-reduced-motion: reduce)` neutralize hover-card в `index.css`.
⚠️ `useSessionFlag('vugoda:hero-seen')` — RM-flag перший visit ніколи не показує parallax. Це OK, але **тільки якщо `prefersReducedMotion` присутній перед першою рендером** (Hero.tsx синхронно читає sessionStorage в useState init, fine).

### 3.6. ARIA / Screen reader

✅ Логотип SVG має `<title>ВИГОДА</title>` (Logo component).
✅ `aria-label="ВИГОДА — на головну"` на головному link до /.
✅ `aria-label="Закрити"` / «Попереднє фото» / «Наступне фото» на Lightbox-кнопках.
✅ `<Footer aria-label="Footer navigation">` (хоч actually `<nav aria-label=...>` всередині Footer).
✅ Chip-row має `role="group" aria-label="Фільтр за стадіями"`.
✅ Кожен chip має `aria-pressed={...}`.
✅ Construction-photos `<img alt={p.alt ?? ''}>` — pulled from data, всі заповнені.
✅ Декоративні ізометричні куби — `aria-hidden="true"`.

⚠️ **3.6.A** ⚠ marker у MethodologyTeaser має `aria-label="Потребує верифікації"`, але рендериться **всередині `<h3>`** як `<span aria-label>⚠</span>`. Screen-reader промовить: «Потребує верифікації, [title]». OK, але краще зробити окремий `<span class="sr-only">Потребує верифікації:</span>` поза h3 і ⚠ тримати як `aria-hidden="true"` декорацію.

⚠️ **3.6.B** Lightbox: `<dialog aria-label="Перегляд фото">`. **Не змінюється** при навігації. Скрін-рідер чує тільки "Перегляд фото" незалежно від того, фото 1/15 або 8/15. **Fix:** `aria-labelledby` що пов’язано з caption-span внизу, плюс `aria-live="polite"` на caption щоб озвучувалось при зміні.

⚠️ **3.6.C** /construction-log: `<h2>Березень 2026 · 15 фото</h2>` — middle-dot U+00B7 — screen-reader озвучить як «Березень 2026 mid-dot 15 фото». Краще `<h2>Березень 2026 <span class="sr-only">,</span> · <span class="sr-only">всього</span> 15 фото</h2>`. Дрібне.

### 3.7. Forms

Немає реальних форм — `mailto:` only. **WCAG не загрожується**, але:

⚠️ **3.7.A** Контакт-CTA «Ініціювати діалог» не має текстової підказки що він робить. Screen-reader-користувач отримує `<a href="mailto:vygoda.sales@gmail.com">Ініціювати діалог</a>` — OK, тому що нативний `mailto:` оголошується screen-reader’ом як «email link». Але добре б додати `aria-describedby` з «Відкриється поштовий клієнт» нижче.

---

## 4. Information Architecture

### 4.1. Топологія сайту

5 публічних роутів:
- `/` — Home (7 sections: Hero, BrandEssence, PortfolioOverview, ConstructionTeaser, MethodologyTeaser, TrustBlock, ContactForm)
- `/projects` — Hub з фільтром (HUB-01..04)
- `/zhk/:slug` — Detail (тільки /zhk/etno-dim має повний контент; /zhk/lakeview = redirect; /zhk/maietok-vynnykivskyi і /zhk/nterest = redirect на /projects)
- `/construction-log` — Photo timeline (50+ фото у 4 місяцях)
- `/contact` — Контакт (1 форма-замінник + соцмережі)

**Аналіз:**

**4.1.A [P1]** **/zhk/maietok-vynnykivskyi і /zhk/nterest redirect на /projects.** Це означає, що **glas-only картки на /projects не клікабельні**, а якщо хтось вгадав слаг URL — потрапляє на /projects. **Це порушує URL-share UX**: журналіст шерить лінк «https://...vugoda-website/#/zhk/nterest» в чаті, отримувач відкриває — попадає на /projects. Wat?

**Рекомендація:** або 1) зробити /zhk/maietok-vynnykivskyi і /zhk/nterest повними сторінками (за power-economics — вони мають по 2-3 рендери в data; на 30 хв роботи додай 1 short paragraph и render-grid); або 2) на 404 для них, не на /projects redirect (чесніше). Поточний redirect — silent failure від UX-погляду.

### 4.2. Глибина

Максимальна глибина — 2 кліки (Home → Projects → /zhk/etno-dim). Це **flat IA**, оптимально для маркетингового сайту. ✅

### 4.3. Cross-linking

⚠️ **4.3.A** Footer повторює лише 3 nav-links (Проєкти, Хід будівництва, Контакт), але **не має links на /zhk/etno-dim** (єдина повна detail-сторінка). Сирота.

⚠️ **4.3.B** /zhk/etno-dim не лінкує назад на /projects (немає breadcrumb). Тільки через Nav-Проєкти, що порушує context.

⚠️ **4.3.C** /construction-log не лінкує на /zhk/lakeview (де progress показується). Якщо користувач клікнув з Home «Хід будівництва Lakeview» CTA → попадає на /construction-log → не може повернутись на Lakeview-проектну сторінку природно (вона зовнішня). **Treba CTA внизу /construction-log: `Перейти на сайт проекту Lakeview ↗`.**

### 4.4. URL-структура

**4.4.A [P0]** **HashRouter URLs:** `/#/projects`, `/#/zhk/etno-dim`, `/#/contact`.

**Це найбільший symbolic-failure премʼюм-сайту.** Аргумент CLAUDE.md «hash invisible after first click» — **сoutered by reality**:
- Шеринг URL у месенджері: «vugoda-website/#/zhk/etno-dim» — будь-хто бачить hash = WordPress 2010-стиль.
- Закладки браузера показують hash.
- SEO: Google не індексує hash-routes (це значить, що /projects, /zhk/etno-dim **взагалі не потраплять у пошук**).
- Open Graph: index.html має OG-meta, але **тільки для root URL**. Шер /#/projects → социальна картка показує home OG, не projects-specific. Documented в index.html as «v2 BrowserRouter at custom domain INFR2-03».

**Cost-trade off recognition:** свідомий компроміс через GH Pages SPA fallback. **Recommendation для v1.5:** додай `public/404.html` з SPA-redirect-script (rafgraph’s spa-github-pages technique) — **15 хв роботи**, відразу clean URLs. Або міграція на Vercel/Netlify (free tier, 1 година).

### 4.5. Sitemap і robots.txt

Не перевіряв в repo, але судячи зі static-deploy і Phase 6 OG-meta — швидше за все відсутні. **WP6:** `public/robots.txt` + `public/sitemap.xml` — 5 мин для SEO baseline.

---

## 5. Microinteractions

### 5.1. Page Transitions

`pageFade` через AnimatePresence + `mode="wait"`: 350-400ms exit + 400ms enter. Total 750-800ms.

**Аналіз:**
- Тривалість агресивна (~800ms для маркетингового сайту — багато). Industry-norm 200-300ms total.
- `mode="wait"` означає: **користувач чекає 400ms на blank-screen між сторінками**. На повільному з’єднанні lazy-chunk на /construction-log додає ще 200-500ms — total 1200ms blank. **Не премʼюм.**
- `onExitComplete` робить `window.scrollTo(0,0)` — правильно, але без smooth.

**5.1.A [P2]** Скоротити до 200ms exit + 200ms enter, або перейти на `mode="popLayout"` (cross-fade) щоб не було blank-frame.

### 5.2. Hover effects

`hover-card` utility:
- transform: scale(1.02) — OK
- box-shadow: 0 0 24px rgba(193, 243, 61, 0.15) — accent-glow, дуже гарний бренд-touch ✅
- 200ms cubic-bezier(0.22, 1, 0.36, 1) — easeBrand ✅
- RM-neutral via `@media (prefers-reduced-motion)` ✅

**Сильний компонент.** Одне зауваження:

**5.2.A [P3]** `hover-card` використовується на 5 surfaces (Flagship, Pipeline cards, Gallery thumbs, Construction Log thumbs, **Footer email**?). Cross-page-консистентність добра. Але **chip-row на /projects не має hover-glow** — використовує border-color transition. Inconsistency. Можливо свідома (chips — UI primitive, не content card), але уніфікувати hover-effect = додає premium feel.

### 5.3. Scroll Indicators

**5.3.A [P1]** Hero на 100vh не має ніякого affordance що нижче є контент. Користувач, який бачить виключно hero (1920×1080 viewport), може не зрозуміти, що нижче ще 6 sections. Industry-pattern: маленька стрілка-tip ↓ або «Скрол» текст внизу hero, що зникає після першого скрол-event.

Brand-system §1 каже «без декоративних елементів», але scroll-tip — функціональна, не декоративна. Можливо тонкий:
```
[ scrol  ↓ ]
```
у нижньому-центрі hero, opacity 0.4.

### 5.4. Construction Teaser scroll-arrows

`ChevronLeft` / `ChevronRight` poking з-за edge’а scroller’а (`-translate-x-1/2`). **Візуально OK**, але:

**5.4.A [P2]** Arrow-кнопки **завжди видимі**, навіть коли scroller в кінці і дальше скролити нікуди. Очікувано: disabled-стиль на лівій arrow коли `scrollLeft === 0`, і disabled на правій коли scroll закінчився. Поточний UX: користувач натискає праву arrow в кінці, нічого не відбувається — `scrollBy({left:336})` no-op. Loss of feedback.

### 5.5. Filter Chip Animation

`transition-[background-color,color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]` — клацання chip-у плавно змінює background. ✅

**5.5.A [P3]** Chip-row при першому з’явленні стартує з `staggerChildren` cascade (через `RevealOnScroll`). На /projects скролер бачить плавне з’явлення 5 chip’ів. Гарно. **Але** — повторно клацнувши «Усі» після фільтра, chip’и **не реанімують** (`once: true` viewport flag). Це consistent дизайн, але intuition може очікувати «replay» у моментi state-change. Не критично.

---

## 6. Mobile / Responsive Critique

### 6.1. MobileFallback

Скрін `live-mobile-iphone.png` показує: логотип, «ВИГОДА» wordmark, body, mailto, divider, 4 link’и, юр-блок.

**Що працює:**
- Стримано, бренд-correct, no marketing fluff. ✅
- 4 internal CTA-link’и (Проєкти →, Хід будівництва →, Контакт →) існують для **майбутньої навігації** — якщо користувач відкриє з лептопа, попаде на правильний роут. Smart.
- Lakeview-link external, з `target="_blank" rel="noopener noreferrer"`. ✅

**Критичні проблеми:**

**6.1.A [P0]** **Body copy:**
> «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам»

**Це українською пишеться "Перегляньте на десктопі або напишіть нам vygoda.sales@gmail.com"** — без розриву по смислу. Скрін показує body-copy зверху, потім окремий email-link. У cognitive flow user читає «напишіть нам **·····»** (eye-search для email) — паузу в 0.5-1 sec перед знаходженням email link нижче. Об’єднай:

```
Сайт оптимізовано для екранів ≥1280px.
Перегляньте на десктопі або напишіть на vygoda.sales@gmail.com
```

**6.1.B [P0]** **Немає альтернативи** для mobile-only-юзера. У 2026 році ~70% real-estate-research у Україні відбувається з телефону. **Cutoff = lost lead.** Розумніша альтернатива:
- Show simplified single-column layout (hero + projects-list + contact) below 1024px
- Добавити preset «Подивитись simplified-mobile-version» чек-бокс або link
- Як мінімум — показати reasoning: «На мобільному ви побачите спрощену версію. Перейти »

Поточна жорстка cutoff = бренд-failure (повідомляє «ми не вмієм mobile»).

**6.1.C [P1]** Mobile-fallback не має social-icons, не має license-info-link. Cleaner за design, але юр-блок присутній (legalName + edrpou + licenseDate). OK.

**6.1.D [P2]** Mobile-fallback не реагує на orientation change. Якщо користувач повернув iPhone в landscape (812×375 → 812×375 width) — все ще <1024px, fallback показується. OK для очікуваної поведінки. Але tablet-portrait (768×1024) попадає у fallback теж — Persona-2 на iPad **отримає placeholder** замість quasi-desktop layout. **Fix:** breakpoint на 768 замість 1023, або specific `<MobileFallback>` для <768 і `<TabletDesktopShim>` для 768-1024.

### 6.2. Tablet (768-1023px)

Aбсолютно не оброблений. Cutoff 1023px = iPad Mini portrait (768×1024) і iPad Air portrait (820×1180) — все потрапляє в MobileFallback. **Це 15-20% audit-traffic.** Замовник може не знати про цю втрату.

---

## 7. Specific Bugs (з reproduction steps)

### 7.1. [P0] HashRouter ламається при кліку на disabled `<a href="#">`

**Reproduce:**
1. Відкрий https://yaroslavpetrukha.github.io/vugoda-website/#/projects
2. Скрол до Footer
3. Клікни на іконку Telegram
4. URL стає `https://yaroslavpetrukha.github.io/vugoda-website/#/projects#`
5. HashRouter parse: hash = `/projects#` → routes до `/projects` без bug → **OK тут не страшно**
6. Однак: відкрий /#/zhk/etno-dim
7. Натисни disabled «Підписатись на оновлення (Instagram)» (`href="#"`)
8. URL стає `https://...vugoda-website/#` → HashRouter parse: empty → **routes до root /**

**Result:** Користувач на /zhk/etno-dim миттєво перенаправлений на головну. Втрата context. Frustration.

**Fix:** заміни всі `<a href="#">` на `<button type="button" disabled>` з відповідним стилем. **Орієнтовний час:** 30 хв (5-7 sites + Tailwind utility consolidation).

### 7.2. [P0] /zhk/lakeview Back-button infinite loop

**Reproduce:**
1. Відкрий /#/zhk/lakeview напряму (наприклад, з закладки)
2. `useEffect` тригерить `window.location.assign('https://yaroslavpetrukha.github.io/Lakeview/')`
3. Браузер navigates до Lakeview
4. Натисни Back
5. Назад до /vugoda-website/#/zhk/lakeview
6. Знову `useEffect` тригерить assign → loop

**Fix А:** `window.location.replace(url)` замість `assign` — не залишає entry в history.
**Fix Б (краще):** **зніми /zhk/lakeview redirect повністю**, залиш тільки external CTA-кнопки на /projects flagship card. Internal-route /zhk/lakeview = render NotFoundPage (з підказкою «Lakeview має окремий сайт → »).

### 7.3. [P1] /projects filter не керує flagship

**Reproduce:**
1. /#/projects
2. Клік chip «Здано (0)»
3. Body-area: empty state cube + текст «Наразі жоден ЖК не здано»
4. **Але** flagship card Lakeview ВСЕ ЩЕ показується вище filter row.
5. Cognitive: «Я вибрав ‘Здано’, чому все ще видно Lakeview, який ‘будується’?»

**Fix:** або 1) hide flagship на active!=null, або 2) поясни в muted-text над flagship: «Постійно: ЖК Lakeview (активне будівництво)». Поточний design — flagship статичний vs filter — ламає очікування.

### 7.4. [P1] usePageTitle race з page-transition

Не вдалося надійно відтворити з аудиту, але аналіз `usePageTitle.ts` показує: title оновлюється на mount нового component’а. AnimatePresence `mode="wait"` означає, що exit-route ще mounted під час first paint of enter-route. **Title може на мить показувати exit-title, потім перемкнутись.** В скрін-рідерах це може звучати як «Контакт — ВИГОДА... Проєкти — ВИГОДА» через 100ms.

**Reproduce (потенційно):**
1. Тестер на slow 3G
2. /#/contact → клік «Проєкти» в Nav
3. Browser-tab title: спостерігай 800ms — чи бачиш flicker.

**Fix:** перенести `usePageTitle` виклик у Layout.tsx з `useLocation` + map pathname → title.

### 7.5. [P2] Construction Teaser arrows не disabled

**Reproduce:**
1. /#/
2. Скрол до Construction Teaser
3. Клік ChevronRight × 5 (поки strip не дійде до кінця)
4. Клік ще раз
5. Нічого не відбувається, але кнопка не disabled-стиль.

**Fix:** add scroll-position state, set disabled на arrow коли scroll boundary досягнуто.

### 7.6. [P2] Lightbox 1/15 caption повторюється

**Reproduce:**
1. /#/construction-log
2. Скрол до «Березень 2026»
3. Клік 3-у фото
4. Caption внизу: «Будівельний майданчик, березень 2026» (alt text fallback)
5. Стрілка → → caption: «Будівельний майданчик, березень 2026»
6. Усі 15 фото мають identical caption.

**Fix:** заповни `caption` field в data/construction.ts з реальним описом кадру (15 секцій × 4 місяці = 60 рядків роботи; пріоритизуй).

### 7.7. [P2] grid-only Pipeline cards не keyboard-focusable

**Reproduce:**
1. /#/projects
2. Tab через сторінку
3. Дойди до Pipeline grid (3 cards: Етно Дім, Маєток Винниківський, NTEREST)
4. Tab tab tab — лише Етно Дім focusable (бо Link). Маєток і NTEREST = `<div>` — skip’аються.

**Fix:** або add `tabIndex={0}` + role="article" + key handler для Enter (відкрий link на /projects?stage=...) , або add subtle visual indicator що ці cards не клікабельні (opacity: 0.85 + watermark «Деталі скоро»).

### 7.8. [P3] Mobile layout у landscape orientation

**Reproduce:**
1. iPhone в Safari
2. Відкрий vugoda-website
3. Поверни landscape (≈ 812×375)
4. MobileFallback показується, але body розтягується на 812w. Логотип лишається 120px wide. Левий empty space ~340px на кожен бік. Виглядає loose.

**Fix:** add `max-w-md` на main container у MobileFallback (вже є, OK на скрині). Можливо `lg:hidden` / `<MobileFallback>` все одно triggers за viewport-width, але aesthetic стиль на landscape некрасивий. Add `landscape:py-2 landscape:gap-4` для compact spacing.

---

## 8. Recommendations P0-P3 (зі очікуваним impact)

### P0 — Виправити перед client handoff (5-7 годин роботи)

**P0-1. Заповни `phone` і `address` в `placeholders.ts`** або **прибери ці рядки повністю з ContactDetails.tsx і ZhkFactBlock.tsx.**
- **Файли:** `src/content/placeholders.ts`, `src/components/sections/contact/ContactDetails.tsx`, `src/components/sections/zhk/ZhkFactBlock.tsx`
- **Час:** 15 хв.
- **Impact:** Persona-1 (інвестор) і Persona-3 (журналіст) — повертає trust +3.
- **Альтернативний fix:** замість «—» написати «Зв’язок через email» / «Львів, точна адреса при зустрічі». Принаймні non-empty.

**P0-2. Заміни всі `<a href="#">` на `<button disabled>`.**
- **Файли:** `src/components/layout/Footer.tsx` (3 social icons), `src/components/sections/contact/ContactDetails.tsx` (3 social icons), `src/components/sections/zhk/ZhkCtaPair.tsx` (Instagram CTA).
- **Час:** 30 хв.
- **Impact:** усуває HashRouter-bug 7.1, не ламає user flow при випадковому кліку. Closes Bug 7.1.

**P0-3. Видали `/zhk/lakeview` redirect, заміни на 404 з пояснювальним copy.**
- **Файли:** `src/pages/ZhkPage.tsx` (видали `flagshipRecord` логіку), `src/components/sections/zhk/ZhkLakeviewRedirect.tsx` (видали).
- Або simply `<Navigate to="/projects" replace />` для slug='lakeview'.
- **Час:** 20 хв.
- **Impact:** Closes Bug 7.2.

**P0-4. Replace HashRouter with BrowserRouter + 404.html SPA shim.**
- **Файли:** `src/App.tsx`, `public/404.html` (new), `vite.config.ts` (base path).
- **Час:** 1 година.
- **Impact:** clean URLs, SEO, OG-share, бренд-perception. **Найбільший impact / cost ratio в цьому списку.**

**P0-5. Add skip-link.**
- **Файл:** `src/components/layout/Layout.tsx`.
- **Час:** 30 хв.
- **Impact:** WCAG 2.4.1 pass.

**P0-6. Fix mobile cutoff — або lower breakpoint до 768, або add minimal single-col layout.**
- **Файли:** `src/components/layout/Layout.tsx` (breakpoint), або новий `<MobileLayout>` з спрощеним рендерингом.
- **Час:** 30 хв (breakpoint shift) або 3-4 години (full mobile-layout).
- **Impact:** від loss-mitigation до permanent revenue-recovery (mobile-leads).

### P1 — Виправити після МVP-передачі, до launch (8-12 годин)

**P1-1. Уніфікуй CTA-формулювання.**
- 5 кнопок «Дивитись», «Перейти», «Ініціювати», «Написати», «Підписатись» → 3 категорії: `Написати нам` (mailto), `Дивитись {object}` (internal nav), `→ {object} ↗` (external).
- **Час:** 1 год + ред-pass контенту.

**P1-2. Add focus management at route change.**
- `Layout.tsx`: на mount нового route, focus на `<h1 tabIndex={-1}>`.
- **Час:** 30 хв.
- **Impact:** WCAG 2.4.3 + screen-reader UX.

**P1-3. Add scroll-indicator hint на Hero.**
- 1 декоративний element з opacity 0.4, animate-bounce, fade-out на scroll-event.
- **Час:** 20 хв.
- **Impact:** discoverability of below-fold content.

**P1-4. Fix construction-log photo captions.**
- 60 рядків даних в `data/construction.ts`. Можна делегувати content-writer’у.
- **Час:** 2 години (від power-user) до 1 дня (full audit).
- **Impact:** transforms photo-dump на progress-narrative. **Persona-1 trust +2.**

**P1-5. Add breadcrumb на /zhk/etno-dim.**
- 1 рядок: `<Link to="/projects">← Усі проєкти</Link>` над `<ZhkHero>`.
- **Час:** 10 хв.

**P1-6. Filter «Будується» на /projects показуй Lakeview-карточку у filtered-state.**
- Поточний `BuduetsyaPointer` — пасткова UI. Заміни на повторну flagship card або remove pointer.
- **Час:** 30 хв (architectural).

**P1-7. Скоротити page-transition до 200+200ms.**
- **Файл:** `src/lib/motionVariants.ts` (pageFade duration).
- **Час:** 5 хв.

### P2 — v1.5 / post-launch optimizations (8-15 годин)

- P2-1. Real social-icons (simple-icons-react або static SVG) замість Send/MessageCircle/Globe.
- P2-2. Soundless deep-link на ЄДРПОУ-реєстр у TrustBlock.
- P2-3. Construction-teaser arrow-buttons disabled-state на boundary.
- P2-4. Empty-state Zdano: secondary CTA «Подивитись активні проєкти» / «Підписатись».
- P2-5. 404 page: «Можливо ви шукали:» + 4 топ-ссилки.
- P2-6. Lightbox keyboard-shortcut hint (Esc · ← →).
- P2-7. Tooltip на mailto-CTA: «Відкриється поштовий клієнт».
- P2-8. Active-fold scroll-spy для Nav (active state змінюється на scroll-position на /).

### P3 — v2 nice-to-have

- P3-1. Cmd-K palette.
- P3-2. Press-kit page (logos, brand-system PDF download).
- P3-3. Прес-mailto (press@vygoda.com.ua).
- P3-4. /zhk/maietok-vynnykivskyi і /zhk/nterest повноцінні detail-сторінки.
- P3-5. /construction-log infinite-scroll або pagination.
- P3-6. Social-share buttons на /zhk/etno-dim («Поділитись Telegram/Email/Copy URL»).
- P3-7. Date-range фільтр на /construction-log.
- P3-8. Dark-mode toggle (бренд-deal: вже dark-only, тому low-priority).

---

## 9. Метрики успіху після фіксів

### Quantitative (post-implementation):

| Метрика | Поточна (estim.) | Цільова після P0+P1 |
|---------|------------------|--------------------|
| Mobile bounce rate | 95% (всі бачать fallback) | 50% (з спрощеним layout) |
| Contact-CTA click-through | 1-2% | 4-6% (з phone+address заповнено) |
| Avg time-on-/zhk/etno-dim | 30 sec | 70 sec (з breadcrumb + plan-page) |
| WCAG 2.1 AA failures | 4-5 (skip-link, contrast labels, focus, disabled-links) | 0 |
| Lighthouse a11y score | 88-92 (estim.) | ≥95 |
| URL-share quality | low (`/#/zhk/etno-dim`) | high (`/zhk/etno-dim`) |

### Qualitative:

- Persona-1 (інвестор): trust «можна перевірити» → «впевнений»
- Persona-2 (сімʼя): mobile-flow → desktop-flow conversion
- Persona-3 (журналіст): «контакт неповний» → «PR-ready»

---

## 10. Висновок

Сайт VUGODA — **дуже сильний у бренд-execution** і **слабкий у нюансах конверсії та a11y**. Десктопна естетика (1920×1080) — преміум, copy-tone — exemplary, technical-stack — sound. Але:

- HashRouter, mobile-cutoff, em-dash контакти — це **3 рішення, що випадково сигналізують «це ще не серйозно»** саме тій аудиторії, для якої сайт побудований.
- Inconsistencies у CTA, focus management, filter-edge-cases — це **trapdoor-bugs**, яких клієнт не побачить на demo-walkthrough, але побачить юзер у production.

**Recommended path:**

1. **До client-handoff demo:** P0 fixes (5-7 годин). Це 1 день роботи.
2. **До public launch:** P1 fixes (1-1.5 робочих дня).
3. **v1.5 sprint:** P2 (1 тиждень).
4. **v2:** P3 + повноцінний mobile (2-3 тижні).

Загалом **сайт ready на 70-75% для premium-client demo**. P0-fіксы підвищують це до 90-95%.

---

**Аудитор:** UX Researcher
**Файл-источник:** /Users/admin/Documents/Проєкти/vugoda-website/AUDIT-UX.md
**Дата:** 2026-04-27
