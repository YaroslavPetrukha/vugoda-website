# AUDIT-DESIGN.md — Розгромний аудит сучасності веб-дизайну

**Об'єкт:** `https://yaroslavpetrukha.github.io/vugoda-website/`
**Дата:** 2026-04-27
**Аудитор:** UI Designer (skeptic-mode, без реверансів)
**Контекст:** MVP-прототип для клієнтського демо. Стек Vite 6 + React 19 + Tailwind v4 + Motion. Десктоп-перший, 1920×1080, бренд закритий.
**Палітра:** `#2F3640` BG · `#3D3B43` surface · `#020A0A` deep · `#C1F33D` lime · `#F5F7FA` text · `#A7AFBC` muted. Шрифт — Montserrat 400/500/700.

---

## 0. Заголовок-вирок

**Це не корпоративний сайт девелопера 2026 року. Це безпечний бутстраповий темплейт, у який залили брендову палітру і назвали «системний девелопмент». Все що ви запам'ятаєте після прокрутки — гігантський "ВИГОДА" посередині першого екрану і поодинокий зелений прямокутник CTA. Все інше — рівні відступи, рівні картки, рівні заголовки 30-36px, рівні тексти `#A7AFBC` 16px на 5/7 секцій. Сайт виконує бриф буквально, але не виконує його дух: бренд каже «системний» і «впевнений» — а сайт каже «обережний» і «середньостатистичний».**

---

## 1. Verdict: 4/10

**4 з 10 на сучасність 2026.**

- +1 за чесний бренд-фундамент (палітра, шрифт, токени правильно сетапнуті)
- +1 за відсутність grossо-помилок (немає драй-Bootstrap-кнопок, немає неонового градієнта, немає glassmorphism спроб)
- +1 за прийнятну типографічну гігієну (Montserrat живий, не покалічений)
- +1 за hero-wordmark як єдиний сильний візуальний хід
- −2 за повну відсутність imagery/scroll-storytelling/візуальної ієрархії на 5 з 7 home-секціях
- −2 за «однаковий gap-24, py-24» рендеринг кожної секції під одну гребінку (Лекало 2018)
- −1 за `#C1F33D`, який з'являється рівно 4 рази на головній (CTA × 2, маркер `01-04`, лого) — це акцент для бухгалтерії, не для бренду
- −1 за повну відсутність кубів як живої графічної мови після hero (брендбук §5 вимагає cube-ladder, сайт не показує жодного куба нижче першого екрану)

**Підсумок:** проєкт виконав вимоги CLAUDE.md і концепції на рівні «не зламано», але не виконав їх на рівні «це міг бути флагман львівського ринку». Якщо віддати клієнту цей URL — клієнт побачить щось більш дешеве за прототип, який ви рік тому зробили на чужому шаблоні. Це **не** ахуєнно на 1920×1080. Це **прісно** на 1920×1080.

---

## 2. Топ-10 критичних дефектів

### Дефект 1. Hero — це фотофрейм, а не сцена

**Файл:** `src/components/sections/home/Hero.tsx:80`

```tsx
<h1 className="font-bold uppercase tracking-tight text-[clamp(120px,12vw,200px)] leading-none text-text">
  ВИГОДА
</h1>
```

Гігантський wordmark `clamp(120px, 12vw, 200px)` стоїть посередині секції, по центру осі, з білим кольором `#F5F7FA`, на ледве видимому ізометричному паттерні `opacity 0.15`. Це **дзеркало** прототипу 2018 року: *«big text + faded background pattern + CTA below»*. У 2026:

- Hero має нести **6+ візуальних шарів**: фон-куби (depth-1), тіньова сцена (depth-2), wordmark (depth-3), kinetic-line (depth-4), субтекст (depth-5), CTA + counter/marquee (depth-6). У вас — 3 шари (фон/h1/CTA).
- Wordmark виключно по центру, без зміщення, без break-up, без mixed-weight трюку. Сучасні забудовники (Refokus портфоліо, Vinhomes, Brabbu, Studio Frantz) **ламають** wordmark через grid-mask, через split-letters, через layered overlap з фотографією або числом.
- `text-text` (білий) — це найбезпечніший вибір. Можна було задати **outline-text** ефект (`-webkit-text-stroke`), або mix-blend-mode `difference` для перетину з фоновим патерном — і wordmark набув би живої інтерактивності.

**Чому це 2018:** flat centered hero з faded background це рецепт з епохи Bootstrap Jumbotron + Material Design. У 2026 hero — це **сцена з кінематографічним рухом**.

### Дефект 2. BrandEssence — це Word-документ у 2 колонки

**Файл:** `src/components/sections/home/BrandEssence.tsx:25`

```tsx
<RevealOnScroll staggerChildren className="grid grid-cols-2 gap-x-12 gap-y-16">
  {brandValues.map((value, i) => {
    const num = String(i + 1).padStart(2, '0');
```

4 цінності (системність / доцільність / надійність / довгострокова цінність) рендеряться в нумерованій 2×2-сітці. Кожна картка:
- мала цифра `01-04` зверху (text-sm muted)
- заголовок text-2xl bold
- параграф text-base muted

**Що не так:**
1. Жодних кубів. У концепції §5.2 записано «cube-ladder: 1 куб → 2-3 куби → ізометрична сітка». Тут — найприродніше місце для **4 кубів-маркерів** як іконографічного якоря (по 1 кубу на цінність, кожен з різним rotateX/rotateY кутом для відчуття «різні точки одного об'єкта»). Не використано.
2. Цифри `01-04` зробили розміром `text-sm` (14px, muted). У 2026 такі індексники роблять **гігантськими** — `text-7xl` або `clamp(80px, 8vw, 144px)`, накладеними **за** заголовком, у opacity 8-15% — щоб стати тлом-ритмом. Дивіться Apex (apex.design), Locomotive, IF Design Awards 2025 — usability + drama.
3. Сітка 2×2 зі звичайним `gap-x-12 gap-y-16` — це pixel-perfect нічого. Сучасний підхід — **broken grid** (асиметрія: 1-я картка на 4 cols, 2-я на 6 cols, 3-я на 8 cols, 4-я на 5 cols, з offset-Y) або **vertical stack with sticky-left-label** (заголовок секції приклеєний зліва на весь scroll, картки розкручуються справа).
4. `gap-y-16` (64px) між рядками — це маленько для display-секції на 1920×1080. Має бути `gap-y-24` мінімум.

**Чому це 2018:** Bootstrap `.row > .col-md-6 × 4` з заголовком зверху. Без іконок, без цифр-як-arts, без зміщень.

### Дефект 3. PortfolioOverview — flagship у однотонному прямокутнику

**Файл:** `src/components/sections/home/PortfolioOverview.tsx:48-91` + `FlagshipCard.tsx:32`

```tsx
<article className="mb-16 grid grid-cols-1 gap-8 bg-bg-surface lg:grid-cols-[3fr_2fr] hover-card">
  {/* aerial.jpg ліворуч 60%, текст праворуч 40% */}
```

Flagship Lakeview — це **єдина aerial-фотографія на головній** і вона візуально звучить як stock-photo в банерному прямокутнику з фоном `#3D3B43`. CTA — стандартна зелена плашка `bg-accent px-6 py-3`. Заголовок `text-3xl` (30px). Все.

**Що не так:**
1. **Жодного зум-эфекту, kenburns-парсера, video-loop або wireframe-overlay.** Lakeview — єдиний активний об'єкт. Він має «світити» — повний bleed-edge, мінімум 70vh, з куб-сіткою overlay 10% Multiply, з `filter: contrast(1.1) saturate(0.9)` для архітектурної холодності.
2. **«Активне будівництво» написано text-sm uppercase muted.** У 2026 такий стейтус-маркер роблять **тікаючим** (kinetic ticker `АКТИВНО · АКТИВНО · АКТИВНО`) або **акцент-чипом з пульсацією** (animated dot accent + label). Тут — статичний caption.
3. **`hover-card` (scale 1.02 + glow shadow accent 15%)** — це сучасний хід, але стрес-тест не пройде. На карточці 1280×720 ефект scale 1.02 додає 13px по периметру — надто великий для desktop hover на флагшипі. Має бути scale 1.005 + parallax (cursor-follow tilt) + image-zoom внутрішній (картинка масштабує scale 1.04, сама картка — ні).
4. **3 pipeline-картки** (Етно Дім / Маєток / NTEREST) — однакові `aspect-[4/3]` прямокутники з підписом знизу. Вони виглядають як stock-аркадія. Має бути **різна висота** (mason-grid: одна aspect-3:2, друга aspect-4:5, третя aspect-1:1) + **різні рівні «жвавості»** (та що з меморандумом — статична; та що з кошторисом — пульсує label «у розрахунку»; та з дозвільною — анімований штрихований прямокутник довкола фото).

### Дефект 4. ConstructionTeaser — 5 порожніх плейсхолдерів у горизонтальній стрічці

**Скріншот:** `audit/live-home-1920-full.png`, секція "Хід будівництва Lakeview"

На live-знімку 1920 видно: 5 однакових `bg-bg-surface` прямокутників у ряд, без зображень (lazy-load не спрацював на момент скріну). Ця секція — **єдиний** живий доказ активної роботи. На фото вона виглядає як loading-skeleton, що ніколи не завантажився. У концепції §7.9 прямо: *«центральний доказ поточної активності»*. На сайті це найслабша секція.

**Що не так:**
- 5 однакових `h-[200px] w-[320px]` карток без жодної ієрархії. Перша картка має бути **великою** (aspect-16:9, 640×360), решта — стрічкою-міндюйм 240×320 portrait.
- Заголовок `text-3xl` ліворуч + дата `text-sm` справа — нудно. Має бути:
  - заголовок «Хід будівництва Lakeview / Live»
  - **kinetic-counter** «47 фото · 4 місяці · оновлено 15 днів тому»
  - «Live» з пульсуючим зеленим dot
- ChevronLeft/ChevronRight в кружках `bg-bg-surface` поза скрол-контейнером з `-translate-x-1/2` — тривіальні. Замінити на **великі стрілки 64px з `text-text-muted`**, що з'являються тільки при hover контейнера, або взагалі перейти на drag-snap (Motion `pan` gesture).
- Дата підписана раз у заголовку. Кожне фото має нести **підпис кадру** на hover (overlay з знизу, `bg-bg-black/80`, text 14px) — *«Січень 2026 · фундамент, секція 1»*.

### Дефект 5. MethodologyTeaser — три параграфи `text-base text-text-muted` поряд

**Файл:** `src/components/sections/home/MethodologyTeaser.tsx:38-65`

```tsx
<RevealOnScroll staggerChildren className="grid grid-cols-1 gap-8 lg:grid-cols-3">
  {featured.map((block) => (
    <motion.article ... className="flex flex-col gap-4">
      <span className="font-medium text-sm text-text-muted">01</span>
      <h3 className="font-bold text-xl text-text">{block.title}</h3>
      <p className="text-base leading-relaxed text-text-muted">{block.body}</p>
```

Три однакові колонки. Заголовок `text-xl` (20px). Body `text-base` (16px) muted. Маркер цифрою `text-sm` muted. **Ноль візуальної інформації** окрім букв.

Що мало б бути в 2026:
- **Великі pull-quotes** з ключовою фразою, винесеною як display-text (`text-5xl`/48px, white) + dim-body (12-14px) під ним. Це робить блок подвоєним — реклама + документ.
- **Один куб-якір на блок** (брендбук §5 — «один базовий модуль»). Inline SVG, 80×80, opacity 60%, `accent` колір — щоб сторінка фізично «носила» бренд.
- **Number `01` як великий tile-mark** — clamp(72px, 6vw, 120px), opacity 12%, поведений за заголовок (z-index −1, абсолютно). Зараз це `text-sm` — найслабша інтерпретація.
- **Hover-state** — на наведенні куб обертається на 12° по Y (CSS 3D transform), на блок з'являється тонка лінія `1px accent` ліворуч.

### Дефект 6. TrustBlock — таблиця в стилі Excel

**Файл:** `src/components/sections/home/TrustBlock.tsx:43-82`

```tsx
<RevealOnScroll className="grid grid-cols-1 gap-12 border-t border-bg-surface pt-12 lg:grid-cols-3">
```

Три колонки: «Юр. особа», «Ліцензія», «Контакт». Всі три однакової ширини, з однаковим `border-t border-bg-surface pt-12`. Виглядає як **бухгалтерська виписка**, не як trust-block.

**Що не так:**
1. Заголовки колонок — uppercase `text-xs` muted. В 2026 це або **caps-tracking 0.08em + 14px white** з кубом-якорем поряд, або **великий префікс-номер** (01/02/03), або **icon + label** комбо.
2. Bold-значення `text-base` — 16px. Це бухгалтерія. Має бути `text-2xl` або `text-3xl` (24-36px) для **єдиного фактичного числа на сторінці** — `42016395`. Цифра ЄДРПОУ — це доказ. Доказ показують крупно.
3. **Border-top одна тонка лінія** — недостатньо. Має бути **рамка-таблиця з vertical dividers** між колонками (1px `bg-surface`) + горизонтальна над і під — щоб виглядало як **сертифікат**, не «div`и в ряд».
4. Жодного візуального якоря (іконка, печатка, QR). У 2026 «trust block» завжди має icon-pictograph на колонку (lucide: `Building2`, `FileBadge2`, `MailPlus`).

### Дефект 7. ContactForm на головній — закривчий CTA на чорному без інтерфейсу

**Файл:** `src/components/sections/home/ContactForm.tsx:34-46`

```tsx
<RevealOnScroll as="section" className="bg-bg-black py-24">
  <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
    <h2>{contactHeading}</h2>
    <p>{contactBody}</p>
    <a href={href}>{contactCta}</a>
```

Чорний фон `#020A0A`, центрований h2 `text-3xl`, параграф text-base muted, зелена кнопка-посилання. **Це fallback-секція, яка зараз існує як основна.** PROJECT.md прописує `mailto:` — окей, але візуально секція не використовує жодного з преміум-патернів:

- Немає **поля input** для email (навіть фейкового, який редиректить у mailto). Сучасні B2B сайти роблять `<input> + button` навіть якщо технічно передає в mailto.
- Немає **lazy-prefetch** Telegram/Instagram чіпів («Або напишіть у Telegram»).
- Жодного куба, жодного візуального ритму на чорному фоні — фон стає мертвим.

### Дефект 8. /projects — flagship + chips + cards = три однакові паузи

**Файл:** `src/pages/ProjectsPage.tsx` + screenshot `audit/live-projects-1920-full.png`

На live-знімку:
1. H1 «Проєкти» **30-36px**. Це H2-розмір, не H1. Hub-page H1 на 1920 має бути **clamp(64px, 6vw, 120px)** мінімум — з display-моментом.
2. Flagship Lakeview займає **600×340 area** (сильне обрізання) — на 1920 це **≤30%** ширини viewport. Має бути 90vw або 100vw bleed-edge.
3. Filter-chips під ним — стандартна react-router-pattern капсула. Жодного візуального аккорду між chip-ом «Усі (4)» (зелена) і flagship-карткою вгорі.
4. 3 pipeline-картки — `aspect-[4/3]`, всі однакові, всі з муто-text label. Жодного візуального priority між «Етно Дім» (меморандум) і «NTEREST» (дозвільна) — а це різні pipeline-етапи.
5. «+1 об'єкт у роботі...» — однорядкова сентенція з вирівнюванням лівим, без візуального аккорду. Має бути **окремою аркою — куб-якір + текст справа + dotted-line розширення на 100% width**.

### Дефект 9. /zhk/etno-dim — рендер з ЛУН-водяним знаком

**Скріншот:** `audit/live-zhk-etno-1920-full.png`

На live-знімку **видно жовтогарячий watermark «ЛУН»** (lun.ua, конкурент-агрегатор) у правому нижньому куті hero-рендера. **Це катастрофа для бренду.** Це **не помилка фронтенду** — це нечистий source-asset, але результат той самий: на флагман-сайті забудовника видно лого конкурента.

Окрім ЛУН:
- Hero-render сидить як `100vw / aspect-16:9` (1920×1080) і займає весь fold. Це добре. Але **немає жодного UI-overlay** (project name, stage label, КЛЮЧОВИЙ факт типу «Стадія: меморандум»). На преміум-сайтах overlay завжди є.
- ZhkFactBlock — три рядки `dt/dd` («Стадія» / «Локація» / «Адреса»). На 1920 це виглядає як **adress book**, не як ключові факти проєкту. Має бути **6-8 фактів у масштабованому grid** (поверховість, секцій, метраж, клас наслідків, термін, технологія…), кожен — як **великий цифровий tile** з label під ним.
- ZhkWhatsHappening — `text-3xl` заголовок + один параграф 16px. На 1920 це 1/3 viewport із 90% порожнечі довкола.
- Галерея 4×2 thumb-ів — однакові `aspect-video`, без подразу-між-ними, без feature-thumbnail. У 2026 галерея архітектурного об'єкта — **mason-grid 6-12 thumbnails з різною висотою + 1 hero-кадр на ширину 50%**.

### Дефект 10. /construction-log — сітка скелетів

**Скріншот:** `audit/live-log-1920-full.png`

На live (без завантажених фото) — **4 місячні групи однакових сірих rectangle-скелетів у 3-col grid**. Заголовки місяців `text-3xl`. Між групами `py-16` (64px). Просто **сторінка-стіна**.

**Що не так:**
1. Жодного **timeline-якоря** (vertical sticky line з датами, що приклеюється під час scroll). У 2026 це must-have для будь-якого хронологічного контенту.
2. Жодної **interactive scroll-progress** (top-fixed bar `0% — 25% — 50% — 75% — 100%` з підписами місяців).
3. Жодної **гри з масштабом фото** — у real construction-log преміум-рівня є feature-photo-of-the-month (велика, 1280×720), а решта — square thumbnails.
4. Заголовок `Грудень 2025 · 12 фото` — суто текст. Має бути **великий tile** з номером місяця (`12`) і повним label поряд.
5. Загальний H1 «Хід будівництва Lakeview» вгорі сторінки взагалі **відсутній** на скрін-шоті — або не зрендерився, або dropped.

---

## 3. Композиція по 5 сторінках

### 3.1 Home (`/`) — сім послідовних py-24 секцій без ритму

**Що бачимо у скріні:**
- 7 секцій, кожна `py-24` (96px зверху і знизу).
- Кожна секція — `max-w-7xl mx-auto px-6` (1280px центрований).
- Жодних bleed-edge секцій, жодних full-width zones, жодних overlaps.
- Заголовки секцій: BrandEssence — без заголовка взагалі. Portfolio — `text-4xl` (36px). Construction — `text-3xl` (30px). Methodology — `text-3xl`. Trust — `text-3xl`. Contact — `text-3xl`. **Всі однакові.** На сайті немає **жодного H1-display moment** після hero.

**Hierarchy fail:** домашня сторінка повинна мати **2-3 кінематографічних моменти** (full-bleed scenes), 2-3 інформаційні модулі (constrained max-w), і 1-2 квоти/breakers між ними. Тут — 7 однакових інфо-модулів і 1 hero. Глядач втрачає темп після 2-ї секції.

**Spacing fail:** `py-24` = 96px вертикально. Між однотипними text-cards це нудно. Між **різними жанрами секцій** має бути різний rhythm: hero → portfolio (короткий 64px), portfolio → construction (великий 160px з visual breaker — куб-розділювач), construction → methodology (нормальний 96px), methodology → trust (короткий 64px), trust → contact (великий 128px з кольоровим зміщенням — секція на чорному фоні з shifted padding).

### 3.2 /projects — flagship не флагман, sticky filter відсутній

**Composition issues:**
- Flagship Lakeview обрізаний до 600×340 — НЕ флагманом. Має бути bleed-edge 100vw з overlay-info ліворуч.
- StageFilter chips сидять у потоці після flagship — на scroll вони **зникають**. Має бути `position: sticky; top: 80px` з bg-bg/blur-backdrop.
- 3 pipeline-картки в `grid-cols-3` без mason-варіацій. Має бути **mason-layout** (Pinterest-style з різною висотою) АБО **carousel-rail** (горизонтальний скрол) для додання динаміки.
- AggregateRow («+1 об'єкт у роботі») — рядок у потоці, не виглядає як epilogue. Має бути на чорному `#020A0A` background, full-bleed, з куб-якорем та `text-2xl` italic-styled (через mixed-weight Montserrat 500 + 700) рядком.

### 3.3 /zhk/etno-dim — інформаційний tre-card layout

**Composition issues:**
- Після hero йде ZhkFactBlock у `max-w-7xl` з `dl/dt/dd` 2-col grid (label 120px / value flex). На 1920 це виглядає як форма паспорта.
- ZhkWhatsHappening — 1 параграф у центрі max-w-7xl. Не відрізняється від BrandEssence на головній.
- Gallery — 4×2 однакових `aspect-video` thumbs — нема feature-картинки.
- ZhkCtaPair — 2 кнопки (mailto + Instagram). Без візуального обрамлення.

**Що має бути:** sticky-side-info panel (ліворуч `width: 320px sticky top:80px` з фактами) + scrolling-gallery справа (mason-grid, full-bleed правий край).

### 3.4 /construction-log — vertical scroll without backbone

**Composition issues:**
- 4 H2 (місяці) на однаковій вертикальній лінії — ніяк не зв'язані візуально.
- Жодної **прогрес-bar** зверху (sticky 4-step indicator: «грудень — січень — лютий — березень»).
- Сітка `lg:grid-cols-3` — стандартна. Має бути **broken-mason** з featured-photo першим у місяці.
- `py-16` (64px) між групами — мало для повноекранного scroll-storytelling.

### 3.5 /contact — H1 + 3 рядки + кнопка

**Composition issues:**
- Сторінка займає `max-w-3xl` (768px) на 1920px viewport — права 60% порожнечі.
- ContactDetails з 4 рядками `dt/dd` — це довідник.
- CTA `bg-accent px-8 py-4` — той самий бутон, що й на домашній. Жодного contact-page акценту.
- Жодної мапи, жодного візуального еkв'ю «де ми», жодних тестових pin-pointів.

**Що має бути:** split-layout (50/50) з лівою стороною — info, права — велика інтерактивна **виноска** (наприклад, ізометрична мапа Львова з кубами на місцях ЖК АБО відкритий photo-stream).

---

## 4. Типографіка — Montserrat 700/500/400 не використано на 30%

Брендбук дозволяє **тільки 3 ваги** (Bold, Medium, Regular). Це жорстке обмеження, але **в межах нього не використано 70% типографічних ходів**. Зараз:

**Поточний інвентар:**
- H1 «ВИГОДА» hero: `clamp(120px, 12vw, 200px)` Bold uppercase. ОК.
- H1 інших сторінок (`/projects`, `/contact`): `text-6xl` (60px) bold. — Малуватий display-moment.
- H2: `text-3xl` / `text-4xl` (30-36px) bold. — стандартно, без display.
- H3 в картках: `text-xl`-`text-3xl` (20-30px) bold.
- Body: `text-base` 16px Regular muted.
- Caption: `text-sm` 14px Medium muted uppercase.
- Numbers `01-04`: `text-sm` Medium muted. — найслабша точка.

### Що пропущено

**1. Display extreme.** Окрім hero «ВИГОДА» немає жодного другого extreme-моменту. Сучасні сайти 2026 (PortfolioBox, awwwards.com SOTD-добірки) тримають **3-4 display-моменти** на сайті: один на hero, один на ключовому manifesto-block, один на CTA-zone, один на footer-pre-zone. У вас — 1.

**2. Mixed weights в одному заголовку.** Montserrat 700 + Montserrat 400 у одному рядку — потужний тех. У вас — 100% секцій тримаються на ОДНІЙ вазі заголовка. Має бути:
```html
<h2>
  <span class="font-bold">Системний</span>
  <span class="font-normal italic-fake-with-skew">девелопмент,</span>
  <br>
  <span class="font-medium">у якому цінність</span>
  <span class="font-bold text-accent">є результатом</span>
  <span class="font-medium">точних рішень.</span>
</h2>
```
Це editorial-styled. Зараз — Word-styled.

**3. Oversized lowercase.** Бренд зафіксував лого «вигода» **малими літерами** (концепція §5.3, брендбук). Чому h1 на сайті — **ВЕЛИКИМИ**? Це порушення duo-бренду (брендбук позиціонує «вигода» з малих, сайт — з великих). Має бути hybrid: hero — `вигода` 280px lowercase Bold + дескриптор «системний девелопмент» 32px Medium. Тоді бренд читається з логотипом duo.

**4. Rotational/marquee text.** Жодного `transform: rotate(-90deg)` vertical-label, жодного `<motion>` infinite ticker, жодного `text-stroke-only` overlay. На сучасних сайтах девелоперів (Brabbu, Forme Apartments) — це **4-6 ходів на одну сторінку**.

**5. Kinetic type.** На scroll progress 0-100% масштабувати літеру (через `useTransform`). На hover на CTA — translate літери на 4px по Y з затримкою 30ms кожна (Motion stagger). Жодне з цього не використано.

**6. Letter-spacing variation.** `tracking-tight` на hero, `tracking-wider` на uppercase labels — і все. Має бути **3-4 рівні tracking** (`tracking-[0.18em]` для display-caption, `tracking-[-0.04em]` для display-tight, `tracking-normal` для body, `tracking-[0.08em]` для overline).

**7. Number typography.** ЄДРПОУ `42016395` — 8-значне число — рендериться як `text-base`. У 2026 це **єдиний digit-block на сайті** і він має бути **clamp(60px, 5vw, 96px) tabular-nums Bold accent** окремою декорацією. Це **доказовий** елемент.

**8. Caption hierarchy.** Stage labels (`stage-pill`, `stageLabel`) рендеряться `text-xs uppercase tracking-wider muted`. Має бути **2 формати**: hero-stage = `text-base accent` з пульс-dot, secondary-stage = `text-xs uppercase muted`. Зараз — один формат на всі контексти.

### Recommended typographic scale (2026-grade)

```css
/* Display (max 1 per page) */
--font-display:    clamp(120px, 14vw, 240px);  /* hero only */

/* Display-large */
--font-display-l:  clamp(72px, 7vw, 128px);    /* H1 page heads, manifesto */

/* Section heading */
--font-h2:         clamp(48px, 4vw, 72px);     /* current is 30-36 → bump */

/* Subsection */
--font-h3:         clamp(28px, 2.2vw, 40px);   /* current is 20-30 → bump */

/* Lead */
--font-lead:       clamp(20px, 1.4vw, 24px);   /* slogan, intros */

/* Body */
--font-body:       16px;

/* Caption / overline */
--font-overline:   13px; /* tracking 0.18em uppercase */

/* Number-block (tabular-nums) */
--font-figure:     clamp(60px, 5vw, 96px);     /* ЄДРПОУ, counts */
```

**Поточний код у 80% випадків знизу від цієї шкали.** «Section heading 30px» — це 2018-розмір. У 2026 на 1920 H2 — **48-72px**.

---

## 5. Колір `#C1F33D` — де він має «світити»

Зараз `accent` з'являється:

1. CTA-кнопки (`bg-accent`) — на hero та контакт-формі. ОК.
2. CTA-кнопка флагмана (Lakeview redirect). ОК.
3. Номер `01-04` у BrandEssence — НЕ в accent (зараз `text-text-muted`). **Промах.**
4. Лого-куб у nav. ОК.
5. Marker `mark-pulse` (Suspense fallback). Не помітний.
6. Active-chip filter на /projects. ОК.
7. Underline `hover:underline text-accent` на «Дивитись повний таймлайн» в ConstructionTeaser. ОК.
8. focus-visible outline. ОК.

**І ВСЕ.** На 1920 viewport є **ОДИН-ДВА** зелені прямокутники одночасно. Це не «світить» — це «миго**ть слабо**».

### Де accent має з'явитися (без порушення «не фон великих блоків»)

1. **Pulsing dot біля «Live»-маркера** на ConstructionTeaser. `bg-accent w-2 h-2 rounded-full animate-pulse`.
2. **Stage-label на flagship**: `АКТИВНЕ БУДІВНИЦТВО` text-accent (поточний text-text-muted) — 12-14px, єдиний у поле зору.
3. **Number-tile на trust-block**: ЄДРПОУ `42016395` — text-accent text-figure (60-96px tabular). Поточний — text-text-base.
4. **Vertical accent-bar** (1px width, 64px height, animated draw-on-scroll) між кожним блоком методології. Як verbal punctuation.
5. **Cube-stroke у hero-pattern**: зараз патерн — flat fill `#c1f33d` 0.15 opacity. Має бути **stroked-only куби** (1.5px stroke #c1f33d 60% opacity на ключових 3-х кубах із 12) + flat-fill 0.05 на решті — щоб 3 «акцентних» кубики ВИДНО, а решта — фоном. Зараз все — однорідний фон.
6. **Accent-rule line** під кожним H2 (50px width, 2px height, accent), animated draw on `whileInView`.
7. **Cursor-trail** (Motion) — на курсорі custom-cursor 8px accent dot + 24px ring. Бренд-курсор. Так роблять Refokus, Smartwave, Studio Frantz.
8. **Hover state на pipeline-cards** — зараз `hover-card` (scale + glow shadow). Має бути додатково `border-l-2 border-accent` на hover (зліва ліпиться зелена пілка).
9. **Selection-color** (вже є — `::selection`). ОК.
10. **«Перейти»-стрілка animation** — на CTA `inline-flex items-center` додати ArrowRight icon, який slide-in 0 → 8px по hover (Motion), accent-кольору.

Якщо застосувати ці 10 точок — зелений з'являється **20+** разів на сайті, але ніде не стає фоном. Це і є «акцент-дисципліна».

---

## 6. Простір/негативний простір

### 6.1 Де порожнеча — і це погано

- **/contact, права 60% viewport** — лежить плодами голого `#2F3640`. На 1920 це **1152px × 800px** мертвої зони. Має бути або split-layout, або великий ілюстративний асет (мапа, isometric-міста-overlay).
- **Hero під wordmark** — від низу wordmark до CTA `gap-12` (48px). Це мало для preferred-fold ритму. Має бути 80-120px, заповнений subline + counter («ЛЬВІВ · 1 АКТИВНИЙ ОБ'ЄКТ · 4 У ПРОЦЕСІ»).
- **Низ home (footer pre-zone)** — після ContactForm чорний фон, потім стрибок на footer. Має бути editorial breaker (`Дослідити проєкти →`).
- **/zhk/etno-dim після ZhkFactBlock** — три рядки фактів займають 200px height. Решта секції 700px — fluff padding.

### 6.2 Де порожнеча хороша — але її замало

- Hero — порожнеча довкола wordmark це OK, але вона **симетрична** з усіх боків. Має бути **асиметрична** (більше lower-right, менше top-left) — це додає композиційного руху.
- BrandEssence — між 4 картками `gap-y-16` (64px). Можна тримати як є, **але** додати між-картковий visual punctuation (тонка лінія 1px text-muted opacity 30% horizontal/vertical).

### 6.3 Spacing rhythm — поточна шкала

```css
--spacing-rhythm-xs: 4px;   --spacing-rhythm-sm: 8px;
--spacing-rhythm-md: 16px;  --spacing-rhythm-lg: 32px;
--spacing-rhythm-xl: 64px;
```

**Коментар:** шкала **неповна** для display-сайту 2026. Має бути 9-кроків:
```css
--spacing-2xs: 4px;    --spacing-xs:  8px;
--spacing-sm:  16px;   --spacing-md:  24px;
--spacing-lg:  40px;   --spacing-xl:  64px;
--spacing-2xl: 96px;   --spacing-3xl: 144px;
--spacing-4xl: 240px;
```

`240px` — для **section-break breathing** на 1920. Зараз ви не маєте `144px` чи `240px` у токенах, тому всі секції по `py-24` (96px). Звідси однотонність ритму.

---

## 7. Imagery/asset density — 4 з 5 сторінок порожні

### Інвентар imagery

| Сторінка | Imagery count | Типи |
|---|---|---|
| `/` (home) | 1 aerial Lakeview + 3 thumbs (pipeline) + 5 thumbs (construction teaser) | Все статичні фото |
| `/projects` | 1 aerial Lakeview + 3 thumbs | Все статичні |
| `/zhk/etno-dim` | 1 hero render + 8 thumbs | Все статичні |
| `/construction-log` | 50 thumbs (на load) | Все статичні документальні |
| `/contact` | **0** | — |

**Critical:** `/contact` — 0 imagery на 1920×1080 — катастрофа. **Mobile-only-no-imagery** допустимо, але на desktop це **половина екрану порожнього сірого**.

**Static-only:** жодного **video-loop** (4-6s ambient construction footage), жодного **interactive parallax** (cursor-driven layered photo), жодного **before/after slider** (заморожений vs відновлений Етно Дім — це СУПЕР-сильний наратив, який існує в концепції і НЕ використаний).

### Що має бути

1. **/home — додати 3-5 imagery моментів**:
   - Hero — додати subtle ambient video-loop construction footage (4-6s, B&W, 50% opacity, behind cube pattern). Якщо нема відео — slideshow з 3 фото construction `dec-2025/` autoplay 5s.
   - BrandEssence — додати 1 architectural-detail кадр (фасадна деталь, текстура бетону) як background-image на одній з 4 карток (broken-grid).
   - PortfolioOverview — додати **mosaic-collage** 6-thumb блок «Портфель в одному погляді» (aerial, фасад, деталь, інтер'єр).
   - ConstructionTeaser — feature-photo великий, решта — стрічка.
   - TrustBlock — додати ICON-pictograph по колонці (3 lucide-icons, 48px, accent-stroke).

2. **/projects — додати 5+ imagery моментів**:
   - Flagship — bleed-edge background photo + UI overlay.
   - Pipeline-картки — додати **stage-progress-strip** (HTML/CSS thin strip під фото, відсотки `30%`, `45%`, `15%` як візуальний proof).
   - Aggregate row — додати dotted-cube-illustration (ізометричний куб контурний, як у брендбуці).

3. **/zhk/etno-dim — додати 8-10 imagery моментів**:
   - **Before/After slider** — фото замороженого об'єкта vs концепт відновлення. ЦЕ КЛЮЧОВИЙ НАРАТИВ ЕТНО ДІМ. Має бути горизонтальний draggable-slider Motion.
   - **Plot-map** ділянки — ізометричний SVG illustration (брендбук §5.3 — лінійна ізометрія).
   - **Floor-plan thumb** — 1-2 архітектурних плани (навіть схематичних).
   - **Detail-shots** — 4 thumbnails деталей (фасад, балкон, вікно, вхід).

4. **/construction-log — feature-mason layout**:
   - 1 фото на місяць — feature 1280×720.
   - Решта — 4-col mason з різною висотою.
   - Між-місячний breaker — text-stamp «ГРУДЕНЬ → СІЧЕНЬ» horizontal divider.

5. **/contact — заповнити порожнечу**:
   - Ізометрична **мапа Львова** (SVG, cubic-styled) — 60% width лівого блоку.
   - Office-photo або render building — 40% width.
   - Або editorial-frame з куб-illustration на максимум висоти.

---

## 8. Scroll-storytelling — повна відсутність

### Поточний інвентар анімацій

`src/lib/motionVariants.ts` — 4 варіанти:
- `fadeUp` (opacity 0-1, y 24-0, 400ms ease-brand)
- `fade` (opacity 0-1, 400ms)
- `stagger` (children 80ms delay)
- `pageFade` (route transition)
- `parallaxRange = [0, -100]` (hero only)

### Що НЕ використано (а має бути)

**1. Pinned hero scroll.** На сучасних сайтах девелоперів hero **залипає на 100vh × 2-3** при scroll, всередині нього розгортається наратив (cube assembles, wordmark fades-in letter-by-letter, slogan replaces wordmark). Тут — звичайний `position: relative` hero scrolls out at first 100vh.

**2. ScrollTrigger / useScroll multi-stage.** `useScroll` використано один раз (Hero parallax). Має бути:
- BrandEssence — `useScroll` per-card трансформує цифри `01-04` від opacity 0 (off-screen below) → opacity 1 (центр) → opacity 0.15 (off-screen above). Тобто **число живе** під час scroll, а не просто з'являється.
- PortfolioOverview — flagship-image scale 1.05 → 1 на scroll progress (kenburns-on-scroll).
- ConstructionTeaser — рядок фото translate-X на scroll progress (горизонтальний parallax — фото рухаються в протилежний бік до scroll).
- MethodologyTeaser — кубики обертаються по rotateY 0 → 90 на scroll progress, синхронно з reveal-параграфів.
- TrustBlock — number `42016395` друкується digit-by-digit на scroll (counter-up effect).

**3. AnimatePresence на крос-секційних переходах.** Зараз `pageFade` — fade між роутами. Має бути `clipPath` або `mask-reveal` — наприклад, ізометричний cube clip-path з кутів.

**4. Sticky-progress.** Жодної фіксованої панелі прогресу скролу. На сайтах 2026 (Apple product pages, Awwwards SOTD) — 1px sticky progress bar accent зверху, або 4-step indicator.

**5. Magnetic cursor.** Кнопки і кубики — повинні мати magnetic attraction до курсора в радіусі 40-80px (Motion `useMotionValue` + cursor-tracking).

**6. Reveal-on-load orchestration.** Зараз `RevealOnScroll` на кожній секції окремо. Hero має оркестровану load-послідовність:
1. T+0ms — фон-пelена `#020A0A` 100% opacity (white-out)
2. T+200ms — opacity → 0, виявляє dark bg + ізометричний паттерн opacity 0
3. T+400ms — паттерн opacity 0 → 0.15 з `translateY(20px) → 0`
4. T+600ms — wordmark "ВИГОДА" letter-by-letter mask-reveal, **left-to-right**, кожна літера +60ms
5. T+1200ms — slogan fade-in
6. T+1400ms — CTA fade-in + scale 0.95 → 1

Зараз — все падає одночасно через `RevealOnScroll`. Це втрачена кінематографічна можливість.

**7. Scroll-section-snap.** Native CSS `scroll-snap-type: y proximity` per-section на 1920+ — секції залипають при scroll-stop. Робить навігацію відчутно «cinematic».

---

## 9. Конкретні fix-recommendations + мокапи у словах

### 9.1 Home Hero — кінематографічний

**Зараз:**
- `<h1>` clamp(120px, 12vw, 200px) White Bold uppercase центрований
- subtitle 20px muted
- CTA bg-accent

**Має бути (мокап у словах):**

```
[full 100vh, fixed/pinned for 200vh scroll]
[layer 1, depth -3] — animated isometric-grid SVG, 12 кубів, opacity 0.05-0.20
                     серед них 3 «акцентних» куба (stroke-only, accent, opacity 0.6)
                     які obertaut по rotateY 0→90deg на scroll progress 0-100%
[layer 2, depth -2] — ambient construction loop video (4-6s, B&W, 60% opacity, mix-blend: screen)
                     OR — 3-photo slideshow з construction/dec-2025/, dur 5s, fade transition
[layer 3, depth -1] — slow parallax: clipped-photo strip (Lakeview aerial + Етно Дім + Маєток)
                     рухається з ratio 0.3 vs scroll, відображено через diagonal mask
[layer 4, depth 0]  — wordmark «вигода» (lowercase!) clamp(160px, 16vw, 280px)
                     Bold, mix-blend-mode: difference з фоном
                     letter-by-letter mask-reveal на load (60ms stagger, easeBrand)
[layer 5, depth 1]  — vertical kinetic-marquee справа (rotated -90deg):
                     «СИСТЕМНИЙ ДЕВЕЛОПМЕНТ · СИСТЕМНИЙ ДЕВЕЛОПМЕНТ ·»
                     animate translateY infinite 30s linear
[layer 6, depth 2]  — slogan «Системний девелопмент, у якому цінність є результатом точних рішень.»
                     Mixed weight: «Системний» Bold 32px + рештa Medium 28px
[layer 7, depth 3]  — CTA pair:
                     [primary] «Переглянути проєкти →» bg-accent, magnetic-cursor attract
                     [secondary] «Контакт» text-text underline-on-hover
                     [counter] «1 активний · 4 у процесі · 0 зданих» text-sm muted уpper-left
                     ↑ це чесна цифра — кliesnт побачить «ого, чесно»
```

**Pixel-level:**
- font-size hero: `clamp(160px, 16vw, 280px)` (зараз 120-200)
- gap між шарами: `gap-16` (64px між wordmark і slogan), `gap-8` (32px slogan→CTA)
- background: 3-shadow layered radial-gradient від `#020A0A` до `#2F3640` (subtle, не gradient-overlay)
- pin duration: 200vh (двічі висоту viewport — щоб scroll-driven анімація встигла розгорнутися)

### 9.2 Home BrandEssence — manifesto-block

**Має бути:**

```
[full 100vh або 80vh, dark bg]
[left 30% sticky] — section label «01 / 04 — БРЕНД-ЕСЕНЦІЯ» rotated -90deg vertical
                    + великий accent dot pulsing
[right 70% scroll-stack] — 4 manifesto-cards stacked vertical, scroll-snap
                          кожна card:
  ┌────────────────────────────────────────┐
  │  01                                    │  ← число clamp(120px, 10vw, 180px) opacity 12% behind
  │   ┌──┐  СИСТЕМНІСТЬ                    │  ← isometric cube 64px stroke accent + h3 48px
  │   └──┘                                  │
  │                                         │
  │   Архітектура, функціональність         │  ← body 20-24px text-text (НЕ muted!)
  │   та інвестиційна доцільність як        │
  │   одна система, де кожен елемент        │
  │   працює на загальний результат         │
  │                                         │
  │   ───────                                │  ← 64px-1px accent-bar draw-on-scroll
  └────────────────────────────────────────┘
```

**Pixel-level:**
- card height: 80vh кожна, scroll-snap
- title size: `text-5xl` (48px) bump from `text-2xl` (24px)
- body size: `text-xl` (20px) text-text bump from `text-base muted`
- number "01": `clamp(120px, 10vw, 180px)` opacity 0.12 behind text
- cube SVG: 64×64 stroke 1.5px accent
- accent-bar: 64×1px draws on `useScroll` scroll-progress 0.5→1

### 9.3 Home PortfolioOverview — flagship dramatized

**Зараз:** `mb-16 grid lg:grid-cols-[3fr_2fr] bg-bg-surface` — flagship у рамці.

**Має бути:**

```
[bleed-edge 100vw, height 100vh для flagship]
[top of section: small caption в max-w-7xl]
  «ПОРТФЕЛЬ · 1 + 4 · LVIV»  — caption uppercase tracking-wide

[FLAGSHIP — повний bleed]
  [left 50% — image]
    aerial Lakeview, 100vh height, object-cover
    overlay: ізометрична сітка 1px stroke text-muted opacity 0.25 (Multiply blend)
    bottom-overlay: «ЖК LAKEVIEW · АКТИВНЕ БУДІВНИЦТВО · 2027» text-sm tracking-wide

  [right 50% — content на bg-bg]
    [vertical centered]
    «активне будівництво» text-accent text-base + pulsing dot ⬤
    «ЖК Lakeview» text-7xl Bold, mixed
    Lakeview лого Pictorial-style
    «Здача 2027» text-2xl Medium muted
    [stats triplet]
      «3» поверхи [number tile]   «48» квартир   «2027» здача
    [CTA] «Перейти на сайт проєкту →» bg-accent, magnetic, з ArrowRight slide-in

[PIPELINE-3 mosaic, broken-grid]
  [card 1: Етно Дім]      aspect-3:4 portrait, 480px width
                          stage chip absolute top-right «меморандум» text-accent border-accent
  [card 2: Маєток]        aspect-1:1 square, 360px width, offset-Y 80px
                          stage chip «у розрахунку»
  [card 3: NTEREST]       aspect-16:10 landscape, 600px width, offset-Y -40px
                          stage chip «у погодженні»
  Кожна card: hover-state з image-zoom внутрішній (1.05) + accent-rule зліва

[AGGREGATE row, full-bleed на bg-bg-black]
  [center 100vw]
  ізометричний контурний куб, 96×96, accent stroke 1.5px (inline SVG)
  «+1 об'єкт у роботі» text-3xl Bold + dotted underline animated
  «Стадія прорахунку кошторисної вартості. Назва та локація — після завершення.» text-base muted
```

### 9.4 Home ConstructionTeaser — live-feed feel

```
[bg-bg, py-32]
[left side, sticky]
  caption «LIVE / БУДІВНИЦТВО»
  ⬤ pulsing accent dot
  «Lakeview · Львів» text-2xl
  date «березень 2026 · 15 фото» text-base muted
  CTA «Дивитись повний таймлайн →» text-accent

[right side]
  [feature photo, 720×480]
  [strip of 6 thumbs знизу, aspect-portrait, 160×240 each, drag-snap]
  [CSS scroll-snap-type: x mandatory]
  кожен thumb на hover — caption-overlay з знизу: «Січень 2026 · фундамент, секція 1»
```

### 9.5 /projects — sticky filter + mason

```
[hero zone 60vh]
  caption «ПОРТФЕЛЬ · v.2026.04»
  H1 «Проєкти» clamp(72px, 7vw, 128px) Bold
  subtitle «1 активний · 4 у роботі · 0 зданих» text-2xl muted
  [horizontal counter-bar] kinetic ticker з назвами всіх 5 проєктів

[FlagshipCard — full-bleed 100vw, height 720px]
  Lakeview aerial + UI overlay (як у 9.3)

[STICKY FILTER — top:80px, blur-bg]
  filter chips з кубом-маркером поряд активного chip
  count в брекетах «(2)» tabular-nums

[PIPELINE GRID — mason 3-col, різні висоти]
  Етно Дім aspect-3:4
  Маєток aspect-1:1, offset-Y +60px
  NTEREST aspect-16:10, offset-Y -30px

[AGGREGATE — full bleed black]
  як у 9.3
```

### 9.6 /zhk/etno-dim — editorial

```
[HERO render 100vh full-bleed]
  overlay-bottom (linear-gradient bg-bg-black 60% transparent):
    «ЖК Етно Дім · Львів» text-5xl
    chip «меморандум про відновлення будівництва» border-accent
    H1 invisible if needed (a11y), display через overlay
  [скролл-ind down arrow]

[BEFORE/AFTER SLIDER 100vh]  ← КЛЮЧОВЕ
  [left img] заморожений-photo (вантажиться як placeholder)
  [right render] — стан після відновлення
  [draggable handle посередині, accent vertical bar 2px]
  caption «Об'єкт законсервовано → меморандум 2026 → старт відновлення»

[SPLIT: facts + gallery]
  [left 30% sticky]
    8-фактовий dl/dt/dd великий
    Стадія: меморандум
    Локація: Львів
    Адреса: { після верифікації }
    Поверховість: { TBD }
    Секцій: { TBD }
    Технологія: { TBD }
    Клас наслідків: { TBD }
    Термін: { TBD }
  [right 70% scrolling]
    8 рендерів mason-grid
    feature-render першим (aspect-16:10, 100% width)
    решта 7 — 2-col, 4-row, різні аспекти

[WHAT'S HAPPENING editorial]
  pull-quote 60px Bold + body 20px Medium + accent-bar
  full-bleed, padding-x 200px

[CTA pair]
  primary «Написати про ЖК Етно Дім» bg-accent
  secondary «Підписатись на оновлення в Instagram» border-text
  тлом — ізометричний half-cube illustration accent stroke
```

### 9.7 /construction-log — timeline

```
[STICKY top — progress-bar]
  4-step indicator з місяцями + accent fill
  «грудень 2025 → січень 2026 → лютий 2026 → березень 2026»

[per-month section]
  [left 25% sticky]
    «01» digit clamp(96px, 8vw, 144px) opacity 12%
    «Грудень 2025» Bold text-5xl
    «12 фото» text-2xl muted
  [right 75% mason]
    feature-photo (aspect-16:10, 100%)
    решта 11 — 3-col mason з різними висотами
    кожен фото: hover overlay-caption «День 5 · фундамент секція 1»
[between-month divider]
  full-bleed thin accent line + text-marker «ГРУДЕНЬ → СІЧЕНЬ»
```

### 9.8 /contact — split-immersive

```
[full 100vh, split 50/50]
[left 50% bg-bg]
  caption «КОНТАКТ · LVIV»
  H1 «Поговоримо» text-7xl
  subtitle «про ваш об'єкт, проєкт або інвестицію» text-2xl
  [contact details dl/dt/dd великими]
    EMAIL  vygoda.sales@gmail.com    ← 24px Medium, hover accent
    TELEGRAM  @vugoda                 ← icon + handle
    INSTAGRAM @vugoda_lviv
    OFFICE  Львів, { адреса }
  [primary CTA] «Ініціювати діалог» bg-accent + magnetic + ArrowRight slide-in

[right 50% bg-bg-black]
  ізометрична карта Львова, інлайн SVG
  3 куби-pin на місцях ЖК (Lakeview / Етно Дім / Маєток)
  hover на pin — name + stage tooltip
  каркас-стиль брендбук §5.3 (stroke 1.5px, accent + text-muted)
```

---

## 10. 7-10 modern patterns у межах стека (Motion + CSS + SVG)

Усі — **без** Three.js, без Spline, без WebGL. Стек тримається `motion@12 + Tailwind v4 + inline SVG`.

### Pattern 1. Kinetic Marquee Ticker (vertical/horizontal)

**Що:** infinite scrolling text-strip — vertical у hero, horizontal між секціями.
**Як:**
```tsx
<motion.div
  animate={{ y: ['0%', '-50%'] }}
  transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
  className="flex flex-col gap-8 [writing-mode:vertical-rl]"
>
  <span>СИСТЕМНИЙ ДЕВЕЛОПМЕНТ</span>
  <span>·</span>
  <span>СИСТЕМНИЙ ДЕВЕЛОПМЕНТ</span>
  {/* duplicate for seamless loop */}
</motion.div>
```
**Де застосувати:** hero (vertical right edge), aggregate row (horizontal full-bleed), footer pre-zone.
**Бренд-консистентність:** використовує ОДИН accent (зелений dot як розділювач), один шрифт. ОК.

### Pattern 2. Magnetic Cursor + Custom Cursor

**Що:** custom курсор (12px dot + 32px ring), що «магнітиться» до інтерактивних елементів у радіусі 40-80px.
**Як:** Motion `useMotionValue` для x/y, `useSpring` для smooth follow, `useEventListener` mousemove + `getBoundingClientRect()` для elements з `data-magnetic`.
```tsx
const cursorX = useMotionValue(0);
const cursorY = useMotionValue(0);
const springX = useSpring(cursorX, { stiffness: 100, damping: 20 });
// + on hover .magnetic — animate cursorX/Y towards target center
```
**Де:** глобальний (`Layout.tsx`), застосовується тільки на pointer:fine.
**Доступність:** при `prefers-reduced-motion` — відключається, native cursor restored.

### Pattern 3. Letter-by-Letter Mask Reveal (hero)

**Що:** на load або scroll-into-view букви заголовка з'являються знизу-вгору, кожна — `mask-clip` від нижньої до верхньої кромки, з `staggerChildren: 60ms`.
**Як:**
```tsx
const word = 'вигода'.split('');
return (
  <motion.h1 variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
    {word.map(l => (
      <motion.span variants={{
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { ease: easeBrand, duration: 0.5 } }
      }} className="inline-block">{l}</motion.span>
    ))}
  </motion.h1>
);
```
Wrapper має `overflow: hidden` для clip-effect.

### Pattern 4. Scroll-Pinned Hero (з ScrollTrigger-подібною поведінкою)

**Що:** hero "залипає" на 100vh × 2-3 і всередині нього розгортається multi-stage наратив.
**Як з motion@12:** використати `useScroll` з `target: heroRef`, `offset: ['start start', 'end end']`, з висотою-обгортки `min-h-[300vh]`. Внутрішня секція `position: sticky; top: 0; height: 100vh`.
```tsx
const { scrollYProgress } = useScroll({ target: heroRef });
const wordmarkScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1.1, 0.6]);
const sloganOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
```
**Де:** home hero, /zhk/{slug} hero.

### Pattern 5. Number Counter on Scroll

**Що:** числа (ЄДРПОУ, фотолічильник, рік ліцензії) рахуються від 0 до фінального значення на scroll-into-view.
**Як:** Motion `useMotionValue` + `animate(motionValue, target, ...)` + `useEffect` на `whileInView`.
```tsx
const v = useMotionValue(0);
const rounded = useTransform(v, l => Math.round(l));
useInView(() => animate(v, 42016395, { duration: 2.4, ease: easeBrand }));
return <motion.span className="font-bold tabular-nums">{rounded}</motion.span>;
```
**Бренд:** на ЄДРПОУ — зелений колір `text-accent`, на counter «47 фото» — text-text + pulsing dot.

### Pattern 6. SVG Path Draw-on-Scroll

**Що:** ізометричні куби-каркаси (брендбук §5) з'являються на сайті через **stroke-dasharray draw animation** на scroll.
**Як:** inline SVG з `<path>` що має `pathLength=1` `strokeDasharray=1` `strokeDashoffset=1` → 0 на scroll.
```tsx
<motion.path
  d="M0 50 L50 0 L100 50 L50 100 Z"
  stroke="#C1F33D" strokeWidth="1.5" fill="none"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  transition={{ duration: 1.6, ease: easeBrand }}
/>
```
**Де:** BrandEssence (4 кубики як якоря), MethodologyTeaser (3 кубики), TrustBlock (3 кубики), AggregateRow (1 контурний куб).

### Pattern 7. Mix-Blend Mode Layered Hero

**Що:** wordmark з `mix-blend-mode: difference` поверх фотографії — букви автоматично перемикаються між light/dark в залежності від під собою.
**Як:**
```css
.hero-wordmark {
  mix-blend-mode: difference;
  color: #F5F7FA; /* через difference з різнотонним фоном дає dynamic invert */
}
```
**Де:** home hero (wordmark на subtle photo strip), /zhk hero (project name на render).

### Pattern 8. Sticky-Side Section Label (vertical writing-mode)

**Що:** великий vertical label приклеєний до лівого або правого краю секції, residual text при скролі.
**Як:**
```tsx
<aside className="sticky top-1/2 left-8 [writing-mode:vertical-rl] -translate-y-1/2 text-text-muted text-xs uppercase tracking-[0.3em]">
  01 / 04 — БРЕНД-ЕСЕНЦІЯ
</aside>
```
**Де:** BrandEssence, MethodologyTeaser, TrustBlock — кожна секція носить vertical-label.

### Pattern 9. Broken Mason Grid

**Що:** grid де cells мають **різну висоту** і **offset-Y** — створює рваний ритм, гідну композицію.
**Як:** CSS Grid `grid-template-rows: masonry` (експериментальний у 2026, fallback — JS-based) АБО `grid-auto-flow: dense` + ручне вказання `aspect-ratio` + `margin-top` на child.
```tsx
<div className="grid grid-cols-3 gap-6">
  <div className="aspect-[3/4] mt-0">...</div>
  <div className="aspect-[1/1] mt-20">...</div>
  <div className="aspect-[16/10] -mt-10">...</div>
</div>
```
**Де:** /projects pipeline cards, /zhk gallery, /construction-log per-month.

### Pattern 10. Cursor-Tracking Tilt (Pseudo-3D)

**Що:** flagship card нахиляється під курсором — імітація 3D без Three.js.
**Як:** Motion `useMotionValue` для cursor X/Y, `useTransform` мапує в `rotateX (-10..10)` і `rotateY (-10..10)`, `transform-style: preserve-3d`.
```tsx
const x = useMotionValue(0);
const y = useMotionValue(0);
const rotateX = useTransform(y, [-100, 100], [10, -10]);
const rotateY = useTransform(x, [-100, 100], [-10, 10]);
return (
  <motion.div
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - r.left - r.width/2);
      y.set(e.clientY - r.top - r.height/2);
    }}
    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
  >
    {/* flagship card content */}
  </motion.div>
);
```
**Де:** flagship Lakeview card, /zhk/{slug} hero (mild tilt).

---

## 11. Висновок-контракт для команди

Цей сайт готовий до `npm run build` і деплою. Він **не** готовий до показу клієнту як «дорогий MVP». Між цими двома станами лежить:

1. **Hero rebuild** (Pattern 3 + 4 + 7) — 1.5 дні
2. **PortfolioOverview reshape з flagship-bleed + mason** — 1 день
3. **Typography scale upbump** (всі H2 → 48-72px, додати figure-tile, додати display-display) — 0.5 дня
4. **Construction Teaser feature-photo + interactive caption-overlay** — 0.5 дня
5. **/zhk/etno-dim before/after slider + mason gallery** — 1.5 дні
6. **/construction-log timeline-progress + mason** — 1 день
7. **/contact split-immersive з isometric map** — 1 день
8. **Magnetic cursor + custom cursor (глобально)** — 0.5 дня
9. **Pattern 6 SVG cubes everywhere** — 1 день
10. **Pattern 1 marquee + Pattern 8 vertical labels** — 0.5 дня

**Total: ~9 робочих днів** один Senior frontend дизайнер-розробник, з мотивацією і доступом до брендбука.

Сайт після цих змін — це не «темплейт у бренді». Це **сайт-сцена**, де системний девелопер показує, що він **знає що таке кінематографія процесу**. Це і є те, що клієнт замовляв — *«ахуєнно на 1920»*.

**Без цих змін** — сайт виконує всі 7 SC попередніх фаз і всі 5 UAT-критеріїв, але **не виконує** головний неписаний критерій клієнта: «WOW». А це той критерій, який вирішує продаж URL `https://yaroslavpetrukha.github.io/vugoda-website/` у переговорній.

---

*Кінець аудиту. Аудитор не несе відповідальності за зміст менш ніж 1 кави о 23:30 — але всі тези підкріплені файлами, рядками коду і скріншотами вище.*
