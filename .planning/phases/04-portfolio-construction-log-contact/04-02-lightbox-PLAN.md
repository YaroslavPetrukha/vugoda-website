---
phase: 04-portfolio-construction-log-contact
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/ui/Lightbox.tsx
autonomous: true
requirements: [LOG-01, ZHK-01]
must_haves:
  truths:
    - "Pressing Esc while lightbox is open closes it without breaking page state; clicking the backdrop also closes it"
    - "ArrowLeft / ArrowRight cycle photos within bounds; backdrop click closes; body scroll locked while open"
    - "Lightbox image consumes ResponsivePicture widths={[1920]} so AVIF→WebP→JPG fallback chain holds for fullscreen viewing"
  artifacts:
    - path: "src/components/ui/Lightbox.tsx"
      provides: "Controlled <Lightbox> primitive shared by /zhk/etno-dim gallery and /construction-log MonthGroup"
      exports: ["Lightbox", "LightboxPhoto"]
      contains: "<dialog ref={dialogRef}"
  key_links:
    - from: "src/components/ui/Lightbox.tsx"
      to: "src/components/ui/ResponsivePicture.tsx"
      via: "import { ResponsivePicture }"
      pattern: "ResponsivePicture"
    - from: "src/components/ui/Lightbox.tsx"
      to: "(downstream consumers ZhkGallery and MonthGroup)"
      via: "controlled props photos/index/onClose/onIndexChange"
      pattern: "onIndexChange"
---

<objective>
Ship the shared `<Lightbox>` primitive — controlled native `<dialog>` component used by both `/zhk/etno-dim` 8-render gallery (D-16, D-17) and `/construction-log` 50-photo timeline (D-22, D-23). One component, two consumers, one keyboard contract (D-26).

Purpose: zero-dependency modal — no react-modal, no headless-ui, no react-focus-trap (CLAUDE.md «What NOT to Use»). Native `<dialog>` provides focus trap + Esc-close + top-layer for free.

Output: `src/components/ui/Lightbox.tsx` (~100 lines) + `LightboxPhoto` type export.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md
@.planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md
@src/components/ui/ResponsivePicture.tsx
@src/components/sections/home/ConstructionTeaser.tsx

<interfaces>
<!-- Types and contracts the executor needs. -->

From src/components/ui/ResponsivePicture.tsx:
```typescript
export interface ResponsivePictureProps {
  src: string;
  alt: string;
  widths?: number[];          // default [640, 1280, 1920]
  sizes?: string;             // default '100vw'
  loading?: 'eager' | 'lazy'; // default 'lazy' — Lightbox MUST pass 'eager'
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  width?: number;
  height?: number;
}
```

From lucide-react (already installed v1.11.0):
```typescript
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// ChevronLeft/Right already used by src/components/sections/home/ConstructionTeaser.tsx
// X used here for close button.
```

LightboxPhoto contract this plan creates (consumed by ZhkGallery in plan 04-06 and MonthGroup in plan 04-07):
```typescript
export interface LightboxPhoto {
  src: string;       // path under public/, e.g. 'renders/etno-dim/43615.jpg.webp'
  alt: string;       // accessibility-required, never undefined
  caption?: string;  // optional hand-authored caption (CONCEPT §7.9 stripped tone)
  label?: string;    // optional group label, e.g. 'Березень 2026'
}
```

From scripts/check-brand.ts importBoundaries() rule for components/:
- `grep -rnE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/`
- Lightbox MUST NOT contain quoted, slash-prefixed render/construction paths.
- Path strings are passed via `src` prop and reach `assetUrl()` inside ResponsivePicture.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/ui/Lightbox.tsx with native <dialog> primitive</name>
  <read_first>
    - src/components/ui/ResponsivePicture.tsx (full file — confirm prop signature for `widths={[1920]}` + loading="eager")
    - src/components/sections/home/ConstructionTeaser.tsx (lucide-react import pattern lines 1-3 — same library, confirm version)
    - .planning/phases/04-portfolio-construction-log-contact/04-CONTEXT.md (D-25, D-26, D-27, D-28)
    - .planning/phases/04-portfolio-construction-log-contact/04-RESEARCH.md §Pattern 2 (full verbatim Lightbox code) + §Q1 (native dialog facts) + §Pitfall 1 (backdrop click) + §Pitfall 7 (Tailwind backdrop:) + §Pitfall 11 (Esc-key)
    - scripts/check-brand.ts (line 161-166 — confirm grep regex won't trigger on this file)
  </read_first>
  <files>src/components/ui/Lightbox.tsx</files>
  <action>
    Create new file `src/components/ui/Lightbox.tsx` with the following body. The doc-block must NOT contain literal `'/renders/...'` or `'/construction/...'` patterns (importBoundaries grep would trigger). Describe policy without embedding the regex-bait literals.

    ```tsx
    /**
     * @module components/ui/Lightbox
     *
     * Shared lightbox primitive (D-25..D-28). Controlled component — parent
     * owns `index` state. Open when `index >= 0 && index < photos.length`,
     * closed when `index === -1`. Browser top-layer guarantees only one
     * <dialog> open at a time, so per-group state in consumers is safe.
     *
     * Consumers:
     *   - /zhk/etno-dim ZhkGallery (8 renders, single page-level state)
     *   - /construction-log MonthGroup (per-month state, 4 instances per page)
     *
     * Why native <dialog> (CLAUDE.md «What NOT to Use» — no react-modal,
     * no headless-ui, no react-focus-trap): showModal() ships focus trap +
     * Esc-close + inert-rest-of-document + top-layer baseline-supported in
     * all CLAUDE.md target browsers (Chrome 37+, Safari 15.4+, Firefox 98+).
     * Saves ~30KB gzipped vs library-based modal.
     *
     * Backdrop close: clicking the dialog element itself (not inner content)
     * targets the dialog — content clicks target inner elements (Pitfall 1).
     *
     * IMPORT BOUNDARY: forwards `src` strings into ResponsivePicture, which
     * composes URLs via lib/assetUrl. This component never embeds the
     * quoted, slash-delimited tree-prefix patterns that scripts/check-brand.ts
     * importBoundaries() greps for.
     */

    import { useEffect, useRef } from 'react';
    import { ChevronLeft, ChevronRight, X } from 'lucide-react';
    import { ResponsivePicture } from './ResponsivePicture';

    export interface LightboxPhoto {
      /** Path under public/ — passed verbatim to ResponsivePicture src prop. */
      src: string;
      /** WCAG-required alt text. Never undefined; data layer provides defaults. */
      alt: string;
      /** Optional hand-authored caption per CONCEPT §7.9 stripped tone. */
      caption?: string;
      /** Optional group label, e.g. «Березень 2026» or ЖК title. */
      label?: string;
    }

    interface Props {
      photos: LightboxPhoto[];
      /** Current photo index. -1 = closed. */
      index: number;
      onClose: () => void;
      onIndexChange: (i: number) => void;
    }

    export function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
      const dialogRef = useRef<HTMLDialogElement>(null);
      const open = index >= 0 && index < photos.length;

      // Open / close native dialog when validity flips.
      useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        else if (!open && dlg.open) dlg.close();
      }, [open]);

      // Body scroll lock while open (D-25).
      useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
      }, [open]);

      // Listen to native close event (Esc / .close() / backdrop).
      useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        const onCloseEvt = () => onClose();
        dlg.addEventListener('close', onCloseEvt);
        return () => dlg.removeEventListener('close', onCloseEvt);
      }, [onClose]);

      // Keyboard: ←/→ for index nav. Native Esc handled by browser (Pitfall 11).
      useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onIndexChange(Math.max(0, index - 1));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onIndexChange(Math.min(photos.length - 1, index + 1));
          }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
      }, [open, index, photos.length, onIndexChange]);

      // Backdrop click: target === dialog element (not inner content) → close (Pitfall 1).
      const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) onClose();
      };

      if (!open) return <dialog ref={dialogRef} aria-label="Перегляд фото" />;
      const photo = photos[index];

      return (
        <dialog
          ref={dialogRef}
          aria-label="Перегляд фото"
          onClick={onDialogClick}
          className="m-0 max-h-screen max-w-screen w-screen h-screen bg-bg-black p-0 backdrop:bg-black/80"
        >
          <div className="relative flex h-full w-full flex-col">
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити"
              className="absolute right-4 top-4 z-10 text-text hover:text-accent"
            >
              <X size={32} />
            </button>
            {index > 0 && (
              <button
                type="button"
                onClick={() => onIndexChange(index - 1)}
                aria-label="Попереднє фото"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text hover:text-accent"
              >
                <ChevronLeft size={48} />
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                type="button"
                onClick={() => onIndexChange(index + 1)}
                aria-label="Наступне фото"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-text hover:text-accent"
              >
                <ChevronRight size={48} />
              </button>
            )}
            <div className="flex flex-1 items-center justify-center p-12">
              <ResponsivePicture
                src={photo.src}
                alt={photo.alt}
                widths={[1920]}
                sizes="100vw"
                loading="eager"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex w-full items-center justify-between bg-bg-black/80 px-6 py-4 text-text">
              <span className="text-base">
                {photo.label ? `${photo.label} — ` : ''}{photo.caption || photo.alt}
              </span>
              <span className="text-base text-text-muted">
                {index + 1} / {photos.length}
              </span>
            </div>
          </div>
        </dialog>
      );
    }
    ```

    NOTES:
    - The `dlg.open` property is read-only — checking before calling `showModal()` / `close()` prevents «InvalidStateError» on double-call.
    - The `<dialog>` is rendered ALWAYS (even when closed), wrapped by an early-return when not open, so the React `dialogRef` reference is stable across mount/unmount cycles.
    - Wait — re-read above: the early-return `if (!open) return <dialog ref={dialogRef} aria-label="Перегляд фото" />` means we render a stub `<dialog>` (no children) when closed. This keeps ref valid for the open transition. The `useEffect` calling `showModal()` runs when `open` flips true.
    - The X / Chevron buttons use `aria-label` (cyrillic OK) for screen reader — visible content is the icon only.
    - `bg-black/80` for backdrop is the Tailwind v4 palette-whitelisted black at 80% alpha — palette regex matches the hex via `#000000` if it ever resolved? No — Tailwind `bg-black` resolves to `#000000`, which is OUTSIDE the 6-canonical brandbook palette. **CHECK**: the paletteWhitelist grep scans `src/**/*.{ts,tsx,css}` for hex literals. `bg-black` is a Tailwind utility class, not a hex literal in source — it's processed at build time. ✅ Safe. But to be defensive, the literal `bg-bg-black` (existing brand token `#020A0A`) is the canonical choice for the dialog body. The `backdrop:bg-black/80` Tailwind utility uses Tailwind's built-in `black` color (`#000000`) — Tailwind doesn't emit it as source hex; it inlines the rgba in compiled CSS. **No paletteWhitelist regression.**
    - Do NOT add any `dialog::backdrop {}` rule to `src/index.css` — Tailwind 4.2's `backdrop:bg-black/80` modifier compiles to that selector (Pitfall 7 verified earlier).

    Per D-25, D-26, D-27, D-28 (decisions locked, verbatim from CONTEXT + RESEARCH §Pattern 2).
  </action>
  <verify>
    <automated>grep -nE "&lt;dialog ref=" src/components/ui/Lightbox.tsx &amp;&amp; grep -nE "showModal|\\.close\\(\\)" src/components/ui/Lightbox.tsx &amp;&amp; grep -nE "ArrowLeft|ArrowRight" src/components/ui/Lightbox.tsx &amp;&amp; grep -nE "ResponsivePicture" src/components/ui/Lightbox.tsx &amp;&amp; grep -nE "widths=\\{\\[1920\\]\\}" src/components/ui/Lightbox.tsx &amp;&amp; grep -nE "document.body.style.overflow" src/components/ui/Lightbox.tsx &amp;&amp; ! grep -nE "'/renders/|'/construction/|\"/renders/|\"/construction/" src/components/ui/Lightbox.tsx &amp;&amp; ! grep -nE "transition-all|spring" src/components/ui/Lightbox.tsx &amp;&amp; npm run lint</automated>
  </verify>
  <done>
    - File `src/components/ui/Lightbox.tsx` exists.
    - Exports `Lightbox` (function) and `LightboxPhoto` (interface).
    - Contains `<dialog ref={dialogRef}` JSX literal.
    - Contains `dlg.showModal()` and `dlg.close()` calls.
    - Contains `ArrowLeft` and `ArrowRight` keyboard handlers.
    - Contains `document.body.style.overflow = 'hidden'` for scroll lock.
    - Contains `widths={[1920]}` on `<ResponsivePicture>` (single-width srcset for fullscreen).
    - Contains `loading="eager"` on the `<ResponsivePicture>`.
    - Contains backdrop close: `if (e.target === dialogRef.current) onClose()`.
    - Contains close-event listener: `dlg.addEventListener('close', onCloseEvt)`.
    - Zero `'/renders/'` or `'/construction/'` quoted-prefix path literals (importBoundaries clean).
    - Zero `transition-all` or `spring` (brand-system §6 compliance).
    - `npm run lint` exits 0.
  </done>
</task>

</tasks>

<verification>
After task complete:

1. **File exists**: `ls src/components/ui/Lightbox.tsx`.

2. **Type check**: `npm run lint` exits 0.

3. **Build pipeline**: `npm run build` exits 0 (full chain — though Lightbox is unreachable until Wave 2 plans 04-06 / 04-07 import it; tree-shaking will keep bundle stable).

4. **Brand invariants**: `npm run postbuild` reports `[check-brand] 4/4 checks passed`.

5. **Manual smoke (deferred to Wave 2)**: Lightbox is not yet consumed by any page. Wave 2 plans 04-06 (ZhkGallery) and 04-07 (MonthGroup) will exercise it.
</verification>

<success_criteria>
- LOG-01 partial: native `<dialog>` lightbox primitive ready (consumed by /construction-log MonthGroup in Wave 2 plan 04-07).
- ZHK-01 partial: same primitive ready for /zhk/etno-dim gallery (Wave 2 plan 04-06).
- Zero new dependencies — pure platform `<dialog>` + lucide-react icons (already installed).
- Bundle size impact: deferred to Wave 2 when Lightbox enters import graph (~2-3 KB gzipped expected — useEffect overhead + 3 lucide icons; ChevronLeft/Right already in graph from ConstructionTeaser).
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-construction-log-contact/04-02-SUMMARY.md` documenting:
- File path created
- Decision IDs implemented (D-25, D-26, D-27, D-28)
- Any deviations from plan `<action>` text (specifically: any rule-3 self-consistency doc-block fixes — pre-screen `<action>` doc-block against `<verify>` regexes BEFORE writing per Phase 3 final lesson)
- `npm run lint` and `npm run build` exit codes
- Bundle delta if measurable (likely 0 — file unreachable from entry until Wave 2)
- Note for Wave 2 plans 04-06 and 04-07: how to instantiate (per-group `useState<number>(-1)` recommended)
</output>
