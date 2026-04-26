---
phase: 5
slug: animations-polish
status: ready
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-26
revised: 2026-04-26
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `05-RESEARCH.md` § Validation Architecture (lines 483-535).
>
> **Note on `wave_0_complete`:** flips to `true` only when Wave 0 (the file-creation tasks in Plans 05-01, 05-03, 05-07) actually completes during execution. At plan-time it stays `false`; the executor flips it on Wave 1+2 completion.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None at unit-test level (per STACK.md «SKIP Vitest for MVP»). Validation = grep gates + manual visual + build script. |
| **Config file** | None |
| **Quick run command** | `npm run lint && npx tsx scripts/check-brand.ts` |
| **Full suite command** | `npm run build` (runs prebuild + lint + vite build + postbuild check-brand) |
| **Estimated runtime** | Quick ~5s · Full ~30s |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npx tsx scripts/check-brand.ts`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green AND manual SC#3/SC#4/SC#5 visual confirmations done
- **Max feedback latency:** 5 seconds (quick) · 30 seconds (full)

---

## Per-Task Verification Map

> Plan IDs match the post-revision Phase 5 plan structure (8 → 9 plans after the 05-05 split):
>   05-01 foundation-sot · 05-02 hover-card-utility · 05-03 reveal-on-scroll-component ·
>   05-04 reveal-home-page · 05-05a reveal-zhk-page · 05-05b reveal-other-routes ·
>   05-06 animate-presence-layout · 05-07 hero-session-skip · 05-08 no-inline-transition-check
>
> Each row maps a Phase 5 invariant to its automated grep gate or manual gate, with the plan that owns the file the gate asserts against.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-T1 | 05-01 | 1 | ANI-02 / SC#1 | grep | `! grep -rn 'transition={{' src/` (exit 1 = pass) | ✅ Wave 0 | ⬜ pending |
| 05-01-T1 | 05-01 | 1 | ANI-02 / SC#1 | grep | `grep -nE '^export const (easeBrand\|durations\|fadeUp\|fade\|stagger\|pageFade\|parallaxRange) ' src/lib/motionVariants.ts \| wc -l` ≥ 7 | ✅ Wave 0 | ⬜ pending |
| 05-01-T2 | 05-01 | 1 | ANI-02 / SC#1 | grep | `grep -n -- '--ease-brand:' src/index.css` (1 match) | ✅ Wave 0 | ⬜ pending |
| 05-02-T1 | 05-02 | 2 | SC#1 / D-24 | grep | `grep -nE '@utility hover-card' src/index.css` (1 match) | ✅ Wave 0 | ⬜ pending |
| 05-02-T2 | 05-02 | 2 | SC#1 / D-24 | grep | `grep -rn 'hover-card' src/components/ \| wc -l` ≥ 5 (5 surfaces consume) | ✅ Wave 0 | ⬜ pending |
| 05-02-T1 | 05-02 | 2 | ANI-04 / SC#4 | grep | `grep -nE '@media \(prefers-reduced-motion' src/index.css` ≥ 1 | ✅ Wave 0 | ⬜ pending |
| 05-03-T1 | 05-03 | 2 | ANI-02 / SC#2 | grep | `grep -nE 'whileInView=' src/components/ui/RevealOnScroll.tsx && grep -n 'margin:.*-50px' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-03-T1 | 05-03 | 2 | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-04-T* | 05-04 | 3 | ANI-02 / SC#2 | grep | `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` (Hero excluded — D-06) | ✅ Wave 0 | ⬜ pending |
| 05-04-T1 | 05-04 | 3 | ANI-02 / SC#2 + D-02 | grep | `grep -nc '<RevealOnScroll' src/components/sections/home/BrandEssence.tsx` = 2 (section + 4-card stagger per D-02) | ✅ Wave 0 | ⬜ pending |
| 05-04-T2 | 05-04 | 3 | ANI-02 / SC#2 + D-02 | grep | `grep -nc '<RevealOnScroll' src/components/sections/home/PortfolioOverview.tsx` = 2 (section + 3-card stagger) | ✅ Wave 0 | ⬜ pending |
| 05-04-T3 | 05-04 | 3 | ANI-02 / SC#2 + D-03 | grep | `grep -nc '<RevealOnScroll' src/components/sections/home/TrustBlock.tsx` = 2 (section + 3-col stagger per D-03) | ✅ Wave 0 | ⬜ pending |
| 05-04-T3 | 05-04 | 3 | ANI-02 / SC#2 + D-08 | grep | `grep -nc '<RevealOnScroll' src/components/sections/home/MethodologyTeaser.tsx` = 2 (section + 3-block stagger) | ✅ Wave 0 | ⬜ pending |
| 05-05a-T1 | 05-05a | 3 | ANI-02 / SC#2 + D-09 | grep | `grep -n 'variant={fade}' src/components/sections/zhk/ZhkHero.tsx` ≥ 1 (LCP-safe override — D-09) | ✅ Wave 0 | ⬜ pending |
| 05-05a-T2 | 05-05a | 3 | ANI-02 / SC#2 + D-05 | grep | `grep -nc '<RevealOnScroll' src/components/sections/zhk/ZhkGallery.tsx` = 2 (section + ul-stagger) AND `grep -n '<motion.li' ZhkGallery.tsx` ≥ 1 AND `grep -n '<motion.button' ZhkGallery.tsx` = 0 | ✅ Wave 0 | ⬜ pending |
| 05-05b-T1 | 05-05b | 3 | ANI-02 / SC#2 + D-04 | grep | `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` = 1 (per-MonthGroup, NOT per-photo) | ✅ Wave 0 | ⬜ pending |
| 05-05b-T2 | 05-05b | 3 | ANI-02 / SC#2 + D-08 | grep | `grep -n 'staggerChildren' src/components/sections/projects/StageFilter.tsx` = 1 (chip-row stagger per D-08 Specifics) | ✅ Wave 0 | ⬜ pending |
| 05-05b-T2 | 05-05b | 3 | ANI-02 / SC#2 + D-08 | grep | `grep -n 'staggerChildren' src/components/sections/projects/PipelineGrid.tsx` = 1 (card-grid stagger per D-08) | ✅ Wave 0 | ⬜ pending |
| 05-05b-T3 | 05-05b | 3 | ANI-02 / SC#2 + D-08 | grep | `grep -nc '<RevealOnScroll' src/pages/ContactPage.tsx` = 3 (header + details + CTA per D-08 verbatim) | ✅ Wave 0 | ⬜ pending |
| Aggregate | 05-04+05-05a+05-05b | 3 | ANI-02 / SC#2 | grep | `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ \| wc -l` ≥ 18 (D-08 coverage map) | ✅ Wave 0 | ⬜ pending |
| Stagger evidence | 05-04+05-05a+05-05b | 3 | ANI-02 / SC#2 + D-02 | grep | `grep -rnE 'staggerChildren' src/` ≥ 6 (BrandEssence + PortfolioOverview + MethodologyTeaser + TrustBlock + ZhkGallery + StageFilter + PipelineGrid — at least 6 of 7) | ✅ Wave 0 | ⬜ pending |
| 05-06-T1 | 05-06 | 3 | ANI-04 / SC#3 | grep | `grep -nE 'AnimatePresence.*mode="wait".*initial=\{false\}' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-06-T1 | 05-06 | 3 | ANI-04 / SC#3 | grep | `grep -nE 'key=\{location\.pathname\}' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-06-T1 | 05-06 | 3 | ANI-04 / SC#3 | grep | `grep -nE 'onExitComplete.*scrollTo' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-06-T1 | 05-06 | 3 | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-06-T2 | 05-06 | 3 | ANI-04 / SC#3 + D-14 | shell | `test ! -f src/components/layout/ScrollToTop.tsx` (file deleted) | ✅ Wave 0 | ⬜ pending |
| 05-01-T1 | 05-01 | 1 | ANI-04 / SC#3 | grep | `grep -nE 'duration: 0\.35\|duration: 0\.4\|duration: durations\.base' src/lib/motionVariants.ts` ≥ 2 | ✅ Wave 0 | ⬜ pending |
| 05-07-T1 | 05-07 | 3 | SC#5 | grep | `grep -nE "sessionStorage\.(get\|set)Item" src/hooks/useSessionFlag.ts` ≥ 2 | ✅ Wave 0 | ⬜ pending |
| 05-07-T2 | 05-07 | 3 | SC#5 | grep | `grep -n "useSessionFlag\('vugoda:hero-seen'\)" src/components/sections/home/Hero.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-07-T2 | 05-07 | 3 | SC#5 / D-28 | grep | `grep -n "import.*parallaxRange" src/components/sections/home/Hero.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-07-T2 | 05-07 | 3 | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/sections/home/Hero.tsx` (precedent from Phase 3, must persist post-05-07 edit) | ✅ Phase 3 | ⬜ pending |
| 05-08-T1 | 05-08 | 2 | SC#1 (CI gate) | scripted | `npx tsx scripts/check-brand.ts` exits 0 with output containing `5/5 checks passed` | ✅ Wave 0 | ⬜ pending |
| Bundle | * | last | Budget | scripted | `npm run build 2>&1 \| grep "gzipped"` — assert <200KB | ✅ exists | ⬜ pending |
| Brand | * | last | Invariants | scripted | `npm run build` (postbuild check-brand 5/5 — count-agnostic regex `[0-9]+/[0-9]+ checks passed` tolerates either 4/4 pre-05-08 or 5/5 post) | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

> Wave 0 = files that must exist before any verification grep can pass. Phase 5's Wave 0 is "create-the-files-first" because all grep gates assert against new file content.

- [ ] `src/lib/motionVariants.ts` — covers ANI-02 SC#1 (SOT named exports) — created by Plan 05-01
- [ ] `src/components/ui/RevealOnScroll.tsx` — covers ANI-02 SC#2 (wrapper) — created by Plan 05-03
- [ ] `src/hooks/useSessionFlag.ts` — covers SC#5 (session flag hook) — created by Plan 05-07
- [ ] `src/components/layout/Layout.tsx` (modify in place) — covers ANI-04 SC#3 (route transition + onExitComplete) — modified by Plan 05-06
- [ ] `src/components/sections/home/Hero.tsx` (modify in place) — covers SC#5 + D-28 (parallax SOT integration) — modified by Plan 05-07
- [ ] `src/index.css` (modify in place) — covers SC#1 (`--ease-brand`) + D-24 (`@utility hover-card`) — modified by Plans 05-01 + 05-02
- [ ] `scripts/check-brand.ts` (modify in place) — covers SC#1 permanent CI gate — modified by Plan 05-08

*No test framework install needed — STACK.md explicitly skips Vitest for MVP. The grep + manual + build script sweep is the project's established validation pattern, identical to Phases 2-4.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Inter-route fade transitions feel smooth, no jank | ANI-04 / SC#3 | Visual perception only | `npm run dev` → navigate `/` → `/projects` → `/zhk/etno-dim` → `/construction-log` → `/contact` → `/`. Each transition fades out then fades in within ~750ms total. No instant cuts, no double-paint, no scroll-position jump during fade. |
| Reduced-motion mode is fully respected | ANI-04 / SC#4 | OS/browser-emulated state | DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → reload → navigate all 5 routes. Verify: no reveal animations run (sections paint instantly), route transition is instant (no fade), hero is static (no parallax on scroll). Site fully navigable. |
| Hero session-skip works on revisit | SC#5 | sessionStorage state + visual | Cold incognito tab → `/` → scroll, hero parallax animates. Same-tab refresh → `/` → scroll, IsometricGridBG sits static at y:0 (no animation). Tab close + new tab → cinematic returns. |
| `/zhk/etno-dim` LCP image still paints fast (D-09 fade-only variant) | ANI-02 / SC#2 | Lighthouse LCP threshold | DevTools Performance → record `/zhk/etno-dim` cold load → confirm LCP element is the hero render and LCP timing ≤ 2.5s. |
| Lightbox + reveal coexistence (D-16) | n/a | Visual sanity | Open `/zhk/etno-dim`, scroll to gallery (reveal fires), click thumb (lightbox opens), close lightbox. No animation conflict, no visible glitch. |
| Hover-card consolidation byte-equivalent to Phase 4 inline class | D-24 | Visual diff | Before/after screenshots of one card per surface (PortfolioOverview pipeline grid, FlagshipCard, PipelineCard, ZhkGallery thumb, MonthGroup thumb) at idle + hover. Confirm: same scale, same glow color/intensity, same transition timing. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (motionVariants.ts in Plan 05-01; RevealOnScroll.tsx in Plan 05-03; useSessionFlag.ts in Plan 05-07)
- [x] No watch-mode flags (all commands are one-shot)
- [x] Feedback latency < 5s quick, < 30s full
- [x] Manual SC#3, SC#4, SC#5 visual gates documented for /gsd:verify-work
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** signed-off at plan-time (revised 2026-04-26 to address checker B6).
</content>
</invoke>