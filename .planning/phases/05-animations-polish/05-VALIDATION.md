---
phase: 5
slug: animations-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-26
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `05-RESEARCH.md` § Validation Architecture (lines 483-535).

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

> Task IDs are placeholders (`05-NN-MM`) — planner fills in concrete IDs as plans are written. Each row maps a Phase 5 invariant to its automated grep gate or manual gate.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-* | 01 | 1 | ANI-02 / SC#1 | grep | `! grep -rn 'transition={{' src/` (exit 1 = pass) | ✅ Wave 0 | ⬜ pending |
| 05-01-* | 01 | 1 | ANI-02 / SC#1 | grep | `grep -nE '^export const (easeBrand\|durations\|fadeUp\|fade\|stagger\|pageFade\|parallaxRange) ' src/lib/motionVariants.ts \| wc -l` ≥ 7 | ✅ Wave 0 | ⬜ pending |
| 05-01-* | 01 | 1 | ANI-02 / SC#1 | grep | `grep -n -- '--ease-brand:' src/index.css` (1 match) | ✅ Wave 0 | ⬜ pending |
| 05-02-* | 02 | * | SC#1 / D-24 | grep | `grep -nE '@utility hover-card' src/index.css` (1 match) | ✅ Wave 0 | ⬜ pending |
| 05-02-* | 02 | * | SC#1 / D-24 | grep | `grep -rn 'hover-card' src/components/ \| wc -l` ≥ 5 (5 surfaces consume) | ✅ Wave 0 | ⬜ pending |
| 05-03-* | 03 | * | ANI-02 / SC#2 | grep | `grep -nE 'whileInView=' src/components/ui/RevealOnScroll.tsx && grep -n 'margin:.*-50px' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-03-* | 03 | * | ANI-02 / SC#2 | grep | `! grep -n '<RevealOnScroll' src/components/sections/home/Hero.tsx` (Hero excluded) | ✅ Wave 0 | ⬜ pending |
| 05-03-* | 03 | * | ANI-02 / SC#2 | grep | `grep -rn '<RevealOnScroll' src/components/sections/ src/pages/ \| wc -l` ≥ 18 (D-08 coverage map) | ✅ Wave 0 | ⬜ pending |
| 05-03-* | 03 | * | ANI-02 / SC#2 | grep | `grep -rnE 'staggerChildren.*0\.08\|staggerChildren=\{true\}' src/` ≥ 1 | ✅ Wave 0 | ⬜ pending |
| 05-04-* | 04 | * | ANI-02 / SC#2 | grep | `grep -nc '<RevealOnScroll' src/components/sections/construction-log/MonthGroup.tsx` = 1 (per-MonthGroup, NOT per-photo) | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#3 | grep | `grep -nE 'AnimatePresence.*mode="wait".*initial=\{false\}' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#3 | grep | `grep -nE 'key=\{location\.pathname\}' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#3 | grep | `grep -nE 'onExitComplete.*scrollTo' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#3 | grep | `grep -nE 'duration: 0\.35\|duration: 0\.4\|duration: durations\.base' src/lib/motionVariants.ts` ≥ 2 | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/ui/RevealOnScroll.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/layout/Layout.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-05-* | 05 | * | ANI-04 / SC#4 | grep | `grep -n 'useReducedMotion' src/components/sections/home/Hero.tsx` | ✅ Phase 3 | ⬜ pending |
| 05-02-* | 02 | * | ANI-04 / SC#4 | grep | `grep -nE '@media \(prefers-reduced-motion' src/index.css` ≥ 1 | ✅ Wave 0 | ⬜ pending |
| 05-06-* | 06 | * | SC#5 | grep | `grep -nE "sessionStorage\.(get\|set)Item.*'vugoda:hero-seen'\|key" src/hooks/useSessionFlag.ts` ≥ 2 | ✅ Wave 0 | ⬜ pending |
| 05-06-* | 06 | * | SC#5 | grep | `grep -n "useSessionFlag\('vugoda:hero-seen'\)" src/components/sections/home/Hero.tsx` | ✅ Wave 0 | ⬜ pending |
| 05-07-* | 07 | * | SC#5 / D-28 | grep | `grep -n "import.*parallaxRange" src/components/sections/home/Hero.tsx` | ✅ Wave 0 | ⬜ pending |
| Bundle | * | last | Budget | scripted | `npm run build 2>&1 \| grep "gzipped"` — assert <200KB | ✅ exists | ⬜ pending |
| Brand | * | last | Invariants | scripted | `npm run build` (postbuild check-brand 4/4) | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

> Wave 0 = files that must exist before any verification grep can pass. Phase 5's Wave 0 is "create-the-files-first" because all grep gates assert against new file content.

- [ ] `src/lib/motionVariants.ts` — covers ANI-02 SC#1 (SOT named exports)
- [ ] `src/components/ui/RevealOnScroll.tsx` — covers ANI-02 SC#2 (wrapper)
- [ ] `src/hooks/useSessionFlag.ts` — covers SC#5 (session flag hook)
- [ ] `src/components/layout/Layout.tsx` (modify in place) — covers ANI-04 SC#3 (route transition + onExitComplete)
- [ ] `src/components/sections/home/Hero.tsx` (modify in place) — covers SC#5 + D-28 (parallax SOT integration)
- [ ] `src/index.css` (modify in place) — covers SC#1 (`--ease-brand`) + D-24 (`@utility hover-card`)

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (motionVariants.ts, RevealOnScroll.tsx, useSessionFlag.ts created in plan 01/03/06)
- [ ] No watch-mode flags (all commands are one-shot)
- [ ] Feedback latency < 5s quick, < 30s full
- [ ] Manual SC#3, SC#4, SC#5 visual gates documented for /gsd:verify-work
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
