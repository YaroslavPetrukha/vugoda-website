import { Link } from 'react-router-dom';
import markUrl from '../../brand-assets/mark/mark.svg';

export default function NotFoundPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">
          404 — сторінку не знайдено
        </h1>
        <img src={markUrl} alt="" aria-hidden="true" className="h-24 w-auto" />
        <Link
          to="/"
          className="text-base font-medium text-accent underline underline-offset-4"
        >
          Повернутись до головної
        </Link>
      </div>
    </section>
  );
}
