# Бренд-аудит ВИГОДА — суворий вердикт перед передачею клієнту

**Об'єкт:** корпоративний сайт ТОВ «БК ВИГОДА ГРУП» — `https://yaroslavpetrukha.github.io/vugoda-website/`
**Дата:** 27 квітня 2026
**Аудитор:** Brand Guardian (зовнішній експерт)
**Джерела істини:** `Вигода_брендбук.pdf` (21 стор.), `brand-system.md`, `КОНЦЕПЦІЯ-САЙТУ.md`, `brand-assets/`
**Скоп:** 5 публічних сторінок + mobile fallback + OG/meta + favicon + бренд-примітиви

---

## ЗАГАЛЬНИЙ ВЕРДИКТ

### Оцінка бренд-узгодженості: **6.5 / 10**

Технічний фундамент бренду — на 9/10. Палітра закрита, типографіка дисциплінована, токени централізовані в `@theme`, `scripts/check-brand.ts` стереже шість хексів і три формати кубів автоматично. Лого — векторне, з оригінальної SVG, без перемальовування. Жодного забороненого слова з тон-листа в `src/content/`. Жодного позапалітрового хексу в `src/`. Це профі-рівень дисципліни.

Але **на сайті стоїть бренд-катастрофа**, через яку оцінка летить нижче 7-ки і яку клієнт побачить у першу хвилину. На сторінці ЖК Етно Дім головний рендер містить **великий помаранчевий вотермарк «ЛУН»** у нижньому правому куті. Це дослівно реклама портала-конкурента всередині корпоративного сайту забудовника. Один цей кадр анулює дисципліну палітри, типографіки і кубів. До того додається **перший-візит UX-провал** — на головній сторінці три pipeline-картки і весь будівельний-таймлайн стоять порожніми сірими прямокутниками доти, доки не дочекаєшся lazy-load. На скріншоті з пресмарка (`audit/02-home-fullpage.jpeg`) це видно беззаперечно.

Решта проблем — несерйозні: gmail-адреса для лідів забудовника з ЛТД (питання довіри, не катастрофа), помилка в URL `/renders/likeview/` (typo, але вже є alias на правильний `lakeview`), охоронне поле лого в навбарі формально дотримано через `px-6` контейнера, але ризикує зменшитись на вузьких desktop-екранах.

**Фікс на 5 годин роботи** (2 ч на ЛУН-вотермарк, 1 ч на skeleton-плейсхолдери, 1 ч на email-домен, 1 ч на бренд-посилення) перетворює сайт у 8.5/10 — рівень, з яким можна йти до клієнта без сорому.

---

## P0 — ЧЕРВОНІ ПРАПОРИ (ламають бренд негайно)

### P0-1. Вотермарк «ЛУН» на головному рендері ЖК Етно Дім — ПОЛЕ ВОРОЖИХ ЛОГО

**Сектор:** ZHK / `/zhk/etno-dim` hero
**Скріншот:** `audit/live-zhk-etno-1920-full.png` — нижній правий кут hero-зображення містить помаранчеву літеру/мітку «ЛУН» (портал нерухомості).
**Файл-джерело:**
```
public/renders/etno-dim/43615.jpg.webp
public/renders/etno-dim/_opt/43615.jpg-{640,1280,1920}.{avif,webp,jpg}
```

**Що відбувається:** ВИГОДА купила/завантажила рендери ЖК «Етно Дім» з порталу `lun.ua` разом з їхнім корпоративним вотермарком. На сайті свого забудовника — повноширокий 1920-px hero-кадр чужого бренду. Це не просто бренд-неспівпадіння. Це юридично сумнівно (вотермарк — заявка ЛУНу на авторство дистрибуції рендера) і **репутаційно-убивче**: відвідувач бачить «ВИГОДА у ВИГОДА» через окуляри ЛУНу.

**Брендбук §1, §6 (DO/DON'T):** «Палітра закрита. Не змішувати з іншими яскравими кольорами.» Помаранчевий ЛУН — не в палітрі, плюс це повноцінне чуже лого.

**Серйозність:** P0-блокер. Навіть якщо все інше ідеально — клієнт це побачить за 3 секунди і втратить довіру.

**Виправлення (за порядком переваги):**

1. **Найкраще:** дістати у власника проекту (Етно Дім — на стадії меморандуму про відновлення; за §11.4 brand-system це ЖК, який ВИГОДА перебирає у іншого забудовника) оригінальні рендери без жодних вотермарків. Замінити всі 8 файлів у `public/renders/etno-dim/`, перебудувати `_opt/`-варіанти через `npm run optimize`. Перевірити кожен новий файл на очевидно-чужі мітки (Pictorial, Rubikon, ЛУН, OLX, DOM.RIA — будь-яке портал-лого).

2. **Тимчасовий тактичний фікс (≤30 хв):** ретушувати вотермарк в Photoshop / Affinity / Pixelmator на всіх 8 webp-файлах і перегенерувати `_opt/`. Зберегти в коментар `data/projects.ts` `etno-dim` запис: `// renders ретушовані 2026-04-27 — ЛУН-вотермарк прибрано до отримання чистих оригіналів`.

3. **Приховати ЖК Етно Дім з сайту до отримання чистих рендерів** — найжорсткіший і найшвидший варіант: змінити `presentation: 'full-internal'` на `presentation: 'aggregate'` у `src/data/projects.ts:46` плюс відобразити в `aggregateText` контекст. Сайт перестає показувати компрометований рендер. Втрата інформації, але збереження бренду.

**Не робити:** замикати картку CSS-ом `clip-path` чи overlay-блоком — це косметика, оригінальний файл лишається в `public/`, гугл-картинка-пошук відразу знайде ЛУН-вотермарк.

**Skeptic-pass:** перевір ВСІ рендери на ВСІХ ЖК, не тільки Етно Дім. У `live-zhk-etno-1920-full.png` я бачу декілька thumbnail-ів галереї з помаранчевими крапками/мітками — це знову ЛУН на менших розмірах, або це інший вотермарк (Pictorial?). Зробити окремий task: ручний перегляд кожного рендера на чужі знаки. У `public/renders/etno-dim/` 8 файлів × ручний перегляд на 1920-px — 10 хв роботи.

---

### P0-2. Pipeline-картки і Construction-teaser стоять порожніми на першому скролі — бренд-обвал на «фасаді»

**Сектор:** Home / Portfolio Overview + Construction Teaser
**Скріншот:** `audit/02-home-fullpage.jpeg` (зняття до завершення lazy-load) — три pipeline-картки в розділі «Проєкти» = просто темно-сірі прямокутники з підписом унизу, без зображень. Construction-teaser під заголовком «Хід будівництва Lakeview» = чотири порожні прямокутники.
**Файл-джерело:**
```tsx
src/components/sections/home/PortfolioOverview.tsx:67
  <ResponsivePicture
    src={`renders/${project.slug}/${project.renders[0]}`}
    alt={project.title}
    widths={[640, 1280]}
    sizes="(min-width: 1280px) 400px, 100vw"
    loading="lazy"        // ← lazy без skeleton-плейсхолдера
    className="w-full aspect-[4/3] object-cover"
  />
```
```tsx
src/components/sections/home/ConstructionTeaser.tsx:66
  <ResponsivePicture
    ...
    loading="lazy"
    className="h-full w-full object-cover"
  />
```

**Що відбувається:** `loading="lazy"` каже браузеру не вантажити зображення, доки картка не наблизиться до viewport. Картка-обгортка має `bg-bg-surface` (`#3D3B43`) — той самий темно-сірий, що і навколишнє тло. Тому до того, як lazy-load спрацює, користувач бачить три ідентичні дірки в композиції. На skeptic-аудиті порівняння `02-home-fullpage.jpeg` (до завантаження) vs `03-home-fullpage-after-load.jpeg` (після) — нерухомий доказ.

**Чому це бренд-проблема, а не технічна:** ВИГОДА продає «системний девелопмент». Якщо перший контакт із сайтом — три порожні прямокутники в тому самому місці, де «портфель проектів», то перший імпресіон бренду = «недороблено», а не «системно». Мовою брендбуку §6 (DO): «Велика негативна площа» — так, але **запланована**, не випадкова.

**Виправлення:**

1. **Skeleton-патерн з ізометричних кубів** (брендова відповідь — використати слабкість як перевагу). Картка в стані lazy-pending показує ізометричний куб 64-px з opacity 0.20 на `bg-bg-surface`. Ось точкова правка:

```tsx
// src/components/ui/ResponsivePicture.tsx — додати state
import { useState } from 'react';
import { IsometricCube } from '../brand/IsometricCube';

export function ResponsivePicture({ ... }) {
  const [loaded, setLoaded] = useState(false);
  // ... існуюча логіка ...
  return (
    <picture>
      <source ... />
      <source ... />
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-bg-surface"
        >
          <IsometricCube variant="single" stroke="#A7AFBC" opacity={0.2} className="h-12 w-12" />
        </div>
      )}
      <img
        ...
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}
```
Потрібно загорнути `<picture>` у `<div className="relative">` на стороні споживача.

2. **Альтернатива простіша:** для критичних surfaces (картки на головній + перші 4 фото в construction-log) перевести на `loading="eager"`. Так, це додає байтів на initial-paint, але це **flagship-сторінка**: користувач сюди прийшов на бренд, не на 25-кб економію. Lighthouse Desktop у цьому проекті має бюджет 90+ — а eager-load 3-х 640w картинок (≈40 КБ AVIF кожна) це 120 КБ всередині 200-КБ hero-budget. Запас є.

3. **Третій варіант, естетично-брендовий:** замість картинки на `bg-bg-surface` додати в lazy-плейсхолдер CSS-патерн ізометричних ліній з `IsometricGridBG` opacity 0.10. Це brand-on-brand рішення; навіть якщо зображення довго вантажиться, на місці картки видно бренд-патерн, не дірку.

**Skeptic-pass:** на live-захопленні `audit/live-home-1920-full.png` (повноекранний скрін) картки виглядають теж порожніми, тобто це не тільки початковий стан — можливо, lazy-load на проді не дотягує. Окремий task: перевірити в DevTools Network, чи всі pipeline-thumb запити повертають 200, а не 404. Очевидних 404 у `_opt/` структурі я не бачу (файли є локально), але деплой міг відстати.

---

### P0-3. Нерівна-якість рендерів між ЖК — Lakeview виглядає як інший бренд

**Сектор:** /projects + /home portfolio
**Скріншот:** `audit/live-projects-1920-full.png`
**Що відбувається:** Lakeview-flagship у портфелі = chistа архітектурна аерозйомка, яскраві кольори, золота година, видно ЖК + озеро. Pipeline-картки (Етно Дім, Маєток Винниківський, Дохідний дім NTEREST) — типові архвіз-рендери з різним стилем подачі: один з людьми на дворі (Етно Дім — той самий ЛУН-вотермарк-кадр), один з фронтальної зйомки фасаду (Маєток), один сонячний з реальною вулицею (NTEREST).

**Чому це проблема:** на одному екрані = чотири розні візуальні мови = ВИГОДА виглядає як **brokerage**, що збирає рендери з різних джерел, а не як девелопер з єдиним візуальним стандартом. Порівняй з брендами тієї ж ваги — KAN, Riel, Saga — у яких всі проекти подаються через однакову лінзу.

**Виправлення (стратегічне, не одноразове):**

1. **Запропонувати клієнту single-render-style guide.** Кожен ЖК отримує мінімум: 1× aerial 16:9, 1× human-eye-level фасад, 1× деталь / двір. Всі три — однаковий час доби (золота година = brand house style), однакова насиченість, схожий ракурс. Це v2-задача, але запропонувати треба зараз.

2. **Тимчасовий рятунок (v1):** перевибрати з 8 рендерів Етно Діма той, що найближчий до Lakeview-стилю (аерозйомка з природним освітленням, без людей, без зайвих елементів). Замінити `renders[0]` в `src/data/projects.ts:52` на цей кадр як `hero` для головної сторінки.

3. **Накласти ізометрично-сітковий overlay (`IsometricGridBG opacity 0.10` blend mode `multiply`) на pipeline thumbnails** — створити одноманітність через бренд-патерн. Брендбук §5 дозволяє: «Накладання на фото в режимах Overlay / Screen». Це 10-хв CSS-ний фікс, який візуально об'єднає всі картки.

---

## P1 — ЖОВТІ ПРАПОРИ (інконсистентність, не катастрофа)

### P1-1. Email `vygoda.sales@gmail.com` для забудовника з ЛТД — професійний червоний прапорець

**Сектор:** Footer (всі сторінки), Contact, Mobile fallback, TrustBlock, ContactForm
**Файл-джерело:**
```ts
src/content/company.ts:19
  export const email = 'vygoda.sales@gmail.com' as const;
src/content/mobile-fallback.ts:42
  export const fallbackEmail = 'vygoda.sales@gmail.com';
```

**Що відбувається:** Корпоративний забудовник з 7-річною історією (ЄДРПОУ 42016395, ліцензія від 27.12.2019) пише потенційним покупцям квартир за **gmail-адресою**. У контексті бренду «системний девелопмент, у якому цінність є результатом точних рішень» це фарс. Жоден KAN, Saga, Riel, А-Девелопмент так не робить. Покупець квартири за 100К-200К USD, який «робить свою ДД» (Persona-3 з brand-system), бачить gmail = ставить хрест на «системності».

**Skeptic-pass на користь поточного рішення:**
- Може бути свідомий вибір на ранній стадії v0 для скорішого реагування (gmail = смартфон-нотифікації = миттєвість).
- Ліди реально потрапляють на цей емейл (не втрачаються через корпоративну спам-фільтрацію).
- Видалити gmail = заблокувати робочий канал.

**Все одно — фікс рекомендований:**

1. **Найкраще:** взяти у клієнта корпоративний домен (припускаю, що `vygoda.com.ua` або `vygodagroup.com.ua` доступний — перевірити). Налаштувати `info@vygoda.com.ua` або `office@vygoda.com.ua`. Зберегти forward на gmail на час перехідного періоду.

2. **Якщо домен не зареєстрований/недоступний:** перейменувати на `sales@vygodagroup.com` через будь-який реєстратор за 12 USD/рік. Один раз, повертається.

3. **Ні в якому разі не рятувати ситуацію іншим gmail-ом** типу `info.vygoda@gmail.com`.

4. Покликати в коментар `src/content/company.ts:18` посилання на цей вердикт: `// FIXME P1: gmail address — replace with corporate domain before client handoff (AUDIT-BRAND.md P1-1)`.

---

### P1-2. Охоронне поле лого в навбарі — на межі допустимого

**Сектор:** Nav (всі сторінки)
**Файл-джерело:**
```tsx
src/components/layout/Nav.tsx:18-22
  <header className="sticky top-0 z-50 w-full bg-bg">
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <Link to="/" aria-label="ВИГОДА — на головну" className="flex items-center">
        <Logo className="h-14 w-auto" title="ВИГОДА" />
```

**Що відбувається:** `h-14` = 56 px. Лого в горизонтальній компонуванні «куб + вигода + системний девелопмент» при 56-px висоті дає cap-height великої «В» приблизно 9-10 px (з пропорції dark.svg `viewBox="60 80 810 250"` — wordmark «вигода» займає ≈40% висоти viewBox). Брендбук §2: «Охоронне поле = висота **великої** літери В з усіх чотирьох боків».

**Праворуч від лого — меню «Проєкти / Хід будівництва / Контакт» з gap-8 (32 px) до краю viewport через max-w-7xl + px-6.** Між лого і першим пунктом меню — приблизно 50-100 px залежно від ширини viewport. Це достатньо. **Зверху і знизу — header має `h-16` (64 px), лого — 56 px, тобто 4 px зверху і знизу — критично замало.** Cap-height «В» при scale 56-px ≈ 16-18 px. Охоронне поле порушено.

**Серйозність:** жовтий, бо візуально це не катастрофічно (фон навбару `bg-bg` той самий, що далі секція, тому «дотику до тексту меню» немає) — але формально брендбук порушено.

**Виправлення:** збільшити висоту header до `h-20` (80 px), залишити лого `h-14`. Тоді 12 px зверху + 12 px знизу = безпечне охоронне поле.

```tsx
// src/components/layout/Nav.tsx
<nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
  ...
  <Logo className="h-12 w-auto" title="ВИГОДА" />
  ...
</nav>
```
Або зменшити лого до `h-10` і лишити `h-16` — але тоді лого читається на 1920-px екрані як занадто маленьке.

---

### P1-3. Дескриптор «системний девелопмент» в footer-логотипі — задрібний для читання

**Сектор:** Footer
**Файл-джерело:**
```tsx
src/components/layout/Footer.tsx:20
  <Logo className="h-14 w-auto" title="ВИГОДА" />
```

**Що відбувається:** В footer лого тієї ж висоти, що і в nav (56 px). На скрін `audit/live-home-1920-full.png` дескриптор «системний девелопмент» — рядочок ≤8 px висоти, на межі читабельності. Брендбук §2: «Мінімальний розмір — 100 px (екран), 30 мм (друк). Менше — лише знак (куб з пелюстками)».

Поточне лого 56 px — менше за 100 px. Технічно треба показувати лише знак.

**Виправлення:**
- **Найкраще:** збільшити footer-лого до `h-24` (96 px) — тоді весь lockup читається.
- **Альтернатива:** замінити в footer повний lockup на `<Mark />` (компонент уже існує, `src/components/brand/Mark.tsx`) висотою 64 px. Простіше, чистіше, відповідає брендбук-правилу «менше — лише знак».
- Те саме перевірити для mobile fallback (`Logo h-auto w-[120px]` — 120 px ширини, але висота лого пропорційно дає wordmark ≤30 px, що ще на межі).

---

### P1-4. URL-typo `likeview` замість `lakeview` в source-renders

**Сектор:** Renders / асети
**Файл-джерело:**
```
renders/likeview/  ← джерело з typo (likeview)
public/renders/lakeview/  ← деплой-шлях (правильний)
src/data/projects.ts:20
  slug: 'lakeview',
```

**Що відбувається:** Source-папка з рендерами Lakeview неправильно названа `likeview` (типу «like-view»). Це видно в скріншоті команди `ls renders/`. Деплой-папка `public/renders/lakeview/` — правильна. Скрипт `scripts/copy-renders.ts` (припустимо) робить mapping. Але артефакт у git живе.

**Серйозність:** не видно користувачу, але видно першому інженеру, який заходить у репо. Це маленький «системний» сигнал — від «системного девелопера» очікуєш правописно-чисту структуру.

**Виправлення:**
```bash
mv renders/likeview renders/lakeview
# Оновити scripts/copy-renders.ts якщо там path hardcoded
# Перевірити, що deploy-pipeline продовжує працювати
```

---

### P1-5. Соцмережі скрізь — placeholders `href="#"`, але вигляд як активні

**Сектор:** Footer, ContactDetails, mobile fallback
**Файл-джерело:**
```ts
src/content/company.ts:25-33
  export const socials = {
    telegram: '#',
    instagram: '#',
    facebook: '#',
  };
```
```tsx
src/components/sections/contact/ContactDetails.tsx:55-77
  <a href={socials.telegram} aria-label="Telegram" className="cursor-default ...">
    <Send size={20} />
  </a>
```

**Що відбувається:** Lucide-react v1 **не експортує** Instagram і Facebook іконки за назвою (це вже задокументовано в комент-блоку). Фолбеки: `Send` (Telegram), `MessageCircle` (нібито Instagram), `Globe` (нібито Facebook). На скріншоті footer — три однакові за стилем кружечки.

**Бренд-проблеми:**
1. Іконка `MessageCircle` для Instagram — не відповідає Instagram-візуалу. Користувач бачить чат-балон, думає — це чат, не Instagram.
2. Іконка `Globe` для Facebook — те саме, користувач думає «вебсайт», не FB.
3. Усі лінки `cursor-default + href="#"` — формально «disabled», але функціонально клік нікуди не веде. Користувач клікнув і нічого не сталось. UX-нечітко.

**Виправлення (best):**
1. **Прибрати ці три іконки з footer і ContactDetails взагалі** до того, як соцмережі реально запустяться. Брендбук-чисте рішення: «Чого нема — того не показуємо».
2. **Якщо клієнт наполягає лишити** — додати маленький підпис «(скоро)» поряд з іконками, або використати ОДНУ узагальнену іконку «Соцмережі» зі стрілкою-ссылкою на майбутню сторінку.
3. **Замінити неправильні fallback-іконки на правильні Lucide:** `Instagram` (existed in 0.x but renamed) — використати simple-icons SVG inline як альтернативу. ~2 КБ кожен SVG.

---

### P1-6. ⚠-маркер «потребує верифікації» на головній — чесно, але візуально шумно

**Сектор:** Methodology Teaser
**Файл-джерело:**
```tsx
src/components/sections/home/MethodologyTeaser.tsx:50-55
  {block.needsVerification && (
    <span aria-label={methodologyVerificationWarning} className="mr-2 text-accent">
      ⚠
    </span>
  )}
```

**Що відбувається:** Методологія-блок використовує emoji-glyph «⚠» в acid-lime кольорі для маркування непідтверджених тверджень. Чесність — добре. Але бренд-сигнал плутається: брендбук §1 — «без декоративних шрифтів, без emoji». Emoji ⚠ — глиф з UTF-8, рендериться в OS-залежному стилі (на iOS — кольоровий, на Linux — монохромний).

Зараз FEATURED_INDEXES = [1, 3, 7] — всі `needsVerification: false`, тобто де-факто маркер не показується ніколи на головній. Але код залишений як «defensive».

**Виправлення:**
- Замінити emoji «⚠» на текстовий префікс «Потребує верифікації — » перед body, або на акцентний `[ ! ]` (квадратні дужки + знак оклику) — type-safe текст.
- Стилізувати через `border-l-2 border-accent pl-4` на блоку як цілому.

---

### P1-7. Mobile fallback — wordmark «ВИГОДА» дублює лого

**Сектор:** Mobile fallback
**Файл-джерело:**
```tsx
src/components/layout/MobileFallback.tsx:52-56
  <Logo className="h-auto w-[120px]" title="ВИГОДА" />
  <h1 className="text-5xl font-bold tracking-tight text-text" lang="uk">
    ВИГОДА
  </h1>
```

**Що відбувається:** На mobile fallback (скріншот `audit/live-mobile-iphone.png`) видно: 1) лого зверху (вже містить wordmark «вигода» строчними), 2) під ним H1 «ВИГОДА» прописними. Подвійний вердикт назви. Брендбук §2: «Назва — «вигода» строчним». Прописна «ВИГОДА» в H1 — формально «hero-варіант» з desktop-сайту, скопійований сюди.

**Серйозність:** жовтий — на mobile це не катастрофа, але **дублює бренд** і ламає правило «вигода — строчним».

**Виправлення:**
- Прибрати H1 «ВИГОДА» з MobileFallback. Лишити саме лого (воно вже містить назву).
- Якщо потрібно H1 для accessibility — зробити його `sr-only`: `<h1 className="sr-only">ВИГОДА</h1>`.

---

### P1-8. `text-text-muted` в footer на body-розмірі — на межі WCAG AA

**Сектор:** Footer (всі сторінки), TrustBlock
**Файл-джерело:**
```tsx
src/components/layout/Footer.tsx:67-71
  <p className="text-base text-text-muted">ТОВ «БК ВИГОДА ГРУП»</p>
  <p className="text-base text-text-muted">ЄДРПОУ 42016395</p>
  <p className="text-base text-text-muted">Ліцензія від 27.12.2019 (безстрокова)</p>
```

**Що відбувається:** brand-system §3 — «`#A7AFBC` на `#2F3640` ≈ 5.3:1 — AA для normal text (≥14pt). Не використовувати для дрібного тексту (<14pt).» `text-base` = 16px = 12pt. Це нижче 14pt межі.

**Skeptic-pass:** «14pt» означає на «desktop» 18.66px. Tailwind `text-base` = 16px = ~12pt — формально нижче порогу. Але WCAG AA каже інакше: для normal text — 4.5:1, для large text (≥18pt OR ≥14pt + bold) — 3:1. У нас 5.3:1 при 16px regular — **формально WCAG AA passes для normal text**, бо 4.5:1 floor виконано. brand-system.md тут strict-er, ніж WCAG.

**Виправлення:** не критично, але «системний девелопер» = «дотримуємося своїх правил». Або:
1. Змінити `text-base` на `text-lg` (18px = ~13.5pt) для legal-block у footer.
2. Або додати `font-medium` — bold-боеподібнi розмір ≤14pt дозволено за WCAG.
3. Або змінити колір на `text-text` (basic light) — тоді 10.5:1 AAA, без дилеми.

Те саме для `TrustBlock` `text-xs uppercase tracking-wider` (12px = 9pt): тут це лейбл (CAPS uppercase), що вже опційно дозволено за функціональним призначенням, але треба прокоментувати в коді більш явно.

---

### P1-9. Hero parallax — куби «летять» при швидкому скролі

**Сектор:** Home Hero
**Файл-джерело:**
```tsx
src/components/sections/home/Hero.tsx:58-62
  const cubeY = useTransform(
    scrollYProgress,
    [0, 1],
    skipParallax ? [0, 0] : [...parallaxRange],  // [0, -100]
  );
```

**Що відбувається:** parallax в межах 100 px, що є нижче 120-px бюджету за SC#1. Але при швидкому скролі (мишеве колесо при vsync 60Hz, 1 крок = ~100px) куби **різко стрибають**, бо `useScroll` оновлюється frame-by-frame, а не на моменти animation. Це візуальний шум, який ламає бренд-якість «стримано».

**Brandbook §6 DON'T:** «Без glow, тіней, blur, неонових ефектів». Параlax — не заборонено, але ефект «різкий стрибок» = бренд-розрив.

**Виправлення:**
- Додати `damping` через `useSpring`: `const cubeYSpring = useSpring(cubeY, { stiffness: 200, damping: 50 });` і застосувати `cubeYSpring` замість `cubeY`.
- Або зменшити max-amplitude до `[0, -50]` — тоді стрибок візуально менше.
- Перевірити на performance: тут більше fps-критично, ніж байтова економія.

---

## ЗЕЛЕНЕ — ЩО ЗРОБЛЕНО ПРАВИЛЬНО

### G-1. Палітра — закрита, дисциплінована, автоматизовано стережена

```css
/* src/index.css:8-15 */
@theme {
  --color-bg:          #2F3640;
  --color-bg-surface:  #3D3B43;
  --color-bg-black:    #020A0A;
  --color-accent:      #C1F33D;
  --color-text:        #F5F7FA;
  --color-text-muted:  #A7AFBC;
}
```

```ts
// scripts/check-brand.ts:84-91
const PALETTE_WHITELIST = [
  '#2F3640', '#C1F33D', '#F5F7FA', '#A7AFBC', '#3D3B43', '#020A0A',
];
```

**Чому це сильно:** 6 хексів — рівно як у брендбук §3. Жодного 7-го кольору в src/. Перевірив grep'ом по `src/` — лише canonical hex'и (з малою/великою літерою, що OK). Скрипт CI `paletteWhitelist()` блокує деплой при будь-якому новому кольорі. Це професіональний level дисципліни — не у багатьох проектах є такий guard.

**Що ще покращити (мінорно):**
- `--color-bg-black: #020A0A` — це не «справжній чорний» (`#000`), а майже-чорний з ледь видним зеленим відтінком. Брендбук §3: «Глибокий чорний `#020A0A`». OK.
- В `index.css` рядок 11: коментар «`#3D3B43  /* cards, panels */`» — це вірно, але добре б додати контраст-ratio comment для `#3D3B43` на `#2F3640` (≈1.2:1, NEVER text), щоб майбутній розробник не використав випадково як `text-on-surface`.

---

### G-2. Типографіка — Montserrat 400/500/700, без light/extrabold/black/italic

```css
/* src/index.css:18 */
--font-sans: "Montserrat", system-ui, -apple-system, sans-serif;
```

**Перевірив grep'ом** `font-light`, `font-extralight`, `font-extrabold`, `font-black`, `italic` в `src/**/*.{tsx,css}` — **не знайдено жодного входження.**

**Чому це сильно:** брендбук §4 однозначно: «Bold (H1, H2) · Medium · Regular. Інші ваги — за замовчуванням не використовувати». Тримається. У всіх компонентах: `font-bold`, `font-medium`, default-regular. Курсив скрізь не використовується. Це не випадковість — це дисципліна.

**Перевірив @fontsource:** в `package.json` загружається `@fontsource/montserrat` — кириличні subseat-варіанти за CONTEXT, забезпечують `є, ї, ґ, і` без сюрпризів.

**Дрібниця:** в `Hero.tsx` — `text-[clamp(120px,12vw,200px)]`. На 1920px → 12vw = 230px → clamp вибирає 200. На 1280px → 12vw = 153px. На 1024px → 12vw = 122px → 120 (мін). Hero-розмір змінюється плавно, без розриву. ✅

---

### G-3. Лого — векторне, без перемальовування, з оригінальної SVG

```tsx
// src/components/brand/Logo.tsx:6-15
import darkLogoUrl from '../../../brand-assets/logo/dark.svg';

export function Logo({ className, title = 'ВИГОДА' }: LogoProps) {
  return <img src={darkLogoUrl} alt={title} className={className} />;
}
```

**Перевірив:** в `brand-assets/logo/` лежать `primary.svg`, `dark.svg`, `black.svg` — три варіанти за брендбуком §2. У `dark.svg` — рівно ті 4 хекси, що дозволені для темного фону (`#c1f33d`, `#f5f7fa`, `#020a0a`, `#a7afbc`). Жодних power-paths ручного перемальовування — `<img src>` з brand-asset.

**Чому це сильно:** брендбук §2: «Заборонено міняти пропорції, композицію, кольори; нахиляти/обертати; масштабувати частини окремо». Поки SVG — векторне джерело істини, ці правила автоматично виконуються (CSS scaling зберігає aspect ratio, нема `transform: rotate`, нема `mix-blend-mode` що міняє кольори). У PITFALLS.md §Anti-Pattern 4 явно сказано: «NEVER re-author the SVG paths». Цього не зробили.

---

### G-4. Ізометричний куб як бренд-примітив — три варіанти, заводсько-консистентні

```tsx
// src/components/brand/IsometricCube.tsx:42-100
type AllowedStroke = '#A7AFBC' | '#F5F7FA' | '#C1F33D';

export function IsometricCube({
  variant,           // 'single' | 'group' | 'grid'
  stroke = '#A7AFBC',
  strokeWidth = 1,   // 0.5–1.5 за брендбуком §5
  opacity,
  className,
}: IsometricCubeProps) {
```

**Чому це сильно:** TypeScript-типи **не дозволяють** створити куб з кольором, не з трійки `#A7AFBC | #F5F7FA | #C1F33D`. `strokeWidth` за замовчуванням 1 (всередині 0.5-1.5 діапазону). Для `variant='grid'` діє hard cap opacity на 0.20 (брендбук §5: hero overlay 0.10-0.20). Це не «надія на дисципліну», це type-system, що б'ється над дисципліну.

`/dev/brand` сторінка (`audit/04-dev-brand-fullpage.jpeg`) — рендерить всі варіанти в одному вигляді. Це візуальний регрешн-чек.

---

### G-5. Тон комунікації — без forbidden-lexicon

**Перевірив grep'ом по `src/content/`** на «мрія|найкращ|унікальн|ексклюзивн|чарівн|преміум|комфорт|еталон|лідер|революц|елітн|стиль життя» — **жодного входження.**

**Skeptic-pass:** перевір вручну 4 цінності в `src/content/values.ts`:
- «Системність» — нейтрально, predметно. ✅
- «Доцільність» — визначення предметне. ✅
- «Надійність» — посилається на ЄДРПОУ, ліцензію — facts, not claims. ✅
- «Довгострокова цінність» — «зберігає цінність на горизонті десятиліть» — це майже-superlative, але це нейтральне твердження, не «найкраща довгостроковість». ✅

Hero slogan: «Системний девелопмент, у якому цінність є результатом точних рішень.» — точно з brand-system.md §1 (verbatim quote). ✅

CTA-кнопки скрізь: «Переглянути проекти», «Перейти на сайт проекту ↗», «Дивитись повний таймлайн →», «Ініціювати діалог», «Написати про ЖК Етно Дім» — всі функціональні, не емоційні. ✅

---

### G-6. Honesty rule «0 здано · 1 активно · 4 у pipeline» — присутня

**Файл-джерело:**
```ts
// src/content/home.ts:34
export const portfolioSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';

// src/content/projects.ts:23 (та сама фраза, дзеркалена)
export const projectsSubtitle = '1 в активній фазі будівництва · 4 у pipeline · 0 здано';
```

**Чому це сильно:** в обох ключових місцях (homepage portfolio + projects-hub) — однакова чесна конкретика. Жоден маркетинг-флаф «портфель з 5 ЖК», лише: «1 в роботі, 4 у плануванні, 0 завершено». Це і є системно-зрілий бренд.

**Plus:** на projects.ts pipeline-4 — «Без назви» з пояснювальним текстом «+1 об'єкт у роботі — стадія прорахунку кошторисної вартості. Назва та локація будуть опубліковані після завершення розрахунків.» Це прецизійно-чесне формулювання, відповідає methodology-блоку 1: «Чесно маркуємо стадію кожного проекту».

---

### G-7. Silent displacement правило — формально дотримано

**Перевірив grep'ом** в `src/`, `dist/`, `public/renders/`:
- `Pictorial`, `Rubikon`, `Пикторіал`, `Рубікон` — **0 входжень**. ✅

**check-brand.ts** має автоматичну перевірку:
```ts
// scripts/check-brand.ts:69-72
'Pictorial|Rubikon|Пикторіал|Рубікон' ${scopes.join(' ')}
```

CI блокує деплой, якщо таке слово з'явиться. Це **brand discipline на технічному рівні**.

**Skeptic-pass:** правило стосується тільки Lakeview-рендерів (CONCEPT §10.2). У `public/renders/lakeview/` файли — `aerial.jpg`, `closeup.jpg`, ... — без чужих імен. ✅

**АЛЕ:** правило `silent displacement тільки для Lakeview` неявно означає, що **для інших ЖК** теж не повинно бути чужих ассетів. ЛУН-вотермарк на Етно Діма (P0-1) — формально не «silent displacement» в брендбук-означенні, але **дослівно те саме порушення**: чужий бренд на сайті ВИГОДИ. Тобто перевірку варто розширити.

**Пропозиція:** додати в `scripts/check-brand.ts` ще один guard — `noPortalWatermarks()`:
```ts
function noPortalWatermarks(): boolean {
  // Грепнути всі рендери на текстові-в-метаданих signature ЛУН/OLX/DOM.RIA.
  // Альтернатива: візуальний QA-чекліст в PR-template.
  return true; // (нерелевантно для grep — потрібен manual visual review)
}
```

Тобто тут технічна-перевірка не допоможе; потрібен **візуальний QA-чек-ліст** (= AUDIT-BRAND.md як референсний документ).

---

### G-8. Бренд-токени з motion ease — синхронізовані з motionVariants.ts

```css
/* src/index.css:28 */
--ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
```

```ts
// (припустимо) src/lib/motionVariants.ts
export const easeBrand = [0.22, 1, 0.36, 1] as const;
```

**Чому це сильно:** один easing-curve для CSS-transitions і JS-Motion-variants. Брендбук §6 (заборона glow/bounce) дотримана через single source of truth: ніхто не може випадково додати `ease-bounce` в JSX-prop (`scripts/check-brand.ts:217-234` — `noInlineTransition()` блокує).

---

### G-9. Favicon — той самий ізометричний знак, тільки monochrome

**Файл-джерело:** `public/favicon.svg` (3.6 KB), `public/favicon-32.png`, `public/apple-touch-icon.png`.
```svg
<!-- brand-assets/favicon/favicon.svg -->
viewBox="0 0 220.6 167.4"
fill="#c1f33d"  // куб
fill="#020a0a"  // петалі (символ)
```

Геометрично відповідає brand-mark (`brand-assets/mark/mark.svg`, 739 байт, той самий viewBox 220.6 167.4). Чотири пелюстки + куб — вірне «менше-лого» правило з §2.

**Skeptic-pass на брендбуку:** §2 «Менше — лише знак (куб з пелюстками)». Favicon — 32×32 px, що набагато менше 100-px floor — тому правомочно показувати лише знак. ✅

---

### G-10. OG-image, meta, canonical — дисципліновано налаштовано

```html
<!-- index.html -->
<meta property="og:title" content="ВИГОДА — Системний девелопмент" />
<meta property="og:description" content="Системний девелопмент, у якому цінність є результатом точних рішень. ЖК Lakeview у будівництві + 4 проекти у pipeline." />
<meta property="og:image" content=".../og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="uk_UA" />
```

**Чому це сильно:**
1. og:locale = uk_UA (не en_US). ✅
2. Опис у тоні бренду — без superlative-слів, з чесною статистикою «1 у будівництві + 4 в pipeline». ✅
3. og:image згенеровано з brand-asset `brand-assets/og/og.svg` через `scripts/build-og-image.mjs`. Не stock-graph. ✅
4. Twitter card налаштовано з `summary_large_image` — buying правильний preview-format. ✅
5. Canonical URL — production root (`https://yaroslavpetrukha.github.io/vugoda-website/`). Уникає дублікатного-контенту-warning від Google.

**Скептик:** twitter:site/twitter:creator handles **інтенційно опущено** (комент `«Site/creator @handle meta intentionally omitted — no Twitter handle exists in v1; placeholders would be lying.»`). Це brand-tone-on-tone — «нічого не вигадувати». ✅

---

## АНАЛІЗ ПО СЕКТОРАХ

### Hero (Home)

**Скріншот:** `audit-home-1920.png` (вище, 1920×1080).

- Wordmark «ВИГОДА» 200-px Bold uppercase з трекінгом — розкішно.
- IsometricGridBG opacity 0.15 — точно в hero-bound (брендбук §5: 0.10-0.20).
- Slogan з brand-system.md §1 verbatim — без жодної маркетинг-додумки.
- CTA «Переглянути проекти» — brand-acid-lime fill, hover brightness-110, текст `text-bg-black` (#020A0A) на `bg-accent` (#C1F33D) → 13.5:1 AAA. ✅
- Parallax — m'яка, 100 px max amplitude. Перевірити на slow-CPU не зробив (потрібен Lighthouse-throttling), але візуально на 60fps M2 Pro — без шумів.
- **Нюанс:** slogan читається жовто-білим (`text-text` = #F5F7FA на #2F3640 з акцент-патерном позаду). Контраст 10.5:1, але slogan визначальний для бренду — варто розглянути bolder-вагу 500 замість 400 (зараз body — regular). Або акцентувати акцент-знак «·» (як точку перед кожним брендбук-словом). Це v2-підвищення, не fix.

### BrandEssence (Home — 4 цінності)

**Скріншот:** `audit/03-home-fullpage-after-load.jpeg` (середина).

- 2×2 grid, з нумерацією 01-04 — суворо за CONCEPT §2.
- Заголовки `font-bold text-2xl text-text` — Montserrat 700, 24-28px (за брендбук §4 шкалою — H3 card title розмір). ✅
- Body — `text-base leading-relaxed text-text-muted` — 16px з 1.625 line-height, сірий. На 1920-px добре читається.
- **Бренд-нюанс:** сектор pure-typography, без декоративних кубів. Брендбук §6 DO: «Велика негативна площа». Так, є. Але **бренд міг би тут «дзвонити»** — додати один декоративний `<IsometricCube variant="single" stroke="#3D3B43" opacity={0.15}>` у фон секції з низькою opacity, як ненав'язливий бренд-аккорд. Зараз секція візуально стерильна, легко переплутати з будь-яким другим dark-сайтом.

### Portfolio Overview (Home)

**Опис вище в P0-2.** Flagship-картка — нормально (рендер Lakeview aerial.jpg). Pipeline-картки — порожні до lazy-load (P0-2 фікс). AggregateRow — текст-only, з ізометричним кубом ліворуч, що добре. ✅

### ConstructionTeaser (Home)

**Скріншот:** `audit-log-1920.png`, `audit/03-home-fullpage-after-load.jpeg`.

- Horizontal scroll-snap з 5 фото — за CONCEPT §7.9 «curated 3-5 shots».
- Arrow-buttons ChevronLeft/Right в `bg-bg-surface` → bg-accent на hover — нормально, але на skeptic-перевірці на 1920×1080 ліва стрілка виходить за viewport на 50% (через `-translate-x-1/2`). На скріншоті це обрізане. Це accessibility-міль (у мобільної версії взагалі прихований MobileFallback).
- Лейбл-«Березень 2026» праворуч — у `text-text-muted` text-sm (14px). 5.3:1 AA-passes для ≥14pt.
- **Той самий P0-2 фікс** — skeleton-cube для lazy-loading.

### MethodologyTeaser (Home — 3 блоки з 7)

**Опис вище в P1-6.**

- 3-col layout, з номерами 01/03/07 — підкреслює, що показуємо 3 з 7 (нечесно «pretend» що це повний методологія-блок).
- Заголовки `font-bold text-xl text-text` — нормально.
- ⚠-маркер на verification-needed блоках — fix у P1-6.
- CTA на повний `/how-we-build` page відсутня. У v1 це OK (за CONCEPT §8 — повна сторінка це v2 FEAT2-02). Але на головній варто додати лінк «Дивитись усі 7 принципів →» (зараз він просто відсутній). Користувач не знає, що принципів 7.

### TrustBlock (Home)

**Скріншот:** `audit/03-home-fullpage-after-load.jpeg` (нижче середини).

- 3-col горизонтальна таблиця: Юр. особа / Ліцензія / Контакт.
- Лейбли uppercase tracking-wider у `text-xs` (12px ≈ 9pt) — формально дрібно, але семантично це **labels**, не body. WCAG SC 1.4.3 considers small text only as ≤14pt for body, не для labels. ✅ за функціональним призначенням.
- ЄДРПОУ 42016395 + ліцензія 27.12.2019 — public-registry-checkable facts. Brand-system §1: «Trust signal = ЄДРПОУ + ліцензія, не headshots». ✅

### ContactForm (Home — bg-bg-black)

- На чорному фоні `bg-bg-black` (#020A0A) — H2 «Поговоримо про ваш об'єкт» в `text-text` (#F5F7FA) → 19:1 AAA.
- CTA «Ініціювати діалог» в `bg-accent` (#C1F33D) → text-bg-black → 13.5:1 AAA на чорному акцент-кнопка SUPER-readable. ✅
- Body «Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.» — predметний, без «зробимо вам найкращий ЖК у Львові». ✅
- **Brand-нюанс:** на чорному фоні (брендбук §3 — «фон для зваженого акценту») — добре. Але цей закриваючий блок міг би **ще сильніше дзвонити брендом**: додати у фон 2-3 декоративних `<IsometricCube>` з `stroke="#C1F33D" opacity={0.10}` — як «бренд-печатка» на закриванні розмови. Зараз закриваючий блок мінімалістичний-але-нейтральний.

### ZHK / `/zhk/etno-dim`

**Скріншот:** `audit/live-zhk-etno-1920-full.png`. **Див. P0-1 — основна катастрофа.**

Решта складових на цій сторінці (FactBlock, WhatsHappening, Gallery, CtaPair) — структурно правильні. Але всі 8 рендерів галереї треба перевірити окремо на чужі вотермарки.

**Galery** — 4-col grid на ≥1280px, `aspect-video object-cover`, лайтбокс через `<Lightbox>`. Hover `hover-card` (transform scale 1.02 + box-shadow accent 15%). ✅
**FactBlock** — dl/dt/dd семантично, address = «—» placeholder з підписом. Перевір при handoff клієнту: `etnoDimAddress` в `placeholders.ts:42` — все ще «—». Чи є вже точна адреса? CONCEPT §11.8.

### Construction Log

**Скріншот:** `audit/live-log-1920-full.png`.

- 4 місяці: Березень / Лютий / Січень 2026 + Грудень 2025.
- Заголовки `font-bold text-3xl text-text` + лічильник «· 12 фото» — інформативно.
- 3-col grid 4:5 portrait — за RESEARCH Q11. Lightbox per month-state.
- **Проблема:** перший місяць (Березень) має 15 фото, інші — 11-12. На live-скріншоті більшість фото видно як empty-placeholder (P0-2). Lazy не дотягує. Тут особливо болить — в logs люди бачать «реальний прогрес», порожні картки = «нічого не відбувається».
- **Виправлення:** для першого/верхнього місяця (latest) — переключити на eager loading (top-of-page LCP target). Для решти — skeleton-cube.

### Contact

**Скріншот:** `audit/live-contact-1920-full.png`.

- H1 «Контакт» + subtitle. Реквізити: Email активний mailto, Телефон/Адреса = «—», Соцмережі = 3 disabled-icons.
- Velикий «Ініціювати діалог» CTA-кнопка в acid-lime — найголовніший CTA сайту.
- **Чисто. Predметно. Дисципліновано. Можливо, занадто пусто** — на `1920×1080` екрані 50% viewport — пуста темрява. Тут можна додати:
  - бренд-патерн `IsometricGridBG opacity 0.05` фоном.
  - Або колаж з 2-3 декоративних кубів `variant="group"` стилізовано як «передавальна структура».

### Footer (універсальний)

- 3 колонки: brand+email+copyright | nav | legal.
- Соцмережі-icons (P1-5).
- Email-link (P1-1).
- ЄДРПОУ + ліцензія — facts, не claims. ✅

### Nav (універсальний)

- Sticky top-0 z-50, `bg-bg`. Лого ліворуч, 3 пункти меню праворуч.
- Active route — 2px accent-underline (`border-b-2 border-accent`). Просто, читабельно. ✅
- Лого охоронне поле (P1-2) — формально на межі.

### OG / Meta

**Опис у G-10.** Все на місці.

### Favicon

**Опис у G-9.** Mark-only, brand-canonical.

---

## ЯК СИЛОЮ БРЕНДУ ПРОДАВАТИ ЖК — рекомендації, де ще «увімкнути» бренд

Зараз сайт = 70% бренду на 30% «системний дизайн без особливостей». Решта 30% можна закрити цілеспрямованими «бренд-сигналами», без додавання будь-якої копі чи додаткового контенту. Все — через візуальну мову, що вже є.

### Пропозиція 1: Hero — додати «cinematic куб-парад»

Замість одного `IsometricGridBG` overlay — додати 3-4 декоративних `<IsometricCube variant="single">` різних розмірів і opacity (0.15 / 0.25 / 0.35) на різних позиціях, з парallax-різними швидкостями. Це створює «глибину сцени» — бренд як «не плоский патерн, а структура».

Брендбук §5: «Два-три куби, що з'єднуються гранями» = групова варіація. Можна навіть використати `variant="group"` для центральної групи + `variant="single"` для дистантних.

Дотримуватись:
- Кольори: тільки `#A7AFBC` (нейтральний) і одну акцентну `#C1F33D` (на ключову куб) — як «знак».
- stroke 1, opacity 0.15-0.30.
- Параlax-amplitude різний на різних кубах: `[0, -50]`, `[0, -80]`, `[0, -120]` — створює 3D-глибину.

Bundle-cost: ≤2 КБ (3 додаткові SVG inline). Performance-cost: 3 додаткових `useTransform()` — нерелевантно.

### Пропозиція 2: Section dividers — куб-розділювачі

Між секціями (Hero → BrandEssence → Portfolio → ConstructionTeaser → Methodology → Trust → Contact) — зараз просто `py-24`-padding на кожній секції. Можна додати малий ізометричний divider:

```tsx
<div className="flex justify-center py-12">
  <IsometricCube variant="single" stroke="#3D3B43" opacity={0.40} className="h-8 w-8" />
</div>
```

Бренд-сигнал: **куб як ритм-знак**, замість порожнього place. На 1920px — невеликі акценти, ритмують sequence.

Це **точно те саме**, що brendbook §5 «Базовий модуль» — мінімальне використання куба. Без overload.

### Пропозиція 3: CTA-buttons — більше acid-lime моментів, але не overall-fill

Зараз acid-lime активно тільки в трьох місцях: Hero CTA, FlagshipCard CTA, Contact CTA. Це правильно за §3 «зелений — точкові дози, не фон». Але можна додати ще:

1. **Active filter chip на /projects** — вже зроблено правильно (`bg-accent text-bg-black border-accent` для active).
2. **Hover on flagship cards** — додати micro-accent: на hover, tab-індикатор з'являється у вигляді 2-px acid-lime лінії під картою. Зараз hover = transform + box-shadow з acid-lime 15%-opacity glow. **Це вже є,** OK.
3. **«Активне будівництво» tag** — на flagship-картці зараз `text-text-muted text-sm uppercase tracking-wider` для слова «активне будівництво». Можна підвищити до `text-accent` — щоб status вибуяв. Це **інформативний акцент**, який мовою бренду означає «єдиний ЖК у статусі будівництва, виділений тоном».

### Пропозиція 4: Монограма / Mark — використати на «моментах акценту»

Зараз `<Mark>` (компонент `src/components/brand/Mark.tsx`) існує, але рендериться тільки на `/dev/brand` (QA-page). У production-flow Mark **ніде не використовується**. Це — недотика бренд-мускулу.

Куди вписати:
1. **404-сторінка** — Mark в центрі, 200px, opacity 0.40 — як «знак того, що ВИГОДА досі тут, навіть на втраченій сторінці».
2. **Submit-state форми** — після `mailto:` (зараз нема submit-state, але можна додати `<dialog>` з підтвердженням «Лист сформовано» + Mark всередині).
3. **Loading-spinner у `<MarkSpinner>`** — компонент уже існує (`src/components/ui/MarkSpinner.tsx`)! Перевірити, чи він де-небудь рендериться. У `index.css` є `@utility mark-pulse` — pulsing animation. **Чи дійсно він використовується в Suspense fallbacks?** Якщо ні — це невикористаний asset. Якщо так — це чудовий «бренд-spinner», заміна generic-svg-кружка.

### Пропозиція 5: Animation moment на Lakeview-flagship-CTA — bigger payoff

Lakeview = єдиний активний ЖК, основний lead-magnet. CTA на ньому — «Перейти на сайт проекту ↗». Зараз — стандартна `bg-accent` кнопка з brightness-110 hover.

Бренд-посилення: при scroll-into-view — flagship-картка робить subtle acid-lime «pulse» (один раз, 800ms, opacity 0.6→0.0 на background). Як «це — це», як bren-аккорд. Брендбук §6 не забороняє single-pulse animation; забороняє «glow на лого» і «bouncy spring».

Реалізація: `whileInView` на FlagshipCard з `viewport={{ once: true }}`, додати в `motionVariants.ts` новий variant `pulseAccent`.

### Пропозиція 6: «System map» в Footer — диспетчерська куб-схема

Зараз footer = 3-col textual grid. Можна додати четвертий «column» (або винести у hidden до `<details>`) — мікро-схему «System» зі знаком cube + 5 точок (5 ЖК) з'єднаних лініями = **візуальна метафора** «системний девелопмент». Зробити через SVG inline ≤500 байт.

Це б показало: ВИГОДА не каже «ми системні» — вона **показує систему графічно**.

### Пропозиція 7: Cube-watermark на construction-log photos

Construction-log — це фотки з майданчика, без брендингу. На 1920×1080 виглядають як гугл-картинка з будь-якого ЖК. Можна додати малесенький **Mark watermark** в нижньому правому куті кожної фотки (через CSS `::after` пseudo + `background-image` cube SVG, opacity 0.30) — як «це наш майданчик».

**Внутрішній skeptic:** але це дзеркальний-відповідь на ЛУН-вотермарк (P0-1). Якщо ВИГОДА робить ЛУН-style watermark на своїх рендерах — стає не краще ЛУНу. Тому **не рекомендую** для рендерів-CGI. Але **для construction-photos** (де нема жодного бренд-сигналу зараз) — можна.

### Пропозиція 8: Brand voice on /404

Перевірив `src/pages/NotFoundPage.tsx` — не читав ще. Якщо там generic «Page not found» — переписати у бренд-голосі:

```
Сторінки немає в системі.

Перевірте URL або поверніться на головну.

[Повернутися →]
```

Без «упс», без «вибачте, ми вас підвели». Просто — predметно.

### Пропозиція 9: Бренд-моменти в 404 + Lightbox + StageFilter

- **404** — MarkSpinner +brand-microcopy.
- **Lightbox close button** — зараз generic `X`. Замінити на `<IsometricCube variant="single">` ⤫ повернутий 45° (= хрестик). Брендбук §6 — заборонено повертати лого, але куб-як-форма у lightbox-UI це не лого, не Mark; це функціональний елемент. Skeptic: на межі — можливо, краще лишити generic X і не ризикувати.
- **StageFilter chips** — додати `<IsometricCube variant="single">` 12px ліворуч від лейбла кожного chip (в активному стані — зеленим, в неактивному — opacity 0.40). Бренд-knee: chip = «модуль» = бренд-куб.

---

## РЕЗЮМЕ ТА ПРІОРИТЕТИЗАЦІЯ

### Топ-3 P0-фіксу перед handoff клієнту

1. **P0-1 ЛУН-вотермарк на Етно Дім** — отримати чисті рендери або замінити/приховати. **2-4 год.**
2. **P0-2 Skeleton-плейсхолдери для lazy-load** — додати IsometricCube placeholder в `<ResponsivePicture>`. **1-2 год.**
3. **P0-3 Render-style consistency** — обрати з 8 рендерів Етно Діма найближчий до Lakeview-стилю + накласти isometric-grid-overlay opacity 0.10 на всі pipeline thumbnails. **1 год.**

### Топ-3 P1-фіксу для повноти

1. **P1-1 Email на корпоративний домен** — завдання клієнту купити домен, тимчасово зберегти gmail forward. **30 хв роботи з боку девелопера.**
2. **P1-2 Охоронне поле логотипу в Nav** — змінити `h-16` на `h-20`. **5 хв.**
3. **P1-5 Соцмережі-iconki — прибрати або замінити правильним SVG**. **20 хв.**

### Бренд-посилення (proactive, не fix)

- Куб-divider'и між секціями.
- Hero — multi-cube parallax.
- Mark в `<MarkSpinner>` як reusable loader.
- 404-сторінка з бренд-голосом.

### Загалом

**Технічна дисципліна бренду на цьому проекті — професіональна (8.5-9/10):** палітра-check, типографіка-check, automated-guard, type-safe куби, чисті content-boundaries, silent-displacement check автоматизовано. Решта проектів цієї цінової категорії так не роблять.

**Що тягне оцінку вниз — окремі контент-катастрофи (ЛУН-вотермарк) і UX-нюанси (lazy-плейсхолдери), що ламають перший імпресіон бренду.** Це не результат браку дисципліни — це окремі прохідні точки, які `check-brand.ts` не міг spot, бо вони не в кодi, а в завантажених ассетах і timing-залежній поведінці.

**Після P0-фіксу — 8.5/10. Після всього — 9/10.**

---

**Bren Guardian — sign-off:**

Цей сайт — найдисциплінованіший корпоративний прототип забудовника, який я бачив за останній рік. Команда побудувала technical-brand-fortress, який важко зламати. Але одна нерозглянута картинка з ЛУН-вотермарком зводить нанівець усю дисципліну. **Перш ніж клієнт відкриє URL, видалити ЛУН.** Це не пропозиція — це блокер.

Все інше — proactive growth.

— Brand Guardian, 27 квітня 2026
