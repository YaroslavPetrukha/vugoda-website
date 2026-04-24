# Phase 1: Foundation & Shell — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 01-foundation-shell
**Areas discussed:** Nav items & active state · Footer layout density · Empty stub treatment · Deploy workflow timing

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Nav items & active state | Which links beyond logo appear in nav, order, and active-route indicator | ✓ |
| Footer layout density | 4 required legal items + email = given; shape and extras beyond mandatory | ✓ |
| Empty stub treatment | What 5 route stubs render before Phase 3–4 fill them | ✓ |
| Deploy in Phase 1 or defer | Commit `.github/workflows/deploy.yml` + enable Pages at Phase 1 vs defer to Phase 6 | ✓ |

**User's choice:** All four selected (multiSelect).
**Notes:** None — user accepted full set immediately.

---

## Nav items & active state

### Question 1: Nav link set beyond logo

| Option | Description | Selected |
|--------|-------------|----------|
| 3 links: Проєкти · Хід будівництва · Контакт | Minimal Core-4 nav. Logo = home. No v2 ghost-links. | ✓ (Recommended) |
| 3 links + Home text link | Logo + explicit «Головна» + 3 content links = 4 text items | |
| 2 links: Проєкти · Контакт | Merge construction-log into /projects; hides Persona-3 deep-link | |

**User's choice:** 3 links: Проєкти · Хід будівництва · Контакт (Recommended default).
**Notes:** Aligned with MVP Core-4 scope. Logo-as-home is a reasonable affordance convention.

### Question 2: Active route visual indicator

| Option | Description | Selected |
|--------|-------------|----------|
| Accent underline (2px #C1F33D, 2–4px below text) | Matches brand accent-as-highlight discipline | ✓ (Recommended) |
| Accent text color (#C1F33D) | Link text turns lime on active | |
| Left stroke (2px accent, full nav height) | Architectural blueprint feel, echoes isometric lines | |
| No indicator | Route change is the indicator; hurts orientation on deep pages | |

**User's choice:** Accent underline (Recommended default).
**Notes:** Doubles cleanly with focus-visible treatment (same accent color).

---

## Footer layout density

### Question 1: Footer structure

| Option | Description | Selected |
|--------|-------------|----------|
| 3-column: Brand+contact \| Nav repeat \| Legal block | Col1 mini-logo+email+©; Col2 nav links; Col3 legal triplet | ✓ (Recommended) |
| 2-column: Nav+Contact \| Legal | Leaner, fewer dead columns | |
| Single horizontal strip | Dense, hard to scan | |
| Stacked single column (center-aligned) | Wastes 1920px horizontal space | |

**User's choice:** 3-column layout (Recommended default).
**Notes:** Best match for corporate-site convention and 1920×1080 canvas.

### Question 2: Extras beyond mandatory items (multiSelect)

| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic © 2026 + legal name | `© ${new Date().getFullYear()} ТОВ …`; auto-renews | ✓ (Recommended) |
| Nav link repeat | Проєкти / Хід будівництва / Контакт again in footer | ✓ |
| Social placeholders (href="#", cursor-disabled) | Telegram/Instagram/Facebook icons as stubs | ✓ |
| Privacy-policy link | PROJECT.md Out of Scope forbids v1; dead link worse than omitting | ✓ (conflict — reconfirmed below) |

**User's choice:** All four initially — conflict flagged because Privacy-policy contradicts PROJECT.md v1 rule.

### Question 2-follow-up: Privacy-policy link override?

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it — respect PROJECT.md v1 rule | Reverts footer extras to ©+nav+social | ✓ (Recommended) |
| Keep it — override v1 rule | Requires PROJECT.md Out-of-Scope update; scope bump | |
| Keep as cursor-disabled stub (like social) | Still a dead link — problem PROJECT.md tried to prevent | |

**User's choice:** Drop it (Recommended default).
**Notes:** PROJECT.md v1 hard-rule upheld. Footer extras finalised: © + nav repeat + social placeholders. No privacy-policy link.

---

## Empty stub treatment

### Question 1: 5 route stubs visual

| Option | Description | Selected |
|--------|-------------|----------|
| H1 + IsometricCube `variant='single'` mark centered | Ships minimal cube primitive early; shell looks intentional | ✓ (Recommended) |
| H1 page title only | Cleanest; most empty-feeling between Nav and Footer | |
| H1 + muted caption «Розділ наповнюється» | Reads 'unfinished'; risky if client sees demo mid-build | |
| H1 + dev-only banner + real page-title | `import.meta.env.DEV`-gated internal marker | |

**User's choice:** H1 + centered IsometricCube mark (Recommended default).
**Notes:** Carry-up: Phase 1 now owns a minimal single-cube SVG (Phase 3 still owns full 3-variant primitive).

### Question 2: `/zhk/:slug` stub special handling

| Option | Description | Selected |
|--------|-------------|----------|
| Same treatment as others — show `/zhk/:slug` unresolved | Phase 1 doesn't touch data; Phase 4 adds resolution | ✓ (Recommended) |
| Stub reads slug param + shows it as title | Mingles Phase 1 shell with Phase 4 data concerns | |
| Skip `/zhk/:slug` in Phase 1 | Deviates from roadmap success criteria #1 | |

**User's choice:** Same treatment (Recommended default).
**Notes:** Keeps Phase 1 scope clean — no data-layer bleed.

### Question 3: 404 / unknown route handling

| Option | Description | Selected |
|--------|-------------|----------|
| Catch-all `path="*"` → 404 page + home link | Minimal 404 inside Layout; nav+footer still render | ✓ (Recommended) |
| No catch-all — unknown routes show blank main | Minimal but not intentional | |
| Redirect unknown routes to `/` | Silently masks broken links — bad for debugging | |

**User's choice:** Catch-all 404 page (Recommended default).
**Notes:** Phase 7 QA audit tests this deep-link class — Phase 1 pre-satisfies it.

---

## Deploy workflow timing

### Question 1: When does GH Actions deploy land?

| Option | Description | Selected |
|--------|-------------|----------|
| Commit workflow + do one live deploy at Phase 1 end | Validates base/.nojekyll/HashRouter on real Pages early | ✓ (Recommended) |
| Commit workflow file only — don't enable Pages | Safer against leaks but loses early-validation benefit | |
| Defer everything to Phase 6 | Concentrates deploy-config risk at the end | |

**User's choice:** Commit + live deploy at Phase 1 end (Recommended default).
**Notes:** Insurance against 'looks-done-but-isn't' at Phase 6. DEP-01/DEP-02 narrow in Phase 6 to OG/Lighthouse/perf/mobile-fallback.

### Question 2: Public exposure concern?

| Option | Description | Selected |
|--------|-------------|----------|
| Not a concern — client briefed, stubs-with-cubes look intentional | Credibility-building, not embarrassing | ✓ (Recommended) |
| Mark it WIP visibly | Banner/marker removable via `import.meta.env.VITE_WIP` | |
| Keep repo private until Phase 6 | Requires GitHub Pro for private Pages | |

**User's choice:** Not a concern (Recommended default).
**Notes:** Phase 1 shell will be publicly reachable at `https://yaroslavpetrukha.github.io/vugoda-website/` end-of-phase.

---

## Claude's Discretion

Items where downstream planner/executor has flexibility (per CONTEXT.md):

- Exact CSS technique for active-route underline (pseudo-element vs `border-bottom` vs absolute span)
- Single-cube SVG implementation (trim `brand-assets/mark/mark.svg`, hand-author, or seed `<IsometricCube variant='single'>` early)
- Layout container max-width (default `max-w-7xl`/1280px from prototype)
- Vertical rhythm / padding (use `--spacing-rhythm-*` scale)
- `<ScrollToTop/>` helper on route change (recommended yes; can also defer to Phase 5)
- `tsc --noEmit` wiring in `lint` script + optional Husky pre-commit
- `lucide-react` version — stay on prototype's 0.546 or bump to v1.x

---

## Deferred Ideas (noted for future phases)

- Layout max-width experimentation (revisit Phase 3 if 1280 feels cramped at hero)
- Font-preload optimization for LCP (Phase 6 perf)
- Full `<IsometricCube>` with typed stroke prop (Phase 3)
- `AnimatePresence` route transitions (Phase 5, ANI-04)
- Reduced-motion hook + variants (Phase 5, ANI-02/04)
- Hidden `/dev/brand` and `/dev/grid` QA routes (Phase 3 and Phase 4)
- CI denylist scripts (Phase 2, QA-04)
- Privacy-policy link (v2, INFR2-05 — never v1)

---

## Cross-Phase Scope Shifts (important for downstream)

Two explicit carry-ups from later phases into Phase 1, authorised during discussion:

1. **Minimal single-cube SVG** — originally fully scoped to Phase 3 (VIS-03 `<IsometricCube variant='single'|'group'|'grid'>`). Phase 1 now ships a minimal subset so route stubs have a visual anchor. Phase 3 still owns the full 3-variant primitive.
2. **Live GitHub Pages deploy** — originally mapped to Phase 6 (DEP-01/02). Phase 1 now ships the workflow file and does one live deploy at phase end. Phase 6 scope narrows: OG meta, Lighthouse, perf budget, mobile-fallback page, image pipeline.

These shifts should be reflected in Phase 3 and Phase 6 plans when they are generated.
