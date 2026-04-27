# Phase 7: Post-deploy QA & Client Handoff — Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Verification + handoff phase. NO new REQ-IDs, NO new features, NO new code surfaces. The site is functionally complete after Phase 6 ships; Phase 7 runs the «Looks-Done-But-Isn't» checklist against the deployed URL (not localhost), produces machine-readable evidence (axe-core JSON, lhci CI artifact, layout screenshots), absorbs and closes the 5 outstanding Phase 6 HUMAN-UAT items, and consolidates the 8 open КОНЦЕПЦІЯ-САЙТУ.md §11 client questions into a single-pass form inside the existing `docs/CLIENT-HANDOFF.md`.

The 5 Phase 7 success criteria translate to verification artifacts:

1. **SC#1 — Keyboard-only walkthrough** of all 5 production routes on the deployed URL: every interactive element reachable, visible `:focus-visible` outline, no focus traps, `Esc` closes lightbox.
2. **SC#2 — Hard-refresh deep-link** of every production URL works from a cold incognito tab: `/#/`, `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact`, plus `/#/zhk/unknown` (proper 404/redirect).
3. **SC#3 — Build-output grep audit + axe-core** per route reports zero critical a11y issues.
4. **SC#4 — Lighthouse desktop ≥90 archived** per route; layout verified at 1280 / 1366 / 1440 / 1920 widths; mobile fallback rendered correctly at <1024px (DevTools or real iPhone viewport).
5. **SC#5 — `docs/CLIENT-HANDOFF.md` extends** with all 8 open §11 items as a one-pass form for client.

Explicit phase-scope clarifications (decided during discussion + audit findings):

- **`docs/CLIENT-HANDOFF.md` is EXTENDED, not rebuilt.** Phase 6 D-26/D-38 already shipped the GitHub-account-confirmation section. Phase 7 appends a §11 «8 Open Client Items» section with a 4-column one-pass table + a developer appendix mapping each answer to file edits. Existing GH-account section stays untouched.
- **`scripts/check-brand.ts` (7-check denylist) is RE-RUN, not extended.** Postbuild already enforces Pictorial/Rubikon, hex whitelist, `{{`/TODO, import boundaries, no-inline-transition, bundle budget, hero budget on every build. Phase 7 captures the latest green run as evidence; no new checks are added (axe-core is the new check and lives in its own script per D-09 below — explicitly NOT folded into `check-brand.ts` because it requires a running browser, while `check-brand.ts` is filesystem-only).
- **Phase 6 HUMAN-UAT items 1–5 ABSORB into Phase 7 plans.** Each Phase 7 plan task is paired with the Phase 6 UAT it closes (D-01..D-05). When Phase 7 verification passes, `06-HUMAN-UAT.md` items are explicitly marked closed by Phase 7 evidence pointers — no separate `/gsd:verify-work` pass for Phase 6.
- **Audit target is `vite preview` localhost for axe-core** (D-13) but **deployed GH Pages URL for everything else** (keyboard walkthrough, hard-refresh, Lighthouse, layout screenshots, social unfurl). Reasoning: axe-core needs a fast, repeatable, network-free target to be useful as evidence (preview ships the same dist/ output); keyboard/hard-refresh/Lighthouse need to stress GH Pages serving (CDN, hash-routing, real cold-tab behaviour) because that's what the client experiences.
- **Layout-verification screenshots are MANUAL DevTools resize** (D-19) — 21 PNGs (1280/1366/1440/1920 × 5 routes + 1 mobile fallback @375px) committed to `.planning/phases/07-.../layout/`. NO new Playwright dep, NO headless Chrome script. Trade-off: ~30 min one-pass tedium vs zero new infrastructure for a one-time capture.
- **Lighthouse SCORES are NOT re-run manually.** lhci CI workflow_run chain (Phase 6 D-31) already runs `1920 desktop preset × 5 routes × 4 categories × hard-fail at <0.9` on every push. Phase 7 fetches the latest lhci CI artifact (or links the workflow run URL), archives the JSON locally as evidence, and cross-references it as the SC#4 score-source-of-truth. A documented exception path: if the lhci CI run is missing/failed at handoff time, the dev MUST run `lhci collect` locally against the deployed URL with the same `.lighthouserc.cjs` config and archive that output instead.
- **Phase 7 ships ZERO new production code.** All new files are scripts/audit infrastructure (`scripts/axe-audit.mjs`), evidence directories (`.planning/phases/07-.../axe/`, `.planning/phases/07-.../layout/`, `.planning/phases/07-.../lighthouse/`), one new devDep (`@axe-core/cli`), and a doc-extension to `docs/CLIENT-HANDOFF.md`. No `src/` edits.
- **`/dev/brand` and `/dev/grid` excluded from all Phase 7 audits** — confirmed continuation of Phase 6 D-33. Production-only verification.
- **Mobile fallback verification = 1 screenshot at 375px (iPhone viewport)** (D-22) — DevTools device emulation OR real iPhone (developer's choice; both acceptable as SC#4 evidence). No comparison grid across multiple mobile widths — the fallback is a single static screen by design (Phase 6 D-04), so one shot proves it renders.

</domain>

<decisions>
## Implementation Decisions

### M1 — Phase 6 HUMAN-UAT Closure (absorb all 5)

- **D-01:** **UAT-1 «Lighthouse desktop ≥90 deployed URL»** absorbs into Phase 7 SC#4. Phase 7 plan task `lighthouse-archive` fetches the latest lhci CI artifact JSON (or runs `lhci collect` locally if CI artifact unavailable) and writes evidence to `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{commit-sha}.json`. Closes UAT-1 when 4/4 categories ≥0.9 on all 5 routes.
- **D-02:** **UAT-2 «MobileFallback visual at <1024px»** absorbs into Phase 7 SC#4 (mobile-fallback render verification). Phase 7 plan task `mobile-fallback-screenshot` captures one DevTools-device-emulation screenshot at 375×844 (iPhone 14) on the deployed URL, saved as `.planning/phases/07-.../layout/mobile-375.png`. Closes UAT-2 when the screenshot shows: Logo + wordmark + body copy + mailto + 4 CTA links + juridical block — no Nav, no Footer, no broken layout.
- **D-03:** **UAT-3 «Social unfurl in Viber/Telegram/Slack»** absorbs as a dedicated Phase 7 plan task `social-unfurl-verify` (NOT in Phase 7 SC explicitly, but treated as a handoff-quality gate per discussion). Procedure: paste `https://yaroslavpetrukha.github.io/vugoda-website/` (or actual account URL) into Viber + Telegram + Slack; capture screenshot of each unfurl card; archive as `.planning/phases/07-.../unfurls/{platform}.png` (3 PNGs total). Closes UAT-3 when each platform shows OG image + correct title + description.
- **D-04:** **UAT-4 «Hard-refresh deep-link incognito test»** absorbs into Phase 7 SC#2 (verbatim overlap). Phase 7 plan task `hard-refresh-test` documents 6 cold-incognito-tab visits (5 production routes + 1 unknown slug for 404 path) as a markdown table in the verification doc with pass/fail + screenshot proof for any failure. Closes UAT-4 when all 6 URLs render their expected content (or expected 404 for unknown slug).
- **D-05:** **UAT-5 «Lighthouse CI workflow_run chain validation»** absorbs as a dedicated Phase 7 plan task `lhci-chain-verify` (NOT in Phase 7 SC explicitly, but treated as a handoff-quality gate). Procedure: confirm the most recent push to `main` triggered `.github/workflows/lighthouse.yml` via `workflow_run`, completed successfully, AND its smoke-check step reports `PASS: hash-fragment URL fidelity verified.` Evidence: workflow run URL + downloaded artifact JSON snapshot in `.planning/phases/07-.../lighthouse/`. Closes UAT-5 when ≥4 of 5 lhr-*.json files contain `#` in `requestedUrl`.
- **D-06:** **Phase 6 UAT closure is ATOMIC** — when Phase 7 verification doc is written, all 5 UAT-X entries in `06-HUMAN-UAT.md` get an inline cross-reference: `closed by Phase 7 plan {plan-id}, evidence at {path}`. The `06-HUMAN-UAT.md` `result:` field flips from `[pending]` to `[passed via 07-{plan-id}]` (or `[failed — see 07-…]` if a UAT cannot close). No standalone `/gsd:verify-work` for Phase 6 needed.

### M2 — Keyboard Walkthrough (SC#1)

- **D-07:** **Manual per-route checklist, NOT scripted.** Each of 5 production routes (`/`, `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`) is walked via Tab → Enter only, with `Esc` for lightbox close on `/construction-log` and `/zhk/etno-dim`. Recorded in `.planning/phases/07-.../keyboard-walkthrough.md` as a markdown table per route with columns: «Element» / «Reachable via Tab» / «Visible focus-visible outline» / «Activates correctly (Enter/Space)» / «Notes». ~30 elements total across 5 routes; ~20 min one-pass.
- **D-08:** **Focus-trap guards verified specifically:** lightbox dialogs on `/construction-log` (50-photo gallery) and `/zhk/etno-dim` (8-render gallery) MUST trap focus inside while open AND release focus on `Esc` close. Phase 1 D-21 set the global `:focus-visible` rule (2px `#C1F33D` outline, 2px offset on dark, brand-system §6 compliant); Phase 7 walkthrough verifies it still fires post-build (lazy chunks for `/construction-log` per Phase 6 D-08 don't break the focus stack). Procedure documented as a 3-step subsection in the walkthrough doc.

### M3 — Hard-refresh Deep-link Test (SC#2)

- **D-09:** **6-row markdown table in verification doc** (`.planning/phases/07-.../hard-refresh.md`):
  | URL | Tab type | Expected | Actual | Pass/Fail |
  | `https://{account}.github.io/vugoda-website/` | Cold incognito | Hero renders, CTA active | … | … |
  | `…/#/projects` | Cold incognito | StageFilter + FlagshipCard + PipelineGrid | … | … |
  | `…/#/zhk/etno-dim` | Cold incognito | ZhkHero + fact block + gallery | … | … |
  | `…/#/construction-log` | Cold incognito | 4 MonthGroup blocks (lazy chunk loads) | … | … |
  | `…/#/contact` | Cold incognito | Contact реквізити-block + mailto | … | … |
  | `…/#/zhk/unknown` | Cold incognito | NotFoundPage OR `<Navigate>` to `/projects` (per Phase 4 D-32 redirect map) | … | … |
- **D-10:** **Cold incognito = NEW incognito window per row, NOT same window 6 times.** Reasoning: same incognito session retains sessionStorage between tab opens (Phase 5 D-21 `vugoda:hero-seen` flag) — second tab would measure the artificially-cheap «session-skip» hero. Each row gets a fresh window/session for clean measurement.
- **D-11:** **Failure recovery procedure documented.** If any row fails (e.g., 404 on cold tab → indicates a HashRouter regression), procedure is: (1) record the failure with screenshot in the table, (2) STOP Phase 7 progression, (3) trigger `/gsd:debug` against the failure, (4) RESUME Phase 7 verification after the underlying issue is fixed and re-deployed. Phase 7 does NOT band-aid a deep-link failure — it's a hard regression of DEP-03 / Phase 1 D-22 HashRouter contract.

### M4 — Build-output Denylist Audit (SC#3 part 1)

- **D-12:** **Re-run existing `scripts/check-brand.ts` (postbuild) and archive output as evidence.** No new checks added. Procedure: `npm run build` → captures stdout (`[check-brand] PASS …` × 7 lines) → archive as `.planning/phases/07-.../check-brand-{commit-sha}.txt`. Cross-reference: SC#3 verbatim says «`grep -r "Pictorial\|Rubikon\|Пикторіал\|Рубікон" dist/` empty; `grep -r "{{" dist/` empty; `grep -r "TODO" dist/` empty» — these 3 grep batteries are exactly what `denylistTerms()` + `placeholderTokens()` checks already enforce on every postbuild. Phase 7 evidence is the captured output, not a re-implementation.

### M5 — Axe-core A11y Audit (SC#3 part 2)

- **D-13:** **`@axe-core/cli` added as devDep + new `scripts/axe-audit.mjs`** (~30 lines). Script:
  1. Spawns `vite preview --port 4173` in background.
  2. Waits for port to accept connections (simple TCP poll, ≤5s).
  3. Iterates 5 production hash-routes (`http://localhost:4173/#/`, `…/#/projects`, `…/#/zhk/etno-dim`, `…/#/construction-log`, `…/#/contact`).
  4. For each route: shells out `npx axe http://localhost:4173/#/{path} --tags wcag2a,wcag2aa --exit --save .planning/phases/07-.../axe/{slug}.json`.
  5. Tears down preview server.
  6. Exits 1 if any route reports `violations` of impact=`critical` OR `serious` (matches Phase 7 SC#3 «zero critical a11y issues»).
- **D-14:** **Audit target is `vite preview` localhost (NOT deployed URL).** Confirmed in discussion. Reasoning: same dist/ output as production, no network/CI flakiness, repeatable on any machine. The deployed URL is a smoke-target for keyboard/hard-refresh/Lighthouse where GH Pages-specific behaviour (CDN, hash routing) matters; axe-core scoring is DOM-only and doesn't differ between localhost and deployed.
- **D-15:** **Tags scoped to `wcag2a,wcag2aa`** per PROJECT.md «Accessibility floor: WCAG 2.1 AA». Excluded: `wcag2aaa` (project doesn't claim AAA), `best-practice` (subjective, would surface non-violations as noise), `experimental` (pre-release rules, false positive risk). Recorded in script comments.
- **D-16:** **Critical+Serious threshold for SC#3 closure.** Axe-core's 4-level severity (`minor` / `moderate` / `serious` / `critical`); SC#3 says «zero critical» — Phase 7 strengthens to «zero critical AND zero serious» because critical-only is too lenient (a missing alt-text scores serious, not critical, and would silently pass under critical-only). `minor` and `moderate` violations are surfaced in JSON archive but DO NOT fail the script — recorded as «known and accepted» if any.
- **D-17:** **Script is one-shot, NOT a CI gate.** Confirmed in discussion. `package.json` adds `"audit:a11y": "node scripts/axe-audit.mjs"` script entry, NOT wired into `prebuild` / `postbuild` / `deploy.yml`. Reason: a11y violations on a content edit shouldn't block production deploys for a 5-page MVP demo; promote to CI gate at v2 if regressions become a pattern.
- **D-18:** **Output schema:** each `.planning/phases/07-.../axe/{slug}.json` file follows axe-core's standard violation report format. The phase directory contains 5 JSONs (one per production route) + a top-level `axe-summary.md` aggregating «total violations / critical / serious / moderate / minor» per route as a single table for handoff scan-ability.

### M6 — Lighthouse Archive (SC#4 scores)

- **D-19:** **lhci CI artifact = source of truth for scores.** Phase 7 plan task `lhci-archive` runs:
  1. `gh run list --workflow lighthouse.yml --limit 1 --json databaseId,headSha,status,conclusion` to fetch the latest `lighthouse.yml` run on `main`.
  2. If `status: completed` AND `conclusion: success` → `gh run download {id} --name lhci-{commit-sha}` → place artifact JSONs in `.planning/phases/07-.../lighthouse/lhci-{commit-sha}/`.
  3. Generate a single `.planning/phases/07-.../lighthouse/SUMMARY.md` with a 5-row × 4-col table: «Route» / «Performance» / «Accessibility» / «Best Practices» / «SEO» — pulled from each `lhr-*.json` `categories.{cat}.score`.
  4. Cross-reference UAT-1 closure with the workflow run URL.
- **D-20:** **Fallback if lhci CI artifact unavailable.** If the most recent `lighthouse.yml` run failed/cancelled/missing, dev runs `npx lhci collect --config=.lighthouserc.cjs` locally against the deployed URL → archives `.lighthouseci/lhr-*.json` files manually to `.planning/phases/07-.../lighthouse/manual-{date}/`. Documented in plan as the fallback procedure.
- **D-21:** **Phase 7 does NOT re-run Lighthouse manually for scores at any width.** Manual DevTools Lighthouse passes are explicitly OUT — confirmed in discussion. Layout-verification at 1280/1366/1440 is screenshot-only (D-22), Lighthouse score at those widths is not measured. Reasoning: LH score won't differ meaningfully between 1280 and 1366; the lhci 1920 desktop-preset is the canonical SC#4 score evidence; broader-width score-runs are time-cost without narrative win.

### M7 — Layout Verification Screenshots (SC#4 layout)

- **D-22:** **21 manual DevTools screenshots** committed to `.planning/phases/07-.../layout/`. Naming: `{route-slug}-{width}.png`:
  - 5 routes × 4 widths (1280, 1366, 1440, 1920) = 20 PNGs
  - 1 mobile fallback at 375 = 1 PNG
  - Total: 21 PNGs
- **D-23:** **Capture procedure (manual, ~30 min one-pass):**
  1. Open deployed URL in Chrome.
  2. DevTools → Toggle Device Toolbar (Cmd+Shift+M) → Responsive mode.
  3. Set viewport to 1280×800.
  4. DevTools «...» menu → Capture full size screenshot.
  5. Save as `home-1280.png` (or equivalent route slug).
  6. Repeat for 1366×800, 1440×900, 1920×1080.
  7. Repeat for 4 other routes.
  8. For mobile: set 375×844 (iPhone 14 preset), capture full-size, save as `mobile-375.png` showing `<MobileFallback>`.
- **D-24:** **Slugs locked:** `home`, `projects`, `zhk-etno-dim`, `construction-log`, `contact`, `mobile`. Hyphenated, no special chars (matches existing `audit-*` PNG naming convention from prior audit work in repo root, intentional consistency).
- **D-25:** **Layout pass criteria documented in `.planning/phases/07-.../layout/SUMMARY.md`:** for each route at each width: «No horizontal scroll» / «Brand colors hold (no Tailwind defaults bleeding through)» / «Hero/section hierarchy intact» / «Cards in grid don't overflow» / «No clipped text». Verification is human-eye against brand-system.md §3-7. Failures trigger `/gsd:debug` → re-deploy → re-shoot affected screenshots.
- **D-26:** **Existing `audit-*.png` files in repo root (audit-home-1024.png, audit-home-1280.png, etc.)** are unrelated prior-audit artifacts (gitignored, not committed). Phase 7 layout screenshots live INSIDE `.planning/phases/07-.../layout/` (committed to repo as evidence). Do NOT delete the repo-root `audit-*.png` files (they may have value for the developer's local diff baseline) but do NOT commit them either.

### M8 — CLIENT-HANDOFF.md §11 Extension (SC#5)

- **D-27:** **Single new section appended to `docs/CLIENT-HANDOFF.md`:** «§11 — Open Client Items» with H2 header, immediately AFTER the existing «Phase 7 will extend this document» note (line 48 of current file). The existing GH-account-confirmation section (lines 1–46) stays untouched — that's a dev-side checklist, NOT for client.
- **D-28:** **One-pass 4-column markdown table.** Columns:
  - «Питання клієнту» (UA-language, plain prose, no file paths or code references)
  - «Поточне значення» (literal em-dash `—` for placeholders, OR the placeholder string in `«guillemets»` like «Без назви»)
  - «Що зміниться після відповіді» (plain UA description of what file/page will visibly update — e.g., «Відобразиться у футері + на /contact», NOT «`src/content/company.ts#phone`»)
  - «Пріоритет» (P0 = blocker for client to use the demo, P1 = should-fix-before-handoff, P2 = nice-to-clarify)
- **D-29:** **8 §11 items locked (verbatim from PROJECT.md «Відкриті питання»):**

  | # | Питання | Поточне | Що зміниться | Пріоритет |
  |---|---------|---------|--------------|-----------|
  | 1 | Корпоративний телефон | `—` | Відобразиться у футері + на `/contact` | P1 |
  | 2 | Юридична / поштова адреса | `—` | Відобразиться у футері + на `/contact` + у блоці довіри на головній | P1 |
  | 3 | Назва Pipeline-4 (без назви на сьогодні) | «Без назви» | Відобразиться як назва картки в агрегативному рядку на `/projects` + на головній | P2 |
  | 4 | Підтвердження Моделі-Б для стадій («У розрахунку» / «У погодженні» / «Будується» / «Здано») — формулювання правильне? | Модель-Б 4 бакети | Якщо зміна — оновлюється фільтр на `/projects` + бейджі на картках | P2 |
  | 5 | Верифікація методології §8, блоки 2 / 5 / 6 (зараз позначені знаком ⚠) — текст коректний? | ⚠-flag на 3 блоках | Зніметься ⚠-маркер у Methodology teaser на головній (blocks 2/5/6 будуть виглядати як інші) | P1 |
  | 6 | Транслітерація slug Маєтку: `maietok-vynnykivskyi` чи `maetok-vynnykivskyi`? | `maietok-vynnykivskyi` | URL картки на `/projects` (не активний у v1, готується до v2 повної сторінки) | P2 |
  | 7 | Написання «NTEREST» — без літери «I» свідоме? | NTEREST | Назва картки на `/projects`; підтвердження або заміна на «INTEREST» | P1 |
  | 8 | Адреса ЖК Етно Дім (зараз вул. Судова, Львів) — підтверджено? | вул. Судова, Львів | Відобразиться у факт-блоці на `/zhk/etno-dim` | P1 |

- **D-30:** **Dev appendix subsection «Map: client answer → file edit».** AFTER the table, a developer-facing collapsible markdown section maps each row to the exact file path + line shape to edit when the answer arrives. Format per row:

  ```
  ### Item 1: Phone
  Edit: `src/content/placeholders.ts` — replace the `phone` export's value `'—'` with the answered number.
  Verify: `grep -r "—" src/content/` shows phone is no longer in the placeholders list.
  ```

  Repeats for all 8 items. Existing `placeholders.ts` (Phase 2 D-19) is the single source of truth for em-dash placeholders, so most items are one-line edits there. Items 5 (methodology ⚠) and 6 (slug) touch different files — appendix calls those out specifically.
- **D-31:** **No client-facing «demo brief» doc.** Confirmed during gray-area triage: the client gets the URL via direct chat + a copy of CLIENT-HANDOFF.md §11 table (or just the link to `https://github.com/{account}/vugoda-website/blob/main/docs/CLIENT-HANDOFF.md` — the §11 section renders cleanly on GitHub web). Splitting into `docs/CLIENT-DEMO.md` was rejected as two-doc-sync overhead for a v1 demo.
- **D-32:** **Priority labels are advisory, not blocking.** Even P0 items shouldn't block the demo URL handoff — the demo is meant to be shown WITH the open items visible (em-dashes, ⚠ flags), demonstrating the «системний девелопмент» practice of not faking certainty. The P0/P1/P2 labels guide the CLIENT'S response priority, not the dev's deploy gate.

### M9 — Final Handoff Bundle

- **D-33:** **Phase 7 verification document at `.planning/phases/07-.../07-VERIFICATION.md`** is the consolidated artifact pointer. Structure:
  1. SC#1: Keyboard walkthrough — link to `keyboard-walkthrough.md`
  2. SC#2: Hard-refresh — link to `hard-refresh.md`
  3. SC#3: Build denylist + axe — link to `check-brand-{sha}.txt` + `axe-summary.md`
  4. SC#4: Lighthouse + layouts — link to `lighthouse/SUMMARY.md` + `layout/SUMMARY.md`
  5. SC#5: §11 handoff — link to `docs/CLIENT-HANDOFF.md` §11 section
  6. UAT closure: cross-reference UAT-1..5 with the closing artifact
- **D-34:** **Phase 7 plan-task granularity = 6–8 plans** (planner's call within waves):
  - Wave 1 (foundation, parallel): `axe-script-and-devdep`, `clienthandoff-section-11`
  - Wave 2 (manual verification, sequential — share dev attention): `keyboard-walkthrough`, `hard-refresh-test`, `layout-screenshots`, `mobile-fallback-screenshot`
  - Wave 3 (artifact bundling, sequential): `lhci-archive`, `social-unfurl-verify`, `verification-doc-and-uat-closure`
- **D-35:** **No new PR-merge gate beyond existing `check-brand` + `lhci`.** Phase 7 explicitly does NOT add `audit:a11y` to deploy.yml. Reason confirmed in D-17: a11y is one-shot evidence at handoff time, not a permanent regression guard. Promotion path documented in deferred ideas.

### Folded Todos

_None — `gsd-tools todo match-phase 7` returned 0 matches at discussion time._

### Claude's Discretion (planner picks within scope)

- Exact file naming for the 5 axe JSONs (`home.json` vs `index.json`; `zhk-etno-dim.json` vs `zhk_etno_dim.json`) — D-24 locks the broader slug convention; planner picks identical convention for axe outputs
- Whether `scripts/axe-audit.mjs` uses Node's built-in `node:net` for the port-readiness poll OR a small `wait-on` style helper — built-in is recommended (zero dep), but planner can pick if `wait-on` is more readable
- Whether `lhci-archive` plan task uses `gh` CLI (already a dev tool) or curls the GitHub REST API directly — `gh` is recommended (auth handled, less code)
- Layout-screenshot composition checks (D-25): planner can codify as a markdown checklist OR a free-text section; markdown checklist is recommended (machine-readable for future runs)
- Whether the keyboard-walkthrough table per route uses identical column headers OR varies based on route's element count — identical is recommended (scannability across routes)
- Hard-refresh test row count: 6 vs 7 (could add `/#/zhk/maietok-vynnykivskyi` redirect verification per Phase 4 D-32) — 6 is locked in D-09; planner can promote to 7 if redirect-class testing is judged valuable. Currently scoped out as «Phase 4 internal redirect logic, not a Phase 7 acceptance gate»
- §11 table item ordering: by priority (P0 → P2) OR by source-document order — D-29 locks source-document order (matches client's reading flow against PROJECT.md §11); planner can re-sort if the discussion-log shows priority-first scans better
- Whether the dev appendix per item (D-30) is collapsed `<details>`/`<summary>` HTML in markdown OR plain H3 sections — collapsed is recommended (keeps client-facing table the visual focus); planner picks
- 06-HUMAN-UAT.md update format (D-06): inline edit of each `result:` line vs append a closure block at file-end. Inline is recommended (matches existing field-by-field schema); planner picks

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before acting.**

### Requirements (authoritative surface)

- `.planning/REQUIREMENTS.md` §QA-04 — denylist patterns Phase 7 captures as evidence (Pictorial / Rubikon / hex whitelist / `{{` / TODO — already enforced by `scripts/check-brand.ts`)
- `.planning/REQUIREMENTS.md` §QA-01..03 + DEP-01..02 — verification surface for Phase 7 archives (mobile fallback, Lighthouse, OG meta, deploy.yml, public URL)
- `.planning/ROADMAP.md` §"Phase 7: Post-deploy QA & Client Handoff" — Success Criteria 1–5 verbatim (D-01..D-33 each map to one SC)

### Project-level policy

- `.planning/PROJECT.md` §Core Value — desktop-first 1920×1080 «ахуєнний» demo; clickable URL handed to client (drives M9 handoff bundling)
- `.planning/PROJECT.md` §Constraints — Lighthouse Desktop ≥90 (verified via lhci D-19), WCAG 2.1 AA (verified via axe D-15), HashRouter (drives D-09 hash-URL test format)
- `.planning/PROJECT.md` §"Відкриті питання" — 8 items locked verbatim into D-29 §11 table
- `.planning/PROJECT.md` §Out of Scope — no v2 features (privacy policy, analytics, mobile responsive, BrowserRouter, custom domain) — Phase 7 does NOT introduce any of these

### Prior-phase decisions (Phase 7 verifies and consolidates)

- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-21 — `:focus-visible` accent outline (drives D-08 keyboard walkthrough verification surface)
- `.planning/phases/01-foundation-shell/01-CONTEXT.md` §D-22 — HashRouter (drives D-09 hash-URL hard-refresh test format)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-19 — em-dash `—` placeholders (drives D-29 §11 table «Поточне значення» column literal values)
- `.planning/phases/02-data-layer-content/02-CONTEXT.md` §D-24..D-29 — `scripts/check-brand.ts` 5-check pattern + Phase 5/6 extensions to 7 (drives D-12 «re-run, archive, no extension»)
- `.planning/phases/03-brand-primitives-home-page/03-CONTEXT.md` §VIS-03 + ⚠-flag in methodology — drives §11 item 5 phrasing (D-29)
- `.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md` §D-22..D-32 — Lightbox `Esc` close + `<Navigate>` redirects (drives D-08 lightbox verification + D-09 unknown-slug test path)
- `.planning/phases/05-animations-polish/05-CONTEXT.md` §D-21 — `useSessionFlag` `vugoda:hero-seen` (drives D-10 «new incognito window per row» reasoning)
- `.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md` §D-31..D-32 — lhci CI two-tier verification (drives D-19 «lhci artifact = source of truth»)
- `.planning/phases/06-performance-mobile-fallback-deploy/06-CONTEXT.md` §D-33 — `/dev/*` exempt from production audit (drives Phase 7 production-only scope)
- `.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md` — 5 outstanding UAT items (D-01..D-05 absorption pairing)

### Existing infrastructure Phase 7 reuses

- `scripts/check-brand.ts` — 7 postbuild checks; Phase 7 archives stdout output (D-12)
- `.github/workflows/lighthouse.yml` — workflow_run chain triggered after deploy.yml; Phase 7 fetches artifact (D-19)
- `.lighthouserc.cjs` — lhci config (5 hash-URLs + assertions); Phase 7 reuses for D-20 fallback path
- `docs/CLIENT-HANDOFF.md` — Phase 6 GH-account-swap section (D-27 confirms not touched); Phase 7 appends §11 section (D-27..D-32)
- `package.json` `prebuild` chain — already runs translit + image pipeline + OG image build; Phase 7 does NOT modify (axe-script lives in `audit:a11y` script, NOT in pre/postbuild)

### Existing components Phase 7 audits (no edits)

- `src/components/layout/Layout.tsx` — keyboard walkthrough surface (Nav/Footer/Outlet)
- `src/components/layout/MobileFallback.tsx` — mobile screenshot subject (D-22)
- `src/components/ui/Lightbox.tsx` (Phase 4) — keyboard `Esc`-close verification (D-08)
- `src/pages/HomePage.tsx`, `ProjectsPage.tsx`, `ZhkPage.tsx`, `ConstructionLogPage.tsx`, `ContactPage.tsx`, `NotFoundPage.tsx` — keyboard, hard-refresh, axe, layout audit subjects
- `src/content/placeholders.ts` — em-dash source-of-truth referenced in §11 dev appendix (D-30)
- `src/content/methodology.ts` — `needsVerification: true` flag on blocks 2/5/6 referenced in §11 item 5 (D-29)

### Brand authority (visual + accessibility DNA)

- `brand-system.md` §3 — palette + WCAG contrast verifications (axe a11y verifies these; layout screenshots verify visual consistency)
- `brand-system.md` §6 — DO/DON'T (`:focus-visible` 2px C1F33D outline — Phase 7 D-08 verifies still fires)
- `КОНЦЕПЦІЯ-САЙТУ.md` §11 — 8 open client items source (D-29 §11 table content)

### External documentation

- `@axe-core/cli` README — https://github.com/dequelabs/axe-core-npm/blob/develop/packages/cli/README.md (CLI flags, output JSON schema for D-13 script)
- WCAG 2.1 tag reference for axe — https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md (rule list under `wcag2a` + `wcag2aa` for D-15 scope verification)
- `gh run download` docs — https://cli.github.com/manual/gh_run_download (D-19 lhci artifact fetch)
- Chrome DevTools «Capture full size screenshot» — https://developer.chrome.com/docs/devtools/device-mode (D-23 manual procedure reference)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 1–6, NO new code in Phase 7)

- **`scripts/check-brand.ts`** (Phases 2/5/6, 7 checks active) — Phase 7 captures stdout as evidence (D-12); no edits.
- **`.github/workflows/lighthouse.yml`** + `.lighthouserc.cjs` (Phase 6 D-31) — Phase 7 fetches artifact via `gh run download` (D-19); no edits.
- **`docs/CLIENT-HANDOFF.md`** (Phase 6 D-26/D-38) — Phase 7 appends §11 section (D-27); existing GH-account section untouched.
- **`vite preview`** (Vite 6 default) — Phase 7 axe script spawns `vite preview --port 4173` for localhost target (D-13); no Vite config changes.
- **`gh` CLI** (developer tool, presumed available) — Phase 7 `lhci-archive` plan uses `gh run list` + `gh run download` (D-19); planner verifies availability in plan kickoff.
- **Existing `src/content/placeholders.ts`** (Phase 2 D-19) — Phase 7 §11 dev appendix maps most answer-edits to single-line replacements here (D-30); no edits in Phase 7 (those edits happen post-handoff when client answers arrive).
- **Existing `06-HUMAN-UAT.md` schema** (`status:` / `expected:` / `result:` per test) — Phase 7 D-06 inline-updates the `result:` field per UAT row; no schema change.

### Anti-list — DO NOT introduce in Phase 7

- **Playwright / `@playwright/test`** — D-22 explicitly rejected; manual DevTools resize is the chosen approach. Adding Playwright to take 21 screenshots is heavy infrastructure for one-time evidence capture; v2 can adopt if E2E tests become a need.
- **`puppeteer-core` / `chrome-launcher`** — same reason as Playwright; one-time capture doesn't justify a headless-browser dep.
- **`@axe-core/playwright`** — Playwright wrapper for axe; rejected because base `@axe-core/cli` covers Phase 7's needs (D-13). Promote at v2 if E2E + a11y assertions need to share a browser session.
- **`vitest` / `jest`** — STACK.md MVP-skips testing frameworks; Phase 7 is verification, NOT unit-test introduction.
- **`@testing-library/jest-dom`** — same as vitest.
- **`pa11y` / `pa11y-ci`** — alternative a11y CLI; rejected because axe-core is the more widely-cited engine and SC#3 explicitly says «axe-core run».
- **`lighthouse` (manual CLI)** — D-21 rejects manual LH for additional widths; lhci CI is the score source.
- **New checks added to `scripts/check-brand.ts`** — D-12 explicitly says «re-run, archive, NO extension». Adding axe to check-brand would force a browser dependency on a filesystem-only script.
- **Wiring `axe-audit.mjs` into `prebuild`/`postbuild`/`deploy.yml`** — D-17 explicitly rejects; one-shot script only.
- **New production code in `src/`** — Phase 7 boundary explicitly forbids. All new files are scripts/audit/evidence.
- **New `<Component>` for accessibility tooling** — same as above; verification reads existing components.
- **Browser extensions (axe DevTools, WAVE) as primary evidence** — D-13 chooses CLI for machine-readable JSON archive; browser-extension manual sweep is not an acceptable substitute.
- **Per-route OG meta or per-route lighthouse score** — Phase 6 D-20 locked HashRouter prevents per-route OG; Phase 7 doesn't relitigate.

### Established Patterns

- **Evidence directory structure** (Phase 7 introduces, mirrors Phase 6's `lighthouse/`): `.planning/phases/07-.../{axe,layout,lighthouse,unfurls}/{slug}.{json,png}` — flat per-axis subdirectory; no nested «pass/fail/output» grouping. Aligns with prior phase's `.planning/phases/{phase}/` artifact-flat pattern.
- **Naming convention** (D-24): hyphenated slugs match existing `audit-*` repo-root naming AND `06-HUMAN-UAT.md` test naming. No camelCase, no underscores.
- **UAT closure protocol** (D-06): Phase 7 inline-updates `06-HUMAN-UAT.md result:` field per row with cross-reference to Phase 7 evidence. Pattern can be reused for future phases that absorb prior-phase UATs.
- **One-shot script pattern** (D-13): script lives in `scripts/`, registered as `npm run audit:*` script, NOT wired to lifecycle hooks. Mirrors `scripts/list-construction.ts` (Phase 2 D-22) which is also one-shot dev tooling.
- **Doc-extension pattern** (D-27): `docs/CLIENT-HANDOFF.md` grows by appending H2 sections, never rewriting prior sections. Same approach as `.planning/PROJECT.md` evolution at phase boundaries.

### Integration Points (Phase 7 → handoff)

- Phase 7 verification doc (D-33) is the SINGLE artifact a developer/auditor reads to confirm SC#1–5 closure.
- `06-HUMAN-UAT.md` becomes a fully-closed file (5/5 `result: [passed via 07-…]`) after Phase 7 evidence lands.
- `docs/CLIENT-HANDOFF.md` §11 table is the single client-facing form; client answers all 8 items in one email/chat reply.
- Post-handoff edit cycle: when client answers arrive, dev follows D-30 appendix to apply edits → re-deploys → verifies via existing Phase 6 lhci CI gate (no Phase 7 re-run needed unless client edits introduce new a11y risk).

</code_context>

<specifics>
## Specific Ideas

### Axe-core script outline (D-13)

```js
// scripts/axe-audit.mjs
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:net';

const ROUTES = [
  { slug: 'home', hash: '/' },
  { slug: 'projects', hash: '/projects' },
  { slug: 'zhk-etno-dim', hash: '/zhk/etno-dim' },
  { slug: 'construction-log', hash: '/construction-log' },
  { slug: 'contact', hash: '/contact' },
];
const PREVIEW_PORT = 4173;
const OUT_DIR = '.planning/phases/07-post-deploy-qa-client-handoff/axe';

mkdirSync(OUT_DIR, { recursive: true });

const preview = spawn('npx', ['vite', 'preview', '--port', PREVIEW_PORT], { stdio: 'pipe' });
await waitForPort(PREVIEW_PORT);

let hadCriticalOrSerious = false;
const summary = [];

for (const { slug, hash } of ROUTES) {
  const url = `http://localhost:${PREVIEW_PORT}/#${hash === '/' ? '' : hash}`;
  const outFile = `${OUT_DIR}/${slug}.json`;
  const res = await runAxe(url, outFile);  // shells out npx axe ...
  const { critical, serious, moderate, minor } = countViolations(res);
  summary.push({ slug, critical, serious, moderate, minor });
  if (critical > 0 || serious > 0) hadCriticalOrSerious = true;
}

writeFileSync(`${OUT_DIR}/axe-summary.md`, renderSummary(summary));
preview.kill();
process.exit(hadCriticalOrSerious ? 1 : 0);
```

Real script ~50–60 lines including `waitForPort` / `runAxe` / `countViolations` / `renderSummary` helpers. Planner picks final shape.

### Hard-refresh test table format (D-09)

```markdown
# Phase 7 — Hard-refresh Deep-link Test (SC#2 + UAT-4)

**Date:** {ISO date}
**Tester:** {name}
**Browser:** Chrome {version}
**Deployed URL base:** https://yaroslavpetrukha.github.io/vugoda-website/

| # | URL | Tab | Expected | Actual | Pass/Fail | Screenshot |
|---|-----|-----|----------|--------|-----------|------------|
| 1 | `/` | Cold incognito | Hero renders, CTA active | Hero loaded, IsometricGridBG visible, CTA «Переглянути проекти» navigates to `/#/projects` | ✅ Pass | `hard-refresh-1-home.png` |
| 2 | `/#/projects` | Cold incognito (new window) | StageFilter (4 buckets) + FlagshipCard + PipelineGrid (3 cards) + AggregateRow | … | … | … |
| 3 | `/#/zhk/etno-dim` | Cold incognito (new window) | ZhkHero + factBlock + 8-image gallery + CTAs | … | … | … |
| 4 | `/#/construction-log` | Cold incognito (new window) | 4 MonthGroup blocks (50 photos total); lazy chunk loads with MarkSpinner; lightbox opens on click | … | … | … |
| 5 | `/#/contact` | Cold incognito (new window) | Contact реквізити-block + active mailto + dash placeholders for phone/address + disabled-style social links | … | … | … |
| 6 | `/#/zhk/unknown` | Cold incognito (new window) | NotFoundPage OR `<Navigate>` redirect (per Phase 4 D-32) | … | … | … |

## Pass criteria
- Pass = expected content fully visible within 3s on a cold tab, no 404, no blank screen, no console errors
- Fail = any expected element missing, OR 404 page, OR JS error in console
```

### §11 table draft (D-29 verbatim into D-28 column structure)

The 8-row table is locked verbatim in D-29 above. Plan's `clienthandoff-section-11` task copies it as-is into `docs/CLIENT-HANDOFF.md` AFTER the «Phase 7 will extend this document» note (existing line 48).

### Dev appendix shape (D-30)

```markdown
<details>
<summary><strong>Developer appendix: client answer → file edit (8 items)</strong></summary>

### Item 1: Phone

**File:** `src/content/placeholders.ts`
**Edit:** Replace `phone: '—'` with `phone: '<answer>'` (UA mobile format `+380 XX XXX XX XX`).
**Verify:** `grep -n "phone" src/content/placeholders.ts` — returns the new value.
**Re-deploy:** push to main → CI runs → lhci confirms no perf regression.

### Item 2: Юридична / поштова адреса
…

### Item 3: Pipeline-4 назва
…

### Item 4: Модель-Б confirmation
**File:** `src/lib/stages.ts` (если переименование) OR `.planning/PROJECT.md` only (if confirmation no edits)
**Note:** If confirmed as-is, no code change — update `.planning/PROJECT.md` «Key Decisions» table to mark «Confirmed».

### Item 5: Methodology blocks 2/5/6 verification
**File:** `src/content/methodology.ts`
**Edit:** Set `needsVerification: false` on blocks 2, 5, 6 (after client confirms text).
**Verify:** ⚠ marker disappears in MethodologyTeaser on `/`; `grep -c "needsVerification: true" src/content/methodology.ts` returns 0.

### Item 6: Маєток slug
**Files (only if changed):**
- `src/data/projects.ts` — `slug: 'maietok-vynnykivskyi'` → `'maetok-vynnykivskyi'`
- `renders/ЖК Маєток Винниківський/` source folder — `scripts/copy-renders.ts` translit map (verify the map produces the new slug)
**Verify:** `grep -r "maietok" src/` returns zero.

### Item 7: NTEREST spelling
**File:** `src/data/projects.ts` — `title: 'NTEREST'` → if changed, update + verify on `/projects` card.

### Item 8: Етно Дім адреса
**File:** `src/data/projects.ts` — Етно Дім record's `address` field (currently «вул. Судова, Львів»).

</details>
```

### Lighthouse archive procedure (D-19)

```bash
# After most recent push to main triggers lighthouse.yml workflow_run:

# 1. Fetch latest run
RUN_ID=$(gh run list --workflow lighthouse.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# 2. Verify it succeeded
gh run view $RUN_ID --json conclusion --jq '.conclusion'  # → "success"

# 3. Download artifact
mkdir -p .planning/phases/07-post-deploy-qa-client-handoff/lighthouse
gh run download $RUN_ID --dir .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-$RUN_ID

# 4. Extract scores into SUMMARY.md (one-liner per route)
for f in .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-$RUN_ID/lhr-*.json; do
  jq -r '[.requestedUrl, .categories.performance.score, .categories.accessibility.score, .categories["best-practices"].score, .categories.seo.score] | @tsv' "$f"
done > .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv
```

Planner formats the TSV into a markdown table in `SUMMARY.md`.

### Doc-block self-consistency pre-screen (Phase 7-specific)

- `paletteWhitelist()` — Phase 7 introduces NO new hex literals. Layout screenshots may show brand colors but PNGs are outside script scope.
- `denylistTerms()` — Phase 7 NEVER mentions Pictorial/Rubikon. CONTEXT.md mentions them in canonical_refs «§QA-04 — denylist patterns Phase 7 captures» — script grep is over `dist/`, NOT `.planning/`. Safe.
- `placeholderTokens()` — Phase 7's §11 table «Поточне значення» column shows literal em-dashes and «Без назви» — these are display strings, NOT `{{token}}` literals. Safe.
- `importBoundaries()` — Phase 7 ships ZERO src/ code. N/A.
- `noInlineTransition()` — Phase 7 ships ZERO motion code. N/A.
- `bundleBudget()` / `heroBudget()` — Phase 7 doesn't change `dist/` shape. Existing checks remain green.

Pre-screen says zero collisions. Planner verifies during plan-doc authoring.

### Variants the discussion confirmed are NOT problems

- **Phase 7 scope creep into «add CI a11y gate»** — explicitly rejected (D-17). One-shot evidence at handoff time.
- **Per-width Lighthouse runs** — explicitly rejected (D-21). lhci 1920 desktop preset is the score evidence.
- **Two separate handoff docs** — explicitly rejected (D-31). One CLIENT-HANDOFF.md, two sections (existing GH-account + new §11).
- **Re-running Phase 6 verify-work first** — explicitly rejected (UAT closure question). Phase 7 absorbs UAT-1..5 directly via D-01..D-05.
- **Manual axe DevTools sweep as primary evidence** — explicitly rejected (a11y depth question). Machine-readable JSON archive via CLI is the evidence form.

</specifics>

<deferred>
## Deferred Ideas

### Out-of-scope verification depth (v2)

- **Permanent CI a11y gate** — D-17 keeps axe-core one-shot. Promotion path at v2: add `audit:a11y` step to `deploy.yml` post-build, fail on critical+serious. Trigger: any post-handoff content edit that introduces an a11y regression — that's the signal to promote.
- **`@axe-core/playwright` E2E + a11y combined harness** — only valuable if v2 introduces interactive flows (e.g., backend form, login). v1 demo has zero interactive state worth E2E-asserting.
- **Multi-width Lighthouse score grid** — D-21 explicitly skips. v2 trigger: client requests perf-at-tablet measurement. Out of scope while desktop-first.
- **Real-device mobile testing (BrowserStack / Sauce Labs)** — D-22 accepts DevTools emulation OR real iPhone. Real-device farms are v2 if mobile becomes a marketing surface (after INFR2-07 full responsive lands).
- **Visual regression testing (Percy / Chromatic / reg-suit)** — D-22 manual screenshots are evidence-only, not regression-baseline. v2 trigger: design system changes start landing as PRs and visual diffs are needed.
- **End-to-end Playwright suite** — explicit anti-pattern for Phase 7. v2 if interactive flows arrive.
- **Pa11y / WAVE / Lighthouse a11y dashboards** — alternative tooling; rejected for axe-core consistency. v2 if multiple tool perspectives are needed.
- **`lighthouse-keeper` / lighthouse-bot for PR comments** — useful for ongoing dev velocity; v1 demo doesn't need PR-level perf feedback.
- **Sitemap.xml generation** — out-of-scope per Phase 6 D-26 / Out-of-Scope list. Add at v2 with custom domain.
- **`robots.txt`** — default «allow all» works for GH Pages. Explicit ship not needed in v1.
- **WebPageTest / SpeedCurve external benchmarking** — Lighthouse desktop is sufficient evidence. v2 if marketing wants third-party benchmarks.
- **Web Vitals real-user monitoring** — out-of-scope per Phase 6 deferred list. Analytics is v2.

### Out-of-scope content edits (post-handoff cycle)

- **Apply 8 §11 answers to code** — D-30 maps each answer to file edits, but the EDIT itself happens AFTER handoff when client responds. Phase 7 produces the form, not the answers. Post-handoff process: dev gets the answer email, applies edits per appendix, re-deploys, verifies via existing CI gates. No new Phase 7 task.
- **Methodology block re-verification** — when client confirms blocks 2/5/6, ⚠ flag is removed (D-30 item 5). Until then, Phase 7 ships the demo with the visible ⚠ markers, demonstrating «системний девелопмент» honesty.
- **Slug migration if Маєток changes from `maietok` → `maetok`** — touches `src/data/projects.ts` + the translit map in `scripts/copy-renders.ts`. Single-PR change; not a Phase 7 task.

### Out-of-scope handoff additions

- **Client-facing demo brief / 1-pager** — D-31 explicitly skips. Single CLIENT-HANDOFF.md with two sections is the chosen handoff artifact.
- **Loom-style video walkthrough** — could replace text-based handoff; v2 if client requests asynchronous demo.
- **Calendly link / scheduled walkthrough call** — out of scope; handoff is async via URL + handoff doc.
- **Slack/Telegram bot for client answers** — over-engineered for an 8-item form. Email or chat reply is the answer mechanism.
- **Translation of CLIENT-HANDOFF.md to EN** — UA-only per PROJECT.md. v2 with FEAT2-06 EN locale.

### Out-of-scope automated UAT closure

- **`/gsd:verify-work` integration with Phase 7 evidence directories** — D-06 absorbs UAT manually. If GSD ever ships an evidence-pointer schema for UAT closure, Phase 7's pattern becomes the prior art. v2 GSD feature, not Phase 7.

### Reviewed Todos (not folded)

_No pending todos matched this phase at discussion time (`gsd-tools todo match-phase 7` → 0 matches)._

</deferred>

---

*Phase: 07-post-deploy-qa-client-handoff*
*Context gathered: 2026-04-27*
*Discuss mode: standard (4-area gray-area triage + 6 focused decisions)*
