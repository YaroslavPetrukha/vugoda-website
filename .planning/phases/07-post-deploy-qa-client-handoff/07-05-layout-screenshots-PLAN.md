---
phase: 07-post-deploy-qa-client-handoff
plan: 05
type: execute
wave: 2
depends_on: ["07-04-hard-refresh-test"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/home-1280.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/home-1366.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/home-1440.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/home-1920.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/projects-1280.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/projects-1366.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/projects-1440.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/projects-1920.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/zhk-etno-dim-1280.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/zhk-etno-dim-1366.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/zhk-etno-dim-1440.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/zhk-etno-dim-1920.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/construction-log-1280.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/construction-log-1366.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/construction-log-1440.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/construction-log-1920.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/contact-1280.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/contact-1366.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/contact-1440.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/contact-1920.png
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md
autonomous: false
requirements_addressed: [QA-01]

must_haves:
  truths:
    - "20 PNG screenshots committed: 5 production routes × 4 desktop widths (1280, 1366, 1440, 1920)"
    - "Each PNG is a full-size screenshot from Chrome DevTools at the named viewport, of the deployed URL (NOT localhost)"
    - "Naming convention is hyphenated slug + dash + width: home-1280.png, projects-1366.png, etc. per D-24"
    - "layout/SUMMARY.md aggregates a 5×4 pass-criteria checklist per route×width with brand-system §3-7 verification"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md"
      provides: "Layout pass-criteria checklist per route at 4 widths (no horizontal scroll, brand colors hold, hero hierarchy, cards don't overflow, no clipped text)"
      min_lines: 30
  key_links:
    - from: "layout/SUMMARY.md"
      to: "20 PNGs in same directory"
      via: "markdown image references OR row-by-row table"
      pattern: "\\.png"
    - from: "layout/SUMMARY.md"
      to: "brand-system.md §3-7"
      via: "human-eye verification per criterion"
      pattern: "brand"
---

<objective>
Capture 20 manual full-size DevTools screenshots of the deployed URL: 5 production routes (`/`, `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact`) × 4 desktop widths (1280, 1366, 1440, 1920). Save to `.planning/phases/07-post-deploy-qa-client-handoff/layout/` with hyphenated naming. Verify each screenshot against brand-system §3-7 layout pass criteria in `layout/SUMMARY.md`.

Purpose: Closes Phase 7 SC#4 layout part (verbatim: «tested at 1280 / 1366 / 1440 / 1920 widths for layout verification»). Verifies QA-01 («1280-1919px graceful, 1920×1080 бездоганно») post-deploy. NO new infra — manual DevTools resize per D-22 + D-23 (no Playwright, no headless Chrome script per anti-list).
Output: 20 PNGs + `layout/SUMMARY.md`. Mobile screenshot is a separate plan (07-06).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md
@brand-system.md

<interfaces>
<!-- DevTools full-size screenshot procedure (D-23 verbatim): -->
<!--   1. Open deployed URL in Chrome -->
<!--   2. DevTools (Cmd+Opt+I) → Toggle Device Toolbar (Cmd+Shift+M) → Responsive mode -->
<!--   3. Set viewport to {width}×{height} -->
<!--   4. DevTools "..." menu (top-right of device toolbar) → Capture full size screenshot -->
<!--      (Note: the modern DevTools also exposes this via Cmd+Shift+P → "Capture full size screenshot") -->
<!--   5. Browser downloads the PNG; rename to {route-slug}-{width}.png -->
<!--   6. Move to .planning/phases/07-post-deploy-qa-client-handoff/layout/ -->

<!-- Slug convention (D-24 lock): -->
<!--   home, projects, zhk-etno-dim, construction-log, contact, mobile -->
<!--   Hyphenated, no special chars, matches existing audit-*.png naming in repo root -->

<!-- Width × height pairs per D-23: -->
<!--   1280×800   (small laptop) -->
<!--   1366×800   (most common 14" laptop) -->
<!--   1440×900   (15" MacBook Air retail spec) -->
<!--   1920×1080  (1080p desktop, brand "бездоганно" target) -->

<!-- Brand-system layout criteria (D-25): -->
<!--   §3 palette — only 6 brand hexes visible, no Tailwind defaults bleeding through -->
<!--   §6 :focus-visible (2px #C1F33D, not relevant for static screenshot but section ref) -->
<!--   §7 spacing/grid hierarchy intact -->
<!-- Specific pass criteria per route×width: -->
<!--   1. No horizontal scroll (body width ≤ viewport width) -->
<!--   2. Brand colors hold (no blue Tailwind defaults, no off-palette grays) -->
<!--   3. Hero/section hierarchy intact (h1 stands out, h2 < h1) -->
<!--   4. Cards in grid don't overflow (3-col PipelineGrid, 4-col StageFilter) -->
<!--   5. No clipped text (titles, paragraphs fully visible at width) -->
</interfaces>
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 1: Capture 20 DevTools screenshots (5 routes × 4 widths) on deployed URL</name>
  <what-built>
    Phase 6 ships responsive desktop layout (1280-1920) per QA-01. Phase 7 captures evidence at the 4 standard desktop widths.
  </what-built>
  <how-to-verify>
    Per D-22 (21 PNGs total, 20 desktop in this plan + 1 mobile in Plan 07-06) + D-23 (capture procedure) + D-24 (slug convention):

    **Setup (one-time):**
    1. `mkdir -p .planning/phases/07-post-deploy-qa-client-handoff/layout`
    2. Open deployed URL in Chrome: `https://{account}.github.io/vugoda-website/` (use Phase 6 D-37 outcome — likely yaroslavpetrukha).
    3. Open DevTools: Cmd+Opt+I.
    4. Toggle Device Toolbar: Cmd+Shift+M (the device toolbar appears at the top of the viewport).
    5. From the device-toolbar dropdown, select «Responsive» (the default).

    **Per-screenshot procedure (repeat 20 times):**

    For each (route, width) combination from this matrix:

    ```
    Routes:    /   /#/projects   /#/zhk/etno-dim   /#/construction-log   /#/contact
    Widths:    1280   1366   1440   1920
    ```

    Steps:
    1. Navigate (via address bar OR clicking nav) to the target route.
    2. Wait for the page to fully render (lazy chunks loaded; below-fold images can stay lazy — full-size screenshot captures them).
    3. In DevTools device toolbar, set the dimensions to {width}×{height}:
       - 1280×800
       - 1366×800
       - 1440×900
       - 1920×1080
    4. (Important) Click into the page body to ensure the viewport reflows; the rendered page must reflect the new width before capture.
    5. Open DevTools command palette: Cmd+Shift+P.
    6. Type: «Capture full size screenshot» → press Enter.
       - DevTools will scroll the page and stitch a full-height PNG.
       - Browser downloads it as e.g. `localhost.png` or `{account}.github.io_vugoda-website.png` to ~/Downloads.
    7. Rename the downloaded PNG to `{slug}-{width}.png` per D-24 lock:
       - `/` → `home-{width}.png`
       - `/#/projects` → `projects-{width}.png`
       - `/#/zhk/etno-dim` → `zhk-etno-dim-{width}.png`
       - `/#/construction-log` → `construction-log-{width}.png`
       - `/#/contact` → `contact-{width}.png`
    8. Move to `.planning/phases/07-post-deploy-qa-client-handoff/layout/`.
    9. Repeat for next (route, width) pair.

    **Total: 20 PNGs.** File names exhaustively (per frontmatter):
    ```
    home-1280.png
    home-1366.png
    home-1440.png
    home-1920.png
    projects-1280.png
    projects-1366.png
    projects-1440.png
    projects-1920.png
    zhk-etno-dim-1280.png
    zhk-etno-dim-1366.png
    zhk-etno-dim-1440.png
    zhk-etno-dim-1920.png
    construction-log-1280.png
    construction-log-1366.png
    construction-log-1440.png
    construction-log-1920.png
    contact-1280.png
    contact-1366.png
    contact-1440.png
    contact-1920.png
    ```

    **Time estimate (D-23):** ~30 min one-pass for all 20 (1.5 min per screenshot including rename + move).

    **Verify counts before moving on:**
    ```bash
    ls .planning/phases/07-post-deploy-qa-client-handoff/layout/*.png | wc -l
    # Must return: 20  (Plan 07-06 will add the 21st: mobile-375.png)
    ```

    **D-26 reminder — DO NOT touch repo-root `audit-*.png` files:** these are unrelated prior-audit artifacts (gitignored, not committed). Keep them on disk for the dev's local diff baseline; do NOT commit them; do NOT delete them.

    **Stub fallback:** if autonomous executor cannot perform manual capture (no UI access), create EMPTY placeholder files for each filename:
    ```bash
    for slug in home projects zhk-etno-dim construction-log contact; do
      for w in 1280 1366 1440 1920; do
        touch ".planning/phases/07-post-deploy-qa-client-handoff/layout/${slug}-${w}.png"
      done
    done
    ```
    This satisfies the file-existence verification for downstream Plan 07-09 to detect (zero-byte PNGs are obviously TODO). Plan 07-09 will add «layout PNGs are zero-byte stubs — dev must capture before handoff» to the verification doc.
  </how-to-verify>
  <resume-signal>
    Type "approved" once all 20 PNGs exist with correct filenames in the layout/ directory and are non-empty (real screenshot data, not stubs).
  </resume-signal>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Author layout/SUMMARY.md with 5×4 pass-criteria checklist per route×width</name>
  <files>.planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md</files>
  <read_first>
    - .planning/phases/07-post-deploy-qa-client-handoff/07-CONTEXT.md (D-25 pass criteria)
    - brand-system.md (§3 palette + §6 focus-visible + §7 spacing reference)
    - .planning/phases/07-post-deploy-qa-client-handoff/layout/ (verify 20 PNGs from Task 1 exist)
  </read_first>
  <action>
    Per D-25 (pass criteria documented as a markdown checklist) + planner discretion («markdown checklist is recommended, machine-readable for future runs»).

    Create `.planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md` with this structure. **CRITICAL:** Each per-route H3 header MUST start with `` ### `/`` (backtick + forward-slash) so the verify regex `^### \`/` counts exactly 5 (one per production route). Do NOT add any other H3 markers starting with `` ### `/`` elsewhere in the file (free-text H3s like «### Cache-bust note» are fine — the regex anchors specifically on backtick+slash).

    ```markdown
    # Phase 7 — Layout Verification (SC#4 layout)

    **Date:** {ISO date}
    **Tester:** {name}
    **Browser:** Chrome {version} (DevTools device toolbar, Responsive mode)
    **Deployed URL base:** https://{account}.github.io/vugoda-website/
    **Capture procedure:** D-23 (DevTools «Capture full size screenshot» command)

    ## Screenshots captured

    | Route | 1280 | 1366 | 1440 | 1920 |
    |-------|------|------|------|------|
    | / | [home-1280.png](./home-1280.png) | [home-1366.png](./home-1366.png) | [home-1440.png](./home-1440.png) | [home-1920.png](./home-1920.png) |
    | /projects | [projects-1280.png](./projects-1280.png) | [projects-1366.png](./projects-1366.png) | [projects-1440.png](./projects-1440.png) | [projects-1920.png](./projects-1920.png) |
    | /zhk/etno-dim | [zhk-etno-dim-1280.png](./zhk-etno-dim-1280.png) | [zhk-etno-dim-1366.png](./zhk-etno-dim-1366.png) | [zhk-etno-dim-1440.png](./zhk-etno-dim-1440.png) | [zhk-etno-dim-1920.png](./zhk-etno-dim-1920.png) |
    | /construction-log | [construction-log-1280.png](./construction-log-1280.png) | [construction-log-1366.png](./construction-log-1366.png) | [construction-log-1440.png](./construction-log-1440.png) | [construction-log-1920.png](./construction-log-1920.png) |
    | /contact | [contact-1280.png](./contact-1280.png) | [contact-1366.png](./contact-1366.png) | [contact-1440.png](./contact-1440.png) | [contact-1920.png](./contact-1920.png) |

    ## Pass criteria per route×width (D-25)

    For each (route, width) combination, verify against `brand-system.md` §3 (palette) + §6 (focus-visible) + §7 (spacing/grid):

    - [ ] **No horizontal scroll** (body width ≤ viewport width; no `overflow-x: scroll` triggered)
    - [ ] **Brand colors hold** (only the 6 canonical hexes visible: `#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A` — no blue/purple/orange Tailwind defaults bleeding through, no off-palette grays)
    - [ ] **Hero/section hierarchy intact** (h1 visually dominant, h2 < h1, body copy readable)
    - [ ] **Cards in grid don't overflow** (PipelineGrid 3-col stays 3-col at ≥1280, StageFilter 4-chip stays 4-chip)
    - [ ] **No clipped text** (titles fit on intended lines, paragraphs not truncated mid-word, footer text fully visible)

    ## Per-route results

    ### `/` (home)
    - **1280:** [ ] All 5 criteria pass
    - **1366:** [ ] All 5 criteria pass
    - **1440:** [ ] All 5 criteria pass
    - **1920:** [ ] All 5 criteria pass («бездоганно» target — should be the cleanest of the four)
    - Notes: …

    ### `/projects`
    - **1280:** [ ] All 5 criteria pass
    - **1366:** [ ] All 5 criteria pass
    - **1440:** [ ] All 5 criteria pass
    - **1920:** [ ] All 5 criteria pass
    - Notes: …

    ### `/zhk/etno-dim`
    - **1280:** [ ] All 5 criteria pass
    - **1366:** [ ] All 5 criteria pass
    - **1440:** [ ] All 5 criteria pass
    - **1920:** [ ] All 5 criteria pass
    - Notes: …

    ### `/construction-log`
    - **1280:** [ ] All 5 criteria pass
    - **1366:** [ ] All 5 criteria pass
    - **1440:** [ ] All 5 criteria pass
    - **1920:** [ ] All 5 criteria pass (verify 4 MonthGroup blocks render correctly + lazy chunk fully loaded by capture time)
    - Notes: …

    ### `/contact`
    - **1280:** [ ] All 5 criteria pass
    - **1366:** [ ] All 5 criteria pass
    - **1440:** [ ] All 5 criteria pass
    - **1920:** [ ] All 5 criteria pass
    - Notes: …

    ## Outcome

    Total: 20 (route, width) checks
    Passed: …
    Failed: …

    **Failure handling:** if any (route, width) fails, /gsd:debug → re-deploy → re-shoot affected PNGs. Phase 7 verification doc (Plan 07-09) treats unfilled checkboxes as blocking.
    ```

    The dev fills the checkboxes by visual inspection of each PNG. If autonomous executor created stub PNGs in Task 1, leave all checkboxes unchecked — Plan 07-09 will note pending.

    Self-consistency pre-screen:
    - File mentions 6 canonical hexes — these are exact and EXIST in `src/index.css @theme` block. Listing them here is a documentation reference, not a script test, so check-brand `paletteWhitelist()` (which scans `src/`) is unaffected.
    - No `Pictorial`/`Rubikon` literals.
    - No `{{token}}` literals.
    - Each per-route H3 header begins with `` ### `/`` (backtick + slash) — required by verify regex.
  </action>
  <verify>
    <automated>test -f .planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md && [ "$(grep -c '## Pass criteria per route×width' .planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md)" -eq 1 ] && [ "$(grep -cE '^### `/' .planning/phases/07-post-deploy-qa-client-handoff/layout/SUMMARY.md)" -eq 5 ] && [ "$(find .planning/phases/07-post-deploy-qa-client-handoff/layout -maxdepth 1 -name '*.png' -size +5k | wc -l | tr -d ' ')" -ge 20 ]</automated>
  </verify>
  <done>
    layout/SUMMARY.md exists with 5 H3 per-route sections (one per production route, each starting with backtick+slash), each with 4 width entries (1280/1366/1440/1920); pass-criteria checklist enumerates all 5 D-25 criteria; the screenshots-captured table links all 20 PNGs; the layout/ directory contains at least 20 non-trivial PNG files (size >5KB each — excludes zero-byte stubs).
  </done>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/layout/` directory exists
- 20 PNG files exist with names matching the route×width matrix (frontmatter files_modified is exhaustive)
- `layout/SUMMARY.md` exists with the 5-row × 4-column screenshot-link table + 5 H3 per-route results sections (each H3 starts with `` ### `/``) + pass-criteria checklist
- Each PNG is non-empty (`stat -f%z` returns > 5KB; ideal: > 50KB for a real screenshot, OR documented as stub if autonomous creator and ≤5KB caught by verify size predicate)
- Plan 07-09 can cite `layout/SUMMARY.md` as SC#4 layout closure pointer
</verification>

<success_criteria>
- Phase 7 SC#4 (layout half) closure: 20 desktop screenshots evidence layout integrity at 4 widths × 5 routes
- QA-01 verified post-deploy: 1280-1919 graceful + 1920×1080 «бездоганно»
- Plan 07-09 has the layout/SUMMARY.md to link as SC#4 evidence
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-05-SUMMARY.md`.
</output>
</content>
