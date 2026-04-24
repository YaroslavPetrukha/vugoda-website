import { MinimalCube } from '../components/brand/MinimalCube';

export default function ConstructionLogPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="font-bold tracking-tight text-6xl text-text">Хід будівництва</h1>
        <MinimalCube className="h-32 w-32" />
      </div>
    </section>
  );
}
