import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden border-t border-slate-200/80">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(14,165,233,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="container relative z-10">
        <div className="text-center flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-[1.1] text-slate-900 rounded-3xl p-4">
            Ready to grow your<br /><span className="gradient-text">tour business?</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[500px] mt-2">
            Join 100+ tour companies already using Tourbin to manage bookings, staff, and customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link href="/pricing" className="btn-custom-primary !px-8 !py-4 text-base">
              View Packages
            </Link>
            <Link href="/contact" className="btn-custom-secondary !px-8 !py-4 text-base">
              Talk to Sales
            </Link>
          </div>
          <p className="text-text-3 text-xs mt-4">
            No credit card · No setup fees · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
