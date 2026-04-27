# Phase 7 — Lighthouse CI Archive (SC#4 + UAT-1 + UAT-5)

**Date:** 2026-04-27
**Source:** `.lighthouserc.cjs` driven via `npx lhci collect` against deployed URL (D-20 fallback path — see Fallback note below)
**CI Run reference:** `https://github.com/YaroslavPetrukha/vugoda-website/actions/runs/24979603885` (workflow `Lighthouse Audit`, conclusion: success, hash-fragment smoke-check PASS)
**Commit SHA:** `de3b2b3` (HEAD of `main` post Wave-1 push that triggered the deploy)
**Threshold (QA-02):** all 4 categories ≥0.9 on all 5 routes

## Scores per route

| Route (requestedUrl) | Performance | Accessibility | Best Practices | SEO |
|----------------------|-------------|---------------|----------------|-----|
| https://yaroslavpetrukha.github.io/vugoda-website/                    | 0.98 | 0.98 | 1.00 | 1.00 |
| https://yaroslavpetrukha.github.io/vugoda-website/#/projects          | 0.98 | 0.98 | 1.00 | 1.00 |
| https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim      | 0.99 | 1.00 | 1.00 | 1.00 |
| https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log  | 0.99 | 1.00 | 1.00 | 1.00 |
| https://yaroslavpetrukha.github.io/vugoda-website/#/contact           | 1.00 | 1.00 | 1.00 | 1.00 |

(Scores rendered as 0..1 per Lighthouse v12 schema; multiply by 100 for the «≥90» threshold reference. 0.98 = 98, 1.00 = 100.)

## UAT-1 closure (Phase 6 D-01)

UAT-1 expected: all 4 categories ≥0.9 on each of 5 routes.
Result: **0 threshold violations / 20 total checks** (5 routes × 4 categories).

- **PASS — UAT-1 closes via this archive.** Minimum score across the entire matrix is 0.98 (Performance + Accessibility on `/` and `/#/projects`); all other 16 cells = 1.00 (perfect). Phase 6 performance-mobile-fallback-deploy pipeline lands as designed.

## UAT-5 closure (Phase 6 D-05)

UAT-5 expected: workflow_run chain triggered, completed successfully, smoke-check «PASS: hash-fragment URL fidelity verified.»

- Workflow conclusion: **success** (run id 24979603885, triggered by `Deploy to Pages` workflow_run on commit `de3b2b3`, completed 2026-04-27T06:18:59Z)
- Hash-fragment count: **4 / 5** lhr-*.json contain `#` in requestedUrl (the 5th = bare home `/` per .lighthouserc.cjs URL list — same shape as CI run)
- Threshold (D-05): ≥4 of 5 must contain `#` — **MET**
- CI smoke-check log line: `"Hash-fragment URLs in lhr-*.json: 4 of 5 expected ≥ 4 — PASS: hash-fragment URL fidelity verified."` (verbatim from job log timestamp 06:18:59.88)
- **Result: PASS — UAT-5 closes via this archive.**

## Fallback note (D-20)

D-20 fallback path was used to obtain the archived `lhr-*.json` files because:

1. CI run 24979603885 succeeded end-to-end (lhci autorun + smoke-check both PASS — see job log 06:17:50→06:18:59).
2. However, `.lighthouserc.cjs` has `upload.target: 'temporary-public-storage'`, which causes lhci to upload the LHRs to Google's temporary CDN (link expires ~7 days) AND clean up the local `.lighthouseci/` directory after upload.
3. By the time the workflow's `actions/upload-artifact@v4` step ran, `.lighthouseci/` was empty: `"##[warning]No files were found with the provided path: .lighthouseci/. No artifacts will be uploaded."` (job log timestamp 06:19:00.11).
4. Therefore `gh run download 24979603885` returns "no valid artifacts found to download".

To recover the LHRs without re-deploying, executed locally on 2026-04-27T07:25:39Z:
```
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx lhci collect --config=.lighthouserc.cjs
```

This runs against the SAME deployed URL the CI run audited (deployed bundle `index-C35JwVpg.js` from commit `de3b2b3`). LHCI configuration is identical (`.lighthouserc.cjs` is unchanged since Phase 6). The local collect produced 5 lhr-*.json files; assertion thresholds are identical to the CI run's (and would have produced the same PASS verdict had the CI artifact been retained).

**Recommended follow-up (backlog item):** edit `.lighthouserc.cjs` to either (a) drop `upload.target` so lhci leaves files in `.lighthouseci/` for upload-artifact to grab, or (b) split into `lhcirc-ci.cjs` (no upload) + `lhcirc-local.cjs` (with upload), so future CI runs produce a downloadable artifact. Out of scope for Phase 7 itself (verification archive doesn't require it once the local fallback is documented + recoverable).

## Artifact files

Full lhr-*.json + lhr-*.html files are committed under: `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-de3b2b3/`. Each JSON contains the full Lighthouse audit (1-3 MB per route — committed verbatim, no minification). Each HTML is the human-readable Lighthouse report viewable in any browser. The directory also contains:

- `RUN-URL.txt` — pointer to the CI run that originally produced equivalent scores
- `FALLBACK-NOTE.txt` — short pointer to this SUMMARY.md's Fallback note section
