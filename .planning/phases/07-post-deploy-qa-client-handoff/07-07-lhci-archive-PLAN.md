---
phase: 07-post-deploy-qa-client-handoff
plan: 07
type: execute
wave: 3
depends_on: ["07-01-axe-script-and-devdep", "07-02-clienthandoff-section-11", "07-03-keyboard-walkthrough", "07-04-hard-refresh-test", "07-05-layout-screenshots", "07-06-mobile-fallback-screenshot"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md
  - .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv
autonomous: true
requirements_addressed: [QA-02]

must_haves:
  truths:
    - "Latest .github/workflows/lighthouse.yml CI run on main is identified by databaseId, headSha, and conclusion=success"
    - "lhci CI artifact is downloaded into .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{commit-sha}/"
    - "lighthouse/SUMMARY.md contains a 5-row × 4-col scores table extracted from lhr-*.json files (one row per route)"
    - "All 5 routes show ≥0.9 in all 4 categories (Performance, Accessibility, Best Practices, SEO) per QA-02 + UAT-1 closure threshold"
    - "Phase 6 UAT-5 lhci workflow_run chain verified: smoke-check step PASS, ≥4 of 5 lhr-*.json contain `#` in requestedUrl"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md"
      provides: "5×4 lhci scores table + workflow run URL + UAT-1 + UAT-5 cross-references"
      min_lines: 30
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{commit-sha}/"
      provides: "Full lhci CI artifact: lhr-*.json (1 per route) + assertion-results.json + manifest.json"
      contains: "lhr-"
  key_links:
    - from: "lighthouse/SUMMARY.md"
      to: ".github/workflows/lighthouse.yml run URL"
      via: "gh CLI run list"
      pattern: "lighthouse\\.yml"
    - from: "lighthouse/SUMMARY.md scores table"
      to: "categories.{performance,accessibility,best-practices,seo}.score"
      via: "jq extraction from lhr-*.json"
      pattern: "categories"
---

<objective>
Use `gh` CLI to fetch the latest `.github/workflows/lighthouse.yml` CI artifact, archive it under `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/`, and generate `lighthouse/SUMMARY.md` with a 5-row × 4-col scores table. Verify all 5 routes ≥0.9 in 4 categories. Cross-reference UAT-1 (Lighthouse ≥90 deployed) and UAT-5 (workflow_run chain validation).

Purpose: Closes Phase 7 SC#4 scores half (Lighthouse desktop ≥90 archived per route per D-19). Closes Phase 6 UAT-1 + UAT-5 (D-01 + D-05 absorption pairing). The lhci CI artifact is the source of truth for scores per D-19 — Phase 7 archives, doesn't re-measure. Fallback path: if CI artifact unavailable, run `lhci collect` locally per D-20.
Output: `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md`, `lighthouse/SUMMARY-raw.tsv` (intermediate), `lighthouse/lhci-{commit-sha}/lhr-*.json` (downloaded artifact).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@.planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md
@.lighthouserc.cjs
@.github/workflows/lighthouse.yml

<interfaces>
<!-- gh CLI invocation patterns (D-19 procedure verbatim): -->
<!--   gh run list --workflow lighthouse.yml --limit 1 --json databaseId,headSha,status,conclusion -->
<!--     Returns: [{ databaseId: 12345, headSha: "abc123", status: "completed", conclusion: "success" }] -->
<!--   gh run view {RUN_ID} --json conclusion --jq '.conclusion' -->
<!--   gh run download {RUN_ID} --dir {target} -->
<!--     Downloads ALL artifacts of the run; --name flag scopes to one artifact -->

<!-- lhci artifact shape (Phase 6 D-31 .github/workflows/lighthouse.yml): -->
<!--   .lighthouseci/lhr-*.json     (one per URL: 5 routes per .lighthouserc.cjs ci.collect.url) -->
<!--   .lighthouseci/assertion-results.json -->
<!--   .lighthouseci/manifest.json -->

<!-- lhr-*.json categories shape (Lighthouse v12 schema): -->
<!--   .categories.performance.score      (0..1 number; multiply by 100 for "≥90" threshold) -->
<!--   .categories.accessibility.score -->
<!--   .categories["best-practices"].score   (note: dash and bracket-notation in jq) -->
<!--   .categories.seo.score -->
<!--   .requestedUrl                         (e.g., "https://yaroslavpetrukha.github.io/vugoda-website/#/projects") -->

<!-- UAT-5 smoke-check (Phase 6 D-32): -->
<!--   .github/workflows/lighthouse.yml has a step that greps lhr-*.json for "#" in requestedUrl -->
<!--   Step output: "PASS: hash-fragment URL fidelity verified." OR similar PASS/FAIL line -->
<!--   ≥4 of 5 lhr-*.json must contain `#` in requestedUrl -->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Fetch latest lighthouse.yml CI run + download artifact via gh CLI</name>
  <files>.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{commit-sha}/</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-19 procedure + D-20 fallback)
    - .github/workflows/lighthouse.yml (workflow file structure — confirm artifact name + scope)
    - .lighthouserc.cjs (verify 5 URLs match production hash-routes)
  </read_first>
  <action>
    Per D-19 procedure verbatim:

    1. Verify `gh` CLI is available + authenticated:
       ```bash
       gh --version    # Must print a version like "gh version 2.x.y"
       gh auth status  # Must show "Logged in to github.com"
       ```
       If not authenticated, the executor exits with a CHECKPOINT — user must run `gh auth login` first. (Auth gates are dynamic per checkpoints rules.)

    2. Fetch the latest `lighthouse.yml` workflow run on `main`:
       ```bash
       LATEST_RUN=$(gh run list --workflow lighthouse.yml --branch main --limit 1 --json databaseId,headSha,status,conclusion)
       echo "$LATEST_RUN"
       # Expected JSON: [{"databaseId":NNN,"headSha":"abc123def","status":"completed","conclusion":"success"}]
       RUN_ID=$(echo "$LATEST_RUN" | jq -r '.[0].databaseId')
       HEAD_SHA=$(echo "$LATEST_RUN" | jq -r '.[0].headSha')
       CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion')
       SHORT_SHA="${HEAD_SHA:0:7}"
       ```

    3. Verify the run succeeded:
       ```bash
       if [ "$CONCLUSION" != "success" ]; then
         echo "lhci CI run conclusion is '$CONCLUSION', not 'success' — falling back to D-20 procedure"
         exit 99  # Fallback signal — Task 2 will handle D-20 path
       fi
       ```

    4. Download the artifact into a SHA-namespaced subdirectory:
       ```bash
       OUT_DIR=".planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-${SHORT_SHA}"
       mkdir -p "$OUT_DIR"
       gh run download "$RUN_ID" --dir "$OUT_DIR"
       ```
       This downloads ALL artifacts of the run. The lhci artifact name is set in `.github/workflows/lighthouse.yml` (typically `lhci-{sha}` per Phase 6 D-31). After download, the structure will be:
       ```
       .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-abc123d/
         lhci-{commit-sha}/                  (or whatever artifact name was used)
           lhr-{timestamp}-{slug}.json       (5 files, one per route)
           assertion-results.json
           manifest.json
       ```
       (The exact nesting depends on artifact name — verify with `ls "$OUT_DIR"` after download.)

    5. Verify the download landed:
       ```bash
       ls "$OUT_DIR"
       find "$OUT_DIR" -name "lhr-*.json" | wc -l  # Must be 5
       ```

    6. Record the run URL for the SUMMARY.md (Task 2 uses this):
       ```bash
       RUN_URL=$(gh run view "$RUN_ID" --json url --jq '.url')
       echo "$RUN_URL" > "$OUT_DIR/RUN-URL.txt"
       ```

    **D-20 fallback path** — if step 3 returns non-success OR steps 4-5 fail (artifact missing/expired):
    1. Manually run lhci against the deployed URL using the existing config:
       ```bash
       npx lhci collect --config=.lighthouserc.cjs
       ```
       This consumes `.lighthouserc.cjs`'s 5-URL `ci.collect.url` array and produces `.lighthouseci/lhr-*.json` locally.
    2. Move outputs into a manual-{date}-namespaced directory:
       ```bash
       MANUAL_DIR=".planning/phases/07-post-deploy-qa-client-handoff/lighthouse/manual-$(date +%Y%m%d)"
       mkdir -p "$MANUAL_DIR"
       cp .lighthouseci/lhr-*.json "$MANUAL_DIR/"
       cp .lighthouseci/assertion-results.json "$MANUAL_DIR/" 2>/dev/null || true
       echo "manual fallback per D-20 — CI artifact unavailable" > "$MANUAL_DIR/FALLBACK-NOTE.txt"
       ```
    3. Use this MANUAL_DIR as the source for Task 2's SUMMARY.md generation. SUMMARY.md must explicitly note «D-20 fallback path used because {reason}».

    Exit success (step 5 verifies 5 JSON files present) OR exit with checkpoint flag if D-20 fallback also fails.
  </action>
  <verify>
    <automated>find .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/ -name "lhr-*.json" 2>/dev/null | wc -l | awk '$1 >= 5 { exit 0 } { exit 1 }'</automated>
  </verify>
  <done>
    `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/` contains a `lhci-{sha}/` subdirectory (or `manual-{date}/` fallback) with at least 5 `lhr-*.json` files; the source is documented (CI run URL stored, OR D-20 fallback note created).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Generate lighthouse/SUMMARY.md scores table + UAT-1 + UAT-5 cross-refs</name>
  <files>
    .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md
    .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv
  </files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-19 step 3 + D-05 UAT-5 closure criteria)
    - .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/ (verify Task 1's downloaded artifact exists)
    - .planning/phases/06-performance-mobile-fallback-deploy/06-HUMAN-UAT.md (UAT-1 + UAT-5 expected formats)
  </read_first>
  <action>
    Per D-19 step 3 + D-05 UAT-5 closure criteria:

    1. Locate the lhr-*.json files from Task 1:
       ```bash
       LHR_DIR=$(find .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/ -name "lhr-*.json" -exec dirname {} \; | head -1)
       echo "Using LHR_DIR=$LHR_DIR"
       ```

    2. Extract scores into `SUMMARY-raw.tsv` (intermediate file):
       ```bash
       OUT_TSV=".planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv"
       echo -e "requestedUrl\tperformance\taccessibility\tbest-practices\tseo" > "$OUT_TSV"
       for f in "$LHR_DIR"/lhr-*.json; do
         jq -r '[.requestedUrl, .categories.performance.score, .categories.accessibility.score, .categories["best-practices"].score, .categories.seo.score] | @tsv' "$f" >> "$OUT_TSV"
       done
       cat "$OUT_TSV"
       ```

    3. Verify UAT-5 hash-fragment fidelity (D-05 closure criterion):
       ```bash
       HASH_COUNT=$(jq -r '.requestedUrl' "$LHR_DIR"/lhr-*.json | grep -c "#")
       echo "Hash-fragment URLs: $HASH_COUNT / 5"
       # Must be ≥4 per D-05 (smoke-check threshold from Phase 6 D-32)
       ```

    4. Verify UAT-1 score threshold (all 4 categories ≥0.9 on all 5 routes):
       ```bash
       FAIL_COUNT=0
       for f in "$LHR_DIR"/lhr-*.json; do
         for cat in performance accessibility "best-practices" seo; do
           if [ "$cat" = "best-practices" ]; then
             SCORE=$(jq -r '.categories["best-practices"].score' "$f")
           else
             SCORE=$(jq -r ".categories.${cat}.score" "$f")
           fi
           # Compare 0.9 threshold using bc or awk
           BELOW=$(awk -v s="$SCORE" 'BEGIN { print (s < 0.9) ? 1 : 0 }')
           if [ "$BELOW" = "1" ]; then
             FAIL_COUNT=$((FAIL_COUNT + 1))
             echo "FAIL: $f category=$cat score=$SCORE"
           fi
         done
       done
       echo "Threshold violations: $FAIL_COUNT"
       ```

    5. Create `lighthouse/SUMMARY.md` (formatted markdown table from TSV + UAT cross-refs):

       ```markdown
       # Phase 7 — Lighthouse CI Archive (SC#4 + UAT-1 + UAT-5)

       **Date:** {ISO date}
       **Source:** lhci CI artifact from `.github/workflows/lighthouse.yml` run {RUN_ID}
       **Run URL:** {gh run URL}
       **Commit SHA:** {HEAD_SHA short}
       **Threshold (QA-02):** all 4 categories ≥0.9 on all 5 routes

       ## Scores per route

       | Route (requestedUrl) | Performance | Accessibility | Best Practices | SEO |
       |----------------------|-------------|---------------|----------------|-----|
       | https://{account}.github.io/vugoda-website/#/         | 0.XX | 0.XX | 0.XX | 0.XX |
       | https://{account}.github.io/vugoda-website/#/projects | 0.XX | 0.XX | 0.XX | 0.XX |
       | https://{account}.github.io/vugoda-website/#/zhk/etno-dim | 0.XX | 0.XX | 0.XX | 0.XX |
       | https://{account}.github.io/vugoda-website/#/construction-log | 0.XX | 0.XX | 0.XX | 0.XX |
       | https://{account}.github.io/vugoda-website/#/contact  | 0.XX | 0.XX | 0.XX | 0.XX |

       (Scores rendered as 0..1 per Lighthouse v12 schema; multiply by 100 for the «≥90» threshold reference. 0.90 = 90, 0.95 = 95, etc.)

       ## UAT-1 closure (Phase 6 D-01)

       UAT-1 expected: all 4 categories ≥0.9 on each of 5 routes.
       Result: {N} threshold violations / 20 total checks (5 routes × 4 cats).
       - PASS if N = 0 → UAT-1 closes via this archive.
       - FAIL if N ≥ 1 → STOP; raise as QA-02 regression; fix; redeploy; re-run lhci CI; re-run this plan.

       ## UAT-5 closure (Phase 6 D-05)

       UAT-5 expected: workflow_run chain triggered, completed successfully, smoke-check «PASS: hash-fragment URL fidelity verified.»
       - Workflow conclusion: success ({YES/NO})
       - Hash-fragment count: {N} / 5 lhr-*.json contain `#` in requestedUrl
       - Threshold (D-05): ≥4 of 5 must contain `#`
       - Result: {PASS / FAIL}

       ## Fallback note (D-20)

       {Only if D-20 fallback was used:}
       D-20 fallback path was used because {reason — CI artifact missing/expired/conclusion!=success}.
       Local lhci collect was run against deployed URL with .lighthouserc.cjs config.
       Manual artifact directory: .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/manual-{date}/

       ## Artifact files

       Full lhr-*.json files are committed under: `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{sha}/` (or `manual-{date}/` if fallback). Each JSON contains the full Lighthouse audit (~500-1500 KB per route — committed verbatim, no minification).
       ```

       Substitute the actual scores from `SUMMARY-raw.tsv` into the markdown table. Round to 2 decimal places (`printf "%.2f"`). The «{account}» placeholder resolves from the actual `requestedUrl` in the JSON.

    6. If UAT-1 threshold violations >0 OR UAT-5 hash-count <4:
       - SUMMARY.md still gets written (with FAIL outcomes recorded)
       - Plan 07-09 verification doc treats this as blocking
       - Dev must trigger /gsd:debug → fix root cause → redeploy → re-run this plan
  </action>
  <verify>
    <automated>test -f .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md && test -f .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv && grep -c "## Scores per route" .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md | grep -q "^1$" && grep -c "## UAT-1 closure" .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md | grep -q "^1$" && grep -c "## UAT-5 closure" .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md | grep -q "^1$" && wc -l < .planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv | awk '$1 >= 6 { exit 0 } { exit 1 }'</automated>
  </verify>
  <done>
    `lighthouse/SUMMARY.md` exists with the scores table + UAT-1 + UAT-5 cross-references; `SUMMARY-raw.tsv` exists with header + ≥5 data rows; threshold-violation count is computed and recorded in the SUMMARY.md (PASS or FAIL outcome documented for both UAT-1 and UAT-5).
  </done>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/lhci-{sha}/` (or `manual-{date}/` fallback) contains ≥5 `lhr-*.json` files
- `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY.md` exists with H2 «## Scores per route», «## UAT-1 closure», «## UAT-5 closure» sections
- `.planning/phases/07-post-deploy-qa-client-handoff/lighthouse/SUMMARY-raw.tsv` exists with TSV header + ≥5 data rows
- All 4 categories ≥0.9 on all 5 routes (UAT-1 closure threshold) — OR FAIL recorded as blocking for Plan 07-09
- ≥4 of 5 lhr-*.json contain `#` in requestedUrl (UAT-5 closure threshold) — OR FAIL recorded as blocking
</verification>

<success_criteria>
- Phase 7 SC#4 scores half closure: lhci scores archived per route + 4 categories
- Phase 6 UAT-1 closure (per D-01) — all 4 categories ≥0.9 on 5 routes
- Phase 6 UAT-5 closure (per D-05) — workflow_run chain validated, hash-fragment fidelity ≥4/5
- Plan 07-09 can cite `lighthouse/SUMMARY.md` as SC#4 + UAT-1 + UAT-5 closure pointer
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-07-SUMMARY.md`.
</output>
