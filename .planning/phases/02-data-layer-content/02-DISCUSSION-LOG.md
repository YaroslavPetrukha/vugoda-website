# Phase 2: Data Layer & Content — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 02-data-layer-content
**Areas discussed:** Content modules & §8 shape, CI denylist mechanism (QA-04), Fixtures + /dev/grid scope, Data boundaries (assetUrl + import rules)
**Mode:** Interactive (batch-mode `AskUserQuestion`, 4+3 questions total)

---

## Area Selection

**Question:** Which areas do you want to discuss for Phase 2 (Data Layer & Content)?

| Option | Description | Selected |
|--------|-------------|----------|
| Content modules & §8 shape | How to split src/content/*.ts (single vs per-domain); methodology §8 as string[] or typed Block[] with emphasis + ⚠-verify flag; construction.ts + teaser selection. | ✓ |
| CI denylist mechanism (QA-04) | 3 denylists (Pictorial/Rubikon, 6-hex palette, {{/TODO). One script vs three; postbuild / Actions-only / both; fail-hard semantics; composition with Phase 1 deploy workflow. | ✓ |
| Fixtures + /dev/grid scope | projects.fixtures.ts in Phase 2 now or defer; /dev/grid route wiring; scale-to-N proof mechanism. | ✓ |
| Data boundaries: assetUrl + import rules | Single assetUrl(path) vs split renderUrl/constructionUrl; enforce pages→components→data import boundary via README / ESLint / CI grep. | ✓ |

**User's choice:** All four selected.
**Notes:** Workflow offered 6 areas originally but AskUserQuestion schema enforces 4-option max — two smaller gray areas (construction data shape, placeholder surface) folded into follow-up question batch rather than dropped.

---

## Content modules & §8 shape

**Question:** How should methodology §8 be typed, and how do we split src/content/ modules?

| Option | Description | Selected |
|--------|-------------|----------|
| Split per domain + typed Block with verify flag | content/methodology.ts (MethodologyBlock[] = { index, title, body, needsVerification }) · values.ts · company.ts · placeholders.ts. Phase 3 reads flag to render ⚠ badge. Sanity-migration path is trivial. (Recommended) | ✓ |
| Split per domain + plain string[] for §8 | Same module split, but methodology ships as string[] with ⚠ prefix char. Simpler now; higher migration cost. | |
| Single src/content/index.ts + typed Block | One file exports all. Fewer imports, worse scannability past ~300 lines. | |

**User's choice:** Split per domain + typed Block with verify flag (Recommended)
**Notes:** `body` stays `string` (not rich `Block[]`) — inline emphasis deferred to v2 CMS. `needsVerification: true` on blocks 2, 5, 6 per CONCEPT §11.5.

---

## CI denylist mechanism (QA-04)

**Question:** How should QA-04 denylists (Pictorial/Rubikon + 6-hex whitelist + {{/TODO) be wired?

| Option | Description | Selected |
|--------|-------------|----------|
| Single scripts/check-brand.ts + both postbuild & Actions + fail-hard | One Node script exposes 3 check functions. Runs via `npm run build` postbuild (local) AND dedicated GH Actions step. Non-zero exit blocks deploy. Easy to add a 4th check. (Recommended) | ✓ |
| Single script + Actions-only + fail-hard | No postbuild hook — CI-only. Faster local dev, longer cycle-time. | |
| Three separate scripts + postbuild + fail-hard | scripts/denylist-terms.ts, lint-palette.ts, scan-placeholders.ts. More surface area; easier to skip individual checks during debug. | |

**User's choice:** Single scripts/check-brand.ts + both postbuild & Actions + fail-hard (Recommended)
**Notes:** D-33 adds a 4th check function `importBoundaries()` to the same script, matching the "easy to add a 4th check" rationale.

---

## Fixtures + /dev/grid scope

**Question:** What ships for CON-02 fixtures + scale-to-N proof in Phase 2?

| Option | Description | Selected |
|--------|-------------|----------|
| Fixtures file only; /dev/grid rendering proof deferred to Phase 4 | Phase 2 writes projects.fixtures.ts (10 synthetic ЖК), type-checks as Project[]. Visual /dev/grid rendering lands in Phase 4 when PipelineGrid exists. (Recommended) | ✓ |
| Fixtures + /dev/grid stub + minimal table rendering | Phase 2 wires a /dev/grid route rendering fixtures as `<ul>` of slugs/stages. Phase 4 replaces stub. | |
| Fixtures + full /dev/grid with PipelineGrid now | Pull PipelineGrid forward from Phase 4. Duplicates Phase 4 success criterion; re-work risk. | |

**User's choice:** Fixtures file only; /dev/grid rendering proof deferred to Phase 4 (Recommended)
**Notes:** ROADMAP Phase 2 Success Criterion 1 mentions `/dev/grid` rendering — resolved by documenting the carry-up to Phase 4 (D-08). Phase 2's signal of scale-to-N = `tsc --noEmit` pass on fixtures.

---

## Data boundaries: assetUrl + import rules

**Question:** How should asset-URL helpers and data/content import boundary be structured?

| Option | Description | Selected |
|--------|-------------|----------|
| Split renderUrl + constructionUrl; README convention + CI grep enforcement | Domain-specific helpers wrap a private assetUrl(path). Boundary rules documented + one CI grep step. No ESLint (aligns with STACK.md MVP posture). (Recommended) | ✓ |
| Single assetUrl(path); README-only enforcement | One generic helper. Simpler surface, higher coupling risk (paths assembled at call-sites). | |
| Split helpers + ESLint import/no-restricted-paths | Strongest enforcement, breaks MVP posture. ~1h setup. | |

**User's choice:** Split renderUrl + constructionUrl; README convention + CI grep enforcement (Recommended)
**Notes:** CI grep folded into `scripts/check-brand.ts` as `importBoundaries()` check (D-32, D-33). README update deferred to executor as part of Phase 2 delivery.

---

## Follow-up: Construction teaser selection

**Question:** How are the 3-5 construction photos for home-page ConstructionTeaser selected?

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed curated filenames in src/data/construction.ts | `teaserPhotos: string[]` on latestMonth. Marketing controls selection. One-PR swap. (Recommended) | ✓ |
| First 5 photos from latestMonth().photos | `.slice(0, 5)` — zero config; risk that filesystem-order shots are less photogenic. | |
| Per-photo `featured: true` flag | Metadata on each photo; filter at read time. More authoring overhead. | |

**User's choice:** Fixed curated filenames in src/data/construction.ts (Recommended)

---

## Follow-up: Placeholder module surface

**Question:** How visible should placeholders be in src/content/placeholders.ts?

| Option | Description | Selected |
|--------|-------------|----------|
| Named consts: phone = '—', address = '—', pipeline4Title = 'Без назви' | Typed const exports. Single audit surface for pending client answers. (Recommended) | ✓ |
| Single `placeholders = { ... }` object map | One keyed object, i18n-friendly swap. | |
| Inline '—' in components with TODO comments | Distributed; violates Pitfall 12 + CI {{/TODO denylist. Not viable. | |

**User's choice:** Named consts (Recommended)

---

## Follow-up: Construction.ts authoring pattern

**Question:** How are construction.ts month manifests authored?

| Option | Description | Selected |
|--------|-------------|----------|
| Hand-authored per-month; helper script prints filesystem inventory | `scripts/list-construction.ts` emits TS literals for copy-paste. Captions hand-written per CONCEPT §7.9. ARCHITECTURE Q6 pattern. (Recommended) | ✓ |
| import.meta.glob at module load | Auto-indexes. Breaks `<img src>` via Vite hashing. Rejected by ARCHITECTURE Q6. | |
| Plain Array.from({length:N}) template | Compact; breaks if filenames aren't sequential. | |

**User's choice:** Hand-authored + helper script (Recommended)

---

## Claude's Discretion

Areas where the user did not explicitly decide and Claude has flexibility during planning/execution:

- Exact glob implementation in `check-brand.ts` (shell-out to `grep` vs pure-JS) — use `grep` for MVP per D-24
- Whether `list-construction.ts` runs automatically or via manual npm command — manual preferred (authoring is a thinking task)
- Synthetic data field values in `projects.fixtures.ts` beyond union-constraint satisfaction
- `MethodologyBlock.body` line-break handling (raw `\n\n` vs `paragraphs: string[]`) — recommended raw string
- `socials` type surface in `company.ts` (string union vs plain `string`)
- Commit granularity within the 4 suggested atomic commits

## Deferred Ideas

- `/dev/grid` rendering → Phase 4
- `/dev/brand` → Phase 3
- Image pipeline (AVIF, srcset, sharp) → Phase 6
- ESLint import/no-restricted-paths → v2
- Portable-text methodology blocks → v2 (Sanity migration)
- i18n / EN localisation → v2
- Real phone / address / Pipeline-4 title → v2 (client-blocked §11)
- Methodology §8 verification content → v2 (client-blocked §11.5)
- Lakeview technical specs → v2 CONT2-04
- Multi-project construction log → v2 FEAT2-01
- Form backend → v2 INFR2-04
