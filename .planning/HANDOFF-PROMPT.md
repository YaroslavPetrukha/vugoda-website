# Handoff prompt — наступне вікно (Vugoda website remediation)

> Скопіюй усе нижче і встав як перше повідомлення в новому Claude Code вікні. Все потрібне для продовження — вище (стек, аудит, план, поточні таски) — лежить у репо.

---

Я продовжую роботу над **корпсайтом забудовника ВИГОДА** після P0 sanity sprint. Хочу одразу стартувати P1-Design (cinematic rebuild) без зайвого ceremony.

## Контекст — прочитай у такому порядку

1. **`CLAUDE.md`** — стек (Vite 6 + React 19 + Tailwind v4 + Motion 12 + react-router-dom 7), бренд-дисципліна, Lighthouse ≥90 desktop, JS ≤200 KB gz, 6-color palette, Montserrat 400/500/700.
2. **`.planning/REMEDIATION-PLAN.md`** — повний P0→P3 roadmap. P0 завершено (10/12), 2 на бенчі.
3. **`.planning/HANDOFF-PROMPT.md`** — цей файл (для довідки).
4. **Аудити (≈390 KB, 7 файлів у корені):** AUDIT-MASTER, DESIGN, BRAND, SALES, UX, COPY, MOTION. Не читай повністю — звертайся точково за §номерами, на які посилаються таски.

## Що вже зроблено (P0, 10 commits на main)

```
89788c3 placeholders: «—» → «У розробці»
6f813e7 mobile-fallback: bridge-tone copy
f029881 32 переписаних рядки CTA + копірайт (AUDIT-COPY §17)
a0e559c skip-link для WCAG 2.4.1
869590a <a href="#"> → <button disabled> (Footer + ContactDetails)
390100f прибрано disabled Instagram CTA з ZhkCtaPair
db62d78 /zhk/lakeview Back-loop → same-origin Navigate
7b7eaf0 brand skeleton placeholders в ResponsivePicture
f12c7d5 eager-load перших 4 ConstructionTeaser thumbs
7a08a1e .planning/REMEDIATION-PLAN.md (планувальний артефакт)
```

Кожен коміт проходить `npx tsc --noEmit` + `npx tsx scripts/check-brand.ts` (7/7).

## На бенчі (P0 не зроблено)

- **P0-1 ЛУН-вотермарк:** візуально підтверджено на ВСІХ 8 рендерах `public/renders/etno-dim/` (включно `61996.png.webp` site map). Чекаємо чисті оригінали від клієнта АБО ретуш (можливий sharp-script `scripts/remove-watermarks.mjs` з crop+composite чорним прямокутником).
- **P0-2 gmail→корп домен:** заблоковано на DNS/MX setup (клієнт купує `vugoda.com.ua` + Google Workspace). Коли DNS готовий — заміна `email` у `src/content/company.ts:19` + `src/content/mobile-fallback.ts:42`. ~5 хв.

## Що далі — P1-Design (10 patterns, 5 хвиль)

Створено tasks #13-#22 (можеш TaskList побачити). Згруповано в 5 хвиль:

- **W1 — Foundation + WOW** (30-60 хв): D10 (type tokens) + **D1 (cinematic Hero rebuild)**
- **W2 — Portfolio narrative** (40-60 хв): D3 (flagship-bleed + mason) + D2 (BrandEssence manifesto)
- **W3 — Section editorialization** (40-60 хв): D4 + D5 + D6 (ConstructionTeaser + Methodology + Trust)
- **W4 — Etno Dim narrative** (45-90 хв): D7 (editorial + Before/After slider — ключовий бренд-сторі)
- **W5 — Closers** (60-120 хв): D8 (log timeline) + D9 (contact split-immersive + Lviv map)

**Реалістичний total: 4-6 годин AI active time.**

## Як я хочу щоб ти працював

- **Без `/gsd:` ceremony.** Атомарні коміти (1 коміт = 1 task), TaskCreate/TaskUpdate як tracker, після кожного task — `tsc + check-brand`. Деталі в `~/.claude/projects/-Users-admin-Documents---------vugoda-website/memory/feedback_skip_gsd_for_clear_scope.md`.
- **Стримана подача.** Не пиши у фокус-вікно «Великий обсяг роботи!» — пиши «D10 done, переходжу до D1». Терсе.
- **Бренд-дисципліна жорстка.** 6 кольорів `#2F3640 #3D3B43 #020A0A #C1F33D #F5F7FA #A7AFBC`. Montserrat тільки 400/500/700. `IsometricCube` stroke тільки `#A7AFBC | #F5F7FA | #C1F33D`. Forbidden lexicon (мрія/найкращий/унікальний/преміум...) — заблоковано `scripts/check-brand.ts`.
- **Без декоративних ефектів** з заборонної зони бренду: glow, drop-shadow з кольоровим радіусом, bouncy springs, particle systems, Three.js, Lottie. Усе motion на `easeBrand = cubic-bezier(0.22, 1, 0.36, 1)` через `src/lib/motionVariants.ts`.
- **RM threading на кожному motion-додаванні** — `useReducedMotion()` (Motion) АБО `@media (prefers-reduced-motion: reduce)` (CSS). Без винятків.
- **Тестуй візуально.** Запусти `npm run dev` (background) і перед commit'ом screenshotом перевір на 1920×1080 (Playwright), як виглядає. ConstructionTeaser, Hero, BrandEssence — особливо.

## Коли закінчиш W1 — спитай

1. **Preview screenshots між хвилями?** (Я раджу: так, 3 чекапойнти — після W1, W3, W5)
2. **Слоган Hero ОК?** Поточний: «1 ЖК у будівництві. 4 — на стадії розрахунків і дозволів. 0 — для вітрини.» (різкий, brand-faithful, але можна tone down)
3. **Bundle bloat після W1** — якщо +12 KB на хвилю, до W5 буде ~+50 KB → вийдемо за 200 KB JS budget. Якщо так — окремо `code-split` Hero motion в lazy chunk.

## Стартуй з W1 одразу

W1 = одна послідовність: D10 → D1. Два коміти. `npm run dev` стартуй в background перед стартом D1, після — screenshot home @ 1920×1080. Якщо все добре — переходь до питань вище.

**Не питай дозволу на старт W1.** Старт цього sprint'а вже схвалено в попередньому вікні.

---

*Цей промт згенеровано в попередньому вікні Claude Code, де вже відбувся повний P0 sanity sprint + planning. Мета: продовжити з мінімумом ramp-up.*
