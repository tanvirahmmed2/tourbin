import { TrustStats } from '@/components/card/TrustStats';

export default function TrustSection() {
  return (
    <section className="border-y border-slate-200/80 bg-bg-2 py-16">
      <div className="container">
        <TrustStats />
      </div>
    </section>
  );
}
