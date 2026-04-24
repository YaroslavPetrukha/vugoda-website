# Quick Task 260424-whr — SUMMARY

**Completed:** 2026-04-24
**Status:** ✅ PASSED (Branch A — URL-import WORKS)
**Outcome:** R17 mitigated. No Phase 3 code changes needed for Logo. Skeptic-pass gate A1 cleared.

## Result

Logo.tsx URL-import (`import darkLogoUrl from '../../../brand-assets/logo/dark.svg'`) **is correctly bundled by Rollup** into the production build. Source and dist SVG are byte-identical (12 469 B), hashed filename pattern `dark-{8-char}.svg` honored.

## Evidence

### Build summary (relevant lines from `npm run build`)

```
vite v6.4.2 building for production...
✓ 1767 modules transformed.
dist/assets/dark-CqLEGef8.svg                              12.47 kB │ gzip:  3.78 kB
dist/assets/index-BIZksvV0.css                             27.22 kB │ gzip:  5.90 kB
dist/assets/index-D2USYUt6.js                             242.85 kB │ gzip: 76.85 kB
✓ built in 2.60s

[check-brand] 4/4 checks passed
```

### Filesystem verification

```
$ find dist -type f -name "*.svg"
dist/favicon.svg           (3594 B, from public/favicon.svg)
dist/assets/dark-CqLEGef8.svg  (12 469 B, hashed, from brand-assets/logo/dark.svg via URL-import)

$ stat brand-assets/logo/dark.svg dist/assets/dark-CqLEGef8.svg
12469 (source)
12469 (dist)  ← byte-identical
```

### Side-benefits noticed during build

| Metric | Value | Budget | Verdict |
|--------|-------|--------|---------|
| JS bundle | **76.85 KB gzipped** | ≤ 200 KB | ✅ 38% of budget used |
| CSS bundle | 5.90 KB gzipped | — | ✅ tiny |
| Logo SVG | 3.78 KB gzipped | — | ✅ subresource-fetched |
| Fonts (6 files) | ~65 KB total (woff/woff2 cyrillic × 3 weights) | — | ✅ matches VIS-02 subset strategy |
| check-brand | 4/4 PASS (denylist + palette + placeholder + boundary) | — | ✅ no regression |
| Build time | 2.60 s | — | ✅ fast |
| Modules transformed | 1 767 | — | — |
| Prebuild translit | Successful (likeview → lakeview, 3 Cyrillic folders → ASCII slugs) | — | ✅ |

## Decision

**VIS-04 pattern confirmed for Logo/Mark:** URL-import from `brand-assets/` works. Phase 3 does NOT need to move assets into `public/brand/`.

**Implication for IsometricCube (Phase 3):** svgr `?react` path (separately configured in `vite.config.ts`) is the other verified mechanism — no conflict; URL-import for `<img>` use cases, svgr `?react` when component needs props (opacity, stroke parameterization).

## PLAN.md update required

Risk R17 in `.planning/PLAN.md` §7 can be downgraded:
- **Before:** R17 | MED likelihood | HIGH impact
- **After:** R17 | LOW likelihood | HIGH impact (verified on 2026-04-24; regression watch via check-brand build step remains sufficient)

Suggested edit to PLAN.md R17 Mitigation: append "Verified 2026-04-24 via quick task 260424-whr — byte-identical bundle."

## Next skeptic-pass gates (from execution playbook Step 0)

- [x] **A1 — Logo bundle verify** ← this task, PASS
- [ ] **A2 — Image pipeline decision** — next: `/gsd:quick створи scripts/optimize-images.mjs…`
- [ ] **A3 — Wordmark case decision** — next: user-presented 3-option comparison
- [x] **A4 — DoD boundary rule** — already locked in patched PLAN.md §6
- [x] **A5 — no `src/hooks/`** — already locked in patched PLAN.md §5

## Files touched

- `.planning/quick/260424-whr-verify-logo-tsx-svg-lands-in-prod-build/260424-whr-PLAN.md` (created)
- `.planning/quick/260424-whr-verify-logo-tsx-svg-lands-in-prod-build/260424-whr-SUMMARY.md` (this file)
- `.planning/STATE.md` (Quick Tasks Completed table entry)
- `dist/` regenerated but gitignored

No source code modified.
