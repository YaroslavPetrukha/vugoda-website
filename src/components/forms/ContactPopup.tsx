/**
 * @module components/forms/ContactPopup
 *
 * Modal wrapper for `ContactFormFields` — opens via `useContactPopup().open()`
 * from any CTA across the site. Native <dialog> per Lightbox.tsx pattern
 * (showModal() ships focus trap + Esc-close + inert-rest-of-document, no
 * library overhead).
 *
 * Auto-close on success: when the form fires `onSuccess`, the popup keeps
 * the success state visible for 3s so the user reads the confirmation, then
 * closes. The form internally also offers «Надіслати ще» so the user can
 * stay in the popup if they want — closing is optional.
 *
 * Backdrop click: clicking the dialog element itself (not inner content)
 * closes the popup (same Pitfall 1 pattern as Lightbox.tsx).
 *
 * Reduced-motion: <dialog>::backdrop fade is CSS-only with prefers-reduced-
 * motion media query (see global :where animations in index.css). Form
 * fields do their own fade via Motion variants.
 *
 * Brand:
 *   - Backdrop bg-black/80 (matches Lightbox).
 *   - Dialog box bg-bg (canonical dark, not surface — popup is its own
 *     ambient layer, not a card on a page).
 *   - max-w-2xl on desktop — narrower than Lightbox because forms read
 *     vertically and a wide modal feels institutional.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ContactFormFields } from './ContactFormFields';
import { useContactPopup } from './ContactPopupProvider';
import { popupHeading, popupSubheading, popupCloseLabel } from '../../content/forms';

const AUTO_CLOSE_DELAY_MS = 3000;

export function ContactPopup() {
  const { isOpen, context, openTick, close } = useContactPopup();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open / close native dialog mirroring isOpen.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) dlg.showModal();
    else if (!isOpen && dlg.open) dlg.close();
  }, [isOpen]);

  // Body scroll lock while open (parity with Lightbox.tsx).
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Native close event (Esc / .close() / form-submit-success auto-close).
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onCloseEvt = () => close();
    dlg.addEventListener('close', onCloseEvt);
    return () => dlg.removeEventListener('close', onCloseEvt);
  }, [close]);

  // Backdrop click closes — only when target is dialog element itself,
  // not inner content (Pitfall 1).
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  // Auto-close after success: popup gives user 3s to read the confirmation,
  // then dismisses itself. Form's «Надіслати ще» button still works during
  // this window — user can stay if they want.
  const handleSuccess = () => {
    setTimeout(() => {
      // Re-check the dialog is still open before closing — user might have
      // clicked away or hit Esc before the timer fires.
      if (dialogRef.current?.open) close();
    }, AUTO_CLOSE_DELAY_MS);
  };

  // Always render the <dialog> in the DOM so showModal() has a stable node.
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-popup-heading"
      onClick={onDialogClick}
      className="m-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-bg p-0 backdrop:bg-black/80"
    >
      <div className="relative flex flex-col gap-6 px-8 py-10 sm:px-12 sm:py-12">
        <button
          type="button"
          onClick={close}
          aria-label={popupCloseLabel}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-text-muted hover:text-accent"
        >
          <X size={24} strokeWidth={1.75} />
        </button>

        <header className="flex flex-col gap-3 pr-12">
          <h2
            id="contact-popup-heading"
            className="text-2xl font-bold leading-tight text-text sm:text-3xl"
          >
            {popupHeading}
          </h2>
          <p className="text-base text-text-muted">{popupSubheading}</p>
        </header>

        <ContactFormFields
          // Force fresh-mount per open so a stale message body from the
          // previous context doesn't survive. openTick increments on each
          // open() call (provider-level), so opening twice from the same
          // CTA still resets — predictable state contract for the user.
          key={openTick}
          variant="popup"
          subject={context.subject}
          initialMessage={context.initialMessage}
          onSuccess={handleSuccess}
        />
      </div>
    </dialog>
  );
}
