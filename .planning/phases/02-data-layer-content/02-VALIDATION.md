---
phase: 02
slug: data-layer-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `02-RESEARCH.md §Validation Architecture`.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript type-check (`tsc --noEmit`) — no test runner (Vitest skipped per STACK.md) + grep-based CI checks in `scripts/check-brand.ts` |
| **Config file** | `tsconfig.json` (covers `src/`) + `tsconfig.scripts.json` (covers `scripts/` — created in Wave 0) |
| **Quick run command** | `npm run lint` (type-check `src/`, ~2s) |
| **Full suite command** | `npm run build` (chains `prebuild` → `tsc --noEmit` → `vite build` → `postbuild` check-brand, ~15–30s) |
| **Estimated runtime** | ~2s (quick) · ~15–30s (full) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint` — type-checks `src/` (catches data/type/fixture drift fast)
- **After any commit that touches `scripts/`:** Also run `npx tsc --noEmit -p tsconfig.scripts.json` (script-local type-check)
- **After every plan wave:** Run `npm run build` — exercises `prebuild` (copy-renders) + `tsc` + `vite build` + `postbuild` (check-brand)
- **Before `/gsd:verify-work`:** `npm run build` must exit 0 with zero tsc errors AND zero check-brand failures
- **Max feedback latency:** 30 seconds (full pipeline)

---

## Per-Task Verification Map

*Filled in during planning — each plan's `<task>` emits one row. Status tracked here during execution.*

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-XX-YY | TBD  | TBD  | CON-01/02/ZHK-02/QA-04 | tsc / grep / build | `npm run lint` \| `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Files / infrastructure that must exist before any task-level test can run. Derived from `02-RESEARCH.md §Validation Architecture > Wave 0 Gaps`.

- [ ] `scripts/` directory created
- [ ] `tsconfig.scripts.json` — `{ "extends": "./tsconfig.json", "include": ["scripts/**/*.ts"], "compilerOptions": { "lib": ["ES2022"], "types": ["node"] } }` (no DOM lib for Node scripts)
- [ ] `tsx@^4.21.0` added to `devDependencies` (blocks all script execution without it)
- [ ] `src/data/types.ts` — foundation for all data-module type-checks
- [ ] `src/content/` directory created (methodology / values / company / placeholders modules follow)
- [ ] `src/lib/assetUrl.ts` — consumed by future JSX; boundary test target for `renderUrl`/`constructionUrl`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Translit script actually produces `public/renders/lakeview/`, `public/renders/etno-dim/`, `public/renders/maietok-vynnykivskyi/`, `public/renders/nterest/` with correct file counts | CON-01 / Success Criterion 2 | Requires executing `npm run prebuild` and inspecting `public/` filesystem tree | Run `npm run prebuild`; verify 4 dirs exist under `public/renders/`; `ls public/renders/lakeview/ \| wc -l` = 7; `ls public/renders/etno-dim/ \| wc -l` = 8; `ls public/renders/maietok-vynnykivskyi/ \| wc -l` = 2; `ls public/renders/nterest/ \| wc -l` = 3; `ls public/construction/ \| wc -l` = 4 (months only, no `_social-covers`) |
| Construction log caption tone matches CONCEPT §7.9 ("без хвастощів") | CON-01 | Subjective editorial judgment | Read `src/data/construction.ts` aloud; confirm no marketing superlatives; alt defaults to «Будівельний майданчик, <month UA>» |
| Methodology blocks 2/5/6 have `needsVerification: true` | CON-01 (CONCEPT §11.5) | Requires mapping CONCEPT §8 block numbers to their text content | Read `src/content/methodology.ts`; verify blocks 2, 5, 6 have `needsVerification: true`; verify blocks 1, 3, 4, 7 have `needsVerification: false` |
| GitHub Actions `check-brand` step runs in correct position | QA-04 / Phase 1 deploy | Requires pushing to a branch and watching CI logs | Push branch; confirm job runs `Build → Check brand invariants → Upload Pages artifact → Deploy`; step fails red if `scripts/check-brand.ts` exits non-zero |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies listed in their `<read_first>`
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (tsc or grep)
- [ ] Wave 0 covers all MISSING references (tsx install, scripts/ dir, tsconfig.scripts.json, src/data/types.ts)
- [ ] No watch-mode flags (`--watch`) in any npm script or CI step
- [ ] Feedback latency < 30s on full `npm run build`
- [ ] `nyquist_compliant: true` set in frontmatter once execute-phase closes Phase 2

**Approval:** pending
