---
phase: 01-foundation-shell
plan: 05
subsystem: infra
tags: [github-actions, github-pages, ci-cd, deploy, vite, oidc]

# Dependency graph
requires:
  - phase: 01-01
    provides: package.json build script (tsc --noEmit && vite build), vite.config.ts with base='/vugoda-website/', public/.nojekyll
  - phase: 01-02
    provides: Tailwind tokens + Montserrat font imports (compiled by vite build)
  - phase: 01-03
    provides: Nav, Footer, Logo, MinimalCube components (compiled by vite build)
  - phase: 01-04
    provides: HashRouter + 6 page stubs — all routes reachable via /#/...
provides:
  - GitHub Actions CI/CD pipeline that deploys dist/ to GitHub Pages on push to main
  - Live public URL https://<account>.github.io/vugoda-website/ (pending human checkpoint)
  - OIDC-based deploy using actions/deploy-pages@v4 (no PAT, no gh-pages npm)
affects:
  - All future phases: every push to main auto-deploys
  - Phase 6: Lighthouse CI job can be added to this workflow later
  - Phase 7: client handoff URL proven on real GH Pages infrastructure

# Tech tracking
tech-stack:
  added: [github-actions, actions/checkout@v4, actions/setup-node@v4, actions/upload-pages-artifact@v3, actions/deploy-pages@v4]
  patterns:
    - OIDC deploy (id-token: write + actions/deploy-pages) — no PAT/secrets needed
    - Concurrency group 'pages' with cancel-in-progress — prevents stale artifact races
    - npm ci (not npm install) for reproducible lockfile-based installs in CI

key-files:
  created:
    - .github/workflows/deploy.yml
  modified: []

key-decisions:
  - "Used actions/deploy-pages@v4 (official) not gh-pages npm or peaceiris — cleaner OIDC, no branch pollution"
  - "node-version: 20 matches .nvmrc 20.19.0 from Plan 01-01"
  - "concurrency cancel-in-progress: true prevents racing deploys on rapid pushes"

patterns-established:
  - "Deploy pattern: build job uploads artifact, deploy job claims it — two-job separation required by GH Pages OIDC"
  - "Workflow verbatim from STACK.md — no modifications; plan instructions treated as authoritative source"

requirements-completed: [DEP-03]

# Metrics
duration: 5min
completed: 2026-04-24
---

# Phase 01 Plan 05: Deploy Workflow Summary

**GitHub Actions CI/CD pipeline via `actions/deploy-pages@v4` with OIDC auth — publishes Vite dist/ to `https://<account>.github.io/vugoda-website/` on every push to main**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-24T16:20:00Z
- **Completed:** 2026-04-24T16:25:00Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint — pending)
- **Files modified:** 1

## Accomplishments

- `.github/workflows/deploy.yml` created verbatim from STACK.md §GitHub Pages Deploy shape
- All anti-list items absent: no `gh-pages` npm, no `peaceiris/actions-gh-pages`, no PAT auth
- Full permissions block: `contents: read`, `pages: write`, `id-token: write` (OIDC path)
- Concurrency guard: `group: pages`, `cancel-in-progress: true`
- Two-job separation: `build` (checkout + npm ci + npm run build + upload artifact) → `deploy` (deploy-pages@v4)

## Task Commits

1. **Task 1: Write .github/workflows/deploy.yml verbatim from STACK.md** - `e72da4d` (chore)
2. **Task 2: Enable Pages in repo Settings + verify live URL** — CHECKPOINT (awaiting human verification)

## Files Created/Modified

- `.github/workflows/deploy.yml` — GitHub Actions pipeline triggering on push to main and workflow_dispatch; deploys Vite dist/ to GitHub Pages via OIDC

## Decisions Made

- Used official `actions/deploy-pages@v4` + `actions/upload-pages-artifact@v3` (not `gh-pages` npm package, not third-party peaceiris)
- `node-version: 20` to match `.nvmrc` (20.19.0) from Plan 01-01
- Workflow verbatim from STACK.md — no modifications, no extra steps added

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Checkpoint Status: AWAITING HUMAN VERIFICATION

Task 2 is a `checkpoint:human-verify`. The user must:

1. Push commits to `origin/main` (or confirm already done)
2. Go to GitHub repo Settings → Pages → Source → **GitHub Actions**
3. Trigger the Deploy to Pages workflow (or wait for it to run automatically on push)
4. Verify the live URL `https://<account>.github.io/vugoda-website/` serves the Phase 1 shell
5. Test all 5 routes via HashRouter hash links + hard-refresh (DEP-03 validation)
6. Confirm keyboard focus outline visible on Nav links
7. Confirm view-source shows `/vugoda-website/assets/index-{hash}.js`

When all checks pass, type `approved`.

## Next Phase Readiness

- Phase 2 (Data Layer & Content) can begin immediately after checkpoint approval
- Every future push to main will auto-deploy — no manual deploy steps needed
- Live URL proves HashRouter + `base: '/vugoda-website/'` + `.nojekyll` on real GH Pages infrastructure (DEP-03)

---
*Phase: 01-foundation-shell*
*Completed: 2026-04-24 (pending checkpoint)*
