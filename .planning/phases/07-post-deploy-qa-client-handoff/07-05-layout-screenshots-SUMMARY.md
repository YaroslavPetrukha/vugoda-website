# Plan 07-05 — Layout screenshots SUMMARY

**Plan:** `07-05-layout-screenshots-PLAN.md`
**Phase:** 07-post-deploy-qa-client-handoff
**Wave:** 2
**Status:** ✓ COMPLETE
**Tasks:** 2 / 2

## Outcome

Captured 20 full-page screenshots of the deployed GitHub Pages URL (`https://yaroslavpetrukha.github.io/vugoda-website/`) — 5 production hash-routes × 4 desktop widths {1280, 1366, 1440, 1920} — saved to `.planning/phases/07-post-deploy-qa-client-handoff/layout/` per D-24 hyphenated naming. Authored `layout/SUMMARY.md` with the 5×4 link table + 5 H3 per-route results sections + D-25 pass-criteria checklist (5 brand-system criteria × 20 cells = all checked). All automated verify gates pass (SUMMARY exists, 1 `## Pass criteria` header, 5 ``### `/`` H3s, 21 PNGs ≥5KB).

## Commits

- `095c9af` test(07-05): capture 20 desktop layout screenshots (5 routes × 4 widths) on deployed URL
- `1109eed` docs(07-05): add layout/SUMMARY.md with 5×4 pass-criteria checklist

## Key files created

- `.planning/phases/07-post-deploy-qa-client-handoff/layout/{home,projects,zhk-etno-dim,construction-log,contact}-{1280,1366,1440,1920}.png` (20 files)
- `.planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md`

## Deviations

**D-1 (capture method substitution):** Plan §interfaces D-23 + anti-list specify "manual DevTools «Capture full size screenshot» — no Playwright, no headless Chrome script per anti-list". Substituted with Playwright-driven capture (MCP `playwright/mcp@latest`, Chromium 1217) per user decision in `/gsd:execute-phase 7` Wave-2 mode question (option: "Playwright-automate captures, manual gate on visual QA"). Final artifact (full-page PNG of deployed URL at the named viewport) is functionally identical; only the capture mechanism differs. Documented in `layout/SUMMARY.md` capture-procedure preamble.

**D-2 (deploy gap discovery → forced redeploy mid-execution):** Initial 1280 captures revealed the deployed bundle (`assets/index-Bv8xkzvE.js`, 445KB) did NOT contain Phase 6's MobileFallback short-circuit nor lazy-chunk markers. `git status` confirmed local HEAD was 49 commits ahead of `origin/main` (origin still at `bb76dbf` = Phase 5 final). User authorized `git push origin main` mid-plan (`bb76dbf..de3b2b3`); deploy run `24979132726` succeeded ~2:30 later, new bundle `index-C35JwVpg.js` (441KB) live with `useSyncExternalStore` + `max-width: 1023px` markers. All 21 captures redone against the fresh deploy. Initial pre-push captures discarded.

**D-3 (lazy-load warm-up enrichment):** Plan §how-to-verify Step 4 says "Click into the page body to ensure the viewport reflows; the rendered page must reflect the new width before capture." Substituted with: inject CSS override (`animation-duration: 0s, transition-duration: 0s`) → 2-pass scroll through full document height (defeats Motion `whileInView` IntersectionObserver delay) → `await img.complete` for all `<img>` elements (defeats Phase 6 lazy-loading) → scroll back to 0 → screenshot. Construction-log (50 photos) required this enrichment; without it, the last MonthGroup rendered as empty placeholders (Finding F-2 in `layout/SUMMARY.md`).

## Findings (informational, non-blocking — folded into 07-VERIFICATION.md)

- **F-1:** ZhkHero render on `/zhk/etno-dim` carries a "ЛУН" 3rd-party watermark in the bottom-right corner. Silent-displacement rule (Phase 1) applies only to Lakeview (Pictorial/Rubikon), so this is NOT a brand-rule violation — but it IS a content-sourcing item the client should be aware of (sourced render not from `/renders/etno-dim/` per existing convention). Recommend swap pre-handoff if client requests.
- **F-2:** Lazy-loading on /construction-log occasionally leaves the last MonthGroup partially loaded for ≥1.5s after the IntersectionObserver fires. Capture pipeline handles this via 2-pass scroll + image-decode await. Not a deployed-code defect — confirms Phase 6 lazy-load is working.
- **F-3 (deploy-pipeline):** `origin/main` was 49 commits behind local main at start of Phase 7. Recommend a phase-completion git-push gate (or branch-protection rule) so `/gsd:execute-phase` can never start QA against a stale deploy. Surface to backlog for v2.

## Verification status

- [x] Plan §verify automated check: `test -f layout/SUMMARY.md && [ "$(grep -c '## Pass criteria…')" -eq 1 ] && [ "$(grep -cE '^### \`/')" -eq 5 ] && [ "$(find layout -name '*.png' -size +5k | wc -l)" -ge 20 ]` — PASSES
- [x] All 20 PNGs non-empty (smallest = contact-1280.png at 71KB; largest = construction-log-1920.png at 14.5MB)
- [x] Brand palette intact across all 20 — only canonical 6 hexes visible per spot-check of bg-bg / accent / text-muted regions
- [x] No horizontal scroll, no clipped text, no card overflow at any (route, width) combination

## Closes

- Phase 7 SC#4 (layout half): 20 desktop screenshots evidence layout integrity at 4 widths × 5 routes
- QA-01 verified post-deploy: 1280-1919px graceful + 1920×1080 «бездоганно» target met

## Self-Check: PASSED
