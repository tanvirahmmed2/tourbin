import Link from 'next/link';
import { PricingCards } from '@/components/marketing/PricingCards';

export const metadata = {
  title: 'Pricing Plans — Tourbin',
  description: 'Plans that grow with your business. Start free for 14 days, no credit card required.',
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden pb-24">
      {/* Background glow orb */}
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Header */}
      <section className="py-16 pb-8">
        <div className="container relative z-10">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="badge badge-primary">SaaS Plans</div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-base text-text-2 max-w-[560px] leading-relaxed">
              All plans include a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-8 pb-16">
        <div className="container relative z-10">
          <PricingCards showDescriptions={true} />
        </div>
      </section>
    </div>
  );
}
