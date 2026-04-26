# Phase 06 — Deferred Items

Items discovered during execution that are out-of-scope for the current plan.

## From Plan 06-01 (hooks-foundation)

### Pre-existing: `npm run build` prebuild fails on `optimize-images.mjs`

- **Discovered during:** Plan 06-01 verification phase.
- **Symptom:** `prebuild` script runs `node scripts/optimize-images.mjs renders` which fails with `unable to open for write` on `public/renders/etno-dim/_opt/43621.jpg-1920.jpg` (`No such file or directory`). Same failure observed for `public/renders/lakeview/_opt/hero-1920.avif`.
- **Confirmed pre-existing:** Stashed Plan 06-01 changes and re-ran `npm run build` — same failure reproduces, so it is NOT caused by hook files added in 06-01.
- **Likely cause:** `_opt/` output directories not pre-created before sharp `.toFile()` writes; Node v25.9.0 fs behaviour differs from Node 20 LTS that the script was authored against.
- **Scope:** out-of-scope for 06-01 (hook files do not touch image pipeline). Likely to be addressed by 06-03 (devdep-and-utility) or earlier prebuild hardening.
- **Verification proxy used in 06-01:** `npx tsc --noEmit` (PASS), `npx tsx scripts/check-brand.ts` (5/5 PASS). Both confirm the new hook files compile and stay within brand boundaries — the only verification gates 06-01 itself can drive.
