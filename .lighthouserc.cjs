/**
 * .lighthouserc.cjs — Phase 6 D-31 (locked) + RESEARCH.md §Code Examples.
 *
 * CommonJS (.cjs) is required because package.json has "type": "module" —
 * lhci's loader expects CommonJS by default. Switching to ESM would
 * require lhci to be invoked with --js-config=esm flag plus other
 * adjustments; .cjs is simpler.
 *
 * Notes:
 *   - 5 URLs match CONTEXT D-31 verbatim. The 4 hash-fragment URLs MUST
 *     preserve the fragment marker through the lhci collect → audit → store
 *     pipeline. Workflow `.github/workflows/lighthouse.yml` runs a smoke
 *     check after `lhci autorun` to verify (RESEARCH Open Q1 mitigation).
 *   - numberOfRuns: 1 — demo-grade gate (D-31). Single runs are noisier
 *     (a slow Chromium spawn or flaky network burst can drop one route
 *     below 90, failing the workflow). If observed flake rate ≥ 2× in
 *     week 1 post-deploy, planner bumps to 3 (median scoring stabilizes).
 *   - chromeFlags: '--incognito' — RESEARCH Pitfall 1: prevents Phase 5
 *     sessionStorage 'vugoda:hero-seen' from carrying across URL runs
 *     within a single lhci collect invocation.
 *   - 4 category assertions only — Lighthouse 12 (used by lhci 0.15.x
 *     since May 2024) removed the PWA category (RESEARCH §State of the
 *     Art). The 4 below are the complete current set.
 *   - upload.target: 'temporary-public-storage' — free Google CDN, link
 *     expires ~7d. Sufficient for demo workflow's PR-comment lifecycle.
 *     Alternative 'filesystem' is used in CI workflow's upload-artifact
 *     step instead for 30-day retention (lighthouse.yml).
 *
 * GITHUB-ACCOUNT NOTE: 5 URLs hardcode `yaroslavpetrukha.github.io`. If
 * the user's account differs, edit this file alongside index.html (D-21,
 * D-23). See docs/CLIENT-HANDOFF.md for the full edit checklist.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'https://yaroslavpetrukha.github.io/vugoda-website/',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/projects',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/zhk/etno-dim',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/construction-log',
        'https://yaroslavpetrukha.github.io/vugoda-website/#/contact',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--incognito',
      },
    },
    assert: {
      assertions: {
        'categories:performance':    ['error', { minScore: 0.9 }],
        'categories:accessibility':  ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo':            ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
