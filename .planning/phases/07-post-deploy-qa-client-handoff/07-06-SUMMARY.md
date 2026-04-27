# Plan 07-06 — Mobile fallback screenshot SUMMARY

**Plan:** `07-06-mobile-fallback-screenshot-PLAN.md`
**Phase:** 07-post-deploy-qa-client-handoff
**Wave:** 2
**Status:** ✓ COMPLETE
**Tasks:** 1 / 1

## Outcome

Captured 1 full-page screenshot of `<MobileFallback>` rendered at 375×844 viewport (iPhone 14) on the deployed URL. Output: `.planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png` (37.8KB). Image confirms QA-01 mobile-fallback requirement: at viewport ≤1023px, Layout.tsx short-circuits Outlet/Nav/Footer rendering and returns `<MobileFallback />` directly — Logo + ВИГОДА wordmark + body «Сайт оптимізовано для екранів ≥1280px…» + active mailto + 4 stacked CTAs (Проєкти / Хід будівництва / Контакт / Перейти до Lakeview ↗) + bottom juridical block (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / Ліцензія від 27.12.2019). Brand palette (6 hexes) holds; no Nav, no Footer (D-03 + D-04).

## Commits

- `7c9d50f` test(07-06): capture mobile fallback screenshot at 375×844 (iPhone 14)

## Key files created

- `.planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png`

## Deviations

**D-1 (capture method substitution):** Same as Plan 07-05 D-1 — Playwright MCP capture in lieu of manual DevTools per user decision. Final artifact identical.

**D-2 (deploy-gap-aware redo):** First capture (against pre-push bundle `index-Bv8xkzvE.js`) showed the page rendering the FULL DESKTOP layout shrunk to 375px instead of the MobileFallback component. Bundle inspection confirmed the deployed JS contained zero references to `MobileFallback`, `useMatchMedia`, or `max-width: 1023px` — proof the deploy was 49 commits behind local HEAD (Phase 6's mobile-fallback wiring lives in commit `cddc214` which was unpushed). After authorized `git push origin main` + deploy run `24979132726` success, re-captured against fresh bundle `index-C35JwVpg.js` — MobileFallback now renders correctly and the screenshot was committed. The discovery is recorded as Finding F-3 in `07-05-SUMMARY.md` and surfaces as a process-improvement backlog item.

## Verification status

- [x] `mobile-375.png` exists and is non-trivial (37.8KB)
- [x] Visual confirmation: `<MobileFallback>` element renders (logo, wordmark, body, mailto, CTAs, juridical) — verified via Playwright `browser_evaluate`: `document.querySelector('[aria-label="Сайт оптимізовано для десктопа"]') !== null` returned `true`
- [x] No Nav, no Footer present at viewport 375 (D-03 short-circuit confirmed)
- [x] `window.matchMedia('(max-width: 1023px)').matches === true` at 375 viewport — hook is reactive
- [x] All canonical 6 brand hexes visible; no Tailwind defaults bleeding through

## Closes

- Phase 7 SC#4 (mobile half): the 21st PNG (mobile-375.png) joins the 20 desktop captures from 07-05
- Phase 6 UAT-2 (D-02 absorption pairing): MobileFallback verified live on deployed URL — closing the human-verify loop opened in Phase 6
- QA-01 verified post-deploy: mobile fallback active at 375×844, no broken desktop layout sent to mobile clients

## Self-Check: PASSED
