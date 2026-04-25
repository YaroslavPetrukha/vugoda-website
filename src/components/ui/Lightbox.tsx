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
