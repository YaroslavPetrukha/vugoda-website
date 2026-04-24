---
status: complete
phase: 01-foundation-shell
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-deploy-workflow-SUMMARY.md]
started: 2026-04-24T17:10:00Z
updated: 2026-04-24T17:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Nav + Footer на кожному маршруті
expected: На кожній з 5 сторінок (/, /#/projects, /#/zhk/etno-dim, /#/construction-log, /#/contact) зверху — sticky Nav з тёмним фоном (#2F3640), логотипом ВИГОДА зліва та трьома посиланнями справа. Знизу — Footer з трьома колонками: лого+email+соцмережі, навігація, юридичний блок (ТОВ «БК ВИГОДА ГРУП», ЄДРПОУ 42016395, Ліцензія від 27.12.2019).
result: pass

### 2. Активний маршрут в Nav підкреслений
expected: Клік на «Проєкти» — посилання «Проєкти» в Nav підкреслене 2px лаймовою лінією (#C1F33D). Перехід на «Контакт» — підкреслення переходить туди. На головній (/) жодне посилання не підкреслене.
result: pass

### 3. HashRouter — пряме відкриття сторінки
expected: Відкрий нову вкладку і вруч введи https://yaroslavpetrukha.github.io/vugoda-website/#/projects — сторінка «Проєкти» завантажується без 404. Те ж саме для /#/construction-log і /#/contact.
result: pass

### 4. Montserrat + кирилиця
expected: На будь-якій сторінці заголовок («ВИГОДА», «Проєкти», «Хід будівництва» тощо) і юридичний текст в Footer відображаються шрифтом Montserrat. Кирилічні символи «є», «і», «ї» видно чітко, без fallback до системного шрифту.
result: pass

### 5. :focus-visible — клавіатурна навігація
expected: Натисни Tab на будь-якій сторінці — кожне посилання (логотип, Проєкти, Хід будівництва, Контакт) при фокусі показує лаймовий обрис (2px, кут 2px). Клік мишею — жодного обрису немає.
result: pass

### 6. Деплой — live URL
expected: https://yaroslavpetrukha.github.io/vugoda-website/ відкривається в браузері без помилок, показує головну сторінку ВИГОДА.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
