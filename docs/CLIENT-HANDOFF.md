# Client Handoff — Pre-deploy checklist

> **Status:** Phase 6 — items the user must confirm with the client BEFORE merging Phase 6 to `main`.
> Phase 7 will EXTEND this document with the remaining 8 open §11 client items.

## Item 1: GitHub-account confirmation (Phase 6 D-26 + D-38)

Phase 6 ships with hardcoded production URLs pointing to `https://yaroslavpetrukha.github.io/vugoda-website/` (Phase 6 CONTEXT.md §D-21, §D-23, §D-31). If the user's GitHub account name is **NOT** `yaroslavpetrukha`, the following hardcoded occurrences MUST be edited in a single PR before deploying.

**Replacement value:** if the actual account is `<account>`, replace `yaroslavpetrukha` with `<account>` in:

| File | Line shape | Count |
|------|------------|-------|
| `index.html` | `<meta property="og:url" content="https://yaroslavpetrukha.github.io/vugoda-website/" />`<br/>`<meta property="og:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<meta name="twitter:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<link rel="canonical" href="https://yaroslavpetrukha.github.io/vugoda-website/" />` | 4 occurrences |
| `.lighthouserc.cjs` | The `ci.collect.url` array — 5 URLs, all under `https://yaroslavpetrukha.github.io/vugoda-website/...` | 5 occurrences |
| (no other source files affected) | `src/content/mobile-fallback.ts` and `src/data/projects.ts` reference `yaroslavpetrukha.github.io/Lakeview/` (the EXTERNAL Lakeview site, NOT the vugoda-website demo) — these do **NOT** change with this account swap. | 0 (do not edit) |

**Total edits:** 9 line changes across 2 files (index.html + .lighthouserc.cjs).

**One-line `sed` to apply:**

```bash
sed -i.bak "s/yaroslavpetrukha\\.github\\.io\\/vugoda-website/<account>.github.io\\/vugoda-website/g" index.html .lighthouserc.cjs
```

Replace `<account>` with the actual GitHub account name. The `.bak` files are backups in case of typo; delete them after a successful build (`rm index.html.bak .lighthouserc.cjs.bak`).

**Verification after edit:**

1. `npm run build` exits 0 with `[check-brand] 7/7 checks passed`
2. `grep -r "yaroslavpetrukha.github.io/vugoda-website" index.html .lighthouserc.cjs` returns NO MATCHES (replacement complete)
3. `grep -r "<account>.github.io/vugoda-website" index.html .lighthouserc.cjs` returns the expected 9 occurrences
4. The `og:url`, `og:image`, `twitter:image`, and `canonical` URLs all resolve to the new account's GH Pages
5. The Lakeview external link in `src/content/mobile-fallback.ts` and `src/data/projects.ts` STILL points to `https://yaroslavpetrukha.github.io/Lakeview/` (this is the Lakeview product site owned by Yaroslav, separate from the corporate site)

### Why this is hardcoded in v1 (and not env-driven)

Per Phase 6 CONTEXT.md §D-26: env-driven URLs (e.g., reading from `OG_URL` env var, with `vite.config.ts` `transformIndexHtml` hook to substitute at build time) are deferred to v2. Trade-offs:

| Hardcoded (v1, current) | Env-driven (v2, deferred) |
|-------------------------|---------------------------|
| Simple — visible in source, auditable, no Vite plugin gymnastics | More flexible — one-PR account/domain swap, but adds a build-time templating layer |
| One-time edit if account differs (this checklist) | Zero edits per environment but need to set `OG_URL=...` in CI + local dev |
| Sufficient for a 5-URL demo handoff | Useful when adding custom domain (v2 INFR2-02) |

The recommended migration trigger is the v2 custom domain switch — at that point `og:url` etc. will move from `*.github.io` to `vugoda.com.ua` (or similar) and an env var is the natural way to manage the change.

## Phase 7 will extend this document

Phase 7 (post-deploy QA & client handoff) ships the 8 open KOНЦЕПЦІЯ-САЙТУ.md §11 items in this same file:

- Phone (em-dash placeholder)
- Юр. адреса (em-dash placeholder)
- Pipeline-4 фінальна назва (currently «Без назви»)
- Model-Б stage-bucket confirmation
- Methodology §8 blocks 2/5/6 verification (currently flagged with warning marker)
- Slug transliteration: `maietok` vs `maetok` for Маєток Винниківський
- «NTEREST» without «I» — confirm or reject
- Етно Дім вул. Судова — confirm or correct address

These are NOT Phase 6 scope — Phase 6 ships the GitHub-account confirmation only.

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

