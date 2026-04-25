---
phase: 04-portfolio-construction-log-contact
plan: 08
type: execute
wave: 2
depends_on: ["04-01"]
files_modified:
  - src/components/sections/contact/ContactDetails.tsx
  - src/pages/ContactPage.tsx
autonomous: true
requirements: [CTC-01]
must_haves:
  truths:
    - "/contact renders <h1>Контакт</h1> + subtitle + <ContactDetails> + primary mailto CTA button (D-36)"
    - "Реквізити-block uses <dl>/<dt>/<dd> with 4 rows: Email (active mailto), Телефон (—), Адреса (—), Соцмережі (3 disabled icons) (D-37)"
    - "Email is rendered as active mailto:vygoda.sales@gmail.com link (D-37)"
    - "Phone and Address render the em-dash «—» literal from src/content/placeholders.ts (D-37 + Phase 2 D-19)"
    - "Social icons (Telegram/Instagram/Facebook) wrap in <a href={socials.X}> with cursor-default + aria-label (D-37 + Phase 1 D-08)"
    - "NO ЄДРПОУ duplication on /contact — Footer already shows it (D-38)"
  artifacts:
    - path: "src/components/sections/contact/ContactDetails.tsx"
      provides: "Реквізити-block with 4 dl rows"
      contains: "mailto:\\${email}"
    - path: "src/pages/ContactPage.tsx"
      provides: "Composed /contact page (REPLACES Phase 1 stub)"
      contains: "ContactDetails"
  key_links:
    - from: "src/components/sections/contact/ContactDetails.tsx"
      to: "src/content/company.ts"
      via: "import { email, socials }"
      pattern: "email|socials"
    - from: "src/components/sections/contact/ContactDetails.tsx"
      to: "src/content/placeholders.ts"
      via: "import { phone, address }"
      pattern: "phone|address"
---

<objective>
Compose `/contact` — single-column centered contact page. Ships CTC-01.

Page anatomy (D-36..D-38):
- `<h1>Контакт</h1>` + one-line subtitle
- `<ContactDetails />` — реквізити-block with `<dl>` showing Email (active mailto), Phone (—), Address (—), Socials (3 disabled icons)
- Primary mailto CTA button styled like home ContactForm (accent-fill on bg-bg-black)

NO ЄДРПОУ / license repetition (D-38 — Footer already has them).

Output: 1 new section component + 1 page replacement.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/content/contact.ts
@src/content/company.ts
@src/content/placeholders.ts
@src/components/sections/home/ContactForm.tsx
@src/pages/ContactPage.tsx

<interfaces>
From src/content/contact.ts (Wave 1 plan 04-01):
```typescript
export const contactPageHeading: string;   // 'Контакт'
export const contactPageSubtitle: string;  // 'Напишіть нам, щоб обговорити проект.' (M-2: bare invitation)
export const contactPageCta: string;       // 'Ініціювати діалог'
export const contactMailSubject: string;   // 'Ініціювати діалог через сайт ВИГОДА' (M-3 single-source)
```

From src/content/company.ts:
```typescript
export const email: 'vygoda.sales@gmail.com' as const;
export const socials: {
  telegram: string;   // '#'
  instagram: string;  // '#'
  facebook: string;   // '#'
};
```

From src/content/placeholders.ts:
```typescript
export const phone: string;    // '—'
export const address: string;  // '—'
```

From lucide-react v1.11 — already installed. Per Phase 3 D-29 + RESEARCH §I, the social icons use `Send` (Telegram), `MessageCircle` (Instagram-ish — could also be `Instagram` if the lib has it), `Globe` (Facebook). Verify by reading lucide-react index for available icons; default to `Send`/`MessageCircle`/`Globe` per Phase 3 RESEARCH §I; if `Instagram` and `Facebook` icons exist as named exports in v1.11, prefer those for clarity (planner discretion).

From src/components/sections/home/ContactForm.tsx (Phase 3) — reference pattern for the primary mailto button:
- `bg-accent text-bg-black px-8 py-4 text-base font-medium hover:brightness-110`
- on `bg-bg-black` closer section
- mailto subject wrapped in `encodeURIComponent`
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/sections/contact/ContactDetails.tsx (4-row реквізити-block)</name>
  <read_first>
    - src/content/company.ts (email + socials shape)
    - src/content/placeholders.ts (phone + address)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-37, D-38)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §I (ContactDetails as <dl> verbatim) + §Q7 (dl/dt/dd) + §Pitfall 6 (muted text size floor)
    - src/components/sections/home/TrustBlock.tsx (reference pattern for <dl> styling and mailto link)
  </read_first>
  <files>src/components/sections/contact/ContactDetails.tsx</files>
  <action>
    Create new file `src/components/sections/contact/ContactDetails.tsx`:

    ```tsx
    /**
     * @module components/sections/contact/ContactDetails
     *
     * CTC-01 — Реквізити-block (D-37). 4 rows in <dl>/<dt>/<dd>: Email,
     * Телефон, Адреса, Соцмережі. Email is the only active link (mailto);
     * phone/address render «—» em-dash placeholders per Phase 2 D-19;
     * social icons are href="#" with cursor-default + aria-label (D-37 +
     * Phase 1 D-08 disabled-state convention).
     *
     * D-38: NO ЄДРПОУ / license duplication here — Footer renders them on
     * every route. /contact stays focused on contact channels.
     *
     * WCAG note (Pitfall 6): muted <dt> labels at text-base (16px) lg:text-base
     * — at AA floor for #A7AFBC/#2F3640 (5.3:1). text-sm + font-medium at <lg
     * boosts contrast perception.
     */

    import { Send, Instagram, Facebook } from 'lucide-react';
    import { email, socials } from '../../../content/company';
    import { phone, address } from '../../../content/placeholders';

    export function ContactDetails() {
      return (
        <dl className="grid grid-cols-1 gap-y-6 lg:grid-cols-[120px_1fr] lg:gap-x-8">
          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Email
          </dt>
          <dd className="text-base text-text">
            <a
              href={`mailto:${email}`}
              className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {email}
            </a>
          </dd>

          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Телефон
          </dt>
          <dd className="text-base text-text">{phone}</dd>

          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Адреса
          </dt>
          <dd className="text-base text-text">{address}</dd>

          <dt className="text-sm font-medium uppercase tracking-wider text-text-muted lg:text-base">
            Соцмережі
          </dt>
          <dd className="flex gap-4">
            <a
              href={socials.telegram}
              aria-label="Telegram"
              className="text-text-muted hover:text-accent cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Send size={20} aria-hidden="true" />
            </a>
            <a
              href={socials.instagram}
              aria-label="Instagram"
              className="text-text-muted hover:text-accent cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
            <a
              href={socials.facebook}
              aria-label="Facebook"
              className="text-text-muted hover:text-accent cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Facebook size={20} aria-hidden="true" />
            </a>
          </dd>
        </dl>
      );
    }
    ```

    NOTES:
    - Inline cyrillic «Email» (5 chars), «Телефон» (7 chars), «Адреса» (6 chars), «Соцмережі» (9 chars) are structural labels — well below the 40-char content-boundary threshold. Same carve-out as ZhkFactBlock (plan 04-06).
    - Lucide icon imports: `Send`, `Instagram`, `Facebook` — these are v1.11 named exports. If `Instagram`/`Facebook` aren't exported in v1.11 (verify via `grep -E "^export" node_modules/lucide-react/dist/lucide-react.d.ts | grep -iE "Instagram|Facebook"`), fall back to `MessageCircle`/`Globe` per RESEARCH §I. The pattern is identical; only the import names change.
    - Each social `<a>` has `cursor-default` (NOT `cursor-pointer`) since hrefs are `'#'` placeholders. Same disabled-state pattern as Footer (Phase 1 D-08).
    - `aria-label` on each social link communicates channel; `aria-hidden="true"` on the icon avoids double-announcement.
    - Email anchor uses `hover:text-accent` (matches TrustBlock pattern from Phase 3 03-07).
    - The mailto template literal is `mailto:${email}` — the email value (`vygoda.sales@gmail.com`) is the actual literal at runtime; the source file does NOT contain the email literal directly (single-source via company.ts).
    - All 4 `<a>` elements have `focus-visible:outline-accent` for keyboard a11y.
  </action>
  <verify>
    <automated>grep -nE "export function ContactDetails" src/components/sections/contact/ContactDetails.tsx && grep -nE 'mailto:\$\{email\}' src/components/sections/contact/ContactDetails.tsx && grep -nE 'cursor-default' src/components/sections/contact/ContactDetails.tsx && grep -nE 'aria-label="Telegram"' src/components/sections/contact/ContactDetails.tsx && grep -nE 'aria-label="Instagram"' src/components/sections/contact/ContactDetails.tsx && grep -nE 'aria-label="Facebook"' src/components/sections/contact/ContactDetails.tsx && grep -nE "import \{ phone, address \}" src/components/sections/contact/ContactDetails.tsx && grep -nE "import \{ email, socials \}" src/components/sections/contact/ContactDetails.tsx && ! grep -E "ЄДРПОУ|42016395|27\\.12\\.2019" src/components/sections/contact/ContactDetails.tsx && ! grep -nE "vygoda\\.sales@gmail\\.com" src/components/sections/contact/ContactDetails.tsx && npm run lint</automated>
  </verify>
  <done>
    - File exists at correct path.
    - Exports `ContactDetails` function.
    - Contains `mailto:${email}` template literal.
    - Contains 3 social `<a>` elements with `aria-label` (Telegram, Instagram, Facebook) and `cursor-default`.
    - Imports `email`, `socials` from `../../../content/company`.
    - Imports `phone`, `address` from `../../../content/placeholders`.
    - Does NOT contain literal ЄДРПОУ digits, license date, or hardcoded email (D-38 + content boundary).
    - `npm run lint` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Replace src/pages/ContactPage.tsx with composed page (heading + subtitle + ContactDetails + mailto CTA)</name>
  <read_first>
    - src/pages/ContactPage.tsx (current Phase 1 stub — to be REPLACED)
    - src/components/sections/contact/ContactDetails.tsx (just created)
    - src/content/contact.ts (heading, subtitle, CTA label, **contactMailSubject** — added in plan 04-01 Task 4 per M-3)
    - src/content/company.ts (email)
    - src/components/sections/home/ContactForm.tsx (lines 28-31, 38-43 — primary CTA button + mailto subject pattern)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-36)
  </read_first>
  <files>src/pages/ContactPage.tsx</files>
  <action>
    Fully REPLACE `src/pages/ContactPage.tsx`:

    ```tsx
    /**
     * @module pages/ContactPage
     *
     * CTC-01 — Single-column centered contact page (D-36).
     *   <h1>Контакт</h1>
     *   <p>{contactPageSubtitle}</p>
     *   <ContactDetails />          — 4-row реквізити-block (D-37)
     *   <a mailto:>{contactPageCta}</a>  — primary CTA button, accent-fill
     *
     * Mailto subject reuses the home pattern (encodeURIComponent for cyrillic).
     * Subject literal is identical to Phase 3 home ContactForm — single dialog
     * thread per inquiry, dedup'd in the user's mail client.
     *
     * Default export preserved (App.tsx import unchanged).
     *
     * D-38: NO ЄДРПОУ duplication — Footer renders the trust block on every
     * route per Phase 1 D-06 (NAV-01 footer requirements).
     */

    import { email } from '../content/company';
    import {
      contactPageHeading,
      contactPageSubtitle,
      contactPageCta,
      contactMailSubject,
    } from '../content/contact';
    import { ContactDetails } from '../components/sections/contact/ContactDetails';

    export default function ContactPage() {
      const href = `mailto:${email}?subject=${encodeURIComponent(contactMailSubject)}`;

      return (
        <section className="bg-bg py-24">
          <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
            <header className="flex flex-col gap-4">
              <h1 className="font-bold text-6xl text-text">{contactPageHeading}</h1>
              <p className="text-base text-text-muted">{contactPageSubtitle}</p>
            </header>

            <ContactDetails />

            <div className="pt-4">
              <a
                href={href}
                className="inline-flex items-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {contactPageCta}
              </a>
            </div>
          </div>
        </section>
      );
    }
    ```

    NOTES:
    - DELETE the existing Phase 1 stub body entirely (centered H1 + Mark img placeholder).
    - **M-3 single-source:** the mailto subject literal lives in `src/content/contact.ts` as `contactMailSubject` (added by plan 04-01 Task 4). This page imports it; no inline `MAIL_SUBJECT` const. The literal is byte-identical to home ContactForm `MAIL_SUBJECT` so the mail client dedupes the thread.
    - If a future audit DRYs the home ContactForm too (move its inline `MAIL_SUBJECT` to `content/contact.ts` and import the same const), `contactMailSubject` is already the destination — no rename needed.
    - Default export name `ContactPage` retained.
    - Page is a single `<section>` with centered max-w-3xl content.
    - The CTA button uses identical accent-fill styling to home ContactForm.
  </action>
  <verify>
    <automated>grep -nE "export default function ContactPage" src/pages/ContactPage.tsx && grep -nE "<ContactDetails" src/pages/ContactPage.tsx && grep -nE 'mailto:\$\{email\}' src/pages/ContactPage.tsx && grep -nE "encodeURIComponent\\(contactMailSubject\\)" src/pages/ContactPage.tsx && grep -nE "contactPageHeading|contactPageSubtitle|contactPageCta|contactMailSubject" src/pages/ContactPage.tsx && ! grep -nE "import markUrl" src/pages/ContactPage.tsx && ! grep -E "vygoda\\.sales@gmail\\.com" src/pages/ContactPage.tsx && npm run build</automated>
  </verify>
  <done>
    - `src/pages/ContactPage.tsx` body fully replaced — Phase 1 stub gone (no Mark import).
    - Page imports email from company, the 3 contact strings from content/contact, and ContactDetails.
    - Page imports `contactMailSubject` from `../content/contact` and contains `mailto:${email}?subject=${encodeURIComponent(contactMailSubject)}` (M-3 single-source — no inline `MAIL_SUBJECT` const).
    - Page contains `<ContactDetails />`.
    - Page contains H1 from `contactPageHeading` + subtitle from `contactPageSubtitle` + CTA label from `contactPageCta`.
    - Default export name is `ContactPage`.
    - Does NOT contain the literal email string (sourced via import).
    - `npm run build` exits 0.
    - **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** (`npm run dev` → `/#/contact`):
      - H1 «Контакт» visible.
      - Subtitle «Напишіть нам, щоб обговорити проект.» visible (M-2: bare invitation, no «— без зобов'язань» trailing half-promise).
      - 4 dl rows: Email (active link with hover:text-accent), Телефон (—), Адреса (—), Соцмережі (3 grey icons with cursor-default).
      - Primary CTA button «Ініціювати діалог» on accent-fill — clicking opens mail client with subject pre-filled.
      - Footer (rendered by Layout) shows ЄДРПОУ / license / email — D-38 confirmed (no duplication on the page itself).
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **Files exist**: `src/components/sections/contact/ContactDetails.tsx` (new) + `src/pages/ContactPage.tsx` (refactored).

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline green**: `npm run build` exits 0 (full chain).

4. **Brand invariants**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.

5. **Content boundary**:
   - `! grep -nE "vygoda\\.sales@gmail\\.com" src/components/sections/contact/ src/pages/ContactPage.tsx` returns clean (email sourced via import).
   - `! grep -E "ЄДРПОУ|42016395|27\\.12\\.2019" src/components/sections/contact/ src/pages/ContactPage.tsx` returns clean (D-38).

6. **[Manual smoke per VALIDATION.md §Manual-Only Verifications]** Manual smoke checklist (`npm run dev`):
   - `/#/contact` → H1 + subtitle + 4 dl rows + mailto CTA button
   - Click email link in dl → mail client opens (subject empty — that's fine, the row is informational)
   - Click primary CTA button → mail client opens with subject «Ініціювати діалог через сайт ВИГОДА»
   - Click any social icon → no navigation (href='#'), cursor stays default
   - Tab through page — focus rings visible on all 4 anchors + the CTA button (focus-visible:outline-accent)

7. **Bundle delta**: expect +3-5 KB gzipped (small page + 1 leaf component, Send/Instagram/Facebook lucide icons).
</verification>

<success_criteria>
- CTC-01 closed: /contact renders email mailto + phone/address em-dash placeholders + 3 disabled social icons + primary mailto CTA.
- All ROADMAP §Phase 4 Success Criteria #4 (mailto active, phone/address —, socials href="#") end-to-end functional.
- D-38 honored: no ЄДРПОУ duplication on the page (Footer is the single source on every route).
- Content boundary: zero hardcoded email/phone/address/ЄДРПОУ literals in /contact source.
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-08-SUMMARY.md` documenting:
- 2 file paths (1 new component + 1 page replacement)
- Decision IDs implemented (D-36, D-37, D-38)
- Lucide icon choices: confirm whether `Instagram` and `Facebook` named exports exist in lucide-react v1.11 (or fallback to MessageCircle/Globe)
- Any rule-3 doc-block self-consistency fixes
- `npm run lint` and `npm run build` exit codes
- Bundle delta
- Manual smoke results: 4 dl rows visible, mailto CTA pre-fills correct subject, social icons disabled-styled, Footer trust-block coexists without duplication
</output>
