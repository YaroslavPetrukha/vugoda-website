/**
 * @module components/forms/ContactPopupProvider
 *
 * Global popup state for the contact form modal. Mounted once at the App
 * root; any descendant calls `useContactPopup().open({ subject, message })`
 * to surface the form pre-populated with context.
 *
 * Why React context (not zustand / jotai / global event bus):
 *   - Two consumers (open trigger sites + the popup itself).
 *   - State is one tiny union — { open: false } | { open: true, ctx }.
 *   - Adding a state library for one-screen-of-state is overkill for an
 *     MVP corp site (CLAUDE.md «What NOT to Use» — no Redux/Zustand/Jotai).
 *
 * Component split:
 *   - `ContactPopupProvider` wraps the app, holds state.
 *   - `useContactPopup()` returns `{ open, close, isOpen, context }`.
 *   - `<ContactPopup />` (separate file) reads context, renders <dialog>.
 *
 * The provider stays passive — it doesn't render the popup itself, so the
 * popup module can be co-located with the form fields without circular
 * imports.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface ContactPopupContext {
  /** Inbox subject prefix — names the surface the lead came from. */
  subject?: string;
  /** Pre-filled body of the message field. */
  initialMessage?: string;
}

interface ContactPopupValue {
  isOpen: boolean;
  context: ContactPopupContext;
  open: (ctx?: ContactPopupContext) => void;
  close: () => void;
}

const Ctx = createContext<ContactPopupValue | null>(null);

export function ContactPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ContactPopupContext>({});

  const open = useCallback((ctx?: ContactPopupContext) => {
    setContext(ctx || {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Context cleared on next open — kept here so the close animation has
    // stable content during exit.
  }, []);

  const value = useMemo(
    () => ({ isOpen, context, open, close }),
    [isOpen, context, open, close],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContactPopup(): ContactPopupValue {
  const value = useContext(Ctx);
  if (!value) {
    throw new Error(
      'useContactPopup must be used within ContactPopupProvider — wrap your app in <ContactPopupProvider> at the root.',
    );
  }
  return value;
}
