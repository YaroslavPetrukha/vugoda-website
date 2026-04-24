import markUrl from '../../brand-assets/mark/mark.svg';

export default function ContactPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">Контакт</h1>
        <img src={markUrl} alt="" aria-hidden="true" className="h-24 w-auto" />
      </div>
    </section>
  );
}
