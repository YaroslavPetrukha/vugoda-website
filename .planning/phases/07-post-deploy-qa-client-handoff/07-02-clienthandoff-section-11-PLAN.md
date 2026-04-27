---
phase: 07-post-deploy-qa-client-handoff
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/CLIENT-HANDOFF.md
autonomous: true
requirements_addressed: [CON-01]

must_haves:
  truths:
    - "docs/CLIENT-HANDOFF.md contains a new H2 section «§11 — Open Client Items» appearing AFTER the existing «Phase 7 will extend this document» note (existing line 48)"
    - "The §11 section contains a 4-column markdown table with exactly 8 data rows covering: Phone, Юр. адреса, Pipeline-4 назва, Модель-Б confirmation, Methodology blocks 2/5/6, Маєток slug, NTEREST spelling, Етно Дім адреса"
    - "The dev appendix follows the §11 table inside a collapsed <details>/<summary> block, mapping each of 8 items to the file path + edit shape"
    - "The pre-existing Phase 6 GH-account-confirmation section (lines 1-46) is UNCHANGED"
  artifacts:
    - path: "docs/CLIENT-HANDOFF.md"
      provides: "Single client-facing handoff doc — Phase 6 GH-account section (unchanged) + Phase 7 §11 8-row open-items table + dev appendix"
      contains: "§11 — Open Client Items"
  key_links:
    - from: "docs/CLIENT-HANDOFF.md §11"
      to: "src/content/placeholders.ts"
      via: "dev appendix file-path reference (most items map here)"
      pattern: "src/content/placeholders\\.ts"
    - from: "docs/CLIENT-HANDOFF.md §11 item 5"
      to: "src/content/methodology.ts"
      via: "dev appendix needsVerification flag reference"
      pattern: "needsVerification"
---

<objective>
Append a new H2 section «§11 — Open Client Items» to `docs/CLIENT-HANDOFF.md` containing the 8 open KOНЦЕПЦІЯ-САЙТУ.md §11 items as a UA-language 4-column client-facing table, followed by a collapsed dev appendix mapping each answer to file edits.

Purpose: Closes Phase 7 SC#5 («`docs/CLIENT-HANDOFF.md` exists listing all 8 open CONCEPT §11 items»). Single client-facing form for one-pass answer (8 items in one email/chat reply per D-31). Dev appendix is post-handoff edit guide — answers happen AFTER client responds, NOT in Phase 7 (per Deferred ideas «Apply 8 §11 answers to code»).
Output: `docs/CLIENT-HANDOFF.md` extended (existing GH-account section preserved verbatim).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@docs/CLIENT-HANDOFF.md
@src/content/placeholders.ts
@src/content/methodology.ts
@src/data/projects.ts

<interfaces>
<!-- Existing CLIENT-HANDOFF.md structure (Phase 6 D-26/D-38, untouched in Phase 7): -->
<!--   Lines 1-46:  Phase 6 «Item 1: GitHub-account confirmation» + sed snippet + verification steps -->
<!--   Lines 48-61: «Phase 7 will extend this document» note + 8-bullet preview -->
<!-- Phase 7 appends AFTER line 61 (after the existing 8-bullet note), preserving everything before. -->

<!-- Em-dash placeholder convention (Phase 2 D-19): src/content/placeholders.ts is the SOT. -->
<!-- Most §11 answers replace single-line `'—'` values there. -->

<!-- needsVerification: true flag (Phase 2 Plan 02-04 + Phase 3 Plan 03-06): -->
<!-- src/content/methodology.ts blocks 2, 5, 6 carry `needsVerification: true`; -->
<!-- MethodologyTeaser renders ⚠ marker conditionally (zero rendered today since FEATURED_INDEXES = [1,3,7]). -->
<!-- Item 5 in §11 maps here: client confirmation -> set false on those 3 blocks. -->

<!-- Маєток slug (Phase 2 Plan 02-02): -->
<!-- src/data/projects.ts uses `slug: 'maietok-vynnykivskyi'` for Маєток Винниківський. -->
<!-- Item 6 in §11: client may confirm or change to `'maetok-vynnykivskyi'`. -->

<!-- NTEREST title (Phase 2 Plan 02-02): -->
<!-- src/data/projects.ts uses `title: 'NTEREST'` (without leading "I"). -->
<!-- Item 7 in §11: client confirms intentional or changes to «INTEREST». -->

<!-- Етно Дім address (Phase 2 Plan 02-02 + Phase 4 ZhkFactBlock): -->
<!-- src/data/projects.ts Etno Dim record's `address` field (currently «вул. Судова, Львів»). -->
<!-- Item 8 in §11: client confirms or corrects. -->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Append §11 H2 section + 8-row client-facing table to docs/CLIENT-HANDOFF.md</name>
  <files>docs/CLIENT-HANDOFF.md</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-27, D-28, D-29 — append-not-rewrite + 4-col schema + verbatim 8 rows)
    - docs/CLIENT-HANDOFF.md (current file — confirm Phase 6 lines 1-46 are intact + line 48 «Phase 7 will extend this document» note exists)
  </read_first>
  <action>
    Per D-27 (extension, not rewrite) + D-28 (4-column schema) + D-29 (verbatim 8 rows):

    1. Read current `docs/CLIENT-HANDOFF.md` to confirm structure:
       - Lines 1-46: Phase 6 GH-account-confirmation section — DO NOT MODIFY
       - Line 48: `## Phase 7 will extend this document` H2 header
       - Lines 49-61: 8-bullet preview of items
       - File ends ~line 61

    2. APPEND (do NOT replace existing content) the following content at the end of the file (immediately after the last line of the existing file; add a blank line for separation if not already present):

       ```markdown

       ---

       ## §11 — Open Client Items

       > **Status:** Phase 7 — single-pass form for client to answer all 8 outstanding КОНЦЕПЦІЯ-САЙТУ.md §11 items.
       > Answer these in one email/chat reply. Each item shows the current placeholder value + what visibly changes after your answer + suggested priority.
       > Priority labels (P0/P1/P2) are advisory — they do NOT block the demo URL handoff. The demo intentionally ships WITH em-dashes and ⚠ flags visible (системний девелопмент: не вдавати визначеності, якої немає).

       | # | Питання клієнту | Поточне значення | Що зміниться після відповіді | Пріоритет |
       |---|-----------------|------------------|------------------------------|-----------|
       | 1 | Корпоративний телефон | — | Відобразиться у футері + на `/contact` | P1 |
       | 2 | Юридична / поштова адреса | — | Відобразиться у футері + на `/contact` + у блоці довіри на головній | P1 |
       | 3 | Назва Pipeline-4 (без назви на сьогодні) | «Без назви» | Відобразиться як назва картки в агрегативному рядку на `/projects` + на головній | P2 |
       | 4 | Підтвердження Моделі-Б для стадій («У розрахунку» / «У погодженні» / «Будується» / «Здано») — формулювання правильне? | Модель-Б 4 бакети | Якщо зміна — оновлюється фільтр на `/projects` + бейджі на картках | P2 |
       | 5 | Верифікація методології §8, блоки 2 / 5 / 6 (зараз позначені знаком ⚠) — текст коректний? | ⚠-flag на 3 блоках | Зніметься ⚠-маркер у Methodology teaser на головній (blocks 2/5/6 будуть виглядати як інші) | P1 |
       | 6 | Транслітерація slug Маєтку: `maietok-vynnykivskyi` чи `maetok-vynnykivskyi`? | `maietok-vynnykivskyi` | URL картки на `/projects` (не активний у v1, готується до v2 повної сторінки) | P2 |
       | 7 | Написання «NTEREST» — без літери «I» свідоме? | NTEREST | Назва картки на `/projects`; підтвердження або заміна на «INTEREST» | P1 |
       | 8 | Адреса ЖК Етно Дім (зараз вул. Судова, Львів) — підтверджено? | вул. Судова, Львів | Відобразиться у факт-блоці на `/zhk/etno-dim` | P1 |
       ```

       Notes on the table content (D-29 verbatim):
       - Column headers in UA: «Питання клієнту» / «Поточне значення» / «Що зміниться після відповіді» / «Пріоритет»
       - Em-dashes in column 2 are literal U+2014 characters, NOT `{{token}}` (D-28 + Phase 2 D-19)
       - «Без назви» wrapped in « » (Cyrillic guillemets U+00AB/U+00BB)
       - Row order matches PROJECT.md «Відкриті питання» source-document order (D-29 lock; planner's discretion to re-sort by priority was NOT exercised — keeps client's reading flow)
       - Column 3 is plain UA prose; NO file-path or code references (per D-28 column-3 rule — those go in dev appendix)

    3. After the table, append the dev appendix (Task 2 will populate; this task creates the wrapper).

    Self-consistency pre-screen (recurring planner-template smell from Plans 02-04..03-07):
    - This file is a `docs/` doc, NOT under `src/` — so `scripts/check-brand.ts` `paletteWhitelist()` / `denylistTerms()` do NOT scan it.
    - However, the file COULD trip Phase 6 lhci/build if it contained the literal `Pictorial`/`Rubikon`/`Пикторіал`/`Рубікон` words (CI grep is over `dist/`, NOT `docs/`, so safe). Verify the appended content has none.
    - The appended text MUST NOT contain bare `{{` or `TODO` literals (the §11 table «Поточне значення» column shows literal em-dashes, not `{{token}}`).
  </action>
  <verify>
    <automated>grep -c "## §11 — Open Client Items" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "Корпоративний телефон" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "Юридична / поштова адреса" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "maietok-vynnykivskyi" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "NTEREST" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "вул. Судова, Львів" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "Item 1: GitHub-account confirmation" docs/CLIENT-HANDOFF.md | grep -q "^1$" && ! grep -E "Pictorial|Rubikon|Пикторіал|Рубікон" docs/CLIENT-HANDOFF.md</automated>
  </verify>
  <done>
    docs/CLIENT-HANDOFF.md contains the existing Phase 6 GH-account section (unchanged) + new H2 «§11 — Open Client Items» + 8-row table with all required Cyrillic strings; no denylist literals introduced.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Append dev appendix mapping each of 8 items to file edits (collapsed details block)</name>
  <files>docs/CLIENT-HANDOFF.md</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-30 dev appendix shape — verbatim 8 sub-sections)
    - src/content/placeholders.ts (most items map to single-line edits here)
    - src/content/methodology.ts (item 5: needsVerification flag on blocks 2/5/6)
    - src/data/projects.ts (items 6, 7, 8: slug, title, address fields)
    - docs/CLIENT-HANDOFF.md (verify §11 table from Task 1 is in place)
  </read_first>
  <action>
    Per D-30 + planner discretion (collapsed `<details>` per recurring CONTEXT note "collapsed is recommended; planner picks"):

    Append the following dev appendix immediately AFTER the §11 8-row table from Task 1. Use HTML `<details>` for collapsibility (renders cleanly on GitHub web markdown).

    ```markdown

    <details>
    <summary><strong>Developer appendix: client answer → file edit (8 items)</strong></summary>

    > Post-handoff workflow: when the client replies, dev applies the edit listed below per item, runs `npm run build` (postbuild check-brand 7/7 must pass), pushes to main → CI deploys → existing lhci CI gate confirms no regression. NO Phase 7 re-run unless an answer introduces new a11y risk (e.g., very long phone number breaks footer layout — re-run `npm run audit:a11y`).

    ### Item 1: Phone

    **File:** `src/content/placeholders.ts`
    **Edit:** Replace the `phone: '—'` export's value `'—'` with the answered number (UA mobile format `+380 XX XXX XX XX`).
    **Verify:** `grep -n "phone" src/content/placeholders.ts` shows the new value; footer + `/contact` render the number instead of em-dash.

    ### Item 2: Юридична / поштова адреса

    **File:** `src/content/placeholders.ts`
    **Edit:** Replace the `address: '—'` (or equivalent address-placeholder export) value with the answered address string.
    **Verify:** `grep -n "address" src/content/placeholders.ts`; footer + `/contact` + home TrustBlock render the address.

    ### Item 3: Pipeline-4 назва

    **File:** `src/data/projects.ts`
    **Edit:** Find the Pipeline-4 record (currently `title: 'Без назви'`) and replace with the answered name.
    **Note:** `src/content/placeholders.ts` `pipeline4Title` MAY also need update if it duplicates the literal — `grep -rn "Без назви" src/` to find all occurrences.
    **Verify:** `/projects` aggregate row + home PortfolioOverview show new name.

    ### Item 4: Модель-Б confirmation

    **File:** none (if confirmed as-is) OR `src/lib/stages.ts` (if a bucket label changes)
    **Edit:** If client confirms current 4 buckets verbatim — NO code change; update `.planning/PROJECT.md` «Key Decisions» table to mark «Confirmed». If a label changes, edit the corresponding entry in `src/lib/stages.ts` STAGES const.
    **Verify:** `/projects` StageFilter chips + card badges show updated label (or unchanged).

    ### Item 5: Methodology blocks 2/5/6 verification

    **File:** `src/content/methodology.ts`
    **Edit:** Set `needsVerification: false` on blocks at indices 2, 5, 6 (after client confirms text — body copy stays as-is per Phase 2 D-15 verbatim §8).
    **Verify:** `grep -c "needsVerification: true" src/content/methodology.ts` returns `0`. ⚠ marker disappears in MethodologyTeaser on `/` (currently rendered conditionally per Plan 03-06; today renders zero ⚠ because FEATURED_INDEXES = [1,3,7], but `/how-we-build` v2 page will benefit).

    ### Item 6: Маєток slug

    **Files (only if changed from `maietok-vynnykivskyi` to `maetok-vynnykivskyi`):**
    - `src/data/projects.ts` — Маєток record's `slug` field
    - `scripts/copy-renders.ts` translit map — verify the map produces the new slug for the source folder `/renders/ЖК Маєток Винниківський/`
    - `public/renders/maietok-vynnykivskyi/` directory will need to be regenerated as `public/renders/maetok-vynnykivskyi/` via `npm run prebuild`
    **Verify:** `grep -r "maietok" src/` returns zero (if the change is applied); `npm run build` exits 0; the v1 card URL on `/projects` uses the new slug (card is not active in v1 but URL is referenced for v2 full page).

    ### Item 7: NTEREST spelling

    **File:** `src/data/projects.ts`
    **Edit:** Currently `title: 'NTEREST'`. If client confirms intentional — NO change. If client wants «INTEREST» — replace.
    **Verify:** Card on `/projects` shows the chosen spelling.

    ### Item 8: Етно Дім адреса

    **File:** `src/data/projects.ts`
    **Edit:** Etno Dim record's `address` field (currently «вул. Судова, Львів»). Replace with confirmed address.
    **Verify:** `/zhk/etno-dim` ZhkFactBlock renders the new address.

    </details>
    ```

    Notes on appendix shape (D-30):
    - Each of 8 sub-sections has H3 header + File + Edit + Verify (Item 1 has a 4th Re-deploy line; planner discretion: collapse Re-deploy into common preamble at top of <details> block to avoid 8× repetition — DONE in the preamble paragraph above).
    - Items 1, 2, 3, 5, 7, 8 are single-file edits.
    - Item 4 has a no-code path (PROJECT.md only).
    - Item 6 is the largest: 3 file paths + a directory regen.
    - The `<details>`/`<summary>` HTML wrapping renders correctly on GitHub web markdown (collapsed by default, expandable on click) — keeps client-facing table the visual focus per D-30.

    Self-consistency pre-screen:
    - Appendix mentions `Pictorial`/`Rubikon` ZERO times — safe.
    - No `{{token}}` literals — em-dashes are display strings.
    - No `TODO` literals.
  </action>
  <verify>
    <automated>grep -c "Developer appendix: client answer" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "### Item 1: Phone" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "### Item 5: Methodology blocks 2/5/6" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "### Item 8: Етно Дім адреса" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "needsVerification: false" docs/CLIENT-HANDOFF.md | grep -q "^1$" && grep -c "src/content/placeholders.ts" docs/CLIENT-HANDOFF.md | awk '$1 >= 2 { exit 0 } { exit 1 }' && ! grep -E "Pictorial|Rubikon" docs/CLIENT-HANDOFF.md</automated>
  </verify>
  <done>
    docs/CLIENT-HANDOFF.md contains the dev appendix as a `<details>` block with all 8 H3 sub-sections (Phone, Юр. адреса, Pipeline-4, Модель-Б, Methodology, Маєток slug, NTEREST, Етно Дім); each sub-section names the correct file path and edit shape; no denylist literals; collapsed by default on GitHub web.
  </done>
</task>

</tasks>

<verification>
- `docs/CLIENT-HANDOFF.md` contains exactly ONE «§11 — Open Client Items» H2 header
- `docs/CLIENT-HANDOFF.md` contains exactly ONE «Developer appendix: client answer → file edit» summary
- The 8-row §11 table is intact (8 «| ` rows starting with the row number 1..8 in column 1)
- All 8 H3 dev-appendix headers exist (Item 1 through Item 8)
- Phase 6 GH-account section (lines 1-46 of the file as it existed pre-Phase 7) is preserved verbatim — the literal string «Item 1: GitHub-account confirmation» still occurs exactly once
- No denylist terms (Pictorial / Rubikon / Пикторіал / Рубікон) introduced
</verification>

<success_criteria>
- Phase 7 SC#5 evidence: `docs/CLIENT-HANDOFF.md` lists all 8 open §11 items with current placeholder + change-after-answer + priority
- One-pass client form (D-31): client can answer all 8 in one email/chat reply by referencing item numbers
- Post-handoff edit playbook ready: dev appendix maps each answer to a single-PR change
- Plan 07-09 (final verification doc) can cite this file's §11 section as SC#5 closure pointer
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-02-SUMMARY.md`.
</output>
