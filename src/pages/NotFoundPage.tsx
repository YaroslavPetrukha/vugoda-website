import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import markUrl from '../../brand-assets/mark/mark.svg';

/**
 * 404 page — per AUDIT-COPY §4.21:
 * - h1 «такого розділу не існує» (precise) over «не знайдено» (1998-feel).
 * - Subhead joke «Можливо, він ще на стадії дозвільної документації.» — brand
 *   self-irony in stripped tone: references methodology terminology, no
 *   smile-asking, just self-aware system-developer voice.
 * - Two CTAs (home + projects) instead of one — gives recovery options,
 *   not just a single back-out.
 */
export default function NotFoundPage() {
  usePageTitle('404 — ВИГОДА');
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-8">
        <h1 className="font-bold tracking-tight text-6xl text-text text-center">
          404 — такого розділу не існує
        </h1>
        <p className="max-w-xl text-base text-text-muted text-center">
          Можливо, він ще на стадії дозвільної документації.
        </p>
        <img src={markUrl} alt="" aria-hidden="true" className="h-24 w-auto" />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <Link
            to="/"
            className="text-base font-medium text-accent underline underline-offset-4 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            На головну ↑
          </Link>
          <Link
            to="/projects"
            className="text-base font-medium text-accent underline underline-offset-4 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Усі 5 проєктів →
          </Link>
        </div>
      </div>
    </section>
  );
}
