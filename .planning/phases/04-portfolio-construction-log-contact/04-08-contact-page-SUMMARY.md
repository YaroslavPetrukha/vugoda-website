---
phase: 04-portfolio-construction-log-contact
plan: "08"
subsystem: contact-page
tags: [contact, ctc-01, d-36, d-37, d-38, mailto, social-icons]
dependency_graph:
  requires:
    - "04-01 (content/contact.ts — contactPageHeading, contactPageSubtitle, contactPageCta, contactMailSubject)"
    - "02-04 (content/company.ts — email, socials; content/placeholders.ts — phone, address)"
    - "01-xx (App.tsx routing, Layout.tsx with Footer)"
  provides:
    - "src/components/sections/contact/ContactDetails.tsx — 4-row реквізити-block"
    - "src/pages/ContactPage.tsx — composed /contact route (CTC-01)"
  affects:
    - "/#/contact route — replaces Phase 1 placeholder stub"
tech_stack:
  added: []
  patterns:
    - "dl/dt/dd semantic structure for labeled contact data"
    - "lucide-react fallback icons (Send/MessageCircle/Globe) when Instagram/Facebook not in v1.11"
    - "encodeURIComponent(contactMailSubject) Cyrillic-safe mailto href"
    - "cursor-default on placeholder social hrefs (D-08 disabled-state convention)"
key_files:
  created:
    - src/components/sections/contact/ContactDetails.tsx
  modified:
    - src/pages/ContactPage.tsx
decisions:
  - "D-36: /contact page anatomy — h1 + subtitle + ContactDetails + primary mailto CTA"
  - "D-37: Реквізити-block as dl/dt/dd, 4 rows, email active mailto, phone/address em-dash, socials href='#' cursor-default"
  - "D-38: No legal-registry duplication on /contact — Footer is the single source on every route"
  - "Lucide icon fallback: lucide-react v1.11 does not export Instagram or Facebook — confirmed via grep on dist/lucide-react.d.ts; fallback: Send (Telegram), MessageCircle (Instagram-ish), Globe (Facebook) per Phase 3 RESEARCH §I"
  - "M-3 single-source: contactMailSubject imported from content/contact.ts; no inline MAIL_SUBJECT const in ContactPage"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-25"
  tasks: 2
  files: 2
---

# Phase 4 Plan 08: Contact Page Summary

**One-liner:** /contact page with mailto email, em-dash phone/address placeholders, 3 disabled social icons, and accent-fill primary CTA — fully sourced from content modules (zero hardcoded literals).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ContactDetails.tsx (4-row реквізити-block) | 2b68570 | src/components/sections/contact/ContactDetails.tsx (NEW) |
| 2 | Replace ContactPage.tsx with composed page | 112bfe8 | src/pages/ContactPage.tsx (REPLACED) |

## What Was Built

### Task 1: ContactDetails.tsx

New leaf component at `src/components/sections/contact/ContactDetails.tsx`:
- `<dl>/<dt>/<dd>` semantic structure — 4 rows: Email, Телефон, Адреса, Соцмережі
- Email row: active `<a href={mailto:${email}}>` with `hover:text-accent` + focus-visible ring
- Телефон and Адреса rows: render em-dash `—` from `placeholders.ts` (D-19 policy)
- Соцмережі row: 3 icons (Send/MessageCircle/Globe), all `href="#"`, `cursor-default`, `aria-label` per channel name, `aria-hidden="true"` on each icon SVG
- Grid layout: single-column mobile, `[120px_1fr]` two-column at lg breakpoint

### Task 2: ContactPage.tsx

Fully replaced Phase 1 stub (mark.svg placeholder):
- `<h1>{contactPageHeading}</h1>` — «Контакт»
- `<p>{contactPageSubtitle}</p>` — «Напишіть нам, щоб обговорити проект.»
- `<ContactDetails />` — реквізити-block
- Primary `<a>` CTA button: `bg-accent text-bg-black px-8 py-4` + `encodeURIComponent(contactMailSubject)` for Cyrillic-safe mailto href
- Default export `ContactPage` preserved (App.tsx import unchanged)

## Decisions Made

- **Lucide icon fallback confirmed:** `lucide-react@1.11` does NOT export `Instagram` or `Facebook` (grep returned empty). Fallback per RESEARCH §I: `Send` (Telegram), `MessageCircle` (Instagram-ish), `Globe` (Facebook). Import names are the only change from the plan's first-choice; functionality identical.
- **M-3 single-source:** `contactMailSubject` imported from `content/contact.ts` — no inline `MAIL_SUBJECT` const in `ContactPage.tsx`. Future DRY of `ContactForm.tsx` home section can import the same const with zero rename.
- **D-38 enforcement:** doc-block in `ContactDetails.tsx` initially contained the literal word «ЄДРПОУ» in a policy description, which would trip `check-brand` D-38 denylist grep. Rephrased to «No legal-registry / license duplication» — same fix as Plans 02-04 ×2, 03-03, 03-04, 03-05 ×2, 03-06, 03-07 ×2 (planner-template smell, 9th codebase occurrence). See Deviations section.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Doc-block self-consistency] Removed «ЄДРПОУ» literal from ContactDetails.tsx doc-block**
- **Found during:** Task 1 automated verify step (`! grep -E "ЄДРПОУ|42016395|27\.12\.2019"`)
- **Issue:** Plan's verbatim `<action>` JSDoc contained «D-38: NO ЄДРПОУ / license duplication here» — the word «ЄДРПОУ» would trigger the `check-brand` denylist grep that runs over `src/` in postbuild
- **Fix:** Rephrased to «D-38: No legal-registry / license duplication here» — semantically equivalent, CI-clean
- **Files modified:** src/components/sections/contact/ContactDetails.tsx (doc-block line 7)
- **Commit:** 2b68570 (same commit as Task 1 — fix applied before commit)
- **Pattern note:** This is the 9th occurrence of this doc-block self-consistency pattern across the codebase. It is now definitively a planner-template smell — the `<action>` verbatim text must be pre-screened against the `<verify>` regex battery before the plan is issued, not fixed by the executor at runtime.

**2. [Rule 3 - Prebuild infra] `npm run build` prebuild fails with EEXIST**
- **Found during:** Task 2 final build verification
- **Issue:** `scripts/copy-renders.ts` fails when `public/renders/` already contains copied assets — `cpSync` without `force:true` throws `EEXIST` on pre-existing directories
- **Scope:** Pre-existing infrastructure issue, NOT introduced by this plan
- **Action:** Ran `npx tsc --noEmit && npx vite build` directly, bypassing prebuild. Build exits 0. Postbuild `check-brand` 4/4 PASS.
- **Deferred:** The cpSync `EEXIST` fix is an out-of-scope infra issue — logged to deferred items, not fixed here.

## Build Verification

- `npm run lint` (`tsc --noEmit`): EXIT 0 — Task 1 and Task 2 both clean
- `npx vite build`: EXIT 0 — full Vite build with all modules resolved
- `npm run postbuild` (`check-brand`): 4/4 PASS
  - `[check-brand] PASS denylistTerms`
  - `[check-brand] PASS paletteWhitelist`
  - `[check-brand] PASS placeholderTokens`
  - `[check-brand] PASS importBoundaries`
- Bundle delta: 427.73 kB JS / 133.09 kB gzipped (was 131.60 kB at end of Phase 3 — ~1.5 kB gzipped added for ContactPage + ContactDetails + 3 new lucide icons from the MessageCircle/Globe family)

## Content Boundary Verification

- `! grep "vygoda.sales@gmail.com" src/components/sections/contact/ src/pages/ContactPage.tsx` — CLEAN (email sourced via import from company.ts)
- `! grep -E "ЄДРПОУ|42016395|27\.12\.2019" src/components/sections/contact/ src/pages/ContactPage.tsx` — CLEAN (D-38 satisfied)

## Manual Smoke (for next verifier pass)

Expected at `/#/contact`:
- H1 «Контакт» visible
- Subtitle «Напишіть нам, щоб обговорити проект.» visible
- 4 dl rows: Email (active link, `hover:text-accent`), Телефон (—), Адреса (—), Соцмережі (3 grey icons)
- Primary CTA button «Ініціювати діалог» on accent-fill (#C1F33D background)
- Click email link → mail client opens (no subject — informational link)
- Click primary CTA → mail client opens with subject «Ініціювати діалог через сайт ВИГОДА»
- Click any social icon → no navigation (href='#'), cursor stays default
- Tab through page → focus rings visible on all 4 anchors + CTA button
- Footer (Layout) shows legal-registry data — no duplication on page itself (D-38)

## Known Stubs

- Social icon hrefs: all `'#'` (from `socials.telegram/instagram/facebook` in `company.ts`) — intentional placeholder per CTC-01 requirement; real URLs confirmed by client in Phase 7 or v2. Company.ts doc-block notes this explicitly.
- Phone: `—` from `placeholders.ts` — CONCEPT §11.1 open client question
- Address: `—` from `placeholders.ts` — CONCEPT §11.2 open client question

These stubs do NOT prevent the plan's goal from being achieved — CTC-01 explicitly specifies email active + phone/address em-dash + socials href="#". The stubs ARE the intended production state for demo handoff.

## Self-Check: PASSED
