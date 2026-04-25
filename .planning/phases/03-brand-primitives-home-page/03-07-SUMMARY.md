---
phase: 03-brand-primitives-home-page
plan: 7
subsystem: home-page-trust-contact
tags: [home, trust-block, contact-form, mailto, content-boundary, d-29]
requires: [src/content/company.ts, src/content/home.ts]
provides:
  - HOME-06 — TrustBlock 3-column legal facts table (ЄДРПОУ + ліцензія + email)
  - HOME-07 — ContactForm single mailto: CTA
affects:
  - .planning/phases/03-brand-primitives-home-page/03-08-compose-and-dev-route-PLAN.md (consumer)
  - src/pages/HomePage.tsx (Plan 03-08 will compose all 7 sections)
tech-stack:
  added: []
  patterns:
    - Three-column horizontal table at lg breakpoint (grid-cols-3)
    - Muted uppercase tracking-wider labels (text-xs ≈ 12px) — label-pattern carve-out, not body
    - Centered closer section on bg-bg-black for accent-on-dark AAA emphasis
    - mailto: anchor styled as accent button (visual parity with hero CTA)
    - encodeURIComponent for Cyrillic-safe mailto subject
key-files:
  created:
    - src/components/sections/home/TrustBlock.tsx
    - src/components/sections/home/ContactForm.tsx
  modified: []
decisions:
  - D-07-01 — TrustBlock col 2 caption (`licenseScopeNote`) AND col 3 caption (`contactNote`) imported from content/home.ts per Phase 3 D-29; not inlined.
  - D-07-02 — TrustBlock email value rendered as clickable `mailto:${email}` anchor (col 3) for direct-action affordance; matches Footer pattern.
  - D-07-03 — TrustBlock heading «Юридично та операційно» (24 chars) stays as JSX literal — under 40-char content-boundary threshold + structural label, matches BrandEssence-no-h2/PortfolioOverview-imported precedent triangulation.
  - D-07-04 — ContactForm `MAIL_SUBJECT = 'Ініціювати діалог через сайт ВИГОДА'` kept as module-top const (URL-context value, single-purpose); wrapped in encodeURIComponent at href construction for Cyrillic safety.
  - D-07-05 — ContactForm bg-bg-black (deep #020A0A) over bg-bg (#2F3640) chosen for the page closer — accent button on bg-black is the brand's strongest contrast moment (8.85:1 AAA), and the closer position warrants the visual emphasis.
  - D-07-06 — `<a href={href}>` styled with same Tailwind classes as Hero CTA (`bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110`) — visual button parity across home, no spring/shadow/rounded-pill per brand discipline.
  - D-07-07 — Doc-block self-consistency fix on BOTH files (Rule 3, 7th + 8th codebase occurrence). TrustBlock's verbatim plan TSX embedded `«команда»/«керівник»` policy literals that the same plan's grep gate would catch; ContactForm's verbatim TSX embedded literal `vygoda.sales@gmail.com` that would collide with the email-import-only grep. Resolution: rephrased both doc-blocks to describe policy without embedding regex-bait literals. Pattern is now confirmed across 8 plans (02-04, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2) — planner-template smell — future plans MUST pre-screen `<action>` doc-blocks against their own `<verify>` regex battery.
  - D-07-08 — Wave 3 home-section sweep complete: 7/7 home sections shipped (Hero · BrandEssence · PortfolioOverview · ConstructionTeaser · MethodologyTeaser · TrustBlock · ContactForm). Plan 03-08 composes them into HomePage.tsx + adds /dev/brand QA route.
metrics:
  duration: 4m 39s
  tasks: 2
  files: 2
  date_completed: "2026-04-25"
---

# Phase 3 Plan 07: Trust & Contact Summary

**One-liner:** Closes the home page below-fold with TrustBlock (HOME-06, three-column legal facts table consuming `company.ts` + `home.ts` captions, no team imagery) and ContactForm (HOME-07, single mailto: anchor styled as button — no form fields, no fake server submission).

## What Shipped

### TrustBlock (HOME-06)

`src/components/sections/home/TrustBlock.tsx` — 80 lines.

Three-column horizontal layout inside `max-w-7xl px-6` on `bg-bg py-24`:

1. **Юр. особа** — `legalName` («ТОВ «БК ВИГОДА ГРУП»») + «ЄДРПОУ {edrpou}» (42016395) under it
2. **Ліцензія** — «від {licenseDate} {licenseNote}» («від 27.12.2019 (безстрокова)») + caption `licenseScopeNote` («на провадження господарської діяльності з будівництва»)
3. **Контакт** — `<a href="mailto:{email}">{email}</a>` clickable mailto + caption `contactNote` («Звернення з усіх питань — на цю адресу»)

Section H2 «Юридично та операційно» — short structural label (24 chars), inline carve-out per D-29 threshold + Hero/MethodologyTeaser precedent.

Hard-rule compliance: zero `<img>` elements, zero leadership-roster literals (defensive grep against future drift). Trust = ЄДРПОУ in public registry + active construction license, NOT portraits (PROJECT.md Out of Scope, brand-system.md §6, CONCEPT §10.1).

WCAG: muted labels at `text-xs` (12px) use uppercase tracking-wider — label pattern, not body — matches brand-system §3 label-carve-out for `#A7AFBC` text. Body-size captions at `text-base` (16px) safely above the 14pt floor for `#A7AFBC` on `#2F3640` (5.3:1 AA).

Phase 1 Footer.tsx already shows the same 3 facts in column 3 — TrustBlock REPEATS them on home as a higher-emphasis surface (HOME-06 mandates this; not redundant, Persona-3 bank-DD lands here from Google).

### ContactForm (HOME-07)

`src/components/sections/home/ContactForm.tsx` — 47 lines.

Single page-closer section on `bg-bg-black py-24` with centered content stack:

- `<h2>{contactHeading}</h2>` — «Поговоримо про ваш об'єкт» (U+2019 apostrophe)
- `<p>{contactBody}</p>` — «Напишіть нам — обговоримо запит, опції, графік. Без зобов'язань.»
- `<a href={mailto-href}>{contactCta}</a>` — «Ініціювати діалог», styled as accent button matching Hero CTA visual parity

`mailto-href` construction: `` `mailto:${email}?subject=${encodeURIComponent(MAIL_SUBJECT)}` `` where `MAIL_SUBJECT = 'Ініціювати діалог через сайт ВИГОДА'` (module-top const). `encodeURIComponent` handles Cyrillic for browser address-bar parsing.

NO `<input>`, `<form>`, `<textarea>`, `<label>` elements. PROJECT.md Out of Scope: «Бекенд форм у v1 — mailto: достатньо для demo-handoff. Server endpoint — v2 INFR2-04.» A fake form that only concatenates inputs into a mailto query string adds UI surface without real utility.

Page-closer styling rationale: `bg-bg-black` (#020A0A) gives the strongest accent-on-dark contrast (8.85:1 AAA) — closer position warrants the maximum visual emphasis available in the closed palette.

## Acceptance Verification

| Gate | Result |
|------|--------|
| `npm run lint` (tsc --noEmit) | PASS — exit 0 |
| `npm run build` (tsc + vite + postbuild check-brand) | PASS — exit 0 |
| `check-brand denylistTerms` | PASS |
| `check-brand paletteWhitelist` | PASS |
| `check-brand placeholderTokens` | PASS |
| `check-brand importBoundaries` | PASS |
| **check-brand total** | **4/4 PASS** |
| Bundle size | 242.85 kB JS / 76.85 kB gzipped (unchanged from Plan 03-06; under 200 KB-gzipped budget) |

### TrustBlock acceptance grep battery

- file exists, exports `TrustBlock`
- imports `legalName` / `edrpou` / `licenseDate` / `licenseNote` / `email` from `../../../content/company`
- imports `licenseScopeNote` / `contactNote` from `../../../content/home`
- contains `mailto:${email}` clickable anchor
- NO `<img>` elements
- NO leadership-roster literals (defensive guard pattern)
- NO inline `licenseScopeNote` / `contactNote` literals — sourced from imports
- NO inline `transition={{}}` (Phase 5 boundary)

### ContactForm acceptance grep battery

- file exists, exports `ContactForm`
- imports `email` from `../../../content/company`
- imports `contactCta` / `contactHeading` / `contactBody` from `../../../content/home`
- contains `mailto:` + `encodeURIComponent`
- NO `<input>` / `<form>` / `<textarea>` / `<label>` elements
- NO hardcoded email literal — sourced from import
- NO inline `contactHeading` / `contactBody` literals — sourced from imports
- NO inline `transition={{}}` (Phase 5 boundary)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] TrustBlock doc-block self-consistency (7th codebase occurrence)**
- **Found during:** Task 1 pre-write self-check
- **Issue:** Plan's verbatim `<action>` TSX shipped a JSDoc comment containing the literal words «команда»/«керівник» as part of a "no team-roster copy" policy descriptor. The same plan's `<verify>` automated check `! grep -nE "команда|керівник|обличчя|портрет"` runs against the same file. Doc-block would have triggered the file's own grep gate.
- **Fix:** Rephrased to «Hard rule: NO portrait imagery, NO faces, NO leadership-roster copy.» — same policy meaning, no regex-bait literals.
- **Files modified:** `src/components/sections/home/TrustBlock.tsx`
- **Commit:** `ea092ec`

**2. [Rule 3 — Blocking] ContactForm doc-block self-consistency (8th codebase occurrence)**
- **Found during:** Task 2 pre-write self-check
- **Issue:** Plan's verbatim `<action>` TSX shipped a JSDoc comment containing the literal email `vygoda.sales@gmail.com`. The same plan's `<verify>` automated check `! grep -nE "vygoda\.sales@gmail\.com"` runs against the same file (the gate's intent is to enforce email-via-import; doc-block matches as a false positive).
- **Fix:** Rephrased to «mailto: message addressed to the corporate sales inbox. The actual address comes from src/content/company.ts (`email`)» — preserves intent, removes literal.
- **Files modified:** `src/components/sections/home/ContactForm.tsx`
- **Commit:** `dd39db9`

### Pattern Recognition

This is the 7th + 8th occurrence of the doc-block self-consistency anti-pattern across Phase 2-3 plans (02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2). **Planner-template smell — confirmed.** Future plans MUST pre-screen `<action>` doc-blocks against their own `<verify>` regex battery before issuing. Recommendation: add a planner-side automated check that greps the proposed `<action>` text against the proposed `<verify>` patterns and rejects collisions at plan time, not at executor time.

## Authentication Gates

None — all work was static file creation, no external services, no auth flow.

## Wave 3 Progress

**7/7 home sections shipped:**

| Section | Plan | Status |
|---------|------|--------|
| Hero (HOME-01 / ANI-01 / VIS-03 / VIS-04) | 03-04 | PASS |
| BrandEssence (HOME-02) | 03-05 | PASS |
| PortfolioOverview (HOME-03) | 03-05 | PASS |
| ConstructionTeaser (HOME-04) | 03-06 | PASS |
| MethodologyTeaser (HOME-05) | 03-06 | PASS |
| **TrustBlock (HOME-06)** | **03-07** | **PASS** |
| **ContactForm (HOME-07)** | **03-07** | **PASS** |

Plan 03-08 (last in phase) composes all 7 into `src/pages/HomePage.tsx` and registers `/dev/brand` QA route.

## Commits

- `ea092ec` — `feat(03-07): add TrustBlock with 3-column legal facts table (HOME-06)`
- `dd39db9` — `feat(03-07): add ContactForm with single mailto: CTA (HOME-07)`

## Self-Check: PASSED

- `src/components/sections/home/TrustBlock.tsx` — FOUND
- `src/components/sections/home/ContactForm.tsx` — FOUND
- Commit `ea092ec` — FOUND
- Commit `dd39db9` — FOUND
- `npm run lint` — exit 0
- `npm run build` — exit 0; check-brand 4/4 PASS
