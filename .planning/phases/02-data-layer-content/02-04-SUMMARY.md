---
phase: 02-data-layer-content
plan: 04
subsystem: content
tags: [typescript, content, methodology, brand-values, company-legal, placeholders, concept-section-8, concept-section-11]

requires:
  - phase: 02-data-layer-content
    provides: MethodologyBlock and BrandValue interfaces from src/data/types.ts (Plan 02-01)
provides:
  - src/content/methodology.ts — methodologyBlocks (7 records, verbatim CONCEPT §8 bodies; blocks 2/5/6 flagged needsVerification:true per D-16)
  - src/content/values.ts — brandValues (4 records in canonical order per brand-system §1 / CONCEPT §2)
  - src/content/company.ts — legalName ('ТОВ «БК ВИГОДА ГРУП»'), edrpou ('42016395'), licenseDate ('27.12.2019'), licenseNote ('(безстрокова)'), email ('vygoda.sales@gmail.com'), socials (telegram/instagram/facebook → '#')
  - src/content/placeholders.ts — phone ('—'), address ('—'), pipeline4Title ('Без назви'), etnoDimAddress ('—') as the single audit surface for CONCEPT §11.1/§11.2/§11.3/§11.8 open items
affects: [phase-03-brand-primitives-home, phase-04-portfolio-zhk-log-contact, phase-02-check-brand-ci]

tech-stack:
  added: []
  patterns:
    - "editorial-only-under-src-content (D-15)"
    - "type-only imports from src/data/types.ts (MethodologyBlock, BrandValue)"
    - "@rule IMPORT BOUNDARY doc-block on every content module (D-34)"
    - "verbatim CONCEPT §8 bodies (no paraphrasing); ⚠-flag encoded as boolean needsVerification (D-16)"
    - "single audit surface for §11 open items as one file of named consts (D-19)"
    - "raw em-dash U+2014 as public placeholder value — never template-token literals"
    - "socials placeholder scaffold with href='#' per CTC-01 (D-18)"
    - "self-contradicting doc-block policy — describe the denylist policy without including the banned literals inline, so the future Plan 02-05 check-brand grep stays clean"

key-files:
  created:
    - src/content/methodology.ts
    - src/content/values.ts
    - src/content/company.ts
    - src/content/placeholders.ts
  modified: []

key-decisions:
  - "methodology.ts block bodies copied verbatim from КОНЦЕПЦІЯ-САЙТУ.md §8 — no rewording or truncation, typographic apostrophes (’) and guillemets («») preserved"
  - "Doc-blocks in values.ts and placeholders.ts rephrased so they do NOT contain the forbidden-lexicon or banned-token literals they describe — this preserves acceptance-criterion purity and keeps Plan 02-05 check-brand denylist clean when it greps src/ and dist/"
  - "company.ts uses 5 top-level named consts + 1 socials object instead of a single frozen bundle — named exports make grep/refactor easier and match RESEARCH §Named exports convention"
  - "placeholders.ts is a leaf module (zero imports); its values are plain strings and raw em-dashes (U+2014 verified at runtime), never {{token}} literals"
  - "Four-module split (methodology/values/company/placeholders) kept separate rather than a single content/index.ts — satisfies D-15 and keeps each open-item cluster independently re-editable"

patterns-established:
  - "src/content/ houses ALL user-facing editorial copy; Phase 3/4 pages import named consts rather than writing Ukrainian paragraphs as JSX literals (PITFALLS §Pitfall 7 prevention)"
  - "needsVerification:true records render a ⚠ visual marker in UI — the flag is data, not string-embedded"
  - "Open client questions from CONCEPT §11 have a single file as their audit surface; client opens placeholders.ts and sees every pending answer on one page"
  - "When the client confirms a value, a one-line edit in placeholders.ts ripples across every consumer in the next build — no component touches needed"

requirements-completed:
  - CON-01

duration: 4min
completed: 2026-04-24
---

# Phase 2 Plan 04: Content Modules Summary

**Four editorial content modules shipped under src/content/ — methodologyBlocks (7 verbatim CONCEPT §8 blocks with ⚠-flags on 2/5/6), brandValues (4 canonical values), company legal consts (ТОВ/ЄДРПОУ/ліцензія/email/socials scaffold), and placeholders (4 em-dash audit-surface consts for §11 open items). Zero React/motion imports, all four have @rule IMPORT BOUNDARY doc-blocks, `npm run lint` passes.**

## Performance

- **Duration:** ~4 min (215 s)
- **Started:** 2026-04-24T19:10:51Z
- **Completed:** 2026-04-24T19:14:26Z
- **Tasks:** 3
- **Files modified:** 4 (all created)

## Accomplishments

- `src/content/methodology.ts` — 7 `MethodologyBlock` records; indices 1..7 in order; bodies verbatim from КОНЦЕПЦІЯ-САЙТУ.md §8 (no paraphrasing, no truncation); blocks 2, 5, 6 flagged `needsVerification: true` per D-16 / CONCEPT §11.5; block 2 body includes `ЄДРПОУ 42016395` + `27.12.2019` line exactly as in source.
- `src/content/values.ts` — 4 `BrandValue` records in canonical order (Системність · Доцільність · Надійність · Довгострокова цінність); tone-compliant (no forbidden-lexicon words in file text or doc-block); type-only import from `../data/types`.
- `src/content/company.ts` — 6 named exports: `legalName`, `edrpou`, `licenseDate`, `licenseNote`, `email` as `as const` string literals + `socials` object with `telegram`/`instagram`/`facebook` → `'#'` placeholders per CTC-01.
- `src/content/placeholders.ts` — 4 named string consts with em-dash (U+2014) / «Без назви» values; zero imports; zero `{{` / `}}` template-token literals; doc-block maps each const to CONCEPT §11.x source.
- Runtime-verified via `tsx` eval: all 4 modules import, `methodologyBlocks.filter(b => b.needsVerification).map(b => b.index).sort()` = `[2,5,6]`; `phone.charCodeAt(0) === 0x2014`.

## Task Commits

Each task committed atomically with `--no-verify` (parallel-agent protocol):

1. **Task 1: Create src/content/methodology.ts (7 blocks from CONCEPT §8 with ⚠ flags on 2/5/6)** — `c926291` (feat)
2. **Task 2: Create src/content/values.ts (4 brand values) and src/content/company.ts (legal facts)** — `2eb36a9` (feat)
3. **Task 3: Create src/content/placeholders.ts (single audit surface for §11 open items)** — `f498c2f` (feat)

_All three tasks had `tdd="true"` in the plan, but they ship pure declarative data (typed consts, no logic). There is no behavior under test here; acceptance was verified via grep counts + runtime `tsx` import assertions, as the plan's `<acceptance_criteria>` and `<verify>` blocks specified. This matches the plan's stated verification approach; no separate test files are created for static content._

## Files Created/Modified

- `src/content/methodology.ts` (created) — 7 `MethodologyBlock` records; source of truth for Phase 3 `MethodologyTeaser` and v2 `/how-we-build`
- `src/content/values.ts` (created) — 4 `BrandValue` records; source of truth for Phase 3 `BrandEssence`
- `src/content/company.ts` (created) — legal facts; consumers: Phase 1 `Footer` (NAV-01), Phase 3 Trust block (HOME-06), Phase 4 `ContactPage` (CTC-01)
- `src/content/placeholders.ts` (created) — open-item audit surface; consumers: Phase 4 ZhkPage (etnoDimAddress), ContactPage (phone/address), hub-card for Pipeline-4 (pipeline4Title)

## Decisions Made

- **Verbatim-copy of CONCEPT §8 bodies.** No paraphrasing, no shortening, typographic apostrophes (U+2019) and guillemets («/») preserved. The plan explicitly mandated verbatim, and the content is already brand-tone-compliant in the source.
- **Doc-block self-consistency.** In `values.ts` and `placeholders.ts`, the doc-block describes the forbidden-lexicon / banned-token policy WITHOUT including the banned literals inline. This keeps the file clean for Plan 02-05's check-brand CI (which will grep `src/` for the same patterns), and keeps the current acceptance greps passing. Rationale logged as deviation #1 and #2 below.
- **`as const` on company legal literals.** Gives future consumers narrow string types (`'42016395'` rather than `string`) — cheap correctness guard for facts that should never drift.
- **No premature helper abstraction.** `socials` stays a plain typed object with three keys — not a `Record<SocialChannel, string>` or a function. D-18 locks the 3-channel scaffold; premature genericity would just add cost.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Rephrased values.ts doc-block to avoid forbidden-lexicon literals inline.**

- **Found during:** Task 2 (values.ts acceptance verification).
- **Issue:** The plan's `<action>` block contained a doc-block reading `«мрія», «найкращий», «унікальний»` — exactly the strings the plan's own `<acceptance_criteria>` greps for and requires to be absent (`grep -cE "мрія|найкращий|унікальний|..." src/content/values.ts` must return `0`). Ship-as-written → 2 hits → criterion fails. Additionally Plan 02-05's `check-brand` CI will re-run this grep against `src/` and fail the build.
- **Fix:** Replaced the naming-the-banned-words doc-block phrasing with `Тон: стримано, предметно, без маркетингових суперлативів (forbidden-lexicon list — brand-system §1)`. Preserves policy reference; removes the banned literals from source text.
- **Files modified:** `src/content/values.ts` (doc-block only — data records untouched).
- **Verification:** `grep -cE "мрія|найкращий|унікальний|преміальний стиль життя" src/content/values.ts` → `0`. All 4 `BrandValue` records + `@rule IMPORT BOUNDARY` preserved.
- **Committed in:** `2eb36a9` (Task 2 commit, single commit covers fix + file creation).

**2. [Rule 3 — Blocking] Rephrased placeholders.ts doc-block to avoid `{{` / `}}` literals inline.**

- **Found during:** Task 3 (placeholders.ts acceptance verification, preemptive — same class of issue as #1 above).
- **Issue:** The plan's `<action>` block contained the phrases "`{{phone}}` / `{{address}}` / any `{{token}}`" in the doc-block. The plan's own `<acceptance_criteria>` requires `grep -c "{{" src/content/placeholders.ts` to return `0` (and `grep -c "}}"` = `0`). Plan 02-05's check-brand CI will also grep `dist/` for `{{` per PROJECT.md QA-04.
- **Fix:** Replaced the literal example with a description — "double-brace tokens" — and removed the inline example strings from the doc-block. Policy and §11-mapping preserved.
- **Files modified:** `src/content/placeholders.ts` (doc-block only).
- **Verification:** `grep -c "{{" src/content/placeholders.ts` → `0`; `grep -c "}}" src/content/placeholders.ts` → `0`. All 4 named consts + `@rule IMPORT BOUNDARY` preserved.
- **Committed in:** `f498c2f` (Task 3 commit).

---

**Total deviations:** 2 auto-fixed (both Rule 3 — Blocking: plan prose contradicted its own acceptance criterion).
**Impact on plan:** No scope change, no data change. Only doc-block wording shifted. Every acceptance criterion now passes, and the Plan 02-05 check-brand CI will find zero matches when it greps these files for forbidden lexicon / template tokens. Both fixes are strictly about keeping the source-level denylist clean.

## Issues Encountered

- None beyond the two self-contradicting doc-block issues handled as Rule 3 deviations above. `tsc --noEmit` (project's `lint` script) passed first-run on each task. Runtime `tsx` import-and-assert checks all passed.

## User Setup Required

None — these are pure TypeScript content modules with no external services, no environment variables, no credentials.

## Next Phase Readiness

- **Plan 02-05 (check-brand CI) — READY.** The two doc-block rephrasings above mean `src/content/` contains zero forbidden-lexicon literals and zero `{{` tokens. When Plan 02-05's `scripts/check-brand.ts` greps `src/` for brand rules + placeholder tokens, it will find the content modules clean. One less false-positive to triage.
- **Phase 3 consumers — READY.** `methodologyBlocks`, `brandValues`, `legalName`/`edrpou`/`licenseDate`/`licenseNote`/`email` are in place for `MethodologyTeaser` (HOME-05), `BrandEssence` (HOME-02), Trust block (HOME-06), and `Footer` (NAV-01). Phase 3 pages will import named consts — never write Ukrainian paragraphs as JSX literals.
- **Phase 4 consumers — READY.** `etnoDimAddress`, `phone`, `address`, `pipeline4Title`, `socials` are in place for `ZhkPage` (etno-dim), `ContactPage`, Hub page Pipeline-4 row.
- **Pending client confirmations (tracked, non-blocking):** CONCEPT §11.1 (phone), §11.2 (address), §11.3 (Pipeline-4 name), §11.5 (methodology blocks 2/5/6 verification), §11.8 (Etno Dim вул. Судова). All have audit-surface consts; one-line edits propagate.

## Self-Check: PASSED

- `src/content/methodology.ts` exists.
- `src/content/values.ts` exists.
- `src/content/company.ts` exists.
- `src/content/placeholders.ts` exists.
- Commit `c926291` present: `feat(02-04): add methodology content module (7 blocks from CONCEPT §8)`.
- Commit `2eb36a9` present: `feat(02-04): add brand values + company legal content modules`.
- Commit `f498c2f` present: `feat(02-04): add placeholders module (single audit surface for §11 open items)`.
- `npm run lint` exits `0`.
- Runtime content-integrity assertion (all 4 modules imported, 8 invariants checked) prints `content modules OK`.
- `grep -rE "from ['\"]react['\"]|from ['\"]motion|from ['\"].*components[/'\"]|from ['\"].*hooks[/'\"]|from ['\"].*pages[/'\"]" src/content/` — empty output (boundary clean).

---
*Phase: 02-data-layer-content*
*Completed: 2026-04-24*
