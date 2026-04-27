import { Link } from 'react-router-dom';
import { Send, MessageCircle, Globe } from 'lucide-react';
import { Logo } from '../brand/Logo';

/**
 * Site footer — visible on every route (NAV-01).
 * Three columns at >=1280px: (1) mini-logo + email + copyright year,
 * (2) repeat nav, (3) legal triplet (ТОВ / ЄДРПОУ / ліцензія).
 * Social icons are placeholders per D-08 (href="#", non-functional until launch).
 * Privacy-policy link intentionally absent per D-09 + PROJECT.md Out-of-Scope.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-bg-surface bg-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-12">
        {/* Column 1: brand + contact + copyright */}
        <div className="flex flex-col items-start gap-6">
          <Logo className="h-14 w-auto" title="ВИГОДА" />
          <a
            href="mailto:vygoda.sales@gmail.com"
            className="text-sm font-medium text-text hover:text-accent"
          >
            vygoda.sales@gmail.com
          </a>
          {/* P0-5 / AUDIT-UX §1.4.C: replace <a href="#"> with <button disabled>.
              The hash-href under HashRouter rewrote the URL on click and
              dropped the user to /. Disabled buttons are non-clickable and
              correctly communicate «coming soon». aria-label gives screen-
              readers the channel name; opacity-50 the visual disabled state. */}
          <div className="flex gap-4">
            <button
              type="button"
              disabled
              aria-label="Telegram (скоро)"
              className="text-text-muted opacity-50 cursor-not-allowed"
            >
              <Send size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              aria-label="Instagram (скоро)"
              className="text-text-muted opacity-50 cursor-not-allowed"
            >
              <MessageCircle size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              aria-label="Facebook (скоро)"
              className="text-text-muted opacity-50 cursor-not-allowed"
            >
              <Globe size={20} aria-hidden="true" />
            </button>
          </div>
          <p className="text-base text-text-muted">
            &copy; {year} ТОВ «БК ВИГОДА ГРУП»
          </p>
        </div>

        {/* Column 2: repeat nav */}
        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Навігація
          </h2>
          <Link to="/projects" className="text-sm font-medium text-text hover:text-accent">
            Проєкти
          </Link>
          <Link
            to="/construction-log"
            className="text-sm font-medium text-text hover:text-accent"
          >
            Хід будівництва
          </Link>
          <Link to="/contact" className="text-sm font-medium text-text hover:text-accent">
            Контакт
          </Link>
        </nav>

        {/* Column 3: legal block — NAV-01 mandatory facts */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Юридична інформація
          </h2>
          <p className="text-base text-text-muted">ТОВ «БК ВИГОДА ГРУП»</p>
          <p className="text-base text-text-muted">ЄДРПОУ 42016395</p>
          <p className="text-base text-text-muted">
            Ліцензія від 27.12.2019 (безстрокова)
          </p>
        </div>
      </div>
    </footer>
  );
}
