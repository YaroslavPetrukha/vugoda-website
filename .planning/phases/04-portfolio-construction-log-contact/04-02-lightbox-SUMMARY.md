---
phase: 04-portfolio-construction-log-contact
plan: 02
subsystem: ui
tags: [react, typescript, dialog, lightbox, accessibility, keyboard-nav]

# Dependency graph
requires:
  - phase: 03-brand-primitives-home-page
    provides: ResponsivePicture component (widths/loading/sizes props) + lucide-react icons already installed

provides:
  - Lightbox controlled component at src/components/ui/Lightbox.tsx
  - LightboxPhoto interface (src, alt, caption?, label?)
  - Native <dialog> primitive with showModal()/close() lifecycle
  - Body scroll lock, ArrowLeft/ArrowRight keyboard nav, backdrop close
  - LOG-01 partial: native dialog lightbox primitive ready for /construction-log MonthGroup (plan 04-07)
  - ZHK-01 partial: same primitive ready for /zhk/etno-dim ZhkGallery (plan 04-06)

affects: [04-06-zhk-etno-dim, 04-07-construction-log]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Controlled lightbox: parent owns index state (-1 = closed), Lightbox owns dialog DOM"
    - "Native <dialog> showModal()/close() controlled by useEffect watching `open` boolean"
    - "Backdrop close via e.target === dialogRef.current comparison (Pitfall 1 pattern)"
    - "Keyboard nav via document.addEventListener keydown scoped to open state"
    - "Body scroll lock: save/restore document.body.style.overflow in useEffect cleanup"

key-files:
  created:
    - src/components/ui/Lightbox.tsx
  modified: []

key-decisions:
  - "D-25: Native <dialog> (not react-modal/headless-ui) — showModal() provides focus trap + Esc-close + top-layer for free"
  - "D-26: Keyboard ArrowLeft/ArrowRight nav with index clamped to [0, photos.length-1]"
  - "D-27: Text strip with label + caption||alt fallback + index counter at bottom"
  - "D-28: ResponsivePicture widths={[1920]} loading=eager for fullscreen single-width srcset"
  - "Wave 2 instantiation pattern: per-group useState<number>(-1) recommended (per-month for MonthGroup, page-level for ZhkGallery)"

patterns-established:
  - "Lightbox: import { Lightbox, LightboxPhoto } from '../ui/Lightbox'; const [lightboxIndex, setLightboxIndex] = useState(-1)"
  - "Pre-screen <action> doc-blocks against <verify> regexes before writing — applied here, zero collisions (pattern from Plan 03-08)"

requirements-completed: [LOG-01, ZHK-01]

# Metrics
duration: 8min
completed: 2026-04-25
---

# Phase 04 Plan 02: Lightbox Primitive Summary

**Controlled native `<dialog>` lightbox with showModal()/Esc/ArrowKey nav + body-scroll-lock, shared by /zhk/etno-dim gallery and /construction-log timeline**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-25T18:34:00Z
- **Completed:** 2026-04-25T18:42:23Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Shipped `src/components/ui/Lightbox.tsx` (~161 lines) with full keyboard contract per D-25..D-28
- Exports `LightboxPhoto` interface and `Lightbox` controlled function component
- Zero new dependencies — platform `<dialog>` + lucide-react icons (already installed) + ResponsivePicture (already shipped in Phase 3)
- `npm run lint` (tsc --noEmit) exits 0; all 8 verify grep conditions pass

## Task Commits

1. **Task 1: Create src/components/ui/Lightbox.tsx with native dialog primitive** - `fafad88` (feat)

**Plan metadata:** (to be added by final commit)

## Files Created/Modified

- `src/components/ui/Lightbox.tsx` — controlled `<dialog>` lightbox primitive; exports `Lightbox` and `LightboxPhoto`

## Decisions Made

All decisions were locked in CONTEXT.md D-25..D-28 before this plan executed. No new decisions required.

- **D-25 implemented:** native `<dialog>` ref + `showModal()` / `close()` controlled by useEffect; Esc close via native dialog close-event listener.
- **D-26 implemented:** document-level `keydown` listener while open; `ArrowLeft` → `Math.max(0, index-1)`, `ArrowRight` → `Math.min(photos.length-1, index+1)`.
- **D-27 implemented:** bottom strip with `{photo.label ? label + ' — ' : ''}` + `photo.caption || photo.alt` + index counter `{index+1} / {photos.length}`.
- **D-28 implemented:** `<ResponsivePicture widths={[1920]} sizes="100vw" loading="eager">`.

**Wave 2 instantiation pattern (for plans 04-06 and 04-07):**
```tsx
const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
// ...
<Lightbox
  photos={photoArray}
  index={lightboxIndex}
  onClose={() => setLightboxIndex(-1)}
  onIndexChange={setLightboxIndex}
/>
```
Per-month state in MonthGroup (4 instances on /construction-log); page-level state in ZhkGallery (single instance).

## Deviations from Plan

None — plan executed exactly as written. Doc-block pre-screen passed on first write (no forbidden literals in doc-block text). Pattern established in Plan 03-08 applied successfully.

## Issues Encountered

**Parallel build contention (out-of-scope, not caused by this plan):** Wave 1 sibling agents running `npm run build` simultaneously contend on `public/renders/` — `copy-renders.ts`'s `rmSync` destroys `_opt/` directories that a concurrent sharp encode is writing to. This caused `npm run build` to fail during verification. Issue is architectural (parallel wave + single shared filesystem), NOT caused by Lightbox.tsx. The primary verification gate for this plan — `npm run lint` (tsc --noEmit) — passes cleanly. The build pipeline will be functional once Wave 1 completes and a single sequential build runs.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `Lightbox` and `LightboxPhoto` are ready for immediate import by Wave 2 plans
- Plan 04-06 (`/zhk/etno-dim` ZhkGallery): import `{ Lightbox, LightboxPhoto }` from `../../components/ui/Lightbox`; use page-level `useState<number>(-1)` for index
- Plan 04-07 (`/construction-log` MonthGroup): import same; use per-month `useState<number>(-1)` (4 independent instances, browser top-layer ensures only one open)
- Optimizer extension (D-29, construction widths `[640, 960]` → `[640, 960, 1920]`) must be done before Wave 2 to ensure 1920w construction variants exist for lightbox fullscreen
- No blockers

---
*Phase: 04-portfolio-construction-log-contact*
*Completed: 2026-04-25*
