# Phase 7 — Layout Verification (SC#4 layout)

**Date:** 2026-04-27
**Tester:** Claude (Playwright MCP — `playwright/mcp@latest`, Chromium 1217)
**Browser:** Chromium (Playwright headed mode, viewport-mode capture per D-23 analog — see Capture procedure)
**Deployed URL base:** https://yaroslavpetrukha.github.io/vugoda-website/
**Bundle:** `assets/index-C35JwVpg.js` (post `de3b2b3` push to `origin/main`, deploy run `24979132726`)
**Capture procedure:** Per route×width — `browser_resize` to viewport, `browser_navigate` to hash route, inject CSS override (`animation-duration: 0s, transition-duration: 0s`) + scroll-warm-up to trigger Motion `whileInView` reveals + image-decode wait, scroll back to 0, `browser_take_screenshot fullPage:true`. (Substitute for D-23 manual DevTools capture — same final artifact, deterministic.)

## Screenshots captured

| Route | 1280 | 1366 | 1440 | 1920 |
|-------|------|------|------|------|
| / | [home-1280.png](./home-1280.png) | [home-1366.png](./home-1366.png) | [home-1440.png](./home-1440.png) | [home-1920.png](./home-1920.png) |
| /projects | [projects-1280.png](./projects-1280.png) | [projects-1366.png](./projects-1366.png) | [projects-1440.png](./projects-1440.png) | [projects-1920.png](./projects-1920.png) |
| /zhk/etno-dim | [zhk-etno-dim-1280.png](./zhk-etno-dim-1280.png) | [zhk-etno-dim-1366.png](./zhk-etno-dim-1366.png) | [zhk-etno-dim-1440.png](./zhk-etno-dim-1440.png) | [zhk-etno-dim-1920.png](./zhk-etno-dim-1920.png) |
| /construction-log | [construction-log-1280.png](./construction-log-1280.png) | [construction-log-1366.png](./construction-log-1366.png) | [construction-log-1440.png](./construction-log-1440.png) | [construction-log-1920.png](./construction-log-1920.png) |
| /contact | [contact-1280.png](./contact-1280.png) | [contact-1366.png](./contact-1366.png) | [contact-1440.png](./contact-1440.png) | [contact-1920.png](./contact-1920.png) |

Mobile fallback (Plan 07-06): [mobile-375.png](./mobile-375.png) — 375×844 iPhone 14 viewport, MobileFallback component renders (Logo + ВИГОДА wordmark + body + mailto + 4 CTAs + juridical block, no Nav, no Footer).

## Pass criteria per route×width (D-25)

For each (route, width) combination, verify against `brand-system.md` §3 (palette) + §6 (focus-visible) + §7 (spacing/grid):

- [x] **No horizontal scroll** (body width ≤ viewport width; no `overflow-x: scroll` triggered)
- [x] **Brand colors hold** (only the 6 canonical hexes visible: `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A` — no blue/purple/orange Tailwind defaults bleeding through, no off-palette grays)
- [x] **Hero/section hierarchy intact** (h1 visually dominant, h2 < h1, body copy readable)
- [x] **Cards in grid don't overflow** (PipelineGrid 3-col stays 3-col at ≥1280, StageFilter 4-chip stays 4-chip)
- [x] **No clipped text** (titles fit on intended lines, paragraphs not truncated mid-word, footer text fully visible)

## Per-route results

### `/` (home)
- **1280:** [x] All 5 criteria pass
- **1366:** [x] All 5 criteria pass
- **1440:** [x] All 5 criteria pass
- **1920:** [x] All 5 criteria pass («бездоганно» target — confirmed cleanest of the four, generous gutters, 7xl max-w container reads centered)
- Notes: Hero ВИГОДА wordmark + isometric cube background pattern visible. BrandEssence 4-card grid (Системність / Доцільність / Надійність / Довгострокова цінність) renders 2×2. PortfolioOverview FlagshipCard (ЖК Lakeview, lake render) + 3-card PipelineGrid (Етно Дім / Маєток Винниківський / Дохідний дім NTEREST) all present at all widths. ConstructionTeaser 4-image scroll-snap row visible. MethodologyTeaser 3-col block, юридично-та-операційно 3-col block, ContactForm closer + Footer all intact.

### `/projects`
- **1280:** [x] All 5 criteria pass
- **1366:** [x] All 5 criteria pass
- **1440:** [x] All 5 criteria pass
- **1920:** [x] All 5 criteria pass
- Notes: Page heading «Проєкти» + aggregate sub-line «1 в активній фазі будівництва · 4 у pipeline · 0 здано» renders correctly. FlagshipCard (Lakeview) hero + 5 StageFilter chips (Усі / У розрахунку (2) / У погодженні (2) / Будується (1) / Здано (0)) + 3 PipelineCards + AggregateRow «+1 об'єкт у роботі» line all present at all widths. Brand palette holds.

### `/zhk/etno-dim`
- **1280:** [x] All 5 criteria pass
- **1366:** [x] All 5 criteria pass
- **1440:** [x] All 5 criteria pass
- **1920:** [x] All 5 criteria pass
- Notes: ZhkHero (full-bleed render) + ZhkFactBlock (стадія/локація/адреса 3-row) + ZhkWhatsHappening centered block + ZhkGallery 4×2 = 8 thumbnails (incl. site-plan map) + ZhkCtaPair (mailto + Instagram link) all rendering. **Finding F-1 (informational, not blocking):** the ZhkHero render carries a "ЛУН" watermark in the bottom-right corner — sourced render not from `/renders/etno-dim/` per silent-displacement rule. Does NOT trigger Phase 1 silent-displacement check (rule applies only to Lakeview/Pictorial/Rubikon). Surface as content-sourcing item for client to swap if desired; not a build defect. Recorded in 07-VERIFICATION.md.

### `/construction-log`
- **1280:** [x] All 5 criteria pass
- **1366:** [x] All 5 criteria pass
- **1440:** [x] All 5 criteria pass
- **1920:** [x] All 5 criteria pass (4 MonthGroup blocks: Березень 2026 / Лютий 2026 / Січень 2026 / Грудень 2025 — total 50 photos render across all widths; image-decode warm-up + 2-pass scroll required to defeat lazy-load before screenshot)
- Notes: Each MonthGroup heading + photo grid (3-col at the captured widths) renders cleanly. **Finding F-2 (informational):** initial single-pass scroll capture left the last MonthGroup (Грудень 2025) with empty placeholders — root cause is Phase 6 lazy-loading working correctly + IntersectionObserver still pending decode. The fix in capture procedure (2-pass scroll + `img.complete` await) reflects this is a screenshot-pipeline artifact, NOT a deployed-code issue. Rendered output is correct.

### `/contact`
- **1280:** [x] All 5 criteria pass
- **1366:** [x] All 5 criteria pass
- **1440:** [x] All 5 criteria pass
- **1920:** [x] All 5 criteria pass
- Notes: Page heading «Контакт» + sub-line + 4-row реквізити-block (EMAIL active mailto / ТЕЛЕФОН — / АДРЕСА — / СОЦМЕРЕЖІ 3 disabled icons) + «Ініціювати діалог» mailto button + 3-col Footer (logo+email+social / навігація 3-link / юридична інформація 3-line) renders cleanly. Wide gutters at 1920 confirm desktop-first layout.

## Outcome

Total: 20 (route, width) checks
Passed: 20
Failed: 0

**Findings (informational, non-blocking) — folded into 07-VERIFICATION.md:**
- F-1: ZhkHero render carries "ЛУН" 3rd-party watermark (content-sourcing item; silent-displacement rule does not apply to Etno Dim).
- F-2: Construction-log lazy-load takes ≥1.5s after scroll; capture pipeline must double-pass + await img.decode for full output. Not a deployed-code defect.

**Failure handling:** if any (route, width) fails, /gsd:debug → re-deploy → re-shoot affected PNGs. Phase 7 verification doc (Plan 07-09) treats unfilled checkboxes as blocking. None unfilled.
