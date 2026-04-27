---
phase: 07-post-deploy-qa-client-handoff
plan: 06
type: execute
wave: 2
depends_on: ["07-05-layout-screenshots"]
files_modified:
  - .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png
autonomous: false
requirements_addressed: [QA-03]

must_haves:
  truths:
    - "1 PNG screenshot of MobileFallback rendered at 375×844 (iPhone 14 viewport) on the deployed URL"
    - "Screenshot shows: Logo + wordmark + body copy + mailto link + 4 CTA links + juridical block (no Nav, no Footer)"
    - "File saved as mobile-375.png inside .planning/phases/07-post-deploy-qa-client-handoff/layout/ directory"
  artifacts:
    - path: ".planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png"
      provides: "Single mobile-fallback screenshot at iPhone 14 viewport (375×844) — closes UAT-2"
  key_links:
    - from: "mobile-375.png"
      to: "deployed URL on iPhone-emulated viewport"
      via: "Chrome DevTools device emulation OR real iPhone Safari"
      pattern: "375"
---

<objective>
Capture 1 full-size DevTools screenshot of `<MobileFallback>` at 375×844 (iPhone 14) on the deployed URL. Verifies QA-01 mobile-fallback render + closes Phase 6 UAT-2 (D-02 absorption pairing).

Purpose: Closes Phase 7 SC#4 mobile half (verbatim: «mobile fallback rendered correctly at <1024px (verified on real iPhone viewport or DevTools device emulation, not just CSS media query)»). Phase 6 D-04 made the fallback a single static screen by design — one shot proves it renders. NO comparison grid across multiple mobile widths per D-22.
Output: `.planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png`.
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

<interfaces>
<!-- MobileFallback (Phase 6 Plan 06-04, src/components/layout/MobileFallback.tsx): -->
<!--   Renders ONLY when viewport < 1024px (Layout.tsx short-circuit). -->
<!--   Single-screen content (Phase 6 D-04): -->
<!--     Logo (brand-assets/logo/dark.svg) -->
<!--     wordmark «ВИГОДА» -->
<!--     body copy «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть: vygoda.sales@gmail.com» -->
<!--     mailto:vygoda.sales@gmail.com (active) -->
<!--     4 CTA-лінки stacked: Lakeview / Etno Dim / Maetok / NTEREST (or similar — verify against src/content/mobile-fallback.ts) -->
<!--     juridical block (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / ліцензія 27.12.2019) -->
<!--   No Nav. No Footer. Single-column. -->

<!-- iPhone 14 viewport: 375×844 (Chrome DevTools device dropdown preset) -->
<!-- Naming convention (D-24 lock): mobile-375.png -->
</interfaces>
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 1: Capture 1 mobile-fallback screenshot at 375×844 (iPhone 14)</name>
  <what-built>
    Phase 6 ships MobileFallback.tsx + Layout.tsx short-circuit at <1024px. Phase 7 captures evidence on deployed URL — closes UAT-2.
  </what-built>
  <how-to-verify>
    Per D-22 (one mobile screenshot at 375px) + D-23 capture procedure:

    **Setup:**
    1. Confirm `.planning/phases/07-post-deploy-qa-client-handoff/layout/` directory exists (Plan 07-05 created it).
    2. Open deployed URL in Chrome: `https://{account}.github.io/vugoda-website/` (Phase 6 D-37 outcome — likely yaroslavpetrukha).
    3. Open DevTools: Cmd+Opt+I.
    4. Toggle Device Toolbar: Cmd+Shift+M.

    **Capture procedure:**
    1. From the device dropdown at the top of the device toolbar, select «iPhone 14» (DevTools preset; sets 375×844 + DPR 3 + iOS user-agent).
       - If iPhone 14 not in your DevTools build, manually set: 375 width × 844 height in Responsive mode.
    2. Reload the page (Cmd+R) — this triggers `useMatchMedia` (Phase 6 hook from Plan 06-01) to re-evaluate, and Layout.tsx short-circuits to MobileFallback.
    3. Verify visually that MobileFallback renders (NOT the desktop layout). Expected elements:
       - Logo + wordmark «ВИГОДА» at top
       - Body copy «Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть: vygoda.sales@gmail.com»
       - Active mailto:vygoda.sales@gmail.com link
       - 4 stacked CTA-links (Lakeview external + Etno Dim + Maetok + NTEREST anchors — exact set per src/content/mobile-fallback.ts)
       - Juridical block at bottom (ТОВ «БК ВИГОДА ГРУП» / ЄДРПОУ 42016395 / Ліцензія від 27.12.2019)
       - NO Nav (top of page should be the Logo, not nav bar)
       - NO Footer (bottom should be the juridical block, not the standard footer)
    4. Open DevTools command palette: Cmd+Shift+P → «Capture full size screenshot» → Enter.
    5. Browser downloads PNG to ~/Downloads.
    6. Rename to `mobile-375.png`.
    7. Move to `.planning/phases/07-post-deploy-qa-client-handoff/layout/`.

    **Alternative — real iPhone (D-22 acceptable):**
    1. On a real iPhone, open Safari → navigate to deployed URL.
    2. Take a screenshot (volume-up + side button on iPhone 14+).
    3. AirDrop or email the screenshot to the dev's Mac.
    4. Rename to `mobile-375.png`.
    5. Move to `.planning/phases/07-post-deploy-qa-client-handoff/layout/`.

    Either path is acceptable per D-22 («DevTools device emulation OR real iPhone (developer's choice; both acceptable as SC#4 evidence)»).

    **Verification of the captured image (visual, against Phase 6 D-04 + UAT-2 expected content):**
    - [ ] Logo visible at top (dark variant on `#2F3640` or `#3D3B43` bg)
    - [ ] Wordmark «ВИГОДА» visible
    - [ ] Body copy text fully readable (≥14pt) and contains «Сайт оптимізовано для екранів ≥1280px»
    - [ ] mailto link visible and styled distinctly (e.g., underline or brand-accent color)
    - [ ] 4 CTA links stacked vertically (one per row, not horizontally crammed)
    - [ ] Juridical block visible at bottom (ЄДРПОУ 42016395, ліцензія 27.12.2019 readable)
    - [ ] NO desktop Nav at top (verifies short-circuit fired)
    - [ ] NO desktop Footer at bottom (verifies short-circuit fired)
    - [ ] No horizontal scroll on the 375-wide viewport
    - [ ] Brand colors hold (dark `#2F3640` bg, accent `#C1F33D` on CTAs)

    If any expected element is missing OR the desktop layout renders instead of MobileFallback:
    - This is a regression of Phase 6 QA-01. STOP Phase 7 and trigger /gsd:debug.
    - Likely root causes: useMatchMedia hook regression, Layout.tsx short-circuit logic broken, or the 1024px breakpoint mistakenly raised/lowered.

    **Time estimate:** ~5 min (1 screenshot, simple capture).

    **Stub fallback:** if autonomous executor cannot perform manual capture, create an empty placeholder:
    ```bash
    touch .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png
    ```
    Plan 07-09 will note «mobile-375.png is zero-byte stub — dev must capture» as blocking. The verify command below uses a >5KB size predicate to distinguish real screenshots from stubs (a real PNG is typically 50-500KB; 5KB+ catches non-empty PNGs and excludes 1×1 pixel placeholders).
  </how-to-verify>
  <resume-signal>
    Type "approved" once mobile-375.png exists in layout/ directory and visual inspection confirms all expected MobileFallback elements are visible, no desktop Nav/Footer leaks, and no horizontal scroll.
  </resume-signal>
  <verify>
    <automated>[ -f .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png ] && [ "$(stat -f%z .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png 2>/dev/null || stat -c%s .planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png)" -gt 5120 ]</automated>
  </verify>
</task>

</tasks>

<verification>
- `.planning/phases/07-post-deploy-qa-client-handoff/layout/mobile-375.png` exists AND is >5KB (`stat -f%z` returns > 5120; ideal: > 50KB for a real screenshot — the >5KB threshold rejects zero-byte stubs and 1×1 pixel placeholders)
- Combined with Plan 07-05's 20 PNGs, the layout/ directory now contains exactly 21 PNGs total (D-22 lock)
- Visual inspection (manual): screenshot shows MobileFallback with all expected elements (Logo, wordmark, body copy, mailto, 4 CTAs, juridical block) and NO desktop Nav/Footer
</verification>

<success_criteria>
- Phase 7 SC#4 mobile half closure: 1 PNG evidences MobileFallback renders correctly at 375×844 on deployed URL
- Phase 6 UAT-2 closure (per D-02 absorption pairing)
- Layout/ directory total = 21 PNGs (matches D-22 «20 desktop + 1 mobile = 21 total» lock)
- Plan 07-09 can cite mobile-375.png alongside layout/SUMMARY.md as SC#4 evidence
</success_criteria>

<output>
After completion, create `.planning/phases/07-post-deploy-qa-client-handoff/07-06-SUMMARY.md`.
</output>
</content>
