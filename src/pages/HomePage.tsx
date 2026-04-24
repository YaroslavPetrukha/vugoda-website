import markUrl from '../../brand-assets/mark/mark.svg';

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">ВИГОДА</h1>
        <img src={markUrl} alt="" aria-hidden="true" className="h-40 w-auto" />
      </div>
    </section>
  );
}
