# План виправлень сайту ВИГОДА — Remediation Roadmap

**Дата:** 2026-04-27
**Базис:** 7 audit-файлів у корені проєкту (AUDIT-MASTER, AUDIT-DESIGN, AUDIT-BRAND, AUDIT-SALES, AUDIT-UX, AUDIT-COPY, AUDIT-MOTION) — ~390 KB деталізованого аналізу.
**Workflow:** прямі правки без GSD-циклу (atomic commits per fix, TodoWrite як tracker).

---

## 0. Executive Summary

| Сценарій | Час | Verdict | Ціль |
|---|---|---|---|
| **Поточний стан** | — | 5.0/10 | «Шахрайська заглушка» |
| **P0 — Sanity Sprint** | 1 день (10–14 год) | 7.0/10 | «Робоча альфа» — можна показувати |
| **P1 — Premium Sprint** | 2–3 тижні | 8.5/10 | «Преміум MVP» — handoff клієнту |
| **P2 — Polish** | 3–4 тижні | 9.5/10 | «Awwwards-level» |
| **P3 — Strategic v2** | квартал | 10/10 | «Платформа продажів» |

**Стек:** Vite 6 + React 19 + Tailwind v4 + Motion 12 + react-router-dom 7. Без Three.js, без CMS у v1.

---

## 1. PRD — цілі та обмеження

**Цілі:**
1. Прибрати **3 P0-катастрофи довіри** до публічного demo (ЛУН-вотермарк, gmail+«—» на /contact, disabled Instagram).
2. Підняти **візуальну сучасність з 4/10 до 8/10** через 10 modern patterns без Three.js.
3. Закрити **продажну воронку** (CR з 0.3% до 1.8–2.5%).
4. Дотягнути **WCAG 2.1 AA до 100%**.
5. Зберегти **бренд-дисципліну** (6 кольорів, Montserrat 400/500/700, automated `check-brand.ts`).

**Non-goals (свідомо не робимо у v1):**
- Повний mobile responsive (P3).
- Three.js / WebGL hero.
- CMS / backend.
- EN-локалізація.

**Персони:** P-1 Олександр (інвестор-діаспора) · P-2 Іра+Михайло (сім'я) · P-3 Богдана (журналіст).

---

## 2. P0 — SANITY SPRINT (10–14 годин)

> **Ціль:** прибрати все, що читається як «це шахрайська заглушка». Виконати ДО клієнтського demo.

| # | Задача | Файли | Агент(и) | Час |
|---|---|---|---|---|
| **P0-1** | Прибрати ЛУН-вотермарк з усіх 8 рендерів Етно Дім (ретуш + ребілд через `npm run optimize`) | `public/renders/etno-dim/*.webp`, `_opt/*` | Brand Guardian + Frontend Developer | 2–4 год |
| **P0-2** | Замінити `vygoda.sales@gmail.com` → `sales@vugoda.com.ua` (домен + Google Workspace) | `src/content/company.ts`, `mobile-fallback.ts` | DevOps Automator + Frontend Developer | 1–2 год |
| **P0-3** | Замінити «—» на /contact на «У розробці» / реальний номер (AUDIT-COPY §4.7) | `src/content/placeholders.ts`, `ContactDetails.tsx`, `ZhkFactBlock.tsx` | Content Creator + Frontend Developer | 1 год |
| **P0-4** | Прибрати disabled Instagram CTA (варіант B — «прибрати взагалі» або A — «Instagram у запуску») | `src/components/sections/zhk/ZhkCtaPair.tsx` | Brand Guardian + Frontend Developer | 1 год |
| **P0-5** | Замінити всі `<a href="#">` на `<button disabled>` (3 в Footer + 3 в ContactDetails + 1 в ZhkCtaPair) | `Footer.tsx`, `ContactDetails.tsx`, `ZhkCtaPair.tsx` | Accessibility Auditor + Frontend Developer | 30 хв |
| **P0-6** | Виправити `/zhk/lakeview` Back-loop: замінити `window.location.assign` на `<Navigate>` або `target="_blank"` flow | `src/pages/ZhkPage.tsx`, прибрати `ZhkLakeviewRedirect.tsx` | Frontend Developer | 30 хв |
| **P0-7** | Skeleton-плейсхолдери (IsometricCube) для lazy-картинок у `ResponsivePicture` | `src/components/ui/ResponsivePicture.tsx` | Frontend Developer + Brand Guardian | 1–2 год |
| **P0-8** | Hero ConstructionTeaser: переключити перші 4 thumbs на `loading="eager"`, решта — skeleton | `ConstructionTeaser.tsx` | Frontend Developer | 30 хв |
| **P0-9** | Mobile-fallback: переписати «йди звідси» → «Десктоп готовий, мобільна — у розробці» (AUDIT-COPY §4.19) | `src/content/mobile-fallback.ts` | Content Creator | 30 хв |
| **P0-10** | CTA-уніфікація 9→3 формулювання (32 переписаних рядки з AUDIT-COPY §17) | `src/content/*.ts`, `src/data/projects.ts` | Content Creator + Brand Guardian | 2 год |
| **P0-11** | Skip-link до `<main id="main-content">` (WCAG 2.4.1) | `Layout.tsx`, `index.css` | Accessibility Auditor | 30 хв |
| **P0-12** | Lighthouse CI baseline (зафіксувати поточні цифри) | `lighthouserc.json`, GH Actions | Performance Benchmarker | 1 год |

### P0 Definition of Done
- ✅ 0 ЛУН-вотермарків на всіх 8 рендерах (візуальний QA на 1920px)
- ✅ `vygoda.sales@gmail.com` не зустрічається у `src/content/`
- ✅ Жодних `<a href="#">` (grep blocking)
- ✅ Не з'являється `«—»` на /contact
- ✅ `npm run check-brand` проходить
- ✅ `tsc --noEmit` чисто
- ✅ Lighthouse Desktop ≥ 90 у всіх 4 категоріях

---

## 3. P1 — PREMIUM SPRINT (2–3 тижні)

> **Ціль:** з «робочої альфи» зробити «преміум MVP» з 10 modern patterns + повним продажним loop.

### 3.1 Дизайн (≈9 робочих днів) — UI Designer + Visual Storyteller + Senior Developer

| # | Pattern | Де |
|---|---|---|
| P1-D1 | Cinematic Hero rebuild (3-layer parallax + scrambled text + mix-blend wordmark + counter «1·4·0») | `Hero.tsx` |
| P1-D2 | BrandEssence manifesto-block (sticky vertical label + 80vh per card + великі цифри 01-04 opacity 12%) | `BrandEssence.tsx` |
| P1-D3 | PortfolioOverview flagship-bleed (100vw × 100vh + UI overlay + mason 3-pipeline grid) | `PortfolioOverview.tsx`, `FlagshipCard.tsx` |
| P1-D4 | ConstructionTeaser timeline-feel (feature 720×480 + horizontal strip + edge-fade + scroll-velocity skew) | `ConstructionTeaser.tsx` |
| P1-D5 | MethodologyTeaser editorial (pull-quotes 60px + cube-anchors + великі `01-03` tile-marks) | `MethodologyTeaser.tsx` |
| P1-D6 | TrustBlock «certificate» style (vertical dividers + ЄДРПОУ tabular-nums tile + icon-pictographs) | `TrustBlock.tsx` |
| P1-D7 | /zhk/etno-dim editorial (hero overlay + sticky-side panel + before/after slider) | `ZhkPage.tsx`, новий `BeforeAfterSlider.tsx` |
| P1-D8 | /construction-log timeline-progress (sticky 4-step + sticky month-headers + mason з feature-photo) | `ConstructionLogPage.tsx`, `MonthGroup.tsx` |
| P1-D9 | /contact split-immersive (50/50 + isometric Lviv map + 3 куби-pin) | `ContactPage.tsx`, новий `LvivMapSvg.tsx` |
| P1-D10 | Type scale upbump (display tokens, H2 → 48-72px, figure-tile → 60-96px) | `index.css` `@theme` |

### 3.2 Motion (≈25 годин, +12 KB bundle) — Frontend Developer (motion specialist)

15 рекомендацій з AUDIT-MOTION у 4 хвилях:
- **P1-M0:** Cinematic Hero intro · 3-layer parallax · page-curtain clip-path · image-reveal masks · layoutId pipeline→ZhkHero
- **P1-M1:** Magnetic CTAs · construction-log progress + sticky · marquee tagline · lightbox fade-in · stagger cadence tiers
- **P1-M2:** Custom cursor · scrambled text «вигода» · animated cube
- **P1-M3:** Number count-up · mouse-parallax overlay

RM threading verification на кожному кроці — Accessibility Auditor.

### 3.3 Sales / Conversion (≈12 годин)

| # | Задача | Агент |
|---|---|---|
| P1-S1 | Mailto → Formspree-форма (name + email + phone + reason-checkbox) | Growth Hacker + Frontend Developer |
| P1-S2 | Лід-магніт #1: «Каталог планувань Lakeview (PDF, 16 стор.)» з email-capture + auto-reply | Growth Hacker + Document Generator + Frontend Developer |
| P1-S3 | Trust-block розширення до 6 елементів (років, м², ЄДРПОУ deep-link, ліцензія, родин, SLA) | Growth Hacker + Content Creator + Frontend Developer |
| P1-S4 | CTA на 4 pipeline-cards (передбронь / старт продажів / інвест-кейс / new ЖК) | Growth Hacker + Content Creator + Frontend Developer |
| P1-S5 | Calendly-link на /contact для запису на показ | Growth Hacker + Frontend Developer |
| P1-S6 | Telegram-bot @vugoda_sales як alt-channel | Growth Hacker |
| P1-S7 | UTM-параметри на Lakeview-redirect | Growth Hacker + Tracking Specialist |
| P1-S8 | Meta Pixel + Google Tag (audience-collection) | Tracking & Measurement Specialist |
| P1-S9 | Цифри-anchor strip після Hero (count-up) | Growth Hacker + Content Creator + Frontend Developer |

### 3.4 Copy (≈8 годин)

| # | Задача | Агент |
|---|---|---|
| P1-C1 | Переписати 7 блоків методології до 50% довжини, declarative titles | Content Creator + Brand Guardian |
| P1-C2 | Переписати 4 цінності: declarative titles + stinger bodies | Content Creator + Brand Guardian |
| P1-C3 | OG/meta повернути SEO-специфіку | SEO Specialist + Content Creator |
| P1-C4 | 404-page жарт «Можливо, він ще на стадії дозвільної документації» | Content Creator + Whimsy Injector |
| P1-C5 | Pipeline cards `nextMilestone` (потребує client-confirm дат) | Content Creator + Project Shepherd |

### 3.5 UX (≈10 годин)

| # | Задача | Агент |
|---|---|---|
| P1-UX1 | BrowserRouter + 404.html SPA shim — clean URLs | Frontend Developer + UX Researcher |
| P1-UX2 | Focus management на route-change | Accessibility Auditor + Frontend Developer |
| P1-UX3 | Active-state у Nav | UX Researcher + Frontend Developer |
| P1-UX4 | Mobile breakpoint <768 — простий single-column shim | Frontend Developer + UX Researcher |
| P1-UX5 | Construction-log photo captions (60 рядків) | Content Creator + Frontend Developer |
| P1-UX6 | Breadcrumb на /zhk/etno-dim | UX Researcher + Frontend Developer |
| P1-UX7 | Filter «Будується» показує Lakeview-card | UX Researcher + Frontend Developer |
| P1-UX8 | StageFilter: motion-reduce + active layoutId pill | Accessibility Auditor + Frontend Developer |
| P1-UX9 | Lightbox: aria-live caption + правильні соц-іконки (simple-icons) | Accessibility Auditor + Frontend Developer |
| P1-UX10 | Keyboard tab-order перевірка по всіх 5 сторінках | Accessibility Auditor |

### 3.6 Renders / Asset hygiene (≈6 годин)

| # | Задача | Агент |
|---|---|---|
| P1-R1 | Перевибрати hero-render Етно Дім ближче до Lakeview-стилю | Brand Guardian + Image Prompt Engineer |
| P1-R2 | Isometric-grid overlay opacity 0.10 multiply на pipeline thumbnails | Brand Guardian + Frontend Developer |
| P1-R3 | Перейменувати `renders/likeview/` → `renders/lakeview/` (typo fix) | Frontend Developer |
| P1-R4 | AVIF-only режим для Lakeview/Etno_opt | Performance Benchmarker + Frontend Developer |

### P1 Definition of Done
- ✅ Усі 5 сторінок: hero без flat-template, ≥3 modern patterns у дії
- ✅ Motion bundle +12 KB max, JS ≤ 200 KB gzipped
- ✅ Lighthouse Desktop ≥ 95 у всіх 4 категоріях
- ✅ Lighthouse Mobile ≥ 80 (P1-mobile-shim)
- ✅ axe-core: 0 violations
- ✅ Formspree-form ловить тестовий submit, auto-reply приходить
- ✅ Лід-магніт PDF завантажується після email-submit
- ✅ Brand Guardian sign-off (8.5+/10)

---

## 4. P2 — POLISH (3–4 тижні)

| # | Задача | Агент |
|---|---|---|
| P2-1 | Real social-icons (simple-icons-react) | Frontend Developer + Brand Guardian |
| P2-2 | You-page сегментація (3 ICP-блоки: Сім'я / Інвестор / B2B) — кожен з лід-магнітом | Growth Hacker + UI Designer + Content Creator |
| P2-3 | Інвестиційний калькулятор для Lakeview | Growth Hacker + Frontend Developer |
| P2-4 | Лід-магніти #2-#5 (інвест-кейс, чек-лист, календар, calculator) | Growth Hacker + Document Generator + Content Creator |
| P2-5 | Цінові діапазони на ЖК-cards | Growth Hacker + Content Creator |
| P2-6 | Прес-mentions strip («Як про нас писали») | Content Creator + UI Designer |
| P2-7 | Партнери-strip (банк, архітектори, генпідрядник, страховик) | Studio Operations + Frontend Developer |
| P2-8 | Real-life construction-photos (зйомка майданчика) | Studio Operations + Visual Storyteller |
| P2-9 | Construction-timelapse video (5 sec accelerated) | Visual Storyteller + Short-Video Editing Coach |
| P2-10 | Відгуки клієнтів (anonymized) | Content Creator + Studio Operations |
| P2-11 | Empty-state /Здано: secondary CTA «Підписатись на оновлення про здачу» | Growth Hacker + Frontend Developer |
| P2-12 | 404-page: «Можливо ви шукали:» + 4 топ-ссилки + Mark spinner | Frontend Developer + Whimsy Injector |
| P2-13 | Construction-teaser arrow disabled-state на boundary | UX Researcher + Frontend Developer |
| P2-14 | Tooltip на mailto-CTA | UX Researcher + Frontend Developer |
| P2-15 | Sanity/Strapi CMS для дат + construction-photos | Backend Architect + Frontend Developer |
| P2-16 | Lighthouse CI у GH Actions (post-deploy gate) | DevOps Automator + Performance Benchmarker |
| P2-17 | sitemap.xml + robots.txt + canonical | SEO Specialist + Frontend Developer |
| P2-18 | Schema.org markup (Organization, Place, RealEstateAgent) | SEO Specialist + Frontend Developer |

---

## 5. P3 — STRATEGIC v2 (квартал)

| # | Задача | Агент |
|---|---|---|
| P3-1 | Повноцінний mobile-responsive layout | UI Designer + Mobile App Builder + Frontend Developer |
| P3-2 | EN-локалізація для diaspora/expat | Content Creator + Frontend Developer |
| P3-3 | Backend для форм (n8n/Make/Pipedrive) + email-nurture sequence | Backend Architect + Email Sequence specialist |
| P3-4 | Programmatic SEO для Львова + районів | SEO Specialist + Programmatic SEO |
| P3-5 | /investors окрема сторінка з інвест-кейсом | Content Creator + UI Designer |
| P3-6 | Прес-розділ /news + press-kit | Content Creator + Frontend Developer |
| P3-7 | Open House events + Calendly-RSVP | Growth Hacker + Frontend Developer |
| P3-8 | Live-chat (Crisp) — тільки якщо є людина <5хв SLA | Support Responder + Frontend Developer |
| P3-9 | Immersive 3D-tour Lakeview (Matterport iframe) | XR Immersive Developer |
| P3-10 | Referral program | Growth Hacker + Backend Architect |
| P3-11 | A/B-test framework на CTA-копі | Experiment Tracker + Tracking Specialist |
| P3-12 | Custom cursor signature animation v2 | Frontend Developer |

---

## 6. Folder structure (нові артефакти)

```
src/
  components/
    ui/
      BeforeAfterSlider.tsx       # NEW (P1-D7) — Етно Дім frozen → restored
      Cursor.tsx                  # NEW (P1-M2)
      CountUp.tsx                 # NEW (P1-S9)
      LeadMagnetForm.tsx          # NEW (P1-S2)
      ContactForm.tsx             # NEW (P1-S1) — replaces mailto on /contact
      ScrollProgress.tsx          # NEW (P1-M1)
    sections/
      home/
        AnchorNumbers.tsx         # NEW (P1-S9)
        SegmentedBlocks.tsx       # NEW (P2-2)
      projects/
        Marquee.tsx               # NEW (P1-M1)
      contact/
        LvivMapSvg.tsx            # NEW (P1-D9)
        ContactChannels.tsx       # NEW (P1-S5/S6)
    brand/
      AnimatedIsometricCube.tsx   # NEW (P1-M2)
  hooks/
    useMagnet.ts                  # NEW (P1-M1)
    useScramble.ts                # NEW (P1-M2)
    useCursorMode.ts              # NEW (P1-M2)
  lib/
    motionVariants.ts             # EXTEND — heroIntroParent, pageCurtain, imageReveal, staggerCadence

scripts/
  optimize-images.mjs             # EXTEND — AVIF-only mode

public/
  404.html                        # NEW (P1-UX1) — SPA shim
  lead-magnets/
    lakeview-katalog-2026.pdf     # NEW (P1-S2)
```

---

## 7. Definition of Done (per PR checklist)

- [ ] `npm run check-brand` passes
- [ ] `tsc --noEmit` clean
- [ ] Visual diff на 1920×1080 + 1280×800 + 768×1024
- [ ] axe-core: 0 violations
- [ ] Lighthouse Desktop ≥ 90 (P0) / ≥ 95 (P1)
- [ ] `prefers-reduced-motion` тестовано
- [ ] Keyboard tab-order перевірено
- [ ] Bundle size: JS ≤ 200 KB gzipped
- [ ] Hero render ≤ 200 KB AVIF
- [ ] No console errors / warnings
- [ ] Brand Guardian sign-off (для design + motion PRs)

---

## 8. Risk Register

| Ризик | Probability | Impact | Mitigation |
|---|---|---|---|
| Чисті рендери Етно Дім не отримуємо від клієнта | High | Critical | Ретуш у Photoshop як fallback (P0-1 варіант 2); якщо не виходить — заховати ЖК у aggregate-mode |
| Клієнт не готовий додати реальний phone+address | Medium | High | «У розробці» як осмислений placeholder |
| Дати в pipeline `nextMilestone` неточні | Medium | Medium | Альтернативний варіант без дат |
| Lighthouse Mobile <80 після P1-mobile-shim | Medium | Medium | Виключити декоративний motion на <768 |
| BrowserRouter migration ламає shareable URLs з v1 | Low | High | Зберегти HashRouter як fallback на 1 тиждень + 301-redirects |
| Formspree free-tier ліміт (50 submits/mo) | Low | Medium | Web3Forms або Resend як backup |
| Custom cursor дратує клієнта | Medium | Low | A/B з клієнтом перед merge |

---

## 9. Workflow

**Без GSD-циклу:**
- TodoWrite/TaskCreate як легкий tracker
- Atomic commits per fix (1 commit = 1 task)
- Цей документ — джерело правди для scope і пріоритетів
- Reality Checker certification після всього P0, не після кожної задачі

**Порядок дій:**
1. **Day 1:** P0 sanity-sprint, паралельні треки (Brand+Frontend на ЛУН; Content+Frontend на copy/CTA; A11y+Frontend на disabled-links/skip-link)
2. **Day 2:** Reality Checker + перезняти 8 скріншотів + повторити аудит у скороченій формі
3. **Тиждень 1–2:** P1-Premium Sprint у 4-х треках (Design / Motion / Sales / UX)
4. **Day 14:** handoff клієнту з готовністю **8.5/10**

---

*Cross-references: AUDIT-MASTER.md §4 «Карта P0–P3» · AUDIT-DESIGN.md §10 «10 modern patterns» · AUDIT-MOTION.md §5 «15 рекомендацій» · AUDIT-COPY.md §17 «Verbatim 32 переписаних рядки» · AUDIT-SALES.md §14 «Roadmap P0-P3» · AUDIT-UX.md §8 «Recommendations P0-P3»*
