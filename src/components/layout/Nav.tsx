import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';

/**
 * Top navigation: sticky, dark (bg-bg token), full-width with max-w-7xl inner
 * container. Four items per D-01/D-02: Logo · Проєкти · Хід будівництва · Контакт.
 * Active route marked with 2px accent underline (border-bottom technique, D-03).
 * Охоронне поле around logo: py-4 + px-6 on the container gives ~16-24px
 * clear space from nav edges (brand-system.md §2).
 */
export function Nav() {
  const linkBase =
    'relative inline-block pb-1 text-sm font-medium tracking-wide text-text transition-colors hover:text-accent';
  const linkActive = 'border-b-2 border-accent';
  const linkInactive = 'border-b-2 border-transparent';

  return (
    <header className="sticky top-0 z-50 w-full bg-bg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="ВИГОДА — на головну" className="flex items-center">
          <Logo className="h-7 w-auto" title="ВИГОДА" />
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Проєкти
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/construction-log"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Хід будівництва
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Контакт
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
