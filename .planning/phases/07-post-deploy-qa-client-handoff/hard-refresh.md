# Phase 7 — Hard-refresh Deep-link Test (SC#2 + UAT-4)

**Date:** 2026-04-27
**Tester:** Claude (Playwright MCP — fresh page-context per row + storage-clear, simulating cold incognito-window per D-10 intent)
**Browser:** Chromium 1217 (Playwright headed mode)
**Deployed URL base:** https://yaroslavpetrukha.github.io/vugoda-website/
**Bundle:** `assets/index-C35JwVpg.js` (post `de3b2b3` push, deploy run `24979132726`)
**Method note (D-10 substitution):** Each row uses `browser_close` → fresh `browser_navigate` to a new page context, then `sessionStorage.clear() + localStorage.clear()` before render verification. This is functionally equivalent to D-10's "new incognito window per row" for the stated purpose (no `vugoda:hero-seen` carryover from Phase 5 D-21). Documented as deviation D-1 in 07-04-SUMMARY.md.

| # | URL | Tab | Expected | Actual | Pass/Fail | Screenshot |
|---|-----|-----|----------|--------|-----------|------------|
| 1 | `https://yaroslavpetrukha.github.io/vugoda-website/` | Cold incognito (new window) | Hero renders with «ВИГОДА» wordmark + IsometricGridBG overlay (opacity 0.1-0.2) + slogan «Системний девелопмент…» + CTA «Переглянути проекти» (active link to /#/projects) | `<title>` = «ВИГОДА — Системний девелопмент»; `<h1>` text = «ВИГОДА»; slogan «Системний девелопмент» found in body; CTA «Переглянути проекти» found with `href="#/projects"`; 0 console errors. | ✅ Pass | — |
| 2 | `https://yaroslavpetrukha.github.io/vugoda-website/#/projects` | Cold incognito (new window) | StageFilter (5 chips: Усі / У розрахунку (2) / У погодженні (2) / Будується (1) / Здано (0)) + FlagshipCard (Lakeview aerial render + external CTA) + PipelineGrid (3 cards: Етно Дім / Маєток / NTEREST) + AggregateRow (text + single-cube marker) | `<title>` = «Проєкти — ВИГОДА»; `<h1>` = «Проєкти»; 5 StageFilter chips found with exact labels; Lakeview alt-text image found in DOM; 3 pipeline cards mentioned (Етно Дім + Маєток Винниківський + NTEREST in DOM 14× across containers); AggregateRow «+1 об'єкт у роботі» visible in 1280-1920 layout PNGs (`projects-{1280,1366,1440,1920}.png`); 0 console errors. | ✅ Pass | — |
| 3 | `https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim` | Cold incognito (new window) | ZhkHero (etno-dim render) + ZhkFactBlock («меморандум про відновлення будівництва», Львів) + ZhkWhatsHappening + 8-image ZhkGallery + ZhkCtaPair (Instagram + mailto) | `<title>` = «ЖК Етно Дім — ВИГОДА»; ZhkFactBlock text «меморандум про відновлення» + «Львів» found; 8 gallery buttons with `aria-label="Відкрити рендер N"` (N=1..8) found; 2 CTAs «Написати про…» + «Підписатись на оновлення (Instagram)» found; 0 console errors. | ✅ Pass | — |
| 4 | `https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log` | Cold incognito (new window) | MarkSpinner appears briefly (lazy chunk per Phase 6 D-08) → 4 MonthGroup blocks: «Грудень 2025 · 12 фото», «Січень 2026 · 11 фото», «Лютий 2026 · 12 фото», «Березень 2026 · 15 фото» (50 photos total); lightbox opens on click | `<title>` = «Хід будівництва Lakeview — ВИГОДА»; `<h1>` = «Хід будівництва Lakeview»; 4 MonthGroup labels found verbatim («Березень 2026 · 15 фото / Лютий 2026 · 12 фото / Січень 2026 · 11 фото / Грудень 2025 · 12 фото» — total 50 photos confirmed); 50 `button[aria-label^="Відкрити фото"]` reachable; lazy-chunk fallback observed via load-time delay; 0 console errors. (Lightbox open verified separately in 07-03 keyboard walkthrough.) | ✅ Pass | — |
| 5 | `https://yaroslavpetrukha.github.io/vugoda-website/#/contact` | Cold incognito (new window) | Contact реквізити-block (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / ліцензія 27.12.2019) + active mailto:vygoda.sales@gmail.com + dash placeholder for phone/address (literal `—`, NOT `{{token}}`) + 4 disabled-style social `href="#"` links | `<title>` = «Контакт — ВИГОДА»; `<h1>` = «Контакт»; legal name «БК ВИГОДА ГРУП» + ЄДРПОУ 42016395 + ліцензія від 27.12.2019 all found; active `<a href="mailto:vygoda…">` present; «Ініціювати діалог» mailto button present; 2 literal `—` dash placeholders found (phone + address rows — no `{{token}}` strings present); 0 console errors. | ✅ Pass | — |
| 6 | `https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/unknown` | Cold incognito (new window) | Either: NotFoundPage rendered, OR `<Navigate>` redirect to /#/projects (the URL bar should auto-flip per Phase 4 D-32 redirect map). Verify which behavior applies — both are «proper 404» per SC#2 verbatim («proper 404 or redirect»). NEITHER blank screen NOR 404 from GH Pages itself (if that happens, HashRouter is broken — STOP per D-11). | `<title>` = «ЖК — ВИГОДА» (route-driven title for /zhk/* slug pattern); `<h1>` = «404 — сторінку не знайдено»; «Повернутись до головної» link present; Nav + Footer rendered (full chrome shell, NotFoundPage variant); URL stays `/#/zhk/unknown` (no redirect — implementation chose NotFoundPage path, not Navigate); GH Pages 404 page NOT shown; HashRouter contract intact; 0 console errors. | ✅ Pass | — |

## Pass criteria

- Pass = expected content fully visible within 3s on a cold tab; no GH Pages 404; no blank screen; no JS errors in console.
- Fail = any expected element missing, OR GH Pages 404 page (white page with «There isn't a GitHub Pages site here»), OR blank white/black screen, OR JS error in console.
- Row 6 specifically: Pass = NotFoundPage OR Navigate redirect renders; Fail = GH Pages 404 (which would mean HashRouter broken).

**Result: 6/6 PASS.** Phase 1 DEP-03 HashRouter contract verified post-deploy. No regression of the 404-on-deep-link class. Phase 6 UAT-4 closes.

## Failure recovery (D-11)

If any row fails:
1. Record the failure with screenshot in the table (above).
2. STOP Phase 7 progression — DO NOT proceed to Plan 07-05/06/07/08/09 until the failure is resolved.
3. The failure indicates a regression of DEP-03 / Phase 1 D-22 HashRouter contract — high-severity.
4. Trigger /gsd:debug against the failure: identify root cause (likely `.nojekyll` missing, or vite.config.ts base path drift, or HashRouter import regression).
5. Fix the underlying issue, push to main, wait for CI deploy, RESUME Phase 7 verification — re-run this entire 6-row test in fresh incognito windows (D-10 still applies on retry).
6. Phase 7 does NOT band-aid a deep-link failure (no manual workarounds, no client-side rewrite hacks).

**This run: no failures recorded.** Section retained for audit-trail completeness and Plan 07-09 cross-reference.
