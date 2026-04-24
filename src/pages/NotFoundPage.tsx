import { Link } from 'react-router-dom';
import { MinimalCube } from '../components/brand/MinimalCube';

export default function NotFoundPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">
          404 — сторінку не знайдено
        </h1>
        <MinimalCube className="h-32 w-32" />
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
