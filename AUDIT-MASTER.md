# AUDIT-MASTER · Зведений вирок сайту ВИГОДА

**Об'єкт:** `https://yaroslavpetrukha.github.io/vugoda-website/`
**Дата аудиту:** 2026-04-27
**Стек:** Vite 6 + React 19 + Tailwind v4 + Motion 12 + react-router-dom 7 (HashRouter), GitHub Pages
**Контекст:** клікабельний desktop-MVP, який має бути переданий клієнту як URL і виглядати «ахуєнно» на 1920×1080
**Аудитори:** UI Designer · Brand Guardian · Growth Hacker · UX Researcher · Content Creator · Frontend Developer (motion)

---

## 1. Один абзац для тих, хто не читає далі

Сайт **НЕ готовий** до передачі клієнту в поточному стані. Інженерний фундамент — професійний (бренд-токени, type-safe куби, automated `check-brand.ts`, RM threading, ≤200KB JS-бюджет дотримано). Але візуальний результат — це **бутстраповий темплейт у стриманій палітрі**, не премʼюм-сайт забудовника. На сайті сидять **3 P0-катастрофи** (вотермарк «ЛУН» на хіро-рендері Етно Дім, gmail для лідів за 1.5–5 М грн, телефон/адреса = «—»), які **самі по собі вбивають довіру** ще до того, як хтось оцінить дизайн. Без їх усунення URL віддавати клієнту небезпечно — він прийде і побачить «це шахрайська заглушка».

**Зведений verdict: 5.0 / 10.** Після 8 годин P0-роботи реалістично 7.0/10. Після P0+P1 за 4–6 тижнів — 8.5/10. Шлях зрозумілий, ціна доступна, але потрібно зупинити «деплой-як-є» і пройти санітарний цикл.

---

## 2. Зведена scorecard (6 вимірів)

| Вимір | Score | Auditor verdict | Файл |
|---|---|---|---|
| **Сучасність дизайну** | **4/10** | «Бутстраповий темплейт у стриманій палітрі. Hero — flat centered wordmark. 4 з 5 сторінок без imagery. Жодних display-моментів окрім гіганта «ВИГОДА».» | [AUDIT-DESIGN.md](./AUDIT-DESIGN.md) |
| **Бренд** | **6.5/10** *(→ 8.5 після P0)* | «Технічний фундамент 9/10. Але P0: вотермарк ЛУН на хіро Етно Дім; порожні pipeline-картки; нерівний стиль рендерів.» | [AUDIT-BRAND.md](./AUDIT-BRAND.md) |
| **Продажність** | **2/10** | «Дизайнерська довершеність + продажна імпотенція. Funnel-leak 99.5–99.7%. Mailto на gmail = 0.3% CR проти потенційних 1.8–2.5%.» | [AUDIT-SALES.md](./AUDIT-SALES.md) |
| **UX** | **7.0/10** | «Сильний бренд-каркас, слабкі UX-нюанси. 5 P0: HashRouter, mobile cutoff, «—» на телефоні, `<a href="#">`, лейк-рідірект. Готовність до handoff — 70–75%.» | [AUDIT-UX.md](./AUDIT-UX.md) |
| **Копірайт** | **6/10** | «Forbidden-lexicon дотримано на 100%. Але слоган обертається у собі, CTA в трьох регістрах одночасно, «без зобовʼязань» — лексика страховиків, методологія в 2× довша за бренд.» | [AUDIT-COPY.md](./AUDIT-COPY.md) |
| **Анімації** | **3.5/10** | «Інженерно дисциплінований, креативно мертвий motion-шар. Effective unique patterns ≈ 3. Page-fade + fadeUp + scale 1.02 hover. Інфраструктура готова на 90%, креативу не вистачає на 80%.» | [AUDIT-MOTION.md](./AUDIT-MOTION.md) |

**Середнє арифметичне: 4.83 / 10.** Окремо до уваги: **Performance 9/10**, **A11y 9/10**, **бренд-токени 9/10** — це фундамент, який не треба перебудовувати, треба наростити.

---

## 3. П'ять смертних гріхів (cross-cut, що повторюються в ≥3 звітах)

### 🔴 SIN 1 — Вотермарк «ЛУН» на хіро-рендері /zhk/etno-dim

**Хто бачить це окрім Brand:** Design (скріншот), Sales (вбиває довіру), UX (естетичне порушення).

Помаранчевий логотип ЛУН (порталу-конкурента, агрегатора нерухомості) видно у нижньому правому куті hero-зображення на сторінці Етно Дім. Це дослівно **реклама конкурента всередині сайту забудовника**. Будь-який клієнт, який побачить це на демо-зустрічі, **відразу** скаже «що це у вас?» — і презентація провалена.

**Fix:** замаскувати або обрізати watermark у raw-render-asset, перебудувати з новою версією через `npm run optimize`. 2–4 год.

### 🔴 SIN 2 — Trust-сигнали на /contact зломані

«Телефон: —» + «Адреса: —» + соцмережі-іконки без лейблів і з мертвим `href="#"` + email на `vygoda.sales@gmail.com`. **Чотири окремі повідомлення «ми не серйозні»** на одній сторінці контактів забудовника, що продає по 1.5–5 М грн за квартиру.

**Хто це підтверджує:** Sales (P0), UX (P0), Copy (heading rewrite), Brand (P1 на gmail).

**Fix:**
- Замінити gmail на корп-домен (mail@vugoda.ua або принаймні замаскований SMTP).
- Замість «—» — або реальний номер, або **інформативна заглушка**: «Телефон зʼявиться на старті продажів», «Адреса офісу: Львів, готується до запуску».
- Прибрати соц-іконки які мертві, або позначити «coming soon» чесно.
- На /contact додати години роботи, фото офісу/майданчика, мапу.

8 год.

### 🔴 SIN 3 — Disabled Instagram CTA «Підписатись на оновлення (Instagram)»

На /zhk/etno-dim секондарна кнопка веде на `#` з `aria-disabled` стилем. **Мертве посилання як public proof «ми не до кінця готові»**. Точно так само як «—» на телефоні — це **negative proof**.

**Хто фіксує:** Sales (P0), UX (P0), Brand (P1).

**Fix вибір:**
- (A) Зробити реальний Instagram-аккаунт ВИГОДА (не Lakeview), запустити, link.
- (B) Прибрати кнопку взагалі (краще нічого, ніж disabled).
- (C) Замінити на «Підписатись на email-оновлення» — простий формочка з 1 полем у `mailto:`-варіанті, що collect leads.

2–4 год.

### 🔴 SIN 4 — 4 з 5 сторінок без imagery, hero без cinematic moment

Головна — flat centered wordmark на фоні ledь-видимого патерну кубів. **Ніяких рендерів Lakeview не видно з першого екрану.** Сайт забудовника, який не показує те, що будує — це парадокс. BrandEssence — Word-документ у 2 колонки. ConstructionTeaser — 4 thumb без timeline-backbone. Contact — 60% порожнечі справа.

**Хто це повторює:** Design, Brand, Sales, Motion.

**Fix:**
- Hero: замінити на 2-layered композицію → cinematic кадр (aerial Lakeview + куб-overlay + wordmark зверху на blend-mode).
- BrandEssence: додати куби як decorative artifact, ratio number 01/04 у display-розмірі (96-128px).
- ContactPage: великий куб + аerial-фрагмент + чистий type-block замість порожнечі.
- ConstructionTeaser: переробити як timeline-backbone з sticky month-headers.

3–5 днів.

### 🔴 SIN 5 — CTA без ієрархії, 9 формулювань на сайті

«Переглянути проекти» / «Перейти на сайт проекту ↗» / «Дивитись повний таймлайн →» / «Ініціювати діалог» / «Поговоримо про ваш обʼєкт» / «Написати про ЖК Етно Дім» / «Підписатись на оновлення (Instagram)» — **кожна кнопка інша**. Юзер не зчитує паттерн «що тут можна зробити». «Ініціювати діалог» — юридичний реєстр, не продажний; «Без зобовʼязань» — мова страховиків.

**Хто фіксує:** Copy, Sales, UX (CTA inconsistency cross-cut).

**Fix:** primary («Записатись на показ Lakeview»), secondary («Завантажити каталог планувань»), tertiary («Написати email») по всьому сайту. Бренд-тон збережено, продажна сила зросла. 4 год роботи + повторне ревʼю Brand Guardian.

---

## 4. Карта P0-P3 (готовність до handoff)

### P0 — must-fix перед передачею URL клієнту (8–14 годин роботи)

| # | Action | Owner | Год. | Кількість аудитів, що скаржаться |
|---|---|---|---|---|
| P0-1 | Прибрати ЛУН-вотермарк з aerial-рендера Етно Дім (rebuild + optimize) | Frontend | 2-4 | Brand · Design · Sales |
| P0-2 | Замінити `vygoda.sales@gmail.com` на корп-email (mail@vugoda.ua) | Ops | 1 | Sales · Brand |
| P0-3 | Замінити «—» на /contact на конкретику АБО осмислений placeholder | Copy + Frontend | 2 | Sales · UX · Copy |
| P0-4 | Прибрати disabled Instagram CTA (один з 3 варіантів вище) | Frontend | 1-3 | Sales · UX · Brand |
| P0-5 | Виправити мертві `<a href="#">` у footer/social — або реальні URL, або зняти | Frontend | 1 | UX · Brand |
| P0-6 | `/zhk/lakeview` redirect через `window.location.assign` ламає back-nav — переробити на `<a target="_blank">` або повноцінну redirect-сторінку | Frontend | 1 | UX |
| P0-7 | Pipeline-cards на головній: skeleton-плейсхолдери замість порожніх темних боксів при `loading="lazy"` | Frontend | 1 | Brand · Design |
| P0-8 | Hero ConstructionTeaser thumbs: те ж саме — skeleton при lazy | Frontend | 1 | Brand · Design |
| P0-9 | Mobile-fallback переписати щоб не звучало як «йди звідси» | Copy | 0.5 | Sales · Copy |

**Сумарно P0: ~10–14 год.** Без цього URL віддавати клієнту = саботувати презентацію.

### P1 — підняти з 7/10 до 8.5/10 (4–6 тижнів)

**Дизайн (≈9 днів):**
- Pattern 1: kinetic marquee рядок з ключовими словами під hero.
- Pattern 2: magnetic cursor на CTA + flagship card.
- Pattern 3: letter-mask reveal для display-тексту BrandEssence.
- Pattern 4: scroll-pinned hero з 3-layer parallax (cube grid + render fragment + wordmark).
- Pattern 5: number counter on view (роки на ринку, м² у роботі, родин у Lakeview).
- Pattern 6: SVG path draw на cube outlines під час reveal.
- Pattern 7: mix-blend-mode wordmark поверх render.
- Pattern 8: vertical sticky labels на /construction-log.
- Pattern 9: broken mason grid для pipeline cards.
- Pattern 10: cursor-tilt на flagship card.

**Анімації (≈25 год, +12 KB bundle):**
- P1-A: cinematic Hero intro (5-стадійна послідовність).
- P1-B: 3-layer parallax (zooming background + sliding wordmark + reveal CTA).
- P1-C: page-curtain transition через clip-path замість opacity.
- P1-D: image-reveal masks на flagship + ZHK hero.
- P1-E: layoutId shared element pipeline-card → ZhkHero.
- P1-F: magnetic CTAs (P1).
- P1-G: scroll-progress + sticky month headers /construction-log.
- P1-H: marquee бренд-cycle (тонкий, не circus).
- P1-I: stagger cadence tier'и (різні delays для різних секцій).

**Копірайт (≈8 год):**
- Hero subhead — переписати з конкретикою «Львів · 1 ЖК у будівництві · 4 у розрахунку».
- Уніфікувати CTA-ієрархію на 3 формулювання.
- Скоротити methodology блоки на 50% без втрати точності.
- Додати 1-рядковий характер кожному pipeline-проекту.
- Empty state «0 здано» переробити на впевнене «Перший здається у 2027».

**Sales (≈12 год):**
- Замінити mailto на нативну форму з 3 полями (name, email, message) → mailto-fallback як bcc.
- Додати лід-магніт «Каталог планувань Lakeview (PDF)» — 1 поле email.
- Trust block: розширити до 6 елементів (років на ринку, ЄДРПОУ, ліцензія, м² у роботі, родин у Lakeview, зворотній звʼязок 24 год).
- На кожен pipeline-card — додати CTA «Дізнатись більше» з mailto-prefilled-subject.
- Calendly link на /contact для запису на показ.

**UX (≈10 год):**
- BrowserRouter + 404.html spa-shim замість HashRouter (clean URLs).
- Skip-link до `<main>`.
- Focus management: на route-change повертати фокус на `<h1>`.
- Mobile responsive — не блокер для MVP, але як мінімум: збільшити breakpoint до <768px (планшет нормально працює), а нижче — мобільний layout, не fallback.
- Active state у Nav (де ми зараз).
- Keyboard tab-order перевірка по всіх сторінках.

### P2 — підняти з 8.5 до 9.5/10 (квартал v2)

- Custom cursor (content-aware blending).
- Scrambled-text intro «ВИГОДА» на 1-му візиті.
- Animated brand-cube rotation (на 3D через CSS transform-style: preserve-3d).
- Permanent telephone number + офіс-адреса (стартує продаж Lakeview Phase 2 або pipeline-проектів).
- Sanity/Strapi CMS для оновлення contractуальних дат і фото з майданчика (без code-deploys).
- Real-form з backend (n8n / Make / Pipedrive sync).
- Calendly + Telegram-бот.
- Прес-розділ або /news.
- /investors окрема сторінка з інвест-кейсом.
- Multi-language EN.

### P3 — стратегічна v2 (через 6+ міс)

- Immersive 3D-tour Lakeview (через Matterport iframe або кастомне Three.js).
- WebGL hero (тонкий — не циркові).
- Programmatic SEO для городків і районів Львова.
- Лід-magnet ROI calculator.
- Open House events + RSVP.

---

## 5. Технічні метрики (live deploy)

| Метрика | Значення | Бюджет | Verdict |
|---|---|---|---|
| Console errors на /home 1920 | 0 | 0 | ✅ |
| Console warnings | 0 | 0 | ✅ |
| Main JS bundle (gzipped) | **136.9 KB** | ≤200 KB | ✅ |
| Main JS bundle (raw) | 441 KB | — | ⚠️ Motion + react-router важкі |
| Lazy chunks | 0.8–1.4 KB gz | — | ✅ split працює |
| CSS (gzipped) | 8 KB | — | ✅ |
| Hero render aerial-1280.avif | 192 KB | ≤200 KB | ✅ край |
| Lakeview /_opt total | 10 MB | — | ⚠️ розглянути ще тригер AVIF only |
| Etno Dim /_opt total | 7.6 MB | — | ⚠️ те ж саме |
| Documents loaded /home | ~2.1 s (estimate) | <3s LCP | ✅ |
| 404 / SPA-fallback | через HashRouter | — | ⚠️ `#` в URL — UX мінус |

**Lighthouse не запущено** — папка `.lighthouseci/` порожня. Запустити перед фінальним handoff:
```bash
npm run preview &
npx @lhci/cli@0.15.1 collect --url=http://localhost:4173
```

---

## 6. Що не треба чіпати (інженерна зрілість)

Це сильні сторони — їх **не змінювати**:

- ✅ `src/lib/motionVariants.ts` SOT — `easeBrand`, durations, variants. Розширювати, не переписувати.
- ✅ `--ease-brand` в @theme + JS-tuple — lockstep maintained.
- ✅ Reduced-motion threading у RevealOnScroll, Hero parallax, hover-card, mark-pulse.
- ✅ Type-safe `IsometricCube` з обмеженням stroke-кольорів.
- ✅ Automated `scripts/check-brand.ts` блокує forbidden-lexicon і non-canonical hex.
- ✅ Закрита 6-кольорова палітра в `@theme`.
- ✅ Montserrat 400/500/700 cyrillic-only subsetting.
- ✅ Lazy split для /construction-log і /dev/* surfaces.
- ✅ Hero preload 640w+1280w (без 1920w double-fetch).
- ✅ ResponsivePicture з AVIF/WebP/JPG triple.
- ✅ `<dialog>` Lightbox a11y-correct.
- ✅ HashRouter рятує від SPA 404 на Pages — це pragmatic-OK для MVP, але P1 → BrowserRouter.

---

## 7. Передані файли та їхні ролі

| Файл | Призначення | Розмір |
|---|---|---|
| **AUDIT-MASTER.md** *(цей)* | Зведений вирок, P0-roadmap, scorecard | ~12 KB |
| [AUDIT-DESIGN.md](./AUDIT-DESIGN.md) | Дизайн 2026 — топ-10 дефектів, 7-10 modern patterns, pixel-level fix recommendations | 66 KB |
| [AUDIT-BRAND.md](./AUDIT-BRAND.md) | Бренд-аудит — палітра/типографіка/лого/тон, P0/P1 порушення з цитатами | 69 KB |
| [AUDIT-SALES.md](./AUDIT-SALES.md) | Продажний аудит — funnel-diagnosis, CTA-теплоти, lead-capture, переписаний копі | 46 KB |
| [AUDIT-UX.md](./AUDIT-UX.md) | UX-аудит — Nielsen heuristics, 3 cognitive walkthroughs, A11y WCAG-аудит | 68 KB |
| [AUDIT-COPY.md](./AUDIT-COPY.md) | Копірайт — 32 переписаних рядки до/після, методологія -49%, OG/meta | 75 KB |
| [AUDIT-MOTION.md](./AUDIT-MOTION.md) | Motion design — 15 рекомендацій з code-recipes, RM threading | 54 KB |

**Сумарно: ~390 KB документації, ~6 годин читання.**

Live screenshots усіх сторінок: `audit/live-*.png` (8 файлів — home@1920/1280/iphone, projects, zhk-etno, log, contact, mobile-fallback).

---

## 8. Рекомендований порядок дій

```
ДЕНЬ 1 (4–6 годин) — P0 sanity sprint
  ├─ Прибрати ЛУН-вотермарк (Frontend, 2–4 год)
  ├─ Корп-email замість gmail (Ops, 1 год)
  ├─ Виправити «—» на /contact (Copy + Frontend, 2 год)
  ├─ Disabled Instagram CTA — рішення (Frontend, 1–3 год)
  └─ Skeleton-плейсхолдери для pipeline + log thumbs (Frontend, 2 год)

ДЕНЬ 2 (4 години) — financial sanity
  ├─ Lighthouse CI: запустити, отримати baseline
  ├─ Mobile fallback: переписати copy + збільшити breakpoint до 768px
  ├─ CTA-уніфікація: 9 → 3 формулювання
  └─ Skip-link + focus management

ТИЖДЕНЬ 1 (5–9 робочих днів) — P1 spike
  ├─ Дизайн: 5 з 10 patterns (Hero + BrandEssence + Portfolio + ZhkHero + Log)
  ├─ Motion: P0-шар (cinematic Hero, page-curtain, image-reveal, layoutId)
  ├─ Copy: повний rewrite по AUDIT-COPY.md
  └─ Sales: реальна форма + лід-магніт «Каталог Lakeview»

ТИЖДЕНЬ 2 (5 робочих днів) — поліровка
  ├─ Дизайн: pattern 6-10
  ├─ Motion: P1-шар (magnetic, marquee, scroll-progress)
  ├─ Sales: Calendly + Trust block розширення
  └─ UX: BrowserRouter migration + active Nav state

ТИЖДЕНЬ 3-4 (опція) — справжнє mobile
  ├─ Replace MobileFallback з real responsive layout
  ├─ Tablet portrait fix
  └─ Touch interactions (swipe gallery, no hover-only states)

→ HANDOFF клієнту з готовністю 8.5/10
```

---

## 9. Висновок

Сайт **не поганий — він недо-зроблений**. Інженерна основа якісна, бренд-каркас закладено правильно, ризиковані обмеження (HashRouter, gmail, mailto, mobile fallback) свідомо прийнято в MVP. Але **сума цих компромісів** виглядає як «сайт-чорнетка», а не як «системний девелопер преміум-класу». Клієнт побачить це з першого скролу.

**Що змінює гру:** усунення трьох trust-катастроф (ЛУН, gmail, «—» на контактах) **за 8 годин** піднімає враження з «це шахрайська заглушка» до «це робоча альфа-версія». Ще тиждень дизайн+motion-роботи піднімає до «це премʼюм MVP, який можна показувати на пітчу».

**Не передавайте URL у тому стані, в якому він зараз.** Пройдіть P0-sprint, перезніміть скріншоти, повторіть аудит у 24 год. Тоді — або презентація, або ще один цикл P1.

Усі 6 деталізованих звітів містять конкретні код-патчі, file:line цитати, переписані рядки копі, code-recipes для анімацій. **Не треба нічого вигадувати — все описано.** Це чек-лист на 4–6 тижнів роботи.

---

*Master audit synthesized by Claude Opus 4.7 (1M context) on 2026-04-27 from 6 parallel specialist audits totaling ~390 KB of detailed analysis.*
