---
phase: 01-foundation-shell
plan: 05
type: execute
wave: 4
depends_on:
  - 01-01
  - 01-02
  - 01-03
  - 01-04
files_modified:
  - .github/workflows/deploy.yml
autonomous: false
requirements:
  - DEP-03
objective: "GitHub Actions deploy workflow — verbatim `deploy.yml` from STACK.md §GitHub Pages Deploy shape. Uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` (NOT `gh-pages` npm package). On push to main: checkout → setup-node@20 → npm ci → npm run build → upload dist as Pages artifact → deploy. This satisfies carry-up from Phase 6: Phase 1 ships the deploy plumbing live to prove GH Pages + base-path + HashRouter + .nojekyll all work on the real Pages server. Phase 6 still owns OG meta, Lighthouse audit, perf budget, mobile-fallback (narrowed scope per D-18). Ends with a checkpoint that user enables Pages in repo Settings and confirms the public URL loads the shell."

must_haves:
  truths:
    - "`.github/workflows/deploy.yml` triggers on push to main and workflow_dispatch"
    - "Workflow uses `actions/checkout@v4`, `actions/setup-node@v4` (node 20, cache npm), `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` — NOT `gh-pages` npm package"
    - "Workflow has `permissions: { contents: read, pages: write, id-token: write }` (STACK.md verbatim)"
    - "Workflow has `concurrency: { group: pages, cancel-in-progress: true }` (STACK.md verbatim)"
    - "Live URL `https://<account>.github.io/vugoda-website/` serves the Phase 1 shell — Nav + Footer + all 5 route stubs reachable via `/#/...`"
  artifacts:
    - path: ".github/workflows/deploy.yml"
      provides: "Deploy-to-Pages CI/CD pipeline"
      contains: "actions/deploy-pages@v4"
      min_lines: 20
  key_links:
    - from: ".github/workflows/deploy.yml"
      to: "npm run build (→ tsc --noEmit && vite build)"
      via: "workflow step"
      pattern: "run: npm run build"
    - from: ".github/workflows/deploy.yml"
      to: "public/.nojekyll"
      via: "Vite copies to dist/ at build time"
      pattern: "path: dist"
---

<objective>
Ship the deploy plumbing. Carry-up from Phase 6 per CONTEXT.md authorization: Phase 1 ends with a LIVE public URL so DEP-03 (base path + HashRouter + .nojekyll) is proven against real GH Pages servers, not just dev. Phase 6 keeps OG meta / Lighthouse / perf budget / mobile-fallback — narrower scope, no surprises at the end.

Purpose: Closes Phase 1 with deployed proof that every Plan 01-04 artifact compiles, loads, and routes on GH Pages. Removes the single biggest late-phase risk (DEP-03 "works locally, fails on Pages" failure mode — pitfall 2).

Output: `.github/workflows/deploy.yml` file + live `https://<account>.github.io/vugoda-website/` URL verified by checkpoint.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-shell/01-CONTEXT.md
@.planning/research/STACK.md
@.planning/research/PITFALLS.md

<interfaces>
<!-- VERBATIM workflow from STACK.md §"GitHub Pages Deploy — Workflow Shape" -->
<!-- Copy this block into .github/workflows/deploy.yml verbatim -->

name: Deploy to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.dep.outputs.page_url }} }
    steps:
      - id: dep
        uses: actions/deploy-pages@v4

<!-- Forbidden (anti-list): -->
  gh-pages npm package
  peaceiris/actions-gh-pages (3rd party — rejected per STACK.md)
  Any PAT-based auth (id-token: write is the OIDC path)
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Write .github/workflows/deploy.yml verbatim from STACK.md</name>

  <read_first>
    - `.planning/research/STACK.md` §"GitHub Pages Deploy — Workflow Shape" (this is the authoritative verbatim block)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Deploy D-15, D-16, D-17, D-18 (scope confirmation — this phase ships deploy.yml only; OG/Lighthouse = Phase 6)
    - `.planning/research/PITFALLS.md` §Integration Gotchas → "GitHub Actions deploy" (use `actions/deploy-pages`, permissions block, NOT 3rd-party actions)
    - `package.json` (from Plan 01) — confirms `build` script = `tsc --noEmit && vite build`
    - `vite.config.ts` (from Plan 01) — confirms `base: '/vugoda-website/'` so dist/ produces correctly-prefixed asset URLs
    - `public/.nojekyll` (from Plan 01) — already committed; Vite copies `public/*` verbatim to `dist/`, so `.nojekyll` ships automatically
  </read_first>

  <files>
    .github/workflows/deploy.yml
  </files>

  <action>
    Create `.github/workflows/deploy.yml` with EXACTLY this content (verbatim from STACK.md — do NOT modify shape, do NOT add steps, do NOT change versions). YAML is whitespace-sensitive; use this EXPANDED block (NOT the flow-style one in `<interfaces>` — that's a reference shorthand). `steps:` sits at the job level as sibling of `environment:` and `runs-on:`, NOT nested under `environment:`:

    ```yaml
    name: Deploy to Pages

    on:
      push:
        branches: [main]
      workflow_dispatch:

    permissions:
      contents: read
      pages: write
      id-token: write

    concurrency:
      group: pages
      cancel-in-progress: true

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: 20
              cache: npm
          - run: npm ci
          - run: npm run build
          - uses: actions/upload-pages-artifact@v3
            with:
              path: dist

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.dep.outputs.page_url }}
        steps:
          - id: dep
            uses: actions/deploy-pages@v4
    ```

    Rationale for each element:
    - `on: push: branches: [main]` — triggers deploy on merge/push to main. `workflow_dispatch` allows manual re-run from the Actions UI.
    - `permissions` block — required by `actions/deploy-pages@v4`: `pages: write` to deploy, `id-token: write` for OIDC (avoids PATs), `contents: read` for checkout.
    - `concurrency: group: pages, cancel-in-progress: true` — if a new push arrives while an old deploy is running, cancel the old one so we don't serve stale artifacts.
    - `actions/checkout@v4` — current major (v5 not yet GA at research date 2026-04-24).
    - `actions/setup-node@v4` with `node-version: 20` — matches `.nvmrc` `20.19.0` from Plan 01.
    - `cache: npm` — caches `~/.npm` directory based on `package-lock.json` hash; speeds up subsequent builds.
    - `npm ci` NOT `npm install` — reproducible install from lockfile.
    - `npm run build` — runs `tsc --noEmit && vite build` per package.json from Plan 01. Outputs to `dist/` per vite.config.ts.
    - `actions/upload-pages-artifact@v3` with `path: dist` — packages `dist/` (including `dist/.nojekyll` copied from public) as a Pages artifact.
    - `needs: build` — deploy job waits for build.
    - `environment: name: github-pages` — marks this as a deploy to the github-pages environment; GitHub uses this to show "Deployed to github-pages" status in the UI and to report the URL.
    - `url: ${{ steps.dep.outputs.page_url }}` — the URL becomes clickable in the Actions run summary.
    - `actions/deploy-pages@v4` — official Pages deploy action; claims the Pages artifact from upload step and publishes to the Pages environment.

    Forbidden (anti-list enforced):
    - NO `gh-pages` npm package usage.
    - NO `peaceiris/actions-gh-pages` 3rd-party action.
    - NO PAT-based auth (`secrets.GITHUB_TOKEN` is not used explicitly; `id-token: write` + `actions/deploy-pages@v4` use OIDC).
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f .github/workflows/deploy.yml && grep -q "^name: Deploy to Pages" .github/workflows/deploy.yml && grep -q "branches: \[main\]" .github/workflows/deploy.yml && grep -q "workflow_dispatch:" .github/workflows/deploy.yml && grep -q "pages: write" .github/workflows/deploy.yml && grep -q "id-token: write" .github/workflows/deploy.yml && grep -q "contents: read" .github/workflows/deploy.yml && grep -q "group: pages" .github/workflows/deploy.yml && grep -q "cancel-in-progress: true" .github/workflows/deploy.yml && grep -q "actions/checkout@v4" .github/workflows/deploy.yml && grep -q "actions/setup-node@v4" .github/workflows/deploy.yml && grep -q "node-version: 20" .github/workflows/deploy.yml && grep -q "cache: npm" .github/workflows/deploy.yml && grep -q "run: npm ci" .github/workflows/deploy.yml && grep -q "run: npm run build" .github/workflows/deploy.yml && grep -q "actions/upload-pages-artifact@v3" .github/workflows/deploy.yml && grep -q "path: dist" .github/workflows/deploy.yml && grep -q "actions/deploy-pages@v4" .github/workflows/deploy.yml && grep -q "name: github-pages" .github/workflows/deploy.yml && grep -q "needs: build" .github/workflows/deploy.yml && ! grep -qE "peaceiris/actions-gh-pages" .github/workflows/deploy.yml && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f .github/workflows/deploy.yml` succeeds
    - `wc -l .github/workflows/deploy.yml` ≥ 20 (ensures full workflow, not stub)
    - Header: `grep -c "^name: Deploy to Pages" .github/workflows/deploy.yml` ≥ 1
    - Triggers: `grep -c "branches: \\[main\\]" .github/workflows/deploy.yml` ≥ 1 AND `grep -c "workflow_dispatch:" .github/workflows/deploy.yml` ≥ 1
    - Permissions block present:
      - `grep -c "pages: write" .github/workflows/deploy.yml` ≥ 1
      - `grep -c "id-token: write" .github/workflows/deploy.yml` ≥ 1
      - `grep -c "contents: read" .github/workflows/deploy.yml` ≥ 1
    - Concurrency: `grep -c "group: pages" .github/workflows/deploy.yml` ≥ 1 AND `grep -c "cancel-in-progress: true" .github/workflows/deploy.yml` ≥ 1
    - All 4 pinned actions present at correct major versions:
      - `grep -c "actions/checkout@v4" .github/workflows/deploy.yml` ≥ 1
      - `grep -c "actions/setup-node@v4" .github/workflows/deploy.yml` ≥ 1
      - `grep -c "actions/upload-pages-artifact@v3" .github/workflows/deploy.yml` ≥ 1
      - `grep -c "actions/deploy-pages@v4" .github/workflows/deploy.yml` ≥ 1
    - Node version matches .nvmrc: `grep -c "node-version: 20" .github/workflows/deploy.yml` ≥ 1
    - Cache enabled: `grep -c "cache: npm" .github/workflows/deploy.yml` ≥ 1
    - Install + build commands: `grep -c "run: npm ci" .github/workflows/deploy.yml` ≥ 1 AND `grep -c "run: npm run build" .github/workflows/deploy.yml` ≥ 1
    - Artifact path: `grep -c "path: dist" .github/workflows/deploy.yml` ≥ 1
    - Deploy job depends on build: `grep -c "needs: build" .github/workflows/deploy.yml` ≥ 1
    - Environment named github-pages: `grep -c "name: github-pages" .github/workflows/deploy.yml` ≥ 1
    - Anti-list absent: `grep -cE "peaceiris/actions-gh-pages" .github/workflows/deploy.yml` = 0 AND `grep -cE "^\\s*-\\s*(run|uses):\\s*gh-pages" .github/workflows/deploy.yml` = 0 (no `gh-pages` npm invocation)
  </acceptance_criteria>

  <done>
    `.github/workflows/deploy.yml` ships verbatim from STACK.md §GitHub Pages Deploy. Pinned to `@v4`/`@v3` major versions verified 2026-04-24. Anti-list enforced. Ready for first push to main.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Enable Pages in repo Settings + verify live URL</name>

  <files>
    (no file writes — this is a human-action + live-URL verification checkpoint)
  </files>

  <action>
    Prior task (Task 1) has committed `.github/workflows/deploy.yml`. This task does NOT write files — it pauses execution to let the user (a) enable GitHub Pages in the repo Settings (a GUI-only toggle that Claude cannot automate without broad repo permissions) and (b) verify the live public URL serves the Phase 1 shell correctly.

    Hand control to the user with the step-by-step instructions in `<how-to-verify>` below. Resume when the user types `approved` per `<resume-signal>`.
  </action>

  <what-built>
    Deploy workflow file `.github/workflows/deploy.yml` is committed. On next push to main, GitHub Actions will run the workflow and attempt to publish `dist/` to GitHub Pages. This is the FIRST deploy and requires a one-time human action: enabling Pages in the repository settings. Claude cannot enable Pages — it's a GUI-only toggle (GitHub CLI cannot toggle Pages source without specific permissions that the user controls).
  </what-built>

  <how-to-verify>
    **Step 0 (pre-check — commit-hygiene gate before triggering the deploy):**

    Before pushing, ensure the working tree is clean and all 5 plans are committed locally:
    ```
    git status
    git log --oneline -6
    ```

    - `git status` should report `nothing to commit, working tree clean`.
    - `git log --oneline -6` should show commits for all 5 plans: (1) Plan 01-01 deps/config, (2) Plan 01-02 tokens/fonts, (3) Plan 01-03 brand/layout, (4) Plan 01-04 router/pages, (5) Plan 01-05 deploy workflow. If the commits for any of these plans are missing (e.g., work was done on a branch that never got merged), `git checkout main && git merge <branch>` or commit the pending changes BEFORE pushing. Otherwise the first GH Actions run will ship a partial shell and the checkpoint verification (steps 10-13 below) will fail because Nav/Footer/routes won't all be present yet.

    **Pre-deploy steps (user action, one-time):**

    1. Push the current branch to `main` (or open and merge a PR):
       ```
       git push origin main
       ```
    2. Open the repository on GitHub.com.
    3. Go to **Settings → Pages**.
    4. Under **Build and deployment → Source**, select: **GitHub Actions**.
       (Do NOT select "Deploy from a branch" — that's the legacy flow incompatible with `actions/deploy-pages@v4`.)
    5. Save/Apply if prompted.

    **Trigger the workflow:**

    6. Go to **Actions** tab → **Deploy to Pages** workflow.
    7. If the workflow already ran automatically on push, click the most recent run.
       If it didn't run or was queued/failed due to Pages being unconfigured, click **Re-run all jobs** (top-right), OR click **Run workflow** → branch `main` → **Run workflow** (this uses the `workflow_dispatch:` trigger).
    8. Wait for BOTH jobs (`build` and `deploy`) to complete. Expected duration: ~1-3 minutes.

    **Verify the live URL:**

    9. In the Actions run summary, find the **deploy** job. It will show a URL like:
       `https://<account>.github.io/vugoda-website/`
       (e.g., `https://yaroslavpetrukha.github.io/vugoda-website/` — per STATE.md default; substitute your actual GitHub account.)

    10. Open that URL in a browser. You should see the Phase 1 shell:
        - Dark `#2F3640` Nav at top with brand logo + «Проєкти · Хід будівництва · Контакт»
        - Home stub in the middle: H1 «ВИГОДА» + wireframe isometric cube
        - Footer at bottom with legal triplet, email, social-placeholder icons

    11. **Navigate & refresh test** (DEP-03 + HashRouter smoke test — THE reason this deploy exists in Phase 1):
        - Click «Проєкти» → URL should change to `https://<account>.github.io/vugoda-website/#/projects` → H1 «Проєкти» renders.
        - Hard-refresh (Cmd/Ctrl + Shift + R) while on `/#/projects` → SHOULD still load «Проєкти» page (NOT a GitHub 404). This is THE critical test — if this works, HashRouter + `base` + `.nojekyll` are all correct.
        - Click «Хід будівництва» → `/#/construction-log` → H1 «Хід будівництва».
        - Click «Контакт» → `/#/contact` → H1 «Контакт».
        - Click Logo → back to `/#/` → H1 «ВИГОДА».
        - Manually paste `https://<account>.github.io/vugoda-website/#/zhk/etno-dim` into a new tab → H1 «ЖК» renders (Phase 1 slug-agnostic stub; Phase 4 adds real content).
        - Manually paste `https://<account>.github.io/vugoda-website/#/garbage-route` → NotFoundPage renders: H1 «404 — сторінку не знайдено» + link «Повернутись до головної».

    12. **Keyboard accessibility test** (Success Criterion #5):
        - Click into the URL bar, then Tab into the page (or press Tab on first load).
        - Tab across the three Nav links. Each should show a visible 2px `#C1F33D` accent outline (2px offset) when focused. The outline should be clearly readable against the dark `#2F3640` background.

    13. **View-source test** (confirms build integrity):
        - View source on the home page. Look for `<div id="root">` and `<script type="module"` with a hashed Vite asset URL starting with `/vugoda-website/assets/`. Confirms base path was applied correctly by Vite build.

    **Expected outcome: green checkmarks on all 14 sub-steps above (Step 0 pre-check + steps 1-13). If any fail, paste the failure into the resume-signal with the URL and the browser console error if any.**
  </how-to-verify>

  <verify>
    <automated>echo "Human verification checkpoint — see <how-to-verify> block; no automated check."</automated>
  </verify>

  <acceptance_criteria>
    - **Pre-push commit hygiene:** `git log origin/main --oneline | head -10` shows commits for all 5 plans (01-01 deps, 01-02 tokens/fonts, 01-03 brand/layout, 01-04 router/pages, 01-05 deploy) present on `origin/main` before the GH Actions workflow is triggered. This prevents the first deploy from shipping a partial shell.
    - User has pushed to `main` and the `Deploy to Pages` workflow has completed both jobs (build + deploy) with green status
    - Public URL `https://<account>.github.io/vugoda-website/` is reachable and serves the Phase 1 shell with Nav + Home stub (H1 «ВИГОДА» + cube) + Footer
    - Hard-refresh on `/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` all load correctly (no 404) from cold incognito tab — validates DEP-03
    - `/#/garbage-route` renders NotFoundPage with H1 «404 — сторінку не знайдено» + «Повернутись до головної» link
    - Tab-focus on any Nav link shows visible 2px `#C1F33D` accent outline on dark background — validates Success Criterion #5
    - View-source on home page shows `<script type="module" src="/vugoda-website/assets/index-{hash}.js">` — confirms `base: '/vugoda-website/'` was applied at build time
    - User types `approved` in resume-signal
  </acceptance_criteria>

  <resume-signal>
    Type `approved` if all 14 sub-steps (Step 0 pre-check + steps 1-13) pass and the public URL serves the shell correctly.

    If issues surface, describe them and paste:
    - The Actions run URL (if build/deploy job failed)
    - Screenshot/text of browser console errors (if load failed)
    - The specific URL that 404'd or misbehaved (for DEP-03 failures)

    Common troubleshooting:
    - If first run fails with "Pages not enabled": finish step 4 (enable GitHub Actions source), then re-run.
    - If assets 404 on the live site but work locally: check `vite.config.ts` has `base: '/vugoda-website/'` EXACTLY (matching repo name).
    - If `/#/` renders but `/#/projects` hard-refresh 404s: confirm `public/.nojekyll` exists in `dist/` (it should copy automatically; inspect the `dist/` artifact in the Actions run).
  </resume-signal>

  <done>
    User has enabled GitHub Pages (Actions source), the workflow has deployed successfully, and the public URL serves the Phase 1 shell with all 5 routes (+ 404) reachable via hash deep-link and hard-refresh. DEP-03 validated against real GH Pages infrastructure. Phase 1 closed.
  </done>
</task>

</tasks>

<verification>
Phase-level checks closed by this plan:
1. Success Criterion #4 runs live: `https://<account>.github.io/vugoda-website/#/projects`, `/#/zhk/etno-dim`, `/#/construction-log`, `/#/contact` all load from cold incognito tab (hard-refresh test).
2. Success Criterion #1 visible: Nav + Footer render on every route live.
3. Success Criterion #5 demonstrable: Tab through Nav shows accent outline on live site.
4. DEP-03 proven end-to-end: HashRouter + `base: '/vugoda-website/'` + `public/.nojekyll` work on real GH Pages infrastructure.
5. No 404-on-refresh class failures — HashRouter decision validated (not just theoretical).
</verification>

<success_criteria>
- `deploy.yml` exists with verbatim STACK.md shape.
- Pinned action versions (`@v4`, `@v3`) present.
- Permissions block correct for OIDC.
- Anti-list absent (no `gh-pages` npm, no 3rd-party peaceiris action).
- User completes checkpoint: Pages enabled, first workflow run succeeds, live URL serves Phase 1 shell, all 5 routes + 404 work via hash deep-link + hard-refresh.
</success_criteria>

<output>
Create `.planning/phases/01-foundation-shell/01-05-SUMMARY.md`:
- Final public URL (pasted verbatim from user's approval message)
- Actions run URL of the first successful deploy
- Confirmation that all 5 routes hard-refresh correctly
- Any quirks noted (e.g., initial 404 until Pages enabled; workflow re-run count; build log excerpts)
- Hand-off note: Phase 2 inherits a live URL; every future commit to main auto-deploys
</output>
